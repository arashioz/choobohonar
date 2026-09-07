<?php
/**
 * Plugin Name: ParsPek Path Proxy
 * Description: A locked-down reverse proxy for a single application path.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 */

defined( 'ABSPATH' ) || exit;

final class ParsPek_Path_Proxy {
	const OPTION = 'ppp56_settings';

	private $settings;

	public function __construct() {
		add_action( 'parse_request', array( $this, 'maybe_proxy' ), 0 );
		add_action( 'admin_menu', array( $this, 'admin_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	public static function activate() {
		add_option( self::OPTION, self::defaults() );
	}

	private static function defaults() {
		return array(
			'target_url' => 'http://109.122.246.24/56',
			'public_prefix' => '/56',
			'timeout' => 120,
			'enabled' => 0,
			'debug' => 0,
		);
	}

	private function settings() {
		if ( null === $this->settings ) {
			$this->settings = wp_parse_args( get_option( self::OPTION, array() ), self::defaults() );
		}
		return $this->settings;
	}

	public function register_settings() {
		register_setting( 'ppp56', self::OPTION, array( $this, 'sanitize_settings' ) );
		add_settings_section( 'ppp56_main', 'Proxy settings', '__return_false', 'ppp56' );
		foreach ( array( 'target_url' => 'Target URL', 'public_prefix' => 'Public prefix', 'timeout' => 'Timeout (seconds)', 'enabled' => 'Enable proxy', 'debug' => 'Debug logging' ) as $key => $label ) {
			add_settings_field( 'ppp56_' . $key, $label, array( $this, 'field' ), 'ppp56', 'ppp56_main', array( 'key' => $key ) );
		}
	}

	public function sanitize_settings( $input ) {
		$old = $this->settings();
		$out = self::defaults();
		$target = isset( $input['target_url'] ) ? esc_url_raw( trim( $input['target_url'] ) ) : '';
		if ( ! $this->valid_target( $target ) ) {
			add_settings_error( self::OPTION, 'invalid_target', 'Target URL must be one HTTP(S) public host or IP address.' );
			$target = $old['target_url'];
		}
		$out['target_url'] = untrailingslashit( $target );
		$prefix = isset( $input['public_prefix'] ) ? '/' . trim( (string) $input['public_prefix'], " /\\t\\n\\r\\0\\x0B" ) : '/56';
		if ( ! preg_match( '#^/[A-Za-z0-9._~-]+(?:/[A-Za-z0-9._~-]+)*$#', $prefix ) ) {
			add_settings_error( self::OPTION, 'invalid_prefix', 'Public prefix may contain only URL path characters.' );
			$prefix = $old['public_prefix'];
		}
		$out['public_prefix'] = untrailingslashit( $prefix );
		$out['timeout'] = min( 300, max( 5, absint( $input['timeout'] ?? 120 ) ) );
		$out['enabled'] = empty( $input['enabled'] ) ? 0 : 1;
		$out['debug'] = empty( $input['debug'] ) ? 0 : 1;
		$this->settings = $out;
		return $out;
	}

	public function field( $args ) {
		$s = $this->settings();
		$key = $args['key'];
		if ( in_array( $key, array( 'enabled', 'debug' ), true ) ) {
			printf( '<label><input type="checkbox" name="%1$s[%2$s]" value="1" %3$s> %4$s</label>', esc_attr( self::OPTION ), esc_attr( $key ), checked( ! empty( $s[ $key ] ), true, false ), esc_html( 'Yes' ) );
			return;
		}
		$type = 'timeout' === $key ? 'number' : 'text';
		printf( '<input class="regular-text" type="%1$s" name="%2$s[%3$s]" value="%4$s" %5$s>', esc_attr( $type ), esc_attr( self::OPTION ), esc_attr( $key ), esc_attr( $s[ $key ] ), 'timeout' === $key ? 'min="5" max="300"' : '' );
	}

	public function admin_menu() {
		add_options_page( 'ParsPek Path Proxy', 'ParsPek Path Proxy', 'manage_options', 'ppp56', array( $this, 'settings_page' ) );
	}

	public function settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'You do not have permission to access this page.' ) );
		}
		echo '<div class="wrap"><h1>ParsPek Path Proxy</h1><form method="post" action="options.php">';
		settings_fields( 'ppp56' );
		do_settings_sections( 'ppp56' );
		submit_button();
		echo '</form><p>Only requests under the configured public prefix are proxied. The target cannot be controlled by visitors.</p></div>';
	}

	public function maybe_proxy( $wp ) {
		if ( is_admin() || wp_doing_ajax() || defined( 'REST_REQUEST' ) && REST_REQUEST ) {
			return;
		}
		$s = $this->settings();
		if ( empty( $s['enabled'] ) ) {
			return;
		}
		$path = (string) wp_parse_url( $_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH );
		$prefix = $s['public_prefix'];
		if ( $path !== $prefix && 0 !== strpos( $path, $prefix . '/' ) ) {
			return;
		}
		$this->dispatch( $path );
		exit;
	}

	private function dispatch( $public_path ) {
		$s = $this->settings();
		$suffix = substr( $public_path, strlen( $s['public_prefix'] ) );
		$target = untrailingslashit( $s['target_url'] ) . ( '' === $suffix ? '' : '/' . ltrim( $suffix, '/' ) );
		$query = $_SERVER['QUERY_STRING'] ?? '';
		if ( '' !== $query ) {
			$target .= '?' . $query;
		}
		if ( ! $this->valid_target( preg_replace( '/[?].*$/', '', $target ) ) ) {
			$this->error( 502, 'Invalid proxy target.' );
		}
		if ( ! function_exists( 'curl_init' ) ) {
			$this->error( 502, 'The server does not have the PHP cURL extension required by this proxy.' );
		}

		$headers_sent = false;
		$status = 502;
		$headers = $this->request_headers();
		$body = file_get_contents( 'php://input' );
		$ch = curl_init( $target );
		curl_setopt_array( $ch, array(
			CURLOPT_CUSTOMREQUEST => strtoupper( sanitize_key( $_SERVER['REQUEST_METHOD'] ?? 'GET' ) ),
			CURLOPT_HTTPHEADER => $headers,
			CURLOPT_POSTFIELDS => in_array( strtoupper( $_SERVER['REQUEST_METHOD'] ?? 'GET' ), array( 'GET', 'HEAD' ), true ) ? null : $body,
			CURLOPT_FOLLOWLOCATION => false,
			CURLOPT_RETURNTRANSFER => false,
			CURLOPT_HEADER => false,
			CURLOPT_CONNECTTIMEOUT => min( 30, (int) $s['timeout'] ),
			CURLOPT_TIMEOUT => (int) $s['timeout'],
			CURLOPT_WRITEFUNCTION => function( $curl, $data ) {
				echo $data; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				return strlen( $data );
			},
			CURLOPT_HEADERFUNCTION => function( $curl, $line ) use ( &$headers_sent, &$status ) {
				$trimmed = trim( $line );
				if ( preg_match( '#^HTTP/\\S+\\s+(\\d{3})#i', $trimmed, $m ) ) {
					$status = (int) $m[1];
					return strlen( $line );
				}
				if ( '' === $trimmed ) {
					if ( ! $headers_sent ) {
						status_header( $status );
						$headers_sent = true;
					}
					return strlen( $line );
				}
				$this->forward_response_header( $trimmed );
				return strlen( $line );
			},
		) );
		$ok = curl_exec( $ch );
		$error = curl_error( $ch );
		$code = (int) curl_getinfo( $ch, CURLINFO_RESPONSE_CODE );
		curl_close( $ch );
		if ( false === $ok && ! $headers_sent ) {
			$this->log( 'Upstream request failed: ' . $error );
			$this->error( 502, 'The application server is temporarily unavailable.' );
		}
		if ( ! $headers_sent ) {
			status_header( $code ?: 502 );
		}
	}

	private function request_headers() {
		$blocked = array( 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'content-length', 'host', 'accept-encoding' );
		$out = array();
		foreach ( $_SERVER as $key => $value ) {
			if ( 0 !== strpos( $key, 'HTTP_' ) || ! is_string( $value ) ) {
				continue;
			}
			$name = str_replace( ' ', '-', ucwords( strtolower( str_replace( '_', ' ', substr( $key, 5 ) ) ) ) );
			if ( in_array( strtolower( $name ), $blocked, true ) || preg_match( '/[\\r\\n]/', $value ) ) {
				continue;
			}
			$out[] = $name . ': ' . $value;
		}
		$target = wp_parse_url( $this->settings()['target_url'] );
		$host = $target['host'] . ( isset( $target['port'] ) ? ':' . $target['port'] : '' );
		$client = sanitize_text_field( $_SERVER['REMOTE_ADDR'] ?? '' );
		$public_host = sanitize_text_field( $_SERVER['HTTP_HOST'] ?? '' );
		$out[] = 'Host: ' . $host;
		$out[] = 'X-Real-IP: ' . $client;
		$out[] = 'X-Forwarded-For: ' . $client;
		$out[] = 'X-Forwarded-Proto: ' . ( is_ssl() ? 'https' : 'http' );
		$out[] = 'X-Forwarded-Host: ' . $public_host;
		// Some shared hosts alter Content-Encoding headers. Request an uncompressed
		// upstream response so proxied HTML, CSS and JavaScript cannot be corrupted.
		$out[] = 'Accept-Encoding: identity';
		return $out;
	}

	private function forward_response_header( $line ) {
		$parts = explode( ':', $line, 2 );
		if ( 2 !== count( $parts ) ) {
			return;
		}
		$name = trim( $parts[0] );
		$value = trim( $parts[1] );
		$lower = strtolower( $name );
		if ( in_array( $lower, array( 'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade', 'content-length' ), true ) || preg_match( '/[\\r\\n]/', $value ) ) {
			return;
		}
		if ( 'location' === $lower ) {
			$value = $this->rewrite_location( $value );
		} elseif ( 'set-cookie' === $lower ) {
			$value = $this->rewrite_cookie( $value );
		}
		header( $name . ': ' . $value, false );
	}

	private function rewrite_location( $location ) {
		$s = $this->settings();
		$target = untrailingslashit( $s['target_url'] );
		$origin = ( wp_parse_url( $target, PHP_URL_SCHEME ) ?: 'http' ) . '://' . wp_parse_url( $target, PHP_URL_HOST );
		if ( wp_parse_url( $target, PHP_URL_PORT ) ) {
			$origin .= ':' . wp_parse_url( $target, PHP_URL_PORT );
		}
		$public = ( is_ssl() ? 'https' : 'http' ) . '://' . sanitize_text_field( $_SERVER['HTTP_HOST'] ?? '' ) . $s['public_prefix'];
		if ( 0 === strpos( $location, $target ) ) {
			return $public . substr( $location, strlen( $target ) );
		}
		if ( 0 === strpos( $location, $origin . '/' ) ) {
			return $public . '/' . ltrim( substr( $location, strlen( $origin ) ), '/' );
		}
		return $location;
	}

	private function rewrite_cookie( $cookie ) {
		$prefix = $this->settings()['public_prefix'];
		$cookie = preg_replace( '/;\\s*Domain=[^;]*/i', '', $cookie );
		return preg_replace( '#;\\s*Path=/($|;)#i', '; Path=' . $prefix . '/$1', $cookie );
	}

	private function valid_target( $url ) {
		$p = wp_parse_url( $url );
		if ( empty( $p['scheme'] ) || ! in_array( strtolower( $p['scheme'] ), array( 'http', 'https' ), true ) || empty( $p['host'] ) || isset( $p['user'] ) || isset( $p['pass'] ) ) {
			return false;
		}
		$host = $p['host'];
		$ip = filter_var( $host, FILTER_VALIDATE_IP );
		if ( $ip ) {
			return (bool) filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE );
		}
		if ( ! preg_match( '/^[a-z0-9.-]+$/i', $host ) || 'localhost' === strtolower( $host ) ) {
			return false;
		}
		$resolved = gethostbyname( $host );
		return $resolved !== $host && (bool) filter_var( $resolved, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE );
	}

	private function error( $status, $message ) {
		status_header( $status );
		nocache_headers();
		header( 'Content-Type: text/html; charset=utf-8' );
		echo '<!doctype html><html><head><meta charset="utf-8"><title>Service unavailable</title></head><body><h1>Service unavailable</h1><p>' . esc_html( $message ) . '</p></body></html>';
		exit;
	}

	private function log( $message ) {
		if ( ! empty( $this->settings()['debug'] ) && defined( 'WP_DEBUG_LOG' ) && WP_DEBUG_LOG ) {
			error_log( '[ParsPek Path Proxy] ' . $message ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
		}
	}
}

register_activation_hook( __FILE__, array( 'ParsPek_Path_Proxy', 'activate' ) );
new ParsPek_Path_Proxy();

export type UploadProgress = {
  loaded: number;
  total: number;
  percent: number;
};

/** Upload one media file and report byte-level progress to the caller. */
export function uploadMedia(
  file: File,
  onProgress?: (progress: UploadProgress) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", "/admin/api/media");
    request.withCredentials = true;

    request.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress?.({
        loaded: event.loaded,
        total: event.total,
        percent: Math.min(100, Math.round((event.loaded / event.total) * 100)),
      });
    });

    request.addEventListener("error", () => reject(new Error(`آپلود «${file.name}» ناموفق بود`)));
    request.addEventListener("abort", () => reject(new Error(`آپلود «${file.name}» لغو شد`)));
    request.addEventListener("load", () => {
      let result: { url?: string; message?: string } = {};
      try {
        result = JSON.parse(request.responseText) as typeof result;
      } catch {
        reject(new Error(`آپلود «${file.name}» ناموفق بود (پاسخ سرور: ${request.status})`));
        return;
      }

      if (request.status < 200 || request.status >= 300 || !result.url) {
        reject(new Error(result.message || `آپلود «${file.name}» ناموفق بود`));
        return;
      }

      // The backend deliberately returns a same-origin URL such as
      // /uploads/<filename>. Passing it unchanged keeps it valid behind any
      // production domain or IP and lets nginx serve the shared volume.
      resolve(result.url);
    });

    const body = new FormData();
    body.append("file", file);
    request.send(body);
  });
}


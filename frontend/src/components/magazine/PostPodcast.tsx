import type { PodcastEpisode } from "@/data/posts/types";
import FadeUp from "@/components/motion/FadeUp";

export default function PostPodcast({ episode }: { episode: PodcastEpisode }) {
  return (
    <FadeUp className="mt-20 rounded-sm border border-forest/10 bg-forest/[0.03] p-8 md:p-10">
      <div className="flex items-start gap-5">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest text-paper"
          aria-hidden
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="eyebrow text-brick">نسخه صوتی</p>
          <h2 className="mt-2 text-xl font-light tracking-tight text-forest md:text-2xl">
            {episode.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-forest/70">{episode.description}</p>
          <p className="mt-4 text-sm text-forest/50">مدت: {episode.duration}</p>

          {episode.audioUrl ? (
            <audio controls className="mt-6 w-full" preload="none">
              <source src={episode.audioUrl} type="audio/mpeg" />
              مرورگر شما از پخش صوت پشتیبانی نمی‌کند.
            </audio>
          ) : (
            <p className="mt-5 text-sm text-forest/45">
              نسخه صوتی این مقاله به‌زودی در دسترس قرار می‌گیرد.
            </p>
          )}
        </div>
      </div>
    </FadeUp>
  );
}

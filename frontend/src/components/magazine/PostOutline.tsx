import FadeUp from "@/components/motion/FadeUp";

export default function PostOutline({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <FadeUp className="mt-10 rounded-sm border border-forest/10 bg-paper p-6 md:p-8">
      <p className="eyebrow text-brick">فهرست مطالب</p>
      <ol className="mt-4 flex flex-col gap-2.5">
        {items.map((item, i) => (
          <li key={item} className="flex items-baseline gap-3 text-forest/75">
            <span className="text-sm tabular-nums text-forest/35">{i + 1}.</span>
            <span className="text-base leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </FadeUp>
  );
}

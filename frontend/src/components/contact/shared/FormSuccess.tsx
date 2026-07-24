import Link from "next/link";
import Button from "@/components/ui/Button";

export default function FormSuccess({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[14rem] flex-col items-start justify-center py-4">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-forest text-lg text-peach">✓</div>
      <h2 className="text-2xl font-light tracking-tight text-forest">{title}</h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-forest/65">{description}</p>
      <div className="mt-6 flex flex-wrap gap-4">
        <Button href="/contact" variant="primary">
          بازگشت به ارتباط با ما
        </Button>
        <Link href="/" className="inline-flex items-center text-sm text-forest/60 transition-colors hover:text-forest">
          صفحه اصلی
        </Link>
      </div>
    </div>
  );
}

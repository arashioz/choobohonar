import BrandbookLayoutShell from "@/components/brandbook/layout/BrandbookLayoutShell";

export default function BrandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BrandbookLayoutShell>{children}</BrandbookLayoutShell>;
}


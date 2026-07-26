import ChatPanel from "@/components/brandbook/layout/ChatPanel";
import BrandbookMotionShell from "@/components/brandbook/layout/BrandbookMotionShell";

export default function BrandbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrandbookMotionShell>
      <div className="min-h-screen bg-forest relative">
        <main className="min-h-screen">
          {children}
        </main>

        <ChatPanel />
      </div>
    </BrandbookMotionShell>
  );
}


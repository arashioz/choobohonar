import { notFound } from "next/navigation";
import EntryEditor from "@/components/dashboard/EntryEditor";
import { resourceToKind, type ResourcePath } from "@/lib/cms";

export default async function NewResourcePage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!(kind in resourceToKind)) notFound();
  const resourcePath = kind as ResourcePath;
  return <EntryEditor kind={resourceToKind[resourcePath]} resourcePath={resourcePath} />;
}

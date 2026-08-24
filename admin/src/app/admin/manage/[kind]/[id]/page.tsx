import { notFound } from "next/navigation";
import EntryEditor from "@/components/dashboard/EntryEditor";
import { resourceToKind, type ResourcePath } from "@/lib/cms";
import EditShopProduct from "@/components/shop/EditShopProduct";

export default async function EditResourcePage({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!(kind in resourceToKind)) notFound();
  if (kind === "products") return <EditShopProduct id={id} />;
  const resourcePath = kind as ResourcePath;
  return <EntryEditor kind={resourceToKind[resourcePath]} resourcePath={resourcePath} entryId={id} />;
}

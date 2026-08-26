import EntryEditor from "@/components/dashboard/EntryEditor";
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <EntryEditor kind="page" entryId={id} />; }

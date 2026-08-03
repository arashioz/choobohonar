import EntryEditor from "@/components/dashboard/EntryEditor";
export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <EntryEditor kind="article" entryId={id} />; }

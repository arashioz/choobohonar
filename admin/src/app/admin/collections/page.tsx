import { redirect } from "next/navigation";
export const metadata = { title: "مدیریت کالکشن‌ها" };

// Keep this old address for bookmarks, but use the CMS workspace as the
// single source of truth for every collection.
export default function CollectionsPage() { redirect("/admin/manage/collections"); }

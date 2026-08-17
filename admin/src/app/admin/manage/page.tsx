import type { Metadata } from "next";
import ManageOverview from "@/components/dashboard/ManageOverview";

export const metadata: Metadata = { title: "مدیریت آثار" };
export default function ManageHubPage() { return <ManageOverview />; }

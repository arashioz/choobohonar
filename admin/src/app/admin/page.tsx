import type { Metadata } from "next";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

export const metadata: Metadata = { title: "نمای کلی" };
export default function AdminHomePage() { return <DashboardOverview />; }

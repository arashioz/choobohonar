import { redirect } from "next/navigation";

export default function AdminShopInvoicesRedirectPage() {
  redirect("/admin/shop?tab=invoices");
}

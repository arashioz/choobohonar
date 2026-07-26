import { redirect } from "next/navigation";

/** Legacy path — brandbook lives at /admin/brandbook (auth required). */
export default function BrandbookLegacyRedirect() {
  redirect("/admin/brandbook");
}

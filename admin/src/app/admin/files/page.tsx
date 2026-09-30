import type { Metadata } from "next";
import FileManagerWorkspace from "@/components/files/FileManagerWorkspace";

export const metadata: Metadata = {
  title: "فایل منیجر | پنل مدیریت چوب و هنر",
  description: "مدیریت فایل‌ها، پوشه‌ها، تصاویر و رسانه‌های سرور",
};

export default function FileManagerPage() {
  return <FileManagerWorkspace />;
}

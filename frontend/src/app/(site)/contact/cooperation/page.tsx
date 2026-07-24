import type { Metadata } from "next";
import ContactFormLayout from "@/components/contact/ContactFormLayout";
import CooperationForm from "@/components/contact/CooperationForm";
import { contactForms } from "@/data/contact-forms";

const form = contactForms.find((f) => f.id === "cooperation")!;

export const metadata: Metadata = {
  title: "درخواست همکاری | ارتباط با ما | خانه چوب و هنر",
  description: form.description,
};

export default function CooperationRequestPage() {
  return (
    <ContactFormLayout form={form}>
      <CooperationForm />
    </ContactFormLayout>
  );
}

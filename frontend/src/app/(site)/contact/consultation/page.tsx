import type { Metadata } from "next";
import ContactFormLayout from "@/components/contact/ContactFormLayout";
import ConsultationForm from "@/components/contact/ConsultationForm";
import { contactForms } from "@/data/contact-forms";

const form = contactForms.find((f) => f.id === "consultation")!;

export const metadata: Metadata = {
  title: "درخواست مشاوره | ارتباط با ما | خانه چوب و هنر",
  description: form.description,
};

export default function ConsultationRequestPage() {
  return (
    <ContactFormLayout form={form}>
      <ConsultationForm />
    </ContactFormLayout>
  );
}

import type { Metadata } from "next";
import ContactFormLayout from "@/components/contact/ContactFormLayout";
import RepresentationForm from "@/components/contact/RepresentationForm";
import { contactForms } from "@/data/contact-forms";

const form = contactForms.find((f) => f.id === "representation")!;

export const metadata: Metadata = {
  title: "درخواست نمایندگی | ارتباط با ما | خانه چوب و هنر",
  description: form.description,
};

export default function RepresentationRequestPage() {
  return (
    <ContactFormLayout form={form}>
      <RepresentationForm />
    </ContactFormLayout>
  );
}

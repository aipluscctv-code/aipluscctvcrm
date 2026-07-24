import { ContactForm } from "../ContactForm";
import { createContact } from "../actions";

export default function NewContactPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">새 연락처</h1>
      <ContactForm action={createContact} />
    </div>
  );
}

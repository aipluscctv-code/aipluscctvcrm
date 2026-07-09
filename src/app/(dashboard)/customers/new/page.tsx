import { CustomerForm } from "../CustomerForm";
import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">새 고객</h1>
      <CustomerForm action={createCustomer} />
    </div>
  );
}

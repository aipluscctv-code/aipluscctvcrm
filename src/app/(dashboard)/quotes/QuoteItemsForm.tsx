"use client";

import { useState } from "react";
import { computeTotals, itemAmount, type QuoteItem } from "@/lib/quote";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";
import { SubmitButton } from "@/components/SubmitButton";

const EMPTY_ITEM: QuoteItem = { name: "", model: "", spec: "", qty: 1, unitPrice: 0 };

export function QuoteItemsForm({
  customerOptions,
  defaultCustomerId,
  action,
}: {
  customerOptions: { id: string; name: string }[];
  defaultCustomerId: string;
  action: (formData: FormData) => void;
}) {
  const [items, setItems] = useState<QuoteItem[]>([{ ...EMPTY_ITEM }]);
  const { subtotal, vat, total } = computeTotals(items);

  function updateItem(index: number, patch: Partial<QuoteItem>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addRow() {
    setItems((prev) => [...prev, { ...EMPTY_ITEM }]);
  }

  function removeRow(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="items" value={JSON.stringify(items)} />

      <div className="max-w-sm">
        <label className={labelClass}>고객 *</label>
        <select name="customerId" defaultValue={defaultCustomerId} required className={inputClass}>
          <option value="" disabled>
            고객 선택
          </option>
          {customerOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-md border border-black/10 dark:border-white/15">
        <table className="w-full text-sm">
          <thead className="bg-black/5 dark:bg-white/10 text-left">
            <tr>
              <th className="px-2 py-2">품명</th>
              <th className="px-2 py-2">모델명</th>
              <th className="px-2 py-2">규격</th>
              <th className="px-2 py-2 w-20">수량</th>
              <th className="px-2 py-2 w-32">단가</th>
              <th className="px-2 py-2 w-32">금액</th>
              <th className="px-2 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-t border-black/10 dark:border-white/10">
                <td className="px-2 py-1">
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => updateItem(i, { name: e.target.value })}
                    placeholder="CCTV 카메라"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className={inputClass}
                    value={item.model}
                    onChange={(e) => updateItem(i, { model: e.target.value })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className={inputClass}
                    value={item.spec}
                    onChange={(e) => updateItem(i, { spec: e.target.value })}
                    placeholder="실내/실외"
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={item.qty}
                    onChange={(e) => updateItem(i, { qty: Number(e.target.value) })}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, { unitPrice: Number(e.target.value) })}
                  />
                </td>
                <td className="px-2 py-1 text-right">{itemAmount(item).toLocaleString()}</td>
                <td className="px-2 py-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="행 삭제"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="button" onClick={addRow} className={buttonSecondaryClass + " self-start"}>
        + 품목 추가
      </button>

      <div className="max-w-xs ml-auto flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">공급가액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">부가세(10%)</span>
          <span>{vat.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between font-semibold text-base">
          <span>합계</span>
          <span>{total.toLocaleString()}원</span>
        </div>
      </div>

      <SubmitButton pendingText="저장 중..." className={buttonPrimaryClass + " self-start"}>
        견적서 저장
      </SubmitButton>
    </form>
  );
}

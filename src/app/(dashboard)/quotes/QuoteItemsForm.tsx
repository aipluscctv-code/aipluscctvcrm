"use client";

import { useState } from "react";
import { computeTotals, itemAmount, QUOTE_CATALOG, type QuoteItem } from "@/lib/quote";
import { KT_PRICE_LIST } from "@/lib/kt-price-list";
import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { Modal } from "@/components/Modal";

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
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [priceListOpen, setPriceListOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
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

  function addFromCatalog(name: string) {
    setItems((prev) => [...prev, { ...EMPTY_ITEM, name }]);
    setRecentlyAdded(name);
    setTimeout(() => setRecentlyAdded((current) => (current === name ? null : current)), 1200);
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

      <div className="overflow-x-auto rounded-2xl border border-hairline">
        <table className="w-full text-sm">
          <thead className="bg-surface-card text-left">
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
              <tr key={i} className="border-t border-hairline">
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
                    className="text-muted-soft hover:text-error"
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

      <div className="flex gap-2 flex-wrap">
        <button type="button" onClick={addRow} className={buttonSecondaryClass}>
          + 품목 추가
        </button>
        <button type="button" onClick={() => setCatalogOpen(true)} className={buttonSecondaryClass}>
          카탈로그에서 추가
        </button>
        <button type="button" onClick={() => setPriceListOpen(true)} className={buttonSecondaryClass}>
          단가표
        </button>
      </div>

      {catalogOpen && (
        <Modal
          title="품목 카탈로그"
          onClose={() => setCatalogOpen(false)}
          footer={
            <button
              type="button"
              onClick={() => setCatalogOpen(false)}
              className={buttonPrimaryClass + " w-full sm:w-auto"}
            >
              선택 완료 (닫기)
            </button>
          }
        >
          {QUOTE_CATALOG.map((group) => (
            <div key={group.category} className="mb-4">
              <h3 className="mb-2 text-xs font-semibold text-muted">{group.category}</h3>
              <div className="flex flex-col gap-1">
                {group.items.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => addFromCatalog(name)}
                    className="flex items-center justify-between rounded-xl border border-hairline px-3 py-3 text-left text-sm hover:bg-surface-soft"
                  >
                    <span>{name}</span>
                    {recentlyAdded === name ? (
                      <span className="text-xs font-medium text-brand-teal">✓ 추가됨</span>
                    ) : (
                      <span className="text-lg text-muted">+</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Modal>
      )}

      {priceListOpen && (
        <Modal title="KT 단가표 (참고용)" onClose={() => setPriceListOpen(false)}>
          <p className="mb-3 text-xs text-muted">
            조회 전용입니다 — 눌러도 견적서에 자동으로 입력되지 않습니다. 항목명/단가는 직접
            타이핑해서 사용하세요.
          </p>
          {KT_PRICE_LIST.map((group) => (
            <div key={group.category} className="mb-4">
              <h3 className="mb-2 text-xs font-semibold text-muted">{group.category}</h3>
              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <div
                    key={item.model}
                    className="rounded-xl border border-hairline px-3 py-2 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="shrink-0 font-semibold text-ink">
                        {typeof item.price === "number"
                          ? `${item.price.toLocaleString()}원`
                          : item.price}
                      </span>
                    </div>
                    <div className="text-xs text-muted">
                      {item.model}
                      {item.spec ? ` · ${item.spec}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Modal>
      )}

      <div className="max-w-xs ml-auto flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted">공급가액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted">부가세(10%)</span>
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

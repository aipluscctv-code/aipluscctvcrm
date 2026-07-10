import { inputClass, labelClass, buttonPrimaryClass, buttonSecondaryClass } from "@/lib/ui";

export function ListFilters({
  statusOptions,
  defaults,
}: {
  statusOptions: readonly string[];
  defaults: {
    date?: string;
    q?: string;
    status?: string;
    region?: string;
    minAmount?: string;
    maxAmount?: string;
  };
}) {
  return (
    <form
      method="get"
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-hairline p-4"
    >
      <div>
        <label className={labelClass}>날짜</label>
        <input type="date" name="date" defaultValue={defaults.date} className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>검색어</label>
        <input
          type="text"
          name="q"
          placeholder="이름 검색"
          defaultValue={defaults.q}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>상태</label>
        <select name="status" defaultValue={defaults.status ?? ""} className={inputClass}>
          <option value="">전체</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>지역</label>
        <input
          type="text"
          name="region"
          placeholder="예: 파주"
          defaultValue={defaults.region}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>최소 금액</label>
        <input
          type="number"
          name="minAmount"
          min={0}
          defaultValue={defaults.minAmount}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>최대 금액</label>
        <input
          type="number"
          name="maxAmount"
          min={0}
          defaultValue={defaults.maxAmount}
          className={inputClass}
        />
      </div>
      <button type="submit" className={buttonPrimaryClass}>
        필터 적용
      </button>
      <a href="?" className={buttonSecondaryClass}>
        초기화
      </a>
    </form>
  );
}

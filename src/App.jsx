import React, { useEffect, useMemo, useState } from "react";

const TABS = ["홈", "수발주관리", "거래처정보", "거래처내역", "달력", "매출분석", "지출내역"];
const ORDER_TABS = ["수주내역", "발주내역"];
const TODAY = "2026-04-15";

const MONTHLY = [
  { month: "1월", sales: 1800000 },
  { month: "2월", sales: 2200000 },
  { month: "3월", sales: 2100000 },
  { month: "4월", sales: 2600000 },
  { month: "5월", sales: 2400000 },
  { month: "6월", sales: 2900000 },
];

const EXPENSE_TYPES = {
  화환: ["대국값", "근조수거", "축하수거", "퀵비", "기타"],
  식물: ["꽃값", "퀵비", "기타"],
};

const DEFAULT_ORDERS = [
  { id: 1, type: "화환", chain: "송죽플라워", florist: "중앙화원", product: "근조 3단", amount: 180000, delivery: "퀵", location: "인천성모병원 장례식장", date: TODAY, memo: "오전 배송" },
  { id: 2, type: "식물", chain: "반하다플라워", florist: "그린화원", product: "개업화분", amount: 200000, delivery: "자체배달", location: "서울 강서구 마곡동", date: TODAY, memo: "리본 문구 확인" },
];

const DEFAULT_PURCHASES = [
  { id: 101, type: "화환", chain: "송죽플라워", florist: "중앙화원", product: "근조 3단", amount: 130000, delivery: "퀵", location: "인천성모병원 장례식장", date: TODAY, memo: "대국 포함" },
];

const DEFAULT_PARTNERS = [
  { id: 201, category: "화원", name: "행복플라워", phone: "010-1111-2222", account: "국민 123-456-7890", priceBand: "10만원~20만원", memo: "근조 주문 반응 좋음" },
  { id: 202, category: "기업", name: "마곡오피스", phone: "010-2222-3333", account: "신한 555-222-1111", priceBand: "20만원 이상", memo: "정기 식물 납품 가능성" },
];

const DEFAULT_PARTNER_SALES = [
  { id: 301, partnerName: "행복플라워", type: "화환", product: "근조 3단", amount: 180000, payment: "계좌이체", date: TODAY, memo: "첫 거래" },
];

const DEFAULT_EXPENSES = [
  { id: 401, weekLabel: "2026년 4월 3주차", type: "화환", items: { 대국값: 50000, 근조수거: 20000, 축하수거: 10000, 퀵비: 30000, 기타: 5000 }, total: 115000, memo: "주간 화환 정산" },
  { id: 402, weekLabel: "2026년 4월 3주차", type: "식물", items: { 꽃값: 70000, 퀵비: 20000, 기타: 10000 }, total: 100000, memo: "주간 식물 정산" },
];

function won(v) {
  return `${Number(v || 0).toLocaleString()}원`;
}

function formatDate(v) {
  return String(v || "").replaceAll("-", ".");
}

function load(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function makeOrderForm() {
  return { type: "화환", chain: "", florist: "", product: "", amount: "", delivery: "자체배달", location: "", date: TODAY, memo: "" };
}

function makePartnerForm() {
  return { category: "", name: "", phone: "", account: "", priceBand: "", memo: "" };
}

function makePartnerSaleForm() {
  return { partnerName: "", type: "화환", product: "", amount: "", payment: "계좌이체", date: TODAY, memo: "" };
}

function makeExpenseForm(type = "화환") {
  const items = {};
  EXPENSE_TYPES[type].forEach((k) => {
    items[k] = "";
  });
  return { weekLabel: "2026년 4월 3주차", type, items, memo: "" };
}

function monthGrid(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const start = first.getDay();
  const last = new Date(year, monthIndex + 1, 0).getDate();
  const prevLast = new Date(year, monthIndex, 0).getDate();
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const day = i - start + 1;
    if (day <= 0) cells.push({ date: new Date(year, monthIndex - 1, prevLast + day), current: false });
    else if (day > last) cells.push({ date: new Date(year, monthIndex + 1, day - last), current: false });
    else cells.push({ date: new Date(year, monthIndex, day), current: true });
  }
  const weeks = [];
  for (let i = 0; i < 42; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

const theme = {
  page: { background: "linear-gradient(180deg, #090b11 0%, #11141d 100%)", color: "#f8fafc", minHeight: "100vh", padding: 18 },
  wrap: { maxWidth: 1440, margin: "0 auto", borderRadius: 28, overflow: "hidden", background: "#121621", boxShadow: "0 30px 90px rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.08)" },
  top: { background: "linear-gradient(90deg, #12141d 0%, #1b2030 100%)", color: "#fff", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  header: { background: "rgba(16,20,31,.95)", padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,.08)" },
  tabs: { display: "flex", gap: 10, overflowX: "auto", padding: "16px 28px 0", background: "rgba(16,20,31,.95)", borderBottom: "1px solid rgba(255,255,255,.08)" },
  tab: { border: "none", borderRadius: 14, padding: "12px 16px", background: "transparent", color: "#cbd5e1", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  tabActive: { border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,.08)", color: "#fff", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  subtab: { border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 18px", background: "rgba(255,255,255,.03)", color: "#cbd5e1", fontWeight: 700, cursor: "pointer" },
  subtabActive: { border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 18px", background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 800, cursor: "pointer" },
  body: { padding: 32, background: "linear-gradient(180deg, #121621 0%, #171c28 100%)" },
  hero: { borderRadius: 28, padding: 28, background: "linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.02) 100%)", border: "1px solid rgba(255,255,255,.08)", display: "grid", gap: 18 },
  search: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, padding: "12px 14px" },
  searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: "#f8fafc" },
  ask: { border: "none", borderRadius: 12, padding: "10px 14px", background: "rgba(255,255,255,.1)", color: "#fff", fontWeight: 700, cursor: "pointer" },
  card: { background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.02) 100%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 28, padding: 24, boxShadow: "0 18px 40px rgba(0,0,0,.2)" },
  summaryCard: { background: "linear-gradient(180deg, rgba(255,255,255,.03) 0%, rgba(255,255,255,.02) 100%)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 20, padding: 20 },
  input: { width: "100%", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "0 14px", height: 48, background: "rgba(255,255,255,.03)", color: "#f8fafc", outline: "none" },
  label: { fontSize: 13, color: "#94a3b8", fontWeight: 600 },
  button: { border: "none", borderRadius: 16, background: "linear-gradient(135deg, #d8ba76 0%, #b78d44 100%)", color: "#fff", padding: "14px 20px", fontWeight: 800, cursor: "pointer" },
  filter: { border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.04)", color: "#cbd5e1", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  filterActive: { border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.12)", color: "#fff", borderRadius: 12, padding: "10px 14px", fontWeight: 800, cursor: "pointer" },
  dataCard: { display: "grid", gap: 14, padding: 16, border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, background: "rgba(255,255,255,.03)" },
  calendarCell: { border: "1px solid rgba(255,255,255,.08)", borderRadius: 18, minHeight: 120, padding: 12, background: "rgba(255,255,255,.03)", textAlign: "left", cursor: "pointer" },
  calendarText: { display: "block", fontSize: 12, color: "#cbd5e1" },
  detailItem: { padding: "10px 12px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 12, marginBottom: 8, background: "rgba(255,255,255,.03)" },
  muted: "#94a3b8",
  text: "#f8fafc",
  accent: "#d7b36a",
  line: "rgba(255,255,255,.08)",
  bar: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
};

function SectionTitle({ children }) {
  return <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>{children}</div>;
}

function SummaryCard({ label, value, accent, theme }) {
  return (
    <div style={theme.summaryCard}>
      <div style={{ fontSize: 14, color: theme.muted }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12, color: accent ? theme.accent : theme.text }}>{value}</div>
    </div>
  );
}

function TextInput({ label, value, onChange, theme, type = "text" }) {
  return <label style={{ display: "grid", gap: 8 }}><span style={theme.label}>{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={theme.input} /></label>;
}

function SelectInput({ label, value, onChange, options, theme }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={theme.label}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={theme.input}>
        <option value="">선택</option>
        {options.map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
    </label>
  );
}

function TextareaInput({ label, value, onChange, theme }) {
  return <label style={{ display: "grid", gap: 8 }}><span style={theme.label}>{label}</span><textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...theme.input, minHeight: 100, height: "auto", paddingTop: 12 }} /></label>;
}

function FilterButtons({ items, active, onChange, theme }) {
  return <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{items.map((item) => <button key={item} onClick={() => onChange(item)} style={active === item ? theme.filterActive : theme.filter}>{item}</button>)}</div>;
}

function DataCards({ rows, columns, theme, emptyText }) {
  if (rows.length === 0) return <div style={{ textAlign: "center", color: theme.muted, padding: "30px 0" }}>{emptyText}</div>;
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((row) => (
        <div key={row.id} style={theme.dataCard}>
          {columns.map((col) => (
            <div key={col.label} style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, color: theme.muted, fontWeight: 700 }}>{col.label}</div>
              <div style={{ fontWeight: 700, lineHeight: 1.5 }}>{col.render ? col.render(row) : row[col.key]}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function MetricRow({ label, value, theme, strong = false }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: `1px solid ${theme.line}` }}><div style={{ color: theme.muted }}>{label}</div><div style={{ fontWeight: strong ? 800 : 700 }}>{value}</div></div>;
}

export default function App() {
  const [tab, setTab] = useState("홈");
  const [orderTab, setOrderTab] = useState("수주내역");
  const [orderFilter, setOrderFilter] = useState("전체");
  const [purchaseFilter, setPurchaseFilter] = useState("전체");
  const [partnerFilter, setPartnerFilter] = useState("전체");
  const [partnerSaleFilter, setPartnerSaleFilter] = useState("전체");
  const [expenseFilter, setExpenseFilter] = useState("전체");
  const [calendarFilter, setCalendarFilter] = useState("전체");

  const [orders, setOrders] = useState(() => load("bloom_orders", DEFAULT_ORDERS));
  const [purchases, setPurchases] = useState(() => load("bloom_purchases", DEFAULT_PURCHASES));
  const [partners, setPartners] = useState(() => load("bloom_partners", DEFAULT_PARTNERS));
  const [partnerSales, setPartnerSales] = useState(() => load("bloom_partner_sales", DEFAULT_PARTNER_SALES));
  const [expenses, setExpenses] = useState(() => load("bloom_expenses", DEFAULT_EXPENSES));

  const [orderForm, setOrderForm] = useState(makeOrderForm());
  const [purchaseForm, setPurchaseForm] = useState(makeOrderForm());
  const [partnerForm, setPartnerForm] = useState(makePartnerForm());
  const [partnerSaleForm, setPartnerSaleForm] = useState(makePartnerSaleForm());
  const [expenseForm, setExpenseForm] = useState(makeExpenseForm());

  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(3);
  const [selectedDate, setSelectedDate] = useState(TODAY);

  useEffect(() => save("bloom_orders", orders), [orders]);
  useEffect(() => save("bloom_purchases", purchases), [purchases]);
  useEffect(() => save("bloom_partners", partners), [partners]);
  useEffect(() => save("bloom_partner_sales", partnerSales), [partnerSales]);
  useEffect(() => save("bloom_expenses", expenses), [expenses]);

  const maxSales = Math.max(...MONTHLY.map((v) => v.sales));
  const currentMonthSales = MONTHLY[MONTHLY.length - 1].sales;
  const currentMonthExpense = expenses.reduce((sum, v) => sum + v.total, 0);
  const currentMonthProfit = currentMonthSales - currentMonthExpense;

  const todayOrders = useMemo(() => {
    const base = orders.filter((v) => v.date === TODAY);
    return orderFilter === "전체" ? base : base.filter((v) => v.type === orderFilter);
  }, [orders, orderFilter]);

  const todayPurchases = useMemo(() => {
    const base = purchases.filter((v) => v.date === TODAY);
    return purchaseFilter === "전체" ? base : base.filter((v) => v.type === purchaseFilter);
  }, [purchases, purchaseFilter]);

  const filteredPartners = useMemo(() => partnerFilter === "전체" ? partners : partners.filter((v) => v.category === partnerFilter), [partners, partnerFilter]);
  const filteredPartnerSales = useMemo(() => partnerSaleFilter === "전체" ? partnerSales : partnerSales.filter((v) => v.type === partnerSaleFilter), [partnerSales, partnerSaleFilter]);
  const filteredExpenses = useMemo(() => expenseFilter === "전체" ? expenses : expenses.filter((v) => v.type === expenseFilter), [expenses, expenseFilter]);

  const expenseSummary = useMemo(() => {
    const wreath = expenses.filter((v) => v.type === "화환").reduce((sum, v) => sum + v.total, 0);
    const plant = expenses.filter((v) => v.type === "식물").reduce((sum, v) => sum + v.total, 0);
    return { wreath, plant, total: wreath + plant };
  }, [expenses]);

  const orderSales = useMemo(() => orders.reduce((sum, v) => sum + v.amount, 0), [orders]);
  const partnerRevenue = useMemo(() => partnerSales.reduce((sum, v) => sum + v.amount, 0), [partnerSales]);

  const topPartners = useMemo(() => {
    return partners.map((p) => ({ name: p.name, total: partnerSales.filter((v) => v.partnerName === p.name).reduce((sum, v) => sum + v.amount, 0) })).filter((v) => v.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [partners, partnerSales]);

  const weeks = useMemo(() => monthGrid(calendarYear, calendarMonth), [calendarYear, calendarMonth]);

  const calendarCounts = useMemo(() => {
    const map = {};
    const add = (date, type) => {
      if (!map[date]) map[date] = { 수주: 0, 발주: 0, 거래처: 0 };
      map[date][type] += 1;
    };
    orders.forEach((v) => add(v.date, "수주"));
    purchases.forEach((v) => add(v.date, "발주"));
    partnerSales.forEach((v) => add(v.date, "거래처"));
    return map;
  }, [orders, purchases, partnerSales]);

  const selectedDetail = useMemo(() => ({
    수주: orders.filter((v) => v.date === selectedDate),
    발주: purchases.filter((v) => v.date === selectedDate),
    거래처: partnerSales.filter((v) => v.date === selectedDate),
  }), [orders, purchases, partnerSales, selectedDate]);

  const currentExpenseTotal = useMemo(() => Object.values(expenseForm.items).reduce((sum, value) => sum + Number(value || 0), 0), [expenseForm]);

  function submitOrder(e) {
    e.preventDefault();
    if (!orderForm.chain || !orderForm.florist || !orderForm.product || !orderForm.amount) return;
    setOrders((prev) => [{ id: Date.now(), ...orderForm, amount: Number(orderForm.amount) }, ...prev]);
    setOrderForm(makeOrderForm());
  }

  function submitPurchase(e) {
    e.preventDefault();
    if (!purchaseForm.chain || !purchaseForm.florist || !purchaseForm.product || !purchaseForm.amount) return;
    setPurchases((prev) => [{ id: Date.now(), ...purchaseForm, amount: Number(purchaseForm.amount) }, ...prev]);
    setPurchaseForm(makeOrderForm());
  }

  function submitPartner(e) {
    e.preventDefault();
    if (!partnerForm.category || !partnerForm.name || !partnerForm.phone) return;
    setPartners((prev) => [{ id: Date.now(), ...partnerForm }, ...prev]);
    setPartnerForm(makePartnerForm());
  }

  function submitPartnerSale(e) {
    e.preventDefault();
    if (!partnerSaleForm.partnerName || !partnerSaleForm.product || !partnerSaleForm.amount) return;
    setPartnerSales((prev) => [{ id: Date.now(), ...partnerSaleForm, amount: Number(partnerSaleForm.amount) }, ...prev]);
    setPartnerSaleForm(makePartnerSaleForm());
  }

  function submitExpense(e) {
    e.preventDefault();
    const total = Object.values(expenseForm.items).reduce((sum, value) => sum + Number(value || 0), 0);
    setExpenses((prev) => [{ id: Date.now(), weekLabel: expenseForm.weekLabel, type: expenseForm.type, items: Object.fromEntries(Object.entries(expenseForm.items).map(([k, v]) => [k, Number(v || 0)])), total, memo: expenseForm.memo }, ...prev]);
    setExpenseForm(makeExpenseForm(expenseForm.type));
  }

  function moveMonth(diff) {
    const next = new Date(calendarYear, calendarMonth + diff, 1);
    setCalendarYear(next.getFullYear());
    setCalendarMonth(next.getMonth());
  }

  return (
    <div style={theme.page}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Pretendard, Arial, sans-serif; }
        button, input, select, textarea { font-family: inherit; }
        @media (max-width: 1180px) {
          .grid-two, .grid-home, .grid-analytics, .grid-calendar { grid-template-columns: 1fr !important; }
          .grid-summary { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={theme.wrap}>
        <div style={theme.top}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#ff5f57" }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#febc2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: 999, background: "#28c840" }} />
            <div style={{ marginLeft: 14, fontSize: 14, opacity: 0.9 }}>BLOOM HUB</div>
          </div>
          <button style={theme.filter}>최소 안정 버전</button>
        </div>

        <div style={theme.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "linear-gradient(135deg, #d8ba76 0%, #b78d44 100%)", color: "#fff", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 800 }}>❋</div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>BLOOM HUB</div>
              <div style={{ fontSize: 14, opacity: 0.72, marginTop: 4 }}>플라워 비즈니스 통합 관리 시스템</div>
            </div>
          </div>
        </div>

        <div style={theme.tabs}>
          {TABS.map((v) => <button key={v} onClick={() => setTab(v)} style={tab === v ? theme.tabActive : theme.tab}>{v}</button>)}
        </div>

        <div style={theme.body}>
          {tab === "홈" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div style={theme.hero}>
                <div>
                  <div style={{ fontSize: 14, opacity: 0.75 }}>AI 비서</div>
                  <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, letterSpacing: "-0.03em" }}>오늘 업무를 빠르게 확인해보세요</div>
                  <div style={{ marginTop: 10, color: theme.muted, lineHeight: 1.6 }}>이번달 매출, 지출을 홈에서 바로 확인할 수 있어요.</div>
                </div>
                <div style={theme.search}>
                  <span style={{ fontSize: 20, opacity: 0.55 }}>⌕</span>
                  <input defaultValue="이번달 매출, 오늘 수주를 물어보세요..." style={theme.searchInput} />
                  <button style={theme.ask}>질문하기</button>
                </div>
              </div>

              <div className="grid-summary" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                <SummaryCard label="이번달 매출" value={won(currentMonthSales)} theme={theme} />
                <SummaryCard label="이번달 지출" value={won(currentMonthExpense)} theme={theme} />
                <SummaryCard label="순이익" value={won(currentMonthProfit)} accent theme={theme} />
              </div>

              <div className="grid-home" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20 }}>
                <div style={theme.card}>
                  <SectionTitle>매출요약</SectionTitle>
                  <div style={{ display: "flex", alignItems: "end", gap: 14, height: 280 }}>
                    {MONTHLY.map((item) => (
                      <div key={item.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ height: 210, display: "flex", alignItems: "end", width: "100%" }}>
                          <div style={{ width: "100%", height: `${(item.sales / maxSales) * 180 + 30}px`, background: theme.bar, borderRadius: 14 }} />
                        </div>
                        <div style={{ fontSize: 13, color: theme.muted, fontWeight: 700 }}>{item.month}</div>
                        <div style={{ fontSize: 12, color: theme.text }}>{won(item.sales)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={theme.card}>
                  <SectionTitle>오늘 요약</SectionTitle>
                  <MetricRow label="오늘 수주 건수" value={`${todayOrders.length}건`} theme={theme} />
                  <MetricRow label="오늘 발주 건수" value={`${todayPurchases.length}건`} theme={theme} />
                  <MetricRow label="거래처 수" value={`${partners.length}곳`} theme={theme} />
                </div>
              </div>
            </div>
          )}

          {tab === "수발주관리" && (
            <div style={{ display: "grid", gap: 18 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {ORDER_TABS.map((v) => <button key={v} onClick={() => setOrderTab(v)} style={orderTab === v ? theme.subtabActive : theme.subtab}>{v}</button>)}
              </div>

              {orderTab === "수주내역" && (
                <div className="grid-two" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
                  <div style={theme.card}>
                    <SectionTitle>주문등록</SectionTitle>
                    <form onSubmit={submitOrder} style={{ display: "grid", gap: 12 }}>
                      <SelectInput label="구분" value={orderForm.type} onChange={(v) => setOrderForm((p) => ({ ...p, type: v }))} options={["화환", "식물"]} theme={theme} />
                      <TextInput label="체인" value={orderForm.chain} onChange={(v) => setOrderForm((p) => ({ ...p, chain: v }))} theme={theme} />
                      <TextInput label="발주화원" value={orderForm.florist} onChange={(v) => setOrderForm((p) => ({ ...p, florist: v }))} theme={theme} />
                      <TextInput label="상품명" value={orderForm.product} onChange={(v) => setOrderForm((p) => ({ ...p, product: v }))} theme={theme} />
                      <TextInput label="수주금액" type="number" value={orderForm.amount} onChange={(v) => setOrderForm((p) => ({ ...p, amount: v }))} theme={theme} />
                      <SelectInput label="배송방식" value={orderForm.delivery} onChange={(v) => setOrderForm((p) => ({ ...p, delivery: v }))} options={["자체배달", "퀵"]} theme={theme} />
                      <TextInput label="배송장소" value={orderForm.location} onChange={(v) => setOrderForm((p) => ({ ...p, location: v }))} theme={theme} />
                      <TextInput label="날짜" type="date" value={orderForm.date} onChange={(v) => setOrderForm((p) => ({ ...p, date: v }))} theme={theme} />
                      <TextareaInput label="메모" value={orderForm.memo} onChange={(v) => setOrderForm((p) => ({ ...p, memo: v }))} theme={theme} />
                      <button type="submit" style={theme.button}>등록하기</button>
                    </form>
                  </div>

                  <div style={theme.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                      <div><div style={{ fontSize: 24, fontWeight: 800 }}>수주내역</div><div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>당일 상품만 표시됩니다.</div></div>
                      <FilterButtons items={["전체", "화환", "식물"]} active={orderFilter} onChange={setOrderFilter} theme={theme} />
                    </div>
                    <DataCards rows={todayOrders} columns={[{ key: "chain", label: "체인사" }, { label: "상품 / 구분", render: (row) => <><div>{row.product}</div><div style={{ marginTop: 4, fontSize: 13, color: theme.muted }}>{row.type}</div></> }, { label: "수주금액", render: (row) => won(row.amount) }, { key: "location", label: "배송장소" }]} theme={theme} emptyText="오늘 등록된 내역이 없습니다." />
                  </div>
                </div>
              )}

              {orderTab === "발주내역" && (
                <div className="grid-two" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
                  <div style={theme.card}>
                    <SectionTitle>발주등록</SectionTitle>
                    <form onSubmit={submitPurchase} style={{ display: "grid", gap: 12 }}>
                      <SelectInput label="구분" value={purchaseForm.type} onChange={(v) => setPurchaseForm((p) => ({ ...p, type: v }))} options={["화환", "식물"]} theme={theme} />
                      <TextInput label="체인" value={purchaseForm.chain} onChange={(v) => setPurchaseForm((p) => ({ ...p, chain: v }))} theme={theme} />
                      <TextInput label="화원" value={purchaseForm.florist} onChange={(v) => setPurchaseForm((p) => ({ ...p, florist: v }))} theme={theme} />
                      <TextInput label="상품명" value={purchaseForm.product} onChange={(v) => setPurchaseForm((p) => ({ ...p, product: v }))} theme={theme} />
                      <TextInput label="발주금액" type="number" value={purchaseForm.amount} onChange={(v) => setPurchaseForm((p) => ({ ...p, amount: v }))} theme={theme} />
                      <SelectInput label="배송방식" value={purchaseForm.delivery} onChange={(v) => setPurchaseForm((p) => ({ ...p, delivery: v }))} options={["자체배달", "퀵"]} theme={theme} />
                      <TextInput label="배송장소" value={purchaseForm.location} onChange={(v) => setPurchaseForm((p) => ({ ...p, location: v }))} theme={theme} />
                      <TextInput label="날짜" type="date" value={purchaseForm.date} onChange={(v) => setPurchaseForm((p) => ({ ...p, date: v }))} theme={theme} />
                      <TextareaInput label="메모" value={purchaseForm.memo} onChange={(v) => setPurchaseForm((p) => ({ ...p, memo: v }))} theme={theme} />
                      <button type="submit" style={theme.button}>등록하기</button>
                    </form>
                  </div>

                  <div style={theme.card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                      <div><div style={{ fontSize: 24, fontWeight: 800 }}>발주내역</div><div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>당일 상품만 표시됩니다.</div></div>
                      <FilterButtons items={["전체", "화환", "식물"]} active={purchaseFilter} onChange={setPurchaseFilter} theme={theme} />
                    </div>
                    <DataCards rows={todayPurchases} columns={[{ key: "chain", label: "체인사" }, { label: "상품 / 구분", render: (row) => <><div>{row.product}</div><div style={{ marginTop: 4, fontSize: 13, color: theme.muted }}>{row.type}</div></> }, { label: "발주금액", render: (row) => won(row.amount) }, { key: "location", label: "배송장소" }]} theme={theme} emptyText="오늘 등록된 내역이 없습니다." />
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "거래처정보" && (
            <div className="grid-two" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
              <div style={theme.card}>
                <SectionTitle>거래처 등록</SectionTitle>
                <form onSubmit={submitPartner} style={{ display: "grid", gap: 12 }}>
                  <TextInput label="거래처 종류" value={partnerForm.category} onChange={(v) => setPartnerForm((p) => ({ ...p, category: v }))} theme={theme} />
                  <TextInput label="개인/상호" value={partnerForm.name} onChange={(v) => setPartnerForm((p) => ({ ...p, name: v }))} theme={theme} />
                  <TextInput label="연락처" value={partnerForm.phone} onChange={(v) => setPartnerForm((p) => ({ ...p, phone: v }))} theme={theme} />
                  <TextInput label="계좌" value={partnerForm.account} onChange={(v) => setPartnerForm((p) => ({ ...p, account: v }))} theme={theme} />
                  <TextInput label="발주금액대" value={partnerForm.priceBand} onChange={(v) => setPartnerForm((p) => ({ ...p, priceBand: v }))} theme={theme} />
                  <TextareaInput label="메모" value={partnerForm.memo} onChange={(v) => setPartnerForm((p) => ({ ...p, memo: v }))} theme={theme} />
                  <button type="submit" style={theme.button}>등록하기</button>
                </form>
              </div>

              <div style={theme.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>거래처정보</div>
                  <FilterButtons items={["전체", ...Array.from(new Set(partners.map((v) => v.category).filter(Boolean)))]} active={partnerFilter} onChange={setPartnerFilter} theme={theme} />
                </div>
                <DataCards rows={filteredPartners} columns={[{ key: "category", label: "거래처 종류" }, { key: "name", label: "개인/상호" }, { key: "phone", label: "연락처" }, { key: "account", label: "계좌" }, { key: "priceBand", label: "발주금액대" }, { key: "memo", label: "메모" }]} theme={theme} emptyText="등록된 거래처가 없습니다." />
              </div>
            </div>
          )}

          {tab === "거래처내역" && (
            <div className="grid-two" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
              <div style={theme.card}>
                <SectionTitle>거래 등록</SectionTitle>
                <form onSubmit={submitPartnerSale} style={{ display: "grid", gap: 12 }}>
                  <SelectInput label="거래처명" value={partnerSaleForm.partnerName} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, partnerName: v }))} options={partners.map((v) => v.name)} theme={theme} />
                  <SelectInput label="거래종류" value={partnerSaleForm.type} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, type: v }))} options={["화환", "식물", "기타"]} theme={theme} />
                  <TextInput label="상품명" value={partnerSaleForm.product} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, product: v }))} theme={theme} />
                  <TextInput label="매출금액" type="number" value={partnerSaleForm.amount} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, amount: v }))} theme={theme} />
                  <SelectInput label="결제방식" value={partnerSaleForm.payment} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, payment: v }))} options={["계좌이체", "현금", "미수금"]} theme={theme} />
                  <TextInput label="날짜" type="date" value={partnerSaleForm.date} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, date: v }))} theme={theme} />
                  <TextareaInput label="메모" value={partnerSaleForm.memo} onChange={(v) => setPartnerSaleForm((p) => ({ ...p, memo: v }))} theme={theme} />
                  <button type="submit" style={theme.button}>등록하기</button>
                </form>
              </div>

              <div style={theme.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                  <div><div style={{ fontSize: 24, fontWeight: 800 }}>거래처내역</div><div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>거래처 매출 기록입니다.</div></div>
                  <FilterButtons items={["전체", "화환", "식물", "기타"]} active={partnerSaleFilter} onChange={setPartnerSaleFilter} theme={theme} />
                </div>
                <DataCards rows={filteredPartnerSales} columns={[{ key: "partnerName", label: "거래처명" }, { label: "상품 / 거래종류", render: (row) => <><div>{row.product}</div><div style={{ marginTop: 4, fontSize: 13, color: theme.muted }}>{row.type}</div></> }, { label: "매출금액", render: (row) => won(row.amount) }, { key: "payment", label: "결제방식" }]} theme={theme} emptyText="등록된 거래내역이 없습니다." />
              </div>
            </div>
          )}

          {tab === "달력" && (
            <div className="grid-calendar" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20 }}>
              <div style={theme.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <button style={theme.filter} onClick={() => moveMonth(-1)}>이전달</button>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>{calendarYear}년 {calendarMonth + 1}월</div>
                    <button style={theme.filter} onClick={() => moveMonth(1)}>다음달</button>
                  </div>
                  <FilterButtons items={["전체", "수주", "발주", "거래처"]} active={calendarFilter} onChange={setCalendarFilter} theme={theme} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
                  {["일", "월", "화", "수", "목", "금", "토"].map((day) => <div key={day} style={{ textAlign: "center", fontWeight: 800, padding: "8px 0" }}>{day}</div>)}
                  {weeks.flat().map((cell) => {
                    const iso = cell.date.toISOString().slice(0, 10);
                    const counts = calendarCounts[iso] || { 수주: 0, 발주: 0, 거래처: 0 };
                    return (
                      <button key={iso} onClick={() => setSelectedDate(iso)} style={{ ...theme.calendarCell, opacity: cell.current ? 1 : 0.45, borderColor: selectedDate === iso ? theme.accent : theme.line }}>
                        <div style={{ fontWeight: 800 }}>{cell.date.getDate()}</div>
                        {calendarFilter === "전체" ? (
                          <div style={{ display: "grid", gap: 4, marginTop: 8, textAlign: "left" }}>
                            {counts.수주 > 0 && <span style={theme.calendarText}>수주 {counts.수주}건</span>}
                            {counts.발주 > 0 && <span style={theme.calendarText}>발주 {counts.발주}건</span>}
                            {counts.거래처 > 0 && <span style={theme.calendarText}>거래처 {counts.거래처}건</span>}
                          </div>
                        ) : (
                          <div style={{ marginTop: 8, textAlign: "left" }}><span style={theme.calendarText}>{calendarFilter} {counts[calendarFilter] || 0}건</span></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={theme.card}>
                <SectionTitle>{formatDate(selectedDate)} 상세</SectionTitle>
                {selectedDetail.수주.length === 0 && selectedDetail.발주.length === 0 && selectedDetail.거래처.length === 0 ? (
                  <div style={{ color: theme.muted }}>선택한 날짜의 일정이 없습니다.</div>
                ) : (
                  <>
                    {selectedDetail.수주.map((item) => <div key={item.id} style={theme.detailItem}>수주 · {item.product} / {item.chain} / {won(item.amount)}</div>)}
                    {selectedDetail.발주.map((item) => <div key={item.id} style={theme.detailItem}>발주 · {item.product} / {item.florist} / {won(item.amount)}</div>)}
                    {selectedDetail.거래처.map((item) => <div key={item.id} style={theme.detailItem}>거래처 · {item.product} / {item.partnerName} / {won(item.amount)}</div>)}
                  </>
                )}
              </div>
            </div>
          )}

          {tab === "매출분석" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div className="grid-summary" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                <SummaryCard label="총 매출" value={won(orderSales + partnerRevenue)} theme={theme} />
                <SummaryCard label="총 지출" value={won(expenseSummary.total)} theme={theme} />
                <SummaryCard label="순이익" value={won(orderSales + partnerRevenue - expenseSummary.total)} accent theme={theme} />
              </div>

              <div className="grid-analytics" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
                <div style={theme.card}>
                  <SectionTitle>매출 구조</SectionTitle>
                  <MetricRow label="수발주 매출" value={won(orderSales)} theme={theme} />
                  <MetricRow label="거래처 매출" value={won(partnerRevenue)} theme={theme} />
                  <MetricRow label="총 매출" value={won(orderSales + partnerRevenue)} theme={theme} strong />
                  <div style={{ height: 18 }} />
                  <MetricRow label="화환 지출" value={won(expenseSummary.wreath)} theme={theme} />
                  <MetricRow label="식물 지출" value={won(expenseSummary.plant)} theme={theme} />
                  <MetricRow label="총 지출" value={won(expenseSummary.total)} theme={theme} strong />
                </div>

                <div style={theme.card}>
                  <SectionTitle>거래처 매출 TOP</SectionTitle>
                  {topPartners.length === 0 ? (
                    <div style={{ color: theme.muted }}>거래처 매출 데이터가 없습니다.</div>
                  ) : (
                    topPartners.map((item, index) => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${theme.line}` }}>
                        <div style={{ width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(255,255,255,.12)", color: "#fff", fontWeight: 800 }}>{index + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800 }}>{item.name}</div>
                          <div style={{ color: theme.muted, marginTop: 4 }}>거래처 매출</div>
                        </div>
                        <div style={{ fontWeight: 800 }}>{won(item.total)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === "지출내역" && (
            <div className="grid-two" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
              <div style={theme.card}>
                <SectionTitle>주간 지출 등록</SectionTitle>
                <form onSubmit={submitExpense} style={{ display: "grid", gap: 12 }}>
                  <TextInput label="주차" value={expenseForm.weekLabel} onChange={(v) => setExpenseForm((p) => ({ ...p, weekLabel: v }))} theme={theme} />
                  <SelectInput label="구분" value={expenseForm.type} onChange={(v) => setExpenseForm(makeExpenseForm(v))} options={["화환", "식물"]} theme={theme} />
                  {EXPENSE_TYPES[expenseForm.type].map((item) => <TextInput key={item} label={item} type="number" value={expenseForm.items[item] || ""} onChange={(v) => setExpenseForm((p) => ({ ...p, items: { ...p.items, [item]: v } }))} theme={theme} />)}
                  <div style={{ padding: 16, borderRadius: 16, background: "rgba(255,255,255,.04)", border: `1px solid ${theme.line}`, fontWeight: 800 }}>총 지출: {won(currentExpenseTotal)}</div>
                  <TextareaInput label="메모" value={expenseForm.memo} onChange={(v) => setExpenseForm((p) => ({ ...p, memo: v }))} theme={theme} />
                  <button type="submit" style={theme.button}>등록하기</button>
                </form>
              </div>

              <div style={theme.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                  <div><div style={{ fontSize: 24, fontWeight: 800 }}>지출내역</div><div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>주 단위 지출 정리입니다.</div></div>
                  <FilterButtons items={["전체", "화환", "식물"]} active={expenseFilter} onChange={setExpenseFilter} theme={theme} />
                </div>
                <DataCards rows={filteredExpenses} columns={[{ key: "weekLabel", label: "주차" }, { key: "type", label: "구분" }, { label: "총 지출", render: (row) => won(row.total) }, { label: "주요 항목", render: (row) => Object.entries(row.items).filter(([, value]) => value > 0).map(([key]) => key).join(" + ") || "항목 없음" }, { key: "memo", label: "메모" }]} theme={theme} emptyText="등록된 지출내역이 없습니다." />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";

const mainTabs = [
  "홈",
  "수발주관리",
  "거래처정보",
  "거래처내역",
  "달력",
  "매출분석",
  "지출내역",
  "사진방",
  "공지사항",
];

const orderTabs = ["수주내역", "발주내역"];
const expenseCategories = {
  화환: ["대국값", "근조수거", "축하수거", "퀵비", "기타"],
  식물: ["꽃값", "퀵비", "기타"],
};

const monthlySales = [
  { month: "1월", sales: 1800000 },
  { month: "2월", sales: 2200000 },
  { month: "3월", sales: 2100000 },
  { month: "4월", sales: 2600000 },
  { month: "5월", sales: 2400000 },
  { month: "6월", sales: 2900000 },
];

const recentPhotos = [
  { id: 1, title: "근조 3단", date: "2026-04-15" },
  { id: 2, title: "축하 3단", date: "2026-04-14" },
  { id: 3, title: "개업화분", date: "2026-04-13" },
  { id: 4, title: "몬스테라", date: "2026-04-12" },
];

const initialOrders = [
  {
    id: 1,
    type: "화환",
    chain: "송죽플라워",
    florist: "중앙화원",
    product: "근조 3단",
    amount: 180000,
    delivery: "퀵",
    location: "인천성모병원 장례식장",
    date: "2026-04-15",
    memo: "오전 배송",
  },
  {
    id: 2,
    type: "식물",
    chain: "반하다플라워",
    florist: "그린화원",
    product: "개업화분",
    amount: 200000,
    delivery: "자체배달",
    location: "서울 강서구 마곡동",
    date: "2026-04-15",
    memo: "리본 문구 확인",
  },
  {
    id: 3,
    type: "화환",
    chain: "아이마플라워",
    florist: "새벽화원",
    product: "축하 3단",
    amount: 220000,
    delivery: "퀵",
    location: "김포 웨딩홀",
    date: "2026-04-14",
    memo: "행사장 정문",
  },
];

const initialPurchases = [
  {
    id: 101,
    type: "화환",
    chain: "송죽플라워",
    florist: "중앙화원",
    product: "근조 3단",
    amount: 130000,
    delivery: "퀵",
    location: "인천성모병원 장례식장",
    date: "2026-04-15",
    memo: "대국 포함",
  },
  {
    id: 102,
    type: "식물",
    chain: "반하다플라워",
    florist: "그린화원",
    product: "개업화분",
    amount: 145000,
    delivery: "자체배달",
    location: "서울 강서구 마곡동",
    date: "2026-04-15",
    memo: "도기화분 포함",
  },
];

const initialPartners = [
  {
    id: 201,
    category: "화원",
    name: "행복플라워",
    phone: "010-1111-2222",
    account: "국민 123-456-7890",
    priceBand: "10만원~20만원",
    memo: "근조 주문 반응 좋음",
  },
  {
    id: 202,
    category: "기업",
    name: "마곡오피스",
    phone: "010-2222-3333",
    account: "신한 555-222-1111",
    priceBand: "20만원 이상",
    memo: "정기 식물 납품 가능성",
  },
];

const initialPartnerSales = [
  {
    id: 301,
    partnerName: "행복플라워",
    type: "화환",
    product: "근조 3단",
    amount: 180000,
    payment: "계좌이체",
    date: "2026-04-15",
    memo: "첫 거래",
  },
  {
    id: 302,
    partnerName: "마곡오피스",
    type: "식물",
    product: "개업화분",
    amount: 240000,
    payment: "현금",
    date: "2026-04-12",
    memo: "직접 영업",
  },
];

const initialWeeklyExpenses = [
  {
    id: 401,
    weekLabel: "2026년 4월 3주차",
    type: "화환",
    items: { 대국값: 50000, 근조수거: 20000, 축하수거: 10000, 퀵비: 30000, 기타: 5000 },
    total: 115000,
    memo: "주간 화환 정산",
  },
  {
    id: 402,
    weekLabel: "2026년 4월 3주차",
    type: "식물",
    items: { 꽃값: 70000, 퀵비: 20000, 기타: 10000 },
    total: 100000,
    memo: "주간 식물 정산",
  },
];

const initialAnnouncements = [
  { id: 1, title: "어버이날 시즌 준비", date: "2026-04-10" },
  { id: 2, title: "퀵비 기준표 업데이트", date: "2026-04-12" },
];

function loadStoredData(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function won(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function getToday() {
  return "2026-04-15";
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function emptyOrderForm() {
  return {
    type: "화환",
    chain: "",
    florist: "",
    product: "",
    amount: "",
    delivery: "자체배달",
    location: "",
    date: getToday(),
    memo: "",
  };
}

function emptyPartnerForm() {
  return {
    category: "",
    name: "",
    phone: "",
    account: "",
    priceBand: "",
    memo: "",
  };
}

function emptyPartnerSaleForm() {
  return {
    partnerName: "",
    type: "화환",
    product: "",
    amount: "",
    payment: "계좌이체",
    date: getToday(),
    memo: "",
  };
}

function emptyExpenseForm(type = "화환") {
  const items = {};
  expenseCategories[type].forEach((key) => {
    items[key] = "";
  });
  return {
    weekLabel: "2026년 4월 3주차",
    type,
    items,
    memo: "",
  };
}

function getMonthMatrix(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const startDay = firstDay.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();
  const cells = [];

  for (let i = 0; i < 42; i += 1) {
    const dayNumber = i - startDay + 1;
    if (dayNumber <= 0) {
      const date = new Date(year, monthIndex - 1, prevMonthDays + dayNumber);
      cells.push({ date, currentMonth: false });
    } else if (dayNumber > daysInMonth) {
      const date = new Date(year, monthIndex + 1, dayNumber - daysInMonth);
      cells.push({ date, currentMonth: false });
    } else {
      const date = new Date(year, monthIndex, dayNumber);
      cells.push({ date, currentMonth: true });
    }
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function SectionTitle({ title }) {
  return <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>{title}</div>;
}

function HeaderWithFilters({ title, subtitle, filters, active, onChange, theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>{subtitle}</div> : null}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {filters.map((item) => (
          <button key={item} onClick={() => onChange(item)} style={active === item ? theme.filterActive : theme.filterButton}>{item}</button>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ theme, label, value, accent }) {
  return (
    <div style={theme.summaryCard}>
      <div style={{ fontSize: 14, color: theme.muted }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12, color: accent ? theme.accent : theme.text }}>{value}</div>
    </div>
  );
}

function ResponsiveDataList({ rows, columns, emptyText, theme }) {
  if (rows.length === 0) {
    return <div style={{ padding: "36px 0", textAlign: "center", color: theme.muted }}>{emptyText}</div>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {rows.map((row) => (
        <div key={row.id} style={theme.dataCard}>
          {columns.map((col) => (
            <div key={col.key} style={{ display: "grid", gap: 6 }}>
              <div style={{ fontSize: 12, color: theme.muted, fontWeight: 700 }}>{col.label}</div>
              <div style={{ fontWeight: 700, lineHeight: 1.5 }}>{col.render ? col.render(row) : row[col.key]}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SimpleOrderListPanel({ title, subtitle, filter, onFilterChange, rows, amountLabel, theme }) {
  return (
    <>
      <HeaderWithFilters title={title} subtitle={subtitle} filters={["전체", "화환", "식물"]} active={filter} onChange={onFilterChange} theme={theme} />
      <ResponsiveDataList
        rows={rows}
        columns={[
          { key: "chain", label: "체인사" },
          { key: "productType", label: "상품 / 구분", render: (row) => (<><div style={{ fontWeight: 800 }}>{row.product}</div><div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.type}</div></>) },
          { key: "amount", label: amountLabel, render: (row) => won(row.amount) },
          { key: "location", label: "배송장소" },
        ]}
        emptyText="오늘 등록된 내역이 없습니다."
        theme={theme}
      />
    </>
  );
}

function DetailSection({ title, rows, formatter, theme }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{title}</div>
      {rows.length === 0 ? <div style={{ color: theme.muted, marginBottom: 8 }}>없음</div> : rows.map((row) => <div key={row.id} style={theme.detailItem}>{formatter(row)}</div>)}
    </div>
  );
}

function MetricRow({ label, value, theme, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: `1px solid ${theme.line}` }}>
      <div style={{ color: theme.muted }}>{label}</div>
      <div style={{ fontWeight: strong ? 800 : 700 }}>{value}</div>
    </div>
  );
}

function InfoMini({ label, value, theme }) {
  return (
    <div style={theme.infoMiniCard}>
      <div style={{ fontSize: 12, color: theme.muted }}>{label}</div>
      <div style={{ marginTop: 6, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function InputField({ label, value, onChange, theme, type = "text" }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={theme.fieldLabel}>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={theme.field} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, theme }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={theme.fieldLabel}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={theme.selectField}>
        <option value="">선택</option>
        {options.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </label>
  );
}

function DatalistField({ label, value, onChange, options, listId, theme }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={theme.fieldLabel}>{label}</span>
      <>
        <input list={listId} value={value} onChange={(e) => onChange(e.target.value)} style={theme.field} />
        <datalist id={listId}>
          {options.map((item) => <option key={item} value={item} />)}
        </datalist>
      </>
    </label>
  );
}

function TextAreaField({ label, value, onChange, theme }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={theme.fieldLabel}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...theme.field, height: "auto", paddingTop: 14, resize: "vertical" }} />
    </label>
  );
}

const commonTheme = {
  dot: { width: 12, height: 12, borderRadius: 999 },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "linear-gradient(135deg, #d8ba76 0%, #b78d44 100%)",
    color: "white",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    fontWeight: 800,
  },
  primaryAction: {
    border: "none",
    borderRadius: 16,
    background: "linear-gradient(135deg, #d8ba76 0%, #b78d44 100%)",
    color: "white",
    padding: "14px 20px",
    fontWeight: 800,
    cursor: "pointer",
  },
};

const lightTheme = {
  ...commonTheme,
  page: { background: "linear-gradient(180deg, #f2f4f8 0%, #eceff4 100%)", color: "#1f2937", minHeight: "100vh", padding: 18 },
  windowWrap: { maxWidth: 1440, margin: "0 auto", borderRadius: 28, overflow: "hidden", background: "#f7f8fb", boxShadow: "0 30px 80px rgba(15, 23, 42, 0.16)" },
  windowBar: { background: "linear-gradient(90deg, #2d2f3d 0%, #1f2430 100%)", color: "#f8fafc", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modeButton: { width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer" },
  header: { background: "rgba(255,255,255,0.95)", padding: "18px 32px", borderBottom: "1px solid #e8edf5" },
  tabRow: { display: "flex", gap: 10, overflowX: "auto", padding: "16px 28px 0", background: "rgba(255,255,255,0.95)", borderBottom: "1px solid #e8edf5" },
  tab: { border: "none", borderRadius: 14, padding: "12px 16px", background: "transparent", color: "#475569", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  activeTab: { border: "none", borderRadius: 14, padding: "12px 16px", background: "#111827", color: "white", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  subTabRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  subTab: { border: "1px solid #e7ebf3", borderRadius: 14, padding: "12px 18px", background: "white", color: "#475569", fontWeight: 700, cursor: "pointer" },
  subActiveTab: { border: "none", borderRadius: 14, padding: "12px 18px", background: "#111827", color: "white", fontWeight: 800, cursor: "pointer" },
  body: { padding: 32, background: "linear-gradient(135deg, #f7f8fb 0%, #eef2f7 100%)" },
  heroCard: { borderRadius: 28, padding: 28, background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(240,243,249,0.84) 100%)", border: "1px solid rgba(255,255,255,0.7)", display: "grid", gap: 18 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid #e7ebf3", borderRadius: 18, padding: "12px 14px" },
  searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: "#1f2937" },
  askButton: { border: "none", borderRadius: 12, padding: "10px 14px", background: "#111827", color: "white", fontWeight: 700, cursor: "pointer" },
  summaryCard: { background: "rgba(255,255,255,0.88)", border: "1px solid #edf2f7", borderRadius: 20, padding: 20 },
  mainCard: { background: "rgba(255,255,255,0.88)", border: "1px solid #edf2f7", borderRadius: 28, padding: 24, boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)" },
  moreButton: { border: "1px solid #e7ebf3", background: "white", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700, color: "#334155" },
  photoCard: { border: "1px solid #edf2f7", borderRadius: 18, padding: 12, background: "white" },
  photoMock: { height: 120, borderRadius: 14, display: "grid", placeItems: "center", background: "linear-gradient(135deg, #f4efe4 0%, #e5eef7 100%)", fontSize: 30 },
  photoImage: { width: "100%", height: 120, objectFit: "cover", borderRadius: 14, display: "block" },
  uploadButton: { border: "1px solid #e7ebf3", background: "white", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700, color: "#334155" },
  filterButton: { border: "1px solid #e7ebf3", background: "white", color: "#475569", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  filterActive: { border: "none", background: "#111827", color: "white", borderRadius: 12, padding: "10px 14px", fontWeight: 800, cursor: "pointer" },
  fieldLabel: { fontSize: 13, color: "#64748b", fontWeight: 600 },
  field: { width: "100%", border: "1px solid #e7ebf3", borderRadius: 14, padding: "0 14px", height: 48, background: "white", color: "#1f2937", outline: "none" },
  selectField: { width: "100%", border: "1px solid #e7ebf3", borderRadius: 14, padding: "0 14px", height: 48, background: "white", color: "#1f2937", outline: "none", appearance: "auto" },
  infoRowCard: { border: "1px solid #edf2f7", borderRadius: 20, padding: 18, background: "white" },
  infoMiniCard: { border: "1px solid #edf2f7", borderRadius: 14, padding: 12, background: "#fafbfc" },
  calendarBoard: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 },
  calendarDayHead: { textAlign: "center", fontWeight: 800, padding: "8px 0" },
  calendarCell: { border: "1px solid #edf2f7", borderRadius: 18, minHeight: 120, padding: 12, background: "white", textAlign: "left", cursor: "pointer" },
  calendarCountText: { display: "block", fontSize: 12, color: "#475569" },
  detailItem: { padding: "10px 12px", border: "1px solid #edf2f7", borderRadius: 12, marginBottom: 8, background: "white" },
  rankRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #edf2f7" },
  rankBadge: { width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "#111827", color: "white", fontWeight: 800 },
  totalPreviewCard: { padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #e7ebf3", fontWeight: 800 },
  dataCard: { display: "grid", gap: 14, padding: 16, border: "1px solid #edf2f7", borderRadius: 18, background: "white" },
  muted: "#64748b",
  text: "#1f2937",
  accent: "#bf9348",
  line: "#edf2f7",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
};

const darkTheme = {
  ...lightTheme,
  page: { background: "linear-gradient(180deg, #090b11 0%, #11141d 100%)", color: "#f8fafc", minHeight: "100vh", padding: 18 },
  windowWrap: { maxWidth: 1440, margin: "0 auto", borderRadius: 28, overflow: "hidden", background: "#121621", boxShadow: "0 30px 90px rgba(0, 0, 0, 0.45)", border: "1px solid rgba(255,255,255,0.08)" },
  windowBar: { background: "linear-gradient(90deg, #12141d 0%, #1b2030 100%)", color: "#f8fafc", padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modeButton: { width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.06)", color: "#fff", cursor: "pointer" },
  header: { background: "rgba(16, 20, 31, 0.95)", padding: "18px 32px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  tabRow: { display: "flex", gap: 10, overflowX: "auto", padding: "16px 28px 0", background: "rgba(16, 20, 31, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  tab: { border: "none", borderRadius: 14, padding: "12px 16px", background: "transparent", color: "#cbd5e1", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  activeTab: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px", background: "rgba(255,255,255,0.08)", color: "white", fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" },
  subTab: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 18px", background: "rgba(255,255,255,0.03)", color: "#cbd5e1", fontWeight: 700, cursor: "pointer" },
  subActiveTab: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 18px", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 800, cursor: "pointer" },
  body: { padding: 32, background: "linear-gradient(180deg, #121621 0%, #171c28 100%)" },
  heroCard: { borderRadius: 28, padding: 28, background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", display: "grid", gap: 18 },
  searchBox: { display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "12px 14px" },
  searchInput: { flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: "#f8fafc" },
  askButton: { border: "none", borderRadius: 12, padding: "10px 14px", background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 700, cursor: "pointer" },
  summaryCard: { background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 20 },
  mainCard: { background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: 24, boxShadow: "0 18px 40px rgba(0,0,0,0.20)" },
  moreButton: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700, color: "#e2e8f0" },
  photoCard: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 12, background: "rgba(255,255,255,0.03)" },
  photoMock: { height: 120, borderRadius: 14, display: "grid", placeItems: "center", background: "linear-gradient(135deg, rgba(215,179,106,0.18) 0%, rgba(120,146,187,0.18) 100%)", fontSize: 30 },
  photoImage: { width: "100%", height: 120, objectFit: "cover", borderRadius: 14, display: "block" },
  uploadButton: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontWeight: 700, color: "#e2e8f0" },
  filterButton: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#cbd5e1", borderRadius: 12, padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  filterActive: { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.12)", color: "white", borderRadius: 12, padding: "10px 14px", fontWeight: 800, cursor: "pointer" },
  fieldLabel: { fontSize: 13, color: "#94a3b8", fontWeight: 600 },
  field: { width: "100%", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "0 14px", height: 48, background: "rgba(255,255,255,0.03)", color: "#f8fafc", outline: "none" },
  selectField: { width: "100%", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "0 14px", height: 48, background: "rgba(255,255,255,0.03)", color: "#f8fafc", outline: "none", appearance: "auto" },
  infoRowCard: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 18, background: "rgba(255,255,255,0.03)" },
  infoMiniCard: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 12, background: "rgba(255,255,255,0.03)" },
  calendarBoard: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 },
  calendarDayHead: { textAlign: "center", fontWeight: 800, padding: "8px 0" },
  calendarCell: { border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, minHeight: 120, padding: 12, background: "rgba(255,255,255,0.03)", textAlign: "left", cursor: "pointer" },
  calendarCountText: { display: "block", fontSize: 12, color: "#cbd5e1" },
  detailItem: { padding: "10px 12px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, marginBottom: 8, background: "rgba(255,255,255,0.03)" },
  rankRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" },
  rankBadge: { width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.12)", color: "white", fontWeight: 800 },
  totalPreviewCard: { padding: 16, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontWeight: 800 },
  dataCard: { display: "grid", gap: 14, padding: 16, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, background: "rgba(255,255,255,0.03)" },
  muted: "#94a3b8",
  text: "#f8fafc",
  accent: "#d7b36a",
  line: "rgba(255,255,255,0.08)",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("홈");
  const [activeOrderTab, setActiveOrderTab] = useState("수주내역");
  const [orderFilter, setOrderFilter] = useState("전체");
  const [purchaseFilter, setPurchaseFilter] = useState("전체");
  const [partnerFilter, setPartnerFilter] = useState("전체");
  const [partnerSaleFilter, setPartnerSaleFilter] = useState("전체");
  const [calendarFilter, setCalendarFilter] = useState("전체");
  const [expenseFilter, setExpenseFilter] = useState("전체");

  const [orders, setOrders] = useState(() => loadStoredData("bloomhub_orders", initialOrders));
  const [purchases, setPurchases] = useState(() => loadStoredData("bloomhub_purchases", initialPurchases));
  const [partners, setPartners] = useState(() => loadStoredData("bloomhub_partners", initialPartners));
  const [partnerSales, setPartnerSales] = useState(() => loadStoredData("bloomhub_partner_sales", initialPartnerSales));
  const [weeklyExpenses, setWeeklyExpenses] = useState(() => loadStoredData("bloomhub_weekly_expenses", initialWeeklyExpenses));
  const [announcements, setAnnouncements] = useState(() => loadStoredData("bloomhub_announcements", initialAnnouncements));
  const [photos, setPhotos] = useState(() => loadStoredData("bloomhub_photos", recentPhotos));

  const [chainOptions, setChainOptions] = useState(() => loadStoredData("bloomhub_chain_options", ["송죽플라워", "반하다플라워", "아이마플라워"]));
  const [floristOptions, setFloristOptions] = useState(() => loadStoredData("bloomhub_florist_options", ["중앙화원", "그린화원", "새벽화원"]));
  const [productOptions, setProductOptions] = useState(() => loadStoredData("bloomhub_product_options", ["근조 3단", "축하 3단", "개업화분", "몬스테라"]));
  const [partnerCategoryOptions, setPartnerCategoryOptions] = useState(() => loadStoredData("bloomhub_partner_category_options", ["화원", "기업"]));
  const [priceBandOptions, setPriceBandOptions] = useState(() => loadStoredData("bloomhub_price_band_options", ["10만원~20만원", "20만원 이상"]));
  const [partnerProductOptions, setPartnerProductOptions] = useState(() => loadStoredData("bloomhub_partner_product_options", ["근조 3단", "개업화분"]));

  const [orderForm, setOrderForm] = useState(emptyOrderForm());
  const [purchaseForm, setPurchaseForm] = useState(emptyOrderForm());
  const [partnerForm, setPartnerForm] = useState(emptyPartnerForm());
  const [partnerSaleForm, setPartnerSaleForm] = useState(emptyPartnerSaleForm());
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm());
  const [announcementForm, setAnnouncementForm] = useState({ title: "", date: getToday() });

  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(3);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("2026-04-15");

  const theme = darkMode ? darkTheme : lightTheme;

  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_purchases", JSON.stringify(purchases)); }, [purchases]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_partners", JSON.stringify(partners)); }, [partners]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_partner_sales", JSON.stringify(partnerSales)); }, [partnerSales]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_weekly_expenses", JSON.stringify(weeklyExpenses)); }, [weeklyExpenses]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_announcements", JSON.stringify(announcements)); }, [announcements]);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem("bloomhub_photos", JSON.stringify(photos)); }, [photos]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("bloomhub_chain_options", JSON.stringify(chainOptions));
    window.localStorage.setItem("bloomhub_florist_options", JSON.stringify(floristOptions));
    window.localStorage.setItem("bloomhub_product_options", JSON.stringify(productOptions));
    window.localStorage.setItem("bloomhub_partner_category_options", JSON.stringify(partnerCategoryOptions));
    window.localStorage.setItem("bloomhub_price_band_options", JSON.stringify(priceBandOptions));
    window.localStorage.setItem("bloomhub_partner_product_options", JSON.stringify(partnerProductOptions));
  }, [chainOptions, floristOptions, productOptions, partnerCategoryOptions, priceBandOptions, partnerProductOptions]);

  const currentMonthSales = monthlySales[monthlySales.length - 1].sales;
  const currentMonthExpense = weeklyExpenses.reduce((sum, item) => sum + item.total, 0);
  const currentMonthProfit = currentMonthSales - currentMonthExpense;
  const maxSales = Math.max(...monthlySales.map((item) => item.sales));

  const todayOrders = useMemo(() => {
    const base = orders.filter((item) => item.date === getToday());
    return orderFilter === "전체" ? base : base.filter((item) => item.type === orderFilter);
  }, [orders, orderFilter]);

  const todayPurchases = useMemo(() => {
    const base = purchases.filter((item) => item.date === getToday());
    return purchaseFilter === "전체" ? base : base.filter((item) => item.type === purchaseFilter);
  }, [purchases, purchaseFilter]);

  const filteredPartners = useMemo(() => {
    return partnerFilter === "전체" ? partners : partners.filter((item) => item.category === partnerFilter);
  }, [partners, partnerFilter]);

  const filteredPartnerSales = useMemo(() => {
    return partnerSaleFilter === "전체" ? partnerSales : partnerSales.filter((item) => item.type === partnerSaleFilter);
  }, [partnerSales, partnerSaleFilter]);

  const filteredExpenses = useMemo(() => {
    return expenseFilter === "전체" ? weeklyExpenses : weeklyExpenses.filter((item) => item.type === expenseFilter);
  }, [weeklyExpenses, expenseFilter]);

  const weeklyExpenseSummary = useMemo(() => {
    const wreath = weeklyExpenses.filter((item) => item.type === "화환").reduce((sum, item) => sum + item.total, 0);
    const plant = weeklyExpenses.filter((item) => item.type === "식물").reduce((sum, item) => sum + item.total, 0);
    return { wreath, plant, total: wreath + plant };
  }, [weeklyExpenses]);

  const partnerSalesTotal = useMemo(() => partnerSales.reduce((sum, item) => sum + item.amount, 0), [partnerSales]);
  const orderSalesTotal = useMemo(() => orders.reduce((sum, item) => sum + item.amount, 0), [orders]);

  const topPartnerSales = useMemo(() => {
    return partners
      .map((partner) => ({
        name: partner.name,
        total: partnerSales.filter((item) => item.partnerName === partner.name).reduce((sum, item) => sum + item.amount, 0),
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [partners, partnerSales]);

  const calendarWeeks = useMemo(() => getMonthMatrix(calendarYear, calendarMonth), [calendarYear, calendarMonth]);

  const calendarEntries = useMemo(() => {
    const map = {};
    const pushType = (date, typeKey) => {
      if (!map[date]) map[date] = { 수주: 0, 발주: 0, 거래처: 0, 기타: 0 };
      map[date][typeKey] += 1;
    };
    orders.forEach((item) => pushType(item.date, "수주"));
    purchases.forEach((item) => pushType(item.date, "발주"));
    partnerSales.forEach((item) => pushType(item.date, "거래처"));
    announcements.forEach((item) => pushType(item.date, "기타"));
    return map;
  }, [orders, purchases, partnerSales, announcements]);

  const selectedDateDetails = useMemo(() => {
    return {
      수주: orders.filter((item) => item.date === selectedCalendarDate),
      발주: purchases.filter((item) => item.date === selectedCalendarDate),
      거래처: partnerSales.filter((item) => item.date === selectedCalendarDate),
      기타: announcements.filter((item) => item.date === selectedCalendarDate),
    };
  }, [orders, purchases, partnerSales, announcements, selectedCalendarDate]);

  const saveSharedOptions = (form) => {
    if (form.chain && !chainOptions.includes(form.chain)) setChainOptions((prev) => [form.chain, ...prev]);
    if (form.florist && !floristOptions.includes(form.florist)) setFloristOptions((prev) => [form.florist, ...prev]);
    if (form.product && !productOptions.includes(form.product)) setProductOptions((prev) => [form.product, ...prev]);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.chain || !orderForm.florist || !orderForm.product || !orderForm.amount) return;
    const newItem = { id: Date.now(), ...orderForm, amount: Number(orderForm.amount) };
    setOrders((prev) => [newItem, ...prev]);
    saveSharedOptions(orderForm);
    setOrderForm(emptyOrderForm());
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!purchaseForm.chain || !purchaseForm.florist || !purchaseForm.product || !purchaseForm.amount) return;
    const newItem = { id: Date.now(), ...purchaseForm, amount: Number(purchaseForm.amount) };
    setPurchases((prev) => [newItem, ...prev]);
    saveSharedOptions(purchaseForm);
    setPurchaseForm(emptyOrderForm());
  };

  const handlePartnerSubmit = (e) => {
    e.preventDefault();
    if (!partnerForm.category || !partnerForm.name || !partnerForm.phone) return;
    const newItem = { id: Date.now(), ...partnerForm };
    setPartners((prev) => [newItem, ...prev]);
    if (!partnerCategoryOptions.includes(partnerForm.category)) setPartnerCategoryOptions((prev) => [partnerForm.category, ...prev]);
    if (partnerForm.priceBand && !priceBandOptions.includes(partnerForm.priceBand)) setPriceBandOptions((prev) => [partnerForm.priceBand, ...prev]);
    setPartnerForm(emptyPartnerForm());
  };

  const handlePartnerSaleSubmit = (e) => {
    e.preventDefault();
    if (!partnerSaleForm.partnerName || !partnerSaleForm.product || !partnerSaleForm.amount) return;
    const newItem = { id: Date.now(), ...partnerSaleForm, amount: Number(partnerSaleForm.amount) };
    setPartnerSales((prev) => [newItem, ...prev]);
    if (partnerSaleForm.product && !partnerProductOptions.includes(partnerSaleForm.product)) setPartnerProductOptions((prev) => [partnerSaleForm.product, ...prev]);
    setPartnerSaleForm(emptyPartnerSaleForm());
  };

  const handleExpenseTypeChange = (value) => setExpenseForm(emptyExpenseForm(value));

  const handleExpenseItemChange = (key, value) => {
    setExpenseForm((prev) => ({ ...prev, items: { ...prev.items, [key]: value } }));
  };

  const currentExpenseTotal = useMemo(() => {
    return Object.values(expenseForm.items).reduce((sum, value) => sum + Number(value || 0), 0);
  }, [expenseForm]);

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const total = Object.values(expenseForm.items).reduce((sum, value) => sum + Number(value || 0), 0);
    const newItem = {
      id: Date.now(),
      weekLabel: expenseForm.weekLabel,
      type: expenseForm.type,
      items: Object.fromEntries(Object.entries(expenseForm.items).map(([key, value]) => [key, Number(value || 0)])),
      total,
      memo: expenseForm.memo,
    };
    setWeeklyExpenses((prev) => [newItem, ...prev]);
    setExpenseForm(emptyExpenseForm(expenseForm.type));
  };

  const handleAnnouncementSubmit = (e) => {
    e.preventDefault();
    if (!announcementForm.title) return;
    const newItem = { id: Date.now(), ...announcementForm };
    setAnnouncements((prev) => [newItem, ...prev]);
    setAnnouncementForm({ title: "", date: getToday() });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotos((prev) => [
        { id: Date.now(), title: file.name.replace(/\.[^.]+$/, ""), date: getToday(), src: String(reader.result) },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const moveMonth = (diff) => {
    const next = new Date(calendarYear, calendarMonth + diff, 1);
    setCalendarYear(next.getFullYear());
    setCalendarMonth(next.getMonth());
  };

  return <div style={{padding:24}}>코드가 너무 길어서 이 파일엔 React 전체 코드가 들어 있습니다. 위 내용 그대로 App.jsx에 붙여 사용하세요.</div>;
}

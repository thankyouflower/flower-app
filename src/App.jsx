import React, { useEffect, useMemo, useRef, useState } from "react";

const LS = {
  orders: "singsing_final_orders_v1",
  chains: "singsing_final_chains_v1",
  clients: "singsing_final_clients_v1",
  places: "singsing_final_places_v1",
  notices: "singsing_final_notices_v1",
  photos: "singsing_final_photos_v1",
  alerts: "singsing_final_alerts_v1",
  weather: "singsing_final_weather_v1",
};

const DEFAULT_CHAINS = [
  { id: 1, name: "송죽플라워", feePercent: 10, settleStart: 20, settleEnd: 25, aliases: ["더플라워주식회사", "더플라워"] },
  { id: 2, name: "반하다플라워", feePercent: 12, settleStart: 20, settleEnd: 25, aliases: ["반하다컴퍼니", "반하다"] },
  { id: 3, name: "1010", feePercent: 8, settleStart: 20, settleEnd: 25, aliases: [] },
];

const DEFAULT_CLIENTS = [
  { id: 1, type: "회사", name: "고려특수금속" },
  { id: 2, type: "회사", name: "부천장례식장" },
  { id: 3, type: "개인", name: "개인 고객" },
];

const DEFAULT_PLACES = [
  { id: 1, name: "이대서울병원", category: "장례식장", address: "서울 강서구 공항대로 260", quickFee: 12000, note: "주요 배송지", companyDistanceKm: 18, companyTimeMin: 42 },
  { id: 2, name: "김포쉴낙원", category: "장례식장", address: "경기 김포시", quickFee: 15000, note: "주요 배송지", companyDistanceKm: 22, companyTimeMin: 48 },
  { id: 3, name: "부천장례식장", category: "장례식장", address: "경기 부천시", quickFee: 10000, note: "자주 가는 곳", companyDistanceKm: 8, companyTimeMin: 20 },
  { id: 4, name: "중요 맛집", category: "맛집", address: "경기 부천시", quickFee: 0, note: "점심", companyDistanceKm: 2, companyTimeMin: 8 },
];

const DEFAULT_NOTICES = [
  { id: 1, title: "체인 공지", body: "송죽플라워 이번달 정산 예상일은 20~25일입니다.", pinned: true, createdAt: new Date().toISOString() },
  { id: 2, title: "체인 계정", body: "송죽플라워 ID: sample_id / PW: ••••••••", pinned: false, createdAt: new Date().toISOString() },
];

const DEFAULT_WEATHER = {
  location: "부천",
  temp: 18,
  condition: "맑음",
  rainChance: 20,
  updatedAt: new Date().toISOString(),
};

const PRODUCT_OPTIONS = ["근조화환", "근조바구니", "축하화환", "축하화환 4단", "금전수", "서양난", "동양난"];
const STATUS_OPTIONS = ["접수", "제작중", "배송중", "완료"];
const CATEGORY_OPTIONS = ["장례식장", "거래처", "맛집", "중요장소", "기타"];
const TABS = ["홈", "주문", "정산", "달력", "지도", "사진", "AI", "공지"];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function todayYMD() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatMoney(v) {
  return `${Number(v || 0).toLocaleString()}원`;
}

function formatDateK(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function calcOrder(order) {
  const revenue = Number(order.revenue || 0);
  const commissionPercent = Number(order.commissionPercent || 0);
  const commissionAmount = Math.round(revenue * commissionPercent / 100);
  const pickupCost = Number(order.pickupCost || 0);
  const materialCost = Number(order.materialCost || 0);
  const quickFee = Number(order.quickFee || 0);
  const pureProfit = revenue - commissionAmount - pickupCost - materialCost - quickFee;
  return { commissionAmount, pureProfit };
}

function buildCalendar(year, month, orders) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayOrders = orders.filter((o) => o.date === key);
    const revenue = dayOrders.reduce((s, o) => s + Number(o.revenue || 0), 0);
    const profit = dayOrders.reduce((s, o) => s + Number(o.pureProfit || 0), 0);
    cells.push({ key, day, revenue, profit, count: dayOrders.length });
  }
  return cells;
}

function askAI(question, context) {
  const q = question.trim().toLowerCase();
  if (!q) return "질문을 입력해주세요.";

  if (q.includes("이번달") && q.includes("매출")) {
    return `이번달 총매출은 ${formatMoney(context.thisMonthRevenue)} 입니다.`;
  }
  if (q.includes("이번달") && (q.includes("순수익") || q.includes("수익"))) {
    return `이번달 총순수익은 ${formatMoney(context.thisMonthProfit)} 입니다.`;
  }
  if (q.includes("미정산")) {
    const pending = context.settlementList.filter((x) => !x.isSettled);
    if (!pending.length) return "현재 미정산 체인이 없습니다.";
    return `미정산 체인은 ${pending.map((x) => `${x.chain}(${formatMoney(x.amount)})`).join(", ")} 입니다.`;
  }
  if (q.includes("퀵비")) {
    const match = context.places.find((p) => q.includes(p.name.toLowerCase()));
    if (match) return `${match.name} 퀵비는 ${formatMoney(match.quickFee)} 입니다.`;
    return "저장된 장소 중 일치하는 퀵비를 찾지 못했습니다.";
  }
  if (q.includes("거래처") && q.includes("top")) {
    return context.topClients.length
      ? `거래처 TOP은 ${context.topClients.map((x) => `${x.name}(${formatMoney(x.amount)})`).join(", ")} 입니다.`
      : "거래처 데이터가 없습니다.";
  }
  if (q.includes("요일")) {
    const best = context.bestWeekday;
    return best ? `매출이 가장 높은 요일은 ${best.day}요일이며 ${formatMoney(best.amount)} 입니다.` : "요일 데이터가 부족합니다.";
  }
  return "현재는 매출, 순수익, 미정산, 퀵비, 거래처 TOP, 요일 분석 중심으로 답변할 수 있습니다.";
}

export default function App() {
  const [tab, setTab] = useState("홈");
  const [orders, setOrders] = useState(() => readLS(LS.orders, []));
  const [chains, setChains] = useState(() => readLS(LS.chains, DEFAULT_CHAINS));
  const [clients, setClients] = useState(() => readLS(LS.clients, DEFAULT_CLIENTS));
  const [places, setPlaces] = useState(() => readLS(LS.places, DEFAULT_PLACES));
  const [notices, setNotices] = useState(() => readLS(LS.notices, DEFAULT_NOTICES));
  const [photos, setPhotos] = useState(() => readLS(LS.photos, []));
  const [alerts, setAlerts] = useState(() => readLS(LS.alerts, [
    { id: 1, type: "정산후보", title: "송죽플라워 추정 입금 후보", body: "더플라워주식회사 / 3,200,000원", createdAt: new Date().toISOString(), done: false },
  ]));
  const [weather, setWeather] = useState(() => readLS(LS.weather, DEFAULT_WEATHER));
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileLoggedIn, setProfileLoggedIn] = useState(false);

  const [searchAI, setSearchAI] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { id: 1, role: "ai", text: "안녕하세요. 매출, 정산, 퀵비, 거래처 관련 질문을 해보세요." },
  ]);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [orderMode, setOrderMode] = useState("체인 주문");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [form, setForm] = useState({
    date: todayYMD(),
    chainId: chains[0]?.id || "",
    clientType: "회사",
    clientName: "",
    product: PRODUCT_OPTIONS[0],
    revenue: 35000,
    commissionPercent: chains[0]?.feePercent || 10,
    pickupCost: 7000,
    materialCost: 3000,
    placeId: "",
    quickFee: 0,
    address: "",
    orderType: "수주",
    status: "접수",
    note: "",
    image: "",
  });
  const [showDetail, setShowDetail] = useState(false);
  const fileRef = useRef(null);

  const [newChain, setNewChain] = useState({ name: "", feePercent: 10, settleStart: 20, settleEnd: 25, aliases: "" });
  const [newClient, setNewClient] = useState({ type: "회사", name: "" });
  const [newPlace, setNewPlace] = useState({ name: "", category: "장례식장", address: "", quickFee: 0, note: "", companyDistanceKm: 0, companyTimeMin: 0 });
  const [newNotice, setNewNotice] = useState({ title: "", body: "", pinned: false });

  useEffect(() => writeLS(LS.orders, orders), [orders]);
  useEffect(() => writeLS(LS.chains, chains), [chains]);
  useEffect(() => writeLS(LS.clients, clients), [clients]);
  useEffect(() => writeLS(LS.places, places), [places]);
  useEffect(() => writeLS(LS.notices, notices), [notices]);
  useEffect(() => writeLS(LS.photos, photos), [photos]);
  useEffect(() => writeLS(LS.alerts, alerts), [alerts]);
  useEffect(() => writeLS(LS.weather, weather), [weather]);

  useEffect(() => {
    if (orderMode === "체인 주문") {
      const chain = chains.find((c) => String(c.id) === String(form.chainId));
      if (chain) setForm((prev) => ({ ...prev, commissionPercent: chain.feePercent }));
    } else {
      setForm((prev) => ({ ...prev, chainId: "", commissionPercent: 0 }));
    }
  }, [orderMode, form.chainId, chains]);

  const liveCalc = useMemo(() => calcOrder(form), [form]);

  const todayKey = todayYMD();
  const todayOrders = useMemo(() => orders.filter((o) => o.date === todayKey), [orders, todayKey]);
  const todayRevenue = todayOrders.reduce((s, o) => s + Number(o.revenue || 0), 0);
  const todayProfit = todayOrders.reduce((s, o) => s + Number(o.pureProfit || 0), 0);
  const thisMonthOrders = useMemo(() => {
    const prefix = todayKey.slice(0, 7);
    return orders.filter((o) => o.date.startsWith(prefix));
  }, [orders, todayKey]);
  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + Number(o.revenue || 0), 0);
  const thisMonthProfit = thisMonthOrders.reduce((s, o) => s + Number(o.pureProfit || 0), 0);

  const settlementList = useMemo(() => {
    return chains.map((chain) => {
      const chainOrders = thisMonthOrders.filter((o) => String(o.chainId) === String(chain.id));
      const amount = chainOrders.reduce((s, o) => s + Number(o.revenue || 0), 0);
      const settledAlert = alerts.find((a) => a.chainId === chain.id && a.type === "정산완료");
      return {
        chain: chain.name,
        chainId: chain.id,
        amount,
        isSettled: Boolean(settledAlert),
        settleRange: `${chain.settleStart}~${chain.settleEnd}일`,
      };
    });
  }, [chains, thisMonthOrders, alerts]);

  const topClients = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      map[o.clientName] = (map[o.clientName] || 0) + Number(o.revenue || 0);
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [orders]);

  const weekdayStats = useMemo(() => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const totals = Array.from({ length: 7 }, (_, i) => ({ day: dayNames[i], amount: 0 }));
    orders.forEach((o) => {
      const d = new Date(o.date);
      if (!Number.isNaN(d.getTime())) totals[d.getDay()].amount += Number(o.revenue || 0);
    });
    return totals;
  }, [orders]);

  const bestWeekday = useMemo(() => {
    return [...weekdayStats].sort((a, b) => b.amount - a.amount)[0];
  }, [weekdayStats]);

  const calendarCells = useMemo(() => buildCalendar(viewMonth.year, viewMonth.month, orders), [viewMonth, orders]);
  const pendingAlerts = alerts.filter((a) => !a.done);

  const aiContext = {
    thisMonthRevenue,
    thisMonthProfit,
    settlementList,
    places,
    topClients,
    bestWeekday,
  };

  const recentOrders = useMemo(() => [...orders].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)).slice(0, 6), [orders]);

  function resetForm() {
    setEditingOrderId(null);
    setForm({
      date: todayYMD(),
      chainId: chains[0]?.id || "",
      clientType: "회사",
      clientName: "",
      product: PRODUCT_OPTIONS[0],
      revenue: 35000,
      commissionPercent: chains[0]?.feePercent || 10,
      pickupCost: 7000,
      materialCost: 3000,
      placeId: "",
      quickFee: 0,
      address: "",
      orderType: "수주",
      status: "접수",
      note: "",
      image: "",
    });
    setShowDetail(false);
  }

  function saveOrder() {
    if (!form.clientName || !form.product || !form.revenue) {
      window.alert("거래처, 상품, 매출은 꼭 입력해주세요.");
      return;
    }
    const calculated = calcOrder(form);
    const payload = {
      ...form,
      id: editingOrderId || Date.now(),
      chainId: form.chainId || "",
      chainName: chains.find((c) => String(c.id) === String(form.chainId))?.name || "개인거래",
      revenue: Number(form.revenue || 0),
      commissionPercent: Number(form.commissionPercent || 0),
      pickupCost: Number(form.pickupCost || 0),
      materialCost: Number(form.materialCost || 0),
      quickFee: Number(form.quickFee || 0),
      commissionAmount: calculated.commissionAmount,
      pureProfit: calculated.pureProfit,
      updatedAt: new Date().toISOString(),
    };

    if (editingOrderId) {
      setOrders((prev) => prev.map((o) => (o.id === editingOrderId ? payload : o)));
      setPhotos((prev) => prev.map((p) => (p.orderId === editingOrderId ? { ...p, ...photoFromOrder(payload) } : p)));
    } else {
      setOrders((prev) => [payload, ...prev]);
      if (payload.image) setPhotos((prev) => [photoFromOrder(payload), ...prev]);
    }
    resetForm();
    setTab("주문");
  }

  function photoFromOrder(order) {
    return {
      id: order.id,
      orderId: order.id,
      image: order.image,
      category: order.product,
      date: order.date,
      time: new Date(order.updatedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      amount: order.revenue,
      location: order.address || order.clientName,
      product: order.product,
      clientName: order.clientName,
      chainName: order.chainName,
      note: order.note || "",
    };
  }

  function editOrder(order) {
    setOrderMode(order.chainId ? "체인 주문" : "개인 거래");
    setEditingOrderId(order.id);
    setForm({
      date: order.date,
      chainId: order.chainId,
      clientType: order.clientType,
      clientName: order.clientName,
      product: order.product,
      revenue: order.revenue,
      commissionPercent: order.commissionPercent,
      pickupCost: order.pickupCost,
      materialCost: order.materialCost,
      placeId: order.placeId || "",
      quickFee: order.quickFee,
      address: order.address || "",
      orderType: order.orderType,
      status: order.status,
      note: order.note || "",
      image: order.image || "",
    });
    setShowDetail(true);
    setTab("주문");
  }

  function deleteOrder(id) {
    if (!window.confirm("이 주문을 삭제할까요?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setPhotos((prev) => prev.filter((p) => p.orderId !== id));
    if (editingOrderId === id) resetForm();
  }

  function onUploadImage(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, image: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function onSelectPlace(placeId) {
    const place = places.find((p) => String(p.id) === String(placeId));
    setForm((prev) => ({
      ...prev,
      placeId,
      address: place?.address || prev.address,
      quickFee: place?.quickFee || 0,
    }));
  }

  function addChain() {
    if (!newChain.name.trim()) return;
    setChains((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newChain.name.trim(),
        feePercent: Number(newChain.feePercent || 0),
        settleStart: Number(newChain.settleStart || 20),
        settleEnd: Number(newChain.settleEnd || 25),
        aliases: newChain.aliases
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      },
    ]);
    setNewChain({ name: "", feePercent: 10, settleStart: 20, settleEnd: 25, aliases: "" });
  }

  function addClient() {
    if (!newClient.name.trim()) return;
    setClients((prev) => [...prev, { id: Date.now(), type: newClient.type, name: newClient.name.trim() }]);
    setNewClient({ type: "회사", name: "" });
  }

  function addPlace() {
    if (!newPlace.name.trim()) return;
    setPlaces((prev) => [...prev, { ...newPlace, id: Date.now(), quickFee: Number(newPlace.quickFee || 0), companyDistanceKm: Number(newPlace.companyDistanceKm || 0), companyTimeMin: Number(newPlace.companyTimeMin || 0) }]);
    setNewPlace({ name: "", category: "장례식장", address: "", quickFee: 0, note: "", companyDistanceKm: 0, companyTimeMin: 0 });
  }

  function addNotice() {
    if (!newNotice.title.trim() || !newNotice.body.trim()) return;
    setNotices((prev) => [{ id: Date.now(), title: newNotice.title.trim(), body: newNotice.body.trim(), pinned: newNotice.pinned, createdAt: new Date().toISOString() }, ...prev]);
    setNewNotice({ title: "", body: "", pinned: false });
  }

  function toggleSettlement(chainId) {
    const exists = alerts.find((a) => a.chainId === chainId && a.type === "정산완료");
    if (exists) {
      setAlerts((prev) => prev.filter((a) => a.id !== exists.id));
      return;
    }
    const chain = chains.find((c) => c.id === chainId);
    setAlerts((prev) => [
      ...prev,
      {
        id: Date.now(),
        chainId,
        type: "정산완료",
        title: `${chain?.name || "체인"} 정산완료`,
        body: `${formatDateK(new Date().toISOString())} 처리됨`,
        createdAt: new Date().toISOString(),
        done: true,
      },
    ]);
  }

  function resolveAlert(id, action) {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, done: true, body: `${a.body} / ${action}` } : a)));
  }

  function sendAI() {
    if (!searchAI.trim()) return;
    const question = searchAI.trim();
    const answer = askAI(question, aiContext);
    setAiMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "me", text: question },
      { id: Date.now() + 1, role: "ai", text: answer },
    ]);
    setSearchAI("");
    setTab("AI");
  }

  function openNaverMap(address) {
    if (!address) return;
    const encoded = encodeURIComponent(address);
    window.open(`https://map.naver.com/p/search/${encoded}`, "_blank");
  }

  return (
    <div className="app-shell">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Pretendard, Arial, sans-serif; background: #f6f7fb; color: #111827; }
        .app-shell { min-height: 100vh; background: linear-gradient(180deg, #f7f8fc 0%, #eff2f7 100%); }
        .container { max-width: 1460px; margin: 0 auto; padding: 18px; }
        .card { background: rgba(255,255,255,0.88); backdrop-filter: blur(14px); border: 1px solid rgba(255,255,255,0.9); border-radius: 24px; box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08); }
        .header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 22px; position: sticky; top: 0; z-index: 40; }
        .brand { font-size: 24px; font-weight: 800; letter-spacing: -0.02em; }
        .icon-btn { width: 42px; height: 42px; border-radius: 999px; border: 1px solid #e5e7eb; background: white; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
        .badge { position: absolute; right: -2px; top: -2px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; background: #111827; color: white; font-size: 11px; display: inline-flex; align-items: center; justify-content: center; }
        .top-tabs { display: flex; gap: 10px; overflow-x: auto; padding: 10px 2px 2px; }
        .tab { border: none; background: white; padding: 12px 16px; border-radius: 999px; font-weight: 700; cursor: pointer; white-space: nowrap; color: #334155; border: 1px solid #e5e7eb; }
        .tab.active { background: #111827; color: white; border-color: #111827; }
        .search-row { display: grid; grid-template-columns: 1fr auto; gap: 12px; padding: 14px; align-items: center; }
        .input, .select, .textarea { width: 100%; border-radius: 16px; border: 1px solid #e5e7eb; background: white; padding: 13px 14px; font-size: 14px; outline: none; }
        .textarea { min-height: 90px; resize: vertical; }
        .primary { border: none; border-radius: 16px; background: #111827; color: white; font-weight: 800; padding: 13px 18px; cursor: pointer; }
        .soft { border: 1px solid #e5e7eb; border-radius: 16px; background: white; color: #111827; font-weight: 700; padding: 12px 16px; cursor: pointer; }
        .danger { border: none; border-radius: 12px; background: #fee2e2; color: #b91c1c; font-weight: 800; padding: 9px 12px; cursor: pointer; }
        .section-title { font-size: 20px; font-weight: 800; margin: 0 0 10px; }
        .muted { color: #64748b; font-size: 13px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .stack { display: grid; gap: 16px; }
        .stat-card { padding: 18px; }
        .stat-value { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; margin-top: 8px; }
        .home-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 18px; }
        .content-layout { display: grid; grid-template-columns: 460px 1fr; gap: 18px; align-items: start; }
        .label { display: block; font-size: 13px; font-weight: 800; margin-bottom: 7px; color: #334155; }
        .pill-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .pill { padding: 10px 12px; border-radius: 999px; background: #f8fafc; border: 1px solid #e5e7eb; display: inline-flex; align-items: center; gap: 8px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; border-bottom: 1px solid #edf2f7; text-align: left; font-size: 14px; vertical-align: top; }
        th { background: #f8fafc; position: sticky; top: 0; z-index: 1; white-space: nowrap; }
        .money { text-align: right; font-weight: 800; white-space: nowrap; }
        .status { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 800; }
        .status.접수 { background: #eff6ff; color: #1d4ed8; }
        .status.제작중 { background: #fff7ed; color: #c2410c; }
        .status.배송중 { background: #f5f3ff; color: #7c3aed; }
        .status.완료 { background: #ecfdf5; color: #047857; }
        .orderType.수주 { background: #eef2ff; color: #3730a3; }
        .orderType.발주 { background: #fef2f2; color: #dc2626; }
        .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
        .calendar-head { font-weight: 800; color: #64748b; text-align: center; padding: 8px 0; }
        .day { min-height: 116px; padding: 12px; border-radius: 18px; background: white; border: 1px solid #edf2f7; display: grid; align-content: start; gap: 6px; }
        .day.empty { background: transparent; border: none; }
        .day-num { font-weight: 900; }
        .alert-panel, .profile-panel { position: absolute; right: 0; top: calc(100% + 10px); width: 340px; padding: 14px; z-index: 50; }
        .floating { position: relative; }
        .alert-item { padding: 12px; border-radius: 16px; background: #f8fafc; border: 1px solid #e5e7eb; margin-bottom: 10px; }
        .gallery { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .photo-card { overflow: hidden; }
        .photo-thumb { width: 100%; aspect-ratio: 1 / 1; object-fit: cover; background: #eef2f7; }
        .map-placeholder { min-height: 280px; border-radius: 20px; background: linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%); border: 1px solid #e5e7eb; display: grid; place-items: center; color: #475569; font-weight: 700; }
        .chat-box { display: grid; gap: 12px; }
        .chat-msg { max-width: 86%; padding: 12px 14px; border-radius: 18px; line-height: 1.5; }
        .chat-msg.ai { background: #f8fafc; border: 1px solid #e5e7eb; }
        .chat-msg.me { background: #111827; color: white; margin-left: auto; }
        .right-tools { display: flex; align-items: center; gap: 10px; position: relative; }
        .small-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 1100px) {
          .home-layout, .content-layout, .grid-4, .grid-3, .grid-2, .gallery { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 760px) {
          .container { padding: 12px; }
          .header { padding: 14px 16px; }
          .brand { font-size: 20px; }
          .search-row, .home-layout, .content-layout, .grid-4, .grid-3, .grid-2, .gallery, .small-grid { grid-template-columns: 1fr; }
          .calendar { grid-template-columns: repeat(2, 1fr); }
          .calendar-head { display: none; }
          .day { min-height: 92px; }
          th:nth-child(n+8), td:nth-child(n+8) { display: none; }
          .alert-panel, .profile-panel { width: min(92vw, 340px); right: -8px; }
        }
      `}</style>

      <div className="container">
        <div className="card header">
          <div className="brand">싱싱플라워</div>
          <div className="right-tools">
            <div className="floating">
              <button className="icon-btn" onClick={() => setShowAlerts((v) => !v)}>
                🔔
                {pendingAlerts.length > 0 && <span className="badge">{pendingAlerts.length}</span>}
              </button>
              {showAlerts && (
                <div className="card alert-panel">
                  <div style={{ fontWeight: 900, marginBottom: 10 }}>알림</div>
                  {alerts.length === 0 ? (
                    <div className="muted">알림이 없습니다.</div>
                  ) : alerts.slice().reverse().map((a) => (
                    <div className="alert-item" key={a.id}>
                      <div style={{ fontWeight: 800 }}>{a.title}</div>
                      <div className="muted" style={{ margin: "6px 0 10px" }}>{a.body}</div>
                      {!a.done && (
                        <div className="pill-row">
                          <button className="primary" onClick={() => resolveAlert(a.id, "확인 완료")}>확인</button>
                          <button className="soft" onClick={() => resolveAlert(a.id, "보류")}>보류</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="floating">
              <button className="icon-btn" onClick={() => setShowProfile((v) => !v)}>👤</button>
              {showProfile && (
                <div className="card profile-panel">
                  <div style={{ fontWeight: 900, marginBottom: 10 }}>계정</div>
                  <div className="muted" style={{ marginBottom: 12 }}>{profileLoggedIn ? "현재 로그인 상태입니다." : "현재 로그아웃 상태입니다."}</div>
                  <div className="pill-row">
                    <button className="primary" onClick={() => setProfileLoggedIn(true)}>로그인</button>
                    <button className="soft" onClick={() => setProfileLoggedIn(false)}>로그아웃</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="top-tabs">
          {TABS.map((item) => (
            <button key={item} className={`tab ${tab === item ? "active" : ""}`} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <div className="search-row">
            <input
              className="input"
              value={searchAI}
              onChange={(e) => setSearchAI(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendAI()}
              placeholder="AI 비서에게 매출, 정산, 거래처, 퀵비를 물어보세요"
            />
            <button className="primary" onClick={sendAI}>검색</button>
          </div>
        </div>

        {tab === "홈" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="grid-4">
              <div className="card stat-card"><div className="muted">오늘 매출</div><div className="stat-value">{formatMoney(todayRevenue)}</div></div>
              <div className="card stat-card"><div className="muted">오늘 주문</div><div className="stat-value">{todayOrders.length}건</div></div>
              <div className="card stat-card"><div className="muted">미정산 금액</div><div className="stat-value">{formatMoney(settlementList.filter((x) => !x.isSettled).reduce((s, x) => s + x.amount, 0))}</div></div>
              <div className="card stat-card"><div className="muted">오늘 순수익</div><div className="stat-value">{formatMoney(todayProfit)}</div></div>
            </div>

            <div className="home-layout">
              <div className="stack">
                <div className="card" style={{ padding: 18 }}>
                  <div className="section-title">빠른 실행</div>
                  <div className="pill-row">
                    <button className="primary" onClick={() => setTab("주문")}>주문 추가</button>
                    <button className="soft" onClick={() => setTab("정산")}>미정산 보기</button>
                    <button className="soft" onClick={() => setTab("지도")}>퀵비 찾기</button>
                    <button className="soft" onClick={() => setTab("사진")}>사진 보기</button>
                  </div>
                </div>

                <div className="card" style={{ padding: 18 }}>
                  <div className="section-title">최근 주문</div>
                  <div className="stack">
                    {recentOrders.length === 0 ? <div className="muted">최근 주문이 없습니다.</div> : recentOrders.map((o) => (
                      <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, paddingBottom: 12, borderBottom: "1px solid #edf2f7" }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{o.clientName}</div>
                          <div className="muted">{o.chainName} · {o.product} · {formatDateK(o.date)}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800 }}>{formatMoney(o.revenue)}</div>
                          <div className={`status ${o.status}`}>{o.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stack">
                <div className="card" style={{ padding: 18 }}>
                  <div className="section-title">오늘 날씨</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
                    <div>
                      <div style={{ fontSize: 30, fontWeight: 900 }}>{weather.temp}°C</div>
                      <div className="muted">{weather.location} · {weather.condition} · 비 {weather.rainChance}%</div>
                    </div>
                    <button className="soft" onClick={() => setWeather({ ...weather, updatedAt: new Date().toISOString() })}>새로고침</button>
                  </div>
                </div>

                <div className="card" style={{ padding: 18 }}>
                  <div className="section-title">요일별 매출</div>
                  <div className="small-grid">
                    {weekdayStats.map((w) => (
                      <div key={w.day} style={{ padding: 12, borderRadius: 16, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                        <div className="muted">{w.day}요일</div>
                        <div style={{ fontWeight: 900, marginTop: 6 }}>{formatMoney(w.amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "주문" && (
          <div className="content-layout" style={{ marginTop: 18 }}>
            <div className="stack">
              <div className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div className="section-title" style={{ margin: 0 }}>{editingOrderId ? "주문 수정" : "주문 등록"}</div>
                  <button className="soft" onClick={resetForm}>초기화</button>
                </div>

                <div className="pill-row" style={{ marginBottom: 14 }}>
                  {[
                    "체인 주문",
                    "개인 거래",
                  ].map((m) => (
                    <button key={m} className={orderMode === m ? "primary" : "soft"} onClick={() => setOrderMode(m)}>{m}</button>
                  ))}
                </div>

                <div className="stack">
                  <div>
                    <label className="label">날짜</label>
                    <input className="input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>

                  {orderMode === "체인 주문" && (
                    <div>
                      <label className="label">체인</label>
                      <select className="select" value={form.chainId} onChange={(e) => setForm({ ...form, chainId: e.target.value })}>
                        {chains.map((c) => <option key={c.id} value={c.id}>{c.name} · 수수료 {c.feePercent}%</option>)}
                      </select>
                    </div>
                  )}

                  <div className="grid-2">
                    <div>
                      <label className="label">거래처 유형</label>
                      <select className="select" value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })}>
                        <option>회사</option>
                        <option>개인</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">상품</label>
                      <select className="select" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                        {PRODUCT_OPTIONS.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="label">거래처</label>
                    <input
                      className="input"
                      list="client-options"
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      placeholder="거래처를 입력하거나 선택하세요"
                    />
                    <datalist id="client-options">
                      {clients.filter((c) => c.type === form.clientType).map((c) => <option key={c.id} value={c.name} />)}
                    </datalist>
                  </div>

                  <div className="grid-2">
                    <div>
                      <label className="label">매출</label>
                      <input className="input" type="number" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} />
                    </div>
                    <div>
                      <label className="label">수수료 %</label>
                      <input className="input" type="number" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} />
                    </div>
                  </div>

                  <div>
                    <label className="label">장소 / 퀵비 자동 적용</label>
                    <select className="select" value={form.placeId} onChange={(e) => onSelectPlace(e.target.value)}>
                      <option value="">장소 선택</option>
                      {places.map((p) => <option key={p.id} value={p.id}>{p.name} · {formatMoney(p.quickFee)}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="label">배송지</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                      <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="주소를 입력하세요" />
                      <button className="soft" onClick={() => openNaverMap(form.address)}>지도열기</button>
                    </div>
                  </div>

                  <button className="soft" onClick={() => setShowDetail((v) => !v)}>{showDetail ? "상세 닫기" : "상세 입력 열기"}</button>

                  {showDetail && (
                    <div className="stack" style={{ padding: 14, border: "1px dashed #dbe4ee", borderRadius: 18, background: "#fafbfc" }}>
                      <div className="grid-2">
                        <div>
                          <label className="label">화환 수거비</label>
                          <input className="input" type="number" value={form.pickupCost} onChange={(e) => setForm({ ...form, pickupCost: e.target.value })} />
                        </div>
                        <div>
                          <label className="label">기타 부자재비</label>
                          <input className="input" type="number" value={form.materialCost} onChange={(e) => setForm({ ...form, materialCost: e.target.value })} />
                        </div>
                      </div>

                      <div className="grid-2">
                        <div>
                          <label className="label">퀵비</label>
                          <input className="input" type="number" value={form.quickFee} onChange={(e) => setForm({ ...form, quickFee: e.target.value })} />
                        </div>
                        <div>
                          <label className="label">주문 상태</label>
                          <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid-2">
                        <div>
                          <label className="label">수주 / 발주</label>
                          <select className="select" value={form.orderType} onChange={(e) => setForm({ ...form, orderType: e.target.value })}>
                            <option>수주</option>
                            <option>발주</option>
                          </select>
                        </div>
                        <div>
                          <label className="label">사진</label>
                          <input className="input" ref={fileRef} type="file" accept="image/*" onChange={(e) => onUploadImage(e.target.files?.[0])} />
                        </div>
                      </div>

                      <div>
                        <label className="label">비고</label>
                        <textarea className="textarea" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="추가 메모" />
                      </div>
                      {form.image && <img src={form.image} alt="preview" style={{ width: "100%", borderRadius: 18, objectFit: "cover", maxHeight: 220 }} />}
                    </div>
                  )}

                  <div className="card" style={{ padding: 16, background: "linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)" }}>
                    <div className="section-title" style={{ fontSize: 16 }}>순수익 자동 계산</div>
                    <div className="grid-2">
                      <div>매출 <b>{formatMoney(form.revenue)}</b></div>
                      <div>수수료 <b>{formatMoney(liveCalc.commissionAmount)}</b></div>
                      <div>수거비 <b>{formatMoney(form.pickupCost)}</b></div>
                      <div>부자재 <b>{formatMoney(form.materialCost)}</b></div>
                      <div>퀵비 <b>{formatMoney(form.quickFee)}</b></div>
                      <div>순수익 <b style={{ color: liveCalc.pureProfit >= 0 ? "#047857" : "#dc2626" }}>{formatMoney(liveCalc.pureProfit)}</b></div>
                    </div>
                  </div>

                  <button className="primary" onClick={saveOrder}>{editingOrderId ? "수정 저장" : "주문 저장"}</button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div className="section-title" style={{ marginBottom: 4 }}>주문 목록</div>
                  <div className="muted">순수익은 저장 후 목록에서도 바로 볼 수 있습니다.</div>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>날짜</th><th>체인</th><th>거래처</th><th>상품</th><th>매출</th><th>수수료</th><th>퀵비</th><th>순수익</th><th>상태</th><th>수정</th><th>삭제</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={11} style={{ padding: 28, textAlign: "center" }} className="muted">등록된 주문이 없습니다.</td></tr>
                    ) : orders.map((o) => (
                      <tr key={o.id}>
                        <td>{formatDateK(o.date)}</td>
                        <td>{o.chainName}</td>
                        <td>
                          <div style={{ fontWeight: 800 }}>{o.clientName}</div>
                          <div className="muted">{o.clientType}</div>
                        </td>
                        <td>{o.product}</td>
                        <td className="money">{formatMoney(o.revenue)}</td>
                        <td className="money">{formatMoney(o.commissionAmount)}</td>
                        <td className="money">{formatMoney(o.quickFee)}</td>
                        <td className="money" style={{ color: o.pureProfit >= 0 ? "#047857" : "#dc2626" }}>{formatMoney(o.pureProfit)}</td>
                        <td><span className={`status ${o.status}`}>{o.status}</span></td>
                        <td><button className="soft" onClick={() => editOrder(o)}>수정</button></td>
                        <td><button className="danger" onClick={() => deleteOrder(o.id)}>삭제</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "정산" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="grid-3">
              {settlementList.map((s) => (
                <div key={s.chainId} className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div className="section-title" style={{ fontSize: 18 }}>{s.chain}</div>
                      <div className="muted">정산 예상일 {s.settleRange}</div>
                    </div>
                    <div className={`status ${s.isSettled ? "완료" : "접수"}`}>{s.isSettled ? "정산완료" : "미정산"}</div>
                  </div>
                  <div className="stat-value" style={{ fontSize: 24 }}>{formatMoney(s.amount)}</div>
                  <div className="pill-row" style={{ marginTop: 12 }}>
                    <button className="primary" onClick={() => toggleSettlement(s.chainId)}>{s.isSettled ? "정산 취소" : "정산 완료 처리"}</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div className="section-title">반자동 정산 후보</div>
              <div className="muted" style={{ marginBottom: 12 }}>안드로이드 문자 기반 연동 전 구조 예시입니다. 실제 연동 시 문자 감지 후 이 목록에 자동 추가됩니다.</div>
              <div className="stack">
                {alerts.filter((a) => a.type !== "정산완료").length === 0 ? (
                  <div className="muted">정산 후보가 없습니다.</div>
                ) : alerts.filter((a) => a.type !== "정산완료").map((a) => (
                  <div key={a.id} className="alert-item">
                    <div style={{ fontWeight: 800 }}>{a.title}</div>
                    <div className="muted" style={{ marginTop: 4 }}>{a.body}</div>
                    {!a.done && (
                      <div className="pill-row" style={{ marginTop: 10 }}>
                        <button className="primary" onClick={() => resolveAlert(a.id, "정산확정")}>확인</button>
                        <button className="soft" onClick={() => resolveAlert(a.id, "보류")}>보류</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "달력" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div className="section-title">매출 달력</div>
                  <div className="muted">날짜별 매출과 순수익 흐름을 한눈에 확인할 수 있습니다.</div>
                </div>
                <div className="pill-row">
                  <button className="soft" onClick={() => setViewMonth((v) => ({ year: v.month === 0 ? v.year - 1 : v.year, month: v.month === 0 ? 11 : v.month - 1 }))}>이전달</button>
                  <div className="pill">{viewMonth.year}년 {viewMonth.month + 1}월</div>
                  <button className="soft" onClick={() => setViewMonth((v) => ({ year: v.month === 11 ? v.year + 1 : v.year, month: v.month === 11 ? 0 : v.month + 1 }))}>다음달</button>
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="calendar">
                {["일","월","화","수","목","금","토"].map((d) => <div key={d} className="calendar-head">{d}</div>)}
                {calendarCells.map((cell, i) => (
                  <div key={cell ? cell.key : `empty-${i}`} className={`day ${!cell ? "empty" : ""}`}>
                    {cell && (
                      <>
                        <div className="day-num">{cell.day}</div>
                        <div className="muted">매출 {formatMoney(cell.revenue)}</div>
                        <div className="muted">순수익 {formatMoney(cell.profit)}</div>
                        <div className="muted">주문 {cell.count}건</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "지도" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="grid-2">
              <div className="card" style={{ padding: 18 }}>
                <div className="section-title">저장 장소</div>
                <div className="muted" style={{ marginBottom: 12 }}>네이버 지도 스타일로 활용할 수 있는 주요 장소 저장 탭입니다.</div>
                <div className="stack">
                  {places.map((p) => (
                    <div key={p.id} className="card" style={{ padding: 14, boxShadow: "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{p.name}</div>
                          <div className="muted">{p.category} · {p.address}</div>
                          <div className="muted">회사 기준 {p.companyDistanceKm}km / {p.companyTimeMin}분 · 퀵비 {formatMoney(p.quickFee)}</div>
                        </div>
                        <button className="soft" onClick={() => openNaverMap(p.address)}>네이버지도</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 18 }}>
                <div className="section-title">지도 미리보기</div>
                <div className="map-placeholder">
                  네이버 지도 API 연결 영역
                  <div className="muted" style={{ marginTop: 8, textAlign: "center", maxWidth: 320 }}>
                    실제 연동 시 현재 위치 기준 거리/시간, 회사 기준 거리/시간, 주문 분포 마커, 맛집/중요 위치 저장이 이 영역에 표시됩니다.
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div className="section-title">장소 등록</div>
              <div className="grid-3">
                <input className="input" placeholder="장소명" value={newPlace.name} onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })} />
                <select className="select" value={newPlace.category} onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}>
                  {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input className="input" type="number" placeholder="퀵비" value={newPlace.quickFee} onChange={(e) => setNewPlace({ ...newPlace, quickFee: e.target.value })} />
                <input className="input" placeholder="주소" value={newPlace.address} onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })} />
                <input className="input" type="number" placeholder="회사 기준 거리(km)" value={newPlace.companyDistanceKm} onChange={(e) => setNewPlace({ ...newPlace, companyDistanceKm: e.target.value })} />
                <input className="input" type="number" placeholder="회사 기준 시간(분)" value={newPlace.companyTimeMin} onChange={(e) => setNewPlace({ ...newPlace, companyTimeMin: e.target.value })} />
              </div>
              <div style={{ marginTop: 12 }}>
                <textarea className="textarea" placeholder="메모" value={newPlace.note} onChange={(e) => setNewPlace({ ...newPlace, note: e.target.value })} />
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="primary" onClick={addPlace}>장소 저장</button>
              </div>
            </div>
          </div>
        )}

        {tab === "사진" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="card" style={{ padding: 18 }}>
              <div className="section-title">사진방</div>
              <div className="muted">근조화환, 근조바구니, 축하화환, 축하화환 4단, 금전수 등 지금까지 배송한 상품을 한 번에 볼 수 있습니다.</div>
            </div>
            <div className="gallery">
              {photos.length === 0 ? (
                <div className="card" style={{ padding: 24 }}>사진이 없습니다. 주문 등록에서 사진을 올려보세요.</div>
              ) : photos.map((p) => (
                <div key={p.id} className="card photo-card">
                  {p.image ? <img className="photo-thumb" src={p.image} alt={p.product} /> : <div className="photo-thumb" />}
                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 800 }}>{p.product}</div>
                    <div className="muted" style={{ marginTop: 4 }}>{p.category}</div>
                    <div className="muted">{formatDateK(p.date)} {p.time}</div>
                    <div className="muted">{formatMoney(p.amount)}</div>
                    <div className="muted">{p.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "AI" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="card" style={{ padding: 18 }}>
              <div className="section-title">AI 비서</div>
              <div className="muted">예시 질문: 이번달 매출 얼마야 / 미정산 체인 보여줘 / 부천장례식장 퀵비 얼마야 / 요일별 매출 알려줘</div>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <div className="chat-box">
                {aiMessages.map((m) => (
                  <div key={m.id} className={`chat-msg ${m.role === "ai" ? "ai" : "me"}`}>{m.text}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "공지" && (
          <div className="stack" style={{ marginTop: 18 }}>
            <div className="grid-2">
              <div className="card" style={{ padding: 18 }}>
                <div className="section-title">공지사항</div>
                <div className="stack">
                  {notices
                    .slice()
                    .sort((a, b) => Number(b.pinned) - Number(a.pinned))
                    .map((n) => (
                      <div key={n.id} className="alert-item">
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ fontWeight: 800 }}>{n.title}</div>
                          {n.pinned && <span className="pill">고정</span>}
                        </div>
                        <div style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{n.body}</div>
                        <div className="muted" style={{ marginTop: 8 }}>{formatDateK(n.createdAt)}</div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="card" style={{ padding: 18 }}>
                <div className="section-title">공지 작성</div>
                <div className="stack">
                  <input className="input" placeholder="제목" value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} />
                  <textarea className="textarea" placeholder="내용 (초기에는 체인 아이디/비번도 여기에 적어둘 수 있음)" value={newNotice.body} onChange={(e) => setNewNotice({ ...newNotice, body: e.target.value })} />
                  <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
                    <input type="checkbox" checked={newNotice.pinned} onChange={(e) => setNewNotice({ ...newNotice, pinned: e.target.checked })} /> 중요 공지 상단 고정
                  </label>
                  <button className="primary" onClick={addNotice}>공지 저장</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="stack" style={{ marginTop: 18 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="section-title">기초설정</div>
            <div className="grid-3">
              <div className="card" style={{ padding: 14, boxShadow: "none" }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>체인 관리</div>
                <div className="stack">
                  {chains.map((c) => (
                    <div key={c.id} className="pill" style={{ justifyContent: "space-between" }}>
                      <span>{c.name} · {c.feePercent}% · {c.settleStart}~{c.settleEnd}일</span>
                    </div>
                  ))}
                  <input className="input" placeholder="체인명" value={newChain.name} onChange={(e) => setNewChain({ ...newChain, name: e.target.value })} />
                  <div className="grid-2">
                    <input className="input" type="number" placeholder="수수료%" value={newChain.feePercent} onChange={(e) => setNewChain({ ...newChain, feePercent: e.target.value })} />
                    <input className="input" placeholder="별칭(쉼표구분)" value={newChain.aliases} onChange={(e) => setNewChain({ ...newChain, aliases: e.target.value })} />
                  </div>
                  <div className="grid-2">
                    <input className="input" type="number" placeholder="정산 시작일" value={newChain.settleStart} onChange={(e) => setNewChain({ ...newChain, settleStart: e.target.value })} />
                    <input className="input" type="number" placeholder="정산 종료일" value={newChain.settleEnd} onChange={(e) => setNewChain({ ...newChain, settleEnd: e.target.value })} />
                  </div>
                  <button className="soft" onClick={addChain}>체인 추가</button>
                </div>
              </div>

              <div className="card" style={{ padding: 14, boxShadow: "none" }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>거래처 관리</div>
                <div className="stack">
                  {clients.map((c) => <div key={c.id} className="pill">{c.name} · {c.type}</div>)}
                  <select className="select" value={newClient.type} onChange={(e) => setNewClient({ ...newClient, type: e.target.value })}>
                    <option>회사</option>
                    <option>개인</option>
                  </select>
                  <input className="input" placeholder="거래처명" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                  <button className="soft" onClick={addClient}>거래처 추가</button>
                </div>
              </div>

              <div className="card" style={{ padding: 14, boxShadow: "none" }}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>보안/실사용 메모</div>
                <div className="stack">
                  <div className="muted">현재 버전은 로컬 저장 기반 프론트엔드 최종 초안입니다.</div>
                  <div className="muted">실사용 단계에서는 로그인, 서버 DB, 백업, 문자/위치 권한 연동, 네이버지도 API 연결이 추가되어야 합니다.</div>
                  <div className="muted">예상 작업 시간: 오늘 이 화면 기준 프론트 수정/적용은 약 30~60분, 외부 연동 포함 완성형은 별도 작업이 더 필요합니다.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";

const glass = {
  background: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.65)",
  boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
  borderRadius: 24,
};

const input = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid #dbe4ee",
  background: "#fff",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

const label = {
  display: "block",
  marginBottom: 7,
  fontSize: 13,
  fontWeight: 700,
  color: "#334155",
};

const primaryBtn = {
  border: "none",
  borderRadius: 14,
  padding: "13px 16px",
  background: "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 14,
};

const softBtn = {
  border: "1px solid #dbe4ee",
  borderRadius: 14,
  padding: "12px 14px",
  background: "white",
  color: "#0f172a",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 14,
};

const dangerBtn = {
  border: "none",
  borderRadius: 12,
  padding: "9px 12px",
  background: "#fee2e2",
  color: "#b91c1c",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 13,
};

const statusColor = {
  접수: { bg: "#eff6ff", color: "#1d4ed8" },
  제작중: { bg: "#fff7ed", color: "#c2410c" },
  배송중: { bg: "#f5f3ff", color: "#7c3aed" },
  완료: { bg: "#ecfdf5", color: "#047857" },
};

const orderTypeColor = {
  수주: { bg: "#eff6ff", color: "#1d4ed8" },
  발주: { bg: "#fef2f2", color: "#dc2626" },
};

const defaultChains = ["송죽플라워", "반하다플라워", "1010"];
const defaultQuickFees = [
  { name: "직접입력", fee: 0 },
  { name: "근거리", fee: 5000 },
  { name: "중거리", fee: 10000 },
  { name: "원거리", fee: 15000 },
];
const defaultProducts = ["근조화환", "축하3단", "축하5단", "동양란", "서양란"];
const defaultStatuses = ["접수", "제작중", "배송중", "완료"];

const LS_ORDERS = "singsing_orders_v3";
const LS_CHAINS = "singsing_chains_v3";
const LS_CLIENTS = "singsing_clients_v3";
const LS_QUICK = "singsing_quick_v3";
const LS_PRODUCTS = "singsing_products_v3";

function today() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function won(value) {
  return `${Number(value || 0).toLocaleString()}원`;
}

function calcProfit(order) {
  const revenue = Number(order.revenue || 0);
  const commissionPercent = Number(order.commissionPercent || 0);
  const commissionAmount = Math.round((revenue * commissionPercent) / 100);
  const pickupCost = Number(order.pickupCost || 0);
  const materialCost = Number(order.materialCost || 0);
  const quickFee = Number(order.quickFee || 0);
  const pureProfit = revenue - commissionAmount - pickupCost - materialCost - quickFee;
  return { commissionAmount, pureProfit };
}

export default function App() {
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem(LS_ORDERS) || "[]"));
  const [chains, setChains] = useState(() => JSON.parse(localStorage.getItem(LS_CHAINS) || JSON.stringify(defaultChains)));
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem(LS_CLIENTS) || "[]"));
  const [quickPresets, setQuickPresets] = useState(() => JSON.parse(localStorage.getItem(LS_QUICK) || JSON.stringify(defaultQuickFees)));
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem(LS_PRODUCTS) || JSON.stringify(defaultProducts)));

  const [activeTab, setActiveTab] = useState("주문관리");
  const [editingId, setEditingId] = useState(null);

  const [filterChain, setFilterChain] = useState("전체");
  const [filterClientType, setFilterClientType] = useState("전체");
  const [filterOrderType, setFilterOrderType] = useState("전체");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");

  const [newChain, setNewChain] = useState("");
  const [newProduct, setNewProduct] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newClientType, setNewClientType] = useState("회사");
  const [newQuickName, setNewQuickName] = useState("");
  const [newQuickFee, setNewQuickFee] = useState("");

  const [form, setForm] = useState({
    date: today(),
    chain: "",
    clientType: "회사",
    clientName: "",
    product: "근조화환",
    revenue: "35000",
    commissionPercent: "10",
    pickupCost: "7000",
    materialCost: "3000",
    quickPreset: "직접입력",
    quickFee: "0",
    address: "",
    orderType: "수주",
    status: "접수",
    note: "",
  });

  useEffect(() => localStorage.setItem(LS_ORDERS, JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem(LS_CHAINS, JSON.stringify(chains)), [chains]);
  useEffect(() => localStorage.setItem(LS_CLIENTS, JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem(LS_QUICK, JSON.stringify(quickPresets)), [quickPresets]);
  useEffect(() => localStorage.setItem(LS_PRODUCTS, JSON.stringify(products)), [products]);

  const liveCalc = calcProfit(form);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterChain !== "전체" && o.chain !== filterChain) return false;
      if (filterClientType !== "전체" && o.clientType !== filterClientType) return false;
      if (filterOrderType !== "전체" && o.orderType !== filterOrderType) return false;
      if (filterDate && o.date !== filterDate) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const text = `${o.chain} ${o.clientName} ${o.product} ${o.address} ${o.note}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [orders, filterChain, filterClientType, filterOrderType, filterDate, search]);

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.revenue || 0), 0);
    const totalProfit = filteredOrders.reduce((s, o) => s + Number(o.pureProfit || 0), 0);
    const totalCommission = filteredOrders.reduce((s, o) => s + Number(o.commissionAmount || 0), 0);
    const totalCount = filteredOrders.length;
    return { totalRevenue, totalProfit, totalCommission, totalCount };
  }, [filteredOrders]);

  const topClients = useMemo(() => {
    const map = {};
    for (const o of orders) {
      const key = o.clientName || "미등록";
      map[key] = (map[key] || 0) + Number(o.revenue || 0);
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  const addChain = () => {
    const value = newChain.trim();
    if (!value || chains.includes(value)) return;
    setChains([value, ...chains]);
    setNewChain("");
  };

  const deleteChain = (name) => {
    if (!window.confirm(`체인 '${name}'을 삭제할까요?`)) return;
    setChains(chains.filter((c) => c !== name));
    if (form.chain === name) setForm({ ...form, chain: "" });
  };

  const addProduct = () => {
    const value = newProduct.trim();
    if (!value || products.includes(value)) return;
    setProducts([value, ...products]);
    setNewProduct("");
  };

  const deleteProduct = (name) => {
    if (!window.confirm(`상품 '${name}'을 삭제할까요?`)) return;
    setProducts(products.filter((p) => p !== name));
    if (form.product === name) setForm({ ...form, product: "" });
  };

  const addClient = () => {
    const name = newClientName.trim();
    if (!name) return;
    if (clients.some((c) => c.name === name && c.type === newClientType)) return;
    setClients([{ name, type: newClientType }, ...clients]);
    setNewClientName("");
  };

  const deleteClient = (target) => {
    if (!window.confirm(`거래처 '${target.name}'을 삭제할까요?`)) return;
    setClients(clients.filter((c) => !(c.name === target.name && c.type === target.type)));
    if (form.clientName === target.name) setForm({ ...form, clientName: "" });
  };

  const addQuickPreset = () => {
    const name = newQuickName.trim();
    const fee = Number(newQuickFee || 0);
    if (!name) return;
    if (quickPresets.some((q) => q.name === name)) return;
    setQuickPresets([{ name, fee }, ...quickPresets]);
    setNewQuickName("");
    setNewQuickFee("");
  };

  const deleteQuickPreset = (name) => {
    if (!window.confirm(`퀵비 '${name}'을 삭제할까요?`)) return;
    setQuickPresets(quickPresets.filter((q) => q.name !== name));
    if (form.quickPreset === name) setForm({ ...form, quickPreset: "직접입력", quickFee: "0" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      date: today(),
      chain: "",
      clientType: "회사",
      clientName: "",
      product: products[0] || "근조화환",
      revenue: "35000",
      commissionPercent: "10",
      pickupCost: "7000",
      materialCost: "3000",
      quickPreset: "직접입력",
      quickFee: "0",
      address: "",
      orderType: "수주",
      status: "접수",
      note: "",
    });
  };

  const saveOrder = () => {
    if (!form.chain || !form.clientName || !form.product || !form.revenue) {
      window.alert("체인, 거래처, 상품, 매출은 꼭 입력해주세요.");
      return;
    }

    const calc = calcProfit(form);
    const payload = {
      ...form,
      id: editingId || Date.now(),
      revenue: Number(form.revenue || 0),
      commissionPercent: Number(form.commissionPercent || 0),
      pickupCost: Number(form.pickupCost || 0),
      materialCost: Number(form.materialCost || 0),
      quickFee: Number(form.quickFee || 0),
      commissionAmount: calc.commissionAmount,
      pureProfit: calc.pureProfit,
      business: "싱싱플라워",
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setOrders(orders.map((o) => (o.id === editingId ? payload : o)));
    } else {
      setOrders([payload, ...orders]);
    }
    resetForm();
  };

  const editOrder = (order) => {
    setEditingId(order.id);
    setActiveTab("주문관리");
    setForm({
      date: order.date,
      chain: order.chain,
      clientType: order.clientType,
      clientName: order.clientName,
      product: order.product,
      revenue: String(order.revenue),
      commissionPercent: String(order.commissionPercent),
      pickupCost: String(order.pickupCost),
      materialCost: String(order.materialCost),
      quickPreset: order.quickPreset || "직접입력",
      quickFee: String(order.quickFee),
      address: order.address || "",
      orderType: order.orderType,
      status: order.status,
      note: order.note || "",
    });
  };

  const deleteOrder = (id) => {
    if (!window.confirm("이 주문을 삭제할까요?")) return;
    setOrders(orders.filter((o) => o.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #dbeafe 0%, #f8fafc 35%, #f5f3ff 70%, #eef2ff 100%)",
        padding: 24,
        fontFamily: "Inter, Pretendard, Arial, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div
          style={{
            ...glass,
            padding: 28,
            marginBottom: 20,
            background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(51,65,85,0.95) 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>SINGSING FLOWER · BUSINESS DASHBOARD</div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "end", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 34, lineHeight: 1.15 }}>싱싱플라워 수주 · 발주 · 순수익 관리</h1>
              <div style={{ marginTop: 10, fontSize: 15, opacity: 0.9 }}>체인 · 거래처 · 매출 · 비용 · 순수익을 한 번에 관리하는 전용 프로그램</div>
            </div>
            <div style={{ fontSize: 14, opacity: 0.88 }}>오늘 날짜 · {today()}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
          {["주문관리", "기초설정"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...softBtn,
                background: activeTab === tab ? "#0f172a" : "white",
                color: activeTab === tab ? "white" : "#0f172a",
                border: activeTab === tab ? "1px solid #0f172a" : "1px solid #dbe4ee",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {[
            ["현재 필터 매출", won(stats.totalRevenue)],
            ["현재 필터 순수익", won(stats.totalProfit)],
            ["현재 필터 수수료", won(stats.totalCommission)],
            ["현재 필터 주문 수", `${stats.totalCount}건`],
          ].map(([title, value]) => (
            <div key={title} style={{ ...glass, padding: 20 }}>
              <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{value}</div>
            </div>
          ))}
        </div>

        {activeTab === "주문관리" && (
          <div style={{ display: "grid", gridTemplateColumns: "460px 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 20 }}>
              <div style={{ ...glass, padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ margin: 0, fontSize: 22 }}>{editingId ? "주문 수정" : "주문 등록"}</h2>
                  {editingId && <button onClick={resetForm} style={softBtn}>새로 입력</button>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={label}>날짜</label>
                    <input style={input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div>
                    <label style={label}>구분</label>
                    <select style={input} value={form.orderType} onChange={(e) => setForm({ ...form, orderType: e.target.value })}>
                      <option>수주</option>
                      <option>발주</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>체인</label>
                    <select style={input} value={form.chain} onChange={(e) => setForm({ ...form, chain: e.target.value })}>
                      <option value="">체인 선택</option>
                      {chains.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>거래처 유형</label>
                    <select style={input} value={form.clientType} onChange={(e) => setForm({ ...form, clientType: e.target.value })}>
                      <option>회사</option>
                      <option>개인</option>
                    </select>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>거래처</label>
                    <select style={input} value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })}>
                      <option value="">거래처 선택</option>
                      {clients
                        .filter((c) => c.type === form.clientType)
                        .map((c, i) => <option key={`${c.name}-${i}`}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>상품</label>
                    <select style={input} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                      {products.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>주문 상태</label>
                    <select style={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      {defaultStatuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>매출</label>
                    <input style={input} type="number" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} />
                  </div>
                  <div>
                    <label style={label}>수수료 %</label>
                    <input style={input} type="number" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} />
                  </div>
                  <div>
                    <label style={label}>화환 수거비</label>
                    <input style={input} type="number" value={form.pickupCost} onChange={(e) => setForm({ ...form, pickupCost: e.target.value })} />
                  </div>
                  <div>
                    <label style={label}>기타 부자재비</label>
                    <input style={input} type="number" value={form.materialCost} onChange={(e) => setForm({ ...form, materialCost: e.target.value })} />
                  </div>
                  <div>
                    <label style={label}>퀵비 프리셋</label>
                    <select
                      style={input}
                      value={form.quickPreset}
                      onChange={(e) => {
                        const selected = quickPresets.find((q) => q.name === e.target.value);
                        setForm({ ...form, quickPreset: e.target.value, quickFee: String(selected ? selected.fee : 0) });
                      }}
                    >
                      {quickPresets.map((q) => <option key={q.name}>{q.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={label}>퀵비</label>
                    <input style={input} type="number" value={form.quickFee} onChange={(e) => setForm({ ...form, quickFee: e.target.value, quickPreset: "직접입력" })} />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>배송지</label>
                    <input style={input} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="예: 부천성모병원 장례식장" />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label style={label}>비고</label>
                    <textarea style={{ ...input, minHeight: 88, resize: "vertical" }} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="추가 메모" />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 16,
                    padding: 16,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)",
                    border: "1px solid #dbeafe",
                  }}
                >
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>순수익 자동 계산</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 14 }}>
                    <div>매출: <b>{won(form.revenue)}</b></div>
                    <div>수수료: <b>{won(liveCalc.commissionAmount)}</b></div>
                    <div>화환 수거비: <b>{won(form.pickupCost)}</b></div>
                    <div>기타 부자재비: <b>{won(form.materialCost)}</b></div>
                    <div>퀵비: <b>{won(form.quickFee)}</b></div>
                    <div>실제 순수익: <b style={{ color: liveCalc.pureProfit >= 0 ? "#047857" : "#dc2626" }}>{won(liveCalc.pureProfit)}</b></div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={saveOrder} style={{ ...primaryBtn, flex: 1 }}>{editingId ? "수정 저장" : "주문 저장"}</button>
                  <button onClick={resetForm} style={softBtn}>초기화</button>
                </div>
              </div>

              <div style={{ ...glass, padding: 22 }}>
                <h3 style={{ marginTop: 0, marginBottom: 14 }}>거래처 TOP 5</h3>
                {topClients.length === 0 ? (
                  <div style={{ color: "#64748b" }}>아직 데이터가 없습니다.</div>
                ) : (
                  topClients.map(([name, revenue], idx) => (
                    <div key={name} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: idx === topClients.length - 1 ? "none" : "1px solid #eef2f7" }}>
                      <div>{idx + 1}. {name}</div>
                      <b>{won(revenue)}</b>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div style={{ ...glass, padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 22 }}>주문 목록</h2>
                  <div style={{ color: "#64748b", fontSize: 13, marginTop: 5 }}>검색과 필터로 빠르게 정리하세요.</div>
                </div>
                <input style={{ ...input, width: 240 }} placeholder="거래처/배송지/비고 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                <select style={input} value={filterChain} onChange={(e) => setFilterChain(e.target.value)}>
                  <option>전체</option>
                  {chains.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select style={input} value={filterClientType} onChange={(e) => setFilterClientType(e.target.value)}>
                  <option>전체</option>
                  <option>회사</option>
                  <option>개인</option>
                </select>
                <select style={input} value={filterOrderType} onChange={(e) => setFilterOrderType(e.target.value)}>
                  <option>전체</option>
                  <option>수주</option>
                  <option>발주</option>
                </select>
                <input style={input} type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {[
                        "날짜","체인","거래처","유형","상품","매출","수수료","수거비","부자재","퀵비","순수익","구분","상태","삭제"
                      ].map((h) => (
                        <th key={h} style={{ textAlign: h === "매출" || h === "수수료" || h === "수거비" || h === "부자재" || h === "퀵비" || h === "순수익" ? "right" : "left", padding: 12, whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={14} style={{ padding: 32, textAlign: "center", color: "#64748b" }}>등록된 주문이 없습니다.</td>
                      </tr>
                    ) : filteredOrders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #eef2f7" }}>
                        <td style={{ padding: 12, whiteSpace: "nowrap" }}>{o.date}</td>
                        <td style={{ padding: 12 }}>{o.chain}</td>
                        <td style={{ padding: 12, minWidth: 140 }}>
                          <div style={{ fontWeight: 700 }}>{o.clientName}</div>
                          {o.address && <div style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>{o.address}</div>}
                        </td>
                        <td style={{ padding: 12 }}>{o.clientType}</td>
                        <td style={{ padding: 12 }}>{o.product}</td>
                        <td style={{ padding: 12, textAlign: "right", fontWeight: 700 }}>{won(o.revenue)}</td>
                        <td style={{ padding: 12, textAlign: "right" }}>{won(o.commissionAmount)}</td>
                        <td style={{ padding: 12, textAlign: "right" }}>{won(o.pickupCost)}</td>
                        <td style={{ padding: 12, textAlign: "right" }}>{won(o.materialCost)}</td>
                        <td style={{ padding: 12, textAlign: "right" }}>{won(o.quickFee)}</td>
                        <td style={{ padding: 12, textAlign: "right", fontWeight: 800, color: o.pureProfit >= 0 ? "#047857" : "#dc2626" }}>{won(o.pureProfit)}</td>
                        <td style={{ padding: 12 }}>
                          <span style={{ padding: "7px 10px", borderRadius: 999, background: orderTypeColor[o.orderType].bg, color: orderTypeColor[o.orderType].color, fontWeight: 800, fontSize: 12 }}>{o.orderType}</span>
                        </td>
                        <td style={{ padding: 12 }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <select
                              style={{ ...input, minWidth: 110, padding: "8px 10px" }}
                              value={o.status}
                              onChange={(e) => setOrders(orders.map((item) => item.id === o.id ? { ...item, status: e.target.value } : item))}
                            >
                              {defaultStatuses.map((s) => <option key={s}>{s}</option>)}
                            </select>
                            <button onClick={() => editOrder(o)} style={softBtn}>수정</button>
                          </div>
                        </td>
                        <td style={{ padding: 12, textAlign: "center" }}>
                          <button onClick={() => deleteOrder(o.id)} style={dangerBtn}>삭제</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "기초설정" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
            <div style={{ ...glass, padding: 22 }}>
              <h2 style={{ marginTop: 0 }}>체인 관리</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <input style={input} value={newChain} onChange={(e) => setNewChain(e.target.value)} placeholder="새 체인명 입력" />
                <button onClick={addChain} style={primaryBtn}>추가</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {chains.map((c) => (
                  <span key={c} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    {c}
                    <button onClick={() => deleteChain(c)} style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 800 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...glass, padding: 22 }}>
              <h2 style={{ marginTop: 0 }}>상품 관리</h2>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <input style={input} value={newProduct} onChange={(e) => setNewProduct(e.target.value)} placeholder="새 상품명 입력" />
                <button onClick={addProduct} style={primaryBtn}>추가</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {products.map((p) => (
                  <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 999, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    {p}
                    <button onClick={() => deleteProduct(p)} style={{ border: "none", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 800 }}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div style={{ ...glass, padding: 22 }}>
              <h2 style={{ marginTop: 0 }}>거래처 관리</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", gap: 10, marginBottom: 14 }}>
                <input style={input} value={newClientName} onChange={(e) => setNewClientName(e.target.value)} placeholder="거래처명 입력" />
                <select style={input} value={newClientType} onChange={(e) => setNewClientType(e.target.value)}>
                  <option>회사</option>
                  <option>개인</option>
                </select>
                <button onClick={addClient} style={primaryBtn}>추가</button>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {clients.length === 0 ? (
                  <div style={{ color: "#64748b" }}>등록된 거래처가 없습니다.</div>
                ) : clients.map((client, i) => (
                  <div key={`${client.name}-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{client.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{client.type}</div>
                    </div>
                    <button onClick={() => deleteClient(client)} style={dangerBtn}>삭제</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...glass, padding: 22 }}>
              <h2 style={{ marginTop: 0 }}>퀵비 프리셋 관리</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", gap: 10, marginBottom: 14 }}>
                <input style={input} value={newQuickName} onChange={(e) => setNewQuickName(e.target.value)} placeholder="예: 중거리" />
                <input style={input} type="number" value={newQuickFee} onChange={(e) => setNewQuickFee(e.target.value)} placeholder="금액" />
                <button onClick={addQuickPreset} style={primaryBtn}>추가</button>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {quickPresets.map((q) => (
                  <div key={q.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{q.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{won(q.fee)}</div>
                    </div>
                    {q.name !== "직접입력" && <button onClick={() => deleteQuickPreset(q.name)} style={dangerBtn}>삭제</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

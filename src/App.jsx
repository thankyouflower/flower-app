import { useState, useEffect, useMemo } from "react";

const cardStyle = {
  background: "#ffffff",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
  border: "1px solid #e5e7eb",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
  display: "block",
};

const businesses = ["땡큐플라워", "싱싱플라워"];
const statuses = ["접수", "제작중", "배송중", "완료"];

export default function App() {
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem("orders") || "[]"));
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem("clients") || "[]"));
  const [newClient, setNewClient] = useState("");
  const [filterBusiness, setFilterBusiness] = useState("전체");

  const [form, setForm] = useState({
    business: "땡큐플라워",
    client: "",
    product: "근조화환",
    amount: "",
    status: "접수",
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const addClient = () => {
    const trimmed = newClient.trim();
    if (!trimmed) return;
    if (clients.includes(trimmed)) {
      setNewClient("");
      return;
    }
    setClients([trimmed, ...clients]);
    setNewClient("");
  };

  const addOrder = () => {
    if (!form.client || !form.amount) return;
    const next = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString("ko-KR"),
      amount: Number(form.amount),
    };
    setOrders([next, ...orders]);
    setForm({ ...form, client: "", amount: "", status: "접수" });
  };

  const filteredOrders = useMemo(() => {
    if (filterBusiness === "전체") return orders;
    return orders.filter((o) => o.business === filterBusiness);
  }, [orders, filterBusiness]);

  const totalSales = filteredOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const totalCount = filteredOrders.length;
  const thankyouSales = orders.filter((o) => o.business === "땡큐플라워").reduce((s, o) => s + Number(o.amount || 0), 0);
  const singsingSales = orders.filter((o) => o.business === "싱싱플라워").reduce((s, o) => s + Number(o.amount || 0), 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        padding: 24,
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            ...cardStyle,
            padding: 24,
            marginBottom: 20,
            background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
            color: "white",
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 8 }}>땡큐플라워 · 싱싱플라워 통합관리</div>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2 }}>화환 주문/매출 관리 프로그램</h1>
          <div style={{ marginTop: 10, fontSize: 15, opacity: 0.9 }}>거래처, 주문, 매출을 한 화면에서 관리하세요.</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>현재 선택 매출</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalSales.toLocaleString()}원</div>
          </div>
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>현재 선택 주문 수</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{totalCount}건</div>
          </div>
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>땡큐플라워 매출</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{thankyouSales.toLocaleString()}원</div>
          </div>
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>싱싱플라워 매출</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{singsingSales.toLocaleString()}원</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.4fr",
            gap: 20,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ ...cardStyle, padding: 20 }}>
              <h2 style={{ marginTop: 0, fontSize: 20 }}>거래처 등록</h2>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  style={inputStyle}
                  placeholder="예: 부천장례식장"
                  value={newClient}
                  onChange={(e) => setNewClient(e.target.value)}
                />
                <button
                  onClick={addClient}
                  style={{
                    border: "none",
                    borderRadius: 12,
                    padding: "12px 18px",
                    background: "#111827",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  추가
                </button>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {clients.length === 0 ? (
                  <div style={{ color: "#6b7280", fontSize: 14 }}>등록된 거래처가 없습니다.</div>
                ) : (
                  clients.map((client, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "8px 12px",
                        background: "#f3f4f6",
                        borderRadius: 999,
                        fontSize: 13,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {client}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div style={{ ...cardStyle, padding: 20 }}>
              <h2 style={{ marginTop: 0, fontSize: 20 }}>주문 등록</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={labelStyle}>사업자</label>
                  <select style={inputStyle} value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}>
                    {businesses.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>거래처</label>
                  <select style={inputStyle} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })}>
                    <option value="">거래처 선택</option>
                    {clients.map((c, i) => <option key={i}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>상품명</label>
                  <input style={inputStyle} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>금액</label>
                  <input style={inputStyle} type="number" placeholder="예: 59000" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>상태</label>
                  <select style={inputStyle} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {statuses.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button
                onClick={addOrder}
                style={{
                  marginTop: 16,
                  width: "100%",
                  border: "none",
                  borderRadius: 14,
                  padding: "14px 18px",
                  background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 15,
                  cursor: "pointer",
                }}
              >
                주문 추가하기
              </button>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20 }}>주문 목록</h2>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>최근 주문이 위에 표시됩니다.</div>
              </div>
              <select style={{ ...inputStyle, width: 180 }} value={filterBusiness} onChange={(e) => setFilterBusiness(e.target.value)}>
                <option>전체</option>
                <option>땡큐플라워</option>
                <option>싱싱플라워</option>
              </select>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ textAlign: "left", padding: 12 }}>날짜</th>
                    <th style={{ textAlign: "left", padding: 12 }}>사업자</th>
                    <th style={{ textAlign: "left", padding: 12 }}>거래처</th>
                    <th style={{ textAlign: "left", padding: 12 }}>상품</th>
                    <th style={{ textAlign: "right", padding: 12 }}>금액</th>
                    <th style={{ textAlign: "left", padding: 12 }}>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: 28, textAlign: "center", color: "#6b7280" }}>
                        등록된 주문이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: 12 }}>{o.date}</td>
                        <td style={{ padding: 12 }}>{o.business}</td>
                        <td style={{ padding: 12 }}>{o.client}</td>
                        <td style={{ padding: 12 }}>{o.product}</td>
                        <td style={{ padding: 12, textAlign: "right", fontWeight: 700 }}>{Number(o.amount).toLocaleString()}원</td>
                        <td style={{ padding: 12 }}>
                          <select
                            style={{ ...inputStyle, minWidth: 110, padding: "8px 10px" }}
                            value={o.status}
                            onChange={(e) => {
                              setOrders(
                                orders.map((item) => (item.id === o.id ? { ...item, status: e.target.value } : item))
                              );
                            }}
                          >
                            {statuses.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

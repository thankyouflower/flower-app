import React, { useMemo, useState } from "react";

const mainTabs = ["홈", "수발주관리"];
const orderTabs = ["수주내역", "발주내역"];

const recentPhotos = [
  { id: 1, title: "근조 3단", date: "2026-04-15" },
  { id: 2, title: "축하 3단", date: "2026-04-14" },
  { id: 3, title: "개업화분", date: "2026-04-13" },
  { id: 4, title: "몬스테라", date: "2026-04-12" },
];

const monthlySales = [
  { month: "1월", sales: 1800000 },
  { month: "2월", sales: 2200000 },
  { month: "3월", sales: 2100000 },
  { month: "4월", sales: 2600000 },
  { month: "5월", sales: 2400000 },
  { month: "6월", sales: 2900000 },
];

const initialOrders = [
  {
    id: 1,
    type: "화환",
    chain: "송죽플라워",
    florist: "중앙화원",
    product: "근조 3단",
    orderAmount: 180000,
    delivery: "퀵",
    date: "2026-04-15",
    memo: "오전 배송",
  },
  {
    id: 2,
    type: "식물",
    chain: "반하다플라워",
    florist: "그린화원",
    product: "개업화분",
    orderAmount: 200000,
    delivery: "자체배달",
    date: "2026-04-15",
    memo: "리본 문구 확인",
  },
  {
    id: 3,
    type: "화환",
    chain: "아이마플라워",
    florist: "새벽화원",
    product: "축하 3단",
    orderAmount: 220000,
    delivery: "퀵",
    date: "2026-04-14",
    memo: "행사장 정문",
  },
  {
    id: 4,
    type: "식물",
    chain: "정원가든",
    florist: "숲속화원",
    product: "몬스테라",
    orderAmount: 110000,
    delivery: "자체배달",
    date: "2026-04-13",
    memo: "받는 분 연락 후 전달",
  },
];

function won(v) {
  return `${Number(v || 0).toLocaleString()}원`;
}

function getToday() {
  return "2026-04-15";
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

export default function App() {
  const [activeTab, setActiveTab] = useState("홈");
  const [activeOrderTab, setActiveOrderTab] = useState("수주내역");
  const [darkMode, setDarkMode] = useState(true);
  const [orderFilter, setOrderFilter] = useState("전체");
  const [orders, setOrders] = useState(initialOrders);
  const [chainOptions, setChainOptions] = useState(["송죽플라워", "반하다플라워", "아이마플라워", "정원가든"]);
  const [floristOptions, setFloristOptions] = useState(["중앙화원", "그린화원", "새벽화원", "숲속화원"]);
  const [productOptions, setProductOptions] = useState(["근조 3단", "축하 3단", "개업화분", "몬스테라"]);
  const [orderForm, setOrderForm] = useState({
    type: "화환",
    chain: "",
    florist: "",
    product: "",
    orderAmount: "",
    delivery: "자체배달",
    date: getToday(),
    memo: "",
  });

  const theme = darkMode ? darkTheme : lightTheme;

  const currentMonthSales = monthlySales[monthlySales.length - 1].sales;
  const currentMonthExpense = 980000;
  const currentMonthProfit = currentMonthSales - currentMonthExpense;

  const todayOrders = useMemo(() => {
    const filtered = orders.filter((item) => item.date === getToday());
    if (orderFilter === "전체") return filtered;
    return filtered.filter((item) => item.type === orderFilter);
  }, [orders, orderFilter]);

  const maxSales = Math.max(...monthlySales.map((item) => item.sales));

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.chain || !orderForm.florist || !orderForm.product || !orderForm.orderAmount) return;

    const newOrder = {
      id: Date.now(),
      ...orderForm,
      orderAmount: Number(orderForm.orderAmount),
    };

    setOrders((prev) => [newOrder, ...prev]);

    if (!chainOptions.includes(orderForm.chain)) {
      setChainOptions((prev) => [orderForm.chain, ...prev]);
    }
    if (!floristOptions.includes(orderForm.florist)) {
      setFloristOptions((prev) => [orderForm.florist, ...prev]);
    }
    if (!productOptions.includes(orderForm.product)) {
      setProductOptions((prev) => [orderForm.product, ...prev]);
    }

    setOrderForm((prev) => ({
      ...prev,
      chain: "",
      florist: "",
      product: "",
      orderAmount: "",
      delivery: "자체배달",
      date: getToday(),
      memo: "",
    }));
  };

  return (
    <div style={theme.page}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Pretendard, Arial, sans-serif; }
        button, input, select, textarea { font-family: inherit; }
        .bh-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .bh-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 999px; }
        @media (max-width: 1180px) {
          .bh-home-grid, .bh-order-grid { grid-template-columns: 1fr !important; }
          .bh-summary-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .bh-body { padding: 16px !important; }
          .bh-header { padding: 16px !important; }
          .bh-brand-title { font-size: 24px !important; }
        }
      `}</style>

      <div style={theme.windowWrap}>
        <div style={theme.windowBar}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ ...theme.dot, background: "#ff5f57" }} />
            <span style={{ ...theme.dot, background: "#febc2e" }} />
            <span style={{ ...theme.dot, background: "#28c840" }} />
            <div style={{ marginLeft: 14, fontSize: 14, opacity: 0.9 }}>BLOOM HUB</div>
          </div>
          <button onClick={() => setDarkMode((v) => !v)} style={theme.modeButton}>
            {darkMode ? "☀" : "☾"}
          </button>
        </div>

        <div style={theme.header} className="bh-header">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={theme.logoBox}>❋</div>
            <div>
              <div className="bh-brand-title" style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>
                BLOOM HUB
              </div>
              <div style={{ fontSize: 14, opacity: 0.72, marginTop: 4 }}>
                플라워 비즈니스 통합 관리 시스템
              </div>
            </div>
          </div>
        </div>

        <div style={theme.tabRow} className="bh-scroll">
          {mainTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? theme.activeTab : theme.tab}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={theme.body} className="bh-body">
          {activeTab === "홈" && (
            <div style={{ display: "grid", gap: 20 }}>
              <div style={theme.aiHeroCard}>
                <div>
                  <div style={{ fontSize: 14, opacity: 0.75 }}>AI 비서</div>
                  <div style={{ fontSize: 28, fontWeight: 800, marginTop: 10, letterSpacing: "-0.03em" }}>
                    오늘 업무를 빠르게 확인해보세요
                  </div>
                  <div style={{ marginTop: 10, color: theme.muted, lineHeight: 1.6 }}>
                    오늘 수주 흐름, 이번달 매출, 최근 등록 사진까지 홈에서 바로 확인할 수 있어요.
                  </div>
                </div>
                <div style={theme.searchBox}>
                  <span style={{ fontSize: 20, opacity: 0.55 }}>⌕</span>
                  <input defaultValue="이번달 매출, 오늘 수주, 최근 등록 사진을 물어보세요..." style={theme.searchInput} />
                  <button style={theme.askButton}>질문하기</button>
                </div>
              </div>

              <div className="bh-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                <StatCard theme={theme} label="이번달 매출" value={won(currentMonthSales)} />
                <StatCard theme={theme} label="이번달 지출" value={won(currentMonthExpense)} />
                <StatCard theme={theme} label="순이익" value={won(currentMonthProfit)} accent />
              </div>

              <div className="bh-home-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
                <div style={theme.mainCard}>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>매출요약</div>
                  <div style={{ display: "flex", alignItems: "end", gap: 14, height: 260 }}>
                    {monthlySales.map((item) => (
                      <div key={item.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                        <div style={{ height: 210, display: "flex", alignItems: "end", width: "100%" }}>
                          <div
                            style={{
                              width: "100%",
                              height: `${(item.sales / maxSales) * 180 + 30}px`,
                              background: theme.barPrimary,
                              borderRadius: 14,
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 13, color: theme.muted }}>{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={theme.mainCard}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 24, fontWeight: 800 }}>사진방</div>
                    <button style={theme.moreButton}>더보기</button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {recentPhotos.map((photo) => (
                      <div key={photo.id} style={theme.photoCard}>
                        <div style={theme.photoMock}>📸</div>
                        <div style={{ marginTop: 10, fontWeight: 700 }}>{photo.title}</div>
                        <div style={{ marginTop: 4, fontSize: 12, color: theme.muted }}>{formatDate(photo.date)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "수발주관리" && (
            <div style={{ display: "grid", gap: 18 }}>
              <div style={theme.subTabRow}>
                {orderTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveOrderTab(tab)}
                    style={activeOrderTab === tab ? theme.subActiveTab : theme.subTab}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeOrderTab === "수주내역" && (
                <div className="bh-order-grid" style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20 }}>
                  <div style={theme.mainCard}>
                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>주문등록</div>
                    <form onSubmit={handleOrderSubmit} style={{ display: "grid", gap: 12 }}>
                      <SelectField
                        label="구분"
                        value={orderForm.type}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, type: value }))}
                        options={["화환", "식물"]}
                        theme={theme}
                      />

                      <DatalistField
                        label="체인"
                        value={orderForm.chain}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, chain: value }))}
                        options={chainOptions}
                        listId="chain-options"
                        theme={theme}
                      />

                      <DatalistField
                        label="발주화원"
                        value={orderForm.florist}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, florist: value }))}
                        options={floristOptions}
                        listId="florist-options"
                        theme={theme}
                      />

                      <DatalistField
                        label="상품명"
                        value={orderForm.product}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, product: value }))}
                        options={productOptions}
                        listId="product-options"
                        theme={theme}
                      />

                      <InputField
                        label="수주금액"
                        type="number"
                        value={orderForm.orderAmount}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, orderAmount: value }))}
                        theme={theme}
                      />

                      <SelectField
                        label="배송방식"
                        value={orderForm.delivery}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, delivery: value }))}
                        options={["자체배달", "퀵"]}
                        theme={theme}
                      />

                      <InputField
                        label="날짜"
                        type="date"
                        value={orderForm.date}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, date: value }))}
                        theme={theme}
                      />

                      <TextAreaField
                        label="메모"
                        value={orderForm.memo}
                        onChange={(value) => setOrderForm((prev) => ({ ...prev, memo: value }))}
                        theme={theme}
                      />

                      <button type="submit" style={theme.primaryAction}>등록하기</button>
                    </form>
                  </div>

                  <div style={theme.mainCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 800 }}>수주내역</div>
                        <div style={{ fontSize: 13, color: theme.muted, marginTop: 6 }}>당일 상품만 표시됩니다.</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {["전체", "화환", "식물"].map((item) => (
                          <button
                            key={item}
                            onClick={() => setOrderFilter(item)}
                            style={orderFilter === item ? theme.filterActive : theme.filterButton}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ borderTop: `1px solid ${theme.line}` }}>
                      <div style={theme.listHeaderRow}>
                        <div>체인사</div>
                        <div>상품 / 구분</div>
                        <div>수주금액</div>
                      </div>

                      {todayOrders.length === 0 ? (
                        <div style={{ padding: "36px 0", textAlign: "center", color: theme.muted }}>
                          오늘 등록된 수주내역이 없습니다.
                        </div>
                      ) : (
                        todayOrders.map((row) => (
                          <div key={row.id} style={theme.listRow}>
                            <div style={{ fontWeight: 800 }}>{row.chain}</div>
                            <div>
                              <div style={{ fontWeight: 800 }}>{row.product}</div>
                              <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.type}</div>
                            </div>
                            <div style={{ fontWeight: 800 }}>{won(row.orderAmount)}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeOrderTab === "발주내역" && (
                <div style={theme.mainCard}>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>발주내역</div>
                  <div style={{ color: theme.muted }}>다음 단계에서 이어서 만들 수 있도록 비워두었습니다.</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ theme, label, value, accent }) {
  return (
    <div style={theme.statCard}>
      <div style={{ fontSize: 14, color: theme.muted }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12, color: accent ? theme.accent : theme.text }}>
        {value}
      </div>
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
      <select value={value} onChange={(e) => onChange(e.target.value)} style={theme.field}>
        {options.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
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
          {options.map((item) => (
            <option key={item} value={item} />
          ))}
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

const baseTheme = {
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
  ...baseTheme,
  page: {
    background: "linear-gradient(180deg, #f2f4f8 0%, #eceff4 100%)",
    color: "#1f2937",
    minHeight: "100vh",
    padding: 18,
  },
  windowWrap: {
    maxWidth: 1440,
    margin: "0 auto",
    borderRadius: 28,
    overflow: "hidden",
    background: "#f7f8fb",
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.16)",
  },
  windowBar: {
    background: "linear-gradient(90deg, #2d2f3d 0%, #1f2430 100%)",
    color: "#f8fafc",
    padding: "12px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    background: "rgba(255,255,255,0.95)",
    padding: "18px 32px",
    borderBottom: "1px solid #e8edf5",
  },
  tabRow: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    padding: "16px 28px 0",
    background: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid #e8edf5",
  },
  tab: {
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    background: "transparent",
    color: "#475569",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  activeTab: {
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    background: "#111827",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  subTabRow: {
    display: "flex",
    gap: 10,
  },
  subTab: {
    border: "1px solid #e7ebf3",
    borderRadius: 14,
    padding: "12px 18px",
    background: "white",
    color: "#475569",
    fontWeight: 700,
    cursor: "pointer",
  },
  subActiveTab: {
    border: "none",
    borderRadius: 14,
    padding: "12px 18px",
    background: "#111827",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  body: {
    padding: 32,
    background: "linear-gradient(135deg, #f7f8fb 0%, #eef2f7 100%)",
  },
  aiHeroCard: {
    borderRadius: 28,
    padding: 28,
    background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(240,243,249,0.84) 100%)",
    border: "1px solid rgba(255,255,255,0.7)",
    display: "grid",
    gap: 18,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
    border: "1px solid #e7ebf3",
    borderRadius: 18,
    padding: "12px 14px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    color: "#1f2937",
  },
  askButton: {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    background: "#111827",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  statCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid #edf2f7",
    borderRadius: 20,
    padding: 20,
  },
  mainCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid #edf2f7",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  },
  moreButton: {
    border: "1px solid #e7ebf3",
    background: "white",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#334155",
  },
  photoCard: {
    border: "1px solid #edf2f7",
    borderRadius: 18,
    padding: 12,
    background: "white",
  },
  photoMock: {
    height: 120,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #f4efe4 0%, #e5eef7 100%)",
    fontSize: 30,
  },
  filterButton: {
    border: "1px solid #e7ebf3",
    background: "white",
    color: "#475569",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  filterActive: {
    border: "none",
    background: "#111827",
    color: "white",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  listHeaderRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 16,
    padding: "18px 8px",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 700,
  },
  listRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 16,
    alignItems: "center",
    padding: "20px 8px",
    borderTop: "1px solid #edf2f7",
  },
  fieldLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 600,
  },
  field: {
    width: "100%",
    border: "1px solid #e7ebf3",
    borderRadius: 14,
    padding: "0 14px",
    height: 48,
    background: "white",
    color: "#1f2937",
    outline: "none",
  },
  muted: "#64748b",
  text: "#1f2937",
  accent: "#bf9348",
  line: "#edf2f7",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
};

const darkTheme = {
  ...baseTheme,
  page: {
    background: "linear-gradient(180deg, #090b11 0%, #11141d 100%)",
    color: "#f8fafc",
    minHeight: "100vh",
    padding: 18,
  },
  windowWrap: {
    maxWidth: 1440,
    margin: "0 auto",
    borderRadius: 28,
    overflow: "hidden",
    background: "#121621",
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.45)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  windowBar: {
    background: "linear-gradient(90deg, #12141d 0%, #1b2030 100%)",
    color: "#f8fafc",
    padding: "12px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    background: "rgba(16, 20, 31, 0.95)",
    padding: "18px 32px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  tabRow: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    padding: "16px 28px 0",
    background: "rgba(16, 20, 31, 0.95)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  tab: {
    border: "none",
    borderRadius: 14,
    padding: "12px 16px",
    background: "transparent",
    color: "#cbd5e1",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  activeTab: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  subTabRow: {
    display: "flex",
    gap: 10,
  },
  subTab: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "12px 18px",
    background: "rgba(255,255,255,0.03)",
    color: "#cbd5e1",
    fontWeight: 700,
    cursor: "pointer",
  },
  subActiveTab: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "12px 18px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  body: {
    padding: 32,
    background: "linear-gradient(180deg, #121621 0%, #171c28 100%)",
  },
  aiHeroCard: {
    borderRadius: 28,
    padding: 28,
    background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "grid",
    gap: 18,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: "12px 14px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: 15,
    color: "#f8fafc",
  },
  askButton: {
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  statCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 20,
  },
  mainCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
  },
  moreButton: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#e2e8f0",
  },
  photoCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 12,
    background: "rgba(255,255,255,0.03)",
  },
  photoMock: {
    height: 120,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(215,179,106,0.18) 0%, rgba(120,146,187,0.18) 100%)",
    fontSize: 30,
  },
  filterButton: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#cbd5e1",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  filterActive: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  listHeaderRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 16,
    padding: "18px 8px",
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: 700,
  },
  listRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr",
    gap: 16,
    alignItems: "center",
    padding: "20px 8px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  fieldLabel: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: 600,
  },
  field: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: "0 14px",
    height: 48,
    background: "rgba(255,255,255,0.03)",
    color: "#f8fafc",
    outline: "none",
  },
  muted: "#94a3b8",
  text: "#f8fafc",
  accent: "#d7b36a",
  line: "rgba(255,255,255,0.08)",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
};

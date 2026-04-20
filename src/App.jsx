import React, { useMemo, useState } from "react";

const tabs = ["홈", "수발주관리", "거래처내역", "거래처정보", "달력", "매출분석", "지출내역", "사진방"];

const initialOrders = [
  {
    id: 1,
    type: "화환",
    status: "접수",
    client: "송죽플라워",
    product: "근조 3단",
    sales: 180000,
    quick: 20000,
    fee: 50000,
    date: "2026-04-15",
    memo: "오전 배송 요청",
  },
  {
    id: 2,
    type: "식물",
    status: "배송중",
    client: "반하다플라워",
    product: "개업화분",
    sales: 200000,
    quick: 25000,
    fee: 60000,
    date: "2026-04-15",
    memo: "리본 문구 확인",
  },
  {
    id: 3,
    type: "화환",
    status: "완료",
    client: "아이마플라워",
    product: "축하 3단",
    sales: 220000,
    quick: 30000,
    fee: 60000,
    date: "2026-04-14",
    memo: "행사장 정문",
  },
  {
    id: 4,
    type: "식물",
    status: "완료",
    client: "정원가든",
    product: "몬스테라",
    sales: 110000,
    quick: 15000,
    fee: 20000,
    date: "2026-04-13",
    memo: "받는 분 연락 후 전달",
  },
];

const clients = [
  {
    id: 1,
    name: "송죽플라워",
    manager: "김민수",
    phone: "010-1234-5678",
    address: "인천 부평구",
    settlement: "주간 정산",
    note: "근조 주문 비중 높음",
  },
  {
    id: 2,
    name: "반하다플라워",
    manager: "이서연",
    phone: "010-2345-6789",
    address: "서울 강서구",
    settlement: "월말 정산",
    note: "개업화분 주문 많음",
  },
  {
    id: 3,
    name: "아이마플라워",
    manager: "박지훈",
    phone: "010-3456-7890",
    address: "김포시",
    settlement: "건별 정산",
    note: "축하화환 긴급건 잦음",
  },
];

const scheduleItems = [
  { id: 1, date: "2026-04-16", title: "정기 납품", type: "식물", client: "반하다플라워" },
  { id: 2, date: "2026-04-16", title: "개업식 배송", type: "화환", client: "송죽플라워" },
  { id: 3, date: "2026-04-17", title: "예식장 축하화환", type: "화환", client: "아이마플라워" },
  { id: 4, date: "2026-04-18", title: "사무실 식물 교체", type: "식물", client: "정원가든" },
];

const photoItems = [
  { id: 1, title: "근조 3단 작업 사진", tag: "화환", date: "2026-04-15" },
  { id: 2, title: "개업화분 납품 사진", tag: "식물", date: "2026-04-15" },
  { id: 3, title: "축하 3단 제작 사진", tag: "화환", date: "2026-04-14" },
  { id: 4, title: "몬스테라 포장 사진", tag: "식물", date: "2026-04-13" },
];

const spendCategories = {
  화환: ["퀵비", "대국값", "근조수거", "축하수거", "부자재", "기름값"],
  식물: ["퀵비", "식물값", "부자재", "기름값"],
};

const initialExpenses = [
  {
    id: 1,
    date: "2026-04-15",
    type: "화환",
    category: "대국값",
    amount: 45000,
    relatedOrder: "근조 3단",
    note: "도매시장 구매",
  },
  {
    id: 2,
    date: "2026-04-15",
    type: "화환",
    category: "퀵비",
    amount: 20000,
    relatedOrder: "근조 3단",
    note: "오전 긴급 배송",
  },
  {
    id: 3,
    date: "2026-04-15",
    type: "식물",
    category: "식물값",
    amount: 65000,
    relatedOrder: "개업화분",
    note: "몬스테라 입고",
  },
  {
    id: 4,
    date: "2026-04-14",
    type: "식물",
    category: "부자재",
    amount: 12000,
    relatedOrder: "개업화분",
    note: "화분 포장 재료",
  },
  {
    id: 5,
    date: "2026-04-14",
    type: "화환",
    category: "근조수거",
    amount: 18000,
    relatedOrder: "근조 3단",
    note: "행사장 회수",
  },
  {
    id: 6,
    date: "2026-04-13",
    type: "식물",
    category: "기름값",
    amount: 30000,
    relatedOrder: "몬스테라",
    note: "주유",
  },
];

const notifications = [
  { id: 1, text: "정산 대기 3건이 있습니다.", time: "방금" },
  { id: 2, text: "송죽플라워 신규 주문이 접수되었습니다.", time: "10분 전" },
  { id: 3, text: "반하다플라워 배송 완료 처리 필요", time: "30분 전" },
];

function won(v) {
  return `${Number(v || 0).toLocaleString()}원`;
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function getToday() {
  return "2026-04-15";
}

export default function App() {
  const [activeTab, setActiveTab] = useState("홈");
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [orders, setOrders] = useState(initialOrders);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [expenseType, setExpenseType] = useState("화환");
  const [orderFilter, setOrderFilter] = useState("전체");
  const [expenseFilter, setExpenseFilter] = useState("전체");
  const [orderForm, setOrderForm] = useState({
    type: "화환",
    status: "접수",
    client: "",
    product: "",
    sales: "",
    quick: "",
    fee: "",
    date: getToday(),
    memo: "",
  });
  const [expenseForm, setExpenseForm] = useState({
    date: getToday(),
    type: "화환",
    category: "퀵비",
    amount: "",
    relatedOrder: "",
    note: "",
  });

  const theme = darkMode ? darkTheme : lightTheme;

  const filteredOrders = useMemo(() => {
    if (orderFilter === "전체") return orders;
    return orders.filter((order) => order.type === orderFilter);
  }, [orders, orderFilter]);

  const filteredExpenses = useMemo(() => {
    if (expenseFilter === "전체") return expenses;
    return expenses.filter((item) => item.type === expenseFilter);
  }, [expenses, expenseFilter]);

  const salesSummary = useMemo(() => {
    const totalSales = orders.reduce((sum, item) => sum + Number(item.sales || 0), 0);
    const totalQuick = orders.reduce((sum, item) => sum + Number(item.quick || 0), 0);
    const totalFee = orders.reduce((sum, item) => sum + Number(item.fee || 0), 0);
    const totalExpense = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const totalProfit = totalSales - totalQuick - totalFee - totalExpense;
    const wreathSales = orders.filter((o) => o.type === "화환").reduce((sum, item) => sum + item.sales, 0);
    const plantSales = orders.filter((o) => o.type === "식물").reduce((sum, item) => sum + item.sales, 0);
    const wreathExpense = expenses.filter((o) => o.type === "화환").reduce((sum, item) => sum + item.amount, 0);
    const plantExpense = expenses.filter((o) => o.type === "식물").reduce((sum, item) => sum + item.amount, 0);

    return {
      totalSales,
      totalQuick,
      totalFee,
      totalExpense,
      totalProfit,
      wreathSales,
      plantSales,
      wreathExpense,
      plantExpense,
      pendingSettlement: orders.filter((o) => o.status !== "완료").length,
      todayOrderCount: orders.filter((o) => o.date === getToday()).length,
    };
  }, [orders, expenses]);

  const dailyChart = useMemo(() => {
    const labels = ["04.10", "04.11", "04.12", "04.13", "04.14", "04.15"];
    return labels.map((label, index) => {
      const sales = [120000, 240000, 180000, 290000, 260000, salesSummary.totalSales][index] || 0;
      const expense = [50000, 90000, 80000, 110000, 95000, salesSummary.totalExpense][index] || 0;
      return { label, sales, expense };
    });
  }, [salesSummary.totalSales, salesSummary.totalExpense]);

  const expenseTotalsByCategory = useMemo(() => {
    return spendCategories[expenseType].map((category) => ({
      category,
      total: expenses
        .filter((item) => item.type === expenseType && item.category === category)
        .reduce((sum, item) => sum + item.amount, 0),
    }));
  }, [expenses, expenseType]);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!orderForm.client || !orderForm.product || !orderForm.sales) return;

    const newOrder = {
      id: Date.now(),
      ...orderForm,
      sales: Number(orderForm.sales || 0),
      quick: Number(orderForm.quick || 0),
      fee: Number(orderForm.fee || 0),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setOrderForm({
      type: orderForm.type,
      status: "접수",
      client: "",
      product: "",
      sales: "",
      quick: "",
      fee: "",
      date: getToday(),
      memo: "",
    });
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.relatedOrder) return;

    const newExpense = {
      id: Date.now(),
      ...expenseForm,
      amount: Number(expenseForm.amount || 0),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    setExpenseForm({
      date: getToday(),
      type: expenseForm.type,
      category: spendCategories[expenseForm.type][0],
      amount: "",
      relatedOrder: "",
      note: "",
    });
  };

  const updateOrderStatus = (id, nextStatus) => {
    setOrders((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item)));
  };

  return (
    <div style={{ ...theme.page }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Pretendard, Arial, sans-serif; }
        button, input, select, textarea { font-family: inherit; }
        .bh-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .bh-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 999px; }
        .bh-hover { transition: all .2s ease; }
        .bh-hover:hover { transform: translateY(-1px); }
        @media (max-width: 1100px) {
          .bh-main-grid { grid-template-columns: 1fr !important; }
          .bh-summary-grid { grid-template-columns: 1fr 1fr !important; }
          .bh-analytics-grid { grid-template-columns: 1fr !important; }
          .bh-form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 760px) {
          .bh-summary-grid { grid-template-columns: 1fr !important; }
          .bh-header { padding: 14px 16px !important; }
          .bh-body { padding: 16px !important; }
          .bh-search-row { flex-direction: column !important; }
          .bh-brand-title { font-size: 24px !important; }
          .bh-top-actions { gap: 10px !important; }
          .bh-orders-table { display: none !important; }
          .bh-orders-mobile { display: grid !important; gap: 12px; }
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
          <div style={{ display: "flex", gap: 12, alignItems: "center", opacity: 0.9 }}>
            <span>✕</span>
            <span>＋</span>
          </div>
        </div>

        <div style={theme.browserBar}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>‹</span>
            <span>›</span>
            <span>⟳</span>
          </div>
          <div style={theme.addressBar}>https://bloom-hub.app</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", justifyContent: "flex-end" }}>
            <span>☆</span>
            <span>☰</span>
            <button onClick={() => setDarkMode((v) => !v)} style={theme.modeButton}>
              {darkMode ? "☀" : "☾"}
            </button>
          </div>
        </div>

        <div style={{ ...theme.header }} className="bh-header">
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

          <div className="bh-top-actions" style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
            <button style={theme.iconBtn} onClick={() => setShowNotifications((v) => !v)}>
              🔔
              <span style={theme.badge}>{notifications.length}</span>
            </button>
            <button style={theme.loginBtn}>로그인</button>

            {showNotifications && (
              <div style={theme.notificationPanel}>
                <div style={{ fontWeight: 800, marginBottom: 12 }}>알림</div>
                {notifications.map((item) => (
                  <div key={item.id} style={theme.notificationItem}>
                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>{item.text}</div>
                    <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>{item.time}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ ...theme.tabRow }} className="bh-scroll">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={activeTab === tab ? theme.activeTab : theme.tab}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ ...theme.body }} className="bh-body">
          {activeTab === "홈" && (
            <>
              <div style={theme.heroSection}>
                <div style={{ display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 280 }}>
                    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>
                      안녕하세요, 오늘도 꽃 작업을 시작해볼까요?
                    </div>
                    <div style={{ opacity: 0.72, lineHeight: 1.6 }}>
                      오늘 주문, 정산 대기, 지출 흐름을 한 번에 확인하고 바로 대응할 수 있도록 구성했어요.
                    </div>
                    <div className="bh-search-row" style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 18 }}>
                      <div style={theme.searchBox}>
                        <span style={{ fontSize: 22, opacity: 0.5 }}>⌕</span>
                        <input defaultValue="오늘 거래내역, 매출, 정산 관련 질문을 해보세요..." style={theme.searchInput} />
                        <span style={{ fontSize: 22, color: theme.accent }}>◔</span>
                      </div>
                    </div>
                  </div>
                  <div style={theme.aiCard}>
                    <div style={{ fontSize: 14, opacity: 0.7 }}>AI 비서</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 10, lineHeight: 1.5 }}>
                      “오늘 정산 대기 몇 건이야?”
                    </div>
                    <div style={{ marginTop: 10, color: theme.muted, lineHeight: 1.6 }}>
                      현재 정산 대기 {salesSummary.pendingSettlement}건, 오늘 주문 {salesSummary.todayOrderCount}건입니다.
                    </div>
                    <button style={{ ...theme.primaryAction, marginTop: 16 }}>AI에게 질문하기</button>
                  </div>
                </div>
              </div>

              <div className="bh-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
                <StatCard theme={theme} label="총매출" value={won(salesSummary.totalSales)} />
                <StatCard theme={theme} label="총지출" value={won(salesSummary.totalExpense)} gold />
                <StatCard theme={theme} label="순수익" value={won(salesSummary.totalProfit)} green />
                <StatCard theme={theme} label="정산 대기" value={`${salesSummary.pendingSettlement}건`} />
              </div>

              <div className="bh-main-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginTop: 20 }}>
                <div style={theme.mainCard} className="bh-hover">
                  <SectionHeader title="매출 요약" action="주간 기준" theme={theme} />
                  <div style={theme.chartCard}>
                    <div style={{ fontWeight: 700, marginBottom: 18 }}>최근 매출 / 지출 흐름</div>
                    <div style={{ display: "flex", alignItems: "end", gap: 12, height: 180 }}>
                      {dailyChart.map((item) => (
                        <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "end", gap: 4, height: 150, width: "100%" }}>
                            <div style={{ width: "50%", height: `${Math.max(24, item.sales / 2500)}px`, background: theme.barPrimary, borderRadius: 10 }} />
                            <div style={{ width: "50%", height: `${Math.max(18, item.expense / 2000)}px`, background: theme.barSecondary, borderRadius: 10 }} />
                          </div>
                          <div style={{ fontSize: 12, opacity: 0.7 }}>{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                    <button style={theme.secondaryAction}>정산 패널 보기</button>
                    <button style={theme.primaryAction}>매출분석 보기</button>
                  </div>
                </div>

                <div style={theme.mainCard} className="bh-hover">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>최근 주문 내역</div>
                    <button style={theme.linkBtn} onClick={() => setActiveTab("수발주관리")}>더보기 ›</button>
                  </div>
                  {orders.slice(0, 4).map((row) => (
                    <div key={row.id} style={theme.listCard}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{row.client}</div>
                        <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.product} · {row.type}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800 }}>{won(row.sales)}</div>
                        <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "수발주관리" && (
            <div className="bh-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 20 }}>
              <div style={theme.mainCard}>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>주문 등록</div>
                <form onSubmit={handleOrderSubmit} className="bh-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <SelectField label="구분" value={orderForm.type} onChange={(value) => setOrderForm((prev) => ({ ...prev, type: value }))} options={["화환", "식물"]} theme={theme} />
                  <SelectField label="상태" value={orderForm.status} onChange={(value) => setOrderForm((prev) => ({ ...prev, status: value }))} options={["접수", "제작중", "배송중", "완료"]} theme={theme} />
                  <InputField label="거래처" value={orderForm.client} onChange={(value) => setOrderForm((prev) => ({ ...prev, client: value }))} theme={theme} />
                  <InputField label="상품명" value={orderForm.product} onChange={(value) => setOrderForm((prev) => ({ ...prev, product: value }))} theme={theme} />
                  <InputField label="매출" type="number" value={orderForm.sales} onChange={(value) => setOrderForm((prev) => ({ ...prev, sales: value }))} theme={theme} />
                  <InputField label="퀵비" type="number" value={orderForm.quick} onChange={(value) => setOrderForm((prev) => ({ ...prev, quick: value }))} theme={theme} />
                  <InputField label="수수료" type="number" value={orderForm.fee} onChange={(value) => setOrderForm((prev) => ({ ...prev, fee: value }))} theme={theme} />
                  <InputField label="날짜" type="date" value={orderForm.date} onChange={(value) => setOrderForm((prev) => ({ ...prev, date: value }))} theme={theme} />
                  <TextAreaField label="메모" value={orderForm.memo} onChange={(value) => setOrderForm((prev) => ({ ...prev, memo: value }))} theme={theme} full />
                  <button type="submit" style={{ ...theme.primaryAction, width: "100%", gridColumn: "1 / -1" }}>주문 등록하기</button>
                </form>
              </div>

              <div style={theme.mainCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>주문 현황</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["전체", "화환", "식물"].map((item) => (
                      <button key={item} onClick={() => setOrderFilter(item)} style={orderFilter === item ? theme.filterActive : theme.filterButton}>{item}</button>
                    ))}
                  </div>
                </div>

                <div className="bh-orders-table" style={{ display: "block" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ color: theme.muted, textAlign: "left", borderBottom: `1px solid ${theme.line}` }}>
                        <th style={theme.th}>거래처</th>
                        <th style={theme.th}>상품 / 구분</th>
                        <th style={theme.th}>매출</th>
                        <th style={theme.th}>상태</th>
                        <th style={theme.th}>날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((row) => (
                        <tr key={row.id} style={{ borderBottom: `1px solid ${theme.line}` }}>
                          <td style={theme.td}>{row.client}</td>
                          <td style={theme.td}>
                            <div style={{ fontWeight: 700 }}>{row.product}</div>
                            <div style={{ marginTop: 4, fontSize: 12, color: theme.muted }}>{row.type}</div>
                          </td>
                          <td style={theme.td}>{won(row.sales)}</td>
                          <td style={theme.td}>
                            <select value={row.status} onChange={(e) => updateOrderStatus(row.id, e.target.value)} style={theme.inlineSelect}>
                              {["접수", "제작중", "배송중", "완료"].map((status) => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                          </td>
                          <td style={theme.td}>{formatDate(row.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bh-orders-mobile" style={{ display: "none" }}>
                  {filteredOrders.map((row) => (
                    <div key={row.id} style={theme.mobileOrderCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 800 }}>{row.client}</div>
                          <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.product} · {row.type}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 800 }}>{won(row.sales)}</div>
                          <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.status}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "거래처내역" && (
            <div style={theme.mainCard}>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>거래처내역</div>
              {clients.map((client) => {
                const clientOrders = orders.filter((item) => item.client === client.name);
                const sales = clientOrders.reduce((sum, item) => sum + item.sales, 0);
                return (
                  <div key={client.id} style={theme.listCardLarge}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{client.name}</div>
                      <div style={{ marginTop: 6, color: theme.muted }}>{client.settlement} · 최근 주문 {clientOrders.length}건</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{won(sales)}</div>
                      <div style={{ marginTop: 6, color: theme.muted }}>누적 매출</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "거래처정보" && (
            <div style={theme.mainCard}>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>거래처정보</div>
              <div className="bh-analytics-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {clients.map((client) => (
                  <div key={client.id} style={theme.infoCard}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{client.name}</div>
                    <InfoRow label="담당자" value={client.manager} theme={theme} />
                    <InfoRow label="연락처" value={client.phone} theme={theme} />
                    <InfoRow label="주소" value={client.address} theme={theme} />
                    <InfoRow label="정산 방식" value={client.settlement} theme={theme} />
                    <InfoRow label="특이사항" value={client.note} theme={theme} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "달력" && (
            <div style={theme.mainCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>달력</div>
                <button style={theme.smallSelect}>2026년 4월 ▾</button>
              </div>
              {scheduleItems.map((item) => (
                <div key={item.id} style={theme.listCardLarge}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{item.title}</div>
                    <div style={{ color: theme.muted, marginTop: 6 }}>{item.client} · {item.type}</div>
                  </div>
                  <div style={{ fontWeight: 700 }}>{formatDate(item.date)}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "매출분석" && (
            <div className="bh-analytics-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
              <div style={theme.mainCard}>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>매출분석</div>
                <div className="bh-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                  <StatCard theme={theme} label="화환 매출" value={won(salesSummary.wreathSales)} />
                  <StatCard theme={theme} label="식물 매출" value={won(salesSummary.plantSales)} />
                  <StatCard theme={theme} label="화환 지출" value={won(salesSummary.wreathExpense)} gold />
                  <StatCard theme={theme} label="식물 지출" value={won(salesSummary.plantExpense)} gold />
                </div>
                <div style={{ ...theme.chartCard, marginTop: 16 }}>
                  <div style={{ fontWeight: 700, marginBottom: 16 }}>손익 핵심 지표</div>
                  <div style={{ display: "grid", gap: 12 }}>
                    <MetricRow label="총매출" value={won(salesSummary.totalSales)} theme={theme} />
                    <MetricRow label="총지출" value={won(salesSummary.totalExpense)} theme={theme} />
                    <MetricRow label="퀵비 합계" value={won(salesSummary.totalQuick)} theme={theme} />
                    <MetricRow label="수수료 합계" value={won(salesSummary.totalFee)} theme={theme} />
                    <MetricRow label="순수익" value={won(salesSummary.totalProfit)} theme={theme} strong />
                  </div>
                </div>
              </div>

              <div style={theme.mainCard}>
                <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 18 }}>거래처 순위</div>
                {clients
                  .map((client) => ({
                    ...client,
                    total: orders.filter((item) => item.client === client.name).reduce((sum, item) => sum + item.sales, 0),
                  }))
                  .sort((a, b) => b.total - a.total)
                  .map((client, index) => (
                    <div key={client.id} style={theme.rankCard}>
                      <div style={theme.rankBadge}>{index + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800 }}>{client.name}</div>
                        <div style={{ color: theme.muted, marginTop: 4 }}>{client.settlement}</div>
                      </div>
                      <div style={{ fontWeight: 800 }}>{won(client.total)}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "지출내역" && (
            <div className="bh-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: 20 }}>
              <div style={theme.mainCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>지출 등록</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["화환", "식물"].map((item) => (
                      <button key={item} onClick={() => {
                        setExpenseType(item);
                        setExpenseForm((prev) => ({ ...prev, type: item, category: spendCategories[item][0] }));
                      }} style={expenseType === item ? theme.filterActive : theme.filterButton}>{item}</button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleExpenseSubmit} className="bh-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <InputField label="날짜" type="date" value={expenseForm.date} onChange={(value) => setExpenseForm((prev) => ({ ...prev, date: value }))} theme={theme} />
                  <SelectField label="구분" value={expenseForm.type} onChange={(value) => setExpenseForm((prev) => ({ ...prev, type: value, category: spendCategories[value][0] }))} options={["화환", "식물"]} theme={theme} />
                  <SelectField label="지출 항목" value={expenseForm.category} onChange={(value) => setExpenseForm((prev) => ({ ...prev, category: value }))} options={spendCategories[expenseForm.type]} theme={theme} />
                  <InputField label="금액" type="number" value={expenseForm.amount} onChange={(value) => setExpenseForm((prev) => ({ ...prev, amount: value }))} theme={theme} />
                  <InputField label="관련 주문" value={expenseForm.relatedOrder} onChange={(value) => setExpenseForm((prev) => ({ ...prev, relatedOrder: value }))} theme={theme} />
                  <TextAreaField label="메모" value={expenseForm.note} onChange={(value) => setExpenseForm((prev) => ({ ...prev, note: value }))} theme={theme} full />
                  <button type="submit" style={{ ...theme.primaryAction, width: "100%", gridColumn: "1 / -1" }}>지출 등록하기</button>
                </form>

                <div style={{ ...theme.chartCard, marginTop: 18 }}>
                  <div style={{ fontWeight: 700, marginBottom: 12 }}>{expenseType} 항목별 합계</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {expenseTotalsByCategory.map((item) => (
                      <MetricRow key={item.category} label={item.category} value={won(item.total)} theme={theme} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={theme.mainCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>지출내역</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["전체", "화환", "식물"].map((item) => (
                      <button key={item} onClick={() => setExpenseFilter(item)} style={expenseFilter === item ? theme.filterActive : theme.filterButton}>{item}</button>
                    ))}
                  </div>
                </div>

                {filteredExpenses.map((item) => (
                  <div key={item.id} style={theme.listCardLarge}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{item.relatedOrder}</div>
                      <div style={{ color: theme.muted, marginTop: 6 }}>{item.type} · {item.category} · {formatDate(item.date)}</div>
                      <div style={{ color: theme.muted, marginTop: 6 }}>{item.note}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>{won(item.amount)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "사진방" && (
            <div style={theme.mainCard}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>사진방</div>
                <button style={theme.primaryAction}>사진 업로드</button>
              </div>
              <div className="bh-analytics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {photoItems.map((photo) => (
                  <div key={photo.id} style={theme.photoCard}>
                    <div style={theme.photoMock}>📸</div>
                    <div style={{ fontWeight: 800, marginTop: 14 }}>{photo.title}</div>
                    <div style={{ color: theme.muted, marginTop: 6 }}>{photo.tag} · {formatDate(photo.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18 }}>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>{title}</div>
      <button style={theme.smallSelect}>{action} ▾</button>
    </div>
  );
}

function StatCard({ theme, label, value, green, gold }) {
  return (
    <div style={{ ...theme.statMiniCard }}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{label}</div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginTop: 10,
          color: green ? "#3f6d52" : gold ? theme.accent : theme.text,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.line}` }}>
      <div style={{ color: theme.muted }}>{label}</div>
      <div style={{ textAlign: "right", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function MetricRow({ label, value, theme, strong }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, paddingBottom: 10, borderBottom: `1px solid ${theme.line}` }}>
      <div style={{ color: theme.muted }}>{label}</div>
      <div style={{ fontWeight: strong ? 800 : 700, color: strong ? theme.text : theme.text }}>{value}</div>
    </div>
  );
}

function InputField({ label, value, onChange, theme, type = "text" }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 13, color: theme.muted }}>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={theme.field} />
    </label>
  );
}

function SelectField({ label, value, onChange, options, theme }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontSize: 13, color: theme.muted }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={theme.field}>
        {options.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({ label, value, onChange, theme, full }) {
  return (
    <label style={{ display: "grid", gap: 8, gridColumn: full ? "1 / -1" : "auto" }}>
      <span style={{ fontSize: 13, color: theme.muted }}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} style={{ ...theme.field, resize: "vertical", paddingTop: 14 }} />
    </label>
  );
}

const lightTheme = {
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
    boxShadow: "0 30px 80px rgba(15, 23, 42, 0.16)",
    border: "1px solid rgba(255,255,255,0.7)",
    background: "#f7f8fb",
  },
  windowBar: {
    background: "linear-gradient(90deg, #2d2f3d 0%, #1f2430 100%)",
    color: "#f8fafc",
    padding: "12px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  browserBar: {
    background: "#2c3140",
    color: "#f8fafc",
    padding: "10px 18px",
    display: "grid",
    gridTemplateColumns: "160px 1fr 120px",
    gap: 14,
    alignItems: "center",
  },
  dot: { width: 12, height: 12, borderRadius: 999 },
  addressBar: {
    background: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "10px 14px",
    opacity: 0.85,
  },
  modeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    background: "rgba(255,255,255,0.92)",
    padding: "18px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e8edf5",
  },
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
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    border: "1px solid #e7ebf3",
    background: "white",
    cursor: "pointer",
    fontSize: 18,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    borderRadius: 999,
    background: "#ef4444",
    color: "white",
    fontSize: 11,
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
  },
  notificationPanel: {
    position: "absolute",
    top: 56,
    right: 0,
    width: 320,
    background: "white",
    border: "1px solid #e7ebf3",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
    zIndex: 30,
  },
  notificationItem: {
    padding: "12px 0",
    borderBottom: "1px solid #edf2f7",
  },
  loginBtn: {
    border: "none",
    borderRadius: 14,
    padding: "12px 18px",
    background: "linear-gradient(135deg, #d7b36a 0%, #bf9348 100%)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },
  tabRow: {
    display: "flex",
    gap: 10,
    overflowX: "auto",
    padding: "16px 28px 0",
    background: "rgba(255,255,255,0.92)",
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
  body: {
    padding: 32,
    background: "linear-gradient(135deg, #f7f8fb 0%, #eef2f7 100%)",
  },
  heroSection: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(240,243,249,0.84) 100%)",
    border: "1px solid rgba(255,255,255,0.7)",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
  },
  aiCard: {
    width: 320,
    minWidth: 280,
    borderRadius: 24,
    padding: 22,
    background: "linear-gradient(135deg, #111827 0%, #2b3548 100%)",
    color: "white",
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "white",
    border: "1px solid #e7ebf3",
    borderRadius: 18,
    padding: "14px 18px",
    boxShadow: "0 10px 20px rgba(15,23,42,0.04)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 16,
    background: "transparent",
    color: "#475569",
  },
  mainCard: {
    background: "rgba(255,255,255,0.88)",
    border: "1px solid rgba(255,255,255,0.8)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
  },
  smallSelect: {
    border: "1px solid #e7ebf3",
    background: "#f8fafc",
    color: "#334155",
    borderRadius: 14,
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  statMiniCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(247,249,252,0.95) 100%)",
    border: "1px solid #edf2f7",
    borderRadius: 18,
    padding: 16,
  },
  chartCard: {
    border: "1px solid #edf2f7",
    borderRadius: 24,
    padding: 18,
    background: "linear-gradient(180deg, #fbfcfe 0%, #f7f9fc 100%)",
  },
  secondaryAction: {
    border: "1px solid #d8e0eb",
    borderRadius: 16,
    background: "linear-gradient(135deg, #a8bddc 0%, #8da8d3 100%)",
    color: "white",
    padding: "14px 20px",
    fontWeight: 800,
    cursor: "pointer",
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
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontWeight: 700,
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
  inlineSelect: {
    width: "100%",
    border: "1px solid #e7ebf3",
    borderRadius: 10,
    padding: "8px 10px",
    background: "white",
  },
  listCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid #edf2f7",
  },
  listCardLarge: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "18px 0",
    borderBottom: "1px solid #edf2f7",
  },
  infoCard: {
    border: "1px solid #edf2f7",
    borderRadius: 22,
    padding: 18,
    background: "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)",
  },
  rankCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid #edf2f7",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "#111827",
    color: "white",
    fontWeight: 800,
  },
  photoCard: {
    border: "1px solid #edf2f7",
    borderRadius: 22,
    padding: 18,
    background: "white",
  },
  photoMock: {
    height: 180,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    fontSize: 40,
    background: "linear-gradient(135deg, #f4efe4 0%, #e5eef7 100%)",
  },
  th: { padding: "12px 10px", fontSize: 13, fontWeight: 700 },
  td: { padding: "16px 10px", fontSize: 15 },
  mobileOrderCard: {
    border: "1px solid #edf2f7",
    borderRadius: 18,
    padding: 14,
    background: "white",
  },
  muted: "#7b8794",
  text: "#1f2937",
  accent: "#bf9348",
  profit: "#3f6d52",
  line: "#edf2f7",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
  barSecondary: "linear-gradient(180deg, #b8cae6 0%, #9cb7df 100%)",
};

const darkTheme = {
  ...lightTheme,
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
    boxShadow: "0 30px 90px rgba(0, 0, 0, 0.45)",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#121621",
  },
  windowBar: {
    background: "linear-gradient(90deg, #12141d 0%, #1b2030 100%)",
    color: "#f8fafc",
    padding: "12px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  browserBar: {
    background: "#171c28",
    color: "#f8fafc",
    padding: "10px 18px",
    display: "grid",
    gridTemplateColumns: "160px 1fr 120px",
    gap: 14,
    alignItems: "center",
  },
  addressBar: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: "10px 14px",
    opacity: 0.9,
  },
  modeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.06)",
    color: "#f8fafc",
    cursor: "pointer",
  },
  header: {
    background: "rgba(16, 20, 31, 0.95)",
    padding: "18px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#f8fafc",
    cursor: "pointer",
    fontSize: 18,
    position: "relative",
  },
  notificationPanel: {
    position: "absolute",
    top: 56,
    right: 0,
    width: 320,
    background: "#161b27",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
    zIndex: 30,
  },
  notificationItem: {
    padding: "12px 0",
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
    color: "#ffffff",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  body: {
    padding: 32,
    background: "linear-gradient(180deg, #121621 0%, #171c28 100%)",
  },
  heroSection: {
    background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 40px rgba(0,0,0,0.16)",
  },
  aiCard: {
    width: 320,
    minWidth: 280,
    borderRadius: 24,
    padding: 22,
    background: "linear-gradient(135deg, #1d2433 0%, #2d3850 100%)",
    color: "white",
  },
  searchBox: {
    flex: 1,
    minWidth: 260,
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: "14px 18px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.16)",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 16,
    background: "transparent",
    color: "#e5e7eb",
  },
  mainCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.02) 100%)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 18px 40px rgba(0,0,0,0.20)",
  },
  smallSelect: {
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#e5e7eb",
    borderRadius: 14,
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  statMiniCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 18,
    padding: 16,
  },
  chartCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 18,
    background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
  },
  secondaryAction: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    background: "linear-gradient(135deg, #7187ad 0%, #5d7399 100%)",
    color: "white",
    padding: "14px 20px",
    fontWeight: 800,
    cursor: "pointer",
  },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#cbd5e1",
    cursor: "pointer",
    fontWeight: 700,
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
    background: "rgba(255,255,255,0.1)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
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
  inlineSelect: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: "8px 10px",
    background: "rgba(255,255,255,0.03)",
    color: "#f8fafc",
  },
  listCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  listCardLarge: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: "18px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  infoCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 18,
    background: "rgba(255,255,255,0.03)",
  },
  rankCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 0",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontWeight: 800,
  },
  photoCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: 18,
    background: "rgba(255,255,255,0.03)",
  },
  photoMock: {
    height: 180,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    fontSize: 40,
    background: "linear-gradient(135deg, rgba(215,179,106,0.18) 0%, rgba(120,146,187,0.18) 100%)",
  },
  mobileOrderCard: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 14,
    background: "rgba(255,255,255,0.03)",
  },
  muted: "#94a3b8",
  text: "#f8fafc",
  accent: "#d7b36a",
  profit: "#a8d49d",
  line: "rgba(255,255,255,0.08)",
  barPrimary: "linear-gradient(180deg, #d8ba76 0%, #c59d55 100%)",
  barSecondary: "linear-gradient(180deg, #7892bb 0%, #5e78a2 100%)",
};

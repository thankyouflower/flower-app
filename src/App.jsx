import React, { useMemo, useState } from "react";

const tabs = ["홈", "주문 관리", "정산 현황", "매출 달력", "퀵비 지도", "사진방", "AI 비서", "공지사항"];

const sampleOrders = [
  { id: 1, chain: "송죽플라워", sales: 180000, profit: 110000, quick: 20000, fee: 50000, date: "04.25" },
  { id: 2, chain: "반하다플라워", sales: 200000, profit: 100000, quick: 70000, fee: 60000, date: "04.25" },
  { id: 3, chain: "아이마플라워", sales: 220000, profit: 140000, quick: 60000, fee: 60000, date: "04.24" },
  { id: 4, chain: "송죽플라워", sales: 100000, profit: 60000, quick: 20000, fee: 20000, date: "04.24" },
];

const summary = {
  totalSales: 2600000,
  totalProfit: 820000,
  chainCount: 15,
  pendingSettlement: 8,
};

function won(v) {
  return `${Number(v).toLocaleString()}원`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("홈");
  const [darkMode, setDarkMode] = useState(false);
  const theme = darkMode ? darkTheme : lightTheme;

  const chartBars = useMemo(
    () => [120, 160, 210, 140, 250, 180, 300, 220, 360, 200, 420, 260],
    []
  );

  return (
    <div style={{ ...theme.page }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, Pretendard, Arial, sans-serif; }
        .bh-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .bh-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,.35); border-radius: 999px; }
        .bh-hover { transition: all .2s ease; }
        .bh-hover:hover { transform: translateY(-1px); }
        @media (max-width: 1100px) {
          .bh-main-grid { grid-template-columns: 1fr !important; }
          .bh-summary-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          .bh-summary-grid { grid-template-columns: 1fr !important; }
          .bh-header { padding: 14px 16px !important; }
          .bh-body { padding: 16px !important; }
          .bh-search-row { flex-direction: column !important; }
          .bh-brand-title { font-size: 28px !important; }
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
          <div style={theme.addressBar}>https://</div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <span>☆</span>
            <span>☰</span>
            <button
              onClick={() => setDarkMode((v) => !v)}
              style={theme.modeButton}
            >
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

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button style={theme.iconBtn}>🔔</button>
            <button style={theme.loginBtn}>로그인</button>
          </div>
        </div>

        <div style={{ ...theme.tabRow }} className="bh-scroll">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? theme.activeTab : theme.tab}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ ...theme.body }} className="bh-body">
          <div style={theme.heroSection}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 10 }}>
                안녕하세요, 좋은 아침입니다!
              </div>
              <div className="bh-search-row" style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={theme.searchBox}>
                  <span style={{ fontSize: 22, opacity: 0.5 }}>⌕</span>
                  <input
                    defaultValue="오늘 거래내역, 매출, 정산 관련 질문을 해보세요..."
                    style={theme.searchInput}
                  />
                  <span style={{ fontSize: 22, color: theme.accent }}>◔</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bh-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
            <div style={theme.mainCard} className="bh-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>매출 요약</div>
                  <div style={{ marginTop: 8, opacity: 0.68 }}>2024-04-19 ~ 2024-04-25</div>
                </div>
                <button style={theme.smallSelect}>주간 기준 ▾</button>
              </div>

              <div className="bh-summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
                <StatCard theme={theme} label="총매출" value={won(summary.totalSales)} />
                <StatCard theme={theme} label="순수익" value={won(summary.totalProfit)} green />
                <StatCard theme={theme} label="체인 거래" value={`${summary.chainCount}건`} />
                <StatCard theme={theme} label="정산 대기" value={`${summary.pendingSettlement}건`} gold />
              </div>

              <div style={theme.chartCard}>
                <div style={{ fontWeight: 700, marginBottom: 18 }}>금주 매출</div>
                <div style={{ display: "flex", alignItems: "end", gap: 12, height: 180 }}>
                  {chartBars.map((h, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "end", alignItems: "center", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "end", gap: 4, height: 150, width: "100%" }}>
                        <div style={{ width: "50%", height: `${h * 0.32}px`, background: theme.barPrimary, borderRadius: 10 }} />
                        <div style={{ width: "50%", height: `${Math.max(40, h * 0.22)}px`, background: theme.barSecondary, borderRadius: 10 }} />
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7 }}>{["금", "토", "일", "월", "화", "수"][i % 6]}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
                <button style={theme.secondaryAction}>정산 패널 보기</button>
                <button style={theme.primaryAction}>정산 바로가기</button>
              </div>
            </div>

            <div style={theme.mainCard} className="bh-hover">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em" }}>최근 주문 내역</div>
                <button style={theme.linkBtn}>더보기 ›</button>
              </div>

              <div className="bh-orders-table" style={{ display: "block" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ color: theme.muted, textAlign: "left", borderBottom: `1px solid ${theme.line}` }}>
                      <th style={theme.th}>거래처</th>
                      <th style={theme.th}>매출 / 순수익</th>
                      <th style={theme.th}>퀵 / 수수료</th>
                      <th style={theme.th}>날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleOrders.map((row) => (
                      <tr key={row.id} style={{ borderBottom: `1px solid ${theme.line}` }}>
                        <td style={theme.td}>
                          <div style={{ fontWeight: 800 }}>{row.chain}</div>
                          <div style={{ marginTop: 6, fontSize: 13, color: theme.muted }}>주기별 꽃 정산수익</div>
                        </td>
                        <td style={theme.td}>
                          <div style={{ fontWeight: 800 }}>{won(row.sales)}</div>
                          <div style={{ marginTop: 6, fontSize: 13, color: theme.profit }}>+ {won(row.profit).replace("원", "")}</div>
                        </td>
                        <td style={theme.td}>
                          <div style={{ fontWeight: 800 }}>{won(row.quick)}</div>
                          <div style={{ marginTop: 6, fontSize: 13, color: theme.muted }}>{won(row.fee)}</div>
                        </td>
                        <td style={theme.td}>{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bh-orders-mobile" style={{ display: "none" }}>
                {sampleOrders.map((row) => (
                  <div key={row.id} style={theme.mobileOrderCard}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 800 }}>{row.chain}</div>
                        <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{row.date}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800 }}>{won(row.sales)}</div>
                        <div style={{ fontSize: 13, color: theme.profit, marginTop: 4 }}>{won(row.profit)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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

const lightTheme = {
  page: {
    background: "linear-gradient(180deg, #f2f4f8 0%, #eceff4 100%)",
    color: "#1f2937",
    minHeight: "100vh",
    padding: 18,
  },
  windowWrap: {
    maxWidth: 1400,
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
    maxWidth: 1400,
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
  th: { padding: "12px 10px", fontSize: 13, fontWeight: 700 },
  td: { padding: "16px 10px", fontSize: 15 },
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

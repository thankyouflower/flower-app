import React, { useMemo, useState } from "react";
import { Search, Plus, Truck, CheckCircle2, Clock, AlertTriangle, Phone, MapPin, CalendarDays, Wallet, Flower2, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const initialOrders = [
  {
    id: "FW-20260427-001",
    product: "근조 3단 화환",
    customer: "김민수",
    phone: "010-2345-7788",
    receiver: "대전성모병원 장례식장 2호실",
    address: "대전 중구 대흥로 64",
    message: "삼가 고인의 명복을 빕니다",
    price: 89000,
    payment: "결제완료",
    status: "접수",
    deliveryTime: "오늘 13:00",
    partner: "대전중구 제휴화원",
  },
  {
    id: "FW-20260427-002",
    product: "축하 3단 화환",
    customer: "박지훈",
    phone: "010-9981-1200",
    receiver: "유성컨벤션웨딩홀",
    address: "대전 유성구 온천로 77",
    message: "결혼을 진심으로 축하합니다",
    price: 99000,
    payment: "결제완료",
    status: "제작중",
    deliveryTime: "오늘 15:30",
    partner: "유성구 제휴화원",
  },
  {
    id: "FW-20260427-003",
    product: "서양난",
    customer: "이서연",
    phone: "010-4412-3900",
    receiver: "둔산동 법무법인 새출발",
    address: "대전 서구 둔산중로 55",
    message: "개업을 축하드립니다",
    price: 120000,
    payment: "입금대기",
    status: "확인필요",
    deliveryTime: "내일 10:00",
    partner: "미배정",
  },
  {
    id: "FW-20260427-004",
    product: "근조 4단 화환",
    customer: "최유진",
    phone: "010-8877-5521",
    receiver: "충남대학교병원 장례식장 특1호",
    address: "대전 중구 문화로 282",
    message: "깊은 애도를 표합니다",
    price: 150000,
    payment: "결제완료",
    status: "배송중",
    deliveryTime: "오늘 12:30",
    partner: "중구 프리미엄화원",
  },
  {
    id: "FW-20260426-015",
    product: "축하 오브제 화환",
    customer: "정다은",
    phone: "010-3310-7622",
    receiver: "대전 예술의전당",
    address: "대전 서구 둔산대로 135",
    message: "공연 개최를 축하합니다",
    price: 180000,
    payment: "결제완료",
    status: "배송완료",
    deliveryTime: "어제 17:00",
    partner: "서구 플라워랩",
  },
];

const statusStyles = {
  접수: "bg-slate-100 text-slate-700 border-slate-200",
  제작중: "bg-amber-100 text-amber-700 border-amber-200",
  배송중: "bg-blue-100 text-blue-700 border-blue-200",
  배송완료: "bg-emerald-100 text-emerald-700 border-emerald-200",
  확인필요: "bg-rose-100 text-rose-700 border-rose-200",
};

const statuses = ["전체", "접수", "제작중", "배송중", "배송완료", "확인필요"];

function formatWon(value) {
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export default function FlowerWreathERP() {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("전체");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "전체" || order.status === statusFilter;
      const text = `${order.id} ${order.product} ${order.customer} ${order.receiver} ${order.address} ${order.partner}`;
      const matchesQuery = text.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const summary = useMemo(() => {
    const todaySales = orders.reduce((sum, order) => sum + (order.payment === "결제완료" ? order.price : 0), 0);
    return {
      total: orders.length,
      urgent: orders.filter((order) => order.status === "확인필요").length,
      shipping: orders.filter((order) => order.status === "배송중").length,
      done: orders.filter((order) => order.status === "배송완료").length,
      sales: todaySales,
    };
  }, [orders]);

  const moveStatus = (id, nextStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status: nextStatus } : order)));
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-stone-600 shadow-sm">
              <Flower2 className="h-4 w-4" />
              화환 주문 ERP
            </div>
            <h1 className="text-3xl font-bold tracking-tight">주문 · 제작 · 배송 통합관리</h1>
            <p className="mt-2 text-stone-500">화환 주문 접수부터 제휴화원 배정, 배송 완료까지 한 화면에서 관리합니다.</p>
          </div>

          <div className="flex gap-2">
            <Button className="rounded-2xl px-4 py-5 shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> 신규 주문 등록
            </Button>
          </div>
        </header>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <SummaryCard title="전체 주문" value={`${summary.total}건`} icon={<CalendarDays className="h-5 w-5" />} />
          <SummaryCard title="확인 필요" value={`${summary.urgent}건`} icon={<AlertTriangle className="h-5 w-5" />} emphasis />
          <SummaryCard title="배송중" value={`${summary.shipping}건`} icon={<Truck className="h-5 w-5" />} />
          <SummaryCard title="배송완료" value={`${summary.done}건`} icon={<CheckCircle2 className="h-5 w-5" />} />
          <SummaryCard title="결제 완료 금액" value={formatWon(summary.sales)} icon={<Wallet className="h-5 w-5" />} />
        </section>

        <Card className="mb-6 rounded-3xl border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="주문번호, 고객명, 배송지, 제휴화원 검색"
                  className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-stone-400"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      statusFilter === status ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <main className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} onMoveStatus={moveStatus} />
            ))}
          </section>

          <aside className="space-y-4">
            <Card className="rounded-3xl border-none shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">오늘 체크리스트</h2>
                  <Clock className="h-5 w-5 text-stone-400" />
                </div>
                <div className="space-y-3 text-sm">
                  <ChecklistItem text="입금대기 주문 확인" active />
                  <ChecklistItem text="미배정 제휴화원 배정" active />
                  <ChecklistItem text="배송완료 사진 업로드 확인" />
                  <ChecklistItem text="정산 예정 금액 확인" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none bg-stone-900 text-white shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <h2 className="text-lg font-bold">다음에 추가하면 좋은 기능</h2>
                </div>
                <p className="text-sm leading-6 text-stone-300">
                  주문 등록 폼, 배송 사진 업로드, 거래명세서 출력, 제휴화원별 정산, 네이버 스마트스토어 주문 자동 연동까지 확장할 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, emphasis = false }) {
  return (
    <Card className={`rounded-3xl border-none shadow-sm ${emphasis ? "bg-rose-50" : "bg-white"}`}>
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-stone-500">{title}</span>
          <div className="rounded-2xl bg-stone-100 p-2 text-stone-700">{icon}</div>
        </div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function OrderCard({ order, onMoveStatus }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-none bg-white shadow-sm transition hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-stone-400">{order.id}</span>
              <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[order.status]}`}>{order.status}</span>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">{order.payment}</span>
            </div>
            <h3 className="text-xl font-bold">{order.product}</h3>
            <p className="mt-1 text-sm text-stone-500">리본문구: {order.message}</p>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-xl font-bold">{formatWon(order.price)}</div>
            <div className="mt-1 text-sm text-stone-500">희망배송 {order.deliveryTime}</div>
          </div>
        </div>

        <div className="grid gap-3 rounded-2xl bg-stone-50 p-4 text-sm md:grid-cols-2">
          <InfoLine icon={<Phone className="h-4 w-4" />} label="주문자" value={`${order.customer} · ${order.phone}`} />
          <InfoLine icon={<Truck className="h-4 w-4" />} label="제휴화원" value={order.partner} />
          <InfoLine icon={<MapPin className="h-4 w-4" />} label="배송지" value={order.receiver} />
          <InfoLine icon={<MapPin className="h-4 w-4" />} label="주소" value={order.address} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-2xl" onClick={() => onMoveStatus(order.id, "제작중")}>제작중</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => onMoveStatus(order.id, "배송중")}>배송중</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => onMoveStatus(order.id, "배송완료")}>배송완료</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => onMoveStatus(order.id, "확인필요")}>확인필요</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoLine({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-stone-400">{icon}</div>
      <div>
        <div className="text-xs font-semibold text-stone-400">{label}</div>
        <div className="font-medium text-stone-800">{value}</div>
      </div>
    </div>
  );
}

function ChecklistItem({ text, active = false }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="font-medium text-stone-700">{text}</span>
      <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-rose-500" : "bg-emerald-500"}`} />
    </div>
  );
}

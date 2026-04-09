import { useState, useEffect } from "react";
export default function App(){
const [orders,setOrders]=useState(()=>JSON.parse(localStorage.getItem("orders")||"[]"));
const [clients,setClients]=useState(()=>JSON.parse(localStorage.getItem("clients")||"[]"));
const [form,setForm]=useState({business:"땡큐플라워",client:"",product:"",amount:""});
const [newClient,setNewClient]=useState("");
useEffect(()=>localStorage.setItem("orders",JSON.stringify(orders)),[orders]);
useEffect(()=>localStorage.setItem("clients",JSON.stringify(clients)),[clients]);
const addClient=()=>{if(!newClient)return;setClients([...clients,newClient]);setNewClient("");};
const addOrder=()=>{if(!form.client||!form.amount)return;setOrders([...orders,{...form,id:Date.now(),date:new Date().toLocaleDateString()}]);setForm({...form,client:"",product:"",amount:""});};
const total=orders.reduce((s,o)=>s+Number(o.amount),0);
return(<div style={{padding:20}}>
<h2>화환 관리</h2>
<input placeholder="거래처 추가" value={newClient} onChange={e=>setNewClient(e.target.value)}/>
<button onClick={addClient}>추가</button>
<hr/>
<select value={form.business} onChange={e=>setForm({...form,business:e.target.value})}>
<option>땡큐플라워</option><option>싱싱플라워</option></select>
<select value={form.client} onChange={e=>setForm({...form,client:e.target.value})}>
<option value="">거래처 선택</option>{clients.map((c,i)=><option key={i}>{c}</option>)}</select>
<input placeholder="상품" value={form.product} onChange={e=>setForm({...form,product:e.target.value})}/>
<input placeholder="금액" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
<button onClick={addOrder}>주문 추가</button>
<h3>총 매출: {total.toLocaleString()}원</h3>
<ul>{orders.map(o=><li key={o.id}>[{o.date}] {o.business} / {o.client} / {o.amount}원</li>)}</ul>
</div>);
}
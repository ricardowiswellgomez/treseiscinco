import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase, supabasePublishableKey } from "./lib/supabase.js";
import { applyAppLanguage } from "./i18n.js";
import { getSidebarItemLabel } from "./lib/sidebar-menu.js";

function AppIcon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: "false" };
  const glyphs = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
    products: <><path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z" /><path d="m3.4 7.6 8.6 4.7 8.6-4.7M12 12.3V21" /></>,
    sales: <><path d="M4 4.5h16v15H4z" /><path d="M8 9h8M8 13h4M8 16h8" /></>,
    accounts: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
    stats: <><path d="M4 20V11h4v9M10 20V4h4v16M16 20v-7h4v7" /></>,
    quotes: <><path d="M7 3h8l4 4v14H7z" /><path d="M15 3v5h4M10 12h6M10 16h6" /></>,
    customers: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5a5.5 5.5 0 0 1 11 0V20M16 5.5a3 3 0 0 1 0 5.8M18 14a4 4 0 0 1 2.5 3.7V20" /></>,
    profitability: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /><path d="M16 7h3v3" /></>,
    purchases: <><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 9H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    catalog: <><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    store: <><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M5 10v10h14V10M9 20v-6h6v6" /><path d="M3 10h18" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    whatsapp: <><path d="M20.2 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.2-4a8.2 8.2 0 1 1 15-4.4Z" /><path d="M8.2 8.4c.4-.8.8-.8 1.2-.1l.8 1.4c.2.3.1.6-.2.9l-.5.5c.8 1.5 1.9 2.5 3.4 3.1l.5-.6c.2-.3.5-.4.9-.2l1.4.7c.6.3.7.6.4 1.2-.4.8-1.3 1.1-2.2 1-3.1-.4-6.8-3.7-7.1-6.6-.1-.6.4-1.1 1.4-1.3Z" /></>,
    smartphone: <><rect x="6" y="2.5" width="12" height="19" rx="2.3" /><path d="M10 5h4M11 18.5h2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    truck: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12" /><path d="M4 6h.01M4 12h.01M4 18h.01" strokeWidth="3" /></>,
    audit: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    team: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 14a4 4 0 0 1 3 4v2" /></>,
    suppliers: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
    payments: <><path d="M4 6h16v12H4z" /><path d="M4 10h16M8 15h3" /></>,
    banks: <><path d="M3 9h18M4 20h16M5 9v11M9 9v11M15 9v11M19 9v11M12 3 2 8h20L12 3Z" /></>,
    receivables: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h5M14 16l2 2 3-4" /></>,
    payables: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h5M14 16l2-2 3 4" /></>,
    coupons: <><path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4V6Z" /><path d="m9 9 6 6M15 9h.01M9 15h.01" /></>,
    edit: <><path d="m4 16.5-.8 4.3 4.3-.8L20 7.5 16.5 4 4 16.5Z" /><path d="m14.8 5.7 3.5 3.5" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 10v6M14 10v6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.9.1l-.2.1-3.3-.9-.1-.2a1.7 1.7 0 0 0-1.3-1.2h-.2l-1.1-3.2.1-.2a1.7 1.7 0 0 0-.4-1.8l-.1-.2.9-3.2.2-.1a1.7 1.7 0 0 0 1.2-1.3v-.2l3.2-1.1.2.1a1.7 1.7 0 0 0 1.8-.4l.2-.1 3.2.9.1.2a1.7 1.7 0 0 0 1.3 1.2h.2l1.1 3.2-.1.2a1.7 1.7 0 0 0 .4 1.8l.1.2-.9 3.2-.2.1" transform="translate(-2 -2) scale(1.08)" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.6 2.6 0 1 1 4.5 1.8c-1.1 1-2 1.3-2 3M12 17h.01" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    "chevron-down": <><path d="m6 9 6 6 6-6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    expenses: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h5M8 16h3M16 15v3" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    "shield-check": <><path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6l8-3Z" /><path d="m8 12 2.5 2.5L16 9" /></>,
    package: <><path d="m12 3 9 4.5v9L12 21l-9-4.5v-9L12 3Z" /><path d="m3.5 7.6 8.5 4.7 8.5-4.7M12 12.3V21" /></>,
    receipt: <><path d="M5 3 7.5 5 10 3l2.5 2L15 3l2.5 2L20 3v18l-2.5-2L15 21l-2.5-2L10 21l-2.5-2L5 21V3Z" /><path d="M9 9h7M9 13h7M9 17h4" /></>,
    "chart-no-axes-combined": <><path d="M3 3v18h18" /><path d="m7 14 4-4 3 3 6-7" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1M16 5.5a3 3 0 0 1 0 5.8M18 14a4 4 0 0 1 3 4v2" /></>,
    sprout: <><path d="M12 21v-9" /><path d="M12 12C5 12 4 7 4 4c5 0 9 2 8 8Z" /><path d="M12 16c0-6 4-9 8-9 0 5-2 9-8 9Z" /></>,
    "file-spreadsheet": <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v5h4M9 12h7M9 16h7M12 10v8" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
    sliders: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" fill="var(--paper,#fff)" /><circle cx="15" cy="12" r="2" fill="var(--paper,#fff)" /><circle cx="10" cy="18" r="2" fill="var(--paper,#fff)" /></>
  };
  return <svg {...common}>{glyphs[name] || <circle cx="12" cy="12" r="8" />}</svg>;
}

function PaymentMethodTiles({ value, onChange, ariaLabel = "Medio de pago" }) {
  const methods = [["Efectivo","EF"],["Nequi","NQ"],["Daviplata","DV"],["Transferencia","TR"],["Tarjeta","TC"],["Otro","OT"]];
  return <div className="payment-method-tiles" role="group" aria-label={ariaLabel}>
    {methods.map(([method, mark]) => <button key={method} type="button" className={"payment-method-tile payment-method-tile-" + mark.toLowerCase() + (value === method ? " is-selected" : "")} aria-pressed={value === method} onClick={() => onChange(method)}>
      <span className={"payment-method-mark payment-method-mark-" + mark.toLowerCase()}>{mark}</span><strong>{method}</strong>
    </button>)}
  </div>;
}


function SimpleArea({ title, description, data, series, formatValue, badge = "Evolución", footnote = "Evolución calculada a partir de movimientos registrados." }) {
  const width=760,height=250,left=72,right=18,top=18,bottom=34;
  const plotWidth=width-left-right,plotHeight=height-top-bottom,rows=data||[],seriesList=series||[];
  const values=rows.flatMap((row)=>seriesList.map((item)=>Number(row[item.key])||0));
  const minValue=Math.min(0,...values),maxValue=Math.max(1,...values),span=Math.max(1,maxValue-minValue);
  const xAt=(index)=>rows.length<2?left+plotWidth/2:left+index*plotWidth/(rows.length-1);
  const yAt=(value)=>top+((maxValue-value)/span)*plotHeight,zeroY=yAt(0);
  const stride=Math.max(1,Math.ceil(rows.length/7));
  const valueText=(value)=>formatValue?formatValue(value):Number(value).toLocaleString("es-CO");
  return <section className="simple-chart panel simple-area-chart">
    <div className="simple-chart-heading"><div><h3>{title}</h3><p>{description}</p></div><span className="simple-chart-badge">{badge}</span></div>
    {rows.length ? <>
      <div className="simple-area-visual"><svg viewBox={"0 0 "+width+" "+height} role="img" aria-label={title+" · "+seriesList.map((item)=>item.label+": "+rows.slice(0,18).map((row)=>(row.label||row.key||"Dato")+": "+valueText(Number(row[item.key])||0)).join(", ")).join("; ")} preserveAspectRatio="none">
        {[0,1,2,3,4].map((step)=>{const y=top+step*plotHeight/4;return <line key={step} x1={left} x2={width-right} y1={y} y2={y} className="simple-area-gridline"/>;})}
        {seriesList.map((item)=>{const points=rows.map((row,index)=>({x:xAt(index),y:yAt(Number(row[item.key])||0),value:Number(row[item.key])||0,label:row.label||row.key||""}));if(!points.length)return null;const line=points.map((point,index)=>(index?"L":"M")+point.x.toFixed(2)+" "+point.y.toFixed(2)).join(" ");const areaPath="M"+points[0].x.toFixed(2)+" "+zeroY.toFixed(2)+" "+points.map((point)=>"L"+point.x.toFixed(2)+" "+point.y.toFixed(2)).join(" ")+" L"+points[points.length-1].x.toFixed(2)+" "+zeroY.toFixed(2)+" Z";return <g key={item.key}><path d={areaPath} fill={item.color} fillOpacity=".13"/><path d={line} fill="none" stroke={item.color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>{points.map((point,index)=><circle key={index} cx={point.x} cy={point.y} r={rows.length>45?2.2:3.2} fill={item.color}><title>{item.label} · {point.label}: {valueText(point.value)}</title></circle>)}</g>;})}
        {rows.map((row,index)=>(index===0||index===rows.length-1||index%stride===0)?<text key={row.key||index} x={xAt(index)} y={height-10} textAnchor="middle" className="simple-area-x-label">{row.label}</text>:null)}
      </svg></div>
      <div className="simple-area-legend">{seriesList.map((item)=><span key={item.key}><i style={{background:item.color}}/>{item.label}</span>)}</div>
    </>:<p className="simple-chart-empty">Aún no hay movimientos en este periodo para formar la evolución.</p>}
    <div className="simple-chart-footnote">{footnote}</div>
  </section>;
}

function getDateKeyInBogota(value) {
  if(!value)return todayInBogota();
  if(typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value))return value;
  const date=new Date(value);if(Number.isNaN(date.getTime()))return todayInBogota();
  const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(date);
  const item=(type)=>parts.find((part)=>part.type===type)?.value||"";
  return item("year")+"-"+item("month")+"-"+item("day");
}
function getHourInBogota(value) {
  const date=new Date(value);if(Number.isNaN(date.getTime()))return 12;
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Bogota",hour:"2-digit",hourCycle:"h23"}).formatToParts(date);
  return Number(parts.find((part)=>part.type==="hour")?.value||12);
}
function buildHomeTrendData(period,range,sales,purchases,expenses) {
  const hourly=period==="day",monthly=["quarter","semester","year"].includes(period),keys=[];
  if(hourly){for(let hour=0;hour<24;hour++)keys.push("h:"+String(hour).padStart(2,"0"));}
  else if(monthly){const cursor=new Date(range.start.slice(0,7)+"-01T12:00:00Z"),end=new Date(range.endExclusive+"T12:00:00Z");while(cursor<end&&keys.length<24){keys.push(cursor.toISOString().slice(0,7));cursor.setUTCMonth(cursor.getUTCMonth()+1);}}
  else{let cursor=range.start,safe=0;while(cursor<range.endExclusive&&safe++<400){keys.push(cursor);cursor=shiftHomeDateKey(cursor,1);}}
  const labelFor=(key)=>key.startsWith("h:")?key.slice(2)+":00":/^\d{4}-\d{2}$/.test(key)?new Date(key+"-01T12:00:00Z").toLocaleDateString("es-CO",{timeZone:"America/Bogota",month:"short"}):new Date(key+"T12:00:00Z").toLocaleDateString("es-CO",{timeZone:"America/Bogota",day:"2-digit",weekday:keys.length<=10?"short":undefined});
  const rows=new Map(keys.map((key)=>[key,{key,label:labelFor(key),income:0,purchases:0,expenses:0}]));
  const keyFor=(value,expenseDate=false)=>{if(hourly)return "h:"+String(expenseDate?12:getHourInBogota(value)).padStart(2,"0");const dateKey=getDateKeyInBogota(value);return monthly?dateKey.slice(0,7):dateKey;};
  const addRows=(source,field,amountField,dateField,expenseDate=false,excludedStatuses=[])=>{for(const item of source||[]){if(excludedStatuses.includes(String(item.status||"").toLowerCase()))continue;const bucket=rows.get(keyFor(item[dateField],expenseDate));if(bucket)bucket[field]+=Math.max(0,Number(item[amountField])||0);}};
  addRows(sales,"income","total_minor","sold_at",false,["cancelled","canceled","refunded","draft"]);
  addRows(purchases,"purchases","total_minor","purchased_at",false,["cancelled","canceled","draft","refunded"]);
  addRows(expenses,"expenses","amount_minor","expense_date",true);
  return [...rows.values()];
}
function buildProfitabilityTrendData(sales,saleItems,expenses,period) {
  const rowsByDate=new Map(),itemTotals=new Map();
  for(const item of saleItems||[]){const value=itemTotals.get(item.sale_id)||{revenue:0,cost:0};value.revenue+=Number(item.line_total_minor)||0;value.cost+=Math.round((Number(item.unit_cost_minor)||0)*(Number(item.quantity)||0));itemTotals.set(item.sale_id,value);}
  const records=[...(sales||[]).map((sale)=>({type:"sale",date:getDateKeyInBogota(sale.sold_at||sale.created_at),sale})),...(expenses||[]).map((expense)=>({type:"expense",date:getDateKeyInBogota(expense.expense_date),expense}))];
  if(!records.length)return [];
  const dates=records.map((record)=>record.date).sort(),minDate=new Date(dates[0]+"T12:00:00Z"),maxDate=new Date(dates[dates.length-1]+"T12:00:00Z");
  const spanDays=Math.max(1,Math.round((maxDate-minDate)/86400000)+1),monthly=period==="all"||period==="year"||spanDays>62,hourly=period==="day",keys=[];
  if(hourly){for(let hour=0;hour<24;hour++)keys.push("h:"+String(hour).padStart(2,"0"));}
  else if(monthly){const cursor=new Date(Date.UTC(minDate.getUTCFullYear(),minDate.getUTCMonth(),1)),end=new Date(Date.UTC(maxDate.getUTCFullYear(),maxDate.getUTCMonth()+1,1));while(cursor<end&&keys.length<600){keys.push(cursor.getUTCFullYear()+"-"+String(cursor.getUTCMonth()+1).padStart(2,"0"));cursor.setUTCMonth(cursor.getUTCMonth()+1);}}
  else{let date=dates[0],safe=0;while(date<=dates[dates.length-1]&&safe++<400){keys.push(date);date=shiftHomeDateKey(date,1);}}
  const labelFor=(key)=>key.startsWith("h:")?key.slice(2)+":00":/^\d{4}-\d{2}$/.test(key)?new Date(key+"-01T12:00:00Z").toLocaleDateString("es-CO",{timeZone:"America/Bogota",month:"short"}):new Date(key+"T12:00:00Z").toLocaleDateString("es-CO",{timeZone:"America/Bogota",day:"2-digit",weekday:keys.length<=10?"short":undefined});
  const bucketKey=(date,stamp,expense=false)=>hourly?"h:"+String(expense?12:getHourInBogota(stamp)).padStart(2,"0"):monthly?date.slice(0,7):date;
  for(const key of keys)rowsByDate.set(key,{key,label:labelFor(key),revenue:0,cost:0,expenses:0,result:0});
  for(const sale of sales||[]){const date=getDateKeyInBogota(sale.sold_at||sale.created_at),bucket=rowsByDate.get(bucketKey(date,sale.sold_at||sale.created_at));if(!bucket)continue;const totals=itemTotals.get(sale.id);if(totals){bucket.revenue+=totals.revenue;bucket.cost+=totals.cost;}else bucket.revenue+=Number(sale.total_minor)||0;}
  for(const expense of expenses||[]){const date=getDateKeyInBogota(expense.expense_date),bucket=rowsByDate.get(bucketKey(date,expense.expense_date,true));if(bucket)bucket.expenses+=Number(expense.amount_minor)||0;}
  for(const row of rowsByDate.values())row.result=row.revenue-row.cost-row.expenses;
  return [...rowsByDate.values()];
}


function SimpleBars({ title, description, data, formatValue, badge = "7 días", footnote = "Valores calculados a partir de movimientos registrados, no de estimaciones.", colors }) {
  const maxValue = Math.max(1,...(data||[]).map((item)=>Math.abs(Number(item.value)||0)));
  return <section className="simple-chart panel">
    <div className="simple-chart-heading"><div><h3>{title}</h3><p>{description}</p></div><span className="simple-chart-badge">{badge}</span></div>
    {data?.length ? <div className="simple-chart-bars" role="img" aria-label={title+" · "+(data||[]).slice(0,24).map((item)=>(item.label||item.key||"Dato")+": "+(formatValue?formatValue(item.value):Number(item.value||0).toLocaleString("es-CO"))).join(", ")} style={{gridTemplateColumns:"repeat("+Math.max(1,(data||[]).length)+",minmax(0,1fr))"}}>
      {data.map((item,index)=><div className="simple-chart-column" key={item.key||item.label||index}>
        <div className="simple-chart-value">{formatValue ? formatValue(item.value) : item.value}</div>
        <div className="simple-chart-track"><div className={"simple-chart-bar"+(Number(item.value)<0?" negative":"")} style={{height:Math.max(3,Math.abs(Number(item.value)||0)/maxValue*100)+"%",backgroundColor:colors?.length?colors[index%colors.length]:undefined}} /></div>
        <span className="simple-chart-label">{item.label}</span>
      </div>)}
    </div> : <p className="simple-chart-empty">Aún no hay datos suficientes para formar el gráfico.</p>}
    <div className="simple-chart-footnote">{footnote}</div>
  </section>;
}


function SimplePie({ title, description, data, formatValue, compact = false, colors: customColors }) {
  const entries = (data || []).map((item) => ({ ...item, value: Math.max(0, Number(item.value) || 0) })).filter((item) => item.value > 0);
  const total = entries.reduce((sum, item) => sum + item.value, 0);
  const colors = customColors?.length ? customColors : ["#64748B", "#0F766E", "#D97706", "#7C3AED", "#DB2777", "#0284C7"];
  let cumulative = 0;
  return <section className={"simple-chart panel simple-pie-chart" + (compact ? " simple-pie-chart-compact" : "")}>
    <div className="simple-chart-heading"><div><h3>{title}</h3><p>{description}</p></div><span className="simple-chart-badge">Distribución</span></div>
    {total > 0 ? <div className="simple-pie-layout">
      <div className="simple-pie-visual" role="img" aria-label={title+" · "+entries.map((item)=>item.label+": "+(formatValue?formatValue(item.value):item.value)).join(", ")}>
        <svg viewBox="0 0 120 120" role="presentation" focusable="false">
          <circle cx="60" cy="60" r="44" fill="none" stroke="var(--line,#E2E8F0)" strokeWidth="20" />
          {entries.map((item,index)=>{ const length=item.value/total*276.46; const offset=cumulative; cumulative+=length; return <circle key={item.key||item.label||index} cx="60" cy="60" r="44" fill="none" stroke={colors[index%colors.length]} strokeWidth="20" strokeDasharray={length+" "+(276.46-length)} strokeDashoffset={-offset} transform="rotate(-90 60 60)" />; })}
          <text x="60" y="56" textAnchor="middle" className="simple-pie-total-label">Total</text>
          <text x="60" y="69" textAnchor="middle" className="simple-pie-total-value">{entries.length}</text>
        </svg>
      </div>
      <div className="simple-pie-legend">{entries.map((item,index)=><div className="simple-pie-legend-row" key={item.key||item.label||index}><span className="simple-pie-swatch" style={{background:colors[index%colors.length]}}/><span className="simple-pie-legend-name">{item.label}</span><strong>{formatValue?formatValue(item.value):item.value}</strong><small>{Math.round(item.value/total*100)}%</small></div>)}</div>
    </div> : <p className="simple-chart-empty">Aún no hay importes positivos para formar el gráfico.</p>}
    <div className="simple-chart-footnote">Distribución calculada a partir de movimientos registrados.</div>
  </section>;
}


function shiftHomeDateKey(key, offset) {
  const date = new Date(key + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}

function getHomeChartRange(period) {
  const today = todayInBogota();
  const [year, month] = today.split("-").map(Number);
  let start = today;
  if (period === "week") {
    const date = new Date(today + "T12:00:00Z");
    start = shiftHomeDateKey(today, -((date.getUTCDay() + 6) % 7));
  } else if (period === "month") {
    start = today.slice(0, 7) + "-01";
  } else if (period === "quarter") {
    const firstMonth = Math.floor((month - 1) / 3) * 3 + 1;
    start = year + "-" + String(firstMonth).padStart(2, "0") + "-01";
  } else if (period === "semester") {
    start = year + (month <= 6 ? "-01-01" : "-07-01");
  } else if (period === "year") {
    start = year + "-01-01";
  }
  return { start, today, endExclusive: shiftHomeDateKey(today, 1) };
}

function summarizeHomePieMap(values, maxVisible = 4, otherLabel = "Otros") {
  const sorted = [...values.entries()]
    .map(([label, value]) => ({ label: String(label || "Otros").trim() || "Otros", value: Number(value) || 0 }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
  const visible = sorted.slice(0, maxVisible);
  if (sorted.length > maxVisible) {
    visible.push({ label: otherLabel, value: sorted.slice(maxVisible).reduce((sum, entry) => sum + entry.value, 0) });
  }
  return visible;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

const toPublicCatalogSlug = (value) => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");
const reservedPublicPaths = new Set(["api", "assets", "auth", "login", "signup", "forgot-password", "reset-password", "admin", "sw", "service-worker", "contacto", "ayuda", "soporte"]);

const areas = [
  { icon: "▦", title: "Productos", description: "Artículos, existencias, costos y precios.", screen: "products" },
  { icon: "↗", title: "Ventas", description: "Registra ventas, abonos y saldos.", screen: "sales" },
  { icon: "▧", title: "Cotizaciones", description: "Prepara y comparte propuestas comerciales.", screen: "quotes" },
  { icon: "▣", title: "Cuentas", description: "Revisa y gestiona el dinero pendiente de cobrar y pagar.", screen: "accounts" },
  { icon: "▥", title: "Bancos", description: "Cuentas bancarias, billeteras, saldos y movimientos.", screen: "banks" },
  { icon: "▥", title: "Estadísticas", description: "Ventas, cobros, gastos y balance del negocio.", screen: "stats" },
  { icon: "▧", title: "Cotizaciones", description: "Prepara propuestas comerciales y consulta su estado.", screen: "quotes" },
  { icon: "◎", title: "Clientes", description: "Personas y empresas relacionadas con tus ventas.", screen: "customers" },
  { icon: "◈", title: "Proveedores", description: "Personas y empresas que suministran productos, materiales o servicios.", screen: "suppliers" },
  { icon: "◷", title: "Rentabilidad", description: "Costos, margen y utilidad de tu negocio.", screen: "profitability" },
  { icon: "▤", title: "Compras", description: "Compras, proveedores y gastos.", screen: "purchases" },
  { icon: "◉", title: "Catálogo", description: "Un catálogo público para tus clientes.", screen: "catalog" },
  { icon: "%", title: "Cupones de descuento", description: "Crea promociones y controla sus usos.", screen: "coupons" },
  { icon: "₱", title: "Pagos verificados", description: "Conecta la cuenta de cobro de este negocio.", screen: "payments" },
  { icon: "⌘", title: "Equipo y permisos", description: "Accesos para empleados según su función.", screen: "team" },
  { icon: "◷", title: "Auditorías", description: "Consulta quién hizo cada cambio y cuándo.", screen: "audit" }
];

const inAppPageHelp = Object.freeze({
  home: { title: "Inicio", intro: "Aquí puedes revisar de un vistazo cómo marcha tu negocio y entrar rápidamente a cada módulo.", steps: ["Consulta las cifras y gráficos del periodo seleccionado.", "Usa las tarjetas para abrir productos, ventas, cotizaciones o finanzas.", "Registra cada operación en su módulo para mantener el balance actualizado."], tip: "Los indicadores dependen de los movimientos guardados; los valores pendientes de cobro no son dinero recibido." },
  products: { title: "Productos e inventario", intro: "Mantén el catálogo, los precios, los costos y las existencias de tus artículos en un solo lugar.", steps: ["Busca un producto o filtra la lista para encontrarlo.", "Crea o edita la ficha con su precio, costo, unidad y control de inventario.", "Registra los ajustes de existencias desde el historial para conservar la trazabilidad."], tip: "Comprueba las existencias antes de repetir una operación que pudo haberse guardado." },
  sales: { title: "Ventas", intro: "Registra las ventas y sus pagos para que el inventario y los saldos se mantengan coordinados.", steps: ["Selecciona la fecha, el cliente y los productos vendidos.", "Revisa cantidades, total y abono recibido antes de guardar.", "Abre el detalle de una venta para consultar sus movimientos o registrar un abono adicional."], tip: "Una venta guardada puede descontar existencias; revisa primero si un intento anterior quedó registrado." },
  quotes: { title: "Cotizaciones", intro: "Prepara una propuesta con productos, cantidades, precios y condiciones antes de convertirla en venta.", steps: ["Crea una cotización y completa los datos de contacto del cliente.", "Añade artículos, revisa el total y establece la fecha de validez.", "Guarda la propuesta; después puedes ajustar su estado, imprimirla o compartirla."], tip: "Una cotización no es una venta ni descuenta inventario hasta que se convierta mediante la acción correspondiente." },
  banks: { title: "Bancos", intro: "Administra las cuentas bancarias y billeteras del negocio y sigue el dinero que entra y sale.", steps: ["Registra cada cuenta y su saldo inicial.", "Asocia los pagos de ventas, compras y gastos a la cuenta correspondiente.", "Consulta ingresos, egresos y transferencias sin duplicar los resultados financieros."], tip: "El efectivo se controla desde Caja. Las transferencias entre tus propias cuentas no son ingresos ni gastos." },
  accounts: { title: "Cuentas", intro: "Controla el dinero que falta por cobrar a tus clientes y los saldos pendientes con proveedores.", steps: ["Elige la pestaña de cuentas por cobrar o por pagar.", "Abre el registro correspondiente y comprueba el saldo pendiente.", "Registra los pagos o abonos con su fecha y medio de pago."], tip: "Registra solo el dinero que efectivamente recibiste o pagaste." },
  stats: { title: "Estadísticas y balance", intro: "Consulta los movimientos registrados en tu negocio y compara los resultados por periodo.", steps: ["Selecciona el periodo de consulta.", "Revisa ventas, cobros, compras y gastos disponibles.", "Descarga el informe cuando necesites conservar o compartir un resumen."], tip: "Las cotizaciones y los saldos por cobrar no se cuentan como ingresos recibidos." },
  customers: { title: "Clientes", intro: "Guarda la información de contacto para relacionar las personas y empresas con tus ventas.", steps: ["Busca un cliente por nombre o datos de contacto.", "Crea o edita su ficha con los datos necesarios.", "Selecciona el cliente al registrar una venta o una cotización."], tip: "Evita duplicar fichas; busca primero por nombre, correo o documento." },
  suppliers: { title: "Proveedores", intro: "Organiza las personas y empresas que te suministran productos, materiales o servicios.", steps: ["Busca el proveedor antes de crear un nuevo registro.", "Guarda sus datos de contacto y la información comercial disponible.", "Selecciónalo al registrar compras o consultar movimientos relacionados."], tip: "Mantener el mismo proveedor asociado facilita revisar costos y pagos pendientes." },
  profitability: { title: "Rentabilidad", intro: "Compara ventas con costos y gastos registrados para entender mejor el resultado del negocio.", steps: ["Elige el periodo que deseas analizar.", "Revisa ingresos, costo de los productos y gastos incluidos.", "Compara los márgenes y verifica los costos que aún estén pendientes de completar."], tip: "La rentabilidad mejora cuando los costos y el tiempo de trabajo están registrados de forma realista." },
  purchases: { title: "Compras y gastos", intro: "Registra las compras que entran al inventario y los gastos de funcionamiento del negocio.", steps: ["Selecciona si vas a registrar una compra o un gasto.", "Completa fecha, proveedor o categoría, detalle e importe.", "Revisa el resumen antes de guardar y comprueba que no exista un registro previo."], tip: "Las compras de inventario y los gastos generales tienen efectos distintos en los costos del negocio." },
  catalog: { title: "Catálogo para compartir", intro: "Prepara una vitrina digital con los productos que quieres mostrar a tus clientes.", steps: ["Elige qué productos activos se publican y revisa sus imágenes, precios y disponibilidad.", "Verifica los datos comerciales y el canal de contacto en Configuración.", "Abre el enlace público para comprobar cómo se ve antes de compartirlo."], tip: "Publica únicamente información actualizada y no marques como disponible un artículo sin existencias reales." },
  coupons: { title: "Cupones de descuento", intro: "Crea promociones con reglas claras y revisa sus condiciones antes de compartirlas.", steps: ["Crea un cupón con un código fácil de reconocer.", "Define el descuento, la vigencia y los límites de uso disponibles.", "Guarda y verifica el estado del cupón antes de anunciarlo."], tip: "Comprueba las condiciones del descuento para evitar ofrecer un precio inferior al que querías." },
  payments: { title: "Pagos verificados", intro: "Consulta la configuración de la cuenta de cobro vinculada a este negocio.", steps: ["Revisa si la integración aparece configurada y habilitada.", "Comprueba las credenciales y el entorno desde la configuración correspondiente.", "Realiza una prueba controlada antes de recibir pagos reales."], tip: "Nunca compartas claves privadas ni secretos de integración con clientes o en mensajes de soporte." },
  team: { title: "Equipo y permisos", intro: "Invita a las personas que colaboran en el negocio y limita su acceso según sus tareas.", steps: ["Añade el correo de la cuenta que utilizará cada persona.", "Selecciona un perfil inicial y revisa los permisos de cada módulo.", "Guarda los cambios y confirma que cada persona solo pueda ver y administrar lo necesario."], tip: "Asigna únicamente los permisos indispensables para cada función." },
  audit: { title: "Auditorías", intro: "Consulta los cambios y operaciones registrados para dar seguimiento a la actividad del negocio.", steps: ["Filtra o revisa los eventos disponibles.", "Comprueba la fecha, el usuario y el registro involucrado.", "Abre el detalle cuando necesites ampliar la información de un movimiento."], tip: "Un registro de auditoría sirve para revisar lo ocurrido; no lo sustituye ni lo modifica." },
  settings: { title: "Configuración", intro: "Personaliza los datos del negocio, la apariencia, las preferencias y las opciones disponibles.", steps: ["Revisa los datos comerciales y la moneda del negocio.", "Ajusta el logo, los colores y las preferencias de visualización.", "Guarda los cambios y comprueba que se reflejen correctamente."], tip: "La configuración pertenece al negocio seleccionado; verifica el nombre antes de guardar." },
  platform_admin: { title: "Administración de plataforma", intro: "Esta sección está reservada para tareas de administración general de la plataforma.", steps: ["Revisa con cuidado la información de plataforma disponible.", "Realiza cambios solo cuando conozcas su alcance.", "Verifica el resultado antes de salir de la sección."], tip: "Los cambios administrativos pueden afectar a más de un negocio." }
});

const sidebarAreaItem = (screen, label = null) => {
  const area = areas.find((candidate) => candidate.screen === screen);
  return area ? { id: area.screen, screen: area.screen, label: label || area.title, icon: area.icon } : null;
};
const defaultSidebarLayout = () => [
  { id: "inicio", type: "group", title: "", items: [{ id: "home", screen: "home", label: "Inicio", icon: "⌂" }] },
  { id: "comercial", type: "group", title: "COMERCIAL", items: ["products", "sales", "quotes", "customers", "suppliers", "catalog"].map(sidebarAreaItem).filter(Boolean) },
  { id: "finanzas", type: "group", title: "FINANZAS", items: ["stats", "profitability", "accounts", "purchases", "banks", "coupons", "payments"].map(sidebarAreaItem).filter(Boolean) },
  { id: "personal", type: "group", title: "PERSONAL", items: [sidebarAreaItem("team", "Trabajadores")].filter(Boolean) },
  { id: "administracion", type: "group", title: "ADMINISTRACIÓN", items: [{ id: "settings", screen: "settings", label: "Configuración", icon: "⚙" }] }
];
const normalizeSidebarLayout = (layout) => {
  const fallback = defaultSidebarLayout();
  const orderedItems = fallback.flatMap((group) => group.items);
  const known = new Map(orderedItems.map((item) => [item.id, item]));
  const normalizeItem = (item) => ({
    ...known.get(item.id),
    label: item.id === "accounts" || item.screen === "accounts" ? "Cuentas" : ({ home: "Inicio", products: "Productos", banks: "Bancos", profitability: "Rentabilidad", catalog: "Catálogo", purchases: "Compras", coupons: "Cupones", suppliers: "Proveedores", payments: "Pagos", team: "Trabajadores", stats: "Estadísticas", platform_admin: "Administración de plataforma" })[item.id] || String(item.label || known.get(item.id).label).slice(0, 60),
    icon: String(item.icon || known.get(item.id).icon).slice(0, 4)
  });
  if (!Array.isArray(layout) || !layout.length) return fallback;
  const groups = layout.filter((group) => group && group.type === "group" && typeof group.id === "string")
    .map((group) => ({
      id: group.id,
      type: "group",
      title: group.id === "inicio" || (Array.isArray(group.items) && group.items.some((item) => item?.id === "home")) ? "" : ({ comercial: "COMERCIAL", finanzas: "FINANZAS", personal: "PERSONAL", administracion: "ADMINISTRACIÓN" })[group.id] || String(group.title || "Sección").slice(0, 60),
      items: Array.isArray(group.items) ? group.items.filter((item) => item && known.has(item.id)).map(normalizeItem) : []
    }));
  if (!groups.length) return fallback;

  // Convert the original one-section menu to the current categories, preserving labels/icons edited by the owner.
  if (groups.length === 1 && (groups[0].id === "business" || groups[0].title.toUpperCase() === "TU NEGOCIO")) {
    const savedItems = new Map(groups[0].items.map((item) => [item.id, item]));
    return fallback.map((group) => ({
      ...group,
      items: group.items.map((item) => savedItems.get(item.id) ? normalizeItem(savedItems.get(item.id)) : item)
    })).filter((group) => group.items.length > 0);
  }

  // Reconcile prior layouts with the agreed categories without discarding item labels/icons.
  const requiredDestinations = {
    products: "comercial",
    banks: "finanzas",
    accounts: "finanzas",
    purchases: "finanzas",
    coupons: "finanzas",
    customers: "comercial",
    suppliers: "comercial",
    quotes: "comercial",
    team: "personal"
  };
  const movedItems = new Map();
  for (const group of groups) {
    group.items = group.items.filter((item) => {
      const destination = requiredDestinations[item.id];
      if (!destination || group.id === destination) return true;
      if (!movedItems.has(item.id)) movedItems.set(item.id, item);
      return false;
    });
  }
  for (const [itemId, destinationId] of Object.entries(requiredDestinations)) {
    const targetTemplate = fallback.find((group) => group.id === destinationId);
    let target = groups.find((group) => group.id === destinationId);
    if (!target && targetTemplate) {
      target = { ...targetTemplate, items: [] };
      groups.push(target);
    }
    if (!target) continue;
    const existing = target.items.find((item) => item.id === itemId);
    const item = movedItems.get(itemId);
    if (item && !existing) target.items.push(item);
  }

  // Re-home entries from numeric legacy groups (e.g. "4") into the canonical sections.
  // This prevents stale numeric headings and restores Coupons/Suppliers to their agreed destinations.
  for (let index = groups.length - 1; index >= 0; index -= 1) {
    const group = groups[index];
    const numericHeading = /^[0-9]+$/.test(String(group.title || "").trim());
    if (numericHeading) {
      for (const item of group.items) {
        const template = fallback.find((candidate) => candidate.items.some((candidateItem) => candidateItem.id === item.id));
        if (!template) continue;
        let target = groups.find((candidate) => candidate.id === template.id);
        if (!target) {
          target = { ...template, items: [] };
          groups.push(target);
        }
        if (target.id !== group.id && !target.items.some((candidate) => candidate.id === item.id)) target.items.push(item);
      }
      groups.splice(index, 1);
      continue;
    }
    if (!group.items.length && (group.id === "coupons" || group.id === "suppliers")) {
      groups.splice(index, 1);
    }
  }

  const placed = new Set(groups.flatMap((group) => group.items.map((item) => item.id)));
  const missing = orderedItems.filter((item) => !placed.has(item.id));
  for (const item of missing) {
    const defaultGroup = fallback.find((group) => group.items.some((candidate) => candidate.id === item.id));
    const target = groups.find((group) => group.id === defaultGroup?.id) || groups[0];
    target.items.push(item);
    placed.add(item.id);
  }
  // Keep the requested default sequence even for existing saved layouts.
  // Items retain their saved labels/icons; only these default positions are normalized.
  const repositionItem = (groupId, itemId, anchorId, position) => {
    const group = groups.find((candidate) => candidate.id === groupId);
    if (!group) return;
    const itemIndex = group.items.findIndex((item) => item.id === itemId);
    if (itemIndex < 0) return;
    const [item] = group.items.splice(itemIndex, 1);
    const anchorIndex = group.items.findIndex((entry) => entry.id === anchorId);
    if (anchorIndex < 0) {
      group.items.push(item);
      return;
    }
    group.items.splice(anchorIndex + (position === "after" ? 1 : 0), 0, item);
  };
  repositionItem("comercial", "quotes", "sales", "after");
  repositionItem("comercial", "customers", "quotes", "after");
  repositionItem("comercial", "suppliers", "customers", "after");
  repositionItem("finanzas", "banks", "coupons", "before");

  return groups;
};

const currencyDigits = (code = "COP") => {
  try { return new Intl.NumberFormat("es-CO", { style: "currency", currency: code }).resolvedOptions().maximumFractionDigits; }
  catch { return 0; }
};
const money = (minorUnits, code = "COP") => {
  const digits = currencyDigits(code);
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: code, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(minorUnits || 0) / (10 ** digits));
};
const toMinorUnits = (amount, code = "COP") => Math.round(Number(amount || 0) * (10 ** currencyDigits(code)));
const currencyOptions = [
  ["AED", "Dírham de Emiratos Árabes Unidos"],
  ["AFN", "AFN"],
  ["ALL", "ALL"],
  ["AMD", "AMD"],
  ["ANG", "ANG"],
  ["AOA", "AOA"],
  ["ARS", "Peso argentino"],
  ["AUD", "Dólar australiano"],
  ["AWG", "AWG"],
  ["AZN", "AZN"],
  ["BAM", "BAM"],
  ["BBD", "BBD"],
  ["BDT", "Taka bangladesí"],
  ["BGN", "BGN"],
  ["BHD", "Dinar bareiní"],
  ["BIF", "BIF"],
  ["BMD", "BMD"],
  ["BND", "BND"],
  ["BOB", "Boliviano"],
  ["BRL", "Real brasileño"],
  ["BSD", "BSD"],
  ["BTN", "BTN"],
  ["BWP", "BWP"],
  ["BYN", "BYN"],
  ["BZD", "BZD"],
  ["CAD", "Dólar canadiense"],
  ["CDF", "CDF"],
  ["CHF", "Franco suizo"],
  ["CLP", "Peso chileno"],
  ["CNY", "Yuan chino"],
  ["COP", "Peso colombiano"],
  ["CRC", "Colón costarricense"],
  ["CUP", "CUP"],
  ["CVE", "CVE"],
  ["CZK", "Corona checa"],
  ["DJF", "DJF"],
  ["DKK", "Corona danesa"],
  ["DOP", "Peso dominicano"],
  ["DZD", "DZD"],
  ["EGP", "Libra egipcia"],
  ["ERN", "ERN"],
  ["ETB", "ETB"],
  ["EUR", "Euro"],
  ["FJD", "FJD"],
  ["FKP", "FKP"],
  ["GBP", "Libra esterlina"],
  ["GEL", "GEL"],
  ["GHS", "GHS"],
  ["GIP", "GIP"],
  ["GMD", "GMD"],
  ["GNF", "GNF"],
  ["GTQ", "Quetzal guatemalteco"],
  ["GYD", "GYD"],
  ["HKD", "Dólar de Hong Kong"],
  ["HNL", "HNL"],
  ["HTG", "HTG"],
  ["HUF", "Forinto húngaro"],
  ["IDR", "Rupia indonesia"],
  ["ILS", "Nuevo séquel israelí"],
  ["INR", "Rupia india"],
  ["IQD", "Dinar iraquí"],
  ["IRR", "IRR"],
  ["ISK", "Corona islandesa"],
  ["JMD", "Dólar jamaiquino"],
  ["JOD", "Dinar jordano"],
  ["JPY", "Yen japonés"],
  ["KES", "Chelín keniano"],
  ["KGS", "KGS"],
  ["KHR", "KHR"],
  ["KMF", "KMF"],
  ["KPW", "KPW"],
  ["KRW", "Won surcoreano"],
  ["KWD", "Dinar kuwaití"],
  ["KYD", "KYD"],
  ["KZT", "KZT"],
  ["LAK", "LAK"],
  ["LBP", "LBP"],
  ["LKR", "LKR"],
  ["LRD", "LRD"],
  ["LSL", "LSL"],
  ["LYD", "LYD"],
  ["MAD", "MAD"],
  ["MDL", "MDL"],
  ["MGA", "MGA"],
  ["MKD", "MKD"],
  ["MMK", "MMK"],
  ["MNT", "MNT"],
  ["MOP", "MOP"],
  ["MRU", "MRU"],
  ["MUR", "MUR"],
  ["MVR", "MVR"],
  ["MWK", "MWK"],
  ["MXN", "Peso mexicano"],
  ["MYR", "Ringgit malasio"],
  ["MZN", "MZN"],
  ["NAD", "NAD"],
  ["NGN", "Naira nigeriana"],
  ["NIO", "NIO"],
  ["NOK", "Corona noruega"],
  ["NPR", "NPR"],
  ["NZD", "Dólar neozelandés"],
  ["OMR", "Rial omaní"],
  ["PAB", "PAB"],
  ["PEN", "Sol peruano"],
  ["PGK", "PGK"],
  ["PHP", "Peso filipino"],
  ["PKR", "Rupia pakistaní"],
  ["PLN", "Zloty polaco"],
  ["PYG", "Guaraní paraguayo"],
  ["QAR", "Riyal catarí"],
  ["RON", "RON"],
  ["RSD", "RSD"],
  ["RUB", "RUB"],
  ["RWF", "RWF"],
  ["SAR", "Riyal saudí"],
  ["SBD", "SBD"],
  ["SCR", "SCR"],
  ["SDG", "SDG"],
  ["SEK", "Corona sueca"],
  ["SGD", "Dólar de Singapur"],
  ["SHP", "SHP"],
  ["SLE", "SLE"],
  ["SLL", "SLL"],
  ["SOS", "SOS"],
  ["SRD", "SRD"],
  ["SSP", "SSP"],
  ["STN", "STN"],
  ["SVC", "SVC"],
  ["SYP", "SYP"],
  ["SZL", "SZL"],
  ["THB", "Baht tailandés"],
  ["TJS", "TJS"],
  ["TMT", "TMT"],
  ["TND", "TND"],
  ["TOP", "TOP"],
  ["TRY", "Lira turca"],
  ["TTD", "Dólar de Trinidad y Tobago"],
  ["TWD", "TWD"],
  ["TZS", "TZS"],
  ["UAH", "Grivna ucraniana"],
  ["UGX", "UGX"],
  ["USD", "Dólar estadounidense"],
  ["UYU", "Peso uruguayo"],
  ["UZS", "UZS"],
  ["VES", "VES"],
  ["VND", "Dong vietnamita"],
  ["VUV", "VUV"],
  ["WST", "WST"],
  ["XAF", "Franco CFA de África Central"],
  ["XCD", "Dólar del Caribe Oriental"],
  ["XOF", "Franco CFA de África Occidental"],
  ["XPF", "Franco CFP"],
  ["YER", "YER"],
  ["ZAR", "Rand sudafricano"],
  ["ZMW", "ZMW"],
  ["ZWG", "ZWG"]
];
async function businessHasFinancialData(businessId) {
  const results = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("sales").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("purchases").select("id", { count: "exact", head: true }).eq("business_id", businessId),
    supabase.from("expenses").select("id", { count: "exact", head: true }).eq("business_id", businessId)
  ]);
  const failed = results.find((result) => result.error);
  if (failed) throw failed.error;
  return results.some((result) => Number(result.count || 0) > 0);
}
const friendlyError = (error) => {
  const message = error?.message || "Ocurrió un error. Inténtalo de nuevo.";
  if (/invalid login credentials/i.test(message)) return "El correo o la contraseña no coinciden.";
  if (/email not confirmed/i.test(message)) return "Confirma tu correo antes de iniciar sesión.";
  if (/user already registered/i.test(message)) return "Ese correo ya tiene una cuenta. Inicia sesión.";
  if (/password should be at least/i.test(message)) return "Usa una contraseña de al menos 6 caracteres.";
  if (/foreign key constraint|violates foreign key/i.test(message)) return "No puedes eliminar esta categoría porque todavía tiene productos. Cambia esos productos a otra categoría y vuelve a intentarlo.";
  if (/no puedes cambiar la moneda|convertir los importes/i.test(message)) return message;
  if (/duplicate key|already exists/i.test(message)) return "Ya existe un registro con ese nombre o código.";
  if (/failed to fetch|network/i.test(message)) return "No pudimos conectar con el servicio. Revisa tu conexión e inténtalo otra vez.";
  return message;
};

const unitOptions = [
  ["unidad", "Unidad"], ["pieza", "Pieza"], ["par", "Par"], ["docena", "Docena"],
  ["hoja", "Hoja"], ["lámina", "Lámina"], ["rollo", "Rollo"], ["caja", "Caja"], ["paquete", "Paquete"],
  ["kit", "Kit"], ["set", "Set o juego"], ["gramo", "Gramo (g)"], ["kilogramo", "Kilogramo (kg)"],
  ["mililitro", "Mililitro (ml)"], ["litro", "Litro (l)"], ["centímetro", "Centímetro (cm)"],
  ["metro", "Metro (m)"], ["metro cuadrado", "Metro cuadrado (m²)"], ["hora", "Hora"],
  ["sesión", "Sesión"], ["servicio", "Servicio"], ["personalizada", "Otra unidad…"]
];
const blankProduct = { name: "", sku: "", category_id: "", description: "", commercial_presentation: "", product_type: "physical", unit_name: "unidad", unit_custom: "", sale_price: "", cost_price: "", tax_code: "none", stock: "0", low_stock: "", is_published: true, is_bundle: false, bundle_components: [{ product_id: "", quantity: "1" }, { product_id: "", quantity: "1" }], bundle_discount: "0" };
const blankVariantDraft = { variant_name: "", variant_value: "", variant_name_2: "", variant_value_2: "", sku: "", sale_price: "", stock_on_hand: "", image_paths: [], staged_images: [] };
const blankNewProductVariant = { variant_name: "", variant_value: "", variant_name_2: "", variant_value_2: "", sku: "", sale_price: "", stock_on_hand: "" };
const makeInternalProductSku = () => "PRD-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
const makeInternalVariantSku = (productSku) => String(productSku || "PRD").toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 48) + "-V-" + crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
const variantDisplayLabel = (variant) => {
  const names = String(variant?.variant_name || "").split(" + ");
  const values = String(variant?.variant_value || "").split(" / ");
  if (names.length > 1 && names.length === values.length) return names.map((name, index) => name + ": " + values[index]).join(" · ");
  return [variant?.variant_name, variant?.variant_value].filter(Boolean).join(": ");
};
const parseVariantCombination = (variant) => {
  const names = String(variant?.variant_name || "").split(" + ");
  const values = String(variant?.variant_value || "").split(" / ");
  return { variant_name: names[0] || "", variant_value: values[0] || "", variant_name_2: names.length > 1 ? names.slice(1).join(" + ") : "", variant_value_2: values.length > 1 ? values.slice(1).join(" / ") : "" };
};
const summarizeProductVariantStock = (product, variants = []) => {
  const activeVariants = (variants || []).filter((variant) => variant?.is_active !== false);
  const usesVariantStock = product?.product_type === "physical" && (
    product?.metadata?.has_variants === true ||
    product?.metadata?.has_variants === "true" ||
    activeVariants.length > 0
  );
  if (!usesVariantStock) {
    return { usesVariantStock: false, known: Boolean(product?.track_inventory), units: Math.max(0, Number(product?.stock_on_hand || 0)), activeVariants, empty: false };
  }
  const known = activeVariants.length > 0 && activeVariants.every((variant) => variant.stock_on_hand != null);
  const units = activeVariants.reduce((sum, variant) => sum + (variant.stock_on_hand == null ? 0 : Math.max(0, Number(variant.stock_on_hand || 0))), 0);
  return { usesVariantStock: true, known, units, activeVariants, empty: activeVariants.length === 0 };
};
const todayInBogota = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const blankSupplier = { name: "", email: "", phone: "", tax_id: "", address: "", notes: "" };
const blankExpense = { category: "Operativo", description: "", amount: "", expense_date: todayInBogota(), payment_method: "Transferencia", supplier_id: "", bank_account_id: "", notes: "" };
const teamPermissionGroups = [
  { label: "Productos", view: "products_view", manage: "products_manage" },
  { label: "Ventas", view: "sales_view", manage: "sales_manage" },
  { label: "Clientes", view: "customers_view", manage: "customers_manage" },
  { label: "Compras", view: "purchases_view", manage: "purchases_manage" },
  { label: "Gastos", view: "expenses_view", manage: "expenses_manage" }
];
const blankTeamPermissions = {
  products_view: false, products_manage: false, sales_view: false, sales_manage: false,
  customers_view: false, customers_manage: false, purchases_view: false, purchases_manage: false,
  suppliers_view: false, suppliers_manage: false, expenses_view: false, expenses_manage: false
};
const employeePermissionProfiles = {
  vendedor: {
    label: "Vendedor",
    description: "Ventas, consulta de productos y gestión de clientes; sin inventario, compras, gastos ni administración.",
    permissions: { products_view: true, sales_view: true, sales_manage: true, customers_view: true, customers_manage: true }
  },
  atencion: {
    label: "Atención al cliente",
    description: "Consulta productos y administra clientes, sin registrar ventas ni acceder a finanzas.",
    permissions: { products_view: true, customers_view: true, customers_manage: true }
  },
  inventario: {
    label: "Inventario",
    description: "Consulta y administra productos y existencias, sin acceso a ventas, compras ni finanzas.",
    permissions: { products_view: true, products_manage: true }
  },
  compras: {
    label: "Compras y proveedores",
    description: "Gestiona compras y proveedores; requiere administrar productos para registrar entradas de inventario.",
    permissions: { products_view: true, products_manage: true, purchases_view: true, purchases_manage: true, suppliers_view: true, suppliers_manage: true }
  },
  personalizado: {
    label: "Personalizado",
    description: "Elige cada permiso manualmente.",
    permissions: {}
  }
};
const blankCustomer = { first_name: "", last_name: "", company_name: "", advisor_name: "", document_type: "", document_number: "", email: "", phone: "", whatsapp: "", city: "", address: "", notes: "" };

const defaultBusinessTheme = Object.freeze({ primary: "#475569", background: "#F6F7F9", surface: "#FFFFFF", text: "#1F2937", sidebarBackground: "#FFFFFF", sidebarText: "#1F2937", buttonHover: "#334155", buttonHoverText: "#FFFFFF" });
const treseiscincoTheme = Object.freeze({ primary: "#159F92", background: "#F5F7FC", surface: "#FFFFFF", text: "#19243A", sidebarBackground: "#FFFFFF", sidebarText: "#19243A", buttonHover: "#0D7E75", buttonHoverText: "#FFFFFF" });

function hexRgb(value) {
  const match = String(value || "").trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = hex.split("").map((x) => x + x).join("");
  const n = parseInt(hex, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function luminance(rgb) {
  const channel = (v) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}
function contrastRatio(a, b) {
  const ca = hexRgb(a), cb = hexRgb(b);
  if (!ca || !cb) return 0;
  const la = luminance(ca), lb = luminance(cb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function readableText(background, preferred) {
  if (!hexRgb(background)) return preferred || "#19243A";
  if (preferred && contrastRatio(background, preferred) >= 4.5) return preferred;
  const black = "#111827", white = "#FFFFFF";
  return contrastRatio(background, black) >= contrastRatio(background, white) ? black : white;
}
function readableAccent(accent, background) {
  if (!hexRgb(accent) || !hexRgb(background)) return accent || defaultBusinessTheme.primary;
  return contrastRatio(accent, background) >= 4.5 ? accent : readableText(background, accent);
}
function shadeHex(value, amount = 0.12) {
  const rgb = hexRgb(value);
  if (!rgb) return "#334155";
  return "#" + rgb.map((channel) => Math.max(0, Math.min(255, Math.round(channel * (1 - amount)))).toString(16).padStart(2, "0")).join("");
}
function mixHex(foreground, background, foregroundWeight = 0.12) {
  const front = hexRgb(foreground), back = hexRgb(background);
  if (!front || !back) return background || "#FFFFFF";
  const weight = Math.max(0, Math.min(1, Number(foregroundWeight) || 0));
  return "#" + front.map((channel, index) => Math.round(channel * weight + back[index] * (1 - weight)).toString(16).padStart(2, "0")).join("");
}

const compareInventoryProducts = (a, b, sort) => {
  const nameCompare = String(a.name || "").localeCompare(String(b.name || ""), "es", { numeric: true, sensitivity: "base" });
  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  let result = 0;
  const desc = sort.endsWith("_desc");
  if (sort === "name" || sort === "name_desc") result = nameCompare;
  else if (sort === "code" || sort === "code_desc") result = String(a.sku || "").localeCompare(String(b.sku || ""), "es", { numeric: true, sensitivity: "base" });
  else if (sort === "price" || sort === "price_desc") result = number(a.sale_price_minor) - number(b.sale_price_minor);
  else if (sort === "cost" || sort === "cost_desc") result = number(a.cost_price_minor) - number(b.cost_price_minor);
  else if (sort === "stock" || sort === "stock_desc") result = number(a.stock_on_hand) - number(b.stock_on_hand);
  else if (sort === "profit" || sort === "profit_asc") result = (number(a.sale_price_minor) - number(a.cost_price_minor)) - (number(b.sale_price_minor) - number(b.cost_price_minor));
  else if (sort === "margin" || sort === "margin_asc") {
    const marginA = number(a.sale_price_minor) > 0 ? ((number(a.sale_price_minor) - number(a.cost_price_minor)) / number(a.sale_price_minor)) : -Infinity;
    const marginB = number(b.sale_price_minor) > 0 ? ((number(b.sale_price_minor) - number(b.cost_price_minor)) / number(b.sale_price_minor)) : -Infinity;
    result = marginA - marginB;
  } else result = nameCompare;
  if (sort === "profit" || sort === "margin" || sort === "price_desc" || sort === "cost_desc" || sort === "stock_desc" || sort === "name_desc" || sort === "code_desc") result *= -1;
  return result || nameCompare;
};

const normalizeBusinessTheme = (theme) => {
  const valid = (value, fallback) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
  // Cambia solo los temas predeterminados de versiones anteriores; los colores elegidos por cada negocio se respetan.
  const legacyDefault = { primary: "#2d5947", background: "#f7f6f1", surface: "#fffefa", text: "#20251f", sidebarBackground: "#fffefa", sidebarText: "#20251f", buttonHover: "#234635", buttonHoverText: "#ffffff" };
  const previousBrandDefault = { primary: "#174580", background: "#F5F7FC", surface: "#FFFFFF", text: "#19243A", sidebarBackground: "#FFFFFF", sidebarText: "#19243A", buttonHover: "#102F60", buttonHoverText: "#FFFFFF" };
  const previousTealDefault = { primary: "#159F92", background: "#F5F7FC", surface: "#FFFFFF", text: "#19243A", sidebarBackground: "#FFFFFF", sidebarText: "#19243A", buttonHover: "#0D7E75", buttonHoverText: "#FFFFFF" };
  const matchesDefault = (candidate) => Boolean(theme) && Object.entries(candidate).every(([key, value]) => !theme[key] || String(theme[key]).toLowerCase() === value.toLowerCase());
  const source = matchesDefault(legacyDefault) || matchesDefault(previousBrandDefault) || matchesDefault(previousTealDefault) ? null : theme;
  return { primary: valid(source?.primary, defaultBusinessTheme.primary), background: valid(source?.background, defaultBusinessTheme.background), surface: valid(source?.surface, defaultBusinessTheme.surface), text: valid(source?.text, defaultBusinessTheme.text), sidebarBackground: valid(source?.sidebarBackground, defaultBusinessTheme.sidebarBackground), sidebarText: valid(source?.sidebarText, defaultBusinessTheme.sidebarText), buttonHover: valid(source?.buttonHover, defaultBusinessTheme.buttonHover), buttonHoverText: valid(source?.buttonHoverText, defaultBusinessTheme.buttonHoverText) };
};
const DEFAULT_TAX_PROFILE = Object.freeze({
  vatStatus: "unsure",
  defaultRate: 19,
  defaultRateMode: "standard",
  customRate: 19,
  pricesIncludeVat: false,
  showVatBreakdown: false
});
const normalizeTaxProfile = (profile) => {
  const allowed = new Set(["responsible", "not_responsible", "not_applicable", "unsure"]);
  const numberOr = (value, fallback) => {
    if (String(value ?? "").trim() === "") return fallback;
    const number = Number(String(value ?? "").replace(",", "."));
    return Number.isFinite(number) && number >= 0 && number <= 100 ? number : fallback;
  };
  return {
    vatStatus: allowed.has(profile?.vatStatus) ? profile.vatStatus : "unsure",
    defaultRate: numberOr(profile?.defaultRate, 19),
    defaultRateMode: profile?.defaultRateMode === "custom" ? "custom" : "standard",
    customRate: numberOr(profile?.customRate, 19),
    pricesIncludeVat: Boolean(profile?.pricesIncludeVat),
    showVatBreakdown: Boolean(profile?.showVatBreakdown)
  };
};
const PRODUCT_TAX_RATES = Object.freeze({ iva_19: 19, iva_5: 5, impoconsumo_8: 8, iva_exento: 0, iva_excluido: 0, none: 0 });
const productTaxAmounts = (unitPriceMinor, quantity, taxCode, pricesIncludeVat) => {
  const grossOrBase = Math.round(Number(unitPriceMinor || 0) * Number(quantity || 0));
  const rate = Number(PRODUCT_TAX_RATES[taxCode] ?? 0);
  const tax = rate > 0 ? Math.round(pricesIncludeVat ? grossOrBase * rate / (100 + rate) : grossOrBase * rate / 100) : 0;
  const subtotal = pricesIncludeVat ? grossOrBase - tax : grossOrBase;
  return { subtotal, tax, total: pricesIncludeVat ? grossOrBase : grossOrBase + tax, rate };
};

const getBusinessLogoUrl = (path) => {
  if (!path) return "";
  try { return supabase.storage.from("business-logos").getPublicUrl(path)?.data?.publicUrl || ""; } catch { return ""; }
};
function FieldHelp({ text, enabled = true }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 12, left: 12, width: 270 });

  const updatePosition = (target = triggerRef.current) => {
    if (typeof window === "undefined" || !target?.getBoundingClientRect) return;
    const rect = target.getBoundingClientRect();
    const width = Math.min(270, Math.max(220, window.innerWidth - 24));
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const estimatedHeight = 150;
    let top = rect.bottom + 8;
    if (top + estimatedHeight > window.innerHeight - 12 && rect.top > estimatedHeight + 12) {
      top = rect.top - estimatedHeight - 8;
    }
    top = Math.max(12, Math.min(top, window.innerHeight - Math.min(estimatedHeight, window.innerHeight - 24) - 12));
    setPosition({ top, left, width });
  };

  useEffect(() => {
    const onOtherHelpOpen = (event) => {
      if (event.detail?.source !== rootRef.current) setOpen(false);
    };
    document.addEventListener("treseiscinco:field-help-open", onOtherHelpOpen);
    return () => document.removeEventListener("treseiscinco:field-help-open", onOtherHelpOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const reposition = () => updatePosition();
    const onOutsidePointer = (event) => {
      if (rootRef.current?.contains(event.target) || popoverRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onOutsidePointer, true);
    document.addEventListener("keydown", onEscape);
    document.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointer, true);
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  if (!enabled || !text) return null;
  const toggleHelp = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (open) {
      setOpen(false);
      return;
    }
    updatePosition(event.currentTarget);
    document.dispatchEvent(new CustomEvent("treseiscinco:field-help-open", { detail: { source: rootRef.current } }));
    setOpen(true);
  };

  return (
    <>
      <span className="field-help-wrap" ref={rootRef}>
        <button ref={triggerRef} type="button" className="field-help-trigger" title="¿Para qué sirve?" aria-label="¿Para qué sirve?" aria-expanded={open} onClick={toggleHelp}>?</button>
      </span>
      {open && typeof document !== "undefined" && createPortal(
        <span
          className="field-help-popover field-help-popover-portal"
          ref={popoverRef}
          role="tooltip"
          style={{ position: "fixed", top: position.top, left: position.left, width: position.width, maxHeight: "min(240px, calc(100vh - 24px))", overflowY: "auto", zIndex: 2147483645 }}
        >
          <strong>¿Para qué sirve?</strong>
          <span>{text}</span>
          <button type="button" className="field-help-close" aria-label="Cerrar esta ayuda" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen(false); }}>×</button>
        </span>,
        document.body
      )}
    </>
  );
}

const MAX_PRODUCT_IMAGE_BYTES = 1_500_000;

async function prepareProductImage(file) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("Elige una imagen JPG, PNG o WebP.");
  if (file.size > 5_000_000) throw new Error("Cada foto original debe pesar máximo 5 MB antes de optimizarla.");
  let bitmap;
  try { bitmap = await createImageBitmap(file); }
  catch { throw new Error("No pudimos abrir esa imagen. Prueba con otro archivo JPG, PNG o WebP."); }
  try {
    const originalLongest = Math.max(bitmap.width, bitmap.height);
    for (const dimension of [1200, 1000, 850, 700, 550]) {
      const scale = Math.min(1, dimension / originalLongest);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) throw new Error("Este navegador no permite preparar la foto.");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const toBlob = (quality) => new Promise((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42, 0.34]) {
        const blob = await toBlob(quality);
        if (!blob || blob.type !== "image/webp") throw new Error("Este navegador no pudo convertir la imagen a WebP.");
        if (blob.size <= MAX_PRODUCT_IMAGE_BYTES) {
          const baseName = (file.name || "foto").replace(/\.[^.]+$/, "").slice(0, 80) || "foto";
          canvas.width = 0; canvas.height = 0;
          return new File([blob], baseName + ".webp", { type: "image/webp", lastModified: Date.now() });
        }
      }
      canvas.width = 0; canvas.height = 0;
    }
    throw new Error("La foto no pudo reducirse a 1,5 MB en WebP. Prueba con otra imagen más pequeña.");
  } finally { bitmap.close?.(); }
}

async function fileToBase64(file) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, Math.min(offset + chunkSize, bytes.length)));
  }
  return btoa(binary);
}

async function uploadProductImage(productId, file, businessId) {
  if (!businessId) throw new Error("No pudimos identificar el negocio de este producto.");
  if (file.type !== "image/webp" || file.size > MAX_PRODUCT_IMAGE_BYTES) {
    throw new Error("La foto debe estar optimizada en WebP y pesar 1,5 MB o menos.");
  }
  const imageData = await fileToBase64(file);
  const { data, error } = await supabase.rpc("add_product_image_db", {
    p_business_id: businessId,
    p_product_id: productId,
    p_image_data: imageData,
    p_image_size_bytes: file.size
  });
  if (error) throw error;
  return data;
}

async function deleteProductImageRequest(productId, imageKey, businessId) {
  const { data, error } = await supabase.rpc("remove_product_image_db", {
    p_business_id: businessId,
    p_product_id: productId,
    p_image_key: imageKey
  });
  if (error) throw error;
  if (!data) throw new Error("No se pudo quitar la foto.");
  return data;
}

async function uploadProductVariantImage(productId, variantId, file, businessId) {
  if (!businessId || !variantId) throw new Error("Falta identificar la variante para subir la foto.");
  if (file.type !== "image/webp" || file.size > MAX_PRODUCT_IMAGE_BYTES) throw new Error("La foto debe estar optimizada en WebP y pesar 1,5 MB o menos.");
  const imageData = await fileToBase64(file);
  const { data, error } = await supabase.rpc("add_product_variant_image_db", {
    p_business_id: businessId, p_product_id: productId, p_variant_id: variantId,
    p_image_data: imageData, p_image_size_bytes: file.size
  });
  if (error) throw error;
  return data;
}

async function deleteProductVariantImage(productId, variantId, imageKey, businessId) {
  const { data, error } = await supabase.rpc("remove_product_variant_image_db", {
    p_business_id: businessId, p_product_id: productId, p_variant_id: variantId, p_image_key: imageKey
  });
  if (error) throw error;
  if (!data) throw new Error("No se pudo quitar la foto de la variante.");
  return data;
}

function ProductVariantImagePreview({ businessId, productId, variantId, imageKey, alt = "Foto de variante", onRemove, publicMode = false }) {
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setSrc(""); setFailed(false);
    const rpc = publicMode ? "get_public_catalog_variant_image" : "get_product_variant_image_db";
    const args = { p_business_id: businessId, p_product_id: productId, p_variant_id: variantId, p_image_key: imageKey };
    supabase.rpc(rpc, args).then(({ data, error }) => {
      const row = Array.isArray(data) ? data[0] : data;
      if (!active) return;
      if (error || !row?.image_data) { setFailed(true); return; }
      setSrc("data:" + (row.content_type || "image/webp") + ";base64," + row.image_data);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [businessId, productId, variantId, imageKey, publicMode]);
  return <figure className={"variant-photo-item" + (failed ? " is-unavailable" : "")}>
    {src ? <img src={src} alt={alt} loading="lazy" /> : <span className="variant-photo-placeholder" aria-label={failed ? "No se pudo cargar la foto" : "Cargando foto"}>{failed ? "Foto no disponible" : "…"}</span>}
    {onRemove && <button type="button" className="photo-remove-button" title="Quitar foto" aria-label="Quitar foto" onClick={onRemove}>×</button>}
  </figure>;
}

function PublicCatalogImage({ businessId, product }) {
  const imageKey = (product.image_paths || [])[0];
  const [element, setElement] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [source, setSource] = useState("");

  useEffect(() => {
    if (!element || !imageKey) return;
    if (typeof IntersectionObserver === "undefined") { setShouldLoad(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "180px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, imageKey]);

  useEffect(() => {
    if (!shouldLoad || !imageKey) return;
    let active = true;
    (async () => {
      try {
        const { data, error: imageError } = await supabase.rpc("get_public_catalog_image", {
          p_business_id: businessId, p_product_id: product.id, p_image_key: imageKey
        });
        if (imageError) throw imageError;
        const row = Array.isArray(data) ? data[0] : data;
        if (active && row?.image_data) setSource("data:" + (row.content_type || "image/webp") + ";base64," + row.image_data);
      } catch { /* El catálogo sigue visible aunque falte una imagen. */ }
    })();
    return () => { active = false; };
  }, [businessId, product.id, imageKey, shouldLoad]);

  return <div className="public-catalog-image" ref={setElement}>
    {source ? <img src={source} alt={product.name} loading="lazy" /> : <span aria-hidden="true">▦</span>}
  </div>;
}

function CatalogAdminImage({ businessId, product }) {
  const imageKey = Array.isArray(product.image_paths) ? product.image_paths[0] : "";
  const [element, setElement] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [source, setSource] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!element || !imageKey) return;
    if (typeof IntersectionObserver === "undefined") { setShouldLoad(true); return; }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: "180px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element, imageKey]);

  useEffect(() => {
    if (!shouldLoad || !imageKey || !businessId || !product.id) return;
    let active = true;
    (async () => {
      try {
        const { data, error: imageError } = await supabase.from("product_images")
          .select("content_type,image_data")
          .eq("business_id", businessId)
          .eq("product_id", product.id)
          .eq("image_key", imageKey)
          .maybeSingle();
        if (imageError) throw imageError;
        if (active && data?.image_data) setSource("data:" + (data.content_type || "image/webp") + ";base64," + data.image_data);
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => { active = false; };
  }, [businessId, product.id, imageKey, shouldLoad]);

  return <span className="catalog-admin-symbol" ref={setElement} title={product.name}>
    {source && !failed ? <img src={source} alt="" loading="lazy" onError={() => setFailed(true)} /> : "▦"}
  </span>;
}

function PaymentsAdmin({ business }) {
  const [status, setStatus] = useState({ enabled: false, configured: false, environment: null });
  const [environment, setEnvironment] = useState("sandbox");
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [integritySecret, setIntegritySecret] = useState("");
  const [eventsSecret, setEventsSecret] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const load = async () => {
    if (!business?.id) { setLoading(false); return; }
    setLoading(true); setError("");
    try {
      const { data, error: statusError } = await supabase.functions.invoke("public-checkout", { body: { action: "status", business_id: business.id } });
      if (statusError) throw statusError;
      const next = { enabled: Boolean(data?.enabled), configured: Boolean(data?.configured), environment: data?.environment || "sandbox" };
      setStatus(next); setEnabled(next.enabled); setEnvironment(next.environment);
    } catch (e) { setError(e?.message || "No se pudo consultar la configuración de pagos."); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [business?.id]);
  const save = async (event) => {
    event.preventDefault();
    if (!business?.id || saving) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const { data, error: saveError } = await supabase.functions.invoke("public-checkout", {
        body: {
          action: "configure", business_id: business.id, environment, enabled,
          public_key: publicKey.trim(), private_key: privateKey.trim(),
          integrity_secret: integritySecret.trim(), events_secret: eventsSecret.trim()
        }
      });
      if (saveError || !data?.saved) throw new Error(data?.error || saveError?.message || "No se pudo guardar la configuración.");
      setPublicKey(""); setPrivateKey(""); setIntegritySecret(""); setEventsSecret("");
      setNotice(enabled ? "Credenciales guardadas. Los cobros verificados están activados para este negocio." : "La configuración se guardó y los cobros quedaron desactivados.");
      await load();
    } catch (e) { setError(e?.message || "No se pudo guardar la configuración."); }
    finally { setSaving(false); }
  };
  const canManage = ["owner", "admin"].includes(business?.role);
  if (!canManage) return <section className="payments-page"><div className="panel"><h2>Acceso restringido</h2><p>Solo el propietario o un administrador puede configurar los cobros de este negocio.</p></div></section>;
  return <section className="payments-page">
    <div className="products-intro"><div><h2>Recibe pagos verificados</h2><p>Conecta las credenciales de Wompi de este negocio. Cada negocio guarda sus propias credenciales y recibe los pagos en su propia cuenta.</p></div><button type="button" className="secondary-button" onClick={load} disabled={loading}>Actualizar estado</button></div>
    <div className={"panel payment-status-panel " + (status.enabled ? "is-enabled" : "")}>
      <span className={"coupon-status " + (status.enabled ? "active" : "inactive")}>{loading ? "Consultando…" : status.enabled ? "Cobros activos" : status.configured ? "Cobros desactivados" : "Sin configurar"}</span>
      <h3>{status.enabled ? "Tu catálogo puede recibir pagos en línea" : "Configura los cobros de tu negocio"}</h3>
      <p>{status.enabled ? "Wompi redirige al cliente a su checkout seguro. treseiscinco confirma el pedido solo después de verificar el evento y consultar la transacción con Wompi." : "Mientras no estén configuradas las credenciales, el catálogo no permitirá iniciar un cobro ni mostrará una falsa confirmación."}</p>
      {status.configured && <small>Entorno actual: {status.environment === "production" ? "Producción" : "Pruebas (sandbox)"}</small>}
    </div>
    <form className="panel payment-config-form" onSubmit={save}>
      <h3>Credenciales de Wompi</h3>
      <p className="helper-text">Las credenciales se envían directamente al servidor y no se vuelven a mostrar. Déjalas en blanco para conservar las ya guardadas; al configurar por primera vez, completa los cuatro campos.</p>
      <label><span>Entorno</span><select value={environment} onChange={e => setEnvironment(e.target.value)}><option value="sandbox">Pruebas (sandbox)</option><option value="production">Producción</option></select></label>
      <label><span>Llave pública</span><input autoComplete="off" value={publicKey} onChange={e => setPublicKey(e.target.value)} placeholder={status.configured ? "Guardada · escribe solo si deseas cambiarla" : "pub_test_… o pub_prod_…"} /></label>
      <label><span>Llave privada</span><input type="password" autoComplete="new-password" value={privateKey} onChange={e => setPrivateKey(e.target.value)} placeholder={status.configured ? "Guardada · no se muestra por seguridad" : "prv_test_… o prv_prod_…"} /></label>
      <label><span>Secreto de integridad</span><input type="password" autoComplete="new-password" value={integritySecret} onChange={e => setIntegritySecret(e.target.value)} placeholder={status.configured ? "Guardado · no se muestra por seguridad" : "Secreto de integridad de Wompi"} /></label>
      <label><span>Secreto de eventos (webhook)</span><input type="password" autoComplete="new-password" value={eventsSecret} onChange={e => setEventsSecret(e.target.value)} placeholder={status.configured ? "Guardado · no se muestra por seguridad" : "Secreto de eventos de Wompi"} /></label>
      <label className="coupon-active-toggle"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} /> Activar cobros verificados para este negocio</label>
      {error && <p className="message error" role="alert">{error}</p>}
      {notice && <p className="message success" role="status">{notice}</p>}
      <div className="coupon-editor-actions"><button className="primary-button" type="submit" disabled={saving || loading}>{saving ? "Guardando credenciales…" : "Guardar configuración"}</button></div>
      <p className="helper-text">Antes de cobrar en producción, registra en el panel de Wompi la URL del webhook de esta función y prueba una transacción aprobada, rechazada y cancelada. No compartas las llaves privadas.</p>
    </form>
  </section>;
}

function CouponsAdmin({ business }) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [editingId, setEditingId] = useState(null);
  const blank = { code: "", description: "", discount_type: "percentage", discount_value: "10", minimum_subtotal: "0", maximum_discount: "", usage_limit: "", starts_at: "", ends_at: "", is_active: true };
  const [form, setForm] = useState(blank);
  const canManage = ["owner", "admin"].includes(business?.role) || Boolean(business?.permissions?.sales_manage);
  const currency = business?.currency_code || "COP";
  const load = async () => {
    if (!business?.id || !canManage) { setLoading(false); return; }
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("business_coupons")
      .select("id,business_id,code,description,discount_type,discount_value,minimum_subtotal_minor,maximum_discount_minor,usage_limit,usage_count,starts_at,ends_at,is_active,created_at")
      .eq("business_id", business.id).order("created_at", { ascending: false });
    if (queryError) setError(friendlyError(queryError)); else setCoupons(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [business?.id, business?.role]);
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const reset = () => { setEditingId(null); setForm(blank); setError(""); setNotice(""); };
  const edit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || "", description: coupon.description || "",
      discount_type: coupon.discount_type, discount_value: String(coupon.discount_value),
      minimum_subtotal: String(Number(coupon.minimum_subtotal_minor || 0) / (10 ** currencyDigits(currency))),
      maximum_discount: coupon.maximum_discount_minor == null ? "" : String(Number(coupon.maximum_discount_minor) / (10 ** currencyDigits(currency))),
      usage_limit: coupon.usage_limit == null ? "" : String(coupon.usage_limit),
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0,16) : "",
      ends_at: coupon.ends_at ? new Date(coupon.ends_at).toISOString().slice(0,16) : "",
      is_active: coupon.is_active
    });
    setError(""); setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!canManage || saving) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const code = form.code.trim().toUpperCase().replace(/\s+/g, "");
      const value = Number(form.discount_value);
      const minimum = toMinorUnits(Number(form.minimum_subtotal || 0), currency);
      const maxDiscount = form.maximum_discount.trim() === "" ? null : toMinorUnits(Number(form.maximum_discount), currency);
      const limit = form.usage_limit.trim() === "" ? null : Number(form.usage_limit);
      if (!/^[A-Z0-9_-]{3,32}$/.test(code)) throw new Error("El código debe tener entre 3 y 32 caracteres: letras, números, guion o guion bajo.");
      if (!Number.isFinite(value) || value <= 0 || (form.discount_type === "percentage" && (!Number.isInteger(value) || value > 100)) || (form.discount_type === "fixed" && !Number.isInteger(value * (10 ** currencyDigits(currency))))) throw new Error(form.discount_type === "percentage" ? "El porcentaje debe ser un número entero entre 1 y 100." : "Ingresa un valor fijo válido.");
      if (!Number.isFinite(minimum) || minimum < 0 || (maxDiscount != null && (!Number.isFinite(maxDiscount) || maxDiscount <= 0))) throw new Error("Revisa el mínimo de compra y el descuento máximo.");
      if (limit != null && (!Number.isInteger(limit) || limit < 1)) throw new Error("El límite de usos debe ser un entero positivo.");
      if (form.starts_at && form.ends_at && new Date(form.ends_at) <= new Date(form.starts_at)) throw new Error("La fecha final debe ser posterior a la inicial.");
      const row = {
        business_id: business.id, code, description: form.description.trim() || null,
        discount_type: form.discount_type,
        discount_value: form.discount_type === "percentage" ? Math.round(value) : Math.round(value * 100),
        minimum_subtotal_minor: minimum, maximum_discount_minor: maxDiscount,
        usage_limit: limit, starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
        ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        is_active: Boolean(form.is_active), updated_at: new Date().toISOString()
      };
      const result = editingId
        ? await supabase.from("business_coupons").update(row).eq("id", editingId).eq("business_id", business.id)
        : await supabase.from("business_coupons").insert(row);
      if (result.error) throw result.error;
      setNotice(editingId ? "Cupón actualizado." : "Cupón creado.");
      setEditingId(null); setForm(blank);
      await load();
    } catch (e) { setError(e?.message || friendlyError(e)); }
    finally { setSaving(false); }
  };
  const toggleActive = async (coupon) => {
    setError(""); setNotice("");
    const { error: updateError } = await supabase.from("business_coupons").update({ is_active: !coupon.is_active, updated_at: new Date().toISOString() }).eq("id", coupon.id).eq("business_id", business.id);
    if (updateError) setError(friendlyError(updateError)); else { setNotice(coupon.is_active ? "Cupón desactivado." : "Cupón activado."); await load(); }
  };
  const remove = async (coupon) => {
    if (!window.confirm("¿Eliminar el cupón " + coupon.code + "? Los pedidos históricos conservarán el código registrado.")) return;
    const { error: deleteError } = await supabase.from("business_coupons").delete().eq("id", coupon.id).eq("business_id", business.id);
    if (deleteError) setError(friendlyError(deleteError)); else { setNotice("Cupón eliminado."); if (editingId === coupon.id) reset(); await load(); }
  };
  const moneyInput = (value) => value === "" || value == null ? "—" : money(Number(value), currency);
  if (!canManage) return <section className="coupons-page"><div className="panel"><h2>Acceso restringido</h2><p>Solo el propietario o administradores autorizados pueden gestionar cupones.</p></div></section>;
  return <section className="coupons-page">
    <div className="products-intro"><div><h2>Promociones para tu catálogo</h2><p>Crea códigos de descuento que tus clientes podrán aplicar al comprar. El descuento se valida en el servidor y solo cuenta como usado cuando el pago queda verificado.</p></div><button type="button" className="secondary-button" onClick={load} disabled={loading}>Actualizar</button></div>
    <form className="panel coupon-editor" onSubmit={submit}>
      <div className="coupon-editor-heading"><div><h3>{editingId ? "Editar cupón" : "Crear cupón"}</h3><p>Los códigos no distinguen entre mayúsculas y minúsculas.</p></div>{editingId && <button type="button" className="secondary-button" onClick={reset}>Cancelar edición</button>}</div>
      <div className="coupon-form-grid">
        <label><span>Código *</span><input required maxLength={32} value={form.code} onChange={e => change("code",e.target.value.toUpperCase().replace(/\s+/g,""))} placeholder="BIENVENIDA10" /></label>
        <label><span>Tipo de descuento *</span><select value={form.discount_type} onChange={e => change("discount_type",e.target.value)}><option value="percentage">Porcentaje (%)</option><option value="fixed">Valor fijo ({currency})</option></select></label>
        <label><span>{form.discount_type === "percentage" ? "Porcentaje de descuento *" : "Descuento en " + currency + " *"}</span><input required type="number" min="1" max={form.discount_type === "percentage" ? "100" : undefined} step={form.discount_type === "percentage" ? "1" : String(1 / (10 ** currencyDigits(currency)))} value={form.discount_value} onChange={e => change("discount_value",e.target.value)} /></label>
        <label><span>Mínimo de compra ({currency})</span><input type="number" min="0" step={String(1 / (10 ** currencyDigits(currency)))} value={form.minimum_subtotal} onChange={e => change("minimum_subtotal",e.target.value)} /></label>
        <label><span>Descuento máximo ({currency}, opcional)</span><input type="number" min={String(1 / (10 ** currencyDigits(currency)))} step={String(1 / (10 ** currencyDigits(currency)))} value={form.maximum_discount} onChange={e => change("maximum_discount",e.target.value)} placeholder="Sin límite" /></label>
        <label><span>Límite total de usos</span><input type="number" min="1" step="1" value={form.usage_limit} onChange={e => change("usage_limit",e.target.value)} placeholder="Ilimitado" /></label>
        <label><span>Válido desde</span><input type="datetime-local" value={form.starts_at} onChange={e => change("starts_at",e.target.value)} /></label>
        <label><span>Válido hasta</span><input type="datetime-local" value={form.ends_at} onChange={e => change("ends_at",e.target.value)} /></label>
        <label className="coupon-description-field"><span>Descripción interna (opcional)</span><input maxLength={180} value={form.description} onChange={e => change("description",e.target.value)} placeholder="Ej. Campaña de lanzamiento" /></label>
      </div>
      <label className="coupon-active-toggle"><input type="checkbox" checked={form.is_active} onChange={e => change("is_active",e.target.checked)} /> Cupón activo y disponible en el catálogo</label>
      <div className="coupon-editor-actions"><button className="primary-button" type="submit" disabled={saving}>{saving ? "Guardando…" : editingId ? "Guardar cambios" : "Crear cupón"}</button>{!editingId && <button type="button" className="secondary-button" onClick={reset}>Limpiar</button>}</div>
    </form>
    {error && <p className="message error" role="alert">{error}</p>}
    {notice && <p className="message success" role="status">{notice}</p>}
    <div className="coupon-list-heading"><h3>Cupones de este negocio</h3><span>{coupons.length} en total</span></div>
    {loading ? <div className="panel">Cargando cupones…</div> : coupons.length === 0 ? <div className="panel coupon-empty"><h3>Aún no hay cupones</h3><p>Crea el primero para ofrecer descuentos en tu catálogo público.</p></div> :
      <div className="coupon-list">{coupons.map(coupon => <article className="panel coupon-card" key={coupon.id}>
        <div className="coupon-card-top"><div><span className={"coupon-status " + (coupon.is_active ? "active" : "inactive")}>{coupon.is_active ? "Activo" : "Inactivo"}</span><h4>{coupon.code}</h4>{coupon.description && <p>{coupon.description}</p>}</div><strong>{coupon.discount_type === "percentage" ? coupon.discount_value + "%" : moneyInput(coupon.discount_value)}</strong></div>
        <div className="coupon-meta"><span>Mínimo: {moneyInput(coupon.minimum_subtotal_minor)}</span><span>Usos: {coupon.usage_count}{coupon.usage_limit == null ? " / ∞" : " / " + coupon.usage_limit}</span>{coupon.maximum_discount_minor != null && <span>Tope: {moneyInput(coupon.maximum_discount_minor)}</span>}{coupon.ends_at && <span>Hasta: {new Date(coupon.ends_at).toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short"})}</span>}</div>
        <div className="coupon-card-actions"><button type="button" className="icon-action-button" title="Editar cupón" aria-label="Editar cupón" onClick={() => edit(coupon)}><AppIcon name="edit" size={15}/></button><button type="button" className="secondary-button" onClick={() => toggleActive(coupon)}>{coupon.is_active ? "Desactivar" : "Activar"}</button><button type="button" className="icon-action-button icon-action-danger" title="Eliminar cupón" aria-label="Eliminar cupón" onClick={() => remove(coupon)}><AppIcon name="trash" size={15}/></button></div>
      </article>)}</div>}
  </section>;
}

function PublicCatalog({ businessId }) {
  const [page, setPage] = useState(0);
  const [catalogSearchText, setCatalogSearchText] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("all");
  const [catalogPublicSort, setCatalogPublicSort] = useState("name_asc");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [businessInfoOpen, setBusinessInfoOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: "", phone: "", email: "", address: "", notes: "" });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [paymentEnabled, setPaymentEnabled] = useState(false);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(true);
  const [returnedOrder, setReturnedOrder] = useState(null);
  const [orderStatusLoading, setOrderStatusLoading] = useState(false);
  const pageSize = 24;
  const returnOrderReference = new URLSearchParams(window.location.search).get("order") || "";

  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    (async () => {
      try {
        const { data, error: catalogError } = await supabase.rpc("get_public_catalog", {
          p_business_id: businessId, p_limit: pageSize, p_offset: page * pageSize,
          p_search: catalogSearchText.trim().slice(0,100) || null,
          p_category_id: catalogCategoryFilter === "all" ? null : catalogCategoryFilter,
          p_sort: catalogPublicSort
        });
        if (catalogError) throw catalogError;
        if (active) setPayload(data || null);
      } catch (e) {
        if (active) setError(friendlyError(e));
      } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [businessId, page, retryKey, catalogSearchText, catalogCategoryFilter, catalogPublicSort]);

  useEffect(() => {
    let active = true;
    setPaymentStatusLoading(true);
    supabase.functions.invoke("public-checkout", { body: { action: "status", business_id: businessId } })
      .then(({ data, error: statusError }) => {
        if (active) setPaymentEnabled(!statusError && data?.enabled === true);
      })
      .catch(() => { if (active) setPaymentEnabled(false); })
      .finally(() => { if (active) setPaymentStatusLoading(false); });
    return () => { active = false; };
  }, []);

  const refreshReturnedOrder = async () => {
    if (!returnOrderReference) return;
    setOrderStatusLoading(true);
    try {
      let checkoutToken = "";
      try { checkoutToken = sessionStorage.getItem("t31-checkout:" + returnOrderReference) || ""; } catch {}
      if (!checkoutToken) {
        setReturnedOrder({ payment_status: "unknown", order_reference: returnOrderReference });
        return;
      }
      const { data, error: statusError } = await supabase.rpc("get_public_store_order_status", {
        p_order_reference: returnOrderReference,
        p_checkout_token: checkoutToken
      });
      if (statusError) throw statusError;
      setReturnedOrder(data || { payment_status: "unknown", order_reference: returnOrderReference });
    } catch {
      setReturnedOrder({ payment_status: "unknown", order_reference: returnOrderReference });
    } finally { setOrderStatusLoading(false); }
  };

  useEffect(() => {
    if (returnOrderReference && businessId) refreshReturnedOrder();
  }, [returnOrderReference, businessId]);

  const business = payload?.business;
  const catalogCategories = payload?.categories || [];
  const ownerPhoneDigits = String(business?.commercial_profile?.phone || "").replace(/\D/g, "");
  const whatsappPhone = ownerPhoneDigits.length === 10 && ownerPhoneDigits.startsWith("3") ? "57" + ownerPhoneDigits : ownerPhoneDigits;
  const hasWhatsappContact = whatsappPhone.length >= 8;
  const baseCatalogTheme = normalizeBusinessTheme(business?.theme);
  const publicProfile = business?.commercial_profile || {};
  const validCatalogColor = (value) => /^#[0-9a-f]{6}$/i.test(String(value || ""));
  const catalogTheme = {
    ...baseCatalogTheme,
    primary: validCatalogColor(publicProfile.catalogPrimary) ? publicProfile.catalogPrimary : baseCatalogTheme.primary,
    background: validCatalogColor(publicProfile.catalogBackground) ? publicProfile.catalogBackground : baseCatalogTheme.background,
    surface: validCatalogColor(publicProfile.catalogSurface) ? publicProfile.catalogSurface : baseCatalogTheme.surface,
    text: validCatalogColor(publicProfile.catalogText) ? publicProfile.catalogText : baseCatalogTheme.text
  };
  const openingInfo = (() => {
    const schedule=business?.commercial_profile?.hoursSchedule;
    if (!schedule || typeof schedule!=="object") return null;
    const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Bogota",weekday:"short",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
    const values=Object.fromEntries(parts.map((part)=>[part.type,part.value]));
    const dayKey=({Mon:"mon",Tue:"tue",Wed:"wed",Thu:"thu",Fri:"fri",Sat:"sat",Sun:"sun"})[values.weekday];
    const dayLabel=({mon:"Lunes",tue:"Martes",wed:"Miércoles",thu:"Jueves",fri:"Viernes",sat:"Sábado",sun:"Domingo"})[dayKey]||"Hoy";
    const day=schedule[dayKey];
    const periods=(Array.isArray(day?.periods)?day.periods:[]).filter((p)=>p&&/^([01]\d|2[0-3]):[0-5]\d$/.test(p.open||"")&&/^([01]\d|2[0-3]):[0-5]\d$/.test(p.close||""));
    const fmt=(time)=>{const [hour,minute]=time.split(":").map(Number);const h=hour%12||12;const suffix=hour<12?"a. m.":"p. m.";return h+":"+String(minute).padStart(2,"0")+" "+suffix;};
    const nowMinute=Number(values.hour)*60+Number(values.minute);
    const isOpen=Boolean(day?.enabled)&&periods.some((p)=>{const [sh,sm]=p.open.split(":").map(Number);const [eh,em]=p.close.split(":").map(Number);const from=sh*60+sm,to=eh*60+em;return from<=to?(nowMinute>=from&&nowMinute<to):(nowMinute>=from||nowMinute<to);});
    const hours=day?.enabled&&periods.length?periods.map((p)=>fmt(p.open)+"–"+fmt(p.close)).join(" · "):"Sin atención programada";
    return {dayKey,dayLabel,isOpen,hours,configured:Boolean(day?.enabled&&periods.length)};
  })();
  const catalogLogoUrl = getBusinessLogoUrl(business?.logo_path);
  const catalogPrimary=readableText(catalogTheme.surface,catalogTheme.primary);
  const catalogSurfaceText=readableText(catalogTheme.surface,catalogTheme.text);
  const catalogPrimaryHover = shadeHex(catalogTheme.primary);
  const catalogThemeStyle = {
    "--green": catalogPrimary,
    "--brand-teal": catalogPrimary,
    "--brand-blue": catalogPrimary,
    "--brand-yellow": catalogPrimary,
    "--paper": catalogTheme.surface,
    "--ink": catalogSurfaceText,
    "--muted": readableText(catalogTheme.surface, "#69758A"),
    "--primary-button-bg": catalogTheme.primary,
    "--primary-button-text": readableText(catalogTheme.primary, "#FFFFFF"),
    "--button-hover": catalogPrimaryHover,
    "--button-hover-text": readableText(catalogPrimaryHover, "#FFFFFF"),
    "--app-background": catalogTheme.background,
    "--soft-green": "color-mix(in srgb," + catalogPrimary + " 12%," + catalogTheme.surface + ")",
    background: catalogTheme.background,
    color: readableText(catalogTheme.background, catalogTheme.text)
  };
  const items = payload?.products || [];
  const total = Number(payload?.total || 0);
  const cartCount = cart.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
  const cartTotal = cart.reduce((sum, line) => sum + Number(line.product.sale_price_minor || 0) * Number(line.quantity || 0), 0);
  const checkoutTotal = Math.max(0, cartTotal - Number(couponApplied?.discount_minor || 0));
  const addToCart = (product) => {
    setCart((current) => {
      const found = current.find((line) => line.product.id === product.id);
      if (found) return current.map((line) => line.product.id === product.id ? { ...line, quantity: Math.min(1000, Number(line.quantity) + 1) } : line);
      return [...current, { product, quantity: 1 }];
    });
    setCheckoutError("");
    setCouponApplied(null); setCouponMessage("");
    setCartOpen(true);
  };
  const updateCartQuantity = (productId, quantity) => {
    const next = Number(quantity);
    setCouponApplied(null); setCouponMessage("");
    if (!Number.isFinite(next) || next <= 0) {
      setCart((current) => current.filter((line) => line.product.id !== productId));
      return;
    }
    setCart((current) => current.map((line) => line.product.id === productId ? { ...line, quantity: Math.min(1000, Math.round(next * 1000) / 1000) } : line));
    setCouponApplied(null); setCouponMessage("");
  };
  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code || !cart.length || couponChecking) return;
    setCouponChecking(true); setCouponMessage(""); setCouponApplied(null); setCheckoutError("");
    try {
      const { data, error: validationError } = await supabase.rpc("get_public_coupon_quote", {
        p_business_id: businessId, p_coupon_code: code, p_subtotal_minor: cartTotal
      });
      if (validationError) throw validationError;
      if (!data?.valid) throw new Error(data?.message || "No se pudo validar el cupón.");
      setCouponApplied(data);
      setCouponCode(data.code || code);
      setCouponMessage(data.message || "Cupón aplicado.");
    } catch (e) {
      setCouponMessage(e?.message || friendlyError(e));
    } finally { setCouponChecking(false); }
  };
  const submitCheckout = async (event) => {
    event.preventDefault();
    if (!cart.length || checkoutBusy) return;
    if (business?.commercial_profile?.orderChannel === "whatsapp") {
      let rawPhone = String(business?.commercial_profile?.phone || "").replace(/\D/g, "");
      if (rawPhone.length === 10 && rawPhone.startsWith("3")) rawPhone = "57" + rawPhone;
      if (rawPhone.length < 8) { setCheckoutError("Este negocio debe configurar un número de WhatsApp válido antes de recibir pedidos."); return; }
      setCheckoutBusy(true); setCheckoutError("");
      const lines = cart.map((line) => "• " + line.product.name + " × " + line.quantity + " = " + money(Number(line.product.sale_price_minor || 0) * Number(line.quantity), business?.currency_code || "COP"));
      const discountLine = couponApplied ? "\nDescuento (" + couponApplied.code + "): -" + money(couponApplied.discount_minor, business?.currency_code || "COP") : "";
      const message = ["Hola, quiero hacer este pedido a " + (business?.commercial_profile?.tradeName || business?.name || "su negocio") + ":", "", ...lines, "", "Subtotal: " + money(cartTotal, business?.currency_code || "COP") + discountLine, "Total estimado: " + money(checkoutTotal, business?.currency_code || "COP"), "", "Nombre: " + checkoutForm.name.trim(), "Celular: " + checkoutForm.phone.trim(), checkoutForm.email.trim() ? "Correo: " + checkoutForm.email.trim() : "", checkoutForm.address.trim() ? "Dirección: " + checkoutForm.address.trim() : "", checkoutForm.notes.trim() ? "Notas: " + checkoutForm.notes.trim() : ""].filter(Boolean).join("\n");
      window.location.assign("https://wa.me/" + rawPhone + "?text=" + encodeURIComponent(message));
      return;
    }
    if (business?.currency_code !== "COP") {
      setCheckoutError("Wompi solo admite pagos en pesos colombianos (COP). Este negocio debe elegir pedidos por WhatsApp o configurar su moneda en COP.");
      return;
    }
    if (!paymentEnabled) {
      setCheckoutError("Los pagos en línea aún no están habilitados. No se ha creado ningún pedido ni se ha cobrado nada.");
      return;
    }
    setCheckoutBusy(true);
    setCheckoutError("");
    try {
      const { data: order, error: orderError } = await supabase.functions.invoke("public-checkout", {
        body: {
          action: "order",
          business_id: businessId,
          customer_name: checkoutForm.name.trim(),
          customer_phone: checkoutForm.phone.trim(),
          customer_email: checkoutForm.email.trim() || null,
          customer_address: checkoutForm.address.trim() || null,
          customer_notes: checkoutForm.notes.trim() || null,
          items: cart.map((line) => ({ product_id: line.product.id, quantity: line.quantity })),
          coupon_code: couponApplied?.code || null
        }
      });
      if (orderError) throw new Error(orderError.message || "No se pudo crear el pedido de forma segura.");
      if (!order?.order_id || !order?.checkout_token || !order?.order_reference) throw new Error("No se pudo preparar el pedido para el pago.");
      try { sessionStorage.setItem("t31-checkout:" + order.order_reference, order.checkout_token); } catch {}
      const { data: checkout, error: checkoutErrorResult } = await supabase.functions.invoke("public-checkout", {
        body: { action: "create", order_id: order.order_id, checkout_token: order.checkout_token }
      });
      if (checkoutErrorResult || !checkout?.checkout_url) {
        throw new Error(checkout?.error || checkoutErrorResult?.message || "No se pudo iniciar el pago seguro. Inténtalo de nuevo.");
      }
      window.location.assign(checkout.checkout_url);
    } catch (e) {
      setCheckoutError(e?.message || friendlyError(e));
    } finally {
      setCheckoutBusy(false);
    }
  };
  const orderChannel = business?.commercial_profile?.orderChannel === "whatsapp" ? "whatsapp" : "wompi";
  const returnedStatus = returnedOrder?.payment_status;
  const returnedMessage = returnedStatus === "approved"
    ? "Pago verificado. Tu pedido quedó confirmado."
    : returnedStatus === "pending"
      ? "Estamos esperando la confirmación del proveedor de pagos. Si ya pagaste, actualiza el estado en unos segundos."
      : returnedStatus === "declined"
        ? "El pago fue rechazado. Puedes volver al catálogo e intentarlo de nuevo."
        : returnedStatus === "voided"
          ? "El pago fue cancelado."
          : returnedStatus === "review"
            ? "Recibimos la notificación de pago, pero el pedido requiere revisión del negocio. No vuelvas a pagar; contacta al comercio."
            : returnedStatus === "unknown"
              ? "No pudimos consultar el estado del pago en este momento."
              : "";

  async function sharePublicProduct(product) {
    const slug = String(business?.slug || "").trim();
    const url = window.location.origin + (slug ? "/" + slug : "/?catalog=" + encodeURIComponent(businessId)) + "#producto-" + encodeURIComponent(product.id);
    const text = [product.name, product.description || "", "Precio: " + money(product.sale_price_minor, business?.currency_code || "COP"), url].filter(Boolean).join("\n");
    try { if (navigator.share) await navigator.share({ title: product.name, text, url }); else { await navigator.clipboard.writeText(text); setCheckoutNotice("Enlace del producto copiado."); } }
    catch (e) { if (e?.name !== "AbortError") { try { await navigator.clipboard.writeText(text); setCheckoutNotice("Enlace del producto copiado."); } catch { setCheckoutError("No se pudo compartir este producto."); } } }
  }

  return <main className="public-catalog-shell" style={catalogThemeStyle}>
    <header className="public-catalog-header">
      <a href={window.location.origin} className="public-catalog-brand" aria-label={business?.name || "treseiscinco"}>{catalogLogoUrl ? <img src={catalogLogoUrl} alt={business?.name || "Logo del negocio"} /> : <img className="catalog-brand-symbol" src="/symbol-treseiscinco.svg" alt="treseiscinco" />}</a>
      <div><span>CATÁLOGO DE PRODUCTOS</span><h1>{business?.commercial_profile?.tradeName || business?.name || "Catálogo"}</h1></div>
      <div className="public-catalog-header-actions">
        <button type="button" className="public-catalog-cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${cartCount} artículos`}>
          <span aria-hidden="true">🛒</span><span>Carrito</span><b>{cartCount}</b>
        </button>
      </div>
    </header>
    {loading ? <div className="public-catalog-message"><span className="loading-dots">31</span><p>Cargando el catálogo…</p></div>
      : error ? <div className="public-catalog-message"><h2>No se pudo abrir el catálogo</h2><p>{error}</p><button type="button" className="secondary-button" onClick={() => setRetryKey((key) => key + 1)}>Reintentar</button></div>
      : !business ? <div className="public-catalog-message"><h2>Este catálogo no está disponible</h2><p>Revisa que el enlace sea correcto.</p></div>
      : <section className="public-catalog-content">
        <div className="public-catalog-intro">
          <div className="public-catalog-intro-left">
            {business.commercial_profile?.publicDescription && <p>{business.commercial_profile.publicDescription}</p>}
            {openingInfo && <div className="public-catalog-intro-meta"><div className={"public-business-hours-status "+(openingInfo.isOpen?"is-open":"is-closed")}><span className="public-business-hours-dot" aria-hidden="true"/><strong>{openingInfo.isOpen?"Abierto":"Cerrado"}</strong><span>{openingInfo.dayLabel}: {openingInfo.hours}</span><small>Hora de Colombia</small></div></div>}
          </div>
          <div className="public-catalog-intro-actions">
            {Array.isArray(business?.commercial_profile?.deliveryMethods)&&business.commercial_profile.deliveryMethods.length>0&&<div className="public-catalog-delivery-methods" aria-label="Opciones de entrega">{business.commercial_profile.deliveryMethods.includes("pickup")&&<span className="public-catalog-delivery-badge"><AppIcon name="store" size={14}/>Recogida en el negocio</span>}{business.commercial_profile.deliveryMethods.includes("delivery")&&<span className="public-catalog-delivery-badge"><AppIcon name="truck" size={14}/>Entrega a domicilio</span>}</div>}
            <span className="public-catalog-currency">{business.currency_code}</span>
          </div>
        </div>
        {returnedMessage && <div className={`public-catalog-payment-result ${returnedStatus === "approved" ? "is-success" : returnedStatus === "review" ? "is-warning" : ""}`} role="status">
          <div><strong>{returnedStatus === "approved" ? "¡Compra confirmada!" : returnedStatus === "pending" ? "Pago en proceso" : returnedStatus === "review" ? "Pedido en revisión" : "Estado del pedido"}</strong><p>{returnedMessage}</p>
          {returnedOrder?.sale_number && <span>Venta {returnedOrder.sale_number}</span>}
          </div>
          <button type="button" className="secondary-button" onClick={refreshReturnedOrder} disabled={orderStatusLoading}>{orderStatusLoading ? "Consultando…" : "Actualizar estado"}</button>
        </div>}
        <div className="public-catalog-filters" aria-label="Buscar y ordenar productos">
          <label className="public-catalog-search"><span><AppIcon name="search" size={16}/> Buscar productos</span><input value={catalogSearchText} onChange={(event) => { setCatalogSearchText(event.target.value); setPage(0); }} maxLength={100} placeholder="Nombre, descripción o código…" /></label>
          <label><span>Categoría</span><select value={catalogCategoryFilter} onChange={(event) => { setCatalogCategoryFilter(event.target.value); setPage(0); }}><option value="all">Todas las categorías</option>{catalogCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
          <label><span>Ordenar por</span><select value={catalogPublicSort} onChange={(event) => { setCatalogPublicSort(event.target.value); setPage(0); }}><option value="name_asc">Nombre: A → Z</option><option value="name_desc">Nombre: Z → A</option><option value="price_asc">Precio: menor a mayor</option><option value="price_desc">Precio: mayor a menor</option></select></label>
        </div>
        {items.length ? <div className="public-catalog-grid">{items.map((product) => <article className="public-catalog-card" key={product.id} id={"producto-" + product.id}>
          <PublicCatalogImage businessId={businessId} product={product} />
          <div className="public-catalog-card-copy">
            <span className="public-catalog-category">{product.category_name || "Producto"}</span>
            <div className="public-catalog-product-heading"><h2>{product.name}</h2><button type="button" className="public-product-share" title={"Compartir "+product.name} aria-label={"Compartir "+product.name} onClick={()=>sharePublicProduct(product)}>↗</button></div>
            <p className={"public-catalog-card-description" + (product.description ? "" : " is-guidance")}>{product.description || (hasWhatsappContact ? "Consulta disponibilidad y detalles por WhatsApp." : "Consulta con el negocio los detalles de este producto.")}</p>
            {product.commercial_presentation && <span className="public-catalog-presentation">{product.commercial_presentation}</span>}
            <div className="public-catalog-price"><strong>{money(product.sale_price_minor, business.currency_code || "COP")}</strong><span>por {product.unit_name || "unidad"}</span></div>
            {product.is_out_of_stock && business?.commercial_profile?.stockVisibility === "show_unavailable" && <span className="public-catalog-out-of-stock">Agotado</span>}
            {Array.isArray(product.variants) && product.variants.length > 0 && <div className="public-catalog-variants" aria-label="Variantes disponibles">{product.variants.slice(0,4).map((variant) => <div className="public-catalog-variant" key={variant.id}><span>{variantDisplayLabel(variant)}</span>{(variant.image_paths||[]).slice(0,2).map((imageKey) => <ProductVariantImagePreview key={imageKey} businessId={businessId} productId={product.id} variantId={variant.id} imageKey={imageKey} alt={"Foto de "+variant.variant_name+" "+variant.variant_value} publicMode />)}</div>)}</div>}
            <button type="button" className="public-catalog-add-button" disabled={product.is_out_of_stock && business?.commercial_profile?.stockVisibility === "show_unavailable"} onClick={() => addToCart(product)}>{product.is_out_of_stock && business?.commercial_profile?.stockVisibility === "show_unavailable" ? "Agotado" : <><span aria-hidden="true">＋</span> Añadir al carrito</>}</button>
          </div>
        </article>)}</div>
          : <div className="public-catalog-message"><h2>Pronto habrá productos aquí</h2><p>Este negocio aún no ha publicado productos para compartir.</p></div>}
        {!items.length && (catalogSearchText.trim() || catalogCategoryFilter !== "all") && <div className="public-catalog-message"><h2>No encontramos productos con esos filtros</h2><p>Prueba otro nombre o cambia la categoría seleccionada.</p><button type="button" className="secondary-button" onClick={() => { setCatalogSearchText(""); setCatalogCategoryFilter("all"); setCatalogPublicSort("name_asc"); setPage(0); }}>Mostrar todos los productos</button></div>}
        {total > pageSize && <nav className="public-catalog-pagination" aria-label="Páginas del catálogo">
          <button type="button" className="secondary-button" disabled={page <= 0} onClick={() => { setPage((current) => Math.max(0, current - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Anterior</button>
          <span>Página {page + 1} de {Math.ceil(total / pageSize)}</span>
          <button type="button" className="secondary-button" disabled={(page + 1) * pageSize >= total} onClick={() => { setPage((current) => current + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Siguiente</button>
        </nav>}
      </section>}
    <nav className={"public-catalog-bottom-bar" + (hasWhatsappContact ? " has-whatsapp" : "")} aria-label="Navegación del catálogo">
      <a className="public-catalog-bottom-brand" href={business?.slug ? "/" + business.slug : "/?catalog=" + encodeURIComponent(businessId)} aria-label="treseiscinco, volver al catálogo" title="treseiscinco"><img src="/symbol-treseiscinco.svg" alt="treseiscinco" /></a>
      <button type="button" className={"public-catalog-bottom-tab"+(!businessInfoOpen?" is-active":"")} aria-current={!businessInfoOpen?"page":undefined} onClick={() => { setBusinessInfoOpen(false); setCartOpen(false); document.querySelector(".public-catalog-header")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}><span aria-hidden="true">▦</span><strong>Catálogo</strong></button>
      <button type="button" className={"public-catalog-bottom-tab"+(businessInfoOpen?" is-active":"")} onClick={() => { setCartOpen(false); setBusinessInfoOpen(true); }} aria-haspopup="dialog" aria-expanded={businessInfoOpen}><span aria-hidden="true">ⓘ</span><strong>Información</strong></button>
      {hasWhatsappContact && <a className="public-catalog-bottom-tab public-catalog-bottom-whatsapp" href={"https://wa.me/" + whatsappPhone + "?text=" + encodeURIComponent("Hola, quisiera consultar sobre los productos de " + (business?.commercial_profile?.tradeName || business?.name || "su catálogo") + ".")} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp" title="Consultar por WhatsApp"><AppIcon name="whatsapp" size={22}/><strong>WhatsApp</strong></a>}
    </nav>
    {businessInfoOpen && business && <div className="public-business-info-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setBusinessInfoOpen(false); }}>
      <section className="public-business-info-sheet" role="dialog" aria-modal="true" aria-labelledby="public-business-info-title">
        <div className="public-business-info-sheet-heading"><div><span>CONOCE EL NEGOCIO</span><h2 id="public-business-info-title">{business.commercial_profile?.tradeName || business.name}</h2></div><button type="button" onClick={() => setBusinessInfoOpen(false)} aria-label="Cerrar información">×</button></div>
        {business.commercial_profile?.publicDescription && <p className="public-business-info-description">{business.commercial_profile.publicDescription}</p>}
        <div className="public-business-info-list">
          {business.commercial_profile?.phone && <a href={"tel:"+business.commercial_profile.phone}><span aria-hidden="true">☎</span><span><strong>Teléfono / WhatsApp</strong><small>{business.commercial_profile.phone}</small></span><b>›</b></a>}
          {business.commercial_profile?.email && <a href={"mailto:"+business.commercial_profile.email}><span aria-hidden="true">✉</span><span><strong>Correo electrónico</strong><small>{business.commercial_profile.email}</small></span><b>›</b></a>}
          {(business.commercial_profile?.address || business.commercial_profile?.city) && <a href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent([business.commercial_profile.address,business.commercial_profile.city].filter(Boolean).join(", "))} target="_blank" rel="noreferrer"><span aria-hidden="true">⌖</span><span><strong>Dirección</strong><small>{[business.commercial_profile.address,business.commercial_profile.city].filter(Boolean).join(", ")}</small></span><b>↗</b></a>}
          {business.commercial_profile?.website && <a href={/^https?:\/\//i.test(business.commercial_profile.website)?business.commercial_profile.website:"https://"+business.commercial_profile.website} target="_blank" rel="noreferrer"><span aria-hidden="true">◎</span><span><strong>Sitio web</strong><small>{business.commercial_profile.website}</small></span><b>↗</b></a>}
          {business.commercial_profile?.hours && <div className="public-business-info-hours"><span aria-hidden="true">◷</span><span><strong>Horario de atención</strong><small className="public-business-hours">{business.commercial_profile.hours}</small></span></div>}
        </div>
        <button type="button" className="public-business-info-done" onClick={() => setBusinessInfoOpen(false)}>Volver al catálogo</button>
      </section>
    </div>}
    <footer className="public-catalog-footer"><img src="/brand-treseiscinco.svg" alt="treseiscinco" /><span>Catálogo compartido con treseiscinco</span></footer>

    {cartOpen && <div className="public-cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false); }}>
      <section className="public-cart-panel" role="dialog" aria-modal="true" aria-labelledby="public-cart-title">
        <header className="public-cart-header"><div><span>COMPRA SEGURA</span><h2 id="public-cart-title">Tu carrito <small>({cartCount})</small></h2></div><button type="button" className="public-cart-close" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito">×</button></header>
        {cart.length === 0 ? <div className="public-cart-empty"><span aria-hidden="true">🛍️</span><h3>Tu carrito está vacío</h3><p>Explora el catálogo y añade los productos que te interesen.</p><button type="button" className="public-catalog-add-button" onClick={() => setCartOpen(false)}>Seguir explorando</button></div>
          : <>
            <div className="public-cart-lines">{cart.map((line) => <article className="public-cart-line" key={line.product.id}>
              <div className="public-cart-line-copy"><strong>{line.product.name}</strong><span>{money(line.product.sale_price_minor, business?.currency_code || "COP")} por {line.product.unit_name || "unidad"}</span><b>{money(Number(line.product.sale_price_minor || 0) * Number(line.quantity), business?.currency_code || "COP")}</b></div>
              <div className="public-cart-quantity"><button type="button" onClick={() => updateCartQuantity(line.product.id, Number(line.quantity) - 1)} aria-label={`Quitar una unidad de ${line.product.name}`}>−</button><span>{line.quantity}</span><button type="button" onClick={() => updateCartQuantity(line.product.id, Number(line.quantity) + 1)} aria-label={`Añadir una unidad de ${line.product.name}`}>＋</button><button type="button" className="public-cart-remove" onClick={() => updateCartQuantity(line.product.id, 0)}>Eliminar</button></div>
            </article>)}</div>
            {couponApplied && <div className="public-cart-discount"><span>Cupón {couponApplied.code}</span><strong>−{money(couponApplied.discount_minor, business?.currency_code || "COP")}</strong></div>}
            <div className="public-cart-total"><span>Total del pedido</span><strong>{money(checkoutTotal, business?.currency_code || "COP")}</strong></div>
            <form className="public-checkout-form" onSubmit={submitCheckout}>
              <div className="public-coupon-entry">
                <label><span>Código de descuento</span><input maxLength={32} value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase().replace(/\s+/g,"")); setCouponApplied(null); setCouponMessage(""); }} placeholder="¿Tienes un cupón?" /></label>
                <button type="button" className="secondary-button" onClick={applyCoupon} disabled={couponChecking || !couponCode.trim() || !cart.length}>{couponChecking ? "Validando…" : couponApplied ? "Aplicado" : "Aplicar"}</button>
                {couponMessage && <p className={couponApplied ? "coupon-feedback success" : "coupon-feedback"} role="status">{couponMessage}</p>}
              </div>
              <h3>Datos para el pedido</h3>
              <label><span>Nombre completo *</span><input required minLength={2} maxLength={160} autoComplete="name" value={checkoutForm.name} onChange={(e) => setCheckoutForm((current) => ({ ...current, name: e.target.value }))} placeholder="¿A nombre de quién?" /></label>
              <label><span>Celular / WhatsApp *</span><input required minLength={5} maxLength={40} autoComplete="tel" inputMode="tel" value={checkoutForm.phone} onChange={(e) => setCheckoutForm((current) => ({ ...current, phone: e.target.value }))} placeholder="Tu número de contacto" /></label>
              <label><span>Correo electrónico (opcional)</span><input type="email" maxLength={254} autoComplete="email" value={checkoutForm.email} onChange={(e) => setCheckoutForm((current) => ({ ...current, email: e.target.value }))} placeholder="tucorreo@ejemplo.com" /></label>
              <label><span>Dirección de entrega (opcional)</span><input maxLength={250} autoComplete="street-address" value={checkoutForm.address} onChange={(e) => setCheckoutForm((current) => ({ ...current, address: e.target.value }))} placeholder="Dirección, barrio y ciudad" /></label>
              <label><span>Notas del pedido (opcional)</span><textarea maxLength={1000} rows={2} value={checkoutForm.notes} onChange={(e) => setCheckoutForm((current) => ({ ...current, notes: e.target.value }))} placeholder="Indicaciones para el negocio" /></label>
              {checkoutError && <p className="public-checkout-error" role="alert">{checkoutError}</p>}
              {orderChannel === "wompi" && !paymentStatusLoading && business?.currency_code !== "COP" && <p className="public-checkout-unavailable">Wompi solo admite COP. El propietario debe cambiar la moneda del negocio a COP o elegir pedidos por WhatsApp.</p>}
              {orderChannel === "wompi" && !paymentStatusLoading && business?.currency_code === "COP" && !paymentEnabled && <p className="public-checkout-unavailable">El pago en línea aún no está configurado para este comercio. El propietario puede activar WhatsApp como alternativa.</p>}
              <button type="submit" className="public-checkout-pay-button" disabled={checkoutBusy || (orderChannel === "wompi" && (paymentStatusLoading || !paymentEnabled || business?.currency_code !== "COP"))}>{checkoutBusy ? (orderChannel === "whatsapp" ? "Abriendo WhatsApp…" : "Preparando pago seguro…") : orderChannel === "whatsapp" ? "Enviar pedido por WhatsApp" : paymentStatusLoading ? "Comprobando pagos…" : "Continuar al pago seguro"}</button>
              <p className="public-checkout-security">{orderChannel === "whatsapp" ? "El pedido se enviará al negocio por WhatsApp. El pago y la confirmación se acuerdan directamente con el comercio." : <><span aria-hidden="true">🔒</span> El pago se procesa en la plataforma segura de Wompi. El pedido solo se confirma cuando el proveedor verifica el pago.</>}</p>
            </form>
          </>}
      </section>
    </div>}
  </main>;
}


function PublicCatalogSlugRoute({ slug }) {
  const [state, setState] = useState({ loading: true, businessId: "", error: "" });

  useEffect(() => {
    let active = true;
    setState({ loading: true, businessId: "", error: "" });
    const resolveCatalog = async () => {
      try {
        const { data, error } = await supabase.rpc("resolve_public_catalog_slug", { p_slug: slug });
        if (error) throw error;
        if (typeof data !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data)) {
          if (active) setState({ loading: false, businessId: "", error: "No encontramos un catálogo público con ese nombre." });
          return;
        }
        if (active) setState({ loading: false, businessId: data, error: "" });
      } catch {
        if (active) setState({ loading: false, businessId: "", error: "No pudimos abrir este catálogo. Prueba con el enlace completo o vuelve a intentarlo." });
      }
    };
    void resolveCatalog();
    return () => { active = false; };
  }, [slug]);

  if (state.businessId) return <PublicCatalog businessId={state.businessId} />;
  return <main className="public-catalog-route-state">
    <img src="/brand-treseiscinco.svg" alt="treseiscinco" />
    {state.loading ? <p role="status">Buscando catálogo…</p> : <><h1>Catálogo no disponible</h1><p role="alert">{state.error}</p><a href="/">Ir a treseiscinco</a></>}
  </main>;
}


function PublicLanding({ onLogin, onSignup, onInstall, installPromptAvailable, appInstalled, showInstallGuide, onCloseInstallGuide }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  return <main className="public-landing">
    <header className="landing-header">
      <a className="landing-brand" href="#inicio" aria-label="treseiscinco, inicio"><img src="/brand-treseiscinco.svg" alt="treseiscinco" /></a>
      <nav className={"landing-nav" + (menuOpen ? " is-open" : "")} aria-label="Navegación principal">
        <a href="#beneficios" onClick={() => setMenuOpen(false)}>Qué puedes hacer</a>
        <a href="#planes" onClick={() => setMenuOpen(false)}>Planes y precios</a>
        <a href="#importar" onClick={() => setMenuOpen(false)}>Importar inventario</a>
        <a href="/ayuda" onClick={() => setMenuOpen(false)}>¿Necesitas ayuda?</a>
        <a href="/contacto" onClick={() => setMenuOpen(false)}>Soporte</a>
      </nav>
      <div className="landing-header-actions"><button type="button" className="landing-login-link" onClick={onLogin}>Iniciar sesión</button><button type="button" className="landing-primary-button" onClick={onSignup}>Probar gratis <span aria-hidden="true">↗</span></button></div>
      <button type="button" className="landing-menu-toggle" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span></span><span></span></button>
    </header>

    <section className="landing-hero" id="inicio">
      <div className="landing-hero-copy">
        <span className="landing-kicker"><span className="landing-kicker-dot"></span> PARA EL DÍA A DÍA DE TU NEGOCIO</span>
        <h1>Menos enredos.<br /><em>Más negocio.</em></h1>
        <p>Tu negocio, todos los días. Organiza productos, ventas, gastos y clientes en un solo espacio, con información clara para decidir mejor y trabajar con tranquilidad.</p>
        <div className="landing-hero-actions"><button type="button" className="landing-primary-button landing-hero-cta" onClick={onSignup}>Crear mi cuenta gratis <span aria-hidden="true">→</span></button><button type="button" className="landing-secondary-button" onClick={() => document.getElementById("beneficios")?.scrollIntoView({behavior:"smooth"})}>Conocer treseiscinco <span aria-hidden="true">↓</span></button></div>
        <div className="landing-trust-line"><span className="landing-trust-icon"><AppIcon name="shield-check" size={17}/></span><span>Tu información, tu negocio y tus decisiones.</span><span className="landing-trust-separator"></span><span>Empieza a organizarte desde hoy.</span></div>
      </div>
      <div className="landing-hero-art" aria-label="Ilustración de un negocio con indicadores, inventario y equipo de trabajo">
        <div className="landing-orbit landing-orbit-one"></div><div className="landing-orbit landing-orbit-two"></div>
        <div className="landing-number-mark" aria-hidden="true"><span>3</span><span>6</span><span>5</span></div>
        <div className="landing-dashboard-mock">
          <div className="landing-dashboard-top"><div className="landing-dashboard-brand"><img src="/symbol-treseiscinco.svg" alt="" /><div><strong>Tu negocio</strong><small>Resumen de actividad</small></div></div><span className="landing-dashboard-date">Esta semana <AppIcon name="chevron-down" size={13}/></span></div>
          <div className="landing-dashboard-metrics"><div><span>Ventas registradas</span><strong>$ 2,48 M</strong><small className="landing-metric-positive">↑ Actividad comercial</small></div><div><span>Inventario</span><strong>128</strong><small>Referencias</small></div><div><span>Rentabilidad</span><strong>32%</strong><small>Margen ilustrativo</small></div></div>
          <div className="landing-dashboard-chart"><div className="landing-chart-heading"><div><strong>Así se mueve tu negocio</strong><small>Gráfico ilustrativo, no son datos reales</small></div><span>7 días</span></div><div className="landing-chart-area"><div className="landing-chart-grid"><i></i><i></i><i></i><i></i></div><svg viewBox="0 0 420 114" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="landing-area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#3AAE9B" stopOpacity=".30"/><stop offset="100%" stopColor="#3AAE9B" stopOpacity=".02"/></linearGradient></defs><path d="M0 88 C25 82 31 61 60 70 S100 86 125 60 S162 63 185 45 S225 65 250 40 S290 30 310 45 S350 23 375 29 S400 11 420 8 L420 114 L0 114Z" fill="url(#landing-area-fill)"/><path d="M0 88 C25 82 31 61 60 70 S100 86 125 60 S162 63 185 45 S225 65 250 40 S290 30 310 45 S350 23 375 29 S400 11 420 8" fill="none" stroke="#167D82" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round"/></svg></div><div className="landing-chart-days"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div></div>
          <div className="landing-dashboard-bottom"><span><i className="landing-led"></i> Productos y movimientos en un solo lugar</span><span>treseiscinco</span></div>
        </div>
        <div className="landing-person landing-person-left" aria-hidden="true"><svg viewBox="0 0 140 170"><ellipse cx="69" cy="156" rx="53" ry="8" fill="#22263A" opacity=".10"/><path d="M34 78 Q18 103 22 135 L16 157 L53 157 L60 116 L67 158 L103 158 L99 110 Q91 80 77 77Z" fill="#B7DDEB"/><path d="M39 85 Q15 101 23 125 L48 128 L60 102Z" fill="#72B9D0"/><path d="M68 84 Q88 86 97 109 L109 134 L95 140 L76 113Z" fill="#8ACDD1"/><circle cx="61" cy="51" r="26" fill="#A96D4E"/><path d="M36 50 Q24 30 41 18 Q60 5 80 20 Q94 32 84 53 L76 38 Q59 44 42 34Z" fill="#2D2A37"/><path d="M51 57 Q61 64 71 57" fill="none" stroke="#6A3E32" strokeWidth="2" strokeLinecap="round"/><path d="M48 45h1M70 45h1" stroke="#24232D" strokeWidth="4" strokeLinecap="round"/><path d="M79 91 Q104 91 116 109 L128 127" fill="none" stroke="#A96D4E" strokeWidth="10" strokeLinecap="round"/><rect x="91" y="112" width="37" height="28" rx="4" fill="#fff" stroke="#D2E3E6" strokeWidth="2"/><path d="M98 120h22M98 126h16M98 132h19" stroke="#197B94" strokeWidth="2" strokeLinecap="round"/></svg></div>
        <div className="landing-person landing-person-right" aria-hidden="true"><svg viewBox="0 0 140 170"><ellipse cx="73" cy="156" rx="53" ry="8" fill="#22263A" opacity=".10"/><path d="M39 82 Q22 89 22 114 L19 157 L55 157 L64 116 L74 157 L112 157 L105 107 Q96 84 77 81Z" fill="#6A9C8B"/><path d="M40 91 Q16 105 21 127 L47 132 L60 106Z" fill="#477B6A"/><circle cx="74" cy="53" r="25" fill="#E3A77A"/><path d="M50 48 Q44 24 64 15 Q91 10 100 31 L97 47 L87 34 Q70 42 53 33Z" fill="#4A3529"/><path d="M64 60 Q74 68 84 60" fill="none" stroke="#9A5A42" strokeWidth="2" strokeLinecap="round"/><path d="M60 48h1M80 48h1" stroke="#2D2730" strokeWidth="4" strokeLinecap="round"/><path d="M46 95 Q61 99 67 119 L72 136" fill="none" stroke="#E3A77A" strokeWidth="10" strokeLinecap="round"/><rect x="56" y="119" width="50" height="29" rx="4" fill="#FFF" stroke="#D2E3E6" strokeWidth="2"/><path d="M64 127h33M64 134h24M64 141h17" stroke="#7BAA9A" strokeWidth="2" strokeLinecap="round"/></svg></div>
        <div className="landing-float-chip landing-chip-stock"><span className="landing-chip-icon"><AppIcon name="products" size={17}/></span><span><strong>Inventario organizado</strong><small>Artículos y existencias</small></span><AppIcon name="check" size={16}/></div>
        <div className="landing-float-chip landing-chip-flow"><span className="landing-chip-icon"><AppIcon name="sales" size={17}/></span><span><strong>Todo conectado</strong><small>Ventas · gastos · clientes</small></span></div>
      </div>
      <div className="landing-hero-spark landing-spark-one" aria-hidden="true">✳</div><div className="landing-hero-spark landing-spark-two" aria-hidden="true">✳</div>
    </section>

    {!appInstalled && <section className="landing-install-strip" aria-label="Instala treseiscinco en tu celular">
      <span className="landing-install-icon"><AppIcon name="smartphone" size={25}/></span>
      <div className="landing-install-copy">
        <span className="landing-kicker">TAMBIÉN EN TU CELULAR</span>
        <h2>Elige cómo instalar treseiscinco.</h2>
        <p>Android: descarga el APK. iPhone: instala la versión web desde Safari, sin App Store ni archivos adicionales.</p>
      </div>
      <div className="landing-install-actions">
        <a className="landing-install-button landing-apk-download" href="/download/apk"><AppIcon name="download" size={18}/> Descargar Android <span aria-hidden="true">↓</span></a>
        <button type="button" className="landing-install-secondary landing-ios-install" onClick={onInstall}><AppIcon name="smartphone" size={17}/> Instalar en iPhone <span aria-hidden="true">↗</span></button>
      </div>
    </section>}

    {showInstallGuide && !appInstalled && <section className="install-guide-panel landing-install-guide" aria-label="Instrucciones para instalar treseiscinco">
      <div className="install-guide-heading"><div><span className="eyebrow">TRESEISCINCO · INSTALACIÓN PARA IPHONE</span><h3>Instala treseiscinco en tu iPhone</h3><p>En iOS funciona como una app web: no hay que descargar un APK, un archivo IPA ni buscarla en App Store.</p></div><button type="button" className="icon-action-button" aria-label="Cerrar instrucciones" onClick={onCloseInstallGuide}>×</button></div>
      <div className="install-guide-steps">
        <div><strong>iPhone · Safari</strong><p>Abre treseiscinco.com en Safari, toca Compartir, elige «Agregar a pantalla de inicio» y pulsa «Agregar». Si aparece «Abrir como app web», déjalo activado.</p></div>
        <div><strong>Android · APK</strong><p>Pulsa «Descargar Android». Cuando termine, abre el archivo treseiscinco.apk y sigue la confirmación de instalación de Android.</p></div>
        <div><strong>Computador</strong><p>En Chrome o Edge, usa el icono Instalar de la barra de direcciones o la opción «Instalar treseiscinco» del menú.</p></div>
      </div>
    </section>}

    <section className="landing-proof-strip" aria-label="Funciones de treseiscinco"><div><AppIcon name="package" size={20}/><span>Inventario y costos</span></div><div><AppIcon name="receipt" size={20}/><span>Ventas y cuentas</span></div><div><AppIcon name="chart-no-axes-combined" size={20}/><span>Estadísticas útiles</span></div><div><AppIcon name="users" size={20}/><span>Clientes y equipo</span></div></section>

    <section className="landing-benefits section-wrap" id="beneficios"><div className="landing-section-intro"><span className="landing-kicker">MENOS TAREAS SUELTAS</span><h2>Todo lo importante,<br /><em>en su lugar.</em></h2><p>Para trabajar con claridad, incluso cuando tu negocio no deja de moverse.</p></div>
      <div className="landing-feature-grid">
        <article className="landing-feature-card feature-lilac"><span className="landing-feature-icon"><AppIcon name="package" size={24}/></span><h3>Controla tus productos</h3><p>Organiza referencias, precios, costos, cantidades y niveles de existencias desde una misma vista.</p><span className="landing-feature-foot">Inventario vivo, no hojas sueltas</span></article>
        <article className="landing-feature-card feature-peach"><span className="landing-feature-icon"><AppIcon name="receipt" size={24}/></span><h3>Registra cada movimiento</h3><p>Registra ventas, abonos, compras y gastos. Mantén los saldos visibles y el historial a mano.</p><span className="landing-feature-foot">Lo que pasa queda registrado</span></article>
        <article className="landing-feature-card feature-mint"><span className="landing-feature-icon"><AppIcon name="chart-no-axes-combined" size={24}/></span><h3>Entiende tus números</h3><p>Consulta costos, márgenes, rentabilidad y gráficos basados en los movimientos registrados.</p><span className="landing-feature-foot">Decisiones con más contexto</span></article>
        <article className="landing-feature-card feature-sand"><span className="landing-feature-icon"><AppIcon name="users" size={24}/></span><h3>Trabaja con otras personas</h3><p>Organiza clientes, proveedores y permisos de equipo para que cada persona vea lo que necesita.</p><span className="landing-feature-foot">Cada negocio, con su espacio</span></article>
      </div>
    </section>

    <section className="landing-how section-wrap"><div className="landing-how-visual"><div className="landing-how-screen"><div className="landing-how-screen-top"><img src="/symbol-treseiscinco.svg" alt=""/><span>Vista ilustrativa</span></div><div className="landing-how-product-row"><i className="landing-product-swatch"></i><span><b>Artículo de ejemplo</b><small>Precio · costo · existencias</small></span><strong>$ 45.000</strong></div><div className="landing-how-product-row"><i className="landing-product-swatch swatch-two"></i><span><b>Otro artículo</b><small>Ganancia y margen calculados</small></span><strong>$ 28.000</strong></div><div className="landing-how-mini-chart"><span>Así avanza tu semana</span><div className="landing-mini-bars"><i style={{height:"32%"}}></i><i style={{height:"52%"}}></i><i style={{height:"44%"}}></i><i style={{height:"75%"}}></i><i style={{height:"60%"}}></i><i style={{height:"94%"}}></i><i style={{height:"79%"}}></i></div></div></div><div className="landing-how-person"><svg viewBox="0 0 130 166" aria-hidden="true"><ellipse cx="66" cy="154" rx="44" ry="7" fill="#22263A" opacity=".12"/><path d="M34 77 Q18 97 25 130 L27 155 L57 155 L65 115 L73 155 L104 155 L100 108 Q92 82 75 77Z" fill="#D99B63"/><circle cx="64" cy="50" r="25" fill="#8F553F"/><path d="M40 47 Q31 24 50 14 Q75 4 89 27 L87 42 L75 29 Q62 40 41 34Z" fill="#2E2832"/><path d="M51 57 Q63 65 74 57" fill="none" stroke="#5F382F" strokeWidth="2" strokeLinecap="round"/><path d="M47 45h1M70 45h1" stroke="#24232D" strokeWidth="4" strokeLinecap="round"/><path d="M48 91Q78 97 94 119" fill="none" stroke="#8F553F" strokeWidth="10" strokeLinecap="round"/><rect x="77" y="114" width="35" height="24" rx="4" fill="#FFF" stroke="#E3D8CC" strokeWidth="2"/></svg></div></div><div className="landing-how-copy"><span className="landing-kicker">HECHO PARA USARLO</span><h2>Menos vueltas.<br /><em>Más tiempo para tu negocio.</em></h2><p>No necesitas ser experto en contabilidad o tecnología para empezar. Registra tus operaciones y consulta la información cuando te haga falta.</p><div className="landing-how-list"><div><span><AppIcon name="check" size={15}/></span><p><strong>Empieza por lo esencial</strong><small>Crea tus productos y registra tu primera venta.</small></p></div><div><span><AppIcon name="check" size={15}/></span><p><strong>Crece a tu ritmo</strong><small>Agrega clientes, equipo, cotizaciones y más control.</small></p></div><div><span><AppIcon name="check" size={15}/></span><p><strong>Úsala en computador o celular</strong><small>La aplicación web también se puede instalar en dispositivos compatibles.</small></p></div></div><button type="button" className="landing-secondary-button" onClick={onSignup}>Crear mi espacio <span aria-hidden="true">→</span></button></div></section>

    <section className="landing-pricing section-wrap" id="planes"><div className="landing-section-intro"><span className="landing-kicker">PLANES CLAROS</span><h2>Un espacio para empezar.<br /><em>Otro para crecer.</em></h2><p>Dos opciones sencillas; puedes comenzar con lo esencial y elegir la que mejor encaje contigo.</p></div><div className="landing-plan-grid">
      <article className="landing-plan-card"><div className="landing-plan-icon"><AppIcon name="sprout" size={25}/></div><span className="landing-plan-label">PARA EMPEZAR</span><h3>Emprende</h3><p>Ordena el día a día de tu negocio y gana claridad sobre lo que entra, sale y tienes disponible.</p><ul><li><AppIcon name="check" size={16}/> Productos e inventario</li><li><AppIcon name="check" size={16}/> Ventas, gastos y cuentas</li><li><AppIcon name="check" size={16}/> Clientes y proveedores</li><li><AppIcon name="check" size={16}/> Acceso desde computador o celular</li></ul><button type="button" className="landing-secondary-button" onClick={onSignup}>Empezar con Emprende <span>→</span></button></article>
      <article className="landing-plan-card landing-plan-featured"><div className="landing-plan-icon"><AppIcon name="chart-no-axes-combined" size={25}/></div><span className="landing-plan-label">PARA DAR EL SIGUIENTE PASO</span><h3>Negocio</h3><p>Más visibilidad sobre tu operación para crecer con un equipo y tomar decisiones con contexto.</p><ul><li><AppIcon name="check" size={16}/> Todo lo de Emprende</li><li><AppIcon name="check" size={16}/> Cotizaciones y catálogo compartible</li><li><AppIcon name="check" size={16}/> Estadísticas y rentabilidad</li><li><AppIcon name="check" size={16}/> Equipo, permisos y controles</li></ul><button type="button" className="landing-primary-button" onClick={onSignup}>Elegir Negocio <span>→</span></button></article>
    </div><p className="landing-pricing-note">Estamos preparando el lanzamiento comercial. La prueba y las condiciones del plan se confirmarán antes de activar cualquier cobro; crear la cuenta no supone un pago automático.</p></section>

    <section className="landing-import-section" id="importar"><div className="section-wrap landing-import-inner"><div className="landing-import-icon"><AppIcon name="file-spreadsheet" size={28}/></div><div><span className="landing-kicker">¿YA TIENES TU INVENTARIO?</span><h2>Trae tus datos contigo.</h2><p>Puedes cargar una plantilla Excel/CSV desde la aplicación para empezar con tus referencias, precios, costos y existencias sin digitarlas una por una.</p></div><button type="button" className="landing-secondary-button" onClick={onSignup}>Ver cómo empezar <span>→</span></button></div></section>

    <section className="landing-final-cta"><div className="landing-final-mark"><img src="/symbol-treseiscinco.svg" alt="treseiscinco"/></div><span className="landing-kicker">TU NEGOCIO, TODOS LOS DÍAS</span><h2>Que los números te ayuden.<br /><em>Que no te enreden.</em></h2><p>Empieza con lo que tienes hoy y construye un negocio más ordenado, paso a paso.</p><div className="landing-hero-actions"><button type="button" className="landing-primary-button" onClick={onSignup}>Crear cuenta gratis <span aria-hidden="true">→</span></button><button type="button" className="landing-secondary-button" onClick={onLogin}>Ya tengo cuenta</button></div></section>

    <footer className="landing-footer"><a className="landing-footer-brand" href="/"><img src="/symbol-treseiscinco.svg" alt=""/><strong>treseiscinco</strong></a><span>Tu negocio, todos los días.</span><nav><a href="#planes">Planes y precios</a><a href="#importar">Importar inventario</a><a href="/ayuda">¿Necesitas ayuda?</a><a href="/contacto">Soporte y contacto</a></nav><small>© {new Date().getFullYear()} treseiscinco. Tu negocio, tus datos.</small></footer>
  </main>;
}



const publicHelpArticles = [
  {category:"Primeros pasos",title:"¿Cómo empiezo a usar treseiscinco?",summary:"Crea tu cuenta, configura lo esencial y registra el primer artículo.",steps:["Crea una cuenta con un correo al que puedas acceder e inicia sesión.","Completa el nombre de tu negocio y revisa Configuración: moneda, datos comerciales y apariencia.","Abre Productos para registrar tus artículos. Después podrás añadir clientes, ventas, compras y gastos.","Vuelve a Inicio para revisar los indicadores de los movimientos que registres."],tip:"Usa tus datos reales desde el principio. Los indicadores no se rellenan con ventas ni gastos de ejemplo.",keywords:"crear registro cuenta negocio inicio empezar configurar"},
  {category:"Cuenta y acceso",title:"¿Cómo recupero mi contraseña?",summary:"Usa la opción de recuperación desde la pantalla de acceso.",steps:["En la pantalla de acceso, elige «Olvidé mi contraseña».","Escribe el correo asociado a tu cuenta y solicita el enlace de recuperación.","Revisa la bandeja de entrada y la carpeta de correo no deseado; abre el enlace y define una contraseña nueva.","Regresa a treseiscinco e inicia sesión con la contraseña nueva."],tip:"No compartas enlaces de recuperación, contraseñas ni códigos de verificación.",keywords:"contraseña olvidé recuperar restablecer login entrar acceso"},
  {category:"Productos e inventario",title:"¿Cómo registro o edito un producto?",summary:"Crea una ficha con su código, precio, costo, existencias y visibilidad en el catálogo.",steps:["Abre Productos y pulsa «Agregar artículo».","Escribe el nombre y elige el tipo. En «Código del artículo» selecciona «Generarlo automáticamente» o «Lo escribiré yo». Esa elección se aplica también a los códigos de variante.","Completa categoría, unidad, precio de venta, costo, impuesto y presentación cuando correspondan. Para productos físicos, indica las existencias si no vas a controlar el stock por combinaciones de variantes.","«Mostrar en el catálogo público» viene marcado por defecto. Déjalo marcado para ofrecer el artículo en el catálogo o desmárcalo si debe quedar solo para uso interno.","Guarda el artículo. Para cambiarlo después, abre Productos y pulsa la acción de edición de su ficha."],tip:"El precio y el costo son datos diferentes. El costo es interno y no se muestra en el catálogo público; la publicación no expone existencias internas.",keywords:"producto artículo sku código automático manual precio costo unidad existencias catálogo publicar editar"},
  {category:"Productos e inventario",title:"¿Cómo crear un paquete de productos con descuento?",summary:"Agrupa productos que se venden juntos y define un precio especial sin cambiar los precios individuales.",steps:["Abre Productos y pulsa «Agregar artículo».","Primero completa los datos normales del artículo: nombre, tipo, precio, costo y demás campos necesarios.","Al final del formulario, justo antes de «Guardar producto», encontrarás «Crear un paquete con precio especial». Actívalo para mostrar la configuración del paquete.","Elige al menos dos productos existentes y define la cantidad de cada uno. Después introduce el descuento fijo y revisa el subtotal y el precio final.","Guarda el paquete. Al venderlo, el sistema descuenta del inventario las cantidades correspondientes de los productos incluidos."],tip:"El descuento solo afecta al paquete. Las ventas de cada producto por separado conservan su precio normal; no pongas el precio del paquete en cada artículo por separado.",keywords:"paquete paquetes conjunto combo kit descuento productos vender juntos precio especial inventario crear paquete botón formulario guardar"},
  {category:"Productos e inventario",title:"¿Cómo agregar variantes al crear un producto?",summary:"Configura opciones sencillas o combinaciones reales como color + talla, con código y existencias por combinación.",steps:["En Productos, pulsa «Agregar artículo» y elige si el código del producto se genera automáticamente o si lo escribirás tú. Esa elección también se aplica a los códigos de variante.","En «Variantes (opcional)», completa el atributo 1 y su valor, por ejemplo Color: Rojo. Puedes completar atributo 2 y valor 2, por ejemplo Talla: S, para crear una combinación exacta.","En los productos físicos, registra las existencias de esa combinación, aunque sean cero. Cada fila tiene su propio stock; no se comparte con otras tallas o colores. Puedes asignar precio propio y, si elegiste códigos manuales, un código de variante.","Pulsa «Añadir combinación» para cada combinación que realmente manejas; por ejemplo Rojo/S = 2, Rojo/L = 1 y Negro/S = 1. Pulsa «Editar» si necesitas corregir una fila antes de guardar.","Guarda el producto. Más adelante puedes abrir «Variantes» en la ficha para editar valores, códigos, precios, fotos o existencias. Al vender, elige la combinación exacta y el sistema descuenta su stock."],tip:"No guardes el total de todas las tallas en el producto principal. Reparte las unidades entre sus combinaciones para evitar vender una talla agotada.",keywords:"variantes combinaciones crear producto talla color stock existencias sku código automático manual edición inventario"},
  {category:"Productos e inventario",title:"¿Cómo ajustar existencias y registrar el motivo?",summary:"Cada ajuste manual debe tener una cantidad y un motivo seleccionable.",steps:["Abre Productos, entra a la ficha del artículo y ve a la sección «Existencias».","Escribe una cantidad positiva para sumar unidades o negativa para restarlas.","En «Motivo», selecciona Compra (ajuste manual), Daño, Conteo físico, Devolución, Pérdida o robo, Uso interno, Ajuste inicial, Corrección de registro u Otro.","Si seleccionas «Otro», describe la razón y pulsa «Guardar ajuste».","Revisa el historial de movimientos para confirmar el cambio."],tip:"Cuando quieras registrar una compra completa con proveedor, costos y pagos, usa el módulo Compras. El ajuste manual sirve para corregir cantidades.",keywords:"inventario existencias motivo ajuste stock daño conteo físico compra devolución pérdida robo"},
  {category:"Productos e inventario",title:"¿Cómo importo muchos productos desde Excel o CSV?",summary:"La importación carga una plantilla con varias referencias.",steps:["En Productos, abre «Importar / exportar» o «Importar inventario», según el dispositivo.","Descarga la plantilla Excel o CSV y completa sus columnas sin cambiar los encabezados.","Sube el archivo .xls, .xlsx o .csv. La importación admite hasta 500 artículos por archivo.","Revisa el resultado y abre algunos productos para comprobar nombres, precios y cantidades."],tip:"La fila de muestra se omite al importar. Conserva una copia del archivo por si necesitas corregirlo.",keywords:"excel importar cargar csv plantilla inventario masivo archivo"},
  {category:"Productos e inventario",title:"¿Qué diferencia hay entre stock, mínimo y sin stock?",summary:"Las existencias muestran unidades actuales; el mínimo ayuda a anticipar reposiciones.",steps:["En Productos, revisa las existencias de cada artículo.","Define un mínimo de reposición en la ficha cuando quieras anticipar una alerta.","Usa el filtro de inventario para consultar los productos activos, con stock bajo o agotados.","Si un producto tiene variantes, revisa las existencias por talla, color u otra opción."],tip:"Los servicios o productos sin control de inventario pueden estar habilitados para la venta sin mostrar cantidades físicas.",keywords:"stock existencia unidades disponibles agotado reposición mínimo variantes"},
  {category:"Productos e inventario",title:"¿Cómo asigno impuestos a varios productos?",summary:"La asignación masiva guarda la tarifa para los artículos seleccionados.",steps:["En Productos, abre «Asignar impuesto a varios productos».","Selecciona la tarifa aplicable y busca productos por nombre o código.","Marca los artículos correspondientes y pulsa «Aplicar impuesto a seleccionados».","Abre una ficha para comprobar que se guardó la tarifa esperada."],tip:"IVA e impuesto al consumo son impuestos del producto. Retefuente, ReteIVA y ReteICA son retenciones distintas.",keywords:"impuesto IVA impoconsumo retefuente reteiva reteica tarifa"},
  {category:"Ventas y dinero",title:"¿Cómo registro una venta?",summary:"Una venta reúne artículos, cantidades, datos opcionales del cliente y dinero recibido.",steps:["Abre Ventas y pulsa «Registrar venta».","Añade productos y cantidades; revisa precio, impuesto y total antes de guardar.","Relaciona un cliente si lo necesitas y registra el abono inicial, medio de pago y notas.","Guarda la venta y revisa el registro y el saldo pendiente, si no se pagó todo."],tip:"El sistema comprueba las existencias controladas al registrar una venta. Revisa las cantidades antes de confirmar.",keywords:"vender venta carrito productos cantidades cliente cobrar registrar"},
  {category:"Ventas y dinero",title:"¿Cómo registro un abono y reviso un saldo pendiente?",summary:"Un abono registra dinero recibido; el saldo muestra cuánto queda por cobrar o pagar.",steps:["Abre la venta o la sección de Cuentas para localizar el registro.","Revisa el total original, los abonos guardados y el saldo actual.","Registra el nuevo abono desde la opción disponible y confirma fecha y medio de pago.","Vuelve a comprobar el estado de la cuenta."],tip:"Un valor por cobrar no es dinero recibido. Mantenlo separado de los ingresos realmente cobrados.",keywords:"abono abonar pago saldo pendiente cobrar cuenta deuda"},
  {category:"Compras y gastos",title:"¿Cómo registro una compra de inventario?",summary:"Anota lo que compraste, el proveedor y el pago correspondiente.",steps:["Abre Compras y elige la acción para registrar una compra.","Añade los artículos o conceptos, las cantidades y el costo unitario; selecciona proveedor si aplica.","Revisa el total, la fecha, el pago realizado y el saldo por pagar.","Guarda y comprueba el movimiento y las existencias, si la compra quedó vinculada al inventario."],tip:"Una compra de inventario no es lo mismo que un gasto de funcionamiento. Evita registrarla dos veces.",keywords:"compra proveedor inventario costo existencias factura compras pagada"},
  {category:"Compras y gastos",title:"¿Cómo registro un gasto del negocio?",summary:"Registra salidas como transporte, servicios y materiales de consumo.",steps:["Abre Compras y gastos y selecciona la sección de gastos.","Pulsa «Nuevo gasto» y escribe una descripción clara, categoría, fecha e importe.","Selecciona el medio de pago y añade proveedor o notas cuando sea útil.","Guarda el movimiento y comprueba que aparezca en el listado y en el periodo correspondiente."],tip:"Registra cada salida una sola vez; no dupliques una compra que ya quedó contabilizada en otro movimiento.",keywords:"gasto egreso salida dinero categoría transporte servicios pago"},
  {category:"Informes y rentabilidad",title:"¿Cómo uso los gráficos de Inicio, Rentabilidad y Estadísticas?",summary:"Cambia entre pastel, barras y área para ver distribuciones, comparaciones y evolución de los movimientos registrados.",steps:["En Inicio, elige el periodo (hoy, semana, mes, trimestre, semestre o año).","Usa el selector para mostrar un solo gráfico: Pastel para distribución, Barras para comparar importes o Área para observar la evolución en el tiempo.","En Rentabilidad y Planificación puedes elegir Pastel, Barras o Área. Se muestra solo el tipo elegido; el gráfico de área mantiene una altura fija para que sea legible en escritorio y móvil.","En Estadísticas y balance, usa Pastel, Barras o Área y elige el periodo correspondiente.","Si un gráfico aparece vacío, comprueba las fechas, los permisos de tu usuario y si hay movimientos registrados en ese periodo."],tip:"Los gráficos se basan en datos del negocio activo. La meta de crecimiento de Planificación es una simulación; no representa dinero ya recibido.",keywords:"gráficos pastel barras área inicio ingresos compras gastos rentabilidad planificación estadísticas reportes evolución"},
  {category:"Informes y rentabilidad",title:"¿Qué significa el resultado en Rentabilidad?",summary:"La pantalla compara ventas, costos de artículos vendidos y gastos registrados.",steps:["En Finanzas, abre Rentabilidad y selecciona el periodo o rango de fechas.","Revisa ventas registradas y costo de lo vendido usando los costos guardados en los productos o ventas.","La ganancia bruta estimada compara el ingreso con el costo registrado de los artículos vendidos.","Los gastos registrados se tienen en cuenta para obtener el resultado estimado; revisa los gráficos y desgloses."],tip:"El cálculo depende de que los costos y gastos estén registrados. No incluye movimientos que aún no hayas anotado ni reemplaza una revisión contable.",keywords:"rentabilidad utilidad margen ganancia costo venta resultado ingresos gastos gráfico pastel"},
  {category:"Informes y rentabilidad",title:"¿Cómo leo Estadísticas y el balance?",summary:"Consulta las cifras por periodo y distingue dinero recibido de valores pendientes.",steps:["Abre Estadísticas y selecciona el periodo que quieres analizar.","Revisa ingresos cobrados, gastos y compras pagadas, junto con los desgloses disponibles.","Consulta el detalle para identificar qué movimientos componen una cifra.","Si un valor parece incorrecto, comprueba la fecha y el estado del movimiento original."],tip:"Ventas pendientes de cobro no equivalen a dinero que ya entró en caja.",keywords:"estadísticas balance gráficos periodo ventas ingresos gastos compras total"},
  {category:"Clientes y proveedores",title:"¿Cómo creo, busco y utilizo la ficha de un cliente?",summary:"Guarda una sola ficha por persona o empresa para encontrar sus datos y relacionar sus compras.",steps:["Abre Clientes. Justo después del cuadro de búsqueda encontrarás la ayuda de esta sección; puedes mantenerla abierta mientras completas el formulario.","Pulsa «Nuevo cliente». Registra el nombre y apellidos si es una persona. Si es una empresa, escribe su razón social en «Empresa»; basta con completar el nombre de la persona o la empresa para poder guardar.","Añade los datos que tengas: correo, teléfono, WhatsApp, ciudad y dirección. Documento y notas son opcionales. «Asesora habitual» también es opcional y sirve para indicar de qué asesora proviene normalmente la clienta.","Pulsa «Guardar cliente». Después, usa el cuadro de búsqueda para localizar la ficha por nombre, empresa, documento o contacto; abre la fila para ver el detalle y elige «Editar cliente» si necesitas corregir algún dato.","Para asociarlo a una venta o cotización, abre el desplegable «Cliente» y elige el registro existente. Para crear una ficha sin salir del formulario, selecciona «＋ Agregar» dentro de ese desplegable y guarda y selecciona la nueva ficha."],tip:"Antes de crear una ficha nueva, busca primero el nombre o teléfono para reducir duplicados. Asociar una ficha a una venta existente no requiere registrar otra venta.",keywords:"cliente clientes comprador contacto empresa agregar crear buscar editar relacionar venta cotización asesora habitual documento telefono whatsapp"},
  {category:"Clientes y proveedores",title:"¿Dónde administro los proveedores?",summary:"Proveedores es un módulo propio para consultar y mantener esos registros.",steps:["Abre Proveedores en el menú principal.","Crea o edita los datos del proveedor disponibles.","Selecciona el proveedor en compras o gastos cuando quieras dejar constancia de su origen."],tip:"Mantener los nombres consistentes facilita encontrar registros y revisar movimientos.",keywords:"proveedor proveedores suministrador compras gastos contacto"},
  {category:"Ventas y catálogo",title:"¿Cómo imprimir una cotización en tamaño carta?",summary:"Usa la salida PDF/impresión para obtener una propuesta vertical con el formato de los documentos de venta.",steps:["Abre Cotizaciones desde el menú lateral.","Despliega «Ver detalles» de la cotización correspondiente.","Pulsa «PDF / Imprimir» para abrir el documento y escoger «Carta» como tamaño de papel y orientación vertical en el diálogo de impresión.","Si prefieres enviarla como imagen, pulsa «Compartir imagen»: se genera una imagen vertical en proporción carta."],tip:"Si la vista previa muestra media carta, comprueba la opción de papel del diálogo de impresión. La impresión HTML y la imagen compartida son salidas distintas.",keywords:"cotización imprimir PDF papel carta media carta vertical compartir imagen factura"},
  {category:"Clientes y proveedores",title:"¿Cómo agregar una clienta desde una venta o cotización?",summary:"Puedes crear la ficha sin salir del formulario donde estás trabajando.",steps:["Al crear una venta o cotización, abre el desplegable «Cliente».","Selecciona «＋ Agregar» dentro de la lista.","Completa los datos básicos y pulsa «Guardar y seleccionar»; el cliente quedará asociado a la operación."],tip:"En Clientes, «Asesora habitual» es opcional y sirve para registrar de qué asesora proviene normalmente la clienta.",keywords:"clientes agregar desde lista desplegable venta cotización asesora habitual opcional"},
  {category:"Ventas y catálogo",title:"¿Cómo previsualizar y compartir una factura o venta?",summary:"Revisa el documento en pantalla antes de compartirlo o descargarlo como imagen.",steps:["Abre Ventas y busca la operación que deseas compartir.","Pulsa «Compartir imagen» para preparar una vista previa con el logo y los colores del negocio.","Revisa la factura. Pulsa «Volver» para cerrar la vista previa, «Descargar imagen» para adjuntarla manualmente o «Enviar / compartir» para abrir las opciones del dispositivo o navegador.","Para imprimir o guardar en PDF, usa «Factura / PDF / Imprimir» y elige Carta y orientación vertical en el diálogo de impresión."],tip:"La opción de compartir archivos depende del navegador o dispositivo. Si no permite compartir directamente, descarga la imagen desde la vista previa y adjúntala al mensaje.",keywords:"factura ventas compartir imagen vista previa enviar whatsapp imprimir pdf carta"},
  {category:"Ventas y catálogo",title:"¿Cómo preparo una cotización?",summary:"Prepara y comparte una propuesta antes de registrar una venta.",steps:["Abre Cotizaciones desde el menú lateral.","Crea una propuesta y añade cliente, conceptos, cantidades y precios según necesites.","Revisa el total y guarda la cotización.","Consulta su estado para continuar el seguimiento."],tip:"Comprueba los precios y la vigencia antes de compartir la propuesta con el cliente.",keywords:"cotización cotizaciones propuesta presupuesto cliente oferta"},
  {category:"Ventas y catálogo",title:"¿Cómo personalizo la dirección corta y decido qué publicar en mi catálogo?",summary:"La dirección que escribes en «Dirección corta de tu catálogo» es la misma que se usa para abrir el catálogo público.",steps:["Abre el módulo Catálogo y localiza «ENLACE PÚBLICO» → «Dirección corta de tu catálogo».","Escribe el nombre que quieres compartir. Usa letras sin tildes, números y guiones. Al guardar, ese mismo nombre se utiliza en el enlace https://treseiscinco.com/tu-nombre; no tienes que crear otra dirección en otro módulo.","Al crear o editar un producto, deja marcado «Mostrar en el catálogo público» para publicarlo. El control viene activado por defecto; desmárcalo si quieres mantener el producto solo en el inventario interno.","El catálogo muestra únicamente productos activos y publicados. Los costos y las existencias internas no se publican.","Copia el enlace desde Catálogo y ábrelo como visitante para comprobar el nombre, las fotos, la descripción y los precios que verán tus clientes."],tip:"Si cambias la dirección corta, comparte el enlace nuevo. Antes de publicar un artículo, verifica que su precio, fotos y descripción estén actualizados.",keywords:"catálogo link enlace público dirección corta alias url slug nombre publicar ocultar producto checkbox activo precio fotos"},
  {category:"Ventas y catálogo",title:"¿Cómo funcionan los cupones de descuento?",summary:"Los cupones permiten definir promociones con condiciones y vigencia.",steps:["Abre Cupones de descuento.","Crea el código y completa las condiciones, fechas y límites que permita el formulario.","Guarda la promoción y comprueba los detalles antes de compartirla."],tip:"Explica las condiciones del descuento y comprueba que el cupón siga vigente.",keywords:"cupón cupones descuento promoción código oferta"},
  {category:"Equipo y permisos",title:"¿Cómo agrego trabajadores y limito sus permisos?",summary:"Cada persona puede tener acceso solo a los módulos que necesita.",steps:["Abre Equipo y permisos o Trabajadores, según las opciones de tu cuenta.","Agrega la persona e indica el rol o los permisos que necesita.","Guarda los cambios y revisa qué módulos puede abrir esa cuenta."],tip:"Concede solo los permisos necesarios. La información de un negocio debe permanecer separada de la de otros negocios.",keywords:"trabajadores empleados equipo permisos roles acceso subusuarios"},
  {category:"Configuración",title:"¿Cómo cambio moneda, logo o colores?",summary:"La configuración reúne datos comerciales y personalización de la aplicación.",steps:["Abre Configuración desde el menú.","Actualiza los campos disponibles, los datos comerciales, el logo y los colores.","Guarda los cambios y regresa a Inicio para comprobar la apariencia."],tip:"Lee las advertencias antes de cambiar la moneda, especialmente si ya registraste operaciones.",keywords:"configuración moneda logo colores apariencia empresa nombre negocio"},
  {category:"Ayuda y problemas",title:"¿Para qué sirve la IA de treseiscinco?",summary:"El asistente puede contestar preguntas en lenguaje natural con los datos permitidos.",steps:["Abre el botón «IA» dentro de la aplicación.","Escribe una pregunta concreta, como «¿qué productos debo reponer?» o «resume mis ventas de este mes».","Revisa el periodo y los movimientos implicados si necesitas validar la respuesta."],tip:"La IA no debe inventar cifras. Si no puede consultar un dato o no está registrado, te lo indicará.",keywords:"inteligencia artificial asistente preguntar resumen análisis datos"},
  {category:"Ayuda y problemas",title:"¿Para qué sirven los iconos de ayuda?",summary:"La ayuda contextual explica el campo o formulario que estás utilizando.",steps:["Busca el icono «?» junto a un campo o formulario.","Tócalo para leer la explicación y los pasos sugeridos.","Cierra la ayuda y continúa con el formulario."],tip:"También puedes buscar dudas en esta guía completa.",keywords:"ayuda contextual icono signo pregunta campo formulario cómo usar"},
  {category:"Aplicación móvil",title:"¿Tengo que reinstalar la APK cuando se actualiza la app?",summary:"Las mejoras normales de la interfaz se publican centralmente.",steps:["Abre treseiscinco con conexión a internet.","Si no ves un cambio recién publicado, cierra la app y vuelve a abrirla para cargar la versión web actual.","Si sigue sin aparecer, comprueba el sitio treseiscinco.com desde el navegador del celular para comparar."],tip:"Las actualizaciones normales del sitio no deberían requerir instalar otra APK. Una actualización del contenedor Android o de permisos del dispositivo sí podría necesitar una nueva versión.",keywords:"celular móvil Android APK reinstalar actualizar actualización app"},
  {category:"Ayuda y problemas",title:"¿Qué hago si una pantalla no carga o aparece un error?",summary:"Comprueba la conexión y el estado del registro antes de repetir una operación.",steps:["Comprueba que tengas una conexión estable y vuelve a cargar la pantalla.","Cierra y abre treseiscinco. Si la sesión expiró, inicia sesión de nuevo.","Antes de repetir una venta, compra o gasto, comprueba si el primer intento quedó registrado para evitar duplicados.","Si persiste, usa Contacto e indica la sección, los pasos y el mensaje de error."],tip:"Nunca envíes tu contraseña ni códigos de verificación en un mensaje de soporte.",keywords:"error fallo no carga problema guardado sesión internet duplicado soporte"},
  {category:"Datos y seguridad",title:"¿Mis datos se mezclan con los de otros negocios?",summary:"La aplicación separa la información por negocio y respeta los permisos de la cuenta.",steps:["Selecciona el negocio correcto si tu cuenta tiene acceso a más de uno.","Revisa los permisos si una sección no aparece.","Si ves un dato que no reconoces, no lo modifiques de inmediato: anota el movimiento y contacta a soporte."],tip:"No compartas tu contraseña. El equipo de soporte no necesita tu clave para investigar un problema.",keywords:"privacidad seguridad datos negocios permisos contraseña"}
];

function PublicUtilityHeader({ active }) {
  return <header className="public-utility-header">
    <a className="public-utility-brand" href="/" aria-label="treseiscinco, inicio"><img src="/brand-treseiscinco.svg" alt="treseiscinco" /></a>
    <nav className="public-utility-nav" aria-label="Navegación de soporte">
      <a href="/">Inicio</a>
      <a href="/ayuda" className={active === "help" ? "is-active" : ""} aria-current={active === "help" ? "page" : undefined}>¿Necesitas ayuda?</a>
      <a href="/contacto" className={active === "contact" ? "is-active" : ""} aria-current={active === "contact" ? "page" : undefined}>Contacto</a>
    </nav>
  </header>;
}

function PublicUtilityFooter() {
  return <footer className="landing-footer public-utility-footer">
    <a className="landing-footer-brand" href="/"><img src="/symbol-treseiscinco.svg" alt="" /><strong>treseiscinco</strong></a>
    <span>Tu negocio, todos los días.</span>
    <nav><a href="/">Inicio</a><a href="/ayuda">¿Necesitas ayuda?</a><a href="/contacto">Contacto</a></nav>
    <small>© {new Date().getFullYear()} treseiscinco. Tu negocio, tus datos.</small>
  </footer>;
}

function PublicContactPage() {
  const [form, setForm] = useState({ name:"", email:"", category:"Uso de la app", message:"", website:"" });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const fallbackMailBody = [
    "Hola, equipo de soporte de treseiscinco.",
    "",
    "Nombre: " + form.name,
    "Correo de respuesta: " + form.email,
    "Tema: " + form.category,
    "",
    "Mensaje:",
    (form.message || "").slice(0, 1200) + (form.message.length > 1200 ? "\n\n[El mensaje se ha abreviado. Vuelve a copiarlo completo desde el formulario si hace falta.]" : "")
  ].join("\n");
  const fallbackMailto = "mailto:hola.treseiscinco@gmail.com?subject=" + encodeURIComponent("[treseiscinco] " + form.category + " — " + form.name) + "&body=" + encodeURIComponent(fallbackMailBody);

  async function submitContact(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice(""); setError("");
    try {
      const response = await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) throw new Error(result.error || "No pudimos enviar el mensaje. Inténtalo de nuevo.");
      setNotice(result.message || "Gracias. Tu mensaje se envió al equipo de soporte.");
      setForm({ name:"", email:"", category:"Uso de la app", message:"", website:"" });
    } catch (submitError) {
      setError(submitError?.message || "No pudimos enviar el mensaje ahora. Inténtalo de nuevo.");
    } finally { setBusy(false); }
  }

  return <main className="public-landing public-utility-page">
    <PublicUtilityHeader active="contact" />
    <section className="public-utility-hero">
      <span className="landing-kicker">ESTAMOS PARA AYUDARTE</span>
      <h1>Hablemos de tu negocio.</h1>
      <p>Cuéntanos qué necesitas. El formulario está dentro de treseiscinco: no tendrás que abrir Outlook ni ninguna otra aplicación de correo.</p>
    </section>
    <section className="public-contact-layout">
      <form className="public-contact-form" onSubmit={submitContact}>
        <div className="public-contact-form-title"><span className="landing-kicker">CONTACTO Y SOPORTE</span><h2>Envíanos un mensaje</h2><p>Completa los campos y pulsa enviar. Te responderemos al correo que dejes aquí.</p></div>
        {notice && <div className="public-contact-alert is-success" role="status">{notice}</div>}
        {error && <div className="public-contact-alert is-error" role="alert"><p>{error}</p><p>Para no dejarte sin soporte, también puedes enviar el mensaje desde la aplicación de correo del dispositivo.</p><a className="public-contact-fallback-link" href={fallbackMailto}>Abrir correo y enviar manualmente <span aria-hidden="true">↗</span></a></div>}
        <label><span>Tu nombre *</span><input name="name" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm((v) => ({...v,name:e.target.value}))} placeholder="Nombre y apellido" /></label>
        <label><span>Correo electrónico *</span><input type="email" name="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(e) => setForm((v) => ({...v,email:e.target.value}))} placeholder="tunombre@correo.com" /></label>
        <label><span>¿Sobre qué nos escribes? *</span><select name="category" value={form.category} onChange={(e) => setForm((v) => ({...v,category:e.target.value}))}><option>Uso de la app</option><option>Problema técnico</option><option>Cuenta y acceso</option><option>Inventario, ventas o gastos</option><option>Sugerencia</option><option>Otro</option></select></label>
        <label><span>Cuéntanos en qué podemos ayudarte *</span><textarea name="message" required minLength={10} maxLength={4000} rows={6} value={form.message} onChange={(e) => setForm((v) => ({...v,message:e.target.value}))} placeholder="Describe tu duda o el problema que encontraste…" /></label>
        <label className="public-contact-honeypot" aria-hidden="true" tabIndex={-1}>Sitio web<input name="website" value={form.website} tabIndex={-1} autoComplete="off" onChange={(e) => setForm((v) => ({...v,website:e.target.value}))} /></label>
        <p className="public-contact-privacy">Usaremos estos datos para atender tu solicitud. No escribas contraseñas ni códigos de verificación.</p>
        <button className="landing-primary-button public-contact-submit" type="submit" disabled={busy}>{busy ? "Enviando mensaje…" : "Enviar mensaje"} <span aria-hidden="true">→</span></button>
      </form>
      <aside className="public-contact-side">
        <div className="public-contact-side-icon" aria-hidden="true">✉</div>
        <h2>Tu mensaje llega a soporte.</h2>
        <p>Incluye la sección y los pasos que estabas siguiendo para que podamos entender mejor tu duda.</p>
        <div className="public-contact-side-row"><span aria-hidden="true">✓</span><span>Sin abrir aplicaciones de correo externas.</span></div>
        <div className="public-contact-side-row"><span aria-hidden="true">✓</span><span>Envía una explicación clara y tu correo de respuesta.</span></div>
        <div className="public-contact-side-links"><strong>¿Prefieres encontrar la respuesta ahora?</strong><a href="/ayuda">Busca en «¿Necesitas ayuda?» <span aria-hidden="true">↗</span></a></div>
      </aside>
    </section>
    <PublicUtilityFooter />
  </main>;
}

function PublicHelpPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  const categories = ["Todas", ...new Set(publicHelpArticles.map((article) => article.category))];
  const filtered = publicHelpArticles.filter((article) => {
    if (category !== "Todas" && article.category !== category) return false;
    if (!normalizedQuery) return true;
    const searchable = [article.category, article.title, article.summary, article.keywords, ...article.steps, article.tip].join(" ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return normalizedQuery.split(/\s+/).filter(Boolean).every((word) => searchable.includes(word));
  });
  return <main className="public-landing public-utility-page">
    <PublicUtilityHeader active="help" />
    <section className="public-utility-hero public-help-hero">
      <span className="landing-kicker">CENTRO DE AYUDA · TRESEISCINCO</span>
      <h1>¿Necesitas ayuda?</h1>
      <p>Busca una pregunta, explora por tema y sigue los pasos para usar las herramientas de tu negocio.</p>
      <label className="public-help-search"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busca productos, ventas, gastos, stock, permisos…" aria-label="Buscar en la ayuda" /><kbd>Buscar</kbd></label>
      <p className="public-help-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? "guía encontrada" : "guías encontradas"}</p>
    </section>
    <section className="public-help-content">
      <nav className="public-help-categories" aria-label="Filtrar guías por tema">
        {categories.map((item) => <button type="button" key={item} className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </nav>
      {filtered.length ? <div className="public-help-list">{filtered.map((article) => <details key={article.title} className="public-help-article">
        <summary><span className="public-help-article-meta">{article.category}</span><strong>{article.title}</strong><small>{article.summary}</small><span className="public-help-article-toggle" aria-hidden="true">＋</span></summary>
        <div className="public-help-article-body"><h3>Cómo hacerlo</h3><ol>{article.steps.map((step, index) => <li key={index}>{step}</li>)}</ol><div className="public-help-tip"><strong>Consejo útil</strong><p>{article.tip}</p></div><button type="button" className="public-help-contact-link" onClick={() => { window.location.href = "/contacto"; }}>¿No resolvimos tu duda? Contacta a soporte <span aria-hidden="true">→</span></button></div>
      </details>)}</div> : <div className="public-help-empty"><span aria-hidden="true">⌕</span><h2>No encontramos esa respuesta</h2><p>Prueba con otras palabras o cambia el tema seleccionado.</p><button type="button" className="landing-secondary-button" onClick={() => { setQuery(""); setCategory("Todas"); }}>Mostrar todas las guías</button><a href="/contacto">Enviar una pregunta a soporte</a></div>}
    </section>
    <section className="public-help-contact-strip"><div><span className="landing-kicker">¿TE FALTA UNA RESPUESTA?</span><h2>Estamos para ayudarte.</h2><p>Cuéntanos qué estabas intentando hacer y te orientaremos.</p></div><a className="landing-primary-button" href="/contacto">Contactar soporte <span aria-hidden="true">→</span></a></section>
    <PublicUtilityFooter />
  </main>;
}


function AuthenticatedApp() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState("login");
  const [showPublicLanding, setShowPublicLanding] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [activeBusiness, setActiveBusiness] = useState(null);
  const [screen, setScreen] = useState(() => {
    try {
      const remembered = window.sessionStorage.getItem("treseiscinco:last-screen");
      const allowedScreens = ["home","products","sales","quotes","customers","purchases","suppliers","stats","audit","catalog","settings","accounts","receivables","payables","banks","platform_admin","platform-admin","help"];
      if (remembered && allowedScreens.includes(remembered)) return remembered;
      const saved = window.history.state;
      return saved?.treseiscinco && typeof saved.screen === "string" ? saved.screen : "home";
    } catch { return "home"; }
  });
  const dirtyFormsRef = useRef(new WeakSet());
  const [statsChartType, setStatsChartType] = useState("bars");

  const [isPlatformAdmin, setIsPlatformAdmin] = useState(false);
  const [isPlatformAdminReady, setIsPlatformAdminReady] = useState(false);
  const [platformAdminData, setPlatformAdminData] = useState(null);
  const [platformAdminLoading, setPlatformAdminLoading] = useState(false);
  const [platformAdminSaving, setPlatformAdminSaving] = useState(false);
  const [platformAdminSearch, setPlatformAdminSearch] = useState("");
  const [platformPaymentBusiness, setPlatformPaymentBusiness] = useState("");
  const [platformPaymentDraft, setPlatformPaymentDraft] = useState({ interval: "month", amount: "", method: "Nequi", reference: "", notes: "" });
  const [platformAdminNote, setPlatformAdminNote] = useState("");
  const [platformAdminStatusDrafts, setPlatformAdminStatusDrafts] = useState({});
  const [platformAdminPeriodDrafts, setPlatformAdminPeriodDrafts] = useState({});
  const [businessSubscription, setBusinessSubscription] = useState(null);
  const [receivableRows, setReceivableRows] = useState([]);
  const [payableRows, setPayableRows] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsTab, setAccountsTab] = useState("receivables");
  const [accountsSearch, setAccountsSearch] = useState("");
  const [accountsStatusFilter, setAccountsStatusFilter] = useState("pending");
  const [accountsSort, setAccountsSort] = useState("newest");
  const [bankDashboard, setBankDashboard] = useState({ accounts: [], movements: [], movement_count: 0, summary: { account_count: 0, balance_minor: 0, income_month_minor: 0, expenses_month_minor: 0 } });
  const [bankDashboardBusinessId, setBankDashboardBusinessId] = useState(null);
  const bankDashboardRequestRef = useRef(0);
  const [bankAccountOptions, setBankAccountOptions] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankAccountFormOpen, setBankAccountFormOpen] = useState(false);
  const [bankEditingAccountId, setBankEditingAccountId] = useState(null);
  const [bankMovementFormOpen, setBankMovementFormOpen] = useState(false);
  const [bankTransferFormOpen, setBankTransferFormOpen] = useState(false);
  const [bankAccountDraft, setBankAccountDraft] = useState({ bank_name: "", account_name: "", account_type: "savings", account_last4: "", account_holder: "", opening_balance: "0", opening_balance_date: todayInBogota(), notes: "" });
  const [bankMovementDraft, setBankMovementDraft] = useState({ movement_type: "income", bank_account_id: "", amount: "", movement_date: todayInBogota(), description: "", category: "", counterparty: "", reference: "", notes: "" });
  const [bankTransferDraft, setBankTransferDraft] = useState({ from_account_id: "", to_account_id: "", amount: "", movement_date: todayInBogota(), description: "Transferencia entre cuentas propias", reference: "", notes: "" });
  const [bankMovementFilter, setBankMovementFilter] = useState("all");
  const [bankSearch, setBankSearch] = useState("");
  const [backupBusy, setBackupBusy] = useState(false);
  const [inventoryImportBusy, setInventoryImportBusy] = useState(false);
  const [inventoryImportProgress, setInventoryImportProgress] = useState("");
  const [inventoryDataMenuOpen, setInventoryDataMenuOpen] = useState(false);
  const inventoryDataTriggerRef = useRef(null);
  const inventoryDataMobileTriggerRef = useRef(null);
  const inventoryDataMenuRef = useRef(null);
  const [inventoryDataMenuPosition, setInventoryDataMenuPosition] = useState({ top: 12, left: 12, width: 560 });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [appInstalled, setAppInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [homeCreateMenuOpen, setHomeCreateMenuOpen] = useState(false);
  const homeCreateMenuRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    if (!inventoryDataMenuOpen) return;
    const reposition = () => {
      const isPhone = window.matchMedia("(max-width: 640px)").matches;
      const activeTrigger = isPhone
        ? (inventoryDataMobileTriggerRef.current || inventoryDataTriggerRef.current)
        : (inventoryDataTriggerRef.current || inventoryDataMobileTriggerRef.current);
      const anchor = activeTrigger?.getBoundingClientRect();
      if (!anchor) return;
      const width = Math.min(560, Math.max(280, window.innerWidth - 24));
      const left = Math.max(12, Math.min(anchor.right - width, window.innerWidth - width - 12));
      const estimatedHeight = 270;
      let top = anchor.bottom + 8;
      if (top + estimatedHeight > window.innerHeight - 12 && anchor.top > estimatedHeight + 12) {
        top = anchor.top - estimatedHeight - 8;
      }
      top = Math.max(12, Math.min(top, window.innerHeight - Math.min(estimatedHeight, window.innerHeight - 24) - 12));
      setInventoryDataMenuPosition({ top, left, width });
    };
    const closeOnOutside = (event) => {
      if (inventoryDataTriggerRef.current?.contains(event.target) || inventoryDataMobileTriggerRef.current?.contains(event.target) || inventoryDataMenuRef.current?.contains(event.target)) return;
      setInventoryDataMenuOpen(false);
    };
    const closeOnEscape = (event) => { if (event.key === "Escape") setInventoryDataMenuOpen(false); };
    reposition();
    document.addEventListener("pointerdown", closeOnOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [inventoryDataMenuOpen]);
  useEffect(() => {
    if (!homeCreateMenuOpen) return;
    const closeOnOutside = (event) => {
      if (!homeCreateMenuRef.current?.contains(event.target)) setHomeCreateMenuOpen(false);
    };
    const closeOnEscape = (event) => { if (event.key === "Escape") setHomeCreateMenuOpen(false); };
    document.addEventListener("pointerdown", closeOnOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [homeCreateMenuOpen]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkInstalled = () => Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true);
    setAppInstalled(checkInstalled());
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const onAppInstalled = () => {
      setAppInstalled(true);
      setInstallPrompt(null);
      setShowInstallGuide(false);
      if (session?.user?.id) {
        const userAgent = window.navigator.userAgent || "";
        const platform = /android/i.test(userAgent) ? "android" : /iphone|ipad|ipod/i.test(userAgent) ? "ios" : /windows/i.test(userAgent) ? "windows" : /macintosh|mac os/i.test(userAgent) ? "macos" : "web";
        supabase.rpc("record_platform_activity", { p_event: "pwa_installed", p_is_standalone: true, p_platform: platform }).then(({ error: activityError }) => { if (activityError) console.warn("No se pudo registrar la instalación PWA.", activityError); });
      }
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [session?.user?.id]);

  async function requestPwaInstall() {
    if (!installPrompt) {
      setShowInstallGuide((open) => !open);
      if (session?.user?.id) {
        const standalone = Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true);
        const userAgent = window.navigator.userAgent || "";
        const platform = /android/i.test(userAgent) ? "android" : /iphone|ipad|ipod/i.test(userAgent) ? "ios" : /windows/i.test(userAgent) ? "windows" : /macintosh|mac os/i.test(userAgent) ? "macos" : "web";
        supabase.rpc("record_platform_activity", { p_event: "install_help_opened", p_is_standalone: standalone, p_platform: platform }).then(({ error: activityError }) => { if (activityError) console.warn("No se pudo registrar la ayuda de instalación.", activityError); });
      }
      return;
    }
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice?.outcome === "accepted") {
        setAppInstalled(true);
        setShowInstallGuide(false);
      } else {
        setShowInstallGuide(true);
      }
    } catch {
      setShowInstallGuide(true);
    } finally {
      setInstallPrompt(null);
    }
  }

  const [sidebarEditing, setSidebarEditing] = useState(false);
  const [sidebarSaving, setSidebarSaving] = useState(false);
  const [sidebarConfirmSave, setSidebarConfirmSave] = useState(false);
  const [sidebarLayout, setSidebarLayout] = useState(defaultSidebarLayout);
  const [draggedSidebarItem, setDraggedSidebarItem] = useState(null);
  const [sidebarTouchDragging, setSidebarTouchDragging] = useState(false);
  const sidebarPreDragRef = useRef(null);
  const sidebarTouchRef = useRef(null);
  const sidebarLongPressTimerRef = useRef(null);
  const sidebarSuppressClickRef = useRef(false);
  const sidebarTouchHandlersRef = useRef({ move: null, end: null });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [productPageSize, setProductPageSize] = useState(12);
  const [showArchivedProducts, setShowArchivedProducts] = useState(false);
  const [productStockFilter, setProductStockFilter] = useState("all");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [inventoryOverview, setInventoryOverview] = useState({ productCount: 0, trackedUnits: 0, costMinor: 0, retailMinor: 0, outOfStockCount: 0, lowStockCount: 0 });
  const [inventoryOverviewLoading, setInventoryOverviewLoading] = useState(false);
  const [inventoryOverviewRefresh, setInventoryOverviewRefresh] = useState(0);
  const [homeSummary, setHomeSummary] = useState({ loading: false, todaySalesCount: 0, todaySalesMinor: 0, openQuotesCount: 0, error: "" });
  const [homeChartPeriod, setHomeChartPeriod] = useState("month");
  const [homeIncomeChartType, setHomeIncomeChartType] = useState("pie");
  const [homeSpendingChartType, setHomeSpendingChartType] = useState("bars");
  const [homePieData, setHomePieData] = useState({ loading: false, error: "", income: [], purchases: [], expenses: [], trends: [] });
  const [viewMode, setViewMode] = useState("cards");
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkProductRows, setBulkProductRows] = useState([]);
  const [bulkProductsLoading, setBulkProductsLoading] = useState(false);
  const [bulkProductsSaving, setBulkProductsSaving] = useState(false);
  const [bulkHistoryProduct, setBulkHistoryProduct] = useState(null);
  const [bulkHistoryRows, setBulkHistoryRows] = useState([]);
  const [bulkHistoryLoading, setBulkHistoryLoading] = useState(false);
  const [bulkHistoryCount, setBulkHistoryCount] = useState(0);
  const [bulkHistoryPage, setBulkHistoryPage] = useState(1);
  const [productSort, setProductSort] = useState("name");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(blankProduct);
  const [productCodeMode, setProductCodeMode] = useState("auto");
  const [newProductVariants, setNewProductVariants] = useState([]);
  const [newProductVariantDraft, setNewProductVariantDraft] = useState(blankNewProductVariant);
  const [bundleProductOptions, setBundleProductOptions] = useState([]);
  const [bundleOptionsLoading, setBundleOptionsLoading] = useState(false);
  const [stagedImages, setStagedImages] = useState([]);
  const [taxBulkProducts, setTaxBulkProducts] = useState([]);
  const [taxBulkProductIds, setTaxBulkProductIds] = useState([]);
  const [taxBulkCode, setTaxBulkCode] = useState("iva_19");
  const [taxBulkSearch, setTaxBulkSearch] = useState("");
  const [taxBulkLoading, setTaxBulkLoading] = useState(false);
  const [taxBulkSaving, setTaxBulkSaving] = useState(false);
  const [productImageUrls, setProductImageUrls] = useState({});
  const [variantsByProduct, setVariantsByProduct] = useState({});
  const [viewingVariantsFor, setViewingVariantsFor] = useState(null);
  const [variantDraft, setVariantDraft] = useState(blankVariantDraft);
  const [editingVariantId, setEditingVariantId] = useState(null);
  const [variantBusy, setVariantBusy] = useState(false);
  const [openProductGalleries, setOpenProductGalleries] = useState({});
  const [galleryLoadingFor, setGalleryLoadingFor] = useState(null);
  const [uploadingImagesFor, setUploadingImagesFor] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [showQuickCategoryForm, setShowQuickCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [purchaseModuleTab, setPurchaseModuleTab] = useState("purchases");
  const [purchaseRows, setPurchaseRows] = useState([]);
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [purchasesPageSize, setPurchasesPageSize] = useState(20);
  const [purchasesCount, setPurchasesCount] = useState(0);
  const [expensesPage, setExpensesPage] = useState(1);
  const [expensesPageSize, setExpensesPageSize] = useState(20);
  const [expensesCount, setExpensesCount] = useState(0);
  const [purchaseItemsByPurchase, setPurchaseItemsByPurchase] = useState({});
  const [purchaseProducts, setPurchaseProducts] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showQuickPurchaseSupplierForm, setShowQuickPurchaseSupplierForm] = useState(false);
  const [showQuickExpenseSupplierForm, setShowQuickExpenseSupplierForm] = useState(false);
  const [supplierDraft, setSupplierDraft] = useState(blankSupplier);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchasePeriod, setPurchasePeriod] = useState("day");
  const [purchaseDateFrom, setPurchaseDateFrom] = useState(() => todayInBogota());
  const [purchaseDateTo, setPurchaseDateTo] = useState(() => todayInBogota());
  const [purchaseSupplierId, setPurchaseSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(todayInBogota());
  const [purchaseProductChoice, setPurchaseProductChoice] = useState("");
  const [purchaseItemName, setPurchaseItemName] = useState("");
  const [purchaseQuantity, setPurchaseQuantity] = useState("1");
  const [purchaseUnitCost, setPurchaseUnitCost] = useState("");
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [purchaseTax, setPurchaseTax] = useState("0");
  const [purchasePayment, setPurchasePayment] = useState("0");
  const [purchaseInitialPaymentMethod, setPurchaseInitialPaymentMethod] = useState("Efectivo");
  const [purchaseInitialBankAccountId, setPurchaseInitialBankAccountId] = useState("");
  const [purchasePaymentFormFor, setPurchasePaymentFormFor] = useState(null);
  const [purchasePaymentAmount, setPurchasePaymentAmount] = useState("");
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState("Efectivo");
  const [purchasePaymentBankAccountId, setPurchasePaymentBankAccountId] = useState("");
  const [purchasePaymentDate, setPurchasePaymentDate] = useState(todayInBogota());
  const [purchasePaymentNotes, setPurchasePaymentNotes] = useState("");
  const [purchasePaymentSaving, setPurchasePaymentSaving] = useState(false);
  const [purchaseNotes, setPurchaseNotes] = useState("");
  const [expenseRows, setExpenseRows] = useState([]);
  const [profitabilityLoading, setProfitabilityLoading] = useState(false);
  const [profitabilitySales, setProfitabilitySales] = useState([]);
  const [profitabilitySaleItems, setProfitabilitySaleItems] = useState([]);
  const [profitabilityExpenses, setProfitabilityExpenses] = useState([]);
  const [profitabilityPurchasePayments, setProfitabilityPurchasePayments] = useState([]);
  const [profitabilityPeriod, setProfitabilityPeriod] = useState("month");
  const [profitabilityChartType, setProfitabilityChartType] = useState("bars");
  const [planningChartType, setPlanningChartType] = useState("bars");
  const [profitabilityDateFrom, setProfitabilityDateFrom] = useState(() => todayInBogota().slice(0,7) + "-01");
  const [profitabilityDateTo, setProfitabilityDateTo] = useState(() => todayInBogota());
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseDraft, setExpenseDraft] = useState(blankExpense);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogViewMode, setCatalogViewMode] = useState("cards");
  const [catalogSort, setCatalogSort] = useState("name");
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogPageSize, setCatalogPageSize] = useState(12);
  const [catalogPublishingId, setCatalogPublishingId] = useState(null);
  const [teamRows, setTeamRows] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamFormOpen, setTeamFormOpen] = useState(false);
  const [teamEmail, setTeamEmail] = useState("");
  const [teamPhone, setTeamPhone] = useState("");
  const [teamHourlyRate, setTeamHourlyRate] = useState("");
  const [teamWorkDays, setTeamWorkDays] = useState([]);
  const [teamWorkStart, setTeamWorkStart] = useState("09:00");
  const [teamWorkEnd, setTeamWorkEnd] = useState("17:00");
  const [teamWorkNotes, setTeamWorkNotes] = useState("");
  const [teamPermissionDraft, setTeamPermissionDraft] = useState(blankTeamPermissions);
  const [teamPermissionProfile, setTeamPermissionProfile] = useState("vendedor");
  const [teamEditingUserId, setTeamEditingUserId] = useState(null);
  const [teamEditingRole, setTeamEditingRole] = useState(null);
  const teamFormRef = useRef(null);
  const [teamSaving, setTeamSaving] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [cashRegisterSession, setCashRegisterSession] = useState(null);
  const [cashRegisterLoading, setCashRegisterLoading] = useState(false);
  const [cashRegisterSaving, setCashRegisterSaving] = useState(false);
  const [cashRegisterOpenAmount, setCashRegisterOpenAmount] = useState("0");
  const [cashRegisterCloseAmount, setCashRegisterCloseAmount] = useState("");
  const [cashRegisterCloseNotes, setCashRegisterCloseNotes] = useState("");
  const [cashRegisterSummary, setCashRegisterSummary] = useState({received:0,expenses:0,expected:0,count:0});
  const [salesPeriod, setSalesPeriod] = useState("day");
  const [salesDateFrom, setSalesDateFrom] = useState(() => todayInBogota());
  const [salesDateTo, setSalesDateTo] = useState(() => todayInBogota());
  const [salesSelectedDate, setSalesSelectedDate] = useState(() => todayInBogota());
  const [auditRows, setAuditRows] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPeriod, setAuditPeriod] = useState("day");
  const [auditDateFrom, setAuditDateFrom] = useState(() => todayInBogota());
  const [auditDateTo, setAuditDateTo] = useState(() => todayInBogota());
  const [auditOffset, setAuditOffset] = useState(0);
  const [auditHasMore, setAuditHasMore] = useState(false);
  const [allocationSettings, setAllocationSettings] = useState({ diezmo: { enabled: false, percent: 0 }, ahorro: { enabled: false, percent: 0 }, otra: { enabled: false, name: "Otra asignación", percent: 0 } });
  const [targetProfitPercent, setTargetProfitPercent] = useState("15");
  const [simulateAllocations, setSimulateAllocations] = useState(false);
  const [statsSales, setStatsSales] = useState([]);
  const [statsPayments, setStatsPayments] = useState([]);
  const [statsSaleItems, setStatsSaleItems] = useState([]);
  const [statsCustomers, setStatsCustomers] = useState([]);
  const [statsSuppliers, setStatsSuppliers] = useState([]);
  const [statsExpenses, setStatsExpenses] = useState([]);
  const [statsPurchases, setStatsPurchases] = useState([]);
  const [statsPurchasePayments, setStatsPurchasePayments] = useState([]);
  const [balanceTrendRows, setBalanceTrendRows] = useState({payments:[],expenses:[],purchasePayments:[]});
  const [balanceTrendLoading, setBalanceTrendLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState("day");
  const [statsDateFrom, setStatsDateFrom] = useState(() => todayInBogota().slice(0, 7) + "-01");
  const [statsDateTo, setStatsDateTo] = useState(() => todayInBogota());
  const [quotesRows, setQuotesRows] = useState([]);
  const [expandedQuoteId, setExpandedQuoteId] = useState(null);
  const [quoteImagePreview, setQuoteImagePreview] = useState(null);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [quotesPage, setQuotesPage] = useState(1);
  const [quotesPageSize, setQuotesPageSize] = useState(20);
  const [quotesCount, setQuotesCount] = useState(0);
  const [quotesSearch, setQuotesSearch] = useState("");
  const [quotesStatusFilter, setQuotesStatusFilter] = useState("all");
  const [quoteProducts, setQuoteProducts] = useState([]);
  const [quoteCustomers, setQuoteCustomers] = useState([]);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState(null);
  const [editingQuoteOriginalItems, setEditingQuoteOriginalItems] = useState([]);
  const [quoteCustomerId, setQuoteCustomerId] = useState("");
  const [quoteCustomerName, setQuoteCustomerName] = useState("");
  const [quoteCustomerEmail, setQuoteCustomerEmail] = useState("");
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState("");
  const [showQuickQuoteCustomerForm, setShowQuickQuoteCustomerForm] = useState(false);
  const [quickQuoteCustomerName, setQuickQuoteCustomerName] = useState("");
  const [quickQuoteCustomerPhone, setQuickQuoteCustomerPhone] = useState("");
  const [quickQuoteCustomerEmail, setQuickQuoteCustomerEmail] = useState("");
  const [quickQuoteCustomerCompany, setQuickQuoteCustomerCompany] = useState("");
  const [quickQuoteCustomerWhatsapp, setQuickQuoteCustomerWhatsapp] = useState("");
  const [quickQuoteCustomerDocumentType, setQuickQuoteCustomerDocumentType] = useState("");
  const [quickQuoteCustomerDocumentNumber, setQuickQuoteCustomerDocumentNumber] = useState("");
  const [quickQuoteCustomerCity, setQuickQuoteCustomerCity] = useState("");
  const [quickQuoteCustomerAddress, setQuickQuoteCustomerAddress] = useState("");
  const [quickQuoteCustomerSaving, setQuickQuoteCustomerSaving] = useState(false);
  const [quoteValidUntil, setQuoteValidUntil] = useState(() => {
    const date = new Date(todayInBogota() + "T12:00:00-05:00");
    date.setDate(date.getDate() + 15);
    return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  });
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteProductChoice, setQuoteProductChoice] = useState("");
  const [quoteItemName, setQuoteItemName] = useState("");
  const [quoteQuantity, setQuoteQuantity] = useState("1");
  const [quoteUnitPrice, setQuoteUnitPrice] = useState("");
  const [quoteItems, setQuoteItems] = useState([]);
  const [quoteSaving, setQuoteSaving] = useState(false);
  const [salesPage, setSalesPage] = useState(1);
  const [salesPageSize, setSalesPageSize] = useState(20);
  const [salesCount, setSalesCount] = useState(0);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersPageSize, setCustomersPageSize] = useState(20);
  const [customersCount, setCustomersCount] = useState(0);
  const [saleProducts, setSaleProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerDraft, setCustomerDraft] = useState(blankCustomer);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [saleCustomerId, setSaleCustomerId] = useState("");
  const [saleAdvisorName, setSaleAdvisorName] = useState("");
  const [showQuickCustomerForm, setShowQuickCustomerForm] = useState(false);
  const [quickCustomerName, setQuickCustomerName] = useState("");
  const [quickCustomerPhone, setQuickCustomerPhone] = useState("");
  const [quickCustomerEmail, setQuickCustomerEmail] = useState("");
  const [quickCustomerCompany, setQuickCustomerCompany] = useState("");
  const [quickCustomerWhatsapp, setQuickCustomerWhatsapp] = useState("");
  const [quickCustomerDocumentType, setQuickCustomerDocumentType] = useState("");
  const [quickCustomerDocumentNumber, setQuickCustomerDocumentNumber] = useState("");
  const [quickCustomerCity, setQuickCustomerCity] = useState("");
  const [quickCustomerAddress, setQuickCustomerAddress] = useState("");
  const [quickCustomerSaving, setQuickCustomerSaving] = useState(false);
  const [saleProductChoice, setSaleProductChoice] = useState("");
  const [saleVariantChoice, setSaleVariantChoice] = useState("");
  const [saleVariantsLoading, setSaleVariantsLoading] = useState(false);
  const [showQuickSaleProductForm, setShowQuickSaleProductForm] = useState(false);
  const [quickSaleProductName, setQuickSaleProductName] = useState("");
  const [quickSaleProductSkuMode, setQuickSaleProductSkuMode] = useState("auto");
  const [quickSaleProductSku, setQuickSaleProductSku] = useState("");
  const [quickSaleProductCategoryId, setQuickSaleProductCategoryId] = useState("");
  const [showQuickSaleCategoryForm, setShowQuickSaleCategoryForm] = useState(false);
  const [quickSaleCategoryName, setQuickSaleCategoryName] = useState("");
  const [quickSaleCategorySaving, setQuickSaleCategorySaving] = useState(false);
  const [quickSaleProductType, setQuickSaleProductType] = useState("physical");
  const [quickSaleProductPrice, setQuickSaleProductPrice] = useState("");
  const [quickSaleProductCost, setQuickSaleProductCost] = useState("");
  const [quickSaleProductStock, setQuickSaleProductStock] = useState("1");
  const [quickSaleProductSaving, setQuickSaleProductSaving] = useState(false);
  const [saleQuantity, setSaleQuantity] = useState("1");
  const [saleItems, setSaleItems] = useState([]);
  const [saleDate, setSaleDate] = useState(todayInBogota());
  const [saleSaving, setSaleSaving] = useState(false);
  const [salePayment, setSalePayment] = useState("");
  const [saleCashTendered, setSaleCashTendered] = useState("");
  const [saleInitialPaymentMethod, setSaleInitialPaymentMethod] = useState("Efectivo");
  const [saleInitialBankAccountId, setSaleInitialBankAccountId] = useState("");
  const [salePaymentFormFor, setSalePaymentFormFor] = useState(null);
  const [expandedSaleId, setExpandedSaleId] = useState(null);
  const [salePaymentAmount, setSalePaymentAmount] = useState("");
  const [salePaymentMethod, setSalePaymentMethod] = useState("Efectivo");
  const [salePaymentBankAccountId, setSalePaymentBankAccountId] = useState("");
  const [salePaymentDate, setSalePaymentDate] = useState(todayInBogota());
  const [salePaymentNotes, setSalePaymentNotes] = useState("");
  const [salePaymentSaving, setSalePaymentSaving] = useState(false);
  const [saleNotes, setSaleNotes] = useState("");
  const [settingsCurrency, setSettingsCurrency] = useState("COP");
  const [settingsBusinessName, setSettingsBusinessName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [ownerPhoneSaving, setOwnerPhoneSaving] = useState(false);
  const [settingsTab, setSettingsTab] = useState("general");
  const [uiLanguage, setUiLanguage] = useState("es");
  const [settingsCatalogSlug, setSettingsCatalogSlug] = useState("");
  const [settingsCommercialProfile, setSettingsCommercialProfile] = useState({ tradeName: "", ownerName: "", documentNumber: "", email: "", phone: "", address: "", city: "", website: "", publicDescription: "", hours: "", orderChannel: "whatsapp", hoursSchedule: {}, deliveryMethods: ["pickup","delivery"], stockVisibility: "hide", catalogPrimary: "#167D82", catalogBackground: "#F5F7FC", catalogSurface: "#FFFFFF", catalogText: "#24352B", cardPrimary: "#475569", cardSurface: "#FFFFFF", cardText: "#1F2937" });
  const [wompiDraft, setWompiDraft] = useState({ environment: "sandbox", public_key: "", private_key: "", integrity_secret: "", events_secret: "", enabled: true });
  const [wompiStatus, setWompiStatus] = useState({ loading: true, configured: false, enabled: false, environment: null });
  const [wompiSaving, setWompiSaving] = useState(false);
  const [aiVoiceListening, setAiVoiceListening] = useState(false);
  const aiRecognitionRef = useRef(null);
  useEffect(() => {
    try {
      const key = "treseiscinco-language:" + (session?.user?.id || "guest");
      const saved = window.localStorage.getItem(key);
      setUiLanguage(["es","en","pt","it","fr"].includes(saved) ? saved : "es");
    } catch { setUiLanguage("es"); }
  }, [session?.user?.id]);
  useEffect(() => applyAppLanguage(uiLanguage), [uiLanguage]);
  useEffect(() => {
    let active = true;
    setWompiStatus({ loading: true, configured: false, enabled: false, environment: null });
    setWompiDraft({ environment: "sandbox", public_key: "", private_key: "", integrity_secret: "", events_secret: "", enabled: true });
    if (!activeBusiness?.id) {
      setWompiStatus({ loading: false, configured: false, enabled: false, environment: null });
      return () => { active = false; };
    }
    supabase.functions.invoke("public-checkout", { body: { action: "status", business_id: activeBusiness.id } })
      .then(({ data, error: statusError }) => {
        if (!active) return;
        if (statusError) throw statusError;
        setWompiStatus({ loading: false, configured: data?.configured === true, enabled: data?.enabled === true, environment: data?.environment || null });
        setWompiDraft((current) => ({ ...current, environment: data?.environment === "production" ? "production" : "sandbox", enabled: data?.enabled === true }));
      })
      .catch(() => {
        if (active) setWompiStatus({ loading: false, configured: false, enabled: false, environment: null });
      });
    return () => { active = false; };
  }, [activeBusiness?.id]);
  useEffect(() => {
    let cancelled = false;
    if (!session?.user?.id) { setOwnerPhone(""); return; }
    supabase.from("profiles").select("phone").eq("user_id", session.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { setError(friendlyError(error)); return; }
        setOwnerPhone(String(data?.phone || ""));
      });
    return () => { cancelled = true; };
  }, [session?.user?.id]);
  useEffect(() => () => { try { aiRecognitionRef.current?.stop?.(); } catch {} }, []);
  const [settingsChecking, setSettingsChecking] = useState(false);
  const [settingsHasData, setSettingsHasData] = useState(false);
  const [settingsConversionRate, setSettingsConversionRate] = useState("");
  const [settingsTheme, setSettingsTheme] = useState(defaultBusinessTheme);
  const [settingsHelpEnabled, setSettingsHelpEnabled] = useState(true);
  const [settingsAssistantName, setSettingsAssistantName] = useState("Angie");
  const [settingsTaxProfile, setSettingsTaxProfile] = useState(DEFAULT_TAX_PROFILE);
  const [settingsLogoFile, setSettingsLogoFile] = useState(null);
  const [settingsLogoPreview, setSettingsLogoPreview] = useState("");
  const [settingsRemoveLogo, setSettingsRemoveLogo] = useState(false);
  const [contextHelpOpen, setContextHelpOpen] = useState(false);
  const contextHelpLayerRef = useRef(null);
  useEffect(() => {
    if (!contextHelpOpen) return;
    const onOutsidePointer = (event) => {
      if (contextHelpLayerRef.current?.contains(event.target)) return;
      setContextHelpOpen(false);
    };
    const onEscape = (event) => { if (event.key === "Escape") setContextHelpOpen(false); };
    document.addEventListener("pointerdown", onOutsidePointer, true);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointer, true);
      document.removeEventListener("keydown", onEscape);
    };
  }, [contextHelpOpen]);
  useEffect(() => { setContextHelpOpen(false); }, [screen, activeBusiness?.id]);

  const [aiOpen, setAiOpen] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiHistory, setAiHistory] = useState([]);
  const aiMessagesRef = useRef(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiAutoSpeak, setAiAutoSpeak] = useState(true);
  const [aiSpeechBusy, setAiSpeechBusy] = useState(false);
  const [aiSpeechError, setAiSpeechError] = useState("");
  const [aiMemoryBusy, setAiMemoryBusy] = useState(false);
  const [aiAudio, setAiAudio] = useState(null);
  const aiAudioRef = useRef(null);
  const aiAudioUrlRef = useRef("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    setAiHistory([]);
    setAiMessage("");
    if (aiAudioUrlRef.current) URL.revokeObjectURL(aiAudioUrlRef.current);
    aiAudioUrlRef.current = "";
    setAiAudio(null);
    setAiSpeechError("");
    try { setAiAutoSpeak(window.localStorage.getItem("treseiscinco-ai-auto-speak:" + (session?.user?.id || "guest")) !== "false"); } catch { setAiAutoSpeak(true); }
  }, [activeBusiness?.id, session?.user?.id]);
  useEffect(() => () => {
    try { aiAudioRef.current?.pause?.(); } catch {}
    if (aiAudioUrlRef.current) URL.revokeObjectURL(aiAudioUrlRef.current);
  }, []);
  useEffect(() => {
    if (!aiOpen || !aiMessagesRef.current) return;
    const container = aiMessagesRef.current;
    let frame = requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
      container.lastElementChild?.scrollIntoView({ block: "end", behavior: "auto" });
    });
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
        container.lastElementChild?.scrollIntoView({ block: "end", behavior: "auto" });
      });
    });
    observer.observe(container, { childList: true, subtree: true, characterData: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [aiHistory, aiBusy, aiOpen]);
  function toggleAiVoice() {
    if (aiVoiceListening) { aiRecognitionRef.current?.stop?.(); setAiVoiceListening(false); return; }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Este navegador no ofrece dictado por voz. Prueba Chrome actualizado en Android o usa el teclado con micrófono."); return; }
    try {
      const recognition = new SpeechRecognition(); aiRecognitionRef.current = recognition; recognition.lang = "es-CO"; recognition.interimResults = true; recognition.continuous = false;
      recognition.onstart = () => setAiVoiceListening(true);
      recognition.onresult = (event) => { const transcript = Array.from(event.results).map((result) => result[0]?.transcript || "").join(" ").trim(); if (transcript) setAiMessage((current) => (current ? current.trim() + " " : "") + transcript); };
      recognition.onerror = () => { setAiVoiceListening(false); setError("No pude escuchar con claridad. Revisa el permiso del micrófono e inténtalo de nuevo."); };
      recognition.onend = () => setAiVoiceListening(false); recognition.start();
    } catch { setAiVoiceListening(false); setError("No se pudo iniciar el micrófono. Revisa los permisos del navegador."); }
  }
  const assistantDisplayName = String(activeBusiness?.settings?.assistant_name || "Angie").trim().slice(0,32) || "Angie";
  async function clearAiMemories() {
    if (!activeBusiness?.id || !session?.user?.id || aiMemoryBusy) return;
    if (!window.confirm("¿Borrar las preferencias y objetivos que "+assistantDisplayName+" ha guardado para ti en este negocio? No se borrarán ventas, productos ni otros datos.")) return;
    setAiMemoryBusy(true);
    try {
      const { error: memoryError } = await supabase.from("assistant_memories").delete().eq("business_id", activeBusiness.id).eq("user_id", session.user.id);
      if (memoryError) throw memoryError;
      setAiHistory((current) => [...current, { role: "assistant", content: "Listo. Borré los recuerdos guardados para ti en este negocio." }]);
    } catch (error) { setAiSpeechError(String(error?.message || "No pude borrar los recuerdos ahora.")); }
    finally { setAiMemoryBusy(false); }
  }
  function captureAiScreenContext() {
    const root = document.querySelector(".main-content") || document.querySelector(".app-main") || document.querySelector(".app-content") || document.querySelector(".app-shell");
    if (!root) return "";
    const clone = root.cloneNode(true);
    clone.querySelectorAll("input,textarea,select,button,form,[contenteditable='true'],.ai-assistant-layer,.field-help-popover,[aria-hidden='true']").forEach((node) => node.remove());
    const text = String(clone.innerText || clone.textContent || "").replace(/\\s+/g, " ").trim().slice(0, 4200);
    const charts = Array.from(root.querySelectorAll('[role="img"][aria-label],svg[aria-label]')).map((node) => String(node.getAttribute("aria-label") || "").trim()).filter(Boolean).slice(0, 12);
    return ["PANTALLA ACTUAL: " + String(screen || "Inicio"), text ? "CONTENIDO VISIBLE: " + text : "", charts.length ? "GRÁFICOS VISIBLES: " + charts.join(" | ") : ""].filter(Boolean).join("\\n").slice(0, 6500);
  }
  async function generateAiSpeech(text, messageId) {
    const content = String(text || "").trim();
    if (!content || aiSpeechBusy) return;
    if (aiAudio?.messageId === String(messageId) && aiAudioRef.current) {
      setAiSpeechError("");
      try { aiAudioRef.current.currentTime = 0; await aiAudioRef.current.play(); return; } catch {}
    }
    setAiSpeechBusy(true); setAiSpeechError("");
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Tu sesión terminó. Vuelve a entrar para escuchar la respuesta.");
      const response = await fetch("/api/ai/speech", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, apikey: supabasePublishableKey }, body: JSON.stringify({ text: content.slice(0, 2600), businessId: activeBusiness?.id }) });
      if (!response.ok) { let payload = {}; try { payload = await response.json(); } catch {} throw new Error(payload.error || "Celeste no pudo generar el audio ahora."); }
      const blob = await response.blob();
      if (!blob.size || !String(blob.type || "").toLowerCase().includes("audio/mpeg")) throw new Error("La respuesta de voz no llegó como MP3 válido.");
      if (aiAudioUrlRef.current) URL.revokeObjectURL(aiAudioUrlRef.current);
      const url = URL.createObjectURL(blob); aiAudioUrlRef.current = url; setAiAudio({ url, messageId });
      requestAnimationFrame(() => { if (!aiAudioRef.current) return; aiAudioRef.current.src = url; if (aiAutoSpeak) aiAudioRef.current.play().catch(() => setAiSpeechError("El navegador bloqueó la reproducción automática. Pulsa Reproducir en el control de audio.")); });
    } catch (error) { setAiSpeechError(String(error?.message || "No se pudo generar la voz Celeste.")); }
    finally { setAiSpeechBusy(false); }
  }
  function toggleAiAutoSpeak() {
    const next = !aiAutoSpeak; setAiAutoSpeak(next);
    try { window.localStorage.setItem("treseiscinco-ai-auto-speak:" + (session?.user?.id || "guest"), String(next)); } catch {}
    if (!next) { try { aiAudioRef.current?.pause?.(); } catch {} }
  }
  async function sendAiMessage(event) {
    event.preventDefault();
    const message = aiMessage.trim();
    if (!message || aiBusy) return;
    setAiMessage("");
    const nextHistory = [...aiHistory, { role: "user", content: message }];
    setAiHistory(nextHistory);
    setAiBusy(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const token = sessionData?.session?.access_token;
      if (!token) throw new Error("Inicia sesión para usar el asistente.");
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token, apikey: supabasePublishableKey },
        body: JSON.stringify({
          message,
          history: nextHistory.slice(0, -1).slice(-6),
          businessId: activeBusiness?.id,
          screen: screen,
          screenContext: captureAiScreenContext(),
          assistantName: assistantDisplayName
        })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "No pudimos consultar la IA.");
      setAiHistory((current) => [...current, { role: "assistant", content: payload.answer, elapsedMs: payload.elapsedMs, dataBacked: payload.dataBacked }]);
      if (aiAutoSpeak && payload.answer) generateAiSpeech(payload.answer, String(nextHistory.length));
    } catch (error) {
      const messageText = String(error?.message || "");
      const friendlyMessage = /failed to fetch|networkerror|load failed/i.test(messageText)
        ? "No logré consultar la información del negocio en este momento. Inténtalo de nuevo en unos segundos."
        : /sesión|inicia sesión/i.test(messageText)
          ? "Tu sesión terminó. Vuelve a entrar y seguimos."
          : messageText || "No logré responder en este momento. Inténtalo de nuevo.";
      setAiHistory((current) => [...current, { role: "assistant", content: friendlyMessage }]);
    } finally { setAiBusy(false); }
  }

  const [adjustingId, setAdjustingId] = useState(null);
  const [adjustDelta, setAdjustDelta] = useState("");
  const [adjustNote, setAdjustNote] = useState("");
  const [adjustOtherNote, setAdjustOtherNote] = useState("");
  const [stockMovementRows, setStockMovementRows] = useState([]);
  const [stockMovementsLoading, setStockMovementsLoading] = useState(false);
  const [stockMovementsCount, setStockMovementsCount] = useState(0);
  const [stockMovementPage, setStockMovementPage] = useState(1);
  const [stockMovementRefresh, setStockMovementRefresh] = useState(0);
  const currencyCode = activeBusiness?.currency_code || "COP";
  useEffect(() => {
    if (screen !== "sales" || !showQuickSaleProductForm || !activeBusiness?.id) return;
    let active = true;
    supabase.from("product_categories").select("id,name,description,sort_order")
      .eq("business_id", activeBusiness.id).order("name")
      .then(({ data, error: categoryError }) => {
        if (!active) return;
        if (categoryError) throw categoryError;
        setCategories(data || []);
      })
      .catch((e) => { if (active) setError(friendlyError(e)); });
    return () => { active = false; };
  }, [screen, showQuickSaleProductForm, activeBusiness?.id]);

  const bulkEditHasChanges = bulkProductRows.some((row) =>
    String(row._draftName ?? "").trim() !== String(row.name ?? "").trim() ||
    String(row._draftSku ?? "").trim() !== String(row.sku ?? "").trim() ||
    Number(row._draftSalePrice || 0) !== Number(row.sale_price_minor || 0) / (10 ** currencyDigits(currencyCode)) ||
    Number(row._draftCostPrice || 0) !== Number(row.cost_price_minor || 0) / (10 ** currencyDigits(currencyCode)) ||
    (row.track_inventory && Number(row._draftStock || 0) !== Number(row.stock_on_hand || 0))
  );

  useEffect(() => {
    if (!activeBusiness?.id || !editingProductId) {
      setStockMovementRows([]);
      setStockMovementsCount(0);
      setStockMovementsLoading(false);
      return;
    }
    let active = true;
    setStockMovementsLoading(true);
    const from = (stockMovementPage - 1) * 10;
    supabase.from("stock_movements")
      .select("id,product_id,movement_type,quantity_delta,reference_type,notes,created_at", { count: "exact" })
      .eq("business_id", activeBusiness.id)
      .eq("product_id", editingProductId)
      .order("created_at", { ascending: false })
      .range(from, from + 9)
      .then(({ data, error: movementError, count }) => {
        if (!active) return;
        if (movementError) throw movementError;
        setStockMovementRows(data || []);
        setStockMovementsCount(count || 0);
      })
      .catch((e) => {
        if (!active) return;
        setStockMovementRows([]);
        setStockMovementsCount(0);
        setError(friendlyError(e));
      })
      .finally(() => { if (active) setStockMovementsLoading(false); });
    return () => { active = false; };
  }, [activeBusiness?.id, editingProductId, stockMovementPage, stockMovementRefresh]);

  const loadBusinesses = useCallback(async (userId) => {
    const { data, error: queryError } = await supabase
      .from("business_members")
      .select("business_id, role, permissions, businesses(id, name, slug, logo_path, theme, currency_code, settings, created_at)")
      .eq("user_id", userId);
    if (queryError) throw queryError;
    // En una sesión nueva, prioriza el negocio propio; los negocios donde la persona trabaja siguen disponibles en el selector.
    const list = (data || []).map((row) => ({ ...row.businesses, role: row.role, permissions: row.permissions || {} }))
      .filter((b) => b?.id)
      .sort((left, right) => {
        const rolePriority = (role) => role === "owner" ? 0 : role === "admin" ? 1 : 2;
        const roleDifference = rolePriority(left.role) - rolePriority(right.role);
        if (roleDifference) return roleDifference;
        const leftCreated = Date.parse(left.created_at || "");
        const rightCreated = Date.parse(right.created_at || "");
        const leftTime = Number.isFinite(leftCreated) ? leftCreated : Number.MAX_SAFE_INTEGER;
        const rightTime = Number.isFinite(rightCreated) ? rightCreated : Number.MAX_SAFE_INTEGER;
        return leftTime - rightTime || String(left.name || "").localeCompare(String(right.name || ""), "es");
      });
    setBusinesses(list);
    setActiveBusiness((current) => list.find((b) => b.id === current?.id) || list[0] || null);
    setScreen((current) => list.length ? (current === "setup" ? "home" : current) : "setup");
    return list;
  }, []);

  const loadProducts = useCallback(async () => {
    if (!activeBusiness?.id) return;
    setProductsLoading(true); setError("");
    const columns = "id,business_id,category_id,sku,slug,name,description,commercial_presentation,product_type,unit_name,sale_price_minor,cost_price_minor,stock_on_hand,low_stock_threshold,track_inventory,is_sellable,is_published,image_paths,metadata,archived_at,created_at";
    const safeTerm = search.trim().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").slice(0, 100);
    const sortColumn = ({ name: "name", name_desc: "name", code: "sku", code_desc: "sku", price: "sale_price_minor", price_desc: "sale_price_minor", cost: "cost_price_minor", cost_desc: "cost_price_minor", stock: "stock_on_hand", stock_desc: "stock_on_hand" })[productSort] || "name";
    const descending = productSort.endsWith("_desc");
    const needsClientRanking = ["low_stock", "in_stock", "out_of_stock"].includes(productStockFilter) || ["profit", "profit_asc", "margin", "margin_asc", "stock", "stock_desc"].includes(productSort);
    try {
      const makeBaseQuery = () => {
        let query = supabase.from("products").select(columns, { count: "exact" }).eq("business_id", activeBusiness.id);
        query = showArchivedProducts ? query.not("archived_at", "is", null) : query.is("archived_at", null);
        if (safeTerm) {
          const term = safeTerm.replace(/"/g, '\\"');
          query = query.or("name.ilike.%" + term + "%,sku.ilike.%" + term + "%,description.ilike.%" + term + "%");
        }
        if (productCategoryFilter !== "all") query = query.eq("category_id", productCategoryFilter);
        if (productTypeFilter !== "all") query = query.eq("product_type", productTypeFilter);


        return query;
      };
      const [categoryResult, productResult] = await Promise.all([
        supabase.from("product_categories").select("id,name,description,sort_order").eq("business_id", activeBusiness.id).order("name"),
        (async () => {
          if (!needsClientRanking) {
            let query = makeBaseQuery().order(sortColumn, { ascending: !descending, nullsFirst: false });
            if (sortColumn !== "name") query = query.order("name", { ascending: true });
            return query.range((productPage - 1) * productPageSize, productPage * productPageSize - 1);
          }
          const all = [];
          const chunkSize = 500;
          for (let offset = 0; offset < 50000; offset += chunkSize) {
            const { data, error: chunkError } = await makeBaseQuery().order("name").range(offset, offset + chunkSize - 1);
            if (chunkError) throw chunkError;
            const batch = data || [];
            all.push(...batch);
            if (batch.length < chunkSize) break;
            if (offset + chunkSize >= 50000) throw new Error("Este inventario supera los 50.000 artículos. Usa la búsqueda para limitar los resultados.");
          }
          const needsVariantStock = ["in_stock", "out_of_stock"].includes(productStockFilter) || ["stock", "stock_desc"].includes(productSort);
          const stockVariantsByProduct = new Map();
          if (needsVariantStock) {
            const allVariants = [];
            for (let offset = 0; offset < 50000; offset += chunkSize) {
              const { data: variantBatch, error: variantError } = await supabase.from("product_variants")
                .select("id,product_id,stock_on_hand,is_active")
                .eq("business_id", activeBusiness.id).eq("is_active", true)
                .order("product_id").order("id").range(offset, offset + chunkSize - 1);
              if (variantError) throw variantError;
              const rows = variantBatch || [];
              allVariants.push(...rows);
              if (rows.length < chunkSize) break;
              if (offset + chunkSize >= 50000) throw new Error("Hay más de 50.000 variantes activas; usa la búsqueda del inventario para acotar los resultados.");
            }
            for (const variant of allVariants) {
              if (!stockVariantsByProduct.has(variant.product_id)) stockVariantsByProduct.set(variant.product_id, []);
              stockVariantsByProduct.get(variant.product_id).push(variant);
            }
          }
          const stockValue = (product) => {
            const variants = stockVariantsByProduct.get(product.id) || [];
            const summary = summarizeProductVariantStock(product, variants);
            if (summary.usesVariantStock) {
              if (!summary.known) return summary.empty ? 0 : null;
              return summary.units;
            }
            return product.track_inventory ? Math.max(0, Number(product.stock_on_hand || 0)) : null;
          };
          let filtered = all;
          if (productStockFilter === "low_stock") {
            filtered = all.filter((product) => product.track_inventory && Number(product.stock_on_hand || 0) > 0 && product.low_stock_threshold != null && Number(product.stock_on_hand || 0) <= Number(product.low_stock_threshold));
          } else if (productStockFilter === "in_stock" || productStockFilter === "out_of_stock") {
            filtered = all.filter((product) => {
              const stock = stockValue(product);
              if (stock == null) return false;
              return productStockFilter === "in_stock" ? stock > 0 : stock <= 0;
            });
          }
          if (productSort === "stock" || productSort === "stock_desc") {
            filtered.sort((a, b) => {
              const aStock = stockValue(a), bStock = stockValue(b);
              if (aStock == null && bStock == null) return String(a.name || "").localeCompare(String(b.name || ""), "es");
              if (aStock == null) return 1;
              if (bStock == null) return -1;
              const difference = aStock - bStock;
              return (descending ? -difference : difference) || String(a.name || "").localeCompare(String(b.name || ""), "es");
            });
          } else {
            filtered.sort((a, b) => compareInventoryProducts(a, b, productSort));
          }
          return { data: filtered.slice((productPage - 1) * productPageSize, productPage * productPageSize), count: filtered.length, error: null };
        })()
      ]);
      if (productResult.error) throw productResult.error;
      if (categoryResult.error) throw categoryResult.error;
      const pageProducts = productResult.data || [];
      const productIds = pageProducts.map((product) => product.id);
      let variantRows = [];
      if (productIds.length) {
        const variantsResult = await supabase.from("product_variants")
          .select("id,business_id,product_id,variant_name,variant_value,sku,sale_price_minor,stock_on_hand,is_active,image_paths,created_at")
          .eq("business_id", activeBusiness.id).in("product_id", productIds)
          .order("variant_name").order("variant_value").limit(1000);
        if (variantsResult.error) throw variantsResult.error;
        variantRows = variantsResult.data || [];
      }
      const variantsMap = {};
      for (const variant of variantRows) {
        if (!variantsMap[variant.product_id]) variantsMap[variant.product_id] = [];
        variantsMap[variant.product_id].push(variant);
      }
      setProducts(pageProducts);
      setVariantsByProduct(variantsMap);
      setProductsCount(productResult.count || 0);
      setCategories(categoryResult.data || []);
    } catch (e) { setError(friendlyError(e)); }
    finally { setProductsLoading(false); }
  }, [activeBusiness?.id, productPage, productPageSize, search, showArchivedProducts, productSort, productStockFilter, productCategoryFilter, productTypeFilter]);

  const loadInventoryOverview = useCallback(async () => {
    if (!activeBusiness?.id || !canAccessScreen("products")) return;
    setInventoryOverviewLoading(true);
    try {
      const all = [];
      const chunkSize = 500;
      for (let offset = 0; offset < 50000; offset += chunkSize) {
        const { data, error: queryError } = await supabase.from("products")
          .select("id,cost_price_minor,sale_price_minor,stock_on_hand,track_inventory,low_stock_threshold,product_type,metadata")
          .eq("business_id", activeBusiness.id).is("archived_at", null)
          .order("name").range(offset, offset + chunkSize - 1);
        if (queryError) throw queryError;
        const batch = data || [];
        all.push(...batch);
        if (batch.length < chunkSize) break;
        if (offset + chunkSize >= 50000) throw new Error("Este inventario supera los 50.000 artículos y no se pudo resumir completo.");
      }
      const allVariantRows = [];
      for (let offset = 0; offset < 50000; offset += chunkSize) {
        const { data: variantBatch, error: variantError } = await supabase.from("product_variants")
          .select("product_id,stock_on_hand,sale_price_minor,is_active")
          .eq("business_id", activeBusiness.id).eq("is_active", true)
          .order("product_id").range(offset, offset + chunkSize - 1);
        if (variantError) throw variantError;
        const rows = variantBatch || [];
        allVariantRows.push(...rows);
        if (rows.length < chunkSize) break;
        if (offset + chunkSize >= 50000) throw new Error("Este inventario supera las 50.000 variantes y no se pudo resumir completo.");
      }
      const variantsMap = new Map();
      for (const variant of allVariantRows) {
        if (!variantsMap.has(variant.product_id)) variantsMap.set(variant.product_id, []);
        variantsMap.get(variant.product_id).push(variant);
      }
      const summary = all.reduce((totals, product) => {
        const variants = variantsMap.get(product.id) || [];
        const variantSummary = summarizeProductVariantStock(product, variants);
        if (variantSummary.usesVariantStock) {
          if (!variants.length) return totals;
          for (const variant of variants) {
            if (variant.stock_on_hand == null) continue;
            const stock = Math.max(0, Number(variant.stock_on_hand || 0));
            totals.trackedUnits += stock;
            totals.costMinor += stock * Number(product.cost_price_minor || 0);
            totals.retailMinor += stock * Number(variant.sale_price_minor ?? product.sale_price_minor ?? 0);
          }
          if (variantSummary.known && variantSummary.units <= 0) totals.outOfStockCount += 1;
          return totals;
        }
        if (!product.track_inventory) return totals;
        const stock = Math.max(0, Number(product.stock_on_hand || 0));
        totals.trackedUnits += stock;
        totals.costMinor += stock * Number(product.cost_price_minor || 0);
        totals.retailMinor += stock * Number(product.sale_price_minor || 0);
        if (stock <= 0) totals.outOfStockCount += 1;
        else if (product.low_stock_threshold != null && stock <= Number(product.low_stock_threshold)) totals.lowStockCount += 1;
        return totals;
      }, { trackedUnits: 0, costMinor: 0, retailMinor: 0, outOfStockCount: 0, lowStockCount: 0 });
      setInventoryOverview({ productCount: all.length, ...summary });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setInventoryOverviewLoading(false);
    }
  }, [activeBusiness?.id]);

  useEffect(() => {
    if ((screen === "products" || screen === "home") && activeBusiness?.id && canAccessScreen("products")) loadInventoryOverview();
  }, [screen, activeBusiness?.id, inventoryOverviewRefresh, loadInventoryOverview]);

  const loadHomeSummary = useCallback(async () => {
    if (!activeBusiness?.id || screen !== "home") return;
    setHomeSummary((current) => ({ ...current, loading: true, error: "" }));
    try {
      const today = todayInBogota();
      const tomorrowDate = new Date(today + "T12:00:00Z");
      tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
      const tomorrow = tomorrowDate.toISOString().slice(0, 10);
      const requests = [];
      if (canAccessScreen("sales")) {
        requests.push((async () => {
          const rows = [];
          for (let offset = 0; offset < 5000; offset += 500) {
            const { data, error: salesError } = await supabase.from("sales")
              .select("id,total_minor,status,sold_at").eq("business_id", activeBusiness.id)
              .gte("sold_at", today + "T00:00:00-05:00").lt("sold_at", tomorrow + "T00:00:00-05:00")
              .order("sold_at", { ascending: false }).range(offset, offset + 499);
            if (salesError) throw salesError;
            const batch = data || [];
            rows.push(...batch);
            if (batch.length < 500) break;
          }
          return { key: "sales", rows };
        })());
      }
      if (canAccessScreen("quotes")) {
        requests.push((async () => {
          const { count, error: quotesError } = await supabase.from("quotes")
            .select("id", { count: "exact", head: true }).eq("business_id", activeBusiness.id).in("status", ["draft", "sent"]);
          if (quotesError) throw quotesError;
          return { key: "quotes", count: Number(count || 0) };
        })());
      }
      const results = await Promise.all(requests);
      const salesResult = results.find((item) => item.key === "sales");
      const quoteResult = results.find((item) => item.key === "quotes");
      const realSales = (salesResult?.rows || []).filter((sale) => !["cancelled", "canceled", "refunded"].includes(sale.status));
      setHomeSummary({
        loading: false,
        todaySalesCount: realSales.length,
        todaySalesMinor: realSales.reduce((total, sale) => total + Number(sale.total_minor || 0), 0),
        openQuotesCount: quoteResult?.count || 0,
        error: ""
      });
    } catch (e) {
      setHomeSummary((current) => ({ ...current, loading: false, error: friendlyError(e) }));
    }
  }, [activeBusiness?.id, screen]);

  useEffect(() => {
    if (screen === "home" && activeBusiness?.id) loadHomeSummary();
  }, [screen, activeBusiness?.id, loadHomeSummary]);

  const loadHomePieData = useCallback(async () => {
    if (!activeBusiness?.id || screen !== "home") return;
    setHomePieData((current) => ({ ...current, loading: true, error: "" }));
    try {
      const range = getHomeChartRange(homeChartPeriod);
      const fromStamp = range.start + "T00:00:00-05:00";
      const toStamp = range.endExclusive + "T00:00:00-05:00";
      const permissions = activeBusiness?.permissions || {};
      const isManager = ["owner", "admin"].includes(activeBusiness?.role);
      const canReadSales = isManager || Boolean(permissions.sales_view);
      const canReadPurchases = isManager || Boolean(permissions.purchases_view);
      const canReadExpenses = isManager || Boolean(permissions.expenses_view);
      const canReadSuppliers = isManager || Boolean(permissions.suppliers_view) || canReadPurchases;

      const [salesRows, purchaseRows, expenseRows] = await Promise.all([
        canReadSales ? fetchAllProfitabilityRows(
          () => supabase.from("sales")
            .select("id,business_id,total_minor,status,sold_at,created_at")
            .eq("business_id", activeBusiness.id)
            .gte("sold_at", fromStamp).lt("sold_at", toStamp)
            .order("sold_at", { ascending: false }).order("id", { ascending: true }),
          "ventas del panel de Inicio"
        ) : Promise.resolve([]),
        canReadPurchases ? fetchAllProfitabilityRows(
          () => supabase.from("purchases")
            .select("id,business_id,supplier_id,total_minor,status,purchased_at,created_at")
            .eq("business_id", activeBusiness.id)
            .gte("purchased_at", fromStamp).lt("purchased_at", toStamp)
            .order("purchased_at", { ascending: false }).order("id", { ascending: true }),
          "compras del panel de Inicio"
        ) : Promise.resolve([]),
        canReadExpenses ? fetchAllProfitabilityRows(
          () => supabase.from("expenses")
            .select("id,business_id,amount_minor,expense_date,category")
            .eq("business_id", activeBusiness.id)
            .gte("expense_date", range.start).lt("expense_date", range.endExclusive)
            .order("expense_date", { ascending: false }).order("id", { ascending: true }),
          "gastos del panel de Inicio"
        ) : Promise.resolve([])
      ]);

      const validSales = salesRows.filter((sale) =>
        !["cancelled", "canceled", "refunded", "draft"].includes(String(sale.status || "").toLowerCase())
      );
      const saleIds = validSales.map((sale) => sale.id);
      const saleItems = [];
      for (let index = 0; index < saleIds.length; index += 100) {
        const ids = saleIds.slice(index, index + 100);
        const rows = await fetchAllProfitabilityRows(
          () => supabase.from("sale_items")
            .select("id,business_id,sale_id,item_name,line_total_minor")
            .eq("business_id", activeBusiness.id).in("sale_id", ids).order("id", { ascending: true }),
          "artículos vendidos para el panel de Inicio"
        );
        saleItems.push(...rows);
      }

      const incomeByItem = new Map();
      const addAmount = (map, label, amount) => {
        const key = String(label || "").trim() || "Otros";
        const value = Number(amount || 0);
        if (value > 0) map.set(key, (map.get(key) || 0) + value);
      };
      for (const item of saleItems) addAmount(incomeByItem, item.item_name || "Artículo sin nombre", item.line_total_minor);
      const salesWithDetails = new Set(saleItems.map((item) => item.sale_id));
      for (const sale of validSales) {
        if (!salesWithDetails.has(sale.id)) addAmount(incomeByItem, "Ventas sin detalle", sale.total_minor);
      }

      const validPurchases = purchaseRows.filter((purchase) =>
        !["cancelled", "canceled", "draft", "refunded"].includes(String(purchase.status || "").toLowerCase())
      );
      const supplierNames = new Map();
      const supplierIds = [...new Set(validPurchases.map((purchase) => purchase.supplier_id).filter(Boolean))];
      if (canReadSuppliers && supplierIds.length) {
        try {
          const suppliers = await fetchAllProfitabilityRows(
            () => supabase.from("suppliers").select("id,business_id,name")
              .eq("business_id", activeBusiness.id).in("id", supplierIds).order("name", { ascending: true }),
            "proveedores del panel de Inicio"
          );
          for (const supplier of suppliers) supplierNames.set(supplier.id, supplier.name || "Proveedor");
        } catch {
          // Supplier names are helpful labels, but must not prevent the financial charts from loading.
        }
      }

      const purchasesBySupplier = new Map();
      for (const purchase of validPurchases) {
        addAmount(purchasesBySupplier, purchase.supplier_id
          ? (supplierNames.get(purchase.supplier_id) || "Proveedor registrado")
          : "Sin proveedor", purchase.total_minor);
      }

      const expensesByCategory = new Map();
      for (const expense of expenseRows) {
        addAmount(expensesByCategory, String(expense.category || "").trim() || "Otros gastos", expense.amount_minor);
      }

      setHomePieData({
        loading: false,
        error: "",
        income: summarizeHomePieMap(incomeByItem),
        purchases: summarizeHomePieMap(purchasesBySupplier),
        expenses: summarizeHomePieMap(expensesByCategory),
        trends: buildHomeTrendData(homeChartPeriod, range, validSales, validPurchases, expenseRows)
      });
    } catch (e) {
      setHomePieData({ loading: false, error: friendlyError(e), income: [], purchases: [], expenses: [], trends: [] });
    }
  }, [
    activeBusiness?.id, activeBusiness?.role,
    activeBusiness?.permissions?.sales_view, activeBusiness?.permissions?.purchases_view,
    activeBusiness?.permissions?.expenses_view, activeBusiness?.permissions?.suppliers_view,
    screen, homeChartPeriod
  ]);

  useEffect(() => {
    if (screen === "home" && activeBusiness?.id) loadHomePieData();
  }, [screen, activeBusiness?.id, homeChartPeriod, loadHomePieData]);


  useEffect(() => {
    let alive = true;
    let startupExpired = false;
    const startupTimer = window.setTimeout(() => {
      if (!alive) return;
      startupExpired = true;
      setSession(null);
      setBusinesses([]);
      setActiveBusiness(null);
      setAuthReady(true);
      setError("No pudimos comprobar tu sesión a tiempo. Comprueba tu conexión y vuelve a iniciar sesión.");
    }, 10000);

    supabase.auth.getSession().then(async ({ data, error: sessionError }) => {
      if (!alive || startupExpired) return;
      if (sessionError) throw sessionError;
      const currentSession = data?.session || null;
      setSession(currentSession);
      if (currentSession?.user) {
        try { await loadBusinesses(currentSession.user.id); }
        catch (e) { if (alive && !startupExpired) setError(friendlyError(e)); }
      }
      if (!alive || startupExpired) return;
      window.clearTimeout(startupTimer);
      setAuthReady(true);
    }).catch(() => {
      if (!alive || startupExpired) return;
      window.clearTimeout(startupTimer);
      setSession(null);
      setBusinesses([]);
      setActiveBusiness(null);
      setError("No pudimos comprobar tu sesión. Comprueba tu conexión e inténtalo de nuevo.");
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update-password");
        setPassword("");
        setError("");
        setNotice("Ya casi está: elige una contraseña nueva.");
      }
      setSession(currentSession);
      if (!currentSession) {
        setBusinesses([]); setActiveBusiness(null); setProducts([]); setCategories([]); setScreen("home");
      } else if (event !== "PASSWORD_RECOVERY") {
        if (startupExpired) {
          startupExpired = false;
          window.clearTimeout(startupTimer);
          setError("");
          setAuthReady(true);
        }
        queueMicrotask(() => loadBusinesses(currentSession.user.id).catch((e) => setError(friendlyError(e))));
      }
    });
    return () => { alive = false; window.clearTimeout(startupTimer); subscription.unsubscribe(); };
  }, [loadBusinesses]);



  async function loadBankDashboard() {
    const requestId = ++bankDashboardRequestRef.current;
    const emptyDashboard = { accounts: [], movements: [], movement_count: 0, summary: { account_count: 0, balance_minor: 0, income_month_minor: 0, expenses_month_minor: 0 } };
    const businessId = activeBusiness?.id || null;
    setBankDashboard(emptyDashboard);
    setBankDashboardBusinessId(null);
    if (!businessId || !isBusinessManager) {
      setBankLoading(false);
      return;
    }
    setBankLoading(true);
    try {
      const { data, error: queryError } = await supabase.rpc("bank_dashboard", { p_business_id: businessId, p_limit: 200, p_offset: 0 });
      if (queryError) throw queryError;
      if (requestId !== bankDashboardRequestRef.current) return;
      setBankDashboard(data || emptyDashboard);
      setBankDashboardBusinessId(businessId);
    } catch (e) {
      if (requestId === bankDashboardRequestRef.current) setError(friendlyError(e));
    } finally {
      if (requestId === bankDashboardRequestRef.current) setBankLoading(false);
    }
  }

  async function loadBankAccountOptions() {
    setBankAccountOptions([]);
    if (!activeBusiness?.id || !isBusinessManager) return;
    const { data, error: queryError } = await supabase.from("bank_accounts")
      .select("id,business_id,bank_name,account_name,account_type,account_last4,currency_code,is_active")
      .eq("business_id", activeBusiness.id).eq("is_active", true).order("bank_name").order("account_name");
    if (queryError) {
      setBankAccountOptions([]);
      if (screen === "banks") setError(friendlyError(queryError));
      return;
    }
    setBankAccountOptions(data || []);
  }

  async function createBankAccount(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !isBusinessManager || bankSaving) return;
    const bankName = bankAccountDraft.bank_name.trim();
    const accountName = bankAccountDraft.account_name.trim();
    const last4 = bankAccountDraft.account_last4.trim();
    const opening = toMinorUnits(bankAccountDraft.opening_balance || 0, currencyCode);
    if (!bankName || !accountName) { setError("Indica la entidad y un nombre para identificar la cuenta."); return; }
    if (last4 && !/^[0-9]{4}$/.test(last4)) { setError("El número de cuenta debe terminar en exactamente cuatro dígitos."); return; }
    if (!bankEditingAccountId && !Number.isSafeInteger(opening)) { setError("El saldo inicial no es válido."); return; }
    if (!bankEditingAccountId && bankAccountDraft.opening_balance_date > todayInBogota()) { setError("La fecha del saldo inicial no puede estar en el futuro."); return; }
    setBankSaving(true); setError(""); setNotice("");
    try {
      const accountDetails = {
        bank_name: bankName, account_name: accountName,
        account_type: bankAccountDraft.account_type, account_last4: last4 || null,
        account_holder: bankAccountDraft.account_holder.trim() || null,
        notes: bankAccountDraft.notes.trim() || null,
        updated_at: new Date().toISOString()
      };
      if (bankEditingAccountId) {
        const { data, error: updateError } = await supabase.from("bank_accounts").update(accountDetails)
          .eq("business_id", activeBusiness.id).eq("id", bankEditingAccountId).select("id").maybeSingle();
        if (updateError) throw updateError;
        if (!data) throw new Error("No se pudo actualizar la cuenta bancaria.");
      } else {
        const { error: insertError } = await supabase.from("bank_accounts").insert({
          business_id: activeBusiness.id, ...accountDetails, currency_code: currencyCode,
          opening_balance_minor: opening,
          opening_balance_date: bankAccountDraft.opening_balance_date || todayInBogota()
        });
        if (insertError) throw insertError;
      }
      setBankAccountDraft({ bank_name: "", account_name: "", account_type: "savings", account_last4: "", account_holder: "", opening_balance: "0", opening_balance_date: todayInBogota(), notes: "" });
      setBankAccountFormOpen(false);
      setBankEditingAccountId(null);
      setNotice(bankEditingAccountId ? "Cuenta bancaria actualizada. El saldo y el historial se conservaron." : "Cuenta bancaria guardada. El saldo inicial quedó registrado sin alterar tus ingresos ni gastos.");
      await loadBankDashboard();
      await loadBankAccountOptions();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBankSaving(false); }
  }

  function editBankAccount(account) {
    if (!account?.id || !isBusinessManager) return;
    setBankEditingAccountId(account.id);
    setBankAccountDraft({
      bank_name: account.bank_name || "", account_name: account.account_name || "",
      account_type: account.account_type || "savings", account_last4: account.account_last4 || "",
      account_holder: account.account_holder || "", opening_balance: "0",
      opening_balance_date: account.opening_balance_date || todayInBogota(), notes: account.notes || ""
    });
    setBankAccountFormOpen(true); setBankMovementFormOpen(false); setBankTransferFormOpen(false);
    setError(""); setNotice("");
  }

  async function createBankMovement(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !isBusinessManager || bankSaving) return;
    const amount = toMinorUnits(bankMovementDraft.amount, currencyCode);
    if (!bankMovementDraft.bank_account_id) { setError("Selecciona la cuenta bancaria del movimiento."); return; }
    if (!bankMovementDraft.description.trim()) { setError("Describe el movimiento."); return; }
    if (!Number.isSafeInteger(amount) || amount <= 0) { setError("El importe debe ser mayor que cero."); return; }
    if (bankMovementDraft.movement_date > todayInBogota()) { setError("La fecha del movimiento no puede estar en el futuro."); return; }
    setBankSaving(true); setError(""); setNotice("");
    try {
      const { error: insertError } = await supabase.from("bank_movements").insert({
        business_id: activeBusiness.id, bank_account_id: bankMovementDraft.bank_account_id,
        movement_type: bankMovementDraft.movement_type, amount_minor: amount,
        movement_date: bankMovementDraft.movement_date, description: bankMovementDraft.description.trim(),
        category: bankMovementDraft.category.trim() || (bankMovementDraft.movement_type === "income" ? "Otros ingresos" : "Otros egresos"),
        counterparty: bankMovementDraft.counterparty.trim() || null,
        reference: bankMovementDraft.reference.trim() || null, notes: bankMovementDraft.notes.trim() || null
      });
      if (insertError) throw insertError;
      setBankMovementDraft({ movement_type: "income", bank_account_id: "", amount: "", movement_date: todayInBogota(), description: "", category: "", counterparty: "", reference: "", notes: "" });
      setBankMovementFormOpen(false);
      setNotice("Movimiento bancario registrado.");
      await loadBankDashboard();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBankSaving(false); }
  }

  async function createBankTransfer(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !isBusinessManager || bankSaving) return;
    const amount = toMinorUnits(bankTransferDraft.amount, currencyCode);
    if (!bankTransferDraft.from_account_id || !bankTransferDraft.to_account_id || bankTransferDraft.from_account_id === bankTransferDraft.to_account_id) {
      setError("Selecciona una cuenta de origen y otra cuenta de destino.");
      return;
    }
    if (!Number.isSafeInteger(amount) || amount <= 0) { setError("El importe de la transferencia debe ser mayor que cero."); return; }
    if (bankTransferDraft.movement_date > todayInBogota()) { setError("La fecha de la transferencia no puede estar en el futuro."); return; }
    setBankSaving(true); setError(""); setNotice("");
    try {
      const { error: transferError } = await supabase.rpc("create_bank_transfer", {
        p_business_id: activeBusiness.id, p_from_account_id: bankTransferDraft.from_account_id,
        p_to_account_id: bankTransferDraft.to_account_id, p_amount_minor: amount,
        p_movement_date: bankTransferDraft.movement_date,
        p_description: bankTransferDraft.description.trim() || null,
        p_reference: bankTransferDraft.reference.trim() || null,
        p_notes: bankTransferDraft.notes.trim() || null
      });
      if (transferError) throw transferError;
      setBankTransferDraft({ from_account_id: "", to_account_id: "", amount: "", movement_date: todayInBogota(), description: "Transferencia entre cuentas propias", reference: "", notes: "" });
      setBankTransferFormOpen(false);
      setNotice("Transferencia guardada. Se registró una salida y una entrada vinculadas, sin sumarse a ingresos ni gastos.");
      await loadBankDashboard();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBankSaving(false); }
  }

  async function toggleBankAccountActive(account) {
    if (!activeBusiness?.id || !isBusinessManager || !account?.id || bankSaving) return;
    setBankSaving(true); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await supabase.from("bank_accounts")
        .update({ is_active: !account.is_active, updated_at: new Date().toISOString() })
        .eq("business_id", activeBusiness.id).eq("id", account.id)
        .select("id,is_active").maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("No se pudo actualizar la cuenta bancaria.");
      setNotice(data.is_active ? "Cuenta bancaria reactivada." : "Cuenta bancaria desactivada. Su historial se conserva.");
      await loadBankDashboard();
      await loadBankAccountOptions();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBankSaving(false); }
  }

  function renderBanksPage() {
    const accounts = bankDashboard.accounts || [];
    const movements = bankDashboard.movements || [];
    const query = bankSearch.trim().toLocaleLowerCase("es");
    const filteredMovements = movements.filter((item) => {
      const typeMatches = bankMovementFilter === "all"
        || (bankMovementFilter === "income" && item.movement_type === "income")
        || (bankMovementFilter === "expense" && item.movement_type === "expense")
        || (bankMovementFilter === "transfers" && ["transfer_in", "transfer_out"].includes(item.movement_type));
      const textMatches = !query || [item.description, item.category, item.counterparty, item.reference, item.bank_name, item.account_name]
        .filter(Boolean).join(" ").toLocaleLowerCase("es").includes(query);
      return typeMatches && textMatches;
    });
    const accountTypeLabels = { savings: "Ahorros", checking: "Corriente", wallet: "Billetera digital", other: "Otra" };
    const movementLabels = { income: "Ingreso", expense: "Egreso", transfer_in: "Transferencia recibida", transfer_out: "Transferencia enviada", adjustment_in: "Ajuste de entrada", adjustment_out: "Ajuste de salida" };
    const positiveTypes = ["income", "transfer_in", "adjustment_in"];
    return (
      <section className="banks-page">
        <div className="products-intro banks-intro">
          <div><p className="eyebrow">TESORERÍA DEL NEGOCIO</p><h2>Bancos y billeteras</h2><p>Controla los saldos, registra movimientos y consulta cómo entra y sale el dinero de tus cuentas.</p></div>
          <div className="banks-actions">
            <button type="button" className="secondary-button compact-button" disabled={bankLoading || bankSaving} onClick={loadBankDashboard}>Actualizar</button>
            <button type="button" className="secondary-button compact-button" onClick={() => { setBankEditingAccountId(null); setBankAccountDraft({ bank_name: "", account_name: "", account_type: "savings", account_last4: "", account_holder: "", opening_balance: "0", opening_balance_date: todayInBogota(), notes: "" }); setBankAccountFormOpen((v) => !v); setBankMovementFormOpen(false); setBankTransferFormOpen(false); }}>＋ Nueva cuenta</button>
            <button type="button" className="secondary-button compact-button" disabled={!visibleBankAccountOptions.length} onClick={() => { setBankMovementFormOpen((v) => !v); setBankAccountFormOpen(false); setBankTransferFormOpen(false); }}>＋ Movimiento</button>
            <button type="button" className="primary-button compact-button" disabled={visibleBankAccountOptions.length < 2} onClick={() => { setBankTransferFormOpen((v) => !v); setBankAccountFormOpen(false); setBankMovementFormOpen(false); }}>⇄ Transferir</button>
          </div>
        </div>
        <div className="bank-summary-grid">
          <article className="bank-summary-card panel"><span>Saldo consolidado</span><strong>{money(bankDashboard.summary?.balance_minor || 0, currencyCode)}</strong><small>{bankDashboard.summary?.account_count || 0} cuentas activas</small></article>
          <article className="bank-summary-card panel"><span>Entradas del mes</span><strong className="bank-positive">{money(bankDashboard.summary?.income_month_minor || 0, currencyCode)}</strong><small>Dinero recibido en las cuentas</small></article>
          <article className="bank-summary-card panel"><span>Salidas del mes</span><strong>{money(bankDashboard.summary?.expenses_month_minor || 0, currencyCode)}</strong><small>Pagos y egresos de las cuentas</small></article>
        </div>
        {bankAccountFormOpen && <form className="bank-form panel" onSubmit={createBankAccount}>
          <div className="bank-form-heading"><div><span className="eyebrow">{bankEditingAccountId ? "EDITAR CUENTA" : "NUEVA CUENTA"}</span><h3>{bankEditingAccountId ? "Actualizar datos de la cuenta" : "Registrar cuenta bancaria o billetera"}</h3><p>Solo guardamos los últimos cuatro dígitos; nunca las claves ni los números completos.</p></div></div>
          <div className="bank-form-grid">
            <label><span>Entidad financiera *</span><input value={bankAccountDraft.bank_name} onChange={(e) => setBankAccountDraft((v) => ({ ...v, bank_name: e.target.value }))} maxLength={120} required placeholder="Ej. Bancolombia, Nequi" /></label>
            <label><span>Nombre para identificarla *</span><input value={bankAccountDraft.account_name} onChange={(e) => setBankAccountDraft((v) => ({ ...v, account_name: e.target.value }))} maxLength={120} required placeholder="Ej. Ahorros principal" /></label>
            <label><span>Tipo de cuenta</span><select value={bankAccountDraft.account_type} onChange={(e) => setBankAccountDraft((v) => ({ ...v, account_type: e.target.value }))}><option value="savings">Cuenta de ahorros</option><option value="checking">Cuenta corriente</option><option value="wallet">Billetera digital</option><option value="other">Otra</option></select></label>
            <label><span>Últimos cuatro dígitos</span><input inputMode="numeric" value={bankAccountDraft.account_last4} onChange={(e) => setBankAccountDraft((v) => ({ ...v, account_last4: e.target.value.replace(/[^0-9]/g, "").slice(-4) }))} maxLength={4} placeholder="Opcional" /></label>
            <label><span>Titular</span><input value={bankAccountDraft.account_holder} onChange={(e) => setBankAccountDraft((v) => ({ ...v, account_holder: e.target.value }))} maxLength={120} placeholder="Nombre del titular" /></label>
            <label><span>Moneda</span><input value={currencyCode} readOnly /></label>
            {!bankEditingAccountId && <><label><span>Saldo inicial *</span><input type="number" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={bankAccountDraft.opening_balance} onChange={(e) => setBankAccountDraft((v) => ({ ...v, opening_balance: e.target.value }))} required /></label>
            <label><span>Fecha del saldo inicial</span><input type="date" max={todayInBogota()} value={bankAccountDraft.opening_balance_date} onChange={(e) => setBankAccountDraft((v) => ({ ...v, opening_balance_date: e.target.value }))} required /></label></>}
            {bankEditingAccountId && <p className="helper-text bank-form-full">El saldo inicial y su fecha no se modifican al editar una cuenta, para conservar la trazabilidad de los movimientos.</p>}
            <label className="bank-form-full"><span>Notas</span><input value={bankAccountDraft.notes} onChange={(e) => setBankAccountDraft((v) => ({ ...v, notes: e.target.value }))} maxLength={1000} placeholder="Información útil para identificar la cuenta" /></label>
          </div>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => { setBankAccountFormOpen(false); setBankEditingAccountId(null); }}>Cancelar</button><button type="submit" className="primary-button" disabled={bankSaving}>{bankSaving ? "Guardando…" : bankEditingAccountId ? "Guardar cambios" : "Guardar cuenta"}</button></div>
        </form>}
        {bankMovementFormOpen && <form className="bank-form panel" onSubmit={createBankMovement}>
          <div className="bank-form-heading"><div><span className="eyebrow">MOVIMIENTO MANUAL</span><h3>Registrar ingreso o egreso</h3><p>Los abonos de ventas, pagos a proveedores y gastos pueden vincularse automáticamente desde sus respectivos módulos.</p></div></div>
          <div className="bank-form-grid">
            <label><span>Tipo de movimiento</span><select value={bankMovementDraft.movement_type} onChange={(e) => setBankMovementDraft((v) => ({ ...v, movement_type: e.target.value }))}><option value="income">Ingreso</option><option value="expense">Egreso</option></select></label>
            <label><span>Cuenta *</span><select value={bankMovementDraft.bank_account_id} onChange={(e) => setBankMovementDraft((v) => ({ ...v, bank_account_id: e.target.value }))} required><option value="">Seleccionar cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>
            <label><span>Descripción *</span><input value={bankMovementDraft.description} onChange={(e) => setBankMovementDraft((v) => ({ ...v, description: e.target.value }))} maxLength={220} required placeholder="Ej. Intereses recibidos" /></label>
            <label><span>Valor *</span><input type="number" min="0.01" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={bankMovementDraft.amount} onChange={(e) => setBankMovementDraft((v) => ({ ...v, amount: e.target.value }))} required /></label>
            <label><span>Fecha *</span><input type="date" max={todayInBogota()} value={bankMovementDraft.movement_date} onChange={(e) => setBankMovementDraft((v) => ({ ...v, movement_date: e.target.value }))} required /></label>
            <label><span>Categoría</span><input value={bankMovementDraft.category} onChange={(e) => setBankMovementDraft((v) => ({ ...v, category: e.target.value }))} maxLength={100} placeholder={bankMovementDraft.movement_type === "income" ? "Otros ingresos" : "Otros egresos"} /></label>
            <label><span>Persona o empresa</span><input value={bankMovementDraft.counterparty} onChange={(e) => setBankMovementDraft((v) => ({ ...v, counterparty: e.target.value }))} maxLength={180} /></label>
            <label><span>Referencia</span><input value={bankMovementDraft.reference} onChange={(e) => setBankMovementDraft((v) => ({ ...v, reference: e.target.value }))} maxLength={180} /></label>
            <label className="bank-form-full"><span>Notas</span><input value={bankMovementDraft.notes} onChange={(e) => setBankMovementDraft((v) => ({ ...v, notes: e.target.value }))} maxLength={1000} /></label>
          </div>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setBankMovementFormOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={bankSaving}>{bankSaving ? "Guardando…" : "Guardar movimiento"}</button></div>
        </form>}
        {bankTransferFormOpen && <form className="bank-form panel" onSubmit={createBankTransfer}>
          <div className="bank-form-heading"><div><span className="eyebrow">ENTRE CUENTAS PROPIAS</span><h3>Transferir dinero</h3><p>Se crean dos registros vinculados: salida en origen y entrada en destino. No se contabiliza como ingreso o gasto.</p></div></div>
          <div className="bank-form-grid">
            <label><span>Cuenta de origen *</span><select value={bankTransferDraft.from_account_id} onChange={(e) => setBankTransferDraft((v) => ({ ...v, from_account_id: e.target.value }))} required><option value="">Seleccionar origen</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}</option>)}</select></label>
            <label><span>Cuenta de destino *</span><select value={bankTransferDraft.to_account_id} onChange={(e) => setBankTransferDraft((v) => ({ ...v, to_account_id: e.target.value }))} required><option value="">Seleccionar destino</option>{bankAccountOptions.filter((a) => a.currency_code === currencyCode && a.id !== bankTransferDraft.from_account_id).map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}</option>)}</select></label>
            <label><span>Valor *</span><input type="number" min="0.01" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={bankTransferDraft.amount} onChange={(e) => setBankTransferDraft((v) => ({ ...v, amount: e.target.value }))} required /></label>
            <label><span>Fecha *</span><input type="date" max={todayInBogota()} value={bankTransferDraft.movement_date} onChange={(e) => setBankTransferDraft((v) => ({ ...v, movement_date: e.target.value }))} required /></label>
            <label><span>Descripción</span><input value={bankTransferDraft.description} onChange={(e) => setBankTransferDraft((v) => ({ ...v, description: e.target.value }))} maxLength={220} /></label>
            <label><span>Referencia</span><input value={bankTransferDraft.reference} onChange={(e) => setBankTransferDraft((v) => ({ ...v, reference: e.target.value }))} maxLength={180} /></label>
            <label className="bank-form-full"><span>Notas</span><input value={bankTransferDraft.notes} onChange={(e) => setBankTransferDraft((v) => ({ ...v, notes: e.target.value }))} maxLength={1000} /></label>
          </div>
          <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setBankTransferFormOpen(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={bankSaving}>{bankSaving ? "Transfiriendo…" : "Registrar transferencia"}</button></div>
        </form>}
        <div className="bank-section-heading"><div><h3>Mis cuentas</h3><p>Los saldos incluyen el saldo inicial y los movimientos registrados desde Bancos.</p></div><span className="count-label">{accounts.length} cuentas</span></div>
        {bankLoading && !accounts.length ? <div className="empty-state">Consultando cuentas bancarias…</div> : accounts.length ? <div className="bank-accounts-grid">
          {accounts.map((account) => <article key={account.id} className={"bank-account-card panel" + (!account.is_active ? " bank-account-inactive" : "")}>
            <div className="bank-account-top"><span className="bank-account-icon"><AppIcon name={account.account_type === "wallet" ? "payments" : "banks"} size={22} /></span><span className={"status-pill " + (account.is_active ? "status-active" : "status-inactive")}>{account.is_active ? "Activa" : "Inactiva"}</span></div>
            <div className="bank-account-name"><h4>{account.bank_name}</h4><p>{account.account_name} · {accountTypeLabels[account.account_type] || "Cuenta"}{account.account_last4 ? " · •••• " + account.account_last4 : ""}</p></div>
            <strong className="bank-account-balance">{money(account.balance_minor || 0, account.currency_code || currencyCode)}</strong>
            <small>Saldo inicial: {money(account.opening_balance_minor || 0, account.currency_code || currencyCode)} · Desde {account.opening_balance_date || "—"}</small>
            {account.account_holder && <small>Titular: {account.account_holder}</small>}
            <div className="bank-account-actions"><button type="button" className="secondary-button action-small" disabled={bankSaving} onClick={() => editBankAccount(account)}>Editar</button><button type="button" className="secondary-button action-small" disabled={bankSaving} onClick={() => toggleBankAccountActive(account)}>{account.is_active ? "Desactivar" : "Reactivar"}</button></div>
          </article>)}
        </div> : <div className="empty-state"><span className="empty-icon">▥</span><h3>Aún no tienes cuentas bancarias</h3><p>Registra Bancolombia, Banco de Bogotá, Nequi, Daviplata u otras cuentas que utilice tu negocio. No necesitas conectar tus claves bancarias.</p><button type="button" className="primary-button" onClick={() => setBankAccountFormOpen(true)}>＋ Registrar primera cuenta</button></div>}
        <section className="bank-movements-section panel">
          <div className="bank-section-heading"><div><h3>Movimientos bancarios</h3><p>Ingresos, egresos y transferencias de las cuentas registradas.</p></div><span className="count-label">{bankDashboard.movement_count || movements.length} registros</span></div>
          <div className="bank-movement-toolbar"><input value={bankSearch} onChange={(e) => setBankSearch(e.target.value)} placeholder="Buscar movimiento, entidad o referencia" aria-label="Buscar movimientos bancarios" />
            <div className="stats-period-buttons" role="group" aria-label="Filtrar movimientos bancarios">{[["all", "Todos"], ["income", "Ingresos"], ["expense", "Egresos"], ["transfers", "Transferencias"]].map(([value, label]) => <button type="button" key={value} className={bankMovementFilter === value ? "stats-period-button active" : "stats-period-button"} aria-pressed={bankMovementFilter === value} onClick={() => setBankMovementFilter(value)}>{label}</button>)}</div>
          </div>
          {bankLoading && !movements.length ? <div className="empty-state">Cargando movimientos…</div> : filteredMovements.length ? <div className="bank-movement-list">
            {filteredMovements.map((movement) => { const positive = positiveTypes.includes(movement.movement_type); return <article className="bank-movement-row" key={movement.id}>
              <span className={"bank-movement-mark " + (positive ? "bank-positive" : "bank-negative")}>{positive ? "＋" : "−"}</span>
              <div className="bank-movement-main"><strong>{movement.description}</strong><span>{movement.bank_name} · {movement.account_name} · {movement.movement_date}</span><small>{movementLabels[movement.movement_type] || movement.movement_type}{movement.category ? " · " + movement.category : ""}{movement.counterparty ? " · " + movement.counterparty : ""}{movement.reference ? " · Ref. " + movement.reference : ""}</small></div>
              <strong className={"bank-movement-amount " + (positive ? "bank-positive" : "bank-negative")}>{positive ? "+" : "−"}{money(movement.amount_minor, movement.currency_code || currencyCode)}</strong>
            </article>;})}
          </div> : <div className="empty-state"><h3>No hay movimientos para mostrar</h3><p>Los nuevos abonos y pagos asociados a cuentas bancarias aparecerán aquí automáticamente. También puedes registrar movimientos manuales.</p></div>}
          <p className="bank-footnote">Los pagos en efectivo pertenecen a Caja. Las transferencias entre tus propias cuentas no incrementan los ingresos ni los gastos. Los movimientos de ventas, compras y gastos se conservan en sus módulos de origen.</p>
        </section>
      </section>
    );
  }

  async function loadOutstandingAccounts() {
    if (!activeBusiness?.id || !["accounts","receivables","payables"].includes(screen)) return;
    setAccountsLoading(true);
    try {
      async function fetchAll(table, columns, orderColumn) {
        const all = [];
        for (let offset = 0; offset < 50000; offset += 500) {
          const { data, error: queryError } = await supabase.from(table).select(columns)
            .eq("business_id", activeBusiness.id).order(orderColumn, { ascending: false, nullsFirst: false })
            .range(offset, offset + 499);
          if (queryError) throw queryError;
          const rows = data || []; all.push(...rows);
          if (rows.length < 500) break;
          if (offset + 500 >= 50000) throw new Error("Hay demasiados movimientos para mostrar de una sola vez. Usa los filtros del módulo correspondiente.");
        }
        return all;
      }
      if (screen === "receivables" || (screen === "accounts" && accountsTab === "receivables")) {
        const [sales, customers] = await Promise.all([
          fetchAll("sales","id,sale_number,customer_id,status,total_minor,amount_paid_minor,currency_code,sold_at,created_at,notes","sold_at"),
          supabase.from("customers").select("id,full_name,company_name,phone,whatsapp,email").eq("business_id",activeBusiness.id).then((r)=>{if(r.error)throw r.error;return r.data||[];})
        ]);
        const byId = new Map(customers.map((x)=>[x.id,x]));
        setReceivableRows(sales.filter((x)=>!["draft","canceled","cancelled","refunded"].includes(x.status))
          .map((x)=>({...x,customer:byId.get(x.customer_id)||null,balance_minor:Math.max(0,Number(x.total_minor||0)-Number(x.amount_paid_minor||0))})));
      } else {
        const [purchases, suppliers] = await Promise.all([
          fetchAll("purchases","id,purchase_number,supplier_id,status,total_minor,amount_paid_minor,currency_code,purchased_at,created_at,notes","purchased_at"),
          supabase.from("suppliers").select("id,name,phone,email,tax_id").eq("business_id",activeBusiness.id).then((r)=>{if(r.error)throw r.error;return r.data||[];})
        ]);
        const byId = new Map(suppliers.map((x)=>[x.id,x]));
        setPayableRows(purchases.filter((x)=>!["draft","canceled","cancelled","refunded"].includes(x.status))
          .map((x)=>({...x,supplier:byId.get(x.supplier_id)||null,balance_minor:Math.max(0,Number(x.total_minor||0)-Number(x.amount_paid_minor||0))})));
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally { setAccountsLoading(false); }
  }

  async function loadPlatformAdminDashboard() {
    if (!isPlatformAdmin) return;
    setPlatformAdminLoading(true);
    try {
      const { error: expiryError } = await supabase.rpc("platform_admin_expire_trials");
      if (expiryError) throw expiryError;
      const { data, error: rpcError } = await supabase.rpc("platform_admin_dashboard");
      if (rpcError) throw rpcError;
      setPlatformAdminData(data || null);
      setPlatformAdminStatusDrafts((current)=> {
        const next={...current};
        for (const row of data?.subscriptions || []) if (!(row.subscription_id in next)) next[row.subscription_id]=row.status;
        return next;
      });
      setPlatformAdminPeriodDrafts((current)=> {
        const next={...current};
        for (const row of data?.subscriptions || []) if (!(row.subscription_id in next)) next[row.subscription_id]=row.current_period_end ? new Date(row.current_period_end).toISOString().slice(0,16) : "";
        return next;
      });
    } catch (e) {
      setError(friendlyError(e));
    } finally { setPlatformAdminLoading(false); }
  }

  async function updatePlatformSubscription(row, statusOverride = null, daysToAdd = 0) {
    if (!isPlatformAdmin || !row?.business_id || platformAdminSaving) return;
    const chosenStatus = statusOverride ?? platformAdminStatusDrafts[row.subscription_id] ?? row.status;
    const draftEnd = platformAdminPeriodDrafts[row.subscription_id];
    let periodEnd = draftEnd ? new Date(draftEnd).toISOString() : row.current_period_end;
    if (daysToAdd) {
      const base = new Date(row.current_period_end || Date.now());
      base.setDate(base.getDate() + daysToAdd);
      periodEnd = base.toISOString();
    }
    const note = platformAdminNote.trim();
    setPlatformAdminSaving(true); setError(""); setNotice("");
    try {
      const { error: rpcError } = await supabase.rpc("platform_admin_update_subscription", {
        p_business_id: row.business_id,
        p_new_status: chosenStatus,
        p_period_end: periodEnd,
        p_note: note || null
      });
      if (rpcError) throw rpcError;
      setPlatformAdminNote("");
      setNotice("Estado y periodo de la suscripción guardados en el historial.");
      await loadPlatformAdminDashboard();
    } catch (e) { setError(friendlyError(e)); }
    finally { setPlatformAdminSaving(false); }
  }

  async function submitPlatformPayment(event, row) {
    event.preventDefault();
    if (!isPlatformAdmin || !row?.business_id || platformAdminSaving) return;
    const amountMinor = toMinorUnits(platformPaymentDraft.amount, "COP");
    if (!Number.isFinite(amountMinor) || amountMinor <= 0) { setError("Escribe un valor de pago mayor que cero."); return; }
    if (["Nequi","Transferencia bancaria","Wompi manual","Tarjeta manual"].includes(platformPaymentDraft.method) && !platformPaymentDraft.reference.trim()) { setError("Escribe la referencia de la transacción para poder conciliar este pago."); return; }
    setPlatformAdminSaving(true); setError(""); setNotice("");
    try {
      const { error: rpcError } = await supabase.rpc("platform_admin_record_payment", {
        p_business_id: row.business_id,
        p_billing_interval: platformPaymentDraft.interval,
        p_amount_minor: amountMinor,
        p_currency_code: "COP",
        p_payment_method: platformPaymentDraft.method,
        p_external_reference: platformPaymentDraft.reference.trim() || null,
        p_notes: platformPaymentDraft.notes.trim() || null,
        p_received_at: new Date().toISOString()
      });
      if (rpcError) throw rpcError;
      setPlatformPaymentBusiness("");
      setPlatformPaymentDraft({ interval:"month",amount:"",method:"Nequi",reference:"",notes:"" });
      setNotice("Pago confirmado manualmente; el periodo quedó extendido y el registro no se puede alterar desde la aplicación.");
      await loadPlatformAdminDashboard();
    } catch (e) { setError(friendlyError(e)); }
    finally { setPlatformAdminSaving(false); }
  }

  function downloadBlobFile(filename, content, type = "application/octet-stream") {
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = filename; anchor.style.display = "none";
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  function downloadInventoryTemplate() {
    const rows = [["Nombre","Código","Categoría","Tipo","Unidad","Precio","Costo","Cantidad","Controla inventario","Stock mínimo","Descripción","Presentación"]];
    const csv = "\uFEFF" + rows.map((row)=>row.map((cell)=>"\"" + String(cell).replace(/"/g,'""') + "\"").join(",")).join("\r\n");
    downloadBlobFile("plantilla-inventario-treseiscinco.csv",csv,"text/csv;charset=utf-8");
    setNotice("CSV descargado. Si prefieres columnas con ancho ajustado, descarga la plantilla Excel.");
  }

  function inventoryExcelDocument(headers, rows, title) {
    const widths = [180,110,140,100,80,95,95,90,100,95,230,150,130,130,110,110];
    const colgroup = headers.map((_, index) => "<col width=\"" + (widths[index] || 120) + "\" style=\"width:" + (widths[index] || 120) + "px;mso-width-source:userset\">").join("");
    const th = headers.map((value) => "<th>" + escapeHtml(value) + "</th>").join("");
    const body = rows.map((row) => "<tr>" + headers.map((_, index) => "<td>" + escapeHtml(row[index] ?? "") + "</td>").join("") + "</tr>").join("");
    return "\uFEFF<html xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:x=\"urn:schemas-microsoft-com:office:excel\" xmlns=\"http://www.w3.org/TR/REC-html40\"><head><meta charset=\"utf-8\"><title>" + escapeHtml(title) + "</title><style>body{font-family:Calibri,Arial,sans-serif}h1{font-size:18pt;color:#164E63}table{border-collapse:collapse;table-layout:fixed}th{background:#DDF1EE;color:#163B45;font-weight:bold;border:1px solid #AFC9CC;padding:7px;text-align:left}td{border:1px solid #D9E2E5;padding:6px;vertical-align:top;mso-number-format:\\\"\\@\\\";overflow-wrap:anywhere}tr:nth-child(even) td{background:#F6FAFA}</style></head><body><h1>" + escapeHtml(title) + "</h1><table><colgroup>" + colgroup + "</colgroup><thead><tr>" + th + "</tr></thead><tbody>" + body + "</tbody></table></body></html>";
  }

  function downloadInventoryTemplateExcel() {
    const headers = ["Nombre","Código","Categoría","Tipo","Unidad","Precio","Costo","Cantidad","Controla inventario","Stock mínimo","Descripción","Presentación"];
    const sample = [["Ej. Camiseta blanca","SKU-001","Ropa","Producto físico","Unidad","35000","18000","10","Sí","2","Descripción breve","Talla M"]];
    downloadBlobFile("plantilla-inventario-treseiscinco.xls", inventoryExcelDocument(headers, sample, "Plantilla de inventario treseiscinco"), "application/vnd.ms-excel;charset=utf-8");
    setNotice("Plantilla Excel descargada. Complétala y vuelve a subirla en .xls o .xlsx; también puedes guardarla como CSV UTF-8. La fila de ejemplo se omite.");
  }

  async function getInventoryReportData() {
    if (!activeBusiness?.id || !canAccessScreen("products")) throw new Error("No tienes acceso al inventario de este negocio.");
    const [products, variants, categoriesResult] = await Promise.all([
      fetchAllProfitabilityRows(() => supabase.from("products").select("id,business_id,category_id,sku,name,description,product_type,unit_name,sale_price_minor,cost_price_minor,stock_on_hand,track_inventory,low_stock_threshold,is_sellable,is_published,metadata,archived_at").eq("business_id", activeBusiness.id).is("archived_at", null).order("name"), "productos del inventario"),
      fetchAllProfitabilityRows(() => supabase.from("product_variants").select("id,business_id,product_id,variant_name,variant_value,sku,sale_price_minor,stock_on_hand,is_active,image_paths").eq("business_id", activeBusiness.id).order("variant_name").order("variant_value"), "variantes del inventario"),
      supabase.from("product_categories").select("id,name").eq("business_id", activeBusiness.id).order("name")
    ]);
    if (categoriesResult.error) throw categoriesResult.error;
    const categoryNames = new Map((categoriesResult.data || []).map((category) => [category.id, category.name]));
    const byProduct = new Map();
    for (const variant of variants) {
      if (!byProduct.has(variant.product_id)) byProduct.set(variant.product_id, []);
      byProduct.get(variant.product_id).push(variant);
    }
    const rows = [];
    for (const product of products) {
      const productBase = [
        product.name, product.sku || "", categoryNames.get(product.category_id) || "", product.product_type || "",
        product.unit_name || "", Number(product.sale_price_minor || 0) / (10 ** currencyDigits(currencyCode)),
        Number(product.cost_price_minor || 0) / (10 ** currencyDigits(currencyCode)),
        product.track_inventory ? Number(product.stock_on_hand || 0) : "No aplica",
        product.track_inventory ? "Sí" : "No",
        product.low_stock_threshold == null ? "" : product.low_stock_threshold,
        product.description || "", product.is_published ? "Publicado" : "No publicado",
        product.is_sellable ? "Vendible" : "No vendible", product.metadata?.tax_code || "none"
      ];
      const productVariants = byProduct.get(product.id) || [];
      if (!productVariants.length) rows.push([...productBase, "", "", "", "", "", ""]);
      else for (const variant of productVariants) rows.push([
        ...productBase, variant.variant_name, variant.variant_value, variant.sku || "",
        variant.sale_price_minor == null ? "" : Number(variant.sale_price_minor) / (10 ** currencyDigits(currencyCode)),
        variant.stock_on_hand == null ? "" : variant.stock_on_hand, (variant.image_paths || []).length + " foto(s)"
      ]);
    }
    return rows;
  }

  async function downloadInventoryReportExcel() {
    setBusy(true); setError(""); setNotice("");
    try {
      const rows = await getInventoryReportData();
      const headers = ["Artículo","Código","Categoría","Tipo","Unidad","Precio","Costo","Existencias","Controla inventario","Stock mínimo","Descripción","Estado de catálogo","Estado de venta","Impuesto","Tipo de variante","Valor de variante","Código de variante","Precio de variante","Existencias de variante","Fotos de variante"];
      downloadBlobFile("reporte-inventario-treseiscinco.xls", inventoryExcelDocument(headers, rows, "Reporte completo de inventario · " + (activeBusiness?.name || "treseiscinco")), "application/vnd.ms-excel;charset=utf-8");
      setNotice("Reporte Excel generado: " + rows.length + " fila(s), incluyendo las variantes.");
    } catch (error) { setError(friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function printInventoryReportPdf() {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) { setError("Permite las ventanas emergentes para preparar el PDF del inventario."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const rows = await getInventoryReportData();
      const headers = ["Artículo","Código","Categoría","Precio","Costo","Existencias","Impuesto","Variante","Valor","SKU variante","Precio variante","Stock variante","Fotos"];
      const mapRows = rows.map((row) => [row[0],row[1],row[2],row[5],row[6],row[7],row[13],row[14],row[15],row[16],row[17],row[18],row[19]]);
      const table = "<table><thead><tr>" + headers.map((value) => "<th>" + escapeHtml(value) + "</th>").join("") + "</tr></thead><tbody>" + mapRows.map((row) => "<tr>" + row.map((cell) => "<td>" + escapeHtml(cell ?? "") + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
      reportWindow.document.open();
      reportWindow.document.write("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>Inventario · treseiscinco</title><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial,sans-serif;color:#173744;font-size:8pt}h1{font-size:17pt;margin:0 0 5mm}p{color:#60757C;font-size:9pt}table{width:100%;border-collapse:collapse;table-layout:fixed}th,td{border:1px solid #C9DADD;padding:4px;overflow-wrap:anywhere;vertical-align:top}th{background:#DDF1EE;text-align:left}tr:nth-child(even) td{background:#F6FAFA}@media print{button{display:none}}</style></head><body><h1>Reporte de inventario · " + escapeHtml(activeBusiness?.name || "treseiscinco") + "</h1><p>" + rows.length + " fila(s), incluye productos y variantes. Generado el " + new Date().toLocaleString("es-CO",{timeZone:"America/Bogota"}) + ".</p>" + table + "</body></html>");
      reportWindow.document.close();
      reportWindow.focus();
      reportWindow.setTimeout(() => reportWindow.print(), 250);
      setNotice("Reporte preparado para guardar como PDF.");
    } catch (error) { reportWindow.close(); setError(friendlyError(error)); }
    finally { setBusy(false); }
  }

  async function importInventoryFile(event) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    input.value = "";
    if (!file || !activeBusiness?.id || !canManageProducts || inventoryImportBusy) return;
    if (file.size > 10 * 1024 * 1024) { setError("El archivo no puede superar 10 MB."); return; }
    if (!/\.(csv|xls|xlsx)$/i.test(file.name)) { setError("Selecciona la plantilla de inventario .xls/.xlsx o un archivo CSV."); return; }
    setInventoryImportBusy(true); setInventoryImportProgress("Leyendo archivo…"); setError(""); setNotice("");
    const failures = [];
    let imported = 0, skipped = 0;
    try {
      const parseDelimitedRows = (rawText) => {
        const source = String(rawText || "").replace(/^\uFEFF/,"");
        const firstLine = source.split(/\r?\n/,1)[0] || "";
        const delimiter = (firstLine.match(/;/g)||[]).length > (firstLine.match(/,/g)||[]).length ? ";" : ",";
        const rows = [];
        let row=[], cell="", quoted=false;
        for (let i=0;i<source.length;i++) {
          const ch=source[i];
          if (ch === '"' && quoted && source[i+1] === '"') { cell+='"'; i++; }
          else if (ch === '"') quoted=!quoted;
          else if (ch === delimiter && !quoted) { row.push(cell); cell=""; }
          else if ((ch === "\n" || ch === "\r") && !quoted) {
            if (ch === "\r" && source[i+1] === "\n") i++;
            row.push(cell); if (row.some((x)=>String(x).trim())) rows.push(row);
            row=[]; cell="";
          } else cell+=ch;
        }
        if (cell.length || row.length) { row.push(cell); if (row.some((x)=>String(x).trim())) rows.push(row); }
        return rows;
      };
      const parseHtmlExcelRows = (rawText) => {
        const documentHtml = new DOMParser().parseFromString(String(rawText || "").replace(/^\uFEFF/,""),"text/html");
        const table = documentHtml.querySelector("table");
        if (!table) throw new Error("El archivo .xls no tiene el formato de la plantilla descargada. Guárdalo como .xlsx o CSV UTF-8 desde Excel.");
        return Array.from(table.querySelectorAll("tr")).map((tr)=>Array.from(tr.querySelectorAll("th,td")).map((cell)=>String(cell.textContent||"").trim())).filter((row)=>row.some((cell)=>cell.trim()));
      };
      const parseXlsxRows = async (selectedFile) => {
        if (typeof DecompressionStream === "undefined") throw new Error("Este navegador no puede leer .xlsx directamente. Guarda el archivo como CSV UTF-8 e impórtalo de nuevo.");
        const bytes = new Uint8Array(await selectedFile.arrayBuffer());
        const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
        const decoder = new TextDecoder("utf-8");
        let endRecord = -1;
        for (let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--) {
          if (view.getUint32(i,true)===0x06054b50) { endRecord=i; break; }
        }
        if (endRecord<0) throw new Error("El archivo no parece ser un libro .xlsx válido.");
        const totalEntries=view.getUint16(endRecord+10,true);
        let cursor=view.getUint32(endRecord+16,true);
        if (totalEntries===0xffff || cursor===0xffffffff) throw new Error("Este libro Excel usa un formato ZIP avanzado que no es compatible.");
        const entries=new Map();
        for(let i=0;i<totalEntries;i++) {
          if(cursor+46>bytes.length || view.getUint32(cursor,true)!==0x02014b50) throw new Error("La estructura interna del libro Excel está dañada.");
          const method=view.getUint16(cursor+10,true), compressedSize=view.getUint32(cursor+20,true), uncompressedSize=view.getUint32(cursor+24,true);
          const nameLength=view.getUint16(cursor+28,true), extraLength=view.getUint16(cursor+30,true), commentLength=view.getUint16(cursor+32,true), localOffset=view.getUint32(cursor+42,true);
          const name=decoder.decode(bytes.slice(cursor+46,cursor+46+nameLength));
          entries.set(name,{method,compressedSize,uncompressedSize,localOffset});
          cursor+=46+nameLength+extraLength+commentLength;
        }
        const readZipText=async (name,optional=false) => {
          const entry=entries.get(name);
          if(!entry) { if(optional) return ""; throw new Error("El libro Excel no contiene la hoja necesaria para importar."); }
          if(entry.uncompressedSize>15*1024*1024) throw new Error("Una parte del libro Excel es demasiado grande para importarla de forma segura.");
          const offset=entry.localOffset;
          if(view.getUint32(offset,true)!==0x04034b50) throw new Error("Una parte del libro Excel está dañada.");
          const localNameLength=view.getUint16(offset+26,true), localExtraLength=view.getUint16(offset+28,true);
          const dataStart=offset+30+localNameLength+localExtraLength;
          const compressed=bytes.slice(dataStart,dataStart+entry.compressedSize);
          let plain;
          if(entry.method===0) plain=compressed;
          else if(entry.method===8) {
            const stream=new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
            plain=new Uint8Array(await new Response(stream).arrayBuffer());
          } else throw new Error("El libro Excel usa un método de compresión no compatible.");
          if(plain.length>15*1024*1024 || (entry.uncompressedSize && plain.length!==entry.uncompressedSize)) throw new Error("El contenido descomprimido del libro Excel no es válido.");
          return decoder.decode(plain);
        };
        const parseXml=(xmlText) => {
          const parsedXml=new DOMParser().parseFromString(xmlText,"application/xml");
          if(parsedXml.getElementsByTagName("parsererror").length) throw new Error("No se pudo leer la estructura XML de la plantilla Excel.");
          return parsedXml;
        };
        const normalZipPath=(path) => {
          const stack=[];
          for(const segment of String(path||"").replace(/^\/+/,"").split("/")) {
            if(!segment||segment===".") continue;
            if(segment==="..") stack.pop(); else stack.push(segment);
          }
          return stack.join("/");
        };
        const workbook=parseXml(await readZipText("xl/workbook.xml"));
        const firstSheet=workbook.getElementsByTagNameNS("*","sheet")[0];
        if(!firstSheet) throw new Error("El libro Excel no contiene una hoja.");
        const relationId=firstSheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id")||firstSheet.getAttribute("r:id");
        const relationships=parseXml(await readZipText("xl/_rels/workbook.xml.rels"));
        const relation=Array.from(relationships.getElementsByTagNameNS("*","Relationship")).find((node)=>node.getAttribute("Id")===relationId);
        const target=relation?.getAttribute("Target")||"worksheets/sheet1.xml";
        const sheetPath=normalZipPath(target.startsWith("/")?target:"xl/"+target);
        const sharedText=await readZipText("xl/sharedStrings.xml",true);
        const sharedStrings=sharedText ? Array.from(parseXml(sharedText).getElementsByTagNameNS("*","si")).map((node)=>Array.from(node.getElementsByTagNameNS("*","t")).map((t)=>t.textContent||"").join("")) : [];
        const worksheet=parseXml(await readZipText(sheetPath));
        const rowNodes=Array.from(worksheet.getElementsByTagNameNS("*","row"));
        if(rowNodes.length>1002) throw new Error("El libro contiene demasiadas filas. Usa un máximo de 500 artículos por archivo.");
        const rows=[];
        for(const rowNode of rowNodes) {
          const row=[];
          const cells=Array.from(rowNode.getElementsByTagNameNS("*","c"));
          for(const cellNode of cells) {
            const reference=String(cellNode.getAttribute("r")||"A1").match(/^[A-Z]+/i)?.[0]?.toUpperCase()||"A";
            let column=0;
            for(const letter of reference) column=column*26+(letter.charCodeAt(0)-64);
            column=Math.max(0,column-1);
            const cellType=cellNode.getAttribute("t")||"";
            let valueNode=cellNode.getElementsByTagNameNS("*","v")[0];
            let value=valueNode ? String(valueNode.textContent||"") : "";
            if(cellType==="s") value=sharedStrings[Number(value)]??"";
            else if(cellType==="inlineStr") value=Array.from(cellNode.getElementsByTagNameNS("*","t")).map((t)=>t.textContent||"").join("");
            else if(cellType==="b") value=value==="1"?"Sí":"No";
            row[column]=value;
          }
          if(row.some((cell)=>String(cell??"").trim())) rows.push(row);
        }
        return rows;
      };
      let parsed=[];
      const lowerFileName=file.name.toLocaleLowerCase("es");
      if(lowerFileName.endsWith(".csv")) parsed=parseDelimitedRows(await file.text());
      else if(lowerFileName.endsWith(".xls")) parsed=parseHtmlExcelRows(await file.text());
      else if(lowerFileName.endsWith(".xlsx")) parsed=await parseXlsxRows(file);
      if (parsed.length < 2) throw new Error("La plantilla no contiene filas de artículos. Completa la plantilla o agrega productos debajo de los encabezados.");
      const normalizeHeader=(value)=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().replace(/\s+/g,"_");
      const headers=parsed[0].map(normalizeHeader);
      const col=(row,...names)=>{const index=headers.findIndex((h)=>names.includes(h));return index<0?"":String(row[index]??"").trim();};
      if (!headers.some((h)=>["nombre","producto","articulo","name","product"].includes(h))) throw new Error("Falta la columna «Nombre» en la primera fila.");
      const nameColumnIndex=headers.findIndex((h)=>["nombre","producto","articulo","name","product"].includes(h));
      const skuColumnIndex=headers.findIndex((h)=>["codigo","referencia","sku","code"].includes(h));
      const dataRows=parsed.slice(1).map((csvRow,index)=>({csvRow,rowNo:index+2})).filter(({csvRow})=>{
        const rowName=String(csvRow[nameColumnIndex]??"").trim().toLocaleLowerCase("es");
        const rowCode=skuColumnIndex<0?"":String(csvRow[skuColumnIndex]??"").trim().toLocaleLowerCase("es");
        return !(rowName==="ej. camiseta blanca" && rowCode==="sku-001");
      });
      if (!dataRows.length) throw new Error("La plantilla solo contiene su fila de ejemplo. Reemplázala con un artículo real o agrega tus artículos debajo de los encabezados.");
      if (dataRows.length>500) throw new Error("La carga inicial admite hasta 500 artículos por archivo. Divide la plantilla en varios archivos Excel o CSV.");

      const {data:currentProducts,error:currentError}=await supabase.from("products").select("sku,name").eq("business_id",activeBusiness.id).is("archived_at",null);
      if (currentError) throw currentError;
      const existingCodes=new Set((currentProducts||[]).map((x)=>String(x.sku||"").trim().toLocaleLowerCase()).filter(Boolean));
      const fileCodes=new Set();
      const categoryMap=new Map(categories.map((x)=>[String(x.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),x.id]));
      const toBool=(v)=>/^(si|sí|s|true|1|yes|y)$/i.test(String(v||"").trim());
      const parseNumber=(v, fallback=0)=>{
        let raw=String(v??"").trim().replace(/\\s/g,"");
        if (!raw) return fallback;
        raw=raw.replace(/[^0-9,.-]/g,"");
        if (!raw || raw==="-" || raw==="." || raw===",") return NaN;
        const lastDot=raw.lastIndexOf("."), lastComma=raw.lastIndexOf(",");
        if (lastDot>=0 && lastComma>=0) {
          raw=lastDot>lastComma ? raw.replace(/,/g,"") : raw.replace(/\\./g,"").replace(",",".");
        } else if (lastComma>=0) {
          const decimals=raw.length-lastComma-1;
          raw=decimals===3 ? raw.replace(/,/g,"") : raw.replace(",",".");
        } else if (lastDot>=0) {
          const decimals=raw.length-lastDot-1;
          raw=decimals===3 ? raw.replace(/\\./g,"") : raw;
        }
        const number=Number(raw);
        return Number.isFinite(number) ? number : NaN;
      };
      for (let index=0; index<dataRows.length; index++) {
        const {csvRow,rowNo}=dataRows[index];
        const name=col(csvRow,"nombre","producto","articulo","name","product");
        if (!name) { skipped++; failures.push("Fila "+rowNo+": falta el nombre."); continue; }
        const sku=col(csvRow,"codigo","referencia","sku","code").slice(0,100) || makeInternalProductSku();
        if (sku && (existingCodes.has(sku.toLocaleLowerCase()) || fileCodes.has(sku.toLocaleLowerCase()))) {
          skipped++; failures.push("Fila "+rowNo+" ("+name+"): el código «"+sku+"» ya existe; se omitió para no duplicar referencias."); continue;
        }
        const rawType=normalizeHeader(col(csvRow,"tipo","type")) || "physical";
        const type=({fisico:"physical",fisica:"physical",physical:"physical",servicio:"service",service:"service",digital:"digital","digital_": "digital"})[rawType] || "physical";
        const price=parseNumber(col(csvRow,"precio","precio_venta","valor_venta","price")), cost=parseNumber(col(csvRow,"costo","costo_unitario","cost"));
        const stock=parseNumber(col(csvRow,"cantidad","cantidad_disponible","existencias","stock","quantity"),0);
        const thresholdText=col(csvRow,"stock_minimo","stock_bajo","low_stock_threshold");
        const threshold=thresholdText ? parseNumber(thresholdText) : null;
        if (![price,cost,stock].every(Number.isFinite) || price<0 || cost<0 || stock<0 || (threshold!==null&&(!Number.isFinite(threshold)||threshold<0))) {
          skipped++; failures.push("Fila "+rowNo+" ("+name+"): precio, costo, cantidad o mínimo inválido; no se importó."); continue;
        }
        let categoryId=null;
        const categoryName=col(csvRow,"categoria","categoria_nombre","category");
        if (categoryName) {
          const key=categoryName.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
          categoryId=categoryMap.get(key)||null;
          if (!categoryId) {
            const {data:newCategory,error:categoryError}=await supabase.from("product_categories").insert({business_id:activeBusiness.id,name:categoryName.slice(0,80)}).select("id,name").single();
            if (categoryError) {
              const {data:matches}=await supabase.from("product_categories").select("id,name").eq("business_id",activeBusiness.id).ilike("name",categoryName.slice(0,80)).limit(1);
              if (!matches?.length) { skipped++; failures.push("Fila "+rowNo+" ("+name+"): no se pudo crear la categoría «"+categoryName+"»."); continue; }
              categoryId=matches[0].id;
            } else { categoryId=newCategory.id; categoryMap.set(key,categoryId); setCategories((current)=>[...current,newCategory].sort((a,b)=>a.name.localeCompare(b.name,"es"))); }
          }
        }
        setInventoryImportProgress("Importando "+(index+1)+" de "+dataRows.length+" artículos…");
        try {
          const {error:insertError}=await supabase.rpc("create_product_with_opening_stock",{
            p_business_id:activeBusiness.id,p_name:name.slice(0,160),p_category_id:categoryId,p_sku:sku,
            p_description:col(csvRow,"descripcion","description").slice(0,5000)||null,
            p_product_type:type,p_unit_name:col(csvRow,"unidad","unit").slice(0,40)||"unidad",
            p_sale_price_minor:toMinorUnits(price,currencyCode),p_cost_price_minor:toMinorUnits(cost,currencyCode),
            p_opening_stock:type==="physical"&&toBool(col(csvRow,"controla_inventario","controla_stock","track_inventory")||"si")?stock:0,
            p_low_stock_threshold:type==="physical"&&threshold!==null?threshold:null,
            p_commercial_presentation:col(csvRow,"presentacion","presentation").slice(0,200)||null
          });
          if (insertError) throw insertError;
          imported++; if (sku) fileCodes.add(sku.toLocaleLowerCase());
        } catch (e) { skipped++; failures.push("Fila "+rowNo+" ("+name+"): "+friendlyError(e)); }
      }
      setInventoryOverviewRefresh((n)=>n+1);
      await loadProducts();
      const firstErrors=failures.slice(0,8);
      setNotice("Carga completada: "+imported+" artículos importados; "+skipped+" filas omitidas. El stock inicial quedó en el historial."+ (failures.length>8?" Hay "+(failures.length-8)+" errores adicionales.":""));
      if (firstErrors.length) setError(firstErrors.join("\n"));
    } catch (e) { setError(friendlyError(e)); }
    finally { setInventoryImportBusy(false); setInventoryImportProgress(""); }
  }

  async function fetchImageAsDataUri(url, storagePath = "") {
    let imageBlob = null;
    if (url) {
      try {
        const response = await fetch(url, { mode: "cors", credentials: "omit", cache: "no-store" });
        if (response.ok) {
          const candidate = await response.blob();
          if (candidate.type.startsWith("image/")) imageBlob = candidate;
        }
      } catch { /* Use the authenticated Storage download as a fallback below. */ }
    }
    if (!imageBlob && storagePath) {
      try {
        const { data, error: storageError } = await supabase.storage.from("business-logos").download(storagePath);
        if (!storageError && data?.type?.startsWith("image/")) imageBlob = data;
      } catch { /* Fall back to the official treseiscinco symbol when the logo is unavailable. */ }
    }
    if (!imageBlob) return "";
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
      reader.onerror = () => resolve("");
      reader.readAsDataURL(imageBlob);
    });
  }

  function buildBusinessCardSvg(profile, businessName, logoDataUri) {
    const primary = /^#[0-9a-f]{6}$/i.test(profile.cardPrimary || "") ? profile.cardPrimary : "#159F92";
    const surface = /^#[0-9a-f]{6}$/i.test(profile.cardSurface || "") ? profile.cardSurface : "#FFFFFF";
    const textColor = /^#[0-9a-f]{6}$/i.test(profile.cardText || "") ? profile.cardText : "#1F2937";
    const fields = [
      { text: businessName, size: 34, weight: 800, max: 25, lineHeight: 38, maxLines: 2 },
      { text: profile.ownerName, size: 21, weight: 750, max: 34, lineHeight: 29, maxLines: 2 },
      { text: profile.publicDescription, size: 16, weight: 400, max: 43, lineHeight: 23, maxLines: 2 },
      { text: profile.phone, size: 18, weight: 500, max: 42, lineHeight: 25, maxLines: 1 },
      { text: profile.email, size: 17, weight: 400, max: 42, lineHeight: 24, maxLines: 1 },
      { text: [profile.address, profile.city].filter(Boolean).join(", "), size: 16, weight: 400, max: 43, lineHeight: 23, maxLines: 2 },
      { text: profile.website, size: 17, weight: 700, max: 42, lineHeight: 24, maxLines: 1 }
    ];
    const rows = [];
    for (const field of fields) {
      const value = String(field.text || "").trim();
      if (!value || rows.length >= 11) continue;
      const words = value.split(/\s+/);
      const wrapped = [];
      let line = "";
      for (const word of words) {
        const candidate = line ? line + " " + word : word;
        if (candidate.length > field.max && line) { wrapped.push(line); line = word; }
        else line = candidate;
      }
      if (line) wrapped.push(line);
      for (const piece of wrapped.slice(0, field.maxLines)) {
        if (rows.length >= 11) break;
        rows.push({ text: piece, size: field.size, weight: field.weight, lineHeight: field.lineHeight });
      }
    }
    const totalHeight = rows.reduce((sum, row) => sum + row.lineHeight, 0);
    let cursor = Math.max(70, Math.round((500 - totalHeight) / 2));
    const textRows = rows.map((row) => {
      const baseline = cursor + Math.round(row.lineHeight * 0.73);
      cursor += row.lineHeight;
      return '<text x="468" y="' + baseline + '" text-anchor="start" fill="' + textColor + '" font-family="Arial, sans-serif" font-size="' + row.size + '" font-weight="' + row.weight + '">' + escapeHtml(row.text) + '</text>';
    }).join("");
    const logoMarkup = logoDataUri
      ? '<image href="' + escapeHtml(logoDataUri) + '" x="16" y="104" width="432" height="292" preserveAspectRatio="xMidYMid meet" />'
      : '<svg x="64" y="104" width="292" height="292" viewBox="0 0 128 128" aria-label="Logo de treseiscinco"><g fill="none" stroke-width="17" stroke-linecap="butt"><path d="M 26 39 A 45 45 0 0 1 89 22" stroke="#F5C928"/><path d="M 99 29 A 45 45 0 0 1 103 94" stroke="#0A9D9F"/><path d="M 92 103 A 45 45 0 0 1 22 54" stroke="#174580"/></g><circle cx="64" cy="64" r="26" fill="#fff"/></svg>';
    return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="90mm" height="50mm" viewBox="0 0 900 500" role="img" aria-label="Tarjeta de ' + escapeHtml(businessName) + '">' +
      '<rect x="0" y="0" width="900" height="500" rx="26" fill="' + surface + '"/>' +
      '<rect x="0" y="0" width="900" height="16" fill="' + primary + '"/>' +
      '<rect x="2" y="2" width="896" height="496" rx="25" fill="none" stroke="' + primary + '" stroke-width="3"/>' +
      logoMarkup + textRows + '</svg>';
  }

  async function fetchBusinessCardLogoDataUri(url, storagePath = "") {
    const customLogo = await fetchImageAsDataUri(url, storagePath);
    if (customLogo) return customLogo;
    return await fetchImageAsDataUri(window.location.origin + "/symbol-treseiscinco.svg");
  }

  async function createBusinessCardImageFile(profile, businessName) {
    const savedLogoPath = !settingsLogoPreview && !settingsRemoveLogo ? String(activeBusiness?.logo_path || "") : "";
    const logoUrl = settingsLogoPreview || (savedLogoPath ? getBusinessLogoUrl(savedLogoPath) : "");
    const logoDataUri = await fetchBusinessCardLogoDataUri(logoUrl, savedLogoPath);
    const svg = buildBusinessCardSvg(profile, businessName, logoDataUri);
    const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const objectUrl = URL.createObjectURL(svgBlob);
    try {
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("No pudimos preparar la imagen de la tarjeta."));
        image.src = objectUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1800;
      canvas.height = 1000;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Este navegador no permite crear la imagen de la tarjeta.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const png = await new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo generar el PNG de la tarjeta.")), "image/png"));
      return { file: new File([png], "tarjeta-treseiscinco.png", { type: "image/png" }), svg };
    } finally { URL.revokeObjectURL(objectUrl); }
  }

  async function sharePersonalBusinessCard() {
    if (!activeBusiness) return;
    const savedProfile = activeBusiness.settings?.commercial_profile || {};
    const profile = screen === "settings" ? { ...savedProfile, ...(settingsCommercialProfile || {}) } : { ...savedProfile };
    const name = profile.tradeName || activeBusiness.name || "Mi negocio";
    try {
      const { file } = await createBusinessCardImageFile(profile, name);
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: name, files: [file] });
        setNotice("Tarjeta compartida como imagen PNG.");
      } else {
        downloadBlobFile(file.name, file, "image/png");
        setNotice("La tarjeta se descargó como imagen PNG para adjuntarla en WhatsApp o enviarla por otro medio.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") setError(error?.message || "No se pudo preparar la imagen de la tarjeta.");
    }
  }

  async function printBusinessCard() {
    if (!activeBusiness) return;
    const savedProfile = activeBusiness.settings?.commercial_profile || {};
    const profile = screen === "settings" ? { ...savedProfile, ...(settingsCommercialProfile || {}) } : { ...savedProfile };
    const businessName = String(profile.tradeName || settingsBusinessName || activeBusiness.name || "Mi negocio").trim();
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("Tu navegador bloqueó la ventana de impresión. Permite ventanas emergentes para generar la tarjeta.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write("<!doctype html><html lang=\"es\"><head><meta charset=\"utf-8\"><title>Preparando tarjeta…</title></head><body style=\"font-family:Arial,sans-serif;padding:24px\">Preparando la tarjeta…</body></html>");
    printWindow.document.close();
    try {
      const savedLogoPath = !settingsLogoPreview && !settingsRemoveLogo ? String(activeBusiness.logo_path || "") : "";
      const printLogoUrl = settingsLogoPreview || (savedLogoPath ? getBusinessLogoUrl(savedLogoPath) : "");
      const logoDataUri = await fetchBusinessCardLogoDataUri(printLogoUrl, savedLogoPath);
      const svg = buildBusinessCardSvg(profile, businessName, logoDataUri);
      // Render the vector artwork inline in the print document. This preserves the chosen
      // background rectangle and explicit text fills in Chrome/Edge's print pipeline.
      const html = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Tarjeta · ' + escapeHtml(businessName) + '</title><style>*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;forced-color-adjust:none!important;box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;font-family:Arial,sans-serif}body{min-height:100vh;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:14px}.card-svg{display:block;width:90mm;height:50mm;max-width:100%;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.card-svg svg{display:block;width:90mm;height:50mm;max-width:100%;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.print-hint{font-size:12px;color:#555;text-align:center;padding:0 12px}@media print{@page{size:90mm 50mm;margin:0}body{min-height:0;display:block}.card-svg,.card-svg svg{width:90mm;height:50mm;max-width:none}.print-hint{display:none}}</style></head><body><div class="card-svg" aria-label="Tarjeta comercial con colores personalizados">' + svg + '</div><p class="print-hint">Elige «Guardar como PDF» para conservar el formato de 9 × 5 cm. El fondo y los textos usan los colores seleccionados.</p><script>window.addEventListener("load",()=>setTimeout(()=>window.print(),350));</script></body></html>';
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } catch (error) {
      printWindow.close();
      setError(error?.message || "No se pudo preparar la tarjeta para imprimir.");
    }
  }

  async function downloadBusinessBackup() {
    if (!activeBusiness?.id || backupBusy) return;
    setBackupBusy(true); setError(""); setNotice("");
    try {
      const tableNames=[
        "product_categories","products","product_images","product_variants","customers","suppliers",
        "sales","sale_items","sale_payments","purchases","purchase_items","purchase_payments",
        "expenses","bank_accounts","bank_movements","stock_movements","audit_logs","quotes","quote_items","business_coupons"
      ];
      const backup={format:"treseiscinco-business-backup-v1",generated_at:new Date().toISOString(),
        business:{id:activeBusiness.id,name:activeBusiness.name,currency_code:activeBusiness.currency_code,
          country_code:activeBusiness.country_code,timezone:activeBusiness.timezone,theme:activeBusiness.theme,settings:activeBusiness.settings},
        tables:{},not_exported:[]};
      for (const table of tableNames) {
        try {
          const tableRows=[];
          for (let offset=0;offset<50000;offset+=500) {
            const {data,error:queryError}=await supabase.from(table).select("*").eq("business_id",activeBusiness.id).range(offset,offset+499);
            if (queryError) throw queryError;
            const batch=data||[]; tableRows.push(...batch);
            if (batch.length<500) break;
            if (offset+500>=50000) throw new Error("Tabla supera 50.000 filas");
          }
          backup.tables[table]=tableRows;
        } catch (e) { backup.not_exported.push({table,reason:String(e?.message||e).slice(0,180)}); }
      }
      downloadBlobFile("treseiscinco-copia-"+String(activeBusiness.name||"negocio").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9_-]+/gi,"-").toLowerCase()+"-"+todayInBogota()+".json",JSON.stringify(backup,null,2),"application/json;charset=utf-8");
      const complete=backup.not_exported.length===0;
      setNotice(complete?"Copia de seguridad descargada. Guárdala en un lugar seguro; este archivo no sustituye las copias internas del servicio.":"Copia descargada con "+backup.not_exported.length+" tablas no exportadas por permisos o límites. Revisa el detalle antes de considerarla completa.");
      if (!complete) setError("Tablas no exportadas: "+backup.not_exported.map((x)=>x.table).join(", ")+". Por seguridad no se incluyeron credenciales privadas de pasarelas.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setBackupBusy(false); }
  }


  useEffect(() => {
    let alive=true;
    setIsPlatformAdminReady(false);
    if (!session?.user?.id) {
      setIsPlatformAdmin(false); setPlatformAdminData(null); setBusinessSubscription(null); setIsPlatformAdminReady(true);
      return () => { alive=false; };
    }
    supabase.rpc("is_platform_admin").then(({data,error:rpcError})=>{
      if (!alive) return;
      setIsPlatformAdmin(!rpcError && Boolean(data));
      setIsPlatformAdminReady(true);
    }).catch(()=>{if(alive){setIsPlatformAdmin(false);setIsPlatformAdminReady(true);}});
    return () => { alive=false; };
  }, [session?.user?.id]);

  useEffect(() => {
    if (settingsTab === "platform_admin" && isPlatformAdminReady && !isPlatformAdmin) {
      setSettingsTab(activeBusiness?.role === "owner" ? "general" : "account");
    }
  }, [settingsTab, isPlatformAdmin, isPlatformAdminReady, activeBusiness?.role]);

  useEffect(() => {
    if (screen !== "platform_admin" || !isPlatformAdminReady) return;
    if (isPlatformAdmin) { setSettingsTab("platform_admin"); setScreen("settings"); }
    else setScreen("home");
  }, [screen, isPlatformAdmin, isPlatformAdminReady]);

  useEffect(() => {
    if (!session?.user?.id) return;
    const standalone = Boolean(window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true);
    const ua = navigator.userAgent || "";
    const platform = /iphone|ipad|ipod/i.test(ua) ? "iOS" : /android/i.test(ua) ? "Android" : /windows/i.test(ua) ? "Windows" : /macintosh|mac os/i.test(ua) ? "macOS" : "Other";
    supabase.rpc("record_platform_activity", {
      p_event: standalone ? "pwa_installed" : "app_open",
      p_is_standalone: standalone,
      p_platform: platform
    }).then(({error:activityError})=>{
      if(activityError) console.warn("No se pudo registrar la actividad de plataforma.");
    }).catch(()=>{});
  }, [session?.user?.id]);

  useEffect(() => {
    if (!activeBusiness?.id || !["owner","admin"].includes(activeBusiness.role)) {
      setBusinessSubscription(null);
      return;
    }
    let alive=true;
    supabase.from("business_subscriptions").select("id,status,current_period_start,current_period_end,created_at")
      .eq("business_id",activeBusiness.id).maybeSingle()
      .then(({data,error:subscriptionError})=>{if(alive)setBusinessSubscription(subscriptionError?null:data||null);})
      .catch(()=>{if(alive)setBusinessSubscription(null);});
    return ()=>{alive=false;};
  }, [activeBusiness?.id,activeBusiness?.role]);

  useEffect(() => {
    if ((screen === "accounts" || screen === "receivables" || screen === "payables") && activeBusiness?.id) loadOutstandingAccounts();
  }, [screen, accountsTab, activeBusiness?.id]);

  useEffect(() => {
    if ((screen === "platform_admin" || (screen === "settings" && settingsTab === "platform_admin")) && isPlatformAdmin) loadPlatformAdminDashboard();
  }, [screen, settingsTab, isPlatformAdmin]);

  async function loadBulkProducts() {
    if (!activeBusiness?.id) return;
    setBulkProductsLoading(true); setError(""); setNotice("");
    try {
      const allRows = [];
      const chunkSize = 500;
      for (let offset = 0; offset < 50000; offset += chunkSize) {
        let query = supabase.from("products")
          .select("id,business_id,category_id,sku,slug,name,description,commercial_presentation,product_type,unit_name,sale_price_minor,cost_price_minor,stock_on_hand,low_stock_threshold,track_inventory,is_sellable,is_published,image_paths,archived_at,created_at")
          .eq("business_id", activeBusiness.id).order("name").range(offset, offset + chunkSize - 1);
        query = showArchivedProducts ? query.not("archived_at", "is", null) : query.is("archived_at", null);
        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        const batch = data || [];
        allRows.push(...batch);
        if (batch.length < chunkSize) break;
        if (offset + chunkSize >= 50000) throw new Error("El inventario supera los 50.000 artículos. Filtra por nombre para editar un grupo de artículos.");
      }
      const digits = currencyDigits(currencyCode);
      setBulkProductRows(allRows.map((product) => ({
        ...product,
        _draftName: product.name || "",
        _draftSku: product.sku || "",
        _draftSalePrice: String(Number(product.sale_price_minor || 0) / (10 ** digits)),
        _draftCostPrice: String(Number(product.cost_price_minor || 0) / (10 ** digits)),
        _draftStock: String(product.stock_on_hand ?? 0)
      })));
      setBulkEditMode(true);
      setShowProductForm(false);
      setEditingProductId(null);
      setSelectedRecordDetail(null);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBulkProductsLoading(false);
    }
  }

  async function saveBulkProductChanges() {
    if (!activeBusiness?.id || bulkProductsSaving) return;
    const digits = currencyDigits(currencyCode);
    const changedRows = bulkProductRows.filter((row) =>
      String(row._draftName ?? "").trim() !== String(row.name ?? "").trim() ||
      String(row._draftSku ?? "").trim() !== String(row.sku ?? "").trim() ||
      toMinorUnits(row._draftSalePrice || 0, currencyCode) !== Number(row.sale_price_minor || 0) ||
      toMinorUnits(row._draftCostPrice || 0, currencyCode) !== Number(row.cost_price_minor || 0) ||
      (row.track_inventory && Number(row._draftStock || 0) !== Number(row.stock_on_hand || 0))
    );
    if (!changedRows.length) { setNotice("No hay cambios pendientes por guardar."); return; }
    const invalid = changedRows.find((row) =>
      !String(row._draftName ?? "").trim() ||
      !Number.isFinite(Number(row._draftSalePrice)) || Number(row._draftSalePrice) < 0 ||
      !Number.isFinite(Number(row._draftCostPrice)) || Number(row._draftCostPrice) < 0 ||
      (row.track_inventory && (!Number.isFinite(Number(row._draftStock)) || Number(row._draftStock) < 0))
    );
    if (invalid) { setError("Revisa el nombre, los precios, el costo y las existencias de «" + (invalid.name || "este artículo") + "». No se admiten valores negativos ni nombres vacíos."); return; }

    setBulkProductsSaving(true); setError(""); setNotice("");
    let savedCount = 0;
    try {
      for (const row of changedRows) {
        const nextName = String(row._draftName).trim();
        const nextSku = String(row._draftSku || "").trim() || null;
        const nextSale = toMinorUnits(row._draftSalePrice, currencyCode);
        const nextCost = toMinorUnits(row._draftCostPrice, currencyCode);
        const nextStock = Number(row._draftStock || 0);
        const productChanges = {};
        if (nextName !== String(row.name || "")) productChanges.name = nextName;
        if (nextSku !== (row.sku || null)) productChanges.sku = nextSku;
        if (nextSale !== Number(row.sale_price_minor || 0)) productChanges.sale_price_minor = nextSale;
        if (nextCost !== Number(row.cost_price_minor || 0)) productChanges.cost_price_minor = nextCost;

        if (Object.keys(productChanges).length) {
          const { data: updated, error: updateError } = await supabase.from("products")
            .update(productChanges).eq("business_id", activeBusiness.id).eq("id", row.id)
            .select("id").maybeSingle();
          if (updateError) throw updateError;
          if (!updated) throw new Error("No se pudieron guardar los datos de «" + row.name + "». Comprueba tus permisos.");
        }
        if (row.track_inventory && Math.abs(nextStock - Number(row.stock_on_hand || 0)) > 0.000001) {
          const delta = nextStock - Number(row.stock_on_hand || 0);
          const { error: stockError } = await supabase.rpc("adjust_product_stock", {
            p_business_id: activeBusiness.id,
            p_product_id: row.id,
            p_quantity_delta: delta,
            p_notes: "Ajuste desde la edición masiva del inventario"
          });
          if (stockError) throw stockError;
        }
        setBulkProductRows((current) => current.map((item) => item.id !== row.id ? item : ({
          ...item,
          name: nextName,
          sku: nextSku,
          sale_price_minor: nextSale,
          cost_price_minor: nextCost,
          stock_on_hand: row.track_inventory ? nextStock : item.stock_on_hand,
          _draftName: nextName,
          _draftSku: nextSku || "",
          _draftSalePrice: String(nextSale / (10 ** digits)),
          _draftCostPrice: String(nextCost / (10 ** digits)),
          _draftStock: String(row.track_inventory ? nextStock : item.stock_on_hand)
        })));
        savedCount += 1;
      }
      await loadProducts();
      setInventoryOverviewRefresh((current) => current + 1);
      setNotice(savedCount + (savedCount === 1 ? " artículo actualizado. El historial de existencias se conserva." : " artículos actualizados. El historial de existencias se conserva."));
    } catch (e) {
      setInventoryOverviewRefresh((current) => current + 1);
      await loadProducts();
      setError("Se guardaron " + savedCount + " de " + changedRows.length + " artículos antes de encontrar un error. Revisa el inventario y los cambios pendientes. " + friendlyError(e));
    } finally {
      setBulkProductsSaving(false);
    }
  }

  function updateBulkDraft(productId, field, value) {
    setBulkProductRows((current) => current.map((product) => product.id === productId ? { ...product, [field]: value } : product));
  }

  function openBulkHistory(product) {
    setBulkHistoryProduct(product);
    setBulkHistoryPage(1);
  }

  useEffect(() => {
    if (screen !== "products" || !activeBusiness?.id || !bulkHistoryProduct?.id) {
      setBulkHistoryRows([]);
      setBulkHistoryCount(0);
      setBulkHistoryLoading(false);
      return;
    }
    let active = true;
    setBulkHistoryLoading(true);
    const from = (bulkHistoryPage - 1) * 10;
    supabase.from("stock_movements")
      .select("id,product_id,movement_type,quantity_delta,reference_type,notes,created_at", { count: "exact" })
      .eq("business_id", activeBusiness.id).eq("product_id", bulkHistoryProduct.id)
      .order("created_at", { ascending: false }).range(from, from + 9)
      .then(({ data, error: movementError, count }) => {
        if (!active) return;
        if (movementError) throw movementError;
        setBulkHistoryRows(data || []);
        setBulkHistoryCount(count || 0);
      })
      .catch((e) => { if (active) { setBulkHistoryRows([]); setBulkHistoryCount(0); setError(friendlyError(e)); } })
      .finally(() => { if (active) setBulkHistoryLoading(false); });
    return () => { active = false; };
  }, [screen, activeBusiness?.id, bulkHistoryProduct?.id, bulkHistoryPage]);

  useEffect(() => { if (screen === "products" && activeBusiness?.id) loadProducts(); }, [screen, activeBusiness?.id, loadProducts]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(productsCount / productPageSize));
    if (productPage > maxPage) setProductPage(maxPage);
  }, [productsCount, productPageSize, productPage]);

  useEffect(() => {
    let cancelled = false;
    setProductImageUrls({});
    async function loadVisibleImages() {
      if (screen !== "products" || !activeBusiness?.id || !products.length) {
        setGalleryLoadingFor(null);
        return;
      }
      const imageKeys = products.flatMap((product) => {
        const paths = product.image_paths || [];
        return openProductGalleries[product.id] ? paths : paths.slice(0, 1);
      }).filter(Boolean);
      const openProduct = products.find((product) => openProductGalleries[product.id]);
      setGalleryLoadingFor(openProduct?.id || null);
      if (!imageKeys.length) { setGalleryLoadingFor(null); return; }
      try {
        const { data, error: imageError } = await supabase.from("product_images")
          .select("product_id,image_key,image_data")
          .eq("business_id", activeBusiness.id).in("image_key", imageKeys);
        if (imageError) throw imageError;
        if (cancelled) return;
        const imageMap = {};
        const foundKeys = new Set();
        for (const image of data || []) {
          foundKeys.add(image.image_key);
          imageMap[image.product_id + "|" + image.image_key] = "data:image/webp;base64," + image.image_data;
        }
        setProductImageUrls(imageMap);
        const missingKeys = imageKeys.filter((key) => !foundKeys.has(key));
        if (missingKeys.length) {
          setError("Hay fotos registradas que no se pudieron leer. Entra en Editar para revisarlas y volver a cargarlas.");
        }
      } catch (e) {
        if (!cancelled) setError(friendlyError(e));
      } finally {
        if (!cancelled) setGalleryLoadingFor(null);
      }
    }
    loadVisibleImages();
    return () => { cancelled = true; };
  }, [products, screen, activeBusiness?.id, openProductGalleries]);

  async function chooseNewProductImages(event) {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length) return;
    const room = Math.max(0, 3 - stagedImages.length);
    if (!room) { setError("Cada producto puede tener como máximo tres fotos."); return; }
    setBusy(true); setError("");
    const next = [];
    try {
      for (const file of picked.slice(0, room)) {
        const converted = await prepareProductImage(file);
        next.push({ file: converted, preview: URL.createObjectURL(converted), name: converted.name });
      }
      setStagedImages((current) => [...current, ...next].slice(0, 3));
      if (picked.length > room) setError("Solo puedes adjuntar tres fotos por producto. Se añadieron las primeras disponibles.");
    } catch (e) {
      next.forEach((image) => URL.revokeObjectURL(image.preview));
      setError(friendlyError(e));
    } finally { setBusy(false); }
  }

  async function chooseExistingProductImages(product, event) {
    const picked = Array.from(event.target.files || []);
    event.target.value = "";
    if (!picked.length) return;
    const currentCount = (product.image_paths || []).length;
    const room = Math.max(0, 3 - currentCount);
    if (!room) { setError("Este producto ya tiene tres fotos."); return; }
    setUploadingImagesFor(product.id); setError(""); setNotice("");
    let uploaded = 0;
    try {
      for (const file of picked.slice(0, room)) {
        const converted = await prepareProductImage(file);
        try { await uploadProductImage(product.id, converted, activeBusiness?.id); uploaded += 1; }
        finally { /* El navegador libera el archivo temporal al salir de este bloque. */ }
      }
      setNotice(uploaded ? (uploaded === 1 ? "Foto agregada al producto." : uploaded + " fotos agregadas al producto.") : "No se subió ninguna foto.");
      if (picked.length > room) setError("El producto solo admite tres fotos en total; se procesaron las primeras disponibles.");
      await loadProducts();
    } catch (e) { setError("La foto no se pudo subir. " + friendlyError(e)); await loadProducts(); }
    finally { setUploadingImagesFor(null); }
  }

  async function removeExistingProductImage(productId, imageKey) {
    setUploadingImagesFor(productId); setError(""); setNotice("");
    try {
      await deleteProductImageRequest(productId, imageKey, activeBusiness?.id);
      setProductImageUrls((current) => { const next = { ...current }; delete next[productId + "|" + imageKey]; return next; });
      setNotice("Foto eliminada."); await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setUploadingImagesFor(null); }
  }

  function handleProductImageError(productId, imageKey) {
    setProductImageUrls((current) => {
      const key = productId + "|" + imageKey;
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setError("Una foto registrada no se pudo mostrar. Entra en Editar para revisarla y volver a cargarla.");
  }

  function toggleProductGallery(product) {
    setOpenProductGalleries((current) => ({ ...current, [product.id]: !current[product.id] }));
  }

  async function shareProduct(product) {
    const url = window.location.origin + "/?catalog=" + encodeURIComponent(activeBusiness?.id || "") + "#producto-" + encodeURIComponent(product.id);
    const message = [product.name, product.sku ? "Código: " + product.sku : "", "Precio: " + money(product.sale_price_minor, currencyCode), product.description || "", url].filter(Boolean).join("\n");
    try { if (navigator.share) await navigator.share({ title: product.name, text: message, url }); else { await navigator.clipboard.writeText(message); setNotice("Enlace y datos de " + product.name + " copiados para compartir."); } }
    catch (e) { if (e?.name !== "AbortError") { try { await navigator.clipboard.writeText(message); setNotice("Datos de " + product.name + " copiados para compartir."); } catch { setError("No se pudo abrir la opción para compartir. Copia el enlace del catálogo."); } } }
  }

  function openProductDetail(product) {
    const variants = variantsByProduct[product.id] || [];
    const stockSummary = summarizeProductVariantStock(product, variants);
    setSelectedRecordDetail({
      type: "Producto",
      title: product.name,
      fields: [
        { label: "Categoría", value: categories.find((cat) => cat.id === product.category_id)?.name || "Sin categoría" },
        { label: "Tipo", value: product.product_type === "physical" ? "Producto físico" : product.product_type === "service" ? "Servicio" : "Digital" },
        { label: "Código", value: product.sku || "—" },
        { label: "Unidad", value: product.unit_name || "unidad" },
        { label: "Precio de venta", value: money(product.sale_price_minor, currencyCode) },
        { label: "Costo", value: money(product.cost_price_minor, currencyCode) },
        { label: "Ganancia por unidad", value: money(Number(product.sale_price_minor || 0) - Number(product.cost_price_minor || 0), currencyCode) },
        { label: "Margen", value: Number(product.sale_price_minor || 0) > 0 ? (((Number(product.sale_price_minor || 0) - Number(product.cost_price_minor || 0)) / Number(product.sale_price_minor || 0)) * 100).toLocaleString("es-CO", { maximumFractionDigits: 1 }) + "%" : "—" },
        { label: "Existencias", value: stockSummary.usesVariantStock ? (stockSummary.known ? stockSummary.units.toLocaleString("es-CO") + " unidades en variantes" : stockSummary.empty ? "Sin combinaciones activas" : "Stock de variantes por configurar") : product.track_inventory ? Number(product.stock_on_hand).toLocaleString("es-CO") + " " + (product.unit_name || "unidades") : "No aplica" },
        { label: "Alerta de stock", value: product.track_inventory && product.low_stock_threshold != null ? Number(product.low_stock_threshold).toLocaleString("es-CO") : "No configurada" },
        { label: "Estado", value: product.archived_at ? "Archivado" : product.is_sellable ? "Activo" : "Inactivo" },
        { label: "Catálogo", value: product.is_published ? "Publicado" : "No publicado" },
        { label: "Presentación", value: product.commercial_presentation || "" },
        { label: "Variantes", value: variants.length ? variants.map((variant) => variantDisplayLabel(variant) || variant.sku || "Variante").join("\\n") : "Sin variantes" },
        { label: "Descripción", value: product.description || "" }
      ],
      notes: product.notes || ""
    });
  }

  useEffect(() => {
    if (screen !== "settings" || !activeBusiness?.id) return;
    let alive = true;
    setSettingsCurrency(activeBusiness.currency_code || "COP");
    setSettingsBusinessName(activeBusiness.name || "");
    const savedCommercial = activeBusiness.settings?.commercial_profile || {};
    setSettingsCommercialProfile({ tradeName: savedCommercial.tradeName || "", ownerName: savedCommercial.ownerName || "", documentNumber: savedCommercial.documentNumber || "", email: savedCommercial.email || "", phone: savedCommercial.phone || "", address: savedCommercial.address || "", city: savedCommercial.city || "", website: savedCommercial.website || "", publicDescription: savedCommercial.publicDescription || "", hours: savedCommercial.hours || "", orderChannel: savedCommercial.orderChannel === "whatsapp" ? "whatsapp" : "wompi", hoursSchedule: savedCommercial.hoursSchedule || {}, deliveryMethods: Array.isArray(savedCommercial.deliveryMethods) ? savedCommercial.deliveryMethods : ["pickup","delivery"], stockVisibility: ["show_all","hide","show_unavailable"].includes(savedCommercial.stockVisibility) ? savedCommercial.stockVisibility : "hide", catalogPrimary: savedCommercial.catalogPrimary || "#167D82", catalogBackground: savedCommercial.catalogBackground || "#F5F7FC", catalogSurface: savedCommercial.catalogSurface || "#FFFFFF", catalogText: savedCommercial.catalogText || "#24352B", cardPrimary: savedCommercial.cardPrimary || "#475569", cardSurface: savedCommercial.cardSurface || "#FFFFFF", cardText: savedCommercial.cardText || "#1F2937" });
    setSettingsCatalogSlug(activeBusiness.slug || "");
    setSettingsTab(activeBusiness.role === "owner" ? "general" : "account");
    setSettingsTheme(normalizeBusinessTheme(activeBusiness.theme));
    setSettingsHelpEnabled(activeBusiness.settings?.contextual_help_enabled !== false);
    setSettingsAssistantName(String(activeBusiness.settings?.assistant_name || "Angie").trim().slice(0,32) || "Angie");
    setSettingsTaxProfile(normalizeTaxProfile(activeBusiness.settings?.tax_profile));
    setSettingsLogoFile(null);
    setSettingsLogoPreview("");
    setSettingsRemoveLogo(false);
    setSettingsChecking(true);
    setError("");
    businessHasFinancialData(activeBusiness.id)
      .then((hasData) => { if (alive) setSettingsHasData(hasData); })
      .catch((e) => { if (alive) setError(friendlyError(e)); })
      .finally(() => { if (alive) setSettingsChecking(false); });
    return () => { alive = false; };
  }, [screen, activeBusiness?.id, activeBusiness?.currency_code]);

  useEffect(() => () => {
    if (settingsLogoPreview?.startsWith("blob:")) URL.revokeObjectURL(settingsLogoPreview);
  }, [settingsLogoPreview]);

  function chooseBusinessLogo(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("El logo debe ser una imagen JPG, PNG o WebP.");
      return;
    }
    if (file.size > 5000000) {
      setError("El logo original debe pesar máximo 5 MB.");
      return;
    }
    setSettingsLogoFile(file);
    setSettingsLogoPreview(URL.createObjectURL(file));
    setSettingsRemoveLogo(false);
    setError("");
    setNotice("");
  }

  function clearBusinessLogo() {
    setSettingsLogoFile(null);
    setSettingsLogoPreview("");
    setSettingsRemoveLogo(Boolean(activeBusiness?.logo_path));
    setError("");
    setNotice("");
  }

  async function submitAuth(event) {
    event.preventDefault();
    if (mode === "signup" && (password.length < 12 || password.length > 128)) { setBusy(false); setError("La contraseña de una cuenta nueva debe tener entre 12 y 128 caracteres."); setNotice(""); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      if (mode === "forgot") {
        const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin
        });
        if (authError) throw authError;
        setNotice("Si ese correo tiene una cuenta, te enviaremos un enlace para recuperar el acceso. Revisa tu bandeja de entrada y spam.");
      } else if (mode === "update-password") {
        if (!session?.user) throw new Error("Abre el enlace de recuperación que recibiste por correo e inténtalo de nuevo.");
        const { error: authError } = await supabase.auth.updateUser({ password });
        if (authError) throw authError;
        await supabase.auth.signOut();
        setSession(null);
        setMode("login");
        setPassword("");
        setNotice("Tu contraseña se actualizó. Ya puedes iniciar sesión.");
      } else if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { display_name: fullName.trim() }, emailRedirectTo: window.location.origin }
        });
        if (authError) throw authError;
        if (!data.session) setNotice("¡Cuenta creada! Revisa tu correo y confirma la dirección antes de entrar.");
        else { setSession(data.session); setNotice("Cuenta creada. Ahora registra tu negocio."); }
      } else {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        setSession(data.session); await loadBusinesses(data.user.id);
      }
    } catch (e) {
      setError(friendlyError(e));
    } finally { setBusy(false); }
  }

  async function createBusiness(event) {
    event.preventDefault(); if (!session?.user) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: insertError } = await supabase.from("businesses").insert({
        id: crypto.randomUUID(), owner_user_id: session.user.id, name: businessName.trim(),
        country_code: "CO", currency_code: "COP", timezone: "America/Bogota",
        theme: { ...defaultBusinessTheme }
      });
      if (insertError) throw insertError;
      const list = await loadBusinesses(session.user.id);
      if (!list.length) throw new Error("El negocio se guardó, pero no pudimos confirmar tus permisos. Actualiza la página antes de volver a intentarlo.");
      setBusinessName(""); setNotice("Tu espacio de trabajo está listo.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function signOut() {
    setBusy(true); setError("");
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) setError(friendlyError(signOutError));
    else { setShowPublicLanding(true); setMode("login"); setPassword(""); setNotice(""); setError(""); }
    setBusy(false);
  }

  async function addCategory(event) {
    event?.preventDefault();
    if (!activeBusiness?.id || !categoryName.trim() || busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { data: created, error: insertError } = await supabase.from("product_categories")
        .insert({ business_id: activeBusiness.id, name: categoryName.trim() })
        .select("id,name,description,sort_order").single();
      if (insertError) throw insertError;
      setCategories((current) => [...current.filter((item) => item.id !== created.id), created].sort((a, b) => a.name.localeCompare(b.name, "es")));
      setProductForm((current) => ({ ...current, category_id: created.id }));
      setCategoryName("");
      setShowQuickCategoryForm(false);
      setNotice("Categoría creada y seleccionada.");
      await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function updateCategory(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !editingCategoryId || !editingCategoryName.trim()) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await supabase.from("product_categories")
        .update({ name: editingCategoryName.trim() })
        .eq("business_id", activeBusiness.id).eq("id", editingCategoryId)
        .select("id").maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("No tienes permiso para editar esta categoría.");
      setEditingCategoryId(null); setEditingCategoryName("");
      setNotice("Categoría actualizada."); await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function deleteCategory(categoryId) {
    if (!activeBusiness?.id || !categoryId) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: deleteError } = await supabase.from("product_categories")
        .delete().eq("business_id", activeBusiness.id).eq("id", categoryId)
        .select("id").maybeSingle();
      if (deleteError) throw deleteError;
      if (!data) throw new Error("No tienes permiso para eliminar esta categoría.");
      setConfirmDeleteCategoryId(null);
      if (productForm.category_id === categoryId) setProductForm((current) => ({ ...current, category_id: "" }));
      setNotice("Categoría eliminada."); await loadProducts();
    } catch (e) { setError(friendlyError(e)); setConfirmDeleteCategoryId(null); }
    finally { setBusy(false); }
  }

  async function saveOwnerPhone() {
    if (!session?.user?.id || ownerPhoneSaving) return;
    const phone = ownerPhone.trim();
    if (phone && phone.replace(/\D/g, "").length < 7) {
      setError("Escribe un número de celular válido o deja el campo vacío.");
      return;
    }
    setOwnerPhoneSaving(true); setError(""); setNotice("");
    try {
      const { error: profileError } = await supabase.from("profiles")
        .upsert({ user_id: session.user.id, phone: phone || null }, { onConflict: "user_id" });
      if (profileError) throw profileError;
      setNotice("Número de celular del propietario guardado.");
    } catch (e) {
      setError(friendlyError(e));
    } finally { setOwnerPhoneSaving(false); }
  }

    async function saveWompiConfiguration() {
    if (!activeBusiness?.id || wompiSaving) return;
    if (!["owner", "admin"].includes(activeBusiness.role)) { setError("Solo el propietario o un administrador puede configurar Wompi."); return; }
    setWompiSaving(true); setError(""); setNotice("");
    try {
      const { data, error: functionError } = await supabase.functions.invoke("public-checkout", {
        body: {
          action: "configure",
          business_id: activeBusiness.id,
          environment: wompiDraft.environment,
          public_key: wompiDraft.public_key.trim(),
          private_key: wompiDraft.private_key.trim(),
          integrity_secret: wompiDraft.integrity_secret.trim(),
          events_secret: wompiDraft.events_secret.trim(),
          enabled: Boolean(wompiDraft.enabled)
        }
      });
      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);
      if (data?.saved !== true) throw new Error("No se pudo confirmar el guardado de las credenciales de Wompi.");
      setWompiStatus({ loading: false, configured: true, enabled: data.enabled === true, environment: data.environment || wompiDraft.environment });
      setWompiDraft({ environment: data.environment || "sandbox", public_key: "", private_key: "", integrity_secret: "", events_secret: "", enabled: data.enabled === true });
      setNotice(data.enabled ? "Conexión con Wompi guardada. Usa el entorno de pruebas hasta verificar todo el flujo antes de recibir pagos reales." : "Credenciales guardadas; Wompi está desactivado para este negocio.");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setWompiSaving(false);
    }
  }

  async function saveSettings(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    if (activeBusiness.role !== "owner") { setError("Solo el propietario puede cambiar la configuración del negocio."); return; }
    const businessName = settingsBusinessName.trim();
    if (!businessName) { setError("Escribe el nombre del negocio."); return; }
    const nextTheme = normalizeBusinessTheme(settingsTheme);
    const nextTaxProfile = normalizeTaxProfile(settingsTaxProfile);
    const rawTaxRate = nextTaxProfile.defaultRateMode === "custom" ? String(settingsTaxProfile.customRate ?? "").trim() : String(nextTaxProfile.defaultRate);
    const effectiveTaxRate = Number(String(rawTaxRate).replace(",", "."));
    if (nextTaxProfile.vatStatus === "responsible" && (!rawTaxRate || !Number.isFinite(effectiveTaxRate) || effectiveTaxRate < 0 || effectiveTaxRate > 100)) {
      setError("Indica una tarifa de IVA válida entre 0 y 100.");
      return;
    }
    const normalizeCommercialProfile = (profile) => ({
      tradeName: String(profile?.tradeName || "").trim(),
      ownerName: String(profile?.ownerName || "").trim(),
      documentNumber: String(profile?.documentNumber || "").trim(),
      email: String(profile?.email || "").trim(),
      phone: String(profile?.phone || "").trim(),
      address: String(profile?.address || "").trim(),
      city: String(profile?.city || "").trim(),
      website: String(profile?.website || "").trim(),
      publicDescription: String(profile?.publicDescription || "").trim(),
      hours: String(profile?.hours || "").trim(),
      hoursSchedule: profile?.hoursSchedule && typeof profile.hoursSchedule === "object" ? profile.hoursSchedule : {},
      catalogPrimary: /^#[0-9a-f]{6}$/i.test(String(profile?.catalogPrimary || "")) ? profile.catalogPrimary : "#167D82",
      catalogBackground: /^#[0-9a-f]{6}$/i.test(String(profile?.catalogBackground || "")) ? profile.catalogBackground : "#F5F7FC",
      catalogSurface: /^#[0-9a-f]{6}$/i.test(String(profile?.catalogSurface || "")) ? profile.catalogSurface : "#FFFFFF",
      catalogText: /^#[0-9a-f]{6}$/i.test(String(profile?.catalogText || "")) ? profile.catalogText : "#24352B",
      cardPrimary: /^#[0-9a-f]{6}$/i.test(String(profile?.cardPrimary || "")) ? profile.cardPrimary : "#475569",
      cardSurface: /^#[0-9a-f]{6}$/i.test(String(profile?.cardSurface || "")) ? profile.cardSurface : "#FFFFFF",
      cardText: /^#[0-9a-f]{6}$/i.test(String(profile?.cardText || "")) ? profile.cardText : "#1F2937",
      orderChannel: profile?.orderChannel === "whatsapp" ? "whatsapp" : "wompi",
      deliveryMethods: Array.isArray(profile?.deliveryMethods) ? [...new Set(profile.deliveryMethods.filter((value) => ["pickup","delivery"].includes(value)))] : ["pickup","delivery"],
      stockVisibility: ["show_all","hide","show_unavailable"].includes(profile?.stockVisibility) ? profile.stockVisibility : "hide",
    });
    const days = [{key:"mon",label:"Lunes"},{key:"tue",label:"Martes"},{key:"wed",label:"Miércoles"},{key:"thu",label:"Jueves"},{key:"fri",label:"Viernes"},{key:"sat",label:"Sábado"},{key:"sun",label:"Domingo"}];
    const schedule = Object.fromEntries(days.map((day) => { const saved = settingsCommercialProfile.hoursSchedule?.[day.key] || {}; const periods = Array.isArray(saved.periods) ? saved.periods.slice(0,2).map((p) => ({open: String(p.open || ""), close: String(p.close || "")})) : [{open:"09:00",close:"18:00"}]; return [day.key, {enabled:Boolean(saved.enabled), periods: periods.length ? periods : [{open:"09:00",close:"18:00"}]}]; }));
    for (const day of days.filter((item) => schedule[item.key].enabled)) {
      const periods = schedule[day.key].periods;
      if (!periods.length || periods.some((period) => !period.open || !period.close || period.open >= period.close) || periods.some((period,index) => index > 0 && period.open < periods[index-1].close)) { setError("Revisa el horario de " + day.label + ": cada turno debe tener apertura y cierre válidos y los turnos no pueden superponerse."); return; }
    }
    const hasConfiguredSchedule = Object.keys(settingsCommercialProfile.hoursSchedule || {}).length > 0;
    const hoursText = hasConfiguredSchedule ? days.filter((day) => schedule[day.key].enabled).map((day) => day.label + ": " + schedule[day.key].periods.filter((p) => p.open && p.close).map((p) => p.open + "–" + p.close).join(" y ")).filter((line) => !line.endsWith(": ")).join("\n") : String(settingsCommercialProfile.hours || "").trim();
    const commercialProfile = normalizeCommercialProfile({...settingsCommercialProfile, hoursSchedule:hasConfiguredSchedule ? schedule : (settingsCommercialProfile.hoursSchedule || {}), hours:hoursText});
    if (commercialProfile.orderChannel === "whatsapp" && String(commercialProfile.phone).replace(/\D/g, "").length < 8) { setError("Para recibir pedidos por WhatsApp, primero configura un número válido en Teléfono / WhatsApp."); return; }
    if (commercialProfile.orderChannel === "wompi" && settingsCurrency !== "COP") { setError("Wompi solo admite COP. Elige pedidos por WhatsApp o cambia la moneda del negocio a COP."); return; }
    if (commercialProfile.orderChannel === "wompi" && (!wompiStatus.configured || !wompiStatus.enabled)) { setError("Antes de activar Wompi en el catálogo, completa y guarda las credenciales del comercio en la sección de conexión Wompi."); setSettingsTab("company"); return; }
    const savedCommercialProfile = normalizeCommercialProfile(activeBusiness.settings?.commercial_profile);
    const commercialProfileChanged = JSON.stringify(commercialProfile) !== JSON.stringify(savedCommercialProfile);
    const normalizedAssistantName = String(settingsAssistantName || "Angie").trim().replace(/\s+/g," ").slice(0,32) || "Angie";
    const assistantNameChanged = normalizedAssistantName !== (String(activeBusiness.settings?.assistant_name || "Angie").trim() || "Angie");
    const nextSettings = { ...(activeBusiness.settings || {}), contextual_help_enabled: settingsHelpEnabled, assistant_name: normalizedAssistantName, commercial_profile: commercialProfile, tax_profile: nextTaxProfile };
    const nameChanged = businessName !== activeBusiness.name;
    const nextSlug = settingsCatalogSlug.trim().toLowerCase();
    const slugChanged = nextSlug !== String(activeBusiness.slug || "");
    const currencyChanged = settingsCurrency !== currencyCode;
    const conversionRate = Number(String(settingsConversionRate).replace(",", "."));
    if (currencyChanged && settingsHasData && (!Number.isFinite(conversionRate) || conversionRate <= 0)) { setError("Indica una tasa válida: cuántas unidades de la nueva moneda equivalen a 1 unidad de la moneda actual."); return; }
    const themeChanged = JSON.stringify(nextTheme) !== JSON.stringify(normalizeBusinessTheme(activeBusiness.theme));
    const helpChanged = settingsHelpEnabled !== (activeBusiness.settings?.contextual_help_enabled !== false);
    const taxProfileChanged = JSON.stringify(nextTaxProfile) !== JSON.stringify(normalizeTaxProfile(activeBusiness.settings?.tax_profile));
    const logoChanged = Boolean(settingsLogoFile) || (settingsRemoveLogo && Boolean(activeBusiness.logo_path));
    if (!nameChanged && !slugChanged && !currencyChanged && !themeChanged && !helpChanged && !assistantNameChanged && !logoChanged && !commercialProfileChanged && !taxProfileChanged) {
      setNotice("No hay cambios pendientes.");
      return;
    }
    setBusy(true); setError(""); setNotice("");
    let uploadedLogoPath = null;
    let businessUpdated = false;
    try {
      const hasData = await businessHasFinancialData(activeBusiness.id);
      setSettingsHasData(hasData);
      if (hasData && currencyChanged && (!Number.isFinite(conversionRate) || conversionRate <= 0)) {
        throw new Error("Indica una tasa de conversión válida antes de cambiar la moneda.");
      }
      let nextLogoPath = settingsRemoveLogo ? null : activeBusiness.logo_path || null;
      if (settingsLogoFile) {
        const converted = await prepareProductImage(settingsLogoFile);
        uploadedLogoPath = activeBusiness.id + "/" + crypto.randomUUID() + ".webp";
        const { error: uploadError } = await supabase.storage.from("business-logos").upload(
          uploadedLogoPath, converted, { contentType: "image/webp", cacheControl: "3600", upsert: false }
        );
        if (uploadError) throw uploadError;
        nextLogoPath = uploadedLogoPath;
      }
      if (currencyChanged && hasData) {
        const { error: conversionError } = await supabase.rpc("convert_business_catalog_currency", {
          p_business_id: activeBusiness.id,
          p_target_currency: settingsCurrency,
          p_rate: conversionRate
        });
        if (conversionError) throw conversionError;
      }
      let savedSlug = activeBusiness.slug || "";
      if (slugChanged) {
        const { data: slugData, error: slugError } = await supabase.rpc("set_business_catalog_slug", { p_business_id: activeBusiness.id, p_slug: nextSlug });
        if (slugError) throw slugError;
        savedSlug = slugData || nextSlug;
      }
      const { data, error: updateError } = await supabase.from("businesses")
        .update({ name: businessName, currency_code: settingsCurrency, theme: nextTheme, logo_path: nextLogoPath, settings: nextSettings })
        .eq("id", activeBusiness.id)
        .select("id,name,currency_code,theme,logo_path,settings")
        .maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("No se pudo guardar la personalización. Comprueba que hayas iniciado sesión como propietario.");
      businessUpdated = true;
      setActiveBusiness((current) => current ? { ...current, name: data.name, slug: savedSlug, currency_code: data.currency_code, theme: normalizeBusinessTheme(data.theme), logo_path: data.logo_path, settings: data.settings || nextSettings } : current);
      setBusinesses((current) => current.map((business) => business.id === data.id ? { ...business, name: data.name, slug: savedSlug, currency_code: data.currency_code, theme: normalizeBusinessTheme(data.theme), logo_path: data.logo_path, settings: data.settings || nextSettings } : business));
      setSettingsCatalogSlug(savedSlug);
      setSettingsBusinessName(data.name);
      setSettingsCurrency(data.currency_code);
      setSettingsConversionRate("");
      setSettingsTheme(normalizeBusinessTheme(data.theme));
      setSettingsHelpEnabled(data.settings?.contextual_help_enabled !== false);
      setSettingsTaxProfile(normalizeTaxProfile(data.settings?.tax_profile || nextTaxProfile));
      setSettingsCommercialProfile(commercialProfile);
      setSettingsLogoFile(null);
      setSettingsLogoPreview("");
      setSettingsRemoveLogo(false);
      setNotice(currencyChanged && hasData ? "Configuración guardada. Convertimos los precios del catálogo con la tasa indicada y conservamos las operaciones históricas en su moneda original." : "Configuración guardada. Conservamos los datos de tu empresa, el logo y la apariencia.");
      const previousLogoPath = activeBusiness.logo_path;
      if (previousLogoPath && previousLogoPath !== data.logo_path) {
        try { await supabase.storage.from("business-logos").remove([previousLogoPath]); }
        catch { /* Un archivo antiguo huérfano no afecta al logo activo. */ }
      }
    } catch (e) {
      if (uploadedLogoPath && !businessUpdated) {
        try { await supabase.storage.from("business-logos").remove([uploadedLogoPath]); } catch { /* Limpieza opcional tras un fallo de guardado. */ }
      }
      setError(friendlyError(e));
    } finally { setBusy(false); }
  }

  function cancelProductForm() {
    stagedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    setStagedImages([]);
    setProductForm(blankProduct);
    setProductCodeMode("auto");
    setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant);
    if (editingProductId) setOpenProductGalleries((current) => ({ ...current, [editingProductId]: false }));
    setEditingProductId(null);
    setAdjustDelta(""); setAdjustNote(""); setAdjustOtherNote("");
    setStockMovementRows([]); setStockMovementsCount(0); setStockMovementPage(1);
    setShowProductForm(false);
    setError("");
  }

  function startEditProduct(product) {
    stagedImages.forEach((image) => URL.revokeObjectURL(image.preview));
    const knownUnit = unitOptions.some(([value]) => value === product.unit_name);
    const digits = currencyDigits(currencyCode);
    setStagedImages([]);
    setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant);
    setProductCodeMode(product.metadata?.sku_mode === "auto" ? "auto" : "manual");
    setEditingProductId(product.id);
    setStockMovementPage(1);
    setAdjustDelta(""); setAdjustNote(""); setAdjustOtherNote("");
    setOpenProductGalleries((current) => ({ ...current, [product.id]: true }));
    setShowProductForm(true);
    setProductForm({
      name: product.name || "",
      sku: product.sku || "",
      category_id: product.category_id || "",
      description: product.description || "",
      commercial_presentation: product.commercial_presentation || "",
      product_type: product.product_type || "physical",
      unit_name: knownUnit ? product.unit_name : "personalizada",
      unit_custom: knownUnit ? "" : (product.unit_name || ""),
      sale_price: String(Number(product.sale_price_minor || 0) / (10 ** digits)),
      cost_price: String(Number(product.cost_price_minor || 0) / (10 ** digits)),
      stock: String(product.stock_on_hand ?? 0),
      low_stock: product.low_stock_threshold == null ? "" : String(product.low_stock_threshold),
      tax_code: product.metadata?.tax_code || "none",
      is_published: product.is_published === true,
      is_bundle: product.metadata?.is_bundle === true || product.metadata?.is_bundle === "true",
      bundle_components: Array.isArray(product.metadata?.bundle_components) && product.metadata.bundle_components.length ? product.metadata.bundle_components.map(component=>({product_id:component.product_id||"",quantity:String(component.quantity||"1")})) : [{product_id:"",quantity:"1"},{product_id:"",quantity:"1"}],
      bundle_discount: String(Number(product.metadata?.bundle_discount_minor||0)/(10**digits))
    });
    if (product.metadata?.is_bundle) loadBundleProductOptions().catch(error=>setError(friendlyError(error)));
    setError("");
    setNotice("");
  }

  async function loadProductVariants(productId) {
    if (!activeBusiness?.id || !productId) return;
    const { data, error: variantsError } = await supabase.from("product_variants")
      .select("id,business_id,product_id,variant_name,variant_value,sku,sale_price_minor,stock_on_hand,is_active,image_paths,created_at")
      .eq("business_id", activeBusiness.id).eq("product_id", productId)
      .order("variant_name").order("variant_value").limit(500);
    if (variantsError) throw variantsError;
    const rows = data || [];
    setVariantsByProduct((current) => ({ ...current, [productId]: rows }));
    return rows;
  }

  function openProductVariants(product) {
    setViewingVariantsFor(product.id);
    setVariantDraft(blankVariantDraft);
    setEditingVariantId(null);
    setError("");
    loadProductVariants(product.id).catch((e) => setError(friendlyError(e)));
  }

  function editProductVariant(variant) {
    const digits = currencyDigits(currencyCode);
    (variantDraft.staged_images || []).forEach((image) => { if (image.preview) URL.revokeObjectURL(image.preview); });
    setVariantDraft({
      ...parseVariantCombination(variant),
      sku: variant.sku || "",
      sale_price: variant.sale_price_minor == null ? "" : String(Number(variant.sale_price_minor) / (10 ** digits)),
      stock_on_hand: variant.stock_on_hand == null ? "" : String(variant.stock_on_hand),
      image_paths: [...(variant.image_paths || [])],
      staged_images: []
    });
    setEditingVariantId(variant.id);
    setError("");
  }

  function resetVariantDraft() {
    (variantDraft.staged_images || []).forEach((image) => { if (image.preview) URL.revokeObjectURL(image.preview); });
    setVariantDraft(blankVariantDraft);
    setEditingVariantId(null);
  }

  async function chooseVariantImages(event) {
    const input = event.currentTarget;
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length) return;
    const existingCount = (variantDraft.image_paths || []).length + (variantDraft.staged_images || []).length;
    const allowed = Math.max(0, 2 - existingCount);
    if (!allowed) { setError("Cada variante admite dos fotos como máximo."); return; }
    if (files.length > allowed) setError("Solo puedes añadir " + allowed + (allowed === 1 ? " foto más a esta variante." : " fotos más a esta variante."));
    try {
      const ready = [];
      for (const original of files.slice(0, allowed)) {
        const optimized = await prepareProductImage(original);
        ready.push({ file: optimized, preview: URL.createObjectURL(optimized), name: original.name });
      }
      setVariantDraft((draft) => ({ ...draft, staged_images: [...(draft.staged_images || []), ...ready].slice(0, Math.max(0, 2 - (draft.image_paths || []).length)) }));
    } catch (error) { setError(friendlyError(error)); }
  }

  async function removeVariantPhoto(variant, imageKey) {
    if (!activeBusiness?.id || !viewingVariantsFor || variantBusy) return;
    setVariantBusy(true); setError(""); setNotice("");
    try {
      await deleteProductVariantImage(viewingVariantsFor, variant.id, imageKey, activeBusiness.id);
      setVariantDraft((draft) => ({ ...draft, image_paths: (draft.image_paths || []).filter((key) => key !== imageKey) }));
      await loadProductVariants(viewingVariantsFor);
      setNotice("Foto de la variante eliminada.");
    } catch (error) { setError(friendlyError(error)); }
    finally { setVariantBusy(false); }
  }

  async function saveProductVariant(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !viewingVariantsFor) return;
    const firstName = String(variantDraft.variant_name || "").trim();
    const firstValue = String(variantDraft.variant_value || "").trim();
    const secondName = String(variantDraft.variant_name_2 || "").trim();
    const secondValue = String(variantDraft.variant_value_2 || "").trim();
    if (!firstName || !firstValue || Boolean(secondName) !== Boolean(secondValue)) {
      setError("Completa el primer atributo y valor. El segundo par puede quedar vacío, pero no incompleto.");
      return;
    }
    const existingProduct = products.find((product) => product.id === viewingVariantsFor);
    const codeMode = existingProduct?.metadata?.sku_mode === "auto" ? "auto" : "manual";
    if (!editingVariantId && codeMode === "manual" && !String(variantDraft.sku || "").trim()) {
      setError("Escribe el código de la variante o cambia a códigos automáticos en el producto.");
      return;
    }
    if (String(variantDraft.stock_on_hand || "").trim() !== "" && (!Number.isFinite(Number(variantDraft.stock_on_hand)) || Number(variantDraft.stock_on_hand) < 0)) {
      setError("Las existencias de la variante deben ser cero o un número positivo.");
      return;
    }
    if (existingProduct?.track_inventory && Number(existingProduct.stock_on_hand || 0) > 0) {
      setError("Este producto tiene existencias generales. Registra primero su salida o ajuste a cero antes de pasar a controlar stock por combinaciones.");
      return;
    }
    setVariantBusy(true); setError(""); setNotice("");
    try {
      const payload = {
        business_id: activeBusiness.id,
        product_id: viewingVariantsFor,
        variant_name: secondName ? firstName + " + " + secondName : firstName,
        variant_value: secondName ? firstValue + " / " + secondValue : firstValue,
        sku: editingVariantId ? (String(variantDraft.sku || "").trim() || null) : (codeMode === "auto" ? makeInternalVariantSku(existingProduct?.sku) : String(variantDraft.sku || "").trim() || null),
        sale_price_minor: variantDraft.sale_price.trim() === "" ? null : toMinorUnits(variantDraft.sale_price, currencyCode),
        stock_on_hand: variantDraft.stock_on_hand.trim() === "" ? null : Number(variantDraft.stock_on_hand),
        is_active: true
      };
      let variantId = editingVariantId;
      if (editingVariantId) {
        const { data, error: saveError } = await supabase.from("product_variants").update({
          variant_name: payload.variant_name,
          variant_value: payload.variant_value,
          sku: payload.sku,
          sale_price_minor: payload.sale_price_minor,
          is_active: payload.is_active,
          updated_at: new Date().toISOString()
        }).eq("id", editingVariantId).eq("business_id", activeBusiness.id).eq("product_id", viewingVariantsFor).select("id").maybeSingle();
        if (saveError) throw saveError;
        if (!data?.id) throw new Error("No se pudo guardar la variante.");
        variantId = data.id;
        if (payload.stock_on_hand !== null) {
          const { error: stockError } = await supabase.rpc("set_product_variant_stock", {
            p_business_id: activeBusiness.id, p_product_id: viewingVariantsFor,
            p_variant_id: variantId, p_quantity: payload.stock_on_hand,
            p_notes: "Ajuste manual desde el editor de variantes"
          });
          if (stockError) throw stockError;
        }
      } else {
        const { data, error: saveError } = await supabase.from("product_variants").insert({ ...payload, stock_on_hand: null }).select("id").single();
        if (saveError) throw saveError;
        if (!data?.id) throw new Error("No se pudo crear la variante.");
        variantId = data.id;
        if (payload.stock_on_hand !== null) {
          const { error: stockError } = await supabase.rpc("set_product_variant_stock", {
            p_business_id: activeBusiness.id, p_product_id: viewingVariantsFor,
            p_variant_id: variantId, p_quantity: payload.stock_on_hand,
            p_notes: "Existencias iniciales al crear la combinación"
          });
          if (stockError) throw stockError;
        }
      }
      const { error: parentError } = await supabase.from("products").update({
        track_inventory: false, stock_on_hand: 0, low_stock_threshold: null,
        metadata: { ...(existingProduct?.metadata || {}), has_variants: true, sku_mode: existingProduct?.metadata?.sku_mode || "manual" },
        updated_at: new Date().toISOString()
      }).eq("business_id", activeBusiness.id).eq("id", viewingVariantsFor);
      if (parentError) throw parentError;
      await loadProducts();
      let photosSaved = 0;
      let photosFailed = 0;
      for (const photo of (variantDraft.staged_images || []).slice(0, Math.max(0, 2 - (variantDraft.image_paths || []).length))) {
        try { await uploadProductVariantImage(viewingVariantsFor, variantId, photo.file, activeBusiness.id); photosSaved += 1; }
        catch { photosFailed += 1; }
      }
      await loadProductVariants(viewingVariantsFor);
      resetVariantDraft();
      setNotice((editingVariantId ? "Variante actualizada." : "Variante agregada.") + (photosSaved ? " " + photosSaved + (photosSaved === 1 ? " foto guardada." : " fotos guardadas.") : ""));
      if (photosFailed) setError("La variante se guardó, pero no se pudieron subir " + photosFailed + (photosFailed === 1 ? " foto." : " fotos.") + " Reintenta desde Editar variante.");
    } catch (e) {
      setError(friendlyError(e));
    } finally { setVariantBusy(false); }
  }

  async function removeProductVariant(variant) {
    if (!activeBusiness?.id || !viewingVariantsFor) return;
    if (!window.confirm("¿Quitar la variante " + variant.variant_name + " · " + variant.variant_value + "?")) return;
    setVariantBusy(true); setError(""); setNotice("");
    try {
      const { error: deleteError } = await supabase.from("product_variants").delete()
        .eq("id", variant.id).eq("business_id", activeBusiness.id).eq("product_id", viewingVariantsFor);
      if (deleteError) throw deleteError;
      await loadProductVariants(viewingVariantsFor);
      if (editingVariantId === variant.id) resetVariantDraft();
      setNotice("Variante eliminada.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setVariantBusy(false); }
  }

  async function archiveProduct(product) {
    if (!activeBusiness?.id) return;
    const restoring = Boolean(product.archived_at);
    const confirmation = restoring
      ? "¿Restaurar " + product.name + " para que vuelva a la lista de productos?"
      : "¿Archivar " + product.name + "? No se borrará ni se alterará su historial.";
    if (!window.confirm(confirmation)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: archiveError } = await supabase.from("products")
        .update({ archived_at: restoring ? null : new Date().toISOString() })
        .eq("business_id", activeBusiness.id).eq("id", product.id).select("id").maybeSingle();
      if (archiveError) throw archiveError;
      if (!data) throw new Error("No se pudo actualizar el producto. Comprueba tus permisos.");
      setNotice(restoring ? "Producto restaurado." : "Producto archivado. Puedes encontrarlo en «Archivados».");
      if (viewingVariantsFor === product.id) setViewingVariantsFor(null);
      setInventoryOverviewRefresh((current) => current + 1);
      await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function loadTaxBulkProducts() {
    if (!activeBusiness?.id || !canManageProducts || taxBulkLoading) return;
    setTaxBulkLoading(true); setError("");
    try {
      const rows = await fetchAllProfitabilityRows(
        () => supabase.from("products").select("id,business_id,name,sku,metadata,archived_at")
          .eq("business_id",activeBusiness.id).is("archived_at",null).order("name"),
        "productos para asignar impuestos"
      );
      setTaxBulkProducts(rows);
    } catch (error) { setError(friendlyError(error)); }
    finally { setTaxBulkLoading(false); }
  }

  async function applyBulkTaxToProducts() {
    if (!activeBusiness?.id || !canManageProducts || taxBulkSaving) return;
    const ids = [...new Set(taxBulkProductIds)];
    if (!ids.length) { setError("Selecciona al menos un producto para aplicar el impuesto."); return; }
    if (ids.length > 250) { setError("Puedes aplicar el impuesto a un máximo de 250 productos por operación."); return; }
    setTaxBulkSaving(true); setError(""); setNotice("");
    try {
      const { data, error: rpcError } = await supabase.rpc("set_products_tax_code", {
        p_business_id: activeBusiness.id, p_product_ids: ids, p_tax_code: taxBulkCode
      });
      if (rpcError) throw rpcError;
      if (Number(data) !== ids.length) throw new Error("No se actualizaron todos los productos seleccionados.");
      setTaxBulkProductIds([]);
      setTaxBulkSearch("");
      setInventoryOverviewRefresh((current) => current + 1);
      await loadProducts();
      await loadTaxBulkProducts();
      setNotice("Impuesto actualizado en " + ids.length + (ids.length===1 ? " producto." : " productos."));
    } catch (error) { setError(friendlyError(error)); }
    finally { setTaxBulkSaving(false); }
  }

  const taxBulkFilteredProducts = taxBulkProducts.filter((product) => {
    const term = taxBulkSearch.trim().toLocaleLowerCase("es-CO");
    return !term || String(product.name || "").toLocaleLowerCase("es-CO").includes(term) || String(product.sku || "").toLocaleLowerCase("es-CO").includes(term);
  });
  const availableBundleComponents = (bundleProductOptions.length ? bundleProductOptions : products).filter(product =>
    product.id !== editingProductId && product.product_type === "physical" && product.is_sellable !== false &&
    !product.archived_at && product.metadata?.is_bundle !== true && product.metadata?.is_bundle !== "true"
  );
  const bundleDraftRows = (productForm.bundle_components || []).map(component => ({
    product_id: component.product_id,
    quantity: Number(component.quantity),
    product: availableBundleComponents.find(product => product.id === component.product_id)
  })).filter(component => component.product_id && component.product);
  const bundleSubtotalMinor = bundleDraftRows.reduce((sum, component) => sum + Math.round(Number(component.product.sale_price_minor || 0) * component.quantity), 0);
  const bundleCostMinor = bundleDraftRows.reduce((sum, component) => sum + Math.round(Number(component.product.cost_price_minor || 0) * component.quantity), 0);
  const bundleDiscountMinor = Math.max(0, toMinorUnits(productForm.bundle_discount || "0", currencyCode));
  const bundleSalePriceMinor = Math.max(0, bundleSubtotalMinor - bundleDiscountMinor);

  async function loadBundleProductOptions() {
    if (!activeBusiness?.id) return [];
    setBundleOptionsLoading(true);
    try {
      const { data, error: optionsError } = await supabase.from("products")
        .select("id,business_id,name,product_type,sale_price_minor,cost_price_minor,stock_on_hand,track_inventory,is_sellable,archived_at,metadata")
        .eq("business_id", activeBusiness.id).eq("product_type", "physical")
        .eq("is_sellable", true).is("archived_at", null).order("name").limit(500);
      if (optionsError) throw optionsError;
      const options = (data || []).filter(product => product.metadata?.is_bundle !== true && product.metadata?.is_bundle !== "true");
      setBundleProductOptions(options);
      return options;
    } finally { setBundleOptionsLoading(false); }
  }

  function addNewProductVariantDraft() {
    const firstName = String(newProductVariantDraft.variant_name || "").trim();
    const firstValue = String(newProductVariantDraft.variant_value || "").trim();
    const secondName = String(newProductVariantDraft.variant_name_2 || "").trim();
    const secondValue = String(newProductVariantDraft.variant_value_2 || "").trim();
    const draftSku = String(newProductVariantDraft.sku || "").trim();
    const draftStock = String(newProductVariantDraft.stock_on_hand || "").trim();
    if (!firstName || !firstValue) { setError("Completa el atributo 1 y su valor, por ejemplo Color: Rojo."); return; }
    if (Boolean(secondName) !== Boolean(secondValue)) { setError("Completa ambos campos del segundo atributo o déjalos vacíos."); return; }
    if (productCodeMode === "manual" && !draftSku) { setError("Escribe un código para esta combinación porque elegiste códigos manuales."); return; }
    if (productForm.product_type === "physical" && draftStock === "") { setError("Indica las existencias de esta combinación (puede ser 0)."); return; }
    if (draftStock !== "" && (!Number.isFinite(Number(draftStock)) || Number(draftStock) < 0)) { setError("Las existencias deben ser cero o un número positivo."); return; }
    if (String(newProductVariantDraft.sale_price || "").trim() !== "" && (!Number.isFinite(Number(newProductVariantDraft.sale_price)) || Number(newProductVariantDraft.sale_price) < 0)) { setError("El precio de la combinación debe ser cero o un valor positivo."); return; }
    const draft = {
      variant_name: secondName ? firstName + " + " + secondName : firstName,
      variant_value: secondName ? firstValue + " / " + secondValue : firstValue,
      sku: productCodeMode === "manual" ? draftSku : "",
      sale_price: String(newProductVariantDraft.sale_price || "").trim(),
      stock_on_hand: draftStock
    };
    const duplicate = newProductVariants.some((variant) =>
      String(variant.variant_name).trim().toLocaleLowerCase() === draft.variant_name.toLocaleLowerCase()
      && String(variant.variant_value).trim().toLocaleLowerCase() === draft.variant_value.toLocaleLowerCase()
    );
    if (duplicate) { setError("Esta combinación ya está en la lista. Modifica el color, la talla u otro atributo."); return; }
    setNewProductVariants((current) => [...current, draft]);
    if (productForm.product_type === "physical") setProductForm((current) => ({ ...current, stock: "0", low_stock: "" }));
    setNewProductVariantDraft(blankNewProductVariant);
    setError("");
  }

  function editNewProductVariant(index) {
    const variant = newProductVariants[index];
    if (!variant) return;
    setNewProductVariantDraft({
      ...blankNewProductVariant,
      ...parseVariantCombination(variant),
      sku: productCodeMode === "manual" ? String(variant.sku || "") : "",
      sale_price: String(variant.sale_price || ""),
      stock_on_hand: String(variant.stock_on_hand ?? "")
    });
    setNewProductVariants((current) => current.filter((_, rowIndex) => rowIndex !== index));
    setError("");
  }

  async function addProduct(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    const currentProduct = editingProductId ? products.find(product => product.id === editingProductId) : null;
    const selectedBundleComponents = (productForm.bundle_components || []).filter(component => component.product_id);
    const selectedBundleIds = selectedBundleComponents.map(component => component.product_id);
    const effectiveProductSku = editingProductId
      ? (productCodeMode === "auto" ? (currentProduct?.sku || productForm.sku.trim() || makeInternalProductSku()) : (productForm.sku.trim() || currentProduct?.sku || ""))
      : (productCodeMode === "auto" ? makeInternalProductSku() : productForm.sku.trim());
    if (!effectiveProductSku) { setError("Escribe el código del artículo o selecciona códigos automáticos."); return; }
    const draftVariantTouched = Object.values(newProductVariantDraft || {}).some((value) => String(value || "").trim() !== "");
    const variantsToCreate = !editingProductId ? [...newProductVariants] : [];
    if (!editingProductId && draftVariantTouched) {
      const firstName = String(newProductVariantDraft.variant_name || "").trim();
      const firstValue = String(newProductVariantDraft.variant_value || "").trim();
      const secondName = String(newProductVariantDraft.variant_name_2 || "").trim();
      const secondValue = String(newProductVariantDraft.variant_value_2 || "").trim();
      if (!firstName || !firstValue || Boolean(secondName) !== Boolean(secondValue)) {
        setError("Completa correctamente los atributos y valores de la variante en curso o limpia los campos.");
        return;
      }
      if (productCodeMode === "manual" && !String(newProductVariantDraft.sku || "").trim()) {
        setError("Escribe el código de la variante o selecciona códigos automáticos.");
        return;
      }
      if (productForm.product_type === "physical" && String(newProductVariantDraft.stock_on_hand || "").trim() === "") {
        setError("Indica las existencias de esta combinación antes de guardar el producto.");
        return;
      }
      variantsToCreate.push({
        variant_name: secondName ? firstName + " + " + secondName : firstName,
        variant_value: secondName ? firstValue + " / " + secondValue : firstValue,
        sku: productCodeMode === "manual" ? String(newProductVariantDraft.sku || "").trim() : "",
        sale_price: String(newProductVariantDraft.sale_price || "").trim(),
        stock_on_hand: String(newProductVariantDraft.stock_on_hand || "").trim()
      });
    }
    if (variantsToCreate.some((variant) => productForm.product_type === "physical" && String(variant.stock_on_hand ?? "").trim() === "")) { setError("Cada combinación física debe tener sus propias existencias, aunque sean cero."); return; }
    if (productCodeMode === "manual" && variantsToCreate.some((variant) => !String(variant.sku || "").trim())) { setError("Completa el código de cada variante porque elegiste códigos manuales."); return; }
    const variantKeys = variantsToCreate.map((variant) => String(variant.variant_name).trim().toLocaleLowerCase() + "::" + String(variant.variant_value).trim().toLocaleLowerCase());
    if (new Set(variantKeys).size !== variantKeys.length) {
      setError("Hay variantes repetidas. Deja una sola fila para cada tipo y valor.");
      return;
    }
    if (variantsToCreate.some((variant) => (String(variant.sale_price || "").trim() !== "" && (!Number.isFinite(Number(variant.sale_price)) || Number(variant.sale_price) < 0)) || (String(variant.stock_on_hand || "").trim() !== "" && (!Number.isFinite(Number(variant.stock_on_hand)) || Number(variant.stock_on_hand) < 0)))) {
      setError("Revisa los precios y las existencias de las variantes: deben ser valores iguales o mayores que cero.");
      return;
    }
    const discountMinor = Math.max(0, toMinorUnits(productForm.bundle_discount || "0", currencyCode));
    if (productForm.is_bundle) {
      if (currentProduct?.track_inventory && Number(currentProduct.stock_on_hand || 0) > 0) {
        setError("Antes de convertir este artículo en un paquete, registra la salida de sus existencias actuales.");
        return;
      }
      if (selectedBundleComponents.length < 2 || selectedBundleIds.length !== new Set(selectedBundleIds).size) {
        setError("Selecciona al menos 2 productos distintos para crear el paquete.");
        return;
      }
      if (selectedBundleComponents.some(component => !Number.isInteger(Number(component.quantity)) || Number(component.quantity) < 1)) {
        setError("Cada cantidad del paquete debe ser un número entero mayor que cero.");
        return;
      }
      if (bundleDraftRows.length !== selectedBundleComponents.length) {
        setError("Elige un producto válido en cada línea del paquete.");
        return;
      }
      if (discountMinor > bundleSubtotalMinor) {
        setError("El descuento no puede superar el precio combinado de los productos.");
        return;
      }
    }
    setBusy(true); setError(""); setNotice("");
    try {
      const pendingImages = [...stagedImages];
      const existingMetadata = { ...(currentProduct?.metadata || {}) };
      delete existingMetadata.is_bundle;
      delete existingMetadata.bundle_components;
      delete existingMetadata.bundle_discount_minor;
      const productMetadata = {
        ...existingMetadata,
        tax_code: productForm.tax_code || "none",
        sku_mode: productCodeMode,
        has_variants: Boolean(currentProduct?.metadata?.has_variants) || variantsToCreate.length > 0,
        ...(productForm.is_bundle ? {
          is_bundle: true,
          bundle_components: selectedBundleComponents.map(component => ({ product_id: component.product_id, quantity: Number(component.quantity) })),
          bundle_discount_minor: discountMinor
        } : {})
      };
      const salePriceMinor = productForm.is_bundle ? bundleSalePriceMinor : toMinorUnits(productForm.sale_price, currencyCode);
      const costPriceMinor = productForm.is_bundle ? bundleCostMinor : toMinorUnits(productForm.cost_price, currencyCode);
      if (editingProductId) {
        const { data: updated, error: updateError } = await supabase.from("products")
          .update({
            name: productForm.name.trim(),
            sku: effectiveProductSku,
            category_id: productForm.category_id || null,
            description: productForm.description.trim() || null,
            commercial_presentation: productForm.commercial_presentation.trim() || null,
            unit_name: (productForm.unit_name === "personalizada" ? productForm.unit_custom.trim() : productForm.unit_name.trim()) || "unidad",
            sale_price_minor: salePriceMinor,
            cost_price_minor: costPriceMinor,
            is_published: productForm.is_published === true,
            low_stock_threshold: productForm.is_bundle ? null : (productForm.product_type === "physical" && productForm.low_stock !== "" ? Number(productForm.low_stock) : null),
            metadata: productMetadata,
            ...(productForm.is_bundle ? { track_inventory: false, stock_on_hand: 0 } : currentProduct?.metadata?.is_bundle ? { track_inventory: productForm.product_type === "physical", stock_on_hand: 0 } : {})
          })
          .eq("business_id", activeBusiness.id).eq("id", editingProductId)
          .select("id").maybeSingle();
        if (updateError) throw updateError;
        if (!updated) throw new Error("No se pudo actualizar el producto. Comprueba tus permisos.");
        setProductForm(blankProduct); setShowProductForm(false);
        setOpenProductGalleries((current) => ({ ...current, [editingProductId]: false }));
        setEditingProductId(null);
        setStagedImages([]);
        pendingImages.forEach((image) => URL.revokeObjectURL(image.preview));
        setInventoryOverviewRefresh((current) => current + 1);
        await loadProducts();
        setNotice(productForm.is_bundle ? "Paquete actualizado. El descuento se aplica al paquete; los precios individuales permanecen iguales." : "Producto actualizado. El historial de existencias se conservó.");
        return;
      }
      const { data: newProductId, error: rpcError } = await supabase.rpc("create_product_with_opening_stock", {
        p_business_id: activeBusiness.id,
        p_name: productForm.name.trim(),
        p_category_id: productForm.category_id || null,
        p_sku: effectiveProductSku,
        p_description: productForm.description.trim() || null,
        p_product_type: productForm.product_type,
        p_unit_name: (productForm.unit_name === "personalizada" ? productForm.unit_custom.trim() : productForm.unit_name.trim()) || "unidad",
        p_sale_price_minor: salePriceMinor,
        p_cost_price_minor: costPriceMinor,
        p_opening_stock: productForm.is_bundle || (variantsToCreate.length > 0 && productForm.product_type === "physical") ? 0 : Number(productForm.stock || 0),
        p_low_stock_threshold: productForm.is_bundle || variantsToCreate.length > 0 || productForm.low_stock === "" ? null : Number(productForm.low_stock),
        p_commercial_presentation: productForm.commercial_presentation.trim() || null
      });
      if (rpcError) throw rpcError;
      const { error: metadataError } = await supabase.from("products").update({ metadata: productMetadata, is_published: productForm.is_published === true, ...(productForm.is_bundle ? { track_inventory: false, stock_on_hand: 0 } : variantsToCreate.length && productForm.product_type === "physical" ? { track_inventory: false, stock_on_hand: 0, low_stock_threshold: null } : {}) }).eq("business_id", activeBusiness.id).eq("id", newProductId);
      if (metadataError) throw metadataError;
      let variantSaveWarning = "";
      if (variantsToCreate.length) {
        const variantPayloads = variantsToCreate.map((variant) => ({
          business_id: activeBusiness.id,
          product_id: newProductId,
          variant_name: String(variant.variant_name).trim(),
          variant_value: String(variant.variant_value).trim(),
          sku: productCodeMode === "auto" ? makeInternalVariantSku(effectiveProductSku) : String(variant.sku || "").trim() || null,
          sale_price_minor: String(variant.sale_price || "").trim() === "" ? null : toMinorUnits(variant.sale_price, currencyCode),
          stock_on_hand: null,
          is_active: true
        }));
        const { data: insertedVariants, error: variantsError } = await supabase.from("product_variants").insert(variantPayloads).select("id,product_id");
        if (variantsError) {
          variantSaveWarning = friendlyError(variantsError);
        } else if (productForm.product_type === "physical") {
          for (let index = 0; index < (insertedVariants || []).length; index += 1) {
            const createdVariant = insertedVariants[index];
            const quantity = Number(variantsToCreate[index]?.stock_on_hand || 0);
            const { error: stockError } = await supabase.rpc("set_product_variant_stock", {
              p_business_id: activeBusiness.id, p_product_id: newProductId,
              p_variant_id: createdVariant.id, p_quantity: quantity,
              p_notes: "Existencias iniciales al crear el producto"
            });
            if (stockError) { variantSaveWarning = friendlyError(stockError); break; }
          }
        }
      }
      setProductForm(blankProduct); setShowProductForm(false);
      setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant);
      setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant);
      setStagedImages([]);
      pendingImages.forEach((image) => URL.revokeObjectURL(image.preview));
      let uploaded = 0;
      let imageFailures = 0;
      for (const image of pendingImages) {
        try { await uploadProductImage(newProductId, image.file, activeBusiness.id); uploaded += 1; }
        catch { imageFailures += 1; }
      }
      setInventoryOverviewRefresh((current) => current + 1);
      setNotice(productForm.is_bundle ? "Paquete guardado. El precio especial aplica solo al paquete y se actualiza el inventario de sus productos al venderlo." : "Producto guardado. Las existencias iniciales quedaron registradas en el historial." + (uploaded ? " " + uploaded + (uploaded === 1 ? " foto guardada." : " fotos guardadas.") : ""));
      const postSaveWarnings = [];
      if (imageFailures) postSaveWarnings.push("El producto sí se guardó, pero " + imageFailures + (imageFailures === 1 ? " foto no pudo subirse." : " fotos no pudieron subirse.") + " Puedes reintentarlo desde la ficha del producto.");
      if (variantSaveWarning) postSaveWarnings.push("El producto sí se guardó, pero sus variantes no se pudieron guardar. Puedes añadirlas desde «Variantes» en la ficha del producto. " + variantSaveWarning);
      if (postSaveWarnings.length) setError(postSaveWarnings.join(" "));
      setSearch(""); setProductPage(1);
      await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function saveInlineStock(productId) {
    if (!productId || !activeBusiness?.id) return;
    const delta = Number(adjustDelta);
    if (!Number.isFinite(delta) || delta === 0) { setError("Escribe una cantidad distinta de cero."); return; }
    if (!adjustNote) { setError("Selecciona el motivo del ajuste."); return; }
    if (adjustNote === "Otro" && !adjustOtherNote.trim()) { setError("Describe el motivo del ajuste."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: rpcError } = await supabase.rpc("adjust_product_stock", {
        p_business_id: activeBusiness.id, p_product_id: productId,
        p_quantity_delta: delta, p_notes: (adjustNote === "Otro" ? ("Otro: " + adjustOtherNote.trim()).trim() : adjustNote.trim()) || null
      });
      if (rpcError) throw rpcError;
      const { data: fresh, error: refreshError } = await supabase.from("products").select("stock_on_hand").eq("business_id", activeBusiness.id).eq("id", productId).single();
      if (refreshError) throw refreshError;
      setProductForm((current) => ({ ...current, stock: String(fresh.stock_on_hand) }));
      setAdjustDelta(""); setAdjustNote(""); setAdjustOtherNote("");
      setNotice("Existencias actualizadas. El movimiento quedó guardado en el historial.");
      setStockMovementPage(1); setStockMovementRefresh((value) => value + 1);
      setInventoryOverviewRefresh((current) => current + 1);
      await loadProducts();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  function renderStockAdjustment(product) {
    if (!editingProductId || editingProductId !== product.id || !product.track_inventory) return null;
    const movementName = (type) => ({
      opening: "Existencias iniciales",
      sale: "Venta",
      purchase: "Compra",
      adjustment_in: "Ajuste de entrada",
      adjustment_out: "Ajuste de salida",
      return: "Devolución",
      return_in: "Devolución",
      damage: "Daño o pérdida"
    })[type] || (type ? type.replaceAll("_", " ") : "Movimiento");
    return <section className="edit-subpanel">
      <div className="edit-subpanel-heading"><strong>Existencias</strong><span>Actuales: {Number(product.stock_on_hand).toLocaleString("es-CO")} {product.unit_name || "unidades"}</span></div>
      <div className="stock-adjust-form">
        <div>
          <label><span className="field-label-heading">Cambio (+ entra, − sale)<FieldHelp enabled={contextualHelpEnabled} text="Registra el ajuste de inventario: un número positivo suma unidades y uno negativo las resta." /></span><input type="number" step="0.001" value={adjustDelta} onChange={(e) => setAdjustDelta(e.target.value)} placeholder="Ej. 5 o -2" /></label>
          <label><span className="field-label-heading">Motivo<FieldHelp enabled={contextualHelpEnabled} text="Selecciona la causa del movimiento manual de existencias. Para registrar una compra completa, utiliza el módulo Compras." /></span><select value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} required><option value="">Selecciona un motivo…</option><option value="Compra (ajuste manual)">Compra (ajuste manual)</option><option value="Daño">Daño</option><option value="Conteo físico">Conteo físico</option><option value="Devolución">Devolución</option><option value="Pérdida o robo">Pérdida o robo</option><option value="Uso interno">Uso interno</option><option value="Ajuste inicial">Ajuste inicial</option><option value="Corrección de registro">Corrección de registro</option><option value="Otro">Otro</option></select></label>{adjustNote === "Otro" && <label><span className="field-label-heading">Detalle del motivo *</span><input value={adjustOtherNote} onChange={(e) => setAdjustOtherNote(e.target.value)} maxLength={500} placeholder="Explica el motivo" required /></label>}
        </div>
        <button type="button" className="primary-button" disabled={busy || !adjustDelta || Number(adjustDelta) === 0} onClick={() => saveInlineStock(product.id)}>{busy ? "Guardando…" : "Guardar ajuste"}</button>
      </div>
      <div className="stock-history">
        <div className="stock-history-heading">
          <div><strong>Historial de movimientos</strong><span>{stockMovementsCount} {stockMovementsCount === 1 ? "movimiento" : "movimientos"}</span></div>
          {stockMovementsCount > 10 && <span className="stock-history-page-label">Página {stockMovementPage} de {Math.ceil(stockMovementsCount / 10)}</span>}
        </div>
        {stockMovementsLoading ? <p className="stock-history-empty">Cargando historial…</p>
          : stockMovementRows.length ? <div className="stock-history-list">{stockMovementRows.map((movement) => {
            const quantity = Number(movement.quantity_delta || 0);
            return <article className="stock-history-row" key={movement.id}>
              <span className={"stock-history-sign" + (quantity > 0 ? " stock-in" : quantity < 0 ? " stock-out" : "")}>{quantity > 0 ? "+" : ""}{quantity.toLocaleString("es-CO")}</span>
              <div className="stock-history-main">
                <strong>{movementName(movement.movement_type)}</strong>
                <span>{new Date(movement.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" })}</span>
                {movement.notes && <small>{movement.notes}</small>}
              </div>
            </article>;
          })}</div>
          : <p className="stock-history-empty">Todavía no hay movimientos registrados.</p>}
        {stockMovementsCount > 10 && <div className="stock-history-pagination">
          <button type="button" className="secondary-button" disabled={stockMovementPage <= 1 || stockMovementsLoading} onClick={() => setStockMovementPage((page) => Math.max(1, page - 1))}>Anterior</button>
          <span>{stockMovementPage} / {Math.ceil(stockMovementsCount / 10)}</span>
          <button type="button" className="secondary-button" disabled={stockMovementPage >= Math.ceil(stockMovementsCount / 10) || stockMovementsLoading} onClick={() => setStockMovementPage((page) => page + 1)}>Siguiente</button>
        </div>}
      </div>
    </section>;
  }

  function renderPhotoManager(product) {
    if (!editingProductId || editingProductId !== product.id || !openProductGalleries[product.id]) return null;
    return <div className="product-gallery-content">
      {(product.image_paths || []).length ? <div className="product-gallery-list">{product.image_paths.map((imageKey) => <figure className="product-gallery-item" key={imageKey}>
        {productImageUrls[product.id + "|" + imageKey]
          ? <img src={productImageUrls[product.id + "|" + imageKey]} alt={"Foto de " + product.name} onError={() => handleProductImageError(product.id, imageKey)} />
          : <div className="image-placeholder">{galleryLoadingFor === product.id ? "Cargando…" : "Imagen no disponible"}</div>}
        <button type="button" className="text-button danger-text" disabled={uploadingImagesFor === product.id} onClick={() => removeExistingProductImage(product.id, imageKey)}>Quitar</button>
      </figure>)}</div> : <p className="no-product-photos">Este producto aún no tiene fotos.</p>}
      {(product.image_paths || []).length < 3 && <label className="image-upload-label"><span className="field-label-heading">+ Añadir foto
        <FieldHelp enabled={contextualHelpEnabled} text="Agrega fotografías al producto para reconocerlo más fácilmente en el inventario." /></span><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploadingImagesFor === product.id || busy} onChange={(event) => chooseExistingProductImages(product, event)} />
      </label>}
      {uploadingImagesFor === product.id && <span className="helper-text">Optimizando y guardando fotos…</span>}
    </div>;
  }

  const customerFields = "id,full_name,first_name,last_name,company_name,document_type,document_number,email,phone,whatsapp,city,address,notes,advisor_name,created_at";

  async function loadCashRegisterSession() {
    if (!activeBusiness?.id || !session?.user?.id || !canAccessScreen("sales")) { setCashRegisterSession(null); return; }
    setCashRegisterLoading(true);
    try {
      const { data, error: queryError } = await supabase.from("cash_register_sessions")
        .select("id,business_id,opened_by,closed_by,currency_code,opening_cash_minor,closing_cash_minor,expected_cash_minor,difference_minor,close_notes,status,opened_at,closed_at")
        .eq("business_id", activeBusiness.id).eq("opened_by", session.user.id).eq("status", "open")
        .order("opened_at", { ascending: false }).limit(1).maybeSingle();
      if (queryError) throw queryError;
      setCashRegisterSession(data || null);
      if (data) setCashRegisterCloseAmount("");
    } catch (error) {
      setError(friendlyError(error));
      setCashRegisterSession(null);
    } finally { setCashRegisterLoading(false); }
  }

  useEffect(() => {
    if (screen === "sales" && activeBusiness?.id && session?.user?.id) loadCashRegisterSession();
  }, [screen, activeBusiness?.id, session?.user?.id]);

  async function openCashRegister(event) {
    event?.preventDefault();
    if (!activeBusiness?.id || !session?.user?.id || !canManageSales || cashRegisterSaving) return;
    const opening = toMinorUnits(cashRegisterOpenAmount, currencyCode);
    if (!Number.isSafeInteger(opening) || opening < 0) { setError("Escribe un monto inicial de caja válido."); return; }
    setCashRegisterSaving(true); setError(""); setNotice("");
    try {
      const { data, error: insertError } = await supabase.from("cash_register_sessions")
        .insert({business_id:activeBusiness.id,opened_by:session.user.id,currency_code:currencyCode,opening_cash_minor:opening})
        .select("id,business_id,opened_by,closed_by,currency_code,opening_cash_minor,closing_cash_minor,expected_cash_minor,difference_minor,close_notes,status,opened_at,closed_at").single();
      if (insertError) throw insertError;
      setCashRegisterSession(data);
      setCashRegisterOpenAmount("0");
      setNotice("Caja abierta. Los cobros en efectivo de este turno quedarán asociados a tu usuario.");
    } catch (error) { setError(friendlyError(error)); }
    finally { setCashRegisterSaving(false); }
  }

  async function closeCashRegister(event) {
    event?.preventDefault();
    const register = cashRegisterSession;
    if (!activeBusiness?.id || !session?.user?.id || !register || !canManageSales || cashRegisterSaving) return;
    const closing = toMinorUnits(cashRegisterCloseAmount, currencyCode);
    if (!Number.isSafeInteger(closing) || closing < 0) { setError("Escribe el efectivo contado al cerrar la caja."); return; }
    setCashRegisterSaving(true); setError(""); setNotice("");
    try {
      const [{data:payments,error:paymentsError},{data:expenses,error:expensesError}] = await Promise.all([
        supabase.from("sale_payments").select("amount_minor,payment_method,paid_at")
          .eq("business_id",activeBusiness.id).eq("created_by",session.user.id)
          .eq("payment_method","Efectivo").gte("paid_at",register.opened_at).lte("paid_at",new Date().toISOString()),
        supabase.from("expenses").select("amount_minor,payment_method,created_at")
          .eq("business_id",activeBusiness.id).eq("created_by",session.user.id)
          .eq("payment_method","Efectivo").gte("created_at",register.opened_at).lte("created_at",new Date().toISOString())
      ]);
      if (paymentsError) throw paymentsError;
      if (expensesError) throw expensesError;
      const received=(payments||[]).reduce((sum,row)=>sum+Number(row.amount_minor||0),0);
      const expenseTotal=(expenses||[]).reduce((sum,row)=>sum+Number(row.amount_minor||0),0);
      const expected=Number(register.opening_cash_minor||0)+received-expenseTotal;
      const {data,error:updateError}=await supabase.from("cash_register_sessions").update({
        closed_by:session.user.id,closed_at:new Date().toISOString(),status:"closed",
        closing_cash_minor:closing,expected_cash_minor:expected,difference_minor:closing-expected,
        close_notes:cashRegisterCloseNotes.trim()||null,updated_at:new Date().toISOString()
      }).eq("business_id",activeBusiness.id).eq("id",register.id).eq("status","open")
        .select("id").maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("La caja ya se cerró o no tienes permiso para modificarla.");
      setCashRegisterSummary({received,expenses:expenseTotal,expected,count:(payments||[]).length});
      setCashRegisterSession(null);
      setCashRegisterCloseAmount(""); setCashRegisterCloseNotes("");
      setNotice("Caja cerrada. Efectivo esperado: " + money(expected,currencyCode) + "; diferencia: " + money(closing-expected,currencyCode) + ".");
    } catch (error) { setError(friendlyError(error)); }
    finally { setCashRegisterSaving(false); }
  }

  async function loadSalesModuleData() {
    if (!activeBusiness?.id || (screen !== "sales" && screen !== "customers")) return;
    setSalesLoading(true);
    setError("");
    try {
      if (screen === "customers") {
        let query = supabase.from("customers")
          .select(customerFields, { count: "exact" })
          .eq("business_id", activeBusiness.id).order("full_name");
        const safeTerm = customerSearch.trim().replace(/[^\p{L}\p{N}@.+\-_\s]/gu, " ").replace(/\s+/g, " ").slice(0, 100);
        if (safeTerm) {
          const filter = ["full_name", "company_name", "email", "phone", "whatsapp", "document_number", "city", "advisor_name"]
            .map((field) => field + ".ilike.%" + safeTerm + "%").join(",");
          query = query.or(filter);
        }
        const customerFrom = (customersPage - 1) * customersPageSize;
        const result = await query.range(customerFrom, customerFrom + customersPageSize - 1);
        if (result.error) throw result.error;
        setCustomers(result.data || []);
        setCustomersCount(result.count || 0);
      } else {
        let salesQuery = supabase.from("sales").select("id,business_id,customer_id,created_by,advisor_name,sale_number,status,currency_code,subtotal_minor,tax_minor,total_minor,amount_paid_minor,notes,sold_at,created_at", { count: "exact" }).eq("business_id", activeBusiness.id);
        const salesToday = todayInBogota();
        const shiftSalesDate = (key, offset) => { const date = new Date(key + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + offset); return date.toISOString().slice(0,10); };
        const salesWeekStart = shiftSalesDate(salesToday, -((new Date(salesToday + "T12:00:00Z").getUTCDay() + 6) % 7));
        const salesFrom = salesPeriod === "day" ? salesToday : salesPeriod === "date" ? salesSelectedDate : salesPeriod === "week" ? salesWeekStart : salesPeriod === "month" ? salesToday.slice(0,7) + "-01" : salesPeriod === "year" ? salesToday.slice(0,4) + "-01-01" : salesPeriod === "custom" ? (salesDateFrom || salesToday) : null;
        const salesTo = salesPeriod === "date" ? salesSelectedDate : salesPeriod === "custom" ? (salesDateTo || salesToday) : salesPeriod === "all" ? null : salesToday;
        if (salesFrom) salesQuery = salesQuery.gte("sold_at", salesFrom + "T00:00:00-05:00");
        if (salesTo) salesQuery = salesQuery.lt("sold_at", shiftSalesDate(salesTo, 1) + "T00:00:00-05:00");
        const [salesResult, productsResult, customersResult] = await Promise.all([
          salesQuery.order("sold_at", { ascending: false }).order("created_at", { ascending: false })
            .range((salesPage - 1) * salesPageSize, (salesPage - 1) * salesPageSize + salesPageSize - 1),
          supabase.from("products").select("id,name,product_type,metadata,sale_price_minor,cost_price_minor,unit_name,stock_on_hand,track_inventory,is_sellable,archived_at")
            .eq("business_id", activeBusiness.id).eq("is_sellable", true).is("archived_at", null).order("name").limit(500),
          supabase.from("customers").select("id,full_name,company_name,email,phone,whatsapp,advisor_name")
            .eq("business_id", activeBusiness.id).order("full_name").limit(500)
        ]);
        if (salesResult.error) throw salesResult.error;
        if (productsResult.error) throw productsResult.error;
        if (customersResult.error) throw customersResult.error;
        setSaleProducts(productsResult.data || []);
        const salesRows = salesResult.data || [];
        setSalesCount(salesResult.count || 0);
        const customersById = Object.fromEntries((customersResult.data || []).map((customer) => [customer.id, customer]));
        const itemsBySale = {};
        const paymentsBySale = {};
        let memberNamesById = new Map();
        if (salesRows.length) {
          const saleIds = salesRows.map((sale) => sale.id);
          const [itemsResult, paymentsResult, membersResult] = await Promise.all([
            supabase.from("sale_items").select("id,sale_id,product_id,variant_id,item_name,sku_snapshot,quantity,unit_price_minor,line_total_minor,tax_minor")
              .eq("business_id", activeBusiness.id).in("sale_id", saleIds).order("created_at"),
            supabase.from("sale_payments").select("id,sale_id,amount_minor,payment_method,created_by,paid_at,notes")
              .eq("business_id", activeBusiness.id).in("sale_id", saleIds).order("paid_at", { ascending: true }),
            supabase.rpc("get_business_member_names", { p_business_id: activeBusiness.id })
          ]);
          if (itemsResult.error) throw itemsResult.error;
          if (paymentsResult.error) throw paymentsResult.error;
          if (membersResult.error) throw membersResult.error;
          memberNamesById = new Map((membersResult.data || []).map((member) => [member.user_id, member.display_name]));

          for (const item of itemsResult.data || []) {
            if (!itemsBySale[item.sale_id]) itemsBySale[item.sale_id] = [];
            itemsBySale[item.sale_id].push(item);
          }
          for (const paymentRow of paymentsResult.data || []) {
            if (!paymentsBySale[paymentRow.sale_id]) paymentsBySale[paymentRow.sale_id] = [];
            paymentsBySale[paymentRow.sale_id].push(paymentRow);
          }
        }
        setCustomers(customersResult.data || []);
        setSalesData(salesRows.map((sale) => ({ ...sale,
          customer_name: customersById[sale.customer_id]?.full_name || customersById[sale.customer_id]?.company_name || (sale.customer_id ? "Cliente registrado" : "Venta sin cliente"),
          seller_name: memberNamesById.get(sale.created_by) || "Usuario del negocio",
          items: itemsBySale[sale.id] || [],
          payments: paymentsBySale[sale.id] || []
        })));
      }
    } catch (e) {
      setError(friendlyError(e));
      if (screen === "customers") { setCustomers([]); setCustomersCount(0); }
      else { setSalesData([]); setSalesCount(0); setSaleProducts([]); }
    } finally { setSalesLoading(false); }
  }

  useEffect(() => {
    if ((screen === "sales" || screen === "customers") && activeBusiness?.id) loadSalesModuleData();
  }, [screen, activeBusiness?.id, customerSearch, salesPage, salesPageSize, customersPage, customersPageSize, salesPeriod, salesDateFrom, salesDateTo, salesSelectedDate]);

  async function loadAuditEntries(reset = true) {
    if (!activeBusiness?.id || screen !== "audit") return;
    setAuditLoading(true); setError("");
    const offset = reset ? 0 : auditOffset;
    try {
      const today = todayInBogota();
      const shift = (key, amount) => { const date = new Date(key + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0,10); };
      const weekStart = shift(today, -((new Date(today + "T12:00:00Z").getUTCDay() + 6) % 7));
      const from = auditPeriod === "day" ? today : auditPeriod === "week" ? weekStart : auditPeriod === "month" ? today.slice(0,7) + "-01" : auditPeriod === "year" ? today.slice(0,4) + "-01-01" : auditPeriod === "custom" ? (auditDateFrom || today) : null;
      const to = auditPeriod === "all" ? null : auditPeriod === "custom" ? (auditDateTo || today) : today;
      const { data, error: auditError } = await supabase.rpc("get_business_audit_entries", { p_business_id: activeBusiness.id, p_from: from, p_to: to, p_limit: 200, p_offset: offset });
      if (auditError) throw auditError;
      const rows = data || [];
      setAuditRows((current) => reset ? rows : [...current, ...rows]);
      setAuditOffset(offset + rows.length);
      setAuditHasMore(rows.length === 200);
    } catch (e) { setError(friendlyError(e)); if (reset) setAuditRows([]); }
    finally { setAuditLoading(false); }
  }
  useEffect(() => { if (screen === "audit" && activeBusiness?.id) { setAuditOffset(0); loadAuditEntries(true); } }, [screen, activeBusiness?.id, auditPeriod, auditDateFrom, auditDateTo]);

  async function loadPurchasesModuleData() {
    if (!activeBusiness?.id || (screen !== "purchases" && screen !== "suppliers")) return;
    setPurchaseLoading(true); setError("");
    try {
      const privileged = ["owner", "admin"].includes(activeBusiness.role);
      const permissions = activeBusiness.permissions || {};
      const suppliersOnly = screen === "suppliers";
      const mayReadPurchases = !suppliersOnly && (privileged || Boolean(permissions.purchases_view));
      const mayReadExpenses = !suppliersOnly && (privileged || Boolean(permissions.expenses_view));
      const mayReadSuppliers = privileged || Boolean(permissions.suppliers_view) || Boolean(permissions.purchases_view);
      const mayManagePurchases = !suppliersOnly && (privileged || Boolean(permissions.purchases_manage));
      const none = Promise.resolve({ data: [], error: null });
      const periodToday = todayInBogota();
      const shiftPeriodDate = (key, amount) => { const date = new Date(key + "T12:00:00Z"); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0,10); };
      const weekStart = shiftPeriodDate(periodToday, -((new Date(periodToday + "T12:00:00Z").getUTCDay() + 6) % 7));
      const periodFrom = purchasePeriod === "day" ? periodToday : purchasePeriod === "week" ? weekStart : purchasePeriod === "month" ? periodToday.slice(0,7) + "-01" : purchasePeriod === "year" ? periodToday.slice(0,4) + "-01-01" : purchasePeriod === "custom" ? (purchaseDateFrom || periodToday) : null;
      const periodTo = purchasePeriod === "all" ? null : purchasePeriod === "custom" ? (purchaseDateTo || periodToday) : periodToday;
      let purchaseQuery = supabase.from("purchases").select("id,business_id,supplier_id,purchase_number,status,currency_code,subtotal_minor,tax_minor,total_minor,amount_paid_minor,notes,purchased_at,created_at", { count: "exact" }).eq("business_id", activeBusiness.id);
      let expenseQuery = supabase.from("expenses").select("id,business_id,category,description,amount_minor,currency_code,expense_date,payment_method,supplier_id,notes,created_at", { count: "exact" }).eq("business_id", activeBusiness.id);
      if (periodFrom) { purchaseQuery = purchaseQuery.gte("purchased_at", periodFrom + "T00:00:00-05:00"); expenseQuery = expenseQuery.gte("expense_date", periodFrom); }
      if (periodTo) { purchaseQuery = purchaseQuery.lt("purchased_at", shiftPeriodDate(periodTo, 1) + "T00:00:00-05:00"); expenseQuery = expenseQuery.lte("expense_date", periodTo); }
      const [purchaseResult, expenseResult, supplierResult, productResult] = await Promise.all([
        mayReadPurchases ? purchaseQuery.order("purchased_at", { ascending: false })
          .range((purchasesPage - 1) * purchasesPageSize, (purchasesPage - 1) * purchasesPageSize + purchasesPageSize - 1) : none,
        mayReadExpenses ? expenseQuery.order("expense_date", { ascending: false })
          .range((expensesPage - 1) * expensesPageSize, (expensesPage - 1) * expensesPageSize + expensesPageSize - 1) : none,
        mayReadSuppliers ? supabase.from("suppliers").select("id,business_id,name,email,phone,tax_id,address,notes")
          .eq("business_id", activeBusiness.id).order("name").limit(500) : none,
        mayManagePurchases ? supabase.from("products").select("id,name,sku,cost_price_minor,unit_name,stock_on_hand,track_inventory,archived_at")
          .eq("business_id", activeBusiness.id).is("archived_at", null).order("name").limit(1000) : none
      ]);
      if (purchaseResult.error) throw purchaseResult.error;
      if (expenseResult.error) throw expenseResult.error;
      if (supplierResult.error) throw supplierResult.error;
      if (productResult.error) throw productResult.error;
      const purchaseList = purchaseResult.data || [];
      const itemMap = {};
      const paymentMap = {};
      if (purchaseList.length) {
        const purchaseIds = purchaseList.map((purchase) => purchase.id);
        const [itemsResult, paymentsResult] = await Promise.all([
          supabase.from("purchase_items")
            .select("id,purchase_id,product_id,item_name,quantity,unit_cost_minor,line_total_minor")
            .eq("business_id", activeBusiness.id).in("purchase_id", purchaseIds).order("created_at"),
          supabase.from("purchase_payments")
            .select("id,purchase_id,amount_minor,payment_method,paid_at,notes")
            .eq("business_id", activeBusiness.id).in("purchase_id", purchaseIds).order("paid_at", { ascending: true })
        ]);
        if (itemsResult.error) throw itemsResult.error;
        if (paymentsResult.error) throw paymentsResult.error;
        for (const item of itemsResult.data || []) {
          if (!itemMap[item.purchase_id]) itemMap[item.purchase_id] = [];
          itemMap[item.purchase_id].push(item);
        }
        for (const payment of paymentsResult.data || []) {
          if (!paymentMap[payment.purchase_id]) paymentMap[payment.purchase_id] = [];
          paymentMap[payment.purchase_id].push(payment);
        }
      }
      setPurchaseRows(purchaseList.map((purchase) => ({ ...purchase, payments: paymentMap[purchase.id] || [] })));
      setPurchasesCount(purchaseResult.count || 0);
      setPurchaseItemsByPurchase(itemMap);
      setExpenseRows(expenseResult.data || []);
      setExpensesCount(expenseResult.count || 0);
      setSuppliers(supplierResult.data || []);
      setPurchaseProducts(productResult.data || []);
    } catch (e) {
      setError(friendlyError(e));
      setPurchaseRows([]); setPurchasesCount(0); setPurchaseItemsByPurchase({});
      setExpenseRows([]); setExpensesCount(0); setSuppliers([]); setPurchaseProducts([]);
    } finally { setPurchaseLoading(false); }
  }

  useEffect(() => {
    if ((screen === "purchases" || screen === "suppliers") && activeBusiness?.id) loadPurchasesModuleData();
  }, [screen, activeBusiness?.id, purchaseModuleTab, purchasesPage, purchasesPageSize, expensesPage, expensesPageSize, purchasePeriod, purchaseDateFrom, purchaseDateTo]);

  async function loadCatalogAdminData() {
    if (!activeBusiness?.id || screen !== "catalog") return;
    setCatalogLoading(true); setError("");
    try {
      const [productsResult, categoriesResult] = await Promise.all([
        supabase.from("products").select("id,business_id,name,sku,category_id,description,commercial_presentation,unit_name,sale_price_minor,is_published,is_sellable,image_paths,archived_at")
          .eq("business_id", activeBusiness.id).is("archived_at", null).order("name").limit(1000),
        supabase.from("product_categories").select("id,name").eq("business_id", activeBusiness.id).order("name")
      ]);
      if (productsResult.error) throw productsResult.error;
      if (categoriesResult.error) throw categoriesResult.error;
      setCatalogProducts(productsResult.data || []);
      setCatalogCategories(categoriesResult.data || []);
    } catch (e) {
      setError(friendlyError(e)); setCatalogProducts([]); setCatalogCategories([]);
    } finally { setCatalogLoading(false); }
  }

  useEffect(() => {
    if (screen === "catalog" && activeBusiness?.id) loadCatalogAdminData();
  }, [screen, activeBusiness?.id]);

  async function loadStatsData() {
    if (!activeBusiness?.id || screen !== "stats") return;
    setStatsLoading(true);
    setError("");
    try {
      const [sales, payments, expenses, purchases, purchasePayments] = await Promise.all([
        fetchAllProfitabilityRows(
          () => supabase.from("sales")
            .select("id,business_id,customer_id,sale_number,status,total_minor,amount_paid_minor,sold_at,created_at")
            .eq("business_id", activeBusiness.id)
            .order("sold_at", { ascending: false }).order("id", { ascending: true }),
          "ventas para las estadísticas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("sale_payments")
            .select("id,business_id,sale_id,amount_minor,payment_method,created_by,paid_at")
            .eq("business_id", activeBusiness.id)
            .order("paid_at", { ascending: false }).order("id", { ascending: true }),
          "abonos para las estadísticas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("expenses")
            .select("id,business_id,amount_minor,expense_date,description,category")
            .eq("business_id", activeBusiness.id)
            .order("expense_date", { ascending: false }).order("id", { ascending: true }),
          "gastos para las estadísticas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("purchases")
            .select("id,business_id,supplier_id,purchase_number,status,total_minor,amount_paid_minor,purchased_at,created_at")
            .eq("business_id", activeBusiness.id)
            .order("purchased_at", { ascending: false }).order("id", { ascending: true }),
          "compras para las estadísticas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("purchase_payments")
            .select("id,business_id,purchase_id,amount_minor,paid_at")
            .eq("business_id", activeBusiness.id)
            .order("paid_at", { ascending: false }).order("id", { ascending: true }),
          "pagos de compras para las estadísticas"
        )
      ]);
      const saleIds = sales.map((sale) => sale.id);
      const [saleItems, customers, suppliers] = await Promise.all([
        saleIds.length ? fetchAllProfitabilityRows(
          () => supabase.from("sale_items").select("id,business_id,sale_id,product_id,item_name,quantity,unit_price_minor,line_total_minor")
            .eq("business_id", activeBusiness.id).in("sale_id", saleIds).order("sale_id").order("id"),
          "artículos vendidos para estadísticas"
        ) : Promise.resolve([]),
        canAccessScreen("customers") ? fetchAllProfitabilityRows(
          () => supabase.from("customers").select("id,business_id,full_name,company_name")
            .eq("business_id", activeBusiness.id).order("full_name"),
          "clientes para estadísticas"
        ) : Promise.resolve([]),
        canAccessScreen("suppliers") ? fetchAllProfitabilityRows(
          () => supabase.from("suppliers").select("id,business_id,name")
            .eq("business_id", activeBusiness.id).order("name"),
          "proveedores para estadísticas"
        ) : Promise.resolve([])
      ]);
      setStatsSales(sales);
      setStatsPayments(payments);
      setStatsSaleItems(saleItems);
      setStatsCustomers(customers);
      setStatsSuppliers(suppliers);
      setStatsExpenses(expenses);
      setStatsPurchases(purchases);
      setStatsPurchasePayments(purchasePayments);
    } catch (e) {
      setError(friendlyError(e));
      setStatsSales([]);
      setStatsPayments([]);
      setStatsSaleItems([]);
      setStatsCustomers([]);
      setStatsSuppliers([]);
      setStatsExpenses([]);
      setStatsPurchases([]);
      setStatsPurchasePayments([]);
    } finally { setStatsLoading(false); }
  }

  useEffect(() => {
    if (screen === "stats" && activeBusiness?.id) loadStatsData();
  }, [screen, activeBusiness?.id]);

  async function loadQuotesModuleData() {
    if (!activeBusiness?.id || screen !== "quotes") return;
    setQuotesLoading(true);
    setError("");
    try {
      let query = supabase.from("quotes")
        .select("id,business_id,quote_number,customer_id,customer_name,customer_email,customer_phone,status,currency_code,subtotal_minor,total_minor,valid_until,notes,created_at,updated_at", { count: "exact" })
        .eq("business_id", activeBusiness.id)
        .order("created_at", { ascending: false });
      if (quotesStatusFilter !== "all") query = query.eq("status", quotesStatusFilter);
      const safeTerm = quotesSearch.trim().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").slice(0, 100);
      if (safeTerm) query = query.or("quote_number.ilike.%" + safeTerm + "%,customer_name.ilike.%" + safeTerm + "%");
      const from = (quotesPage - 1) * quotesPageSize;
      const [quotesResult, productResult, customerResult] = await Promise.all([
        query.range(from, from + quotesPageSize - 1),
        canPermission("products_view")
          ? supabase.from("products").select("id,name,sku,sale_price_minor,unit_name")
            .eq("business_id", activeBusiness.id).eq("is_sellable", true).is("archived_at", null).order("name").limit(1000)
          : Promise.resolve({ data: [], error: null }),
        canPermission("customers_view")
          ? supabase.from("customers").select("id,full_name,company_name,email,phone,whatsapp")
            .eq("business_id", activeBusiness.id).order("full_name").limit(1000)
          : Promise.resolve({ data: [], error: null })
      ]);
      if (quotesResult.error) throw quotesResult.error;
      if (productResult.error) throw productResult.error;
      if (customerResult.error) throw customerResult.error;
      const quoteRows = quotesResult.data || [];
      const quoteIds = quoteRows.map((quote) => quote.id);
      let items = [];
      if (quoteIds.length) {
        const itemsResult = await supabase.from("quote_items")
          .select("id,business_id,quote_id,item_name,quantity,unit_price_minor,line_total_minor,created_at")
          .eq("business_id", activeBusiness.id).in("quote_id", quoteIds).order("created_at");
        if (itemsResult.error) throw itemsResult.error;
        items = itemsResult.data || [];
      }
      const itemsByQuote = {};
      for (const item of items) {
        if (!itemsByQuote[item.quote_id]) itemsByQuote[item.quote_id] = [];
        itemsByQuote[item.quote_id].push(item);
      }
      setQuotesRows(quoteRows.map((quote) => ({ ...quote, items: itemsByQuote[quote.id] || [] })));
      setQuotesCount(quotesResult.count || 0);
      setQuoteProducts(productResult.data || []);
      setQuoteCustomers(customerResult.data || []);
    } catch (e) {
      setError(friendlyError(e));
      setQuotesRows([]);
      setQuotesCount(0);
      setQuoteProducts([]);
      setQuoteCustomers([]);
    } finally { setQuotesLoading(false); }
  }

  useEffect(() => {
    if (screen === "quotes" && activeBusiness?.id) loadQuotesModuleData();
  }, [screen, activeBusiness?.id, quotesPage, quotesPageSize, quotesSearch, quotesStatusFilter]);

  useEffect(() => {
    if (quotesPage > Math.max(1, Math.ceil(quotesCount / quotesPageSize))) {
      setQuotesPage(Math.max(1, Math.ceil(quotesCount / quotesPageSize)));
    }
  }, [quotesPage, quotesCount, quotesPageSize]);

  async function toggleCatalogPublication(product) {
    if (!activeBusiness?.id) return;
    const publish = !product.is_published;
    if (publish && !product.is_sellable) {
      setError("Activa el producto antes de publicarlo en el catálogo.");
      return;
    }
    setCatalogPublishingId(product.id); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await supabase.from("products")
        .update({ is_published: publish })
        .eq("business_id", activeBusiness.id).eq("id", product.id)
        .select("id,is_published").maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("No se pudo cambiar la publicación. Comprueba tus permisos.");
      setCatalogProducts((current) => current.map((item) => item.id === product.id ? { ...item, is_published: data.is_published } : item));
      setNotice(data.is_published ? product.name + " ya aparece en tu catálogo." : product.name + " dejó de aparecer en el catálogo.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setCatalogPublishingId(null); }
  }

  async function copyPublicCatalogLink() {
    if (!activeBusiness?.id) return;
    let catalogLink = window.location.origin + "/?catalog=" + encodeURIComponent(activeBusiness.id);
    const profile = activeBusiness.settings?.commercial_profile || {};
    const slug = String(activeBusiness?.slug || "").trim().toLowerCase();
    if (slug.length >= 2 && slug.length <= 60 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && !reservedPublicPaths.has(slug)) {
      try {
        const { data, error: resolveError } = await supabase.rpc("resolve_public_catalog_slug", { p_slug: slug });
        if (!resolveError && data === activeBusiness.id) catalogLink = window.location.origin + "/" + slug;
      } catch {
        // The stable UUID link remains the safe fallback if slug resolution is unavailable.
      }
    }
    try {
      await navigator.clipboard.writeText(catalogLink);
      setNotice(catalogLink.includes("?catalog=") ? "Copiamos el enlace completo del catálogo porque el nombre no tiene una ruta exclusiva." : "Enlace corto del catálogo copiado. Ya puedes compartirlo.");
    } catch {
      window.prompt("Copia este enlace para compartir tu catálogo:", catalogLink);
    }
  }

  async function loadTeamModuleData() {
    if (!activeBusiness?.id || screen !== "team" || !["owner", "admin"].includes(activeBusiness.role)) return;
    setTeamLoading(true); setError("");
    try {
      const { data, error: teamError } = await supabase.rpc("list_business_team", { p_business_id: activeBusiness.id });
      if (teamError) throw teamError;
      setTeamRows(data || []);
    } catch (e) {
      setError(friendlyError(e)); setTeamRows([]);
    } finally { setTeamLoading(false); }
  }

  useEffect(() => {
    if (screen === "team" && activeBusiness?.id) loadTeamModuleData();
  }, [screen, activeBusiness?.id, activeBusiness?.role]);

  function clearTeamForm() {
    setTeamFormOpen(false);
    setTeamEmail("");
    setTeamPhone("");
    setTeamHourlyRate("");
    setTeamWorkDays([]);
    setTeamWorkStart("09:00");
    setTeamWorkEnd("17:00");
    setTeamWorkNotes("");
    setTeamPermissionDraft(blankTeamPermissions);
    setTeamPermissionProfile("vendedor");
    setTeamEditingUserId(null);
    setTeamEditingRole(null);
  }

  useEffect(() => {
    if (!teamFormOpen) return;
    const frame = window.requestAnimationFrame(() => teamFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    return () => window.cancelAnimationFrame(frame);
  }, [teamFormOpen, teamEditingUserId]);

  function startEditTeamMember(member) {
    const role = member.role;
    if (["owner", "admin"].includes(role) && !(role === "owner" && member.user_id === session?.user?.id)) return;
    const requested = (member.permissions || {})._modules_requested || member.permissions || {};
    const draft = { ...blankTeamPermissions };
    for (const group of teamPermissionGroups) {
      draft[group.view] = Boolean(requested[group.view]);
      draft[group.manage] = Boolean(requested[group.manage]);
    }
    setTeamEmail(member.email || "");
    setTeamPhone(member.phone || "");
    const employment = (member.permissions || {})._employment || {};
    const workSchedule = employment.work_schedule || {};
    setTeamHourlyRate(employment.hourly_rate_minor == null ? "" : String(employment.hourly_rate_minor));
    setTeamWorkDays(Array.isArray(workSchedule.days) ? workSchedule.days : []);
    setTeamWorkStart(workSchedule.start || "09:00");
    setTeamWorkEnd(workSchedule.end || "17:00");
    setTeamWorkNotes(workSchedule.notes || "");
    setTeamPermissionDraft(draft);
    setTeamPermissionProfile("personalizado");
    setTeamEditingUserId(member.user_id);
    setTeamEditingRole(role);
    setTeamFormOpen(true);
    setError(""); setNotice("");
  }

  function changeTeamPermission(key, checked) {
    setTeamPermissionDraft((current) => {
      const next = { ...current, [key]: checked };
      const moduleGroup = teamPermissionGroups.find((group) => group.view === key || group.manage === key);
      if (moduleGroup) {
        if (key === moduleGroup.manage && checked) next[moduleGroup.view] = true;
        if (key === moduleGroup.view && !checked) next[moduleGroup.manage] = false;
      }
      return next;
    });
  }

  async function saveTeamMember(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    const editingOwnOwnerPhone = teamEditingRole === "owner" && teamEditingUserId === session?.user?.id;
    if (!editingOwnOwnerPhone && !teamEmail.trim()) { setError("Escribe el correo de la persona."); return; }
    if (!editingOwnOwnerPhone && teamHourlyRate.trim() !== "" && (!Number.isSafeInteger(Number(teamHourlyRate)) || Number(teamHourlyRate) < 0)) { setError("El valor de la hora debe ser un número entero igual o superior a cero."); return; }
    if (teamPhone.trim() && (teamPhone.trim().length < 5 || teamPhone.trim().length > 40)) { setError("Revisa el número de celular."); return; }
    if (!editingOwnOwnerPhone && teamWorkEnd <= teamWorkStart) { setError("La hora de salida debe ser posterior a la hora de entrada."); return; }
    setTeamSaving(true); setError(""); setNotice("");
    try {
      let targetUserId = teamEditingUserId;
      if (!editingOwnOwnerPhone) {
        const { data, error: saveError } = await supabase.rpc("upsert_business_employee", { p_business_id: activeBusiness.id, p_email: teamEmail.trim(), p_permissions: teamPermissionDraft });
        if (saveError) throw saveError;
        targetUserId = data;
      }
      const { error: detailsError } = await supabase.rpc("update_business_employee_details", { p_business_id: activeBusiness.id, p_user_id: targetUserId, p_phone: teamPhone.trim() || null, p_hourly_rate_minor: editingOwnOwnerPhone ? null : (teamHourlyRate.trim() === "" ? null : Number(teamHourlyRate)), p_work_schedule: editingOwnOwnerPhone ? null : { days: teamWorkDays, start: teamWorkStart, end: teamWorkEnd, notes: teamWorkNotes.trim() } });
      if (detailsError) throw detailsError;
      setNotice(editingOwnOwnerPhone ? "Tu celular se actualizó correctamente." : teamEditingUserId ? "Datos laborales y permisos actualizados." : "Colaborador agregado con sus datos laborales.");
      clearTeamForm();
      await loadTeamModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setTeamSaving(false); }
  }

  async function removeTeamMember(member) {
    if (!activeBusiness?.id || member.role !== "employee") return;
    if (!window.confirm("¿Quitar a " + (member.display_name || member.email) + " del equipo? Ya no podrá abrir este negocio.")) return;
    setTeamSaving(true); setError(""); setNotice("");
    try {
      const { data, error: removeError } = await supabase.rpc("remove_business_employee", {
        p_business_id: activeBusiness.id, p_user_id: member.user_id
      });
      if (removeError) throw removeError;
      if (!data) throw new Error("No se encontró ese colaborador en el equipo.");
      setTeamRows((current) => current.filter((row) => row.user_id !== member.user_id));
      setNotice("Acceso retirado.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setTeamSaving(false); }
  }

  async function fetchAllProfitabilityRows(makeQuery, description, maxRows = 50000) {
    const pageSize = 500;
    const allRows = [];
    for (let offset = 0; offset <= maxRows; offset += pageSize) {
      const { data, error: queryError } = await makeQuery().range(offset, Math.min(offset + pageSize - 1, maxRows));
      if (queryError) throw queryError;
      const batch = data || [];
      allRows.push(...batch);
      if (batch.length < pageSize) return allRows;
      if (allRows.length >= maxRows) {
        const { data: extraRows, error: extraError } = await makeQuery().range(maxRows, maxRows);
        if (extraError) throw extraError;
        if ((extraRows || []).length) {
          throw new Error("El informe supera " + maxRows.toLocaleString("es-CO") + " registros de " + description + ". No mostraremos un total parcial; filtra un periodo más corto o divide la revisión.");
        }
        return allRows;
      }
    }
    throw new Error("No fue posible completar la lectura de " + description + ".");
  }

  async function loadProfitabilityData() {
    if (!activeBusiness?.id || screen !== "profitability") return;
    setProfitabilityLoading(true); setError("");
    try {
      const [sales, expenses, purchasePayments] = await Promise.all([
        fetchAllProfitabilityRows(
          () => supabase.from("sales").select("id,business_id,status,currency_code,total_minor,amount_paid_minor,sold_at,created_at")
            .eq("business_id", activeBusiness.id).order("sold_at", { ascending: false }).order("id", { ascending: true }),
          "ventas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("expenses").select("id,business_id,category,description,amount_minor,currency_code,expense_date")
            .eq("business_id", activeBusiness.id).order("expense_date", { ascending: false }).order("id", { ascending: true }),
          "gastos"
        ),
        canAccessScreen("purchases") ? fetchAllProfitabilityRows(
          () => supabase.from("purchase_payments").select("id,business_id,purchase_id,amount_minor,payment_method,paid_at")
            .eq("business_id", activeBusiness.id).order("paid_at", { ascending: false }).order("id", { ascending: true }),
          "pagos de compras"
        ) : Promise.resolve([])
      ]);
      let items = [];
      if (sales.length) {
        const batchSize = 100;
        for (let index = 0; index < sales.length; index += batchSize) {
          const ids = sales.slice(index, index + batchSize).map((sale) => sale.id);
          const rows = await fetchAllProfitabilityRows(
            () => supabase.from("sale_items")
              .select("id,sale_id,product_id,item_name,quantity,unit_cost_minor,line_total_minor")
              .eq("business_id", activeBusiness.id).in("sale_id", ids).order("created_at").order("id", { ascending: true }),
            "líneas de venta"
          );
          items.push(...rows);
        }
      }
      setProfitabilitySales(sales);
      setProfitabilitySaleItems(items);
      setProfitabilityExpenses(expenses);
      setProfitabilityPurchasePayments(purchasePayments);
    } catch (e) {
      setError(friendlyError(e));
      setProfitabilitySales([]); setProfitabilitySaleItems([]); setProfitabilityExpenses([]); setProfitabilityPurchasePayments([]);
    } finally { setProfitabilityLoading(false); }
  }

  useEffect(() => {
    if (screen === "profitability" && activeBusiness?.id) loadProfitabilityData();
  }, [screen, activeBusiness?.id]);

  useEffect(() => {
    const saved = activeBusiness?.settings?.profit_allocations || {};
    setAllocationSettings({
      diezmo: { enabled: Boolean(saved.diezmo?.enabled), percent: Number(saved.diezmo?.percent || 0) },
      ahorro: { enabled: Boolean(saved.ahorro?.enabled), percent: Number(saved.ahorro?.percent || 0) },
      otra: { enabled: Boolean(saved.otra?.enabled), name: String(saved.otra?.name || "Otra asignación"), percent: Number(saved.otra?.percent || 0) }
    });
  }, [activeBusiness?.id]);

  async function saveAllocationSettings() {
    if (!activeBusiness?.id || !isBusinessOwner) return;
    const activePercentTotal = Object.values(allocationSettings).filter((item) => item.enabled).reduce((sum, item) => sum + Math.max(0, Number(item.percent || 0)), 0);
    if (activePercentTotal > 100) { setError("Los porcentajes activos no pueden sumar más de 100%."); return; }
    const nextSettings = { ...(activeBusiness.settings || {}), profit_allocations: allocationSettings };
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: saveError } = await supabase.from("businesses").update({ settings: nextSettings }).eq("id", activeBusiness.id).select("id,settings").maybeSingle();
      if (saveError) throw saveError;
      if (!data) throw new Error("No se pudieron guardar los porcentajes. Comprueba tus permisos.");
      setActiveBusiness((current) => current ? { ...current, settings: data.settings || nextSettings } : current);
      setBusinesses((current) => current.map((business) => business.id === data.id ? { ...business, settings: data.settings || nextSettings } : business));
      setNotice("Porcentajes guardados. Solo se usan como distribución orientativa, no como gasto contable.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  function addQuoteItem() {
    const product = quoteProducts.find((item) => item.id === quoteProductChoice);
    const name = String(product?.name || quoteItemName).trim();
    const quantity = Number(quoteQuantity);
    const unitPrice = Number(quoteUnitPrice);
    if (!name) { setError("Escribe el nombre del artículo de la cotización."); return; }
    if (!Number.isFinite(quantity) || quantity <= 0) { setError("La cantidad debe ser mayor que cero."); return; }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) { setError("Escribe un precio unitario válido."); return; }
    const unitPriceMinor = toMinorUnits(unitPrice, currencyCode);
    setQuoteItems((current) => [...current, {
      id: crypto.randomUUID(),
      name,
      quantity,
      unit_price_minor: unitPriceMinor,
      line_total_minor: Math.round(unitPriceMinor * quantity)
    }]);
    setQuoteItemName("");
    setQuoteProductChoice("");
    setQuoteQuantity("1");
    setQuoteUnitPrice("");
    setError("");
  }

  function clearQuoteDraft() {
    setShowQuoteForm(false);
    setEditingQuoteId(null);
    setEditingQuoteOriginalItems([]);
    setQuoteCustomerId("");
    setQuoteCustomerName("");
    setQuoteCustomerEmail("");
    setQuoteCustomerPhone("");
    setQuoteNotes("");
    setQuoteProductChoice("");
    setQuoteItemName("");
    setQuoteQuantity("1");
    setQuoteUnitPrice("");
    setQuoteItems([]);
    const date = new Date(todayInBogota() + "T12:00:00-05:00");
    date.setDate(date.getDate() + 15);
    setQuoteValidUntil(new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(date));
  }

  function editQuote(quote) {
    if (!quote || !canManageSales) return;
    setEditingQuoteId(quote.id);
    setEditingQuoteOriginalItems((quote.items || []).map((item) => item.id));
    setQuoteCustomerId(quote.customer_id || "");
    setQuoteCustomerName(quote.customer_name || "");
    setQuoteCustomerEmail(quote.customer_email || "");
    setQuoteCustomerPhone(quote.customer_phone || "");
    setQuoteValidUntil(quote.valid_until || "");
    setQuoteNotes(quote.notes || "");
    setQuoteProductChoice("");
    setQuoteItemName("");
    setQuoteQuantity("1");
    setQuoteUnitPrice("");
    setQuoteItems((quote.items || []).map((item) => ({
      id: item.id || crypto.randomUUID(),
      name: item.item_name || item.name || "",
      quantity: Number(item.quantity || 0),
      unit_price_minor: Number(item.unit_price_minor || 0),
      line_total_minor: Number(item.line_total_minor ?? Math.round(Number(item.unit_price_minor || 0) * Number(item.quantity || 0)))
    })));
    setShowQuoteForm(true);
    setError("");
    setNotice("Ajusta los artículos, las cantidades o los precios. Al guardar, la propuesta quedará como borrador para revisarla con el cliente.");
  }

  async function addQuickQuoteCustomer() {
    if (!activeBusiness?.id || !canManageCustomers || quickQuoteCustomerSaving) return;
    const name = quickQuoteCustomerName.trim();
    if (!name) { setError("Escribe el nombre del cliente."); return; }
    setQuickQuoteCustomerSaving(true); setError(""); setNotice("");
    try {
      const { data, error: insertError } = await supabase.from("customers").insert({
        business_id: activeBusiness.id, full_name: name, first_name: name,
        company_name: quickQuoteCustomerCompany.trim() || null,
        email: quickQuoteCustomerEmail.trim() || null, phone: quickQuoteCustomerPhone.trim() || null,
        whatsapp: quickQuoteCustomerWhatsapp.trim() || null,
        document_type: quickQuoteCustomerDocumentType || null,
        document_number: quickQuoteCustomerDocumentNumber.trim() || null,
        city: quickQuoteCustomerCity.trim() || null,
        address: quickQuoteCustomerAddress.trim() || null
      }).select("id,full_name,company_name,email,phone,whatsapp,document_type,document_number,city,address").single();
      if (insertError) throw insertError;
      setCustomers((current) => [data, ...current.filter((item) => item.id !== data.id)]);
      setQuoteCustomers((current) => [data, ...current.filter((item) => item.id !== data.id)]);
      setQuoteCustomerId(data.id);
      setQuoteCustomerName(data.company_name || data.full_name || name);
      setQuoteCustomerEmail(data.email || "");
      setQuoteCustomerPhone(data.phone || data.whatsapp || "");
      setQuickQuoteCustomerName(""); setQuickQuoteCustomerPhone(""); setQuickQuoteCustomerEmail(""); setQuickQuoteCustomerCompany(""); setQuickQuoteCustomerWhatsapp(""); setQuickQuoteCustomerDocumentType(""); setQuickQuoteCustomerDocumentNumber(""); setQuickQuoteCustomerCity(""); setQuickQuoteCustomerAddress("");
      setShowQuickQuoteCustomerForm(false);
      setNotice("Cliente creado y seleccionado para esta cotización.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setQuickQuoteCustomerSaving(false); }
  }

  async function createQuote(event) {
    event.preventDefault();
    if (!activeBusiness?.id || !canManageSales || quoteSaving) return;
    if (!quoteCustomerName.trim()) { setError("Escribe el nombre del cliente o de la empresa."); return; }
    if (!quoteItems.length) { setError("Agrega al menos un artículo a la cotización."); return; }
    if (quoteItems.some((item) => !String(item.name || "").trim() || !Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0 || !Number.isFinite(Number(item.unit_price_minor)) || Number(item.unit_price_minor) < 0)) {
      setError("Revisa los artículos, las cantidades y los precios antes de guardar.");
      return;
    }
    setQuoteSaving(true);
    setError("");
    setNotice("");
    try {
      const subtotal = quoteItems.reduce((sum, item) => sum + Math.round(Number(item.unit_price_minor || 0) * Number(item.quantity || 0)), 0);
      if (editingQuoteId) {
        const { data: updatedQuote, error: quoteError } = await supabase.from("quotes").update({
          customer_id: quoteCustomerId || null,
          customer_name: quoteCustomerName.trim(),
          customer_email: quoteCustomerEmail.trim() || null,
          customer_phone: quoteCustomerPhone.trim() || null,
          status: "draft",
          currency_code: currencyCode,
          subtotal_minor: subtotal,
          discount_minor: 0,
          tax_minor: 0,
          total_minor: subtotal,
          valid_until: quoteValidUntil || null,
          notes: quoteNotes.trim() || null,
          updated_at: new Date().toISOString()
        }).eq("id", editingQuoteId).eq("business_id", activeBusiness.id).select("id,quote_number").maybeSingle();
        if (quoteError) throw quoteError;
        if (!updatedQuote) throw new Error("No se pudo actualizar la cotización. Comprueba tus permisos e inténtalo de nuevo.");

        const oldIds = new Set(editingQuoteOriginalItems);
        const currentIds = new Set(quoteItems.map((item) => item.id));
        const existingItems = quoteItems.filter((item) => oldIds.has(item.id));
        for (const item of existingItems) {
          const { data, error: itemError } = await supabase.from("quote_items").update({
            item_name: String(item.name).trim(),
            quantity: Number(item.quantity),
            unit_price_minor: Number(item.unit_price_minor),
            line_total_minor: Math.round(Number(item.unit_price_minor) * Number(item.quantity))
          }).eq("id", item.id).eq("quote_id", editingQuoteId).eq("business_id", activeBusiness.id).select("id").maybeSingle();
          if (itemError) throw itemError;
          if (!data) throw new Error("No se pudo actualizar uno de los artículos de la cotización. Revisa el registro antes de volver a intentarlo.");
        }
        const addedItems = quoteItems.filter((item) => !oldIds.has(item.id)).map((item) => ({
          business_id: activeBusiness.id,
          quote_id: editingQuoteId,
          item_name: String(item.name).trim(),
          quantity: Number(item.quantity),
          unit_price_minor: Number(item.unit_price_minor),
          line_total_minor: Math.round(Number(item.unit_price_minor) * Number(item.quantity))
        }));
        if (addedItems.length) {
          const { error: insertItemsError } = await supabase.from("quote_items").insert(addedItems);
          if (insertItemsError) throw insertItemsError;
        }
        const removedIds = editingQuoteOriginalItems.filter((id) => !currentIds.has(id));
        if (removedIds.length) {
          const { error: deleteItemsError } = await supabase.from("quote_items").delete().eq("business_id", activeBusiness.id).eq("quote_id", editingQuoteId).in("id", removedIds);
          if (deleteItemsError) throw deleteItemsError;
        }
        setNotice("Cotización " + updatedQuote.quote_number + " actualizada. Ya puedes compartir la propuesta revisada con tu cliente.");
      } else {
        const quoteNumber = "COT-" + todayInBogota().replace(/-/g, "") + "-" + crypto.randomUUID().slice(0, 6).toUpperCase();
        const { data: quote, error: quoteError } = await supabase.from("quotes").insert({
          business_id: activeBusiness.id,
          quote_number: quoteNumber,
          customer_id: quoteCustomerId || null,
          customer_name: quoteCustomerName.trim(),
          customer_email: quoteCustomerEmail.trim() || null,
          customer_phone: quoteCustomerPhone.trim() || null,
          status: "draft",
          currency_code: currencyCode,
          subtotal_minor: subtotal,
          discount_minor: 0,
          tax_minor: 0,
          total_minor: subtotal,
          valid_until: quoteValidUntil || null,
          notes: quoteNotes.trim() || null,
          created_by: session?.user?.id || null
        }).select("id").single();
        if (quoteError) throw quoteError;
        const itemRows = quoteItems.map((item) => ({
          business_id: activeBusiness.id,
          quote_id: quote.id,
          item_name: String(item.name).trim(),
          quantity: Number(item.quantity),
          unit_price_minor: Number(item.unit_price_minor),
          line_total_minor: Math.round(Number(item.unit_price_minor) * Number(item.quantity))
        }));
        const { error: itemsError } = await supabase.from("quote_items").insert(itemRows);
        if (itemsError) {
          const cleanup = await supabase.from("quotes").delete().eq("id", quote.id).eq("business_id", activeBusiness.id);
          if (cleanup.error) throw new Error("La cotización quedó creada, pero no se guardaron sus artículos. Abre Cotizaciones y comprueba el registro antes de volver a intentarlo.");
          throw itemsError;
        }
        setNotice("Cotización " + quoteNumber + " guardada.");
      }
      clearQuoteDraft();
      setQuotesPage(1);
      await loadQuotesModuleData();
    } catch (e) {
      setError(friendlyError(e));
    } finally { setQuoteSaving(false); }
  }

  function closeQuoteImagePreview() {
    if (quoteImagePreview?.url) URL.revokeObjectURL(quoteImagePreview.url);
    setQuoteImagePreview(null);
  }

  function downloadQuoteImagePreview(showNotice = true) {
    if (!quoteImagePreview?.blob) return;
    const url = quoteImagePreview.url || URL.createObjectURL(quoteImagePreview.blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = quoteImagePreview.fileName || "cotizacion-carta.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    if (showNotice) setNotice("Imagen descargada. Puedes adjuntarla al mensaje que vayas a enviar.");
  }

  async function confirmShareQuoteImage() {
    if (!quoteImagePreview?.blob) return;
    const file = new File([quoteImagePreview.blob], quoteImagePreview.fileName || "cotizacion-carta.png", { type: "image/png" });
    if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
      downloadQuoteImagePreview(false);
      const documentLabel = quoteImagePreview.documentType === "sale" ? "factura" : "cotización";
      const shareUrl = "https://wa.me/?text=" + encodeURIComponent("Te comparto la " + documentLabel + " " + quoteImagePreview.quoteNumber + " de " + quoteImagePreview.brand + ". Adjunta la imagen descargada para enviarla completa.");
      const shareWindow = window.open(shareUrl, "_blank", "noopener,noreferrer");
      setNotice(shareWindow
        ? "La imagen se descargó y WhatsApp está listo. Adjunta la imagen descargada antes de enviar."
        : "La imagen se descargó. Adjunta el archivo a tu mensaje para enviarlo.");
      return;
    }
    try {
      const documentLabel = quoteImagePreview.documentType === "sale" ? "Factura" : "Cotización";
      await navigator.share({ files: [file], title: documentLabel + " " + quoteImagePreview.quoteNumber, text: documentLabel + " de " + quoteImagePreview.brand });
      closeQuoteImagePreview();
      setNotice("Se abrió la opción de compartir la cotización.");
    } catch (error) {
      if (error?.name !== "AbortError") setError("No se pudo abrir la opción de compartir. Puedes descargar la imagen desde esta vista previa.");
    }
  }

  function printQuoteDocument(quote) {
    if (!quote) return;
    const profile = activeBusiness?.settings?.commercial_profile || {};
    const brand = profile.tradeName || activeBusiness?.name || "Mi empresa";
    const logoUrl = getBusinessLogoUrl(activeBusiness?.logo_path);
    const documentTheme = normalizeBusinessTheme(activeBusiness?.theme);
    const brandColor = documentTheme.primary;
    const documentCurrency = quote.currency_code || currencyCode;
    const items = (quote.items || []).map((item) => "<tr><td>" + escapeHtml(item.item_name) + "</td><td class=\"num\">" + escapeHtml(Number(item.quantity).toLocaleString("es-CO")) + "</td><td class=\"num\">" + escapeHtml(money(item.unit_price_minor, documentCurrency)) + "</td><td class=\"num\">" + escapeHtml(money(item.line_total_minor, documentCurrency)) + "</td></tr>").join("");
    const companyLines = [profile.documentNumber ? "NIT / documento: " + profile.documentNumber : "", profile.email, profile.phone, [profile.address, profile.city].filter(Boolean).join(", "), profile.website].filter(Boolean);
    const subtotal = Number(quote.subtotal_minor || (quote.items || []).reduce((sum,item)=>sum+Number(item.line_total_minor||0),0));
    const discount = Number(quote.discount_minor || 0);
    const tax = Number(quote.tax_minor || 0);
    const total = Number(quote.total_minor || Math.max(0, subtotal - discount + tax));
    const summaryRows = "<div><span>Subtotal</span><strong>" + escapeHtml(money(subtotal, documentCurrency)) + "</strong></div>"
      + (discount > 0 ? "<div><span>Descuento</span><strong>− " + escapeHtml(money(discount, documentCurrency)) + "</strong></div>" : "")
      + (tax > 0 ? "<div><span>Impuestos</span><strong>" + escapeHtml(money(tax, documentCurrency)) + "</strong></div>" : "")
      + "<div class=\"balance\"><span>Total de la cotización</span><strong>" + escapeHtml(money(total, documentCurrency)) + "</strong></div>";
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(quote.quote_number)} - ${escapeHtml(brand)}</title><style>
       @page{size:8.5in 11in;margin:0.55in}
       *{box-sizing:border-box}
       body{font:14px/1.55 Arial,sans-serif;color:#202820;margin:38px auto;max-width:900px;padding:0 28px;background:#fff}
       header{display:flex;align-items:center;gap:18px;border-bottom:2px solid ${brandColor};padding-bottom:18px}
       header img{width:123px;height:123px;max-width:none;max-height:none;aspect-ratio:1/1;flex:0 0 123px;object-fit:contain}
       h1{font-size:24px;margin:0 0 4px;color:${brandColor}}
       h2{margin:25px 0 8px;font-size:22px}
       h3{margin:24px 0 8px;font-size:16px}
       p{margin:4px 0;overflow-wrap:anywhere}
       small{color:#69758A}
       .document-number{display:block;font-weight:700;color:${brandColor};margin-top:4px}
       .meta{display:flex;justify-content:space-between;gap:18px;margin:24px 0}
       .meta>div{min-width:0}
       table{width:100%;border-collapse:collapse;margin-top:20px;page-break-inside:auto}
       thead{display:table-header-group}
       tr{break-inside:avoid;page-break-inside:avoid}
       th,td{text-align:left;border-bottom:1px solid #E1E7F0;padding:10px 8px;vertical-align:top}
       th{background:#f2f5ef}
       .num{text-align:right;white-space:nowrap}
       .summary{margin:20px 0 0 auto;max-width:320px}
       .summary>div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid #E1E7F0}
       .summary .balance{font-weight:700;color:${brandColor};align-items:flex-start;gap:12px}.summary .balance span{flex:1;min-width:0;overflow-wrap:anywhere}.summary .balance strong{flex:0 0 auto;font-size:18px;line-height:1.25;white-space:nowrap;text-align:right}
       .notes{margin-top:24px;padding:14px;background:#f6f7f3;border:1px solid #E1E7F0;white-space:pre-wrap;break-inside:avoid;page-break-inside:avoid}
       .footer{margin-top:42px;border-top:1px solid #E1E7F0;padding-top:12px;color:#69758A;font-size:12px}
       @media print{html,body{width:auto;max-width:none;margin:0;padding:0;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}header,.meta,.summary,.notes{break-inside:avoid;page-break-inside:avoid}a{color:inherit;text-decoration:none}}
       @media screen{body{margin:24px auto;padding:0 24px}}
     </style></head><body><header>${logoUrl ? "<img src=\"" + escapeHtml(logoUrl) + "\" alt=\"Logo\">" : ""}<div><h1>${escapeHtml(brand)}</h1>${companyLines.map((line) => "<p>" + escapeHtml(line) + "</p>").join("")}</div></header>
      <h2>Cotización comercial</h2><div class="document-number">${escapeHtml(quote.quote_number || "")}</div><p>Fecha de emisión: ${new Date(quote.created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"long"})}</p>
      <div class="meta"><div><strong>Cliente</strong><p>${escapeHtml(quote.customer_name || "Cliente sin nombre")}</p>${quote.customer_email ? "<p>" + escapeHtml(quote.customer_email) + "</p>" : ""}${quote.customer_phone ? "<p>" + escapeHtml(quote.customer_phone) + "</p>" : ""}</div><div><strong>Condiciones</strong><p>Válida hasta: ${quote.valid_until ? new Date(quote.valid_until + "T12:00:00-05:00").toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"long"}) : "Sin fecha límite"}</p><p>Estado: ${escapeHtml(quoteStatusLabel(quote.status))}</p></div></div>
      <table><thead><tr><th>Artículo / servicio</th><th class="num">Cantidad</th><th class="num">Precio unitario</th><th class="num">Total</th></tr></thead><tbody>${items}</tbody></table>
      <div class="summary">${summaryRows}</div>
      ${quote.notes ? "<div class=\"notes\"><strong>Notas y condiciones</strong><p>" + escapeHtml(quote.notes) + "</p></div>" : ""}<div class="footer">Cotización comercial generada desde treseiscinco · ${escapeHtml(brand)}. Este documento es una propuesta comercial, no una factura ni comprobante de pago.</div>
      <script>window.addEventListener("load",function(){setTimeout(function(){window.focus();window.print()},350)})<\\/script></body></html>`;
    const win = window.open(window.location.href, "_blank", "width=900,height=900");
    if (!win) { setError("Permite las ventanas emergentes para abrir la cotización e imprimirla o guardarla como PDF."); return; }
    try { win.opener = null; } catch { /* La impresión no depende de window.opener. */ }
    win.document.open(); win.document.write(html); win.document.close();
  }

  async function shareQuoteImage(quote) {
    if (!quote) return;
    const profile = activeBusiness?.settings?.commercial_profile || {};
    const brand = profile.tradeName || activeBusiness?.name || "Mi empresa";
    const logoUrl = getBusinessLogoUrl(activeBusiness?.logo_path);
    const documentTheme = normalizeBusinessTheme(activeBusiness?.theme);
    const brandColor = documentTheme.primary;
    const items = quote.items || [];
    const rowHeight = (item) => Math.max(64, Math.min(112, Math.ceil(String(item.item_name || "").length / 46) * 24 + 34));
    const rowsHeight = items.reduce((sum, item) => sum + rowHeight(item), 0);
    const noteLines = quote.notes ? Math.max(1, Math.ceil(String(quote.notes).length / 100)) : 0;
    const width = 1275; // 8.5 in at 150 dpi
    const height = Math.max(1650, 1180 + rowsHeight + (noteLines ? noteLines * 26 + 55 : 0)); // 11 in minimum
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setError("No se pudo preparar la cotización. Usa PDF / Imprimir para guardarla."); return; }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#DCE6F3";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.fillStyle = brandColor;
    ctx.fillRect(31, 31, width - 62, 14);

    let headerY = 105;
    if (logoUrl) {
      try {
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = logoUrl;
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
        ctx.drawImage(image, 72, 64, 162, 162);
      } catch { /* El resto del documento se conserva si el logo no se puede incrustar. */ }
    }
    ctx.fillStyle = brandColor;
    ctx.textAlign = "left";
    ctx.font = "bold 34px Arial";
    ctx.fillText(brand, 255, headerY);
    ctx.fillStyle = "#19243A";
    ctx.font = "20px Arial";
    const companyLines = [
      profile.documentNumber ? "NIT / documento: " + profile.documentNumber : "",
      profile.email, profile.phone,
      [profile.address, profile.city].filter(Boolean).join(", "),
      profile.website
    ].filter(Boolean);
    companyLines.slice(0, 5).forEach((line, index) => ctx.fillText(String(line).slice(0, 86), 255, headerY + 34 + index * 27));

    ctx.strokeStyle = "#DCE6F3";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(72, 286);
    ctx.lineTo(width - 72, 286);
    ctx.stroke();

    ctx.fillStyle = "#202820";
    ctx.font = "bold 30px Arial";
    ctx.fillText("COTIZACIÓN COMERCIAL", 72, 355);
    ctx.fillStyle = brandColor;
    ctx.font = "bold 22px Arial";
    ctx.fillText(String(quote.quote_number || ""), 72, 397);
    ctx.fillStyle = "#19243A";
    ctx.font = "18px Arial";
    const issuedAt = quote.created_at
      ? new Date(quote.created_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "long" })
      : "Sin fecha";
    ctx.fillText("Fecha de emisión: " + issuedAt, 72, 434);

    ctx.font = "bold 18px Arial";
    ctx.fillText("CLIENTE", 72, 490);
    ctx.fillText("CONDICIONES", 690, 490);
    ctx.font = "18px Arial";
    ctx.fillText(String(quote.customer_name || "Cliente sin nombre").slice(0, 68), 72, 521);
    if (quote.customer_email) ctx.fillText(String(quote.customer_email).slice(0, 64), 72, 550);
    if (quote.customer_phone) ctx.fillText(String(quote.customer_phone).slice(0, 64), 72, 579);
    const validDate = quote.valid_until
      ? new Date(quote.valid_until + "T12:00:00-05:00").toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "long" })
      : "Sin fecha límite";
    ctx.fillText("Válida hasta: " + validDate, 690, 521);
    ctx.fillText("Estado: " + quoteStatusLabel(quote.status), 690, 550);

    let y = 620;
    ctx.fillStyle = documentTheme.background;
    ctx.fillRect(72, y, width - 144, 50);
    ctx.fillStyle = "#314236";
    ctx.font = "bold 17px Arial";
    ctx.textAlign = "left";
    ctx.fillText("ARTÍCULO / SERVICIO", 88, y + 31);
    ctx.textAlign = "center";
    ctx.fillText("CANT.", 735, y + 31);
    ctx.textAlign = "right";
    ctx.fillText("PRECIO UNITARIO", 985, y + 31);
    ctx.fillText("TOTAL", width - 88, y + 31);
    ctx.textAlign = "left";
    y += 50;

    const drawWrappedText = (text, x, baseline, maxWidth, lineHeight, maxLines) => {
      ctx.font = "18px Arial";
      const words = String(text || "").split(/\s+/).filter(Boolean);
      const wrapped = [];
      let current = "";
      for (const word of words) {
        const candidate = current ? current + " " + word : word;
        if (current && ctx.measureText(candidate).width > maxWidth) {
          wrapped.push(current);
          current = word;
        } else current = candidate;
      }
      if (current) wrapped.push(current);
      const visible = wrapped.slice(0, Math.max(1, maxLines));
      if (wrapped.length > visible.length && visible.length) visible[visible.length - 1] = visible[visible.length - 1].replace(/[.…]*$/, "") + "…";
      visible.forEach((line, index) => ctx.fillText(line, x, baseline + index * lineHeight));
      return visible.length;
    };

    for (const item of items) {
      const heightForRow = rowHeight(item);
      const lines = Math.max(1, Math.floor((heightForRow - 18) / 24));
      ctx.fillStyle = "#202820";
      drawWrappedText(item.item_name, 88, y + 27, 545, 24, lines);
      ctx.font = "18px Arial";
      ctx.textAlign = "center";
      ctx.fillText(Number(item.quantity).toLocaleString("es-CO"), 735, y + Math.round(heightForRow / 2) + 5);
      ctx.textAlign = "right";
      ctx.fillText(money(item.unit_price_minor, quote.currency_code || currencyCode), 985, y + Math.round(heightForRow / 2) + 5);
      ctx.fillText(money(item.line_total_minor, quote.currency_code || currencyCode), width - 88, y + Math.round(heightForRow / 2) + 5);
      ctx.textAlign = "left";
      y += heightForRow;
      ctx.strokeStyle = "#E1E7F0";
      ctx.beginPath();
      ctx.moveTo(72, y);
      ctx.lineTo(width - 72, y);
      ctx.stroke();
    }

    y += 28;
    const documentCurrency = quote.currency_code || currencyCode;
    const subtotal = Number(quote.subtotal_minor ?? items.reduce((sum, item) => sum + Number(item.line_total_minor || 0), 0));
    const discount = Number(quote.discount_minor || 0);
    const tax = Number(quote.tax_minor || 0);
    const total = Number(quote.total_minor ?? Math.max(0, subtotal - discount + tax));
    const drawSummaryRow = (label, value, emph = false) => {
      ctx.font = emph ? "bold 16px Arial" : "19px Arial";
      ctx.fillStyle = emph ? brandColor : "#202820";
      ctx.textAlign = "left";
      ctx.fillText(label, width - 505, y);
      ctx.textAlign = "right";
      ctx.font = emph ? "bold 24px Arial" : "19px Arial";
      ctx.fillText(money(value, documentCurrency), width - 88, y);
      ctx.textAlign = "left";
      ctx.strokeStyle = emph ? brandColor : "#E1E7F0";
      ctx.lineWidth = emph ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(width - 505, y + 12);
      ctx.lineTo(width - 72, y + 12);
      ctx.stroke();
      y += emph ? 58 : 42;
    };
    drawSummaryRow("Subtotal", subtotal);
    if (discount > 0) drawSummaryRow("Descuento", -discount);
    if (tax > 0) drawSummaryRow("Impuestos", tax);
    drawSummaryRow("TOTAL DE LA COTIZACIÓN", total, true);

    if (quote.notes) {
      y += 12;
      ctx.fillStyle = "#F6F7F3";
      const noteHeight = Math.max(76, noteLines * 26 + 48);
      ctx.fillRect(72, y, width - 144, noteHeight);
      ctx.strokeStyle = "#DCE6F3";
      ctx.strokeRect(72, y, width - 144, noteHeight);
      ctx.fillStyle = "#202820";
      ctx.font = "bold 18px Arial";
      ctx.fillText("NOTAS Y CONDICIONES", 90, y + 29);
      drawWrappedText(quote.notes, 90, y + 57, width - 210, 26, Math.max(1, noteLines));
      y += noteHeight;
    }

    ctx.strokeStyle = "#DCE6F3";
    ctx.beginPath();
    ctx.moveTo(72, height - 100);
    ctx.lineTo(width - 72, height - 100);
    ctx.stroke();
    ctx.fillStyle = "#69758A";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Cotización comercial generada desde treseiscinco. Es una propuesta, no una factura ni comprobante de pago.", 72, height - 70);

    try {
      const blob = await new Promise((resolve, reject) => {
        try { canvas.toBlob((value) => value ? resolve(value) : reject(new Error("No se pudo crear la imagen.")), "image/png"); }
        catch (error) { reject(error); }
      });
      const filename = String(quote.quote_number || "cotizacion").replace(/[^a-z0-9_-]/gi, "-") + "-carta.png";
      const url = URL.createObjectURL(blob);
      if (quoteImagePreview?.url) URL.revokeObjectURL(quoteImagePreview.url);
      setQuoteImagePreview({ blob, url, fileName: filename, quoteNumber: quote.quote_number || "Cotización", brand, documentType: "quote" });
      setNotice("Vista previa preparada. Revisa el documento antes de compartirlo.");
    } catch {
      setError("No se pudo generar la imagen. Usa PDF / Imprimir para guardar la cotización.");
    }
  }

  function printSaleDocument(sale) {
    if (!sale) return;
    const profile = activeBusiness?.settings?.commercial_profile || {};
    const brand = profile.tradeName || activeBusiness?.name || "Mi empresa";
    const logoUrl = getBusinessLogoUrl(activeBusiness?.logo_path);
    const documentTheme = normalizeBusinessTheme(activeBusiness?.theme);
    const brandColor = documentTheme.primary;
    const companyLines = [profile.documentNumber ? "NIT / documento: " + profile.documentNumber : "", profile.email, profile.phone, [profile.address, profile.city].filter(Boolean).join(", "), profile.website].filter(Boolean);
    const items = (sale.items || []).map((item) => "<tr><td>" + escapeHtml(item.item_name) + "</td><td class=\"num\">" + escapeHtml(Number(item.quantity).toLocaleString("es-CO")) + "</td><td class=\"num\">" + escapeHtml(money(item.unit_price_minor, sale.currency_code || currencyCode)) + "</td><td class=\"num\">" + escapeHtml(money(item.line_total_minor, sale.currency_code || currencyCode)) + "</td></tr>").join("");
    const paymentRows = (sale.payments || []).map((payment) => "<tr><td>" + escapeHtml(new Date(payment.paid_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" })) + "</td><td>" + escapeHtml(payment.payment_method || "Pago") + "</td><td class=\"num\">" + escapeHtml(money(payment.amount_minor, sale.currency_code || currencyCode)) + "</td></tr>").join("");
    const total = Number(sale.total_minor || 0), paid = Number(sale.amount_paid_minor || 0), outstanding = Math.max(0,total-paid);
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Venta ${escapeHtml(sale.sale_number)} - ${escapeHtml(brand)}</title><style>
      body{font:14px/1.55 Arial,sans-serif;color:#202820;margin:38px auto;max-width:900px;padding:0 28px}header{display:flex;align-items:center;gap:18px;border-bottom:2px solid ${brandColor};padding-bottom:18px}header img{width:123px;height:123px;max-width:none;max-height:none;aspect-ratio:1/1;flex:0 0 123px;object-fit:contain}h1{font-size:24px;margin:0 0 4px;color:${brandColor}}h2{margin:25px 0 8px;font-size:22px}p{margin:4px 0}small{color:#69758A}.meta{display:flex;justify-content:space-between;gap:18px;margin:24px 0}.meta>div{min-width:0}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{text-align:left;border-bottom:1px solid #E1E7F0;padding:10px 8px}th{background:#f2f5ef}.num{text-align:right;white-space:nowrap}.total{text-align:right;font-size:20px;font-weight:700;margin-top:22px}.summary{margin:20px 0 0 auto;max-width:320px}.summary>div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid #E1E7F0}.summary .balance{font-weight:700;color:${brandColor}}.footer{margin-top:42px;border-top:1px solid #E1E7F0;padding-top:12px;color:#69758A;font-size:12px}@page{size:8.5in 11in;margin:0.55in}@media print{html,body{width:auto;max-width:none;margin:0 auto;padding:0 12px;background:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body><header>${logoUrl ? "<img src=\"" + escapeHtml(logoUrl) + "\" alt=\"Logo\">" : ""}<div><h1>${escapeHtml(brand)}</h1>${companyLines.map((line) => "<p>" + escapeHtml(line) + "</p>").join("")}</div></header>
      <h2>Factura / comprobante de venta</h2><strong>${escapeHtml(sale.sale_number || "")}</strong><p>Fecha: ${new Date(sale.sold_at || sale.created_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "long" })}</p>
      <div class="meta"><div><strong>Cliente</strong><p>${escapeHtml(sale.customer_name || "Venta sin cliente")}</p></div><div><strong>Estado</strong><p>${escapeHtml(saleStatusLabel(sale.status))}</p></div></div>
      <table><thead><tr><th>Artículo / servicio</th><th class="num">Cantidad</th><th class="num">Precio unitario</th><th class="num">Total</th></tr></thead><tbody>${items}</tbody></table>
      <div class="summary"><div><span>Total</span><strong>${escapeHtml(money(total, sale.currency_code || currencyCode))}</strong></div><div><span>Pagado</span><strong>${escapeHtml(money(paid, sale.currency_code || currencyCode))}</strong></div><div class="balance"><span>Saldo pendiente</span><strong>${escapeHtml(money(outstanding, sale.currency_code || currencyCode))}</strong></div></div>
      ${paymentRows ? "<h3>Historial de pagos</h3><table><thead><tr><th>Fecha</th><th>Medio de pago</th><th class=\"num\">Importe</th></tr></thead><tbody>" + paymentRows + "</tbody></table>" : ""}
      ${sale.notes ? "<p style=\"margin-top:24px\"><strong>Notas:</strong> " + escapeHtml(sale.notes) + "</p>" : ""}<div class="footer">Documento comercial generado desde treseiscinco · ${escapeHtml(brand)}</div>
      <script>window.addEventListener("load",function(){setTimeout(function(){window.focus();window.print()},350)})<\/script></body></html>`;
    const win = window.open(window.location.href, "_blank", "width=900,height=900");
    if (!win) { setError("Permite las ventanas emergentes para abrir el documento e imprimirlo o guardarlo como PDF."); return; }
    try { win.opener = null; } catch { /* La impresión no depende de window.opener. */ }
    win.document.open(); win.document.write(html); win.document.close();
  }

  async function shareSaleImage(sale) {
    if (!sale) return;
    const profile = activeBusiness?.settings?.commercial_profile || {};
    const brand = profile.tradeName || activeBusiness?.name || "Mi empresa";
    const logoUrl = getBusinessLogoUrl(activeBusiness?.logo_path);
    const documentTheme = normalizeBusinessTheme(activeBusiness?.theme);
    const brandColor = documentTheme.primary;
    const rows = sale.items || [];
    const rowHeight = 58;
    const width = 1275; // Carta: 8,5 in a 150 dpi
    const tableStart = 610;
    const contentHeight = tableStart + 50 + Math.max(1, rows.length) * rowHeight + 330;
    const height = Math.max(1650, contentHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) { setError("No se pudo preparar la factura. Puedes usar Factura / PDF / Imprimir."); return; }
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,width,height);
    ctx.strokeStyle="#DCE6F3"; ctx.lineWidth=2; ctx.strokeRect(30,30,width-60,height-60);
    ctx.fillStyle=brandColor; ctx.fillRect(31,31,width-62,14);
    const companyLines = [profile.documentNumber ? "NIT / documento: " + profile.documentNumber : "",profile.email,profile.phone,[profile.address,profile.city].filter(Boolean).join(", "),profile.website].filter(Boolean);
    if (logoUrl) {
      try {
        const image=new Image(); image.crossOrigin="anonymous"; image.src=logoUrl;
        await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;});
        ctx.drawImage(image,72,64,162,162);
      } catch { /* El documento se genera aunque el logo no se pueda cargar. */ }
    }
    ctx.textAlign="left"; ctx.fillStyle=brandColor; ctx.font="bold 34px Arial";
    ctx.fillText(brand,255,105); ctx.fillStyle="#19243A"; ctx.font="20px Arial";
    companyLines.slice(0,5).forEach((line,index)=>ctx.fillText(String(line).slice(0,82),255,139+index*27));
    ctx.strokeStyle="#DCE6F3"; ctx.beginPath(); ctx.moveTo(72,278); ctx.lineTo(width-72,278); ctx.stroke();
    ctx.fillStyle="#202820"; ctx.font="bold 30px Arial"; ctx.fillText("FACTURA / VENTA",72,345);
    ctx.fillStyle=brandColor; ctx.font="bold 22px Arial"; ctx.fillText(String(sale.sale_number||""),72,386);
    ctx.fillStyle="#19243A"; ctx.font="18px Arial";
    ctx.fillText("Cliente: "+String(sale.customer_name||"Venta sin cliente").slice(0,72),72,426);
    ctx.fillText("Fecha: "+new Date(sale.sold_at||sale.created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"long"}),72,458);
    const currency = sale.currency_code || currencyCode;
    let y=tableStart;
    ctx.fillStyle=documentTheme.background; ctx.fillRect(72,y,width-144,50);
    ctx.fillStyle="#314236"; ctx.font="bold 17px Arial"; ctx.textAlign="left";
    ctx.fillText("ARTÍCULO / SERVICIO",88,y+31);
    ctx.textAlign="center"; ctx.fillText("CANT.",735,y+31);
    ctx.textAlign="right"; ctx.fillText("VALOR",985,y+31); ctx.fillText("TOTAL",width-88,y+31);
    y+=50;
    for(const item of rows){
      ctx.fillStyle="#202820"; ctx.font="18px Arial"; ctx.textAlign="left";
      const name=String(item.item_name||"");
      ctx.fillText(name.length>52?name.slice(0,49)+"…":name,88,y+34);
      ctx.textAlign="center"; ctx.fillText(Number(item.quantity).toLocaleString("es-CO"),735,y+34);
      ctx.textAlign="right"; ctx.fillText(money(item.unit_price_minor,currency),985,y+34); ctx.fillText(money(item.line_total_minor,currency),width-88,y+34);
      y+=rowHeight; ctx.strokeStyle="#E1E7F0"; ctx.beginPath(); ctx.moveTo(72,y); ctx.lineTo(width-72,y); ctx.stroke();
    }
    y+=26;
    const summaryRow=(label,value,emphasis=false)=>{
      ctx.font=emphasis?"bold 16px Arial":"19px Arial";
      ctx.fillStyle=emphasis?brandColor:"#202820"; ctx.textAlign="left";
      ctx.fillText(label,width-500,y);
      ctx.textAlign="right"; ctx.font=emphasis?"bold 24px Arial":"19px Arial";
      ctx.fillText(money(value,currency),width-88,y);
      ctx.strokeStyle=emphasis?brandColor:"#E1E7F0"; ctx.lineWidth=emphasis?2:1;
      ctx.beginPath(); ctx.moveTo(width-500,y+11); ctx.lineTo(width-72,y+11); ctx.stroke();
      y+=emphasis?56:40;
    };
    summaryRow("TOTAL DE LA VENTA",Number(sale.total_minor||0),true);
    summaryRow("Pagado",Number(sale.amount_paid_minor||0));
    summaryRow("Saldo pendiente",Math.max(0,Number(sale.total_minor||0)-Number(sale.amount_paid_minor||0)));
    ctx.strokeStyle="#DCE6F3"; ctx.beginPath(); ctx.moveTo(72,height-100); ctx.lineTo(width-72,height-100); ctx.stroke();
    ctx.fillStyle="#69758A"; ctx.font="14px Arial"; ctx.textAlign="left";
    ctx.fillText("Comprobante de venta generado desde treseiscinco. Conserva la factura original como soporte de la operación.",72,height-70);
    try {
      const blob=await new Promise((resolve,reject)=>{try{canvas.toBlob((value)=>value?resolve(value):reject(new Error("No se pudo crear la imagen.")),"image/png");}catch(e){reject(e);}});
      const filename=String(sale.sale_number||"factura").replace(/[^a-z0-9_-]/gi,"-")+"-carta.png";
      const url=URL.createObjectURL(blob);
      setQuoteImagePreview((current)=>{
        if(current?.url) URL.revokeObjectURL(current.url);
        return {blob,url,fileName:filename,quoteNumber:sale.sale_number||"Factura",brand,documentType:"sale"};
      });
      setNotice("Vista previa preparada. Revisa la factura antes de compartirla.");
    } catch { setError("No se pudo generar la vista previa. Usa Factura / PDF / Imprimir para guardar el documento."); }
  }

  async function updateQuoteStatus(quote, nextStatus) {
    if (!activeBusiness?.id || !canManageSales || quote.status === nextStatus) return;
    setError("");
    setNotice("");
    try {
      const { data, error: updateError } = await supabase.from("quotes")
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq("id", quote.id).eq("business_id", activeBusiness.id)
        .select("id").maybeSingle();
      if (updateError) throw updateError;
      if (!data) throw new Error("No se pudo actualizar esta cotización. Comprueba los permisos de tu cuenta.");
      setNotice("Estado de cotización actualizado.");
      await loadQuotesModuleData();
    } catch (e) { setError(friendlyError(e)); }
  }

  function quoteStatusLabel(status) {
    return ({ draft: "Borrador", sent: "Enviada", accepted: "Aceptada", rejected: "Rechazada", expired: "Vencida", converted: "Convertida en venta", cancelled: "Cancelada" })[status] || status || "—";
  }

  function addPurchaseLine() {
    const product = purchaseProducts.find((item) => item.id === purchaseProductChoice);
    const quantity = Number(purchaseQuantity);
    const unitCost = Number(purchaseUnitCost);
    const name = product?.name || purchaseItemName.trim();
    if (!name) { setError("Escribe el nombre del artículo comprado o elige un producto registrado."); return; }
    if (!Number.isFinite(quantity) || quantity <= 0) { setError("La cantidad debe ser mayor que cero."); return; }
    if (!Number.isFinite(unitCost) || unitCost < 0) { setError("Escribe un costo por unidad válido."); return; }
    setPurchaseCart((current) => {
      const exists = product ? current.find((item) => item.product_id === product.id) : null;
      if (exists) return current.map((item) => item.product_id === product.id
        ? { ...item, quantity: Number((Number(item.quantity) + quantity).toFixed(3)), unit_cost: String(unitCost) }
        : item);
      return [...current, { line_id: crypto.randomUUID(), product_id: product?.id || null, name, quantity, unit_cost: String(unitCost), unit_name: product?.unit_name || "unidad" }];
    });
    setPurchaseProductChoice(""); setPurchaseItemName(""); setPurchaseQuantity("1"); setPurchaseUnitCost(""); setError("");
  }

  async function createPurchase(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    if (!purchaseCart.length) { setError("Añade al menos un artículo a la compra."); return; }
    const subtotal = purchaseCart.reduce((sum, item) => sum + Math.round(toMinorUnits(item.unit_cost, currencyCode) * Number(item.quantity)), 0);
    const tax = toMinorUnits(purchaseTax || 0, currencyCode);
    const payment = toMinorUnits(purchasePayment || 0, currencyCode);
    const total = subtotal + tax;
    if (tax < 0 || payment < 0 || payment > total) { setError("Revisa el impuesto y el abono: no pueden ser negativos y el abono no puede superar el total."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: purchaseError } = await supabase.rpc("create_purchase_with_bank_account", {
        p_business_id: activeBusiness.id,
        p_supplier_id: purchaseSupplierId || null,
        p_notes: purchaseNotes.trim() || null,
        p_purchased_at: new Date(purchaseDate + "T12:00:00-05:00").toISOString(),
        p_tax_minor: tax,
        p_amount_paid_minor: payment,
        p_initial_payment_method: purchaseInitialPaymentMethod,
        p_initial_bank_account_id: purchaseInitialPaymentMethod === "Efectivo" || payment <= 0 ? null : (purchaseInitialBankAccountId || null),
        p_items: purchaseCart.map((item) => ({
          product_id: item.product_id, item_name: item.name, quantity: Number(item.quantity),
          unit_cost_minor: toMinorUnits(item.unit_cost, currencyCode)
        }))
      });
      if (purchaseError) throw purchaseError;
      setShowPurchaseForm(false); setPurchaseSupplierId(""); setPurchaseDate(todayInBogota()); setPurchasesPage(1);
      setPurchaseCart([]); setPurchaseTax("0"); setPurchasePayment("0"); setPurchaseInitialPaymentMethod("Efectivo"); setPurchaseInitialBankAccountId(""); setPurchaseNotes("");
      setNotice("Compra guardada. El ingreso a inventario y su historial se actualizaron juntos.");
      await loadPurchasesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  function openPurchasePaymentForm(purchase) {
    const outstanding = Math.max(0, Number(purchase.total_minor || 0) - Number(purchase.amount_paid_minor || 0));
    setPurchasePaymentFormFor(purchase.id);
    setPurchasePaymentAmount(String(outstanding / (10 ** currencyDigits(currencyCode))));
    setPurchasePaymentMethod("Efectivo"); setPurchasePaymentBankAccountId("");
    setPurchasePaymentDate(todayInBogota());
    setPurchasePaymentNotes("");
    setError(""); setNotice("");
  }

  async function recordPurchasePayment(event, purchase) {
    event.preventDefault();
    if (!activeBusiness?.id || !purchase || !canManagePurchases) return;
    const amount = toMinorUnits(purchasePaymentAmount, currencyCode);
    const outstanding = Math.max(0, Number(purchase.total_minor || 0) - Number(purchase.amount_paid_minor || 0));
    if (!Number.isFinite(amount) || amount <= 0) { setError("El pago debe ser mayor que cero."); return; }
    if (amount > outstanding) { setError("El pago no puede superar el saldo pendiente de la compra."); return; }
    setPurchasePaymentSaving(true); setError(""); setNotice("");
    try {
      const { data, error: paymentError } = await supabase.rpc("record_purchase_payment_with_bank_account", {
        p_business_id: activeBusiness.id,
        p_purchase_id: purchase.id,
        p_amount_minor: amount,
        p_payment_method: purchasePaymentMethod,
        p_paid_at: new Date((purchasePaymentDate || todayInBogota()) + "T12:00:00-05:00").toISOString(),
        p_notes: purchasePaymentNotes.trim() || null,
        p_bank_account_id: purchasePaymentMethod === "Efectivo" ? null : (purchasePaymentBankAccountId || null)
      });
      if (paymentError) throw paymentError;
      setPurchasePaymentFormFor(null);
      setPurchasePaymentAmount(""); setPurchasePaymentMethod("Efectivo"); setPurchasePaymentBankAccountId("");
      setPurchasePaymentDate(todayInBogota()); setPurchasePaymentNotes("");
      const result = Array.isArray(data) ? data[0] : data;
      setNotice("Pago registrado. Saldo por pagar: " + money(result?.balance_minor ?? Math.max(0, outstanding - amount), currencyCode) + ".");
      await loadPurchasesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setPurchasePaymentSaving(false); }
  }

  async function addSupplier(event) {
    event?.preventDefault();
    if (!activeBusiness?.id) return;
    const name = supplierDraft.name.trim();
    if (!name) { setError("Escribe el nombre del proveedor."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { data, error: supplierError } = await supabase.from("suppliers")
        .insert({
          business_id: activeBusiness.id, name,
          email: supplierDraft.email.trim() || null, phone: supplierDraft.phone.trim() || null,
          tax_id: supplierDraft.tax_id.trim() || null, address: supplierDraft.address.trim() || null,
          notes: supplierDraft.notes.trim() || null
        }).select("id,business_id,name,email,phone,tax_id,address,notes").single();
      if (supplierError) throw supplierError;
      setSuppliers((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name, "es")));
      if (showQuickExpenseSupplierForm) setExpenseDraft((current) => ({ ...current, supplier_id: data.id }));
      else setPurchaseSupplierId(data.id);
      setSupplierDraft(blankSupplier); setShowSupplierForm(false); setShowQuickPurchaseSupplierForm(false); setShowQuickExpenseSupplierForm(false);
      setNotice("Proveedor guardado y seleccionado para la compra: " + data.name + ".");
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function addExpense(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    if (!expenseDraft.description.trim()) { setError("Describe el gasto."); return; }
    const amountMinor = toMinorUnits(expenseDraft.amount, currencyCode);
    if (!Number.isFinite(amountMinor) || amountMinor <= 0) { setError("El importe debe ser mayor que cero."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { error: expenseError } = await supabase.from("expenses").insert({
        business_id: activeBusiness.id, category: expenseDraft.category.trim() || "Otro",
        description: expenseDraft.description.trim(), amount_minor: amountMinor, currency_code: currencyCode,
        expense_date: expenseDraft.expense_date || todayInBogota(), payment_method: expenseDraft.payment_method || null,
        bank_account_id: expenseDraft.payment_method === "Efectivo" ? null : (expenseDraft.bank_account_id || null),
        supplier_id: expenseDraft.supplier_id || null, notes: expenseDraft.notes.trim() || null
      });
      if (expenseError) throw expenseError;
      setExpenseDraft({ ...blankExpense, expense_date: todayInBogota() }); setExpensesPage(1);
      setShowExpenseForm(false); setNotice("Gasto guardado.");
      await loadPurchasesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  function purchaseStatusLabel(status) {
    return ({ paid: "Pagada", partially_paid: "Con abono", pending: "Por pagar", draft: "Borrador", canceled: "Anulada", refunded: "Devuelta" })[status] || status || "—";
  }

  function fullCustomerName(draft) {
    const person = [draft.first_name, draft.last_name].map((part) => (part || "").trim()).filter(Boolean).join(" ");
    return person || (draft.company_name || "").trim();
  }

  function resetCustomerForm() {
    setShowCustomerForm(false);
    setEditingCustomerId(null);
    setCustomerDraft(blankCustomer);
    setError("");
  }

  function startEditCustomer(customer) {
    setCustomerDraft({
      first_name: customer.first_name || "",
      last_name: customer.last_name || "",
      company_name: customer.company_name || "",
      advisor_name: customer.advisor_name || "",
      document_type: customer.document_type || "",
      document_number: customer.document_number || "",
      email: customer.email || "",
      phone: customer.phone || "",
      whatsapp: customer.whatsapp || "",
      city: customer.city || "",
      address: customer.address || "",
      notes: customer.notes || ""
    });
    setEditingCustomerId(customer.id);
    setShowCustomerForm(true);
    setError("");
    setNotice("");
  }

  async function addCustomer(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    const displayName = fullCustomerName(customerDraft);
    if (!displayName) { setError("Escribe un nombre o una empresa."); return; }
    setBusy(true); setError(""); setNotice("");
    const payload = {
      business_id: activeBusiness.id,
      full_name: displayName,
      first_name: customerDraft.first_name.trim() || null,
      last_name: customerDraft.last_name.trim() || null,
      company_name: customerDraft.company_name.trim() || null,
      advisor_name: customerDraft.advisor_name.trim() || null,
      document_type: customerDraft.document_type || null,
      document_number: customerDraft.document_number.trim() || null,
      email: customerDraft.email.trim() || null,
      phone: customerDraft.phone.trim() || null,
      whatsapp: customerDraft.whatsapp.trim() || null,
      city: customerDraft.city.trim() || null,
      address: customerDraft.address.trim() || null,
      notes: customerDraft.notes.trim() || null
    };
    try {
      let result;
      if (editingCustomerId) {
        const updatePayload = { ...payload };
        delete updatePayload.business_id;
        result = await supabase.from("customers").update(updatePayload)
          .eq("business_id", activeBusiness.id).eq("id", editingCustomerId)
          .select(customerFields).single();
      } else {
        result = await supabase.from("customers").insert(payload).select(customerFields).single();
      }
      if (result.error) throw result.error;
      setCustomerDraft(blankCustomer);
      setShowCustomerForm(false);
      setNotice(editingCustomerId ? "Cliente actualizado: " + result.data.full_name + "." : "Cliente guardado: " + result.data.full_name + ".");
      setEditingCustomerId(null);
      await loadSalesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setBusy(false); }
  }

  async function addQuickCustomer() {
    if (!activeBusiness?.id || !canManageCustomers) return;
    const name = quickCustomerName.trim();
    if (!name) { setError("Escribe el nombre del cliente."); return; }
    setQuickCustomerSaving(true); setError(""); setNotice("");
    try {
      const { data, error: insertError } = await supabase.from("customers").insert({
        business_id: activeBusiness.id,
        full_name: name,
        first_name: name,
        company_name: quickCustomerCompany.trim() || null,
        email: quickCustomerEmail.trim() || null,
        phone: quickCustomerPhone.trim() || null,
        whatsapp: quickCustomerWhatsapp.trim() || null,
        document_type: quickCustomerDocumentType || null,
        document_number: quickCustomerDocumentNumber.trim() || null,
        city: quickCustomerCity.trim() || null,
        address: quickCustomerAddress.trim() || null
      }).select("id,full_name,company_name,email,phone,whatsapp,document_type,document_number,city,address").single();
      if (insertError) throw insertError;
      setCustomers((current) => [data, ...current.filter((item) => item.id !== data.id)]);
      setSaleCustomerId(data.id);
      setQuickCustomerName(""); setQuickCustomerPhone(""); setQuickCustomerEmail(""); setQuickCustomerCompany(""); setQuickCustomerWhatsapp(""); setQuickCustomerDocumentType(""); setQuickCustomerDocumentNumber(""); setQuickCustomerCity(""); setQuickCustomerAddress("");
      setShowQuickCustomerForm(false);
      setNotice("Cliente creado y seleccionado para esta venta.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setQuickCustomerSaving(false); }
  }

  async function addQuickSaleCategory() {
    if (!activeBusiness?.id || !quickSaleCategoryName.trim() || quickSaleCategorySaving) return;
    setQuickSaleCategorySaving(true); setError(""); setNotice("");
    try {
      const { data, error: createError } = await supabase.from("product_categories")
        .insert({ business_id: activeBusiness.id, name: quickSaleCategoryName.trim() })
        .select("id,name,description,sort_order").single();
      if (createError) throw createError;
      setCategories((current) => [...current.filter((item) => item.id !== data.id), data].sort((a, b) => a.name.localeCompare(b.name, "es")));
      setQuickSaleProductCategoryId(data.id);
      setQuickSaleCategoryName(""); setShowQuickSaleCategoryForm(false);
      setNotice("Categoría creada y seleccionada.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setQuickSaleCategorySaving(false); }
  }

  async function addQuickSaleProduct() {
    if (!activeBusiness?.id || !canManageProducts || quickSaleProductSaving) return;
    const name = quickSaleProductName.trim();
    const salePrice = Number(quickSaleProductPrice);
    const costPrice = Number(quickSaleProductCost);
    const openingStock = quickSaleProductType === "physical" ? Number(quickSaleProductStock) : 0;
    if (!name) { setError("Escribe el nombre del artículo."); return; }
    if (quickSaleProductSkuMode === "manual" && !quickSaleProductSku.trim()) { setError("Escribe el código del artículo o elige la generación automática."); return; }
    if (quickSaleProductPrice === "" || quickSaleProductCost === "" || !Number.isFinite(salePrice) || salePrice < 0 || !Number.isFinite(costPrice) || costPrice < 0) { setError("Escribe un precio y un costo válidos, sin valores negativos."); return; }
    if (quickSaleProductType === "physical" && (!Number.isFinite(openingStock) || openingStock < 0)) { setError("Escribe una cantidad inicial válida."); return; }
    setQuickSaleProductSaving(true); setError(""); setNotice("");
    try {
      const { data: productId, error: createError } = await supabase.rpc("create_product_with_opening_stock", {
        p_business_id: activeBusiness.id, p_name: name, p_category_id: quickSaleProductCategoryId || null, p_sku: quickSaleProductSkuMode === "auto" ? makeInternalProductSku() : quickSaleProductSku.trim(),
        p_description: null, p_product_type: quickSaleProductType, p_unit_name: "unidad",
        p_sale_price_minor: toMinorUnits(salePrice, currencyCode), p_cost_price_minor: toMinorUnits(costPrice, currencyCode),
        p_opening_stock: openingStock, p_low_stock_threshold: null, p_commercial_presentation: null
      });
      if (createError) throw createError;
      const { error: skuMetadataError } = await supabase.from("products").update({ metadata: { sku_mode: quickSaleProductSkuMode, tax_code: "none", has_variants: false }, updated_at: new Date().toISOString() }).eq("business_id", activeBusiness.id).eq("id", productId);
      if (skuMetadataError) throw skuMetadataError;
      const { data: created, error: readError } = await supabase.from("products")
        .select("id,business_id,category_id,sku,slug,name,description,commercial_presentation,product_type,unit_name,sale_price_minor,cost_price_minor,stock_on_hand,low_stock_threshold,track_inventory,is_sellable,is_published,image_paths,archived_at,created_at")
        .eq("business_id", activeBusiness.id).eq("id", productId).single();
      if (readError) throw readError;
      setSaleProducts((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setSaleProductChoice(created.id); setSaleQuantity("1");
      setQuickSaleProductName(""); setQuickSaleProductSkuMode("auto"); setQuickSaleProductSku(""); setQuickSaleProductCategoryId(""); setShowQuickSaleCategoryForm(false); setQuickSaleCategoryName(""); setQuickSaleProductType("physical"); setQuickSaleProductPrice(""); setQuickSaleProductCost(""); setQuickSaleProductStock("1");
      setShowQuickSaleProductForm(false);
      setNotice("Artículo creado y seleccionado para esta venta. Completa los demás datos antes de guardar.");
    } catch (e) { setError(friendlyError(e)); }
    finally { setQuickSaleProductSaving(false); }
  }

  function addSaleLine() {
    if (saleVariantsLoading) { setError("Espera a que carguen las variantes para elegir la combinación correcta."); return; }
    const product = saleProducts.find((item) => item.id === saleProductChoice);
    const quantity = Number(saleQuantity);
    if (!product) { setError("Elige un producto."); return; }
    if (!Number.isFinite(quantity) || quantity <= 0) { setError("La cantidad debe ser mayor que cero."); return; }
    const activeVariants = (variantsByProduct[product.id] || []).filter((variant) => variant.is_active);
    const hasVariants = product.metadata?.has_variants === true || activeVariants.length > 0;
    if (hasVariants && !saleVariantChoice) { setError("Elige la combinación exacta (por ejemplo, camiseta roja, talla S)."); return; }
    const variant = hasVariants ? activeVariants.find((item) => item.id === saleVariantChoice) : null;
    if (hasVariants && !variant) { setError("No encontramos esa combinación activa. Vuelve a elegirla."); return; }
    if (variant && variant.stock_on_hand == null) { setError("Esta combinación no tiene existencias configuradas. Abre Productos → Variantes y registra su stock antes de vender."); return; }
    const stock = variant ? Number(variant.stock_on_hand) : Number(product.stock_on_hand || 0);
    const lineKey = product.id + ":" + (variant?.id || "base");
    const currentQuantity = Number(saleItems.find((item) => item.line_key === lineKey)?.quantity || 0);
    if ((variant || product.track_inventory) && currentQuantity + quantity > stock) {
      setError("No hay suficientes existencias de " + (variant ? variantDisplayLabel(variant) : product.name) + ". Disponibles: " + stock.toLocaleString("es-CO") + ".");
      return;
    }
    const unitPrice = Number(variant?.sale_price_minor ?? product.sale_price_minor ?? 0);
    const lineName = product.name + (variant ? " · " + variantDisplayLabel(variant) : "");
    setSaleItems((current) => {
      const exists = current.find((item) => item.line_key === lineKey);
      if (exists) return current.map((item) => item.line_key === lineKey ? { ...item, quantity: Number((Number(item.quantity) + quantity).toFixed(3)) } : item);
      return [...current, {
        line_key: lineKey, product_id: product.id, variant_id: variant?.id || null,
        name: lineName, quantity, unit_price_minor: unitPrice,
        unit_cost_minor: Number(product.cost_price_minor || 0),
        tax_code: product.metadata?.tax_code || "none",
        unit_name: product.unit_name || "unidad",
        track_inventory: variant ? true : product.track_inventory,
        stock_on_hand: stock,
        sku: variant?.sku || product.sku || null
      }];
    });
    setSaleProductChoice(""); setSaleVariantChoice(""); setSaleQuantity("1"); setError("");
  }

  async function createSale(event) {
    event.preventDefault();
    if (!activeBusiness?.id) return;
    if (!saleItems.length) { setError("Añade al menos un producto a la venta."); return; }
    const includeVat = normalizeTaxProfile(activeBusiness.settings?.tax_profile || settingsTaxProfile).pricesIncludeVat;
    const total = saleItems.reduce((sum, item) => sum + productTaxAmounts(item.unit_price_minor, item.quantity, item.tax_code || "none", includeVat).total, 0);
    const cashTendered = saleInitialPaymentMethod === "Efectivo" && String(saleCashTendered).trim() !== ""
      ? toMinorUnits(saleCashTendered, currencyCode)
      : null;
    const payment = cashTendered !== null ? Math.min(cashTendered, total) : toMinorUnits(salePayment || 0, currencyCode);
    const cashChange = cashTendered !== null ? Math.max(0, cashTendered - total) : 0;
    if (payment < 0 || payment > total) { setError("El abono debe estar entre cero y el total de la venta."); return; }
    if (cashTendered !== null && cashTendered < 0) { setError("El efectivo recibido no puede ser negativo."); return; }
    setSaleSaving(true); setError(""); setNotice("");
    try {
      const { data, error: saleError } = await supabase.rpc("create_sale_with_bank_account", {
        p_business_id: activeBusiness.id, p_customer_id: saleCustomerId || null,
        p_items: saleItems.map((item) => ({ product_id: item.product_id, variant_id: item.variant_id || null, quantity: Number(item.quantity) })),
        p_amount_paid_minor: payment, p_notes: saleNotes.trim() || null,
        p_initial_payment_method: saleInitialPaymentMethod,
        p_sold_at: new Date((saleDate || todayInBogota()) + "T12:00:00-05:00").toISOString(),
        p_advisor_name: saleAdvisorName.trim() || null,
        p_initial_bank_account_id: saleInitialPaymentMethod === "Efectivo" || payment <= 0 ? null : (saleInitialBankAccountId || null)
      });
      if (saleError) throw saleError;
      const sale = Array.isArray(data) ? data[0] : data;
      const wasOnFirstSalesPage = salesPage === 1;
      setSalesPage(1);
      setShowSaleForm(false); setSaleCustomerId(""); setSaleAdvisorName(""); setSaleProductChoice(""); setSaleVariantChoice(""); setSaleQuantity("1");
      setSaleItems([]); setSaleDate(todayInBogota()); setSalePayment(""); setSaleCashTendered(""); setSaleInitialPaymentMethod("Efectivo"); setSaleInitialBankAccountId(""); setSaleNotes("");
      setNotice("Venta " + (sale?.sale_number || "registrada") + " guardada. El inventario se actualizó." + (cashChange > 0 ? " Devuelta: " + money(cashChange, currencyCode) + "." : ""));
      if (wasOnFirstSalesPage) await loadSalesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setSaleSaving(false); }
  }

  async function registerSalePayment(event, sale) {
    event.preventDefault();
    if (!activeBusiness?.id || !sale || !canManageSales) return;
    const amount = toMinorUnits(salePaymentAmount, currencyCode);
    const outstanding = Math.max(0, Number(sale.total_minor || 0) - Number(sale.amount_paid_minor || 0));
    if (!Number.isFinite(amount) || amount <= 0) { setError("El abono debe ser mayor que cero."); return; }
    if (amount > outstanding) { setError("El abono no puede superar el saldo pendiente de la venta."); return; }
    setSalePaymentSaving(true); setError(""); setNotice("");
    try {
      const { data, error: paymentError } = await supabase.rpc("record_sale_payment_with_bank_account", {
        p_business_id: activeBusiness.id,
        p_sale_id: sale.id,
        p_amount_minor: amount,
        p_payment_method: salePaymentMethod,
        p_paid_at: new Date((salePaymentDate || todayInBogota()) + "T12:00:00-05:00").toISOString(),
        p_notes: salePaymentNotes.trim() || null,
        p_bank_account_id: salePaymentMethod === "Efectivo" ? null : (salePaymentBankAccountId || null)
      });
      if (paymentError) throw paymentError;
      setSalePaymentFormFor(null);
      setSalePaymentAmount(""); setSalePaymentMethod("Efectivo"); setSalePaymentBankAccountId("");
      setSalePaymentDate(todayInBogota()); setSalePaymentNotes("");
      const result = Array.isArray(data) ? data[0] : data;
      setNotice("Abono registrado. Saldo pendiente: " + money(result?.balance_minor ?? Math.max(0, outstanding - amount), currencyCode) + ".");
      await loadSalesModuleData();
    } catch (e) { setError(friendlyError(e)); }
    finally { setSalePaymentSaving(false); }
  }

  function openSalePaymentForm(sale) {
    const outstanding = Math.max(0, Number(sale.total_minor || 0) - Number(sale.amount_paid_minor || 0));
    setSalePaymentFormFor(sale.id);
    setExpandedSaleId(sale.id);
    setSalePaymentAmount(String(outstanding / (10 ** currencyDigits(currencyCode))));
    setSalePaymentMethod("Efectivo"); setSalePaymentBankAccountId("");
    setSalePaymentDate(todayInBogota());
    setSalePaymentNotes("");
    setError(""); setNotice("");
  }

  function clearSaleDraft() {
    setShowSaleForm(false); setSaleCustomerId(""); setSaleProductChoice(""); setSaleQuantity("1");
    setSaleItems([]); setSaleDate(todayInBogota()); setSalePayment(""); setSaleCashTendered(""); setSaleInitialPaymentMethod("Efectivo"); setSaleInitialBankAccountId(""); setSaleNotes(""); setError("");
  }

  function saleStatusLabel(status) {
    return ({ paid: "Pagada", partially_paid: "Con abono", pending: "Por cobrar", draft: "Borrador", canceled: "Anulada", refunded: "Devuelta" })[status] || status || "—";
  }

  const filteredProducts = [...products].sort((a, b) => compareInventoryProducts(a, b, productSort));
  useEffect(() => {
    if (!activeBusiness?.id || screen !== "stats") return;
    let alive=true;
    setBalanceTrendLoading(true);
    const dateKey=(date)=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
    const today=todayInBogota();
    const start=new Date(today+"T12:00:00-05:00");start.setDate(start.getDate()-6);
    const startKey=dateKey(start);
    const tomorrow=new Date(today+"T12:00:00-05:00");tomorrow.setDate(tomorrow.getDate()+1);
    const tomorrowKey=dateKey(tomorrow);
    const startAt=startKey+"T00:00:00-05:00",endAt=tomorrowKey+"T00:00:00-05:00";
    Promise.all([
      supabase.from("sale_payments").select("paid_at,amount_minor").eq("business_id",activeBusiness.id).gte("paid_at",startAt).lt("paid_at",endAt),
      supabase.from("expenses").select("expense_date,amount_minor").eq("business_id",activeBusiness.id).gte("expense_date",startKey).lte("expense_date",today),
      supabase.from("purchase_payments").select("paid_at,amount_minor").eq("business_id",activeBusiness.id).gte("paid_at",startAt).lt("paid_at",endAt)
    ]).then(([sales,expenses,purchases])=>{
      if(!alive)return;
      const firstError=sales.error||expenses.error||purchases.error;
      if(firstError)throw firstError;
      setBalanceTrendRows({payments:sales.data||[],expenses:expenses.data||[],purchasePayments:purchases.data||[]});
    }).catch((e)=>{if(alive)setError(friendlyError(e));})
      .finally(()=>{if(alive)setBalanceTrendLoading(false);});
    return ()=>{alive=false;};
  },[activeBusiness?.id,screen]);

  const balanceChartData = useMemo(() => {
    const today = new Date(todayInBogota() + "T12:00:00-05:00");
    const keyFor = (value) => {
      if (!value) return "";
      if (typeof value==="string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value).slice(0,10);
      return new Intl.DateTimeFormat("en-CA",{timeZone:"America/Bogota",year:"numeric",month:"2-digit",day:"2-digit"}).format(date);
    };
    const buckets = new Map();
    for (let offset=6; offset>=0; offset--) {
      const date = new Date(today); date.setDate(date.getDate()-offset);
      const key = keyFor(date);
      buckets.set(key,{key,label:new Intl.DateTimeFormat("es-CO",{timeZone:"America/Bogota",day:"2-digit",month:"short"}).format(date),income:0,outgoing:0,value:0});
    }
    for (const row of balanceTrendRows.payments) { const b=buckets.get(keyFor(row.paid_at)); if (b) b.income+=Number(row.amount_minor||0); }
    for (const row of balanceTrendRows.expenses) { const b=buckets.get(keyFor(row.expense_date)); if (b) b.outgoing+=Number(row.amount_minor||0); }
    for (const row of balanceTrendRows.purchasePayments) { const b=buckets.get(keyFor(row.paid_at)); if (b) b.outgoing+=Number(row.amount_minor||0); }
    return [...buckets.values()].map((b)=>({...b,value:b.income-b.outgoing}));
  },[balanceTrendRows]);
  const visibleBulkProductRows = bulkProductRows.filter((row) => !search.trim() || [row._draftName, row.name, row._draftSku, row.sku, row.description, categories.find((category) => category.id === row.category_id)?.name].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es")));
  const totalProductPages = Math.max(1, Math.ceil(productsCount / productPageSize));
  const normalizedCatalogSearch = catalogSearch.trim().toLocaleLowerCase("es");
  const filteredCatalogProducts = [...catalogProducts].filter((product) => {
    const category = catalogCategories.find((item) => item.id === product.category_id)?.name || "";
    return [product.name, product.description, category].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(normalizedCatalogSearch);
  }).sort((a, b) => catalogSort === "code" ? String(a.sku || "").localeCompare(String(b.sku || ""), "es", { numeric: true, sensitivity: "base" }) || String(a.name || "").localeCompare(String(b.name || ""), "es") : catalogSort === "price" ? Number(a.sale_price_minor || 0) - Number(b.sale_price_minor || 0) || String(a.name || "").localeCompare(String(b.name || ""), "es") : String(a.name || "").localeCompare(String(b.name || ""), "es", { numeric: true, sensitivity: "base" }));
  const catalogTotalPages = Math.max(1, Math.ceil(filteredCatalogProducts.length / catalogPageSize));
  useEffect(() => {
    if (catalogPage > catalogTotalPages) setCatalogPage(catalogTotalPages);
  }, [catalogPage, catalogTotalPages]);

  const catalogPageProducts = filteredCatalogProducts.slice((catalogPage - 1) * catalogPageSize, catalogPage * catalogPageSize);
  const publishedCatalogCount = catalogProducts.filter((product) => product.is_published && product.is_sellable).length;
  const profitPeriodDateKey = (value) => {
    if (!value) return "";
    const date = String(value).includes("T") ? new Date(value) : new Date(String(value) + "T12:00:00-05:00");
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return values.year + "-" + values.month + "-" + values.day;
  };
  const todayBogotaKey = profitPeriodDateKey(new Date().toISOString());
  const currentMonthKey = todayBogotaKey.slice(0, 7);
  const profitInPeriod = (value) => {
    if (profitabilityPeriod === "all") return true;
    const key = profitPeriodDateKey(value);
    if (!key) return false;
    if (profitabilityPeriod === "day") return key === todayBogotaKey;
    if (profitabilityPeriod === "month") return key.slice(0, 7) === currentMonthKey;
    if (profitabilityPeriod === "year") return key.slice(0, 4) === todayBogotaKey.slice(0, 4);
    if (profitabilityPeriod === "custom") return key >= (profitabilityDateFrom || todayBogotaKey) && key <= (profitabilityDateTo || todayBogotaKey);
    const nowDate = new Date(todayBogotaKey + "T12:00:00Z");
    const weekStart = new Date(nowDate); weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
    if (profitabilityPeriod === "week") return key >= weekStart.toISOString().slice(0,10) && key <= todayBogotaKey;
    const day = new Date(key + "T12:00:00-05:00").getTime();
    const now = new Date(todayBogotaKey + "T12:00:00-05:00").getTime();
    return day >= now - 30 * 24 * 60 * 60 * 1000 && day <= now + 24 * 60 * 60 * 1000;
  };
  const periodSales = profitabilitySales.filter((sale) => !["canceled", "refunded"].includes(sale.status) && profitInPeriod(sale.sold_at || sale.created_at));
  const periodSaleIds = new Set(periodSales.map((sale) => sale.id));
  const periodSaleItems = profitabilitySaleItems.filter((item) => periodSaleIds.has(item.sale_id));
  const periodExpenses = profitabilityExpenses.filter((expense) => profitInPeriod(expense.expense_date));
  const periodPurchasePayments = profitabilityPurchasePayments.filter((payment) => profitInPeriod(payment.paid_at));
  const profitabilityTimelineData = useMemo(() => buildProfitabilityTrendData(periodSales, periodSaleItems, periodExpenses, profitabilityPeriod), [periodSales, periodSaleItems, periodExpenses, profitabilityPeriod]);
  const shiftDateKey = (key, offset) => {
    const date = new Date(key + "T12:00:00Z");
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  };
  const weekOffset = (new Date(todayBogotaKey + "T12:00:00Z").getUTCDay() + 6) % 7;
  const yearStart = todayBogotaKey.slice(0, 4) + "-01-01";
  const monthStart = todayBogotaKey.slice(0, 7) + "-01";
  const statsRangeStart = statsPeriod === "day" ? todayBogotaKey
    : statsPeriod === "week" ? shiftDateKey(todayBogotaKey, -weekOffset)
    : statsPeriod === "month" ? monthStart
    : statsPeriod === "year" ? yearStart
    : statsPeriod === "all" ? "0001-01-01"
    : (statsDateFrom || monthStart);
  const statsRangeEnd = statsPeriod === "custom" ? (statsDateTo || todayBogotaKey) : todayBogotaKey;
  const formatStatsDate = (key) => new Date(key + "T12:00:00-05:00").toLocaleDateString("es-CO", { timeZone: "America/Bogota", day: "2-digit", month: "2-digit", year: "numeric" });
  const statsRangeLabel = statsPeriod === "all"
    ? "Todo el historial hasta " + formatStatsDate(todayBogotaKey)
    : statsRangeStart === statsRangeEnd
      ? formatStatsDate(statsRangeStart)
      : "Desde " + formatStatsDate(statsRangeStart) + " hasta " + formatStatsDate(statsRangeEnd);
  const statsInPeriod = (value) => {
    const key = profitPeriodDateKey(value);
    return Boolean(key && key >= statsRangeStart && key <= statsRangeEnd);
  };
  const statsPeriodSales = statsSales.filter((sale) => !["canceled", "refunded", "draft"].includes(sale.status) && statsInPeriod(sale.sold_at || sale.created_at));
  const statsPeriodSaleIds = new Set(statsPeriodSales.map((sale) => sale.id));
  const statsPeriodSaleItems = statsSaleItems.filter((item) => statsPeriodSaleIds.has(item.sale_id));
  const statsPeriodPayments = statsPayments.filter((payment) => statsInPeriod(payment.paid_at));
  const statsPeriodExpenses = statsExpenses.filter((expense) => statsInPeriod(expense.expense_date));
  const statsPeriodPurchases = statsPurchases.filter((purchase) => !["cancelled", "canceled", "draft"].includes(String(purchase.status || "").toLowerCase()) && statsInPeriod(purchase.purchased_at || purchase.created_at));
  const statsPeriodPurchasePayments = statsPurchasePayments.filter((payment) => statsInPeriod(payment.paid_at));
  const statsSalesTotal = statsPeriodSales.reduce((sum, sale) => sum + Number(sale.total_minor || 0), 0);
  const statsCollected = statsPayments.length
    ? statsPeriodPayments.reduce((sum, payment) => sum + Number(payment.amount_minor || 0), 0)
    : statsPeriodSales.reduce((sum, sale) => sum + Number(sale.amount_paid_minor || 0), 0);
  const statsOutstanding = statsPeriodSales.reduce((sum, sale) => sum + Math.max(0, Number(sale.total_minor || 0) - Number(sale.amount_paid_minor || 0)), 0);
  const statsExpensesTotal = statsPeriodExpenses.reduce((sum, expense) => sum + Number(expense.amount_minor || 0), 0);
  const statsPaidPurchases = statsPurchasePayments.length
    ? statsPeriodPurchasePayments.reduce((sum, payment) => sum + Number(payment.amount_minor || 0), 0)
    : statsPeriodPurchases.reduce((sum, purchase) => sum + Number(purchase.amount_paid_minor || 0), 0);
  const statsTopProducts = Object.values(statsPeriodSaleItems.reduce((groups, item) => {
    const key = item.product_id || item.item_name || "unknown";
    if (!groups[key]) groups[key] = { name: item.item_name || "Artículo", quantity: 0, revenue: 0 };
    groups[key].quantity += Number(item.quantity || 0);
    groups[key].revenue += Number(item.line_total_minor || 0);
    return groups;
  }, {})).sort((left, right) => right.quantity - left.quantity || right.revenue - left.revenue).slice(0, 3);
  const statsTopExpenses = Object.values(statsPeriodExpenses.reduce((groups, expense) => {
    const key = String(expense.category || "Otros").trim() || "Otros";
    if (!groups[key]) groups[key] = { name: key, count: 0, amount: 0 };
    groups[key].count += 1; groups[key].amount += Number(expense.amount_minor || 0);
    return groups;
  }, {})).sort((left, right) => right.count - left.count || right.amount - left.amount).slice(0, 3);
  const statsTopPaymentMethods = Object.values(statsPeriodPayments.reduce((groups, payment) => {
    const key = String(payment.payment_method || "No especificado");
    if (!groups[key]) groups[key] = { name: key, count: 0, amount: 0 };
    groups[key].count += 1; groups[key].amount += Number(payment.amount_minor || 0);
    return groups;
  }, {})).sort((left, right) => right.count - left.count || right.amount - left.amount).slice(0, 3);
  const customerNames = new Map(statsCustomers.map((customer) => [customer.id, customer.company_name || customer.full_name || "Cliente"]));
  const statsTopCustomers = Object.values(statsPeriodSales.reduce((groups, sale) => {
    if (!sale.customer_id) return groups;
    const key = sale.customer_id;
    if (!groups[key]) groups[key] = { name: customerNames.get(key) || "Cliente", count: 0, amount: 0 };
    groups[key].count += 1; groups[key].amount += Number(sale.total_minor || 0);
    return groups;
  }, {})).sort((left, right) => right.amount - left.amount || right.count - left.count).slice(0, 3);
  const supplierNames = new Map(statsSuppliers.map((supplier) => [supplier.id, supplier.name || "Proveedor"]));
  const statsTopSuppliers = Object.values(statsPeriodPurchases.reduce((groups, purchase) => {
    if (!purchase.supplier_id) return groups;
    const key = purchase.supplier_id;
    if (!groups[key]) groups[key] = { name: supplierNames.get(key) || "Proveedor", count: 0, amount: 0 };
    groups[key].count += 1; groups[key].amount += Number(purchase.total_minor || 0);
    return groups;
  }, {})).sort((left, right) => right.amount - left.amount || right.count - left.count).slice(0, 3);
  const statsCashBalance = statsCollected - statsExpensesTotal - statsPaidPurchases;

  function downloadStatsExcel() {
    const unit = 10 ** currencyDigits(currencyCode);
    const rows = [
      ["treseiscinco - Estadísticas"],
      ["Negocio", activeBusiness?.name || ""],
      ["Periodo", statsRangeLabel],
      [],
      ["Indicador", "Importe"],
      ["Ingresos", statsCollected / unit],
      ["Gastos", statsExpensesTotal / unit],
      ["Compras pagadas", statsPaidPurchases / unit],
      ["Balance", statsCashBalance / unit],
      ["Ventas registradas", statsSalesTotal / unit],
      ["Pendiente por cobrar", statsOutstanding / unit],
      [],
      ["Movimiento", "Fecha", "Referencia", "Importe"]
    ];
    if (statsPayments.length) {
      const saleNames = new Map(statsSales.map((sale) => [sale.id, sale.sale_number || "Venta"]));
      statsPeriodPayments.forEach((payment) => rows.push(["Ingreso", profitPeriodDateKey(payment.paid_at), saleNames.get(payment.sale_id) || "Abono", Number(payment.amount_minor || 0) / unit]));
    } else {
      statsPeriodSales.filter((sale) => Number(sale.amount_paid_minor || 0) > 0).forEach((sale) => rows.push(["Ingreso", profitPeriodDateKey(sale.sold_at || sale.created_at), sale.sale_number || "Venta", Number(sale.amount_paid_minor || 0) / unit]));
    }
    statsPeriodExpenses.forEach((expense) => rows.push(["Gasto", profitPeriodDateKey(expense.expense_date), expense.description || expense.category || "Gasto", Number(expense.amount_minor || 0) / unit]));
    if (statsPurchasePayments.length) {
      const purchaseNames = new Map(statsPurchases.map((purchase) => [purchase.id, purchase.purchase_number || "Compra"]));
      statsPeriodPurchasePayments.forEach((payment) => rows.push(["Compra pagada", profitPeriodDateKey(payment.paid_at), purchaseNames.get(payment.purchase_id) || "Pago de compra", Number(payment.amount_minor || 0) / unit]));
    } else {
      statsPeriodPurchases.filter((purchase) => Number(purchase.amount_paid_minor || 0) > 0).forEach((purchase) => rows.push(["Compra pagada", profitPeriodDateKey(purchase.purchased_at || purchase.created_at), purchase.purchase_number || "Compra", Number(purchase.amount_paid_minor || 0) / unit]));
    }
    const csv = "\uFEFF" + rows.map((row) => row.map((value) => {
      const cell = String(value ?? "");
      return /[;\r\n"]/.test(cell) ? '"' + cell.replace(/"/g, '""') + '"' : cell;
    }).join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "treseiscinco-estadisticas-" + statsRangeStart + "-a-" + statsRangeEnd + ".csv";
    document.body.appendChild(downloadLink); downloadLink.click(); downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  }

  function printStatsReport() { window.print(); }

  const profitSalesTotal = periodSales.reduce((sum, sale) => sum + Number(sale.total_minor || 0), 0);
  const profitPaidTotal = periodSales.reduce((sum, sale) => sum + Number(sale.amount_paid_minor || 0), 0);
  const profitCostOfSales = periodSaleItems.reduce((sum, item) => sum + Math.round(Number(item.unit_cost_minor || 0) * Number(item.quantity || 0)), 0);
  const profitLineRevenue = periodSaleItems.reduce((sum, item) => sum + Number(item.line_total_minor || 0), 0);
  const profitGross = profitLineRevenue - profitCostOfSales;
  const profitExpenseTotal = periodExpenses.reduce((sum, expense) => sum + Number(expense.amount_minor || 0), 0);
  const profitNet = profitGross - profitExpenseTotal;
  const expensesByCategory = Object.values(periodExpenses.reduce((groups, expense) => {
    const category = expense.category || "Otro";
    if (!groups[category]) groups[category] = { name: category, amount: 0, count: 0 };
    groups[category].amount += Number(expense.amount_minor || 0);
    groups[category].count += 1;
    return groups;
  }, {})).sort((a, b) => b.amount - a.amount);
  const profitByItem = Object.values(periodSaleItems.reduce((groups, item) => {
    const name = item.item_name || "Artículo sin nombre";
    if (!groups[name]) groups[name] = { name, quantity: 0, revenue: 0, cost: 0 };
    groups[name].quantity += Number(item.quantity || 0);
    groups[name].revenue += Number(item.line_total_minor || 0);
    groups[name].cost += Math.round(Number(item.unit_cost_minor || 0) * Number(item.quantity || 0));
    return groups;
  }, {})).sort((a, b) => (b.revenue - b.cost) - (a.revenue - a.cost));
  const profitIncomePieRows = (() => {
    const revenueRows = [...profitByItem].sort((a,b) => b.revenue-a.revenue);
    const top = revenueRows.slice(0,4).map((item) => ({label:item.name,value:item.revenue}));
    const otherRevenue = revenueRows.slice(4).reduce((sum,item)=>sum+item.revenue,0);
    if (otherRevenue>0) top.push({label:"Otros productos",value:otherRevenue});
    return top.length ? top : [{label:"Ventas",value:profitLineRevenue}];
  })();
  const profitPurchasesPaid = periodPurchasePayments.reduce((sum,payment)=>sum+Number(payment.amount_minor||0),0);
  const profitCostPieRows = Object.entries(periodExpenses.reduce((groups,expense)=>{
    const category=String(expense.category||"Otros").trim()||"Otros";
    groups[category]=(groups[category]||0)+Number(expense.amount_minor||0);
    return groups;
  },{})).map(([label,value])=>({label,value})).sort((a,b)=>b.value-a.value).slice(0,5);

  const homePurchaseExpensePieRows = (() => {
    const combined = new Map();
    for (const item of homePieData.purchases) {
      const label = item.label === "Otros" ? "Otras compras" : "Compra · " + item.label;
      combined.set(label, (combined.get(label) || 0) + Number(item.value || 0));
    }
    for (const item of homePieData.expenses) {
      const label = item.label === "Otros" ? "Otros gastos" : "Gasto · " + item.label;
      combined.set(label, (combined.get(label) || 0) + Number(item.value || 0));
    }
    return summarizeHomePieMap(combined, 4, "Otros movimientos");
  })();
  const homeMobilePieRows = [
    { label: "Ingresos", value: homePieData.income.reduce((sum, item) => sum + Number(item.value || 0), 0) },
    { label: "Compras y gastos", value:
      homePieData.purchases.reduce((sum, item) => sum + Number(item.value || 0), 0)
      + homePieData.expenses.reduce((sum, item) => sum + Number(item.value || 0), 0)
    }
  ].filter((item) => item.value > 0);

  const isBusinessManager = ["owner", "admin"].includes(activeBusiness?.role);
  const isBusinessOwner = activeBusiness?.role === "owner";
  const businessPermissions = activeBusiness?.permissions || {};
  const canPermission = (permission) => isBusinessManager
    || Boolean(businessPermissions[permission])
    || (permission === "suppliers_manage" && Boolean(businessPermissions.purchases_manage));
  const canManageProducts = canPermission("products_manage");
  const canManageSales = canPermission("sales_manage");
  const canManageCustomers = canPermission("customers_manage");
  const canManagePurchases = canPermission("purchases_manage");
  const canManageExpenses = canPermission("expenses_manage");
  const canViewPurchases = canPermission("purchases_view");
  const canViewExpenses = canPermission("expenses_view");
  const canViewSuppliers = canPermission("suppliers_view") || canViewPurchases;
  const effectivePurchaseTab = screen === "suppliers" ? "suppliers"
    : canViewPurchases
      ? (purchaseModuleTab === "expenses" && canViewExpenses ? "expenses" : "purchases")
      : "expenses";
  function canAccessScreen(next) {
    if (next === "home" || next === "setup") return true;
    if (next === "platform_admin") return isPlatformAdmin;
    if (next === "banks") return isBusinessManager;
    if (next === "accounts") return canPermission("sales_view") || canViewPurchases;
    if (next === "receivables") return canPermission("sales_view");
    if (next === "payables") return canViewPurchases;
    if (next === "settings") return true;
    if (next === "team") return isBusinessManager;
    if (next === "products") return canPermission("products_view");
    if (next === "sales" || next === "stats" || next === "quotes") return canPermission("sales_view");
    if (next === "customers") return canPermission("customers_view");
    if (next === "purchases") return canViewPurchases || canViewExpenses;
    if (next === "suppliers") return isBusinessManager || canViewSuppliers || canViewPurchases;
    if (next === "coupons") return isBusinessManager;
    if (next === "profitability") return canPermission("sales_view") && canViewExpenses;
    if (next === "audit") return canPermission("reports_view") || isBusinessManager;
    if (next === "catalog") return canManageProducts;
    return false;
  }
  const visibleAreas = areas.filter((area) => canAccessScreen(area.screen));
  const visibleBankAccountOptions = isBusinessManager && activeBusiness?.id
    ? bankAccountOptions.filter((account) => account.business_id === activeBusiness.id && account.is_active && account.currency_code === currencyCode)
    : [];

  useEffect(() => {
    let active = true;
    setBankAccountOptions([]);
    if (!activeBusiness?.id || !isBusinessManager) return () => { active = false; };
    supabase.from("bank_accounts")
      .select("id,business_id,bank_name,account_name,account_type,account_last4,currency_code,is_active")
      .eq("business_id", activeBusiness.id).eq("is_active", true).order("bank_name").order("account_name")
      .then(({ data, error: queryError }) => {
        if (!active) return;
        if (queryError) { setBankAccountOptions([]); return; }
        setBankAccountOptions(data || []);
      });
    return () => { active = false; };
  }, [activeBusiness?.id, isBusinessManager]);

  useEffect(() => {
    if (screen === "banks") loadBankDashboard();
    else {
      bankDashboardRequestRef.current += 1;
      setBankDashboard({ accounts: [], movements: [], movement_count: 0, summary: { account_count: 0, balance_minor: 0, income_month_minor: 0, expenses_month_minor: 0 } });
      setBankDashboardBusinessId(null);
      setBankLoading(false);
    }
  }, [screen, activeBusiness?.id, isBusinessManager]);
  const homeShortcutOrder = ["products","sales","accounts","customers","stats","quotes","purchases"];
  const homeShortcutAreas = visibleAreas.filter((area) => homeShortcutOrder.includes(area.screen)).sort((a,b) => homeShortcutOrder.indexOf(a.screen)-homeShortcutOrder.indexOf(b.screen));

  function hasUnsavedForm() {
    return Array.from(document.querySelectorAll("form")).some((form) => form.getClientRects().length > 0 && dirtyFormsRef.current.has(form));
  }

  function confirmLeaveForm() {
    if (!hasUnsavedForm()) return true;
    return window.confirm("Hay información sin guardar. ¿De verdad deseas salir y descartar los cambios?");
  }

  useEffect(() => {
    try { window.sessionStorage.setItem("treseiscinco:last-screen", screen); } catch {}
    const markDirty = (event) => {
      const form = event.target?.closest?.("form");
      if (!form || !form.getClientRects().length) return;
      if (event.target?.matches?.("input[type=button],input[type=submit],button,select[data-filter-only=\"true\"]")) return;
      dirtyFormsRef.current.add(form);
    };
    const clearDirty = (event) => { if (event.target?.tagName === "FORM") dirtyFormsRef.current.delete(event.target); };
    const beforeUnload = (event) => { if (hasUnsavedForm()) { event.preventDefault(); event.returnValue = ""; } };
    const handlePopState = (event) => {
      if (!confirmLeaveForm()) {
        window.history.pushState({ treseiscinco: true, screen }, "", window.location.href);
        return;
      }
      if (event.state?.treseiscinco && event.state.screen) {
        setScreen(event.state.screen);
      } else {
        // Keep Android/browser Back inside the app at its root instead of closing the app unexpectedly.
        window.history.pushState({ treseiscinco: true, screen: "home" }, "", window.location.href);
        setScreen("home");
      }
      dirtyFormsRef.current = new WeakSet();
      setMobileNavOpen(false);
      setShowProductForm(false);
      setShowPurchaseForm(false);
      setShowExpenseForm(false);
      setShowSupplierForm(false);
      setShowQuoteForm(false);
      setError(""); setNotice("");
    };
    if (!window.history.state?.treseiscinco) window.history.pushState({ treseiscinco: true, screen }, "", window.location.href);
    document.addEventListener("input", markDirty, true);
    document.addEventListener("change", markDirty, true);
    document.addEventListener("submit", clearDirty, true);
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("input", markDirty, true);
      document.removeEventListener("change", markDirty, true);
      document.removeEventListener("submit", clearDirty, true);
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [screen]);

  function navigate(next, purchaseTab = "purchases") {
    if (!canAccessScreen(next)) { setError("Tu cuenta no tiene permiso para abrir ese módulo."); return; }
    if (next !== screen && !confirmLeaveForm()) return;
    if (next !== screen) window.history.pushState({ treseiscinco: true, screen: next }, "", window.location.href);
    dirtyFormsRef.current = new WeakSet();
    setScreen(next); setMobileNavOpen(false); setError(""); setNotice(""); setShowProductForm(false);
    if (next !== "quotes") clearQuoteDraft();
    if (next === "accounts") setAccountsTab(canPermission("sales_view") ? "receivables" : "payables");
    if (next === "purchases") { setPurchaseModuleTab(purchaseTab === "expenses" && canViewExpenses ? "expenses" : canViewPurchases ? "purchases" : "expenses"); setShowSupplierForm(false); }
    if (next !== "purchases") { setShowPurchaseForm(false); setShowExpenseForm(false); setShowSupplierForm(false); }
    if (next !== "products") { setAdjustingId(null); }
  }

  useEffect(() => {
    setSidebarLayout(normalizeSidebarLayout(activeBusiness?.settings?.sidebar_layout));
    setSidebarEditing(false);
  }, [activeBusiness?.id]);

  useEffect(() => {
    document.dispatchEvent(new CustomEvent("treseiscinco:field-help-open", { detail: { source: null } }));
  }, [screen, activeBusiness?.id]);

  function updateSidebarDraft(updater) {
    setSidebarLayout((current) => normalizeSidebarLayout(typeof updater === "function" ? updater(current) : updater));
  }

  async function saveSidebarLayout() {
    if (!activeBusiness?.id || !isBusinessOwner) return;
    setSidebarSaving(true); setError(""); setNotice("");
    const nextLayout = normalizeSidebarLayout(sidebarLayout);
    const nextSettings = { ...(activeBusiness.settings || {}), sidebar_layout: nextLayout };
    try {
      const { data, error: saveError } = await supabase.from("businesses")
        .update({ settings: nextSettings }).eq("id", activeBusiness.id)
        .select("id,settings").maybeSingle();
      if (saveError) throw saveError;
      if (!data) throw new Error("No se pudo guardar el menú. Comprueba que tu sesión siga activa.");
      setActiveBusiness((current) => current ? { ...current, settings: data.settings || nextSettings } : current);
      setBusinesses((current) => current.map((business) => business.id === data.id ? { ...business, settings: data.settings || nextSettings } : business));
      setSidebarLayout(normalizeSidebarLayout(data.settings?.sidebar_layout));
      setSidebarEditing(false);
      setNotice("Menú guardado. El orden y los nombres se conservaron.");
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSidebarSaving(false);
    }
  }

  function confirmSidebarDrop(payload, targetGroupId, targetItemId = null) {
    if (!payload || !isBusinessOwner) return;
    const accepted = window.confirm("¿Deseas moverlo aquí? Si aceptas, guardaré el nuevo orden del menú. Si cancelas, lo dejaré como estaba.");
    if (!accepted) {
      if (sidebarPreDragRef.current) setSidebarLayout(normalizeSidebarLayout(sidebarPreDragRef.current));
      setDraggedSidebarItem(null); setSidebarTouchDragging(false); setSidebarEditing(false);
      return;
    }
    if (payload.type === "item") moveSidebarItem(payload.id, targetGroupId, targetItemId);
    else if (payload.type === "group") moveSidebarGroup(payload.id, targetGroupId);
    setSidebarEditing(false);
    setDraggedSidebarItem(null);
    setSidebarTouchDragging(false);
    setSidebarConfirmSave(true);
  }

  useEffect(() => {
    if (!sidebarConfirmSave) return;
    setSidebarConfirmSave(false);
    saveSidebarLayout();
  }, [sidebarConfirmSave, sidebarLayout]);

  function moveSidebarItem(itemId, targetGroupId, targetItemId = null) {
    updateSidebarDraft((current) => {
      const next = current.map((group) => ({ ...group, items: [...group.items] }));
      let moving = null;
      for (const group of next) {
        const index = group.items.findIndex((item) => item.id === itemId);
        if (index >= 0) { [moving] = group.items.splice(index, 1); break; }
      }
      if (!moving) return current;
      const target = next.find((group) => group.id === targetGroupId);
      if (!target) return current;
      const targetIndex = targetItemId ? target.items.findIndex((item) => item.id === targetItemId) : -1;
      target.items.splice(targetIndex < 0 ? target.items.length : targetIndex, 0, moving);
      return next;
    });
  }

  function moveSidebarGroup(groupId, targetGroupId) {
    updateSidebarDraft((current) => {
      const next = [...current];
      const from = next.findIndex((group) => group.id === groupId);
      const to = next.findIndex((group) => group.id === targetGroupId);
      if (from < 0 || to < 0 || from === to) return current;
      const [moving] = next.splice(from, 1);
      next.splice(to, 0, moving);
      return next;
    });
  }

  function startSidebarMouseDrag(event, payload) {
    if (!isBusinessOwner) {
      event.preventDefault();
      return;
    }
    sidebarPreDragRef.current = normalizeSidebarLayout(sidebarLayout);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", payload.id);
    }
    setDraggedSidebarItem(payload);
  }

  function startSidebarTouchDrag(event, payload) {
    if (!isBusinessOwner) return;
    if (sidebarEditing && event.target?.closest && event.target.closest("input, button")) return;
    if (!event.touches || event.touches.length !== 1) return;
    const touch = event.touches[0];
    sidebarPreDragRef.current = normalizeSidebarLayout(sidebarLayout);
    sidebarTouchRef.current = {
      ...payload,
      startX: touch.clientX,
      startY: touch.clientY,
      dragging: false,
      lastTarget: null
    };
    if (sidebarLongPressTimerRef.current) window.clearTimeout(sidebarLongPressTimerRef.current);
    sidebarLongPressTimerRef.current = window.setTimeout(() => {
      const active = sidebarTouchRef.current;
      if (!active) return;
      active.dragging = true;
      sidebarSuppressClickRef.current = true;
      setDraggedSidebarItem({ type: active.type, id: active.id });
      setSidebarTouchDragging(true);
    }, 320);
  }

  function moveSidebarTouchDrag(event) {
    const active = sidebarTouchRef.current;
    if (!active || !event.touches || event.touches.length !== 1) return;
    const touch = event.touches[0];
    if (!active.dragging) {
      if (Math.hypot(touch.clientX - active.startX, touch.clientY - active.startY) > 12) {
        if (sidebarLongPressTimerRef.current) window.clearTimeout(sidebarLongPressTimerRef.current);
        sidebarLongPressTimerRef.current = null;
        sidebarTouchRef.current = null;
      }
      return;
    }

    event.preventDefault();
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const targetItem = target?.closest?.("[data-sidebar-item-id]");
    const targetGroup = target?.closest?.("[data-sidebar-group-id]");
    if (active.type === "item" && targetItem) {
      const targetId = targetItem.dataset.sidebarItemId;
      const targetGroupId = targetItem.closest("[data-sidebar-group-id]")?.dataset.sidebarGroupId;
      const targetKey = "item:" + targetGroupId + ":" + targetId;
      if (targetId && targetGroupId && targetId !== active.id && targetKey !== active.lastTarget) {
        moveSidebarItem(active.id, targetGroupId, targetId);
        active.groupId = targetGroupId;
        active.lastTarget = targetKey;
      }
    } else if (active.type === "item" && targetGroup && targetGroup.dataset.sidebarGroupId
      && targetGroup.dataset.sidebarGroupId !== active.groupId) {
      const targetKey = "end:" + targetGroup.dataset.sidebarGroupId;
      if (targetKey !== active.lastTarget) {
        moveSidebarItem(active.id, targetGroup.dataset.sidebarGroupId);
        active.groupId = targetGroup.dataset.sidebarGroupId;
        active.lastTarget = targetKey;
      }
    } else if (active.type === "group" && targetGroup) {
      const targetGroupId = targetGroup.dataset.sidebarGroupId;
      if (targetGroupId && targetGroupId !== active.id && active.lastTarget !== "group:" + targetGroupId) {
        moveSidebarGroup(active.id, targetGroupId);
        active.lastTarget = "group:" + targetGroupId;
      }
    }
  }

  function finishSidebarTouchDrag() {
    if (sidebarLongPressTimerRef.current) window.clearTimeout(sidebarLongPressTimerRef.current);
    sidebarLongPressTimerRef.current = null;
    const drag = sidebarTouchRef.current;
    if (drag?.dragging) {
      setSidebarTouchDragging(false);
      setDraggedSidebarItem(null);
      setSidebarEditing(false);
      if (drag.lastTarget) {
        const accepted = window.confirm("¿Deseas moverlo aquí? Si aceptas, guardaré el nuevo orden del menú. Si cancelas, desharé el movimiento.");
        if (accepted) setSidebarConfirmSave(true);
        else if (sidebarPreDragRef.current) setSidebarLayout(normalizeSidebarLayout(sidebarPreDragRef.current));
      }
      window.setTimeout(() => { sidebarSuppressClickRef.current = false; }, 650);
    }
    sidebarTouchRef.current = null;
  }

  sidebarTouchHandlersRef.current = {
    move: moveSidebarTouchDrag,
    end: finishSidebarTouchDrag
  };

  useEffect(() => {
    const handleDocumentTouchMove = (event) => sidebarTouchHandlersRef.current.move?.(event);
    const handleDocumentTouchEnd = () => sidebarTouchHandlersRef.current.end?.();
    document.addEventListener("touchmove", handleDocumentTouchMove, { passive: false });
    document.addEventListener("touchend", handleDocumentTouchEnd);
    document.addEventListener("touchcancel", handleDocumentTouchEnd);
    return () => {
      document.removeEventListener("touchmove", handleDocumentTouchMove);
      document.removeEventListener("touchend", handleDocumentTouchEnd);
      document.removeEventListener("touchcancel", handleDocumentTouchEnd);
      if (sidebarLongPressTimerRef.current) window.clearTimeout(sidebarLongPressTimerRef.current);
    };
  }, []);

  function navigateSidebarItem(item) {
    navigate(item.screen);
  }

  function switchActiveBusiness(businessId) {
    const nextBusiness = businesses.find((business) => business.id === businessId);
    if (!nextBusiness || nextBusiness.id === activeBusiness?.id) return;
    cancelProductForm();
    clearSaleDraft();
    clearQuoteDraft();
    resetCustomerForm();
    clearTeamForm();
    setActiveBusiness(nextBusiness);
    setScreen("sales");
    setShowPurchaseForm(false); setShowSupplierForm(false); setShowExpenseForm(false);
    setShowArchivedProducts(false); setSearch(""); setCustomerSearch("");
    setProductStockFilter("all"); setProductCategoryFilter("all"); setProductTypeFilter("all"); setProductSort("name"); setBulkEditMode(false); setBulkProductRows([]);
    setSalePaymentFormFor(null); setPurchasePaymentFormFor(null);
    setViewingVariantsFor(null); setVariantDraft(blankVariantDraft); setEditingVariantId(null);
    setProductPage(1); setSalesPage(1); setCustomersPage(1); setPurchasesPage(1); setExpensesPage(1);
    setPurchaseModuleTab("purchases");
    setError(""); setNotice("");
  }

  const activeBusinessLogoUrl = getBusinessLogoUrl(activeBusiness?.logo_path);
  const activeTheme = normalizeBusinessTheme(activeBusiness?.theme);
  const safeAppText = readableText(activeTheme.background, activeTheme.text);
  const safeMutedText = readableText(activeTheme.surface, "#69758A");
  const safeDangerText = readableText(activeTheme.surface, "#B42318");
  const safeSuccessText = readableText(activeTheme.surface, "#16824B");
  const safeSidebarText = readableText(activeTheme.sidebarBackground, activeTheme.sidebarText);
  const sidebarActiveBackground = mixHex(activeTheme.primary, activeTheme.sidebarBackground, 0.17);
  const sidebarHoverBackground = mixHex(safeSidebarText, activeTheme.sidebarBackground, 0.055);
  const sidebarHeadingBackground = mixHex(activeTheme.primary, activeTheme.sidebarBackground, 0.075);
  const sidebarHeadingText = readableText(sidebarHeadingBackground, safeSidebarText);
  const sidebarActiveText = readableText(sidebarActiveBackground, safeSidebarText);
  const sidebarBorder = mixHex(safeSidebarText, activeTheme.sidebarBackground, 0.18);
  const safeAccent = readableAccent(activeTheme.primary, activeTheme.surface);
  const primaryHover = shadeHex(activeTheme.primary);
  const primaryButtonText = readableText(activeTheme.primary, "#FFFFFF");
  const primaryHoverText = readableText(primaryHover, "#FFFFFF");
  const appThemeStyle = {
    "--green": safeAccent,
    "--brand-teal": safeAccent,
    "--brand-blue": safeAccent,
    "--brand-yellow": safeAccent,
    "--soft-green": `color-mix(in srgb, ${safeAccent} 12%, ${activeTheme.surface})`,
    "--paper": activeTheme.surface,
    "--ink": readableText(activeTheme.surface, activeTheme.text),
    "--muted": safeMutedText,
    "--danger-text": safeDangerText,
    "--success-text": safeSuccessText,
    "--primary-button-bg": activeTheme.primary,
    "--primary-button-text": primaryButtonText,
    "--sidebar-background": activeTheme.sidebarBackground,
    "--sidebar-text": safeSidebarText,
    "--sidebar-active-background": sidebarActiveBackground,
    "--sidebar-active-text": sidebarActiveText,
    "--sidebar-hover-background": sidebarHoverBackground,
    "--sidebar-heading-background": sidebarHeadingBackground,
    "--sidebar-heading-text": sidebarHeadingText,
    "--sidebar-border": sidebarBorder,
    "--button-hover": primaryHover,
    "--button-hover-text": primaryHoverText,
    "--app-background": activeTheme.background,
    background: activeTheme.background,
    color: safeAppText
  };
  const contextualHelpEnabled = activeBusiness?.settings?.contextual_help_enabled !== false;
  if (!authReady) return <div className="loading-screen"><div className="brand-mark"><img className="brand-symbol" src="/symbol-treseiscinco.svg" alt="treseiscinco" /></div><p>Preparando tu espacio…</p></div>;

  if (!session && showPublicLanding && mode !== "update-password") return <PublicLanding
    onLogin={() => { setShowPublicLanding(false); setMode("login"); setPassword(""); setError(""); setNotice(""); }}
    onSignup={() => { setShowPublicLanding(false); setMode("signup"); setPassword(""); setError(""); setNotice(""); }}
    onInstall={requestPwaInstall}
    installPromptAvailable={Boolean(installPrompt)}
    appInstalled={appInstalled}
    showInstallGuide={showInstallGuide}
    onCloseInstallGuide={() => setShowInstallGuide(false)}
  />;

  if (!session || mode === "update-password") return (
    <main className="auth-shell">
      <section className="auth-brand-panel">
        <a className="brand" href="/"><img className="brand-logo-full" src="/brand-treseiscinco.svg" alt="treseiscinco" /></a>
        <div className="auth-pitch"><p className="eyebrow">TU NEGOCIO, CON CLARIDAD</p><h1>Menos enredos.<br /><em>Más negocio.</em></h1><p>Productos, ventas, costos y clientes en un solo lugar, fácil de entender y usar.</p></div>
        {!appInstalled && mode !== "update-password" && <div className="auth-mobile-install">
          <span className="auth-install-icon"><AppIcon name="smartphone" size={24}/></span>
          <div className="auth-install-copy"><strong>Tu negocio, también en tu celular</strong><p>Instala treseiscinco y maneja con claridad desde la pantalla de inicio.</p></div>
          <div className="auth-install-actions"><a className="auth-install-button auth-apk-download" href="/download/apk"><AppIcon name="download" size={15}/> Descargar APK</a><button type="button" className="auth-install-secondary" onClick={requestPwaInstall}>{installPrompt ? "Instalar en navegador" : "Otras opciones"}</button></div>
        </div>}
        {showInstallGuide && !appInstalled && mode !== "update-password" && <section className="install-guide-panel auth-install-guide">
          <div className="install-guide-heading"><div><span className="eyebrow">TRESEISCINCO · APP INSTALABLE</span><h3>Instálala en tu celular</h3><p>No necesitas bajar un archivo externo; se instala desde tu navegador.</p></div><button type="button" className="icon-action-button" aria-label="Cerrar instrucciones" onClick={() => setShowInstallGuide(false)}>×</button></div>
          <div className="install-guide-steps">
            <div><strong>Android · Chrome</strong><p>Abre el menú ⋮ y elige «Instalar aplicación» o «Agregar a pantalla principal».</p></div>
            <div><strong>iPhone · Safari</strong><p>Toca Compartir y selecciona «Agregar a pantalla de inicio»; después pulsa «Agregar».</p></div>
            <div><strong>Computador · Chrome o Edge</strong><p>Usa el icono Instalar de la barra de direcciones o el menú del navegador.</p></div>
          </div>
        </section>}
        <span className="panel-footnote">Un espacio independiente para cada negocio.</span>
      </section>
      <section className="auth-form-panel"><div className="auth-form-wrap">
        <p className="eyebrow">{mode === "signup" ? "EMPIEZA GRATIS" : mode === "forgot" || mode === "update-password" ? "RECUPERA TU ACCESO" : "QUÉ BUENO VERTE"}</p>
        <h2>{mode === "signup" ? "Crea tu cuenta" : mode === "forgot" ? "Recupera tu acceso" : mode === "update-password" ? "Crea una nueva contraseña" : "Inicia sesión"}</h2>
        <p className="form-intro">{mode === "signup" ? "Primero creamos tu acceso. Después podrás registrar tu negocio." : mode === "forgot" ? "Escribe el correo de tu cuenta y te enviaremos un enlace para recuperar el acceso." : mode === "update-password" ? "Elige una contraseña nueva para volver a entrar a tu cuenta." : "Entra para continuar con tu negocio."}</p>
        <form onSubmit={submitAuth} className="form-stack">
          {mode === "signup" && <label><span className="field-label-heading">Tu nombre</span><input autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="¿Cómo te llamas?" required maxLength={120} /></label>}
          {mode !== "update-password" && <label><span className="field-label-heading">Correo electrónico</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required /></label>}
          {mode !== "forgot" && mode !== "update-password" && <label><span className="field-label-heading">{mode === "update-password" ? "Nueva contraseña" : "Contraseña"}<FieldHelp text={mode === "signup" ? "Para una cuenta nueva, usa al menos 12 caracteres. Una frase larga es fácil de recordar y difícil de adivinar." : "Usa una contraseña de al menos 6 caracteres."} /></span><input type="password" autoComplete={mode === "signup" || mode === "update-password" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={mode === "signup" ? "Mínimo 12 caracteres" : "Mínimo 6 caracteres"} minLength={mode === "signup" ? 12 : 6} maxLength={mode === "signup" ? 128 : undefined} required /></label>}
          {mode === "login" && <p className="forgot-password-row"><button type="button" className="text-button" onClick={() => { setMode("forgot"); setPassword(""); setError(""); setNotice(""); }}>Olvidé mi contraseña</button></p>}
          
        {error && <p className="message error" role="alert">{error}</p>}{notice && <p className="message success" role="status">{notice}</p>}
          <button className="primary-button" disabled={busy}>{busy ? "Un momento…" : mode === "signup" ? "Crear mi cuenta" : mode === "forgot" ? "Enviar enlace de recuperación" : mode === "update-password" ? "Guardar nueva contraseña" : "Entrar"}</button>

        </form>
        {mode !== "update-password" && <p className="switch-mode">{mode === "forgot" ? "¿Recordaste tu contraseña?" : mode === "signup" ? "¿Ya tienes cuenta?" : "¿Primera vez por aquí?"} <button type="button" className="text-button" onClick={() => { setMode(mode === "signup" || mode === "forgot" ? "login" : "signup"); setPassword(""); setError(""); setNotice(""); }}>{mode === "signup" || mode === "forgot" ? "Inicia sesión" : "Crear cuenta"}</button></p>}
        <p className="privacy-note">Tu información pertenece a tu negocio. No uses datos reales de clientes hasta completar las pruebas de seguridad.</p>
      </div></section>
    </main>
  );

  if (!businesses.length || screen === "setup") return (
    <main className="setup-shell"><header className="topbar"><a className="brand" href="/"><img className="brand-logo-full" src="/brand-treseiscinco.svg" alt="treseiscinco" /></a><button className="text-button" onClick={signOut}>Cerrar sesión</button></header>
      <section className="setup-card"><p className="eyebrow">PASO 1 DE 1</p><h1>¿Cómo se llama<br /><em>tu negocio?</em></h1><p>Este nombre identifica tu espacio. Más adelante podrás configurar tu logo, colores y equipo.</p>
        <form className="form-stack" onSubmit={createBusiness}><label><span className="field-label-heading">Nombre del negocio</span><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ej. Mi tienda" maxLength={120} required autoFocus /></label>
          {error && <p className="message error" role="alert">{error}</p>}{notice && <p className="message success" role="status">{notice}</p>}
          <button className="primary-button" disabled={busy}>{busy ? "Creando espacio…" : "Crear mi espacio"}</button>
        </form><p className="privacy-note">Cada negocio tiene sus propios datos y permisos.</p>
      </section>
    </main>
  );

  function renderPlatformAdminPanel() {
    return (
<section className="platform-admin-page">
            <div className="products-intro"><div><p className="eyebrow">CONTROL INTERNO</p><h2>Administración de plataforma</h2><p>Usuarios, actividad, pruebas de 30 días, pagos e historial. Los cobros recurrentes se conectarán después.</p></div><button type="button" className="secondary-button" onClick={loadPlatformAdminDashboard} disabled={platformAdminLoading}>Actualizar</button></div>
            {!isPlatformAdmin?<div className="empty-state"><h3>Acceso restringido</h3><p>Este panel se valida también en el servidor.</p></div>:platformAdminLoading&&!platformAdminData?<div className="empty-state">Cargando estadísticas…</div>:<>
              <div className="platform-admin-metrics">
                {[[ "Empresas registradas",platformAdminData?.summary?.businesses ],["Usuarios registrados",platformAdminData?.summary?.total_users ],["Activos hoy",platformAdminData?.summary?.active_today],["Activos en 7 días",platformAdminData?.summary?.active_7d],["Activos en 30 días",platformAdminData?.summary?.active_30d],["PWA detectadas",platformAdminData?.summary?.installed_users],["Pruebas activas",platformAdminData?.summary?.trials_live],["Suscripciones activas",platformAdminData?.summary?.subscribers_active]].map(([label,value])=><article key={label} className="platform-admin-metric panel"><span>{label}</span><strong>{Number(value||0).toLocaleString("es-CO")}</strong></article>)}
                <article className="platform-admin-metric panel"><span>Pagos confirmados este mes</span><strong>{money(platformAdminData?.summary?.collected_month||0,"COP")}</strong></article>
              </div>
              <div className="platform-admin-controls"><label><span>Buscar negocio o correo</span><input value={platformAdminSearch} onChange={e=>setPlatformAdminSearch(e.target.value)} placeholder="Nombre o correo"/></label><label><span>Motivo de la acción</span><input value={platformAdminNote} onChange={e=>setPlatformAdminNote(e.target.value)} maxLength={2000} placeholder="Nota interna opcional"/></label></div>
              <div className="platform-admin-business-list">{(platformAdminData?.subscriptions||[]).filter(x=>!platformAdminSearch.trim()||[x.business_name,x.owner_email].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(platformAdminSearch.trim().toLocaleLowerCase("es"))).map(x=>{const labels={trialing:"En prueba",active:"Activa",past_due:"Pago pendiente",canceled:"Cancelada",expired:"Vencida",paused:"Pausada"};return <article className="platform-business-card panel" key={x.subscription_id}>
                <div className="platform-business-heading"><div><span>{x.owner_email}</span><h3>{x.business_name}</h3><small>Creado: {x.business_created_at?new Date(x.business_created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota"}):"—"} · Última actividad: {x.last_seen_at?new Date(x.last_seen_at).toLocaleString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium",timeStyle:"short"}):"Sin datos"}</small></div><span className={"status-pill "+(x.status==="active"?"status-active":x.status==="trialing"?"status-unpublished":"status-inactive")}>{labels[x.status]||x.status}</span></div>
                <div className="platform-business-facts"><div><span>Inicio</span><strong>{x.current_period_start?new Date(x.current_period_start).toLocaleDateString("es-CO",{timeZone:"America/Bogota"}):"—"}</strong></div><div><span>Vence</span><strong>{x.current_period_end?new Date(x.current_period_end).toLocaleDateString("es-CO",{timeZone:"America/Bogota"}):"—"}</strong></div><div><span>Días restantes</span><strong>{x.current_period_end?x.days_remaining+" días":"—"}</strong></div><div><span>Total recibido</span><strong>{money(x.total_paid_minor||0,"COP")}</strong></div><div><span>Instalación</span><strong>{x.is_installed?"Detectada":"No detectada"}</strong></div></div>
                <div className="platform-subscription-editor"><label><span>Estado</span><select value={platformAdminStatusDrafts[x.subscription_id]||x.status} onChange={e=>setPlatformAdminStatusDrafts(v=>({...v,[x.subscription_id]:e.target.value}))}><option value="trialing">En prueba</option><option value="active">Activa</option><option value="past_due">Pago pendiente</option><option value="paused">Pausada</option><option value="canceled">Cancelada</option><option value="expired">Vencida</option></select></label><label><span>Fin del periodo</span><input type="datetime-local" value={platformAdminPeriodDrafts[x.subscription_id]??""} onChange={e=>setPlatformAdminPeriodDrafts(v=>({...v,[x.subscription_id]:e.target.value}))}/></label><button type="button" className="secondary-button action-small" disabled={platformAdminSaving} onClick={()=>updatePlatformSubscription(x)}>Guardar cambios</button><button type="button" className="secondary-button action-small" disabled={platformAdminSaving} onClick={()=>updatePlatformSubscription(x,"trialing",7)}>Extender prueba 7 días</button></div>
                <button type="button" className="primary-button compact-button" onClick={()=>{setPlatformPaymentBusiness(v=>v===x.business_id?"":x.business_id);setPlatformPaymentDraft({interval:"month",amount:"",method:"Nequi",reference:"",notes:""});}}>＋ Registrar pago</button>
                {platformPaymentBusiness===x.business_id&&<form className="platform-payment-form" onSubmit={e=>submitPlatformPayment(e,x)}><h4>Confirmar pago recibido</h4><p>Confirma solo después de verificar el ingreso en Nequi o tu cuenta bancaria.</p><div className="platform-payment-grid"><label><span>Periodo</span><select value={platformPaymentDraft.interval} onChange={e=>setPlatformPaymentDraft(v=>({...v,interval:e.target.value}))}><option value="month">Mensual</option><option value="quarter">Trimestral</option><option value="year">Anual</option></select></label><label><span>Valor (COP)</span><input type="number" min="1" value={platformPaymentDraft.amount} onChange={e=>setPlatformPaymentDraft(v=>({...v,amount:e.target.value}))} required/></label><label><span>Medio</span><select value={platformPaymentDraft.method} onChange={e=>setPlatformPaymentDraft(v=>({...v,method:e.target.value}))}><option>Nequi</option><option>Transferencia bancaria</option><option>Efectivo</option><option>Wompi manual</option><option>Tarjeta manual</option><option>Otro</option></select></label><label><span>Referencia única{["Nequi","Transferencia bancaria","Wompi manual","Tarjeta manual"].includes(platformPaymentDraft.method)?" *":""}</span><input value={platformPaymentDraft.reference} onChange={e=>setPlatformPaymentDraft(v=>({...v,reference:e.target.value}))} maxLength={180} required={["Nequi","Transferencia bancaria","Wompi manual","Tarjeta manual"].includes(platformPaymentDraft.method)}/></label><label><span>Notas</span><input value={platformPaymentDraft.notes} onChange={e=>setPlatformPaymentDraft(v=>({...v,notes:e.target.value}))} maxLength={2000}/></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={()=>setPlatformPaymentBusiness("")}>Cancelar</button><button type="submit" className="primary-button" disabled={platformAdminSaving}>Confirmar y activar</button></div></form>}
              </article>})}</div>
              <section className="platform-history-section panel"><h3>Historial de pagos</h3>{(platformAdminData?.payments||[]).length?<div className="platform-history-table-wrap"><table className="platform-history-table"><thead><tr><th>Fecha</th><th>Negocio</th><th>Medio / referencia</th><th>Periodo</th><th>Valor</th><th>Estado</th></tr></thead><tbody>{platformAdminData.payments.map(p=><tr key={p.id}><td>{new Date(p.received_at||p.created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota"})}</td><td>{p.business_name}<small>{p.owner_email}</small></td><td>{p.payment_method}<small>{p.external_reference||"Sin referencia"}</small></td><td>{{month:"Mensual",quarter:"Trimestral",year:"Anual"}[p.billing_interval]}</td><td>{money(p.amount_minor,p.currency_code||"COP")}</td><td>{p.status}</td></tr>)}</tbody></table></div>:<p>No hay pagos registrados.</p>}</section>
              <section className="platform-history-section panel"><h3>Historial de suscripciones</h3>{(platformAdminData?.events||[]).length?<div className="platform-events-list">{platformAdminData.events.slice(0,100).map(e=><article className="platform-event-row" key={e.id}><div className="platform-event-business"><strong>{e.business_name}</strong></div><div className="platform-event-transition"><strong>{e.event_type.replaceAll("_"," ")}</strong><span>{e.old_status||"—"} → {e.new_status||"—"}</span></div><div className="platform-event-when"><strong>{new Date(e.created_at).toLocaleString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium",timeStyle:"short"})}</strong>{(e.metadata?.business_email||e.actor_email)&&<span>{e.metadata?.business_email||e.actor_email}</span>}{e.metadata?.note&&<p>{e.metadata.note}</p>}</div>{e.amount_minor!=null&&<strong>{money(e.amount_minor,e.currency_code||"COP")}</strong>}</article>)}</div>:<p>El historial aparecerá aquí cuando se creen pruebas, cambios y pagos.</p>}</section>
            </>}
          </section>
    );
  }


  return (
    <main className="app-shell" style={appThemeStyle}>
      <aside className="sidebar">
        <a className="brand" href="/"><img className="brand-logo-full" src="/brand-treseiscinco.svg" alt="treseiscinco" /></a>
        <div className="business-logo-stage" aria-label={"Identidad de " + (activeBusiness?.name || "tu negocio")}>
          <span className={"business-avatar" + (activeBusinessLogoUrl ? " has-business-logo" : "")}><span className="business-avatar-initial">{(activeBusiness?.name || "T").slice(0,1).toUpperCase()}</span>{activeBusinessLogoUrl && <img src={activeBusinessLogoUrl} alt={"Logo de " + (activeBusiness?.name || "negocio")} onError={(event) => { event.currentTarget.remove(); event.currentTarget.parentElement?.classList.remove("has-business-logo"); }} />}</span>
        </div>
        <div className={"business-switcher" + (businesses.length > 1 ? " business-switcher-multiple" : "")}>
          {businesses.length > 1
            ? <><select aria-label="Cambiar de negocio" value={activeBusiness?.id || ""} onChange={(e) => switchActiveBusiness(e.target.value)}>{businesses.map((business) => <option value={business.id} key={business.id}>{business.name}</option>)}</select><span className="switch-caret">⌄</span></>
            : <span className="business-name">{activeBusiness?.name}</span>}
        </div>

        <nav className={"nav-list" + (sidebarEditing ? " nav-list-editing" : "") + (sidebarTouchDragging ? " nav-list-touch-dragging" : "")} aria-label="Navegación del negocio">
          {sidebarLayout.filter((group) => sidebarEditing || group.items.some((item) => item.id === "home" || item.id === "settings" ? (item.id === "settings" ? (isBusinessOwner || isPlatformAdmin) : true) : item.id === "suppliers" ? (isBusinessManager || canPermission("suppliers_view") || canViewPurchases) : canAccessScreen(item.screen))).map((group) => <section key={group.id} data-sidebar-group-id={group.id} className={"sidebar-nav-group" + (!group.title.trim() && !sidebarEditing ? " sidebar-nav-group-untitled" : "")}
            onDragOver={(event) => { if (isBusinessOwner) event.preventDefault(); }}
            onDrop={(event) => { if (!isBusinessOwner) return; event.preventDefault(); confirmSidebarDrop(draggedSidebarItem, group.id); }}>
            {sidebarEditing && !group.items.some((navItem) => navItem.id === "home") && <div className="sidebar-group-heading">
              {sidebarEditing ? <><span className="sidebar-drag-handle" title="Arrastra con el ratón o mantén presionado para mover el grupo" draggable={isBusinessOwner && !(typeof window !== "undefined" && "ontouchstart" in window)} onTouchStart={(event) => startSidebarTouchDrag(event, { type: "group", id: group.id })} onDragStart={(event) => startSidebarMouseDrag(event, { type: "group", id: group.id })}>⠿</span><input aria-label="Nombre del grupo" value={group.title} maxLength={60} onChange={(event) => updateSidebarDraft((current) => current.map((candidate) => candidate.id === group.id ? { ...candidate, title: event.target.value } : candidate))} /></> : <>{isBusinessOwner && <span className="sidebar-reorder-grip" title="Arrastra con el ratón o mantén presionado para mover el grupo" draggable={!(typeof window !== "undefined" && "ontouchstart" in window)} onTouchStart={(event) => startSidebarTouchDrag(event, { type: "group", id: group.id })} onDragStart={(event) => startSidebarMouseDrag(event, { type: "group", id: group.id })}>⠿</span>}<p className="nav-label">{group.title}</p></>}
              {sidebarEditing && <button type="button" className="sidebar-mini-action danger-text" title="Eliminar grupo vacío" disabled={group.items.length > 0 || sidebarLayout.length < 2} onClick={() => updateSidebarDraft((current) => current.filter((candidate) => candidate.id !== group.id))}>×</button>}
            </div>}
            {group.items.filter((item) => item.id === "home" || item.id === "settings" ? (item.id === "settings" ? (isBusinessOwner || isPlatformAdmin) : true) : item.id === "suppliers" ? (isBusinessManager || canPermission("suppliers_view") || canViewPurchases) : canAccessScreen(item.screen)).map((item) => (
              <div key={item.id} data-sidebar-item-id={item.id} className="sidebar-nav-row"
                onDragOver={(event) => { if (isBusinessOwner) event.preventDefault(); }}
                onDrop={(event) => { if (!isBusinessOwner) return; event.preventDefault(); event.stopPropagation(); if (draggedSidebarItem?.id !== item.id) confirmSidebarDrop(draggedSidebarItem, group.id, item.id); }}>
                {sidebarEditing ? <>
                  <span className="sidebar-drag-handle" title="Arrastra con el ratón o mantén presionado para mover" draggable={isBusinessOwner && !(typeof window !== "undefined" && "ontouchstart" in window)} onTouchStart={(event) => startSidebarTouchDrag(event, { type: "item", id: item.id, groupId: group.id })} onDragStart={(event) => startSidebarMouseDrag(event, { type: "item", id: item.id, groupId: group.id })}>⠿</span>
                  <input className="sidebar-icon-edit" aria-label={"Icono de " + item.label} value={item.icon} maxLength={4} onChange={(event) => updateSidebarDraft((current) => current.map((candidate) => ({ ...candidate, items: candidate.items.map((entry) => entry.id === item.id ? { ...entry, icon: event.target.value } : entry) })))} />
                  <input className="sidebar-label-edit" aria-label={"Nombre de " + getSidebarItemLabel(item)} value={getSidebarItemLabel(item)} readOnly={item.id === "accounts" || item.screen === "accounts"} maxLength={60} onChange={(event) => updateSidebarDraft((current) => current.map((candidate) => ({ ...candidate, items: candidate.items.map((entry) => entry.id === item.id ? { ...entry, label: event.target.value } : entry) })))} />
                </> : <>{isBusinessOwner && <span className="sidebar-reorder-grip" title="Arrastra con el ratón o mantén presionado para mover" draggable={!(typeof window !== "undefined" && "ontouchstart" in window)} onTouchStart={(event) => startSidebarTouchDrag(event, { type: "item", id: item.id, groupId: group.id })} onDragStart={(event) => startSidebarMouseDrag(event, { type: "item", id: item.id, groupId: group.id })}>⠿</span>}<button className={(screen === item.screen ? "nav-item active" : "nav-item")} onClick={() => { if (sidebarSuppressClickRef.current) return; navigateSidebarItem(item); }}><span className="nav-icon"><AppIcon name={item.id} size={19} /></span><span className="nav-label-text">{getSidebarItemLabel(item)}</span></button></>}
              </div>
            ))}
          </section>)}
        </nav>
        <div className="sidebar-bottom"><div className="sidebar-bottom-actions"><a className="sidebar-contact-action" href="mailto:ricardowiswellgomez@gmail.com?subject=Soporte%20treseiscinco" title="Contacto" aria-label="Contacto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></a><button className="logout-button" onClick={signOut} disabled={busy}>Cerrar sesión</button></div></div>
      </aside>
      <section className={"main-content" + (screen === "home" ? " main-content-home" : "")}>
        <header className="main-header"><button type="button" className="mobile-nav-toggle" aria-expanded={mobileNavOpen} aria-controls="mobile-module-navigation" onClick={() => setMobileNavOpen((open) => !open)}><span aria-hidden="true">{mobileNavOpen ? "×" : "☷"}</span>{mobileNavOpen ? "Cerrar módulos" : "Módulos"}</button><div>{screen !== "home" && <p className="eyebrow">{screen === "products" ? "CATÁLOGO Y EXISTENCIAS" : screen === "sales" ? "ACTIVIDAD COMERCIAL" : screen === "quotes" ? "PROPUESTAS COMERCIALES" : screen === "accounts" ? "CUENTAS POR COBRAR Y PAGAR" : screen === "stats" ? "ESTADÍSTICAS Y BALANCE" : screen === "customers" ? "RELACIONES CON CLIENTES" : screen === "profitability" ? "RENTABILIDAD" : screen === "purchases" ? "COMPRAS Y GASTOS" : screen === "suppliers" ? "PROVEEDORES" : screen === "catalog" ? "CATÁLOGO" : screen === "team" ? "PERSONAL" : screen === "settings" ? "CONFIGURACIÓN" : "TU ESPACIO DE TRABAJO"}</p>}<h1>{screen === "products" ? "Productos" : screen === "settings" ? "Configuración" : screen === "suppliers" ? "Proveedores" : screen === "home" ? "Inicio" : areas.find((a) => a.screen === screen)?.title || "Tu negocio"}</h1></div>{businesses.length > 1 && <label className="mobile-business-switcher"><span>Negocio activo</span><select aria-label="Cambiar de negocio" value={activeBusiness?.id || ""} onChange={(event) => switchActiveBusiness(event.target.value)}>{businesses.map((business) => <option value={business.id} key={business.id}>{business.name} · {business.role === "owner" ? "Propietario" : business.role === "admin" ? "Administrador" : "Empleado"}</option>)}</select></label>}<span className="role-pill">{activeBusiness?.role === "owner" ? "Propietario" : activeBusiness?.role === "admin" ? "Administrador" : "Empleado"}</span></header>
        {mobileNavOpen && <nav id="mobile-module-navigation" className="mobile-module-navigation" aria-label="Módulos disponibles"><div className="mobile-module-menu-heading"><strong>Elegir módulo</strong><button type="button" className="mobile-module-menu-close" onClick={() => setMobileNavOpen(false)} aria-label="Cerrar menú de módulos">×</button></div><button type="button" className={"mobile-module-card"+(screen==="home"?" active":"")} onClick={()=>navigate("home")}><AppIcon name="home" size={23}/><span><strong>Inicio</strong><small>Panorama de tu negocio</small></span><b>›</b></button><button type="button" className={"mobile-module-card"+(screen==="sales"?" active":"")} onClick={()=>navigate("sales")}><AppIcon name="sales" size={23}/><span><strong>Ventas</strong><small>Registra ventas, abonos y saldos pendientes</small></span><b>›</b></button>{visibleAreas.filter((area)=>area.screen!=="sales").map((area)=><button type="button" key={area.screen} className={"mobile-module-card"+(screen===area.screen?" active":"")} onClick={()=>navigate(area.screen)}><AppIcon name={area.screen} size={23}/><span><strong>{area.title}</strong><small>{area.description}</small></span><b>›</b></button>)}{(isBusinessOwner || isPlatformAdmin) && <button type="button" className={"mobile-module-card"+(screen==="settings"?" active":"")} onClick={()=>navigate("settings")}><AppIcon name="settings" size={23}/><span><strong>Configuración</strong><small>Datos, horarios, pagos y apariencia</small></span><b>›</b></button>}</nav>}
        {error && <p className="message error" role="alert">{error}</p>}
        {notice && <p className="message success" role="status">{notice}<button className="dismiss-button" onClick={() => setNotice("")}>Cerrar</button></p>}
        {screen === "audit" ? (
<section className="audit-page">
  <div className="products-intro"><div><h2>Historial de cambios</h2><p>Cada fila responde quién hizo qué y cuándo. Los cambios se registran directamente desde la base de datos.</p></div></div>
  <div className="audit-toolbar panel">
    <div className="stats-period-buttons" role="group" aria-label="Periodo de auditoría">{[["day","Hoy"],["week","Semana"],["month","Mes"],["year","Año"],["custom","Rango"],["all","Todo"]].map(([value,label]) => <button type="button" key={value} className={auditPeriod === value ? "stats-period-button active" : "stats-period-button"} aria-pressed={auditPeriod === value} onClick={() => setAuditPeriod(value)}>{label}</button>)}</div>
    {auditPeriod === "custom" && <div className="stats-custom-dates"><label><span>Desde</span><input type="date" value={auditDateFrom} max={auditDateTo || todayInBogota()} onChange={(e) => setAuditDateFrom(e.target.value)} /></label><label><span>Hasta</span><input type="date" value={auditDateTo} min={auditDateFrom || undefined} max={todayInBogota()} onChange={(e) => setAuditDateTo(e.target.value)} /></label></div>}
    <p>{auditRows.length ? auditRows.length + " cambios cargados" : "Sin cambios para este periodo"}</p>
  </div>
  {auditLoading && !auditRows.length ? <div className="empty-state">Cargando auditorías…</div> : auditRows.length ? <div className="audit-list panel">
    <div className="audit-list-heading"><span>Usuario</span><span>Qué hizo</span><span>Fecha y hora</span></div>
    {auditRows.map((entry) => {
      const roleLabel = ({owner:"Propietario",admin:"Administrador",employee:"Empleado",sin_acceso_actual:"Ya no pertenece al equipo"})[entry.actor_role] || "Usuario";
      const typeLabel = ({sales:"venta",sale_items:"artículo de venta",sale_payments:"abono de venta",products:"producto",product_categories:"categoría",product_variants:"variante",product_images:"foto de producto",customers:"cliente",purchases:"compra",purchase_items:"artículo de compra",purchase_payments:"pago a proveedor",expenses:"gasto",suppliers:"proveedor",quotes:"cotización",quote_items:"artículo de cotización",stock_movements:"movimiento de inventario",business_coupons:"cupón",bank_accounts:"cuenta bancaria",bank_movements:"movimiento bancario",businesses:"configuración del negocio",business_members:"acceso del equipo"})[entry.entity_type] || String(entry.entity_type || "registro").replaceAll("_"," ");
      const label = entry.details?.label || typeLabel;
      const when = new Date(entry.created_at).toLocaleString("es-CO", {timeZone:"America/Bogota", dateStyle:"medium", timeStyle:"short"});
      const changes = Object.entries(entry.details?.changes || {}).filter(([key]) => key !== "registro");
      const formatAuditValue = (value, key) => {
        if (value === null || value === undefined || value === "") return "vacío";
        if (typeof value === "boolean") return value ? "Sí" : "No";
        if (key === "status") return ({draft:"Borrador",open:"Pendiente",paid:"Pagado",partially_paid:"Abono parcial",cancelled:"Cancelado",canceled:"Cancelado",active:"Activo",inactive:"Inactivo"})[String(value)] || String(value).replaceAll("_"," ");
        if (key.endsWith("_minor") && Number.isFinite(Number(value))) return money(Number(value), currencyCode);
        if (["quantity","stock_on_hand"].includes(key) && Number.isFinite(Number(value))) return Number(value).toLocaleString("es-CO");
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
      };
      return <article className="audit-row" key={entry.id}>
        <div className="audit-actor"><div className="audit-actor-heading"><strong>{entry.actor_name || "Usuario desconocido"}</strong><span className={"audit-role " + (entry.actor_role === "owner" ? "owner" : entry.actor_role === "employee" ? "employee" : "")}>{roleLabel}</span></div><span>{entry.actor_email || "Correo no disponible"}</span></div>
        <div className="audit-action"><strong>{entry.action} {typeLabel}: {label}</strong>{entry.action === "Actualizó" && changes.length > 0 && <details><summary>Ver {changes.length} {changes.length === 1 ? "cambio" : "cambios"}</summary><ul>{changes.map(([key, values]) => <li key={key}><span>{({status:"Estado",total_minor:"Total",amount_paid_minor:"Abonado",sale_price_minor:"Precio de venta",cost_price_minor:"Costo",stock_on_hand:"Existencias",name:"Nombre",bank_name:"Entidad bancaria",account_name:"Nombre de la cuenta",account_type:"Tipo de cuenta",account_last4:"Últimos cuatro dígitos",opening_balance_minor:"Saldo inicial",opening_balance_date:"Fecha del saldo inicial",bank_account_id:"Cuenta bancaria",movement_type:"Tipo de movimiento",amount_minor:"Importe",movement_date:"Fecha del movimiento",counterparty:"Persona o empresa",reference:"Referencia",description:"Descripción",quantity:"Cantidad",notes:"Notas",is_sellable:"Se puede vender",archived_at:"Archivado"})[key] || key.replaceAll("_"," ")}</span>: <code>{formatAuditValue(values?.antes, key)} → {formatAuditValue(values?.despues, key)}</code></li>)}</ul></details>}</div>
        <time dateTime={entry.created_at}>{when}</time>
      </article>;
    })}
    {auditHasMore && <div className="audit-load-more"><button type="button" className="secondary-button" disabled={auditLoading} onClick={() => loadAuditEntries(false)}>{auditLoading ? "Cargando…" : "Cargar cambios anteriores"}</button></div>}
  </div> : <div className="empty-state"><span className="empty-icon">◷</span><h3>No hay cambios registrados en este periodo</h3><p>Los cambios hechos desde que se activó la auditoría aparecerán aquí con usuario, rol y hora.</p></div>}
</section>
) : screen === "sales" ? (
<section className="sales-page">
<div className="products-intro"><div><h2>Movimientos de ventas</h2><p>Identifica qué se vendió, quién lo registró y en qué momento.</p></div>{canManageSales && <button type="button" className="primary-button compact-button" onClick={() => { if(showSaleForm) clearSaleDraft(); else {setShowSaleForm(true);setError("");setNotice("");} }}>{showSaleForm?"Cancelar venta":"+ Nueva venta"}</button>}</div>
<section className="cash-register-panel panel">
  <div className="cash-register-heading"><div><span className="eyebrow">CONTROL DE TURNO</span><div className="cash-register-title-row"><h3>{cashRegisterSession ? "Tu caja está abierta" : "Apertura y cierre de caja"}</h3><FieldHelp enabled={contextualHelpEnabled} text="Abre tu caja antes de empezar el turno y registra el cierre al terminar. Así puedes comparar el efectivo esperado con el contado." /></div><p>{cashRegisterSession ? "Abierta el " + new Date(cashRegisterSession.opened_at).toLocaleString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium",timeStyle:"short"}) : "Cada trabajador puede abrir su caja, registrar operaciones y cerrarla al terminar."}</p></div><span className={"status-pill "+(cashRegisterSession?"status-active":"status-inactive")}>{cashRegisterLoading?"Consultando…":cashRegisterSession?"Abierta":"Cerrada"}</span></div>
  {canManageSales && !cashRegisterSession && <form className="cash-register-form" onSubmit={openCashRegister}><label><span className="field-label-heading">Efectivo inicial<FieldHelp enabled={contextualHelpEnabled} text="Anota cuánto efectivo físico hay en la caja al comenzar. No es una venta ni un ingreso nuevo del negocio." /></span><input type="number" min="0" step={currencyDigits(currencyCode)===0?"1":"0.01"} value={cashRegisterOpenAmount} onChange={(event)=>setCashRegisterOpenAmount(event.target.value)} required /></label><button type="submit" className="primary-button" disabled={cashRegisterSaving||cashRegisterLoading}>{cashRegisterSaving?"Abriendo…":"Abrir mi caja"}</button></form>}
  {cashRegisterSession && <form className="cash-register-form cash-register-close-form" onSubmit={closeCashRegister}><label><span className="field-label-heading">Efectivo contado al cierre<FieldHelp enabled={contextualHelpEnabled} text="Introduce la suma real de billetes y monedas que hay en la caja al terminar el turno. Se comparará con el efectivo esperado." /></span><input type="number" min="0" step={currencyDigits(currencyCode)===0?"1":"0.01"} value={cashRegisterCloseAmount} onChange={(event)=>setCashRegisterCloseAmount(event.target.value)} required placeholder="Total de efectivo en caja" /></label><label><span className="field-label-heading">Notas del turno<FieldHelp enabled={contextualHelpEnabled} text="Deja constancia de diferencias de efectivo, gastos pendientes, novedades o a quién entregas la caja." /></span><input value={cashRegisterCloseNotes} onChange={(event)=>setCashRegisterCloseNotes(event.target.value)} maxLength={500} placeholder="Diferencias, novedades o entrega de turno" /></label><button type="submit" className="primary-button" disabled={cashRegisterSaving}>{cashRegisterSaving?"Cerrando…":"Cerrar caja"}</button></form>}
  {cashRegisterSummary.count>0 && <p className="cash-register-summary">Último cierre: recibido en efectivo {money(cashRegisterSummary.received,currencyCode)} · salidas en efectivo {money(cashRegisterSummary.expenses,currencyCode)} · esperado {money(cashRegisterSummary.expected,currencyCode)}.</p>}
</section>
<div className="sales-date-toolbar panel"><div className="stats-period-buttons" role="group" aria-label="Periodo de ventas">{[["day","Hoy"],["date","Fecha"],["week","Semana"],["month","Mes"],["year","Año"],["custom","Rango"],["all","Todo"]].map(([value,label]) => <button type="button" key={value} className={salesPeriod === value ? "stats-period-button active" : "stats-period-button"} aria-pressed={salesPeriod === value} onClick={() => {if(value==="date"&&salesPeriod!=="date")setSalesSelectedDate(todayInBogota());setSalesPeriod(value);setSalesPage(1);}}>{label}</button>)}</div>{salesPeriod === "date" && <div className="sales-single-date"><button type="button" className="secondary-button" aria-label="Día anterior" onClick={() => {const d=new Date(salesSelectedDate+"T12:00:00Z");d.setUTCDate(d.getUTCDate()-1);setSalesSelectedDate(d.toISOString().slice(0,10));setSalesPage(1);}}>← Anterior</button><label><span>Ver movimientos del día</span><input type="date" value={salesSelectedDate} max={todayInBogota()} onChange={(e)=>{setSalesSelectedDate(e.target.value);setSalesPage(1);}} /></label><button type="button" className="secondary-button" aria-label="Día siguiente" disabled={salesSelectedDate>=todayInBogota()} onClick={() => {const d=new Date(salesSelectedDate+"T12:00:00Z");d.setUTCDate(d.getUTCDate()+1);setSalesSelectedDate(d.toISOString().slice(0,10));setSalesPage(1);}}>Siguiente →</button></div>}{salesPeriod === "custom" && <div className="stats-custom-dates"><label><span>Desde</span><input type="date" value={salesDateFrom} max={salesDateTo || todayInBogota()} onChange={(e) => {setSalesDateFrom(e.target.value);setSalesPage(1);}} /></label><label><span>Hasta</span><input type="date" value={salesDateTo} min={salesDateFrom || undefined} max={todayInBogota()} onChange={(e) => {setSalesDateTo(e.target.value);setSalesPage(1);}} /></label></div>}<p>{salesPeriod === "day" ? "Ventas de hoy" : salesPeriod === "date" ? "Movimientos del " + new Date(salesSelectedDate+"T12:00:00Z").toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"long"}) : salesPeriod === "all" ? "Todo el historial" : salesPeriod === "custom" ? "Del " + salesDateFrom + " al " + salesDateTo : salesPeriod === "week" ? "Desde el lunes de esta semana" : salesPeriod === "month" ? "Desde el primer día del mes" : "Desde el primer día del año"}</p></div>
{canManageSales && showSaleForm && <form className="sale-form panel" onSubmit={createSale}>
<h3>Nueva venta</h3>
<div className="sale-date-row">
  <label><span className="field-label-heading">Fecha de la venta</span><input type="date" value={saleDate} max={todayInBogota()} onChange={(event) => setSaleDate(event.target.value)} required /></label>
</div>
<div className="sale-builder">
  <div className="sale-builder-related-field">
    <span className="field-label-heading">Cliente<FieldHelp enabled={contextualHelpEnabled} text="Relaciona la venta con un cliente registrado. Déjalo vacío si es una venta sin cliente." /></span>
    <div className="sale-builder-control-line">
      <select aria-label="Cliente" value={saleCustomerId} onChange={e=>{const customerId=e.target.value;if(customerId==="__add_customer__"){setShowQuickCustomerForm(true);setError("");return;}setSaleCustomerId(customerId);setSaleAdvisorName(customers.find(customer=>customer.id===customerId)?.advisor_name||"");}}>
        <option value="">Venta sin cliente</option>
        {customers.map(customer=><option key={customer.id} value={customer.id}>{customer.full_name}{customer.company_name&&customer.company_name!==customer.full_name?" · "+customer.company_name:""}</option>)}
         {canManageCustomers && <option value="__add_customer__">＋ Agregar</option>}
      </select>
      
    </div>
  </div>
  <label className="sale-builder-related-field"><span className="field-label-heading">Asesora habitual (opcional)<FieldHelp enabled={contextualHelpEnabled} text="Se completa con la asesora habitual de la ficha del cliente. Puedes cambiarla para esta venta." /></span><input value={saleAdvisorName} onChange={event=>setSaleAdvisorName(event.target.value)} maxLength={160} placeholder="Nombre de la asesora (opcional)" /></label>
  <div className="sale-builder-related-field">
    <span className="field-label-heading">Producto<FieldHelp enabled={contextualHelpEnabled} text="Elige el producto que vas a vender. Se usará su precio actual y se comprobarán las existencias disponibles." /></span>
    <div className="sale-builder-control-line">
      <select aria-label="Producto" value={saleProductChoice} onChange={async e=>{const id=e.target.value;setSaleProductChoice(id);setSaleVariantChoice("");if(!id)return;setSaleVariantsLoading(true);try{await loadProductVariants(id);}catch(error){setError(friendlyError(error));}finally{setSaleVariantsLoading(false);}}}>
        <option value="">Elige un producto…</option>
        {saleProducts.map(product=><option key={product.id} value={product.id}>{product.name} · {money(product.sale_price_minor,currencyCode)}{product.track_inventory?" · Stock "+Number(product.stock_on_hand).toLocaleString("es-CO"):""}</option>)}
      </select>
      {canManageProducts && <button type="button" className="sale-builder-inline-button" title="Crear artículo" aria-label="Crear artículo" onClick={() => setShowQuickSaleProductForm((open) => !open)}><AppIcon name="plus" size={16}/></button>}
    </div>
  </div>
  {saleProductChoice && (((variantsByProduct[saleProductChoice] || []).some((variant) => variant.is_active)) || saleProducts.find((product) => product.id === saleProductChoice)?.metadata?.has_variants) && <label className="sale-variant-select"><span className="field-label-heading">Combinación / variante *</span><select value={saleVariantChoice} onChange={(event) => setSaleVariantChoice(event.target.value)} required><option value="">{saleVariantsLoading ? "Cargando variantes…" : "Elige color, talla u opción…"}</option>{(variantsByProduct[saleProductChoice] || []).filter((variant) => variant.is_active).map((variant) => <option key={variant.id} value={variant.id}>{variantDisplayLabel(variant)} · {variant.stock_on_hand == null ? "Stock sin configurar" : "Stock " + Number(variant.stock_on_hand).toLocaleString("es-CO")}{variant.sale_price_minor != null ? " · " + money(variant.sale_price_minor, currencyCode) : ""}{variant.sku ? " · " + variant.sku : ""}</option>)}</select>{!saleVariantsLoading && !(variantsByProduct[saleProductChoice] || []).some((variant) => variant.is_active) && <small>No hay combinaciones activas. Revisa el editor de variantes de este producto.</small>}</label>}
  <label><span className="field-label-heading">Cantidad</span><input type="number" min="0.001" step="0.001" value={saleQuantity} onChange={e=>setSaleQuantity(e.target.value)}/></label>
  <button type="button" className="secondary-button sale-add-button" onClick={addSaleLine}>+ Agregar</button>
</div>
{showQuickSaleProductForm && canManageProducts && <div className="panel quick-customer-form quick-sale-product-form" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}>
  <strong>Nuevo artículo</strong><p className="inline-create-hint">Se creará y quedará seleccionado en esta venta. El registro completo lo puedes ampliar después desde Productos.</p>
  <div className="sale-builder quick-product-fields">
    <label><span className="field-label-heading">Nombre *</span><input value={quickSaleProductName} onChange={(event) => setQuickSaleProductName(event.target.value)} maxLength={160} /></label><label><span className="field-label-heading">Código del artículo</span><select value={quickSaleProductSkuMode} onChange={(event) => setQuickSaleProductSkuMode(event.target.value)}><option value="auto">Generarlo automáticamente</option><option value="manual">Lo escribiré yo</option></select><input value={quickSaleProductSku} onChange={(event) => setQuickSaleProductSku(event.target.value)} disabled={quickSaleProductSkuMode === "auto"} required={quickSaleProductSkuMode === "manual"} maxLength={100} placeholder={quickSaleProductSkuMode === "auto" ? "Se asigna al guardar" : "Ej. SKU-001"} /></label>
    <div className="quick-product-category-field"><label><span className="field-label-heading">Categoría</span><select value={quickSaleProductCategoryId} onChange={(event) => { if (event.target.value === "__create_sale_category__") { setShowQuickSaleCategoryForm(true); return; } setQuickSaleProductCategoryId(event.target.value); }}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}<option value="__create_sale_category__">＋ Nueva categoría…</option></select></label>{showQuickSaleCategoryForm && <div className="inline-create-panel" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}><label><span>Nombre de la nueva categoría</span><input value={quickSaleCategoryName} onChange={(event) => setQuickSaleCategoryName(event.target.value)} maxLength={80} placeholder="Ej. Accesorios, insumos…" /></label><div className="inline-create-actions"><button type="button" className="primary-button" disabled={quickSaleCategorySaving || !quickSaleCategoryName.trim()} onClick={addQuickSaleCategory}>{quickSaleCategorySaving ? "Guardando…" : "Crear y seleccionar"}</button><button type="button" className="text-button" onClick={() => { setShowQuickSaleCategoryForm(false); setQuickSaleCategoryName(""); }}>Cancelar</button></div></div>}</div>
    <label><span className="field-label-heading">Tipo</span><select value={quickSaleProductType} onChange={(event) => setQuickSaleProductType(event.target.value)}><option value="physical">Producto físico</option><option value="service">Servicio</option><option value="digital">Digital</option></select></label>
    <label><span className="field-label-heading">Precio de venta *</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={quickSaleProductPrice} onChange={(event) => setQuickSaleProductPrice(event.target.value)} /></label>
    <label><span className="field-label-heading">Costo por unidad *</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={quickSaleProductCost} onChange={(event) => setQuickSaleProductCost(event.target.value)} /></label>
    {quickSaleProductType === "physical" && <label><span className="field-label-heading">Existencias iniciales</span><input type="number" min="0" step="0.001" value={quickSaleProductStock} onChange={(event) => setQuickSaleProductStock(event.target.value)} /></label>}
    <button type="button" className="primary-button" disabled={quickSaleProductSaving || !quickSaleProductName.trim() || quickSaleProductPrice === "" || quickSaleProductCost === ""} onClick={addQuickSaleProduct}>{quickSaleProductSaving ? "Guardando…" : "Crear y seleccionar"}</button>
  </div>
</div>}
{showQuickCustomerForm && canManageCustomers && <div className="panel quick-customer-form" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}>
  <strong>Nuevo cliente</strong><p className="inline-create-hint">Se agregará a la venta actual sin cerrar este formulario.</p>
  <div className="sale-builder">
    <label><span className="field-label-heading">Nombre o empresa *</span><input value={quickCustomerName} onChange={e=>setQuickCustomerName(e.target.value)} required maxLength={200} autoComplete="name" /></label>
    <label><span className="field-label-heading">Teléfono</span><input value={quickCustomerPhone} onChange={e=>setQuickCustomerPhone(e.target.value)} maxLength={40} autoComplete="tel" /></label>
    <label><span className="field-label-heading">Nombre o razón social</span><input value={quickCustomerCompany} onChange={(e) => setQuickCustomerCompany(e.target.value)} maxLength={200} /></label>
    <label><span className="field-label-heading">Correo</span><input type="email" value={quickCustomerEmail} onChange={e=>setQuickCustomerEmail(e.target.value)} maxLength={254} autoComplete="email" /></label>
    <label><span className="field-label-heading">WhatsApp</span><input type="tel" value={quickCustomerWhatsapp} onChange={(e) => setQuickCustomerWhatsapp(e.target.value)} maxLength={40} /></label>
    <label><span className="field-label-heading">Tipo de documento</span><select value={quickCustomerDocumentType} onChange={(e) => setQuickCustomerDocumentType(e.target.value)}><option value="">Sin especificar</option><option value="CC">Cédula de ciudadanía</option><option value="NIT">NIT</option><option value="CE">Cédula de extranjería</option><option value="TI">Tarjeta de identidad</option><option value="PP">Pasaporte</option><option value="OTHER">Otro</option></select></label>
    <label><span className="field-label-heading">Número de documento</span><input value={quickCustomerDocumentNumber} onChange={(e) => setQuickCustomerDocumentNumber(e.target.value)} maxLength={80} /></label>
    <label><span className="field-label-heading">Ciudad</span><input value={quickCustomerCity} onChange={(e) => setQuickCustomerCity(e.target.value)} maxLength={100} /></label>
    <label><span className="field-label-heading">Dirección</span><input value={quickCustomerAddress} onChange={(e) => setQuickCustomerAddress(e.target.value)} maxLength={300} /></label>
    <div className="inline-create-actions"><button type="button" className="secondary-button" onClick={()=>setShowQuickCustomerForm(false)}>Cancelar</button><button type="button" className="primary-button" disabled={quickCustomerSaving || !quickCustomerName.trim()} onClick={addQuickCustomer}>{quickCustomerSaving?"Guardando…":"Guardar y seleccionar"}</button></div>
  </div>
</div>}
{!saleProducts.length&&<p className="helper-text">No hay productos activos disponibles para vender. Registra o activa un producto primero.</p>}
{saleItems.length>0&&<div className="sale-cart"><div className="sale-cart-heading"><strong>Artículos de la venta</strong><span>{saleItems.length} productos</span></div>
{saleItems.map(item=><div className="sale-cart-row" key={item.line_key || item.product_id}><div className="sale-cart-name"><strong>{item.name}</strong><span>{money(item.unit_price_minor,currencyCode)} por {item.unit_name}{item.variant_id ? " · Código " + (item.sku || "sin código") : ""}</span></div><label><span className="field-label-heading">Cantidad<FieldHelp enabled={contextualHelpEnabled} text="Ajusta las unidades de esta línea de venta; el total se recalcula automáticamente." /></span><input type="number" min="0.001" step="0.001" value={item.quantity} onChange={e=>setSaleItems(current=>current.map(line=>(line.line_key || line.product_id)===(item.line_key || item.product_id)?{...line,quantity:e.target.value}:line))}/></label><strong className="sale-line-total">{money(Math.round(item.unit_price_minor*Number(item.quantity||0)),currencyCode)}</strong><button type="button" className="text-button danger-text" onClick={()=>setSaleItems(current=>current.filter(line=>(line.line_key || line.product_id)!==(item.line_key || item.product_id)))}>Quitar</button></div>)}
<div className="sale-tax-summary"><span>Base de productos</span><strong>{money(saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).subtotal,0),currencyCode)}</strong></div>{saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).tax,0)>0&&<div className="sale-tax-summary"><span>Impuestos</span><strong>{money(saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).tax,0),currencyCode)}</strong></div>}<div className="sale-total-line"><span>Total con impuestos</span><strong>{money(saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).total,0),currencyCode)}</strong></div></div>}
<div className="sale-bottom-fields">
<label><span className="field-label-heading">Abono recibido<FieldHelp enabled={contextualHelpEnabled} text="Dinero que el cliente entrega ahora como parte de esta venta. Si es menor que el total, quedará un saldo pendiente." /></span><input type="number" min="0" step={currencyDigits(currencyCode)===0?"1":"0.01"} value={salePayment} onChange={e=>setSalePayment(e.target.value)} placeholder="0" /></label>
<div className="sale-payment-method-field"><span className="field-label-heading">Medio de pago inicial<FieldHelp enabled={contextualHelpEnabled} text="Selecciona cómo recibiste el dinero de esta venta. Esta selección registra el medio, pero no procesa el pago." /></span><PaymentMethodTiles value={saleInitialPaymentMethod} ariaLabel="Medio de pago inicial" onChange={(method) => { setSaleInitialPaymentMethod(method); if (method !== "Efectivo") setSaleCashTendered(""); else setSaleInitialBankAccountId(""); }} /></div>
{saleInitialPaymentMethod !== "Efectivo" && Number(salePayment || 0) > 0 && visibleBankAccountOptions.length > 0 && <label className="bank-linked-account-field"><span>Depositar el abono en</span><select value={saleInitialBankAccountId} onChange={(e) => setSaleInitialBankAccountId(e.target.value)}><option value="">No asociar a una cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>}
{saleInitialPaymentMethod === "Efectivo" && <label className="cash-tendered-field"><span className="field-label-heading">Efectivo recibido (opcional)<FieldHelp enabled={contextualHelpEnabled} text="Escribe el billete o total entregado por el cliente. Si supera el saldo de la venta, calculamos la devuelta y registramos solo el importe de la venta." /></span><input type="number" min="0" step={currencyDigits(currencyCode)===0?"1":"0.01"} value={saleCashTendered} onChange={event=>setSaleCashTendered(event.target.value)} placeholder="Ej. 20000" />{String(saleCashTendered).trim()!=="" && saleItems.length > 0 && <small className="cash-change-preview">Efectivo introducido · Abono a registrar: {money(Math.min(toMinorUnits(saleCashTendered,currencyCode),saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).total,0)),currencyCode)} · Devuelta: {money(Math.max(0,toMinorUnits(saleCashTendered,currencyCode)-saleItems.reduce((sum,item)=>sum+productTaxAmounts(item.unit_price_minor,item.quantity,item.tax_code||"none",normalizeTaxProfile(activeBusiness.settings?.tax_profile||settingsTaxProfile).pricesIncludeVat).total,0)),currencyCode)}</small>}</label>}
<label><span className="field-label-heading">Nota<FieldHelp enabled={contextualHelpEnabled} text="Anota un detalle breve para recordar una entrega, un acuerdo o una referencia de la venta." /></span><input value={saleNotes} onChange={e=>setSaleNotes(e.target.value)} maxLength={1000} placeholder="Ej. entrega el viernes"/></label></div>
<p className="helper-text">Se usará el precio actual. La venta y la salida de inventario se guardan juntas; si no hay unidades suficientes, no se guardará.</p>
{!saleItems.length && <p className="helper-text sale-empty-cart-hint">Todavía no hay productos agregados. Elige un producto y pulsa «+ Agregar». Si intentas guardar antes, te indicaremos qué falta.</p>}
<div className="form-actions"><button type="button" className="secondary-button" onClick={clearSaleDraft}>Cancelar</button><button type="submit" className="primary-button" disabled={saleSaving}>{saleSaving?"Guardando…":"Guardar venta"}</button></div>
</form>}
<div className="sales-toolbar"><span>{salesCount} {salesCount===1?"venta":"ventas"} · Página {salesPage} de {Math.max(1,Math.ceil(salesCount/salesPageSize))}</span><label className="sales-page-size"><span className="field-label-heading">Mostrar</span><select value={salesPageSize} onChange={(e)=>{setSalesPageSize(Number(e.target.value));setSalesPage(1);}}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select></label></div>
{salesLoading?<div className="empty-state">Cargando ventas…</div>:salesData.length?<div className="sales-list">{salesData.map(sale=><article className="sale-record panel mobile-detail-trigger" key={sale.id} onClick={(event) => { if (event.target.closest("button,a,input,select,textarea,[data-stop-record-open]")) return; setSelectedRecordDetail({type:"Venta",title:sale.sale_number || "Venta",fields:[{label:"Cliente",value:sale.customer_name},{label:"Asesora habitual",value:sale.advisor_name||"Sin asignar"},{label:"Fecha",value:new Date(sale.sold_at||sale.created_at).toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short"})},{label:"Estado",value:saleStatusLabel(sale.status)},{label:"Total",value:money(sale.total_minor,sale.currency_code||currencyCode)},{label:"Abonado",value:money(sale.amount_paid_minor,sale.currency_code||currencyCode)},{label:"Pendiente",value:money(Math.max(0,Number(sale.total_minor)-Number(sale.amount_paid_minor)),sale.currency_code||currencyCode)},{label:"Artículos",value:(sale.items||[]).map(item=>item.item_name+" × "+Number(item.quantity).toLocaleString("es-CO")+" — "+money(item.line_total_minor,sale.currency_code||currencyCode)).join("\n")||"Sin artículos"},{label:"Historial de abonos",value:(sale.payments||[]).map(p=>money(p.amount_minor,sale.currency_code||currencyCode)+" · "+p.payment_method+" · "+new Date(p.paid_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})+(p.notes?" · "+p.notes:"")).join("\n")||"Sin abonos"}],notes:sale.notes}); }}>
<div className="sale-record-top"><div><strong>{sale.sale_number}</strong><span>{new Date(sale.sold_at||sale.created_at).toLocaleString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium",timeStyle:"short"})}</span><small>Registró: {sale.seller_name||"Usuario del negocio"}</small></div><span className={"status-pill "+(sale.status==="paid"?"status-active":sale.status==="canceled"||sale.status==="refunded"?"status-inactive":"status-unpublished")}>{saleStatusLabel(sale.status)}</span></div>
<div className="sale-record-customer">{sale.customer_name}{sale.advisor_name&&<span className="sale-advisor-name">Atendió: {sale.advisor_name}</span>}</div>

<div className="sale-record-bottom"><div><span>Total</span><strong>{money(sale.total_minor,sale.currency_code||currencyCode)}</strong></div><div><span>Abonado</span><strong>{money(sale.amount_paid_minor,sale.currency_code||currencyCode)}</strong></div><div><span>Pendiente</span><strong>{money(Math.max(0,Number(sale.total_minor)-Number(sale.amount_paid_minor)),sale.currency_code||currencyCode)}</strong></div></div>
<div className="sale-record-disclosure-bar">
  <span>{(sale.items||[]).length} {(sale.items||[]).length===1?"artículo":"artículos"} · {(sale.payments||[]).length} {(sale.payments||[]).length===1?"abono":"abonos"}</span>
  <button type="button" className="text-button" aria-expanded={expandedSaleId===sale.id} onClick={() => setExpandedSaleId((current) => current === sale.id ? null : sale.id)}>{expandedSaleId===sale.id ? "Ocultar detalles" : "Ver detalles y abonos"}</button>
</div>
<div className="sale-record-details" hidden={expandedSaleId!==sale.id}>
  {sale.items.length>0&&<div className="sale-record-items">{sale.items.map(item=><div key={item.id}><span>{item.item_name} × {Number(item.quantity).toLocaleString("es-CO")}</span><strong>{money(item.line_total_minor,sale.currency_code||currencyCode)}</strong></div>)}</div>}

{canPermission("sales_view") && <div className="quote-share-actions sale-document-actions"><button type="button" className="secondary-button action-small" onClick={() => printSaleDocument(sale)}>Factura / PDF / Imprimir</button><button type="button" className="primary-button action-small" onClick={() => shareSaleImage(sale)}>Compartir imagen</button></div>}
<div className="sale-payment-history"><div className="sale-payment-history-heading"><strong>Historial de abonos</strong><span>{(sale.payments||[]).length} {(sale.payments||[]).length===1?"pago":"pagos"}</span></div>
{(sale.payments||[]).length ? <div className="sale-payment-list">{sale.payments.map((paymentRow)=><div className="sale-payment-row" key={paymentRow.id}><div><strong>{money(paymentRow.amount_minor,sale.currency_code||currencyCode)}</strong><span>{paymentRow.payment_method} · {new Date(paymentRow.paid_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})}</span>{paymentRow.notes&&<small>{paymentRow.notes}</small>}</div></div>)}</div> : <p className="sale-payment-empty">No hay abonos registrados.</p>}
{canManageSales && Math.max(0,Number(sale.total_minor)-Number(sale.amount_paid_minor))>0 && !["canceled","refunded","draft"].includes(sale.status) && <button type="button" className="secondary-button sale-register-payment-button" onClick={()=>salePaymentFormFor===sale.id?setSalePaymentFormFor(null):openSalePaymentForm(sale)}>{salePaymentFormFor===sale.id?"Cancelar":"＋ Registrar abono"}</button>}
{canManageSales && salePaymentFormFor===sale.id && <form className="sale-payment-form" onSubmit={(event)=>registerSalePayment(event,sale)}>
<label><span className="field-label-heading">Valor del abono<FieldHelp enabled={contextualHelpEnabled} text="Monto del pago adicional. No puede superar el saldo pendiente de la venta." /></span><input type="number" min="0.01" max={Math.max(0,Number(sale.total_minor)-Number(sale.amount_paid_minor))/(10**currencyDigits(currencyCode))} step={currencyDigits(currencyCode)===0?"1":"0.01"} value={salePaymentAmount} onChange={e=>setSalePaymentAmount(e.target.value)} required/></label>
<div className="payment-method-field"><span className="field-label-heading">Forma de pago<FieldHelp enabled={contextualHelpEnabled} text="Selecciona el medio por el cual se recibió este abono." /></span><PaymentMethodTiles value={salePaymentMethod} onChange={(method) => { setSalePaymentMethod(method); if (method === "Efectivo") setSalePaymentBankAccountId(""); }} ariaLabel="Medio de pago del abono de venta" /></div>
{salePaymentMethod !== "Efectivo" && visibleBankAccountOptions.length > 0 && <label className="bank-linked-account-field"><span>Depositar en</span><select value={salePaymentBankAccountId} onChange={(e) => setSalePaymentBankAccountId(e.target.value)}><option value="">No asociar a una cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>}
<label><span className="field-label-heading">Fecha del abono<FieldHelp enabled={contextualHelpEnabled} text="Fecha en que recibiste realmente el dinero; se guarda en el historial de pagos." /></span><input type="date" max={todayInBogota()} value={salePaymentDate} onChange={e=>setSalePaymentDate(e.target.value)} required/></label>
<label className="sale-payment-notes"><span className="field-label-heading">Nota<FieldHelp enabled={contextualHelpEnabled} text="Referencia corta para identificar el pago, por ejemplo el número de una transferencia." /></span><input value={salePaymentNotes} onChange={e=>setSalePaymentNotes(e.target.value)} maxLength={1000} placeholder="Referencia o detalle del pago"/></label>
<div className="form-actions"><button type="button" className="secondary-button" onClick={()=>setSalePaymentFormFor(null)}>Cancelar</button><button type="submit" className="primary-button" disabled={salePaymentSaving}>{salePaymentSaving?"Registrando…":"Guardar abono"}</button></div>
</form>}
</div>
{sale.notes&&<p className="sale-record-note">{sale.notes}</p>}
</div></article>)}</div>:<div className="empty-state"><span className="empty-icon">↗</span><h3>No hay ventas en este periodo</h3><p>Prueba otra fecha o elige «Todo» para consultar el historial completo. No mostramos ventas de ejemplo.</p>{canManageSales && <button className="primary-button" onClick={()=>{setShowSaleForm(true);setError("");}}>+ Registrar primera venta</button>}</div>}
{!salesLoading && salesCount > salesPageSize && <div className="pagination-bar sales-pagination"><span className="count-label">Mostrando {(salesPage-1)*salesPageSize+1}–{Math.min(salesPage*salesPageSize,salesCount)} de {salesCount}</span><div className="pagination-controls"><button type="button" className="secondary-button" disabled={salesPage<=1} onClick={()=>setSalesPage((page)=>Math.max(1,page-1))}>Anterior</button><span className="page-label">{salesPage} / {Math.ceil(salesCount/salesPageSize)}</span><button type="button" className="secondary-button" disabled={salesPage>=Math.ceil(salesCount/salesPageSize)} onClick={()=>setSalesPage((page)=>page+1)}>Siguiente</button></div></div>}
</section>
) : screen === "customers" ? (
<section className="customers-page">
<div className="products-intro"><div><h2>Tu cartera de clientes</h2><p>Guarda los datos de las personas y empresas que te compran para encontrarlas y asociarlas fácilmente a una venta.</p></div>{canManageCustomers && <button type="button" className="primary-button compact-button" onClick={()=>{if(showCustomerForm)resetCustomerForm();else{setCustomerDraft(blankCustomer);setEditingCustomerId(null);setShowCustomerForm(true);setError("");setNotice("");}}}>{showCustomerForm?"Cancelar":"+ Nuevo cliente"}</button>}</div>
<div className="customer-toolbar"><label className="search-box"><span className="field-label-heading"><span>⌕</span></span><input value={customerSearch} onChange={e=>{setCustomerSearch(e.target.value);setCustomersPage(1);}} placeholder="Buscar por nombre, empresa, documento o contacto…"/></label><span className="count-label">{customersCount} {customersCount===1?"cliente":"clientes"}</span></div>
{canManageCustomers && showCustomerForm&&<form className="customer-form panel" onSubmit={addCustomer}>
<div className="customer-form-heading"><div><p className="eyebrow">{editingCustomerId?"DATOS DEL CLIENTE":"NUEVO REGISTRO"}</p><h3>{editingCustomerId?"Editar cliente":"Nuevo cliente"}</h3></div><span className="customer-form-hint">Persona o empresa</span></div>
<div className="customer-form-grid">
<label><span className="field-label-heading">Nombre{!customerDraft.company_name.trim()?" *":""}</span><input autoComplete="given-name" value={customerDraft.first_name} onChange={e=>setCustomerDraft(current=>({...current,first_name:e.target.value}))} maxLength={100} required={!customerDraft.company_name.trim()} placeholder="Nombre"/></label>
<label><span className="field-label-heading">Apellidos</span><input autoComplete="family-name" value={customerDraft.last_name} onChange={e=>setCustomerDraft(current=>({...current,last_name:e.target.value}))} maxLength={120} placeholder="Apellidos"/></label>
<label><span className="field-label-heading">Empresa{!customerDraft.first_name.trim()&&!customerDraft.last_name.trim()?" *":""}</span><input autoComplete="organization" value={customerDraft.company_name} onChange={e=>setCustomerDraft(current=>({...current,company_name:e.target.value}))} maxLength={180} required={!customerDraft.first_name.trim()&&!customerDraft.last_name.trim()} placeholder="Nombre de la empresa"/></label>
<label><span className="field-label-heading">Asesora habitual (opcional)<FieldHelp enabled={contextualHelpEnabled} text="Asigna la asesora de la que normalmente proviene esta clienta. Podrás cambiarla para cada venta." /></span><input value={customerDraft.advisor_name} onChange={e=>setCustomerDraft(current=>({...current,advisor_name:e.target.value}))} maxLength={160} placeholder="Nombre de la asesora"/></label>
<label><span className="field-label-heading">Tipo de documento</span><select value={customerDraft.document_type} onChange={e=>setCustomerDraft(current=>({...current,document_type:e.target.value}))}><option value="">Selecciona el tipo…</option><option value="CC">Cédula de ciudadanía (CC)</option><option value="CE">Cédula de extranjería (CE)</option><option value="NIT">NIT</option><option value="TI">Tarjeta de identidad (TI)</option><option value="PP">Pasaporte</option><option value="PPT">Permiso por protección temporal (PPT)</option><option value="OTHER">Otro</option></select></label>
<label><span className="field-label-heading">Documento</span><input value={customerDraft.document_number} onChange={e=>setCustomerDraft(current=>({...current,document_number:e.target.value}))} maxLength={60} autoComplete="off" placeholder="Número de documento"/></label>
<label><span className="field-label-heading">Correo</span><input type="email" autoComplete="email" value={customerDraft.email} onChange={e=>setCustomerDraft(current=>({...current,email:e.target.value}))} maxLength={254} placeholder="cliente@correo.com"/></label>
<label><span className="field-label-heading">Teléfono</span><input type="tel" autoComplete="tel" value={customerDraft.phone} onChange={e=>setCustomerDraft(current=>({...current,phone:e.target.value}))} maxLength={60} placeholder="Número de contacto"/></label>
<label><span className="field-label-heading">WhatsApp</span><input type="tel" value={customerDraft.whatsapp} onChange={e=>setCustomerDraft(current=>({...current,whatsapp:e.target.value}))} maxLength={60} placeholder="Número de WhatsApp"/></label>
<label><span className="field-label-heading">Ciudad</span><input autoComplete="address-level2" value={customerDraft.city} onChange={e=>setCustomerDraft(current=>({...current,city:e.target.value}))} maxLength={100} placeholder="Ciudad"/></label>
<label className="customer-span-two"><span className="field-label-heading">Dirección</span><input autoComplete="street-address" value={customerDraft.address} onChange={e=>setCustomerDraft(current=>({...current,address:e.target.value}))} maxLength={300} placeholder="Dirección de residencia o entrega"/></label>
<label className="customer-span-two"><span className="field-label-heading">Notas</span><textarea rows="3" value={customerDraft.notes} onChange={e=>setCustomerDraft(current=>({...current,notes:e.target.value}))} maxLength={1500} placeholder="Información útil para atender a este cliente"/></label>
</div>
<div className="form-actions"><button type="button" className="secondary-button" onClick={resetCustomerForm}>Cancelar</button><button type="submit" className="primary-button" disabled={busy}>{busy?"Guardando…":editingCustomerId?"Guardar cambios":"Guardar cliente"}</button></div>
</form>}
{salesLoading?<div className="empty-state">Cargando clientes…</div>:customers.length?<div className="customer-list panel">
<div className="customer-list-heading"><span>Cliente / empresa</span><span>Celular</span><span>E-mail</span><span>Documento</span><span>Ciudad</span><span></span></div>
{customers.map(customer=><article className="customer-row" key={customer.id} tabIndex={0} onClick={(event) => { if (event.target.closest("button,a,input,select,textarea,[data-stop-record-open]")) return; setSelectedCustomer(customer); }} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedCustomer(customer); } }}>
<div className="customer-name-cell"><strong>{customer.full_name||customer.company_name}</strong>{customer.company_name&&customer.company_name!==customer.full_name&&<span>{customer.company_name}</span>}{customer.advisor_name&&<span className="customer-advisor-tag">Asesora: {customer.advisor_name}</span>}</div>
<span>{customer.phone||customer.whatsapp||"Sin celular"}</span><span>{customer.email||"Sin correo"}</span>
<span>{[customer.document_type,customer.document_number].filter(Boolean).join(" ")||"Sin documento"}</span><span>{customer.city||"—"}</span>
{canManageCustomers && <button type="button" className="icon-action-button customer-edit-icon" title="Editar cliente" aria-label={"Editar "+(customer.full_name||customer.company_name)} onClick={(event)=>{event.stopPropagation();startEditCustomer(customer);setSelectedCustomer(null);}}><AppIcon name="edit" size={16}/></button>}
</article>)}
</div>:<div className="empty-state"><span className="empty-icon">◎</span><h3>No hay clientes registrados</h3><p>Registra a una persona o empresa para asociarla a tus ventas.</p>{canManageCustomers && <button className="primary-button" onClick={()=>{setCustomerDraft(blankCustomer);setEditingCustomerId(null);setShowCustomerForm(true);}}>+ Añadir cliente</button>}</div>}
{!salesLoading && customersCount > customersPageSize && <div className="pagination-bar customer-pagination"><span className="count-label">Mostrando {(customersPage-1)*customersPageSize+1}–{Math.min(customersPage*customersPageSize,customersCount)} de {customersCount}</span><div className="pagination-controls"><button type="button" className="secondary-button" disabled={customersPage<=1} onClick={()=>setCustomersPage((page)=>Math.max(1,page-1))}>Anterior</button><span className="page-label">{customersPage} / {Math.ceil(customersCount/customersPageSize)}</span><button type="button" className="secondary-button" disabled={customersPage>=Math.ceil(customersCount/customersPageSize)} onClick={()=>setCustomersPage((page)=>page+1)}>Siguiente</button></div></div>}
{selectedCustomer && <div className="customer-detail-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setSelectedCustomer(null); }}>
  <section className="customer-detail-card" role="dialog" aria-modal="true" aria-labelledby="customer-detail-title">
    <header className="customer-detail-header"><div><span className="customer-detail-kicker">FICHA DEL CLIENTE</span><h2 id="customer-detail-title">{selectedCustomer.full_name || selectedCustomer.company_name || "Cliente"}</h2>{selectedCustomer.company_name && selectedCustomer.company_name !== selectedCustomer.full_name && <p>{selectedCustomer.company_name}</p>}</div><button type="button" className="customer-detail-close" aria-label="Cerrar ficha" onClick={() => setSelectedCustomer(null)}>×</button></header>
    <div className="customer-detail-content">
      <section className="customer-detail-group"><h3>Contacto</h3>
        <div className="customer-detail-field"><span>Correo electrónico</span>{selectedCustomer.email ? <a href={"mailto:" + selectedCustomer.email}>{selectedCustomer.email}</a> : <strong>Sin registrar</strong>}</div>
        <div className="customer-detail-field"><span>Teléfono</span>{selectedCustomer.phone ? <a href={"tel:" + selectedCustomer.phone}>{selectedCustomer.phone}</a> : <strong>Sin registrar</strong>}</div>
        <div className="customer-detail-field"><span>WhatsApp</span>{selectedCustomer.whatsapp ? <a href={"https://wa.me/" + selectedCustomer.whatsapp.replace(/\D/g, "")} target="_blank" rel="noreferrer">{selectedCustomer.whatsapp}</a> : <strong>Sin registrar</strong>}</div>
      </section>
      <section className="customer-detail-group"><h3>Identificación</h3>
        <div className="customer-detail-field"><span>Tipo de documento</span><strong>{selectedCustomer.document_type || "Sin registrar"}</strong></div>
        <div className="customer-detail-field"><span>Número de documento</span><strong>{selectedCustomer.document_number || "Sin registrar"}</strong></div>
      </section>
      <section className="customer-detail-group"><h3>Ubicación</h3>
        <div className="customer-detail-field"><span>Ciudad</span><strong>{selectedCustomer.city || "Sin registrar"}</strong></div>
        <div className="customer-detail-field"><span>Dirección</span><strong>{selectedCustomer.address || "Sin registrar"}</strong></div>
      </section>
      <section className="customer-detail-group"><h3>Notas</h3><p className="customer-detail-notes">{selectedCustomer.notes || "No hay notas guardadas para este cliente."}</p></section>
      <p className="customer-detail-created">Cliente registrado {selectedCustomer.created_at ? new Date(selectedCustomer.created_at).toLocaleDateString("es-CO", {year:"numeric",month:"long",day:"numeric"}) : "—"}</p>
    </div>
    <footer className="customer-detail-actions">
      {(selectedCustomer.whatsapp || selectedCustomer.phone) && <a className="customer-detail-whatsapp" href={"https://wa.me/" + (selectedCustomer.whatsapp || selectedCustomer.phone).replace(/\D/g, "")} target="_blank" rel="noreferrer">Abrir WhatsApp</a>}
      {canManageCustomers && <button type="button" className="primary-button" onClick={() => { const customer = selectedCustomer; setSelectedCustomer(null); startEditCustomer(customer); }}>Editar cliente</button>}
      <button type="button" className="secondary-button" onClick={() => setSelectedCustomer(null)}>Cerrar ficha</button>
    </footer>
  </section>
</div>}

</section>
 ) : screen === "team" ? (
          <section className="team-page">
            <div className="products-intro team-intro">
              <div><h2>Personas y accesos</h2><p>Invita a tu equipo y asigna a cada persona únicamente los módulos y acciones que necesita.</p></div>
              <button type="button" className="primary-button compact-button" onClick={() => {
                if (teamFormOpen && !teamEditingUserId) clearTeamForm();
                else { setTeamEmail(""); setTeamPhone(""); setTeamHourlyRate(""); setTeamWorkDays([]); setTeamWorkStart("09:00"); setTeamWorkEnd("17:00"); setTeamWorkNotes(""); setTeamPermissionDraft({ ...blankTeamPermissions, ...employeePermissionProfiles.vendedor.permissions }); setTeamPermissionProfile("vendedor"); setTeamEditingUserId(null); setTeamEditingRole(null); setTeamFormOpen(true); setError(""); setNotice(""); }
              }}>{teamFormOpen && !teamEditingUserId ? "Cancelar" : "+ Añadir colaborador"}</button>
            </div>
            <div className="team-info-panel panel">
              <span className="team-info-icon">♙</span>
              <div><strong>¿Cómo agregar a alguien?</strong><p>La persona debe crear primero su cuenta en treseiscinco. Después, escribe aquí el mismo correo y elige sus permisos. Este formulario no envía correos.</p></div>
            </div>
            {teamFormOpen && <form ref={teamFormRef} className="team-form panel" onSubmit={saveTeamMember}>
              <div className="team-form-heading"><div><p className="eyebrow">{teamEditingRole === "owner" ? "DATOS DE CONTACTO" : teamEditingUserId ? "PERMISOS DEL COLABORADOR" : "NUEVO ACCESO"}</p><h3>{teamEditingRole === "owner" ? "Editar mi celular" : teamEditingUserId ? "Editar permisos" : "Añadir colaborador"}</h3><p>{teamEditingRole === "owner" ? "Actualiza tu número de contacto sin modificar los permisos de propietario." : "Marca solo lo que esa persona necesita para trabajar."}</p></div></div>
              {!teamEditingUserId && <label className="team-email-field"><span className="field-label-heading">Perfil inicial<FieldHelp enabled={contextualHelpEnabled} text="Selecciona una función como punto de partida. Puedes ajustar los permisos manualmente antes de guardar." /></span><select value={teamPermissionProfile} onChange={(e) => { const profile = employeePermissionProfiles[e.target.value] || employeePermissionProfiles.personalizado; setTeamPermissionProfile(e.target.value); setTeamPermissionDraft({ ...blankTeamPermissions, ...profile.permissions }); }}><option value="vendedor">Vendedor</option><option value="atencion">Atención al cliente</option><option value="inventario">Inventario</option><option value="compras">Compras y proveedores</option><option value="personalizado">Personalizado</option></select><span className="helper-text">{employeePermissionProfiles[teamPermissionProfile]?.description}</span></label>}
              {teamEditingRole !== "owner" && <label className="team-email-field"><span className="field-label-heading">Correo de la cuenta de treseiscinco *
                </span><input type="email" value={teamEmail} onChange={(e) => setTeamEmail(e.target.value)} required disabled={Boolean(teamEditingUserId)} maxLength={254} autoComplete="email" placeholder="persona@correo.com" />
              </label>}
              <section className="team-employment-fields" aria-label="Datos laborales" hidden={teamEditingRole === "owner"}>
                <div className="team-employment-heading"><h4>Datos laborales</h4><p>Guarda el contacto, el valor de la hora y el horario habitual. Estos datos no cambian los permisos de acceso.</p></div>
                <div className="team-employment-grid">
                  <label><span className="field-label-heading">Celular</span><input type="tel" inputMode="tel" autoComplete="tel" value={teamPhone} onChange={(e) => setTeamPhone(e.target.value)} maxLength={40} placeholder="+57 300 000 0000" /></label>
                  <label><span className="field-label-heading">Valor por hora (COP)<FieldHelp enabled={contextualHelpEnabled} text="Costo estimado por hora de mano de obra para analizar costos del negocio. Déjalo vacío si no aplica." /></span><input type="number" min="0" step="1" inputMode="numeric" value={teamHourlyRate} onChange={(e) => setTeamHourlyRate(e.target.value)} placeholder="Ej. 12000" /><span className="helper-text">Déjalo vacío si aún no está definido.</span></label>
                  <fieldset className="team-workdays-field"><legend>Días de trabajo</legend><div className="team-workday-options">{[["mon","Lun"],["tue","Mar"],["wed","Mié"],["thu","Jue"],["fri","Vie"],["sat","Sáb"],["sun","Dom"]].map(([day,label]) => <label key={day} className="team-workday-option"><input type="checkbox" checked={teamWorkDays.includes(day)} onChange={(e) => setTeamWorkDays((current) => e.target.checked ? [...current,day] : current.filter((value) => value !== day))} /><span>{label}</span></label>)}</div></fieldset>
                  <div className="team-worktime-grid"><label><span className="field-label-heading">Hora de entrada</span><input type="time" value={teamWorkStart} onChange={(e) => setTeamWorkStart(e.target.value)} required /></label><label><span className="field-label-heading">Hora de salida</span><input type="time" value={teamWorkEnd} onChange={(e) => setTeamWorkEnd(e.target.value)} required /></label></div>
                  <label className="team-work-notes"><span className="field-label-heading">Notas del horario (opcional)</span><textarea rows="2" value={teamWorkNotes} onChange={(e) => setTeamWorkNotes(e.target.value)} maxLength={500} placeholder="Ej. descanso de 12:00 a 13:00; sábados alternos" /></label>
                </div>
              </section>
              {teamEditingRole !== "owner" && <><div className="team-permission-header"><span>Módulo</span><span>Consultar</span><span>Crear y modificar</span></div>
              <div className="team-permission-list">{teamPermissionGroups.map((group) => <div className="team-permission-row" key={group.view}>
                <strong>{group.label}</strong>
                <label className="team-check"><input type="checkbox" checked={Boolean(teamPermissionDraft[group.view])} onChange={(e) => changeTeamPermission(group.view, e.target.checked)} /><span className="field-label-heading">Ver<FieldHelp enabled={contextualHelpEnabled} text="Permite que esta persona consulte información de esta sección sin cambiarla." /></span></label>
                <label className="team-check"><input type="checkbox" checked={Boolean(teamPermissionDraft[group.manage])} onChange={(e) => changeTeamPermission(group.manage, e.target.checked)} /><span className="field-label-heading">Administrar<FieldHelp enabled={contextualHelpEnabled} text="Permite que esta persona cree o modifique registros de esta sección." /></span></label>
              </div>)}</div>
              <p className="helper-text" hidden={teamEditingRole === "owner"}>Para que una tarea funcione, algunos datos relacionados también deben poder leerse. Por ejemplo, ventas necesita consultar productos y clientes; compras puede actualizar existencias y costos.</p></>}
              <div className="form-actions"><button type="button" className="secondary-button" onClick={clearTeamForm}>Cancelar</button><button type="submit" className="primary-button" disabled={teamSaving}>{teamSaving ? "Guardando…" : teamEditingRole === "owner" ? "Guardar celular" : teamEditingUserId ? "Guardar permisos" : "Añadir al equipo"}</button></div>
            </form>}
            {teamLoading ? <div className="empty-state">Cargando el equipo…</div>
              : teamRows.length ? <div className="team-member-list">{teamRows.map((member) => {
                const isEmployee = !["owner", "admin"].includes(member.role);
                const memberRequestedPermissions = (member.permissions || {})._modules_requested || member.permissions || {};
                const granted = teamPermissionGroups.filter((group) => Boolean(memberRequestedPermissions[group.view] || memberRequestedPermissions[group.manage])).map((group) => group.label);
                return <article className="team-member panel" key={member.member_id}>
                  <div className="team-member-avatar">{(member.display_name || member.email || "?").slice(0, 1).toLocaleUpperCase("es")}</div>
                  <div className="team-member-main"><div className="team-member-title"><strong>{member.display_name || member.email}</strong><span className={"team-role-pill " + (isEmployee ? "team-role-employee" : "team-role-admin")}>{member.role === "owner" ? "Propietario" : member.role === "admin" ? "Administrador" : "Colaborador"}</span></div>
                    <span className="team-member-email">{member.email}</span>
                    <div className="team-member-details">
                      <div className="team-member-detail"><span>Rol</span><strong>{member.role === "owner" ? "Propietario" : member.role === "admin" ? "Administrador" : "Colaborador"}</strong></div>
                      <div className="team-member-detail"><span>Celular</span>{member.phone ? <a href={"tel:" + String(member.phone).replace(/[^+\d]/g, "")}>{member.phone}</a> : <strong className="muted-value">Sin registrar</strong>}</div>
                      {isEmployee && <div className="team-member-detail"><span>Valor por hora</span><strong>{(member.permissions || {})._employment?.hourly_rate_minor == null ? "Sin definir" : money((member.permissions || {})._employment.hourly_rate_minor, "COP")}</strong></div>}
                      {isEmployee && <div className="team-member-detail"><span>Horario</span><strong>{(() => { const schedule = (member.permissions || {})._employment?.work_schedule || {}; const days = Array.isArray(schedule.days) ? schedule.days : []; const labels = {mon:"Lun",tue:"Mar",wed:"Mié",thu:"Jue",fri:"Vie",sat:"Sáb",sun:"Dom"}; return (days.length ? days.map((day) => labels[day] || day).join(", ") : "Días sin definir") + " · " + (schedule.start || "09:00") + "–" + (schedule.end || "17:00"); })()}</strong>{(member.permissions || {})._employment?.work_schedule?.notes && <span>{(member.permissions || {})._employment.work_schedule.notes}</span>}</div>}
                      <div className="team-member-detail"><span>Desde</span><strong>{member.joined_at ? new Intl.DateTimeFormat(uiLanguage === "en" ? "en-US" : "es-CO", { year: "numeric", month: "short", day: "numeric" }).format(new Date(member.joined_at)) : "—"}</strong></div>
                    </div>
                    <p className="team-member-permissions"><strong>Accesos:</strong> {isEmployee ? (granted.length ? granted.join(" · ") : "Sin acceso a módulos") : "Acceso completo al negocio"}</p>
                  </div>
                  {(isEmployee || (member.role === "owner" && member.user_id === session?.user?.id)) && <div className="team-member-actions"><button type="button" className="secondary-button team-edit-button" title={isEmployee ? "Editar datos laborales y permisos" : "Editar mi celular"} aria-label={isEmployee ? "Editar datos laborales y permisos de " + (member.display_name || member.email) : "Editar mi celular"} onClick={() => startEditTeamMember(member)}><AppIcon name="edit" size={15} /><span className="team-edit-button-label">{isEmployee ? "Editar trabajador" : "Editar celular"}</span></button>{isEmployee && <button type="button" className="text-button danger-text" disabled={teamSaving} onClick={() => removeTeamMember(member)}>Quitar acceso</button>}</div>}
                </article>;
              })}</div>
              : <div className="empty-state"><span className="empty-icon">♙</span><h3>El equipo empieza aquí</h3><p>Por ahora solo hay miembros que ya pertenecen al negocio. No se ha creado ningún colaborador de ejemplo.</p><button type="button" className="primary-button" onClick={() => { setTeamEmail(""); setTeamPermissionDraft(blankTeamPermissions); setTeamEditingUserId(null); setTeamFormOpen(true); }}>+ Añadir colaborador</button></div>}
          </section>
 ) : screen === "catalog" ? (
          <section className="catalog-admin-page">
            <div className="products-intro catalog-admin-intro">
              <div><p className="eyebrow">VITRINA COMERCIAL</p><h2>Catálogo</h2><p>Publica los productos que quieras mostrar y comparte un único enlace con tus clientes.</p></div>
              <div className="catalog-admin-actions">
                <button type="button" className="secondary-button compact-button" onClick={copyPublicCatalogLink}>Copiar enlace</button>
                <a className="primary-button compact-button catalog-open-link" href={window.location.origin + "/?catalog=" + encodeURIComponent(activeBusiness?.id || "")} target="_blank" rel="noreferrer">Abrir catálogo</a>
              </div>
            </div>
            <div className="catalog-share-panel panel">
              <div><span className="eyebrow">ENLACE PÚBLICO</span><strong>{publishedCatalogCount} {publishedCatalogCount === 1 ? "producto publicado" : "productos publicados"}</strong><p>Solo se muestran productos publicados y activos. El enlace no revela costos ni existencias internas.</p></div>
              <input aria-label="Enlace público del catálogo" readOnly value={activeBusiness?.slug ? "https://treseiscinco.com/" + activeBusiness.slug : window.location.origin + "/?catalog=" + encodeURIComponent(activeBusiness?.id || "")} onFocus={(e) => e.target.select()} />
            </div>
            <div className="catalog-filter-row">
              <input aria-label="Buscar en productos del catálogo" value={catalogSearch} onChange={(e) => { setCatalogSearch(e.target.value); setCatalogPage(1); }} placeholder="Buscar producto o categoría…" />
              <div className="catalog-filter-actions"><span>{filteredCatalogProducts.length} {filteredCatalogProducts.length === 1 ? "producto" : "productos"}</span><label className="catalog-sort-control"><span>Ordenar</span><select value={catalogSort} onChange={(e)=>{setCatalogSort(e.target.value);setCatalogPage(1);}} aria-label="Ordenar productos del catálogo"><option value="name">Nombre A–Z</option><option value="code">Código</option><option value="price">Precio</option></select></label><div className="view-switch" role="group" aria-label="Vista del catálogo"><button type="button" className={catalogViewMode === "rows" ? "view-option active" : "view-option"} onClick={() => setCatalogViewMode("rows")} aria-pressed={catalogViewMode === "rows"}><AppIcon name="list" size={16} /> Filas</button><button type="button" className={catalogViewMode === "cards" ? "view-option active" : "view-option"} onClick={() => setCatalogViewMode("cards")} aria-pressed={catalogViewMode === "cards"}><AppIcon name="grid" size={16} /> Tarjetas</button><button type="button" className={catalogViewMode === "compact" ? "view-option active" : "view-option"} onClick={() => setCatalogViewMode("compact")} aria-pressed={catalogViewMode === "compact"}><AppIcon name="list" size={16} /> Compacta</button></div></div>
            </div>
            {catalogLoading ? <div className="empty-state">Cargando productos reales…</div>
              : filteredCatalogProducts.length ? <div className={catalogViewMode === "cards" ? "catalog-admin-list catalog-admin-cards" : catalogViewMode === "compact" ? "catalog-admin-list catalog-admin-compact" : "catalog-admin-list"}>{catalogPageProducts.map((product) => {
                const category = catalogCategories.find((item) => item.id === product.category_id)?.name || "Sin categoría";
                return <article className="catalog-admin-row panel" key={product.id}>
                  <div className="catalog-admin-product"><CatalogAdminImage businessId={activeBusiness.id} product={product} /><div><strong>{product.name}</strong><span>{category}</span>{product.description && <small>{product.description}</small>}</div></div>
                  <div className="catalog-admin-price"><strong>{money(product.sale_price_minor, currencyCode)}</strong><span>por {product.unit_name || "unidad"}</span></div>
                  <div className="catalog-admin-publish">
                    <span className={product.is_published && product.is_sellable ? "status-pill status-active" : "status-pill status-inactive"}>{product.is_published && product.is_sellable ? "Publicado" : product.is_published ? "Producto inactivo" : "Oculto"}</span>
                    <button type="button" className={product.is_published ? "secondary-button action-small" : "primary-button action-small"} disabled={catalogPublishingId === product.id || (!product.is_sellable && !product.is_published)} onClick={() => toggleCatalogPublication(product)}>{catalogPublishingId === product.id ? "Guardando…" : product.is_published ? "Retirar" : "Publicar"}</button>
                  </div>
                </article>;
              })}</div>
              : <div className="empty-state"><span className="empty-icon">◉</span><h3>{catalogProducts.length ? "No hay resultados" : "Todavía no hay productos"}</h3><p>{catalogProducts.length ? "Prueba otra palabra o categoría." : "Crea tus productos primero; luego publícalos aquí para compartirlos."}</p><button type="button" className="secondary-button" onClick={() => navigate("products")}>Ir a productos</button></div>}
            {!catalogLoading && filteredCatalogProducts.length > 0 && <div className="pagination-bar catalog-pagination"><label className="page-size-control"><span className="field-label-heading">Mostrar</span><select value={catalogPageSize} onChange={(e) => { setCatalogPageSize(Number(e.target.value)); setCatalogPage(1); }}><option value={8}>8</option><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select> por página</label><div className="pagination-controls"><button type="button" className="secondary-button" disabled={catalogPage <= 1} onClick={() => setCatalogPage((page) => Math.max(1, page - 1))}>Anterior</button><span className="pagination-status">Página {Math.min(catalogPage, catalogTotalPages)} de {catalogTotalPages}</span><button type="button" className="secondary-button" disabled={catalogPage >= catalogTotalPages} onClick={() => setCatalogPage((page) => Math.min(catalogTotalPages, page + 1))}>Siguiente</button></div></div>}
          </section>
        ) : screen === "quotes" ? (
          <section className="quotes-page">
            <div className="products-intro">
              <div><h2>Cotizaciones para tus clientes</h2><p>Prepara propuestas con productos, cantidades, precios y fecha de validez. Los valores se guardan en este negocio.</p></div>
              {canManageSales && <button type="button" className="primary-button compact-button" onClick={() => { if (showQuoteForm) clearQuoteDraft(); else { setShowQuoteForm(true); setError(""); setNotice(""); } }}>{showQuoteForm ? "Cancelar" : "+ Nueva cotización"}</button>}
            </div>
            {showQuoteForm && canManageSales && <form className="quote-form panel" onSubmit={createQuote}>
              <h3>{editingQuoteId ? "Ajustar cotización" : "Nueva cotización"}</h3>
              <div className="quote-customer-fields">
                <label><span className="field-label-heading">Seleccionar cliente registrado<FieldHelp enabled={contextualHelpEnabled} text="Elige una ficha existente para completar automáticamente los datos de contacto de esta cotización." /></span><select value={quoteCustomerId} onChange={(e) => { const id = e.target.value; if (id === "__create_quote_customer__") { setShowQuickQuoteCustomerForm(true); setError(""); return; } setQuoteCustomerId(id); const customer = quoteCustomers.find((item) => item.id === id); if (customer) { setQuoteCustomerName(customer.company_name || customer.full_name || ""); setQuoteCustomerEmail(customer.email || ""); setQuoteCustomerPhone(customer.phone || customer.whatsapp || ""); } }}><option value="">Cliente nuevo / escribir manualmente</option>{quoteCustomers.map((customer) => <option key={customer.id} value={customer.id}>{customer.company_name && customer.company_name !== customer.full_name ? customer.company_name + " · " + customer.full_name : customer.full_name || customer.company_name}</option>)}{canManageCustomers&&<option value="__create_quote_customer__">＋ Agregar</option>}</select></label>
                <label><span className="field-label-heading">Cliente o empresa *</span><input value={quoteCustomerName} onChange={(e) => { setQuoteCustomerName(e.target.value); if (quoteCustomerId) setQuoteCustomerId(""); }} maxLength={200} required placeholder="Nombre del cliente" /></label>
                <label><span className="field-label-heading">Correo</span><input type="email" value={quoteCustomerEmail} onChange={(e) => setQuoteCustomerEmail(e.target.value)} maxLength={254} placeholder="cliente@correo.com" /></label>
                <label><span className="field-label-heading">Teléfono / WhatsApp</span><input value={quoteCustomerPhone} onChange={(e) => setQuoteCustomerPhone(e.target.value)} maxLength={60} placeholder="Número de contacto" /></label>
                <label><span className="field-label-heading">Válida hasta<FieldHelp enabled={contextualHelpEnabled} text="Último día en que mantienes vigentes los precios y condiciones de esta cotización." /></span><input type="date" min={todayInBogota()} value={quoteValidUntil} onChange={(e) => setQuoteValidUntil(e.target.value)} /></label>
              </div>
              {showQuickQuoteCustomerForm && canManageCustomers && <div className="quick-customer-form quick-quote-customer-form" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}>
                <strong>Nuevo cliente</strong><p className="inline-create-hint">Guárdalo y se seleccionará en esta cotización, sin perder los artículos que ya añadiste.</p>
                <div className="sale-builder">
                  <label><span className="field-label-heading">Nombre o empresa *</span><input value={quickQuoteCustomerName} onChange={(event) => setQuickQuoteCustomerName(event.target.value)} maxLength={200} autoComplete="name" /></label>
                  <label><span className="field-label-heading">Teléfono</span><input value={quickQuoteCustomerPhone} onChange={(event) => setQuickQuoteCustomerPhone(event.target.value)} maxLength={40} autoComplete="tel" /></label>
                  <label><span className="field-label-heading">Nombre o razón social</span><input value={quickQuoteCustomerCompany} onChange={(event) => setQuickQuoteCustomerCompany(event.target.value)} maxLength={200} /></label>
                  <label><span className="field-label-heading">Correo</span><input type="email" value={quickQuoteCustomerEmail} onChange={(event) => setQuickQuoteCustomerEmail(event.target.value)} maxLength={254} autoComplete="email" /></label>
                  <label><span className="field-label-heading">WhatsApp</span><input type="tel" value={quickQuoteCustomerWhatsapp} onChange={(event) => setQuickQuoteCustomerWhatsapp(event.target.value)} maxLength={40} /></label>
                  <label><span className="field-label-heading">Tipo de documento</span><select value={quickQuoteCustomerDocumentType} onChange={(event) => setQuickQuoteCustomerDocumentType(event.target.value)}><option value="">Sin especificar</option><option value="CC">Cédula de ciudadanía</option><option value="NIT">NIT</option><option value="CE">Cédula de extranjería</option><option value="TI">Tarjeta de identidad</option><option value="PP">Pasaporte</option><option value="OTHER">Otro</option></select></label>
                  <label><span className="field-label-heading">Número de documento</span><input value={quickQuoteCustomerDocumentNumber} onChange={(event) => setQuickQuoteCustomerDocumentNumber(event.target.value)} maxLength={80} /></label>
                  <label><span className="field-label-heading">Ciudad</span><input value={quickQuoteCustomerCity} onChange={(event) => setQuickQuoteCustomerCity(event.target.value)} maxLength={100} /></label>
                  <label><span className="field-label-heading">Dirección</span><input value={quickQuoteCustomerAddress} onChange={(event) => setQuickQuoteCustomerAddress(event.target.value)} maxLength={300} /></label>
                  <div className="inline-create-actions"><button type="button" className="secondary-button" onClick={()=>setShowQuickQuoteCustomerForm(false)}>Cancelar</button><button type="button" className="primary-button" disabled={quickQuoteCustomerSaving || !quickQuoteCustomerName.trim()} onClick={addQuickQuoteCustomer}>{quickQuoteCustomerSaving ? "Guardando…" : "Guardar y seleccionar"}</button></div>
                </div>
              </div>}
              {quoteProducts.length > 0 && <label className="quote-product-select"><span className="field-label-heading">Cargar desde productos (opcional)<FieldHelp enabled={contextualHelpEnabled} text="Elige un producto guardado para reutilizar su nombre y precio; puedes modificar el precio de esta cotización." /></span><select value={quoteProductChoice} onChange={(e) => { const id = e.target.value; const product = quoteProducts.find((item) => item.id === id); setQuoteProductChoice(id); if (product) { setQuoteItemName(product.name); setQuoteUnitPrice(String(Number(product.sale_price_minor || 0) / (10 ** currencyDigits(currencyCode)))); } }}><option value="">Artículo personalizado…</option>{quoteProducts.map((product) => <option value={product.id} key={product.id}>{product.name} · {money(product.sale_price_minor, currencyCode)}</option>)}</select></label>}
              <div className="quote-item-builder">
                <label><span className="field-label-heading">Artículo o servicio *<FieldHelp enabled={contextualHelpEnabled} text="Describe el producto o servicio ofertado. Puedes elegir un producto del inventario o escribir uno personalizado." /></span><input value={quoteItemName} onChange={(e) => { setQuoteItemName(e.target.value); setQuoteProductChoice(""); }} maxLength={200} placeholder="Nombre del artículo o servicio" /></label>
                <label><span className="field-label-heading">Cantidad</span><input type="number" min="0.001" step="0.001" value={quoteQuantity} onChange={(e) => setQuoteQuantity(e.target.value)} /></label>
                <label><span className="field-label-heading">Precio unitario</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={quoteUnitPrice} onChange={(e) => setQuoteUnitPrice(e.target.value)} placeholder="0" /></label>
                <button type="button" className="secondary-button quote-add-item" onClick={addQuoteItem}>+ Agregar artículo</button>
              </div>
              {quoteItems.length > 0 && <div className="quote-cart">
                <div className="quote-cart-heading"><strong>Artículos cotizados</strong><span>{quoteItems.length} {quoteItems.length === 1 ? "artículo" : "artículos"}</span></div>
                {quoteItems.map((item) => <div className="quote-cart-row quote-edit-row" key={item.id}><div className="quote-edit-item-name"><strong>{item.name}</strong><span>{money(item.line_total_minor, currencyCode)}</span></div><label className="quote-inline-field"><span className="field-label-heading">Cantidad</span><input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(e) => { const quantity = Number(e.target.value || 0); setQuoteItems((current) => current.map((row) => row.id === item.id ? { ...row, quantity, line_total_minor: Math.round(Number(row.unit_price_minor || 0) * quantity) } : row)); }} /></label><label className="quote-inline-field"><span className="field-label-heading">Precio unitario</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={Number(item.unit_price_minor || 0) / (10 ** currencyDigits(currencyCode))} onChange={(e) => { const unit_price_minor = toMinorUnits(e.target.value || 0, currencyCode); setQuoteItems((current) => current.map((row) => row.id === item.id ? { ...row, unit_price_minor, line_total_minor: Math.round(unit_price_minor * Number(row.quantity || 0)) } : row)); }} /></label><button type="button" className="text-button danger-text" onClick={() => setQuoteItems((current) => current.filter((row) => row.id !== item.id))}>Quitar</button></div>)}
                <div className="quote-total-line"><span>Total de la cotización</span><strong>{money(quoteItems.reduce((sum, item) => sum + item.line_total_minor, 0), currencyCode)}</strong></div>
              </div>}
              <label><span className="field-label-heading">Notas y condiciones<FieldHelp enabled={contextualHelpEnabled} text="Incluye tiempos, forma de entrega, vigencia especial u otras condiciones que el cliente debe conocer." /></span><textarea rows="2" value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} maxLength={1500} placeholder="Tiempos, forma de entrega u otras condiciones" /></label>
              <div className="form-actions"><button type="button" className="secondary-button" onClick={clearQuoteDraft}>Cancelar</button><button type="submit" className="primary-button" disabled={quoteSaving}>{quoteSaving ? "Guardando…" : "Guardar cotización"}</button></div>
            </form>}
            <div className="quotes-toolbar">
              <label><span className="field-label-heading">Buscar</span><input value={quotesSearch} onChange={(e) => { setQuotesSearch(e.target.value); setQuotesPage(1); }} placeholder="Número o cliente…" /></label>
              <label><span className="field-label-heading">Estado</span><select value={quotesStatusFilter} onChange={(e) => { setQuotesStatusFilter(e.target.value); setQuotesPage(1); }}><option value="all">Todos</option><option value="draft">Borrador</option><option value="sent">Enviada</option><option value="accepted">Aceptada</option><option value="rejected">Rechazada</option><option value="expired">Vencida</option><option value="converted">Convertida en venta</option><option value="cancelled">Cancelada</option></select></label>
              <span className="count-label">{quotesCount} {quotesCount === 1 ? "cotización" : "cotizaciones"}</span>
            </div>
            {quotesLoading ? <div className="empty-state">Cargando cotizaciones…</div>
              : quotesRows.length ? <div className="quotes-list">{quotesRows.map((quote) => <article className="quote-record panel" key={quote.id}>
                <div className="quote-record-top"><div><strong>{quote.quote_number}</strong><span>{new Date(quote.created_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" })}</span></div><span className={"status-pill " + (quote.status === "accepted" || quote.status === "converted" ? "status-active" : quote.status === "rejected" || quote.status === "cancelled" || quote.status === "expired" ? "status-inactive" : "status-unpublished")}>{quoteStatusLabel(quote.status)}</span></div>
                <div className="quote-record-customer"><strong>{quote.customer_name}</strong>{quote.customer_email && <span>{quote.customer_email}</span>}{quote.customer_phone && <span>{quote.customer_phone}</span>}</div>
                <div className="quote-record-bottom">
                  <div><span>Total</span><strong>{money(quote.total_minor, quote.currency_code || currencyCode)}</strong></div>
                  <div><span>Válida hasta</span><strong>{quote.valid_until ? new Date(quote.valid_until + "T12:00:00-05:00").toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" }) : "Sin fecha límite"}</strong></div>
                </div>
                <div className="quote-record-disclosure-bar">
                  <div className="quote-record-inline-actions">
                    <button type="button" className="text-button" aria-expanded={expandedQuoteId === quote.id} onClick={() => setExpandedQuoteId((current) => current === quote.id ? null : quote.id)}>{expandedQuoteId === quote.id ? "Ocultar detalles" : `Ver detalles (${quote.items.length})`}</button>
                    {canManageSales && <button type="button" className="secondary-button action-small quote-share-inline" onClick={() => shareQuoteImage(quote)}>Compartir imagen</button>}
                  </div>
                </div>
                <div className="quote-record-details" hidden={expandedQuoteId !== quote.id}>
                  {quote.items.length > 0 && <div className="quote-record-items">{quote.items.map((item) => <div key={item.id}><span>{item.item_name} × {Number(item.quantity).toLocaleString("es-CO")}</span><strong>{money(item.line_total_minor, quote.currency_code || currencyCode)}</strong></div>)}</div>}
                  {quote.notes && <p className="quote-record-note">{quote.notes}</p>}
                  {canManageSales && <div className="quote-record-actions">
                    <div className="quote-share-actions">
                      {quote.status !== "converted" && quote.status !== "cancelled" && <button type="button" className="secondary-button action-small" onClick={() => editQuote(quote)}>Ajustar propuesta</button>}
                      <button type="button" className="secondary-button action-small" onClick={() => printQuoteDocument(quote)}>PDF / Imprimir</button>
                      
                    </div>
                    <label><span className="field-label-heading">Estado<FieldHelp enabled={contextualHelpEnabled} text="Actualiza el estado comercial. Cambiarlo no crea una venta por sí solo." /></span><select value={quote.status} onChange={(e) => updateQuoteStatus(quote, e.target.value)}><option value="draft">Borrador</option><option value="sent">Enviada</option><option value="accepted">Aceptada</option><option value="rejected">Rechazada</option><option value="expired">Vencida</option><option value="converted">Convertida en venta</option><option value="cancelled">Cancelada</option></select></label>
                  </div>}
                </div>
              </article>)}</div>
              : <div className="empty-state"><span className="empty-icon">▧</span><h3>{quotesCount ? "No hay resultados" : "Aún no hay cotizaciones"}</h3><p>{quotesCount ? "Prueba otro nombre o estado." : "Crea tu primera cotización para dejar por escrito lo que le estás ofreciendo a un cliente."}</p>{canManageSales && <button type="button" className="primary-button" onClick={() => setShowQuoteForm(true)}>+ Nueva cotización</button>}</div>}
            {!quotesLoading && quotesCount > 0 && <div className="pagination-bar quotes-pagination"><label className="page-size-control"><span className="field-label-heading">Mostrar</span><select value={quotesPageSize} onChange={(e) => { setQuotesPageSize(Number(e.target.value)); setQuotesPage(1); }}><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select> por página</label><div className="pagination-controls"><button type="button" className="secondary-button" disabled={quotesPage <= 1} onClick={() => setQuotesPage((page) => Math.max(1, page - 1))}>Anterior</button><span className="pagination-status">Página {Math.min(quotesPage, Math.max(1, Math.ceil(quotesCount / quotesPageSize)))} de {Math.max(1, Math.ceil(quotesCount / quotesPageSize))}</span><button type="button" className="secondary-button" disabled={quotesPage >= Math.ceil(quotesCount / quotesPageSize)} onClick={() => setQuotesPage((page) => Math.min(Math.ceil(quotesCount / quotesPageSize), page + 1))}>Siguiente</button></div></div>}
          </section>
        ) : screen === "stats" ? (
          <section className="stats-page">
            <div className="products-intro stats-intro"><div><h2>Estadísticas y balance</h2><p>Elige un periodo y descarga un informe de los movimientos registrados.</p></div><button type="button" className="secondary-button compact-button" onClick={()=>navigate("audit")}><AppIcon name="audit" size={16}/> Ver auditorías</button></div>
            <div className="stats-filter-toolbar">
              <div className="stats-period-buttons" role="group" aria-label="Periodo de estadísticas">
                {[["day","Día"],["week","Semana"],["month","Mes"],["year","Año"],["custom","Desde / hasta"],["all","Todo"]].map(([value,label]) => <button type="button" key={value} className={statsPeriod === value ? "stats-period-button active" : "stats-period-button"} aria-pressed={statsPeriod === value} onClick={() => setStatsPeriod(value)}>{label}</button>)}
              </div>
              {statsPeriod === "custom" && <div className="stats-custom-dates"><label><span className="field-label-heading">Desde</span><input type="date" value={statsDateFrom} max={statsDateTo || todayBogotaKey} onChange={(e) => setStatsDateFrom(e.target.value)} /></label><label><span className="field-label-heading">Hasta</span><input type="date" value={statsDateTo} min={statsDateFrom || undefined} max={todayBogotaKey} onChange={(e) => setStatsDateTo(e.target.value)} /></label></div>}
              <div className="stats-export-actions"><button type="button" className="secondary-button compact-button" onClick={downloadStatsExcel}>Exportar Excel (CSV)</button><button type="button" className="primary-button compact-button" onClick={printStatsReport}>PDF / Imprimir</button></div>
              <p className="stats-range-label">{statsRangeLabel}</p>
            </div>
            {statsLoading ? <div className="empty-state">Revisando ventas, cobros y gastos…</div> : <>
              <div className="stats-metrics">
                <article className="stats-metric panel stats-income"><span>Ingresos</span><strong>{money(statsCollected, currencyCode)}</strong><small>Pagos recibidos en el periodo</small></article>
                <article className="stats-metric panel"><span>Gastos</span><strong>{money(statsExpensesTotal, currencyCode)}</strong><small>{statsPeriodExpenses.length} {statsPeriodExpenses.length === 1 ? "gasto registrado" : "gastos registrados"}</small></article>
                <article className="stats-metric panel"><span>Compras pagadas</span><strong>{money(statsPaidPurchases, currencyCode)}</strong><small>Pagos de compras del periodo</small></article>
                <article className={"stats-metric panel stats-balance" + (statsCashBalance < 0 ? " profit-negative" : " profit-positive")}><span>Balance</span><strong>{money(statsCashBalance, currencyCode)}</strong><small>Ingresos − gastos − compras pagadas</small></article>
              </div>
              <div className="chart-type-picker" role="group" aria-label="Tipo de gráfico"><button type="button" className={statsChartType === "bars" ? "active" : ""} aria-pressed={statsChartType === "bars"} onClick={() => setStatsChartType("bars")}>Barras</button><button type="button" className={statsChartType === "pie" ? "active" : ""} aria-pressed={statsChartType === "pie"} onClick={() => setStatsChartType("pie")}>Pastel</button><button type="button" className={statsChartType === "area" ? "active" : ""} aria-pressed={statsChartType === "area"} onClick={() => setStatsChartType("area")}>Área</button></div>{statsChartType === "bars" ? <SimpleBars title="Balance diario" description="Diferencia entre pagos recibidos y salidas registradas durante los últimos siete días." data={balanceChartData.map((item)=>({key:item.key,label:item.label,value:item.value}))} formatValue={(value)=>money(value,currencyCode)} /> : statsChartType === "pie" ? <SimplePie title="Distribución del balance" description="Comparación de ingresos y salidas en el periodo seleccionado." data={[{label:"Ingresos",value:statsCollected},{label:"Gastos",value:statsExpensesTotal},{label:"Compras pagadas",value:statsPaidPurchases}]} formatValue={(value)=>money(value,currencyCode)} /> : <SimpleArea title="Evolución del balance" description="Pagos recibidos y salidas por día de los últimos siete días." badge="7 días" data={balanceChartData.map((item)=>({key:item.key,label:item.label,value:item.value}))} series={[{key:"value",label:"Balance",color:"#2563EB"}]} formatValue={(value)=>money(value,currencyCode)} />}
              <section className="stats-insight-section">
                <div className="stats-section-heading"><div><h3>Lo que más se mueve</h3><p>Resumen calculado con los registros del periodo elegido.</p></div></div>
                <div className="stats-insight-grid">
                  <article className="stats-insight-card panel"><div className="stats-insight-title"><AppIcon name="products" size={18}/><h4>Productos más vendidos</h4></div>{statsTopProducts.length ? <ol>{statsTopProducts.map((item) => <li key={item.name}><span><strong>{item.name}</strong><small>{Number(item.quantity).toLocaleString("es-CO")} unidades</small></span><b>{money(item.revenue,currencyCode)}</b></li>)}</ol> : <p className="stats-empty-note">Aún no hay artículos vendidos en este periodo.</p>}</article>
                  <article className="stats-insight-card panel"><div className="stats-insight-title"><AppIcon name="expenses" size={18}/><h4>Gastos más frecuentes</h4></div>{statsTopExpenses.length ? <ol>{statsTopExpenses.map((item) => <li key={item.name}><span><strong>{item.name}</strong><small>{item.count} registros</small></span><b>{money(item.amount,currencyCode)}</b></li>)}</ol> : <p className="stats-empty-note">Aún no hay gastos en este periodo.</p>}</article>
                  <article className="stats-insight-card panel"><div className="stats-insight-title"><AppIcon name="payments" size={18}/><h4>Medios de pago más usados</h4></div>{statsTopPaymentMethods.length ? <ol>{statsTopPaymentMethods.map((item) => <li key={item.name}><span><strong>{item.name}</strong><small>{item.count} pagos</small></span><b>{money(item.amount,currencyCode)}</b></li>)}</ol> : <p className="stats-empty-note">Faltan pagos registrados para comparar medios.</p>}</article>
                  <article className="stats-insight-card panel"><div className="stats-insight-title"><AppIcon name="customers" size={18}/><h4>Mejores clientes</h4></div>{statsTopCustomers.length ? <ol>{statsTopCustomers.map((item) => <li key={item.name}><span><strong>{item.name}</strong><small>{item.count} ventas</small></span><b>{money(item.amount,currencyCode)}</b></li>)}</ol> : <p className="stats-empty-note">Relaciona ventas con clientes para ver este ranking.</p>}</article>
                  <article className="stats-insight-card panel"><div className="stats-insight-title"><AppIcon name="suppliers" size={18}/><h4>Proveedores principales</h4></div>{statsTopSuppliers.length ? <ol>{statsTopSuppliers.map((item) => <li key={item.name}><span><strong>{item.name}</strong><small>{item.count} compras</small></span><b>{money(item.amount,currencyCode)}</b></li>)}</ol> : <p className="stats-empty-note">Asocia compras a proveedores para ver el ranking.</p>}</article>
                </div>
              </section>
              <div className="stats-secondary-metrics"><span>Ventas registradas: <strong>{money(statsSalesTotal, currencyCode)}</strong></span><span>Pendiente por cobrar: <strong>{money(statsOutstanding, currencyCode)}</strong></span><span>{statsPeriodSales.length} {statsPeriodSales.length === 1 ? "venta" : "ventas"}</span></div>
              <section className="stats-pending panel"><div className="stats-section-heading"><div><h3>Ventas con saldo pendiente</h3><p>Las ventas con dinero por cobrar en el periodo elegido.</p></div><button type="button" className="secondary-button compact-button" onClick={() => navigate("sales")}>Ver ventas</button></div>
                {statsPeriodSales.filter((sale) => Number(sale.total_minor || 0) > Number(sale.amount_paid_minor || 0)).length
                  ? <div className="stats-pending-list">{statsPeriodSales.filter((sale) => Number(sale.total_minor || 0) > Number(sale.amount_paid_minor || 0)).sort((a, b) => (Number(b.total_minor || 0) - Number(b.amount_paid_minor || 0)) - (Number(a.total_minor || 0) - Number(a.amount_paid_minor || 0))).slice(0, 10).map((sale) => <div className="stats-pending-row" key={sale.id}><div><strong>{sale.sale_number || "Venta"}</strong><span>{new Date(sale.sold_at || sale.created_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" })}</span></div><strong>{money(Math.max(0, Number(sale.total_minor || 0) - Number(sale.amount_paid_minor || 0)), sale.currency_code || currencyCode)}</strong></div>)}</div>
                  : <p className="stats-empty-note">No hay saldos pendientes en este periodo.</p>}
              </section>
              <p className="stats-disclaimer">El balance compara los pagos registrados con los gastos anotados en el mismo periodo. Las ventas a crédito aparecen aparte como pendiente por cobrar; no se cuentan como dinero recibido.</p>
              {!statsSales.length && !statsExpenses.length && !statsPayments.length && !statsPurchases.length && !statsPurchasePayments.length && <div className="empty-state"><h3>Aún no hay movimientos</h3><p>Las estadísticas se llenarán cuando registres ventas, abonos y gastos.</p><button type="button" className="secondary-button" onClick={() => navigate("sales")}>Ir a ventas</button></div>}
            </>}
          </section>
        ) : screen === "profitability" ? (
          <section className="profitability-page">
            <div className="products-intro profitability-intro">
              <div><h2>Ingresos, costos y resultado</h2><p>Compara lo vendido con el costo de los artículos y los gastos que registraste durante el periodo elegido.</p></div>
              <label className="profitability-period-label"><span className="field-label-heading">Periodo
                <FieldHelp enabled={contextualHelpEnabled} text="Elige el periodo para consultar ingresos, costos y utilidad." /></span><select value={profitabilityPeriod} onChange={(e) => setProfitabilityPeriod(e.target.value)}>
                  <option value="day">Hoy</option><option value="week">Esta semana</option><option value="month">Este mes</option><option value="year">Este año</option><option value="30days">Últimos 30 días</option><option value="custom">Rango de fechas</option><option value="all">Todo el historial</option>
                </select>
              </label>
            </div>
            {profitabilityPeriod === "custom" && <div className="sales-date-toolbar panel"><div className="stats-custom-dates"><label><span>Desde</span><input type="date" value={profitabilityDateFrom} max={profitabilityDateTo || todayBogotaKey} onChange={(e) => setProfitabilityDateFrom(e.target.value)} /></label><label><span>Hasta</span><input type="date" value={profitabilityDateTo} min={profitabilityDateFrom || undefined} max={todayBogotaKey} onChange={(e) => setProfitabilityDateTo(e.target.value)} /></label></div></div>}
            {profitabilityLoading ? <div className="empty-state">Calculando con tus registros reales…</div> : <>
              <div className="profitability-metrics">
                <article className="profit-metric panel"><span>Ventas registradas</span><strong>{money(profitSalesTotal, currencyCode)}</strong><small>{periodSales.length} {periodSales.length === 1 ? "venta" : "ventas"} · {money(profitPaidTotal, currencyCode)} abonados</small></article>
                <article className="profit-metric panel"><span>Costo de lo vendido</span><strong>{money(profitCostOfSales, currencyCode)}</strong><small>Según el costo guardado en cada venta</small></article>
                <article className="profit-metric panel"><span>Ganancia bruta estimada</span><strong className={profitGross < 0 ? "profit-negative" : "profit-positive"}>{money(profitGross, currencyCode)}</strong><small>{profitLineRevenue > 0 ? Math.round((profitGross / profitLineRevenue) * 100) + "% de margen bruto" : "Sin ventas con artículos en este periodo"}</small></article>
                <article className="profit-metric panel"><span>Gastos registrados</span><strong>{money(profitExpenseTotal, currencyCode)}</strong><small>{periodExpenses.length} {periodExpenses.length === 1 ? "gasto" : "gastos"}</small></article>
                <article className="profit-metric panel profit-metric-primary"><span>Resultado estimado</span><strong className={profitNet < 0 ? "profit-negative" : "profit-positive"}>{money(profitNet, currencyCode)}</strong><small>Ganancia bruta menos gastos registrados</small></article>
              </div>
              <div className="chart-type-picker report-chart-type-picker" role="group" aria-label="Tipo de gráfico de Rentabilidad">
                <button type="button" className={profitabilityChartType==="pie"?"active":""} aria-pressed={profitabilityChartType==="pie"} onClick={()=>setProfitabilityChartType("pie")}>Pastel</button>
                <button type="button" className={profitabilityChartType==="bars"?"active":""} aria-pressed={profitabilityChartType==="bars"} onClick={()=>setProfitabilityChartType("bars")}>Barras</button>
                <button type="button" className={profitabilityChartType==="area"?"active":""} aria-pressed={profitabilityChartType==="area"} onClick={()=>setProfitabilityChartType("area")}>Área</button>
              </div>
              {profitabilityChartType==="pie" ? <SimplePie title="Distribución de ingresos por artículo" description="Cada porción representa la venta registrada de un artículo en el periodo." data={profitIncomePieRows} formatValue={(value)=>money(value,currencyCode)} /> :
               profitabilityChartType==="bars" ? <SimpleBars title="Composición del resultado" description="Compara ventas, costo de lo vendido, gastos, compras pagadas y resultado estimado." badge={profitabilityPeriod} data={[
                 {key:"revenue",label:"Ingresos",value:profitLineRevenue},
                 {key:"cost",label:"Costo de ventas",value:profitCostOfSales},
                 {key:"expenses",label:"Gastos",value:profitExpenseTotal},
                 {key:"purchases",label:"Compras pagadas",value:profitPurchasesPaid},
                 {key:"net",label:"Resultado",value:profitNet}
               ]} formatValue={(value)=>money(value,currencyCode)} /> :
               <SimpleArea title="Evolución de la rentabilidad" description="Contrasta ingresos, costo de venta, gastos y resultado por fecha." badge={profitabilityPeriod} data={profitabilityTimelineData} series={[{key:"revenue",label:"Ingresos",color:"#0F766E"},{key:"cost",label:"Costo vendido",color:"#D97706"},{key:"expenses",label:"Gastos",color:"#DB2777"},{key:"result",label:"Resultado",color:"#2563EB"}]} formatValue={(value)=>money(value,currencyCode)} footnote="Calculado con los artículos vendidos, sus costos guardados y los gastos registrados en el negocio activo." />}
              <div className="profitability-secondary-metrics">
                <div><span>Pendiente por cobrar</span><strong>{money(periodSales.reduce((sum, sale) => sum + Math.max(0, Number(sale.total_minor || 0) - Number(sale.amount_paid_minor || 0)), 0), currencyCode)}</strong></div>
                <div><span>Margen bruto</span><strong>{profitLineRevenue > 0 ? Math.round((profitGross / profitLineRevenue) * 100) + "%" : "—"}</strong></div>
              </div>
              <section className="profit-goal-panel panel">
                <div className="profit-breakdown-heading"><div><h3>Plan para ganar más el próximo mes</h3><p>Una simulación clara basada en el resultado del periodo seleccionado; no cambia tus registros.</p></div><label className="profit-goal-percent"><span>Meta de crecimiento</span><span><input type="number" min="1" max="500" step="1" value={targetProfitPercent} onChange={(e) => setTargetProfitPercent(e.target.value)} /> %</span></label></div>
                {profitNet > 0 ? <div className="profit-goal-grid">
                  <div><span>Resultado actual</span><strong>{money(profitNet, currencyCode)}</strong></div>
                  <div><span>Resultado objetivo</span><strong>{money(Math.round(profitNet * (1 + Math.max(0, Number(targetProfitPercent || 0)) / 100)), currencyCode)}</strong></div>
                  <div><span>Te falta generar</span><strong>{money(Math.round(profitNet * Math.max(0, Number(targetProfitPercent || 0)) / 100), currencyCode)}</strong></div>
                  <p>{profitLineRevenue > 0 && profitGross > 0 ? "Para alcanzar esa diferencia, podrías generar aproximadamente " + money(Math.ceil((profitNet * Math.max(0, Number(targetProfitPercent || 0)) / 100) / (profitGross / profitLineRevenue)), currencyCode) + " en ventas adicionales si mantienes el margen bruto actual, o reducir gastos por " + money(Math.round(profitNet * Math.max(0, Number(targetProfitPercent || 0)) / 100), currencyCode) + " en el periodo." : "No hay un margen bruto positivo suficiente para estimar ventas adicionales con fiabilidad. Revisa los precios y costos, o plantea una reducción de gastos de " + money(Math.round(profitNet * Math.max(0, Number(targetProfitPercent || 0)) / 100), currencyCode) + "."} Es una guía, no una garantía.</p>
                </div> : <p className="profit-empty-note">El resultado del periodo no es positivo todavía. Primero identifica los gastos que puedes reducir y revisa el margen de tus productos; cuando tengas una base positiva, el simulador calculará la meta porcentual.</p>}
                {profitNet > 0 && (profitByItem.length > 0 || expensesByCategory.length > 0) && <div className="profit-goal-actions"><strong>Por dónde empezar</strong>{profitByItem[0] && <p>Prioriza vender <b>{profitByItem[0].name}</b>: fue el artículo con mayor contribución bruta en este periodo ({money(profitByItem[0].revenue - profitByItem[0].cost, currencyCode)} en total). Mantén controlado su costo y evita descuentos que se coman el margen.</p>}{expensesByCategory[0] && <p>Revisa los gastos de <b>{expensesByCategory[0].name}</b>, la categoría con mayor valor registrado ({money(expensesByCategory[0].amount, currencyCode)}). Identifica qué parte se puede reducir sin afectar las ventas.</p>}</div>}
              </section>
              {profitNet>0 && <section className="planning-chart-section">
                <div className="profit-breakdown-heading"><div><h3>Planificación: resultado actual y meta</h3><p>Elige cómo visualizar el resultado actual y la meta calculada. Es una simulación, no un ingreso registrado.</p></div></div>
                <div className="chart-type-picker report-chart-type-picker" role="group" aria-label="Tipo de gráfico de Planificación">
                  <button type="button" className={planningChartType==="pie"?"active":""} aria-pressed={planningChartType==="pie"} onClick={()=>setPlanningChartType("pie")}>Pastel</button>
                  <button type="button" className={planningChartType==="bars"?"active":""} aria-pressed={planningChartType==="bars"} onClick={()=>setPlanningChartType("bars")}>Barras</button>
                  <button type="button" className={planningChartType==="area"?"active":""} aria-pressed={planningChartType==="area"} onClick={()=>setPlanningChartType("area")}>Área</button>
                </div>
                {planningChartType==="pie" ? <SimplePie title="Composición de la meta" description="El objetivo se compone del resultado actual más el aumento que deseas lograr." data={[
                  {key:"current",label:"Resultado actual",value:profitNet},
                  {key:"increase",label:"Aumento hasta la meta",value:Math.round(profitNet*Math.max(0,Number(targetProfitPercent||0))/100)}
                ]} formatValue={(value)=>money(value,currencyCode)} /> :
                 planningChartType==="bars" ? <SimpleBars title="Resultado y objetivo" description="Compara el resultado actual, el aumento y la meta." badge="Proyección" data={[
                  {key:"current",label:"Actual",value:profitNet},
                  {key:"target",label:"Meta",value:Math.round(profitNet*(1+Math.max(0,Number(targetProfitPercent||0))/100))},
                  {key:"increase",label:"Aumento",value:Math.round(profitNet*Math.max(0,Number(targetProfitPercent||0))/100)}
                ]} formatValue={(value)=>money(value,currencyCode)} footnote="Simulación matemática basada en el porcentaje seleccionado. No modifica tus operaciones." /> :
                 <SimpleArea title="Resultado histórico y meta de referencia" description="Observa el resultado registrado por periodo junto a una meta simulada basada en el porcentaje elegido." badge="Proyección" data={profitabilityTimelineData.map((row)=>({...row,target:Math.max(0,Number(row.result)||0)*(1+Math.max(0,Number(targetProfitPercent||0))/100)}))} series={[{key:"result",label:"Resultado registrado",color:"#0F766E"},{key:"target",label:"Meta simulada",color:"#D97706"}]} formatValue={(value)=>money(value,currencyCode)} footnote="La meta se calcula aplicando el porcentaje seleccionado a cada punto histórico. No es una predicción ni un ingreso futuro registrado." />}
              </section>}
              <section className="profit-allocations-panel panel">
                <div className="profit-breakdown-heading"><div><h3>Distribución opcional de la ganancia</h3><p>Activa solo los porcentajes que uses. Se calculan sobre un resultado positivo y no se restan de la rentabilidad contable.</p></div></div>
                <div className="profit-allocation-list">
                  {["diezmo","ahorro","otra"].map((key) => {
                    const allocation = allocationSettings[key];
                    const label = key === "diezmo" ? "Diezmo" : key === "ahorro" ? "Ahorro" : allocation.name || "Otra asignación";
                    const amount = Math.round(Math.max(0, profitNet) * Math.min(100, Math.max(0, Number(allocation.percent || 0))) / 100);
                    return <div className="profit-allocation-row" key={key}>
                      <label className="profit-allocation-toggle"><input type="checkbox" checked={Boolean(allocation.enabled)} disabled={!isBusinessOwner} onChange={(e) => setAllocationSettings((current) => ({ ...current, [key]: { ...current[key], enabled: e.target.checked } }))} /><span>{label}</span></label>
                      {key === "otra" && <input className="profit-allocation-name" aria-label="Nombre de la otra asignación" value={allocation.name || ""} maxLength={50} disabled={!isBusinessOwner} onChange={(e) => setAllocationSettings((current) => ({ ...current, otra: { ...current.otra, name: e.target.value } }))} placeholder="Nombre de la asignación" />}
                      <label className="profit-allocation-rate"><span>Porcentaje</span><span><input type="number" min="0" max="100" step="0.5" value={allocation.percent} disabled={!isBusinessOwner} onChange={(e) => setAllocationSettings((current) => ({ ...current, [key]: { ...current[key], percent: Math.min(100, Math.max(0, Number(e.target.value || 0))) } }))} /> %</span></label>
                      <strong>{allocation.enabled ? money(amount, currencyCode) : "Desactivado"}</strong>
                    </div>;
                  })}
                </div>
                <div className="profit-allocation-footer"><span>Distribución activa: {Object.values(allocationSettings).filter((item) => item.enabled).reduce((sum, item) => sum + Math.max(0, Number(item.percent || 0)), 0).toLocaleString("es-CO")}%</span>{isBusinessOwner && <button type="button" className="primary-button compact-button" onClick={saveAllocationSettings} disabled={busy}>{busy ? "Guardando…" : "Guardar porcentajes"}</button>}</div>
                <label className="profit-simulation-toggle"><input type="checkbox" checked={simulateAllocations} onChange={(e) => setSimulateAllocations(e.target.checked)} /><span>Restar asignaciones del resultado disponible <small>(solo simulación; no modifica la rentabilidad contable)</small></span></label>
                {simulateAllocations && <div className="profit-simulation-result"><span>Disponible después de asignaciones activas</span><strong>{money(Math.max(0, Math.max(0, profitNet) - Object.values(allocationSettings).filter((item) => item.enabled).reduce((sum, item) => sum + Math.round(Math.max(0, profitNet) * Math.min(100, Math.max(0, Number(item.percent || 0))) / 100), 0)), currencyCode)}</strong></div>}
                {!isBusinessOwner && <p className="helper-text">Solo el propietario puede cambiar estos porcentajes.</p>}
              </section>
              <div className="profitability-breakdowns">
                <section className="profit-breakdown panel">
                  <div className="profit-breakdown-heading"><div><h3>Costos por artículo vendido</h3><p>Lo que costaron los artículos que ya vendiste.</p></div></div>
                  {periodSaleItems.length ? <div className="profit-data-list">{Object.values(periodSaleItems.reduce((groups, item) => {
                    const name = item.item_name || "Artículo sin nombre";
                    if (!groups[name]) groups[name] = { name, quantity: 0, revenue: 0, cost: 0 };
                    groups[name].quantity += Number(item.quantity || 0);
                    groups[name].revenue += Number(item.line_total_minor || 0);
                    groups[name].cost += Math.round(Number(item.unit_cost_minor || 0) * Number(item.quantity || 0));
                    return groups;
                  }, {})).sort((a, b) => (b.revenue - b.cost) - (a.revenue - a.cost)).slice(0, 12).map((item) => <div className="profit-data-row" key={item.name}>
                    <div><strong>{item.name}</strong><span>{Number(item.quantity).toLocaleString("es-CO")} unidades · costo {money(item.cost, currencyCode)}</span></div>
                    <strong className={(item.revenue - item.cost) < 0 ? "profit-negative" : "profit-positive"}>{money(item.revenue - item.cost, currencyCode)}</strong>
                  </div>)}</div> : <p className="profit-empty-note">Todavía no hay ventas con artículos en este periodo.</p>}
                </section>
                <section className="profit-breakdown panel">
                  <div className="profit-breakdown-heading"><div><h3>Gastos por categoría</h3><p>Las salidas de dinero que has anotado.</p></div></div>
                  {expensesByCategory.length ? <div className="profit-data-list">{expensesByCategory.map((group) => <div className="profit-data-row" key={group.name}>
                    <div><strong>{group.name}</strong><span>{group.count} {group.count === 1 ? "registro" : "registros"}</span></div><strong>{money(group.amount, currencyCode)}</strong>
                  </div>)}</div> : <p className="profit-empty-note">Todavía no hay gastos registrados en este periodo.</p>}
                </section>
              </div>
              <p className="profitability-disclaimer">Este cálculo es orientativo: usa el costo que quedó guardado en cada venta y los gastos que registraste. No incluye gastos que aún no hayas anotado ni calcula impuestos, depreciación o ajustes contables. Las compras de inventario no se restan otra vez porque su costo se reconoce al vender el artículo.</p>
              {!periodSales.length && !periodExpenses.length && <div className="empty-state"><span className="empty-icon">◷</span><h3>No hay movimientos en este periodo</h3><p>Cuando registres ventas y gastos, los números aparecerán aquí sin datos de ejemplo.</p><button type="button" className="secondary-button" onClick={() => navigate("sales")}>Ir a ventas</button></div>}
            </>}
          </section>
        ) : (screen === "purchases" || screen === "suppliers") ? (
          <section className="purchases-page">
            {screen === "purchases" && <div className="products-intro">
              <div><h2>Movimientos del negocio</h2><p>Registra las compras de inventario, los pagos a proveedores y los gastos de funcionamiento sin duplicar operaciones.</p></div>
            </div>}
            {screen === "purchases" && <div className="purchase-module-tabs" role="tablist" aria-label="Compras y gastos">
              {canViewPurchases && <button type="button" role="tab" aria-selected={effectivePurchaseTab === "purchases"} className={effectivePurchaseTab === "purchases" ? "purchase-tab active" : "purchase-tab"} onClick={() => { setPurchaseModuleTab("purchases"); setShowSupplierForm(false); }}>Compras <span>{purchasesCount}</span></button>}
              {canViewExpenses && <button type="button" role="tab" aria-selected={effectivePurchaseTab === "expenses"} className={effectivePurchaseTab === "expenses" ? "purchase-tab active" : "purchase-tab"} onClick={() => { setPurchaseModuleTab("expenses"); setShowSupplierForm(false); }}>Gastos <span>{expensesCount}</span></button>}
            </div>}
            {screen === "purchases" && effectivePurchaseTab !== "suppliers" && <div className="sales-date-toolbar panel"><div className="stats-period-buttons" role="group" aria-label="Periodo de compras y gastos">{[["day","Hoy"],["week","Semana"],["month","Mes"],["year","Año"],["custom","Rango"],["all","Todo"]].map(([value,label]) => <button type="button" key={value} className={purchasePeriod === value ? "stats-period-button active" : "stats-period-button"} aria-pressed={purchasePeriod === value} onClick={() => {setPurchasePeriod(value);setPurchasesPage(1);setExpensesPage(1);}}>{label}</button>)}</div>{purchasePeriod === "custom" && <div className="stats-custom-dates"><label><span>Desde</span><input type="date" value={purchaseDateFrom} max={purchaseDateTo || todayInBogota()} onChange={(e) => {setPurchaseDateFrom(e.target.value);setPurchasesPage(1);setExpensesPage(1);}} /></label><label><span>Hasta</span><input type="date" value={purchaseDateTo} min={purchaseDateFrom || undefined} max={todayInBogota()} onChange={(e) => {setPurchaseDateTo(e.target.value);setPurchasesPage(1);setExpensesPage(1);}} /></label></div>}<p>{purchasePeriod === "day" ? "Movimientos de hoy" : purchasePeriod === "all" ? "Todo el historial" : purchasePeriod === "custom" ? "Del " + purchaseDateFrom + " al " + purchaseDateTo : purchasePeriod === "week" ? "Desde el lunes de esta semana" : purchasePeriod === "month" ? "Desde el primer día del mes" : "Desde el primer día del año"}</p></div>}
            {effectivePurchaseTab === "purchases" ? <>
              <div className="products-intro purchase-subintro">
                <div><h3>Compras de inventario</h3><p>Al guardar una compra, las existencias se suman en un solo paso.</p></div>
                <div className="purchase-toolbar-actions">
                  {canManagePurchases && <button type="button" className="primary-button compact-button" onClick={() => { setShowPurchaseForm((open) => !open); setError(""); setNotice(""); }}>{showPurchaseForm ? "Cancelar compra" : "+ Nueva compra"}</button>}
                </div>
              </div>
              {canPermission("suppliers_manage") && showSupplierForm && <form className="purchase-form panel" onSubmit={addSupplier}>
                <div className="purchase-form-heading"><div><p className="eyebrow">CONTACTOS</p><h3>Nuevo proveedor</h3></div></div>
                <div className="purchase-form-grid">
                  <label><span className="field-label-heading">Nombre del proveedor *</span><input value={supplierDraft.name} onChange={(e) => setSupplierDraft((d) => ({ ...d, name: e.target.value }))} maxLength={180} required placeholder="Nombre o empresa" /></label>
                  <label><span className="field-label-heading">NIT o documento</span><input value={supplierDraft.tax_id} onChange={(e) => setSupplierDraft((d) => ({ ...d, tax_id: e.target.value }))} maxLength={80} placeholder="Opcional" /></label>
                  <label><span className="field-label-heading">Teléfono</span><input type="tel" value={supplierDraft.phone} onChange={(e) => setSupplierDraft((d) => ({ ...d, phone: e.target.value }))} maxLength={60} placeholder="Número de contacto" /></label>
                  <label><span className="field-label-heading">Correo</span><input type="email" value={supplierDraft.email} onChange={(e) => setSupplierDraft((d) => ({ ...d, email: e.target.value }))} maxLength={254} placeholder="proveedor@correo.com" /></label>
                  <label className="purchase-span-two"><span className="field-label-heading">Dirección</span><input value={supplierDraft.address} onChange={(e) => setSupplierDraft((d) => ({ ...d, address: e.target.value }))} maxLength={300} placeholder="Dirección del proveedor" /></label>
                  <label className="purchase-span-two"><span className="field-label-heading">Notas</span><input value={supplierDraft.notes} onChange={(e) => setSupplierDraft((d) => ({ ...d, notes: e.target.value }))} maxLength={1000} placeholder="Información útil" /></label>
                </div>
                <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowSupplierForm(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={busy}>{busy ? "Guardando…" : "Guardar proveedor"}</button></div>
              </form>}
              {canManagePurchases && showPurchaseForm && <form className="purchase-form panel" onSubmit={createPurchase}>
                <div className="purchase-form-heading"><div><p className="eyebrow">ENTRADA DE INVENTARIO</p><h3>Nueva compra</h3></div><span className="purchase-form-hint">Se guarda con su historial</span></div>
                <div className="purchase-form-grid">
                  <label><span className="field-label-heading">Fecha de compra *</span><input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} required /></label>
                  <label><span className="field-label-heading">Proveedor<FieldHelp enabled={contextualHelpEnabled} text="Selecciona el proveedor al que corresponde esta compra; puedes dejarlo sin asignar." /></span><select value={purchaseSupplierId} onChange={(e) => { if (e.target.value === "__create_supplier__") { setShowQuickPurchaseSupplierForm(true); return; } setPurchaseSupplierId(e.target.value); }}><option value="">Sin proveedor</option>{suppliers.map((supplier) => <option value={supplier.id} key={supplier.id}>{supplier.name}</option>)}{canPermission("suppliers_manage") && <option value="__create_supplier__">＋ Nuevo proveedor…</option>}</select></label>
                  {showQuickPurchaseSupplierForm && canPermission("suppliers_manage") && <div className="inline-create-panel quick-purchase-supplier" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}>
                    <strong>Nuevo proveedor</strong><p className="inline-create-hint">Se guardará como contacto y quedará seleccionado en esta compra.</p>
                    <div className="inline-create-fields-grid">
                      <label><span>Nombre o empresa *</span><input value={supplierDraft.name} onChange={(event) => setSupplierDraft((current) => ({...current,name:event.target.value}))} maxLength={180} placeholder="Nombre del proveedor" /></label>
                      <label><span>Teléfono</span><input type="tel" value={supplierDraft.phone} onChange={(event) => setSupplierDraft((current) => ({...current,phone:event.target.value}))} maxLength={60} /></label>
                      <label><span>Correo</span><input type="email" value={supplierDraft.email} onChange={(event) => setSupplierDraft((current) => ({...current,email:event.target.value}))} maxLength={254} /></label>
                    </div>
                    <div className="inline-create-actions"><button type="button" className="primary-button" disabled={busy || !supplierDraft.name.trim()} onClick={() => addSupplier()}>{busy ? "Guardando…" : "Guardar y seleccionar"}</button><button type="button" className="text-button" onClick={() => {setShowQuickPurchaseSupplierForm(false);setSupplierDraft(blankSupplier);}}>Cancelar</button></div>
                  </div>}
                  <label><span className="field-label-heading">Vincular con un producto de tu inventario<FieldHelp enabled={contextualHelpEnabled} text="Si el producto ya está en tu inventario, selecciónalo aquí. Al guardar la compra, se sumarán las existencias y se usará su nombre y costo registrado como punto de partida." /></span><select value={purchaseProductChoice} onChange={(e) => { const id = e.target.value; const product = purchaseProducts.find((p) => p.id === id); setPurchaseProductChoice(id); setPurchaseItemName(product?.name || ""); setPurchaseUnitCost(product ? String(Number(product.cost_price_minor || 0) / (10 ** currencyDigits(currencyCode))) : ""); }}><option value="">No vincular a un producto existente</option>{purchaseProducts.map((product) => <option value={product.id} key={product.id}>{product.name}{product.sku ? " · " + product.sku : ""}</option>)}</select></label>
                  <label><span className="field-label-heading">¿Qué compraste? *</span><input value={purchaseItemName} onChange={(e) => { setPurchaseItemName(e.target.value); if (purchaseProductChoice) setPurchaseProductChoice(""); }} maxLength={180} placeholder="Ej. avena, frascos, etiquetas…" required={purchaseCart.length === 0} /></label>
                  <label><span className="field-label-heading">Cantidad *</span><input type="number" min="0.001" step="0.001" value={purchaseQuantity} onChange={(e) => setPurchaseQuantity(e.target.value)} required={purchaseCart.length === 0} /></label>
                  <label><span className="field-label-heading">Costo por unidad *</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={purchaseUnitCost} onChange={(e) => setPurchaseUnitCost(e.target.value)} placeholder="0" required={purchaseCart.length === 0} /></label>
                </div>
                <button type="button" className="secondary-button purchase-add-item" onClick={addPurchaseLine}>＋ Añadir artículo</button>
                {purchaseCart.length > 0 && <div className="purchase-cart">
                  <div className="purchase-cart-heading"><strong>Artículos de la compra</strong><span>{purchaseCart.length}</span></div>
                  {purchaseCart.map((item) => <div className="purchase-cart-row" key={item.line_id}>
                    <div><strong>{item.name}</strong><span>{item.product_id ? "Vinculado a tu inventario" : "Sin vínculo a inventario"} · {money(toMinorUnits(item.unit_cost, currencyCode), currencyCode)} por {item.unit_name}</span></div>
                    <label><span className="field-label-heading">Cantidad</span><input type="number" min="0.001" step="0.001" value={item.quantity} onChange={(e) => setPurchaseCart((current) => current.map((line) => line.line_id === item.line_id ? { ...line, quantity: e.target.value } : line))} /></label>
                    <strong>{money(Math.round(toMinorUnits(item.unit_cost, currencyCode) * Number(item.quantity || 0)), currencyCode)}</strong>
                    <button type="button" className="text-button danger-text" onClick={() => setPurchaseCart((current) => current.filter((line) => line.line_id !== item.line_id))}>Quitar</button>
                  </div>)}
                  <div className="purchase-cart-subtotal"><span>Subtotal</span><strong>{money(purchaseCart.reduce((sum, item) => sum + Math.round(toMinorUnits(item.unit_cost, currencyCode) * Number(item.quantity || 0)), 0), currencyCode)}</strong></div>
                </div>}
                <div className="purchase-form-grid purchase-money-fields">
                  <label><span className="field-label-heading">Impuestos u otros cargos<FieldHelp enabled={contextualHelpEnabled} text="Registra impuestos, transporte u otros cobros que se suman al costo de la compra." /></span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={purchaseTax} onChange={(e) => setPurchaseTax(e.target.value)} /></label>
                  <label><span className="field-label-heading">Abono realizado<FieldHelp enabled={contextualHelpEnabled} text="Dinero que pagas ahora al proveedor como parte de esta compra. Si es menor que el total, queda un saldo por pagar." /></span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={purchasePayment} onChange={(e) => setPurchasePayment(e.target.value)} /></label>
                  <div className="payment-method-field"><span className="field-label-heading">Forma de pago inicial<FieldHelp enabled={contextualHelpEnabled} text="Indica cómo pagaste esta compra al proveedor." /></span><PaymentMethodTiles value={purchaseInitialPaymentMethod} onChange={(method) => { setPurchaseInitialPaymentMethod(method); if (method === "Efectivo") setPurchaseInitialBankAccountId(""); }} ariaLabel="Medio de pago inicial de la compra" /></div>
{purchaseInitialPaymentMethod !== "Efectivo" && Number(purchasePayment || 0) > 0 && visibleBankAccountOptions.length > 0 && <label className="bank-linked-account-field"><span>Cuenta de donde salió el pago</span><select value={purchaseInitialBankAccountId} onChange={(e) => setPurchaseInitialBankAccountId(e.target.value)}><option value="">No asociar a una cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>}
                  <label className="purchase-span-two"><span className="field-label-heading">Nota<FieldHelp enabled={contextualHelpEnabled} text="Añade un comentario sobre la compra, como número de factura, transporte o detalles de entrega." /></span><input value={purchaseNotes} onChange={(e) => setPurchaseNotes(e.target.value)} maxLength={1500} placeholder="Factura, transporte, entrega…" /></label>
                </div>
                <div className="purchase-total-summary"><span>Total estimado</span><strong>{money(purchaseCart.reduce((sum, item) => sum + Math.round(toMinorUnits(item.unit_cost, currencyCode) * Number(item.quantity || 0)), 0) + toMinorUnits(purchaseTax || 0, currencyCode), currencyCode)}</strong></div>
                <p className="helper-text">Solo los artículos vinculados a un producto suman existencias. Los artículos libres quedan registrados en la compra, sin cambiar tu inventario.</p>
                <div className="form-actions"><button type="button" className="secondary-button" onClick={() => { setShowPurchaseForm(false); setPurchaseCart([]); }}>Cancelar</button><button type="submit" className="primary-button" disabled={busy || !purchaseCart.length}>{busy ? "Guardando…" : "Guardar compra"}</button></div>
              </form>}
              {purchaseLoading ? <div className="empty-state">Cargando compras…</div> : purchaseRows.length ? <div className="purchase-record-list">{purchaseRows.map((purchase) => {
                const supplier = suppliers.find((item) => item.id === purchase.supplier_id);
                const items = purchaseItemsByPurchase[purchase.id] || [];
                const pending = Math.max(0, Number(purchase.total_minor) - Number(purchase.amount_paid_minor));
                return <article className={"purchase-record panel mobile-detail-trigger" + (purchasePaymentFormFor === purchase.id ? " is-payment-editing" : "")} key={purchase.id} onClick={(event) => { if (event.target.closest("button,a,input,select,textarea,[data-stop-record-open]")) return; setSelectedRecordDetail({type:"Compra",title:purchase.purchase_number || "Compra",fields:[{label:"Fecha",value:purchase.purchased_at ? new Date(purchase.purchased_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"}) : "Sin definir"},{label:"Proveedor",value:supplier?.name || "Sin proveedor"},{label:"Estado",value:purchaseStatusLabel(purchase.status)},{label:"Total",value:money(purchase.total_minor,purchase.currency_code||currencyCode)},{label:"Pagado",value:money(purchase.amount_paid_minor,purchase.currency_code||currencyCode)},{label:"Pendiente",value:money(pending,purchase.currency_code||currencyCode)},{label:"Artículos",value:items.map(item=>item.item_name+" × "+Number(item.quantity).toLocaleString("es-CO")+" — "+money(item.line_total_minor,purchase.currency_code||currencyCode)).join("\n")||"Sin artículos"},{label:"Historial de pagos",value:(purchase.payments||[]).map(p=>money(p.amount_minor,purchase.currency_code||currencyCode)+" · "+p.payment_method+" · "+new Date(p.paid_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})+(p.notes?" · "+p.notes:"")).join("\n")||"Sin pagos"}],notes:purchase.notes}); }}>
                  <div className="purchase-record-top"><div><strong>{purchase.purchase_number}</strong><span>{purchase.purchased_at ? new Date(purchase.purchased_at).toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" }) : "Fecha sin definir"}{supplier ? " · " + supplier.name : ""}</span></div><span className={"status-pill " + (purchase.status === "paid" ? "status-active" : purchase.status === "canceled" || purchase.status === "refunded" ? "status-inactive" : "status-unpublished")}>{purchaseStatusLabel(purchase.status)}</span></div>
                  {items.length > 0 && <div className="purchase-record-items">{items.map((item) => <div key={item.id}><span>{item.item_name} × {Number(item.quantity).toLocaleString("es-CO")}</span><strong>{money(item.line_total_minor, purchase.currency_code || currencyCode)}</strong></div>)}</div>}
                  <div className="purchase-record-totals"><div><span>Total</span><strong>{money(purchase.total_minor, purchase.currency_code || currencyCode)}</strong></div><div><span>Pagado</span><strong>{money(purchase.amount_paid_minor, purchase.currency_code || currencyCode)}</strong></div><div><span>Pendiente</span><strong>{money(pending, purchase.currency_code || currencyCode)}</strong></div></div>
                  <div className="purchase-record-row-actions">{canManagePurchases && pending > 0 && !["canceled","refunded","draft"].includes(purchase.status) && <button type="button" className="secondary-button action-small" onClick={(event) => { event.stopPropagation(); purchasePaymentFormFor === purchase.id ? setPurchasePaymentFormFor(null) : openPurchasePaymentForm(purchase); }}>{purchasePaymentFormFor === purchase.id ? "Cancelar pago" : "＋ Registrar pago"}</button>}<span>Ver ficha completa ↗</span></div>
                  <div className="purchase-payment-history"><div className="purchase-payment-history-heading"><strong>Historial de pagos</strong><span>{(purchase.payments || []).length} {(purchase.payments || []).length === 1 ? "pago" : "pagos"}</span></div>
                    {(purchase.payments || []).length ? <div className="purchase-payment-list">{purchase.payments.map((payment) => <div className="purchase-payment-row" key={payment.id}><div><strong>{money(payment.amount_minor,purchase.currency_code||currencyCode)}</strong><span>{payment.payment_method} · {new Date(payment.paid_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})}</span>{payment.notes&&<small>{payment.notes}</small>}</div></div>)}</div> : <p className="purchase-payment-empty">No hay pagos registrados.</p>}
                    {canManagePurchases && pending > 0 && !["canceled","refunded","draft"].includes(purchase.status) && <button type="button" className="secondary-button purchase-register-payment-button" onClick={() => purchasePaymentFormFor === purchase.id ? setPurchasePaymentFormFor(null) : openPurchasePaymentForm(purchase)}>{purchasePaymentFormFor === purchase.id ? "Cancelar" : "＋ Registrar pago"}</button>}
                    {canManagePurchases && purchasePaymentFormFor === purchase.id && <form className="purchase-payment-form" onSubmit={(event) => recordPurchasePayment(event,purchase)}>
                      <label><span className="field-label-heading">Valor del pago<FieldHelp enabled={contextualHelpEnabled} text="Importe que estás pagando al proveedor ahora. No puede superar lo que falta por pagar." /></span><input type="number" min="0.01" max={pending/(10**currencyDigits(currencyCode))} step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={purchasePaymentAmount} onChange={(e) => setPurchasePaymentAmount(e.target.value)} required /></label>
                      <div className="payment-method-field"><span className="field-label-heading">Forma de pago<FieldHelp enabled={contextualHelpEnabled} text="Elige el medio usado para hacer este pago al proveedor." /></span><PaymentMethodTiles value={purchasePaymentMethod} onChange={(method) => { setPurchasePaymentMethod(method); if (method === "Efectivo") setPurchasePaymentBankAccountId(""); }} ariaLabel="Medio de pago del abono de compra" /></div>
{purchasePaymentMethod !== "Efectivo" && visibleBankAccountOptions.length > 0 && <label className="bank-linked-account-field"><span>Cuenta de donde salió el pago</span><select value={purchasePaymentBankAccountId} onChange={(e) => setPurchasePaymentBankAccountId(e.target.value)}><option value="">No asociar a una cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>}
                      <label><span className="field-label-heading">Fecha del pago</span><input type="date" max={todayInBogota()} value={purchasePaymentDate} onChange={(e) => setPurchasePaymentDate(e.target.value)} required /></label>
                      <label className="purchase-payment-notes"><span className="field-label-heading">Nota<FieldHelp enabled={contextualHelpEnabled} text="Añade una referencia breve para recordar este pago, como el número de una transferencia." /></span><input value={purchasePaymentNotes} onChange={(e) => setPurchasePaymentNotes(e.target.value)} maxLength={1000} placeholder="Referencia o detalle del pago" /></label>
                      <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setPurchasePaymentFormFor(null)}>Cancelar</button><button type="submit" className="primary-button" disabled={purchasePaymentSaving}>{purchasePaymentSaving ? "Registrando…" : "Guardar pago"}</button></div>
                    </form>}
                  </div>
                  {purchase.notes && <p className="purchase-note">{purchase.notes}</p>}
                </article>;
              })}</div> : <div className="empty-state"><span className="empty-icon">▤</span><h3>No hay compras en este periodo</h3><p>Prueba otra fecha o elige «Todo» para consultar el historial completo. No cargamos operaciones de ejemplo.</p>{canManagePurchases && <button type="button" className="primary-button" onClick={() => setShowPurchaseForm(true)}>+ Nueva compra</button>}</div>}
              {!purchaseLoading && purchasesCount > purchasesPageSize && <div className="pagination-bar purchase-pagination"><span className="count-label">Mostrando {(purchasesPage-1)*purchasesPageSize+1}–{Math.min(purchasesPage*purchasesPageSize,purchasesCount)} de {purchasesCount} compras</span><div className="pagination-controls"><button type="button" className="secondary-button" disabled={purchasesPage<=1} onClick={()=>setPurchasesPage((page)=>Math.max(1,page-1))}>Anterior</button><span className="page-label">{purchasesPage} / {Math.ceil(purchasesCount/purchasesPageSize)}</span><button type="button" className="secondary-button" disabled={purchasesPage>=Math.ceil(purchasesCount/purchasesPageSize)} onClick={()=>setPurchasesPage((page)=>page+1)}>Siguiente</button></div></div>}
              {suppliers.length > 0 && <details className="supplier-directory panel"><summary>Proveedores guardados ({suppliers.length})</summary><div className="supplier-directory-list">{suppliers.map((supplier) => <div className="supplier-directory-row" key={supplier.id}><strong>{supplier.name}</strong><span>{supplier.phone || supplier.email || supplier.tax_id || "Sin contacto registrado"}</span></div>)}</div></details>}
            </> : effectivePurchaseTab === "suppliers" ? <>
              <div className="products-intro purchase-subintro">
                <div><h3>{screen === "suppliers" ? "Tus contactos de compra" : "Directorio de proveedores"}</h3><p>Organiza los datos de las personas y empresas que te suministran materiales y productos.</p></div>
                {canPermission("suppliers_manage") && <button type="button" className="primary-button compact-button" onClick={() => { setShowSupplierForm((open) => !open); setSupplierDraft(blankSupplier); setError(""); }}>{showSupplierForm ? "Cancelar" : "+ Nuevo proveedor"}</button>}
              </div>
              {canPermission("suppliers_manage") && showSupplierForm && <form className="purchase-form panel" onSubmit={addSupplier}>
                <div className="purchase-form-heading"><div><p className="eyebrow">CONTACTOS</p><h3>Nuevo proveedor</h3></div></div>
                <div className="purchase-form-grid">
                  <label><span className="field-label-heading">Nombre del proveedor *</span><input value={supplierDraft.name} onChange={(e) => setSupplierDraft((d) => ({ ...d, name: e.target.value }))} maxLength={180} required placeholder="Nombre o empresa" /></label>
                  <label><span className="field-label-heading">NIT o documento</span><input value={supplierDraft.tax_id} onChange={(e) => setSupplierDraft((d) => ({ ...d, tax_id: e.target.value }))} maxLength={80} placeholder="Opcional" /></label>
                  <label><span className="field-label-heading">Teléfono</span><input type="tel" value={supplierDraft.phone} onChange={(e) => setSupplierDraft((d) => ({ ...d, phone: e.target.value }))} maxLength={60} placeholder="Número de contacto" /></label>
                  <label><span className="field-label-heading">Correo</span><input type="email" value={supplierDraft.email} onChange={(e) => setSupplierDraft((d) => ({ ...d, email: e.target.value }))} maxLength={254} placeholder="proveedor@correo.com" /></label>
                  <label className="purchase-span-two"><span className="field-label-heading">Dirección</span><input value={supplierDraft.address} onChange={(e) => setSupplierDraft((d) => ({ ...d, address: e.target.value }))} maxLength={300} placeholder="Dirección del proveedor" /></label>
                  <label className="purchase-span-two"><span className="field-label-heading">Notas</span><input value={supplierDraft.notes} onChange={(e) => setSupplierDraft((d) => ({ ...d, notes: e.target.value }))} maxLength={1000} placeholder="Información útil" /></label>
                </div>
                <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowSupplierForm(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={busy}>{busy ? "Guardando…" : "Guardar proveedor"}</button></div>
              </form>}
              {purchaseLoading ? <div className="empty-state">Cargando proveedores…</div> : suppliers.length ? <div className="supplier-directory-list supplier-directory-page">{suppliers.map((supplier) => <article className="supplier-directory-row panel mobile-detail-trigger" key={supplier.id} tabIndex={0} role="button" onClick={() => { if (window.matchMedia("(max-width: 640px)").matches) setSelectedRecordDetail({ type: "Proveedor", title: supplier.name, fields: [{label:"NIT o documento",value:supplier.tax_id},{label:"Teléfono",value:supplier.phone},{label:"Correo",value:supplier.email},{label:"Dirección",value:supplier.address}], notes:supplier.notes }); }} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && window.matchMedia("(max-width: 640px)").matches) { event.preventDefault(); setSelectedRecordDetail({ type: "Proveedor", title: supplier.name, fields: [{label:"NIT o documento",value:supplier.tax_id},{label:"Teléfono",value:supplier.phone},{label:"Correo",value:supplier.email},{label:"Dirección",value:supplier.address}], notes:supplier.notes }); } }}><div><strong>{supplier.name}</strong><span>{supplier.tax_id || "Sin NIT/documento"}</span></div><div><span>{supplier.phone || "Sin teléfono"}</span><span>{supplier.email || "Sin correo"}</span></div><div><span>{supplier.address || "Sin dirección"}</span>{supplier.notes && <small>{supplier.notes}</small>}</div></article>)}</div> : <div className="empty-state"><span className="empty-icon">♧</span><h3>Aún no hay proveedores</h3><p>Agrega tus proveedores para asociarlos a las compras y gastos. No hay datos de ejemplo.</p>{canPermission("suppliers_manage") && <button type="button" className="primary-button" onClick={() => setShowSupplierForm(true)}>+ Nuevo proveedor</button>}</div>}
            </> : <>
              <div className="products-intro purchase-subintro">
                <div><h3>Salidas de dinero</h3><p>Anota arriendo, servicios, reparaciones, herramientas y otros pagos para tener el costo real de funcionamiento.</p></div>
                {canManageExpenses && <button type="button" className="primary-button compact-button" onClick={() => { setShowExpenseForm((open) => !open); setError(""); setNotice(""); }}>{showExpenseForm ? "Cancelar gasto" : "+ Nuevo gasto"}</button>}
              </div>
              {canManageExpenses && showExpenseForm && <form className="purchase-form panel" onSubmit={addExpense}>
                <div className="purchase-form-heading"><div><p className="eyebrow">SALIDA DE DINERO</p><h3>Nuevo gasto</h3></div></div>
                <div className="purchase-form-grid">
                  <label><span className="field-label-heading">Descripción *</span><input value={expenseDraft.description} onChange={(e) => setExpenseDraft((d) => ({ ...d, description: e.target.value }))} maxLength={220} required placeholder="Ej. Reparación de una máquina" /></label>
                  <label><span className="field-label-heading">Categoría<FieldHelp enabled={contextualHelpEnabled} text="Selecciona el tipo de gasto para agruparlo y entender en qué se usa el dinero." /></span><select value={expenseDraft.category} onChange={(e) => setExpenseDraft((d) => ({ ...d, category: e.target.value }))}><option>Operativo</option><option>Arriendo</option><option>Servicios públicos</option><option>Transporte</option><option>Publicidad</option><option>Reparaciones y mantenimiento</option><option>Muebles y equipos</option><option>Honorarios y servicios</option><option>Comisiones bancarias</option><option>Otro</option></select></label>
                  <label><span className="field-label-heading">Valor *<FieldHelp enabled={contextualHelpEnabled} text="Monto del gasto. Queda registrado como salida de dinero y se considera en el cálculo de rentabilidad." /></span><input type="number" min="0.01" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={expenseDraft.amount} onChange={(e) => setExpenseDraft((d) => ({ ...d, amount: e.target.value }))} required placeholder="0" /></label>
                  <label><span className="field-label-heading">Fecha *</span><input type="date" value={expenseDraft.expense_date} onChange={(e) => setExpenseDraft((d) => ({ ...d, expense_date: e.target.value }))} required /></label>
                  <div className="payment-method-field"><span className="field-label-heading">Forma de pago<FieldHelp enabled={contextualHelpEnabled} text="Elige el medio utilizado para pagar este gasto." /></span><PaymentMethodTiles value={expenseDraft.payment_method || "Efectivo"} onChange={(method) => setExpenseDraft((d) => ({ ...d, payment_method: method, bank_account_id: method === "Efectivo" ? "" : d.bank_account_id }))} ariaLabel="Medio de pago del gasto" /></div>
{expenseDraft.payment_method !== "Efectivo" && visibleBankAccountOptions.length > 0 && <label className="bank-linked-account-field"><span>Cuenta desde la que pagaste</span><select value={expenseDraft.bank_account_id || ""} onChange={(e) => setExpenseDraft((d) => ({ ...d, bank_account_id: e.target.value }))}><option value="">No asociar a una cuenta</option>{visibleBankAccountOptions.map((a) => <option key={a.id} value={a.id}>{a.bank_name} · {a.account_name}{a.account_last4 ? " · •••• " + a.account_last4 : ""}</option>)}</select></label>}
                  <label><span className="field-label-heading">Proveedor<FieldHelp enabled={contextualHelpEnabled} text="Vincula el gasto con un proveedor si corresponde." /></span><select value={expenseDraft.supplier_id} onChange={(e) => { if (e.target.value === "__create_expense_supplier__") { setShowQuickExpenseSupplierForm(true); setError(""); return; } setExpenseDraft((d) => ({ ...d, supplier_id: e.target.value })); }}><option value="">Sin proveedor</option>{suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}{canPermission("suppliers_manage")&&<option value="__create_expense_supplier__">＋ Nuevo proveedor…</option>}</select></label>
                  {showQuickExpenseSupplierForm && canPermission("suppliers_manage") && <div className="inline-create-panel quick-expense-supplier full-span"><strong>Nuevo proveedor</strong><p className="inline-create-hint">Se guardará como contacto y quedará seleccionado en este gasto, sin borrar los datos del formulario.</p><div className="inline-create-fields-grid"><label><span className="field-label-heading">Nombre *</span><input value={supplierDraft.name} onChange={(e) => setSupplierDraft((d) => ({ ...d, name: e.target.value }))} maxLength={180} required /></label><label><span className="field-label-heading">NIT o documento</span><input value={supplierDraft.tax_id} onChange={(e) => setSupplierDraft((d) => ({ ...d, tax_id: e.target.value }))} maxLength={80} /></label><label><span className="field-label-heading">Teléfono</span><input type="tel" value={supplierDraft.phone} onChange={(e) => setSupplierDraft((d) => ({ ...d, phone: e.target.value }))} maxLength={60} /></label><label><span className="field-label-heading">Correo</span><input type="email" value={supplierDraft.email} onChange={(e) => setSupplierDraft((d) => ({ ...d, email: e.target.value }))} maxLength={254} /></label><label className="inline-create-span-two"><span className="field-label-heading">Dirección</span><input value={supplierDraft.address} onChange={(e) => setSupplierDraft((d) => ({ ...d, address: e.target.value }))} maxLength={300} /></label></div><div className="inline-create-actions"><button type="button" className="primary-button" disabled={busy || !supplierDraft.name.trim()} onClick={() => addSupplier()}>{busy ? "Guardando…" : "Guardar y seleccionar"}</button><button type="button" className="text-button" onClick={() => { setShowQuickExpenseSupplierForm(false); setSupplierDraft(blankSupplier); }}>Cancelar</button></div></div>}
                  <label className="purchase-span-two"><span className="field-label-heading">Nota<FieldHelp enabled={contextualHelpEnabled} text="Guarda una referencia, factura o detalle útil para reconocer este gasto después." /></span><input value={expenseDraft.notes} onChange={(e) => setExpenseDraft((d) => ({ ...d, notes: e.target.value }))} maxLength={1500} placeholder="Factura, referencia o detalle" /></label>
                </div>
                <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowExpenseForm(false)}>Cancelar</button><button type="submit" className="primary-button" disabled={busy}>{busy ? "Guardando…" : "Guardar gasto"}</button></div>
              </form>}
              {purchaseLoading ? <div className="empty-state">Cargando gastos…</div> : expenseRows.length ? <div className="expense-record-list">{expenseRows.map((expense) => {
                const supplier = suppliers.find((item) => item.id === expense.supplier_id);
                return <article className="expense-record panel mobile-detail-trigger" key={expense.id} onClick={(event) => { if (event.target.closest("button,a,input,select,textarea,[data-stop-record-open]")) return; setSelectedRecordDetail({type:"Gasto",title:expense.description || "Gasto",fields:[{label:"Categoría",value:expense.category},{label:"Fecha",value:new Date(expense.expense_date+"T12:00:00-05:00").toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})},{label:"Valor",value:money(expense.amount_minor,expense.currency_code||currencyCode)},{label:"Forma de pago",value:expense.payment_method},{label:"Proveedor",value:supplier?.name || "Sin proveedor"}],notes:expense.notes}); }}>
                  <div className="expense-record-main"><span className="expense-category">{expense.category}</span><strong>{expense.description}</strong><span>{new Date(expense.expense_date + "T12:00:00-05:00").toLocaleDateString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium" })}{supplier ? " · " + supplier.name : ""}{expense.payment_method ? " · " + expense.payment_method : ""}</span>{expense.notes && <small>{expense.notes}</small>}</div>
                  <strong className="expense-amount">{money(expense.amount_minor, expense.currency_code || currencyCode)}</strong>
                </article>;
              })}</div> : <div className="empty-state"><span className="empty-icon">↘</span><h3>No hay gastos en este periodo</h3><p>Prueba otra fecha o elige «Todo» para consultar el historial completo. No hay datos de ejemplo.</p>{canManageExpenses && <button type="button" className="primary-button" onClick={() => setShowExpenseForm(true)}>+ Nuevo gasto</button>}</div>}
              {!purchaseLoading && expensesCount > expensesPageSize && <div className="pagination-bar purchase-pagination"><span className="count-label">Mostrando {(expensesPage-1)*expensesPageSize+1}–{Math.min(expensesPage*expensesPageSize,expensesCount)} de {expensesCount} gastos</span><div className="pagination-controls"><button type="button" className="secondary-button" disabled={expensesPage<=1} onClick={()=>setExpensesPage((page)=>Math.max(1,page-1))}>Anterior</button><span className="page-label">{expensesPage} / {Math.ceil(expensesCount/expensesPageSize)}</span><button type="button" className="secondary-button" disabled={expensesPage>=Math.ceil(expensesCount/expensesPageSize)} onClick={()=>setExpensesPage((page)=>page+1)}>Siguiente</button></div></div>}
            </>}
          </section>
        ) : screen === "products" ? (

          <section className="products-page">
            <section className="inventory-overview">
              <div className="inventory-page-heading">
                <div><p className="eyebrow">CATÁLOGO Y EXISTENCIAS</p><h2>Inventario</h2><p>Controla tus artículos, revisa el valor de las existencias y encuentra rápidamente lo que necesitas reponer.</p></div>
                {canManageProducts && <button className="primary-button compact-button" disabled={bulkEditMode || bulkProductsLoading || bulkProductsSaving} onClick={() => { if (showProductForm) cancelProductForm(); else { setShowProductForm(true); setEditingProductId(null); setProductForm(blankProduct); setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant); setError(""); } }}>{showProductForm ? (editingProductId ? "Cancelar edición" : "Cancelar") : "＋ Agregar artículo"}</button>}
                <div className="inventory-import-actions">
                  <button
                    ref={inventoryDataTriggerRef}
                    type="button"
                    className={"inventory-import-trigger" + (inventoryDataMenuOpen ? " is-open" : "")}
                    aria-haspopup="dialog"
                    aria-expanded={inventoryDataMenuOpen}
                    aria-controls="inventory-data-menu"
                    onClick={() => setInventoryDataMenuOpen((open) => !open)}
                  >
                    <AppIcon name="file-spreadsheet" size={16}/>
                    <span>Importar / exportar</span>
                    <AppIcon name={inventoryDataMenuOpen ? "chevron-up" : "chevron-down"} size={14}/>
                  </button>
                  {inventoryDataMenuOpen && typeof document !== "undefined" && createPortal(
                    <div
                      id="inventory-data-menu"
                      ref={inventoryDataMenuRef}
                      className="inventory-data-actions inventory-import-menu"
                      role="dialog"
                      aria-label="Importar y exportar inventario"
                      style={{ position: "fixed", top: inventoryDataMenuPosition.top, left: inventoryDataMenuPosition.left, right: "auto", width: inventoryDataMenuPosition.width, maxHeight: "calc(100vh - 24px)", overflowY: "auto", zIndex: 2147483600 }}
                    >
                      <div>
                        <strong>Gestiona tus archivos de inventario</strong>
                        <p>Descarga la plantilla Excel, complétala y súbela aquí en .xls o .xlsx; también puedes importar CSV. Hasta 500 artículos por archivo. La fila de ejemplo se omite.</p>
                      </div>
                      <div className="inventory-data-action-buttons">
                        <button type="button" className="secondary-button" onClick={() => { setInventoryDataMenuOpen(false); downloadInventoryTemplateExcel(); }}>Plantilla Excel</button>
                        <button type="button" className="secondary-button" onClick={() => { setInventoryDataMenuOpen(false); downloadInventoryTemplate(); }}>CSV para importar</button>
                        <label className={"secondary-button inventory-import-label" + (inventoryImportBusy ? " disabled" : "")}>
                          {inventoryImportBusy ? "Importando…" : "Subir plantilla llena"}
                          <input type="file" accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv" onChange={(event) => { setInventoryDataMenuOpen(false); importInventoryFile(event); }} disabled={inventoryImportBusy || !canManageProducts}/>
                        </label>
                        <button type="button" className="secondary-button" onClick={() => { setInventoryDataMenuOpen(false); downloadInventoryReportExcel(); }} disabled={busy}>Reporte Excel</button>
                        <button type="button" className="secondary-button" onClick={() => { setInventoryDataMenuOpen(false); printInventoryReportPdf(); }} disabled={busy}>Reporte PDF</button>
                      </div>
                      {inventoryImportProgress && <span className="inventory-import-progress" role="status">{inventoryImportProgress}</span>}
                    </div>,
                    document.body
                  )}
                  <FieldHelp enabled={contextualHelpEnabled} text="Abre el menú para descargar la plantilla, importar hasta 500 artículos por CSV o exportar tus existencias a Excel o PDF. El panel se muestra por encima de la página para que no se recorte."/>
                </div>
              </div>
              <div className="inventory-metric-grid">
                <article className="inventory-metric-card"><span>Referencias en inventario</span><strong>{inventoryOverviewLoading ? "…" : inventoryOverview.productCount.toLocaleString("es-CO")}</strong><p>Artículos guardados en tu tienda</p></article>
                <article className="inventory-metric-card"><span>Unidades disponibles</span><strong>{inventoryOverviewLoading ? "…" : inventoryOverview.trackedUnits.toLocaleString("es-CO", { maximumFractionDigits: 3 })}</strong><p>Existencias físicas registradas</p></article>
                <article className="inventory-metric-card"><span>Costo total del inventario</span><strong>{inventoryOverviewLoading ? "Calculando…" : money(inventoryOverview.costMinor, currencyCode)}</strong><p>Costo de las unidades en stock</p></article>
                <article className="inventory-metric-card"><span>Valor de venta estimado</span><strong>{inventoryOverviewLoading ? "Calculando…" : money(inventoryOverview.retailMinor, currencyCode)}</strong><p>Si se vende todo el stock disponible</p></article>
                <button type="button" className={"inventory-metric-card inventory-metric-action" + (productStockFilter === "out_of_stock" ? " selected" : "")} onClick={() => { setProductStockFilter((current) => current === "out_of_stock" ? "all" : "out_of_stock"); setProductPage(1); }} aria-pressed={productStockFilter === "out_of_stock"}><span>Sin stock</span><strong>{inventoryOverviewLoading ? "…" : inventoryOverview.outOfStockCount.toLocaleString("es-CO")}</strong><p>{productStockFilter === "out_of_stock" ? "Mostrar todos los artículos" : "Ver artículos agotados"}</p></button>
                <button ref={inventoryDataMobileTriggerRef} type="button" className={"inventory-metric-card inventory-import-stock-card" + (inventoryDataMenuOpen ? " is-open" : "")} aria-label="Importar inventario" title="Importar inventario" aria-haspopup="dialog" aria-expanded={inventoryDataMenuOpen} aria-controls="inventory-data-menu" onClick={() => setInventoryDataMenuOpen((open) => !open)}><span className="inventory-import-stock-label"><AppIcon name="file-spreadsheet" size={17}/><strong>Importar inventario</strong></span></button>
              </div>
              {inventoryOverview.lowStockCount > 0 && <button type="button" className="inventory-low-stock-notice" onClick={() => { setProductStockFilter((current) => current === "low_stock" ? "all" : "low_stock"); setProductPage(1); }}><span><strong>{inventoryOverview.lowStockCount} {inventoryOverview.lowStockCount === 1 ? "artículo necesita" : "artículos necesitan"} reposición</strong><small>Según el mínimo definido en cada ficha.</small></span><span>{productStockFilter === "low_stock" ? "Ver todos" : "Revisar"} ›</span></button>}
            </section>
            {canManageProducts && <details className="bulk-tax-disclosure" onToggle={(event)=>{if(event.currentTarget.open && !taxBulkProducts.length && !taxBulkLoading) loadTaxBulkProducts();}}>
              <summary><strong>Asignar impuesto a varios productos</strong><span>Elige los artículos y aplica un mismo impuesto</span></summary>
              <div className="bulk-tax-content">
                <div className="bulk-tax-controls">
                  <label><span>Impuesto que se aplicará</span><select value={taxBulkCode} onChange={(event)=>setTaxBulkCode(event.target.value)}><option value="iva_19">IVA general · 19 %</option><option value="iva_5">IVA reducido · 5 %</option><option value="impoconsumo_8">Impuesto al consumo · 8 %</option><option value="iva_exento">IVA exento · 0 %</option><option value="iva_excluido">IVA excluido · 0 %</option><option value="none">Sin impuesto · 0 %</option></select></label>
                  <label><span>Buscar producto</span><input value={taxBulkSearch} onChange={(event)=>setTaxBulkSearch(event.target.value)} placeholder="Nombre o código…" /></label>
                </div>
                <p className="bulk-tax-note">Este selector corresponde al IVA y al impuesto al consumo de los artículos. Retefuente, ReteIVA y ReteICA son retenciones por operación o pago; no se asignan aquí como tarifa fija.</p>
                <div className="bulk-tax-list-heading"><span>{taxBulkLoading?"Cargando productos…":taxBulkFilteredProducts.length+" productos encontrados"}</span><span>{taxBulkProductIds.length}/250 seleccionados</span></div>
                <div className="bulk-tax-product-list">{taxBulkFilteredProducts.map((product)=>{const checked=taxBulkProductIds.includes(product.id);return <label key={product.id} className="bulk-tax-product-option"><input type="checkbox" checked={checked} disabled={taxBulkSaving||(!checked&&taxBulkProductIds.length>=250)} onChange={(event)=>setTaxBulkProductIds((current)=>event.target.checked?[...current,product.id]:current.filter((id)=>id!==product.id))}/><span><strong>{product.name}</strong><small>{product.sku||"Sin código"} · Actual: {product.metadata?.tax_code||"none"}</small></span></label>;})}{!taxBulkFilteredProducts.length&&!taxBulkLoading&&<p className="stats-empty-note">No encontramos productos con esa búsqueda.</p>}</div>
                <div className="bulk-tax-footer"><p>El cambio queda guardado en cada ficha y se usará en las ventas nuevas. No modifica las ventas históricas.</p><button type="button" className="primary-button compact-button" onClick={applyBulkTaxToProducts} disabled={taxBulkSaving||taxBulkLoading||!taxBulkProductIds.length}>{taxBulkSaving?"Guardando…":"Aplicar impuesto a seleccionados"}</button></div>
              </div>
            </details>}
            <div className="inventory-controls panel">
              <label className="inventory-search"><span><AppIcon name="search" size={15}/> Buscar artículo</span><input value={search} onChange={(e) => { setSearch(e.target.value); setProductPage(1); }} placeholder="Nombre, código o descripción…" /></label>
              <span className="inventory-result-count">{productsLoading ? "Actualizando inventario…" : productsCount.toLocaleString("es-CO") + (productsCount === 1 ? " resultado" : " resultados")}</span>
              <details className="inventory-filter-disclosure">
                <summary><AppIcon name="sliders" size={16}/><span>Filtros y orden</span><span className="inventory-filter-summary-detail">{productStockFilter !== "all" || productCategoryFilter !== "all" || productTypeFilter !== "all" ? "Filtros activos" : "Opcionales"}</span></summary>
                <div className="inventory-filter-panel">
                  <label><span>Existencias</span><select value={productStockFilter} onChange={(e) => { setProductStockFilter(e.target.value); setProductPage(1); }}><option value="all">Todos los niveles</option><option value="in_stock">Con stock</option><option value="low_stock">Bajo el mínimo</option><option value="out_of_stock">Sin stock</option></select></label>
                  <label><span>Categoría</span><select value={productCategoryFilter} onChange={(e) => { setProductCategoryFilter(e.target.value); setProductPage(1); }}><option value="all">Todas las categorías</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
                  <label><span>Tipo</span><select value={productTypeFilter} onChange={(e) => { setProductTypeFilter(e.target.value); setProductPage(1); }}><option value="all">Todos los tipos</option><option value="physical">Físicos</option><option value="service">Servicios</option><option value="digital">Digitales</option></select></label>
                  <label><span>Ordenar por</span><select value={productSort} onChange={(e) => { setProductSort(e.target.value); setProductPage(1); }}><option value="name">Nombre (A–Z)</option><option value="name_desc">Nombre (Z–A)</option><option value="code">Código (A–Z)</option><option value="code_desc">Código (Z–A)</option><option value="price">Precio (menor a mayor)</option><option value="price_desc">Precio (mayor a menor)</option><option value="cost">Costo (menor a mayor)</option><option value="cost_desc">Costo (mayor a menor)</option><option value="stock">Existencias (menor a mayor)</option><option value="stock_desc">Existencias (mayor a menor)</option><option value="profit">Ganancia (mayor a menor)</option><option value="profit_asc">Ganancia (menor a mayor)</option><option value="margin">Margen (mayor a menor)</option><option value="margin_asc">Margen (menor a mayor)</option></select></label>
                </div>
              </details>
            </div>
            {canManageProducts && showProductForm && <form className="product-form panel" onSubmit={addProduct}>
              <h3>{editingProductId ? "Editar producto" : "Datos del producto"}</h3>
              {!editingProductId && <div className="product-photo-uploader full-span">
                <span className="photo-section-label">Fotos del producto (máximo 3)</span>
                <div className="photo-slot-grid">
                  {stagedImages.map((image, index) => <figure className="photo-filled-slot" key={image.preview}>
                    <img src={image.preview} alt={image.name} />
                    <button type="button" className="photo-remove-button" title="Quitar foto" aria-label={"Quitar foto " + (index + 1)} onClick={() => { URL.revokeObjectURL(image.preview); setStagedImages((current) => current.filter((_, i) => i !== index)); }}>×</button>
                  </figure>)}
                  {Array.from({ length: Math.max(0, 3 - stagedImages.length) }).map((_, index) => <label className="photo-empty-slot" key={"photo-empty-" + index}>
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy || stagedImages.length >= 3} onChange={chooseNewProductImages} />
                    <span className="photo-plus" aria-hidden="true">＋</span><strong>Agregar foto<FieldHelp enabled={contextualHelpEnabled} text="Selecciona una imagen para la fotografía del producto. Se aceptan JPG, PNG o WebP." /></strong>
                  </label>)}
                </div>
                <span className="photo-help">JPG, PNG o WebP. Máximo 5 MB al cargarla; se convierte a WebP de máximo 1,5 MB antes de guardarse.</span>
              </div>}
              
              <div className="form-grid">
                <label><span className="field-label-heading">Nombre *</span><input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} maxLength={160} required placeholder="Ej. Camiseta blanca" /></label>
                <label><span className="field-label-heading">Código del artículo<FieldHelp enabled={contextualHelpEnabled} text="Elige si treseiscinco genera el código automáticamente o si prefieres escribirlo. La elección también se aplica a los códigos de variante." /></span><select value={productCodeMode} onChange={(event) => setProductCodeMode(event.target.value)}><option value="auto">Generarlo automáticamente</option><option value="manual">Lo escribiré yo</option></select><input aria-label="Código del artículo" value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} disabled={productCodeMode === "auto"} required={productCodeMode === "manual"} maxLength={100} placeholder={productCodeMode === "auto" ? (editingProductId ? "Código interno existente" : "Se asigna al guardar") : "Ej. SKU-001"} /></label>
                <div className="product-category-field"><label><span className="field-label-heading">Categoría</span><select value={productForm.category_id} onChange={(e) => { if (e.target.value === "__create_category__") { setShowQuickCategoryForm(true); return; } setProductForm((current) => ({ ...current, category_id: e.target.value })); }}><option value="">Sin categoría</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}<option value="__create_category__">＋ Nueva categoría…</option></select></label>{showQuickCategoryForm && <div className="inline-create-panel" onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}><label><span>Nombre de la nueva categoría</span><input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} maxLength={80} placeholder="Ej. Accesorios, insumos…" autoFocus /></label><div className="inline-create-actions"><button type="button" className="primary-button" disabled={busy || !categoryName.trim()} onClick={() => addCategory()}>{busy ? "Guardando…" : "Crear y seleccionar"}</button><button type="button" className="text-button" onClick={() => { setShowQuickCategoryForm(false); setCategoryName(""); }}>Cancelar</button></div></div>}<details className="product-categories-inline"><summary><AppIcon name="chevron-down" size={15}/> Administrar categorías existentes</summary><div className="product-categories-inline-list">{categories.length ? categories.map((category) => <div className="product-categories-inline-row" key={category.id}>{editingCategoryId === category.id ? <form className="category-edit-form" onSubmit={updateCategory}><input value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} maxLength={80} required autoFocus aria-label="Nuevo nombre de categoría" /><button type="submit" className="secondary-button" disabled={busy}>Guardar</button><button type="button" className="text-button" onClick={() => { setEditingCategoryId(null); setEditingCategoryName(""); }}>Cancelar</button></form> : <><span>{category.name}</span><div><button type="button" className="icon-action-button" title={"Editar categoría "+category.name} aria-label={"Editar categoría "+category.name} onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); setConfirmDeleteCategoryId(null); }}><AppIcon name="edit" size={14}/></button>{confirmDeleteCategoryId === category.id ? <><button type="button" className="text-button danger-text" disabled={busy} onClick={() => deleteCategory(category.id)}>Sí, eliminar</button><button type="button" className="text-button" onClick={() => setConfirmDeleteCategoryId(null)}>Cancelar</button></> : <button type="button" className="icon-action-button icon-action-danger" title={"Eliminar categoría "+category.name} aria-label={"Eliminar categoría "+category.name} onClick={() => setConfirmDeleteCategoryId(category.id)}><AppIcon name="trash" size={14}/></button>}</div></>}</div>) : <p>No hay categorías existentes.</p>}</div></details></div>
                {!editingProductId && <section className="new-product-variants full-span">
                  <div className="new-product-variants-heading"><div><strong>Variantes (opcional)</strong><p>Añade tallas, colores, tamaños u otras opciones desde la creación del producto.</p></div><FieldHelp enabled={contextualHelpEnabled} text="Cada variante distingue una opción concreta. Por ejemplo: tipo Talla, valor M. El precio y las existencias pueden usar los valores generales del producto." /></div>
                  {newProductVariants.length > 0 && <div className="new-product-variant-list">
                    {newProductVariants.map((variant, index) => <div className="new-product-variant-row" key={variant.variant_name + "-" + variant.variant_value + "-" + index}>
                      <div><strong>{variantDisplayLabel(variant)}</strong><span>{variant.sku ? "Código " + variant.sku : productCodeMode === "auto" ? "Código automático al guardar" : "Código pendiente"} · {String(variant.sale_price || "").trim() === "" ? "Precio general" : money(toMinorUnits(variant.sale_price, currencyCode), currencyCode)} · Existencias {Number(variant.stock_on_hand || 0).toLocaleString("es-CO")}</span></div>
                      <div className="new-product-variant-row-actions"><button type="button" className="text-button" onClick={() => editNewProductVariant(index)}>Editar</button><button type="button" className="text-button danger-text" onClick={() => setNewProductVariants((current) => current.filter((_, rowIndex) => rowIndex !== index))}>Quitar</button></div>
                    </div>)}
                  </div>}
                  <div className="variant-form-grid">
                    <label><span className="field-label-heading">Atributo 1 *</span><input value={newProductVariantDraft.variant_name} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, variant_name: event.target.value }))} maxLength={80} placeholder="Ej. Color" /></label>
                    <label><span className="field-label-heading">Valor 1 *</span><input value={newProductVariantDraft.variant_value} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, variant_value: event.target.value }))} maxLength={120} placeholder="Ej. Rojo" /></label>
                    <label><span className="field-label-heading">Atributo 2 (opcional)</span><input value={newProductVariantDraft.variant_name_2} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, variant_name_2: event.target.value }))} maxLength={80} placeholder="Ej. Talla" /></label>
                    <label><span className="field-label-heading">Valor 2 (opcional)</span><input value={newProductVariantDraft.variant_value_2} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, variant_value_2: event.target.value }))} maxLength={120} placeholder="Ej. S" /></label>
                    <label><span className="field-label-heading">Código de variante</span><input value={newProductVariantDraft.sku} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, sku: event.target.value }))} disabled={productCodeMode === "auto"} required={productCodeMode === "manual"} maxLength={100} placeholder={productCodeMode === "auto" ? "Automático al guardar" : "Escribe el código"} /></label>
                    <label><span className="field-label-heading">Precio propio</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={newProductVariantDraft.sale_price} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, sale_price: event.target.value }))} placeholder="Usar precio del producto" /></label>
                    <label><span className="field-label-heading">Existencias de esta combinación *</span><input type="number" min="0" step="0.001" value={newProductVariantDraft.stock_on_hand} onChange={(event) => setNewProductVariantDraft((draft) => ({ ...draft, stock_on_hand: event.target.value }))} required={productForm.product_type === "physical"} placeholder="Ej. 2" /></label>
                  </div>
                  <p className="helper-text">Cada fila es una combinación exacta (por ejemplo Color: Rojo · Talla: S). Registra sus existencias por separado; luego podrás editarla desde «Variantes».</p>
                  <div className="new-product-variant-actions"><button type="button" className="secondary-button" onClick={() => setNewProductVariantDraft(blankNewProductVariant)}>Limpiar campos</button><button type="button" className="primary-button" onClick={addNewProductVariantDraft}>＋ Añadir combinación</button></div>
                </section>}
<label><span className="field-label-heading">Tipo<FieldHelp enabled={contextualHelpEnabled} text="El tipo determina si el artículo maneja inventario físico, corresponde a un servicio o es digital." /></span><select value={productForm.product_type} disabled={!!editingProductId} onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value, stock: e.target.value === "physical" ? productForm.stock : "0" })}><option value="physical">Producto físico</option><option value="service">Servicio</option><option value="digital">Producto digital</option></select></label>
                <label><span className="field-label-heading">Precio de venta<FieldHelp enabled={contextualHelpEnabled} text={productForm.is_bundle?"Se calcula sumando los productos incluidos y restando el descuento del paquete.":"Precio que cobras al cliente por una unidad."} /></span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={productForm.is_bundle?String(bundleSalePriceMinor/(10**currencyDigits(currencyCode))):productForm.sale_price} onChange={(e) => setProductForm({ ...productForm, sale_price: e.target.value })} disabled={!!productForm.is_bundle} required placeholder={currencyDigits(currencyCode) === 0 ? "0" : "0.00"} /></label>
                <label><span className="field-label-heading">Costo por unidad<FieldHelp enabled={contextualHelpEnabled} text="Cuánto te cuesta adquirir o elaborar una unidad. Este dato ayuda a calcular la utilidad." /></span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={productForm.cost_price} onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })} required placeholder={currencyDigits(currencyCode) === 0 ? "0" : "0.00"} /></label>
                <label><span className="field-label-heading">Impuesto del artículo<FieldHelp enabled={contextualHelpEnabled} text="Elige el impuesto que corresponde a este artículo. Esta asignación se conserva en su ficha." /></span><select value={productForm.tax_code || "none"} onChange={(e) => setProductForm({ ...productForm, tax_code: e.target.value })}><option value="iva_19">IVA general · 19 %</option><option value="iva_5">IVA reducido · 5 %</option><option value="impoconsumo_8">Impuesto al consumo · 8 %</option><option value="iva_exento">IVA exento · 0 %</option><option value="iva_excluido">IVA excluido · 0 %</option><option value="none">Sin impuesto · 0 %</option></select></label>
                <label><span className="field-label-heading">Unidad</span><select value={productForm.unit_name} onChange={(e) => setProductForm({ ...productForm, unit_name: e.target.value })} required>{unitOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label><span className="field-label-heading">Presentación comercial</span><input value={productForm.commercial_presentation} onChange={(e) => setProductForm({ ...productForm, commercial_presentation: e.target.value })} maxLength={120} placeholder="Ej. 80 g, caja x 12, 500 ml" /></label>
                {productForm.unit_name === "personalizada" && <label><span className="field-label-heading">Nombre de la unidad</span><input value={productForm.unit_custom} onChange={(e) => setProductForm({ ...productForm, unit_custom: e.target.value })} maxLength={30} required placeholder="Ej. lámina, rollo, sesión" /></label>}
                {productForm.product_type === "physical" && !( !editingProductId && newProductVariants.length > 0) && <><label><span className="field-label-heading">{editingProductId ? "Existencias actuales" : "Existencias iniciales"}<FieldHelp enabled={contextualHelpEnabled} text="Existencias generales del producto. Si manejas variantes, cada combinación tiene su propio stock." /></span><input type="number" min="0" step="0.001" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} readOnly={!!editingProductId} required /></label><label><span className="field-label-heading">Avisarme cuando queden</span><input type="number" min="0" step="0.001" value={productForm.low_stock} onChange={(e) => setProductForm({ ...productForm, low_stock: e.target.value })} placeholder="Ej. 3" /></label></>}{!editingProductId && newProductVariants.length > 0 && productForm.product_type === "physical" && <p className="helper-text full-span">Este producto se controlará por combinaciones. Las cantidades de color y talla se guardan en cada fila de «Variantes», no en las existencias generales.</p>}
                <label className="full-span"><span className="field-label-heading">Descripción para el catálogo</span><textarea rows="3" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} maxLength={2000} placeholder="Cuenta qué incluye, sus materiales, medidas, beneficios o qué lo hace especial."/><small className="product-description-guidance">La descripción se muestra a tus clientes en el catálogo. Edita este campo desde la ficha del artículo.</small></label>
                <label className="product-publication-toggle full-span"><input type="checkbox" checked={productForm.is_published !== false} onChange={(event) => setProductForm((current) => ({ ...current, is_published: event.target.checked }))}/><span><strong>Mostrar en el catálogo público</strong><small>Activado por defecto. Desmárcalo para mantener este producto en el inventario sin mostrarlo en tu catálogo compartible.</small></span></label>
              </div>
              {editingProductId && products.find((item) => item.id === editingProductId) && <div className="product-edit-tools full-span">
                {renderStockAdjustment(products.find((item) => item.id === editingProductId))}
                <section className="edit-subpanel"><div className="edit-subpanel-heading"><strong>Fotografías</strong><span>Hasta 3 fotos</span></div>{renderPhotoManager(products.find((item) => item.id === editingProductId))}</section>
              </div>}
              {!categories.length && <p className="helper-text full-span">Puedes añadir categorías desde el botón «Categorías».</p>}
                <div className="bundle-editor full-span">
  <label className="bundle-toggle"><input type="checkbox" checked={!!productForm.is_bundle} onChange={async event => { const enabled=event.target.checked; setProductForm(current=>({...current,is_bundle:enabled,product_type:"physical",unit_name:enabled?"set":current.unit_name,stock:enabled?"0":current.stock,is_published:current.is_published !== false,bundle_components:current.bundle_components?.length>=2?current.bundle_components:[{product_id:"",quantity:"1"},{product_id:"",quantity:"1"}]})); if(enabled){try{await loadBundleProductOptions();}catch(error){setError(friendlyError(error));}} }} /> <span><strong>Crear un paquete con precio especial</strong><small>Combina productos existentes para venderlos juntos con un descuento. Sus precios individuales no cambian.</small></span></label>
  {productForm.is_bundle && <div className="bundle-builder">
    <div className="bundle-heading"><strong>Productos incluidos en el paquete</strong><span>Selecciona dos o más productos distintos y define la cantidad de cada uno.</span></div>
    {productForm.bundle_components.map((component,index)=><div className="bundle-component-row" key={"bundle-component-"+index}>
      <label><span className="field-label-heading">Producto {index+1}</span><select value={component.product_id} onChange={event=>setProductForm(current=>({...current,bundle_components:current.bundle_components.map((row,rowIndex)=>rowIndex===index?{...row,product_id:event.target.value}:row)}))}><option value="">Elige un producto…</option>{availableBundleComponents.map(product=><option key={product.id} value={product.id}>{product.name} · {money(product.sale_price_minor,currencyCode)}</option>)}</select></label>
      <label><span className="field-label-heading">Cantidad</span><input type="number" min="1" step="1" value={component.quantity} onChange={event=>setProductForm(current=>({...current,bundle_components:current.bundle_components.map((row,rowIndex)=>rowIndex===index?{...row,quantity:event.target.value}:row)}))}/></label>
      <button type="button" className="secondary-button bundle-remove-button" aria-label={"Quitar producto "+(index+1)} title="Quitar producto" disabled={productForm.bundle_components.length<=2} onClick={()=>setProductForm(current=>({...current,bundle_components:current.bundle_components.filter((_,rowIndex)=>rowIndex!==index)}))}>Quitar</button>
    </div>)}
    <button type="button" className="secondary-button action-small" disabled={productForm.bundle_components.length>=20} onClick={()=>setProductForm(current=>({...current,bundle_components:[...current.bundle_components,{product_id:"",quantity:"1"}]}))}>+ Añadir producto</button>
    <label><span className="field-label-heading">Descuento del paquete ({currencyCode})<FieldHelp enabled={contextualHelpEnabled} text="Es un descuento fijo sobre el valor de los productos incluidos. No cambia sus precios si se venden individualmente." /></span><input type="number" min="0" step={currencyDigits(currencyCode)===0?"1":"0.01"} value={productForm.bundle_discount} onChange={event=>setProductForm(current=>({...current,bundle_discount:event.target.value}))}/></label>
    <div className="bundle-price-summary"><div><span>Precio de los productos</span><strong>{money(bundleSubtotalMinor,currencyCode)}</strong></div><div><span>Descuento del paquete</span><strong>− {money(bundleDiscountMinor,currencyCode)}</strong></div><div className="bundle-final-price"><span>Precio del paquete</span><strong>{money(bundleSalePriceMinor,currencyCode)}</strong></div></div>
    <p className="helper-text">Al vender el paquete, se descontará del inventario cada producto incluido que controle existencias. Si cambia un precio, edita y guarda el paquete para actualizarlo.</p>
  </div>}
</div>
              <p className="helper-text">{editingProductId ? "Las existencias se ajustan aquí y las fotos se administran dentro de esta ficha." : "La presentación comercial es opcional. El inventario inicial queda guardado en el historial; luego puedes completar los datos desde Editar."}</p>
              <div className="form-actions"><button type="button" className="secondary-button" onClick={cancelProductForm}>Cancelar</button><button className="primary-button" disabled={busy}>{busy ? "Guardando…" : editingProductId ? "Guardar cambios" : "Guardar producto"}</button></div>
            </form>}
            <div className="product-tools"><div className="product-tools-actions">
                {canManageProducts && <button type="button" className="secondary-button action-small" onClick={() => { setShowArchivedProducts((show) => !show); setProductPage(1); }} disabled={bulkEditMode || bulkProductsLoading || bulkProductsSaving}>{showArchivedProducts ? "Ver activos" : "Archivados"}</button>}
                {canManageProducts && <button type="button" className="secondary-button action-small bulk-edit-toggle" disabled={bulkProductsLoading || bulkProductsSaving} onClick={() => { if (bulkEditMode) { if (bulkEditHasChanges && !window.confirm("Hay cambios sin guardar. ¿Quieres salir sin guardarlos?")) return; setBulkEditMode(false); } else { loadBulkProducts(); } }}>{bulkEditMode ? "Salir de edición masiva" : bulkProductsLoading ? "Cargando inventario…" : "Editar todos"}</button>}
                <div className="view-switch" role="group" aria-label="Vista de productos">
                  <button type="button" className={viewMode === "rows" ? "view-option active" : "view-option"} onClick={() => setViewMode("rows")} aria-pressed={viewMode === "rows"}><span>☷</span> Filas</button>
                  <button type="button" className={viewMode === "cards" ? "view-option active" : "view-option"} onClick={() => setViewMode("cards")} aria-pressed={viewMode === "cards"}><span>▦</span> Tarjetas</button>
                </div>
                <span className="count-label">{productsCount} {productsCount === 1 ? "artículo" : "artículos"}</span>
              </div>
            </div>
            {bulkEditMode && <section className="bulk-inventory-editor">
              <div className="bulk-inventory-heading">
                <div><span className="eyebrow">INVENTARIO · EDICIÓN EN LOTE</span><h3>Edita varios artículos en una sola vista</h3><p>Los cambios se guardan solo cuando pulses «Guardar cambios». La ganancia y el margen se recalculan automáticamente.</p></div>
                <div className="bulk-inventory-summary"><strong>{visibleBulkProductRows.length.toLocaleString("es-CO")}</strong><span>{visibleBulkProductRows.length === 1 ? "artículo visible" : "artículos visibles"}</span></div>
              </div>
              {bulkProductsLoading ? <div className="empty-state">Cargando todos los artículos del inventario…</div> : visibleBulkProductRows.length ? <div className="bulk-inventory-grid">
                {visibleBulkProductRows.map((row) => {
                  const saleMinor = Number.isFinite(Number(row._draftSalePrice)) ? toMinorUnits(row._draftSalePrice || 0, currencyCode) : 0;
                  const costMinor = Number.isFinite(Number(row._draftCostPrice)) ? toMinorUnits(row._draftCostPrice || 0, currencyCode) : 0;
                  const profitMinor = saleMinor - costMinor;
                  const margin = saleMinor > 0 ? (profitMinor / saleMinor) * 100 : 0;
                  const changed = String(row._draftName ?? "").trim() !== String(row.name ?? "").trim() ||
                    String(row._draftSku ?? "").trim() !== String(row.sku ?? "").trim() ||
                    Number(row._draftSalePrice || 0) !== Number(row.sale_price_minor || 0) / (10 ** currencyDigits(currencyCode)) ||
                    Number(row._draftCostPrice || 0) !== Number(row.cost_price_minor || 0) / (10 ** currencyDigits(currencyCode)) ||
                    (row.track_inventory && Number(row._draftStock || 0) !== Number(row.stock_on_hand || 0));
                  return <article className={"bulk-inventory-card" + (changed ? " has-changes" : "")} key={row.id}>
                    <div className="bulk-card-heading">
                      <div className="product-symbol">{row.product_type === "service" ? "◷" : row.product_type === "digital" ? "◇" : "▦"}</div>
                      <span className={row.is_sellable ? "status-pill status-active" : "status-pill status-inactive"}>{row.is_sellable ? "Activo" : "Inactivo"}</span>
                    </div>
                    <label className="bulk-card-name"><span>Producto</span><input value={row._draftName} maxLength={160} onChange={(event) => updateBulkDraft(row.id, "_draftName", event.target.value)} aria-label={"Nombre de " + row.name} /></label>
                    <div className="bulk-card-meta"><span>{categories.find((category) => category.id === row.category_id)?.name || "Sin categoría"}</span></div>
                    <label className="bulk-card-sku-field"><span>Código del artículo</span><input value={row._draftSku} maxLength={100} onChange={(event) => updateBulkDraft(row.id, "_draftSku", event.target.value)} aria-label={"Código de " + row.name} placeholder="Opcional" /></label>
                    <div className="bulk-card-edit-fields">
                      <label><span>Precio</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={row._draftSalePrice} onChange={(event) => updateBulkDraft(row.id, "_draftSalePrice", event.target.value)} /></label>
                      <label><span>Costo</span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={row._draftCostPrice} onChange={(event) => updateBulkDraft(row.id, "_draftCostPrice", event.target.value)} /></label>
                      <label className="bulk-card-stock-field"><span>Cantidad disponible</span><input type="number" min="0" step="0.001" disabled={!row.track_inventory} value={row.track_inventory ? row._draftStock : ""} placeholder="No aplica" onChange={(event) => updateBulkDraft(row.id, "_draftStock", event.target.value)} /></label>
                    </div>
                    <div className="bulk-card-profit">
                      <div><span>Ganancia por unidad</span><strong className={profitMinor < 0 ? "negative-value" : ""}>{money(profitMinor, currencyCode)}</strong></div>
                      <div><span>Margen</span><strong className={margin < 0 ? "negative-value" : ""}>{margin.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</strong></div>
                    </div>
                    <div className="bulk-card-footer">
                      <span className={changed ? "bulk-change-status pending" : "bulk-change-status"}>{changed ? "Sin guardar" : "Al día"}</span>
                      <button type="button" className="text-button" onClick={() => openBulkHistory(row)}>Historial</button>
                    </div>
                  </article>;
                })}
              </div> : <div className="empty-state"><h3>No hay artículos para editar</h3><p>Prueba otra búsqueda o revisa el filtro de archivados.</p></div>}
              <div className="bulk-inventory-footer">
                <span>{bulkEditHasChanges ? "Tienes cambios pendientes." : "Todos los artículos están al día."} Las variaciones de stock se registran en el historial.</span>
                <button type="button" className="primary-button" disabled={bulkProductsSaving || bulkProductsLoading || !bulkEditHasChanges} onClick={saveBulkProductChanges}>{bulkProductsSaving ? "Guardando cambios…" : "Guardar cambios"}</button>
              </div>
            </section>}

            {bulkHistoryProduct && <div className="bulk-history-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setBulkHistoryProduct(null); }}>
              <section className="bulk-history-dialog panel" role="dialog" aria-modal="true" aria-label={"Historial de " + bulkHistoryProduct.name}>
                <div className="bulk-history-heading"><div><span className="eyebrow">MOVIMIENTOS DE STOCK</span><h3>{bulkHistoryProduct.name}</h3><p>Consulta las entradas, salidas y ajustes registrados de este artículo.</p></div><button type="button" className="icon-action-button" aria-label="Cerrar historial" onClick={() => setBulkHistoryProduct(null)}>×</button></div>
                {bulkHistoryLoading ? <div className="empty-state">Cargando historial…</div> : bulkHistoryRows.length ? <div className="bulk-history-list">{bulkHistoryRows.map((movement) => {
                  const quantity = Number(movement.quantity_delta || 0);
                  const label = ({ opening: "Existencias iniciales", sale: "Venta", purchase: "Compra", adjustment_in: "Ajuste de entrada", adjustment_out: "Ajuste de salida", return: "Devolución", return_in: "Devolución", damage: "Daño o pérdida" })[movement.movement_type] || (movement.movement_type ? movement.movement_type.replaceAll("_", " ") : "Movimiento");
                  return <article className="bulk-history-row" key={movement.id}><strong className={quantity < 0 ? "negative-value" : ""}>{quantity > 0 ? "+" : ""}{quantity.toLocaleString("es-CO")}</strong><div><b>{label}</b><span>{new Date(movement.created_at).toLocaleString("es-CO", { timeZone: "America/Bogota", dateStyle: "medium", timeStyle: "short" })}</span>{movement.notes && <small>{movement.notes}</small>}</div></article>;
                })}</div> : <div className="empty-state"><h3>Sin movimientos</h3><p>Este artículo aún no tiene movimientos de existencias registrados.</p></div>}
                {bulkHistoryCount > 10 && <div className="bulk-history-pagination"><button type="button" className="secondary-button" disabled={bulkHistoryPage <= 1 || bulkHistoryLoading} onClick={() => setBulkHistoryPage((page) => Math.max(1, page - 1))}>Anterior</button><span>Página {bulkHistoryPage} de {Math.ceil(bulkHistoryCount / 10)}</span><button type="button" className="secondary-button" disabled={bulkHistoryPage >= Math.ceil(bulkHistoryCount / 10) || bulkHistoryLoading} onClick={() => setBulkHistoryPage((page) => Math.min(Math.ceil(bulkHistoryCount / 10), page + 1))}>Siguiente</button></div>}
              </section>
            </div>}

            {viewingVariantsFor && (() => {
              const variantProduct = products.find((product) => product.id === viewingVariantsFor);
              if (!variantProduct) return null;
              const rows = variantsByProduct[variantProduct.id] || [];
              return <div className="variant-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setViewingVariantsFor(null); resetVariantDraft(); } }}>
                <section className="variant-manager panel" role="dialog" aria-modal="true" aria-label={"Variantes de " + variantProduct.name}>
                  <div className="variant-manager-heading"><div><p className="eyebrow">PRODUCTO</p><h3>Variantes de {variantProduct.name}</h3><p>Cada fila puede representar una combinación (por ejemplo, Color: Rojo · Talla: S) con precio, código y stock propios.</p></div><button type="button" className="icon-action-button" title="Cerrar" aria-label="Cerrar variantes" onClick={() => { setViewingVariantsFor(null); resetVariantDraft(); }}>×</button></div>
                  {rows.length ? <div className="variant-list">{rows.map((variant) => <article className={"variant-row" + (!variant.is_active ? " variant-inactive" : "")} key={variant.id}>
                    <div className="variant-row-main"><strong>{variantDisplayLabel(variant)}</strong><span>{variant.sku ? "Código " + variant.sku : "Sin código"}{variant.stock_on_hand != null ? " · Existencias " + Number(variant.stock_on_hand).toLocaleString("es-CO") : ""}</span>{variant.sale_price_minor != null && <small>{money(variant.sale_price_minor, currencyCode)}</small>}{(variant.image_paths || []).length > 0 && <div className="variant-photo-list">{variant.image_paths.map((imageKey) => <ProductVariantImagePreview key={imageKey} businessId={activeBusiness.id} productId={variantProduct.id} variantId={variant.id} imageKey={imageKey} alt={"Foto de " + variantDisplayLabel(variant)}/>)}</div>}</div>
                    <div className="variant-row-actions">{canManageProducts && <button type="button" className="text-button" onClick={() => editProductVariant(variant)}>Editar</button>}{canManageProducts && <button type="button" className="text-button danger-text" disabled={variantBusy} onClick={() => removeProductVariant(variant)}>Quitar</button>}</div>
                  </article>)}</div> : <div className="variant-empty"><strong>Este producto todavía no tiene variantes</strong><span>Añade talla, color, tamaño u otra opción que necesites distinguir.</span></div>}
                  {canManageProducts && <form className="variant-form" onSubmit={saveProductVariant}>
                    <h4>{editingVariantId ? "Editar variante" : "Añadir variante"}</h4>
                    <div className="variant-form-grid">
                      <div className="variant-photo-editor full-span">
                        <span className="field-label-heading">Fotos de esta variante (máximo 2)</span>
                        <div className="variant-photo-list">
                          {(variantDraft.image_paths || []).map((imageKey) => <ProductVariantImagePreview key={imageKey} businessId={activeBusiness.id} productId={viewingVariantsFor} variantId={editingVariantId} imageKey={imageKey} alt="Foto existente de la variante" onRemove={() => { const current = (rows || []).find((row) => row.id === editingVariantId); if (current) removeVariantPhoto(current, imageKey); }}/>)}
                          {(variantDraft.staged_images || []).map((image, index) => <figure className="variant-photo-item" key={image.preview}><img src={image.preview} alt={image.name || "Foto seleccionada"}/><button type="button" className="photo-remove-button" title="Quitar foto" aria-label="Quitar foto seleccionada" onClick={() => { URL.revokeObjectURL(image.preview); setVariantDraft((draft) => ({ ...draft, staged_images: (draft.staged_images || []).filter((_, i) => i !== index) })); }}>×</button></figure>)}
                          {((variantDraft.image_paths || []).length + (variantDraft.staged_images || []).length) < 2 && <label className="photo-empty-slot variant-photo-add"><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={variantBusy} onChange={chooseVariantImages}/><span className="photo-plus" aria-hidden="true">＋</span><strong>Agregar foto</strong></label>}
                        </div>
                        <span className="photo-help">JPG, PNG o WebP hasta 5 MB al cargar; se convierte a WebP de hasta 1,5 MB.</span>
                      </div>
                      <label><span className="field-label-heading">Atributo 1 *<FieldHelp enabled={contextualHelpEnabled} text="Primera característica, por ejemplo Color." /></span><input value={variantDraft.variant_name} onChange={(event) => setVariantDraft((draft) => ({ ...draft, variant_name: event.target.value }))} maxLength={80} required placeholder="Ej. Color" /></label>
                      <label><span className="field-label-heading">Valor 1 *<FieldHelp enabled={contextualHelpEnabled} text="Valor del primer atributo, por ejemplo Rojo." /></span><input value={variantDraft.variant_value} onChange={(event) => setVariantDraft((draft) => ({ ...draft, variant_value: event.target.value }))} maxLength={120} required placeholder="Ej. Rojo" /></label>
                      <label><span className="field-label-heading">Atributo 2 (opcional)</span><input value={variantDraft.variant_name_2} onChange={(event) => setVariantDraft((draft) => ({ ...draft, variant_name_2: event.target.value }))} maxLength={80} placeholder="Ej. Talla" /></label>
                      <label><span className="field-label-heading">Valor 2 (opcional)</span><input value={variantDraft.variant_value_2} onChange={(event) => setVariantDraft((draft) => ({ ...draft, variant_value_2: event.target.value }))} maxLength={120} placeholder="Ej. S" /></label>
                      <label><span className="field-label-heading">Código de variante<FieldHelp enabled={contextualHelpEnabled} text="Se genera al guardar si el producto usa códigos automáticos; si usa códigos manuales, escribe el código aquí." /></span><input value={variantDraft.sku} onChange={(event) => setVariantDraft((draft) => ({ ...draft, sku: event.target.value }))} disabled={products.find((product) => product.id === viewingVariantsFor)?.metadata?.sku_mode === "auto"} maxLength={100} placeholder={products.find((product) => product.id === viewingVariantsFor)?.metadata?.sku_mode === "auto" ? "Código automático" : "Código de variante"} /></label>
                      <label><span className="field-label-heading">Precio propio<FieldHelp enabled={contextualHelpEnabled} text="Deja vacío para usar el precio general del producto; escribe un valor si esta variante tiene otro precio." /></span><input type="number" min="0" step={currencyDigits(currencyCode) === 0 ? "1" : "0.01"} value={variantDraft.sale_price} onChange={(event) => setVariantDraft((draft) => ({ ...draft, sale_price: event.target.value }))} placeholder="Usar precio del producto" /></label>
                      <label><span className="field-label-heading">Existencias de esta combinación<FieldHelp enabled={contextualHelpEnabled} text="Cada combinación, por ejemplo Rojo / Talla S, tiene sus propias unidades. Los cambios se guardan en el historial." /></span><input type="number" min="0" step="0.001" value={variantDraft.stock_on_hand} onChange={(event) => setVariantDraft((draft) => ({ ...draft, stock_on_hand: event.target.value }))} required={products.find((product) => product.id === viewingVariantsFor)?.product_type === "physical"} placeholder="Unidades disponibles (puede ser 0)" /></label>
                    </div>
                    <p className="helper-text">Cada combinación física tiene su propio stock. En productos físicos, registra las unidades disponibles; al vender una combinación se descuentan esas unidades y no las existencias generales.</p>
                    <div className="form-actions"><button type="button" className="secondary-button" onClick={resetVariantDraft}>Limpiar</button><button type="submit" className="primary-button" disabled={variantBusy}>{variantBusy ? "Guardando…" : editingVariantId ? "Guardar cambios" : "Añadir variante"}</button></div>
                  </form>}
                </section>
              </div>;
            })()}
            {!bulkEditMode && (productsLoading ? <div className="empty-state">Cargando tus productos…</div> : filteredProducts.length ? (
              viewMode === "rows" ? (
                <div className="product-table-wrap panel">
                  <table className="product-table">
                    <thead><tr>
                      <th>Producto</th><th>Código</th><th>Unidad</th><th>Precio {currencyCode}</th><th>Otras monedas</th><th>Presentación</th><th>Existencias</th><th>Estado</th><th>Catálogo</th><th>Compartir / acciones</th>
                    </tr></thead>
                    <tbody>{filteredProducts.map((p) => { const productVariants = variantsByProduct[p.id] || []; const stockSummary = summarizeProductVariantStock(p, productVariants); return <React.Fragment key={p.id}>
                      <tr className="product-table-row mobile-detail-trigger" onClick={(event) => { if (!window.matchMedia("(max-width: 640px)").matches || event.target.closest("button,a,input,select,textarea")) return; openProductDetail(p); }}>
                        <td className="product-table-name"><div className="product-cell">
                          <div className="product-symbol product-thumb">{p.image_paths?.[0] && productImageUrls[p.id + "|" + p.image_paths[0]] ? <img src={productImageUrls[p.id + "|" + p.image_paths[0]]} alt={"Foto de " + p.name} onError={() => handleProductImageError(p.id, p.image_paths[0])} /> : <span>{p.product_type === "service" ? "◷" : p.product_type === "digital" ? "◇" : "▦"}</span>}</div>
                          <div className="product-cell-copy"><strong>{p.name}</strong><span>{categories.find((cat) => cat.id === p.category_id)?.name || "Sin categoría"} · {p.product_type === "physical" ? "Producto físico" : p.product_type === "service" ? "Servicio" : "Digital"}</span></div>
                        </div></td>
                        <td><code className="product-code">{p.sku || "—"}</code></td>
                        <td>{p.unit_name || "unidad"}</td>
                        <td className="product-table-price"><strong>{money(p.sale_price_minor, currencyCode)}</strong><small>Costo {money(p.cost_price_minor, currencyCode)}</small></td>
                        <td><span className="muted-value">—</span></td>
                        <td>{p.commercial_presentation || <span className="muted-value">—</span>}</td>
                        <td><div className="product-table-stock"><strong>{stockSummary.usesVariantStock ? (stockSummary.known ? stockSummary.units.toLocaleString("es-CO") : stockSummary.empty ? "Sin combinaciones" : "Por configurar") : p.track_inventory ? Number(p.stock_on_hand).toLocaleString("es-CO") : "No aplica"}</strong>{stockSummary.usesVariantStock ? <small>{stockSummary.known ? "unidades en variantes" : "stock por combinación"}</small> : p.track_inventory && <small>{p.unit_name || "unidades"}</small>}{stockSummary.usesVariantStock && stockSummary.known && stockSummary.units <= 0 && <span className="stock-alert">Sin existencias</span>}{!stockSummary.usesVariantStock && p.track_inventory && p.low_stock_threshold !== null && Number(p.stock_on_hand) <= Number(p.low_stock_threshold) && <span className="stock-alert">Pocas existencias</span>}</div></td>
                        <td><span className={p.archived_at ? "status-pill status-inactive" : p.is_sellable ? "status-pill status-active" : "status-pill status-inactive"}>{p.archived_at ? "Archivado" : p.is_sellable ? "Activo" : "Inactivo"}</span></td>
                        <td><div className="catalog-cell"><span className={p.is_published ? "status-pill status-published" : "status-pill status-unpublished"}>{p.is_published ? "Publicado" : "No publicado"}</span></div></td>
                        <td><div className="product-row-actions">
                          <button type="button" className="icon-action-button share-product-button" title={"Compartir "+p.name} aria-label={"Compartir "+p.name} onClick={()=>shareProduct(p)}>↗</button>{canManageProducts && <button type="button" className="icon-action-button" title="Editar producto" aria-label="Editar producto" onClick={() => startEditProduct(p)}><AppIcon name="edit" size={16}/></button>}
                        </div></td>
                      </tr>
                    </React.Fragment>;})}</tbody>
                  </table>
                </div>
              ) : (
                <div className="product-list product-list-cards">{filteredProducts.map((p) => {
  const productVariants = variantsByProduct[p.id] || [];
  const stockSummary = summarizeProductVariantStock(p, productVariants);
  const productProfitMinor = Number(p.sale_price_minor || 0) - Number(p.cost_price_minor || 0);
  const productMargin = Number(p.sale_price_minor || 0) > 0 ? (productProfitMinor / Number(p.sale_price_minor)) * 100 : 0;
  return <article className="product-card panel product-card-wa mobile-detail-trigger" key={p.id} onClick={(event) => { if (!window.matchMedia("(max-width: 640px)").matches || event.target.closest("button,a,input,select,textarea")) return; openProductDetail(p); }}>
    <div className="product-card-wa-top">
      <div className="product-symbol product-thumb">{p.image_paths?.[0] && productImageUrls[p.id + "|" + p.image_paths[0]] ? <img src={productImageUrls[p.id + "|" + p.image_paths[0]]} alt={"Foto de " + p.name} onError={() => handleProductImageError(p.id, p.image_paths[0])} /> : <span>{p.product_type === "service" ? "◷" : p.product_type === "digital" ? "◇" : "▦"}</span>}</div>
      <div className="product-card-wa-copy">
        <h3>{p.name}</h3>
        <span className="product-card-wa-category">{categories.find((cat) => cat.id === p.category_id)?.name || "Sin categoría"}</span>
        <div className="product-card-wa-code"><span>Código</span><code>{p.sku || "—"}</code></div>
      </div>
    </div>
    <div className="product-card-wa-price-row">
      <div className="product-card-wa-price"><strong>{money(p.sale_price_minor, currencyCode)}</strong><small>Costo {money(p.cost_price_minor, currencyCode)}</small></div>
      <span className={p.archived_at ? "status-pill status-inactive" : p.is_sellable ? "status-pill status-active" : "status-pill status-inactive"}>{p.archived_at ? "Archivado" : p.is_sellable ? "Activo" : "Inactivo"}</span>
    </div>
    <div className="product-card-wa-details">
      <div><span>Existencias</span><strong>{stockSummary.usesVariantStock ? (stockSummary.known ? <>{stockSummary.units.toLocaleString("es-CO")}<span className="product-card-stock-unit"> unidades en variantes</span></> : stockSummary.empty ? "Sin combinaciones" : "Stock por configurar") : p.track_inventory ? <>{Number(p.stock_on_hand).toLocaleString("es-CO")}<span className="product-card-stock-unit"> {p.unit_name || "unidades"}</span></> : "No aplica"}</strong>{stockSummary.usesVariantStock && stockSummary.known && stockSummary.units <= 0 && <small className="stock-alert">Sin existencias en variantes</small>}{!stockSummary.usesVariantStock && p.track_inventory && p.low_stock_threshold !== null && Number(p.stock_on_hand) <= Number(p.low_stock_threshold) && <small className="stock-alert">Pocas existencias</small>}</div>
      <div className="product-card-wa-unit"><span>Unidad</span><strong>{p.unit_name || "unidad"}</strong></div>
      {p.commercial_presentation && <div className="product-card-wa-presentation"><span>Presentación</span><strong>{p.commercial_presentation}</strong></div>}
    </div>
    <div className="product-card-profit-row"><div><span>Ganancia por unidad</span><strong className={productProfitMinor < 0 ? "negative-value" : ""}>{money(productProfitMinor, currencyCode)}</strong></div><div><span>Margen</span><strong className={productMargin < 0 ? "negative-value" : ""}>{productMargin.toLocaleString("es-CO", { maximumFractionDigits: 1 })}%</strong></div></div>
    <div className="product-card-actions">
      <div className="product-card-variants"><div><span>Variantes</span><strong>{productVariants.length} {productVariants.length === 1 ? "variante" : "variantes"}</strong></div><button type="button" className="text-button" onClick={() => openProductVariants(p)}>Ver variantes</button><button type="button" className="text-button product-history-button" onClick={() => openBulkHistory(p)}>Historial</button></div>
      <div className="product-card-action-buttons"><button type="button" className="icon-action-button share-product-button" title={"Compartir "+p.name} aria-label={"Compartir "+p.name} onClick={()=>shareProduct(p)}>↗</button>{canManageProducts && <button type="button" className="icon-action-button" title="Editar producto" aria-label="Editar producto" onClick={() => startEditProduct(p)}>✎</button>}{canManageProducts && <button type="button" className="text-button" disabled={busy} onClick={() => archiveProduct(p)}>{p.archived_at ? "Restaurar" : "Archivar"}</button>}</div>
    </div>
  </article>;
})}</div>
              )
            ) : <div className="empty-state"><span className="empty-icon">▦</span><h3>{search ? "No encontramos coincidencias" : "Todavía no hay productos"}</h3><p>{search ? "Prueba con otro nombre." : "Añade tu primer producto. Solo mostraremos lo que guardes de verdad."}</p>{!search && <button className="primary-button" onClick={() => setShowProductForm(true)}>+ Crear primer producto</button>}</div>)}

            {!bulkEditMode && !productsLoading && productsCount > 0 && <div className="pagination-bar">
              <label className="page-size-control"><span className="field-label-heading">Mostrar
                </span><select value={productPageSize} onChange={(e) => { setProductPageSize(Number(e.target.value)); setProductPage(1); }}>
                  <option value={12}>12</option><option value={24}>24</option><option value={48}>48</option>
                </select>
                por página
              </label>
              <div className="pagination-controls">
                <button type="button" className="secondary-button" disabled={productPage <= 1 || productsLoading} onClick={() => setProductPage((page) => Math.max(1, page - 1))}>Anterior</button>
                <span className="pagination-status">Página {Math.min(productPage, totalProductPages)} de {totalProductPages}</span>
                <button type="button" className="secondary-button" disabled={productPage >= totalProductPages || productsLoading} onClick={() => setProductPage((page) => Math.min(totalProductPages, page + 1))}>Siguiente</button>
              </div>
            </div>}
            
          </section>
        ) : screen === "payments" ? (
          <PaymentsAdmin business={activeBusiness} />
        ) : screen === "coupons" ? (
          <CouponsAdmin business={activeBusiness} />
        ) : screen === "settings" ? (
          <section className="settings-page">
            <div className="settings-intro"><h2>{activeBusiness?.role === "owner" ? "Configuración del negocio" : "Mi cuenta"}</h2><p>{activeBusiness?.role === "owner" ? "Administra los datos, impuestos, catálogo y apariencia de tu negocio." : "Administra tu correo de acceso y el idioma personal de la aplicación."}</p></div>
            <div className="settings-tabs" role="tablist" aria-label="Secciones de configuración">
              {(activeBusiness?.role === "owner" ? [
                ["general", "General"],
                ["account", "Mi cuenta"],
                ["company", "Mi empresa"],
                ["catalog", "Catálogo"],
                ["customization", "Personalización"],
                ["help", "Ayudas"],
                ["assistant", "Asistente"],
                ["language", "Idioma"],
                ["taxes", "Impuestos"],
                ["data", "Datos y copias"]
              ] : [
                ["account", "Mi cuenta"],
                ["language", "Idioma"]
              ]).concat(isPlatformAdmin ? [["platform_admin", "Administración de plataforma"]] : []).map(([tab, label]) => <button key={tab} type="button" role="tab" aria-selected={settingsTab === tab} className={settingsTab === tab ? "settings-tab active" : "settings-tab"} onClick={() => setSettingsTab(tab)}>{label}</button>)}
            </div>
            <form className="settings-card panel" onSubmit={saveSettings} hidden={settingsTab === "platform_admin"}>
              <div hidden={!["account", "general", "company", "catalog", "customization", "help", "assistant", "language", "taxes", "data"].includes(settingsTab)} className="settings-tab-panel">
              <div hidden={settingsTab !== "account"} className="settings-tab-content account-settings-panel">
                <div className="settings-icon"><AppIcon name="mail" size={23}/></div>
                <h3>Correo de acceso</h3>
                <p>Este es el correo asociado a tu usuario. Lo puedes usar para iniciar sesión y recuperar el acceso a treseiscinco.</p>
                <div className="account-phone-status"><span>Correo registrado</span><strong>{session?.user?.email || "Correo no disponible"}</strong></div>
                <p className="helper-text">El acceso queda vinculado al correo que aparece arriba.</p>
              </div>
              <div hidden={settingsTab !== "general"} className="settings-tab-content">
              <div className="settings-icon"><AppIcon name="settings" size={23} /></div>
              <h3>Datos del negocio</h3>
              <p>Actualiza el nombre y la moneda de las operaciones.</p>
              <div className="owner-contact-settings">
                <label className="settings-field"><span className="field-label-heading">Celular del propietario</span><input type="tel" inputMode="tel" autoComplete="tel" value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} maxLength={40} placeholder="Tu número de celular" /></label>
                <div className="owner-contact-actions"><p className="helper-text">Este número pertenece a tu cuenta personal. Es independiente del teléfono público de tu empresa.</p><button type="button" className="secondary-button" onClick={saveOwnerPhone} disabled={ownerPhoneSaving || !session?.user?.id}>{ownerPhoneSaving ? "Guardando…" : "Guardar celular"}</button></div>
              </div>
              {settingsChecking ? <p className="helper-text">Comprobando si ya hay importes guardados…</p> : <>
                <label className="settings-field"><span className="field-label-heading">Nombre del negocio</span><input value={settingsBusinessName} onChange={(e) => setSettingsBusinessName(e.target.value)} maxLength={160} required disabled={activeBusiness?.role !== "owner"} placeholder="Nombre de tu negocio" /></label>
                <label className="settings-field"><span className="field-label-heading">Moneda principal<FieldHelp enabled={contextualHelpEnabled} text="Moneda usada para nuevos importes y reportes. Si ya hay operaciones registradas, cambiarla requiere conversión." /></span><select value={settingsCurrency} disabled={activeBusiness?.role !== "owner"} onChange={(e) => setSettingsCurrency(e.target.value)}>{[...currencyOptions].sort((a, b) => a[1].localeCompare(b[1], "es", { sensitivity: "base" }) || a[0].localeCompare(b[0])).map(([code, name]) => <option key={code} value={code}>{name} ({code})</option>)}</select></label><p className="settings-payment-currency-note"><strong>Importante sobre los pagos:</strong> los pagos en línea dentro de treseiscinco solo se procesan mediante Wompi y, actualmente, Wompi admite COP. Si eliges otra moneda o no quieres usar Wompi, selecciona <strong>Pedidos por WhatsApp</strong> en “Mi empresa”; en ese caso, el cliente acuerda el pago directamente contigo y treseiscinco no lo verifica.</p>
                {settingsHasData && settingsCurrency !== currencyCode ? <div className="settings-conversion-box"><p className="helper-text">Se convertirán los precios de venta y costo del catálogo y sus variantes. Las ventas, compras, gastos y cotizaciones existentes conservarán sus importes y moneda históricos.</p><label className="settings-field"><span>Tasa de conversión</span><span className="helper-text">¿Cuántas unidades de {settingsCurrency} equivalen a 1 {currencyCode}?</span><input type="number" min="0.00000001" step="any" inputMode="decimal" value={settingsConversionRate} onChange={(e) => setSettingsConversionRate(e.target.value)} placeholder="Ej. 0,00024" required /></label><p className="helper-text">Confirma la tasa antes de guardar. La conversión se ejecuta en una sola transacción en la base de datos.</p></div> : settingsHasData ? <p className="helper-text">Puedes cambiar la moneda principal. Si eliges otra, te pediremos una tasa para convertir los precios actuales del catálogo sin modificar los movimientos históricos.</p> : <p className="helper-text">Elige la moneda para los precios del catálogo y los próximos movimientos de dinero.</p>}
                {activeBusiness?.role !== "owner" && <p className="helper-text">Solo el propietario puede cambiar estos ajustes.</p>}
              </>}
              </div>
              <div hidden={settingsTab !== "customization"} className="settings-tab-content">
              <div className="settings-section-divider" />
              <h3>Logo del negocio</h3>
              <p>Tu logo se conservará para las próximas sesiones y se mostrará en la navegación y el catálogo público.</p>
              <div className="settings-logo-editor">
                <div className="settings-logo-preview">{(settingsLogoPreview || (!settingsRemoveLogo && activeBusiness?.logo_path)) ? <img src={settingsLogoPreview || getBusinessLogoUrl(activeBusiness?.logo_path)} alt="Vista previa del logo del negocio" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/symbol-treseiscinco.svg"; }} /> : <img className="default-business-logo" src="/symbol-treseiscinco.svg" alt="Logo de treseiscinco" />}</div>
                <div className="settings-logo-controls">
                  <label className="settings-field"><span className="field-label-heading">Elegir logo<FieldHelp enabled={contextualHelpEnabled} text="Sube el logo de tu negocio para identificarlo en la aplicación y el catálogo compartido." /></span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseBusinessLogo} disabled={activeBusiness?.role !== "owner" || busy} /></label>
                  <p className="helper-text">JPG, PNG o WebP; máximo 5 MB. Se optimiza al guardar.</p>
                  {(settingsLogoFile || activeBusiness?.logo_path) && <button type="button" className="secondary-button settings-remove-logo" onClick={clearBusinessLogo} disabled={activeBusiness?.role !== "owner" || busy}>{settingsRemoveLogo ? "Logo marcado para quitar" : "Quitar logo"}</button>}
                  {settingsLogoFile && <p className="settings-logo-filename">Seleccionado: {settingsLogoFile.name}</p>}
                </div>
              </div>

              <div className="settings-section-divider" />
              <h3>Colores y apariencia</h3>
              <p>Personaliza el aspecto de tu negocio con cualquier color. El texto, los enlaces y los botones ajustan automáticamente su contraste para mantenerse legibles.</p>
              <div className="settings-color-grid">
                <label className="settings-color-field"><span className="field-label-heading"><span>Color de acento</span><FieldHelp enabled={contextualHelpEnabled} text="Color principal para botones, enlaces, iconos e indicadores. Puedes elegir cualquier tono." /></span><input type="color" aria-label="Color de acento" value={settingsTheme.primary} onChange={(e) => setSettingsTheme((current) => ({ ...current, primary: e.target.value }))} disabled={activeBusiness?.role !== "owner"} /><code>{settingsTheme.primary.toUpperCase()}</code></label>
                <label className="settings-color-field"><span className="field-label-heading"><span>Fondo de la aplicación</span><FieldHelp enabled={contextualHelpEnabled} text="Cambia el fondo general de las pantallas. El texto se adapta automáticamente a este color." /></span><input type="color" aria-label="Fondo de la aplicación" value={settingsTheme.background} onChange={(e) => setSettingsTheme((current) => ({ ...current, background: e.target.value }))} disabled={activeBusiness?.role !== "owner"} /><code>{settingsTheme.background.toUpperCase()}</code></label>
                <label className="settings-color-field"><span className="field-label-heading"><span>Fondo de tarjetas y paneles</span><FieldHelp enabled={contextualHelpEnabled} text="Color de las tarjetas, formularios y paneles. El texto se ajusta automáticamente para mantener el contraste." /></span><input type="color" aria-label="Fondo de tarjetas y paneles" value={settingsTheme.surface} onChange={(e) => setSettingsTheme((current) => ({ ...current, surface: e.target.value }))} disabled={activeBusiness?.role !== "owner"} /><code>{settingsTheme.surface.toUpperCase()}</code></label>
                <label className="settings-color-field"><span className="field-label-heading"><span>Fondo del menú lateral</span><FieldHelp enabled={contextualHelpEnabled} text="Cambia únicamente el fondo del menú lateral. El sistema propone el color de texto con mejor contraste, y puedes ajustar ese color en el control siguiente." /></span><input type="color" aria-label="Fondo del menú lateral" value={settingsTheme.sidebarBackground} onChange={(e) => setSettingsTheme((current) => ({ ...current, sidebarBackground: e.target.value }))} disabled={activeBusiness?.role !== "owner"} /><code>{settingsTheme.sidebarBackground.toUpperCase()}</code></label>
                <label className="settings-color-field"><span className="field-label-heading"><span>Texto del menú lateral</span><FieldHelp enabled={contextualHelpEnabled} text="Elige el color de las letras del menú. Si el tono elegido tiene poco contraste con el fondo, la aplicación priorizará la legibilidad." /></span><input type="color" aria-label="Texto del menú lateral" value={settingsTheme.sidebarText} onChange={(e) => setSettingsTheme((current) => ({ ...current, sidebarText: e.target.value }))} disabled={activeBusiness?.role !== "owner"} /><code>{settingsTheme.sidebarText.toUpperCase()}</code></label>
              </div>
              <p className="settings-contrast-note"><span aria-hidden="true">✓</span> Contraste automático activado: no necesitas elegir manualmente el color de las letras ni el del texto al pasar el cursor.</p>
              <div className="settings-theme-preview" style={{ "--preview-primary": settingsTheme.primary, "--preview-button-text": readableText(settingsTheme.primary, "#FFFFFF"), "--preview-background": settingsTheme.background, "--preview-surface": settingsTheme.surface, "--preview-text": readableText(settingsTheme.background, settingsTheme.text), "--preview-surface-text": readableText(settingsTheme.surface, settingsTheme.text), "--preview-sidebar-background": settingsTheme.sidebarBackground, "--preview-sidebar-text": readableText(settingsTheme.sidebarBackground, settingsTheme.sidebarText), "--button-hover": shadeHex(settingsTheme.primary), "--button-hover-text": readableText(shadeHex(settingsTheme.primary), "#FFFFFF") }}>
                <div className="settings-theme-preview-brand">{settingsLogoPreview || (!settingsRemoveLogo && activeBusiness?.logo_path) ? <img src={settingsLogoPreview || getBusinessLogoUrl(activeBusiness?.logo_path)} alt="" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/symbol-treseiscinco.svg"; }} /> : <img className="default-business-logo" src="/symbol-treseiscinco.svg" alt="Logo de treseiscinco" />}<strong>{settingsBusinessName || activeBusiness?.name || "Tu negocio"}</strong></div>
                <div className="settings-theme-preview-sidebar"><strong className="settings-app-brand"><img src="/symbol-treseiscinco.svg" alt="" /> <span>treseiscinco</span></strong><span>Inicio</span><span>Productos</span><span>Ventas</span></div>
                <p>Comprueba el aspecto general, el color propio del sidebar y los colores de los botones.</p><button type="button">Acción principal</button>
              </div>
              {activeBusiness?.role === "owner" && <div className="settings-theme-reset-block"><button type="button" className="settings-reset-theme" onClick={() => setSettingsTheme({ ...treseiscincoTheme })}><span aria-hidden="true">↺</span> Usar paleta de treseiscinco</button><p>Recupera la paleta habitual de treseiscinco. También puedes elegir cualquier color con los controles anteriores. Tu logo no se modifica; guarda para aplicar los cambios.</p></div>}
              </div>
              <div hidden={settingsTab !== "help"} className="settings-tab-content">
              <div className="settings-section-divider" />
              <h3>Ayudas contextuales</h3>
              <p>El botón flotante «Ayuda» muestra la guía de la sección actual. Los consejos junto a los campos se pueden ocultar por separado.</p>
              <label className="settings-help-toggle"><input type="checkbox" checked={settingsHelpEnabled} onChange={(e) => setSettingsHelpEnabled(e.target.checked)} disabled={activeBusiness?.role !== "owner"} /><span><strong>Mostrar consejos junto a los campos<FieldHelp enabled={contextualHelpEnabled} text="Activa o desactiva los iconos de ayuda breve junto a los campos. El botón general «Ayuda» permanece visible." /></strong><small>Esta opción solo controla los iconos junto a los campos. El botón flotante «Ayuda» siempre permanece disponible.</small></span></label>
              {activeBusiness?.role !== "owner" && <p className="helper-text">Solo el propietario puede modificar estas preferencias.</p>}
              </div>
              <div hidden={settingsTab !== "assistant"} className="settings-tab-content assistant-settings-panel">
                <div className="settings-icon"><AppIcon name="sparkles" size={23} /></div>
                <h3>Tu asistente inteligente</h3>
                <p>Personaliza cómo se presenta tu asistente. El nombre se conserva para este negocio y la voz de respuesta permanece en Celeste.</p>
                <label className="settings-field"><span>Nombre del asistente</span><input type="text" maxLength={32} value={settingsAssistantName} onChange={(event) => setSettingsAssistantName(event.target.value)} placeholder="Angie" disabled={activeBusiness?.role !== "owner" || busy} /></label>
                <div className="settings-assistant-voice"><strong>Voz de respuesta</strong><span>Celeste · Aura‑2 en español</span><small>La reproducción automática se puede activar o desactivar desde el encabezado del asistente.</small></div>
                <p className="helper-text">El asistente recuerda las preferencias y objetivos no sensibles que le pidas guardar. Los recuerdos son privados por usuario y negocio, y puedes borrarlos desde el propio asistente.</p>
                {activeBusiness?.role !== "owner" && <p className="helper-text">Solo el propietario puede cambiar el nombre del asistente.</p>}
              </div>
              <div hidden={settingsTab !== "language"} className="settings-tab-content language-settings-panel">
                <div className="settings-icon"><AppIcon name="grid" size={23} /></div>
                <h3>Idioma de la aplicación</h3>
                <p>Selecciona el idioma de toda la interfaz de treseiscinco. El cambio se aplica inmediatamente y se guarda en este navegador.</p>
                <label className="settings-field"><span className="field-label-heading">Idioma</span><select value={uiLanguage} onChange={(event) => { const next = ["es","en","pt","it","fr"].includes(event.target.value) ? event.target.value : "es"; setUiLanguage(next); try { window.localStorage.setItem("treseiscinco-language:" + (session?.user?.id || "guest"), next); } catch {} setNotice(({es:"Idioma guardado.",en:"Language saved.",pt:"Idioma salvo.",it:"Lingua salvata.",fr:"Langue enregistrée."})[next]); }}><option value="en">English</option><option value="es">Español</option><option value="fr">Français</option><option value="it">Italiano</option><option value="pt">Português</option></select></label>
                <p className="helper-text">Al elegir English se traducen los textos de navegación, formularios, botones, ayudas, estados y mensajes que estén incluidos en el catálogo de traducciones. Los nombres y datos escritos por ti no se traducen.</p>
              </div>
              <div hidden={settingsTab !== "taxes"} className="settings-tab-content tax-settings-panel">
                <div className="settings-icon"><AppIcon name="stats" size={23} /></div>
                <h3>Impuestos y tratamiento fiscal</h3>
                <p>Configura el perfil tributario de tu negocio. No activaremos el cobro de IVA por defecto ni cambiaremos movimientos históricos.</p>
                <label className="settings-field"><span className="field-label-heading">¿Cómo está tu negocio frente al IVA?</span><select value={settingsTaxProfile.vatStatus} onChange={(event) => setSettingsTaxProfile((current) => ({ ...current, vatStatus: event.target.value }))} disabled={activeBusiness?.role !== "owner"}><option value="unsure">No estoy seguro todavía</option><option value="responsible">Responsable de IVA</option><option value="not_responsible">No responsable de IVA</option><option value="not_applicable">Mis operaciones no están gravadas con IVA</option></select></label>
                {settingsTaxProfile.vatStatus === "responsible" && <>
                  <label className="settings-field"><span className="field-label-heading">Tarifa predeterminada de IVA</span><select value={settingsTaxProfile.defaultRateMode === "custom" ? "custom" : String(settingsTaxProfile.defaultRate)} onChange={(event) => setSettingsTaxProfile((current) => event.target.value === "custom" ? { ...current, defaultRateMode: "custom" } : { ...current, defaultRateMode: "standard", defaultRate: Number(event.target.value) })} disabled={activeBusiness?.role !== "owner"}><option value="19">IVA general (19 %)</option><option value="5">IVA diferencial (5 %)</option><option value="0">0 %</option><option value="custom">Tarifa personalizada</option></select></label>
                  {settingsTaxProfile.defaultRateMode === "custom" && <label className="settings-field"><span className="field-label-heading">Porcentaje de IVA</span><input type="number" min="0" max="100" step="0.01" inputMode="decimal" value={settingsTaxProfile.customRate} onChange={(event) => setSettingsTaxProfile((current) => ({ ...current, customRate: event.target.value }))} disabled={activeBusiness?.role !== "owner"} /></label>}
                  <label className="settings-help-toggle"><input type="checkbox" checked={settingsTaxProfile.pricesIncludeVat} onChange={(event) => setSettingsTaxProfile((current) => ({ ...current, pricesIncludeVat: event.target.checked }))} disabled={activeBusiness?.role !== "owner"} /><span><strong>Los precios ya incluyen IVA</strong><small>Activa esta opción si la tarifa publicada ya contiene el impuesto.</small></span></label>
                  <label className="settings-help-toggle"><input type="checkbox" checked={settingsTaxProfile.showVatBreakdown} onChange={(event) => setSettingsTaxProfile((current) => ({ ...current, showVatBreakdown: event.target.checked }))} disabled={activeBusiness?.role !== "owner"} /><span><strong>Mostrar IVA por separado en nuevos documentos</strong><small>Preferencia para documentos que admitan desglose tributario.</small></span></label>
                </>}
                <div className="tax-guidance-note tax-withholding-note">
                  <strong>Retenciones: Retefuente, ReteIVA y ReteICA</strong>
                  <p>Son retenciones aplicables a determinadas operaciones o pagos, no una tarifa fija de cada producto. Dependen del concepto, de la situación tributaria de las partes y, para ReteICA, de la actividad y el municipio. Esta versión no las calcula automáticamente; confirma su aplicación con un contador o la DIAN.</p>
                </div>
                <div className="tax-guidance-note">
                  <strong>Importante:</strong>
                  <p>Esta configuración guarda tu perfil y una tarifa predeterminada; no activa por sí sola el cobro de IVA ni recalcula ventas, compras o cotizaciones. La tarifa puede variar según el producto o servicio y tu responsabilidad tributaria. Revisa tu RUT y confirma tu situación con un contador o la DIAN antes de cobrar IVA.</p>
                </div>
                {activeBusiness?.role !== "owner" && <p className="helper-text">Solo el propietario puede modificar estos ajustes.</p>}
              </div>
              <div hidden={settingsTab !== "data"} className="settings-tab-content settings-data-panel">
                <div className="settings-icon"><AppIcon name="settings" size={23}/></div>
                <h3>Copias de seguridad</h3>
                <p>Descarga una copia de los registros accesibles de este negocio. El archivo incluye las filas que tus permisos permiten consultar y señala cualquier tabla que no se haya podido exportar.</p>
                <div className="settings-data-card"><div><strong>Copia de seguridad del negocio</strong><p>Productos, categorías, clientes, proveedores, ventas, pagos, compras, gastos, movimientos, cotizaciones, cupones y auditoría cuando los permisos lo permitan.</p></div><button type="button" className="primary-button" onClick={downloadBusinessBackup} disabled={backupBusy||!activeBusiness?.id||activeBusiness?.role!=="owner"}>{backupBusy?"Preparando copia…":"Descargar copia"}</button></div>
                {activeBusiness?.role!=="owner"&&<p className="helper-text">Solo el propietario puede descargar una copia completa del negocio.</p>}
                <div className="tax-guidance-note"><strong>Importante</strong><p>La descarga no incluye contraseñas, credenciales privadas de pasarelas ni cuentas de acceso. Guarda el archivo en un lugar seguro; contiene información comercial y datos de clientes.</p></div>
              </div>
              </div>
              <div hidden={settingsTab !== "company"} className="settings-tab-panel company-profile-panel">
                <div className="settings-icon"><AppIcon name="team" size={23} /></div>
                <h3>Mi empresa</h3>
                <p>Estos datos acompañarán el logo en las cotizaciones y documentos que compartas con tus clientes.</p>
                <label className="settings-field"><span className="field-label-heading">Nombre comercial</span><input value={settingsCommercialProfile.tradeName} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, tradeName: e.target.value }))} maxLength={160} disabled={activeBusiness?.role !== "owner"} placeholder={settingsBusinessName || "Nombre que verá tu cliente"} /></label>
                <label className="settings-field"><span className="field-label-heading">Propietario o persona de contacto</span><input value={settingsCommercialProfile.ownerName || ""} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, ownerName: e.target.value }))} maxLength={160} disabled={activeBusiness?.role !== "owner"} placeholder="Nombre de la persona responsable" /></label>
                <label className="settings-field"><span className="field-label-heading">NIT o documento</span><input value={settingsCommercialProfile.documentNumber} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, documentNumber: e.target.value }))} maxLength={80} disabled={activeBusiness?.role !== "owner"} placeholder="Identificación tributaria (opcional)" /></label>
                <div className="company-profile-grid">
                  <label className="settings-field"><span className="field-label-heading">Correo comercial</span><input type="email" value={settingsCommercialProfile.email} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, email: e.target.value }))} maxLength={254} disabled={activeBusiness?.role !== "owner"} placeholder="ventas@tuempresa.com" /></label>
                  <label className="settings-field"><span className="field-label-heading">Teléfono / WhatsApp</span><input type="tel" inputMode="tel" autoComplete="tel" value={settingsCommercialProfile.phone} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, phone: e.target.value }))} maxLength={60} disabled={activeBusiness?.role !== "owner"} placeholder="Número de contacto" /></label>
                </div>
                <label className="settings-field"><span className="field-label-heading">Dirección</span><input value={settingsCommercialProfile.address} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, address: e.target.value }))} maxLength={220} disabled={activeBusiness?.role !== "owner"} placeholder="Dirección comercial" /></label>
                <div className="company-profile-grid">
                  <label className="settings-field"><span className="field-label-heading">Ciudad</span><input value={settingsCommercialProfile.city} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, city: e.target.value }))} maxLength={100} disabled={activeBusiness?.role !== "owner"} placeholder="Ciudad, departamento" /></label>
                  <label className="settings-field"><span className="field-label-heading">Sitio web</span><input value={settingsCommercialProfile.website} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, website: e.target.value }))} maxLength={200} disabled={activeBusiness?.role !== "owner"} placeholder="https://tuempresa.com" /></label>
                </div>
                
                <div className="business-card-preview-wrap">
                  <div className="business-card-preview" style={{ background: settingsCommercialProfile.cardSurface || "#FFFFFF", color: settingsCommercialProfile.cardText || "#1F2937", borderColor: settingsCommercialProfile.cardPrimary || "#475569", borderTop: "4px solid " + (settingsCommercialProfile.cardPrimary || "#475569"), "--business-card-primary": settingsCommercialProfile.cardPrimary || "#475569", "--business-card-text": settingsCommercialProfile.cardText || "#1F2937" }}>
                    <div className="business-card-preview-logo">{settingsLogoPreview || (!settingsRemoveLogo && activeBusiness?.logo_path) ? <img src={settingsLogoPreview || getBusinessLogoUrl(activeBusiness.logo_path)} alt="Logo de la empresa" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/symbol-treseiscinco.svg"; }} /> : <img className="default-business-logo" src="/symbol-treseiscinco.svg" alt="Logo de treseiscinco" />}</div>
                    <div className="business-card-preview-copy"><h3 style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.tradeName||settingsBusinessName||activeBusiness?.name||"Tu negocio"}</h3>{settingsCommercialProfile.ownerName&&<span className="business-card-owner" style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.ownerName}</span>}{settingsCommercialProfile.publicDescription&&<p style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.publicDescription}</p>}{settingsCommercialProfile.phone&&<span style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.phone}</span>}{settingsCommercialProfile.email&&<span style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.email}</span>}{[settingsCommercialProfile.address,settingsCommercialProfile.city].filter(Boolean).join(", ")&&<span style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{[settingsCommercialProfile.address,settingsCommercialProfile.city].filter(Boolean).join(", ")}</span>}{settingsCommercialProfile.website&&<span style={{color:settingsCommercialProfile.cardText||"#1F2937"}}>{settingsCommercialProfile.website}</span>}</div>
                  </div>
                  <div className="business-card-preview-actions"><span>Vista previa · 9 × 5 cm</span><button type="button" className="secondary-button" onClick={printBusinessCard}>Imprimir o guardar como PDF</button></div>
                </div>
                <div className="business-card-color-controls">
                  <label className="settings-color-field"><span className="field-label-heading">Color de acento de la tarjeta</span><input type="color" value={settingsCommercialProfile.cardPrimary || "#475569"} disabled={activeBusiness?.role !== "owner"} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, cardPrimary: e.target.value }))}/><code>{(settingsCommercialProfile.cardPrimary || "#475569").toUpperCase()}</code></label>
                  <label className="settings-color-field"><span className="field-label-heading">Fondo de la tarjeta</span><input type="color" value={settingsCommercialProfile.cardSurface || "#FFFFFF"} disabled={activeBusiness?.role !== "owner"} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, cardSurface: e.target.value }))}/><code>{(settingsCommercialProfile.cardSurface || "#FFFFFF").toUpperCase()}</code></label>
                  <label className="settings-color-field"><span className="field-label-heading">Texto de la tarjeta</span><input type="color" value={settingsCommercialProfile.cardText || "#1F2937"} disabled={activeBusiness?.role !== "owner"} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, cardText: e.target.value }))}/><code>{(settingsCommercialProfile.cardText || "#1F2937").toUpperCase()}</code></label>
                </div>
                </div>
              <div hidden={settingsTab !== "catalog"} className="settings-tab-panel catalog-settings-panel">
                <div className="settings-icon"><AppIcon name="catalog" size={23}/></div>
                <h3>Catálogo</h3>
                <p>Organiza la información pública, los horarios, las entregas y la forma en que recibes pedidos.</p>
                <label className="settings-field"><span className="field-label-heading">Descripción pública</span><textarea value={settingsCommercialProfile.publicDescription} onChange={(e) => setSettingsCommercialProfile((current) => ({ ...current, publicDescription: e.target.value }))} maxLength={500} rows={3} disabled={activeBusiness?.role !== "owner"} placeholder="Cuenta brevemente qué ofrece tu negocio. Aparecerá en tu catálogo público." /></label>
                <div className="settings-catalog-link-panel">
                  <span className="eyebrow">ENLACE PÚBLICO</span>
                  <label className="settings-field"><span className="field-label-heading">Dirección corta de tu catálogo</span><input value={settingsCatalogSlug} onChange={(event)=>setSettingsCatalogSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"").replace(/-+/g,"-").slice(0,60))} maxLength={60} disabled={activeBusiness?.role!=="owner"} placeholder="mi-negocio" autoComplete="off" /></label>
                  <p>Tu catálogo se compartirá desde una dirección fácil de recordar. Usa letras sin tildes, números y guiones.</p>
                  <a href={settingsCatalogSlug.trim() ? "https://treseiscinco.com/"+settingsCatalogSlug.trim().toLowerCase() : "https://treseiscinco.com/"} target="_blank" rel="noopener noreferrer">{settingsCatalogSlug.trim() ? "https://treseiscinco.com/"+settingsCatalogSlug.trim().toLowerCase() : "https://treseiscinco.com/"} ↗</a>
                  <div className="settings-catalog-options">
                    <label className="settings-field"><span className="field-label-heading">Productos sin existencias</span><select value={settingsCommercialProfile.stockVisibility||"hide"} disabled={activeBusiness?.role!=="owner"} onChange={(event)=>setSettingsCommercialProfile((current)=>({...current,stockVisibility:event.target.value}))}><option value="show_all">Mostrar productos como siempre</option><option value="hide">Ocultar los productos sin existencias</option><option value="show_unavailable">Mostrar como agotados y bloquear compra</option></select><small>El catálogo se actualiza según esta preferencia.</small></label>
                    <div className="settings-field"><span className="field-label-heading">Entrega disponible</span><div className="settings-delivery-options">
                      <label><input type="checkbox" checked={(settingsCommercialProfile.deliveryMethods||[]).includes("pickup")} disabled={activeBusiness?.role!=="owner"} onChange={(event)=>setSettingsCommercialProfile((current)=>({...current,deliveryMethods:event.target.checked?[...new Set([...(current.deliveryMethods||[]),"pickup"]) ]:(current.deliveryMethods||[]).filter((method)=>method!=="pickup")}))}/><span><strong>Recogida en el negocio</strong><small>El cliente pasa a buscar su pedido.</small></span></label>
                      <label><input type="checkbox" checked={(settingsCommercialProfile.deliveryMethods||[]).includes("delivery")} disabled={activeBusiness?.role!=="owner"} onChange={(event)=>setSettingsCommercialProfile((current)=>({...current,deliveryMethods:event.target.checked?[...new Set([...(current.deliveryMethods||[]),"delivery"]) ]:(current.deliveryMethods||[]).filter((method)=>method!=="delivery")}))}/><span><strong>Entrega a domicilio</strong><small>El negocio coordina la entrega.</small></span></label>
                    </div></div>
                  </div>
                </div>
                <section className="catalog-color-customizer">
                  <div><h4>Colores de la vitrina</h4><p>Personaliza el aspecto que ven tus clientes. Esto no cambia los colores de tu espacio de trabajo.</p></div>
                  <div className="catalog-color-fields">
                    <label className="settings-color-field"><span className="field-label-heading">Color principal</span><input type="color" value={settingsCommercialProfile.catalogPrimary || "#167D82"} disabled={activeBusiness?.role !== "owner"} onChange={(event) => setSettingsCommercialProfile((current) => ({ ...current, catalogPrimary: event.target.value }))}/><code>{(settingsCommercialProfile.catalogPrimary || "#167D82").toUpperCase()}</code></label>
                    <label className="settings-color-field"><span className="field-label-heading">Fondo de la página</span><input type="color" value={settingsCommercialProfile.catalogBackground || "#F5F7FC"} disabled={activeBusiness?.role !== "owner"} onChange={(event) => setSettingsCommercialProfile((current) => ({ ...current, catalogBackground: event.target.value }))}/><code>{(settingsCommercialProfile.catalogBackground || "#F5F7FC").toUpperCase()}</code></label>
                    <label className="settings-color-field"><span className="field-label-heading">Fondo de tarjetas</span><input type="color" value={settingsCommercialProfile.catalogSurface || "#FFFFFF"} disabled={activeBusiness?.role !== "owner"} onChange={(event) => setSettingsCommercialProfile((current) => ({ ...current, catalogSurface: event.target.value }))}/><code>{(settingsCommercialProfile.catalogSurface || "#FFFFFF").toUpperCase()}</code></label>
                    <label className="settings-color-field"><span className="field-label-heading">Color del texto</span><input type="color" value={settingsCommercialProfile.catalogText || "#24352B"} disabled={activeBusiness?.role !== "owner"} onChange={(event) => setSettingsCommercialProfile((current) => ({ ...current, catalogText: event.target.value }))}/><code>{(settingsCommercialProfile.catalogText || "#24352B").toUpperCase()}</code></label>
                  </div>
                  {activeBusiness?.role !== "owner" && <p className="helper-text">Solo el propietario puede cambiar la paleta pública.</p>}
                </section>
                
                <div className="settings-section-divider" />
                <div className="settings-hours-editor"><div><h4>Horario de atención</h4><p>Marca los días en que trabajas. Puedes indicar dos turnos si cierras al mediodía.</p></div>
                  {([{key:"mon",label:"Lunes"},{key:"tue",label:"Martes"},{key:"wed",label:"Miércoles"},{key:"thu",label:"Jueves"},{key:"fri",label:"Viernes"},{key:"sat",label:"Sábado"},{key:"sun",label:"Domingo"}]).map((day) => { const dayHours=settingsCommercialProfile.hoursSchedule?.[day.key] || {enabled:false,periods:[{open:"09:00",close:"18:00"}]}; const periods=Array.isArray(dayHours.periods)&&dayHours.periods.length?dayHours.periods:[{open:"09:00",close:"18:00"}]; return <div className={"settings-hours-day"+(dayHours.enabled?" is-enabled":"")} key={day.key}><label className="settings-hours-day-check"><input type="checkbox" checked={Boolean(dayHours.enabled)} disabled={activeBusiness?.role!=="owner"} onChange={(e)=>setSettingsCommercialProfile((current)=>({ ...current, hoursSchedule:{...(current.hoursSchedule||{}),[day.key]:{enabled:e.target.checked,periods:(current.hoursSchedule?.[day.key]?.periods?.length?current.hoursSchedule[day.key].periods:[{open:"09:00",close:"18:00"}])}} }))}/><strong>{day.label}</strong></label>
                    <div className="settings-hours-periods">{periods.slice(0,2).map((period,index)=><div className="settings-hours-period" key={index}><span>{index===0?"Primer turno":"Segundo turno"}</span><label><span>Apertura</span><input type="time" value={period.open||""} disabled={!dayHours.enabled||activeBusiness?.role!=="owner"} onChange={(e)=>setSettingsCommercialProfile((current)=>({ ...current,hoursSchedule:{...(current.hoursSchedule||{}),[day.key]:{...dayHours,periods:periods.map((p,i)=>i===index?{...p,open:e.target.value}:p)}} }))}/></label><label><span>Cierre</span><input type="time" value={period.close||""} disabled={!dayHours.enabled||activeBusiness?.role!=="owner"} onChange={(e)=>setSettingsCommercialProfile((current)=>({ ...current,hoursSchedule:{...(current.hoursSchedule||{}),[day.key]:{...dayHours,periods:periods.map((p,i)=>i===index?{...p,close:e.target.value}:p)}} }))}/></label></div>)}</div>
                    {dayHours.enabled && periods.length<2 && <button type="button" className="settings-hours-add" disabled={activeBusiness?.role!=="owner"} onClick={()=>setSettingsCommercialProfile((current)=>({ ...current,hoursSchedule:{...(current.hoursSchedule||{}),[day.key]:{...dayHours,periods:[{...periods[0],close:periods[0].open==="09:00"&&periods[0].close==="18:00"?"12:00":periods[0].close},{open:periods[0].open==="09:00"&&periods[0].close==="18:00"?"13:00":periods[0].close,close:"17:00"}]}} }))}>＋ Agregar segundo turno</button>}{dayHours.enabled && periods.length>1 && <button type="button" className="settings-hours-add remove" disabled={activeBusiness?.role!=="owner"} onClick={()=>setSettingsCommercialProfile((current)=>({ ...current,hoursSchedule:{...(current.hoursSchedule||{}),[day.key]:{...dayHours,periods:periods.slice(0,1)}} }))}>− Quitar segundo turno</button>}</div>})}
                </div>
                <div className="settings-section-divider" /><h3>Cómo quieres recibir pedidos</h3><p>Elige un canal para el catálogo público. No necesitas activar Wompi si prefieres coordinar el pedido por WhatsApp.</p>
                <div className="settings-channel-choices"><label className={settingsCommercialProfile.orderChannel==="wompi"?"selected":""}><input type="radio" name="orderChannel" checked={settingsCommercialProfile.orderChannel==="wompi"} disabled={activeBusiness?.role!=="owner"} onChange={()=>setSettingsCommercialProfile((current)=>({...current,orderChannel:"wompi"}))}/><span><strong>Pago en línea con Wompi</strong><small>{wompiStatus.loading?"Comprobando conexión…":wompiStatus.enabled?"Conexión activa · "+(wompiStatus.environment==="production"?"Producción":"Pruebas"):"Requiere credenciales de tu cuenta Wompi antes de recibir pagos."}</small></span></label><label className={settingsCommercialProfile.orderChannel==="whatsapp"?"selected":""}><input type="radio" name="orderChannel" checked={settingsCommercialProfile.orderChannel==="whatsapp"} disabled={activeBusiness?.role!=="owner"} onChange={()=>setSettingsCommercialProfile((current)=>({...current,orderChannel:"whatsapp"}))}/><span><strong>Pedidos por WhatsApp</strong><small>El catálogo envía el resumen del carrito al número comercial configurado.</small></span></label></div>
                {settingsCommercialProfile.orderChannel==="wompi" && <section className="wompi-setup-panel">
                  <div className="wompi-setup-heading"><div><span className="wompi-status-dot" data-connected={wompiStatus.enabled && wompiStatus.configured ? "true" : "false"}></span><div><strong>{wompiStatus.enabled && wompiStatus.configured ? "Wompi conectado" : "Conecta tu cuenta Wompi"}</strong><p>{wompiStatus.loading ? "Consultando el estado de la conexión." : wompiStatus.enabled && wompiStatus.configured ? "El checkout está habilitado. Verifica el flujo completo antes de usarlo en producción." : "Las credenciales se guardan en el servidor y no se muestran de nuevo. Nunca las pegues en el catálogo ni en el nombre o descripción del negocio."}</p></div></div><span className={"status-pill "+(wompiStatus.enabled&&wompiStatus.configured?"status-active":"status-unpublished")}>{wompiStatus.loading?"Revisando":wompiStatus.enabled&&wompiStatus.configured?"Activa":"Sin configurar"}</span></div>
                  <div className="wompi-setup-fields">
                    <label><span>Entorno de Wompi</span><select value={wompiDraft.environment} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,environment:e.target.value}))}><option value="sandbox">Pruebas (sandbox)</option><option value="production">Producción</option></select></label>
                    <label><span>Llave pública</span><input autoComplete="off" spellCheck="false" value={wompiDraft.public_key} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,public_key:e.target.value}))} placeholder={wompiStatus.configured?"Dejar vacío para conservarla":"pub_test_… o pub_prod_…"}/></label>
                    <label><span>Llave privada</span><input type="password" autoComplete="new-password" value={wompiDraft.private_key} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,private_key:e.target.value}))} placeholder={wompiStatus.configured?"Guardada · dejar vacío para conservarla":"prv_test_… o prv_prod_…"}/></label>
                    <label><span>Secreto de integridad</span><input type="password" autoComplete="new-password" value={wompiDraft.integrity_secret} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,integrity_secret:e.target.value}))} placeholder={wompiStatus.configured?"Guardado · dejar vacío para conservarlo":"Secreto de integridad"}/></label>
                    <label><span>Secreto de eventos (webhook)</span><input type="password" autoComplete="new-password" value={wompiDraft.events_secret} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,events_secret:e.target.value}))} placeholder={wompiStatus.configured?"Guardado · dejar vacío para conservarlo":"Secreto de eventos"}/></label>
                    <label className="wompi-enabled-switch"><input type="checkbox" checked={wompiDraft.enabled} disabled={activeBusiness?.role!=="owner"||wompiSaving} onChange={(e)=>setWompiDraft((current)=>({...current,enabled:e.target.checked}))}/><span><strong>Habilitar cobros con Wompi</strong><small>El catálogo solo ofrecerá el pago cuando las cuatro credenciales estén configuradas.</small></span></label>
                  </div>
                  <div className="wompi-setup-footer"><p>Recomendación: prueba primero con las llaves de sandbox. Cambia a Producción únicamente cuando hayas verificado monto, referencia, retorno y confirmación del pago.</p><button type="button" className="primary-button" disabled={wompiSaving||activeBusiness?.role!=="owner"||wompiStatus.loading} onClick={saveWompiConfiguration}>{wompiSaving?"Guardando conexión…":"Guardar conexión Wompi"}</button></div>
                </section>}
              
              </div>
              <div className="form-actions"><button type="submit" className="primary-button" disabled={busy || settingsChecking || activeBusiness?.role !== "owner"}>{busy ? "Guardando…" : "Guardar configuración"}</button></div>
            </form>
            <p className="settings-footnote" hidden={settingsTab === "platform_admin"}>Negocio: <strong>{activeBusiness?.name}</strong> · Zona horaria: America/Bogota</p>
            {settingsTab === "platform_admin" && isPlatformAdmin && renderPlatformAdminPanel()}
          </section>

        ) : screen === "banks" ? (
          !isBusinessManager
            ? <section className="empty-state"><span className="empty-icon">▥</span><h3>Acceso restringido</h3><p>Solo el propietario y los administradores del negocio pueden consultar Bancos.</p><button type="button" className="secondary-button" onClick={() => navigate("home")}>Volver a Inicio</button></section>
            : bankDashboardBusinessId === activeBusiness?.id
              ? renderBanksPage()
              : <section className="empty-state">Cargando cuentas bancarias del negocio activo…</section>
        ) : ((screen === "accounts" && accountsTab === "receivables") || screen === "receivables") ? (
          <section className="accounts-page">
            <div className="products-intro"><div><h2>Cuentas por cobrar</h2><p>Controla las ventas pendientes y registra abonos sin perder el registro actual.</p></div><button type="button" className="secondary-button" onClick={()=>navigate("sales")}>Ir a ventas</button></div>
            <div className="accounts-tabs" role="tablist" aria-label="Tipo de cuenta">
              {canPermission("sales_view") && <button type="button" role="tab" aria-selected={accountsTab === "receivables"} className={accountsTab === "receivables" ? "accounts-tab active" : "accounts-tab"} onClick={() => { setScreen("accounts"); setAccountsTab("receivables"); setAccountsSearch(""); setAccountsStatusFilter("pending"); setMobileNavOpen(false); }}>Por cobrar</button>}
              {canViewPurchases && <button type="button" role="tab" aria-selected={accountsTab === "payables"} className={accountsTab === "payables" ? "accounts-tab active" : "accounts-tab"} onClick={() => { setScreen("accounts"); setAccountsTab("payables"); setAccountsSearch(""); setAccountsStatusFilter("pending"); setMobileNavOpen(false); }}>Por pagar</button>}
            </div>
            <div className="accounts-metrics"><article className="accounts-metric panel"><span>Ventas con saldo</span><strong>{receivableRows.filter(x=>x.balance_minor>0).length}</strong></article><article className="accounts-metric panel"><span>Total por cobrar</span><strong>{money(receivableRows.reduce((n,x)=>n+x.balance_minor,0),currencyCode)}</strong></article><article className="accounts-metric panel"><span>Ventas saldadas</span><strong>{receivableRows.filter(x=>x.balance_minor<=0).length}</strong></article></div>
            <div className="accounts-toolbar"><label><span>Buscar cliente o venta</span><input value={accountsSearch} onChange={e=>setAccountsSearch(e.target.value)} placeholder="Nombre, número o celular"/></label><label><span>Estado</span><select value={accountsStatusFilter} onChange={e=>setAccountsStatusFilter(e.target.value)}><option value="pending">Con saldo pendiente</option><option value="all">Todas las ventas</option></select></label><label><span>Ordenar por</span><select value={accountsSort} onChange={e=>setAccountsSort(e.target.value)}><option value="newest">Más recientes</option><option value="oldest">Más antiguas</option><option value="balance_desc">Mayor saldo</option><option value="balance_asc">Menor saldo</option><option value="name">Nombre del cliente</option></select></label></div>
            {accountsLoading?<div className="empty-state">Consultando saldos…</div>:(()=>{const q=accountsSearch.trim().toLocaleLowerCase("es");const rows=receivableRows.filter(x=>(accountsStatusFilter==="all"||x.balance_minor>0)&&(!q||[x.sale_number,x.customer?.full_name,x.customer?.company_name,x.customer?.phone,x.customer?.whatsapp].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(q)));rows.sort((a,b)=>accountsSort==="oldest"?new Date(a.sold_at||a.created_at)-new Date(b.sold_at||b.created_at):accountsSort==="balance_desc"?b.balance_minor-a.balance_minor:accountsSort==="balance_asc"?a.balance_minor-b.balance_minor:accountsSort==="name"?String(a.customer?.company_name||a.customer?.full_name||"").localeCompare(String(b.customer?.company_name||b.customer?.full_name||""),"es"):new Date(b.sold_at||b.created_at)-new Date(a.sold_at||a.created_at));return rows.length?<div className="account-record-list">{rows.slice(0,250).map(x=><article className="account-record panel" key={x.id}><div className="account-record-heading"><div><span className="account-record-kicker">{x.sale_number||"Venta"}</span><h3>{x.customer?.company_name||x.customer?.full_name||"Cliente sin ficha"}</h3><span>{new Date(x.sold_at||x.created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})}</span></div><span className={"status-pill "+(x.balance_minor>0?"status-unpublished":"status-active")}>{x.balance_minor>0?"Pendiente":"Saldada"}</span></div><div className="account-record-amounts"><div><span>Total</span><strong>{money(x.total_minor,x.currency_code||currencyCode)}</strong></div><div><span>Abonado</span><strong>{money(x.amount_paid_minor,x.currency_code||currencyCode)}</strong></div><div className={x.balance_minor>0?"account-balance-open":""}><span>Saldo</span><strong>{money(x.balance_minor,x.currency_code||currencyCode)}</strong></div></div>{x.balance_minor>0&&canManageSales&&<button type="button" className="primary-button compact-button" onClick={()=>openSalePaymentForm(x)}>＋ Registrar abono</button>}{salePaymentFormFor===x.id&&x.balance_minor>0&&<form className="account-payment-form" onSubmit={e=>registerSalePayment(e,x)}><div className="account-payment-grid"><label><span>Valor del abono</span><input type="number" min="1" max={x.balance_minor/(10**currencyDigits(x.currency_code||currencyCode))} value={salePaymentAmount} onChange={e=>setSalePaymentAmount(e.target.value)} required/></label><div className="payment-method-field"><span>Forma de pago</span><PaymentMethodTiles value={salePaymentMethod} onChange={setSalePaymentMethod} ariaLabel="Medio de pago de abono rápido" /></div><label><span>Fecha</span><input type="date" max={todayInBogota()} value={salePaymentDate} onChange={e=>setSalePaymentDate(e.target.value)} required/></label><label><span>Nota</span><input value={salePaymentNotes} onChange={e=>setSalePaymentNotes(e.target.value)} maxLength={1000}/></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={()=>setSalePaymentFormFor(null)}>Cancelar</button><button className="primary-button" disabled={salePaymentSaving}>Guardar abono</button></div></form>}</article>)}</div>:<div className="empty-state"><h3>No hay resultados</h3><p>Prueba otro filtro o registra una venta con saldo pendiente.</p><button className="secondary-button" onClick={()=>navigate("sales")}>Ir a ventas</button></div>})()}
          </section>
        ) : ((screen === "accounts" && accountsTab === "payables") || screen === "payables") ? (
          <section className="accounts-page">
            <div className="products-intro"><div><h2>Cuentas por pagar</h2><p>Consulta saldos de proveedores y registra pagos vinculados a cada compra.</p></div><button type="button" className="secondary-button" onClick={()=>navigate("purchases")}>Ir a compras</button></div>
            <div className="accounts-tabs" role="tablist" aria-label="Tipo de cuenta">
              {canPermission("sales_view") && <button type="button" role="tab" aria-selected={accountsTab === "receivables"} className={accountsTab === "receivables" ? "accounts-tab active" : "accounts-tab"} onClick={() => { setScreen("accounts"); setAccountsTab("receivables"); setAccountsSearch(""); setAccountsStatusFilter("pending"); setMobileNavOpen(false); }}>Por cobrar</button>}
              {canViewPurchases && <button type="button" role="tab" aria-selected={accountsTab === "payables"} className={accountsTab === "payables" ? "accounts-tab active" : "accounts-tab"} onClick={() => { setScreen("accounts"); setAccountsTab("payables"); setAccountsSearch(""); setAccountsStatusFilter("pending"); setMobileNavOpen(false); }}>Por pagar</button>}
            </div>
            <div className="accounts-metrics"><article className="accounts-metric panel"><span>Compras con saldo</span><strong>{payableRows.filter(x=>x.balance_minor>0).length}</strong></article><article className="accounts-metric panel"><span>Total por pagar</span><strong>{money(payableRows.reduce((n,x)=>n+x.balance_minor,0),currencyCode)}</strong></article><article className="accounts-metric panel"><span>Compras saldadas</span><strong>{payableRows.filter(x=>x.balance_minor<=0).length}</strong></article></div>
            <div className="accounts-toolbar"><label><span>Buscar proveedor o compra</span><input value={accountsSearch} onChange={e=>setAccountsSearch(e.target.value)} placeholder="Proveedor, número o correo"/></label><label><span>Estado</span><select value={accountsStatusFilter} onChange={e=>setAccountsStatusFilter(e.target.value)}><option value="pending">Con saldo pendiente</option><option value="all">Todas las compras</option></select></label><label><span>Ordenar por</span><select value={accountsSort} onChange={e=>setAccountsSort(e.target.value)}><option value="newest">Más recientes</option><option value="oldest">Más antiguas</option><option value="balance_desc">Mayor saldo</option><option value="balance_asc">Menor saldo</option><option value="name">Nombre del proveedor</option></select></label></div>
            {accountsLoading?<div className="empty-state">Consultando pagos…</div>:(()=>{const q=accountsSearch.trim().toLocaleLowerCase("es");const rows=payableRows.filter(x=>(accountsStatusFilter==="all"||x.balance_minor>0)&&(!q||[x.purchase_number,x.supplier?.name,x.supplier?.phone,x.supplier?.email,x.supplier?.tax_id].filter(Boolean).join(" ").toLocaleLowerCase("es").includes(q)));rows.sort((a,b)=>accountsSort==="oldest"?new Date(a.purchased_at||a.created_at)-new Date(b.purchased_at||b.created_at):accountsSort==="balance_desc"?b.balance_minor-a.balance_minor:accountsSort==="balance_asc"?a.balance_minor-b.balance_minor:accountsSort==="name"?String(a.supplier?.name||"").localeCompare(String(b.supplier?.name||""),"es"):new Date(b.purchased_at||b.created_at)-new Date(a.purchased_at||a.created_at));return rows.length?<div className="account-record-list">{rows.slice(0,250).map(x=><article className="account-record panel" key={x.id}><div className="account-record-heading"><div><span className="account-record-kicker">{x.purchase_number||"Compra"}</span><h3>{x.supplier?.name||"Proveedor sin ficha"}</h3><span>{new Date(x.purchased_at||x.created_at).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"medium"})}</span></div><span className={"status-pill "+(x.balance_minor>0?"status-unpublished":"status-active")}>{x.balance_minor>0?"Pendiente":"Saldada"}</span></div><div className="account-record-amounts"><div><span>Total</span><strong>{money(x.total_minor,x.currency_code||currencyCode)}</strong></div><div><span>Pagado</span><strong>{money(x.amount_paid_minor,x.currency_code||currencyCode)}</strong></div><div className={x.balance_minor>0?"account-balance-open":""}><span>Saldo</span><strong>{money(x.balance_minor,x.currency_code||currencyCode)}</strong></div></div>{x.balance_minor>0&&canManagePurchases&&<button type="button" className="primary-button compact-button" onClick={()=>openPurchasePaymentForm(x)}>＋ Registrar pago</button>}{purchasePaymentFormFor===x.id&&x.balance_minor>0&&<form className="account-payment-form" onSubmit={e=>recordPurchasePayment(e,x)}><div className="account-payment-grid"><label><span>Valor del pago</span><input type="number" min="1" max={x.balance_minor/(10**currencyDigits(x.currency_code||currencyCode))} value={purchasePaymentAmount} onChange={e=>setPurchasePaymentAmount(e.target.value)} required/></label><div className="payment-method-field"><span>Forma de pago</span><PaymentMethodTiles value={purchasePaymentMethod} onChange={setPurchasePaymentMethod} ariaLabel="Medio de pago de abono rápido a proveedor" /></div><label><span>Fecha</span><input type="date" max={todayInBogota()} value={purchasePaymentDate} onChange={e=>setPurchasePaymentDate(e.target.value)} required/></label><label><span>Nota</span><input value={purchasePaymentNotes} onChange={e=>setPurchasePaymentNotes(e.target.value)} maxLength={1000}/></label></div><div className="form-actions"><button type="button" className="secondary-button" onClick={()=>setPurchasePaymentFormFor(null)}>Cancelar</button><button className="primary-button" disabled={purchasePaymentSaving}>Guardar pago</button></div></form>}</article>)}</div>:<div className="empty-state"><h3>No hay resultados</h3><p>Prueba otro filtro o registra una compra con saldo pendiente.</p><button className="secondary-button" onClick={()=>navigate("purchases")}>Ir a compras</button></div>})()}
          </section>
        ) : screen === "platform_admin" ? (isPlatformAdminReady && isPlatformAdmin ? renderPlatformAdminPanel() : <div className="loading-screen">Verificando permisos de administración…</div>) : screen === "home" ? <div className="home-dashboard">
          <section className="home-workspace-hero">
            <div className="home-workspace-copy">
              <p>Tu negocio en un vistazo. Registra una operación o entra directamente al área en la que necesitas trabajar.</p>
            </div>
            <div className="home-workspace-actions">
              {canAccessScreen("sales") && <button className="primary-button home-primary-action" onClick={() => { clearSaleDraft(); navigate("sales"); setShowSaleForm(true); }}><AppIcon name="sales" size={17}/> Registrar venta</button>}
              {(canManageProducts || canManageSales || canManagePurchases || canManageExpenses || canManageCustomers) && <div className="home-create-menu" ref={homeCreateMenuRef}>
                <button type="button" className={"secondary-button home-create-trigger"+(homeCreateMenuOpen?" is-open":"")} aria-haspopup="true" aria-expanded={homeCreateMenuOpen} onClick={() => setHomeCreateMenuOpen((open) => !open)}><AppIcon name="plus" size={17}/> Crear <AppIcon name="chevron-down" size={16}/></button>
                {homeCreateMenuOpen && <div className="home-create-dropdown" role="group" aria-label="Acciones para crear">
                  {canManageProducts && <button type="button" onClick={() => { setHomeCreateMenuOpen(false); navigate("products"); setProductForm(blankProduct); setEditingProductId(null); setNewProductVariants([]); setNewProductVariantDraft(blankNewProductVariant); setShowProductForm(true); }}><span className="home-create-item-icon"><AppIcon name="products" size={18}/></span><span><strong>Crear artículo</strong><small>Producto, servicio o artículo digital</small></span></button>}
                  {canManageSales && <button type="button" onClick={() => { setHomeCreateMenuOpen(false); clearQuoteDraft(); setError(""); setNotice(""); navigate("quotes"); setShowQuoteForm(true); }}><span className="home-create-item-icon"><AppIcon name="quotes" size={18}/></span><span><strong>Crear cotización</strong><small>Preparar una propuesta para un cliente</small></span></button>}
                  {canManagePurchases && <button type="button" onClick={() => { setHomeCreateMenuOpen(false); setPurchaseModuleTab("purchases"); setShowPurchaseForm(true); navigate("purchases"); }}><span className="home-create-item-icon"><AppIcon name="purchases" size={18}/></span><span><strong>Registrar compra</strong><small>Ingresar una compra de proveedor</small></span></button>}
                  {canManageExpenses && <button type="button" onClick={() => { setHomeCreateMenuOpen(false); setPurchaseModuleTab("expenses"); setShowExpenseForm(true); navigate("purchases"); }}><span className="home-create-item-icon"><AppIcon name="expenses" size={18}/></span><span><strong>Registrar gasto</strong><small>Registrar una salida de dinero</small></span></button>}
                  {canManageCustomers && <button type="button" onClick={() => { setHomeCreateMenuOpen(false); setCustomerDraft(blankCustomer); setEditingCustomerId(null); setShowCustomerForm(true); navigate("customers"); }}><span className="home-create-item-icon"><AppIcon name="customers" size={18}/></span><span><strong>Crear cliente</strong><small>Guardar los datos de un cliente</small></span></button>}
                </div>}
              </div>}
              <button type="button" className="home-utility-action home-share-card-button" onClick={sharePersonalBusinessCard}><AppIcon name="card" size={17}/> Compartir tarjeta</button>
              {!appInstalled && <button type="button" className="home-utility-action install-app-button" onClick={requestPwaInstall}><AppIcon name="grid" size={16}/>{installPrompt ? "Instalar aplicación" : "Cómo instalar"}</button>}
            </div>
          </section>
          {showInstallGuide && !appInstalled && <section className="install-guide-panel panel">
            <div className="install-guide-heading"><div><span className="eyebrow">TRESEISCINCO · APP INSTALABLE</span><h3>Usa treseiscinco desde tu pantalla de inicio</h3><p>La instalación crea un acceso directo con aspecto de aplicación. Necesitas conexión a internet para consultar y guardar los datos del negocio.</p></div><button type="button" className="icon-action-button" aria-label="Cerrar instrucciones" onClick={() => setShowInstallGuide(false)}>×</button></div>
            <div className="install-guide-steps">
              <div><strong>Android · Chrome</strong><p>Abre el menú ⋮ del navegador y elige «Instalar aplicación» o «Agregar a pantalla principal».</p></div>
              <div><strong>iPhone · Safari</strong><p>Toca Compartir y selecciona «Agregar a pantalla de inicio»; después confirma «Agregar».</p></div>
              <div><strong>Computador · Chrome o Edge</strong><p>Busca el icono Instalar en la barra de direcciones o abre el menú del navegador y selecciona «Instalar treseiscinco».</p></div>
            </div>
          </section>}
          {businessSubscription && ["trialing","expired"].includes(businessSubscription.status) && <section className={"trial-status-banner panel"+(businessSubscription.status==="expired"?" trial-expired":"")}><div><strong>{businessSubscription.status==="expired"?"Tu prueba gratuita terminó":"Prueba gratuita de treseiscinco"}</strong><p>{businessSubscription.status==="expired"?"Tu periodo de prueba ha terminado. Revisa con treseiscinco las opciones para continuar.":("Te quedan "+Math.max(0,Math.ceil((new Date(businessSubscription.current_period_end).getTime()-Date.now())/86400000))+" días de prueba. Finaliza el "+new Date(businessSubscription.current_period_end).toLocaleDateString("es-CO",{timeZone:"America/Bogota",dateStyle:"long"})+".")}</p></div><span>{businessSubscription.status==="expired"?"Periodo vencido":"Acceso de prueba"}</span></section>}
          <section className="home-operating-summary">
            <div className="home-section-heading"><div><h2>Cifras clave</h2><p>Indicadores actualizados desde tus movimientos registrados.</p></div><span className="home-updated-label">{homeSummary.loading || inventoryOverviewLoading ? "Actualizando…" : "Datos reales"}</span></div>
            <div className="home-operating-metrics">
              {canAccessScreen("products") && <button type="button" className="home-operating-metric" onClick={() => navigate("products")}><span>Referencias</span><strong>{inventoryOverviewLoading ? "…" : inventoryOverview.productCount.toLocaleString("es-CO")}</strong><small>Artículos en inventario</small></button>}
              {canAccessScreen("products") && <button type="button" className={"home-operating-metric" + (inventoryOverview.outOfStockCount ? " home-metric-alert" : "")} onClick={() => { setProductStockFilter("out_of_stock"); setProductPage(1); navigate("products"); }}><span>Sin stock</span><strong>{inventoryOverviewLoading ? "…" : inventoryOverview.outOfStockCount.toLocaleString("es-CO")}</strong><small>{inventoryOverview.outOfStockCount ? "Revisar agotados" : "Sin agotados registrados"}</small></button>}
              {canAccessScreen("products") && <button type="button" className="home-operating-metric" onClick={() => navigate("products")}><span>Costo del inventario</span><strong>{inventoryOverviewLoading ? "…" : money(inventoryOverview.costMinor, currencyCode)}</strong><small>Capital registrado en existencias</small></button>}
              {canAccessScreen("products") && <button type="button" className="home-operating-metric" onClick={() => navigate("products")}><span>Valor de venta estimado</span><strong>{inventoryOverviewLoading ? "…" : money(inventoryOverview.retailMinor, currencyCode)}</strong><small>Si vendes todo el stock actual</small></button>}
              {canAccessScreen("sales") && <button type="button" className="home-operating-metric" onClick={() => navigate("sales")}><span>Ventas de hoy</span><strong>{homeSummary.loading ? "…" : money(homeSummary.todaySalesMinor, currencyCode)}</strong><small>{homeSummary.loading ? "Consultando operaciones" : homeSummary.todaySalesCount.toLocaleString("es-CO") + (homeSummary.todaySalesCount === 1 ? " venta registrada" : " ventas registradas")}</small></button>}
              {canAccessScreen("quotes") && <button type="button" className={"home-operating-metric" + (homeSummary.openQuotesCount ? " home-metric-attention" : "")} onClick={() => navigate("quotes")}><span>Cotizaciones por revisar</span><strong>{homeSummary.loading ? "…" : homeSummary.openQuotesCount.toLocaleString("es-CO")}</strong><small>{homeSummary.openQuotesCount ? "Borradores y enviadas" : "No hay cotizaciones abiertas"}</small></button>}
            </div>
            {inventoryOverview.lowStockCount > 0 && canAccessScreen("products") && <button type="button" className="home-stock-warning" onClick={() => { setProductStockFilter("low_stock"); setProductPage(1); navigate("products"); }}><span><strong>{inventoryOverview.lowStockCount} artículos están en su mínimo o por debajo</strong><small>Abre el filtro y revisa qué necesitas reponer.</small></span><b>Ver inventario ↗</b></button>}
            {homeSummary.error && <p className="helper-text">No se pudo actualizar toda la actividad: {homeSummary.error}</p>}
          </section>
          <section className="home-pie-dashboard" aria-label="Ingresos, compras y gastos">
            <div className="home-pie-toolbar">
              <div className="home-pie-title">
                <h2>Actividad financiera</h2>
                <p>Dos gráficos independientes, con el mismo periodo y datos reales del negocio.</p>
              </div>
              <div className="home-pie-period-controls" role="group" aria-label="Periodo de los gráficos de Inicio">
                {[["day","Hoy"],["week","Semana"],["month","Mes"],["quarter","Trimestre"],["semester","Semestre"],["year","Año"]].map(([value,label]) =>
                  <button type="button" key={value} className={homeChartPeriod===value?"active":""} aria-pressed={homeChartPeriod===value} onClick={()=>setHomeChartPeriod(value)}>{label}</button>
                )}
              </div>
            </div>
            {homePieData.error && <p className="home-pie-error" role="alert">No se pudieron cargar los gráficos de este periodo: {homePieData.error}</p>}
            {homePieData.loading ? <div className="home-pie-loading panel" role="status">Actualizando los gráficos con los movimientos registrados…</div> : <div className="home-chart-pair">
              <section className="home-chart-cell" aria-label="Gráfico de ingresos">
                <div className="home-chart-cell-heading"><div><h3>Ingresos</h3><p>Ventas registradas por artículo en el periodo elegido.</p></div></div>
                <div className="chart-type-picker home-chart-type-picker" role="group" aria-label="Tipo de gráfico de ingresos">
                  <button type="button" className={homeIncomeChartType==="pie"?"active":""} aria-pressed={homeIncomeChartType==="pie"} onClick={()=>setHomeIncomeChartType("pie")}>Pastel</button>
                  <button type="button" className={homeIncomeChartType==="bars"?"active":""} aria-pressed={homeIncomeChartType==="bars"} onClick={()=>setHomeIncomeChartType("bars")}>Barras</button>
                  <button type="button" className={homeIncomeChartType==="area"?"active":""} aria-pressed={homeIncomeChartType==="area"} onClick={()=>setHomeIncomeChartType("area")}>Área</button>
                </div>
                {!canAccessScreen("sales") ? <div className="simple-chart panel"><p className="simple-chart-empty">Tu perfil no tiene permiso para consultar ingresos.</p></div> :
                  homeIncomeChartType==="pie" ? <SimplePie title="Distribución de ingresos" description="Participación de los artículos vendidos." data={homePieData.income} colors={["#0F766E","#14B8A6","#0D9488","#2DD4BF","#0284C7","#38BDF8","#0E7490","#5EEAD4"]} formatValue={(value)=>money(value,currencyCode)} compact /> :
                  homeIncomeChartType==="bars" ? <SimpleBars title="Ingresos por artículo" description="Compara los artículos que generaron ingresos." badge={homeChartPeriod} data={homePieData.income.slice(0,8)} colors={["#0F766E","#14B8A6","#0D9488","#2DD4BF","#0284C7","#38BDF8","#0E7490","#5EEAD4"]} formatValue={(value)=>money(value,currencyCode)} /> :
                  <SimpleArea title="Evolución de ingresos" description="Ventas registradas a través del periodo." badge={homeChartPeriod} data={homePieData.trends} series={[{key:"income",label:"Ingresos",color:"#0F766E"}]} formatValue={(value)=>money(value,currencyCode)} footnote="Solo incluye ventas registradas no anuladas del negocio activo." />}
              </section>
              <section className="home-chart-cell" aria-label="Gráfico de compras y gastos">
                <div className="home-chart-cell-heading"><div><h3>Compras / Gastos</h3><p>Compara las compras y los gastos registrados.</p></div></div>
                <div className="chart-type-picker home-chart-type-picker" role="group" aria-label="Tipo de gráfico de compras y gastos">
                  <button type="button" className={homeSpendingChartType==="pie"?"active":""} aria-pressed={homeSpendingChartType==="pie"} onClick={()=>setHomeSpendingChartType("pie")}>Pastel</button>
                  <button type="button" className={homeSpendingChartType==="bars"?"active":""} aria-pressed={homeSpendingChartType==="bars"} onClick={()=>setHomeSpendingChartType("bars")}>Barras</button>
                  <button type="button" className={homeSpendingChartType==="area"?"active":""} aria-pressed={homeSpendingChartType==="area"} onClick={()=>setHomeSpendingChartType("area")}>Área</button>
                </div>
                {(!canViewPurchases && !canViewExpenses) ? <div className="simple-chart panel"><p className="simple-chart-empty">Tu perfil no tiene permiso para consultar compras ni gastos.</p></div> :
                  homeSpendingChartType==="pie" ? <SimplePie title="Distribución de compras y gastos" description="Participación de cada tipo de salida registrada." data={[
                    {key:"purchases",label:"Compras",value:homePieData.purchases.reduce((sum,item)=>sum+Number(item.value||0),0)},
                    {key:"expenses",label:"Gastos",value:homePieData.expenses.reduce((sum,item)=>sum+Number(item.value||0),0)}
                  ].filter((item)=>(item.key==="purchases"&&canViewPurchases)||(item.key==="expenses"&&canViewExpenses))} colors={["#D97706","#DB2777","#EA580C","#BE123C"]} formatValue={(value)=>money(value,currencyCode)} compact /> :
                  homeSpendingChartType==="bars" ? <SimpleBars title="Compras y gastos" description="Compara los importes de cada tipo de salida." badge={homeChartPeriod} data={[
                    {key:"purchases",label:"Compras",value:homePieData.purchases.reduce((sum,item)=>sum+Number(item.value||0),0)},
                    {key:"expenses",label:"Gastos",value:homePieData.expenses.reduce((sum,item)=>sum+Number(item.value||0),0)}
                  ].filter((item)=>(item.key==="purchases"&&canViewPurchases)||(item.key==="expenses"&&canViewExpenses))} colors={["#D97706","#DB2777"]} formatValue={(value)=>money(value,currencyCode)} /> :
                  <SimpleArea title="Evolución de compras y gastos" description="Salidas registradas durante el periodo." badge={homeChartPeriod} data={homePieData.trends} series={[
                    {key:"purchases",label:"Compras",color:"#D97706"},{key:"expenses",label:"Gastos",color:"#DB2777"}
                  ].filter((item)=>(item.key==="purchases"&&canViewPurchases)||(item.key==="expenses"&&canViewExpenses))} formatValue={(value)=>money(value,currencyCode)} footnote="Compras y gastos se muestran por separado y no se duplican en el mismo indicador." />}
              </section>
            </div>}
          </section>
        </div> : <section className="empty-state"><span className="empty-icon">{areas.find((a) => a.screen === screen)?.icon || "⌘"}</span><h3>{areas.find((a) => a.screen === screen)?.title || "Sección"}</h3><p>Estamos construyendo esta parte sobre la misma base segura. Tus datos no se simulan ni se inventan.</p><button className="secondary-button" onClick={() => navigate("home")}>Volver a Inicio</button></section>}
        <footer className="app-footer"><span>Los datos se separan por negocio.</span></footer>
      </section>
      <div className="ai-assistant-layer ai-with-help">
        {aiOpen && <section id="treseiscinco-ai-panel" className="ai-assistant-panel" role="dialog" aria-label="Asistente IA de treseiscinco">
          <header className="ai-assistant-header"><div><span className="ai-assistant-spark">✦</span><div><strong>{assistantDisplayName}</strong><small>{activeBusiness?.name || "Sin negocio seleccionado"} · voz Celeste</small></div></div><div className="ai-assistant-header-actions"><button type="button" className="ai-audio-toggle" onClick={toggleAiAutoSpeak}>{aiAutoSpeak ? "🔊 Voz automática" : "🔇 Voz manual"}</button><button type="button" aria-label="Cerrar asistente" onClick={() => { try { aiAudioRef.current?.pause?.(); } catch {} setAiOpen(false); }}>×</button></div></header>
          <div ref={aiMessagesRef} className="ai-assistant-messages" aria-live="polite">
            {!aiHistory.length && <div className="ai-assistant-welcome"><strong>Tu negocio, con datos reales.</strong><p>Consulta quién te ha comprado más, cómo van tus ventas y qué productos necesitan reposición. La IA solo usa los datos permitidos por tu perfil.</p><div className="ai-assistant-suggestions"><button type="button" onClick={() => setAiMessage("¿Quién me ha comprado más este mes?")}>Mejor cliente este mes</button><button type="button" onClick={() => setAiMessage("¿Qué productos debo reponer?")}>Qué debo reponer</button><button type="button" onClick={() => setAiMessage("Dame un resumen de ventas de este mes.")}>Resumen de ventas</button></div></div>}
            {aiHistory.map((item, index) => <div className={"ai-assistant-message " + item.role} key={index}><span>{item.role === "assistant" ? "IA" : "Tú"}</span><p>{item.content}</p>{item.role === "assistant" && <div className="ai-assistant-message-tools"><small className="ai-assistant-meta">{item.dataBacked ? "Información del negocio" : "Respuesta del asistente"}</small><button type="button" className="ai-message-speak" disabled={aiSpeechBusy} onClick={() => generateAiSpeech(item.content, String(index))}>{aiSpeechBusy ? "Preparando voz…" : "▶ Escuchar con Celeste"}</button>{aiAudio?.messageId === String(index) && <audio ref={aiAudioRef} controls preload="none" className="ai-assistant-audio" src={aiAudio.url} />}</div>}</div>)}
            {aiBusy && <div className="ai-assistant-thinking">Estoy revisando la información…</div>}
          </div>
          <form className="ai-assistant-form" onSubmit={sendAiMessage}><textarea value={aiMessage} onChange={(e) => setAiMessage(e.target.value)} placeholder={aiVoiceListening ? "Escuchando… habla ahora" : "Escribe o dicta tu pregunta…"} rows={2} maxLength={1500} disabled={aiBusy} /><button type="button" className={"ai-voice-button"+(aiVoiceListening?" listening":"")} onClick={toggleAiVoice} aria-label={aiVoiceListening?"Detener dictado":"Hablar con la IA"} title={aiVoiceListening?"Detener dictado":"Hablar con la IA"}>{aiVoiceListening ? "■" : "🎙"}</button><button type="submit" disabled={aiBusy || !aiMessage.trim()} aria-label="Enviar pregunta">➤</button></form>
          <p className="ai-assistant-disclaimer">Soy {assistantDisplayName}. Aprendo las preferencias y objetivos que me pidas recordar; no guardo datos sensibles. La voz en español es Aura‑2 · Celeste.</p><div className="ai-assistant-memory-action"><button type="button" className="text-button" onClick={clearAiMemories} disabled={aiMemoryBusy}>{aiMemoryBusy ? "Borrando…" : "Borrar mis recuerdos de este negocio"}</button></div>{aiSpeechError && <p className="ai-assistant-speech-error" role="status">{aiSpeechError}</p>}
        </section>}
        <button type="button" className="ai-assistant-trigger" aria-expanded={aiOpen} aria-controls="treseiscinco-ai-panel" onClick={() => { document.dispatchEvent(new CustomEvent("treseiscinco:field-help-open", { detail: { source: null } })); setAiOpen((open) => !open); }}><span>✦</span> IA</button>
      </div>
      {quoteImagePreview && createPortal(<div className="quote-image-preview-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeQuoteImagePreview(); }}>
        <section className="quote-image-preview-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-image-preview-title">
          <div className="quote-image-preview-heading"><div><h3 id="quote-image-preview-title">Vista previa {quoteImagePreview.documentType === "sale" ? "de la factura" : "de la cotización"}</h3><p>{quoteImagePreview.quoteNumber} · Revisa el formato antes de compartir o descargar.</p></div><button type="button" className="icon-action-button" aria-label="Cerrar vista previa" onClick={closeQuoteImagePreview}>×</button></div>
          <div className="quote-image-preview-visual"><img src={quoteImagePreview.url} alt={"Vista previa vertical de " + (quoteImagePreview.documentType === "sale" ? "la factura " : "la cotización ") + quoteImagePreview.quoteNumber}/></div>
          <div className="quote-image-preview-actions"><button type="button" className="secondary-button" onClick={closeQuoteImagePreview}>Volver</button><button type="button" className="secondary-button" onClick={downloadQuoteImagePreview}>Descargar imagen</button><button type="button" className="primary-button" onClick={confirmShareQuoteImage}>Enviar / compartir</button></div>
        </section>
      </div>, document.body)}
<div className="context-help-layer" ref={contextHelpLayerRef}>
        {contextHelpOpen && (() => {
          const pageHelp = inAppPageHelp[screen] || {
            title: areas.find((area) => area.screen === screen)?.title || "Esta sección",
            intro: "Consulta las opciones de esta sección y revisa la información antes de guardar cambios.",
            steps: ["Revisa los datos y las acciones disponibles.", "Completa los campos necesarios y comprueba el resumen.", "Guarda los cambios y confirma el resultado."],
            tip: "Si la sección muestra información incompleta, verifica primero los datos relacionados."
          };
          return <section id="treseiscinco-page-help" className="context-help-panel" role="dialog" aria-labelledby="treseiscinco-page-help-title">
            <header className="context-help-header">
              <div><p>AYUDA DE ESTA PÁGINA</p><h2 id="treseiscinco-page-help-title">{pageHelp.title}</h2></div>
              <button type="button" className="context-help-close" aria-label="Cerrar ayuda" onClick={() => setContextHelpOpen(false)}>×</button>
            </header>
            <p className="context-help-intro">{pageHelp.intro}</p>
            <div className="context-help-section"><strong>Qué puedes hacer</strong><ol>{pageHelp.steps.map((step, index) => <li key={index}><span>{index + 1}</span><p>{step}</p></li>)}</ol></div>
            {pageHelp.tip && <aside className="context-help-tip"><strong>Consejo útil</strong><p>{pageHelp.tip}</p></aside>}
            <footer className="context-help-footer"><span>¿Necesitas más ayuda?</span><a className="primary-button" href="https://treseiscinco.com/ayuda">Ayuda ↗</a></footer>
          </section>;
        })()}
        <button type="button" className="context-help-trigger" aria-expanded={contextHelpOpen} aria-controls="treseiscinco-page-help" onClick={() => setContextHelpOpen((open) => !open)} aria-label={contextHelpOpen ? "Cerrar ayuda de esta página" : "Mostrar ayuda de esta página"} title="Ayuda de esta página">
          <span className="context-help-trigger-icon" aria-hidden="true">?</span><span>Ayuda</span>
        </button>
      </div>

      {selectedRecordDetail && <div className="customer-detail-backdrop record-detail-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setSelectedRecordDetail(null); }}><section className="customer-detail-card record-detail-card" role="dialog" aria-modal="true" aria-labelledby="record-detail-title"><header className="customer-detail-header"><div><span className="customer-detail-kicker">DETALLE DEL REGISTRO · {selectedRecordDetail.type}</span><h2 id="record-detail-title">{selectedRecordDetail.title}</h2></div><button type="button" className="customer-detail-close" aria-label="Cerrar detalle" onClick={() => setSelectedRecordDetail(null)}>×</button></header><div className="customer-detail-content">{selectedRecordDetail.fields.filter(field => field.value !== undefined && field.value !== null && String(field.value).trim() !== "").map((field,index)=><div className="customer-detail-field record-detail-field" key={field.label+index}><span>{field.label}</span><strong>{String(field.value)}</strong></div>)}{selectedRecordDetail.notes && <section className="customer-detail-group"><h3>Notas</h3><p className="customer-detail-notes">{selectedRecordDetail.notes}</p></section>}</div><footer className="customer-detail-actions"><button type="button" className="secondary-button" onClick={() => setSelectedRecordDetail(null)}>Cerrar ficha</button></footer></section></div>}
    </main>
  );
}


/**
 * Public catalogs are independent of the authenticated workspace. Route them
 * before mounting workspace effects, auth state, and private data queries.
 */
export default function App() {
  const requestedPublicCatalog = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("catalog")
    : null;
  const isValidCatalogId = Boolean(
    requestedPublicCatalog &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestedPublicCatalog)
  );
  const isValidSlugQuery = Boolean(
    requestedPublicCatalog &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(requestedPublicCatalog) &&
    !reservedPublicPaths.has(requestedPublicCatalog)
  );
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const pathParts = pathname.split("/").filter(Boolean);
  const pathSlug = pathParts.length === 1 ? pathParts[0].toLowerCase() : "";
  const isShortCatalogPath = Boolean(
    pathSlug &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(pathSlug) &&
    !reservedPublicPaths.has(pathSlug)
  );

  if (pathSlug === "contacto" || pathSlug === "soporte") return <PublicContactPage />;
  if (pathSlug === "ayuda") return <PublicHelpPage />;
  if (isValidCatalogId) return <PublicCatalog businessId={requestedPublicCatalog} />;
  if (isValidSlugQuery) return <PublicCatalogSlugRoute slug={requestedPublicCatalog} />;
  if (isShortCatalogPath) return <PublicCatalogSlugRoute slug={pathSlug} />;
  return <AuthenticatedApp />;
}

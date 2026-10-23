"use strict";(()=>{function Ho(){let e=globalThis;if(typeof e.getLastMessageId!="function")throw new Error("SillyTavern getLastMessageId API is unavailable");if(typeof e.getVariables!="function")throw new Error("SillyTavern getVariables API is unavailable");let t=e.getLastMessageId,n=e.getVariables,r=e.Mvu?.getMvuData;return{getLastMessageId:()=>t(),getVariables:o=>n(o),...r?{getMvuData:o=>r.call(e.Mvu,o)}:{}}}function Pr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var At=class{constructor(t){this.runtime=t}runtime;readLatest(){let t=this.runtime.getLastMessageId();if(!Number.isInteger(t)||t<0)throw new Error(`SillyTavern returned an invalid latest message id: ${String(t)}`);let n={type:"message",message_id:t},r=null;if(this.runtime.getMvuData)try{let o=this.runtime.getMvuData(n);Pr(o)&&(r=o)}catch{}try{let o=this.runtime.getVariables(n);if(Pr(o))return r?{...o,...r}:o}catch(o){if(r)return r;throw o}if(r)return r;throw new Error("SillyTavern message variables are not an object")}};function Be(e,t){let n=typeof t=="string"?t.split(".").map(o=>o.trim()).filter(Boolean):[...t],r=e;for(let o of n){if(!Pr(r)||!(o in r))return;r=r[o]}return r}function Ir(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Qt(e,t){let n=e[t];return Number.isInteger(n)?Number(n):null}function Uo(e){if(!Ir(e))return null;let t=Qt(e,"year"),n=Qt(e,"month"),r=Qt(e,"day");return t===null||n===null||r===null?null:{year:t,month:n,day:r}}function ba(e){if(typeof e>"u")return;if(!Ir(e))return null;let t=Qt(e,"hour"),n=Qt(e,"minute");return t===null||n===null?null:{hour:t,minute:n}}var $r=e=>{if(!Ir(e))return null;let t="date"in e?Uo(e.date):Uo(e);if(!t)return null;let n=ba(e.time);return n===null?null:{date:t,...n?{time:n}:{}}},Fn=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser??$r}getCurrentPoint(){let t=this.reader.readLatest(),n=Be(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse current calendar time at message variable path "${o}"`)}return r}};var Hn=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser}load(){let t=this.reader.readLatest(),n=Be(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse calendar module data at message variable path "${o}"`)}return r}};function Un(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function Ea(e,t){return e.month-t.month||e.day-t.day}function jo(e,t){return Un(t,"festival anchorYear"),Un(e.month,"festival month"),Un(e.day,"festival day"),{year:t,month:e.month,day:e.day}}function Wo(e,t,n){let r=t??e,o=Ea(r,e)<0?n+1:n;return{start:{date:jo(e,n)},end:{date:jo(r,o)}}}function Bo(e){if(e!==null)return Un(e,"festival repeatEveryYears"),{frequency:"yearly",interval:e}}function va(e,t){let n=t.anchorYear??e.anchorYear,r=t.repeatEveryYears===void 0?e.repeatEveryYears:t.repeatEveryYears,o=Bo(r);return{id:`${e.id}:stage:${t.id}`,moduleId:"festival",kind:"festival-stage",title:`${e.title} \xB7 ${t.title}`,...Wo(t.start,t.end,n),allDay:!0,...o?{recurrence:o}:{},tags:["festival","festival-stage"],payload:{role:"stage",festivalId:e.id,stageId:t.id,stageTitle:t.title,summary:t.summary??"",metadata:t.metadata??{}}}}var zo={moduleId:"festival",normalize(e){let t=Bo(e.repeatEveryYears);return[{id:e.id,moduleId:this.moduleId,kind:"festival",title:e.title,...Wo(e.start,e.end,e.anchorYear),allDay:!0,...t?{recurrence:t}:{},tags:["festival",...e.tags??[]],payload:{role:"festival",summary:e.summary??"",relatedBookIds:[...e.relatedBookIds??[]],locationKeywords:[...e.locationKeywords??[]],metadata:e.metadata??{}}},...(e.stages??[]).map(r=>va(e,r))]}};function en(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Et(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function Vt(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function wa(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Et(n);if(!r)return null;t.push(r)}return t}function jn(e){if(!en(e))return null;let t=Vt(e.month),n=Vt(e.day);return t&&n?{month:t,day:n}:null}function xa(e){if(!en(e))return null;let t=Et(e.id),n=Et(e.title),r=jn(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=jn(e.end);if(!i)return null;o.end=i}if("anchorYear"in e&&typeof e.anchorYear<"u"){let i=Vt(e.anchorYear);if(!i)return null;o.anchorYear=i}if("repeatEveryYears"in e)if(e.repeatEveryYears===null)o.repeatEveryYears=null;else{let i=Vt(e.repeatEveryYears);if(!i)return null;o.repeatEveryYears=i}if("summary"in e&&typeof e.summary<"u"){let i=Et(e.summary);if(!i)return null;o.summary=i}if("metadata"in e&&typeof e.metadata<"u"){if(!en(e.metadata))return null;o.metadata={...e.metadata}}return o}function Ca(e){if(!en(e))return null;let t=Et(e.id),n=Et(e.title),r=jn(e.start),o=Vt(e.anchorYear);if(!t||!n||!r||!o)return null;let i=1;if("repeatEveryYears"in e)if(e.repeatEveryYears===null)i=null;else{let a=Vt(e.repeatEveryYears);if(!a)return null;i=a}let s={id:t,title:n,start:r,anchorYear:o,repeatEveryYears:i};if("end"in e&&typeof e.end<"u"){let a=jn(e.end);if(!a)return null;s.end=a}if("summary"in e&&typeof e.summary<"u"){let a=Et(e.summary);if(!a)return null;s.summary=a}for(let a of["tags","relatedBookIds","locationKeywords"])if(a in e&&typeof e[a]<"u"){let c=wa(e[a]);if(!c)return null;s[a]=c}if("metadata"in e&&typeof e.metadata<"u"){if(!en(e.metadata))return null;s.metadata={...e.metadata}}if("stages"in e&&typeof e.stages<"u"){if(!Array.isArray(e.stages))return null;let a=[];for(let c of e.stages){let f=xa(c);if(!f)return null;a.push(f)}s.stages=a}return s}function Ko(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ca(n);if(!r)return null;t.push(r)}return t}var Yo={moduleId:"event",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"event",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{summary:e.summary??"",metadata:e.metadata??{}}}}};function re(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function H(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function Mt(e){return typeof e=="boolean"?e:null}function Wn(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function he(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=H(n);if(!r)return null;t.push(r)}return t}function xe(e){return re(e)?{...e}:null}function Rt(e){if(!re(e))return null;let t=Wn(e.year),n=Wn(e.month),r=Wn(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function Na(e){if(!re(e))return null;let t=Number.isInteger(e.hour)?Number(e.hour):null,n=Number.isInteger(e.minute)?Number(e.minute):null;return t===null||n===null||t<0||t>23||n<0||n>59?null:{hour:t,minute:n}}function Oe(e){if(!re(e))return null;let t=Rt(e.date);if(!t)return null;if("time"in e&&typeof e.time<"u"){let n=Na(e.time);return n?{date:t,time:n}:null}return{date:t}}var Da=new Set(["daily","weekly","monthly","yearly"]);function ut(e){if(!re(e))return null;let t=typeof e.frequency=="string"&&Da.has(e.frequency)?e.frequency:null;if(!t)return null;let n={frequency:t};if("interval"in e&&typeof e.interval<"u"){let r=Wn(e.interval);if(!r)return null;n.interval=r}if("until"in e&&typeof e.until<"u"){let r=Rt(e.until);if(!r)return null;n.until=r}return n}function Oa(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Oe(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Oe(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Mt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ut(e.recurrence);if(!i)return null;o.recurrence=i}if("summary"in e&&typeof e.summary<"u"){let i=H(e.summary);if(!i)return null;o.summary=i}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function Go(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Oa(n);if(!r)return null;t.push(r)}return t}var qo={moduleId:"appointment",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"appointment",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{location:e.location??"",attendees:[...e.attendees??[]],notes:e.notes??"",metadata:e.metadata??{}}}}};function Sa(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Oe(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Oe(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Mt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ut(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["location","notes"])if(i in e&&typeof e[i]<"u"){let s=H(e[i]);if(!s)return null;o[i]=s}if("attendees"in e&&typeof e.attendees<"u"){let i=he(e.attendees);if(!i)return null;o.attendees=i}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function Jo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Sa(n);if(!r)return null;t.push(r)}return t}var Xo={moduleId:"birthday",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"birthday",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{subject:e.subject??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function Ta(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Rt(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["subject","notes"])if(i in e&&typeof e[i]<"u"){let s=H(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function Zo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ta(n);if(!r)return null;t.push(r)}return t}var Qo={moduleId:"anniversary",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"anniversary",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{category:e.category??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function ka(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Rt(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["category","notes"])if(i in e&&typeof e[i]<"u"){let s=H(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function ei(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=ka(n);if(!r)return null;t.push(r)}return t}var ti={moduleId:"class",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"class",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{courseId:e.courseId??"",instructor:e.instructor??"",location:e.location??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function Aa(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Oe(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Oe(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Mt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ut(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["courseId","instructor","location","notes"])if(i in e&&typeof e[i]<"u"){let s=H(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function ni(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Aa(n);if(!r)return null;t.push(r)}return t}var ri={moduleId:"reminder",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"reminder",title:e.title,start:e.at,allDay:!e.at.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{message:e.message??"",target:e.target?{...e.target}:null,metadata:e.metadata??{}}}}};function Bn(e){if(!re(e))return null;let t=H(e.moduleId),n=H(e.eventId);return t&&n?{moduleId:t,eventId:n}:null}function Va(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Oe(e.at);if(!t||!n||!r)return null;let o={id:t,title:n,at:r};if("recurrence"in e&&typeof e.recurrence<"u"){let i=ut(e.recurrence);if(!i)return null;o.recurrence=i}if("message"in e&&typeof e.message<"u"){let i=H(e.message);if(!i)return null;o.message=i}if("target"in e&&typeof e.target<"u"){let i=Bn(e.target);if(!i)return null;o.target=i}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function oi(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Va(n);if(!r)return null;t.push(r)}return t}var ii={moduleId:"history",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"history",title:e.title,start:e.occurredAt,allDay:!e.occurredAt.time,tags:[...e.tags??[]],payload:{source:e.source?{...e.source}:null,outcome:e.outcome??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function Ma(e){if(!re(e))return null;let t=H(e.id),n=H(e.title),r=Oe(e.occurredAt);if(!t||!n||!r)return null;let o={id:t,title:n,occurredAt:r};if("source"in e&&typeof e.source<"u"){let i=Bn(e.source);if(!i)return null;o.source=i}for(let i of["outcome","notes"])if(i in e&&typeof e[i]<"u"){let s=H(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=he(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=xe(e.metadata);if(!i)return null;o.metadata=i}return o}function si(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ma(n);if(!r)return null;t.push(r)}return t}function zn(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function Ra(e){return zn(e,"year"),e%400===0||e%4===0&&e%100!==0}var ee={id:"gregorian",daysInWeek:7,monthsInYear(e){return zn(e,"year"),12},daysInMonth(e,t){if(zn(e,"year"),zn(t,"month"),t>12)throw new RangeError("month must be between 1 and 12 for the Gregorian calendar");return t===2?Ra(e)?29:28:[4,6,9,11].includes(t)?30:31}};function Pt(e,t){if(!Number.isInteger(e))throw new RangeError(`${t} must be an integer`)}function li(e,t){if(!Number.isInteger(e.daysInWeek)||e.daysInWeek<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid week length`);let n=e.monthsInYear(t);if(!Number.isInteger(n)||n<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid month count`)}function vt(e,t,n){let r=e.daysInMonth(t,n);if(!Number.isInteger(r)||r<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid day count`);return r}function ft(e){return{year:e.year,month:e.month,day:e.day}}function G(e,t=ee){if(Pt(e.year,"year"),Pt(e.month,"month"),Pt(e.day,"day"),e.year<1)throw new RangeError("year must be at least 1");li(t,e.year);let n=t.monthsInYear(e.year);if(e.month<1||e.month>n)throw new RangeError(`month must be between 1 and ${n} for calendar "${t.id}"`);let r=vt(t,e.year,e.month);if(e.day<1||e.day>r)throw new RangeError(`day must be between 1 and ${r} for ${e.year}-${e.month}`)}function ae(e,t){return e.year!==t.year?e.year-t.year:e.month!==t.month?e.month-t.month:e.day-t.day}function Lr(e,t){return ae(e,t)===0}function ci(e,t){let n=t.monthsInYear(e.year);return e.month<n?{year:e.year,month:e.month+1}:{year:e.year+1,month:1}}function di(e,t){if(e.month>1)return{year:e.year,month:e.month-1};if(e.year<=1)throw new RangeError("CalendarCore does not support dates before year 1");let n=e.year-1;return{year:n,month:t.monthsInYear(n)}}function et(e,t,n=ee){Pt(t,"delta"),G(e,n);let r=ft(e);if(t>0){let i=t;for(;i>0;){let a=vt(n,r.year,r.month)-r.day;if(i<=a)return r.day+=i,r;i-=a+1,r={...ci(r,n),day:1}}return r}let o=-t;for(;o>0;){if(o<r.day)return r.day-=o,r;o-=r.day;let i=di(r,n);r={...i,day:vt(n,i.year,i.month)}}return r}function Kn(e,t,n=ee){Pt(t,"delta"),G(e,n);let r={year:e.year,month:e.month},o=Math.sign(t);for(let i=Math.abs(t);i>0;i-=1)r=o>0?ci(r,n):di(r,n);return{...r,day:Math.min(e.day,vt(n,r.year,r.month))}}function ui(e,t,n=ee){Pt(t,"delta"),G(e,n);let r=e.year+t;if(r<1)throw new RangeError("CalendarCore does not support dates before year 1");let o=Math.min(e.month,n.monthsInYear(r));return{year:r,month:o,day:Math.min(e.day,vt(n,r,o))}}function ai(e,t){G(e,t);let n=0;for(let r=1;r<e.year;r+=1){li(t,r);let o=t.monthsInYear(r);for(let i=1;i<=o;i+=1)n+=vt(t,r,i)}for(let r=1;r<e.month;r+=1)n+=vt(t,e.year,r);return n+e.day-1}function Pa(e,t,n=ee){return ai(t,n)-ai(e,n)}function Yn(e,t,n=ee){if(G(t.date,n),G(e,n),!Number.isInteger(t.weekday)||t.weekday<0||t.weekday>=n.daysInWeek)throw new RangeError(`weekday must be between 0 and ${n.daysInWeek-1}`);return((t.weekday+Pa(t.date,e,n))%n.daysInWeek+n.daysInWeek)%n.daysInWeek}function Fr(e,t){return ae(e.start,t.end)<=0&&ae(e.end,t.start)>=0}function fi(e,t){return ae(e,t.start)>=0&&ae(e,t.end)<=0}function Gn(e,t=ee){if(G(e.start,t),G(e.end,t),ae(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end");let n=[],r=ft(e.start);for(;ae(r,e.end)<=0;)n.push(ft(r)),r=et(r,1,t);return n}function tn(e){let t=n=>String(n).padStart(2,"0");return`${e.year}-${t(e.month)}-${t(e.day)}`}function Ia(e,t){if(G(e.start,t),G(e.end,t),ae(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end")}function gi(e){let t=e.recurrence?.interval??1;if(!Number.isInteger(t)||t<1)throw new RangeError("Calendar recurrence interval must be a positive integer");return t}function $a(e,t,n,r){let o=t.recurrence;if(!o||n===0)return e;let i=gi(t)*n;switch(o.frequency){case"daily":return et(e,i,r);case"weekly":return et(e,i*r.daysInWeek,r);case"monthly":return Kn(e,i,r);case"yearly":return ui(e,i,r)}}function pi(e,t,n,r){return{date:$a(e.date,t,n,r),...e.time?{time:{...e.time}}:{}}}function hi(e,t,n){let r=pi(e.start,e,t,n),o=e.end?pi(e.end,e,t,n):void 0;if(o&&ae(o.date,r.date)<0)throw new RangeError("Calendar event end must not be before start");return{event:e,occurrenceIndex:t,start:r,...o?{end:o}:{}}}function mi(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function yi(e,t,n=ee){if(Ia(t,n),G(e.start.date,n),e.end&&(G(e.end.date,n),ae(e.end.date,e.start.date)<0))throw new RangeError("Calendar event end must not be before start");if(!e.recurrence){let s=hi(e,0,n);return Fr(mi(s),t)?[s]:[]}gi(e);let r=e.recurrence.until;if(r&&(G(r,n),ae(r,e.start.date)<0))throw new RangeError("Calendar recurrence until must not be before event start");if(!Number.isInteger(n.daysInWeek)||n.daysInWeek<1)throw new RangeError('Calendar system "'+n.id+'" returned an invalid week length');let o=[],i=0;for(;;){let s=hi(e,i,n);if(ae(s.start.date,t.end)>0||r&&ae(s.start.date,r)>0)break;Fr(mi(s),t)&&o.push(s),i+=1}return o}function La(e,t){return!e&&!t?0:e?t?e.hour-t.hour||e.minute-t.minute:1:-1}function _i(e,t,n=ee){return e.flatMap(r=>yi(r,t,n)).sort((r,o)=>{let i=ae(r.start.date,o.start.date);if(i!==0)return i;let s=La(r.start.time,o.start.time);return s!==0?s:r.event.title.localeCompare(o.event.title)||r.event.id.localeCompare(o.event.id)||r.occurrenceIndex-o.occurrenceIndex})}function Fa(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function bi(e,t,n=ee){return Gn(t,n).map(r=>({date:r,occurrences:e.filter(o=>fi(r,Fa(o)))}))}function nn(e,t){if(!e.trim())throw new Error(`CalendarEvent.${t} must not be empty`)}function Ha(e,t){if(nn(e.id,"id"),nn(e.moduleId,"moduleId"),nn(e.kind,"kind"),nn(e.title,"title"),e.moduleId!==t)throw new Error(`Adapter "${t}" returned event for module "${e.moduleId}"`);return e}var qn=class{adapters=new Map;register(t){if(nn(t.moduleId,"moduleId"),this.adapters.has(t.moduleId))throw new Error(`Calendar module already registered: ${t.moduleId}`);this.adapters.set(t.moduleId,t)}has(t){return this.adapters.has(t)}normalize(t,n){let r=this.adapters.get(t);if(!r)throw new Error(`Calendar module is not registered: ${t}`);let o=r.normalize(n);return(Array.isArray(o)?o:[o]).map(s=>Ha(s,t))}};var Jn=class{registry=new qn;loaders=new Map;timeSource;calendarSystem;constructor(t){this.timeSource=t.timeSource,this.calendarSystem=t.calendarSystem??ee}registerModule(t){let n=t.adapter.moduleId;if(this.loaders.has(n))throw new Error(`Calendar app module already registered: ${n}`);this.registry.register(t.adapter),this.loaders.set(n,async()=>(await t.source.load()).flatMap(o=>this.registry.normalize(n,o)))}hasModule(t){return this.loaders.has(t)}async loadEvents(){return(await Promise.all([...this.loaders.values()].map(n=>n()))).flat()}async buildSnapshot(t){let[n,r]=await Promise.all([this.timeSource.getCurrentPoint(),this.loadEvents()]),o=_i(r,t,this.calendarSystem);return{now:n,range:t,events:r,occurrences:o,days:bi(o,t,this.calendarSystem)}}};function Ei(e){return{date:{...e.date},...e.time?{time:{...e.time}}:{}}}function Ua(e){return{key:[e.event.moduleId,e.event.id,e.occurrenceIndex].join(":"),eventId:e.event.id,occurrenceIndex:e.occurrenceIndex,moduleId:e.event.moduleId,kind:e.event.kind,title:e.event.title,allDay:e.event.allDay??!e.start.time,start:Ei(e.start),...e.end?{end:Ei(e.end)}:{},tags:[...e.event.tags??[]]}}function vi(e,t,n=!1){return{key:tn(e),date:{...e},isToday:n,occurrences:t.map(Ua)}}function ja(e,t){let n=e??0;if(!Number.isInteger(n)||n<0||n>=t.daysInWeek)throw new RangeError(`weekStartsOn must be between 0 and ${t.daysInWeek-1}`);return n}function Hr(e){let t=e.calendarSystem??ee,n=ja(e.weekStartsOn,t),r={year:e.year,month:e.month,day:1};G(r,t);let o={year:e.year,month:e.month,day:t.daysInMonth(e.year,e.month)},s=(Yn(r,e.weekAnchor,t)-n+t.daysInWeek)%t.daysInWeek,a=(n+t.daysInWeek-1)%t.daysInWeek,c=Yn(o,e.weekAnchor,t),f=(a-c+t.daysInWeek)%t.daysInWeek;return{start:et(r,-s,t),end:et(o,f,t)}}function Wa(e,t){return ae(e.start,t.start)<=0&&ae(e.end,t.end)>=0}function wi(e){let t=e.calendarSystem??ee,n=Hr(e);if(!Wa(e.snapshot.range,n))throw new RangeError("CalendarAppSnapshot does not cover the complete month grid range");let r=new Map(e.snapshot.days.map(a=>[tn(a.date),a.occurrences])),o=Gn(n,t).map(a=>{let c=tn(a);return{key:c,date:a,weekday:Yn(a,e.weekAnchor,t),inCurrentMonth:a.year===e.year&&a.month===e.month,isToday:Lr(a,e.snapshot.now.date),isSelected:e.selectedDate?Lr(a,e.selectedDate):!1,occurrences:r.get(c)??[]}}),i=o.find(a=>a.isSelected),s=i?vi(i.date,i.occurrences,i.isToday):void 0;return{year:e.year,month:e.month,today:{...e.snapshot.now.date},columns:t.daysInWeek,range:n,cells:o,...s?{selectedDay:s}:{}}}var Xn=class{app;weekAnchor;weekStartsOn;calendarSystem;currentMonth;selectedDate;snapshot=null;model=null;constructor(t){this.app=t.app,this.weekAnchor=t.weekAnchor,this.weekStartsOn=t.weekStartsOn,this.calendarSystem=t.calendarSystem??ee;let n={...t.initialMonth,day:1};G(n,this.calendarSystem),this.currentMonth={year:n.year,month:n.month},t.selectedDate&&(G(t.selectedDate,this.calendarSystem),this.selectedDate=ft(t.selectedDate))}getCurrentMonth(){return{...this.currentMonth}}getSelectedDate(){return this.selectedDate?ft(this.selectedDate):void 0}getModel(){return this.model}async load(){let t=Hr({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem});return this.snapshot=await this.app.buildSnapshot(t),this.model=this.buildModel(this.snapshot),this.model}async navigateMonths(t){let n=Kn({...this.currentMonth,day:1},t,this.calendarSystem);return this.currentMonth={year:n.year,month:n.month},this.selectedDate&&(this.selectedDate={...this.currentMonth,day:Math.min(this.selectedDate.day,this.calendarSystem.daysInMonth(n.year,n.month))}),this.load()}async goToDate(t){return G(t,this.calendarSystem),this.selectedDate=ft(t),!this.snapshot||t.year!==this.currentMonth.year||t.month!==this.currentMonth.month?(this.currentMonth={year:t.year,month:t.month},this.load()):(this.model=this.buildModel(this.snapshot),this.model)}async stepSelectedDate(t){let n=this.selectedDate??this.model?.today;if(!n)throw new Error("CalendarMonthSession must be loaded before stepping dates");return this.goToDate(et(n,t,this.calendarSystem))}selectDate(t){if(G(t,this.calendarSystem),!this.snapshot)throw new Error("CalendarMonthSession must be loaded before selecting a date");return this.selectedDate=ft(t),this.model=this.buildModel(this.snapshot),this.model}clearSelectedDate(){if(!this.snapshot)throw new Error("CalendarMonthSession must be loaded before clearing selection");return this.selectedDate=void 0,this.model=this.buildModel(this.snapshot),this.model}buildModel(t){return wi({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:this.selectedDate,snapshot:t})}};var Zn=class{app;reader;timeSource;calendarSystem;constructor(t){this.reader=new At(t.runtime),this.timeSource=new Fn({reader:this.reader,path:t.timePath,parser:t.timeParser}),this.calendarSystem=t.calendarSystem??ee,this.app=new Jn({timeSource:this.timeSource,calendarSystem:this.calendarSystem})}registerModule(t){this.app.registerModule({adapter:t.adapter,source:new Hn({reader:this.reader,path:t.path,parser:t.parser})})}async getCurrentDate(){return{...(await this.timeSource.getCurrentPoint()).date}}async createMonthSession(t){let n=t.initialMonth??await this.getCurrentDate();return new Xn({app:this.app,initialMonth:{year:n.year,month:n.month},weekAnchor:t.weekAnchor,weekStartsOn:t.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:t.selectedDate})}};function xi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Ur(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function Ba(e){if(!xi(e))return null;let t=Ur(e.year),n=Ur(e.month),r=Ur(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function Ci(e){if(!xi(e))return null;let t=Ba(e.date),n=Number.isInteger(e.weekday)?Number(e.weekday):null;return!t||n===null||n<0?null:{date:t,weekday:n}}function It(e){let t=Object.create(null);for(let n of e.split(","))t[n]=1;return n=>n in t}var K={},wt=[],me=()=>{},jr=()=>!1,$t=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),Lt=e=>e.startsWith("onUpdate:"),ne=Object.assign,on=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},za=Object.prototype.hasOwnProperty,L=(e,t)=>za.call(e,t),R=Array.isArray,pt=e=>sn(e)==="[object Map]",rn=e=>sn(e)==="[object Set]",Ni=e=>sn(e)==="[object Date]";var P=e=>typeof e=="function",te=e=>typeof e=="string",Ie=e=>typeof e=="symbol",z=e=>e!==null&&typeof e=="object",Wr=e=>(z(e)||P(e))&&P(e.then)&&P(e.catch),Ka=Object.prototype.toString,sn=e=>Ka.call(e),Br=e=>sn(e).slice(8,-1),zr=e=>sn(e)==="[object Object]",Qn=e=>te(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Ft=It(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");var er=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},Ya=/-\w/g,ge=er(e=>e.replace(Ya,t=>t.slice(1).toUpperCase())),Ga=/\B([A-Z])/g,tt=er(e=>e.replace(Ga,"-$1").toLowerCase()),an=er(e=>e.charAt(0).toUpperCase()+e.slice(1)),ln=er(e=>e?`on${an(e)}`:""),Ve=(e,t)=>!Object.is(e,t),cn=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},Ht=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},Kr=e=>{let t=parseFloat(e);return isNaN(t)?e:t};var Di,ht=()=>Di||(Di=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function dn(e){if(R(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],o=te(r)?Za(r):dn(r);if(o)for(let i in o)t[i]=o[i]}return t}else if(te(e)||z(e))return e}var qa=/;(?![^(]*\))/g,Ja=/:([^]+)/,Xa=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Za(e){let t={};return e.replace(Xa,n=>n.startsWith("/*")?"":n).split(qa).forEach(n=>{if(n){let r=n.split(Ja);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t}function un(e){let t="";if(te(e))t=e;else if(R(e))for(let n=0;n<e.length;n++){let r=un(e[n]);r&&(t+=r+" ")}else if(z(e))for(let n in e)e[n]&&(t+=n+" ");return t.trim()}var Ti="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",ki=It(Ti),Qa=It(Ti+",async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");function tr(e){return!!e||e===""}function el(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let o=0;r&&o<e.length;o++)r=Ut(e[o],t[o],n);return r}function Oi(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),o=new Uint8Array(r.length);for(let i of e){let s=-1;for(let a=0;a<r.length;a++)if(!o[a]&&Ut(i,r[a],n)){s=a;break}if(s<0)return!1;o[s]=1}return!0}function tl(e,t,n){let r=pt(e),o=pt(t);if(r||o||(r=rn(e),o=rn(t),r||o))return r&&o?Oi(e,t,n):!1;let i=Object.keys(e).length,s=Object.keys(t).length;if(i!==s)return!1;for(let a in e){let c=e.hasOwnProperty(a),f=t.hasOwnProperty(a);if(c&&!f||!c&&f||!Ut(e[a],t[a],n))return!1}return String(e)===String(t)}function Si(e,t,n,r){n||(n=[new Map,new Map]);let[o,i]=n;if(o.has(e)||i.has(t))return o.get(e)===t&&i.get(t)===e;o.set(e,t),i.set(t,e);let s=r(e,t,n);return o.delete(e),i.delete(t),s}function Ut(e,t,n){if(e===t)return!0;let r=Ni(e),o=Ni(t);return r||o?r&&o?e.getTime()===t.getTime():!1:(r=Ie(e),o=Ie(t),r||o?e===t:(r=R(e),o=R(t),r||o?r&&o?Si(e,t,n,el):!1:(r=z(e),o=z(t),r||o?!r||!o?!1:Si(e,t,n,tl):String(e)===String(t))))}function nl(e,...t){console.warn(`[Vue warn] ${e}`,...t)}var ue,mn=class{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!t&&ue&&(ue.active?(this.parent=ue,this.index=(ue.scopes||(ue.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes){let r=this.scopes.slice();for(t=0,n=r.length;t<n;t++)r[t].pause()}for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes){let o=this.scopes.slice();for(t=0,n=o.length;t<n;t++)o[t].resume()}let r=this.effects.slice();for(t=0,n=r.length;t<n;t++)r[t].resume()}}run(t){if(this._active){let n=ue;try{return ue=this,t()}finally{ue=n}}}on(){++this._on===1&&(this.prevScope=ue,ue=this)}off(){if(this._on>0&&--this._on===0){if(ue===this)ue=this.prevScope;else{let t=ue;for(;t;){if(t.prevScope===this){t.prevScope=this.prevScope;break}t=t.prevScope}}this.prevScope=void 0}}stop(t){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){let o=this.scopes.slice();for(n=0,r=o.length;n<r;n++)o[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){let o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0}}};function Mi(){return ue}var q;var Yr=new WeakSet,Wt=class{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,ue&&(ue.active?ue.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Yr.has(this)&&(Yr.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Pi(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ai(this),Ii(this);let t=q,n=$e;q=this,$e=!0;try{return this.fn()}finally{$i(this),q=t,$e=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)so(t);this.deps=this.depsTail=void 0,Ai(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Yr.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Jr(this)&&this.run()}get dirty(){return Jr(this)}},Ri=0,pn,hn;function Pi(e,t=!1){if(e.flags|=8,t){e.next=hn,hn=e;return}e.next=pn,pn=e}function oo(){Ri++}function io(){if(--Ri>0)return;if(hn){let t=hn;for(hn=void 0;t;){let n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;pn;){let t=pn;for(pn=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(r){e||(e=r)}t=n}}if(e)throw e}function Ii(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function $i(e){let t,n=e.depsTail,r=n;for(;r;){let o=r.prevDep;r.version===-1?(r===n&&(n=o),so(r),rl(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=o}e.deps=t,e.depsTail=n}function Jr(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Li(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Li(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===gn)||(e.globalVersion=gn,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Jr(e))))return;e.flags|=2;let t=e.dep,n=q,r=$e;q=e,$e=!0;try{Ii(e);let o=e.fn(e._value);(t.version===0||Ve(o,e._value))&&(e.flags|=128,e._value=o,t.version++)}catch(o){throw t.version++,o}finally{q=n,$e=r,$i(e),e.flags&=-3}}function so(e,t=!1){let{dep:n,prevSub:r,nextSub:o}=e;if(r&&(r.nextSub=o,e.prevSub=void 0),o&&(o.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)so(i,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function rl(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var $e=!0,Fi=[];function Ye(){Fi.push($e),$e=!1}function Ge(){let e=Fi.pop();$e=e===void 0?!0:e}function Ai(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let n=q;q=void 0;try{t()}finally{q=n}}}var gn=0,Xr=class{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},yn=class{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!q||!$e||q===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==q)n=this.activeLink=new Xr(q,this),q.deps?(n.prevDep=q.depsTail,q.depsTail.nextDep=n,q.depsTail=n):q.deps=q.depsTail=n,Hi(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){let r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=q.depsTail,n.nextDep=void 0,q.depsTail.nextDep=n,q.depsTail=n,q.deps===n&&(q.deps=r)}return n}trigger(t){this.version++,gn++,this.notify(t)}notify(t){oo();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{io()}}};function Hi(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let r=t.deps;r;r=r.nextDep)Hi(r)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Zr=new WeakMap,Ct=Symbol(""),Qr=Symbol(""),_n=Symbol("");function fe(e,t,n){if($e&&q){let r=Zr.get(e);r||Zr.set(e,r=new Map);let o=r.get(n);o||(r.set(n,o=new yn),o.map=r,o.key=n),o.track()}}function Ke(e,t,n,r,o,i){let s=Zr.get(e);if(!s){gn++;return}let a=c=>{c&&c.trigger()};if(oo(),t==="clear")s.forEach(a);else{let c=R(e),f=c&&Qn(n);if(c&&n==="length"){let u=Number(r);s.forEach((p,C)=>{(C==="length"||C===_n||!Ie(C)&&C>=u)&&a(p)})}else switch((n!==void 0||s.has(void 0))&&a(s.get(n)),f&&a(s.get(_n)),t){case"add":c?f&&a(s.get("length")):(a(s.get(Ct)),pt(e)&&a(s.get(Qr)));break;case"delete":c||(a(s.get(Ct)),pt(e)&&a(s.get(Qr)));break;case"set":pt(e)&&a(s.get(Ct));break}}io()}function jt(e){let t=F(e);return t===e||(fe(t,"iterate",_n),Se(e))?t:Le(e)?ot(e)?t.map(n=>mt(Fe(n))):t.map(mt):t.map(Fe)}function cr(e){return fe(e=F(e),"iterate",_n),e}function ze(e,t){return Le(e)?mt(ot(e)?Fe(t):t):Fe(t)}var ol={__proto__:null,[Symbol.iterator](){return Gr(this,Symbol.iterator,e=>ze(this,e))},concat(...e){return jt(this).concat(...e.map(t=>R(t)?jt(t):t))},entries(){return Gr(this,"entries",e=>(e[1]=ze(this,e[1]),e))},every(e,t){return nt(this,"every",e,t,void 0,arguments)},filter(e,t){return nt(this,"filter",e,t,n=>n.map(r=>ze(this,r)),arguments)},find(e,t){return nt(this,"find",e,t,n=>ze(this,n),arguments)},findIndex(e,t){return nt(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return nt(this,"findLast",e,t,n=>ze(this,n),arguments)},findLastIndex(e,t){return nt(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return nt(this,"forEach",e,t,void 0,arguments)},includes(...e){return qr(this,"includes",e)},indexOf(...e){return qr(this,"indexOf",e)},join(e){return jt(this).join(e)},lastIndexOf(...e){return qr(this,"lastIndexOf",e)},map(e,t){return nt(this,"map",e,t,void 0,arguments)},pop(){return fn(this,"pop")},push(...e){return fn(this,"push",e)},reduce(e,...t){return Vi(this,"reduce",e,t)},reduceRight(e,...t){return Vi(this,"reduceRight",e,t)},shift(){return fn(this,"shift")},some(e,t){return nt(this,"some",e,t,void 0,arguments)},splice(...e){return fn(this,"splice",e)},toReversed(){return jt(this).toReversed()},toSorted(e){return jt(this).toSorted(e)},toSpliced(...e){return jt(this).toSpliced(...e)},unshift(...e){return fn(this,"unshift",e)},values(){return Gr(this,"values",e=>ze(this,e))}};function Gr(e,t,n){let r=cr(e),o=r[t]();return r!==e&&!Se(e)&&(o._next=o.next,o.next=()=>{let i=o._next();return i.done||(i.value=n(i.value)),i}),o}var il=Array.prototype;function nt(e,t,n,r,o,i){let s=cr(e),a=s!==e&&!Se(e),c=s[t];if(c!==il[t]){let p=c.apply(e,i);return a?Fe(p):p}let f=n;s!==e&&(a?f=function(p,C){return n.call(this,ze(e,p),C,e)}:n.length>2&&(f=function(p,C){return n.call(this,p,C,e)}));let u=c.call(s,f,r);return a&&o?o(u):u}function Vi(e,t,n,r){let o=cr(e),i=o!==e&&!Se(e),s=n,a=!1;o!==e&&(i?(a=r.length===0,s=function(f,u,p){return a&&(a=!1,f=ze(e,f)),n.call(this,f,ze(e,u),p,e)}):n.length>3&&(s=function(f,u,p){return n.call(this,f,u,p,e)}));let c=o[t](s,...r);return a?ze(e,c):c}function qr(e,t,n){let r=F(e);fe(r,"iterate",_n);let o=r[t](...n);return(o===-1||o===!1)&&En(n[0])?(n[0]=F(n[0]),r[t](...n)):o}function fn(e,t,n=[]){Ye(),oo();let r=F(e)[t].apply(e,n);return io(),Ge(),r}var sl=It("__proto__,__v_isRef,__isVue"),Ui=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Ie));function al(e){Ie(e)||(e=String(e));let t=F(this);return fe(t,"has",e),t.hasOwnProperty(e)}var ir=class{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,r){if(n==="__v_skip")return t.__v_skip;let o=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!o;if(n==="__v_isReadonly")return o;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(o?i?gl:Bi:i?Wi:ji).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(r)?t:void 0;let s=R(t);if(!o){let c;if(s&&(c=ol[n]))return c;if(n==="hasOwnProperty")return al}let a=Reflect.get(t,n,ce(t)?t:r);if((Ie(n)?Ui.has(n):sl(n))||(o||fe(t,"get",n),i))return a;if(ce(a)){let c=s&&Qn(n)?a:a.value;return o&&z(c)?ar(c):c}return z(a)?o?ar(a):bn(a):a}},sr=class extends ir{constructor(t=!1){super(!1,t)}set(t,n,r,o){let i=t[n],s=R(t)&&Qn(n);if(!this._isShallow){let f=Le(i);if(!Se(r)&&!Le(r)&&(i=F(i),r=F(r)),!s&&ce(i)&&!ce(r))return f||(i.value=r),!0}let a=s?Number(n)<t.length:L(t,n),c=Reflect.set(t,n,r,ce(t)?t:o);return t===F(o)&&c&&(a?Ve(r,i)&&Ke(t,"set",n,r,i):Ke(t,"add",n,r)),c}deleteProperty(t,n){let r=L(t,n),o=t[n],i=Reflect.deleteProperty(t,n);return i&&r&&Ke(t,"delete",n,void 0,o),i}has(t,n){let r=Reflect.has(t,n);return(!Ie(n)||!Ui.has(n))&&fe(t,"has",n),r}ownKeys(t){return fe(t,"iterate",R(t)?"length":Ct),Reflect.ownKeys(t)}},eo=class extends ir{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}},ll=new sr,cl=new eo,dl=new sr(!0);var to=e=>e,nr=e=>Reflect.getPrototypeOf(e);function ul(e,t,n){return function(...r){let o=this.__v_raw,i=F(o),s=pt(i),a=e==="entries"||e===Symbol.iterator&&s,c=e==="keys"&&s,f=o[e](...r),u=n?to:t?mt:Fe;return!t&&fe(i,"iterate",c?Qr:Ct),ne(Object.create(f),{next(){let{value:p,done:C}=f.next();return C?{value:p,done:C}:{value:a?[u(p[0]),u(p[1])]:u(p),done:C}}})}}function rr(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function fl(e,t){let n={get(o){let i=this.__v_raw,s=F(i),a=F(o);e||(Ve(o,a)&&fe(s,"get",o),fe(s,"get",a));let{has:c}=nr(s),f=t?to:e?mt:Fe;if(c.call(s,o))return f(i.get(o));if(c.call(s,a))return f(i.get(a));i!==s&&i.get(o)},get size(){let o=this.__v_raw;return!e&&fe(F(o),"iterate",Ct),o.size},has(o){let i=this.__v_raw,s=F(i),a=F(o);return e||(Ve(o,a)&&fe(s,"has",o),fe(s,"has",a)),o===a?i.has(o):i.has(o)||i.has(a)},forEach(o,i){let s=this,a=s.__v_raw,c=F(a),f=t?to:e?mt:Fe;return!e&&fe(c,"iterate",Ct),a.forEach((u,p)=>o.call(i,f(u),f(p),s))}};return ne(n,e?{add:rr("add"),set:rr("set"),delete:rr("delete"),clear:rr("clear")}:{add(o){let i=F(this),s=nr(i),a=F(o),c=!t&&!Se(o)&&!Le(o)?a:o;return s.has.call(i,c)||Ve(o,c)&&s.has.call(i,o)||Ve(a,c)&&s.has.call(i,a)||(i.add(c),Ke(i,"add",c,c)),this},set(o,i){!t&&!Se(i)&&!Le(i)&&(i=F(i));let s=F(this),{has:a,get:c}=nr(s),f=a.call(s,o);f||(o=F(o),f=a.call(s,o));let u=c.call(s,o);return s.set(o,i),f?Ve(i,u)&&Ke(s,"set",o,i,u):Ke(s,"add",o,i),this},delete(o){let i=F(this),{has:s,get:a}=nr(i),c=s.call(i,o);c||(o=F(o),c=s.call(i,o));let f=a?a.call(i,o):void 0,u=i.delete(o);return c&&Ke(i,"delete",o,void 0,f),u},clear(){let o=F(this),i=o.size!==0,s=void 0,a=o.clear();return i&&Ke(o,"clear",void 0,void 0,s),a}}),["keys","values","entries",Symbol.iterator].forEach(o=>{n[o]=ul(o,e,t)}),n}function ao(e,t){let n=fl(e,t);return(r,o,i)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?r:Reflect.get(L(n,o)&&o in r?n:r,o,i)}var pl={get:ao(!1,!1)},hl={get:ao(!1,!0)},ml={get:ao(!0,!1)};var ji=new WeakMap,Wi=new WeakMap,Bi=new WeakMap,gl=new WeakMap;function yl(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function bn(e){return Le(e)?e:co(e,!1,ll,pl,ji)}function lo(e){return co(e,!1,dl,hl,Wi)}function ar(e){return co(e,!0,cl,ml,Bi)}function co(e,t,n,r,o){if(!z(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let i=o.get(e);if(i)return i;let s=yl(Br(e));if(s===0)return e;let a=new Proxy(e,s===2?r:n);return o.set(e,a),a}function ot(e){return Le(e)?ot(e.__v_raw):!!(e&&e.__v_isReactive)}function Le(e){return!!(e&&e.__v_isReadonly)}function Se(e){return!!(e&&e.__v_isShallow)}function En(e){return e?!!e.__v_raw:!1}function F(e){let t=e&&e.__v_raw;return t?F(t):e}function uo(e){return!L(e,"__v_skip")&&Object.isExtensible(e)&&Ht(e,"__v_skip",!0),e}var Fe=e=>z(e)?bn(e):e,mt=e=>z(e)?ar(e):e;function ce(e){return e?e.__v_isRef===!0:!1}function gt(e){return zi(e,!1)}function dr(e){return zi(e,!0)}function zi(e,t){return ce(e)?e:new no(e,t)}var no=class{constructor(t,n){this.dep=new yn,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:F(t),this._value=n?t:Fe(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){let n=this._rawValue,r=this.__v_isShallow||Se(t)||Le(t);t=r?t:F(t),Ve(t,n)&&(this._rawValue=t,this._value=r?t:Fe(t),this.dep.trigger())}};function fo(e){return ce(e)?e.value:e}var _l={get:(e,t,n)=>t==="__v_raw"?e:fo(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let o=e[t];return ce(o)&&!ce(n)?(o.value=n,!0):Reflect.set(e,t,n,r)}};function ur(e){return ot(e)?e:new Proxy(e,_l)}var ro=class{constructor(t,n,r){this.fn=t,this.setter=n,this._value=void 0,this.dep=new yn(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=gn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&q!==this)return Pi(this,!0),!0}get value(){let t=this.dep.track();return Li(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}};function Ki(e,t,n=!1){let r,o;return P(e)?r=e:(r=e.get,o=e.set),new ro(r,o,n)}var or={},lr=new WeakMap,xt;function Yi(e,t=!1,n=xt){if(n){let r=lr.get(n);r||lr.set(n,r=[]),r.push(e)}}function Gi(e,t,n=K){let{immediate:r,deep:o,once:i,scheduler:s,augmentJob:a,call:c}=n,f=S=>{(n.onWarn||nl)("Invalid watch source: ",S,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},u=S=>o?S:Se(S)||o===!1||o===0?rt(S,1):rt(S),p,C,E,v,D=!1,W=!1;if(ce(e)?(C=()=>e.value,D=Se(e)):ot(e)?(C=()=>u(e),D=!0):R(e)?(W=!0,D=e.some(S=>ot(S)||Se(S)),C=()=>e.map(S=>{if(ce(S))return S.value;if(ot(S))return u(S);if(P(S))return c?c(S,2):S()})):P(e)?t?C=c?()=>c(e,2):e:C=()=>{if(E){Ye();try{E()}finally{Ge()}}let S=xt;xt=p;try{return c?c(e,3,[v]):e(v)}finally{xt=S}}:C=me,t&&o){let S=C,Q=o===!0?1/0:o;C=()=>rt(S(),Q)}let J=Mi(),M=()=>{p.stop(),J&&J.active&&on(J.effects,p)};if(i&&t){let S=t;t=(...Q)=>{let pe=S(...Q);return M(),pe}}let I=W?new Array(e.length).fill(or):or,Z=S=>{if(!(!(p.flags&1)||!p.dirty&&!S))if(t){let Q=p.run();if(S||o||D||(W?Q.some((pe,Ee)=>Ve(pe,I[Ee])):Ve(Q,I))){E&&E();let pe=xt;xt=p;try{let Ee=[Q,I===or?void 0:W&&I[0]===or?[]:I,v];I=Q,c?c(t,3,Ee):t(...Ee)}finally{xt=pe}}}else p.run()};return a&&a(Z),p=new Wt(C),p.scheduler=s?()=>s(Z,!1):Z,v=S=>Yi(S,!1,p),E=p.onStop=()=>{let S=lr.get(p);if(S){if(c)c(S,4);else for(let Q of S)Q();lr.delete(p)}},t?r?Z(!0):I=p.run():s?s(Z.bind(null,!0),!0):p.run(),M.pause=p.pause.bind(p),M.resume=p.resume.bind(p),M.stop=M,M}function rt(e,t=1/0,n){if(t<=0||!z(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,ce(e))rt(e.value,t,n);else if(R(e))for(let r=0;r<e.length;r++)rt(e[r],t,n);else if(rn(e)||pt(e))e.forEach(r=>{rt(r,t,n)});else if(zr(e)){for(let r in e)rt(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&rt(e[r],t,n)}return e}function An(e,t,n,r){try{return r?e(...r):e()}catch(o){wr(o,t,n)}}function Re(e,t,n,r){if(P(e)){let o=An(e,t,n,r);return o&&Wr(o)&&o.catch(i=>{wr(i,t,n)}),o}if(R(e)){let o=[];for(let i=0;i<e.length;i++)o.push(Re(e[i],t,n,r));return o}}function wr(e,t,n,r=!0){let o=t?t.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:s}=t&&t.appContext.config||K;if(t){let a=t.parent,c=t.proxy,f=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){let u=a.ec;if(u){for(let p=0;p<u.length;p++)if(u[p](e,c,f)===!1)return}a=a.parent}if(i){Ye(),An(i,null,10,[e,c,f]),Ge();return}}wl(e,n,o,r,s)}function wl(e,t,n,r=!0,o=!1){if(o)throw e;console.error(e)}var _e=[],Je=-1,zt=[],yt=null,Bt=0,ds=Promise.resolve(),hr=null;function Vn(e){let t=hr||ds;return e?t.then(this?e.bind(this):e):t}function xl(e){let t=Je+1,n=_e.length;for(;t<n;){let r=t+n>>>1,o=_e[r],i=Sn(o);i<e||i===e&&o.flags&2?t=r+1:n=r}return t}function wo(e){if(!(e.flags&1)){let t=Sn(e),n=_e[_e.length-1];!n||!(e.flags&2)&&t>=Sn(n)?_e.push(e):_e.splice(xl(t),0,e),e.flags|=1,us()}}function us(){hr||(hr=ds.then(hs))}function fs(e){if(!R(e))yt&&e.id===-1?yt.splice(Bt+1,0,e):e.flags&1||(zt.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)zt.push(e[t]);us()}function qi(e,t,n=Je+1){for(;n<_e.length;n++){let r=_e[n];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;_e.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function ps(e){if(zt.length){let t=[...new Set(zt)].sort((n,r)=>Sn(n)-Sn(r));if(zt.length=0,yt){for(let n=0;n<t.length;n++)yt.push(t[n]);return}for(yt=t,Bt=0;Bt<yt.length;Bt++){let n=yt[Bt];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}yt=null,Bt=0}}var Sn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function hs(e){let t=me;try{for(Je=0;Je<_e.length;Je++){let n=_e[Je];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),An(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;Je<_e.length;Je++){let n=_e[Je];n&&(n.flags&=-2)}Je=-1,_e.length=0,ps(e),hr=null,(_e.length||zt.length)&&hs(e)}}var Ze,wn=[],yo=!1;function xr(e,...t){Ze?Ze.emit(e,...t):yo||wn.push({event:e,args:t})}function ms(e,t){var n,r;Ze=e,Ze?(Ze.enabled=!0,wn.forEach(({event:o,args:i})=>Ze.emit(o,...i)),wn=[]):typeof window<"u"&&window.HTMLElement&&!((r=(n=window.navigator)==null?void 0:n.userAgent)!=null&&r.includes("jsdom"))?((t.__VUE_DEVTOOLS_HOOK_REPLAY__=t.__VUE_DEVTOOLS_HOOK_REPLAY__||[]).push(i=>{ms(i,t)}),setTimeout(()=>{Ze||(t.__VUE_DEVTOOLS_HOOK_REPLAY__=null,yo=!0,wn=[])},3e3)):(yo=!0,wn=[])}function Cl(e,t){xr("app:init",e,t,{Fragment:He,Text:Rn,Comment:_t,Static:On})}function Nl(e){xr("app:unmount",e)}var Dl=xo("component:added"),gs=xo("component:updated"),Ol=xo("component:removed"),Sl=e=>{Ze&&typeof Ze.cleanupBuffer=="function"&&!Ze.cleanupBuffer(e)&&Ol(e)};function xo(e){return t=>{xr(e,t.appContext.app,t.uid,t.parent?t.parent.uid:void 0,t)}}function Tl(e,t,n){xr("component:emit",e.appContext.app,e,t,n)}var Qe=null,ys=null;function mr(e){let t=Qe;return Qe=e,ys=e&&e.type.__scopeId||null,t}function kl(e,t=Qe,n){if(!t||e._n)return e;let r=(...o)=>{r._d&&_r(-1);let i=mr(t),s=Gt.length,a;try{a=e(...o)}finally{for(let c=Gt.length;c>s;c--)bc();mr(i),r._d&&_r(1)}return __VUE_PROD_DEVTOOLS__&&gs(t),a};return r._n=!0,r._c=!0,r._d=!0,r}function Nt(e,t,n,r){let o=e.dirs,i=t&&t.dirs;for(let s=0;s<o.length;s++){let a=o[s];i&&(a.oldValue=i[s].value);let c=a.dir[r];c&&(Ye(),Re(c,n,8,[e.el,a,e,t]),Ge())}}function Al(e,t){if(be){let n=be.provides,r=be.parent&&be.parent.provides;r===n&&(n=be.provides=Object.create(r)),n[e]=t}}function fr(e,t,n=!1){let r=Bs();if(r||Yt){let o=Yt?Yt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(o&&e in o)return o[e];if(arguments.length>1)return n&&P(t)?t.call(r&&r.proxy):t}}var Vl=Symbol.for("v-scx"),Ml=()=>{{let e=fr(Vl);return e}};function Kt(e,t,n){return _s(e,t,n)}function _s(e,t,n=K){let{immediate:r,deep:o,flush:i,once:s}=n,a=ne({},n),c=t&&r||!t&&i!=="post",f;if(kn){if(i==="sync"){let E=Ml();f=E.__watcherHandles||(E.__watcherHandles=[])}else if(!c){let E=()=>{};return E.stop=me,E.resume=me,E.pause=me,E}}let u=be;a.call=(E,v,D)=>Re(E,u,v,D);let p=!1;i==="post"?a.scheduler=E=>{Ce(E,u&&u.suspense)}:i!=="sync"&&(p=!0,a.scheduler=(E,v)=>{v?E():wo(E)}),a.augmentJob=E=>{t&&(E.flags|=4),p&&(E.flags|=2,u&&(E.id=u.uid,E.i=u))};let C=Gi(e,t,a);return kn&&(f?f.push(C):c&&C()),C}function Rl(e,t,n){let r=this.proxy,o=te(e)?e.includes(".")?bs(r,e):()=>r[e]:e.bind(r,r),i;P(t)?i=t:(i=t.handler,n=t);let s=Pn(this),a=_s(o,i.bind(r),n);return s(),a}function bs(e,t){let n=t.split(".");return()=>{let r=e;for(let o=0;o<n.length&&r;o++)r=r[n[o]];return r}}var Pl=Symbol("_vte"),Cr=e=>e.__isTeleport;var po=Symbol("_leaveCb");function Il(e){let t=e[0];if(e.length>1){let n=!1;for(let r of e)if(r.type!==_t){t=r,n=!0;break}}return t}function Es(e){if(!Co(e))return Cr(e.type)&&e.children?Il(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&P(n.default))return n.default()}}function Nr(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Nr(Cr(n.type)&&Es(n)||n,t)}else e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Mn(e,t){return P(e)?ne({name:e.name},t,{setup:e}):e}function vs(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function Ji(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var gr=new WeakMap;function Cn(e,t,n,r,o=!1){if(R(e)){e.forEach((D,W)=>Cn(D,t&&(R(t)?t[W]:t),n,r,o));return}if(Nn(r)&&!o){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Cn(e,t,n,r.component.subTree);return}let i=r.shapeFlag&4?ko(r.component):r.el,s=o?null:i,{i:a,r:c}=e,f=t&&t.r,u=a.refs===K?a.refs={}:a.refs,p=a.setupState,C=F(p),E=p===K?jr:D=>Ji(u,D)?!1:L(C,D),v=(D,W)=>!(W&&Ji(u,W));if(f!=null&&f!==c){if(Xi(t),te(f))u[f]=null,E(f)&&(p[f]=null);else if(ce(f)){let D=t;v(f,D.k)&&(f.value=null),D.k&&(u[D.k]=null)}}if(P(c))An(c,a,12,[s,u]);else{let D=te(c),W=ce(c);if(D||W){let J=()=>{if(e.f){let M=D?E(c)?p[c]:u[c]:v(c)||!e.k?c.value:u[e.k];if(o)R(M)&&on(M,i);else if(R(M))M.includes(i)||M.push(i);else if(D)u[c]=[i],E(c)&&(p[c]=u[c]);else{let I=[i];v(c,e.k)&&(c.value=I),e.k&&(u[e.k]=I)}}else D?(u[c]=s,E(c)&&(p[c]=s)):W&&(v(c,e.k)&&(c.value=s),e.k&&(u[e.k]=s))};if(s){let M=()=>{J(),gr.delete(e)};M.id=-1,gr.set(e,M),Ce(M,n)}else Xi(e),J()}}}function Xi(e){let t=gr.get(e);t&&(t.flags|=8,gr.delete(e))}var yp=ht().requestIdleCallback||(e=>setTimeout(e,1)),_p=ht().cancelIdleCallback||(e=>clearTimeout(e));var Nn=e=>!!e.type.__asyncLoader;var Co=e=>e.type.__isKeepAlive;function $l(e,t){ws(e,"a",t)}function Ll(e,t){ws(e,"da",t)}function ws(e,t,n=be){let r=e.__wdc||(e.__wdc=()=>{let o=n;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(Dr(t,r,n),n){let o=n.parent;for(;o&&o.parent;)Co(o.parent.vnode)&&Fl(r,t,n,o),o=o.parent}}function Fl(e,t,n,r){let o=Dr(t,e,r,!0);No(()=>{on(r[t],o)},n)}function Dr(e,t,n=be,r=!1){if(n){let o=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...s)=>{Ye();let a=Pn(n),c=Re(t,n,e,s);return a(),Ge(),c});return r?o.unshift(i):o.push(i),i}}var at=e=>(t,n=be)=>{(!kn||e==="sp")&&Dr(e,(...r)=>t(...r),n)},Hl=at("bm"),xs=at("m"),Cs=at("bu"),Ns=at("u"),Ul=at("bum"),No=at("um"),jl=at("sp"),Wl=at("rtg"),Bl=at("rtc");function zl(e,t=be){Dr("ec",e,t)}var Kl=Symbol.for("v-ndc");var _o=e=>e?zs(e)?ko(e):_o(e.parent):null;var Dn=ne(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>_o(e.parent),$root:e=>_o(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>__VUE_OPTIONS_API__?Do(e):e.type,$forceUpdate:e=>e.f||(e.f=()=>{wo(e.update)}),$nextTick:e=>e.n||(e.n=Vn.bind(e.proxy)),$watch:e=>__VUE_OPTIONS_API__?Rl.bind(e):me});var ho=(e,t)=>e!==K&&!e.__isScriptSetup&&L(e,t),Yl={get({_:e},t){if(t==="__v_skip")return!0;let{ctx:n,setupState:r,data:o,props:i,accessCache:s,type:a,appContext:c}=e;if(t[0]!=="$"){let C=s[t];if(C!==void 0)switch(C){case 1:return r[t];case 2:return o[t];case 4:return n[t];case 3:return i[t]}else{if(ho(r,t))return s[t]=1,r[t];if(__VUE_OPTIONS_API__&&o!==K&&L(o,t))return s[t]=2,o[t];if(L(i,t))return s[t]=3,i[t];if(n!==K&&L(n,t))return s[t]=4,n[t];(!__VUE_OPTIONS_API__||bo)&&(s[t]=0)}}let f=Dn[t],u,p;if(f)return t==="$attrs"&&fe(e.attrs,"get",""),f(e);if((u=a.__cssModules)&&(u=u[t]))return u;if(n!==K&&L(n,t))return s[t]=4,n[t];if(p=c.config.globalProperties,L(p,t))return p[t]},set({_:e},t,n){let{data:r,setupState:o,ctx:i}=e;return ho(o,t)?(o[t]=n,!0):__VUE_OPTIONS_API__&&r!==K&&L(r,t)?(r[t]=n,!0):L(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:o,props:i,type:s}},a){let c;return!!(n[a]||__VUE_OPTIONS_API__&&e!==K&&a[0]!=="$"&&L(e,a)||ho(t,a)||L(i,a)||L(r,a)||L(Dn,a)||L(o.config.globalProperties,a)||(c=s.__cssModules)&&c[a])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:L(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Zi(e){return R(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}var bo=!0;function Gl(e){let t=Do(e),n=e.proxy,r=e.ctx;bo=!1,t.beforeCreate&&Qi(t.beforeCreate,e,"bc");let{data:o,computed:i,methods:s,watch:a,provide:c,inject:f,created:u,beforeMount:p,mounted:C,beforeUpdate:E,updated:v,activated:D,deactivated:W,beforeDestroy:J,beforeUnmount:M,destroyed:I,unmounted:Z,render:S,renderTracked:Q,renderTriggered:pe,errorCaptured:Ee,serverPrefetch:ve,expose:Ue,inheritAttrs:je,components:Te,directives:bt,filters:Jt}=t;if(f&&ql(f,r,null),s)for(let X in s){let U=s[X];P(U)&&(r[X]=U.bind(n))}if(o){let X=o.call(n,n);z(X)&&(e.data=bn(X))}if(bo=!0,i)for(let X in i){let U=i[X],we=P(U)?U.bind(n,n):P(U.get)?U.get.bind(n,n):me,Tt=!P(U)&&P(U.set)?U.set.bind(n):me,ct=Ot({get:we,set:Tt});Object.defineProperty(r,X,{enumerable:!0,configurable:!0,get:()=>ct.value,set:ke=>ct.value=ke})}if(a)for(let X in a)Ds(a[X],r,n,X);if(c){let X=P(c)?c.call(n):c;Reflect.ownKeys(X).forEach(U=>{Al(U,X[U])})}u&&Qi(u,e,"c");function de(X,U){R(U)?U.forEach(we=>X(we.bind(n))):U&&X(U.bind(n))}if(de(Hl,p),de(xs,C),de(Cs,E),de(Ns,v),de($l,D),de(Ll,W),de(zl,Ee),de(Bl,Q),de(Wl,pe),de(Ul,M),de(No,Z),de(jl,ve),R(Ue))if(Ue.length){let X=e.exposed||(e.exposed={});Ue.forEach(U=>{Object.defineProperty(X,U,{get:()=>n[U],set:we=>n[U]=we,enumerable:!0})})}else e.exposed||(e.exposed={});S&&e.render===me&&(e.render=S),je!=null&&(e.inheritAttrs=je),Te&&(e.components=Te),bt&&(e.directives=bt),ve&&vs(e)}function ql(e,t,n=me){R(e)&&(e=Eo(e));for(let r in e){let o=e[r],i;z(o)?"default"in o?i=fr(o.from||r,o.default,!0):i=fr(o.from||r):i=fr(o),ce(i)?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:s=>i.value=s}):t[r]=i}}function Qi(e,t,n){Re(R(e)?e.map(r=>r.bind(t.proxy)):e.bind(t.proxy),t,n)}function Ds(e,t,n,r){let o=r.includes(".")?bs(n,r):()=>n[r];if(te(e)){let i=t[e];P(i)&&Kt(o,i)}else if(P(e))Kt(o,e.bind(n));else if(z(e))if(R(e))e.forEach(i=>Ds(i,t,n,r));else{let i=P(e.handler)?e.handler.bind(n):t[e.handler];P(i)&&Kt(o,i,e)}}function Do(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:o,optionsCache:i,config:{optionMergeStrategies:s}}=e.appContext,a=i.get(t),c;return a?c=a:!o.length&&!n&&!r?c=t:(c={},o.length&&o.forEach(f=>yr(c,f,s,!0)),yr(c,t,s)),z(t)&&i.set(t,c),c}function yr(e,t,n,r=!1){let{mixins:o,extends:i}=t;i&&yr(e,i,n,!0),o&&o.forEach(s=>yr(e,s,n,!0));for(let s in t)if(!(r&&s==="expose")){let a=Jl[s]||n&&n[s];e[s]=a?a(e[s],t[s]):t[s]}return e}var Jl={data:es,props:ts,emits:ts,methods:xn,computed:xn,beforeCreate:ye,created:ye,beforeMount:ye,mounted:ye,beforeUpdate:ye,updated:ye,beforeDestroy:ye,beforeUnmount:ye,destroyed:ye,unmounted:ye,activated:ye,deactivated:ye,errorCaptured:ye,serverPrefetch:ye,components:xn,directives:xn,watch:Zl,provide:es,inject:Xl};function es(e,t){return t?e?function(){return ne(P(e)?e.call(this,this):e,P(t)?t.call(this,this):t)}:t:e}function Xl(e,t){return xn(Eo(e),Eo(t))}function Eo(e){if(R(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function ye(e,t){return e?[...new Set([].concat(e,t))]:t}function xn(e,t){return e?ne(Object.create(null),e,t):t}function ts(e,t){return e?R(e)&&R(t)?[...new Set([...e,...t])]:ne(Object.create(null),Zi(e),Zi(t??{})):t}function Zl(e,t){if(!e)return t;if(!t)return e;let n=ne(Object.create(null),e);for(let r in t)n[r]=ye(e[r],t[r]);return n}function Os(){return{app:null,config:{isNativeTag:jr,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Ql=0;function ec(e,t){return function(r,o=null){P(r)||(r=ne({},r)),o!=null&&!z(o)&&(o=null);let i=Os(),s=new WeakSet,a=[],c=!1,f=i.app={_uid:Ql++,_component:r,_props:o,_container:null,_context:i,_instance:null,version:cs,get config(){return i.config},set config(u){},use(u,...p){return s.has(u)||(u&&P(u.install)?(s.add(u),u.install(f,...p)):P(u)&&(s.add(u),u(f,...p))),f},mixin(u){return __VUE_OPTIONS_API__&&(i.mixins.includes(u)||i.mixins.push(u)),f},component(u,p){return p?(i.components[u]=p,f):i.components[u]},directive(u,p){return p?(i.directives[u]=p,f):i.directives[u]},mount(u,p,C){if(!c){let E=f._ceVNode||Me(r,o);return E.appContext=i,C===!0?C="svg":C===!1&&(C=void 0),p&&t?t(E,u):e(E,u,C),c=!0,f._container=u,u.__vue_app__=f,__VUE_PROD_DEVTOOLS__&&(f._instance=E.component,Cl(f,cs)),ko(E.component)}},onUnmount(u){a.push(u)},unmount(){c&&(Re(a,f._instance,16),e(null,f._container),__VUE_PROD_DEVTOOLS__&&(f._instance=null,Nl(f)),delete f._container.__vue_app__)},provide(u,p){return i.provides[u]=p,f},runWithContext(u){let p=Yt;Yt=f;try{return u()}finally{Yt=p}}};return f}}var Yt=null;var tc=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${ge(t)}Modifiers`]||e[`${tt(t)}Modifiers`];function nc(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||K,o=n,i=t.startsWith("update:"),s=i&&tc(r,t.slice(7));s&&(s.trim&&(o=n.map(u=>te(u)?u.trim():u)),s.number&&(o=o.map(Kr))),__VUE_PROD_DEVTOOLS__&&Tl(e,t,o);let a,c=r[a=ln(t)]||r[a=ln(ge(t))];!c&&i&&(c=r[a=ln(tt(t))]),c&&Re(c,e,6,o);let f=r[a+"Once"];if(f){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,Re(f,e,6,o)}}var rc=new WeakMap;function Ss(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?rc:t.emitsCache,o=r.get(e);if(o!==void 0)return o;let i=e.emits,s={},a=!1;if(__VUE_OPTIONS_API__&&!P(e)){let c=f=>{let u=Ss(f,t,!0);u&&(a=!0,ne(s,u))};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}return!i&&!a?(z(e)&&r.set(e,null),null):(R(i)?i.forEach(c=>s[c]=null):ne(s,i),z(e)&&r.set(e,s),s)}function Or(e,t){return!e||!$t(t)?!1:(t=t.slice(2),t=t==="Once"?t:t.replace(/Once$/,""),L(e,t[0].toLowerCase()+t.slice(1))||L(e,tt(t))||L(e,t))}function mo(e){let{type:t,vnode:n,proxy:r,withProxy:o,propsOptions:[i],slots:s,attrs:a,emit:c,render:f,renderCache:u,props:p,data:C,setupState:E,ctx:v,inheritAttrs:D}=e,W=mr(e),J,M;try{if(n.shapeFlag&4){let S=o||r,Q=S;J=Xe(f.call(Q,S,u,p,E,C,v)),M=a}else{let S=t;J=Xe(S.length>1?S(p,{attrs:a,slots:s,emit:c}):S(p,null)),M=t.props?a:oc(a)}}catch(S){Gt.length=0,wr(S,e,1),J=Me(_t)}let I=J,Z;if(M&&D!==!1){let S=Object.keys(M),{shapeFlag:Q}=I;S.length&&Q&7&&(i&&S.some(Lt)&&(M=ic(M,i)),I=qt(I,M,!1,!0))}if(n.dirs&&(I=qt(I,null,!1,!0),I.dirs=I.dirs?I.dirs.concat(n.dirs):n.dirs),n.transition){let S=Cr(I.type)&&Es(I)||I;Nr(S,n.transition)}return J=I,mr(W),J}var oc=e=>{let t;for(let n in e)(n==="class"||n==="style"||$t(n))&&((t||(t={}))[n]=e[n]);return t},ic=(e,t)=>{let n={};for(let r in e)(!Lt(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function sc(e,t,n){let{props:r,children:o,component:i}=e,{props:s,children:a,patchFlag:c}=t,f=i.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ns(r,s,f):!!s;if(c&8){let u=t.dynamicProps;for(let p=0;p<u.length;p++){let C=u[p];if(Ts(s,r,C)&&!Or(f,C))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:r===s?!1:r?s?ns(r,s,f):!0:!!s;return!1}function ns(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){let i=r[o];if(Ts(t,e,i)&&!Or(n,i))return!0}return!1}function Ts(e,t,n){let r=e[n],o=t[n];return n==="style"&&z(r)&&z(o)?!Ut(r,o):r!==o}function ac({vnode:e,parent:t,suspense:n},r){for(;t;){let o=t.subTree;if(o.suspense&&o.suspense.activeBranch===e&&(o.suspense.vnode.el=o.el=r,e=o),o===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var ks={},As=()=>Object.create(ks),Vs=e=>Object.getPrototypeOf(e)===ks;function lc(e,t,n,r=!1){let o={},i=As();e.propsDefaults=Object.create(null),Ms(e,t,o,i);for(let s in e.propsOptions[0])s in o||(o[s]=void 0);n?e.props=r?o:lo(o):e.type.props?e.props=o:e.props=i,e.attrs=i}function cc(e,t,n,r){let{props:o,attrs:i,vnode:{patchFlag:s}}=e,a=F(o),[c]=e.propsOptions,f=!1;if((r||s>0)&&!(s&16)){if(s&8){let u=e.vnode.dynamicProps;for(let p=0;p<u.length;p++){let C=u[p];if(Or(e.emitsOptions,C))continue;let E=t[C];if(c)if(L(i,C))E!==i[C]&&(i[C]=E,f=!0);else{let v=ge(C);o[v]=vo(c,a,v,E,e,!1)}else E!==i[C]&&(i[C]=E,f=!0)}}}else{Ms(e,t,o,i)&&(f=!0);let u;for(let p in a)(!t||!L(t,p)&&((u=tt(p))===p||!L(t,u)))&&(c?n&&(n[p]!==void 0||n[u]!==void 0)&&(o[p]=vo(c,a,p,void 0,e,!0)):delete o[p]);if(i!==a)for(let p in i)(!t||!L(t,p))&&(delete i[p],f=!0)}f&&Ke(e.attrs,"set","")}function Ms(e,t,n,r){let[o,i]=e.propsOptions,s=!1,a;if(t)for(let c in t){if(Ft(c))continue;let f=t[c],u;o&&L(o,u=ge(c))?!i||!i.includes(u)?n[u]=f:(a||(a={}))[u]=f:Or(e.emitsOptions,c)||(!(c in r)||f!==r[c])&&(r[c]=f,s=!0)}if(i){let c=F(n),f=a||K;for(let u=0;u<i.length;u++){let p=i[u];n[p]=vo(o,c,p,f[p],e,!L(f,p))}}return s}function vo(e,t,n,r,o,i){let s=e[n];if(s!=null){let a=L(s,"default");if(a&&r===void 0){let c=s.default;if(s.type!==Function&&!s.skipFactory&&P(c)){let{propsDefaults:f}=o;if(n in f)r=f[n];else{let u=Pn(o);r=f[n]=c.call(null,t),u()}}else r=c;o.ce&&o.ce._setProp(n,r)}s[0]&&(i&&!a?r=!1:s[1]&&(r===""||r===tt(n))&&(r=!0))}return r}var dc=new WeakMap;function Rs(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?dc:t.propsCache,o=r.get(e);if(o)return o;let i=e.props,s={},a=[],c=!1;if(__VUE_OPTIONS_API__&&!P(e)){let u=p=>{c=!0;let[C,E]=Rs(p,t,!0);ne(s,C),E&&a.push(...E)};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!i&&!c)return z(e)&&r.set(e,wt),wt;if(R(i))for(let u=0;u<i.length;u++){let p=ge(i[u]);rs(p)&&(s[p]=K)}else if(i)for(let u in i){let p=ge(u);if(rs(p)){let C=i[u],E=s[p]=R(C)||P(C)?{type:C}:ne({},C),v=E.type,D=!1,W=!0;if(R(v))for(let J=0;J<v.length;++J){let M=v[J],I=P(M)&&M.name;if(I==="Boolean"){D=!0;break}else I==="String"&&(W=!1)}else D=P(v)&&v.name==="Boolean";E[0]=D,E[1]=W,(D||L(E,"default"))&&a.push(p)}}let f=[s,a];return z(e)&&r.set(e,f),f}function rs(e){return e[0]!=="$"&&!Ft(e)}var Oo=e=>e==="_"||e==="_ctx"||e==="$stable",So=e=>R(e)?e.map(Xe):[Xe(e)],uc=(e,t,n)=>{if(t._n)return t;let r=kl((...o)=>So(t(...o)),n);return r._c=!1,r},Ps=(e,t,n)=>{let r=e._ctx;for(let o in e){if(Oo(o))continue;let i=e[o];if(P(i))t[o]=uc(o,i,r);else if(i!=null){let s=So(i);t[o]=()=>s}}},Is=(e,t)=>{let n=So(t);e.slots.default=()=>n},$s=(e,t,n)=>{for(let r in t)(n||!Oo(r))&&(e[r]=t[r])},fc=(e,t,n)=>{let r=e.slots=As();if(e.vnode.shapeFlag&32){let o=t._;o?($s(r,t,n),n&&Ht(r,"_",o,!0)):Ps(t,r)}else t&&Is(e,t)},pc=(e,t,n)=>{let{vnode:r,slots:o}=e,i=!0,s=K;if(r.shapeFlag&32){let a=t._;a?n&&a===1?i=!1:$s(o,t,n):(i=!t.$stable,Ps(t,o)),s=t}else t&&(Is(e,t),s={default:1});if(i)for(let a in o)!Oo(a)&&s[a]==null&&delete o[a]};function hc(){let e=[];typeof __VUE_OPTIONS_API__!="boolean"&&(ht().__VUE_OPTIONS_API__=!0),typeof __VUE_PROD_DEVTOOLS__!="boolean"&&(ht().__VUE_PROD_DEVTOOLS__=!1),typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__!="boolean"&&(ht().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__=!1)}var Ce=_c;function Ls(e){return mc(e)}function mc(e,t){hc();let n=ht();n.__VUE__=!0,__VUE_PROD_DEVTOOLS__&&ms(n.__VUE_DEVTOOLS_GLOBAL_HOOK__,n);let{insert:r,remove:o,patchProp:i,createElement:s,createText:a,createComment:c,setText:f,setElementText:u,parentNode:p,nextSibling:C,setScopeId:E=me,insertStaticContent:v}=e,D=(l,d,h,_=null,m=null,y=null,x=void 0,w=null,b=!!d.dynamicChildren)=>{if(l===d)return;l&&!vn(l,d)&&(_=le(l),Ae(l,m,y,!0),l=null),d.patchFlag===-2&&(b=!1,d.dynamicChildren=null),d.dynamicChildren&&l&&l.dynamicChildren&&l.dynamicChildren.hasOnce&&(d.dynamicChildren===wt&&(d.dynamicChildren=[]),d.dynamicChildren.hasOnce=!0);let{type:g,ref:A,shapeFlag:N}=d;switch(g){case Rn:W(l,d,h,_);break;case _t:J(l,d,h,_);break;case On:l==null&&M(d,h,_,x);break;case He:bt(l,d,h,_,m,y,x,w,b);break;default:N&1?Q(l,d,h,_,m,y,x,w,b):N&6?Jt(l,d,h,_,m,y,x,w,b):(N&64||N&128)&&g.process(l,d,h,_,m,y,x,w,b,dt)}A!=null&&m?Cn(A,l&&l.ref,y,d||l,!d):A==null&&l&&l.ref!=null&&Cn(l.ref,null,y,l,!0)},W=(l,d,h,_)=>{if(l==null)r(d.el=a(d.children),h,_);else{let m=d.el=l.el;d.children!==l.children&&f(m,d.children)}},J=(l,d,h,_)=>{l==null?r(d.el=c(d.children||""),h,_):d.el=l.el},M=(l,d,h,_)=>{[l.el,l.anchor]=v(l.children,d,h,_,l.el,l.anchor)},I=(l,d,h,_)=>{if(d.children!==l.children){let m=C(l.anchor);S(l),[d.el,d.anchor]=v(d.children,h,m,_)}else d.el=l.el,d.anchor=l.anchor},Z=({el:l,anchor:d},h,_)=>{let m;for(;l&&l!==d;)m=C(l),r(l,h,_),l=m;r(d,h,_)},S=({el:l,anchor:d})=>{let h;for(;l&&l!==d;)h=C(l),o(l),l=h;o(d)},Q=(l,d,h,_,m,y,x,w,b)=>{if(d.type==="svg"?x="svg":d.type==="math"&&(x="mathml"),l==null)pe(d,h,_,m,y,x,w,b);else{let g=l.el&&l.el._isVueCE?l.el:null;try{g&&g._beginPatch(),Ue(l,d,m,y,x,w,b)}finally{g&&g._endPatch()}}},pe=(l,d,h,_,m,y,x,w)=>{let b,g,{props:A,shapeFlag:N,transition:T,dirs:V}=l;if(b=l.el=s(l.type,y,A&&A.is,A),N&8?u(b,l.children):N&16&&ve(l.children,b,null,_,m,go(l,y),x,w),V&&Nt(l,null,_,"created"),Ee(b,l,l.scopeId,x,_),A){for(let Y in A)Y!=="value"&&!Ft(Y)&&i(b,Y,null,A[Y],y,_);"value"in A&&i(b,"value",null,A.value,y),(g=A.onVnodeBeforeMount)&&qe(g,_,l)}__VUE_PROD_DEVTOOLS__&&(Ht(b,"__vnode",l,!0),Ht(b,"__vueParentComponent",_,!0)),V&&Nt(l,null,_,"beforeMount");let $=gc(m,T);$&&T.beforeEnter(b),r(b,d,h),((g=A&&A.onVnodeMounted)||$||V)&&Ce(()=>{let B;g&&qe(g,_,l),$&&T.enter(b),V&&Nt(l,null,_,"mounted")},m)},Ee=(l,d,h,_,m)=>{if(h&&E(l,h),_)for(let y=0;y<_.length;y++)E(l,_[y]);if(m){let y=m.subTree;if(d===y||js(y.type)&&(y.ssContent===d||y.ssFallback===d)){let x=m.vnode;Ee(l,x,x.scopeId,x.slotScopeIds,m.parent)}}},ve=(l,d,h,_,m,y,x,w,b=0)=>{for(let g=b;g<l.length;g++){let A=l[g]=w?it(l[g]):Xe(l[g]);D(null,A,d,h,_,m,y,x,w)}},Ue=(l,d,h,_,m,y,x)=>{let w=d.el=l.el;__VUE_PROD_DEVTOOLS__&&(w.__vnode=d);let{patchFlag:b,dynamicChildren:g,dirs:A}=d;b|=l.patchFlag&16;let N=l.props||K,T=d.props||K,V;if(h&&Dt(h,!1),(V=T.onVnodeBeforeUpdate)&&qe(V,h,d,l),A&&Nt(d,l,h,"beforeUpdate"),h&&Dt(h,!0),g&&(!l.dynamicChildren||l.dynamicChildren.length!==g.length)&&(b=0,x=!1,g=null),(N.innerHTML&&T.innerHTML==null||N.textContent&&T.textContent==null)&&u(w,""),g?je(l.dynamicChildren,g,w,h,_,go(d,m),y):x||we(l,d,w,null,h,_,go(d,m),y,!1),b>0){if(b&16)Te(w,N,T,h,m);else if(b&2&&N.class!==T.class&&i(w,"class",null,T.class,m),b&4&&i(w,"style",N.style,T.style,m),b&8){let $=d.dynamicProps;for(let Y=0;Y<$.length;Y++){let B=$[Y],ie=N[B],se=T[B];(se!==ie||B==="value")&&i(w,B,ie,se,m,h)}}b&1&&l.children!==d.children&&u(w,d.children)}else!x&&g==null&&Te(w,N,T,h,m);((V=T.onVnodeUpdated)||A)&&Ce(()=>{V&&qe(V,h,d,l),A&&Nt(d,l,h,"updated")},_)},je=(l,d,h,_,m,y,x)=>{for(let w=0;w<d.length;w++){let b=l[w],g=d[w],A=b.el&&(b.type===He||!vn(b,g)||b.shapeFlag&198)?p(b.el):h;D(b,g,A,null,_,m,y,x,!0)}},Te=(l,d,h,_,m)=>{if(d!==h){if(d!==K)for(let y in d)!Ft(y)&&!(y in h)&&i(l,y,d[y],null,m,_);for(let y in h){if(Ft(y))continue;let x=h[y],w=d[y];x!==w&&y!=="value"&&i(l,y,w,x,m,_)}"value"in h&&i(l,"value",d.value,h.value,m)}},bt=(l,d,h,_,m,y,x,w,b)=>{let g=d.el=l?l.el:a(""),A=d.anchor=l?l.anchor:a(""),{patchFlag:N,dynamicChildren:T,slotScopeIds:V}=d;V&&(w=w?w.concat(V):V),l==null?(r(g,h,_),r(A,h,_),ve(d.children||[],h,A,m,y,x,w,b)):N>0&&N&64&&T&&l.dynamicChildren&&l.dynamicChildren.length===T.length?(je(l.dynamicChildren,T,h,m,y,x,w),(d.key!=null||m&&d===m.subTree)&&Fs(l,d,!0)):we(l,d,h,A,m,y,x,w,b)},Jt=(l,d,h,_,m,y,x,w,b)=>{d.slotScopeIds=w,l==null?d.shapeFlag&512?m.ctx.activate(d,h,_,x,b):St(d,h,_,m,y,x,b):de(l,d,b)},St=(l,d,h,_,m,y,x)=>{let w=l.component=Oc(l,_,m);if(Co(l)&&(w.ctx.renderer=dt),Sc(w,!1,x),w.asyncDep){if(m&&m.registerDep(w,X,x),!l.el){let b=w.subTree=Me(_t);J(null,b,d,h),l.placeholder=b.el}}else X(w,l,d,h,m,y,x)},de=(l,d,h)=>{let _=d.component=l.component;if(sc(l,d,h))if(_.asyncDep&&!_.asyncResolved){d.el=l.el,U(_,d,h);return}else _.next=d,_.update();else d.el=l.el,_.vnode=d},X=(l,d,h,_,m,y,x)=>{let w=()=>{if(l.isMounted){let{next:N,bu:T,u:V,parent:$,vnode:Y}=l;{let Ne=Hs(l);if(Ne){N&&(N.el=Y.el,U(l,N,x)),Ne.asyncDep.then(()=>{Ce(()=>{l.isUnmounted||g()},m)});return}}let B=N,ie;Dt(l,!1),N?(N.el=Y.el,U(l,N,x)):N=Y,T&&cn(T),(ie=N.props&&N.props.onVnodeBeforeUpdate)&&qe(ie,$,N,Y),Dt(l,!0);let se=mo(l),Pe=l.subTree;l.subTree=se,D(Pe,se,p(Pe.el),le(Pe),l,m,y),N.el=se.el,B===null&&ac(l,se.el),V&&Ce(V,m),(ie=N.props&&N.props.onVnodeUpdated)&&Ce(()=>qe(ie,$,N,Y),m),__VUE_PROD_DEVTOOLS__&&gs(l)}else{let N,{el:T,props:V}=d,{bm:$,m:Y,parent:B,root:ie,type:se}=l,Pe=Nn(d);if(Dt(l,!1),$&&cn($),!Pe&&(N=V&&V.onVnodeBeforeMount)&&qe(N,B,d),Dt(l,!0),T&&Rr){let Ne=()=>{l.subTree=mo(l),Rr(T,l.subTree,l,m,null)};Pe&&se.__asyncHydrate?se.__asyncHydrate(T,l,Ne):Ne()}else{ie.ce&&ie.ce._hasShadowRoot()&&ie.ce._injectChildStyle(se,l.parent?l.parent.type:void 0);let Ne=l.subTree=mo(l);D(null,Ne,h,_,l,m,y),d.el=Ne.el}if(Y&&Ce(Y,m),!Pe&&(N=V&&V.onVnodeMounted)){let Ne=d;Ce(()=>qe(N,B,Ne),m)}(d.shapeFlag&256||B&&Nn(B.vnode)&&B.vnode.shapeFlag&256)&&l.a&&Ce(l.a,m),l.isMounted=!0,__VUE_PROD_DEVTOOLS__&&Dl(l),d=h=_=null}};l.scope.on();let b=l.effect=new Wt(w);l.scope.off();let g=l.update=b.run.bind(b),A=l.job=b.runIfDirty.bind(b);A.i=l,A.id=l.uid,b.scheduler=()=>wo(A),Dt(l,!0),g()},U=(l,d,h)=>{d.component=l;let _=l.vnode.props;l.vnode=d,l.next=null,cc(l,d.props,_,h),pc(l,d.children,h),Ye(),qi(l),Ge()},we=(l,d,h,_,m,y,x,w,b=!1)=>{let g=l&&l.children,A=l?l.shapeFlag:0,N=d.children,{patchFlag:T,shapeFlag:V}=d;if(T>0){if(T&128){ct(g,N,h,_,m,y,x,w,b);return}else if(T&256){Tt(g,N,h,_,m,y,x,w,b);return}}V&8?(A&16&&oe(g,m,y),N!==g&&u(h,N)):A&16?V&16?ct(g,N,h,_,m,y,x,w,b):oe(g,m,y,!0):(A&8&&u(h,""),V&16&&ve(N,h,_,m,y,x,w,b))},Tt=(l,d,h,_,m,y,x,w,b)=>{l=l||wt,d=d||wt;let g=l.length,A=d.length,N=Math.min(g,A),T;for(T=0;T<N;T++){let V=d[T]=b?it(d[T]):Xe(d[T]);D(l[T],V,h,null,m,y,x,w,b)}g>A?oe(l,m,y,!0,!1,N):ve(d,h,_,m,y,x,w,b,N)},ct=(l,d,h,_,m,y,x,w,b)=>{let g=0,A=d.length,N=l.length-1,T=A-1;for(;g<=N&&g<=T;){let V=l[g],$=d[g]=b?it(d[g]):Xe(d[g]);if(vn(V,$))D(V,$,h,null,m,y,x,w,b);else break;g++}for(;g<=N&&g<=T;){let V=l[N],$=d[T]=b?it(d[T]):Xe(d[T]);if(vn(V,$))D(V,$,h,null,m,y,x,w,b);else break;N--,T--}if(g>N){if(g<=T){let V=T+1,$=V<A?d[V].el:_;for(;g<=T;)D(null,d[g]=b?it(d[g]):Xe(d[g]),h,$,m,y,x,w,b),g++}}else if(g>T)for(;g<=N;)Ae(l[g],m,y,!0),g++;else{let V=g,$=g,Y=new Map;for(g=$;g<=T;g++){let De=d[g]=b?it(d[g]):Xe(d[g]);De.key!=null&&Y.set(De.key,g)}let B,ie=0,se=T-$+1,Pe=!1,Ne=0,Zt=new Array(se);for(g=0;g<se;g++)Zt[g]=0;for(g=V;g<=N;g++){let De=l[g];if(ie>=se){Ae(De,m,y,!0);continue}let We;if(De.key!=null)We=Y.get(De.key);else for(B=$;B<=T;B++)if(Zt[B-$]===0&&vn(De,d[B])){We=B;break}We===void 0?Ae(De,m,y,!0):(Zt[We-$]=g+1,We>=Ne?Ne=We:Pe=!0,D(De,d[We],h,null,m,y,x,w,b),ie++)}let $o=Pe?yc(Zt):wt;for(B=$o.length-1,g=se-1;g>=0;g--){let De=$+g,We=d[De],Lo=d[De+1],Fo=De+1<A?Lo.el||Us(Lo):_;Zt[g]===0?D(null,We,h,Fo,m,y,x,w,b):Pe&&(B<0||g!==$o[B]?ke(We,h,Fo,2):B--)}}},ke=(l,d,h,_,m=null)=>{let{el:y,type:x,transition:w,children:b,shapeFlag:g}=l;if(g&6){ke(l.component.subTree,d,h,_);return}if(g&128){l.suspense.move(d,h,_);return}if(g&64){x.move(l,d,h,dt);return}if(x===He){r(y,d,h);for(let N=0;N<b.length;N++)ke(b[N],d,h,_);r(l.anchor,d,h);return}if(x===On){Z(l,d,h);return}if(_!==2&&g&1&&w)if(_===0)w.persisted&&!y[po]?r(y,d,h):(w.beforeEnter(y),r(y,d,h),Ce(()=>w.enter(y),m));else{let{leave:N,delayLeave:T,afterLeave:V}=w,$=()=>{l.ctx.isUnmounted?o(y):r(y,d,h)},Y=()=>{let B=y._isLeaving||!!y[po];y._isLeaving&&y[po](!0),w.persisted&&!B?$():N(y,()=>{$(),V&&V()})};T?T(y,$,Y):Y()}else r(y,d,h)},Ae=(l,d,h,_=!1,m=!1)=>{let{type:y,props:x,ref:w,children:b,dynamicChildren:g,shapeFlag:A,patchFlag:N,dirs:T,cacheIndex:V,memo:$}=l;if((N===-2||g&&g.hasOnce)&&(m=!1),w!=null&&(Ye(),Cn(w,null,h,l,!0),Ge()),V!=null&&(!l.ctx||l.ctx===d)&&(d.renderCache[V]=void 0),A&256){d.ctx.deactivate(l);return}let Y=A&1&&T,B=!Nn(l),ie;if(B&&(ie=x&&x.onVnodeBeforeUnmount)&&qe(ie,d,l),A&6)j(l.component,h,_);else{if(A&128){l.suspense.unmount(h,_);return}Y&&Nt(l,null,d,"beforeUnmount"),A&64?l.type.remove(l,d,h,dt,_):g&&!g.hasOnce&&(y!==He||N>0&&N&64)?oe(g,d,h,!1,!0):(y===He&&N&384||!m&&A&16)&&oe(b,d,h),_&&Xt(l)}let se=$!=null&&V==null;(B&&(ie=x&&x.onVnodeUnmounted)||Y||se)&&Ce(()=>{ie&&qe(ie,d,l),Y&&Nt(l,null,d,"unmounted"),se&&(l.el=null)},h)},Xt=l=>{let{type:d,el:h,anchor:_,transition:m}=l;if(d===He){k(h,_);return}if(d===On){S(l),m&&!m.persisted&&m.afterLeave&&m.afterLeave();return}let y=()=>{o(h),m&&!m.persisted&&m.afterLeave&&m.afterLeave()};if(l.shapeFlag&1&&m&&!m.persisted){let{leave:x,delayLeave:w}=m,b=()=>x(h,y);w?w(l.el,y,b):b()}else y()},k=(l,d)=>{let h;for(;l!==d;)h=C(l),o(l),l=h;o(d)},j=(l,d,h)=>{let{bum:_,scope:m,job:y,subTree:x,um:w,m:b,a:g}=l;os(b),os(g),_&&cn(_),m.stop(),y?(y.flags|=8,Ae(x,l,d,h)):l.vnode.el&&x&&(x.transition=l.vnode.transition,Ae(x,l,d,h)),w&&Ce(w,d),Ce(()=>{l.isUnmounted=!0},d),__VUE_PROD_DEVTOOLS__&&Sl(l)},oe=(l,d,h,_=!1,m=!1,y=0)=>{for(let x=y;x<l.length;x++)Ae(l[x],d,h,_,m)},le=l=>{if(l.shapeFlag&6)return le(l.component.subTree);if(l.shapeFlag&128)return l.suspense.next();let d=C(l.anchor||l.el),h=d&&d[Pl];return h?C(h):d},kt=!1,Ln=(l,d,h)=>{let _;l==null?d._vnode&&(Ae(d._vnode,null,null,!0),_=d._vnode.component):D(d._vnode||null,l,d,null,null,null,h),d._vnode=l,kt||(kt=!0,qi(_),ps(),kt=!1)},dt={p:D,um:Ae,m:ke,r:Xt,mt:St,mc:ve,pc:we,pbc:je,n:le,o:e},Mr,Rr;return t&&([Mr,Rr]=t(dt)),{render:Ln,hydrate:Mr,createApp:ec(Ln,Mr)}}function go({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Dt({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function gc(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Fs(e,t,n=!1){let r=e.children,o=t.children;if(R(r)&&R(o))for(let i=0;i<r.length;i++){let s=r[i],a=o[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[i]=it(o[i]),a.el=s.el),!n&&a.patchFlag!==-2&&Fs(s,a)),a.type===Rn&&(a.patchFlag===-1&&(a=o[i]=it(a)),a.el=s.el),a.type===_t&&!a.el&&(a.el=s.el)}}function yc(e){let t=e.slice(),n=[0],r,o,i,s,a,c=e.length;for(r=0;r<c;r++){let f=e[r];if(f!==0){if(o=n[n.length-1],e[o]<f){t[r]=o,n.push(r);continue}for(i=0,s=n.length-1;i<s;)a=i+s>>1,e[n[a]]<f?i=a+1:s=a;f<e[n[i]]&&(i>0&&(t[r]=n[i-1]),n[i]=r)}}for(i=n.length,s=n[i-1];i-- >0;)n[i]=s,s=t[s];return n}function Hs(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Hs(t)}function os(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Us(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?Us(t.subTree):null}var js=e=>e.__isSuspense;function _c(e,t){t&&t.pendingBranch?R(e)?t.effects.push(...e):t.effects.push(e):fs(e)}var He=Symbol.for("v-fgt"),Rn=Symbol.for("v-txt"),_t=Symbol.for("v-cmt"),On=Symbol.for("v-stc"),Gt=[],st=null;function bc(){Gt.pop(),st=Gt[Gt.length-1]||null}var To=1;function _r(e,t=!1){To+=e,e<0&&st&&t&&(st.hasOnce=!0)}function br(e){return e?e.__v_isVNode===!0:!1}function vn(e,t){return e.type===t.type&&e.key===t.key}var Ws=({key:e})=>e??null,pr=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?te(e)||ce(e)||P(e)?{i:Qe,r:e,k:t,f:!!n}:e:null);function Ec(e,t=null,n=null,r=0,o=null,i=e===He?0:1,s=!1,a=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Ws(t),ref:t&&pr(t),scopeId:ys,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:Qe};return a?(Er(c,n),i&128&&e.normalize(c)):n&&(c.shapeFlag|=te(n)?8:16),To>0&&!s&&st&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&st.push(c),c}var Me=vc;function vc(e,t=null,n=null,r=0,o=null,i=!1){if((!e||e===Kl)&&(e=_t),br(e)){let a=qt(e,t,!0);return n&&Er(a,n),To>0&&!i&&st&&(a.shapeFlag&6?st[st.indexOf(e)]=a:st.push(a)),a.patchFlag=-2,a}if(Vc(e)&&(e=e.__vccOpts),t){t=wc(t);let{class:a,style:c}=t;a&&!te(a)&&(t.class=un(a)),z(c)&&(En(c)&&!R(c)&&(c=ne({},c)),t.style=dn(c))}let s=te(e)?1:js(e)?128:Cr(e)?64:z(e)?4:P(e)?2:0;return Ec(e,t,n,r,o,s,i,!0)}function wc(e){return e?En(e)||Vs(e)?ne({},e):e:null}function qt(e,t,n=!1,r=!1){let{props:o,ref:i,patchFlag:s,children:a,transition:c}=e,f=t?Cc(o||{},t):o,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:f,key:f&&Ws(f),ref:t&&t.ref?n&&i?R(i)?i.concat(pr(t)):[i,pr(t)]:pr(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==He?s===-1?16:s|16:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&qt(e.ssContent),ssFallback:e.ssFallback&&qt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&Nr(u,c.clone(u)),u}function xc(e=" ",t=0){return Me(Rn,null,e,t)}function Xe(e){return e==null||typeof e=="boolean"?Me(_t):R(e)?Me(He,null,e.slice()):br(e)?it(e):Me(Rn,null,String(e))}function it(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:qt(e)}function Er(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(R(t))n=16;else if(typeof t=="object")if(r&65){let o=t.default;o&&(o._c&&(o._d=!1),Er(e,o()),o._c&&(o._d=!0));return}else{n=32;let o=t._;!o&&!Vs(t)?t._ctx=Qe:o===3&&Qe&&(Qe.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(P(t)){if(r&65){Er(e,{default:t});return}t={default:t,_ctx:Qe},n=32}else t=String(t),r&64?(n=16,t=[xc(t)]):n=8;e.children=t,e.shapeFlag|=n}function Cc(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let o in r)if(o==="class")t.class!==r.class&&(t.class=un([t.class,r.class]));else if(o==="style")t.style=dn([t.style,r.style]);else if($t(o)){let i=t[o],s=r[o];s&&i!==s&&!(R(i)&&i.includes(s))?t[o]=i?[].concat(i,s):s:s==null&&i==null&&!Lt(o)&&(t[o]=s)}else o!==""&&(t[o]=r[o])}return t}function qe(e,t,n,r=null){Re(e,t,7,[n,r])}var Nc=Os(),Dc=0;function Oc(e,t,n){let r=e.type,o=(t?t.appContext:e.appContext)||Nc,i={uid:Dc++,vnode:e,type:r,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new mn(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Rs(r,o),emitsOptions:Ss(r,o),emit:null,emitted:null,propsDefaults:K,inheritAttrs:r.inheritAttrs,ctx:K,data:K,props:K,attrs:K,slots:K,refs:K,setupState:K,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=nc.bind(null,i),e.ce&&e.ce(i),i}var be=null,Bs=()=>be||Qe,vr,Tn;{let e=ht(),t=(n,r)=>{let o;return(o=e[n])||(o=e[n]=[]),o.push(r),i=>{o.length>1?o.forEach(s=>s(i)):o[0](i)}};vr=t("__VUE_INSTANCE_SETTERS__",n=>be=n),Tn=t("__VUE_SSR_SETTERS__",n=>kn=n)}var Pn=e=>{let t=be;return vr(e),e.scope.on(),()=>{e.scope.off(),vr(t)}},is=()=>{be&&be.scope.off(),vr(null)};function zs(e){return e.vnode.shapeFlag&4}var kn=!1;function Sc(e,t=!1,n=!1){t&&Tn(t);let{props:r,children:o}=e.vnode,i=zs(e);lc(e,r,i,t),fc(e,o,n||t);let s=i?Tc(e,t):void 0;return t&&Tn(!1),s}function Tc(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Yl);let{setup:r}=n;if(r){Ye();let o=e.setupContext=r.length>1?Ac(e):null,i=Pn(e),s=An(r,e,0,[e.props,o]),a=Wr(s);if(Ge(),i(),(a||e.sp)&&!Nn(e)&&vs(e),a){if(s.then(is,is),t)return s.then(c=>{Tn(!0);try{ss(e,c,t)}finally{Tn(!1)}}).catch(c=>{wr(c,e,0)});e.asyncDep=s}else ss(e,s,t)}else Ks(e,t)}function ss(e,t,n){P(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:z(t)&&(__VUE_PROD_DEVTOOLS__&&(e.devtoolsRawSetupState=t),e.setupState=ur(t)),Ks(e,n)}var as,ls;function Ks(e,t,n){let r=e.type;if(!e.render){if(!t&&as&&!r.render){let o=r.template||__VUE_OPTIONS_API__&&Do(e).template;if(o){let{isCustomElement:i,compilerOptions:s}=e.appContext.config,{delimiters:a,compilerOptions:c}=r,f=ne(ne({isCustomElement:i,delimiters:a},s),c);r.render=as(o,f)}}e.render=r.render||me,ls&&ls(e)}if(__VUE_OPTIONS_API__){let o=Pn(e);Ye();try{Gl(e)}finally{Ge(),o()}}}var kc={get(e,t){return fe(e,"get",""),e[t]}};function Ac(e){let t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,kc),slots:e.slots,emit:e.emit,expose:t}}function ko(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(ur(uo(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Dn)return Dn[n](e)},has(t,n){return n in t||n in Dn}})):e.proxy}function Vc(e){return P(e)&&"__vccOpts"in e}var Ot=(e,t)=>Ki(e,t,kn);function O(e,t,n){try{_r(-1);let r=arguments.length;return r===2?z(t)&&!R(t)?br(t)?Me(e,null,[t]):Me(e,t):Me(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&br(n)&&(n=[n]),Me(e,t,n))}finally{_r(1)}}var cs="3.5.43";var Mo,Ys=typeof window<"u"&&window.trustedTypes;if(Ys)try{Mo=Ys.createPolicy("vue",{createHTML:e=>e})}catch{}var ra=Mo?e=>Mo.createHTML(e):e=>e,Mc="http://www.w3.org/2000/svg",Rc="http://www.w3.org/1998/Math/MathML",lt=typeof document<"u"?document:null,Gs=lt&&lt.createElement("template"),Pc={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let o=t==="svg"?lt.createElementNS(Mc,e):t==="mathml"?lt.createElementNS(Rc,e):n?lt.createElement(e,{is:n}):lt.createElement(e);return e==="select"&&r&&r.multiple!=null&&o.setAttribute("multiple",r.multiple),o},createText:e=>lt.createTextNode(e),createComment:e=>lt.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>lt.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,o,i){let s=n?n.previousSibling:t.lastChild;if(o&&(o===i||o.nextSibling))for(;t.insertBefore(o.cloneNode(!0),n),!(o===i||!(o=o.nextSibling)););else{Gs.innerHTML=ra(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);let a=Gs.content;if(r==="svg"||r==="mathml"){let c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}t.insertBefore(a,n)}return[s?s.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};var Ic=Symbol("_vtc");function $c(e,t,n){let r=e[Ic];r&&(t=(t?[t,...r]:[...r]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}var qs=Symbol("_vod"),Lc=Symbol("_vsh");var Fc=Symbol("");var Hc=/(?:^|;)\s*display\s*:/;function Uc(e,t,n){let r=e.style,o=te(n),i=!1;if(n&&!o){if(t)if(te(t))for(let s of t.split(";")){let a=s.slice(0,s.indexOf(":")).trim();n[a]==null&&In(r,a,"")}else for(let s in t)n[s]==null&&In(r,s,"");for(let s in n){s==="display"&&(i=!0);let a=n[s];a!=null?Wc(e,s,!te(t)&&t?t[s]:void 0,a)||In(r,s,a):In(r,s,"")}}else if(o){if(t!==n){let s=r[Fc];s&&(n+=";"+s),r.cssText=n,i=Hc.test(n)}}else t&&e.removeAttribute("style");qs in e&&(e[qs]=i?r.display:"",e[Lc]&&(r.display="none"))}var Sr=/\s*!important$/;function In(e,t,n){if(R(n))n.forEach(r=>In(e,t,r));else if(n==null&&(n=""),t.startsWith("--"))Sr.test(n)?e.setProperty(t,n.replace(Sr,""),"important"):e.setProperty(t,n);else{let r=jc(e,t);Sr.test(n)?e.setProperty(tt(r),n.replace(Sr,""),"important"):e[r]=n}}var Js=["Webkit","Moz","ms"],Ao={};function jc(e,t){let n=Ao[t];if(n)return n;let r=ge(t);if(r!=="filter"&&r in e)return Ao[t]=r;r=an(r);for(let o=0;o<Js.length;o++){let i=Js[o]+r;if(i in e)return Ao[t]=i}return t}function Wc(e,t,n,r){return e.tagName==="TEXTAREA"&&(t==="width"||t==="height")&&te(r)&&n===r}var Xs="http://www.w3.org/1999/xlink";function Zs(e,t,n,r,o,i=ki(t)){r&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(Xs,t.slice(6,t.length)):e.setAttributeNS(Xs,t,n):n==null||i&&!tr(n)?e.removeAttribute(t):e.setAttribute(t,i?"":Ie(n)?String(n):n)}function Qs(e,t,n,r,o){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?ra(n):n);return}let i=e.tagName;if(t==="value"&&i!=="PROGRESS"&&!i.includes("-")){let a=i==="OPTION"?e.getAttribute("value")||"":e.value,c=n==null?e.type==="checkbox"?"on":"":String(n);(a!==c||!("_value"in e))&&(e.value=c),n==null&&e.removeAttribute(t),e._value=n;return}let s=!1;if(n===""||n==null){let a=typeof e[t];a==="boolean"?n=tr(n):n==null&&a==="string"?(n="",s=!0):a==="number"&&(n=0,s=!0)}try{e[t]=n}catch{}s&&e.removeAttribute(o||t)}function Bc(e,t,n,r){e.addEventListener(t,n,r)}function zc(e,t,n,r){e.removeEventListener(t,n,r)}var ea=Symbol("_vei");function Kc(e,t,n,r,o=null){let i=e[ea]||(e[ea]={}),s=i[t];if(r&&s)s.value=r;else{let[a,c]=qc(t);if(r){let f=i[t]=Zc(r,o);Bc(e,a,f,c)}else s&&(zc(e,a,s,c),i[t]=void 0)}}var Yc=/(Once|Passive|Capture)$/,Gc=/^on:?(?:Once|Passive|Capture)$/;function qc(e){let t,n;for(;(n=e.match(Yc))&&!Gc.test(e);)t||(t={}),e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===":"?e.slice(3):tt(e.slice(2)),t]}var Vo=0,Jc=Promise.resolve(),Xc=()=>Vo||(Jc.then(()=>Vo=0),Vo=Date.now());function Zc(e,t){let n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;let o=n.value;if(R(o)){let i=r.stopImmediatePropagation;r.stopImmediatePropagation=()=>{i.call(r),r._stopped=!0};let s=o.slice(),a=[r];for(let c=0;c<s.length&&!r._stopped;c++){let f=s[c];f&&Re(f,t,5,a)}}else Re(o,t,5,[r])};return n.value=e,n.attached=Xc(),n}var ta=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Qc=(e,t,n,r,o,i)=>{let s=o==="svg";t==="class"?$c(e,r,s):t==="style"?Uc(e,n,r):$t(t)?Lt(t)||Kc(e,t,n,r,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):ed(e,t,r,s))?(Qs(e,t,r),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Zs(e,t,r,s,i,t!=="value")):e._isVueCE&&(td(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!te(r)))?Qs(e,ge(t),r,i,t):(t==="true-value"?e._trueValue=r:t==="false-value"&&(e._falseValue=r),Zs(e,t,r,s))};function ed(e,t,n,r){if(r)return!!(t==="innerHTML"||t==="textContent"||t in e&&ta(t)&&P(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){let o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return ta(t)&&te(n)?!1:t in e}function td(e,t){let n=e._def.props;if(!n)return!1;let r=ge(t);return Array.isArray(n)?n.some(o=>ge(o)===r):Object.keys(n).some(o=>ge(o)===r)}var nd=ne({patchProp:Qc},Pc),na;function rd(){return na||(na=Ls(nd))}var oa=((...e)=>{let t=rd().createApp(...e),{mount:n}=t;return t.mount=r=>{let o=id(r);if(!o)return;let i=t._component;!P(i)&&!i.render&&!i.template&&(i.template=o.innerHTML),o.nodeType===1&&(o.textContent="");let s=n(o,!1,od(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),s},t});function od(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function id(e){return te(e)?document.querySelector(e):e}var aa={festival:"\u8282\u5E86",event:"\u4E8B\u4EF6",appointment:"\u9080\u7EA6",class:"\u8BFE\u7A0B",reminder:"\u63D0\u9192",birthday:"\u751F\u65E5",anniversary:"\u7EAA\u5FF5",history:"\u5386\u53F2"};function sd(e){return Array.from({length:e},(t,n)=>String(n+1))}function Ro(e){return e?String(e.hour).padStart(2,"0")+":"+String(e.minute).padStart(2,"0"):""}function ia(e,t){return e.year===t.year&&e.month===t.month&&e.day===t.day}function la(e){if(e.allDay)return"\u5168\u5929";let t=Ro(e.start.time),n=Ro(e.end?.time);return e.end&&ia(e.start.date,e.end.date)&&t&&n?t+"\u2013"+n:e.end&&!ia(e.start.date,e.end.date)?"\u8DE8\u65E5 \xB7 "+(t||"\u5B9A\u65F6"):t||"\u5B9A\u65F6"}function sa(e){return e.date.year+"\u5E74"+e.date.month+"\u6708"+e.date.day+"\u65E5"+(e.time?" "+Ro(e.time):"")}function ad(e,t){let n=e.occurrences.slice(0,t),r=e.occurrences.length-n.length;return O("span",{class:"cc-month-cell__events","aria-hidden":"true"},[...n.map(o=>O("span",{class:"cc-month-event",key:o.event.moduleId+":"+o.event.id,title:o.event.title,"data-module-id":o.event.moduleId,"data-event-kind":o.event.kind},o.event.title)),...r>0?[O("span",{class:"cc-month-event cc-month-event--overflow"},"+"+r)]:[]])}function ld(e,t){return O("button",{key:e.key,type:"button",class:"cc-day-detail__event","data-detail-event-id":e.eventId,"data-module-id":e.moduleId,"data-event-kind":e.kind,"aria-label":"\u67E5\u770B\u4E8B\u4EF6\u8BE6\u60C5\uFF1A"+e.title,onClick:n=>t(e,n)},[O("span",{class:"cc-day-detail__event-mark","aria-hidden":"true"}),O("span",{class:"cc-day-detail__event-content"},[O("span",{class:"cc-day-detail__event-title"},e.title),O("span",{class:"cc-day-detail__event-topline"},[O("span",{class:"cc-day-detail__time"},la(e)),O("span",{class:"cc-day-detail__module"},aa[e.moduleId]??e.moduleId)])]),O("span",{class:"cc-day-detail__event-arrow","aria-hidden":"true"},"\u203A")])}function cd(e,t,n){return O("section",{class:"cc-day-detail","aria-label":"\u9009\u4E2D\u65E5\u8BAE\u7A0B","aria-live":"polite",...e?{"data-day-detail-date":e.key}:{}},[O("header",{class:"cc-day-detail__header"},[O("div",{class:"cc-day-detail__heading"},[O("div",{class:"cc-day-detail__eyebrow"},"\u5F53\u65E5\u8BAE\u7A0B"),O("h3",{class:"cc-day-detail__title"},e?e.date.day+"\u65E5 \xB7 "+t:"\u9009\u62E9\u65E5\u671F")]),...e?.isToday?[O("span",{class:"cc-day-detail__today"},"\u4ECA\u5929")]:[],...e&&e.occurrences.length>=4?[O("span",{class:"cc-day-detail__count"},e.occurrences.length+" \u9879")]:[]]),e?.occurrences.length?O("div",{class:"cc-day-detail__events"},e.occurrences.map(r=>ld(r,n))):O("div",{class:"cc-day-detail__empty-state"},e?"\u5F53\u5929\u6682\u65E0\u4E8B\u4EF6":"\u9009\u62E9\u65E5\u671F\u67E5\u770B\u4E8B\u4EF6")])}var ca=Mn({name:"CalendarMonthView",props:{model:{type:Object,required:!0},weekdayLabels:{type:Array,default:()=>[]},maxVisibleOccurrences:{type:Number,default:3},busy:{type:Boolean,default:!1}},emits:{selectDate:e=>!0,clearSelection:()=>!0,previousMonth:()=>!0,nextMonth:()=>!0,previousDay:()=>!0,nextDay:()=>!0,goToday:()=>!0},setup(e,{emit:t}){let n=gt(!1),r=gt(null),o=gt(null),i=null,s=Ot(()=>{let v=[...e.weekdayLabels];return v.length===e.model.columns?v:sd(e.model.columns)}),a=Ot(()=>{let v=e.model.cells.findIndex(W=>W.isSelected);if(v>=0)return v;let D=e.model.cells.findIndex(W=>W.isToday);return D>=0?D:e.model.cells.findIndex(W=>W.inCurrentMonth)}),c=Ot(()=>Math.floor(Math.max(0,a.value)/e.model.columns)),f=Ot(()=>{let v=a.value;return v<0?"":s.value[v%e.model.columns]??""}),u=Ot(()=>e.model.selectedDay?.occurrences.find(v=>v.key===r.value)),p=()=>{r.value=null;let v=i;i=null,v&&Vn(()=>v.isConnected&&v.focus())},C=(v,D)=>{i=D.currentTarget,r.value=v.key,Vn(()=>o.value?.querySelector(".cc-event-sheet__close")?.focus())};Kt(()=>e.model.selectedDay?.key,()=>{r.value=null,i=null});let E=v=>{v.key==="Escape"?(v.stopPropagation(),p()):v.key==="Tab"&&(v.preventDefault(),o.value?.querySelector(".cc-event-sheet__close")?.focus())};return()=>O("section",{class:"cc-calendar-month","aria-label":e.model.year+"-"+e.model.month,"data-expanded":n.value?"true":"false"},[O("header",{class:"cc-calendar-month__header"},[O("div",{class:"cc-calendar-month__month-switcher"},[O("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Previous month",title:"\u4E0A\u4E2A\u6708",onClick:()=>t("previousMonth")},"\u2039"),O("h2",{class:"cc-calendar-month__title"},e.model.year+" \u5E74 "+e.model.month+" \u6708"),O("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Next month",title:"\u4E0B\u4E2A\u6708",onClick:()=>t("nextMonth")},"\u203A")]),O("div",{class:"cc-calendar-month__header-actions"},[...e.model.selectedDay?.isToday?[]:[O("button",{type:"button",class:"cc-calendar-month__today-link",disabled:e.busy,"aria-label":"\u8FD4\u56DE\u4E16\u754C\u4ECA\u5929",onClick:()=>t("goToday")},"\u56DE\u4ECA\u5929")]])]),O("div",{class:"cc-calendar-month__body"},[O("section",{class:"cc-calendar-month__calendar","aria-label":"\u65E5\u5386\u7F51\u683C"},[O("div",{class:"cc-calendar-month__weekdays",style:{"--cc-calendar-columns":String(e.model.columns)}},s.value.map((v,D)=>O("span",{key:D,class:"cc-calendar-month__weekday","data-weekday":D},v))),O("div",{class:"cc-calendar-month__grid",id:"cc-calendar-grid",style:{"--cc-calendar-columns":String(e.model.columns)}},e.model.cells.map((v,D)=>O("button",{key:v.key,type:"button",class:["cc-month-cell",{"cc-month-cell--outside":!v.inCurrentMonth,"cc-month-cell--today":v.isToday,"cc-month-cell--selected":v.isSelected,"cc-month-cell--active-week":Math.floor(D/e.model.columns)===c.value}],"data-calendar-date":v.key,"aria-label":v.date.day+"\u65E5\uFF0C"+v.occurrences.length+"\u9879\u4E8B\u4EF6","aria-pressed":v.isSelected?"true":"false",onClick:()=>t("selectDate",v.date)},[O("span",{class:"cc-month-cell__day"},String(v.date.day)),ad(v,Math.max(0,Math.floor(e.maxVisibleOccurrences)))]))),O("button",{type:"button",class:"cc-calendar-month__fold","aria-controls":"cc-calendar-grid","aria-expanded":n.value?"true":"false",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386 \u2303":"\u5C55\u5F00\u6708\u5386 \u2304")]),cd(e.model.selectedDay,f.value,C)]),O("nav",{class:"cc-calendar-month__bottom-nav","aria-label":"\u65E5\u671F\u5FEB\u6377\u5BFC\u822A"},[O("button",{type:"button",disabled:e.busy,"aria-label":"\u524D\u4E00\u5929",onClick:()=>t("previousDay")},"\u2039 \u524D\u4E00\u5929"),O("button",{type:"button",disabled:e.busy,"aria-label":n.value?"\u6536\u8D77\u6708\u5386":"\u5C55\u5F00\u6708\u5386",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386":"\u6708\u5386"),O("button",{type:"button",disabled:e.busy,"aria-label":"\u540E\u4E00\u5929",onClick:()=>t("nextDay")},"\u540E\u4E00\u5929 \u203A")]),...u.value?[O("div",{class:"cc-event-sheet",ref:o,role:"dialog","aria-modal":"true","aria-label":"\u4E8B\u4EF6\u8BE6\u60C5",onClick:v=>{v.target===v.currentTarget&&p()},onKeydown:E},[O("article",{class:"cc-event-sheet__card"},[O("header",{class:"cc-event-sheet__header"},[O("span",{},"\u4E8B\u4EF6\u8BE6\u60C5"),O("button",{type:"button",class:"cc-event-sheet__close",onClick:p},"\u8FD4\u56DE\u5217\u8868 \xD7")]),O("div",{class:"cc-event-sheet__content"},[O("h3",{class:"cc-event-sheet__title"},u.value.title),O("dl",{class:"cc-event-sheet__fields"},[O("dt",{},"\u65F6\u95F4"),O("dd",{},la(u.value)),O("dt",{},"\u5F00\u59CB"),O("dd",{},sa(u.value.start)),...u.value.end?[O("dt",{},"\u7ED3\u675F"),O("dd",{},sa(u.value.end))]:[],O("dt",{},"\u7C7B\u522B"),O("dd",{},aa[u.value.moduleId]??u.value.moduleId),...u.value.tags.length?[O("dt",{},"\u6807\u7B7E"),O("dd",{},u.value.tags.join(" \xB7 "))]:[]])])])])]:[]])}});var da=String.raw`
/* V3 layout: persistent agenda instead of a full-screen day overlay. */
.cc-calendar-month { position: relative; }
.cc-calendar-month__month-switcher,
.cc-calendar-month__header-actions { display: flex; align-items: center; gap: 5px; min-width: 0; }
.cc-calendar-month__month-switcher { flex: 1; }
.cc-calendar-month__header-actions { margin-left: auto; }
.cc-calendar-month__today-link {
  min-height: 34px; padding: 0 9px; border: 1px solid #b78d80;
  border-radius: 9px; background: #f8eade; color: #8c3525;
  font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap;
}
.cc-calendar-month__today-link:disabled { opacity: .4; cursor: default; }
.cc-calendar-month__fold, .cc-calendar-month__bottom-nav { display: none; }
.cc-day-detail__event {
  display: flex; align-items: center; gap: 12px; width: 100%;
  font: inherit; text-align: left; cursor: pointer;
}
.cc-day-detail__event-content { flex: 1; min-width: 0; display: grid; gap: 5px; }
.cc-day-detail__event-title { display: block; font-size: 14px; }
.cc-day-detail__event-topline {
  display: flex; justify-content: flex-start; flex-wrap: wrap;
  gap: 9px; margin: 0; font-size: 11px;
}
.cc-day-detail__event-mark {
  display: block; flex: 0 0 7px; align-self: stretch; min-height: 22px;
  border-radius: 99px; background: var(--cc-category, #806850);
}
.cc-day-detail__event-arrow { color: #826342; font-size: 23px; }
.cc-day-detail__count { font-size: 11px; color: #826342; font-weight: 800; }
.cc-day-detail__event[data-module-id="festival"], .cc-month-event[data-module-id="festival"] { --cc-category: #a73326; }
.cc-day-detail__event[data-module-id="class"], .cc-month-event[data-module-id="class"] { --cc-category: #246b51; }
.cc-day-detail__event[data-module-id="appointment"], .cc-month-event[data-module-id="appointment"] { --cc-category: #80375e; }
.cc-day-detail__event[data-module-id="anniversary"], .cc-month-event[data-module-id="anniversary"],
.cc-day-detail__event[data-module-id="birthday"], .cc-month-event[data-module-id="birthday"] { --cc-category: #a16a12; }
.cc-day-detail__event[data-module-id="reminder"], .cc-month-event[data-module-id="reminder"] { --cc-category: #315f86; }
.cc-day-detail__event[data-module-id="history"], .cc-month-event[data-module-id="history"] { --cc-category: #69616e; }
.cc-day-detail__event[data-module-id="event"], .cc-month-event[data-module-id="event"] { --cc-category: #5b6942; }
.cc-calendar-month button:focus-visible { outline: 3px solid #b47b22; outline-offset: -3px; }
.cc-event-sheet {
  position: absolute; inset: 0; z-index: 10;
  display: flex; align-items: flex-end; justify-content: center;
  background: rgba(26, 18, 11, .52);
}
.cc-event-sheet__card {
  width: min(520px, 100%); max-height: 80%;
  overflow: hidden; border-radius: 18px 18px 0 0;
  background: #fcf9f2; color: #30251a;
  box-shadow: 0 -10px 34px rgba(20, 13, 6, .28);
}
.cc-event-sheet__header {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 50px; padding: 8px 14px; border-bottom: 1px solid #d6c6b1;
  font-size: 12px; font-weight: 800; color: #70543c;
}
.cc-event-sheet__close {
  min-height: 36px; padding: 5px 10px; border: 1px solid #b9a386;
  border-radius: 9px; background: #f8f0e5; color: #654526;
  font: inherit; font-weight: 800; cursor: pointer;
}
.cc-event-sheet__content { max-height: 65dvh; overflow-y: auto; padding: 18px; }
.cc-event-sheet__title { margin: 0 0 17px; font-size: 19px; overflow-wrap: anywhere; }
.cc-event-sheet__fields {
  display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 13px 12px;
  margin: 0; font-size: 13px; line-height: 1.5;
}
.cc-event-sheet__fields dt { color: #80664d; font-weight: 700; }
.cc-event-sheet__fields dd { margin: 0; overflow-wrap: anywhere; }

@media (max-width: 980px) {
  .cc-calendar-month {
    display: flex; flex-direction: column; width: 100%; height: 100%;
    background: #f6f0e4;
  }
  .cc-calendar-month__header {
    flex: 0 0 auto; min-height: 54px;
    padding: 7px 58px 7px 5px; gap: 3px;
    border-bottom: 1px solid #d6c6b1; background: #fcf9f2;
  }
  .cc-calendar-month__month-switcher { flex: 1 1 auto; gap: 0; }
  .cc-calendar-month__title {
    margin: 0 2px; color: #231911; font-size: clamp(13px, 3.6vw, 17px);
    white-space: nowrap; font-weight: 850;
  }
  .cc-calendar-month__nav {
    flex: 0 0 32px; width: 32px; height: 38px;
    border-radius: 9px; box-shadow: none; background: transparent;
    font-size: 24px;
  }
  .cc-calendar-month__header-actions { margin-left: 0; flex: 0 0 auto; }
  .cc-calendar-month__today-link { min-height: 32px; padding: 0 5px; font-size: 11px; }
  .cc-calendar-month__body {
    display: flex; flex-direction: column; flex: 1 1 auto;
    min-height: 0; min-width: 0; overflow: hidden; padding: 0; gap: 0;
  }
  .cc-calendar-month__calendar {
    display: flex; flex-direction: column; flex: 0 0 auto;
    width: 100%; height: auto; min-height: 0; overflow: hidden;
    border: 0; border-radius: 0; box-shadow: none; background: #fcf9f2;
  }
  .cc-calendar-month__weekdays {
    flex: 0 0 29px; min-height: 29px; border-bottom: 1px solid #d6c6b1;
    background: #ebe1ce;
  }
  .cc-calendar-month__weekday { min-height: 29px; padding: 4px 0; font-size: 11px; color: #604c36; }
  .cc-calendar-month__grid {
    display: grid; flex: 0 0 auto; grid-auto-rows: minmax(62px, auto);
    align-content: start; min-height: 0; max-height: min(42dvh, 350px);
    overflow-y: auto; overscroll-behavior: contain;
  }
  .cc-calendar-month[data-expanded="false"] .cc-calendar-month__grid {
    max-height: 62px; overflow: hidden;
  }
  .cc-calendar-month[data-expanded="false"] .cc-month-cell:not(.cc-month-cell--active-week) { display: none; }
  .cc-month-cell {
    display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
    gap: 4px; min-height: 62px; padding: 6px 1px 5px;
    border-right: 1px solid #e6d8c3; border-bottom: 1px solid #e6d8c3;
    background: #fcf9f2; text-align: center;
  }
  .cc-month-cell--outside { background: #f0e9dc; }
  .cc-month-cell--today { box-shadow: none; }
  .cc-month-cell--selected { background: #f6e7cb; }
  .cc-month-cell--selected::after { display: none; }
  .cc-month-cell__day {
    display: grid; place-items: center;
    min-width: 29px; height: 29px; margin: 0; padding: 0 3px;
    border: 2px solid transparent; border-radius: 50%;
    font-size: 13px; font-weight: 850; color: #31241a;
  }
  .cc-month-cell--outside .cc-month-cell__day { color: #806b55; }
  .cc-month-cell--today .cc-month-cell__day { border-color: #ad402e; }
  .cc-month-cell--selected .cc-month-cell__day { color: #fffaf2; background: #38281c; }
  .cc-month-cell--today.cc-month-cell--selected .cc-month-cell__day { border-color: #ad402e; }
  .cc-month-cell__events {
    display: flex; flex-direction: row; justify-content: center; align-items: center;
    gap: 2px; width: 100%; min-height: 7px;
  }
  .cc-month-event {
    display: block; flex: 0 0 6px; width: 6px; height: 6px;
    min-width: 0; overflow: hidden; padding: 0; border: 0;
    border-radius: 50%; background: var(--cc-category, #806850);
    color: transparent; font-size: 0; line-height: 0; white-space: nowrap;
  }
  .cc-month-event--overflow {
    flex-basis: auto; width: auto; height: auto;
    background: transparent; color: #5e4934; font-size: 9px; line-height: 1;
  }
  .cc-calendar-month__fold {
    display: block; flex: 0 0 28px; width: 100%; height: 28px;
    border: 0; border-bottom: 1px solid #d6c6b1;
    background: #ebe1ce; color: #654825;
    font: inherit; font-size: 11px; font-weight: 800; cursor: pointer;
  }
  .cc-day-detail {
    position: static; display: flex; flex-direction: column;
    flex: 1 1 auto; min-height: 0; overflow: hidden;
    border: 0; border-radius: 0; background: #f6f0e4; box-shadow: none;
  }
  .cc-day-detail__header {
    flex: 0 0 auto; min-height: 62px; padding: 10px 14px;
    background: #f6f0e4; border: 0;
  }
  .cc-day-detail__heading { gap: 4px; }
  .cc-day-detail__eyebrow { color: #68513c; font-size: 10px; }
  .cc-day-detail__title { color: #231911; font-size: 18px; }
  .cc-day-detail__today, .cc-day-detail__count { color: #8d2d1f; font-size: 11px; font-weight: 800; }
  .cc-day-detail__events {
    display: grid; align-content: start; flex: 1 1 auto;
    min-height: 0; gap: 8px; padding: 3px 12px 14px;
    overflow-y: auto; overscroll-behavior: contain;
  }
  .cc-day-detail__event {
    min-height: 62px; padding: 10px 11px;
    border: 1px solid #d3bea5; border-radius: 12px;
    background: #fcf9f2; box-shadow: none;
  }
  .cc-day-detail__event-title { color: #231911; font-size: 14px; }
  .cc-day-detail__event-topline { font-size: 11px; color: #604b35; }
  .cc-day-detail__module { color: #654a38; }
  .cc-day-detail__empty-state { font-size: 13px; color: #604b35; }
  .cc-calendar-month__bottom-nav {
    display: grid; flex: 0 0 auto; grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px; min-height: 54px;
    padding: 7px 10px calc(7px + env(safe-area-inset-bottom, 0px));
    border-top: 1px solid #d6c6b1; background: #fcf9f2;
    z-index: 20;
  }
  .cc-calendar-month__bottom-nav button {
    min-height: 40px; padding: 6px 3px; border: 1px solid #ccb69c;
    border-radius: 10px; background: #eee2ce; color: #422f1f;
    font: inherit; font-size: 12px; font-weight: 850; cursor: pointer; white-space: nowrap;
  }
  .cc-calendar-month__bottom-nav button:disabled { opacity: .48; }
  .cc-event-sheet { bottom: 54px; z-index: 12; }
  .cc-event-sheet__card { max-height: min(75dvh, 620px); }
}
@media (max-width: 360px) {
  .cc-calendar-month__header { padding-left: 3px; padding-right: 49px; }
  .cc-calendar-month__title { font-size: 13px; }
  .cc-calendar-month__nav { flex-basis: 27px; width: 27px; }
  .cc-calendar-month__today-link { font-size: 10px; padding: 0 4px; }
  .cc-month-cell__day { min-width: 27px; height: 27px; font-size: 12px; }
}
@media (prefers-color-scheme: dark) and (max-width: 980px) {
  .cc-calendar-month { background: #1f1b19; color: #eee5d7; --cc-ink: #eee5d7; }
  .cc-calendar-month__header, .cc-calendar-month__calendar, .cc-calendar-month__bottom-nav { background: #29231e; }
  .cc-calendar-month__title, .cc-day-detail__title, .cc-day-detail__event-title { color: #f4ece0; }
  .cc-calendar-month__nav { background: transparent; color: #f6d396; }
  .cc-calendar-month__weekdays, .cc-calendar-month__fold { background: #352c23; }
  .cc-calendar-month__weekday, .cc-calendar-month__fold { color: #e5d2b5; }
  .cc-month-cell { background: #29231e; }
  .cc-month-cell--outside { background: #241f1b; }
  .cc-month-cell--selected { background: #463726; }
  .cc-month-cell__day { color: #f5e9da; }
  .cc-month-cell--outside .cc-month-cell__day { color: #a99984; }
  .cc-month-cell--selected .cc-month-cell__day { background: #e5ca9f; color: #21180e; }
  .cc-day-detail, .cc-day-detail__header { background: #1f1b19; }
  .cc-day-detail__eyebrow, .cc-day-detail__event-topline, .cc-day-detail__module { color: #cfb89a; }
  .cc-day-detail__event { background: #2c261f; border-color: #554538; }
  .cc-day-detail__empty-state { color: #cbb59b; }
  .cc-calendar-month__bottom-nav button { background: #423528; color: #f4e5d0; }
  .cc-calendar-month__today-link { color: #f4b9a9; border-color: #a66554; background: #352723; }
  .cc-event-sheet__card { background: #29231e; color: #f4ece0; }
  .cc-event-sheet__header, .cc-event-sheet__fields dt { color: #cfb89a; }
  .cc-event-sheet__close { background: #423528; color: #f4e5d0; }
}
`;var ua=String.raw`
[data-calendar-core-mount="vue-month"] {
  height: 100%;
  min-height: 0;
}

.cc-calendar-month {
  --cc-ink: #2c241b;
  --cc-muted: #806f5e;
  --cc-line: rgba(155, 128, 84, 0.16);
  --cc-line-strong: rgba(155, 128, 84, 0.26);
  --cc-surface: rgba(255, 252, 246, 0.96);
  --cc-surface-2: rgba(247, 240, 229, 0.92);
  --cc-accent: #8b5a19;
  --cc-accent-soft: #f1dfb9;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  color: var(--cc-ink);
  font: inherit;
  background:
    radial-gradient(circle at 8% 0%, rgba(239, 209, 137, 0.12), transparent 32%),
    linear-gradient(180deg, #fffdf8, #f8f0e5);
}

.cc-calendar-month *,
.cc-calendar-month *::before,
.cc-calendar-month *::after {
  box-sizing: border-box;
}

.cc-calendar-month__header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--cc-line);
  background:
    linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,240,0.82));
}

.cc-calendar-month__header-copy {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.cc-calendar-month__kicker {
  color: #9a8268;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.16em;
}

.cc-calendar-month__title {
  margin: 0;
  color: #3b2d1f;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: 0.01em;
}

.cc-calendar-month__nav-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cc-calendar-month__nav {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--cc-line-strong);
  border-radius: 11px;
  background: rgba(255, 252, 246, 0.92);
  color: #6e4510;
  font: inherit;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: 140ms ease;
}

.cc-calendar-month__nav:hover {
  transform: translateY(-1px);
  border-color: rgba(188, 135, 45, 0.42);
  background: linear-gradient(180deg, #fff7ea, #f4dfad);
  box-shadow: 0 8px 18px rgba(82, 48, 8, 0.12);
}

.cc-calendar-month__nav:disabled {
  cursor: default;
  opacity: 0.38;
  transform: none;
  box-shadow: none;
}

.cc-calendar-month__body {
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 0.88fr);
  gap: 16px;
  padding: 16px;
  overflow: hidden;
}

.cc-calendar-month__calendar,
.cc-day-detail {
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--cc-line);
  border-radius: 18px;
  background: var(--cc-surface);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.72),
    0 12px 28px rgba(75, 51, 25, 0.06);
}

.cc-calendar-month__calendar {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.cc-calendar-month__weekdays,
.cc-calendar-month__grid {
  display: grid;
  grid-template-columns:
    repeat(var(--cc-calendar-columns), minmax(0, 1fr));
}

.cc-calendar-month__weekdays {
  min-height: 40px;
  border-bottom: 1px solid var(--cc-line);
  background: rgba(247, 239, 225, 0.86);
}

.cc-calendar-month__weekday {
  min-width: 0;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 4px;
  color: #7a6a58;
  font-size: 12px;
  font-weight: 750;
}

.cc-calendar-month__grid {
  min-height: 0;
  overflow: auto;
  align-content: stretch;
}

.cc-month-cell {
  position: relative;
  min-width: 0;
  min-height: 88px;
  padding: 9px 9px 7px;
  overflow: hidden;
  border: 0;
  border-right: 1px solid rgba(155, 128, 84, 0.12);
  border-bottom: 1px solid rgba(155, 128, 84, 0.12);
  background: rgba(255, 253, 248, 0.9);
  color: var(--cc-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 120ms ease;
}

.cc-month-cell:hover {
  background: #fff8ec;
}

.cc-month-cell--outside {
  background: #f6f1e7;
  color: #b3a392;
}

.cc-month-cell--today {
  box-shadow: inset 0 0 0 2px rgba(188, 135, 45, 0.44);
}

.cc-month-cell--selected {
  background:
    linear-gradient(180deg, #fff8e8, #f9e9c8);
}

.cc-month-cell--selected::after {
  content: "";
  position: absolute;
  inset: 4px;
  pointer-events: none;
  border: 1px solid rgba(188, 135, 45, 0.46);
  border-radius: 10px;
}

.cc-month-cell__day {
  display: block;
  margin-bottom: 6px;
  color: currentColor;
  font-size: 12px;
  font-weight: 850;
}

.cc-month-cell__events {
  display: grid;
  gap: 3px;
}

.cc-month-event {
  min-width: 0;
  padding: 4px 6px;
  overflow: hidden;
  border: 1px solid rgba(183, 143, 75, 0.14);
  border-radius: 8px;
  background: rgba(239, 220, 184, 0.64);
  color: #5e4528;
  font-size: 10.5px;
  font-weight: 720;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-month-event--overflow {
  border-color: transparent;
  background: transparent;
  color: #8c755c;
}

.cc-day-detail {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.cc-day-detail--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  color: #998774;
  font-size: 12px;
}

.cc-day-detail__header {
  min-height: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--cc-line);
  background: linear-gradient(180deg, #fffdf8, #f7efe2);
}

.cc-day-detail__heading {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 2px;
}

.cc-day-detail__eyebrow {
  color: #9b8269;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.cc-day-detail__title {
  margin: 0;
  color: #3b2d1f;
  font-size: 16px;
  font-weight: 800;
}

.cc-day-detail__today {
  padding: 4px 8px;
  border: 1px solid rgba(188, 135, 45, 0.28);
  border-radius: 999px;
  background: rgba(243, 223, 181, 0.5);
  color: #74480f;
  font-size: 10px;
  font-weight: 850;
}

.cc-day-detail__back {
  display: none;
}

.cc-day-detail__events {
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 14px;
  overflow: auto;
}

.cc-day-detail__event {
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--cc-line);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 253, 248, 0.94), rgba(248, 240, 226, 0.72));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.66);
}

.cc-day-detail__event-topline {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
  color: #8a745d;
  font-size: 10px;
  font-weight: 750;
}

.cc-day-detail__module {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cc-day-detail__event-title {
  overflow-wrap: anywhere;
  color: #4a3827;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.4;
}

.cc-day-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
}

.cc-day-detail__tag {
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(223, 236, 255, 0.72);
  color: #41668e;
  font-size: 9.5px;
  font-weight: 750;
}

.cc-day-detail__empty-state {
  margin: 14px;
  padding: 18px;
  border: 1px dashed var(--cc-line-strong);
  border-radius: 14px;
  color: #998774;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 980px) {
  .cc-calendar-month__header {
    min-height: 58px;
    padding: 10px 12px;
  }

  .cc-calendar-month__kicker {
    display: none;
  }

  .cc-calendar-month__title {
    font-size: 17px;
  }

  .cc-calendar-month__nav {
    width: 34px;
    height: 34px;
  }

  .cc-calendar-month__body {
    position: relative;
    display: block;
    padding: 0;
  }

  .cc-calendar-month__calendar {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }

  .cc-calendar-month__weekdays {
    min-height: 34px;
  }

  .cc-calendar-month__weekday {
    min-height: 34px;
    padding: 8px 2px;
    font-size: 11px;
  }

  .cc-month-cell {
    min-height: 74px;
    padding: 7px 5px;
  }

  .cc-month-cell__day {
    margin-bottom: 4px;
  }

  .cc-month-event {
    padding: 3px 4px;
    border-radius: 6px;
    font-size: 9px;
  }

  .cc-day-detail {
    position: absolute;
    inset: 0;
    z-index: 5;
    border: 0;
    border-radius: 0;
    background: #fffaf1;
    box-shadow: none;
  }

  .cc-day-detail--empty {
    display: none;
  }

  .cc-day-detail__header {
    min-height: 58px;
    padding: 10px 12px;
  }

  .cc-day-detail__back {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 6px 10px;
    border: 1px solid var(--cc-line-strong);
    border-radius: 10px;
    background: rgba(255,252,246,0.92);
    color: #6e4510;
    font: inherit;
    font-size: 11px;
    font-weight: 800;
    cursor: pointer;
  }

  .cc-day-detail__title {
    font-size: 14px;
  }

  .cc-day-detail__events {
    padding: 12px;
  }
}

@media (max-width: 520px) {
  .cc-month-cell {
    min-height: 68px;
  }

  .cc-month-event {
    font-size: 8.5px;
  }
}
`+da;async function fa(e,t){let n=await t.session.load(),r=dr(n),o=gt(!1),i=null,s=Mn({name:"CalendarMonthRendererRoot",setup(){let f=async E=>{if(!o.value){o.value=!0;try{r.value=await t.session.navigateMonths(E)}finally{o.value=!1}}},u=async E=>{if(!o.value){o.value=!0;try{r.value=await t.session.goToDate(E),t.onSelectedDateChange?.(E)}finally{o.value=!1}}},p=async E=>{if(!o.value){o.value=!0;try{r.value=await t.session.stepSelectedDate(E);let v=r.value.selectedDay?.date;v&&t.onSelectedDateChange?.(v)}finally{o.value=!1}}},C=()=>{r.value=t.session.clearSelectedDate()};return()=>O(ca,{model:r.value,weekdayLabels:t.weekdayLabels,maxVisibleOccurrences:t.maxVisibleOccurrences,busy:o.value,onPreviousMonth:()=>{f(-1)},onNextMonth:()=>{f(1)},onSelectDate:E=>{u(E)},onPreviousDay:()=>{p(-1)},onNextDay:()=>{p(1)},onGoToday:()=>{u(r.value.today)},onClearSelection:C})}}),a=e.ownerDocument.createElement("style");a.dataset.calendarCoreRenderer="vue-month",a.textContent=ua;let c=e.ownerDocument.createElement("div");return c.dataset.calendarCoreMount="vue-month",e.replaceChildren(a,c),i=oa(s),i.mount(c),{async refresh(){return r.value=await t.session.load(),r.value},destroy(){i?.unmount(),i=null,e.replaceChildren()}}}var Tr="__calendarCoreSillyTavernShellDestroy__",ha="calendar-core:shell:button-position:v1",dd=980,kr=8,ud=4;function fd(){try{let e=globalThis.$,t=e?.("body")?.[0];if(t&&t.ownerDocument.body===t)return t.ownerDocument}catch{}try{if(window.parent&&window.parent!==window&&window.parent.document)return window.parent.document}catch{}if(window.parent!==window)throw new Error("CalendarCore cannot reach the visible SillyTavern document from its script iframe");return document}function pa(e,t,n){return Math.min(Math.max(e,t),Math.max(t,n))}function pd(e){try{let t=e.localStorage?.getItem(ha);if(!t)return null;let n=JSON.parse(t);return typeof n.left!="number"||typeof n.top!="number"||!Number.isFinite(n.left)||!Number.isFinite(n.top)?null:{left:n.left,top:n.top}}catch{return null}}function hd(e,t){try{e.localStorage?.setItem(ha,JSON.stringify(t))}catch{}}function md(e){let t=e.createElement("style");return t.dataset.calendarCoreShellStyle="month",t.textContent=['[data-calendar-core-shell="button"] {',"  position: fixed;","  left: calc(100vw - 88px);","  top: 32vh;","  z-index: 2147483001;","  display: grid;","  place-items: center;","  width: 68px;","  height: 68px;","  padding: 0;","  border: 1px solid rgba(147, 112, 51, 0.45);","  border-radius: 20px;","  background: rgba(233, 211, 171, 0.86);","  color: #4c3820;","  font: inherit;","  font-size: 32px;","  line-height: 1;","  box-shadow: 0 14px 30px rgba(68, 44, 20, 0.18);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  cursor: grab;","  touch-action: none;","  user-select: none;","  transition: box-shadow 140ms ease, transform 140ms ease;","}","",'[data-calendar-core-shell="button"]:hover {',"  transform: translateY(-1px);","  box-shadow: 0 18px 36px rgba(68, 44, 20, 0.24);","}","",'[data-calendar-core-shell="button"][data-dragging="true"] {',"  cursor: grabbing;","  transform: none;","}","",'[data-calendar-core-shell="panel"] {',"  position: fixed;","  left: 2vw;","  top: 2vh;","  z-index: 2147483000;","  width: min(1560px, calc(100vw - 40px));","  height: min(960px, calc(100dvh - 40px));","  padding: 16px;","  overflow: hidden;","  border: 1px solid rgba(155, 128, 84, 0.22);","  border-radius: 28px;","  background: rgba(242, 234, 220, 0.94);","  color: #2c241b;","  box-shadow: 0 28px 60px rgba(56, 38, 20, 0.24);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  box-sizing: border-box;","}","",'[data-calendar-core-shell="panel"][hidden] {',"  display: none;","}","",'[data-calendar-core-shell="chrome"] {',"  height: 48px;","  display: flex;","  align-items: center;","  gap: 12px;","  padding: 0 4px 12px 6px;","  cursor: move;","  user-select: none;","  box-sizing: border-box;","}","",'[data-calendar-core-shell="chrome-title"] {',"  min-width: 0;","  flex: 1;","  color: #3b2d1f;",'  font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',"  font-size: 15px;","  font-weight: 800;","  letter-spacing: 0.02em;","}","",'[data-calendar-core-shell="close"] {',"  width: 34px;","  height: 34px;","  padding: 0;","  border: 1px solid rgba(155, 128, 84, 0.2);","  border-radius: 10px;","  background: rgba(255, 252, 246, 0.72);","  color: #6e4510;","  font: inherit;","  font-size: 20px;","  line-height: 1;","  cursor: pointer;","}","",'[data-calendar-core-shell="close"]:hover {',"  background: linear-gradient(180deg, #fff7ea, #f4dfad);","}","",'[data-calendar-core-shell="frame"] {',"  display: block;","  width: 100%;","  height: calc(100% - 48px);","  border: 1px solid rgba(155, 128, 84, 0.14);","  border-radius: 22px;","  background: rgba(255, 252, 246, 0.96);","  box-sizing: border-box;","}","","@media (max-width: 980px) {",'  [data-calendar-core-shell="button"] {',"    width: 52px;","    height: 52px;","    border-radius: 16px;","    font-size: 23px;","  }","",'  [data-calendar-core-shell="button"]:hover {',"    transform: none;","  }","",'  [data-calendar-core-shell="panel"] {',"    inset: 0;","    width: 100vw;","    height: 100dvh;","    padding: 0;","    border: 0;","    border-radius: 0;","    background: #f7f0e5;","  }","",'  [data-calendar-core-shell="chrome"] {',"    position: relative;","    height: 0;","    padding: 0;","    border: 0;","    background: transparent;","    cursor: default;","    z-index: 5;","    pointer-events: none;","  }","",'  [data-calendar-core-shell="chrome-title"] {',"    display: none;","  }","",'  [data-calendar-core-shell="close"] {',"    position: absolute;","    top: 7px;","    right: 8px;","    width: 38px;","    height: 38px;","    pointer-events: auto;","    background: #fcf9f2;","  }","",'  [data-calendar-core-shell="frame"] {',"    height: 100%;","    border: 0;","    border-radius: 0;","  }","}"].join(`
`),t}async function ma(e){let t=e.pageDocument??fd(),n=e.lifecycleWindow??window,r=t.defaultView,o=t.defaultView??n;r?.[Tr]?.();let i=md(t),s=t.createElement("button");s.type="button",s.dataset.calendarCoreShell="button",s.textContent=e.buttonLabel??"\u{1F4C5}",s.title=e.buttonTitle??"\u6253\u5F00\u6708\u5386",s.setAttribute("aria-label",s.title);let a=t.createElement("section");a.dataset.calendarCoreShell="panel",a.setAttribute("aria-label","\u6708\u5386\u60AC\u6D6E\u9762\u677F");let c=t.createElement("div");c.dataset.calendarCoreShell="chrome";let f=t.createElement("div");f.dataset.calendarCoreShell="chrome-title",f.textContent="\u6708\u5386";let u=t.createElement("button");u.type="button",u.dataset.calendarCoreShell="close",u.textContent="\xD7",u.title="\u5173\u95ED",u.setAttribute("aria-label","\u5173\u95ED\u6708\u5386");let p=t.createElement("div");p.dataset.calendarCoreShell="frame",p.setAttribute("aria-label","Calendar");let C=t.createElement("div");C.style.cssText='width:100%;height:100%;min-height:0;overflow:hidden;box-sizing:border-box;color:#2c241b;background:#f6f0e4;font-family:"Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;',p.attachShadow({mode:"open"}).append(C),c.append(f,u),a.append(c,p);let E=e.initiallyOpen??!1,v=null,D=!1,W=e.pendingMessage??"\u7B49\u5F85\u5386\u6CD5\u6570\u636E\u521D\u59CB\u5316",J=!1,M=null,I=null,Z=null,S=()=>({width:o.innerWidth||t.documentElement.clientWidth||0,height:o.innerHeight||t.documentElement.clientHeight||0}),Q=()=>S().width>dd,pe=(k,j,oe)=>{let le=S(),kt=k.getBoundingClientRect(),Ln=kt.width||k.offsetWidth,dt=kt.height||k.offsetHeight;return{left:pa(j,kr,le.width-Ln-kr),top:pa(oe,kr,le.height-dt-kr)}},Ee=k=>{if(!k){s.style.left="",s.style.top="";return}let j=pe(s,k.left,k.top);s.style.left=`${j.left}px`,s.style.top=`${j.top}px`},ve=()=>{if(!Q()){a.style.left="",a.style.top="",Z=null;return}let k=S(),j=Math.min(1560,Math.max(0,k.width-40)),oe=Math.min(960,Math.max(0,k.height-40));Z={left:Math.round((k.width-j)/2),top:Math.round((k.height-oe)/2)},a.style.left=`${Z.left}px`,a.style.top=`${Z.top}px`},Ue=()=>{a.hidden=!E,s.hidden=E,s.setAttribute("aria-expanded",E?"true":"false"),s.title=E?"\u5173\u95ED\u6708\u5386":e.buttonTitle??"\u6253\u5F00\u6708\u5386"},je=()=>{D||(E=!0,Q()&&!Z&&ve(),Ue())},Te=()=>{D||(E=!1,Ue())},bt=()=>{E?Te():je()},Jt=()=>{if(J){J=!1;return}bt()},St=k=>{if(D||E||k.button!==0)return;let j=s.getBoundingClientRect();M={pointerId:k.pointerId,startX:k.clientX,startY:k.clientY,left:j.left,top:j.top,moved:!1},s.dataset.dragging="true",s.setPointerCapture?.(k.pointerId)},de=k=>{if(M&&k.pointerId===M.pointerId){let j=k.clientX-M.startX,oe=k.clientY-M.startY;Math.hypot(j,oe)>ud&&(M.moved=!0);let le=pe(s,M.left+j,M.top+oe);s.style.left=`${le.left}px`,s.style.top=`${le.top}px`,M.moved&&k.preventDefault();return}if(I&&k.pointerId===I.pointerId&&Q()){let j=k.clientX-I.startX,oe=k.clientY-I.startY,le=pe(a,I.left+j,I.top+oe);Z=le,a.style.left=`${le.left}px`,a.style.top=`${le.top}px`,k.preventDefault()}},X=k=>{if(!(!M||k.pointerId!==M.pointerId)){if(M.moved){let j=s.getBoundingClientRect(),oe={left:j.left,top:j.top};hd(o,oe),J=!0}M=null,delete s.dataset.dragging}},U=k=>{if(D||!E||!Q()||k.button!==0||k.target?.closest("button"))return;let j=a.getBoundingClientRect();I={pointerId:k.pointerId,startX:k.clientX,startY:k.clientY,left:j.left,top:j.top,moved:!1},c.setPointerCapture?.(k.pointerId),k.preventDefault()},we=k=>{X(k),I&&k.pointerId===I.pointerId&&(I=null)},Tt=()=>{let k=s.getBoundingClientRect();if(s.style.left&&s.style.top&&Ee({left:k.left,top:k.top}),!Q()){Z=null,a.style.left="",a.style.top="";return}Z?(Z=pe(a,Z.left,Z.top),a.style.left=`${Z.left}px`,a.style.top=`${Z.top}px`):ve()},ct=k=>{k.key==="Escape"&&E&&Te()};s.addEventListener("click",Jt),s.addEventListener("pointerdown",St),c.addEventListener("pointerdown",U),u.addEventListener("click",Te),t.addEventListener("pointermove",de),t.addEventListener("pointerup",we),t.addEventListener("pointercancel",we),t.addEventListener("keydown",ct),o.addEventListener("resize",Tt),t.head.append(i),t.body.append(a,s),Ee(pd(o)),ve(),Ue();let ke=()=>{D||(D=!0,v?.destroy(),v=null,s.removeEventListener("click",Jt),s.removeEventListener("pointerdown",St),c.removeEventListener("pointerdown",U),u.removeEventListener("click",Te),t.removeEventListener("pointermove",de),t.removeEventListener("pointerup",we),t.removeEventListener("pointercancel",we),t.removeEventListener("keydown",ct),o.removeEventListener("resize",Tt),n.removeEventListener("pagehide",ke),s.remove(),a.remove(),i.remove(),r?.[Tr]===ke&&delete r[Tr])};if(n.addEventListener("pagehide",ke),r&&(r[Tr]=ke),D)throw new Error("Calendar shell was destroyed before initialization");let Ae=k=>{if(W=k,v||D)return;let j=t.createElement("main");j.dataset.calendarCoreState="waiting",j.setAttribute("role","status"),j.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;box-sizing:border-box;text-align:center;gap:12px;color:#604b35;background:#f6f0e4;";let oe=t.createElement("strong");oe.textContent="\u65E5\u5386\u5C1A\u672A\u521D\u59CB\u5316",oe.style.fontSize="18px";let le=t.createElement("span");le.textContent=k,le.style.cssText="font-size:13px;line-height:1.6;max-width:350px;",j.append(oe,le),C.replaceChildren(j)},Xt=async k=>{if(D||v)return;let j=await fa(C,{session:k,weekdayLabels:e.weekdayLabels,maxVisibleOccurrences:e.maxVisibleOccurrences,onSelectedDateChange:e.onSelectedDateChange});D?j.destroy():v=j};return e.session?await Xt(e.session):Ae(W),{open:je,close:Te,toggle:bt,isOpen:()=>E,activateSession:Xt,showPending:Ae,refresh:()=>v?v.refresh():Promise.resolve(null),destroy:ke}}function $n(e){return{ready:!1,message:e}}function ga(e,t=[]){let n=e.getLastMessageId();if(!Number.isInteger(n)||n<0)return $n("\u7B49\u5F85\u804A\u5929\u6D88\u606F\u53CA\u4E16\u754C\u65F6\u95F4\u521D\u59CB\u5316");let r;try{r=new At(e).readLatest()}catch{return $n("\u7B49\u5F85\u5F53\u524D\u6D88\u606F\u53D8\u91CF\u5C31\u7EEA")}let o=Be(r,"calendar.now"),i=Be(r,"calendar.weekAnchor");if(o!=null&&i!==void 0&&i!==null){let s=$r(o),a=Ci(i);if(s&&a&&a.weekday<=6)try{return G(s.date),G(a.date),{ready:!0,currentDate:{...s.date},weekAnchor:a,timePath:"calendar.now",profileId:"structured"}}catch{}}for(let s of t){let a=s.match(r);if(a)return{ready:!0,currentDate:a.currentDate,weekAnchor:a.weekAnchor,timePath:a.timePath,profileId:a.profileId,timeParser:a.timeParser}}for(let s of t){let a=s.diagnostic?.(r);if(a)return $n(a)}return $n(o!==void 0||i!==void 0?"calendar.now / calendar.weekAnchor \u672A\u5B8C\u6574\u521D\u59CB\u5316\u6216\u683C\u5F0F\u65E0\u6548":"\u7B49\u5F85\u6709\u6548\u7684\u65E5\u5386\u65F6\u95F4\u6570\u636E\u6216\u5DF2\u5B89\u88C5\u7684 Profile")}var Ar=Object.freeze({worldTime:"stat_data.\u4E16\u754C.\u65F6\u95F4",location:"stat_data.\u4E16\u754C.\u5730\u70B9",eventState:"stat_data.\u4E8B\u4EF6",completedEvents:"stat_data.\u4E8B\u4EF6.\u5DF2\u5B8C\u6210\u4E8B\u4EF6",eventSignals:"stat_data.\u4E8B\u4EF6.\u4FE1\u53F7"}),gd={\u65E5:0,\u5929:0,\u4E00:1,\u4E8C:2,\u4E09:3,\u56DB:4,\u4E94:5,\u516D:6};function Po(e){if(typeof e!="string")return null;let t=e.trim().match(/^(?:[^\d\n]*?)(\d{1,6})年\s*[-－—–]?\s*(\d{1,2})月\s*[-－—–]?\s*(\d{1,2})日\s*[-－—–]?\s*(?:星期|周)([日天一二三四五六])\s*[-－—–]?\s*(\d{1,2})[:：](\d{2})\s*$/);if(!t)return null;let[,n,r,o,i,s,a]=t,c={year:Number(n),month:Number(r),day:Number(o)},f=Number(s),u=Number(a),p=gd[i??""];if(p===void 0||f>23||u>59)return null;try{G(c)}catch{return null}return{point:{date:c,time:{hour:f,minute:u}},weekAnchor:{date:{...c},weekday:p}}}var ya=e=>Po(e)?.point??null,Io={id:"fate-poem",label:"\u547D\u5B9A\u4E4B\u8BD7",match(e){let t=Be(e,Ar.worldTime),n=Po(t);return n?{profileId:this.id,timePath:Ar.worldTime,timeParser:ya,currentDate:{...n.point.date},weekAnchor:n.weekAnchor}:null},diagnostic(e){let t=Be(e,Ar.worldTime);return typeof t=="string"&&t.trim()?"\u547D\u5B9A\u4E4B\u8BD7\u4E16\u754C\u65F6\u95F4\u65E0\u6CD5\u89E3\u6790\uFF1B\u68C0\u67E5\u5E74\u3001\u6708\u3001\u65E5\u3001\u661F\u671F\u53CA 24 \u5C0F\u65F6\u65F6\u95F4":null}};var _a=[Io];var yd="mobile-v3-st-preview \xB7 2026-10-23";function Vr(e,t){let n=globalThis.toastr;try{n?.[e]?.(t,"CalendarCore V3")}catch{}}async function _d(){console.info("[CalendarCore]",yd,"script started"),Vr("info","V3 \u6D4B\u8BD5\u7248\u5DF2\u542F\u52A8\uFF0C\u6B63\u5728\u68C0\u67E5\u5386\u6CD5\u53D8\u91CF"),window.CalendarCoreRuntime?.destroy();let e=await ma({pendingMessage:"\u7B49\u5F85\u4E16\u754C\u65F6\u95F4\u6216\u65E5\u5386 Profile \u521D\u59CB\u5316",buttonLabel:"\u{1F4C5}",buttonTitle:"Calendar",weekdayLabels:["\u65E5","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D"]}),t=!1,n=!1,r=!1,o,i="",s=async()=>{if(!(t||n||r)){r=!0;try{let c;try{c=Ho()}catch{e.showPending("\u7B49\u5F85 SillyTavern \u6D88\u606F\u53D8\u91CF\u63A5\u53E3\u5C31\u7EEA");return}let f=ga(c,_a);if(!f.ready){e.showPending(f.message);return}let u=new Zn({runtime:c,timePath:f.timePath,...f.timeParser?{timeParser:f.timeParser}:{}});u.registerModule({adapter:Yo,path:"calendar.modules.event",parser:Go}),u.registerModule({adapter:qo,path:"calendar.modules.appointment",parser:Jo}),u.registerModule({adapter:Xo,path:"calendar.modules.birthday",parser:Zo}),u.registerModule({adapter:Qo,path:"calendar.modules.anniversary",parser:ei}),u.registerModule({adapter:ti,path:"calendar.modules.class",parser:ni}),u.registerModule({adapter:ri,path:"calendar.modules.reminder",parser:oi}),u.registerModule({adapter:ii,path:"calendar.modules.history",parser:si}),u.registerModule({adapter:zo,path:"calendar.modules.festival",parser:Ko});let p=await u.createMonthSession({weekAnchor:f.weekAnchor,selectedDate:f.currentDate});if(await e.activateSession(p),t)return;n=!0,Vr("success","\u4E16\u754C\u5386\u6CD5\u5DF2\u8F7D\u5165\uFF0C\u53EF\u4EE5\u6253\u5F00\u65E5\u5386"),o!==void 0&&(window.clearInterval(o),o=void 0)}catch(c){let f=c instanceof Error?c.message:String(c);e.showPending("\u5386\u6CD5\u6570\u636E\u5DF2\u8BFB\u53D6\uFF0C\u4F46\u65E5\u5386\u52A0\u8F7D\u5931\u8D25\uFF1A"+f),i!==f&&(console.warn("[CalendarCore] Waiting to recover from initialization error",c),Vr("error","\u5386\u6CD5\u6570\u636E\u52A0\u8F7D\u9047\u5230\u95EE\u9898\uFF1A"+f),i=f)}finally{r=!1}}},a={destroy:()=>{t||(t=!0,o!==void 0&&window.clearInterval(o),e.destroy(),window.CalendarCoreRuntime===a&&delete window.CalendarCoreRuntime)},refresh:async()=>(n||await s(),e.refresh())};window.CalendarCoreRuntime=a,o=window.setInterval(()=>{s()},2e3),await s()}_d().catch(e=>{console.error("[CalendarCore] Failed to mount calendar shell",e);let t=e instanceof Error?e.message:String(e);Vr("error","\u672A\u80FD\u5EFA\u7ACB\u65E5\u5386\u6D6E\u7A97\uFF1A"+t)});})();
/*! Bundled license information:

@vue/shared/dist/shared.esm-bundler.js:
  (**
  * @vue/shared v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/reactivity/dist/reactivity.esm-bundler.js:
  (**
  * @vue/reactivity v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-core/dist/runtime-core.esm-bundler.js:
  (**
  * @vue/runtime-core v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

@vue/runtime-dom/dist/runtime-dom.esm-bundler.js:
  (**
  * @vue/runtime-dom v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)

vue/dist/vue.runtime.esm-bundler.js:
  (**
  * vue v3.5.43
  * (c) 2018-present Yuxi (Evan) You and Vue contributors
  * @license MIT
  **)
*/

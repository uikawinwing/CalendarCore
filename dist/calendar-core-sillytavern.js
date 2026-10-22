"use strict";(()=>{function Po(){let e=globalThis;if(typeof e.getLastMessageId!="function")throw new Error("SillyTavern getLastMessageId API is unavailable");if(typeof e.getVariables!="function")throw new Error("SillyTavern getVariables API is unavailable");let t=e.getLastMessageId,n=e.getVariables,r=e.Mvu?.getMvuData;return{getLastMessageId:()=>t(),getVariables:o=>n(o),...r?{getMvuData:o=>r.call(e.Mvu,o)}:{}}}function Mr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var kt=class{constructor(t){this.runtime=t}runtime;readLatest(){let t=this.runtime.getLastMessageId();if(!Number.isInteger(t)||t<0)throw new Error(`SillyTavern returned an invalid latest message id: ${String(t)}`);let n={type:"message",message_id:t},r=null;if(this.runtime.getMvuData)try{let o=this.runtime.getMvuData(n);if(Mr(o)&&(r=o,"calendar"in o))return o}catch{}try{let o=this.runtime.getVariables(n);if(Mr(o))return"calendar"in o?o:r??o}catch(o){if(r)return r;throw o}if(r)return r;throw new Error("SillyTavern message variables are not an object")}};function bt(e,t){let n=typeof t=="string"?t.split(".").map(o=>o.trim()).filter(Boolean):[...t],r=e;for(let o of n){if(!Mr(r)||!(o in r))return;r=r[o]}return r}function Rr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function tn(e,t){let n=e[t];return Number.isInteger(n)?Number(n):null}function $o(e){if(!Rr(e))return null;let t=tn(e,"year"),n=tn(e,"month"),r=tn(e,"day");return t===null||n===null||r===null?null:{year:t,month:n,day:r}}function pa(e){if(typeof e>"u")return;if(!Rr(e))return null;let t=tn(e,"hour"),n=tn(e,"minute");return t===null||n===null?null:{hour:t,minute:n}}var Ir=e=>{if(!Rr(e))return null;let t="date"in e?$o(e.date):$o(e);if(!t)return null;let n=pa(e.time);return n===null?null:{date:t,...n?{time:n}:{}}},Un=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser??Ir}getCurrentPoint(){let t=this.reader.readLatest(),n=bt(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse current calendar time at message variable path "${o}"`)}return r}};var jn=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser}load(){let t=this.reader.readLatest(),n=bt(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse calendar module data at message variable path "${o}"`)}return r}};function Bn(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function ha(e,t){return e.month-t.month||e.day-t.day}function Lo(e,t){return Bn(t,"festival anchorYear"),Bn(e.month,"festival month"),Bn(e.day,"festival day"),{year:t,month:e.month,day:e.day}}function Fo(e,t,n){let r=t??e,o=ha(r,e)<0?n+1:n;return{start:{date:Lo(e,n)},end:{date:Lo(r,o)}}}function Ho(e){if(e!==null)return Bn(e,"festival repeatEveryYears"),{frequency:"yearly",interval:e}}function ma(e,t){let n=t.anchorYear??e.anchorYear,r=t.repeatEveryYears===void 0?e.repeatEveryYears:t.repeatEveryYears,o=Ho(r);return{id:`${e.id}:stage:${t.id}`,moduleId:"festival",kind:"festival-stage",title:`${e.title} \xB7 ${t.title}`,...Fo(t.start,t.end,n),allDay:!0,...o?{recurrence:o}:{},tags:["festival","festival-stage"],payload:{role:"stage",festivalId:e.id,stageId:t.id,stageTitle:t.title,summary:t.summary??"",metadata:t.metadata??{}}}}var Uo={moduleId:"festival",normalize(e){let t=Ho(e.repeatEveryYears);return[{id:e.id,moduleId:this.moduleId,kind:"festival",title:e.title,...Fo(e.start,e.end,e.anchorYear),allDay:!0,...t?{recurrence:t}:{},tags:["festival",...e.tags??[]],payload:{role:"festival",summary:e.summary??"",relatedBookIds:[...e.relatedBookIds??[]],locationKeywords:[...e.locationKeywords??[]],metadata:e.metadata??{}}},...(e.stages??[]).map(r=>ma(e,r))]}};function nn(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Et(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function At(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function ga(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Et(n);if(!r)return null;t.push(r)}return t}function Wn(e){if(!nn(e))return null;let t=At(e.month),n=At(e.day);return t&&n?{month:t,day:n}:null}function ya(e){if(!nn(e))return null;let t=Et(e.id),n=Et(e.title),r=Wn(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Wn(e.end);if(!i)return null;o.end=i}if("anchorYear"in e&&typeof e.anchorYear<"u"){let i=At(e.anchorYear);if(!i)return null;o.anchorYear=i}if("repeatEveryYears"in e)if(e.repeatEveryYears===null)o.repeatEveryYears=null;else{let i=At(e.repeatEveryYears);if(!i)return null;o.repeatEveryYears=i}if("summary"in e&&typeof e.summary<"u"){let i=Et(e.summary);if(!i)return null;o.summary=i}if("metadata"in e&&typeof e.metadata<"u"){if(!nn(e.metadata))return null;o.metadata={...e.metadata}}return o}function _a(e){if(!nn(e))return null;let t=Et(e.id),n=Et(e.title),r=Wn(e.start),o=At(e.anchorYear);if(!t||!n||!r||!o)return null;let i=1;if("repeatEveryYears"in e)if(e.repeatEveryYears===null)i=null;else{let a=At(e.repeatEveryYears);if(!a)return null;i=a}let s={id:t,title:n,start:r,anchorYear:o,repeatEveryYears:i};if("end"in e&&typeof e.end<"u"){let a=Wn(e.end);if(!a)return null;s.end=a}if("summary"in e&&typeof e.summary<"u"){let a=Et(e.summary);if(!a)return null;s.summary=a}for(let a of["tags","relatedBookIds","locationKeywords"])if(a in e&&typeof e[a]<"u"){let c=ga(e[a]);if(!c)return null;s[a]=c}if("metadata"in e&&typeof e.metadata<"u"){if(!nn(e.metadata))return null;s.metadata={...e.metadata}}if("stages"in e&&typeof e.stages<"u"){if(!Array.isArray(e.stages))return null;let a=[];for(let c of e.stages){let f=ya(c);if(!f)return null;a.push(f)}s.stages=a}return s}function jo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=_a(n);if(!r)return null;t.push(r)}return t}var Bo={moduleId:"event",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"event",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{summary:e.summary??"",metadata:e.metadata??{}}}}};function re(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function j(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function Vt(e){return typeof e=="boolean"?e:null}function zn(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function me(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=j(n);if(!r)return null;t.push(r)}return t}function Ce(e){return re(e)?{...e}:null}function Mt(e){if(!re(e))return null;let t=zn(e.year),n=zn(e.month),r=zn(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function ba(e){if(!re(e))return null;let t=Number.isInteger(e.hour)?Number(e.hour):null,n=Number.isInteger(e.minute)?Number(e.minute):null;return t===null||n===null||t<0||t>23||n<0||n>59?null:{hour:t,minute:n}}function Se(e){if(!re(e))return null;let t=Mt(e.date);if(!t)return null;if("time"in e&&typeof e.time<"u"){let n=ba(e.time);return n?{date:t,time:n}:null}return{date:t}}var Ea=new Set(["daily","weekly","monthly","yearly"]);function dt(e){if(!re(e))return null;let t=typeof e.frequency=="string"&&Ea.has(e.frequency)?e.frequency:null;if(!t)return null;let n={frequency:t};if("interval"in e&&typeof e.interval<"u"){let r=zn(e.interval);if(!r)return null;n.interval=r}if("until"in e&&typeof e.until<"u"){let r=Mt(e.until);if(!r)return null;n.until=r}return n}function va(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Se(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Se(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Vt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=dt(e.recurrence);if(!i)return null;o.recurrence=i}if("summary"in e&&typeof e.summary<"u"){let i=j(e.summary);if(!i)return null;o.summary=i}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function Wo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=va(n);if(!r)return null;t.push(r)}return t}var zo={moduleId:"appointment",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"appointment",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{location:e.location??"",attendees:[...e.attendees??[]],notes:e.notes??"",metadata:e.metadata??{}}}}};function wa(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Se(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Se(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Vt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=dt(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["location","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("attendees"in e&&typeof e.attendees<"u"){let i=me(e.attendees);if(!i)return null;o.attendees=i}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function Ko(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=wa(n);if(!r)return null;t.push(r)}return t}var Yo={moduleId:"birthday",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"birthday",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{subject:e.subject??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function xa(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Mt(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["subject","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function Go(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=xa(n);if(!r)return null;t.push(r)}return t}var qo={moduleId:"anniversary",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"anniversary",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{category:e.category??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function Ca(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Mt(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["category","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function Jo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ca(n);if(!r)return null;t.push(r)}return t}var Xo={moduleId:"class",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"class",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{courseId:e.courseId??"",instructor:e.instructor??"",location:e.location??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function Na(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Se(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Se(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=Vt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=dt(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["courseId","instructor","location","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function Zo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Na(n);if(!r)return null;t.push(r)}return t}var Qo={moduleId:"reminder",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"reminder",title:e.title,start:e.at,allDay:!e.at.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{message:e.message??"",target:e.target?{...e.target}:null,metadata:e.metadata??{}}}}};function Kn(e){if(!re(e))return null;let t=j(e.moduleId),n=j(e.eventId);return t&&n?{moduleId:t,eventId:n}:null}function Da(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Se(e.at);if(!t||!n||!r)return null;let o={id:t,title:n,at:r};if("recurrence"in e&&typeof e.recurrence<"u"){let i=dt(e.recurrence);if(!i)return null;o.recurrence=i}if("message"in e&&typeof e.message<"u"){let i=j(e.message);if(!i)return null;o.message=i}if("target"in e&&typeof e.target<"u"){let i=Kn(e.target);if(!i)return null;o.target=i}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function ei(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Da(n);if(!r)return null;t.push(r)}return t}var ti={moduleId:"history",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"history",title:e.title,start:e.occurredAt,allDay:!e.occurredAt.time,tags:[...e.tags??[]],payload:{source:e.source?{...e.source}:null,outcome:e.outcome??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function Oa(e){if(!re(e))return null;let t=j(e.id),n=j(e.title),r=Se(e.occurredAt);if(!t||!n||!r)return null;let o={id:t,title:n,occurredAt:r};if("source"in e&&typeof e.source<"u"){let i=Kn(e.source);if(!i)return null;o.source=i}for(let i of["outcome","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=me(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=Ce(e.metadata);if(!i)return null;o.metadata=i}return o}function ni(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Oa(n);if(!r)return null;t.push(r)}return t}function Yn(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function Sa(e){return Yn(e,"year"),e%400===0||e%4===0&&e%100!==0}var ee={id:"gregorian",daysInWeek:7,monthsInYear(e){return Yn(e,"year"),12},daysInMonth(e,t){if(Yn(e,"year"),Yn(t,"month"),t>12)throw new RangeError("month must be between 1 and 12 for the Gregorian calendar");return t===2?Sa(e)?29:28:[4,6,9,11].includes(t)?30:31}};function Rt(e,t){if(!Number.isInteger(e))throw new RangeError(`${t} must be an integer`)}function oi(e,t){if(!Number.isInteger(e.daysInWeek)||e.daysInWeek<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid week length`);let n=e.monthsInYear(t);if(!Number.isInteger(n)||n<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid month count`)}function vt(e,t,n){let r=e.daysInMonth(t,n);if(!Number.isInteger(r)||r<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid day count`);return r}function ut(e){return{year:e.year,month:e.month,day:e.day}}function Q(e,t=ee){if(Rt(e.year,"year"),Rt(e.month,"month"),Rt(e.day,"day"),e.year<1)throw new RangeError("year must be at least 1");oi(t,e.year);let n=t.monthsInYear(e.year);if(e.month<1||e.month>n)throw new RangeError(`month must be between 1 and ${n} for calendar "${t.id}"`);let r=vt(t,e.year,e.month);if(e.day<1||e.day>r)throw new RangeError(`day must be between 1 and ${r} for ${e.year}-${e.month}`)}function se(e,t){return e.year!==t.year?e.year-t.year:e.month!==t.month?e.month-t.month:e.day-t.day}function Pr(e,t){return se(e,t)===0}function ii(e,t){let n=t.monthsInYear(e.year);return e.month<n?{year:e.year,month:e.month+1}:{year:e.year+1,month:1}}function si(e,t){if(e.month>1)return{year:e.year,month:e.month-1};if(e.year<=1)throw new RangeError("CalendarCore does not support dates before year 1");let n=e.year-1;return{year:n,month:t.monthsInYear(n)}}function Qe(e,t,n=ee){Rt(t,"delta"),Q(e,n);let r=ut(e);if(t>0){let i=t;for(;i>0;){let a=vt(n,r.year,r.month)-r.day;if(i<=a)return r.day+=i,r;i-=a+1,r={...ii(r,n),day:1}}return r}let o=-t;for(;o>0;){if(o<r.day)return r.day-=o,r;o-=r.day;let i=si(r,n);r={...i,day:vt(n,i.year,i.month)}}return r}function Gn(e,t,n=ee){Rt(t,"delta"),Q(e,n);let r={year:e.year,month:e.month},o=Math.sign(t);for(let i=Math.abs(t);i>0;i-=1)r=o>0?ii(r,n):si(r,n);return{...r,day:Math.min(e.day,vt(n,r.year,r.month))}}function ai(e,t,n=ee){Rt(t,"delta"),Q(e,n);let r=e.year+t;if(r<1)throw new RangeError("CalendarCore does not support dates before year 1");let o=Math.min(e.month,n.monthsInYear(r));return{year:r,month:o,day:Math.min(e.day,vt(n,r,o))}}function ri(e,t){Q(e,t);let n=0;for(let r=1;r<e.year;r+=1){oi(t,r);let o=t.monthsInYear(r);for(let i=1;i<=o;i+=1)n+=vt(t,r,i)}for(let r=1;r<e.month;r+=1)n+=vt(t,e.year,r);return n+e.day-1}function Ta(e,t,n=ee){return ri(t,n)-ri(e,n)}function qn(e,t,n=ee){if(Q(t.date,n),Q(e,n),!Number.isInteger(t.weekday)||t.weekday<0||t.weekday>=n.daysInWeek)throw new RangeError(`weekday must be between 0 and ${n.daysInWeek-1}`);return((t.weekday+Ta(t.date,e,n))%n.daysInWeek+n.daysInWeek)%n.daysInWeek}function $r(e,t){return se(e.start,t.end)<=0&&se(e.end,t.start)>=0}function li(e,t){return se(e,t.start)>=0&&se(e,t.end)<=0}function Jn(e,t=ee){if(Q(e.start,t),Q(e.end,t),se(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end");let n=[],r=ut(e.start);for(;se(r,e.end)<=0;)n.push(ut(r)),r=Qe(r,1,t);return n}function rn(e){let t=n=>String(n).padStart(2,"0");return`${e.year}-${t(e.month)}-${t(e.day)}`}function ka(e,t){if(Q(e.start,t),Q(e.end,t),se(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end")}function fi(e){let t=e.recurrence?.interval??1;if(!Number.isInteger(t)||t<1)throw new RangeError("Calendar recurrence interval must be a positive integer");return t}function Aa(e,t,n,r){let o=t.recurrence;if(!o||n===0)return e;let i=fi(t)*n;switch(o.frequency){case"daily":return Qe(e,i,r);case"weekly":return Qe(e,i*r.daysInWeek,r);case"monthly":return Gn(e,i,r);case"yearly":return ai(e,i,r)}}function ci(e,t,n,r){return{date:Aa(e.date,t,n,r),...e.time?{time:{...e.time}}:{}}}function di(e,t,n){let r=ci(e.start,e,t,n),o=e.end?ci(e.end,e,t,n):void 0;if(o&&se(o.date,r.date)<0)throw new RangeError("Calendar event end must not be before start");return{event:e,occurrenceIndex:t,start:r,...o?{end:o}:{}}}function ui(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function pi(e,t,n=ee){if(ka(t,n),Q(e.start.date,n),e.end&&(Q(e.end.date,n),se(e.end.date,e.start.date)<0))throw new RangeError("Calendar event end must not be before start");if(!e.recurrence){let s=di(e,0,n);return $r(ui(s),t)?[s]:[]}fi(e);let r=e.recurrence.until;if(r&&(Q(r,n),se(r,e.start.date)<0))throw new RangeError("Calendar recurrence until must not be before event start");if(!Number.isInteger(n.daysInWeek)||n.daysInWeek<1)throw new RangeError('Calendar system "'+n.id+'" returned an invalid week length');let o=[],i=0;for(;;){let s=di(e,i,n);if(se(s.start.date,t.end)>0||r&&se(s.start.date,r)>0)break;$r(ui(s),t)&&o.push(s),i+=1}return o}function Va(e,t){return!e&&!t?0:e?t?e.hour-t.hour||e.minute-t.minute:1:-1}function hi(e,t,n=ee){return e.flatMap(r=>pi(r,t,n)).sort((r,o)=>{let i=se(r.start.date,o.start.date);if(i!==0)return i;let s=Va(r.start.time,o.start.time);return s!==0?s:r.event.title.localeCompare(o.event.title)||r.event.id.localeCompare(o.event.id)||r.occurrenceIndex-o.occurrenceIndex})}function Ma(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function mi(e,t,n=ee){return Jn(t,n).map(r=>({date:r,occurrences:e.filter(o=>li(r,Ma(o)))}))}function on(e,t){if(!e.trim())throw new Error(`CalendarEvent.${t} must not be empty`)}function Ra(e,t){if(on(e.id,"id"),on(e.moduleId,"moduleId"),on(e.kind,"kind"),on(e.title,"title"),e.moduleId!==t)throw new Error(`Adapter "${t}" returned event for module "${e.moduleId}"`);return e}var Xn=class{adapters=new Map;register(t){if(on(t.moduleId,"moduleId"),this.adapters.has(t.moduleId))throw new Error(`Calendar module already registered: ${t.moduleId}`);this.adapters.set(t.moduleId,t)}has(t){return this.adapters.has(t)}normalize(t,n){let r=this.adapters.get(t);if(!r)throw new Error(`Calendar module is not registered: ${t}`);let o=r.normalize(n);return(Array.isArray(o)?o:[o]).map(s=>Ra(s,t))}};var Zn=class{registry=new Xn;loaders=new Map;timeSource;calendarSystem;constructor(t){this.timeSource=t.timeSource,this.calendarSystem=t.calendarSystem??ee}registerModule(t){let n=t.adapter.moduleId;if(this.loaders.has(n))throw new Error(`Calendar app module already registered: ${n}`);this.registry.register(t.adapter),this.loaders.set(n,async()=>(await t.source.load()).flatMap(o=>this.registry.normalize(n,o)))}hasModule(t){return this.loaders.has(t)}async loadEvents(){return(await Promise.all([...this.loaders.values()].map(n=>n()))).flat()}async buildSnapshot(t){let[n,r]=await Promise.all([this.timeSource.getCurrentPoint(),this.loadEvents()]),o=hi(r,t,this.calendarSystem);return{now:n,range:t,events:r,occurrences:o,days:mi(o,t,this.calendarSystem)}}};function gi(e){return{date:{...e.date},...e.time?{time:{...e.time}}:{}}}function Ia(e){return{key:[e.event.moduleId,e.event.id,e.occurrenceIndex].join(":"),eventId:e.event.id,occurrenceIndex:e.occurrenceIndex,moduleId:e.event.moduleId,kind:e.event.kind,title:e.event.title,allDay:e.event.allDay??!e.start.time,start:gi(e.start),...e.end?{end:gi(e.end)}:{},tags:[...e.event.tags??[]]}}function yi(e,t,n=!1){return{key:rn(e),date:{...e},isToday:n,occurrences:t.map(Ia)}}function Pa(e,t){let n=e??0;if(!Number.isInteger(n)||n<0||n>=t.daysInWeek)throw new RangeError(`weekStartsOn must be between 0 and ${t.daysInWeek-1}`);return n}function Lr(e){let t=e.calendarSystem??ee,n=Pa(e.weekStartsOn,t),r={year:e.year,month:e.month,day:1};Q(r,t);let o={year:e.year,month:e.month,day:t.daysInMonth(e.year,e.month)},s=(qn(r,e.weekAnchor,t)-n+t.daysInWeek)%t.daysInWeek,a=(n+t.daysInWeek-1)%t.daysInWeek,c=qn(o,e.weekAnchor,t),f=(a-c+t.daysInWeek)%t.daysInWeek;return{start:Qe(r,-s,t),end:Qe(o,f,t)}}function $a(e,t){return se(e.start,t.start)<=0&&se(e.end,t.end)>=0}function _i(e){let t=e.calendarSystem??ee,n=Lr(e);if(!$a(e.snapshot.range,n))throw new RangeError("CalendarAppSnapshot does not cover the complete month grid range");let r=new Map(e.snapshot.days.map(a=>[rn(a.date),a.occurrences])),o=Jn(n,t).map(a=>{let c=rn(a);return{key:c,date:a,weekday:qn(a,e.weekAnchor,t),inCurrentMonth:a.year===e.year&&a.month===e.month,isToday:Pr(a,e.snapshot.now.date),isSelected:e.selectedDate?Pr(a,e.selectedDate):!1,occurrences:r.get(c)??[]}}),i=o.find(a=>a.isSelected),s=i?yi(i.date,i.occurrences,i.isToday):void 0;return{year:e.year,month:e.month,today:{...e.snapshot.now.date},columns:t.daysInWeek,range:n,cells:o,...s?{selectedDay:s}:{}}}var Qn=class{app;weekAnchor;weekStartsOn;calendarSystem;currentMonth;selectedDate;snapshot=null;model=null;constructor(t){this.app=t.app,this.weekAnchor=t.weekAnchor,this.weekStartsOn=t.weekStartsOn,this.calendarSystem=t.calendarSystem??ee;let n={...t.initialMonth,day:1};Q(n,this.calendarSystem),this.currentMonth={year:n.year,month:n.month},t.selectedDate&&(Q(t.selectedDate,this.calendarSystem),this.selectedDate=ut(t.selectedDate))}getCurrentMonth(){return{...this.currentMonth}}getSelectedDate(){return this.selectedDate?ut(this.selectedDate):void 0}getModel(){return this.model}async load(){let t=Lr({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem});return this.snapshot=await this.app.buildSnapshot(t),this.model=this.buildModel(this.snapshot),this.model}async navigateMonths(t){let n=Gn({...this.currentMonth,day:1},t,this.calendarSystem);return this.currentMonth={year:n.year,month:n.month},this.selectedDate&&(this.selectedDate={...this.currentMonth,day:Math.min(this.selectedDate.day,this.calendarSystem.daysInMonth(n.year,n.month))}),this.load()}async goToDate(t){return Q(t,this.calendarSystem),this.selectedDate=ut(t),!this.snapshot||t.year!==this.currentMonth.year||t.month!==this.currentMonth.month?(this.currentMonth={year:t.year,month:t.month},this.load()):(this.model=this.buildModel(this.snapshot),this.model)}async stepSelectedDate(t){let n=this.selectedDate??this.model?.today;if(!n)throw new Error("CalendarMonthSession must be loaded before stepping dates");return this.goToDate(Qe(n,t,this.calendarSystem))}selectDate(t){if(Q(t,this.calendarSystem),!this.snapshot)throw new Error("CalendarMonthSession must be loaded before selecting a date");return this.selectedDate=ut(t),this.model=this.buildModel(this.snapshot),this.model}clearSelectedDate(){if(!this.snapshot)throw new Error("CalendarMonthSession must be loaded before clearing selection");return this.selectedDate=void 0,this.model=this.buildModel(this.snapshot),this.model}buildModel(t){return _i({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:this.selectedDate,snapshot:t})}};var er=class{app;reader;timeSource;calendarSystem;constructor(t){this.reader=new kt(t.runtime),this.timeSource=new Un({reader:this.reader,path:t.timePath,parser:t.timeParser}),this.calendarSystem=t.calendarSystem??ee,this.app=new Zn({timeSource:this.timeSource,calendarSystem:this.calendarSystem})}registerModule(t){this.app.registerModule({adapter:t.adapter,source:new jn({reader:this.reader,path:t.path,parser:t.parser})})}async getCurrentDate(){return{...(await this.timeSource.getCurrentPoint()).date}}async createMonthSession(t){let n=t.initialMonth??await this.getCurrentDate();return new Qn({app:this.app,initialMonth:{year:n.year,month:n.month},weekAnchor:t.weekAnchor,weekStartsOn:t.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:t.selectedDate})}};function bi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Fr(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function La(e){if(!bi(e))return null;let t=Fr(e.year),n=Fr(e.month),r=Fr(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function Ei(e){if(!bi(e))return null;let t=La(e.date),n=Number.isInteger(e.weekday)?Number(e.weekday):null;return!t||n===null||n<0?null:{date:t,weekday:n}}function It(e){let t=Object.create(null);for(let n of e.split(","))t[n]=1;return n=>n in t}var K={},wt=[],ge=()=>{},Hr=()=>!1,Pt=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),$t=e=>e.startsWith("onUpdate:"),ne=Object.assign,an=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},Fa=Object.prototype.hasOwnProperty,H=(e,t)=>Fa.call(e,t),R=Array.isArray,ft=e=>ln(e)==="[object Map]",sn=e=>ln(e)==="[object Set]",vi=e=>ln(e)==="[object Date]";var I=e=>typeof e=="function",te=e=>typeof e=="string",Ie=e=>typeof e=="symbol",z=e=>e!==null&&typeof e=="object",Ur=e=>(z(e)||I(e))&&I(e.then)&&I(e.catch),Ha=Object.prototype.toString,ln=e=>Ha.call(e),jr=e=>ln(e).slice(8,-1),Br=e=>ln(e)==="[object Object]",tr=e=>te(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Lt=It(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");var nr=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},Ua=/-\w/g,ye=nr(e=>e.replace(Ua,t=>t.slice(1).toUpperCase())),ja=/\B([A-Z])/g,et=nr(e=>e.replace(ja,"-$1").toLowerCase()),cn=nr(e=>e.charAt(0).toUpperCase()+e.slice(1)),dn=nr(e=>e?`on${cn(e)}`:""),Ae=(e,t)=>!Object.is(e,t),un=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},Ft=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},Wr=e=>{let t=parseFloat(e);return isNaN(t)?e:t};var wi,pt=()=>wi||(wi=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function fn(e){if(R(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],o=te(r)?Ka(r):fn(r);if(o)for(let i in o)t[i]=o[i]}return t}else if(te(e)||z(e))return e}var Ba=/;(?![^(]*\))/g,Wa=/:([^]+)/,za=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Ka(e){let t={};return e.replace(za,n=>n.startsWith("/*")?"":n).split(Ba).forEach(n=>{if(n){let r=n.split(Wa);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t}function pn(e){let t="";if(te(e))t=e;else if(R(e))for(let n=0;n<e.length;n++){let r=pn(e[n]);r&&(t+=r+" ")}else if(z(e))for(let n in e)e[n]&&(t+=n+" ");return t.trim()}var Ni="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Di=It(Ni),Ya=It(Ni+",async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");function rr(e){return!!e||e===""}function Ga(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let o=0;r&&o<e.length;o++)r=Ht(e[o],t[o],n);return r}function xi(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),o=new Uint8Array(r.length);for(let i of e){let s=-1;for(let a=0;a<r.length;a++)if(!o[a]&&Ht(i,r[a],n)){s=a;break}if(s<0)return!1;o[s]=1}return!0}function qa(e,t,n){let r=ft(e),o=ft(t);if(r||o||(r=sn(e),o=sn(t),r||o))return r&&o?xi(e,t,n):!1;let i=Object.keys(e).length,s=Object.keys(t).length;if(i!==s)return!1;for(let a in e){let c=e.hasOwnProperty(a),f=t.hasOwnProperty(a);if(c&&!f||!c&&f||!Ht(e[a],t[a],n))return!1}return String(e)===String(t)}function Ci(e,t,n,r){n||(n=[new Map,new Map]);let[o,i]=n;if(o.has(e)||i.has(t))return o.get(e)===t&&i.get(t)===e;o.set(e,t),i.set(t,e);let s=r(e,t,n);return o.delete(e),i.delete(t),s}function Ht(e,t,n){if(e===t)return!0;let r=vi(e),o=vi(t);return r||o?r&&o?e.getTime()===t.getTime():!1:(r=Ie(e),o=Ie(t),r||o?e===t:(r=R(e),o=R(t),r||o?r&&o?Ci(e,t,n,Ga):!1:(r=z(e),o=z(t),r||o?!r||!o?!1:Ci(e,t,n,qa):String(e)===String(t))))}function Ja(e,...t){console.warn(`[Vue warn] ${e}`,...t)}var de,yn=class{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!t&&de&&(de.active?(this.parent=de,this.index=(de.scopes||(de.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes){let r=this.scopes.slice();for(t=0,n=r.length;t<n;t++)r[t].pause()}for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes){let o=this.scopes.slice();for(t=0,n=o.length;t<n;t++)o[t].resume()}let r=this.effects.slice();for(t=0,n=r.length;t<n;t++)r[t].resume()}}run(t){if(this._active){let n=de;try{return de=this,t()}finally{de=n}}}on(){++this._on===1&&(this.prevScope=de,de=this)}off(){if(this._on>0&&--this._on===0){if(de===this)de=this.prevScope;else{let t=de;for(;t;){if(t.prevScope===this){t.prevScope=this.prevScope;break}t=t.prevScope}}this.prevScope=void 0}}stop(t){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){let o=this.scopes.slice();for(n=0,r=o.length;n<r;n++)o[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){let o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0}}};function Ti(){return de}var G;var zr=new WeakSet,jt=class{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,de&&(de.active?de.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,zr.has(this)&&(zr.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ai(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Oi(this),Vi(this);let t=G,n=Pe;G=this,Pe=!0;try{return this.fn()}finally{Mi(this),G=t,Pe=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)oo(t);this.deps=this.depsTail=void 0,Oi(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?zr.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Gr(this)&&this.run()}get dirty(){return Gr(this)}},ki=0,mn,gn;function Ai(e,t=!1){if(e.flags|=8,t){e.next=gn,gn=e;return}e.next=mn,mn=e}function no(){ki++}function ro(){if(--ki>0)return;if(gn){let t=gn;for(gn=void 0;t;){let n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;mn;){let t=mn;for(mn=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(r){e||(e=r)}t=n}}if(e)throw e}function Vi(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Mi(e){let t,n=e.depsTail,r=n;for(;r;){let o=r.prevDep;r.version===-1?(r===n&&(n=o),oo(r),Xa(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=o}e.deps=t,e.depsTail=n}function Gr(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Ri(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Ri(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===_n)||(e.globalVersion=_n,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Gr(e))))return;e.flags|=2;let t=e.dep,n=G,r=Pe;G=e,Pe=!0;try{Vi(e);let o=e.fn(e._value);(t.version===0||Ae(o,e._value))&&(e.flags|=128,e._value=o,t.version++)}catch(o){throw t.version++,o}finally{G=n,Pe=r,Mi(e),e.flags&=-3}}function oo(e,t=!1){let{dep:n,prevSub:r,nextSub:o}=e;if(r&&(r.nextSub=o,e.prevSub=void 0),o&&(o.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)oo(i,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Xa(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Pe=!0,Ii=[];function ze(){Ii.push(Pe),Pe=!1}function Ke(){let e=Ii.pop();Pe=e===void 0?!0:e}function Oi(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let n=G;G=void 0;try{t()}finally{G=n}}}var _n=0,qr=class{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},bn=class{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!G||!Pe||G===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==G)n=this.activeLink=new qr(G,this),G.deps?(n.prevDep=G.depsTail,G.depsTail.nextDep=n,G.depsTail=n):G.deps=G.depsTail=n,Pi(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){let r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=G.depsTail,n.nextDep=void 0,G.depsTail.nextDep=n,G.depsTail=n,G.deps===n&&(G.deps=r)}return n}trigger(t){this.version++,_n++,this.notify(t)}notify(t){no();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{ro()}}};function Pi(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let r=t.deps;r;r=r.nextDep)Pi(r)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Jr=new WeakMap,Ct=Symbol(""),Xr=Symbol(""),En=Symbol("");function ue(e,t,n){if(Pe&&G){let r=Jr.get(e);r||Jr.set(e,r=new Map);let o=r.get(n);o||(r.set(n,o=new bn),o.map=r,o.key=n),o.track()}}function We(e,t,n,r,o,i){let s=Jr.get(e);if(!s){_n++;return}let a=c=>{c&&c.trigger()};if(no(),t==="clear")s.forEach(a);else{let c=R(e),f=c&&tr(n);if(c&&n==="length"){let u=Number(r);s.forEach((p,b)=>{(b==="length"||b===En||!Ie(b)&&b>=u)&&a(p)})}else switch((n!==void 0||s.has(void 0))&&a(s.get(n)),f&&a(s.get(En)),t){case"add":c?f&&a(s.get("length")):(a(s.get(Ct)),ft(e)&&a(s.get(Xr)));break;case"delete":c||(a(s.get(Ct)),ft(e)&&a(s.get(Xr)));break;case"set":ft(e)&&a(s.get(Ct));break}}ro()}function Ut(e){let t=U(e);return t===e||(ue(t,"iterate",En),Te(e))?t:$e(e)?rt(e)?t.map(n=>ht(Le(n))):t.map(ht):t.map(Le)}function ur(e){return ue(e=U(e),"iterate",En),e}function Be(e,t){return $e(e)?ht(rt(e)?Le(t):t):Le(t)}var Za={__proto__:null,[Symbol.iterator](){return Kr(this,Symbol.iterator,e=>Be(this,e))},concat(...e){return Ut(this).concat(...e.map(t=>R(t)?Ut(t):t))},entries(){return Kr(this,"entries",e=>(e[1]=Be(this,e[1]),e))},every(e,t){return tt(this,"every",e,t,void 0,arguments)},filter(e,t){return tt(this,"filter",e,t,n=>n.map(r=>Be(this,r)),arguments)},find(e,t){return tt(this,"find",e,t,n=>Be(this,n),arguments)},findIndex(e,t){return tt(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return tt(this,"findLast",e,t,n=>Be(this,n),arguments)},findLastIndex(e,t){return tt(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return tt(this,"forEach",e,t,void 0,arguments)},includes(...e){return Yr(this,"includes",e)},indexOf(...e){return Yr(this,"indexOf",e)},join(e){return Ut(this).join(e)},lastIndexOf(...e){return Yr(this,"lastIndexOf",e)},map(e,t){return tt(this,"map",e,t,void 0,arguments)},pop(){return hn(this,"pop")},push(...e){return hn(this,"push",e)},reduce(e,...t){return Si(this,"reduce",e,t)},reduceRight(e,...t){return Si(this,"reduceRight",e,t)},shift(){return hn(this,"shift")},some(e,t){return tt(this,"some",e,t,void 0,arguments)},splice(...e){return hn(this,"splice",e)},toReversed(){return Ut(this).toReversed()},toSorted(e){return Ut(this).toSorted(e)},toSpliced(...e){return Ut(this).toSpliced(...e)},unshift(...e){return hn(this,"unshift",e)},values(){return Kr(this,"values",e=>Be(this,e))}};function Kr(e,t,n){let r=ur(e),o=r[t]();return r!==e&&!Te(e)&&(o._next=o.next,o.next=()=>{let i=o._next();return i.done||(i.value=n(i.value)),i}),o}var Qa=Array.prototype;function tt(e,t,n,r,o,i){let s=ur(e),a=s!==e&&!Te(e),c=s[t];if(c!==Qa[t]){let p=c.apply(e,i);return a?Le(p):p}let f=n;s!==e&&(a?f=function(p,b){return n.call(this,Be(e,p),b,e)}:n.length>2&&(f=function(p,b){return n.call(this,p,b,e)}));let u=c.call(s,f,r);return a&&o?o(u):u}function Si(e,t,n,r){let o=ur(e),i=o!==e&&!Te(e),s=n,a=!1;o!==e&&(i?(a=r.length===0,s=function(f,u,p){return a&&(a=!1,f=Be(e,f)),n.call(this,f,Be(e,u),p,e)}):n.length>3&&(s=function(f,u,p){return n.call(this,f,u,p,e)}));let c=o[t](s,...r);return a?Be(e,c):c}function Yr(e,t,n){let r=U(e);ue(r,"iterate",En);let o=r[t](...n);return(o===-1||o===!1)&&wn(n[0])?(n[0]=U(n[0]),r[t](...n)):o}function hn(e,t,n=[]){ze(),no();let r=U(e)[t].apply(e,n);return ro(),Ke(),r}var el=It("__proto__,__v_isRef,__isVue"),$i=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Ie));function tl(e){Ie(e)||(e=String(e));let t=U(this);return ue(t,"has",e),t.hasOwnProperty(e)}var ar=class{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,r){if(n==="__v_skip")return t.__v_skip;let o=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!o;if(n==="__v_isReadonly")return o;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(o?i?dl:Hi:i?Fi:Li).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(r)?t:void 0;let s=R(t);if(!o){let c;if(s&&(c=Za[n]))return c;if(n==="hasOwnProperty")return tl}let a=Reflect.get(t,n,le(t)?t:r);if((Ie(n)?$i.has(n):el(n))||(o||ue(t,"get",n),i))return a;if(le(a)){let c=s&&tr(n)?a:a.value;return o&&z(c)?cr(c):c}return z(a)?o?cr(a):vn(a):a}},lr=class extends ar{constructor(t=!1){super(!1,t)}set(t,n,r,o){let i=t[n],s=R(t)&&tr(n);if(!this._isShallow){let f=$e(i);if(!Te(r)&&!$e(r)&&(i=U(i),r=U(r)),!s&&le(i)&&!le(r))return f||(i.value=r),!0}let a=s?Number(n)<t.length:H(t,n),c=Reflect.set(t,n,r,le(t)?t:o);return t===U(o)&&c&&(a?Ae(r,i)&&We(t,"set",n,r,i):We(t,"add",n,r)),c}deleteProperty(t,n){let r=H(t,n),o=t[n],i=Reflect.deleteProperty(t,n);return i&&r&&We(t,"delete",n,void 0,o),i}has(t,n){let r=Reflect.has(t,n);return(!Ie(n)||!$i.has(n))&&ue(t,"has",n),r}ownKeys(t){return ue(t,"iterate",R(t)?"length":Ct),Reflect.ownKeys(t)}},Zr=class extends ar{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}},nl=new lr,rl=new Zr,ol=new lr(!0);var Qr=e=>e,or=e=>Reflect.getPrototypeOf(e);function il(e,t,n){return function(...r){let o=this.__v_raw,i=U(o),s=ft(i),a=e==="entries"||e===Symbol.iterator&&s,c=e==="keys"&&s,f=o[e](...r),u=n?Qr:t?ht:Le;return!t&&ue(i,"iterate",c?Xr:Ct),ne(Object.create(f),{next(){let{value:p,done:b}=f.next();return b?{value:p,done:b}:{value:a?[u(p[0]),u(p[1])]:u(p),done:b}}})}}function ir(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function sl(e,t){let n={get(o){let i=this.__v_raw,s=U(i),a=U(o);e||(Ae(o,a)&&ue(s,"get",o),ue(s,"get",a));let{has:c}=or(s),f=t?Qr:e?ht:Le;if(c.call(s,o))return f(i.get(o));if(c.call(s,a))return f(i.get(a));i!==s&&i.get(o)},get size(){let o=this.__v_raw;return!e&&ue(U(o),"iterate",Ct),o.size},has(o){let i=this.__v_raw,s=U(i),a=U(o);return e||(Ae(o,a)&&ue(s,"has",o),ue(s,"has",a)),o===a?i.has(o):i.has(o)||i.has(a)},forEach(o,i){let s=this,a=s.__v_raw,c=U(a),f=t?Qr:e?ht:Le;return!e&&ue(c,"iterate",Ct),a.forEach((u,p)=>o.call(i,f(u),f(p),s))}};return ne(n,e?{add:ir("add"),set:ir("set"),delete:ir("delete"),clear:ir("clear")}:{add(o){let i=U(this),s=or(i),a=U(o),c=!t&&!Te(o)&&!$e(o)?a:o;return s.has.call(i,c)||Ae(o,c)&&s.has.call(i,o)||Ae(a,c)&&s.has.call(i,a)||(i.add(c),We(i,"add",c,c)),this},set(o,i){!t&&!Te(i)&&!$e(i)&&(i=U(i));let s=U(this),{has:a,get:c}=or(s),f=a.call(s,o);f||(o=U(o),f=a.call(s,o));let u=c.call(s,o);return s.set(o,i),f?Ae(i,u)&&We(s,"set",o,i,u):We(s,"add",o,i),this},delete(o){let i=U(this),{has:s,get:a}=or(i),c=s.call(i,o);c||(o=U(o),c=s.call(i,o));let f=a?a.call(i,o):void 0,u=i.delete(o);return c&&We(i,"delete",o,void 0,f),u},clear(){let o=U(this),i=o.size!==0,s=void 0,a=o.clear();return i&&We(o,"clear",void 0,void 0,s),a}}),["keys","values","entries",Symbol.iterator].forEach(o=>{n[o]=il(o,e,t)}),n}function io(e,t){let n=sl(e,t);return(r,o,i)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?r:Reflect.get(H(n,o)&&o in r?n:r,o,i)}var al={get:io(!1,!1)},ll={get:io(!1,!0)},cl={get:io(!0,!1)};var Li=new WeakMap,Fi=new WeakMap,Hi=new WeakMap,dl=new WeakMap;function ul(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function vn(e){return $e(e)?e:ao(e,!1,nl,al,Li)}function so(e){return ao(e,!1,ol,ll,Fi)}function cr(e){return ao(e,!0,rl,cl,Hi)}function ao(e,t,n,r,o){if(!z(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let i=o.get(e);if(i)return i;let s=ul(jr(e));if(s===0)return e;let a=new Proxy(e,s===2?r:n);return o.set(e,a),a}function rt(e){return $e(e)?rt(e.__v_raw):!!(e&&e.__v_isReactive)}function $e(e){return!!(e&&e.__v_isReadonly)}function Te(e){return!!(e&&e.__v_isShallow)}function wn(e){return e?!!e.__v_raw:!1}function U(e){let t=e&&e.__v_raw;return t?U(t):e}function lo(e){return!H(e,"__v_skip")&&Object.isExtensible(e)&&Ft(e,"__v_skip",!0),e}var Le=e=>z(e)?vn(e):e,ht=e=>z(e)?cr(e):e;function le(e){return e?e.__v_isRef===!0:!1}function mt(e){return Ui(e,!1)}function fr(e){return Ui(e,!0)}function Ui(e,t){return le(e)?e:new eo(e,t)}var eo=class{constructor(t,n){this.dep=new bn,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:U(t),this._value=n?t:Le(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){let n=this._rawValue,r=this.__v_isShallow||Te(t)||$e(t);t=r?t:U(t),Ae(t,n)&&(this._rawValue=t,this._value=r?t:Le(t),this.dep.trigger())}};function co(e){return le(e)?e.value:e}var fl={get:(e,t,n)=>t==="__v_raw"?e:co(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let o=e[t];return le(o)&&!le(n)?(o.value=n,!0):Reflect.set(e,t,n,r)}};function pr(e){return rt(e)?e:new Proxy(e,fl)}var to=class{constructor(t,n,r){this.fn=t,this.setter=n,this._value=void 0,this.dep=new bn(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=_n-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&G!==this)return Ai(this,!0),!0}get value(){let t=this.dep.track();return Ri(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}};function ji(e,t,n=!1){let r,o;return I(e)?r=e:(r=e.get,o=e.set),new to(r,o,n)}var sr={},dr=new WeakMap,xt;function Bi(e,t=!1,n=xt){if(n){let r=dr.get(n);r||dr.set(n,r=[]),r.push(e)}}function Wi(e,t,n=K){let{immediate:r,deep:o,once:i,scheduler:s,augmentJob:a,call:c}=n,f=S=>{(n.onWarn||Ja)("Invalid watch source: ",S,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},u=S=>o?S:Te(S)||o===!1||o===0?nt(S,1):nt(S),p,b,C,v,O=!1,$=!1;if(le(e)?(b=()=>e.value,O=Te(e)):rt(e)?(b=()=>u(e),O=!0):R(e)?($=!0,O=e.some(S=>rt(S)||Te(S)),b=()=>e.map(S=>{if(le(S))return S.value;if(rt(S))return u(S);if(I(S))return c?c(S,2):S()})):I(e)?t?b=c?()=>c(e,2):e:b=()=>{if(C){ze();try{C()}finally{Ke()}}let S=xt;xt=p;try{return c?c(e,3,[v]):e(v)}finally{xt=S}}:b=ge,t&&o){let S=b,Z=o===!0?1/0:o;b=()=>nt(S(),Z)}let q=Ti(),M=()=>{p.stop(),q&&q.active&&an(q.effects,p)};if(i&&t){let S=t;t=(...Z)=>{let fe=S(...Z);return M(),fe}}let P=$?new Array(e.length).fill(sr):sr,X=S=>{if(!(!(p.flags&1)||!p.dirty&&!S))if(t){let Z=p.run();if(S||o||O||($?Z.some((fe,ve)=>Ae(fe,P[ve])):Ae(Z,P))){C&&C();let fe=xt;xt=p;try{let ve=[Z,P===sr?void 0:$&&P[0]===sr?[]:P,v];P=Z,c?c(t,3,ve):t(...ve)}finally{xt=fe}}}else p.run()};return a&&a(X),p=new jt(b),p.scheduler=s?()=>s(X,!1):X,v=S=>Bi(S,!1,p),C=p.onStop=()=>{let S=dr.get(p);if(S){if(c)c(S,4);else for(let Z of S)Z();dr.delete(p)}},t?r?X(!0):P=p.run():s?s(X.bind(null,!0),!0):p.run(),M.pause=p.pause.bind(p),M.resume=p.resume.bind(p),M.stop=M,M}function nt(e,t=1/0,n){if(t<=0||!z(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,le(e))nt(e.value,t,n);else if(R(e))for(let r=0;r<e.length;r++)nt(e[r],t,n);else if(sn(e)||ft(e))e.forEach(r=>{nt(r,t,n)});else if(Br(e)){for(let r in e)nt(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&nt(e[r],t,n)}return e}function Mn(e,t,n,r){try{return r?e(...r):e()}catch(o){Cr(o,t,n)}}function Me(e,t,n,r){if(I(e)){let o=Mn(e,t,n,r);return o&&Ur(o)&&o.catch(i=>{Cr(i,t,n)}),o}if(R(e)){let o=[];for(let i=0;i<e.length;i++)o.push(Me(e[i],t,n,r));return o}}function Cr(e,t,n,r=!0){let o=t?t.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:s}=t&&t.appContext.config||K;if(t){let a=t.parent,c=t.proxy,f=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){let u=a.ec;if(u){for(let p=0;p<u.length;p++)if(u[p](e,c,f)===!1)return}a=a.parent}if(i){ze(),Mn(i,null,10,[e,c,f]),Ke();return}}gl(e,n,o,r,s)}function gl(e,t,n,r=!0,o=!1){if(o)throw e;console.error(e)}var be=[],Ge=-1,Wt=[],gt=null,Bt=0,ss=Promise.resolve(),gr=null;function Rn(e){let t=gr||ss;return e?t.then(this?e.bind(this):e):t}function yl(e){let t=Ge+1,n=be.length;for(;t<n;){let r=t+n>>>1,o=be[r],i=kn(o);i<e||i===e&&o.flags&2?t=r+1:n=r}return t}function Eo(e){if(!(e.flags&1)){let t=kn(e),n=be[be.length-1];!n||!(e.flags&2)&&t>=kn(n)?be.push(e):be.splice(yl(t),0,e),e.flags|=1,as()}}function as(){gr||(gr=ss.then(ds))}function ls(e){if(!R(e))gt&&e.id===-1?gt.splice(Bt+1,0,e):e.flags&1||(Wt.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)Wt.push(e[t]);as()}function zi(e,t,n=Ge+1){for(;n<be.length;n++){let r=be[n];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;be.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function cs(e){if(Wt.length){let t=[...new Set(Wt)].sort((n,r)=>kn(n)-kn(r));if(Wt.length=0,gt){for(let n=0;n<t.length;n++)gt.push(t[n]);return}for(gt=t,Bt=0;Bt<gt.length;Bt++){let n=gt[Bt];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}gt=null,Bt=0}}var kn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function ds(e){let t=ge;try{for(Ge=0;Ge<be.length;Ge++){let n=be[Ge];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),Mn(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;Ge<be.length;Ge++){let n=be[Ge];n&&(n.flags&=-2)}Ge=-1,be.length=0,cs(e),gr=null,(be.length||Wt.length)&&ds(e)}}var Je,Cn=[],mo=!1;function Nr(e,...t){Je?Je.emit(e,...t):mo||Cn.push({event:e,args:t})}function us(e,t){var n,r;Je=e,Je?(Je.enabled=!0,Cn.forEach(({event:o,args:i})=>Je.emit(o,...i)),Cn=[]):typeof window<"u"&&window.HTMLElement&&!((r=(n=window.navigator)==null?void 0:n.userAgent)!=null&&r.includes("jsdom"))?((t.__VUE_DEVTOOLS_HOOK_REPLAY__=t.__VUE_DEVTOOLS_HOOK_REPLAY__||[]).push(i=>{us(i,t)}),setTimeout(()=>{Je||(t.__VUE_DEVTOOLS_HOOK_REPLAY__=null,mo=!0,Cn=[])},3e3)):(mo=!0,Cn=[])}function _l(e,t){Nr("app:init",e,t,{Fragment:Fe,Text:Pn,Comment:yt,Static:Tn})}function bl(e){Nr("app:unmount",e)}var El=vo("component:added"),fs=vo("component:updated"),vl=vo("component:removed"),wl=e=>{Je&&typeof Je.cleanupBuffer=="function"&&!Je.cleanupBuffer(e)&&vl(e)};function vo(e){return t=>{Nr(e,t.appContext.app,t.uid,t.parent?t.parent.uid:void 0,t)}}function xl(e,t,n){Nr("component:emit",e.appContext.app,e,t,n)}var Xe=null,ps=null;function yr(e){let t=Xe;return Xe=e,ps=e&&e.type.__scopeId||null,t}function Cl(e,t=Xe,n){if(!t||e._n)return e;let r=(...o)=>{r._d&&Er(-1);let i=yr(t),s=Yt.length,a;try{a=e(...o)}finally{for(let c=Yt.length;c>s;c--)pc();yr(i),r._d&&Er(1)}return __VUE_PROD_DEVTOOLS__&&fs(t),a};return r._n=!0,r._c=!0,r._d=!0,r}function Nt(e,t,n,r){let o=e.dirs,i=t&&t.dirs;for(let s=0;s<o.length;s++){let a=o[s];i&&(a.oldValue=i[s].value);let c=a.dir[r];c&&(ze(),Me(c,n,8,[e.el,a,e,t]),Ke())}}function Nl(e,t){if(Ee){let n=Ee.provides,r=Ee.parent&&Ee.parent.provides;r===n&&(n=Ee.provides=Object.create(r)),n[e]=t}}function hr(e,t,n=!1){let r=Hs();if(r||Kt){let o=Kt?Kt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(o&&e in o)return o[e];if(arguments.length>1)return n&&I(t)?t.call(r&&r.proxy):t}}var Dl=Symbol.for("v-scx"),Ol=()=>{{let e=hr(Dl);return e}};function zt(e,t,n){return hs(e,t,n)}function hs(e,t,n=K){let{immediate:r,deep:o,flush:i,once:s}=n,a=ne({},n),c=t&&r||!t&&i!=="post",f;if(Vn){if(i==="sync"){let C=Ol();f=C.__watcherHandles||(C.__watcherHandles=[])}else if(!c){let C=()=>{};return C.stop=ge,C.resume=ge,C.pause=ge,C}}let u=Ee;a.call=(C,v,O)=>Me(C,u,v,O);let p=!1;i==="post"?a.scheduler=C=>{Ne(C,u&&u.suspense)}:i!=="sync"&&(p=!0,a.scheduler=(C,v)=>{v?C():Eo(C)}),a.augmentJob=C=>{t&&(C.flags|=4),p&&(C.flags|=2,u&&(C.id=u.uid,C.i=u))};let b=Wi(e,t,a);return Vn&&(f?f.push(b):c&&b()),b}function Sl(e,t,n){let r=this.proxy,o=te(e)?e.includes(".")?ms(r,e):()=>r[e]:e.bind(r,r),i;I(t)?i=t:(i=t.handler,n=t);let s=$n(this),a=hs(o,i.bind(r),n);return s(),a}function ms(e,t){let n=t.split(".");return()=>{let r=e;for(let o=0;o<n.length&&r;o++)r=r[n[o]];return r}}var Tl=Symbol("_vte"),Dr=e=>e.__isTeleport;var uo=Symbol("_leaveCb");function kl(e){let t=e[0];if(e.length>1){let n=!1;for(let r of e)if(r.type!==yt){t=r,n=!0;break}}return t}function gs(e){if(!wo(e))return Dr(e.type)&&e.children?kl(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&I(n.default))return n.default()}}function Or(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Or(Dr(n.type)&&gs(n)||n,t)}else e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function In(e,t){return I(e)?ne({name:e.name},t,{setup:e}):e}function ys(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function Ki(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var _r=new WeakMap;function Dn(e,t,n,r,o=!1){if(R(e)){e.forEach((O,$)=>Dn(O,t&&(R(t)?t[$]:t),n,r,o));return}if(On(r)&&!o){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Dn(e,t,n,r.component.subTree);return}let i=r.shapeFlag&4?So(r.component):r.el,s=o?null:i,{i:a,r:c}=e,f=t&&t.r,u=a.refs===K?a.refs={}:a.refs,p=a.setupState,b=U(p),C=p===K?Hr:O=>Ki(u,O)?!1:H(b,O),v=(O,$)=>!($&&Ki(u,$));if(f!=null&&f!==c){if(Yi(t),te(f))u[f]=null,C(f)&&(p[f]=null);else if(le(f)){let O=t;v(f,O.k)&&(f.value=null),O.k&&(u[O.k]=null)}}if(I(c))Mn(c,a,12,[s,u]);else{let O=te(c),$=le(c);if(O||$){let q=()=>{if(e.f){let M=O?C(c)?p[c]:u[c]:v(c)||!e.k?c.value:u[e.k];if(o)R(M)&&an(M,i);else if(R(M))M.includes(i)||M.push(i);else if(O)u[c]=[i],C(c)&&(p[c]=u[c]);else{let P=[i];v(c,e.k)&&(c.value=P),e.k&&(u[e.k]=P)}}else O?(u[c]=s,C(c)&&(p[c]=s)):$&&(v(c,e.k)&&(c.value=s),e.k&&(u[e.k]=s))};if(s){let M=()=>{q(),_r.delete(e)};M.id=-1,_r.set(e,M),Ne(M,n)}else Yi(e),q()}}}function Yi(e){let t=_r.get(e);t&&(t.flags|=8,_r.delete(e))}var up=pt().requestIdleCallback||(e=>setTimeout(e,1)),fp=pt().cancelIdleCallback||(e=>clearTimeout(e));var On=e=>!!e.type.__asyncLoader;var wo=e=>e.type.__isKeepAlive;function Al(e,t){_s(e,"a",t)}function Vl(e,t){_s(e,"da",t)}function _s(e,t,n=Ee){let r=e.__wdc||(e.__wdc=()=>{let o=n;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(Sr(t,r,n),n){let o=n.parent;for(;o&&o.parent;)wo(o.parent.vnode)&&Ml(r,t,n,o),o=o.parent}}function Ml(e,t,n,r){let o=Sr(t,e,r,!0);xo(()=>{an(r[t],o)},n)}function Sr(e,t,n=Ee,r=!1){if(n){let o=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...s)=>{ze();let a=$n(n),c=Me(t,n,e,s);return a(),Ke(),c});return r?o.unshift(i):o.push(i),i}}var st=e=>(t,n=Ee)=>{(!Vn||e==="sp")&&Sr(e,(...r)=>t(...r),n)},Rl=st("bm"),bs=st("m"),Es=st("bu"),vs=st("u"),Il=st("bum"),xo=st("um"),Pl=st("sp"),$l=st("rtg"),Ll=st("rtc");function Fl(e,t=Ee){Sr("ec",e,t)}var Hl=Symbol.for("v-ndc");var go=e=>e?Us(e)?So(e):go(e.parent):null;var Sn=ne(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>go(e.parent),$root:e=>go(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>__VUE_OPTIONS_API__?Co(e):e.type,$forceUpdate:e=>e.f||(e.f=()=>{Eo(e.update)}),$nextTick:e=>e.n||(e.n=Rn.bind(e.proxy)),$watch:e=>__VUE_OPTIONS_API__?Sl.bind(e):ge});var fo=(e,t)=>e!==K&&!e.__isScriptSetup&&H(e,t),Ul={get({_:e},t){if(t==="__v_skip")return!0;let{ctx:n,setupState:r,data:o,props:i,accessCache:s,type:a,appContext:c}=e;if(t[0]!=="$"){let b=s[t];if(b!==void 0)switch(b){case 1:return r[t];case 2:return o[t];case 4:return n[t];case 3:return i[t]}else{if(fo(r,t))return s[t]=1,r[t];if(__VUE_OPTIONS_API__&&o!==K&&H(o,t))return s[t]=2,o[t];if(H(i,t))return s[t]=3,i[t];if(n!==K&&H(n,t))return s[t]=4,n[t];(!__VUE_OPTIONS_API__||yo)&&(s[t]=0)}}let f=Sn[t],u,p;if(f)return t==="$attrs"&&ue(e.attrs,"get",""),f(e);if((u=a.__cssModules)&&(u=u[t]))return u;if(n!==K&&H(n,t))return s[t]=4,n[t];if(p=c.config.globalProperties,H(p,t))return p[t]},set({_:e},t,n){let{data:r,setupState:o,ctx:i}=e;return fo(o,t)?(o[t]=n,!0):__VUE_OPTIONS_API__&&r!==K&&H(r,t)?(r[t]=n,!0):H(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:o,props:i,type:s}},a){let c;return!!(n[a]||__VUE_OPTIONS_API__&&e!==K&&a[0]!=="$"&&H(e,a)||fo(t,a)||H(i,a)||H(r,a)||H(Sn,a)||H(o.config.globalProperties,a)||(c=s.__cssModules)&&c[a])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:H(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function Gi(e){return R(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}var yo=!0;function jl(e){let t=Co(e),n=e.proxy,r=e.ctx;yo=!1,t.beforeCreate&&qi(t.beforeCreate,e,"bc");let{data:o,computed:i,methods:s,watch:a,provide:c,inject:f,created:u,beforeMount:p,mounted:b,beforeUpdate:C,updated:v,activated:O,deactivated:$,beforeDestroy:q,beforeUnmount:M,destroyed:P,unmounted:X,render:S,renderTracked:Z,renderTriggered:fe,errorCaptured:ve,serverPrefetch:we,expose:He,inheritAttrs:Ue,components:ke,directives:_t,filters:Jt}=t;if(f&&Bl(f,r,null),s)for(let J in s){let B=s[J];I(B)&&(r[J]=B.bind(n))}if(o){let J=o.call(n,n);z(J)&&(e.data=vn(J))}if(yo=!0,i)for(let J in i){let B=i[J],xe=I(B)?B.bind(n,n):I(B.get)?B.get.bind(n,n):ge,Tt=!I(B)&&I(B.set)?B.set.bind(n):ge,lt=Ot({get:xe,set:Tt});Object.defineProperty(r,J,{enumerable:!0,configurable:!0,get:()=>lt.value,set:ct=>lt.value=ct})}if(a)for(let J in a)ws(a[J],r,n,J);if(c){let J=I(c)?c.call(n):c;Reflect.ownKeys(J).forEach(B=>{Nl(B,J[B])})}u&&qi(u,e,"c");function ce(J,B){R(B)?B.forEach(xe=>J(xe.bind(n))):B&&J(B.bind(n))}if(ce(Rl,p),ce(bs,b),ce(Es,C),ce(vs,v),ce(Al,O),ce(Vl,$),ce(Fl,ve),ce(Ll,Z),ce($l,fe),ce(Il,M),ce(xo,X),ce(Pl,we),R(He))if(He.length){let J=e.exposed||(e.exposed={});He.forEach(B=>{Object.defineProperty(J,B,{get:()=>n[B],set:xe=>n[B]=xe,enumerable:!0})})}else e.exposed||(e.exposed={});S&&e.render===ge&&(e.render=S),Ue!=null&&(e.inheritAttrs=Ue),ke&&(e.components=ke),_t&&(e.directives=_t),we&&ys(e)}function Bl(e,t,n=ge){R(e)&&(e=_o(e));for(let r in e){let o=e[r],i;z(o)?"default"in o?i=hr(o.from||r,o.default,!0):i=hr(o.from||r):i=hr(o),le(i)?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:s=>i.value=s}):t[r]=i}}function qi(e,t,n){Me(R(e)?e.map(r=>r.bind(t.proxy)):e.bind(t.proxy),t,n)}function ws(e,t,n,r){let o=r.includes(".")?ms(n,r):()=>n[r];if(te(e)){let i=t[e];I(i)&&zt(o,i)}else if(I(e))zt(o,e.bind(n));else if(z(e))if(R(e))e.forEach(i=>ws(i,t,n,r));else{let i=I(e.handler)?e.handler.bind(n):t[e.handler];I(i)&&zt(o,i,e)}}function Co(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:o,optionsCache:i,config:{optionMergeStrategies:s}}=e.appContext,a=i.get(t),c;return a?c=a:!o.length&&!n&&!r?c=t:(c={},o.length&&o.forEach(f=>br(c,f,s,!0)),br(c,t,s)),z(t)&&i.set(t,c),c}function br(e,t,n,r=!1){let{mixins:o,extends:i}=t;i&&br(e,i,n,!0),o&&o.forEach(s=>br(e,s,n,!0));for(let s in t)if(!(r&&s==="expose")){let a=Wl[s]||n&&n[s];e[s]=a?a(e[s],t[s]):t[s]}return e}var Wl={data:Ji,props:Xi,emits:Xi,methods:Nn,computed:Nn,beforeCreate:_e,created:_e,beforeMount:_e,mounted:_e,beforeUpdate:_e,updated:_e,beforeDestroy:_e,beforeUnmount:_e,destroyed:_e,unmounted:_e,activated:_e,deactivated:_e,errorCaptured:_e,serverPrefetch:_e,components:Nn,directives:Nn,watch:Kl,provide:Ji,inject:zl};function Ji(e,t){return t?e?function(){return ne(I(e)?e.call(this,this):e,I(t)?t.call(this,this):t)}:t:e}function zl(e,t){return Nn(_o(e),_o(t))}function _o(e){if(R(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function _e(e,t){return e?[...new Set([].concat(e,t))]:t}function Nn(e,t){return e?ne(Object.create(null),e,t):t}function Xi(e,t){return e?R(e)&&R(t)?[...new Set([...e,...t])]:ne(Object.create(null),Gi(e),Gi(t??{})):t}function Kl(e,t){if(!e)return t;if(!t)return e;let n=ne(Object.create(null),e);for(let r in t)n[r]=_e(e[r],t[r]);return n}function xs(){return{app:null,config:{isNativeTag:Hr,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Yl=0;function Gl(e,t){return function(r,o=null){I(r)||(r=ne({},r)),o!=null&&!z(o)&&(o=null);let i=xs(),s=new WeakSet,a=[],c=!1,f=i.app={_uid:Yl++,_component:r,_props:o,_container:null,_context:i,_instance:null,version:is,get config(){return i.config},set config(u){},use(u,...p){return s.has(u)||(u&&I(u.install)?(s.add(u),u.install(f,...p)):I(u)&&(s.add(u),u(f,...p))),f},mixin(u){return __VUE_OPTIONS_API__&&(i.mixins.includes(u)||i.mixins.push(u)),f},component(u,p){return p?(i.components[u]=p,f):i.components[u]},directive(u,p){return p?(i.directives[u]=p,f):i.directives[u]},mount(u,p,b){if(!c){let C=f._ceVNode||Ve(r,o);return C.appContext=i,b===!0?b="svg":b===!1&&(b=void 0),p&&t?t(C,u):e(C,u,b),c=!0,f._container=u,u.__vue_app__=f,__VUE_PROD_DEVTOOLS__&&(f._instance=C.component,_l(f,is)),So(C.component)}},onUnmount(u){a.push(u)},unmount(){c&&(Me(a,f._instance,16),e(null,f._container),__VUE_PROD_DEVTOOLS__&&(f._instance=null,bl(f)),delete f._container.__vue_app__)},provide(u,p){return i.provides[u]=p,f},runWithContext(u){let p=Kt;Kt=f;try{return u()}finally{Kt=p}}};return f}}var Kt=null;var ql=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${ye(t)}Modifiers`]||e[`${et(t)}Modifiers`];function Jl(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||K,o=n,i=t.startsWith("update:"),s=i&&ql(r,t.slice(7));s&&(s.trim&&(o=n.map(u=>te(u)?u.trim():u)),s.number&&(o=o.map(Wr))),__VUE_PROD_DEVTOOLS__&&xl(e,t,o);let a,c=r[a=dn(t)]||r[a=dn(ye(t))];!c&&i&&(c=r[a=dn(et(t))]),c&&Me(c,e,6,o);let f=r[a+"Once"];if(f){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,Me(f,e,6,o)}}var Xl=new WeakMap;function Cs(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?Xl:t.emitsCache,o=r.get(e);if(o!==void 0)return o;let i=e.emits,s={},a=!1;if(__VUE_OPTIONS_API__&&!I(e)){let c=f=>{let u=Cs(f,t,!0);u&&(a=!0,ne(s,u))};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}return!i&&!a?(z(e)&&r.set(e,null),null):(R(i)?i.forEach(c=>s[c]=null):ne(s,i),z(e)&&r.set(e,s),s)}function Tr(e,t){return!e||!Pt(t)?!1:(t=t.slice(2),t=t==="Once"?t:t.replace(/Once$/,""),H(e,t[0].toLowerCase()+t.slice(1))||H(e,et(t))||H(e,t))}function po(e){let{type:t,vnode:n,proxy:r,withProxy:o,propsOptions:[i],slots:s,attrs:a,emit:c,render:f,renderCache:u,props:p,data:b,setupState:C,ctx:v,inheritAttrs:O}=e,$=yr(e),q,M;try{if(n.shapeFlag&4){let S=o||r,Z=S;q=qe(f.call(Z,S,u,p,C,b,v)),M=a}else{let S=t;q=qe(S.length>1?S(p,{attrs:a,slots:s,emit:c}):S(p,null)),M=t.props?a:Zl(a)}}catch(S){Yt.length=0,Cr(S,e,1),q=Ve(yt)}let P=q,X;if(M&&O!==!1){let S=Object.keys(M),{shapeFlag:Z}=P;S.length&&Z&7&&(i&&S.some($t)&&(M=Ql(M,i)),P=Gt(P,M,!1,!0))}if(n.dirs&&(P=Gt(P,null,!1,!0),P.dirs=P.dirs?P.dirs.concat(n.dirs):n.dirs),n.transition){let S=Dr(P.type)&&gs(P)||P;Or(S,n.transition)}return q=P,yr($),q}var Zl=e=>{let t;for(let n in e)(n==="class"||n==="style"||Pt(n))&&((t||(t={}))[n]=e[n]);return t},Ql=(e,t)=>{let n={};for(let r in e)(!$t(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function ec(e,t,n){let{props:r,children:o,component:i}=e,{props:s,children:a,patchFlag:c}=t,f=i.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?Zi(r,s,f):!!s;if(c&8){let u=t.dynamicProps;for(let p=0;p<u.length;p++){let b=u[p];if(Ns(s,r,b)&&!Tr(f,b))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:r===s?!1:r?s?Zi(r,s,f):!0:!!s;return!1}function Zi(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){let i=r[o];if(Ns(t,e,i)&&!Tr(n,i))return!0}return!1}function Ns(e,t,n){let r=e[n],o=t[n];return n==="style"&&z(r)&&z(o)?!Ht(r,o):r!==o}function tc({vnode:e,parent:t,suspense:n},r){for(;t;){let o=t.subTree;if(o.suspense&&o.suspense.activeBranch===e&&(o.suspense.vnode.el=o.el=r,e=o),o===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var Ds={},Os=()=>Object.create(Ds),Ss=e=>Object.getPrototypeOf(e)===Ds;function nc(e,t,n,r=!1){let o={},i=Os();e.propsDefaults=Object.create(null),Ts(e,t,o,i);for(let s in e.propsOptions[0])s in o||(o[s]=void 0);n?e.props=r?o:so(o):e.type.props?e.props=o:e.props=i,e.attrs=i}function rc(e,t,n,r){let{props:o,attrs:i,vnode:{patchFlag:s}}=e,a=U(o),[c]=e.propsOptions,f=!1;if((r||s>0)&&!(s&16)){if(s&8){let u=e.vnode.dynamicProps;for(let p=0;p<u.length;p++){let b=u[p];if(Tr(e.emitsOptions,b))continue;let C=t[b];if(c)if(H(i,b))C!==i[b]&&(i[b]=C,f=!0);else{let v=ye(b);o[v]=bo(c,a,v,C,e,!1)}else C!==i[b]&&(i[b]=C,f=!0)}}}else{Ts(e,t,o,i)&&(f=!0);let u;for(let p in a)(!t||!H(t,p)&&((u=et(p))===p||!H(t,u)))&&(c?n&&(n[p]!==void 0||n[u]!==void 0)&&(o[p]=bo(c,a,p,void 0,e,!0)):delete o[p]);if(i!==a)for(let p in i)(!t||!H(t,p))&&(delete i[p],f=!0)}f&&We(e.attrs,"set","")}function Ts(e,t,n,r){let[o,i]=e.propsOptions,s=!1,a;if(t)for(let c in t){if(Lt(c))continue;let f=t[c],u;o&&H(o,u=ye(c))?!i||!i.includes(u)?n[u]=f:(a||(a={}))[u]=f:Tr(e.emitsOptions,c)||(!(c in r)||f!==r[c])&&(r[c]=f,s=!0)}if(i){let c=U(n),f=a||K;for(let u=0;u<i.length;u++){let p=i[u];n[p]=bo(o,c,p,f[p],e,!H(f,p))}}return s}function bo(e,t,n,r,o,i){let s=e[n];if(s!=null){let a=H(s,"default");if(a&&r===void 0){let c=s.default;if(s.type!==Function&&!s.skipFactory&&I(c)){let{propsDefaults:f}=o;if(n in f)r=f[n];else{let u=$n(o);r=f[n]=c.call(null,t),u()}}else r=c;o.ce&&o.ce._setProp(n,r)}s[0]&&(i&&!a?r=!1:s[1]&&(r===""||r===et(n))&&(r=!0))}return r}var oc=new WeakMap;function ks(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?oc:t.propsCache,o=r.get(e);if(o)return o;let i=e.props,s={},a=[],c=!1;if(__VUE_OPTIONS_API__&&!I(e)){let u=p=>{c=!0;let[b,C]=ks(p,t,!0);ne(s,b),C&&a.push(...C)};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!i&&!c)return z(e)&&r.set(e,wt),wt;if(R(i))for(let u=0;u<i.length;u++){let p=ye(i[u]);Qi(p)&&(s[p]=K)}else if(i)for(let u in i){let p=ye(u);if(Qi(p)){let b=i[u],C=s[p]=R(b)||I(b)?{type:b}:ne({},b),v=C.type,O=!1,$=!0;if(R(v))for(let q=0;q<v.length;++q){let M=v[q],P=I(M)&&M.name;if(P==="Boolean"){O=!0;break}else P==="String"&&($=!1)}else O=I(v)&&v.name==="Boolean";C[0]=O,C[1]=$,(O||H(C,"default"))&&a.push(p)}}let f=[s,a];return z(e)&&r.set(e,f),f}function Qi(e){return e[0]!=="$"&&!Lt(e)}var No=e=>e==="_"||e==="_ctx"||e==="$stable",Do=e=>R(e)?e.map(qe):[qe(e)],ic=(e,t,n)=>{if(t._n)return t;let r=Cl((...o)=>Do(t(...o)),n);return r._c=!1,r},As=(e,t,n)=>{let r=e._ctx;for(let o in e){if(No(o))continue;let i=e[o];if(I(i))t[o]=ic(o,i,r);else if(i!=null){let s=Do(i);t[o]=()=>s}}},Vs=(e,t)=>{let n=Do(t);e.slots.default=()=>n},Ms=(e,t,n)=>{for(let r in t)(n||!No(r))&&(e[r]=t[r])},sc=(e,t,n)=>{let r=e.slots=Os();if(e.vnode.shapeFlag&32){let o=t._;o?(Ms(r,t,n),n&&Ft(r,"_",o,!0)):As(t,r)}else t&&Vs(e,t)},ac=(e,t,n)=>{let{vnode:r,slots:o}=e,i=!0,s=K;if(r.shapeFlag&32){let a=t._;a?n&&a===1?i=!1:Ms(o,t,n):(i=!t.$stable,As(t,o)),s=t}else t&&(Vs(e,t),s={default:1});if(i)for(let a in o)!No(a)&&s[a]==null&&delete o[a]};function lc(){let e=[];typeof __VUE_OPTIONS_API__!="boolean"&&(pt().__VUE_OPTIONS_API__=!0),typeof __VUE_PROD_DEVTOOLS__!="boolean"&&(pt().__VUE_PROD_DEVTOOLS__=!1),typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__!="boolean"&&(pt().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__=!1)}var Ne=fc;function Rs(e){return cc(e)}function cc(e,t){lc();let n=pt();n.__VUE__=!0,__VUE_PROD_DEVTOOLS__&&us(n.__VUE_DEVTOOLS_GLOBAL_HOOK__,n);let{insert:r,remove:o,patchProp:i,createElement:s,createText:a,createComment:c,setText:f,setElementText:u,parentNode:p,nextSibling:b,setScopeId:C=ge,insertStaticContent:v}=e,O=(l,d,h,_=null,m=null,y=null,x=void 0,w=null,E=!!d.dynamicChildren)=>{if(l===d)return;l&&!xn(l,d)&&(_=L(l),pe(l,m,y,!0),l=null),d.patchFlag===-2&&(E=!1,d.dynamicChildren=null),d.dynamicChildren&&l&&l.dynamicChildren&&l.dynamicChildren.hasOnce&&(d.dynamicChildren===wt&&(d.dynamicChildren=[]),d.dynamicChildren.hasOnce=!0);let{type:g,ref:A,shapeFlag:N}=d;switch(g){case Pn:$(l,d,h,_);break;case yt:q(l,d,h,_);break;case Tn:l==null&&M(d,h,_,x);break;case Fe:_t(l,d,h,_,m,y,x,w,E);break;default:N&1?Z(l,d,h,_,m,y,x,w,E):N&6?Jt(l,d,h,_,m,y,x,w,E):(N&64||N&128)&&g.process(l,d,h,_,m,y,x,w,E,Ze)}A!=null&&m?Dn(A,l&&l.ref,y,d||l,!d):A==null&&l&&l.ref!=null&&Dn(l.ref,null,y,l,!0)},$=(l,d,h,_)=>{if(l==null)r(d.el=a(d.children),h,_);else{let m=d.el=l.el;d.children!==l.children&&f(m,d.children)}},q=(l,d,h,_)=>{l==null?r(d.el=c(d.children||""),h,_):d.el=l.el},M=(l,d,h,_)=>{[l.el,l.anchor]=v(l.children,d,h,_,l.el,l.anchor)},P=(l,d,h,_)=>{if(d.children!==l.children){let m=b(l.anchor);S(l),[d.el,d.anchor]=v(d.children,h,m,_)}else d.el=l.el,d.anchor=l.anchor},X=({el:l,anchor:d},h,_)=>{let m;for(;l&&l!==d;)m=b(l),r(l,h,_),l=m;r(d,h,_)},S=({el:l,anchor:d})=>{let h;for(;l&&l!==d;)h=b(l),o(l),l=h;o(d)},Z=(l,d,h,_,m,y,x,w,E)=>{if(d.type==="svg"?x="svg":d.type==="math"&&(x="mathml"),l==null)fe(d,h,_,m,y,x,w,E);else{let g=l.el&&l.el._isVueCE?l.el:null;try{g&&g._beginPatch(),He(l,d,m,y,x,w,E)}finally{g&&g._endPatch()}}},fe=(l,d,h,_,m,y,x,w)=>{let E,g,{props:A,shapeFlag:N,transition:k,dirs:V}=l;if(E=l.el=s(l.type,y,A&&A.is,A),N&8?u(E,l.children):N&16&&we(l.children,E,null,_,m,ho(l,y),x,w),V&&Nt(l,null,_,"created"),ve(E,l,l.scopeId,x,_),A){for(let Y in A)Y!=="value"&&!Lt(Y)&&i(E,Y,null,A[Y],y,_);"value"in A&&i(E,"value",null,A.value,y),(g=A.onVnodeBeforeMount)&&Ye(g,_,l)}__VUE_PROD_DEVTOOLS__&&(Ft(E,"__vnode",l,!0),Ft(E,"__vueParentComponent",_,!0)),V&&Nt(l,null,_,"beforeMount");let F=dc(m,k);F&&k.beforeEnter(E),r(E,d,h),((g=A&&A.onVnodeMounted)||F||V)&&Ne(()=>{let W;g&&Ye(g,_,l),F&&k.enter(E),V&&Nt(l,null,_,"mounted")},m)},ve=(l,d,h,_,m)=>{if(h&&C(l,h),_)for(let y=0;y<_.length;y++)C(l,_[y]);if(m){let y=m.subTree;if(d===y||Ls(y.type)&&(y.ssContent===d||y.ssFallback===d)){let x=m.vnode;ve(l,x,x.scopeId,x.slotScopeIds,m.parent)}}},we=(l,d,h,_,m,y,x,w,E=0)=>{for(let g=E;g<l.length;g++){let A=l[g]=w?ot(l[g]):qe(l[g]);O(null,A,d,h,_,m,y,x,w)}},He=(l,d,h,_,m,y,x)=>{let w=d.el=l.el;__VUE_PROD_DEVTOOLS__&&(w.__vnode=d);let{patchFlag:E,dynamicChildren:g,dirs:A}=d;E|=l.patchFlag&16;let N=l.props||K,k=d.props||K,V;if(h&&Dt(h,!1),(V=k.onVnodeBeforeUpdate)&&Ye(V,h,d,l),A&&Nt(d,l,h,"beforeUpdate"),h&&Dt(h,!0),g&&(!l.dynamicChildren||l.dynamicChildren.length!==g.length)&&(E=0,x=!1,g=null),(N.innerHTML&&k.innerHTML==null||N.textContent&&k.textContent==null)&&u(w,""),g?Ue(l.dynamicChildren,g,w,h,_,ho(d,m),y):x||xe(l,d,w,null,h,_,ho(d,m),y,!1),E>0){if(E&16)ke(w,N,k,h,m);else if(E&2&&N.class!==k.class&&i(w,"class",null,k.class,m),E&4&&i(w,"style",N.style,k.style,m),E&8){let F=d.dynamicProps;for(let Y=0;Y<F.length;Y++){let W=F[Y],oe=N[W],ie=k[W];(ie!==oe||W==="value")&&i(w,W,oe,ie,m,h)}}E&1&&l.children!==d.children&&u(w,d.children)}else!x&&g==null&&ke(w,N,k,h,m);((V=k.onVnodeUpdated)||A)&&Ne(()=>{V&&Ye(V,h,d,l),A&&Nt(d,l,h,"updated")},_)},Ue=(l,d,h,_,m,y,x)=>{for(let w=0;w<d.length;w++){let E=l[w],g=d[w],A=E.el&&(E.type===Fe||!xn(E,g)||E.shapeFlag&198)?p(E.el):h;O(E,g,A,null,_,m,y,x,!0)}},ke=(l,d,h,_,m)=>{if(d!==h){if(d!==K)for(let y in d)!Lt(y)&&!(y in h)&&i(l,y,d[y],null,m,_);for(let y in h){if(Lt(y))continue;let x=h[y],w=d[y];x!==w&&y!=="value"&&i(l,y,w,x,m,_)}"value"in h&&i(l,"value",d.value,h.value,m)}},_t=(l,d,h,_,m,y,x,w,E)=>{let g=d.el=l?l.el:a(""),A=d.anchor=l?l.anchor:a(""),{patchFlag:N,dynamicChildren:k,slotScopeIds:V}=d;V&&(w=w?w.concat(V):V),l==null?(r(g,h,_),r(A,h,_),we(d.children||[],h,A,m,y,x,w,E)):N>0&&N&64&&k&&l.dynamicChildren&&l.dynamicChildren.length===k.length?(Ue(l.dynamicChildren,k,h,m,y,x,w),(d.key!=null||m&&d===m.subTree)&&Is(l,d,!0)):xe(l,d,h,A,m,y,x,w,E)},Jt=(l,d,h,_,m,y,x,w,E)=>{d.slotScopeIds=w,l==null?d.shapeFlag&512?m.ctx.activate(d,h,_,x,E):St(d,h,_,m,y,x,E):ce(l,d,E)},St=(l,d,h,_,m,y,x)=>{let w=l.component=vc(l,_,m);if(wo(l)&&(w.ctx.renderer=Ze),wc(w,!1,x),w.asyncDep){if(m&&m.registerDep(w,J,x),!l.el){let E=w.subTree=Ve(yt);q(null,E,d,h),l.placeholder=E.el}}else J(w,l,d,h,m,y,x)},ce=(l,d,h)=>{let _=d.component=l.component;if(ec(l,d,h))if(_.asyncDep&&!_.asyncResolved){d.el=l.el,B(_,d,h);return}else _.next=d,_.update();else d.el=l.el,_.vnode=d},J=(l,d,h,_,m,y,x)=>{let w=()=>{if(l.isMounted){let{next:N,bu:k,u:V,parent:F,vnode:Y}=l;{let De=Ps(l);if(De){N&&(N.el=Y.el,B(l,N,x)),De.asyncDep.then(()=>{Ne(()=>{l.isUnmounted||g()},m)});return}}let W=N,oe;Dt(l,!1),N?(N.el=Y.el,B(l,N,x)):N=Y,k&&un(k),(oe=N.props&&N.props.onVnodeBeforeUpdate)&&Ye(oe,F,N,Y),Dt(l,!0);let ie=po(l),Re=l.subTree;l.subTree=ie,O(Re,ie,p(Re.el),L(Re),l,m,y),N.el=ie.el,W===null&&tc(l,ie.el),V&&Ne(V,m),(oe=N.props&&N.props.onVnodeUpdated)&&Ne(()=>Ye(oe,F,N,Y),m),__VUE_PROD_DEVTOOLS__&&fs(l)}else{let N,{el:k,props:V}=d,{bm:F,m:Y,parent:W,root:oe,type:ie}=l,Re=On(d);if(Dt(l,!1),F&&un(F),!Re&&(N=V&&V.onVnodeBeforeMount)&&Ye(N,W,d),Dt(l,!0),k&&Qt){let De=()=>{l.subTree=po(l),Qt(k,l.subTree,l,m,null)};Re&&ie.__asyncHydrate?ie.__asyncHydrate(k,l,De):De()}else{oe.ce&&oe.ce._hasShadowRoot()&&oe.ce._injectChildStyle(ie,l.parent?l.parent.type:void 0);let De=l.subTree=po(l);O(null,De,h,_,l,m,y),d.el=De.el}if(Y&&Ne(Y,m),!Re&&(N=V&&V.onVnodeMounted)){let De=d;Ne(()=>Ye(N,W,De),m)}(d.shapeFlag&256||W&&On(W.vnode)&&W.vnode.shapeFlag&256)&&l.a&&Ne(l.a,m),l.isMounted=!0,__VUE_PROD_DEVTOOLS__&&El(l),d=h=_=null}};l.scope.on();let E=l.effect=new jt(w);l.scope.off();let g=l.update=E.run.bind(E),A=l.job=E.runIfDirty.bind(E);A.i=l,A.id=l.uid,E.scheduler=()=>Eo(A),Dt(l,!0),g()},B=(l,d,h)=>{d.component=l;let _=l.vnode.props;l.vnode=d,l.next=null,rc(l,d.props,_,h),ac(l,d.children,h),ze(),zi(l),Ke()},xe=(l,d,h,_,m,y,x,w,E=!1)=>{let g=l&&l.children,A=l?l.shapeFlag:0,N=d.children,{patchFlag:k,shapeFlag:V}=d;if(k>0){if(k&128){lt(g,N,h,_,m,y,x,w,E);return}else if(k&256){Tt(g,N,h,_,m,y,x,w,E);return}}V&8?(A&16&&T(g,m,y),N!==g&&u(h,N)):A&16?V&16?lt(g,N,h,_,m,y,x,w,E):T(g,m,y,!0):(A&8&&u(h,""),V&16&&we(N,h,_,m,y,x,w,E))},Tt=(l,d,h,_,m,y,x,w,E)=>{l=l||wt,d=d||wt;let g=l.length,A=d.length,N=Math.min(g,A),k;for(k=0;k<N;k++){let V=d[k]=E?ot(d[k]):qe(d[k]);O(l[k],V,h,null,m,y,x,w,E)}g>A?T(l,m,y,!0,!1,N):we(d,h,_,m,y,x,w,E,N)},lt=(l,d,h,_,m,y,x,w,E)=>{let g=0,A=d.length,N=l.length-1,k=A-1;for(;g<=N&&g<=k;){let V=l[g],F=d[g]=E?ot(d[g]):qe(d[g]);if(xn(V,F))O(V,F,h,null,m,y,x,w,E);else break;g++}for(;g<=N&&g<=k;){let V=l[N],F=d[k]=E?ot(d[k]):qe(d[k]);if(xn(V,F))O(V,F,h,null,m,y,x,w,E);else break;N--,k--}if(g>N){if(g<=k){let V=k+1,F=V<A?d[V].el:_;for(;g<=k;)O(null,d[g]=E?ot(d[g]):qe(d[g]),h,F,m,y,x,w,E),g++}}else if(g>k)for(;g<=N;)pe(l[g],m,y,!0),g++;else{let V=g,F=g,Y=new Map;for(g=F;g<=k;g++){let Oe=d[g]=E?ot(d[g]):qe(d[g]);Oe.key!=null&&Y.set(Oe.key,g)}let W,oe=0,ie=k-F+1,Re=!1,De=0,en=new Array(ie);for(g=0;g<ie;g++)en[g]=0;for(g=V;g<=N;g++){let Oe=l[g];if(oe>=ie){pe(Oe,m,y,!0);continue}let je;if(Oe.key!=null)je=Y.get(Oe.key);else for(W=F;W<=k;W++)if(en[W-F]===0&&xn(Oe,d[W])){je=W;break}je===void 0?pe(Oe,m,y,!0):(en[je-F]=g+1,je>=De?De=je:Re=!0,O(Oe,d[je],h,null,m,y,x,w,E),oe++)}let Mo=Re?uc(en):wt;for(W=Mo.length-1,g=ie-1;g>=0;g--){let Oe=F+g,je=d[Oe],Ro=d[Oe+1],Io=Oe+1<A?Ro.el||$s(Ro):_;en[g]===0?O(null,je,h,Io,m,y,x,w,E):Re&&(W<0||g!==Mo[W]?ct(je,h,Io,2):W--)}}},ct=(l,d,h,_,m=null)=>{let{el:y,type:x,transition:w,children:E,shapeFlag:g}=l;if(g&6){ct(l.component.subTree,d,h,_);return}if(g&128){l.suspense.move(d,h,_);return}if(g&64){x.move(l,d,h,Ze);return}if(x===Fe){r(y,d,h);for(let N=0;N<E.length;N++)ct(E[N],d,h,_);r(l.anchor,d,h);return}if(x===Tn){X(l,d,h);return}if(_!==2&&g&1&&w)if(_===0)w.persisted&&!y[uo]?r(y,d,h):(w.beforeEnter(y),r(y,d,h),Ne(()=>w.enter(y),m));else{let{leave:N,delayLeave:k,afterLeave:V}=w,F=()=>{l.ctx.isUnmounted?o(y):r(y,d,h)},Y=()=>{let W=y._isLeaving||!!y[uo];y._isLeaving&&y[uo](!0),w.persisted&&!W?F():N(y,()=>{F(),V&&V()})};k?k(y,F,Y):Y()}else r(y,d,h)},pe=(l,d,h,_=!1,m=!1)=>{let{type:y,props:x,ref:w,children:E,dynamicChildren:g,shapeFlag:A,patchFlag:N,dirs:k,cacheIndex:V,memo:F}=l;if((N===-2||g&&g.hasOnce)&&(m=!1),w!=null&&(ze(),Dn(w,null,h,l,!0),Ke()),V!=null&&(!l.ctx||l.ctx===d)&&(d.renderCache[V]=void 0),A&256){d.ctx.deactivate(l);return}let Y=A&1&&k,W=!On(l),oe;if(W&&(oe=x&&x.onVnodeBeforeUnmount)&&Ye(oe,d,l),A&6)Hn(l.component,h,_);else{if(A&128){l.suspense.unmount(h,_);return}Y&&Nt(l,null,d,"beforeUnmount"),A&64?l.type.remove(l,d,h,Ze,_):g&&!g.hasOnce&&(y!==Fe||N>0&&N&64)?T(g,d,h,!1,!0):(y===Fe&&N&384||!m&&A&16)&&T(E,d,h),_&&Xt(l)}let ie=F!=null&&V==null;(W&&(oe=x&&x.onVnodeUnmounted)||Y||ie)&&Ne(()=>{oe&&Ye(oe,d,l),Y&&Nt(l,null,d,"unmounted"),ie&&(l.el=null)},h)},Xt=l=>{let{type:d,el:h,anchor:_,transition:m}=l;if(d===Fe){Fn(h,_);return}if(d===Tn){S(l),m&&!m.persisted&&m.afterLeave&&m.afterLeave();return}let y=()=>{o(h),m&&!m.persisted&&m.afterLeave&&m.afterLeave()};if(l.shapeFlag&1&&m&&!m.persisted){let{leave:x,delayLeave:w}=m,E=()=>x(h,y);w?w(l.el,y,E):E()}else y()},Fn=(l,d)=>{let h;for(;l!==d;)h=b(l),o(l),l=h;o(d)},Hn=(l,d,h)=>{let{bum:_,scope:m,job:y,subTree:x,um:w,m:E,a:g}=l;es(E),es(g),_&&un(_),m.stop(),y?(y.flags|=8,pe(x,l,d,h)):l.vnode.el&&x&&(x.transition=l.vnode.transition,pe(x,l,d,h)),w&&Ne(w,d),Ne(()=>{l.isUnmounted=!0},d),__VUE_PROD_DEVTOOLS__&&wl(l)},T=(l,d,h,_=!1,m=!1,y=0)=>{for(let x=y;x<l.length;x++)pe(l[x],d,h,_,m)},L=l=>{if(l.shapeFlag&6)return L(l.component.subTree);if(l.shapeFlag&128)return l.suspense.next();let d=b(l.anchor||l.el),h=d&&d[Tl];return h?b(h):d},ae=!1,he=(l,d,h)=>{let _;l==null?d._vnode&&(pe(d._vnode,null,null,!0),_=d._vnode.component):O(d._vnode||null,l,d,null,null,null,h),d._vnode=l,ae||(ae=!0,zi(_),cs(),ae=!1)},Ze={p:O,um:pe,m:ct,r:Xt,mt:St,mc:we,pc:xe,pbc:Ue,n:L,o:e},Zt,Qt;return t&&([Zt,Qt]=t(Ze)),{render:he,hydrate:Zt,createApp:Gl(he,Zt)}}function ho({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Dt({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function dc(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Is(e,t,n=!1){let r=e.children,o=t.children;if(R(r)&&R(o))for(let i=0;i<r.length;i++){let s=r[i],a=o[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[i]=ot(o[i]),a.el=s.el),!n&&a.patchFlag!==-2&&Is(s,a)),a.type===Pn&&(a.patchFlag===-1&&(a=o[i]=ot(a)),a.el=s.el),a.type===yt&&!a.el&&(a.el=s.el)}}function uc(e){let t=e.slice(),n=[0],r,o,i,s,a,c=e.length;for(r=0;r<c;r++){let f=e[r];if(f!==0){if(o=n[n.length-1],e[o]<f){t[r]=o,n.push(r);continue}for(i=0,s=n.length-1;i<s;)a=i+s>>1,e[n[a]]<f?i=a+1:s=a;f<e[n[i]]&&(i>0&&(t[r]=n[i-1]),n[i]=r)}}for(i=n.length,s=n[i-1];i-- >0;)n[i]=s,s=t[s];return n}function Ps(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Ps(t)}function es(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function $s(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?$s(t.subTree):null}var Ls=e=>e.__isSuspense;function fc(e,t){t&&t.pendingBranch?R(e)?t.effects.push(...e):t.effects.push(e):ls(e)}var Fe=Symbol.for("v-fgt"),Pn=Symbol.for("v-txt"),yt=Symbol.for("v-cmt"),Tn=Symbol.for("v-stc"),Yt=[],it=null;function pc(){Yt.pop(),it=Yt[Yt.length-1]||null}var Oo=1;function Er(e,t=!1){Oo+=e,e<0&&it&&t&&(it.hasOnce=!0)}function vr(e){return e?e.__v_isVNode===!0:!1}function xn(e,t){return e.type===t.type&&e.key===t.key}var Fs=({key:e})=>e??null,mr=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?te(e)||le(e)||I(e)?{i:Xe,r:e,k:t,f:!!n}:e:null);function hc(e,t=null,n=null,r=0,o=null,i=e===Fe?0:1,s=!1,a=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Fs(t),ref:t&&mr(t),scopeId:ps,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:Xe};return a?(wr(c,n),i&128&&e.normalize(c)):n&&(c.shapeFlag|=te(n)?8:16),Oo>0&&!s&&it&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&it.push(c),c}var Ve=mc;function mc(e,t=null,n=null,r=0,o=null,i=!1){if((!e||e===Hl)&&(e=yt),vr(e)){let a=Gt(e,t,!0);return n&&wr(a,n),Oo>0&&!i&&it&&(a.shapeFlag&6?it[it.indexOf(e)]=a:it.push(a)),a.patchFlag=-2,a}if(Dc(e)&&(e=e.__vccOpts),t){t=gc(t);let{class:a,style:c}=t;a&&!te(a)&&(t.class=pn(a)),z(c)&&(wn(c)&&!R(c)&&(c=ne({},c)),t.style=fn(c))}let s=te(e)?1:Ls(e)?128:Dr(e)?64:z(e)?4:I(e)?2:0;return hc(e,t,n,r,o,s,i,!0)}function gc(e){return e?wn(e)||Ss(e)?ne({},e):e:null}function Gt(e,t,n=!1,r=!1){let{props:o,ref:i,patchFlag:s,children:a,transition:c}=e,f=t?_c(o||{},t):o,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:f,key:f&&Fs(f),ref:t&&t.ref?n&&i?R(i)?i.concat(mr(t)):[i,mr(t)]:mr(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Fe?s===-1?16:s|16:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Gt(e.ssContent),ssFallback:e.ssFallback&&Gt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&Or(u,c.clone(u)),u}function yc(e=" ",t=0){return Ve(Pn,null,e,t)}function qe(e){return e==null||typeof e=="boolean"?Ve(yt):R(e)?Ve(Fe,null,e.slice()):vr(e)?ot(e):Ve(Pn,null,String(e))}function ot(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Gt(e)}function wr(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(R(t))n=16;else if(typeof t=="object")if(r&65){let o=t.default;o&&(o._c&&(o._d=!1),wr(e,o()),o._c&&(o._d=!0));return}else{n=32;let o=t._;!o&&!Ss(t)?t._ctx=Xe:o===3&&Xe&&(Xe.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(I(t)){if(r&65){wr(e,{default:t});return}t={default:t,_ctx:Xe},n=32}else t=String(t),r&64?(n=16,t=[yc(t)]):n=8;e.children=t,e.shapeFlag|=n}function _c(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let o in r)if(o==="class")t.class!==r.class&&(t.class=pn([t.class,r.class]));else if(o==="style")t.style=fn([t.style,r.style]);else if(Pt(o)){let i=t[o],s=r[o];s&&i!==s&&!(R(i)&&i.includes(s))?t[o]=i?[].concat(i,s):s:s==null&&i==null&&!$t(o)&&(t[o]=s)}else o!==""&&(t[o]=r[o])}return t}function Ye(e,t,n,r=null){Me(e,t,7,[n,r])}var bc=xs(),Ec=0;function vc(e,t,n){let r=e.type,o=(t?t.appContext:e.appContext)||bc,i={uid:Ec++,vnode:e,type:r,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new yn(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:ks(r,o),emitsOptions:Cs(r,o),emit:null,emitted:null,propsDefaults:K,inheritAttrs:r.inheritAttrs,ctx:K,data:K,props:K,attrs:K,slots:K,refs:K,setupState:K,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=Jl.bind(null,i),e.ce&&e.ce(i),i}var Ee=null,Hs=()=>Ee||Xe,xr,An;{let e=pt(),t=(n,r)=>{let o;return(o=e[n])||(o=e[n]=[]),o.push(r),i=>{o.length>1?o.forEach(s=>s(i)):o[0](i)}};xr=t("__VUE_INSTANCE_SETTERS__",n=>Ee=n),An=t("__VUE_SSR_SETTERS__",n=>Vn=n)}var $n=e=>{let t=Ee;return xr(e),e.scope.on(),()=>{e.scope.off(),xr(t)}},ts=()=>{Ee&&Ee.scope.off(),xr(null)};function Us(e){return e.vnode.shapeFlag&4}var Vn=!1;function wc(e,t=!1,n=!1){t&&An(t);let{props:r,children:o}=e.vnode,i=Us(e);nc(e,r,i,t),sc(e,o,n||t);let s=i?xc(e,t):void 0;return t&&An(!1),s}function xc(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Ul);let{setup:r}=n;if(r){ze();let o=e.setupContext=r.length>1?Nc(e):null,i=$n(e),s=Mn(r,e,0,[e.props,o]),a=Ur(s);if(Ke(),i(),(a||e.sp)&&!On(e)&&ys(e),a){if(s.then(ts,ts),t)return s.then(c=>{An(!0);try{ns(e,c,t)}finally{An(!1)}}).catch(c=>{Cr(c,e,0)});e.asyncDep=s}else ns(e,s,t)}else js(e,t)}function ns(e,t,n){I(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:z(t)&&(__VUE_PROD_DEVTOOLS__&&(e.devtoolsRawSetupState=t),e.setupState=pr(t)),js(e,n)}var rs,os;function js(e,t,n){let r=e.type;if(!e.render){if(!t&&rs&&!r.render){let o=r.template||__VUE_OPTIONS_API__&&Co(e).template;if(o){let{isCustomElement:i,compilerOptions:s}=e.appContext.config,{delimiters:a,compilerOptions:c}=r,f=ne(ne({isCustomElement:i,delimiters:a},s),c);r.render=rs(o,f)}}e.render=r.render||ge,os&&os(e)}if(__VUE_OPTIONS_API__){let o=$n(e);ze();try{jl(e)}finally{Ke(),o()}}}var Cc={get(e,t){return ue(e,"get",""),e[t]}};function Nc(e){let t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,Cc),slots:e.slots,emit:e.emit,expose:t}}function So(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(pr(lo(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Sn)return Sn[n](e)},has(t,n){return n in t||n in Sn}})):e.proxy}function Dc(e){return I(e)&&"__vccOpts"in e}var Ot=(e,t)=>ji(e,t,Vn);function D(e,t,n){try{Er(-1);let r=arguments.length;return r===2?z(t)&&!R(t)?vr(t)?Ve(e,null,[t]):Ve(e,t):Ve(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&vr(n)&&(n=[n]),Ve(e,t,n))}finally{Er(1)}}var is="3.5.43";var Ao,Bs=typeof window<"u"&&window.trustedTypes;if(Bs)try{Ao=Bs.createPolicy("vue",{createHTML:e=>e})}catch{}var Qs=Ao?e=>Ao.createHTML(e):e=>e,Oc="http://www.w3.org/2000/svg",Sc="http://www.w3.org/1998/Math/MathML",at=typeof document<"u"?document:null,Ws=at&&at.createElement("template"),Tc={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let o=t==="svg"?at.createElementNS(Oc,e):t==="mathml"?at.createElementNS(Sc,e):n?at.createElement(e,{is:n}):at.createElement(e);return e==="select"&&r&&r.multiple!=null&&o.setAttribute("multiple",r.multiple),o},createText:e=>at.createTextNode(e),createComment:e=>at.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>at.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,o,i){let s=n?n.previousSibling:t.lastChild;if(o&&(o===i||o.nextSibling))for(;t.insertBefore(o.cloneNode(!0),n),!(o===i||!(o=o.nextSibling)););else{Ws.innerHTML=Qs(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);let a=Ws.content;if(r==="svg"||r==="mathml"){let c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}t.insertBefore(a,n)}return[s?s.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};var kc=Symbol("_vtc");function Ac(e,t,n){let r=e[kc];r&&(t=(t?[t,...r]:[...r]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}var zs=Symbol("_vod"),Vc=Symbol("_vsh");var Mc=Symbol("");var Rc=/(?:^|;)\s*display\s*:/;function Ic(e,t,n){let r=e.style,o=te(n),i=!1;if(n&&!o){if(t)if(te(t))for(let s of t.split(";")){let a=s.slice(0,s.indexOf(":")).trim();n[a]==null&&Ln(r,a,"")}else for(let s in t)n[s]==null&&Ln(r,s,"");for(let s in n){s==="display"&&(i=!0);let a=n[s];a!=null?$c(e,s,!te(t)&&t?t[s]:void 0,a)||Ln(r,s,a):Ln(r,s,"")}}else if(o){if(t!==n){let s=r[Mc];s&&(n+=";"+s),r.cssText=n,i=Rc.test(n)}}else t&&e.removeAttribute("style");zs in e&&(e[zs]=i?r.display:"",e[Vc]&&(r.display="none"))}var kr=/\s*!important$/;function Ln(e,t,n){if(R(n))n.forEach(r=>Ln(e,t,r));else if(n==null&&(n=""),t.startsWith("--"))kr.test(n)?e.setProperty(t,n.replace(kr,""),"important"):e.setProperty(t,n);else{let r=Pc(e,t);kr.test(n)?e.setProperty(et(r),n.replace(kr,""),"important"):e[r]=n}}var Ks=["Webkit","Moz","ms"],To={};function Pc(e,t){let n=To[t];if(n)return n;let r=ye(t);if(r!=="filter"&&r in e)return To[t]=r;r=cn(r);for(let o=0;o<Ks.length;o++){let i=Ks[o]+r;if(i in e)return To[t]=i}return t}function $c(e,t,n,r){return e.tagName==="TEXTAREA"&&(t==="width"||t==="height")&&te(r)&&n===r}var Ys="http://www.w3.org/1999/xlink";function Gs(e,t,n,r,o,i=Di(t)){r&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(Ys,t.slice(6,t.length)):e.setAttributeNS(Ys,t,n):n==null||i&&!rr(n)?e.removeAttribute(t):e.setAttribute(t,i?"":Ie(n)?String(n):n)}function qs(e,t,n,r,o){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?Qs(n):n);return}let i=e.tagName;if(t==="value"&&i!=="PROGRESS"&&!i.includes("-")){let a=i==="OPTION"?e.getAttribute("value")||"":e.value,c=n==null?e.type==="checkbox"?"on":"":String(n);(a!==c||!("_value"in e))&&(e.value=c),n==null&&e.removeAttribute(t),e._value=n;return}let s=!1;if(n===""||n==null){let a=typeof e[t];a==="boolean"?n=rr(n):n==null&&a==="string"?(n="",s=!0):a==="number"&&(n=0,s=!0)}try{e[t]=n}catch{}s&&e.removeAttribute(o||t)}function Lc(e,t,n,r){e.addEventListener(t,n,r)}function Fc(e,t,n,r){e.removeEventListener(t,n,r)}var Js=Symbol("_vei");function Hc(e,t,n,r,o=null){let i=e[Js]||(e[Js]={}),s=i[t];if(r&&s)s.value=r;else{let[a,c]=Bc(t);if(r){let f=i[t]=Kc(r,o);Lc(e,a,f,c)}else s&&(Fc(e,a,s,c),i[t]=void 0)}}var Uc=/(Once|Passive|Capture)$/,jc=/^on:?(?:Once|Passive|Capture)$/;function Bc(e){let t,n;for(;(n=e.match(Uc))&&!jc.test(e);)t||(t={}),e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===":"?e.slice(3):et(e.slice(2)),t]}var ko=0,Wc=Promise.resolve(),zc=()=>ko||(Wc.then(()=>ko=0),ko=Date.now());function Kc(e,t){let n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;let o=n.value;if(R(o)){let i=r.stopImmediatePropagation;r.stopImmediatePropagation=()=>{i.call(r),r._stopped=!0};let s=o.slice(),a=[r];for(let c=0;c<s.length&&!r._stopped;c++){let f=s[c];f&&Me(f,t,5,a)}}else Me(o,t,5,[r])};return n.value=e,n.attached=zc(),n}var Xs=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Yc=(e,t,n,r,o,i)=>{let s=o==="svg";t==="class"?Ac(e,r,s):t==="style"?Ic(e,n,r):Pt(t)?$t(t)||Hc(e,t,n,r,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):Gc(e,t,r,s))?(qs(e,t,r),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&Gs(e,t,r,s,i,t!=="value")):e._isVueCE&&(qc(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!te(r)))?qs(e,ye(t),r,i,t):(t==="true-value"?e._trueValue=r:t==="false-value"&&(e._falseValue=r),Gs(e,t,r,s))};function Gc(e,t,n,r){if(r)return!!(t==="innerHTML"||t==="textContent"||t in e&&Xs(t)&&I(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){let o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return Xs(t)&&te(n)?!1:t in e}function qc(e,t){let n=e._def.props;if(!n)return!1;let r=ye(t);return Array.isArray(n)?n.some(o=>ye(o)===r):Object.keys(n).some(o=>ye(o)===r)}var Jc=ne({patchProp:Yc},Tc),Zs;function Xc(){return Zs||(Zs=Rs(Jc))}var ea=((...e)=>{let t=Xc().createApp(...e),{mount:n}=t;return t.mount=r=>{let o=Qc(r);if(!o)return;let i=t._component;!I(i)&&!i.render&&!i.template&&(i.template=o.innerHTML),o.nodeType===1&&(o.textContent="");let s=n(o,!1,Zc(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),s},t});function Zc(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Qc(e){return te(e)?document.querySelector(e):e}var ra={festival:"\u8282\u5E86",event:"\u4E8B\u4EF6",appointment:"\u9080\u7EA6",class:"\u8BFE\u7A0B",reminder:"\u63D0\u9192",birthday:"\u751F\u65E5",anniversary:"\u7EAA\u5FF5",history:"\u5386\u53F2"};function ed(e){return Array.from({length:e},(t,n)=>String(n+1))}function Vo(e){return e?String(e.hour).padStart(2,"0")+":"+String(e.minute).padStart(2,"0"):""}function ta(e,t){return e.year===t.year&&e.month===t.month&&e.day===t.day}function oa(e){if(e.allDay)return"\u5168\u5929";let t=Vo(e.start.time),n=Vo(e.end?.time);return e.end&&ta(e.start.date,e.end.date)&&t&&n?t+"\u2013"+n:e.end&&!ta(e.start.date,e.end.date)?"\u8DE8\u65E5 \xB7 "+(t||"\u5B9A\u65F6"):t||"\u5B9A\u65F6"}function na(e){return e.date.year+"\u5E74"+e.date.month+"\u6708"+e.date.day+"\u65E5"+(e.time?" "+Vo(e.time):"")}function td(e,t){let n=e.occurrences.slice(0,t),r=e.occurrences.length-n.length;return D("span",{class:"cc-month-cell__events","aria-hidden":"true"},[...n.map(o=>D("span",{class:"cc-month-event",key:o.event.moduleId+":"+o.event.id,title:o.event.title,"data-module-id":o.event.moduleId,"data-event-kind":o.event.kind},o.event.title)),...r>0?[D("span",{class:"cc-month-event cc-month-event--overflow"},"+"+r)]:[]])}function nd(e,t){return D("button",{key:e.key,type:"button",class:"cc-day-detail__event","data-detail-event-id":e.eventId,"data-module-id":e.moduleId,"data-event-kind":e.kind,"aria-label":"\u67E5\u770B\u4E8B\u4EF6\u8BE6\u60C5\uFF1A"+e.title,onClick:n=>t(e,n)},[D("span",{class:"cc-day-detail__event-mark","aria-hidden":"true"}),D("span",{class:"cc-day-detail__event-content"},[D("span",{class:"cc-day-detail__event-title"},e.title),D("span",{class:"cc-day-detail__event-topline"},[D("span",{class:"cc-day-detail__time"},oa(e)),D("span",{class:"cc-day-detail__module"},ra[e.moduleId]??e.moduleId)])]),D("span",{class:"cc-day-detail__event-arrow","aria-hidden":"true"},"\u203A")])}function rd(e,t,n){return D("section",{class:"cc-day-detail","aria-label":"\u9009\u4E2D\u65E5\u8BAE\u7A0B","aria-live":"polite",...e?{"data-day-detail-date":e.key}:{}},[D("header",{class:"cc-day-detail__header"},[D("div",{class:"cc-day-detail__heading"},[D("div",{class:"cc-day-detail__eyebrow"},"\u5F53\u65E5\u8BAE\u7A0B"),D("h3",{class:"cc-day-detail__title"},e?e.date.day+"\u65E5 \xB7 "+t:"\u9009\u62E9\u65E5\u671F")]),...e?.isToday?[D("span",{class:"cc-day-detail__today"},"\u4ECA\u5929")]:[],...e&&e.occurrences.length>=4?[D("span",{class:"cc-day-detail__count"},e.occurrences.length+" \u9879")]:[]]),e?.occurrences.length?D("div",{class:"cc-day-detail__events"},e.occurrences.map(r=>nd(r,n))):D("div",{class:"cc-day-detail__empty-state"},e?"\u5F53\u5929\u6682\u65E0\u4E8B\u4EF6":"\u9009\u62E9\u65E5\u671F\u67E5\u770B\u4E8B\u4EF6")])}var ia=In({name:"CalendarMonthView",props:{model:{type:Object,required:!0},weekdayLabels:{type:Array,default:()=>[]},maxVisibleOccurrences:{type:Number,default:3},busy:{type:Boolean,default:!1}},emits:{selectDate:e=>!0,clearSelection:()=>!0,previousMonth:()=>!0,nextMonth:()=>!0,previousDay:()=>!0,nextDay:()=>!0,goToday:()=>!0},setup(e,{emit:t}){let n=mt(!1),r=mt(null),o=mt(null),i=null,s=Ot(()=>{let v=[...e.weekdayLabels];return v.length===e.model.columns?v:ed(e.model.columns)}),a=Ot(()=>{let v=e.model.cells.findIndex($=>$.isSelected);if(v>=0)return v;let O=e.model.cells.findIndex($=>$.isToday);return O>=0?O:e.model.cells.findIndex($=>$.inCurrentMonth)}),c=Ot(()=>Math.floor(Math.max(0,a.value)/e.model.columns)),f=Ot(()=>{let v=a.value;return v<0?"":s.value[v%e.model.columns]??""}),u=Ot(()=>e.model.selectedDay?.occurrences.find(v=>v.key===r.value)),p=()=>{r.value=null;let v=i;i=null,v&&Rn(()=>v.isConnected&&v.focus())},b=(v,O)=>{i=O.currentTarget,r.value=v.key,Rn(()=>o.value?.querySelector(".cc-event-sheet__close")?.focus())};zt(()=>e.model.selectedDay?.key,()=>{r.value=null,i=null});let C=v=>{v.key==="Escape"?(v.stopPropagation(),p()):v.key==="Tab"&&(v.preventDefault(),o.value?.querySelector(".cc-event-sheet__close")?.focus())};return()=>D("section",{class:"cc-calendar-month","aria-label":e.model.year+"-"+e.model.month,"data-expanded":n.value?"true":"false"},[D("header",{class:"cc-calendar-month__header"},[D("div",{class:"cc-calendar-month__month-switcher"},[D("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Previous month",title:"\u4E0A\u4E2A\u6708",onClick:()=>t("previousMonth")},"\u2039"),D("h2",{class:"cc-calendar-month__title"},e.model.year+" \u5E74 "+e.model.month+" \u6708"),D("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Next month",title:"\u4E0B\u4E2A\u6708",onClick:()=>t("nextMonth")},"\u203A")]),D("div",{class:"cc-calendar-month__header-actions"},[...e.model.selectedDay?.isToday?[]:[D("button",{type:"button",class:"cc-calendar-month__today-link",disabled:e.busy,"aria-label":"\u8FD4\u56DE\u4E16\u754C\u4ECA\u5929",onClick:()=>t("goToday")},"\u56DE\u4ECA\u5929")]])]),D("div",{class:"cc-calendar-month__body"},[D("section",{class:"cc-calendar-month__calendar","aria-label":"\u65E5\u5386\u7F51\u683C"},[D("div",{class:"cc-calendar-month__weekdays",style:{"--cc-calendar-columns":String(e.model.columns)}},s.value.map((v,O)=>D("span",{key:O,class:"cc-calendar-month__weekday","data-weekday":O},v))),D("div",{class:"cc-calendar-month__grid",id:"cc-calendar-grid",style:{"--cc-calendar-columns":String(e.model.columns)}},e.model.cells.map((v,O)=>D("button",{key:v.key,type:"button",class:["cc-month-cell",{"cc-month-cell--outside":!v.inCurrentMonth,"cc-month-cell--today":v.isToday,"cc-month-cell--selected":v.isSelected,"cc-month-cell--active-week":Math.floor(O/e.model.columns)===c.value}],"data-calendar-date":v.key,"aria-label":v.date.day+"\u65E5\uFF0C"+v.occurrences.length+"\u9879\u4E8B\u4EF6","aria-pressed":v.isSelected?"true":"false",onClick:()=>t("selectDate",v.date)},[D("span",{class:"cc-month-cell__day"},String(v.date.day)),td(v,Math.max(0,Math.floor(e.maxVisibleOccurrences)))]))),D("button",{type:"button",class:"cc-calendar-month__fold","aria-controls":"cc-calendar-grid","aria-expanded":n.value?"true":"false",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386 \u2303":"\u5C55\u5F00\u6708\u5386 \u2304")]),rd(e.model.selectedDay,f.value,b)]),D("nav",{class:"cc-calendar-month__bottom-nav","aria-label":"\u65E5\u671F\u5FEB\u6377\u5BFC\u822A"},[D("button",{type:"button",disabled:e.busy,"aria-label":"\u524D\u4E00\u5929",onClick:()=>t("previousDay")},"\u2039 \u524D\u4E00\u5929"),D("button",{type:"button",disabled:e.busy,"aria-label":n.value?"\u6536\u8D77\u6708\u5386":"\u5C55\u5F00\u6708\u5386",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386":"\u6708\u5386"),D("button",{type:"button",disabled:e.busy,"aria-label":"\u540E\u4E00\u5929",onClick:()=>t("nextDay")},"\u540E\u4E00\u5929 \u203A")]),...u.value?[D("div",{class:"cc-event-sheet",ref:o,role:"dialog","aria-modal":"true","aria-label":"\u4E8B\u4EF6\u8BE6\u60C5",onClick:v=>{v.target===v.currentTarget&&p()},onKeydown:C},[D("article",{class:"cc-event-sheet__card"},[D("header",{class:"cc-event-sheet__header"},[D("span",{},"\u4E8B\u4EF6\u8BE6\u60C5"),D("button",{type:"button",class:"cc-event-sheet__close",onClick:p},"\u8FD4\u56DE\u5217\u8868 \xD7")]),D("div",{class:"cc-event-sheet__content"},[D("h3",{class:"cc-event-sheet__title"},u.value.title),D("dl",{class:"cc-event-sheet__fields"},[D("dt",{},"\u65F6\u95F4"),D("dd",{},oa(u.value)),D("dt",{},"\u5F00\u59CB"),D("dd",{},na(u.value.start)),...u.value.end?[D("dt",{},"\u7ED3\u675F"),D("dd",{},na(u.value.end))]:[],D("dt",{},"\u7C7B\u522B"),D("dd",{},ra[u.value.moduleId]??u.value.moduleId),...u.value.tags.length?[D("dt",{},"\u6807\u7B7E"),D("dd",{},u.value.tags.join(" \xB7 "))]:[]])])])])]:[]])}});var sa=String.raw`
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
`;var aa=String.raw`
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
`+sa;async function la(e,t){let n=await t.session.load(),r=fr(n),o=mt(!1),i=null,s=In({name:"CalendarMonthRendererRoot",setup(){let f=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.navigateMonths(C)}finally{o.value=!1}}},u=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.goToDate(C),t.onSelectedDateChange?.(C)}finally{o.value=!1}}},p=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.stepSelectedDate(C);let v=r.value.selectedDay?.date;v&&t.onSelectedDateChange?.(v)}finally{o.value=!1}}},b=()=>{r.value=t.session.clearSelectedDate()};return()=>D(ia,{model:r.value,weekdayLabels:t.weekdayLabels,maxVisibleOccurrences:t.maxVisibleOccurrences,busy:o.value,onPreviousMonth:()=>{f(-1)},onNextMonth:()=>{f(1)},onSelectDate:C=>{u(C)},onPreviousDay:()=>{p(-1)},onNextDay:()=>{p(1)},onGoToday:()=>{u(r.value.today)},onClearSelection:b})}}),a=e.ownerDocument.createElement("style");a.dataset.calendarCoreRenderer="vue-month",a.textContent=aa;let c=e.ownerDocument.createElement("div");return c.dataset.calendarCoreMount="vue-month",e.replaceChildren(a,c),i=ea(s),i.mount(c),{async refresh(){return r.value=await t.session.load(),r.value},destroy(){i?.unmount(),i=null,e.replaceChildren()}}}var Ar="__calendarCoreSillyTavernShellDestroy__",da="calendar-core:shell:button-position:v1",od=980,Vr=8,id=4;function sd(){try{if(window.parent&&window.parent!==window&&window.parent.document)return window.parent.document}catch{}return document}function ca(e,t,n){return Math.min(Math.max(e,t),Math.max(t,n))}function ad(e){try{let t=e.localStorage?.getItem(da);if(!t)return null;let n=JSON.parse(t);return typeof n.left!="number"||typeof n.top!="number"||!Number.isFinite(n.left)||!Number.isFinite(n.top)?null:{left:n.left,top:n.top}}catch{return null}}function ld(e,t){try{e.localStorage?.setItem(da,JSON.stringify(t))}catch{}}function cd(e){let t=e.createElement("style");return t.dataset.calendarCoreShellStyle="month",t.textContent=['[data-calendar-core-shell="button"] {',"  position: fixed;","  left: calc(100vw - 88px);","  top: 32vh;","  z-index: 2147483001;","  display: grid;","  place-items: center;","  width: 68px;","  height: 68px;","  padding: 0;","  border: 1px solid rgba(147, 112, 51, 0.45);","  border-radius: 20px;","  background: rgba(233, 211, 171, 0.86);","  color: #4c3820;","  font: inherit;","  font-size: 32px;","  line-height: 1;","  box-shadow: 0 14px 30px rgba(68, 44, 20, 0.18);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  cursor: grab;","  touch-action: none;","  user-select: none;","  transition: box-shadow 140ms ease, transform 140ms ease;","}","",'[data-calendar-core-shell="button"]:hover {',"  transform: translateY(-1px);","  box-shadow: 0 18px 36px rgba(68, 44, 20, 0.24);","}","",'[data-calendar-core-shell="button"][data-dragging="true"] {',"  cursor: grabbing;","  transform: none;","}","",'[data-calendar-core-shell="panel"] {',"  position: fixed;","  left: 2vw;","  top: 2vh;","  z-index: 2147483000;","  width: min(1560px, calc(100vw - 40px));","  height: min(960px, calc(100dvh - 40px));","  padding: 16px;","  overflow: hidden;","  border: 1px solid rgba(155, 128, 84, 0.22);","  border-radius: 28px;","  background: rgba(242, 234, 220, 0.94);","  color: #2c241b;","  box-shadow: 0 28px 60px rgba(56, 38, 20, 0.24);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  box-sizing: border-box;","}","",'[data-calendar-core-shell="panel"][hidden] {',"  display: none;","}","",'[data-calendar-core-shell="chrome"] {',"  height: 48px;","  display: flex;","  align-items: center;","  gap: 12px;","  padding: 0 4px 12px 6px;","  cursor: move;","  user-select: none;","  box-sizing: border-box;","}","",'[data-calendar-core-shell="chrome-title"] {',"  min-width: 0;","  flex: 1;","  color: #3b2d1f;",'  font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',"  font-size: 15px;","  font-weight: 800;","  letter-spacing: 0.02em;","}","",'[data-calendar-core-shell="close"] {',"  width: 34px;","  height: 34px;","  padding: 0;","  border: 1px solid rgba(155, 128, 84, 0.2);","  border-radius: 10px;","  background: rgba(255, 252, 246, 0.72);","  color: #6e4510;","  font: inherit;","  font-size: 20px;","  line-height: 1;","  cursor: pointer;","}","",'[data-calendar-core-shell="close"]:hover {',"  background: linear-gradient(180deg, #fff7ea, #f4dfad);","}","",'[data-calendar-core-shell="frame"] {',"  display: block;","  width: 100%;","  height: calc(100% - 48px);","  border: 1px solid rgba(155, 128, 84, 0.14);","  border-radius: 22px;","  background: rgba(255, 252, 246, 0.96);","  box-sizing: border-box;","}","","@media (max-width: 980px) {",'  [data-calendar-core-shell="button"] {',"    width: 52px;","    height: 52px;","    border-radius: 16px;","    font-size: 23px;","  }","",'  [data-calendar-core-shell="button"]:hover {',"    transform: none;","  }","",'  [data-calendar-core-shell="panel"] {',"    inset: 0;","    width: 100vw;","    height: 100dvh;","    padding: 0;","    border: 0;","    border-radius: 0;","    background: #f7f0e5;","  }","",'  [data-calendar-core-shell="chrome"] {',"    position: relative;","    height: 0;","    padding: 0;","    border: 0;","    background: transparent;","    cursor: default;","    z-index: 5;","    pointer-events: none;","  }","",'  [data-calendar-core-shell="chrome-title"] {',"    display: none;","  }","",'  [data-calendar-core-shell="close"] {',"    position: absolute;","    top: 7px;","    right: 8px;","    width: 38px;","    height: 38px;","    pointer-events: auto;","    background: #fcf9f2;","  }","",'  [data-calendar-core-shell="frame"] {',"    height: 100%;","    border: 0;","    border-radius: 0;","  }","}"].join(`
`),t}function dd(){return["<!doctype html>","<html>","<head>",'  <meta charset="utf-8">','  <meta name="viewport" content="width=device-width,initial-scale=1">',"  <style>","    :root { color-scheme: light; }","    html, body { width: 100%; height: 100%; min-height: 100%; }","    body {","      margin: 0;","      overflow: hidden;","      background:","        radial-gradient(circle at 10% 0%, rgba(239,209,137,0.12), transparent 34%),","        linear-gradient(180deg, #fffdf8, #f8f0e5);","      color: #2c241b;",'      font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',"    }","  </style>","</head>","<body></body>","</html>"].join(`
`)}function ud(e){return e.contentDocument?.readyState==="complete"?Promise.resolve():new Promise(t=>{e.addEventListener("load",()=>t(),{once:!0})})}async function ua(e){let t=e.pageDocument??sd(),n=e.lifecycleWindow??window,r=t.defaultView,o=t.defaultView??n;r?.[Ar]?.();let i=cd(t),s=t.createElement("button");s.type="button",s.dataset.calendarCoreShell="button",s.textContent=e.buttonLabel??"\u{1F4C5}",s.title=e.buttonTitle??"\u6253\u5F00\u6708\u5386",s.setAttribute("aria-label",s.title);let a=t.createElement("section");a.dataset.calendarCoreShell="panel",a.setAttribute("aria-label","\u6708\u5386\u60AC\u6D6E\u9762\u677F");let c=t.createElement("div");c.dataset.calendarCoreShell="chrome";let f=t.createElement("div");f.dataset.calendarCoreShell="chrome-title",f.textContent="\u6708\u5386";let u=t.createElement("button");u.type="button",u.dataset.calendarCoreShell="close",u.textContent="\xD7",u.title="\u5173\u95ED",u.setAttribute("aria-label","\u5173\u95ED\u6708\u5386");let p=t.createElement("iframe");p.dataset.calendarCoreShell="frame",p.title="Calendar",p.setAttribute("frameborder","0"),p.srcdoc=dd(),c.append(f,u),a.append(c,p);let b=e.initiallyOpen??!1,C=null,v=!1,O=e.pendingMessage??"\u7B49\u5F85\u5386\u6CD5\u6570\u636E\u521D\u59CB\u5316",$=null,q=!1,M=null,P=null,X=null,S=()=>({width:o.innerWidth||t.documentElement.clientWidth||0,height:o.innerHeight||t.documentElement.clientHeight||0}),Z=()=>S().width>od,fe=(T,L,ae)=>{let he=S(),Ze=T.getBoundingClientRect(),Zt=Ze.width||T.offsetWidth,Qt=Ze.height||T.offsetHeight;return{left:ca(L,Vr,he.width-Zt-Vr),top:ca(ae,Vr,he.height-Qt-Vr)}},ve=T=>{if(!T){s.style.left="",s.style.top="";return}let L=fe(s,T.left,T.top);s.style.left=`${L.left}px`,s.style.top=`${L.top}px`},we=()=>{if(!Z()){a.style.left="",a.style.top="",X=null;return}let T=S(),L=Math.min(1560,Math.max(0,T.width-40)),ae=Math.min(960,Math.max(0,T.height-40));X={left:Math.round((T.width-L)/2),top:Math.round((T.height-ae)/2)},a.style.left=`${X.left}px`,a.style.top=`${X.top}px`},He=()=>{a.hidden=!b,s.hidden=b,s.setAttribute("aria-expanded",b?"true":"false"),s.title=b?"\u5173\u95ED\u6708\u5386":e.buttonTitle??"\u6253\u5F00\u6708\u5386"},Ue=()=>{v||(b=!0,Z()&&!X&&we(),He())},ke=()=>{v||(b=!1,He())},_t=()=>{b?ke():Ue()},Jt=()=>{if(q){q=!1;return}_t()},St=T=>{if(v||b||T.button!==0)return;let L=s.getBoundingClientRect();M={pointerId:T.pointerId,startX:T.clientX,startY:T.clientY,left:L.left,top:L.top,moved:!1},s.dataset.dragging="true",s.setPointerCapture?.(T.pointerId)},ce=T=>{if(M&&T.pointerId===M.pointerId){let L=T.clientX-M.startX,ae=T.clientY-M.startY;Math.hypot(L,ae)>id&&(M.moved=!0);let he=fe(s,M.left+L,M.top+ae);s.style.left=`${he.left}px`,s.style.top=`${he.top}px`,M.moved&&T.preventDefault();return}if(P&&T.pointerId===P.pointerId&&Z()){let L=T.clientX-P.startX,ae=T.clientY-P.startY,he=fe(a,P.left+L,P.top+ae);X=he,a.style.left=`${he.left}px`,a.style.top=`${he.top}px`,T.preventDefault()}},J=T=>{if(!(!M||T.pointerId!==M.pointerId)){if(M.moved){let L=s.getBoundingClientRect(),ae={left:L.left,top:L.top};ld(o,ae),q=!0}M=null,delete s.dataset.dragging}},B=T=>{if(v||!b||!Z()||T.button!==0||T.target?.closest("button"))return;let L=a.getBoundingClientRect();P={pointerId:T.pointerId,startX:T.clientX,startY:T.clientY,left:L.left,top:L.top,moved:!1},c.setPointerCapture?.(T.pointerId),T.preventDefault()},xe=T=>{J(T),P&&T.pointerId===P.pointerId&&(P=null)},Tt=()=>{let T=s.getBoundingClientRect();if(s.style.left&&s.style.top&&ve({left:T.left,top:T.top}),!Z()){X=null,a.style.left="",a.style.top="";return}X?(X=fe(a,X.left,X.top),a.style.left=`${X.left}px`,a.style.top=`${X.top}px`):we()},lt=T=>{T.key==="Escape"&&b&&ke()};s.addEventListener("click",Jt),s.addEventListener("pointerdown",St),c.addEventListener("pointerdown",B),u.addEventListener("click",ke),t.addEventListener("pointermove",ce),t.addEventListener("pointerup",xe),t.addEventListener("pointercancel",xe),t.addEventListener("keydown",lt),o.addEventListener("resize",Tt),t.head.append(i),t.body.append(a,s),ve(ad(o)),we(),He();let ct=ud(p),pe=()=>{v||(v=!0,C?.destroy(),C=null,s.removeEventListener("click",Jt),s.removeEventListener("pointerdown",St),c.removeEventListener("pointerdown",B),u.removeEventListener("click",ke),t.removeEventListener("pointermove",ce),t.removeEventListener("pointerup",xe),t.removeEventListener("pointercancel",xe),t.removeEventListener("keydown",lt),o.removeEventListener("resize",Tt),n.removeEventListener("pagehide",pe),s.remove(),a.remove(),i.remove(),r?.[Ar]===pe&&delete r[Ar])};if(n.addEventListener("pagehide",pe),r&&(r[Ar]=pe),await ct,v)throw new Error("Calendar shell was destroyed before its iframe loaded");let Xt=p.contentDocument;if(!Xt?.body)throw pe(),new Error("Calendar shell iframe document is unavailable");$=Xt;let Fn=T=>{if(O=T,!$||C||v)return;let L=$.createElement("main");L.dataset.calendarCoreState="waiting",L.setAttribute("role","status"),L.style.cssText="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;padding:24px;box-sizing:border-box;text-align:center;gap:12px;color:#604b35;background:#f6f0e4;";let ae=$.createElement("strong");ae.textContent="\u65E5\u5386\u5C1A\u672A\u521D\u59CB\u5316",ae.style.fontSize="18px";let he=$.createElement("span");he.textContent=T,he.style.cssText="font-size:13px;line-height:1.6;max-width:350px;",L.append(ae,he),$.body.replaceChildren(L)},Hn=async T=>{if(v||!$||C)return;let L=await la($.body,{session:T,weekdayLabels:e.weekdayLabels,maxVisibleOccurrences:e.maxVisibleOccurrences,onSelectedDateChange:e.onSelectedDateChange});v?L.destroy():C=L};return e.session?await Hn(e.session):Fn(O),{open:Ue,close:ke,toggle:_t,isOpen:()=>b,activateSession:Hn,showPending:Fn,refresh:()=>C?C.refresh():Promise.resolve(null),destroy:pe}}function qt(e){return{ready:!1,message:e}}function fa(e){let t=e.getLastMessageId();if(!Number.isInteger(t)||t<0)return qt("\u7B49\u5F85\u804A\u5929\u6D88\u606F\u548C\u5386\u6CD5\u6570\u636E\u521D\u59CB\u5316");let n;try{n=new kt(e).readLatest()}catch{return qt("\u7B49\u5019\u5F53\u524D\u6D88\u606F\u53D8\u91CF\u5C31\u7EEA")}let r=bt(n,"calendar.now"),o=bt(n,"calendar.weekAnchor");if(r==null||o===void 0||o===null)return qt("\u7B49\u5F85 calendar.now \u4E0E calendar.weekAnchor \u521D\u59CB\u5316");let i=Ir(r),s=Ei(o);if(!i||!s)return qt("\u5386\u6CD5\u53D8\u91CF\u683C\u5F0F\u4E0D\u5B8C\u6574\uFF0C\u8BF7\u68C0\u67E5 calendar.now / calendar.weekAnchor");if(s.weekday>6)return qt("\u5F53\u524D ST \u5165\u53E3\u4F7F\u7528\u4E03\u65E5\u5236\uFF0CweekAnchor.weekday \u5FC5\u987B\u4E3A 0\u20136");try{Q(i.date),Q(s.date)}catch{return qt("\u5386\u6CD5\u53D8\u91CF\u4E2D\u7684\u5E74\u6708\u65E5\u65E0\u6548")}return{ready:!0,currentDate:{...i.date},weekAnchor:s}}async function fd(){window.CalendarCoreRuntime?.destroy();let e=await ua({pendingMessage:"\u7B49\u5F85 calendar.now \u4E0E calendar.weekAnchor \u521D\u59CB\u5316",buttonLabel:"\u{1F4C5}",buttonTitle:"Calendar",weekdayLabels:["\u65E5","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D"]}),t=!1,n=!1,r=!1,o,i="",s=async()=>{if(!(t||n||r)){r=!0;try{let c;try{c=Po()}catch{e.showPending("\u7B49\u5F85 SillyTavern \u6D88\u606F\u53D8\u91CF\u63A5\u53E3\u5C31\u7EEA");return}let f=fa(c);if(!f.ready){e.showPending(f.message);return}let u=new er({runtime:c,timePath:"calendar.now"});u.registerModule({adapter:Bo,path:"calendar.modules.event",parser:Wo}),u.registerModule({adapter:zo,path:"calendar.modules.appointment",parser:Ko}),u.registerModule({adapter:Yo,path:"calendar.modules.birthday",parser:Go}),u.registerModule({adapter:qo,path:"calendar.modules.anniversary",parser:Jo}),u.registerModule({adapter:Xo,path:"calendar.modules.class",parser:Zo}),u.registerModule({adapter:Qo,path:"calendar.modules.reminder",parser:ei}),u.registerModule({adapter:ti,path:"calendar.modules.history",parser:ni}),u.registerModule({adapter:Uo,path:"calendar.modules.festival",parser:jo});let p=await u.createMonthSession({weekAnchor:f.weekAnchor,selectedDate:f.currentDate});if(await e.activateSession(p),t)return;n=!0,o!==void 0&&(window.clearInterval(o),o=void 0)}catch(c){let f=c instanceof Error?c.message:String(c);e.showPending("\u5386\u6CD5\u6570\u636E\u5DF2\u8BFB\u53D6\uFF0C\u4F46\u65E5\u5386\u52A0\u8F7D\u5931\u8D25\uFF1A"+f),i!==f&&(console.warn("[CalendarCore] Waiting to recover from initialization error",c),i=f)}finally{r=!1}}},a={destroy:()=>{t||(t=!0,o!==void 0&&window.clearInterval(o),e.destroy(),window.CalendarCoreRuntime===a&&delete window.CalendarCoreRuntime)},refresh:async()=>(n||await s(),e.refresh())};window.CalendarCoreRuntime=a,o=window.setInterval(()=>{s()},2e3),await s()}fd().catch(e=>{console.error("[CalendarCore] Failed to mount calendar shell",e)});})();
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

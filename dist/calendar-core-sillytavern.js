"use strict";(()=>{function Ro(){let e=globalThis;if(typeof e.getLastMessageId!="function")throw new Error("SillyTavern getLastMessageId API is unavailable");if(typeof e.getVariables!="function")throw new Error("SillyTavern getVariables API is unavailable");let t=e.getLastMessageId,n=e.getVariables,r=e.Mvu?.getMvuData;return{getLastMessageId:()=>t(),getVariables:o=>n(o),...r?{getMvuData:o=>r.call(e.Mvu,o)}:{}}}function Ar(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}var Pn=class{constructor(t){this.runtime=t}runtime;readLatest(){let t=this.runtime.getLastMessageId();if(!Number.isInteger(t)||t<0)throw new Error(`SillyTavern returned an invalid latest message id: ${String(t)}`);let n={type:"message",message_id:t};if(this.runtime.getMvuData)try{let o=this.runtime.getMvuData(n);if(Ar(o))return o}catch{}let r=this.runtime.getVariables(n);if(!Ar(r))throw new Error("SillyTavern message variables are not an object");return r}};function St(e,t){let n=typeof t=="string"?t.split(".").map(o=>o.trim()).filter(Boolean):[...t],r=e;for(let o of n){if(!Ar(r)||!(o in r))return;r=r[o]}return r}function Vr(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Zt(e,t){let n=e[t];return Number.isInteger(n)?Number(n):null}function Io(e){if(!Vr(e))return null;let t=Zt(e,"year"),n=Zt(e,"month"),r=Zt(e,"day");return t===null||n===null||r===null?null:{year:t,month:n,day:r}}function da(e){if(typeof e>"u")return;if(!Vr(e))return null;let t=Zt(e,"hour"),n=Zt(e,"minute");return t===null||n===null?null:{hour:t,minute:n}}var ua=e=>{if(!Vr(e))return null;let t="date"in e?Io(e.date):Io(e);if(!t)return null;let n=da(e.time);return n===null?null:{date:t,...n?{time:n}:{}}},$n=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser??ua}getCurrentPoint(){let t=this.reader.readLatest(),n=St(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse current calendar time at message variable path "${o}"`)}return r}};var Ln=class{reader;path;parser;constructor(t){this.reader=t.reader,this.path=t.path,this.parser=t.parser}load(){let t=this.reader.readLatest(),n=St(t,this.path),r=this.parser(n);if(!r){let o=Array.isArray(this.path)?this.path.join("."):this.path;throw new Error(`Unable to parse calendar module data at message variable path "${o}"`)}return r}};function Fn(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function fa(e,t){return e.month-t.month||e.day-t.day}function Po(e,t){return Fn(t,"festival anchorYear"),Fn(e.month,"festival month"),Fn(e.day,"festival day"),{year:t,month:e.month,day:e.day}}function $o(e,t,n){let r=t??e,o=fa(r,e)<0?n+1:n;return{start:{date:Po(e,n)},end:{date:Po(r,o)}}}function Lo(e){if(e!==null)return Fn(e,"festival repeatEveryYears"),{frequency:"yearly",interval:e}}function pa(e,t){let n=t.anchorYear??e.anchorYear,r=t.repeatEveryYears===void 0?e.repeatEveryYears:t.repeatEveryYears,o=Lo(r);return{id:`${e.id}:stage:${t.id}`,moduleId:"festival",kind:"festival-stage",title:`${e.title} \xB7 ${t.title}`,...$o(t.start,t.end,n),allDay:!0,...o?{recurrence:o}:{},tags:["festival","festival-stage"],payload:{role:"stage",festivalId:e.id,stageId:t.id,stageTitle:t.title,summary:t.summary??"",metadata:t.metadata??{}}}}var Fo={moduleId:"festival",normalize(e){let t=Lo(e.repeatEveryYears);return[{id:e.id,moduleId:this.moduleId,kind:"festival",title:e.title,...$o(e.start,e.end,e.anchorYear),allDay:!0,...t?{recurrence:t}:{},tags:["festival",...e.tags??[]],payload:{role:"festival",summary:e.summary??"",relatedBookIds:[...e.relatedBookIds??[]],locationKeywords:[...e.locationKeywords??[]],metadata:e.metadata??{}}},...(e.stages??[]).map(r=>pa(e,r))]}};function Qt(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function _t(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function Tt(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function ha(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=_t(n);if(!r)return null;t.push(r)}return t}function Hn(e){if(!Qt(e))return null;let t=Tt(e.month),n=Tt(e.day);return t&&n?{month:t,day:n}:null}function ma(e){if(!Qt(e))return null;let t=_t(e.id),n=_t(e.title),r=Hn(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Hn(e.end);if(!i)return null;o.end=i}if("anchorYear"in e&&typeof e.anchorYear<"u"){let i=Tt(e.anchorYear);if(!i)return null;o.anchorYear=i}if("repeatEveryYears"in e)if(e.repeatEveryYears===null)o.repeatEveryYears=null;else{let i=Tt(e.repeatEveryYears);if(!i)return null;o.repeatEveryYears=i}if("summary"in e&&typeof e.summary<"u"){let i=_t(e.summary);if(!i)return null;o.summary=i}if("metadata"in e&&typeof e.metadata<"u"){if(!Qt(e.metadata))return null;o.metadata={...e.metadata}}return o}function ga(e){if(!Qt(e))return null;let t=_t(e.id),n=_t(e.title),r=Hn(e.start),o=Tt(e.anchorYear);if(!t||!n||!r||!o)return null;let i=1;if("repeatEveryYears"in e)if(e.repeatEveryYears===null)i=null;else{let a=Tt(e.repeatEveryYears);if(!a)return null;i=a}let s={id:t,title:n,start:r,anchorYear:o,repeatEveryYears:i};if("end"in e&&typeof e.end<"u"){let a=Hn(e.end);if(!a)return null;s.end=a}if("summary"in e&&typeof e.summary<"u"){let a=_t(e.summary);if(!a)return null;s.summary=a}for(let a of["tags","relatedBookIds","locationKeywords"])if(a in e&&typeof e[a]<"u"){let c=ha(e[a]);if(!c)return null;s[a]=c}if("metadata"in e&&typeof e.metadata<"u"){if(!Qt(e.metadata))return null;s.metadata={...e.metadata}}if("stages"in e&&typeof e.stages<"u"){if(!Array.isArray(e.stages))return null;let a=[];for(let c of e.stages){let f=ma(c);if(!f)return null;a.push(f)}s.stages=a}return s}function Ho(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=ga(n);if(!r)return null;t.push(r)}return t}var Uo={moduleId:"event",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"event",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{summary:e.summary??"",metadata:e.metadata??{}}}}};function te(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function j(e){if(typeof e!="string")return null;let t=e.trim();return t||null}function kt(e){return typeof e=="boolean"?e:null}function Un(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function pe(e){if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=j(n);if(!r)return null;t.push(r)}return t}function be(e){return te(e)?{...e}:null}function At(e){if(!te(e))return null;let t=Un(e.year),n=Un(e.month),r=Un(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function ya(e){if(!te(e))return null;let t=Number.isInteger(e.hour)?Number(e.hour):null,n=Number.isInteger(e.minute)?Number(e.minute):null;return t===null||n===null||t<0||t>23||n<0||n>59?null:{hour:t,minute:n}}function Ce(e){if(!te(e))return null;let t=At(e.date);if(!t)return null;if("time"in e&&typeof e.time<"u"){let n=ya(e.time);return n?{date:t,time:n}:null}return{date:t}}var _a=new Set(["daily","weekly","monthly","yearly"]);function ct(e){if(!te(e))return null;let t=typeof e.frequency=="string"&&_a.has(e.frequency)?e.frequency:null;if(!t)return null;let n={frequency:t};if("interval"in e&&typeof e.interval<"u"){let r=Un(e.interval);if(!r)return null;n.interval=r}if("until"in e&&typeof e.until<"u"){let r=At(e.until);if(!r)return null;n.until=r}return n}function ba(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=Ce(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Ce(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=kt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ct(e.recurrence);if(!i)return null;o.recurrence=i}if("summary"in e&&typeof e.summary<"u"){let i=j(e.summary);if(!i)return null;o.summary=i}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function jo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=ba(n);if(!r)return null;t.push(r)}return t}var Bo={moduleId:"appointment",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"appointment",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{location:e.location??"",attendees:[...e.attendees??[]],notes:e.notes??"",metadata:e.metadata??{}}}}};function Ea(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=Ce(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Ce(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=kt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ct(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["location","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("attendees"in e&&typeof e.attendees<"u"){let i=pe(e.attendees);if(!i)return null;o.attendees=i}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function Wo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ea(n);if(!r)return null;t.push(r)}return t}var Ko={moduleId:"birthday",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"birthday",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{subject:e.subject??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function va(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=At(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["subject","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function zo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=va(n);if(!r)return null;t.push(r)}return t}var Yo={moduleId:"anniversary",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"anniversary",title:e.title,start:{date:{...e.date}},allDay:!0,recurrence:{frequency:"yearly"},tags:[...e.tags??[]],payload:{category:e.category??"",notes:e.notes??"",originDate:{...e.date},metadata:e.metadata??{}}}}};function wa(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=At(e.date);if(!t||!n||!r)return null;let o={id:t,title:n,date:r};for(let i of["category","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function Go(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=wa(n);if(!r)return null;t.push(r)}return t}var qo={moduleId:"class",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"class",title:e.title,start:e.start,...e.end?{end:e.end}:{},allDay:e.allDay??!e.start.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{courseId:e.courseId??"",instructor:e.instructor??"",location:e.location??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function xa(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=Ce(e.start);if(!t||!n||!r)return null;let o={id:t,title:n,start:r};if("end"in e&&typeof e.end<"u"){let i=Ce(e.end);if(!i)return null;o.end=i}if("allDay"in e&&typeof e.allDay<"u"){let i=kt(e.allDay);if(i===null)return null;o.allDay=i}if("recurrence"in e&&typeof e.recurrence<"u"){let i=ct(e.recurrence);if(!i)return null;o.recurrence=i}for(let i of["courseId","instructor","location","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function Jo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=xa(n);if(!r)return null;t.push(r)}return t}var Xo={moduleId:"reminder",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"reminder",title:e.title,start:e.at,allDay:!e.at.time,...e.recurrence?{recurrence:e.recurrence}:{},tags:[...e.tags??[]],payload:{message:e.message??"",target:e.target?{...e.target}:null,metadata:e.metadata??{}}}}};function jn(e){if(!te(e))return null;let t=j(e.moduleId),n=j(e.eventId);return t&&n?{moduleId:t,eventId:n}:null}function Ca(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=Ce(e.at);if(!t||!n||!r)return null;let o={id:t,title:n,at:r};if("recurrence"in e&&typeof e.recurrence<"u"){let i=ct(e.recurrence);if(!i)return null;o.recurrence=i}if("message"in e&&typeof e.message<"u"){let i=j(e.message);if(!i)return null;o.message=i}if("target"in e&&typeof e.target<"u"){let i=jn(e.target);if(!i)return null;o.target=i}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function Zo(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Ca(n);if(!r)return null;t.push(r)}return t}var Qo={moduleId:"history",normalize(e){return{id:e.id,moduleId:this.moduleId,kind:"history",title:e.title,start:e.occurredAt,allDay:!e.occurredAt.time,tags:[...e.tags??[]],payload:{source:e.source?{...e.source}:null,outcome:e.outcome??"",notes:e.notes??"",metadata:e.metadata??{}}}}};function Na(e){if(!te(e))return null;let t=j(e.id),n=j(e.title),r=Ce(e.occurredAt);if(!t||!n||!r)return null;let o={id:t,title:n,occurredAt:r};if("source"in e&&typeof e.source<"u"){let i=jn(e.source);if(!i)return null;o.source=i}for(let i of["outcome","notes"])if(i in e&&typeof e[i]<"u"){let s=j(e[i]);if(!s)return null;o[i]=s}if("tags"in e&&typeof e.tags<"u"){let i=pe(e.tags);if(!i)return null;o.tags=i}if("metadata"in e&&typeof e.metadata<"u"){let i=be(e.metadata);if(!i)return null;o.metadata=i}return o}function ei(e){if(e===null||typeof e>"u")return[];if(!Array.isArray(e))return null;let t=[];for(let n of e){let r=Na(n);if(!r)return null;t.push(r)}return t}function Bn(e,t){if(!Number.isInteger(e)||e<1)throw new RangeError(`${t} must be a positive integer`)}function Da(e){return Bn(e,"year"),e%400===0||e%4===0&&e%100!==0}var X={id:"gregorian",daysInWeek:7,monthsInYear(e){return Bn(e,"year"),12},daysInMonth(e,t){if(Bn(e,"year"),Bn(t,"month"),t>12)throw new RangeError("month must be between 1 and 12 for the Gregorian calendar");return t===2?Da(e)?29:28:[4,6,9,11].includes(t)?30:31}};function Vt(e,t){if(!Number.isInteger(e))throw new RangeError(`${t} must be an integer`)}function ni(e,t){if(!Number.isInteger(e.daysInWeek)||e.daysInWeek<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid week length`);let n=e.monthsInYear(t);if(!Number.isInteger(n)||n<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid month count`)}function bt(e,t,n){let r=e.daysInMonth(t,n);if(!Number.isInteger(r)||r<1)throw new RangeError(`Calendar system "${e.id}" returned an invalid day count`);return r}function dt(e){return{year:e.year,month:e.month,day:e.day}}function ne(e,t=X){if(Vt(e.year,"year"),Vt(e.month,"month"),Vt(e.day,"day"),e.year<1)throw new RangeError("year must be at least 1");ni(t,e.year);let n=t.monthsInYear(e.year);if(e.month<1||e.month>n)throw new RangeError(`month must be between 1 and ${n} for calendar "${t.id}"`);let r=bt(t,e.year,e.month);if(e.day<1||e.day>r)throw new RangeError(`day must be between 1 and ${r} for ${e.year}-${e.month}`)}function ie(e,t){return e.year!==t.year?e.year-t.year:e.month!==t.month?e.month-t.month:e.day-t.day}function Mr(e,t){return ie(e,t)===0}function ri(e,t){let n=t.monthsInYear(e.year);return e.month<n?{year:e.year,month:e.month+1}:{year:e.year+1,month:1}}function oi(e,t){if(e.month>1)return{year:e.year,month:e.month-1};if(e.year<=1)throw new RangeError("CalendarCore does not support dates before year 1");let n=e.year-1;return{year:n,month:t.monthsInYear(n)}}function Qe(e,t,n=X){Vt(t,"delta"),ne(e,n);let r=dt(e);if(t>0){let i=t;for(;i>0;){let a=bt(n,r.year,r.month)-r.day;if(i<=a)return r.day+=i,r;i-=a+1,r={...ri(r,n),day:1}}return r}let o=-t;for(;o>0;){if(o<r.day)return r.day-=o,r;o-=r.day;let i=oi(r,n);r={...i,day:bt(n,i.year,i.month)}}return r}function Wn(e,t,n=X){Vt(t,"delta"),ne(e,n);let r={year:e.year,month:e.month},o=Math.sign(t);for(let i=Math.abs(t);i>0;i-=1)r=o>0?ri(r,n):oi(r,n);return{...r,day:Math.min(e.day,bt(n,r.year,r.month))}}function ii(e,t,n=X){Vt(t,"delta"),ne(e,n);let r=e.year+t;if(r<1)throw new RangeError("CalendarCore does not support dates before year 1");let o=Math.min(e.month,n.monthsInYear(r));return{year:r,month:o,day:Math.min(e.day,bt(n,r,o))}}function ti(e,t){ne(e,t);let n=0;for(let r=1;r<e.year;r+=1){ni(t,r);let o=t.monthsInYear(r);for(let i=1;i<=o;i+=1)n+=bt(t,r,i)}for(let r=1;r<e.month;r+=1)n+=bt(t,e.year,r);return n+e.day-1}function Oa(e,t,n=X){return ti(t,n)-ti(e,n)}function Kn(e,t,n=X){if(ne(t.date,n),ne(e,n),!Number.isInteger(t.weekday)||t.weekday<0||t.weekday>=n.daysInWeek)throw new RangeError(`weekday must be between 0 and ${n.daysInWeek-1}`);return((t.weekday+Oa(t.date,e,n))%n.daysInWeek+n.daysInWeek)%n.daysInWeek}function Rr(e,t){return ie(e.start,t.end)<=0&&ie(e.end,t.start)>=0}function si(e,t){return ie(e,t.start)>=0&&ie(e,t.end)<=0}function zn(e,t=X){if(ne(e.start,t),ne(e.end,t),ie(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end");let n=[],r=dt(e.start);for(;ie(r,e.end)<=0;)n.push(dt(r)),r=Qe(r,1,t);return n}function en(e){let t=n=>String(n).padStart(2,"0");return`${e.year}-${t(e.month)}-${t(e.day)}`}function Sa(e,t){if(ne(e.start,t),ne(e.end,t),ie(e.start,e.end)>0)throw new RangeError("Calendar date range start must not be after end")}function di(e){let t=e.recurrence?.interval??1;if(!Number.isInteger(t)||t<1)throw new RangeError("Calendar recurrence interval must be a positive integer");return t}function Ta(e,t,n,r){let o=t.recurrence;if(!o||n===0)return e;let i=di(t)*n;switch(o.frequency){case"daily":return Qe(e,i,r);case"weekly":return Qe(e,i*r.daysInWeek,r);case"monthly":return Wn(e,i,r);case"yearly":return ii(e,i,r)}}function ai(e,t,n,r){return{date:Ta(e.date,t,n,r),...e.time?{time:{...e.time}}:{}}}function li(e,t,n){let r=ai(e.start,e,t,n),o=e.end?ai(e.end,e,t,n):void 0;if(o&&ie(o.date,r.date)<0)throw new RangeError("Calendar event end must not be before start");return{event:e,occurrenceIndex:t,start:r,...o?{end:o}:{}}}function ci(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function ui(e,t,n=X){if(Sa(t,n),ne(e.start.date,n),e.end&&(ne(e.end.date,n),ie(e.end.date,e.start.date)<0))throw new RangeError("Calendar event end must not be before start");if(!e.recurrence){let s=li(e,0,n);return Rr(ci(s),t)?[s]:[]}di(e);let r=e.recurrence.until;if(r&&(ne(r,n),ie(r,e.start.date)<0))throw new RangeError("Calendar recurrence until must not be before event start");if(!Number.isInteger(n.daysInWeek)||n.daysInWeek<1)throw new RangeError('Calendar system "'+n.id+'" returned an invalid week length');let o=[],i=0;for(;;){let s=li(e,i,n);if(ie(s.start.date,t.end)>0||r&&ie(s.start.date,r)>0)break;Rr(ci(s),t)&&o.push(s),i+=1}return o}function ka(e,t){return!e&&!t?0:e?t?e.hour-t.hour||e.minute-t.minute:1:-1}function fi(e,t,n=X){return e.flatMap(r=>ui(r,t,n)).sort((r,o)=>{let i=ie(r.start.date,o.start.date);if(i!==0)return i;let s=ka(r.start.time,o.start.time);return s!==0?s:r.event.title.localeCompare(o.event.title)||r.event.id.localeCompare(o.event.id)||r.occurrenceIndex-o.occurrenceIndex})}function Aa(e){return{start:e.start.date,end:e.end?.date??e.start.date}}function pi(e,t,n=X){return zn(t,n).map(r=>({date:r,occurrences:e.filter(o=>si(r,Aa(o)))}))}function tn(e,t){if(!e.trim())throw new Error(`CalendarEvent.${t} must not be empty`)}function Va(e,t){if(tn(e.id,"id"),tn(e.moduleId,"moduleId"),tn(e.kind,"kind"),tn(e.title,"title"),e.moduleId!==t)throw new Error(`Adapter "${t}" returned event for module "${e.moduleId}"`);return e}var Yn=class{adapters=new Map;register(t){if(tn(t.moduleId,"moduleId"),this.adapters.has(t.moduleId))throw new Error(`Calendar module already registered: ${t.moduleId}`);this.adapters.set(t.moduleId,t)}has(t){return this.adapters.has(t)}normalize(t,n){let r=this.adapters.get(t);if(!r)throw new Error(`Calendar module is not registered: ${t}`);let o=r.normalize(n);return(Array.isArray(o)?o:[o]).map(s=>Va(s,t))}};var Gn=class{registry=new Yn;loaders=new Map;timeSource;calendarSystem;constructor(t){this.timeSource=t.timeSource,this.calendarSystem=t.calendarSystem??X}registerModule(t){let n=t.adapter.moduleId;if(this.loaders.has(n))throw new Error(`Calendar app module already registered: ${n}`);this.registry.register(t.adapter),this.loaders.set(n,async()=>(await t.source.load()).flatMap(o=>this.registry.normalize(n,o)))}hasModule(t){return this.loaders.has(t)}async loadEvents(){return(await Promise.all([...this.loaders.values()].map(n=>n()))).flat()}async buildSnapshot(t){let[n,r]=await Promise.all([this.timeSource.getCurrentPoint(),this.loadEvents()]),o=fi(r,t,this.calendarSystem);return{now:n,range:t,events:r,occurrences:o,days:pi(o,t,this.calendarSystem)}}};function hi(e){return{date:{...e.date},...e.time?{time:{...e.time}}:{}}}function Ma(e){return{key:[e.event.moduleId,e.event.id,e.occurrenceIndex].join(":"),eventId:e.event.id,occurrenceIndex:e.occurrenceIndex,moduleId:e.event.moduleId,kind:e.event.kind,title:e.event.title,allDay:e.event.allDay??!e.start.time,start:hi(e.start),...e.end?{end:hi(e.end)}:{},tags:[...e.event.tags??[]]}}function mi(e,t,n=!1){return{key:en(e),date:{...e},isToday:n,occurrences:t.map(Ma)}}function Ra(e,t){let n=e??0;if(!Number.isInteger(n)||n<0||n>=t.daysInWeek)throw new RangeError(`weekStartsOn must be between 0 and ${t.daysInWeek-1}`);return n}function Ir(e){let t=e.calendarSystem??X,n=Ra(e.weekStartsOn,t),r={year:e.year,month:e.month,day:1};ne(r,t);let o={year:e.year,month:e.month,day:t.daysInMonth(e.year,e.month)},s=(Kn(r,e.weekAnchor,t)-n+t.daysInWeek)%t.daysInWeek,a=(n+t.daysInWeek-1)%t.daysInWeek,c=Kn(o,e.weekAnchor,t),f=(a-c+t.daysInWeek)%t.daysInWeek;return{start:Qe(r,-s,t),end:Qe(o,f,t)}}function Ia(e,t){return ie(e.start,t.start)<=0&&ie(e.end,t.end)>=0}function gi(e){let t=e.calendarSystem??X,n=Ir(e);if(!Ia(e.snapshot.range,n))throw new RangeError("CalendarAppSnapshot does not cover the complete month grid range");let r=new Map(e.snapshot.days.map(a=>[en(a.date),a.occurrences])),o=zn(n,t).map(a=>{let c=en(a);return{key:c,date:a,weekday:Kn(a,e.weekAnchor,t),inCurrentMonth:a.year===e.year&&a.month===e.month,isToday:Mr(a,e.snapshot.now.date),isSelected:e.selectedDate?Mr(a,e.selectedDate):!1,occurrences:r.get(c)??[]}}),i=o.find(a=>a.isSelected),s=i?mi(i.date,i.occurrences,i.isToday):void 0;return{year:e.year,month:e.month,today:{...e.snapshot.now.date},columns:t.daysInWeek,range:n,cells:o,...s?{selectedDay:s}:{}}}var qn=class{app;weekAnchor;weekStartsOn;calendarSystem;currentMonth;selectedDate;snapshot=null;model=null;constructor(t){this.app=t.app,this.weekAnchor=t.weekAnchor,this.weekStartsOn=t.weekStartsOn,this.calendarSystem=t.calendarSystem??X;let n={...t.initialMonth,day:1};ne(n,this.calendarSystem),this.currentMonth={year:n.year,month:n.month},t.selectedDate&&(ne(t.selectedDate,this.calendarSystem),this.selectedDate=dt(t.selectedDate))}getCurrentMonth(){return{...this.currentMonth}}getSelectedDate(){return this.selectedDate?dt(this.selectedDate):void 0}getModel(){return this.model}async load(){let t=Ir({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem});return this.snapshot=await this.app.buildSnapshot(t),this.model=this.buildModel(this.snapshot),this.model}async navigateMonths(t){let n=Wn({...this.currentMonth,day:1},t,this.calendarSystem);return this.currentMonth={year:n.year,month:n.month},this.selectedDate&&(this.selectedDate={...this.currentMonth,day:Math.min(this.selectedDate.day,this.calendarSystem.daysInMonth(n.year,n.month))}),this.load()}async goToDate(t){return ne(t,this.calendarSystem),this.selectedDate=dt(t),!this.snapshot||t.year!==this.currentMonth.year||t.month!==this.currentMonth.month?(this.currentMonth={year:t.year,month:t.month},this.load()):(this.model=this.buildModel(this.snapshot),this.model)}async stepSelectedDate(t){let n=this.selectedDate??this.model?.today;if(!n)throw new Error("CalendarMonthSession must be loaded before stepping dates");return this.goToDate(Qe(n,t,this.calendarSystem))}selectDate(t){if(ne(t,this.calendarSystem),!this.snapshot)throw new Error("CalendarMonthSession must be loaded before selecting a date");return this.selectedDate=dt(t),this.model=this.buildModel(this.snapshot),this.model}clearSelectedDate(){if(!this.snapshot)throw new Error("CalendarMonthSession must be loaded before clearing selection");return this.selectedDate=void 0,this.model=this.buildModel(this.snapshot),this.model}buildModel(t){return gi({...this.currentMonth,weekAnchor:this.weekAnchor,weekStartsOn:this.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:this.selectedDate,snapshot:t})}};var Jn=class{app;reader;timeSource;calendarSystem;constructor(t){this.reader=new Pn(t.runtime),this.timeSource=new $n({reader:this.reader,path:t.timePath,parser:t.timeParser}),this.calendarSystem=t.calendarSystem??X,this.app=new Gn({timeSource:this.timeSource,calendarSystem:this.calendarSystem})}registerModule(t){this.app.registerModule({adapter:t.adapter,source:new Ln({reader:this.reader,path:t.path,parser:t.parser})})}async getCurrentDate(){return{...(await this.timeSource.getCurrentPoint()).date}}async createMonthSession(t){let n=t.initialMonth??await this.getCurrentDate();return new qn({app:this.app,initialMonth:{year:n.year,month:n.month},weekAnchor:t.weekAnchor,weekStartsOn:t.weekStartsOn,calendarSystem:this.calendarSystem,selectedDate:t.selectedDate})}};function yi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}function Pr(e){return Number.isInteger(e)&&Number(e)>0?Number(e):null}function Pa(e){if(!yi(e))return null;let t=Pr(e.year),n=Pr(e.month),r=Pr(e.day);return t&&n&&r?{year:t,month:n,day:r}:null}function _i(e){if(!yi(e))return null;let t=Pa(e.date),n=Number.isInteger(e.weekday)?Number(e.weekday):null;return!t||n===null||n<0?null:{date:t,weekday:n}}function Mt(e){let t=Object.create(null);for(let n of e.split(","))t[n]=1;return n=>n in t}var z={},Et=[],he=()=>{},$r=()=>!1,Rt=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),It=e=>e.startsWith("onUpdate:"),Q=Object.assign,rn=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},$a=Object.prototype.hasOwnProperty,F=(e,t)=>$a.call(e,t),R=Array.isArray,ut=e=>on(e)==="[object Map]",nn=e=>on(e)==="[object Set]",bi=e=>on(e)==="[object Date]";var I=e=>typeof e=="function",Z=e=>typeof e=="string",Ie=e=>typeof e=="symbol",K=e=>e!==null&&typeof e=="object",Lr=e=>(K(e)||I(e))&&I(e.then)&&I(e.catch),La=Object.prototype.toString,on=e=>La.call(e),Fr=e=>on(e).slice(8,-1),Hr=e=>on(e)==="[object Object]",Xn=e=>Z(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Pt=Mt(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");var Zn=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},Fa=/-\w/g,me=Zn(e=>e.replace(Fa,t=>t.slice(1).toUpperCase())),Ha=/\B([A-Z])/g,et=Zn(e=>e.replace(Ha,"-$1").toLowerCase()),sn=Zn(e=>e.charAt(0).toUpperCase()+e.slice(1)),an=Zn(e=>e?`on${sn(e)}`:""),ke=(e,t)=>!Object.is(e,t),ln=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},$t=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},Ur=e=>{let t=parseFloat(e);return isNaN(t)?e:t};var Ei,ft=()=>Ei||(Ei=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function cn(e){if(R(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],o=Z(r)?Wa(r):cn(r);if(o)for(let i in o)t[i]=o[i]}return t}else if(Z(e)||K(e))return e}var Ua=/;(?![^(]*\))/g,ja=/:([^]+)/,Ba=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Wa(e){let t={};return e.replace(Ba,n=>n.startsWith("/*")?"":n).split(Ua).forEach(n=>{if(n){let r=n.split(ja);r.length>1&&(t[r[0].trim()]=r[1].trim())}}),t}function dn(e){let t="";if(Z(e))t=e;else if(R(e))for(let n=0;n<e.length;n++){let r=dn(e[n]);r&&(t+=r+" ")}else if(K(e))for(let n in e)e[n]&&(t+=n+" ");return t.trim()}var xi="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",Ci=Mt(xi),Ka=Mt(xi+",async,autofocus,autoplay,controls,default,defer,disabled,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected");function Qn(e){return!!e||e===""}function za(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let o=0;r&&o<e.length;o++)r=Lt(e[o],t[o],n);return r}function vi(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),o=new Uint8Array(r.length);for(let i of e){let s=-1;for(let a=0;a<r.length;a++)if(!o[a]&&Lt(i,r[a],n)){s=a;break}if(s<0)return!1;o[s]=1}return!0}function Ya(e,t,n){let r=ut(e),o=ut(t);if(r||o||(r=nn(e),o=nn(t),r||o))return r&&o?vi(e,t,n):!1;let i=Object.keys(e).length,s=Object.keys(t).length;if(i!==s)return!1;for(let a in e){let c=e.hasOwnProperty(a),f=t.hasOwnProperty(a);if(c&&!f||!c&&f||!Lt(e[a],t[a],n))return!1}return String(e)===String(t)}function wi(e,t,n,r){n||(n=[new Map,new Map]);let[o,i]=n;if(o.has(e)||i.has(t))return o.get(e)===t&&i.get(t)===e;o.set(e,t),i.set(t,e);let s=r(e,t,n);return o.delete(e),i.delete(t),s}function Lt(e,t,n){if(e===t)return!0;let r=bi(e),o=bi(t);return r||o?r&&o?e.getTime()===t.getTime():!1:(r=Ie(e),o=Ie(t),r||o?e===t:(r=R(e),o=R(t),r||o?r&&o?wi(e,t,n,za):!1:(r=K(e),o=K(t),r||o?!r||!o?!1:wi(e,t,n,Ya):String(e)===String(t))))}function Ga(e,...t){console.warn(`[Vue warn] ${e}`,...t)}var le,hn=class{constructor(t=!1){this.detached=t,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!t&&le&&(le.active?(this.parent=le,this.index=(le.scopes||(le.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let t,n;if(this.scopes){let r=this.scopes.slice();for(t=0,n=r.length;t<n;t++)r[t].pause()}for(t=0,n=this.effects.length;t<n;t++)this.effects[t].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let t,n;if(this.scopes){let o=this.scopes.slice();for(t=0,n=o.length;t<n;t++)o[t].resume()}let r=this.effects.slice();for(t=0,n=r.length;t<n;t++)r[t].resume()}}run(t){if(this._active){let n=le;try{return le=this,t()}finally{le=n}}}on(){++this._on===1&&(this.prevScope=le,le=this)}off(){if(this._on>0&&--this._on===0){if(le===this)le=this.prevScope;else{let t=le;for(;t;){if(t.prevScope===this){t.prevScope=this.prevScope;break}t=t.prevScope}}this.prevScope=void 0}}stop(t){if(this._active){this._active=!1;let n,r;for(n=0,r=this.effects.length;n<r;n++)this.effects[n].stop();for(this.effects.length=0,n=0,r=this.cleanups.length;n<r;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){let o=this.scopes.slice();for(n=0,r=o.length;n<r;n++)o[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!t){let o=this.parent.scopes.pop();o&&o!==this&&(this.parent.scopes[this.index]=o,o.index=this.index)}this.parent=void 0}}};function Oi(){return le}var q;var jr=new WeakSet,Ht=class{constructor(t){this.fn=t,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,le&&(le.active?le.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,jr.has(this)&&(jr.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ti(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ni(this),ki(this);let t=q,n=Pe;q=this,Pe=!0;try{return this.fn()}finally{Ai(this),q=t,Pe=n,this.flags&=-3}}stop(){if(this.flags&1){for(let t=this.deps;t;t=t.nextDep)to(t);this.deps=this.depsTail=void 0,Ni(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?jr.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Kr(this)&&this.run()}get dirty(){return Kr(this)}},Si=0,fn,pn;function Ti(e,t=!1){if(e.flags|=8,t){e.next=pn,pn=e;return}e.next=fn,fn=e}function Qr(){Si++}function eo(){if(--Si>0)return;if(pn){let t=pn;for(pn=void 0;t;){let n=t.next;t.next=void 0,t.flags&=-9,t=n}}let e;for(;fn;){let t=fn;for(fn=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(r){e||(e=r)}t=n}}if(e)throw e}function ki(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ai(e){let t,n=e.depsTail,r=n;for(;r;){let o=r.prevDep;r.version===-1?(r===n&&(n=o),to(r),qa(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=o}e.deps=t,e.depsTail=n}function Kr(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Vi(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Vi(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===mn)||(e.globalVersion=mn,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Kr(e))))return;e.flags|=2;let t=e.dep,n=q,r=Pe;q=e,Pe=!0;try{ki(e);let o=e.fn(e._value);(t.version===0||ke(o,e._value))&&(e.flags|=128,e._value=o,t.version++)}catch(o){throw t.version++,o}finally{q=n,Pe=r,Ai(e),e.flags&=-3}}function to(e,t=!1){let{dep:n,prevSub:r,nextSub:o}=e;if(r&&(r.nextSub=o,e.prevSub=void 0),o&&(o.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let i=n.computed.deps;i;i=i.nextDep)to(i,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function qa(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Pe=!0,Mi=[];function We(){Mi.push(Pe),Pe=!1}function Ke(){let e=Mi.pop();Pe=e===void 0?!0:e}function Ni(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let n=q;q=void 0;try{t()}finally{q=n}}}var mn=0,zr=class{constructor(t,n){this.sub=t,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},gn=class{constructor(t){this.computed=t,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(t){if(!q||!Pe||q===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==q)n=this.activeLink=new zr(q,this),q.deps?(n.prevDep=q.depsTail,q.depsTail.nextDep=n,q.depsTail=n):q.deps=q.depsTail=n,Ri(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){let r=n.nextDep;r.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=r),n.prevDep=q.depsTail,n.nextDep=void 0,q.depsTail.nextDep=n,q.depsTail=n,q.deps===n&&(q.deps=r)}return n}trigger(t){this.version++,mn++,this.notify(t)}notify(t){Qr();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{eo()}}};function Ri(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let r=t.deps;r;r=r.nextDep)Ri(r)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Yr=new WeakMap,wt=Symbol(""),Gr=Symbol(""),yn=Symbol("");function ce(e,t,n){if(Pe&&q){let r=Yr.get(e);r||Yr.set(e,r=new Map);let o=r.get(n);o||(r.set(n,o=new gn),o.map=r,o.key=n),o.track()}}function Be(e,t,n,r,o,i){let s=Yr.get(e);if(!s){mn++;return}let a=c=>{c&&c.trigger()};if(Qr(),t==="clear")s.forEach(a);else{let c=R(e),f=c&&Xn(n);if(c&&n==="length"){let u=Number(r);s.forEach((p,b)=>{(b==="length"||b===yn||!Ie(b)&&b>=u)&&a(p)})}else switch((n!==void 0||s.has(void 0))&&a(s.get(n)),f&&a(s.get(yn)),t){case"add":c?f&&a(s.get("length")):(a(s.get(wt)),ut(e)&&a(s.get(Gr)));break;case"delete":c||(a(s.get(wt)),ut(e)&&a(s.get(Gr)));break;case"set":ut(e)&&a(s.get(wt));break}}eo()}function Ft(e){let t=H(e);return t===e||(ce(t,"iterate",yn),Ne(e))?t:$e(e)?rt(e)?t.map(n=>pt(Le(n))):t.map(pt):t.map(Le)}function ar(e){return ce(e=H(e),"iterate",yn),e}function je(e,t){return $e(e)?pt(rt(e)?Le(t):t):Le(t)}var Ja={__proto__:null,[Symbol.iterator](){return Br(this,Symbol.iterator,e=>je(this,e))},concat(...e){return Ft(this).concat(...e.map(t=>R(t)?Ft(t):t))},entries(){return Br(this,"entries",e=>(e[1]=je(this,e[1]),e))},every(e,t){return tt(this,"every",e,t,void 0,arguments)},filter(e,t){return tt(this,"filter",e,t,n=>n.map(r=>je(this,r)),arguments)},find(e,t){return tt(this,"find",e,t,n=>je(this,n),arguments)},findIndex(e,t){return tt(this,"findIndex",e,t,void 0,arguments)},findLast(e,t){return tt(this,"findLast",e,t,n=>je(this,n),arguments)},findLastIndex(e,t){return tt(this,"findLastIndex",e,t,void 0,arguments)},forEach(e,t){return tt(this,"forEach",e,t,void 0,arguments)},includes(...e){return Wr(this,"includes",e)},indexOf(...e){return Wr(this,"indexOf",e)},join(e){return Ft(this).join(e)},lastIndexOf(...e){return Wr(this,"lastIndexOf",e)},map(e,t){return tt(this,"map",e,t,void 0,arguments)},pop(){return un(this,"pop")},push(...e){return un(this,"push",e)},reduce(e,...t){return Di(this,"reduce",e,t)},reduceRight(e,...t){return Di(this,"reduceRight",e,t)},shift(){return un(this,"shift")},some(e,t){return tt(this,"some",e,t,void 0,arguments)},splice(...e){return un(this,"splice",e)},toReversed(){return Ft(this).toReversed()},toSorted(e){return Ft(this).toSorted(e)},toSpliced(...e){return Ft(this).toSpliced(...e)},unshift(...e){return un(this,"unshift",e)},values(){return Br(this,"values",e=>je(this,e))}};function Br(e,t,n){let r=ar(e),o=r[t]();return r!==e&&!Ne(e)&&(o._next=o.next,o.next=()=>{let i=o._next();return i.done||(i.value=n(i.value)),i}),o}var Xa=Array.prototype;function tt(e,t,n,r,o,i){let s=ar(e),a=s!==e&&!Ne(e),c=s[t];if(c!==Xa[t]){let p=c.apply(e,i);return a?Le(p):p}let f=n;s!==e&&(a?f=function(p,b){return n.call(this,je(e,p),b,e)}:n.length>2&&(f=function(p,b){return n.call(this,p,b,e)}));let u=c.call(s,f,r);return a&&o?o(u):u}function Di(e,t,n,r){let o=ar(e),i=o!==e&&!Ne(e),s=n,a=!1;o!==e&&(i?(a=r.length===0,s=function(f,u,p){return a&&(a=!1,f=je(e,f)),n.call(this,f,je(e,u),p,e)}):n.length>3&&(s=function(f,u,p){return n.call(this,f,u,p,e)}));let c=o[t](s,...r);return a?je(e,c):c}function Wr(e,t,n){let r=H(e);ce(r,"iterate",yn);let o=r[t](...n);return(o===-1||o===!1)&&bn(n[0])?(n[0]=H(n[0]),r[t](...n)):o}function un(e,t,n=[]){We(),Qr();let r=H(e)[t].apply(e,n);return eo(),Ke(),r}var Za=Mt("__proto__,__v_isRef,__isVue"),Ii=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Ie));function Qa(e){Ie(e)||(e=String(e));let t=H(this);return ce(t,"has",e),t.hasOwnProperty(e)}var rr=class{constructor(t=!1,n=!1){this._isReadonly=t,this._isShallow=n}get(t,n,r){if(n==="__v_skip")return t.__v_skip;let o=this._isReadonly,i=this._isShallow;if(n==="__v_isReactive")return!o;if(n==="__v_isReadonly")return o;if(n==="__v_isShallow")return i;if(n==="__v_raw")return r===(o?i?ll:Li:i?$i:Pi).get(t)||Object.getPrototypeOf(t)===Object.getPrototypeOf(r)?t:void 0;let s=R(t);if(!o){let c;if(s&&(c=Ja[n]))return c;if(n==="hasOwnProperty")return Qa}let a=Reflect.get(t,n,se(t)?t:r);if((Ie(n)?Ii.has(n):Za(n))||(o||ce(t,"get",n),i))return a;if(se(a)){let c=s&&Xn(n)?a:a.value;return o&&K(c)?ir(c):c}return K(a)?o?ir(a):_n(a):a}},or=class extends rr{constructor(t=!1){super(!1,t)}set(t,n,r,o){let i=t[n],s=R(t)&&Xn(n);if(!this._isShallow){let f=$e(i);if(!Ne(r)&&!$e(r)&&(i=H(i),r=H(r)),!s&&se(i)&&!se(r))return f||(i.value=r),!0}let a=s?Number(n)<t.length:F(t,n),c=Reflect.set(t,n,r,se(t)?t:o);return t===H(o)&&c&&(a?ke(r,i)&&Be(t,"set",n,r,i):Be(t,"add",n,r)),c}deleteProperty(t,n){let r=F(t,n),o=t[n],i=Reflect.deleteProperty(t,n);return i&&r&&Be(t,"delete",n,void 0,o),i}has(t,n){let r=Reflect.has(t,n);return(!Ie(n)||!Ii.has(n))&&ce(t,"has",n),r}ownKeys(t){return ce(t,"iterate",R(t)?"length":wt),Reflect.ownKeys(t)}},qr=class extends rr{constructor(t=!1){super(!0,t)}set(t,n){return!0}deleteProperty(t,n){return!0}},el=new or,tl=new qr,nl=new or(!0);var Jr=e=>e,er=e=>Reflect.getPrototypeOf(e);function rl(e,t,n){return function(...r){let o=this.__v_raw,i=H(o),s=ut(i),a=e==="entries"||e===Symbol.iterator&&s,c=e==="keys"&&s,f=o[e](...r),u=n?Jr:t?pt:Le;return!t&&ce(i,"iterate",c?Gr:wt),Q(Object.create(f),{next(){let{value:p,done:b}=f.next();return b?{value:p,done:b}:{value:a?[u(p[0]),u(p[1])]:u(p),done:b}}})}}function tr(e){return function(...t){return e==="delete"?!1:e==="clear"?void 0:this}}function ol(e,t){let n={get(o){let i=this.__v_raw,s=H(i),a=H(o);e||(ke(o,a)&&ce(s,"get",o),ce(s,"get",a));let{has:c}=er(s),f=t?Jr:e?pt:Le;if(c.call(s,o))return f(i.get(o));if(c.call(s,a))return f(i.get(a));i!==s&&i.get(o)},get size(){let o=this.__v_raw;return!e&&ce(H(o),"iterate",wt),o.size},has(o){let i=this.__v_raw,s=H(i),a=H(o);return e||(ke(o,a)&&ce(s,"has",o),ce(s,"has",a)),o===a?i.has(o):i.has(o)||i.has(a)},forEach(o,i){let s=this,a=s.__v_raw,c=H(a),f=t?Jr:e?pt:Le;return!e&&ce(c,"iterate",wt),a.forEach((u,p)=>o.call(i,f(u),f(p),s))}};return Q(n,e?{add:tr("add"),set:tr("set"),delete:tr("delete"),clear:tr("clear")}:{add(o){let i=H(this),s=er(i),a=H(o),c=!t&&!Ne(o)&&!$e(o)?a:o;return s.has.call(i,c)||ke(o,c)&&s.has.call(i,o)||ke(a,c)&&s.has.call(i,a)||(i.add(c),Be(i,"add",c,c)),this},set(o,i){!t&&!Ne(i)&&!$e(i)&&(i=H(i));let s=H(this),{has:a,get:c}=er(s),f=a.call(s,o);f||(o=H(o),f=a.call(s,o));let u=c.call(s,o);return s.set(o,i),f?ke(i,u)&&Be(s,"set",o,i,u):Be(s,"add",o,i),this},delete(o){let i=H(this),{has:s,get:a}=er(i),c=s.call(i,o);c||(o=H(o),c=s.call(i,o));let f=a?a.call(i,o):void 0,u=i.delete(o);return c&&Be(i,"delete",o,void 0,f),u},clear(){let o=H(this),i=o.size!==0,s=void 0,a=o.clear();return i&&Be(o,"clear",void 0,void 0,s),a}}),["keys","values","entries",Symbol.iterator].forEach(o=>{n[o]=rl(o,e,t)}),n}function no(e,t){let n=ol(e,t);return(r,o,i)=>o==="__v_isReactive"?!e:o==="__v_isReadonly"?e:o==="__v_raw"?r:Reflect.get(F(n,o)&&o in r?n:r,o,i)}var il={get:no(!1,!1)},sl={get:no(!1,!0)},al={get:no(!0,!1)};var Pi=new WeakMap,$i=new WeakMap,Li=new WeakMap,ll=new WeakMap;function cl(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function _n(e){return $e(e)?e:oo(e,!1,el,il,Pi)}function ro(e){return oo(e,!1,nl,sl,$i)}function ir(e){return oo(e,!0,tl,al,Li)}function oo(e,t,n,r,o){if(!K(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let i=o.get(e);if(i)return i;let s=cl(Fr(e));if(s===0)return e;let a=new Proxy(e,s===2?r:n);return o.set(e,a),a}function rt(e){return $e(e)?rt(e.__v_raw):!!(e&&e.__v_isReactive)}function $e(e){return!!(e&&e.__v_isReadonly)}function Ne(e){return!!(e&&e.__v_isShallow)}function bn(e){return e?!!e.__v_raw:!1}function H(e){let t=e&&e.__v_raw;return t?H(t):e}function io(e){return!F(e,"__v_skip")&&Object.isExtensible(e)&&$t(e,"__v_skip",!0),e}var Le=e=>K(e)?_n(e):e,pt=e=>K(e)?ir(e):e;function se(e){return e?e.__v_isRef===!0:!1}function ht(e){return Fi(e,!1)}function lr(e){return Fi(e,!0)}function Fi(e,t){return se(e)?e:new Xr(e,t)}var Xr=class{constructor(t,n){this.dep=new gn,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?t:H(t),this._value=n?t:Le(t),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(t){let n=this._rawValue,r=this.__v_isShallow||Ne(t)||$e(t);t=r?t:H(t),ke(t,n)&&(this._rawValue=t,this._value=r?t:Le(t),this.dep.trigger())}};function so(e){return se(e)?e.value:e}var dl={get:(e,t,n)=>t==="__v_raw"?e:so(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let o=e[t];return se(o)&&!se(n)?(o.value=n,!0):Reflect.set(e,t,n,r)}};function cr(e){return rt(e)?e:new Proxy(e,dl)}var Zr=class{constructor(t,n,r){this.fn=t,this.setter=n,this._value=void 0,this.dep=new gn(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=mn-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&q!==this)return Ti(this,!0),!0}get value(){let t=this.dep.track();return Vi(this),t&&(t.version=this.dep.version),this._value}set value(t){this.setter&&this.setter(t)}};function Hi(e,t,n=!1){let r,o;return I(e)?r=e:(r=e.get,o=e.set),new Zr(r,o,n)}var nr={},sr=new WeakMap,vt;function Ui(e,t=!1,n=vt){if(n){let r=sr.get(n);r||sr.set(n,r=[]),r.push(e)}}function ji(e,t,n=z){let{immediate:r,deep:o,once:i,scheduler:s,augmentJob:a,call:c}=n,f=S=>{(n.onWarn||Ga)("Invalid watch source: ",S,"A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")},u=S=>o?S:Ne(S)||o===!1||o===0?nt(S,1):nt(S),p,b,C,v,O=!1,P=!1;if(se(e)?(b=()=>e.value,O=Ne(e)):rt(e)?(b=()=>u(e),O=!0):R(e)?(P=!0,O=e.some(S=>rt(S)||Ne(S)),b=()=>e.map(S=>{if(se(S))return S.value;if(rt(S))return u(S);if(I(S))return c?c(S,2):S()})):I(e)?t?b=c?()=>c(e,2):e:b=()=>{if(C){We();try{C()}finally{Ke()}}let S=vt;vt=p;try{return c?c(e,3,[v]):e(v)}finally{vt=S}}:b=he,t&&o){let S=b,ee=o===!0?1/0:o;b=()=>nt(S(),ee)}let U=Oi(),M=()=>{p.stop(),U&&U.active&&rn(U.effects,p)};if(i&&t){let S=t;t=(...ee)=>{let ue=S(...ee);return M(),ue}}let $=P?new Array(e.length).fill(nr):nr,de=S=>{if(!(!(p.flags&1)||!p.dirty&&!S))if(t){let ee=p.run();if(S||o||O||(P?ee.some((ue,fe)=>ke(ue,$[fe])):ke(ee,$))){C&&C();let ue=vt;vt=p;try{let fe=[ee,$===nr?void 0:P&&$[0]===nr?[]:$,v];$=ee,c?c(t,3,fe):t(...fe)}finally{vt=ue}}}else p.run()};return a&&a(de),p=new Ht(b),p.scheduler=s?()=>s(de,!1):de,v=S=>Ui(S,!1,p),C=p.onStop=()=>{let S=sr.get(p);if(S){if(c)c(S,4);else for(let ee of S)ee();sr.delete(p)}},t?r?de(!0):$=p.run():s?s(de.bind(null,!0),!0):p.run(),M.pause=p.pause.bind(p),M.resume=p.resume.bind(p),M.stop=M,M}function nt(e,t=1/0,n){if(t<=0||!K(e)||e.__v_skip||(n=n||new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,se(e))nt(e.value,t,n);else if(R(e))for(let r=0;r<e.length;r++)nt(e[r],t,n);else if(nn(e)||ut(e))e.forEach(r=>{nt(r,t,n)});else if(Hr(e)){for(let r in e)nt(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&nt(e[r],t,n)}return e}function kn(e,t,n,r){try{return r?e(...r):e()}catch(o){Er(o,t,n)}}function Ve(e,t,n,r){if(I(e)){let o=kn(e,t,n,r);return o&&Lr(o)&&o.catch(i=>{Er(i,t,n)}),o}if(R(e)){let o=[];for(let i=0;i<e.length;i++)o.push(Ve(e[i],t,n,r));return o}}function Er(e,t,n,r=!0){let o=t?t.vnode:null,{errorHandler:i,throwUnhandledErrorInProduction:s}=t&&t.appContext.config||z;if(t){let a=t.parent,c=t.proxy,f=`https://vuejs.org/error-reference/#runtime-${n}`;for(;a;){let u=a.ec;if(u){for(let p=0;p<u.length;p++)if(u[p](e,c,f)===!1)return}a=a.parent}if(i){We(),kn(i,null,10,[e,c,f]),Ke();return}}hl(e,n,o,r,s)}function hl(e,t,n,r=!0,o=!1){if(o)throw e;console.error(e)}var ye=[],Ye=-1,jt=[],mt=null,Ut=0,os=Promise.resolve(),fr=null;function An(e){let t=fr||os;return e?t.then(this?e.bind(this):e):t}function ml(e){let t=Ye+1,n=ye.length;for(;t<n;){let r=t+n>>>1,o=ye[r],i=On(o);i<e||i===e&&o.flags&2?t=r+1:n=r}return t}function yo(e){if(!(e.flags&1)){let t=On(e),n=ye[ye.length-1];!n||!(e.flags&2)&&t>=On(n)?ye.push(e):ye.splice(ml(t),0,e),e.flags|=1,is()}}function is(){fr||(fr=os.then(ls))}function ss(e){if(!R(e))mt&&e.id===-1?mt.splice(Ut+1,0,e):e.flags&1||(jt.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)jt.push(e[t]);is()}function Bi(e,t,n=Ye+1){for(;n<ye.length;n++){let r=ye[n];if(r&&r.flags&2){if(e&&r.id!==e.uid)continue;ye.splice(n,1),n--,r.flags&4&&(r.flags&=-2),r(),r.flags&4||(r.flags&=-2)}}}function as(e){if(jt.length){let t=[...new Set(jt)].sort((n,r)=>On(n)-On(r));if(jt.length=0,mt){for(let n=0;n<t.length;n++)mt.push(t[n]);return}for(mt=t,Ut=0;Ut<mt.length;Ut++){let n=mt[Ut];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}mt=null,Ut=0}}var On=e=>e.id==null?e.flags&2?-1:1/0:e.id;function ls(e){let t=he;try{for(Ye=0;Ye<ye.length;Ye++){let n=ye[Ye];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),kn(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;Ye<ye.length;Ye++){let n=ye[Ye];n&&(n.flags&=-2)}Ye=-1,ye.length=0,as(e),fr=null,(ye.length||jt.length)&&ls(e)}}var qe,vn=[],fo=!1;function vr(e,...t){qe?qe.emit(e,...t):fo||vn.push({event:e,args:t})}function cs(e,t){var n,r;qe=e,qe?(qe.enabled=!0,vn.forEach(({event:o,args:i})=>qe.emit(o,...i)),vn=[]):typeof window<"u"&&window.HTMLElement&&!((r=(n=window.navigator)==null?void 0:n.userAgent)!=null&&r.includes("jsdom"))?((t.__VUE_DEVTOOLS_HOOK_REPLAY__=t.__VUE_DEVTOOLS_HOOK_REPLAY__||[]).push(i=>{cs(i,t)}),setTimeout(()=>{qe||(t.__VUE_DEVTOOLS_HOOK_REPLAY__=null,fo=!0,vn=[])},3e3)):(fo=!0,vn=[])}function gl(e,t){vr("app:init",e,t,{Fragment:Fe,Text:Mn,Comment:gt,Static:Dn})}function yl(e){vr("app:unmount",e)}var _l=_o("component:added"),ds=_o("component:updated"),bl=_o("component:removed"),El=e=>{qe&&typeof qe.cleanupBuffer=="function"&&!qe.cleanupBuffer(e)&&bl(e)};function _o(e){return t=>{vr(e,t.appContext.app,t.uid,t.parent?t.parent.uid:void 0,t)}}function vl(e,t,n){vr("component:emit",e.appContext.app,e,t,n)}var Je=null,us=null;function pr(e){let t=Je;return Je=e,us=e&&e.type.__scopeId||null,t}function wl(e,t=Je,n){if(!t||e._n)return e;let r=(...o)=>{r._d&&gr(-1);let i=pr(t),s=Kt.length,a;try{a=e(...o)}finally{for(let c=Kt.length;c>s;c--)uc();pr(i),r._d&&gr(1)}return __VUE_PROD_DEVTOOLS__&&ds(t),a};return r._n=!0,r._c=!0,r._d=!0,r}function xt(e,t,n,r){let o=e.dirs,i=t&&t.dirs;for(let s=0;s<o.length;s++){let a=o[s];i&&(a.oldValue=i[s].value);let c=a.dir[r];c&&(We(),Ve(c,n,8,[e.el,a,e,t]),Ke())}}function xl(e,t){if(_e){let n=_e.provides,r=_e.parent&&_e.parent.provides;r===n&&(n=_e.provides=Object.create(r)),n[e]=t}}function dr(e,t,n=!1){let r=Ls();if(r||Wt){let o=Wt?Wt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(o&&e in o)return o[e];if(arguments.length>1)return n&&I(t)?t.call(r&&r.proxy):t}}var Cl=Symbol.for("v-scx"),Nl=()=>{{let e=dr(Cl);return e}};function Bt(e,t,n){return fs(e,t,n)}function fs(e,t,n=z){let{immediate:r,deep:o,flush:i,once:s}=n,a=Q({},n),c=t&&r||!t&&i!=="post",f;if(Tn){if(i==="sync"){let C=Nl();f=C.__watcherHandles||(C.__watcherHandles=[])}else if(!c){let C=()=>{};return C.stop=he,C.resume=he,C.pause=he,C}}let u=_e;a.call=(C,v,O)=>Ve(C,u,v,O);let p=!1;i==="post"?a.scheduler=C=>{Ee(C,u&&u.suspense)}:i!=="sync"&&(p=!0,a.scheduler=(C,v)=>{v?C():yo(C)}),a.augmentJob=C=>{t&&(C.flags|=4),p&&(C.flags|=2,u&&(C.id=u.uid,C.i=u))};let b=ji(e,t,a);return Tn&&(f?f.push(b):c&&b()),b}function Dl(e,t,n){let r=this.proxy,o=Z(e)?e.includes(".")?ps(r,e):()=>r[e]:e.bind(r,r),i;I(t)?i=t:(i=t.handler,n=t);let s=Rn(this),a=fs(o,i.bind(r),n);return s(),a}function ps(e,t){let n=t.split(".");return()=>{let r=e;for(let o=0;o<n.length&&r;o++)r=r[n[o]];return r}}var Ol=Symbol("_vte"),wr=e=>e.__isTeleport;var ao=Symbol("_leaveCb");function Sl(e){let t=e[0];if(e.length>1){let n=!1;for(let r of e)if(r.type!==gt){t=r,n=!0;break}}return t}function hs(e){if(!bo(e))return wr(e.type)&&e.children?Sl(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&I(n.default))return n.default()}}function xr(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;xr(wr(n.type)&&hs(n)||n,t)}else e.shapeFlag&128?(e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback)):e.transition=t}function Vn(e,t){return I(e)?Q({name:e.name},t,{setup:e}):e}function ms(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function Wi(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var hr=new WeakMap;function xn(e,t,n,r,o=!1){if(R(e)){e.forEach((O,P)=>xn(O,t&&(R(t)?t[P]:t),n,r,o));return}if(Cn(r)&&!o){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&xn(e,t,n,r.component.subTree);return}let i=r.shapeFlag&4?No(r.component):r.el,s=o?null:i,{i:a,r:c}=e,f=t&&t.r,u=a.refs===z?a.refs={}:a.refs,p=a.setupState,b=H(p),C=p===z?$r:O=>Wi(u,O)?!1:F(b,O),v=(O,P)=>!(P&&Wi(u,P));if(f!=null&&f!==c){if(Ki(t),Z(f))u[f]=null,C(f)&&(p[f]=null);else if(se(f)){let O=t;v(f,O.k)&&(f.value=null),O.k&&(u[O.k]=null)}}if(I(c))kn(c,a,12,[s,u]);else{let O=Z(c),P=se(c);if(O||P){let U=()=>{if(e.f){let M=O?C(c)?p[c]:u[c]:v(c)||!e.k?c.value:u[e.k];if(o)R(M)&&rn(M,i);else if(R(M))M.includes(i)||M.push(i);else if(O)u[c]=[i],C(c)&&(p[c]=u[c]);else{let $=[i];v(c,e.k)&&(c.value=$),e.k&&(u[e.k]=$)}}else O?(u[c]=s,C(c)&&(p[c]=s)):P&&(v(c,e.k)&&(c.value=s),e.k&&(u[e.k]=s))};if(s){let M=()=>{U(),hr.delete(e)};M.id=-1,hr.set(e,M),Ee(M,n)}else Ki(e),U()}}}function Ki(e){let t=hr.get(e);t&&(t.flags|=8,hr.delete(e))}var cp=ft().requestIdleCallback||(e=>setTimeout(e,1)),dp=ft().cancelIdleCallback||(e=>clearTimeout(e));var Cn=e=>!!e.type.__asyncLoader;var bo=e=>e.type.__isKeepAlive;function Tl(e,t){gs(e,"a",t)}function kl(e,t){gs(e,"da",t)}function gs(e,t,n=_e){let r=e.__wdc||(e.__wdc=()=>{let o=n;for(;o;){if(o.isDeactivated)return;o=o.parent}return e()});if(Cr(t,r,n),n){let o=n.parent;for(;o&&o.parent;)bo(o.parent.vnode)&&Al(r,t,n,o),o=o.parent}}function Al(e,t,n,r){let o=Cr(t,e,r,!0);Eo(()=>{rn(r[t],o)},n)}function Cr(e,t,n=_e,r=!1){if(n){let o=n[e]||(n[e]=[]),i=t.__weh||(t.__weh=(...s)=>{We();let a=Rn(n),c=Ve(t,n,e,s);return a(),Ke(),c});return r?o.unshift(i):o.push(i),i}}var st=e=>(t,n=_e)=>{(!Tn||e==="sp")&&Cr(e,(...r)=>t(...r),n)},Vl=st("bm"),ys=st("m"),_s=st("bu"),bs=st("u"),Ml=st("bum"),Eo=st("um"),Rl=st("sp"),Il=st("rtg"),Pl=st("rtc");function $l(e,t=_e){Cr("ec",e,t)}var Ll=Symbol.for("v-ndc");var po=e=>e?Fs(e)?No(e):po(e.parent):null;var Nn=Q(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>po(e.parent),$root:e=>po(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>__VUE_OPTIONS_API__?vo(e):e.type,$forceUpdate:e=>e.f||(e.f=()=>{yo(e.update)}),$nextTick:e=>e.n||(e.n=An.bind(e.proxy)),$watch:e=>__VUE_OPTIONS_API__?Dl.bind(e):he});var lo=(e,t)=>e!==z&&!e.__isScriptSetup&&F(e,t),Fl={get({_:e},t){if(t==="__v_skip")return!0;let{ctx:n,setupState:r,data:o,props:i,accessCache:s,type:a,appContext:c}=e;if(t[0]!=="$"){let b=s[t];if(b!==void 0)switch(b){case 1:return r[t];case 2:return o[t];case 4:return n[t];case 3:return i[t]}else{if(lo(r,t))return s[t]=1,r[t];if(__VUE_OPTIONS_API__&&o!==z&&F(o,t))return s[t]=2,o[t];if(F(i,t))return s[t]=3,i[t];if(n!==z&&F(n,t))return s[t]=4,n[t];(!__VUE_OPTIONS_API__||ho)&&(s[t]=0)}}let f=Nn[t],u,p;if(f)return t==="$attrs"&&ce(e.attrs,"get",""),f(e);if((u=a.__cssModules)&&(u=u[t]))return u;if(n!==z&&F(n,t))return s[t]=4,n[t];if(p=c.config.globalProperties,F(p,t))return p[t]},set({_:e},t,n){let{data:r,setupState:o,ctx:i}=e;return lo(o,t)?(o[t]=n,!0):__VUE_OPTIONS_API__&&r!==z&&F(r,t)?(r[t]=n,!0):F(e.props,t)||t[0]==="$"&&t.slice(1)in e?!1:(i[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:o,props:i,type:s}},a){let c;return!!(n[a]||__VUE_OPTIONS_API__&&e!==z&&a[0]!=="$"&&F(e,a)||lo(t,a)||F(i,a)||F(r,a)||F(Nn,a)||F(o.config.globalProperties,a)||(c=s.__cssModules)&&c[a])},defineProperty(e,t,n){return n.get!=null?e._.accessCache[t]=0:F(n,"value")&&this.set(e,t,n.value,null),Reflect.defineProperty(e,t,n)}};function zi(e){return R(e)?e.reduce((t,n)=>(t[n]=null,t),{}):e}var ho=!0;function Hl(e){let t=vo(e),n=e.proxy,r=e.ctx;ho=!1,t.beforeCreate&&Yi(t.beforeCreate,e,"bc");let{data:o,computed:i,methods:s,watch:a,provide:c,inject:f,created:u,beforeMount:p,mounted:b,beforeUpdate:C,updated:v,activated:O,deactivated:P,beforeDestroy:U,beforeUnmount:M,destroyed:$,unmounted:de,render:S,renderTracked:ee,renderTriggered:ue,errorCaptured:fe,serverPrefetch:ve,expose:De,inheritAttrs:He,components:Xe,directives:yt,filters:Yt}=t;if(f&&Ul(f,r,null),s)for(let Y in s){let B=s[Y];I(B)&&(r[Y]=B.bind(n))}if(o){let Y=o.call(n,n);K(Y)&&(e.data=_n(Y))}if(ho=!0,i)for(let Y in i){let B=i[Y],Oe=I(B)?B.bind(n,n):I(B.get)?B.get.bind(n,n):he,qt=!I(B)&&I(B.set)?B.set.bind(n):he,Se=Nt({get:Oe,set:qt});Object.defineProperty(r,Y,{enumerable:!0,configurable:!0,get:()=>Se.value,set:Ze=>Se.value=Ze})}if(a)for(let Y in a)Es(a[Y],r,n,Y);if(c){let Y=I(c)?c.call(n):c;Reflect.ownKeys(Y).forEach(B=>{xl(B,Y[B])})}u&&Yi(u,e,"c");function ae(Y,B){R(B)?B.forEach(Oe=>Y(Oe.bind(n))):B&&Y(B.bind(n))}if(ae(Vl,p),ae(ys,b),ae(_s,C),ae(bs,v),ae(Tl,O),ae(kl,P),ae($l,fe),ae(Pl,ee),ae(Il,ue),ae(Ml,M),ae(Eo,de),ae(Rl,ve),R(De))if(De.length){let Y=e.exposed||(e.exposed={});De.forEach(B=>{Object.defineProperty(Y,B,{get:()=>n[B],set:Oe=>n[B]=Oe,enumerable:!0})})}else e.exposed||(e.exposed={});S&&e.render===he&&(e.render=S),He!=null&&(e.inheritAttrs=He),Xe&&(e.components=Xe),yt&&(e.directives=yt),ve&&ms(e)}function Ul(e,t,n=he){R(e)&&(e=mo(e));for(let r in e){let o=e[r],i;K(o)?"default"in o?i=dr(o.from||r,o.default,!0):i=dr(o.from||r):i=dr(o),se(i)?Object.defineProperty(t,r,{enumerable:!0,configurable:!0,get:()=>i.value,set:s=>i.value=s}):t[r]=i}}function Yi(e,t,n){Ve(R(e)?e.map(r=>r.bind(t.proxy)):e.bind(t.proxy),t,n)}function Es(e,t,n,r){let o=r.includes(".")?ps(n,r):()=>n[r];if(Z(e)){let i=t[e];I(i)&&Bt(o,i)}else if(I(e))Bt(o,e.bind(n));else if(K(e))if(R(e))e.forEach(i=>Es(i,t,n,r));else{let i=I(e.handler)?e.handler.bind(n):t[e.handler];I(i)&&Bt(o,i,e)}}function vo(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:o,optionsCache:i,config:{optionMergeStrategies:s}}=e.appContext,a=i.get(t),c;return a?c=a:!o.length&&!n&&!r?c=t:(c={},o.length&&o.forEach(f=>mr(c,f,s,!0)),mr(c,t,s)),K(t)&&i.set(t,c),c}function mr(e,t,n,r=!1){let{mixins:o,extends:i}=t;i&&mr(e,i,n,!0),o&&o.forEach(s=>mr(e,s,n,!0));for(let s in t)if(!(r&&s==="expose")){let a=jl[s]||n&&n[s];e[s]=a?a(e[s],t[s]):t[s]}return e}var jl={data:Gi,props:qi,emits:qi,methods:wn,computed:wn,beforeCreate:ge,created:ge,beforeMount:ge,mounted:ge,beforeUpdate:ge,updated:ge,beforeDestroy:ge,beforeUnmount:ge,destroyed:ge,unmounted:ge,activated:ge,deactivated:ge,errorCaptured:ge,serverPrefetch:ge,components:wn,directives:wn,watch:Wl,provide:Gi,inject:Bl};function Gi(e,t){return t?e?function(){return Q(I(e)?e.call(this,this):e,I(t)?t.call(this,this):t)}:t:e}function Bl(e,t){return wn(mo(e),mo(t))}function mo(e){if(R(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function ge(e,t){return e?[...new Set([].concat(e,t))]:t}function wn(e,t){return e?Q(Object.create(null),e,t):t}function qi(e,t){return e?R(e)&&R(t)?[...new Set([...e,...t])]:Q(Object.create(null),zi(e),zi(t??{})):t}function Wl(e,t){if(!e)return t;if(!t)return e;let n=Q(Object.create(null),e);for(let r in t)n[r]=ge(e[r],t[r]);return n}function vs(){return{app:null,config:{isNativeTag:$r,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Kl=0;function zl(e,t){return function(r,o=null){I(r)||(r=Q({},r)),o!=null&&!K(o)&&(o=null);let i=vs(),s=new WeakSet,a=[],c=!1,f=i.app={_uid:Kl++,_component:r,_props:o,_container:null,_context:i,_instance:null,version:rs,get config(){return i.config},set config(u){},use(u,...p){return s.has(u)||(u&&I(u.install)?(s.add(u),u.install(f,...p)):I(u)&&(s.add(u),u(f,...p))),f},mixin(u){return __VUE_OPTIONS_API__&&(i.mixins.includes(u)||i.mixins.push(u)),f},component(u,p){return p?(i.components[u]=p,f):i.components[u]},directive(u,p){return p?(i.directives[u]=p,f):i.directives[u]},mount(u,p,b){if(!c){let C=f._ceVNode||Ae(r,o);return C.appContext=i,b===!0?b="svg":b===!1&&(b=void 0),p&&t?t(C,u):e(C,u,b),c=!0,f._container=u,u.__vue_app__=f,__VUE_PROD_DEVTOOLS__&&(f._instance=C.component,gl(f,rs)),No(C.component)}},onUnmount(u){a.push(u)},unmount(){c&&(Ve(a,f._instance,16),e(null,f._container),__VUE_PROD_DEVTOOLS__&&(f._instance=null,yl(f)),delete f._container.__vue_app__)},provide(u,p){return i.provides[u]=p,f},runWithContext(u){let p=Wt;Wt=f;try{return u()}finally{Wt=p}}};return f}}var Wt=null;var Yl=(e,t)=>t==="modelValue"||t==="model-value"?e.modelModifiers:e[`${t}Modifiers`]||e[`${me(t)}Modifiers`]||e[`${et(t)}Modifiers`];function Gl(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||z,o=n,i=t.startsWith("update:"),s=i&&Yl(r,t.slice(7));s&&(s.trim&&(o=n.map(u=>Z(u)?u.trim():u)),s.number&&(o=o.map(Ur))),__VUE_PROD_DEVTOOLS__&&vl(e,t,o);let a,c=r[a=an(t)]||r[a=an(me(t))];!c&&i&&(c=r[a=an(et(t))]),c&&Ve(c,e,6,o);let f=r[a+"Once"];if(f){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,Ve(f,e,6,o)}}var ql=new WeakMap;function ws(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?ql:t.emitsCache,o=r.get(e);if(o!==void 0)return o;let i=e.emits,s={},a=!1;if(__VUE_OPTIONS_API__&&!I(e)){let c=f=>{let u=ws(f,t,!0);u&&(a=!0,Q(s,u))};!n&&t.mixins.length&&t.mixins.forEach(c),e.extends&&c(e.extends),e.mixins&&e.mixins.forEach(c)}return!i&&!a?(K(e)&&r.set(e,null),null):(R(i)?i.forEach(c=>s[c]=null):Q(s,i),K(e)&&r.set(e,s),s)}function Nr(e,t){return!e||!Rt(t)?!1:(t=t.slice(2),t=t==="Once"?t:t.replace(/Once$/,""),F(e,t[0].toLowerCase()+t.slice(1))||F(e,et(t))||F(e,t))}function co(e){let{type:t,vnode:n,proxy:r,withProxy:o,propsOptions:[i],slots:s,attrs:a,emit:c,render:f,renderCache:u,props:p,data:b,setupState:C,ctx:v,inheritAttrs:O}=e,P=pr(e),U,M;try{if(n.shapeFlag&4){let S=o||r,ee=S;U=Ge(f.call(ee,S,u,p,C,b,v)),M=a}else{let S=t;U=Ge(S.length>1?S(p,{attrs:a,slots:s,emit:c}):S(p,null)),M=t.props?a:Jl(a)}}catch(S){Kt.length=0,Er(S,e,1),U=Ae(gt)}let $=U,de;if(M&&O!==!1){let S=Object.keys(M),{shapeFlag:ee}=$;S.length&&ee&7&&(i&&S.some(It)&&(M=Xl(M,i)),$=zt($,M,!1,!0))}if(n.dirs&&($=zt($,null,!1,!0),$.dirs=$.dirs?$.dirs.concat(n.dirs):n.dirs),n.transition){let S=wr($.type)&&hs($)||$;xr(S,n.transition)}return U=$,pr(P),U}var Jl=e=>{let t;for(let n in e)(n==="class"||n==="style"||Rt(n))&&((t||(t={}))[n]=e[n]);return t},Xl=(e,t)=>{let n={};for(let r in e)(!It(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function Zl(e,t,n){let{props:r,children:o,component:i}=e,{props:s,children:a,patchFlag:c}=t,f=i.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?Ji(r,s,f):!!s;if(c&8){let u=t.dynamicProps;for(let p=0;p<u.length;p++){let b=u[p];if(xs(s,r,b)&&!Nr(f,b))return!0}}}else return(o||a)&&(!a||!a.$stable)?!0:r===s?!1:r?s?Ji(r,s,f):!0:!!s;return!1}function Ji(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let o=0;o<r.length;o++){let i=r[o];if(xs(t,e,i)&&!Nr(n,i))return!0}return!1}function xs(e,t,n){let r=e[n],o=t[n];return n==="style"&&K(r)&&K(o)?!Lt(r,o):r!==o}function Ql({vnode:e,parent:t,suspense:n},r){for(;t;){let o=t.subTree;if(o.suspense&&o.suspense.activeBranch===e&&(o.suspense.vnode.el=o.el=r,e=o),o===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var Cs={},Ns=()=>Object.create(Cs),Ds=e=>Object.getPrototypeOf(e)===Cs;function ec(e,t,n,r=!1){let o={},i=Ns();e.propsDefaults=Object.create(null),Os(e,t,o,i);for(let s in e.propsOptions[0])s in o||(o[s]=void 0);n?e.props=r?o:ro(o):e.type.props?e.props=o:e.props=i,e.attrs=i}function tc(e,t,n,r){let{props:o,attrs:i,vnode:{patchFlag:s}}=e,a=H(o),[c]=e.propsOptions,f=!1;if((r||s>0)&&!(s&16)){if(s&8){let u=e.vnode.dynamicProps;for(let p=0;p<u.length;p++){let b=u[p];if(Nr(e.emitsOptions,b))continue;let C=t[b];if(c)if(F(i,b))C!==i[b]&&(i[b]=C,f=!0);else{let v=me(b);o[v]=go(c,a,v,C,e,!1)}else C!==i[b]&&(i[b]=C,f=!0)}}}else{Os(e,t,o,i)&&(f=!0);let u;for(let p in a)(!t||!F(t,p)&&((u=et(p))===p||!F(t,u)))&&(c?n&&(n[p]!==void 0||n[u]!==void 0)&&(o[p]=go(c,a,p,void 0,e,!0)):delete o[p]);if(i!==a)for(let p in i)(!t||!F(t,p))&&(delete i[p],f=!0)}f&&Be(e.attrs,"set","")}function Os(e,t,n,r){let[o,i]=e.propsOptions,s=!1,a;if(t)for(let c in t){if(Pt(c))continue;let f=t[c],u;o&&F(o,u=me(c))?!i||!i.includes(u)?n[u]=f:(a||(a={}))[u]=f:Nr(e.emitsOptions,c)||(!(c in r)||f!==r[c])&&(r[c]=f,s=!0)}if(i){let c=H(n),f=a||z;for(let u=0;u<i.length;u++){let p=i[u];n[p]=go(o,c,p,f[p],e,!F(f,p))}}return s}function go(e,t,n,r,o,i){let s=e[n];if(s!=null){let a=F(s,"default");if(a&&r===void 0){let c=s.default;if(s.type!==Function&&!s.skipFactory&&I(c)){let{propsDefaults:f}=o;if(n in f)r=f[n];else{let u=Rn(o);r=f[n]=c.call(null,t),u()}}else r=c;o.ce&&o.ce._setProp(n,r)}s[0]&&(i&&!a?r=!1:s[1]&&(r===""||r===et(n))&&(r=!0))}return r}var nc=new WeakMap;function Ss(e,t,n=!1){let r=__VUE_OPTIONS_API__&&n?nc:t.propsCache,o=r.get(e);if(o)return o;let i=e.props,s={},a=[],c=!1;if(__VUE_OPTIONS_API__&&!I(e)){let u=p=>{c=!0;let[b,C]=Ss(p,t,!0);Q(s,b),C&&a.push(...C)};!n&&t.mixins.length&&t.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!i&&!c)return K(e)&&r.set(e,Et),Et;if(R(i))for(let u=0;u<i.length;u++){let p=me(i[u]);Xi(p)&&(s[p]=z)}else if(i)for(let u in i){let p=me(u);if(Xi(p)){let b=i[u],C=s[p]=R(b)||I(b)?{type:b}:Q({},b),v=C.type,O=!1,P=!0;if(R(v))for(let U=0;U<v.length;++U){let M=v[U],$=I(M)&&M.name;if($==="Boolean"){O=!0;break}else $==="String"&&(P=!1)}else O=I(v)&&v.name==="Boolean";C[0]=O,C[1]=P,(O||F(C,"default"))&&a.push(p)}}let f=[s,a];return K(e)&&r.set(e,f),f}function Xi(e){return e[0]!=="$"&&!Pt(e)}var wo=e=>e==="_"||e==="_ctx"||e==="$stable",xo=e=>R(e)?e.map(Ge):[Ge(e)],rc=(e,t,n)=>{if(t._n)return t;let r=wl((...o)=>xo(t(...o)),n);return r._c=!1,r},Ts=(e,t,n)=>{let r=e._ctx;for(let o in e){if(wo(o))continue;let i=e[o];if(I(i))t[o]=rc(o,i,r);else if(i!=null){let s=xo(i);t[o]=()=>s}}},ks=(e,t)=>{let n=xo(t);e.slots.default=()=>n},As=(e,t,n)=>{for(let r in t)(n||!wo(r))&&(e[r]=t[r])},oc=(e,t,n)=>{let r=e.slots=Ns();if(e.vnode.shapeFlag&32){let o=t._;o?(As(r,t,n),n&&$t(r,"_",o,!0)):Ts(t,r)}else t&&ks(e,t)},ic=(e,t,n)=>{let{vnode:r,slots:o}=e,i=!0,s=z;if(r.shapeFlag&32){let a=t._;a?n&&a===1?i=!1:As(o,t,n):(i=!t.$stable,Ts(t,o)),s=t}else t&&(ks(e,t),s={default:1});if(i)for(let a in o)!wo(a)&&s[a]==null&&delete o[a]};function sc(){let e=[];typeof __VUE_OPTIONS_API__!="boolean"&&(ft().__VUE_OPTIONS_API__=!0),typeof __VUE_PROD_DEVTOOLS__!="boolean"&&(ft().__VUE_PROD_DEVTOOLS__=!1),typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__!="boolean"&&(ft().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__=!1)}var Ee=dc;function Vs(e){return ac(e)}function ac(e,t){sc();let n=ft();n.__VUE__=!0,__VUE_PROD_DEVTOOLS__&&cs(n.__VUE_DEVTOOLS_GLOBAL_HOOK__,n);let{insert:r,remove:o,patchProp:i,createElement:s,createText:a,createComment:c,setText:f,setElementText:u,parentNode:p,nextSibling:b,setScopeId:C=he,insertStaticContent:v}=e,O=(l,d,h,_=null,m=null,y=null,x=void 0,w=null,E=!!d.dynamicChildren)=>{if(l===d)return;l&&!En(l,d)&&(_=Dt(l),k(l,m,y,!0),l=null),d.patchFlag===-2&&(E=!1,d.dynamicChildren=null),d.dynamicChildren&&l&&l.dynamicChildren&&l.dynamicChildren.hasOnce&&(d.dynamicChildren===Et&&(d.dynamicChildren=[]),d.dynamicChildren.hasOnce=!0);let{type:g,ref:A,shapeFlag:N}=d;switch(g){case Mn:P(l,d,h,_);break;case gt:U(l,d,h,_);break;case Dn:l==null&&M(d,h,_,x);break;case Fe:yt(l,d,h,_,m,y,x,w,E);break;default:N&1?ee(l,d,h,_,m,y,x,w,E):N&6?Yt(l,d,h,_,m,y,x,w,E):(N&64||N&128)&&g.process(l,d,h,_,m,y,x,w,E,Ot)}A!=null&&m?xn(A,l&&l.ref,y,d||l,!d):A==null&&l&&l.ref!=null&&xn(l.ref,null,y,l,!0)},P=(l,d,h,_)=>{if(l==null)r(d.el=a(d.children),h,_);else{let m=d.el=l.el;d.children!==l.children&&f(m,d.children)}},U=(l,d,h,_)=>{l==null?r(d.el=c(d.children||""),h,_):d.el=l.el},M=(l,d,h,_)=>{[l.el,l.anchor]=v(l.children,d,h,_,l.el,l.anchor)},$=(l,d,h,_)=>{if(d.children!==l.children){let m=b(l.anchor);S(l),[d.el,d.anchor]=v(d.children,h,m,_)}else d.el=l.el,d.anchor=l.anchor},de=({el:l,anchor:d},h,_)=>{let m;for(;l&&l!==d;)m=b(l),r(l,h,_),l=m;r(d,h,_)},S=({el:l,anchor:d})=>{let h;for(;l&&l!==d;)h=b(l),o(l),l=h;o(d)},ee=(l,d,h,_,m,y,x,w,E)=>{if(d.type==="svg"?x="svg":d.type==="math"&&(x="mathml"),l==null)ue(d,h,_,m,y,x,w,E);else{let g=l.el&&l.el._isVueCE?l.el:null;try{g&&g._beginPatch(),De(l,d,m,y,x,w,E)}finally{g&&g._endPatch()}}},ue=(l,d,h,_,m,y,x,w)=>{let E,g,{props:A,shapeFlag:N,transition:T,dirs:V}=l;if(E=l.el=s(l.type,y,A&&A.is,A),N&8?u(E,l.children):N&16&&ve(l.children,E,null,_,m,uo(l,y),x,w),V&&xt(l,null,_,"created"),fe(E,l,l.scopeId,x,_),A){for(let G in A)G!=="value"&&!Pt(G)&&i(E,G,null,A[G],y,_);"value"in A&&i(E,"value",null,A.value,y),(g=A.onVnodeBeforeMount)&&ze(g,_,l)}__VUE_PROD_DEVTOOLS__&&($t(E,"__vnode",l,!0),$t(E,"__vueParentComponent",_,!0)),V&&xt(l,null,_,"beforeMount");let L=lc(m,T);L&&T.beforeEnter(E),r(E,d,h),((g=A&&A.onVnodeMounted)||L||V)&&Ee(()=>{let W;g&&ze(g,_,l),L&&T.enter(E),V&&xt(l,null,_,"mounted")},m)},fe=(l,d,h,_,m)=>{if(h&&C(l,h),_)for(let y=0;y<_.length;y++)C(l,_[y]);if(m){let y=m.subTree;if(d===y||Ps(y.type)&&(y.ssContent===d||y.ssFallback===d)){let x=m.vnode;fe(l,x,x.scopeId,x.slotScopeIds,m.parent)}}},ve=(l,d,h,_,m,y,x,w,E=0)=>{for(let g=E;g<l.length;g++){let A=l[g]=w?ot(l[g]):Ge(l[g]);O(null,A,d,h,_,m,y,x,w)}},De=(l,d,h,_,m,y,x)=>{let w=d.el=l.el;__VUE_PROD_DEVTOOLS__&&(w.__vnode=d);let{patchFlag:E,dynamicChildren:g,dirs:A}=d;E|=l.patchFlag&16;let N=l.props||z,T=d.props||z,V;if(h&&Ct(h,!1),(V=T.onVnodeBeforeUpdate)&&ze(V,h,d,l),A&&xt(d,l,h,"beforeUpdate"),h&&Ct(h,!0),g&&(!l.dynamicChildren||l.dynamicChildren.length!==g.length)&&(E=0,x=!1,g=null),(N.innerHTML&&T.innerHTML==null||N.textContent&&T.textContent==null)&&u(w,""),g?He(l.dynamicChildren,g,w,h,_,uo(d,m),y):x||Oe(l,d,w,null,h,_,uo(d,m),y,!1),E>0){if(E&16)Xe(w,N,T,h,m);else if(E&2&&N.class!==T.class&&i(w,"class",null,T.class,m),E&4&&i(w,"style",N.style,T.style,m),E&8){let L=d.dynamicProps;for(let G=0;G<L.length;G++){let W=L[G],re=N[W],oe=T[W];(oe!==re||W==="value")&&i(w,W,re,oe,m,h)}}E&1&&l.children!==d.children&&u(w,d.children)}else!x&&g==null&&Xe(w,N,T,h,m);((V=T.onVnodeUpdated)||A)&&Ee(()=>{V&&ze(V,h,d,l),A&&xt(d,l,h,"updated")},_)},He=(l,d,h,_,m,y,x)=>{for(let w=0;w<d.length;w++){let E=l[w],g=d[w],A=E.el&&(E.type===Fe||!En(E,g)||E.shapeFlag&198)?p(E.el):h;O(E,g,A,null,_,m,y,x,!0)}},Xe=(l,d,h,_,m)=>{if(d!==h){if(d!==z)for(let y in d)!Pt(y)&&!(y in h)&&i(l,y,d[y],null,m,_);for(let y in h){if(Pt(y))continue;let x=h[y],w=d[y];x!==w&&y!=="value"&&i(l,y,w,x,m,_)}"value"in h&&i(l,"value",d.value,h.value,m)}},yt=(l,d,h,_,m,y,x,w,E)=>{let g=d.el=l?l.el:a(""),A=d.anchor=l?l.anchor:a(""),{patchFlag:N,dynamicChildren:T,slotScopeIds:V}=d;V&&(w=w?w.concat(V):V),l==null?(r(g,h,_),r(A,h,_),ve(d.children||[],h,A,m,y,x,w,E)):N>0&&N&64&&T&&l.dynamicChildren&&l.dynamicChildren.length===T.length?(He(l.dynamicChildren,T,h,m,y,x,w),(d.key!=null||m&&d===m.subTree)&&Ms(l,d,!0)):Oe(l,d,h,A,m,y,x,w,E)},Yt=(l,d,h,_,m,y,x,w,E)=>{d.slotScopeIds=w,l==null?d.shapeFlag&512?m.ctx.activate(d,h,_,x,E):Gt(d,h,_,m,y,x,E):ae(l,d,E)},Gt=(l,d,h,_,m,y,x)=>{let w=l.component=bc(l,_,m);if(bo(l)&&(w.ctx.renderer=Ot),Ec(w,!1,x),w.asyncDep){if(m&&m.registerDep(w,Y,x),!l.el){let E=w.subTree=Ae(gt);U(null,E,d,h),l.placeholder=E.el}}else Y(w,l,d,h,m,y,x)},ae=(l,d,h)=>{let _=d.component=l.component;if(Zl(l,d,h))if(_.asyncDep&&!_.asyncResolved){d.el=l.el,B(_,d,h);return}else _.next=d,_.update();else d.el=l.el,_.vnode=d},Y=(l,d,h,_,m,y,x)=>{let w=()=>{if(l.isMounted){let{next:N,bu:T,u:V,parent:L,vnode:G}=l;{let we=Rs(l);if(we){N&&(N.el=G.el,B(l,N,x)),we.asyncDep.then(()=>{Ee(()=>{l.isUnmounted||g()},m)});return}}let W=N,re;Ct(l,!1),N?(N.el=G.el,B(l,N,x)):N=G,T&&ln(T),(re=N.props&&N.props.onVnodeBeforeUpdate)&&ze(re,L,N,G),Ct(l,!0);let oe=co(l),Re=l.subTree;l.subTree=oe,O(Re,oe,p(Re.el),Dt(Re),l,m,y),N.el=oe.el,W===null&&Ql(l,oe.el),V&&Ee(V,m),(re=N.props&&N.props.onVnodeUpdated)&&Ee(()=>ze(re,L,N,G),m),__VUE_PROD_DEVTOOLS__&&ds(l)}else{let N,{el:T,props:V}=d,{bm:L,m:G,parent:W,root:re,type:oe}=l,Re=Cn(d);if(Ct(l,!1),L&&ln(L),!Re&&(N=V&&V.onVnodeBeforeMount)&&ze(N,W,d),Ct(l,!0),T&&kr){let we=()=>{l.subTree=co(l),kr(T,l.subTree,l,m,null)};Re&&oe.__asyncHydrate?oe.__asyncHydrate(T,l,we):we()}else{re.ce&&re.ce._hasShadowRoot()&&re.ce._injectChildStyle(oe,l.parent?l.parent.type:void 0);let we=l.subTree=co(l);O(null,we,h,_,l,m,y),d.el=we.el}if(G&&Ee(G,m),!Re&&(N=V&&V.onVnodeMounted)){let we=d;Ee(()=>ze(N,W,we),m)}(d.shapeFlag&256||W&&Cn(W.vnode)&&W.vnode.shapeFlag&256)&&l.a&&Ee(l.a,m),l.isMounted=!0,__VUE_PROD_DEVTOOLS__&&_l(l),d=h=_=null}};l.scope.on();let E=l.effect=new Ht(w);l.scope.off();let g=l.update=E.run.bind(E),A=l.job=E.runIfDirty.bind(E);A.i=l,A.id=l.uid,E.scheduler=()=>yo(A),Ct(l,!0),g()},B=(l,d,h)=>{d.component=l;let _=l.vnode.props;l.vnode=d,l.next=null,tc(l,d.props,_,h),ic(l,d.children,h),We(),Bi(l),Ke()},Oe=(l,d,h,_,m,y,x,w,E=!1)=>{let g=l&&l.children,A=l?l.shapeFlag:0,N=d.children,{patchFlag:T,shapeFlag:V}=d;if(T>0){if(T&128){Se(g,N,h,_,m,y,x,w,E);return}else if(T&256){qt(g,N,h,_,m,y,x,w,E);return}}V&8?(A&16&&lt(g,m,y),N!==g&&u(h,N)):A&16?V&16?Se(g,N,h,_,m,y,x,w,E):lt(g,m,y,!0):(A&8&&u(h,""),V&16&&ve(N,h,_,m,y,x,w,E))},qt=(l,d,h,_,m,y,x,w,E)=>{l=l||Et,d=d||Et;let g=l.length,A=d.length,N=Math.min(g,A),T;for(T=0;T<N;T++){let V=d[T]=E?ot(d[T]):Ge(d[T]);O(l[T],V,h,null,m,y,x,w,E)}g>A?lt(l,m,y,!0,!1,N):ve(d,h,_,m,y,x,w,E,N)},Se=(l,d,h,_,m,y,x,w,E)=>{let g=0,A=d.length,N=l.length-1,T=A-1;for(;g<=N&&g<=T;){let V=l[g],L=d[g]=E?ot(d[g]):Ge(d[g]);if(En(V,L))O(V,L,h,null,m,y,x,w,E);else break;g++}for(;g<=N&&g<=T;){let V=l[N],L=d[T]=E?ot(d[T]):Ge(d[T]);if(En(V,L))O(V,L,h,null,m,y,x,w,E);else break;N--,T--}if(g>N){if(g<=T){let V=T+1,L=V<A?d[V].el:_;for(;g<=T;)O(null,d[g]=E?ot(d[g]):Ge(d[g]),h,L,m,y,x,w,E),g++}}else if(g>T)for(;g<=N;)k(l[g],m,y,!0),g++;else{let V=g,L=g,G=new Map;for(g=L;g<=T;g++){let xe=d[g]=E?ot(d[g]):Ge(d[g]);xe.key!=null&&G.set(xe.key,g)}let W,re=0,oe=T-L+1,Re=!1,we=0,Xt=new Array(oe);for(g=0;g<oe;g++)Xt[g]=0;for(g=V;g<=N;g++){let xe=l[g];if(re>=oe){k(xe,m,y,!0);continue}let Ue;if(xe.key!=null)Ue=G.get(xe.key);else for(W=L;W<=T;W++)if(Xt[W-L]===0&&En(xe,d[W])){Ue=W;break}Ue===void 0?k(xe,m,y,!0):(Xt[Ue-L]=g+1,Ue>=we?we=Ue:Re=!0,O(xe,d[Ue],h,null,m,y,x,w,E),re++)}let Ao=Re?cc(Xt):Et;for(W=Ao.length-1,g=oe-1;g>=0;g--){let xe=L+g,Ue=d[xe],Vo=d[xe+1],Mo=xe+1<A?Vo.el||Is(Vo):_;Xt[g]===0?O(null,Ue,h,Mo,m,y,x,w,E):Re&&(W<0||g!==Ao[W]?Ze(Ue,h,Mo,2):W--)}}},Ze=(l,d,h,_,m=null)=>{let{el:y,type:x,transition:w,children:E,shapeFlag:g}=l;if(g&6){Ze(l.component.subTree,d,h,_);return}if(g&128){l.suspense.move(d,h,_);return}if(g&64){x.move(l,d,h,Ot);return}if(x===Fe){r(y,d,h);for(let N=0;N<E.length;N++)Ze(E[N],d,h,_);r(l.anchor,d,h);return}if(x===Dn){de(l,d,h);return}if(_!==2&&g&1&&w)if(_===0)w.persisted&&!y[ao]?r(y,d,h):(w.beforeEnter(y),r(y,d,h),Ee(()=>w.enter(y),m));else{let{leave:N,delayLeave:T,afterLeave:V}=w,L=()=>{l.ctx.isUnmounted?o(y):r(y,d,h)},G=()=>{let W=y._isLeaving||!!y[ao];y._isLeaving&&y[ao](!0),w.persisted&&!W?L():N(y,()=>{L(),V&&V()})};T?T(y,L,G):G()}else r(y,d,h)},k=(l,d,h,_=!1,m=!1)=>{let{type:y,props:x,ref:w,children:E,dynamicChildren:g,shapeFlag:A,patchFlag:N,dirs:T,cacheIndex:V,memo:L}=l;if((N===-2||g&&g.hasOnce)&&(m=!1),w!=null&&(We(),xn(w,null,h,l,!0),Ke()),V!=null&&(!l.ctx||l.ctx===d)&&(d.renderCache[V]=void 0),A&256){d.ctx.deactivate(l);return}let G=A&1&&T,W=!Cn(l),re;if(W&&(re=x&&x.onVnodeBeforeUnmount)&&ze(re,d,l),A&6)Me(l.component,h,_);else{if(A&128){l.suspense.unmount(h,_);return}G&&xt(l,null,d,"beforeUnmount"),A&64?l.type.remove(l,d,h,Ot,_):g&&!g.hasOnce&&(y!==Fe||N>0&&N&64)?lt(g,d,h,!1,!0):(y===Fe&&N&384||!m&&A&16)&&lt(E,d,h),_&&J(l)}let oe=L!=null&&V==null;(W&&(re=x&&x.onVnodeUnmounted)||G||oe)&&Ee(()=>{re&&ze(re,d,l),G&&xt(l,null,d,"unmounted"),oe&&(l.el=null)},h)},J=l=>{let{type:d,el:h,anchor:_,transition:m}=l;if(d===Fe){Te(h,_);return}if(d===Dn){S(l),m&&!m.persisted&&m.afterLeave&&m.afterLeave();return}let y=()=>{o(h),m&&!m.persisted&&m.afterLeave&&m.afterLeave()};if(l.shapeFlag&1&&m&&!m.persisted){let{leave:x,delayLeave:w}=m,E=()=>x(h,y);w?w(l.el,y,E):E()}else y()},Te=(l,d)=>{let h;for(;l!==d;)h=b(l),o(l),l=h;o(d)},Me=(l,d,h)=>{let{bum:_,scope:m,job:y,subTree:x,um:w,m:E,a:g}=l;Zi(E),Zi(g),_&&ln(_),m.stop(),y?(y.flags|=8,k(x,l,d,h)):l.vnode.el&&x&&(x.transition=l.vnode.transition,k(x,l,d,h)),w&&Ee(w,d),Ee(()=>{l.isUnmounted=!0},d),__VUE_PROD_DEVTOOLS__&&El(l)},lt=(l,d,h,_=!1,m=!1,y=0)=>{for(let x=y;x<l.length;x++)k(l[x],d,h,_,m)},Dt=l=>{if(l.shapeFlag&6)return Dt(l.component.subTree);if(l.shapeFlag&128)return l.suspense.next();let d=b(l.anchor||l.el),h=d&&d[Ol];return h?b(h):d},Jt=!1,ko=(l,d,h)=>{let _;l==null?d._vnode&&(k(d._vnode,null,null,!0),_=d._vnode.component):O(d._vnode||null,l,d,null,null,null,h),d._vnode=l,Jt||(Jt=!0,Bi(_),as(),Jt=!1)},Ot={p:O,um:k,m:Ze,r:J,mt:Gt,mc:ve,pc:Oe,pbc:He,n:Dt,o:e},Tr,kr;return t&&([Tr,kr]=t(Ot)),{render:ko,hydrate:Tr,createApp:zl(ko,Tr)}}function uo({type:e,props:t},n){return n==="svg"&&e==="foreignObject"||n==="mathml"&&e==="annotation-xml"&&t&&t.encoding&&t.encoding.includes("html")?void 0:n}function Ct({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function lc(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ms(e,t,n=!1){let r=e.children,o=t.children;if(R(r)&&R(o))for(let i=0;i<r.length;i++){let s=r[i],a=o[i];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=o[i]=ot(o[i]),a.el=s.el),!n&&a.patchFlag!==-2&&Ms(s,a)),a.type===Mn&&(a.patchFlag===-1&&(a=o[i]=ot(a)),a.el=s.el),a.type===gt&&!a.el&&(a.el=s.el)}}function cc(e){let t=e.slice(),n=[0],r,o,i,s,a,c=e.length;for(r=0;r<c;r++){let f=e[r];if(f!==0){if(o=n[n.length-1],e[o]<f){t[r]=o,n.push(r);continue}for(i=0,s=n.length-1;i<s;)a=i+s>>1,e[n[a]]<f?i=a+1:s=a;f<e[n[i]]&&(i>0&&(t[r]=n[i-1]),n[i]=r)}}for(i=n.length,s=n[i-1];i-- >0;)n[i]=s,s=t[s];return n}function Rs(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Rs(t)}function Zi(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Is(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?Is(t.subTree):null}var Ps=e=>e.__isSuspense;function dc(e,t){t&&t.pendingBranch?R(e)?t.effects.push(...e):t.effects.push(e):ss(e)}var Fe=Symbol.for("v-fgt"),Mn=Symbol.for("v-txt"),gt=Symbol.for("v-cmt"),Dn=Symbol.for("v-stc"),Kt=[],it=null;function uc(){Kt.pop(),it=Kt[Kt.length-1]||null}var Co=1;function gr(e,t=!1){Co+=e,e<0&&it&&t&&(it.hasOnce=!0)}function yr(e){return e?e.__v_isVNode===!0:!1}function En(e,t){return e.type===t.type&&e.key===t.key}var $s=({key:e})=>e??null,ur=({ref:e,ref_key:t,ref_for:n})=>(typeof e=="number"&&(e=""+e),e!=null?Z(e)||se(e)||I(e)?{i:Je,r:e,k:t,f:!!n}:e:null);function fc(e,t=null,n=null,r=0,o=null,i=e===Fe?0:1,s=!1,a=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&$s(t),ref:t&&ur(t),scopeId:us,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:i,patchFlag:r,dynamicProps:o,dynamicChildren:null,appContext:null,ctx:Je};return a?(_r(c,n),i&128&&e.normalize(c)):n&&(c.shapeFlag|=Z(n)?8:16),Co>0&&!s&&it&&(c.patchFlag>0||i&6)&&c.patchFlag!==32&&it.push(c),c}var Ae=pc;function pc(e,t=null,n=null,r=0,o=null,i=!1){if((!e||e===Ll)&&(e=gt),yr(e)){let a=zt(e,t,!0);return n&&_r(a,n),Co>0&&!i&&it&&(a.shapeFlag&6?it[it.indexOf(e)]=a:it.push(a)),a.patchFlag=-2,a}if(Cc(e)&&(e=e.__vccOpts),t){t=hc(t);let{class:a,style:c}=t;a&&!Z(a)&&(t.class=dn(a)),K(c)&&(bn(c)&&!R(c)&&(c=Q({},c)),t.style=cn(c))}let s=Z(e)?1:Ps(e)?128:wr(e)?64:K(e)?4:I(e)?2:0;return fc(e,t,n,r,o,s,i,!0)}function hc(e){return e?bn(e)||Ds(e)?Q({},e):e:null}function zt(e,t,n=!1,r=!1){let{props:o,ref:i,patchFlag:s,children:a,transition:c}=e,f=t?gc(o||{},t):o,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:f,key:f&&$s(f),ref:t&&t.ref?n&&i?R(i)?i.concat(ur(t)):[i,ur(t)]:ur(t):i,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Fe?s===-1?16:s|16:s,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&zt(e.ssContent),ssFallback:e.ssFallback&&zt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&xr(u,c.clone(u)),u}function mc(e=" ",t=0){return Ae(Mn,null,e,t)}function Ge(e){return e==null||typeof e=="boolean"?Ae(gt):R(e)?Ae(Fe,null,e.slice()):yr(e)?ot(e):Ae(Mn,null,String(e))}function ot(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:zt(e)}function _r(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(R(t))n=16;else if(typeof t=="object")if(r&65){let o=t.default;o&&(o._c&&(o._d=!1),_r(e,o()),o._c&&(o._d=!0));return}else{n=32;let o=t._;!o&&!Ds(t)?t._ctx=Je:o===3&&Je&&(Je.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}else if(I(t)){if(r&65){_r(e,{default:t});return}t={default:t,_ctx:Je},n=32}else t=String(t),r&64?(n=16,t=[mc(t)]):n=8;e.children=t,e.shapeFlag|=n}function gc(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let o in r)if(o==="class")t.class!==r.class&&(t.class=dn([t.class,r.class]));else if(o==="style")t.style=cn([t.style,r.style]);else if(Rt(o)){let i=t[o],s=r[o];s&&i!==s&&!(R(i)&&i.includes(s))?t[o]=i?[].concat(i,s):s:s==null&&i==null&&!It(o)&&(t[o]=s)}else o!==""&&(t[o]=r[o])}return t}function ze(e,t,n,r=null){Ve(e,t,7,[n,r])}var yc=vs(),_c=0;function bc(e,t,n){let r=e.type,o=(t?t.appContext:e.appContext)||yc,i={uid:_c++,vnode:e,type:r,parent:t,appContext:o,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new hn(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(o.provides),ids:t?t.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Ss(r,o),emitsOptions:ws(r,o),emit:null,emitted:null,propsDefaults:z,inheritAttrs:r.inheritAttrs,ctx:z,data:z,props:z,attrs:z,slots:z,refs:z,setupState:z,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return i.ctx={_:i},i.root=t?t.root:i,i.emit=Gl.bind(null,i),e.ce&&e.ce(i),i}var _e=null,Ls=()=>_e||Je,br,Sn;{let e=ft(),t=(n,r)=>{let o;return(o=e[n])||(o=e[n]=[]),o.push(r),i=>{o.length>1?o.forEach(s=>s(i)):o[0](i)}};br=t("__VUE_INSTANCE_SETTERS__",n=>_e=n),Sn=t("__VUE_SSR_SETTERS__",n=>Tn=n)}var Rn=e=>{let t=_e;return br(e),e.scope.on(),()=>{e.scope.off(),br(t)}},Qi=()=>{_e&&_e.scope.off(),br(null)};function Fs(e){return e.vnode.shapeFlag&4}var Tn=!1;function Ec(e,t=!1,n=!1){t&&Sn(t);let{props:r,children:o}=e.vnode,i=Fs(e);ec(e,r,i,t),oc(e,o,n||t);let s=i?vc(e,t):void 0;return t&&Sn(!1),s}function vc(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Fl);let{setup:r}=n;if(r){We();let o=e.setupContext=r.length>1?xc(e):null,i=Rn(e),s=kn(r,e,0,[e.props,o]),a=Lr(s);if(Ke(),i(),(a||e.sp)&&!Cn(e)&&ms(e),a){if(s.then(Qi,Qi),t)return s.then(c=>{Sn(!0);try{es(e,c,t)}finally{Sn(!1)}}).catch(c=>{Er(c,e,0)});e.asyncDep=s}else es(e,s,t)}else Hs(e,t)}function es(e,t,n){I(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:K(t)&&(__VUE_PROD_DEVTOOLS__&&(e.devtoolsRawSetupState=t),e.setupState=cr(t)),Hs(e,n)}var ts,ns;function Hs(e,t,n){let r=e.type;if(!e.render){if(!t&&ts&&!r.render){let o=r.template||__VUE_OPTIONS_API__&&vo(e).template;if(o){let{isCustomElement:i,compilerOptions:s}=e.appContext.config,{delimiters:a,compilerOptions:c}=r,f=Q(Q({isCustomElement:i,delimiters:a},s),c);r.render=ts(o,f)}}e.render=r.render||he,ns&&ns(e)}if(__VUE_OPTIONS_API__){let o=Rn(e);We();try{Hl(e)}finally{Ke(),o()}}}var wc={get(e,t){return ce(e,"get",""),e[t]}};function xc(e){let t=n=>{e.exposed=n||{}};return{attrs:new Proxy(e.attrs,wc),slots:e.slots,emit:e.emit,expose:t}}function No(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(cr(io(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in Nn)return Nn[n](e)},has(t,n){return n in t||n in Nn}})):e.proxy}function Cc(e){return I(e)&&"__vccOpts"in e}var Nt=(e,t)=>Hi(e,t,Tn);function D(e,t,n){try{gr(-1);let r=arguments.length;return r===2?K(t)&&!R(t)?yr(t)?Ae(e,null,[t]):Ae(e,t):Ae(e,null,t):(r>3?n=Array.prototype.slice.call(arguments,2):r===3&&yr(n)&&(n=[n]),Ae(e,t,n))}finally{gr(1)}}var rs="3.5.43";var So,Us=typeof window<"u"&&window.trustedTypes;if(Us)try{So=Us.createPolicy("vue",{createHTML:e=>e})}catch{}var Xs=So?e=>So.createHTML(e):e=>e,Nc="http://www.w3.org/2000/svg",Dc="http://www.w3.org/1998/Math/MathML",at=typeof document<"u"?document:null,js=at&&at.createElement("template"),Oc={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let o=t==="svg"?at.createElementNS(Nc,e):t==="mathml"?at.createElementNS(Dc,e):n?at.createElement(e,{is:n}):at.createElement(e);return e==="select"&&r&&r.multiple!=null&&o.setAttribute("multiple",r.multiple),o},createText:e=>at.createTextNode(e),createComment:e=>at.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>at.querySelector(e),setScopeId(e,t){e.setAttribute(t,"")},insertStaticContent(e,t,n,r,o,i){let s=n?n.previousSibling:t.lastChild;if(o&&(o===i||o.nextSibling))for(;t.insertBefore(o.cloneNode(!0),n),!(o===i||!(o=o.nextSibling)););else{js.innerHTML=Xs(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);let a=js.content;if(r==="svg"||r==="mathml"){let c=a.firstChild;for(;c.firstChild;)a.appendChild(c.firstChild);a.removeChild(c)}t.insertBefore(a,n)}return[s?s.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}};var Sc=Symbol("_vtc");function Tc(e,t,n){let r=e[Sc];r&&(t=(t?[t,...r]:[...r]).join(" ")),t==null?e.removeAttribute("class"):n?e.setAttribute("class",t):e.className=t}var Bs=Symbol("_vod"),kc=Symbol("_vsh");var Ac=Symbol("");var Vc=/(?:^|;)\s*display\s*:/;function Mc(e,t,n){let r=e.style,o=Z(n),i=!1;if(n&&!o){if(t)if(Z(t))for(let s of t.split(";")){let a=s.slice(0,s.indexOf(":")).trim();n[a]==null&&In(r,a,"")}else for(let s in t)n[s]==null&&In(r,s,"");for(let s in n){s==="display"&&(i=!0);let a=n[s];a!=null?Ic(e,s,!Z(t)&&t?t[s]:void 0,a)||In(r,s,a):In(r,s,"")}}else if(o){if(t!==n){let s=r[Ac];s&&(n+=";"+s),r.cssText=n,i=Vc.test(n)}}else t&&e.removeAttribute("style");Bs in e&&(e[Bs]=i?r.display:"",e[kc]&&(r.display="none"))}var Dr=/\s*!important$/;function In(e,t,n){if(R(n))n.forEach(r=>In(e,t,r));else if(n==null&&(n=""),t.startsWith("--"))Dr.test(n)?e.setProperty(t,n.replace(Dr,""),"important"):e.setProperty(t,n);else{let r=Rc(e,t);Dr.test(n)?e.setProperty(et(r),n.replace(Dr,""),"important"):e[r]=n}}var Ws=["Webkit","Moz","ms"],Do={};function Rc(e,t){let n=Do[t];if(n)return n;let r=me(t);if(r!=="filter"&&r in e)return Do[t]=r;r=sn(r);for(let o=0;o<Ws.length;o++){let i=Ws[o]+r;if(i in e)return Do[t]=i}return t}function Ic(e,t,n,r){return e.tagName==="TEXTAREA"&&(t==="width"||t==="height")&&Z(r)&&n===r}var Ks="http://www.w3.org/1999/xlink";function zs(e,t,n,r,o,i=Ci(t)){r&&t.startsWith("xlink:")?n==null?e.removeAttributeNS(Ks,t.slice(6,t.length)):e.setAttributeNS(Ks,t,n):n==null||i&&!Qn(n)?e.removeAttribute(t):e.setAttribute(t,i?"":Ie(n)?String(n):n)}function Ys(e,t,n,r,o){if(t==="innerHTML"||t==="textContent"){n!=null&&(e[t]=t==="innerHTML"?Xs(n):n);return}let i=e.tagName;if(t==="value"&&i!=="PROGRESS"&&!i.includes("-")){let a=i==="OPTION"?e.getAttribute("value")||"":e.value,c=n==null?e.type==="checkbox"?"on":"":String(n);(a!==c||!("_value"in e))&&(e.value=c),n==null&&e.removeAttribute(t),e._value=n;return}let s=!1;if(n===""||n==null){let a=typeof e[t];a==="boolean"?n=Qn(n):n==null&&a==="string"?(n="",s=!0):a==="number"&&(n=0,s=!0)}try{e[t]=n}catch{}s&&e.removeAttribute(o||t)}function Pc(e,t,n,r){e.addEventListener(t,n,r)}function $c(e,t,n,r){e.removeEventListener(t,n,r)}var Gs=Symbol("_vei");function Lc(e,t,n,r,o=null){let i=e[Gs]||(e[Gs]={}),s=i[t];if(r&&s)s.value=r;else{let[a,c]=Uc(t);if(r){let f=i[t]=Wc(r,o);Pc(e,a,f,c)}else s&&($c(e,a,s,c),i[t]=void 0)}}var Fc=/(Once|Passive|Capture)$/,Hc=/^on:?(?:Once|Passive|Capture)$/;function Uc(e){let t,n;for(;(n=e.match(Fc))&&!Hc.test(e);)t||(t={}),e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===":"?e.slice(3):et(e.slice(2)),t]}var Oo=0,jc=Promise.resolve(),Bc=()=>Oo||(jc.then(()=>Oo=0),Oo=Date.now());function Wc(e,t){let n=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=n.attached)return;let o=n.value;if(R(o)){let i=r.stopImmediatePropagation;r.stopImmediatePropagation=()=>{i.call(r),r._stopped=!0};let s=o.slice(),a=[r];for(let c=0;c<s.length&&!r._stopped;c++){let f=s[c];f&&Ve(f,t,5,a)}}else Ve(o,t,5,[r])};return n.value=e,n.attached=Bc(),n}var qs=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Kc=(e,t,n,r,o,i)=>{let s=o==="svg";t==="class"?Tc(e,r,s):t==="style"?Mc(e,n,r):Rt(t)?It(t)||Lc(e,t,n,r,i):(t[0]==="."?(t=t.slice(1),!0):t[0]==="^"?(t=t.slice(1),!1):zc(e,t,r,s))?(Ys(e,t,r),!e.tagName.includes("-")&&(t==="value"||t==="checked"||t==="selected")&&zs(e,t,r,s,i,t!=="value")):e._isVueCE&&(Yc(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!Z(r)))?Ys(e,me(t),r,i,t):(t==="true-value"?e._trueValue=r:t==="false-value"&&(e._falseValue=r),zs(e,t,r,s))};function zc(e,t,n,r){if(r)return!!(t==="innerHTML"||t==="textContent"||t in e&&qs(t)&&I(n));if(t==="spellcheck"||t==="draggable"||t==="translate"||t==="autocorrect"||t==="sandbox"&&e.tagName==="IFRAME"||t==="form"||t==="list"&&e.tagName==="INPUT"||t==="type"&&e.tagName==="TEXTAREA")return!1;if(t==="width"||t==="height"){let o=e.tagName;if(o==="IMG"||o==="VIDEO"||o==="CANVAS"||o==="SOURCE")return!1}return qs(t)&&Z(n)?!1:t in e}function Yc(e,t){let n=e._def.props;if(!n)return!1;let r=me(t);return Array.isArray(n)?n.some(o=>me(o)===r):Object.keys(n).some(o=>me(o)===r)}var Gc=Q({patchProp:Kc},Oc),Js;function qc(){return Js||(Js=Vs(Gc))}var Zs=((...e)=>{let t=qc().createApp(...e),{mount:n}=t;return t.mount=r=>{let o=Xc(r);if(!o)return;let i=t._component;!I(i)&&!i.render&&!i.template&&(i.template=o.innerHTML),o.nodeType===1&&(o.textContent="");let s=n(o,!1,Jc(o));return o instanceof Element&&(o.removeAttribute("v-cloak"),o.setAttribute("data-v-app","")),s},t});function Jc(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Xc(e){return Z(e)?document.querySelector(e):e}var ta={festival:"\u8282\u5E86",event:"\u4E8B\u4EF6",appointment:"\u9080\u7EA6",class:"\u8BFE\u7A0B",reminder:"\u63D0\u9192",birthday:"\u751F\u65E5",anniversary:"\u7EAA\u5FF5",history:"\u5386\u53F2"};function Zc(e){return Array.from({length:e},(t,n)=>String(n+1))}function To(e){return e?String(e.hour).padStart(2,"0")+":"+String(e.minute).padStart(2,"0"):""}function Qs(e,t){return e.year===t.year&&e.month===t.month&&e.day===t.day}function na(e){if(e.allDay)return"\u5168\u5929";let t=To(e.start.time),n=To(e.end?.time);return e.end&&Qs(e.start.date,e.end.date)&&t&&n?t+"\u2013"+n:e.end&&!Qs(e.start.date,e.end.date)?"\u8DE8\u65E5 \xB7 "+(t||"\u5B9A\u65F6"):t||"\u5B9A\u65F6"}function ea(e){return e.date.year+"\u5E74"+e.date.month+"\u6708"+e.date.day+"\u65E5"+(e.time?" "+To(e.time):"")}function Qc(e,t){let n=e.occurrences.slice(0,t),r=e.occurrences.length-n.length;return D("span",{class:"cc-month-cell__events","aria-hidden":"true"},[...n.map(o=>D("span",{class:"cc-month-event",key:o.event.moduleId+":"+o.event.id,title:o.event.title,"data-module-id":o.event.moduleId,"data-event-kind":o.event.kind},o.event.title)),...r>0?[D("span",{class:"cc-month-event cc-month-event--overflow"},"+"+r)]:[]])}function ed(e,t){return D("button",{key:e.key,type:"button",class:"cc-day-detail__event","data-detail-event-id":e.eventId,"data-module-id":e.moduleId,"data-event-kind":e.kind,"aria-label":"\u67E5\u770B\u4E8B\u4EF6\u8BE6\u60C5\uFF1A"+e.title,onClick:n=>t(e,n)},[D("span",{class:"cc-day-detail__event-mark","aria-hidden":"true"}),D("span",{class:"cc-day-detail__event-content"},[D("span",{class:"cc-day-detail__event-title"},e.title),D("span",{class:"cc-day-detail__event-topline"},[D("span",{class:"cc-day-detail__time"},na(e)),D("span",{class:"cc-day-detail__module"},ta[e.moduleId]??e.moduleId)])]),D("span",{class:"cc-day-detail__event-arrow","aria-hidden":"true"},"\u203A")])}function td(e,t,n){return D("section",{class:"cc-day-detail","aria-label":"\u9009\u4E2D\u65E5\u8BAE\u7A0B","aria-live":"polite",...e?{"data-day-detail-date":e.key}:{}},[D("header",{class:"cc-day-detail__header"},[D("div",{class:"cc-day-detail__heading"},[D("div",{class:"cc-day-detail__eyebrow"},"\u5F53\u65E5\u8BAE\u7A0B"),D("h3",{class:"cc-day-detail__title"},e?e.date.day+"\u65E5 \xB7 "+t:"\u9009\u62E9\u65E5\u671F")]),...e?.isToday?[D("span",{class:"cc-day-detail__today"},"\u4ECA\u5929")]:[],...e&&e.occurrences.length>=4?[D("span",{class:"cc-day-detail__count"},e.occurrences.length+" \u9879")]:[]]),e?.occurrences.length?D("div",{class:"cc-day-detail__events"},e.occurrences.map(r=>ed(r,n))):D("div",{class:"cc-day-detail__empty-state"},e?"\u5F53\u5929\u6682\u65E0\u4E8B\u4EF6":"\u9009\u62E9\u65E5\u671F\u67E5\u770B\u4E8B\u4EF6")])}var ra=Vn({name:"CalendarMonthView",props:{model:{type:Object,required:!0},weekdayLabels:{type:Array,default:()=>[]},maxVisibleOccurrences:{type:Number,default:3},busy:{type:Boolean,default:!1}},emits:{selectDate:e=>!0,clearSelection:()=>!0,previousMonth:()=>!0,nextMonth:()=>!0,previousDay:()=>!0,nextDay:()=>!0,goToday:()=>!0},setup(e,{emit:t}){let n=ht(!1),r=ht(null),o=ht(null),i=null,s=Nt(()=>{let v=[...e.weekdayLabels];return v.length===e.model.columns?v:Zc(e.model.columns)}),a=Nt(()=>{let v=e.model.cells.findIndex(P=>P.isSelected);if(v>=0)return v;let O=e.model.cells.findIndex(P=>P.isToday);return O>=0?O:e.model.cells.findIndex(P=>P.inCurrentMonth)}),c=Nt(()=>Math.floor(Math.max(0,a.value)/e.model.columns)),f=Nt(()=>{let v=a.value;return v<0?"":s.value[v%e.model.columns]??""}),u=Nt(()=>e.model.selectedDay?.occurrences.find(v=>v.key===r.value)),p=()=>{r.value=null;let v=i;i=null,v&&An(()=>v.isConnected&&v.focus())},b=(v,O)=>{i=O.currentTarget,r.value=v.key,An(()=>o.value?.querySelector(".cc-event-sheet__close")?.focus())};Bt(()=>e.model.selectedDay?.key,()=>{r.value=null,i=null});let C=v=>{v.key==="Escape"?(v.stopPropagation(),p()):v.key==="Tab"&&(v.preventDefault(),o.value?.querySelector(".cc-event-sheet__close")?.focus())};return()=>D("section",{class:"cc-calendar-month","aria-label":e.model.year+"-"+e.model.month,"data-expanded":n.value?"true":"false"},[D("header",{class:"cc-calendar-month__header"},[D("div",{class:"cc-calendar-month__month-switcher"},[D("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Previous month",title:"\u4E0A\u4E2A\u6708",onClick:()=>t("previousMonth")},"\u2039"),D("h2",{class:"cc-calendar-month__title"},e.model.year+" \u5E74 "+e.model.month+" \u6708"),D("button",{type:"button",class:"cc-calendar-month__nav",disabled:e.busy,"aria-label":"Next month",title:"\u4E0B\u4E2A\u6708",onClick:()=>t("nextMonth")},"\u203A")]),D("div",{class:"cc-calendar-month__header-actions"},[...e.model.selectedDay?.isToday?[]:[D("button",{type:"button",class:"cc-calendar-month__today-link",disabled:e.busy,"aria-label":"\u8FD4\u56DE\u4E16\u754C\u4ECA\u5929",onClick:()=>t("goToday")},"\u56DE\u4ECA\u5929")]])]),D("div",{class:"cc-calendar-month__body"},[D("section",{class:"cc-calendar-month__calendar","aria-label":"\u65E5\u5386\u7F51\u683C"},[D("div",{class:"cc-calendar-month__weekdays",style:{"--cc-calendar-columns":String(e.model.columns)}},s.value.map((v,O)=>D("span",{key:O,class:"cc-calendar-month__weekday","data-weekday":O},v))),D("div",{class:"cc-calendar-month__grid",id:"cc-calendar-grid",style:{"--cc-calendar-columns":String(e.model.columns)}},e.model.cells.map((v,O)=>D("button",{key:v.key,type:"button",class:["cc-month-cell",{"cc-month-cell--outside":!v.inCurrentMonth,"cc-month-cell--today":v.isToday,"cc-month-cell--selected":v.isSelected,"cc-month-cell--active-week":Math.floor(O/e.model.columns)===c.value}],"data-calendar-date":v.key,"aria-label":v.date.day+"\u65E5\uFF0C"+v.occurrences.length+"\u9879\u4E8B\u4EF6","aria-pressed":v.isSelected?"true":"false",onClick:()=>t("selectDate",v.date)},[D("span",{class:"cc-month-cell__day"},String(v.date.day)),Qc(v,Math.max(0,Math.floor(e.maxVisibleOccurrences)))]))),D("button",{type:"button",class:"cc-calendar-month__fold","aria-controls":"cc-calendar-grid","aria-expanded":n.value?"true":"false",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386 \u2303":"\u5C55\u5F00\u6708\u5386 \u2304")]),td(e.model.selectedDay,f.value,b)]),D("nav",{class:"cc-calendar-month__bottom-nav","aria-label":"\u65E5\u671F\u5FEB\u6377\u5BFC\u822A"},[D("button",{type:"button",disabled:e.busy,"aria-label":"\u524D\u4E00\u5929",onClick:()=>t("previousDay")},"\u2039 \u524D\u4E00\u5929"),D("button",{type:"button",disabled:e.busy,"aria-label":n.value?"\u6536\u8D77\u6708\u5386":"\u5C55\u5F00\u6708\u5386",onClick:()=>{n.value=!n.value}},n.value?"\u6536\u8D77\u6708\u5386":"\u6708\u5386"),D("button",{type:"button",disabled:e.busy,"aria-label":"\u540E\u4E00\u5929",onClick:()=>t("nextDay")},"\u540E\u4E00\u5929 \u203A")]),...u.value?[D("div",{class:"cc-event-sheet",ref:o,role:"dialog","aria-modal":"true","aria-label":"\u4E8B\u4EF6\u8BE6\u60C5",onClick:v=>{v.target===v.currentTarget&&p()},onKeydown:C},[D("article",{class:"cc-event-sheet__card"},[D("header",{class:"cc-event-sheet__header"},[D("span",{},"\u4E8B\u4EF6\u8BE6\u60C5"),D("button",{type:"button",class:"cc-event-sheet__close",onClick:p},"\u8FD4\u56DE\u5217\u8868 \xD7")]),D("div",{class:"cc-event-sheet__content"},[D("h3",{class:"cc-event-sheet__title"},u.value.title),D("dl",{class:"cc-event-sheet__fields"},[D("dt",{},"\u65F6\u95F4"),D("dd",{},na(u.value)),D("dt",{},"\u5F00\u59CB"),D("dd",{},ea(u.value.start)),...u.value.end?[D("dt",{},"\u7ED3\u675F"),D("dd",{},ea(u.value.end))]:[],D("dt",{},"\u7C7B\u522B"),D("dd",{},ta[u.value.moduleId]??u.value.moduleId),...u.value.tags.length?[D("dt",{},"\u6807\u7B7E"),D("dd",{},u.value.tags.join(" \xB7 "))]:[]])])])])]:[]])}});var oa=String.raw`
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
`;var ia=String.raw`
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
`+oa;async function sa(e,t){let n=await t.session.load(),r=lr(n),o=ht(!1),i=null,s=Vn({name:"CalendarMonthRendererRoot",setup(){let f=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.navigateMonths(C)}finally{o.value=!1}}},u=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.goToDate(C),t.onSelectedDateChange?.(C)}finally{o.value=!1}}},p=async C=>{if(!o.value){o.value=!0;try{r.value=await t.session.stepSelectedDate(C);let v=r.value.selectedDay?.date;v&&t.onSelectedDateChange?.(v)}finally{o.value=!1}}},b=()=>{r.value=t.session.clearSelectedDate()};return()=>D(ra,{model:r.value,weekdayLabels:t.weekdayLabels,maxVisibleOccurrences:t.maxVisibleOccurrences,busy:o.value,onPreviousMonth:()=>{f(-1)},onNextMonth:()=>{f(1)},onSelectDate:C=>{u(C)},onPreviousDay:()=>{p(-1)},onNextDay:()=>{p(1)},onGoToday:()=>{u(r.value.today)},onClearSelection:b})}}),a=e.ownerDocument.createElement("style");a.dataset.calendarCoreRenderer="vue-month",a.textContent=ia;let c=e.ownerDocument.createElement("div");return c.dataset.calendarCoreMount="vue-month",e.replaceChildren(a,c),i=Zs(s),i.mount(c),{async refresh(){return r.value=await t.session.load(),r.value},destroy(){i?.unmount(),i=null,e.replaceChildren()}}}var Or="__calendarCoreSillyTavernShellDestroy__",la="calendar-core:shell:button-position:v1",nd=980,Sr=8,rd=4;function od(){try{if(window.parent&&window.parent!==window&&window.parent.document)return window.parent.document}catch{}return document}function aa(e,t,n){return Math.min(Math.max(e,t),Math.max(t,n))}function id(e){try{let t=e.localStorage?.getItem(la);if(!t)return null;let n=JSON.parse(t);return typeof n.left!="number"||typeof n.top!="number"||!Number.isFinite(n.left)||!Number.isFinite(n.top)?null:{left:n.left,top:n.top}}catch{return null}}function sd(e,t){try{e.localStorage?.setItem(la,JSON.stringify(t))}catch{}}function ad(e){let t=e.createElement("style");return t.dataset.calendarCoreShellStyle="month",t.textContent=['[data-calendar-core-shell="button"] {',"  position: fixed;","  left: calc(100vw - 88px);","  top: 32vh;","  z-index: 2147483001;","  display: grid;","  place-items: center;","  width: 68px;","  height: 68px;","  padding: 0;","  border: 1px solid rgba(147, 112, 51, 0.45);","  border-radius: 20px;","  background: rgba(233, 211, 171, 0.86);","  color: #4c3820;","  font: inherit;","  font-size: 32px;","  line-height: 1;","  box-shadow: 0 14px 30px rgba(68, 44, 20, 0.18);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  cursor: grab;","  touch-action: none;","  user-select: none;","  transition: box-shadow 140ms ease, transform 140ms ease;","}","",'[data-calendar-core-shell="button"]:hover {',"  transform: translateY(-1px);","  box-shadow: 0 18px 36px rgba(68, 44, 20, 0.24);","}","",'[data-calendar-core-shell="button"][data-dragging="true"] {',"  cursor: grabbing;","  transform: none;","}","",'[data-calendar-core-shell="panel"] {',"  position: fixed;","  left: 2vw;","  top: 2vh;","  z-index: 2147483000;","  width: min(1560px, calc(100vw - 40px));","  height: min(960px, calc(100dvh - 40px));","  padding: 16px;","  overflow: hidden;","  border: 1px solid rgba(155, 128, 84, 0.22);","  border-radius: 28px;","  background: rgba(242, 234, 220, 0.94);","  color: #2c241b;","  box-shadow: 0 28px 60px rgba(56, 38, 20, 0.24);","  backdrop-filter: blur(10px);","  -webkit-backdrop-filter: blur(10px);","  box-sizing: border-box;","}","",'[data-calendar-core-shell="panel"][hidden] {',"  display: none;","}","",'[data-calendar-core-shell="chrome"] {',"  height: 48px;","  display: flex;","  align-items: center;","  gap: 12px;","  padding: 0 4px 12px 6px;","  cursor: move;","  user-select: none;","  box-sizing: border-box;","}","",'[data-calendar-core-shell="chrome-title"] {',"  min-width: 0;","  flex: 1;","  color: #3b2d1f;",'  font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',"  font-size: 15px;","  font-weight: 800;","  letter-spacing: 0.02em;","}","",'[data-calendar-core-shell="close"] {',"  width: 34px;","  height: 34px;","  padding: 0;","  border: 1px solid rgba(155, 128, 84, 0.2);","  border-radius: 10px;","  background: rgba(255, 252, 246, 0.72);","  color: #6e4510;","  font: inherit;","  font-size: 20px;","  line-height: 1;","  cursor: pointer;","}","",'[data-calendar-core-shell="close"]:hover {',"  background: linear-gradient(180deg, #fff7ea, #f4dfad);","}","",'[data-calendar-core-shell="frame"] {',"  display: block;","  width: 100%;","  height: calc(100% - 48px);","  border: 1px solid rgba(155, 128, 84, 0.14);","  border-radius: 22px;","  background: rgba(255, 252, 246, 0.96);","  box-sizing: border-box;","}","","@media (max-width: 980px) {",'  [data-calendar-core-shell="button"] {',"    width: 52px;","    height: 52px;","    border-radius: 16px;","    font-size: 23px;","  }","",'  [data-calendar-core-shell="button"]:hover {',"    transform: none;","  }","",'  [data-calendar-core-shell="panel"] {',"    inset: 0;","    width: 100vw;","    height: 100dvh;","    padding: 0;","    border: 0;","    border-radius: 0;","    background: #f7f0e5;","  }","",'  [data-calendar-core-shell="chrome"] {',"    position: relative;","    height: 0;","    padding: 0;","    border: 0;","    background: transparent;","    cursor: default;","    z-index: 5;","    pointer-events: none;","  }","",'  [data-calendar-core-shell="chrome-title"] {',"    display: none;","  }","",'  [data-calendar-core-shell="close"] {',"    position: absolute;","    top: 7px;","    right: 8px;","    width: 38px;","    height: 38px;","    pointer-events: auto;","    background: #fcf9f2;","  }","",'  [data-calendar-core-shell="frame"] {',"    height: 100%;","    border: 0;","    border-radius: 0;","  }","}"].join(`
`),t}function ld(){return["<!doctype html>","<html>","<head>",'  <meta charset="utf-8">','  <meta name="viewport" content="width=device-width,initial-scale=1">',"  <style>","    :root { color-scheme: light; }","    html, body { width: 100%; height: 100%; min-height: 100%; }","    body {","      margin: 0;","      overflow: hidden;","      background:","        radial-gradient(circle at 10% 0%, rgba(239,209,137,0.12), transparent 34%),","        linear-gradient(180deg, #fffdf8, #f8f0e5);","      color: #2c241b;",'      font-family: "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;',"    }","  </style>","</head>","<body></body>","</html>"].join(`
`)}function cd(e){return e.contentDocument?.readyState==="complete"?Promise.resolve():new Promise(t=>{e.addEventListener("load",()=>t(),{once:!0})})}async function ca(e){let t=e.pageDocument??od(),n=e.lifecycleWindow??window,r=t.defaultView,o=t.defaultView??n;r?.[Or]?.();let i=ad(t),s=t.createElement("button");s.type="button",s.dataset.calendarCoreShell="button",s.textContent=e.buttonLabel??"\u{1F4C5}",s.title=e.buttonTitle??"\u6253\u5F00\u6708\u5386",s.setAttribute("aria-label",s.title);let a=t.createElement("section");a.dataset.calendarCoreShell="panel",a.setAttribute("aria-label","\u6708\u5386\u60AC\u6D6E\u9762\u677F");let c=t.createElement("div");c.dataset.calendarCoreShell="chrome";let f=t.createElement("div");f.dataset.calendarCoreShell="chrome-title",f.textContent="\u6708\u5386";let u=t.createElement("button");u.type="button",u.dataset.calendarCoreShell="close",u.textContent="\xD7",u.title="\u5173\u95ED",u.setAttribute("aria-label","\u5173\u95ED\u6708\u5386");let p=t.createElement("iframe");p.dataset.calendarCoreShell="frame",p.title="Calendar",p.setAttribute("frameborder","0"),p.srcdoc=ld(),c.append(f,u),a.append(c,p);let b=e.initiallyOpen??!1,C=null,v=!1,O=!1,P=null,U=null,M=null,$=()=>({width:o.innerWidth||t.documentElement.clientWidth||0,height:o.innerHeight||t.documentElement.clientHeight||0}),de=()=>$().width>nd,S=(k,J,Te)=>{let Me=$(),lt=k.getBoundingClientRect(),Dt=lt.width||k.offsetWidth,Jt=lt.height||k.offsetHeight;return{left:aa(J,Sr,Me.width-Dt-Sr),top:aa(Te,Sr,Me.height-Jt-Sr)}},ee=k=>{if(!k){s.style.left="",s.style.top="";return}let J=S(s,k.left,k.top);s.style.left=`${J.left}px`,s.style.top=`${J.top}px`},ue=()=>{if(!de()){a.style.left="",a.style.top="",M=null;return}let k=$(),J=Math.min(1560,Math.max(0,k.width-40)),Te=Math.min(960,Math.max(0,k.height-40));M={left:Math.round((k.width-J)/2),top:Math.round((k.height-Te)/2)},a.style.left=`${M.left}px`,a.style.top=`${M.top}px`},fe=()=>{a.hidden=!b,s.hidden=b,s.setAttribute("aria-expanded",b?"true":"false"),s.title=b?"\u5173\u95ED\u6708\u5386":e.buttonTitle??"\u6253\u5F00\u6708\u5386"},ve=()=>{v||(b=!0,de()&&!M&&ue(),fe())},De=()=>{v||(b=!1,fe())},He=()=>{b?De():ve()},Xe=()=>{if(O){O=!1;return}He()},yt=k=>{if(v||b||k.button!==0)return;let J=s.getBoundingClientRect();P={pointerId:k.pointerId,startX:k.clientX,startY:k.clientY,left:J.left,top:J.top,moved:!1},s.dataset.dragging="true",s.setPointerCapture?.(k.pointerId)},Yt=k=>{if(P&&k.pointerId===P.pointerId){let J=k.clientX-P.startX,Te=k.clientY-P.startY;Math.hypot(J,Te)>rd&&(P.moved=!0);let Me=S(s,P.left+J,P.top+Te);s.style.left=`${Me.left}px`,s.style.top=`${Me.top}px`,P.moved&&k.preventDefault();return}if(U&&k.pointerId===U.pointerId&&de()){let J=k.clientX-U.startX,Te=k.clientY-U.startY,Me=S(a,U.left+J,U.top+Te);M=Me,a.style.left=`${Me.left}px`,a.style.top=`${Me.top}px`,k.preventDefault()}},Gt=k=>{if(!(!P||k.pointerId!==P.pointerId)){if(P.moved){let J=s.getBoundingClientRect(),Te={left:J.left,top:J.top};sd(o,Te),O=!0}P=null,delete s.dataset.dragging}},ae=k=>{if(v||!b||!de()||k.button!==0||k.target?.closest("button"))return;let J=a.getBoundingClientRect();U={pointerId:k.pointerId,startX:k.clientX,startY:k.clientY,left:J.left,top:J.top,moved:!1},c.setPointerCapture?.(k.pointerId),k.preventDefault()},Y=k=>{Gt(k),U&&k.pointerId===U.pointerId&&(U=null)},B=()=>{let k=s.getBoundingClientRect();if(s.style.left&&s.style.top&&ee({left:k.left,top:k.top}),!de()){M=null,a.style.left="",a.style.top="";return}M?(M=S(a,M.left,M.top),a.style.left=`${M.left}px`,a.style.top=`${M.top}px`):ue()},Oe=k=>{k.key==="Escape"&&b&&De()};s.addEventListener("click",Xe),s.addEventListener("pointerdown",yt),c.addEventListener("pointerdown",ae),u.addEventListener("click",De),t.addEventListener("pointermove",Yt),t.addEventListener("pointerup",Y),t.addEventListener("pointercancel",Y),t.addEventListener("keydown",Oe),o.addEventListener("resize",B),t.head.append(i),t.body.append(a,s),ee(id(o)),ue(),fe();let qt=cd(p),Se=()=>{v||(v=!0,C?.destroy(),C=null,s.removeEventListener("click",Xe),s.removeEventListener("pointerdown",yt),c.removeEventListener("pointerdown",ae),u.removeEventListener("click",De),t.removeEventListener("pointermove",Yt),t.removeEventListener("pointerup",Y),t.removeEventListener("pointercancel",Y),t.removeEventListener("keydown",Oe),o.removeEventListener("resize",B),n.removeEventListener("pagehide",Se),s.remove(),a.remove(),i.remove(),r?.[Or]===Se&&delete r[Or])};if(n.addEventListener("pagehide",Se),r&&(r[Or]=Se),await qt,v)throw new Error("Calendar shell was destroyed before its iframe loaded");let Ze=p.contentDocument;if(!Ze?.body)throw Se(),new Error("Calendar shell iframe document is unavailable");return C=await sa(Ze.body,{session:e.session,weekdayLabels:e.weekdayLabels,maxVisibleOccurrences:e.maxVisibleOccurrences,onSelectedDateChange:e.onSelectedDateChange}),{open:ve,close:De,toggle:He,isOpen:()=>b,refresh:()=>{if(!C)throw new Error("Calendar renderer is not mounted");return C.refresh()},destroy:Se}}async function dd(){window.CalendarCoreRuntime?.destroy();let e=Ro(),t=new Jn({runtime:e,timePath:"calendar.now"});t.registerModule({adapter:Uo,path:"calendar.modules.event",parser:jo}),t.registerModule({adapter:Bo,path:"calendar.modules.appointment",parser:Wo}),t.registerModule({adapter:Ko,path:"calendar.modules.birthday",parser:zo}),t.registerModule({adapter:Yo,path:"calendar.modules.anniversary",parser:Go}),t.registerModule({adapter:qo,path:"calendar.modules.class",parser:Jo}),t.registerModule({adapter:Xo,path:"calendar.modules.reminder",parser:Zo}),t.registerModule({adapter:Qo,path:"calendar.modules.history",parser:ei}),t.registerModule({adapter:Fo,path:"calendar.modules.festival",parser:Ho});let n=t.reader.readLatest(),r=_i(St(n,"calendar.weekAnchor"));if(!r)throw new Error("CalendarCore requires a valid calendar.weekAnchor in latest message variables");let o=await t.getCurrentDate(),i=await t.createMonthSession({weekAnchor:r,selectedDate:o}),s=await ca({session:i,buttonLabel:"\u{1F4C5}",buttonTitle:"Calendar",weekdayLabels:["\u65E5","\u4E00","\u4E8C","\u4E09","\u56DB","\u4E94","\u516D"]});window.CalendarCoreRuntime={destroy:()=>s.destroy(),refresh:()=>s.refresh()}}dd().catch(e=>{console.error("[CalendarCore] Failed to start",e)});})();
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

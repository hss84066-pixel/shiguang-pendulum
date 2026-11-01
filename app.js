/* ====== 可修改設定 ====== */
const CONFIG = {
  brand: "拾光星旅程",
  lineUrl: "https://lin.ee/P7Ft3BoM",      // LINE 官方帳號連結
  sheetUrl: "",                            // Google 試算表的 Apps Script 網址（貼上後名單會自動寫入）
  reportPrice: "NT$ 399",                  // 完整能量報告售價
  teacherPin: "8888",                      // 老師專區密碼（網址加 #teacher 進入）
  codeSalt: "shiguang-star-2026"           // 解鎖碼的加密字串，改了舊的解鎖碼會失效
};

/* ====== 工具 ====== */
const $ = s => document.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
function cyrb53(str,seed=0){let h1=0xdeadbeef^seed,h2=0x41c6ce57^seed;for(let i=0;i<str.length;i++){const ch=str.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677);}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return 4294967296*(2097151&h2)+(h1>>>0);}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function todayStr(){const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k)||"null");localStorage.setItem(k,JSON.stringify(v));}catch(e){return null;}}
function toast(msg){const t=$("#toast");t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2000);}
async function copy(text,ok){try{await navigator.clipboard.writeText(text);toast(ok);return true;}catch(e){toast("請長按文字手動複製");return false;}}
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function logLead(data){
  if(!CONFIG.sheetUrl)return;
  try{fetch(CONFIG.sheetUrl,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(data)}).catch(()=>{});}catch(e){}
}
function genCode(name,birth){return cyrb53(CONFIG.codeSalt+"|"+name.trim()+"|"+birth).toString(36).toUpperCase().padStart(6,"0").slice(-6);}

document.querySelectorAll(".js-line").forEach(a=>a.href=CONFIG.lineUrl);
$("#brandName").textContent=CONFIG.brand;

/* ====== 星空 ====== */
(function stars(){
  const cv=$("#stars"),ctx=cv.getContext("2d");let W,H,pts=[];
  function size(){const dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    pts=Array.from({length:Math.round(W*H/5200)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.2,p:Math.random()*6.28,s:Math.random()*.02+.004,g:Math.random()<.12}));}
  function draw(){ctx.clearRect(0,0,W,H);for(const s of pts){s.p+=s.s;const a=.35+.65*Math.abs(Math.sin(s.p));ctx.fillStyle=s.g?`rgba(244,223,166,${a})`:`rgba(237,232,219,${a*.8})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.28);ctx.fill();}
    if(!reduceMotion)requestAnimationFrame(draw);}
  size();addEventListener("resize",()=>{size();if(reduceMotion)draw();});draw();
})();

/* ====== 圖形 ====== */
function pendulumSVG(id,big){
  return `<svg class="pend-svg ${big?"big":""}" viewBox="0 0 200 260" aria-hidden="true">
  <defs>
    <linearGradient id="gch${id}" x1="0" x2="1"><stop offset="0" stop-color="#8a6a2c"/><stop offset=".5" stop-color="#F4DFA6"/><stop offset="1" stop-color="#8a6a2c"/></linearGradient>
    <linearGradient id="gcr${id}" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#F4DFA6"/><stop offset=".45" stop-color="#D9B46A"/><stop offset="1" stop-color="#6b4f1d"/></linearGradient>
    <radialGradient id="glow${id}"><stop offset="0" stop-color="#F4DFA6" stop-opacity=".55"/><stop offset="1" stop-color="#F4DFA6" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="100" cy="8" r="5" fill="#D9B46A"/>
  <ellipse class="aura" cx="100" cy="246" rx="70" ry="9" fill="none" stroke="#D9B46A" stroke-opacity=".25"/>
  <g class="swing">
    <line x1="100" y1="8" x2="100" y2="168" stroke="url(#gch${id})" stroke-width="1.6" stroke-dasharray="3 2"/>
    <circle class="bobglow" cx="100" cy="196" r="38" fill="url(#glow${id})"/>
    <g class="bob">
      <circle cx="100" cy="170" r="4" fill="none" stroke="#D9B46A" stroke-width="1.6"/>
      <polygon points="100,174 116,190 100,236 84,190" fill="url(#gcr${id})"/>
      <polygon points="100,174 116,190 100,196 84,190" fill="#F4DFA6" opacity=".7"/>
      <line x1="100" y1="196" x2="100" y2="236" stroke="#6b4f1d" stroke-opacity=".5"/>
    </g>
  </g>
</svg>`;
}
function cardBackSVG(id){
  let stars="";const r=mulberry32(7);
  for(let i=0;i<26;i++){stars+=`<circle cx="${(24+r()*152).toFixed(1)}" cy="${(24+r()*292).toFixed(1)}" r="${(r()*1.4+.4).toFixed(2)}" fill="#F4DFA6" opacity="${(.3+r()*.6).toFixed(2)}"/>`;}
  return `<svg viewBox="0 0 200 340" aria-hidden="true"><defs><linearGradient id="cb${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#232a5c"/><stop offset="1" stop-color="#100f2c"/></linearGradient></defs>
  <rect x="2" y="2" width="196" height="336" rx="14" fill="url(#cb${id})" stroke="#D9B46A" stroke-width="2"/>
  <rect x="12" y="12" width="176" height="316" rx="9" fill="none" stroke="#D9B46A" stroke-opacity=".45"/>${stars}
  <circle cx="100" cy="170" r="46" fill="none" stroke="#D9B46A" stroke-opacity=".7"/>
  <circle cx="100" cy="170" r="34" fill="none" stroke="#D9B46A" stroke-opacity=".35"/>
  <path d="M100 128 L108 162 L142 170 L108 178 L100 212 L92 178 L58 170 L92 162 Z" fill="#D9B46A" opacity=".9"/>
  <circle cx="100" cy="170" r="6" fill="#0A0E22"/></svg>`;
}
function suitEmblem(suit,col){
  switch(suit){
    case "wands": return `<g stroke="${col}" stroke-width="5" stroke-linecap="round" fill="none"><line x1="100" y1="120" x2="100" y2="230"/><path d="M100 120 q-14 -18 0 -34 q14 16 0 34" fill="${col}" stroke="none"/><line x1="86" y1="150" x2="78" y2="140"/><line x1="114" y1="175" x2="122" y2="165"/><line x1="86" y1="200" x2="78" y2="190"/></g>`;
    case "cups": return `<g fill="none" stroke="${col}" stroke-width="4"><path d="M64 120 h72 q0 58 -36 62 q-36 -4 -36 -62 z" fill="${col}" fill-opacity=".18"/><line x1="100" y1="182" x2="100" y2="214"/><path d="M76 222 h48"/><path d="M80 134 q20 10 40 0" stroke-opacity=".6"/></g>`;
    case "swords": return `<g stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M100 96 L108 112 L108 196 L92 196 L92 112 Z" fill="${col}" fill-opacity=".2"/><line x1="72" y1="198" x2="128" y2="198"/><line x1="100" y1="200" x2="100" y2="230"/><circle cx="100" cy="236" r="6"/></g>`;
    default: return `<g fill="none" stroke="${col}" stroke-width="3.5"><circle cx="100" cy="165" r="50" fill="${col}" fill-opacity=".14"/><circle cx="100" cy="165" r="40"/><path d="M100 128 L122 194 L66 152 L134 152 L78 194 Z"/></g>`;
  }
}
function majorEmblem(i,col){
  const k=i%4;
  if(k===0) return `<g fill="none" stroke="${col}" stroke-width="3"><circle cx="100" cy="165" r="34" fill="${col}" fill-opacity=".2"/>${Array.from({length:12},(_,j)=>{const a=j*Math.PI/6;return `<line x1="${(100+44*Math.cos(a)).toFixed(1)}" y1="${(165+44*Math.sin(a)).toFixed(1)}" x2="${(100+60*Math.cos(a)).toFixed(1)}" y2="${(165+60*Math.sin(a)).toFixed(1)}"/>`;}).join("")}</g>`;
  if(k===1) return `<g fill="none" stroke="${col}" stroke-width="3"><path d="M120 115 a52 52 0 1 0 0 100 a40 40 0 1 1 0 -100 z" fill="${col}" fill-opacity=".2"/><circle cx="132" cy="140" r="3" fill="${col}"/><circle cx="140" cy="180" r="2" fill="${col}"/></g>`;
  if(k===2) return `<g fill="none" stroke="${col}" stroke-width="3"><path d="M100 105 L114 150 L160 165 L114 180 L100 225 L86 180 L40 165 L86 150 Z" fill="${col}" fill-opacity=".2"/><circle cx="100" cy="165" r="12"/></g>`;
  return `<g fill="none" stroke="${col}" stroke-width="3"><path d="M100 110 L150 200 L50 200 Z" fill="${col}" fill-opacity=".15"/><circle cx="100" cy="170" r="16"/><circle cx="100" cy="170" r="4" fill="${col}"/></g>`;
}
function cardFaceSVG(card){
  const col=card.major?"#F4DFA6":SUITS[card.suit].color;
  const emblem=card.major?majorEmblem(+card.id.slice(1),col):suitEmblem(card.suit,col);
  const top=card.major?card.num:SUITS[card.suit].name+"・"+card.num;
  return `<svg viewBox="0 0 200 340" role="img" aria-label="${esc(card.name)}"><defs><linearGradient id="cf${card.id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2654"/><stop offset="1" stop-color="#0e1130"/></linearGradient></defs>
  <rect x="2" y="2" width="196" height="336" rx="14" fill="url(#cf${card.id})" stroke="#D9B46A" stroke-width="2"/>
  <rect x="12" y="12" width="176" height="316" rx="9" fill="none" stroke="#D9B46A" stroke-opacity=".4"/>
  <text x="100" y="52" text-anchor="middle" font-family="Cormorant Garamond,Noto Serif TC,serif" font-size="${card.major?30:18}" fill="#F4DFA6">${esc(top)}</text>
  <line x1="60" y1="66" x2="140" y2="66" stroke="#D9B46A" stroke-opacity=".5"/>
  ${emblem}
  <line x1="60" y1="262" x2="140" y2="262" stroke="#D9B46A" stroke-opacity=".5"/>
  <text x="100" y="298" text-anchor="middle" font-family="Noto Serif TC,serif" font-size="24" font-weight="700" fill="#EDE8DB">${esc(card.name)}</text></svg>`;
}
$("#homePend").innerHTML=pendulumSVG("h",false);
$("#homeTarot").innerHTML=`<svg viewBox="0 0 260 200" aria-hidden="true"><g transform="translate(40 30) rotate(-14 50 85) scale(.5)">${cardBackSVG("h1").replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(115 22) rotate(10 50 85) scale(.5)">${cardBackSVG("h2").replace(/<\/?svg[^>]*>/g,"")}</g><g transform="translate(78 14) scale(.52)">${cardBackSVG("h3").replace(/<\/?svg[^>]*>/g,"")}</g></svg>`;
$("#pendIntro").innerHTML=pendulumSVG("i",false);
$("#pendScan").innerHTML=pendulumSVG("s",true);

/* ====== 路由 ====== */
const VIEWS=["home","pendulum","tarot","teacher"];
function route(){
  const h=(location.hash||"#home").slice(1);
  const v=VIEWS.includes(h)?h:"home";
  VIEWS.forEach(x=>$("#v-"+x).hidden=(x!==v));
  if(v==="pendulum"&&$("#p-scan").hidden&&$("#p-result").hidden)showP("intro");
  if(v==="tarot"&&!tarotBusy)showT("intro");
  scrollTo(0,0);
}
addEventListener("hashchange",route);

/* ====== 個人資料 ====== */
const profile=store("sg-profile")||{};
function saveProfile(p){Object.assign(profile,p);store("sg-profile",profile);}
if(profile.name){$("#pName").value=profile.name;$("#tName").value=profile.name;}
if(profile.email){$("#pEmail").value=profile.email;$("#tEmail").value=profile.email;}
if(profile.birth){$("#pBirth").value=profile.birth;}
$("#pBirth").max=todayStr();$("#cBirth").max=todayStr();

/* =========================================================
   靈擺脈輪測驗
   ========================================================= */
function hawkinsName(s){if(s>=700)return"開悟";let n=HAWKINS[0][1];for(const [v,l] of HAWKINS){if(v<=s&&l)n=l;}return n;}
function level(s){if(s<100)return{cls:"severe",label:"嚴重失衡"};if(s<200)return{cls:"low",label:"失衡"};if(s<350)return{cls:"mid",label:"啟動中"};if(s<500)return{cls:"ok",label:"平衡"};return{cls:"high",label:"高頻共振"};}
function lvlIdx(s){return s<200?0:s<500?1:2;}
function moneyLevel(s){let r=MONEY_LEVELS[0];for(const m of MONEY_LEVELS)if(s>=m.min)r=m;return r;}
function showP(id){["intro","scan","result"].forEach(s=>$("#p-"+s).hidden=(s!==id));scrollTo(0,0);}

/* 主題快選 */
$("#pChips").innerHTML=TOPICS.map(t=>`<button type="button" class="chip-btn" data-topic="${t.k}" aria-pressed="false">${t.label}</button>`).join("");
$("#pChips").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(!b)return;
  const on=b.getAttribute("aria-pressed")!=="true";
  $("#pChips").querySelectorAll("[data-topic]").forEach(x=>x.setAttribute("aria-pressed","false"));
  b.setAttribute("aria-pressed",on?"true":"false");
  if(on&&!$("#pQ").value.trim()){const t=TOPICS.find(t=>t.k===b.dataset.topic);$("#pQ").placeholder="想改善的"+t.label+"：可以再補充細節";}
});
function pickedTopic(){const b=$("#pChips [aria-pressed=true]");return b?b.dataset.topic:null;}

function compute(name,birth){
  const date=todayStr();
  const rnd=mulberry32(cyrb53(name.trim()+"|"+birth+"|"+date));
  const scores=CHAKRAS.map(()=>{const z=(rnd()+rnd())/2;let s=Math.round(40+z*600);if(rnd()<0.05)s=Math.min(980,s+220);return s;});
  const [root,sacral,solar,heart,throat]=scores;
  let money=Math.round(root*.4+solar*.3+heart*.15+throat*.15+(rnd()-.5)*120);
  money=Math.max(20,Math.min(990,money));
  const avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
  return {name:name.trim(),birth,date,scores,money,avg};
}

$("#pForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#pName").value.trim(),birth=$("#pBirth").value,email=$("#pEmail").value.trim(),q=$("#pQ").value.trim();
  const err=$("#pErr");
  if(!name){err.textContent="請輸入姓名，靈擺需要知道要感應誰";$("#pName").focus();return;}
  if(!birth||birth>todayStr()||birth<"1920-01-01"){err.textContent="請選擇正確的出生年月日";$("#pBirth").focus();return;}
  if(!EMAIL_RE.test(email)){err.textContent="請輸入正確的 Email，結果備份會寄到這裡";$("#pEmail").focus();return;}
  err.textContent="";
  saveProfile({name,birth,email});
  const d=compute(name,birth);
  d.email=email;d.question=q;d.topic=pickedTopic();
  runScan(d);
});

function runScan(data){
  showP("scan");
  const row=$("#scanRow");
  row.innerHTML=[...CHAKRAS,MONEY].map(c=>`<i style="--c:${c.c}" class="${c.k==="money"?"money":""}" title="${c.name}"></i>`).join("");
  const dots=[...row.children];
  const swing=$("#pendScan .swing"),bob=$("#pendScan .bob"),glow=$("#pendScan .bobglow"),aura=$("#pendScan .aura");
  const steps=[...CHAKRAS.map(c=>"感應 "+c.name+"…"),"感應 金錢能量…"];
  const stepMs=reduceMotion?180:820,lead=reduceMotion?200:900,total=lead+steps.length*stepMs+500;
  const t0=performance.now();let lastStep=-1;
  function frame(now){
    const t=now-t0;
    if(!reduceMotion){
      const amp=Math.min(1,t/1400)*(t<lead+steps.length*stepMs?1:Math.max(0,1-(t-lead-steps.length*stepMs)/500));
      const w=t*0.0062,on=t>lead?1:0;
      swing.setAttribute("transform",`rotate(${(26*amp*Math.sin(w)).toFixed(2)} 100 8)`);
      bob.setAttribute("transform",`translate(100 205) scale(${(1+0.08*Math.cos(w)*on).toFixed(3)}) translate(-100 -205)`);
      glow.setAttribute("opacity",(.55+.45*Math.abs(Math.sin(t*0.004))).toFixed(2));
      aura.setAttribute("rx",(40+30*amp).toFixed(1));
    }
    const step=Math.floor((t-lead)/stepMs);
    if(t<lead)$("#scanStatus").textContent="靈擺校準中…";
    else if(step<steps.length&&step!==lastStep){lastStep=step;$("#scanStatus").textContent=steps[step];dots[step].classList.add("on");}
    else if(step>=steps.length)$("#scanStatus").textContent="感應完成";
    if(t<total)requestAnimationFrame(frame);else renderResult(data);
  }
  requestAnimationFrame(frame);
}

function questionContext(d,all){
  const byK=Object.fromEntries(all.map(c=>[c.k,c]));
  let topic=d.topic?TOPICS.find(t=>t.k===d.topic):TOPICS.find(t=>t.re.test(d.question||""));
  const ch=all.slice(0,7);
  let keys=topic?topic.keys.map(k=>byK[k]):[...ch].sort((a,b)=>a.s-b.s).slice(0,2);
  const weak=keys[0].s<=keys[1].s?keys[0]:keys[1];
  return {topic,keys,weak,isMoney:topic&&topic.k==="money"};
}
function questionShort(d,all){
  const {keys,weak,isMoney}=questionContext(d,all);
  let t=`跟這件事最相關的是<b>${keys[0].name}</b>（${keys[0].s}）和<b>${keys[1].name}</b>（${keys[1].s}）`;
  if(isMoney)t+=`，再加上你的<b>金錢能量</b>（${d.money}）`;
  t+="。";
  if(weak.s<200)t+=`${weak.name}今天落在失衡區，這正是你在這件事上卡住的地方：${weak.signs[0]}。`;
  else t+="兩個脈輪都在 200 以上，這件事的能量是支持你的，關鍵在行動的節奏。";
  t+=`先從「${weak.todo[0]}」開始。完整的深度解答在下方的完整能量報告裡。`;
  return t;
}
function questionDeep(d,all){
  const {keys,weak}=questionContext(d,all);
  const strong=keys[0]===weak?keys[1]:keys[0];
  return `<div class="blk"><h4>能量現況</h4><p>${strong.name}（${strong.s}・${hawkinsName(strong.s)}）：${strong.deep[lvlIdx(strong.s)]}</p></div>
  <div class="blk"><h4>真正的卡點</h4><p>${weak.name}（${weak.s}・${hawkinsName(weak.s)}）：${weak.deep[lvlIdx(weak.s)]}</p></div>
  <div class="blk"><h4>接下來 7 天這樣做</h4><ol>${weak.practices.slice(0,3).map(p=>`<li>${p}</li>`).join("")}<li>${strong.practices[0]}，把已經有的力量用起來</li></ol></div>
  <div class="tool"><div><h4>靈擺調頻・提升頻率</h4><p>${weak.pend}</p></div><div><h4>臼井靈氣・平衡狀態</h4><p>${weak.reiki}</p></div></div>`;
}

function unlockKey(d){return d.name+"|"+d.birth;}
function isUnlocked(d){const u=store("sg-unlock")||[];return u.includes(unlockKey(d));}

function renderReport(d,all){
  const el=$("#report");
  if(!isUnlocked(d)){
    const msg=`我要購買完整能量報告｜姓名：${d.name}｜生日：${d.birth}`;
    el.innerHTML=`<div class="eyebrow">完整能量報告</div>
      <h2>你的專屬完整能量報告</h2>
      <ul class="report-list">
        <li><b>七輪逐一深度解讀</b>每個脈輪現在的狀態與原因</li>
        <li><b>你的問題深度解答</b>能量現況、真正卡點、7 天行動</li>
        <li><b>21 天能量調頻練習表</b>依你的弱項排好每天一件事</li>
        <li><b>金錢能量突破計畫</b>找出錢留不住、進不來的原因</li>
      </ul>
      <div class="blur-preview"><div class="fake">海底輪：你的海底輪目前處在收縮狀態，身體像一直開著警報，對未來與金錢的不確定讓你很難真正放鬆……<br>臍輪：情緒可能被壓在心裡，或對很多事情提不起勁……<br>第 1 天：赤腳踩地 10 分鐘　第 2 天：寫下三件讓你有安全感的事……</div><div class="lock">🔒 輸入解鎖碼即可閱讀</div></div>
      <div class="cta">
        <div><span class="care-meta">一次購買・永久解鎖</span><div class="price">${esc(CONFIG.reportPrice)}</div></div>
        <a class="btn" id="buyBtn" href="${CONFIG.lineUrl}" target="_blank" rel="noopener">加 LINE 購買解鎖碼</a>
        <p class="care-meta">點按鈕會自動複製下面這段訊息，貼到 LINE 傳給老師，付款後就會收到你的專屬解鎖碼：</p>
        <div class="buy-msg">${esc(msg)}</div>
      </div>
      <form id="unlockForm" class="stack" novalidate>
        <label for="unlockCode">已經有解鎖碼了？</label>
        <div class="unlock-row"><input id="unlockCode" maxlength="6" autocomplete="off" placeholder="6 碼"><button class="btn" type="submit" style="padding:12px 18px">解鎖</button></div>
        <p class="err" id="unlockErr" role="alert"></p>
      </form>`;
    $("#buyBtn").addEventListener("click",()=>{try{navigator.clipboard.writeText(msg).then(()=>toast("已複製訊息，貼到 LINE 傳給老師"),()=>{});}catch(e){}});
    $("#unlockForm").addEventListener("submit",ev=>{
      ev.preventDefault();
      const code=$("#unlockCode").value.trim().toUpperCase();
      if(code===genCode(d.name,d.birth)){
        const u=store("sg-unlock")||[];u.push(unlockKey(d));store("sg-unlock",u);
        logLead({type:"報告解鎖",name:d.name,email:d.email,birth:d.birth,question:d.question,summary:"已解鎖完整報告"});
        toast("解鎖成功");renderReport(d,all);
      }else{$("#unlockErr").textContent="解鎖碼不正確。請確認姓名、生日和購買時提供的一樣。";}
    });
    return;
  }
  const ch=all.slice(0,7);
  const sorted=[...ch].sort((a,b)=>a.s-b.s);
  const weeks=[{t:"第一週・清理",c:sorted[0]},{t:"第二週・啟動",c:sorted[1]},{t:"第三週・擴展金錢能量",c:MONEY}];
  const M=moneyLevel(d.money);
  el.innerHTML=`<div class="eyebrow">完整能量報告・已解鎖</div>
    <h2>${esc(d.name)} 的完整能量報告</h2>
    <h3>七輪逐一深度解讀</h3>
    ${ch.map(c=>`<div class="care" style="--c:${c.c}"><div class="care-head"><h3>${c.name}｜${c.s}・${hawkinsName(c.s)}</h3><span class="chip ${level(c.s).cls}">${level(c.s).label}</span></div><p>${c.deep[lvlIdx(c.s)]}</p></div>`).join("")}
    ${d.question?`<h3>你的問題深度解答</h3><div class="qbox"><small>你的提問</small>${esc(d.question)}</div>${questionDeep(d,all)}`:""}
    <h3>21 天能量調頻練習表</h3>
    <p class="care-meta">每天一件事，做完打個勾。三週後再回來測一次，看看分數的變化。</p>
    ${weeks.map((w,wi)=>`<div class="plan-week"><h4>${w.t}｜${w.c.name}</h4><div class="plan">${w.c.practices.map((p,i)=>`<div class="day" style="--c:${w.c.c}"><b>${wi*7+i+1}</b>${p}</div>`).join("")}</div></div>`).join("")}
    <h3>金錢能量突破計畫</h3>
    <div class="care" style="--c:var(--gold)"><div class="care-head"><h3>${M.label}｜${d.money}</h3></div><p>${M.deep}</p>
      <div class="blk"><h4>突破三步驟</h4><ol>${M.todo.map(t=>`<li>${t}</li>`).join("")}<li>每週做一次海底輪與太陽輪的靈擺調頻，穩住賺錢與收錢的能量</li></ol></div></div>`;
}

function renderResult(d){
  showP("result");
  const all=[...CHAKRAS.map((c,i)=>({...c,s:d.scores[i]})),{...MONEY,s:d.money}];
  const ch=all.slice(0,7);
  const strongest=ch.reduce((a,b)=>b.s>a.s?b:a),weakest=ch.reduce((a,b)=>b.s<a.s?b:a);

  $("#shareCard").innerHTML=`
    <div class="share-head">
      <div><div class="big-cap">靈擺能量卡</div><div class="share-name">${esc(d.name)}</div></div>
      <div class="share-date">${d.date.replace(/-/g,".")}<br>今日能量</div>
    </div>
    <div class="share-score">
      <div><div class="big-cap">綜合能量層級</div><div class="big-num" data-count="${d.avg}">0</div><div class="big-lvl">${hawkinsName(d.avg)}・${level(d.avg).label}</div></div>
      <div><div class="big-cap">金錢能量</div><div class="big-num" data-count="${d.money}">0</div><div class="big-lvl">${moneyLevel(d.money).label}</div></div>
    </div>
    <div class="mini">${all.map(c=>`<div class="mini-row"><b>${c.short}</b><div class="mini-bar"><span style="--c:${c.c};width:${Math.max(3,c.s/10)}%"></span></div><em style="color:${c.s<200?"var(--low)":"var(--text)"}">${c.s}</em></div>`).join("")}</div>
    <div class="share-foot"><span>最強：${strongest.name}　需照顧：${weakest.name}</span><span>${esc(CONFIG.brand)}</span></div>`;
  document.querySelectorAll("#shareCard [data-count]").forEach(el=>{
    const target=+el.dataset.count;if(reduceMotion){el.textContent=target;return;}
    const t0=performance.now();(function tick(now){const p=Math.min(1,(now-t0)/1200);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);})(t0);
  });

  const hasQ=!!(d.question||d.topic);
  $("#qPanel").hidden=!hasQ;
  if(hasQ){
    const topicLabel=d.topic?TOPICS.find(t=>t.k===d.topic).label:"";
    $("#qEcho").innerHTML=`<small>你想改善的事</small>${esc(d.question||topicLabel)}`;
    $("#qAnswer").innerHTML=questionShort(d,all);
  }

  $("#chart").innerHTML=treeChart(all);

  $("#table").innerHTML=all.map(c=>{const L=level(c.s);return `<div class="tr"><span class="dot" style="--c:${c.c}"></span>
    <div class="nm"><b>${c.name}</b><small>${c.k==="money"?moneyLevel(c.s).label+"・金錢關係":c.theme}</small></div>
    <span class="chip ${L.cls}">${L.label}</span><span class="sc">${c.s}</span></div>`;}).join("");

  let care=ch.filter(c=>c.s<200).sort((a,b)=>a.s-b.s);
  if(care.length){
    $("#careTitle").textContent=`需要照顧的脈輪（${care.length}）`;
    $("#careLead").textContent="以下脈輪今天低於 200 勇氣線，能量偏向收縮。先從日常練習開始，再搭配調頻與靈氣，效果最快。";
  }else{
    care=[weakest];
    $("#careTitle").textContent="最值得提升的脈輪";
    $("#careLead").textContent="恭喜，今天七個脈輪都在 200 以上。把最低的那一個拉高，整體頻率會跟著往上走。";
  }
  $("#care").innerHTML=care.map(c=>`<div class="care" style="--c:${c.c}">
    <div class="care-head"><h3>${c.name}｜${c.s}・${hawkinsName(c.s)}</h3><span class="care-meta">${c.pos}・${c.theme}</span></div>
    <div class="blk"><h4>你可能會感覺</h4><ul>${c.signs.map(s=>`<li>${s}</li>`).join("")}</ul></div>
    <div class="blk"><h4>今天就可以做</h4><ul>${c.todo.map(s=>`<li>${s}</li>`).join("")}</ul></div>
    <div class="tool"><div><h4>靈擺調頻・提升頻率</h4><p>${c.pend}</p></div><div><h4>臼井靈氣・平衡狀態</h4><p>${c.reiki}</p></div></div></div>`).join("");

  const M=moneyLevel(d.money);
  $("#money").innerHTML=`<h2>金錢能量</h2>
    <div class="money-top"><div class="coin">${d.money}</div>
      <div style="min-width:0;flex:1"><h3 style="color:var(--gold-hi)">${M.label}</h3><p class="care-meta">${M.desc}</p>
        <div class="meter"><span style="width:${d.money/10}%"></span></div>
        <div class="meter-ticks"><span>0</span><span>250</span><span>500</span><span>750</span><span>1000</span></div></div></div>
    <div class="blk"><h4>給你的金錢練習</h4><ul>${M.todo.map(s=>`<li>${s}</li>`).join("")}</ul></div>
    <div class="tool"><div><h4>靈擺調頻・提升頻率</h4><p>針對海底輪與太陽輪調頻，清除「錢很難賺、我不配」的低頻信念，讓收入的天花板往上移。</p></div>
      <div><h4>臼井靈氣・平衡狀態</h4><p>穩定面對金錢時的焦慮與緊縮，讓錢進得來、也留得住。</p></div></div>`;

  renderReport(d,all);
  logLead({type:"靈擺脈輪",name:d.name,email:d.email,birth:d.birth,question:d.question||(d.topic?TOPICS.find(t=>t.k===d.topic).label:""),
    summary:`綜合${d.avg}・金錢${d.money}・最強${strongest.name}・最弱${weakest.name}`});
  window._result=d;window._all=all;
}

function treeChart(all){
  const rowH=24,top=18,n=HAWKINS.length,bottom=46;
  const H=top+(n-1)*rowH+bottom,W=360,xL=96,xR=352,colW=(xR-xL)/all.length;
  const yIdx=i=>top+(n-1-i)*rowH;
  const yOf=s=>{s=Math.max(20,Math.min(1000,s));for(let i=0;i<n-1;i++){const [a]=HAWKINS[i],[b]=HAWKINS[i+1];if(s<=b)return yIdx(i)-(s-a)/(b-a)*rowH;}return yIdx(n-1);};
  const y200=yOf(200),y500=yOf(500),yBase=yIdx(0)+10;
  let g=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="霍金斯能量層級樹狀圖">`;
  g+=`<rect x="${xL}" y="${y200}" width="${xR-xL}" height="${yBase-y200}" fill="rgba(232,115,95,.08)"/>`;
  g+=`<rect x="${xL}" y="${yIdx(n-1)}" width="${xR-xL}" height="${y500-yIdx(n-1)}" fill="rgba(217,180,106,.07)"/>`;
  HAWKINS.forEach(([v,l],i)=>{const y=yIdx(i),key=v===200;
    g+=`<line x1="${xL}" x2="${xR}" y1="${y}" y2="${y}" stroke="${key?"#D9B46A":"rgba(237,232,219,.08)"}" stroke-width="${key?1.2:1}" ${key?'stroke-dasharray="4 3"':""}/>`;
    g+=`<text x="${xL-8}" y="${y+4}" text-anchor="end" font-size="11" fill="${v<200?"#E8735F":v>=500?"#F4DFA6":"#A9A6BC"}" font-family="Noto Sans TC,sans-serif">${l?l+" ":""}<tspan font-family="Cormorant Garamond,serif" font-size="12">${v}</tspan></text>`;});
  g+=`<text x="${xR-4}" y="${y200-5}" text-anchor="end" font-size="10" fill="#D9B46A" font-family="Noto Sans TC,sans-serif">正負能量分界</text>`;
  g+=`<line x1="${xL}" x2="${xL}" y1="${yIdx(n-1)}" y2="${yBase}" stroke="#D9B46A" stroke-opacity=".6" stroke-width="2"/>`;
  all.forEach((c,i)=>{const cx=xL+colW*(i+.5),cy=yOf(c.s);
    g+=`<line x1="${cx}" x2="${cx}" y1="${yBase}" y2="${cy}" stroke="${c.c}" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/>`;
    g+=`<circle cx="${cx}" cy="${cy}" r="11" fill="${c.c}" fill-opacity=".22"/>`;
    g+=`<circle cx="${cx}" cy="${cy}" r="6" fill="${c.c}" stroke="#0A0E22" stroke-width="1.5"/>`;
    const ty=cy-14<12?cy+22:cy-14;
    g+=`<text x="${cx}" y="${ty}" text-anchor="middle" font-size="12" font-weight="600" fill="${c.s<200?"#E8735F":"#EDE8DB"}" font-family="Cormorant Garamond,serif">${c.s}</text>`;
    g+=`<text x="${cx}" y="${yBase+18}" text-anchor="middle" font-size="11" fill="${c.c}" font-family="Noto Sans TC,sans-serif">${c.short}</text>`;
  });
  g+=`<line x1="${xL}" x2="${xR}" y1="${yBase}" y2="${yBase}" stroke="#D9B46A" stroke-opacity=".5"/>`;
  return g+"</svg>";
}

$("#copyText").addEventListener("click",()=>{const d=window._result,all=window._all;if(!d)return;
  const txt=`【靈擺能量卡】${d.name}｜${d.date}\n綜合能量 ${d.avg}（${hawkinsName(d.avg)}）\n金錢能量 ${d.money}（${moneyLevel(d.money).label}）\n`+all.slice(0,7).map(c=>`${c.name} ${c.s}・${level(c.s).label}`).join("\n")+`\n\n想調頻提升 → 加 LINE ${CONFIG.lineUrl}`;
  copy(txt,"已複製結果文字");});
$("#pAgain").addEventListener("click",()=>{["pName","pBirth","pEmail","pQ"].forEach(id=>$("#"+id).value="");
  $("#pChips").querySelectorAll("[data-topic]").forEach(x=>x.setAttribute("aria-pressed","false"));showP("intro");$("#pName").focus();});

/* =========================================================
   塔羅
   ========================================================= */
let tarotBusy=false;
const T={spread:"daily",theme:"love"};
function showT(id){["intro","pick","result"].forEach(s=>$("#t-"+s).hidden=(s!==id));scrollTo(0,0);}
$("#spreadPick").addEventListener("click",e=>{const b=e.target.closest("[data-spread]");if(!b)return;
  T.spread=b.dataset.spread;
  $("#spreadPick").querySelectorAll("[data-spread]").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));
  $("#themeRow").hidden=T.spread!=="theme";
  $("#tQhint").textContent=T.spread==="daily"?"（選填）":"（建議填寫，解讀會更貼近你）";
});
$("#themeChips").addEventListener("click",e=>{const b=e.target.closest("[data-theme]");if(!b)return;
  T.theme=b.dataset.theme;
  $("#themeChips").querySelectorAll("[data-theme]").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));
});

$("#tForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("#tName").value.trim(),email=$("#tEmail").value.trim(),q=$("#tQ").value.trim();
  const err=$("#tErr");
  if(!name){err.textContent="請輸入姓名";$("#tName").focus();return;}
  if(!EMAIL_RE.test(email)){err.textContent="請輸入正確的 Email，抽牌紀錄會寄到這裡";$("#tEmail").focus();return;}
  err.textContent="";
  saveProfile({name,email});
  T.name=name;T.email=email;T.q=q;
  startPick();
});

function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

function startPick(){
  tarotBusy=true;
  showT("pick");
  const sp=SPREADS[T.spread];
  T.pool=shuffle(buildDeck()).slice(0,12).map(c=>({...c,reversed:Math.random()<0.3}));
  T.picked=[];
  $("#pickQ").textContent=T.q?`你的問題：${T.q}`:"";
  const deck=$("#deck");
  deck.innerHTML=T.pool.map((c,i)=>`<button type="button" class="tback" data-i="${i}" aria-label="第 ${i+1} 張牌" disabled>${cardBackSVG("d"+i)}</button>`).join("");
  deck.classList.add("shuffling");
  $("#pickStatus").textContent="洗牌中…";
  setTimeout(()=>{deck.classList.remove("shuffling");deck.querySelectorAll(".tback").forEach(b=>b.disabled=false);
    $("#pickStatus").textContent=`靜心想著你的問題，憑直覺選 ${sp.count} 張牌`;},reduceMotion?100:1600);
}
$("#deck").addEventListener("click",e=>{
  const b=e.target.closest(".tback");if(!b||b.disabled||b.classList.contains("sel"))return;
  const sp=SPREADS[T.spread];if(T.picked.length>=sp.count)return;
  b.classList.add("sel");T.picked.push(T.pool[+b.dataset.i]);
  const left=sp.count-T.picked.length;
  $("#pickStatus").textContent=left?`還要再選 ${left} 張`:"抽牌完成，正在翻牌…";
  if(!left){$("#deck").querySelectorAll(".tback").forEach(x=>x.disabled=true);setTimeout(renderTarot,reduceMotion?50:700);}
});

function readingFor(card,pos,idx){
  const sp=SPREADS[T.spread];
  const meaning=card.reversed?card.rev:card.up;
  let extra="";
  if(T.spread==="theme"){
    const themeLine=card.major?"這是一張大阿爾克那，代表這件事背後有更深的人生課題。":SUITS[card.suit][T.theme];
    extra=themeLine;
    if(idx===2)extra+=card.major?" "+card.advice:(card.reversed?" 先處理讓你卡住的地方，再往前走。":" 順著這張牌的能量去做，就是你的下一步。");
  }else if(card.major){extra=card.advice;}
  else if(T.spread==="daily"){extra=`今天的關鍵字是「${SUITS[card.suit].tone}」，${card.reversed?"留意能量卡住的地方，放慢一點。":"順著這股能量行動，會很順利。"}`;}
  else{extra=`${SUITS[card.suit].name}屬${SUITS[card.suit].el}元素，與${SUITS[card.suit].tone}有關。`;}
  const col=card.major?"#F4DFA6":SUITS[card.suit].color;
  return `<div class="reading" style="--c:${col}"><span class="kw">${pos[0]}・${pos[1]}</span><h3>${esc(card.name)}・${card.reversed?"逆位":"正位"}</h3><p>${meaning}。${extra}</p></div>`;
}

function renderTarot(){
  showT("result");
  const sp=SPREADS[T.spread];
  $("#tSpreadName").textContent=sp.name+(T.spread==="theme"?"・"+THEMES[T.theme]:"");
  $("#tQEcho").hidden=!T.q;
  if(T.q)$("#tQEcho").innerHTML=`<small>你的問題</small>${esc(T.q)}`;
  $("#tSpread").innerHTML=T.picked.map((c,i)=>`<div class="tslot ${sp.count===1?"solo":""}">
    <span class="pos">${sp.positions[i][0]}</span>
    <div class="flip" id="flip${i}"><div class="inner"><div class="face back">${cardBackSVG("r"+i)}</div><div class="face front ${c.reversed?"rev":""}">${cardFaceSVG(c)}</div></div></div>
    <span class="cname">${esc(c.name)}</span><span class="orient">${c.reversed?"逆位":"正位"}</span></div>`).join("");
  T.picked.forEach((c,i)=>setTimeout(()=>$("#flip"+i).classList.add("flipped"),reduceMotion?0:300+i*500));

  $("#tReadings").innerHTML=`<h2>牌面解讀</h2>`+T.picked.map((c,i)=>readingFor(c,sp.positions[i],i)).join("");

  const majors=T.picked.filter(c=>c.major).length,revs=T.picked.filter(c=>c.reversed).length;
  const suitCount={};T.picked.forEach(c=>{if(!c.major)suitCount[c.suit]=(suitCount[c.suit]||0)+1;});
  const dom=Object.entries(suitCount).sort((a,b)=>b[1]-a[1])[0];
  let sum=[];
  if(T.spread==="daily"){
    const c=T.picked[0];
    sum.push(c.reversed?"今天的牌是逆位，提醒你先照顧好自己的狀態，不急著衝。":"今天的牌是正位，能量順暢，適合主動出擊。");
    sum.push(c.major?"抽到大阿爾克那，今天會有值得留意的訊息或轉折。":`今天適合把注意力放在「${SUITS[c.suit].tone}」。`);
  }else{
    if(majors>=2)sum.push("這次出現多張大阿爾克那，代表這件事是你人生中重要的課題，宇宙正在推動你轉變。");
    if(revs>=2)sum.push("逆位牌偏多，表示能量有些卡住。先處理內在的阻力，事情才會順。");
    else if(revs===0)sum.push("三張都是正位，能量流動順暢，現在是行動的好時機。");
    if(dom&&dom[1]>=2)sum.push(`牌面以${SUITS[dom[0]].name}為主，這件事的關鍵在「${SUITS[dom[0]].tone}」。`);
    const last=T.picked[T.picked.length-1];
    sum.push(`最後一張「${last.name}」${last.reversed?"逆位，提醒你方向需要調整，別硬撐。":"正位，結果是值得期待的。"}`);
  }
  $("#tSummary").innerHTML=`<h2>整體訊息</h2><p>${sum.join("")}</p>
    <p class="care-meta">塔羅反映的是此刻的能量，你的選擇隨時能改變結果。</p>`;

  logLead({type:"塔羅・"+sp.name+(T.spread==="theme"?"・"+THEMES[T.theme]:""),name:T.name,email:T.email,question:T.q,
    summary:T.picked.map((c,i)=>`${sp.positions[i][0]}:${c.name}${c.reversed?"(逆)":""}`).join("、")});
  tarotBusy=false;
}
$("#tAgain").addEventListener("click",()=>{showT("intro");$("#tQ").value="";});

/* =========================================================
   老師專區
   ========================================================= */
$("#pinForm").addEventListener("submit",e=>{e.preventDefault();
  if($("#pin").value===CONFIG.teacherPin){$("#pinForm").hidden=true;$("#codeForm").hidden=false;$("#cName").focus();}
  else $("#pinErr").textContent="密碼不正確";});
$("#codeForm").addEventListener("submit",e=>{e.preventDefault();
  const n=$("#cName").value.trim(),b=$("#cBirth").value;if(!n||!b)return;
  const code=genCode(n,b);$("#codeOut").textContent=code;$("#copyCode").hidden=false;
  $("#copyCode").onclick=()=>copy(`${n} 你好，這是你的完整能量報告解鎖碼：${code}\n回到測驗結果頁，在「已經有解鎖碼了？」輸入就能閱讀，永久有效。`,"已複製訊息");});

route();

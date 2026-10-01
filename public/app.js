const DEFAULT_BLOCKS = [
  {name:"Admin Block", type:"Administration", score:86, energy:1820, water:2100, waste:31},
  {name:"Lab Block", type:"Computer & Science Labs", score:69, energy:2940, water:3450, waste:47},
  {name:"Academic Block", type:"Classrooms", score:81, energy:2210, water:3120, waste:39},
  {name:"Hostel Block", type:"Residential", score:74, energy:1450, water:3630, waste:42}
];
const demo={institute:"Your Institute",admin:"Administrator",blocks:DEFAULT_BLOCKS};
let state=JSON.parse(localStorage.getItem("ecoplus_state")||"null")||demo;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function save(){localStorage.setItem("ecoplus_state",JSON.stringify(state))}
function initials(n){return(n||"E").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase()}
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function navigate(p){$$(".page").forEach(x=>x.classList.toggle("active-page",x.id===p));$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===p));window.scrollTo({top:0,behavior:"smooth"})}
$$("[data-page]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));

function renderIdentity(){
 $("#sideInstitute").textContent=state.institute; $("#bannerInstitute").textContent=state.institute;
 $("#settingsInstitute").value=state.institute; $("#adminName").value=state.admin;
 $("#avatar").textContent=initials(state.institute); $("#bannerAvatar").textContent=initials(state.institute);
 $("#welcomeTitle").textContent=`Good evening, ${state.admin||"there"}`;
}
function renderBlockNames(){
 const count=Math.max(1,Math.min(50,Number($("#blockCountInput").value)||1));
 $("#blockNames").innerHTML=Array.from({length:count},(_,i)=>{
  const b=state.blocks[i]; const val=b?.name||`Block ${String.fromCharCode(65+i)}`;
  return `<label>Block ${i+1} name<input class="block-name-input" data-index="${i}" value="${val.replace(/"/g,"&quot;")}" required></label>`;
 }).join("");
}
$("#blockCountInput").addEventListener("input",renderBlockNames);
function openSetup(){
 $("#setupCard").classList.remove("hidden"); $("#instituteInput").value=state.institute==="Your Institute"?"":state.institute;
 $("#blockCountInput").value=state.blocks.length; renderBlockNames(); $("#setupCard").scrollIntoView({behavior:"smooth"});
}
$("#setupBtn").onclick=openSetup;
$("#editInstituteBtn").onclick=()=>{navigate("dashboard");openSetup()};
$("#addBlockBtn").onclick=()=>{
 state.blocks.push({name:`Block ${String.fromCharCode(65+state.blocks.length)}`,type:"Academic / General",score:78,energy:1500,water:2400,waste:30});
 save();renderAll();toast("New block added");
};
$("#setupForm").addEventListener("submit",e=>{
 e.preventDefault(); const names=$$(".block-name-input").map(i=>i.value.trim()).filter(Boolean);
 state.institute=$("#instituteInput").value.trim()||"Your Institute";
 state.blocks=names.map((name,i)=>{const old=state.blocks[i]||{};return{name,type:old.type||"Academic / General",score:old.score??75,energy:Number(old.energy)||1500,water:Number(old.water)||2400,waste:Number(old.waste)||30}});
 save();renderAll();$("#setupCard").classList.add("hidden");toast("Institute setup saved");
});

function renderBlocks(){
 $("#blockRows").innerHTML=state.blocks.map(b=>`
 <div class="block-row"><div><span class="block-name">${b.name}</span><span class="block-type">${b.type}</span></div>
 <div class="score-bar"><i style="width:${b.score}%"></i></div><div class="score-num">${b.score}</div></div>`).join("");

 $("#blocksGrid").innerHTML=state.blocks.map((b,i)=>`
 <article class="block-card">
  <div class="block-card-head"><div><h3>${b.name}</h3><p>${b.type}</p></div><span class="status">${b.score>=80?"Healthy":"Needs attention"}</span></div>
  <div class="manual-grid">
   <label>Energy (kWh)<input type="number" min="0" step="0.1" data-resource="energy" data-index="${i}" value="${b.energy}"></label>
   <label>Water (L)<input type="number" min="0" step="0.1" data-resource="water" data-index="${i}" value="${b.water}"></label>
   <label>Waste (kg)<input type="number" min="0" step="0.1" data-resource="waste" data-index="${i}" value="${b.waste}"></label>
  </div>
  <button class="save-block-btn" data-index="${i}">Save usage</button>
  <div class="mini-progress"><i style="width:${b.score}%"></i></div>
  <div style="display:flex;justify-content:space-between;margin-top:8px"><small style="font-size:9px;color:#7c877e">Eco score</small><small style="font-size:10px;color:#28764a;font-weight:800">${b.score}/100</small></div>
 </article>`).join("");

 $$(".save-block-btn").forEach(btn=>btn.onclick=()=>{
  const i=Number(btn.dataset.index);
  ["energy","water","waste"].forEach(k=>{
   const input=$(`[data-resource="${k}"][data-index="${i}"]`);
   state.blocks[i][k]=Math.max(0,Number(input.value)||0);
  });
  recalculateScores();save();renderAll();toast(`${state.blocks[i].name} usage saved`);
 });
 $("#resourceTable").innerHTML=state.blocks.map(b=>`<tr><td><b>${b.name}</b></td><td>${format(b.energy)} kWh</td><td>${format(b.water)} L</td><td>${format(b.waste)} kg</td><td>${b.score>=80?"Healthy":"Review"}</td></tr>`).join("");
 $("#leaderboard").innerHTML=[...state.blocks].sort((a,b)=>b.score-a.score).map((b,i)=>`<div class="leader"><span class="rank">0${i+1}</span><div><b>${b.name}</b><small>${b.type}</small></div><strong>${b.score} points</strong></div>`).join("");
}
function format(n){return Number(n||0).toLocaleString("en-IN",{maximumFractionDigits:1})}
function recalculateScores(){
 const total=state.blocks.reduce((s,b)=>s+b.energy+b.water/4+b.waste*10,0);
 state.blocks.forEach(b=>{
  const intensity=b.energy+b.water/4+b.waste*10;
  b.score=Math.max(40,Math.min(98,Math.round(100-(intensity/(total/state.blocks.length)-1)*12-18)));
 });
}
function updateDashboardTotals(){
 const e=state.blocks.reduce((s,b)=>s+Number(b.energy||0),0);
 const w=state.blocks.reduce((s,b)=>s+Number(b.water||0),0);
 const wa=state.blocks.reduce((s,b)=>s+Number(b.waste||0),0);
 $("#energy").textContent=format(e);$("#water").textContent=format(w);$("#waste").textContent=format(wa);
 const score=Math.round(state.blocks.reduce((s,b)=>s+b.score,0)/Math.max(1,state.blocks.length));
 $("#ecoScore").textContent=score;$("#ecoProgress").style.width=score+"%";
 $("#scoreNote").textContent=score>=80?"Strong baseline":score>=65?"Good baseline":"Needs attention";
}
function renderChart(metric="energy"){
 const vals=state.blocks.map(b=>Number(b[metric]||0)); const max=Math.max(...vals,1);
 $("#chart").innerHTML=vals.map((v,i)=>`<div class="bar-col"><i style="height:${Math.max(8,v/max*100)}%"></i></div>`).join("");
 $(".chart-labels").innerHTML=state.blocks.map(b=>`<span>${b.name.slice(0,8)}</span>`).join("");
}
$("#metricSelect").addEventListener("change",e=>renderChart(e.target.value));
$("#saveSettings").onclick=()=>{state.institute=$("#settingsInstitute").value.trim()||"Your Institute";state.admin=$("#adminName").value.trim()||"Administrator";save();renderAll();toast("Settings saved")};
$("#clearData").onclick=()=>{if(confirm("Clear EcoPlus saved data and restore the demo setup?")){state=JSON.parse(JSON.stringify(demo));save();renderAll();toast("Demo data restored")}};
$("#resetBtn").onclick=()=>{state=JSON.parse(JSON.stringify(demo));save();renderAll();toast("Demo data restored")};
function renderAll(){recalculateScores();renderIdentity();renderBlocks();updateDashboardTotals();renderChart($("#metricSelect")?.value||"energy")}
renderAll();

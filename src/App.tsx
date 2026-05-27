import { useState } from "react";

const MC = {
  Quads:"#FF6B35", Glutes:"#E91E8C", Hamstrings:"#AB47BC", Calves:"#78909C",
  Adductors:"#EC407A", Biceps:"#66BB6A", Triceps:"#D4E157", Chest:"#EF5350",
  Core:"#26C6DA", Shoulders:"#FFA726", "Front Delts":"#FFA726",
  Lats:"#1E88E5", "Upper Back":"#42A5F5", Traps:"#29B6F6",
  "Lower Back":"#8D6E63", "Rear Delts":"#26A69A", Forearms:"#80CBC4",
};

const MM = {
  Quads:        { f:["ql","qr"],                      b:[] },
  Glutes:       { f:[],                               b:["gl","gr"] },
  Hamstrings:   { f:[],                               b:["hl","hr"] },
  Calves:       { f:["cfl","cfr"],                    b:["cbl","cbr"] },
  Adductors:    { f:["ad"],                           b:[] },
  Biceps:       { f:["bil","bir"],                    b:[] },
  Triceps:      { f:[],                               b:["trl","trr"] },
  Chest:        { f:["pcl","pcr"],                    b:[] },
  Core:         { f:["au","am","al","ol","or"],       b:[] },
  Shoulders:    { f:["dl","dr"],                      b:["rdl","rdr"] },
  "Front Delts":{ f:["dl","dr"],                      b:[] },
  Lats:         { f:[],                               b:["latl","latr"] },
  "Upper Back": { f:[],                               b:["trapl","trapr","latl","latr","rhb"] },
  Traps:        { f:[],                               b:["trapl","trapr"] },
  "Lower Back": { f:[],                               b:["erl","err"] },
  "Rear Delts": { f:[],                               b:["rdl","rdr"] },
  Forearms:     { f:["fal","far"],                    b:["fbl","fbr"] },
};

const FIM = {
  ql:"Quads", qr:"Quads", cfl:"Calves", cfr:"Calves", ad:"Adductors",
  bil:"Biceps", bir:"Biceps", pcl:"Chest", pcr:"Chest",
  au:"Core", am:"Core", al:"Core", ol:"Core", or:"Core",
  dl:"Front Delts", dr:"Front Delts", fal:"Forearms", far:"Forearms",
};
const BIM = {
  gl:"Glutes", gr:"Glutes", hl:"Hamstrings", hr:"Hamstrings",
  cbl:"Calves", cbr:"Calves", trl:"Triceps", trr:"Triceps",
  trapl:"Traps", trapr:"Traps", latl:"Lats", latr:"Lats",
  rhb:"Upper Back", erl:"Lower Back", err:"Lower Back",
  rdl:"Rear Delts", rdr:"Rear Delts", fbl:"Forearms", fbr:"Forearms",
};

// FULLY TYPED getIds FUNCTION
function getIds(muscles: string[] = []) {
  const f = new Set<string>(), b = new Set<string>();
  muscles.forEach(m => { 
    const x = MM[m as keyof typeof MM]; 
    if(x){ 
      x.f.forEach(i => f.add(i)); 
      x.b.forEach(i => b.add(i)); 
    } 
  });
  return { f:[...f], b:[...b] };
}

// Emphasizing contrast: Vivid for active, very dark for inactive
function mFill(id: string, idMap: Record<string, string>, pri: string[], sec: string[], dim: string[]) {
  const m = idMap[id] as keyof typeof MC;
  if(pri.includes(id)) return MC[m] || "#FFFFFF"; // 100% vibrant
  if(sec.includes(id)) return (MC[m] || "#777777") + "40"; // 25% opacity for secondary so they don't compete
  if(dim.includes(id)) return "#1C1C1C"; // Deep background gray
  return "#111111"; // Base body color
}

// Emphasizing borders: Crisp white for primary, colored for secondary, nearly invisible for inactive
function mStroke(id: string, idMap: Record<string, string>, pri: string[], sec: string[], dim: string[]) {
  const m = idMap[id] as keyof typeof MC;
  if(pri.includes(id)) return "#FFFFFF"; // Pure white pop
  if(sec.includes(id)) return MC[m] || "#999999"; // Distinct color border for secondary
  if(dim.includes(id)) return "#2A2A2A"; // Subtle structure line
  return "#1E1E1E";
}

function FrontBody({ pri=[], sec=[], dim=[] }: { pri?: string[], sec?: string[], dim?: string[] }) {
  const g = (id: string) => ({ 
    fill: mFill(id, FIM, pri, sec, dim), 
    stroke: mStroke(id, FIM, pri, sec, dim), 
    strokeWidth: pri.includes(id) ? "1.5" : sec.includes(id) ? "1" : "0.4",
    strokeLinejoin: "round" as const,
    style: { transition: "fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease" }
  });
  
  return (
    <svg viewBox="0 0 100 215" style={{ height:160, width:"auto", display:"block", filter: pri.length > 0 ? "drop-shadow(0px 4px 12px rgba(0,0,0,0.5))" : "none", transition: "filter 0.3s ease" }}>
      {/* Body outlines */}
      <circle cx="50" cy="12" r="10" fill="#111" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="45" y="22" width="10" height="8" rx="2" fill="#111" stroke="#1E1E1E" strokeWidth="0.5"/>
      <path d="M32,30 Q19,36 19,58 L21,100 L79,100 L81,58 Q81,36 68,30 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M21,34 L12,39 L10,95 L21,95 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M79,34 L88,39 L90,95 L79,95 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="100" width="46" height="12" rx="3" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="112" width="17" height="52" rx="5" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="44" y="112" width="12" height="50" rx="3" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="56" y="112" width="17" height="52" rx="5" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="165" width="16" height="6" rx="2" fill="#111" stroke="#1A1A1A" strokeWidth="0.3"/>
      <rect x="57" y="165" width="16" height="6" rx="2" fill="#111" stroke="#1A1A1A" strokeWidth="0.3"/>
      <rect x="27" y="172" width="15" height="38" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="58" y="172" width="15" height="38" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      
      {/* Muscles */}
      <ellipse {...g("dl")} cx="23" cy="38" rx="8" ry="9"/>
      <ellipse {...g("dr")} cx="77" cy="38" rx="8" ry="9"/>
      <path {...g("pcl")} d="M50,30 Q36,36 30,56 Q40,63 50,58 Z"/>
      <path {...g("pcr")} d="M50,30 Q64,36 70,56 Q60,63 50,58 Z"/>
      <rect {...g("bil")} x="12" y="44" width="9" height="26" rx="3"/>
      <rect {...g("bir")} x="79" y="44" width="9" height="26" rx="3"/>
      <rect {...g("fal")} x="11" y="72" width="8" height="20" rx="3"/>
      <rect {...g("far")} x="81" y="72" width="8" height="20" rx="3"/>
      <rect {...g("ol")} x="30" y="60" width="9" height="28" rx="3"/>
      <rect {...g("or")} x="61" y="60" width="9" height="28" rx="3"/>
      <rect {...g("au")} x="40" y="60" width="20" height="8" rx="3"/>
      <rect {...g("am")} x="40" y="70" width="20" height="8" rx="3"/>
      <rect {...g("al")} x="40" y="80" width="20" height="8" rx="3"/>
      <rect {...g("ql")} x="27" y="112" width="17" height="52" rx="5"/>
      <rect {...g("qr")} x="56" y="112" width="17" height="52" rx="5"/>
      <rect {...g("ad")} x="44" y="112" width="12" height="50" rx="3"/>
      <rect {...g("cfl")} x="27" y="172" width="15" height="38" rx="4"/>
      <rect {...g("cfr")} x="58" y="172" width="15" height="38" rx="4"/>
      <text x="50" y="213" textAnchor="middle" fontSize="5.5" fill="#444" fontFamily="sans-serif" letterSpacing="1">FRONT</text>
    </svg>
  );
}

function BackBody({ pri=[], sec=[], dim=[] }: { pri?: string[], sec?: string[], dim?: string[] }) {
  const g = (id: string) => ({ 
    fill: mFill(id, BIM, pri, sec, dim), 
    stroke: mStroke(id, BIM, pri, sec, dim), 
    strokeWidth: pri.includes(id) ? "1.5" : sec.includes(id) ? "1" : "0.4",
    strokeLinejoin: "round" as const,
    style: { transition: "fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease" }
  });
  
  return (
    <svg viewBox="0 0 100 215" style={{ height:160, width:"auto", display:"block", filter: pri.length > 0 ? "drop-shadow(0px 4px 12px rgba(0,0,0,0.5))" : "none", transition: "filter 0.3s ease" }}>
      {/* Body outlines */}
      <circle cx="50" cy="12" r="10" fill="#111" stroke="#1E1E1E" strokeWidth="0.5"/>
      <rect x="45" y="22" width="10" height="8" rx="2" fill="#111" stroke="#1E1E1E" strokeWidth="0.5"/>
      <path d="M32,30 Q19,36 19,58 L21,100 L79,100 L81,58 Q81,36 68,30 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M21,34 L12,39 L10,95 L21,95 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <path d="M79,34 L88,39 L90,95 L79,95 Z" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="100" width="46" height="12" rx="3" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="112" width="46" height="32" rx="5" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="144" width="17" height="28" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="56" y="144" width="17" height="28" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="27" y="173" width="15" height="6" rx="2" fill="#111" stroke="#1A1A1A" strokeWidth="0.3"/>
      <rect x="58" y="173" width="15" height="6" rx="2" fill="#111" stroke="#1A1A1A" strokeWidth="0.3"/>
      <rect x="27" y="180" width="15" height="30" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      <rect x="58" y="180" width="15" height="30" rx="4" fill="#0E0E0E" stroke="#1A1A1A" strokeWidth="0.5"/>
      
      {/* Muscles */}
      <ellipse {...g("rdl")} cx="23" cy="38" rx="8" ry="9"/>
      <ellipse {...g("rdr")} cx="77" cy="38" rx="8" ry="9"/>
      <path {...g("trapl")} d="M50,26 L32,26 Q24,37 26,50 Q37,56 50,50 Z"/>
      <path {...g("trapr")} d="M50,26 L68,26 Q76,37 74,50 Q63,56 50,50 Z"/>
      <rect {...g("rhb")} x="39" y="46" width="22" height="12" rx="3"/>
      <path {...g("latl")} d="M32,26 Q20,47 22,78 Q31,86 40,77 Q38,58 50,50 Z"/>
      <path {...g("latr")} d="M68,26 Q80,47 78,78 Q69,86 60,77 Q62,58 50,50 Z"/>
      <rect {...g("erl")} x="38" y="80" width="8" height="18" rx="3"/>
      <rect {...g("err")} x="54" y="80" width="8" height="18" rx="3"/>
      <rect {...g("trl")} x="12" y="44" width="9" height="26" rx="3"/>
      <rect {...g("trr")} x="79" y="44" width="9" height="26" rx="3"/>
      <rect {...g("fbl")} x="11" y="72" width="8" height="20" rx="3"/>
      <rect {...g("fbr")} x="81" y="72" width="8" height="20" rx="3"/>
      <path {...g("gl")} d="M27,112 Q25,127 28,142 Q37,149 50,145 L50,112 Z"/>
      <path {...g("gr")} d="M73,112 Q75,127 72,142 Q63,149 50,145 L50,112 Z"/>
      <rect {...g("hl")} x="27" y="144" width="17" height="28" rx="4"/>
      <rect {...g("hr")} x="56" y="144" width="17" height="28" rx="4"/>
      <rect {...g("cbl")} x="27" y="180" width="15" height="30" rx="4"/>
      <rect {...g("cbr")} x="58" y="180" width="15" height="30" rx="4"/>
      <text x="50" y="213" textAnchor="middle" fontSize="5.5" fill="#444" fontFamily="sans-serif" letterSpacing="1">BACK</text>
    </svg>
  );
}

const DAYS = [
  {
    day:"Day 1", label:"FULL LEGS A", accent:"#FF6B35", badge: null,
    sub:"Quads · Glutes · Hamstrings · Adductors · Calves",
    note:"Alternates between quad-dominant and posterior chain movements so one group rests while the other works.",
    exercises:[
      { name:"Barbell Back Squat",            primary:"Quads",       secondary:["Glutes"],                   sets:4, reps:"8–10",    tip:"Chest up, knees track over toes — break parallel for full quad depth" },
      { name:"Barbell Hip Thrust",            primary:"Glutes",      secondary:["Hamstrings"],               sets:4, reps:"10–12",   tip:"Quads fully resting. Squeeze glutes hard for 1 second at the top" },
      { name:"Bulgarian Split Squat",         primary:"Quads",       secondary:["Glutes"],                   sets:3, reps:"10 each", tip:"Front foot far enough forward — knee stays behind toes throughout" },
      { name:"Romanian Deadlift",             primary:"Hamstrings",  secondary:["Glutes","Lower Back"],      sets:3, reps:"10–12",   tip:"Quads resting. Hinge at hips — feel the full hamstring stretch" },
      { name:"Sumo Squat",                    primary:"Adductors",   secondary:["Glutes","Quads"],           sets:3, reps:"12–15",   tip:"Wide stance, toes out 45° — inner thigh drives the movement" },
      { name:"Standing Calf Raise",           primary:"Calves",      secondary:[],                           sets:4, reps:"15–20",   tip:"Full stretch at the bottom, hard pause and squeeze at the top" },
    ],
  },
  {
    day:"Day 2", label:"ARMS + BACK", accent:"#42A5F5", badge:null,
    sub:"Lower Back · Lats · Upper Back · Biceps · Triceps · Forearms",
    note:"Back and arms alternate so each group rests between sets. Back trained first while energy is highest — arms follow as active recovery.",
    exercises:[
      { name:"Conventional Deadlift",         primary:"Lower Back",  secondary:["Glutes","Hamstrings"],      sets:4, reps:"6–8",     tip:"Heaviest lift of the week — brace core hard, neutral spine throughout" },
      { name:"Barbell Curl",                  primary:"Biceps",      secondary:["Forearms"],                 sets:3, reps:"10–12",   tip:"Back fully resting. Full stretch at bottom, hard squeeze at the top" },
      { name:"Lat Pulldown (Wide Grip)",      primary:"Lats",        secondary:["Biceps"],                   sets:4, reps:"8–10",    tip:"Pull to upper chest — think driving elbows into your pockets" },
      { name:"Tricep Pushdown (Cable)",       primary:"Triceps",     secondary:[],                           sets:3, reps:"12–15",   tip:"Lats resting. Elbows pinned to sides — full lockout every rep" },
      { name:"Seated Cable Row",              primary:"Upper Back",  secondary:["Lats","Biceps"],            sets:3, reps:"10–12",   tip:"Squeeze shoulder blades hard together at the end of each rep" },
      { name:"Overhead Tricep Extension",     primary:"Triceps",     secondary:[],                           sets:3, reps:"12–15",   tip:"Upper back resting. Stretches the long tricep head — most important move" },
    ],
  },
  {
    day:"Day 3", label:"CHEST + CORE", accent:"#EF5350", badge:null,
    sub:"Chest · Abs · Obliques · Core Stability",
    note:"Chest and core alternate — chest fully recovers during core sets, meaning no wasted rest time and a stronger brace on every press.",
    exercises:[
      { name:"Barbell Bench Press",           primary:"Chest",       secondary:["Front Delts"],              sets:4, reps:"8–10",    tip:"2 seconds down, press explosively up — drive through chest not shoulders" },
      { name:"Plank",                         primary:"Core",        secondary:[],                           sets:3, reps:"45–60s",  tip:"Chest fully resting. Brace abs, glutes, quads — nothing sags" },
      { name:"Incline DB Press",              primary:"Chest",       secondary:["Front Delts"],              sets:3, reps:"10–12",   tip:"30–45° angle — feel the upper chest stretch at the very bottom" },
      { name:"Cable Crunch",                  primary:"Core",        secondary:[],                           sets:3, reps:"15–20",   tip:"Chest resting. Crunch with abs — don't pull your neck forward" },
      { name:"Cable Fly (Low to High)",       primary:"Chest",       secondary:[],                           sets:3, reps:"12–15",   tip:"Big stretch at start, squeeze both hands hard together at the top" },
      { name:"Hanging Leg Raise",             primary:"Core",        secondary:[],                           sets:3, reps:"12–15",   tip:"Chest fully resting. Tuck pelvis at top — this fires the lower abs" },
    ],
  },
  {
    day:"Day 4", label:"SHOULDERS", accent:"#FFA726", badge:null,
    sub:"Front Delts · Lateral Delts · Rear Delts · Traps · Forearms",
    note:"Alternates front/lateral delts with rear delts so the shoulder rotates between anterior and posterior stress. Traps and forearms finish.",
    exercises:[
      { name:"Seated DB Overhead Press",      primary:"Front Delts", secondary:["Shoulders"],               sets:4, reps:"8–10",    tip:"Don't fully lock elbows — keep constant tension on the delts" },
      { name:"Face Pulls (Cable)",            primary:"Rear Delts",  secondary:["Traps"],                   sets:3, reps:"15–20",   tip:"Front delts resting. Elbows high, pull to forehead — key for joint health" },
      { name:"DB Lateral Raises",             primary:"Shoulders",   secondary:[],                          sets:3, reps:"15–20",   tip:"Slight forward lean, lead with elbows — lighter weight, full range" },
      { name:"Reverse Pec Deck",              primary:"Rear Delts",  secondary:["Upper Back"],              sets:3, reps:"15–20",   tip:"Lateral delts resting. Light weight — feel the squeeze behind the shoulder" },
      { name:"Barbell Shrugs",                primary:"Traps",       secondary:[],                          sets:3, reps:"12–15",   tip:"Straight up and down only — no shoulder rolling, pause at the top" },
      { name:"Wrist Curl / Reverse Curl",     primary:"Forearms",    secondary:[],                          sets:3, reps:"15–20",   tip:"Traps resting. Forearm on bench — isolate just the wrist movement" },
    ],
  },
  {
    day:"Day 5", label:"FULL LEGS B", accent:"#E91E8C", badge:null,
    sub:"Glutes · Hamstrings · Quads · Adductors · Calves",
    note:"Glutes and hamstrings lead this time — flips the priority of Day 1. Same muscles, entirely different exercises. Posterior and anterior chain alternate.",
    exercises:[
      { name:"Single-Leg Hip Thrust",         primary:"Glutes",      secondary:["Hamstrings"],              sets:4, reps:"12 each", tip:"One leg forces full glute isolation — the other side cannot compensate" },
      { name:"Leg Press (Low Narrow Feet)",   primary:"Quads",       secondary:["Adductors"],               sets:4, reps:"10–12",   tip:"Glutes resting. Low placement isolates quads specifically" },
      { name:"Cable Pull-Through",            primary:"Glutes",      secondary:["Hamstrings","Lower Back"], sets:3, reps:"15–20",   tip:"Hip hinge — drive hips forward explosively hard at the very top" },
      { name:"Lying Leg Curl",                primary:"Hamstrings",  secondary:[],                          sets:3, reps:"12–15",   tip:"Glutes resting. Full range — pause at top, slow 3-second negative" },
      { name:"Walking Lunges",                primary:"Quads",       secondary:["Glutes","Adductors"],      sets:3, reps:"12 each", tip:"Hamstrings resting. Step far enough forward — knee stays behind toes" },
      { name:"Seated Calf Raise",             primary:"Calves",      secondary:[],                          sets:4, reps:"15–20",   tip:"Targets the deeper soleus — different feel to the standing calf raise" },
    ],
  },
];

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [activeEx, setActiveEx] = useState<number | null>(null);
  const day = DAYS[activeDay];

  const handleDay = (i: number) => { setActiveDay(i); setActiveEx(null); };
  const handleEx  = (i: number) => setActiveEx(activeEx === i ? null : i);

  const dayMuscles = [...new Set(day.exercises.flatMap(ex=>[ex.primary,...(ex.secondary||[])]))];
  const dayIds = getIds(dayMuscles as string[]);

  let priIds={f:[] as string[], b:[] as string[]}, secIds={f:[] as string[], b:[] as string[]};
  if(activeEx !== null){
    const ex = day.exercises[activeEx];
    priIds = getIds([ex.primary]);
    secIds = getIds(ex.secondary||[]);
  }

  const noSel = activeEx === null;
  const fPri = noSel ? dayIds.f : priIds.f;
  const fSec = noSel ? [] : secIds.f;
  const fDim = noSel ? [] : dayIds.f;
  const bPri = noSel ? dayIds.b : priIds.b;
  const bSec = noSel ? [] : secIds.b;
  const bDim = noSel ? [] : dayIds.b;

  const legend = activeEx !== null
    ? [day.exercises[activeEx].primary,...(day.exercises[activeEx].secondary||[])]
    : dayMuscles;

  return (
    <div style={{ minHeight:"100vh", background:"#080808", color:"#EDEBE6", fontFamily:"Georgia, serif", paddingBottom:40 }}>

      {/* HEADER */}
      <div style={{ padding:"20px 16px 14px", borderBottom:"1px solid #181818" }}>
        <div style={{ fontSize:9, letterSpacing:"0.35em", color:"#FFFFF", marginBottom:5, textTransform:"uppercase" }}>5-Day Training Split</div>
        <div style={{ fontSize:22, fontWeight:"bold", color: "#FFF" }}>Your Program</div>
        <div style={{ fontSize:11, color:"#666", marginTop:3 }}>Tap any exercise → see its muscles light up on the diagram</div>
      </div>

      {/* DAY TABS */}
      <div style={{ display:"flex", overflowX:"auto", padding:"10px 16px", gap:7, borderBottom:"1px solid #181818", scrollbarWidth:"none" }}>
        {DAYS.map((d,i)=>(
          <button key={i} onClick={()=>handleDay(i)} style={{
            flex:"0 0 auto", minWidth:60,
            background: activeDay===i ? d.accent : "#0D0D0D",
            color: activeDay===i ? "#fff" : "#666",
            border:`1px solid ${activeDay===i ? d.accent : "#1E1E1E"}`,
            borderRadius:6, padding:"7px 9px", cursor:"pointer",
            fontFamily:"inherit", textAlign:"center", transition:"all 0.15s",
          }}>
            <div style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:2, opacity:0.9 }}>{d.day}</div>
            <div style={{ fontSize:10, fontWeight:"bold", lineHeight:1.3 }}>
              {["Legs I","Back & Arms","Chest & Core","Shoulder","Legs II"][i]}
            </div>
          </button>
        ))}
      </div>

      {/* STICKY BODY DIAGRAM PANEL */}
      <div style={{ position:"sticky", top:0, zIndex:10, background:"rgba(8,8,8,0.95)", backdropFilter: "blur(8px)", borderBottom:"1px solid #181818", padding:"12px 16px" }}>
        {/* Day label row */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:day.accent, flexShrink:0, boxShadow: `0 0 8px ${day.accent}88` }}/>
          <div style={{ fontSize:14, fontWeight:"bold", color: "#FFF" }}>{day.label}</div>
          {day.badge && <div style={{ background:day.accent+"22", color:day.accent, fontSize:9, padding:"2px 7px", borderRadius:4, fontWeight: "bold" }}>{day.badge}</div>}
          {activeEx!==null && (
            <div onClick={()=>setActiveEx(null)} style={{ marginLeft:"auto", fontSize:10, color:day.accent, cursor:"pointer", padding:"4px 8px", background: day.accent+"15", borderRadius: 4, fontWeight: "bold" }}>
              Clear ×
            </div>
          )}
        </div>

        {/* Front + Back body diagrams */}
        <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
          <FrontBody pri={fPri} sec={fSec} dim={fDim}/>
          <BackBody  pri={bPri} sec={bSec} dim={bDim}/>
        </div>

        {/* Muscle legend chips */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:10 }}>
          {legend.filter(m=>MC[m as keyof typeof MC]).map((m,i)=>(
            <div key={i} style={{
              background: activeEx!==null && i===0 ? MC[m as keyof typeof MC] : (MC[m as keyof typeof MC]||"#555")+"20", 
              color: activeEx!==null && i===0 ? "#FFF" : MC[m as keyof typeof MC]||"#999",
              fontSize:9, padding:"3px 8px", borderRadius:4,
              fontWeight: "bold",
              opacity: activeEx!==null && i>0 ? 0.7 : 1,
              transition: "all 0.2s ease"
            }}>● {m}</div>
          ))}
        </div>
        {activeEx!==null && <div style={{ fontSize:9, color:"#555", marginTop:6 }}>Bright white border = primary target · Colored border = secondary</div>}
      </div>

      {/* DAY NOTE */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ fontSize:11, color:"#888", lineHeight:1.7, background:"#111", padding:"12px 14px", borderRadius:6, borderLeft:`3px solid ${day.accent}` }}>
          {day.note}
        </div>
      </div>

      {/* EXERCISE LIST */}
      <div style={{ padding:"14px 16px 0" }}>
        <div style={{ fontSize:9, letterSpacing:"0.25em", textTransform:"uppercase", color:"#555", marginBottom:10 }}>
          {day.exercises.length} Exercises
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {day.exercises.map((ex,i)=>{
            const isActive = activeEx===i;
            return (
              <div key={i} onClick={()=>handleEx(i)} style={{
                background: isActive ? "#151515" : "#0D0D0D",
                borderRadius:8,
                border:`1px solid ${isActive ? day.accent+"66" : "#1A1A1A"}`,
                cursor:"pointer", overflow:"hidden", transition:"all 0.2s ease",
              }}>
                <div style={{ padding:"12px", display:"flex", alignItems:"flex-start", gap:10 }}>
                  {/* Number bubble */}
                  <div style={{
                    width:24, height:24, borderRadius:"50%", flexShrink:0,
                    background: isActive ? day.accent : "#1A1A1A",
                    color: isActive ? "#fff" : "#666",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:11, fontWeight:"bold", transition:"all 0.2s ease"
                  }}>{i+1}</div>

                  {/* Name + muscle tags */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:"600", marginBottom:6, lineHeight:1.3, color: isActive ? "#FFF" : "#DDD" }}>{ex.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      <span style={{
                        background:(MC[ex.primary as keyof typeof MC]||"#555")+"25", color:MC[ex.primary as keyof typeof MC]||"#999",
                        fontSize:9, padding:"2px 6px", borderRadius:4, fontWeight:"bold",
                      }}>{ex.primary}</span>
                      {(ex.secondary||[]).map((s,j)=>(
                        <span key={j} style={{
                          background:"#1A1A1A", color:"#777",
                          fontSize:9, padding:"2px 6px", borderRadius:4,
                        }}>+ {s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Sets × Reps */}
                  <div style={{ flexShrink:0 }}>
                    <div style={{
                      background: isActive ? day.accent+"22" : "#1A1A1A", 
                      color: isActive ? day.accent : "#888",
                      padding:"4px 8px", borderRadius:4,
                      fontSize:11, fontWeight:"bold", whiteSpace:"nowrap",
                    }}>{ex.sets} × {ex.reps}</div>
                  </div>
                </div>

                {/* Expanded tip */}
                {isActive && (
                  <div style={{
                    padding:"0 12px 14px 46px", marginTop:-2,
                    fontSize:12, color:"#AAA", lineHeight:1.6,
                    borderTop:"1px solid #1A1A1A", paddingTop:10,
                  }}>
                    💡 {ex.tip}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Walking note */}
        <div style={{
          marginTop:16,
          background:"#00C8530A", border:"1px solid #00C85333",
          borderRadius:8, padding:"12px 14px",
          fontSize:11, color:"#00C853", lineHeight:1.7,
        }}>
          🚶 After every session: 20–30 min walk. Burns 200–300 extra kcal and speeds recovery without taxing your muscles.
        </div>
      </div>
    </div>
  );
}

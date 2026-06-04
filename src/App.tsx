"use client";
import React, { useState } from "react";

const MC: Record<string, string> = {
  Quads: "#FF6B35", Glutes: "#E91E8C", Hamstrings: "#AB47BC", Calves: "#78909C",
  Adductors: "#EC407A", Biceps: "#66BB6A", Triceps: "#D4E157", Chest: "#EF5350",
  Core: "#26C6DA", "Front Delts": "#FFA726", Shoulders: "#FFA726",
  Lats: "#1E88E5", "Upper Back": "#42A5F5", Traps: "#29B6F6",
  "Lower Back": "#8D6E63", "Rear Delts": "#26A69A", Forearms: "#80CBC4",
};

const MM: Record<string, { f: string[]; b: string[] }> = {
  Quads: { f: ["ql", "qr"], b: [] }, Glutes: { f: [], b: ["gl", "gr"] },
  Hamstrings: { f: [], b: ["hl", "hr"] }, Calves: { f: ["cfl", "cfr"], b: ["cbl", "cbr"] },
  Adductors: { f: ["ad"], b: [] }, Biceps: { f: ["bil", "bir"], b: [] },
  Triceps: { f: [], b: ["trl", "trr"] }, Chest: { f: ["pcl", "pcr"], b: [] },
  Core: { f: ["au", "am", "al", "ol", "or"], b: [] },
  Shoulders: { f: ["dl", "dr"], b: ["rdl", "rdr"] },
  "Front Delts": { f: ["dl", "dr"], b: [] },
  Lats: { f: [], b: ["latl", "latr"] }, "Upper Back": { f: [], b: ["trapl", "trapr", "rhb"] },
  Traps: { f: [], b: ["trapl", "trapr"] }, "Lower Back": { f: [], b: ["erl", "err"] },
  "Rear Delts": { f: [], b: ["rdl", "rdr"] }, Forearms: { f: ["fal", "far"], b: ["fbl", "fbr"] },
};

const FIM: Record<string, string> = { ql: "Quads", qr: "Quads", cfl: "Calves", cfr: "Calves", ad: "Adductors", bil: "Biceps", bir: "Biceps", pcl: "Chest", pcr: "Chest", au: "Core", am: "Core", al: "Core", ol: "Core", or: "Core", dl: "Front Delts", dr: "Front Delts", fal: "Forearms", far: "Forearms" };
const BIM: Record<string, string> = { gl: "Glutes", gr: "Glutes", hl: "Hamstrings", hr: "Hamstrings", cbl: "Calves", cbr: "Calves", trl: "Triceps", trr: "Triceps", trapl: "Traps", trapr: "Traps", latl: "Lats", latr: "Lats", rhb: "Upper Back", erl: "Lower Back", err: "Lower Back", rdl: "Rear Delts", rdr: "Rear Delts", fbl: "Forearms", fbr: "Forearms" };
const ALL_F = ["dl", "dr", "pcl", "pcr", "bil", "bir", "fal", "far", "au", "am", "al", "ol", "or", "ql", "qr", "ad", "cfl", "cfr"];
const ALL_B = ["rdl", "rdr", "trapl", "trapr", "rhb", "latl", "latr", "erl", "err", "trl", "trr", "fbl", "fbr", "gl", "gr", "hl", "hr", "cbl", "cbr"];

function getIds(muscles: string[] = []) {
  const f = new Set<string>(), b = new Set<string>();
  muscles.forEach(m => {
    const x = MM[m];
    if (x) { x.f.forEach(i => f.add(i)); x.b.forEach(i => b.add(i)) }
  });
  return { f: [...f], b: [...b] };
}

function hr(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

interface MuscleDefsProps {
  ids: string[];
  map: Record<string, string>;
  pri: string[];
  sec: string[];
  anyActive: boolean;
}

function MuscleDefs({ ids, map, pri, sec, anyActive }: MuscleDefsProps) {
  return (
    <defs>
      {ids.map(id => {
        const base = MC[map[id]] || "#888888";
        let stops;
        if (pri.includes(id)) {
          stops = [
            { o: "0%", c: "#ffffff", a: 1 },
            { o: "35%", c: base, a: 1 },
            { o: "100%", c: base, a: 0.85 },
          ];
        } else if (sec.includes(id)) {
          stops = [
            { o: "0%", c: base, a: 0.55 },
            { o: "100%", c: base, a: 0.28 },
          ];
        } else if (anyActive) {
          stops = [
            { o: "0%", c: "#ffffff", a: 0.10 },
            { o: "100%", c: "#ffffff", a: 0.04 },
          ];
        } else {
          stops = [
            { o: "0%", c: base, a: 0.72 },
            { o: "60%", c: base, a: 0.45 },
            { o: "100%", c: base, a: 0.22 },
          ];
        }
        return (
          <radialGradient key={id} id={`mg_${id}`} cx="38%" cy="28%" r="72%" gradientUnits="objectBoundingBox">
            {stops.map((st, i) => (
              <stop key={i} offset={st.o} stopColor={st.c} stopOpacity={st.a} />
            ))}
          </radialGradient>
        );
      })}
    </defs>
  );
}

function gF(id: string) { return `url(#mg_${id})`; }
function gS(id: string, map: Record<string, string>, pri: string[], sec: string[], anyActive: boolean) {
  const base = MC[map[id]] || "#888888";
  if (pri.includes(id)) return base;
  if (sec.includes(id)) return hr(base, 0.45);
  if (anyActive) return "rgba(255,255,255,0.12)";
  return hr(base, 0.55);
}
function gW(id: string, pri: string[], sec: string[], anyActive: boolean) {
  if (pri.includes(id)) return "2.4";
  if (sec.includes(id)) return "1.2";
  if (anyActive) return "0.6";
  return "1.1";
}

interface BodyProps {
  pri?: string[];
  sec?: string[];
  anyActive?: boolean;
  dayMuscles?: string[];
  onMuscleClick?: (muscle: string) => void;
}

function FrontBody({ pri = [], sec = [], anyActive = false, dayMuscles = [], onMuscleClick }: BodyProps) {
  const p = (id: string): React.SVGProps<SVGPathElement> => {
    const muscleName = FIM[id];
    const isDayMuscle = dayMuscles.includes(muscleName);
    return {
      fill: isDayMuscle ? gF(id) : "#FFFFFF",
      stroke: isDayMuscle ? gS(id, FIM, pri, sec, anyActive) : "#111111",
      strokeWidth: isDayMuscle ? gW(id, pri, sec, anyActive) : "0.5",
      strokeLinejoin: "round",
      onClick: () => {
        if (isDayMuscle && onMuscleClick) onMuscleClick(muscleName);
      },
      style: { cursor: isDayMuscle ? "pointer" : "default" }
    };
  };

  return (
    <svg viewBox="0 0 120 260" style={{ height: 190, width: "auto", display: "block" }}>
      <MuscleDefs ids={ALL_F} map={FIM} pri={pri} sec={sec} anyActive={anyActive} />
      <ellipse cx="60" cy="15" rx="11" ry="13" fill="#111" stroke="#222" strokeWidth="0.5" />
      <path d="M52,27 Q48,32 48,38 L72,38 Q72,32 68,27Z" fill="#111" />
      <path d="M27,36 Q10,42 9,60 Q8,78 18,90 Q24,100 28,116 L28,132 L92,132 Q96,116 102,90 Q112,78 111,60 Q110,42 93,36 Q78,30 60,30 Q42,30 27,36Z" fill="#0A0A0A" stroke="#1A1A1A" strokeWidth="0.4" />
      <path d="M10,54 Q2,68 2,84 Q3,98 10,106 L22,100 L20,60Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M110,54 Q118,68 118,84 Q117,98 110,106 L98,100 L100,60Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M2,104 Q1,120 3,132 Q6,140 14,138 L22,130 L22,98Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M118,104 Q119,120 117,132 Q114,140 106,138 L98,130 L98,98Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <ellipse cx="10" cy="146" rx="7" ry="9" fill="#111" />
      <ellipse cx="110" cy="146" rx="7" ry="9" fill="#111" />
      <path d="M28,132 Q18,152 17,176 Q16,196 22,210 L54,210 Q58,192 59,170 Q60,148 59,132Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M92,132 Q102,152 103,176 Q104,196 98,210 L66,210 Q62,192 61,170 Q60,148 61,132Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M59,132 L61,132 Q62,154 62,168 Q61,174 60,176 Q59,174 58,168 Q58,154 59,132Z" fill="#0A0A0A" />
      <ellipse cx="37" cy="213" rx="17" ry="6" fill="#0E0E0E" />
      <ellipse cx="83" cy="213" rx="17" ry="6" fill="#0E0E0E" />
      <path d="M20,218 Q15,236 16,250 Q18,258 30,261 L48,259 Q54,242 55,226 L54,218Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M100,218 Q105,236 104,250 Q102,258 90,261 L72,259 Q66,242 65,226 L66,218Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <ellipse cx="36" cy="263" rx="17" ry="7" fill="#111" />
      <ellipse cx="84" cy="263" rx="17" ry="7" fill="#111" />
      
      <path {...p("dl")} d="M27,34 Q8,40 7,56 Q7,70 18,74 Q28,72 33,60 Q34,46 27,34Z" />
      <path {...p("dr")} d="M93,34 Q112,40 113,56 Q113,70 102,74 Q92,72 87,60 Q86,46 93,34Z" />
      <path {...p("pcl")} d="M60,36 Q40,38 28,52 Q22,64 28,76 Q42,82 60,74Z" />
      <path {...p("pcr")} d="M60,36 Q80,38 92,52 Q98,64 92,76 Q78,82 60,74Z" />
      <path {...p("bil")} d="M8,55 Q1,70 1,86 Q3,100 10,108 L21,101 L19,61Z" />
      <path {...p("bir")} d="M112,55 Q119,70 119,86 Q117,100 110,108 L99,101 L101,61Z" />
      <path {...p("fal")} d="M2,103 Q1,120 3,133 Q6,141 14,139 L22,131 L21,99Z" />
      <path {...p("far")} d="M118,103 Q119,120 117,133 Q114,141 106,139 L98,131 L99,99Z" />
      <path {...p("ol")} d="M28,54 Q26,80 28,116 L48,120 L48,76 Q38,68 28,54Z" />
      <path {...p("or")} d="M92,54 Q94,80 92,116 L72,120 L72,76 Q82,68 92,54Z" />
      <path {...p("au")} d="M49,76 Q56,80 60,80 Q64,80 71,76 L72,88 Q65,92 60,92 Q55,92 48,88Z" />
      <path {...p("am")} d="M48,90 Q55,94 60,94 Q65,94 72,90 L72,103 Q65,107 60,107 Q55,107 48,103Z" />
      <path {...p("al")} d="M48,105 Q55,109 60,109 Q65,109 72,105 L72,118 L48,118Z" />
      <path {...p("ql")} d="M30,134 Q18,156 17,180 Q16,198 22,212 L54,212 Q58,192 59,170 Q60,146 59,134Z" />
      <path {...p("qr")} d="M90,134 Q102,156 103,180 Q104,198 98,212 L66,212 Q62,192 61,170 Q60,146 61,134Z" />
      <path {...p("ad")} d="M59,134 L61,134 Q63,156 63,170 Q62,176 60,178 Q58,176 57,170 Q57,156 59,134Z" />
      <path {...p("cfl")} d="M20,218 Q15,236 16,250 Q18,258 30,261 L48,259 Q54,242 55,226 L54,218Z" />
      <path {...p("cfr")} d="M100,218 Q105,236 104,250 Q102,258 90,261 L72,259 Q66,242 65,226 L66,218Z" />
      <text x="60" y="272" textAnchor="middle" fontSize="6" fill="#282828" fontFamily="sans-serif" letterSpacing="2">FRONT</text>
    </svg>
  );
}

function BackBody({ pri = [], sec = [], anyActive = false, dayMuscles = [], onMuscleClick }: BodyProps) {
  const p = (id: string): React.SVGProps<SVGPathElement> => {
    const muscleName = BIM[id];
    const isDayMuscle = dayMuscles.includes(muscleName);
    return {
      fill: isDayMuscle ? gF(id) : "#FFFFFF",
      stroke: isDayMuscle ? gS(id, BIM, pri, sec, anyActive) : "#111111",
      strokeWidth: isDayMuscle ? gW(id, pri, sec, anyActive) : "0.5",
      strokeLinejoin: "round",
      onClick: () => {
        if (isDayMuscle && onMuscleClick) onMuscleClick(muscleName);
      },
      style: { cursor: isDayMuscle ? "pointer" : "default" }
    };
  };

  return (
    <svg viewBox="0 0 120 260" style={{ height: 190, width: "auto", display: "block" }}>
      <MuscleDefs ids={ALL_B} map={BIM} pri={pri} sec={sec} anyActive={anyActive} />
      <ellipse cx="60" cy="15" rx="11" ry="13" fill="#111" stroke="#222" strokeWidth="0.5" />
      <path d="M52,27 Q48,32 48,38 L72,38 Q72,32 68,27Z" fill="#111" />
      <path d="M27,36 Q10,42 9,60 Q8,78 18,90 Q24,100 28,116 L28,132 L92,132 Q96,116 102,90 Q112,78 111,60 Q110,42 93,36 Q78,30 60,30 Q42,30 27,36Z" fill="#0A0A0A" stroke="#1A1A1A" strokeWidth="0.4" />
      <path d="M10,54 Q2,68 2,84 Q3,98 10,106 L22,100 L20,60Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M110,54 Q118,68 118,84 Q117,98 110,106 L98,100 L100,60Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M2,104 Q1,120 3,132 Q6,140 14,138 L22,130 L22,98Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M118,104 Q119,120 117,132 Q114,140 106,138 L98,130 L98,98Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <ellipse cx="10" cy="146" rx="7" ry="9" fill="#111" />
      <ellipse cx="110" cy="146" rx="7" ry="9" fill="#111" />
      <path d="M28,132 Q18,152 17,176 Q16,196 22,210 L54,210 Q58,192 59,170 Q60,148 59,132Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M92,132 Q102,152 103,176 Q104,196 98,210 L66,210 Q62,192 61,170 Q60,148 61,132Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <ellipse cx="37" cy="213" rx="17" ry="6" fill="#0E0E0E" />
      <ellipse cx="83" cy="213" rx="17" ry="6" fill="#0E0E0E" />
      <path d="M20,218 Q15,236 16,250 Q18,258 30,261 L48,259 Q54,242 55,226 L54,218Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <path d="M100,218 Q105,236 104,250 Q102,258 90,261 L72,259 Q66,242 65,226 L66,218Z" fill="#0A0A0A" stroke="#181818" strokeWidth="0.3" />
      <ellipse cx="36" cy="263" rx="17" ry="7" fill="#111" />
      <ellipse cx="84" cy="263" rx="17" ry="7" fill="#111" />
      
      <path {...p("rdl")} d="M27,34 Q8,40 7,56 Q7,70 18,74 Q28,72 33,60 Q34,46 27,34Z" />
      <path {...p("rdr")} d="M93,34 Q112,40 113,56 Q113,70 102,74 Q92,72 87,60 Q86,46 93,34Z" />
      <path {...p("trapl")} d="M60,28 Q44,32 30,44 Q20,54 20,66 Q22,76 32,78 Q46,76 56,64 Q62,54 60,42Z" />
      <path {...p("trapr")} d="M60,28 Q76,32 90,44 Q100,54 100,66 Q98,76 88,78 Q74,76 64,64 Q58,54 60,42Z" />
      <path {...p("rhb")} d="M56,64 Q59,58 60,58 Q61,58 64,64 L65,84 Q62,90 60,91 Q58,90 55,84Z" />
      <path {...p("latl")} d="M29,40 Q10,58 8,86 Q6,110 16,122 Q28,132 46,126 Q58,118 60,96 Q62,74 52,56Z" />
      <path {...p("latr")} d="M91,40 Q110,58 112,86 Q114,110 104,122 Q92,132 74,126 Q62,118 60,96 Q58,74 68,56Z" />
      <path {...p("erl")} d="M50,92 L59,92 L58,128 L46,128Z" />
      <path {...p("err")} d="M61,92 L70,92 L74,128 L62,128Z" />
      <path {...p("trl")} d="M8,55 Q1,70 1,86 Q3,100 10,108 L21,101 L19,61Z" />
      <path {...p("trr")} d="M112,55 Q119,70 119,86 Q117,100 110,108 L99,101 L101,61Z" />
      <path {...p("fbl")} d="M2,103 Q1,120 3,133 Q6,141 14,139 L22,131 L21,99Z" />
      <path {...p("fbr")} d="M118,103 Q119,120 117,133 Q114,141 106,139 L98,131 L99,99Z" />
      <path {...p("gl")} d="M28,134 Q14,148 14,170 Q14,190 24,202 Q36,212 56,208 Q66,200 65,176 Q64,150 56,134Z" />
      <path {...p("gr")} d="M92,134 Q106,148 106,170 Q106,190 96,202 Q84,212 64,208 Q54,200 55,176 Q56,150 64,134Z" />
      <path {...p("hl")} d="M22,204 Q16,218 16,230 L54,230 Q56,218 57,204Z" />
      <path {...p("hr")} d="M98,204 Q104,218 104,230 L66,230 Q64,218 63,204Z" />
      <path {...p("cbl")} d="M20,218 Q15,236 16,250 Q18,258 30,261 L48,259 Q54,242 55,226 L54,218Z" />
      <path {...p("cbr")} d="M100,218 Q105,236 104,250 Q102,258 90,261 L72,259 Q66,242 65,226 L66,218Z" />
      <text x="60" y="272" textAnchor="middle" fontSize="6" fill="#282828" fontFamily="sans-serif" letterSpacing="2">BACK</text>
    </svg>
  );
}

const DAYS = [
  {
    day: "Day 1", label: "FULL LEGS A", accent: "#FF6B35", sub: "Quads · Glutes · Hamstrings · Adductors · Calves", note: "Alternates between quad-dominant and posterior chain movements so one group rests while the other works.",
    exercises: [
      { name: "Barbell Back Squat", primary: "Quads", secondary: ["Glutes"], sets: 4, reps: "8–10", tip: "Chest up, knees track over toes — break parallel for full quad depth" },
      { name: "Barbell Hip Thrust", primary: "Glutes", secondary: ["Hamstrings"], sets: 4, reps: "10–12", tip: "Quads fully resting. Squeeze glutes hard for 1 second at the top" },
      { name: "Bulgarian Split Squat", primary: "Quads", secondary: ["Glutes"], sets: 3, reps: "10 each", tip: "Front foot far enough forward — knee stays behind toes throughout" },
      { name: "Romanian Deadlift", primary: "Hamstrings", secondary: ["Glutes", "Lower Back"], sets: 3, reps: "10–12", tip: "Quads resting. Hinge at hips — feel the full hamstring stretch" },
      { name: "Sumo Squat", primary: "Adductors", secondary: ["Glutes", "Quads"], sets: 3, reps: "12–15", tip: "Wide stance, toes out 45° — inner thigh drives the movement" },
      { name: "Standing Calf Raise", primary: "Calves", secondary: [], sets: 4, reps: "15–20", tip: "Full stretch at the bottom, hard pause and squeeze at the top" },
    ]
  },
  {
    day: "Day 2", label: "ARMS + BACK", accent: "#42A5F5", sub: "Lower Back · Lats · Upper Back · Biceps · Triceps · Forearms", note: "Back and arms alternate so each group rests between sets. Back trained first while energy is highest — arms follow as active recovery.",
    exercises: [
      { name: "Incline Bench Pulls", primary: "Upper Back", secondary: ["Lats", "Rear Delts", "Biceps"], sets: 3, reps: "10-12", tip: "Heaviest lift of the week — brace core hard, neutral spine throughout" },
      { name: "Barbell Curl", primary: "Biceps", secondary: ["Forearms"], sets: 3, reps: "10–12", tip: "Back fully resting. Full stretch at bottom, hard squeeze at the top" },
      { name: "Lat Pulldown (Wide Grip)", primary: "Lats", secondary: ["Biceps"], sets: 4, reps: "8–10", tip: "Pull to upper chest — think driving elbows into your pockets" },
      { name: "Tricep Pushdown (Cable)", primary: "Triceps", secondary: [], sets: 3, reps: "12–15", tip: "Lats resting. Elbows pinned to sides — full lockout every rep" },
      { name: "Seated Cable Row", primary: "Upper Back", secondary: ["Lats", "Biceps"], sets: 3, reps: "10–12", tip: "Squeeze shoulder blades hard together at the end of each rep" },
      { name: "Overhead Tricep Extension", primary: "Triceps", secondary: [], sets: 3, reps: "12–15", tip: "Upper back resting. Stretches the long tricep head — most important move" },
    ]
  },
  {
    day: "Day 3", label: "CHEST + CORE", accent: "#EF5350", sub: "Chest · Abs · Obliques · Core Stability", note: "Chest and core alternate — chest fully recovers during core sets, meaning no wasted rest time and a stronger brace on every press.",
    exercises: [
      { name: "Barbell Bench Press", primary: "Chest", secondary: ["Front Delts"], sets: 4, reps: "8–10", tip: "2 seconds down, press explosively up — drive through chest not shoulders" },
      { name: "Plank", primary: "Core", secondary: [], sets: 3, reps: "45–60s", tip: "Chest fully resting. Brace abs, glutes, quads — nothing sags" },
      { name: "Incline DB Press", primary: "Chest", secondary: ["Front Delts"], sets: 3, reps: "10–12", tip: "30–45° angle — feel the upper chest stretch at the very bottom" },
      { name: "Crunch", primary: "Core", secondary: [], sets: 3, reps: "15–20", tip: "Chest resting. Crunch with abs — don't pull your neck forward" },
      { name: "Cable Fly (Low to High)", primary: "Chest", secondary: [], sets: 3, reps: "12–15", tip: "Big stretch at start, squeeze both hands hard together at the top" },
      { name: "Lying Leg Raise", primary: "Core", secondary: [], sets: 3, reps: "12–15", tip: "Chest fully resting. Tuck pelvis at top — this fires the lower abs" },
    ]
  },
  {
    day: "Day 4", label: "SHOULDERS", accent: "#FFA726", sub: "Front Delts · Lateral Delts · Rear Delts · Traps · Forearms", note: "Alternates front/lateral delts with rear delts so the shoulder rotates between anterior and posterior stress. Traps and forearms finish.",
    exercises: [
      { name: "Seated DB Overhead Press", primary: "Front Delts", secondary: ["Shoulders"], sets: 4, reps: "8–10", tip: "Don't fully lock elbows — keep constant tension on the delts" },
      { name: "Face Pulls (Cable)", primary: "Rear Delts", secondary: ["Traps"], sets: 3, reps: "15–20", tip: "Front delts resting. Elbows high, pull to forehead — key for joint health" },
      { name: "DB Lateral Raises", primary: "Shoulders", secondary: [], sets: 3, reps: "15–20", tip: "Slight forward lean, lead with elbows — lighter weight, full range" },
      { name: "Reverse Pec Deck", primary: "Rear Delts", secondary: ["Upper Back"], sets: 3, reps: "15–20", tip: "Lateral delts resting. Light weight — feel the squeeze behind the shoulder" },
      { name: "Barbell Shrugs", primary: "Traps", secondary: [], sets: 3, reps: "12–15", tip: "Straight up and down only — no shoulder rolling, pause at the top" },
      { name: "Wrist Curl / Reverse Curl", primary: "Forearms", secondary: [], sets: 3, reps: "15–20", tip: "Traps resting. Forearm on bench — isolate just the wrist movement" },
    ]
  },
  {
    day: "Day 5", label: "FULL LEGS B", accent: "#E91E8C", sub: "Glutes · Hamstrings · Quads · Adductors · Calves", note: "Glutes and hamstrings lead this time — flips the priority of Day 1. Same muscles, entirely different exercises. Posterior and anterior chain alternate.",
    exercises: [
      { name: "Leg Extension", primary: "Quads", secondary: [], sets: 4, reps: "12 each", tip: "One leg forces full glute isolation — the other side cannot compensate" },
      { name: "Leg Press (Low Narrow Feet)", primary: "Quads", secondary: ["Adductors"], sets: 4, reps: "10–12", tip: "Glutes resting. Low placement isolates quads specifically" },
      { name: "Hip Thrust", primary: "Glutes", secondary: ["Hamstrings"], sets: 3, reps: "15–20", tip: "Hip hinge — drive hips forward explosively hard at the very top" },
      { name: "Leg Curl", primary: "Hamstrings", secondary: [], sets: 3, reps: "12–15", tip: "Glutes resting. Full range — pause at top, slow 3-second negative" },
      { name: "Walking Lunges", primary: "Quads", secondary: ["Glutes", "Adductors"], sets: 3, reps: "12 each", tip: "Hamstrings resting. Step far enough forward — knee stays behind toes" },
      { name: "Seated Calf Raise", primary: "Calves", secondary: [], sets: 4, reps: "15–20", tip: "Targets the deeper soleus — different feel to the standing calf raise" },
    ]
  },
];

export default function App() {
  const [activeDay, setActiveDay] = useState<number>(0);
  const [activeEx, setActiveEx] = useState<number | null>(null);
  const [activeMuscle, setActiveMuscle] = useState<string | null>(null);

  const day = DAYS[activeDay];

  const handleDay = (i: number) => { 
    setActiveDay(i); 
    setActiveEx(null); 
    setActiveMuscle(null); 
  };
  
  const handleEx = (i: number) => {
    setActiveEx(activeEx === i ? null : i);
    setActiveMuscle(null);
  };

  const handleMuscleClick = (m: string) => {
    setActiveMuscle(activeMuscle === m ? null : m);
    setActiveEx(null);
  };

  const dayMuscles = [...new Set(day.exercises.flatMap(ex => [ex.primary, ...(ex.secondary || [])]))];
  const dayIds = getIds(dayMuscles);

  let priIds = { f: [] as string[], b: [] as string[] };
  let secIds = { f: [] as string[], b: [] as string[] };
  let anyActive = false;

  if (activeEx !== null) { 
    const ex = day.exercises[activeEx]; 
    priIds = getIds([ex.primary]); 
    secIds = getIds(ex.secondary || []); 
    anyActive = true;
  } else if (activeMuscle !== null) {
    priIds = getIds([activeMuscle]);
    anyActive = true;
  }
  
  const noSel = !anyActive;

  let legend: string[] = [];
  if (activeEx !== null) {
    legend = [day.exercises[activeEx].primary, ...(day.exercises[activeEx].secondary || [])];
  } else if (activeMuscle !== null) {
    legend = [activeMuscle];
  } else {
    legend = dayMuscles;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080808", color: "#EDEBE6", fontFamily: "Georgia,serif", paddingBottom: 40 }}>
      <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid #181818" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.35em", color: "#444", marginBottom: 5, textTransform: "uppercase" }}>5-Day Training Split · 6 Exercises Per Day</div>
        <div style={{ fontSize: 22, fontWeight: "bold" }}>Your Program</div>
        <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>Tap an exercise or a muscle to highlight correlations</div>
      </div>
      
      <div style={{ display: "flex", overflowX: "auto", padding: "10px 16px", gap: 7, borderBottom: "1px solid #181818", scrollbarWidth: "none" }}>
        {DAYS.map((d, i) => (
          <button key={i} onClick={() => handleDay(i)} style={{ flex: "0 0 auto", minWidth: 60, background: activeDay === i ? d.accent : "#0D0D0D", color: activeDay === i ? "#fff" : "#555", border: `1px solid ${activeDay === i ? d.accent : "#1E1E1E"}`, borderRadius: 6, padding: "7px 8px", cursor: "pointer", fontFamily: "inherit", textAlign: "center", transition: "all 0.15s" }}>
            <div style={{ fontSize: 8, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2, opacity: 0.8 }}>{d.day}</div>
            <div style={{ fontSize: 9, fontWeight: "bold", lineHeight: 1.3 }}>{["LEGS A", "ARMS+BACK", "CHEST+CORE", "SHLDRS", "LEGS B"][i]}</div>
          </button>
        ))}
      </div>

      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "#080808", borderBottom: "1px solid #181818", padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: day.accent, flexShrink: 0 }} />
          <div style={{ fontSize: 13, fontWeight: "bold" }}>{day.label}</div>
          {!noSel && <div onClick={() => { setActiveEx(null); setActiveMuscle(null); }} style={{ marginLeft: "auto", fontSize: 10, color: day.accent, cursor: "pointer", padding: "2px 8px", border: `1px solid ${day.accent}44`, borderRadius: 4 }}>Clear x</div>}
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
          <FrontBody 
            pri={noSel ? dayIds.f : priIds.f} 
            sec={noSel ? [] : secIds.f} 
            anyActive={!noSel} 
            dayMuscles={dayMuscles} 
            onMuscleClick={handleMuscleClick} 
          />
          <BackBody 
            pri={noSel ? dayIds.b : priIds.b} 
            sec={noSel ? [] : secIds.b} 
            anyActive={!noSel} 
            dayMuscles={dayMuscles} 
            onMuscleClick={handleMuscleClick} 
          />
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {legend.filter(m => MC[m]).map((m, i) => (
            <div key={i} style={{ background: MC[m] + "20", color: MC[m], fontSize: 9, padding: "2px 8px", borderRadius: 3, fontWeight: (activeEx !== null || activeMuscle !== null) && i === 0 ? "700" : "400", opacity: (activeEx !== null) && i > 0 ? 0.5 : 1 }}>● {m}</div>
          ))}
        </div>
        {!noSel && <div style={{ fontSize: 9, color: "#303030", marginTop: 4 }}>Bright = primary · Faded = secondary</div>}
      </div>

      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontSize: 11, color: "#585858", lineHeight: 1.75, background: "#0C0C0C", padding: "10px 14px", borderRadius: 6, borderLeft: `3px solid ${day.accent}` }}>{day.note}</div>
      </div>
  
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "#303030", marginBottom: 10 }}>{day.exercises.length} Exercises</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {day.exercises.map((ex, i) => {
            const isExActive = activeEx === i;
            const isMuscleActive = activeMuscle !== null && (ex.primary === activeMuscle || (ex.secondary || []).includes(activeMuscle));
            const isActive = isExActive || isMuscleActive;

            return (
              <div key={i} onClick={() => handleEx(i)} style={{ background: isActive ? "#131313" : "#0B0B0B", borderRadius: 8, border: `1px solid ${isActive ? day.accent + "55" : "#191919"}`, cursor: "pointer", overflow: "hidden", transition: "all 0.2s" }}>
                <div style={{ padding: "11px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                  
                  {/* Replaced animation with MuscleWiki Link & Placeholder Image */}
                  <a href={`https://musclewiki.com/search?q=${encodeURIComponent(ex.name)}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ flexShrink: 0, width: 40, height: 40, display: "block", borderRadius: 6, overflow: 'hidden', background: "#111" }}>
                     <img src={`https://placehold.co/80x80/222222/ffffff?text=${ex.name.charAt(0)}`} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </a>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: "600", marginBottom: 5, lineHeight: 1.3, color: isActive ? "#ffffff" : "#EDEBE6" }}>{ex.name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      <span style={{ background: (MC[ex.primary] || "#555") + "22", color: MC[ex.primary] || "#999", fontSize: 9, padding: "2px 7px", borderRadius: 3, fontWeight: "700" }}>● {ex.primary}</span>
                      {(ex.secondary || []).map((s, j) => (
                        <span key={j} style={{ background: "#1A1A1A", color: "#484848", fontSize: 9, padding: "2px 7px", borderRadius: 3 }}>+ {s}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ background: day.accent + "1A", color: day.accent, padding: "4px 9px", borderRadius: 4, fontSize: 11, fontWeight: "bold", whiteSpace: "nowrap" }}>{ex.sets} x {ex.reps}</div>
                  </div>
                </div>
                
                {isActive && (
                  <div style={{ padding: "0 12px 12px 62px", marginTop: -2, fontSize: 12, color: "#686868", lineHeight: 1.7, borderTop: "1px solid #191919", paddingTop: 10 }}>
                    {ex.tip}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 16, background: "#00C85308", border: "1px solid #00C85320", borderRadius: 8, padding: "11px 14px", fontSize: 11, color: "#00C853", lineHeight: 1.7 }}>
          After every session: 20–30 min walk. Burns 200–300 extra kcal and speeds recovery without taxing your muscles.
        </div>
      </div>
    </div>
  );
}

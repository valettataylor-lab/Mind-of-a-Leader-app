import { useState, useEffect, useRef } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────
const C = {
  navy:      "#0B1E3D",
  navyDeep:  "#071428",
  navyMid:   "#0F2847",
  gold:      "#D4A843",
  goldLight: "#F0CB6A",
  teal:      "#1A8C7E",
  coral:     "#E05C3A",
  rose:      "#C0586E",
  lavender:  "#8B7CC8",
  sky:       "#2A7AB5",
  cream:     "#FAF6EF",
  white:     "#FFFFFF",
};

const rgba = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

const hex2rgb = (hex) => ({
  r: parseInt(hex.slice(1,3),16),
  g: parseInt(hex.slice(3,5),16),
  b: parseInt(hex.slice(5,7),16),
});

// ─── GLOBAL STYLES ──────────────────────────────────────────────────
function useFonts() {
  useEffect(() => {
    if (!document.getElementById("mol-fonts")) {
      const l = document.createElement("link");
      l.id = "mol-fonts";
      l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap";
      l.rel = "stylesheet";
      document.head.appendChild(l);
    }
    if (!document.getElementById("mol-css")) {
      const s = document.createElement("style");
      s.id = "mol-css";
      s.textContent = `
        @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95)}     to{opacity:1;transform:scale(1)} }
        * { box-sizing:border-box; }
        input { box-sizing:border-box; }
        button:active { opacity:0.8; }
      `;
      document.head.appendChild(s);
    }
  }, []);
}

// ─── DATA ────────────────────────────────────────────────────────────
const THEMES = [
  { label:"Identity & Belonging",      color: C.sky    },
  { label:"Social Media & Comparison", color: C.rose   },
  { label:"Family Pressure",           color: C.gold   },
  { label:"Goals & Ambition",          color: C.teal   },
];

const QUESTIONS = [
  { t:0, q:"Stand up if you've ever felt like you didn't quite fit in — anywhere.",                                          a:"Stay standing if you kept going anyway." },
  { t:0, q:"Stand up if you've ever changed who you are just to make others comfortable.",                                    a:"Sit down if you've decided to stop doing that." },
  { t:0, q:"Stand up if you've ever felt pressure to be the 'perfect version' of yourself.",                                 a:"Stay standing if that pressure still shows up sometimes." },
  { t:1, q:"Stand up if you've ever compared yourself to someone else's highlight reel online.",                              a:"Stay standing if it made you feel like you weren't enough." },
  { t:1, q:"Stand up if something posted online — about you or someone you know — changed how you felt.",                    a:"Sit down if you found a way to move past it." },
  { t:1, q:"Stand up if you've ever felt like your real life doesn't look as good as what you post.",                        a:"Stay standing if that's something you think about often." },
  { t:2, q:"Stand up if someone in your family has high expectations for you — and sometimes that feels heavy.",              a:"Stay standing if you've ever felt like you couldn't say that out loud." },
  { t:2, q:"Stand up if you've ever felt overwhelmed but didn't want to worry the people around you.",                       a:"Sit down if you've asked for help anyway." },
  { t:2, q:"Stand up if you've ever worked really hard to make someone proud.",                                               a:"Stay standing if that someone is yourself." },
  { t:3, q:"Stand up if you have a dream that feels almost too big to say out loud.",                                         a:"Stay standing if you're working toward it anyway." },
  { t:3, q:"Stand up if you've ever quit something — and then wished you hadn't.",                                           a:"Sit down if you learned something from it." },
  { t:3, q:"Stand up if you believe — really believe — that your best days are still ahead of you.",                         a:"Look around. These are your people." },
];

const GROUP_ROLES = [
  { count:"3–4", label:"The Cast",     icon:"🎭", color:C.coral,    desc:"Perform all three skits — the real reaction, the strong response, and the support moment.", tip:"Bring drama, humor, and truth. All of it counts." },
  { count:1,     label:"The Host",     icon:"🎤", color:C.sky,      desc:"Introduce the scenario to the room and narrate what's happening between each skit.",       tip:"You're the voice of the group. Keep everyone oriented." },
  { count:1,     label:"The Analyst",  icon:"📊", color:C.teal,     desc:"After the skits, break down what changed from Skit 1 to Skit 2 — and why it mattered.",    tip:"What shifted? What worked? Name the difference." },
  { count:1,     label:"The Scout",    icon:"🔭", color:C.lavender, desc:"Silent observer during the performance. Speaks last — sharing what nobody else noticed.",   tip:"Stay quiet. Watch everything. You catch what the cameras missed." },
];

const SCENARIOS = [
  { id:1,  color:C.sky,      sym:"★", label:"Sky Blue / Star",    text:"You studied hard and still failed an important test." },
  { id:2,  color:C.coral,    sym:"⚡", label:"Coral / Bolt",       text:"You didn't make the team or club you really wanted." },
  { id:3,  color:C.teal,     sym:"♥", label:"Teal / Heart",       text:"Your friend group is falling apart and you're caught in the middle." },
  { id:4,  color:C.gold,     sym:"◆", label:"Gold / Diamond",     text:"You feel pressure to be someone you're not." },
  { id:5,  color:C.lavender, sym:"●", label:"Lavender / Circle",  text:"Someone posted something about you online." },
  { id:6,  color:"#E8A838",  sym:"♛", label:"Amber / Crown",      text:"You got left out of something everyone else was invited to." },
  { id:7,  color:"#3BAF7E",  sym:"▲", label:"Emerald / Triangle", text:"Someone you trusted shared something you told them in private." },
  { id:8,  color:"#D45C8A",  sym:"✦", label:"Rose / Spark",       text:"You worked harder than anyone but someone else got the credit." },
  { id:9,  color:"#5B9BD5",  sym:"◎", label:"Steel / Ring",       text:"You're the only one who thinks something is wrong — and no one believes you." },
  { id:10, color:"#A67BC8",  sym:"☾", label:"Plum / Moon",        text:"You made a mistake in front of everyone and now you can't stop thinking about it." },
];

const SKITS = [
  { label:"Skit 1", name:"Real Reaction",          desc:"Messy, honest, relatable. Humor is welcome.",          color:C.coral    },
  { label:"Skit 2", name:"Strong Leader Response", desc:"Calmer, more intentional. What does growth look like?", color:C.teal     },
  { label:"Skit 3", name:"Support Moment",         desc:"Someone from their ecosystem shows up. What do they say?", color:C.lavender },
];

const DEBRIEF = [
  "What emotion showed up first in Skit 1?",
  "What changed between Skit 1 and Skit 2 — and why did it work?",
  "Who showed up in Skit 3, and what role in the ecosystem were they playing?",
];

const ROLES = [
  { id:"counselor", label:"Counselor",   title:"The Navigator",   abbr:"C",  icon:"🎓", color:C.sky,      hint:"e.g. school counselor, advisor",     line:"helps you graduate",   def:"Helps you understand systems, requirements, and next steps." },
  { id:"coach",     label:"Coach",       title:"The Trainer",     abbr:"Co", icon:"🏋️", color:C.teal,     hint:"e.g. coach, tutor, trainer",         line:"helps you perform",    def:"Helps you improve a specific skill or performance." },
  { id:"mentor",    label:"Mentor",      title:"The Guide",       abbr:"M",  icon:"🌱", color:C.gold,     hint:"e.g. a leader you look up to",       line:"helps you become",     def:"Helps you figure out who you're becoming. Long-term, wisdom-based." },
  { id:"peer",      label:"Peer",        title:"The Real One",    abbr:"P",  icon:"🤝", color:C.coral,    hint:"e.g. your closest friend",           line:"keeps it real",        def:"Knows the real you. Walks the same road. Reminds you you're not alone." },
  { id:"hype",      label:"Hype Person", title:"The Believer",    abbr:"H",  icon:"📣", color:C.rose,     hint:"e.g. someone who hypes you up",      line:"keeps you believing",  def:"Believes in you louder than your self-doubt." },
  { id:"sponsor",   label:"Sponsor",     title:"The Door Opener", abbr:"S",  icon:"🚪", color:C.lavender, hint:"e.g. someone who recommends you",   line:"opens the doors",      def:"Talks about you when you're not in the room. Opens doors you couldn't open yourself." },
];

const APP_URL = "https://mindofaleader2026.netlify.app"; // ← swap to Netlify URL before event
const TIMER_DUR = 45;
const CIRC = 2 * Math.PI * 45;

// ─── SHARED ──────────────────────────────────────────────────────────
const BackBtn = ({ onBack, label="← Back" }) => (
  <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:rgba(C.white,.42), fontSize:13, fontWeight:600, padding:"18px 22px 10px", display:"block", fontFamily:"'DM Sans',sans-serif" }}>{label}</button>
);

const Divider = ({ text }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px 0 12px" }}>
    <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:rgba(C.white,.3), whiteSpace:"nowrap" }}>{text}</div>
    <div style={{ flex:1, height:1, background:rgba(C.white,.08) }}/>
  </div>
);

// ─── CANVAS CARD RENDERER ────────────────────────────────────────────
// Polyfill roundRect for older browsers
function ensureRoundRect(ctx) {
  if (!ctx.roundRect) {
    ctx.roundRect = function(x, y, w, h, r) {
      this.beginPath();
      this.moveTo(x+r, y);
      this.lineTo(x+w-r, y);
      this.quadraticCurveTo(x+w, y, x+w, y+r);
      this.lineTo(x+w, y+h-r);
      this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      this.lineTo(x+r, y+h);
      this.quadraticCurveTo(x, y+h, x, y+h-r);
      this.lineTo(x, y+r);
      this.quadraticCurveTo(x, y, x+r, y);
      this.closePath();
    };
  }
}

function drawFrontCard(canvas) {
  const W = 750, H = 1300;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  ensureRoundRect(ctx);

  // Background
  ctx.fillStyle = C.navy;
  ctx.fillRect(0, 0, W, H);

  // Top gold bar
  ctx.fillStyle = C.gold;
  ctx.fillRect(0, 0, W, 10);

  // Header
  ctx.fillStyle = C.gold;
  ctx.font = "bold 34px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("MIND OF A LEADER", W/2, 72);

  ctx.fillStyle = rgba(C.white, .45);
  ctx.font = "17px Arial, sans-serif";
  ctx.fillText("JJOA SCR Teen Conference · June 20, 2026 · Valetta Taylor", W/2, 102);

  // Separator
  ctx.strokeStyle = rgba(C.gold, .22);
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, 124); ctx.lineTo(W-50, 124); ctx.stroke();

  // Role rows
  const startY = 148, rowH = 128, padX = 44;
  ROLES.forEach((role, i) => {
    const y = startY + i * rowH;
    const { r, g, b } = hex2rgb(role.color);

    // Row bg
    ctx.fillStyle = `rgba(${r},${g},${b},0.07)`;
    ctx.roundRect(padX, y+6, W-padX*2, rowH-12, 10);
    ctx.fill();

    // Left accent stripe
    ctx.fillStyle = role.color;
    ctx.fillRect(padX, y+6, 5, rowH-12);

    // Colored circle with abbr
    ctx.fillStyle = `rgba(${r},${g},${b},0.18)`;
    ctx.beginPath(); ctx.arc(padX+42, y+rowH/2, 22, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = role.color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(padX+42, y+rowH/2, 22, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = role.color;
    ctx.font = `bold ${role.abbr.length > 1 ? 16 : 20}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(role.abbr, padX+42, y+rowH/2+6);

    // Label
    ctx.fillStyle = C.white;
    ctx.font = "bold 26px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(role.label, padX+78, y+rowH/2-6);

    // One-liner
    ctx.fillStyle = rgba(C.white, .58);
    ctx.font = "20px Arial, sans-serif";
    ctx.fillText(role.line, padX+78, y+rowH/2+24);
  });

  // Tagline
  const tagY = startY + ROLES.length * rowH + 26;
  ctx.fillStyle = rgba(C.gold, .82);
  ctx.font = "italic 20px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText('"You don\'t outgrow support. You upgrade it."', W/2, tagY);

  // Website + QR note
  ctx.fillStyle = rgba(C.white, .28);
  ctx.font = "15px Arial, sans-serif";
  ctx.fillText("Scan the QR code to access the full interactive app", W/2, tagY + 34);
  ctx.fillText("valettataylor.com/leader", W/2, tagY + 58);

  // Bottom gold bar
  ctx.fillStyle = C.gold;
  ctx.fillRect(0, H-10, W, 10);
}

function drawBackCard(canvas) {
  const W = 750, H = 1300;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  ensureRoundRect(ctx);

  ctx.fillStyle = C.navyDeep;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.gold; ctx.fillRect(0, 0, W, 10);
  ctx.fillRect(0, H-10, W, 10);

  // Header
  ctx.fillStyle = C.gold;
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("YOUR MINDSET TEST", W/2, 72);

  ctx.strokeStyle = rgba(C.gold, .2); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 94); ctx.lineTo(W-80, 94); ctx.stroke();

  // Mantra lines
  ctx.fillStyle = rgba(C.white, .82);
  ctx.font = "italic 27px Arial, sans-serif";
  ctx.fillText('"Your mindset isn\'t tested on your best day.', W/2, 148);
  ctx.fillStyle = C.gold;
  ctx.font = "bold italic 27px Arial, sans-serif";
  ctx.fillText('It\'s tested on your hardest one."', W/2, 190);

  ctx.strokeStyle = rgba(C.white, .08); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 218); ctx.lineTo(W-80, 218); ctx.stroke();

  // EQ section
  ctx.fillStyle = C.gold;
  ctx.font = "bold 19px Arial, sans-serif";
  ctx.fillText("THE 5-SECOND EQ TEST", W/2, 262);

  const eqItems = [
    "Pause before reacting",
    "Name the emotion",
    "Ask: Is my response helping or hurting?",
    "Choose your next move intentionally",
    "Reach out to someone in your circle",
  ];

  eqItems.forEach((item, i) => {
    const y = 300 + i * 88;
    const { r, g, b } = hex2rgb(C.gold);

    ctx.fillStyle = `rgba(${r},${g},${b},0.12)`;
    ctx.beginPath(); ctx.arc(110, y+20, 22, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = rgba(C.gold, .4); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(110, y+20, 22, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = C.gold;
    ctx.font = "bold 20px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(i+1), 110, y+27);

    ctx.fillStyle = rgba(C.white, .78);
    ctx.font = "21px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(item, 148, y+27);
  });

  // Commitment line
  const commY = 300 + eqItems.length * 88 + 20;
  ctx.strokeStyle = rgba(C.gold, .2); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(60, commY); ctx.lineTo(W-60, commY); ctx.stroke();

  ctx.fillStyle = rgba(C.gold, .7);
  ctx.font = "bold 18px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("ONE THING I WILL DO THIS WEEK:", W/2, commY + 42);

  ctx.strokeStyle = rgba(C.white, .22); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, commY+90); ctx.lineTo(W-80, commY+90); ctx.stroke();

  // Footer
  ctx.fillStyle = rgba(C.white, .22);
  ctx.font = "15px Arial, sans-serif";
  ctx.fillText("valettataylor.com  ·  Mind of a Leader  ·  JJOA SCR 2026", W/2, H-36);
}

// ─── HOME ────────────────────────────────────────────────────────────
function HomeScreen({ onNav }) {
  const tiles = [
    { key:"standsit",   icon:"🙋", title:"Stand / Sit",     sub:"12-question energy check",           color:C.sky      },
    { key:"lottery",    icon:"🎲", title:"Draw My Group",   sub:"Lottery — find your group number",   color:C.gold     },
    { key:"grouproles", icon:"🎭", title:"Group Roles",     sub:"Cast · Host · Analyst · Scout",      color:C.coral    },
    { key:"skittimer",  icon:"⏱", title:"Skit Timer",      sub:"Assign scenarios + countdown",       color:C.teal     },
    { key:"ecoref",     icon:"🌐", title:"Role Reference",  sub:"What each of the 6 roles means",     color:C.lavender },
    { key:"ecosystem",  icon:"⭕", title:"Build My Circle", sub:"Name your 6-role ecosystem",         color:C.rose     },
    { key:"pocketcard", icon:"📲", title:"Pocket Card",     sub:"Download your take-home card",       color:C.sky      },
  ];

  return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:48 }}>
      <div style={{ background:`linear-gradient(170deg,${C.navyDeep} 0%,${C.navy} 100%)`, padding:"52px 24px 36px", borderBottom:`1px solid ${rgba(C.gold,.12)}` }}>
        <div style={{ fontSize:10, letterSpacing:3, textTransform:"uppercase", color:C.gold, fontWeight:700, marginBottom:12 }}>JJOA SCR Teen Conference · June 2026</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:10 }}>
          Mind of a<br/><span style={{ color:C.gold }}>Leader</span>
        </div>
        <div style={{ fontSize:13, color:rgba(C.white,.4), letterSpacing:.5 }}>Grit · Emotional Intelligence · Mental Fortitude</div>
      </div>
      <div style={{ padding:"28px 18px 0" }}>

        {/* Welcome Banner */}
        <div style={{ background:`linear-gradient(135deg,${rgba(C.gold,.1)} 0%,${rgba(C.teal,.08)} 100%)`, border:`1px solid ${rgba(C.gold,.28)}`, borderRadius:16, padding:"18px 20px", marginBottom:20 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:C.gold, marginBottom:8 }}>👋 Welcome</div>
          <div style={{ fontSize:15, color:C.white, fontWeight:600, lineHeight:1.5, marginBottom:6 }}>You're in the right place.</div>
          <div style={{ fontSize:13, color:rgba(C.white,.65), lineHeight:1.7 }}>
            Hold tight — <strong style={{ color:C.white }}>don't tap anything yet.</strong> Your facilitator will guide you to each screen as the session moves forward.
          </div>
          <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${rgba(C.gold,.15)}`, fontSize:12, color:rgba(C.gold,.7), fontStyle:"italic", lineHeight:1.6 }}>
            "Your mindset isn't tested on your best day. It's tested on your hardest one."
          </div>
        </div>

        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:rgba(C.white,.3), marginBottom:14 }}>Session Tools</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          {tiles.map(t => (
            <button key={t.key} onClick={() => onNav(t.key)} style={{ background:rgba(t.color,.08), border:`1px solid ${rgba(t.color,.22)}`, borderTop:`3px solid ${t.color}`, borderRadius:14, padding:"18px 15px 16px", cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans',sans-serif" }}>
              <div style={{ fontSize:26, marginBottom:9, lineHeight:1 }}>{t.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:4, lineHeight:1.2 }}>{t.title}</div>
              <div style={{ fontSize:11, color:rgba(C.white,.42), lineHeight:1.45 }}>{t.sub}</div>
            </button>
          ))}
        </div>
        <div style={{ marginTop:12, background:rgba(C.gold,.07), border:`1px solid ${rgba(C.gold,.18)}`, borderRadius:14, padding:"18px 20px", textAlign:"center" }}>
          <div style={{ fontSize:13, fontStyle:"italic", color:rgba(C.gold,.85), lineHeight:1.7 }}>"Your mindset isn't tested on your best day.<br/>It's tested on your hardest one."</div>
          <div style={{ fontSize:11, color:rgba(C.white,.28), marginTop:8, fontWeight:600 }}>— Valetta Taylor</div>
        </div>
      </div>
    </div>
  );
}

// ─── STAND / SIT ─────────────────────────────────────────────────────
function StandSitScreen({ onBack }) {
  const [idx, setIdx] = useState(0);
  const q = QUESTIONS[idx];
  const theme = THEMES[q.t];
  const isLast = idx === QUESTIONS.length-1;

  return (
    <div style={{ background:C.navy, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <BackBtn onBack={onBack} />
      <div style={{ padding:"2px 22px 12px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:theme.color, background:rgba(theme.color,.1), padding:"4px 12px", borderRadius:20 }}>{theme.label}</span>
        <span style={{ fontSize:12, color:rgba(C.white,.3), fontWeight:600 }}>{idx+1} of {QUESTIONS.length}</span>
      </div>
      <div style={{ height:3, background:rgba(C.white,.07), margin:"0 22px 28px" }}>
        <div style={{ height:"100%", borderRadius:2, background:theme.color, width:`${((idx+1)/QUESTIONS.length)*100}%`, transition:"width .35s ease" }}/>
      </div>
      <div key={idx} style={{ flex:1, padding:"0 24px 24px", display:"flex", flexDirection:"column", justifyContent:"center", animation:"fadeIn .28s ease" }}>
        <div style={{ borderLeft:`4px solid ${theme.color}`, paddingLeft:20, marginBottom:24 }}>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:C.white, lineHeight:1.4 }}>{q.q}</div>
        </div>
        <div style={{ background:rgba(theme.color,.07), border:`1px solid ${rgba(theme.color,.2)}`, borderRadius:12, padding:"15px 18px" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:theme.color, marginBottom:7 }}>Then →</div>
          <div style={{ fontSize:14, color:rgba(C.white,.78), fontStyle:"italic", lineHeight:1.6 }}>{q.a}</div>
        </div>
      </div>
      <div style={{ padding:"0 20px 44px", display:"flex", gap:10 }}>
        <button onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0} style={{ flex:1, padding:"15px", borderRadius:12, border:`1px solid ${rgba(C.white,.12)}`, background:"none", color:idx===0?rgba(C.white,.2):rgba(C.white,.65), fontSize:14, fontWeight:600, cursor:idx===0?"not-allowed":"pointer", fontFamily:"'DM Sans',sans-serif" }}>← Prev</button>
        <button onClick={() => !isLast&&setIdx(i=>i+1)} style={{ flex:2, padding:"15px", borderRadius:12, border:"none", background:isLast?rgba(C.gold,.25):theme.color, color:C.white, fontSize:14, fontWeight:700, cursor:isLast?"default":"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          {isLast?"✓ Complete":"Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── GROUP ROLES ─────────────────────────────────────────────────────
function GroupRolesScreen({ onBack }) {
  return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:44 }}>
      <BackBtn onBack={onBack} />
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:C.white, lineHeight:1.15, marginBottom:6 }}>Group Roles</div>
        <div style={{ fontSize:13, color:rgba(C.white,.45), marginBottom:24 }}>Groups of 8–10 · Every person has a named job</div>
        {GROUP_ROLES.map((role,i) => (
          <div key={role.label} style={{ background:rgba(role.color,.07), border:`1px solid ${rgba(role.color,.2)}`, borderLeft:`4px solid ${role.color}`, borderRadius:14, padding:"18px 18px 16px", marginBottom:12, animation:`fadeIn ${.1+i*.07}s ease` }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
              <span style={{ fontSize:26 }}>{role.icon}</span>
              <div>
                <div style={{ fontSize:16, fontWeight:700, color:C.white }}>{role.label}</div>
                <div style={{ fontSize:12, color:role.color, fontWeight:700 }}>{role.count} {role.count===1?"person":"people"}</div>
              </div>
            </div>
            <div style={{ fontSize:13, color:rgba(C.white,.72), lineHeight:1.6, marginBottom:10 }}>{role.desc}</div>
            <div style={{ fontSize:12, color:rgba(C.white,.4), fontStyle:"italic", borderTop:`1px solid ${rgba(C.white,.06)}`, paddingTop:10 }}>💡 {role.tip}</div>
          </div>
        ))}
        <div style={{ background:rgba(C.gold,.07), border:`1px solid ${rgba(C.gold,.2)}`, borderRadius:14, padding:"16px 20px", textAlign:"center", marginTop:4 }}>
          <div style={{ fontSize:13, color:rgba(C.gold,.85), fontStyle:"italic", lineHeight:1.75 }}>"The Cast plays. The Hosts call the game.<br/>The Analysts break down the tape.<br/>The Scout caught what the cameras missed."</div>
        </div>
        <div style={{ marginTop:12, background:rgba(C.teal,.07), border:`1px solid ${rgba(C.teal,.2)}`, borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18 }}>⏱</span>
          <div style={{ fontSize:12, color:rgba(C.white,.6), lineHeight:1.55 }}>
            <strong style={{ color:C.teal, display:"block", marginBottom:3 }}>Simultaneous Mode</strong>
            All groups run their skits at the same time. One shared timer on screen. Debrief together after.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SKIT TIMER ──────────────────────────────────────────────────────
function SkitTimerScreen({ onBack }) {
  const [phase, setPhase] = useState("pick");
  const [scenario, setScenario] = useState(null);
  const [skitIdx, setSkitIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DUR);
  const [running, setRunning] = useState(false);
  const [skitDone, setSkitDone] = useState(false);
  const tickRef = useRef(null);

  const skit = SKITS[skitIdx];
  const dashOffset = CIRC * (timeLeft / TIMER_DUR);

  useEffect(() => {
    if (running && timeLeft > 0) {
      tickRef.current = setTimeout(() => setTimeLeft(t=>t-1), 1000);
    } else if (running && timeLeft === 0) {
      setRunning(false); setSkitDone(true);
    }
    return () => clearTimeout(tickRef.current);
  }, [running, timeLeft]);

  const advanceSkit = () => {
    if (skitIdx < SKITS.length-1) {
      setSkitIdx(i=>i+1); setTimeLeft(TIMER_DUR); setSkitDone(false); setRunning(true);
    } else { setPhase("debrief"); }
  };

  const reset = () => { clearTimeout(tickRef.current); setPhase("pick"); setScenario(null); setSkitIdx(0); setTimeLeft(TIMER_DUR); setRunning(false); setSkitDone(false); };

  const [numGroups, setNumGroups] = useState(10);
  const [groupAssignments, setGroupAssignments] = useState([]);

  const assignScenarios = () => {
    const shuffled = [...SCENARIOS].sort(() => Math.random() - 0.5);
    const assignments = Array.from({ length: numGroups }, (_, i) => ({
      group: i + 1,
      scenario: shuffled[i % shuffled.length],
    }));
    setGroupAssignments(assignments);
    setPhase("assignments");
  };

  if (phase === "pick") return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:44 }}>
      <BackBtn onBack={onBack} />
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:C.white, marginBottom:6 }}>Skit Timer</div>
        <div style={{ fontSize:13, color:rgba(C.white,.45), marginBottom:20 }}>Assign scenarios to groups, then start simultaneously</div>

        {/* Group count picker */}
        <div style={{ background:rgba(C.white,.04), border:`1px solid ${rgba(C.white,.1)}`, borderRadius:14, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:rgba(C.white,.4), marginBottom:10 }}>Number of Groups</div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <button onClick={() => setNumGroups(n=>Math.max(2,n-1))} style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${rgba(C.white,.2)}`, background:"none", color:C.white, fontSize:20, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>−</button>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:900, color:C.gold, minWidth:40, textAlign:"center" }}>{numGroups}</div>
            <button onClick={() => setNumGroups(n=>Math.min(12,n+1))} style={{ width:38, height:38, borderRadius:"50%", border:`1px solid ${rgba(C.white,.2)}`, background:"none", color:C.white, fontSize:20, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>+</button>
            <div style={{ fontSize:12, color:rgba(C.white,.35), lineHeight:1.5 }}>Morning: 10<br/>Afternoon: 10</div>
          </div>
        </div>

        <button onClick={assignScenarios} style={{ width:"100%", padding:"18px", background:C.gold, border:"none", borderRadius:14, color:C.navy, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:10 }}>
          🎲 Assign Scenarios to All Groups
        </button>
        <div style={{ textAlign:"center", fontSize:12, color:rgba(C.white,.3) }}>Each group gets a different scenario randomly</div>
      </div>
    </div>
  );

  if (phase === "assignments") return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:44 }}>
      <button onClick={() => setPhase("pick")} style={{ background:"none", border:"none", cursor:"pointer", color:rgba(C.white,.4), fontSize:13, fontWeight:600, padding:"18px 22px 10px", fontFamily:"'DM Sans',sans-serif" }}>← Reassign</button>
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:900, color:C.white, marginBottom:4 }}>Group Scenarios</div>
        <div style={{ fontSize:13, color:rgba(C.white,.45), marginBottom:16 }}>Show this on the projector — each group finds theirs</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
          {groupAssignments.map(({ group, scenario: s }) => (
            <div key={group} style={{ background:rgba(s.color,.1), border:`1px solid ${rgba(s.color,.3)}`, borderRadius:12, padding:"12px 14px" }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", color:s.color, marginBottom:4 }}>Group {group}</div>
              <div style={{ fontSize:18, marginBottom:4 }}>{s.sym}</div>
              <div style={{ fontSize:11, color:rgba(C.white,.6), lineHeight:1.45 }}>{s.text}</div>
            </div>
          ))}
        </div>
        <button onClick={() => { setPhase("timer"); setRunning(true); }} style={{ width:"100%", padding:"18px", background:C.teal, border:"none", borderRadius:14, color:C.white, fontSize:16, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          ▶ Start All Groups Simultaneously
        </button>
      </div>
    </div>
  );

  if (phase === "timer") return (
    <div style={{ background:C.navyDeep, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", padding:"16px 20px 44px" }}>
      <button onClick={reset} style={{ alignSelf:"flex-start", background:"none", border:"none", color:rgba(C.white,.32), fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", padding:"4px 0 12px" }}>← Reset</button>
      <div style={{ display:"flex", gap:8, marginBottom:28 }}>
        {SKITS.map((s,i)=><div key={i} style={{ width:64, height:4, borderRadius:2, background:i<skitIdx?rgba(s.color,.5):i===skitIdx?s.color:rgba(C.white,.1), transition:"background .3s ease" }}/>)}
      </div>
      <div key={skitIdx} style={{ textAlign:"center", marginBottom:28, animation:"fadeIn .3s ease" }}>
        <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:skit.color, marginBottom:6 }}>{skit.label}</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:C.white, marginBottom:8 }}>{skit.name}</div>
        <div style={{ fontSize:13, color:rgba(C.white,.5), fontStyle:"italic", maxWidth:280, textAlign:"center" }}>{skit.desc}</div>
      </div>
      <div style={{ position:"relative", width:150, height:150, marginBottom:28 }}>
        <svg width="150" height="150" style={{ transform:"rotate(-90deg)" }}>
          <circle cx="75" cy="75" r="45" fill="none" stroke={rgba(skit.color,.12)} strokeWidth="9"/>
          <circle cx="75" cy="75" r="45" fill="none" stroke={skit.color} strokeWidth="9" strokeDasharray={CIRC} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition:"stroke-dashoffset .95s linear" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          {skitDone ? <div style={{ fontSize:36, color:C.gold, animation:"scaleIn .3s ease" }}>✓</div> : <><div style={{ fontSize:44, fontWeight:700, color:C.white, lineHeight:1, fontFamily:"'DM Sans',sans-serif" }}>{timeLeft}</div><div style={{ fontSize:11, color:rgba(C.white,.35), marginTop:2 }}>sec</div></>}
        </div>
      </div>
      {scenario&&<div style={{ background:rgba(scenario.color,.08), border:`1px solid ${rgba(scenario.color,.22)}`, borderRadius:12, padding:"12px 16px", width:"100%", maxWidth:340, textAlign:"center", marginBottom:20 }}><div style={{ fontSize:12, color:rgba(C.white,.6), lineHeight:1.55 }}>{scenario.text}</div></div>}
      {skitDone
        ? <button onClick={advanceSkit} style={{ padding:"16px 36px", borderRadius:14, border:"none", background:skitIdx<SKITS.length-1?skit.color:C.gold, color:skitIdx<SKITS.length-1?C.white:C.navy, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", animation:"scaleIn .25s ease" }}>
            {skitIdx<SKITS.length-1?`Start ${SKITS[skitIdx+1].label} →`:"Go to Debrief →"}
          </button>
        : <button onClick={()=>setRunning(r=>!r)} style={{ padding:"13px 30px", borderRadius:12, background:rgba(C.white,.06), border:`1px solid ${rgba(C.white,.14)}`, color:rgba(C.white,.7), fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{running?"⏸ Pause":"▶ Resume"}</button>
      }
    </div>
  );

  return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:44 }}>
      <div style={{ padding:"28px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:C.white, marginBottom:6 }}>Debrief</div>
        <div style={{ fontSize:13, color:rgba(C.gold,.8), fontWeight:600, marginBottom:24 }}>Great work. Now let's break it down.</div>
        {DEBRIEF.map((dq,i)=>(
          <div key={i} style={{ background:rgba(C.white,.04), border:`1px solid ${rgba(C.white,.08)}`, borderRadius:14, padding:"18px 20px", marginBottom:12 }}>
            <div style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase", marginBottom:8 }}>Question {i+1}</div>
            <div style={{ fontSize:15, color:C.white, lineHeight:1.6 }}>{dq}</div>
          </div>
        ))}
        <button onClick={reset} style={{ width:"100%", marginTop:6, padding:"15px", background:"none", border:`1px solid ${rgba(C.white,.12)}`, borderRadius:12, color:rgba(C.white,.5), fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>← Run Another Scenario</button>
      </div>
    </div>
  );
}

// ─── ROLE REFERENCE ───────────────────────────────────────────────────
function EcoRefScreen({ onBack, onBuild }) {
  return (
    <div style={{ background:C.navy, minHeight:"100vh", paddingBottom:44 }}>
      <BackBtn onBack={onBack} />
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:C.white, lineHeight:1.15, marginBottom:6 }}>Your Leadership<br/><span style={{ color:C.gold }}>Ecosystem</span></div>
        <div style={{ fontSize:13, color:rgba(C.white,.45), fontStyle:"italic", marginBottom:4, lineHeight:1.55 }}>Strong leaders don't do life alone. They build the right support around them.</div>
        <Divider text="Formal Support" />
        {ROLES.slice(0,3).map(role=>(
          <div key={role.id} style={{ background:rgba(role.color,.07), border:`1px solid ${rgba(role.color,.2)}`, borderLeft:`4px solid ${role.color}`, borderRadius:12, padding:"14px 17px", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}><span style={{ fontSize:20 }}>{role.icon}</span><span style={{ fontSize:14, fontWeight:700, color:C.white }}>{role.label}</span><span style={{ fontSize:11, color:role.color, fontWeight:600 }}>{role.title}</span></div>
            <div style={{ fontSize:13, color:rgba(C.white,.65), lineHeight:1.55 }}>{role.def}</div>
          </div>
        ))}
        <Divider text="Your Personal Circle" />
        {ROLES.slice(3).map(role=>(
          <div key={role.id} style={{ background:rgba(role.color,.07), border:`1px solid ${rgba(role.color,.2)}`, borderLeft:`4px solid ${role.color}`, borderRadius:12, padding:"14px 17px", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}><span style={{ fontSize:20 }}>{role.icon}</span><span style={{ fontSize:14, fontWeight:700, color:C.white }}>{role.label}</span><span style={{ fontSize:11, color:role.color, fontWeight:600 }}>{role.title}</span></div>
            <div style={{ fontSize:13, color:rgba(C.white,.65), lineHeight:1.55 }}>{role.def}</div>
          </div>
        ))}
        <div style={{ background:rgba(C.gold,.07), border:`1px solid ${rgba(C.gold,.18)}`, borderRadius:12, padding:"14px 18px", textAlign:"center", margin:"8px 0 20px" }}>
          <div style={{ fontSize:13, color:rgba(C.gold,.85), fontStyle:"italic", lineHeight:1.75 }}>"Your mentor believes in you.<br/>Your sponsor tells other people about you."</div>
          <div style={{ fontSize:11, color:rgba(C.white,.28), marginTop:6 }}>— Valetta Taylor</div>
        </div>
        <button onClick={onBuild} style={{ width:"100%", padding:"18px", borderRadius:14, border:"none", background:C.lavender, color:C.white, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Build My Circle →</button>
      </div>
    </div>
  );
}

// ─── ROLE INPUT STEP (isolated to avoid conditional hook) ────────────
function RoleStep({ role, roleIdx, answer, onNext, onBack, onSkip }) {
  const [val, setVal] = useState(answer || "");
  return (
    <div style={{ background:C.navy, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:rgba(C.white,.4), fontSize:13, fontWeight:600, padding:"18px 22px 10px", fontFamily:"'DM Sans',sans-serif" }}>← Back</button>
      <div style={{ padding:"0 22px 16px", display:"flex", gap:5 }}>
        {ROLES.map((_,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=roleIdx?role.color:rgba(C.white,.1), transition:"background .3s ease" }}/>)}
      </div>
      <div style={{ flex:1, padding:"8px 24px 40px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:38, marginBottom:10 }}>{role.icon}</div>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:role.color, marginBottom:6 }}>{role.title}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:C.white, marginBottom:10 }}>{role.label}</div>
          <div style={{ fontSize:13, color:rgba(C.white,.58), lineHeight:1.6, maxWidth:290, margin:"0 auto" }}>{role.def}</div>
        </div>
        <div style={{ fontSize:11, color:rgba(C.white,.38), marginBottom:8, letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Who is your {role.label}?</div>
        <input value={val} onChange={e=>setVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onNext(val)} placeholder={role.hint} style={{ width:"100%", padding:"16px 18px", borderRadius:12, border:`1px solid ${rgba(role.color,.4)}`, background:rgba(role.color,.06), color:C.white, fontSize:15, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:12 }}/>
        <button onClick={()=>onNext(val)} style={{ width:"100%", padding:"18px", borderRadius:14, border:"none", background:role.color, color:C.white, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          {roleIdx<ROLES.length-1?"Next →":"See My Circle →"}
        </button>
        <button onClick={onSkip} style={{ width:"100%", marginTop:8, padding:"12px", borderRadius:12, background:"none", border:`1px solid ${rgba(C.white,.1)}`, color:rgba(C.white,.38), fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Still searching… skip for now</button>
      </div>
    </div>
  );
}

// ─── ECOSYSTEM BUILDER ───────────────────────────────────────────────
function EcosystemScreen({ onBack }) {
  const [step, setStep] = useState("name");
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState(["","","","","",""]);

  const handleRoleNext = (idx, val) => {
    const upd = [...answers]; upd[idx] = val; setAnswers(upd);
    setStep(idx < ROLES.length-1 ? idx+1 : "card");
  };

  const shareCard = () => {
    const lines = [`⭕ My Leadership Circle — ${name}`, "", ...ROLES.map((r,i)=>`${r.icon} ${r.label}: ${answers[i]||"Still searching…"}`), "", `"You don't outgrow support. You upgrade it."`, `— Mind of a Leader · JJOA SCR 2026`].join("\n");
    if (navigator.share) navigator.share({ title:"My Leadership Circle", text:lines });
    else if (navigator.clipboard) navigator.clipboard.writeText(lines);
  };

  if (step === "name") return (
    <div style={{ background:C.navy, minHeight:"100vh", display:"flex", flexDirection:"column" }}>
      <BackBtn onBack={onBack} />
      <div style={{ flex:1, padding:"12px 24px 48px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:8 }}>Build Your<br/><span style={{ color:C.gold }}>Circle</span></div>
        <div style={{ fontSize:14, color:rgba(C.white,.45), marginBottom:36, lineHeight:1.55 }}>You'll name one person for each of the 6 roles in your leadership ecosystem.</div>
        <div style={{ fontSize:11, color:rgba(C.white,.38), marginBottom:8, letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 }}>Your name</div>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(0)} placeholder="Type your first name…" style={{ width:"100%", padding:"17px 18px", borderRadius:12, border:`1px solid ${rgba(C.white,.18)}`, background:rgba(C.white,.06), color:C.white, fontSize:16, fontFamily:"'DM Sans',sans-serif", outline:"none", marginBottom:14 }}/>
        <button onClick={()=>name.trim()&&setStep(0)} disabled={!name.trim()} style={{ width:"100%", padding:"18px", borderRadius:14, border:"none", background:name.trim()?C.lavender:rgba(C.white,.07), color:C.white, fontSize:15, fontWeight:700, cursor:name.trim()?"pointer":"not-allowed", fontFamily:"'DM Sans',sans-serif" }}>Let's Build It →</button>
      </div>
    </div>
  );

  if (typeof step === "number") {
    return <RoleStep key={step} role={ROLES[step]} roleIdx={step} answer={answers[step]} onNext={val=>handleRoleNext(step,val)} onBack={()=>setStep(step>0?step-1:"name")} onSkip={()=>handleRoleNext(step,"")} />;
  }

  return (
    <div style={{ background:C.navyDeep, minHeight:"100vh", paddingBottom:48 }}>
      <button onClick={()=>setStep(ROLES.length-1)} style={{ background:"none", border:"none", cursor:"pointer", color:rgba(C.white,.35), fontSize:13, fontWeight:600, padding:"18px 22px 10px", fontFamily:"'DM Sans',sans-serif" }}>← Edit</button>
      <div style={{ padding:"4px 20px 0" }}>
        <div style={{ background:`linear-gradient(145deg,${C.navyMid} 0%,${C.navy} 100%)`, border:`1px solid ${rgba(C.gold,.22)}`, borderRadius:20, padding:"24px 20px", marginBottom:16, animation:"scaleIn .3s ease" }}>
          <div style={{ textAlign:"center", marginBottom:20, paddingBottom:16, borderBottom:`1px solid ${rgba(C.white,.07)}` }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:2.5, textTransform:"uppercase", color:C.gold, marginBottom:6 }}>My Leadership Circle</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:C.white }}>{name}</div>
          </div>
          {ROLES.map((r,i)=>(
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 13px", background:rgba(r.color,.07), border:`1px solid ${rgba(r.color,.15)}`, borderRadius:10, marginBottom:8 }}>
              <span style={{ fontSize:18 }}>{r.icon}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:r.color, marginBottom:2 }}>{r.label}</div>
                <div style={{ fontSize:14, color:answers[i]?C.white:rgba(C.white,.28), fontStyle:answers[i]?"normal":"italic", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{answers[i]||"Still searching…"}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:14, background:rgba(C.gold,.06), borderRadius:10, padding:"12px 16px", textAlign:"center" }}>
            <div style={{ fontSize:12, color:rgba(C.gold,.8), fontStyle:"italic", lineHeight:1.65 }}>"You don't outgrow support. You upgrade it."</div>
          </div>
        </div>
        <button onClick={shareCard} style={{ width:"100%", padding:"17px", borderRadius:14, border:"none", background:C.gold, color:C.navy, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:10 }}>Share My Circle ↗</button>
        <div style={{ textAlign:"center", fontSize:12, color:rgba(C.white,.25), paddingBottom:8 }}>📸 Screenshot to keep your circle</div>
      </div>
    </div>
  );
}

// ─── POCKET CARD ─────────────────────────────────────────────────────
function PocketCardScreen({ onBack }) {
  const [side, setSide] = useState("front");
  const [toast, setToast] = useState("");
  const frontRef = useRef(null);
  const backRef = useRef(null);

  // Draw cards on mount and side change
  useEffect(() => {
    if (frontRef.current) drawFrontCard(frontRef.current);
    if (backRef.current) drawBackCard(backRef.current);
  }, []);

  const download = (canvasRef, filename) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement("a");
      link.download = filename;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setToast("Downloading…");
      setTimeout(() => setToast(""), 2200);
    } catch {
      setToast("📸 Screenshot to save!");
      setTimeout(() => setToast(""), 2200);
    }
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=0B1E3D&bgcolor=D4A843&data=${encodeURIComponent(APP_URL)}`;

  return (
    <div style={{ background:C.navyDeep, minHeight:"100vh", paddingBottom:52 }}>
      <BackBtn onBack={onBack} />
      <div style={{ padding:"4px 22px 0" }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, color:C.white, lineHeight:1.15, marginBottom:4 }}>Pocket Card</div>
        <div style={{ fontSize:13, color:rgba(C.white,.45), marginBottom:20 }}>Digital take-home — download or screenshot</div>

        {/* Side toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:16, background:rgba(C.white,.05), padding:5, borderRadius:12 }}>
          {["front","back"].map(s=>(
            <button key={s} onClick={()=>setSide(s)} style={{ flex:1, padding:"10px", borderRadius:9, border:"none", background:side===s?C.navy:"none", color:side===s?C.gold:rgba(C.white,.45), fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", textTransform:"capitalize", transition:"all .2s ease" }}>
              {s==="front"?"Front — 6 Roles":"Back — EQ Test"}
            </button>
          ))}
        </div>

        {/* Canvas previews */}
        <div style={{ position:"relative" }}>
          <canvas ref={frontRef} style={{ width:"100%", borderRadius:12, display:side==="front"?"block":"none", boxShadow:`0 8px 32px ${rgba(C.navy,.8)}` }}/>
          <canvas ref={backRef}  style={{ width:"100%", borderRadius:12, display:side==="back" ?"block":"none", boxShadow:`0 8px 32px ${rgba(C.navy,.8)}` }}/>
        </div>

        {/* Download button */}
        <button onClick={()=>download(side==="front"?frontRef:backRef, `mind-of-a-leader-${side}.png`)} style={{ width:"100%", marginTop:14, padding:"17px", borderRadius:14, border:"none", background:C.gold, color:C.navy, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>
          ↓ Download {side==="front"?"Front":"Back"} Card
        </button>
        <div style={{ textAlign:"center", marginTop:8, fontSize:12, color:rgba(C.white,.3) }}>
          or 📸 screenshot the card above to save
        </div>

        {/* QR Test Section */}
        <div style={{ marginTop:24, background:rgba(C.white,.04), border:`1px solid ${rgba(C.white,.1)}`, borderRadius:16, padding:"20px", textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:2, textTransform:"uppercase", color:rgba(C.gold,.8), marginBottom:14 }}>QR Code Test</div>
          <div style={{ background:C.gold, borderRadius:12, padding:10, display:"inline-block", marginBottom:12 }}>
            <img src={qrUrl} alt="QR Code" style={{ width:120, height:120, display:"block", borderRadius:6 }} onError={e=>{ e.target.style.display="none"; }}/>
          </div>
          <div style={{ fontSize:12, color:rgba(C.white,.55), lineHeight:1.65, marginBottom:8 }}>
            Scan to test the app link<br/>
            <span style={{ color:rgba(C.gold,.7), fontWeight:600 }}>{APP_URL}</span>
          </div>
          <div style={{ fontSize:11, color:rgba(C.white,.28), background:rgba(C.coral,.1), border:`1px solid ${rgba(C.coral,.25)}`, borderRadius:8, padding:"8px 12px", textAlign:"left" }}>
            ⚠️ Update <code style={{ color:C.coral, fontSize:11 }}>APP_URL</code> at the top of the file once deployed to Netlify — the QR updates automatically.
          </div>
        </div>

        {toast && (
          <div style={{ position:"fixed", bottom:32, left:"50%", transform:"translateX(-50%)", background:C.teal, color:C.white, fontSize:13, fontWeight:700, padding:"10px 24px", borderRadius:24, boxShadow:"0 4px 20px rgba(0,0,0,.4)", zIndex:999, animation:"scaleIn .2s ease" }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  useFonts();
  const [screen, setScreen] = useState("home");
  const nav = s => setScreen(s);

  const screens = {
    home:       <HomeScreen onNav={nav} />,
    standsit:   <StandSitScreen onBack={()=>nav("home")} />,
    lottery:    <LotteryScreen onBack={()=>nav("home")} />,
    grouproles: <GroupRolesScreen onBack={()=>nav("home")} />,
    skittimer:  <SkitTimerScreen onBack={()=>nav("home")} />,
    ecoref:     <EcoRefScreen onBack={()=>nav("home")} onBuild={()=>nav("ecosystem")} />,
    ecosystem:  <EcosystemScreen onBack={()=>nav("home")} />,
    pocketcard: <PocketCardScreen onBack={()=>nav("home")} />,
  };

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:"100vh", maxWidth:480, margin:"0 auto", background:C.navy }}>
      <div key={screen} style={{ animation:"fadeIn .22s ease" }}>
        {screens[screen]}
      </div>
    </div>
  );
}

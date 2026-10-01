"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft, Bell, ChevronRight, Gift, Heart, Home, Image as ImageIcon,
  Lock, MessageCircleHeart, Music2, PawPrint, Plus, Send, Settings,
  Sparkles, X, Gamepad2
} from "lucide-react";

type Tab = "world" | "notes" | "gifts" | "music" | "games" | "memories";

const tabs: {id:Tab; label:string; icon:typeof Home}[] = [
  {id:"world",label:"World",icon:Home},{id:"notes",label:"Notes",icon:MessageCircleHeart},
  {id:"gifts",label:"Gifts",icon:Gift},{id:"music",label:"Music",icon:Music2},
  {id:"games",label:"Games",icon:Gamepad2},{id:"memories",label:"Memories",icon:ImageIcon}
];

const seedNotes = [
  {text:"Guten Morgen ❤️",time:"Today, 08:12",tone:"pink"},
  {text:"Ich vermisse dich schon ...",time:"Yesterday, 22:41",tone:"lavender"},
  {text:"Schau hinter das Sofa 👀",time:"Yesterday, 17:23",tone:"peach"},
  {text:"Du machst mein Leben so viel schöner ❤️",time:"12 Sep 2026, 14:02",tone:"gold"}
];

const gifts = [["🌹","Rose"],["🧸","Teddy"],["💌","Love Letter"],["🍫","Chocolate"],["💗","Heart Box"],["💍","Ring"],["⭐","Star"],["🌙","Moon"],["💐","Flower Box"]];

export default function HomePage(){
  const [tab,setTab]=useState<Tab>("world"), [hearts,setHearts]=useState(12);
  const [notes,setNotes]=useState(seedNotes), [composer,setComposer]=useState(false);
  const [draft,setDraft]=useState(""), [toast,setToast]=useState<string|null>(null);
  const title=useMemo(()=>tabs.find(t=>t.id===tab)?.label??"World",[tab]);
  function notify(message:string){setToast(message);window.setTimeout(()=>setToast(null),2200)}
  function sendNote(){const text=draft.trim();if(!text)return;setNotes([{text,time:"Just now",tone:"pink"},...notes]);setDraft("");setComposer(false);notify("Your note is waiting in your world.")}
  return <main className="app"><div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <section className="phone-shell">
      <header className="topbar">{tab==="world"?<div className="brand"><div className="brand-mark"><span className="moon-icon">☾</span></div><div><strong>Our Little World</strong><span>just for us</span></div></div>:<button className="icon-button" onClick={()=>setTab("world")}><ArrowLeft size={19}/></button>}
        <div className="top-actions"><button className="status-pill" onClick={()=>notify("You're both safe in your private world.")}><span className="online-dot"/><Lock size={12}/> private</button><button className="icon-button" onClick={()=>notify("Settings are coming next.")}><Settings size={18}/></button></div>
      </header>

      {tab==="world"&&<><div className="world-heading"><div><p className="eyebrow">THURSDAY · 01 OCTOBER</p><h1>Good evening, Ilias <span>♡</span></h1></div><button className="bell" onClick={()=>notify("No new surprises.")}><Bell size={18}/><i/></button></div>
        <div className="room"><div className="stars">✦　·　✧　　·　✦　　·　✧</div><div className="moon">☾</div><div className="window-city"><span/><span/><span/><span/><span/></div><div className="curtain curtain-left"/><div className="curtain curtain-right"/>
          <div className="shelf"><span>♡</span><span>🌿</span><span>◌</span></div><div className="plant plant-left">🌿</div><div className="lamp">◉<small>╱</small></div>
          <div className="sofa"><div className="cushion one"/><div className="cushion two"/><div className="blanket"/></div><div className="table"><span>🕯️</span><b>♡</b></div><div className="rug"/>
          <div className="pet"><PawPrint size={14}/><span>your little buddy</span></div>
          <div className="avatar ilias"><div className="bubble">You're here <span>♡</span></div><div className="avatar-head dark">⌣</div><div className="avatar-body dark"/><label>Ilias</label></div>
          <div className="avatar her"><div className="heart-float">♥</div><div className="avatar-head brown">⌣</div><div className="avatar-body pink"/><label>Her</label></div>
        </div>
        <div className="presence-card"><div className="presence-avatars"><span className="mini-avatar dark">I</span><span className="mini-avatar pink">♡</span></div><div><strong>You're together</strong><span>Both online right now</span></div><button onClick={()=>{setHearts(h=>h+1);notify("Heart sent ❤️")}}><Heart size={17} fill="currentColor"/>{hearts}</button></div>
        <div className="quick-grid"><Quick icon={<MessageCircleHeart/>} label="Leave a note" onClick={()=>{setTab("notes");setComposer(true)}}/><Quick icon={<Gift/>} label="Send a gift" onClick={()=>setTab("gifts")}/><Quick icon={<Music2/>} label="Our music" onClick={()=>setTab("music")}/><Quick icon={<Gamepad2/>} label="Play together" onClick={()=>setTab("games")}/></div>
        <div className="section-row"><div><span>Little moments</span><small>your world grows with you</small></div><Sparkles size={18}/></div>
        <div className="moment-strip"><div className="moment-card photo"><span>09.12</span><b>Our first trip</b></div><div className="moment-card sunset"><span>08.05</span><b>Just us</b></div><div className="moment-card pet-card"><span>07.22</span><b>Our little buddy</b></div></div>
      </>}

      {tab!=="world"&&<section className="subpage"><div className="subpage-title"><div><p className="eyebrow">OUR WORLD</p><h1>{title}</h1></div>{tab==="notes"&&<button className="round-plus" onClick={()=>setComposer(true)}><Plus size={19}/></button>}</div>
        {tab==="notes"&&<div className="note-list">{notes.map((n,i)=><article className={"note "+n.tone} key={i}><div className="note-icon">💌</div><div><strong>{n.text}</strong><span>{n.time}</span></div><Heart size={16} fill="currentColor"/></article>)}</div>}
        {tab==="gifts"&&<div className="gift-grid">{gifts.map(([emoji,name])=><button key={name} className="gift-card" onClick={()=>notify(name+" sent ❤️")}><span>{emoji}</span><b>{name}</b><small>send to her</small></button>)}</div>}
        {tab==="music"&&<div className="music-page"><div className="album-art">☾<span>our night</span></div><p className="eyebrow">NOW PLAYING</p><h2>Perfect</h2><p>Ed Sheeran · Our playlist</p><div className="progress"><i/></div><div className="player"><button>◀</button><button className="play" onClick={()=>notify("Music controls will sync in realtime.")}>Ⅱ</button><button>▶</button></div><div className="playlist"><Music2 size={18}/><span>Die With A Smile</span><small>Lady Gaga · Bruno Mars</small></div></div>}
        {tab==="games"&&<div className="game-grid">{[["✕○","Tic Tac Toe"],["●●","4 Gewinnt"],["♡?","Truth or Dare"],["?","Quiz about us"],["•••","Would You Rather"],["A B C","Word Game"]].map(([icon,name])=><button className="game-card" key={name} onClick={()=>notify(name+" is ready for you two.")}><span>{icon}</span><b>{name}</b><ChevronRight size={16}/></button>)}</div>}
        {tab==="memories"&&<div className="memory-grid">{[["Our first trip","12.09.2026","🌅"],["You & Me","08.05.2026","🌆"],["Our little buddy","22.07.2026","🐈"],["Paris","14.06.2026","🗼"]].map(([t,d,e])=><button className="memory" key={t}><div>{e}</div><strong>{t}</strong><span>{d}</span></button>)}</div>}
      </section>}

      <nav className="bottom-nav">{tabs.map(({id,label,icon:Icon})=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>
    </section>
    {composer&&<div className="modal-backdrop" onClick={()=>setComposer(false)}><div className="composer" onClick={e=>e.stopPropagation()}><div className="composer-head"><div><p className="eyebrow">A LITTLE SOMETHING</p><h2>Leave her a note</h2></div><button className="icon-button" onClick={()=>setComposer(false)}><X size={18}/></button></div><textarea autoFocus value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write something she'll find in your world..." maxLength={240}/><button className="send-button" onClick={sendNote}><Send size={17}/> Leave it for her</button></div></div>}
    {toast&&<div className="toast"><Sparkles size={16}/>{toast}</div>}
  </main>
}

function Quick({icon,label,onClick}:{icon:React.ReactNode;label:string;onClick:()=>void}){return <button className="quick" onClick={onClick}><span>{icon}</span><b>{label}</b></button>}

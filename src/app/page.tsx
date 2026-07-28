'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Phone, MapPin, Clock, ChevronDown, ChevronUp,
  Leaf, X, Menu as MenuIcon,
  CalendarDays, Music, Mic, PartyPopper, Sun, Send,
  Instagram, Mail, ArrowUp, Check
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================
interface MenuItem {
  id: string; name: string; description?: string; price: number;
  isVeg: boolean; isBestseller: boolean; isNew: boolean; order: number;
}
interface MenuCategory {
  id: string; name: string; slug: string; icon: string;
  description?: string; tab: string; order: number; items: MenuItem[];
}
interface Event {
  id: string; title: string; description: string; date: string;
  time: string; type: string; isFeatured: boolean;
}
interface ReservationForm {
  name: string; phone: string; email: string; date: string;
  time: string; guests: string; occasion: string; message: string;
}

// ==========================================
// DATA
// ==========================================
const PHONE = '+91 97654 00484';
const PHONE_TEL = 'tel:+919765400484';
const WHATSAPP = 'https://wa.me/919765400484?text=Hi!%20I%20would%20like%20to%20place%20an%20order%20from%20High%20Spirits%20Cafe';
const ADDRESS = '35A/1, Near ABC Farm, Behind Burger King, Koregaon Park, Pune 411001';
const EMAIL = 'highspiritscafe@gmail.com';
const INSTAGRAM = 'https://instagram.com/highspiritscafe/';
const GOOGLE_MAPS = 'https://maps.google.com/?q=High+Spirits+Cafe+Koregaon+Park+Pune';

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';
const COCKTAIL_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
const FOOD_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';
const INTERIOR_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';

const TABS = [
  { key: 'offers', label: 'Happy Hour', icon: '🎉', badge: '12–6 PM' },
  { key: 'food', label: 'Food', icon: '🍽' },
  { key: 'bar', label: 'Bar', icon: '🍸' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'vintage', label: 'Vintage', icon: '🏷', badge: 'Tue & Thu' },
];

const EVENT_META: Record<string, { label: string; color: string }> = {
  'live': { label: 'Live Music', color: 'bg-red-50 text-red-700 border-red-100' },
  'open-mic': { label: 'Open Mic', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  'themed': { label: 'Special', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  'dj': { label: 'Sundowner', color: 'bg-teal-50 text-teal-700 border-teal-100' },
};

function getHappyHourStatus() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const m = ist.getHours() * 60 + ist.getMinutes();
  if (m >= 720 && m < 1080) {
    const r = 1080 - m;
    return { active: true, msg: `Happy Hour is ON right now! Ends in ${Math.floor(r/60)}h ${r%60}m` };
  }
  return m < 720
    ? { active: false, msg: 'Happy Hour starts today at 12 PM' }
    : { active: false, msg: 'Happy Hour tomorrow from 12 PM' };
}

// ==========================================
// MAIN
// ==========================================
export default function Home() {
  const [menuData, setMenuData] = useState<Record<string, MenuCategory[]>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('offers');
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [vegFilter, setVegFilter] = useState<'all'|'veg'|'nonveg'>('all');
  const [mobileNav, setMobileNav] = useState(false);
  const [showReserve, setShowReserve] = useState(false);
  const [resForm, setResForm] = useState<ReservationForm>({ name:'', phone:'', email:'', date:'', time:'', guests:'2', occasion:'', message:'' });
  const [resDone, setResDone] = useState(false);
  const [hh, setHH] = useState(getHappyHourStatus());
  const [showTop, setShowTop] = useState(false);
  const [order, setOrder] = useState<{name:string; price:number}[]>([]);

  useEffect(() => { fetch('/api/menu').then(r=>r.json()).then(setMenuData); fetch('/api/events').then(r=>r.json()).then(setEvents); }, []);
  useEffect(() => { const t = setInterval(()=>setHH(getHappyHourStatus()),60000); return ()=>clearInterval(t); }, []);
  useEffect(() => { const h = ()=>setShowTop(window.scrollY>500); window.addEventListener('scroll',h); return ()=>window.removeEventListener('scroll',h); }, []);

  const switchTab = (t:string) => { setActiveTab(t); if(menuData[t]?.length) setExpandedCats(new Set([menuData[t][0].id])); };
  const toggleCat = (id:string) => setExpandedCats(p=>{
    const n=new Set(p);
    if(n.has(id)) { n.delete(id); } else { n.add(id); }
    return n;
  });

  const filtered = useCallback((items:MenuItem[]) => {
    let f = items;
    if (search) { const q=search.toLowerCase(); f=f.filter(i=>i.name.toLowerCase().includes(q)||(i.description?.toLowerCase().includes(q))); }
    if (vegFilter==='veg') f=f.filter(i=>i.isVeg);
    if (vegFilter==='nonveg') f=f.filter(i=>!i.isVeg);
    return f;
  }, [search, vegFilter]);

  const addOrder = (n:string,p:number) => setOrder(o=>[...o,{name:n,price:p}]);
  const rmOrder = (i:number) => setOrder(o=>o.filter((_,j)=>j!==i));
  const total = order.reduce((s,i)=>s+i.price,0);

  const whatsappOrder = () => {
    if(!order.length){ window.open(WHATSAPP,'_blank'); return; }
    const list = order.map(i=>`• ${i.name} — ₹${i.price}`).join('\n');
    window.open(`https://wa.me/919765400484?text=${encodeURIComponent(`Hi! I'd like to order from High Spirits Cafe:\n\n${list}\n\nTotal: ₹${total}`)}`, '_blank');
  };

  const submitRes = async (e:React.FormEvent) => { e.preventDefault(); await fetch('/api/reservations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(resForm)}); setResDone(true); };
  const go = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setMobileNav(false); };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ===== NAV ===== */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-border/60">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-[52px]">
          <button onClick={()=>go('hero')} className="flex items-center gap-1.5 btn-press">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">H</div>
            <span className="font-semibold text-primary tracking-wide text-[15px]" style={{fontFamily:'Georgia,serif'}}>High Spirits</span>
          </button>
          <div className="hidden md:flex items-center gap-5 text-sm">
            {[{id:'menu',l:'Menu'},{id:'events',l:'Events'},{id:'about',l:'About'},{id:'contact',l:'Contact'}].map(s=>(
              <button key={s.id} onClick={()=>go(s.id)} className="text-muted-foreground hover:text-primary transition-colors duration-200">{s.l}</button>
            ))}
            <button onClick={()=>setShowReserve(true)} className="px-4 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium btn-press hover:bg-primary/90">Book a Table</button>
          </div>
          <button className="md:hidden text-muted-foreground" onClick={()=>setMobileNav(!mobileNav)}>
            {mobileNav ? <X className="w-5 h-5"/> : <MenuIcon className="w-5 h-5"/>}
          </button>
        </div>
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-border/60 shadow-md">
            {[{id:'menu',l:'Menu'},{id:'events',l:'Events'},{id:'about',l:'About'},{id:'contact',l:'Contact'}].map(s=>(
              <button key={s.id} onClick={()=>go(s.id)} className="block w-full px-5 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50">{s.l}</button>
            ))}
            <button onClick={()=>{setShowReserve(true);setMobileNav(false)}} className="block w-full mx-5 my-2 px-4 py-2.5 bg-primary text-primary-foreground rounded text-sm font-medium">Book a Table</button>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-screen flex items-end overflow-hidden">
        <img src={HERO_IMG} alt="High Spirits Cafe" className="absolute inset-0 w-full h-full object-cover scale-[1.02]" />
        <div className="hero-overlay absolute inset-0" style={{background:'linear-gradient(180deg, rgba(27,67,50,0.15) 0%, rgba(27,67,50,0.35) 40%, rgba(27,67,50,0.7) 75%, rgba(27,67,50,0.85) 100%)'}} />
        <div className="hero-glow absolute inset-x-0 bottom-0 h-[60%]" style={{background:'radial-gradient(ellipse at center, rgba(212,163,115,0.15) 0%, transparent 70%)'}} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 pb-16 pt-24">
          <p className="text-white/60 text-[13px] tracking-[0.2em] uppercase mb-3 font-medium">Est. 2010 · Koregaon Park, Pune</p>
          <h1 className="text-white text-[clamp(3rem,8vw,5.5rem)] font-bold leading-[1.05] mb-4" style={{fontFamily:'Georgia,serif'}}>
            High Spirits<br/>Cafe
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-md leading-relaxed mb-6">
            Live music, craft cocktails, great food — Pune&apos;s favourite hangout for over a decade.
          </p>

          {hh.active && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
              <span className="text-white/90 text-sm font-medium">{hh.msg}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button onClick={()=>go('menu')} className="px-6 py-2.5 bg-white text-foreground rounded font-medium text-sm btn-press hover:bg-white/90 shadow-lg shadow-white/10">View Menu &amp; Order</button>
            <a href={PHONE_TEL} className="px-6 py-2.5 rounded border border-white/25 text-white/90 font-medium text-sm btn-press hover:bg-white/10">
              <Phone className="w-4 h-4 inline mr-1.5 -mt-0.5"/>Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ===== HAPPY HOUR STRIP ===== */}
      <div className="bg-primary text-primary-foreground py-2.5 px-5 text-center text-sm font-medium">
        🎉 Happy Hour Daily 12–6 PM — Beer ₹100 · Cocktails ₹150 · Mimosa ₹130 · Pitchers ₹600
        <button onClick={()=>go('menu')} className="ml-2 underline underline-offset-2 opacity-80 hover:opacity-100 transition-opacity">View deals →</button>
      </div>

      {/* ===== MENU ===== */}
      <section id="menu" className="py-14 px-5 max-w-5xl mx-auto">
        <div className="mb-8">
          <p className="text-primary/70 text-xs tracking-[0.15em] uppercase font-medium mb-1">What we serve</p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight" style={{fontFamily:'Georgia,serif'}}>Our Menu</h2>
          <div className="section-divider mt-3 mb-4"/>
          <p className="text-muted-foreground text-sm">Browse, add items, and order directly on WhatsApp.</p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
            <input type="text" placeholder="Search — paneer, cocktail, pizza..." value={search} onChange={e=>setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"/>
            {search && <button onClick={()=>setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-4 h-4"/></button>}
          </div>
          <div className="flex gap-1.5">
            {[{k:'all'as const,l:'All'},{k:'veg'as const,l:'🟢 Veg'},{k:'nonveg'as const,l:'🔴 Non-Veg'}].map(f=>(
              <button key={f.k} onClick={()=>setVegFilter(f.k)}
                className={`px-3.5 py-2.5 rounded-md text-sm font-medium border transition-colors duration-200 ${
                  vegFilter===f.k ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}>{f.l}</button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-5 overflow-x-auto -mx-1 px-1 border-b border-border">
          {TABS.map(t=>(
            <button key={t.key} onClick={()=>switchTab(t.key)}
              className={`tab-underline flex items-center gap-1 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab===t.key ? 'active text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <span className="text-[15px]">{t.icon}</span>{t.label}
              {t.badge && <span className="text-[10px] text-muted-foreground font-normal ml-0.5">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div className="space-y-1.5">
          {menuData[activeTab]?.map(cat=>{
            const open = expandedCats.has(cat.id);
            const items = filtered(cat.items);
            if(search && !items.length) return null;
            return (
              <div key={cat.id} className={`border rounded-md transition-all duration-200 ${open ? 'border-border bg-white shadow-sm' : 'border-border/60 bg-white/50'}`}>
                <button onClick={()=>toggleCat(cat.id)} className="w-full flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px]">{cat.icon}</span>
                    <span className="font-semibold text-sm">{cat.name}</span>
                    {!open && <span className="text-[11px] text-muted-foreground">{items.length} items</span>}
                  </div>
                  <span className={`text-muted-foreground transition-all duration-200 ${open ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4"/>
                  </span>
                </button>
                {open && (
                  <div className="border-t border-border/40">
                    {items.map(item=>(
                      <div key={item.id} className="menu-row flex items-center justify-between px-4 py-[10px] border-b border-border/30 last:border-0">
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <span className={`w-[14px] h-[14px] rounded-[2px] border flex items-center justify-center ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                              <span className={`w-[6px] h-[6px] rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`}/>
                            </span>
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.isBestseller && <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Popular</span>}
                          </div>
                          {item.description && <p className="text-[12px] text-muted-foreground mt-0.5 ml-[18px]">{item.description}</p>}
                        </div>
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <span className="text-sm font-semibold text-primary">₹{item.price}</span>
                          <button onClick={()=>addOrder(item.name,item.price)}
                            className="w-[28px] h-[28px] rounded-md border border-border bg-white hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center text-[15px] font-medium btn-press transition-all duration-150">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {search && !Object.values(menuData).flat().some(c=>filtered(c.items).length>0) && (
          <div className="text-center py-10"><p className="text-muted-foreground text-sm">No results for &quot;{search}&quot;. Try another search.</p></div>
        )}
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" className="py-14 px-5 bg-muted/80">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-primary/70 text-xs tracking-[0.15em] uppercase font-medium mb-1">What's happening</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight" style={{fontFamily:'Georgia,serif'}}>Events &amp; Nights</h2>
            <div className="section-divider mt-3 mb-4"/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev=>{
              const meta = EVENT_META[ev.type] || {label:ev.type, color:'bg-muted text-muted-foreground border-border'};
              return (
                <div key={ev.id} className="bg-white border border-border rounded-lg p-5 card-hover">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${meta.color}`}>{meta.label}</span>
                    {ev.isFeatured && <span className="text-[10px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">★ Featured</span>}
                  </div>
                  <h3 className="font-semibold text-[15px] mb-1.5 leading-snug">{ev.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{ev.description}</p>
                  <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5"/>{ev.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/>{ev.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-14 px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          <div className="lg:col-span-3">
            <p className="text-primary/70 text-xs tracking-[0.15em] uppercase font-medium mb-1">Our story</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight mb-2" style={{fontFamily:'Georgia,serif'}}>More Than a Bar</h2>
            <div className="section-divider mb-5"/>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              High Spirits Cafe in Pune has been a fixture in Koregaon Park for over a decade. Its inviting open-air setting, adorned with fairy lights, makes it a gathering place for locals and visitors alike.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              The eclectic music scene — live bands, DJ sets, open mic nights — ensures there&apos;s always something for every music lover. Coupled with great food and an impressive drinks selection, it&apos;s a complete experience for a memorable night out.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              What truly sets High Spirits apart is its sense of community. Through themed parties, live gigs, and open mic nights, it creates a space where creativity and camaraderie flourish — making it a cherished institution in Pune&apos;s cultural landscape.
            </p>

            <div className="flex gap-6">
              {[{v:'10+',l:'Years in Pune'},{v:'100+',l:'Drinks'},{v:'₹100',l:'HH Beer'}].map((s,i)=>(
                <div key={i} className="pr-6 border-r border-border last:border-0 last:pr-0">
                  <span className="text-xl font-bold text-primary">{s.v}</span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md">
              <img src={INTERIOR_IMG} alt="Inside High Spirits" className="w-full h-full object-cover img-hover"/>
            </div>
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-md mt-6">
              <img src={COCKTAIL_IMG} alt="Cocktails at the bar" className="w-full h-full object-cover img-hover"/>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-14 px-5 bg-muted/80">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-primary/70 text-xs tracking-[0.15em] uppercase font-medium mb-1">Come visit</p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight" style={{fontFamily:'Georgia,serif'}}>Find Us</h2>
            <div className="section-divider mt-3 mb-4"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-border rounded-lg p-5 card-hover">
              <MapPin className="w-5 h-5 text-primary mb-2"/>
              <h3 className="font-semibold text-sm mb-1.5">Visit Us</h3>
              <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{ADDRESS}</p>
              <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-medium hover:underline">Get Directions →</a>
            </div>
            <div className="bg-white border border-border rounded-lg p-5 card-hover">
              <Phone className="w-5 h-5 text-primary mb-2"/>
              <h3 className="font-semibold text-sm mb-1.5">Contact</h3>
              <a href={PHONE_TEL} className="text-primary text-sm font-medium hover:underline block mb-1">{PHONE}</a>
              <a href={`mailto:${EMAIL}`} className="text-muted-foreground text-sm hover:text-primary hover:underline block mb-1">{EMAIL}</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-primary hover:underline">
                <Instagram className="w-4 h-4"/>@highspiritscafe
              </a>
            </div>
            <div className="bg-white border border-border rounded-lg p-5 card-hover">
              <Clock className="w-5 h-5 text-primary mb-2"/>
              <h3 className="font-semibold text-sm mb-1.5">Hours</h3>
              <p className="text-muted-foreground text-sm">Open Daily: 12 PM – 12:30 AM</p>
              <p className="text-primary text-sm font-medium mt-1">Happy Hour: 12 PM – 6 PM</p>
              <p className="text-muted-foreground text-sm mt-0.5">Vintage: Tue & Thu</p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-56 shadow-sm">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHigh+Spirits+Cafe+Koregaon+Park+Pune!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="High Spirits Cafe"/>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#1C1917] text-[#F8F6F1] py-10 px-5 mt-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="font-bold text-lg tracking-wide" style={{fontFamily:'Georgia,serif'}}>High Spirits Cafe</span>
              <p className="text-[#F8F6F1]/50 text-sm mt-2 leading-relaxed max-w-xs">{ADDRESS}</p>
            </div>
            <div className="flex items-center gap-5">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-[#F8F6F1]/40 hover:text-[#F8F6F1] transition-colors"><Instagram className="w-5 h-5"/></a>
              <a href={PHONE_TEL} className="text-[#F8F6F1]/40 hover:text-[#F8F6F1] transition-colors"><Phone className="w-5 h-5"/></a>
              <a href={`mailto:${EMAIL}`} className="text-[#F8F6F1]/40 hover:text-[#F8F6F1] transition-colors"><Mail className="w-5 h-5"/></a>
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-[#F8F6F1]/10 text-center text-xs text-[#F8F6F1]/30">
            GST No: 27AAIPI0115J1Z0 · © 2026 High Spirits Cafe, Pune
          </div>
        </div>
      </footer>

      {/* ===== WHATSAPP ===== */}
      <button onClick={whatsappOrder}
        className="fixed bottom-5 right-5 z-40 w-[48px] h-[48px] bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/20 whatsapp-pulse btn-press"
        title="Order on WhatsApp">
        <Send className="w-5 h-5"/>
      </button>

      {/* ===== ORDER BAR ===== */}
      {order.length>0 && (
        <div className="fixed bottom-5 left-5 right-[70px] z-40 sm:left-auto sm:right-[70px] sm:w-[280px]">
          <div className="bg-white border border-border rounded-lg p-3.5 shadow-xl shadow-black/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Your Order <span className="text-muted-foreground">({order.length})</span></span>
              <button onClick={()=>setOrder([])} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Clear</button>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-0.5 mb-2">
              {order.map((it,i)=>(
                <div key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-muted-foreground truncate flex-1">{it.name}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-medium text-foreground">₹{it.price}</span>
                    <button onClick={()=>rmOrder(i)} className="text-muted-foreground hover:text-destructive transition-colors"><X className="w-3 h-3"/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-bold">₹{total}</span>
              <button onClick={whatsappOrder}
                className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-[12px] font-medium rounded-md btn-press flex items-center gap-1 shadow-sm">
                <Send className="w-3 h-3"/> WhatsApp Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESERVE MODAL ===== */}
      {showReserve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/30 backdrop-blur-[2px]" onClick={()=>{setShowReserve(false);setResDone(false)}}>
          <div className="bg-white rounded-xl p-6 max-w-[420px] w-full max-h-[90vh] overflow-y-auto shadow-xl" onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{fontFamily:'Georgia,serif'}}>Book a Table</h2>
              <button onClick={()=>{setShowReserve(false);setResDone(false)}} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5"/></button>
            </div>

            {resDone ? (
              <div className="text-center py-6">
                <div className="w-11 h-11 mx-auto mb-2.5 rounded-full bg-green-50 flex items-center justify-center"><Check className="w-5 h-5 text-green-600"/></div>
                <h3 className="font-bold text-base mb-1">Booking Requested!</h3>
                <p className="text-muted-foreground text-sm">We&apos;ll confirm via WhatsApp or phone shortly.</p>
                <button onClick={()=>{setShowReserve(false);setResDone(false)}} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium btn-press">Done</button>
              </div>
            ) : (
              <form onSubmit={submitRes} className="space-y-3">
                <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Name *</label>
                  <input type="text" required value={resForm.name} onChange={e=>setResForm(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your name"/></div>
                <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Phone *</label>
                  <input type="tel" required value={resForm.phone} onChange={e=>setResForm(p=>({...p,phone:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="+91 98765 43210"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Date *</label>
                    <input type="date" required value={resForm.date} onChange={e=>setResForm(p=>({...p,date:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
                  <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Time *</label>
                    <input type="time" required value={resForm.time} onChange={e=>setResForm(p=>({...p,time:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"/></div>
                </div>
                <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Guests *</label>
                  <select value={resForm.guests} onChange={e=>setResForm(p=>({...p,guests:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {[1,2,3,4,5,6,7,8,'9+'].map(n=><option key={n} value={n}>{n} {n===1?'Guest':'Guests'}</option>)}</select></div>
                <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Occasion</label>
                  <select value={resForm.occasion} onChange={e=>setResForm(p=>({...p,occasion:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Optional</option><option value="casual">Casual</option><option value="birthday">Birthday</option><option value="anniversary">Anniversary</option><option value="corporate">Corporate</option><option value="date">Date Night</option></select></div>
                <div><label className="block text-[11px] font-medium text-muted-foreground mb-0.5">Notes</label>
                  <textarea value={resForm.message} onChange={e=>setResForm(p=>({...p,message:e.target.value}))} className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" rows={2} placeholder="Any special requests..."/></div>
                <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded-md text-sm btn-press hover:bg-primary/90">Book Now</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== TOP ===== */}
      {showTop && (
        <button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
          className="fixed bottom-5 left-5 z-40 w-9 h-9 bg-white border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm btn-press">
          <ArrowUp className="w-4 h-4"/>
        </button>
      )}
    </div>
  );
}

// PLATAFORMA KODAROS — Script unificado
// Gold scroll + Navbar + Reveal + Biblioteca + Ágora + Oráculo
document.addEventListener('DOMContentLoaded', function(){
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let isTabActive = true;
  document.addEventListener('visibilitychange', ()=>{ isTabActive = !document.hidden; });

  // NAVBAR
  (function initNavbar(){
    const navbar = document.getElementById('navbar');
    if(!navbar) return;
    let lastY = window.pageYOffset, ticking=false;
    function h(){
      const y = window.pageYOffset;
      if(y>30) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
      navbar.classList.add('visible'); navbar.classList.remove('hidden');
      ticking=false;
    }
    window.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(h); ticking=true; } }, {passive:true});
    h();
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    if(toggle&&menu){
      function sync(exp){
        toggle.setAttribute('aria-expanded', exp?'true':'false');
        const s = toggle.querySelectorAll('span');
        if(exp){ s[0].style.transform='rotate(45deg) translate(5px,5px)'; s[1].style.opacity='0'; s[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
        else{ s[0].style.transform='none'; s[1].style.opacity='1'; s[2].style.transform='none'; }
      }
      toggle.addEventListener('click', ()=>{ const o=!menu.classList.contains('active'); menu.classList.toggle('active'); sync(o); });
      menu.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click', ()=>{ menu.classList.remove('active'); sync(false); }));
    }
  })();

  // SMOOTH SCROLL
  (function(){
    const nav=document.getElementById('navbar');
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', function(e){
        const href=this.getAttribute('href'); if(href==='#') return;
        const t=document.querySelector(href); if(t){ e.preventDefault(); const h=nav?nav.offsetHeight:0; const p=t.getBoundingClientRect().top+window.pageYOffset-h-18; window.scrollTo({top:p,behavior:'smooth'}); }
      });
    });
  })();

  // SCROLL REVEAL
  (function(){
    const els=document.querySelectorAll('.section-header, .stoa-card, .why-card, .testimonial-card, .contact-channel, .ebook-card, .tool');
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          const sib=[...ent.target.parentElement.children].filter(c=>c.classList.contains(ent.target.classList[0]));
          const idx=sib.indexOf(ent.target);
          ent.target.style.transitionDelay = (idx*0.06)+'s';
          ent.target.classList.add('active');
          obs.unobserve(ent.target);
        }
      });
    },{threshold:0.08, rootMargin:'0px 0px -40px 0px'});
    els.forEach(el=>{ el.classList.add('reveal'); obs.observe(el); });
  })();

  // GOLD SCROLL — pedra -> ouro
  (function(){
    const root=document.documentElement;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ root.style.setProperty('--gold','1'); return; }
    let ticking=false;
    function upd(){
      const vh=window.innerHeight||1;
      const y=window.pageYOffset;
      let p=(y - vh*0.45)/(vh*1.9);
      p=Math.min(Math.max(p,0),1);
      const e=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
      root.style.setProperty('--gold', e.toFixed(4));
      ticking=false;
    }
    window.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(upd); ticking=true; } }, {passive:true});
    window.addEventListener('resize', upd, {passive:true});
    upd();
  })();

  // HERO PARALLAX subtle
  (function(){
    const vis=document.querySelector('.hero-visual');
    if(!vis||isTouch) return;
    let ticking=false;
    window.addEventListener('scroll', ()=>{
      if(!ticking){ requestAnimationFrame(()=>{ if(!isTabActive) return; const s=window.pageYOffset; vis.style.transform=`translateY(${s*0.06}px)`; ticking=false; }); ticking=true; }
    }, {passive:true});
  })();

  // ACTIVE LINKS
  (function(){
    const secs=document.querySelectorAll('section[id]');
    const links=document.querySelectorAll('.nav-link');
    function set(){
      const pos=window.pageYOffset+180;
      secs.forEach(sec=>{
        const top=sec.offsetTop, h=sec.offsetHeight, id=sec.getAttribute('id');
        if(pos>=top && pos<top+h){ links.forEach(l=>{ l.classList.remove('active'); if(l.getAttribute('href')==='#'+id) l.classList.add('active'); }); }
      });
    }
    let t=false; window.addEventListener('scroll', ()=>{ if(!t){ requestAnimationFrame(()=>{ set(); t=false; }); t=true; } }, {passive:true});
    set();
  })();

  // footer year
  const y=document.getElementById('footer-year'); if(y) y.textContent=new Date().getFullYear();
});

// BIBLIOTECA filtro
(function(){
  const filter=document.getElementById('ebook-filter');
  if(!filter) return;
  const cards=document.querySelectorAll('.ebooks-grid .ebook-card');
  function apply(f){
    cards.forEach(c=>{
      const m=(f==='all')||(c.dataset.class===f);
      c.classList.toggle('hide', !m);
    });
  }
  filter.querySelectorAll('.ebook-filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      filter.querySelectorAll('.ebook-filter-btn').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
      apply(btn.dataset.filter);
      try{ localStorage.setItem('kodaros_ebook_filter', btn.dataset.filter);}catch(e){}
    });
  });
  try{
    const s=localStorage.getItem('kodaros_ebook_filter');
    if(s&&filter.querySelector('[data-filter="'+s+'"]')){ filter.querySelectorAll('.ebook-filter-btn').forEach(b=>b.classList.remove('active')); const t=filter.querySelector('[data-filter="'+s+'"]'); t.classList.add('active'); t.setAttribute('aria-pressed','true'); apply(s); }
  }catch(e){}
})();

// NOTIFY + CONTACT
function handleNotify(e){
  e.preventDefault();
  const form=e.target;
  if(form.querySelector('[name="hp"]')?.value) return false;
  const email=form.querySelector('input[type="email"]')?.value.trim();
  const topic=form.dataset.notify||'geral';
  const msg=form.querySelector('.notify-msg');
  if(!email||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ if(msg) msg.textContent='Informe um e-mail válido.'; return false; }
  try{ const k='kodaros_notify_'+topic; const arr=JSON.parse(localStorage.getItem(k)||'[]'); if(!arr.includes(email)){ arr.push(email); localStorage.setItem(k, JSON.stringify(arr)); } }catch(_){}
  if(msg) msg.textContent='Obrigado! Avisaremos em '+email+'.';
  form.reset();
  setTimeout(()=>{ window.location.href='mailto:kodaros01@gmail.com?subject=Avise-me '+topic+'&body=Quero ser avisado em '+encodeURIComponent(email); }, 700);
  return false;
}
function handleContact(e){
  e.preventDefault();
  const form=e.target;
  if(form.querySelector('[name="hp"]')?.value) return false;
  const name=document.getElementById('cf-name')?.value.trim();
  const email=document.getElementById('cf-email')?.value.trim();
  const m=document.getElementById('cf-msg')?.value.trim();
  const status=document.getElementById('cf-msg-status');
  if(!name||!email||!m){ if(status) status.textContent='Preencha todos os campos.'; return false; }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ if(status) status.textContent='E-mail inválido.'; return false; }
  const subject=encodeURIComponent('Contato site — '+name);
  const body=encodeURIComponent('Nome: '+name+'\nE-mail: '+email+'\n\nMensagem:\n'+m);
  window.location.href='mailto:kodaros01@gmail.com?subject='+subject+'&body='+body;
  if(status) status.textContent='Abrindo seu e-mail... Se não abrir, escreva para kodaros01@gmail.com';
  form.reset(); return false;
}

// ÁGORA — categoria filter
(function(){
  const cats=document.querySelectorAll('.agora-cat');
  const tools=document.querySelectorAll('#ferramentas .tool');
  if(!cats.length) return;
  cats.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      cats.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat=btn.dataset.cat;
      tools.forEach(t=>{
        const c=t.dataset.cat;
        const show=(cat==='all'||c===cat);
        t.classList.toggle('hidden-by-cat', !show);
      });
      // scroll to tools if filtered
      if(cat!=='all') document.getElementById('ferramentas').scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
})();

// Search shortcut "/"
document.addEventListener('keydown', (e)=>{
  if(e.key==='/' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA'){
    e.preventDefault(); const s=document.getElementById('toolsSearch'); if(s) s.focus();
  }
});
/* =========================================================
   KODAROS FERRAMENTAS â€” LÃ³gica das ferramentas (client-side)
   ========================================================= */

/* ---------- Helpers ---------- */
function brl(n){
  if(!isFinite(n)) return 'â€“';
  return 'R$ ' + n.toLocaleString('pt-BR',{minimumFractionDigits:2, maximumFractionDigits:2});
}
function num(n, d=1){
  if(!isFinite(n)) return 'â€“';
  return n.toLocaleString('pt-BR',{minimumFractionDigits:0, maximumFractionDigits:d});
}
function pct(n){ return num(n,1) + '%'; }
function show(el){ document.getElementById(el).classList.add('show'); }
function val(id){ return document.getElementById(id).value; }
function numv(id){ return parseFloat(document.getElementById(id).value) || 0; }

/* ---------- Tabs + Deep linking ---------- */
function activateTab(id, pushHash){
  const btn = document.querySelector('.tab-btn[data-tab="'+id+'"]');
  const panel = document.getElementById(id);
  if(!btn || !panel) return;
  document.querySelectorAll('.tab-btn').forEach(function(b){
    const isActive = b === btn;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', isActive ? 'true' : 'false');
    b.setAttribute('tabindex', isActive ? '0' : '-1');
  });
  document.querySelectorAll('.tab-panel').forEach(function(p){
    const isActive = p === panel;
    p.classList.toggle('active', isActive);
    if(isActive) p.removeAttribute('hidden');
    else p.setAttribute('hidden','');
  });
  if(pushHash){
    const toolHash = location.hash.includes('/') ? location.hash.split('/')[1] : '';
    const newHash = toolHash ? id + '/' + toolHash : id;
    if(location.hash.slice(1) !== newHash) history.pushState(null,'','#'+newHash);
  }
}
document.querySelectorAll('.tab-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    activateTab(btn.dataset.tab, true);
  });
  btn.addEventListener('keydown', function(e){
    if(e.key==='ArrowRight' || e.key==='ArrowLeft'){
      e.preventDefault();
      const all=[...document.querySelectorAll('.tab-btn')];
      const idx=all.indexOf(btn);
      const next = e.key==='ArrowRight' ? (idx+1)%all.length : (idx-1+all.length)%all.length;
      all[next].focus(); activateTab(all[next].dataset.tab, true);
    }
  });
});
// init from hash
(function initHash(){
  const raw = location.hash.slice(1).split('/')[0];
  const valid = ['aquisicao','lancamento','financeiro','vendas','suporte','operacao','conteudo'];
  const target = valid.includes(raw) ? raw : 'aquisicao';
  activateTab(target, false);
  // ensure correct initial aria
  document.querySelectorAll('.tab-panel').forEach(function(p){
    if(!p.classList.contains('active')) p.setAttribute('hidden','');
  });
})();
window.addEventListener('hashchange', function(){
  const raw = location.hash.slice(1).split('/')[0];
  if(raw) activateTab(raw, false);
  // scroll to tool if second part
  const parts = location.hash.slice(1).split('/');
  if(parts[1]){
    const el = document.getElementById(parts[1]);
    if(el) setTimeout(function(){ el.scrollIntoView({behavior:'smooth', block:'start'}); }, 250);
  }
});

/* ---------- Busca + Deep link por ferramenta ---------- */
(function initToolAnchorsAndSearch(){
  function slugify(s){
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);
  }
  const tools = document.querySelectorAll('.tool');
  const seen = {};
  tools.forEach(function(tool){
    const h3 = tool.querySelector('h3');
    if(!h3) return;
    let base = 'tool-' + slugify(h3.textContent);
    let id = base;
    let n=1;
    while(document.getElementById(id) || seen[id]){ id = base + '-' + (++n); }
    seen[id]=true;
    tool.id = id;
    tool.style.position='relative';
    // anchor for offset
    const anc = document.createElement('span');
    anc.id = id + '-anc';
    anc.className='tool-anchor';
    anc.setAttribute('aria-hidden','true');
    tool.prepend(anc);
    // actions row if not exists at bottom
    if(!tool.querySelector('.tool-actions')){
      const actions = document.createElement('div');
      actions.className='tool-actions';
      const linkBtn = document.createElement('button');
      linkBtn.className='btn btn-ghost btn-sm';
      linkBtn.type='button';
      linkBtn.textContent='Copiar link';
      linkBtn.setAttribute('aria-label','Copiar link desta ferramenta');
      linkBtn.addEventListener('click', function(){ copyToolLink(id, linkBtn); });
      const waBtn = document.createElement('a');
      waBtn.className='btn btn-ghost btn-sm';
      waBtn.textContent='WhatsApp';
      waBtn.target='_blank';
      waBtn.rel='noopener';
      waBtn.setAttribute('aria-label','Compartilhar no WhatsApp');
      waBtn.href='#';
      waBtn.addEventListener('click', function(e){
        e.preventDefault();
        const tab = tool.closest('.tab-panel')?.id || 'aquisicao';
        const url = location.origin + location.pathname + '#' + tab + '/' + id;
        const text = encodeURIComponent(h3.textContent + ' â€” Ferramentas KODAROS ' + url);
        window.open('https://wa.me/?text=' + text, '_blank');
        trackEvent('share_whatsapp', {tool: id});
      });
      linkBtn.addEventListener('click', function(){ trackEvent('copy_link', {tool: id}); });
      actions.appendChild(linkBtn);
      actions.appendChild(waBtn);
      // export button (only if tool has result)
      if(tool.querySelector('.result')){
        const expBtn=document.createElement('button');
        expBtn.className='btn btn-ghost btn-sm';
        expBtn.type='button';
        expBtn.textContent='Exportar';
        expBtn.setAttribute('aria-label','Exportar resultado');
        expBtn.addEventListener('click', function(){ exportToolResult(id, expBtn); });
        actions.appendChild(expBtn);
      }
      tool.appendChild(actions);
    }
  });
  // handle initial tool hash
  const partsInit = location.hash.slice(1).split('/');
  if(partsInit[1]){
    const el = document.getElementById(partsInit[1]);
    if(el) setTimeout(function(){ el.scrollIntoView({behavior:'smooth', block:'start'}); }, 300);
  }
  // search
  const input = document.getElementById('toolsSearch');
  const meta = document.getElementById('searchMeta');
  if(!input) return;
  input.addEventListener('input', function(){
    const q = input.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    let total=0, shown=0;
    tools.forEach(function(tool){
      total++;
      const txt = (tool.querySelector('h3')?.textContent + ' ' + (tool.querySelector('.tool-desc')?.textContent||'') + ' ' + (tool.querySelector('.tool-ebook')?.textContent||'')).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      const match = !q || txt.includes(q);
      tool.classList.toggle('hidden-by-search', !match);
      if(match) shown++;
      // if searching, ensure parent tab is visible if any match inside
      if(match && q){
        const panel = tool.closest('.tab-panel');
        if(panel && !panel.classList.contains('active')){
          // don't auto-switch tab, just count; but highlight tab with badge
        }
      }
    });
    if(meta){
      if(!q) meta.textContent='';
      else meta.textContent = shown + ' de ' + total + ' ferramentas';
    }
    // if searching, show all panels to reveal matches; otherwise restore active tab only
    if(q){
      document.querySelectorAll('.tab-panel').forEach(function(p){
        p.classList.add('active');
        p.removeAttribute('hidden');
      });
    } else {
      // restore hash tab
      const raw = location.hash.slice(1).split('/')[0] || 'aquisicao';
      activateTab(raw, false);
    }
  });
})();

/* ---------- Favoritos + Recentes (localStorage) ---------- */
(function initFavsRecent(){
  const FAV_KEY='kodaros_favs', REC_KEY='kodaros_recent';
  function loadArr(k){ try{ const a=JSON.parse(localStorage.getItem(k)||'[]'); return Array.isArray(a)?a:[]; }catch(e){ return []; } }
  function saveArr(k,a){ try{ localStorage.setItem(k, JSON.stringify(a)); }catch(e){} }
  let favs=loadArr(FAV_KEY), recent=loadArr(REC_KEY);
  const wrap=document.getElementById('favBarWrap');
  const favBox=document.getElementById('favBarFavs');
  const recBox=document.getElementById('favBarRecent');

  function toolName(id){
    const t=document.getElementById(id);
    const h3=t ? t.querySelector('h3') : null;
    return h3 ? h3.textContent.trim() : id;
  }

  // botao estrela em cada ferramenta
  document.querySelectorAll('.tool').forEach(function(tool){
    if(!tool.id) return;
    const head=tool.querySelector('.tool-head');
    if(!head || head.querySelector('.star-btn')) return;
    const btn=document.createElement('button');
    btn.className='star-btn';
    btn.type='button';
    btn.innerHTML='&#9733;';
    btn.title='Favoritar ferramenta';
    const on=favs.includes(tool.id);
    btn.setAttribute('aria-pressed', on?'true':'false');
    btn.setAttribute('aria-label','Favoritar '+toolName(tool.id));
    if(on){ tool.classList.add('fav'); btn.classList.add('on'); }
    btn.addEventListener('click', function(){ toggleFav(tool.id); });
    head.appendChild(btn);
  });

  function toggleFav(id){
    const i=favs.indexOf(id);
    if(i>=0) favs.splice(i,1); else favs.push(id);
    saveArr(FAV_KEY,favs);
    const tool=document.getElementById(id);
    if(tool){
      const on=favs.includes(id);
      tool.classList.toggle('fav', on);
      const sb=tool.querySelector('.star-btn');
      if(sb){ sb.classList.toggle('on', on); sb.setAttribute('aria-pressed', on?'true':'false'); }
    }
    renderChips();
    trackEvent('favorite', {tool:id, on:favs.includes(id)});
  }

  function makeChip(label,id,isFav){
    const b=document.createElement('button');
    b.className='chip'+(isFav?' chip-fav':'');
    b.type='button';
    b.textContent=(isFav?'\u2605 ':'')+label;
    b.title=label+' \u2014 abrir ferramenta';
    b.addEventListener('click', function(){
      const tool=document.getElementById(id);
      if(!tool) return;
      const panel=tool.closest('.tab-panel');
      if(panel) activateTab(panel.id,true);
      setTimeout(function(){ tool.scrollIntoView({behavior:'smooth', block:'start'}); },150);
      trackEvent('open_chip',{tool:id});
    });
    return b;
  }

  function renderChips(){
    if(!wrap || !favBox || !recBox) return;
    favs=favs.filter(function(id){ return document.getElementById(id); });
    recent=recent.filter(function(id){ return document.getElementById(id); });
    favBox.innerHTML=''; recBox.innerHTML='';
    favs.forEach(function(id){ favBox.appendChild(makeChip(toolName(id),id,true)); });
    recent.slice(0,6).forEach(function(id){ if(!favs.includes(id)) recBox.appendChild(makeChip(toolName(id),id,false)); });
    wrap.hidden = !favs.length && !recent.length;
  }

  // registra uso recente sempre que um resultado e exibido
  const origShow=window.show;
  if(typeof origShow==='function'){
    window.show=function(el){
      origShow(el);
      try{
        const resEl=document.getElementById(el);
        const tool=resEl ? resEl.closest('.tool') : null;
        if(tool && tool.id){
          recent=[tool.id].concat(recent.filter(function(x){ return x!==tool.id; })).slice(0,8);
          saveArr(REC_KEY,recent);
          renderChips();
        }
      }catch(e){}
    };
  }
  renderChips();
})();

/* ---------- Atalhos de teclado (/ , Esc , 1-7) ---------- */
(function initShortcuts(){
  const TAB_ORDER=['aquisicao','lancamento','financeiro','vendas','suporte','operacao','conteudo'];
  document.addEventListener('keydown', function(e){
    const tag=(e.target && e.target.tagName || '').toLowerCase();
    const typing = tag==='input' || tag==='textarea' || tag==='select' || (e.target && e.target.isContentEditable);
    if(e.key==='Escape'){
      if(typing && e.target.blur){ e.target.blur(); return; }
      const s=document.getElementById('toolsSearch');
      if(s && s.value){ s.value=''; s.dispatchEvent(new Event('input')); }
      return;
    }
    if(typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if(e.key==='/'){
      const s=document.getElementById('toolsSearch');
      if(s){ e.preventDefault(); s.focus(); }
    } else if(/^[1-7]$/.test(e.key)){
      activateTab(TAB_ORDER[parseInt(e.key,10)-1], true);
    }
  });
})();

/* ---------- Tooltips "Como este calculo funciona" ---------- */
(function initFormulas(){
  const FORMULAS={};
  FORMULAS['CAC & LTV']='CAC = Gasto com aquisi\u00e7\u00e3o \u00f7 Clientes adquiridos. LTV = Ticket \u00d7 Frequ\u00eancia \u00d7 (Reten\u00e7\u00e3o \u00f7 12) \u00d7 Margem. Rela\u00e7\u00e3o saud\u00e1vel: LTV:CAC \u2265 3:1. Payback = CAC \u00f7 lucro mensal por cliente.';
  FORMULAS['Projetor de Escala']='Clientes/semana = Or\u00e7amento \u00f7 CAC. O or\u00e7amento cresce % a cada semana. Receita = clientes \u00d7 ticket; Lucro = receita \u00d7 margem.';
  FORMULAS['Auditor de Funil']='Cada etapa multiplica o volume pela taxa informada. O gargalo destacado \u00e9 a etapa com a MENOR taxa de convers\u00e3o.';
  FORMULAS['ROI de Tr\u00e1fego Pago / ROAS']='ROAS = Receita \u00f7 Investimento. ROI (%) = (Receita \u2212 Investimento) \u00f7 Investimento \u00d7 100. Lucro = Receita \u2212 Investimento.';
  FORMULAS['Ponto de Equil\u00edbrio de Campanha']='Margem de contribui\u00e7\u00e3o = Ticket \u2212 Custo vari\u00e1vel. Vendas p/ equil\u00edbrio = Custo fixo \u00f7 margem. Break-even ROAS = Ticket \u00f7 margem.';
  FORMULAS['Conversor de M\u00e9tricas de M\u00eddia']='CPM = Custo \u00f7 impress\u00f5es \u00d7 1000. CPC = Custo \u00f7 cliques. CTR = cliques \u00f7 impress\u00f5es \u00d7 100. CPA = Custo \u00f7 convers\u00f5es. CPL = Custo \u00f7 leads.';
  FORMULAS['Planejador de Or\u00e7amento por Canal']='Cada canal recebe Total \u00d7 (participa\u00e7\u00e3o \u00f7 soma das participa\u00e7\u00f5es). Se a soma n\u00e3o der 100%, os valores s\u00e3o normalizados proporcionalmente.';
  FORMULAS['UTM Builder']='Concatena a URL base com utm_source, utm_medium, utm_campaign, utm_term e utm_content, codificados para URL (? ou &, conforme o caso).';
  FORMULAS['Auditor de Landing Page (CRO)']='Score = itens marcados \u00f7 total de itens \u00d7 100. Acima de 80 = p\u00e1gina pronta para converter; abaixo de 50 = revis\u00e3o urgente.';
  FORMULAS['CPL Ideal (baseado no LTV)']='CAC m\u00e1ximo = Ticket \u00d7 Margem. CPL ideal = CAC m\u00e1ximo \u00d7 convers\u00e3o lead\u2192venda.';
  FORMULAS['Simulador A/B de Criativos']='Cliques = impress\u00f5es \u00d7 CTR de cada varia\u00e7\u00e3o. Vence a varia\u00e7\u00e3o com maior CTR; a diferen\u00e7a de cliques \u00e9 estimada sobre o volume informado.';
  FORMULAS['Recupera\u00e7\u00e3o de Carrinho']='Receita recuperada = abandonos \u00d7 ticket \u00d7 taxa. Ganho l\u00edquido = recuperada \u2212 custo da automa\u00e7\u00e3o. ROI = ganho \u00f7 custo \u00d7 100.';
  FORMULAS['Cronograma de Lan\u00e7amento']='Soma dias corridos fase a fase a partir da data inicial: pr\u00e9-lan\u00e7amento \u2192 abertura \u2192 pico \u2192 fechamento.';
  FORMULAS['Simulador de Receita de Lan\u00e7amento']='Vendas = leads \u00d7 convers\u00e3o. Receita = vendas \u00d7 pre\u00e7o. Pessimista usa 70% dos leads; otimista, 130%.';
  FORMULAS['Calculadora de Oferta']='Pre\u00e7o promo = original \u00d7 (1 \u2212 desconto). Parcela = promo \u00d7 (1+juros)^n \u00f7 n. Total = parcela \u00d7 n (juros compostos).';
  FORMULAS['Cronograma Invertido']='Conta as datas para tr\u00e1s a partir do fechamento, descontando os dias de cada fase na ordem inversa.';
  FORMULAS['Custo por Inscrito (CPE)']='CPE = Investimento \u00f7 Inscritos na lista.';
  FORMULAS['Sequ\u00eancia de E-mails de Lan\u00e7amento']='Estrutura cl\u00e1ssica de 5 e-mails: aquecimento, hist\u00f3ria, abertura, pico (prova social) e fechamento com urg\u00eancia.';
  FORMULAS['Calculadora de Precifica\u00e7\u00e3o']='Pre\u00e7o = (Custo + Fixos rateados) \u00f7 (1 \u2212 margem% \u2212 impostos%). Lucro/un = pre\u00e7o \u2212 custos.';
  FORMULAS['Margem de Lucro']='Margem (%) = (Pre\u00e7o \u2212 Custo) \u00f7 Pre\u00e7o \u00d7 100. Lucro = pre\u00e7o \u2212 custo.';
  FORMULAS['Fluxo de Caixa Projetado']='Saldo do m\u00eas = saldo anterior + entradas \u2212 sa\u00eddas, acumulado m\u00eas a m\u00eas. Linhas destacadas em vermelho = caixa negativo.';
  FORMULAS['Capital de Giro Necess\u00e1rio']='Ciclo = estoque + recebimento \u2212 pagamento (dias). Capital de giro = custo operacional di\u00e1rio \u00d7 ciclo.';
  FORMULAS['Ponto de Equil\u00edbrio Financeiro']='Margem de contribui\u00e7\u00e3o = pre\u00e7o \u2212 custo vari\u00e1vel. Clientes p/ equil\u00edbrio = custo fixo \u00f7 margem.';
  FORMULAS['Juros Compostos / Patrim\u00f4nio']='Acumulado do m\u00eas = saldo anterior \u00d7 (1+taxa) + aporte. Rendimento = acumulado \u2212 total aportado.';
  FORMULAS['Pr\u00f3-labore vs Distribui\u00e7\u00e3o de Lucros']='Pr\u00f3-labore = lucro \u00d7 % escolhida. Distribui\u00e7\u00e3o = lucro \u00d7 (1 \u2212 %).';
  FORMULAS['MRR / ARR de Assinaturas']='MRR = assinantes \u00d7 mensalidade. A cada m\u00eas: assinantes = assinantes \u00d7 (1\u2212churn) + novos. ARR = MRR projetado \u00d7 12.';
  FORMULAS['Metas de Vendas']='Vendas/m\u00eas = meta \u00f7 ticket. Visitas/dia = (vendas \u00f7 convers\u00e3o) \u00f7 dias \u00fateis.';
  FORMULAS['Simulador de Desconto']='Pre\u00e7o c/ desconto = original \u00d7 (1\u2212desc). Lucro total = (pre\u00e7o final \u2212 custo) \u00d7 volume. Desconto m\u00e1x. = (pre\u00e7o \u2212 custo) \u00f7 pre\u00e7o \u00d7 100.';
  FORMULAS['Ticket M\u00e9dio Necess\u00e1rio']='Ticket = meta \u00f7 n\u00famero de transa\u00e7\u00f5es/clientes.';
  FORMULAS['Funil de Vendas Simples']='Convers\u00e3o entre etapas: Lead\u2192Proposta e Proposta\u2192Venda em %. Convers\u00e3o geral = fechamentos \u00f7 leads \u00d7 100.';
  FORMULAS['Planner de Follow-up']='Respostas = leads \u00d7 (1 \u2212 (1\u2212taxa)^tentativas). "+ tentativas" mostra o ganho vs uma \u00fanica tentativa.';
  FORMULAS['Churn & Reten\u00e7\u00e3o']='Churn (%) = perdidos \u00f7 in\u00edcio do m\u00eas \u00d7 100. Lifetime = 100 \u00f7 churn. LTV ajustado = ticket \u00d7 margem \u00d7 lifetime. Churn \u2264 5%/m\u00eas \u00e9 saud\u00e1vel.';
  FORMULAS['\u00cdndice de Reclama\u00e7\u00f5es / NPS']='NPS = % promotores \u2212 % detratores. \u00cdndice = reclama\u00e7\u00f5es \u00f7 clientes \u00d7 100. Recl./1000 = reclama\u00e7\u00f5es \u00f7 clientes \u00d7 1000.';
  FORMULAS['Calculadora de Tempo de Resposta (SLA)']='Capacidade/dia = atendentes \u00d7 horas \u00d7 60 \u00f7 tempo m\u00e9dio por resposta. Backlog = volume \u2212 capacidade.';
  FORMULAS['Calculadora de Valor Recuperado']='Valor salvo = clientes em risco \u00d7 ticket \u00d7 taxa de reten\u00e7\u00e3o.';
  FORMULAS['Checklist de Auditagem Semanal (ritual M3)']='Score = itens executados \u00f7 8 \u00d7 100. Meta: \u2265 75 pontos toda semana.';
  FORMULAS['Planejador de Metas (OKR)']='Progresso de cada KR = atual \u00f7 meta \u00d7 100. M\u00e9dia simples dos KRs = progresso do objetivo.';
  FORMULAS['Matriz de Prioriza\u00e7\u00e3o (Pareto + Eisenhower)']='Ordena causas por impacto e acumula %. As causas at\u00e9 cruzar 80% s\u00e3o os "poucos vitais" (\u2605).';
  FORMULAS['Hora Fatur\u00e1vel Ideal']='Pre\u00e7o/hora = (meta \u00f7 horas fatur\u00e1veis) \u00d7 (1 + margem).';
  FORMULAS['Decompositor de Metas Anuais']='Mensal = meta anual \u00f7 meses. Semanal = mensal \u00f7 4,3.';
  FORMULAS['ROI de Automa\u00e7\u00e3o']='Economia bruta = horas \u00d7 valor/hora. L\u00edquida = bruta \u2212 custo/m\u00eas. Payback = implanta\u00e7\u00e3o \u00f7 l\u00edquida. ROI 12m = (l\u00edquida\u00d712 \u2212 investimento ano) \u00f7 investimento ano \u00d7 100.';
  FORMULAS['Calend\u00e1rio Editorial']='Total = posts/semana \u00d7 semanas. M\u00e9dia mensal = posts/semana \u00d7 4,33.';
  FORMULAS['ROI de Conte\u00fado']='Receita = leads \u00d7 convers\u00e3o \u00d7 ticket. ROI = (receita \u2212 investimento) \u00f7 investimento \u00d7 100.';
  FORMULAS['Checklist SEO On-page']='Score = itens marcados \u00f7 10 \u00d7 100. Acima de 80 = SEO on-page s\u00f3lido.';

  function norm(t){ return t.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  const map={};
  Object.keys(FORMULAS).forEach(function(k){ map[norm(k)]=FORMULAS[k]; });

  document.querySelectorAll('.tool').forEach(function(tool){
    if(tool.querySelector('.tool-formula')) return;
    const h3=tool.querySelector('h3');
    if(!h3) return;
    const text=map[norm(h3.textContent)];
    if(!text) return;
    const det=document.createElement('details');
    det.className='tool-formula';
    const sum=document.createElement('summary');
    sum.textContent='Como este c\u00e1lculo funciona';
    const body=document.createElement('div');
    body.className='tool-formula-body';
    body.textContent=text;
    det.appendChild(sum); det.appendChild(body);
    const res=tool.querySelector('.result');
    const actions=tool.querySelector('.tool-actions');
    if(res && res.parentNode) res.parentNode.insertBefore(det,res);
    else if(actions && actions.parentNode) actions.parentNode.insertBefore(det,actions);
    else tool.appendChild(det);
  });
})();

function copyToolLink(toolId, btn){
  const panel = document.getElementById(toolId)?.closest('.tab-panel');
  const tab = panel ? panel.id : 'aquisicao';
  const url = location.origin + location.pathname + '#' + tab + '/' + toolId;
  const trigger = btn;
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){
      const orig = trigger.textContent;
      trigger.textContent='Link copiado!';
      setTimeout(function(){ trigger.textContent=orig; }, 1500);
    });
  } else {
    fallbackCopy(url, function(){
      const orig = trigger.textContent;
      trigger.textContent='Link copiado!';
      setTimeout(function(){ trigger.textContent=orig; }, 1500);
    });
  }
  history.pushState(null,'','#'+tab+'/'+toolId);
}
function trackEvent(name, props){
  try{
    const key='kodaros_events';
    const arr=JSON.parse(localStorage.getItem(key)||'[]');
    arr.push({name, props, ts: Date.now(), url: location.href});
    if(arr.length>200) arr.splice(0, arr.length-200);
    localStorage.setItem(key, JSON.stringify(arr));
    // Plausible / Umami hook if present
    if(window.plausible) window.plausible(name, {props});
  } catch(e){}
}
function exportToolResult(toolId, btn){
  const tool=document.getElementById(toolId);
  if(!tool) return;
  const h3=tool.querySelector('h3')?.textContent?.trim() || toolId;
  const resultEl=tool.querySelector('.result');
  if(!resultEl || !resultEl.classList.contains('show')){
    alert('Calcule primeiro para exportar.');
    return;
  }
  // collect visible result texts
  let lines=[h3,'', 'â€” Ferramentas KODAROS â€”', ''];
  tool.querySelectorAll('.result .res').forEach(function(r){
    const v=r.querySelector('.v')?.textContent?.trim();
    const l=r.querySelector('.l')?.textContent?.trim();
    if(v && l) lines.push(l + ': ' + v);
  });
  tool.querySelectorAll('.result .answer-box').forEach(function(a){
    if(a.textContent.trim()) lines.push('', a.textContent.trim());
  });
  tool.querySelectorAll('.result table.tbl').forEach(function(tbl){
    lines.push('');
    const heads=[...tbl.querySelectorAll('thead th')].map(th=>th.textContent.trim()).join(' | ');
    if(heads) lines.push(heads);
    [...tbl.querySelectorAll('tbody tr')].forEach(tr=>{
      const row=[...tr.querySelectorAll('td')].map(td=>td.textContent.trim()).join(' | ');
      lines.push(row);
    });
  });
  lines.push('', location.origin + location.pathname + '#' + (tool.closest('.tab-panel')?.id||'') + '/' + toolId);
  // try PNG via canvas, fallback to TXT
  try{
    const c=document.createElement('canvas');
    const W=900, H= 220 + lines.length*26;
    c.width=W; c.height=Math.min(H, 1800);
    const x=c.getContext('2d');
    x.fillStyle='#0B0F1A'; x.fillRect(0,0,W,c.height);
    x.strokeStyle='rgba(255,255,255,0.08)'; x.strokeRect(16,16,W-32,c.height-32);
    x.fillStyle='#E6E8EE'; x.font='700 22px Figtree, Arial, sans-serif';
    x.fillText(h3, 32, 48);
    x.fillStyle='#9AA3B8'; x.font='500 13px Figtree, Arial, sans-serif';
    x.fillText('KODAROS â€¢ kodarosferramentas', 32, 70);
    x.fillStyle='#E6E8EE'; x.font='400 15px Figtree, Arial, sans-serif';
    let y=110;
    x.textBaseline='top';
    // wrap long lines
    lines.slice(3).forEach(function(line){
      if(!line){ y+=10; return; }
      // simple wrap at 85 chars
      const maxChars=78;
      if(line.length>maxChars){
        const words=line.split(' ');
        let cur='';
        words.forEach(function(w){
          const test=cur?cur+' '+w:w;
          if(test.length>maxChars){ x.fillText(cur,32,y); y+=20; cur=w; } else cur=test;
        });
        if(cur){ x.fillText(cur,32,y); y+=20; }
      } else { x.fillText(line,32,y); y+=20; }
      if(y>c.height-30) return;
    });
    const url=c.toDataURL('image/png');
    const a=document.createElement('a');
    a.download='kodaros-'+toolId+'.png';
    a.href=url; a.click();
    const orig=btn.textContent; btn.textContent='PNG baixado!'; setTimeout(function(){ btn.textContent=orig; }, 1500);
    trackEvent('export_png', {tool: toolId});
  } catch(e){
    // fallback TXT
    const blob=new Blob([lines.join('\n')], {type:'text/plain;charset=utf-8'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download='kodaros-'+toolId+'.txt'; a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 1000);
    trackEvent('export_txt', {tool: toolId});
  }
}

/* ---------- Recolher abas (removido â€” botÃ£o recolher nÃ£o Ã© mais necessÃ¡rio) ---------- */
(function(){
  const tabsEl = document.getElementById('tabs');
  if (!tabsEl) return;
  tabsEl.classList.remove('collapsed');
})();

/* ---------- Auto-cÃ¡lculo + ValidaÃ§Ã£o + PersistÃªncia ---------- */
(function initAutoCalcAndPersist(){
  // harden number inputs
  document.querySelectorAll('.tool input[type="number"]').forEach(function(el){
    if(!el.hasAttribute('min')) el.setAttribute('min','0');
    if(!el.hasAttribute('step')) el.setAttribute('step','any');
    if(!el.hasAttribute('inputmode')) el.setAttribute('inputmode','decimal');
  });
  const STORAGE_KEY='kodaros_tools_v1';
  let store={};
  try{ store = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}'); } catch(e){ store={}; }
  function saveStore(){ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch(e){} }

  // restaura valores
  document.querySelectorAll('.tool input, .tool textarea, .tool select').forEach(function(el){
    if(!el.id) return;
    if(store[el.id] !== undefined){
      el.value = store[el.id];
    }
    el.addEventListener('input', function(){
      store[el.id]=el.value;
      saveStore();
      validateField(el);
    });
    el.addEventListener('change', function(){
      store[el.id]=el.value;
      saveStore();
    });
  });
  // checkboxes
  document.querySelectorAll('.tool input[type=checkbox]').forEach(function(el){
    if(!el.id) return;
    if(store[el.id] !== undefined) el.checked = store[el.id]==='true' || store[el.id]===true;
    el.addEventListener('change', function(){ store[el.id]=el.checked; saveStore(); });
  });

  function validateField(el){
    const v = el.value.trim();
    const field = el.closest('.field');
    if(!field) return true;
    // skip file inputs and empty optional text
    if(el.type==='file' || el.type==='checkbox') return true;
    if(el.type==='number'){
      const n = parseFloat(v);
      if(v!=='' && (!isFinite(n) || n < 0)){
        field.classList.add('has-error');
        let err = field.querySelector('.field-error');
        if(!err){ err=document.createElement('div'); err.className='field-error'; field.appendChild(err); }
        err.textContent = n < 0 ? 'Valor nÃ£o pode ser negativo.' : 'Valor invÃ¡lido.';
        return false;
      } else {
        field.classList.remove('has-error');
        const err = field.querySelector('.field-error');
        if(err) err.remove();
        return true;
      }
    }
    return true;
  }

  // debounce auto-calc
  const toolMap = [
    {ids:['c1_gasto','c1_cli','c1_ticket','c1_freq','c1_ret','c1_marg'], fn:'calcCAC'},
    {ids:['c2_cac','c2_ticket','c2_marg','c2_orc','c2_cresc','c2_sem'], fn:'calcEscala'},
    {ids:['c3_vis','c3_t1','c3_t2','c3_t3','c3_t4','c3_nomes'], fn:'calcFunil'},
    {ids:['r_inv','r_rec'], fn:'calcROAS'},
    {ids:['be_custo','be_ticket','be_cv'], fn:'calcBreakEven'},
    {ids:['m_imp','m_custo','m_cli','m_conv','m_lead'], fn:'calcMetrica'},
    {ids:['o_total','o_fb','o_gg','o_tk'], fn:'calcOrcamento'},
    {ids:['cpl_ticket','cpl_marg','cpl_conv'], fn:'calcCPL'},
    {ids:['ab_ctra','ab_ctrb','ab_imp'], fn:'simAB'},
    {ids:['cr_ini','cr_pre','cr_abre','cr_pico','cr_fecha'], fn:'calcCronograma'},
    {ids:['sr_leads','sr_conv','sr_preco'], fn:'calcReceita'},
    {ids:['of_preco','of_desc','of_parc','of_juros'], fn:'calcOferta'},
    {ids:['pr_custo','pr_fixo','pr_marg','pr_imp'], fn:'calcPrecificacao'},
    {ids:['ml_preco','ml_custo'], fn:'calcMargem'},
    {ids:['fc_ini','fc_ent','fc_sai','fc_mes'], fn:'calcFluxo'},
    {ids:['cg_custo','cg_est','cg_rec','cg_pag'], fn:'calcCapitalGiro'},
    {ids:['mt_meta','mt_ticket','mt_conv','mt_dias'], fn:'calcMetas'},
    {ids:['sd_preco','sd_desc','sd_custo','sd_vol'], fn:'calcDesconto'},
    {ids:['tm_meta','tm_cli'], fn:'calcTicket'},
    {ids:['n_prom','n_pass','n_det','n_total','n_rec'], fn:'calcNPS'},
    {ids:['s_vol','s_at','s_tmp','s_horas'], fn:'calcSLA'},
    {ids:['vr_cli','vr_ticket','vr_tx'], fn:'calcValorRec'},
    {ids:['pe_fixo','pe_preco','pe_cv'], fn:'calcEquilibrio'},
    {ids:['jc_aporte','jc_taxa','jc_mes'], fn:'calcJuros'},
    {ids:['pl_lucro','pl_pl'], fn:'calcProLabore'},
    {ids:['fv_lead','fv_prop','fv_fecha'], fn:'calcFunilVendas'},
    {ids:['fu_lead','fu_tx','fu_tent'], fn:'calcFollow'},
    {ids:['ce_sem','ce_semanas'], fn:'calcCalendario'},
    {ids:['rc_inv','rc_leads','rc_conv','rc_ticket'], fn:'calcROIConteudo'},
    {ids:['hf_meta','hf_horas','hf_marg'], fn:'calcHoraFat'},
    {ids:['ma_meta','ma_mes'], fn:'calcMetasAn'},
    {ids:['cpe_inv','cpe_ins'], fn:'calcCPE'},
    {ids:['rc2_aband','rc2_ticket','rc2_tx','rc2_custo'], fn:'calcCarrinho'},
    {ids:['ch_ini','ch_perd','ch_ticket','ch_marg'], fn:'calcChurn'},
    {ids:['as_subs','as_ticket','as_novos','as_churn','as_mes'], fn:'calcMRR'},
    {ids:['au_horas','au_vhora','au_custo','au_impl'], fn:'calcAutomacao'}
  ];
  const debounceMap={};
  function debounce(fn, wait){ let t; return function(){ clearTimeout(t); t=setTimeout(fn, wait); }; }
  toolMap.forEach(function(entry){
    const handler = debounce(function(){
      // validate all fields first
      let ok=true;
      entry.ids.forEach(function(id){
        const el=document.getElementById(id);
        if(el && !validateField(el)) ok=false;
      });
      if(!ok) return;
      try{ window[entry.fn](); } catch(e){}
    }, 700);
    entry.ids.forEach(function(id){
      const el=document.getElementById(id);
      if(el) el.addEventListener('input', handler);
    });
  });
  // add reset per tool
  document.querySelectorAll('.tool').forEach(function(tool){
    const btnRow = tool.querySelector('.tool-actions');
    if(!btnRow) return;
    const resetBtn=document.createElement('button');
    resetBtn.className='btn btn-ghost btn-sm';
    resetBtn.type='button';
    resetBtn.textContent='Limpar';
    resetBtn.addEventListener('click', function(){
      tool.querySelectorAll('input, textarea, select').forEach(function(el){
        if(el.type==='checkbox') el.checked=false;
        else if(el.type!=='file') el.value='';
        if(el.id) delete store[el.id];
      });
      saveStore();
      const res=tool.querySelector('.result');
      if(res) res.classList.remove('show');
      tool.querySelectorAll('.field.has-error').forEach(function(f){ f.classList.remove('has-error'); });
    });
    btnRow.appendChild(resetBtn);
  });
})();

/* ---------- Helpers de seguranÃ§a ---------- */
function escapeHTML(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

/* ---------- Copiar ---------- */
function copyText(id, trigger){
  const el = document.getElementById(id);
  if(!el) return;
  const isInput = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  const text = isInput ? el.value : (el.innerText || el.textContent || '');
  const btn = trigger || (typeof event !== 'undefined' ? event.target : null);
  const orig = btn ? btn.textContent : '';
  function done(){
    if(btn){
      btn.textContent = 'Copiado!';
      setTimeout(function(){ btn.textContent = orig.includes('Copiar') ? orig : 'Copiar'; }, 1500);
    }
  }
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(function(){
      fallbackCopy(text, done);
    });
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, cb){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly','');
  ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta);
  ta.select();
  try{ document.execCommand('copy'); } catch(e){}
  document.body.removeChild(ta);
  if(cb) cb();
}

/* =========================================================
   TAB 1 â€” AQUISIÃ‡ÃƒO & TRÃFEGO
   ========================================================= */

/* 1. CAC & LTV (portado) */
function calcCAC(){
  const gasto=numv('c1_gasto'), cli=numv('c1_cli'), ticket=numv('c1_ticket'),
        freq=numv('c1_freq'), ret=numv('c1_ret'), marg=numv('c1_marg')/100;
  if(!cli){ alert('Informe o nÃºmero de clientes adquiridos.'); return; }
  const cac=gasto/cli;
  const ltv=ticket*freq*(ret/12);
  const ratio=ltv/cac;
  const lucroMensal=(ticket*freq/12)*marg;
  const pay=cac/lucroMensal;
  document.getElementById('c1_cac').textContent=num(cac);
  document.getElementById('c1_ltv').textContent=num(ltv);
  document.getElementById('c1_ratio').textContent=num(ratio,1)+':1';
  document.getElementById('c1_pay').textContent=num(pay);
  const box=document.getElementById('c1_ratio_box');
  box.className='res '+(ratio>=3?'good':(ratio<1?'bad':''));
  show('c1_res');
}

/* 2. Projetor de Escala (portado) */
function calcEscala(){
  const cac=numv('c2_cac'), ticket=numv('c2_ticket'), marg=numv('c2_marg')/100,
        orc0=numv('c2_orc'), cresc=numv('c2_cresc')/100, sem=Math.max(1,Math.round(numv('c2_sem')));
  let orc=orc0, tCli=0, tRec=0, tGasto=0, tLuc=0;
  const tb=document.querySelector('#c2_tbl tbody'); tb.innerHTML='';
  for(let i=1;i<=sem;i++){
    const clientes=orc/cac;
    const receita=clientes*ticket;
    const lucro=receita*marg;
    tCli+=clientes; tRec+=receita; tGasto+=orc; tLuc+=lucro;
    const tr=document.createElement('tr');
    const tds=[''+i, brl(orc), num(clientes), brl(receita), brl(lucro)];
    tds.forEach((v,idx)=>{
      const td=document.createElement('td');
      td.textContent=v;
      if(idx===0) td.style.textAlign='left';
      tr.appendChild(td);
    });
    tb.appendChild(tr);
    orc*=(1+cresc);
  }
  document.getElementById('c2_tcli').textContent=num(tCli);
  document.getElementById('c2_trec').textContent=brl(tRec);
  document.getElementById('c2_tluc').textContent=brl(tLuc);
  document.getElementById('c2_tgasto').textContent=brl(tGasto);
  show('c2_res');
}

/* 3. Auditor de Funil (portado) */
function calcFunil(){
  const vis=numv('c3_vis');
  const taxas=[numv('c3_t1')/100,numv('c3_t2')/100,numv('c3_t3')/100,numv('c3_t4')/100];
  const nomes=(val('c3_nomes').split(',').map(s=>s.trim())).concat(['Venda']);
  let entraram=vis, menor=1, gargaloIdx=0;
  const tb=document.querySelector('#c3_tbl tbody'); tb.innerHTML='';
  for(let i=0;i<taxas.length;i++){
    const conv=taxas[i];
    const sairam=entraram*(1-conv);
    const tr=document.createElement('tr');
    const label = (nomes[i]||('Etapa '+(i+1))) + ' â†’ ' + (nomes[i+1]||'Venda');
    [label, num(entraram), pct(conv*100), num(sairam)].forEach((v,idx)=>{
      const td=document.createElement('td');
      td.textContent=v;
      if(idx===0) td.style.textAlign='left';
      else td.style.textAlign='right';
      tr.appendChild(td);
    });
    tb.appendChild(tr);
    if(conv<menor){ menor=conv; gargaloIdx=i; }
    entraram=entraram*conv;
  }
  if(tb.children[gargaloIdx]) tb.children[gargaloIdx].classList.add('gargalo');
  const trf=document.createElement('tr');
  trf.className='total';
  ['Vendas totais', num(entraram), 'â€“', 'â€“'].forEach((v,idx)=>{
    const td=document.createElement('td'); td.textContent=v;
    td.style.textAlign = idx===0 ? 'left' : 'right';
    trf.appendChild(td);
  });
  tb.appendChild(trf);
  show('c3_res');
}

/* 4. ROI / ROAS */
function calcROAS(){
  const inv=numv('r_inv'), rec=numv('r_rec');
  if(!inv){ alert('Informe o investimento.'); return; }
  const roas=rec/inv;
  const roi=(rec-inv)/inv*100;
  const lucro=rec-inv;
  document.getElementById('r_roas').textContent=num(roas,2)+'x';
  document.getElementById('r_roi').textContent=(roi>=0?'+':'')+pct(roi);
  document.getElementById('r_lucro').textContent=brl(lucro);
  const box=document.getElementById('r_roi_box');
  box.className='res '+(roi>=0?'good':(roi<0?'bad':''));
  show('r_res');
}

/* 5. Break-even */
function calcBreakEven(){
  const custo=numv('be_custo'), ticket=numv('be_ticket'), cv=numv('be_cv');
  const mc=ticket-cv;
  if(mc<=0){ alert('O ticket deve ser maior que o custo variÃ¡vel para haver margem.'); return; }
  const cli=custo/mc;
  const rec=cli*ticket;
  const beRoas=ticket/mc;
  document.getElementById('be_mc').textContent=brl(mc);
  document.getElementById('be_cli').textContent=num(cli);
  document.getElementById('be_rec').textContent=brl(rec);
  document.getElementById('be_roas').textContent=num(beRoas,2)+'x';
  document.getElementById('be_box').className='res '+(cli<=50?'good':'');
  show('be_res');
}

/* 6. Conversor de MÃ©tricas */
function calcMetrica(){
  const imp=numv('m_imp'), custo=numv('m_custo'), cli=numv('m_cli'),
        conv=numv('m_conv'), lead=numv('m_lead');
  document.getElementById('m_cpm').textContent=imp?brl(custo/imp*1000):'â€“';
  document.getElementById('m_cpc').textContent=cli?brl(custo/cli):'â€“';
  document.getElementById('m_ctr').textContent=imp?pct(cli/imp*100):'â€“';
  document.getElementById('m_cpa').textContent=conv?brl(custo/conv):'â€“';
  document.getElementById('m_cpl').textContent=lead?brl(custo/lead):'â€“';
  show('m_res');
}

/* 7. Planejador de OrÃ§amento */
function calcOrcamento(){
  const total=numv('o_total');
  const fb=numv('o_fb'), gg=numv('o_gg'), tk=numv('o_tk');
  const soma=fb+gg+tk;
  const f=fb/(soma||1), g=gg/(soma||1), t=tk/(soma||1);
  document.getElementById('o_fbv').textContent=brl(total*f);
  document.getElementById('o_ggv').textContent=brl(total*g);
  document.getElementById('o_tkv').textContent=brl(total*t);
  document.getElementById('o_soma').textContent=pct(soma);
  show('o_res');
}

/* 8. UTM Builder */
function buildUTM(){
  let url=(val('u_url')||'').trim();
  if(!url){ alert('Informe a URL base.'); return; }
  try{ new URL(url); } catch(e){ alert('URL base invÃ¡lida. Use https://...'); return; }
  const params={};
  const map={'u_source':'utm_source','u_medium':'utm_medium','u_camp':'utm_campaign','u_term':'utm_term','u_cont':'utm_content'};
  for(const k in map){ const v=(document.getElementById(k).value||'').trim(); if(v) params[map[k]]=v; }
  const keys=Object.keys(params);
  if(keys.length===0){ alert('Preencha ao menos um parÃ¢metro UTM.'); return; }
  const qs=keys.map(k=>k+'='+encodeURIComponent(params[k])).join('&');
  let out=url;
  out += url.indexOf('?')>=0 ? (url.endsWith('?')||url.endsWith('&') ? '' : '&') : '?';
  out += qs;
  document.getElementById('u_out').value=out;
  show('u_res');
}

/* 9. Auditor CRO */
const CRO_ITEMS=[
  'TÃ­tulo principal com benefÃ­cio claro',
  'Chamada para aÃ§Ã£o (CTA) visÃ­vel acima da dobra',
  'Prova social (depoimentos/avaliaÃ§Ãµes)',
  'Oferta ou garantia destacada',
  'FormulÃ¡rio curto (poucos campos)',
  'Carregamento rÃ¡pido (<3s)',
  'Responsiva em mobile',
  'UrgÃªncia ou escassez legÃ­tima',
  'Texto focado em benefÃ­cios (nÃ£o sÃ³ caracterÃ­sticas)',
  'Pixel de rastreamento/configurado'
];
(function(){
  const box=document.getElementById('cro_list');
  box.innerHTML=CRO_ITEMS.map((t,i)=>
    `<div class="check-item"><input type="checkbox" id="cro_${i}"><label for="cro_${i}">${t}</label></div>`).join('');
})();
function calcCRO(){
  let ok=0;
  for(let i=0;i<CRO_ITEMS.length;i++){ if(document.getElementById('cro_'+i).checked) ok++; }
  const score=Math.round(ok/CRO_ITEMS.length*100);
  document.getElementById('cro_score').textContent=score;
  document.getElementById('cro_chk').textContent=ok+'/'+CRO_ITEMS.length;
  document.getElementById('cro_bar').style.width=score+'%';
  let msg, cls;
  if(score>=80){ msg='Excelente! Sua pÃ¡gina tem os principais elementos de conversÃ£o.'; cls='good'; }
  else if(score>=50){ msg='RazoÃ¡vel. HÃ¡ itens importantes a ajustar para subir a conversÃ£o.'; cls=''; }
  else { msg='AtenÃ§Ã£o: faltam elementos crÃ­ticos de conversÃ£o na sua pÃ¡gina.'; cls='bad'; }
  const box=document.getElementById('cro_box');
  box.className='res '+(score>=80?'good':(score<50?'bad':''));
  document.getElementById('cro_msg').textContent=msg;
  document.getElementById('cro_msg').className='tool-desc '+(cls?('badge-'+cls):'');
  show('cro_res');
}

/* =========================================================
   TAB 2 â€” LANÃ‡AMENTO
   ========================================================= */

/* 1. Cronograma */
function fmtDate(d){ return d.toLocaleDateString('pt-BR'); }
function addDays(date, days){ const d=new Date(date); d.setDate(d.getDate()+days); return d; }
function calcCronograma(){
  const ini=val('cr_ini');
  if(!ini){ alert('Escolha a data de inÃ­cio.'); return; }
  let d=new Date(ini+'T00:00:00');
  const fases=[['PrÃ©-lanÃ§amento',numv('cr_pre')],['Abertura',numv('cr_abre')],['Pico',numv('cr_pico')],['Fechamento',numv('cr_fecha')]];
  const tb=document.querySelector('#cr_tbl tbody'); tb.innerHTML='';
  fases.forEach(function(f){
    const inicio=d;
    const fim=addDays(d, f[1]);
    const tr=document.createElement('tr');
    [f[0], fmtDate(inicio), fmtDate(fim)].forEach((v,idx)=>{
      const td=document.createElement('td'); td.textContent=v;
      td.style.textAlign = idx===0 ? 'left' : 'right';
      tr.appendChild(td);
    });
    tb.appendChild(tr);
    d=fim;
  });
  show('cr_res');
}

/* 2. Simulador de Receita */
function calcReceita(){
  const leads=numv('sr_leads'), conv=numv('sr_conv')/100, preco=numv('sr_preco');
  const calc=(mult)=>{ const L=leads*mult; const vendas=L*conv; return vendas*preco; };
  document.getElementById('sr_pess').textContent=brl(calc(0.7));
  document.getElementById('sr_real').textContent=brl(calc(1));
  document.getElementById('sr_otim').textContent=brl(calc(1.3));
  show('sr_res');
}

/* 3. Calculadora de Oferta */
function calcOferta(){
  const preco=numv('of_preco'), desc=numv('of_desc')/100, parc=Math.max(1,Math.round(numv('of_parc'))), juros=numv('of_juros')/100;
  const promo=preco*(1-desc);
  const parcela=promo*Math.pow(1+juros,parc)/parc;
  const total=parcela*parc;
  document.getElementById('of_promo').textContent=brl(promo);
  document.getElementById('of_parc_v').textContent=brl(parcela);
  document.getElementById('of_total').textContent=brl(total);
  show('of_res');
}

/* =========================================================
   TAB 3 â€” FINANCEIRO
   ========================================================= */

/* 1. PrecificaÃ§Ã£o */
function calcPrecificacao(){
  const custo=numv('pr_custo'), fixo=numv('pr_fixo'), marg=numv('pr_marg')/100, imp=numv('pr_imp')/100;
  const denom=1-(marg+imp);
  if(denom<=0){ alert('Margem + impostos nÃ£o podem chegar a 100%.'); return; }
  const preco=(custo+fixo)/denom;
  document.getElementById('pr_preco').textContent=brl(preco);
  document.getElementById('pr_lucro').textContent=brl(preco-custo-fixo);
  show('pr_res');
}

/* 2. Margem de Lucro */
function calcMargem(){
  const preco=numv('ml_preco'), custo=numv('ml_custo');
  if(!preco){ alert('Informe o preÃ§o de venda.'); return; }
  const m=(preco-custo)/preco*100;
  document.getElementById('ml_marg').textContent=pct(m);
  document.getElementById('ml_lucro').textContent=brl(preco-custo);
  document.getElementById('ml_box').className='res '+(m>=30?'good':(m<0?'bad':''));
  show('ml_res');
}

/* 3. Fluxo de Caixa */
function calcFluxo(){
  let saldo=numv('fc_ini'), ent=numv('fc_ent'), sai=numv('fc_sai');
  const meses=Math.max(1,Math.round(numv('fc_mes')));
  const tb=document.querySelector('#fc_tbl tbody'); tb.innerHTML='';
  for(let i=1;i<=meses;i++){
    saldo=saldo+ent-sai;
    const tr=document.createElement('tr');
    [String(i), brl(ent), brl(sai), brl(saldo)].forEach((v,idx)=>{
      const td=document.createElement('td'); td.textContent=v;
      td.style.textAlign = idx===0 ? 'left' : 'right';
      tr.appendChild(td);
    });
    if(saldo<0) tr.classList.add('gargalo');
    tb.appendChild(tr);
  }
  show('fc_res');
}

/* 4. Capital de Giro */
function calcCapitalGiro(){
  const custoM=numv('cg_custo'), est=numv('cg_est'), rec=numv('cg_rec'), pag=numv('cg_pag');
  const diario=custoM/30;
  const ciclo=est+rec-pag;
  document.getElementById('cg_val').textContent=brl(diario*ciclo);
  document.getElementById('cg_ciclo').textContent=num(ciclo)+' dias';
  show('cg_res');
}

/* =========================================================
   TAB 4 â€” VENDAS
   ========================================================= */

/* 1. Metas */
function calcMetas(){
  const meta=numv('mt_meta'), ticket=numv('mt_ticket'), conv=numv('mt_conv')/100, dias=numv('mt_dias');
  if(!ticket||!conv){ alert('Informe ticket mÃ©dio e conversÃ£o.'); return; }
  const unid=meta/ticket;
  const vis=unid/conv;
  document.getElementById('mt_unid').textContent=num(unid);
  document.getElementById('mt_dia').textContent=num(unid/dias);
  document.getElementById('mt_vis').textContent=num(vis/dias);
  show('mt_res');
}

/* 2. Simulador de Desconto */
function calcDesconto(){
  const preco=numv('sd_preco'), desc=numv('sd_desc')/100, custo=numv('sd_custo'), vol=numv('sd_vol');
  const p2=preco*(1-desc);
  const lucro=(p2-custo)*vol;
  const maxDesc=(preco-custo)/preco*100;
  document.getElementById('sd_preco2').textContent=brl(p2);
  document.getElementById('sd_lucro').textContent=brl(lucro);
  document.getElementById('sd_max').textContent=pct(maxDesc);
  document.getElementById('sd_box').className='res '+(lucro>0?'good':(lucro<0?'bad':''));
  show('sd_res');
}

/* 3. Ticket MÃ©dio */
function calcTicket(){
  const meta=numv('tm_meta'), cli=numv('tm_cli');
  if(!cli){ alert('Informe o nÃºmero de clientes.'); return; }
  document.getElementById('tm_ticket').textContent=brl(meta/cli);
  document.getElementById('tm_check').textContent='R$ '+num(meta);
  show('tm_res');
}

/* =========================================================
   TAB 5 â€” SUPORTE
   ========================================================= */

/* 1. NPS / Ãndice de ReclamaÃ§Ãµes */
function calcNPS(){
  const prom=numv('n_prom'), pass=numv('n_pass'), det=numv('n_det');
  const totalResp=prom+pass+det;
  const nps=totalResp?((prom-det)/totalResp*100):0;
  const total=numv('n_total'), rec=numv('n_rec');
  const idx=total?(rec/total*100):0;
  document.getElementById('n_nps').textContent=Math.round(nps);
  document.getElementById('n_idx').textContent=pct(idx);
  document.getElementById('n_ppm').textContent=num(total?rec/total*1000:0);
  document.getElementById('n_box').className='res '+(nps>=50?'good':(nps<0?'bad':''));
  show('n_res');
}

/* 2. Gerador de Resposta */
function gerarResposta(){
  const nome=val('gr_nome')||'Cliente', canal=val('gr_canal')||'', prob=val('gr_prob')||'',
        acao=val('gr_acao')||'', prazo=val('gr_prazo')||'', comp=val('gr_comp')||'';
  let txt=`OlÃ¡, ${nome}!\n\n`;
  txt+=`Agradecemos por nos acionar pelo ${canal} e lamento pelo ocorrido com relaÃ§Ã£o a: ${prob}.\n\n`;
  txt+=`Entendemos a importÃ¢ncia do seu tempo e jÃ¡ tomamos a seguinte atitude: ${acao}, no prazo de ${prazo}.`;
  if(comp) txt+=` Como forma de compensar, disponibilizamos: ${comp}.`;
  txt+=`\n\nSegueremos acompanhando atÃ© a resoluÃ§Ã£o. Conte com a KODAROS.`;
  document.getElementById('gr_out').textContent=txt;
  show('gr_res');
}

/* 3. SLA */
function calcSLA(){
  const vol=numv('s_vol'), at=numv('s_at'), tmp=numv('s_tmp'), horas=numv('s_horas');
  const cap=at*horas*60/tmp;
  const backlog=vol-cap;
  document.getElementById('s_cap').textContent=num(cap);
  document.getElementById('s_fila').textContent=num(backlog>0?backlog:0);
  const ok=cap>=vol;
  document.getElementById('s_status').textContent=ok?'Dentro do SLA':'Abaixo do SLA';
  document.getElementById('s_box').className='res '+(ok?'good':'bad');
  show('s_res');
}

/* =========================================================
   TAB 6 â€” OPERAÃ‡ÃƒO
   ========================================================= */

/* 1. Checklist Semanal */
const CHK_ITEMS=[
  'Revisei nÃºmeros de receita e custos da semana',
  'Acompanhei pipeline de vendas e conversÃ£o',
  'Respondi reclamaÃ§Ãµes e tickets de suporte',
  'Atualizei tarefas da equipe (ritual M3)',
  'Planejei a prÃ³xima semana (metas e prioridades)',
  'Analisei indicadores de trÃ¡fego/marketing',
  'Cuidei de finanÃ§as (contas a pagar/receber)',
  'Reservei tempo para melhoria de processo'
];
(function(){
  const box=document.getElementById('chk_list');
  box.innerHTML=CHK_ITEMS.map((t,i)=>
    `<div class="check-item"><input type="checkbox" id="chk_${i}"><label for="chk_${i}">${t}</label></div>`).join('');
})();
function calcChecklist(){
  let ok=0;
  for(let i=0;i<CHK_ITEMS.length;i++){ if(document.getElementById('chk_'+i).checked) ok++; }
  const score=Math.round(ok/CHK_ITEMS.length*100);
  document.getElementById('chk_score').textContent=score;
  document.getElementById('chk_ok').textContent=ok+'/'+CHK_ITEMS.length;
  document.getElementById('chk_bar').style.width=score+'%';
  document.getElementById('chk_box').className='res '+(score>=75?'good':(score<50?'bad':''));
  show('chk_res');
}

/* 2. OKR */
function calcOKR(){
  function p(c,t){ return t? c/t*100 : 0; }
  const p1=p(numv('ok1_c'),numv('ok1_t')), p2=p(numv('ok2_c'),numv('ok2_t')), p3=p(numv('ok3_c'),numv('ok3_t'));
  document.getElementById('ok_p1').textContent=pct(p1);
  document.getElementById('ok_p2').textContent=pct(p2);
  document.getElementById('ok_p3').textContent=pct(p3);
  document.getElementById('ok_media').textContent=pct((p1+p2+p3)/3);
  show('ok_res');
}

/* 3. Pareto */
function calcPareto(){
  const itens=[];
  for(let i=1;i<=4;i++){
    const n=document.getElementById('pa'+i+'_n').value.trim();
    const v=numv('pa'+i+'_v');
    if(n) itens.push({n:n, v:v});
  }
  const total=itens.reduce((s,x)=>s+x.v,0);
  itens.sort((a,b)=>b.v-a.v);
  let acum=0;
  const tb=document.querySelector('#pa_tbl tbody'); tb.innerHTML='';
  let vitalCount=0;
  let reached80=false;
  itens.forEach(function(x){
    acum+=x.v;
    const pctAcum = total? acum/total*100 : 0;
    // vital = itens que compÃµem atÃ© cruzar 80%
    const vital = !reached80 && total>0;
    if(vital) vitalCount++;
    if(pctAcum >= 80) reached80 = true;
    const tr=document.createElement('tr');
    [x.n, num(x.v), pct(pctAcum), vital?'â­ Sim':'â€“'].forEach((v,idx)=>{
      const td=document.createElement('td'); td.textContent=v;
      td.style.textAlign = idx===0 ? 'left' : 'right';
      tr.appendChild(td);
    });
    if(vital) tr.classList.add('gargalo');
    tb.appendChild(tr);
  });
  document.getElementById('pa_msg').textContent='PrincÃ­pio de Pareto: '+vitalCount+' de '+itens.length+' causa(s) respondem por atÃ© 80% do impacto. Foque nelas primeiro.';
  show('pa_res');
}

/* =========================================================
   NOVAS FERRAMENTAS (acrescentadas)
   ========================================================= */

/* ---- TAB 1 extras ---- */
function calcCPL(){
  const ticket=numv('cpl_ticket'), marg=numv('cpl_marg')/100, conv=numv('cpl_conv')/100;
  if(!conv){ alert('Informe a conversÃ£o leadâ†’venda.'); return; }
  const cacMax=ticket*marg, cpl=cacMax*conv;
  document.getElementById('cpl_val').textContent=brl(cpl);
  document.getElementById('cpl_cac').textContent=brl(cacMax);
  show('cpl_res');
}
function gerarAdCopy(){
  const prod=val('ad_prod')||'Seu produto', pub=val('ad_pub')||'seu pÃºblico',
        dor=val('ad_dor')||'', ben=val('ad_ben')||'', prova=val('ad_prova')||'';
  let t=`Para ${pub} que sofrem com ${dor}:\n\n${prod} entrega ${ben}.\n\nComprovado por ${prova}.\n\nClique e descubra como.`;
  document.getElementById('ad_out').textContent=t;
  show('ad_res');
}
function simAB(){
  const a=numv('ab_ctra'), b=numv('ab_ctrb'), imp=numv('ab_imp');
  if(!imp){ alert('Informe as impressÃµes.'); return; }
  const cliA=imp*a/100, cliB=imp*b/100;
  document.getElementById('ab_win').textContent='VariaÃ§Ã£o '+(b>=a?'B':'A');
  document.getElementById('ab_cli').textContent='+'+num(Math.abs(cliB-cliA));
  document.getElementById('ab_box').className='res '+(Math.abs(b-a)>0?'good':'');
  show('ab_res');
}
function calcCarrinho(){
  const aband=numv('rc2_aband'), ticket=numv('rc2_ticket'), tx=numv('rc2_tx')/100, custo=numv('rc2_custo');
  const rec=aband*ticket*tx;
  const ganho=rec-custo;
  const roi=custo?ganho/custo*100:0;
  document.getElementById('rc2_rec').textContent=brl(rec);
  document.getElementById('rc2_lucro').textContent=brl(ganho);
  document.getElementById('rc2_roi').textContent=(roi>=0?'+':'')+pct(roi);
  document.getElementById('rc2_box').className='res '+(ganho>0?'good':(ganho<0?'bad':''));
  show('rc2_res');
}

/* ---- TAB 2 extras ---- */
function calcCronInvertido(){
  const fim=val('ci_fim');
  if(!fim){ alert('Escolha a data de fechamento.'); return; }
  let d=new Date(fim+'T00:00:00');
  const fases=[['Fechamento',numv('ci_fecha')],['Pico',numv('ci_pico')],['Abertura',numv('ci_abre')],['PrÃ©-lanÃ§amento',numv('ci_pre')]];
  const tb=document.querySelector('#ci_tbl tbody'); tb.innerHTML='';
  for(let i=fases.length-1;i>=0;i--){
    const dur=fases[i][1], termino=d, inicio=addDays(d, -dur);
    const tr=document.createElement('tr');
    [fases[i][0], fmtDate(inicio), fmtDate(termino)].forEach((v,idx)=>{
      const td=document.createElement('td'); td.textContent=v;
      td.style.textAlign = idx===0 ? 'left' : 'right';
      tr.appendChild(td);
    });
    tb.appendChild(tr); d=inicio;
  }
  show('ci_res');
}
function calcCPE(){
  const inv=numv('cpe_inv'), ins=numv('cpe_ins');
  if(!ins){ alert('Informe os inscritos.'); return; }
  document.getElementById('cpe_val').textContent=brl(inv/ins);
  show('cpe_res');
}
function gerarSeqEmail(){
  const nome=val('se_nome')||'LanÃ§amento';
  const e=[
    `E-mail 1 â€” Aquecimento: conteÃºdo educativo sobre o problema que ${nome} resolve.`,
    `E-mail 2 â€” HistÃ³ria: mostre a jornada e a transformaÃ§Ã£o do seu mÃ©todo.`,
    `E-mail 3 â€” Abertura: divulgue que as inscriÃ§Ãµes abriram, com benefÃ­cios.`,
    `E-mail 4 â€” Pico: apresente depoimentos e a oferta principal.`,
    `E-mail 5 â€” Fechamento: Ãºltimo aviso de encerramento e bÃ´nus.`
  ];
  document.getElementById('se_out').textContent=e.join('\n\n');
  show('se_res');
}

/* ---- TAB 3 extras ---- */
function calcEquilibrio(){
  const fixo=numv('pe_fixo'), preco=numv('pe_preco'), cv=numv('pe_cv');
  const mc=preco-cv;
  if(mc<=0){ alert('O preÃ§o deve ser maior que o custo variÃ¡vel.'); return; }
  document.getElementById('pe_cli').textContent=num(fixo/mc);
  document.getElementById('pe_marg').textContent=brl(mc);
  show('pe_res');
}
function calcJuros(){
  const aporte=numv('jc_aporte'), taxa=numv('jc_taxa')/100, meses=Math.max(1,Math.round(numv('jc_mes')));
  let total=0;
  // aporte no fim do perÃ­odo: rende a partir do prÃ³ximo mÃªs
  for(let i=1;i<=meses;i++){ total = total*(1+taxa) + aporte; }
  document.getElementById('jc_total').textContent=brl(total);
  document.getElementById('jc_rend').textContent=brl(total-aporte*meses);
  show('jc_res');
}
function calcProLabore(){
  const lucro=numv('pl_lucro'), pl=numv('pl_pl')/100;
  document.getElementById('pl_pro').textContent=brl(lucro*pl);
  document.getElementById('pl_dist').textContent=brl(lucro*(1-pl));
  show('pl_res');
}
function calcMRR(){
  let subs=numv('as_subs');
  const ticket=numv('as_ticket'), novos=numv('as_novos'), churn=Math.min(0.95, numv('as_churn')/100);
  const meses=Math.max(1,Math.round(numv('as_mes')));
  if(!subs){ alert('Informe o nÃºmero de assinantes atuais.'); return; }
  const mrr0=subs*ticket;
  for(let i=0;i<meses;i++){ subs=subs*(1-churn)+novos; }
  const mrrF=subs*ticket;
  const cresc=mrr0?(mrrF-mrr0)/mrr0*100:0;
  document.getElementById('as_mrr0').textContent=brl(mrr0);
  document.getElementById('as_mrrf').textContent=brl(mrrF);
  document.getElementById('as_arr').textContent=brl(mrrF*12);
  document.getElementById('as_cresc').textContent=(cresc>=0?'+':'')+pct(cresc);
  document.getElementById('as_box').className='res '+(cresc>0?'good':(cresc<0?'bad':''));
  show('as_res');
}

/* ---- TAB 4 extras ---- */
function gerarScript(){
  const obj=val('so_obj')||'objeÃ§Ã£o', prod=val('so_prod')||'produto', ben=val('so_ben')||'', prova=val('so_prova')||'';
  let t=`Cliente: "${obj}".\n\nEu entendo. Muitos sentem isso no inÃ­cio.\nO que o ${prod} entrega Ã© justamente ${ben}.\nTemos ${prova} que comprovam o resultado.\nPosso te mostrar como fazer sentido para o seu caso?`;
  document.getElementById('so_out').textContent=t;
  show('so_res');
}
function calcFunilVendas(){
  const lead=numv('fv_lead'), prop=numv('fv_prop'), fecha=numv('fv_fecha');
  if(!lead){ alert('Informe os leads.'); return; }
  document.getElementById('fv_lp').textContent=pct(prop/lead*100);
  document.getElementById('fv_pf').textContent=pct(fecha/prop*100);
  document.getElementById('fv_geral').textContent=pct(fecha/lead*100);
  show('fv_res');
}
function calcFollow(){
  const lead=numv('fu_lead'), tx=numv('fu_tx')/100, tent=Math.max(1,Math.round(numv('fu_tent')));
  if(!lead){ alert('Informe os leads.'); return; }
  const resp=lead*(1-Math.pow(1-tx,tent)), base=lead*tx;
  document.getElementById('fu_resp').textContent=num(resp);
  document.getElementById('fu_extra').textContent='+'+num(resp-base);
  show('fu_res');
}
function calcChurn(){
  const ini=numv('ch_ini'), perd=numv('ch_perd'), ticket=numv('ch_ticket'), marg=numv('ch_marg')/100;
  if(!ini){ alert('Informe o nÃºmero de clientes no inÃ­cio do mÃªs.'); return; }
  const churn=perd/ini*100;
  const retencao=Math.max(0, 100-churn);
  const lifetime=churn>0 ? 100/churn : Infinity;
  const ltv=lifetime===Infinity ? Infinity : ticket*marg*lifetime;
  document.getElementById('ch_tx').textContent=pct(churn);
  document.getElementById('ch_ret').textContent=pct(retencao);
  document.getElementById('ch_life').textContent=isFinite(lifetime)?num(lifetime):'âˆž';
  document.getElementById('ch_ltv').textContent=isFinite(ltv)?brl(ltv):'âˆž';
  document.getElementById('ch_box').className='res '+(churn<=5?'good':(churn>15?'bad':''));
  show('ch_res');
}

/* ---- TAB 5 extras ---- */
function gerarPesquisa(){
  const p=[
    'De 1 a 5, quÃ£o satisfeito vocÃª estÃ¡ com o atendimento?',
    'O problema relatado foi resolvido na primeira interaÃ§Ã£o?',
    'O tempo de resposta atendeu sua expectativa?',
    'VocÃª recomendaria a KODAROS para um colega? (0-10)',
    'O que poderÃ­amos melhorar no suporte?'
  ];
  document.getElementById('ps_out').textContent=p.map((x,i)=>(i+1)+'. '+x).join('\n');
  show('ps_res');
}
function calcValorRec(){
  const cli=numv('vr_cli'), ticket=numv('vr_ticket'), tx=numv('vr_tx')/100;
  document.getElementById('vr_val').textContent=brl(cli*ticket*tx);
  show('vr_res');
}
function gerarRespostaPub(){
  const nome=val('rp_nome')||'Cliente', canal=val('rp_canal')||'', prob=val('rp_prob')||'';
  let t=`Oi, ${nome}! Obrigado por compartilhar isso no ${canal}.\nLamentamos o ocorrido com: ${prob}.\nJÃ¡ identificamos a causa e vamos resolver. Pode nos chamar na DM para alinharmos a soluÃ§Ã£o?`;
  document.getElementById('rp_out').textContent=t;
  show('rp_res');
}

/* ---- TAB 6 extras ---- */
function copiarSWOT(){
  const t=`SWOT\n\nForÃ§as:\n${val('sw_forcas')}\n\nFraquezas:\n${val('sw_fraquezas')}\n\nOportunidades:\n${val('sw_op')}\n\nAmeaÃ§as:\n${val('sw_am')}`;
  navigator.clipboard.writeText(t).then(function(){
    if(event && event.target){ event.target.textContent='Copiado!'; setTimeout(function(){ event.target.textContent='Copiar SWOT'; }, 1500); }
  });
}
function calcHoraFat(){
  const meta=numv('hf_meta'), horas=numv('hf_horas'), marg=numv('hf_marg')/100;
  if(!horas){ alert('Informe as horas faturÃ¡veis.'); return; }
  document.getElementById('hf_val').textContent=brl(meta/horas*(1+marg));
  show('hf_res');
}
function calcMetasAn(){
  const meta=numv('ma_meta'), mes=Math.max(1,Math.round(numv('ma_mes')));
  document.getElementById('ma_mensal').textContent=brl(meta/mes);
  document.getElementById('ma_semanal').textContent=brl(meta/mes/4.3);
  show('ma_res');
}
function calcAutomacao(){
  const horas=numv('au_horas'), vhora=numv('au_vhora'), custo=numv('au_custo'), impl=numv('au_impl');
  const bruta=horas*vhora;
  const liq=bruta-custo;
  const payback=liq>0 ? impl/liq : Infinity;
  const investAno=impl+custo*12;
  const roi12=investAno>0 ? ((liq*12-investAno)/investAno*100) : 0;
  document.getElementById('au_bruta').textContent=brl(bruta);
  document.getElementById('au_liq').textContent=brl(liq);
  document.getElementById('au_payback').textContent=isFinite(payback)?num(payback):'â€“';
  document.getElementById('au_roi').textContent=(roi12>=0?'+':'')+pct(roi12);
  document.getElementById('au_box').className='res '+(liq>0?'good':(liq<0?'bad':''));
  show('au_res');
}

/* ---- TAB 7 ---- */
function calcCalendario(){
  const sem=numv('ce_sem'), semanas=numv('ce_semanas'), total=sem*semanas;
  document.getElementById('ce_total').textContent=num(total);
  document.getElementById('ce_mes').textContent=num(sem*4.33);
  show('ce_res');
}
function calcROIConteudo(){
  const inv=numv('rc_inv'), leads=numv('rc_leads'), conv=numv('rc_conv')/100, ticket=numv('rc_ticket');
  const rec=leads*conv*ticket, roi=inv?(rec-inv)/inv*100:0;
  document.getElementById('rc_roi').textContent=(roi>=0?'+':'')+pct(roi);
  document.getElementById('rc_rec').textContent=brl(rec);
  show('rc_res');
}
const SEO_ITEMS=[
  'TÃ­tulo da pÃ¡gina com palavra-chave principal',
  'Meta description Ãºnica e atrativa',
  'URL amigÃ¡vel (sem caracteres especiais)',
  'Imagens com atributo alt descritivo',
  'Estrutura de headings (H1/H2/H3)',
  'ConteÃºdo original e atualizado',
  'Links internos para pÃ¡ginas relevantes',
  'Velocidade de carregamento otimizada',
  'Sitemap e robots.txt configurados',
  'Dados estruturados (schema)'
];
(function(){
  const box=document.getElementById('seo_list');
  if(box) box.innerHTML=SEO_ITEMS.map((t,i)=>`<div class="check-item"><input type="checkbox" id="seo_${i}"><label for="seo_${i}">${t}</label></div>`).join('');
})();
function calcSEO(){
  let ok=0;
  for(let i=0;i<SEO_ITEMS.length;i++){ if(document.getElementById('seo_'+i).checked) ok++; }
  const score=Math.round(ok/SEO_ITEMS.length*100);
  document.getElementById('seo_score').textContent=score;
  document.getElementById('seo_chk').textContent=ok+'/'+SEO_ITEMS.length;
  document.getElementById('seo_bar').style.width=score+'%';
  document.getElementById('seo_box').className='res '+(score>=80?'good':(score<50?'bad':''));
  show('seo_res');
}

/* =========================================================
   MÃ“DULOS DE IDENTIDADE VISUAL (espelham o site principal)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  let isTabActive = true;
  document.addEventListener('visibilitychange', () => { isTabActive = !document.hidden; });

   /* ---- GALÃXIA ANIMADA ---- */
  (function initGalaxy() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dpr = window.devicePixelRatio || 1, width = 0, height = 0;
    let stars = [], nebulas = [], shootingStars = [], time = 0, nextShootingStar = 400, animId = null;
    const galaxyCenter = { x: 0.72, y: 0.30 };
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const palette = ['#E6E8EE', '#9AA3B8', '#C5A46A'];
    function rand(a, b) { return a + Math.random() * (b - a); }
    function createStars() {
      stars = [];
      const cx = width * galaxyCenter.x, cy = height * galaxyCenter.y;
      const bgCount = Math.round((width * height) / 8500);
      for (let i = 0; i < bgCount; i++) stars.push({ x: Math.random()*width, y: Math.random()*height, size: rand(0.3,1.4), twinkle: rand(0.4,2.0), phase: rand(0,Math.PI*2), color: palette[(Math.random()*palette.length)|0], galaxy: false });
      const spiralCount = Math.round((width * height) / 15000), arms = 2, maxR = Math.min(width, height) * 0.42;
      for (let i = 0; i < spiralCount; i++) {
        const arm = i % arms, angle = arm * Math.PI + i * 0.22, radius = Math.pow(Math.random(), 0.6) * maxR, a = angle + radius * 0.006, spread = rand(0.4, 1.6) * maxR * 0.06, r = radius + (Math.random()-0.5)*spread;
        stars.push({ x: cx + Math.cos(a)*r, y: cy + Math.sin(a)*r*0.62, size: rand(0.5,2.1), twinkle: rand(0.3,1.6), phase: rand(0,Math.PI*2), color: palette[(Math.random()*palette.length)|0], galaxy: true, arm });
      }
    }
    function createNebulas() {
      nebulas = [];
      const defs = [{color:'59, 91, 254',alpha:0.05},{color:'197, 164, 106',alpha:0.03},{color:'59, 91, 254',alpha:0.04}];
      for (let i = 0; i < 6; i++) { const d = defs[i % defs.length]; nebulas.push({ x: rand(0,width), y: rand(0,height), radius: rand(Math.min(width,height)*0.28, Math.min(width,height)*0.55), color: d.color, alpha: d.alpha, pulse: rand(0.10,0.30), phase: rand(0,Math.PI*2) }); }
    }
    function drawNebulas() {
      ctx.globalCompositeOperation = 'lighter';
      for (const n of nebulas) {
        const pulse = 0.72 + 0.28 * Math.sin(time * n.pulse * 0.02 + n.phase);
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
        g.addColorStop(0, `rgba(${n.color}, ${(n.alpha*pulse).toFixed(3)})`); g.addColorStop(1, `rgba(${n.color}, 0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, n.y, n.radius, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    function drawStars() {
      const cx = width*galaxyCenter.x, cy = height*galaxyCenter.y, offX = mouse.x*0.35, offY = mouse.y*0.35, rot = time*0.00011, cos = Math.cos(rot), sin = Math.sin(rot);
      for (const s of stars) {
        const tw = 0.55 + 0.45 * Math.sin(time*0.03*s.twinkle + s.phase);
        let x = s.x, y = s.y;
        if (s.galaxy) { const dx = s.x-cx, dy = s.y-cy; x = cx + dx*cos - dy*sin; y = cy + dx*sin + dy*cos; }
        ctx.globalAlpha = Math.min(1, tw*0.85 + 0.15); ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(x + offX, y + offY, s.size, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function spawn() { const sx=rand(0,width), sy=rand(0,height), dir=Math.random()*Math.PI*2, spd=rand(5,9); shootingStars.push({ x:sx, y:sy, vx:Math.cos(dir)*spd, vy:Math.sin(dir)*spd, life:1, decay:rand(0.008,0.016), length:rand(60,130) }); }
    function drawShooting() {
      for (let i = shootingStars.length-1; i >= 0; i--) {
        const s = shootingStars[i]; s.x += s.vx; s.y += s.vy; s.life -= s.decay;
        if (s.life <= 0) { shootingStars.splice(i,1); continue; }
        const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx*5, s.y - s.vy*5);
        g.addColorStop(0, `rgba(255,255,255, ${(s.life*0.9).toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx*5, s.y - s.vy*5); ctx.stroke();
      }
    }
    function resize() { dpr = window.devicePixelRatio || 1; width = window.innerWidth; height = window.innerHeight; canvas.width = width*dpr; canvas.height = height*dpr; canvas.style.width = width+'px'; canvas.style.height = height+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); createStars(); createNebulas(); }
    function animate() {
      if (isTabActive) {
        time += 1; mouse.x += (mouse.tx - mouse.x)*0.05; mouse.y += (mouse.ty - mouse.y)*0.05;
        if (time > nextShootingStar) { spawn(); nextShootingStar = time + rand(260,640); }
        ctx.clearRect(0,0,width,height); drawNebulas(); drawShooting(); drawStars();
      }
      animId = requestAnimationFrame(animate);
    }
    window.addEventListener('resize', resize);
    if (!isTouch) document.addEventListener('mousemove', e => { mouse.tx = (e.clientX/window.innerWidth - 0.5)*60; mouse.ty = (e.clientY/window.innerHeight - 0.5)*60; });
    resize(); animate();
  })();

  /* ---- NAVBAR ---- */
  (function initNavbar() {
    const navbar = document.getElementById('navbar'); if (!navbar) return;
    function handle() {
      const cur = window.pageYOffset;
      if (cur > 30) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
      // mantÃ©m navbar sempre visÃ­vel e fixa no topo (sem esconder no scroll)
      navbar.classList.remove('hidden');
      navbar.classList.add('visible');
    }
    window.addEventListener('scroll', handle, { passive: true });
    handle();
  })();

  /* ---- SMOOTH SCROLL ---- */
  (function initSmooth() {
    const navbar = document.getElementById('navbar');
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', function(e) {
      const href = this.getAttribute('href'); if (href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); const nh = navbar ? navbar.offsetHeight : 0; const pos = target.getBoundingClientRect().top + window.pageYOffset - nh - 20; window.scrollTo({ top: pos, behavior: 'smooth' }); }
    }));
  })();

  /* ---- SCROLL REVEAL ---- */
  (function initReveal() {
    const els = document.querySelectorAll('.panel-head, .tool');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const p = en.target.parentElement;
          if (p) { const sibs = Array.from(p.children).filter(c => c.classList.contains('tool')); const idx = sibs.indexOf(en.target); en.target.style.transitionDelay = `${Math.min(idx, 6) * 0.07}s`; }
          en.target.classList.add('active'); obs.unobserve(en.target);
          setTimeout(() => en.target.classList.remove('reveal', 'active'), 1100);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => { el.classList.add('reveal'); obs.observe(el); });
  })();

  /* ---- MAGNETIC BUTTONS ---- */
  (function initMagnetic() {
    if (isTouch) return;
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => { const r = btn.getBoundingClientRect(); btn.style.transform = `translate(${(e.clientX - r.left - r.width/2) * 0.15}px, ${(e.clientY - r.top - r.height/2) * 0.15}px)`; });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; btn.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), background 0.3s, box-shadow 0.3s'; });
      btn.addEventListener('mouseenter', () => { btn.style.transition = 'transform 0.1s ease, background 0.3s, box-shadow 0.3s'; });
    });
  })();

  /* ---- CURSOR GLOW ---- */
  (function initGlow() {
    if (isTouch) return;
    const g = document.createElement('div'); g.className = 'cursor-glow'; document.body.appendChild(g);
    let gx = 0, gy = 0, cgx = 0, cgy = 0, inWin = false;
    document.addEventListener('mousemove', e => { gx = e.clientX; gy = e.clientY; inWin = true; g.style.opacity = '1'; });
    document.addEventListener('mouseleave', () => { inWin = false; g.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { inWin = true; });
    (function loop() { if (isTabActive && inWin) { cgx += (gx - cgx)*0.08; cgy += (gy - cgy)*0.08; g.style.left = cgx+'px'; g.style.top = cgy+'px'; } requestAnimationFrame(loop); })();
  })();
});

/* =========================================================
   TEMPLATES EDITÃVEIS (cartÃ£o, post, cupom) â€” baixar PNG
   ========================================================= */
(function initTemplates(){
  const imgs={cartao:null, post:null, cupom:null};
  function loadImg(input, key){
    const file=input.files && input.files[0];
    if(!file) return;
    const reader=new FileReader();
    reader.onload=function(e){ const img=new Image(); img.onload=function(){ imgs[key]=img; renderers[key](); }; img.src=e.target.result; };
    reader.readAsDataURL(file);
  }
  function wrapText(ctx, text, cx, cy, maxW, lh){
    const words=text.split(' '); let line='', lines=[];
    for(const w of words){ const test=line?line+' '+w:w; if(ctx.measureText(test).width>maxW && line){ lines.push(line); line=w; } else line=test; }
    if(line) lines.push(line);
    const startY=cy-(lines.length-1)*lh/2;
    lines.forEach((l,i)=>ctx.fillText(l, cx, startY+i*lh));
  }
  function renderCartao(){
    const c=document.getElementById('cartao_canvas'); if(!c) return; const x=c.getContext('2d');
    const W=c.width, H=c.height;
    x.fillStyle='#0A0A0A'; x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,0.35)'; x.lineWidth=2; x.strokeRect(28,28,W-56,H-56);
    let lx=70;
    if(imgs.cartao){ const s=120; x.drawImage(imgs.cartao, lx, 95, s, s); lx=lx+s+34; }
    x.textBaseline='top'; x.textAlign='left';
    x.fillStyle='#FFFFFF'; x.font='700 52px Figtree, Arial, sans-serif'; x.fillText(val('cartao_nome')||'', lx, 110);
    x.fillStyle='#A3A3A3'; x.font='400 28px Figtree, Arial, sans-serif'; x.fillText(val('cartao_cargo')||'', lx, 178);
    x.strokeStyle='rgba(255,255,255,0.2)'; x.beginPath(); x.moveTo(70,285); x.lineTo(W-70,285); x.stroke();
    x.fillStyle='#F5F5F5'; x.font='400 24px Figtree, Arial, sans-serif';
    x.fillText(val('cartao_tel')||'', 70, 300);
    x.fillText(val('cartao_email')||'', 70, 340);
    x.fillText(val('cartao_site')||'', 70, 380);
  }
  function renderPost(){
    const c=document.getElementById('post_canvas'); if(!c) return; const x=c.getContext('2d');
    const W=c.width, H=c.height;
    x.fillStyle='#0A0A0A'; x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,0.25)'; x.lineWidth=3; x.strokeRect(40,40,W-80,H-80);
    if(imgs.post){ const s=150; x.drawImage(imgs.post, W/2-s/2, 90, s, s); }
    x.fillStyle='#FFFFFF'; x.textAlign='center'; x.textBaseline='middle';
    x.font='700 64px Figtree, Arial, sans-serif';
    wrapText(x, val('post_frase')||'', W/2, H/2, W-260, 78);
    x.fillStyle='#A3A3A3'; x.font='500 34px Figtree, Arial, sans-serif';
    x.fillText(val('post_autor')||'', W/2, H-110);
    x.textAlign='left';
  }
  function renderCupom(){
    const c=document.getElementById('cupom_canvas'); if(!c) return; const x=c.getContext('2d');
    const W=c.width, H=c.height;
    x.fillStyle='#0A0A0A'; x.fillRect(0,0,W,H);
    x.strokeStyle='rgba(255,255,255,0.3)'; x.lineWidth=3; x.strokeRect(40,40,W-80,H-80);
    x.textAlign='center'; x.textBaseline='middle'; x.fillStyle='#FFFFFF';
    x.font='800 70px Figtree, Arial, sans-serif'; x.fillText(val('cupom_tit')||'', W/2, 230);
    x.font='800 130px Figtree, Arial, sans-serif'; x.fillText(val('cupom_desc')||'', W/2, 470);
    x.fillStyle='#A3A3A3'; x.font='500 40px Figtree, Arial, sans-serif'; x.fillText(val('cupom_val')||'', W/2, 660);
    x.fillStyle='#F5F5F5'; x.font='700 48px Figtree, Arial, sans-serif'; x.fillText('Cupom: '+(val('cupom_cod')||''), W/2, 820);
    x.textAlign='left';
  }
  const renderers={cartao:renderCartao, post:renderPost, cupom:renderCupom};
  ['cartao_nome','cartao_cargo','cartao_tel','cartao_email','cartao_site'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input', renderCartao); });
  ['post_frase','post_autor'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input', renderPost); });
  ['cupom_tit','cupom_desc','cupom_val','cupom_cod'].forEach(id=>{ const el=document.getElementById(id); if(el) el.addEventListener('input', renderCupom); });
  const ci=document.getElementById('cartao_img'); if(ci) ci.addEventListener('change', function(){ loadImg(ci,'cartao'); });
  const pi=document.getElementById('post_img'); if(pi) pi.addEventListener('change', function(){ loadImg(pi,'post'); });
  document.querySelectorAll('[data-tpl]').forEach(btn=>{
    btn.addEventListener('click', function(){
      const key=btn.dataset.tpl, c=document.getElementById(key+'_canvas');
      if(!c) return;
      const link=document.createElement('a');
      link.download='kodaros-'+key+'.png';
      link.href=c.toDataURL('image/png');
      link.click();
    });
  });
  renderCartao(); renderPost(); renderCupom();
})();

/* =========================================================
   PWA â€” registro do Service Worker (offline)
   ========================================================= */
if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  });
}
/* KODAROS â€” Funil de diagnÃ³stico
   Fluxo: abertura â†’ perfil â†’ 4 perguntas adaptadas ao perfil â†’ diagnÃ³stico + brinde + vitrine 1+2 â†’ site principal */

(function () {
    "use strict";

    var state = { profile: null, qIndex: 0, answers: [] };
    var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
    var ADVANCE_MS = 850;
    var SITE_BASE = "";
    var COVER_BASE = "./";

    /* ---------- CATÃLOGO ESPELHADO DO SITE PRINCIPAL ---------- */
    var PRODUCTS = {
        lancamento: {
            id: "lancamento", badge: "ClÃ¡ssico",
            title: "LanÃ§amento MilionÃ¡rio",
            desc: "O mÃ©todo para vender cursos e produtos digitais: do planejamento Ã  execuÃ§Ã£o de lanÃ§amentos que convertem.",
            old: "R$ 47,00", now: "R$ 12,99",
            cover: COVER_BASE + "livro3.png",
            url: "https://pay.hotmart.com/R106895415M?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        trafego: {
            id: "trafego", badge: "ClÃ¡ssico",
            title: "TrÃ¡fego Que Vende",
            desc: "Domine Facebook e Google Ads e crie campanhas pagas que geram retorno consistente e escalÃ¡vel.",
            old: "R$ 47,00", now: "R$ 12,99",
            cover: COVER_BASE + "livro1.png",
            url: "https://pay.hotmart.com/D106894870O?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        venda: {
            id: "venda", badge: "ClÃ¡ssico",
            title: "Venda Mais Hoje",
            desc: "Marketing e vendas diretos, sem enrolaÃ§Ã£o: tÃ¡ticas prÃ¡ticas para aumentar suas vendas imediatamente.",
            old: "R$ 47,00", now: "R$ 12,99",
            cover: COVER_BASE + "livro2.png",
            url: "https://pay.hotmart.com/R106895345D?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        gestao: {
            id: "gestao", badge: "ClÃ¡ssico",
            title: "Os 10 Pilares da GestÃ£o Empresarial",
            desc: "10 pilares para organizar e crescer sua empresa com controle e decisÃµes baseadas em dados.",
            old: "R$ 67,00", now: "R$ 22,99",
            cover: COVER_BASE + "livro%20os%2010%20pilares%20da%20gest%C3%A3o%20empresarial.png",
            url: "https://pay.hotmart.com/S107016677T?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        financeiro: {
            id: "financeiro", badge: "ClÃ¡ssico",
            title: "Os 10 Pilares do Controle Financeiro",
            desc: "Organize o fluxo de caixa, a formaÃ§Ã£o de preÃ§os e reduza custos para lucrar com previsibilidade.",
            old: "R$ 67,00", now: "R$ 22,99",
            cover: COVER_BASE + "livro%20os%2010%20pilares%20do%20controle%20financeiro.png",
            url: "https://pay.hotmart.com/E107016796K?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        site: {
            id: "site", badge: "ClÃ¡ssico",
            title: "Use Seu Site Para Escalar Sua Empresa",
            desc: "Transforme seu site em mÃ¡quina de vendas com SEO, captura de leads e automaÃ§Ã£o.",
            old: "R$ 67,00", now: "R$ 22,99",
            cover: COVER_BASE + "livro%20use%20seu%20site%20para%20escalar%20sua%20empresa.png",
            url: "https://pay.hotmart.com/Y107016734X?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        reclamacoes: {
            id: "reclamacoes", badge: "ClÃ¡ssico",
            title: "Transforme ReclamaÃ§Ãµes em Vendas",
            desc: "O mÃ©todo para virar reclamaÃ§Ãµes em fidelizaÃ§Ã£o e construir uma cultura centrada no cliente.",
            old: "R$ 67,00", now: "R$ 22,99",
            cover: COVER_BASE + "livro%20transforme%20reclama%C3%A7%C3%B5es%20em%20vendas.png",
            url: "https://pay.hotmart.com/G107016779V?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        },
        arquitetura: {
            id: "arquitetura", badge: "AvanÃ§ado",
            title: "Arquitetura de AquisiÃ§Ã£o",
            desc: "O sistema operacional de trÃ¡fego pago e funis da KODAROS. Framework A.P.E.R.T.O., 3 calculadoras e checklists.",
            old: "R$ 247,00", now: "R$ 197,00",
            cover: COVER_BASE + "arquitetura-capa.png",
            url: "https://kelvinoliveiracode.github.io/site-Arquitetura-de-Aquisicao/?utm_source=funil&utm_medium=quiz&utm_campaign=diagnostico"
        }
    };

    /* ---------- PERGUNTAS POR PERFIL ---------- */
    var QUESTIONS = {
        empresa: [
            {
                q: "Quanto tempo do seu dia vai para tarefas repetitivas?",
                sub: "Responder clientes, postar nas redes, mandar orÃ§amento, cobrar pagamentoâ€¦",
                options: [
                    { v: "3h+", t: "Mais de 3 horas por dia", fb: "Mais de 3 horas por dia em tarefas repetitivas Ã© tempo que nÃ£o volta." },
                    { v: "1-3h", t: "Entre 1 e 3 horas", fb: "Entre 1 e 3 horas diÃ¡rias somam semanas inteiras de trabalho manual por ano." },
                    { v: "<1h", t: "Menos de 1 hora", fb: "Menos de 1 hora jÃ¡ Ã© bom sinal â€” mas cada minuto salvo vira margem." },
                    { v: "auto", t: "Quase nada â€” aqui muita coisa jÃ¡ Ã© automÃ¡tica", fb: "VocÃª jÃ¡ entendeu o jogo: o que Ã© manual, escala mal." }
                ]
            },
            {
                q: "Hoje, o que mais trava o seu crescimento?",
                sub: "Seja sincero â€” ninguÃ©m estÃ¡ olhando.",
                options: [
                    { v: "tempo", t: "Falta de tempo pra cuidar de tudo", fb: "Falta de tempo Ã© o sintoma mais comum de processos manuais." },
                    { v: "clientes", t: "Falta de clientes entrando", fb: "Sem presenÃ§a e sem follow-up automÃ¡tico, a entrada de clientes vira montanha-russa." },
                    { v: "organizacao", t: "DesorganizaÃ§Ã£o e processos na cabeÃ§a", fb: "Processo que vive na cabeÃ§a nÃ£o escala â€” e cobra caro pelo esquecimento." },
                    { v: "autoridade", t: "Falta de presenÃ§a e autoridade digital", fb: "Sem autoridade digital, o cliente compara sÃ³ preÃ§o. Com autoridade, ele escolhe vocÃª." }
                ]
            },
            {
                q: "Se um sistema trabalhasse por vocÃª 24h por dia, por onde comeÃ§aria?",
                sub: "",
                options: [
                    { v: "whatsapp", t: "Atendimento e respostas no WhatsApp", fb: "O WhatsApp Ã© onde a venda nasce â€” e onde ela morre sem resposta rÃ¡pida." },
                    { v: "redes", t: "Redes sociais e publicaÃ§Ã£o de conteÃºdo", fb: "ConstÃ¢ncia nas redes constrÃ³i autoridade. O problema nunca Ã© ideia, Ã© rotina." },
                    { v: "followup", t: "Follow-up de clientes e orÃ§amentos", fb: "Grande parte das vendas acontece no follow-up â€” e Ã© exatamente ele que ninguÃ©m tem tempo de fazer." },
                    { v: "tudo", t: "Por tudo â€” quero escalar de vez", fb: "Quem automatiza tudo nÃ£o contrai dÃ­vida de tempo com o prÃ³prio negÃ³cio." }
                ]
            },
            microCommit()
        ],
        iniciante: [
            {
                q: "Qual Ã© o seu maior desafio ao comeÃ§ar no digital?",
                sub: "O primeiro passo Ã© saber onde dÃ³i.",
                options: [
                    { v: "poronde", t: "NÃ£o saber por onde comeÃ§ar", fb: "ComeÃ§ar sem mapa Ã© o erro nÂº 1 â€” e o mais fÃ¡cil de corrigir." },
                    { v: "tempo", t: "Ter pouco tempo por dia", fb: "VocÃª nÃ£o precisa de 8 horas: precisa de um mÃ©todo que caiba na sua rotina." },
                    { v: "medo", t: "Medo de errar na frente dos outros", fb: "Todo mundo que hoje fatura comeÃ§ou errando em pÃºblico â€” Ã© parte do caminho." },
                    { v: "tech", t: "Achar que precisa entender de tecnologia", fb: "As ferramentas de hoje fazem o pesado. O que falta Ã© processo, nÃ£o cÃ³digo." }
                ]
            },
            {
                q: "Em que ponto vocÃª estÃ¡ hoje?",
                sub: "Sem julgamento â€” sÃ³ clareza.",
                options: [
                    { v: "parado", t: "Ainda nÃ£o comecei", fb: "Perfeito: comeÃ§ar do zero, comeÃ§ando certo, Ã© vantagem." },
                    { v: "posts", t: "JÃ¡ posto nas redes, mas sem estratÃ©gia", fb: "Postar sem estratÃ©gia Ã© correr na esteira: cansa e nÃ£o sai do lugar." },
                    { v: "vendo", t: "JÃ¡ vendo algo, mas tudo no manual", fb: "Vender manualmente prova que existe demanda â€” agora Ã© estrutura para escalar." },
                    { v: "estudo", t: "Estudo muito e pratico pouco", fb: "Conhecimento sem execuÃ§Ã£o vira ansiedade. O segredo Ã© prÃ¡tica guiada." }
                ]
            },
            {
                q: "Se alguÃ©m te mostrasse o caminho, o que resolveria primeiro?",
                sub: "",
                options: [
                    { v: "base", t: "Entender o bÃ¡sico do jogo digital", fb: "Base sÃ³lida evita meses de tentativa e erro." },
                    { v: "primeiravenda", t: "Fazer a primeira venda", fb: "A primeira venda muda a mentalidade â€” depois dela, o jogo fica real." },
                    { v: "constancia", t: "Criar constÃ¢ncia nas redes", fb: "ConstÃ¢ncia Ã© o que separa quem aparece de quem desiste na semana 3." },
                    { v: "plano", t: "Ter um plano claro passo a passo", fb: "Com plano, cada dia tem um prÃ³ximo passo. Sem plano, cada dia Ã© dÃºvida." }
                ]
            },
            microCommit()
        ],
        outros: [
            {
                q: "O que te trouxe atÃ© aqui hoje?",
                sub: "Me conta â€” o diagnÃ³stico se adapta a vocÃª.",
                options: [
                    { v: "renda", t: "Quero uma renda extra", fb: "Renda extra bem construÃ­da vira renda principal â€” com mÃ©todo." },
                    { v: "transicao", t: "Quero mudar de Ã¡rea / carreira", fb: "TransiÃ§Ã£o de carreira pro digital Ã© a mais rÃ¡pida do mercado quando hÃ¡ direÃ§Ã£o." },
                    { v: "escalar", t: "JÃ¡ atendo clientes e quero escalar", fb: "Escalar sem estrutura quebra a operaÃ§Ã£o â€” por isso automaÃ§Ã£o vem primeiro." },
                    { v: "curiosidade", t: "Curiosidade â€” quero entender o jogo", fb: "Entender o jogo antes de apostar Ã© a decisÃ£o mais inteligente." }
                ]
            },
            {
                q: "Qual frase te define melhor neste momento?",
                sub: "",
                options: [
                    { v: "tempopouco", t: "Tenho pouco tempo disponÃ­vel", fb: "Pouco tempo nÃ£o Ã© obstÃ¡culo: Ã© filtro. O que importa Ã© direÃ§Ã£o." },
                    { v: "direcao", t: "Tenho tempo, mas falta direÃ§Ã£o", fb: "DireÃ§Ã£o transforma horas soltas em progresso composto." },
                    { v: "oquevender", t: "NÃ£o sei o que vender", fb: "VocÃª nÃ£o precisa inventar: precisa mapear o que jÃ¡ resolve bem." },
                    { v: "execucao", t: "Sei o que quero, falta execuÃ§Ã£o", fb: "ExecuÃ§Ã£o Ã© mÃºsculo â€” e sistemas sÃ£o a academia." }
                ]
            },
            {
                q: "Se pudesse resolver uma coisa sÃ³ este mÃªs, qual seria?",
                sub: "",
                options: [
                    { v: "clareza", t: "Ter clareza do prÃ³ximo passo", fb: "Clareza Ã© o ativo mais barato e mais negligenciado." },
                    { v: "presenca", t: "Criar presenÃ§a digital de verdade", fb: "PresenÃ§a Ã© ativo composto: cada publicaÃ§Ã£o trabalha para sempre." },
                    { v: "vendas", t: "Aumentar minhas vendas", fb: "Venda consistente nasce de processo, nÃ£o de sorte." },
                    { v: "automatizar", t: "Automatizar o que jÃ¡ faÃ§o manualmente", fb: "Automatizar o que existe libera o tempo para o que vem." }
                ]
            },
            microCommit()
        ]
    };

    function microCommit() {
        return {
            q: "Quer receber seu diagnÃ³stico + o e-book gratuito agora?",
            sub: "",
            options: [
                { v: "sim", t: "SIM, QUERO RECEBER", fb: "", highlight: true },
                { v: "pensar", t: "Quero, mas vou pensar mais um poucoâ€¦", fb: "" }
            ]
        };
    }

    /* ---------- DIAGNÃ“STICO POR PERFIL ---------- */
    var DIAG = {
        empresa: {
            intro: function (a) {
                var q1 = {
                    "3h+": "vocÃª estÃ¡ gastando <strong>mais de 3 horas por dia</strong> em tarefas que uma mÃ¡quina faria por vocÃª",
                    "1-3h": "vocÃª perde <strong>entre 1 e 3 horas por dia</strong> com o que poderia rodar sozinho",
                    "<1h": "vocÃª jÃ¡ controla o tempo manual â€” mas o processo ainda depende de vocÃª",
                    "auto": "sua operaÃ§Ã£o jÃ¡ tem automaÃ§Ã£o â€” o prÃ³ximo nÃ­vel Ã© virar estratÃ©gia"
                };
                var q2 = {
                    "tempo": "seu gargalo Ã© <strong>tempo</strong>",
                    "clientes": "seu gargalo Ã© <strong>entrada de clientes</strong>",
                    "organizacao": "seu gargalo Ã© <strong>organizaÃ§Ã£o</strong>",
                    "autoridade": "seu gargalo Ã© <strong>autoridade digital</strong>"
                };
                var q3 = {
                    "whatsapp": "atendimento automÃ¡tico no WhatsApp, respondendo na hora â€” inclusive de madrugada",
                    "redes": "publicaÃ§Ã£o de conteÃºdo agendada e constante, sem depender de memÃ³ria ou motivaÃ§Ã£o",
                    "followup": "follow-up automÃ¡tico de orÃ§amentos e clientes, para nenhuma venda morrer no esquecimento",
                    "tudo": "atendimento, conteÃºdo e follow-up rodando juntos, como um time invisÃ­vel 24h"
                };
                return {
                    text: "Pelas suas respostas, " + (q1[a[0]] || q1["1-3h"]) + ", e " + (q2[a[1]] || q2.tempo) +
                        ". A boa notÃ­cia: isso tem soluÃ§Ã£o â€” e ela comeÃ§a com o que estÃ¡ no seu e-book.",
                    bullets: [
                        "Prioridade nÂº 1: " + (q3[a[2]] || q3.tudo) + ".",
                        "AutomaÃ§Ã£o nÃ£o substitui vocÃª â€” ela devolve seu tempo para vender e crescer.",
                        "Quanto antes o sistema assume o repetitivo, mais cedo o negÃ³cio trabalha por vocÃª."
                    ]
                };
            }
        },
        iniciante: {
            intro: function (a) {
                var q1 = {
                    "poronde": "o seu desafio Ã© <strong>saber por onde comeÃ§ar</strong>",
                    "tempo": "o seu desafio Ã© <strong>falta de tempo</strong>",
                    "medo": "o seu desafio Ã© <strong>medo de errar em pÃºblico</strong>",
                    "tech": "o seu desafio Ã© <strong>achar que precisa ser tÃ©cnico</strong>"
                };
                var q2 = {
                    "parado": "vocÃª ainda estÃ¡ no marco zero â€” e isso Ã© vantagem: dÃ¡ pra comeÃ§ar certo",
                    "posts": "vocÃª jÃ¡ produz conteÃºdo, mas ainda sem estratÃ©gia por trÃ¡s",
                    "vendo": "vocÃª jÃ¡ vende â€” agora falta estrutura para escalar",
                    "estudo": "vocÃª acumula teoria e ainda pratica pouco"
                };
                var q3 = {
                    "base": "montar a base: presenÃ§a, oferta e uma rotina mÃ­nima viÃ¡vel",
                    "primeiravenda": "estruturar o caminho direto atÃ© a primeira venda",
                    "constancia": "criar um ciclo de constÃ¢ncia que caiba na sua semana",
                    "plano": "seguir um plano claro, um passo por dia"
                };
                return {
                    text: "Pelas suas respostas, " + (q1[a[0]] || q1.poronde) + " e " + (q2[a[1]] || q2.parado) +
                        ". NinguÃ©m nasce pronto â€” o que muda o jogo Ã© comeÃ§ar com mÃ©todo.",
                    bullets: [
                        "Primeiro passo: " + (q3[a[2]] || q3.base) + ".",
                        "ConstÃ¢ncia vence talento: passos diÃ¡rios pequenos constroem autoridade.",
                        "O e-book abaixo organiza exatamente essa base â€” do zero ao patrimÃ´nio."
                    ]
                };
            }
        },
        outros: {
            intro: function (a) {
                var q1 = {
                    "renda": "vocÃª quer <strong>uma renda extra</strong>",
                    "transicao": "vocÃª quer <strong>transiÃ§Ã£o de carreira</strong>",
                    "escalar": "vocÃª quer <strong>escalar o que jÃ¡ atende</strong>",
                    "curiosidade": "vocÃª quer <strong>entender o jogo antes de apostar</strong>"
                };
                var q2 = {
                    "tempopouco": "o seu tempo Ã© curto",
                    "direcao": "o seu tempo existe, mas falta direÃ§Ã£o",
                    "oquevender": "a sua dÃºvida Ã© o que vender",
                    "execucao": "a sua lacuna Ã© execuÃ§Ã£o"
                };
                var q3 = {
                    "clareza": "ter clareza do prÃ³ximo passo",
                    "presenca": "construir presenÃ§a digital de verdade",
                    "vendas": "aumentar suas vendas",
                    "automatizar": "automatizar o que jÃ¡ faz manualmente"
                };
                return {
                    text: "Pelas suas respostas, " + (q1[a[0]] || q1.curiosidade) + " e " + (q2[a[1]] || q2.direcao) +
                        ". O digital premia quem tem mÃ©todo â€” nÃ£o quem tem sorte.",
                    bullets: [
                        "Foco do mÃªs: " + (q3[a[2]] || q3.clareza) + ".",
                        "Autoridade digital Ã© ativo composto: comeÃ§a pequeno e cresce sozinho.",
                        "O e-book abaixo mostra a base completa â€” do zero ao patrimÃ´nio."
                    ]
                };
            }
        }
    };

    /* ---------- LÃ“GICA DE RECOMENDAÃ‡ÃƒO 1+2 ---------- */
    function getRecommendation(profile, a) {
        var p = profile || "outros";
        var q2 = a[1], q3 = a[2];
        var primary, sec1, sec2;

        if (p === "empresa") {
            if (q2 === "organizacao") { primary = "gestao"; sec1 = "financeiro"; sec2 = "site"; }
            else if (q2 === "autoridade") { primary = "site"; sec1 = "trafego"; sec2 = "arquitetura"; }
            else if (q2 === "clientes") {
                if (q3 === "redes") { primary = "trafego"; sec1 = "venda"; sec2 = "site"; }
                else if (q3 === "followup") { primary = "venda"; sec1 = "trafego"; sec2 = "reclamacoes"; }
                else { primary = "trafego"; sec1 = "venda"; sec2 = "lancamento"; }
            } else { // tempo
                if (q3 === "whatsapp") { primary = "reclamacoes"; sec1 = "venda"; sec2 = "trafego"; }
                else if (q3 === "followup") { primary = "venda"; sec1 = "reclamacoes"; sec2 = "gestao"; }
                else if (q3 === "tudo") { primary = "arquitetura"; sec1 = "trafego"; sec2 = "gestao"; }
                else { primary = "trafego"; sec1 = "gestao"; sec2 = "venda"; }
            }
        } else if (p === "iniciante") {
            if (q3 === "primeiravenda") { primary = "venda"; sec1 = "lancamento"; sec2 = "trafego"; }
            else if (q3 === "constancia") { primary = "trafego"; sec1 = "lancamento"; sec2 = "site"; }
            else if (q3 === "plano") { primary = "gestao"; sec1 = "lancamento"; sec2 = "venda"; }
            else { // base
                if (q2 === "estudo" || a[0] === "tech") { primary = "lancamento"; sec1 = "gestao"; sec2 = "venda"; }
                else { primary = "lancamento"; sec1 = "venda"; sec2 = "trafego"; }
            }
        } else { // outros
            if (q3 === "presenca") { primary = "site"; sec1 = "trafego"; sec2 = "lancamento"; }
            else if (q3 === "vendas") { primary = "venda"; sec1 = "reclamacoes"; sec2 = "trafego"; }
            else if (q3 === "automatizar") { primary = "trafego"; sec1 = "site"; sec2 = "gestao"; }
            else { // clareza
                if (q2 === "oquevender") { primary = "gestao"; sec1 = "lancamento"; sec2 = "venda"; }
                else { primary = "lancamento"; sec1 = "gestao"; sec2 = "venda"; }
            }
        }
        // garantir unicidade
        var seen = {};
        var list = [];
        [primary, sec1, sec2].forEach(function (id) {
            if (id && !seen[id] && PRODUCTS[id]) { seen[id] = 1; list.push(id); }
        });
        // fallback preenche com best sellers se faltar
        var fallback = ["venda", "trafego", "lancamento"];
        for (var i = 0; list.length < 3 && i < fallback.length; i++) {
            if (!seen[fallback[i]]) { list.push(fallback[i]); seen[fallback[i]] = 1; }
        }
        return { primary: list[0], secondary: [list[1], list[2]] };
    }

    function productCardHTML(id, variant) {
        var p = PRODUCTS[id];
        if (!p) return "";
        var isPrimary = variant === "primary";
        var cls = isPrimary ? "rec-card rec-card-primary" : "rec-card";
        var whyTag = isPrimary ? '<span class="rec-why">RECOMENDAÃ‡ÃƒO #1 â€” COMECE POR AQUI</span>' : "";
        return '' +
            '<article class="' + cls + '">' +
            whyTag +
            '<div class="rec-cover"><img src="' + p.cover + '" alt="' + p.title + '" loading="lazy" width="270" height="360"></div>' +
            '<div class="rec-body">' +
            '<span class="rec-badge">' + p.badge + '</span>' +
            '<h3 class="rec-title">' + p.title + '</h3>' +
            '<p class="rec-desc">' + p.desc + '</p>' +
            '<div class="rec-price"><span class="old">' + p.old + '</span><span class="now">' + p.now + '</span></div>' +
            '<a href="' + p.url + '&utm_content=' + id + '" target="_blank" rel="noopener" class="btn ' + (isPrimary ? 'btn-primary' : 'btn-secondary') + ' rec-cta">' +
            (isPrimary ? 'COMPRAR AGORA â€” ' + p.now : 'Ver no site oficial') +
            '<svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg>' +
            '</a>' +
            '<a href="' + SITE_BASE + '/#ebooks" target="_blank" rel="noopener" class="rec-link">ver detalhes no site oficial â†’</a>' +
            '</div></article>';
    }

    /* ---------- NAVEGAÃ‡ÃƒO ---------- */
    function goTo(id) {
        steps.forEach(function (s) { s.classList.remove("is-active"); });
        var target = document.getElementById(id);
        if (target) {
            target.classList.add("is-active");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }

    /* ---------- QUIZ DINÃ‚MICO ---------- */
    function renderQuestion() {
        var list = QUESTIONS[state.profile];
        var item = list[state.qIndex];

        document.getElementById("quiz-progress").style.width = ((state.qIndex + 1) / list.length * 100) + "%";
        document.getElementById("quiz-label").textContent = state.qIndex === list.length - 1
            ? "ÃšLTIMA PERGUNTA"
            : "PERGUNTA " + (state.qIndex + 1) + " DE " + list.length;
        document.getElementById("quiz-title").textContent = item.q;
        document.getElementById("quiz-sub").textContent = item.sub || "";

        var fb = document.getElementById("quiz-feedback");
        fb.classList.remove("is-visible");
        fb.textContent = "";

        var box = document.getElementById("quiz-options");
        box.innerHTML = "";
        item.options.forEach(function (opt) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "option" + (opt.highlight ? " option-highlight" : "");
            btn.textContent = opt.t;
            btn.setAttribute("data-value", opt.v);
            btn.addEventListener("click", function () { pick(opt, btn, fb); });
            box.appendChild(btn);
        });
    }

    function pick(opt, btn, fb) {
        var box = document.getElementById("quiz-options");
        Array.prototype.forEach.call(box.children, function (b) { b.classList.remove("is-selected"); });
        btn.classList.add("is-selected");

        state.answers[state.qIndex] = opt.v;

        if (opt.fb) {
            fb.textContent = opt.fb;
            fb.classList.add("is-visible");
        }

        setTimeout(function () {
            if (state.qIndex < QUESTIONS[state.profile].length - 1) {
                state.qIndex++;
                renderQuestion();
                var step = document.getElementById("step-quiz");
                step.classList.remove("is-active");
                void step.offsetWidth;
                step.classList.add("is-active");
            } else {
                buildDiagnosis();
                goTo("step-result");
            }
        }, ADVANCE_MS);
    }

    /* ---------- DIAGNÃ“STICO + VITRINE ---------- */
    function buildDiagnosis() {
        var box = document.getElementById("diagnosis");
        if (!box) return;

        var d = (DIAG[state.profile] || DIAG.outros).intro(state.answers);

        var html = "";
        html += '<p class="diagnosis-head">RESUMO DO SEU DIAGNÃ“STICO</p>';
        html += '<p class="diagnosis-text">' + d.text + "</p>";
        html += '<ul class="diagnosis-list">' + d.bullets.map(function (b) {
            return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>' + b + "</li>";
        }).join("") + "</ul>";

        if (state.answers[state.answers.length - 1] === "pensar") {
            html += '<p class="diagnosis-text" style="margin-top:14px"><strong>P.S.:</strong> ' +
                "enquanto isso, cada cliente sem resposta e cada post que nÃ£o sai Ã© espaÃ§o que o concorrente ocupa. " +
                "Quando quiser, o WhatsApp da Kodaros estÃ¡ a um clique.</p>";
        }
        box.innerHTML = html;

        // vitrine 1+2
        var rec = getRecommendation(state.profile, state.answers);
        var recBlock = document.getElementById("recommended-block");
        if (recBlock) {
            var recHtml = '<div class="recommended">';
            recHtml += productCardHTML(rec.primary, "primary");
            recHtml += '<div class="rec-grid">';
            recHtml += productCardHTML(rec.secondary[0], "secondary");
            recHtml += productCardHTML(rec.secondary[1], "secondary");
            recHtml += '</div>';
            recHtml += '<p class="rec-footnote">Todos os e-books sÃ£o entregues pela Hotmart com acesso imediato. Pagamento 100% seguro. <a href="' + SITE_BASE + '/#ebooks" target="_blank" rel="noopener">Ver catÃ¡logo completo com 8 tÃ­tulos â†’</a></p>';
            recHtml += '</div>';
            recBlock.innerHTML = recHtml;
        }
    }

    /* ---------- EVENTOS ---------- */
    document.querySelectorAll("[data-next]").forEach(function (btn) {
        btn.addEventListener("click", function () { goTo("step-profile"); });
    });

    document.querySelectorAll(".profile-card").forEach(function (card) {
        card.addEventListener("click", function () {
            document.querySelectorAll(".profile-card").forEach(function (c) { c.classList.remove("is-selected"); });
            card.classList.add("is-selected");
            state.profile = card.getAttribute("data-profile");
            state.qIndex = 0;
            state.answers = [];
            setTimeout(function () {
                renderQuestion();
                goTo("step-quiz");
            }, 450);
        });
    });

    /* ---------- PARTÃCULAS DE FUNDO ---------- */
    (function particles() {
        var canvas = document.getElementById("particles");
        if (!canvas) return;
        var ctx = canvas.getContext("2d");
        var dots = [];
        var COUNT = 28;
        var COLORS = ["59,91,254", "197,164,106", "154,163,184"];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener("resize", resize);
        resize();

        for (var i = 0; i < COUNT; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 0.8 + Math.random() * 2.2,
                vx: (Math.random() - 0.5) * 0.22,
                vy: (Math.random() - 0.5) * 0.22,
                c: COLORS[i % COLORS.length],
                o: 0.08 + Math.random() * 0.16
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(function (d) {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < -10) d.x = canvas.width + 10;
                if (d.x > canvas.width + 10) d.x = -10;
                if (d.y < -10) d.y = canvas.height + 10;
                if (d.y > canvas.height + 10) d.y = -10;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(" + d.c + "," + d.o + ")";
                ctx.fill();
            });
            requestAnimationFrame(frame);
        }
        frame();
    })();
})();

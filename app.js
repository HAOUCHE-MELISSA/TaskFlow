/* ================= helpers / app.js ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ST=['To Do','In Progress','In Review','Completed'],PR=['Low','Medium','High','Urgent'],PS=['Planning','In Progress','On Hold','Completed'];
const mem=id=>db.team.find(m=>m.id==id),prj=id=>db.projects.find(p=>p.id==id);
const nm=id=>(mem(id)||{name:'Unassigned'}).name,ini=n=>n.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();
const fd=s=>s?new Date(s+'T00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'}):'-';
const bd=v=>`<span class="b b-${v.toLowerCase().replace(/ /g,'')}">${v}</span>`;
const rel=w=>{const m=(Date.now()-new Date(w))/6e4;return m<60?Math.max(1,Math.round(m))+' min ago':m<1440?Math.round(m/60)+' hr ago':Math.round(m/1440)+' days ago'};
const pct=id=>{const t=db.tasks.filter(x=>x.proj==id);return t.length?Math.round(100*t.filter(x=>x.status=='Completed').length/t.length):0};
const isOver=t=>t.status!='Completed'&&t.due&&t.due<TODAY();
const act=(t,i)=>{db.acts.unshift({t,i,w:new Date().toISOString()});db.acts=db.acts.slice(0,20)};
const addN=t=>db.notifs.unshift({id:uid(),t,r:0,w:new Date().toISOString()});
const S={page:'dashboard',pf:'all',sort:1,view:'list',cal:{y:new Date().getFullYear(),m:new Date().getMonth()}};
const NAV=[['dashboard','Dashboard','dash'],['tasks','My Tasks','tasks'],['projects','Projects','folder'],['calendar','Calendar','cal'],['team','Team Members','users'],['messages','Messages','msg'],['reports','Reports & Analytics','chart'],['settings','Settings','gear']];
function toast(t){const e=document.createElement('div');e.className='toast';e.innerHTML=ic('check',16)+esc(t);$('#toasts').appendChild(e);setTimeout(()=>e.remove(),2600)}
const empty=(i,t,s)=>`<div class="empty">${ic(i,28)}<b>${t}</b><span>${s}</span></div>`;
const head=(t,s,a='')=>`<div class="ph"><div><h1>${t}</h1><p class="mu">${s}</p></div><div class="pa">${a}</div></div>`;
const fld=f=>`<label class="f ${f.w||''}"><span>${f.l}</span>${f.t=='select'?`<select name="${f.k}">${f.o.map(o=>`<option value="${esc(o[0])}"${o[0]==f.v?' selected':''}>${esc(o[1])}</option>`).join('')}</select>`:f.t=='textarea'?`<textarea name="${f.k}" rows="3">${esc(f.v)}</textarea>`:`<input name="${f.k}" type="${f.t||'text'}" value="${esc(f.v)}">`}<em></em></label>`;
function modal(h){const m=$('#modal');m.innerHTML=`<div class="mc" role="dialog" aria-modal="true">${h}</div>`;m.classList.add('on')}
function closeM(){const m=$('#modal');m.classList.remove('on');m.innerHTML=''}
function form(title,fs,cb){
  modal(`<form novalidate><div class="mh"><h3>${title}</h3><button type="button" class="ib s" data-a="close" aria-label="Close">${ic('x',16)}</button></div><div class="mbd fg">${fs.map(fld).join('')}</div><div class="mf"><button type="button" class="btn" data-a="close">Cancel</button><button class="btn p">Save</button></div></form>`);
  const f=$('#modal form');f.querySelector('input,textarea')?.focus();
  f.onsubmit=e=>{e.preventDefault();const d=new FormData(f),o={};let ok=true;
    fs.forEach((x,i)=>{const v=(d.get(x.k)||'').trim();o[x.k]=v;let er='';if(x.r&&!v)er='This field is required';else if(x.t=='email'&&v&&!/^\S+@\S+\.\S+$/.test(v))er='Enter a valid email address';f.querySelectorAll('em')[i].textContent=er;if(er)ok=false});
    if(ok){cb(o);closeM()}};
}
function confirmD(msg,fn,lbl='Delete'){modal(`<div class="mh"><h3>Please confirm</h3></div><div class="mbd">${msg}</div><div class="mf"><button class="btn" data-a="close">Cancel</button><button class="btn p" id="cok" style="background:#ef4444;border-color:#ef4444">${lbl}</button></div>`);$('#cok').onclick=()=>{closeM();fn()}}


/* ================= router / render ================= */
const PAGES={dashboard,tasks:tasksPage,projects:projectsPage,calendar:calPage,team:teamPage,messages:msgPage,reports:repPage,settings:setPage};
function render(){
  const p=S.page,u=db.user,unread=db.notifs.some(n=>!n.r);
  $('#nav').innerHTML=NAV.map(n=>`<a class="${n[0]==p?'on':''}" data-a="nav" data-p="${n[0]}">${ic(n[2])}<span>${n[1]}</span></a>`).join('');
  $('#me').innerHTML=`<i class="av">${ini(u.name)}</i><div>${esc(u.name)}<small>${esc(u.role)}</small></div>`;
  $('#ab').textContent=ini(u.name);$('#mb').innerHTML=ic('menu');$('#si').innerHTML=ic('search',16);$('#qi').innerHTML=ic('plus',16);
  $('#tb').innerHTML=ic(db.prefs.theme=='dark'?'sun':'moon');$('#bb').innerHTML=ic('bell')+(unread?'<span class="dot"></span>':'');
  $('#pp').innerHTML=`<button class="pi" data-a="nav" data-p="settings">${ic('gear',16)}Settings</button><button class="pi" data-a="theme">${ic('moon',16)}Switch theme</button>`;
  $('#view').innerHTML=PAGES[p]();if(p=='reports')charts();
}
function go(p){S.page=p;location.hash=p;$('#app').classList.remove('open');render();$('#view').scrollTop=0}
function setTheme(v){db.prefs.theme=v;save();document.documentElement.setAttribute('data-theme',v);render()}

document.addEventListener('click',e=>{
  const np=$('#np'),pp=$('#pp'),wn=np.classList.contains('on'),wp=pp.classList.contains('on');
  if(e.target.id=='modal'){closeM();return}
  if(!e.target.closest('.pop')){np.classList.remove('on');pp.classList.remove('on')}
  const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,id=el.dataset.id;
  const A={nav:()=>{pp.classList.remove('on');go(el.dataset.p)},col:()=>$('#app').classList.toggle(matchMedia('(max-width:860px)').matches?'open':'col'),scrim:()=>$('#app').classList.remove('open'),
  theme:()=>setTheme(db.prefs.theme=='dark'?'light':'dark'),qc:()=>taskForm(),close:closeM,
  notif:()=>{if(!wn){renderN();np.classList.add('on')}},prof:()=>{if(!wp)pp.classList.add('on')},
  markall:()=>{db.notifs.forEach(n=>n.r=1);save();renderN();render()},readn:()=>{const n=db.notifs.find(x=>x.id==id);if(n)n.r=1;save();renderN();render()},
  newtask:()=>taskForm(),edittask:()=>taskForm(id),deltask:()=>confirmD('Delete this task? This cannot be undone.',()=>{db.tasks=db.tasks.filter(t=>t.id!=id);save();render();toast('Task deleted')}),
  tog:()=>setStatus(id,el.checked?'Completed':'To Do'),sort:()=>{S.sort*=-1;render()},vw:()=>{S.view=el.dataset.v;render()},
  newproj:()=>projForm(),editproj:()=>projForm(id),viewproj:()=>viewProj(id),delproj:()=>confirmD('Delete this project and all of its tasks?',()=>{db.projects=db.projects.filter(p=>p.id!=id);db.tasks=db.tasks.filter(t=>t.proj!=id);save();render();toast('Project deleted')}),
  newmem:()=>memForm(),editmem:()=>memForm(id),delmem:()=>confirmD('Remove this team member? Their tasks become unassigned.',()=>{db.team=db.team.filter(m=>m.id!=id);db.tasks.forEach(t=>{if(t.mem==id)t.mem=''});save();render();toast('Member removed')}),
  cprev:()=>{S.cal.m--;if(S.cal.m<0){S.cal.m=11;S.cal.y--}render()},cnext:()=>{S.cal.m++;if(S.cal.m>11){S.cal.m=0;S.cal.y++}render()},ctoday:()=>{const d=new Date();S.cal={y:d.getFullYear(),m:d.getMonth()};render()},cday:()=>taskForm(null,el.dataset.d),
  saveprof:()=>{const n=$('#pn').value.trim(),m=$('#pm').value.trim();if(!n||!/^\S+@\S+\.\S+$/.test(m)){$('#pe').textContent='Enter a name and a valid email address.';return}db.user={name:n,email:m,role:$('#pr').value.trim()};save();render();toast('Profile saved')},
  reset:()=>confirmD('Reset all data to the demonstration set? Your changes will be lost.',()=>{db=seed();save();document.documentElement.setAttribute('data-theme',db.prefs.theme);render();toast('Demo data restored')},'Reset')};
  if(A[a])A[a]();
});
document.addEventListener('change',e=>{const c=e.target.dataset.c;if(!c)return;const v=e.target.value;
  if(c=='pf'){S.pf=v;render()}else if(c=='st')setStatus(e.target.dataset.id,v);else if(c=='theme')setTheme(v);else if(c=='pref'){db.prefs[e.target.dataset.k]=e.target.checked?1:0;save();toast('Preferences saved')}});
$('#q').addEventListener('input',()=>{if(S.page!='tasks')go('tasks');else render()});
document.addEventListener('keydown',e=>{if(e.key=='Escape')closeM()});
/* Kanban drag and drop */
let drag;
document.addEventListener('dragstart',e=>{const c=e.target.closest('.kc');if(c){drag=c.dataset.id;e.dataTransfer.setData('text/plain',drag);c.classList.add('drg')}});
document.addEventListener('dragend',()=>document.querySelectorAll('.drg,.ov2').forEach(x=>x.classList.remove('drg','ov2')));
document.addEventListener('dragover',e=>{const c=e.target.closest('.kcol');if(c){e.preventDefault();c.classList.add('ov2')}});
document.addEventListener('dragleave',e=>{const c=e.target.closest('.kcol');if(c&&!c.contains(e.relatedTarget))c.classList.remove('ov2')});
document.addEventListener('drop',e=>{const c=e.target.closest('.kcol');if(c&&drag){e.preventDefault();const i=drag;drag=null;setStatus(i,c.dataset.s)}});
addEventListener('hashchange',()=>{const p=location.hash.slice(1);if(PAGES[p]&&p!=S.page){S.page=p;render()}});

load();document.documentElement.setAttribute('data-theme',db.prefs.theme);
{const p=location.hash.slice(1);if(PAGES[p])S.page=p}
render();

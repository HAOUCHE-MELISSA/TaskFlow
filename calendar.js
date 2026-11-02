/* ================= calendar.js ================= */
function calPage(){
  const {y,m}=S.cal,first=new Date(y,m,1),start=new Date(y,m,1-first.getDay()),td=TODAY();let cells=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>`<div class="wd">${d}</div>`).join('');
  for(let i=0;i<42;i++){const d=new Date(start);d.setDate(start.getDate()+i);const s=iso(d);
    const ev=db.projects.filter(p=>p.due==s).map(p=>`<div class="ev ev-p">${esc(p.name)}</div>`).concat(db.tasks.filter(t=>t.due==s).map(t=>`<div class="ev ev-${t.prio.toLowerCase()}">${esc(t.title)}</div>`));
    cells+=`<div class="cd${d.getMonth()!=m?' o':''}${s==td?' td':''}" data-a="cday" data-d="${s}"><b>${d.getDate()}</b>${ev.slice(0,3).join('')}${ev.length>3?`<small class="mu">+${ev.length-3} more</small>`:''}</div>`}
  const up=db.tasks.filter(t=>t.status!='Completed'&&t.due>=td).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,6);
  return head(first.toLocaleDateString(undefined,{month:'long',year:'numeric'}),'Click any date to create a task.',`<button class="ib" data-a="cprev" aria-label="Previous month">${ic('left')}</button><button class="btn" data-a="ctoday">Today</button><button class="ib" data-a="cnext" aria-label="Next month">${ic('right')}</button>`)+
  `<div class="g g21"><div><div class="cal">${cells}</div><div class="lg2"><span style="--c:#64748b">Low</span><span style="--c:#3b82f6">Medium</span><span style="--c:#d97706">High</span><span style="--c:#ef4444">Urgent</span><span style="--c:#8b5cf6">Project deadline</span></div></div>
  <div class="card"><h3 style="margin-bottom:14px">Upcoming tasks</h3>${up.length?`<ul class="li">${up.map(t=>`<li><span class="ico">${ic('cal',16)}</span><div>${esc(t.title)}<small>${fd(t.due)} · ${esc(nm(t.mem))}</small></div></li>`).join('')}</ul>`:empty('cal','Nothing upcoming','No open tasks ahead.')}</div></div>`;
}


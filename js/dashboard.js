/* ================= dashboard.js ================= */
function dashboard(){
  const t=db.tasks,n=t.length||1,done=t.filter(x=>x.status=='Completed').length,od=t.filter(isOver).length,pj=db.projects.length||1,act_=db.projects.filter(p=>p.status=='In Progress').length;
  const h=new Date().getHours(),g=h<12?'Good morning':h<18?'Good afternoon':'Good evening';
  const st=[['Total projects',db.projects.length,'folder',1,'#6d5efc'],['Active projects',act_,'dash',act_/pj,'#3b82f6'],['Completed tasks',done,'check',done/n,'#16a34a'],['Pending tasks',t.length-done,'clock',(t.length-done)/n,'#d97706'],['Overdue tasks',od,'alert',od/n,'#ef4444']];
  const up=t.filter(x=>x.status!='Completed').sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5);
  return head(`${g}, ${esc(db.user.name.split(' ')[0])}!`,'Here’s what’s happening with your projects today.')+
  `<div class="g g5">${st.map(s=>`<div class="card hv"><div class="ico" style="--c:${s[4]}">${ic(s[2])}</div><div class="num">${s[1]}</div><div class="mu">${s[0]}</div><div class="mb"><i style="width:${Math.round(s[3]*100)}%;background:${s[4]}"></i></div></div>`).join('')}</div>
  <div class="rw sec"><h3>Project progress</h3><a class="mu" style="cursor:pointer" data-a="nav" data-p="projects">View all</a></div>
  <div class="g g2">${db.projects.length?db.projects.slice(0,4).map(p=>pcard(p)).join(''):'<div class="card">'+empty('folder','No projects yet','Create your first project to get started.')+'</div>'}</div>
  <div class="g g2 sec"><div class="card"><h3 style="margin-bottom:14px">Recent activity</h3><ul class="li">${db.acts.slice(0,6).map(a=>`<li><span class="ico">${ic(a.i,16)}</span><div>${esc(a.t)}<small>${rel(a.w)}</small></div></li>`).join('')||empty('clock','No activity','Actions will appear here.')}</ul></div>
  <div class="card"><h3 style="margin-bottom:14px">Upcoming deadlines</h3>${up.length?`<ul class="li">${up.map(x=>`<li><span class="ico" style="--c:${isOver(x)?'#ef4444':'#6d5efc'}">${ic('cal',16)}</span><div class="rw" style="flex:1"><div><b style="font-weight:500">${esc(x.title)}</b><small>${esc((prj(x.proj)||{}).name||'No project')}</small></div><span class="${isOver(x)?'red':''}">${isOver(x)?'Overdue · ':''}${fd(x.due)}</span></div></li>`).join('')}</ul>`:empty('check','All caught up','No upcoming deadlines.')}</div></div>`;
}


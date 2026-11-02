/* ================= analytics.js ================= */
let CH=[];
function repPage(){const t=db.tasks,od=t.filter(isOver).length,dn=t.filter(x=>x.status=='Completed').length;
  const box=(id,ti)=>`<div class="card"><h3 style="margin-bottom:12px">${ti}</h3><div class="cv"><canvas id="${id}"></canvas></div></div>`;
  return head('Reports & Analytics','Performance across projects and people.')+`<div class="g g3" style="margin-bottom:16px"><div class="card"><div class="mu">Completion rate</div><div class="num">${t.length?Math.round(100*dn/t.length):0}%</div></div><div class="card"><div class="mu">Overdue tasks</div><div class="num red">${od}</div></div><div class="card"><div class="mu">Overdue share of open tasks</div><div class="num">${t.length-dn?Math.round(100*od/(t.length-dn)):0}%</div></div></div><div class="g g2">${box('c1','Tasks by status')}${box('c2','Tasks by priority')}${box('c3','Project completion rate (%)')}${box('c4','Team productivity (completed tasks)')}</div>`}
function charts(){CH.forEach(c=>c.destroy());CH=[];if(!window.Chart)return;
  const cs=getComputedStyle(document.documentElement);Chart.defaults.color=cs.getPropertyValue('--mu').trim();Chart.defaults.borderColor=cs.getPropertyValue('--bd').trim();Chart.defaults.font.family='Inter, system-ui, sans-serif';
  const mk=(id,type,labels,data,colors,max)=>CH.push(new Chart($('#'+id),{type,data:{labels,datasets:[{data,backgroundColor:colors,borderRadius:type=='bar'?6:0,borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:type=='doughnut',position:'bottom'}},scales:type=='bar'?{y:{beginAtZero:true,max,ticks:{precision:0}},x:{grid:{display:false}}}:{}}}));
  const n=(a,f)=>a.map(x=>db.tasks.filter(t=>f(t,x)).length);
  mk('c1','doughnut',ST,n(ST,(t,s)=>t.status==s),['#94a3b8','#3b82f6','#8b5cf6','#16a34a']);
  mk('c2','bar',PR,n(PR,(t,p)=>t.prio==p),['#94a3b8','#3b82f6','#f59e0b','#ef4444']);
  mk('c3','bar',db.projects.map(p=>p.name),db.projects.map(p=>pct(p.id)),'#6d5efc',100);
  mk('c4','bar',db.team.map(m=>m.name.split(' ')[0]),db.team.map(m=>db.tasks.filter(t=>t.mem==m.id&&t.status=='Completed').length),'#3b82f6');
}


/* ================= team.js ================= */
function memForm(id){const m=id?mem(id):{status:'Online'};
  form(id?'Edit member':'Add team member',[{k:'name',l:'Full name',r:1,v:m.name,w:'full'},{k:'email',l:'Email',t:'email',r:1,v:m.email},{k:'role',l:'Job position',v:m.role},{k:'status',l:'Status',t:'select',o:['Online','Away','Offline'].map(x=>[x,x]),v:m.status}],o=>{
    if(id)Object.assign(m,o);else{db.team.push({id:uid(),...o});act('Team member added: '+o.name,'users')}
    save();render();toast(id?'Member updated':'Member added')})}
function teamPage(){return head('Team Members','People working across your projects.',`<button class="btn p" data-a="newmem">${ic('plus',16)}Add member</button>`)+(db.team.length?`<div class="g g3">${db.team.map(m=>{
  const ts=db.tasks.filter(t=>t.mem==m.id),ps=[...new Set(ts.map(t=>(prj(t.proj)||{}).name).concat(db.projects.filter(p=>p.mgr==m.id).map(p=>p.name)).filter(Boolean))];
  return `<div class="card pc hv"><div class="rw"><span class="who"><i class="av lg">${ini(m.name)}</i><span><b>${esc(m.name)}</b><div class="mu">${esc(m.role)}</div></span></span>${bd(m.status)}</div><div class="mt"><span>${ic('mail',14)}${esc(m.email)}</span></div><div class="sm mu">Projects: <span style="color:var(--tx)">${ps.map(esc).join(', ')||'None'}</span></div><div class="rw"><span><b>${ts.filter(t=>t.status!='Completed').length}</b> <span class="mu">active tasks</span></span><span><button class="ib s" data-a="editmem" data-id="${m.id}" aria-label="Edit member">${ic('edit',15)}</button> <button class="ib s" data-a="delmem" data-id="${m.id}" aria-label="Remove member">${ic('trash',15)}</button></span></div></div>`}).join('')}</div>`:`<div class="card">${empty('users','No team members','Add people to assign work.')}</div>`)}


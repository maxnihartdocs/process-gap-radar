/* Shop Manual: Process Gap Radar (clickable prototype, mock data only) */
(function () {
  const D = window.DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const P = (id) => D.people[id] || { name: "Unassigned", role: "" };
  const initials = (id) => (P(id).name || "?").slice(0, 2).toUpperCase();
  const av = (id, sm = true) => `<span class="avatar ${sm ? "sm" : ""}" title="${P(id).name}">${initials(id)}</span>`;
  const sevLbl = { high: "High", med: "Medium", low: "Low" };
  const stLbl = { new: "New", assigned: "Assigned", drafting: "Drafting", documented: "Documented", ignored: "Ignored" };
  const sev = (s) => `<span class="chip sev-${s}">${sevLbl[s]}</span>`;
  const st = (s) => `<span class="chip st-${s}">${stLbl[s]}</span>`;
  const srcBadge = (src, where) => `<span class="src-badge"><span class="ico ${src}">${src === "slack" ? "#" : "G"}</span>${where}</span>`;
  const ICON = {
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13a9 9 0 1 1 18 0"/><path d="M12 13l4-4"/><circle cx="12" cy="13" r="1.5"/><path d="M3 19h18"/></svg>',
    inbox: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/></svg>',
    lib: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h5v16H4zM10 4h5v16h-5z"/><path d="M16 5l4 1-3 14-4-1"/></svg>',
    risk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.5"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6"/><path d="M19 7v5M19 15v.5"/></svg>',
    act: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1 1 2-2M4 12h2M4 18h2"/></svg>',
    digest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/></svg>',
    set: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
    meeting: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    question: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5"/></svg>',
    handoff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12h12M12 6l6 6-6 6"/><path d="M20 4v16" stroke-dasharray="2 3"/></svg>',
    person: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 12l5 5L20 6"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>'
  };

  const state = { filter: { status: "open", dept: "all" }, drafted: {}, toggles: {} };
  const openGaps = () => D.gaps.filter((g) => !["documented", "ignored"].includes(g.status));
  const ownerless = () => D.actions.filter((a) => !a.owner);

  /* ---------- nav ---------- */
  const NAV = [
    { r: "dashboard", t: "Dashboard", i: "dash" },
    { r: "inbox", t: "Gap Inbox", i: "inbox", c: () => openGaps().length },
    { r: "library", t: "Process Library", i: "lib" },
    { g: "Radar" },
    { r: "risk", t: "Knowledge Risk", i: "risk" },
    { r: "actions", t: "Unowned Actions", i: "act", c: () => ownerless().length },
    { r: "digest", t: "Weekly Digest", i: "digest" },
    { g: "Setup" },
    { r: "settings", t: "Sources & Rules", i: "set" }
  ];
  function renderNav(route) {
    const base = route.split("/")[0] === "gap" ? "inbox" : route.split("/")[0];
    $("#nav").innerHTML = NAV.map((n) => n.g ? `<div class="nav-group lbl">${n.g}</div>` :
      `<a href="#/${n.r}" class="${base === n.r ? "active" : ""}">${ICON[n.i]}${n.t}${n.c ? `<span class="count">${n.c()}</span>` : ""}</a>`).join("");
    $("#mnav").innerHTML = NAV.filter((n) => !n.g).map((n) =>
      `<a href="#/${n.r}" class="${base === n.r ? "active" : ""}">${n.t}${n.c ? `<span class="count">${n.c()}</span>` : ""}</a>`).join("");
    const a = $("#mnav a.active"); if (a) a.scrollIntoView({ inline: "center", block: "nearest" });
  }

  /* ---------- dashboard ---------- */
  function ring(score) {
    const r = 52, c = 2 * Math.PI * r, off = c * (1 - score / 100);
    return `<div class="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="${r}" fill="none" stroke="#3a3838" stroke-width="10"/>
      <circle cx="60" cy="60" r="${r}" fill="none" stroke="var(--red)" stroke-width="10" stroke-dasharray="${c}" stroke-dashoffset="${off}"/></svg>
      <div class="num"><div><b>${score}</b><span>of 100</span></div></div></div>`;
  }
  function trendChart(vals) {
    const w = 520, h = 170, pl = 28, pr = 14, pt = 14, pb = 26, min = 40, max = 70;
    const x = (i) => pl + (i * (w - pl - pr)) / (vals.length - 1);
    const y = (v) => pt + (1 - (v - min) / (max - min)) * (h - pt - pb);
    const pts = vals.map((v, i) => `${x(i)},${y(v)}`).join(" ");
    const grid = [40, 50, 60, 70].map((g) => `<line x1="${pl}" x2="${w - pr}" y1="${y(g)}" y2="${y(g)}" stroke="#e0e0e0"/><text class="axis" x="${pl - 6}" y="${y(g) + 3.5}" text-anchor="end">${g}</text>`).join("");
    const labels = vals.map((_, i) => `<text class="axis" x="${x(i)}" y="${h - 6}" text-anchor="middle">${i === vals.length - 1 ? "NOW" : "W" + (i + 33)}</text>`).join("");
    const last = vals.length - 1;
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Process health trend, 8 weeks">${grid}
      <polygon points="${x(0)},${y(min)} ${pts} ${x(last)},${y(min)}" fill="rgba(218,31,43,.07)"/>
      <polyline points="${pts}" fill="none" stroke="var(--coal)" stroke-width="2.5" stroke-linejoin="round"/>
      ${vals.map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="${i === last ? 5 : 3}" fill="${i === last ? "var(--red)" : "var(--coal)"}" stroke="#fafbfb" stroke-width="1.5"><title>${v}</title></circle>`).join("")}
      <text x="${x(last) - 8}" y="${y(vals[last]) - 10}" text-anchor="end" style="font:800 13px var(--f-feature);fill:var(--red)">${vals[last]}</text>${labels}</svg>`;
  }
  function deptBars() {
    const rows = Object.entries(D.depts).map(([k, d]) => {
      const gs = openGaps().filter((g) => g.dept === k);
      return { k, d, h: gs.filter((g) => g.severity === "high").length, m: gs.filter((g) => g.severity === "med").length, l: gs.filter((g) => g.severity === "low").length, n: gs.length };
    });
    const max = Math.max(...rows.map((r) => r.n), 1);
    return `<div class="bars">${rows.map((r) => `<div class="bar-row" data-dept="${r.k}" title="${r.d.name}: ${r.n} open gaps">
      <span>${r.d.short === "Ops" ? "Ops / Warehouse" : r.d.short}</span>
      <div class="bar-track" style="width:${Math.max(r.n / max, .04) * 100}%">
        <i style="flex:${r.h};background:var(--red)"></i><i style="flex:${r.m};background:var(--gold)"></i><i style="flex:${r.l};background:#a59d99"></i></div>
      <b>${r.n}</b></div>`).join("")}</div>
      <div class="legend"><span><i style="background:var(--red)"></i>High</span><span><i style="background:var(--gold)"></i>Medium</span><span><i style="background:#a59d99"></i>Low</span></div>`;
  }
  function viewDashboard() {
    const og = openGaps(), hrs = og.reduce((s, g) => s + g.hours, 0);
    const top = [...og].sort((a, b) => b.hours - a.hours).slice(0, 4);
    const busOne = D.risk.people.reduce((s, p) => s + D.risk.m[p].filter((v) => v === 3).length, 0);
    return `<div class="page-head"><div><div class="eyebrow">Monday, Oct 5 · Week 41</div><h1 class="slab">Shop floor report</h1>
      <p>Where your team keeps asking, re-asking, and dropping the ball, pulled from Slack and Granola.</p></div>
      <a class="btn" href="#/inbox">${ICON.inbox}Work the gap inbox</a></div>

    <section class="hero"><div class="ring-wrap">${ring(D.health.score)}</div>
      <div><div class="descriptor" style="justify-content:flex-start">Process health score</div>
        <h2 class="slab">Up 5 points. Still leaking hours.</h2>
        <p>${og.length} open gaps are costing about <b style="color:#fff">${hrs.toFixed(0)} hours a week</b>. Writing down the top 3 wins back ${top.slice(0, 3).reduce((s, g) => s + g.hours, 0).toFixed(0)} of them.</p></div>
      <img class="eagle" src="assets/eagle.png" alt="Maintenance Made Easy emblem"></section>

    <div class="grid g-4" style="margin-bottom:16px">
      <div class="card kpi"><div class="lbl muted">Open gaps</div><div class="v red">${og.length}</div><div class="d"><span class="down">+3</span> new this week</div></div>
      <div class="card kpi"><div class="lbl muted">Hours lost / week</div><div class="v">${hrs.toFixed(0)}</div><div class="d">≈ $${Math.round(hrs * 32 * 4.3).toLocaleString()}/mo at $32/hr</div></div>
      <div class="card kpi"><div class="lbl muted">SOPs documented</div><div class="v">${D.library.length}</div><div class="d"><span class="up">+2</span> in the last 30 days</div></div>
      <div class="card kpi"><div class="lbl muted">Bus-factor-1 areas</div><div class="v red">${busOne}</div><div class="d">Only one person knows how</div></div>
    </div>

    <div class="grid g-main" style="margin-bottom:16px">
      <div class="card"><div class="card-head"><h3 class="slab">Top gaps this week</h3><a class="linkbtn" href="#/inbox">See all →</a></div>
        <div class="list">${top.map((g, i) => `<div class="li" data-go="#/gap/${g.id}"><span class="rank">${i + 1}</span>
          <div class="grow"><div class="li-title">${g.title}</div><div class="li-sub">${g.signal} · ${D.depts[g.dept].short}</div></div>
          <div style="text-align:right"><div class="slab" style="font-size:17px">${g.hours}h</div><div class="lbl muted" style="font-size:10px">/ week</div></div></div>`).join("")}</div></div>
      <div class="card"><div class="card-head"><h3 class="slab">Gaps by department</h3><span class="lbl">Open</span></div>${deptBars()}</div>
    </div>

    <div class="grid g-3">
      <div class="card chart span-2"><div class="card-head"><h3 class="slab">Health trend</h3><span class="lbl">Last 8 weeks</span></div>${trendChart(D.health.trend)}</div>
      <div class="card dark"><div class="eyebrow gold">Needs an owner</div>
        <h3 class="slab" style="color:var(--smoke);margin:6px 0 10px;font-size:18px">${ownerless().length} meeting action items nobody owns</h3>
        ${ownerless().slice(0, 3).map((a) => `<div style="padding:8px 0;border-top:1px solid #3a3838;font-size:14px">${a.text}<div style="font-size:12px;color:#a59d99">${a.mtg} · ${a.date}${a.repeat > 1 ? ` · <span style="color:var(--gold)">came up ${a.repeat}×</span>` : ""}</div></div>`).join("")}
        <a class="btn gold sm" href="#/actions" style="margin-top:10px">Assign owners</a></div>
    </div>`;
  }

  /* ---------- inbox ---------- */
  function gapCard(g) {
    return `<article class="gap-card ${g.severity}" data-go="#/gap/${g.id}">
      <div style="min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${sev(g.severity)}${st(g.status)}<span class="dept">${D.depts[g.dept].name}</span></div>
        <h3>${g.title}</h3>
        <div class="signal">${ICON[g.signalIcon]}${g.signal}</div>
        <div class="snips">${g.evidence.slice(0, 2).map((e) => `<div class="snip">${srcBadge(e.src, e.where)}<q>${e.text.replace(/<[^>]+>/g, "")}</q></div>`).join("")}</div></div>
      <div class="metrics"><div class="m"><b>${g.freq.split(" ")[0]}</b><span>${g.freq.split(" ").slice(1).join(" ") || "freq"}</span></div>
        <div class="m"><b class="${g.hours >= 4 ? "red" : ""}" style="${g.hours >= 4 ? "color:var(--red)" : ""}">${g.hours}h</b><span>lost / wk</span></div>
        <div class="m"><b>${g.people}</b><span>people</span></div></div>
      <div class="gap-foot">${av(g.owner)} Suggested owner: <b style="color:var(--coal)">${P(g.owner).name}</b> · ${P(g.owner).role}
        <div class="push">${g.status === "documented" ? `<a class="btn ghost sm" href="#/library">View SOP</a>` : `<button class="btn sm" data-draft="${g.id}">${ICON.spark}Draft SOP</button>`}</div></div>
    </article>`;
  }
  function viewInbox() {
    const f = state.filter;
    let list = D.gaps.filter((g) => f.dept === "all" || g.dept === f.dept);
    if (f.status === "open") list = list.filter((g) => !["documented", "ignored"].includes(g.status));
    else if (f.status !== "all") list = list.filter((g) => g.status === f.status);
    const order = { high: 0, med: 1, low: 2 };
    list.sort((a, b) => order[a.severity] - order[b.severity] || b.hours - a.hours);
    const segs = [["open", "Open"], ["new", "New"], ["assigned", "Assigned"], ["drafting", "Drafting"], ["documented", "Documented"], ["ignored", "Ignored"], ["all", "All"]];
    return `<div class="page-head"><div><div class="eyebrow">Detected from Slack + Granola</div><h1 class="slab">Gap inbox</h1>
      <p>Every card is a process that lives in someone's head. Pick one, draft the SOP, hand it to the owner.</p></div></div>
      <div class="filters"><div class="seg" style="overflow-x:auto;max-width:100%">${segs.map(([k, t]) => `<button data-status="${k}" class="${f.status === k ? "on" : ""}">${t}</button>`).join("")}</div>
        <select class="sel" id="deptSel"><option value="all">All departments</option>${Object.entries(D.depts).map(([k, d]) => `<option value="${k}" ${f.dept === k ? "selected" : ""}>${d.name}</option>`).join("")}</select>
        <span class="small muted" style="margin-left:auto">${list.length} gap${list.length === 1 ? "" : "s"} · sorted by severity, hours lost</span></div>
      ${list.map(gapCard).join("") || `<div class="empty card">Nothing here. Clean shop.</div>`}`;
  }

  /* ---------- gap detail + SOP ---------- */
  function sopFor(g) {
    if (g.sop) return g.sop;
    const ev = g.evidence;
    return {
      purpose: `Give the team one clear way to handle “${g.title.toLowerCase()}” so nobody has to ask in Slack or wait on ${P(g.owner).name}.`,
      trigger: `Whenever this comes up in ${ev[0] ? ev[0].where : "the team"}. Reviewed every 90 days by the owner.`,
      owner: g.owner, backup: Object.keys(D.people).find((p) => D.people[p].dept === g.dept && p !== g.owner) || "dana",
      tools: g.dept === "mkt" ? ["Shopify", "eBay Seller Hub", "Walmart Seller Center", "NetSuite"] : g.dept === "cx" ? ["Gorgias", "ShipStation", "NetSuite", "Slack #cx-returns"] : g.dept === "fin" ? ["NetSuite", "Google Sheets", "Bank portal"] : g.dept === "mar" ? ["Meta Ads Manager", "Motion", "Shopify", "Google Sheets"] : ["NetSuite", "Netstock", "Slack #inventory"],
      steps: [
        "Confirm the request and log it (who asked, what SKU / order / account).",
        `Check the current state in the system of record before changing anything.`,
        "Make the change or run the task using the steps the owner walked through in the evidence.",
        "Double-check the result in every channel it touches.",
        `Post a short “done” note in the thread and tag ${P(g.owner).name}.`
      ],
      checklist: ["Request logged", "Checked system of record first", "Change verified in every channel", "Done note posted"],
      edge: ["If the system shows conflicting numbers, stop and flag the owner before changing anything.", "If the owner is out, the backup signs off."],
      cites: { trigger: [1], steps: [1, 2, 3], edge: [1] }
    };
  }
  function evidenceHTML(g) {
    return `<div class="evidence">${g.evidence.map((e, i) => `<div class="ev"><div class="ev-head"><span class="ref">E${i + 1}</span>${srcBadge(e.src, e.where)}<span class="who">${e.who}</span><span>· ${e.when}</span></div><p>${e.text}</p></div>`).join("") || `<div class="muted">No evidence attached.</div>`}</div>`;
  }
  function sopHTML(g) {
    const s = sopFor(g), cite = (arr) => (arr || []).map((n) => `<span class="ref">E${n}</span>`).join("");
    const sopId = "SOP-0" + (22 + D.gaps.indexOf(g));
    return `<div class="sop" id="sop"><div class="sop-top"><div class="descriptor" style="justify-content:flex-start">AI draft · ${sopId} · v0.1</div>
      <h2 class="slab" contenteditable="true">${g.title}</h2>
      <div class="sop-meta"><span>Dept: ${D.depts[g.dept].name}</span><span>Owner: ${P(s.owner).name}</span><span>Backup: ${P(s.backup).name}</span><span>Built from ${g.evidence.length} sources</span></div></div>
      <div class="sop-body">
        <div class="sop-sec"><h4>Purpose</h4><p contenteditable="true" style="margin:0">${s.purpose}</p></div>
        <div class="sop-sec"><h4>Owner &amp; trigger <span class="cite">from ${cite(s.cites.trigger)}</span></h4>
          <p contenteditable="true" style="margin:0"><b>Owner:</b> ${P(s.owner).name} (${P(s.owner).role}). <b>Backup:</b> ${P(s.backup).name}.<br><b>When:</b> ${s.trigger}</p></div>
        <div class="sop-sec"><h4>Tools</h4><div class="tools">${s.tools.map((t) => `<span class="tool">${t}</span>`).join("")}</div></div>
        <div class="sop-sec"><h4>Steps <span class="cite">from ${cite(s.cites.steps)}</span></h4><ol contenteditable="true">${s.steps.map((t) => `<li>${t}</li>`).join("")}</ol></div>
        <div class="sop-sec"><h4>Done checklist</h4><ul class="checklist">${s.checklist.map((t) => `<li><input type="checkbox"><span contenteditable="true">${t}</span></li>`).join("")}</ul></div>
        <div class="sop-sec"><h4>Edge cases <span class="cite">from ${cite(s.cites.edge)}</span></h4><ul contenteditable="true">${s.edge.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="callout" style="margin-top:12px"><b>Open question for ${P(s.owner).name}:</b> the evidence doesn't say what happens when ${g.dept === "ops" ? "a carrier invoice disputes a charge" : "two people make the change at the same time"}. Add a line or mark N/A.</div>
      </div>
      <div class="sop-actions"><button class="btn ghost sm" data-modal="assign">Assign owner</button>
        <button class="btn sm" data-approve="${g.id}">${ICON.check}Approve</button>
        <button class="btn dark sm" data-modal="export">Export</button>
        <button class="btn ghost sm" data-redraft="${g.id}">Redraft</button></div></div>`;
  }
  function viewGap(id, mode) {
    const g = D.gaps.find((x) => x.id === id);
    if (!g) return `<div class="empty">Gap not found. <a href="#/inbox">Back to inbox</a></div>`;
    const drafted = state.drafted[id] || g.status === "drafting" || mode === "sop";
    return `<div class="crumb"><a href="#/inbox">Gap inbox</a> / ${D.depts[g.dept].short}</div>
      <div class="page-head"><div><div style="display:flex;gap:8px;flex-wrap:wrap">${sev(g.severity)}${st(g.status)}</div>
        <h1 class="slab" style="font-size:26px;margin-top:10px">${g.title}</h1>
        <div class="signal" style="margin-top:8px">${ICON[g.signalIcon]}${g.signal}</div></div></div>
      <div class="detail"><div>
        <div class="callout red" style="margin-bottom:14px"><b>Why it matters:</b> ${g.why}</div>
        <div id="sopSlot">${drafted ? sopHTML(g) : `<div class="card" style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:16px;border-left:4px solid var(--red)">
            <div style="flex:1;min-width:220px"><div class="eyebrow">Ready to write</div><div class="slab" style="font-size:18px;margin:4px 0">Draft this SOP from the evidence</div>
            <div class="small muted">Shop Manual reads the ${g.evidence.length} threads and notes below and builds purpose, owner, trigger, steps, tools, checklist and edge cases. You edit, the owner approves.</div></div>
            <button class="btn" data-draft-here="${g.id}">${ICON.spark}Draft SOP</button></div>`}</div>
        <div class="card" style="margin-top:16px"><div class="card-head"><h3 class="slab">Evidence</h3><span class="lbl">${g.evidence.length} sources</span></div>${evidenceHTML(g)}</div>
      </div>
      <aside class="grid" style="gap:16px">
        <div class="card"><div class="card-head"><h3 class="slab">Signal</h3></div><div class="stat-list">
          <div><span class="k">Frequency</span><b>${g.freq}</b></div>
          <div><span class="k">Est. hours lost</span><b style="color:var(--red)">${g.hours} h / week</b></div>
          <div><span class="k">People affected</span><b>${g.people}</b></div>
          <div><span class="k">Detection rule</span><b>${g.rule}</b></div>
          <div><span class="k">First detected</span><b>${g.detected}</b></div></div></div>
        <div class="card"><div class="card-head"><h3 class="slab">Owner</h3><span class="lbl">Suggested</span></div>
          <div style="display:flex;gap:10px;align-items:center">${av(g.owner, false)}<div><b>${P(g.owner).name}</b><div class="small muted">${P(g.owner).role} · answered ${Math.min(g.evidence.length, 4)} of these threads</div></div></div>
          <select class="sel" id="ownerSel" style="width:100%;margin-top:12px">${Object.entries(D.people).map(([k, p]) => `<option value="${k}" ${k === g.owner ? "selected" : ""}>${p.name} · ${p.role}</option>`).join("")}</select>
          <div style="display:flex;gap:8px;margin-top:10px"><button class="btn sm" data-assign="${g.id}">Assign</button><button class="btn ghost sm" data-ignore="${g.id}">Ignore gap</button></div></div>
        <div class="card"><div class="eyebrow gold">Related</div><div class="small" style="margin-top:6px">${g.dept === "ops" ? "SOP-007 Daily pick, pack &amp; ship cutoff (stale)" : g.dept === "mkt" ? "SOP-005 eBay listing creation (stale)" : g.dept === "cx" ? "SOP-011 Shopify order exceptions (stale)" : "SOP-009 PO approval over $10k"}</div></div>
      </aside></div>`;
  }
  function runDraft(id) {
    const g = D.gaps.find((x) => x.id === id), slot = $("#sopSlot");
    const steps = [`Reading ${g.evidence.filter((e) => e.src === "slack").length} Slack threads`, `Reading ${g.evidence.filter((e) => e.src === "granola").length} Granola meeting notes`, "Finding the steps people actually follow", "Spotting edge cases and open questions", "Writing the draft"];
    slot.innerHTML = `<div class="sop"><div class="sop-top"><div class="descriptor" style="justify-content:flex-start">Drafting SOP</div><h2 class="slab">${g.title}</h2></div><div class="drafting" id="dsteps"></div></div>`;
    let i = 0;
    const tick = () => {
      $("#dsteps").innerHTML = steps.map((s, j) => `<div class="step ${j < i ? "done" : j === i ? "now" : ""}"><i class="${j === i ? "spin" : ""}">${j < i ? "✓" : ""}</i>${s}</div>`).join("");
      if (i++ < steps.length) setTimeout(tick, 380);
      else { state.drafted[id] = true; if (g.status === "new" || g.status === "assigned") g.status = "drafting"; render(); }
    };
    tick();
  }

  /* ---------- library ---------- */
  function viewLibrary() {
    const staleN = D.library.filter((s) => s.stale && s.stale.level === "red").length;
    return `<div class="page-head"><div><div class="eyebrow">${D.library.length} SOPs · ${staleN} need a look</div><h1 class="slab">Process library</h1>
      <p>Documented processes, who owns them, and whether Slack says they've drifted since the last review.</p></div>
      <button class="btn ghost" data-toast="Library synced from Google Drive &amp; Notion (mock)">Sync library</button></div>
      <table class="tbl"><thead><tr><th>SOP</th><th>Department</th><th>Owner</th><th>Last reviewed</th><th>Freshness</th><th></th></tr></thead><tbody>
      ${D.library.map((s) => `<tr><td><div class="lbl" style="color:var(--gold)">${s.id}</div><b>${s.title}</b>
        ${s.stale ? `<div class="stale ${s.stale.level === "red" ? "red" : ""}">${ICON.warn}<span>${s.stale.text}</span></div>` : ""}</td>
        <td data-l="Dept">${D.depts[s.dept].short}</td><td data-l="Owner"><span style="display:inline-flex;gap:6px;align-items:center">${av(s.owner)}${P(s.owner).name}</span></td>
        <td data-l="Reviewed">${s.reviewed} <span class="muted small">(${s.age}d)</span></td>
        <td data-l="Fresh"><span class="fresh"><i style="width:${s.fresh}%;background:${s.fresh < 40 ? "var(--red)" : s.fresh < 70 ? "var(--gold)" : "var(--ok)"}"></i></span>${s.fresh}%</td>
        <td>${s.stale && s.stale.level === "red" ? `<button class="btn sm" data-toast="Review request sent to ${P(s.owner).name} in Slack (mock)">Ask ${P(s.owner).name} to review</button>` : `<span class="src-badge"><span class="ico ${s.src}">${s.src === "notion" ? "N" : "D"}</span>${s.src === "notion" ? "Notion" : "Google Doc"}</span>`}</td></tr>`).join("")}
      </tbody></table>`;
  }

  /* ---------- knowledge risk ---------- */
  function viewRisk() {
    const R = D.risk, cols = R.areas.length;
    const lvl = ["Doesn't know", "Learning", "Can do it", "Only one who knows"];
    const solo = [];
    R.areas.forEach((a, j) => { const who = R.people.filter((p) => R.m[p][j] >= 2); if (who.length <= 1) solo.push({ a, who: who[0], backups: R.people.filter((p) => R.m[p][j] === 1) }); });
    return `<div class="page-head"><div><div class="eyebrow">Bus factor map</div><h1 class="slab">Knowledge risk</h1>
      <p>Who actually answers the questions and does the work, based on 90 days of Slack and meeting notes. Red means one person out sick stops the process.</p></div></div>
      <div class="grid g-main"><div class="card"><div class="card-head"><h3 class="slab">Who knows what</h3></div><div class="heat-wrap">
        <div class="heat" style="grid-template-columns: 110px repeat(${cols}, minmax(62px, 1fr)); min-width: ${110 + cols * 65}px">
          <div></div>${R.areas.map((a) => `<div class="hh">${a}</div>`).join("")}
          ${R.people.map((p) => `<div class="rh">${av(p)}${P(p).name}</div>${R.m[p].map((v, j) => `<div class="hc h${v}" title="${P(p).name} · ${R.areas[j]}: ${lvl[v]}">${v === 3 ? "ONLY" : v === 2 ? "✓" : v === 1 ? "·" : ""}</div>`).join("")}`).join("")}
        </div></div>
        <div class="legend"><span><i style="background:var(--red)"></i>Only one who knows</span><span><i style="background:var(--gold)"></i>Can do it</span><span><i style="background:#e4d6c0"></i>Learning</span><span><i style="background:#efe9e6"></i>No signal</span></div></div>
      <div class="card"><div class="card-head"><h3 class="slab">Single points of failure</h3><span class="lbl" style="color:var(--red)">${solo.length}</span></div>
        ${solo.map((s) => `<div class="risk-row"><div><b>${s.a}</b><div class="small muted">Only ${P(s.who).name}${s.backups.length ? `. ${s.backups.map((b) => P(b).name).join(", ")} ${s.backups.length > 1 ? "are" : "is"} learning` : ". No backup in sight"}</div>
          <button class="linkbtn" style="margin-top:6px" data-toast="Shadow session for ${s.a} proposed to ${P(s.who).name}${s.backups[0] ? " + " + P(s.backups[0]).name : ""} (mock)">Schedule a shadow session →</button></div>
          <div class="bf">1<small>bus factor</small></div></div>`).join("")}</div></div>`;
  }

  /* ---------- action items ---------- */
  function viewActions() {
    const list = D.actions;
    return `<div class="page-head"><div><div class="eyebrow">From Granola meeting notes</div><h1 class="slab">Unowned action items</h1>
      <p>Things someone said “we should…” about in a meeting, and then nobody owned. Repeats get flagged as process gaps.</p></div>
      <button class="btn" data-assign-all>Assign all suggested</button></div>
      ${list.map((a) => `<div class="ai"><div class="when">${a.mon}<b>${a.day}</b></div>
        <div style="min-width:0"><div class="ai-title">${a.text}</div><div class="small muted" style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:4px">${srcBadge("granola", a.mtg)}<span>${a.ageDays} days with no owner</span>${a.repeat > 1 ? `<span class="chip sev-high">Came up ${a.repeat}×</span>` : ""}</div></div>
        <div class="ctl">${a.owner ? `<span class="chip st-documented">${ICON.check.replace("<svg", '<svg width="12" height="12"')} ${P(a.owner).name} owns it</span>` :
          `<select class="sel" data-ai-sel="${a.id}">${Object.entries(D.people).map(([k, p]) => `<option value="${k}" ${k === a.suggest ? "selected" : ""}>${p.name}${k === a.suggest ? " (suggested)" : ""}</option>`).join("")}</select>
           <button class="btn sm" data-ai="${a.id}">Assign</button>`}</div></div>`).join("")}`;
  }

  /* ---------- digest ---------- */
  function viewDigest() {
    const og = openGaps(), top = [...og].sort((a, b) => b.hours - a.hours).slice(0, 3);
    return `<div class="page-head"><div><div class="eyebrow">Preview · posts Mondays 8:00 AM</div><h1 class="slab">Weekly Slack digest</h1>
      <p>What the team sees in #leadership every Monday. Short, specific, one button per ask.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ghost" data-toast="Test digest sent to your DMs (mock)">Send me a test</button><a class="btn" href="#/settings">Edit schedule</a></div></div>
      <div class="slack"><div class="slack-bar"># leadership <span>· Doc's Diesel</span></div>
        <div class="slack-msg"><div class="bot"><img src="assets/monogram-hex.png" alt=""></div><div>
          <div class="slack-name">Shop Manual<span class="app">APP</span><time>8:00 AM</time></div>
          <p><b>🛠️ Shop floor report · Week 41</b></p>
          <p>Process health is <b>${D.health.score}/100</b> (up 5). ${og.length} open gaps are costing ~<b>${og.reduce((s, g) => s + g.hours, 0).toFixed(0)} hrs/week</b>.</p>
          <div class="slack-block"><b>Top 3 to write down this week</b>${top.map((g, i) => `<p style="margin:6px 0 0">${i + 1}. <b>${g.title}</b>: ${g.signal.toLowerCase()} · ~${g.hours}h/wk · owner <span style="color:#1264a3">@${P(g.owner).name}</span></p>`).join("")}</div>
          <div class="slack-block gold"><b>⚠️ Bus factor alerts</b><p style="margin:6px 0 0">Only <span style="color:#1264a3">@Sam</span> builds the shipping cost report. Only <span style="color:#1264a3">@Tessa</span> runs the ROAS recap. Only <span style="color:#1264a3">@Andre</span> knows the RMA rules.</p></div>
          <div class="slack-block gray"><b>📋 ${ownerless().length} meeting action items still have no owner</b><p style="margin:6px 0 0">Oldest: “${D.actions[2].text}” (CX Weekly, 11 days)</p></div>
          <div class="slack-block" style="border-left-color:#007a5a"><b>✅ Documented last week</b><p style="margin:6px 0 0">SOP-021 Amazon main image approval (wipers), by @Priya</p></div>
          <div class="slack-btns"><span class="p">Open gap inbox</span><span>Claim a gap</span><span>Assign action items</span></div>
        </div></div></div>`;
  }

  /* ---------- settings ---------- */
  function tog(key, on) { const v = key in state.toggles ? state.toggles[key] : on; return `<label class="toggle"><input type="checkbox" data-tog="${key}" ${v ? "checked" : ""}><span></span></label>`; }
  function viewSettings() {
    return `<div class="page-head"><div><div class="eyebrow">Mock connections</div><h1 class="slab">Sources &amp; rules</h1>
      <p>What Shop Manual listens to, and what counts as a gap. Nothing here is live in the prototype.</p></div></div>
      <div class="grid g-2" style="margin-bottom:16px">
        <div class="card"><div class="conn"><div class="logo" style="background:#4a154b">#</div><div style="flex:1"><b>Slack</b> <span class="chip st-documented">Connected</span><div class="small muted">docsdiesel.slack.com · read-only · last scan 6 min ago</div></div>${tog("slack", true)}</div></div>
        <div class="card"><div class="conn"><div class="logo" style="background:#5f7a3a">G</div><div style="flex:1"><b>Granola</b> <span class="chip st-documented">Connected</span><div class="small muted">14 recurring meetings · 212 notes · last sync 1 hr ago</div></div>${tog("granola", true)}</div></div>
        <div class="card"><div class="conn"><div class="logo" style="background:#2a62c9">D</div><div style="flex:1"><b>Google Drive</b> <span class="chip st-documented">Export target</span><div class="small muted">/Ops/SOPs · used for library + Google Doc export</div></div>${tog("gdrive", true)}</div></div>
        <div class="card"><div class="conn"><div class="logo" style="background:var(--coal)">N</div><div style="flex:1"><b>Notion</b> <span class="chip st-ignored">Optional</span><div class="small muted">Not connected. Export will fall back to Google Doc.</div></div>${tog("notion", false)}</div></div>
      </div>
      <div class="grid g-2">
        <div class="card"><div class="card-head"><h3 class="slab">Slack channels watched</h3><span class="lbl">${D.slack.filter((c) => c.on).length} of ${D.slack.length}</span></div>
          ${D.slack.map((c) => `<div class="set-row"><div class="grow"><div class="t">${c.ch}</div><div class="s">${c.msgs}</div></div>${tog("ch" + c.ch, c.on)}</div>`).join("")}
          <div class="small muted" style="margin-top:8px">DMs are never read. Private channels only if the app is invited.</div></div>
        <div><div class="card" style="margin-bottom:16px"><div class="card-head"><h3 class="slab">Detection rules</h3></div>
          ${D.rules.map((r, i) => `<div class="set-row"><div class="grow"><div class="t">${r.k}</div><div class="s">${r.d}</div>
            <div class="thresh" style="margin-top:6px">Flag at <input type="number" value="${r.th}" min="1"> ${r.unit}</div></div>${tog("rule" + i, r.on)}</div>`).join("")}</div>
          <div class="card"><div class="card-head"><h3 class="slab">Weekly digest</h3>${tog("digest", true)}</div>
            <div class="set-row"><div class="grow"><div class="t">Post to</div></div><select class="sel"><option>#leadership</option><option>#general</option><option>DM to Max only</option></select></div>
            <div class="set-row"><div class="grow"><div class="t">When</div></div><select class="sel"><option>Monday 8:00 AM</option><option>Friday 3:00 PM</option></select></div>
            <div class="set-row"><div class="grow"><div class="t">Nudge owners in DM when a gap is assigned</div></div>${tog("nudge", true)}</div>
            <a class="linkbtn" href="#/digest" style="display:inline-block;margin-top:8px">Preview digest →</a></div></div>
      </div>`;
  }

  /* ---------- modal / toast ---------- */
  let toastT;
  function toast(msg) { const t = $("#toast"); t.innerHTML = msg; t.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600); }
  function modal(kind) {
    const id = location.hash.split("/")[2], g = D.gaps.find((x) => x.id === id);
    const m = $("#modal");
    if (kind === "export") {
      m.innerHTML = `<div class="modal-head"><div class="eyebrow gold">Export SOP</div><h3 class="slab">Where should it live?</h3></div><div class="modal-body">
        <div class="opt on" data-opt><span class="ico gdoc">D</span><div><b>Google Doc</b><div class="small muted">Drive › Ops › SOPs, Doc's Diesel template</div></div></div>
        <div class="opt" data-opt><span class="ico notion">N</span><div><b>Notion page</b><div class="small muted">Wiki › Processes</div></div></div>
        <div class="opt" data-opt><span class="ico slack">#</span><div><b>Slack post</b><div class="small muted">Pin in #${g && g.evidence[0] ? g.evidence[0].where.replace("#", "") : "ops"} and DM the owner</div></div></div></div>
        <div class="modal-foot"><button class="btn ghost sm" data-close>Cancel</button><button class="btn sm" data-export>Export</button></div>`;
    } else {
      m.innerHTML = `<div class="modal-head"><div class="eyebrow gold">Assign owner</div><h3 class="slab">Who owns this process?</h3></div><div class="modal-body">
        ${Object.entries(D.people).slice(0, 5).map(([k, p], i) => `<div class="opt ${g && k === g.owner ? "on" : ""}" data-opt data-who="${k}">${av(k, false)}<div><b>${p.name}</b><div class="small muted">${p.role}${g && k === g.owner ? " · suggested, answered most threads" : ""}</div></div></div>`).join("")}
        <label class="small" style="display:flex;gap:8px;align-items:center;margin-top:6px"><input type="checkbox" checked style="accent-color:var(--red)">DM them in Slack with the draft + 90-day review reminder</label></div>
        <div class="modal-foot"><button class="btn ghost sm" data-close>Cancel</button><button class="btn sm" data-assign-modal>Assign</button></div>`;
    }
    $("#overlay").classList.add("open");
  }
  const closeModal = () => $("#overlay").classList.remove("open");

  /* ---------- router ---------- */
  function render() {
    const route = (location.hash.replace(/^#\/?/, "") || "dashboard");
    const [r, arg, arg2] = route.split("/");
    const views = { dashboard: viewDashboard, inbox: viewInbox, library: viewLibrary, risk: viewRisk, actions: viewActions, digest: viewDigest, settings: viewSettings };
    $("#content").innerHTML = r === "gap" ? viewGap(arg, arg2) : (views[r] || viewDashboard)();
    renderNav(route);
  }
  let lastRoute = "";
  window.addEventListener("hashchange", () => { render(); if (location.hash !== lastRoute) window.scrollTo(0, 0); lastRoute = location.hash; });

  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, [data-go], [data-opt], .bar-row, #overlay");
    if (!t) return;
    const d = t.dataset;
    if (t.id === "overlay") { if (e.target === t) closeModal(); return; }
    if (d.draft) { e.stopPropagation(); location.hash = "#/gap/" + d.draft; setTimeout(() => runDraft(d.draft), 60); return; }
    if (d.draftHere) return runDraft(d.draftHere);
    if (d.redraft) { state.drafted[d.redraft] = false; return runDraft(d.redraft); }
    if (d.status) { state.filter.status = d.status; return render(); }
    if (t.classList.contains("bar-row")) { state.filter = { status: "open", dept: d.dept }; location.hash = "#/inbox"; return; }
    if (d.modal) return modal(d.modal);
    if ("close" in d) return closeModal();
    if ("opt" in d) { t.parentElement.querySelectorAll(".opt").forEach((o) => o.classList.remove("on")); t.classList.add("on"); return; }
    if ("export" in d) { const w = $(".opt.on b", $("#modal")).textContent; closeModal(); return toast(`Exported as ${w}. Link copied (mock).`); }
    if ("assignModal" in d) { const id = location.hash.split("/")[2], g = D.gaps.find((x) => x.id === id), who = $(".opt.on", $("#modal")); if (g && who) { g.owner = who.dataset.who; } closeModal(); render(); return toast(`Assigned to ${P(g.owner).name}. Slack DM sent (mock).`); }
    if (d.approve) { const g = D.gaps.find((x) => x.id === d.approve); g.status = "documented";
      if (!D.library.find((s) => s.title === g.title)) D.library.unshift({ id: "SOP-0" + (22 + D.gaps.indexOf(g)), title: g.title, dept: g.dept, owner: g.owner, reviewed: "Oct 5", age: 0, fresh: 100, stale: null, src: "gdoc" });
      D.health.score = Math.min(100, D.health.score + 3); D.health.trend[D.health.trend.length - 1] = D.health.score;
      render(); return toast(`Approved. Added to Process Library. Health +3 → ${D.health.score}`); }
    if (d.assign) { const g = D.gaps.find((x) => x.id === d.assign); g.owner = $("#ownerSel").value; if (g.status === "new") g.status = "assigned"; render(); return toast(`${P(g.owner).name} now owns this gap. Slack DM sent (mock).`); }
    if (d.ignore) { const g = D.gaps.find((x) => x.id === d.ignore); g.status = "ignored"; location.hash = "#/inbox"; return toast("Gap ignored. It won't show up again unless the signal doubles."); }
    if (d.ai) { const a = D.actions.find((x) => x.id === d.ai); a.owner = $(`[data-ai-sel="${d.ai}"]`).value; render(); return toast(`${P(a.owner).name} owns “${a.text}”. Posted back to the Granola note (mock).`); }
    if ("assignAll" in d) { D.actions.forEach((a) => { if (!a.owner) a.owner = a.suggest; }); render(); return toast("All action items assigned to suggested owners (mock)."); }
    if (d.toast) return toast(d.toast);
    if (d.go) { location.hash = d.go; }
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "deptSel") { state.filter.dept = e.target.value; render(); }
    if (e.target.dataset.tog) { state.toggles[e.target.dataset.tog] = e.target.checked; toast(`${e.target.checked ? "Turned on" : "Turned off"} (mock, nothing saved)`); }
  });

  render(); lastRoute = location.hash;
})();

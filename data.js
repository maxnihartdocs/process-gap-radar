// MOCK DATA ONLY: fake people, fake messages. No real API connections.
window.DATA = {
  people: {
    dana: { name: "Dana", role: "Ops Manager", dept: "ops" },
    luis: { name: "Luis", role: "Warehouse Lead", dept: "ops" },
    kim: { name: "Kim", role: "Marketplace Specialist", dept: "mkt" },
    rob: { name: "Rob", role: "Controller", dept: "fin" },
    tessa: { name: "Tessa", role: "Marketing Manager", dept: "mar" },
    andre: { name: "Andre", role: "CX Lead", dept: "cx" },
    mia: { name: "Mia", role: "CX Rep", dept: "cx" },
    cole: { name: "Cole", role: "Inventory Analyst", dept: "ops" },
    priya: { name: "Priya", role: "Product Manager", dept: "mkt" },
    sam: { name: "Sam", role: "Shipping Coordinator", dept: "ops" }
  },
  depts: {
    ops: { name: "Ops / Warehouse", short: "Ops" },
    mkt: { name: "eBay / Walmart / Marketplace", short: "Marketplace" },
    fin: { name: "Finance", short: "Finance" },
    mar: { name: "Marketing", short: "Marketing" },
    cx: { name: "Customer Experience", short: "CX" }
  },
  health: { score: 62, last: 57, trend: [48, 51, 50, 54, 55, 57, 59, 62] },

  gaps: [
    {
      id: "g1", title: "Weekly shipping cost report: how it gets built", dept: "ops", severity: "high", status: "new",
      signal: "Asked 7 times in Slack in 14 days", signalIcon: "repeat",
      freq: "7× / 14d", hours: 4.5, people: 5, owner: "sam", detected: "Oct 1", rule: "Repeat questions",
      why: "Only Sam knows which carrier exports feed the report. When Sam was out Sep 22–24 the report slipped two days and finance used last week's numbers.",
      evidence: [
        { src: "slack", where: "#ops-shipping", who: "Dana", when: "Oct 3", text: "Where do the FedEx surcharges go in the weekly <mark>shipping cost report</mark>? Doing it while Sam's out." },
        { src: "slack", where: "#ops-shipping", who: "Luis", when: "Sep 30", text: "<mark>How do I pull</mark> the ShipStation export for the cost report? The date filter keeps resetting." },
        { src: "granola", where: "Mon Ops Standup", who: "Meeting note", when: "Sep 29", text: "Shipping report late again. Rob needs it by Tuesday noon for the margin review. <mark>No one assigned</mark> to back up Sam." },
        { src: "slack", where: "#finance", who: "Rob", when: "Sep 24", text: "Is the UPS residential fee in the cost per order or separate? Getting different numbers <mark>every week</mark>." },
        { src: "slack", where: "DM", who: "Cole", when: "Sep 22", text: "Sam, which tab do you paste the Walmart freight into? <mark>Want to write this down.</mark>" }
      ],
      sop: {
        purpose: "Produce a consistent weekly shipping cost report (cost per order by carrier and channel) so Finance can run Tuesday margin review on time, every week, no matter who builds it.",
        trigger: "Every Monday 9:00 AM. Due to Rob in #finance by Tuesday 12:00 PM.",
        owner: "sam", backup: "dana",
        tools: ["ShipStation", "FedEx Billing Online", "UPS Billing Center", "NetSuite", "Google Sheets: Shipping Cost Tracker"],
        steps: [
          "In ShipStation, export Shipments for last Mon–Sun. Set the date filter <b>after</b> choosing the store, or it resets.",
          "Download FedEx and UPS invoices for the same week. Keep surcharges (residential, DAS, fuel) as separate line items.",
          "Paste each export into its own tab of the Shipping Cost Tracker (ShipStation, FedEx, UPS, Walmart Freight).",
          "Check the Summary tab: cost per order by channel (Shopify, eBay, Walmart, Amazon). Flag any channel that moved more than 10% week over week.",
          "Reconcile total carrier spend to NetSuite AP. Variance over $250 gets a note.",
          "Post the Summary screenshot and sheet link in #finance and tag Rob."
        ],
        checklist: ["Date range is Mon–Sun of last week", "Surcharges broken out, not rolled into base", "Walmart freight included", "NetSuite variance under $250 or explained", "Posted in #finance by Tue noon"],
        edge: [
          "Short week (holiday): still Mon–Sun; note the holiday in the post.",
          "Carrier invoice not out yet: use ShipStation estimates, mark ESTIMATE, and true up next week.",
          "Freight LTL shipments go on the Walmart Freight tab, not FedEx."
        ],
        cites: { trigger: [3], steps: [2, 1, 5, 4], edge: [4] }
      }
    },
    {
      id: "g2", title: "NetSuite ↔ Netstock inventory sync: fixing mismatches", dept: "ops", severity: "high", status: "assigned",
      signal: "Came up in 3 meetings with no owner", signalIcon: "meeting",
      freq: "3 mtgs / 3w", hours: 6, people: 4, owner: "cole", detected: "Sep 28", rule: "Missed action items",
      why: "Reorder points in Netstock are drifting from NetSuite on-hand. Two stockouts on DDBKRR brake rotor SKUs traced to a sync that failed silently.",
      evidence: [
        { src: "granola", where: "Inventory Weekly", who: "Meeting note", when: "Oct 2", text: "Netstock shows 0 on hand for hub assemblies, NetSuite shows 42. <mark>Action: someone figure out the sync.</mark> (no owner)" },
        { src: "granola", where: "Ops / Purchasing Sync", who: "Meeting note", when: "Sep 25", text: "Sync mismatch again. <mark>Need a process</mark> for when the nightly import fails." },
        { src: "slack", where: "#inventory", who: "Cole", when: "Sep 24", text: "Netstock import errored last night. I re-ran it by hand, but <mark>I'm not sure that's the right fix</mark>." },
        { src: "granola", where: "Leadership Weekly", who: "Meeting note", when: "Sep 18", text: "Max: stockouts on rotors cost us the Buy Box for 4 days. <mark>Who owns inventory sync?</mark>" }
      ]
    },
    {
      id: "g3", title: "eBay & Walmart listing updates after a price change", dept: "mkt", severity: "high", status: "drafting",
      signal: "“How do I…” asked 5 times, 3 different people", signalIcon: "question",
      freq: "5× / 21d", hours: 3.5, people: 3, owner: "kim", detected: "Sep 27", rule: "“How do I…” questions",
      why: "Price changes land on Shopify but Walmart lags 2–5 days. Twelve SKUs were underpriced on Walmart last month.",
      evidence: [
        { src: "slack", where: "#marketplaces", who: "Priya", when: "Oct 1", text: "<mark>How do I push</mark> the new filter pricing to Walmart? Shopify updated but Walmart still shows old." },
        { src: "slack", where: "#marketplaces", who: "Mia", when: "Sep 26", text: "Customer says eBay price doesn't match our site. <mark>Who updates eBay?</mark>" },
        { src: "granola", where: "Marketplace Review", who: "Meeting note", when: "Sep 23", text: "12 SKUs underpriced on Walmart after the Sep price change. Kim to <mark>write up the update steps</mark>." }
      ]
    },
    {
      id: "g4", title: "Returns / RMA: when to refund vs. replace", dept: "cx", severity: "med", status: "new",
      signal: "Handoff dropped 4 times between CX and Warehouse", signalIcon: "handoff",
      freq: "4 drops / 14d", hours: 3, people: 4, owner: "andre", detected: "Oct 2", rule: "Handoff drops",
      why: "Returned parts sit in receiving with no RMA match. Customers wait 9+ days for refunds and open eBay cases.",
      evidence: [
        { src: "slack", where: "#cx-returns", who: "Mia", when: "Oct 2", text: "Customer shipped back the hub assembly a week ago. Luis, did it come in? <mark>Can't find the RMA</mark>." },
        { src: "slack", where: "#warehouse", who: "Luis", when: "Sep 29", text: "Three boxes with no RMA number on the label. <mark>What do I do with these?</mark>" },
        { src: "granola", where: "CX Weekly", who: "Meeting note", when: "Sep 24", text: "Refund vs. replace decided case by case. <mark>Andre has the rules in his head.</mark>" }
      ]
    },
    {
      id: "g5", title: "New product launch checklist (listing → photos → ads)", dept: "mkt", severity: "med", status: "new",
      signal: "Came up in 2 meetings, 6 Slack threads", signalIcon: "meeting",
      freq: "8 mentions / 30d", hours: 5, people: 6, owner: "priya", detected: "Sep 30", rule: "Missed action items",
      why: "The wiper blade line launched on Shopify before Amazon images were approved, and Meta ads ran to an out-of-stock page for 2 days.",
      evidence: [
        { src: "granola", where: "Product Launch: Wipers", who: "Meeting note", when: "Sep 30", text: "Launch went live before Amazon main images were approved. <mark>We need a checklist.</mark>" },
        { src: "slack", where: "#launches", who: "Tessa", when: "Sep 21", text: "Are the DDW SKUs live everywhere? <mark>Don't want to start ads until they are.</mark>" }
      ]
    },
    {
      id: "g6", title: "Meta ad spend reporting: weekly ROAS by category", dept: "mar", severity: "med", status: "assigned",
      signal: "Single-person knowledge: only Tessa runs it", signalIcon: "person",
      freq: "Bus factor 1", hours: 2.5, people: 2, owner: "tessa", detected: "Sep 26", rule: "Bus factor risk",
      why: "The Built to Haul spend recap is built by hand from Motion and Shopify. Tessa is the only one who has done it in 90 days.",
      evidence: [
        { src: "slack", where: "#marketing", who: "Rob", when: "Sep 30", text: "Where does the Meta spend number in the recap come from? It's $1.2k off from the card statement." },
        { src: "granola", where: "Marketing Weekly", who: "Meeting note", when: "Sep 26", text: "Tessa out next week. <mark>Who builds the ROAS recap?</mark> No answer." }
      ]
    },
    {
      id: "g7", title: "Month-end close: marketplace fee reconciliation", dept: "fin", severity: "med", status: "new",
      signal: "Asked 4 times in #finance in 30 days", signalIcon: "repeat",
      freq: "4× / 30d", hours: 3, people: 2, owner: "rob", detected: "Oct 3", rule: "Repeat questions",
      why: "eBay and Walmart fee payouts get booked differently each month, which throws off channel margin.",
      evidence: [
        { src: "slack", where: "#finance", who: "Rob", when: "Oct 3", text: "Do Walmart WFS fees go to COGS or selling expense? <mark>We did it both ways this year.</mark>" }
      ]
    },
    {
      id: "g8", title: "Warehouse receiving: putting away a container", dept: "ops", severity: "low", status: "documented",
      signal: "Documented Sep 19, stable since", signalIcon: "check",
      freq: "1× / 30d", hours: 0.5, people: 3, owner: "luis", detected: "Sep 10", rule: "“How do I…” questions",
      why: "Covered by SOP-014.", evidence: [
        { src: "slack", where: "#warehouse", who: "Sam", when: "Sep 10", text: "How do I log a short-shipped container in NetSuite?" }
      ]
    },
    {
      id: "g9", title: "Wholesale / fleet account pricing approvals", dept: "fin", severity: "low", status: "new",
      signal: "“Can I give them…” asked 3 times", signalIcon: "question",
      freq: "3× / 30d", hours: 1, people: 3, owner: "rob", detected: "Oct 4", rule: "“How do I…” questions",
      why: "Discount limits for fleet accounts aren't written down. Reps wait on Max for every approval.",
      evidence: [
        { src: "slack", where: "#sales", who: "Mia", when: "Oct 4", text: "Fleet customer wants 15% off filters. <mark>Can I give them that</mark> or does Max need to OK it?" }
      ]
    },
    {
      id: "g10", title: "Chargeback & eBay case responses", dept: "cx", severity: "low", status: "ignored",
      signal: "2 mentions, low volume", signalIcon: "question",
      freq: "2× / 30d", hours: 0.5, people: 2, owner: "andre", detected: "Sep 20", rule: "“How do I…” questions",
      why: "Low volume. Ignored by Andre: \"handled case by case for now.\"", evidence: []
    }
  ],

  library: [
    { id: "SOP-021", title: "Amazon main image approval (wipers)", dept: "mkt", owner: "priya", reviewed: "Sep 29", age: 6, fresh: 95, stale: null, src: "notion" },
    { id: "SOP-014", title: "Warehouse receiving: container put-away", dept: "ops", owner: "luis", reviewed: "Sep 19", age: 16, fresh: 88, stale: null, src: "gdoc" },
    { id: "SOP-011", title: "Shopify order exceptions & address fixes", dept: "cx", owner: "andre", reviewed: "Aug 12", age: 54, fresh: 52, stale: { level: "red", text: "Process changed in Slack since last review: #cx-returns now routes address fixes through ShipStation (Sep 27, Mia)." }, src: "gdoc" },
    { id: "SOP-009", title: "Purchase order approval over $10k", dept: "fin", owner: "rob", reviewed: "Jul 30", age: 67, fresh: 60, stale: { level: "warn", text: "Due for 90-day review in 23 days." }, src: "notion" },
    { id: "SOP-007", title: "Daily pick, pack & ship cutoff", dept: "ops", owner: "dana", reviewed: "Jun 14", age: 113, fresh: 30, stale: { level: "red", text: "Process changed in Slack since last review: cutoff moved from 2:00 to 3:00 PM (#ops-shipping, Sep 15)." }, src: "gdoc" },
    { id: "SOP-005", title: "eBay listing creation from NetSuite item", dept: "mkt", owner: "kim", reviewed: "May 02", age: 156, fresh: 18, stale: { level: "red", text: "Overdue for review. Steps referencing \"eBay Seller Hub old editor\" were mentioned as outdated 3× in #marketplaces." }, src: "notion" },
    { id: "SOP-003", title: "Meta campaign naming convention", dept: "mar", owner: "tessa", reviewed: "Aug 28", age: 38, fresh: 76, stale: null, src: "gdoc" },
    { id: "SOP-002", title: "New hire Slack & NetSuite access", dept: "ops", owner: "dana", reviewed: "Sep 02", age: 33, fresh: 80, stale: null, src: "notion" }
  ],

  // knowledge depth: 0 none, 1 learning, 2 can do it, 3 only one who knows it
  risk: {
    areas: ["Shipping cost report", "Netstock sync", "Walmart pricing", "RMA rules", "ROAS recap", "Month-end fees", "Container receiving"],
    people: ["sam", "cole", "kim", "andre", "tessa", "rob", "luis", "dana"],
    m: {
      sam:   [3, 0, 0, 0, 0, 0, 1],
      cole:  [1, 3, 0, 0, 0, 0, 1],
      kim:   [0, 0, 2, 0, 0, 0, 0],
      andre: [0, 0, 0, 3, 0, 0, 0],
      tessa: [0, 0, 0, 0, 3, 0, 0],
      rob:   [1, 0, 0, 0, 1, 3, 0],
      luis:  [0, 1, 0, 1, 0, 0, 2],
      dana:  [1, 1, 0, 0, 0, 0, 2]
    }
  },

  actions: [
    { id: "a1", text: "Figure out why the Netstock nightly import fails", mtg: "Inventory Weekly", date: "Oct 2", day: "02", mon: "Oct", suggest: "cole", ageDays: 3, repeat: 3 },
    { id: "a2", text: "Get a backup trained on the weekly shipping cost report", mtg: "Mon Ops Standup", date: "Sep 29", day: "29", mon: "Sep", suggest: "dana", ageDays: 6, repeat: 2 },
    { id: "a3", text: "Decide refund vs. replace rules for hub assembly returns", mtg: "CX Weekly", date: "Sep 24", day: "24", mon: "Sep", suggest: "andre", ageDays: 11, repeat: 1 },
    { id: "a4", text: "Confirm WFS fee GL coding with the accountant", mtg: "Finance Check-in", date: "Oct 1", day: "01", mon: "Oct", suggest: "rob", ageDays: 4, repeat: 1 },
    { id: "a5", text: "Hold Meta ads until all DDW SKUs are live on Amazon & Walmart", mtg: "Product Launch: Wipers", date: "Sep 30", day: "30", mon: "Sep", suggest: "tessa", ageDays: 5, repeat: 1 },
    { id: "a6", text: "Send Q4 brake promo dates to marketplaces team", mtg: "Leadership Weekly", date: "Oct 2", day: "02", mon: "Oct", suggest: "priya", ageDays: 3, repeat: 1 }
  ],

  slack: [
    { ch: "#ops-shipping", on: true, msgs: "1.2k / mo" }, { ch: "#inventory", on: true, msgs: "640 / mo" },
    { ch: "#marketplaces", on: true, msgs: "980 / mo" }, { ch: "#finance", on: true, msgs: "310 / mo" },
    { ch: "#marketing", on: true, msgs: "720 / mo" }, { ch: "#cx-returns", on: true, msgs: "1.5k / mo" },
    { ch: "#warehouse", on: true, msgs: "860 / mo" }, { ch: "#launches", on: true, msgs: "190 / mo" },
    { ch: "#general", on: false, msgs: "2.1k / mo" }, { ch: "#random", on: false, msgs: "900 / mo" }
  ],
  rules: [
    { k: "Repeat questions", d: "Same question asked again and again across channels.", on: true, th: 3, unit: "asks in 14 days" },
    { k: "“How do I…” questions", d: "How-to phrasing: “how do I”, “where do I”, “who does”, “can I”.", on: true, th: 2, unit: "different people" },
    { k: "Handoff drops", d: "Work bounces between teams with no clear next step (e.g. CX → Warehouse).", on: true, th: 2, unit: "drops in 14 days" },
    { k: "Missed action items", d: "Granola action items with no owner, or the same item in back-to-back meetings.", on: true, th: 2, unit: "meetings" },
    { k: "Bus factor risk", d: "Only one person has answered or done a task in the last 90 days.", on: true, th: 1, unit: "person max" },
    { k: "Stale SOP watch", d: "Slack talk contradicts a documented SOP since its last review.", on: true, th: 1, unit: "conflicting mention" }
  ]
};

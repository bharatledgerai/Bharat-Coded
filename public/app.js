const state = {
  data: null
};

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`;

const els = {
  pageTitle: document.querySelector("#pageTitle"),
  pageSubtitle: document.querySelector("#pageSubtitle"),
  moduleKicker: document.querySelector("#moduleKicker"),
  contextModule: document.querySelector("#contextModule"),
  contextInsight: document.querySelector("#contextInsight"),
  contextActions: document.querySelector("#contextActions"),
  insightToggle: document.querySelector("#insightToggle"),
  insightClose: document.querySelector("#insightClose"),
  insightOverlay: document.querySelector("#insightOverlay"),
  insightChat: document.querySelector("#insightChat"),
  insightForm: document.querySelector("#insightForm"),
  insightMessage: document.querySelector("#insightMessage"),
  insightPrompts: document.querySelectorAll("[data-insight-prompt]"),
  voiceButton: document.querySelector("#voiceButton"),
  speakInsightButton: document.querySelector("#speakInsightButton"),
  voiceStatus: document.querySelector("#voiceStatus"),
  navButtons: document.querySelectorAll(".nav button"),
  jumpButtons: document.querySelectorAll("[data-jump]"),
  views: document.querySelectorAll(".view"),
  income: document.querySelector("#income"),
  expense: document.querySelector("#expense"),
  net: document.querySelector("#net"),
  assets: document.querySelector("#assets"),
  gstPayable: document.querySelector("#gstPayable"),
  entryCount: document.querySelector("#entryCount"),
  draftCount: document.querySelector("#draftCount"),
  txnCount: document.querySelector("#txnCount"),
  allTxnCount: document.querySelector("#allTxnCount"),
  transactions: document.querySelector("#transactions"),
  allTransactions: document.querySelector("#allTransactions"),
  drafts: document.querySelector("#drafts"),
  parties: document.querySelector("#parties"),
  partyCount: document.querySelector("#partyCount"),
  reminders: document.querySelector("#reminders"),
  reports: document.querySelector("#reports"),
  auditLogs: document.querySelector("#auditLogs"),
  chatLog: document.querySelector("#chatLog"),
  form: document.querySelector("#aiForm"),
  message: document.querySelector("#message"),
  insightBtn: document.querySelector("#insightBtn"),
  transactionForm: document.querySelector("#transactionForm"),
  partyForm: document.querySelector("#partyForm")
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
  recognition.lang = "en-IN";
  recognition.interimResults = false;
  recognition.continuous = false;
}

const viewCopy = {
  dashboard: {
    page: "PAGE 02 / 13",
    title: "Dashboard",
    subtitle: "Live KPIs, monthly revenue vs expense chart, quick action buttons.",
    insight: "Revenue is ahead of expenses and the balance sheet check is currently balanced.",
    actions: ["Post journal entry", "Open GST status", "Ask cash-flow question"]
  },
  journal: {
    page: "PAGE 03 / 13",
    title: "Journal Entries",
    subtitle: "Post Dr/Cr entries, autocomplete accounts, GST rates, view full ledger.",
    insight: "Use the balance checker before posting. AI drafts still require confirmation.",
    actions: ["Post entry", "Clear form", "Review recent entries"]
  },
  bank: {
    page: "PAGE 04 / 13",
    title: "Bank & Cards",
    subtitle: "Multi-bank balances, recent transactions, card tracking.",
    insight: "HDFC has the strongest available balance. SBI is close to the low-balance watch zone.",
    actions: ["Import bank CSV", "Match ledger", "View cash account"]
  },
  accounts: {
    page: "PAGE 05 / 13",
    title: "Traditional Accounts",
    subtitle: "Schedule III Balance Sheet, Profit & Loss, Trial Balance.",
    insight: "The current starter ledger is balanced by posted entries and ready for account grouping.",
    actions: ["Balance sheet", "Profit & loss", "Trial balance"]
  },
  graphs: {
    page: "PAGE 06 / 13",
    title: "Advance Graphs",
    subtitle: "12 chart series, period filters, AI insights.",
    insight: "The chart module should use live ledger totals and explain trend changes after rendering.",
    actions: ["Revenue trend", "Expense pie", "GST trend"]
  },
  payables: {
    page: "PAGE 07 / 13",
    title: "Payables / AR",
    subtitle: "Debtors with aging, creditors, WhatsApp reminders.",
    insight: "Top debtors and vendor payables should drive one-click reminder workflows.",
    actions: ["Add party", "Draft reminder", "Show overdue"]
  },
  gst: {
    page: "PAGE 08 / 13",
    title: "GST & Compliance",
    subtitle: "GSTR-1, GSTR-3B, QRMP, ITC matching, CGST/SGST/IGST split.",
    insight: "GST payable is shown as a live module placeholder until tax split entries are persisted.",
    actions: ["GSTR-1 status", "3B summary", "ITC match"]
  },
  tax: {
    page: "PAGE 09 / 13",
    title: "Tax Intelligence",
    subtitle: "AI tax summary, advance tax calculator, deduction finder.",
    insight: "Tax intelligence should scan ledger categories for claimable deductions and upcoming dues.",
    actions: ["Advance tax", "Find deductions", "Calendar"]
  },
  expense: {
    page: "PAGE 10 / 13",
    title: "Expense Analysis",
    subtitle: "Pie chart, top expenses ranked, budget vs actual.",
    insight: "Expense analysis should highlight overspending categories and month-wise budget variance.",
    actions: ["Top expenses", "Budget variance", "Pie chart"]
  },
  stack: {
    page: "PAGE 11 / 13",
    title: "Stack Tracker",
    subtitle: "SaaS subscription tracker with renewal dates.",
    insight: "Recurring software subscriptions should be tracked as monthly or annual commitments.",
    actions: ["Add subscription", "Renewals", "Cost summary"]
  },
  ai: {
    page: "PAGE 12 / 13",
    title: "AI Chatbot",
    subtitle: "Natural language Q&A, live ledger context, prompt chips.",
    insight: "The assistant can already create drafts, reminders, and live summaries from ledger state.",
    actions: ["Ask GST payable", "Top expenses", "Cash flow"]
  },
  whatsapp: {
    page: "PAGE 13 / 13",
    title: "WhatsApp Hub",
    subtitle: "Templates, auto-rules, debtor-linked messaging.",
    insight: "WhatsApp actions should remain draft-first until sender setup and approvals are complete.",
    actions: ["Payment reminder", "Invoice sent", "Auto-rules"]
  },
  alerts: {
    page: "ALERT CENTER",
    title: "Alerts",
    subtitle: "GST, Tax, Bank, Debtors, Compliance notifications.",
    insight: "Alerts should group danger, warning, info, and success events with unread state.",
    actions: ["Mark all read", "GST alerts", "Debtor alerts"]
  },
  reports: {
    page: "REPORTS",
    title: "Reports",
    subtitle: "Simple live summaries from current ledger data.",
    insight: "Reports are currently connected to live transaction totals.",
    actions: ["Export", "P&L", "Trial balance"]
  },
  audit: {
    page: "AI AUDIT",
    title: "AI Audit",
    subtitle: "Trace of agent proposals, confirmations, and manual writes.",
    insight: "Every AI draft, confirmation, reminder, and manual write is logged.",
    actions: ["Review logs", "Filter AI", "Export audit"]
  }
};

function addBubble(text, type = "agent") {
  const node = document.createElement("div");
  node.className = `bubble ${type}`;
  node.textContent = text;
  els.chatLog.append(node);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function addInsightBubble(text, type = "agent") {
  const node = document.createElement("div");
  node.className = `bubble ${type}`;
  node.textContent = text;
  els.insightChat.append(node);
  els.insightChat.scrollTop = els.insightChat.scrollHeight;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json" },
    ...options
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || "Request failed");
  return body;
}

function totals(data) {
  return data.transactions.reduce(
    (acc, txn) => {
      if (txn.type === "income") acc.income += txn.amount;
      if (txn.type === "expense") acc.expense += txn.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}

function renderRows(container, rows, emptyText, renderRow) {
  container.innerHTML = "";
  if (!rows.length) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }
  rows.forEach((item) => container.append(renderRow(item)));
}

function transactionRow(txn) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <div>
      <div class="row-title">${txn.partyName}</div>
      <div class="muted">${txn.category} | ${txn.paymentMethod}</div>
    </div>
    <div class="amount ${txn.type}">${txn.type === "expense" ? "-" : "+"}${money(txn.amount)}</div>
  `;
  return row;
}

function render() {
  const data = state.data;
  const sum = totals(data);
  const openDrafts = data.drafts.filter((draft) => draft.status !== "confirmed");

  els.income.textContent = money(sum.income);
  els.expense.textContent = money(sum.expense);
  els.net.textContent = money(sum.income - sum.expense);
  els.entryCount.textContent = data.transactions.length;
  if (els.draftCount) els.draftCount.textContent = openDrafts.length;
  els.txnCount.textContent = `${data.transactions.length} entries`;
  els.allTxnCount.textContent = `${data.transactions.length} entries`;
  els.partyCount.textContent = `${data.parties.length} parties`;

  renderRows(els.transactions, data.transactions.slice(0, 6), "No transactions yet.", transactionRow);
  renderRows(els.allTransactions, data.transactions, "No transactions yet.", transactionRow);

  renderRows(els.drafts, openDrafts, "No pending drafts.", (draft) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>
        <div class="row-title">${draft.partyName}</div>
        <div class="muted">${draft.type} | ${draft.category} | confidence ${Math.round(draft.confidence * 100)}%</div>
      </div>
    `;

    const right = document.createElement("div");
    right.className = "actions compact";

    const amount = document.createElement("span");
    amount.className = `amount ${draft.type}`;
    amount.textContent = money(draft.amount);

    const button = document.createElement("button");
    button.className = "btn secondary";
    button.type = "button";
    button.textContent = "Confirm";
    button.addEventListener("click", () => confirmDraft(draft.id));

    right.append(amount, button);
    row.append(right);
    return row;
  });

  renderRows(els.parties, data.parties, "No parties yet.", (party) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>
        <div class="row-title">${party.name}</div>
        <div class="muted">${party.type}</div>
      </div>
      <div class="amount ${party.balance >= 0 ? "income" : "expense"}">${money(party.balance)}</div>
    `;
    return row;
  });

  renderRows(els.reminders, data.reminders, "No reminders yet. Ask the assistant to create one.", (reminder) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML = `
      <div>
        <div class="row-title">${reminder.partyName}</div>
        <div class="muted">${reminder.dueText} | ${reminder.status}</div>
      </div>
      <div class="amount">${money(reminder.amount)}</div>
    `;
    return row;
  });

  els.reports.innerHTML = `
    <div class="report-tile"><span>Gross Income</span><strong>${money(sum.income)}</strong></div>
    <div class="report-tile"><span>Total Expense</span><strong>${money(sum.expense)}</strong></div>
    <div class="report-tile"><span>Net Position</span><strong>${money(sum.income - sum.expense)}</strong></div>
    <div class="report-tile"><span>Open Drafts</span><strong>${openDrafts.length}</strong></div>
    <div class="report-tile"><span>Reminders</span><strong>${data.reminders.length}</strong></div>
    <div class="report-tile"><span>Audit Events</span><strong>${data.auditLogs.length}</strong></div>
  `;

  renderRows(els.auditLogs, data.auditLogs, "No audit events yet.", (log) => {
    const row = document.createElement("div");
    row.className = "row audit-row";
    row.innerHTML = `
      <div>
        <div class="row-title">${log.action}</div>
        <div class="muted">${log.actor} | ${new Date(log.createdAt).toLocaleString()}</div>
      </div>
      <code>${log.details?.id || log.id}</code>
    `;
    return row;
  });
}

async function refresh() {
  state.data = await api("/api/state");
  render();
}

async function sendMessage(message) {
  addBubble(message, "user");
  const result = await api("/api/ai/message", {
    method: "POST",
    body: JSON.stringify({ message })
  });
  addBubble(`${result.agent}: ${result.response}`);
  await refresh();
}

async function sendInsightMessage(message) {
  const moduleName = els.contextModule.textContent;
  addInsightBubble(message, "user");
  const result = await api("/api/ai/message", {
    method: "POST",
    body: JSON.stringify({
      message: `[${moduleName}] ${message}. Current insight: ${els.contextInsight.textContent}`
    })
  });
  addInsightBubble(result.response, "agent");
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(result.response);
    utterance.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  await refresh();
}

async function confirmDraft(draftId) {
  const result = await api("/api/transactions/confirm", {
    method: "POST",
    body: JSON.stringify({ draftId })
  });
  state.data = result.state;
  addBubble("Transaction confirmed and saved to ledger.");
  render();
}

function setView(view) {
  els.navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  els.views.forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.panel !== view);
  });
  const copy = viewCopy[view] || viewCopy.dashboard;
  els.moduleKicker.textContent = copy.page;
  els.pageTitle.textContent = copy.title;
  els.pageSubtitle.textContent = copy.subtitle;
  els.contextModule.textContent = copy.title;
  els.contextInsight.textContent = copy.insight;
  els.contextActions.innerHTML = "";
  copy.actions.forEach((label) => {
    const button = document.createElement("button");
    button.className = "quick-action";
    button.type = "button";
    button.textContent = label;
    els.contextActions.append(button);
  });
}

function openInsight() {
  els.insightOverlay.classList.remove("hidden");
  els.insightOverlay.setAttribute("aria-hidden", "false");
  els.insightMessage.focus();
}

function closeInsight() {
  els.insightOverlay.classList.add("hidden");
  els.insightOverlay.setAttribute("aria-hidden", "true");
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

function speakCurrentInsight() {
  if (!("speechSynthesis" in window)) {
    els.voiceStatus.textContent = "Speech output is not supported in this browser.";
    return;
  }
  const text = `${els.contextModule.textContent}. ${els.contextInsight.textContent}`;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  els.voiceStatus.textContent = "Reading insight aloud.";
}

function startVoiceInput() {
  if (!recognition) {
    els.voiceStatus.textContent = "Voice input is not supported in this browser. Please type your question.";
    return;
  }
  els.voiceStatus.textContent = "Listening...";
  recognition.start();
}

async function createManualTransaction(form) {
  const data = Object.fromEntries(new FormData(form));
  const result = await api("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data)
  });
  state.data = result.state;
  addBubble(`Manual entry saved: ${result.transaction.partyName}, ${money(result.transaction.amount)}.`);
  form.reset();
  render();
}

async function createParty(form) {
  const data = Object.fromEntries(new FormData(form));
  const result = await api("/api/parties", {
    method: "POST",
    body: JSON.stringify(data)
  });
  state.data = result.state;
  addBubble(`Party ready: ${result.party.name}.`);
  form.reset();
  render();
}

els.form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = els.message.value.trim();
  if (!message) return;
  els.message.value = "";
  try {
    await sendMessage(message);
  } catch (error) {
    addBubble(error.message);
  }
});

els.insightBtn.addEventListener("click", () => {
  sendMessage("Show me business summary");
});

els.navButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

els.jumpButtons.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.jump));
});

els.insightToggle.addEventListener("click", openInsight);
els.insightClose.addEventListener("click", closeInsight);
els.insightOverlay.addEventListener("click", (event) => {
  if (event.target === els.insightOverlay) closeInsight();
});

els.speakInsightButton.addEventListener("click", speakCurrentInsight);
els.voiceButton.addEventListener("click", startVoiceInput);

if (recognition) {
  recognition.addEventListener("result", (event) => {
    const transcript = event.results[0][0].transcript;
    els.voiceStatus.textContent = `Heard: ${transcript}`;
    sendInsightMessage(transcript).catch((error) => addInsightBubble(error.message, "agent"));
  });
  recognition.addEventListener("end", () => {
    if (els.voiceStatus.textContent === "Listening...") {
      els.voiceStatus.textContent = "Voice stopped. Try again or type your question.";
    }
  });
  recognition.addEventListener("error", (event) => {
    els.voiceStatus.textContent = `Voice error: ${event.error}. You can type instead.`;
  });
}

els.insightForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = els.insightMessage.value.trim();
  if (!message) return;
  els.insightMessage.value = "";
  try {
    await sendInsightMessage(message);
  } catch (error) {
    addInsightBubble(error.message, "agent");
  }
});

els.insightPrompts.forEach((button) => {
  button.addEventListener("click", () => {
    sendInsightMessage(button.dataset.insightPrompt).catch((error) => addInsightBubble(error.message, "agent"));
  });
});

els.transactionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createManualTransaction(event.currentTarget);
  } catch (error) {
    addBubble(error.message);
  }
});

els.partyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await createParty(event.currentTarget);
  } catch (error) {
    addBubble(error.message);
  }
});

setView("dashboard");
refresh();

const now = () => new Date().toISOString();

const state = {
  parties: [
    { id: "party-1", name: "Sharma ji", type: "customer", balance: 12500 },
    { id: "party-2", name: "Ramesh Traders", type: "vendor", balance: -4200 }
  ],
  transactions: [
    {
      id: "txn-1",
      type: "income",
      partyName: "Sharma ji",
      amount: 12500,
      category: "Sales",
      paymentMethod: "UPI",
      note: "Opening demo receivable",
      createdAt: now()
    }
  ],
  reminders: [],
  drafts: [],
  auditLogs: []
};

function id(prefix) {
  return `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
}

function log(entry) {
  state.auditLogs.unshift({
    id: id("audit"),
    createdAt: now(),
    ...entry
  });
}

export const store = {
  snapshot() {
    return structuredClone(state);
  },

  searchParty(name) {
    const query = String(name || "").toLowerCase();
    return state.parties.find((party) => party.name.toLowerCase().includes(query)) || null;
  },

  createTransactionDraft(input, context) {
    const draft = {
      id: id("draft"),
      status: "needs_confirmation",
      createdAt: now(),
      ...input
    };
    state.drafts.unshift(draft);
    log({
      actor: context.userId,
      action: "draft_transaction_created",
      businessId: context.businessId,
      details: draft
    });
    return draft;
  },

  confirmDraft(draftId) {
    const draft = state.drafts.find((item) => item.id === draftId);
    if (!draft) throw new Error("Draft not found");
    if (draft.status === "confirmed") throw new Error("Draft already confirmed");

    const transaction = {
      id: id("txn"),
      type: draft.type,
      partyName: draft.partyName,
      amount: draft.amount,
      category: draft.category,
      paymentMethod: draft.paymentMethod,
      note: draft.note,
      createdAt: now()
    };
    state.transactions.unshift(transaction);
    draft.status = "confirmed";

    log({
      actor: "demo-user",
      action: "transaction_confirmed",
      businessId: "demo-business",
      details: transaction
    });
    return transaction;
  },

  createTransaction(input, context) {
    const amount = Number(input.amount);
    if (!amount || amount <= 0) throw new Error("Amount must be greater than zero");

    const transaction = {
      id: id("txn"),
      type: input.type === "expense" ? "expense" : "income",
      partyName: input.partyName || "Unassigned",
      amount,
      category: input.category || "General",
      paymentMethod: input.paymentMethod || "Unspecified",
      note: input.note || "Manual entry",
      createdAt: now()
    };

    state.transactions.unshift(transaction);
    log({
      actor: context.userId,
      action: "manual_transaction_created",
      businessId: context.businessId,
      details: transaction
    });
    return transaction;
  },

  createParty(input, context) {
    if (!input.name?.trim()) throw new Error("Party name is required");
    const existing = this.searchParty(input.name);
    if (existing) return existing;

    const party = {
      id: id("party"),
      name: input.name.trim(),
      type: input.type === "vendor" ? "vendor" : "customer",
      balance: Number(input.balance || 0)
    };

    state.parties.unshift(party);
    log({
      actor: context.userId,
      action: "party_created",
      businessId: context.businessId,
      details: party
    });
    return party;
  },

  createReminder(input, context) {
    const reminder = {
      id: id("reminder"),
      status: "scheduled",
      createdAt: now(),
      ...input
    };
    state.reminders.unshift(reminder);
    log({
      actor: context.userId,
      action: "reminder_created",
      businessId: context.businessId,
      details: reminder
    });
    return reminder;
  },

  getBalances() {
    const totals = state.transactions.reduce(
      (acc, txn) => {
        if (txn.type === "income") acc.income += txn.amount;
        if (txn.type === "expense") acc.expense += txn.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
    return {
      ...totals,
      net: totals.income - totals.expense,
      receivables: state.parties.filter((party) => party.balance > 0),
      payables: state.parties.filter((party) => party.balance < 0)
    };
  }
};

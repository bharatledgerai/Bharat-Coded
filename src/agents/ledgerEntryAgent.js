import { tools } from "../services/tools.js";
import { parseMoneyMessage } from "./parsers.js";

export const ledgerEntryAgent = {
  name: "Ledger Entry Agent",

  run(context) {
    const parsed = parseMoneyMessage(context.message);
    const party = parsed.partyName ? tools.searchParty({ name: parsed.partyName }) : null;
    const draft = tools.createTransactionDraft(
      {
        type: parsed.type,
        partyName: party?.name || parsed.partyName || "Unassigned",
        amount: parsed.amount,
        category: parsed.category,
        paymentMethod: parsed.paymentMethod,
        note: context.message,
        confidence: parsed.confidence,
        requiresConfirmation: true
      },
      context
    );

    return {
      response:
        `Maine ek transaction draft banaya hai: ${draft.partyName}, Rs ${draft.amount}, ` +
        `${draft.type}, ${draft.paymentMethod}. Confirm karne par ledger me save ho jayega.`,
      proposedAction: {
        type: "create_transaction",
        draft
      },
      toolCalls: ["searchParty", "createTransactionDraft"]
    };
  }
};

import { tools } from "../services/tools.js";
import { parseMoneyMessage } from "./parsers.js";

export const reminderAgent = {
  name: "Reminder Agent",

  run(context) {
    const parsed = parseMoneyMessage(context.message);
    const party = parsed.partyName ? tools.searchParty({ name: parsed.partyName }) : null;
    const reminder = tools.createReminder(
      {
        partyName: party?.name || parsed.partyName || "Unassigned",
        amount: parsed.amount,
        dueText: parsed.dueText || "soon",
        message: context.message,
        confidence: parsed.confidence
      },
      context
    );

    return {
      response:
        `Reminder ready hai: ${reminder.partyName} se Rs ${reminder.amount} ke liye ${reminder.dueText}.`,
      proposedAction: {
        type: "create_reminder",
        reminder
      },
      toolCalls: ["searchParty", "createReminder"]
    };
  }
};

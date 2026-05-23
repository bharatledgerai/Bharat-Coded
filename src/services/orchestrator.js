import { ledgerEntryAgent } from "../agents/ledgerEntryAgent.js";
import { reminderAgent } from "../agents/reminderAgent.js";
import { insightAgent } from "../agents/insightAgent.js";

function detectIntent(message) {
  const text = message.toLowerCase();
  if (/(remind|reminder|due|follow.?up|कल|याद|देय)/i.test(text)) return "reminder";
  if (/(profit|loss|balance|summary|report|कितना|बैलेंस|हिसाब|रिपोर्ट)/i.test(text)) return "insight";
  return "ledger_entry";
}

const agents = {
  ledger_entry: ledgerEntryAgent,
  reminder: reminderAgent,
  insight: insightAgent
};

export function orchestrate(context) {
  if (!context.message.trim()) {
    throw new Error("Message is required");
  }

  const intent = detectIntent(context.message);
  const agent = agents[intent];
  const result = agent.run(context);

  return {
    intent,
    agent: agent.name,
    language: context.language,
    ...result
  };
}

import { tools } from "../services/tools.js";

export const insightAgent = {
  name: "Business Insight Agent",

  run() {
    const balances = tools.getBalances();
    return {
      response:
        `Abhi total income Rs ${balances.income}, expense Rs ${balances.expense}, ` +
        `aur net Rs ${balances.net} hai. Receivables ${balances.receivables.length}, payables ${balances.payables.length}.`,
      proposedAction: {
        type: "read_insight",
        balances
      },
      toolCalls: ["getBalances"]
    };
  }
};

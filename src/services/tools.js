import { store } from "./store.js";

export const tools = {
  searchParty({ name }) {
    return store.searchParty(name);
  },

  createTransactionDraft(input, context) {
    return store.createTransactionDraft(input, context);
  },

  createReminder(input, context) {
    return store.createReminder(input, context);
  },

  getBalances() {
    return store.getBalances();
  }
};

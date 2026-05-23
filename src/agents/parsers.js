const categoryHints = [
  [/petrol|fuel|diesel|travel|cab|auto/i, "Travel/Fuel"],
  [/rent|kiraya/i, "Rent"],
  [/salary|wages|staff/i, "Salary"],
  [/sale|sales|invoice|becha|बेचा/i, "Sales"],
  [/upi|cash|bank|neft|rtgs|card/i, "General"]
];

function detectAmount(message) {
  const normalized = message.replace(/,/g, "");
  const match = normalized.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d{1,2})?)/i);
  return match ? Number(match[1]) : 0;
}

function detectPaymentMethod(message) {
  if (/upi/i.test(message)) return "UPI";
  if (/cash|नकद/i.test(message)) return "Cash";
  if (/bank|neft|rtgs/i.test(message)) return "Bank";
  if (/card/i.test(message)) return "Card";
  return "Unspecified";
}

function detectType(message) {
  if (/(paid|expense|kharcha|खर्च|gaya|दिया|pay kiya|payment kiya)/i.test(message)) return "expense";
  return "income";
}

function detectCategory(message) {
  const found = categoryHints.find(([pattern]) => pattern.test(message));
  return found ? found[1] : "General";
}

function detectPartyName(message) {
  const beforeMarker = message.match(/^(.+?)\s+(?:se|ko|से|को)\b/i);
  if (beforeMarker) {
    return beforeMarker[1]
      .replace(/₹|rs\.?|inr/gi, "")
      .replace(/\d+(?:,\d{3})*(?:\.\d{1,2})?/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const beforeAmount = message.match(/^(.+?)\s+(?:₹|rs\.?|inr)?\s*\d/i);
  if (beforeAmount) {
    const name = beforeAmount[1]
      .replace(/\b(today|aaj|आज|kal|tomorrow|कल|reminder|add|lagao|laga do|ka|ke|ki|का|के|की)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (name) return name;
  }

  const cleaned = message
    .replace(/₹|rs\.?|inr/gi, "")
    .replace(/\d+(?:,\d{3})*(?:\.\d{1,2})?/g, "")
    .replace(/\b(upi|cash|bank|neft|rtgs|card|paid|received|aaye|aaya|aya|mila|from|to|se|ko|ka|ke|ki|hai|due|kal|tomorrow|reminder|add|lagao|laga|do|expense|income)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").filter(Boolean);
  return words.slice(0, 3).join(" ");
}

function detectDueText(message) {
  if (/kal|tomorrow|कल/i.test(message)) return "tomorrow";
  if (/today|aaj|आज/i.test(message)) return "today";
  const match = message.match(/\b(\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b/);
  return match ? match[1] : null;
}

export function parseMoneyMessage(message) {
  const amount = detectAmount(message);
  return {
    amount,
    type: detectType(message),
    paymentMethod: detectPaymentMethod(message),
    category: detectCategory(message),
    partyName: detectPartyName(message),
    dueText: detectDueText(message),
    confidence: amount > 0 ? 0.78 : 0.45
  };
}

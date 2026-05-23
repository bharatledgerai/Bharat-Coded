# Bharat Ledger

Devanagari-ready accounting dashboard starter with a lightweight agentic backend. The app serves a static frontend and JSON API from a single Node.js server, with an in-memory demo ledger for fast local iteration.

## Current Features

- Tricolor Bharat Ledger UI with Devanagari branding.
- 13-module accounting shell inspired by the reference guide:
  - Dashboard
  - Journal Entries
  - Bank & Cards
  - Traditional Accounts
  - Advance Graphs
  - Payables / AR
  - GST & Compliance
  - Tax Intelligence
  - Expense Analysis
  - Stack Tracker
  - AI Chatbot
  - WhatsApp Hub
  - Alerts
- Persistent right-side context actions and assistant panel.
- AI Insight drawer on every module with:
  - module-aware insight text
  - chat-style follow-up discussion
  - prompt chips
  - browser speech synthesis
  - browser speech recognition where supported
- Agentic backend starter:
  - Orchestrator
  - Ledger Entry Agent
  - Reminder Agent
  - Business Insight Agent
  - Tool layer
  - Audit log
- Manual transaction and party creation.
- AI-created transaction drafts with confirmation before ledger write.
- Demo Bank & Cards view with recent transactions.
- Demo Advance Graphs view with controls, chart, and insight note.

## Tech Stack

- Runtime: Node.js 18+
- Backend: native Node HTTP server
- Frontend: vanilla HTML, CSS, and JavaScript
- Storage: in-memory demo store
- Fonts:
  - Baloo 2
  - Noto Sans
  - JetBrains Mono

No npm dependencies are currently required.

## Run Locally

From the project root:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

## Project Structure

```text
.
├── package.json
├── public
│   ├── index.html
│   ├── app.js
│   └── styles
│       ├── app.css
│       └── fonts.css
├── src
│   ├── server.js
│   ├── agents
│   │   ├── insightAgent.js
│   │   ├── ledgerEntryAgent.js
│   │   ├── parsers.js
│   │   └── reminderAgent.js
│   └── services
│       ├── orchestrator.js
│       ├── store.js
│       └── tools.js
└── Reference_docs
    └── bharat-ledger-feature-guide nn.pdf
```

## Backend API

### `GET /api/health`

Returns service health.

### `GET /api/state`

Returns the current in-memory state:

- parties
- transactions
- reminders
- drafts
- audit logs

### `POST /api/ai/message`

Routes a user message through the agent orchestrator.

Example body:

```json
{
  "message": "Sharma ji se 12500 UPI aaye"
}
```

The orchestrator currently routes to:

- Ledger Entry Agent
- Reminder Agent
- Business Insight Agent

### `POST /api/transactions/confirm`

Confirms an AI-created draft transaction.

Example body:

```json
{
  "draftId": "draft-id"
}
```

### `POST /api/transactions`

Creates a manual transaction.

Example body:

```json
{
  "type": "income",
  "partyName": "Sharma ji",
  "amount": 12500,
  "category": "Sales",
  "paymentMethod": "UPI",
  "note": "Manual entry"
}
```

### `POST /api/parties`

Creates or returns a party.

Example body:

```json
{
  "name": "Ramesh Traders",
  "type": "vendor",
  "balance": -4200
}
```

## Agentic Backend Shape

The current backend follows this flow:

```text
User message
  -> Orchestrator detects intent
  -> Agent handles task
  -> Agent calls tools
  -> Store updates draft/reminder/summary
  -> Audit log records action
  -> API returns structured response
```

Agents do not directly own data mutations. They call tools, and tools call the store. This keeps the design ready for safer validation, permissions, database persistence, and confirmation workflows later.

## Important Notes

- Data is currently stored in memory. Restarting the server resets demo state.
- The app is a starter scaffold, not a production accounting system yet.
- Voice input depends on browser support for `SpeechRecognition` or `webkitSpeechRecognition`.
- Speech output uses browser `speechSynthesis`.
- The security/auth screen from the reference guide is intentionally not implemented yet.

## Suggested Next Steps

- Replace in-memory store with PostgreSQL.
- Add real double-entry journal tables.
- Persist company, FY, GSTIN, accounts, ledgers, and audit logs.
- Add real chart data from ledger state.
- Add GST split logic for CGST/SGST/IGST.
- Add secure auth and company selection.
- Connect AI agents to a real model provider and tool permissions layer.

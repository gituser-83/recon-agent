# ReconAgent

An autonomous, dual-engine financial reconciliation platform designed to ingest standard accounting ledgers and bank statements. The system automatically clears deterministic 1:1 records and utilizes an AI agent to reason through complex edge cases (e.g., batched deposits, gateway fee deductions), outputting an audit-ready exception queue.

## System Architecture

ReconAgent operates on a two-pass reconciliation pipeline to minimize LLM overhead while maximizing accuracy:

- **Phase 1: Zero-Touch Deterministic Engine**
  Utilizes high-speed vectorized filtering via Python's `pandas` to find exact 1:1 matches between the Ledger (`Date`, `Amount`) and the Bank Statement (`Settlement_Date`, `Deposit_Amount`). Cleared records are immediately removed from the active pool.
- **Phase 2: Agentic Matching Engine**
  Unmatched residuals are structured and passed to the Google Gemini API (`gemini-2.5-flash`). The agent handles N:1 batch resolutions, detects implicit fee deductions (e.g., Stripe 2.9%), and generates natural-language reasoning trails for successful matches and distinct hypotheses for failed exceptions.

## Tech Stack

**Frontend (Client-Side)**

- React 19 (TypeScript) via Vite
- Tailwind CSS v4
- Icons: Lucide React & FontAwesome 6.5.2
- Contact Form: Web3Forms
- Hosting: Vercel

**Backend (Server-Side)**

- Python 3.10+ / FastAPI
- Data Processing: Pandas
- AI Orchestration: Google Generative AI SDK
- Hosting: Render

## Environment Variables

**Backend (`.env`)**

```env
GEMINI_API_KEY=your_google_gemini_api_key

```

**Frontend (`.env.local`)**

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

```

## Local Development Setup

### 1. Backend

Navigate to the `backend` directory and set up the Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

```

Start the FastAPI server:

```bash
uvicorn main:app --reload --port 8000

```

### 2. Frontend

Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install

```

Start the Vite development server:

```bash
npm run dev

```

## API Reference

### `POST /api/reconcile`

Ingests source CSV files and returns the fully processed reconciliation state.

**Payload:** `multipart/form-data`

- `ledger`: CSV file (`Transaction_ID, Date, Amount, Customer_Name`)
- `bank`: CSV file (`UTR_Number, Settlement_Date, Deposit_Amount, Description`)

**Response:** `application/json`

```json
{
  "status": "success",
  "metrics": {
    "total_ledger_records": 100,
    "total_bank_records": 95,
    "deterministic_matched_count": 80,
    "deterministic_match_rate": "80.0%"
  },
  "data": {
    "auto_matched": [...],
    "agent_matched": [
      {
        "bank_id": "string",
        "matched_ledger_ids": ["string"],
        "calculated_fee_percentage": 2.9,
        "reasoning": "string"
      }
    ],
    "exceptions": [
      {
        "bank_id": "string",
        "hypothesis": "string"
      }
    ]
  }
}

```

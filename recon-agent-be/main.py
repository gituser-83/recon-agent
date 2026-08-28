from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io

from core.deterministic import run_deterministic_match
from core.agent import run_agentic_match

app = FastAPI(title="ReconAgent Core API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "phase": "3 - Agentic Engine Ready"}

@app.post("/api/reconcile")
async def reconcile_data(
    ledger: UploadFile = File(...),
    bank: UploadFile = File(...)
):
    try:
        ledger_bytes = await ledger.read()
        bank_bytes = await bank.read()
        
        ledger_df = pd.read_csv(io.BytesIO(ledger_bytes))
        bank_df = pd.read_csv(io.BytesIO(bank_bytes))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV files: {str(e)}")

    auto_matched, unmatched_ledger, unmatched_bank = run_deterministic_match(
        ledger_df=ledger_df,
        bank_df=bank_df,
        date_tolerance_days=3
    )

    agent_results = run_agentic_match(
        unmatched_ledger=unmatched_ledger,
        unmatched_bank=unmatched_bank
    )

    total_ledger = len(ledger_df)
    matched_count = len(auto_matched)
    match_rate = round((matched_count / total_ledger) * 100, 2) if total_ledger > 0 else 0

    return {
        "status": "success",
        "metrics": {
            "total_ledger_records": total_ledger,
            "total_bank_records": len(bank_df),
            "deterministic_matched_count": matched_count,
            "deterministic_match_rate": f"{match_rate}%"
        },
        "data": {
            "auto_matched": auto_matched,
            "agent_matched": agent_results.get("agent_matches", []),
            "exceptions": agent_results.get("exceptions", [])
        }
    }
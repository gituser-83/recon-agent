import pandas as pd
from typing import Tuple, List, Dict, Any

def run_deterministic_match(
    ledger_df: pd.DataFrame, 
    bank_df: pd.DataFrame,
    date_tolerance_days: int = 3
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Pass 1: Deterministic Engine
    Matches 1:1 transactions where:
    - Ledger Gross Amount == Bank Deposit Amount
    - Bank Settlement Date is between Ledger Date and Ledger Date + date_tolerance_days
    """
    
    # 1. Clean & Standardize formats
    ledger = ledger_df.copy()
    bank = bank_df.copy()
    
    ledger['Date'] = pd.to_datetime(ledger['Date'])
    bank['Settlement_Date'] = pd.to_datetime(bank['Settlement_Date'])
    
    ledger['Amount'] = ledger['Amount'].astype(float).round(2)
    bank['Deposit_Amount'] = bank['Deposit_Amount'].astype(float).round(2)
    
    # Track matched row indices
    matched_ledger_indices = set()
    matched_bank_indices = set()
    
    auto_matched: List[Dict[str, Any]] = []

    # 2. Iterate and match (deterministic pass)
    for b_idx, bank_row in bank.iterrows():
        b_amount = bank_row['Deposit_Amount']
        b_date = bank_row['Settlement_Date']
        
        # Candidate filter: exact amount + valid settlement window (T to T+tolerance)
        candidates = ledger[
            (~ledger.index.isin(matched_ledger_indices)) &
            (ledger['Amount'] == b_amount) &
            (ledger['Date'] <= b_date) &
            (ledger['Date'] >= b_date - pd.Timedelta(days=date_tolerance_days))
        ]
        
        if not candidates.empty:
            # Pick the closest date match
            l_idx = candidates.index[0]
            ledger_row = ledger.loc[l_idx]
            
            auto_matched.append({
                "match_id": f"AUTO-MATCH-{len(auto_matched) + 1}",
                "bank_utr": str(bank_row.get("UTR_Number", f"UTR-{b_idx}")),
                "ledger_txn_id": str(ledger_row.get("Transaction_ID", f"TXN-{l_idx}")),
                "amount": float(b_amount),
                "ledger_date": ledger_row['Date'].strftime("%Y-%m-%d"),
                "settlement_date": bank_row['Settlement_Date'].strftime("%Y-%m-%d"),
                "match_type": "Deterministic 1:1",
                "status": "RECONCILED"
            })
            
            matched_ledger_indices.add(l_idx)
            matched_bank_indices.add(b_idx)

    # 3. Extract the unmatched residuals for Pass 2 (Agentic Pass)
    unmatched_ledger_df = ledger[~ledger.index.isin(matched_ledger_indices)].copy()
    unmatched_bank_df = bank[~bank.index.isin(matched_bank_indices)].copy()

    # Format dates back to string for JSON serialization
    unmatched_ledger_df['Date'] = unmatched_ledger_df['Date'].dt.strftime("%Y-%m-%d")
    unmatched_bank_df['Settlement_Date'] = unmatched_bank_df['Settlement_Date'].dt.strftime("%Y-%m-%d")

    unmatched_ledger = unmatched_ledger_df.to_dict(orient="records")
    unmatched_bank = unmatched_bank_df.to_dict(orient="records")

    return auto_matched, unmatched_ledger, unmatched_bank
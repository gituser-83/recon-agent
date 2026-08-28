import os
import json
from core.agent import run_agentic_match

def test_agent():
    print("--- Starting Agent Standalone Test ---")
    
    # Mock data representing edge cases:
    # 1. Batched payment: TXN-B1 ($50) + TXN-B2 ($50) + TXN-B3 ($50) = $150 minus 2% fee = $147.00
    # 2. Individual Fee deduction: TXN-105 ($100) minus 2% fee = $98.00
    # 3. Unsolvable Exception: Bank record UTR-UNKNOWN-888 with no matching ledger items
    
    unmatched_ledger = [
        {"Transaction_ID": "TXN-B1", "Date": "2026-08-03", "Amount": 50.00, "Customer_Name": "Alice"},
        {"Transaction_ID": "TXN-B2", "Date": "2026-08-03", "Amount": 50.00, "Customer_Name": "Bob"},
        {"Transaction_ID": "TXN-B3", "Date": "2026-08-03", "Amount": 50.00, "Customer_Name": "Charlie"},
        {"Transaction_ID": "TXN-105", "Date": "2026-08-04", "Amount": 100.00, "Customer_Name": "Dave"},
    ]

    unmatched_bank = [
        {"UTR_Number": "UTR-BATCH-999", "Settlement_Date": "2026-08-05", "Deposit_Amount": 147.00, "Description": "WEEKEND BATCH"},
        {"UTR_Number": "UTR-FEE-201", "Settlement_Date": "2026-08-05", "Deposit_Amount": 98.00, "Description": "RZP SETTLEMENT NET"},
        {"UTR_Number": "UTR-UNKNOWN-888", "Settlement_Date": "2026-08-06", "Deposit_Amount": 341.20, "Description": "UNIDENTIFIED DEPOSIT"}
    ]

    try:
        response = run_agentic_match(unmatched_ledger, unmatched_bank)
        print("\n✅ Agent Output Received Successfully:\n")
        print(json.dumps(response, indent=2))
    except Exception as e:
        print(f"\n❌ Test Failed: {e}")

if __name__ == "__main__":
    test_agent()
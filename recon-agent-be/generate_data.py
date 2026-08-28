import pandas as pd
import random
from datetime import datetime, timedelta

def generate_financial_data(num_records=100):
    start_date = datetime(2026, 8, 1)
    ledger_data = []
    bank_data = []
    
    for i in range(num_records):
        base_date = start_date + timedelta(days=random.randint(0, 7))
        amount = round(random.uniform(10.0, 500.0), 2)
        txn_id = f"TXN-{1000 + i}"
        
        ledger_data.append({
            "Transaction_ID": txn_id,
            "Date": base_date.strftime("%Y-%m-%d"),
            "Amount": amount,
            "Customer_Name": f"Customer_{i}"
        })
        
        scenario = random.random()
        
        if scenario < 0.80:
            # 1:1 Match (Standard T+1 settlement)
            bank_data.append({
                "UTR_Number": f"UTR-{9000 + i}",
                "Settlement_Date": (base_date + timedelta(days=1)).strftime("%Y-%m-%d"),
                "Deposit_Amount": amount,
                "Description": f"SETTLEMENT {txn_id}"
            })
        elif scenario < 0.95:
            # Fee Deduction (2% Gateway Fee)
            net_amount = round(amount * 0.98, 2)
            bank_data.append({
                "UTR_Number": f"UTR-{9000 + i}",
                "Settlement_Date": (base_date + timedelta(days=1)).strftime("%Y-%m-%d"),
                "Deposit_Amount": net_amount,
                "Description": "RZP-SETTLEMENT (NET)"
            })
        else:
            # True Exception (Missing in bank)
            pass 

    # Inject Batched Payment (3 ledger items = 1 bank deposit minus 2% fee)
    batch_date = start_date + timedelta(days=2)
    ledger_data.extend([
        {"Transaction_ID": "TXN-BATCH-1", "Date": batch_date.strftime("%Y-%m-%d"), "Amount": 50.0, "Customer_Name": "Batch_1"},
        {"Transaction_ID": "TXN-BATCH-2", "Date": batch_date.strftime("%Y-%m-%d"), "Amount": 50.0, "Customer_Name": "Batch_2"},
        {"Transaction_ID": "TXN-BATCH-3", "Date": batch_date.strftime("%Y-%m-%d"), "Amount": 50.0, "Customer_Name": "Batch_3"}
    ])
    
    bank_data.append({
        "UTR_Number": "UTR-BATCH-999",
        "Settlement_Date": (batch_date + timedelta(days=2)).strftime("%Y-%m-%d"),
        "Deposit_Amount": 147.00,
        "Description": "WEEKEND-BATCH-SETTLEMENT"
    })

    pd.DataFrame(ledger_data).to_csv("internal_ledger.csv", index=False)
    pd.DataFrame(bank_data).to_csv("bank_statement.csv", index=False)
    print("✅ Generated internal_ledger.csv and bank_statement.csv")

if __name__ == "__main__":
    generate_financial_data()
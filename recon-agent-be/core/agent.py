import os
import json
from dotenv import load_dotenv
from typing import List
from pydantic import BaseModel, Field
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

@tool
def calculate_expression(expression: str) -> str:
    """
    Evaluates a mathematical expression to verify exact match amounts.
    Use this to test combinations, fee deductions, and settlement totals.
    Example: '(50 + 50 + 50) * 0.98'
    """
    try:
        # Safe mathematical evaluation
        result = eval(expression, {"__builtins__": None}, {})
        return f"Result: {round(float(result), 2)}"
    except Exception as e:
        return f"Error calculating: {e}"

class AgentMatch(BaseModel):
    bank_id: str = Field(description="The UTR/ID of the bank deposit record.")
    matched_ledger_ids: List[str] = Field(description="List of Transaction IDs from internal ledger that form this deposit.")
    reasoning: str = Field(description="Step-by-step mathematical explanation of the match, fee deductions, and date alignment.")
    calculated_fee_percentage: float = Field(default=0.0, description="Deducted gateway fee percentage applied (e.g., 2.0).")

class ExceptionItem(BaseModel):
    bank_id: str = Field(description="The UTR/ID of the unmatched bank deposit or issue record.")
    hypothesis: str = Field(description="Partial diagnostic theory explaining why this record could not be matched with 100% precision.")

class ReconOutput(BaseModel):
    agent_matches: List[AgentMatch]
    exceptions: List[ExceptionItem]

def run_agentic_match(unmatched_ledger: List[dict], unmatched_bank: List[dict]) -> dict:
    """
    Pass 2: Agentic Reasoning Pass
    Takes unresolved residuals from the deterministic engine, reasons over
    complex multi-transaction batches and fee deductions, verifies math via tool,
    and returns verified matches and an honest exception list.
    """
    if not unmatched_ledger or not unmatched_bank:
        return {"agent_matches": [], "exceptions": []}

    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is missing. Check your .env file.")

    # Initialize Gemini 3.6 Flash
    llm = ChatGoogleGenerativeAI(
        model="gemini-3.6-flash",
        temperature=0.0,
        google_api_key=api_key,
    )

    # Bind tools to the model
    llm_with_tools = llm.bind_tools([calculate_expression])

    prompt = ChatPromptTemplate.from_messages([
        ("system", """You are an elite, hyper-strict Financial Controller reconciling complex unmatched transactions.

RULES & BOUNDARIES:
1. ZERO MENTAL MATH: Large language models are prone to arithmetic errors. You MUST use the `calculate_expression` tool to verify your calculations before confirming any match.
2. THE RECON EQUATION: (Sum of matched Ledger Entries) - (Gateway Fee) = (Bank Deposit Amount).
3. FEE BOUNDARIES: Payment gateway fees typically range from 1.5% to 3.0%. Test deductions within this range.
4. BATCH SETTLEMENTS: Multiple ledger transactions (especially across weekend dates) can merge into a single bank settlement.
5. HONEST EXCEPTION LIST: If you cannot mathematically verify an exact match down to 2 decimal places using your tool, DO NOT force a match. Flag the record in `exceptions` with your hypothesis.

Always return data strictly adhering to the specified schema.
"""),
        ("user", "Unmatched Ledger Records:\n{ledger}\n\nUnmatched Bank Records:\n{bank}")
    ])

    structured_llm = llm_with_tools.with_structured_output(ReconOutput)
    chain = prompt | structured_llm

    print("🤖 Gemini Agent analyzing unmatched edge cases...")
    result = chain.invoke({
        "ledger": json.dumps(unmatched_ledger, indent=2),
        "bank": json.dumps(unmatched_bank, indent=2)
    })

    if isinstance(result, ReconOutput):
        return result.model_dump()
    elif isinstance(result, dict):
        return result
    else:
        return {"agent_matches": [], "exceptions": []}
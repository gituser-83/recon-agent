export interface ReconException {
  id: string;
  description: string;
  amount: number;
  severity: "high" | "medium" | "low";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
}

export interface ReconcileResponse {
  totalRecords: number;
  zeroTouchCount: number;
  aiMatchesCount: number;
  exceptionsCount: number;
  exceptions: ReconException[];
  auditTrail: AuditLog[];
}

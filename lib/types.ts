export type Severity = "critical" | "high" | "medium" | "low";

export type RiskLevel = "critical" | "high" | "medium" | "low" | "minimal";

export type AgentStatus = "active" | "idle" | "degraded" | "offline";

export type AgentId =
  | "regulation-intelligence"
  | "contract-intelligence"
  | "investment-compliance"
  | "real-time-monitoring"
  | "risk-prediction"
  | "policy-intelligence"
  | "audit";

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  uptime: number;
  tasksToday: number;
  tasksTotal: number;
  accuracy: number;
  avgResponseTimeMs: number;
  lastActivity: string;
  model: string;
  recentActions: AgentAction[];
}

export interface AgentAction {
  id: string;
  timestamp: string;
  summary: string;
  target: string;
  outcome: "info" | "success" | "warning" | "danger";
}

export type RegulationStatus = "processed" | "processing" | "needs-review" | "failed";

export interface Regulation {
  id: string;
  title: string;
  jurisdiction: string;
  regulator: string;
  category: string;
  sourceType: "pdf" | "word" | "url";
  status: RegulationStatus;
  uploadedAt: string;
  effectiveDate: string;
  version: string;
  articles: number;
  obligations: RegulationObligation[];
  restrictions: string[];
  deadlines: { label: string; date: string }[];
  summary: string;
  linkedRulesGenerated: number;
}

export interface RegulationObligation {
  id: string;
  article: string;
  text: string;
  type: "obligation" | "restriction" | "reporting" | "disclosure";
  appliesTo: string[];
}

export type ContractStatus = "under-review" | "approved" | "flagged" | "rejected" | "expired";

export interface Contract {
  id: string;
  name: string;
  counterparty: string;
  type: string;
  status: ContractStatus;
  uploadedAt: string;
  value: number;
  currency: string;
  expiryDate: string;
  riskScore: number;
  summary: string;
  obligations: string[];
  missingClauses: string[];
  riskyTerms: { clause: string; issue: string; severity: Severity }[];
  regulatoryConflicts: { regulation: string; description: string; severity: Severity }[];
  recommendations: string[];
}

export type InvestmentDecision = "approved" | "rejected" | "needs-changes" | "pending";

export interface InvestmentCheck {
  label: string;
  status: "pass" | "fail" | "warning";
  detail: string;
}

export interface Investment {
  id: string;
  name: string;
  fund: string;
  assetClass: string;
  requestedBy: string;
  requestedAt: string;
  amount: number;
  currency: string;
  decision: InvestmentDecision;
  riskScore: number;
  confidence: number;
  checks: InvestmentCheck[];
  explanation: string;
  recommendations: string[];
}

export interface Fund {
  id: string;
  name: string;
  manager: string;
  strategy: string;
  aum: number;
  currency: string;
  exposureLimit: number;
  currentExposure: number;
  complianceScore: number;
  status: "compliant" | "warning" | "breach";
  inceptionDate: string;
}

export type PolicyStatus = "active" | "draft" | "outdated" | "under-revision";

export interface Policy {
  id: string;
  title: string;
  category: string;
  owner: string;
  status: PolicyStatus;
  lastReviewed: string;
  version: string;
  rulesGenerated: number;
  inconsistencies: string[];
  recommendation?: string;
}

export interface Risk {
  id: string;
  title: string;
  category: string;
  level: RiskLevel;
  probability: number;
  businessImpact: number;
  financialImpact: number;
  complianceImpact: number;
  relatedEntity: string;
  detectedAt: string;
  recommendation: string;
  status: "open" | "mitigated" | "monitoring";
}

export interface Violation {
  id: string;
  title: string;
  regulation: string;
  severity: Severity;
  entity: string;
  entityType: "contract" | "investment" | "transaction" | "policy" | "fund";
  detectedAt: string;
  status: "open" | "resolved" | "in-progress" | "escalated";
  description: string;
  financialExposure: number;
  currency: string;
  assignedTo: string;
}

export type AlertChannel = "email" | "sms" | "teams" | "slack";

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  source: string;
  channels: AlertChannel[];
  acknowledged: boolean;
  relatedEntity?: string;
}

export interface MonitoringEvent {
  id: string;
  timestamp: string;
  type: "transaction" | "approval" | "workflow" | "fund-movement" | "login" | "system";
  description: string;
  entity: string;
  status: "normal" | "flagged" | "blocked";
  riskScore: number;
}

export type ReportType = "compliance" | "audit" | "executive" | "board" | "regulatory";

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  format: "pdf" | "excel" | "pptx";
  generatedAt: string;
  generatedBy: string;
  period: string;
  sizeKb: number;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: "user" | "agent" | "system";
  action: string;
  entity: string;
  entityType: string;
  outcome: "success" | "failure";
  evidenceRef: string;
}

export type UserRole =
  | "super-admin"
  | "compliance-officer"
  | "risk-manager"
  | "auditor"
  | "investment-manager"
  | "executive"
  | "regulator";

export interface OrgUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  status: "active" | "invited" | "suspended";
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface KpiTrendPoint {
  date: string;
  value: number;
}

// Task Management
export type TaskStatus = "open" | "in-progress" | "completed" | "overdue";
export type TaskPriority = "critical" | "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  category: string;
  relatedEntity?: string;
  tags: string[];
}

// Compliance Calendar
export type EventType = "deadline" | "submission" | "review" | "audit" | "board-meeting" | "training";
export type EventStatus = "upcoming" | "overdue" | "completed" | "in-progress";

export interface ComplianceEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  time?: string;
  regulator?: string;
  regulation?: string;
  assignedTo: string;
  status: EventStatus;
  priority: Severity;
}

// Regulatory Requests
export type RegulatoryRequestStatus = "draft" | "submitted" | "acknowledged" | "responded" | "closed" | "overdue";
export type RegulatoryRequestDirection = "incoming" | "outgoing";

export interface RegulatoryRequest {
  id: string;
  reference: string;
  title: string;
  regulator: string;
  direction: RegulatoryRequestDirection;
  type: string;
  status: RegulatoryRequestStatus;
  receivedAt: string;
  dueDate: string;
  assignedTo: string;
  description: string;
  priority: Severity;
  documents: string[];
}

// Knowledge Base
export type KnowledgeSource = "CMA" | "SAMA" | "FSDP" | "Saudi Exchange" | "Fintech Saudi" | "Internal";

export interface KnowledgeArticle {
  id: string;
  title: string;
  source: KnowledgeSource;
  sourceUrl?: string;
  category: string;
  indexed: boolean;
  indexedAt: string;
  lastUpdated: string;
  chunks: number;
  relevanceScore: number;
  summary: string;
  tags: string[];
}

// Workflow Engine
export type WorkflowStatus = "running" | "completed" | "failed" | "pending" | "paused";

export interface WorkflowStep {
  id: string;
  name: string;
  status: "completed" | "running" | "pending" | "failed";
  agentId?: AgentId;
  output?: string;
  durationSec?: number;
}

export interface WorkflowInstance {
  id: string;
  name: string;
  type: string;
  status: WorkflowStatus;
  triggeredBy: string;
  triggeredAt: string;
  completedAt?: string;
  durationSec?: number;
  steps: WorkflowStep[];
  entityRef: string;
  agentsInvolved: AgentId[];
}

// Compliance Notes
export interface ComplianceNote {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  relatedEntity?: string;
  pinned: boolean;
}

export interface DocumentTemplateField {
  id: string
  label: string
  type: "text" | "textarea" | "date"
  placeholder: string
  required?: boolean
}

export interface DocumentTemplateDefinition {
  id: string
  name: string
  description: string
  purpose: string
  draftingNotes: string
  fields: DocumentTemplateField[]
}

export const documentTemplates: DocumentTemplateDefinition[] = [
  {
    id: "police-complaint",
    name: "FIR / police complaint",
    description: "For reporting a cognizable incident or requesting police action in clear chronological language.",
    purpose: "Record an incident, identify the people involved, preserve the timeline, and request registration or formal action.",
    draftingNotes:
      "State who, what, when, where, and what evidence exists. Ask for registration and appropriate action. Avoid exaggeration, conclusions, or unsupported allegations.",
    fields: [
      { id: "complainantName", label: "Your full name", type: "text", placeholder: "Aarav Sharma", required: true },
      { id: "address", label: "Your address", type: "text", placeholder: "Full residential address", required: true },
      { id: "phone", label: "Phone number", type: "text", placeholder: "+91...", required: true },
      { id: "policeStation", label: "Police station", type: "text", placeholder: "Name of the police station", required: true },
      { id: "incidentDate", label: "Incident date", type: "date", placeholder: "", required: true },
      { id: "incidentLocation", label: "Incident location", type: "text", placeholder: "Where the incident happened", required: true },
      { id: "accusedDetails", label: "People involved / accused details", type: "textarea", placeholder: "Names, phone numbers, addresses, or identifying details if known" },
      { id: "incidentDetails", label: "Incident details", type: "textarea", placeholder: "Chronological description of events", required: true },
      { id: "evidenceAvailable", label: "Evidence available", type: "textarea", placeholder: "Screenshots, CCTV, chats, call logs, witnesses, bills, medical papers" },
      { id: "requestedAction", label: "Action requested", type: "textarea", placeholder: "What action do you want taken?" }
    ]
  },
  {
    "id": "legal-notice",
    "name": "Legal notice",
    "description": "For setting out a dispute, the remedy sought, and a response deadline.",
    "purpose": "Create a clear formal notice before escalation or litigation.",
    "draftingNotes": "Identify sender and recipient accurately, describe the dispute with dates and documents, and state the demand and deadline clearly.",
    "fields": [
      { "id": "senderName", "label": "Sender name", "type": "text", "placeholder": "Your name", "required": true },
      { "id": "senderAddress", "label": "Sender address", "type": "text", "placeholder": "Full address", "required": true },
      { "id": "recipientName", "label": "Recipient name", "type": "text", "placeholder": "Person or business name", "required": true },
      { "id": "recipientAddress", "label": "Recipient address", "type": "text", "placeholder": "Full address", "required": true },
      { "id": "subject", "label": "Subject", "type": "text", "placeholder": "Short issue summary", "required": true },
      { "id": "facts", "label": "Facts of the dispute", "type": "textarea", "placeholder": "Chronological facts and prior communication", "required": true },
      { "id": "demand", "label": "Demand or remedy", "type": "textarea", "placeholder": "Refund, payment, stop conduct, etc.", "required": true },
      { "id": "deadline", "label": "Response deadline", "type": "text", "placeholder": "7 days / 15 days", "required": true }
    ]
  },
  {
    "id": "rti-request",
    "name": "RTI request",
    "description": "For asking a public authority for specific records under RTI.",
    "purpose": "Request identifiable records from a public authority in a narrow, trackable format.",
    "draftingNotes": "Ask for existing records, not explanations. Narrow the request by period, office, and subject matter.",
    "fields": [
      { "id": "applicantName", "label": "Applicant name", "type": "text", "placeholder": "Your full name", "required": true },
      { "id": "applicantAddress", "label": "Applicant address", "type": "text", "placeholder": "Full postal address", "required": true },
      { "id": "publicAuthority", "label": "Public authority", "type": "text", "placeholder": "Department or office name", "required": true },
      { "id": "recordRequest", "label": "Records requested", "type": "textarea", "placeholder": "Specific records, dates, file numbers, or decisions", "required": true },
      { "id": "timePeriod", "label": "Relevant period", "type": "text", "placeholder": "From April 2024 to December 2024" }
    ]
  },
  {
    "id": "workplace-complaint",
    "name": "Workplace harassment complaint",
    "description": "For reporting repeated harassment or unsafe conduct at work.",
    "purpose": "Create a clear factual complaint to HR, an Internal Committee, or management.",
    "draftingNotes": "Describe incidents with dates, witnesses, and documentary proof. Request acknowledgment and a safe process. Avoid emotional overstatement.",
    "fields": [
      { "id": "employeeName", "label": "Your name", "type": "text", "placeholder": "Your full name", "required": true },
      { "id": "designation", "label": "Your role", "type": "text", "placeholder": "Job title", "required": true },
      { "id": "organization", "label": "Organization", "type": "text", "placeholder": "Company or institution name", "required": true },
      { "id": "respondentName", "label": "Person complained against", "type": "text", "placeholder": "Name and role", "required": true },
      { "id": "incidentTimeline", "label": "Incident timeline", "type": "textarea", "placeholder": "Dates, places, conduct, and witnesses", "required": true },
      { "id": "impact", "label": "Impact on you", "type": "textarea", "placeholder": "Safety, work, mental health, retaliation, etc." },
      { "id": "request", "label": "Relief requested", "type": "textarea", "placeholder": "Inquiry, protection, transfer, no-contact direction, etc.", "required": true }
    ]
  }
]

export function getDocumentTemplate(templateId: string) {
  return documentTemplates.find((template) => template.id === templateId) ?? null
}

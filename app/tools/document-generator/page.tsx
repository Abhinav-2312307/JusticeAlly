"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, Check, FileText, Loader2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DocumentGenerator() {
  const [documentType, setDocumentType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [generatedDocument, setGeneratedDocument] = useState("")
  const [templateDocument, setTemplateDocument] = useState("")
  const [showTemplate, setShowTemplate] = useState(false)
  const { toast } = useToast()

  // Show template when document type changes
  useEffect(() => {
    if (documentType) {
      const template = generateTemplateContent(documentType)
      setTemplateDocument(template)
      setShowTemplate(true)
    } else {
      setShowTemplate(false)
    }
  }, [documentType])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateDocument = async () => {
    // Validate required fields
    const requiredFields = getRequiredFields(documentType)
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // First generate the basic document with user inputs
    const basicDocument = generateDocumentContent(documentType, formData)
    setGeneratedDocument(basicDocument)

    // Then enhance it with AI
    try {
      setIsEnhancing(true)
      const enhancedDocument = await enhanceDocumentWithAI(documentType, formData, basicDocument)
      setGeneratedDocument(enhancedDocument)
      setHasResult(true)
    } catch (error) {
      console.error("Error enhancing document:", error)
      toast({
        title: "Enhancement failed",
        description: "Could not enhance the document with AI. Using basic template instead.",
        variant: "warning",
      })
      // Still show the basic document if enhancement fails
      setHasResult(true)
    } finally {
      setIsEnhancing(false)
      setIsGenerating(false)
    }
  }

  const enhanceDocumentWithAI = async (type: string, data: Record<string, string>, basicDocument: string) => {
    // Create a prompt based on document type
    let prompt = ""
    switch (type) {
      case "police-complaint":
        prompt = `Generate a detailed police complaint based on the following information:
Name: ${data.name || "Not provided"}
Address: ${data.address || "Not provided"}
Incident Date: ${data.incidentDate || "Not provided"}
Incident Location: ${data.incidentLocation || "Not provided"}
Subject: ${data.complaintSubject || "Not provided"}
Details: ${data.complaintDetails || "Not provided"}

Please create a formal, detailed police complaint that includes all relevant legal terminology and follows the proper format. Expand on the details provided to make it comprehensive and legally sound.`
        break
      case "legal-notice":
        prompt = `Generate a detailed legal notice based on the following information:
Sender: ${data.senderName || "Not provided"} at ${data.senderAddress || "Not provided"}
Recipient: ${data.recipientName || "Not provided"} at ${data.recipientAddress || "Not provided"}
Subject: ${data.subject || "Not provided"}
Notice Details: ${data.noticeDetails || "Not provided"}
Demands: ${data.demandDetails || "Not provided"}
Response Deadline: ${data.responseDeadline || "Not provided"} days

Please create a formal, detailed legal notice that includes all relevant legal terminology and follows the proper format. Expand on the details provided to make it comprehensive and legally sound.`
        break
      case "rti":
        prompt = `Generate a detailed RTI application based on the following information:
Applicant: ${data.applicantName || "Not provided"} at ${data.applicantAddress || "Not provided"}
Public Authority: ${data.publicAuthority || "Not provided"}
Information Requested: ${data.requestDetails || "Not provided"}
Time Period: ${data.requestPeriod || "Not provided"}

Please create a formal, detailed RTI application that includes all relevant legal terminology and follows the proper format. Expand on the details provided to make it comprehensive and legally sound.`
        break
      case "affidavit":
        prompt = `Generate a detailed affidavit based on the following information:
Deponent: ${data.deponentName || "Not provided"}, aged ${data.deponentAge || "Not provided"} at ${data.deponentAddress || "Not provided"}
Purpose: ${data.affidavitPurpose || "Not provided"}
Statements: ${data.affidavitStatements || "Not provided"}

Please create a formal, detailed affidavit that includes all relevant legal terminology and follows the proper format. Expand on the details provided to make it comprehensive and legally sound.`
        break
      default:
        return basicDocument
    }

    // Call the API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to enhance document")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error calling AI API:", error)
      throw error
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleViewTemplate = () => {
    setShowTemplate(true)
  }

  const getRequiredFields = (type: string): string[] => {
    switch (type) {
      case "police-complaint":
        return [
          "name",
          "address",
          "phone",
          "email",
          "policeStation",
          "incidentDate",
          "incidentLocation",
          "complaintDetails",
        ]
      case "legal-notice":
        return [
          "senderName",
          "senderAddress",
          "recipientName",
          "recipientAddress",
          "subject",
          "noticeDetails",
          "demandDetails",
          "responseDeadline",
        ]
      case "rti":
        return [
          "applicantName",
          "applicantAddress",
          "applicantPhone",
          "publicAuthority",
          "requestDetails",
          "requestPeriod",
        ]
      case "affidavit":
        return ["deponentName", "deponentAddress", "deponentAge", "affidavitPurpose", "affidavitStatements"]
      default:
        return []
    }
  }

  const generateTemplateContent = (type: string): string => {
    switch (type) {
      case "police-complaint":
        return `
POLICE COMPLAINT

To,
The Station House Officer,
[Police Station Name]
[City, State]

Date: [Current Date]

Subject: Complaint regarding [Subject of Complaint]

Respected Sir/Madam,

I, [Your Name], resident of [Your Address], would like to report an incident that occurred on [Date of Incident] at [Location of Incident].

[Detailed description of the incident including what happened, who was involved, and any evidence or witnesses]

I request you to register an FIR regarding this matter and take appropriate action as per the law. I am ready to cooperate with the investigation and provide any additional information that may be required.

Yours faithfully,

[Your Name]
Contact: [Your Phone Number]
Email: [Your Email Address]
`
      case "legal-notice":
        return `
LEGAL NOTICE

Date: [Current Date]

To,
[Recipient Name]
[Recipient Address]

Subject: [Subject of the Notice]

Dear Sir/Madam,

Under instructions from and on behalf of my client, [Sender Name], residing at [Sender Address], I hereby serve you with the following legal notice:

[Detailed description of the issue, including relevant facts, dates, and circumstances]

In view of the above, my client hereby demands:

[Specific demands or actions required from the recipient]

You are hereby called upon to comply with the above demands within [number of days] days from the receipt of this notice, failing which my client will be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, at your risk, cost, and consequences.

This notice is being issued without prejudice to any other rights and remedies available to my client under the law.

Yours sincerely,

[Advocate Name]
Advocate for [Sender Name]
`
      case "rti":
        return `
RIGHT TO INFORMATION APPLICATION
(Under Section 6(1) of the Right to Information Act, 2005)

Date: [Current Date]

To,
The Public Information Officer
[Name of the Public Authority]
[Address of the Public Authority]

Subject: Request for information under RTI Act, 2005

Sir/Madam,

I, [Applicant Name], resident of [Applicant Address], would like to seek the following information under the Right to Information Act, 2005:

[Clearly specify the information being sought]

The information pertains to the period: [Specify the time period for which information is sought]

I am hereby paying the application fee of Rs. 10/- by [mode of payment].

I belong to [BPL/APL] category. (If BPL, attach proof)

I assure that the information obtained will be used for personal purposes only.

Yours faithfully,

[Applicant Name]
Phone: [Phone Number]
`
      case "affidavit":
        return `
AFFIDAVIT

I, [Deponent Name], son/daughter/wife of [Father's/Husband's Name], aged [Age] years, resident of [Address], do hereby solemnly affirm and declare as under:

1. That I am the deponent of this affidavit and am fully competent to swear the same.

2. That this affidavit is being submitted for the purpose of [Purpose of the Affidavit].

3. [Statement 1]

4. [Statement 2]

5. [Statement 3]

I solemnly affirm that the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

Verified at [Place] on this [Day] of [Month], [Year].

DEPONENT

VERIFICATION:
Verified at [Place] on this [Day] of [Month], [Year] that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

DEPONENT
`
      default:
        return "Document template not available."
    }
  }

  const generateDocumentContent = (type: string, data: Record<string, string>): string => {
    const currentDate = new Date().toLocaleDateString()

    switch (type) {
      case "police-complaint":
        return `
POLICE COMPLAINT

To,
The Station House Officer,
${data.policeStation || "[Police Station Name]"}
[City, State]

Date: ${currentDate}

Subject: Complaint regarding ${data.complaintSubject || "incident/crime"}

Respected Sir/Madam,

I, ${data.name || "[Your Name]"}, resident of ${data.address || "[Your Address]"}, would like to report an incident that occurred on ${data.incidentDate || "[Date of Incident]"} at ${data.incidentLocation || "[Location of Incident]"}.

${data.complaintDetails || "[Detailed description of the incident including what happened, who was involved, and any evidence or witnesses]"}

I request you to register an FIR regarding this matter and take appropriate action as per the law. I am ready to cooperate with the investigation and provide any additional information that may be required.

Yours faithfully,

${data.name || "[Your Name]"}
Contact: ${data.phone || "[Your Phone Number]"}
Email: ${data.email || "[Your Email Address]"}
`
      case "legal-notice":
        return `
LEGAL NOTICE

Date: ${currentDate}

To,
${data.recipientName || "[Recipient Name]"}
${data.recipientAddress || "[Recipient Address]"}

Subject: ${data.subject || "[Subject of the Notice]"}

Dear Sir/Madam,

Under instructions from and on behalf of my client, ${data.senderName || "[Sender Name]"}, residing at ${data.senderAddress || "[Sender Address]"}, I hereby serve you with the following legal notice:

${data.noticeDetails || "[Detailed description of the issue, including relevant facts, dates, and circumstances]"}

In view of the above, my client hereby demands:

${data.demandDetails || "[Specific demands or actions required from the recipient]"}

You are hereby called upon to comply with the above demands within ${data.responseDeadline || "[number of days]"} days from the receipt of this notice, failing which my client will be constrained to initiate appropriate legal proceedings against you, civil and/or criminal, at your risk, cost, and consequences.

This notice is being issued without prejudice to any other rights and remedies available to my client under the law.

Yours sincerely,

[Advocate Name]
Advocate for ${data.senderName || "[Sender Name]"}
`
      case "rti":
        return `
RIGHT TO INFORMATION APPLICATION
(Under Section 6(1) of the Right to Information Act, 2005)

Date: ${currentDate}

To,
The Public Information Officer
${data.publicAuthority || "[Name of the Public Authority]"}
[Address of the Public Authority]

Subject: Request for information under RTI Act, 2005

Sir/Madam,

I, ${data.applicantName || "[Applicant Name]"}, resident of ${data.applicantAddress || "[Applicant Address]"}, would like to seek the following information under the Right to Information Act, 2005:

${data.requestDetails || "[Clearly specify the information being sought]"}

The information pertains to the period: ${data.requestPeriod || "[Specify the time period for which information is sought]"}

I am hereby paying the application fee of Rs. 10/- by ${data.paymentMode || "[mode of payment]"}.

I belong to ${data.category === "bpl" ? "BPL" : "APL"} category. ${data.category === "bpl" ? "(Proof attached)" : ""}

I assure that the information obtained will be used for personal purposes only.

Yours faithfully,

${data.applicantName || "[Applicant Name]"}
Phone: ${data.applicantPhone || "[Phone Number]"}
`
      case "affidavit":
        return `
AFFIDAVIT

I, ${data.deponentName || "[Deponent Name]"}, son/daughter/wife of ${data.relationName || "[Father's/Husband's Name]"}, aged ${data.deponentAge || "[Age]"} years, resident of ${data.deponentAddress || "[Address]"}, do hereby solemnly affirm and declare as under:

1. That I am the deponent of this affidavit and am fully competent to swear the same.

2. That this affidavit is being submitted for the purpose of ${data.affidavitPurpose || "[Purpose of the Affidavit]"}.

${data.affidavitStatements || "3. [Statement 1]\n\n4. [Statement 2]\n\n5. [Statement 3]"}

I solemnly affirm that the contents of this affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

Verified at [Place] on this ${new Date().getDate()} day of ${new Date().toLocaleString("default", { month: "long" })}, ${new Date().getFullYear()}.

DEPONENT

VERIFICATION:
Verified at [Place] on this ${new Date().getDate()} day of ${new Date().toLocaleString("default", { month: "long" })}, ${new Date().getFullYear()} that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

DEPONENT
`
      default:
        return "Document content not available."
    }
  }

  const renderFormFields = () => {
    switch (documentType) {
      case "police-complaint":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Your Address</Label>
                <Input
                  id="address"
                  placeholder="Enter your address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="police-station">Police Station</Label>
              <Input
                id="police-station"
                placeholder="Enter the police station name"
                value={formData.policeStation || ""}
                onChange={(e) => handleInputChange("policeStation", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incident-date">Date of Incident</Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={formData.incidentDate || ""}
                  onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incident-location">Location of Incident</Label>
                <Input
                  id="incident-location"
                  placeholder="Enter where the incident occurred"
                  value={formData.incidentLocation || ""}
                  onChange={(e) => handleInputChange("incidentLocation", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint-subject">Subject of Complaint</Label>
              <Input
                id="complaint-subject"
                placeholder="E.g., theft, assault, property damage"
                value={formData.complaintSubject || ""}
                onChange={(e) => handleInputChange("complaintSubject", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complaint-details">Complaint Details</Label>
              <Textarea
                id="complaint-details"
                placeholder="Describe the incident in detail..."
                className="min-h-[150px]"
                value={formData.complaintDetails || ""}
                onChange={(e) => handleInputChange("complaintDetails", e.target.value)}
              />
            </div>
          </div>
        )
      case "legal-notice":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender's Name</Label>
                <Input
                  id="sender-name"
                  placeholder="Enter sender's full name"
                  value={formData.senderName || ""}
                  onChange={(e) => handleInputChange("senderName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-address">Sender's Address</Label>
                <Input
                  id="sender-address"
                  placeholder="Enter sender's address"
                  value={formData.senderAddress || ""}
                  onChange={(e) => handleInputChange("senderAddress", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient-name">Recipient's Name</Label>
                <Input
                  id="recipient-name"
                  placeholder="Enter recipient's full name"
                  value={formData.recipientName || ""}
                  onChange={(e) => handleInputChange("recipientName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipient-address">Recipient's Address</Label>
                <Input
                  id="recipient-address"
                  placeholder="Enter recipient's address"
                  value={formData.recipientAddress || ""}
                  onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject of Notice</Label>
              <Input
                id="subject"
                placeholder="E.g., Notice for payment of dues, Notice for breach of contract"
                value={formData.subject || ""}
                onChange={(e) => handleInputChange("subject", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notice-details">Notice Details</Label>
              <Textarea
                id="notice-details"
                placeholder="Describe the issue in detail, including relevant facts, dates, and circumstances..."
                className="min-h-[100px]"
                value={formData.noticeDetails || ""}
                onChange={(e) => handleInputChange("noticeDetails", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="demand-details">Demand Details</Label>
              <Textarea
                id="demand-details"
                placeholder="Specify what actions you want the recipient to take..."
                className="min-h-[100px]"
                value={formData.demandDetails || ""}
                onChange={(e) => handleInputChange("demandDetails", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="response-deadline">Response Deadline (in days)</Label>
              <Input
                id="response-deadline"
                placeholder="E.g., 15, 30"
                value={formData.responseDeadline || ""}
                onChange={(e) => handleInputChange("responseDeadline", e.target.value)}
              />
            </div>
          </div>
        )
      case "rti":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicant-name">Applicant's Name</Label>
                <Input
                  id="applicant-name"
                  placeholder="Enter your full name"
                  value={formData.applicantName || ""}
                  onChange={(e) => handleInputChange("applicantName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicant-address">Applicant's Address</Label>
                <Input
                  id="applicant-address"
                  placeholder="Enter your address"
                  value={formData.applicantAddress || ""}
                  onChange={(e) => handleInputChange("applicantAddress", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant-phone">Phone Number</Label>
              <Input
                id="applicant-phone"
                placeholder="Enter your phone number"
                value={formData.applicantPhone || ""}
                onChange={(e) => handleInputChange("applicantPhone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="public-authority">Public Authority</Label>
              <Input
                id="public-authority"
                placeholder="Enter the name of the public authority"
                value={formData.publicAuthority || ""}
                onChange={(e) => handleInputChange("publicAuthority", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-details">Information Requested</Label>
              <Textarea
                id="request-details"
                placeholder="Clearly specify the information you are seeking..."
                className="min-h-[150px]"
                value={formData.requestDetails || ""}
                onChange={(e) => handleInputChange("requestDetails", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-period">Time Period for Information</Label>
              <Input
                id="request-period"
                placeholder="E.g., January 2020 to December 2020"
                value={formData.requestPeriod || ""}
                onChange={(e) => handleInputChange("requestPeriod", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-mode">Mode of Payment</Label>
              <Select
                onValueChange={(value) => handleInputChange("paymentMode", value)}
                defaultValue={formData.paymentMode || "postal-order"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postal-order">Postal Order</SelectItem>
                  <SelectItem value="court-fee">Court Fee Stamp</SelectItem>
                  <SelectItem value="demand-draft">Demand Draft</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => handleInputChange("category", value)}
                defaultValue={formData.category || "apl"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apl">Above Poverty Line (APL)</SelectItem>
                  <SelectItem value="bpl">Below Poverty Line (BPL)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      case "affidavit":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deponent-name">Deponent's Name</Label>
                <Input
                  id="deponent-name"
                  placeholder="Enter your full name"
                  value={formData.deponentName || ""}
                  onChange={(e) => handleInputChange("deponentName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deponent-age">Deponent's Age</Label>
                <Input
                  id="deponent-age"
                  placeholder="Enter your age"
                  value={formData.deponentAge || ""}
                  onChange={(e) => handleInputChange("deponentAge", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deponent-address">Deponent's Address</Label>
              <Input
                id="deponent-address"
                placeholder="Enter your address"
                value={formData.deponentAddress || ""}
                onChange={(e) => handleInputChange("deponentAddress", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation-name">Father's/Husband's Name</Label>
              <Input
                id="relation-name"
                placeholder="Enter father's or husband's name"
                value={formData.relationName || ""}
                onChange={(e) => handleInputChange("relationName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affidavit-purpose">Purpose of Affidavit</Label>
              <Input
                id="affidavit-purpose"
                placeholder="E.g., change of name, proof of residence"
                value={formData.affidavitPurpose || ""}
                onChange={(e) => handleInputChange("affidavitPurpose", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="affidavit-statements">Affidavit Statements</Label>
              <Textarea
                id="affidavit-statements"
                placeholder="Enter the statements to be included in the affidavit, each on a new line..."
                className="min-h-[200px]"
                value={formData.affidavitStatements || ""}
                onChange={(e) => handleInputChange("affidavitStatements", e.target.value)}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <main className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Document Generator</h1>
          <p className="text-muted-foreground">Create legal documents tailored to your specific situation.</p>
        </div>

        <Tabs defaultValue="common">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="common">Common Documents</TabsTrigger>
            <TabsTrigger value="complaints">Complaints & Notices</TabsTrigger>
            <TabsTrigger value="agreements">Agreements</TabsTrigger>
          </TabsList>

          <TabsContent value="common">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Select Document Type</CardTitle>
                <CardDescription>Choose the type of document you need to generate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className={`h-auto py-6 justify-start flex-col items-start ${documentType === "police-complaint" ? "border-primary" : ""}`}
                    onClick={() => setDocumentType("police-complaint")}
                  >
                    <div className="font-bold mb-1">Police Complaint</div>
                    <div className="text-sm text-muted-foreground text-left">
                      File a complaint with the police about a crime or incident
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-auto py-6 justify-start flex-col items-start ${documentType === "legal-notice" ? "border-primary" : ""}`}
                    onClick={() => setDocumentType("legal-notice")}
                  >
                    <div className="font-bold mb-1">Legal Notice</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Send a formal notice before taking legal action
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-auto py-6 justify-start flex-col items-start ${documentType === "rti" ? "border-primary" : ""}`}
                    onClick={() => setDocumentType("rti")}
                  >
                    <div className="font-bold mb-1">RTI Application</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Request information from a public authority
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-auto py-6 justify-start flex-col items-start ${documentType === "affidavit" ? "border-primary" : ""}`}
                    onClick={() => setDocumentType("affidavit")}
                  >
                    <div className="font-bold mb-1">Affidavit</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Create a sworn statement for legal purposes
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {documentType && (
              <>
                {showTemplate && !hasResult && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Document Template
                      </CardTitle>
                      <CardDescription>This is the basic structure of the document you'll generate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-slate-50 p-6 rounded-lg whitespace-pre-line">{templateDocument}</div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {documentType === "police-complaint"
                        ? "Police Complaint"
                        : documentType === "legal-notice"
                          ? "Legal Notice"
                          : documentType === "rti"
                            ? "RTI Application"
                            : "Affidavit"}
                    </CardTitle>
                    <CardDescription>Fill in the details to generate the document</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">{renderFormFields()}</CardContent>
                  <CardFooter className="flex justify-between">
                    {!showTemplate && !hasResult && (
                      <Button variant="outline" onClick={handleViewTemplate}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Template
                      </Button>
                    )}
                    <Button
                      className={!showTemplate && !hasResult ? "ml-auto" : "w-full"}
                      disabled={isGenerating || isEnhancing}
                      onClick={handleGenerateDocument}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing with AI...
                        </>
                      ) : (
                        `Generate ${
                          documentType === "police-complaint"
                            ? "Police Complaint"
                            : documentType === "legal-notice"
                              ? "Legal Notice"
                              : documentType === "rti"
                                ? "RTI Application"
                                : "Affidavit"
                        }`
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="complaints">
            <Card>
              <CardHeader>
                <CardTitle>Complaints & Notices</CardTitle>
                <CardDescription>Generate formal complaints and legal notices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("consumer-complaint")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Consumer Complaint</div>
                    <div className="text-sm text-muted-foreground text-left">
                      File a complaint against a business for defective products or services
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("workplace-harassment")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Workplace Harassment Complaint</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Report harassment or discrimination at your workplace
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("landlord-notice")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Landlord Notice</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Send a formal notice to your landlord regarding repairs or issues
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("cheque-bounce")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Cheque Bounce Notice</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Send a legal notice for a dishonored cheque
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agreements">
            <Card>
              <CardHeader>
                <CardTitle>Agreements & Contracts</CardTitle>
                <CardDescription>Generate legally sound agreements and contracts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("rental-agreement")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Rental Agreement</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Create a rental agreement between landlord and tenant
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("employment-contract")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Employment Contract</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Draft an employment agreement with standard terms
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("freelance-agreement")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Freelance Agreement</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Create a contract for freelance or consulting work
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 justify-start flex-col items-start"
                    onClick={() => {
                      setDocumentType("nda")
                      toast({
                        title: "Coming Soon",
                        description: "This document type will be available soon.",
                      })
                    }}
                  >
                    <div className="font-bold mb-1">Non-Disclosure Agreement</div>
                    <div className="text-sm text-muted-foreground text-left">
                      Draft an NDA to protect confidential information
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {hasResult && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {documentType === "police-complaint"
                    ? "Generated Police Complaint"
                    : documentType === "legal-notice"
                      ? "Generated Legal Notice"
                      : documentType === "rti"
                        ? "Generated RTI Application"
                        : "Generated Affidavit"}
                </CardTitle>
                <CardDescription>Your document has been generated based on the information provided</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 font-serif whitespace-pre-line">{generatedDocument}</div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download as PDF
                </Button>
                <Button variant="outline" onClick={handleCopy}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}

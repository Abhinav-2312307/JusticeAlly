"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Copy, Check, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function DocumentTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [copied, setCopied] = useState(false)

  // Filter templates based on search query and category
  const filteredTemplates = documentTemplates.filter((template) => {
    const matchesSearch =
      searchQuery === "" ||
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (template: DocumentTemplate) => {
    const blob = new Blob([template.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.title.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Document Templates</h1>
          <p className="text-muted-foreground">
            Free templates for common legal documents that you can customize for your specific needs.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Templates
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="category-filter" className="text-sm font-medium">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category-filter">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="complaint">Complaints & Notices</SelectItem>
                  <SelectItem value="agreement">Agreements & Contracts</SelectItem>
                  <SelectItem value="affidavit">Affidavits & Declarations</SelectItem>
                  <SelectItem value="employment">Employment Documents</SelectItem>
                  <SelectItem value="property">Property Documents</SelectItem>
                  <SelectItem value="family">Family Law Documents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    onView={() => setSelectedTemplate(template)}
                    onDownload={() => handleDownload(template)}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground">No templates found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="popular">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter((template) => template.popular)
                .map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    onView={() => setSelectedTemplate(template)}
                    onDownload={() => handleDownload(template)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter((template) => template.recent)
                .map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    onView={() => setSelectedTemplate(template)}
                    onDownload={() => handleDownload(template)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates
                .filter((template) => template.free)
                .map((template, index) => (
                  <TemplateCard
                    key={index}
                    template={template}
                    onView={() => setSelectedTemplate(template)}
                    onDownload={() => handleDownload(template)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">How to Use These Templates</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Browse or search for the template you need</li>
            <li>View the template to see its content</li>
            <li>Download the template as a text file</li>
            <li>Customize the template with your specific information (replace all placeholder text in brackets)</li>
            <li>Review the document carefully before using it</li>
          </ol>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
            <h3 className="font-bold text-amber-800 mb-2">Important Disclaimer</h3>
            <p className="text-amber-800 text-sm">
              These templates are provided for informational purposes only and do not constitute legal advice. While we
              strive to keep these templates up-to-date and accurate, laws and regulations change frequently. We
              recommend consulting with a qualified attorney to ensure that any document you create meets your specific
              needs and complies with current laws.
            </p>
          </div>
        </div>

        {/* Template Viewer Dialog */}
        <Dialog open={!!selectedTemplate} onOpenChange={(open) => !open && setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTemplate?.title}</DialogTitle>
              <DialogDescription>{selectedTemplate?.description}</DialogDescription>
            </DialogHeader>
            <div className="bg-slate-50 p-4 rounded-lg my-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">{selectedTemplate?.content}</pre>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => selectedTemplate && handleDownload(selectedTemplate)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={() => selectedTemplate && handleCopy(selectedTemplate.content)}>
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

// Template Card Component
function TemplateCard({
  template,
  onView,
  onDownload,
}: {
  template: DocumentTemplate
  onView: () => void
  onDownload: () => void
}) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{template.title}</CardTitle>
          {template.popular && <Badge variant="secondary">Popular</Badge>}
          {template.recent && <Badge variant="outline">New</Badge>}
        </div>
        <CardDescription>{template.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <FileText className="h-4 w-4 mr-2" />
          <span>{getCategoryLabel(template.category)}</span>
        </div>
        <p className="text-sm line-clamp-3">{template.preview}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={onView}>
          View Template
        </Button>
        <Button variant="ghost" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to get category label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    complaint: "Complaints & Notices",
    agreement: "Agreements & Contracts",
    affidavit: "Affidavits & Declarations",
    employment: "Employment Documents",
    property: "Property Documents",
    family: "Family Law Documents",
  }
  return labels[category] || category
}

// Types
interface DocumentTemplate {
  title: string
  description: string
  category: string
  content: string
  preview: string
  popular?: boolean
  recent?: boolean
  free: boolean
}

// Sample data for document templates
const documentTemplates: DocumentTemplate[] = [
  {
    title: "Police Complaint",
    description: "Template for filing a complaint with the police about a crime or incident",
    category: "complaint",
    preview: "A formal complaint addressed to the Station House Officer detailing an incident or crime...",
    content: `POLICE COMPLAINT

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
Email: [Your Email Address]`,
    popular: true,
    free: true,
  },
  {
    title: "Legal Notice",
    description: "Template for sending a formal notice before taking legal action",
    category: "complaint",
    preview: "A formal notice addressed to the recipient detailing grievances and demands...",
    content: `LEGAL NOTICE

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
Advocate for [Sender Name]`,
    popular: true,
    free: true,
  },
  {
    title: "RTI Application",
    description: "Template for requesting information from a public authority under the RTI Act",
    category: "complaint",
    preview:
      "A formal application requesting information from a public authority under the Right to Information Act...",
    content: `RIGHT TO INFORMATION APPLICATION
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
Phone: [Phone Number]`,
    free: true,
  },
  {
    title: "Rental Agreement",
    description: "Template for a residential rental agreement between landlord and tenant",
    category: "agreement",
    preview: "A comprehensive agreement outlining the terms and conditions of a residential property rental...",
    content: `RESIDENTIAL RENTAL AGREEMENT

This Rental Agreement is made on this [Day] day of [Month], [Year] between:

LANDLORD: [Landlord's Name], residing at [Landlord's Address] (hereinafter referred to as the "LANDLORD")

AND

TENANT: [Tenant's Name], residing at [Tenant's Current Address] (hereinafter referred to as the "TENANT")

The Landlord and Tenant agree to the following terms and conditions:

1. PREMISES
   The Landlord agrees to rent to the Tenant the residential property located at [Property Address] (hereinafter referred to as the "PREMISES").

2. TERM
   The term of this Agreement shall be for a period of [Duration] commencing from [Start Date] and ending on [End Date].

3. RENT
   The Tenant agrees to pay a monthly rent of Rs. [Amount in Figures] (Rupees [Amount in Words] only) payable in advance on or before the [Day] of each month.

4. SECURITY DEPOSIT
   The Tenant has paid a security deposit of Rs. [Amount in Figures] (Rupees [Amount in Words] only) which will be refunded at the end of the tenancy after deducting any damages or unpaid dues.

5. UTILITIES
   The Tenant shall be responsible for payment of all utilities including [List of Utilities: e.g., electricity, water, gas, internet, etc.].

6. MAINTENANCE AND REPAIRS
   The Tenant shall maintain the Premises in good and clean condition. The Landlord shall be responsible for major repairs. The Tenant shall promptly inform the Landlord of any major repairs needed.

7. ALTERATIONS
   The Tenant shall not make any alterations, additions, or improvements to the Premises without the prior written consent of the Landlord.

8. TERMINATION
   Either party may terminate this Agreement by giving [Notice Period] notice in writing to the other party.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement on the date first above written.

LANDLORD:
[Landlord's Name]
[Signature]

TENANT:
[Tenant's Name]
[Signature]

WITNESSES:
1. [Name and Signature]
2. [Name and Signature]`,
    popular: true,
    free: true,
  },
  {
    title: "Employment Contract",
    description: "Template for an employment agreement between employer and employee",
    category: "employment",
    preview: "A formal contract outlining the terms and conditions of employment...",
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement (the "Agreement") is made and entered into on this [Day] day of [Month], [Year] by and between:

EMPLOYER: [Company Name], having its registered office at [Company Address] (hereinafter referred to as the "EMPLOYER")

AND

EMPLOYEE: [Employee Name], residing at [Employee Address] (hereinafter referred to as the "EMPLOYEE")

The Employer and Employee agree to the following terms and conditions:

1. POSITION AND DUTIES
   The Employer hereby employs the Employee as [Job Title], and the Employee accepts such employment. The Employee shall perform all duties and responsibilities associated with this position as determined by the Employer.

2. COMMENCEMENT AND TERM
   The employment shall commence on [Start Date] and shall continue until terminated in accordance with the provisions of this Agreement.

3. PROBATION PERIOD
   The Employee shall be on probation for a period of [Duration] from the date of joining. During this period, either party may terminate the employment without notice.

4. COMPENSATION
   The Employee shall receive a gross salary of Rs. [Amount in Figures] (Rupees [Amount in Words] only) per month, payable on or before the [Day] of each month.

5. WORKING HOURS
   The Employee shall work [Number of Hours] hours per week, from [Start Time] to [End Time], [Number of Days] days a week. The Employee may be required to work additional hours as necessary.

6. LEAVE ENTITLEMENT
   The Employee shall be entitled to [Number of Days] days of paid annual leave, [Number of Days] days of sick leave, and public holidays as per the Employer's policy.

7. CONFIDENTIALITY
   The Employee shall not, during the term of employment or after its termination, disclose any confidential information related to the Employer's business to any third party.

8. TERMINATION
   Either party may terminate this Agreement by giving [Notice Period] notice in writing to the other party.

9. GOVERNING LAW
   This Agreement shall be governed by the laws of India.

IN WITNESS WHEREOF, the parties hereto have executed this Agreement on the date first above written.

EMPLOYER:
[Authorized Signatory Name]
[Designation]
[Signature]

EMPLOYEE:
[Employee Name]
[Signature]`,
    free: true,
  },
  {
    title: "Affidavit",
    description: "Template for a general purpose affidavit for legal declarations",
    category: "affidavit",
    preview: "A sworn statement made under oath for legal purposes...",
    content: `AFFIDAVIT

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

DEPONENT`,
    free: true,
  },
  {
    title: "Consumer Complaint",
    description: "Template for filing a complaint against a business for defective products or services",
    category: "complaint",
    preview: "A formal complaint addressed to a business regarding defective products or unsatisfactory services...",
    content: `CONSUMER COMPLAINT

Date: [Current Date]

To,
The Customer Service Manager
[Company Name]
[Company Address]

Subject: Complaint regarding [Product/Service Name]

Dear Sir/Madam,

I am writing to express my dissatisfaction with [Product/Service] purchased/availed from your company on [Date of Purchase/Service].

Details of the purchase/service:
- Invoice/Receipt Number: [Invoice/Receipt Number]
- Date of Purchase/Service: [Date]
- Amount Paid: Rs. [Amount]
- Mode of Payment: [Cash/Credit Card/Online Payment]

Description of the issue:
[Detailed description of the problem with the product/service, including when and how the issue was discovered]

Prior attempts to resolve the issue:
[Details of any previous communication with the company, including dates, names of representatives spoken to, and outcomes]

As per the Consumer Protection Act, I am entitled to [mention specific rights: e.g., replacement, repair, refund, compensation, etc.]. Therefore, I request you to:
[Clearly state what you want the company to do to resolve your complaint]

I have attached copies of relevant documents (invoice/receipt, warranty card, photographs of defective product, etc.) for your reference.

I expect a resolution to this matter within [Number of Days] days, failing which I will be compelled to take further action, including approaching the Consumer Forum.

Yours sincerely,

[Your Name]
[Your Address]
[Your Phone Number]
[Your Email Address]

Enclosures:
1. [List of documents attached]
2. [List of documents attached]`,
    recent: true,
    free: true,
  },
  {
    title: "Will",
    description: "Template for a simple last will and testament",
    category: "family",
    preview:
      "A legal document expressing a person's wishes regarding the distribution of their property after death...",
    content: `LAST WILL AND TESTAMENT

I, [Full Name], son/daughter of [Father's Name], residing at [Address], being of sound mind and memory, do hereby make, publish, and declare this to be my Last Will and Testament, hereby revoking all wills and codicils previously made by me.

1. APPOINTMENT OF EXECUTOR
   I hereby appoint [Executor's Name], residing at [Executor's Address], to be the Executor of this my Last Will and Testament. In the event that [Executor's Name] is unable or unwilling to serve, then I appoint [Alternate Executor's Name], residing at [Alternate Executor's Address], to be the Executor.

2. PAYMENT OF DEBTS AND EXPENSES
   I direct my Executor to pay all my just debts, funeral expenses, and the expenses of administering my estate as soon as practicable after my death.

3. DISTRIBUTION OF PROPERTY
   I give, devise, and bequeath my property as follows:

   a) To my [Relationship], [Beneficiary's Name], I give [Specific Property/Amount].
   b) To my [Relationship], [Beneficiary's Name], I give [Specific Property/Amount].
   c) To my [Relationship], [Beneficiary's Name], I give [Specific Property/Amount].
   d) [Add more beneficiaries as needed]

4. RESIDUARY CLAUSE
   All the rest, residue, and remainder of my estate, both real and personal, of whatever kind and wherever situated, which I may own or have the right to dispose of at the time of my death, I give, devise, and bequeath to [Beneficiary's Name].

5. GUARDIAN APPOINTMENT (if applicable)
   In the event that I am survived by minor children, I appoint [Guardian's Name], residing at [Guardian's Address], as the Guardian of the person and property of such minor children.

IN WITNESS WHEREOF, I have hereunto set my hand to this my Last Will and Testament on this [Day] day of [Month], [Year].

[Testator's Signature]
[Testator's Name]

SIGNED, PUBLISHED, AND DECLARED by the above-named [Testator's Name] as and for his/her Last Will and Testament, in the presence of us, who at his/her request and in his/her presence, and in the presence of each other, have subscribed our names as witnesses.

Witness 1:
[Signature]
[Name]
[Address]

Witness 2:
[Signature]
[Name]
[Address]`,
    popular: true,
    free: true,
  },
  {
    title: "Power of Attorney",
    description: "Template for a general power of attorney document",
    category: "affidavit",
    preview: "A legal document authorizing someone to act on behalf of another person...",
    content: `POWER OF ATTORNEY

KNOW ALL MEN BY THESE PRESENTS:

THAT I, [Principal's Name], son/daughter of [Father's Name], residing at [Principal's Address], do hereby appoint [Attorney's Name], son/daughter of [Attorney's Father's Name], residing at [Attorney's Address], as my true and lawful Attorney to act in my name and on my behalf and to do or execute all or any of the following acts, deeds, and things, that is to say:

1. To represent me before any Government Office, Court, Tribunal, or any other Judicial or Quasi-Judicial Authority.

2. To execute, sign, verify, and present any application, petition, appeal, affidavit, or any other document necessary for the above purposes.

3. To receive any money or funds on my behalf and issue receipts for the same.

4. To purchase, sell, mortgage, lease, or otherwise deal with any movable or immovable property on my behalf.

5. To sign, execute, and deliver any deed, transfer, agreement, or other document relating to any transaction on my behalf.

6. To open, operate, and close any bank account in my name and to draw, sign, endorse, and negotiate any cheque or other negotiable instrument on my behalf.

7. To appear and act on my behalf in any meeting of any company or association in which I am a member or shareholder.

8. To engage any lawyer, advocate, chartered accountant, or other professional as may be necessary.

9. To compromise, settle, or refer to arbitration any dispute relating to any matter connected with the powers granted herein.

10. To delegate all or any of the powers conferred on my Attorney herein to any other person and to revoke such delegation.

AND I HEREBY AGREE to ratify and confirm all and whatsoever my said Attorney shall lawfully do or cause to be done by virtue of these presents.

This Power of Attorney shall remain in full force and effect until revoked by me in writing.

IN WITNESS WHEREOF, I have hereunto set my hand at [Place] on this [Day] day of [Month], [Year].

[Principal's Signature]
[Principal's Name]

WITNESSES:

1. [Signature]
   [Name]
   [Address]

2. [Signature]
   [Name]
   [Address]`,
    free: true,
  },
  {
    title: "Non-Disclosure Agreement",
    description: "Template for a confidentiality agreement to protect sensitive information",
    category: "agreement",
    preview: "A legal agreement to protect confidential information shared between parties...",
    content: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into on this [Day] day of [Month], [Year] by and between:

[Party 1 Name], having its registered office at [Party 1 Address] (hereinafter referred to as the "Disclosing Party")

AND

[Party 2 Name], having its registered office at [Party 2 Address] (hereinafter referred to as the "Receiving Party")

(The Disclosing Party and the Receiving Party are hereinafter collectively referred to as the "Parties" and individually as a "Party")

WHEREAS the Disclosing Party wishes to disclose certain confidential information to the Receiving Party for the purpose of [Purpose of Disclosure] (the "Purpose");

AND WHEREAS the Receiving Party agrees to maintain the confidentiality of such information in accordance with the terms and conditions of this Agreement;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
   "Confidential Information" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, including but not limited to documents, business plans, financial data, product plans, customer lists, marketing plans, technical data, trade secrets, and know-how.

2. OBLIGATIONS OF THE RECEIVING PARTY
   The Receiving Party shall:
   a) Keep the Confidential Information in strict confidence;
   b) Not disclose the Confidential Information to any third party without the prior written consent of the Disclosing Party;
   c) Use the Confidential Information only for the Purpose;
   d) Take all reasonable measures to protect the secrecy of and avoid disclosure or use of the Confidential Information;
   e) Limit access to the Confidential Information to its employees, agents, and representatives who need to know such information for the Purpose and who are bound by confidentiality obligations no less restrictive than those contained herein.

3. EXCLUSIONS
   The obligations under this Agreement shall not apply to information that:
   a) Was in the public domain at the time of disclosure;
   b) Becomes part of the public domain after disclosure through no fault of the Receiving Party;
   c) Was known to the Receiving Party prior to disclosure;
   d) Is independently developed by the Receiving Party without use of the Confidential Information;
   e) Is disclosed pursuant to a legal requirement or order of a court or governmental authority.

4. TERM AND TERMINATION
   This Agreement shall remain in effect for a period of [Duration] from the date of execution. The obligations of confidentiality shall survive the termination of this Agreement for a period of [Duration].

5. RETURN OF MATERIALS
   Upon the Disclosing Party's request, the Receiving Party shall promptly return or destroy all materials containing Confidential Information.

6. REMEDIES
   The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party, and that the Disclosing Party shall be entitled to seek injunctive relief in addition to any other remedies available at law or in equity.

7. GOVERNING LAW
   This Agreement shall be governed by and construed in accordance with the laws of India.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.

[Party 1 Name]
By: [Authorized Signatory Name]
Title: [Designation]
Signature: _______________

[Party 2 Name]
By: [Authorized Signatory Name]
Title: [Designation]
Signature: _______________`,
    recent: true,
    free: true,
  },
  {
    title: "Sale Deed",
    description: "Template for a property sale deed",
    category: "property",
    preview: "A legal document for the transfer of ownership of property from seller to buyer...",
    content: `SALE DEED

THIS DEED OF SALE is made and executed on this [Day] day of [Month], [Year] at [Place]

BETWEEN

[Seller's Name], son/daughter/wife of [Father's/Husband's Name], aged about [Age] years, residing at [Seller's Address] (hereinafter referred to as the "SELLER", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include his/her heirs, executors, administrators, and assigns) of the ONE PART

AND

[Buyer's Name], son/daughter/wife of [Father's/Husband's Name], aged about [Age] years, residing at [Buyer's Address] (hereinafter referred to as the "BUYER", which expression shall, unless repugnant to the context or meaning thereof, be deemed to include his/her heirs, executors, administrators, and assigns) of the OTHER PART

WHEREAS the Seller is the absolute owner in possession of the property more fully described in the Schedule hereunder (hereinafter referred to as the "SCHEDULE PROPERTY");

AND WHEREAS the Seller has agreed to sell and the Buyer has agreed to purchase the Schedule Property for a sale consideration of Rs. [Amount in Figures] (Rupees [Amount in Words] only);

NOW THIS DEED WITNESSETH AS FOLLOWS:

1. In consideration of the sum of Rs. [Amount in Figures] (Rupees [Amount in Words] only) paid by the Buyer to the Seller (the receipt of which the Seller hereby acknowledges), the Seller hereby sells, transfers, and conveys unto the Buyer the Schedule Property, together with all rights, titles, interests, easements, and appurtenances thereto.

2. The Seller hereby confirms that:
   a) The Seller has clear and marketable title to the Schedule Property;
   b) The Schedule Property is free from all encumbrances, mortgages, charges, liens, attachments, claims, and demands;
   c) The Seller has not entered into any agreement for sale, mortgage, or any other transaction in respect of the Schedule Property with any other person;
   d) The Seller has paid all taxes, levies, and assessments in respect of the Schedule Property up to the date of this Deed.

3. The Buyer shall hereafter hold and enjoy the Schedule Property as absolute owner thereof without any interruption, claim, or demand by the Seller or any person claiming through or under the Seller.

4. The Seller shall, at the request and cost of the Buyer, execute such further documents and take such further actions as may be necessary to more effectively transfer the Schedule Property to the Buyer.

SCHEDULE OF PROPERTY
[Detailed description of the property including location, boundaries, measurements, and any other identifying features]

IN WITNESS WHEREOF, the parties hereto have set their hands on the day, month, and year first above written.

SELLER:
[Seller's Name]
[Signature]

BUYER:
[Buyer's Name]
[Signature]

WITNESSES:
1. [Name and Signature]
2. [Name and Signature]`,
    free: true,
  },
  {
    title: "Divorce Petition",
    description: "Template for filing a petition for divorce",
    category: "family",
    preview: "A legal petition seeking dissolution of marriage...",
    content: `PETITION FOR DIVORCE
(Under Section 13 of the Hindu Marriage Act, 1955)

IN THE COURT OF [Court Name]
AT [Place]

Petition No. _______ of [Year]

IN THE MATTER OF:
[Petitioner's Name], son/daughter of [Father's Name],
residing at [Petitioner's Address]
...PETITIONER

VERSUS

[Respondent's Name], son/daughter of [Father's Name],
residing at [Respondent's Address]
...RESPONDENT

PETITION FOR DISSOLUTION OF MARRIAGE BY A DECREE OF DIVORCE

The humble petition of the Petitioner most respectfully showeth:

1. That the Petitioner and the Respondent are [Religion] by faith and are governed by the [Applicable Law, e.g., Hindu Marriage Act, 1955].

2. That the marriage between the Petitioner and the Respondent was solemnized on [Date of Marriage] at [Place of Marriage] according to [Religious/Customary] rites and ceremonies.

3. That after the marriage, the Petitioner and the Respondent resided together at [Address] and [Number] children were born out of the wedlock, namely:
   a) [Child 1 Name], aged [Age], born on [Date of Birth]
   b) [Child 2 Name], aged [Age], born on [Date of Birth]
   [Add more children if applicable]

4. That the marriage between the Petitioner and the Respondent has broken down irretrievably due to [Grounds for Divorce, e.g., cruelty, desertion, adultery, etc.].

5. [Detailed description of the grounds for divorce with specific instances, dates, and circumstances]

6. That there have been no previous proceedings with regard to the marriage by or against any party.

7. That this Hon'ble Court has jurisdiction to entertain this petition as:
   a) The marriage was solemnized at [Place] which is within the jurisdiction of this Hon'ble Court; and/or
   b) The parties last resided together at [Address] which is within the jurisdiction of this Hon'ble Court; and/or
   c) The Petitioner/Respondent is presently residing at [Address] which is within the jurisdiction of this Hon'ble Court.

8. That the Petitioner seeks the following reliefs:
   a) Dissolution of marriage by a decree of divorce;
   b) [Custody of children, if applicable];
   c) [Maintenance, if applicable];
   d) [Any other relief].

PRAYER:
In the circumstances, it is most respectfully prayed that this Hon'ble Court may be pleased to:

a) Pass a decree of divorce, thereby dissolving the marriage between the Petitioner and the Respondent;
b) [Grant custody of the minor children to the Petitioner/Respondent, if applicable];
c) [Direct the Respondent to pay maintenance to the Petitioner and/or children, if applicable];
d) Pass such other and further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case.

Place: [Place]
Date: [Date]

[Petitioner's Signature]
Through:
[Advocate's Name]
Advocate for the Petitioner

VERIFICATION:
I, [Petitioner's Name], the Petitioner above named, do hereby verify that the contents of paragraphs [1 to 8] of the petition are true and correct to my knowledge and belief and nothing material has been concealed therefrom.

Verified at [Place] on this [Day] day of [Month], [Year].

[Petitioner's Signature]`,
    free: true,
  },
  {
    title: "Freelance Agreement",
    description: "Template for a contract between a client and a freelancer",
    category: "agreement",
    preview: "A comprehensive agreement outlining the terms of a freelance engagement...",
    content: `FREELANCE SERVICES AGREEMENT

This Freelance Services Agreement (the "Agreement") is made and entered into on this [Day] day of [Month], [Year] by and between:

CLIENT: [Client Name], having its registered office at [Client Address] (hereinafter referred to as the "CLIENT")

AND

FREELANCER: [Freelancer Name], residing at [Freelancer Address] (hereinafter referred to as the "FREELANCER")

The Client and Freelancer are hereinafter collectively referred to as the "Parties" and individually as a "Party".

WHEREAS the Client wishes to engage the Freelancer to provide certain services, and the Freelancer is willing to provide such services to the Client;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the Parties agree as follows:

1. SERVICES
   The Freelancer shall provide the following services to the Client (the "Services"):
   [Detailed description of the services to be provided]

2. TERM
   This Agreement shall commence on [Start Date] and shall continue until [End Date] or until the completion of the Services, whichever is earlier, unless terminated earlier in accordance with the provisions of this Agreement.

3. COMPENSATION
   a) The Client shall pay the Freelancer a fee of Rs. [Amount in Figures] (Rupees [Amount in Words] only) for the Services (the "Fee").
   b) Payment Schedule: [Details of payment schedule, e.g., milestone-based, hourly, weekly, monthly, etc.]
   c) The Client shall reimburse the Freelancer for the following expenses incurred in connection with the Services: [List of reimbursable expenses, if any]
   d) All payments shall be made to the Freelancer's bank account as specified below:
      Bank Name: [Bank Name]
      Account Number: [Account Number]
      IFSC Code: [IFSC Code]

4. DELIVERABLES AND TIMELINE
   The Freelancer shall deliver the following deliverables according to the timeline specified below:
   a) [Deliverable 1]: [Due Date]
   b) [Deliverable 2]: [Due Date]
   c) [Deliverable 3]: [Due Date]
   [Add more deliverables as needed]

5. INDEPENDENT CONTRACTOR STATUS
   The Freelancer is an independent contractor and not an employee of the Client. The Freelancer shall be responsible for all taxes, insurance, and other obligations related to the Freelancer's business.

6. INTELLECTUAL PROPERTY
   a) Upon full payment of the Fee, all intellectual property rights in the deliverables created by the Freelancer specifically for the Client as part of the Services shall be assigned to the Client.
   b) The Freelancer retains all intellectual property rights in any pre-existing materials used in the deliverables.
   c) The Freelancer shall have the right to use the deliverables in the Freelancer's portfolio for self-promotion purposes.

7. CONFIDENTIALITY
   The Freelancer shall maintain the confidentiality of all confidential information provided by the Client and shall not disclose such information to any third party without the prior written consent of the Client.

8. TERMINATION
   a) Either Party may terminate this Agreement by giving [Notice Period] written notice to the other Party.
   b) In the event of termination, the Client shall pay the Freelancer for all Services performed up to the date of termination.

9. LIMITATION OF LIABILITY
   The Freelancer's liability under this Agreement shall be limited to the amount of the Fee paid by the Client to the Freelancer.

10. GOVERNING LAW
    This Agreement shall be governed by and construed in accordance with the laws of India.

11. DISPUTE RESOLUTION
    Any dispute arising out of or in connection with this Agreement shall be resolved through amicable negotiation between the Parties. If the dispute cannot be resolved through negotiation within [Number of Days] days, it shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.

12. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding between the Parties with respect to the subject matter hereof and supersedes all prior agreements, representations, and understandings, whether oral or written.

13. AMENDMENTS
    No amendment to this Agreement shall be effective unless it is in writing and signed by both Parties.

14. SEVERABILITY
    If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first above written.

CLIENT:
[Client Name]
By: [Authorized Signatory Name]
Title: [Designation]
Signature: _______________

FREELANCER:
[Freelancer Name]
Signature: _______________

WITNESSES:
1. [Name and Signature]
2. [Name and Signature]`,
    recent: true,
    free: true,
  },
]

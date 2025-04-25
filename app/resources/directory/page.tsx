"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, ExternalLink, Mail, Clock, Search } from "lucide-react"

export default function LegalAidDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter organizations based on search query, state, and category
  const filteredOrganizations = legalAidOrganizations.filter((org) => {
    const matchesSearch =
      searchQuery === "" ||
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.address.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesState = selectedState === "all" || org.state === selectedState
    const matchesCategory = selectedCategory === "all" || org.categories.includes(selectedCategory)

    return matchesSearch && matchesState && matchesCategory
  })

  return (
    <main className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Legal Aid Directory</h1>
          <p className="text-muted-foreground">
            Find legal aid organizations and pro bono services across India to get the help you need.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or location..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="state-filter" className="text-sm font-medium">
                State/UT
              </label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger id="state-filter">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Karnataka">Karnataka</SelectItem>
                  <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  <SelectItem value="West Bengal">West Bengal</SelectItem>
                  <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="Gujarat">Gujarat</SelectItem>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="general">General Legal Aid</SelectItem>
                  <SelectItem value="women">Women's Rights</SelectItem>
                  <SelectItem value="children">Children's Rights</SelectItem>
                  <SelectItem value="labor">Labor Rights</SelectItem>
                  <SelectItem value="housing">Housing Rights</SelectItem>
                  <SelectItem value="consumer">Consumer Rights</SelectItem>
                  <SelectItem value="disability">Disability Rights</SelectItem>
                  <SelectItem value="human-rights">Human Rights</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="organizations">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="helplines">Helplines</TabsTrigger>
          </TabsList>

          <TabsContent value="organizations">
            <div className="grid grid-cols-1 gap-6">
              {filteredOrganizations.length > 0 ? (
                filteredOrganizations.map((org, index) => <OrganizationCard key={index} organization={org} />)
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No organizations found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedState("all")
                      setSelectedCategory("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="helplines">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helplines.map((helpline, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{helpline.name}</CardTitle>
                    <CardDescription>{helpline.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium">{helpline.phone}</span>
                      </div>
                      {helpline.hours && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{helpline.hours}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                      {helpline.categories.map((category, idx) => (
                        <Badge key={idx} variant="outline">
                          {getCategoryLabel(category)}
                        </Badge>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-slate-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">About Legal Aid in India</h2>
          <p className="mb-4">
            Legal aid in India is provided under the Legal Services Authorities Act, 1987. The National Legal Services
            Authority (NALSA) is the apex body constituted to lay down policies and principles for making legal services
            available to the weaker sections of society.
          </p>
          <p className="mb-4">
            Every state has a State Legal Services Authority (SLSA), and each district has a District Legal Services
            Authority (DLSA). These authorities provide free legal services to eligible persons and organize Lok Adalats
            for amicable settlement of disputes.
          </p>
          <h3 className="text-lg font-bold mt-6 mb-2">Who is eligible for free legal aid?</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Women and children</li>
            <li>Members of Scheduled Castes and Scheduled Tribes</li>
            <li>Industrial workmen</li>
            <li>Victims of mass disaster, violence, flood, drought, earthquake, industrial disaster</li>
            <li>Persons with disabilities</li>
            <li>Persons in custody</li>
            <li>Persons with annual income less than the prescribed limit (varies by state)</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

// Helper function to get category label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    general: "General Legal Aid",
    women: "Women's Rights",
    children: "Children's Rights",
    labor: "Labor Rights",
    housing: "Housing Rights",
    consumer: "Consumer Rights",
    disability: "Disability Rights",
    "human-rights": "Human Rights",
  }
  return labels[category] || category
}

// Organization Card Component
function OrganizationCard({ organization }: { organization: LegalAidOrganization }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>{organization.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
            <span className="text-sm">{organization.address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium">{organization.phone}</span>
          </div>
          {organization.email && (
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">{organization.email}</span>
            </div>
          )}
          {organization.hours && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{organization.hours}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex flex-wrap gap-2 mb-4">
          {organization.categories.map((category, index) => (
            <Badge key={index} variant="outline">
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </div>
        {organization.website && (
          <Button variant="outline" size="sm" asChild>
            <a href={organization.website} target="_blank" rel="noopener noreferrer">
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Types
interface LegalAidOrganization {
  name: string
  description: string
  address: string
  state: string
  phone: string
  email?: string
  website?: string
  hours?: string
  categories: string[]
}

// Sample data for legal aid organizations
const legalAidOrganizations: LegalAidOrganization[] = [
  {
    name: "Delhi State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Delhi",
    address: "Patiala House Courts Complex, New Delhi - 110001",
    state: "Delhi",
    phone: "011-23384781",
    email: "dlsa-phc-delhi@nic.in",
    website: "https://dslsa.org",
    hours: "Monday to Friday, 10:00 AM to 5:00 PM",
    categories: ["general", "women", "children"],
  },
  {
    name: "Human Rights Law Network",
    description: "Collective of lawyers and social activists dedicated to the use of legal system for human rights",
    address: "576, Mahatma Gandhi Road, New Delhi - 110001",
    state: "Delhi",
    phone: "011-24374501",
    email: "contact@hrln.org",
    website: "https://hrln.org",
    hours: "Monday to Saturday, 9:30 AM to 6:00 PM",
    categories: ["human-rights", "women", "labor"],
  },
  {
    name: "Maharashtra State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Maharashtra",
    address: "High Court Building, Fort, Mumbai - 400032",
    state: "Maharashtra",
    phone: "022-22691395",
    email: "mslsa-bhc@gov.in",
    website: "https://legalservices.maharashtra.gov.in",
    hours: "Monday to Friday, 10:00 AM to 5:30 PM",
    categories: ["general", "housing", "consumer"],
  },
  {
    name: "Karnataka State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Karnataka",
    address: "Nyaya Degula, 1st Floor, H. Siddaiah Road, Bengaluru - 560027",
    state: "Karnataka",
    phone: "080-22111714",
    website: "https://kslsa.kar.nic.in",
    hours: "Monday to Saturday, 10:00 AM to 5:30 PM",
    categories: ["general", "labor", "disability"],
  },
  {
    name: "Lawyers Collective",
    description: "NGO dedicated to empowering and changing the status of marginalized groups through the law",
    address: "4th Floor, Jalaram Jyot, Janmabhoomi Marg, Mumbai - 400001",
    state: "Maharashtra",
    phone: "022-43411603",
    email: "admin@lawyerscollective.org",
    website: "https://www.lawyerscollective.org",
    categories: ["women", "human-rights", "labor"],
  },
  {
    name: "Tamil Nadu State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Tamil Nadu",
    address: "High Court Campus, Chennai - 600104",
    state: "Tamil Nadu",
    phone: "044-25342833",
    email: "tnslsa@gmail.com",
    website: "https://tnslsa.tn.gov.in",
    hours: "Monday to Friday, 10:00 AM to 5:45 PM",
    categories: ["general", "children", "consumer"],
  },
  {
    name: "Multiple Action Research Group (MARG)",
    description: "Organization working to promote legal literacy and access to justice for marginalized communities",
    address: "205-206, 2nd Floor, Shahpur Jat, New Delhi - 110049",
    state: "Delhi",
    phone: "011-26497483",
    email: "marg@ngo-marg.org",
    website: "https://ngo-marg.org",
    categories: ["general", "housing", "labor"],
  },
  {
    name: "West Bengal State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in West Bengal",
    address: "City Civil Court Building, Kolkata - 700001",
    state: "West Bengal",
    phone: "033-22484234",
    email: "wbslsa@gmail.com",
    website: "https://wbslsa.gov.in",
    hours: "Monday to Friday, 10:00 AM to 5:30 PM",
    categories: ["general", "women", "disability"],
  },
  {
    name: "Centre for Social Justice",
    description: "Organization working to empower marginalized communities through legal awareness and intervention",
    address: "B-5, Satyam Complex, Opposite New York Tower, Thaltej, Ahmedabad - 380054",
    state: "Gujarat",
    phone: "079-26851680",
    email: "centreforsocialjustice@gmail.com",
    website: "https://centreforsocialjustice.net",
    categories: ["human-rights", "labor", "housing"],
  },
  {
    name: "Uttar Pradesh State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Uttar Pradesh",
    address: "3rd Floor, Jawahar Bhawan, Lucknow - 226001",
    state: "Uttar Pradesh",
    phone: "0522-2286395",
    website: "https://upslsa.up.nic.in",
    hours: "Monday to Saturday, 10:00 AM to 5:00 PM",
    categories: ["general", "women", "children"],
  },
  {
    name: "Majlis Legal Centre",
    description: "Women's rights organization providing legal services to women facing domestic and sexual violence",
    address: "A-2, Neelkanth Gardens, Govandi, Mumbai - 400043",
    state: "Maharashtra",
    phone: "022-25545054",
    email: "majlislaw@gmail.com",
    website: "https://majlislaw.com",
    categories: ["women", "children", "human-rights"],
  },
  {
    name: "Telangana State Legal Services Authority",
    description: "Official legal aid body providing free legal services to eligible persons in Telangana",
    address: "City Civil Court Building, Hyderabad - 500001",
    state: "Telangana",
    phone: "040-24567802",
    email: "telanganaslsa@gmail.com",
    website: "https://tslsa.telangana.gov.in",
    hours: "Monday to Saturday, 10:30 AM to 5:00 PM",
    categories: ["general", "labor", "consumer"],
  },
]

// Sample data for helplines
const helplines = [
  {
    name: "National Legal Services Authority (NALSA)",
    description: "Central authority established to provide free legal services to eligible persons",
    phone: "1516",
    hours: "24/7",
    categories: ["general"],
  },
  {
    name: "Women's Helpline",
    description: "Emergency response support system for women in distress",
    phone: "1091",
    hours: "24/7",
    categories: ["women"],
  },
  {
    name: "Child Helpline",
    description: "Emergency phone service for children in need of care and protection",
    phone: "1098",
    hours: "24/7",
    categories: ["children"],
  },
  {
    name: "Senior Citizen Helpline",
    description: "Helpline for elderly citizens facing problems",
    phone: "14567",
    hours: "24/7",
    categories: ["general"],
  },
  {
    name: "National Human Rights Commission",
    description: "Helpline for reporting human rights violations",
    phone: "1800-11-8888",
    hours: "Monday to Friday, 9:00 AM to 5:30 PM",
    categories: ["human-rights"],
  },
  {
    name: "Consumer Helpline",
    description: "Helpline for consumer grievances and complaints",
    phone: "1800-11-4000",
    hours: "Monday to Saturday, 9:30 AM to 5:30 PM",
    categories: ["consumer"],
  },
  {
    name: "Cyber Crime Helpline",
    description: "Helpline for reporting cyber crimes",
    phone: "1930",
    hours: "24/7",
    categories: ["general"],
  },
  {
    name: "National Commission for Women",
    description: "Helpline for women facing harassment or violence",
    phone: "1800-11-6666",
    hours: "Monday to Friday, 9:00 AM to 5:30 PM",
    categories: ["women"],
  },
]

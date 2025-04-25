"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Phone, MapPin, MessageSquare, Copy, Check } from "lucide-react"

export default function EmergencyHelp() {
  const [location, setLocation] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-10 w-10 text-red-600 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold text-red-800 mb-2">Emergency Legal Help</h1>
              <p className="text-red-700 mb-4">
                If you're in immediate danger, please contact emergency services at <strong>112</strong> first.
              </p>
              <p className="text-red-700">
                This service provides urgent legal guidance for situations requiring immediate attention.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="detention">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="detention">Wrongful Detention</TabsTrigger>
            <TabsTrigger value="domestic">Domestic Violence</TabsTrigger>
            <TabsTrigger value="harassment">Harassment</TabsTrigger>
          </TabsList>

          <TabsContent value="detention">
            <Card>
              <CardHeader>
                <CardTitle>Wrongful Detention or Arrest</CardTitle>
                <CardDescription>
                  Immediate steps if you or someone you know has been wrongfully detained
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-bold text-amber-800 mb-2">Know Your Rights</h3>
                  <ul className="list-disc pl-6 space-y-1 text-amber-800">
                    <li>You have the right to know the grounds of arrest</li>
                    <li>You have the right to consult a lawyer of your choice</li>
                    <li>You have the right to inform a relative or friend about your arrest</li>
                    <li>You have the right to be produced before a magistrate within 24 hours</li>
                    <li>You have the right to medical examination</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Immediate Steps:</h3>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      <strong>Stay calm and cooperate:</strong> Do not resist physically, but clearly state that you
                      wish to exercise your rights.
                    </li>
                    <li>
                      <strong>Ask for the grounds of arrest:</strong> The police must inform you why you are being
                      arrested.
                    </li>
                    <li>
                      <strong>Request to contact a lawyer:</strong> You have the right to legal representation.
                    </li>
                    <li>
                      <strong>Inform family or friends:</strong> Ask to make a phone call to inform someone about your
                      situation.
                    </li>
                    <li>
                      <strong>Document everything:</strong> Remember details like officer names, badge numbers, and
                      timeline of events.
                    </li>
                  </ol>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">What to Say:</h3>
                  <div className="bg-slate-50 p-4 rounded-lg mb-4">
                    <p className="italic">
                      "I respectfully wish to know the grounds of my detention. I would like to exercise my right to
                      contact my lawyer and inform my family about this situation. I will cooperate fully, but I wish to
                      ensure my legal rights are protected."
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleCopy} className="w-full">
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied to Clipboard
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Find Legal Help Nearby:</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Your Location</Label>
                      <div className="flex gap-2">
                        <Input
                          id="location"
                          placeholder="Enter your city or area"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                        <Button>
                          <MapPin className="mr-2 h-4 w-4" />
                          Find
                        </Button>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Legal Aid Services:</h4>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">District Legal Services Authority</p>
                            <p className="text-sm text-muted-foreground">Civil Court Complex, MG Road</p>
                          </div>
                          <Button size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Human Rights Law Network</p>
                            <p className="text-sm text-muted-foreground">576 Mahatma Gandhi Road</p>
                          </div>
                          <Button size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Legal Aid Clinic</p>
                            <p className="text-sm text-muted-foreground">National Law University</p>
                          </div>
                          <Button size="sm">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href="tel:1516">
                    <Phone className="mr-2 h-4 w-4" />
                    Call NALSA Helpline (1516)
                  </a>
                </Button>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with JusticeAlly Expert
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="domestic">
            <Card>
              <CardHeader>
                <CardTitle>Domestic Violence Help</CardTitle>
                <CardDescription>Immediate assistance for domestic violence situations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-amber-800 mb-2">Safety First</h3>
                  <p className="text-amber-800 mb-2">
                    If you are in immediate danger, please call the Women's Helpline at <strong>1091</strong> or
                    Emergency Services at <strong>112</strong>.
                  </p>
                  <p className="text-amber-800">
                    Your safety is the priority. Seek a safe location before proceeding with legal steps.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Your Legal Rights:</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Protection Orders:</strong> You can obtain a protection order from a magistrate to
                        prevent the abuser from contacting you.
                      </li>
                      <li>
                        <strong>Residence Orders:</strong> You have the right to secure housing, even if it's not in
                        your name.
                      </li>
                      <li>
                        <strong>Monetary Relief:</strong> You can claim financial support for expenses and losses.
                      </li>
                      <li>
                        <strong>Custody Orders:</strong> You can request temporary custody of your children.
                      </li>
                      <li>
                        <strong>Compensation:</strong> You can claim compensation for injuries and mental trauma.
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Immediate Steps:</h3>
                    <ol className="list-decimal pl-6 space-y-2">
                      <li>
                        <strong>Document the abuse:</strong> Take photos of injuries, keep copies of medical reports,
                        and maintain a journal of incidents.
                      </li>
                      <li>
                        <strong>File a police complaint:</strong> Visit the nearest police station to file a Domestic
                        Incident Report (DIR).
                      </li>
                      <li>
                        <strong>Contact a Protection Officer:</strong> They can help you file an application for
                        protection orders.
                      </li>
                      <li>
                        <strong>Seek medical attention:</strong> Get medical documentation of your injuries.
                      </li>
                      <li>
                        <strong>Contact support services:</strong> Reach out to domestic violence shelters or helplines.
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">Find Help Nearby:</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="location-dv">Your Location</Label>
                        <div className="flex gap-2">
                          <Input id="location-dv" placeholder="Enter your city or area" />
                          <Button>
                            <MapPin className="mr-2 h-4 w-4" />
                            Find
                          </Button>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Support Services:</h4>
                        <ul className="space-y-3">
                          <li className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">One Stop Crisis Center</p>
                              <p className="text-sm text-muted-foreground">District Hospital</p>
                            </div>
                            <Button size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          </li>
                          <li className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Women's Shelter Home</p>
                              <p className="text-sm text-muted-foreground">Near Central Market</p>
                            </div>
                            <Button size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          </li>
                          <li className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">Family Counseling Center</p>
                              <p className="text-sm text-muted-foreground">Community Center, Sector 4</p>
                            </div>
                            <Button size="sm">
                              <Phone className="mr-2 h-4 w-4" />
                              Call
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href="tel:1091">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Women's Helpline (1091)
                  </a>
                </Button>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with Support Counselor
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="harassment">
            <Card>
              <CardHeader>
                <CardTitle>Workplace & Online Harassment</CardTitle>
                <CardDescription>Legal guidance for dealing with harassment situations</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="workplace">
                  <TabsList className="w-full mb-6">
                    <TabsTrigger value="workplace" className="flex-1">
                      Workplace Harassment
                    </TabsTrigger>
                    <TabsTrigger value="online" className="flex-1">
                      Online Harassment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="workplace" className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-bold text-amber-800 mb-2">Your Rights at Work</h3>
                      <p className="text-amber-800">
                        Every employee has the right to a safe working environment free from harassment. Sexual
                        harassment at the workplace is prohibited under the Sexual Harassment of Women at Workplace
                        (Prevention, Prohibition and Redressal) Act, 2013.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2">Immediate Steps:</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>
                          <strong>Document everything:</strong> Keep a detailed record of all incidents, including
                          dates, times, locations, what happened, and any witnesses.
                        </li>
                        <li>
                          <strong>Report to Internal Committee:</strong> File a formal complaint with your
                          organization's Internal Complaints Committee (ICC).
                        </li>
                        <li>
                          <strong>Know the timeline:</strong> The ICC must complete its inquiry within 90 days and
                          submit recommendations within 10 days after that.
                        </li>
                        <li>
                          <strong>Seek support:</strong> Connect with counseling services or support groups.
                        </li>
                        <li>
                          <strong>Legal action:</strong> If unsatisfied with the ICC's response, you can file a
                          complaint with the Local Complaints Committee or pursue legal action.
                        </li>
                      </ol>
                    </div>

                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-bold text-lg mb-2">Sample Complaint Letter:</h3>
                      <div className="bg-slate-50 p-4 rounded-lg mb-4 text-sm">
                        <p className="mb-2">
                          To,
                          <br />
                          The Chairperson,
                          <br />
                          Internal Complaints Committee,
                          <br />
                          [Organization Name]
                        </p>
                        <p className="mb-2">Subject: Complaint of workplace harassment</p>
                        <p className="mb-2">Dear Sir/Madam,</p>
                        <p className="mb-2">
                          I, [Your Name], working as [Your Designation] in [Department/Team], wish to file a formal
                          complaint of harassment against [Name of the Harasser], [Designation].
                        </p>
                        <p className="mb-2">
                          The incidents occurred on [Date(s)] at [Location]. The behavior included [brief description of
                          the harassment]. This has created a hostile work environment for me and has affected my mental
                          well-being and work performance.
                        </p>
                        <p className="mb-2">
                          I request the committee to investigate this matter and take appropriate action as per the
                          organization's policy and the law.
                        </p>
                        <p>
                          Sincerely,
                          <br />
                          [Your Name]
                          <br />
                          [Contact Information]
                          <br />
                          [Date]
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleCopy} className="w-full">
                        {copied ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Copied to Clipboard
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Template
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="online" className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h3 className="font-bold text-amber-800 mb-2">Online Harassment Laws</h3>
                      <p className="text-amber-800">
                        Online harassment is punishable under the Information Technology Act, 2000 and the Indian Penal
                        Code. This includes cyberstalking, online threats, defamation, and sharing private content
                        without consent.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2">Immediate Steps:</h3>
                      <ol className="list-decimal pl-6 space-y-2">
                        <li>
                          <strong>Preserve evidence:</strong> Take screenshots of all harassing messages, posts, or
                          content.
                        </li>
                        <li>
                          <strong>Block the harasser:</strong> Use platform tools to block the person from contacting
                          you.
                        </li>
                        <li>
                          <strong>Report to the platform:</strong> Report the harassment to the social media platform or
                          website.
                        </li>
                        <li>
                          <strong>File a cyber crime complaint:</strong> Report to the local cyber crime cell or online
                          at cybercrime.gov.in.
                        </li>
                        <li>
                          <strong>Seek support:</strong> Connect with counseling services or support groups.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg mb-2">Important Resources:</h3>
                      <ul className="space-y-3">
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">National Cyber Crime Reporting Portal</p>
                            <p className="text-sm text-muted-foreground">cybercrime.gov.in</p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer">
                              Visit
                            </a>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Cyber Crime Helpline</p>
                            <p className="text-sm text-muted-foreground">1930</p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href="tel:1930">Call</a>
                          </Button>
                        </li>
                        <li className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Women's Cybercrime Helpline</p>
                            <p className="text-sm text-muted-foreground">Women Helpline: 181</p>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href="tel:181">Call</a>
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <a href="tel:1930">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Cyber Crime Helpline (1930)
                  </a>
                </Button>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with JusticeAlly Expert
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

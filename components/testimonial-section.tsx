import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TestimonialSection() {
  return (
    <section className="bg-slate-50 py-12 md:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            JusticeAlly has helped thousands of people navigate complex legal situations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Priya S." />
                  <AvatarFallback>PS</AvatarFallback>
                </Avatar>
                <h3 className="font-bold">Priya S.</h3>
                <p className="text-sm text-muted-foreground">Delhi</p>
              </div>
              <p className="text-center italic">
                "JusticeAlly helped me understand my rights as a tenant when my landlord was trying to unfairly increase
                my rent. The document generator created a perfect response letter!"
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Rahul M." />
                  <AvatarFallback>RM</AvatarFallback>
                </Avatar>
                <h3 className="font-bold">Rahul M.</h3>
                <p className="text-sm text-muted-foreground">Bangalore</p>
              </div>
              <p className="text-center italic">
                "As a freelancer, I was always worried about contract terms. JusticeAlly simplified the legal jargon and
                helped me negotiate better terms with clients."
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Ananya K." />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>
                <h3 className="font-bold">Ananya K.</h3>
                <p className="text-sm text-muted-foreground">Mumbai</p>
              </div>
              <p className="text-center italic">
                "When I faced workplace harassment, I didn't know what to do. JusticeAlly guided me through the process
                of filing a complaint and connected me with a support organization."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

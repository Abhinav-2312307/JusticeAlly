import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Scale, FileText, MessageSquare, AlertTriangle, BookOpen, Info } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Scale className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">JusticeAlly</span>
        </Link>
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-slate-900 to-slate-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/tools/legal-assistant"
                      >
                        <MessageSquare className="h-6 w-6 text-white" />
                        <div className="mb-2 mt-4 text-lg font-medium text-white">Legal Assistant</div>
                        <p className="text-sm leading-tight text-white/90">
                          Get answers to your legal questions and guidance for your specific situation.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem
                    href="/tools/document-simplifier"
                    title="Document Simplifier"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                  >
                    Simplify complex legal documents into plain language
                  </ListItem>
                  <ListItem
                    href="/tools/document-generator"
                    title="Document Generator"
                    icon={<BookOpen className="h-4 w-4 mr-2" />}
                  >
                    Create legal documents tailored to your needs
                  </ListItem>
                  <ListItem href="/emergency" title="Emergency Help" icon={<AlertTriangle className="h-4 w-4 mr-2" />}>
                    Get immediate guidance for urgent legal situations
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <ListItem
                    href="https://know-your-right-lib.vercel.app/"
                    title="Know Your Rights"
                    icon={<Info className="h-4 w-4 mr-2" />}
                  >
                    Comprehensive guides on legal rights for citizens
                  </ListItem>
                  <ListItem
                    href="https://know-your-right-lib.vercel.app/"
                    title="Legal Library"
                    icon={<BookOpen className="h-4 w-4 mr-2" />}
                  >
                    Access simplified explanations of laws and regulations
                  </ListItem>
                  <ListItem
                    href="/resources/templates"
                    title="Document Templates"
                    icon={<FileText className="h-4 w-4 mr-2" />}
                  >
                    Free templates for common legal documents
                  </ListItem>
                  <ListItem
                    href="/resources/directory"
                    title="Legal Aid Directory"
                    icon={<Info className="h-4 w-4 mr-2" />}
                  >
                    Find legal aid organizations and pro bono services
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild className="hidden md:flex">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              asChild
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Link href="/emergency">
                <AlertTriangle className="h-5 w-5" />
                <span className="sr-only">Emergency</span>
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

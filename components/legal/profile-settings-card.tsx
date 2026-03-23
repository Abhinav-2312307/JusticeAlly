"use client"

import { useState } from "react"
import { Loader2, Save, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import type { UserProfile } from "@/lib/db"

interface ProfileSettingsCardProps {
  initialProfile: UserProfile
}

const issueOptions = [
  { value: "general", label: "General guidance" },
  { value: "housing", label: "Housing / tenancy" },
  { value: "employment", label: "Employment / wages" },
  { value: "family", label: "Family / domestic violence" },
  { value: "cyber", label: "Cybercrime / privacy" },
  { value: "police", label: "Police / detention" },
]

const languageOptions = ["English", "Hindi", "Bengali", "Marathi", "Tamil", "Telugu", "Kannada", "Gujarati"]
const contactOptions = ["Email", "Phone", "WhatsApp", "Any"]

export function ProfileSettingsCard({ initialProfile }: ProfileSettingsCardProps) {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    ...initialProfile,
    preferredLanguage: initialProfile.preferredLanguage || "English",
    contactPreference: initialProfile.contactPreference || "Email",
    primaryIssue: initialProfile.primaryIssue || "general",
  })
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name ?? "",
          phoneNumber: profile.phoneNumber ?? "",
          city: profile.city,
          state: profile.state,
          preferredLanguage: profile.preferredLanguage,
          contactPreference: profile.contactPreference,
          primaryIssue: profile.primaryIssue,
          safetyNotes: profile.safetyNotes,
        }),
      })

      const data = (await response.json()) as { profile?: UserProfile; error?: string }

      if (!response.ok || !data.profile) {
        throw new Error(data.error ?? "Could not save profile details.")
      }

      setProfile(data.profile)
      toast({
        title: "Profile saved",
        description: "Workspace details have been updated for future sessions.",
      })
    } catch (error) {
      toast({
        title: "Could not save profile",
        description: error instanceof Error ? error.message : "Try again in a moment.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="glass-panel border-white/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Intake profile
        </CardTitle>
        <CardDescription>Store the details that matter for repeat legal help and safer follow-up.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Full name</Label>
            <Input
              id="profile-name"
              value={profile.name ?? ""}
              onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">Phone number</Label>
            <Input
              id="profile-phone"
              value={profile.phoneNumber ?? ""}
              onChange={(event) => setProfile((current) => ({ ...current, phoneNumber: event.target.value }))}
              placeholder="+91..."
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-city">City</Label>
            <Input
              id="profile-city"
              value={profile.city}
              onChange={(event) => setProfile((current) => ({ ...current, city: event.target.value }))}
              placeholder="Mumbai"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-state">State</Label>
            <Input
              id="profile-state"
              value={profile.state}
              onChange={(event) => setProfile((current) => ({ ...current, state: event.target.value }))}
              placeholder="Maharashtra"
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Preferred language</Label>
            <Select
              value={profile.preferredLanguage}
              onValueChange={(value) => setProfile((current) => ({ ...current, preferredLanguage: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Preferred contact</Label>
            <Select
              value={profile.contactPreference}
              onValueChange={(value) => setProfile((current) => ({ ...current, contactPreference: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contactOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Primary issue type</Label>
          <Select
            value={profile.primaryIssue}
            onValueChange={(value) => setProfile((current) => ({ ...current, primaryIssue: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {issueOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-safety">Safety notes or urgent concerns</Label>
          <Textarea
            id="profile-safety"
            value={profile.safetyNotes}
            onChange={(event) => setProfile((current) => ({ ...current, safetyNotes: event.target.value }))}
            className="min-h-[130px]"
            placeholder="Immediate risks, deadlines, threats, police involvement, or special accommodations."
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-950">
          <p>Use this section to save stable facts, not passwords, card numbers, or highly sensitive secrets.</p>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { WelcomeHeader } from "@/components/welcome-header"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { Dashboard } from "@/components/dashboard"

export interface UserProfile {
  name: string
  age: number
  classLevel: number
  reason: string
  completedOnboarding: boolean
}

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile({ ...profile, completedOnboarding: true })
  }

  return (
    <div className="min-h-screen relative">
      <WelcomeHeader userName={userProfile?.name} />

      {!userProfile?.completedOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard userProfile={userProfile} />
      )}
    </div>
  )
}

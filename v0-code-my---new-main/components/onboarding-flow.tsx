"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import type { UserProfile } from "@/app/page"

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    classLevel: "",
    name: "",
    age: "",
    reason: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      onComplete({
        name: formData.name,
        age: Number.parseInt(formData.age),
        classLevel: Number.parseInt(formData.classLevel),
        reason: formData.reason,
        completedOnboarding: true,
      })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.classLevel !== ""
      case 2:
        return formData.name.trim() !== ""
      case 3:
        return formData.age !== "" && Number.parseInt(formData.age) > 0
      case 4:
        return formData.reason.trim() !== ""
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-serif bg-rose-100">
      <div className="w-full max-w-2xl rounded-4xl shadow-xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-primary">Let's Get Started!</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="animate-bounce-gentle rounded-2xl border-foreground">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">
              {currentStep === 1 && "🎓"}
              {currentStep === 2 && "👋"}
              {currentStep === 3 && "🎂"}
              {currentStep === 4 && "💭"}
            </div>
            <CardTitle className="text-2xl shadow rounded-2xl">
              {currentStep === 1 && "Select Your Class"}
              {currentStep === 2 && "What's Your Name?"}
              {currentStep === 3 && "How Old Are You?"}
              {currentStep === 4 && "Why Do You Want to Learn?"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Choose your current class level to get personalized content"}
              {currentStep === 2 && "We'd love to know what to call you!"}
              {currentStep === 3 && "This helps us customize your learning experience"}
              {currentStep === 4 && "Tell us what motivates you to use this app"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Class Selection */}
            {currentStep === 1 && (
              <RadioGroup
                value={formData.classLevel}
                onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {[6, 7, 8, 9, 10, 11, 12].map((classNum) => (
                  <div key={classNum} className="flex items-center space-x-2 rounded-2xl shadow-none">
                    <RadioGroupItem value={classNum.toString()} id={`class-${classNum}`} />
                    <Label
                      htmlFor={`class-${classNum}`}
                      className="flex-1 p-4 border cursor-pointer hover:bg-accent transition-colors text-center font-medium rounded-2xl border-foreground shadow-xl"
                    >
                      Class {classNum}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 2: Name Input */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Label htmlFor="name" className="text-lg font-medium">
                  Enter your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your awesome name..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-lg p-6 rounded-4xl"
                  autoFocus
                />
              </div>
            )}

            {/* Step 3: Age Input */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Label htmlFor="age" className="text-lg font-medium">
                  Enter your age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age..."
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="text-lg p-6 rounded-2xl"
                  min="5"
                  max="25"
                  autoFocus
                />
              </div>
            )}

            {/* Step 4: Reason */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Label htmlFor="reason" className="text-lg font-medium rounded-2xl">
                  Why do you want to use this learning app?
                </Label>
                <Textarea
                  id="reason"
                  placeholder="I want to improve my grades, learn new concepts, prepare for exams..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="min-h-32 text-lg p-4 rounded-2xl"
                  autoFocus
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 rounded-4xl border-foreground">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-8 bg-transparent"
              >
                Back
              </Button>
              <Button onClick={handleNext} disabled={!isStepValid()} className="px-8 animate-pulse-glow rounded-2xl border-card-foreground">
                {currentStep === totalSteps ? "Start Learning!" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

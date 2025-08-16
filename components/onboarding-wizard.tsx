"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Check, User, Building, Target, Settings } from "lucide-react"

interface FormData {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Company Info
  companyName: string
  companySize: string
  industry: string
  role: string

  // Goals & Preferences
  primaryGoal: string
  features: string[]
  budget: string
  timeline: string

  // Additional Info
  experience: string
  challenges: string
  referralSource: string
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyName: "",
  companySize: "",
  industry: "",
  role: "",
  primaryGoal: "",
  features: [],
  budget: "",
  timeline: "",
  experience: "",
  challenges: "",
  referralSource: "",
}

const steps = [
  { id: 1, title: "Personal Information", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Company Details", icon: Building, description: "Your organization info" },
  { id: 3, title: "Goals & Preferences", icon: Target, description: "What you want to achieve" },
  { id: 4, title: "Additional Details", icon: Settings, description: "Help us customize your experience" },
]

// Enhanced Validation helpers
function validateStep(step: number, formData: FormData): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  if (step === 1) {
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    // Optionally, add email format validation here
  }
  if (step === 2) {
    if (!formData.companyName.trim()) errors.companyName = "Company name is required"
    if (!formData.role.trim()) errors.role = "Role is required"
    if (!formData.companySize.trim()) errors.companySize = "Company size is required"
    if (!formData.industry.trim()) errors.industry = "Industry is required"
  }
  if (step === 3) {
    if (!formData.primaryGoal.trim()) errors.primaryGoal = "Primary goal is required"
    if (!formData.features || formData.features.length === 0) errors.features = "Please select at least one feature"
    if (!formData.budget.trim()) errors.budget = "Budget is required"
    if (!formData.timeline.trim()) errors.timeline = "Implementation timeline is required"
  }
  if (step === 4) {
    // Validate experience if provided
    if (formData.experience && formData.experience.trim() !== "") {
      const validExperienceLevels = ["beginner", "intermediate", "advanced", "expert"]
      if (!validExperienceLevels.includes(formData.experience)) {
        errors.experience = "Please select a valid experience level"
      }
    }
    
    // Validate challenges if provided (ensure it's not just whitespace and has meaningful content)
    if (formData.challenges && formData.challenges.trim() !== "") {
      if (formData.challenges.trim().length < 10) {
        errors.challenges = "Please provide more detailed information about your challenges (at least 10 characters)"
      }
    }
    
    // Validate referral source if provided
    if (formData.referralSource && formData.referralSource.trim() !== "") {
      const validReferralSources = ["google", "social-media", "referral", "content", "advertising", "event", "other"]
      if (!validReferralSources.includes(formData.referralSource)) {
        errors.referralSource = "Please select a valid referral source"
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}

export default function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isComplete, setIsComplete] = useState(false)
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({})

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setStepErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked ? [...prev.features, feature] : prev.features.filter((f) => f !== feature),
    }))
    setStepErrors((prev) => {
      const newErrors = { ...prev }
      if (checked && newErrors.features) {
        delete newErrors.features
      }
      return newErrors
    })
  }

  // Helper to check if a dropdown has a value selected (not empty string)
  const isDropdownSelected = (value: string) => value && value.trim() !== ""

  // Helper to check if at least one checkbox is selected (for features)
  const isAnyFeatureSelected = (features: string[]) => Array.isArray(features) && features.length > 0

  // Helper to check if Step 4 has any validation errors
  const hasStep4Errors = (formData: FormData) => {
    if (formData.experience && formData.experience.trim() !== "") {
      const validExperienceLevels = ["beginner", "intermediate", "advanced", "expert"]
      if (!validExperienceLevels.includes(formData.experience)) return true
    }
    
    if (formData.challenges && formData.challenges.trim() !== "") {
      if (formData.challenges.trim().length < 10) return true
    }
    
    if (formData.referralSource && formData.referralSource.trim() !== "") {
      const validReferralSources = ["google", "social-media", "referral", "content", "advertising", "event", "other"]
      if (!validReferralSources.includes(formData.referralSource)) return true
    }
    
    return false
  }

  const nextStep = () => {
    const { valid, errors } = validateStep(currentStep, formData)
    // Additional checks for dropdowns and checkboxes
    let newErrors = { ...errors }

    if (currentStep === 2) {
      if (!isDropdownSelected(formData.companySize)) {
        newErrors.companySize = "Please select a company size"
      }
      if (!isDropdownSelected(formData.industry)) {
        newErrors.industry = "Please select an industry"
      }
    }
    if (currentStep === 3) {
      if (!isAnyFeatureSelected(formData.features)) {
        newErrors.features = "Please select at least one feature"
      }
      if (!isDropdownSelected(formData.budget)) {
        newErrors.budget = "Please select a budget range"
      }
      if (!isDropdownSelected(formData.timeline)) {
        newErrors.timeline = "Please select an implementation timeline"
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setStepErrors(newErrors)
      return
    }
    setStepErrors({})
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setStepErrors({})
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Validate Step 4 before completing
    if (hasStep4Errors(formData)) {
      const { errors } = validateStep(4, formData)
      setStepErrors(errors)
      return
    }
    
    setIsComplete(true)
    console.log("[v0] Onboarding completed with data:", formData)
  }

  const progress = (currentStep / steps.length) * 100

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Welcome aboard!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for completing your onboarding. We're excited to help you achieve your goals with our platform.
            </p>
            <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Getting Started</h1>
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Step Indicators */}
          <div className="flex justify-between mt-6">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-xs text-center ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    placeholder="Enter your first name"
                  />
                  {stepErrors.firstName && (
                    <p className="text-xs text-red-500">{stepErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    placeholder="Enter your last name"
                  />
                  {stepErrors.lastName && (
                    <p className="text-xs text-red-500">{stepErrors.lastName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    placeholder="Enter your email address"
                  />
                  {stepErrors.email && (
                    <p className="text-xs text-red-500">{stepErrors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Company Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData("companyName", e.target.value)}
                      placeholder="Enter your company name"
                    />
                    {stepErrors.companyName && (
                      <p className="text-xs text-red-500">{stepErrors.companyName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role *</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => updateFormData("role", e.target.value)}
                      placeholder="e.g., CEO, Marketing Manager"
                    />
                    {stepErrors.role && (
                      <p className="text-xs text-red-500">{stepErrors.role}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size *</Label>
                    <Select
                      value={formData.companySize}
                      onValueChange={(value) => updateFormData("companySize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    {stepErrors.companySize && (
                      <p className="text-xs text-red-500">{stepErrors.companySize}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {stepErrors.industry && (
                      <p className="text-xs text-red-500">{stepErrors.industry}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals & Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What's your primary goal with our platform? *</Label>
                  <RadioGroup
                    value={formData.primaryGoal}
                    onValueChange={(value) => updateFormData("primaryGoal", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="increase-sales" id="increase-sales" />
                      <Label htmlFor="increase-sales">Increase sales and revenue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="improve-efficiency" id="improve-efficiency" />
                      <Label htmlFor="improve-efficiency">Improve operational efficiency</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="better-analytics" id="better-analytics" />
                      <Label htmlFor="better-analytics">Get better insights and analytics</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="team-collaboration" id="team-collaboration" />
                      <Label htmlFor="team-collaboration">Enhance team collaboration</Label>
                    </div>
                  </RadioGroup>
                  {stepErrors.primaryGoal && (
                    <p className="text-xs text-red-500">{stepErrors.primaryGoal}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Which features are most important to you? (Select all that apply) *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Advanced Analytics",
                      "Team Management",
                      "API Integration",
                      "Custom Reporting",
                      "Mobile App",
                      "Third-party Integrations",
                    ].map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={formData.features.includes(feature)}
                          onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                        />
                        <Label htmlFor={feature}>{feature}</Label>
                      </div>
                    ))}
                  </div>
                  {stepErrors.features && (
                    <p className="text-xs text-red-500">{stepErrors.features}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Monthly Budget Range *</Label>
                    <Select value={formData.budget} onValueChange={(value) => updateFormData("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-100">Under $100</SelectItem>
                        <SelectItem value="100-500">$100 - $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                        <SelectItem value="5000+">$5,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {stepErrors.budget && (
                      <p className="text-xs text-red-500">{stepErrors.budget}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Implementation Timeline *</Label>
                    <Select value={formData.timeline} onValueChange={(value) => updateFormData("timeline", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (within 1 week)</SelectItem>
                        <SelectItem value="1-month">Within 1 month</SelectItem>
                        <SelectItem value="3-months">Within 3 months</SelectItem>
                        <SelectItem value="6-months">Within 6 months</SelectItem>
                        <SelectItem value="planning">Still planning</SelectItem>
                      </SelectContent>
                    </Select>
                    {stepErrors.timeline && (
                      <p className="text-xs text-red-500">{stepErrors.timeline}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="experience">Previous Experience (Optional)</Label>
                  <Select value={formData.experience} onValueChange={(value) => updateFormData("experience", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How familiar are you with similar tools?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner - New to these types of tools</SelectItem>
                      <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                      <SelectItem value="advanced">Advanced - Very experienced</SelectItem>
                      <SelectItem value="expert">Expert - I could teach others</SelectItem>
                    </SelectContent>
                  </Select>
                  {stepErrors.experience && (
                    <p className="text-xs text-red-500">{stepErrors.experience}</p>
                  )}
                  <p className="text-xs text-muted-foreground">This helps us tailor your onboarding experience</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges">Current Challenges (Optional)</Label>
                  <Textarea
                    id="challenges"
                    value={formData.challenges}
                    onChange={(e) => updateFormData("challenges", e.target.value)}
                    placeholder="Tell us about the main challenges you're facing that our platform could help solve..."
                    rows={4}
                  />
                  {stepErrors.challenges && (
                    <p className="text-xs text-red-500">{stepErrors.challenges}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Provide at least 10 characters if you choose to fill this field</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralSource">How did you hear about us? (Optional)</Label>
                  <Select
                    value={formData.referralSource}
                    onValueChange={(value) => updateFormData("referralSource", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select referral source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="social-media">Social Media</SelectItem>
                      <SelectItem value="referral">Friend/Colleague Referral</SelectItem>
                      <SelectItem value="content">Blog/Content Marketing</SelectItem>
                      <SelectItem value="advertising">Online Advertising</SelectItem>
                      <SelectItem value="event">Conference/Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {stepErrors.referralSource && (
                    <p className="text-xs text-red-500">{stepErrors.referralSource}</p>
                  )}
                  <p className="text-xs text-muted-foreground">This helps us improve our marketing efforts</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep === steps.length ? (
            <Button onClick={handleComplete} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              Complete Setup
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, ChevronRight, ChevronLeft, User, Briefcase } from 'lucide-react'

type FormData = {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
  }
  additionalInfo: {
    occupation: string
    bio: string
    preferredContact: 'email' | 'phone' | 'mail'
  }
}

const steps = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'additional', title: 'Additional Information', icon: Briefcase },
]

export default function MultiStepForm() {
  const [step, setStep] = useState<'personal' | 'additional'>('personal')

  const form = useForm<FormData>({
    defaultValues: {
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
      },
      additionalInfo: {
        occupation: '',
        bio: '',
        preferredContact: 'email',
      },
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data)
    // Handle form submission here
  }

  const validatePersonalInfo = async () => {
    const result = await form.trigger(['personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.email'])
    if (result) {
      setStep('additional')
    }
  }

  const currentStepIndex = steps.findIndex(s => s.id === step)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Multi-Step Form</CardTitle>
          <CardDescription>Please fill out the form to complete your registration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Progress value={progress} className="w-full" />
          </div>
          <div className="flex justify-between mb-6">
            {steps.map((s, index) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white mb-2",
                  index <= currentStepIndex ? "bg-primary" : "bg-gray-300"
                )}>
                  {index < currentStepIndex ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                </div>
                <span className={cn(
                  "text-sm",
                  index <= currentStepIndex ? "text-primary font-medium" : "text-gray-500"
                )}>{s.title}</span>
              </div>
            ))}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 'personal' && (
                <>
                  <FormField
                    control={form.control}
                    name="personalInfo.firstName"
                    rules={{ required: 'First name is required', minLength: { value: 2, message: 'First name must be at least 2 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.lastName"
                    rules={{ required: 'Last name is required', minLength: { value: 2, message: 'Last name must be at least 2 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="personalInfo.email"
                    rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {step === 'additional' && (
                <>
                  <FormField
                    control={form.control}
                    name="additionalInfo.occupation"
                    rules={{ required: 'Occupation is required', minLength: { value: 2, message: 'Occupation must be at least 2 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalInfo.bio"
                    rules={{ required: 'Bio is required', minLength: { value: 10, message: 'Bio must be at least 10 characters' }, maxLength: { value: 500, message: 'Bio must not exceed 500 characters' } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormDescription>
                          Tell us a little about yourself (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="additionalInfo.preferredContact"
                    rules={{ required: 'Please select a preferred contact method' }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="email" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Email
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="phone" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Phone
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="mail" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Mail
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('personal')}
            className={cn(step === 'personal' && 'invisible')}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            type={step === 'additional' ? 'submit' : 'button'}
            onClick={() => {
              if (step === 'personal') {
                validatePersonalInfo()
              } else {
                form.handleSubmit(onSubmit)()
              }
            }}
          >
            {step === 'additional' ? 'Submit' : 'Next'}
            {step === 'personal' && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
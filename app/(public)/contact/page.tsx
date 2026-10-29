"use client"

import * as React from "react"
import { Mail, MessageSquare, MapPin, Clock, Send, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSent, setIsSent] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
    setIsSent(true)
    toast.success("Message received!", {
      description: "Thank you for reaching out. An EduFlow team member will get back to you shortly.",
    })
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>We&apos;re Here to Help</span>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Get in Touch with the EduFlow Team
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
            Have questions about a course, suggestions for our curriculum, or interested in becoming an instructor? Drop us a note.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Info cards (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Email Support
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Direct inquiries for technical issues, suggestions, or curriculum feedback.
                  </p>
                  <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    support@eduflow.org
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Teach on EduFlow
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Want to publish a course or collaborate with our academic authors?
                  </p>
                  <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    instructors@eduflow.org
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/70 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    Response Hours
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Our community volunteers review incoming messages Monday through Friday. We typically respond within 24 to 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form card (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="rounded-2xl border-zinc-200/80 shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
              <CardHeader className="p-6 sm:p-8">
                <CardTitle className="text-2xl font-bold">Send us a message</CardTitle>
                <CardDescription className="text-zinc-500">
                  Fill out the form below and we will route your inquiry to the appropriate coordinator.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
                {isSent ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-6 text-center dark:border-emerald-900/50 dark:bg-emerald-950/30">
                    <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-200">
                      Message Sent Successfully
                    </h3>
                    <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-400">
                      We have received your message and will get back to you soon.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSent(false)}
                      className="mt-4 rounded-xl"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          placeholder="Jane Doe"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="jane@example.com"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        placeholder="Course inquiry, feedback, or partnership"
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="How can we assist you?"
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full gap-2 rounded-xl bg-indigo-600 font-semibold text-white hover:bg-indigo-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Sending message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { PlusCircle, Loader2, X } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(255, { message: "Title cannot exceed 255 characters" }),
})

type FormValues = z.infer<typeof formSchema>

interface ChapterFormProps {
  courseId: string
}

export function ChapterForm({ courseId }: ChapterFormProps) {
  const [isCreating, setIsCreating] = React.useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  const toggleCreating = () => {
    setIsCreating((current) => !current)
    form.reset({ title: "" })
  }

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`/api/courses/${courseId}/chapters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to create chapter")
      }

      toast.success("Chapter created successfully")
      setIsCreating(false)
      form.reset({ title: "" })
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <div className="mt-2">
      {!isCreating && (
        <Button
          onClick={toggleCreating}
          variant="outline"
          size="sm"
          className="w-full border-dashed py-5 hover:border-primary hover:bg-primary/5"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add a chapter
        </Button>
      )}

      {isCreating && (
        <div className="rounded-lg border bg-muted/40 p-4 animate-in fade-in-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold">New chapter</span>
            <Button
              onClick={toggleCreating}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={isSubmitting}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Cancel
            </Button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Introduction to the course'"
                        className="h-9 bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} size="sm" type="submit">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create chapter"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}

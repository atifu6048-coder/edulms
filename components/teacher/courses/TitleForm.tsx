"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Pencil, Loader2, X } from "lucide-react"

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

interface TitleFormProps {
  initialData: {
    title: string
  }
  courseId: string
}

export function TitleForm({ initialData, courseId }: TitleFormProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const { isSubmitting, isValid } = form.formState

  const toggleEdit = () => {
    setIsEditing((current) => !current)
    form.reset(initialData)
  }

  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || "Failed to update course title")
      }

      toast.success("Course title updated")
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    }
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-xs">
      <div className="flex items-center justify-between font-medium text-foreground">
        <span className="text-sm font-semibold">Course title</span>
        <Button onClick={toggleEdit} variant="ghost" size="sm" className="h-8 px-2 text-xs">
          {isEditing ? (
            <>
              <X className="mr-1.5 h-3.5 w-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className="mt-2 text-sm text-foreground font-medium">
          {initialData.title}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced Web Development'"
                      className="h-9"
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
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

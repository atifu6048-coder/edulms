"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Loader2,
  AlertCircle,
  Hash,
} from "lucide-react"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmModal } from "@/components/shared/ConfirmModal"

export interface CategoryItem {
  id: string
  name: string
  description?: string | null
  coursesCount: number
  createdAt: Date | string
}

interface CategoryManagementProps {
  initialCategories: CategoryItem[]
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function CategoryManagement({
  initialCategories,
}: CategoryManagementProps) {
  const router = useRouter()
  const [categories, setCategories] =
    React.useState<CategoryItem[]>(initialCategories)
  const [isLoading, setIsLoading] = React.useState(false)

  // Create Dialog state
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [createName, setCreateName] = React.useState("")
  const [createSlug, setCreateSlug] = React.useState("")
  const [slugManualEdit, setSlugManualEdit] = React.useState(false)

  // Edit Dialog state
  const [editCategory, setEditCategory] = React.useState<CategoryItem | null>(null)
  const [editName, setEditName] = React.useState("")
  const [editSlug, setEditSlug] = React.useState("")

  React.useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  // Auto-slug generation for create
  const handleNameChange = (name: string) => {
    setCreateName(name)
    if (!slugManualEdit) {
      setCreateSlug(slugify(name))
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createName.trim()) {
      toast.error("Category name is required.")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName.trim(),
          description: createSlug.trim() || slugify(createName),
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create category.")
      }

      toast.success("Category created successfully")
      setIsCreateOpen(false)
      setCreateName("")
      setCreateSlug("")
      setSlugManualEdit(false)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditCategory(cat)
    setEditName(cat.name)
    setEditSlug(cat.description || slugify(cat.name))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editCategory) return

    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/categories/${editCategory.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editSlug.trim() || slugify(editName),
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update category.")
      }

      toast.success("Category updated successfully")
      setEditCategory(null)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (categoryId: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete category.")
      }

      toast.success("Category removed")
      setCategories((prev) => prev.filter((c) => c.id !== categoryId))
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.length} total categories registered in catalog.
        </p>

        <Button
          onClick={() => {
            setIsCreateOpen(true)
            setCreateName("")
            setCreateSlug("")
            setSlugManualEdit(false)
          }}
          className="font-semibold shadow-xs"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[300px]">Category Name</TableHead>
              <TableHead>Auto Slug / Identifier</TableHead>
              <TableHead className="w-[140px] text-center">Courses</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No categories found. Click "Add Category" to create one.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => {
                const slug = cat.description || slugify(cat.name)
                const hasCourses = cat.coursesCount > 0

                return (
                  <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">
                    {/* Name */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FolderTree className="h-4 w-4" />
                        </div>
                        <span className="font-semibold text-sm text-foreground">
                          {cat.name}
                        </span>
                      </div>
                    </TableCell>

                    {/* Slug */}
                    <TableCell>
                      <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                        <Hash className="h-3.5 w-3.5 text-muted-foreground/60" />
                        <span>{slug}</span>
                      </div>
                    </TableCell>

                    {/* Course Count */}
                    <TableCell className="text-center">
                      <Badge
                        variant={hasCourses ? "default" : "outline"}
                        className="text-xs font-semibold"
                      >
                        {cat.coursesCount} {cat.coursesCount === 1 ? "course" : "courses"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenEdit(cat)}
                          title="Edit category"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>

                        {hasCourses ? (
                          <div title={`Cannot delete: ${cat.coursesCount} active course(s) assigned`}>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              disabled
                              className="opacity-40 cursor-not-allowed"
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ) : (
                          <ConfirmModal
                            title="Delete Category"
                            description={`Are you sure you want to delete category "${cat.name}"? This action cannot be undone.`}
                            confirmText="Delete"
                            onConfirm={() => handleDelete(cat.id)}
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:bg-destructive/10"
                              title="Delete category"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </ConfirmModal>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Category Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Category</DialogTitle>
            <DialogDescription>
              Create a new course classification topic with an auto-generated URL slug.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="create-name" className="text-xs font-semibold">
                Category Name
              </Label>
              <Input
                id="create-name"
                value={createName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Artificial Intelligence"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-slug" className="text-xs font-semibold">
                Auto Slug (URL identifier)
              </Label>
              <Input
                id="create-slug"
                value={createSlug}
                onChange={(e) => {
                  setCreateSlug(e.target.value)
                  setSlugManualEdit(true)
                }}
                placeholder="e.g. artificial-intelligence"
                className="h-10 font-mono text-xs"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="font-semibold shadow-xs">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={Boolean(editCategory)} onOpenChange={(open) => !open && setEditCategory(null)}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Edit Category</DialogTitle>
            <DialogDescription>
              Update category title or adjust its slug identifier.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-xs font-semibold">
                Category Name
              </Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value)
                  setEditSlug(slugify(e.target.value))
                }}
                required
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug" className="text-xs font-semibold">
                Slug Identifier
              </Label>
              <Input
                id="edit-slug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                className="h-10 font-mono text-xs"
              />
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditCategory(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="font-semibold shadow-xs">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

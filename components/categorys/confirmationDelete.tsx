import React from 'react'
import Modal from '../ui/Modal'
import { Category } from '@/types'
import { Button } from '../ui/button'

interface DeleteProps {
  setDeletingCategory: (val: Category | null) => void
  deletingCategory: Category
  handleDelete: (id: string) => void
  isLoading: boolean
}
export default function ConfirmationDelete({ setDeletingCategory, deletingCategory, handleDelete, isLoading }: DeleteProps) {
  return (
    <Modal
      title="Delete Category"
      onClose={() => setDeletingCategory(null)}
    >
      <div className="space-y-4">
        <p className="text-foreground">
          Are you sure you want to delete the category <strong>{deletingCategory.name}</strong>?
        </p>
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => setDeletingCategory(null)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading}
            loading={isLoading}
            onClick={() => handleDelete(deletingCategory._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}

import React from 'react'
import Modal from './Modal'
import { Category } from '@/types'
import { Button } from '../ui/button'

interface DeleteProps {
    setDeletingCategory: (val:Category | null) => void
    deletingCategory: Category
    handleDelete:(val: Category , id:string) => void
}
export default function ConfirmationDelete({setDeletingCategory ,deletingCategory , handleDelete } : DeleteProps) {
  return (
    <Modal
            title="Delete Category"
            onClose={() => setDeletingCategory(null)}
          >
            <div className="space-y-4">
              <p className="text-foreground">
                Are you sure you want to delete the category <strong>{deletingCategory.name}</strong>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeletingCategory(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(deletingCategory , deletingCategory._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Modal>
  )
}

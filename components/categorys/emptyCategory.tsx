import React from 'react'
import { motion,  } from "framer-motion"
import { Add24Regular, Folder24Regular } from '@fluentui/react-icons'
import { Button } from '../ui/button'

interface Props {
    setIsAddModalOpen: (value: boolean)=> void
}
export default function EmptyCategory({setIsAddModalOpen} : Props ) {
  return (
    <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Folder24Regular className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No categories yet</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first category</p>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Add24Regular className="w-5 h-5" />
            Add Category
          </Button>
        </motion.div>
  )
}

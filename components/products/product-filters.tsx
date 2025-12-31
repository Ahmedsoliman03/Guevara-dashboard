"use client"

import { motion } from "framer-motion"
import {
    Search24Regular,
    Filter24Regular,
    Dismiss24Regular,
    Box24Regular
} from "@fluentui/react-icons"
import { Input } from "@/components/ui/input"
import { Category, CategoryCompany } from "@/types"


import { CustomSelect } from "@/components/ui/custom-select"

interface ProductFiltersProps {
    categories: Category[]
    categoryCompanies: CategoryCompany[]
    selectedCategory: string
    setSelectedCategory: (category: string) => void
    selectedCompany: string
    setSelectedCompany: (company: string) => void
    searchTerm: string
    setSearchTerm: (term: string) => void
    isLoading?: boolean
}

export function ProductFilters({
    categories,
    categoryCompanies,
    selectedCategory,
    setSelectedCategory,
    selectedCompany,
    setSelectedCompany,
    searchTerm,
    setSearchTerm,
    isLoading
}: ProductFiltersProps) {

    // Get companies for the selected category
    const activeCompanies = categoryCompanies?.find(cc => cc.categoryName === selectedCategory)?.companies || []

    // Prepare options for category select
    const categoryOptions = [
        { label: "All Categories", value: "All" },
        ...categories.map(cat => ({ label: cat.name, value: cat.name }))
    ]

    // Prepare options for company select
    const companyOptions = [
        { label: selectedCategory === "All" ? "Select Category First" : "All Companies", value: "All" },
        ...activeCompanies.map(comp => ({ label: comp, value: comp }))
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4"
        >
            <div className="flex flex-col lg:flex-row gap-6 items-end relative">
                {/* Search Input */}
                <div className="flex-1 w-full space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2">
                        <Search24Regular className="w-4 h-4 text-primary" />
                        Search Products
                    </label>
                    <div className="relative group">
                        <Input
                            placeholder="Type to search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-4 pr-10 h-11 bg-background dark:bg-input/20 border-border group-hover:border-primary/50 focus-visible:ring-primary/20 transition-all duration-300 rounded-lg"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            >
                                <Dismiss24Regular className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Select */}
                <div className="w-full lg:w-72 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2">
                        <Filter24Regular className="w-4 h-4 text-primary" />
                        Category
                    </label>
                    <CustomSelect
                        value={selectedCategory}
                        options={categoryOptions}
                        onChange={(val) => {
                            setSelectedCategory(val)
                            setSelectedCompany("All")
                        }}
                    />
                </div>

                {/* Company Select */}
                <div className="w-full lg:w-72 space-y-2">
                    <label className="text-sm font-medium text-muted-foreground ml-1 flex items-center gap-2">
                        <Box24Regular className="w-4 h-4 text-primary" />
                        Company
                    </label>
                    <CustomSelect
                        value={selectedCompany}
                        options={companyOptions}
                        disabled={selectedCategory === "All" || activeCompanies.length === 0}
                        onChange={(val) => setSelectedCompany(val)}
                    />
                </div>
            </div>


            {/* Loading State Indicator */}
            <div className="h-1 w-full overflow-hidden rounded-full bg-muted/30 mt-2">
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={isLoading ? { x: "100%" } : { x: "-100%" }}
                    transition={{
                        repeat: isLoading ? Infinity : 0,
                        duration: 1.5,
                        ease: "easeInOut"
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
            </div>
        </motion.div>
    )
}

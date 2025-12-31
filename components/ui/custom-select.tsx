"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronDown24Regular, Checkmark24Regular } from "@fluentui/react-icons"

interface Option {
    label: string
    value: string
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    disabled?: boolean
    className?: string
}

export function CustomSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    disabled = false,
    className,
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    // Close when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full", className)}
        >
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex h-11 w-full items-center justify-between rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-[3px] focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
                    isOpen ? "border-ring ring-[3px] ring-ring/20" : "hover:border-ring/50",
                    "dark:bg-input/30 shadow-sm"
                )}
            >
                <span className={cn("truncate", !selectedOption && "text-muted-foreground font-normal")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground ml-2"
                >
                    <ChevronDown24Regular className="h-4 w-4" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-[100] w-full min-w-[12rem] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg outline-none"
                    >
                        <div className="max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-muted-foreground/20 p-1">
                            {options.length === 0 ? (
                                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                                    No options available
                                </div>
                            ) : (
                                options.map((option) => {
                                    const isSelected = value === option.value
                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                onChange(option.value)
                                                setIsOpen(false)
                                            }}
                                            className={cn(
                                                "relative flex w-full cursor-pointer select-none items-center justify-between rounded-md px-3 py-2 text-sm outline-none transition-all",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                                    : "text-popover-foreground hover:bg-accent/10 hover:text-accent"
                                            )}
                                        >
                                            <span className="truncate">{option.label}</span>
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="checkmark"
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="ml-2"
                                                >
                                                    <Checkmark24Regular className="h-3.5 w-3.5" />
                                                </motion.div>
                                            )}
                                        </button>
                                    )
                                })
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

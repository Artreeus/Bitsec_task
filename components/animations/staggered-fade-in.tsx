"use client"

import React from "react"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface StaggeredFadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
}

export default function StaggeredFadeIn({
  children,
  className = "",
  delay = 0,
  staggerDelay = 0.1,
}: StaggeredFadeInProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: staggerDelay,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

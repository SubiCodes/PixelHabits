"use client"

import { useEffect, useState } from "react"

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("hero")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { id } = entry.target
          // When the section takes up most of the viewport
          if (entry.intersectionRatio >= 0.5) {
            setActiveSection(id)
          }
        })
      },
      {
        // Section must take up 50% of the viewport to be considered active
        threshold: [0.5],
        // Remove the margin to make detection more precise
        rootMargin: "0px"
      }
    )

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [])

  return activeSection
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    const navbar = document.querySelector("header")
    const navbarHeight = navbar?.offsetHeight || 0
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - navbarHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    })
  }
}
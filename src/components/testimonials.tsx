'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const testimonials = [
  {
    quote: "Nura has transformed how Afsar Developers evaluates projects. Their platform helps us analyze opportunities, understand zoning, and make confident decisions while saving us months of work. By turning complex data into clear recommendations, Nura allows our team to move faster, reduce risk, and focus on the projects that matter most.",
    name: "Hasan Syed",
    position: "Partner",
    company: "AFSAR DEVELOPERS",
    logo: "/afsarlogo-removebg-preview.png"
  },
  {
    quote: "Nura changed how our team evaluates development opportunities. What used to take months of data gathering and manual modeling now happens in a single afternoon. The conversational interface and instant report generation give us clear answers on zoning, costs, and site potential so we can focus on the projects that matter and move faster with confidence.",
    name: "John Midby",
    position: "Partner",
    company: "THE MIDBYCOMPANIES",
    logo: "/the_midby_companies_logo.jpg"
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <div className="relative z-10 w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 py-32">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-16">
          <div className="text-left">
            <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-2">
              What Customers Say
            </h2>
            <h2 className="font-canela text-gray-500 text-4xl md:text-5xl">
              About Nura
            </h2>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonial Card */}
        <div className="relative bg-amber-50 rounded-2xl p-12 md:p-16 overflow-hidden">
          <div className="relative z-10">
            {/* Quote */}
            <blockquote className="font-canela text-2xl md:text-4xl font-medium text-gray-800 leading-relaxed mb-12">
              "{testimonials[currentIndex].quote}"
            </blockquote>
            
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-manrope font-semibold text-lg text-gray-900">
                  {testimonials[currentIndex].name}
                </div>
                <div className="font-manrope text-gray-600">
                  {testimonials[currentIndex].position}
                </div>
                <div className="font-manrope text-gray-500 text-sm">
                  {testimonials[currentIndex].company}
                </div>
              </div>
              
              {/* Company Logo */}
              <div className="relative w-24 h-12 md:w-32 md:h-16">
                <Image
                  src={testimonials[currentIndex].logo}
                  alt={testimonials[currentIndex].company}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
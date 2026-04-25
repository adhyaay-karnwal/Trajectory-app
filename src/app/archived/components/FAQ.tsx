'use client'

import { useState } from 'react'

const faqs = [
  {
    question: "What does Petal actually do?",
    answer: "Petal analyzes zoning codes, land-use rules, parcel data, and market information to instantly tell you what can legally be built on a property. It produces a clear, lender-ready feasibility report in minutes — replacing months of manual work."
  },
  {
    question: "Does Petal create architectural drawings?",
    answer: "No. Petal does not produce architectural drawings, 3D models, or floor plans. It tells you what is allowed and what is feasible — architects and designers still create the actual building plans."
  },
  {
    question: "Who is Petal Built for?",
    answer: "Petal is designed for real estate developers, lenders, architects, consultants, and anyone involved in early-stage site evaluation. It helps teams move faster, reduce risk, and identify winning opportunities before competitors do."
  },
  {
    question: "What types of reports does Petal generate?",
    answer: "Petal outputs a complete, cited feasibility report that includes buildable envelope, allowable uses, risks, constraints, and multiple development scenarios. The report is lender-grade and ready to share internally or with partners."
  }
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div id="faq" className="relative z-10 w-full bg-white">
      <div className="max-w-4xl mx-auto px-4 py-32">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-canela text-4xl md:text-5xl font-medium text-black mb-2">
            Frequently Asked
          </h2>
          <h2 className="font-canela text-gray-500 text-4xl md:text-5xl">
            Questions
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg"
              >
                <h3 className="font-manrope text-lg md:text-xl font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-6 h-6 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className="text-gray-600"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </button>
              
              {/* Answer */}
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pb-6 px-4 -mx-4">
                  <p className="font-manrope text-base md:text-lg text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { X, ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  categoryQuestion,
  subCategoryQuestions,
  destinationQuestion,
  segmentSpecificQuestions,
  universalFollowUps,
  calculateScore,
} from '../lib/quizData'

function OptionCard({ option, isSelected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(option)}
      type="button"
      role="radio"
      aria-checked={isSelected}
      className={cn(
        "flex items-center text-left w-full p-4 md:p-5 border rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isSelected
          ? "border-primary bg-blue-50/50 shadow-sm"
          : "border-gray-200 hover:border-primary/40 hover:bg-gray-50/50",
      )}
    >
      <div className="mr-3 shrink-0">
        {isSelected ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-gray-300" strokeWidth={1.5} />
        )}
      </div>
      <span
        className={cn(
          "text-base font-medium transition-colors",
          isSelected ? "text-blue-900" : "text-gray-700",
        )}
      >
        {option}
      </span>
    </button>
  )
}

export default function Quiz() {
  const router = useRouter()
  const [phase, setPhase] = useState('category')
  const [category, setCategory] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const advance = (fn) => {
    setTimeout(() => { fn(); setSelected(null) }, 200)
  }

  const totalSteps = 2 + questions.length
  const currentStep =
    phase === 'category' ? 1
    : phase === 'subcategory' ? 2
    : 2 + currentIndex + 1
  const progress = Math.round((currentStep / Math.max(totalSteps, 8)) * 100)
  const questionNum = currentStep
  const totalNum = Math.max(totalSteps, 8)

  const currentQuestion =
    phase === 'category' ? categoryQuestion
    : phase === 'subcategory' ? subCategoryQuestions[category]
    : questions[currentIndex]

  const handleContinue = () => {
    if (!selected) return

    if (phase === 'category') {
      advance(() => {
        setCategory(selected)
        setAnswers(prev => ({ ...prev, category: selected }))
        setPhase('subcategory')
      })
      return
    }

    if (phase === 'subcategory') {
      const segment = selected === 'Others' ? 'Explorer / Not sure yet' : selected
      const segSpecific = segmentSpecificQuestions[segment] || []
      const fullQuestions = [destinationQuestion, ...segSpecific, ...universalFollowUps]
      advance(() => {
        setAnswers(prev => ({ ...prev, segment }))
        setQuestions(fullQuestions)
        setCurrentIndex(0)
        setPhase('questions')
      })
      return
    }

    const updatedAnswers = { ...answers, [currentQuestion.id]: selected }
    setAnswers(updatedAnswers)

    if (currentIndex < questions.length - 1) {
      advance(() => setCurrentIndex(i => i + 1))
    } else {
      const finalScore = calculateScore(updatedAnswers)
      router.push(`/report?score=${finalScore}&answers=${encodeURIComponent(JSON.stringify(updatedAnswers))}`)
    }
  }

  const handleBack = () => {
    if (phase === 'category') { router.push('/'); return }
    if (phase === 'subcategory') {
      advance(() => { setPhase('category'); setCategory(null) })
      return
    }
    if (phase === 'questions' && currentIndex === 0) {
      advance(() => setPhase('subcategory'))
      return
    }
    advance(() => setCurrentIndex(i => i - 1))
  }

  const isFirstQuestion = phase === 'category'
  const isLastQuestion =
    phase === 'questions' && currentIndex === questions.length - 1

  return (
    <>
      <Head><title>JapaLearn AI — Migration Assessment</title></Head>

      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navbar */}
        <div className="pt-4 px-4 md:px-8">
          <Navbar />
        </div>

        <main className="grow flex flex-col items-center justify-start pt-32 pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-3xl mx-auto">
          {/* Cancel / Back */}
          <div className="w-full mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors font-medium"
            >
              {isFirstQuestion ? (
                <><X className="w-5 h-5" /><span className="text-[17px]">Cancel</span></>
              ) : (
                <><ArrowLeft className="w-5 h-5" /><span className="text-[17px]">Back</span></>
              )}
            </button>
          </div>

          {/* Quiz card */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
            {/* Progress */}
            <div className="w-full mb-6">
              <div className="flex justify-between items-end mb-2 text-xs font-medium text-gray-400">
                <span>Readiness Assessment</span>
                <span>Question {questionNum} of {totalNum}</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-gray-100" />
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${phase}-${currentIndex}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full py-2 md:py-4"
              >
                <div className="mb-6 text-center md:text-left">
                  <h1 className="text-2xl md:text-3xl font-heading font-semibold text-gray-900 mb-2 tracking-tight">
                    {currentQuestion?.question}
                  </h1>
                  {currentQuestion?.subtitle && (
                    <p className="text-gray-500 text-base">{currentQuestion.subtitle}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentQuestion?.options.map((option) => (
                    <OptionCard
                      key={option}
                      option={option}
                      isSelected={selected === option}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="w-full mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <div>
                {!isFirstQuestion && (
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 font-medium pl-0 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
              </div>

              <Button
                onClick={handleContinue}
                disabled={!selected}
                className="bg-primary hover:bg-primary/90 text-white min-w-[120px] rounded-full text-base py-5 shadow-sm"
              >
                {isLastQuestion ? "View Results" : "Continue"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

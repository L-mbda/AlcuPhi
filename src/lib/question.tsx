"use client"

import { MathRender } from "@/components/ui/math-renderer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2, History, Clock, FileQuestion, Circle, X, Lightbulb, Sparkles, ArrowRight, HelpCircle, RefreshCw } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { availableSources } from "./sources"
import { toast } from "@/hooks/use-toast"

// Interface
interface Question {
  id: number
  type: string | null
  questionName: string | null
  answerChoices: string[]
  correctAnswer?: string // For free response questions
}

export function QuestionSection({ communityID, intent }: { communityID: string | undefined; intent: number }) {
  const [question, setQuestion] = useState<Question>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [freeResponseAnswer, setFreeResponseAnswer] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState<number[]>([])
  const [correctFreeResponseAnswer, setCorrectFreeResponseAnswer] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [explanation, setExplanation] = useState<string>("")
  const [isExplaining, setIsExplaining] = useState(false)
  const [explanationError, setExplanationError] = useState<string | null>(null)

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const data = await fetch("/api/practice", {
          method: "POST",
          body: JSON.stringify({
            method: "GET_QUESTION",
            setID: communityID,
            intent: intent,
          }),
        })

        const json = await data.json()
        if (json.question !== undefined && json.question !== "NONE") {
          setQuestion(json.question)
        } else {
          setError("No questions available")
        }
      } catch (err) {
        setError("Failed to load question")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [communityID, intent])

  const handleSubmit = () => {
    setSubmitted(true)
    setSubmitting(true) // Set submitting to true when starting the request

    if (question?.type === "multipleChoice") {
      const selectedIndex = selectedAnswer ? Number.parseInt(selectedAnswer.split("-")[1]) : -1
      fetch("/api/practice", {
        method: "PATCH",
        body: JSON.stringify({
          questionID: question?.id,
          response: selectedAnswer,
          intent: intent,
        }),
      })
        .then((d) =>
          d.json().then((res) => {
            // Handle multiple correct answers
            const correctIndices: number[] = []
            res.correctAnswer.forEach((piece: string) => {
              correctIndices.push(Number.parseInt(piece.split("-")[1]) - 1)
            })
            setCorrectAnswerIndices(correctIndices)
            setSubmitting(false) // Set submitting to false when request completes
          }),
        )
        .catch((err) => {
          console.error(err)
          setSubmitting(false) // Also handle errors
        })
    } else if (question?.type === "freeResponse") {
      // Free response handling remains the same
      fetch("/api/practice", {
        method: "PATCH",
        body: JSON.stringify({
          questionID: question?.id,
          response: freeResponseAnswer,
        }),
      })
        .then((d) =>
          d.json().then((res) => {
            const referenceAnswer = res.correctAnswer[0] || "Sample answer" // Fallback for demo
            setCorrectFreeResponseAnswer(referenceAnswer)
            setSubmitting(false) // Set submitting to false when request completes
          }),
        )
        .catch((err) => {
          console.error(err)
          setSubmitting(false) // Also handle errors
        })
    }
  }

  const handleNextQuestion = () => {
    setSubmitted(false)
    setSelectedAnswer(null)
    setFreeResponseAnswer("")
    setIsCorrect(null)
    setCorrectAnswerIndices([])
    setSubmitting(true)
    setExplanation("")
    setExplanationError(null)

    // Fetch a new question
    async function getNextQuestion() {
      try {
        const data = await fetch("/api/practice", {
          method: "POST",
          body: JSON.stringify({
            method: "GET_QUESTION",
            setID: communityID,
            intent: intent,
          }),
        })

        const json = await data.json()
        if (json.question !== undefined && json.question !== "NONE") {
          setQuestion(json.question)
        } else {
          setError("No questions available")
        }
      } catch (err) {
        setError("Failed to load question")
        console.error(err)
      } finally {
        setSubmitting(false)
      }
    }

    getNextQuestion()
  }

  const handleGetExplanation = async () => {
    if (!question) return

    setIsExplaining(true)
    setExplanationError(null)

    try {
      const response = await fetch("/api/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: {
            name: question.questionName,
            type: question.type,
            answerChoices: question.answerChoices,
            correctAnswer:
              question.type === "multipleChoice"
                ? correctAnswerIndices.map((index) => `option-${index + 1}`)
                : [correctFreeResponseAnswer],
            response: question.type === "multipleChoice" ? selectedAnswer : freeResponseAnswer,
          },
          attempt: {
            name: question.questionName,
            type: question.type,
            answerChoices: question.answerChoices,
            correctAnswer:
              question.type === "multipleChoice"
                ? correctAnswerIndices.map((index) => `option-${index + 1}`)
                : [correctFreeResponseAnswer],
            response: question.type === "multipleChoice" ? selectedAnswer : freeResponseAnswer,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setExplanation(data.explanation)
    } catch (error) {
      console.error("Error getting explanation:", error)
      setExplanationError("Failed to get explanation. Please try again.")
    } finally {
      setIsExplaining(false)
    }
  }

  if (loading) {
    return (
      <Card className="w-full bg-zinc-900 border-none shadow-none">
        <CardHeader className="border-b border-zinc-700 dark:border-zinc-800">
          <CardTitle className="text-white flex items-center">
            <div className="h-6 w-24 bg-zinc-700 rounded-md relative overflow-hidden animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-4">
          <div className="mb-6">
            <div className="h-6 w-full bg-zinc-700 mb-2 rounded-md relative overflow-hidden animate-pulse" />
            <div className="h-6 w-3/4 bg-zinc-700 rounded-md relative overflow-hidden animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center space-x-2 rounded-full border border-zinc-700 p-4 relative overflow-hidden"
              >
                <div className="h-4 w-4 rounded-full border border-white" />
                <div className="h-5 flex-grow bg-zinc-700 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-700 pt-4 flex justify-end">
          <div className="h-10 w-32 bg-zinc-700 rounded-full relative overflow-hidden animate-pulse" />
        </CardFooter>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full border-none shadow-none bg-zinc-900">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <XCircle className="h-12 w-12 mb-4" color="#fd1010" />
          <p className="text-white">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
      <CardHeader className="border-b border-zinc-800">
        <CardTitle className="text-white">
          <Badge className="bg-zinc-800/80 hover:bg-zinc-800 text-white border-none px-3 py-1.5 rounded-lg">
            {question?.type === "multipleChoice" ? "Multiple Choice" : "Free Response"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="mb-8 text-white">
          {/* @ts-expect-error Expecting this lmao */}
          {question.displayMethod != undefined && question.displayMethod == "image" ? (
            <ZoomableImage
              // @ts-expect-error Expecting
              src={question?.questionName}
              alt="Question image"
              className="rounded-lg border border-zinc-700"
              width={300}
              height={200}
            />
          ) : (
            // @ts-expect-error Expecting
            <MathRender text={question?.questionName} />
          )}
        </div>

        {question?.type === "multipleChoice" && (
          <RadioGroup
            value={selectedAnswer || ""}
            onValueChange={setSelectedAnswer}
            className="space-y-3"
            disabled={submitted}
          >
            {question?.answerChoices.map((answerOption, index) => {
              const value = `option-${index}`
              const isCorrectAnswer = submitted && !submitting && correctAnswerIndices.includes(index)

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (!submitted) setSelectedAnswer(value)
                  }}
                  className={`flex items-center space-x-2 rounded-full border p-4 transition-all cursor-pointer
                    ${!submitted ? "border-zinc-700/50 hover:bg-zinc-800/50" : "border-zinc-700"}
                    ${selectedAnswer === value && !submitted ? "bg-zinc-800/50" : ""}
                    ${isCorrectAnswer ? "bg-green-900/30 border-green-700/70" : ""}
                    ${submitted && !submitting && selectedAnswer === value && !isCorrectAnswer ? "bg-red-900/30 border-red-700/70" : ""}
                  `}
                >
                  <RadioGroupItem
                    value={value}
                    id={value}
                    className={`border ${selectedAnswer === value ? "border-rose-400" : "border-white"}`}
                  />
                  <Label htmlFor={value} className="flex-grow cursor-pointer text-white">
                    <MathRender text={answerOption.split("=")[1]} />
                  </Label>
                  {isCorrectAnswer && <CheckCircle className="h-5 w-5 ml-2 text-emerald-400" />}
                  {submitted && !submitting && selectedAnswer === value && !isCorrectAnswer && (
                    <XCircle className="h-5 w-5 ml-2" color="#fd1010" />
                  )}
                </div>
              )
            })}
          </RadioGroup>
        )}

        {question?.type === "freeResponse" && (
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your answer here..."
              className="bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-zinc-400 rounded-xl focus:ring-rose-400 focus:border-rose-400"
              style={{ height: "200px", resize: "none" }}
              value={freeResponseAnswer}
              onChange={(e) => setFreeResponseAnswer(e.target.value)}
              disabled={submitted}
            />

            {submitted && (
              <div className="p-4 rounded-xl border border-zinc-700/50 bg-zinc-800/50 backdrop-blur-sm">
                <h3 className="text-white font-medium mb-2">Your Response:</h3>
                <p className="text-white text-sm">{freeResponseAnswer}</p>
              </div>
            )}
          </div>
        )}

        {submitted && !submitting && (
          <div className="mt-8 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
            {question?.type === "multipleChoice" ? (
              <>
                <h3 className="text-white font-medium mb-2">
                  Correct {correctAnswerIndices.length > 1 ? "Answers" : "Answer"}:
                </h3>
                <div className="text-white space-y-2">
                  {correctAnswerIndices.map((index, i) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" />
                      <MathRender text={question?.answerChoices[index].split("=")[1]} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-white font-medium mb-2">Reference Answer:</h3>
                <div className="text-white">
                  <MathRender text={correctFreeResponseAnswer} />
                </div>
                <p className="text-zinc-400 text-xs mt-2">
                  Note: Free response answers may vary. This is provided as a reference.
                </p>
              </>
            )}

            {/* Explanation button */}
            {!explanation && !isExplaining && (
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={handleGetExplanation}
                  className="bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white rounded-full p-4 text-sm flex items-center gap-2 border border-zinc-600 shadow-lg transition-all duration-300 hover:shadow-zinc-700/20"
                >
                  <HelpCircle className="h-4 w-4 text-rose-400" />
                  <span>Get Explanation</span>
                </Button>
              </div>
            )}

            {/* Loading state */}
            {isExplaining && (
              <div className="mt-4 p-4 bg-zinc-800/80 rounded-lg border border-zinc-700/50 backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 text-rose-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="font-medium">Generating explanation...</span>
                </div>
              </div>
            )}

            {/* Error state */}
            {explanationError && (
              <div className="mt-4 p-4 bg-zinc-800/90 rounded-lg border border-red-700/40 backdrop-blur-sm">
                <p className="text-red-300 text-sm flex items-center">
                  <XCircle className="h-4 w-4 mr-2 text-red-400" />
                  {explanationError}
                </p>
                <Button
                  onClick={handleGetExplanation}
                  className="mt-3 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-full px-4 py-1 border border-red-700/40 flex items-center gap-1.5"
                >
                  <RefreshCw className="h-3 w-3" />
                  Try Again
                </Button>
              </div>
            )}

            {/* Explanation content */}
            {explanation && (
              <div className="mt-4 p-5 bg-zinc-800/90 border-none rounded-lg border border-rose-500/20 backdrop-blur-sm shadow-lg shadow-rose-500/5">
                <h3 className="text-rose-400 font-medium mb-3 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Explanation
                </h3>
                <p className="text-white text-[10px]">Powered by the <span className="font-['STIX'] font-extrabold">alcuφ</span> Neural Engine.</p>
                <br />
                <div className="text-white text-sm prose prose-invert max-w-none prose-p:text-zinc-300 prose-strong:text-rose-300">
                  <MathRender text={explanation} />
                </div>
                <br />
                <p className="text-gray-400">The response from the Neural Engine may be incorrect. Always double check.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-zinc-800 pt-4 flex justify-end">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={
              (question?.type === "multipleChoice" && !selectedAnswer) ||
              (question?.type === "freeResponse" && !freeResponseAnswer.trim()) ||
              loading
            }
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg p-3 px-6 border-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </>
            ) : (
              "Submit Answer"
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={submitting}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-lg p-3 px-6 border-none"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Next Question"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}


export function ZoomableImage({
  src,
  alt,
  className,
  width,
  height
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation()         // stop overlay‐close when you actually click to zoom
    setZoomLevel(prev => (prev === 1 ? 2 : 1))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className={`cursor-zoom-in ${className}`}
          width={width}
          height={height}
        />
      </DialogTrigger>

      <DialogContent
        className="w-screen h-screen max-w-none border-0 bg-black/90 p-0 cursor-zoom-out"
        onClick={() => {
          setZoomLevel(1)  // reset zoom when closing
          setIsOpen(false)
        }}
        // remove onInteractOutside—DialogContent now closes on any outside click
      >
        {/* Wrapper takes up full screen but doesn’t catch pointer events */}
        <div
          className="relative h-full w-full flex items-center justify-center pointer-events-none"
        >
          {/* Image itself re‐enables pointer events */}
          <img
            src={src}
            alt={alt}
            className="object-contain transition-transform duration-300 pointer-events-auto"
            style={{
              transform: `scale(${zoomLevel})`,
              maxHeight: '90vh',
              maxWidth: '90vw',
              cursor: zoomLevel === 1 ? 'zoom-in' : 'zoom-out'
            }}
            onClick={handleZoom}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}



export function ChangeFocusSection() {
  // const [recommendedPractice, setRecommendedPractice] = useState<[]>();
  // useEffect(() => {
  //   async function run() {
  //     const data = await (await fetch('/api/recommended', {
  //       'method': 'POST',
  //       'body': JSON.stri
  //     })).json();
  //   }
  //   run()
  // },[recommendedPractice])
  return (
      <Card className="border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20 h-full">
      <CardHeader className="pb-2 border-b border-zinc-800">
        <CardTitle className="flex items-center text-lg text-white">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-400" />
          Change Focus
        </CardTitle>
        <CardDescription className="text-zinc-400">Change your focus based on the competition you want to practice for
          (based on available question sets)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {
            availableSources.map((source, key) => {
              return (
                  <a onClick={() => {
                    document.cookie = `focus=${source.name}; expires=${new Date(new Date().getTime() + 31556952000)}; path=/`;
                    toast({'title': "Focus changed successfully", description: `Changed focus to ${source.displayName}!`})
                  }} key={key} className="p-4 border-none transition-colors cursor-pointer group">
                    <div className="font-medium flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 mr-3">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        {source.displayName}
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-sm text-zinc-400 mt-2 ml-11">
                      {source.description}
                    </div>
                </a>
              )
            })
          }

        </div>
      </CardContent>
    </Card>

  )
}

type QuestionType = {
  correct: boolean
  timestamp: string
  type: string
  name: string
  answerChoices: string[]
  correctAnswer: string[]
  response: string
}

// Custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(113, 113, 122, 0.3) rgba(24, 24, 27, 0.1);
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(24, 24, 27, 0.1);
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(113, 113, 122, 0.3);
    border-radius: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(113, 113, 122, 0.5);
  }
`

export function RecentQuestions({ collectionID, intent }: { collectionID: string; intent: number }) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [limit, setLimit] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([])
  const [explanations, setExplanations] = useState<Record<string, string>>({})
  const [loadingExplanations, setLoadingExplanations] = useState<Record<string, boolean>>({})
  const [explanationErrors, setExplanationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchQuestions() {
      setIsLoading(true)
      try {
        const data = await (
          await fetch("/api/question", {
            method: "POST",
            body: JSON.stringify({
              type: "GET_DATA",
              limit: limit,
              collectionID: collectionID,
              intent: intent,
            }),
          })
        ).json()

        if (data.message === "success") {
          setQuestions(data.response || [])
        }
      } catch (error) {
        console.error("Error fetching questions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuestions()
  }, [limit, collectionID, intent])

  const fetchAllQuestions = async () => {
    try {
      const data = await (
        await fetch("/api/question", {
          method: "POST",
          body: JSON.stringify({
            type: "GET_DATA",
            limit: 100, // Fetch more questions for the modal
            collectionID: collectionID,
          }),
        })
      ).json()

      if (data.message === "success") {
        console.log(data)
        setAllQuestions(data.response || [])
      }
    } catch (error) {
      console.error("Error fetching all questions:", error)
    }
  }

  const handleViewAll = () => {
    fetchAllQuestions()
    setModalOpen(true)
  }

  const getExplanation = async (question: QuestionType) => {
    const questionId = question.timestamp // Using timestamp as a unique identifier

    // Set loading state for this specific question
    setLoadingExplanations((prev) => ({
      ...prev,
      [questionId]: true,
    }))

    try {
      const response = await fetch("/api/explanations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          attempt: question, // Using the same question object as the attempt
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Store the explanation for this question
      setExplanations((prev) => ({
        ...prev,
        [questionId]: data.explanation,
      }))

      // Clear any previous errors
      setExplanationErrors((prev) => ({
        ...prev,
        [questionId]: "",
      }))
    } catch (error) {
      console.error("Error getting explanation:", error)
      setExplanationErrors((prev) => ({
        ...prev,
        [questionId]: "Failed to get explanation. Please try again.",
      }))
    } finally {
      setLoadingExplanations((prev) => ({
        ...prev,
        [questionId]: false,
      }))
    }
  }

  // Helper function to decode URL encoded text
  const decodeText = (text: string) => {
    if (text.startsWith("text=")) {
      return decodeURIComponent(text.substring(5))
    }
    return text
  }

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(Number.parseInt(timestamp))
    return `${date.toLocaleString()}`
  }

  // Return statement
  return (
    <>
      <style jsx global>
        {customScrollbarStyles}
      </style>
      <Card className="border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <CardHeader className="pb-2 border-b border-zinc-800">
          <CardTitle className="flex items-center justify-between text-lg text-white">
            <div className="flex items-center">
              <History className="mr-2 h-5 w-5 text-cyan-400" />
              Recent Questions
            </div>
            <button
              onClick={handleViewAll}
              className="text-zinc-400 hover:text-white text-sm flex items-center transition-colors"
            >
              <Clock className="h-4 w-4 mr-1" /> View info
            </button>
          </CardTitle>
          <CardDescription className="text-zinc-400">Your last {limit} attempted questions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <p className="text-zinc-300">Loading questions...</p>
            </div>
          ) : questions && questions.length > 0 ? (
            <div className="divide-y divide-zinc-800">
              {questions.map((question, index) => (
                <div key={index} className="p-4 hover:bg-zinc-800/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-zinc-300 font-medium">
                        {question.name.startsWith("https://") ? (
                          <ZoomableImage
                            src={question.name}
                            alt="Question preview"
                            className="rounded border border-zinc-700"
                            width={200}
                          />
                        ) : (
                          <MathRender text={question.name} />
                        )}
                      </p>
                      <p className="text-zinc-500 text-sm mt-1">{formatTimestamp(question.timestamp)}</p>
                      {question.type === "multipleChoice" && (
                        <div className="mt-2">
                          <p className="text-zinc-400 text-xs mb-1">Answer choices:</p>
                          <ul className="space-y-1 mt-1">
                            {question.answerChoices
                              .map((choice, choiceIndex) => {
                                const correctOptionIndex = question.correctAnswer.map((option) => {
                                  const match = option.match(/option-(\d+)/)
                                  return match ? Number.parseInt(match[1]) : -1
                                })

                                const isCorrect = correctOptionIndex.includes(choiceIndex + 1)
                                const isSelected = question.response === `option-${choiceIndex}`

                                if (isCorrect || isSelected) {
                                  return (
                                    <li
                                      key={choiceIndex}
                                      className={`text-xs py-1 px-2 rounded flex items-center ${
                                        isCorrect
                                          ? "bg-green-950/40 text-green-300"
                                          : isSelected
                                            ? "bg-red-950/40 text-red-300"
                                            : ""
                                      }`}
                                    >
                                      {isCorrect && (
                                        <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" color="#22c55e" />
                                      )}
                                      {isSelected && !isCorrect && (
                                        <XCircle className="inline h-3 w-3 mr-1 text-red-500" />
                                      )}
                                      <MathRender text={decodeText(choice)} />
                                    </li>
                                  )
                                }
                                return null
                              })
                              .filter(Boolean)}
                          </ul>
                        </div>
                      )}
                      {question.type === "freeResponse" && (
                        <p className="text-zinc-400 text-xs mt-1">Free response: "{question.response}"</p>
                      )}
                      {/* Explanation section - only shown if an explanation exists */}
                      {explanations[question.timestamp] && (
                        <div className="mt-3 p-2 bg-zinc-800/50 rounded-md border border-zinc-700/50">
                          <p className="text-zinc-300 text-xs font-medium mb-1">Explanation:</p>
                          <div className="text-zinc-400 text-xs">
                            <MathRender text={explanations[question.timestamp]} />
                          </div>
                        </div>
                      )}
                      {/* Error message - only shown if there was an error */}
                      {explanationErrors[question.timestamp] && (
                        <div className="mt-3 p-2 bg-red-900/20 rounded-md border border-red-700/30">
                          <p className="text-red-300 text-xs">{explanationErrors[question.timestamp]}</p>
                          <button
                            onClick={() => getExplanation(question)}
                            className="text-xs text-red-300 underline mt-1"
                          >
                            Try again
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      {question.correct ? (
                        <CheckCircle className="h-5 w-5" color=" #4ade80" />
                      ) : (
                        <XCircle className="h-5 w-5" color="#ef4444" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 hover:bg-zinc-800/30 transition-colors">
              <p className="text-zinc-300 font-medium">No recent questions found</p>
              <p className="text-zinc-500 text-sm mt-1">Start answering questions to see your history</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className=" p-0 bg-zinc-950 border border-zinc-800 rounded-none overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/40">
            <div className="flex items-center text-white text-xl">
              <History className="mr-2 h-5 w-5" />
              Question History
            </div>
          </div>

          <div className="custom-scrollbar overflow-y-auto" style={{ maxHeight: "calc(90vh - 60px)" }}>
            <div className="p-4 space-y-4">
              {allQuestions.length > 0 ? (
                allQuestions.map((question, index) => (
                  <div key={index} className="bg-zinc-900 rounded-md border border-zinc-800 overflow-hidden">
                    <div className="p-4 flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium text-lg">
                          {question.name.startsWith("https://") ? (
                            <ZoomableImage
                              src={question.name}
                              alt="Question preview"
                              className="rounded border border-zinc-700"
                              width={200}
                            />
                          ) : (
                            <MathRender text={question.name} />
                          )}
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                          <Clock className="h-3 w-3 mr-1 inline" /> {formatTimestamp(question.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {question.correct && (
                          <div className="flex items-center text-green-400">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            <span>Correct</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-4">
                      {question.type === "multipleChoice" ? (
                        <>
                          <p className="text-zinc-400 text-sm mb-3">Answer choices</p>
                          <ul className="space-y-2">
                            {question.answerChoices.map((choice, choiceIndex) => {
                              const correctOptionIndex = question.correctAnswer.map((option) => {
                                const match = option.match(/option-(\d+)/)
                                return match ? Number.parseInt(match[1]) : -1
                              })

                              const isCorrect = correctOptionIndex.includes(choiceIndex + 1)
                              const isSelected = question.response === `option-${choiceIndex}`

                              return (
                                <li
                                  key={choiceIndex}
                                  className={`flex items-center text-sm p-2 rounded-md ${
                                    isCorrect
                                      ? "bg-green-950/40 border border-green-700/50"
                                      : isSelected && !isCorrect
                                        ? "bg-red-950/40 border border-red-700/50"
                                        : "bg-zinc-800/30"
                                  }`}
                                >
                                  <div className="mr-2 flex-shrink-0 flex justify-center">
                                    {isSelected ? (
                                      isCorrect ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-500" />
                                      )
                                    ) : isCorrect ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Circle className="h-4 w-4 text-zinc-600" />
                                    )}
                                  </div>
                                  <MathRender text={decodeText(choice)} />
                                  {isCorrect && (
                                    <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                                      Correct Answer
                                    </span>
                                  )}
                                </li>
                              )
                            })}
                          </ul>
                        </>
                      ) : question.type === "freeResponse" ? (
                        <>
                          <p className="text-zinc-400 text-sm mb-3">Free Response Question</p>
                          <div className="space-y-4">
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">Your answer:</p>
                              <p className="text-white">
                                <MathRender text={question.response} />
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-400 text-xs mb-1">Expected answer:</p>
                              <p className="text-white">
                                <MathRender text={question.correctAnswer[0]} />
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-zinc-400">Unknown question type</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-zinc-300 font-medium">No questions found</p>
                  <p className="text-zinc-500 text-sm mt-1">Start answering questions to build your history</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

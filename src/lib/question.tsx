"use client"

import { MathRender } from "@/components/ui/math-renderer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Loader2, History, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { get } from "http"
import { format } from "util"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// Interface
interface Question {
  id: number
  type: string | null
  questionName: string | null
  answerChoices: string[]
  correctAnswer?: string // For free response questions
}

export function QuestionSection({ communityID }: { communityID: string | undefined }) {
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

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true)
        const data = await fetch("/api/practice", {
          method: "POST",
          body: JSON.stringify({
            method: "GET_QUESTION",
            setID: communityID,
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
  }, [communityID])

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

    // Fetch a new question
    async function getNextQuestion() {
      try {
        const data = await fetch("/api/practice", {
          method: "POST",
          body: JSON.stringify({
            method: "GET_QUESTION",
            setID: communityID,
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
          {/* @ts-expect-error Expected since we know that it would occur */}
          <MathRender text={question?.questionName} />
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
                  <Label
                    htmlFor={value}
                    className="flex-grow cursor-pointer text-white"
                  >
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

type QuestionType = {
  correct: boolean
  timestamp: string
  type: string
  name: string
  answerChoices: string[]
  correctAnswer: string[]
  response: string
}

export function RecentQuestions({ collectionID }: { collectionID: string }) {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [limit, setLimit] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [allQuestions, setAllQuestions] = useState<QuestionType[]>([])

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
  }, [limit, collectionID])

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

  // Helper function to decode URL encoded text
  const decodeText = (text: string) => {
    if (text.startsWith("text=")) {
      return decodeURIComponent(text.substring(5))
    }
    return text
  }

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(Number.parseInt(timestamp)).toLocaleString())
  }

  // Return statement
  return (
    <>
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
                      <p className="text-zinc-300 font-medium"><MathRender text={question.name} /></p>
                      <p className="text-zinc-500 text-sm mt-1">{formatTimestamp(question.timestamp)}</p>
                    </div>
                    <div className="flex items-center">
                      {question.correct ? (
                        <CheckCircle className="h-5 w-5" color=" #4ade80"/>
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
        <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <History className="mr-2 h-5 w-5 text-cyan-400" />
              Specifics
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            {allQuestions.length > 0 ? (
              <div className="divide-y divide-zinc-800">
                {allQuestions.map((question, index) => (
                  <div key={index} className="py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-zinc-300 font-medium"><MathRender text={question.name} /></p>
                        <p className="text-zinc-500 text-sm">{formatTimestamp(question.timestamp)}</p>
                      </div>
                      <div className="flex items-center">
                        {question.correct ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-1" color="#22c55e" />
                            <span>Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="h-5 w-5 mr-1" color="#ef4444" />
                            <span color="#ef4444">Incorrect</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 bg-zinc-800/50 p-3 rounded-lg">
                      <p className="text-zinc-400 text-sm mb-2">Answer choices:</p>
                      <ul className="space-y-1">
                        {question.answerChoices.map((choice, choiceIndex) => {
                          const isCorrect = question.correctAnswer.includes(`option-${choiceIndex}`)
                          const isSelected = question.response === `option-${choiceIndex}`

                          return (
                            <li
                              key={choiceIndex}
                              className={`flex items-center text-sm p-1 rounded ${
                                isCorrect
                                  ? "text-green-400"
                                  : isSelected && !isCorrect
                                    ? "text-red-400"
                                    : "text-zinc-300"
                              }`}
                            >
                              {isCorrect && <CheckCircle className="h-4 w-4 mr-1" />}
                              {isSelected && !isCorrect && <XCircle className="h-4 w-4 mr-1" />}
                              {decodeText(choice)}
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-zinc-300">No questions found</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

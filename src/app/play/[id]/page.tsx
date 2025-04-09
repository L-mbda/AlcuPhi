import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db/db"
import { question, questionCollection, questionLog } from "@/db/schema"
import { QuestionSection, RecentQuestions } from "@/lib/question"
import { getSessionData } from "@/lib/session"
import { and, count, eq, sql } from "drizzle-orm"
import { History, Lightbulb, Target, Sparkles, ArrowRight, Clock, CheckCircle2 } from "lucide-react"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic";

export default async function PlaySet({ params }: { params: Promise<{ id: string }> }) {
  dynamic
  const connection = await db()
  const id = (await params).id
  const setID = await connection
    .select({ id: questionCollection.id })
    .from(questionCollection)
    .where(eq(questionCollection.publicID, id))
  const session = (await getSessionData()).credentials

  if (setID.length == 0) {
    return redirect("/play")
  }

  const questionsCorrect =
    (
      await connection
        .select({
          correctCount: sql<number>`COUNT(*)`.mapWith(Number),
        })
        .from(questionLog)
        .innerJoin(question, sql`${questionLog.questionID}::bigint = ${question.id}`)
        .where(
          and(
            eq(questionLog.correct, true),
            eq(question.collectionID, setID[0].id),
            eq(question.type, "multipleChoice"),
          ),
        )
    )[0].correctCount || 0

  const totalQuestions =
    (
      await connection
        .select({
          totalQuestions: count(questionLog.id),
        })
        .from(questionLog)
        .innerJoin(question, sql`${questionLog.questionID}::bigint = ${question.id}`)
        .where(
          and(
            eq(questionLog.correct, true),
            eq(question.collectionID, setID[0].id),
            eq(question.type, "multipleChoice"),
          ),
        )
    )[0].totalQuestions || 1

  const questionsAttempted = await connection
    .select({
      attempts: count(questionLog.id),
    })
    .from(questionLog)
    .where(and(eq(questionLog.collectionID, setID[0].id), eq(questionLog.userID, session.id)))

  const accuracy = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="container py-8 px-4 max-w-7xl mx-auto">
        <div className="mb-8 flex items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Practice</h1>
            <p className="text-zinc-400">
              Answer questions, track your progress, and focus on areas that need improvement.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-full">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-zinc-300">Session active</span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Main question area */}
          <div className="col-span-12 lg:col-span-8 row-span-1">
            <QuestionSection communityID={id} />
          </div>

          {/* Progress Stats Card */}
          <div className="col-span-12 lg:col-span-4 row-span-1">
            <Card className="border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20 h-full">
              <CardHeader className="pb-2 border-b border-zinc-800">
                <CardTitle className="flex items-center text-lg text-white">
                  <Target className="mr-2 h-5 w-5 text-rose-400" />
                  Progress Stats
                </CardTitle>
                <CardDescription className="text-zinc-400">Your recent performance metrics.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center w-12 h-12 mb-2">
                      <span className="text-2xl font-bold text-white">{accuracy}%</span>
                    </div>
                    <span className="text-sm text-zinc-300">Accuracy*</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
                    <div className="flex items-center justify-center w-12 h-12  mb-2">
                      <span className="text-2xl font-bold text-white">{questionsAttempted[0].attempts}</span>
                    </div>
                    <span className="text-sm text-zinc-300">Questions</span>
                  </div>
                </div>
                <p className="text-zinc-500 text-xs italic mt-4 text-center">
                  * multiple choice is only utilized for calculating accuracy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Questions */}
          <div className="col-span-12 lg:col-span-8 row-span-1">
            <RecentQuestions />
          </div>

          {/* Recommended Practice */}
          <div className="col-span-12 lg:col-span-4 row-span-1">
            <Card className="border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20 h-full">
              <CardHeader className="pb-2 border-b border-zinc-800">
                <CardTitle className="flex items-center text-lg text-white">
                  <Lightbulb className="mr-2 h-5 w-5 text-amber-400" />
                  Recommended Practice
                </CardTitle>
                <CardDescription className="text-zinc-400">Based on your performance</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="rounded-xl border border-zinc-700/50 p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="font-medium flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 mr-3">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        Kinematics Problems
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-sm text-zinc-400 mt-2 ml-11">
                      Improve your understanding of motion equations
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-700/50 p-4 hover:bg-zinc-800/50 transition-colors cursor-pointer group">
                    <div className="font-medium flex items-center justify-between text-white">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 mr-3">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        Thermodynamics Quiz
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-sm text-zinc-400 mt-2 ml-11">Practice heat transfer and entropy concepts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

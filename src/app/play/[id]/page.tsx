import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db/db"
import { question, questionCollection, questionLog } from "@/db/schema"
import { recommendSetsByID } from "@/lib/engine"
import { QuestionSection, RecentQuestions } from "@/lib/question"
import { getSessionData } from "@/lib/session"
import { and, count, eq, sql } from "drizzle-orm"
import { Target, CheckCircle2, Waves } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
export const dynamic = "force-dynamic"

export default async function PlaySet({ params }: { params: Promise<{ id: string }> }) {
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
            eq(questionLog.userID, session.id)
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
        .where(and(eq(question.collectionID, setID[0].id), eq(question.type, "multipleChoice"),
          eq(questionLog.userID, session.id)))
    )[0].totalQuestions || 1

  const questionsAttempted = await connection
    .select({
      attempts: count(questionLog.id),
    })
    .from(questionLog)
    .where(and(eq(questionLog.collectionID, setID[0].id), eq(questionLog.userID, session.id)
  ,eq(questionLog.userID, session.id)
  ))
  const accuracy = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0
  const recommendations = await recommendSetsByID(accuracy,setID[0].id,session?.id)
  // Return
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main question area - takes full width on mobile, 8/12 on desktop */}
          <div className="lg:col-span-8">
            <QuestionSection communityID={id} intent={0} />
          </div>

          {/* Progress Stats Card - takes full width on mobile, 4/12 on desktop */}
          <div className="lg:col-span-4">
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
                    <div className="flex items-center justify-center w-12 h-12 mb-2">
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

          {/* Progress Stats Card - takes full width on mobile, 4/12 on desktop */}
          <div className="lg:col-span-4">
            <Card className="border-zinc-800 bg-zinc-900 rounded-2xl overflow-hidden shadow-lg shadow-black/20 h-full">
              <CardHeader className="pb-2 border-b border-zinc-800">
                <CardTitle className="flex items-center text-lg text-white">
                  <Waves className="mr-2 h-5 w-5 text-blue-300" />
                  Recommendations
                </CardTitle>
                <CardDescription className="text-zinc-400">Recommendations for you to practice with by our <i>Neural Engine</i>.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {
                  (recommendations.length == 0) ? (
                    <p className="text-white">No recommendations available for you to practice by our Engine.</p>
                  ) : (
                    // @ts-expect-error Expecting
                    recommendations.map((set,id) => {
                      return (
                        <Link href={'/set/' + set.publicID} key={id} className="flex flex-col items-center justify-center p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 backdrop-blur-sm">
                          <span className="text-2xl font-bold text-white">{set.name}</span>
                          <span className="text-sm text-zinc-300">{set.content}</span>
                        </Link>
                      )
                    })
                  )
                }
              </CardContent>
            </Card>
          </div>
          {/* Recent Questions - takes full width on mobile, 8/12 on desktop */}
          <div className="lg:col-span-4">
            <RecentQuestions collectionID={id} intent={0} />
          </div>

          {/* Recommended Practice - takes full width on mobile, 4/12 on desktop */}
          {/* Uncomment when ready to use */}
          {/* <div className="lg:col-span-4">
            <RecommendedPracticeSection />
          </div> */}
        </div>
      </div>
    </div>
  )
}

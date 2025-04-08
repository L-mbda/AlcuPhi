import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/db/db"
import { question, questionCollection, questionLog } from "@/db/schema";
import { QuestionSection } from "@/lib/question"
import { getSessionData } from "@/lib/session";
import { and, count, eq, sql } from "drizzle-orm";
import { BookOpen, Brain, History, Lightbulb, Pencil, Target } from "lucide-react"
import { redirect } from "next/navigation";

export default async function PlaySet({ params }: { params: Promise<{ id: string }> }) {
  const connection = await db();
  const id = (await params).id
  const setID = await connection.select({id: questionCollection.id}).from(questionCollection).where(eq(questionCollection.publicID, id));
  const session = (await getSessionData()).credentials;
  if (setID.length == 0) {
    return redirect('/play');
  }

  const questionsCorrect = (await connection
  .select({
    correctCount: sql<number>`COUNT(*)`.mapWith(Number),
  })
  .from(questionLog)
  .innerJoin(  question,
    sql`${questionLog.questionID}::bigint = ${question.id}`)
  .where(
    and(
      eq(questionLog.correct, true),       
      eq(question.collectionID, setID[0].id), 
      eq(question.type, "multipleChoice"),
    ),
  ))[0].correctCount | 1;
  const totalQuestions = (await connection
  .select({
    totalQuestions: count(questionLog.id)
  })
  .from(questionLog)
  .innerJoin(  question,
    sql`${questionLog.questionID}::bigint = ${question.id}`)
  .where(
    and(
      eq(questionLog.correct, true),       
      eq(question.collectionID, setID[0].id), 
      eq(question.type, "multipleChoice"),
    ),
  ))[0].totalQuestions | 1;
  const questionsAttempted = await connection.select({
    'attempts': count(questionLog.id),
  }).from(questionLog).where(and(eq(questionLog.collectionID, setID[0].id),eq(questionLog.userID, session.id)))
  return (
    <div className="container py-10 text-white">
      <div className="mb-8 ml-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Practice</h1>
        <p className="text-zinc-400">
          Answer questions, track your progress, and focus on areas that need improvement.
        </p>
      </div>
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-min">
            {/* Main question area - spans 8 columns on large screens, full width on smaller */}
            <div className="md:col-span-6 lg:col-span-8 lg:row-span-2"><QuestionSection communityID={id} /></div>

            {/* Focus selector - spans 4 columns on large screens */}
            <div className="md:col-span-3 lg:col-span-4">{/* <FocusSelector /> */}</div>

            {/* Stats card */}
            <div className="md:col-span-3 lg:col-span-4">
            <Card className="border-zinc-700 bg-zinc-800 h-full">
                <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white text-lg">
                    <Target className="mr-2 h-5 w-5" />
                    Progress Stats
                </CardTitle>
                <CardDescription className="text-zinc-400">Your recent performance metrics.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center p-3 bg-zinc-700 rounded-lg">
                    <span className="text-2xl font-bold text-white">{(questionsCorrect / totalQuestions)*100}%</span>
                    <span className="text-xs text-zinc-400">Accuracy*</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-zinc-700 rounded-lg">
                    <span className="text-2xl font-bold text-white">{questionsAttempted[0].attempts}</span>
                    <span className="text-xs text-zinc-400">Questions</span>
                    </div>
                </div>
                <p className="text-gray-400 text-[10px] italic">* multiple choice is only utilized for calculating accuracy</p>

                </CardContent>
            </Card>
            </div>

            {/* Quick access cards */}
            <div className="md:col-span-6 lg:col-span-4 grid grid-cols-2 gap-4">
            <Card className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <BookOpen className="h-8 w-8 mb-2 text-blue-400" />
                <h3 className="font-medium text-white">Study Materials</h3>
                <p className="text-xs text-zinc-400">Access lecture notes and resources</p>
                </CardContent>
            </Card>

            <Card className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                <Brain className="h-8 w-8 mb-2 text-purple-400" />
                <h3 className="font-medium text-white">Concept Maps</h3>
                <p className="text-xs text-zinc-400">Visualize physics relationships</p>
                </CardContent>
            </Card>
            </div>

            {/* Question log - spans full width on mobile, 8 columns on large screens */}
            <div className="md:col-span-6 lg:col-span-8">
            <Card className="border-zinc-700 bg-zinc-800">
                <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white text-lg">
                    <History className="mr-2 h-5 w-5" />
                    Recent Questions
                </CardTitle>
                <CardDescription className="text-zinc-400">Your last 5 attempted questions</CardDescription>
                </CardHeader>
                <CardContent></CardContent>
            </Card>
            </div>

            {/* Recommended practice */}
            <div className="md:col-span-6 lg:col-span-4">
            <Card className="border-zinc-700 bg-zinc-800 h-full">
                <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-white text-lg">
                    <Lightbulb className="mr-2 h-5 w-5 text-yellow-400" />
                    Recommended Practice
                </CardTitle>
                <CardDescription className="text-zinc-400">Based on your performance</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-3">
                    <div className="rounded-md border border-zinc-700 p-3 hover:bg-zinc-700 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center text-white">
                        <Pencil className="h-4 w-4 mr-2 text-primary" />
                        Kinematics Problems
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">Improve your understanding of motion equations</div>
                    </div>
                    <div className="rounded-md border border-zinc-700 p-3 hover:bg-zinc-700 transition-colors cursor-pointer">
                    <div className="font-medium flex items-center text-white">
                        <Pencil className="h-4 w-4 mr-2 text-primary" />
                        Thermodynamics Quiz
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">Practice heat transfer and entropy concepts</div>
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


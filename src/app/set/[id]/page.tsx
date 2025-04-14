// @ts-nocheck
import { db } from "@/db/db";
import { question, questionCollection, user } from "@/db/schema";
import { getSessionData } from "@/lib/session";
import { count, eq } from "drizzle-orm";
import { Check, User } from "lucide-react";
import { AddQuestionButton, EditSet, QuestionOptions } from "@/lib/menu";
import { MathRender } from "@/components/ui/math-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Check session
  const session = (await getSessionData()).credentials;
  const { id } = await params;
  // Check if id exists in DB
  const query = await (
    await db()
  )
    .select({
      id: questionCollection.publicID,
      accessID: questionCollection.id,
      title: questionCollection.name,
      content: questionCollection.content,
      creatorID: questionCollection.creatorID,
      tags: questionCollection.tags,
      plays: questionCollection.plays,
      creatorName: user.name,
      questions: count(question),
    })
    .from(questionCollection)
    .where(eq(questionCollection.publicID, id))
    .leftJoin(user, eq(user.id, questionCollection.creatorID))
    .fullJoin(question, eq(question.collectionID, questionCollection.id))
    .groupBy(questionCollection.id, user.name);

  const questionQuery = await (await db())
    .select()
    .from(question)
    .where(eq(question.collectionID, query[0].accessID));
  return (
    <section className="flex flex-col w-full min-h-[90vh] items-center pt-10 pb-16">
      {/* Collection Header */}
      <div className="border-[0.6px] p-6 border-white/20 bg-zinc-900/50 w-[90%] rounded-lg flex flex-row justify-between shadow-md">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold">{query[0]?.title}</h1>
          <h2 className="flex items-center gap-2 text-zinc-300">
            <User size={18} className="text-zinc-400" /> {query[0]?.creatorName}
          </h2>
          <p className="text-zinc-300 max-w-2xl">{query[0]?.content}</p>

          {/* Tags */}
          <div className="flex gap-2 mt-1">
            {query[0]?.tags.length > 0 ? (
              query[0]?.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-medium">
                No tags
              </span>
            )}
          </div>
          {questionQuery.length == 0 ? null : (
            <Button variant={"outline"} className="text-black" asChild>
              <Link href={"/play/" + id}>Play Set</Link>
            </Button>
          )}
          {
            // If user is owner, show edit
            (session?.id == query[0]?.creatorID || session?.role != 'user') ? (
              <>
                <EditSet collectionInfo={query[0]} />
              </>
            ) : null
          }
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-3 text-white self-start">
          <div className="flex items-center gap-2 text-zinc-300 text-sm bg-zinc-800/70 px-3 py-2 rounded-lg">
            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
              <User className="h-4 w-4" />
            </span>
            <span className="font-medium">{query[0]?.plays}</span> Plays
          </div>
          <div className="flex items-center gap-2 text-zinc-300 text-sm bg-zinc-800/70 px-3 py-2 rounded-lg">
            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
              <Check className="h-4 w-4" />
            </span>
            <span className="font-medium">{query[0]?.questions}</span> Questions
          </div>
        </div>
      </div>
      {/* Questions section */}
      <div className="w-[90%] mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {session?.id === query[0]?.creatorID && (
            <AddQuestionButton
              collectionID={query[0]?.id}
              text={"Add Question"}
            />
          )}
        </div>

        {questionQuery.length > 0 ? (
          <div className="space-y-4">
            {questionQuery.map((question, index) => (
              <div
                key={index}
                className="border-[0.6px] border-white/20 bg-zinc-900/50 rounded-lg p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-zinc-800 text-zinc-300 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="space-y-3 w-full">
                    <h3 className="text-lg font-medium">
                      <MathRender text={question.questionName} />
                    </h3>
                    <div className="bg-zinc-800/50 rounded-lg p-4 text-zinc-300 gap-2 flex flex-col">
                      {question.correctAnswer.map((answerChoice, id) => {
                        if (question.type == "multipleChoice") {
                          let identity = parseInt(
                            answerChoice.split("option-")[1],
                          );
                          // Compartmentalized Rendering
                          return (
                            <div className="flex flex-row gap-2 items-center">
                              <Check size={18} />
                              <MathRender
                                text={
                                  question.answerChoices[identity - 1].split('=')[1]
                                }
                                key={id}
                              />
                            </div>
                          );
                        }
                        return <MathRender text={answerChoice} key={id} />;
                      })}
                    </div>
                  </div>
                  <Badge className="mt-2">
                    <h1>{question.type == "multipleChoice" ? "MCQ" : "FRQ"}</h1>
                  </Badge>
                  {query[0].creatorID == session?.id ? (
                    <QuestionOptions questionInformation={question} />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-[0.6px] border-white/10 bg-zinc-900/30 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No Questions Yet</h3>
            <p className="text-zinc-400 max-w-md mx-auto">
              This collection doesn&apos;t have any questions yet.
              {session?.id === query[0]?.creatorID && (
                <span className="block mt-4">
                  <AddQuestionButton
                    collectionID={query[0]?.id}
                    text={"Add Your First Question"}
                  />
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

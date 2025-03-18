import { Badge } from "@/components/ui/badge";
import { db } from "@/db/db";
import { question, questionCollection, user } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Check, User } from "lucide-react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Check if id exists in DB
  const query = await (
    await db()
  )
    .select({
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
  console.log(query);
  return (
    <section className="flex flex-col w-full h-[90vh] items-center pt-10">
      {/* Content */}
      <div className="border-[0.6px] p-5 border-white w-[90%] rounded-lg flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">{query[0]?.title}</h1>
          <h2 className="flex items-center gap-2">
            <User size={20} /> {query[0]?.creatorName}
          </h2>
          <p className="text-gray-300">{query[0]?.content}</p>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {query[0]?.tags.length > 0 ? (
                query[0]?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">
                  No tags
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Plays and other stuff - now aligned to the top */}
        <div className="flex gap-2 text-white self-start">
          <div className="flex items-center gap-1 text-zinc-300 text-xs">
            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
              <User className="h-3 w-3" />
            </span>
            {query[0]?.plays} Plays
          </div>
          <div className="flex items-center gap-1 text-zinc-300 text-xs">
            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
              <Check className="h-3 w-3" />
            </span>
            {query[0]?.questions} Questions
          </div>
        </div>
      </div>
    </section>
  );
}

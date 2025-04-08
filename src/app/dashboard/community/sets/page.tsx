// @ts-nocheck
import { Button } from "@/components/ui/button";
import { db } from "@/db/db";
import { user } from "@/db/schema";
import { CreateSetButton } from "@/lib/create-set-button";
import { UserSets } from "@/lib/menu";
import { getSessionData } from "@/lib/session";
import { SplashScreen } from "@/lib/ui";
import { eq } from "drizzle-orm";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default async function UserGeneratedSets(props: {
  params: Promise<{ id: string }>; // This is for the user ID to fetch from the database
}) {
  const session = (await getSessionData()).credentials;
  // Do NOT REMOVE THE AWAITS, IT HAS A PURPOSE ON THE
  // EXPRESSION
  let userID = parseInt(await (await props.params).id);
  // Reassign to user ID if undefined
  if (isNaN(userID)) {
    userID = session?.id;
  }
  let userQuery = await (
    await db()
  )
    .select({
      name: user.name,
      id: user.id,
    })
    .from(user)
    .where(eq(user.id, userID));
  if (userQuery.length != 0) {
    return (
      <>
        {/* Regular UI */}
        <div className="p-10 w-full flex flex-col gap-1">
          <h1 className="font-black text-5xl">
            Sets created by {userQuery[0]?.name}
          </h1>
          <code>
            <p>User ID: {userQuery[0].id}</p>
          </code>
          <div className="flex flex-col w-fit">
            {session?.id == userQuery[0].id ? (
              <CreateSetButton name={session?.name} />
            ) : null}
          </div>
        </div>
        {/* Components, inf scroll */}
        <UserSets id={userID} />
      </>
    );
  }
  // 404 return
  return (
    <>
      {/* Regular UI */}
      <div className="p-10 flex flex-col gap-3 w-screen h-[90vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-black text-6xl">404</h1>
          <code>ERROR: COULD NOT COMPUTE SUPERPOSITION</code>
        </div>
        <p>Are you sure you are in the right place?</p>
        <Button asChild>
          <Link href="/dashboard">Go back to dashboard</Link>
        </Button>
      </div>
    </>
  );
}

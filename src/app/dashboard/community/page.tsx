import { Button } from "@/components/ui/button";
import { CreateSetButton } from "@/lib/create-set-button";
import { CommunitySection } from "@/lib/menu";
import { getSessionData } from "@/lib/session";
import Link from "next/link";

// Dashboard
export default async function Dashboard() {
  // Get session data
  const session = (await getSessionData()).credentials;
  // Return
  return (
    <>
      {/* Regular UI */}
      <div className="p-10 w-full ">
        <h1 className="font-black text-5xl">Community</h1>
        <p>Practice with sets created by the community.</p>
        <br />
        {/* Create set component */}
        <div className="flex flex-col w-fit">
          <CreateSetButton name={session?.name} />
          <Button className="mt-5" variant="default" asChild>
            <Link href={`/dashboard/community/sets`}>My Sets</Link>
          </Button>
        </div>
      </div>
      {/* Components, inf scroll */}
      <CommunitySection />
    </>
  );
}

import { Authentication } from "@/actions/authentication";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SignIn({ searchParams }: { searchParams: any }) {
  // Check if there is token and redirect
  if ((await cookies()).get("header") !== undefined) {
    redirect("/dashboard");
  }

  const action = (await searchParams).action;
  const message = (await searchParams).message;
  if (action == "register") {
    return (
      <div className="dots_bg bg-zinc-900 min-h-screen flex justify-center items-center">
        <form
          action={Authentication.register}
          className="bg-zinc-700 p-6 min-h-[50vh] min-w-[50%] max-w-[90%] flex-col gap-2 rounded-md flex justify-center shadow-md"
        >
          <div>
            <h1 className="font-['STIX'] font-[700] text-[45px] w-[75%]">
              alcuφ
            </h1>
            <p>
              Create an account to start practicing adaptive physics problems.
            </p>
            {/* Error message */}
            <p className="text-red-400">{message}</p>
          </div>
          <div className="gap-3 flex flex-col">
            <div>
              <label htmlFor="name">Name:</label>
              <Input name="name" placeholder="Lambda" required />
            </div>
            <div>
              <label htmlFor="name">Email:</label>
              <Input
                type="email"
                name="email"
                placeholder="hello@alcuphi.me"
                required
              />
            </div>
            <div>
              <label htmlFor="name">Password:</label>
              <Input
                name="password"
                placeholder="********"
                type="password"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" className="bg-zinc-800">Sign Up</Button>
            <Link className="underline" href={"/account"}>
              Have an account?
            </Link>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="dots_bg bg-zinc-900 min-h-screen flex justify-center items-center">
        <form
          action={Authentication.login}
          className="bg-zinc-700 p-6 min-h-[50vh] min-w-[50%] max-w-[90%] flex-col gap-2 rounded-md flex justify-center shadow-md"
        >
        <div>
          <h1 className="font-['STIX'] font-[700] text-[45px] w-[75%]">
            alcuφ
          </h1>
          <p>Login with your account</p>
          {/* Error message */}
          <p className="text-red-400">{message}</p>
        </div>
        <div className="gap-3 flex flex-col">
          <Input
            type="email"
            name="email"
            placeholder="hello@alcuphi.me"
            required
          />
          <Input
            name="password"
            type="password"
            placeholder="********"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="submit" className="bg-zinc-800">Login</Button>
          <Link className="underline" href={"?action=register"}>
            Don&apos;t have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}

import { Button } from "@mantine/core";
import Link from "next/link";

export default function App() {
  return (
    <>
      <div className="absolute bg-zinc-900 w-full h-full justify-center flex flex-col">
        <div className="items-center flex flex-col gap-5">
          <div className="text-center">
            <h1 className="font-['STIX'] font-extrabold text-8xl">alcuφ</h1>
            <p className="text-lg">
              <i>
                <Link
                  href={"https://artofproblemsolving.com/alcumus/problem"}
                  className="underline"
                >
                  Alcumus
                </Link>
                , for us Physicists.
              </i>
            </p>
          </div>
          <div>
            <Button component={Link} href="/account" color="gray">
              Get Started
            </Button>
          </div>
        </div>
        <footer className="justify-center flex bottom-4 fixed w-full">
          <p>
            ©{new Date().getFullYear()}{" "}
            <Link
              href={"https://github.com/alcuphi/alcuphi"}
              className="underline"
            >
              Alcuphi
            </Link>
            . Open source under the CC0-1.0 Universal License.
          </p>
        </footer>
      </div>
    </>
  );
}

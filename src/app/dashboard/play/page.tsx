import { DropdownMenu } from "@/lib/menu";
import { QuestionLog } from "@/lib/question";
import { SplashScreen } from "@/lib/ui";

export default function Play() {
    return (
        <main className="bg-zinc-900 h-full w-full absolute">
            {/* For the top menu */}
            <div className="w-[100%] flex justify-center p-3 items-center gap-6">
                <div className="font-['STRIX'] text-3xl hover:cursor-pointer select-none">
                {/* Dropdown menu component */}
                <DropdownMenu />
                </div>
            </div>

            {/* Regular UI */}
            <div className="p-10 w-full font-['Mulish'] bg-zinc-900">
                <h1 className="text-4xl font-bold">Practice</h1>
                {/* Side by side UI for practicing */}
                <section className="md:flex md:flex-row">
                    {/* <QuestionRenderer /> */}
                    <QuestionLog />
                </section>
            </div>
        </main>
    )
}
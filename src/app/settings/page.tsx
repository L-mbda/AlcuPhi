import { getSessionData } from "@/lib/session";
import SettingsContent from "@/components/settings";

export default async function SettingsPage() {
  const session = (await getSessionData()).credentials;
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Account Settings</h1>
      <SettingsContent session={session} />
    </div>
  );
}

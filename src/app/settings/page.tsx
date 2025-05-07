import { getSessionData } from "@/lib/session";
import SettingsContent from "@/components/settings";

export default async function SettingsPage() {
  const session = (await getSessionData()).credentials;
  return <SettingsContent session={session} />;
}

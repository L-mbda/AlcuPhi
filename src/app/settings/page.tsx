import { getSessionData } from "@/lib/session";
import SettingsContent from "@/components/settings";

export default async function SettingsPage() {
  const session = (await getSessionData()).credentials;
  // @ts-expect-error Eexpected lmao
  return <SettingsContent session={session} />;
}

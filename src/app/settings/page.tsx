import { DeleteAccountForm, PasswordSettings, AdminSettings, AccountSettings } from "@/components/settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, Shield, AlertTriangle } from 'lucide-react'
import { getSessionData } from "@/lib/session"

export default async function Settings() {
  // In a real app, this would come from your auth provider
  const currentUser = await (await getSessionData()).credentials

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container max-w-5xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h1>
          <p className="text-zinc-400">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800 p-0 h-12">
            <TabsTrigger value="account" className="data-[state=active]:bg-zinc-800 rounded-none h-full">
              <User className="mr-2 h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="password" className="data-[state=active]:bg-zinc-800 rounded-none h-full">
              <Lock className="mr-2 h-4 w-4" />
              Password
            </TabsTrigger>
            {currentUser.role === "admin" && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-zinc-800 rounded-none h-full">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
            <TabsTrigger value="danger" className="data-[state=active]:bg-zinc-800 rounded-none h-full">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountSettings user={currentUser} />
          </TabsContent>

          <TabsContent value="password">
            <PasswordSettings user={currentUser} />
          </TabsContent>

          {currentUser.role === "admin" && (
            <TabsContent value="admin">
              <AdminSettings />
            </TabsContent>
          )}

          <TabsContent value="danger">
            <Card className="border-zinc-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-zinc-100">Delete Account</CardTitle>
                <CardDescription className="text-zinc-400">
                  Permanently delete your account and all associated data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-red-900/20 bg-red-900/10 p-4">
                  <div className="space-y-4">
                    <p className="text-sm text-red-400">
                      <strong>Important:</strong> Upon deletion, all your sets will be transferred to the "System"
                      account. This action cannot be undone.
                    </p>
                    <DeleteAccountForm userId={currentUser.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

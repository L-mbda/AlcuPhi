"use client"

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Shield, User, Key, Clock, LogIn, BadgeAlert } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export interface Session {
  id: number
  name: string
  email: string
  role: "owner" | "admin" | "user" | null,
  dateCreated: string, 
  loginCount: number
}

interface SettingsProps {
  session: Session
}

export default function Settings({ session }: SettingsProps) {
  const { id, name, email, role, dateCreated, loginCount } = session

  // Mock data for the bento grid stats
  const memberSince = new Date(dateCreated).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="transition-all duration-200 ease-in-out">
      <Tabs defaultValue="account" className="space-y-6">
        <div className="bg-zinc-800/50 backdrop-blur-sm sticky top-0 z-10 p-2 rounded-lg mb-4">
          <TabsList className="bg-zinc-800 w-full justify-start">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            {(role === "owner" || role === "admin") && (
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Administration
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="bg-zinc-800 text-white border-zinc-700 col-span-full md:col-span-1 md:row-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="h-5 w-5" /> Profile
                </CardTitle>
                <CardDescription className="text-zinc-400">Your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-24 w-24 rounded-full bg-zinc-700 flex items-center justify-center mx-auto">
                  <span className="text-3xl font-bold">{name.charAt(0)}</span>
                </div>
                <div className="space-y-2 pt-4">
                  <div className="space-y-1">
                    <Label className="text-zinc-400">Name</Label>
                    <div className="bg-zinc-700/50 p-3 rounded-md">{name}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-zinc-400">Email</Label>
                    <div className="bg-zinc-700/50 p-3 rounded-md">{email}</div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-zinc-400">Role</Label>
                    <div className="bg-zinc-700/50 p-3 rounded-md capitalize">{role}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>{session.role !== "owner" && <DeleteAccountModal userId={id} />}</CardFooter>
            </Card>

            {/* Stats Cards */}
            <Card className="bg-zinc-800 text-white border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Member Since
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{memberSince}</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-800 text-white border-zinc-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <LogIn className="h-4 w-4" /> Login Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{loginCount}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-zinc-800 text-white border-zinc-700 md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Password Security
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <Separator className="bg-zinc-700" />
              <CardContent className="pt-6">
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-zinc-800 text-white border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-lg">Security Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Use a strong password</h3>
                    <p className="text-sm text-zinc-400">Combine letters, numbers, and special characters</p>
                  </div>
                  {/* <div className="space-y-2">
                    <h3 className="font-medium">Enable two-factor authentication</h3>
                    <p className="text-sm text-zinc-400">Add an extra layer of security to your account</p>
                  </div> */}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {role !== "user" && (
          <TabsContent value="admin">
            <Card className="bg-zinc-800 text-white border-zinc-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" /> User Management
                </CardTitle>
                <CardDescription className="text-zinc-400">Manage users and their permissions</CardDescription>
              </CardHeader>
              <Separator className="bg-zinc-700" />
              <CardContent className="pt-6">
                <UserManagement data={session} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [status, setStatus] = React.useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match")
      return
    }
    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    if (res.ok) {
      setStatus("")
      toast({
        title: "Updated",
        description: "Password updated successfully.",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      const { message } = await res.json()
      setStatus(message || "Error changing password")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current">Current Password</Label>
        <Input
          id="current"
          className="bg-zinc-700 text-white border-zinc-600"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new">New Password</Label>
        <Input
          id="new"
          className="bg-zinc-700 text-white border-zinc-600"
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm Password</Label>
        <Input
          id="confirm"
          className="bg-zinc-700 text-white border-zinc-600"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {status && <p className="text-sm text-red-400">{status}</p>}
      <Button className="bg-zinc-700 hover:bg-zinc-600 w-full" type="submit">
        Update Password
      </Button>
    </form>
  )
}

interface DeleteAccountModalProps {
  userId: number
}

function DeleteAccountModal({ userId }: DeleteAccountModalProps) {
  const [open, setOpen] = React.useState(false)
  const [password, setPassword] = React.useState("")
  const [status, setStatus] = React.useState<string | null>(null)

  const handleDelete = async () => {
    const res = await fetch("/api/settings/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      setStatus("Account deleted. Redirecting...")
      window.location.href = "/"
    } else {
      const { error } = await res.json()
      setStatus(error || "Password entered might not be correct, please check again.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full transition-all duration-200 ease-in-out bg-red-700/70 hover:bg-red-700"
        >
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
          <DialogDescription className="text-zinc-400">
            This action cannot be undone. Your account will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>Enter your password to confirm deletion:</p>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            className="bg-zinc-700 text-white border-zinc-600"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {status && <p className="text-sm text-red-400">{status}</p>}
        </div>
        <DialogFooter className="space-x-2">
          <Button variant="outline" className="bg-zinc-700 hover:bg-zinc-600" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="bg-red-700 hover:bg-red-600" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UserManagement({ data }: { data: Session }) {
  // --- Role hierarchy & permissions ---
  const roleHierarchy: Record<RoleType, number> = {
    user: 0,
    admin: 1,
    owner: 2,
  }
  // @ts-expect-error Expected
  const currentRoleRank = roleHierarchy[data.role]
  const isOwner = data.role === "owner"

  // --- State ---
  const [users, setUsers] = React.useState<AppUser[]>([])
  const [statusMsg, setStatusMsg] = React.useState<string>("")

  type ActionType = "delete" | "suspend" | "reactivate" | "promote" | "demote"

  const [modalOpen, setModalOpen] = React.useState(false)
  const [pending, setPending] = React.useState<{
    type: ActionType
    user: AppUser
  } | null>(null)

  // --- Filters ---
  const [filterStatus, setFilterStatus] = React.useState<StatusType | "all">("all")
  const [filterName, setFilterName] = React.useState<string>("")
  const [filterRole, setFilterRole] = React.useState<RoleType | "all">("all")
  const getStatus = (u: AppUser): StatusType => (u.active === "suspended" ? "suspended" : "active")

  // --- Load users from `/api/users` ---
  React.useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(({ users }: { users: AppUser[] }) => setUsers(users))
      .catch(() => setStatusMsg("Failed to load users"))
  }, [])

  // --- Confirm an action ---
  const confirmAction = async () => {
    if (!pending) return
    const { type, user } = pending

    // Only owner can change roles, and must outrank the target
    if ((["promote", "demote"].includes(type) && !isOwner) || currentRoleRank <= roleHierarchy[user.role]) {
      setStatusMsg("You don't have permission for that.")
      setModalOpen(false)
      return
    }

    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: type, id: user.id }),
    })

    if (!res.ok) {
      setStatusMsg(`Error performing ${type}`)
      setModalOpen(false)
      return
    }

    // Update UI
    setUsers(
      (uList) =>
        uList
          .map((x) => {
            if (x.id !== user.id) return x

            switch (type) {
              case "promote":
                return { ...x, role: "admin" }
              case "demote":
                return { ...x, role: "user" }
              case "suspend":
                return { ...x, active: "suspended" }
              case "reactivate":
                return { ...x, active: null }
              case "delete":
                return null
            }
          })
          .filter(Boolean) as AppUser[],
    )

    setModalOpen(false)
    setPending(null)
    setStatusMsg("")
  }
  const openModal = (type: ActionType, user: AppUser) => {
    setPending({ type, user })
    setModalOpen(true)
  }

  // --- Filtered list based on status/name/role ---
  const filteredUsers = users.filter((u) => {
    const status = getStatus(u)
    if (filterStatus !== "all" && status !== filterStatus) return false
    if (filterName && !u.name.toLowerCase().includes(filterName.toLowerCase())) return false
    if (filterRole !== "all" && u.role !== filterRole) return false
    return true
  })

  return (
    <div className="space-y-4">
      {statusMsg && <p className="text-sm text-red-400">{statusMsg}</p>}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as StatusType | "all")
          }
          className="p-2 bg-zinc-700 rounded border-zinc-600"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <input
          type="text"
          placeholder="Search name…"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="p-2 bg-zinc-700 rounded border-zinc-600"
        />

        <select
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value as RoleType | "all")
          }
          className="p-2 bg-zinc-700 rounded border-zinc-600"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-zinc-700/30 rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700 hover:bg-zinc-700/50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((u) => {
              const status = getStatus(u)
              const targetRank = roleHierarchy[u.role]
              const canModify = currentRoleRank > targetRank

              return (
                <TableRow key={u.id} className="border-zinc-700 hover:bg-zinc-700/50">
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell className="capitalize">{u.role}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        status === "active" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {canModify ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-700/70 hover:bg-red-700 text-xs h-7"
                          onClick={() => openModal("delete", u)}
                        >
                          Delete
                        </Button>

                        {status === "active" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-zinc-700 hover:bg-zinc-600 text-xs h-7"
                            onClick={() => openModal("suspend", u)}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-zinc-700 hover:bg-zinc-600 text-xs h-7"
                            onClick={() => openModal("reactivate", u)}
                          >
                            Reactivate
                          </Button>
                        )}

                        {isOwner && u.role === "user" && status === "active" && (
                          <Button
                            size="sm"
                            className="bg-zinc-700 hover:bg-zinc-600 text-xs h-7"
                            onClick={() => openModal("promote", u)}
                          >
                            Promote →
                          </Button>
                        )}

                        {isOwner && u.role === "admin" && status === "active" && (
                          <Button
                            size="sm"
                            className="bg-zinc-700 hover:bg-zinc-600 text-xs h-7"
                            onClick={() => openModal("demote", u)}
                          >
                            ← Demote
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-zinc-500 italic">No actions</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-zinc-800 text-white border-zinc-700">
          <DialogHeader>
            <DialogTitle>
              {
                {
                  delete: "Confirm Deletion",
                  suspend: "Confirm Suspension",
                  reactivate: "Confirm Reactivation",
                  promote: "Confirm Promotion",
                  demote: "Confirm Demotion",
                }[pending?.type ?? "delete"]
              }
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {
                {
                  delete: `Permanently delete "${pending?.user.name}"?`,
                  suspend: `Suspend "${pending?.user.name}"?`,
                  reactivate: `Reactivate "${pending?.user.name}"?`,
                  promote: `Promote "${pending?.user.name}" to admin?`,
                  demote: `Demote "${pending?.user.name}" to user?`,
                }[pending?.type ?? "delete"]
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button variant="outline" className="bg-zinc-700 hover:bg-zinc-600" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className={pending?.type === "delete" ? "bg-red-700 hover:bg-red-600" : "bg-zinc-700 hover:bg-zinc-600"}
              onClick={confirmAction}
            >
              {
                {
                  delete: "Delete",
                  suspend: "Suspend",
                  reactivate: "Reactivate",
                  promote: "Promote",
                  demote: "Demote",
                }[pending?.type ?? "delete"]
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Define the Role type
type RoleType = "owner" | "admin" | "user"

// Define the Status type
type StatusType = "active" | "suspended"

// Define the User type
interface AppUser {
  id: string
  name: string
  email: string
  role: RoleType
  active: StatusType | null
}

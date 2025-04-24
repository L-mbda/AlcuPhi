"use client";

import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export interface Session {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "user" | null;
}

interface SettingsProps {
  session: Session;
}

export default function Settings({ session }: SettingsProps) {
  const { id, name, email, role } = session;
  return (
    <div className="bg-zinc-900 text-white mx-auto max-w-3xl p-4 space-y-8 transition-all duration-200 ease-in-out">
      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          {(role === "owner" || role === "admin") && (
            <TabsTrigger value="admin">Administration</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="account" className="bg-zinc-800 p-4 rounded-lg">
          <div className="space-y-4">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Email:</strong> {email}</p>
            {
              (session.role != 'owner') ? (<DeleteAccountModal userId={id} />) : null
            }
          </div>
        </TabsContent>

        <TabsContent value="security" className="bg-zinc-800 p-4 rounded-lg">
          <ChangePasswordForm />
        </TabsContent>

        {(role !== 'user') && (
          <TabsContent value="admin" className="bg-zinc-800 p-4 rounded-lg">
            <UserManagement data={session} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }
    const res = await fetch("/api/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (res.ok) {
      setStatus("");
      toast({
        title: 'Updated',
        description: 'Password updated successfully.'
      })
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const { message } = await res.json();
      setStatus(message || "Error changing password");
    }
  };

  return (
    <Card className="bg-zinc-800 text-white">
        <form onSubmit={handleSubmit} className="space-y-4">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
          <div>
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current" className="bg-zinc-700 text-white"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new">New Password</Label>
            <Input
              id="new" className="bg-zinc-700 text-white"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm" className="bg-zinc-700 text-white"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {status && <p className="text-sm text-red-400">{status}</p>}
      </CardContent>
      <CardFooter>
        <Button className="bg-zinc-600 hover:bg-zinc-500" type="submit">Update Password</Button>
      </CardFooter>
      </form>
    </Card>
  );
}

interface DeleteAccountModalProps {
  userId: number;
}

function DeleteAccountModal({ userId }: DeleteAccountModalProps) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  const handleDelete = async () => {
    const res = await fetch("/api/settings/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setStatus("Account deleted. Redirecting...");
      window.location.href = "/";
    } else {
      const { error } = await res.json();
      setStatus(error || "Password entered might not be correct, please check again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="transition-all duration-200 ease-in-out bg-zinc-600 hover:bg-zinc-500">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 text-white">
        <DialogHeader>
          <DialogTitle>Confirm Account Deletion</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Enter your password to confirm deletion:</p>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            className="bg-zinc-700 text-white"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {status && <p className="text-sm text-red-400">{status}</p>}
        </div>
        <DialogFooter className="space-x-2">
          <Button variant="outline" className="bg-zinc-600 hover:bg-zinc-500">Cancel</Button>
          <Button variant="destructive" className="bg-red-700 hover:bg-red-600" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UserManagement({ data }: { data: Session }) {
  // --- Role hierarchy & permissions ---
  const roleHierarchy: Record<Role, number> = {
    user: 0,
    admin: 1,
    owner: 2,
  }
  const currentRoleRank = roleHierarchy[data.role]
  const isOwner = data.role === "owner"

  // --- State ---
  const [users, setUsers] = React.useState<User[]>([])
  const [statusMsg, setStatusMsg] = React.useState<string>("")

  type ActionType =
    | "delete"
    | "suspend"
    | "reactivate"
    | "promote"
    | "demote"

  const [modalOpen, setModalOpen] = React.useState(false)
  const [pending, setPending] = React.useState<{
    type: ActionType
    user: User
  } | null>(null)

  // --- Filters ---
  const [filterStatus, setFilterStatus] = React.useState<Status | "all">(
    "all"
  )
  const [filterName, setFilterName] = React.useState<string>("")
  const [filterRole, setFilterRole] = React.useState<Role | "all">("all")

  const getStatus = (u: User): Status =>
    u.active === "suspended" ? "suspended" : "active"
  
  // --- Load users from `/api/users` ---
  React.useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then(({ users }: { users: User[] }) => setUsers(users))
      .catch(() => setStatusMsg("Failed to load users"))
  }, [])

  // --- Confirm an action ---
  const confirmAction = async () => {
    if (!pending) return
    const { type, user } = pending

    // Only owner can change roles, and must outrank the target
    if (
      (["promote", "demote"].includes(type) && !isOwner) ||
      currentRoleRank <= roleHierarchy[user.role]
    ) {
      setStatusMsg("You don’t have permission for that.")
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
    setUsers((uList) =>
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
        .filter(Boolean) as User[]
    )

    setModalOpen(false)
    setPending(null)
    setStatusMsg("")
  }

  const openModal = (type: ActionType, user: User) => {
    setPending({ type, user })
    setModalOpen(true)
  }

  // --- Filtered list based on status/name/role ---
  const filteredUsers = users.filter((u) => {
    const status = getStatus(u)
    if (filterStatus !== "all" && status !== filterStatus) return false
    if (
      filterName &&
      !u.name.toLowerCase().includes(filterName.toLowerCase())
    )
      return false
    if (filterRole !== "all" && u.role !== filterRole) return false
    return true
  })

  return (
    <div className="space-y-4">
      {statusMsg && <p className="text-sm text-red-400">{statusMsg}</p>}

      {/* Filters */}
      <div className="flex space-x-2">
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as Status | "all")
          }
          className="p-2 bg-zinc-800 rounded"
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
          className="p-2 bg-zinc-800 rounded flex-1"
        />

        <select
          value={filterRole}
          onChange={(e) =>
            setFilterRole(e.target.value as Role | "all")
          }
          className="p-2 bg-zinc-800 rounded"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="owner">Owner</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-zinc-800 rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
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
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role}</TableCell>
                  <TableCell className="capitalize">{status}</TableCell>
                  <TableCell className="space-x-2">
                    {canModify ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => openModal("delete", u)}
                        >
                          Delete
                        </Button>

                        {status === "active" ? (
                          <Button
                            size="sm"
                            onClick={() => openModal("suspend", u)}
                          >
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => openModal("reactivate", u)}
                          >
                            Reactivate
                          </Button>
                        )}

                        {isOwner && u.role === "user" && status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => openModal("promote", u)}
                          >
                            Promote →
                          </Button>
                        )}

                        {isOwner && u.role === "admin" && status === "active" && (
                          <Button
                            size="sm"
                            onClick={() => openModal("demote", u)}
                          >
                            ← Demote
                          </Button>
                        )}
                      </>
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
        <DialogContent className="bg-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle>
              {{
                delete: "Confirm Deletion",
                suspend: "Confirm Suspension",
                reactivate: "Confirm Reactivation",
                promote: "Confirm Promotion",
                demote: "Confirm Demotion",
              }[pending?.type ?? "delete"]}
            </DialogTitle>
            <DialogDescription>
              {{
                delete: `Permanently delete “${pending?.user.name}”?`,
                suspend: `Suspend “${pending?.user.name}”?`,
                reactivate: `Reactivate “${pending?.user.name}”?`,
                promote: `Promote “${pending?.user.name}” to admin?`,
                demote: `Demote “${pending?.user.name}” to user?`,
              }[pending?.type ?? "delete"]}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-x-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmAction}>
              {{
                delete: "Delete",
                suspend: "Suspend",
                reactivate: "Reactivate",
                promote: "Promote",
                demote: "Demote",
              }[pending?.type ?? "delete"]}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
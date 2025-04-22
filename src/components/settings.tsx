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
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
            <UserManagement />
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
      setStatus("Password changed successfully");
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

function UserManagement() {
  const [users, setUsers] = React.useState<{ id: number; name: string; email: string; role: string; }[]>([]);
  const [status, setStatus] = React.useState<string>("");

  React.useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(({ users }) => setUsers(users));
  }, []);

  const handleAction = async (id: number, action: "delete" | "suspend") => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      setUsers((u) => u.filter((x) => x.id !== id));
    } else {
      setStatus("Error performing action");
    }
  };

  return (
    <div className="space-y-4">
      {status && <p className="text-sm text-red-400">{status}</p>}
      <div className="bg-zinc-800 rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-700 hover:bg-red-600"
                    onClick={() => handleAction(u.id, "delete")}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-600 hover:bg-zinc-500"
                    onClick={() => handleAction(u.id, "suspend")}
                  >
                    Suspend
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
/*
    Settings components
*/
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, User, Lock, Shield, LogOut } from 'lucide-react'

// This would normally come from a database or auth provider
const currentUser = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  role: "admin", // For demo purposes, set as admin
  createdAt: new Date("2023-01-01"),
}

// Mock data for users
const initialUsers = [
  { id: "user-1", name: "John Doe", email: "john.doe@example.com", role: "admin", status: "active" },
  { id: "user-2", name: "Jane Smith", email: "jane.smith@example.com", role: "user", status: "active" },
  { id: "user-3", name: "Bob Johnson", email: "bob.johnson@example.com", role: "user", status: "suspended" },
  { id: "user-4", name: "Alice Brown", email: "alice.brown@example.com", role: "user", status: "active" },
]

// Account Settings Component
function AccountSettings({ user }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string|null>()
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate form
    if (!formData.name || formData.name.length < 2) {
      setError("Name must be at least 2 characters.")
      setIsLoading(false)
      return
    }

    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to update the user's account
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update account")
      }

      alert("Account updated successfully")
    } catch (err) {
      console.error("Error updating account:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-100">Account Information</CardTitle>
        <CardDescription className="text-zinc-400">
          Update your account details and profile information.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-900/10 border border-red-900/20 p-3 text-sm text-red-500">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-zinc-300">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="min-h-24 border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
              <p className="text-xs text-zinc-500">Brief description for your profile.</p>
            </div>

            <div className="rounded-md bg-zinc-800/50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-zinc-700 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-zinc-300"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-200">Account Status</h4>
                  <p className="text-xs text-zinc-400">Account created on {user.createdAt.toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 bg-zinc-900 px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ name: user.name, email: user.email, bio: "" })}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

// Password Settings Component
function PasswordSettings({ user }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate form
    if (!formData.currentPassword) {
      setError("Current password is required.")
      setIsLoading(false)
      return
    }

    if (!formData.newPassword || formData.newPassword.length < 8) {
      setError("New password must be at least 8 characters.")
      setIsLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to update the user's password
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update password")
      }

      alert("Password updated successfully")
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (err) {
      console.error("Error updating password:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-100">Change Password</CardTitle>
        <CardDescription className="text-zinc-400">Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-900/10 border border-red-900/20 p-3 text-sm text-red-500">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-zinc-300">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-zinc-300">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>

            <div className="rounded-md bg-zinc-800/50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-zinc-700 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-zinc-300"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-200">Password Security</h4>
                  <p className="text-xs text-zinc-400">Use a strong password that you don't use elsewhere.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-zinc-800 bg-zinc-900 px-6 py-4">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

// Admin Settings Component
function AdminSettings() {
  const [users, setUsers] = useState(initialUsers)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Filter users based on search query and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === "all" || user.role === selectedRole

    return matchesSearch && matchesRole
  })

  const handleSuspendUser = async (userId) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to suspend the user
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "suspended" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to suspend user")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: "suspended" } : user)))
      alert("User suspended successfully")
    } catch (err) {
      console.error("Error suspending user:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivateUser = async (userId) => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to activate the user
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "active" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to activate user")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
      alert("User activated successfully")
    } catch (err) {
      console.error("Error activating user:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageUser = (user) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleAddUser = () => {
    alert("Add user functionality would be implemented here")
  }

  const handleUserUpdated = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    setIsDialogOpen(false)
  }

  const handleUserDeleted = (userId) => {
    setUsers(users.filter((user) => user.id !== userId))
    setIsDialogOpen(false)
    alert("User deleted successfully. All data transferred to System account.")
  }

  return (
    <>
      <Card className="border-zinc-800 bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-100">User Management</CardTitle>
          <CardDescription className="text-zinc-400">
            Manage users, including deleting accounts and suspending account usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-900/10 border border-red-900/20 p-4 text-sm text-red-500 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="search-users" className="sr-only">
                Search users
              </Label>
              <Input
                id="search-users"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
            <div className="w-full sm:w-[180px]">
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="border-zinc-700 bg-zinc-800 text-zinc-100 focus:ring-zinc-600">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800 text-zinc-100">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200" onClick={handleAddUser}>
              Add User
            </Button>
          </div>

          <div className="rounded-md border border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableHead className="text-zinc-400">Name</TableHead>
                  <TableHead className="text-zinc-400">Email</TableHead>
                  <TableHead className="text-zinc-400">Role</TableHead>
                  <TableHead className="text-zinc-400">Status</TableHead>
                  <TableHead className="text-zinc-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableCell className="font-medium text-zinc-300">{user.name}</TableCell>
                      <TableCell className="text-zinc-400">{user.email}</TableCell>
                      <TableCell className="text-zinc-400">
                        <span className="inline-flex items-center rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                          {user.role === "admin" ? "Administrator" : "User"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-500">
                            Suspended
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManageUser(user)}
                            className="h-8 border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
                          >
                            Manage
                          </Button>
                          {user.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendUser(user.id)}
                              className="h-8 border-orange-800/30 bg-orange-900/20 text-orange-400 hover:bg-orange-900/30"
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleActivateUser(user.id)}
                              className="h-8 border-green-800/30 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-md bg-zinc-800/50 p-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-zinc-700 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-zinc-300"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-zinc-200">Administrator Controls</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  As an administrator, you can manage users, including deleting accounts and suspending account usage.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Switch id="notify-user-actions" className="data-[state=checked]:bg-zinc-600" />
                  <Label htmlFor="notify-user-actions" className="text-xs text-zinc-300">
                    Notify users when their account status changes
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedUser && (
        <UserManagementDialog
          user={selectedUser}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onUserUpdated={handleUserUpdated}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </>
  )
}

// User Management Dialog Component
function UserManagementDialog({ user, open, onOpenChange, onUserUpdated, onUserDeleted }) {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState(user.role)
  const [confirmDelete, setConfirmDelete] = useState("")
  const [error, setError] = useState(null)

  const handleSaveChanges = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to update the user's role
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update user")
      }

      const updatedUser = { ...user, role }
      onUserUpdated(updatedUser)
    } catch (err) {
      console.error("Error updating user:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (confirmDelete !== user.email) {
      alert("Please enter the user's email to confirm deletion.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to delete the user
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete user")
      }

      onUserDeleted(user.id)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-zinc-800 bg-zinc-900 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Manage User: {user.name}</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Manage user details, role, and account status.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && (
            <div className="rounded-md bg-red-900/10 border border-red-900/20 p-3 text-sm text-red-500">{error}</div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Email</Label>
              <span className="text-sm text-zinc-400">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-zinc-300">Status</Label>
              <span className={`text-sm ${user.status === "active" ? "text-green-500" : "text-orange-500"}`}>
                {user.status === "active" ? "Active" : "Suspended"}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Role</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="user" id="role-user" className="border-zinc-700 text-zinc-100" />
                <Label htmlFor="role-user" className="text-zinc-300">
                  User
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="role-admin" className="border-zinc-700 text-zinc-100" />
                <Label htmlFor="role-admin" className="text-zinc-300">
                  Administrator
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="rounded-md border border-red-900/20 bg-red-900/10 p-4">
            <h4 className="text-sm font-medium text-red-400">Delete User Account</h4>
            <p className="mt-1 text-xs text-zinc-400">
              This action cannot be undone. All user data will be transferred to the "System" account.
            </p>
            <div className="mt-3 space-y-2">
              <Label htmlFor="confirm-delete" className="text-zinc-300">
                Type the user's email to confirm
              </Label>
              <Input
                id="confirm-delete"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder={user.email}
                className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteUser}
            disabled={isLoading || confirmDelete !== user.email}
            className="mt-3 sm:mt-0"
          >
            Delete User
          </Button>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveChanges}
              disabled={isLoading}
              className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
            >
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Danger Zone Component
function DangerZone({ user }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    password: "",
    confirmation: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.password) {
      setError("Password is required to confirm account deletion.")
      return
    }

    if (formData.confirmation !== "DELETE") {
      setError('Please type "DELETE" to confirm.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // This would be an API call to delete the user's account
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: formData.password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete account")
      }

      alert("Account deleted successfully. All data transferred to System account.")
      
      // In a real app, you would redirect to a logout page or home page
      window.location.href = "/"
    } catch (err) {
      console.error("Error deleting account:", err)
      setError(err.message || "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-zinc-100">Delete Account</h3>
          <p className="text-sm text-zinc-400 mt-1">
            Once you delete your account, all of your data will be transferred to the "System" account and
            cannot be recovered.
          </p>
        </div>

        <div className="rounded-lg border border-red-900/20 bg-red-900/10 p-4">
          <div className="space-y-4">
            <p className="text-sm text-red-400">
              <strong>Important:</strong> Upon deletion, all your sets will be transferred to the "System"
              account.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-900/10 border border-red-900/20 p-3 text-sm text-red-500">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Enter your password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your current password"
                  className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmation" className="text-zinc-300">Type "DELETE" to confirm</Label>
                <Input
                  id="confirmation"
                  name="confirmation"
                  value={formData.confirmation}
                  onChange={handleChange}
                  placeholder="DELETE"
                  className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-zinc-600"
                />
              </div>
              
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Processing..." : "Delete My Account"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


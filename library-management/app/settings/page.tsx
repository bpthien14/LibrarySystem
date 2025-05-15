"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample user data
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@library.com",
    role: "Administrator",
    status: "Active",
    lastLogin: "2023-06-01 09:15 AM",
  },
  {
    id: "2",
    name: "Librarian One",
    email: "librarian1@library.com",
    role: "Librarian",
    status: "Active",
    lastLogin: "2023-06-01 10:30 AM",
  },
  {
    id: "3",
    name: "Librarian Two",
    email: "librarian2@library.com",
    role: "Librarian",
    status: "Inactive",
    lastLogin: "2023-05-28 02:45 PM",
  },
]

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Library Information</CardTitle>
              <CardDescription>Update your library's basic information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="library-name">Library Name</Label>
                  <Input id="library-name" defaultValue="Main City Library" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-code">Library Code</Label>
                  <Input id="library-code" defaultValue="MCL-001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="library-address">Address</Label>
                <Textarea id="library-address" defaultValue="123 Library Street, Booktown, BT 12345" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="library-phone">Phone Number</Label>
                  <Input id="library-phone" defaultValue="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="library-email">Email</Label>
                  <Input id="library-email" type="email" defaultValue="info@citylibrary.org" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings for your library.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-period">Default Loan Period (Days)</Label>
                  <Input id="loan-period" type="number" defaultValue="14" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-books">Maximum Books Per Member</Label>
                  <Input id="max-books" type="number" defaultValue="5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fine-rate">Fine Rate (per day)</Label>
                  <Input id="fine-rate" type="number" defaultValue="0.50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="auto-reminders" defaultChecked />
                <Label htmlFor="auto-reminders">Send automatic reminders for due books</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="allow-renewals" defaultChecked />
                <Label htmlFor="allow-renewals">Allow members to renew books</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage staff accounts and permissions.</CardDescription>
              </div>
              <Button>Add New User</Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder-user.jpg" alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>{user.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "Administrator"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              Disable
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="due-reminder">Due Date Reminders</Label>
                    <Switch id="due-reminder" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="overdue-notice">Overdue Notices</Label>
                    <Switch id="overdue-notice" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-arrival">New Book Arrivals</Label>
                    <Switch id="new-arrival" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="account-updates">Account Updates</Label>
                    <Switch id="account-updates" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reminder-days">Send Due Date Reminder (days before due)</Label>
                  <Select defaultValue="3">
                    <SelectTrigger id="reminder-days">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="2">2 days before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="5">5 days before</SelectItem>
                      <SelectItem value="7">7 days before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="low-inventory">Low Inventory Alerts</Label>
                    <Switch id="low-inventory" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-updates">System Updates</Label>
                    <Switch id="system-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="backup-reminders">Backup Reminders</Label>
                    <Switch id="backup-reminders" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage database backups and restoration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Manual Backup</h3>
                <p className="text-sm text-muted-foreground">Create a backup of your entire library database.</p>
                <Button>Create Backup Now</Button>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Automatic Backups</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" defaultChecked />
                  <Label htmlFor="auto-backup">Enable automatic backups</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Restore Database</h3>
                <p className="text-sm text-muted-foreground">Restore your database from a previous backup.</p>
                <div className="space-y-2">
                  <Label htmlFor="backup-file">Select Backup File</Label>
                  <Input id="backup-file" type="file" />
                </div>
                <Button variant="outline">Restore from Backup</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Backup Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

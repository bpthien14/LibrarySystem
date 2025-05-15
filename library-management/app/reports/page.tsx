"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, Printer } from "lucide-react"
import { format } from "date-fns"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

// Sample data for reports
const popularBooks = [
  { title: "To Kill a Mockingbird", author: "Harper Lee", checkouts: 42 },
  { title: "1984", author: "George Orwell", checkouts: 38 },
  { title: "The Great Gatsby", author: "F. Scott Fitzgerald", checkouts: 35 },
  { title: "Pride and Prejudice", author: "Jane Austen", checkouts: 30 },
  { title: "The Hobbit", author: "J.R.R. Tolkien", checkouts: 28 },
]

const activeMembers = [
  { name: "John Smith", membershipId: "LIB-001", checkouts: 15, returns: 13 },
  { name: "Sarah Johnson", membershipId: "LIB-002", checkouts: 12, returns: 10 },
  { name: "Emily Davis", membershipId: "LIB-004", checkouts: 10, returns: 8 },
  { name: "Michael Brown", membershipId: "LIB-003", checkouts: 8, returns: 8 },
  { name: "David Wilson", membershipId: "LIB-005", checkouts: 6, returns: 5 },
]

const overdueBooks = [
  { title: "1984", member: "Sarah Johnson", dueDate: "2023-05-19", daysOverdue: 12 },
  { title: "The Hobbit", member: "John Smith", dueDate: "2023-05-12", daysOverdue: 19 },
]

const monthlyActivity = [
  { month: "Jan", checkouts: 120, returns: 110 },
  { month: "Feb", checkouts: 132, returns: 125 },
  { month: "Mar", checkouts: 145, returns: 138 },
  { month: "Apr", checkouts: 155, returns: 148 },
  { month: "May", checkouts: 170, returns: 160 },
  { month: "Jun", checkouts: 165, returns: 162 },
]

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checkouts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,186</div>
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">-5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Members</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Checkouts and returns over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={monthlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="checkouts" fill="#8884d8" />
                <Bar dataKey="returns" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Customize your report view</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue="activity">
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activity">Activity Report</SelectItem>
                      <SelectItem value="popular">Popular Books</SelectItem>
                      <SelectItem value="overdue">Overdue Books</SelectItem>
                      <SelectItem value="members">Member Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <Button className="w-full">Generate Report</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="popular" className="space-y-4">
        <TabsList>
          <TabsTrigger value="popular">Popular Books</TabsTrigger>
          <TabsTrigger value="active">Active Members</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Total Checkouts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularBooks.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="text-right">{book.checkouts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Membership ID</TableHead>
                  <TableHead className="text-right">Total Checkouts</TableHead>
                  <TableHead className="text-right">Total Returns</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.membershipId}</TableCell>
                    <TableCell className="text-right">{member.checkouts}</TableCell>
                    <TableCell className="text-right">{member.returns}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="overdue" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Days Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overdueBooks.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>{book.member}</TableCell>
                    <TableCell>{book.dueDate}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">{book.daysOverdue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

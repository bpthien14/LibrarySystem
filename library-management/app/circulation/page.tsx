"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BookCheck, BookX, Search } from "lucide-react"

// Sample checkout data
const checkouts = [
  {
    id: "1",
    bookTitle: "To Kill a Mockingbird",
    memberName: "John Smith",
    membershipId: "LIB-001",
    checkoutDate: "2023-05-10",
    dueDate: "2023-05-24",
    status: "On Time",
  },
  {
    id: "2",
    bookTitle: "1984",
    memberName: "Sarah Johnson",
    membershipId: "LIB-002",
    checkoutDate: "2023-05-05",
    dueDate: "2023-05-19",
    status: "Overdue",
  },
  {
    id: "3",
    bookTitle: "The Great Gatsby",
    memberName: "Emily Davis",
    membershipId: "LIB-004",
    checkoutDate: "2023-05-12",
    dueDate: "2023-05-26",
    status: "On Time",
  },
  {
    id: "4",
    bookTitle: "Pride and Prejudice",
    memberName: "Emily Davis",
    membershipId: "LIB-004",
    checkoutDate: "2023-05-08",
    dueDate: "2023-05-22",
    status: "On Time",
  },
  {
    id: "5",
    bookTitle: "The Hobbit",
    memberName: "John Smith",
    membershipId: "LIB-001",
    checkoutDate: "2023-04-28",
    dueDate: "2023-05-12",
    status: "Overdue",
  },
]

export default function CirculationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCheckinOpen, setIsCheckinOpen] = useState(false)

  const filteredCheckouts = checkouts.filter(
    (checkout) =>
      checkout.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      checkout.membershipId.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Circulation</h2>
        <div className="flex space-x-2">
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <Button>
                <BookCheck className="mr-2 h-4 w-4" />
                Check Out
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Check Out Book</DialogTitle>
                <DialogDescription>Enter the details to check out a book to a member.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="book-search">Book</Label>
                  <Input id="book-search" placeholder="Search for a book by title or ISBN..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-search">Member</Label>
                  <Input id="member-search" placeholder="Search for a member by name or ID..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="checkout-date">Checkout Date</Label>
                    <Input id="checkout-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCheckoutOpen(false)}>Check Out Book</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isCheckinOpen} onOpenChange={setIsCheckinOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <BookX className="mr-2 h-4 w-4" />
                Check In
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Check In Book</DialogTitle>
                <DialogDescription>Enter the details to check in a returned book.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="book-search-checkin">Book</Label>
                  <Input id="book-search-checkin" placeholder="Search for a book by title or ISBN..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkin-date">Check In Date</Label>
                  <Input id="checkin-date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Book Condition</Label>
                  <Input id="condition" placeholder="Note any damage or issues..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckinOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCheckinOpen(false)}>Check In Book</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Current Checkouts</TabsTrigger>
          <TabsTrigger value="history">Checkout History</TabsTrigger>
          <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by book, member, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Checkout Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckouts.map((checkout) => (
                  <TableRow key={checkout.id}>
                    <TableCell className="font-medium">{checkout.bookTitle}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{getInitials(checkout.memberName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{checkout.memberName}</div>
                          <div className="text-xs text-muted-foreground">{checkout.membershipId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(checkout.checkoutDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(checkout.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(checkout.status)}>
                        {checkout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setIsCheckinOpen(true)}>
                        Check In
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Checkout History</CardTitle>
              <CardDescription>View the complete history of book checkouts and returns.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Historical checkout data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Overdue Books</CardTitle>
              <CardDescription>Books that are past their due date.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Title</TableHead>
                      <TableHead>Member</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkouts
                      .filter((checkout) => checkout.status === "Overdue")
                      .map((checkout) => (
                        <TableRow key={checkout.id}>
                          <TableCell className="font-medium">{checkout.bookTitle}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{getInitials(checkout.memberName)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div>{checkout.memberName}</div>
                                <div className="text-xs text-muted-foreground">{checkout.membershipId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(checkout.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-red-600 font-medium">
                            {Math.floor(
                              (new Date().getTime() - new Date(checkout.dueDate).getTime()) / (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Send Reminder
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => setIsCheckinOpen(true)}>
                                Check In
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
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { LogOut, Upload, Users, CheckCircle, Clock, UserCheck, AlertCircle, Building2, Mail, Phone, MapPin, Building, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

// Dummy user info
const userInfo = {
  name: "Sarah Johnson",
  email: "sarah.johnson@company.com",
  employeeId: "EMP001234",
}

// Dummy recent referrals
const recentReferrals = [
  { id: 1, name: "Alex Chen", position: "Backend Engineer", status: "Interview Scheduled", date: "2 days ago", type: "success" },
  { id: 2, name: "Sarah Wilson", position: "Product Designer", status: "Under Review", date: "1 week ago", type: "pending" },
  { id: 3, name: "John Smith", position: "Frontend Developer", status: "Hired", date: "2 weeks ago", type: "success" },
  { id: 4, name: "Emily Davis", position: "UX Researcher", status: "Rejected", date: "3 weeks ago", type: "rejected" },
]

// Dummy departments list
const departments = {
  Engineering: ["Senior Frontend Developer", "Backend Engineer", "Full Stack Developer", "DevOps Engineer"],
  Marketing: ["Digital Marketing Manager", "Content Strategist"],
  Sales: ["Account Executive", "Customer Success Manager"],
}

const getStatusIcon = (type: string) => {
  switch (type) {
    case "success": return <UserCheck className="h-4 w-4 text-green-600" />
    case "pending": return <Clock className="h-4 w-4 text-yellow-600" />
    case "rejected": return <AlertCircle className="h-4 w-4 text-red-600" />
    default: return <Clock className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hired": return "bg-green-100 text-green-800"
    case "Interview Scheduled": return "bg-blue-100 text-blue-800"
    case "Under Review": return "bg-yellow-100 text-yellow-800"
    case "Rejected": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function ReferralDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [formData, setFormData] = useState({ refereeName: "", refereeEmail: "", refereePhone: "",refereeLinkedIn: "", comments: "" })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedFile(file)
        toast({ title: "Resume uploaded successfully", description: `${file.name} is ready for submission.` })
      } else {
        toast({ title: "Invalid file format", description: "Please upload a PDF file only.", variant: "destructive" })
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.refereeName || !formData.refereeEmail || !selectedDepartment || !selectedRole) {
      toast({ title: "Please complete all required fields", variant: "destructive" })
      return
    }
    toast({ title: "Referral submitted successfully!", description: "HR will review and update you." })
    setFormData({ refereeName: "", refereeEmail: "", refereePhone: "",refereeLinkedIn: "", comments: "" })
    setSelectedDepartment("")
    setSelectedRole("")
    setUploadedFile(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl h-16 mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-[#FF5D1D]" />
              <h1 className="text-xl font-semibold text-gray-900">Employee Dashboard</h1>
            </div>

          
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <LogOut className="h-12 w-12" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Referral Form */}
          <div className="lg:col-span-2 mt-12">
            <Card className="shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-gray-900">Submit a Referral</CardTitle>
                <p className="text-gray-600">Help us find great talent for our team</p>
              </CardHeader>

              <CardContent className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Candidate Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-[#FF5D1D]" />
                      Candidate Information
                    </h3>
</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="refereeName">Full Name *</Label>
    <Input
      id="refereeName"
      value={formData.refereeName}
      onChange={(e) => handleInputChange("refereeName", e.target.value)}
      placeholder="Enter candidate's name"
      className="mt-1"
    />
  </div>

  <div>
    <Label htmlFor="refereeEmail">Email Address *</Label>
    <Input
      id="refereeEmail"
      type="email"
      value={formData.refereeEmail}
      onChange={(e) => handleInputChange("refereeEmail", e.target.value)}
      placeholder="Enter email address"
      className="mt-1"
    />
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label htmlFor="refereePhone">Phone Number</Label>
    <Input
      id="refereePhone"
      value={formData.refereePhone}
      onChange={(e) => handleInputChange("refereePhone", e.target.value)}
      placeholder="Enter phone number"
      className="mt-1"
    />
  </div>

  <div>
    <Label htmlFor="refereeLinkedIn">LinkedIn Profile</Label>
    <Input
      id="refereeLinkedIn"
      type="url"
      value={formData.refereeLinkedIn}
      onChange={(e) => handleInputChange("refereeLinkedIn", e.target.value)}
      placeholder="https://www.linkedin.com/in/username"
      className="mt-1"
    />
  </div>
</div>


                  {/* Position Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Department *</Label>
                      <Select value={selectedDepartment} onValueChange={(value) => { setSelectedDepartment(value); setSelectedRole("") }}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>{Object.keys(departments).map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Role *</Label>
                      <Select value={selectedRole} onValueChange={setSelectedRole} disabled={!selectedDepartment}>
                        <SelectTrigger className="mt-1"><SelectValue placeholder={selectedDepartment ? "Select role" : "Select department first"} /></SelectTrigger>
                        <SelectContent>{selectedDepartment && departments[selectedDepartment as keyof typeof departments].map((role) => (<SelectItem key={role} value={role}>{role}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <Label>Upload Resume (PDF only)</Label>
                    <Input type="file" accept=".pdf" onChange={handleFileUpload} className="mt-1" />
                    {uploadedFile && <div className="mt-2 flex items-center text-sm text-green-600"><CheckCircle className="h-4 w-4 mr-1" />{uploadedFile.name}</div>}
                  </div>

                  {/* Comments */}
                  <div>
                    <Label>Comments (Optional)</Label>
                    <Textarea value={formData.comments} onChange={(e) => handleInputChange("comments", e.target.value)} placeholder="Any additional context..." className="mt-1 min-h-[100px]" />
                  </div>

                  <Button type="submit" className="w-full bg-[#FF5D1D] hover:bg-[#E54A15] text-white py-3 text-base font-medium">Submit Referral</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Profile Info + Recent Referrals */}
          <div className="space-y-[50px] mt-12">
            {/* Profile Info Table */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-lg text-gray-900">Profile Information</CardTitle></CardHeader>
<CardContent className="space-y-3 text-sm text-gray-600">
  {/* Name on top */}
  <div className="flex items-center text-lg font-medium text-gray-600">
    {userInfo.name}
  </div>

  {/* Employee ID */}
  <div className="flex items-center">
    <Building className="h-4 w-4 mr-2" />
    ID: {userInfo.employeeId}
  </div>

  {/* Email */}
  <div className="flex items-center">
    <Mail className="h-4 w-4 mr-2" />
    {userInfo.email}
  </div>

</CardContent>

            </Card>

            {/* Recent Referrals */}
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-lg text-gray-900">Recent Referrals</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {recentReferrals.map((ref) => (
                  <div key={ref.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">{getStatusIcon(ref.type)}<span className="font-medium text-gray-900 text-sm">{ref.name}</span></div>
                      <Badge className={`text-xs ${getStatusColor(ref.status)}`}>{ref.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{ref.position}</p>
                    <p className="text-xs text-gray-500">{ref.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


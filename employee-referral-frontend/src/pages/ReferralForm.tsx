"use client";

import { useState } from "react";
import {
  LogOut,
  Users,
  CheckCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Upload} from "lucide-react";


// ✅ Dummy employee info (you can replace with real data from login/localStorage)
const employeeInfo = {
  name: localStorage.getItem("userName") || "Sarah Johnson",
  employeeId: localStorage.getItem("employeeId") || "EMP001234",
};

// ✅ Dummy departments list
const departments = {
  Engineering: [
    "Senior Frontend Developer",
    "Backend Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
  ],
  Marketing: ["Digital Marketing Manager", "Content Strategist"],
  Sales: ["Account Executive", "Customer Success Manager"],
};

export default function ReferralDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    refereeName: "",
    refereeEmail: "",
    refereePhone: "",
    refereeLinkedIn: "",
    comments: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedFile(file);
        toast({
          title: "Resume uploaded successfully",
          description: `${file.name} is ready for submission.`,
        });
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.refereeName ||
      !formData.refereeEmail ||
      !selectedDepartment ||
      !selectedRole
    ) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Referral submitted successfully!",
      description: "HR will review and update you.",
    });
    setFormData({
      refereeName: "",
      refereeEmail: "",
      refereePhone: "",
      refereeLinkedIn: "",
      comments: "",
    });
    setSelectedDepartment("");
    setSelectedRole("");
    setUploadedFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* ✅ Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl h-16 mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-[#FF5D1D]" />
              <h1 className="text-xl font-semibold text-gray-900">
                Employee Referral
              </h1>
            </div>

            {/* ✅ Employee Info + Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{employeeInfo.name}</span> (
                {employeeInfo.employeeId})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Main Form */}
      <div className="max-w-4xl mx-auto mt-8 px-6 py-8">
        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-gray-900">
              Submit a Referral
            </CardTitle>
            <p className="text-gray-600">
              Help us find great talent for our team
            </p>
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
                    onChange={(e) =>
                      handleInputChange("refereeName", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("refereeEmail", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("refereePhone", e.target.value)
                    }
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
                    onChange={(e) =>
                      handleInputChange("refereeLinkedIn", e.target.value)
                    }
                    placeholder="https://www.linkedin.com/in/username"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Position Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Department *</Label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value) => {
                      setSelectedDepartment(value);
                      setSelectedRole("");
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(departments).map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Role *</Label>
                  <Select
                    value={selectedRole}
                    onValueChange={setSelectedRole}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue
                        placeholder={
                          selectedDepartment
                            ? "Select role"
                            : "Select department first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedDepartment &&
                        departments[
                          selectedDepartment as keyof typeof departments
                        ].map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

            
{/* Resume Upload with Drag & Drop (Card Style) */}
<div
  className="mt-1 flex flex-col items-center justify-center p-5 bg-gray-100 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
  onDragOver={(e) => e.preventDefault()}
  onDrop={(e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setUploadedFile(file);
        toast({
          title: "Resume uploaded successfully",
          description: `${file.name} is ready for submission.`,
        });
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF file only.",
          variant: "destructive",
        });
      }
    }
  }}
  onClick={() => document.getElementById("resumeUpload")?.click()}
>
  <Upload className="h-8 w-8 text-gray-500 mb-2" />
  <p className="text-gray-700 font-medium">
    Drop your PDF here or{" "}
    <span className="text-[#FF5D1D] hover:underline">browse</span>
  </p>
  <p className="text-xs text-gray-500">Only PDF files are accepted</p>

  <Input
    id="resumeUpload"
    type="file"
    accept=".pdf"
    onChange={handleFileUpload}
    className="hidden"
  />
</div>

{uploadedFile && (
  <div className="mt-2 flex items-center text-sm text-green-600">
    <CheckCircle className="h-4 w-4 mr-1" />
    {uploadedFile.name}
  </div>
)}


              {/* Comments */}
              <div>
                <Label>Comments (Optional)</Label>
                <Textarea
                  value={formData.comments}
                  onChange={(e) =>
                    handleInputChange("comments", e.target.value)
                  }
                  placeholder="Any additional context..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF5D1D] hover:bg-[#E54A15] text-white py-3 text-base font-medium"
              >
                Submit Referral
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

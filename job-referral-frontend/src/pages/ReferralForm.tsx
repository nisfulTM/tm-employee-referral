import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Users, CheckCircle, Building2, Upload } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { saveReferral } from "@/services/referral";
import {
  ReferralSchema,
  type TReferralForm,
  type TSaveReferralPayload,
} from "@/types/referral.d";

import departmentsData from "@/mocks/department.json";
type Departments = Record<string, string[]>;

const departments: Departments = departmentsData as Departments;

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function ReferralDashboard() {
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const form = useForm<TReferralForm>({
    resolver: zodResolver(ReferralSchema),
    defaultValues: {
      refereeName: "",
      refereeEmail: "",
      refereePhone: "",
      refereeLinkedIn: "",
      department: "",
      role: "",
      comments: "",
    },
  });

  const { mutate: submit, isPending } = useMutation({
    mutationFn: saveReferral,
    onSuccess: () => {
      toast({
        title: "Referral submitted successfully!",
        description: "HR will review and update you.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: TReferralForm) => {
    if (!data.resume) {
      toast({
        title: "Resume is required",
        description: "Please upload the candidate's resume.",
        variant: "destructive",
      });
      return;
    }

    try {
      const resumeBase64 = await toBase64(data.resume);

      const payload: TSaveReferralPayload = {
        fullname: data.refereeName,
        email: data.refereeEmail,
        phone_number: data.refereePhone || "",
        linkedin_url: data.refereeLinkedIn || undefined,
        department: data.department,
        role: data.role,
        resume: resumeBase64,
      };

      submit(payload);
    } catch {
      toast({
        title: "File processing failed",
        description: "Could not process the resume file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const selectedDepartment = form.watch("department");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl h-16 mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-[#FF5D1D]" />
              <h1 className="text-xl font-semibold text-gray-900">
                Employee Referral
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <span className="font-semibold">{user.name}</span> (
                {user.employeeId})
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

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
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-[#FF5D1D]" />
                    Candidate Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="refereeName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Full Name *</Label>
                        <FormControl>
                          <Input
                            placeholder="Enter candidate's name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="refereeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Email Address *</Label>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="refereePhone"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Phone Number</Label>
                        <FormControl>
                          <Input placeholder="(Optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="refereeLinkedIn"
                    render={({ field }) => (
                      <FormItem>
                        <Label>LinkedIn Profile</Label>
                        <FormControl>
                          <Input placeholder="(Optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-[#FF5D1D]" />
                    Referral Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Department *</Label>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (!departments[value]?.length) {
                              form.setValue("role", "");
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(departments).map((deptKey) => (
                              <SelectItem key={deptKey} value={deptKey}>
                                {deptKey}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Role *</Label>

                        {!selectedDepartment ? (
                          <FormControl>
                            <Input
                              placeholder="Select a department first"
                              disabled
                            />
                          </FormControl>
                        ) : departments[selectedDepartment]?.length > 0 ? (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departments[selectedDepartment].map(
                                (role: string) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        ) : (
                          <FormControl>
                            <Input
                              placeholder="Enter role manually"
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                        )}

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Candidate's Resume *</Label>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              id="resume-upload"
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  field.onChange(e.target.files[0]);
                                }
                              }}
                            />
                            <label
                              htmlFor="resume-upload"
                              className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400"
                            >
                              <div className="text-center">
                                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">
                                  <span className="font-semibold text-[#FF5D1D]">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  PDF only
                                </p>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {field.value && (
                          <div className="mt-2 flex items-center text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>{(field.value as File).name}</span>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Additional Comments</Label>
                        <FormControl>
                          <Textarea
                            placeholder="Why do you recommend this candidate? (Optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#FF5D1D] hover:bg-[#E54A15] text-white py-3 text-base font-medium"
                >
                  {isPending ? "Submitting..." : "Submit Referral"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

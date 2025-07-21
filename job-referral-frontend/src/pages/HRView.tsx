import React, { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Eye, Users, Clock, CheckCircle, TrendingUp, LogOut, Building2, Download
} from "lucide-react";

/* ✅ Types */
export type ReferralStatus =
  | "received"
  | "shortlisted"
  | "on_hold"
  | "rejected"
  | "hired";

export interface Position {
  title: string;
  department: string;
}

export interface Referral {
  id: string;
  candidateName: string;
  candidateEmail: string;
  yearsOfExperience: number;
  relation: string;
  position: Position;
  referrerName: string;
  referrerEmployeeId: string;
  status: ReferralStatus;
  submittedAt: string;
  updatedAt?: Date;
  notes?: string;
  resumeUrl: string;
}

/* ✅ Status Labels & Colors */
export const statusLabels: Record<ReferralStatus, string> = {
  received: "Received",
  shortlisted: "Shortlisted",
  on_hold: "On-hold",
  rejected: "Rejected",
  hired: "Hired",
};

export const statusColors: Record<ReferralStatus, string> = {
  received: "bg-yellow-500 text-black",
  shortlisted: "bg-blue-500 text-white",
  on_hold: "bg-purple-500 text-white",
  rejected: "bg-red-500 text-white",
  hired: "bg-green-700 text-white",
};

/* ✅ Mock Referrals */
export const mockReferrals: Referral[] = [
  {
    id: "R1",
    candidateName: "John Doe",
    candidateEmail: "john@example.com",
    yearsOfExperience: 5,
    relation: "Friend",
    position: { title: "Frontend Developer", department: "IT" },
    referrerName: "Jane Smith",
    referrerEmployeeId: "EMP001",
    status: "received",
    submittedAt: new Date().toISOString(),
    resumeUrl: "/resumes/john_doe.pdf",
  },
  {
    id: "R2",
    candidateName: "Alice Johnson",
    candidateEmail: "alice@example.com",
    yearsOfExperience: 3,
    relation: "Colleague",
    position: { title: "Backend Developer", department: "Engineering" },
    referrerName: "Mark Lee",
    referrerEmployeeId: "EMP002",
    status: "shortlisted",
    submittedAt: new Date().toISOString(),
    resumeUrl: "/resumes/alice_johnson.pdf",
  },
];

/* ✅ Layout */
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    toast({
      title: "Logged out successfully",
      description: "You have been signed out.",
    });
    navigate("/login", { replace: true });
  };

  const hrName = localStorage.getItem("hrName") || "HR User";
  const hrEmployeeId = localStorage.getItem("hrEmployeeId") || "N/A";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-[#FF5D1D]" />
            <h1 className="text-xl font-bold">HR Referral Management</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-medium">{hrName}</p>
              <p className="text-xs text-muted-foreground">{hrEmployeeId}</p>
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
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

/* ✅ Dashboard */
const AdminDashboard = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [modalStatus, setModalStatus] = useState<ReferralStatus>("received");
  const [modalNotes, setModalNotes] = useState("");
  const [activeTab, setActiveTab] = useState("new");
  const { toast } = useToast();

  useEffect(() => {
    setReferrals(mockReferrals);
  }, []);

  const updateReferralStatus = (referralId: string, newStatus: ReferralStatus, notes?: string) => {
    setReferrals((prev) =>
      prev.map((referral) =>
        referral.id === referralId
          ? { ...referral, status: newStatus, updatedAt: new Date(), notes }
          : referral
      )
    );
    toast({
      title: "Status Updated",
      description: `Referral status changed to ${statusLabels[newStatus]}`,
    });
  };

  const openModal = (referral: Referral) => {
    setSelectedReferral(referral);
    setModalStatus(referral.status);
    setModalNotes(referral.notes || "");
  };

  const saveModalChanges = () => {
    if (selectedReferral) {
      updateReferralStatus(selectedReferral.id, modalStatus, modalNotes);
      setSelectedReferral(null);
    }
  };

  const getCategorizedReferrals = () => {
    const newReferrals = referrals.filter((r) => r.status === "received");
    const activeReferrals = referrals.filter((r) =>
      ["shortlisted", "on_hold"].includes(r.status)
    );
    const historyReferrals = referrals.filter((r) =>
      ["hired", "rejected"].includes(r.status)
    );
    return { newReferrals, activeReferrals, historyReferrals };
  };

  const stats = {
    total: referrals.length,
    pending: referrals.filter((r) => r.status === "received").length,
    active: referrals.filter((r) =>
      ["shortlisted", "on_hold"].includes(r.status)
    ).length,
    hired: referrals.filter((r) => r.status === "hired").length,
  };

  const { newReferrals, activeReferrals, historyReferrals } = getCategorizedReferrals();

 const renderReferralTable = (referrals: Referral[]) => (
  <div className="space-y-4">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Referred By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {referrals.map((referral) => (
          <TableRow key={referral.id}>
            {/* ✅ Candidate */}
            <TableCell>
              <p className="font-medium">{referral.candidateName}</p>
              <p className="text-xs text-muted-foreground">{referral.candidateEmail}</p>
            </TableCell>

            {/* ✅ Position */}
            <TableCell>
              <p className="font-medium">{referral.position.title}</p>
              <p className="text-xs text-muted-foreground">{referral.position.department}</p>
            </TableCell>

            {/* ✅ Referrer */}
            <TableCell>
              <p className="font-medium">{referral.referrerName}</p>
              <p className="text-xs text-muted-foreground">{referral.referrerEmployeeId}</p>
            </TableCell>

            {/* ✅ Status */}
            <TableCell>
              <Badge className={statusColors[referral.status]}>
                {statusLabels[referral.status]}
              </Badge>
            </TableCell>

            {/* ✅ Resume Download */}
            <TableCell>
              <a
                href={referral.resumeUrl}
                download
                className="flex items-center text-blue-600 hover:underline"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </TableCell>

            {/* ✅ View Button */}
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                 className="bg-[#FF5D1D] hover:border-black  text-white"
                onClick={() => openModal(referral)}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);


  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hired</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hired}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Management</CardTitle>
          <CardDescription>Manage referral applications by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new">New ({newReferrals.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeReferrals.length})</TabsTrigger>
              <TabsTrigger value="history">
                History ({historyReferrals.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="mt-6">
              {renderReferralTable(newReferrals)}
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              {renderReferralTable(activeReferrals)}
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              {renderReferralTable(historyReferrals)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ✅ Modal */}
      {selectedReferral && (
        <Dialog open={!!selectedReferral} onOpenChange={() => setSelectedReferral(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Update Status & Notes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select value={modalStatus} onValueChange={(value: ReferralStatus) => setModalStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusLabels).map((key) => (
                      <SelectItem key={key} value={key}>
                        {statusLabels[key as ReferralStatus]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Add notes about this referral"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedReferral(null)}>
                Close
              </Button>
              <Button  className="bg-[#FF5D1D] hover:bg-[#e6541a] text-white" onClick={saveModalChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

/* ✅ Main Export */
const AdminApp = () => {
  const role = localStorage.getItem("role");
  if (role !== "hr") {
    window.location.href = "/login";
    return null;
  }
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
};

export default AdminApp;


import { Eye, Download } from "lucide-react";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TReferralItem } from "@/types/referral.d";
import { statusColors, statusLabels } from "@/types/hr";

interface ReferralTableProps {
  referrals: TReferralItem[];
  onOpenModal: (referral: TReferralItem) => void;
}

const ReferralTable = ({ referrals, onOpenModal }: ReferralTableProps) => (
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
              <p className="font-medium">{referral.fullname}</p>
              <p className="text-xs text-muted-foreground">{referral.email}</p>
            </TableCell>

            {/* ✅ Position */}
            <TableCell>
              <p className="font-medium">{referral.role}</p>
              <p className="text-xs text-muted-foreground">{referral.department}</p>
            </TableCell>

            {/* ✅ Referrer */}
            <TableCell>
              <p className="font-medium">Referred By</p>
              <p className="text-xs text-muted-foreground">ID: {referral.referred_by}</p>
            </TableCell>

            {/* ✅ Status */}
            <TableCell>
              <Badge className={statusColors[referral.status as keyof typeof statusColors]}>
                {statusLabels[referral.status as keyof typeof statusLabels]}
              </Badge>
            </TableCell>

            {/* ✅ Resume Download */}
            <TableCell>
              <Button
                variant="link"
                className="flex items-center text-blue-600 hover:underline p-0"
                onClick={async () => {
                 try {
                  const response = await fetch(referral.resume, { mode: "cors" });
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${referral.fullname}_Resume.pdf`; // Force download
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error("Download failed", error);
                } 
                 }}
               >
                <Download className="w-4 h-4 mr-1" />
                 Download
              </Button>
            </TableCell>

            {/* ✅ View Button */}
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                className="bg-[#FF5D1D] hover:border-black  text-white"
                onClick={() => onOpenModal(referral)}
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

export default ReferralTable;

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { statusLabels } from "@/types/hr";
import type { TReferralItem, TReferralStatus } from "@/types/referral.d";

interface UpdateStatusDialogProps {
  referral: TReferralItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (status: TReferralStatus, notes: string) => void;
}

const UpdateStatusDialog = ({
  referral,
  isOpen,
  onClose,
  onSave,
}: UpdateStatusDialogProps) => {
  const [status, setStatus] = useState<TReferralStatus>("received");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (referral) {
      setStatus(referral.status as TReferralStatus);
      setNotes(""); // Notes are not part of the list item, initialize as empty
    }
  }, [referral]);

  const handleSave = () => {
    onSave(status, notes);
  };

  if (!isOpen || !referral) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Status & Notes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(value: TReferralStatus) => setStatus(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statusLabels).map((key) => (
                  <SelectItem key={key} value={key}>
                    {statusLabels[key as TReferralStatus]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this referral"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            className="bg-[#FF5D1D] hover:bg-[#e6541a] text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusDialog;

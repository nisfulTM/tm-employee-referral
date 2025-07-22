import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getReferralList, updateReferralStatus } from "@/services/referral";
import type { TReferralItem, TReferralStatus } from "@/types/referral.d.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusLabels } from "@/types/hr";
import DashboardStats from "./DashboardStats";
import ReferralTable from "./ReferralTable";
import UpdateStatusDialog from "./UpdateStatusDialog";

const AdminDashboard = () => {
  const [selectedReferral, setSelectedReferral] =
    useState<TReferralItem | null>(null);
  const [activeTab, setActiveTab] = useState("new");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: getReferralList,
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: updateReferralStatus,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["referrals"] });
      toast({
        title: "Status Updated",
        description: `Referral status changed to ${
          statusLabels[variables.status as TReferralStatus]
        }`,
      });
    },
    onError: (_error) => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const openModal = (referral: TReferralItem) => {
    setSelectedReferral(referral);
  };

  const saveModalChanges = (status: TReferralStatus, notes: string) => {
    if (selectedReferral) {
      updateStatus({ id: selectedReferral.id, status, notes });
      setSelectedReferral(null);
    }
  };

  const newReferrals = data?.data?.new || [];
  const activeReferrals = data?.data?.active || [];
  const historyReferrals = data?.data?.history || [];

  const stats = {
    total:
      newReferrals.length + activeReferrals.length + historyReferrals.length,
    pending: newReferrals.length,
    active: activeReferrals.length,
    hired: historyReferrals.filter((r) => r.status === "hired").length,
  };

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />

      <Card>
        <CardHeader>
          <CardTitle>Referral Management</CardTitle>
          <CardDescription>
            Manage referral applications by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="new">New ({newReferrals.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeReferrals.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({historyReferrals.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="new" className="mt-6">
              <ReferralTable referrals={newReferrals} onOpenModal={openModal} />
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              <ReferralTable
                referrals={activeReferrals}
                onOpenModal={openModal}
              />
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <ReferralTable
                referrals={historyReferrals}
                onOpenModal={openModal}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UpdateStatusDialog
        referral={selectedReferral}
        isOpen={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        onSave={saveModalChanges}
      />
    </div>
  );
};

export default AdminDashboard;

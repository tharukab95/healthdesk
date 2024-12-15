/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api-client";
import { useSession } from "next-auth/react";

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  patientId: string;
  patientName: string;
  appointmentDate: Date;
}

export function BillingModal({
  isOpen,
  onClose,
  appointmentId,
  patientId,
  patientName,
  appointmentDate,
}: BillingModalProps) {
  const [consultationFee, setConsultationFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [billingId, setBillingId] = useState<string | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  const handleSave = async () => {
    if (!consultationFee) {
      toast({
        title: "Error",
        description: "Please enter consultation fee",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetchApi("/billing", {
        method: "POST",
        body: JSON.stringify({
          appointmentId,
          patientId,
          consultationFee: parseFloat(consultationFee),
          medicationCosts: [],
          totalAmount: parseFloat(consultationFee),
        }),
      });

      setBillingId(response.billing.id);
      toast({
        title: "Success",
        description: "Billing information saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save billing information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    const doctorName = session?.user?.name || "";
    const slmcNo = "SLMC12345"; // Dummy SLMC number

    // Store the original content
    const originalContent = document.body.innerHTML;

    // Replace content with print content
    document.body.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2>Medical Invoice</h2>
        </div>
        <div style="margin: 10px 0;">
          <span style="font-weight: bold; display: inline-block; width: 150px;">Date:</span>
          <span>${new Date(appointmentDate).toLocaleDateString()}</span>
        </div>
        <div style="margin: 10px 0;">
          <span style="font-weight: bold; display: inline-block; width: 150px;">Appointment No:</span>
          <span>${appointmentId}</span>
        </div>
        <div style="margin: 10px 0;">
          <span style="font-weight: bold; display: inline-block; width: 150px;">Patient Name:</span>
          <span>${patientName}</span>
        </div>
        <div style="margin: 20px 0; padding: 10px; border-top: 1px solid #ccc;">
          <span style="font-weight: bold; display: inline-block; width: 150px;">Consultation Fee:</span>
          <span>Rs. ${consultationFee}</span>
        </div>
        <div style="margin-top: 50px; text-align: center;">
          <p>${doctorName}</p>
          <p>SLMC Reg No: ${slmcNo}</p>
        </div>
      </div>
    `;

    // Print
    window.print();

    // After print, restore original content and close modal
    document.body.innerHTML = originalContent;
    
    // Re-initialize any event listeners or React after restoring content
    window.location.reload();
    
    // Close the modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {billingId ? "Print Invoice" : "Add Consultation Fee"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!billingId ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                placeholder="Enter consultation fee"
              />
              <span className="text-sm font-medium">Rs.</span>
            </div>
          ) : (
            <div className="text-center text-lg font-medium">
              Consultation Fee: Rs. {consultationFee}
            </div>
          )}
          <Button
            className="w-full"
            onClick={billingId ? handlePrint : handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : billingId ? "Print Invoice" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

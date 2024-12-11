/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { MedicineData, MedicationData, MedicationWithMedicine } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { fetchApi } from "@/lib/api-client";

interface PrescriptionWritingFormProps {
  patientId: string;
  onSubmit: (success?: boolean) => void;
  onCancel?: () => void;
}

export default function PrescriptionWritingForm({
  patientId,
  onSubmit,
  onCancel,
}: PrescriptionWritingFormProps) {
  const [medicines, setMedicines] = useState<MedicineData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(
    null
  );
  const [prescriptionMedicines, setPrescriptionMedicines] = useState<
    MedicationWithMedicine[]
  >([]);
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [medicationDetails, setMedicationDetails] = useState({
    dosage: "",
    frequency: "",
    duration: "",
  });
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const data = await fetchApi("/medicines");
        setMedicines(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch medicines",
          variant: "destructive",
        });
      }
    };

    fetchMedicines();
  }, [toast]);

  const handleMedicineChange = (medicineId: string) => {
    const medicine = medicines.find((med) => med.id === medicineId);
    setSelectedMedicine(medicine || null);
  };

  const handleAddMedicine = () => {
    if (!selectedMedicine) return;

    const medicationData: MedicationWithMedicine = {
      medicineId: selectedMedicine.id!,
      medicine: selectedMedicine,
      ...medicationDetails,
    };
    setPrescriptionMedicines((prev) => [...prev, medicationData]);
    setSelectedMedicine(null);
    setMedicationDetails({ dosage: "", frequency: "", duration: "" });
  };

  const handleSubmit = async () => {
    if (prescriptionMedicines.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one medicine",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create appointment
      const appointmentData = await fetchApi("/appointments", {
        method: "POST",
        body: JSON.stringify({
          patientId: patientId,
          doctorId: session?.user?.id,
          appointmentDate: new Date(),
          reasonForVisit: "General Checkup",
        }),
      });

      // Create prescription with new appointment ID
      await fetchApi("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointmentData.appointment.id,
          medicines: prescriptionMedicines,
          instructions,
        }),
      });

      toast({
        title: "Success",
        description: "Prescription saved successfully",
      });
      onSubmit(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save prescription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="medicine">Select Medicine</Label>
        <Select onValueChange={handleMedicineChange}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a medicine" />
          </SelectTrigger>
          <SelectContent>
            {medicines.map((med) => (
              <SelectItem key={med.id} value={med.id || ""}>
                {med.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedMedicine && (
        <>
          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={medicationDetails.dosage}
              onChange={(e) =>
                setMedicationDetails((prev) => ({
                  ...prev,
                  dosage: e.target.value,
                }))
              }
              placeholder={`Enter dosage (${selectedMedicine.strength})`}
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              value={medicationDetails.frequency}
              onChange={(e) =>
                setMedicationDetails((prev) => ({
                  ...prev,
                  frequency: e.target.value,
                }))
              }
              placeholder="e.g., Every 8 hours"
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={medicationDetails.duration}
              onChange={(e) =>
                setMedicationDetails((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              placeholder="e.g., 7 days"
            />
          </div>

          <Button onClick={handleAddMedicine} className="w-full">
            Add Medicine
          </Button>
        </>
      )}

      {prescriptionMedicines.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Added Medicines</h3>
          <ul className="space-y-2">
            {prescriptionMedicines.map((med, index) => (
              <li key={index} className="p-2 bg-gray-50 rounded">
                <p>
                  <strong>{med.medicine.name}</strong>
                </p>
                <p>
                  Dosage: {med.dosage}, {med.frequency} for {med.duration}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter general instructions"
        />
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={prescriptionMedicines.length === 0}
        >
          Save Prescription
        </Button>
      </div>
    </div>
  );
}

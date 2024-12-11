/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Patient, AppointmentWithPrescription } from "@/types";
import PrescriptionWritingForm from "@/components/PrescriptionWritingForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function PatientHistoryPage() {
  const params = useParams();
  const { toast } = useToast();
  const [patient, setPatient] = useState<Partial<Patient> | null>(null);
  const [appointments, setAppointments] = useState<
    Partial<AppointmentWithPrescription>[]
  >([]);
  const [isNewVisitDialogOpen, setIsNewVisitDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientResponse = await fetch(`/api/patients/${params.id}`);
        if (!patientResponse.ok) throw new Error("Failed to fetch patient");
        const patientData = await patientResponse.json();
        setPatient(patientData);

        const appointmentsResponse = await fetch(
          `/api/patients/${params.id}/appointments`
        );
        if (!appointmentsResponse.ok)
          throw new Error("Failed to fetch appointments");
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (_) {
        toast({
          title: "Error",
          description: "Failed to load patient data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPatientData();
    }
  }, [params.id, toast]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900">Patient not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-teal-600 text-center">
        Patient History
      </h1>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Patient Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Name:</span>{" "}
              {patient.firstName} {patient.lastName}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Age:</span>{" "}
              {patient.age}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Gender:</span>{" "}
              {patient.gender}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Contact:</span>{" "}
              {patient.contactNumber}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Address:</span>{" "}
              {patient.address}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Allergies:</span>{" "}
              <span className="text-red-600">
                {patient.allergies?.join(", ") || "None"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Add New Prescription Button */}
      <div className="mb-6">
        <Dialog
          open={isNewVisitDialogOpen}
          onOpenChange={setIsNewVisitDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 transition-colors">
              Add New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write New Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionWritingForm
              patientId={params.id as string}
              onSubmit={(success) => {
                if (success) {
                  setIsNewVisitDialogOpen(false);
                  // Refresh appointments list
                  fetch(`/api/patients/${params.id}/appointments`)
                    .then((res) => res.json())
                    .then((data) => setAppointments(data))
                    .catch(() => {
                      toast({
                        title: "Error",
                        description: "Failed to refresh appointments",
                        variant: "destructive",
                      });
                    });
                }
              }}
              onCancel={() => setIsNewVisitDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Visit History Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
          Visit History
        </h2>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="border-l-4 border-teal-500 pl-4"
            >
              <div className="mb-2">
                <span className="text-sm text-gray-500">
                  {formatDate(appointment.appointmentDate?.toString() || "")}
                </span>
                <h3 className="font-medium text-gray-800">
                  {appointment.reasonForVisit}
                </h3>
              </div>

              {appointment.prescription && (
                <div className="bg-gray-50 rounded-md p-4 mt-2">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Instructions:</span>{" "}
                    {appointment.prescription.instructions}
                  </p>
                  <div className="space-y-2">
                    {appointment.prescription.medicines.map(
                      (medicine, index) => (
                        <div
                          key={index}
                          className="pl-4 border-l-2 border-teal-200"
                        >
                          <p className="text-sm">
                            <span className="font-medium">
                              {medicine.medicineDetails.name}
                            </span>{" "}
                            - {medicine.dosage}, {medicine.frequency} for{" "}
                            {medicine.duration}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

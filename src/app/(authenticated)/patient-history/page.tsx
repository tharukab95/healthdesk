/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Patient, AppointmentWithPrescription } from "@/types";
import PrescriptionWritingForm from "@/components/PrescriptionWritingForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function PatientHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<
    AppointmentWithPrescription[]
  >([]);
  const [isNewVisitDialogOpen, setIsNewVisitDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchPatient = async () => {
    try {
      const response = await fetch(`${API_URL}/patients/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch patient");
      const data = await response.json();
      setPatient(data);
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to fetch patient details",
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/appointments/patient/${params.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to fetch appointments",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPatient();
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handlePrescriptionSubmit = async (prescriptionData: any) => {
    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) throw new Error("Failed to create prescription");

      toast({
        title: "Success",
        description: "Prescription created successfully",
      });

      setIsNewVisitDialogOpen(false);
      fetchAppointments(); // Refresh appointments list
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to create prescription",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
              {patient?.firstName} {patient?.lastName}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Age:</span>{" "}
              {patient?.age}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Gender:</span>{" "}
              {patient?.gender}
            </p>
          </div>
          <div>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Contact:</span>{" "}
              {patient?.contactNumber}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Address:</span>{" "}
              {patient?.address}
            </p>
            <p className="mb-2">
              <span className="font-medium text-gray-700">Allergies:</span>{" "}
              <span className="text-red-600">
                {patient?.allergies?.join(", ") || ""}
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
              patientId={patient?.id}
              onSubmit={handlePrescriptionSubmit}
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
                  {formatDate(appointment.appointmentDate || new Date())}
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

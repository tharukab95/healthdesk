"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Patient, Appointment } from "@/types";
import PrescriptionWritingForm from "@/components/PrescriptionWritingForm";

// Mock patient data
const mockPatient: Partial<Patient> = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  age: 35,
  gender: "male",
  contactNumber: "123-456-7890",
  address: "123 Main St, Anytown, USA",
  allergies: ["Penicillin", "Peanuts"],
  medicalHistory: ["1", "2"], // Appointment IDs
};

type AppointmentWithPrescription = Appointment & {
  prescription?: {
    id: string;
    appointmentId: string;
    medicines: {
      medicineId: string;
      medicineName: string;
      dosage: string;
      frequency: string;
      duration: string;
    }[];
    instructions: string;
  };
};

// Mock appointment history with ISO string dates
const mockAppointments: Partial<AppointmentWithPrescription>[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "doc1",
    appointmentDate: new Date("2023-05-15T00:00:00.000Z"),
    reasonForVisit: "Common Cold",
    prescriptionId: "presc1",
    prescription: {
      id: "presc1",
      appointmentId: "1",
      medicines: [
        {
          medicineId: "med1",
          medicineName: "Paracetamol",
          dosage: "500mg",
          frequency: "Every 6 hours",
          duration: "5 days",
        },
        {
          medicineId: "med2",
          medicineName: "Cough Syrup",
          dosage: "10ml",
          frequency: "Every 8 hours",
          duration: "3 days",
        },
      ],
      instructions: "Take with meals",
    },
  },
  {
    id: "2",
    patientId: "1",
    doctorId: "doc1",
    appointmentDate: new Date("2023-03-10T00:00:00.000Z"),
    reasonForVisit: "Sprained Ankle",
    prescriptionId: "presc2",
    prescription: {
      id: "presc2",
      appointmentId: "2",
      medicines: [
        {
          medicineId: "med3",
          medicineName: "Ibuprofen",
          dosage: "400mg",
          frequency: "Every 8 hours",
          duration: "7 days",
        },
      ],
      instructions: "Take with food, apply ice pack",
    },
  },
];

export default function PatientHistoryPage() {
  const [patient] = useState<Partial<Patient>>(mockPatient);
  const [appointments] =
    useState<Partial<AppointmentWithPrescription>[]>(mockAppointments);
  const [isNewVisitDialogOpen, setIsNewVisitDialogOpen] = useState(false);

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
                {patient.allergies?.join(", ") || ""}
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
              patientId={patient.id}
              onSubmit={(prescriptionData) => {
                console.log("New prescription:", prescriptionData);
                setIsNewVisitDialogOpen(false);
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
                              {medicine.medicineName}
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

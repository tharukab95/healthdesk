/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { AppointmentModel, PrescriptionModel, MedicineModel } from "@/models";

export async function GET(
  req: Request,
  { params }: { params: any }
) {
  try {
    await connectDB();
    const appointments = await AppointmentModel.find({
      patientId: params.id,
    })
      .sort({ appointmentDate: -1 })
      .lean();

    // Fetch prescriptions for all appointments
    const appointmentsWithPrescriptions = await Promise.all(
      appointments.map(async (appointment: any) => {
        if (appointment.prescriptionId) {
          const prescription = (await PrescriptionModel.findById(
            appointment.prescriptionId
          ).lean()) as unknown as {
            medicines: any[];
            _id: any;
            appointmentId: any;
            instructions: string;
          };

          if (prescription) {
            // Fetch medicine details for each medicine
            const medicinesWithDetails = await Promise.all(
              prescription.medicines.map(async (medicine: any) => {
                const medicineDetails = (await MedicineModel.findById(
                  medicine.medicineId
                ).lean()) as unknown as {
                  _id: string;
                  name: string;
                  dosageForm: string;
                  strength: string;
                  unitMeasurement: string;
                };

                return {
                  ...medicine,
                  medicineDetails: medicineDetails
                    ? {
                        id: medicineDetails._id.toString(),
                        name: medicineDetails.name,
                        dosageForm: medicineDetails.dosageForm,
                        strength: medicineDetails.strength,
                        unitMeasurement: medicineDetails.unitMeasurement,
                      }
                    : null,
                };
              })
            );

            return {
              id: appointment._id.toString(),
              patientId: appointment.patientId.toString(),
              doctorId: appointment.doctorId.toString(),
              appointmentDate: appointment.appointmentDate,
              reasonForVisit: appointment.reasonForVisit,
              prescription: {
                id: prescription._id.toString(),
                appointmentId: prescription.appointmentId.toString(),
                medicines: medicinesWithDetails,
                instructions: prescription.instructions,
              },
            };
          }
        }

        return {
          id: appointment._id.toString(),
          patientId: appointment.patientId.toString(),
          doctorId: appointment.doctorId.toString(),
          appointmentDate: appointment.appointmentDate,
          reasonForVisit: appointment.reasonForVisit,
        };
      })
    );

    return NextResponse.json(appointmentsWithPrescriptions);
  } catch (_) {
    return NextResponse.json(
      { message: "Error fetching appointments" },
      { status: 500 }
    );
  }
}

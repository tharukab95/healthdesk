import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { PrescriptionModel, AppointmentModel } from "@/models";
import { toClientModel } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Create the prescription
    const prescription = await PrescriptionModel.create({
      appointmentId: body.appointmentId,
      medicines: body.medicines,
      instructions: body.instructions,
    });

    // Update the appointment with the prescription ID
    await AppointmentModel.findByIdAndUpdate(body.appointmentId, {
      prescriptionId: prescription._id,
    });

    const plainPrescription = prescription.toObject();
    const transformedPrescription = toClientModel(plainPrescription);

    return NextResponse.json(
      {
        message: "Prescription created successfully",
        prescription: transformedPrescription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Prescription creation error:", error);
    return NextResponse.json(
      { message: "Error creating prescription" },
      { status: 500 }
    );
  }
}

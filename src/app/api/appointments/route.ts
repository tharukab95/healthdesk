import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { AppointmentModel } from "@/models";
import { toClientModel } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const appointment = await AppointmentModel.create({
      patientId: body.patientId,
      doctorId: body.doctorId,
      appointmentDate: new Date(body.appointmentDate),
      reasonForVisit: body.reasonForVisit,
    });

    const plainAppointment = appointment.toObject();
    const transformedAppointment = toClientModel(plainAppointment);

    return NextResponse.json(
      {
        message: "Appointment created successfully",
        appointment: transformedAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { message: "Error creating appointment" },
      { status: 500 }
    );
  }
}

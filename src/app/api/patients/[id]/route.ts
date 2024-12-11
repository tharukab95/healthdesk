/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PatientModel } from "@/models";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const patient = (await PatientModel.findById(params.id).lean()) as any;

    if (!patient) {
      return NextResponse.json(
        { message: "Patient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: patient._id.toString(),
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNumber: patient.contactNumber,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      allergies: patient.allergies,
      medicalHistory: patient.medicalHistory,
    });
  } catch (_) {
    return NextResponse.json(
      { message: "Error fetching patient" },
      { status: 500 }
    );
  }
}

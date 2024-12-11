import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { PatientModel } from "@/models";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const patient = await PatientModel.create(body);

    return NextResponse.json(
      { message: "Patient registered successfully", patient },
      { status: 201 }
    );
  } catch (error) {
    console.error("Patient registration error:", error);
    return NextResponse.json(
      { message: "Error registering patient" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    let patients;
    if (query) {
      patients = await PatientModel.find({
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { contactNumber: { $regex: query, $options: "i" } },
        ],
      })
        .lean()
        .limit(10);
    } else {
      patients = await PatientModel.find().lean().limit(10);
    }

    // Transform MongoDB documents to match frontend type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedPatients = patients.map((patient: any) => ({
      id: patient._id.toString(),
      firstName: patient.firstName,
      lastName: patient.lastName,
      contactNumber: patient.contactNumber,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      allergies: patient.allergies || [],
      medicalHistory: patient.medicalHistory || [],
    }));

    return NextResponse.json(transformedPatients);
  } catch (error) {
    console.error("Patient fetch error:", error);
    return NextResponse.json(
      { message: "Error fetching patients" },
      { status: 500 }
    );
  }
}

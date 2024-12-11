import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { MedicineModel } from "@/models";
import { toClientModel } from "@/lib/utils";

// GET all medicines
export async function GET() {
  try {
    await connectDB();
    const medicines = await MedicineModel.find().lean().exec();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedMedicines = medicines.map((doc: any) =>
      toClientModel({ ...doc, _id: doc._id.toString() })
    );
    return NextResponse.json(transformedMedicines);
  } catch (error) {
    console.error("Medicine fetch error:", error);
    return NextResponse.json(
      { message: "Error fetching medicines" },
      { status: 500 }
    );
  }
}

// POST new medicine
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Log the received data
    console.log("Received medicine data:", body);

    // Create the medicine document
    const medicine = await MedicineModel.create({
      name: body.name,
      dosageForm: body.dosageForm,
      strength: body.strength,
      unitMeasurement: body.unitMeasurement,
      currentStock: Number(body.currentStock),
      reorderThreshold: Number(body.reorderThreshold),
    });

    // Convert to plain object and transform
    const plainMedicine = medicine.toObject();
    const transformedMedicine = toClientModel(plainMedicine);

    return NextResponse.json(
      {
        message: "Medicine added successfully",
        medicine: transformedMedicine,
      },
      { status: 201 }
    );
  } catch (error) {
    // Detailed error logging
    console.error("Medicine creation error details:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        message: "Error creating medicine",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { MedicineModel } from "@/models";
import { toClientModel } from "@/lib/utils";

// GET single medicine
export async function GET(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await connectDB();
    const medicine = await MedicineModel.findById(params.id).lean();
    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(toClientModel(medicine as any));
  } catch (_) {
    return NextResponse.json(
      { message: "Error fetching medicine" },
      { status: 500 }
    );
  }
}

// PUT update medicine
export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const { id } = params;
    await connectDB();
    const body = await request.json();
    const medicine = await MedicineModel.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true }
    ).lean();

    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(toClientModel(medicine as any));
  } catch (_) {
    return NextResponse.json(
      { message: "Error updating medicine" },
      { status: 500 }
    );
  }
}

// DELETE medicine
export async function DELETE(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const { id } = params;
    await connectDB();
    const medicine = await MedicineModel.findByIdAndDelete(id);

    if (!medicine) {
      return NextResponse.json(
        { message: "Medicine not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Medicine deleted successfully" });
  } catch (_) {
    return NextResponse.json(
      { message: "Error deleting medicine" },
      { status: 500 }
    );
  }
}

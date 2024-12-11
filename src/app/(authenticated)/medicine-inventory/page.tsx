/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { AddMedicineDialog } from "@/components/AddMedicineDialog";
import { MedicineData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { fetchApi } from "@/lib/api-client";

export default function MedicineInventory() {
  const [medicines, setMedicines] = useState<MedicineData[]>([]);
  const { toast } = useToast();

  const fetchMedicines = async () => {
    try {
      const data = await fetchApi('/medicines');
      setMedicines(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch medicines",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchMedicines();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddMedicine = async (medicine: MedicineData) => {
    try {
      const data = await fetchApi('/medicines', {
        method: "POST",
        body: JSON.stringify(medicine),
      });
      setMedicines([...medicines, data.medicine]);

      toast({
        title: "Success",
        description: "Medicine added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medicine",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMedicine = async (id: string) => {
    try {
      await fetchApi(`/medicines/${id}`, {
        method: "DELETE",
      });
      setMedicines(medicines.filter((medicine) => medicine.id !== id));

      toast({
        title: "Success",
        description: "Medicine deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete medicine",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Medicine Inventory</h1>
        <AddMedicineDialog onAddMedicine={handleAddMedicine} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/75">
              <TableHead className="font-medium text-gray-700">Name</TableHead>
              <TableHead className="font-medium text-gray-700">Dosage Form</TableHead>
              <TableHead className="font-medium text-gray-700">Strength</TableHead>
              <TableHead className="font-medium text-gray-700">Unit</TableHead>
              <TableHead className="font-medium text-gray-700">Current Stock</TableHead>
              <TableHead className="font-medium text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map((medicine) => (
              <TableRow key={medicine.id} className="hover:bg-gray-50/50">
                <TableCell className="font-medium">{medicine.name}</TableCell>
                <TableCell>{medicine.dosageForm}</TableCell>
                <TableCell>{medicine.strength}</TableCell>
                <TableCell>{medicine.unitMeasurement}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {medicine.currentStock}
                  {medicine.currentStock <= medicine.reorderThreshold && (
                    <AlertTriangle className="text-amber-500" size={16} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMedicine(medicine.id!)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

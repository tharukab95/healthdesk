// components/AddMedicineDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectInput } from "./SelectInput";
import {
  DOSAGE_FORMS,
  STRENGTHS,
  UNIT_MEASUREMENTS,
} from "@/constants/medicineOptions";
import { MedicineData } from "@/types";

interface AddMedicineDialogProps {
  onAddMedicine: (medicine: MedicineData) => void;
}

export const AddMedicineDialog: React.FC<AddMedicineDialogProps> = ({
  onAddMedicine,
}) => {
  const [newMedicine, setNewMedicine] = useState<MedicineData>({
    name: "",
    dosageForm: "",
    strength: "",
    unitMeasurement: "",
    currentStock: 0,
    reorderThreshold: 0,
  });

  const handleAdd = () => {
    onAddMedicine(newMedicine);
    setNewMedicine({
      name: "",
      dosageForm: "",
      strength: "",
      unitMeasurement: "",
      currentStock: 0,
      reorderThreshold: 0,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-teal-500 hover:bg-teal-600 text-white font-medium">
          + Add New Medicine
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Medicine
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right font-medium">
              Name
            </label>
            <Input
              id="name"
              value={newMedicine.name}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <SelectInput
            label="Dosage Form"
            options={DOSAGE_FORMS}
            value={newMedicine.dosageForm}
            onChange={(value) =>
              setNewMedicine({ ...newMedicine, dosageForm: value })
            }
          />
          <SelectInput
            label="Strength"
            options={STRENGTHS}
            value={newMedicine.strength}
            onChange={(value) =>
              setNewMedicine({ ...newMedicine, strength: value })
            }
          />
          <SelectInput
            label="Unit"
            options={UNIT_MEASUREMENTS}
            value={newMedicine.unitMeasurement}
            onChange={(value) =>
              setNewMedicine({ ...newMedicine, unitMeasurement: value })
            }
          />
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="currentStock" className="text-right font-medium">
              Initial Stock
            </label>
            <Input
              id="currentStock"
              type="number"
              value={newMedicine.currentStock}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  currentStock: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label
              htmlFor="reorderThreshold"
              className="text-right font-medium"
            >
              Reorder Threshold
            </label>
            <Input
              id="reorderThreshold"
              type="number"
              value={newMedicine.reorderThreshold}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  reorderThreshold: parseInt(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" className="text-gray-600">
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            Add Medicine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

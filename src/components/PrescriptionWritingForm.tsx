/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MedicineData, PrescribedMedicineWithDetails } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { fetchApi } from "@/lib/api-client";
import { FrequencyAbbreviation } from "@/constants/prescriptionOptions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

interface PrescriptionWritingFormProps {
  patientId: string;
  onSubmit: (success?: boolean) => void;
  onCancel?: () => void;
}

// Outside component
const debouncedFn = debounce((fn: (query: string) => void, query: string) => {
  if (query.trim()) {
    fn(query);
  }
}, 300);

export default function PrescriptionWritingForm({
  patientId,
  onSubmit,
  onCancel,
}: PrescriptionWritingFormProps) {
  const [searchResults, setSearchResults] = useState<MedicineData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(
    null
  );
  const [prescribedMedicines, setPrescribedMedicines] = useState<
    PrescribedMedicineWithDetails[]
  >([]);
  const [instructions, setInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [medicationDetails, setMedicationDetails] = useState({
    frequency: "",
    duration: "",
  });
  const { data: session } = useSession();

  // Medicine command state
  const [isMedicineCommandOpen, setIsMedicineCommandOpen] = useState(false);
  const [medicineCommandValue, setMedicineCommandValue] = useState("");

  // Frequency command state
  const [isFrequencyCommandOpen, setIsFrequencyCommandOpen] = useState(false);
  const [frequencyCommandValue, setFrequencyCommandValue] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const frequencyInputRef = useRef<HTMLInputElement>(null);
  const durationInputRef = useRef<HTMLInputElement>(null);
  const addMedicineButtonRef = useRef<HTMLButtonElement>(null);

  const frequencies = useMemo(
    () =>
      Object.entries(FrequencyAbbreviation).map(
        ([value, label]: [string, string]) => ({
          value,
          label,
        })
      ),
    []
  );

  const [reasonForVisit, setReasonForVisit] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const searchMedicines = async (searchQuery: string) => {
    try {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      const data = await fetchApi(
        `/medicines/search?query=${encodeURIComponent(searchQuery)}`
      );
      const medicines = Array.isArray(data.medicines) ? data.medicines : [];
      console.log("Setting search results:", medicines); // Debug log
      setSearchResults(medicines);
    } catch (error) {
      console.error("Error searching medicines:", error);
      setSearchResults([]);
      toast({
        title: "Error",
        description: "Failed to search medicines",
        variant: "destructive",
      });
    }
  };

  const debouncedSearch = (query: string) => {
    debouncedFn(searchMedicines, query);
  };

  const handleMedicineChange = (medicineId: string | undefined) => {
    if (!medicineId) return;
    const medicine = searchResults.find((med) => med.id === medicineId);
    setSelectedMedicine(medicine || null);
  };

  const handleAddMedicine = () => {
    if (
      !selectedMedicine ||
      !medicationDetails.frequency ||
      !medicationDetails.duration
    ) {
      toast({
        title: "Error",
        description: "Please fill in all medicine details",
        variant: "destructive",
      });
      return;
    }

    const medicationData: PrescribedMedicineWithDetails = {
      medicineId: selectedMedicine.id!,
      medicine: selectedMedicine,
      ...medicationDetails,
    };
    setPrescribedMedicines((prev) => [...prev, medicationData]);
    setSelectedMedicine(null);
    setMedicationDetails({ frequency: "", duration: "" });
    setSelectedFrequency("");
  };

  const handleSubmit = async () => {
    if (prescribedMedicines.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one medicine",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create appointment with additional fields
      const appointmentData = await fetchApi("/appointments", {
        method: "POST",
        body: JSON.stringify({
          patientId: patientId,
          doctorId: session?.user?.id,
          appointmentDate: new Date(),
          reasonForVisit: reasonForVisit || "General Checkup",
          specialNotes: specialNotes,
        }),
      });

      // Create prescription with new appointment ID
      await fetchApi("/prescriptions", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: appointmentData.appointment.id,
          prescribedMedicines: prescribedMedicines,
          instructions,
        }),
      });

      toast({
        title: "Success",
        description: "Prescription saved successfully",
      });
      onSubmit(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save prescription",
        variant: "destructive",
      });
      onSubmit(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="medicine">Select Medicine</Label>
        <div className="relative">
          <Command
            className="rounded-lg border shadow-md bg-white"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsMedicineCommandOpen(false);
                inputRef.current?.blur();
              }
            }}
          >
            <CommandInput
              ref={inputRef}
              value={medicineCommandValue}
              onValueChange={(value) => {
                setMedicineCommandValue(value);
                if (value.trim()) {
                  debouncedSearch(value);
                } else {
                  setSearchResults([]);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && selectedMedicine) {
                  e.preventDefault();
                  frequencyInputRef.current?.focus();
                }
              }}
              placeholder={
                selectedMedicine
                  ? `${selectedMedicine.name} - ${selectedMedicine.dosageForm} (${selectedMedicine.strength})`
                  : "Search medicine..."
              }
              className="h-9"
              onFocus={() => setIsMedicineCommandOpen(true)}
              onBlur={() => {
                setTimeout(() => setIsMedicineCommandOpen(false), 200);
              }}
            />
            {isMedicineCommandOpen && (
              <CommandList>
                <CommandEmpty>
                  {medicineCommandValue.trim()
                    ? "No medicines found."
                    : "Start typing to search medicines..."}
                </CommandEmpty>
                <CommandGroup>
                  {searchResults.map((med) => (
                    <CommandItem
                      key={med.id}
                      value={`${med.name} - ${med.dosageForm} (${med.strength})`}
                      onSelect={() => {
                        handleMedicineChange(med.id);
                        setMedicineCommandValue("");
                        setSearchResults([]);
                        setTimeout(() => {
                          setIsMedicineCommandOpen(false);
                          frequencyInputRef.current?.focus();
                        }, 0);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedMedicine?.id === med.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {med.name} - {med.dosageForm} ({med.strength})
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
      </div>

      {selectedMedicine && (
        <>
          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <div className="relative">
              <Command
                className="rounded-lg border shadow-md bg-white"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsFrequencyCommandOpen(false);
                    inputRef.current?.blur();
                  }
                }}
              >
                <CommandInput
                  ref={frequencyInputRef}
                  value={frequencyCommandValue}
                  onValueChange={(value) => {
                    setFrequencyCommandValue(value);
                    setIsFrequencyCommandOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && selectedFrequency) {
                      e.preventDefault();
                      durationInputRef.current?.focus();
                    }
                  }}
                  placeholder={
                    selectedFrequency
                      ? frequencies.find((f) => f.value === selectedFrequency)
                          ?.label
                      : "Select frequency..."
                  }
                  className="h-9"
                  onFocus={() => setIsFrequencyCommandOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsFrequencyCommandOpen(false), 200);
                  }}
                />
                {isFrequencyCommandOpen && (
                  <CommandList>
                    <CommandEmpty>No frequency found.</CommandEmpty>
                    <CommandGroup>
                      {frequencies.map((frequency) => (
                        <CommandItem
                          key={frequency.value}
                          value={frequency.value}
                          onSelect={() => {
                            setSelectedFrequency(frequency.value);
                            setFrequencyCommandValue("");
                            setMedicationDetails((prev) => ({
                              ...prev,
                              frequency: frequency.value,
                            }));
                            setTimeout(() => {
                              setIsFrequencyCommandOpen(false);
                              durationInputRef.current?.focus();
                            }, 0);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedFrequency === frequency.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {frequency.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                )}
              </Command>
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration (Days)</Label>
            <Input
              ref={durationInputRef}
              id="duration"
              type="number"
              min="1"
              value={medicationDetails.duration.replace(" days", "")}
              onChange={(e) => {
                const days = e.target.value;
                setMedicationDetails((prev) => ({
                  ...prev,
                  duration: days ? `${days} days` : "",
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && medicationDetails.duration) {
                  e.preventDefault();
                  addMedicineButtonRef.current?.focus();
                }
              }}
              placeholder="e.g., 7"
            />
          </div>

          <Button 
            ref={addMedicineButtonRef}
            onClick={() => {
              handleAddMedicine();
              // After adding medicine, focus back to medicine search
              setTimeout(() => {
                inputRef.current?.focus();
              }, 0);
            }} 
            className="w-full"
          >
            Add Medicine
          </Button>
        </>
      )}

      {prescribedMedicines.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Added Medicines</h3>
          <ul className="space-y-2">
            {prescribedMedicines.map((med, index) => (
              <li key={index} className="p-2 bg-gray-50 rounded">
                <p>
                  <strong>{med.medicine.name}</strong> ({med.medicine.strength})
                </p>
                <p>
                  {med.frequency} for {med.duration}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <Label htmlFor="reasonForVisit">Reason for Visit</Label>
        <Input
          id="reasonForVisit"
          value={reasonForVisit}
          onChange={(e) => setReasonForVisit(e.target.value)}
          placeholder="Enter reason for visit (optional)"
        />
      </div>

      <div>
        <Label htmlFor="specialNotes">Special Notes</Label>
        <Textarea
          id="specialNotes"
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          placeholder="Enter any special notes for this appointment (optional)"
          className="h-20"
        />
      </div>

      <div>
        <Label htmlFor="instructions">Instructions</Label>
        <Textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Enter general instructions"
        />
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={prescribedMedicines.length === 0 || isLoading}
        >
          {isLoading ? "Saving..." : "Save Prescription"}
        </Button>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PatientRegistrationForm from "@/components/PatientRegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Patient } from "@/types";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const data = await fetchApi(`/patients?query=${encodeURIComponent(term)}`);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to search patients: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Updated registration handler
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRegister = async (formData: any) => {
    try {
      const response = await fetchApi('/patients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      
      setIsRegistrationOpen(false);
      // Navigate to patient history page after successful registration
      router.push(`/patient-history/${response.patient._id}`);
      
      toast({
        title: "Success",
        description: "Patient registered successfully",
      });
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to register patient",
        variant: "destructive",
      });
    }
  };

  console.log(searchResults);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-teal-600">
          Patient Search and Registration
        </h1>

        {/* Search Section */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-lg">
              <Input
                type="text"
                placeholder="Search by name or contact number"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((patient) => (
                  <li
                    key={patient.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/patient-history/${patient.id}`)}
                  >
                    <p className="font-semibold text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <div className="mt-1 text-sm text-gray-600 space-y-1">
                      <p>Contact: {patient.contactNumber}</p>
                      <p>
                        Age: {patient.age}, Gender: {patient.gender}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Updated Registration Dialog */}
        <div className="flex justify-center">
          <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white font-medium">
                + Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
              </DialogHeader>
              <PatientRegistrationForm
                onSubmit={handleRegister}
                onCancel={() => setIsRegistrationOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </main>
  );
}

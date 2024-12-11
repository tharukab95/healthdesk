// components/SelectInput.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectInputProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  value,
  onChange,
}) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <label className="text-right font-medium">{label}</label>
    <Select onValueChange={onChange}>
      <SelectTrigger className="col-span-3">
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

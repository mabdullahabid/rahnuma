import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InputFileProps {
  id: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
  required?: boolean;
  className?: string;
}

export function InputFile({
  id,
  label,
  onChange,
  accept,
  multiple = false,
  required = false,
  className = ""
}: InputFileProps) {
  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input 
        id={id} 
        type="file" 
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        required={required}
      />
    </div>
  )
}
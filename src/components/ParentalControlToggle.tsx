import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface ParentalControlToggleProps {
  id: string;
  label: string;
  description?: string;
  isChecked: boolean;
  onToggle: (isChecked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ParentalControlToggle: React.FC<ParentalControlToggleProps> = ({
  id,
  label,
  description,
  isChecked,
  onToggle,
  disabled = false,
  className,
}) => {
  console.log(`Rendering ParentalControlToggle: ${label}, isChecked: ${isChecked}`);

  return (
    <div className={cn("flex items-center justify-between space-x-2 p-4 border rounded-lg bg-white", className)}>
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        {description && (
          <p id={`${id}-description`} className="text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={isChecked}
        onCheckedChange={onToggle}
        disabled={disabled}
        aria-describedby={description ? `${id}-description` : undefined}
        aria-label={label}
      />
    </div>
  );
};

export default ParentalControlToggle;
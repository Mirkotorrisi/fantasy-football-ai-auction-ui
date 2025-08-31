"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roles } from "@/lib/consts";
import { Role } from "@/types/enum";

interface RoleSelectorProps {
  value: Role;
  onValueChange: (value: Role) => void;
  disabled?: boolean;
}

export default function RoleSelector({
  value,
  onValueChange,
  disabled = false,
}: RoleSelectorProps) {
  const selectedRole = roles.find((role) => role.value === value);

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-48">
        <SelectValue>
          {selectedRole && (
            <Badge
              variant="outline"
              className={`${selectedRole.color} border-0`}
            >
              {selectedRole.label}
            </Badge>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            <Badge variant="outline" className={`${role.color} border-0`}>
              {role.label}
            </Badge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

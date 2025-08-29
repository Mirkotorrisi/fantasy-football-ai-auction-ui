"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Role } from "@/types/enum";

interface RoleSelectorProps {
  value: Role;
  onValueChange: (value: Role) => void;
  disabled?: boolean;
}

const roles = [
  {
    value: Role.Goalkeeper,
    label: "Goalkeepers",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: Role.Defender,
    label: "Defenders",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: Role.Midfielder,
    label: "Midfielders",
    color: "bg-green-100 text-green-800",
  },
  {
    value: Role.Forward,
    label: "Forwards",
    color: "bg-red-100 text-red-800",
  },
];

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

import React, { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string; // The formatted display value
  icon: LucideIcon;
  tooltip: React.ReactNode;
  
  // Edit mode props
  isEditable?: boolean;
  type?: "number" | "percent" | "currency";
  rawValue?: number;
  onValueChange?: (val: number) => void;
}

export function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  tooltip,
  isEditable,
  type,
  rawValue,
  onValueChange
}: MetricCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localVal, setLocalVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing && rawValue !== undefined) {
      setLocalVal(type === "percent" ? Math.round(rawValue * 100).toString() : rawValue.toString());
    }
  }, [rawValue, isEditing, type]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const commitChange = () => {
    setIsEditing(false);
    if (!onValueChange) return;
    
    const parsed = parseFloat(localVal);
    if (!isNaN(parsed)) {
      if (type === "percent") {
        onValueChange(parsed / 100);
      } else {
        onValueChange(parsed);
      }
    } else {
      // Revert if invalid
      if (rawValue !== undefined) {
        setLocalVal(type === "percent" ? Math.round(rawValue * 100).toString() : rawValue.toString());
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitChange();
    if (e.key === "Escape") {
      setIsEditing(false);
      if (rawValue !== undefined) {
        setLocalVal(type === "percent" ? Math.round(rawValue * 100).toString() : rawValue.toString());
      }
    }
  };

  return (
    <div 
      className={cn(
        "bg-card/50 backdrop-blur-sm border rounded-xl p-6 text-center space-y-2 group transition-colors",
        isEditable ? "hover:border-brand cursor-pointer shadow-sm hover:shadow-md" : "hover:border-brand/40"
      )}
      onClick={() => isEditable && !isEditing && setIsEditing(true)}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Icon className={cn("size-5", isEditable ? "text-brand" : "text-brand opacity-80")} />
        <InfoTooltip content={tooltip} />
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      
      <div className="flex justify-center h-8 items-center">
        {isEditing ? (
          <div className="flex items-center bg-background border border-brand/50 rounded-md overflow-hidden focus-within:ring-2 ring-brand/20 w-full max-w-[120px]">
            {type === "currency" && <span className="pl-3 text-sm font-bold text-muted-foreground">$</span>}
            <input
              ref={inputRef}
              type="number"
              value={localVal}
              onChange={(e) => setLocalVal(e.target.value)}
              onBlur={commitChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none text-xl font-bold tracking-tight text-center tabular-nums focus:ring-0 px-2 py-1 outline-none min-w-0"
            />
            {type === "percent" && <span className="pr-3 text-sm font-bold text-muted-foreground">%</span>}
          </div>
        ) : (
          <p className={cn(
            "text-2xl font-bold tracking-tight",
            isEditable && "border-b border-dashed border-muted-foreground/30 group-hover:border-brand/50 transition-colors"
          )}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

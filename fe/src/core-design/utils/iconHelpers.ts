import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Check if value is a valid React component (function or ForwardRef object)
const isValidComponent = (value: unknown): value is LucideIcon => {
  if (typeof value === "function") return true;
  // ForwardRef components are objects with a render method
  if (value && typeof value === "object" && "render" in value && typeof (value as { render: unknown }).render === "function") {
    return true;
  }
  return false;
};

export const getLucideIconComponent = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null;

  // Normalize to handle stray quotes/whitespace from persisted data
  const normalized = iconName.trim().replace(/^['"]|['"]$/g, "");
  if (!normalized) return null;

  // Convert kebab-case or other formats to PascalCase
  const pascalName = normalized
    .split(/[^a-zA-Z0-9]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const iconCandidate = (LucideIcons as Record<string, unknown>)[pascalName];
  if (isValidComponent(iconCandidate)) {
    return iconCandidate;
  }

  return null;
};

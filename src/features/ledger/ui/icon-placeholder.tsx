import type { ComponentProps } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IconPlaceholder
 *
 * The efferd blocks ship markup that is icon-library agnostic: every glyph
 * declares its name in four vocabularies (hugeicons, lucide, phosphor,
 * remixicon). This shim resolves the lucide name and renders it, so the block
 * markup stays untouched and the system has exactly one icon dependency.
 */
type IconPlaceholderProps = Omit<ComponentProps<"svg">, "ref"> & {
  lucide?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
  tabler?: string;
};

const iconRegistry = LucideIcons as unknown as Record<
  string,
  React.ComponentType<ComponentProps<"svg">>
>;

export function IconPlaceholder({
  lucide,
  hugeicons: _hugeicons,
  phosphor: _phosphor,
  remixicon: _remixicon,
  tabler: _tabler,
  className,
  ...props
}: IconPlaceholderProps) {
  if (!lucide) return null;

  // "ArrowRightIcon" -> "ArrowRight"
  const name = lucide.replace(/Icon$/, "");
  const Icon = iconRegistry[name];

  if (!Icon) return null;

  return (
    <Icon
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      strokeWidth={1.75}
      {...props}
    />
  );
}

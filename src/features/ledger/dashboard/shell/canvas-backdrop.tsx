import { cn } from "@/lib/utils";
import { ShaderField } from "@/features/ledger/visual/shader-field";

/**
 * The canvas behind everything: the mesh-drift field, one static ambient wash,
 * and the crisp grid. All three are decorative, so the layer is aria-hidden and
 * pointer-events-none, and every child stays inside `overflow-hidden`.
 *
 * `mode="fixed"` keeps the field on screen while the shell scrolls (the
 * dashboard). `mode="page"` pins it to the top of the document so long reading
 * pages never carry text over the brightest part of the field.
 */
export function CanvasBackdrop({
  mode = "fixed",
}: {
  mode?: "fixed" | "page";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none z-0 overflow-hidden bg-background",
        mode === "fixed" ? "fixed inset-0" : "absolute inset-x-0 top-0 h-svh"
      )}
    >
      {/* The living field: one light source in the top-right corner. */}
      <div className="absolute inset-0 opacity-[0.26] [filter:saturate(2.2)] [mask-image:radial-gradient(54%_50%_at_100%_-6%,#000_0%,rgba(0,0,0,0.3)_52%,transparent_92%)] dark:opacity-[0.68] dark:[filter:saturate(1.05)] dark:[mask-image:radial-gradient(62%_58%_at_96%_-6%,#000_0%,rgba(0,0,0,0.5)_44%,transparent_76%)]">
        <ShaderField className="block h-full w-full" />
      </div>

      {/* One static radial wash, top-right. */}
      <div className="ambient-field absolute inset-0" />

      {/* The crisp grid, only where the light is. */}
      <div className="grid-field absolute inset-0 opacity-[0.22]" />

      {/* Wash: the field is light on a wall, never a surface type sits on. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_42%,var(--background)_94%)]" />
    </div>
  );
}

interface StepBadgeProps {
  step: number;
  total: number;
}

export function StepBadge({ step, total }: StepBadgeProps) {
  return (
    <div className="mb-8 flex justify-center">
      <span className="rounded-full bg-emerald-50 px-3 py-1 text-[12px] font-semibold font-display uppercase tracking-[0.08em] text-emerald-500">
        Крок {step} із {total}
      </span>
    </div>
  );
}

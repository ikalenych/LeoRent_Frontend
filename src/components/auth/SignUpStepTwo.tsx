import { Building2, BriefcaseBusiness, Search } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { StepBadge } from "./StepBadge";
import { Button } from "../ui/Button";
import { ErrorAlert } from "../ui/ErrorAlert";
import { RoleCard } from "./RoleCard";
import type { UserRole } from "../../pages/SignUp";

interface SignUpStepTwoProps {
  selectedRole: UserRole;
  error?: string;
  isNextDisabled?: boolean;
  onSelectRole: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SignUpStepTwo({
  selectedRole,
  error,
  isNextDisabled = false,
  onSelectRole,
  onNext,
  onBack,
}: SignUpStepTwoProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <AuthCard className="max-w-4xl px-6 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex justify-center">
          <StepBadge step={2} total={3} />
        </div>

        <h1 className="mb-4 text-center font-display text-[36px] font-bold leading-none text-slate-900 md:text-[48px]">
          Хто ви?
        </h1>

        <p className="mb-10 text-center font-display text-[18px] leading-7 text-slate-500">
          Оберіть роль для налаштування акаунту
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            <RoleCard
              title="Я Власник"
              description="Хочу здавати житло"
              icon={<Building2 size={30} strokeWidth={2} />}
              selected={selectedRole === "owner"}
              onClick={() => onSelectRole("owner")}
            />

            <RoleCard
              title="Я Рієлтор"
              description="Працюю з оголошеннями та клієнтами"
              icon={<BriefcaseBusiness size={30} strokeWidth={2} />}
              selected={selectedRole === "realtor"}
              onClick={() => onSelectRole("realtor")}
            />

            <RoleCard
              title="Я Орендар"
              description="Шукаю житло для оренди"
              icon={<Search size={30} strokeWidth={2} />}
              selected={selectedRole === "tenant"}
              onClick={() => onSelectRole("tenant")}
            />
          </div>

          {error ? <ErrorAlert message={error} className="mb-6" /> : null}

          <div className="mx-auto flex max-w-105 flex-col items-center">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isNextDisabled}
            >
              Продовжити
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 font-display text-[15px] text-slate-400 transition hover:text-slate-600"
            >
              Назад
            </button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}

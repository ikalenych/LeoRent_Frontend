import { Building2, BriefcaseBusiness, Search } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { StepBadge } from "./StepBadge";
import { Button } from "../ui/Button";
import { RoleCard } from "./RoleCard";
import type { UserRole } from "../../pages/SignUp";

interface SignUpStepTwoProps {
  selectedRole: UserRole;
  error?: string;
  onSelectRole: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SignUpStepTwo({
  selectedRole,
  error,
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
              description="Здаю власну квартиру"
              icon={<Building2 size={30} strokeWidth={2} />}
              selected={selectedRole === "owner"}
              onClick={() => onSelectRole("owner")}
            />

            <RoleCard
              title="Я Рієлтор"
              description="Працюю з об'єктами клієнтів"
              icon={<BriefcaseBusiness size={30} strokeWidth={2} />}
              selected={selectedRole === "realtor"}
              onClick={() => onSelectRole("realtor")}
            />

            <RoleCard
              title="Я Орендар"
              description="Шукаю квартиру"
              icon={<Search size={30} strokeWidth={2} />}
              selected={selectedRole === "tenant"}
              onClick={() => onSelectRole("tenant")}
            />
          </div>

          {error ? (
            <p className="mb-6 text-center font-display text-[14px] text-red-500">
              {error}
            </p>
          ) : null}

          <div className="mx-auto flex max-w-105 flex-col items-center">
            <Button type="submit" variant="primary" size="lg" fullWidth>
              Продовжити
            </Button>

            <button
              type="button"
              onClick={onBack}
              className="mt-6 font-display text-[15px] text-slate-400 transition hover:text-slate-600"
            >
              Повернутися на попередній крок
            </button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}

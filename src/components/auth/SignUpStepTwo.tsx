import { useState } from "react";
import { Building2, BriefcaseBusiness, Search } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { StepBadge } from "./StepBadge";
import { Button } from "../ui/Button";
import { RoleCard } from "./RoleCard";

type Role = "owner" | "realtor" | "tenant";

export function SignUpStepTwo() {
  const [selectedRole, setSelectedRole] = useState<Role>("owner");

  return (
    <AuthCard className="max-w-4xl">
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

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          <RoleCard
            title="Я Власник"
            description="Здаю власну квартиру"
            icon={<Building2 size={30} strokeWidth={2} />}
            selected={selectedRole === "owner"}
            onClick={() => setSelectedRole("owner")}
          />

          <RoleCard
            title="Я Рієлтор"
            description="Працюю з об'єктами клієнтів"
            icon={<BriefcaseBusiness size={30} strokeWidth={2} />}
            selected={selectedRole === "realtor"}
            onClick={() => setSelectedRole("realtor")}
          />

          <RoleCard
            title="Я Орендар"
            description="Шукаю квартиру"
            icon={<Search size={30} strokeWidth={2} />}
            selected={selectedRole === "tenant"}
            onClick={() => setSelectedRole("tenant")}
          />
        </div>

        <div className="mx-auto flex max-w-105 flex-col items-center">
          <Button type="button" variant="primary" size="lg" fullWidth>
            Продовжити
          </Button>

          <button
            type="button"
            className="mt-6 font-display text-[15px] text-slate-400 transition hover:text-slate-600"
          >
            Повернутися на попередній крок
          </button>
        </div>
      </div>
    </AuthCard>
  );
}

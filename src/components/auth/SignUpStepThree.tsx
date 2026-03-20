import { useState } from "react";
import { User, UserRound, Phone, ArrowRight } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { StepBadge } from "./StepBadge";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { SecurityBlock } from "./SecurityBlock";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import type { StepThreeErrors } from "../../pages/SignUp";

interface SignUpStepThreeProps {
  values: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  errors: StepThreeErrors;
  onChange: (fields: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function SignUpStepThree({
  values,
  errors,
  onChange,
  onBack,
  onSubmit,
}: SignUpStepThreeProps) {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <>
      <AuthCard className="max-w-xl">
        <StepBadge step={3} total={3} />

        <h1 className="mb-3 font-display text-[26px] font-bold leading-none text-slate-900">
          Завершіть профіль
        </h1>

        <p className="mb-8 font-display text-[16px] leading-7 text-slate-500">
          Заповніть ваші контактні дані для створення профілю
        </p>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Ім'я"
              id="firstName"
              type="text"
              placeholder="Введіть ім’я"
              autoComplete="given-name"
              value={values.firstName}
              error={errors.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              icon={<User size={20} strokeWidth={1.75} />}
            />

            <Input
              label="Прізвище"
              id="lastName"
              type="text"
              placeholder="Введіть прізвище"
              autoComplete="family-name"
              value={values.lastName}
              error={errors.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              icon={<UserRound size={20} strokeWidth={1.75} />}
            />
          </div>

          <Input
            label="Телефон"
            id="phone"
            type="tel"
            placeholder="+380 XX XXX XX XX"
            autoComplete="tel"
            value={values.phone}
            error={errors.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            icon={<Phone size={20} strokeWidth={1.75} />}
          />

          <div className="mb-6">
            <Button type="submit" variant="primary" size="lg" fullWidth>
              <span className="flex w-full items-center justify-center gap-2">
                Завершити реєстрацію
                <ArrowRight size={18} strokeWidth={2} />
              </span>
            </Button>
          </div>
        </form>

        <SecurityBlock onClick={() => setIsPrivacyOpen(true)} />

        <button
          type="button"
          onClick={onBack}
          className="mx-auto mt-6 block font-display text-[15px] text-slate-400 transition hover:text-slate-600"
        >
          Повернутися на попередній крок
        </button>
      </AuthCard>

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </>
  );
}

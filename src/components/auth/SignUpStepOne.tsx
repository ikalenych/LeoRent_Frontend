import { Mail, Lock, ShieldCheck } from "lucide-react";
import { AuthCard } from "./AuthCard";
import { StepBadge } from "./StepBadge";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { ErrorAlert } from "../ui/ErrorAlert";
import type { StepOneErrors } from "../../pages/SignUp";

interface SignUpStepOneProps {
  values: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: StepOneErrors;
  submitError?: string;
  isNextDisabled?: boolean;
  onChange: (fields: {
    email?: string;
    password?: string;
    confirmPassword?: string;
  }) => void;
  onNext: () => void;
}

export function SignUpStepOne({
  values,
  errors,
  submitError,
  isNextDisabled = false,
  onChange,
  onNext,
}: SignUpStepOneProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onNext();
  }

  return (
    <AuthCard className="max-w-md">
      <StepBadge step={1} total={3} />

      <h1 className="mb-3 font-display text-[26px] font-bold leading-none text-slate-900">
        Створити акаунт
      </h1>

      <p className="mb-8 font-display text-[16px] leading-7 text-slate-500">
        Введіть свої дані, щоб розпочати пошук ідеального житла.
      </p>

      <form className="w-full" onSubmit={handleSubmit}>
        {submitError ? (
          <ErrorAlert message={submitError} className="mb-6" />
        ) : null}
        <Input
          label="Електронна пошта"
          id="email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => onChange({ email: e.target.value })}
          icon={<Mail size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Пароль"
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.password}
          error={errors.password}
          maxLength={16}
          showPasswordToggle
          helperText="Мінімум 8 символів"
          onChange={(e) => onChange({ password: e.target.value })}
          icon={<Lock size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Підтвердіть пароль"
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={values.confirmPassword}
          error={errors.confirmPassword}
          maxLength={16}
          showPasswordToggle
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          icon={<ShieldCheck size={20} strokeWidth={1.75} />}
        />

        <div className="mb-8">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isNextDisabled}
          >
            Продовжити
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center font-display text-[15px] text-slate-500">
        Вже маєте акаунт?{" "}
        <a href="/login" className="font-semibold text-emerald-500">
          Увійти
        </a>
      </p>
    </AuthCard>
  );
}

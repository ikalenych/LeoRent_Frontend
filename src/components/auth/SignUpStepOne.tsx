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
  onGoogleSignIn: () => void;
}

export function SignUpStepOne({
  values,
  errors,
  submitError,
  isNextDisabled = false,
  onChange,
  onNext,
  onGoogleSignIn,
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
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onGoogleSignIn}
            className="mt-2"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Увійти через Google
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

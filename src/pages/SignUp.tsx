import { AuthCard } from "../components/auth/AuthCard";
import { StepBadge } from "../components/auth/StepBadge";
import { Mail, Lock, ShieldCheck, LogIn } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function SignUp() {
  return (
    <AuthCard>
      <StepBadge step={1} total={3} />

      <h1 className="mb-3 font-display text-[26px] font-bold leading-none text-slate-900">
        Створити акаунт
      </h1>

      <p className="mb-8 font-display text-[16px] leading-7 text-slate-500">
        Введіть свої дані, щоб розпочати пошук ідеального житла.
      </p>

      <form className="w-full">
        <Input
          label="Електронна пошта"
          id="email"
          name="email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          icon={<Mail size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Пароль"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<Lock size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Підтвердіть пароль"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          icon={<ShieldCheck size={20} strokeWidth={1.75} />}
        />

        <div className="mb-8">
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Зареєструватися
          </Button>
        </div>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-4 font-display text-[14px] text-slate-400">
              або
            </span>
          </div>
        </div>

        <Button type="button" variant="social" size="lg" fullWidth>
          <LogIn size={18} strokeWidth={1.75} />
          Продовжити з Google
        </Button>
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

import { Mail, Lock, LogIn } from "lucide-react";
import { AuthCard } from "../components/auth/AuthCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <AuthCard className="max-w-md">
      <h1 className="mb-7 font-display text-[26px] font-bold leading-none text-slate-900">
        Увійти в акаунт
      </h1>

      <form className="w-full" onSubmit={handleSubmit}>
        <Input
          label="Електронна пошта"
          id="email"
          type="email"
          placeholder="example@gmail.com"
          autoComplete="email"
          icon={<Mail size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Пароль"
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          icon={<Lock size={20} strokeWidth={1.75} />}
        />

        <div className="mb-8">
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Увійти
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
        Не зареєстровані?{" "}
        <a href="/signup" className="font-semibold text-emerald-500">
          Зареєструватись
        </a>
      </p>
    </AuthCard>
  );
}

import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { AuthCard } from "../components/auth/AuthCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface LoginErrors {
  email?: string;
  password?: string;
}

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateFormData(fields: Partial<typeof formData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  function validateForm() {
    const nextErrors: LoginErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Введіть електронну пошту";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Некоректний формат електронної пошти";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Введіть пароль";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.detail)
              ? data.detail.map((item: { msg?: string }) => item.msg).join(", ")
              : data?.message || "Не вдалося увійти в акаунт";

        throw new Error(message);
      }

      console.log("Login success:", data);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Сталася помилка при вході",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          value={formData.email}
          error={errors.email}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            setErrors((prev) => ({ ...prev, email: undefined }));
            setSubmitError("");
          }}
          icon={<Mail size={20} strokeWidth={1.75} />}
        />

        <Input
          label="Пароль"
          id="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={formData.password}
          error={errors.password}
          onChange={(e) => {
            updateFormData({ password: e.target.value });
            setErrors((prev) => ({ ...prev, password: undefined }));
            setSubmitError("");
          }}
          icon={<Lock size={20} strokeWidth={1.75} />}
        />

        {submitError ? (
          <p className="mb-4 text-sm text-red-500">{submitError}</p>
        ) : null}

        <div className="mb-8">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? "Вхід..." : "Увійти"}
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

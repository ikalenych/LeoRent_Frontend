import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AuthCard } from "../components/auth/AuthCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/firebase";
import { firebaseSignupRequest } from "../lib/auth-api";

interface LoginErrors {
  email?: string;
  password?: string;
}

type EmailValidationResult =
  | { isValid: true; value: string }
  | { isValid: false; error: string };

function getFirebaseErrorMessage(error: any): string {
  const errorCode = error?.code || "";
  const errorMessage = error?.message || "";

  const errorMap: Record<string, string> = {
    "auth/popup-closed-by-user": "",
    "auth/user-not-found":
      "Користувач з такою поштою не знайдений. Будь ласка, зареєструйтесь.",
    "auth/wrong-password": "Невірний пароль. Спробуйте ще раз.",
    "auth/invalid-email": "Некоректна електронна пошта.",
    "auth/user-disabled": "Цей акаунт деактивовано.",
    "auth/too-many-requests": "Забагато невдалих спроб. Спробуйте пізніше.",
    "auth/invalid-credential": "Невірна пошта або пароль.",
    "auth/network-request-failed":
      "Проблема з мережею. Перевірте інтернет-з’єднання.",
  };

  return errorMap[errorCode] || errorMessage || "Сталася помилка при вході";
}

function validateEmailValue(email: string): EmailValidationResult {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { isValid: false, error: "Введіть електронну пошту" };
  }

  if (cleanEmail.length > 254) {
    return { isValid: false, error: "Електронна пошта занадто довга" };
  }

  const forbiddenChars = /['";\\<>`]/;
  if (forbiddenChars.test(cleanEmail)) {
    return {
      isValid: false,
      error: "Електронна пошта містить заборонені символи",
    };
  }

  if (cleanEmail.includes("..")) {
    return {
      isValid: false,
      error: "Некоректний формат електронної пошти",
    };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(cleanEmail)) {
    return {
      isValid: false,
      error: "Некоректний формат електронної пошти",
    };
  }

  return { isValid: true, value: cleanEmail };
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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

    const emailValidation = validateEmailValue(formData.email);

    if (!emailValidation.isValid) {
      nextErrors.email = emailValidation.error;
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Введіть пароль";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    const emailValidation = validateEmailValue(formData.email);
    if (!emailValidation.isValid) return;

    setIsSubmitting(true);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        emailValidation.value,
        formData.password,
      );

      const idToken = await credential.user.getIdToken();
      const data = await firebaseSignupRequest(idToken);

      login(data, idToken);
      navigate("/");
    } catch (error: any) {
      setSubmitError(getFirebaseErrorMessage(error));
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
          id="email"
          label="Електронна пошта"
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
          id="password"
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={formData.password}
          error={errors.password}
          showPasswordToggle
          onChange={(e) => {
            updateFormData({ password: e.target.value });
            setErrors((prev) => ({ ...prev, password: undefined }));
            setSubmitError("");
          }}
          icon={<Lock size={20} strokeWidth={1.75} />}
        />

        {submitError ? (
          <ErrorAlert message={submitError} className="mb-4" />
        ) : null}

        <div className="mb-8">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Вхід..." : "Увійти"}
          </Button>
        </div>
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

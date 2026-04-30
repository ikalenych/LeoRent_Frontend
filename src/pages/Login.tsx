import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

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

  const map: Record<string, string> = {
    "auth/popup-closed-by-user": "",
    "auth/user-not-found": "Користувача з такою поштою не існує",
    "auth/wrong-password": "Невірний пароль",
    "auth/invalid-email": "Некоректна пошта",
    "auth/too-many-requests": "Забагато спроб",
    "auth/network-request-failed": "Проблема з мережею",
    "auth/invalid-credential": "Невірна пошта або пароль",
  };

  return map[errorCode] ?? error?.message ?? "Помилка входу";
}

function validateEmailValue(email: string): EmailValidationResult {
  const clean = email.trim().toLowerCase();

  if (!clean) {
    return { isValid: false, error: "Введіть електронну пошту" };
  }

  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regex.test(clean)) {
    return { isValid: false, error: "Некоректний формат електронної пошти" };
  }

  return { isValid: true, value: clean };
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
    setFormData((p) => ({ ...p, ...fields }));
  }

  function validateForm() {
    const e: LoginErrors = {};

    const email = validateEmailValue(formData.email);

    if (!email.isValid) e.email = email.error;
    if (!formData.password.trim()) e.password = "Введіть пароль";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ================= GOOGLE LOGIN =================
  async function handleGoogleLogin() {
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const googleUser = result.user;
      const idToken = await googleUser.getIdToken();

      try {
        const data = await firebaseSignupRequest(idToken);
        login(data, idToken);
        navigate("/");
      } catch (err: any) {
        const status = err?.response?.status || err?.status;

        if (status === 404 || err?.code === "USER_NOT_FOUND") {
          setSubmitError("Такого акаунту не існує");
          return;
        }

        throw err;
      }
    } catch (err: any) {
      console.log("STATUS:", err?.response?.status, err?.status);
      console.log("CODE:", err?.code);
      console.log("FULL ERROR:", err);

      const status = err?.response?.status || err?.status;
      if (status === 404 || status === 401 || err?.code === "USER_NOT_FOUND") {
        setSubmitError("Такого акаунту не існує");
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // ================= EMAIL LOGIN =================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const idToken = await cred.user.getIdToken();
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
          icon={<Mail size={20} strokeWidth={1.75} />}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            setErrors((p) => ({ ...p, email: undefined }));
          }}
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
          icon={<Lock size={20} strokeWidth={1.75} />}
          onChange={(e) => {
            updateFormData({ password: e.target.value });
            setErrors((p) => ({ ...p, password: undefined }));
          }}
        />

        {submitError && <ErrorAlert message={submitError} className="mb-4" />}

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

          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            className="mt-2 flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
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
        Не зареєстровані?{" "}
        <a href="/signup" className="font-semibold text-emerald-500">
          Зареєструватись
        </a>
      </p>
    </AuthCard>
  );
}

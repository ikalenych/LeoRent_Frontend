import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { SignUpStepOne } from "../components/auth/SignUpStepOne";
import { SignUpStepTwo } from "../components/auth/SignUpStepTwo";
import { SignUpStepThree } from "../components/auth/SignUpStepThree";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../lib/firebase";
import { firebaseAuthRequest } from "../lib/auth-api";
import { mapApiErrorToUaMessage } from "../lib/error-messages";

export type UserRole = "owner" | "realtor" | "tenant" | "";

export interface SignUpFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface StepOneErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface StepThreeErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

type EmailValidationResult =
  | { isValid: true; value: string }
  | { isValid: false; error: string };

const API_URL = "https://leorent-backend.onrender.com";
const SIGN_UP_STORAGE_KEY = "leorent-signup";

const initialFormData: SignUpFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  firstName: "",
  lastName: "",
  phone: "",
};

type PersistedSignUpState = {
  currentStep: 1 | 2 | 3;
  formData: {
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone: string;
  };
};

function getInitialPersistedState() {
  const fallback = {
    currentStep: 1 as 1 | 2 | 3,
    formData: initialFormData,
  };

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");

    if (emailFromUrl) {
      return {
        currentStep: 1 as 1 | 2 | 3,
        formData: {
          ...initialFormData,
          email: emailFromUrl,
        },
      };
    }
  }

  try {
    const savedState = localStorage.getItem(SIGN_UP_STORAGE_KEY);
    if (!savedState) return fallback;

    const parsedState: PersistedSignUpState = JSON.parse(savedState);

    return {
      currentStep:
        parsedState.currentStep > 1
          ? (1 as 1 | 2 | 3)
          : parsedState.currentStep,
      formData: {
        ...initialFormData,
        email: parsedState.formData.email ?? "",
        role: parsedState.formData.role ?? "",
        firstName: parsedState.formData.firstName ?? "",
        lastName: parsedState.formData.lastName ?? "",
        phone: parsedState.formData.phone ?? "",
      },
    };
  } catch {
    return fallback;
  }
}

function normalizeUsername(firstName: string, lastName: string) {
  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();

  if (!fullName) return null;
  if (/\d/.test(fullName)) return null;

  return fullName
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function mapRoleToApiUserType(role: UserRole): "AGENT" | "OWNER" | "DEFAULT" {
  switch (role) {
    case "owner":
      return "OWNER";
    case "realtor":
      return "AGENT";
    case "tenant":
      return "DEFAULT";
    default:
      return "DEFAULT";
  }
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

async function signupRequest(payload: {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  password: string;
  user_type: "AGENT" | "OWNER" | "DEFAULT";
}) {
  const response = await fetch(`${API_URL}/users/signup/v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      mapApiErrorToUaMessage(
        response.status,
        data,
        "Не вдалося створити акаунт",
      ),
    );
  }

  return data;
}

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [persistedState] = useState(() => getInitialPersistedState());

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(
    persistedState.currentStep,
  );
  const [formData, setFormData] = useState<SignUpFormData>(
    persistedState.formData,
  );

  const [stepOneErrors, setStepOneErrors] = useState<StepOneErrors>({});
  const [stepThreeErrors, setStepThreeErrors] = useState<StepThreeErrors>({});
  const [stepTwoError, setStepTwoError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    const persistedData: PersistedSignUpState = {
      currentStep,
      formData: {
        email: formData.email,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      },
    };

    localStorage.setItem(SIGN_UP_STORAGE_KEY, JSON.stringify(persistedData));
  }, [
    currentStep,
    formData.email,
    formData.role,
    formData.firstName,
    formData.lastName,
    formData.phone,
  ]);

  function updateFormData(fields: Partial<SignUpFormData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  function nextStep() {
    setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  }

  function previousStep() {
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  }

  function validateStepOne() {
    const errors: StepOneErrors = {};
    const emailValidation = validateEmailValue(formData.email);

    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
    }

    if (!formData.password.trim()) {
      errors.password = "Введіть пароль";
    } else if (formData.password.trim().length < 8) {
      errors.password = "Пароль має містити щонайменше 8 символів";
    } else if (formData.password.trim().length > 64) {
      errors.password = "Пароль має містити не більше 64 символів";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Підтвердіть пароль";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Паролі не співпадають";
    }

    setStepOneErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateStepTwo() {
    if (!formData.role) {
      setStepTwoError("Оберіть роль");
      return false;
    }

    setStepTwoError("");
    return true;
  }

  function validateStepThree() {
    const errors: StepThreeErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "Введіть ім'я";
    } else if (/\d/.test(formData.firstName)) {
      errors.firstName = "Ім'я не повинно містити цифри";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Введіть прізвище";
    } else if (/\d/.test(formData.lastName)) {
      errors.lastName = "Прізвище не повинно містити цифри";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Введіть телефон";
    } else if (!/^\+380\d{9}$/.test(formData.phone.trim())) {
      errors.phone = "Введіть телефон у форматі +380XXXXXXXXX";
    }

    setStepThreeErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleStepOneGoogle() {
    setSubmitError("");
    setIsGoogleLoading(true);

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = credential.user;
      const providerCredential =
        GoogleAuthProvider.credentialFromResult(credential);

      const idToken =
        providerCredential?.idToken || (await firebaseUser.getIdToken());

      localStorage.setItem("token", idToken);

      updateFormData({
        email: firebaseUser.email || "",
        password: "google-auth",
        confirmPassword: "google-auth",
        firstName: firebaseUser.displayName?.split(" ")[0] || "",
        lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
      });

      nextStep();
    } catch (error: any) {
      if (
        error?.code === "auth/popup-closed-by-user" ||
        error?.message?.includes("popup-closed-by-user")
      ) {
        setSubmitError("");
      } else {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Сталася помилка при вході через Google",
        );
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }

  function handleStepOneSubmit() {
    setSubmitError("");
    if (!validateStepOne()) return;
    nextStep();
  }

  function handleStepTwoSubmit() {
    if (!validateStepTwo()) return;
    nextStep();
  }

  async function handleFinalSubmit() {
    setSubmitError("");

    if (!validateStepThree()) return;

    const normalizedUsername = normalizeUsername(
      formData.firstName,
      formData.lastName,
    );

    if (!normalizedUsername) {
      setStepThreeErrors((prev) => ({
        ...prev,
        firstName: prev.firstName || "Ім'я не повинно містити цифри",
        lastName: prev.lastName || "Прізвище не повинно містити цифри",
      }));
      return;
    }

    const emailValidation = validateEmailValue(formData.email);

    if (!emailValidation.isValid) {
      setStepOneErrors((prev) => ({
        ...prev,
        email: emailValidation.error,
      }));
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      let idToken = localStorage.getItem("token");

      if (!idToken || formData.password !== "google-auth") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          emailValidation.value,
          formData.password,
        );

        await updateProfile(credential.user, {
          displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        });

        idToken = await credential.user.getIdToken();
      }

      const data = await firebaseAuthRequest({
        id_token: idToken,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        user_type: mapRoleToApiUserType(formData.role),
      });

      login(data, idToken);
      localStorage.removeItem(SIGN_UP_STORAGE_KEY);
      navigate("/");
    } catch (error: any) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Сталася помилка при реєстрації",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (currentStep === 1) {
    return (
      <SignUpStepOne
        values={{
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }}
        errors={stepOneErrors}
        submitError={submitError}
        isNextDisabled={
          !formData.email.trim() ||
          !formData.password.trim() ||
          !formData.confirmPassword.trim()
        }
        isGoogleLoading={isGoogleLoading}
        onChange={(fields) => {
          updateFormData(fields);
          setStepOneErrors((prev) => ({
            ...prev,
            ...Object.keys(fields).reduce(
              (acc, key) => ({ ...acc, [key]: undefined }),
              {},
            ),
          }));
          setSubmitError("");
        }}
        onNext={handleStepOneSubmit}
        onGoogleClick={handleStepOneGoogle}
      />
    );
  }

  if (currentStep === 2) {
    return (
      <SignUpStepTwo
        selectedRole={formData.role}
        error={stepTwoError}
        isNextDisabled={!formData.role}
        onSelectRole={(role) => {
          updateFormData({ role });
          setStepTwoError("");
        }}
        onBack={previousStep}
        onNext={handleStepTwoSubmit}
      />
    );
  }

  return (
    <SignUpStepThree
      values={{
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      }}
      errors={stepThreeErrors}
      submitError={submitError}
      isSubmitting={isSubmitting}
      onChange={(fields) => {
        updateFormData(fields);
        setStepThreeErrors((prev) => ({
          ...prev,
          ...Object.keys(fields).reduce(
            (acc, key) => ({ ...acc, [key]: undefined }),
            {},
          ),
        }));
        setSubmitError("");
      }}
      onBack={previousStep}
      onSubmit={handleFinalSubmit}
    />
  );
}

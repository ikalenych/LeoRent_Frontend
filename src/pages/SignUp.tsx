import { useEffect, useState } from "react";
import { SignUpStepOne } from "../components/auth/SignUpStepOne";
import { SignUpStepTwo } from "../components/auth/SignUpStepTwo";
import { SignUpStepThree } from "../components/auth/SignUpStepThree";

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

  try {
    const savedState = localStorage.getItem(SIGN_UP_STORAGE_KEY);

    if (!savedState) return fallback;

    const parsedState: PersistedSignUpState = JSON.parse(savedState);

    const restoredFormData: SignUpFormData = {
      ...initialFormData,
      email: parsedState.formData.email ?? "",
      role: parsedState.formData.role ?? "",
      firstName: parsedState.formData.firstName ?? "",
      lastName: parsedState.formData.lastName ?? "",
      phone: parsedState.formData.phone ?? "",
      password: "",
      confirmPassword: "",
    };

    const restoredStep =
      parsedState.currentStep > 1 ? 1 : parsedState.currentStep;

    return {
      currentStep: restoredStep,
      formData: restoredFormData,
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

function mapUserType(role: UserRole): "agent" | "owner" | "default" {
  switch (role) {
    case "realtor":
      return "agent";
    case "owner":
      return "owner";
    case "tenant":
      return "default";
    default:
      return "default";
  }
}

export default function SignUp() {
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

  useEffect(() => {
    return () => {
      localStorage.removeItem(SIGN_UP_STORAGE_KEY);
    };
  }, []);

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

    if (!formData.email.trim()) {
      errors.email = "Введіть електронну пошту";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Некоректний формат електронної пошти";
    }

    if (!formData.password.trim()) {
      errors.password = "Введіть пароль";
    } else if (formData.password.trim().length < 8) {
      errors.password = "Пароль має містити щонайменше 8 символів";
    } else if (formData.password.trim().length > 16) {
      errors.password = "Пароль має містити не більше 16 символів";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Підтвердіть пароль";
    }

    if (
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.password !== formData.confirmPassword
    ) {
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
    }

    setStepThreeErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleStepOneSubmit() {
    if (!validateStepOne()) return;
    nextStep();
  }

  function handleStepTwoSubmit() {
    if (!validateStepTwo()) return;
    nextStep();
  }

  async function handleFinalSubmit() {
    if (!validateStepThree()) return;

    const normalizedUsername = normalizeUsername(
      formData.firstName,
      formData.lastName,
    );

    if (!normalizedUsername) {
      setStepThreeErrors((prev) => ({
        ...prev,
        firstName: prev.firstName || "Ім'я та прізвище мають бути без цифр",
        lastName: prev.lastName || "Ім'я та прізвище мають бути без цифр",
      }));
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/users/signup/v1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          username: normalizedUsername,
          phone: formData.phone.trim(),
          password: formData.password,
          user_type: mapUserType(formData.role),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.detail)
              ? data.detail.map((item: { msg?: string }) => item.msg).join(", ")
              : data?.message || "Не вдалося створити акаунт";

        throw new Error(message);
      }

      localStorage.removeItem(SIGN_UP_STORAGE_KEY);

      console.log("Registration completed:", data);
    } catch (error) {
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
        isNextDisabled={
          !formData.email.trim() ||
          !formData.password.trim() ||
          !formData.confirmPassword.trim()
        }
        onChange={(fields) => {
          updateFormData(fields);
          setStepOneErrors((prev) => ({
            ...prev,
            ...Object.keys(fields).reduce(
              (acc, key) => ({ ...acc, [key]: undefined }),
              {},
            ),
          }));
        }}
        onNext={handleStepOneSubmit}
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

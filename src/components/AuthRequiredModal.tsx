import { useNavigate } from "react-router-dom";
import { useLiked } from "../context/LikedContext";

export default function AuthRequiredModal() {
  const { isAuthModalOpen, closeAuthModal } = useLiked();
  const navigate = useNavigate();

  if (!isAuthModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={closeAuthModal}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-3 text-xl font-semibold text-text-title">
          Тільки для зареєстрованих користувачів!
        </h2>

        <p className="mb-6 text-text-description">
          Увійдіть або зареєструйтесь, щоб мати можливість користуватись цим.
        </p>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            onClick={closeAuthModal}
            className="rounded-xl bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
          >
            Закрити
          </button>

          <button
            onClick={() => {
              closeAuthModal();
              navigate("/login");
            }}
            className="rounded-xl bg-primary px-4 py-2 text-white transition hover:opacity-90"
          >
            Увійти
          </button>

          <button
            onClick={() => {
              closeAuthModal();
              navigate("/signup");
            }}
            className="rounded-xl border border-primary px-4 py-2 text-primary transition hover:bg-primary/5"
          >
            Зареєструватись
          </button>
        </div>
      </div>
    </div>
  );
}

import { Seo } from "../components/seo/Seo";

const SITE_URL = import.meta.env.VITE_SITE_URL || "http://localhost:5173";
const MONO_DONATE_URL = "https://send.monobank.ua/jar/DV2HR3crd";

const team = [
  {
    name: "Іван",
    role: "Fullstack & UI",
    description:
      "Відповідає за розробку інтерфейсу та клієнтської логіки застосунку. Працює над структурою сторінок, взаємодією компонентів і загальним UX.",
  },
  {
    name: "Назар",
    role: "Backend",
    description:
      "Допомагав з бекенд-частиною, API та базовою логікою застосунку",
  },
  {
    name: "Данило",
    role: "Database & Backend",
    description:
      "Відповідає за серверну логіку, працює з базою даних, фільтрами пошуку та тим, щоб оголошення знаходились швидко і коректно.",
  },
  {
    name: "Богдан",
    role: "Frontend & Support",
    description:
      "Працює з інтерфейсом, тестуванням та підтримкою користувачів, щоб LeoRent був максимально зручним і корисним для всіх.",
  },
];

export default function AboutUs() {
  return (
    <>
      <Seo
        title="Про нас | LeoRent"
        description="Дізнайтесь більше про команду LeoRent — сервісу для пошуку оренди квартир у Львові. Хто ми, над чим працюємо і як можна підтримати розвиток застосунку."
        canonical={`${SITE_URL}/about-us`}
      />

      <main className="min-h-screen bg-page pt-6 pb-16">
        <section className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-600 px-4 py-1.5 text-sm font-medium">
              Про команду LeoRent
            </span>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-text-title leading-tight">
              Ми створюємо простіший спосіб знайти житло у Львові
            </h1>

            <p className="mt-5 text-base md:text-lg text-text-description leading-8">
              LeoRent - це невеликий студентський проєкт, який ми розвиваємо з
              ідеєю зробити пошук оренди житла у Львові зручнішим, зрозумілішим
              і сучаснішим. Ми хочемо, щоб люди могли швидко знайти потрібне
              житло без зайвого шуму, плутанини та застарілих інтерфейсів.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {team.map((member) => (
              <article
                key={member.name}
                className="rounded-3xl border border-black/5 bg-white shadow-sm p-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  {member.name[0]}
                </div>

                <h2 className="mt-5 text-xl font-semibold text-text-title">
                  {member.name}
                </h2>

                <p className="mt-1 text-sm font-medium text-emerald-600">
                  {member.role}
                </p>

                <p className="mt-4 text-sm leading-7 text-text-description">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-black/5 bg-white shadow-sm p-7">
              <h2 className="text-2xl font-bold text-text-title">
                Чому ми робимо LeoRent
              </h2>

              <p className="mt-4 text-text-description leading-8">
                Ми самі не раз стикались із незручним пошуком житла: хаотичні
                оголошення, слабкі фільтри, багато зайвого шуму і мало реально
                корисної інформації. Тому ми вирішили зробити сервіс, який буде
                простішим, чистішим і зручнішим для людей, що шукають квартиру у
                Львові.
              </p>

              <p className="mt-4 text-text-description leading-8">
                LeoRent для нас - це не просто навчальний або pet-проєкт, а
                спроба створити корисний локальний продукт, який реально
                розв’язує проблему.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-500/15 bg-emerald-500/[0.06] shadow-sm p-7">
              <h2 className="text-2xl font-bold text-text-title">
                Підтримати проєкт
              </h2>

              <p className="mt-4 text-text-description leading-8">
                Якщо вам подобається LeoRent і ви хочете підтримати розвиток
                застосунку, можете задонатити нам на розвиток, інфраструктуру та
                подальше покращення функціоналу.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-6 sm:items-center">
                <div className="shrink-0 rounded-2xl bg-white border border-black/5 p-3 shadow-sm mx-auto sm:mx-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                      MONO_DONATE_URL,
                    )}`}
                    alt="QR код для донату"
                    className="w-36 h-36 object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1">
                  <a
                    href={MONO_DONATE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-5 py-3 transition-colors"
                  >
                    Підтримати через Monobank
                  </a>

                  <p className="mt-4 text-sm text-text-description leading-7">
                    Відскануйте QR-код або скористайтеся посиланням Monobank,
                    щоб підтримати розвиток LeoRent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

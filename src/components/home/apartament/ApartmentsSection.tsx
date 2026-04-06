import { Link } from "react-router-dom";
import ApartmentCard from "../../ApartmentCard";
import { MOCK_APARTMENTS } from "../../../constants/mockApartments";

export function ApartmentsSection() {
  const latest = [...MOCK_APARTMENTS].slice(-4);

  return (
    <section className="bg-page py-10 px-6">
      <div className="px-10 sm:px-6 lg:px-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-text-title font-display font-semibold text-2xl">
              Нові пропозиції
            </h2>
            <p className="text-text-description text-sm mt-1">
              Найкращі квартири, що з'явилися сьогодні
            </p>
          </div>
          <Link
            to="/listings"
            className="text-primary hover:text-primary-hover text-sm font-medium transition-colors sm:self-start"
          >
            Всі оголошення →
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 lg:gap-6">
          {latest.map((apt) => (
            <ApartmentCard key={apt.id} {...apt} />
          ))}
        </div>
      </div>
    </section>
  );
}

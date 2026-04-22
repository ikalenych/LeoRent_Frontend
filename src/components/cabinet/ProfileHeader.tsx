import { CheckCircle2 } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  roleLabel: string;
  avatarUrl?: string;
}

export default function ProfileHeader({
  fullName,
  email,
  roleLabel,
  avatarUrl,
}: ProfileHeaderProps) {
  return (
    <section className="rounded-[28px] bg-white px-6 py-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-8 md:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <img
              src={avatarUrl || "/placeholder-avatar.jpg"}
              alt={fullName}
              className="h-24 w-24 rounded-full object-cover shadow-md sm:h-28 sm:w-28"
            />
            <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-primary text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold leading-none text-slate-900 sm:text-[34px]">
                {fullName}
              </h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#DDF9EE] px-3 py-1 text-sm font-medium text-[#169B62]">
                <CheckCircle2 className="h-4 w-4" />
                {roleLabel}
              </span>
            </div>

            <p className="mt-3 text-[18px] text-slate-500">{email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

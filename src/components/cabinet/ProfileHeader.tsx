import { UserAvatar } from "../ui/UserAvatar";

type UserRole = "Tenant" | "Owner" | "Rieltor";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  role: UserRole;
  roleLabel: string;
}

function getRoleBadgeClasses(role: UserRole) {
  switch (role) {
    case "Owner":
      return "bg-primary text-white";
    case "Rieltor":
      return "bg-realtor text-white";
    default:
      return "bg-[#7a00db] text-white";
  }
}

export default function ProfileHeader({
  fullName,
  email,
  role,
  roleLabel,
}: ProfileHeaderProps) {
  return (
    <section className="rounded-[28px] bg-white px-6 py-7 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-8 md:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <UserAvatar
              username={fullName}
              size="lg"
              className="h-24! w-24! text-3xl! sm:h-28! sm:w-28! sm:text-4xl!"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold leading-none text-slate-900 sm:text-[34px]">
                {fullName}
              </h1>

              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getRoleBadgeClasses(role)}`}>
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

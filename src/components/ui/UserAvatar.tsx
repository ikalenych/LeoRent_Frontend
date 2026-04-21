interface Props {
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-xl",
};

const colors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-teal-500",
  "bg-amber-500",
];

function colorFromName(name: string) {
  return colors[name.charCodeAt(0) % colors.length];
}

export function UserAvatar({ username, size = "md", className = "" }: Props) {
  const letter = username?.charAt(0)?.toUpperCase() ?? "?";
  return (
    <div
      className={`${sizes[size]} ${colorFromName(username)} ${className}
        rounded-full flex items-center justify-center
        text-white font-semibold select-none shrink-0`}
      title={username}
    >
      {letter}
    </div>
  );
}

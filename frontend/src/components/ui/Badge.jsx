const variants = {
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/10",
  danger: "bg-red-50 text-red-700 border-red-200 ring-red-600/10",
  warning: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/10",
  info: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-600/10",
  default: "bg-gray-50 text-gray-700 border-gray-200 ring-gray-600/10",
  purple: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-600/10",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/10",
};

const dots = {
  success: "bg-emerald-500",
  danger: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  default: "bg-gray-500",
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
};

export default function Badge({
  children,
  variant = "default",
  dot = false,
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ring-1 ${variants[variant] || variants.default} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dots[variant] || dots.default}`}
        />
      )}
      {children}
    </span>
  );
}

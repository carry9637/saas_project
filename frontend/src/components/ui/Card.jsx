export default function Card({
  children,
  className = "",
  hover = false,
  ...props
}) {
  return (
    <div
      className={`rounded-xl bg-white border border-gray-100 shadow-sm ${
        hover
          ? "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-50 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

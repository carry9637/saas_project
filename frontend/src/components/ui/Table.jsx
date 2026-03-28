export default function Table({ headers, children, className = "" }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {headers.map((h, i) => (
              <th
                key={i}
                className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                  typeof h === "object"
                    ? h.className || "text-left"
                    : "text-left"
                }`}
              >
                {typeof h === "object" ? h.label : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, index = 0, onClick }) {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-150 hover:bg-indigo-50/40 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return <td className={`px-6 py-4 ${className}`}>{children}</td>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-gray-700 mb-1"
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: "0.85rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

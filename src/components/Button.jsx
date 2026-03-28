export default function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`
        w-full md:w-auto
        px-4 py-2
        text-sm md:text-base
        rounded-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
export const CornerFiligree = (): React.JSX.Element => (
  <>
    {[
      "top-2 left-2",
      "top-2 right-2 rotate-90",
      "bottom-2 left-2 -rotate-90",
      "bottom-2 right-2 rotate-180"
    ].map((pos) => (
      <svg key={pos} className={`absolute ${pos} h-6 w-6 text-primary`} viewBox="0 0 24 24" fill="none">
        <path
          d="M2 2 L10 2 M2 2 L2 10 M2 2 C6 4 8 6 10 10"
          stroke="currentColor"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
        <circle cx="2" cy="2" r="0.9" fill="currentColor" />
      </svg>
    ))}
  </>
);

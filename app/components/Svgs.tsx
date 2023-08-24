"use client";

export const PlusSVG = (): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-slate-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path d="M12 4v16m8-8H4" />
    </svg>
  );
};

export const CheckmarkSVG = (): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-slate-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        className=""
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
};

export const CrossSVG = (): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-slate-900"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        className=""
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

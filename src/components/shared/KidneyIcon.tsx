import type { SVGProps } from "react";

export function KidneyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.2 3.4c-2.9.5-5 3.2-5 7.3 0 4.8 2.6 9.2 6.1 9.2 1.9 0 3-1.3 3-3.1 0-1.3-.6-2.2-1.5-3.1-.8-.8-1.4-1.5-1.4-2.9 0-1.9 1.6-2.9 3.1-3.3-.4-2.6-1.8-4.5-4.3-4.1Z" />
      <path d="M14.8 3.4c2.9.5 5 3.2 5 7.3 0 4.8-2.6 9.2-6.1 9.2-1.2 0-2.1-.5-2.6-1.3" />
      <path d="M13.5 7.5c1.5.4 3.1 1.4 3.1 3.3 0 1.4-.6 2.1-1.4 2.9-.6.6-1.1 1.2-1.3 2" />
      <path d="M12 11.2v9.4" />
    </svg>
  );
}

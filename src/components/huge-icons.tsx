/**
 * Internal icon pack — HugeIcons Bulk Rounded style.
 * Hand-inlined SVGs. Dual-layer: opacity-0.4 fill (bulk) + full-opacity fill (detail).
 */

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function HugeProformaIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
        fill="currentColor"
      />
      <path
        d="M3 8H21M9 8V21M3 13H9M3 17H9M13 13H18M13 17H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeChatIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 2C6.47715 2 2 6.47715 2 12C2 14.5136 2.9808 16.7953 4.60474 18.5008L4 22L7.81685 20.7916C9.10063 21.4268 10.5507 21.7884 12.083 21.7884C17.6059 21.7884 22 17.3943 22 11.8714C22 6.47715 17.5228 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M8.5 12C8.5 12.5523 8.05228 13 7.5 13C6.94772 13 6.5 12.5523 6.5 12C6.5 11.4477 6.94772 11 7.5 11C8.05228 11 8.5 11.4477 8.5 12Z"
        fill="currentColor"
      />
      <path
        d="M13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12Z"
        fill="currentColor"
      />
      <path
        d="M17.5 12C17.5 12.5523 17.0523 13 16.5 13C15.9477 13 15.5 12.5523 15.5 12C15.5 11.4477 15.9477 11 16.5 11C17.0523 11 17.5 11.4477 17.5 12Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeDashboardIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 6C3 4.34315 4.34315 3 6 3H10C11.6569 3 13 4.34315 13 6V10C13 11.6569 11.6569 13 10 13H6C4.34315 13 3 11.6569 3 10V6Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M11 14C11 12.3431 12.3431 11 14 11H18C19.6569 11 21 12.3431 21 14V18C21 19.6569 19.6569 21 18 21H14C12.3431 21 11 19.6569 11 18V14Z"
        fill="currentColor"
      />
      <path
        d="M11 6C11 4.34315 12.3431 3 14 3H18C19.6569 3 21 4.34315 21 6V8C21 9.65685 19.6569 11 18 11H14C12.3431 11 11 9.65685 11 8V6Z"
        fill="currentColor"
      />
      <path
        d="M3 16C3 14.3431 4.34315 13 6 13H10C11.6569 13 13 14.3431 13 16V18C13 19.6569 11.6569 21 10 21H6C4.34315 21 3 19.6569 3 18V16Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeFolderIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M2 11C2 8.17157 2 6.75736 2.87868 5.87868C3.75736 5 5.17157 5 8 5H10.1716C10.9049 5 11.2716 5 11.6049 5.13176C11.9382 5.26352 12.204 5.51665 12.7356 6.02291L13.2643 6.52709C13.796 7.03335 14.0618 7.28648 14.3951 7.41824C14.7284 7.55 15.0951 7.55 15.8284 7.55H16C18.8284 7.55 20.2426 7.55 21.1213 8.42868C22 9.30736 22 10.7216 22 13.55V15C22 17.8284 22 19.2426 21.1213 20.1213C20.2426 21 18.8284 21 16 21H8C5.17157 21 3.75736 21 2.87868 20.1213C2 19.2426 2 17.8284 2 15V11Z"
        fill="currentColor"
      />
      <path
        d="M2 13C2 10.1716 2 8.75736 2.87868 7.87868C3.75736 7 5.17157 7 8 7H10.1716C10.9049 7 11.2716 7 11.6049 6.86824C11.9382 6.73648 12.204 6.48335 12.7356 5.97709"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeSettingsIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M20.1 9.22C18.29 9.22 17.55 7.94 18.45 6.37C18.97 5.46 18.66 4.3 17.75 3.78L16.02 2.79C15.23 2.32 14.21 2.6 13.74 3.39L13.63 3.58C12.73 5.15 11.25 5.15 10.34 3.58L10.23 3.39C9.78 2.6 8.76 2.32 7.97 2.79L6.24 3.78C5.33 4.3 5.02 5.47 5.54 6.38C6.45 7.94 5.71 9.22 3.9 9.22C2.86 9.22 2 10.07 2 11.12V12.88C2 13.92 2.85 14.78 3.9 14.78C5.71 14.78 6.45 16.06 5.54 17.63C5.02 18.54 5.33 19.7 6.24 20.22L7.97 21.21C8.76 21.68 9.78 21.4 10.25 20.61L10.36 20.42C11.26 18.85 12.74 18.85 13.65 20.42L13.76 20.61C14.23 21.4 15.25 21.68 16.04 21.21L17.77 20.22C18.68 19.7 18.99 18.53 18.47 17.63C17.56 16.06 18.3 14.78 20.11 14.78C21.15 14.78 22.01 13.93 22.01 12.88V11.12C22 10.08 21.15 9.22 20.1 9.22Z"
        fill="currentColor"
      />
      <path
        d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeLogoutIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M9 2.5H7C4.51472 2.5 2.5 4.51472 2.5 7V17C2.5 19.4853 4.51472 21.5 7 21.5H9C10.3807 21.5 11.5 20.3807 11.5 19V5C11.5 3.61929 10.3807 2.5 9 2.5Z"
        fill="currentColor"
      />
      <path
        d="M16.5 8L21.5 12L16.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 12H21.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeVaultIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M2 8C2 5.79086 3.79086 4 6 4H18C20.2091 4 22 5.79086 22 8V17C22 19.2091 20.2091 21 18 21H6C3.79086 21 2 19.2091 2 17V8Z"
        fill="currentColor"
      />
      <path
        d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9Z"
        fill="currentColor"
      />
      <path
        d="M2 9H4M2 15H4M20 9H22M20 15H22M15 12H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 4V3M18 4V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeArrowLeftIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15 6L9 12L15 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HugeFlowsIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path opacity="0.4" d="M5 3C3.89543 3 3 3.89543 3 5V7C3 8.10457 3.89543 9 5 9H7C8.10457 9 9 8.10457 9 7V5C9 3.89543 8.10457 3 7 3H5Z" fill="currentColor" />
      <path opacity="0.4" d="M17 15C15.8954 15 15 15.8954 15 17V19C15 20.1046 15.8954 21 17 21H19C20.1046 21 21 20.1046 21 19V17C21 15.8954 20.1046 15 19 15H17Z" fill="currentColor" />
      <path d="M3 17C3 15.8954 3.89543 15 5 15H7C8.10457 15 9 15.8954 9 17V19C9 20.1046 8.10457 21 7 21H5C3.89543 21 3 20.1046 3 19V17Z" fill="currentColor" />
      <path d="M6 9V12H12V9M12 12V15M18 9C18 7.89543 17.1046 7 16 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HugeLocationIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 22C12 22 19 15.75 19 10.25C19 6.24694 15.866 3 12 3C8.13401 3 5 6.24694 5 10.25C5 15.75 12 22 12 22Z"
        fill="currentColor"
      />
      <path
        d="M12 13.25C13.6569 13.25 15 11.9069 15 10.25C15 8.59315 13.6569 7.25 12 7.25C10.3431 7.25 9 8.59315 9 10.25C9 11.9069 10.3431 13.25 12 13.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeLayersIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 3L21 8L12 13L3 8L12 3Z"
        fill="currentColor"
      />
      <path
        d="M4.5 11.5L12 16L19.5 11.5M4.5 15.5L12 20L19.5 15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HugeCameraIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M4 9C4 7.34315 5.34315 6 7 6H8.46837C9.13307 6 9.46542 6 9.74845 5.87689C10.0315 5.75378 10.2557 5.50829 10.7041 5.01732L11.2959 4.3684C11.7443 3.87743 11.9685 3.63195 12.2516 3.50883C12.5346 3.38572 12.8669 3.38572 13.5316 3.38572H17C18.6569 3.38572 20 4.72886 20 6.38572V17C20 18.6569 18.6569 20 17 20H7C5.34315 20 4 18.6569 4 17V9Z"
        fill="currentColor"
      />
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M17 8.5H17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HugeSunIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path opacity="0.4" d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z" fill="currentColor" />
      <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HugeMoonIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path opacity="0.4" d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" fill="currentColor" />
      <path d="M21 12C21 16.9706 16.9706 21 12 21C9.16645 21 6.66009 19.6213 5.07812 17.5C6 17.8 6.96667 17.9667 8 17.9667C13.3333 17.9667 17.6667 13.6333 17.6667 8.3C17.6667 7.18 17.4667 6.1 17.1 5.1C19.35 6.69 21 9.17 21 12Z" fill="currentColor" />
    </svg>
  );
}

export function HugeBrainIcon({ className, style }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path
        opacity="0.4"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.40917 5.01655C8.2741 5.00558 8.13763 5 8 5C5.23858 5 3 7.23858 3 10C3 10.1754 3.00907 10.3489 3.0268 10.5201C1.81689 11.2075 1 12.5075 1 14C1 16.2091 2.79086 18 5 18C6.74319 18 8.2235 16.8855 8.77213 15.3332C8.95618 14.8125 8.68326 14.2412 8.16254 14.0572C7.64182 13.8731 7.0705 14.146 6.88645 14.6668C6.61142 15.4449 5.86925 16 5 16C3.89543 16 3 15.1046 3 14C3 13.4059 3.25941 12.8712 3.67172 12.5045C3.9493 12.9796 4.55906 13.1414 5.03586 12.8656C5.51392 12.5891 5.67728 11.9773 5.40073 11.4993C5.28169 11.2935 5.18658 11.0725 5.11897 10.8402C5.04174 10.5748 5 10.2931 5 10C5 8.34315 6.34315 7 8 7C8.28513 7 8.55938 7.0395 8.81837 7.11271C9.57457 7.32649 10.2121 7.83151 10.5993 8.50073C10.8758 8.97879 11.4875 9.14215 11.9656 8.86561C12.4437 8.58906 12.607 7.97733 12.3305 7.49927C11.8638 6.69247 11.1778 6.02777 10.3526 5.58711C10.8579 4.64248 11.8546 4 13 4C14.6569 4 16 5.34315 16 7C16 7.03198 15.9995 7.06381 15.9985 7.09546C15.9826 7.6071 15.8392 8.08446 15.5993 8.49927C15.3227 8.97733 15.4861 9.58906 15.9641 9.86561C16.4422 10.1421 17.0539 9.97879 17.3305 9.50073C17.5958 9.042 17.7904 8.53709 17.8995 8.00164C17.9328 8.00055 17.9663 8 18 8C19.6569 8 21 9.34315 21 11C21 12.6569 19.6569 14 18 14C17.9882 14 17.9763 13.9999 17.9645 13.9998C17.7548 12.5336 16.6367 11.3619 15.1989 11.07C14.6577 10.9601 14.1299 11.3098 14.02 11.8511C13.9101 12.3923 14.2598 12.9202 14.8011 13.03C15.4853 13.1689 16 13.7755 16 14.5C16 14.5758 15.9945 14.6497 15.9839 14.7215C15.8775 15.4446 15.2527 16 14.5 16H14C11.2386 16 9 18.2386 9 21C9 21.5523 9.44772 22 10 22C10.5523 22 11 21.5523 11 21C11 19.3431 12.3431 18 14 18H14.5C15.9009 18 17.1085 17.1776 17.668 15.9891C17.7779 15.9963 17.8885 16 18 16C20.7614 16 23 13.7614 23 11C23 8.23858 20.7614 6 18 6C17.9667 6 17.9334 6.00033 17.9002 6.00098C17.4373 3.71825 15.4193 2 13 2C10.9426 2 9.17691 3.24195 8.40917 5.01655Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.9532 9.02443C9.49211 9.14521 9.83107 9.68001 9.71028 10.2189C9.66827 10.4064 9.7654 10.7871 10.1964 11.0294C10.6273 11.2717 11.0031 11.1569 11.1414 11.0236C11.5391 10.6404 12.1721 10.6521 12.5554 11.0498C12.9386 11.4475 12.9269 12.0805 12.5292 12.4638C11.6466 13.3142 10.277 13.3692 9.21617 12.7727C8.1553 12.1762 7.49063 10.9775 7.7587 9.78151C7.87949 9.24259 8.41429 8.90364 8.9532 9.02443Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeArrowRightIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HugeSearchIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M17 17L21 21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3 11C3 7.13401 6.13401 4 10 4C13.866 4 17 7.13401 17 11C17 14.866 13.866 18 10 18C6.13401 18 3 14.866 3 11Z"
        fill="currentColor"
        opacity="0.4"
      />
      <path
        d="M10 7C7.79086 7 6 8.79086 6 11C6 13.2091 7.79086 15 10 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeBuildingIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 21H21M6 21V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V21"
        fill="currentColor"
      />
      <path
        d="M3 21H21M6 21V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V21M10 8H14M10 12H14M10 16H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeCheckCircleIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        fill="currentColor"
      />
      <path
        d="M8 12L10.5 14.5L16 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HugeArrowUpIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 21V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 13L12 7L18 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="20" r="1" fill="currentColor" />
    </svg>
  );
}

export function HugeMapIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z"
        fill="currentColor"
      />
      <path
        d="M9 4V17M15 7V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeRulerIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3.5 20.5L20.5 3.5M3.5 20.5L3.5 14.5L9.5 20.5L3.5 20.5Z"
        fill="currentColor"
      />
      <path
        d="M3.5 20.5L20.5 3.5M7 17L9 15M10 14L12 12M13 11L15 9M16 8L18 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeHomeIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 10.5L12 3L21 10.5V20C21 20.8284 20.3284 21.5 19.5 21.5H4.5C3.67157 21.5 3 20.8284 3 20V10.5Z"
        fill="currentColor"
      />
      <path
        d="M10 14V17M14 14V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HugeGridIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M3 5C3 3.89543 3.89543 3 5 3H9C10.1046 3 11 3.89543 11 5V9C11 10.1046 10.1046 11 9 11H5C3.89543 11 3 10.1046 3 9V5Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M13 5C13 3.89543 13.8954 3 15 3H19C20.1046 3 21 3.89543 21 5V9C21 10.1046 20.1046 11 19 11H15C13.8954 11 13 10.1046 13 9V5Z"
        fill="currentColor"
      />
      <path
        d="M3 15C3 13.8954 3.89543 13 5 13H9C10.1046 13 11 13.8954 11 15V19C11 20.1046 10.1046 21 9 21H5C3.89543 21 3 20.1046 3 19V15Z"
        fill="currentColor"
      />
      <path
        d="M13 15C13 13.8954 13.8954 13 15 13H19C20.1046 13 21 13.8954 21 15V19C21 20.1046 20.1046 21 19 21H15C13.8954 21 13 20.1046 13 19V15Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HugeSparklesIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        opacity="0.4"
        d="M12 3L13.5 8.5H19L14.5 11.5L16 17L12 14L8 17L9.5 11.5L5 8.5H10.5L12 3Z"
        fill="currentColor"
      />
      <path
        d="M19 2V5M19 5V8M19 5H22M19 5H16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 16V18M5 18V20M5 18H7M5 18H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

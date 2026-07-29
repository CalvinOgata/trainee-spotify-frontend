type IconProps = { className?: string }

export const Spotify = ({ className = 'h-7 w-7 text-white' }: IconProps) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M14.5554 0.0112571C6.82906 -0.29585 0.318363 5.71834 0.0112549 13.4446C-0.295854 21.171 5.71963 27.6816 13.4447 27.9887C21.171 28.2959 27.6817 22.2817 27.9888 14.5554C28.2947 6.82904 22.2805 0.317085 14.5554 0.0112571ZM20.4647 20.5209C20.2906 20.828 19.9515 20.9816 19.6214 20.9355C19.5203 20.9214 19.4192 20.8882 19.3245 20.8344C17.4742 19.7813 15.4575 19.0954 13.3308 18.796C11.2041 18.4966 9.07607 18.6002 7.00693 19.1031C6.55778 19.2119 6.10608 18.9368 5.99731 18.4876C5.88854 18.0385 6.16366 17.5868 6.61281 17.478C8.88797 16.9252 11.2271 16.8113 13.5637 17.1402C15.9003 17.469 18.1166 18.2227 20.1524 19.3808C20.553 19.6098 20.6937 20.1191 20.466 20.5209H20.4647ZM22.3048 16.8459C22.0194 17.3731 21.3591 17.5701 20.8319 17.2848C18.6668 16.1139 16.3226 15.3449 13.8644 14.9994C11.4063 14.6539 8.94171 14.7473 6.53731 15.2758C6.40679 15.3039 6.27755 15.309 6.15214 15.2911C5.71579 15.2297 5.34215 14.9047 5.24234 14.4479C5.11309 13.8618 5.48418 13.2821 6.07025 13.1529C8.72802 12.5681 11.4523 12.4645 14.1677 12.8458C16.8817 13.2271 19.473 14.0768 21.8659 15.3717C22.3943 15.6571 22.5901 16.3161 22.3048 16.8446V16.8459ZM24.3445 12.7025C24.0758 13.2194 23.5166 13.4869 22.9714 13.4101C22.8243 13.3896 22.6797 13.3436 22.5402 13.2719C20.0194 11.9603 17.304 11.094 14.4697 10.696C11.6353 10.2981 8.7856 10.3825 6.00115 10.9481C5.27688 11.0953 4.57182 10.6269 4.42466 9.90395C4.2775 9.17969 4.74584 8.47463 5.46883 8.32747C8.55271 7.70174 11.7057 7.60833 14.842 8.04851C17.9784 8.4887 20.9829 9.44841 23.775 10.9008C24.4302 11.2412 24.6849 12.0486 24.3445 12.7038V12.7025Z"
      fill="currentColor"
    />
  </svg>
)

export const Home = ({ className = 'h-9 w-9' }: IconProps) => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="36" height="36" rx="18" fill="#1F1F1F" />
    <path
      d="M17.2432 10.7373C17.4013 10.6426 17.5987 10.6426 17.7568 10.7373L24.2568 14.6377C24.4074 14.7281 24.5 14.8908 24.5 15.0664V25C24.5 25.2761 24.2761 25.5 24 25.5H20C19.7239 25.5 19.5 25.2761 19.5 25V21.5C19.5 20.6716 18.8284 20 18 20H17C16.1716 20 15.5 20.6716 15.5 21.5V25C15.5 25.2761 15.2761 25.5 15 25.5H11C10.7239 25.5 10.5 25.2761 10.5 25V15.0664C10.5 14.8908 10.5926 14.7281 10.7432 14.6377L17.2432 10.7373Z"
      stroke="#B3B3B3"
    />
  </svg>
)

export const Search = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7ZM1.92213 7C1.92213 9.80443 4.19557 12.0779 7 12.0779C9.80443 12.0779 12.0779 9.80443 12.0779 7C12.0779 4.19557 9.80443 1.92213 7 1.92213C4.19557 1.92213 1.92213 4.19557 1.92213 7Z"
      fill="currentColor"
    />
    <line x1="12.0607" y1="12" x2="15" y2="14.9393" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const X = ({ className = 'h-[14px] w-[14px]' }: IconProps) => (
  <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0.5 0.792969L12.7929 13.0859" stroke="currentColor" strokeLinecap="round" />
    <path d="M12.793 0.5L0.500075 12.7929" stroke="currentColor" strokeLinecap="round" />
  </svg>
)

export const Bell = ({ className = 'h-3 w-3' }: IconProps) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M6 0.5C7.933 0.5 9.5 2.067 9.5 4V6.73438C9.5 6.99532 9.56785 7.25193 9.69727 7.47852L11.1387 10H0.861328L2.30273 7.47852C2.43215 7.25193 2.5 6.99532 2.5 6.73438V4C2.5 2.067 4.067 0.5 6 0.5Z"
      stroke="currentColor"
    />
    <path
      d="M7.73047 10.25C7.60905 11.0979 6.88153 11.75 6 11.75C5.11847 11.75 4.39095 11.0979 4.26953 10.25H7.73047Z"
      stroke="currentColor"
      strokeWidth="0.5"
    />
  </svg>
)

export const Download = ({ className = 'h-3 w-3' }: IconProps) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M6 0.5C9.29861 0.5 11.5 2.94708 11.5 6C11.5 9.05292 9.29861 11.5 6 11.5C2.70139 11.5 0.5 9.05292 0.5 6C0.5 2.94708 2.70139 0.5 6 0.5Z"
      stroke="currentColor"
    />
    <path d="M5.5 2.5H6.5V8H5.5V2.5Z" fill="currentColor" />
    <path d="M3.5 6.70703L4.20711 5.99992L6.5125 8.30531L6 8.99994L3.5 6.70703Z" fill="currentColor" />
    <path d="M7.80469 6L8.51179 6.70711L5.99927 9L5.4993 8.30539L7.80469 6Z" fill="currentColor" />
  </svg>
)

export const Mixer = ({ className = 'h-3 w-3' }: IconProps) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M9.59961 8.70005C10.31 8.21036 10.7996 7.19073 10.7996 6.0034C10.7996 4.81607 10.31 3.79645 9.59961 3.30005"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.40312 4.2001H3.60018L6.60017 0.600098H7.80017V11.3976H6.60017L3.60018 7.8001H2.40312C1.74038 7.8001 1.20312 7.26284 1.20312 6.6001V5.4001C1.20312 4.73736 1.74038 4.2001 2.40312 4.2001Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const MinimizedPlayer = ({ className = 'h-[11px] w-3' }: IconProps) => (
  <svg viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M3.7002 0.176025L3.70034 1.67643C3.70039 2.22881 3.25256 2.67661 2.70018 2.67652L0.000234169 2.67609"
      stroke="currentColor"
    />
    <path
      d="M8.10059 0.176025L8.10045 1.67643C8.10039 2.22881 8.54822 2.67661 9.1006 2.67652L11.8005 2.67609"
      stroke="currentColor"
    />
    <path
      d="M3.7002 10.729L3.70034 9.2286C3.70039 8.67622 3.25256 8.22842 2.70018 8.22851L0.000234169 8.22894"
      stroke="currentColor"
    />
    <path
      d="M8.10059 10.729L8.10045 9.2286C8.10039 8.67622 8.54822 8.22842 9.1006 8.22851L11.8005 8.22894"
      stroke="currentColor"
    />
  </svg>
)

export const MaximizedPlayer = ({ className = 'h-[11px] w-3' }: IconProps) => (
  <svg viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M1.20056 4.27661L1.20042 2.77621C1.20037 2.22383 1.6482 1.77603 2.20058 1.77612L4.90052 1.77654"
      stroke="currentColor"
    />
    <path
      d="M10.6005 4.27661L10.6006 2.77621C10.6007 2.22383 10.1528 1.77603 9.60045 1.77612L6.9005 1.77654"
      stroke="currentColor"
    />
    <path
      d="M1.20056 6.62866L1.20042 8.12906C1.20037 8.68145 1.6482 9.12925 2.20058 9.12916L4.90052 9.12873"
      stroke="currentColor"
    />
    <path
      d="M10.6005 6.62866L10.6006 8.12906C10.6007 8.68145 10.1528 9.12925 9.60045 9.12916L6.9005 9.12873"
      stroke="currentColor"
    />
  </svg>
)

export const Dots = ({ className = 'text-lg' }: IconProps) => (
  <span className={`text-neutral-400 leading-none ${className}`}>···</span>
)

export const Plus = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-neutral-400 ${className}`}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

export const Verified = () => (
  <svg viewBox="0 0 24 24" fill="#3b82f6" className="h-4 w-4">
    <path d="M12 1.5 14 3l2.5-.3.7 2.4 2.4.7-.3 2.5 1.5 2-1.5 2 .3 2.5-2.4.7-.7 2.4-2.5-.3L12 19l-2-1.5-2.5.3-.7-2.4-2.4-.7.3-2.5L3 10l1.5-2-.3-2.5 2.4-.7.7-2.4L9.8 3 12 1.5Z" />
    <path d="m8 11 3 3 5-5" stroke="white" strokeWidth="2" fill="none" />
  </svg>
)

export const Pause = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="white" />
    <path d="M8 7H10.5V18H8V7Z" fill="black" />
    <path d="M13 7H15.5V18H13V7Z" fill="black" />
  </svg>
)

export const Play = ({ className = 'h-6 w-6' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="12" fill="white" />
    <path d="M9 7L18 12L9 17V7Z" fill="black" />
  </svg>
)

export const Next = ({ className = 'h-[11px] w-[11px]' }: IconProps) => (
  <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M0 0.5L1 0L10 5.5L2 10.5L1 11L0 10.5V0.5Z" fill="currentColor" />
    <rect x="8.5" width="2" height="11" fill="currentColor" />
  </svg>
)

export const Pen = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Lock = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
  </svg>
)

export const Trash = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" strokeLinecap="round" />
  </svg>
)

export const MusicNote = ({ className = 'h-12 w-12' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3v10.55A4 4 0 1 0 21 17V7h-2V3h-2v2h-6V3h-2Zm-2 4h2v2h-2V7Z" />
  </svg>
)

export const Clock = ({ className = 'h-3 w-3' }: IconProps) => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
    <path d="M5 2.49985H6V6.49985H5V2.49985Z" fill="currentColor" />
    <path d="M5 6.50015V5.50015H8.5V6.50015H5Z" fill="currentColor" />
  </svg>
)

export const Prev = ({ className = 'h-[11px] w-[11px]' }: IconProps) => (
  <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} -scale-x-100`}>
    <path d="M0 0.5L1 0L10 5.5L2 10.5L1 11L0 10.5V0.5Z" fill="currentColor" />
    <rect x="8.5" width="2" height="11" fill="currentColor" />
  </svg>
)

export const Heart = ({ className = 'h-4 w-4', filled = false }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

export const Bookmark = ({ className = 'h-4 w-4', filled = false }: IconProps & { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      d="M6 3h12v18l-6-4-6 4V3Z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

export const PlusCircle = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" strokeLinecap="round" />
  </svg>
)

export const VolumeHigh = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 10v4h3l5 4V6L6 10H3Z" strokeLinejoin="round" />
    <path d="M15 9a4 4 0 0 1 0 6" strokeLinecap="round" />
    <path d="M17.5 6.5a8 8 0 0 1 0 11" strokeLinecap="round" />
  </svg>
)

export const VolumeLow = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 10v4h3l5 4V6L6 10H3Z" strokeLinejoin="round" />
    <path d="M15 9a4 4 0 0 1 0 6" strokeLinecap="round" />
  </svg>
)

export const MinusCircle = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12h8" strokeLinecap="round" />
  </svg>
)

export const CheckCircle = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m7.5 12 3 3 6-6" stroke="black" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Person = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" strokeLinecap="round" />
  </svg>
)

export const GoToArtist = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M14.9463 7.10742L15.4443 7.1123L15.4629 13.625C15.4668 15.0264 14.3514 16.1562 12.9648 16.1562C12.548 16.1561 12.155 16.0517 11.8066 15.8711C12.0423 15.7016 12.1116 15.292 12.1318 14.9092C12.3706 15.0613 12.6523 15.1504 12.9541 15.1504C13.7946 15.1502 14.47 14.4657 14.4678 13.6162L14.4629 11.6465L13.1172 11.6484C12.7388 11.6484 12.3903 11.7712 12.1074 11.9795C12.0766 11.5564 12.0161 11.2109 11.8945 10.9326C12.2582 10.7484 12.6684 10.6427 13.1045 10.6426H14.4609L14.4502 7.10352L14.9463 7.10742ZM9.43164 9.96973C10.925 9.96976 11.5937 10.2443 11.8945 10.9326C11.0126 11.3792 10.4093 12.2984 10.4092 13.3672V13.5723C10.4092 14.5727 10.9793 15.4422 11.8066 15.8711C11.7355 15.9222 11.6493 15.9521 11.5449 15.9521H2.31836C1.75954 15.9521 1.30276 15.5034 1.30273 14.9551V13.958C1.30276 11.306 6.71858 9.96973 9.43164 9.96973ZM12.1074 11.9795C12.1389 12.411 12.1406 12.9226 12.1406 13.5244V14.5645C12.1406 14.671 12.1382 14.7889 12.1318 14.9092C11.6957 14.6314 11.4043 14.1411 11.4043 13.584V13.3789C11.4044 12.8021 11.6808 12.2936 12.1074 11.9795ZM9.43164 0C11.6772 0.00015296 13.4961 1.785 13.4961 3.98828C13.4959 6.19143 11.6771 7.97543 9.43164 7.97559C7.18608 7.97559 5.36734 6.19153 5.36719 3.98828C5.36719 1.78491 7.18599 0 9.43164 0Z" />
  </svg>
)

export const Disc = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
)

export const CreditsMenu = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13.8912 0H1.73641C0.781382 0 0 0.781382 0 1.73641V13.8912C0 14.8463 0.781382 15.6276 1.73641 15.6276H13.8912C14.8463 15.6276 15.6276 14.8463 15.6276 13.8912V1.73641C15.6276 0.781382 14.8463 0 13.8912 0ZM8.68203 12.1548H4.34101C3.8635 12.1548 3.47281 11.7641 3.47281 11.2866C3.47281 10.8091 3.8635 10.4184 4.34101 10.4184H8.68203C9.15954 10.4184 9.55023 10.8091 9.55023 11.2866C9.55023 11.7641 9.15954 12.1548 8.68203 12.1548ZM11.2866 8.68203H4.34101C3.8635 8.68203 3.47281 8.29133 3.47281 7.81382C3.47281 7.33631 3.8635 6.94562 4.34101 6.94562H11.2866C11.7641 6.94562 12.1548 7.33631 12.1548 7.81382C12.1548 8.29133 11.7641 8.68203 11.2866 8.68203ZM11.2866 5.20922H4.34101C3.8635 5.20922 3.47281 4.81852 3.47281 4.34101C3.47281 3.8635 3.8635 3.47281 4.34101 3.47281H11.2866C11.7641 3.47281 12.1548 3.8635 12.1548 4.34101C12.1548 4.81852 11.7641 5.20922 11.2866 5.20922Z" />
  </svg>
)

export const Pin = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 10 10" fill="currentColor" className={className}>
    <path d="M5.50838 0.498612C5.66643 0.340535 5.85406 0.215139 6.06057 0.129586C6.26708 0.0440337 6.48842 0 6.71195 0C6.93548 0 7.15682 0.0440337 7.36333 0.129586C7.56984 0.215139 7.75747 0.340535 7.91552 0.498612L9.50109 2.08361C9.65926 2.24167 9.78473 2.42935 9.87033 2.63592C9.95594 2.8425 10 3.06392 10 3.28753C10 3.51114 9.95594 3.73256 9.87033 3.93913C9.78473 4.1457 9.65926 4.33338 9.50109 4.49145L7.1997 6.79291L6.36311 9.91409L3.55614 7.10703L0.789213 9.87404C0.700252 9.95694 0.582588 10.0021 0.46101 9.99993C0.339432 9.99778 0.223433 9.94853 0.137452 9.86254C0.0514697 9.77656 0.00221821 9.66056 7.31133e-05 9.53897C-0.00207198 9.41739 0.0430568 9.29973 0.125952 9.21076L2.89288 6.44375L0.085906 3.63669L3.20636 2.80008L5.50838 0.498612Z" />
  </svg>
)

export const ChevronRight = ({ className = 'h-3 w-3' }: IconProps) => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="m4 2 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const AddPlaylist = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6.36365" width="1.27273" height="14" />
    <rect y="7.63647" width="1.27273" height="14" transform="rotate(-90 0 7.63647)" />
  </svg>
)

export const RemovePlaylist = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13V14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14V13C10.3137 13 13 10.3137 13 7Z" />
    <path d="M3.49707 6.50011L10.9971 6.46203L11.0029 7.46105L3.50292 7.50011L3.49707 6.50011Z" />
  </svg>
)

export const AddLikedSongs = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6.69763" y="4.57153" width="2.23252" height="6.85719" />
    <rect x="4.46509" y="9.14307" width="2.28573" height="6.69756" transform="rotate(-90 4.46509 9.14307)" />
    <path d="M15.6276 8.00006C15.6276 12.4184 12.1293 16.0001 7.81382 16.0001C3.49837 16.0001 0 12.4184 0 8.00006C0 3.58175 3.49837 0 7.81382 0C12.1293 0 15.6276 3.58175 15.6276 8.00006ZM1.50085 8.00006C1.50085 11.5697 4.32726 14.4635 7.81382 14.4635C11.3004 14.4635 14.1268 11.5697 14.1268 8.00006C14.1268 4.4304 11.3004 1.53662 7.81382 1.53662C4.32726 1.53662 1.50085 4.4304 1.50085 8.00006Z" />
  </svg>
)

export const EditPlaylist = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M11.165 1.07812C11.918 0.307707 13.1777 0.307707 13.9307 1.07812C14.6897 1.85492 14.6898 3.16271 13.9307 3.93945L6.11035 11.9385L1.81348 13.2324L3.33105 9.0918L11.165 1.07812Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export const LockIcon = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M3.11621 6.9043H12.3398C13.0301 6.90446 13.5898 7.46404 13.5898 8.1543V14C13.5898 14.6903 13.0301 15.2498 12.3398 15.25H3.11621C2.42586 15.25 1.86621 14.6904 1.86621 14V8.1543C1.86621 7.46394 2.42585 6.9043 3.11621 6.9043Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4.87158 3.60669C4.87158 2.02917 6.1505 0.750244 7.72803 0.750244C9.30551 0.750289 10.5845 2.02919 10.5845 3.60669V6.67896L4.87158 6.67896L4.87158 3.60669Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
)

export const PlaylistSongOptions = ({ className = 'h-[3px] w-[13px]' }: IconProps) => (
  <svg viewBox="0 0 13 3" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="1.5" cy="1.5" r="1.5" />
    <circle cx="6.5" cy="1.5" r="1.5" />
    <circle cx="11.5" cy="1.5" r="1.5" />
  </svg>
)

export const AlreadyAdded = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="7.81382" cy="8.0001" r="7.81382" fill="#67C260" />
    <path d="M3.84675 8.54902L4.20739 7.94796L4.56802 7.34689L7.2127 9.29659L11.2999 5.20936L12.2616 6.17106L7.09249 11.5806L3.84675 8.54902Z" fill="black" />
  </svg>
)

export const VolumeMute = ({ className = 'h-4 w-4' }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M3 10v4h3l5 4V6L6 10H3Z" strokeLinejoin="round" />
    <path d="M15 9l5 6M20 9l-5 6" strokeLinecap="round" />
  </svg>
)

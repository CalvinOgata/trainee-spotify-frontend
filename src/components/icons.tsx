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

export const Dots = () => (
  <span className="text-neutral-400 text-lg leading-none">···</span>
)

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-neutral-400">
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

export const Clock = ({ className = 'h-3.5 w-3.5' }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" />
    <path d="M8 4V8L10.5 10" stroke="currentColor" strokeLinecap="round" />
  </svg>
)

export const Prev = ({ className = 'h-[11px] w-[11px]' }: IconProps) => (
  <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} -scale-x-100`}>
    <path d="M0 0.5L1 0L10 5.5L2 10.5L1 11L0 10.5V0.5Z" fill="currentColor" />
    <rect x="8.5" width="2" height="11" fill="currentColor" />
  </svg>
)

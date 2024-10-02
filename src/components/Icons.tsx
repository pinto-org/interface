interface SVGProps {
  color?: string;
  width?: number;
  height?: number;
  className?: string;
};

export const ExternalLinkIcon = ({ color = "#9C9C9C", width = 24, height = 24 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 13V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3L13.5 10.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 8.5V3H15.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GearIcon = ({ color = "#9C9C9C", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={color} viewBox="0 0 16 16">
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
  </svg>
);

export const InfoSolidIcon = ({ color = "#246645", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 16 16">
    <path fill={color} fillRule="evenodd" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" clipRule="evenodd"/>
    <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 8v3.333M7.999 5.333A.167.167 0 1 0 8 5.666.167.167 0 0 0 8 5.334"/>
  </svg>
);

export const InfoOutlinedIcon = ({ color = "#9C9C9C", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 16 16">
    <path fill="#fff" fillRule="evenodd" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" clipRule="evenodd"/>
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 8v3.333M8 5.333A.167.167 0 1 0 8 5.666a.167.167 0 0 0-.002-.333"/>
  </svg>
);

export const ForwardArrowIcon = ({ color = "#9C9C9C", width = 16, height = 16 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6673 7L8.00065 4.33333L5.33398 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.3337 11.6666L8.00033 8.33329L4.66699 11.6666" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UpDownArrowsIcon = ({ color = "#9C9C9C", width = 19, height = 16 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4L4.5 1L1.5 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4.5 15V1" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 12L14.5 15L17.5 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.5 1V15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LeftArrowIcon = ({ color = "#9C9C9C", width = 17, height = 12 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 6H1.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 11L15.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 1L15.5 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BackwardArrowDotsIcon = ({ color = "#9C9C9C", width = 25, height = 24 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none">
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.5 4.997H5.497M12.5 4.997a8.003 8.003 0 1 1-8.003 8.004M8.499 1.996 5.497 4.997M8.499 7.999 5.497 4.997"/>
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.5 12.82a.18.18 0 1 0 .002.36.18.18 0 0 0-.002-.36M12.5 15.943a.18.18 0 1 0 .002.36.18.18 0 0 0-.002-.36M15.101 14.441a.18.18 0 1 0 0 .36.18.18 0 0 0 0-.36M9.9 14.441a.18.18 0 1 0 .001.36.18.18 0 0 0-.002-.36M9.9 11.439a.18.18 0 1 0 .001.36.18.18 0 0 0-.002-.36M15.101 11.441a.18.18 0 1 0 0 .36.18.18 0 0 0 0-.36M12.5 9.94a.18.18 0 1 0 .002.36.18.18 0 0 0-.002-.36"/>
    <path stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.5 9.94a.18.18 0 1 0 0 .36.18.18 0 0 0 0-.36"/>
  </svg>
);

export const ChevronDownIcon = ({ color = "#9C9C9C", width = 15, height = 15, className = '' }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" className={className}>
    <path fill={color} fillRule="evenodd" d="M3.135 6.158a.5.5 0 0 1 .707-.023L7.5 9.565l3.658-3.43a.5.5 0 0 1 .684.73l-4 3.75a.5.5 0 0 1-.684 0l-4-3.75a.5.5 0 0 1-.023-.707Z" clipRule="evenodd"/>
  </svg>
);

export const CloseIcon = ({ color = "#9C9C9C", width = 9, height = 10 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.16675 1.66675L7.83341 8.33341" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.16675 8.33341L7.83341 1.66675" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const UpRightArrowIcon = ({ color = "#9C9C9C", width = 12, height = 13 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.95 1.54688L1.05005 11.4469" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 1.5L10.95 1.549L11 8.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


interface SVGProps {
  color?: string;
  width?: number;
  height?: number;
};

export const ExternalLinkIcon = ({ color = "#9C9C9C", width = 24, height = 24 }: SVGProps) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 13V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6C3 4.34315 4.34315 3 6 3H11" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 3L13.5 10.5" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 8.5V3H15.5" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
);

export const GearIcon = ({ color = "#9C9C9C", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill={color} viewBox="0 0 16 16">
    <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
  </svg>
);

export const InfoIcon = ({ color = "#246645", width = 16, height = 16 }: SVGProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 16 16">
    <path fill={color} fill-rule="evenodd" stroke={color} stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14A6 6 0 1 1 8 2a6 6 0 0 1 0 12Z" clip-rule="evenodd"/>
    <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 8v3.333M7.999 5.333A.167.167 0 1 0 8 5.666.167.167 0 0 0 8 5.334"/>
  </svg>
);
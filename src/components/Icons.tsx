import React from "react";
import Svg, { Path, Circle, Rect, G, type SvgProps } from "react-native-svg";

type Props = SvgProps & { size?: number; color?: string };

function Icon({ size = 24, color = "#1B3328", children, ...rest }: Props & { children: React.ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      {children}
    </Svg>
  );
}

export function LeafIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 2C12 2 6 6 6 12C6 18 12 22 12 22C12 22 18 18 18 12C18 6 12 2 12 2Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 2V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Icon>
  );
}

export function SeedlingIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 2V12M12 12C12 12 8 10 6 8C4 6 4 4 6 2C8 0 12 2 12 12Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 12C12 12 16 10 18 8C20 6 20 4 18 2C16 0 12 2 12 12Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 12V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Icon>
  );
}

export function HeartIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 21C12 21 4 15 4 9C4 6 6 4 8 4C10 4 12 6 12 6C12 6 14 4 16 4C18 4 20 6 20 9C20 15 12 21 12 21Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function CheckIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M5 12L10 17L19 8" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function ClockIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M12 7V12L15 15" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function FlameIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 2C12 2 8 8 8 13C8 17 10 20 12 22C14 20 16 17 16 13C16 8 12 2 12 2Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M12 22C12 22 14 19 14 16C14 13 12 11 12 11C12 11 10 13 10 16C10 19 12 22 12 22Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function FoodIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M6 2V7C6 9.2 7.8 11 10 11V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M18 2V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M14 2V7C14 9.2 15.8 11 18 11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function BellIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M18 8C18 6.4 17.4 4.9 16.2 3.8C15 2.6 13.5 2 12 2C10.5 2 9 2.6 7.8 3.8C6.6 4.9 6 6.4 6 8V11C6 12.1 5.6 13.2 5 14L4 16H20L19 14C18.4 13.2 18 12.1 18 11V8Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M9 16C9 16.8 9.3 17.5 9.9 18.1C10.5 18.7 11.2 19 12 19C12.8 19 13.5 18.7 14.1 18.1C14.7 17.5 15 16.8 15 16" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function StarIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 2L15 9L22 9.5L17 14L19 22L12 18L5 22L7 14L2 9.5L9 9L12 2Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function CalendarIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M3 10H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M8 2V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M16 2V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Icon>
  );
}

export function ArrowUpIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 19V5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5 12L12 5L19 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function ArrowRightIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M5 12H19" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M14 5L19 12L14 19" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function ArrowDownIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 5V19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19 12L12 19L5 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function PlusIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M12 5V19" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M5 12H19" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Icon>
  );
}

export function HomeIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M3 12L12 3L21 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M5 10V20H19V10" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Rect x="9" y="14" width="6" height="6" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
    </Icon>
  );
}

export function ScanIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M4 8V6C4 4.9 4.9 4 6 4H8" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M16 4H18C19.1 4 20 4.9 20 6V8" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M20 16V18C20 19.1 19.1 20 18 20H16" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M8 20H6C4.9 20 4 19.1 4 18V16" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.5} fill="none" />
    </Icon>
  );
}

export function LibraryIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Rect x="3" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="14" y="3" width="7" height="7" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="3" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="14" y="14" width="7" height="7" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
    </Icon>
  );
}

export function DashboardIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Rect x="3" y="3" width="8" height="9" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="13" y="3" width="8" height="5" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="13" y="10" width="8" height="11" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
      <Rect x="3" y="14" width="8" height="7" rx="1" stroke={color} strokeWidth={1.5} fill="none" />
    </Icon>
  );
}

export function TargetIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} fill="none" />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={1.5} fill="none" />
      <Circle cx="12" cy="12" r="2" fill={color} />
    </Icon>
  );
}

export function TrendingUpIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Path d="M22 7L14.5 14.5L10 10L2 18" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M16 7H22V13" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Icon>
  );
}

export function SunIcon({ size, color }: Props) {
  return (
    <Icon size={size} color={color}>
      <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.5} fill="none" />
      <Path d="M12 2V4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12 20V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M4 12H2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M22 12H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19.8 4.2L18.4 5.6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5.6 18.4L4.2 19.8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M19.8 19.8L18.4 18.4" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M5.6 5.6L4.2 4.2" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Icon>
  );
}

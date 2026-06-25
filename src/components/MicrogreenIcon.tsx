import React from "react";
import Svg, { Path, Circle, G, type SvgProps } from "react-native-svg";

type Props = SvgProps & { size?: number; color?: string; microgreenId: string };

export function MicrogreenIcon({ size = 32, color = "#2E9E5A", microgreenId, ...rest }: Props) {
  const svgProps = { width: size, height: size, viewBox: "0 0 32 32" as const, fill: "none" as const };

  switch (microgreenId) {
    case "fenugreek":
      return (
        <Svg {...svgProps} {...rest}>
          <Path d="M16 4C16 4 10 10 10 16C10 22 16 28 16 28C16 28 22 22 22 16C22 10 16 4 16 4Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M12 12C12 12 14 10 16 10C18 10 20 12 20 12" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    case "mustard":
      return (
        <Svg {...svgProps} {...rest}>
          <Circle cx="16" cy="16" r="12" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M16 8V24" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M8 16H24" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Circle cx="16" cy="16" r="3" fill={color} />
        </Svg>
      );
    case "red_cabbage":
      return (
        <Svg {...svgProps} {...rest}>
          <Path d="M16 6C16 6 12 10 12 14C12 18 14 22 16 26C18 22 20 18 20 14C20 10 16 6 16 6Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M14 16H18" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M13 20H19" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
    case "radish":
      return (
        <Svg {...svgProps} {...rest}>
          <Path d="M16 10C16 10 12 14 12 18C12 22 14 26 16 28C18 26 20 22 20 18C20 14 16 10 16 10Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M14 12L10 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M18 12L22 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M16 10V6" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
    case "broccoli":
      return (
        <Svg {...svgProps} {...rest}>
          <Circle cx="16" cy="12" r="6" stroke={color} strokeWidth={1.5} fill="none" />
          <Path d="M12 12C12 12 10 10 10 8C10 6 12 6 14 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M20 12C20 12 22 10 22 8C22 6 20 6 18 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M14 16V28" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M18 16V28" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
    case "spinach":
      return (
        <Svg {...svgProps} {...rest}>
          <Path d="M16 28C16 28 8 22 8 16C8 10 12 6 16 4C20 6 24 10 24 16C24 22 16 28 16 28Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M16 4V12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M16 12L20 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
          <Path d="M16 12L12 8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
    case "pea":
      return (
        <Svg {...svgProps} {...rest}>
          <Circle cx="16" cy="16" r="10" stroke={color} strokeWidth={1.5} fill="none" />
          <Circle cx="16" cy="16" r="4" fill={color} />
          <Path d="M16 6C16 6 22 8 22 16" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M16 26C16 26 10 24 10 16" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </Svg>
      );
    default:
      return (
        <Svg {...svgProps} {...rest}>
          <Path d="M16 4C16 4 10 10 10 16C10 22 16 28 16 28C16 28 22 22 22 16C22 10 16 4 16 4Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <Path d="M16 4V28" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        </Svg>
      );
  }
}

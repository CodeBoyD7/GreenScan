import React from "react";
import { Text, type TextStyle, type TextProps, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../theme/colors";

interface GradientTextProps extends TextProps {
  gradientColors?: [string, string];
  style?: TextStyle | TextStyle[];
}

export function GradientText({
  children,
  gradientColors = [Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd],
  style,
  ...rest
}: GradientTextProps) {
  const textStyle = Array.isArray(style) ? Object.assign({}, ...style) : style || {};

  return (
    <MaskedView
      maskElement={
        <Text
          {...rest}
          style={[
            textStyle,
            { backgroundColor: "transparent" },
          ]}
        >
          {children}
        </Text>
      }
    >
      {/* The gradient fills whatever space the mask text occupies, no fixed height needed */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, height: "100%", minHeight: 20 }}
      >
        <Text
          {...rest}
          style={[
            textStyle,
            { opacity: 0 },
          ]}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

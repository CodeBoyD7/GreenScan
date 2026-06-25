import React, { type ReactNode } from "react";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, BorderRadius } from "../theme/colors";

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
}

export function GlassCard({ children, style, padded = true }: GlassCardProps) {
  return (
    <View style={[styles.card, padded && styles.padded, style]}>
      {/* Subtle gradient overlay for the glass effect */}
      <LinearGradient
        colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.6)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: "hidden",
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 4,
    backgroundColor: Colors.glassBackground,
  },
  content: {
    zIndex: 1,
  },
  padded: {
    padding: 20,
  },
});

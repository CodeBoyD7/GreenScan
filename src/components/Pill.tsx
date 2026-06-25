import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, BorderRadius, FontSize } from "../theme/colors";

interface PillProps {
  icon?: string;
  label: string;
}

export function Pill({ icon, label }: PillProps) {
  return (
    <View style={styles.pill}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    fontSize: 12,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.mutedForeground,
  },
});

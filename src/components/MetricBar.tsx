import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, BorderRadius, FontSize } from "../theme/colors";

interface MetricBarProps {
  label: string;
  value: number;
  note?: string;
}

export function MetricBar({ label, value, note }: MetricBarProps) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>
          {value}%
          {note ? <Text style={styles.note}> {note}</Text> : null}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.foreground,
  },
  value: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.primary,
  },
  note: {
    fontWeight: "400",
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  track: {
    height: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
  },
});

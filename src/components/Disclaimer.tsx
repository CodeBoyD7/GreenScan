import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { GlassCard } from "./GlassCard";
import { Colors, FontSize } from "../theme/colors";
import { useI18n } from "../i18n";

export function Disclaimer() {
  const { t } = useI18n();
  return (
    <GlassCard style={styles.card} padded={false}>
      <View style={styles.inner}>
        <Text style={styles.icon}>ℹ️</Text>
        <Text style={styles.text}>{t("disclaimer")}</Text>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
  },
  inner: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  icon: {
    fontSize: 14,
    marginTop: 2,
  },
  text: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
});

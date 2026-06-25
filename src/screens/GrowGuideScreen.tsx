import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { GlassCard } from "../components/GlassCard";
import { Disclaimer } from "../components/Disclaimer";
import { MicrogreenIcon } from "../components/MicrogreenIcon";
import { useI18n } from "../i18n";
import { microgreens } from "../data/microgreens";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import type { LibraryStackParamList } from "../navigation/AppNavigator";

type GrowRoute = RouteProp<LibraryStackParamList, "GrowGuide">;

const STEP_KEYS = ["step1", "step2", "step3", "step4", "step5", "step6"] as const;

const STEP_DESC_KEYS = ["grow_step1", "grow_step2", "grow_step3", "grow_step4", "grow_step5", "grow_step6"] as const;

const REQ_CARDS = [
  { key: "seed", icon: "🌱" },
  { key: "medium", icon: "🪴" },
  { key: "watering", icon: "💧" },
  { key: "sunlight", icon: "☀️" },
  { key: "harvest", icon: "📅" },
] as const;

export function GrowGuideScreen() {
  const { t, localized, tField } = useI18n();
  const route = useRoute<GrowRoute>();
  const { id } = route.params;

  const micro = microgreens[id];

  // Staggered step entry
  const stepAnimValues = useRef(
    STEP_KEYS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = stepAnimValues.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 30,
        delay: 150 + i * 100,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, []);

  if (!micro) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t("microgreen_not_found")}</Text>
      </View>
    );
  }

  const grow = tField(micro, "grow") as Record<string, string>;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Hero card */}
      <GlassCard style={styles.heroCard}>
        <View style={styles.heroBgDeco} />
        <View style={styles.heroInner}>
          <MicrogreenIcon microgreenId={micro.id} size={56} color={Colors.primary} />
          <View>
            <Text style={styles.heroLabel}>{t("grow_guide")}</Text>
            <Text style={styles.heroName}>
              {localized(micro.name, micro.nameTe)}
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* Requirements — horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.reqScroll}
        contentContainerStyle={styles.reqScrollContent}
      >
        {REQ_CARDS.map((r) => (
          <GlassCard key={r.key} style={styles.reqCard} padded={false}>
            <View style={styles.reqInner}>
              <View style={styles.reqIconBox}>
                <Text style={styles.reqIcon}>{r.icon}</Text>
              </View>
              <Text style={styles.reqLabel}>{t(r.key)}</Text>
              <Text style={styles.reqValue}>{grow[r.key]}</Text>
            </View>
          </GlassCard>
        ))}
      </ScrollView>

      {/* Process */}
      <Text style={styles.processTitle}>{t("process")}</Text>
      <View style={styles.processList}>
        {/* Connecting line */}
        <View style={styles.connectingLine} />

        {STEP_KEYS.map((k, i) => (
          <Animated.View
            key={k}
            style={{
              opacity: stepAnimValues[i],
              transform: [
                {
                  translateX: stepAnimValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}
          >
            <GlassCard style={styles.processCard} padded={false}>
              <View style={styles.processInner}>
                <View style={styles.stepNumber}>
                  <LinearGradient
                    colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.stepNumberBg}
                  >
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </LinearGradient>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{t(k)}</Text>
                  <Text style={styles.stepDesc}>{t(STEP_DESC_KEYS[i] as "step1_desc")}</Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>

      <View style={{ marginTop: 24 }}>
        <Disclaimer />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 48,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
  errorText: { fontSize: FontSize.lg, color: Colors.destructive },

  // Hero
  heroCard: { position: "relative", overflow: "hidden", marginBottom: 20 },
  heroBgDeco: {
    position: "absolute",
    top: -24,
    right: -24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(46,158,90,0.08)",
  },
  heroInner: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
  heroEmoji: { fontSize: 56 },
  heroLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.primary,
  },
  heroName: { fontSize: 24, fontWeight: "700", color: Colors.foreground },

  // Requirements
  reqScroll: { marginBottom: 24, marginLeft: -16 },
  reqScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  reqCard: { width: 140, flexShrink: 0 },
  reqInner: { padding: 14, gap: 6 },
  reqIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  reqIcon: { fontSize: 16 },
  reqLabel: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    fontWeight: "500",
  },
  reqValue: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.foreground,
    lineHeight: 18,
  },

  // Process
  processTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 16,
  },
  processList: {
    gap: 10,
    position: "relative",
  },
  connectingLine: {
    position: "absolute",
    left: 20,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  processCard: {},
  processInner: {
    flexDirection: "row",
    gap: 14,
    padding: 16,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    flexShrink: 0,
    zIndex: 1,
  },
  stepNumberBg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    color: Colors.primaryForeground,
    fontWeight: "800",
    fontSize: FontSize.lg,
  },
  stepContent: { flex: 1, gap: 4 },
  stepTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  stepDesc: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },
});

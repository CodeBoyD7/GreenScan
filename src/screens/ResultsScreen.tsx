import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlassCard } from "../components/GlassCard";
import { Pill } from "../components/Pill";
import { GradientText } from "../components/GradientText";
import { AnimatedCounter } from "../components/AnimatedCounter";
import { Disclaimer } from "../components/Disclaimer";
import { MicrogreenIcon } from "../components/MicrogreenIcon";
import { useI18n } from "../i18n";
import {
  microgreens,
  concernToMicrogreen,
  concernLabels,
  type HealthConcernId,
} from "../data/microgreens";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import type { ScanStackParamList } from "../navigation/AppNavigator";

type ResultsRoute = RouteProp<ScanStackParamList, "Results">;
type Nav = NativeStackNavigationProp<ScanStackParamList>;

export function ResultsScreen() {
  const { t, localized, tField } = useI18n();
  const nav = useNavigation<Nav>();
  const route = useRoute<ResultsRoute>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [paramsConcern, setParamsConcern] = useState<string | null>(
    route.params?.concern || null
  );
  const [loaded, setLoaded] = useState(false);

  // ── Entry animations ──
  const heroAnim = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const infoAnimations = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (!route.params?.concern) {
      (async () => {
        const raw = await AsyncStorage.getItem("gs_assessment");
        if (raw) {
          const parsed = JSON.parse(raw);
          setParamsConcern(parsed.concern);
        } else {
          nav.navigate("ScanMain");
          return;
        }
        setLoaded(true);
      })();
    } else {
      setLoaded(true);
    }
  }, []);

  // Run entry animations when loaded
  useEffect(() => {
    if (!loaded || !paramsConcern) return;

    Animated.parallel([
      // Hero card: slide up + fade
      Animated.spring(heroAnim, {
        toValue: 1,
        friction: 9,
        tension: 40,
        useNativeDriver: true,
      }),
      // Score card
      Animated.spring(scoreAnim, {
        toValue: 1,
        friction: 9,
        tension: 40,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Info cards: staggered
    const staggered = infoAnimations.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 35,
        delay: 300 + i * 150,
        useNativeDriver: true,
      })
    );
    Animated.parallel(staggered).start();
  }, [loaded, paramsConcern]);

  if (!loaded || !paramsConcern) return null;

  const concern = concernLabels[paramsConcern as HealthConcernId];
  const microId = concernToMicrogreen[paramsConcern as HealthConcernId];
  const micro = microgreens[microId];
  const benefits = tField(micro, "benefits") as string[];
  const consume = tField(micro, "consume") as string[];
  const score = 88;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerIcon}>✨</Text>
        <Text style={styles.headerText}>{t("your_report")}</Text>
      </View>

      <GradientText style={styles.title}>{t("recommended")}</GradientText>

      {/* Hero + Score */}
      <View style={styles.heroStack}>
        <Animated.View
          style={{
            opacity: heroAnim,
            transform: [
              {
                translateY: heroAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          }}
        >
          <GlassCard style={styles.heroCard}>
            <View style={styles.heroBgBlur} />
            <View style={styles.concernBadge}>
              <Text style={styles.concernBadgeText}>
                {concern.emoji} {localized(concern.en, concern.te)}
              </Text>
            </View>
            <View style={styles.heroContent}>
              <MicrogreenIcon microgreenId={micro.id} size={64} color={Colors.primary} />
              <View style={styles.heroInfo}>
                <Text style={styles.heroName}>
                  {localized(micro.name, micro.nameTe)}
                </Text>
                <View style={styles.pills}>
                  <Pill icon="⏱" label={`${t("growth_time")}: ${tField(micro, "growthTime")}`} />
                  <Pill icon="🍴" label={`${t("daily_intake")}: ${tField(micro, "dailyIntake")}`} />
                </View>
              </View>
            </View>
            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => nav.navigate("ScanMain")}
                style={styles.heroBtnSecondary}
              >
                <Text style={styles.heroBtnSecondaryText}>🔄 {t("scan_again")}</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Animated.View>

        {/* Score card */}
        <Animated.View
          style={{
            opacity: scoreAnim,
            transform: [
              {
                translateY: scoreAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <GlassCard style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{t("health_score")}</Text>
            <AnimatedCounter
              from={0}
              to={score}
              duration={1500}
              style={styles.scoreValue}
            />
            <Text style={styles.scoreUnit}>/100</Text>
            <ScoreBar value={score} />
          </GlassCard>
        </Animated.View>
      </View>

      {/* Info cards */}
      {[
        { emoji: "💚", title: t("benefits"), items: benefits, bullet: "✓" },
        { emoji: "🍽️", title: t("how_consume"), items: consume, bullet: "•" },
        { emoji: "✨", title: t("why"), items: null, bullet: "" },
      ].map((section, i) => (
        <Animated.View
          key={section.title}
          style={{
            opacity: infoAnimations[i],
            transform: [
              {
                translateY: infoAnimations[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [25, 0],
                }),
              },
            ],
          }}
        >
          <GlassCard style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoEmoji}>{section.emoji}</Text>
              <Text style={styles.infoTitle}>{section.title}</Text>
            </View>
            {section.items ? (
              (section.items as string[]).map((item: string, j: number) => (
                <View key={j} style={styles.benefitRow}>
                  <Text style={styles.benefitBullet}>{section.bullet}</Text>
                  <Text style={styles.benefitText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.whyText}>{t("why_text")}</Text>
            )}
          </GlassCard>
        </Animated.View>
      ))}

      <View style={styles.disclaimerWrapper}>
        <Disclaimer />
      </View>
    </ScrollView>
  );
}

// Animated score bar
function ScoreBar({ value }: { value: number }) {
  const barAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(barAnim, {
      toValue: value,
      friction: 8,
      tension: 35,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.scoreTrack}>
      <Animated.View
        style={[
          styles.scoreFill,
          {
            width: barAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 48,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  headerIcon: { fontSize: 14 },
  headerText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    fontWeight: "500",
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },

  // Hero
  heroStack: { gap: 16, marginBottom: 16 },
  heroCard: { position: "relative", overflow: "hidden" },
  heroBgBlur: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  concernBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(46,158,90,0.1)",
    marginBottom: 12,
  },
  concernBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  heroContent: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  heroEmoji: { fontSize: 56 },
  heroInfo: { flex: 1, gap: 8 },
  heroName: { fontSize: 24, fontWeight: "700", color: Colors.foreground },
  pills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
  },
  heroBtnSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  heroBtnSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.foreground,
  },

  // Score
  scoreCard: { alignItems: "center", paddingVertical: 28 },
  scoreLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.mutedForeground,
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 56,
    fontWeight: "800",
    color: Colors.primary,
  },
  scoreUnit: {
    fontSize: FontSize.xl,
    color: Colors.mutedForeground,
    fontWeight: "500",
    marginBottom: 12,
  },
  scoreTrack: {
    width: "80%",
    height: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
  },
  scoreFill: {
    height: "100%",
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
  },

  // Info cards
  infoCard: { marginBottom: 12, gap: 6 },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  infoEmoji: { fontSize: 22 },
  infoTitle: { fontSize: FontSize.lg, fontWeight: "700", color: Colors.foreground },
  benefitRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    paddingVertical: 2,
  },
  benefitBullet: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: "700",
    marginTop: 1,
  },
  benefitText: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    lineHeight: 20,
    flex: 1,
  },
  whyText: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    lineHeight: 22,
  },
  disclaimerWrapper: { marginTop: 8 },
});

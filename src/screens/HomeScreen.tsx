import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { GlassCard } from "../components/GlassCard";
import { GradientText } from "../components/GradientText";
import { PressableCard } from "../components/PressableCard";
import { MicrogreenIcon } from "../components/MicrogreenIcon";
import { HeartIcon, HomeIcon, CheckIcon, ArrowRightIcon } from "../components/Icons";
import { useI18n } from "../i18n";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import { microgreens } from "../data/microgreens";
import type { HomeStackParamList } from "../navigation/AppNavigator";

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const FEATURED_IDS = ["fenugreek", "broccoli", "pea", "radish"];

const FEATURES = [
  { icon: "heart", key: "personalized" as const },
  { icon: "home", key: "grow" as const },
  { icon: "check", key: "free" as const },
];

const STEPS = [
  { n: "01", key: "step1" as const },
  { n: "02", key: "step2" as const },
  { n: "03", key: "step3" as const },
];

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  heart: <HeartIcon size={24} color="#fff" />,
  home: <HomeIcon size={24} color="#fff" />,
  check: <CheckIcon size={24} color="#fff" />,
};

export function HomeScreen() {
  const { t, localized, tField } = useI18n();
  const nav = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const featured = FEATURED_IDS.map((id) => microgreens[id]);
  const [refreshing, setRefreshing] = useState(false);

  // ── Entry animations ──
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroSlide = useRef(new Animated.Value(30)).current;
  const staggerValues = useRef(
    Array.from({ length: featured.length + FEATURES.length + STEPS.length }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Hero entry
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(heroSlide, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered cards (with delay between each)
    const animations = staggerValues.map((val, i) =>
      Animated.spring(val, {
        toValue: 1,
        friction: 8,
        tension: 30,
        delay: 200 + i * 100,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, []);

  // ── Pull to refresh ──
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Reset and replay stagger
    staggerValues.forEach((v) => v.setValue(0));
    const animations = staggerValues.map((val, i) =>
      Animated.spring(val, {
        toValue: 1,
        friction: 8,
        tension: 30,
        delay: i * 80,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  // ── Navigation helpers ──
  const goToScan = () => {
    Haptics.selectionAsync();
    (nav as any).navigate("ScanTab");
  };
  const goToLibrary = () => {
    Haptics.selectionAsync();
    (nav as any).navigate("LibraryTab");
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* ── HERO ── */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={[Colors.gradientHeroStart, Colors.gradientHeroMid, Colors.gradientHeroEnd]}
          style={styles.heroBg}
        />
        <View style={[styles.blob, styles.blobTopRight]} />
        <View style={[styles.blob, styles.blobBottomLeft]} />

        <Animated.View
          style={[
            styles.heroInner,
            { opacity: heroOpacity, transform: [{ translateY: heroSlide }] },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeIcon}>✨</Text>
            <Text style={styles.badgeText}>{t("made_for_india")}</Text>
          </View>

          <GradientText
            style={[styles.heroTitle, isTablet && ({ fontSize: 56 } as any)]}
          >
            {t("hero_title")}
          </GradientText>

          <Text style={[styles.heroSub, isTablet && { fontSize: 24 }]}>
            {t("hero_subtitle")}
          </Text>

          <Text style={styles.heroDesc}>{t("hero_desc")}</Text>

          <View style={styles.ctaRow}>
            <TouchableOpacity activeOpacity={0.9} onPress={goToScan} style={styles.ctaPrimary}>
              <LinearGradient
                colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ctaGradient}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={styles.ctaPrimaryText}>{t("cta_scan")}</Text>
                  <ArrowRightIcon size={16} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={goToLibrary} style={styles.ctaSecondary}>
              <Text style={styles.ctaSecondaryText}>{t("cta_explore")}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Featured microgreens grid */}
        <View style={styles.featuredGrid}>
          {featured.map((m, i) => (
            <Animated.View
              key={m.id}
              style={{
                width: "47%",
                opacity: staggerValues[i],
                transform: [
                  {
                    translateY: staggerValues[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              }}
            >
              <PressableCard onPress={goToLibrary} haptic>
                <View style={styles.featuredCard}>
                  <MicrogreenIcon microgreenId={m.id} size={32} color={Colors.primary} />
                  <Text style={styles.featuredName}>
                    {localized(m.name, m.nameTe).split(" ")[0]}
                  </Text>
                  <Text style={styles.featuredTime}>{tField(m, "growthTime")}</Text>
                </View>
              </PressableCard>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── FEATURES ── */}
      <View style={styles.section}>
        <View style={isTablet ? styles.featuresGridTablet : styles.featuresGrid}>
          {FEATURES.map((f, i) => (
            <Animated.View
              key={f.key}
              style={{
                opacity: staggerValues[featured.length + i],
                transform: [
                  {
                    translateY: staggerValues[featured.length + i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
              <PressableCard>
                <GlassCard style={styles.featureCard}>
                  <View style={styles.featureIconBox}>
                    {FEATURE_ICONS[f.icon]}
                  </View>
                  <Text style={styles.featureTitle}>
                    {t(`feat_${f.key}` as any)}
                  </Text>
                  <Text style={styles.featureDesc}>
                    {t(`feat_${f.key}_d` as any)}
                  </Text>
                </GlassCard>
              </PressableCard>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── HOW IT WORKS ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("how_works")}</Text>
          <Text style={styles.sectionDesc}>{t("how_works_d")}</Text>
        </View>
        <View style={styles.stepsGrid}>
          {STEPS.map((s, i) => (
            <Animated.View
              key={s.n}
              style={{
                opacity: staggerValues[featured.length + FEATURES.length + i],
                transform: [
                  {
                    translateY:
                      staggerValues[featured.length + FEATURES.length + i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                  },
                ],
              }}
            >
              <GlassCard style={styles.stepCard}>
                <GradientText style={styles.stepNumber}>{s.n}</GradientText>
                <Text style={styles.stepTitle}>
                  {t(`${s.key}_title` as any)}
                </Text>
                <Text style={styles.stepDesc}>
                  {t(`${s.key}_desc` as any)}
                </Text>
              </GlassCard>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* ── CTA STRIP ── */}
      <View style={styles.section}>
        <TouchableOpacity activeOpacity={0.9} onPress={goToScan}>
          <LinearGradient
            colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaStrip}
          >
            <Text style={styles.ctaStripTitle}>{t("cta_scan")}</Text>
            <Text style={styles.ctaStripDesc}>{t("hero_desc")}</Text>
            <View style={styles.ctaStripButton}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={styles.ctaStripButtonText}>{t("cta_scan")}</Text>
                <ArrowRightIcon size={14} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        <View style={styles.footerBrand}>
          <View style={styles.footerLogo}>
            <Text style={styles.footerLogoText}>🌱</Text>
          </View>
          <Text style={styles.footerBrandText}>{t("brand")}</Text>
        </View>
        <Text style={styles.footerText}>{t("footer")}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingBottom: 40,
  },

  // Hero
  heroSection: {
    position: "relative",
    overflow: "hidden",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  heroBg: {
    position: "absolute",
    inset: 0,
  },
  blob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.25,
  },
  blobTopRight: {
    top: -60,
    right: -60,
    backgroundColor: Colors.primaryGlow,
  },
  blobBottomLeft: {
    bottom: -60,
    left: -60,
    backgroundColor: Colors.primary,
  },
  heroInner: {
    gap: 12,
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  badgeIcon: { fontSize: 12 },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  heroSub: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.foreground,
    opacity: 0.8,
  },
  heroDesc: {
    fontSize: FontSize.lg,
    color: Colors.mutedForeground,
    lineHeight: 24,
    maxWidth: 360,
  },
  ctaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 8,
  },
  ctaPrimary: {
    borderRadius: BorderRadius.round,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 6,
  },
  ctaGradient: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaPrimaryText: {
    color: Colors.primaryForeground,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },
  ctaSecondary: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  ctaSecondaryText: {
    color: Colors.foreground,
    fontSize: FontSize.lg,
    fontWeight: "600",
  },

  // Featured grid
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  featuredCard: {
    backgroundColor: Colors.glassBackground,
    borderRadius: BorderRadius.xxl,
    padding: 20,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
  },
  featuredEmoji: { fontSize: 40, marginBottom: 6 },
  featuredName: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.foreground,
  },
  featuredTime: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },

  // Features
  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.foreground,
    textAlign: "center",
  },
  sectionDesc: {
    fontSize: FontSize.lg,
    color: Colors.mutedForeground,
    textAlign: "center",
  },
  featuresGrid: {
    gap: 14,
  },
  featuresGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  featureCard: {
    gap: 8,
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  featureIcon: { fontSize: 22 },
  featureTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  featureDesc: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },

  // Steps
  stepsGrid: {
    gap: 14,
  },
  stepCard: {
    gap: 6,
  },
  stepNumber: {
    fontSize: 40,
    fontWeight: "900",
    opacity: 0.4,
  },
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

  // CTA Strip
  ctaStrip: {
    borderRadius: BorderRadius.xxl,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  ctaStripTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primaryForeground,
    textAlign: "center",
  },
  ctaStripDesc: {
    fontSize: FontSize.md,
    color: Colors.primaryForeground,
    opacity: 0.8,
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
  },
  ctaStripButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.background,
  },
  ctaStripButtonText: {
    color: Colors.foreground,
    fontSize: FontSize.lg,
    fontWeight: "700",
  },

  // Footer
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerLogo: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogoText: { fontSize: 16 },
  footerBrandText: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  footerText: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },
});

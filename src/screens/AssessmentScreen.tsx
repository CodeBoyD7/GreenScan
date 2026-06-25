import React, { useState, useRef, useEffect, useCallback } from "react";
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
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { GlassCard } from "../components/GlassCard";
import { AnimatedProgress } from "../components/AnimatedProgress";
import { Disclaimer } from "../components/Disclaimer";
import { useI18n } from "../i18n";
import {
  ageGroups,
  concernLabels,
  type HealthConcernId,
} from "../data/microgreens";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import type { ScanStackParamList } from "../navigation/AppNavigator";

type Nav = NativeStackNavigationProp<ScanStackParamList>;

const GENDER_OPTIONS = [
  { id: "male", labelKey: "male" as const, emoji: "👨" },
  { id: "female", labelKey: "female" as const, emoji: "👩" },
  { id: "na", labelKey: "prefer_not" as const, emoji: "🧑" },
];

const TOTAL_STEPS = 3;

export function AssessmentScreen() {
  const { t, localized } = useI18n();
  const nav = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;

  const [step, setStep] = useState(0);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [concern, setConcern] = useState<HealthConcernId | "">("");
  const [submitting, setSubmitting] = useState(false);

  // ── Animations ──
  const slideAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const direction = useRef(1); // 1=forward, -1=backward
  const isAnimating = useRef(false);
  const [stepKey, setStepKey] = useState(0); // forces re-mount of animated content

  const canNext =
    (step === 0 && age !== "") ||
    (step === 1 && gender !== "") ||
    (step === 2 && concern !== "");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  // Mount entry — slide in from right
  useEffect(() => {
    slideAnim.setValue(0);
    Animated.spring(slideAnim, {
      toValue: 1,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [stepKey]);

  // Submit glow pulse
  useEffect(() => {
    if (submitting) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    } else {
      glowAnim.setValue(0);
    }
  }, [submitting]);

  // ── Step navigation ──
  const animateToStep = useCallback(
    (newStep: number, dir: number) => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      direction.current = dir;

      // Exit: fade out + slide in direction
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start(() => {
        setStep(newStep);
        setStepKey((k) => k + 1);
        slideAnim.setValue(0);
        // Enter: spring in from opposite side
        Animated.spring(slideAnim, {
          toValue: 1,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }).start(() => {
          isAnimating.current = false;
        });
      });
    },
    [slideAnim]
  );

  const goNext = useCallback(() => {
    if (step < 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateToStep(step + 1, 1);
    }
  }, [step, animateToStep]);

  const goBack = useCallback(() => {
    if (step > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateToStep(step - 1, -1);
    }
  }, [step, animateToStep]);

  const handleSubmit = useCallback(async () => {
    if (!concern || submitting) return;
    setSubmitting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Brief delay to show the glow, then animate out
    await new Promise((r) => setTimeout(r, 600));
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(async () => {
      await AsyncStorage.setItem(
        "gs_assessment",
        JSON.stringify({ age, gender, concern })
      );
      setSubmitting(false);
      nav.navigate("Results", { age, gender, concern });
    });
  }, [concern, age, gender, submitting, nav, slideAnim]);

  // ── Option selection ──
  const selectAge = (v: string) => {
    Haptics.selectionAsync();
    setAge(v);
    // Auto-advance after a brief moment
    setTimeout(() => goNext(), 300);
  };

  const selectGender = (v: string) => {
    Haptics.selectionAsync();
    setGender(v);
    setTimeout(() => goNext(), 300);
  };

  const selectConcern = (v: HealthConcernId) => {
    Haptics.selectionAsync();
    setConcern(v);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>
            {t("step")} {step + 1} {t("of")} {TOTAL_STEPS}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <AnimatedProgress progress={progress} />
      </View>

      {/* Step content */}
      <GlassCard style={styles.card}>
        <Animated.View
          key={stepKey}
          style={{
            opacity: slideAnim,
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [direction.current * 25, 0],
                }),
              },
            ],
          }}
        >
          {step === 0 && (
            <>
              <Text style={styles.question}>{t("age_group")}</Text>
              <View
                style={
                  isTablet ? styles.optionsGridTablet : styles.optionsGrid
                }
              >
                {ageGroups.map((a) => (
                  <OptionButton
                    key={a.id}
                    selected={age === a.id}
                    onPress={() => selectAge(a.id)}
                    label={localized(a.en, a.te)}
                  />
                ))}
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.question}>{t("gender")}</Text>
              <View style={styles.genderGrid}>
                {GENDER_OPTIONS.map((g) => (
                  <OptionButton
                    key={g.id}
                    selected={gender === g.id}
                    onPress={() => selectGender(g.id)}
                    label={t(g.labelKey)}
                    emoji={g.emoji}
                  />
                ))}
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.question}>{t("concern")}</Text>
              <View
                style={
                  isTablet ? styles.optionsGridTablet : styles.optionsGrid
                }
              >
                {(Object.keys(concernLabels) as HealthConcernId[]).map(
                  (id) => {
                    const c = concernLabels[id];
                    return (
                      <OptionButton
                        key={id}
                        selected={concern === id}
                        onPress={() => selectConcern(id)}
                        label={localized(c.en, c.te)}
                        emoji={c.emoji}
                      />
                    );
                  }
                )}
              </View>
            </>
          )}
        </Animated.View>

        {/* Navigation buttons */}
        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={goBack}
            disabled={step === 0 || isAnimating.current}
            style={[
              styles.navBack,
              step === 0 && styles.navDisabled,
            ]}
          >
            <Text style={styles.navBackText}>← {t("back")}</Text>
          </TouchableOpacity>

          {step < 2 ? (
            <TouchableOpacity
              onPress={goNext}
              disabled={!canNext || isAnimating.current}
              style={[
                styles.navPrimaryWrap,
                (!canNext || isAnimating.current) && styles.navDisabled,
              ]}
            >
              <LinearGradient
                colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.navGradient}
              >
                <Text style={styles.navPrimaryText}>
                  {t("next")} →
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!canNext || submitting}
              style={styles.navPrimaryWrap}
            >
              <Animated.View
                style={[
                  StyleSheet.absoluteFill,
                  styles.submitGlow,
                  {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 0.5],
                    }),
                  },
                ]}
              />
              <LinearGradient
                colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.navGradient,
                  styles.navSubmitGradient,
                  !canNext && { opacity: 0.5 },
                ]}
              >
                <Text style={styles.navPrimaryText}>
                  {submitting ? "✨" : ""} {t("get_recommendation")} →
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </GlassCard>

      <View style={styles.disclaimerWrapper}>
        <Disclaimer />
      </View>
    </ScrollView>
  );
}

// ── Option button with press animation ──
function OptionButton({
  selected,
  onPress,
  label,
  emoji,
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
  emoji?: string;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.optionCard,
        selected && styles.optionCardSelected,
      ]}
    >
      <Animated.View
        style={[
          styles.optionInner,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {emoji ? <Text style={styles.optionEmoji}>{emoji}</Text> : null}
        <Text
          style={[
            styles.optionLabel,
            selected && styles.optionLabelSelected,
          ]}
          numberOfLines={2}
        >
          {label}
        </Text>
        {selected ? (
          <View style={styles.optionCheck}>
            <Text style={styles.optionCheckText}>✓</Text>
          </View>
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Styles ──
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 48,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },

  // Progress
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.mutedForeground,
  },
  progressPercent: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.mutedForeground,
  },

  // Card
  card: {
    marginBottom: 16,
    overflow: "hidden",
  },
  question: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 20,
  },
  optionsGrid: {
    gap: 10,
  },
  optionsGridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  genderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  // Option
  optionCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(46,158,90,0.06)",
  },
  optionInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
  },
  optionEmoji: {
    fontSize: 22,
  },
  optionLabel: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: "500",
    color: Colors.foreground,
  },
  optionLabelSelected: {
    fontWeight: "700",
  },
  optionCheck: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  optionCheckText: {
    color: Colors.primaryForeground,
    fontSize: 14,
    fontWeight: "700",
  },

  // Nav
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },
  navBack: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  navBackText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.foreground,
  },
  navDisabled: {
    opacity: 0.4,
  },
  navPrimaryWrap: {
    flex: 1,
    borderRadius: BorderRadius.round,
    overflow: "hidden",
    position: "relative",
  },
  navGradient: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    alignItems: "center",
  },
  navSubmitGradient: {},
  navPrimaryText: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.primaryForeground,
  },
  submitGlow: {
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primaryGlow,
    zIndex: 0,
  },

  disclaimerWrapper: {
    marginTop: 8,
  },
});

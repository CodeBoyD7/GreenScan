import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GlassCard } from "../components/GlassCard";
import { GradientText } from "../components/GradientText";
import { PressableCard } from "../components/PressableCard";
import { MicrogreenIcon } from "../components/MicrogreenIcon";
import { ArrowRightIcon } from "../components/Icons";
import { useI18n } from "../i18n";
import { microgreens } from "../data/microgreens";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import type { LibraryStackParamList } from "../navigation/AppNavigator";

type Nav = NativeStackNavigationProp<LibraryStackParamList>;

export function MicrogreensScreen() {
  const { t, localized, tField } = useI18n();
  const nav = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const list = Object.values(microgreens);

  // Staggered entry
  const staggerValues = useRef(
    list.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = staggerValues.map((anim, i) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 30,
        delay: 100 + i * 80,
        useNativeDriver: true,
      })
    );
    Animated.parallel(animations).start();
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.headerSection}>
        <GradientText style={styles.title}>{t("all_micro")}</GradientText>
        <Text style={styles.desc}>{t("all_micro_d")}</Text>
      </View>

      {/* Grid */}
      <View style={[styles.grid, isTablet && styles.gridTablet]}>
        {list.map((m, i) => (
          <Animated.View
            key={m.id}
            style={[
              isTablet ? { width: "48%" } : { width: "100%" },
              {
                opacity: staggerValues[i],
                transform: [
                  {
                    translateY: staggerValues[i].interpolate({
                      inputRange: [0, 1],
                      outputRange: [25, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <PressableCard
              onPress={() => nav.navigate("GrowGuide", { id: m.id })}
              haptic
            >
              <GlassCard style={styles.microCard} padded={false}>
                <View style={styles.microCardInner}>
                  <View style={styles.microHeader}>
                    <MicrogreenIcon microgreenId={m.id} size={40} color={Colors.primary} />
                    <View style={styles.microTime}>
                      <Text style={styles.microTimeText}>⏱ {tField(m, "growthTime")}</Text>
                    </View>
                  </View>
                  <Text style={styles.microName}>
                    {localized(m.name, m.nameTe)}
                  </Text>
                  <Text style={styles.microBenefits} numberOfLines={2}>
                    {(tField(m, "benefits") as string[]).slice(0, 2).join(" · ")}
                  </Text>
                  <View style={styles.microLink}>
                    <Text style={styles.microLinkText}>{t("learn_more")}</Text>
                    <ArrowRightIcon size={12} color={Colors.primary} />
                  </View>
                </View>
              </GlassCard>
            </PressableCard>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 48,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  headerSection: { marginBottom: 20, gap: 8 },
  title: { fontSize: 32, fontWeight: "700" },
  desc: {
    fontSize: FontSize.lg,
    color: Colors.mutedForeground,
    lineHeight: 22,
    maxWidth: 400,
  },
  grid: { gap: 12 },
  gridTablet: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  microCard: {},
  microCardInner: { padding: 20, gap: 8 },
  microHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  microEmoji: { fontSize: 44 },
  microTime: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  microTimeText: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
    fontWeight: "600",
  },
  microName: { fontSize: FontSize.xl, fontWeight: "700", color: Colors.foreground },
  microBenefits: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    lineHeight: 20,
    marginBottom: 4,
  },
  microLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  microLinkText: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.primary,
  },

});

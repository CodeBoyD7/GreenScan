import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { GlassCard } from "../components/GlassCard";
import { GradientText } from "../components/GradientText";
import { FlameIcon, CheckIcon, FoodIcon, StarIcon, ArrowDownIcon, ArrowUpIcon, TrendingUpIcon, ClockIcon } from "../components/Icons";
import { MicrogreenIcon } from "../components/MicrogreenIcon";
import { Disclaimer } from "../components/Disclaimer";
import { useI18n } from "../i18n";
import { Colors, BorderRadius, FontSize, Spacing } from "../theme/colors";
import {
  getStreak,
  getTotalCompleted,
  getTodaysMeals,
  getMeals,
  getWeeklyCompletion,
} from "../services/MealTracker";
import { microgreens } from "../data/microgreens";

export function DashboardScreen() {
  const { t, localized } = useI18n();
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<{ date: string; count: number }[]>([]);
  const [topMicrogreens, setTopMicrogreens] = useState<{ id: string; name: string; count: number }[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const loadData = useCallback(async () => {
    setStreak(await getStreak());
    setTotal(await getTotalCompleted());
    setTodayCount((await getTodaysMeals()).length);
    setWeeklyData(await getWeeklyCompletion());

    const meals = await getMeals();
    const countMap: Record<string, number> = {};
    meals.filter(m => m.completed).forEach(m => {
      countMap[m.microgreen] = (countMap[m.microgreen] || 0) + 1;
    });
    const sorted = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => {
        const m = microgreens[id];
        return { id, name: m ? localized(m.name, m.nameTe).split(" ")[0] : id, count };
      });
    setTopMicrogreens(sorted);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const maxDaily = Math.max(1, ...weeklyData.map(d => d.count));
  const dayLabels = weeklyData.map((d) => {
    const day = new Date(d.date + "T00:00:00").getDay();
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];
  });

  const daysWithMeals = weeklyData.filter(d => d.count > 0).length;
  const completionRate = Math.round((daysWithMeals / 7) * 100);
  const totalWeeklyMeals = weeklyData.reduce((sum, d) => sum + d.count, 0);
  const dailyAvg = (totalWeeklyMeals / 7).toFixed(1);
  const isImproving = weeklyData.length >= 2 && weeklyData[weeklyData.length - 1].count >= weeklyData[weeklyData.length - 2].count;
  const hasData = totalWeeklyMeals > 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <GradientText style={styles.title}>{t("dash_title")}</GradientText>
      </View>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: Colors.primary }]}>
            <FlameIcon size={16} color="#fff" />
          </View>
          <View style={styles.kpiBody}>
            <Text style={styles.kpiValue}>{streak}</Text>
            <Text style={styles.kpiLabel}>{t("day_streak")}</Text>
          </View>
        </View>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: Colors.chart5 }]}>
            <CheckIcon size={16} color="#fff" />
          </View>
          <View style={styles.kpiBody}>
            <Text style={styles.kpiValue}>{total}</Text>
            <Text style={styles.kpiLabel}>{t("meals_tracked")}</Text>
          </View>
        </View>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: Colors.chart2 }]}>
            <FoodIcon size={16} color="#fff" />
          </View>
          <View style={styles.kpiBody}>
            <Text style={styles.kpiValue}>{todayCount}</Text>
            <Text style={styles.kpiLabel}>{t("today_label")}</Text>
          </View>
        </View>
        <View style={styles.kpiCard}>
          <View style={[styles.kpiIconBox, { backgroundColor: Colors.chart3 }]}>
            <StarIcon size={16} color="#fff" />
          </View>
          <View style={styles.kpiBody}>
            <Text style={styles.kpiValue}>{completionRate}%</Text>
            <Text style={styles.kpiLabel}>{t("this_week")}</Text>
          </View>
        </View>
      </View>

      <GlassCard style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={styles.chartHeaderLeft}>
            <TrendingUpIcon size={16} color={Colors.primary} />
            <Text style={styles.chartTitle}>{t("this_week")}</Text>
          </View>
          {hasData && (
            <View style={[styles.trendBadge, isImproving ? styles.trendUp : styles.trendDown]}>
              <ArrowUpIcon size={10} color={isImproving ? Colors.primary : Colors.destructive} />
              <Text style={[styles.trendText, { color: isImproving ? Colors.primary : Colors.destructive }]}>
                {isImproving ? "+" : ""}{weeklyData.length >= 2 ? weeklyData[weeklyData.length - 1].count - weeklyData[weeklyData.length - 2].count : 0}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.chartArea}>
          <View style={styles.barsRow}>
            {weeklyData.map((d, i) => {
              const ratio = maxDaily > 0 ? d.count / maxDaily : 0;
              const opacity = ratio > 0 ? 0.4 + ratio * 0.6 : 0;
              return (
                <View key={d.date} style={styles.barCol}>
                  <Text style={[styles.barValue, ratio === 0 && styles.barValueZero]}>
                    {d.count}
                  </Text>
                  <View style={styles.barTrack}>
                    <AnimatedBar
                      height={d.count}
                      max={maxDaily}
                      color={Colors.primary}
                      opacity={opacity}
                      delay={i * 60}
                    />
                  </View>
                  <Text style={styles.barDay}>{dayLabels[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {hasData && (
          <View style={styles.chartFooter}>
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{totalWeeklyMeals}</Text>
              <Text style={styles.statPillLabel}>meals</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{dailyAvg}</Text>
              <Text style={styles.statPillLabel}>avg/day</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{completionRate}%</Text>
              <Text style={styles.statPillLabel}>completion</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillValue}>{daysWithMeals}/7</Text>
              <Text style={styles.statPillLabel}>days</Text>
            </View>
          </View>
        )}
      </GlassCard>

      {topMicrogreens.length > 0 && (
        <GlassCard style={styles.topCard}>
          <View style={styles.topHeader}>
            <StarIcon size={16} color={Colors.chart4} />
            <Text style={styles.topTitle}>{t("top_micro")}</Text>
          </View>
          <View style={styles.topList}>
            {topMicrogreens.map((m, i) => (
              <View key={m.id} style={styles.topRow}>
                <View style={[styles.topRank, i === 0 && styles.topRankGold]}>
                  <Text style={styles.topRankText}>{i + 1}</Text>
                </View>
                <MicrogreenIcon microgreenId={m.id} size={22} color={Colors.primary} />
                <Text style={styles.topName}>{m.name}</Text>
                <View style={styles.topCountWrap}>
                  <Text style={styles.topCount}>{m.count}</Text>
                  <Text style={styles.topCountUnit}>x</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
      )}

      <View style={styles.disclaimerWrap}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowDisclaimer(!showDisclaimer)}
          style={styles.disclaimerToggle}
        >
          <Text style={styles.disclaimerToggleText}>{t("disclaimer")}</Text>
          {showDisclaimer ? <ArrowUpIcon size={12} color={Colors.mutedForeground} /> : <ArrowDownIcon size={12} color={Colors.mutedForeground} />}
        </TouchableOpacity>
        {showDisclaimer && <Disclaimer />}
      </View>
    </ScrollView>
  );
}

function AnimatedBar({ height, max, delay, color, opacity }: { height: number; max: number; delay: number; color: string; opacity: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      tension: 35,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);
  const barHeight = max > 0 ? (height / max) * 100 : 0;
  return (
    <Animated.View
      style={[styles.barFill, {
        height: anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", `${barHeight}%`],
        }),
        backgroundColor: color,
        opacity,
      }]}
    />
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: 48,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  headerSection: { marginBottom: Spacing.lg },
  title: { fontSize: 28, fontWeight: "700" },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  kpiCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.sm + 4,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "48.5%",
    shadowColor: Colors.glassShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 2,
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiBody: { gap: 1 },
  kpiValue: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.foreground,
    lineHeight: 24,
  },
  kpiLabel: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    color: Colors.mutedForeground,
    textTransform: "lowercase",
  },

  chartCard: { marginBottom: Spacing.sm, padding: Spacing.md, gap: Spacing.sm },
  chartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chartHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  chartTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.round,
  },
  trendUp: { backgroundColor: "rgba(46,158,90,0.1)" },
  trendDown: { backgroundColor: "rgba(217,74,74,0.1)" },
  trendText: { fontSize: FontSize.xs, fontWeight: "700" },

  chartArea: {
    paddingTop: Spacing.xs,
  },
  barsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 96,
    gap: 4,
  },
  barCol: { flex: 1, alignItems: "center", gap: 3, height: "100%", justifyContent: "flex-end" },
  barValue: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.foreground,
  },
  barValueZero: { color: Colors.mutedForeground, opacity: 0.4 },
  barTrack: {
    width: "100%",
    height: 64,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: {
    width: "100%",
    borderRadius: BorderRadius.sm,
  },
  barDay: {
    fontSize: 8,
    fontWeight: "600",
    color: Colors.mutedForeground,
    marginTop: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  chartFooter: {
    flexDirection: "row",
    gap: Spacing.xs,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statPill: {
    flex: 1,
    alignItems: "center",
    gap: 1,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondary,
  },
  statPillValue: {
    fontSize: FontSize.sm,
    fontWeight: "800",
    color: Colors.foreground,
  },
  statPillLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: Colors.mutedForeground,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  topCard: { marginBottom: Spacing.sm, padding: Spacing.md, gap: Spacing.sm },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  topTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  topList: { gap: Spacing.sm },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  topRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
  topRankGold: {
    backgroundColor: "#FDE68A",
  },
  topRankText: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.foreground,
  },
  topName: { flex: 1, fontSize: FontSize.md, fontWeight: "600", color: Colors.foreground },
  topCountWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  topCount: {
    fontSize: FontSize.sm,
    fontWeight: "800",
    color: Colors.primary,
  },
  topCountUnit: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
    opacity: 0.6,
  },

  disclaimerWrap: { marginTop: Spacing.xs },
  disclaimerToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  disclaimerToggleText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.mutedForeground,
  },
});

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Colors, FontSize } from "../theme/colors";
import { useI18n } from "../i18n";
import { HomeIcon, ScanIcon, LeafIcon, TargetIcon, DashboardIcon } from "./Icons";

const TABS = [
  { name: "HomeTab", icon: HomeIcon, labelKey: "nav_home" },
  { name: "ScanTab", icon: ScanIcon, labelKey: "nav_assess" },
  { name: "DashboardTab", icon: DashboardIcon, labelKey: "nav_dashboard" },
  { name: "LibraryTab", icon: LeafIcon, labelKey: "nav_microgreens" },
  { name: "TrackingTab", icon: TargetIcon, labelKey: "nav_tracking" },
];

export function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={styles.inner}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TABS[index];
          if (!tab) return null;

          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = tab.icon;

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tab}
            >
              {isFocused ? (
                <View style={styles.activeIconWrap}>
                  <LinearGradient
                    colors={[Colors.gradientPrimaryStart, Colors.gradientPrimaryEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.activeIconBg}
                  >
                    <Icon size={20} color={Colors.primaryForeground} />
                  </LinearGradient>
                  <Text style={styles.activeLabel}>{t(tab.labelKey as any)}</Text>
                </View>
              ) : (
                <View style={styles.inactiveIconWrap}>
                  <Icon size={20} color={Colors.secondaryForeground} />
                  <Text style={styles.inactiveLabel}>{t(tab.labelKey as any)}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  inner: {
    flexDirection: "row",
    height: 60,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  activeIconWrap: {
    alignItems: "center",
    gap: 2,
  },
  activeIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
  activeLabel: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.primary,
  },
  inactiveIconWrap: {
    alignItems: "center",
    gap: 2,
  },
  inactiveLabel: {
    fontSize: FontSize.xs,
    fontWeight: "500",
    color: Colors.secondaryForeground,
  },
});

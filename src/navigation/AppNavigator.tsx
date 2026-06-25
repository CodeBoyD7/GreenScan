import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useI18n } from "../i18n";
import { Colors } from "../theme/colors";
import { TabBar } from "../components/TabBar";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

import { HomeScreen } from "../screens/HomeScreen";
import { AssessmentScreen } from "../screens/AssessmentScreen";
import { ResultsScreen } from "../screens/ResultsScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { MicrogreensScreen } from "../screens/MicrogreensScreen";
import { GrowGuideScreen } from "../screens/GrowGuideScreen";
import { TrackingScreen } from "../screens/TrackingScreen";

// ── Param lists ──
// NOTE: Stack screen names MUST differ from tab screen names to avoid
// "same name nested inside one another" warnings.
export type HomeStackParamList = {
  HomeMain: undefined;
};

export type ScanStackParamList = {
  ScanMain: undefined;
  Results: { age: string; gender: string; concern: string } | undefined;
};

export type LibraryStackParamList = {
  LibraryMain: undefined;
  GrowGuide: { id: string };
};

export type DashboardStackParamList = {
  DashboardMain: undefined;
};

export type TrackingStackParamList = {
  TrackingMain: undefined;
};

// Union type so screens can reference any route if needed
export type RootStackParamList = HomeStackParamList &
  ScanStackParamList &
  LibraryStackParamList &
  DashboardStackParamList &
  TrackingStackParamList;

// ── Tab navigator ──
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, animation: "fade" }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNav} />
      <Tab.Screen name="ScanTab" component={ScanStackNav} />
      <Tab.Screen name="DashboardTab" component={DashboardStackNav} />
      <Tab.Screen name="LibraryTab" component={LibraryStackNav} />
      <Tab.Screen name="TrackingTab" component={TrackingStackNav} />
    </Tab.Navigator>
  );
}

// ── Shared header options ──
function useSharedScreenOptions() {
  const insets = useSafeAreaInsets();
  return {
    headerStyle: {
      backgroundColor: Colors.card,
      elevation: 2,
      shadowOpacity: 0.1,
      shadowRadius: 3,
      shadowOffset: { width: 0, height: 2 },
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    headerTintColor: Colors.foreground,
    headerTitleStyle: { fontWeight: "700" as const, fontSize: 17 },
    headerShadowVisible: true,
    headerStatusBarHeight: Math.max(insets.top || 0, 20),
    contentStyle: { backgroundColor: Colors.background },
    headerRight: () => <LanguageSwitcher />,
  };
}

// ── Per-tab stacks ──
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackNav() {
  const { t } = useI18n();
  const opts = useSharedScreenOptions();
  return (
    <HomeStack.Navigator screenOptions={opts}>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ title: t("brand") }}
      />
    </HomeStack.Navigator>
  );
}

const ScanStack = createNativeStackNavigator<ScanStackParamList>();
function ScanStackNav() {
  const { t } = useI18n();
  const opts = useSharedScreenOptions();
  return (
    <ScanStack.Navigator screenOptions={opts}>
      <ScanStack.Screen
        name="ScanMain"
        component={AssessmentScreen}
        options={{ title: t("nav_assess") }}
      />
      <ScanStack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: t("recommended") }}
      />
    </ScanStack.Navigator>
  );
}

const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();
function LibraryStackNav() {
  const { t } = useI18n();
  const opts = useSharedScreenOptions();
  return (
    <LibraryStack.Navigator screenOptions={opts}>
      <LibraryStack.Screen
        name="LibraryMain"
        component={MicrogreensScreen}
        options={{ title: t("nav_microgreens") }}
      />
      <LibraryStack.Screen
        name="GrowGuide"
        component={GrowGuideScreen}
        options={{ title: t("grow_guide") }}
      />
    </LibraryStack.Navigator>
  );
}

const TrackingStack = createNativeStackNavigator<TrackingStackParamList>();
function TrackingStackNav() {
  const { t } = useI18n();
  const opts = useSharedScreenOptions();
  return (
    <TrackingStack.Navigator screenOptions={opts}>
      <TrackingStack.Screen
        name="TrackingMain"
        component={TrackingScreen}
        options={{ title: t("nav_tracking") }}
      />
    </TrackingStack.Navigator>
  );
}

const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
function DashboardStackNav() {
  const { t } = useI18n();
  const opts = useSharedScreenOptions();
  return (
    <DashboardStack.Navigator screenOptions={opts}>
      <DashboardStack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ title: t("nav_dashboard") }}
      />
    </DashboardStack.Navigator>
  );
}

// ── Root ──
export function AppNavigator() {
  return <HomeTabs />;
}

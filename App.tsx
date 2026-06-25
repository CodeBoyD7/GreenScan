import React, { useEffect } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { I18nProvider } from "./src/i18n";
import { OfflineProvider } from "./src/services/OfflineProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";
import {
  setupNotificationCategories,
  addNotificationResponseListener,
  loadReminders,
  saveReminders,
  scheduleAllReminders,
} from "./src/services/NotificationService";
import { addMeal } from "./src/services/MealTracker";

export default function App() {
  useEffect(() => {
    setupNotificationCategories();

    const cleanup = addNotificationResponseListener(async (response) => {
      const { actionIdentifier, notification } = response;
      const reminderId = notification.request.content.data?.reminderId as string | undefined;

      if (actionIdentifier === "eat") {
        const now = new Date();
        await addMeal({
          date: now.toISOString().split("T")[0],
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          microgreen: "unknown",
          completed: true,
        });
      } else if (actionIdentifier === "snooze") {
        const reminders = await loadReminders();
        if (reminderId) {
          const reminder = reminders.find((r) => r.id === reminderId);
          if (reminder) {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30);
            const updated = reminders.map((r) =>
              r.id === reminderId
                ? { ...r, hour: now.getHours(), minute: now.getMinutes(), type: "today" as const }
                : r
            );
            await saveReminders(updated);
            await scheduleAllReminders(updated);
          }
        }
      }
    });

    return () => cleanup();
  }, []);

  return (
    <SafeAreaProvider>
      <I18nProvider>
        <OfflineProvider>
          <NavigationContainer>
            {Platform.OS === "android" && (
              <RNStatusBar translucent={false} backgroundColor="#FFFFFF" />
            )}
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </OfflineProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

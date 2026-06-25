import React, { useEffect } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { I18nProvider } from "./src/i18n";
import { OfflineProvider } from "./src/services/OfflineProvider";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { setupNotificationCategories } from "./src/services/NotificationService";

export default function App() {
  useEffect(() => {
    setupNotificationCategories();
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

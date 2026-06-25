import * as Notifications from "expo-notifications";
import { SchedulableTriggerInputTypes } from "expo-notifications";
import { Platform, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAudioPlayer, setIsAudioActiveAsync } from "expo-audio";

const NOTIF_SCHEDULED_KEY = "gs_notif_scheduled";
const NOTIF_HOUR_KEY = "gs_notif_hour";
const NOTIF_MINUTE_KEY = "gs_notif_minute";
const NOTIF_TYPE_KEY = "gs_notif_type";
const SOUND_PREF_KEY = "gs_alarm_sound";
const REMINDERS_KEY = "gs_reminders";

export const SOUND_OPTIONS = [
  { id: "default", label: "Default Alarm", file: require("../../assets/alarm_default.wav") },
  { id: "gentle", label: "Gentle Tone", file: require("../../assets/alarm_gentle.wav") },
  { id: "bell", label: "Bell Tone", file: require("../../assets/alarm_bell.wav") },
  { id: "buzz", label: "Buzz Tone", file: require("../../assets/alarm_buzz.wav") },
] as const;

export type SoundId = (typeof SOUND_OPTIONS)[number]["id"];

export interface ReminderConfig {
  id: string;
  hour: number;
  minute: number;
  type: "daily" | "today";
  message: string;
  sound: SoundId;
  enabled: boolean;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === "granted") return true;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Enable notifications in Settings to receive daily reminders.");
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Multi-reminder support ──

export async function saveReminders(reminders: ReminderConfig[]): Promise<void> {
  await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
}

export async function loadReminders(): Promise<ReminderConfig[]> {
  try {
    const raw = await AsyncStorage.getItem(REMINDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ReminderConfig[];
  } catch {
    return [];
  }
}

function buildReminderTrigger(hour: number, minute: number, type: "daily" | "today", _sound: SoundId): Notifications.SchedulableNotificationTriggerInput {
  const channelId = "meal_reminders";
  if (type === "daily") {
    return Platform.OS === "ios"
      ? { type: SchedulableTriggerInputTypes.CALENDAR, hour, minute, repeats: true, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, channelId }
      : { type: SchedulableTriggerInputTypes.DAILY, hour, minute, channelId };
  }
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return Platform.OS === "ios"
    ? {
        type: SchedulableTriggerInputTypes.CALENDAR,
        year: target.getFullYear(),
        month: target.getMonth() + 1,
        day: target.getDate(),
        hour,
        minute,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        channelId,
      }
    : { type: SchedulableTriggerInputTypes.DATE, date: target.getTime(), channelId };
}

export async function scheduleAllReminders(reminders: ReminderConfig[]): Promise<void> {
  const granted = await requestPermissions();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const r of reminders) {
    if (!r.enabled) continue;
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: r.message || "Time to Eat Your Microgreens!",
          body: "Nourish your body with fresh microgreens!",
          sound: true,
          priority: "high",
          data: { type: "meal_reminder", reminderId: r.id },
          categoryIdentifier: "meal_reminder",
        },
        trigger: buildReminderTrigger(r.hour, r.minute, r.type, r.sound),
      });
    } catch (e) {
      console.warn(`Failed to schedule reminder ${r.id}`, e);
    }
  }
  const enabled = reminders.filter((r) => r.enabled);
  await AsyncStorage.setItem(NOTIF_SCHEDULED_KEY, enabled.length > 0 ? "true" : "false");
  if (enabled.length > 0) {
    await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(enabled[0].hour));
    await AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(enabled[0].minute));
  }
}

// ── Single reminder helpers (kept for backward compat) ──

export async function scheduleDailyReminder(hour: number, minute: number, title?: string, body?: string): Promise<boolean> {
  try {
    const granted = await requestPermissions();
    if (!granted) return false;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const trigger: Notifications.DailyTriggerInput | Notifications.CalendarTriggerInput =
      Platform.OS === "ios"
        ? { type: SchedulableTriggerInputTypes.CALENDAR, hour, minute, repeats: true, timezone: tz, channelId: "meal_reminders" }
        : { type: SchedulableTriggerInputTypes.DAILY, hour, minute, channelId: "meal_reminders" };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Time to Eat Your Microgreens!",
        body: body || "Nourish your body with fresh microgreens!",
        sound: true,
        priority: "high",
        data: { type: "meal_reminder" },
        categoryIdentifier: "meal_reminder",
      },
      trigger,
    });

    await AsyncStorage.setItem(NOTIF_SCHEDULED_KEY, "true");
    await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(hour));
    await AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(minute));
    return true;
  } catch (e) {
    console.warn("scheduleDailyReminder failed", e);
    return false;
  }
}

export async function scheduleTestNotification(hour: number, minute: number, title?: string, body?: string): Promise<boolean> {
  try {
    const granted = await requestPermissions();
    if (!granted) return false;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const testDate = new Date();
    testDate.setHours(hour, minute, 0, 0);
    if (testDate <= now) {
      testDate.setDate(testDate.getDate() + 1);
    }

    const trigger: Notifications.SchedulableNotificationTriggerInput =
      Platform.OS === "ios"
        ? {
            type: SchedulableTriggerInputTypes.CALENDAR,
            year: testDate.getFullYear(),
            month: testDate.getMonth() + 1,
            day: testDate.getDate(),
            hour,
            minute,
            timezone: tz,
            channelId: "meal_reminders",
          }
        : { type: SchedulableTriggerInputTypes.DATE, date: testDate.getTime(), channelId: "meal_reminders" };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Test: " + (title || "Time to Eat!"),
        body: body || "This is a test notification. Your daily reminders will look like this.",
        sound: true,
        priority: "high",
        data: { type: "test_reminder" },
      },
      trigger,
    });

    return true;
  } catch (e) {
    console.warn("scheduleTestNotification failed", e);
    return false;
  }
}

export async function scheduleTodayReminder(hour: number, minute: number, title?: string, body?: string): Promise<boolean> {
  try {
    const granted = await requestPermissions();
    if (!granted) return false;

    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }

    const trigger: Notifications.SchedulableNotificationTriggerInput =
      Platform.OS === "ios"
        ? {
            type: SchedulableTriggerInputTypes.CALENDAR,
            year: target.getFullYear(),
            month: target.getMonth() + 1,
            day: target.getDate(),
            hour,
            minute,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            channelId: "meal_reminders",
          }
        : { type: SchedulableTriggerInputTypes.DATE, date: target.getTime(), channelId: "meal_reminders" };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "Time to Eat Your Microgreens!",
        body: body || "Nourish your body with fresh microgreens!",
        sound: true,
        priority: "high",
        data: { type: "meal_reminder" },
        categoryIdentifier: "meal_reminder",
      },
      trigger,
    });

    await AsyncStorage.setItem(NOTIF_SCHEDULED_KEY, "true");
    await AsyncStorage.setItem(NOTIF_HOUR_KEY, String(hour));
    await AsyncStorage.setItem(NOTIF_MINUTE_KEY, String(minute));
    return true;
  } catch (e) {
    console.warn("scheduleTodayReminder failed", e);
    return false;
  }
}

export async function cancelReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await AsyncStorage.setItem(NOTIF_SCHEDULED_KEY, "false");
}

export async function isReminderScheduled(): Promise<boolean> {
  const val = await AsyncStorage.getItem(NOTIF_SCHEDULED_KEY);
  return val === "true";
}

export async function getReminderTime(): Promise<{ hour: number; minute: number } | null> {
  const h = await AsyncStorage.getItem(NOTIF_HOUR_KEY);
  const m = await AsyncStorage.getItem(NOTIF_MINUTE_KEY);
  if (h === null || m === null) return null;
  return { hour: parseInt(h, 10), minute: parseInt(m, 10) };
}

export async function getSelectedSound(): Promise<SoundId> {
  const val = await AsyncStorage.getItem(SOUND_PREF_KEY);
  if (val && SOUND_OPTIONS.some((o) => o.id === val)) return val as SoundId;
  return "default";
}

export async function setSelectedSound(id: SoundId): Promise<void> {
  await AsyncStorage.setItem(SOUND_PREF_KEY, id);
}

export async function playAlarmSound(): Promise<{ stop: () => void } | null> {
  try {
    const soundId = await getSelectedSound();
    const option = SOUND_OPTIONS.find((o) => o.id === soundId) || SOUND_OPTIONS[0];
    await setIsAudioActiveAsync(true);
    const player = createAudioPlayer(option.file as any);
    player.play();
    return {
      stop: () => {
        try { player.pause(); } catch {}
        setIsAudioActiveAsync(false);
      },
    };
  } catch {
    return null;
  }
}

export async function setupNotificationCategories(): Promise<void> {
  if (Platform.OS === "android") {
    try {
      await Notifications.setNotificationChannelAsync("meal_reminders", {
        name: "Meal Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
      });
    } catch (e) {
      console.warn("setupNotificationCategories (channel) failed", e);
    }
  }

  try {
    await Notifications.setNotificationCategoryAsync("meal_reminder", [
      {
        identifier: "eat",
        buttonTitle: "I ate it!",
        options: { opensAppToForeground: true },
      },
      {
        identifier: "snooze",
        buttonTitle: "Snooze 30 min",
        options: { opensAppToForeground: false },
      },
    ]);
  } catch (e) {
    console.warn("setupNotificationCategories (category) failed", e);
  }
}

export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void
) {
  const subscription = Notifications.addNotificationResponseReceivedListener(handler);
  return () => subscription.remove();
}

export async function getLastNotificationResponse() {
  return Notifications.getLastNotificationResponseAsync();
}

export async function getAllScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}

export type ReminderType = "daily" | "today";

export async function getReminderType(): Promise<ReminderType> {
  const val = await AsyncStorage.getItem(NOTIF_TYPE_KEY);
  if (val === "daily" || val === "today") return val;
  return "daily";
}

export async function setReminderType(type: ReminderType): Promise<void> {
  await AsyncStorage.setItem(NOTIF_TYPE_KEY, type);
}

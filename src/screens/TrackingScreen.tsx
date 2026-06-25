import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlassCard } from "../components/GlassCard";
import { FlameIcon, CheckIcon, FoodIcon, BellIcon, PlusIcon, StarIcon, ClockIcon } from "../components/Icons";
import { useI18n } from "../i18n";
import { Colors, BorderRadius, FontSize } from "../theme/colors";
import {
  addMeal,
  updateMeal,
  getTodaysMeals,
  getStreak,
  getTotalCompleted,
  type MealEntry,
} from "../services/MealTracker";
import {
  scheduleTestNotification,
  cancelReminder as cancelAllNotifications,
  playAlarmSound,
  setupNotificationCategories,
  SOUND_OPTIONS,
  type SoundId,
  type ReminderConfig,
  saveReminders,
  loadReminders,
  scheduleAllReminders,
} from "../services/NotificationService";
import { microgreens } from "../data/microgreens";

let _idCounter = 0;
function genId() {
  _idCounter += 1;
  return `${Date.now()}_${_idCounter}`;
}

type SoundPlayer = { stop: () => void };

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];
const DEFAULT_MESSAGE = "Time to eat your microgreens!";

export function TrackingScreen() {
  const { t, localized } = useI18n();

  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([]);
  const [streak, setStreak] = useState(0);
  const [totalCompleted, setTotalCompleted] = useState(0);

  const [feedbackText, setFeedbackText] = useState("");
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedMicrogreen, setSelectedMicrogreen] = useState("");

  const [reminders, setReminders] = useState<ReminderConfig[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sound, setSound] = useState<SoundPlayer | null>(null);
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const hourScrollRef = useRef<ScrollView | null>(null);
  const minuteScrollRef = useRef<ScrollView | null>(null);

  const loadData = useCallback(async () => {
    setTodaysMeals(await getTodaysMeals());
    setStreak(await getStreak());
    setTotalCompleted(await getTotalCompleted());
    setReminders(await loadReminders());
  }, []);

  useEffect(() => {
    loadData();
    setupNotificationCategories();
  }, [loadData]);

  // ── Meal tracking ──

  const handleLogMeal = async () => {
    if (!selectedMicrogreen) {
      Alert.alert(t("select_microgreen_title"), t("select_microgreen_msg"));
      return;
    }
    const now = new Date();
    await addMeal({
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      microgreen: selectedMicrogreen,
      completed: true,
    });
    setShowLogForm(false);
    setSelectedMicrogreen("");
    loadData();
  };

  const handleMarkCompleted = async (id: string) => {
    await updateMeal(id, { completed: true });
    loadData();
  };

  const handleSubmitFeedback = async () => {
    if (!selectedMealId || !feedbackText.trim()) {
      Alert.alert(t("feedback_alert_title"), t("feedback_alert_msg"));
      return;
    }
    await updateMeal(selectedMealId, { feedback: feedbackText.trim() });
    setFeedbackText("");
    setSelectedMealId(null);
    Alert.alert(t("thank_you_title"), t("thank_you_msg"));
    loadData();
  };

  // ── Reminder management ──

  const persistReminders = async (updated: ReminderConfig[]) => {
    setReminders(updated);
    await saveReminders(updated);
    const enabled = updated.filter((r) => r.enabled);
    if (enabled.length === 0) {
      await cancelAllNotifications();
    } else {
      await scheduleAllReminders(updated);
    }
  };

  const addReminder = async () => {
    const newReminder: ReminderConfig = {
      id: genId(),
      hour: 8,
      minute: 0,
      type: "daily",
      message: "",
      sound: "default",
      enabled: true,
    };
    const updated = [...reminders, newReminder];
    await persistReminders(updated);
    setExpandedId(newReminder.id);
  };

  const removeReminder = async (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    await persistReminders(updated);
    if (expandedId === id) setExpandedId(null);
  };

  const updateReminder = async (id: string, patch: Partial<ReminderConfig>) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, ...patch } : r
    );
    await persistReminders(updated);
  };

  const toggleReminderEnabled = async (id: string) => {
    const r = reminders.find((x) => x.id === id);
    if (!r) return;
    await updateReminder(id, { enabled: !r.enabled });
  };

  // ── Test controls ──

  const handleTestNotification = async () => {
    const time = { hour: 12, minute: 0 };
    const ok = await scheduleTestNotification(time.hour, time.minute, "GreenScan Test", "This is a test notification.");
    if (ok) {
      Alert.alert("Test Scheduled", "A test notification has been scheduled. Check your notification tray.");
    }
  };

  const playTestSound = async () => {
    if (alarmPlaying && sound) {
      sound.stop();
      setSound(null);
      setAlarmPlaying(false);
      return;
    }
    const s = await playAlarmSound();
    if (s) {
      setSound(s);
      setAlarmPlaying(true);
    }
  };

  useEffect(() => {
    return () => { if (sound) sound.stop(); };
  }, [sound]);

  const hasEnabled = reminders.some((r) => r.enabled);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* ── Streak Card ── */}
      <LinearGradient
        colors={["#2E9E5A", "#3DBB6A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.streakCard}
      >
        <View style={styles.streakLeft}>
          <View style={styles.streakIconWrap}>
            <FlameIcon size={28} color="#fff" />
          </View>
          <View>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakLabel}>{t("day_streak")}</Text>
          </View>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakRight}>
          <Text style={styles.streakBigNum}>{todaysMeals.length}</Text>
          <Text style={styles.streakSmallLabel}>{t("today_label")}</Text>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakRight}>
          <Text style={styles.streakBigNum}>{totalCompleted}</Text>
          <Text style={styles.streakSmallLabel}>{t("meals_tracked")}</Text>
        </View>
      </LinearGradient>

      {/* ── Log Meal ── */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => setShowLogForm(!showLogForm)}
        style={styles.logBtn}
      >
        <PlusIcon size={18} color={Colors.primary} />
        <Text style={styles.logBtnText}>
          {showLogForm ? t("cancel") : t("log_meal")}
        </Text>
      </TouchableOpacity>

      {showLogForm && (
        <GlassCard style={styles.logForm}>
          <Text style={styles.logFormTitle}>{t("what_did_you_eat")}</Text>
          <View style={styles.microGrid}>
            {Object.values(microgreens).map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMicrogreen(m.id)}
                style={[
                  styles.microOption,
                  selectedMicrogreen === m.id && styles.microOptionSelected,
                ]}
              >
                <View style={[
                  styles.microDot,
                  { backgroundColor: selectedMicrogreen === m.id ? Colors.primary : Colors.border }
                ]} />
                <Text style={[
                  styles.microName,
                  selectedMicrogreen === m.id && styles.microNameSelected,
                ]}>
                  {localized(m.name, m.nameTe).split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleLogMeal}
            style={styles.submitBtn}
          >
            <CheckIcon size={16} color="#fff" />
            <Text style={styles.submitBtnText}>{t("log_it")}</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* ── Today's Meals ── */}
      <Text style={styles.sectionTitle}>
        {t("todays_meals")}
        {todaysMeals.length > 0 && (
          <Text style={styles.sectionCount}> {todaysMeals.length}</Text>
        )}
      </Text>

      {todaysMeals.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <FoodIcon size={36} color={Colors.mutedForeground} />
          <Text style={styles.emptyText}>{t("no_meals_yet")}</Text>
        </GlassCard>
      ) : (
        todaysMeals.map((meal) => {
          const micro = Object.values(microgreens).find(
            (m) => m.id === meal.microgreen
          );
          return (
            <View key={meal.id} style={styles.mealRow}>
              <View style={styles.mealLeft}>
                <View style={[styles.mealDot, { backgroundColor: micro ? "#2E9E5A" : Colors.border }]} />
                <View style={styles.mealInfo}>
                  <Text style={styles.mealName}>
                    {micro ? localized(micro.name, micro.nameTe) : meal.microgreen}
                  </Text>
                  <View style={styles.mealMeta}>
                    <ClockIcon size={12} color={Colors.mutedForeground} />
                    <Text style={styles.mealTime}>{meal.time}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.mealRight}>
                {meal.completed ? (
                  <View style={styles.doneBadge}>
                    <CheckIcon size={12} color={Colors.primary} />
                    <Text style={styles.doneText}>{t("done")}</Text>
                  </View>
                ) : (
                  <View style={styles.mealActions}>
                    <TouchableOpacity
                      onPress={() => handleMarkCompleted(meal.id)}
                      style={styles.checkBtn}
                    >
                      <CheckIcon size={16} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedMealId(meal.id);
                        setFeedbackText(meal.feedback || "");
                      }}
                    >
                      <StarIcon size={16} color={Colors.mutedForeground} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        })
      )}

      {/* ── Feedback Form ── */}
      {selectedMealId && (
        <GlassCard style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>{t("how_was_it")}</Text>
          <TextInput
            style={styles.feedbackInput}
            value={feedbackText}
            onChangeText={setFeedbackText}
            placeholder={t("share_experience")}
            placeholderTextColor={Colors.mutedForeground}
            multiline
            numberOfLines={2}
          />
          <View style={styles.feedbackActions}>
            <TouchableOpacity
              onPress={() => setSelectedMealId(null)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t("skip")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmitFeedback}
              style={styles.submitBtn}
            >
              <Text style={styles.submitBtnText}>{t("send")}</Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      )}

      {/* ── Section Divider ── */}
      <View style={styles.sectionDivider} />

      {/* ── Reminders ── */}
      <View style={styles.remindersSection}>
        <Text style={styles.sectionTitle}>{t("reminders_title")}</Text>

        {reminders.length === 0 ? (
          <View style={styles.emptyReminders}>
            <BellIcon size={28} color={Colors.mutedForeground} />
            <Text style={styles.emptyRemindersTitle}>{t("no_reminders")}</Text>
            <Text style={styles.emptyRemindersDesc}>{t("no_reminders_desc")}</Text>
          </View>
        ) : (
          reminders.map((rem) => {
            const expanded = expandedId === rem.id;
            return (
              <GlassCard key={rem.id} style={rem.enabled ? styles.reminderCard : { ...styles.reminderCard, opacity: 0.65 }} padded={false}>
                {/* Header row: icon, time, message preview, toggle */}
                <View style={styles.remHeader}>
                  <View style={styles.remHeaderLeft}>
                    {rem.enabled && <View style={styles.remActiveDot} />}
                    <BellIcon size={16} color={rem.enabled ? Colors.primary : Colors.mutedForeground} />
                    <View style={styles.remHeaderInfo}>
                      <Text style={[styles.remTime, !rem.enabled && styles.remMuted]}>
                        {String(rem.hour).padStart(2, "0")}:{String(rem.minute).padStart(2, "0")}
                      </Text>
                      <Text style={[styles.remMessagePreview, !rem.enabled && styles.remMuted]} numberOfLines={1}>
                        {rem.message || DEFAULT_MESSAGE}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.remHeaderRight}>
                    <View style={[styles.pillType, rem.type === "today" && styles.pillTypeToday]}>
                      <Text style={styles.pillTypeText}>
                        {rem.type === "daily" ? t("reminder_daily") : t("reminder_today")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleReminderEnabled(rem.id)}
                      style={styles.toggleHitArea}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.toggle, rem.enabled && styles.toggleOn]}>
                        <View style={[styles.toggleKnob, rem.enabled && styles.toggleKnobOn]} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Expand / collapse */}
                <TouchableOpacity
                  onPress={() => setExpandedId(expanded ? null : rem.id)}
                  style={styles.remExpandBtn}
                >
                  <Text style={styles.remExpandText}>
                    {expanded ? t("done") : t("options")}
                  </Text>
                </TouchableOpacity>

                {/* Expanded options */}
                {expanded && (
                  <View style={styles.remOptions}>
                    {/* Message input */}
                    <TextInput
                      style={styles.remMsgInput}
                      value={rem.message}
                      onChangeText={(v) => updateReminder(rem.id, { message: v })}
                      placeholder={t("reminder_message_placeholder")}
                      placeholderTextColor={Colors.mutedForeground}
                    />

                    {/* Type picker */}
                    <View style={styles.remTypeRow}>
                      <TouchableOpacity
                        onPress={() => updateReminder(rem.id, { type: "daily" })}
                        style={[styles.remTypePill, rem.type === "daily" && styles.remTypePillActive]}
                      >
                        <Text style={[styles.remTypeText, rem.type === "daily" && styles.remTypeTextActive]}>
                          {t("reminder_daily")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateReminder(rem.id, { type: "today" })}
                        style={[styles.remTypePill, rem.type === "today" && styles.remTypePillActive]}
                      >
                        <Text style={[styles.remTypeText, rem.type === "today" && styles.remTypeTextActive]}>
                          {t("reminder_today")}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Time display */}
                    <TouchableOpacity
                      onPress={() => {
                        setTimeout(() => {
                          const hourY = rem.hour * 36;
                          hourScrollRef.current?.scrollTo({ y: Math.max(0, hourY - 50), animated: true });
                          const minIdx = MINUTES.indexOf(rem.minute);
                          const minY = minIdx * 36;
                          minuteScrollRef.current?.scrollTo({ y: Math.max(0, minY - 50), animated: true });
                        }, 100);
                      }}
                      style={styles.remTimeDisplay}
                    >
                      <ClockIcon size={16} color={Colors.primary} />
                      <Text style={styles.remTimeDisplayText}>
                        {String(rem.hour).padStart(2, "0")}:{String(rem.minute).padStart(2, "0")}
                      </Text>
                    </TouchableOpacity>

                    {/* Inline time picker */}
                    <ReminderTimePicker
                      hour={rem.hour}
                      minute={rem.minute}
                      hourScrollRef={hourScrollRef}
                      minuteScrollRef={minuteScrollRef}
                      onSelectHour={(h) => updateReminder(rem.id, { hour: h })}
                      onSelectMinute={(m) => updateReminder(rem.id, { minute: m })}
                    />

                    {/* Sound picker */}
                    <Text style={styles.remSoundLabel}>{t("alarm_sound")}</Text>
                    <View style={styles.remSoundRow}>
                      {SOUND_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt.id}
                          onPress={() => updateReminder(rem.id, { sound: opt.id })}
                          style={[
                            styles.remSoundChip,
                            rem.sound === opt.id && styles.remSoundChipActive,
                          ]}
                        >
                          <View style={styles.remSoundChipInner}>
                            {rem.sound === opt.id && <CheckIcon size={12} color="#fff" />}
                            <Text style={[
                              styles.remSoundChipText,
                              rem.sound === opt.id && styles.remSoundChipTextActive,
                            ]}>
                              {t(`sound_${opt.id}` as any)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Delete — inline small */}
                    <View style={styles.remDeleteRow}>
                      <TouchableOpacity
                        onPress={() => removeReminder(rem.id)}
                        style={styles.remDeleteBtn}
                      >
                        <Text style={styles.remDeleteText}>{t("delete_reminder")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </GlassCard>
            );
          })
        )}

        {/* Add reminder */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={addReminder}
          style={styles.addReminderBtn}
        >
          <PlusIcon size={16} color={Colors.primaryForeground} />
          <Text style={styles.addReminderText}>{t("add_reminder")}</Text>
        </TouchableOpacity>
      </View>

      {/* ── Test section ── */}
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>{t("test")}</Text>

        {/* Notification preview */}
        <View style={styles.notifPreview}>
          <View style={styles.notifPreviewHeader}>
            <View style={styles.notifPreviewHeaderLeft}>
              <BellIcon size={12} color={Colors.foreground} />
              <Text style={styles.notifPreviewApp}>GreenScan</Text>
            </View>
            <Text style={styles.notifPreviewTime}>now</Text>
          </View>
          <Text style={styles.notifPreviewTitle}>{t("notif_title")}</Text>
          <Text style={styles.notifPreviewBody}>{t("notif_body")}</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.testRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={playTestSound}
            style={[styles.testBtn, alarmPlaying && styles.testBtnActive]}
          >
            <Text style={styles.testBtnText}>
              {alarmPlaying ? t("stop") : t("test_sound")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleTestNotification}
            style={styles.testNotifBtn}
          >
            <BellIcon size={14} color={Colors.primaryForeground} />
            <Text style={[styles.testBtnText, { color: Colors.primaryForeground }]}>{t("send_notification")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ── Inline time picker sub-component ──

function ReminderTimePicker({
  hour,
  minute,
  hourScrollRef,
  minuteScrollRef,
  onSelectHour,
  onSelectMinute,
}: {
  hour: number;
  minute: number;
  hourScrollRef: React.RefObject<ScrollView | null>;
  minuteScrollRef: React.RefObject<ScrollView | null>;
  onSelectHour: (h: number) => void;
  onSelectMinute: (m: number) => void;
}) {
  return (
    <View style={styles.pickerRow}>
      <ScrollView
        ref={hourScrollRef}
        style={styles.pickerCol}
        contentContainerStyle={styles.pickerColContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {HOURS.map((h) => (
          <TouchableOpacity
            key={h}
            onPress={() => onSelectHour(h)}
            style={[styles.pickerItem, hour === h && styles.pickerItemActive]}
          >
            <Text style={[styles.pickerItemText, hour === h && styles.pickerItemTextActive]}>
              {String(h).padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.pickerSep}>:</Text>
      <ScrollView
        ref={minuteScrollRef}
        style={styles.pickerCol}
        contentContainerStyle={styles.pickerColContent}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {MINUTES.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => onSelectMinute(m)}
            style={[styles.pickerItem, minute === m && styles.pickerItemActive]}
          >
            <Text style={[styles.pickerItemText, minute === m && styles.pickerItemTextActive]}>
              {String(m).padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: {
    padding: 16,
    paddingBottom: 48,
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },

  // Streak
  streakCard: {
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  streakLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  streakIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  streakNumber: { fontSize: 24, fontWeight: "800", color: "#fff", lineHeight: 26 },
  streakLabel: { fontSize: 10, color: "rgba(255,255,255,0.85)", marginTop: 1 },
  streakDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: 8 },
  streakBigNum: { fontSize: 20, fontWeight: "800", color: "#fff", textAlign: "center" },
  streakSmallLabel: { fontSize: 9, color: "rgba(255,255,255,0.75)", textAlign: "center", marginTop: 1 },
  streakRight: { alignItems: "center", width: 60 },

  // Log button
  logBtn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  logBtnText: {
    color: Colors.primary,
    fontWeight: "700",
    fontSize: FontSize.md,
  },

  // Log form
  logForm: { marginBottom: 16, gap: 14 },
  logFormTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  microGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  microOption: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  microOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(46,158,90,0.08)",
  },
  microDot: { width: 8, height: 8, borderRadius: 4 },
  microName: { fontSize: FontSize.sm, fontWeight: "600", color: Colors.foreground },
  microNameSelected: { color: Colors.primary },
  submitBtn: {
    paddingVertical: 12,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  submitBtnText: {
    color: Colors.primaryForeground,
    fontWeight: "700",
    fontSize: FontSize.md,
  },

  // Section
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
    marginBottom: 10,
  },
  sectionCount: { color: Colors.mutedForeground, fontWeight: "500" },

  // Empty
  emptyCard: { padding: 32, alignItems: "center", gap: 12, marginBottom: 16 },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },

  // Meal rows
  mealRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mealLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  mealDot: { width: 10, height: 10, borderRadius: 5 },
  mealInfo: { gap: 2 },
  mealName: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.foreground,
  },
  mealMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  mealTime: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  mealRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  doneBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  doneText: { fontSize: FontSize.xs, fontWeight: "600", color: Colors.primary },
  mealActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Feedback
  feedbackCard: { marginBottom: 16, gap: 10 },
  feedbackTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.foreground,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 12,
    fontSize: FontSize.md,
    color: Colors.foreground,
    backgroundColor: Colors.glassBackground,
    minHeight: 60,
    textAlignVertical: "top",
  },
  feedbackActions: { flexDirection: "row", gap: 8 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelBtnText: { color: Colors.foreground, fontWeight: "600" },

  // ── Reminders Section ──
  remindersSection: {
    marginBottom: 8,
    gap: 8,
  },
  reminderCard: {
    padding: 14,
    borderRadius: BorderRadius.lg,
    shadowRadius: 12,
    elevation: 2,
  },

  // Reminder header (collapsed view)
  remHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  remActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  remHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  remHeaderInfo: { gap: 2, flex: 1 },
  remTime: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.foreground,
  },
  remMessagePreview: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.mutedForeground,
  },
  remHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  remMuted: { opacity: 0.4 },

  // Expand / collapse button
  remExpandBtn: { marginTop: 8 },
  remExpandText: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.primary,
  },

  // Expanded reminder options
  remOptions: { gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  remMsgInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 8,
    fontSize: FontSize.sm,
    color: Colors.foreground,
    backgroundColor: Colors.glassBackground,
  },
  remTypeRow: { flexDirection: "row", gap: 8 },
  remTypePill: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  remTypePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  remTypeText: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.mutedForeground,
  },
  remTypeTextActive: {
    color: "#fff",
  },
  remTimeDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remTimeDisplayText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.foreground,
    letterSpacing: 2,
  },
  remSoundLabel: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.foreground,
    marginBottom: -2,
  },
  remSoundRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  remSoundChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  remSoundChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  remSoundChipInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  remSoundChipText: {
    fontSize: FontSize.sm,
    fontWeight: "500",
    color: Colors.foreground,
  },
  remSoundChipTextActive: {
    fontWeight: "600",
    color: "#fff",
  },
  remDeleteRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 2,
  },
  remDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: "rgba(217,74,74,0.25)",
  },
  remDeleteText: {
    color: Colors.destructive,
    fontWeight: "500",
    fontSize: FontSize.xs,
  },

  // Pill type badge in reminder header
  pillType: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.round,
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  pillTypeToday: {
    backgroundColor: "rgba(74,143,199,0.1)",
  },
  pillTypeText: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.primary,
  },

  // Empty state
  emptyReminders: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  emptyRemindersTitle: {
    fontSize: FontSize.md,
    fontWeight: "700",
    color: Colors.mutedForeground,
  },
  emptyRemindersDesc: {
    fontSize: FontSize.sm,
    color: Colors.mutedForeground,
    textAlign: "center",
    lineHeight: 18,
  },

  // Add reminder button
  addReminderBtn: {
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addReminderText: {
    color: Colors.primaryForeground,
    fontWeight: "700",
    fontSize: FontSize.md,
  },

  // Toggle switch
  toggleHitArea: {
    padding: 6,
    margin: -6,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.border,
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  toggleOn: { backgroundColor: Colors.primary },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  toggleKnobOn: { alignSelf: "flex-end" },

  // Time picker
  pickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 4,
  },
  pickerCol: { height: 72 },
  pickerColContent: { paddingVertical: 2 },
  pickerSep: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.foreground,
    marginTop: 2,
  },
  pickerItem: {
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
  },
  pickerItemActive: {
    backgroundColor: "rgba(46,158,90,0.1)",
  },
  pickerItemText: {
    fontSize: FontSize.md,
    color: Colors.mutedForeground,
    fontWeight: "500",
    textAlign: "center",
  },
  pickerItemTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },

  // Test section
  testSection: { gap: 8, marginTop: 4 },
  notifPreview: {
    padding: 12,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  notifPreviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notifPreviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  notifPreviewApp: {
    fontSize: FontSize.xs,
    fontWeight: "600",
    color: Colors.foreground,
  },
  notifPreviewTime: {
    fontSize: FontSize.xs,
    color: Colors.mutedForeground,
  },
  notifPreviewTitle: {
    fontSize: FontSize.sm,
    fontWeight: "700",
    color: Colors.foreground,
  },
  notifPreviewBody: {
    fontSize: FontSize.sm,
    fontWeight: "400",
    color: Colors.mutedForeground,
    lineHeight: 18,
  },
  testRow: { flexDirection: "row", gap: 8 },
  testBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.glassBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  testBtnActive: {
    backgroundColor: "rgba(217,74,74,0.1)",
    borderColor: Colors.destructive,
  },
  testBtnText: {
    color: Colors.foreground,
    fontWeight: "600",
    fontSize: FontSize.xs,
  },
  testNotifBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
});

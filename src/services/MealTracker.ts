import AsyncStorage from "@react-native-async-storage/async-storage";

export interface MealEntry {
  id: string;
  date: string;
  time: string;
  microgreen: string;
  completed: boolean;
  feedback?: string;
  rating?: number;
  notifiedAt?: string;
}

const STORAGE_KEY = "gs_meal_tracker";

export async function getMeals(): Promise<MealEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function addMeal(meal: Omit<MealEntry, "id">): Promise<MealEntry> {
  const meals = await getMeals();
  const entry: MealEntry = { ...meal, id: Date.now().toString() };
  meals.push(entry);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  return entry;
}

export async function updateMeal(id: string, updates: Partial<MealEntry>): Promise<MealEntry | null> {
  const meals = await getMeals();
  const idx = meals.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  meals[idx] = { ...meals[idx], ...updates };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
  return meals[idx];
}

export async function getTodaysMeals(): Promise<MealEntry[]> {
  const meals = await getMeals();
  const today = new Date().toISOString().split("T")[0];
  return meals.filter((m) => m.date === today);
}

export async function getStreak(): Promise<number> {
  const meals = await getMeals();
  const completedDates = new Set(
    meals.filter((m) => m.completed).map((m) => m.date)
  );
  let streak = 0;
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // If today has no meals yet, don't break streak — start checking from yesterday
  const startOffset = completedDates.has(todayStr) ? 0 : 1;

  for (let i = startOffset; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    if (completedDates.has(dateStr)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export async function getWeeklyCompletion(): Promise<{ date: string; count: number }[]> {
  const meals = await getMeals();
  const today = new Date();
  const week: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const count = meals.filter(
      (m) => m.date === dateStr && m.completed
    ).length;
    week.push({ date: dateStr, count });
  }
  return week;
}

export async function getTotalCompleted(): Promise<number> {
  const meals = await getMeals();
  return meals.filter((m) => m.completed).length;
}

# GreenSprout Mobile Project Flow

## Project Overview

GreenSprout Mobile is an Expo React Native application named `greensprout-mobile`. The app helps users discover suitable microgreens for health goals, learn how to grow them at home, track daily microgreen meals, and set reminder notifications.

The app is built around five main tabs:

1. Home
2. Health Scan
3. Dashboard
4. Microgreens Library
5. Tracking

The default landing tab is the Dashboard.

## Application Entry Flow

```text
index.ts
  -> App.tsx
    -> SafeAreaProvider
    -> I18nProvider
    -> OfflineProvider
    -> NavigationContainer
    -> AppNavigator
```

`App.tsx` also initializes notification categories through `setupNotificationCategories()` when the app starts.

## Navigation Flow

Navigation is defined in `src/navigation/AppNavigator.tsx`.

```text
AppNavigator
  -> Bottom Tabs
    -> HomeTab
       -> HomeStack
          -> HomeMain

    -> ScanTab
       -> ScanStack
          -> ScanMain
          -> Results

    -> DashboardTab
       -> DashboardStack
          -> DashboardMain

    -> LibraryTab
       -> LibraryStack
          -> LibraryMain
          -> GrowGuide

    -> TrackingTab
       -> TrackingStack
          -> TrackingMain
```

Each tab has its own stack navigator. This allows screens like `Results` and `GrowGuide` to stay inside their related tab flow.

## User Flow

### 1. Home Flow

Screen: `src/screens/HomeScreen.tsx`

The Home screen introduces the app and shows:

- GreenScan branding
- A short health and microgreens value proposition
- Featured microgreens
- Feature cards for personalization, home growing, and free multilingual support
- How-it-works steps

Primary actions:

- `Start Health Scan` navigates to `ScanTab`
- `Explore Microgreens` navigates to `LibraryTab`
- Featured microgreen cards also lead users toward the library

### 2. Health Scan Flow

Screen: `src/screens/AssessmentScreen.tsx`

The Health Scan is a 3-step assessment:

1. Select age group
2. Select gender
3. Select primary health concern

When the user submits the scan:

```text
age + gender + concern
  -> saved in AsyncStorage under gs_assessment
  -> navigate to Results screen
```

The assessment data is not sent to a backend. It is stored locally on the device.

### 3. Results Flow

Screen: `src/screens/ResultsScreen.tsx`

The Results screen receives the selected health concern through navigation params. If params are missing, it loads the last saved assessment from `AsyncStorage`.

```text
selected concern
  -> concernToMicrogreen map
  -> microgreens data object
  -> recommendation content
```

The Results screen displays:

- Selected health concern
- Recommended microgreen
- Growth time
- Suggested daily intake
- Health match score
- Benefits
- Ways to consume
- Explanation for the recommendation
- Medical disclaimer

The recommendation logic is based on this local mapping:

```text
iron_deficiency   -> fenugreek
diabetes          -> fenugreek
high_bp           -> mustard
high_cholesterol  -> red_cabbage
digestive         -> radish
low_immunity      -> broccoli
fatigue           -> pea
poor_eyesight     -> spinach
stress            -> pea
```

### 4. Microgreens Library Flow

Screen: `src/screens/MicrogreensScreen.tsx`

The library reads all microgreens from `src/data/microgreens.ts` and displays them as cards.

Each card includes:

- Microgreen icon
- Localized name
- Growth time
- Short benefits preview
- Link to learn more

When the user selects a microgreen:

```text
MicrogreensScreen
  -> navigate to GrowGuide with microgreen id
```

### 5. Grow Guide Flow

Screen: `src/screens/GrowGuideScreen.tsx`

The Grow Guide uses the selected microgreen id from route params.

It displays:

- Microgreen name
- Seed requirement
- Growing medium
- Watering schedule
- Sunlight requirement
- Harvest time
- Six-step growing process
- Disclaimer

All growing information comes from the local `microgreens` data object.

### 6. Tracking Flow

Screen: `src/screens/TrackingScreen.tsx`

The Tracking screen lets users:

- View current streak
- View today's meal count
- View total completed meals
- Log a microgreen meal
- Mark meals completed
- Add meal feedback
- Create daily or one-time reminders
- Pick reminder time
- Pick alarm sound
- Test sound and notifications

Meal tracking data is stored locally through `src/services/MealTracker.ts`.

```text
TrackingScreen
  -> addMeal / updateMeal
  -> AsyncStorage key: gs_meal_tracker
  -> Dashboard reads the same data
```

Reminder data is managed through `src/services/NotificationService.ts`.

```text
TrackingScreen
  -> saveReminders / loadReminders
  -> AsyncStorage key: gs_reminders
  -> expo-notifications schedules enabled reminders
```

### 7. Dashboard Flow

Screen: `src/screens/DashboardScreen.tsx`

The Dashboard summarizes user progress using local meal tracking data.

It displays:

- Day streak
- Total meals tracked
- Today's tracked meals
- Weekly completion percentage
- Seven-day bar chart
- Weekly totals and average
- Top consumed microgreens
- Optional disclaimer

Dashboard data comes from:

- `getStreak()`
- `getTotalCompleted()`
- `getTodaysMeals()`
- `getWeeklyCompletion()`
- `getMeals()`

These functions are defined in `src/services/MealTracker.ts`.

## Content Flow

### Static Content Source

Most health, growing, and localized display content is stored in:

```text
src/data/microgreens.ts
src/i18n/index.tsx
```

`src/data/microgreens.ts` contains:

- Microgreen ids
- Names in multiple languages
- Benefits
- Daily intake
- Growth time
- Consumption suggestions
- Grow-at-home requirements
- Health concern labels
- Health concern to microgreen recommendation mapping
- Age group options

Current microgreens include:

- Fenugreek
- Mustard
- Red Cabbage
- Radish
- Broccoli
- Spinach
- Pea

### Localization Flow

Localization is managed by `I18nProvider` in `src/i18n/index.tsx`.

Supported languages:

- English
- Hindi
- Telugu
- Tamil
- Kannada
- Bengali
- Marathi

Language preference is stored in `AsyncStorage` under:

```text
gs_lang
```

Default language fallback is Telugu when no saved language is found.

Screens access localized strings using:

```text
const { t, localized, tField } = useI18n();
```

### Assessment Content Flow

```text
ageGroups + gender options + concernLabels
  -> AssessmentScreen
  -> user selection
  -> gs_assessment
  -> ResultsScreen
  -> concernToMicrogreen
  -> microgreens recommendation
```

### Meal Tracking Content Flow

```text
User logs meal
  -> MealTracker.addMeal()
  -> AsyncStorage: gs_meal_tracker
  -> TrackingScreen displays today's meals
  -> DashboardScreen calculates stats and charts
```

### Reminder Content Flow

```text
User creates reminder
  -> ReminderConfig
  -> AsyncStorage: gs_reminders
  -> scheduleAllReminders()
  -> expo-notifications
  -> local notification trigger
```

Reminder sounds are stored as local assets:

- `assets/alarm_default.wav`
- `assets/alarm_gentle.wav`
- `assets/alarm_bell.wav`
- `assets/alarm_buzz.wav`

## Local Storage Keys

| Key | Purpose |
| --- | --- |
| `gs_lang` | Selected app language |
| `gs_assessment` | Last health scan answers |
| `gs_meal_tracker` | Logged meal entries |
| `gs_reminders` | Multiple reminder configurations |
| `gs_notif_scheduled` | Whether a reminder is scheduled |
| `gs_notif_hour` | Last scheduled notification hour |
| `gs_notif_minute` | Last scheduled notification minute |
| `gs_notif_type` | Reminder type for backward compatibility |
| `gs_alarm_sound` | Selected alarm sound |

## Main Technologies Used

### Core Framework

- Expo `~54.0.0`
- React `19.1.0`
- React Native `0.81.5`
- TypeScript `~5.9.2`

### Navigation

- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

### Local Storage

- `@react-native-async-storage/async-storage`

### Notifications and Audio

- `expo-notifications`
- `expo-audio`
- Local WAV alarm assets

### UI and Interaction

- `expo-linear-gradient`
- `expo-haptics`
- `react-native-svg`
- `@react-native-masked-view/masked-view`
- React Native `Animated`
- Custom UI components in `src/components`

### Build and Deployment

- Expo Application Services through `eas.json`
- Android preview builds configured as APK
- Production builds support auto-increment
- Android package: `com.vasudeva7.greensproutmobile`
- iOS bundle identifier: `com.vasudeva7.greensproutmobile`

## Important Project Files

| File | Responsibility |
| --- | --- |
| `App.tsx` | App providers, navigation container, notification setup |
| `src/navigation/AppNavigator.tsx` | Bottom tab and stack navigation |
| `src/i18n/index.tsx` | Translation dictionary and language provider |
| `src/data/microgreens.ts` | Microgreen, health concern, and grow guide data |
| `src/services/MealTracker.ts` | Local meal tracking storage and calculations |
| `src/services/NotificationService.ts` | Reminder scheduling, permissions, sounds, notification categories |
| `src/services/OfflineProvider.tsx` | Offline context placeholder |
| `src/theme/colors.ts` | App colors, spacing, border radius, font sizes |
| `src/components/TabBar.tsx` | Custom bottom tab bar |

## Screen Responsibility Summary

| Screen | Main Responsibility |
| --- | --- |
| `HomeScreen` | App introduction, featured microgreens, entry points |
| `AssessmentScreen` | 3-step health scan |
| `ResultsScreen` | Microgreen recommendation report |
| `DashboardScreen` | Progress analytics from meal data |
| `MicrogreensScreen` | Browse all microgreens |
| `GrowGuideScreen` | Detailed grow-at-home instructions |
| `TrackingScreen` | Meal logging, feedback, reminders, notification tests |

## Data Architecture Summary

The app currently uses a local-first architecture.

```text
Static content:
  microgreens.ts + i18n/index.tsx

User-generated content:
  AsyncStorage

Device features:
  expo-notifications
  expo-audio
  expo-haptics

Navigation:
  React Navigation bottom tabs + native stacks
```

There is no backend API, database server, authentication system, or remote content service in the mobile app at this time.

## High-Level Flow Diagram

```text
User opens app
  -> DashboardTab
      -> reads local meal data

User starts scan
  -> AssessmentScreen
      -> saves assessment locally
      -> ResultsScreen
          -> maps health concern to microgreen

User explores library
  -> MicrogreensScreen
      -> GrowGuideScreen
          -> reads grow data from microgreens.ts

User tracks meals
  -> TrackingScreen
      -> saves meals locally
      -> DashboardScreen uses saved meals for analytics

User creates reminders
  -> TrackingScreen
      -> saves reminder config locally
      -> schedules local notifications
```


Markdown
# InkJourney

> **The Ink Journey Begins: Eastern Aesthetics Meets Modern Mobile Exploration**

**InkJourney** is a cross-platform mobile travel journaling and hardware-integrated application built with **React Native** and **Expo** for **COMP10013 Dynamic Web Technologies (Coursework 01)** at the University of the West of Scotland (UWS). Designed around traditional Eastern ink-wash painting aesthetics, it transforms every journey into a living digital scroll—uniting atmospheric storytelling, real-time device sensor telemetry, offline CRUD persistence, and native social connectivity.

---

## Product Vision & Key Features

Every journey deserves a canvas that captures both the scenery and the physical environment of the moment. InkJourney pairs layered ink-wash landscapes and translucent rice-paper cards with native mobile hardware APIs and zero-backend offline storage.

| Module | Description |
| :--- | :--- |
| **Annals (Travel Memoirs)** | The primary journaling chronicle supporting full **CRUD operations** (Create, Read, Update, Delete). Revisit, edit, or delete illustrated travel entries stored persistently on-device via `AsyncStorage`, complete with timestamps, GPS coordinates, and captured photos. |
| **Inscribe (Journal Composer & Sensors Hub)** | Integrated entry creation and real-time device telemetry suite. Captures **digital compass heading (`Magnetometer`)**, **tri-axial motion (`Accelerometer`)**, **barometric pressure (`Barometer` with graceful `N/A` fallback)**, **battery/thermal status**, **satellite GPS coordinates**, and **Camera / Photo Gallery** media. |
| **Friends (Travel Mates)** | Companion management module featuring native device address book integration (`expo-contacts`), allowing travelers to request permissions, query phone contacts, and import travel companions with one tap. |
| **Community (Shared Chronicles)** | Interactive social feed for publishing and exploring travel stories, equipped with React Native's native OS `Share` API to share posts across external messaging and social apps. |
| **Global Settings Drawer** | Accessible from any screen via a floating gear button, providing instant **Day (Rice-Paper) and Night (Ink-Wash) theme switching**, **background image opacity/brightness adjustment (`0.2–1.0`)**, and **real-time localization across 8 languages**. |

---

## Technical Stack

- **Core Framework:** React Native, Expo SDK
- **State Management & Local Persistence:**
  - React Hooks (`useState`, `useEffect`) for reactive UI and single-file state architecture (`App.js`)
  - `@react-native-async-storage/async-storage` — Offline-first JSON key-value persistence for travel chronicles across app restarts
- **Native Hardware & System Integrations:**
  - `expo-sensors` — Magnetometer (compass), Accelerometer (3-axis motion), and Barometer telemetry
  - `expo-location` — Foreground permission handling and high-accuracy GPS coordinate acquisition
  - `expo-image-picker` — Native camera capture and local photo library selection
  - `expo-contacts` — Native device contacts permission and address book querying
  - `expo-battery` — Device battery level and power state monitoring
  - `react-native` (`Share`, `Alert`) — Native OS share sheet and permission denial error alerts
- **Supported Platforms:** Android (Standalone APK & Expo Go), HarmonyOS, iOS

---

## Prerequisites

Before cloning and running the project locally, ensure you have the following installed:

- **Node.js** (v18.0 or higher) & **npm**
- **Git**
- **Expo Go** app installed on your physical Android/iOS device (for live development testing), or an Android emulator
- **EAS CLI** (optional, only required for building a standalone Android `.apk`): `npm install -g eas-cli`

---

## Installation & Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/xitianle1577445796-star/InkJourney.git](https://github.com/xitianle1577445796-star/InkJourney.git)
   cd InkJourney
Install project dependencies:

Bash
npm install
Start the Expo development server:

Bash
npx expo start
Scan the displayed QR code using Expo Go on Android (or the Camera app on iOS) to launch the application on your device.

Build Standalone Android APK (Optional):

Bash
npx eas login
npx eas build --platform android --profile preview
Usage Guidelines
Record a Journey (Inscribe Tab): Enter a journey title, location, and story notes; optionally tap to fetch live GPS coordinates, capture a photo via Camera or Gallery, and observe live Compass / Accelerometer sensor readings before saving.

Manage & Verify Persistence (Annals Tab): View saved travel cards, tap Edit to modify an entry or Delete to remove it. Force-close and reopen the app to verify that all records persist offline via AsyncStorage.

Import Companions (Friends Tab): Grant contacts permission when prompted to load and import contacts from your device's address book.

Share Stories (Community Tab): Browse community chronicles and tap Share to open the native OS share menu.

Customize Appearance & Language (Floating Gear Icon): Open the Settings modal to toggle Day / Night Mode, adjust Background Brightness, or switch between 8 supported languages without restarting the app.

Implementation & Hardware Compatibility Notes
Graceful Hardware Degradation: Physical barometer hardware is absent on certain test devices (e.g., standard Android phones). The sensor listener safely detects unavailable hardware and displays N/A without throwing runtime exceptions, while ambient thermal display uses a 25°C UI placeholder where direct ambient sensors are unsupported.

Permission & Error Handling: All hardware and system APIs (Location, Camera, Gallery, Contacts) verify runtime permissions prior to access and trigger user-friendly Alert dialogs if denied, preventing unhandled promise rejections or app crashes.

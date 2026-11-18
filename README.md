[inkjourney_project_documentation.md](https://github.com/user-attachments/files/35035709/inkjourney_project_documentation.md)
# InkJourney

> **The Ink Journey Begins: Eastern Aesthetics Meets Modern Mobile Exploration**

**InkJourney** is a cross-platform mobile travel journaling and hardware-integrated application built with **React Native** and **Expo** for **COMP10013 Dynamic Web Technologies (Coursework 01)** at the University of the West of Scotland (UWS). Designed around traditional Eastern ink-wash painting aesthetics, it transforms every journey into a living digital scroll—uniting atmospheric storytelling, real-time device sensor telemetry, offline CRUD persistence, and native social connectivity.

---

## Product Vision & Functional Architecture

Every journey deserves a canvas that captures both the scenery and the physical environment of the moment. InkJourney is structured around a reactive single-file state architecture (`App.js`) featuring four primary navigation tabs and a floating global control center:

| Module | Description |
| :--- | :--- |
| **Annals (`Home` Tab — Travel Memoirs)** | The primary journaling chronicle supporting full **CRUD operations** (Create, Read, Update, Delete). Revisit, inline-edit, delete, or share illustrated travel entries stored persistently on-device via `AsyncStorage` (`'trips'`), complete with timestamps, satellite GPS coordinates, and captured photos. |
| **Inscribe (`Add` Tab — Composer & Sensors Hub)** | Integrated entry creation and real-time device telemetry suite (**Hard Native Sensors & Environment Hub**). Displays **device model (`expo-device`)**, **battery level (`expo-battery`)**, **digital compass heading (`Magnetometer`)**, **barometric pressure (`Barometer`)**, **tri-axial motion (`Accelerometer`)**, and **ambient temperature**, paired with high-accuracy **GPS acquisition** and **Camera / Photo Gallery** capture. |
| **Friends (`Friends` Tab — Travel Mates)** | Companion management module persisted locally via `AsyncStorage` (`'friends'`). Features native device address book integration (`expo-contacts/legacy`), allowing travelers to request permissions, search contacts by name or phone number, and import travel mates with one tap. |
| **Community (`Community` Tab — Shared Chronicles)** | Interactive social feed for publishing and exploring travel stories, equipped with React Native's native OS `Share.share()` API to share posts across external messaging and social platforms. |
| **Global Settings Drawer (Floating `⚙️` Control)** | Accessible from any screen edge via a floating modal trigger, providing instant **Day Mode (Rice-Paper)** and **Night Mode (Charcoal Ink-Wash)** theme switching, **background image opacity/brightness adjustment (`20%–100%`)**, and **zero-reload localization across 8 languages** (`en`, `zh`, `tw`, `ja`, `ko`, `fr`, `es`, `de`). |

---

## Technical Stack

- **Core Framework:** React Native, Expo SDK
- **State Management & Local Persistence (`App.js`):**
  - React Hooks (`useState`, `useEffect`) for reactive tab navigation, modal overlays, sensor lifecycle subscriptions, and dynamic theme styling
  - `@react-native-async-storage/async-storage` — Offline-first JSON key-value storage (`'trips'` and `'friends'`) ensuring full data persistence across app restarts
- **Native Hardware & System Integrations:**
  - `expo-sensors` — `Magnetometer` (compass heading calculation via `Math.atan2`), `Barometer` (atmospheric pressure in `hPa`), and `Accelerometer` (3-axis `X/Y/Z` motion)
  - `expo-location` — Foreground permission verification, GPS service status checks, and high-precision coordinate/altitude/accuracy acquisition
  - `expo-image-picker` — Native camera capture (`launchCameraAsync`) and local photo library selection (`launchImageLibraryAsync`) with `16:9` aspect editing
  - `expo-contacts/legacy` — Device address book permissions and contact querying (`Name`, `PhoneNumbers`, `Emails`)
  - `expo-battery` & `expo-device` — Real-time battery percentage monitoring and hardware terminal identification
  - `react-native` (`Share`, `Alert`, `Modal`) — Native OS share sheet, permission denial alerts, and interactive overlays
- **Supported Platforms:** Android (Standalone APK & Expo Go), HarmonyOS, iOS

---

## Prerequisites

Before downloading, installing, and running the project locally, ensure you have the following tools installed:

- **Node.js** (v18.0 or higher) & **npm**
- **Git** (or download the repository ZIP directly from GitHub)
- **Expo Go** app installed on your physical Android/iOS device (for live development testing), or an Android emulator
- **EAS CLI** (optional, required only for building a standalone Android `.apk`): `npm install -g eas-cli`

---

## Download, Installation & Setup Guide

### Option 1: Download & Run Locally (For Developers / Assessors)

1. **Download (Clone) the source code from GitHub:**
   ```bash
   git clone https://github.com/xitianle1577445796-star/InkJourney.git
   cd InkJourney
   ```
   *(Alternatively, click the green **`<> Code`** button at the top of this repository and select **`Download ZIP`**, then extract the folder.)*

2. **Install all project dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo development server:**
   ```bash
   npx expo start
   ```
   - Open **Expo Go** on an Android or iOS device and scan the QR code displayed in the terminal to launch the application immediately.

### Option 2: Build & Download Standalone Android APK

1. **Log in to Expo Application Services (EAS):**
   ```bash
   npx eas login
   ```

2. **Build the downloadable `.apk` package:**
   ```bash
   npx eas build --platform android --profile preview
   ```
   - Once the cloud build completes, download the generated `.apk` file from the EAS dashboard link and install it directly onto any Android device.

---

## Usage Guidelines

1. **Record a Journey (`Inscribe` Tab):** Enter a title, tap **Get GPS** to lock real-time satellite coordinates, capture a photo via **Camera** or **Gallery**, write reflections, and tap **Save Inscription** to persist the entry offline.
2. **Manage & Verify Persistence (`Annals` Tab):** View saved travel cards, tap **Edit** to modify titles or notes inline, tap **Share** to invoke the native OS share sheet, or tap **Delete** to remove an entry. Force-close and reopen the app to verify offline persistence via `AsyncStorage`.
3. **Import Companions (`Friends` Tab):** Add companions manually or tap **Import Contacts** to grant permissions, search your phone's address book, and add travel mates.
4. **Share Stories (`Community` Tab):** Publish traveler updates and tap **Share** on any post to send content to external apps.
5. **Customize Theme & Language (`⚙️` Floating Button):** Open the Settings modal to toggle **Day / Night Mode**, adjust **Image Brightness (`20%–100%`)**, or switch between **8 languages** without restarting the app.

---

## Implementation & Hardware Compatibility Notes

- **Graceful Hardware Degradation:** Physical barometer sensors are absent on certain test devices. The `Barometer` listener safely defaults to `'N/A'` when pressure data is unavailable, while ambient temperature uses a `'25°C (Ambient)'` UI indicator where direct ambient thermal sensors are unsupported, preventing runtime crashes.
- **Permission & Error Handling:** All hardware and system APIs (`Location`, `Camera`, `Gallery`, `Contacts`) verify runtime permissions and service availability prior to execution, displaying localized `Alert` dialogs if denied or unavailable.

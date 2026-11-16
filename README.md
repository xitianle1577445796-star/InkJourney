# InkJourney

> **The Ink Journey Begins: Eastern Aesthetics Meets Modern Mobile Exploration**

**InkJourney** is a cross-platform travel journaling and hardware-integrated mobile application built with React Native and Expo. Designed around the serene beauty of traditional Eastern ink-wash painting, it transforms every journey into a living scroll—uniting atmospheric storytelling, comprehensive device telemetry, and seamless social connectivity in a distraction-free interface.

## Product Vision

Every journey deserves a canvas that captures both the scenery and the physical environment of the moment. Rather than relying on generic templates, InkJourney pairs layered ink-wash landscapes and translucent rice-paper cards with full-spectrum mobile sensor capabilities, giving travelers an expressive yet deeply functional companion from departure to reflection.

## Functional Architecture

InkJourney is organized around four core navigation hubs and a floating global control center:

| Module | Description |
| :--- | :--- |
| **Annals (Travel Memoirs)** | The primary journaling chronicle. Create, edit, and revisit illustrated travel entries featuring custom titles, narrative prose, and high-resolution photography captured via camera or selected from the local gallery, complete with one-tap system sharing. |
| **Sensors (Hardware & Telemetry Hub)** | Real-time device diagnostics and environmental monitoring suite, tracking **battery level and charging status**, **digital compass heading**, **barometric atmospheric pressure**, **tri-axial accelerometer motion**, **device thermal temperature**, and **satellite GPS coordinates**. |
| **Friends (Travel Mates)** | Companion management module featuring native device address book integration, allowing travelers to import contacts directly from their phone to organize and connect with travel companions. |
| **Community (Shared Chronicles)** | Interactive social feed for publishing, exploring, and exchanging travel stories with fellow explorers, equipped with native OS share sheet integration for external social and messaging platforms. |
| **Global Atmosphere & Settings Drawer** | Accessible from any screen via a floating control center, providing instant **Day (Rice-Paper) and Night (Ink-Wash) theme switching**, **granular background luminance adjustment**, and **multi-language localization** across major global languages. |

## Technical Stack

- **Core Framework:** React Native, Expo SDK
- **Native Hardware & System Integrations:**
  - `expo-sensors` — Magnetometer (compass), barometer (atmospheric pressure), and accelerometer telemetry
  - `expo-battery` — Real-time battery level, power state, and thermal monitoring
  - `expo-location` — Satellite GPS coordinate and altitude acquisition
  - `expo-contacts` — Native device address book access
  - `expo-image-picker` — Camera capture and local photo library integration
  - `expo-splash-screen` — Custom ink-wash launch experience
- **Supported Platforms:** Android, HarmonyOS, iOS

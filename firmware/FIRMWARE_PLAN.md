# Clay Counter — Firmware Plan

## Language & Environment

Arduino C++ targeting the ESP32-C3-MINI-1 module.

- `src/main.cpp` is the entry point — equivalent to `.ino` but requires `#include <Arduino.h>` explicitly.
- `.h`/`.cpp` files are standard C++.
- **IDE:** CLion + PlatformIO plugin
- **Build system:** PlatformIO Core 6.1.19 (installed at `C:\Users\jaxon\.platformio\penv\Scripts\pio.exe`)
- **Project location:** `firmware/ClayCounterFirmware/`
- **Board:** `esp32-c3-devkitm-1`

---

## Required Libraries

| Library | Source | Purpose |
|---------|--------|---------|
| `Adafruit_SSD1306` or `Adafruit_SH110X` | `platformio.ini` lib_deps | OLED driver |
| `Adafruit_GFX` | `platformio.ini` lib_deps | Graphics primitives |
| `NimBLE-Arduino` | `platformio.ini` lib_deps | BLE (lightweight, preferred over built-in stack) |
| `Wire` | Built-in (ESP32 core) | I2C for OLED |
| `Preferences` | Built-in (ESP32 core) | NVS flash storage |

Current `platformio.ini`:

```ini
[env:esp32-c3-devkitm-1]
platform = espressif32
board = esp32-c3-devkitm-1
framework = arduino
lib_deps =
    adafruit/Adafruit SSD1306
    adafruit/Adafruit GFX Library
    h2zero/NimBLE-Arduino
```

---

## File Structure

```
firmware/
└── ClayCounterFirmware/        ← PlatformIO project root, open this folder in CLion
    ├── platformio.ini           — board + library config (already configured)
    ├── src/
    │   ├── main.cpp             — setup/loop, top-level state machine
    │   ├── buttons.cpp
    │   ├── display.cpp
    │   ├── game.cpp
    │   ├── storage.cpp
    │   └── ble.cpp
    ├── include/
    │   ├── config.h             — pin definitions, constants, NVS namespace keys
    │   ├── types.h              — enums (GameMode, AppState) + structs (Session, ActiveSession)
    │   ├── buttons.h
    │   ├── display.h
    │   ├── game.h
    │   ├── storage.h
    │   └── ble.h
    ├── lib/                     — empty, reserved for local-only libraries
    └── test/                    — empty, reserved for unit tests
```

---

## State Machine

### States

```
STATE_MENU
STATE_MODE_SELECT     — submenu: pick game mode for new session
STATE_SHOOTING        — active session, hit/miss input
STATE_SESSION_END     — confirm end session + save prompt
STATE_HISTORY_LIST    — scrollable list of saved sessions
STATE_HISTORY_DETAIL  — single session view (score, shot sequence)
```

### Transitions

```
STATE_MENU
  → RIGHT/SELECT on "New Game"    → STATE_MODE_SELECT
  → RIGHT/SELECT on "History"     → STATE_HISTORY_LIST

STATE_MODE_SELECT
  → RIGHT/SELECT on a mode        → STATE_SHOOTING (new session begins)
  → LEFT                          → STATE_MENU

STATE_SHOOTING
  → UP                            → Hit recorded
  → DOWN                          → Miss recorded
  → SELECT                        → Undo last shot
  → Long-press SELECT             → STATE_SESSION_END
  → LEFT                          → STATE_SESSION_END (with discard option)

STATE_SESSION_END
  → "Save"                        → saves to NVS → STATE_MENU
  → "Discard"                     → discards → STATE_MENU

STATE_HISTORY_LIST
  → UP/DOWN                       → scroll list
  → RIGHT/SELECT                  → STATE_HISTORY_DETAIL
  → LEFT                          → STATE_MENU

STATE_HISTORY_DETAIL
  → LEFT                          → STATE_HISTORY_LIST
```

---

## Menu Structure

```
Main Menu
├── New Game
│   ├── Quick Count
│   ├── Trap
│   ├── Skeet
│   ├── Sporting Clays
│   └── 5-Stand
└── History
    └── [#01 Trap 22/25] ──────── → detail view
    └── [#02 Quick Count 15/18] → detail view
    └── ...
```

Battery percentage is shown on every screen (top-right corner).

---

## Game Modes

All modes are hit/miss counters for now — identical logic, different labels.
Game-specific rules (station rotation, bird sequences, etc.) are a future addition.

| Mode | Label | Notes |
|------|-------|-------|
| Quick Count | "Quick" | No target count, runs until manually ended |
| Trap | "Trap" | Typically 25 birds per round |
| Skeet | "Skeet" | Typically 25 birds per round |
| Sporting Clays | "Sport" | Varies; no auto-end for now |
| 5-Stand | "5-Stand" | Varies; no auto-end for now |

---

## Data Structures (types.h)

```cpp
enum GameMode {
  MODE_QUICK_COUNT = 0,
  MODE_TRAP,
  MODE_SKEET,
  MODE_SPORTING,
  MODE_5STAND
};

enum AppState {
  STATE_MENU = 0,
  STATE_MODE_SELECT,
  STATE_SHOOTING,
  STATE_SESSION_END,
  STATE_HISTORY_LIST,
  STATE_HISTORY_DETAIL
};

// Stored in NVS — compact representation of a completed session
struct Session {
  GameMode mode;
  uint8_t  hits;
  uint8_t  misses;
  uint8_t  shot_count;
  uint8_t  shots[13];   // bit-packed: 1=hit, 0=miss, up to 100 shots (100 bits = 13 bytes)
};

// Live session held in RAM during shooting, discarded or saved on end
struct ActiveSession {
  GameMode mode;
  uint8_t  hits;
  uint8_t  misses;
  uint8_t  shot_count;
  bool     shots[100];  // unpacked for easy undo
};
```

---

## NVS Storage Layout (storage.h)

Uses `Preferences.h` with namespace `"cc"` (clay counter).

| Key | Type | Contents |
|-----|------|----------|
| `"count"` | `uint8_t` | Number of sessions saved (0–25) |
| `"s00"` ... `"s24"` | `Bytes` (blob) | Serialized `Session` struct, one per slot |

Sessions are stored oldest→newest. When 25 slots are full, oldest is overwritten (circular buffer).

---

## Display Layout

### Shooting Screen (128×64)

```
┌─────────────────────────────┐
│ Trap                   [87%]│  ← mode label + battery
│                             │
│  HITS    MISSES   TOTAL     │
│   22       3       25       │
│                             │
│ ████████████████░░░░  88%   │  ← hit rate bar
└─────────────────────────────┘
```

### Main Menu

```
┌─────────────────────────────┐
│ Clay Counter           [87%]│
│                             │
│  > New Game                 │
│    History                  │
│                             │
│                             │
└─────────────────────────────┘
```

### History List

```
┌─────────────────────────────┐
│ History                [87%]│
│  > #01 Trap      22/25  88% │
│    #02 Quick     15/18  83% │
│    #03 Skeet     20/25  80% │
│    #04 Trap      24/25  96% │
│                             │
└─────────────────────────────┘
```

---

## Button Handling (buttons.h)

- **Debounce:** 20ms software debounce on all buttons.
- **Long-press threshold:** 600ms on SELECT.
- **Polling:** Read all buttons in every `loop()` iteration. No interrupts needed at this update rate.
- **Active HIGH:** Buttons read HIGH when pressed (external pull-downs to GND per schematic).

```cpp
enum ButtonEvent {
  BTN_NONE = 0,
  BTN_UP,
  BTN_DOWN,
  BTN_LEFT,
  BTN_RIGHT,
  BTN_SELECT,
  BTN_SELECT_LONG
};
```

---

## BLE — Nordic UART Service (NUS)

### Overview

The device implements BLE NUS — a widely adopted pseudo-standard that emulates a serial port over BLE. No custom app required on the phone side. The device advertises continuously (low-power background advertising). When a phone connects, the device automatically streams the full session history as plain text, then stays connected.

### UUIDs (fixed NUS standard)

| Characteristic | UUID | Properties |
|---------------|------|-----------|
| Service | `6E400001-B5A3-F393-E0A9-E50E24DCCA9E` | — |
| TX (device → phone) | `6E400003-B5A3-F393-E0A9-E50E24DCCA9E` | Notify |
| RX (phone → device) | `6E400002-B5A3-F393-E0A9-E50E24DCCA9E` | Write |

### Phone App Options (free, no account)

| App | Platform | Notes |
|-----|----------|-------|
| Serial Bluetooth Terminal (Kai Morich) | Android / iOS | Most popular, clean terminal UI |
| nRF UART | Android / iOS | Official Nordic app |
| Bluefruit Connect | Android / iOS | Adafruit's app, also works |

**Steps for user:**
1. Install any app above.
2. Open app → scan → tap "ClayCounter".
3. Session history streams automatically as plain text.
4. Screenshot or note scores. Done.

### Output Format

```
=== Clay Counter ===
#01 Trap        22/25  88%
#02 Quick Count 15/18  83%
#03 Skeet       20/25  80%
#04 Trap        24/25  96%
====================
```

### Library

`NimBLE-Arduino` — lightweight BLE stack for ESP32. The ESP32 Arduino core's built-in BLE library is significantly heavier and unnecessary for this use case.

### Connection Behavior

- Device advertises as `"ClayCounter"` at all times (low duty cycle to save battery).
- On connect: TX the full session history, send `"====================\n"` as end marker.
- RX ignored for now (no phone→device commands needed).
- On disconnect: resume advertising.
- BLE connection status shown as small icon on OLED (optional).

---

## Battery ADC

```cpp
// GPIO0 = BAT_SENSE (voltage divider midpoint: R8=100k, R9=100k → 2:1 divider)
float v_batt = (analogRead(BAT_SENSE_PIN) / 4095.0) * 3.3 * 2.0;

// Map 3.5V–4.2V → 0–100%
int pct = constrain((int)((v_batt - 3.5) / 0.7 * 100), 0, 100);
```

Note: ESP32 ADC has known nonlinearity near the rails. A calibration offset may be needed after hardware testing.

---

## Build Order

**Environment: complete.** CLion + PlatformIO configured, ESP32 toolchain downloaded, project scaffolded.

1. `include/config.h` + `include/types.h` — pin defs, constants, enums, structs
2. `src/main.cpp` skeleton — `#include <Arduino.h>`, state machine shell, dispatches to modules
3. `src/buttons.cpp` + `include/buttons.h` — debounce + long-press (most critical input layer)
4. `src/display.cpp` + `include/display.h` — one render function per screen
5. `src/game.cpp` + `include/game.h` — hit/miss/undo on `ActiveSession`
6. `src/storage.cpp` + `include/storage.h` — NVS save/load/list via `Preferences.h`
7. `src/ble.cpp` + `include/ble.h` — NimBLE NUS, stream history on connect
8. `firmware/sync/sync.py` — PC sync script (write last, after firmware is stable)

---

## PC/Phone Sync & Master Tracker

### Concept

Beyond the basic BLE terminal view, a companion script runs on a computer (or phone) to pull session data from the device, persist it to a local file, and build a running master log with stats. No cloud, no account — just a script you run after a range session.

### How It Works

The device TX format is already plain text over NUS. The sync script:
1. Scans for `ClayCounter` via BLE
2. Connects, receives the full session dump
3. Deduplicates against already-stored sessions (by session index)
4. Appends new sessions to a local data store
5. Outputs a summary report

### Data Store

A single **JSON file** (`clay_counter_log.json`) acts as the master tracker:

```json
{
  "sessions": [
    { "id": 1, "mode": "Trap",  "hits": 22, "misses": 3, "total": 25, "pct": 88, "synced_at": "2026-04-04" },
    { "id": 2, "mode": "Skeet", "hits": 20, "misses": 5, "total": 25, "pct": 80, "synced_at": "2026-04-04" }
  ]
}
```

Easy to open, diff, back up, import to Excel/Sheets.

### Script Platform Options

| Option | Platform | Notes |
|--------|----------|-------|
| Python + `bleak` | Windows / Mac / Linux | Best choice. `bleak` is a solid cross-platform BLE library. Run from terminal. |
| Python + `bleak` via Termux | Android | Works, but phone BLE permissions are fiddly |
| Swift/Shortcuts | iOS | Possible but more effort; lower priority |

**Recommended: Python on PC.** The user runs `python sync.py` after a range session, it finds the device, syncs, and prints a report.

### Report Output (terminal)

```
Clay Counter — Sync complete (3 new sessions)

All-time: 847 shots | 703 hits | 83.0%

By mode:
  Trap          312 shots  85.3%  (PB: 25/25)
  Skeet         200 shots  79.0%  (PB: 24/25)
  Quick Count   335 shots  82.7%

Recent (last 5 sessions):
  #47 Trap      24/25  96%  ← personal best
  #46 Skeet     19/25  76%
  #45 Trap      22/25  88%
  #44 Trap      23/25  92%
  #43 Quick     32/40  80%
```

### Script Location

`firmware/sync/sync.py` — to be written after device firmware is stable.

### Device-Side Requirements

For the sync script to work reliably, the device TX format must be machine-parseable (not just human-readable). The plain-text format above is sufficient — each session line follows a fixed pattern the script can regex against. No firmware changes needed beyond what's already planned.

---

## Open Items

- Confirm OLED driver chip on final display unit (SSD1306 vs SH1106 — different Adafruit library).
- GPIO2 strapping behavior at boot — verify pull-down does not interfere with boot mode (see ESP32-C3 datasheet).
- Decide whether to show shot-by-shot sequence (H/M string) in history detail view.
- Consider RTC-less timestamp: store session index only, or use a simple elapsed-time counter from boot.

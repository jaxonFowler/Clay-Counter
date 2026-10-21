# Clay Shooting Counter — Project Context

## Project Overview
A compact, battery-powered clay shooting hit/miss counter with a navigable history UI and BLE sync so a phone can read saved sessions. Custom PCB in Altium Designer, enclosure in SolidWorks, firmware in C++ (Arduino framework) built with PlatformIO.

**Versions:** use **V1** and **V2.0** everywhere (README, docs, résumé, commits).
- **V1** — Arduino Pro Mini (ATmega328P) + AT24C32 EEPROM. Schematic complete, superseded.
- **V2.0** — ESP32-C3-MINI-1 bare module. Current design. Schematic complete, PCB DRC clean and ready to order.

---

## Project Status (updated Oct 2026)

| Area | Status |
|------|--------|
| V2.0 schematic | Complete |
| V2.0 PCB layout | DRC clean, ready to order — **resolve the GPIO2 blocker below first** |
| Firmware | In progress — display and buttons implemented, game logic started, storage and BLE stubbed |
| Enclosure | Not started |
| First boards | Not ordered |

### Open items
- [ ] **BLOCKER before ordering — GPIO2 strapping.** GPIO2 is an ESP32-C3 strapping pin, and Espressif recommends an external pull-up on it. V2.0 puts NAV_UP on GPIO2 with a 10 kΩ pull-down, so GPIO2 reads LOW at reset, which risks a failed boot. Confirm against the ESP32-C3 datasheet's boot-mode table. Fixes: move NAV_UP to a free non-strapping GPIO (e.g. GPIO1, GPIO7 or GPIO10), or make that button active-low with a pull-up to 3V3. Update `config.h` to match.
- [ ] Confirm C4 (4.7 µF) role and placement (likely LDO input/output decoupling; MCP1700 needs ≥1 µF on both sides).
- [ ] BT1 hardware: schematic has BT1 as an off-board 18650 with no PCB footprint, wired to J1 B+/B−. The earlier plan for a JST-PH 2-pin connector was not implemented — decide on holder and wiring.
- [ ] ADC calibration for battery sense (ESP32 ADC is nonlinear near the rails).
- [ ] Export Gerbers and drill files, then order boards.

---

## Repository Layout

| Path | Contents |
|------|----------|
| `README.md` | Public project overview (keep in sync with this file) |
| `hardware/Clay_Counter-Altium/` | Altium project: `ClayCounter.SchLib`, `ClayCounter.PcbLib`, schematics, `ClayCounterPCB.PcbDoc`, OutJob |
| `hardware/*.pdf` | Schematic exports; `hardware/Clay_Counter-Altium/ClayCounterPCB.pdf` is the PCB export |
| `hardware/Clay Counter BOM - Rev4.0.xlsx` | V2.0 BOM (file name predates V1/V2.0 naming) |
| `hardware/*.md` | Routing spec, pre-schematic checklist, part replacements |
| `firmware/ClayCounterFirmware/` | PlatformIO project (open this folder in CLion) |
| `firmware/FIRMWARE_PLAN.md` | Firmware architecture plan |
| `case/` | SolidWorks enclosure (empty) |
| `docs/` | Design notes, images for README |
| `schematic-viewer/` | React + Vite schematic viewer (README is still the Vite template) |

**File name gotcha:** names are inverted relative to versions.
- `ClayCounterCircuit.SchDoc` / `ClayCounterCircuit.pdf` = **V1** (Pro Mini)
- `ClayCounterCircuit-V2.0.SchDoc` / `ClayCounterCircuit-V2.0.pdf` = **V2.0** (ESP32-C3)
- `ClayCounterPCB.PcbDoc` = **V2.0** layout

**Not tracked in git** (see `.gitignore`): `.pio/`, `.idea/`, `.vscode/`, `.obsidian/`, `.claude/`, Altium `History/`, `__Previews/`, `Project Logs for */`, `*.LOG`.

---

## Hardware Stack (V2.0)

| Ref | Part | Notes |
|-----|------|-------|
| U1 | ESP32-C3-MINI-1-N4 bare module, castellated pads | 3.3 V, 160 MHz, BLE 5.0 + Wi-Fi, 4 MB flash, 13.2×16.6 mm. No onboard LDO. Programmed over native USB via J2. |
| U2 | CANADUINO 26295 1.3" OLED, 128×64, I²C | Driven as SSD1306 (`Adafruit_SSD1306`). Address 0x3C. 4-pin 2.54 mm header (GND/VCC/SCL/SDA) on a female header. |
| U3 | MCP1700T-3302E/TT LDO (SOT-23) | 3.3 V, 250 mA. Required. Dropout ~178 mV at 250 mA; fine down to 3.5 V battery. |
| J1 | TP4056 + DW01A module (USB-C) | Charging and battery protection (DW01A on the module). Module's own USB-C is charge-only. |
| J2 | GCT USB4085-GF-A USB-C receptacle | PCB programming + charging. USB_DP→GPIO19, USB_DN→GPIO18, CC1/CC2→R10/R11→GND, VBUS→VBUS_5V→J1 IN+. |
| BT1 | 18650 Li-ion cell | Off-board, no PCB footprint; wired to J1 B+/B−. |
| SW1 | C&K JS102011SAQN SPDT slide | Power. Common=SWITCHED_BATT, throw A=RAW, throw B=NC. |
| SW2 + SW_NAV1–5 | Omron B3F-1000 tactile, 6×6 mm THT | SW2 = reset (EN). NAV = 5-way D-pad, active HIGH, 10 kΩ pull-downs. |
| TP1–TP4 | Test points | On PCB. |
| MHNP1–4 | Mounting holes | On PCB. |

### Passives

| RefDes | Value | Qty | Purpose |
|--------|-------|-----|---------|
| R1, R2 | 4.7 kΩ | 2 | I²C SDA/SCL pull-ups to VCC_3V3 (also hold GPIO8/GPIO9 HIGH at boot) |
| R3–R7 | 10 kΩ | 5 | Nav button pull-downs (see GPIO2 blocker) |
| R8, R9 | 100 kΩ 1% | 2 | Battery voltage divider |
| R10, R11 | 5.1 kΩ | 2 | USB-C CC1/CC2 pull-downs (required for 5 V) |
| C1 | 10 µF 16 V X5R 0603 (YAGEO CC0603KRX5R7BB106) | 1 | RAW bulk decoupling |
| C2, C3 | 100 nF 16 V X7R 0603 (KEMET C0603C104J4RACTU) | 2 | VCC_3V3 decoupling near OLED and LDO output |
| C4 | 4.7 µF | 1 | Role to confirm (see open items) |

*Removed vs V1: AT24C32 EEPROM and its decoupling cap, FTDI header, DTR cap.*

---

## Power Architecture

```
BT1 18650 ── J1 TP4056/DW01A B+/B−  (charge + protect)
J1 OUT+ = SWITCHED_BATT ── SW1 ── RAW ── U3 MCP1700 ── VCC_3V3 ── ESP32 3V3, OLED, pull-ups
SWITCHED_BATT ── R8 ── BAT_SENSE ── R9 ── GND   (divider to GPIO0 / ADC1)
J2 USB-C VBUS ── VBUS_5V ── J1 IN+   (charging through the PCB port)
J2 D+/D− ── GPIO19/GPIO18            (native USB programming)
```

Battery percentage (12-bit ADC):
```cpp
float v_batt = (analogRead(PIN_BAT_SENSE) / 4095.0f) * 3.3f * 2.0f;
// map BATT_MIN_V (3.5 V) .. BATT_MAX_V (4.2 V) to 0–100 %
```

---

## Pin Assignments (V2.0 — as in `config.h`)

| GPIO | Net | Function |
|------|-----|----------|
| 8 | I2C_SDA | OLED SDA (strapping pin, held HIGH by R1) |
| 9 | I2C_SCL | OLED SCL (strapping pin, held HIGH by R2 → SPI boot) |
| 2 | NAV_UP | Up · Shooting: Hit — **strapping pin, see blocker** |
| 3 | NAV_DOWN | Down · Shooting: Miss |
| 4 | NAV_LEFT | Back / Cancel |
| 5 | NAV_RIGHT | Forward |
| 6 | NAV_SELECT | Select · Shooting: Undo · Long-press: toggle menu |
| 0 | BAT_SENSE | Battery ADC (ADC1) |
| EN | RST | Reset via SW2 |
| 18 / 19 | USB_DN / USB_DP | Reserved for USB — do not use |

### Schematic nets
BATT_POS, GND, SWITCHED_BATT, RAW, VCC_3V3, VBUS_5V, I2C_SDA, I2C_SCL, BAT_SENSE, RST, NAV_UP/DOWN/LEFT/RIGHT/SELECT, USB_DP, USB_DN.

---

## Firmware

**Toolchain:** PlatformIO (Core 6.1.x) via CLion. Board `esp32-c3-devkitm-1`, framework `arduino`. Build/flash: `pio run -t upload` from `firmware/ClayCounterFirmware/`.

`platformio.ini` lib_deps: `adafruit/Adafruit SSD1306`, `adafruit/Adafruit GFX Library`, `h2zero/NimBLE-Arduino`. Built-ins: `Wire`, `Preferences`.

| File | Responsibility | Status |
|------|----------------|--------|
| `include/config.h` | Pins, timing, battery, storage and BLE constants | Done |
| `include/types.h` | `GameMode`, `AppState`, `ButtonEvent`, `Session`, `ActiveSession` | Done |
| `src/display.cpp` | Menu, mode select, shooting, session end, history list/detail screens | Implemented |
| `src/buttons.cpp` | `readButtons()` with debounce + long-press | Implemented |
| `src/game.cpp` | `newSession`, `recordHit/Miss`, `undoLastShot`, `recordOption`, `nextStation`, `finalizeSession` | In progress (uncommitted edits) |
| `src/main.cpp` | `AppState` state machine | Skeleton — module includes commented out, handlers empty |
| `src/storage.cpp` | NVS save/load via `Preferences` | Stub |
| `src/ble.cpp` | Read-only BLE session service (NimBLE) | Stub |

**Key constants (`config.h`):** `DEBOUNCE_MS 20`, `LONG_PRESS_MS 600`, `BATT_MIN_V 3.5`, `BATT_MAX_V 4.2`, `MAX_SESSIONS 25`, `MAX_SHOTS 200`, `NVS_NAMESPACE "cc"`, `NVS_KEY_COUNT "count"`, session keys `s00`–`s24`.

**App states:** MENU → MODE_SELECT → SHOOTING → SESSION_END, plus HISTORY_LIST → HISTORY_DETAIL.

**BLE design intent:** device advertises a read-only service; phone connects on demand and reads session history (JSON or packed struct). No phone control of the device.

**Prototyping:** an ESP32-C3 dev board (`esp32-c3-devkitm-1`) runs this firmware before custom boards exist. Mind the GPIO2 strapping issue on the dev board too.

---

## UI Design Intent

- **Game modes:** Trap, Skeet, Sporting Clays, 5-Stand, Quick Count (simple tally)
- **SHOOTING mode:** UP = Hit, DOWN = Miss, SELECT = Undo last, long-press SELECT = toggle to MENU
- **MENU mode:** all five buttons navigate
- Session history in NVS; battery indicator on every screen; BLE sync on demand

---

## Future Upgrade
- Display: Waveshare 1.69" 240×280 IPS, ST7789V2, SPI
- Proposed SPI pins: SCK=GPIO4, MOSI=GPIO6, CS=GPIO7, DC=GPIO5, RST=GPIO3, BL=GPIO2 — conflicts with current nav buttons and GPIO2 strapping; re-plan the whole pin map when this happens
- R1/R2 can go once there are no I²C devices — but then GPIO8/GPIO9 need their own boot-level resistors

---

## Tools
Altium Designer (schematic/PCB) · SolidWorks (enclosure, import PCB STEP) · PlatformIO + CLion (firmware) · Git/GitHub (`jaxonFowler/Clay-Counter`)

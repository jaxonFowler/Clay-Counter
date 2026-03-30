# Clay Shooting Counter — Project Context

## Project Overview
A compact, battery-powered clay shooting hit/miss counter with a navigable history UI. BLE sync to phone for session data viewing. Custom PCB designed in Altium Designer, enclosure in SolidWorks.

---

## Hardware Stack

| Component | Part | Notes |
|-----------|------|-------|
| MCU | ESP32-C3-MINI-1 — bare Espressif module, castellated pads | 3.3V, 160MHz, BLE 5.0 + WiFi. 13.2×16.6mm. No onboard LDO. Programmed via PCB USB-C (J2). Arduino IDE compatible. |
| Display | CANADUINO 26295 — 1.3" OLED, 128×64, I2C, SSD1306/SH1106 | I2C address 0x3C. 4-pin 2.54mm header (GND/VCC/SCL/SDA). Mounts via female header on PCB |
| Storage | ESP32 internal NVS flash (via `Preferences.h`) | Replaces AT24C32 EEPROM. 4MB flash onboard, wear-leveled. |
| Power | 18650 Li-ion cell + TP4056 + DW01A module | USB-C charging. Unchanged from Rev 3.0. |
| Power reg | MCP1700-3302E LDO (SOT-23) on PCB | TP4056 OUT+ → SW1 → LDO → VCC_3V3. Required — bare module has no onboard LDO. Dropout ~178mV at 250mA; adequate margin from 3.5V battery min. |
| Input | 6× Omron B3F-1000 tactile switches | 5× D-pad (SW_NAV1–5) + 1× reset (SW2). Through-hole, 6×6mm, 4.5mm×4.5mm pin grid, 150gf. Active HIGH, external 10kΩ pull-downs |
| Power switch | C&K JS102011SAQN | SPDT slide switch. Common=SWITCHED_BATT, throw A=RAW, throw B=NC |

---

## Power Architecture

```
18650 → TP4056 B+/B− (charge/protect)
TP4056 OUT+ → SW1 (power switch) → U3 MCP1700 LDO → VCC_3V3 → ESP32 VDD pin
TP4056 OUT+ → R8 → BAT_SENSE → R9 → GND   (voltage divider to ADC)

J2 USB-C (on PCB): programming only — D+/D− to GPIO19/18. VBUS not connected to power rail.
TP4056 USB-C: charging only (unchanged from Rev 3.0)
```

**Battery voltage formula (ESP32 12-bit ADC):**
```cpp
float v_batt = (analogRead(BAT_SENSE_PIN) / 4095.0) * 3.3 * 2;
// Map 3.5V–4.2V to 0–100% for display
// Note: ESP32 ADC has nonlinearity near rails — consider calibration offset
```

---

## Pin Assignments (ESP32-C3 Mini)

Exact GPIO assignments to be finalized against chosen module pinout. Suggested mapping:

| GPIO | Net | Function |
|------|-----|----------|
| GPIO8 | I2C_SDA | Hardware I2C — OLED |
| GPIO9 | I2C_SCL | Hardware I2C — OLED |
| GPIO2 | NAV_UP | D-pad UP · Shooting mode: Hit |
| GPIO3 | NAV_DOWN | D-pad DOWN · Shooting mode: Miss |
| GPIO4 | NAV_LEFT | D-pad LEFT · Back/Cancel |
| GPIO5 | NAV_RIGHT | D-pad RIGHT · Forward |
| GPIO6 | NAV_SELECT | D-pad SELECT · Shooting: Undo · Long-press: toggle mode |
| GPIO0 | BAT_SENSE | Battery voltage ADC (ADC1 channel) |
| EN | RST | Reset — external button SW2 |
| GPIO18 | USB D− | Reserved — programming (do not use) |
| GPIO19 | USB D+ | Reserved — programming (do not use) |

---

## Schematic Nets (Rev 4.0)

- **BATT_POS** — BT1+, TP4056 B+
- **GND** — All grounds
- **SWITCHED_BATT** — TP4056 OUT+, SW1 pin1, R8 pin1
- **RAW** — SW1 pin2, PCB LDO input, C1+
- **VCC_3V3** — PCB LDO output, ESP32 module 3V3 pin, pull-up resistors R1/R2, button high sides
- **I2C_SDA** — ESP32 GPIO8, OLED SDA, R1 pin2
- **I2C_SCL** — ESP32 GPIO9, OLED SCL, R2 pin2
- **BAT_SENSE** — R8 pin2, R9 pin1, ESP32 GPIO0
- **RST** — ESP32 EN, SW2
- **NAV_UP/DOWN/LEFT/RIGHT/SELECT** — respective ESP32 GPIOs, button pin2, pull-down resistors

---

## Passives BOM

| RefDes | Value | Qty | Purpose |
|--------|-------|-----|---------|
| R1, R2 | 4.7kΩ 1/4W | 2 | I2C SDA/SCL pull-ups to VCC_3V3 |
| R3–R7 | 10kΩ 1/4W | 5 | Nav button pull-downs to GND |
| R8, R9 | 100kΩ 1/4W | 2 | Battery voltage divider |
| C1 | 10µF ceramic, 16V X5R 0603 (YAGEO CC0603KRX5R7BB106) | 1 | RAW bulk decoupling |
| C2, C3 | 100nF ceramic, 16V X7R 0603 (KEMET C0603C104J4RACTU) | 2 | VCC_3V3 decoupling near OLED and LDO output |
| R10, R11 | 5.1kΩ 1/4W | 2 | USB-C CC1/CC2 pull-downs — required for host to negotiate 5V |

*Removed vs Rev 3.0: AT24C32 EEPROM, FTDI header J2, C4 (AT24C32 decoupling), C5 (DTR cap)*

---

## ICs / Modules BOM

| RefDes | Part | Notes |
|--------|------|-------|
| U1 | ESP32-C3-MINI-1 bare module | Castellated pads, 13.2×16.6mm. |
| U2 | CANADUINO 26295 OLED | Via 4-pin female header |
| U3 | MCP1700T-3302E/TT (SOT-23) | 3.3V LDO, 250mA. Required — bare module has no onboard LDO. |
| J1 | TP4056 + DW01A module | USB-C charging, battery protection |
| J2 | GCT USB4085-GF-A USB-C receptacle | PCB programming port. D+→GPIO19, D−→GPIO18, CC1/CC2→R10/R11→GND. VBUS not connected to power rail. |

---

## Firmware

**Language/IDE:** Arduino IDE with ESP32-C3 board package installed.

**Key library differences vs Pro Mini:**

| Feature | Library |
|---------|---------|
| Session storage | `Preferences.h` (built-in ESP32, replaces `EEPROM.h`) |
| BLE | `NimBLEDevice.h` (NimBLE-Arduino) — lightweight, well-supported |
| OLED | `Adafruit_SSD1306` or `Adafruit_SH110X` — same as before |
| Graphics | `Adafruit_GFX` — same as before |
| I2C | `Wire.h` — same API |

**BLE design intent:** Device advertises a read-only BLE service. Phone connects on demand, reads session history as JSON or binary struct. No phone control of device.

**Prototyping:** Arduino Uno still usable for UI/button/display logic. Use `EEPROM.h` as stand-in for `Preferences.h` during Uno prototyping. BLE cannot be prototyped on Uno — test BLE separately on ESP32-C3 dev board.

---

## UI / Firmware Design Intent

- **Game modes:**
  - Trap
  - Skeet
  - Sporting Clays
  - 5-Stand
  - Quick Count (simple tally, no game rules)
- **Navigation:** 5-button D-pad (UP/DOWN/LEFT/RIGHT/SELECT)
- **Context switching:**
  - SHOOTING mode: UP=Hit, DOWN=Miss, SELECT=Undo last, long-press SELECT=toggle to MENU
  - MENU mode: all 5 buttons navigate UI
- **Session history** stored in ESP32 NVS via `Preferences.h`
- **Battery indicator** displayed on OLED from ADC reading
- **BLE sync:** Phone pulls session history on demand

---

## Future Upgrade Note
- Display upgrade planned: Waveshare 1.69" LCD 240×280, ST7789V2 driver, SPI interface, 262K colors IPS
- ESP32-C3 SPI pins: SCK=GPIO4, MOSI=GPIO6, CS=GPIO7, DC=GPIO5, RST_disp=GPIO3, BL=GPIO2
- When implemented: swap U2, reroute to SPI pins above, R1/R2 I2C pull-ups can be removed (no more I2C devices)

---

## Tools
- **PCB/Schematic:** Altium Designer
- **3D Enclosure:** SolidWorks (import PCB as STEP from Altium)
- **Firmware:** Arduino IDE + ESP32-C3 board package
- **Libraries needed:**
  - `Adafruit_SSD1306` or `Adafruit_SH110X`
  - `Adafruit_GFX`
  - `NimBLE-Arduino`
  - `Wire`, `Preferences` (both built-in to ESP32 Arduino core)

---

## Project Status
- **Schematic:** Rev 3.0 was complete (Pro Mini). Now redesigning as Rev 4.0 for ESP32-C3 Mini. Not yet started in Altium.
- **PCB layout:** On hold pending Rev 4.0 schematic.
- **Firmware:** Not started.
- **Enclosure:** Not started.
- **Open items for Rev 4.0:**
  - Module confirmed: ESP32-C3-MINI-1 bare module. LDO confirmed: U3 MCP1700-3302E required.
  - USB-C programming port confirmed: J2 on PCB (D+/D−, CC1/CC2 resistors R10/R11)
  - Verify GPIO2 strapping behavior at boot (pull-down → LOW — check ESP32-C3 datasheet)
  - Decide: discrete DW01A battery protection vs. protected 18650 cell
  - BT1 (2-pin solder pads — 18650 wire leads soldered directly) still needs to be placed

# Clay Shooting Counter — Project Context

## Project Overview
A compact, battery-powered clay shooting hit/miss counter with a navigable history UI. Custom PCB designed in Altium Designer, enclosure in SolidWorks.

---

## Hardware Stack

| Component | Part | Notes |
|-----------|------|-------|
| MCU | Arduino Pro Mini 3.3V / 8MHz (ATmega328P) | Programmed via FTDI adapter (3.3V logic only) |
| Display | SSD1306 0.96" OLED, 128×64, I2C | I2C address 0x3C |
| Storage | AT24C32 EEPROM module, I2C | I2C address 0x50 (A0–A2 tied to GND) |
| Power | 18650 Li-ion cell + TP4056 + DW01A module | USB-C charging |
| Input | 5× tactile buttons in D-pad layout | Active HIGH, external 10kΩ pull-downs |

---

## Pin Assignments (Pro Mini)

| Pin | Net | Function |
|-----|-----|----------|
| RAW | RAW | Battery input via power switch (3.5–4.2V) |
| VCC | VCC_3V3 | 3.3V regulated output |
| GND | GND | ×3 |
| RST | RST | External reset button + FTDI DTR auto-reset via 100nF cap |
| A0 | BAT_SENSE | Battery voltage ADC (100kΩ divider from SWITCHED_BATT) |
| A4 | I2C_SDA | Hardware I2C — OLED + EEPROM |
| A5 | I2C_SCL | Hardware I2C — OLED + EEPROM |
| D2 | NAV_UP | D-pad UP · Shooting mode: Hit |
| D3 | NAV_DOWN | D-pad DOWN · Shooting mode: Miss |
| D4 | NAV_LEFT | D-pad LEFT · Back/Cancel |
| D5 | NAV_RIGHT | D-pad RIGHT · Forward |
| D6 | NAV_SELECT | D-pad SELECT · Shooting: Undo · Long-press: toggle mode |
| D0 (RXI) | FTDI TXO | Reserved — programming |
| D1 (TXO) | FTDI RXI | Reserved — programming |
| D7–D13 | — | Available |

---

## Schematic Nets (Rev 3.0)

- **BATT_POS** — BT1+, TP4056 B+
- **GND** — All grounds
- **SWITCHED_BATT** — TP4056 OUT+, SW1 pin1, R8 pin1
- **RAW** — SW1 pin2, U1 RAW, C1+
- **VCC_3V3** — U1 VCC, U2 VCC, U3 VCC, pull-up resistors R1/R2, button high sides
- **I2C_SDA** — U1 A4, U2 SDA, U3 SDA, R1 pin2, TP_SDA
- **I2C_SCL** — U1 A5, U2 SCL, U3 SCL, R2 pin2, TP_SCL
- **BAT_SENSE** — R8 pin2, R9 pin1, U1 A0
- **RST** — U1 RST, SW2 pin1, C5 pin1, J2 DTR
- **NAV_UP/DOWN/LEFT/RIGHT/SELECT** — respective MCU pins, button pin2, pull-down resistors

---

## Passives BOM

| RefDes | Value | Qty | Purpose |
|--------|-------|-----|---------|
| R1, R2 | 4.7kΩ 1/4W | 2 | I2C SDA/SCL pull-ups to VCC_3V3 |
| R3–R7 | 10kΩ 1/4W | 5 | Nav button pull-downs to GND |
| R8, R9 | 100kΩ 1/4W | 2 | Battery voltage divider |
| C1 | 10µF electrolytic | 1 | RAW bulk decoupling |
| C2–C4 | 100nF ceramic | 3 | VCC_3V3 decoupling near each IC |
| C5 | 100nF ceramic | 1 | DTR auto-reset (FTDI DTR → RST) |

---

## Power Chain

```
18650 → TP4056 B+/B− (charge/protect)
TP4056 OUT+ → SW1 (SPST power switch) → Pro Mini RAW → onboard LDO → VCC_3V3 (3.3V)
TP4056 OUT+ → R8 → BAT_SENSE → R9 → GND   (voltage divider to A0)
```

**Battery voltage formula:**
```cpp
float v_batt = (analogRead(A0) / 1023.0) * 3.3 * 2;
// Map 3.5V–4.2V to 0–100% for display
```

---

## UI / Firmware Design Intent

- **Game modes** (each programmed for specific rules/format):
  - Trap
  - Skeet
  - Sporting Clays
  - 5-Stand
  - Quick Count (simple tally, no game rules)
- **Navigation:** 5-button D-pad (UP/DOWN/LEFT/RIGHT/SELECT)
- **Context switching:**
  - SHOOTING mode: UP=Hit, DOWN=Miss, SELECT=Undo last, long-press SELECT=toggle to MENU
  - MENU mode: all 5 buttons navigate UI
- **Session history** stored in AT24C32 EEPROM (I2C address 0x50)
- **Battery indicator** displayed on OLED from A0 ADC reading

---

## Future Upgrade Note
- Display upgrade planned: Waveshare 1.69" LCD 240×280, ST7789V2 driver, SPI interface, 262K colors IPS
- When implemented: swap U2, reroute to SPI pins (SCK=D13, MOSI=D11, CS=D10, DC=D9, RST_disp=D8, BL=D7), remove I2C pull-ups from display side (EEPROM still needs R1/R2)

---

## Prototyping Note
- Code will be prototyped on an Arduino Uno before committing to Pro Mini hardware
- Uno uses same I2C pins (A4=SDA, A5=SCL), same libraries, same button wiring
- Internal ATmega EEPROM (1KB via `<EEPROM.h>`) can substitute for AT24C32 during prototyping

---

## Tools
- **PCB/Schematic:** Altium Designer
- **3D Enclosure:** SolidWorks (import PCB as STEP from Altium)
- **Firmware:** Arduino IDE
- **Libraries needed:**
  - `Adafruit_SSD1306`
  - `Adafruit_GFX`
  - `Wire` (built-in)
  - AT24C32 EEPROM library (e.g. `extEEPROM` or `I2C_EEPROM`)

---

## Schematic Status
**Rev 3.0 — ready to enter in Altium.** PCB layout is the next step.

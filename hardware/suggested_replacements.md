# Clay Counter — Suggested BOM Replacements
## Parts flagged as incompatible in original DigiKey BOM

---

## C1 — 10µF Bulk Decoupling (RAW line)
**Problem with original:** GRM155C80G106ME44D is 4V rated — RAW line hits 4.2V (over-voltage). Severe DC bias derating at this voltage.

| Field | Details |
|-------|---------|
| **Manufacturer** | YAGEO |
| **Manufacturer P/N** | CC0603KRX5R6BB106 |
| **Description** | 10µF ±10% 10V X5R 0603 |
| **Voltage** | 10V |
| **Dielectric** | X5R |
| **Package** | 0603 |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/yageo/CC0603KRX5R6BB106/5195191 |
| **Qty needed** | 1 |

---

## C2–C5 — 100nF Decoupling + DTR Cap
**Problem with original:** GRM022D80G104ME15L is 4V rated (marginal for 3.3V rail) and **01005 package** — impossible to hand solder.

| Field | Details |
|-------|---------|
| **Manufacturer** | KEMET |
| **Manufacturer P/N** | C0603C104J4RACTU |
| **Description** | 100nF ±5% 16V X7R 0603 |
| **Voltage** | 16V |
| **Dielectric** | X7R |
| **Package** | 0603 |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/kemet/C0603C104J4RAC7867/411096 |
| **Qty needed** | 4 (C2, C3, C4, C5) |

---

## SW_NAV1–5 — D-Pad Tactile Switches
**Problem with original:** C&K D6R90 is a right-angle SMD switch with a horizontal actuator — it fires sideways, not downward. Completely unsuitable for a top-press D-pad. Adafruit 1119 (12mm body) is too large for 8–10mm D-pad spacing.

| Field | Details |
|-------|---------|
| **Manufacturer** | Alps Alpine |
| **Manufacturer P/N** | SKHHAQA010 |
| **Description** | Tactile Switch SPST-NO Through-Hole, 6×6×4.3mm, 260gf |
| **Mounting** | Through-hole, top-actuated |
| **Body size** | 6mm × 6mm |
| **Total height** | 4.3mm |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/alps-alpine/SKHHAQA010/19529061 |
| **Qty needed** | 5 |

> **Why through-hole over SMD for a 3D printed case:** Through-hole switches are mechanically anchored to the PCB through the board — they handle repeated sideways thumb force without lifting pads. SMD tactiles can delaminate under that kind of stress.
>
> **How to integrate with 3D printed case:** Design a D-pad plunger cap in SolidWorks that sits flush in the case top. The plunger transmits thumb force down to the switch actuators through the case wall. This is the standard approach for DIY handhelds — you control the button height and feel entirely in CAD, independent of switch height. Space the 5 switches on a 9–10mm centre grid (6mm body + 3–4mm gap = clean fit).

---

## SW1 — Power Switch
**Problem with original:** Adam Tech SW-R3-1A-A-1-0 is a rocker switch — bulky panel-mount component, not ideal for a compact handheld.

| Field | Details |
|-------|---------|
| **Manufacturer** | C&K |
| **Manufacturer P/N** | JS102011SAQN |
| **Description** | Slide Switch SPDT 300mA 6V SMD right-angle, 7mm x 3mm body |
| **Configuration** | SPDT (use as SPST — leave one throw unconnected) |
| **Mounting** | Surface Mount, right-angle (actuator slides parallel to PCB) |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/c-k/JS102011SAQN/1640095 |
| **Qty needed** | 1 |

> **Note:** This is SPDT — just leave the unused throw (pin 3) unconnected. Wire SWITCHED_BATT to the common pin and RAW to one throw as per the schematic.

---

## U2 — OLED Display (optional swap)
**Problem with original:** Winstar WEA012864DWPP3N00003 uses a 30-pin FPC ribbon connector. Electrically fine (SSD1306, I2C 0x3C, 3.3V compatible) but requires an FPC ZIF connector footprint in Altium — more complex for a first build.

**Simpler alternative — standard 4-pin breakout module:**

| Field | Details |
|-------|---------|
| **Manufacturer** | Orient Display |
| **Manufacturer P/N** | AOM12864A0-0.96WW-ANO |
| **DigiKey P/N** | 5491-AOM12864A0-0.96WW-ANO-ND |
| **Description** | 0.96" SSD1306/SSD1315 128x64 OLED White, I2C, 4-pin Arduino header |
| **Interface** | I2C, address 0x3C |
| **Voltage** | 3.3V compatible |
| **DigiKey URL** | https://www.digikey.com/en/products/detail/orient-display/AOM12864A0-0-96WW-ANO/22531926 |
| **Qty needed** | 1 |

> **Note:** If you use this module, mount it with a 4-pin female header on the PCB so it can be replaced. No Altium footprint complexity — just a standard 2.54mm pitch 4-pin connector.

---

## Parts to Keep from Original BOM

| Item | Part | Status |
|------|------|--------|
| Battery | Adafruit 1781 (18650 2200mAh) | ✅ Keep |
| AT24C32 EEPROM | AT24C32E-SSHM-T (8-SOIC bare IC) | ✅ Keep — better than module for custom PCB |
| SW2 Reset Button | Adafruit 1119 (12mm tactile) | ✅ Keep — good as a single large reset button |
| R1, R2 (4.7kΩ) | YAGEO RC0402JR-074K7L | ✅ Keep — 0402 fine for resistors |
| R3–R7 (10kΩ) | YAGEO RC0402FR-0710KL | ✅ Keep |
| R8, R9 (100kΩ) | YAGEO RC0402FR-07100KL | ✅ Keep |

> **Note:** The 0402 resistors are fine to keep — resistors are much easier to hand solder at 0402 than capacitors. The risk with 01005 was specific to capacitors.

---

## Summary of Changes

| RefDes | Original Part | Issue | Replacement |
|--------|--------------|-------|-------------|
| C1 | GRM155C80G106ME44D (4V 0402) | Over-voltage on RAW | CC0603KRX5R6BB106 (10V 0603) |
| C2–C5 | GRM022D80G104ME15L (4V 01005) | 01005 unhandsolderable, low voltage | C0603C104J4RACTU (16V 0603) |
| SW_NAV1–5 | C&K D6R90 + Adafruit 1119 | Wrong switch types for D-pad | C&K PTS525SM15SMTR2 LFS (×5) |
| SW1 | Adam Tech SW-R3-1A-A-1-0 (rocker) | Bulky for handheld | C&K JS102011SAQN (SMD slide) |
| U2 | Winstar WEA012864DWPP3N00003 | 30-pin FPC complex footprint | Universal Solder OLED-128x64-0.96-I2C (optional) |

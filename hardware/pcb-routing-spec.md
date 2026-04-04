# Clay Counter — PCB Routing Spec (Rev 4.0)

## Design Rules (Minimum)

| Rule | Value |
|------|-------|
| Trace to trace clearance | 0.2mm |
| Trace to copper pour clearance | 0.3mm |
| Copper to board edge | 0.3mm |
| Min trace width | 0.2mm |
| Min via drill | 0.3mm |
| Min via annular ring | 0.15mm |

---

## Trace Widths by Net

| Net | Width | Notes |
|-----|-------|-------|
| VBUS_5V | 0.8mm | Step down to 0.5mm at pad if needed |
| SWITCHED_BATT | 0.8mm | Battery output current path |
| RAW | 0.8mm | LDO input current path |
| BATT_POS / BATT_NEG | 0.8mm | Direct battery connection |
| VCC_3V3 | 0.5mm | 3.3V rail |
| GND | Flood fill | Pour on both layers, stitched with vias |
| I2C_SDA / I2C_SCL | 0.25mm | Keep equal length |
| USB_DP / USB_DN | 0.25mm | Route together, equal length, no sharp corners |
| NAV_UP/DOWN/LEFT/RIGHT/SELECT | 0.25mm | Signal only |
| BAT_SENSE | 0.25mm | ADC signal — keep away from switching noise |
| RST | 0.25mm | Signal only |
| CC1 / CC2 | 0.25mm | Signal only |

---

## Via Sizes by Type

| Type | Drill | Pad Diameter | Annular Ring | Use |
|------|-------|-------------|--------------|-----|
| GND stitch | 0.4mm | 0.8mm | 0.2mm | GND pour stitching, under ESP32 exposed pad |
| Signal bypass | 0.3mm | 0.6mm | 0.15mm | CC1, CC2, NAV, RST, I2C, USB_DP/DN, BAT_SENSE |
| Power bypass | 0.4mm | 0.8mm | 0.2mm | VBUS_5V, RAW, SWITCHED_BATT, VCC_3V3 |

---

## GND Pour Stitching Guidelines

- Stitch top and bottom GND pours every 10–15mm across the board
- Place a GND via adjacent to every IC GND pin (U1, U2, U3, J2 SHELL)
- Cluster vias under ESP32 exposed pad — connect to bottom GND pour
- Place vias next to decoupling caps C1–C4 to minimise return path length

---

## Notes

- Do not place vias directly under through-hole pads
- Via-in-pad (under SMD pads) is possible but avoid for fab simplicity — place adjacent instead
- Taper wide power traces to pad width in the final segment before the pad
- Mounting holes: M2.5, 2.7mm drill, NPTH, 6mm keepout diameter

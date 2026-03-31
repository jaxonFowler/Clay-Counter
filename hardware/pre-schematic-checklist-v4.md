# Pre-Schematic Checklist — Rev 4.0

---

## Remove from Schematic
- [x] U3 — AT24C32 EEPROM (SDA, SCL, VCC, GND, A0–A2, WP all disconnected)
- [x] J2 — FTDI 6-pin header + DTR net
- [x] C4 — AT24C32 decoupling cap
- [x] C5 — DTR auto-reset cap

## Altium Library — Remove
- [x] AT24C32E-SSHM-T symbol + footprint

## Altium Library — Add
- [x] ESP32-C3 Mini module — symbol + footprint (pending module choice)
- [x] MCP1700-3302E SOT-23 — symbol + footprint (pending LDO decision)

## Decisions Made
- [x] **Module:** ESP32-C3-MINI-1 bare module (castellated pads, 13.2×16.6mm)
- [x] **LDO:** U4 MCP1700-3302E confirmed required — bare module has no onboard LDO
- [x] **Programming:** J3 USB-C on PCB (D+→GPIO19, D−→GPIO18, R10/R11 CC resistors)

## Still Required
- [x] **Battery connection** → JST-PH 2-pin on PCB, wire leads to external 18650 holder
- [x] **GPIO2 strapping** → GPIO2 (NAV_UP) has pull-down → LOW at boot — verify against ESP32-C3 datasheet that this doesn't cause a boot issue

## Before Running ERC
- [ ] All components have footprints assigned
- [ ] Net classes set: PWR, GND, I2C, BTN
- [ ] Title block updated: Rev 4.0

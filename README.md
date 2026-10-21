# Clay Target Hit/Miss Counter

A pocket-sized, battery-powered scorekeeper for clay shooting. Press a button after each target and it tracks hits and misses using the rules of each sport, then saves the round so you can review it later or pull it to your phone over Bluetooth.

<!-- Add a PCB render here: in Altium, open ClayCounterPCB.PcbDoc, press 3, then File > Export > PNG. Save it as docs/images/pcb-3d.png and uncomment the next line. -->
<!-- ![V2.0 PCB, 3D view](docs/images/pcb-3d.png) -->

## Features

- **Game modes:** trap, skeet, sporting clays and 5-stand, plus a quick-count mode for practice
- **One-handed scoring:** Up = hit, Down = miss, Select = undo; long-press Select to open the menu
- **Session history:** up to 25 saved rounds in on-chip flash (ESP32 NVS)
- **Bluetooth Low Energy:** a phone can read session history on demand (read-only)
- **Battery gauge:** 18650 cell monitored through an ADC divider and shown on screen
- **USB-C:** one port for both programming and charging

## Hardware

| Version | MCU | Status | Files |
| --- | --- | --- | --- |
| **V2.0** | ESP32-C3-MINI-1 (bare module) | Schematic complete, PCB layout DRC clean | [Schematic PDF](hardware/ClayCounterCircuit-V2.0.pdf) · [PCB PDF](hardware/Clay_Counter-Altium/ClayCounterPCB.pdf) · [BOM](hardware/Clay%20Counter%20BOM%20-%20Rev4.0.xlsx) |
| V1 | Arduino Pro Mini (ATmega328P, 3.3 V / 8 MHz) | Schematic complete, superseded | [Schematic PDF](hardware/ClayCounterCircuit.pdf) |

### V2.0 key parts

| Ref | Part | Role |
| --- | --- | --- |
| U1 | ESP32-C3-MINI-1 | MCU with BLE 5.0, 160 MHz, 4 MB flash |
| U2 | 1.3" SSD1306 OLED, 128×64, I²C | Display |
| U3 | MCP1700T-3302E LDO (SOT-23) | 3.3 V regulator (the bare module has no onboard LDO) |
| J1 | TP4056 + DW01A module | Li-ion charging and battery protection |
| J2 | GCT USB4085 USB-C | Programming (native USB on GPIO18/19) and charging |
| SW_NAV1–5 | Omron B3F tactile switches | 5-way D-pad, active high with 10 kΩ pull-downs |

### Power path

```
USB-C (J2) ──VBUS──► TP4056 + DW01A ──► 18650 cell
                          │
                       OUT+ ──► SW1 power switch ──► MCP1700 LDO ──► 3.3 V rail ──► ESP32-C3, OLED
                          │
                          └──► 100k / 100k divider ──► GPIO0 (ADC) battery sense
```

### Pin map (V2.0)

| GPIO | Function |
| --- | --- |
| 8 / 9 | I²C SDA / SCL (OLED) |
| 2 | Up (hit) |
| 3 | Down (miss) |
| 4 | Left (back) |
| 5 | Right (forward) |
| 6 | Select (undo, long-press for menu) |
| 0 | Battery sense (ADC1) |
| 18 / 19 | USB D− / D+ (reserved) |

## Firmware

C++ on the Arduino framework, built with [PlatformIO](https://platformio.org/) for `esp32-c3-devkitm-1`. Source is in [`firmware/ClayCounterFirmware/`](firmware/ClayCounterFirmware/), and the design plan is in [`firmware/FIRMWARE_PLAN.md`](firmware/FIRMWARE_PLAN.md).

| Module | What it does | Status |
| --- | --- | --- |
| `display` | Menu, mode select, live scoring, session summary and history screens | Implemented |
| `buttons` | Debounce (20 ms) and long-press (600 ms) detection | Implemented |
| `game` | Hit, miss, undo, station advance, session finalize | In progress |
| `main` | Top-level state machine | Skeleton |
| `storage` | Save and load sessions in NVS | Planned |
| `ble` | Read-only BLE service for session history | Planned |

To build and flash:

```
cd firmware/ClayCounterFirmware
pio run -t upload
```

## Repository layout

| Folder | Contents |
| --- | --- |
| `hardware/` | Altium Designer project, custom schematic and footprint libraries, schematic PDFs, BOM, routing spec |
| `firmware/` | PlatformIO firmware project and firmware plan |
| `case/` | SolidWorks enclosure (planned) |
| `docs/` | Design notes |
| `schematic-viewer/` | React + Vite page for viewing the schematic in a browser |

## Roadmap

- [x] V1 schematic (Pro Mini)
- [x] V2.0 schematic (ESP32-C3)
- [x] V2.0 PCB layout (DRC clean)
- [ ] Resolve GPIO2 strapping before ordering
- [x] Display and button drivers
- [ ] Game logic for all four sports
- [ ] Session storage and BLE sync
- [ ] Order and assemble first boards
- [ ] SolidWorks enclosure
- [ ] Planned display upgrade: 1.69" 240×280 ST7789V2 color IPS over SPI

## Tools

Altium Designer · SolidWorks · C++ / PlatformIO · CLion

---

Built by [Jaxon Fowler](https://www.linkedin.com/in/jaxonfowler/)

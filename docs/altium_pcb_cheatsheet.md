# Altium PCB Layout — Cheat Sheet
## For: Clay Counter Rev 3.0

---

## 1. Transfer Schematic to PCB

1. In Altium, with schematic open: **Design → Update PCB Document**
2. Click **Validate Changes** — all should pass
3. Click **Execute Changes** — components appear in PCB editor as a cluster off to the side
4. Click **Close**

---

## 2. Set Up the Board Outline

1. Switch to the **Mechanical 1** layer (or **Board Shape** layer)
2. Use **Place → Line** to draw your board outline
3. Or: **Design → Board Shape → Define from Selected Objects** if you draw it first
4. Keep it slightly smaller than your enclosure cavity to allow for wall thickness

---

## 3. Layer Stack (what each layer is)

| Layer | Purpose |
|-------|---------|
| Top Overlay | Silkscreen (labels, outlines) |
| Top Solder | Solder mask top |
| Top Layer | Top copper traces |
| Bottom Layer | Bottom copper traces |
| Mechanical 1 | Board outline |

For this project a **2-layer board** is fine.

---

## 4. Place Components

- Select a component and drag it onto the board
- **Rotate:** Press `Space` while dragging
- **Flip to bottom:** Press `L` while dragging
- Try to keep components **grouped by function** (power section together, buttons together, etc.)
- Place the Pro Mini roughly centre — everything connects back to it
- Keep the OLED and EEPROM close to the Pro Mini (short I2C traces)
- Keep decoupling caps (C2–C4) close to their respective ICs
- Place the FTDI header on an edge for easy access

**Ratsnest lines** (thin lines between pads) show unconnected nets — your job is to eliminate them all.

---

## 5. Design Rules Setup

**Design → Rules** — key rules to check/set:

| Rule | Suggested Value |
|------|----------------|
| Clearance (trace to trace) | 0.2mm min |
| Trace width (signal) | 0.25mm min |
| Trace width (power) | 0.5mm+ |
| Via size | 0.8mm drill, 1.2mm pad |

For hobby/JLCPCB manufacturing, 0.2mm clearance and 0.25mm trace width are safe minimums.

---

## 6. Route Traces

- **Interactive Router:** Press `X` to start routing, click a pad, route to destination, click to finish
- **Change trace width on the fly:** Press `W` while routing
- **45° corners:** Default — keep this, avoid 90° corners
- **Complete a route:** Double-click or click destination pad
- **Cancel:** Press `Esc`

**Route power nets first** (VCC_3V3, GND, RAW, SWITCHED_BATT) with wider traces (0.5mm+), then signal traces.

---

## 7. Ground Plane (recommended)

Instead of routing GND traces manually, use a **copper pour**:

1. Select **Bottom Layer**
2. **Place → Polygon Pour**
3. Set net to **GND**
4. Draw a rectangle covering the whole board
5. Right-click → **Polygon Actions → Repour All**

This fills all unused bottom copper with GND — cleaner and better for noise.

---

## 8. Useful Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Rotate component 90° |
| `L` | Flip component to other side |
| `X` | Start interactive routing |
| `Esc` | Cancel current action |
| `~` | Switch active layer |
| `3` | Toggle 3D view |
| `2` | Back to 2D view |
| `Ctrl+D` | View configuration |
| `Ctrl+M` | Measure distance |
| `T` + `G` | Toggle grid size |

---

## 9. Design Rule Check (DRC)

When routing is done: **Tools → Design Rule Check → Run DRC**

Fix all errors before sending to fab. Warnings are usually OK.

---

## 10. Export Gerbers for Fabrication (JLCPCB etc.)

1. **File → Fabrication Outputs → Gerber Files**
2. Select all layers, click OK
3. **File → Fabrication Outputs → NC Drill Files**
4. Zip the output folder and upload to fab house

---

## Tips for This Board

- **D-pad buttons:** Place in a cross pattern, ~8–10mm centre-to-centre
- **FTDI header (J2):** Place on an edge, accessible from outside enclosure
- **Power switch (SW1):** Place on an edge
- **USB-C / TP4056 module (J1):** Place so USB port is accessible from enclosure
- **Check 3D view often:** Press `3` to verify component heights won't clash with enclosure lid

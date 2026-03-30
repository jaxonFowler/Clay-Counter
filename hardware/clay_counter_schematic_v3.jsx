import { useState } from "react";

const C = {
  pwr: "#e74c3c", gnd: "#2c3e50", i2c: "#2980b9",
  btn: "#27ae60", ctrl: "#8e44ad", net: "#e67e22",
  bg: "#f8f9fa", card: "#ffffff", border: "#dee2e6",
  header: "#2c3e50", headerText: "#ffffff",
};

const NewBadge = ({ label = "NEW" }) => (
  <span style={{ background: "#f39c12", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 6, verticalAlign: "middle" }}>{label}</span>
);

const ChangedBadge = () => (
  <span style={{ background: "#8e44ad", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 6, verticalAlign: "middle" }}>CHANGED</span>
);

const RemovedBadge = () => (
  <span style={{ background: "#95a5a6", color: "#fff", borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700, marginLeft: 6, verticalAlign: "middle" }}>REMOVED</span>
);

const SectionHeader = ({ title, color }) => (
  <div style={{ background: color || C.header, color: "#fff", fontWeight: 700, fontSize: 13, padding: "6px 12px", borderRadius: "6px 6px 0 0", letterSpacing: 0.5, textTransform: "uppercase" }}>{title}</div>
);

const Note = ({ type, children }) => {
  const s = { warning: { bg: "#fff3cd", border: "#ffc107", icon: "⚠️" }, info: { bg: "#d1ecf1", border: "#17a2b8", icon: "ℹ️" }, critical: { bg: "#f8d7da", border: "#dc3545", icon: "🔴" }, new: { bg: "#fff8e6", border: "#f39c12", icon: "✨" } }[type] || { bg: "#d1ecf1", border: "#17a2b8", icon: "ℹ️" };
  return <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 6, padding: "8px 12px", marginBottom: 10, fontSize: 12 }}>{s.icon} {children}</div>;
};

const NetRow = ({ net, color, items, badge }) => (
  <tr style={{ borderBottom: `1px solid ${C.border}`, background: badge === "new" ? "#fffbf0" : badge === "removed" ? "#f5f5f5" : undefined }}>
    <td style={{ padding: "6px 10px", fontWeight: 700, color: badge === "removed" ? "#aaa" : color, fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap", textDecoration: badge === "removed" ? "line-through" : "none" }}>
      {net}{badge === "new" && <NewBadge />}{badge === "changed" && <ChangedBadge />}{badge === "removed" && <RemovedBadge />}
    </td>
    <td style={{ padding: "6px 10px", fontSize: 12, color: badge === "removed" ? "#aaa" : undefined }}>
      {items.map((item, i) => (
        <span key={i} style={{ marginRight: 6 }}>
          <span style={{ fontFamily: "monospace", background: "#f0f0f0", borderRadius: 3, padding: "1px 5px", fontSize: 11 }}>{item}</span>
        </span>
      ))}
    </td>
  </tr>
);

const PowerDiagram = () => (
  <div style={{ background: "#1e2d3d", borderRadius: 8, padding: 16, marginBottom: 16, fontFamily: "monospace", fontSize: 11, color: "#cdd9e5", lineHeight: 1.9 }}>
    <div style={{ color: "#79c0ff", fontWeight: 700, marginBottom: 8, fontSize: 13 }}>⚡ POWER CHAIN — Rev 4.0</div>
    <div><span style={{ color: "#ffa657" }}>18650 Cell</span> ──BATT_POS──▶ <span style={{ color: "#7ee787" }}>TP4056 B+</span></div>
    <div><span style={{ color: "#ffa657" }}>18650 Cell</span> ──BATT_NEG──▶ <span style={{ color: "#7ee787" }}>TP4056 B−</span> ──▶ <span style={{ color: "#ff7b72" }}>GND</span></div>
    <div style={{ marginTop: 4 }}><span style={{ color: "#8b949e" }}>PCB USB-C (J2)</span> ──VBUS_5V──▶ <span style={{ color: "#7ee787" }}>J1 IN+</span> <span style={{ color: "#8b949e" }}>(charging — TP4056 module USB-C desoldered, wired to PCB footprint pads)</span></div>
    <div style={{ color: "#8b949e", fontSize: 10, marginLeft: 8 }}>C4 (4.7µF): VBUS_5V to GND</div>
    <div style={{ marginTop: 4 }}><span style={{ color: "#7ee787" }}>TP4056 OUT+</span> ──SWITCHED_BATT──▶ <span style={{ color: "#d2a8ff" }}>SW1</span> ──RAW──▶ <span style={{ color: "#ffa657" }}>U3 LDO IN</span> ──▶ <span style={{ color: "#79c0ff" }}>VCC_3V3</span> ──▶ <span style={{ color: "#ffa657" }}>U1 3V3 pin</span></div>
    <div><span style={{ color: "#7ee787" }}>TP4056 OUT+</span> ──▶ R8 (100kΩ) ──▶ BAT_SENSE ──▶ R9 (100kΩ) ──▶ GND</div>
    <div>BAT_SENSE ──▶ <span style={{ color: "#ffa657" }}>U1 GPIO0</span> <span style={{ color: "#8b949e" }}>(ADC)</span></div>
    <div style={{ marginTop: 8 }}><span style={{ color: "#8b949e" }}>PCB USB-C (J2)</span> ──USB_DP/USB_DN──▶ <span style={{ color: "#ffa657" }}>U1 GPIO19/18</span> <span style={{ color: "#8b949e" }}>(programming)</span></div>
    <div style={{ color: "#8b949e", fontSize: 10 }}>J2 CC1 ──R10 (5.1kΩ)──▶ GND  |  J2 CC2 ──R11 (5.1kΩ)──▶ GND</div>
    <div style={{ marginTop: 8, color: "#8b949e", fontSize: 10 }}>C1 (10µF): RAW to GND  |  C2–C3 (100nF): VCC_3V3 near OLED and LDO output  |  C4 (4.7µF): VBUS_5V to GND</div>
  </div>
);

const DpadDiagram = () => (
  <div style={{ background: "#1e2d3d", borderRadius: 8, padding: 16, marginBottom: 16, fontFamily: "monospace", fontSize: 11, color: "#cdd9e5", lineHeight: 1.7 }}>
    <div style={{ color: "#79c0ff", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>🎮 D-PAD LAYOUT (Case Top View)</div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 24 }}></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>UP<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>GPIO2 / HIT</span></div>
        <div style={{ width: 24 }}></div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>LEFT<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>GPIO4 / BACK</span></div>
        <div style={{ background: "#8e44ad", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>SEL<br /><span style={{ fontSize: 9, color: "#d7a8f0" }}>GPIO6 / UNDO</span></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>RIGHT<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>GPIO5 / FWD</span></div>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 24 }}></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>DOWN<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>GPIO3 / MISS</span></div>
        <div style={{ width: 24 }}></div>
      </div>
    </div>
    <div style={{ marginTop: 12, color: "#8b949e", fontSize: 10, textAlign: "center" }}>
      Shooting mode: UP=Hit · DOWN=Miss · SELECT=Undo last &nbsp;|&nbsp; Menu mode: all 5 buttons navigate
    </div>
  </div>
);

const tabs = ["Netlist", "Components", "Notes", "Board Spec"];

export default function Schematic() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.header }}>Clay Counter — Schematic Reference</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <p style={{ fontSize: 12, color: "#666", margin: 0 }}>Altium entry guide · ESP32-C3-MINI-1 (bare) · USB-C · BLE</p>
            <span style={{ background: "#e74c3c", color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>Rev 4.0</span>
          </div>
          <div style={{ marginTop: 8, background: "#fdecea", border: "1px solid #e74c3c", borderRadius: 6, padding: "6px 12px", fontSize: 11 }}>
            🔄 Rev 4.0: MCU → ESP32-C3-MINI-1 bare module (BLE 5.0) · USB-C programming port on PCB (J2) · AT24C32 EEPROM removed (NVS flash) · FTDI header removed · PCB LDO U3 confirmed (bare module has none) · R10/R11 CC resistors added · C4/C5 removed
          </div>
        </div>

        <PowerDiagram />
        <DpadDiagram />

        <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
          {tabs.map((t, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{ padding: "7px 16px", borderRadius: 6, border: "none", fontWeight: 600, fontSize: 13, cursor: "pointer", background: activeTab === i ? C.header : "#e9ecef", color: activeTab === i ? "#fff" : "#555" }}>{t}</button>
          ))}
        </div>

        {activeTab === 0 && (
          <div>
            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="Net List — Rev 4.0" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f4f4" }}>
                    <th style={{ padding: "6px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>NET NAME</th>
                    <th style={{ padding: "6px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>CONNECTED PINS</th>
                  </tr>
                </thead>
                <tbody>
                  <NetRow net="BATT_POS" color={C.pwr} items={["BT1 +", "TP4056 B+"]} />
                  <NetRow net="GND" color={C.gnd} items={["BT1 −", "TP4056 B−/OUT−", "U1 GND", "U2 GND", "U3 GND", "J2 GND", "SW2 pin2", "R3–R7 pin2", "R9 pin2", "R10 pin2", "R11 pin2", "C1 −", "C2 −", "C3 −", "C4 −", "TP2"]} badge="changed" />
                  <NetRow net="VBUS_5V" color={C.pwr} items={["J2 VBUS", "J1 IN+", "C4 +"]} badge="new" />
                  <NetRow net="SWITCHED_BATT" color={C.net} items={["TP4056 OUT+", "SW1 pin1", "R8 pin1"]} />
                  <NetRow net="RAW" color={C.pwr} items={["SW1 pin2", "U3 IN", "C1 +"]} badge="changed" />
                  <NetRow net="VCC_3V3" color={C.pwr} items={["U3 OUT", "U1 3V3", "U2 VCC", "R1 pin1", "R2 pin1", "SW_NAV1–5 pin1", "C2 +", "C3 +", "TP1"]} badge="changed" />
                  <NetRow net="I2C_SDA" color={C.i2c} items={["U1 GPIO8", "U2 SDA", "R1 pin2", "TP3"]} badge="changed" />
                  <NetRow net="I2C_SCL" color={C.i2c} items={["U1 GPIO9", "U2 SCL", "R2 pin2", "TP4"]} badge="changed" />
                  <NetRow net="BAT_SENSE" color={C.ctrl} items={["R8 pin2", "R9 pin1", "U1 GPIO0"]} badge="changed" />
                  <NetRow net="RST" color={C.ctrl} items={["U1 EN", "SW2 pin1"]} badge="changed" />
                  <NetRow net="NAV_UP" color={C.btn} items={["U1 GPIO2", "SW_NAV1 pin2", "R3 pin1"]} badge="changed" />
                  <NetRow net="NAV_DOWN" color={C.btn} items={["U1 GPIO3", "SW_NAV2 pin2", "R4 pin1"]} badge="changed" />
                  <NetRow net="NAV_LEFT" color={C.btn} items={["U1 GPIO4", "SW_NAV3 pin2", "R5 pin1"]} badge="changed" />
                  <NetRow net="NAV_RIGHT" color={C.btn} items={["U1 GPIO5", "SW_NAV4 pin2", "R6 pin1"]} badge="changed" />
                  <NetRow net="NAV_SELECT" color={C.btn} items={["U1 GPIO6", "SW_NAV5 pin2", "R7 pin1"]} badge="changed" />
                  <NetRow net="USB_DP" color={C.ctrl} items={["J2 DP1", "U1 GPIO19"]} badge="new" />
                  <NetRow net="USB_DN" color={C.ctrl} items={["J2 DP2", "U1 GPIO18"]} badge="new" />
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, padding: 12, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Reference Designators — Rev 4.0</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["U1", "ESP32-C3-MINI-1 — bare Espressif module, castellated pads, 13.2×16.6mm, PCB antenna", "changed"],
                    ["U2", "CANADUINO 26295 — 1.3\" I2C OLED (SSD1306/SH1106), 4-pin 2.54mm header", null],
                    ["U3", "MCP1700T-3302E/TT — 3.3V LDO, SOT-23. RAW → VCC_3V3", null],
                    ["J1", "TP4056 + DW01A module — battery charging and protection. Onboard USB-C desoldered; IN+/IN− wired to custom PCB footprint pads (VBUS_5V / GND).", null],
                    ["J2", "GCT USB4085-GF-A — USB-C receptacle. Programming (DP1→GPIO19, DP2→GPIO18) + charging (VBUS→VBUS_5V→J1 IN+). CC1/CC2→R10/R11→GND. Single USB-C for both functions.", null],
                    ["BT1", "2-pin solder pads on PCB — 18650 wire leads soldered directly (BATT_POS / GND)", null],
                    ["SW1", "C&K JS102011SAQN — SPDT slide switch. Common=SWITCHED_BATT, throw A=RAW, throw B=NC", null],
                    ["SW2", "Omron B3F-1000 — reset button. One side=RST (U1 EN), other side=GND", null],
                    ["SW_NAV1", "Omron B3F-1000 — UP (Hit in shooting mode). pin1=VCC_3V3, pin2=NAV_UP", null],
                    ["SW_NAV2", "Omron B3F-1000 — DOWN (Miss in shooting mode). pin1=VCC_3V3, pin2=NAV_DOWN", null],
                    ["SW_NAV3", "Omron B3F-1000 — LEFT (Back). pin1=VCC_3V3, pin2=NAV_LEFT", null],
                    ["SW_NAV4", "Omron B3F-1000 — RIGHT (Forward). pin1=VCC_3V3, pin2=NAV_RIGHT", null],
                    ["SW_NAV5", "Omron B3F-1000 — SELECT (Undo/Confirm). pin1=VCC_3V3, pin2=NAV_SELECT", null],
                    ["R1", "4.7kΩ — I2C SDA pull-up", null],
                    ["R2", "4.7kΩ — I2C SCL pull-up", null],
                    ["R3", "10kΩ — NAV_UP pull-down", null],
                    ["R4", "10kΩ — NAV_DOWN pull-down", null],
                    ["R5", "10kΩ — NAV_LEFT pull-down", null],
                    ["R6", "10kΩ — NAV_RIGHT pull-down", null],
                    ["R7", "10kΩ — NAV_SELECT pull-down", null],
                    ["R8", "100kΩ — BAT_SENSE upper divider", null],
                    ["R9", "100kΩ — BAT_SENSE lower divider", null],
                    ["R10", "5.1kΩ — J2 CC1 to GND (USB-C cable orientation)", "new"],
                    ["R11", "5.1kΩ — J2 CC2 to GND (USB-C cable orientation)", "new"],
                    ["C1", "10µF ceramic 16V X5R 0603 — RAW bulk decoupling", null],
                    ["C2", "100nF ceramic 16V X7R 0603 — VCC_3V3 decoupling near OLED", null],
                    ["C3", "100nF ceramic 16V X7R 0603 — VCC_3V3 decoupling at LDO output", "changed"],
                    ["C4", "4.7µF ceramic 10V X5R 0603 — VBUS_5V decoupling (J2 VBUS to J1 IN+)", "new"],
                    ["TP1–TP4", "Test points: VCC_3V3, GND, SDA, SCL", null],
                  ].map(([ref, desc, badge], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: badge === "new" ? "#fffbf0" : badge === "changed" ? "#f3e8ff" : badge === "removed" ? "#f5f5f5" : (i % 2 ? "#fafafa" : "#fff") }}>
                      <td style={{ padding: "4px 10px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, width: 100, color: badge === "removed" ? "#aaa" : undefined, textDecoration: badge === "removed" ? "line-through" : "none" }}>{ref}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, color: badge === "removed" ? "#aaa" : undefined }}>
                        {desc}
                        {badge === "new" && <NewBadge />}
                        {badge === "changed" && <ChangedBadge />}
                        {badge === "removed" && <RemovedBadge />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="U1 — ESP32-C3-MINI-1 Pin Assignments" color="#c0392b" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f4f4" }}>
                    <th style={{ padding: "5px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>PIN</th>
                    <th style={{ padding: "5px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>NET</th>
                    <th style={{ padding: "5px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>FUNCTION</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["3V3", "VCC_3V3", C.pwr, "3.3V input from PCB LDO (U3)"],
                    ["GND", "GND", C.gnd, "Ground"],
                    ["EN", "RST", C.ctrl, "Reset — SW2 pull to GND to reset"],
                    ["GPIO0", "BAT_SENSE", C.ctrl, "ADC1 ch0 — battery voltage monitor"],
                    ["GPIO2", "NAV_UP", C.btn, "UP · Shooting: Hit"],
                    ["GPIO3", "NAV_DOWN", C.btn, "DOWN · Shooting: Miss"],
                    ["GPIO4", "NAV_LEFT", C.btn, "LEFT · Back / Cancel"],
                    ["GPIO5", "NAV_RIGHT", C.btn, "RIGHT · Forward"],
                    ["GPIO6", "NAV_SELECT", C.btn, "SELECT · Shooting: Undo · Long-press: Mode"],
                    ["GPIO8", "I2C_SDA", C.i2c, "Hardware I2C SDA — OLED"],
                    ["GPIO9", "I2C_SCL", C.i2c, "Hardware I2C SCL — OLED (HIGH at boot via R2 pull-up ✓)"],
                    ["GPIO18", "USB_DN", C.ctrl, "USB DP2 → J2 DP2 (PCB USB-C programming port)"],
                    ["GPIO19", "USB_DP", C.ctrl, "USB DP1 → J2 DP1 (PCB USB-C programming port)"],
                    ["GPIO1, 7, 10+", "UNCONNECTED", "#ccc", "Available for future use"],
                  ].map(([pin, net, color, fn], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "5px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{pin}</td>
                      <td style={{ padding: "5px 10px", fontFamily: "monospace", fontSize: 12, color }}>{net}</td>
                      <td style={{ padding: "5px 10px", fontSize: 11, color: "#666" }}>{fn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="SW_NAV1–5 — D-Pad Button Wiring (×5, identical)" color="#27ae60" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  {[
                    ["Pin 1 (all)", "VCC_3V3", C.pwr, "HIGH side of each button."],
                    ["Pin 2 (each)", "NAV_UP / DOWN / LEFT / RIGHT / SELECT", C.btn, "To ESP32 GPIO and pull-down resistor. LOW at rest, HIGH when pressed."],
                    ["R3–R7 (each)", "NAV net → GND", C.gnd, "10kΩ pull-down per button."],
                  ].map(([pin, net, color, note], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "5px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700 }}>{pin}</td>
                      <td style={{ padding: "5px 10px", fontFamily: "monospace", fontSize: 12, color }}>{net}</td>
                      <td style={{ padding: "5px 10px", fontSize: 11, color: "#666" }}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, padding: 12, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Full Passives BOM — Rev 4.0</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["R1, R2", "4.7kΩ 1/4W", "2×", "I2C SDA/SCL pull-ups to VCC_3V3"],
                    ["R3–R7", "10kΩ 1/4W", "5×", "Nav button pull-downs to GND"],
                    ["R8, R9", "100kΩ 1/4W", "2×", "Battery voltage divider"],
                    ["R10, R11", "5.1kΩ 1/4W", "2×", "USB-C CC1/CC2 pull-downs — required for host to supply 5V"],
                    ["C1", "10µF ceramic 16V X5R 0603 (YAGEO CC0603KRX5R7BB106)", "1×", "RAW bulk decoupling"],
                    ["C2, C3", "100nF ceramic 16V X7R 0603 (KEMET C0603C104J4RACTU)", "2×", "VCC_3V3 decoupling (OLED + LDO output)"],
                  ].map(([ref, val, qty, note], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "4px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, width: 80 }}>{ref}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, width: 160 }}>{val}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, width: 40, color: "#888" }}>{qty}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, color: "#666" }}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <Note type="critical">
              <strong>ESP32-C3 strapping pins — verify before finalizing GPIOs:</strong> GPIO9 must be HIGH at boot for normal operation (LOW = enters download mode). GPIO9 is assigned to I2C_SCL which has a 4.7kΩ pull-up → HIGH at boot ✓. GPIO2 (NAV_UP) has a pull-down → LOW at boot — verify this does not cause issues on the chosen module.
            </Note>
            <Note type="info">
              <strong>3V3 pin input:</strong> ESP32-C3-MINI-1 bare module VDD pin is a power input — confirmed. MCP1700 LDO output connects directly here. No verification needed.
            </Note>
            <Note type="new">
              <strong>USB-C programming port (J2):</strong> DP1 → GPIO19, DP2 → GPIO18. CC1 and CC2 each get a 5.1kΩ resistor to GND — this tells the host to supply 5V. VBUS is present on the connector but not connected to the power rail (ESP32 runs from battery via U3 LDO). No USB-to-UART bridge chip needed — ESP32-C3 has built-in USB.
            </Note>
            <Note type="info">
              <strong>LDO confirmed (U3 MCP1700-3302E):</strong> ESP32-C3-MINI-1 bare module has no onboard LDO — requires regulated 3.3V on its VDD pin. MCP1700 dropout is ~178mV at 250mA, ~72mV at 100mA. At typical load (~120mA) min input ≈ 3.39V. Battery min is 3.5V — adequate margin.
            </Note>
            <Note type="new">
              <strong>BLE:</strong> Use NimBLE-Arduino library. Device advertises a read-only characteristic. Phone connects to pull session history (JSON or binary struct). No phone control of device.
            </Note>
            <Note type="new">
              <strong>Session storage:</strong> Use <code>Preferences.h</code> (ESP32 NVS) instead of AT24C32 EEPROM. NVS handles wear leveling automatically. AT24C32 and its I2C connections are fully removed.
            </Note>
            <Note type="new">
              <strong>Button context switching:</strong> Use a state variable (<code>enum Mode {"{"} SHOOTING, MENU {"}"}</code>). In SHOOTING mode: GPIO2=Hit, GPIO3=Miss, GPIO6=Undo. In MENU: all 5 navigate. Long-press SELECT (~1s) toggles modes.
            </Note>
            <Note type="info">
              <strong>Battery display formula (12-bit ADC):</strong> <code>V_batt = (analogRead(GPIO0) / 4095.0) × 3.3 × 2</code>. Map 3.5–4.2V to 0–100%. ESP32 ADC has nonlinearity near rails — consider a calibration offset.
            </Note>
            <Note type="info">
              <strong>Debounce:</strong> Handle in firmware. 20–50ms debounce per button in software. ESP32 has more than enough cycles for this.
            </Note>
            <Note type="info">
              <strong>D-pad PCB placement:</strong> Place 5 button footprints in a true cross — UP/DOWN vertical, LEFT/RIGHT horizontal, SELECT centered. ~8–10mm center-to-center. Export STEP to SolidWorks before finalizing.
            </Note>
            <Note type="info">
              <strong>Two USB-C ports on device:</strong> TP4056 USB-C = charging. ESP32 USB-C = programming. Both need to be accessible from the enclosure — plan cutout locations in SolidWorks accordingly.
            </Note>
            <Note type="warning">
              <strong>I2C:</strong> Only one device on bus now — OLED at 0x3C. R1/R2 pull-ups still required.
            </Note>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, padding: 12, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Rev History</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["Rev 1.0", "Initial schematic — Pro Mini, OLED, EEPROM, 3 buttons, power chain"],
                    ["Rev 2.0", "Added battery voltage divider, external reset, FTDI header, test points"],
                    ["Rev 3.0", "Replaced 3 individual buttons with 5-button nav D-pad cluster. Hit/Miss/Reset context-mapped in firmware. R3–R5 renumbered, R6–R7 added, divider resistors renumbered R8–R9."],
                    ["Rev 4.0", "MCU replaced: Arduino Pro Mini → ESP32-C3-MINI-1 bare module (BLE 5.0, WiFi). AT24C32 EEPROM removed (use NVS flash). FTDI header removed. PCB USB-C programming port J2 added (GCT USB4085-GF-A) with R10/R11 CC resistors. PCB LDO U3 (MCP1700-3302E) added. C4/C5 removed. GPIO assignments updated. ADC formula updated for 12-bit."],
                  ].map(([rev, desc], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "4px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, width: 70, whiteSpace: "nowrap" }}>{rev}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, color: "#555" }}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="Board Fabrication Spec" color="#16a085" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["Layers", "2-layer FR4, 1.6mm thickness"],
                    ["Copper weight", "1oz (35µm) both layers"],
                    ["Min trace/space", "0.15mm / 0.15mm"],
                    ["Min via drill", "0.3mm drill / 0.6mm annular ring"],
                    ["Surface finish", "HASL or ENIG"],
                    ["Solder mask", "Both sides"],
                    ["Silkscreen", "Top side minimum, both sides preferred"],
                    ["Board size", "TBD — define after placing all components in layout"],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, fontSize: 12, width: 160, color: "#444" }}>{k}</td>
                      <td style={{ padding: "6px 10px", fontSize: 12, color: "#555" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="Mechanical Requirements" color="#16a085" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["Mounting holes", "4× M3 (3.2mm drill, 6mm keepout), one at each corner. Min 3mm from board edge to hole center."],
                    ["Board edge clearance", "0.5mm min — no copper, vias, or pads within 0.5mm of board outline"],
                    ["J2 USB-C access", "PCB USB-C programming port (J2) must be at board edge — needs cutout in enclosure"],
                    ["TP4056 USB-C access", "TP4056 module USB-C must also be edge-accessible — plan both ports on same edge or adjacent edges"],
                    ["Power switch access", "SW1 actuator must protrude through enclosure side wall — place near edge"],
                    ["D-pad buttons", "Place centered on top face. ~8–10mm center-to-center. Export STEP to SolidWorks to verify reach."],
                    ["Reset button", "SW2 accessible but recessed or behind a pinhole — avoid accidental press"],
                    ["Display header", "U2 OLED header must align with display window cutout in enclosure lid"],
                    ["Battery", "BT1 solder pads on PCB — 18650 wire leads soldered directly. Allow clearance in enclosure for wire routing and strain relief."],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, fontSize: 12, width: 180, color: "#444", verticalAlign: "top" }}>{k}</td>
                      <td style={{ padding: "6px 10px", fontSize: 12, color: "#555" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="Silkscreen Requirements" color="#16a085" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["All RefDes", "Every component must have its RefDes silkscreened on the top layer"],
                    ["Pin 1 markers", "All ICs and polarised components — dot or triangle for pin 1"],
                    ["Power polarity", "BT1+ / BT1− clearly marked near battery connector"],
                    ["Board revision", "\"Rev 4.0\" on silkscreen"],
                    ["USB-C labels", "Label each USB-C: \"CHARGE\" (TP4056) and \"PROG\" (ESP32)"],
                    ["SW1 orientation", "Mark ON/OFF direction near power switch"],
                    ["3.3V warning", "\"3.3V ONLY\" near ESP32 USB-C port — do not apply 5V to 3V3 rail"],
                    ["Test points", "Label TP1–TP4 with net names: VCC_3V3, GND, SDA, SCL"],
                  ].map(([k, v], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "6px 10px", fontWeight: 700, fontSize: 12, width: 180, color: "#444", verticalAlign: "top" }}>{k}</td>
                      <td style={{ padding: "6px 10px", fontSize: 12, color: "#555" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: 16 }}>
              <SectionHeader title="Complete Component List for Board" color="#16a085" />
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#f4f4f4" }}>
                    <th style={{ padding: "5px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>ITEM</th>
                    <th style={{ padding: "5px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ESP32-C3-MINI-1 bare module (U1)", "Castellated pads, 13.2×16.6mm. Official Espressif footprint available."],
                    ["USB-C receptacle (J2)", "PCB-mount, through-hole or SMD. Place at board edge for cable access. Programming port."],
                    ["OLED display header (U2)", "4-pin 2.54mm female header — display plugs in from top"],
                    ["TP4056 + DW01A module (J1)", "Wire pads or pin header to PCB — check module footprint"],
                    ["MCP1700-3302E LDO (U3)", "SOT-23, 3 pins"],
                    ["Solder pads (BT1)", "2 through-hole pads, 1.0–1.5mm drill. 18650 wire leads soldered directly. Mark BT1+/BT1− on silkscreen."],
                    ["Power slide switch (SW1)", "C&K JS102011SAQN — through-hole"],
                    ["Reset button (SW2)", "Omron B3F-1000 — through-hole"],
                    ["D-pad buttons ×5 (SW_NAV1–5)", "Omron B3F-1000 — through-hole, cross pattern"],
                    ["R1–R11 (11 resistors)", "1/4W through-hole. R10/R11 are 5.1kΩ USB-C CC resistors."],
                    ["C1 (10µF)", "0603 ceramic"],
                    ["C2, C3 (100nF ×2)", "0603 ceramic"],
                    ["Test points TP1–TP4", "VCC_3V3, GND, SDA, SCL — 1mm pad or PTH"],
                    ["Mounting holes ×4", "M3 — non-plated or plated (connect to GND if plated)"],
                  ].map(([item, notes], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "5px 10px", fontFamily: "monospace", fontSize: 11, fontWeight: 700, width: 220, verticalAlign: "top" }}>{item}</td>
                      <td style={{ padding: "5px 10px", fontSize: 12, color: "#555" }}>{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

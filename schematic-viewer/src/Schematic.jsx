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
    <div style={{ color: "#79c0ff", fontWeight: 700, marginBottom: 8, fontSize: 13 }}>⚡ POWER CHAIN</div>
    <div><span style={{ color: "#ffa657" }}>18650 Cell</span> ──BATT_POS──▶ <span style={{ color: "#7ee787" }}>TP4056 B+</span></div>
    <div><span style={{ color: "#ffa657" }}>18650 Cell</span> ──BATT_NEG──▶ <span style={{ color: "#7ee787" }}>TP4056 B−</span> ──▶ <span style={{ color: "#ff7b72" }}>GND</span></div>
    <div style={{ marginTop: 4 }}>USB-C (5V) ──▶ <span style={{ color: "#7ee787" }}>TP4056 IN</span> <span style={{ color: "#8b949e" }}>(charging only)</span></div>
    <div style={{ marginTop: 4 }}><span style={{ color: "#7ee787" }}>TP4056 OUT+</span> ──▶ <span style={{ color: "#d2a8ff" }}>SW1</span> ──▶ <span style={{ color: "#ffa657" }}>Pro Mini RAW</span> ──▶ <span style={{ color: "#ffa657" }}>LDO</span> ──▶ <span style={{ color: "#79c0ff" }}>VCC_3V3</span></div>
    <div><span style={{ color: "#7ee787" }}>TP4056 OUT+</span> ──▶ R6 (100kΩ) ──▶ BAT_SENSE ──▶ R7 (100kΩ) ──▶ GND</div>
    <div>BAT_SENSE ──▶ U1 A0</div>
    <div style={{ marginTop: 8, color: "#8b949e", fontSize: 10 }}>C1 (10µF): RAW to GND  |  C2–C4 (100nF): VCC_3V3 near each IC  |  C5 (100nF): DTR→RST</div>
  </div>
);

const DpadDiagram = () => (
  <div style={{ background: "#1e2d3d", borderRadius: 8, padding: 16, marginBottom: 16, fontFamily: "monospace", fontSize: 11, color: "#cdd9e5", lineHeight: 1.7 }}>
    <div style={{ color: "#79c0ff", fontWeight: 700, marginBottom: 12, fontSize: 13 }}>🎮 D-PAD LAYOUT (Case Top View)</div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 24 }}></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>UP<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>D2 / HIT</span></div>
        <div style={{ width: 24 }}></div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>LEFT<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>D4 / BACK</span></div>
        <div style={{ background: "#8e44ad", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>SEL<br /><span style={{ fontSize: 9, color: "#d7a8f0" }}>D6 / UNDO</span></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>RIGHT<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>D5 / FWD</span></div>
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 24 }}></div>
        <div style={{ background: "#27ae60", borderRadius: 4, padding: "3px 8px", fontSize: 11, color: "#fff", textAlign: "center" }}>DOWN<br /><span style={{ fontSize: 9, color: "#a8f0c6" }}>D3 / MISS</span></div>
        <div style={{ width: 24 }}></div>
      </div>
    </div>
    <div style={{ marginTop: 12, color: "#8b949e", fontSize: 10, textAlign: "center" }}>
      Shooting mode: UP=Hit · DOWN=Miss · SELECT=Undo last &nbsp;|&nbsp; Menu mode: all 5 buttons navigate
    </div>
  </div>
);

const tabs = ["Netlist", "Components", "Notes"];

export default function Schematic() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", padding: 16, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        <div style={{ marginBottom: 16 }}>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.header }}>Clay Counter — Schematic Reference</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <p style={{ fontSize: 12, color: "#666", margin: 0 }}>Altium entry guide · Arduino Pro Mini 3.3V</p>
            <span style={{ background: "#8e44ad", color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>Rev 3.0</span>
          </div>
          <div style={{ marginTop: 8, background: "#f3e8ff", border: "1px solid #8e44ad", borderRadius: 6, padding: "6px 12px", fontSize: 11 }}>
            🔄 Rev 3.0: Replaced 3 individual buttons with 5-button nav cluster · Hit/Miss/Reset now context-mapped in firmware · Net count reduced by 1
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
              <SectionHeader title="Net List — Rev 3.0" />
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f4f4f4" }}>
                    <th style={{ padding: "6px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>NET NAME</th>
                    <th style={{ padding: "6px 10px", fontSize: 11, textAlign: "left", fontWeight: 600, color: "#555" }}>CONNECTED PINS</th>
                  </tr>
                </thead>
                <tbody>
                  <NetRow net="BATT_POS" color={C.pwr} items={["BT1 +", "TP4056 B+"]} />
                  <NetRow net="GND" color={C.gnd} items={["BT1 −", "TP4056 B−/OUT−", "U1 GND×3", "U2 GND", "U3 GND", "U3 A0–A2", "U3 WP", "R3–R7 pin2", "R9–R10 pin2", "C1−", "C2–C5 pin2", "J2 GND/CTS", "SW2 pin2"]} />
                  <NetRow net="SWITCHED_BATT" color={C.net} items={["TP4056 OUT+", "SW1 pin1", "R8 pin1"]} />
                  <NetRow net="RAW" color={C.pwr} items={["SW1 pin2", "U1 RAW", "C1 +"]} />
                  <NetRow net="VCC_3V3" color={C.pwr} items={["U1 VCC", "U2 VCC", "U3 VCC", "R1 pin1", "R2 pin1", "SW_NAV1–5 pin1", "C2–C4 +"]} />
                  <NetRow net="I2C_SDA" color={C.i2c} items={["U1 A4", "U2 SDA", "U3 SDA", "R1 pin2", "TP_SDA"]} />
                  <NetRow net="I2C_SCL" color={C.i2c} items={["U1 A5", "U2 SCL", "U3 SCL", "R2 pin2", "TP_SCL"]} />
                  <NetRow net="BAT_SENSE" color={C.ctrl} items={["R8 pin2", "R9 pin1", "U1 A0"]} />
                  <NetRow net="RST" color={C.ctrl} items={["U1 RST", "SW2 pin1", "C5 pin1", "J2 DTR"]} />
                  <NetRow net="NAV_UP" color={C.btn} items={["U1 D2", "SW_NAV1 pin2", "R3 pin1"]} badge="changed" />
                  <NetRow net="NAV_DOWN" color={C.btn} items={["U1 D3", "SW_NAV2 pin2", "R4 pin1"]} badge="changed" />
                  <NetRow net="NAV_LEFT" color={C.btn} items={["U1 D4", "SW_NAV3 pin2", "R5 pin1"]} badge="changed" />
                  <NetRow net="NAV_RIGHT" color={C.btn} items={["U1 D5", "SW_NAV4 pin2", "R6 pin1"]} badge="new" />
                  <NetRow net="NAV_SELECT" color={C.btn} items={["U1 D6", "SW_NAV5 pin2", "R7 pin1"]} badge="new" />
                  <NetRow net="BTN_HIT" color="#aaa" items={["(firmware: NAV_UP in shooting mode)"]} badge="removed" />
                  <NetRow net="BTN_MISS" color="#aaa" items={["(firmware: NAV_DOWN in shooting mode)"]} badge="removed" />
                  <NetRow net="BTN_RESET_MODE" color="#aaa" items={["(firmware: NAV_SELECT long-press)"]} badge="removed" />
                </tbody>
              </table>
            </div>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, padding: 12, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Reference Designators — Rev 3.0</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["U1", "Arduino Pro Mini 3.3V / 8MHz", null],
                    ["U2", "SSD1306 0.96\" I2C OLED", null],
                    ["U3", "AT24C32 EEPROM module", null],
                    ["J1_TP4056", "TP4056 + DW01A module", null],
                    ["J2", "6-pin FTDI programming header", null],
                    ["BT1", "18650 Li-ion cell in holder", null],
                    ["SW1", "SPST slide switch — main power", null],
                    ["SW2", "Tactile button — external reset", null],
                    ["SW_NAV1", "Tactile button — UP (Hit in shooting mode)", "changed"],
                    ["SW_NAV2", "Tactile button — DOWN (Miss in shooting mode)", "changed"],
                    ["SW_NAV3", "Tactile button — LEFT (Back)", "changed"],
                    ["SW_NAV4", "Tactile button — RIGHT (Forward)", "new"],
                    ["SW_NAV5", "Tactile button — SELECT (Undo / Confirm)", "new"],
                    ["R1", "4.7kΩ — I2C SDA pull-up", null],
                    ["R2", "4.7kΩ — I2C SCL pull-up", null],
                    ["R3", "10kΩ — NAV_UP pull-down", "changed"],
                    ["R4", "10kΩ — NAV_DOWN pull-down", "changed"],
                    ["R5", "10kΩ — NAV_LEFT pull-down", "changed"],
                    ["R6", "10kΩ — NAV_RIGHT pull-down", "new"],
                    ["R7", "10kΩ — NAV_SELECT pull-down", "new"],
                    ["R8", "100kΩ — BAT_SENSE upper divider", null],
                    ["R9", "100kΩ — BAT_SENSE lower divider", null],
                    ["C1", "10µF electrolytic — RAW bulk decoupling", null],
                    ["C2–C4", "100nF ceramic — VCC_3V3 decoupling near each IC", null],
                    ["C5", "100nF ceramic — DTR auto-reset / RST debounce", null],
                    ["TP1–TP4", "Test points: VCC_3V3, GND, SDA, SCL", null],
                  ].map(([ref, desc, badge], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: badge === "new" ? "#fffbf0" : badge === "changed" ? "#f3e8ff" : (i % 2 ? "#fafafa" : "#fff") }}>
                      <td style={{ padding: "4px 10px", fontFamily: "monospace", fontWeight: 700, fontSize: 12, width: 100 }}>{ref}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12 }}>
                        {desc}
                        {badge === "new" && <NewBadge />}
                        {badge === "changed" && <ChangedBadge />}
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
              <SectionHeader title="U1 — Arduino Pro Mini 3.3V Pin Assignments" color="#c0392b" />
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
                    ["RAW", "RAW", C.pwr, "Battery input via SW1 (3.5–4.2V)"],
                    ["VCC", "VCC_3V3", C.pwr, "3.3V regulated output"],
                    ["GND ×3", "GND", C.gnd, "All three GND pins"],
                    ["RST", "RST", C.ctrl, "Reset — SW2 and J2 DTR via C5"],
                    ["A0", "BAT_SENSE", C.ctrl, "ADC — battery voltage monitor"],
                    ["A4", "I2C_SDA", C.i2c, "Hardware I2C SDA"],
                    ["A5", "I2C_SCL", C.i2c, "Hardware I2C SCL"],
                    ["D2", "NAV_UP", C.btn, "UP · Shooting: Hit"],
                    ["D3", "NAV_DOWN", C.btn, "DOWN · Shooting: Miss"],
                    ["D4", "NAV_LEFT", C.btn, "LEFT · Back / Cancel"],
                    ["D5", "NAV_RIGHT", C.btn, "RIGHT · Forward"],
                    ["D6", "NAV_SELECT", C.btn, "SELECT · Shooting: Undo · Long-press: Mode"],
                    ["D0 (RXI)", "(J2 TXO)", "#888", "Reserved — FTDI programming"],
                    ["D1 (TXO)", "(J2 RXI)", "#888", "Reserved — FTDI programming"],
                    ["D7–D13", "UNCONNECTED", "#ccc", "Available for future use"],
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
                    ["Pin 2 (each)", "NAV_UP / DOWN / LEFT / RIGHT / SELECT", C.btn, "To MCU digital pin and pull-down resistor."],
                    ["R3–R7 (each)", "NAV net → GND", C.gnd, "10kΩ pull-down. Pin reads LOW when button is open, HIGH when pressed."],
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
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Full Passives BOM — Rev 3.0</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["R1, R2", "4.7kΩ 1/4W", "2×", "I2C SDA/SCL pull-ups"],
                    ["R3–R7", "10kΩ 1/4W", "5×", "Nav button pull-downs (was 3× in Rev 2)"],
                    ["R8, R9", "100kΩ 1/4W", "2×", "Battery voltage divider"],
                    ["C1", "10µF electrolytic", "1×", "RAW bulk decoupling"],
                    ["C2–C4", "100nF ceramic", "3×", "IC decoupling"],
                    ["C5", "100nF ceramic", "1×", "DTR auto-reset"],
                  ].map(([ref, val, qty, note], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 ? "#fafafa" : "#fff" }}>
                      <td style={{ padding: "4px 10px", fontFamily: "monospace", fontSize: 12, fontWeight: 700, width: 80 }}>{ref}</td>
                      <td style={{ padding: "4px 10px", fontSize: 12, width: 140 }}>{val}</td>
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
            <Note type="new">
              <strong>Button context switching in firmware:</strong> Use a state variable (e.g. <code>enum Mode {"{"} SHOOTING, MENU {"}"}</code>). In SHOOTING mode, D2=Hit, D3=Miss, D6=Undo. In MENU mode, all 5 buttons navigate. A long-press on SELECT (hold ~1s) toggles between modes.
            </Note>
            <Note type="new">
              <strong>D-pad PCB placement:</strong> In Altium, place the 5 button footprints in a true cross pattern — UP/DOWN on the vertical axis, LEFT/RIGHT on the horizontal, SELECT centered. Match the center-to-center spacing to standard D-pad ergonomics (~8–10mm between centers). Export STEP to SolidWorks to verify finger reach before finalizing.
            </Note>
            <Note type="info">
              <strong>Debounce:</strong> Handle in firmware, not hardware. A simple 20–50ms debounce timer per button in software is cleaner than adding RC filters for 5 buttons. The ATmega has plenty of cycles for this at 8MHz.
            </Note>
            <Note type="critical">
              <strong>RAW vs VCC:</strong> Always connect battery to RAW. Never apply raw battery voltage to the VCC pin.
            </Note>
            <Note type="critical">
              <strong>FTDI:</strong> 3.3V logic only. Check jumper before connecting.
            </Note>
            <Note type="warning">
              <strong>I2C addresses:</strong> OLED = 0x3C · EEPROM = 0x50. No conflict. A0–A2 on U3 tied to GND.
            </Note>
            <Note type="info">
              <strong>Battery display formula:</strong> <code>V_batt = (analogRead(A0) / 1023.0) × 3.3 × 2</code>. Map 3.5–4.2V to 0–100%.
            </Note>
            <Note type="info">
              <strong>FTDI header pin order:</strong> GND · CTS · VCC · TXO · RXI · DTR. Silkscreen pin 1 on the PCB. Wrong orientation = VCC shorted to GND.
            </Note>

            <div style={{ background: C.card, borderRadius: 6, border: `1px solid ${C.border}`, padding: 12, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Rev History</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["Rev 1.0", "Initial schematic — Pro Mini, OLED, EEPROM, 3 buttons, power chain"],
                    ["Rev 2.0", "Added battery voltage divider, external reset, FTDI header, test points"],
                    ["Rev 3.0", "Replaced 3 individual buttons with 5-button nav D-pad cluster. Hit/Miss/Reset context-mapped in firmware. R3–R5 renumbered, R6–R7 added, divider resistors renumbered R8–R9."],
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
      </div>
    </div>
  );
}

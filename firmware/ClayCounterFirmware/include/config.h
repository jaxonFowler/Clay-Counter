#pragma once

// ─── I2C ────────────────────────────────────────────────────────────────────
#define PIN_SDA         8
#define PIN_SCL         9

// ─── Navigation buttons (active HIGH, external 10kΩ pull-downs) ─────────────
#define PIN_NAV_UP      2
#define PIN_NAV_DOWN    3
#define PIN_NAV_LEFT    4
#define PIN_NAV_RIGHT   5
#define PIN_NAV_SELECT  6

// ─── Battery ADC ────────────────────────────────────────────────────────────
#define PIN_BAT_SENSE   0   // GPIO0 — ADC1, voltage divider midpoint (R8/R9 100kΩ each)

// ─── Display ────────────────────────────────────────────────────────────────
#define OLED_WIDTH      128
#define OLED_HEIGHT     64
#define OLED_I2C_ADDR   0x3C

// ─── Button timing ──────────────────────────────────────────────────────────
#define DEBOUNCE_MS     20
#define LONG_PRESS_MS   600

// ─── Battery ────────────────────────────────────────────────────────────────
#define BATT_MIN_V      3.5f
#define BATT_MAX_V      4.2f

// ─── Session storage ────────────────────────────────────────────────────────
#define MAX_SESSIONS    25
#define MAX_SHOTS       200
#define NVS_NAMESPACE   "cc"
#define NVS_KEY_COUNT   "count"
// Session keys are generated as "s00" through "s24"

// ─── BLE ────────────────────────────────────────────────────────────────────
#define BLE_DEVICE_NAME "Jax's Clay Counter"
#pragma once

#include <stdint.h>
#include "config.h"

// ─── Game modes ─────────────────────────────────────────────────────────────
enum GameMode : uint8_t {
    MODE_QUICK_COUNT = 0,
    MODE_TRAP,
    MODE_SKEET,
    MODE_SPORTING,
    MODE_5STAND,
    MODE_COUNT      // total number of modes — keep last
};

// Human-readable labels for each mode (indexed by GameMode)
static const char* const MODE_LABELS[] = {
    "Quick Count",
    "Trap",
    "Skeet",
    "Sporting",
    "5-Stand"
};

// Short labels for display (indexed by GameMode)
static const char* const MODE_LABELS_SHORT[] = {
    "QC",
    "Trap",
    "Skeet",
    "Sporting",
    "5-Stand"
};

// ─── App states ─────────────────────────────────────────────────────────────
enum AppState : uint8_t {
    STATE_MENU = 0,
    STATE_MODE_SELECT,
    STATE_SHOOTING,
    STATE_SESSION_END,
    STATE_HISTORY_LIST,
    STATE_HISTORY_DETAIL
};

// ─── Button events ──────────────────────────────────────────────────────────
enum ButtonEvent : uint8_t {
    BTN_NONE = 0,
    BTN_UP,
    BTN_DOWN,
    BTN_LEFT,
    BTN_RIGHT,
    BTN_SELECT,
    BTN_SELECT_LONG
};

// ─── Saved session (written to NVS) ─────────────────────────────────────────
// Compact: 48 bytes per session
struct Session {
    GameMode mode;
    uint8_t  hits;
    uint8_t  misses;
    uint8_t  shot_count;
    uint8_t  starting_station;
    uint8_t  option_hits;
    uint8_t  option_misses;
    uint8_t  station_hits[8];
    uint8_t  station_misses[8];
    uint8_t  shots[25]; // bit-packed, MSB first: bit=1 → hit, bit=0 → miss
};

// ─── Active session (held in RAM while shooting) ─────────────────────────────
// Unpacked for easy hit/miss recording and undo
struct ActiveSession {
    GameMode mode;
    uint8_t  hits;
    uint8_t  misses;
    uint8_t  shot_count;
    uint8_t  current_station;
    uint8_t  option_hits;
    uint8_t  option_misses;
    bool     shots[MAX_SHOTS];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Pack an ActiveSession's shot array into a Session's bit-packed shots field
inline void packShots(const ActiveSession& src, Session& dst) {
    for (int i = 0; i < 13; i++) dst.shots[i] = 0;
    for (int i = 0; i < src.shot_count && i < MAX_SHOTS; i++) {
        if (src.shots[i]) dst.shots[i / 8] |= (1 << (7 - (i % 8)));
    }
}

// Read a single shot result from a packed Session
inline bool getShot(const Session& s, uint8_t index) {
    return (s.shots[index / 8] >> (7 - (index % 8))) & 1;
}

// Hit percentage, returns 0 if no shots taken
inline uint8_t hitPct(uint8_t hits, uint8_t total) {
    if (total == 0) return 0;
    return (uint8_t)((hits * 100) / total);
}

#include "buttons.h"

#include <esp32-hal-gpio.h>

static const uint8_t BUTTON_PINS[5] = {
    PIN_NAV_UP,
    PIN_NAV_DOWN,
    PIN_NAV_LEFT,
    PIN_NAV_RIGHT,
    PIN_NAV_SELECT
};

static const ButtonEvent BUTTON_EVENTS[5] = {
    BTN_UP,
    BTN_DOWN,
    BTN_LEFT,
    BTN_RIGHT,
    BTN_SELECT
};

ButtonEvent readButtons() {
    static bool lastRaw[5]             = {false, false, false, false, false};
    static bool lastDebounced[5]       = { false, false, false, false, false};
    static uint32_t lastChange[5]      = {0, 0, 0, 0, 0};
    static uint32_t selectPressedAt    = 0;
    static bool selectLongFired        = false;

    uint32_t now = millis();

    for (int i = 0; i < 5; i++) {
        bool raw = digitalRead(BUTTON_PINS[i]);

        // raw state changed - reset debounce timer
        if (raw != lastRaw[i]) {
            lastRaw[i] = raw;
            lastChange[i] = now;
        }

        // stable long enough - confirm the state
        if ((now - lastChange[i] >= DEBOUNCE_MS && raw != lastDebounced[i])) {
            lastDebounced[i] = raw;

            if (raw == HIGH) {
                if (i == 4) {
                    // SELECT pressed - start timing for long press
                    selectPressedAt = now;
                    selectLongFired = false;
                } else {
                    return BUTTON_EVENTS[i];
                }
            } else {
                if (i == 4 && !selectLongFired) {
                    // SELECT released without long press firing
                    return BTN_SELECT;
                }
            }
        }
    }

    // check for SELECT long press while still held
    if (lastDebounced[4] == HIGH && !selectLongFired) {
        if ((now - selectPressedAt) >= LONG_PRESS_MS) {
            selectLongFired = true;
            return BTN_SELECT_LONG
        }
    }

    return BTN_NONE;
}


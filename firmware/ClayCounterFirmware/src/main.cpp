//
// Created by jaxon on 4/5/2026.
//

#include <Arduino.h>
#include "config.h"
#include "types.h"

// #include "buttons.h"
// #include "display.h"
// #include "game.h"
// #include "storage.h"
// #include "ble.h"

AppState currentState = STATE_MENU;
ActiveSession activeSession;

void setup() {
    Serial.begin(115200);

    pinMode(PIN_NAV_UP, INPUT);
    pinMode(PIN_NAV_DOWN, INPUT);
    pinMode(PIN_NAV_LEFT, INPUT);
    pinMode(PIN_NAV_RIGHT, INPUT);
    pinMode(PIN_NAV_SELECT, INPUT);

    currentState = STATE_MENU;
}

void loop() {
    // ButtonEvent event = readButtons();
    ButtonEvent event = BTN_NONE;

    switch (currentState) {
        case STATE_MENU:
            // handle menu input
            break;
        case STATE_MODE_SELECT:
            // handle mode select
            break;
        case STATE_SHOOTING:
            // handle shooting input
            break;
        case STATE_SESSION_END:
            // handle sesion end
            break;
        case STATE_HISTORY_LIST:
            // handle history list
            break;
        case STATE_HISTORY_DETAIL:
            // handle history details
            break;
        default:
            currentState = STATE_MENU;
            break;
    }
}
//
// Created by jaxon on 4/5/2026.
//

#include "display.h"
#include <Wire.h>
#include "Adafruit_SSD1306.h"

Adafruit_SSD1306 display(OLED_WIDTH, OLED_HEIGHT, &Wire, -1);

bool initDisplay() {
    Wire.begin(PIN_SDA, PIN_SCL);
    if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_I2C_ADDR)) {
        return false;
    }
    display.clearDisplay();
    display.display();
    return true;
}

void drawMenu(uint8_t selectedIndex, uint8_t battPct) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print("Clay Counter");

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // Menu - New Game
    display.setCursor(0, 24);
    display.print(selectedIndex == 0 ? "> " : "  ");
    display.print("New Game");

    // Menu - History
    display.setCursor(0, 48);
    display.print(selectedIndex == 1 ? "> " : "  ");
    display.print("History");

    display.display();
}

void drawModeSelect(GameMode selectedMode, uint8_t battPct) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print("New Game");

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // Menu
    for (uint8_t i = 0; i < MODE_COUNT; i++) {
        display.setCursor(0, 16 + (i * 9));
        display.print(i == selectedMode ? "> " : "  ");
        display.print(MODE_LABELS[i]);
    }

    display.display();
}

void drawShooting(const ActiveSession &session, uint8_t battPct) {
    uint8_t optHits = 0;
    uint8_t optMisses = 0;
    for (uint8_t i = 0; i < session.option_count; i++) {
        if (session.option_result[i]) optHits++;
        else optMisses++;
    }

    uint8_t displayHits     = session.hits + optHits;
    uint8_t displayMisses   = (optHits <= session.misses) ?
                               session.misses - optHits : 0;
    uint8_t total           = session.hits + session.misses;
    uint8_t pct = hitPct(displayHits, total);
    int filledWidth = (pct * 128) / 100;

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print(MODE_LABELS_SHORT[session.mode]);

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // Station
    if (session.mode == MODE_TRAP || session.mode == MODE_SKEET || session.mode == MODE_5STAND) {
        display.setCursor(0, 10);
        display.print("Station ");
        display.print(session.current_station);
    }

    // Display
        // Labels
    display.setCursor(10, 30);
    display.print("HITS");
    display.setCursor(46, 30);
    display.print("MISSES");
    display.setCursor(90, 30);
    display.print("TOTAL");

        // Values
    display.setCursor(14, 42);
    display.print(displayHits);
    display.setCursor(54, 42);
    display.print(displayMisses);
    display.setCursor(94, 42);
    display.print(total);

        // Hit Rate Bar
    display.fillRect(0, 56, filledWidth, 8, SSD1306_WHITE); // Filled hits
    display.drawRect(0, 56, 128,         8, SSD1306_WHITE); // Bar outline

    display.display();
}

void drawSessionEnd(const Session &session, uint8_t battPct, bool saveSelected) {
    uint8_t optHits = 0;
    uint8_t optMisses = 0;
    for (uint8_t i = 0; i < session.option_count; i++) {
        if (session.option_result[i]) optHits++;
        else optMisses++;
    }

    uint8_t displayHits     = session.hits + optHits;
    
    uint8_t total           = session.hits + session.misses;

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print("Session End");

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // Score
    display.setCursor(0, 16);
    display.print(MODE_LABELS[session.mode]);
    display.print("  ");
    display.print(displayHits);
    display.print("/");
    display.print(total);
    display.print("  ");
    display.print(hitPct(displayHits, total));
    display.print("%");

    // Options
        // Save
    display.setCursor(0, 36);
    display.print(saveSelected ? "> " : "  ");
    display.print("Save");
        // Discard
    display.setCursor(0, 48);
    display.print(saveSelected ? "  " : "> ");
    display.print("Discard");

    display.display();
}

void drawHistoryList(const Session sessions[], uint8_t count, uint8_t selectedIndex, uint8_t battPct) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print("History");

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // List
    for (uint8_t i = 0; i < count; i++) {
        uint8_t optHits = 0;
        for (uint8_t j = 0; j < sessions[i].option_count; j++) {
            if (sessions[i].option_result[j]) optHits++;
        }

        uint8_t displayHits     = sessions[i].hits + optHits;
        uint8_t total           = sessions[i].hits + sessions[i].misses;

        display.setCursor(0, 16 + (i * 10));
        display.print(selectedIndex == i ? "> " : "  ");
        display.print(i<9 ? "#0" : "#");
        display.print(i + 1);
        display.print(" ");
        display.print(MODE_LABELS_SHORT[sessions[i].mode]);
        display.print(" ");
        display.print(displayHits);
        display.print("/");
        display.print(total);
        display.print(" ");
        display.print(hitPct(displayHits, total));
        display.print("%");
    }

    display.display();
}

void drawHistoryDetail(const Session &session, uint8_t sessionIndex, uint8_t pageIndex, uint8_t battPct) {
    uint8_t optHits = 0;
    uint8_t optMisses = 0;
    for (uint8_t i = 0; i < session.option_count; i++) {
        if (session.option_result[i]) optHits++;
        else optMisses++;
    }
    uint8_t displayHits = session.hits + optHits;
    uint8_t total           = session.hits + session.misses;

    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);

    // Title - top left
    display.setCursor(0, 0);
    display.print(sessionIndex < 9 ? "#0" : "#");
    display.print(sessionIndex + 1);
    display.print(" ");
    display.print(MODE_LABELS_SHORT[session.mode]);

    // Battery
    display.setCursor(98, 0);
    display.print(battPct);
    display.print("%");

    // Page
    display.setCursor(0,10);
    if (pageIndex == 0) {
        display.print("Overview");
    } else {
        display.print("Station ");
        display.print(pageIndex);
    }

    // Page
        // Overview
    if (pageIndex == 0) {
        // Score
        display.setCursor(0, 16);
        display.print(displayHits);
        display.print("/");
        display.print(total);
        display.print("  ");
        display.print(hitPct(displayHits, total));
        display.print("%");

        // Options
        display.setCursor(0, 26);
        display.print("Opt: ");
        display.print(optHits);
        display.print("H ");
        display.print(optMisses);
        display.print("M");

        // Sequence
        display.setCursor(0, 36);
        for (uint8_t i=0; i < session.shot_count; i++) {
            display.print(getShot(session, i) ? "H" : "M");
        }
    }
        // Stations
    else {
        uint8_t stn = pageIndex - 1;
        uint8_t stnHits  = session.station_hits[stn];
        uint8_t stnTotal = session.station_hits[stn] + session.station_misses[stn];

        // Quick View
        display.setCursor(0, 20);
        display.print(stnHits);
        display.print("/");
        display.print(stnTotal);
        display.print("  ");
        display.print(hitPct(stnHits, stnTotal));
        display.print("%");

        // Station Shot Sequence
        display.setCursor(0, 36);
        uint8_t start = session.station_start[stn];
        uint8_t end   = (pageIndex < 8 && session.station_start[pageIndex] > 0)
                         ? session.station_start[pageIndex]
                         : session.shot_count;
        for (uint8_t i = start; i < end; i++) {
            display.print(getShot(session, i) ? "H" : "M");
                // check if an option was taken after this shot
            for (uint8_t j = 0; j < session.option_count; j++) {
                if (session.option_station[j] == stn && session.option_after_shot[j] == i) {
                    display.print("[");
                    display.print(session.option_result[j] ? "H" : "M");
                    display.print("]");
                }
            }
        }
    }

    display.display();
}

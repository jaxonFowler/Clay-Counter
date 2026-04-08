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
    uint8_t displayHits     = session.hits + session.option_hits;
    uint8_t displayMisses   = (session.option_hits <= session.misses) ?
                               session.misses - session.option_hits : 0;
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
    
}

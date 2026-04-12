#pragma once

#include "types.h"

bool initDisplay();

void drawMenu(uint8_t selectedIndex, uint8_t battPct);

void drawModeSelect(GameMode selectedMode, uint8_t battPct);

void drawShooting(const ActiveSession& session, uint8_t battPct);

void drawSessionEnd(const Session& session, uint8_t battPct, bool saveSelected);

void drawHistoryList(const Session sessions[], uint8_t count, uint8_t selectedIndex, uint8_t battPct);

void drawHistoryDetail(const Session& session, uint8_t sessionIndex, uint8_t pageIndex, uint8_t battPct);
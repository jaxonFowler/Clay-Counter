#pragma once

#include "types.h"

ActiveSession newSession (GameMode mode);

void recordHit(ActiveSession& s);

void recordMiss(ActiveSession& s);

void undoLastShot(ActiveSession& s);

void recordOption(ActiveSession& s, bool hit);

void nextStation(ActiveSession& s);

void finalizeSession(const ActiveSession&, Session&);
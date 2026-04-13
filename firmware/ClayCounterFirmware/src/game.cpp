//
// Created by jaxon on 4/5/2026.
//

#include "game.h"

ActiveSession newSession(GameMode mode) {
    ActiveSession s = {};
    s.mode = mode;
    s.current_station = 1;
    return s;
}

void recordHit(ActiveSession& s) {
    s.shots[s.shot_count] = true;
    s.hits++;
    s.station_hits[s.current_station - 1]++;
    s.shot_count++;
}

void recordMiss(ActiveSession &s) {
    s.shots[s.shot_count] = false;
    s.misses++;
    s.station_misses[s.current_station - 1]++;
    s.shot_count++;
}

void undoLastShot(ActiveSession &s) {
    if (s.shot_count == 0) {
        return;
    }

    s.shot_count--;

    bool shot = s.shots[s.shot_count];
    if (!shot) {
        s.misses --;
        s.station_misses[s.current_station - 1]--;
    }
    else {
        s.hits --;
        s.station_hits[s.current_station - 1]--;
    }
}


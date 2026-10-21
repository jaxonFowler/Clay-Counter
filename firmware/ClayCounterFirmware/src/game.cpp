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

void recordOption(ActiveSession& s, bool hit) {
    s.option_station[s.option_count] = s.current_station;
    s.option_after_shot[s.option_count] = s.shot_count - 1;
    s.option_result[s.option_count] = hit;
    s.option_count++;
}

void nextStation(ActiveSession& s) {
    s.current_station++;
    s.station_start[s.current_station - 1] = s.shot_count;
}

void finalizeSession(const ActiveSession& a, Session& s) {
    s.mode = a.mode;
    s.hits = a.hits;
    s.misses = a.misses;
    s.shot_count = a.shot_count;

    s.starting_station = 1;             // CHANGE LATER

    s.option_count = a.option_count;
    for (uint8_t i = 0; i < a.option_count; i++) {
        s.option_station[i] = a.option_station[i];
        s.option_after_shot[i] = a.option_after_shot[i];
        s.option_result[i] = a.option_result[i];
    }

    for (uint8_t i = 0; i < a.current_station; i++) {
        s.station_hits[i] = a.station_hits[i];
        s.station_misses[i] = a.station_misses[i];
        s.station_start[i] = a.station_start[i];
    }

    packShots(a, s);
}


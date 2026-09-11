const PROGRESS_KEY =
  "what are you snooping around for? you some kind of pervert?";

class GameProgress {
  constructor() {
    this.progress = {};

    for (const zoneId in ZONE_LEVELS) {
      this.progress[zoneId] = {};
      for (const level of ZONE_LEVELS[zoneId].levels) {
        this.progress[zoneId][level.id] = {
          completed: false,
          bestMoves: 99999,
        };
      }
    }
  }

  saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progress));
  }

  loadProgress() {
    const progressString = localStorage.getItem(PROGRESS_KEY);
    if (progressString) {
      const parsedProgress = JSON.parse(progressString);
      for (const zoneId in ZONE_LEVELS) {
        for (const level of ZONE_LEVELS[zoneId].levels) {
          this.progress[zoneId][level.id] = {
            completed: parsedProgress[zoneId]?.[level.id]?.completed || false,
            bestMoves: parsedProgress[zoneId]?.[level.id]?.bestMoves || 99999,
          };
        }
      }
    }
  }

  getProgress(zoneId, levelId) {
    return this.progress[zoneId][levelId];
  }

  setProgress(zoneId, levelId, moves) {
    console.log("setting progress", zoneId, levelId, moves);
    this.progress[zoneId][levelId].completed = true;
    this.progress[zoneId][levelId].bestMoves = Math.min(
      this.progress[zoneId][levelId].bestMoves,
      moves
    );
    this.saveProgress();
  }

  getLevelSilver(zoneId) {
    const levels = ZONE_LEVELS[zoneId].levels;
    const completedLevels = levels.filter(
      (level) => this.getProgress(zoneId, level.id).completed
    );
    return completedLevels.length;
  }

  getLevelGold(zoneId) {
    const levels = ZONE_LEVELS[zoneId].levels;
    const completedLevels = levels.filter((level) => {
      const progress = this.getProgress(zoneId, level.id);
      return progress.completed && progress.bestMoves <= level.bestMoves;
    });
    return completedLevels.length;
  }
}

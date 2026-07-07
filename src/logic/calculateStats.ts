import type { Nature, StatKey, Stats } from "../types/pokemon";

type CalculateStatsParams = {
  baseStats: Stats;
  ivs: Stats;
  evs: Stats;
  level: number;
  nature: Nature;
};

const statKeys: StatKey[] = ["hp", "atk", "def", "spa", "spd", "spe"];

function getNatureMultiplier(stat: StatKey, nature: Nature): number {
  if (nature.increased === stat) return 1.1;
  if (nature.decreased === stat) return 0.9;
  return 1;
}

function calculateHp(base: number, iv: number, ev: number, level: number): number {
  return (
    Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
    level +
    10
  );
}

function calculateOtherStat(
  base: number,
  iv: number,
  ev: number,
  level: number,
  multiplier: number
): number {
  const rawStat =
    Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5;

  return Math.floor(rawStat * multiplier);
}

export function calculateStats({
  baseStats,
  ivs,
  evs,
  level,
  nature,
}: CalculateStatsParams): Stats {
  const result = {} as Stats;

  for (const stat of statKeys) {
    if (stat === "hp") {
      result[stat] = calculateHp(baseStats[stat], ivs[stat], evs[stat], level);
    } else {
      result[stat] = calculateOtherStat(
        baseStats[stat],
        ivs[stat],
        evs[stat],
        level,
        getNatureMultiplier(stat, nature)
      );
    }
  }

  return result;
}
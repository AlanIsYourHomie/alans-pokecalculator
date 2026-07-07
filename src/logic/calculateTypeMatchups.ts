import { allTypes, typeEffectiveness } from "../data/typeChart";
import type { PokemonType } from "../data/typeMeta";

export type TypeMatchup = {
  type: PokemonType;
  multiplier: number;
};

export function calculateTypeMatchups(defenderTypes: string[]): TypeMatchup[] {
  const types = defenderTypes as PokemonType[];

  return allTypes
    .map((attackType) => {
      const multiplier = types.reduce((total, defenderType) => {
        return total * (typeEffectiveness[attackType][defenderType] ?? 1);
      }, 1);

      return {
        type: attackType,
        multiplier,
      };
    })
    .sort((a, b) => b.multiplier - a.multiplier);
}
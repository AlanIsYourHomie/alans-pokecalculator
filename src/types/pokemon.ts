export type StatKey = "hp" | "atk" | "def" | "spa" | "spd" | "spe";

export type Stats = Record<StatKey, number>;

export type Pokemon = {
  id: number;
  name: string;
  types: string[];
  sprite: string;
  baseStats: Stats;
};

export type Nature = {
  name: string;
  increased?: StatKey;
  decreased?: StatKey;
};

export type PokemonFormOption = {
  label: string;
  query: string;
};
import type { Pokemon, StatKey, Stats } from "../types/pokemon";

type PokeApiStatName =
  | "hp"
  | "attack"
  | "defense"
  | "special-attack"
  | "special-defense"
  | "speed";

type PokeApiPokemonResponse = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: PokeApiStatName;
    };
  }>;
};

const statNameMap: Record<PokeApiStatName, StatKey> = {
  hp: "hp",
  attack: "atk",
  defense: "def",
  "special-attack": "spa",
  "special-defense": "spd",
  speed: "spe",
};

const defaultStats: Stats = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function fetchPokemon(query: string): Promise<Pokemon> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    throw new Error("Escribe el nombre o ID de un Pokémon.");
  }

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${normalizedQuery}`
  );

  if (!response.ok) {
    throw new Error("No se encontró ese Pokémon.");
  }

  const data = (await response.json()) as PokeApiPokemonResponse;

  const baseStats: Stats = { ...defaultStats };

  for (const stat of data.stats) {
    const appStatKey = statNameMap[stat.stat.name];
    baseStats[appStatKey] = stat.base_stat;
  }

  const types = data.types
    .sort((a, b) => a.slot - b.slot)
    .map((item) => item.type.name);

  const sprite =
    data.sprites.other?.["official-artwork"]?.front_default ??
    data.sprites.front_default ??
    "";

  return {
    id: data.id,
    name: formatPokemonName(data.name),
    types,
    sprite,
    baseStats,
  };
}
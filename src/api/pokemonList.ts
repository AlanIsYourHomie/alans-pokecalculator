export type PokemonListItem = {
  id: number;
  name: string;
};

function formatPokemonName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function fetchPokemonList(): Promise<PokemonListItem[]> {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species?limit=1025"
  );

  if (!response.ok) {
    throw new Error("No se pudo cargar la lista de Pokémon.");
  }

  const data = await response.json();

  return data.results.map(
    (pokemon: { name: string; url: string }, index: number) => ({
      id: index + 1,
      name: formatPokemonName(pokemon.name),
    })
  );
}
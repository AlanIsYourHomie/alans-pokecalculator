import { useEffect, useMemo, useState } from "react";
import { fetchPokemon } from "./api/pokeApi";
import { natures } from "./data/natures";
import { calculateStats } from "./logic/calculateStats";
import type { Pokemon, StatKey, Stats } from "./types/pokemon";
import {fetchPokemonList} from "./api/pokemonList";
import type { PokemonListItem } from "./api/pokemonList";
import { PokemonSearch } from "./components/PokemonSearch";
import "./index.css";
import { NatureSelect } from "./components/NatureSelect";

const STORAGE_KEY = "pokemon-stat-calculator-state";

type SavedState = {
  searchText: string;
  selectedNatureName: string;
  level: number;
  ivs: Stats;
  evs: Stats;
};

const statLabels: Record<StatKey, string> = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe",
};

const statKeys: StatKey[] = ["hp", "atk", "def", "spa", "spd", "spe"];

const defaultIvs: Stats = {
  hp: 31,
  atk: 31,
  def: 31,
  spa: 31,
  spd: 31,
  spe: 31,
};

const defaultEvs: Stats = {
  hp: 0,
  atk: 0,
  def: 0,
  spa: 0,
  spd: 0,
  spe: 0,
};

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function getStatBarWidth(value: number): number {
  return Math.min((value / 255) * 100, 100);
}

function loadSavedState(): SavedState | null {
  try {
    const rawState = localStorage.getItem(STORAGE_KEY);

    if (!rawState) return null;

    return JSON.parse(rawState) as SavedState;
  } catch {
    return null;
  }
}

function saveState(state: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function App() {
  const savedState = loadSavedState();
  const [searchText, setSearchText] = useState(savedState?.searchText ?? "dragonite");
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [selectedNatureName, setSelectedNatureName] = useState(
    savedState?.selectedNatureName ?? "Hardy"
  );
  const [level, setLevel] = useState(savedState?.level ?? 50);
  const [ivs, setIvs] = useState<Stats>(savedState?.ivs ?? defaultIvs);
  const [evs, setEvs] = useState<Stats>(savedState?.evs ?? defaultEvs);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);

  const selectedNature =
    natures.find((nature) => nature.name === selectedNatureName) ?? natures[0];

  const finalStats = useMemo(() => {
    if (!pokemon) return null;

    return calculateStats({
      baseStats: pokemon.baseStats,
      ivs,
      evs,
      level,
      nature: selectedNature,
    });
  }, [pokemon, ivs, evs, level, selectedNature]);

  const totalEvs = statKeys.reduce((total, stat) => total + evs[stat], 0);

    useEffect(() => {
    async function loadPokemonList() {
      try {
        const result = await fetchPokemonList();
        setPokemonList(result);
      } catch {
        // Por ahora no rompemos la app si falla la lista
      }
    }

    loadPokemonList();
  }, []);

  async function loadPokemon(query: string) {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await fetchPokemon(query);
      setPokemon(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPokemon(searchText);
  }, []);
  useEffect(() => {
    saveState({
      searchText,
      selectedNatureName,
      level,
      ivs,
      evs,
    });
  }, [searchText, selectedNatureName, level, ivs, evs]);

  function updateIv(stat: StatKey, value: number) {
    setIvs((current) => ({
      ...current,
      [stat]: clamp(value, 0, 31),
    }));
  }

  function updateEv(stat: StatKey, value: number) {
    const requestedValue = Math.max(0, Math.min(252, value));

    setEvs((currentEvs) => {
      const otherEvsTotal = statKeys
        .filter((currentStat) => currentStat !== stat)
        .reduce((sum, currentStat) => sum + currentEvs[currentStat], 0);

      const maxAllowedForThisStat = Math.min(252, 510 - otherEvsTotal);
      const nextValue = Math.min(requestedValue, maxAllowedForThisStat);

      return {
        ...currentEvs,
        [stat]: nextValue,
      };
    });
  }

  function resetEvs() {
    setEvs(defaultEvs);
  }

  function maxIvs() {
    setIvs(defaultIvs);
  }

  return (
    <main className="app">
      <section className="card header-card">
        <div>
          <p className="eyebrow">Alan's PokeCalculator</p>
          <h1>Calculadora de Stats</h1>
          <p className="subtitle">
            Busca un Pokémon y calcula sus stats usando nivel,
            IVs, EVs y naturaleza.
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Buscar Pokémon</h2>

        <PokemonSearch
          value={searchText}
          pokemonList={pokemonList}
          isLoading={isLoading}
          onChange={setSearchText}
          onSearch={(query) => {
            loadPokemon(query);
          }}
        />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <p className="small-text">
          Tip: usa nombres en inglés o el número de Pokédex. Ejemplo:
          <strong> Meowscarada</strong>{" o "}
          <strong>908</strong>.
        </p>
      </section>

      {pokemon && finalStats && (
        <>
          <section className="grid">
            <div className="card">
              <h2>Descripción</h2>

              <div className="pokemon-hero">
                <div className="pokemon-art">
                  {pokemon.sprite ? (
                    <img key={pokemon.id} src={pokemon.sprite} alt={pokemon.name} />
                  ) : (
                    <p className="small-text">No hay sprite disponible</p>
                  )}
                </div>

                <div className="pokemon-details">
                  <p className="eyebrow">#{pokemon.id}</p>
                  <h3>{pokemon.name}</h3>

                  <div className="type-list">
                    {pokemon.types.map((type) => (
                      <span className="type-chip" key={type}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="base-stats">
                <h3>Base Stats</h3>

                <div className="base-stat-grid">
                  {statKeys.map((stat) => (
                    <div className="base-stat-tile" key={stat}>
                      <span>{statLabels[stat]}</span>
                      <strong>{pokemon.baseStats[stat]}</strong>
                    </div>
                  ))}
                </div>
              </div>

              <label className="field">
                <span>Nivel</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={level}
                  onChange={(event) =>
                    setLevel(clamp(Number(event.target.value), 1, 100))
                  }
                />
              </label>

              <label className="field">
                <span>Naturaleza</span>
                <NatureSelect
                  value={selectedNatureName}
                  natures={natures}
                  onChange={setSelectedNatureName}
                />
              </label>
            </div>

            <div className="card">
              <div className="section-title-row">
                <h2>Resultado</h2>
                <span className="pill">Nivel {level}</span>
              </div>

              <div className="stats-result">
                {statKeys.map((stat) => (
                  <div className="result-row" key={stat}>
                    <div className="result-header">
                      <span>{statLabels[stat]}</span>
                      <strong>{finalStats[stat]}</strong>
                    </div>

                    <div className="stat-bar">
                      <div
                        className="stat-bar-fill"
                        style={{ width: `${getStatBarWidth(finalStats[stat])}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <h2>IVs</h2>
                <p className="small-text">Rango permitido: 0 a 31.</p>
              </div>
              <button type="button" onClick={maxIvs}>
                Max IVs
              </button>
            </div>

            <div className="stat-editor">
              {statKeys.map((stat) => (
                <label className="mini-field" key={stat}>
                  <span>{statLabels[stat]}</span>
                  <input
                    type="number"
                    min={0}
                    max={31}
                    value={ivs[stat]}
                    onChange={(event) =>
                      updateIv(stat, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-title-row">
              <div>
                <h2>EVs</h2>
                <p className="small-text">
                  Total: {totalEvs}/510. Máximo por stat: 252.
                </p>
              </div>
              <button type="button" onClick={resetEvs}>
                Reset EVs
              </button>
            </div>

            <div className="ev-bar">
              <div
                className={
                  totalEvs > 510 ? "ev-bar-fill danger" : "ev-bar-fill"
                }
                style={{ width: `${Math.min((totalEvs / 510) * 100, 100)}%` }}
              />
            </div>

            <div className="stat-editor">
              {statKeys.map((stat) => (
                <label className="mini-field" key={stat}>
                  <span>{statLabels[stat]}</span>
                  <input
                    type="number"
                    min={0}
                    max={252}
                    value={evs[stat]}
                    onChange={(event) =>
                      updateEv(stat, Number(event.target.value))
                    }
                  />
                </label>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
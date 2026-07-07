import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PokemonListItem } from "../api/pokemonList";

type PokemonSearchProps = {
  value: string;
  pokemonList: PokemonListItem[];
  isLoading: boolean;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function normalizePokemonName(name: string): string {
  return name.toLowerCase().replaceAll(" ", "-");
}

export function PokemonSearch({
  value,
  pokemonList,
  isLoading,
  onChange,
  onSearch,
}: PokemonSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const filteredPokemonList = useMemo(() => {
    const normalizedSearch = value.trim().toLowerCase();

    if (!normalizedSearch) {
      return pokemonList.slice(0, 25);
    }

    return pokemonList
      .filter((pokemon) => {
        const pokemonName = pokemon.name.toLowerCase();
        const pokemonId = String(pokemon.id);

        return (
          pokemonName.includes(normalizedSearch) ||
          pokemonId.startsWith(normalizedSearch)
        );
      })
      .slice(0, 25);
  }, [pokemonList, value]);

    function updateDropdownPosition() {
    if (!inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();

    setDropdownPosition({
        top: rect.bottom + 10,
        left: rect.left,
        width: rect.width,
    });
    }

  function openDropdown() {
    updateDropdownPosition();
    setIsOpen(true);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  function submitSearch(query: string) {
    const cleanQuery = query.trim();

    if (!cleanQuery) return;

    closeDropdown();
    onSearch(cleanQuery);
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleResizeOrScroll() {
      updateDropdownPosition();
    }

    function handleClickOutside(event: MouseEvent) {
      const target = event.target;

      if (!(target instanceof Node)) return;

      const clickedInsideSearch = inputRef.current?.contains(target);

      if (!clickedInsideSearch) {
        closeDropdown();
      }
    }

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <form
      className="pokemon-search"
      onSubmit={(event) => {
        event.preventDefault();
        submitSearch(value);
      }}
    >
      <div className="pokemon-search-box">
        <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder="Ej: mew, pikachu, 445"
        autoComplete="off"
        onFocus={openDropdown}
        onChange={(event) => {
            onChange(event.target.value);
            openDropdown();
        }}
        onKeyDown={(event) => {
            if (event.key === "Escape") {
            closeDropdown();
            }
        }}
        />

        {value && (
          <button
            type="button"
            className="pokemon-search-clear"
            aria-label="Limpiar búsqueda"
            onClick={() => {
              onChange("");
              openDropdown();
            }}
          >
            ×
          </button>
        )}
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Buscando..." : "Buscar"}
      </button>

      {isOpen && filteredPokemonList.length > 0 &&
        (typeof document !== "undefined"
          ? createPortal(
              <div
                className="pokemon-search-results pokemon-search-results-fixed"
                style={{
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                }}
              >
                {filteredPokemonList.map((pokemon) => (
                  <button
                    type="button"
                    className="pokemon-search-option"
                    key={pokemon.id}
                    onMouseDown={(event) => {
                      event.preventDefault();

                      onChange(normalizePokemonName(pokemon.name));
                      submitSearch(String(pokemon.id));
                    }}
                  >
                    <span className="pokemon-search-sprite">
                      <img
                        src={getPokemonSpriteUrl(pokemon.id)}
                        alt={pokemon.name}
                        loading="lazy"
                      />
                    </span>

                    <span className="pokemon-search-number">
                      #{pokemon.id.toString().padStart(4, "0")}
                    </span>

                    <strong>{pokemon.name}</strong>
                  </button>
                ))}
              </div>,
              document.body
            )
          : null)}
    </form>
  );
}
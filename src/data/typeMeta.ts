import bugIcon from "../assets/types/bug.svg";
import darkIcon from "../assets/types/dark.svg";
import dragonIcon from "../assets/types/dragon.svg";
import electricIcon from "../assets/types/electric.svg";
import fairyIcon from "../assets/types/fairy.svg";
import fightingIcon from "../assets/types/fighting.svg";
import fireIcon from "../assets/types/fire.svg";
import flyingIcon from "../assets/types/flying.svg";
import ghostIcon from "../assets/types/ghost.svg";
import grassIcon from "../assets/types/grass.svg";
import groundIcon from "../assets/types/ground.svg";
import iceIcon from "../assets/types/ice.svg";
import normalIcon from "../assets/types/normal.svg";
import poisonIcon from "../assets/types/poison.svg";
import psychicIcon from "../assets/types/psychic.svg";
import rockIcon from "../assets/types/rock.svg";
import steelIcon from "../assets/types/steel.svg";
import waterIcon from "../assets/types/water.svg";

console.log("bugIcon", bugIcon);

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export const typeMeta: Record<
  PokemonType,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  normal: { label: "Normal", color: "#9fa19f", icon: normalIcon },
  fire: { label: "Fire", color: "#ff9d55", icon: fireIcon },
  water: { label: "Water", color: "#5090d6", icon: waterIcon },
  electric: { label: "Electric", color: "#f4d23c", icon: electricIcon },
  grass: { label: "Grass", color: "#63bc5a", icon: grassIcon },
  ice: { label: "Ice", color: "#73cec0", icon: iceIcon },
  fighting: { label: "Fighting", color: "#ce416b", icon: fightingIcon },
  poison: { label: "Poison", color: "#b567ce", icon: poisonIcon },
  ground: { label: "Ground", color: "#d97845", icon: groundIcon },
  flying: { label: "Flying", color: "#89aae3", icon: flyingIcon },
  psychic: { label: "Psychic", color: "#fa7179", icon: psychicIcon },
  bug: { label: "Bug", color: "#91c12f", icon: bugIcon },
  rock: { label: "Rock", color: "#c5b78c", icon: rockIcon },
  ghost: { label: "Ghost", color: "#5269ad", icon: ghostIcon },
  dragon: { label: "Dragon", color: "#0b6dc3", icon: dragonIcon },
  dark: { label: "Dark", color: "#5a5465", icon: darkIcon },
  steel: { label: "Steel", color: "#5a8ea2", icon: steelIcon },
  fairy: { label: "Fairy", color: "#ec8fe6", icon: fairyIcon },
};
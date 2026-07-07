import type { Nature } from "../types/pokemon";

export const natures: Nature[] = [
  { name: "Hardy" },
  { name: "Lonely", increased: "atk", decreased: "def" },
  { name: "Brave", increased: "atk", decreased: "spe" },
  { name: "Adamant", increased: "atk", decreased: "spa" },
  { name: "Naughty", increased: "atk", decreased: "spd" },

  { name: "Bold", increased: "def", decreased: "atk" },
  { name: "Docile" },
  { name: "Relaxed", increased: "def", decreased: "spe" },
  { name: "Impish", increased: "def", decreased: "spa" },
  { name: "Lax", increased: "def", decreased: "spd" },

  { name: "Timid", increased: "spe", decreased: "atk" },
  { name: "Hasty", increased: "spe", decreased: "def" },
  { name: "Serious" },
  { name: "Jolly", increased: "spe", decreased: "spa" },
  { name: "Naive", increased: "spe", decreased: "spd" },

  { name: "Modest", increased: "spa", decreased: "atk" },
  { name: "Mild", increased: "spa", decreased: "def" },
  { name: "Quiet", increased: "spa", decreased: "spe" },
  { name: "Bashful" },
  { name: "Rash", increased: "spa", decreased: "spd" },

  { name: "Calm", increased: "spd", decreased: "atk" },
  { name: "Gentle", increased: "spd", decreased: "def" },
  { name: "Sassy", increased: "spd", decreased: "spe" },
  { name: "Careful", increased: "spd", decreased: "spa" },
  { name: "Quirky" },
];
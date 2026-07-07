import type { Nature } from "../types/pokemon";

export const natures: Nature[] = [
  { name: "Hardy (Fuerte)" },
  { name: "Lonely (Huraña)", increased: "atk", decreased: "def" },
  { name: "Brave (Audaz)", increased: "atk", decreased: "spe" },
  { name: "Adamant (Firme)", increased: "atk", decreased: "spa" },
  { name: "Naughty (Pícara)", increased: "atk", decreased: "spd" },

  { name: "Bold (Osada)", increased: "def", decreased: "atk" },
  { name: "Docile (Dócil)" },
  { name: "Relaxed (Plácida)", increased: "def", decreased: "spe" },
  { name: "Impish (Agitada)", increased: "def", decreased: "spa" },
  { name: "Lax (Floja)", increased: "def", decreased: "spd" },

  { name: "Timid (Miedosa)", increased: "spe", decreased: "atk" },
  { name: "Hasty (Activa)", increased: "spe", decreased: "def" },
  { name: "Serious (Seria)" },
  { name: "Jolly (Alegre)", increased: "spe", decreased: "spa" },
  { name: "Naive (Ingenua)", increased: "spe", decreased: "spd" },

  { name: "Modest (Modesta)", increased: "spa", decreased: "atk" },
  { name: "Mild (Afable)", increased: "spa", decreased: "def" },
  { name: "Quiet (Mansa)", increased: "spa", decreased: "spe" },
  { name: "Bashful (Tímida)" },
  { name: "Rash (Alocada)", increased: "spa", decreased: "spd" },

  { name: "Calm (Calmada)", increased: "spd", decreased: "atk" },
  { name: "Gentle (Amable)", increased: "spd", decreased: "def" },
  { name: "Sassy (Grosera)", increased: "spd", decreased: "spe" },
  { name: "Careful (Cauta)", increased: "spd", decreased: "spa" },
  { name: "Quirky (Rara)" },
];
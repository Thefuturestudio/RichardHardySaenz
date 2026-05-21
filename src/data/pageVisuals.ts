import { imageAssets } from "./images";
import type { SpecialtyKey } from "../i18n/translations";

export const specialtyVisuals: Record<
  SpecialtyKey,
  {
    image: (typeof imageAssets)[keyof typeof imageAssets];
    accent: (typeof imageAssets)[keyof typeof imageAssets];
  }
> = {
  prostata: {
    image: imageAssets.prostate,
    accent: imageAssets.prostateBiopsy,
  },
  uroOncologia: {
    image: imageAssets.uroOncology,
    accent: imageAssets.precisionSurgery,
  },
  endourologia: {
    image: imageAssets.endourology,
    accent: imageAssets.ureteroscopy,
  },
  cirugiaLaparoscopica: {
    image: imageAssets.laparoscopicSurgery,
    accent: imageAssets.precisionSurgery,
  },
  saludMasculina: {
    image: imageAssets.urinarySystem,
    accent: imageAssets.urinarySystem,
  },
  segundaOpinion: {
    image: imageAssets.secondOpinion,
    accent: imageAssets.premiumClinic,
  },
  calculosRenales: {
    image: imageAssets.kidneyStones,
    accent: imageAssets.laserKidneyStone,
  },
  ureteroscopia: {
    image: imageAssets.ureteroscopy,
    accent: imageAssets.laserKidneyStone,
  },
};

export const procedureVisuals = [
  imageAssets.ureteroscopy,
  imageAssets.laserKidneyStone,
  imageAssets.prostateBiopsy,
  imageAssets.percutaneousNephrolithotomy,
  imageAssets.cystoscopy,
  imageAssets.laparoscopicSurgery,
];

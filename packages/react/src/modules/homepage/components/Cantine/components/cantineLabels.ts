import illuAccompagnement from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-accompagnement.svg';
import illuDessert from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-dessert.svg';
import illuEntree from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-entree.svg';
import illuLaitage from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-laitage.svg';
import illuPlat from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-plat.svg';
import labelBio from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-bio.png';
import labelFaitmaison from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-faitmaison.png';
import labelLocal from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-local.png';
import labelVegetarien from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-vegetarien.png';
import { CantineCategory } from '../hooks/useCantineMenu';

export interface IllustratedLabel {
  icon: string;
  i18nKey: string;
  defaultLabel: string;
}

export const CATEGORY_CONFIG: Record<CantineCategory, IllustratedLabel> = {
  entree: {
    icon: illuEntree,
    i18nKey: 'homepage.widget.cantine.category.entree',
    defaultLabel: 'Entrée',
  },
  plat: {
    icon: illuPlat,
    i18nKey: 'homepage.widget.cantine.category.plat',
    defaultLabel: 'Plat',
  },
  accompagnement: {
    icon: illuAccompagnement,
    i18nKey: 'homepage.widget.cantine.category.accompagnement',
    defaultLabel: 'Accompagnement',
  },
  laitage: {
    icon: illuLaitage,
    i18nKey: 'homepage.widget.cantine.category.laitage',
    defaultLabel: 'Laitage',
  },
  dessert: {
    icon: illuDessert,
    i18nKey: 'homepage.widget.cantine.category.dessert',
    defaultLabel: 'Dessert',
  },
};

/** Boolean quality flags of a dish */
export type DishFlag = 'vegetarien' | 'faitmaison' | 'bio' | 'local';

export const DISH_TAGS: (IllustratedLabel & { flag: DishFlag })[] = [
  {
    flag: 'vegetarien',
    icon: labelVegetarien,
    i18nKey: 'homepage.widget.cantine.tag.vegetarien',
    defaultLabel: 'Végétarien',
  },
  {
    flag: 'faitmaison',
    icon: labelFaitmaison,
    i18nKey: 'homepage.widget.cantine.tag.faitmaison',
    defaultLabel: 'Fait maison',
  },
  {
    flag: 'bio',
    icon: labelBio,
    i18nKey: 'homepage.widget.cantine.tag.bio',
    defaultLabel: 'Agriculture biologique',
  },
  {
    flag: 'local',
    icon: labelLocal,
    i18nKey: 'homepage.widget.cantine.tag.local',
    defaultLabel: 'Produit local',
  },
];

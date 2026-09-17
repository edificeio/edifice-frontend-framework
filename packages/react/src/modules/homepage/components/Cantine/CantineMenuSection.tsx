import illuAccompagnement from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-accompagnement.svg';
import illuDessert from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-dessert.svg';
import illuEntree from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-entree.svg';
import illuLaitage from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-laitage.svg';
import illuPlat from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-dish-plat.svg';
import labelBio from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-bio.png';
import labelFaitmaison from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-faitmaison.png';
import labelLocal from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-local.png';
import labelVegetarien from '@edifice.io/bootstrap/dist/images/homepage/cantine/cantine-label-vegetarien.png';
import { useTranslation } from 'react-i18next';
import { Image } from '../../../../components';
import { CantineCategory, CantineDish } from './useCantine';

interface IllustratedLabel {
  icon: string;
  i18nKey: string;
  defaultLabel: string;
}

const CATEGORY_CONFIG: Record<CantineCategory, IllustratedLabel> = {
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
type DishFlag = 'vegetarien' | 'faitmaison' | 'bio' | 'local';

const DISH_TAGS: (IllustratedLabel & { flag: DishFlag })[] = [
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

export interface CantineMenuSectionProps {
  category: CantineCategory;
  items: CantineDish[];
}

export default function CantineMenuSection({
  category,
  items,
}: CantineMenuSectionProps) {
  const { t } = useTranslation();
  const config = CATEGORY_CONFIG[category];

  return (
    <li className={`cantine__section cantine__section-${category}`}>
      <div className="cantine__section-header">
        <span className="cantine__section-icon">
          <Image src={config.icon} alt="" />
        </span>
        <h4 className="cantine__section-title">
          {t(config.i18nKey, config.defaultLabel)}
        </h4>
      </div>
      <ul className="cantine__items">
        {items.map((item) => (
          <li className="cantine__item" key={item.id}>
            <div className="cantine__item-text">
              <p className="cantine__item-label">{item.label}</p>
              {item.allergens.length > 0 && (
                <p className="cantine__item-allergens">
                  {item.allergens.join(', ')}
                </p>
              )}
            </div>
            <div className="cantine__item-tags">
              {DISH_TAGS.filter((tag) => item[tag.flag]).map((tag) => (
                <Image
                  key={tag.flag}
                  src={tag.icon}
                  alt={t(tag.i18nKey, tag.defaultLabel)}
                  className="cantine__item-tag"
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

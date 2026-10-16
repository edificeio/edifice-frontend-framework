export type CantineCategory =
  | 'entree'
  | 'plat'
  | 'accompagnement'
  | 'laitage'
  | 'dessert';

/**
 * Raw dish shape returned by the Webgerest upstream API, forwarded unmapped by
 * app-registry. Everything besides `type` and `nom` is effectively optional.
 */
export interface CantineMenuItem {
  type: string;
  nom: string;
  designationMenu?: string;
  vegetarien?: boolean;
  faitmaison?: boolean;
  bio?: boolean;
  local?: boolean;
  [key: string]: unknown; // allerg_gluten, allerg_fruits_a_coque…
}

export interface CantineMenuResponse {
  menu?: CantineMenuItem[];
  dinnerAvailable?: boolean;
  dinnerMenu?: CantineMenuItem[];
}

export interface CantineDish {
  id: string;
  label: string;
  vegetarien: boolean;
  faitmaison: boolean;
  bio: boolean;
  local: boolean;
  allergens: string[];
}

export interface CantineSection {
  category: CantineCategory;
  items: CantineDish[];
}

/** Both services of a given day, as exposed by app-registry. */
export interface CantineMenus {
  lunch: CantineMenuItem[];
  dinner: CantineMenuItem[];
  /** True when the school also serves a dinner menu that day. */
  dinnerAvailable: boolean;
}

export type CantineStatus = 'loading' | 'default' | 'empty' | 'error';

export type CantineMenuType = 'lunch' | 'dinner';

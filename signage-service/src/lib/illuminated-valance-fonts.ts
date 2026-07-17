export type IlluminatedValanceFont = {
  id: string;
  label: string;
  family: string;
  source: string;
  weight: string;
};

/**
 * Exact self-hosted font files used by the valance preview and text measuring
 * adapter. No operating-system or network font fallback is used for a result.
 */
export const ILLUMINATED_VALANCE_FONTS: IlluminatedValanceFont[] = [
  {
    id: 'montserrat',
    label: 'Montserrat',
    family: 'PR Valance Montserrat',
    source: '/fonts/illuminated-valance/montserrat-variable.ttf',
    weight: '400',
  },
  {
    id: 'open-sans',
    label: 'Open Sans',
    family: 'PR Valance Open Sans',
    source: '/fonts/illuminated-valance/open-sans-variable.ttf',
    weight: '400',
  },
  {
    id: 'oswald',
    label: 'Oswald',
    family: 'PR Valance Oswald',
    source: '/fonts/illuminated-valance/oswald-variable.ttf',
    weight: '400',
  },
  {
    id: 'pt-sans',
    label: 'PT Sans',
    family: 'PR Valance PT Sans',
    source: '/fonts/illuminated-valance/pt-sans-regular.ttf',
    weight: '400',
  },
  {
    id: 'playfair-display',
    label: 'Playfair Display',
    family: 'PR Valance Playfair Display',
    source: '/fonts/illuminated-valance/playfair-display-variable.ttf',
    weight: '400',
  },
  {
    id: 'rubik',
    label: 'Rubik',
    family: 'PR Valance Rubik',
    source: '/fonts/illuminated-valance/rubik-variable.ttf',
    weight: '400',
  },
  {
    id: 'fira-sans',
    label: 'Fira Sans',
    family: 'PR Valance Fira Sans',
    source: '/fonts/illuminated-valance/fira-sans-regular.ttf',
    weight: '400',
  },
  {
    id: 'merriweather',
    label: 'Merriweather',
    family: 'PR Valance Merriweather',
    source: '/fonts/illuminated-valance/merriweather-variable.ttf',
    weight: '400',
  },
  {
    id: 'source-sans-3',
    label: 'Source Sans 3',
    family: 'PR Valance Source Sans 3',
    source: '/fonts/illuminated-valance/source-sans-3-variable.ttf',
    weight: '400',
  },
  {
    id: 'roboto',
    label: 'Roboto',
    family: 'PR Valance Roboto',
    source: '/fonts/illuminated-valance/roboto-variable.ttf',
    weight: '400',
  },
];

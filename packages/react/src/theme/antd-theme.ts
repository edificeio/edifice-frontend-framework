import { theme } from 'antd';

// Configuration du thème Ant Design basée sur votre thème existant
export const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    // Couleurs principales
    colorPrimary: '#ff8d2e', // orange (primary)
    colorSuccess: '#7dbf85', // success
    colorWarning: '#f59700', // warning
    colorError: '#e13a3a', // danger
    colorInfo: '#4bafd5', // info
    colorBlue: '#2a9cc8', // blue

    // Couleurs secondaires
    colorSecondary: '#2a9cc8', // blue (secondary)

    // Couleurs de fond
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',

    // Couleurs de texte
    colorText: '#000000',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#cccccc',

    // Bordures
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',

    // Rayons de bordure
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Espacement
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,

    // Tailles de police
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXL: 20,

    // Hauteurs de ligne
    lineHeight: 1.5714285714285714,
    lineHeightLG: 1.5,
    lineHeightSM: 1.6666666666666667,

    // Ombres
    boxShadow:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    boxShadowSecondary:
      '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',

    // Transitions
    motionDurationSlow: '0.3s',
    motionDurationMid: '0.2s',
    motionDurationFast: '0.1s',
  },
  components: {
    Button: {
      // Configuration spécifique pour les boutons
      borderRadius: 6,
      controlHeight: 32,
      controlHeightLG: 40,
      controlHeightSM: 24,
      paddingInline: 15,
      paddingBlock: 4,
      fontWeight: 400,
      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.02)',
      primaryShadow: '0 2px 0 rgba(255, 141, 46, 0.1)',
      dangerShadow: '0 2px 0 rgba(225, 58, 58, 0.1)',
      linkHoverBg: 'rgba(255, 141, 46, 0.06)',
      textHoverBg: 'rgba(0, 0, 0, 0.06)',
    },
    Select: {
      // Configuration spécifique pour les sélecteurs
      borderRadius: 8,
    },
    // Vous pouvez ajouter d'autres composants ici selon vos besoins
  },
};

export default antdTheme;

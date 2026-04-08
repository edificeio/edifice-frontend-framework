import { IFlashMessageModel } from '../../../../client';

export const mockMessageInfo: IFlashMessageModel = {
  id: '1',
  title: 'Welcome to the new platform!',
  contents: {
    fr: "Chers étudiants, nous tenons à vous informer qu'un problème technique a affecté le site de Parcoursup, entraînant un report de toutes les inscriptions. Nous comprenons que cela puisse causer du stress et nous en sommes sincèrement désolés. Il est important de noter que notre établissement n'est pas responsable de cette situation, mais que cela provient directement de l'académie. Nous faisons de notre mieux pour vous fournir les informations les plus récentes et vous tiendrons informés dès que possible. Merci de votre compréhension. Nous vous proposons de suivre directement les informations de l’académie sur leurs site AcademieParcousup.fr",
  },
  author: 'Platform Team',
  color: 'blue',
  signature: 'Platform Announcements',
  startDate: '2026-01-20T00:00:00Z',
  endDate: '2050-03-27T23:59:59Z',
};

export const mockMessageAlert: IFlashMessageModel = {
  id: '2',
  title: 'Maintenance scheduled for tonight',
  contents: {
    en: 'The system will undergo scheduled maintenance from 11:00 PM to 2:00 AM. Please save your work before this time.',
    fr: 'Le système subira une maintenance programmée de 23h00 à 2h00. Veuillez sauvegarder votre travail avant cette heure.',
  },
  author: 'Technical Team',
  color: 'red',
  signature: 'System Maintenance',
  signatureColor: '#FF6B6B',
  startDate: '2026-01-20T00:00:00Z',
  endDate: '2050-03-27T23:59:59Z',
};

export const mockMessageSuccess: IFlashMessageModel = {
  id: '3',
  title: 'New resources available in the library',
  contents: {
    en: 'Check out the latest educational resources and materials that have been added to our digital library.',
    fr: 'Découvrez les dernières ressources pédagogiques et matériels qui ont été ajoutés à notre bibliothèque numérique.',
  },
  author: 'Library Staff',
  color: 'green',
  signature: 'Library Updates',
  signatureColor: '#4ECDC4',
  startDate: '2026-01-20T00:00:00Z',
  endDate: '2050-03-27T23:59:59Z',
};

export const mockMessageWarning: IFlashMessageModel = {
  id: '4',
  title: 'Welcome to the new platform!',
  contents: {
    en: 'We are excited to announce the launch of our new features. Explore the enhanced user interface and improved performance.',
    fr: "Nous sommes ravis d'annoncer le lancement de nos nouvelles fonctionnalités. Explorez l'interface utilisateur améliorée et les performances améliorées.",
  },
  author: 'Platform Team',
  color: 'orange',
  signature: 'Platform Announcements',
  startDate: '2026-01-20T00:00:00Z',
  endDate: '2050-03-27T23:59:59Z',
};

export const mockMessageDefault: IFlashMessageModel = {
  id: '5',
  title: 'Welcome to the new platform!',
  contents: {
    en: 'We are excited to announce the launch of our new features. Explore the enhanced user interface and improved performance.',
    fr: "Nous sommes ravis d'annoncer le lancement de nos nouvelles fonctionnalités. Explorez l'interface utilisateur améliorée et les performances améliorées.",
  },
  author: 'Platform Team',
  signature: 'Platform Announcements',
  startDate: '2026-01-20T00:00:00Z',
  endDate: '2050-03-27T23:59:59Z',
};

export const mockMessages: IFlashMessageModel[] = [
  mockMessageDefault,
  mockMessageInfo,
  mockMessageSuccess,
  mockMessageWarning,
  mockMessageAlert,
];

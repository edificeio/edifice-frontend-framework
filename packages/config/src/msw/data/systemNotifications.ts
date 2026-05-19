import { NotificationModel } from '../../../../client';

// Support
export const supportNotification: NotificationModel = {
  '_id': '0fb15873-9cec-4a37-8b58-0509cc6d0092',
  'type': 'SUPPORT',
  'event-type': 'BUGTRACKER-ISSUE-CLOSED',
  'params': {
    issueId: 105014,
    ticketId: 168,
    ticketUri: '/support#/ticket/168',
    resourceUri: '/support#/ticket/168',
  },
  'date': {
    $date: '2026-03-26T08:07:02.483Z',
  },
  'message':
    '<span>La <a href="https://recette-ode1.opendigitaleducation.com/support#/ticket/168">demande de support&nbsp;n°168</a></span>\n<span>associée à la \ndemande escaladée\n</span>&nbsp;n°105014<br/>\n<span>a été fermée</span>\n',
};

export const systemNotificationCollaborativeEditor: NotificationModel = {
  '_id': '41a1f713-91c5-42f8-93ab-04a1a0cee474',
  'type': 'COLLABORATIVEEDITOR',
  'event-type': 'UNUSED',
  'params': {
    resourceName: 'Texte pour la Twictée',
    resourceDate: '18/12/2018',
    collaborativeeditorUri:
      'https://recette-ode1.opendigitaleducation.com/collaborativeeditor#/view/b0da6908-8e73-47b1-88c7-7af1f1f962af',
  },
  'date': {
    $date: '2025-09-11T21:00:00.364Z',
  },
  'message':
    '<span>\n    <span><b>Le PAD \'<a href="https://recette-ode1.opendigitaleducation.com/collaborativeeditor#/view/b0da6908-8e73-47b1-88c7-7af1f1f962af">Texte pour la Twictée</a>\' n’a pas été modifié depuis le 18/12/2018</b></span>\n    <br />\n    <span>Vous êtes invités à faire un export de votre travail et à supprimer le PAD si vous n’en avez plus l’usage.</span>\n</span>\n',
};

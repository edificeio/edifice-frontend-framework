import { NotificationModel } from '../../../../../client/dist';

// RBS — réservations
export const bookingNotificationArgus: NotificationModel = {
  '_id': '81f65eae-161c-4de5-b7bb-fe9c7f26ccae',
  'type': 'RBS',
  'event-type': 'BOOKING-CREATED',
  'resource': 'Une ressource',
  'sender': 'f8744866-2992-4b17-9d18-ff3fdb6e8c96',
  'sub-resource': '9171',
  'params': {
    uri: '/userbook/annuaire#f8744866-2992-4b17-9d18-ff3fdb6e8c96#Personnel',
    bookingUri: '/rbs#/booking/9171/2026-04-16',
    username: 'argus rusard',
    startdate: '16/04/26 11:00',
    enddate: '16/04/26 12:00',
    resourcename: 'Une ressource',
    resourceUri: '/rbs#/booking/9171/2026-04-16',
  },
  'date': {
    $date: '2026-04-16T08:09:21.75Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#f8744866-2992-4b17-9d18-ff3fdb6e8c96#Personnel">argus rusard</a>\n<br />\n<span>\n\t<span>a créé une </span>\n\t<a href="https://recette-ode1.opendigitaleducation.com/rbs#/booking/9171/2026-04-16"><span>demande de réservation</span></a>\n\t<span> sur la ressource </span> Une ressource,&nbsp;\n\t<span>du</span> 16/04/26 11:00\n\t<span>au</span> 16/04/26 12:00\n</span>\n',
};

export const infosNotification: NotificationModel = {
  '_id': 'e9cc03c0-4b90-456c-b9a2-c84874fab52d',
  'type': 'NEWS',
  'event-type': 'NEWS-PUBLISHED',
  'resource': '1374',
  'sender': '6c74c8a8-4587-49f8-a9e5-4599da930bf2',
  'params': {
    profilUri: '/userbook/annuaire#6c74c8a8-4587-49f8-a9e5-4599da930bf2#',
    username: 'Dumbledore Albus',
    info: 'publié le dimanche 7 juin 2026',
    resourceUri: '/actualites#/view/thread/409/info/1374',
  },
  'date': {
    $date: '2026-06-07T03:00:00.049Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#6c74c8a8-4587-49f8-a9e5-4599da930bf2#">Dumbledore Albus</a>\n<br />\n<span>\n    <span>a publié l\'actualité </span>\n\t<a href="https://recette-ode1.opendigitaleducation.com/actualites#/view/thread/409/info/1374">publié le dimanche 7 juin 2026</a>\n</span>\n',
};

export const bookingNotificationJaune: NotificationModel = {
  '_id': '85181679-b570-4606-83ec-cff6fb966a18',
  'type': 'RBS',
  'event-type': 'BOOKING-CREATED',
  'resource': 'Jaune',
  'sender': 'c848b991-4650-4f71-ac36-904ad8ae1e01',
  'sub-resource': '9169',
  'params': {
    uri: '/userbook/annuaire#c848b991-4650-4f71-ac36-904ad8ae1e01#Teacher',
    bookingUri: '/rbs#/booking/9169/2026-03-31',
    username: 'Centaure Firenze',
    startdate: '31/03/26 15:00',
    enddate: '31/03/26 16:00',
    resourcename: 'Jaune',
    resourceUri: '/rbs#/booking/9169/2026-03-31',
  },
  'date': {
    $date: '2026-03-31T12:02:25.523Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#c848b991-4650-4f71-ac36-904ad8ae1e01#Teacher">Centaure Firenze</a>\n<br />\n<span>\n\t<span>a créé une </span>\n\t<a href="https://recette-ode1.opendigitaleducation.com/rbs#/booking/9169/2026-03-31"><span>demande de réservation</span></a>\n\t<span> sur la ressource </span> Jaune,&nbsp;\n\t<span>du</span> 31/03/26 15:00\n\t<span>au</span> 31/03/26 16:00\n</span>\n',
};

// Userbook — humeur
export const userMoodNotificationLoison: NotificationModel = {
  '_id': '37085cae-5628-4ae4-8d5f-97f0edd168db',
  'type': 'USERBOOK_MOOD',
  'event-type': 'USERBOOK_MOOD',
  'resource': 'b92e3d37-16b0-4ed9-b4c3-9920916871321775143118746mood',
  'sender': 'b92e3d37-16b0-4ed9-b4c3-992091687132',
  'params': {
    uri: '/directory/annuaire#b92e3d37-16b0-4ed9-b4c3-992091687132#Teacher',
    username: 'LOISON Stéphane',
    motto: null,
    moodImg: 'tired',
  },
  'date': {
    $date: '2026-04-02T15:18:38.759Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/directory/annuaire#b92e3d37-16b0-4ed9-b4c3-992091687132#Teacher">LOISON Stéphane</a>\n<br /><span>a mis à jour son humeur</span>\n<br /><i class="ic-mood-tired liquid"></i>\n',
};

// Messagerie
export const messageNotification: NotificationModel = {
  '_id': '21021500-4849-42db-adea-6b911ffc1cf4',
  'type': 'MESSAGERIE',
  'event-type': 'SEND-MESSAGE',
  'resource': '90311e61-32a0-44c5-9cc1-3ea96057d29e',
  'sender': 'c848b991-4650-4f71-ac36-904ad8ae1e01',
  'params': {
    uri: '/userbook/annuaire#c848b991-4650-4f71-ac36-904ad8ae1e01#Teacher',
    username: 'Centaure Firenze',
    subject: 'Changement de mot de passe',
    messageUri:
      '/conversation/conversation#/read-mail/90311e61-32a0-44c5-9cc1-3ea96057d29e',
    resourceUri:
      '/conversation/conversation#/read-mail/90311e61-32a0-44c5-9cc1-3ea96057d29e',
  },
  'date': {
    $date: '2026-03-31T09:21:08.268Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#c848b991-4650-4f71-ac36-904ad8ae1e01#Teacher">Centaure Firenze</a>\n<br /><span>vous a envoyé un message </span>: <a href="https://recette-ode1.opendigitaleducation.com/conversation/conversation#/read-mail/90311e61-32a0-44c5-9cc1-3ea96057d29e">Changement de mot de passe</a>.\n',
};

// Calendrier — partage
export const calendarShareNotification1: NotificationModel = {
  '_id': 'aadfa39e-ee7d-4ae0-8dbf-3897e6daac75',
  'type': 'CALENDAR',
  'event-type': 'SHARE',
  'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
  'params': {
    profilUri:
      '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
    username: 'Hagrid Rubeus',
    eventUri: '/calendar#/view/8efe5e37-7166-4c4f-a533-05f8ac36fab2',
    resourceUri: '/calendar#/view/8efe5e37-7166-4c4f-a533-05f8ac36fab2',
    resourceName: 'Test restreind',
  },
  'date': {
    $date: '2026-03-25T15:33:50.733Z',
  },
  'message':
    '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a partagé avec vous l\'évènement\n    <a href="https://recette-ode1.opendigitaleducation.com/calendar#/view/8efe5e37-7166-4c4f-a533-05f8ac36fab2">Test restreind</a>\n</span>\n',
};

// Calendrier — création
export const calendarCreateNotification1: NotificationModel = {
  '_id': '2744dc61-cd80-43d2-8bba-a5af46f3168d',
  'type': 'CALENDAR',
  'event-type': 'CREATE',
  'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
  'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
  'params': {
    uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
    username: 'Hagrid Rubeus',
    CalendarTitle: 'New agendat edit',
    postTitle: 'Cours',
    profilUri:
      '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
    calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
    resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
    startMoment: '30/03/2026 10:00',
    endMoment: '30/03/2026 11:00',
    eventTitle: 'Cours',
  },
  'date': {
    $date: '2026-03-25T15:05:36.112Z',
  },
  'message':
    '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a ajouté un événement à l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;30/03/2026 10:00&nbsp;au&nbsp;30/03/2026 11:00)\n</span>\n',
};

// Calendrier — mise à jour
export const calendarUpdateNotification1: NotificationModel = {
  '_id': 'fb3d0731-91ea-4205-964e-4e180060c623',
  'type': 'CALENDAR',
  'event-type': 'UPDATE',
  'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
  'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
  'params': {
    uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
    username: 'Hagrid Rubeus',
    CalendarTitle: 'New agendat edit',
    postTitle: 'Cours',
    profilUri:
      '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
    calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
    resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
    startMoment: '30/03/2026 10:00',
    endMoment: '30/03/2026 11:00',
    eventTitle: 'Cours',
  },
  'date': {
    $date: '2026-03-25T15:05:36.041Z',
  },
  'message':
    '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;30/03/2026 10:00&nbsp;au&nbsp;30/03/2026 11:00)\n</span>\n',
};

export const userNotificationCollaborativeWall: NotificationModel = {
  _id: 'notif-1',
  type: 'COLLABORATIVEWALL',
  eventType: 'SHARE',
  resource: 'resource-uuid-1',
  sender: '3bc6df93-4e92-45a3-b344-9e5dd34ba767',
  params: {
    uri: '/userbook/annuaire#3bc6df93-4e92-45a3-b344-9e5dd34ba767#Teacher',
    username: 'BARREAU PEGGY',
    blogTitle: '',
    resourceUri: '/collaborativewall#/view/resource-uuid-1',
  },
  date: { $date: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
  message:
    '<a href="/userbook/annuaire#3bc6df93-4e92-45a3-b344-9e5dd34ba767"><strong>BARREAU PEGGY</strong></a> vous a donné accès au mur : <a href="/collaborativewall#/view/resource-uuid-1"><strong>Mur de la classe - 2024/2025</strong></a>.',
};
export const userNotificationForm: NotificationModel = {
  '_id': 'b5c8bd7a-433b-4b01-b6c4-6f495b0620ec',
  'type': 'FORMULAIRE',
  'event-type': 'NEW_FORM_NOTIFICATION',
  'sender': '3bc6df93-4e92-45a3-b344-9e5dd34ba767',
  'params': {
    userUri: '/userbook/annuaire#3bc6df93-4e92-45a3-b344-9e5dd34ba767',
    username: 'Moreau Michelle',
    formUri: '/formulaire#/form/50/new',
    formName: 'bug de Loic - SUPPORT-3810',
    resourceUri: '/formulaire#/form/50/new',
  },
  'date': {
    $date: '2025-12-11T17:35:13.436Z',
  },
  'message':
    '<span>Nouvelle notification Formulaire </span>\n<span>de </span><a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#3bc6df93-4e92-45a3-b344-9e5dd34ba767">Moreau Michelle</a>\n:<br/>\n\nMoreau Michelle<span> vous a envoyé un formulaire. </span>\n\n<span>Accéder au formulaire </span>\n<a href="https://recette-ode1.opendigitaleducation.com/formulaire#/form/50/new">bug de Loic - SUPPORT-3810</a>\n',
};

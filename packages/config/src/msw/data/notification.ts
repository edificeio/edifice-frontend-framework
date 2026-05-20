import { NotificationModel } from '../../../../client/dist';

export const mockNotifications: NotificationModel[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    '_id': 'b584e43c-94b4-48c3-8967-09a56a1617b0',
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
      $date: '2026-03-25T15:05:20.501Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;30/03/2026 10:00&nbsp;au&nbsp;30/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': '920ed324-68b9-4a37-a9de-1bc92e574e76',
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
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T15:05:03.134Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': '6cb7e485-4ec1-4574-864e-9e848652c36f',
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
      startMoment: '02/04/2026 10:00',
      endMoment: '02/04/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T14:57:45.273Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;02/04/2026 10:00&nbsp;au&nbsp;02/04/2026 11:00)\n</span>\n',
  },
  {
    '_id': '75b8a83c-012d-4f56-acfd-24faee69efac',
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
      $date: '2026-03-25T14:57:35.301Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;30/03/2026 10:00&nbsp;au&nbsp;30/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'c0a72b76-5eb5-4076-9c74-9111c400bbd5',
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
      startMoment: '02/04/2026 10:00',
      endMoment: '02/04/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T14:57:14.964Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;02/04/2026 10:00&nbsp;au&nbsp;02/04/2026 11:00)\n</span>\n',
  },
  {
    '_id': '83959e7b-4729-41bb-9b6a-2928d7664fdd',
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
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T14:56:50.33Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'ee1ca36a-e3aa-410e-9bb8-0b5cf7a24893',
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
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T14:56:25.937Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': '6d122bb1-8577-403e-a744-d4404c6445c9',
    'type': 'CALENDAR',
    'event-type': 'UPDATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'Edit',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '30/03/2026 10:00',
      endMoment: '30/03/2026 11:00',
      eventTitle: 'Edit',
    },
    'date': {
      $date: '2026-03-25T14:54:24.729Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Edit\n    (du&nbsp;30/03/2026 10:00&nbsp;au&nbsp;30/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'e0de07d7-fdd4-433b-98b6-28427c3aeb79',
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
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'Cours',
    },
    'date': {
      $date: '2026-03-25T14:54:05.534Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Cours\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': '49383d36-578f-4394-89f9-386b34a7ea2f',
    'type': 'CALENDAR',
    'event-type': 'UPDATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'NEW TEST RECURRENCE Edit Pouet pouet',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'NEW TEST RECURRENCE Edit Pouet pouet',
    },
    'date': {
      $date: '2026-03-25T14:53:03.021Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;NEW TEST RECURRENCE Edit Pouet pouet\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'd2f66a00-def2-4322-bbb2-41b5dc034ae9',
    'type': 'CALENDAR',
    'event-type': 'UPDATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'NEW TEST RECURRENCE Edit',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'NEW TEST RECURRENCE Edit',
    },
    'date': {
      $date: '2026-03-25T14:52:11.407Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;NEW TEST RECURRENCE Edit\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'df0faf08-6e19-4e4e-a66a-af1d9476ef06',
    'type': 'CALENDAR',
    'event-type': 'CREATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'NEW TEST RECURRENCE',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'NEW TEST RECURRENCE',
    },
    'date': {
      $date: '2026-03-25T14:51:22.444Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a ajouté un événement à l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;NEW TEST RECURRENCE\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'ab7a844b-3254-490e-b5a5-c65c6a750d19',
    'type': 'CALENDAR',
    'event-type': 'CREATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'NEW TEST RECURRENCE',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 10:00',
      endMoment: '27/03/2026 11:00',
      eventTitle: 'NEW TEST RECURRENCE',
    },
    'date': {
      $date: '2026-03-25T14:51:22.392Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a ajouté un événement à l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;NEW TEST RECURRENCE\n    (du&nbsp;27/03/2026 10:00&nbsp;au&nbsp;27/03/2026 11:00)\n</span>\n',
  },
  {
    '_id': 'cd7be52b-eaf2-480e-8337-01be83cf0d31',
    'type': 'CALENDAR',
    'event-type': 'CREATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'Test récurence partagé',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 18:00',
      endMoment: '27/03/2026 19:00',
      eventTitle: 'Test récurence partagé',
    },
    'date': {
      $date: '2026-03-25T14:49:03.395Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a ajouté un événement à l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Test récurence partagé\n    (du&nbsp;27/03/2026 18:00&nbsp;au&nbsp;27/03/2026 19:00)\n</span>\n',
  },
  {
    '_id': '1277b5bf-3185-4df1-b481-ad75d3db84cc',
    'type': 'CALENDAR',
    'event-type': 'CREATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat edit',
      postTitle: 'Test récurence partagé',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '27/03/2026 18:00',
      endMoment: '27/03/2026 19:00',
      eventTitle: 'Test récurence partagé',
    },
    'date': {
      $date: '2026-03-25T14:49:03.36Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a ajouté un événement à l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>&nbsp;:&nbsp;Test récurence partagé\n    (du&nbsp;27/03/2026 18:00&nbsp;au&nbsp;27/03/2026 19:00)\n</span>\n',
  },
  {
    '_id': 'fa1f9e3c-d6a6-4ff5-bdc2-a7a7696ce28b',
    'type': 'CALENDAR',
    'event-type': 'SHARE',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceName: 'New agendat edit',
    },
    'date': {
      $date: '2026-03-25T14:47:37.63Z',
    },
    'message':
      '<a href="https://recette-ode1.opendigitaleducation.com/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    vous a donné accès à l\'agenda\n    <a href="https://recette-ode1.opendigitaleducation.com/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat edit</a>\n</span>\n',
  },
  {
    '_id': '00e385f3-ec90-4d73-871c-07c362f966de',
    'type': 'CALENDAR',
    'event-type': 'UPDATE',
    'resource': '2aea68dd-e597-4974-b94f-ee245e3f9504',
    'sender': '0807a2cf-11ea-4c46-9f30-87130484c379',
    'params': {
      uri: '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      username: 'Hagrid Rubeus',
      CalendarTitle: 'New agendat',
      postTitle: 'Ajout par albus',
      profilUri:
        '/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher',
      calendarUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      resourceUri: '/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504',
      startMoment: '25/03/2026 17:30',
      endMoment: '25/03/2026 18:00',
      eventTitle: 'Ajout par albus',
    },
    'date': {
      $date: '2026-03-25T14:36:23.125Z',
    },
    'message':
      '<a href="/userbook/annuaire#0807a2cf-11ea-4c46-9f30-87130484c379#Teacher">Hagrid Rubeus</a>\n<br />\n<span>\n    a mis à jour un événement dans l\'agenda\n    <a href="/calendar#/view/2aea68dd-e597-4974-b94f-ee245e3f9504">New agendat</a>&nbsp;:&nbsp;Ajout par albus\n    (du&nbsp;25/03/2026 17:30&nbsp;au&nbsp;25/03/2026 18:00)\n</span>\n',
  },
];

export const mockNotificationTypes: string[] = [
  'ARCHIVE',
  'BLOG',
  'CALENDAR',
  'COLLABORATIVEEDITOR',
  'COLLABORATIVEWALL',
  'COMMUNITY',
  'EXERCIZER',
  'FORMULAIRE',
  'FORUM',
  'HOMEWORKS',
  'MESSAGERIE',
  'MINDMAP',
  'NEWS',
  'PAGES',
  'POLL',
  'PRESENCES',
  'RACK',
  'RBS',
  'SCHOOLBOOK',
  'SCRAPBOOK',
  'SHAREBIGFILES',
  'SUPPORT',
  'TIMELINE',
  'TIMELINEGENERATOR',
  'USERBOOK',
  'USERBOOK_MOOD',
  'USERBOOK_MOTTO',
  'VIESCOLAIRE',
  'WIKI',
  'WORKSPACE',
];

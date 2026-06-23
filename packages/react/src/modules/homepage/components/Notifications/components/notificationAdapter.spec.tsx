import { NotificationModel } from '@edifice.io/client';
import {
  bookingNotificationArgus,
  infosNotification,
  messageNotification,
  supportNotification,
  userMoodNotificationLoison,
  userNotificationCollaborativeWall,
  userNotificationForm,
} from '@edifice.io/config';
import { notificationAdapter } from './notificationAdapter';

const makeNotification = (
  overrides: Partial<NotificationModel>,
): NotificationModel => ({
  '_id': 'test-id',
  'type': 'TEST',
  'event-type': 'TEST',
  'params': {},
  'date': { $date: '2026-01-01T00:00:00.000Z' },
  'message': 'test',
  ...overrides,
});

describe('notificationAdapter', () => {
  describe('type discrimination', () => {
    it('returns type "user" when a sender is present', () => {
      expect(notificationAdapter(messageNotification).type).toBe('user');
    });

    it('returns type "system" when no sender is present', () => {
      expect(notificationAdapter(supportNotification).type).toBe('system');
    });
  });

  describe('date conversion', () => {
    it('converts MongoDB $date to a JS Date', () => {
      const result = notificationAdapter(supportNotification);
      expect(result.date).toEqual(new Date('2026-03-26T08:07:02.483Z'));
    });
  });

  describe('message parsing', () => {
    it('replaces <a> tags with <strong>', () => {
      const notification = makeNotification({
        message: '<a href="/foo">texte</a>',
      });
      expect(notificationAdapter(notification).message).toBe(
        '<strong>texte</strong>',
      );
    });
  });

  describe('appCode normalization', () => {
    it.each([
      [
        'COLLABORATIVEWALL',
        userNotificationCollaborativeWall,
        'collaborative-wall',
      ],
      ['FORMULAIRE', userNotificationForm, 'forms'],
      ['MESSAGERIE', messageNotification, 'conversation'],
      ['NEWS', infosNotification, 'actualites'],
      ['USERBOOK_MOOD', userMoodNotificationLoison, 'userbook'],
    ] as [string, NotificationModel, string][])(
      'normalizes %s → %s',
      (_type, notification, expectedAppCode) => {
        expect(notificationAdapter(notification).params.appCode).toBe(
          expectedAppCode,
        );
      },
    );

    it('converts underscores to hyphens for unknown types', () => {
      const notification = makeNotification({
        type: 'BLOG_POST',
        sender: 'user-1',
        params: { username: 'test' },
      });
      expect(notificationAdapter(notification).params.appCode).toBe(
        'blog-post',
      );
    });
  });

  describe('URI resolution', () => {
    it('prefers resourceUri over uri for user notifications', () => {
      // bookingNotificationArgus has uri (userbook) and resourceUri (booking)
      expect(notificationAdapter(bookingNotificationArgus).uri).toBe(
        '/rbs#/booking/9171/2026-04-16',
      );
    });

    it('falls back to uri when no resourceUri for user notifications', () => {
      // userMoodNotificationLoison only has uri, no resourceUri
      expect(notificationAdapter(userMoodNotificationLoison).uri).toBe(
        '/directory/annuaire#b92e3d37-16b0-4ed9-b4c3-992091687132#Teacher',
      );
    });

    it('finds the first *Uri param for system notifications', () => {
      expect(notificationAdapter(supportNotification).uri).toBe(
        '/support#/ticket/168',
      );
    });
  });
});

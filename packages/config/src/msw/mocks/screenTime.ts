import { delay, http, HttpResponse } from 'msw';

import {
  mockScreenTimeKidIds,
  mockScreenTimeMinutesPerHour,
  mockScreenTimeMinutesPerWeekday,
} from '../data/screenTime';

// Mocks of the homepage "Screen time" widget API. The kid id picks the
// scenario (see mockScreenTimeKidIds); any other id gets the default data.
const { notFound, error, empty, zero, pending } = mockScreenTimeKidIds;

async function getEdgeCaseResponse(kidId: string) {
  if (kidId === pending) await delay('infinite');
  if (kidId === notFound) return new HttpResponse(null, { status: 404 });
  if (kidId === error) return new HttpResponse(null, { status: 500 });
  return undefined;
}

function getDaysBetween(startDate: string, endDate: string): string[] {
  const days: string[] = [];
  const day = new Date(`${startDate}T00:00:00Z`);
  while (day.toISOString().slice(0, 10) <= endDate) {
    days.push(day.toISOString().slice(0, 10));
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return days;
}

export const handlers = [
  http.get('/appregistry/screen-time/:kidId/daily', async ({ params }) => {
    const kidId = String(params.kidId);
    const edgeCaseResponse = await getEdgeCaseResponse(kidId);
    if (edgeCaseResponse) return edgeCaseResponse;
    if (kidId === empty) return HttpResponse.json({ durations: [] });

    return HttpResponse.json({
      durations: mockScreenTimeMinutesPerHour.map((minutes, hour) => ({
        hour: String(hour).padStart(2, '0'),
        durationMinutes: kidId === zero ? 0 : minutes,
        schoolUsePercentage: 0,
      })),
    });
  }),
  http.get(
    '/appregistry/screen-time/:kidId/weekly',
    async ({ params, request }) => {
      const kidId = String(params.kidId);
      const edgeCaseResponse = await getEdgeCaseResponse(kidId);
      if (edgeCaseResponse) return edgeCaseResponse;
      if (kidId === empty) return HttpResponse.json({ dailySummaries: [] });

      const { searchParams } = new URL(request.url);
      const days = getDaysBetween(
        searchParams.get('startDate') ?? '',
        searchParams.get('endDate') ?? '',
      );
      return HttpResponse.json({
        dailySummaries: days.map((date) => {
          // getUTCDay() is 0 for Sunday: shift so that Monday is 0.
          const weekday = (new Date(`${date}T00:00:00Z`).getUTCDay() + 6) % 7;
          return {
            date,
            durationMinutes:
              kidId === zero ? 0 : mockScreenTimeMinutesPerWeekday[weekday],
            schoolUsePercentage: 0,
          };
        }),
      });
    },
  ),
];

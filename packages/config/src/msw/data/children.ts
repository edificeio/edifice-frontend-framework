import { Child } from '../../../../client';

export const childRonWeasley: Child = {
  id: '4d9edf62-3185-461b-8639-7b27bf95d5ac',
  firstName: 'Ron',
  displayName: 'Ron Weasley',
  externalId: 'ext-ron-weasley',
  classesNames: ['CE2-A'],
  classes: [
    { id: 'class-ce2-a', name: 'CE2-A' },
    { id: 'class-classe-verte', name: 'Classe verte' },
  ],
};

export const childFredWeasley: Child = {
  id: '93c2611a-b024-4732-b03b-2466c8307086',
  firstName: 'Fred',
  displayName: 'Fred Weasley',
  externalId: 'ext-fred-weasley',
  classesNames: ['CM1-B'],
  classes: [{ id: 'class-cm1-b', name: 'CM1-B' }],
};

export const childGeorgeWeasley: Child = {
  id: '637b68b9-ccf3-4b15-8aa7-d0395de4946f',
  firstName: 'George',
  displayName: 'George Weasley',
  externalId: 'ext-george-weasley',
  classesNames: ['CM1-B'],
  classes: [{ id: 'class-cm1-b', name: 'CM1-B' }],
};

export const childGinnyWeasley: Child = {
  id: 'cf6c8e8c-dbc4-4fee-98b1-12f0687bc89d',
  firstName: 'Ginny',
  displayName: 'Ginny Weasley',
  externalId: 'ext-ginny-weasley',
  classesNames: ['CM2-C'],
  classes: [{ id: 'class-cm2-c', name: 'CM2-C' }],
};

export const mockChildren: Child[] = [
  childRonWeasley,
  childFredWeasley,
  childGeorgeWeasley,
  childGinnyWeasley,
];

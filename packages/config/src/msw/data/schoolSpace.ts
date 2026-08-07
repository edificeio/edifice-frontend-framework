import { School } from '../../../../client/dist';

export const mockSchool1: School = {
  id: 'school-1',
  name: 'Collège Jean Moulin',
  UAI: '0012345A',
  classes: [],
  exports: [],
};

export const mockSchool2: School = {
  id: 'school-2',
  name: 'Lycée Jeanne Ferry',
  UAI: '0098765Z',
  classes: [],
  exports: [],
};

export const mockSchools: School[] = [mockSchool1, mockSchool2];

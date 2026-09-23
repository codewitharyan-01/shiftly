import { generateDemoData } from './generateDemoData';

const demoData = generateDemoData();

// Demo accounts first so they're easiest to find in login lookups
export const mockUsers = [...demoData.demoWorkers, ...demoData.demoPosters];
export const mockShifts = demoData.demoShifts;

export const mockTestimonials = [
  {
    id: 't1',
    name: 'Suresh R.',
    role: 'Warehouse Worker',
    text: 'Shiftly changed everything for me. I pick up packing shifts in Nikol when I have free time and get paid instantly!',
  },
  {
    id: 't2',
    name: 'Mehul T.',
    role: 'Event Manager',
    text: 'Filling staff for my events used to take days. With Shiftly, I find verified helpers in Gandhinagar within hours.',
  },
  {
    id: 't3',
    name: 'Anjali D.',
    role: 'Student',
    text: 'I can balance my studies and earn pocket money by taking short weekend shifts near my college.',
  }
];

export const mockApplications = [
  {
    id: 'a1',
    shiftId: 's1',
    userId: 'u1',
    status: 'Accepted',
    appliedAt: Date.now() - 86400000,
  },
  {
    id: 'a2',
    shiftId: 's3',
    userId: 'u1',
    status: 'Pending',
    appliedAt: Date.now() - 100000,
  }
];

export const mockEarnings = [
  { id: 'e1', date: '2023-11-01', amount: 500, shiftTitle: 'Warehouse Packer', status: 'Paid' },
  { id: 'e2', date: '2023-11-03', amount: 650, shiftTitle: 'Data Entry Temp', status: 'Paid' },
  { id: 'e3', date: '2023-11-05', amount: 800, shiftTitle: 'Event Staff', status: 'Pending' },
];

export const mockWeeklyChartData = [
  { day: 'Mon', amount: 0 },
  { day: 'Tue', amount: 500 },
  { day: 'Wed', amount: 0 },
  { day: 'Thu', amount: 650 },
  { day: 'Fri', amount: 0 },
  { day: 'Sat', amount: 800 },
  { day: 'Sun', amount: 0 },
];

import { LOCATION_COORDS } from './geo';

const NAMES_WORKERS = [
  'Rahul Patel', 'Sunita Sharma', 'Ravi Joshi', 'Priya Mehta',
  'Ankit Desai', 'Kavya Shah', 'Nilesh Solanki', 'Hetal Thakkar',
  'Yash Modi', 'Deepa Panchal'
];

const NAMES_POSTERS = [
  'Rajesh Logistics Pvt', 'Ahmedabad Events Co', 'ShopZone Retail',
  'Metro Packers Ltd', 'WedFest Management'
];

const SHIFT_ROLES = [
  { title: 'Warehouse Packer', category: 'warehouse' },
  { title: 'Event Setup Helper', category: 'events' },
  { title: 'Retail Sales Staff', category: 'retail' },
  { title: 'Delivery Partner', category: 'delivery' },
  { title: 'Wedding Caterer', category: 'weddings' },
  { title: 'Security Guard', category: 'warehouse' },
  { title: 'Data Entry Temp', category: 'retail' },
  { title: 'Floor Manager', category: 'events' },
];

const LOCALITIES = Object.keys(LOCATION_COORDS);

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateDemoData = () => {
  const demoPosters = [
    {
      id: `p0`,
      name: 'Test Poster (Demo)',
      role: 'poster',
      email: 'test@gmail.com',
      password: 'test@123',
      location: `Nikol, Ahmedabad`,
      lat: LOCATION_COORDS['Nikol'].lat,
      lng: LOCATION_COORDS['Nikol'].lng,
      verified: true,
      rating: '5.0',
      reliabilityScore: 100,
    },
    ...NAMES_POSTERS.map((name, i) => {
      const loc = randomItem(LOCALITIES);
      return {
        id: `p${i + 1}`,
        name,
        role: 'poster',
        email: i === 0 ? 'poster@shiftly.in' : `poster${i + 1}@shiftly.in`,
        password: 'demo',
        location: `${loc}, Ahmedabad`,
        lat: LOCATION_COORDS[loc].lat,
        lng: LOCATION_COORDS[loc].lng,
        verified: Math.random() > 0.2,
        rating: (Math.random() * 1 + 4).toFixed(1),
        reliabilityScore: randomInt(90, 100),
      };
    })
  ];

  const demoWorkers = NAMES_WORKERS.map((name, i) => {
    const loc = randomItem(LOCALITIES);
    return {
      id: `u${i + 1}`,
      name,
      role: 'worker',
      email: i === 0 ? 'worker@shiftly.in' : `worker${i + 1}@shiftly.in`,
      password: 'demo',
      location: `${loc}, Ahmedabad`,
      lat: LOCATION_COORDS[loc].lat,
      lng: LOCATION_COORDS[loc].lng,
      skills: [randomItem(['Packing', 'Delivery', 'Retail']), randomItem(['Events', 'Cleaning', 'Security'])],
      verified: Math.random() > 0.3,
      bio: 'Punctual, hardworking, and ready for any shift.',
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      reliabilityScore: randomInt(75, 100),
      availability: { days: [], times: [] },
    };
  });

  const DATES = ['2026-10-01', '2026-10-03', '2026-10-05', '2026-10-07', '2026-10-09', '2026-10-11', '2026-10-15'];
  const TIMES = ['08:00 AM – 04:00 PM', '09:00 AM – 05:00 PM', '02:00 PM – 10:00 PM', '06:00 PM – 12:00 AM'];

  const ALL_RULES = ['Mobile Allowed', 'No Smoking', '15 Min Break', 'Free Tea', 'Safety Gear Required'];
  const getRandomRules = () => {
    const shuffled = [...ALL_RULES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, randomInt(1, 4));
  };

  const demoShifts = Array.from({ length: 20 }).map((_, i) => {
    const poster = demoPosters[i % demoPosters.length];
    const role = randomItem(SHIFT_ROLES);
    const loc = randomItem(LOCALITIES);
    const coords = LOCATION_COORDS[loc];
    const payAmt = randomInt(400, 1500);
    return {
      id: `s${i + 1}`,
      title: role.title,
      category: role.category,
      posterId: poster.id,
      posterName: poster.name,
      description: `Join us for this exciting ${role.title} role near ${loc}. We need ${randomInt(1, 5)} reliable and hardworking staff. This is a great opportunity to earn instantly while working with a verified business. Punctuality is essential, and an ID is required on arrival.`,
      rules: getRandomRules(),
      location: `${loc}, Ahmedabad`,
      lat: coords.lat + (Math.random() * 0.008 - 0.004),
      lng: coords.lng + (Math.random() * 0.008 - 0.004),
      date: randomItem(DATES),
      time: randomItem(TIMES),
      pay: `₹${payAmt}/day`,
      numericPay: payAmt,
      status: Math.random() > 0.82 ? 'Filled' : 'open',
      postedAt: Date.now() - randomInt(3600000, 86400000 * 3),
      isUrgent: Math.random() > 0.72,
    };
  });

  return { demoPosters, demoWorkers, demoShifts };
};

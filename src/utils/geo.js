// Map of known localities to exact Lat/Lng coordinates
export const LOCATION_COORDS = {
  'Nikol': { lat: 23.0440, lng: 72.6657 },
  'Gandhinagar': { lat: 23.2156, lng: 72.6369 },
  'Infocity': { lat: 23.1873, lng: 72.6288 },
  'Kudasan': { lat: 23.1900, lng: 72.6300 },
  'SG Highway': { lat: 23.0722, lng: 72.5164 },
  'Satellite': { lat: 23.0225, lng: 72.5085 },
  'Vastrapur': { lat: 23.0383, lng: 72.5273 },
  'Bopal': { lat: 23.0333, lng: 72.4633 }
};

// Returns exact coords if matched, or rough center of Ahmedabad
export const getCoordsForLocation = (locationString) => {
  if (!locationString) return { lat: 23.0225, lng: 72.5714 }; // Ahmedabad Center
  
  for (const [key, coords] of Object.entries(LOCATION_COORDS)) {
    if (locationString.toLowerCase().includes(key.toLowerCase())) {
      return coords;
    }
  }
  return { lat: 23.0225, lng: 72.5714 }; // Default
};

// Haversine formula to calculate straight-line distance in km
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

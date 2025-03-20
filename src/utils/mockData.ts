
// Current date and time
export const currentDate = new Date();

// Traffic counts
export const trafficData = {
  totalIn: 15782,
  totalOut: 14638,
  hourlyData: Array(24).fill(0).map((_, i) => ({
    hour: i,
    in: Math.floor(Math.random() * 300) + 100,
    out: Math.floor(Math.random() * 280) + 90
  })),
  today: {
    in: 1253,
    out: 1187
  },
  yesterday: {
    in: 1468,
    out: 1392
  },
  weeklyData: Array(7).fill(0).map((_, i) => ({
    day: i,
    in: Math.floor(Math.random() * 1500) + 800,
    out: Math.floor(Math.random() * 1400) + 750
  }))
};

// Gender ratio
export const genderData = {
  male: 53,
  female: 47,
  weeklyTrend: Array(7).fill(0).map(() => ({
    male: Math.floor(Math.random() * 15) + 40,
    female: Math.floor(Math.random() * 15) + 40
  }))
};

// Age demographics
export const ageData = {
  "0-17": 12,
  "18-24": 22,
  "25-34": 27,
  "35-44": 18,
  "45-54": 10,
  "55+": 11,
  weeklyTrend: Array(7).fill(0).map(() => ({
    "0-17": Math.floor(Math.random() * 5) + 10,
    "18-24": Math.floor(Math.random() * 5) + 20,
    "25-34": Math.floor(Math.random() * 5) + 25,
    "35-44": Math.floor(Math.random() * 5) + 15,
    "45-54": Math.floor(Math.random() * 5) + 8,
    "55+": Math.floor(Math.random() * 5) + 10
  }))
};

// Location hierarchy
export const locationData = {
  global: {
    name: "Global",
    count: 124568,
    children: [
      {
        id: "na",
        name: "North America",
        count: 52678,
        children: [
          {
            id: "us",
            name: "United States",
            count: 42315,
            children: [
              { id: "ny", name: "New York", count: 12450, children: [] },
              { id: "la", name: "Los Angeles", count: 10876, children: [] },
              { id: "ch", name: "Chicago", count: 8345, children: [] },
              { id: "sf", name: "San Francisco", count: 7120, children: [] }
            ]
          },
          {
            id: "ca",
            name: "Canada",
            count: 10363,
            children: [
              { id: "to", name: "Toronto", count: 5236, children: [] },
              { id: "va", name: "Vancouver", count: 3185, children: [] }
            ]
          }
        ]
      },
      {
        id: "eu",
        name: "Europe",
        count: 48752,
        children: [
          { id: "uk", name: "United Kingdom", count: 18465, children: [] },
          { id: "fr", name: "France", count: 16234, children: [] },
          { id: "de", name: "Germany", count: 14053, children: [] }
        ]
      },
      {
        id: "as",
        name: "Asia",
        count: 23138,
        children: [
          { id: "jp", name: "Japan", count: 9834, children: [] },
          { id: "cn", name: "China", count: 8124, children: [] },
          { id: "in", name: "India", count: 5180, children: [] }
        ]
      }
    ]
  }
};

// Store locations
export const storeLocations = [
  { id: "st1", name: "Downtown", city: "New York", region: "US East", global: "North America" },
  { id: "st2", name: "Midtown", city: "New York", region: "US East", global: "North America" },
  { id: "st3", name: "West LA", city: "Los Angeles", region: "US West", global: "North America" },
  { id: "st4", name: "South Bay", city: "Los Angeles", region: "US West", global: "North America" },
  { id: "st5", name: "The Loop", city: "Chicago", region: "US Central", global: "North America" },
  { id: "st6", name: "Union Square", city: "San Francisco", region: "US West", global: "North America" },
  { id: "st7", name: "Mayfair", city: "London", region: "UK", global: "Europe" },
  { id: "st8", name: "Champs-Élysées", city: "Paris", region: "France", global: "Europe" },
  { id: "st9", name: "Shibuya", city: "Tokyo", region: "Japan", global: "Asia" },
  { id: "st10", name: "Pudong", city: "Shanghai", region: "China", global: "Asia" }
];

// Time presets
export const timePresets = [
  { id: "today", name: "Today" },
  { id: "yesterday", name: "Yesterday" },
  { id: "7days", name: "Last 7 Days" },
  { id: "30days", name: "Last 30 Days" },
  { id: "90days", name: "Last 90 Days" },
  { id: "ytd", name: "Year to Date" },
  { id: "custom", name: "Custom Range" }
];

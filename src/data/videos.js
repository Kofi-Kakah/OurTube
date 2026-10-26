const sampleSources = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGet.mp4',
]

const createSources = (sourceIndex) => {
  const primaryUrl = sampleSources[sourceIndex % sampleSources.length]
  return [
    { quality: '1080p', url: primaryUrl, type: 'video/mp4' },
    { quality: '720p', url: primaryUrl, type: 'video/mp4' },
    { quality: '480p', url: primaryUrl, type: 'video/mp4' },
    { quality: '360p', url: primaryUrl, type: 'video/mp4' },
  ]
}

const rawVideos = [
  // Technology (ch-1, ch-9)
  {
    title:
      'Building Modern Web Apps with React 19: Full Architecture Walkthrough',
    description:
      'Learn modern React design patterns including server components, compiler optimizations, custom state management with Zustand, and responsive design systems.',
    category: 'Technology',
    tags: ['react', 'javascript', 'frontend', 'web development', 'programming'],
    duration: 1425,
    views: 342000,
    likesCount: 18400,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=640&h=360&fit=crop',
    publishedAt: '2026-09-15T10:00:00Z',
  },
  {
    title: 'Clean Code Principles for Senior Engineers in 2026',
    description:
      'Avoid common architectural pitfalls. We discuss refactoring strategies, decoupling interfaces, test-driven development, and clean architecture.',
    category: 'Technology',
    tags: [
      'software engineering',
      'clean code',
      'architecture',
      'best practices',
    ],
    duration: 980,
    views: 890000,
    likesCount: 42000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&h=360&fit=crop',
    publishedAt: '2026-08-20T14:30:00Z',
  },
  {
    title: 'Building a Microservice Platform from Scratch with Docker & Go',
    description:
      'Hands-on guide to resilient distributed systems, event-driven messaging, gRPC, and container orchestration.',
    category: 'Technology',
    tags: ['golang', 'docker', 'microservices', 'backend', 'devops'],
    duration: 1840,
    views: 215000,
    likesCount: 11200,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=640&h=360&fit=crop',
    publishedAt: '2026-07-11T09:00:00Z',
  },
  {
    title: 'Zustand vs Redux Toolkit: What Should You Use?',
    description:
      'A pragmatic benchmark and architectural comparison between Zustand lightweight stores and traditional Redux state management.',
    category: 'Technology',
    tags: ['zustand', 'redux', 'state management', 'react'],
    duration: 720,
    views: 184000,
    likesCount: 9500,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    publishedAt: '2026-10-01T12:00:00Z',
  },
  {
    title: 'CSS Grid & Flexbox Mastery: Practical Complex Layouts',
    description:
      'Stop guessing CSS properties. Master modern CSS subgrid, responsive container queries, and fluid typography.',
    category: 'Technology',
    tags: ['css', 'web design', 'responsive', 'html'],
    duration: 1150,
    views: 412000,
    likesCount: 23100,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=640&h=360&fit=crop',
    publishedAt: '2026-05-18T16:00:00Z',
  },
  {
    title: 'How Modern AI Coding Agents Actually Work Under the Hood',
    description:
      'Demystifying LLM tool calls, agentic planning loops, AST parsing, and sandboxed bash execution environments.',
    category: 'Technology',
    tags: ['ai', 'machine learning', 'agents', 'llm', 'coding'],
    duration: 1620,
    views: 1250000,
    likesCount: 68000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop',
    publishedAt: '2026-10-10T11:00:00Z',
  },

  // Gaming (ch-2)
  {
    title: 'Elden Ring DLC: Defeating the Ultimate Boss at Level 1 (No Hit)',
    description:
      'Every phase, attack pattern, dodge timing, and frame-perfect punish analyzed in excruciating detail.',
    category: 'Gaming',
    tags: ['elden ring', 'gaming', 'boss fight', 'rpg', 'challenge'],
    duration: 1980,
    views: 2450000,
    likesCount: 115000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    publishedAt: '2026-09-02T18:00:00Z',
  },
  {
    title: 'Unreal Engine 5.5 Next-Gen Graphics Showcase: Lumen & Nanite 2',
    description:
      'Testing the limits of raytraced geometry, real-time global illumination, and high-fidelity physics simulations.',
    category: 'Gaming',
    tags: ['unreal engine', 'graphics', 'pc gaming', 'next gen', 'game dev'],
    duration: 860,
    views: 980000,
    likesCount: 54000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
    publishedAt: '2026-08-14T20:00:00Z',
  },
  {
    title: 'Top 10 Open World Games That Defined a Generation',
    description:
      'Looking back at revolutionary world design, immersion, environmental storytelling, and mechanics.',
    category: 'Gaming',
    tags: ['top 10', 'open world', 'retro', 'playstation', 'xbox'],
    duration: 1450,
    views: 1320000,
    likesCount: 67000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
    publishedAt: '2026-04-22T15:00:00Z',
  },
  {
    title: 'Cyberpunk 2077 in 2026: Raytracing Overhaul Mod Gameplay',
    description:
      'Night City pushed to maximum photorealism with complete path-tracing and DLSS 4 frame reconstruction.',
    category: 'Gaming',
    tags: ['cyberpunk', 'mods', 'rtx', '4k gaming'],
    duration: 1240,
    views: 740000,
    likesCount: 38000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=360&fit=crop',
    publishedAt: '2026-07-29T19:00:00Z',
  },
  {
    title: 'Speedrunning History: How The Impossible Record Was Broken',
    description:
      'The story of how years of routing, sub-pixel skips, and frame perfection yielded a world record.',
    category: 'Gaming',
    tags: ['speedrun', 'world record', 'gaming history', 'esports'],
    duration: 1680,
    views: 1890000,
    likesCount: 92000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
    publishedAt: '2026-06-03T21:00:00Z',
  },

  // Music (ch-3)
  {
    title: 'Midnight Coding & Study Session ☕ Lofi Hip Hop Beats [4K]',
    description:
      'Deep focus instrumental rhythms, calming Rhodes piano chords, and soothing ambient rain sounds.',
    category: 'Music',
    tags: ['lofi', 'beats', 'study music', 'chillhop', 'focus'],
    duration: 3600,
    views: 4500000,
    likesCount: 210000,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=640&h=360&fit=crop',
    publishedAt: '2026-09-01T00:00:00Z',
  },
  {
    title: 'Synthwave Odyssey: 80s Retro Electronic Mix',
    description:
      'Analog synthesizers, neon basslines, and retro-futuristic nostalgic driving energy.',
    category: 'Music',
    tags: ['synthwave', 'retrowave', 'electronic', '80s'],
    duration: 2700,
    views: 1800000,
    likesCount: 88000,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640&h=360&fit=crop',
    publishedAt: '2026-08-05T12:00:00Z',
  },
  {
    title: 'How Legendary Audio Producers Craft Fat 808 Basslines',
    description:
      'Harmonic saturation, stereo side-chaining, phase alignment, and transient shaping tutorial.',
    category: 'Music',
    tags: ['music production', 'mixing', 'audio engineering', 'bass'],
    duration: 940,
    views: 310000,
    likesCount: 16000,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=640&h=360&fit=crop',
    publishedAt: '2026-07-19T14:00:00Z',
  },
  {
    title: 'Ambient Soundscapes for Deep Sleep & Meditation',
    description:
      'Binaural frequencies, drifting tape delays, and resonant pads to unwind your nervous system.',
    category: 'Music',
    tags: ['ambient', 'sleep', 'meditation', 'relaxation'],
    duration: 3200,
    views: 2200000,
    likesCount: 95000,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop',
    publishedAt: '2026-05-14T22:00:00Z',
  },
  {
    title: 'Live Modular Synthesizer Jam: Generative Sequences',
    description:
      'Eurorack modular performance exploring stochastic gates, analog filters, and wavefolding.',
    category: 'Music',
    tags: ['modular', 'eurorack', 'synthesizer', 'live music'],
    duration: 1250,
    views: 165000,
    likesCount: 9800,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop',
    publishedAt: '2026-04-10T17:00:00Z',
  },

  // Cooking & Food (ch-4)
  {
    title: 'Traditional Italian Carbonara: No Cream, Only Perfection',
    description:
      'Guanciale, Pecorino Romano, farm eggs, and fresh cracked pepper. The authentic Roman recipe.',
    category: 'Cooking & Food',
    tags: ['pasta', 'italian food', 'carbonara', 'cooking', 'recipe'],
    duration: 780,
    views: 3100000,
    likesCount: 145000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=640&h=360&fit=crop',
    publishedAt: '2026-08-30T11:00:00Z',
  },
  {
    title: '72-Hour Sourdough Bread: The Ultimate Golden Crust Guide',
    description:
      'Hydration formulas, autolyse techniques, coil folds, and cast iron baking for open crumb texture.',
    category: 'Cooking & Food',
    tags: ['baking', 'sourdough', 'bread', 'chef'],
    duration: 1140,
    views: 890000,
    likesCount: 47000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=640&h=360&fit=crop',
    publishedAt: '2026-07-25T13:00:00Z',
  },
  {
    title: 'Mastering the 5 French Mother Sauces with a Michelin Chef',
    description:
      'Béchamel, Velouté, Espagnole, Sauce Tomate, and Hollandaise explained from first principles.',
    category: 'Cooking & Food',
    tags: ['culinary', 'french cuisine', 'sauce', 'masterclass'],
    duration: 1650,
    views: 1420000,
    likesCount: 78000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&h=360&fit=crop',
    publishedAt: '2026-06-12T15:00:00Z',
  },
  {
    title: 'Authentic Japanese Tonkotsu Ramen from Scratch (14-Hour Broth)',
    description:
      'Pork bone emulsification, tare balance, chashu braising, and handmade alkaline noodles.',
    category: 'Cooking & Food',
    tags: ['ramen', 'japanese food', 'noodles', 'broth'],
    duration: 1890,
    views: 2600000,
    likesCount: 128000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=640&h=360&fit=crop',
    publishedAt: '2026-05-02T12:00:00Z',
  },
  {
    title: 'Reverse Sear vs Sous Vide: Finding the Perfect Ribeye Steak',
    description:
      'Temperature curves, Maillard crust optimization, and blind taste testing comparing methods.',
    category: 'Cooking & Food',
    tags: ['steak', 'grilling', 'beef', 'cooking test'],
    duration: 890,
    views: 1150000,
    likesCount: 52000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=640&h=360&fit=crop',
    publishedAt: '2026-04-18T14:00:00Z',
  },

  // Science (ch-5)
  {
    title:
      'What Happens Inside the Event Horizon of a Supermassive Black Hole?',
    description:
      'General relativity, tidal spaghettification, frame dragging, and hawking radiation simulations.',
    category: 'Science',
    tags: ['physics', 'space', 'astronomy', 'black hole', 'cosmos'],
    duration: 1320,
    views: 3800000,
    likesCount: 195000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop',
    publishedAt: '2026-09-08T16:00:00Z',
  },
  {
    title: 'The Quantum Measurement Problem Explained Intuitively',
    description:
      'Wave function collapse, the double-slit experiment, Many-Worlds interpretation, and decoherence.',
    category: 'Science',
    tags: ['quantum mechanics', 'science', 'physics', 'philosophy'],
    duration: 1040,
    views: 1650000,
    likesCount: 84000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=640&h=360&fit=crop',
    publishedAt: '2026-08-01T17:00:00Z',
  },
  {
    title:
      'James Webb Telescope Discovers Impossible Galaxies at the Edge of Time',
    description:
      'Early cosmic dawn galaxies defy stellar evolution models and challenge our dark matter predictions.',
    category: 'Science',
    tags: ['jwst', 'space', 'galaxies', 'universe', 'astrophysics'],
    duration: 1200,
    views: 2900000,
    likesCount: 142000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=640&h=360&fit=crop',
    publishedAt: '2026-06-20T11:00:00Z',
  },
  {
    title: 'Nuclear Fusion Breakthrough: Clean Energy within Reach?',
    description:
      'Stellarators vs Tokamaks, magnetic confinement stability, and net energy gain milestones.',
    category: 'Science',
    tags: ['fusion', 'clean energy', 'technology', 'physics'],
    duration: 990,
    views: 1430000,
    likesCount: 71000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=640&h=360&fit=crop',
    publishedAt: '2026-05-11T13:00:00Z',
  },
  {
    title: 'Are We Alone in the Milky Way? The Fermi Paradox Solved?',
    description:
      'The Great Filter, Dyson spheres, planetary habitability zones, and Drake equation probabilities.',
    category: 'Science',
    tags: ['aliens', 'fermi paradox', 'astronomy', 'seti'],
    duration: 1540,
    views: 4100000,
    likesCount: 220000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
    publishedAt: '2026-03-29T18:00:00Z',
  },

  // Fitness & Health (ch-6)
  {
    title: 'Full Body 20-Minute HIIT Workout: Zero Equipment Needed',
    description:
      'High intensity interval training routine targeting cardiovascular endurance, core, and metabolic burn.',
    category: 'Fitness & Health',
    tags: ['hiit', 'workout', 'cardio', 'calisthenics', 'fitness'],
    duration: 1200,
    views: 1850000,
    likesCount: 79000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=640&h=360&fit=crop',
    publishedAt: '2026-09-12T07:00:00Z',
  },
  {
    title: 'Fix Your Posture & Eliminate Lower Back Pain in 10 Minutes',
    description:
      'Physical therapy exercises focusing on thoracic mobility, glute activation, and pelvic alignment.',
    category: 'Fitness & Health',
    tags: ['mobility', 'posture', 'back pain', 'stretching', 'health'],
    duration: 610,
    views: 2950000,
    likesCount: 165000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=640&h=360&fit=crop',
    publishedAt: '2026-08-18T08:00:00Z',
  },
  {
    title: 'The Science of Hypertrophy: How Muscles Actually Grow',
    description:
      'Mechanical tension, metabolic stress, muscle damage, protein synthesis windows, and progressive overload.',
    category: 'Fitness & Health',
    tags: ['muscle', 'hypertrophy', 'bodybuilding', 'science'],
    duration: 1120,
    views: 940000,
    likesCount: 48000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=640&h=360&fit=crop',
    publishedAt: '2026-06-30T10:00:00Z',
  },
  {
    title: 'Daily Morning Mobility Routine for Stiff Joints',
    description:
      'Gentle spinal waves, hip openers, and ankle dorsiflexion to kickstart your nervous system every morning.',
    category: 'Fitness & Health',
    tags: ['yoga', 'morning routine', 'mobility', 'wellness'],
    duration: 750,
    views: 1240000,
    likesCount: 63000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=640&h=360&fit=crop',
    publishedAt: '2026-05-24T06:30:00Z',
  },
  {
    title: 'Sleep Optimization Protocol: Huberman Inspired Routine',
    description:
      'Morning sunlight viewing, temperature regulation, magnesium supplementation, and sleep architecture.',
    category: 'Fitness & Health',
    tags: ['sleep', 'biohacking', 'health', 'recovery'],
    duration: 890,
    views: 1600000,
    likesCount: 82000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=640&h=360&fit=crop',
    publishedAt: '2026-04-05T09:00:00Z',
  },

  // Movies & Animation (ch-7)
  {
    title: 'Why Spider-Verse Animation Redefined Modern Cinematography',
    description:
      'Frame rate variability, chromatic aberration, halftone textures, and comic book visual language.',
    category: 'Movies & Animation',
    tags: ['animation', 'film', 'spider-man', 'cinematography', 'art'],
    duration: 1260,
    views: 2100000,
    likesCount: 110000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop',
    publishedAt: '2026-08-25T17:00:00Z',
  },
  {
    title: 'Color Grading Secrets of David Fincher & Denis Villeneuve',
    description:
      'Teal and orange color harmony, monochromatic contrast curves, and psychological mood lighting.',
    category: 'Movies & Animation',
    tags: ['color grading', 'davinci resolve', 'filmmaking', 'directing'],
    duration: 980,
    views: 780000,
    likesCount: 41000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=640&h=360&fit=crop',
    publishedAt: '2026-07-08T19:00:00Z',
  },
  {
    title: 'The Lost Art of Practical Effects in Hollywood Blockbusters',
    description:
      'Animatronics, miniature models, matte paintings, and pyrotechnics that still hold up better than CGI.',
    category: 'Movies & Animation',
    tags: ['cgi', 'practical effects', 'vfx', 'movie history'],
    duration: 1420,
    views: 1350000,
    likesCount: 69000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=640&h=360&fit=crop',
    publishedAt: '2026-06-16T16:00:00Z',
  },
  {
    title: 'Studio Ghibli: The Philosophy of Hand-Drawn Magic',
    description:
      'Hayao Miyazaki on pacing, quiet moments of wonder ("Ma"), and organic watercolor backgrounds.',
    category: 'Movies & Animation',
    tags: ['ghibli', 'anime', 'miyazaki', 'hand drawn'],
    duration: 1150,
    views: 1890000,
    likesCount: 104000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=640&h=360&fit=crop',
    publishedAt: '2026-05-09T18:00:00Z',
  },
  {
    title: 'Sound Design Breakdown: The Terrifying Audio of Dune Part Two',
    description:
      'Worm riders, spice harvesters, Voice effects, and Hans Zimmer microtonal wind orchestrations.',
    category: 'Movies & Animation',
    tags: ['sound design', 'dune', 'foley', 'hans zimmer'],
    duration: 890,
    views: 920000,
    likesCount: 53000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop',
    publishedAt: '2026-04-01T20:00:00Z',
  },

  // Travel & Adventure (ch-8)
  {
    title: 'Kyoto in Autumn Rain: 4K HDR Binaural Walking Tour',
    description:
      'Walk through historic Gion, bamboo groves in Arashiyama, and traditional lantern-lit stone alleys.',
    category: 'Travel & Adventure',
    tags: ['japan', 'kyoto', '4k walk', 'travel', 'ambience'],
    duration: 2400,
    views: 3100000,
    likesCount: 152000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=640&h=360&fit=crop',
    publishedAt: '2026-09-22T04:00:00Z',
  },
  {
    title: 'Solo Backpacking Across the Swiss Alps: Tour du Mont Blanc',
    description:
      'Glacial passes, alpine huts, sunrise over snowy peaks, and ultralight gear breakdown.',
    category: 'Travel & Adventure',
    tags: ['hiking', 'switzerland', 'alps', 'backpacking', 'adventure'],
    duration: 1850,
    views: 1450000,
    likesCount: 76000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&h=360&fit=crop',
    publishedAt: '2026-08-11T14:00:00Z',
  },
  {
    title: 'Exploring Iceland in Winter: Northern Lights & Ice Caves',
    description:
      'Chasing auroras across black sand beaches, traversing Vatnajökull ice caves, and geothermal lagoons.',
    category: 'Travel & Adventure',
    tags: ['iceland', 'aurora', 'winter', 'nature', 'landscape'],
    duration: 1320,
    views: 2150000,
    likesCount: 114000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=640&h=360&fit=crop',
    publishedAt: '2026-07-02T16:00:00Z',
  },
  {
    title: 'Lost in the Souks of Marrakech: Food, Architecture & Culture',
    description:
      'Navigating Medina mazes, tasting tagine and mint tea, and discovering Bahia Palace courtyards.',
    category: 'Travel & Adventure',
    tags: ['morocco', 'marrakech', 'street food', 'travel vlog'],
    duration: 980,
    views: 890000,
    likesCount: 46000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=640&h=360&fit=crop',
    publishedAt: '2026-06-05T12:00:00Z',
  },
  {
    title: 'Sailing the Norwegian Fjords: Geirangerfjord to Lofoten',
    description:
      'Dramatic cliffs, cascading waterfalls, remote fishing villages, and arctic midnight sun.',
    category: 'Travel & Adventure',
    tags: ['norway', 'fjords', 'sailing', 'arctic', 'adventure'],
    duration: 1650,
    views: 1720000,
    likesCount: 89000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=640&h=360&fit=crop',
    publishedAt: '2026-05-19T10:00:00Z',
  },

  // Education (ch-1, ch-9)
  {
    title: 'Computer Science in 20 Minutes: From Transistors to AI',
    description:
      'Logic gates, binary arithmetic, CPU pipelining, operating system kernels, compilers, and neural networks.',
    category: 'Education',
    tags: ['computer science', 'education', 'learning', 'coding'],
    duration: 1220,
    views: 2800000,
    likesCount: 145000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop',
    publishedAt: '2026-09-05T15:00:00Z',
  },
  {
    title: 'Linear Algebra for Machine Learning: Geometric Intuition',
    description:
      'Vector spaces, dot products, eigenvalues, eigenvectors, and singular value decomposition visualized.',
    category: 'Education',
    tags: ['math', 'machine learning', 'linear algebra', 'data science'],
    duration: 1480,
    views: 1120000,
    likesCount: 62000,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=640&h=360&fit=crop',
    publishedAt: '2026-07-15T11:00:00Z',
  },
  {
    title: 'How The Internet Actually Works: Packets, DNS & BGP',
    description:
      'Undersea fiber cables, TCP handshakes, DNS resolution, TLS certificates, and BGP border routing.',
    category: 'Education',
    tags: ['networking', 'internet', 'dns', 'sysadmin'],
    duration: 1100,
    views: 1540000,
    likesCount: 78000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=640&h=360&fit=crop',
    publishedAt: '2026-06-28T14:00:00Z',
  },
  {
    title: 'Critical Thinking: 10 Cognitive Biases That Ruin Decisions',
    description:
      'Confirmation bias, sunk cost fallacy, availability heuristic, and framing effects examined.',
    category: 'Education',
    tags: ['psychology', 'philosophy', 'thinking', 'productivity'],
    duration: 860,
    views: 1980000,
    likesCount: 96000,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&h=360&fit=crop',
    publishedAt: '2026-05-10T12:00:00Z',
  },
  {
    title: 'Financial Literacy 101: Index Funds, Compound Interest & Taxes',
    description:
      'Smart investing fundamentals, dollar-cost averaging, retirement accounts, and risk diversification.',
    category: 'Education',
    tags: ['finance', 'investing', 'money', 'wealth'],
    duration: 1350,
    views: 2300000,
    likesCount: 118000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&h=360&fit=crop',
    publishedAt: '2026-04-12T16:00:00Z',
  },

  // Comedy (ch-10)
  {
    title: 'Software Developers in Meetings Be Like...',
    description:
      'Every classic tech meeting stereotype: the silent architect, the urgent bug that is a feature, and estimates.',
    category: 'Comedy',
    tags: ['comedy', 'skit', 'developer humor', 'tech funny'],
    duration: 215,
    views: 4200000,
    likesCount: 280000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=640&h=360&fit=crop',
    publishedAt: '2026-09-18T18:00:00Z',
  },
  {
    title: 'If Humans Acted Like Operating Systems in Real Life',
    description:
      'Crashing on simple tasks, forced updates while walking, and forgetting everything during sleep mode.',
    category: 'Comedy',
    tags: ['humor', 'sketch', 'parody', 'relatable'],
    duration: 290,
    views: 2900000,
    likesCount: 190000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=640&h=360&fit=crop',
    publishedAt: '2026-08-04T19:00:00Z',
  },
  {
    title: 'Every Coffee Snob You Have Ever Met',
    description:
      'Single-origin Ethiopian anaerobic ferments, TDS refractometers, and pouring water at 93.4 degrees Celsius.',
    category: 'Comedy',
    tags: ['coffee', 'satire', 'funny', 'skit'],
    duration: 320,
    views: 1850000,
    likesCount: 125000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=640&h=360&fit=crop',
    publishedAt: '2026-07-12T17:00:00Z',
  },
  {
    title: 'Smart Homes That Are Way Too Aggressive',
    description:
      'When your smart fridge and thermostat team up against you because you stayed up past your bedtime.',
    category: 'Comedy',
    tags: ['comedy', 'smart home', 'ai', 'sketch'],
    duration: 260,
    views: 2100000,
    likesCount: 140000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=640&h=360&fit=crop',
    publishedAt: '2026-06-01T20:00:00Z',
  },
  {
    title: 'Customer Support on Hold: The Musical',
    description:
      'The agonizing symphony of repeating hold music, sudden loud voice prompts, and unexpected disconnects.',
    category: 'Comedy',
    tags: ['humor', 'parody', 'relatable', 'short'],
    duration: 185,
    views: 1600000,
    likesCount: 105000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=640&h=360&fit=crop',
    publishedAt: '2026-05-15T15:00:00Z',
  },

  // Nature & Wildlife (ch-11)
  {
    title: 'The Secret Kingdom of Deep Ocean Bioluminescent Creatures',
    description:
      'Submersible footage 4,000 meters below sea level capturing anglerfish, siphonophores, and comb jellies.',
    category: 'Science',
    tags: ['ocean', 'wildlife', 'deep sea', 'documentary', 'nature'],
    duration: 1750,
    views: 3900000,
    likesCount: 205000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=640&h=360&fit=crop',
    publishedAt: '2026-09-10T12:00:00Z',
  },
  {
    title: 'Amazon Rainforest: The Greatest Biodiversity on Earth',
    description:
      'Tracking jaguars, harpy eagles, poison dart frogs, and ancient canopy ecosystems in 4K.',
    category: 'Science',
    tags: ['rainforest', 'amazon', 'animals', 'ecology'],
    duration: 2100,
    views: 2450000,
    likesCount: 130000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=640&h=360&fit=crop',
    publishedAt: '2026-08-16T14:00:00Z',
  },
  {
    title: 'Serengeti Migration: The Endless Cycle of Survival',
    description:
      'Millions of wildebeest, zebras, and apex predators traversing the Mara River in East Africa.',
    category: 'Science',
    tags: ['safari', 'africa', 'wildlife', 'nature'],
    duration: 1980,
    views: 1850000,
    likesCount: 98000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=640&h=360&fit=crop',
    publishedAt: '2026-07-04T10:00:00Z',
  },
  {
    title: 'Living with Wolves in the Canadian Rockies',
    description:
      'Behavioral biologist documents pack dynamics, vocalizations, and winter survival tactics.',
    category: 'Science',
    tags: ['wolves', 'canada', 'nature', 'documentary'],
    duration: 1540,
    views: 2700000,
    likesCount: 142000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=640&h=360&fit=crop',
    publishedAt: '2026-06-18T16:00:00Z',
  },
  {
    title: 'Coral Reef Restoration: Breathing Life into Bleached Reefs',
    description:
      'Marine biologists cultivate heat-resilient coral micro-fragments to save barrier reefs.',
    category: 'Science',
    tags: ['coral', 'marine biology', 'conservation', 'ocean'],
    duration: 1180,
    views: 920000,
    likesCount: 52000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=640&h=360&fit=crop',
    publishedAt: '2026-05-28T13:00:00Z',
  },

  // Automotive (ch-12)
  {
    title:
      'Porsche 911 GT3 RS on Nürburgring Nordschleife: Lap Record Breakdown',
    description:
      'Aerodynamic downforce analysis, DRS actuation, tire temperature telemetry, and onboard lap review.',
    category: 'Technology',
    tags: ['cars', 'porsche', 'nurburgring', 'motorsport', 'supercar'],
    duration: 1050,
    views: 2800000,
    likesCount: 148000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=360&fit=crop',
    publishedAt: '2026-09-04T16:00:00Z',
  },
  {
    title: 'Solid-State EV Batteries: Why 1,000km Range is Finally Real',
    description:
      'Lithium metal anodes, ceramic electrolyte safety, and charging speed improvements tested.',
    category: 'Technology',
    tags: ['electric vehicles', 'battery', 'tech', 'automotive'],
    duration: 920,
    views: 1650000,
    likesCount: 88000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=640&h=360&fit=crop',
    publishedAt: '2026-08-08T15:00:00Z',
  },
  {
    title: 'We Restored a Rare 1969 Shelby GT500 in 30 Days',
    description:
      'Complete frame-off restoration, 428 Cobra Jet V8 dyno tuning, and maiden highway blast.',
    category: 'Technology',
    tags: ['muscle car', 'restoration', 'ford', 'v8'],
    duration: 1820,
    views: 3400000,
    likesCount: 182000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=640&h=360&fit=crop',
    publishedAt: '2026-07-22T12:00:00Z',
  },
  {
    title: 'Rimac Nevera vs Formula 1 Car: Drag Race & Brake Test',
    description:
      '2,000 horsepower quad-motor all-wheel drive against modern lightweight downforce engineering.',
    category: 'Technology',
    tags: ['drag race', 'f1', 'rimac', 'racing'],
    duration: 740,
    views: 4100000,
    likesCount: 220000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1541348263662-e0c86437da7b?w=640&h=360&fit=crop',
    publishedAt: '2026-06-14T17:00:00Z',
  },
  {
    title: 'The Engineering Genius of the Naturally Aspirated V12 Engine',
    description:
      'Perfect primary and secondary mechanical balance, acoustic firing orders, and exhaust resonance.',
    category: 'Technology',
    tags: ['engine', 'v12', 'ferrari', 'mechanics'],
    duration: 1140,
    views: 1250000,
    likesCount: 69000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=640&h=360&fit=crop',
    publishedAt: '2026-05-04T18:00:00Z',
  },

  // Additional diverse videos to reach 64+ videos
  {
    title:
      'Mastering Chess Tactics: The Most Beautiful Combinations in History',
    description:
      'Kasparov, Tal, Fischer, and Carlsen sacrifices that shattered grandmaster defenses.',
    category: 'Education',
    tags: ['chess', 'tactics', 'strategy', 'games'],
    duration: 1340,
    views: 890000,
    likesCount: 45000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=640&h=360&fit=crop',
    publishedAt: '2026-09-20T14:00:00Z',
  },
  {
    title: 'How to Build an Ultra-Quiet Custom Mechanical Keyboard',
    description:
      'Lubing linear switches, tape mods, gasket mounting, and brass weight sound test comparisons.',
    category: 'Technology',
    tags: ['mechanical keyboard', 'diy', 'tech', 'desk setup'],
    duration: 820,
    views: 650000,
    likesCount: 38000,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=640&h=360&fit=crop',
    publishedAt: '2026-08-17T11:00:00Z',
  },
  {
    title: 'Deep House Sunset Session: Live from Ibiza Cliffs',
    description:
      'Warm analog chords, organic percussion, and uplifting vocal cuts recorded live at golden hour.',
    category: 'Music',
    tags: ['house music', 'dj set', 'sunset', 'electronic'],
    duration: 3600,
    views: 1950000,
    likesCount: 98000,
    channelId: 'ch-3',
    thumbnail:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop',
    publishedAt: '2026-07-28T19:00:00Z',
  },
  {
    title: 'The Art of Handmade Japanese Knives: From Ore to Edge',
    description:
      'Master blacksmith forges Damascus steel kitchen knives with 500-year-old traditional methods.',
    category: 'Cooking & Food',
    tags: ['knives', 'craftsmanship', 'japan', 'cooking'],
    duration: 1420,
    views: 2850000,
    likesCount: 154000,
    channelId: 'ch-4',
    thumbnail:
      'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=640&h=360&fit=crop',
    publishedAt: '2026-06-25T13:00:00Z',
  },
  {
    title: 'Can We Terraformat Mars? A Scientific Reality Check',
    description:
      'Atmospheric pressure, magnetic field generation, orbital mirrors, and microbial extremophiles.',
    category: 'Science',
    tags: ['mars', 'space colonization', 'science', 'astronomy'],
    duration: 1280,
    views: 1780000,
    likesCount: 91000,
    channelId: 'ch-5',
    thumbnail:
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=640&h=360&fit=crop',
    publishedAt: '2026-05-30T15:00:00Z',
  },
  {
    title: '15-Minute Daily Core Workout for Bulletproof Abs',
    description:
      'Hollow body holds, plank variations, bird-dogs, and rotational anti-flexion movements.',
    category: 'Fitness & Health',
    tags: ['abs', 'core', 'fitness', 'workout'],
    duration: 900,
    views: 1450000,
    likesCount: 72000,
    channelId: 'ch-6',
    thumbnail:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&h=360&fit=crop',
    publishedAt: '2026-04-20T08:00:00Z',
  },
  {
    title: 'Behind the Scenes: How Pixar Animates Emotion',
    description:
      'Subtle facial micro-expressions, squash and stretch, eye darts, and lighting character beats.',
    category: 'Movies & Animation',
    tags: ['pixar', 'animation', 'character design', 'cgi'],
    duration: 1040,
    views: 1620000,
    likesCount: 88000,
    channelId: 'ch-7',
    thumbnail:
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=640&h=360&fit=crop',
    publishedAt: '2026-03-15T17:00:00Z',
  },
  {
    title: 'Scuba Diving with Manta Rays in the Maldives',
    description:
      'Pristine coral atolls, feeding aggregations, plankton blooms, and gentle ocean giants in 4K.',
    category: 'Travel & Adventure',
    tags: ['scuba', 'maldives', 'ocean', 'manta ray', 'diving'],
    duration: 1180,
    views: 1890000,
    likesCount: 102000,
    channelId: 'ch-8',
    thumbnail:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=640&h=360&fit=crop',
    publishedAt: '2026-02-28T11:00:00Z',
  },
  {
    title: 'How To Learn Any Language in 6 Months: Polyglot Secrets',
    description:
      'Comprehensible input, spaced repetition, phonetic immersion, and overcoming the speaking plateau.',
    category: 'Education',
    tags: ['language learning', 'polyglot', 'study', 'education'],
    duration: 1110,
    views: 2400000,
    likesCount: 135000,
    channelId: 'ch-1',
    thumbnail:
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=640&h=360&fit=crop',
    publishedAt: '2026-02-14T10:00:00Z',
  },
  {
    title: 'When The Wi-Fi Goes Down for 5 Minutes',
    description:
      'Panic ensues as modern society forgets how to look outside, write on paper, or talk to neighbors.',
    category: 'Comedy',
    tags: ['humor', 'skit', 'wifi', 'relatable'],
    duration: 195,
    views: 2600000,
    likesCount: 175000,
    channelId: 'ch-10',
    thumbnail:
      'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=640&h=360&fit=crop',
    publishedAt: '2026-01-20T16:00:00Z',
  },
  {
    title: 'The Great Barrier Reef at Night: Ultraviolet Biofluorescence',
    description:
      'UV underwater lights reveal electric greens, glowing pinks, and hidden coral hunting behavior.',
    category: 'Science',
    tags: ['coral reef', 'night dive', 'fluorescence', 'nature'],
    duration: 1350,
    views: 1100000,
    likesCount: 64000,
    channelId: 'ch-11',
    thumbnail:
      'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=640&h=360&fit=crop',
    publishedAt: '2026-01-10T14:00:00Z',
  },
  {
    title: 'Tuning an 800HP Toyota Supra 2JZ on the Dyno',
    description:
      'Massive single turbo spool, anti-lag flames, boost controller mapping, and screaming rev limiter.',
    category: 'Technology',
    tags: ['supra', '2jz', 'dyno', 'tuning', 'jdm'],
    duration: 890,
    views: 3200000,
    likesCount: 190000,
    channelId: 'ch-12',
    thumbnail:
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=640&h=360&fit=crop',
    publishedAt: '2025-12-18T18:00:00Z',
  },
  {
    title: 'Mastering Git Rebase, Cherry-Pick & Reflog',
    description:
      'Rewriting commit history, squashing commits, resolving hairy merge conflicts, and recovering lost work.',
    category: 'Technology',
    tags: ['git', 'version control', 'developer tips', 'coding'],
    duration: 840,
    views: 520000,
    likesCount: 31000,
    channelId: 'ch-9',
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    publishedAt: '2025-11-29T12:00:00Z',
  },
  {
    title: 'How Game Designers Trick Your Brain with Satisfying Audio',
    description:
      'Hit markers, loot drops, casino chimes, level-up fanfares, and dopamine loop mechanics.',
    category: 'Gaming',
    tags: ['game design', 'audio', 'psychology', 'gaming'],
    duration: 1020,
    views: 1450000,
    likesCount: 78000,
    channelId: 'ch-2',
    thumbnail:
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=360&fit=crop',
    publishedAt: '2025-11-12T16:00:00Z',
  },
]

export const videos = rawVideos.map((video, index) => {
  const id = `vid-${index + 1}`
  return {
    id,
    ...video,
    sources: createSources(index),
  }
})

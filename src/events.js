export const Pt = {
  TECHNICAL: "Technical",
  NON_TECHNICAL: "Non-Technical"
};

export const ut = {
  PENDING: "Payment Pending Verification",
  REVIEW: "Under Review",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  PRESENT: "Checked In"
};

export const lp = "2026-09-03T09:00:00";

export const Sr = [
  {
    id: "cad-craft",
    title: "CAD CRAFT",
    whatsappLink: "https://chat.whatsapp.com/HoiclgPoIm6E66eAsU9CJk",
    description: "A fast-paced AutoCAD design challenge. Draw, annotate, and deliver architectural plans under strict time limits.",
    category: Pt.TECHNICAL,
    maxMembers: 2,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "10:30 AM",
    image: "https://images.unsplash.com/photo-1503387762-592dedb8c260?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "ROUND 1: THE BLUEPRINT SPRINT",
        details: "Format: Screen-based AutoCAD drafting. Structure: Recreate a 2D floor plan from a given printed layout within 30 minutes. Focus: Accuracy, layers, dimensioning, and speed."
      },
      {
        name: "ROUND 2: THE 3D DEEP-DIVE",
        details: "Format: Advanced 3D modeling challenge. Structure: Extrude and model a 3D elevation from the 2D layout. Time: 45 minutes."
      }
    ],
    rules: [
      "Use of shortcuts and custom commands is permitted.",
      "Laptops with AutoCAD installed must be brought, or computer labs will be allocated.",
      "Plagiarism or copying pre-existing blocks is strictly prohibited.",
      "Any form of malpractice leads to immediate disqualification.",
      "The judges' decisions are final and binding."
    ],
    coordinators: [
      { name: "SUNDHARAMOORTHI K", phone: "8248121866" }
    ]
  },
  {
    id: "spruce-span",
    title: "SPRUCE SPAN",
    whatsappLink: "https://chat.whatsapp.com/IOl3b8G0o09LS6enAhgSOj",
    description: "The ultimate bridge-building competition. Build structural bridge models and test their load-carrying capacity to destruction.",
    slogan: "Strength in shapes, beauty in spans",
    category: Pt.TECHNICAL,
    maxMembers: 3,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "11:00 AM",
    image: "https://images.unsplash.com/photo-1447087640989-1065792fb138?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "ROUND 1: TRUSS DRAFTING",
        details: "Design and present a load distribution scheme on paper. Explain truss mechanics, nodes, and expected load paths."
      },
      {
        name: "ROUND 2: LOAD SHIELD TESTING",
        details: "Construct the bridge using the provided materials (sticks/glue) and submit it for point-load testing on a hydraulic rig until failure. Highest load-to-weight ratio wins."
      }
    ],
    rules: [
      "Materials for construction will be provided at the venue.",
      "Bridge dimensions must strictly satisfy standard constraints (Length: 40cm, Width: 10cm).",
      "Only approved adhesives can be used.",
      "Coordinator's decision is final."
    ],
    coordinators: [
      { name: "Barath Kumar M", phone: "6380616416" }
    ]
  },
  {
    id: "concrete-master",
    title: "CONCRETE MASTER",
    whatsappLink: "https://chat.whatsapp.com/DzQ8iWwPgQ2BswxL9NFnV0",
    description: "A materials science testing event focusing on concrete mix design, water-cement ratios, compressive strength calculations, and innovative green materials.",
    category: Pt.TECHNICAL,
    maxMembers: 2,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "02:00 PM",
    image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "ROUND 1: MIX RATIO DESIGN",
        details: "Calculate the exact batch weights of cement, aggregates, and water for a specified characteristic strength (e.g. M30)."
      },
      {
        name: "ROUND 2: CURE & COMPRESS",
        details: "Explain curing techniques, admixture effects, and participate in a virtual compression testing quiz."
      }
    ],
    rules: [
      "Use of standard IS codebooks (IS 10262) is allowed (copies will be provided).",
      "Calculators are mandatory.",
      "Cheating leads to disqualification.",
      "Coordinator's decision is final."
    ],
    coordinators: [
      { name: "GOKUL RAJ M", phone: "9025280584" }
    ]
  },
  {
    id: "survey-elite",
    title: "SURVEY ELITE",
    whatsappLink: "https://chat.whatsapp.com/J76CCGv8YuJ56ZjXmSyl0E",
    description: "Demonstrate precision in surveying. Set up instruments, perform leveling, and compute contours in a live field environment.",
    slogan: "Measure twice, dig once",
    category: Pt.TECHNICAL,
    maxMembers: 3,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "10:00 AM",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800",
    rounds: [
      {
        name: "ROUND 1: QUICK LEVELING",
        details: "Set up the auto level or theodolite instrument over a peg and perform initial adjustments. Speed and centering accuracy are evaluated."
      },
      {
        name: "ROUND 2: PROFILE PROFILE MAP",
        details: "Take staff readings across a grid, calculate reduced levels (RL) using height of instrument method, and plot a quick profile map."
      }
    ],
    rules: [
      "Instrument handling should be done with utmost care.",
      "Calculations must be presented clearly on field sheets.",
      "Winner determined by minimum error in closed traverse/loop closure."
    ],
    coordinators: [
      { name: "Saravana bala S", phone: "9080046138" }
    ]
  },
  {
    id: "paper-xpose",
    title: "PAPERXPOSE",
    whatsappLink: "https://chat.whatsapp.com/FiPNsYv95y4GMWzAlnh51e",
    description: "A research platform to present innovative developments in smart structures, green building materials, transportation engineering, and environmental management.",
    slogan: "Drafting concepts. Engineering futures.",
    category: Pt.TECHNICAL,
    maxMembers: 4,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "10:00 AM",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Team size: Maximum 3 or 4 members.",
      "Abstract should be submitted in PDF and PPT format (6-7 slides) before September 1 on adage26@gmail.com.",
      "Topics must relate to Civil Engineering, smart materials, or environmental sustainability.",
      "Presentation must be 7-10 minutes followed by Q&A.",
      "College ID card is mandatory.",
      "The decision of the judges is final."
    ],
    coordinators: [
      { name: "PALANI R", phone: "8682938618" }
    ]
  },
  {
    id: "geo-analyze",
    title: "GEO-ANALYZE",
    whatsappLink: "https://chat.whatsapp.com/DjHbLLT6NurKvf9Lav76CV",
    description: "Analyze soil characteristics, soil profiles, foundation settlement challenges, and design retainment solutions for unstable slopes.",
    slogan: "Understanding the ground beneath",
    category: Pt.TECHNICAL,
    maxMembers: 2,
    fee: 250,
    prize: "Certificate + Cash Prize",
    timing: "10:00 AM",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Calculators are permitted.",
      "Concepts will cover soil compaction, shear strength, and retaining wall stability.",
      "Presentations will be on design layouts for foundation pegs.",
      "Evaluated based on structural feasibility and calculation correctness."
    ],
    coordinators: [
      { name: "Akash S", phone: "9677132896" }
    ]
  },
  {
    id: "urbanscapes",
    title: "URBANSCAPES",
    whatsappLink: "https://chat.whatsapp.com/BvciWK0VlU20V0FxqWBJtj",
    description: "Design and pitch a green, self-sustaining city layout. Balance residential zone spacing, transport systems, waste disposal, and parks.",
    category: Pt.NON_TECHNICAL,
    maxMembers: 4,
    fee: 150,
    prize: "Certificate + Cash Prize",
    timing: "02:00 PM",
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Team size: 2 to 4 members.",
      "Create and present drawing charts at the venue. Basic drawing tools (sheets) will be provided.",
      "Incorporate green energy nodes, rainwater harvesting systems, and metro links.",
      "Presentation pitch is limited to 5 minutes."
    ],
    coordinators: [
      { name: "Midhun.R", phone: "9787671962" }
    ]
  },
  {
    id: "shutter-span",
    title: "SHUTTER SPAN",
    whatsappLink: "https://chat.whatsapp.com/C29zQ3jszmI77CQ7kt3Eqq",
    description: "Infrastructure photography competition. Capture the aesthetic geometry of bridges, historical structures, and concrete architecture around you.",
    slogan: "Lenses focusing on concrete giants",
    category: Pt.NON_TECHNICAL,
    maxMembers: 1,
    fee: 150,
    prize: "Certificate + Cash Prize",
    timing: "11:30 AM",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Individual event.",
      "Photos must be captured inside the college campus or submitted online if pre-requested.",
      "No heavy digital manipulation (basic contrast/exposure edits are allowed).",
      "Submit image file in EXIF readable format."
    ],
    coordinators: [
      { name: "Saru Nithish R", phone: "7339250785" }
    ]
  },
  {
    id: "mystery-block",
    title: "MYSTERY BLOCK",
    whatsappLink: "https://chat.whatsapp.com/Lgby2njOCKB7bi5n8vSY4D",
    description: "A fun-filled non-technical puzzle event. Open mystery boxes containing Jenga challenges, bricks stacking, and structural puzzle elements.",
    slogan: "Face the block and balance the load",
    category: Pt.NON_TECHNICAL,
    maxMembers: 2,
    fee: 150,
    prize: "Certificate + Cash Prize",
    timing: "01:30 PM",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Team of 2 members.",
      "Tasks must be finished in the allocated countdown period.",
      "Balance and tower stability are checked. Overturning results in point deduction.",
      "Have fun and stack smart!"
    ],
    coordinators: [
      { name: "Bharath PS", phone: "9095343275" }
    ]
  },
  {
    id: "cad-prompt",
    title: "CAD PROMPT",
    whatsappLink: "https://chat.whatsapp.com/Ed4DsYtmiKfCbzSVyDKMHd",
    description: "Formulate strategic instructions for structural design AI tools. Prompt AI image generators to create specific building designs.",
    slogan: "Instructing intelligence to construct designs",
    category: Pt.NON_TECHNICAL,
    maxMembers: 2,
    fee: 150,
    prize: "Certificate + Cash Prize",
    timing: "10:30 AM",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    rules: [
      "Prompts must target specific structural criteria.",
      "Evaluated by how close the AI output matches the source requirements.",
      "No external search tools allowed during the contest."
    ],
    coordinators: [
      { name: "Sriram P", phone: "8778743292" }
    ]
  }
];

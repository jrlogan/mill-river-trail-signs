// ---------------------------------------------------------------------------
// Mill River Trail sign system — design tokens.
//
// Every value here was measured off the designer's comp (Mill RIver
// Comp_9-4-22.png, 1685x1122px at 36x24in = 46.81 px/in). Change a number here
// and every sign in the series moves together.
// ---------------------------------------------------------------------------

export const PAGE = {
  width: 36,   // inches
  height: 24,
  bleed: 0.125,
};

// Sampled directly from the comp.
export const COLOR = {
  blue:      '#248CCC',  // header band, Spanish accent type
  blueLight: '#BAE5F5',  // Spanish headline, map panel water
  gold:      '#D3BD5C',  // English column
  orange:    '#CE7F34',  // Spanish column
  cream:     '#FAF7E1',  // credit bar, river-fact box
  green:     '#A2B776',  // rule accents
  black:     '#000000',
  white:     '#FFFFFF',
  ink:       '#111111',
  inkSoft:   '#4A4A4A',
};

// Column grid, in inches from the left edge.
export const GRID = {
  marginLeft:   0.513,
  marginRight:  0.491,
  hairline:     0.021,   // white sliver between colour columns
  panelGutter:  0.257,

  colEnglish:   8.247,
  colCenter:    9.166,
  colSpanish:   8.247,
  panel:        9.016,
};

GRID.xEnglish = GRID.marginLeft;
GRID.xCenter  = GRID.xEnglish + GRID.colEnglish + GRID.hairline;
GRID.xSpanish = GRID.xCenter  + GRID.colCenter  + GRID.hairline;
GRID.xPanel   = GRID.xSpanish + GRID.colSpanish + GRID.panelGutter;

// Vertical bands, in inches from the top edge.
export const BAND = {
  top:        0.535,
  headerH:    4.128,
  ruleH:      0.492,   // black bar under the header
  gapH:       0.343,
  contentTop: 5.519,
  contentH:   18.032,

  creditX:    0.897,
  creditW:    24.933,
  creditTop:  20.620,
  creditH:    2.400,
};

// Type scale, in points. Measured line pitch from the comp is preserved so the
// rebuilt sign sets to the same rhythm as the printed proof.
export const TYPE = {
  headline:     { size: 108, leading: 123, weight: 800, tracking: -1.5 },
  headlineEs:   { size: 108, leading: 123, weight: 800, tracking: -1.5, italic: true },
  sectionHead:  { size: 44,  leading: 50,  weight: 800 },
  body:         { size: 25,  leading: 31.0, weight: 400 },
  // Spanish runs ~15-20% longer than English for the same content. Setting it
  // two points down is what keeps both columns ending at the same place instead
  // of letting the Spanish overrun its box, which is what happened on the comp.
  bodyEs:       { size: 24,  leading: 29.5, weight: 400 },
  bodyLead:     { size: 26,  leading: 32.3, weight: 400 },
  caption:      { size: 17,  leading: 21.5, weight: 600 },
  capBox:       { size: 12,  leading: 15,  weight: 600 },   // small boxes in the photo strip
  panelLabel:   { size: 12,  leading: 14.5, weight: 700 },
  factHead:     { size: 20,  leading: 24,  weight: 800 },
  fact:         { size: 13,  leading: 16,  weight: 400 },
  dedication:   { size: 20,  leading: 25,  weight: 800 },
  credits:      { size: 13,  leading: 16.5, weight: 400 },
  learnMore:    { size: 26,  leading: 31,  weight: 800 },
  url:          { size: 15,  leading: 19,  weight: 500 },
  youAreHere:   { size: 20,  leading: 24,  weight: 800 },
};

// Body face is a Myriad/Frutiger-class humanist sans, matching the comp.
// Display face is a Helvetica-class grotesque.
// NOTE: these are open-source stand-ins. If Design Monsters supplies the
// original font files, drop them into assets/fonts/ and change these two names
// — nothing else in the system needs to change.
export const FONT = {
  display: 'Archivo',
  body:    'Source Sans 3',
};

export const IN = (n) => `${n}in`;
export const PT = (n) => `${n}pt`;

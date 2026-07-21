export function useBestiarium() {
  const taktiken: Array<string> = ['Anspringen', 'Bombardieren', 'Erdrücken', 'Ergreifen', 'Ersticken', 'Erwürgen', 'Fesseln', 'Flügelhieb', 'Flügelwind', 'Genickschlag und -biss', 'Herabstoßen', 'Kehlbiss', 'Klammern', 'Niederreißen', 'Niedeertrampeln', 'Rammen', 'Raserei', 'Stampede', 'Sturzflug']

  const gruppen: Array<string> = ['Affen', 'Bären', 'Dämonen', 'Dickhäuter', 'Drachen', 'Drachenähnliche', 'Elementarwesen', 'Entseelte', 'Fabelkatzen', 'Fabelrösser', 'Fische', 'Fledermäuse', 'Götterboten', 'Halbmenschen', 'Huftiere', 'Hunde', 'Insekten', 'Katzen', 'Kraken', 'Krustentiere', 'Kunstwesen', 'Landrochen', 'Lurche', 'Marderähnliche', 'Menschähnliche', 'Nagetiere', 'Naturgeister', 'Reptilien', 'Robben', 'Schlangen', 'Schleimmonster', 'Spinnentiere', 'Tiermenschen', 'Trolle', 'Vögel', 'Wale', 'Wendehäuter', 'Werwesen', 'Wölfe', 'Würmer']

  const regionen: Array<string> = ['Berg- und Hügelland', 'Eisgebiete, Tundra, verschneite Landschaften', 'Grasland', 'Höhlen', 'Sumpf und Moor', 'Wald und Dschungel', 'Wüste und Trockensteppe', 'Wasser, Strand und kleine Inseln', 'Zivilisation und ihre Ruinen']

  const ruestungen: Array<string> = ['OR', 'TR', 'LR', 'PR', 'VR', 'RR']

  return { taktiken, gruppen, regionen, ruestungen }
}

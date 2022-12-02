export type Question = {
  question: string;
  answers: string[];
  correct: string[] | string;
  type: "multipleChoice" | "img" | "estimate";
  correctEstimate: number;
};

const makeMultipleChoice = (
  question: string,
  answers: string[],
  correct: string[] | string
): Question => {
  return {
    type: "multipleChoice",
    question: question,
    answers: answers,
    correct: correct,
    correctEstimate: -1,
  };
};

const makeImage = (
  question: string,
  answers: string[],
  correct: string[] | string
): Question => {
  return {
    type: "img",
    question: question,
    answers: answers,
    correct: correct,
    correctEstimate: -1,
  };
};

const makeNextStep = (num: string): Question => {
  return {
    type: "multipleChoice",
    question: "NEXT_STEP",
    answers: [],
    correct: num,
    correctEstimate: -1,
  };
};

export const stages6: Question[] = [
  makeMultipleChoice(
    "Zu welchen Zeiten sind Früchte am Zierapfel zu sehen?",
    [
      "Juli bis Oktober",
      "August bis Januar",
      "März bis August",
      "August bis September",
    ],
    "August bis Januar"
  ),
  makeMultipleChoice(
    "Sind Zieräpfel essbar?",
    ["Nicht für Säugetiere", "Nicht für Wiederkäuer", "Nein", "Ja"],
    "Ja"
  ),
  makeMultipleChoice(
    "Welche Farben haben die Blüten des Zierapfels?",
    ["Weiß", "Gelb und orange", "Weiß, rosa und rot", "Grün"],
    "Weiß, rosa und rot"
  ),
  makeMultipleChoice(
    "Warum ist der Spitzahorn besonders beliebt in Parks und Alleen?",
    [
      "Er hat besonders auffällige Früchte.",
      "Er wandelt besonders viel CO2 in Sauerstoff um.",
      "Er duftet sehr gut.",
      "Er grünt relativ früh.",
    ],
    "Er grünt relativ früh."
  ),
  makeMultipleChoice(
    "Welches Geschlecht haben die einzelnen Blüten eines Blütenstands?",
    [
      "entweder alle männlich oder alle weiblich",
      "sowohl männlich als auch weiblich",
      "männlich, weiblich und zwittrig",
      "nur zwittrig",
    ],
    "männlich, weiblich und zwittrig"
  ),
  makeMultipleChoice(
    "Woran erinnert die Frucht des Spitzahorns?",
    ["Flügel", "Raupen", "Dreiecke", "Kämme"],
    "Flügel"
  ),
  makeMultipleChoice(
    "Aus welchem Land kommt der Ginko?",
    ["Kanada", "China", "Indien", "Japan"],
    "China"
  ),
  makeMultipleChoice(
    "Was macht den Ginkgo so besonders?",
    [
      "Er braucht ein sehr spezielles Klima.",
      "Er ist sehr selten (weniger als 10000 Exemplare),.",
      "Er ist ein lebendes Fossil.",
      "Er blüht das ganze Jahr",
    ],
    "Er ist ein lebendes Fossil."
  ),
  makeMultipleChoice(
    "Hat der Ginko eine medizinische Anwendung?",
    ["Demenz", "Schizophrenie", "Herzschwäche", "Übelkeit"],
    "Demenz"
  ),
  makeMultipleChoice(
    "Welchen anderen Nutzen hat der Ginkgo?",
    [
      "gutes Holz für Möbel",
      "verhindert Erdrutsche",
      "Papierherstellung",
      "Samen sind eine Delikatesse",
    ],
    "Samen sind eine Delikatesse"
  ),
  makeMultipleChoice(
    "Wozu wurden Rosskastanienschalen und - blättern im Mittelalter genutzt?",
    [
      "als Heilmittel gegen Husten",
      "zum Färben von Wolle",
      "zum Würzen",
      "Als Talismane",
    ],
    "zum Färben von Wolle"
  ),
  makeMultipleChoice(
    "Welche medizinische Wirkung haben Rosskastanien?",
    [
      "gefäßstärkend und entzündungshemmend",
      "reguliert Blutzucker",
      "hilft bei blauen Flecken",
      "wirkt präventiv gegen Menstruationsbeschwerden",
    ],
    "gefäßstärkend und entzündungshemmend"
  ),
  makeMultipleChoice(
    "Die Schale der Samen ist wie beschaffen?",
    ["samtig", "klebrig", "stachelig", "rau"],
    "stachelig"
  ),
  makeMultipleChoice(
    "Die Zwetschge ist eine Unterart …",
    ["der Rose", "des Pfirsichs", "der Kastanie", "der Pflaume"],
    "der Pflaume"
  ),
  makeMultipleChoice(
    "Die Blüten sind...",
    [
      "rot",
      "zwittrig",
      "männlich und weiblich",
      "abhängig vom Baum entweder alle weiblich oder alle männlich",
    ],
    "zwittrig"
  ),
  makeMultipleChoice("Hat die Zwetschge Dornen?", ["Ja", "Nein"], "Ja"),
  makeMultipleChoice(
    "Kann man die Früchte der Felsenbirne essen?",
    [
      "Nein",
      "Sie sind nur für Vögel genießbar.",
      "Ja",
      "Hat noch keiner ausprobiert.",
    ],
    "Ja"
  ),
  makeMultipleChoice(
    "Für wen sind Felsenbirnen wichtige Speisepflanzen?",
    ["Schmetterlinge", "Rehe", "Würmer", "Mücken"],
    "Schmetterlinge"
  ),
  makeMultipleChoice(
    "Was hat die Felsenbirne mit dem Apfel gemein?",
    [
      "die Blattform",
      "die Blütenform",
      "ein Pflanzengift im Kern",
      "die mückenabweisenden Düfte",
    ],
    "ein Pflanzengift im Kern"
  ),
  makeMultipleChoice(
    "Wie alt kann die Vogelkirsche werden?",
    [
      "50-60 Jahre",
      "130-150 Jahre",
      "oft über 300, Rekord: 563 Jahre",
      "80-90 Jahre",
    ],
    "80-90 Jahre"
  ),
  makeMultipleChoice(
    "Wie lange ist ihre Narbe nach Blütenöffnung empfängnisfähig?",
    ["36 Stunden", "2 Wochen", "48 Stunden", "mehrere Tage, abhängig vom Baum"],
    "36 Stunden"
  ),
  makeMultipleChoice(
    "Wie viele Süßkirschen werden jedes Jahr geerntet?",
    ["1.500.534 t", "5.234.648 t", "2.609.550 t", "903.451 t"],
    "2.609.550 t"
  ),
  makeMultipleChoice(
    "Vogelkirschen absondern in den ersten Wochen nach dem Blühen besonders viel Nektar, um Ameisen anzulocken, die Schädlinge fressen.?",
    ["Wahr", "Falsch"],
    "Wahr"
  ),
];

export const stages8: Question[] = [
  makeMultipleChoice(
    "In was lässt sich ein Ahornblatt unterteilen?",
    ["Lappen", "Finger", "Spitzen", "Wischer"],
    "Lappen"
  ),

  makeMultipleChoice(
    "Ist der Ahorn giftig?",
    ["Ja", "Nur für Nagetiere", "Nur für Pferde & Esel", "Nein"],
    "Nur für Pferde & Esel"
  ),

  makeMultipleChoice(
    "Wo ist der Ginkgo beheimatet? Dort ist er sogar Nationalbaum!",
    ["China", "Thailand", "Dänemark", "Madagaskar"],
    "China"
  ),

  makeMultipleChoice(
    "Bei was soll der Ginkgo laut traditioneller chinesischer Medizin helfen?",
    ["Rückenschmerzen", "Gedächtnisprobleme", "Haarausfall", "Karies"],
    "Gedächtnisprobleme"
  ),

  makeMultipleChoice(
    "Wieso werden in Parks fast nur männliche Ginkgos angebaut?",
    [
      "die Weibchen werden nur maximal 1m hoch",
      "die Weibchen sind nicht frosthart",
      "die Früchte der Weibchen stinken",
      "die Früchte der Weibchen sind giftig",
    ],
    "die Früchte der Weibchen stinken"
  ),

  makeMultipleChoice(
    "Ist die Rosskastanie essbar?",
    [
      "Ja",
      "Ja, jedoch ist sie ungenießbar",
      "Nur im gekochten Zustand",
      "Nein, sie ist giftig",
    ],
    "Nein, sie ist giftig"
  ),

  makeMultipleChoice(
    "Was kann man aus Kastanien herstellen?",
    ["Waschmittel", "Hautcreme", "Zahnpasta", "Deodorant"],
    "Waschmittel"
  ),

  makeMultipleChoice(
    "Sind Zieräpfel giftig?",
    ["Ja", "Nein, jedoch ja für Haustiere", "Nein"],
    "Nein"
  ),

  makeMultipleChoice(
    "In welchem Jahrhundert wurde die älteste Apfelsorte, der Edelborsdorfer dokumentiert?",
    ["1. Jahrhundert", "6. Jahrhundert", "12. Jahrhundert", "18. Jahrhundert"],
    "12. Jahrhundert"
  ),

  makeMultipleChoice(
    "Welchen Nahrungsmitteln schauen die Samen/Früchte der Robinie ähnlich?",
    ["Walnüsse", "Bohnenhülsen", "Kirschen", "Äpfeln"],
    "Bohnenhülsen"
  ),

  makeMultipleChoice(
    "Die Pflanzung der Robinie ist umstritten. Wieso?",
    [
      "Sie ist sehr schädlingsanfällig",
      "Sie bietet kaum Nahrung für Insekten",
      "Sie braucht extremst viel Dünger, um überhaupt zu wachsen",
      "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
    ],
    "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)"
  ),

  makeMultipleChoice(
    "Wie andere Hülsenfrüchtler lebt die Robinie in Symbiose mit Knöllchenbakterien. Wieso?",
    [
      "um Feinde abzuwehren",
      "um witterungsbeständiger zu sein",
      "um sich selbst zu Düngen",
      "um Insekten anzulocken",
    ],
    "um sich selbst zu Düngen"
  ),

  makeMultipleChoice(
    "Was wurde aus den Früchten der Eberesche hergestellt?",
    ["Süßstoff", "Gift gegen Schädlinge", "Farbe", "Duftstoffe"],
    "Süßstoff"
  ),

  makeMultipleChoice(
    "Woher kommen die Namen Vogelbeere bzw. Eberesche? (2 Anworten)",
    [
      "Sie ist verwandt mit der Esche",
      "Die Blätter ähneln denen der Esche",
      "Vögel lieben die Früchte",
      "Die Beeren sind höchst giftig für Vögel",
    ],
    ["Die Blätter ähneln denen der Esche", "Vögel lieben die Früchte"]
  ),

  makeMultipleChoice(
    "Sind Vogelbeeren giftig?",
    [
      "Ja, jedoch sind sie sicher für Haustiere",
      "Nein, jedoch ja für Haustiere",
    ],
    "Nein, jedoch ja für Haustiere"
  ),

  makeMultipleChoice(
    "Die Linde ist für Insekten sehr wichtig. Wieso?",
    [
      "sie ist ein Sommerblüher, was sehr selten ist",
      "sie hat 10-mal so viele Blüten wie die meisten anderen Laubbäume",
      "sie zieht viele seltene Arten an",
    ],
    "sie ist ein Sommerblüher, was sehr selten ist"
  ),

  makeMultipleChoice(
    "Wobei hilft Lindenblütentee?",
    ["Bauchschmerzen", "Erkältung", "Hustenreiz", "Konzentrationsschwächen"],
    "Erkältung"
  ),

  makeMultipleChoice(
    "Die Dorflinde, welche früher das Zentrum eines Dorfs darstellte, hatte auch folgende Namen:",
    ["Festbaum", "Gerichtslinde", "Hochzeitslinde", "Tanzlinde"],
    ["Gerichtslinde", "Tanzlinde"]
  ),

  makeMultipleChoice(
    "Was wurde früher in Notzeiten aus Eicheln hergestellt?",
    ["Seife", "Öl", "Kaffee", "Mehl"],
    ["Kaffee", "Mehl"]
  ),
];

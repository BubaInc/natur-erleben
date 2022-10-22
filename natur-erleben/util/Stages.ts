export type Question = {
  question: string
  answers: string[]
  correct: string[] | string
}

export const stages: Question[] = [
  {
    question: "In was lässt sich ein Ahornblatt unterteilen?",
    answers: ["Lappen", "Finger", "Spitzen", "Wischer"],
    correct: "Lappen",
  },
  {
    question: "Ist der Ahorn giftig?",
    answers: ["Ja", "Nur für Nagetiere", "Nur für Pferde & Esel", "Nein"],
    correct: "Nur für Pferde & Esel",
  },
  {
    question: "Wo ist der Ginkgo beheimatet? Dort ist er sogar Nationalbaum!",
    answers: ["China", "Thailand", "Dänemark", "Madagaskar"],
    correct: "China",
  },
  {
    question:
      "Bei was soll der Ginkgo laut traditioneller chinesischer Medizin helfen?",
    answers: ["Rückenschmerzen", "Gedächtnisprobleme", "Haarausfall", "Karies"],
    correct: "Gedächtnisprobleme",
  },
  {
    question: "Wieso werden in Parks fast nur männliche Ginkgos angebaut?",
    answers: [
      "die Weibchen werden nur maximal 1m hoch",
      "die Weibchen sind nicht frosthart",
      "die Früchte der Weibchen stinken",
      "die Früchte der Weibchen sind giftig",
    ],
    correct: "die Früchte der Weibchen stinken",
  },
  {
    question: "Ist die Rosskastanie essbar?",
    answers: [
      "Ja",
      "Ja, jedoch ist sie ungenießbar",
      "Nur im gekochten Zustand",
      "Nein, sie ist giftig",
    ],
    correct: "Nein, sie ist giftig",
  },
  {
    question: "Was kann man aus Kastanien herstellen?",
    answers: ["Waschmittel", "Hautcreme", "Zahnpasta", "Deodorant"],
    correct: "Waschmittel",
  },
  {
    question: "Sind Zieräpfel giftig?",
    answers: ["Ja", "Nein, jedoch ja für Haustiere", "Nein"],
    correct: "Nein",
  },
  {
    question:
      "In welchem Jahrhundert wurde die älteste Apfelsorte, der Edelborsdorfer dokumentiert?",
    answers: [
      "1. Jahrhundert",
      "6. Jahrhundert",
      "12. Jahrhundert",
      "18. Jahrhundert",
    ],
    correct: "12. Jahrhundert",
  },
  {
    question:
      "Welchen Nahrungsmitteln schauen die Samen/Früchte der Robinie ähnlich?",
    answers: ["Walnüsse", "Bohnenhülsen", "Kirschen", "Äpfeln"],
    correct: "Bohnenhülsen",
  },
  {
    question: "Die Pflanzung der Robinie ist umstritten. Wieso?",
    answers: [
      "Sie ist sehr schädlingsanfällig",
      "Sie bietet kaum Nahrung für Insekten",
      "Sie braucht extremst viel Dünger, um überhaupt zu wachsen",
      "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
    ],
    correct: "Sie breitet sich aus & senkt die Artenvielfalt (=>invasiv)",
  },
  {
    question:
      "Wie andere Hülsenfrüchtler lebt die Robinie in Symbiose mit Knöllchenbakterien. Wieso?",
    answers: [
      "um Feinde abzuwehren",
      "um witterungsbeständiger zu sein",
      "um sich selbst zu Düngen",
      "um Insekten anzulocken",
    ],
    correct: "um sich selbst zu Düngen",
  },
  {
    question: "Was wurde aus den Früchten der Eberesche hergestellt?",
    answers: ["Süßstoff", "Gift gegen Schädlinge", "Farbe", "Duftstoffe"],
    correct: "Süßstoff",
  },
  {
    question: "Woher kommen die Namen Vogelbeere bzw. Eberesche? (2 Anworten)",
    answers: [
      "Sie ist verwandt mit der Esche",
      "Die Blätter ähneln denen der Esche",
      "Vögel lieben die Früchte",
      "Die Beeren sind höchst giftig für Vögel",
    ],
    correct: ["Die Blätter ähneln denen der Esche", "Vögel lieben die Früchte"],
  },
  {
    question: "Sind Vogelbeeren giftig?",
    answers: [
      "Ja, jedoch sind sie sicher für Haustiere",
      "Nein, jedoch ja für Haustiere",
    ],
    correct: "Nein, jedoch ja für Haustiere",
  },
  {
    question: "Die Linde ist für Insekten sehr wichtig. Wieso?",
    answers: [
      "sie ist ein Sommerblüher, was sehr selten ist",
      "sie hat 10-mal so viele Blüten wie die meisten anderen Laubbäume",
      "sie zieht viele seltene Arten an",
    ],
    correct: "sie ist ein Sommerblüher, was sehr selten ist",
  },
  {
    question: "Wobei hilft Lindenblütentee?",
    answers: [
      "Bauchschmerzen",
      "Erkältung",
      "Hustenreiz",
      "Konzentrationsschwächen",
    ],
    correct: "Erkältung",
  },
  {
    question:
      "Die Dorflinde, welche früher das Zentrum eines Dorfs darstellte, hatte auch folgende Namen:",
    answers: ["Festbaum", "Gerichtslinde", "Hochzeitslinde", "Tanzlinde"],
    correct: ["Gerichtslinde", "Tanzlinde"],
  },
  {
    question: "Was wurde früher in Notzeiten aus Eicheln hergestellt?",
    answers: ["Seife", "Öl", "Kaffee", "Mehl"],
    correct: ["Kaffee", "Mehl"],
  },
]

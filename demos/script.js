import notes from "../dist/main.js";

/* Example data from notes API */
const notesData = [
  {
    id: "0",
    authorName: "Jan Banan",
    title: "Bug report",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet. So this bug was originally caught in early May but reports have come in that it isn't solved yet. So this bug was originally caught in early May but reports have come in that it isn't solved yet. So this bug was originally caught in early May but reports have come in that it isn't solved yet. So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: "1",
    authorName: "Jan Banan",
    title: "Client request",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now() - 50000,
    updatedAt: Date.now() - 50000,
  },
  {
    id: "2",
    authorName: "Jan Banan",
    title: "Client request",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 80000,
  },
  {
    id: "3",
    authorName: "Jan Banan",
    title: "Client request",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 180000,
  },
  {
    id: "4",
    authorName: "Jan Banan",
    title: "Client request",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 120000,
  },
];

/* Example notes API */
const getNotes = async () => {
  return notesData.sort((a, b) => b.createdAt - a.createdAt);
};

const updateNote = async (id, title, body) => {
  const noteIndex = notesData.findIndex((note) => note.id === id);
  if (noteIndex !== -1) {
    notesData[noteIndex] = {
      ...notesData[noteIndex],
      ...(title && { title }),
      ...(body && { body }),
      authorName: "Mr.Pantalones",
      updatedAt: Date.now(),
    };
  }
};

const createNote = async (title, body) => {
  notesData.push({
    title,
    body,
    authorName: "Mr.Pantalones",
    id: `${notesData.length}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
};

const deleteNote = async (id) => {
  const noteIndex = notesData.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notesData = [
      ...notesData.slice(0, noteIndex),
      ...notesData.slice(noteIndex + 1, notesData.length),
    ];
  }
};

notes.configure({
  attachOnQuerySelector: "#notes-entry",
  toggleOnQuerySelector: "#notes-toggle",
  getNotes,
  updateNote,
  createNote,
  deleteNote,
});

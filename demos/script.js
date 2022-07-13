import notes from "../dist/main.js";

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
    updatedAt: Date.now() - 80000,
  },
  {
    id: "4",
    authorName: "Jan Banan",
    title: "Client request",
    body: "So this bug was originally caught in early May but reports have come in that it isn't solved yet.",
    createdAt: Date.now() - 80000,
    updatedAt: Date.now() - 80000,
  },
];

/* Configuration for notes */
const getNotes = async () => {
  return notesData;
};
const updateNote = async () => console.log("getNotes");
const createNote = async () => console.log("getNotes");
const deleteNote = async () => console.log("getNotes");

notes.configure({
  attachOnQuerySelector: "#notes-entry",
  toggleOnQuerySelector: "#notes-toggle",
  getNotes,
  updateNote,
  createNote,
  deleteNote,
});

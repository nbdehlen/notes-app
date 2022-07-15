export type Listener = {
  element: HTMLElement | Element | HTMLButtonElement | HTMLDivElement;
  type: string;
  fn: EventListenerOrEventListenerObject;
};

export type Note = {
  id: string;
  authorName: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type NotesConfiguration = {
  attachOnQuerySelector: string;
  toggleOnQuerySelector?: string;
  getNotes: () => Promise<Note[]>;
  createNote: (title: string, body: string) => Promise<void>; // What to put here instead of void?
  updateNote: (id: string, title?: string, body?: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
};

export type NotesState = {
  notes: Note[];
} & Partial<NotesConfiguration>;

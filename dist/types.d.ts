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

export type ICreateNote = {
  title: string;
  body: string;
};

export type IUpdateNote = {
  id: string;
  title?: string;
  body?: string;
};

export type NotesConfiguration = {
  attachOnQuerySelector: string;
  toggleOnQuerySelector?: string;
  getNotes: () => Promise<Note[]>;
  createNote: (note: ICreateNote) => Promise<void>; // What to put here instead of void?
  updateNote: (note: IUpdateNote) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
};

export type NotesState = {
  view: "LOADING" | "READY";
  notes: Note[];
} & Partial<NotesConfiguration>;

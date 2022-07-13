import { draggable } from "./draggable";
import { addListener, css } from "./helpers";
import styles from "./style.css";
import { NotesConfiguration, NotesState, Listener, Note } from "./types";

let state: NotesState = {
  view: "LOADING",
  attachOnQuerySelector: "",
  toggleOnQuerySelector: "",
  notes: [],
};
const listenerStore: Listener[] = [];
const D = document;

const configure = (config: NotesConfiguration) => {
  state = { ...state, ...config };
  // Add styles to outer container
  const $notes = D.querySelector(config.attachOnQuerySelector) as HTMLElement;
  $notes.classList.add(styles.hidden, styles["notes-main"], styles.draggable);

  // Creating inner container
  const $innerContainer = D.createElement("div");
  $innerContainer.classList.add(styles["inner-container"]);
  $notes.appendChild($innerContainer);

  // Top row above list items
  const $topMenu = D.createElement("span");
  $topMenu.classList.add(styles["top-menu"]);
  $innerContainer.appendChild($topMenu);

  // Make draggable
  draggable(styles.draggable, styles["top-menu"]);

  // Add create new note button
  const $createButton = D.createElement("button");
  $createButton.classList.add(styles["create-button"], styles["button-basics"]);
  $topMenu.appendChild($createButton);
  $createButton.innerText = "New note...";
  addListener(listenerStore, $createButton, () => {});

  // Add close icon
  const $closeButton = D.createElement("div");
  $closeButton.ariaLabel = "button";
  $closeButton.classList.add(styles["close-button"]);
  $topMenu.appendChild($closeButton);
  $closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
    <!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
      <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/>
    </svg>
    `;

  const closeButtonListener = () => {
    // close animation
    css($notes, {
      "animation-name": styles["slide-dn"],
      "animation-duration": "0.25s",
    });
  };
  addListener(listenerStore, $closeButton, closeButtonListener);

  const addHideListener = (e: AnimationEvent) => {
    if (e.animationName === styles["slide-dn"]) {
      console.log("addHide");
      $notes.classList.add(styles.hidden);
    }
  };
  // webkitAnimationEnd for Chrome, Safari and Opera
  addListener(listenerStore, $notes, addHideListener, "webkitAnimationEnd");
  // animationend for Firefox
  addListener(listenerStore, $notes, addHideListener, "animationend");

  // Show/hide the notes component on toggle
  if (config.toggleOnQuerySelector?.length > 0) {
    const $notesToggle = D.querySelector(config.toggleOnQuerySelector);

    const notesToggleListener = () => toggleNotes($notes);
    addListener(listenerStore, $notesToggle, notesToggleListener);
  }

  // Fetch initial notes and display them
  getNotes().then((notes) => {
    if (notes?.length > 0) {
      renderNotesList(notes, `.${styles["inner-container"]}`);
      state.notes = notes;
    }
    state.view = "READY";
  });
};

const toggleNotes = (notes: HTMLElement) => {
  if (notes.classList.contains(styles.hidden)) {
    notes.classList.remove(styles.hidden);
    css(notes, {
      "animation-name": styles["slide-up"],
      "animation-duration": "0.25s",
    });
  } else {
    // Css class 'hidden' is added by animation end listeners
    css(notes, {
      "animation-name": styles["slide-dn"],
      "animation-duration": "0.25s",
    });
  }
};

const getNotes = async (): Promise<Note[] | undefined> => {
  const notes = await state.getNotes();
  return notes;
};

const noteInputItem = (
  replaceNode: Node,
  parentSelector: string,
  i: number
) => {
  const $container = D.createElement("div");
  $container.classList.add(styles.col, styles["list-item-container"]);

  const $textTitle = D.createElement("input");
  $textTitle.value = state.notes[i].title;
  $textTitle.classList.add(styles["input-title"]);
  $textTitle.placeholder = "Add a title";

  const $textBody = D.createElement("div");
  $textBody.innerText = state.notes[i].body;
  $textBody.classList.add(
    styles["list-item-body"],
    styles["input-body"],
    styles["div-as-textarea"]
  );
  $textBody.spellcheck = true;
  $textBody.contentEditable = "true";

  $container.appendChild($textTitle);
  $container.appendChild($textBody);

  // Replace list item with input field
  const $parent = D.querySelector(parentSelector);
  $parent.replaceChild($container, replaceNode);
};

const noteListItem = (note: Note, parentSelector: string, i: number) => {
  const $container = D.createElement("div");
  $container.classList.add(styles.col, styles["list-item-container"]);

  const $parent = D.querySelector(parentSelector);
  $parent.appendChild($container);

  // Add title
  const $textTitle = D.createElement("h2");
  $textTitle.innerText = note.title;
  $textTitle.classList.add(styles["list-item-title"]);

  // Add body
  const $textBody = D.createElement("div");
  $textBody.innerText = note.body;
  $textBody.classList.add(styles["list-item-body"]);

  // Add edit button
  const $editButton = D.createElement("button");
  $editButton.classList.add(styles["button-basics"], styles["edit-button"]);
  $editButton.innerText = "Edit";
  const $buttonContainer = D.createElement("div");

  const $itemContainer = $parent.querySelector(
    `.${styles["list-item-container"]}:nth-of-type(${i + 1})`
  );

  $itemContainer.append($textTitle, $textBody, $buttonContainer);
  $buttonContainer.appendChild($editButton);

  // Replaces list item with input field on 'click'
  const editButtonListener = () => {
    noteInputItem($itemContainer, parentSelector, i);
  };
  addListener(listenerStore, $editButton, editButtonListener);
};

const renderNotesList = (notes: Note[], parentSelector: string) => {
  notes.forEach((note: Note, i: number) =>
    noteListItem(note, parentSelector, i)
  );
};

const destroy = () => {
  listenerStore.forEach(({ element, type, fn }) =>
    element.removeEventListener(type, fn)
  );

  const notes = D.querySelector(state.attachOnQuerySelector);
  if (notes) {
    notes.remove();
  }
};

export default { configure, destroy };

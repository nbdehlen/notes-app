import draggable from "./draggable";
import { addListener, removeAllListeners, removeListener } from "./listeners";
import { css } from "./helpers";
import styles from "./style.css";
import { NotesConfiguration, NotesState, Listener, Note } from "./types";
import ellipsisSvg from "./assets/ellipsisVertical.svg";
import closeSvg from "./assets/close.svg";
import dropdown from "./dropdown";

let state: NotesState = {
  attachOnQuerySelector: "",
  toggleOnQuerySelector: "",
  notes: [],
};

const D = document;

const configure = (config: NotesConfiguration) => {
  state = { ...state, ...config };
  // Add styles to outer container
  const $notes = D.querySelector(config.attachOnQuerySelector) as HTMLElement;
  $notes.classList.add(styles.hidden, styles["notes-main"], styles.draggable);

  // Top row above list items
  const $topMenu = D.createElement("span");
  $topMenu.classList.add(styles["top-menu"]);
  $notes.appendChild($topMenu);

  // Creating inner container
  const $innerContainer = D.createElement("div");
  $innerContainer.classList.add(styles["inner-container"]);
  $notes.appendChild($innerContainer);

  // Make draggable
  draggable(styles.draggable, styles["top-menu"]);

  // Add create new note button
  const $createButton = D.createElement("button");
  $createButton.classList.add(styles["create-button"], styles["button-basics"]);
  $topMenu.appendChild($createButton);
  $createButton.innerText = "New note...";
  const createButtonListener = () => {
    createNoteInputItem();
  };
  addListener($createButton, createButtonListener);

  // Add close icon
  const $closeButton = D.createElement("div");
  $closeButton.ariaLabel = "button";
  $closeButton.classList.add(styles["close-button"]);
  $topMenu.appendChild($closeButton);

  const $imgContainer = D.createElement("img");
  $imgContainer.src = closeSvg;
  css($imgContainer, {
    height: "1.6rem",
  });
  $closeButton.appendChild($imgContainer);

  const closeButtonListener = () => {
    // close animation
    css($notes, {
      "animation-name": styles["slide-dn"],
      "animation-duration": "0.25s",
    });
  };
  addListener($closeButton, closeButtonListener);

  const addHideListener = (e: AnimationEvent) => {
    if (e.animationName === styles["slide-dn"]) {
      $notes.classList.add(styles.hidden);
    }
  };
  // webkitAnimationEnd for Chrome, Safari and Opera
  addListener($notes, addHideListener, "webkitAnimationEnd");
  // animationend for Firefox
  addListener($notes, addHideListener, "animationend");

  // Show/hide the notes component on toggle
  if (config.toggleOnQuerySelector?.length > 0) {
    const $notesToggle = D.querySelector(config.toggleOnQuerySelector);

    const notesToggleListener = () => toggleNotes($notes);
    addListener($notesToggle, notesToggleListener);
  }

  // Fetch initial notes and display them
  getNotes().then((notes) => {
    if (notes?.length > 0) {
      renderNotesList(notes, `.${styles["inner-container"]}`);
      state.notes = notes;
    }
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

const createNote = async (
  title: string,
  body: string
): Promise<boolean | undefined> => {
  await state.createNote(title, body);
  return true;
};

const deleteNote = async (id: string): Promise<boolean | undefined> => {
  await state.deleteNote(id);
  return true;
};

const updateNote = async (
  id: string,
  title?: string,
  body?: string
): Promise<boolean | undefined> => {
  await state.updateNote(id, title, body);

  return true;
};

const createNoteInputItem = () => {
  const $inputContainer = D.createElement("div");
  $inputContainer.classList.add(styles.col, styles["list-item-container"]);
  const $textTitle = D.createElement("input");
  $textTitle.classList.add(styles["input-title"]);
  $textTitle.placeholder = "Add a title";

  const $textBody = D.createElement("div");
  $textBody.classList.add(
    styles["list-item-body"],
    styles["input-body"],
    styles["div-as-textarea"]
  );
  $textBody.spellcheck = true;
  $textBody.contentEditable = "true";
  $textBody.ariaLabel = "textarea";

  $inputContainer.appendChild($textTitle);
  $inputContainer.appendChild($textBody);

  const $firstListItem = D.querySelector(
    `.${styles["list-item-container"]}:nth-of-type(1)`
  );

  if ($firstListItem) {
    $firstListItem.insertAdjacentElement("beforebegin", $inputContainer);
  } else {
    // If there are no notes, use parent as selector
    const $parentContainer = D.querySelector(`.${styles["inner-container"]}`);
    $parentContainer.appendChild($inputContainer);
  }
  // Add input buttons
  addInputButtons($inputContainer);
};

const replaceNoteItemWithInputs = (
  replaceElement: HTMLElement,
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
  $parent.replaceChild($container, replaceElement);

  // Add input buttons
  addInputButtons($container, replaceElement);
};

const noteListItem = (note: Note, parentSelector: string, i: number) => {
  const $container = D.createElement("div");
  $container.classList.add(styles.col, styles["list-item-container"]);

  const $parent = D.querySelector(parentSelector);
  $parent.appendChild($container);

  // Add title and menu container
  const $topRowContainer = D.createElement("div");
  css($topRowContainer, {
    display: "flex",
    "justify-content": "space-between",
  });

  // Add title
  const $textTitle = D.createElement("h2");
  $textTitle.innerText = note.title;
  $textTitle.classList.add(styles["list-item-title"]);
  $topRowContainer.appendChild($textTitle);

  // Add three-dotted menu
  const $menuContainer = D.createElement("div");
  css($menuContainer, {
    display: "flex",
    "justify-content": "flex-end",
    cursor: "pointer",
  });

  const $imgContainer = D.createElement("img");
  $imgContainer.src = ellipsisSvg;
  css($imgContainer, {
    height: "1.6rem",
  });
  $menuContainer.appendChild($imgContainer);

  // Create 'delete list item' for dropdown
  const $deleteListItem = D.createElement("div");
  $deleteListItem.innerText = "Delete";
  $deleteListItem.classList.add(styles["dd-item"], styles["dd-delete-item"]);

  const $placeholder = D.createElement("div");
  $placeholder.innerText = "Placeholder item";
  $placeholder.classList.add(styles["dd-item"]);

  // Add listener to dropdown item 'delete'
  const deleteListItemListener = () => {
    // TODO: Do something more with this or change icon and naming to "red minus icon for deleting"
    const id = $itemContainer.getAttribute("data-id");
    deleteNote(id).then((noteDeleted) => {
      if (noteDeleted) {
        getNotes().then((notes) => {
          if (notes) {
            // Remove all previous notes
            const notesContainerClassName = `.${styles["inner-container"]}`;
            const $notesContainer = D.querySelector(notesContainerClassName);
            const $listItems = $notesContainer.querySelectorAll(
              `.${styles["list-item-container"]}`
            );
            $listItems.forEach((item) => item.remove());
            // TODO: Compare notes id before deciding on re-creating?

            // Render the new list of notes
            renderNotesList(notes, notesContainerClassName);
            state.notes = notes;
          }
        });
      }
    });
  };
  addListener($deleteListItem, deleteListItemListener);

  // Create dropdown
  const $dropdown = dropdown($menuContainer, [$deleteListItem, $placeholder], {
    itemsContainerClasses: [styles["dd-items-container"]],
  });
  $topRowContainer.appendChild($dropdown);

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

  $itemContainer.append($topRowContainer, $textBody, $buttonContainer);
  $buttonContainer.appendChild($editButton);

  // Replaces list item with input field on 'click'
  const editButtonListener = () => {
    replaceNoteItemWithInputs($itemContainer as HTMLElement, parentSelector, i);
  };
  addListener($editButton, editButtonListener);

  // Used for updating and deleting notes
  $itemContainer.setAttribute("data-id", note.id);
};

const renderNotesList = (notes: Note[], parentSelector: string) => {
  notes.forEach((note: Note, i: number) =>
    noteListItem(note, parentSelector, i)
  );
};

const addInputButtons = (
  parent: HTMLElement,
  replacedElement?: HTMLElement
) => {
  const $inputButtonContainer = D.createElement("div");

  const $cancelButton = D.createElement("button");
  $cancelButton.classList.add(styles["button-basics"]);
  $cancelButton.innerText = "Cancel";

  const $saveButton = D.createElement("button");
  $saveButton.classList.add(styles["button-basics"]);
  $saveButton.innerText = replacedElement ? "Update" : "Save";

  parent.appendChild($inputButtonContainer);
  $inputButtonContainer.appendChild($saveButton);
  $inputButtonContainer.appendChild($cancelButton);

  const title = parent.querySelector("input") as HTMLInputElement;
  const body = parent.querySelector(
    `.${styles["div-as-textarea"]}`
  ) as HTMLDivElement;

  const cancelListener = () => {
    if (replacedElement) {
      // Convert inputs back to list item if Note existed before
      parent.replaceWith(replacedElement);
    } else {
      removeInputMode();
    }
  };

  const saveOrUpdateListener = () => {
    const handleNote = (noteCreated: boolean | undefined) => {
      if (noteCreated) {
        getNotes().then((notes) => {
          if (notes?.length > 0) {
            removeInputMode();

            // Remove all previous notes
            const notesContainerClassName = `.${styles["inner-container"]}`;
            const $notesContainer = D.querySelector(notesContainerClassName);
            const $listItems = $notesContainer.querySelectorAll(
              `.${styles["list-item-container"]}`
            );
            $listItems.forEach((item) => item.remove());

            // Render the new list of notes
            renderNotesList(notes, notesContainerClassName);
            state.notes = notes;
          }
        });
      }
    };

    // If it's an existing note
    if (replacedElement) {
      const id = replacedElement.getAttribute("data-id");
      updateNote(id, title.value, body.innerText).then(handleNote);
    } else {
      createNote(title.value, body.innerText).then(handleNote);
    }
  };

  const removeInputMode = () => {
    // Remove input elements and their event listeners when the note is being rendered as a List item
    removeListener({
      element: $saveButton,
      type: "click",
      fn: saveOrUpdateListener,
    });
    removeListener({
      element: $cancelButton,
      type: "click",
      fn: cancelListener,
    });
    $inputButtonContainer.remove();
    title.remove();
    body.remove();
  };
  addListener($saveButton, saveOrUpdateListener);
  addListener($cancelButton, cancelListener);
};

const destroy = () => {
  removeAllListeners();

  const notes = D.querySelector(state.attachOnQuerySelector);
  if (notes) {
    notes.remove();
  }
};

export default { configure, destroy };

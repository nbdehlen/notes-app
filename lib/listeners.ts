// TODO: Better typing
export type ListenerTag =
  | HTMLElement
  | Element
  | HTMLButtonElement
  | HTMLDivElement;

export type Listener = {
  element: ListenerTag;
  type: string;
  fn: EventListenerOrEventListenerObject;
};

let listenerStore: Listener[] = [];

// Register listener and save the reference for future removal
export function addListener(
  element: ListenerTag,
  fn: EventListenerOrEventListenerObject,
  type = "click"
) {
  element.addEventListener(type, fn);
  listenerStore.push({ element, type, fn });
}

export function removeListener(listenerToRemove: Listener) {
  const listenerIndex = listenerStore.findIndex(
    (listener) => listener === listenerToRemove
  );
  if (listenerIndex !== -1) {
    const selected = listenerStore[listenerIndex];
    selected.element.removeEventListener(selected.type, selected.fn);
    listenerStore.splice(listenerIndex, 1);
  }
}

export function removeAllListeners() {
  listenerStore.forEach(({ element, type, fn }) =>
    element.removeEventListener(type, fn)
  );
}

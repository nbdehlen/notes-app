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

// Register listener and save the reference for future removal
export function addListener(
  store: Listener[],
  element: ListenerTag,
  fn: EventListenerOrEventListenerObject,
  type = "click"
) {
  element.addEventListener(type, fn);
  store.push({ element, type, fn });
}

export function removeListener(store: Listener[], listenerToRemove: Listener) {
  const listenerIndex = store.findIndex(
    (listener) => listener === listenerToRemove
  );
  if (listenerIndex !== -1) {
    const selected = store[listenerIndex];
    selected.element.removeEventListener(selected.type, selected.fn);
    store.splice(listenerIndex, 1);
  }
}

// Add style to element
export function css(element: HTMLElement, style: Object) {
  for (const property in style) element.style[property] = style[property];
}

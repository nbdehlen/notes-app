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

// Add style to element
export function css(element: HTMLElement, style: Object) {
  for (const property in style) element.style[property] = style[property];
}

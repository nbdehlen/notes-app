// Add style to element
export function css(element: HTMLElement, style: Object) {
  for (const property in style) element.style[property] = style[property];
}

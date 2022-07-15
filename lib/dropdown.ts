import { addListener } from "./listeners";
import { css } from "./helpers";

export default function dropdown(
  toggleElement: HTMLElement,
  dropdownItems: HTMLElement[],
  style?: {
    containerClasses?: string[];
    itemsContainerClasses?: string[];
  }
): HTMLElement {
  const D = document;

  const $dropdownContainer = D.createElement("div");
  css($dropdownContainer, {
    position: "relative",
    display: "inline-block",
  });
  style?.containerClasses &&
    $dropdownContainer.classList.add(...style.containerClasses);

  $dropdownContainer.appendChild(toggleElement);

  const toggleDropdown = () => {
    const isHidden = $dropdownItemsContainer.style.display === "none";
    css($dropdownItemsContainer, {
      display: isHidden ? "block" : "none",
    });
  };
  addListener(toggleElement, toggleDropdown);

  const $dropdownItemsContainer = D.createElement("div");
  css($dropdownItemsContainer, {
    position: "absolute",
    display: "none",
  });

  style?.itemsContainerClasses &&
    $dropdownItemsContainer.classList.add(...style.itemsContainerClasses);
  $dropdownItemsContainer.append(...dropdownItems);

  $dropdownContainer.appendChild($dropdownItemsContainer);

  return $dropdownContainer;
}

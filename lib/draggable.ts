export function draggable(dragClassName: string, dragOnClassName: string) {
  // TODO: Typing
  function filter(e: any) {
    const { target: dragByElement } = e;

    if (!dragByElement.classList.contains(dragOnClassName)) {
      return;
    }

    const dragElement = document.querySelector(`.${dragClassName}`) as any;
    dragElement.moving = true;

    // Check if Mouse events exist on users' device
    if (e.clientX) {
      dragElement.oldX = e.clientX; // If they exist then use Mouse input
      dragElement.oldY = e.clientY;
    } else {
      dragElement.oldX = e.touches[0].clientX; // Otherwise use touch input
      dragElement.oldY = e.touches[0].clientY;
    }

    dragElement.oldLeft =
      Number(
        window
          .getComputedStyle(dragElement)
          .getPropertyValue("left")
          .split("px")[0]
      ) * 1;
    dragElement.oldTop =
      Number(
        window
          .getComputedStyle(dragElement)
          .getPropertyValue("top")
          .split("px")[0]
      ) * 1;

    document.onmousemove = dr;
    document.ontouchmove = dr;

    function dr(event: any) {
      // event.preventDefault();

      if (!dragElement.moving) {
        return;
      }

      if (event.clientX) {
        dragElement.distX = event.clientX - dragElement.oldX;
        dragElement.distY = event.clientY - dragElement.oldY;
      } else {
        dragElement.distX = event.touches[0].clientX - dragElement.oldX;
        dragElement.distY = event.touches[0].clientY - dragElement.oldY;
      }

      dragElement.style.left = dragElement.oldLeft + dragElement.distX + "px";
      dragElement.style.top = dragElement.oldTop + dragElement.distY + "px";
    }

    function endDrag() {
      dragElement.moving = false;
    }
    dragElement.onmouseup = endDrag;
    dragElement.ontouchend = endDrag;
  }
  document.onmousedown = filter;
  document.ontouchstart = filter;
}

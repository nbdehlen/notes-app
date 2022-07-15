export default function draggable(
  dragClassName: string,
  dragOnClassName: string
) {
  function filter(e: MouseEvent | TouchEvent) {
    const dragByElement = e.target as HTMLElement;

    if (!dragByElement.classList.contains(dragOnClassName)) {
      return;
    }

    const dragElement = document.querySelector(`.${dragClassName}`) as any;
    dragElement.moving = true;

    // Check if mouse event or touch event
    if (e instanceof MouseEvent) {
      dragElement.oldX = e.clientX;
      dragElement.oldY = e.clientY;
    } else if (e instanceof TouchEvent) {
      dragElement.oldX = e.touches[0].clientX;
      dragElement.oldY = e.touches[0].clientY;
    } else {
      console.warn("event is neither MouseEvent nor TouchEvent");
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

    function dr(event: MouseEvent | TouchEvent) {
      if (!dragElement.moving) {
        return;
      }

      if (event instanceof MouseEvent) {
        dragElement.distX = event.clientX - dragElement.oldX;
        dragElement.distY = event.clientY - dragElement.oldY;
      } else if (e instanceof TouchEvent) {
        dragElement.distX = event.touches[0].clientX - dragElement.oldX;
        dragElement.distY = event.touches[0].clientY - dragElement.oldY;
      } else {
        console.warn("event is neither MouseEvent nor TouchEvent");
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

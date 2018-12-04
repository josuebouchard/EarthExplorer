export let InputState = {
    position: {
        x: 0,
        y: 0
    },
    displacement: {
        get: () => {
            let response = {
                x: InputState.displacement.x,
                y: InputState.displacement.y
            }

            InputState.displacement.x = 0;
            InputState.displacement.y = 0;

            return response;
        },

        x: 0,
        y: 0,
    },
    scrolling: {
        get: () => {
            let response = {
                x: InputState.scrolling.x,
                y: InputState.scrolling.y
            }

            InputState.scrolling.x = 0;
            InputState.scrolling.y = 0;

            InputState.isScrolling = false;

            return response;
        },

        x: 0,
        y: 0
    },

    isClicking: false,
    isDragging: false,
    isScrolling: false,

    onClick: new Event("onClick"),
    onDrag: new Event("onDrag"),
    onDragFinish: new Event("onDragFinish")
};

window.addEventListener("mousedown", function(e) {
  e.preventDefault();

  InputState.isClicking = true;
});

window.addEventListener("mousemove", function(e) {
  e.preventDefault();

  //Get position of mouse
  InputState.position.x = e.clientX;
  InputState.position.y = e.clientY;

  //Get desiplacement of mouse
  InputState.displacement.x = e.movementX;
  InputState.displacement.y = e.movementY;

  //Is currently dragging
  if (InputState.isClicking && (InputState.displacement.x != 0 || InputState.displacement.y !=0)) {
    InputState.isDragging = true;
    document.dispatchEvent(InputState.onDrag);
  }
});

window.addEventListener("mouseup", function(e) {
  e.preventDefault();

  //Drag ended
  if (InputState.isDragging) {
    document.dispatchEvent(InputState.onDragFinish);
  }
  //Click ended
  else {
    document.dispatchEvent(InputState.onClick);
    console.log("hola");
  }

  InputState.isDragging = false;
  InputState.isClicking = false;
});

window.addEventListener("wheel", function(e) {
  e.preventDefault();

  InputState.scrolling.x += e.deltaX;
  InputState.scrolling.y += e.deltaY;
  InputState.isScrolling = true;
});
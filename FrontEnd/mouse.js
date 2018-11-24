var InputState = {
    position: {
        x: 0,
        y: 0
    },
    displacement: {
        x: 0,
        y: 0
    },
    isClicking: false,
    isDragging: false,

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
    if (InputState.isClicking) {
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
    }

    InputState.isDragging = false;
    InputState.isClicking = false;
});
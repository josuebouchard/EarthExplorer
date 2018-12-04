define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputState = {
        position: {
            x: 0,
            y: 0
        },
        displacement: {
            get: () => {
                let response = {
                    x: exports.InputState.displacement.x,
                    y: exports.InputState.displacement.y
                };
                exports.InputState.displacement.x = 0;
                exports.InputState.displacement.y = 0;
                return response;
            },
            x: 0,
            y: 0,
        },
        scrolling: {
            get: () => {
                let response = {
                    x: exports.InputState.scrolling.x,
                    y: exports.InputState.scrolling.y
                };
                exports.InputState.scrolling.x = 0;
                exports.InputState.scrolling.y = 0;
                exports.InputState.isScrolling = false;
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
    window.addEventListener("mousedown", function (e) {
        e.preventDefault();
        exports.InputState.isClicking = true;
    });
    window.addEventListener("mousemove", function (e) {
        e.preventDefault();
        //Get position of mouse
        exports.InputState.position.x = e.clientX;
        exports.InputState.position.y = e.clientY;
        //Get desiplacement of mouse
        exports.InputState.displacement.x = e.movementX;
        exports.InputState.displacement.y = e.movementY;
        //Is currently dragging
        if (exports.InputState.isClicking && (exports.InputState.displacement.x != 0 || exports.InputState.displacement.y != 0)) {
            exports.InputState.isDragging = true;
            document.dispatchEvent(exports.InputState.onDrag);
        }
    });
    window.addEventListener("mouseup", function (e) {
        e.preventDefault();
        //Drag ended
        if (exports.InputState.isDragging) {
            document.dispatchEvent(exports.InputState.onDragFinish);
        }
        //Click ended
        else {
            document.dispatchEvent(exports.InputState.onClick);
            console.log("hola");
        }
        exports.InputState.isDragging = false;
        exports.InputState.isClicking = false;
    });
    window.addEventListener("wheel", function (e) {
        e.preventDefault();
        exports.InputState.scrolling.x += e.deltaX;
        exports.InputState.scrolling.y += e.deltaY;
        exports.InputState.isScrolling = true;
    });
});

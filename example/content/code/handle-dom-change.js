// adding or removing node, that changes DOM height
document.appendChild(someNode);
document.removeChild(anotherNode);

// then explicitly redraw immerser
immerserInstance.onDOMChange();
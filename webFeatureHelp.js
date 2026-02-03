// RESIZE WINDOW & ELEMENTS FUNCTION
function updateElementPosition() {
    const element = document.getElementById('nav-bar'); // Adjusts the directory bar so that it centers when window is resized
    const newLeft = window.innerWidth * 0.1;
    element.style.left = newLeft + 'px';
    element.style.position = 'fixed'; 
}

// UPDATE ELEMENT POSITION FUNCTION
window.addEventListener('resize', updateElementPosition); // Checks when the webpage window is resized by user
updateElementPosition(); // Calls updateElementPosition to resize the elements according to new window size
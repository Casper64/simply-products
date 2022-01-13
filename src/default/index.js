import "./listeners"
import { sleep } from "../utils/index"

/** 
 * Make a typewriting animation.
 * Example: .typewriter[data-text="text"]
 * animates the text "text" inside .writeable
 * @async
 */
export async function typewriter() {
    let container = document.getElementById("typewriter");
    let writeable = document.getElementById("writeable");
    for (let i = 0, child = container.children[i]; i < container.children.length - 1; i++, child = container.children[i]) {
        writeable.innerHTML = "";
        await sleep(250);
        let str = child.getAttribute("data-text");
        for (let j = 0, char=str[0]; j < str.length; j++, char = str[j]) {
            writeable.textContent += char;
            if (char == ".") await sleep(250);
            else if (char != " ") await sleep(100);
        }
        await sleep(1000);
    }
    await sleep(750);
    writeable.setAttribute("data-text", writeable.textContent)
    writeable.classList.add("glitch-text");
    await sleep(750);
    writeable.innerHTML = "";
    writeable.classList.Constants.remove("glitch-text");
    await sleep(750);

    container.remove();
}

/**
 * Show popup with
 * @param {string} name - The name of the popup
 */
export function showPopup(name) {
    document.getElementById("popup-"+name).style.display = "grid";
}
/**
 * 
 * @param {string} name - The name of the popup
 * @param {Event} event - Default event
 * @param {Element} element - Element that initiated the call
 * @param {boolean} [force=true] - Force an outcome
 */
export function hidePopup(name, event, element, force=false) {
    if (!force && event.target != element) {
        event.stopPropagation();
        return;
    }
    document.getElementById("popup-"+name).style.display = "none";
}

/**
 * Helper function: category value setter for a popup
 * @param {string} category 
 */
export function setCategoryValue(category) {
    document.getElementById("project-category").setAttribute("value", category);
}

export default {
    typewriter,
    sleep,
    showPopup,
    hidePopup,
    setCategoryValue
}
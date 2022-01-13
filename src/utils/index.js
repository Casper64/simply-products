
/**
 * Display a message on top of the screen
 * @param {string} message
 * @param {string} type Type of message "success" | "error"
 */
export function displayMessage(message, type) {
    const urlParams = new URLSearchParams(window.location.search);
    let arg = urlParams.get('message') || urlParams.get('error');
    let container = document.getElementById("message-container");
    message = message || arg;
    if (!message) {
        return;
    }
    const id = getToken();
    let html = `<p id="message-${id}" class="message ${type || urlParams.get('error') ? 'danger' : ''}">${ message }</p>`;
    if (container) {
        container.insertAdjacentHTML("afterbegin", html);
    }
    else {
        document.body.insertAdjacentHTML("beforeend", `<div class="message-container" id="message-container">${html}</div>`);
        container = document.getElementById("message-container");
    }
    $("#message-"+id).on("click", () => {
        $("#message-"+id).remove();
    })
    setTimeout(() => {
        $("#message-"+id).remove();
    }, 5000)
}

/** 
 * Sleeps for an amount of time and returns a promise when finsished.
 * @param {number} x - milliseconds
 */
export function sleep(x) {
    return new Promise(resolve => setTimeout(resolve, x));
}


/**
 * Get the computed style value of a css rule on a certain element
 * @param {Element} oElm - The element on which to extract the css rule
 * @param {string} strCssRule - The css rule
 */
// export function getStyle(oElm, strCssRule){
//     var strValue = "";
//     if(document.defaultView && document.defaultView.getComputedStyle){
//         strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
//     }
//     else if(oElm.currentStyle){
//         strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
//             return p1.toUpperCase();
//         });
//         strValue = oElm.currentStyle[strCssRule];
//     }
//     return strValue;
// }


/**
 * Callback for an event listener
 * @callback EventCallback
 * @param {Event} event
 */
/**
 * On enter event listener
 * @param {element} el 
 * @param {EventCallback} callback - Event callback
 * @param {boolean} [prevent=false] - Prevent default
 */
export function onEnter(el, callback, prevent=false) {
    el.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            callback(event);
        }
    })
    if (prevent) {
        el.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        });
    }
}
/**
 * On escape vent listener
 * @param {Element} el 
 * @param {callback} callback - Event callback
 */
export function onEscape(el, callback) {
    el.addEventListener("keyup", (event) => {
        if (event.key == "Escape") {
            callback(event);
        }
    })
}
/**
 * On blur event listener
 * @param {Element} el 
 * @param {EventCallback} callback - Event callback
 */
export function onBlur(el, callback) {
    el.addEventListener("blur", callback)
}


/**
 * Get a random integer between min and max
 * @param {number} min 
 * @param {number} max 
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random string of a certain length
 * @param {number} [length =10]
 */
export function getToken(length = 10) {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters[getRandomInt(0, characters.length - 1)];
    }
    return randomString;
}

/**
 * Return a string with str repeated count times
 * @param {string} str - The string to be repeated
 * @param {number} count
 */
export function stringTimes(str, count) {
    let result = "";
    for (let i = 0; i < count; i++) {
        result += str;
    }
    return str;
}

export const Constants = {
    root: $("#folder-container").attr("data-root"),
    hash_name: window.location.pathname.replace("/projects/", ""),
    loadImages: false,
    selected: null,
    cache: {},
    openFolders: []
}


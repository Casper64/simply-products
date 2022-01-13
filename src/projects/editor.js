import { Constants } from "../utils/index"
import { updateResult } from "./parser"

/**
 * Open the markdown editor
 */
export function openMarkdownEditor() {
    $("#markdown-container").toggleClass("hidden", false);
    $("#markdown-header").toggleClass("hidden", true);
    $("#settings-editor").toggleClass("hidden", true);
    const id = Constants.selected.id || -1;
    if (Constants.cache[id]) {
        loadBlob(Constants.cache[id]);
        triggerResize();
    }
    else {  
        $.get(`/api/getdocument?id=${id}&hash_name=${Constants.hash_name}`, function(data, success) {
            Constants.cache[id] = data;
            loadBlob(data);
            triggerResize();
        });
    }   
}

/**
 * Load a document in blob form and set the text in the code area
 * @param {Object} doc - The document returned from mysql database
 */
export function loadBlob(doc) {
    let base64 = doc.content;
    if (!base64) {
        base64 = "";
    }
    let dirty = atob(base64);
    const clean = DOMPurify.sanitize(dirty);
    $("#textarea").val(clean);
    setLineNumbers();
    updateResult();
}

/**
 * Set the line numbers in the code editor
 */
export function setLineNumbers() {
    if (!$("#editor").length) return;
    let lineHeight = 25;
    let lines = Math.ceil(document.getElementById("textarea").clientHeight / lineHeight);
    let ln = document.getElementById("line-numbers");
    ln.innerHTML = "";
    for (let i = 0; i < lines; i++) {
        ln.innerHTML += `<p>${i+1}</p>`;
    }
}

/**
 * Trigger resize function and set the line numbers
 */
export function triggerResize() {
    $("textarea").trigger("input");
    setLineNumbers();
}

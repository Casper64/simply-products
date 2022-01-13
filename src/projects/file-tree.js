import { openMarkdownEditor } from "./editor"
import { Constants } from "../utils/index"
import { save } from "./document"

/**
 * Render the file container in projects.php
 */
export function rerenderFileContainer() {
    let container = document.getElementById("folder-container");
    scrollTop = document.getElementById("folder-container").scrollTop;
    container.innerHTML = "";
    $.get("/includes/project-xhr.php", {
        q: Constants.hash_name,
        root: Constants.root
    }, (data, success) => {
        container.insertAdjacentHTML("beforebegin", data);
        container.remove();
        foldersRendered();
    });
}

/**
 * Open all the folders that were open, if the file tree is rendered
 */
export function foldersRendered() {
    if (openFolder.length == 0 || Constants.openFolders.every(val => Boolean(document.getElementById(`nested-${val}`)))) {
        Constants.openFolders.forEach(f => openFolder(f, true));
        document.getElementById("folder-container").scrollTo(0, scrollTop);
        bindContextmenu();
    }
    else {
        window.requestAnimationFrame(foldersRendered);
    }
}

var scrollTop = 0;
/**
 * Open the folder in the file tree
 * @param {Element} element 
 * @param {Event} event 
 */
export function openFolder(element, event) {
    // force 
    if (event === true) {
        let container = document.getElementById(`nested-${element}`);
        if (!container) return;
        let el = document.getElementById(String(element));
        container.classList.toggle("closed");
        el.classList.toggle("open");
        return;
    }
    if (event.target.classList.contains("add-icon")) {
        event.stopPropagation();
        return;
    }

    let container = document.getElementById(`nested-${element.id}`);
    container.classList.toggle("closed");
    if (element.classList.toggle("open")) {
        Constants.openFolders.push(element.id);
    }
    else {
        Constants.openFolders = Constants.openFolders.filter(val => val != element.id);
    }
}

/**
 * Select a file from the file tree
 * @param {Element} element 
 */
export function selectFile(element) {
    if (Constants.selected) {
        if ($("#editor").length && !$("#nested-"+activeContextMenu).length) {
            Constants.cache[Constants.selected.id]["content"] = btoa($("#textarea").val());
            save();
        }
        Constants.selected.classList.toggle("selected");
    }
    element.classList.toggle("selected");
    Constants.selected = element;
    if (!$("#nested-"+activeContextMenu).length) {
        openMarkdownEditor();
    }
}

let activeContextMenu = -1;
/**
 * Bind the context menu event to files in the file tree
 */
export function bindContextmenu() {
    if (!$("#editor").length) return;
    $(".with-icon").contextmenu(function(event) {
        event.preventDefault();
        if (this.classList.contains("root-name")) {
            return;
        }
        activeContextMenu = this.id;
        $("#context-menu").css("display", "grid");
        $("#context-menu").css("left", event.clientX+"px");
        $("#context-menu").css("top", event.clientY+"px");
        selectFile(this);
        $("#context-menu-focus").focus();
        const blur = (event) => {
            $("#context-menu").css("display", "none");
            $(document).off("click", blur);
        }
        $(document).click(blur);
    });
}

/**
 * Rename a file
 */
export function renameFile() {
    let p = $("#"+activeContextMenu).find("p")[0];
    const prev = p.innerText;
    p.innerText = "";
    p.style.paddingLeft = "10px";
    p.setAttribute("contenteditable", true);
    p.focus();
    const update = () => {
        $.post(`/api/renamedocument`, {id: activeContextMenu, name: p.innerText, hash_name: Constants.hash_name}, fileChange);
        p.removeAttribute("contenteditable");
        p.style.paddingLeft = "0px";
    }
    onEnter(p, (event) => {
        event.preventDefault();
        update();
    }, true);
    onEscape(p, (event) => {
        p.removeAttribute("contenteditable");
        p.style.paddingLeft = "0px";
        p.innerText = prev;
    })
}

/**
 * Delete a file
 */
export function deleteFile() {
    if ($("#nested-"+activeContextMenu).length) {
        if (window.confirm("Are you sure you want to delete this folder and its contents?")) {
            Constants.openFolders = Constants.openFolders.filter(f => f != activeContextMenu)
            $("#"+activeContextMenu).remove();
            $("#nested-"+activeContextMenu).remove();
            $.post(`/api/deletedocument`, {id: activeContextMenu, hash_name: Constants.hash_name}, fileChange);
        }
    }
    else if (window.confirm("Are you sure you want to delete this file?")) {
        $("#"+activeContextMenu).remove();
        $.post(`/api/deletedocument`, {id: activeContextMenu, hash_name: Constants.hash_name}, fileChange);
    }
}

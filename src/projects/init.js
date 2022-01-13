import { bindContextmenu } from './file-tree'
import { triggerResize, setLineNumbers } from './editor'
import { save, downloadFile } from './document'
import { Constants } from "../utils/index.js"
import { updateResult  } from "./parser"



$(document).ready(() => {
    bindContextmenu();
   $("textarea").on("keyup", setLineNumbers);
   $("textarea").keydown(function(e) {
        var $this, end, start;
        if (e.keyCode === 9) {
            start = this.selectionStart;
            end = this.selectionEnd;
            $this = $(this);
            $this.val($this.val().substring(0, start) + "\t" + $this.val().substring(end));
            this.selectionStart = this.selectionEnd = start + 1;
            return false;
        }
    });
    window.addEventListener("resize", triggerResize);
    window.setInterval(save, 1000 * 60 * 5); // Every 5 minutes
    $("textarea").each(function () {
        if (window.innerWidth <= 1100) return;
        this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
    }).on("input", function () {
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
    });
    triggerResize();
});

// Setup event listeners
$("#theme-switch").on("input", (event) => {
    if (event.target.checked) {
        setTimeout(() => document.body.setAttribute("data-theme", "dark"), 250);
    }
    else {
        setTimeout(() => document.body.setAttribute("data-theme", "light"), 250);
    }
})

$("#layout-code").on("click", () => {
    $("#markdown-container").addClass("layout-code");
    $("#markdown-container").removeClass("layout-preview");
});
$("#layout-preview").on("click", () => {
    $("#markdown-container").removeClass("layout-code");
    $("#markdown-container").addClass("layout-preview");
});
$("#layout-split").on("click", () => {
    $("#markdown-container").removeClass("layout-code");
    $("#markdown-container").removeClass("layout-preview");
});
$("#save-file").on("click", () => {
    save();
});
$("#download-file").on("click", () => {
    downloadFile();
});
$("#view-images").on("click", () => {
    $("#markdown-container").toggleClass("hidden", true);
    $("#markdown-header").toggleClass("hidden", true);
    $("#settings-editor").toggleClass("hidden", true);
    $("#image-editor").toggleClass("hidden", false);
});
$("#showImages").change(() => {
    Constants.loadImages = !Constants.loadImages;
    updateResult();
});

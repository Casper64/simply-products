import { onEnter, onEscape, onBlur, displayMessage, Constants } from "../utils/index"
import { updateResult } from "./parser"
import { openFolder, rerenderFileContainer } from "./file-tree"


/**
 * Adds a file or folder input to the file hierarchy
 * @param {string} type - "file" | "folder"
 * @param {Element} element - The element where the user clicked on addDocument
 */
export function addDocument(type, element) {
    const getNestedBorders = () => {
        let amount = element.parentElement.classList.contains("root-name") ? 0 : element.parentElement.children[0].childElementCount + 1;
        let str = "";
        for (let i = 0; i < amount; i++) {
            str += `<div class="nested-border"></div>`;
        }
        return str;
    }
    const folder = `<div class="with-icon temp" id="temp">
    <div class="nested-borders">
        ${getNestedBorders()}
    </div>
    <img src="/assets/folder.svg">
    <input id="temp-input" type="text"/>
    </div>`;
    const file = `<div class="with-icon temp" id="temp">
    <div class="nested-borders">
        ${getNestedBorders()}
    </div>
    <img src="/assets/file.svg">
    <input id="temp-input" type="text"/>
    </div>`;
    if (!Constants.openFolders.includes(element.parentElement.id) && !element.parentElement.classList.contains("root-name"))  {
        Constants.openFolders.push(element.parentElement.id)
        openFolder(element.parentElement.id, true)
    }
    element.parentElement.insertAdjacentHTML("afterEnd", type == "folder" ? folder : file);
    let input = document.getElementById("temp-input");
    input.focus();
    onEnter(input, (event) => {
        let value = event.target.value;
        input.blur();
        if (value == "") {
            document.getElementById("temp").remove();
            return;
        }
        // Sent POST to add folder/file
        $.post(`/api/adddocument`, {
            type,
            name: value,
            parent: element.parentElement.id,
            add: true,
            hash_name: Constants.hash_name
        }, (data, status) => {
            if (status === "success") {
                window.fileChange();
                save();
                rerenderFileContainer();
            }
        })
    });
    onEscape(input, () => {
        input.blur();
        let el = document.getElementById("temp");
        if (el) el.remove();
    })
    onBlur(input, () => {
        let el = document.getElementById("temp");
        if (el) el.remove();
    })
}


/**
 * Save a document
 */
 export function save() {
    if (!$(".selected")[0]) {
        return;
    }
    let dirty = $("#textarea").val();
    const clean = DOMPurify.sanitize(dirty);
    // escape parsed
    let base64 = btoa(clean);
    const id = $(".selected")[0].id;
    Constants.cache[id]["content"] = base64;
    $.post(`/api/savedocument?id=${id}`, {content: base64});
    displayMessage("Saved file");
}


/**
 * Download the current file in html form with all the styles
 */
export async function downloadFile() {

    await updateResult(true);

    if (!Constants.selected) return;
    const html = $("#preview").html();
    let css = await fetch("../css/markdown.css");
    const markdownStyle = await css.text();
    css = await fetch("../css/atom-one-light.min.css");
    const codeCss = await css.text();
    css = await fetch("https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css");
    const katexCss = await css.text();
    const doc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css" integrity="sha384-zTROYFVGOfTw7JV7KUu8udsvW2fx4lWOsCEDqhBreBwlHI4ioVRtmIvEThzJHGET" crossorigin="anonymous">
    <style>${markdownStyle}</style>
    <style>${codeCss}</style>
    <style>${katexCss}</style>
</head>
<body class="markdown-previewer">
${html}
</body>`;

    let data = await fetch("../config.json");
    const config = await data.json();

    const downloadFile = (blob, fileName) => {
        const link = document.createElement('a');
        // create a blobURI pointing to our Blob
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        // some browser needs the anchor to be in the doc
        document.body.append(link);
        link.click();
        link.remove();
        // in case the Blob uses a lot of memory
        setTimeout(() => URL.revokeObjectURL(link.href), 7000);
      };

    $.ajax({
        url: config.server.url+"/get-pdf",
        method: 'POST',
        data: doc,
        contentType: "text/html; charset=UTF-8",
        success (data) {
            const link = document.createElement('a');
            // create a blobURI pointing to our Blob
            link.href = data;
            link.download = Constants.selected.innerText + ".pdf";
            // some browser needs the anchor to be in the doc
            document.body.append(link);
            link.click();
            link.remove();
        },
        error (req) {
            // console.log(req);
        }
    })
}
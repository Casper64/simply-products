import { C as Constants, d as displayMessage } from "./module.js"

var socket;

(async function startSharing() {
    let data = await fetch("../config.json");
    const config = await data.json();
    const auth = await getUserToken();
    auth.hash_name = Constants.hash_name;
    socket = io(config.server.url, {
        auth
    });

    socket.on("connect_error", (error) => {
        displayMessage(error.message, "error")
    })

    socket.on("connect", () => {
        console.log(socket.id);
    });
    
    socket.on("keyup-response", (data) => {
        if (Constants.selected && Constants.selected.id == data.file) {
            $("#textarea").val(data.content);
            updateResult();
        }
        else {
            cache[data.file] = {content: btoa(data.content) };
        }
    });

    socket.on("file-change", () => {
        console.log("render")
        rerenderFileContainer();
    });

    socket.on("message", displayMessage);
    
    $("#textarea").on("keyup", () => {
        if (!Constants.selected) return;
        socket.emit("keyup", {
            content:  $("#textarea").val(),
            file: Constants.selected.id,
            start: $("#textarea").prop("selectionStart")
        })
    });
})();

window.fileChange = () => {
    if (!socket) return;
    console.log("ret")
    socket.emit("file-change");
}

window.getUserToken = () => {
    return $.get("/api/gettoken");
}



/**
 * Setup a share link for the project
 */
export function shareProject() {
    let select = document.getElementById("rights-settings");
    if (!select) return;
    let rights = select.value;
    let auth = getToken(32);
    let hash_name = window.location.pathname.replace("/projects/", "");
    $.post(`/api/setshare`, { auth, hash_name, rights }, (data, status) => {
        if (status === "success") {
            let link = `${window.location.origin}${window.location.pathname}?auth=${auth}`;
            $("#link-share").html(`<b>Share this link: </b><a href="${link}" target="_blank">${link}</a>`);
        }
    })
}

/**
 * Remove a share link
 */
export function cancelAddUser() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const auth = urlSearchParams.get("auth");
    $.post("/api/cancelshare", {auth});
    window.location = "/";
}

/**
 * Remove a user from the project
 * @param {number} id 
 */
export function removeUser(id) {
    $.post(`/api/removeprivilege`, {id, hash_name}, (data, status) => {
        $("#rights-"+id).remove();
        hidePopup("remove", window);
    });
}

/**
 * Edit a privilege of a user on the project
 * @param {number} id 
 */
export function editPrivilege(id) {
    let select = document.getElementById("rights-settings-popup");
    if (!select) return;
    let rights = select.value;
    $.post(`/api/editprivilege`, {id, hash_name, rights}, (data, status) => {
        $("#rights-"+id).children()[1].innerText = rights;
        hidePopup("edit", window);
    });
}

/**
 * Upload an image to a project
 */
export function uploadImage() {
    let fd = new FormData();
    let file = $("#file-image")[0]
    if (!file.files.length) return;
    file = file.files[0];
    file.name = file.name.replaceAll("\s", "_");
    fd.append('image', file);
    $.ajax({
        url: `/api/uploadimage?hash_name=${hash_name}`,
        type: 'POST',
        data: fd,
        contentType: false,
        processData: false,
        success (response) {
            displayMessage(response.message);
            let container = document.getElementById("tbody-images");
            let html = `<tr id="image-${response.id}">
                <td>${file.name}</td>
                <td class="split" onclick="deleteImage(this)"> 
                    <div class="split-td">
                        <img src="/assets/minus.svg">
                        <p>Delete image</p>
                    </div>
                </td>
            </tr>`
            container.insertAdjacentHTML("beforeend", html);
            hidePopup('image', window);
        },
        error (error) {
            console.log(error.responseText)
            displayMessage(error.responseText, "error");
            hidePopup('image', window);
        }
    })
}
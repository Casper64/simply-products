<?php
    require_once "./includes/auth.php";
    check_auth();
?>
<?php include_once "./header.php" ?>
<?php require_once "./includes/project.php" ?>
<?php include "./components/nav.php" ?>
<?php 
    header("Access-Control-Allow-Origin: *");
?>

<style>
    body {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: 1fr;
        padding: 0px;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
    html {
        overflow: hidden;
    }

    @media only screen and (max-width: 1100px) {
    body, html {
        overflow-y: auto;
    }

    body {
        height: auto;
        display: block;
    }
}
</style>
<link rel="stylesheet" href="/css/atom-one-light.min.css"/>
<link rel="stylesheet" href="/css/markdown.css"/>
<script src="/js/purify.min.js" defer></script>
<script src="/js/markdown-it.min.js" defer></script>
<script src="/highlight/highlight.min.js" defer></script>
<!-- <script src="/js/projects.js" type="module" defer></script> -->
<script type="module" defer>
import Projects from "/js/projects.js"
window.Projects = Projects;

</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.css" integrity="sha384-zTROYFVGOfTw7JV7KUu8udsvW2fx4lWOsCEDqhBreBwlHI4ioVRtmIvEThzJHGET" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/katex.min.js" integrity="sha384-GxNFqL3r9uRJQhR+47eDxuPoNE7yLftQM8LcxzgS4HT73tp970WS/wV5p8UzCOmb" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.18/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous"></script>


<?php if (isset($_GET["auth"])) : ?>
<div class="add-popup" style="display: grid;">
    <form method="POST" class="popup-content accept">
        <h1>Accept invitation to <?php echo $rootname; ?>?</h1>
        <input type="hidden" name="add-user" value="true"/>
        <input type="hidden" name="auth" value="<?php echo $_GET["auth"] ?>"/>
        <div class="split-grid">
            <button class="btn" type="submit">Accept</button>
            <div class="btn" onclick="Projects.cancelAddUser()">Cancel</div>
        </div>
    </form>
</div>
<?php exit; elseif ($editable): ?>
<script src="/js/socket.io.client.min.js" defer></script>
<script src="/js/client.js" defer type="module"></script>
<?php endif; ?>

<div class="project-container">
    <?php include './includes/project-xhr.php' ?>
    <nav class="markdown-nav">
        <div class="nav-item layout-single" id="view-images" title="images">
            <svg><use xlink:href="/assets/image.svg#img"></use></svg>
        </div>
        <div class="spacer"></div>
        <div class="nav-item layout-single" id="save-file" title="Save">
            <svg><use xlink:href="/assets/save.svg#img"></use></svg>
        </div>
        <div class="nav-item layout-single" id="layout-code" title="Layout Code">
            <svg><use xlink:href="/assets/code.svg#img"></use></svg>
        </div>
        <div class="nav-item layout-single" id="layout-preview" title="Layout Preview">
            <svg><use xlink:href="/assets/document.svg#img"></use></svg>
        </div>
        <div class="nav-item layout-split" id="layout-split" title="Split Layout">
            <svg><use xlink:href="/assets/code.svg#img"></use></svg>
            <div class="border"></div>
            <svg><use xlink:href="/assets/document.svg#img"></use></svg>
        </div>
        <div class="nav-item theme-switch">
            <p>Light</p>
            <input type="checkbox" id="theme-switch" class="toggle--checkbox" checked>
            <label for="theme-switch" class="toggle--label">
            </label>
            <p>Dark</p>
        </div>
        <div class="nav-item layout-checkbox">
            <input class="inp-cbx" id="showImages" type="checkbox"/>
            <label class="cbx" for="showImages"><span>
            <svg width="12px" height="10px">
      <use xlink:href="#check"></use>
    </svg>
                </span><span>Load images</span>
            </label>
        </div>
        <div class="spacer"></div>
        <div class="nav-item layout-single" title="Download File" id="download-file">
            <svg><use xlink:href="/assets/download.svg#img"></use></svg>
        </div>
    </nav>
    <div class="markdown-container hidden <?php if (!$editable) echo "layout-preview" ?>" id="markdown-container">
        <?php if ($editable): ?>
        <div class="markdown-editor" id="editor">
            <div class="line-numbers" id="line-numbers"></div>
            <!-- <p id="textarea" contenteditable="true"></p> -->
            <textarea id="textarea"></textarea>
        </div>
        <?php else: ?>
        <div class="markdown-editor disabled">
            <p>You aren't allowed to edit any files</p>
        </div>
        <?php endif; ?>
        <div class="markdown-previewer" id="preview"></div>
    </div>
    <div class="markdown-container-nothing" id="markdown-header">
        <h1>Select or create a file to get started!</h1>
    </div>
    <div class="project-settings hidden" id="settings-editor">
        <h1 class="column-span-2 settings-title">Settings for <?php echo $document["namespace"] ?></h1>
        <?php if ($_SESSION["user_id"] === $document["owner"]) : ?>
        <div class="settings-owners settings-panel">
            <h2 class="panel-title">Privileges</h2>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Rights</th>
                        <th>Edit privilege</th>
                        <th>Remove user</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    $db = new Database();
                    $query = "SELECT * FROM privileges WHERE project=?";
                    $result = $db->run_query($query, "i", array($document["id"]));
                    foreach($result as $user) :?>
                    <tr id="rights-<?php echo $user['id'] ?>">
                        <td><?php echo $user["username"]?></td>
                        <td><?php echo $user["rights"] ?></td>
                        <?php if ($user["rights"] !== "owner") : ?>
                        <td class="split" onclick="activePrivilege = <?php echo $user['id'] ?>; Default.showPopup('edit')">
                            <div class="split-td">
                                <img src="/assets/edit.svg">
                                <p>Edit privilege</p>
                            </div>
                        </td>
                        <td class="split" onclick="activePrivilege = <?php echo $user['id'] ?>; Default.showPopup('remove')"> 
                            <div class="split-td">
                                <img src="/assets/minus.svg">
                                <p>Remove user</p>
                            </div>
                        </td>
                        <?php else: ?>
                        <td></td>
                        <td></td>
                        <?php endif; ?>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <div class="split-layout">
                <button class="btn" onclick="Projects.shareProject()">Share project as</button>
                <select style="margin-left: 20px;" id="rights-settings">
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                </select>
            </div>
            <p id="link-share"></p>
        </div>
        <?php else: ?>
        <p>You aren't the owner of the project</p>
        <?php endif; ?>
    </div>
    <div class="image-uploads hidden" id="image-editor">
        <h1 class="settings-title">Images for <?php echo $document["namespace"] ?></h1>
        <div class="image-panel">
            <button class="btn" onclick="Default.showPopup('image')">Upload image</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Delete image</th>
                    </tr>
                </thead>
                <tbody id="tbody-images">
                    <?php
                    $db = new Database();
                    $query = "SELECT * FROM images WHERE project=?";
                    $result = $db->run_query($query, "s", array($document_name));
                    foreach($result as $image): ?>
                    <tr id="image-<?php echo $image["id"] ?>">
                        <td><?php echo $image["name"] ?></td>
                        <td class="split" onclick="Projects.deleteImage(this)"> 
                            <div class="split-td">
                                <img src="/assets/minus.svg">
                                <p>Delete image</p>
                            </div>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!--SVG Sprites-->
<svg class="inline-svg">
  <symbol id="check" viewbox="0 0 12 10">
    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
  </symbol>
</svg>
<div class="context-menu" id="context-menu">
    <p onclick="Projects.renameFile()">Rename</p>
    <p onclick="Projects.deleteFile()">Delete</p>
</div>

<div class="add-popup" id="popup-remove" onclick="Default.hidePopup('remove', event, this)">
    <div class="popup-content accept">
        <h1>Remove user?</h1>
        <div class="split-grid">
            <button class="btn" onclick="Projects.removeUser(activePrivilege)">Remove</button>
            <div class="btn" onclick="Default.hidePopup('remove', event, this)">Cancel</div>
        </div>
    </div>
</div>
<div class="add-popup" id="popup-edit" onclick="Default.hidePopup('edit', event, this)">
    <div class="popup-content accept">
        <h1>Edit user rights</h1>
        <select style="margin-left: 20px;" id="rights-settings-popup">
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
        </select>
        <div class="split-grid">
            <button class="btn" onclick="Projects.editPrivilege(activePrivilege)">Change</button>
            <div class="btn" onclick="Default.hidePopup('edit', event, this)">Cancel</div>
        </div>
    </div>
</div>
<div class="add-popup" id="popup-image" onclick="Default.hidePopup('image', event, this)">
    <div class="popup-content accept">
        <h1>Upload image</h1>
        <input type="file" id="file-image" accept="image/png, image/gif, image/jpeg"/>
        <div class="split-grid">
            <button class="btn" onclick="Projects.uploadImage()">Upload</button>
            <div class="btn" onclick="Default.hidePopup('image', event, this)">Cancel</div>
        </div>
    </div>
</div>

<?php include "./footer.php" ?>

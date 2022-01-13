<?php
    require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/auth.php";
    check_auth();
    require_once $_SERVER["DOCUMENT_ROOT"] . "/db.php";
?>
<?php
    $db = new Database();
    // Coming from ajax instead of include in projects.php
    if (!isset($root)) {
        $root = intval($_GET["root"]);

        $query = "SELECT * FROM categories WHERE hash_name=?";
        $document = $db->run_query($query, "s", array($_GET["q"]))[0];
        $query = "SELECT * FROM privileges WHERE username=? AND project=?";
        $privileges = $db->run_query($query, "si", array($_SESSION["username"], $document["id"]))[0];
    }
    $db = new Database();
    $query = "CALL getRelated(?)";
    $root_result = $db->run_query($query, "i", array($root))[0];

    if ($db->next_result()) {
        $documents_raw = $db->get_result();
        $documents = array();
        function change_array($value, $key) {
            global $documents;
            $documents[$value["id"]] = $value;
        }
        array_walk($documents_raw, 'change_array');
        usort($documents, function($a, $b) {
            return -1 * strcmp($a["type"], $b["type"]);
        });
        $documents_map = array();
        function make_assoc_map($value, $key) {
            global $documents_map;
            $documents_map[$value["id"]] = $key;
        }
        array_walk($documents, 'make_assoc_map');
    }
?>

<div class="folder-container" id="folder-container" data-root="<?php echo $root ?>">
    <div class="nav-header">
        <p>EXPLORER</p>
        <p class="rights"><?php echo $privileges["rights"] ?></p>
        <img src="/assets/cog.svg" id="open-settings">
    </div>
    <div class="root-name folder open with-icon" id="<?php echo $root ?>">
        <img class="folder-open" src="/assets/folder-open.svg">
        <img class="folder-closed" src="/assets/folder.svg">
        <p><?php echo $root_result["name"] ?></p>
        <img class="add-icon" src="/assets/add-folder.svg"
            onclick="Projects.addDocument('folder', this)"
            title="New Folder">
        <img class="add-icon" src="/assets/add-file.svg"
            onclick="Projects.addDocument('file', this)"
            title="New File">
    </div>
<?php 
function str_sort($a, $b) {
    global $documents;
    return strcmp($documents[$a]["name"], $documents[$b]["name"]);
}
function render_recursive($parent, $step = 1) {
    global $documents;
    $children = array_keys(array_column($documents, 'parent_id'), $parent);
    usort($children, "str_sort");
    $index = 0;
    foreach ($children as $child) {
        $document= $documents[$child];
        if ($document["type"] == "folder") {
            ?>
        <div class="folder with-icon" id="<?php echo $document["id"] ?>"
            onclick="Projects.openFolder(this, event)">
            <?php if ($step > 1): ?>
            <div class="nested-borders">
            <?php if ($step > 1)for ($i = 1; $i < $step; $i++): ?>
                <div class="nested-border"></div>
            <?php endfor; ?>
            </div>
            <?php endif; ?>
            <img class="folder-open" src="/assets/folder-open.svg">
            <img class="folder-closed" src="/assets/folder.svg">
            <p><?php echo $document["name"] ?></p>
            <img class="add-icon" src="/assets/add-folder.svg"
                onclick="Projects.addDocument('folder', this)"
                title="New Folder">
            <img class="add-icon" src="/assets/add-file.svg"
                onclick="Projects.addDocument('file', this)"
                title="New File">
        </div>
        <div class="nested-container closed" id="nested-<?php echo $document["id"] ?>">
        <?php
            unset($children[$index]);
            render_recursive($document["id"], $step + 1);
        ?>
        </div>
        <?php
        }
        $index += 1;
    }
    foreach ($children as $child) {
        $document= $documents[$child];
        ?>
    <div class="file with-icon" onclick="Projects.selectFile(this)" id="<?php echo $document["id"] ?>">
        <?php if ($step > 1): ?>
        <div class="nested-borders">
        <?php if ($step > 1)for ($i = 1; $i < $step; $i++): ?>
            <div class="nested-border"></div>
        <?php endfor; ?>
        </div>
        <?php endif; ?>
        <img src="/assets/file.svg">
        <p><?php echo $document["name"] ?></p>
    </div>
        <?php
    }
}
render_recursive($root);
?>
</div>

<script>
$("#open-settings").on("click", () => {
    $("#markdown-container").toggleClass("hidden", true);
    $("#markdown-header").toggleClass("hidden", true);
    $("#settings-editor").toggleClass("hidden", false);
    $("#image-editor").toggleClass("hidden", true);
});
</script>
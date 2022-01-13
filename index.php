<?php
    require_once "./includes/auth.php";
    check_auth();
?>
<?php include_once "./header.php" ?>
<?php
if (isset($_POST["add-category"])) {
    $db = new Database();
    $query = "INSERT INTO categories (namespace, owner) VALUES (?, ?)";
    $db->insert($query, "si", array($_POST["category-name"], $_SESSION["user_id"]));
}
if (isset($_POST["add-project"])) {
    $db = new Database();
    $namespace = $_POST["project-category"] . "/" . $_POST["project-name"];
    $hash_name = md5($_SESSION["user_id"]. "@" . $namespace);

    $query = "INSERT INTO documents (owner, type, name) VALUES (?, 'folder', ?)";
    $db->insert($query, "is", array($_SESSION["user_id"], $namespace));
    $row = $db->run_base_query("SELECT LAST_INSERT_ID()")[0];
    $root_id = $row["LAST_INSERT_ID()"];

    $query = "INSERT INTO categories (namespace, hash_name, owner, root_document) VALUES(?, ?, ?, ?)";
    $db->insert($query, "ssis", array($namespace, $hash_name, $_SESSION["user_id"], $root_id));
    $row = $db->run_base_query("SELECT LAST_INSERT_ID()")[0];
    $category = $row["LAST_INSERT_ID()"];

    $query = "INSERT INTO privileges (username, rights, project) VALUES (?, ?, ?)";
    $db->insert($query, "ssi", array($_SESSION["username"], "owner", $category));

    header("Location: /projects/" . $hash_name);
    exit;
}

$db = new Database();
$query = "SELECT * FROM categories WHERE hash_name IS NULL AND owner=?";
$categories = $db->run_query($query, "i", array($_SESSION["user_id"]));

$query = "SELECT categories.*, privileges.username FROM categories INNER JOIN privileges ON categories.id=privileges.project WHERE privileges.username=?";
$projects = $db->run_query($query, "s", array($_SESSION["username"]));

?>

<?php include "./components/nav.php" ?>


<?php if (isset($_GET["redirect"])): ?>
<!-- <section class="loading-skull">
    <img src="/assets/skull.svg">
</section> -->
<?php endif; ?>

<div class="home-container">
    <?php foreach ($categories as $category) : ?>
    <section class="category">
        <h1><?php echo $category["namespace"]?></h1>
        <div class="projects-container">
            <?php $i = 0; foreach ($projects as $project) :
                if (is_project_off($category, $project)) : ?>
                    <a 
                        class="project" 
                        href="projects/<?php echo $project["hash_name"]?>" 
                        style="background-color: <?php echo '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT)?>"
                    >
                        <?php echo get_project_name($project) ?>
                    </a>
            <?php 
                unset($projects[$i]);
                endif; 
                $i +=1;
                endforeach; 
            ?>
            <button class="btn" onclick="Default.setCategoryValue('<?php echo $category['namespace']?>'); Default.showPopup('project')">Add Project &plus;</button>
        </div>
        <hr>
    </section>
    <?php endforeach; ?>
    <?php if(!empty($projects)) : ?>
    <section class="category">
        <h1>Projects shared with me</h1>
        <div class="projects-container">
            <?php foreach ($projects as $project) : ?>
                    <a 
                        class="project" 
                        href="projects/<?php echo $project["hash_name"]?>" 
                        style="background-color: <?php echo '#' . str_pad(dechex(mt_rand(0, 0xFFFFFF)), 6, '0', STR_PAD_LEFT)?>"
                    >
                        <?php echo $project["namespace"] ?>
                    </a>
            <?php 
                endforeach; 
            ?>
        </div>
        <hr>
    </section>
    <?php endif; ?>

    <section class="category">
        <button class="btn" onclick="Default.showPopup('category')">Add Category &plus;</button>
    </section>
</div>

<div class="add-popup" id="popup-category" onclick="Default.hidePopup('category', event, this)">
    <form method="POST" class="popup-content">
        <h1>Add Category</h1>
        <input class="inp" name="category-name" type="text" placeholder="Category name">
        <input type="hidden" name="add-category" value="true"/>
        <div class="split-grid">
            <button class="btn" type="submit">Add</button>
            <div class="btn" onclick="Default.hidePopup('category', event, this, true)">Cancel</div>
        </div>
    </form>
</div>

<div class="add-popup" id="popup-project" >
    <form method="POST" class="popup-content">
        <h1>Add Project</h1>
        <input class="inp" name="project-name" type="text" placeholder="Project name">
        <input type="hidden" name="add-project" value="true"/>
        <input type="hidden" name="project-category" value="" id="project-category"/>
        <div class="split-grid">
            <button class="btn" type="submit">Add</button>
            <div class="btn" onclick="Default.hidePopup('project', event, this, true)">Cancel</div>
        </div>
    </form>
</div>

<?php include "./footer.php" ?>
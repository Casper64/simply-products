<?php
require_once "./includes/auth.php";
check_auth();

require_once "./db.php";

$path = $_GET["q"];

if (!isset($path) || empty($path)) {
    http_response_code(404);
    die();
}

if ($path === "getdocument") {
    get_document();
}
else if ($path == "savedocument") {
    update_document();
}
else if ($path == "setshare") {
    set_share();
}
else if ($path == "cancelshare") {
    cancel_share();
}
else if ($path == "adddocument") {
    add_document();
}
else if ($path == "renamedocument") {
    rename_document();
}
else if ($path == "deletedocument") {
    delete_document();
}
else if ($path == "removeprivilege") {
    remove_privilege();
}
else if ($path == "editprivilege") {
    edit_privilege();
}
else if ($path == "gettoken") {
    get_token_username_json();
}
else {
    http_response_code(404);
    die();
}

function get_document() {
    if (!isset($_GET["id"]) || empty($_GET["id"])) {
        die("Invalid request");
    }
    $db = new Database();

    // First check if the owner makes the request
    $query = "SELECT storage.content, documents.owner FROM storage INNER JOIN documents ON storage.id=documents.id WHERE storage.id=? AND documents.owner=?";
    $row = $db->run_query($query, "ii", array($_GET["id"], $_SESSION["user_id"]))[0];
    if (isset($row)) {
        header('Content-Type: application/json');
        echo json_encode($row);
        exit;
    }
    // No need to check which privilege because if a privilege exists the user can at least view the document
    check_privileges();

    // Return json
    $query = "SELECT * FROM storage WHERE id=?";
    $row = $db->run_query($query, "i", array($_GET["id"]))[0];
    header('Content-Type: application/json');
    echo json_encode($row);

    exit;
}

function update_document() {
    if (!isset($_GET["id"]) || empty($_GET["id"]) || !isset($_POST["content"])) {
        die("Invalid request");
    }
    $db = new Database();
    // Check if the user is the owner of the document
    $query = "SELECT storage.content, documents.owner FROM storage INNER JOIN documents ON storage.id=documents.id WHERE storage.id=? AND documents.owner=?";
    $row = $db->run_query($query, "ii", array($_GET["id"], $_SESSION["user_id"]))[0];
    if (!isset($row)) {
        $privilege = check_privileges();
        if ($privilege["rights"] !== "owner" && $privilege["rights"] != "editor") {
            die("Not authorized");
        }
    }
    

    $query = "UPDATE storage INNER JOIN documents ON storage.id=documents.id SET content=? WHERE storage.id=?";
    $db->update($query, "si", array($_POST["content"], $_GET["id"]));
    exit;
}

function set_share() {
    if ($_SERVER["REQUEST_METHOD"] != "POST" || !isset($_POST["auth"]) || !isset($_POST["hash_name"]) || !isset($_POST["rights"])) {
        die("Invalid request");
    }
    $db = new Database();
    $query = "SELECT id FROM categories WHERE hash_name=? AND owner=?";
    $category_id = $db->run_query($query, "si", array($_POST["hash_name"], $_SESSION["user_id"]))[0]["id"];
    var_dump($category_id);
    $query = "INSERT INTO shareables (project, token, rights) VALUES (?, ?, ?)";
    $db->insert($query, "iss", array($category_id, $_POST["auth"], $_POST["rights"]));
    exit;
}

function cancel_share() {
    if ($_SERVER["REQUEST_METHOD"] != "POST" || !isset($_POST["auth"])) {
        die("Invalid request");
    }
    $db = new Database();
    $query = "DELETE FROM shareables WHERE token=?";
    $db->run_query($query, "s", array($_POST["auth"]));
    exit;
}

function add_document() {
    $privilege = check_privileges();
    if ($privilege["rights"] !== "owner" && $privilege["rights"] != "editor") {
        die("Not authorized");
    }

    $db = new Database();
    $query = "INSERT INTO documents (owner, type, name) VALUES(?, ?, ?)";
    $db->insert($query, "iss", array($_SESSION["user_id"], $_POST["type"], $_POST["name"]));
    $row = $db->run_base_query("SELECT LAST_INSERT_ID()")[0];
    $child_id = $row["LAST_INSERT_ID()"];

    if ($_POST["type"] === "file") {
        $query = "INSERT INTO storage (id) VALUES(?)";
        $db->insert($query, "i", array($child_id));
    }
    
    $query = "INSERT INTO file_links (child_id, parent_id) VALUES (?, ?)";
    $db->insert($query, "ii", array($child_id, $_POST["parent"]));
    exit;
}

function rename_document() {
    $privilege = check_privileges();
    if ($privilege["rights"] !== "owner" && $privilege["rights"] != "editor") {
        die("Not authorized");
    }

    $db = new Database();
    $query = "UPDATE documents SET name=? WHERE id=?";
    $db->run_query($query, "si", array($_POST["name"], $_POST["id"]));
    exit;
}

function delete_document() {
    $privilege = check_privileges();
    if ($privilege["rights"] !== "owner" && $privilege["rights"] != "editor") {
        die("Not authorized");
    }
    $db = new Database();
    $query = "CALL deleteDocuments(?)";
    $db->run_query($query, "i", array($_POST["id"]));
    exit;
}

function remove_privilege() {
    $privilege = check_privileges();
    if ($privilege["rights"] !== "owner") {
        die("Not authorized");
    }
    else if ($privilege["owner"] == $_POST["id"]) {
        die("Can't remove owner from privileges");
    }
    $db = new Database();
    $query = "DELETE FROM privileges WHERE id=? AND project=?";
    $db->run_query($query, "ii", array($_POST["id"], $privilege["project"]));
}

function edit_privilege() {
    $privilege = check_privileges();
    if ($privilege["rights"] !== "owner") {
        die("Not authorized");
    }
    else if ($privilege["owner"] == $_POST["id"]) {
        die("Can't change owner privileges");
    }
    $db = new Database();
    $query = "UPDATE privileges SET rights=? WHERE id=? AND project=?";
    $db->update($query, "sii", array($_POST["rights"], $_POST["id"], $privilege["project"]));
}

function get_token_username_json() {
    $token = get_token_username($_SESSION["username"], 0);
    if (count($token) > 0) {
        echo json_encode($token[0]);
        header('Content-Type: application/json');
        exit;
    }

    global $cookie_expiration;

    $token = get_token(16);
    $selector = get_token(32);

    $token_hash = password_hash($token, PASSWORD_DEFAULT);
    $selector_hash = password_hash($selector, PASSWORD_DEFAULT);

    $expiry_date = date("Y-m-d H:i:s", $cookie_expiration);

    insert_token($_SESSION["username"], $token_hash, $selector_hash, $expiry_date);

    $token = get_token_username($_SESSION["username"], 0);
    echo json_encode($token[0]);
    exit;
}
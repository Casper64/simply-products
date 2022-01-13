<?php 

$document_name = $_GET["q"];
$db = new Database();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["add-user"])) {
        if (!isset($_POST["auth"])) {
            http_response_code(403);
            die("Invalid auth token");
        }
        $shareable = validate_auth_token($_POST["auth"]);

        $query = "INSERT INTO privileges (username, rights, project) VALUES (?, ?, ?)";
        $db->insert($query, "ssi", array($_SESSION["username"], $shareable["rights"], $shareable["project"]));
        header("Location: /projects/".$_GET["q"]);
    }
}

function validate_auth_token($token) {
    $db = new Database();
    $query = "SELECT * FROM categories WHERE hash_name=?";
    $document = $db->run_query($query, "s", array($_GET["q"]))[0];
    if ($document["owner"] == $_SESSION["user_id"]) {
        header("Location: /projects/".$_GET["q"]."?message=You are already the owner of this project");
        exit;
    }

    $query = "SELECT * FROM shareables WHERE token=?";
    $rows = $db->run_query($query, "s", array($token));
    // Auth token doesn't exist
    if (empty($rows)) {
        http_response_code(403);
        die("Invalid auth token");
    }

    $shareable = $rows[0];
    // Check if the auth token belongs to the right project
    if ($shareable["project"] !== $document["id"]) {
        http_response_code(403);
        die("Invalid auth token");
    }
    $now = time();
    $target = strtotime($shareable["time"]);
    // Auth token only remains valid for 1 day
    if ($now - $target > 60*60*24) {
        http_response_code(403);
        die("Invalid auth token");
    }
    return $shareable;
}

$query = "SELECT * FROM categories WHERE hash_name=?";
$document = $db->run_query($query, "s", array($document_name))[0];
$query = "SELECT * FROM privileges WHERE username=? AND project=?";
$privileges = $db->run_query($query, "si", array($_SESSION["username"], $document["id"]));
// Validate auth token
if (isset($_GET["auth"])) {
    validate_auth_token($_GET["auth"]);
}
// Validate acces to project
else if ($_SESSION["user_id"] != $document["owner"]) {
    if (empty($privileges)) {
        http_response_code(403);
        die("You don't have access to this project");
    }
}

$privileges = $privileges[0];

$rootname = $document["namespace"];
$root = $document["root_document"];
$editable = $privileges["rights"] == "editor" || $privileges["rights"] == "owner";
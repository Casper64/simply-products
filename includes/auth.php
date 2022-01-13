<?php

session_start();

require_once $_SERVER["DOCUMENT_ROOT"] . "/db.php";

$current_time = time();
$current_date = date("Y-m-d H:i:s", $current_time);

// Set Cookie expiration for 1 month
$cookie_expiration = $current_time + (60 * 60 * 24 * 30);  // for 1 month

if ($_SERVER["REQUEST_METHOD"] == "POST" && $_SERVER["PHP_SELF"] == "/login/index.php") {
    $username = $_POST["username"];
    $password = $_POST["password"];
    $db = new Database();
    $new_user = false;
    
    if ($_POST["attempt-login"] == "false") {
        $query = "SELECT username FROM users WHERE username=?";
        $users = $db->run_query($query, "s", array($username));
        var_dump($users);
        if (count($users) != 0) {
            header("Location: /login?succeed=false&error=Username already exists");
            exit;
        }
        else if (strlen($password) < 8) {
            header("Location: /login?succeed=false&error=Password must be 8 characters long");
            exit;
        }
        else {
            $query = "INSERT INTO users (username, password) VALUES (?, ?)";
            $db->insert($query, "ss", array($username, password_hash($password, PASSWORD_DEFAULT)));
            $new_user = true;
        }
    }
    else if ($_POST["attempt-login"] == "true" || $new_user == true) {
        $query = "SELECT * FROM users WHERE username=?";
        $row = $db->run_query($query, "s", array($username))[0];

        if (password_verify($password, $row["password"])) {
            set_session($row);
            if(!empty($_POST["remember"])) {
                set_cookies($row);
            }
            else {
                clear_auth_cookie();
            }

            header("Location: /?message=Login successful!");
            exit;
        }
        else {
            header("Location: /login?succeed=false");
            exit;
        }
    }
    else {
        header("Location: /login?succeed=false");
        exit;
    }

    
}

function set_session($row) {
    $_SESSION["username"] = $row["username"];
    $_SESSION["user_id"] = $row["id"];
    $_SESSION["logged_in"] = true;
    $_SESSION["role"] = $row["role"];
}

function set_cookies($user) {
    global $cookie_expiration;
    // Current time plus one month
    setcookie("username", $user["username"], $cookie_expiration, "/");

    $token = get_token(16);
    setcookie("token", $token, $cookie_expiration, "/");
    $selector = get_token(32);
    setcookie("selector", $selector, $cookie_expiration, "/");

    $token_hash = password_hash($token, PASSWORD_DEFAULT);
    $selector_hash = password_hash($selector, PASSWORD_DEFAULT);

    $expiry_date = date("Y-m-d H:i:s", $cookie_expiration);

    // mark existing token as expired
    $user_token = get_token_username($user["username"], 0);
    if (!empty($user_token[0]["id"])) {
        set_expired_token($user_token[0]["id"]);
    }
    insert_token($user["username"], $token_hash, $selector_hash, $expiry_date);
}

function clear_auth_cookie() {

}

function get_token($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function get_token_username($username, $expired) {
    $db = new Database();
    $query = "SELECT * FROM tokens WHERE username=? AND is_expired=?";
    $result = $db->run_query($query, "si", array($username, $expired));
    return $result;
}

function set_expired_token($id) {
    $db = new Database();
    $query = "UPDATE tokens SET is_expired=1 WHERE id=?";
    $db->update($query, "i", array($id));
}

function insert_token($username, $password_hash, $selector_hash, $expiry_date) {
    $db = new Database();
    $query = "INSERT INTO tokens (username, password, token, expire) VALUES (?, ?, ?, ?)";
    $result = $db->insert($query, "ssss", array($username, $password_hash, $selector_hash, $expiry_date));
    return $result;
}

function check_auth($redirect = false) {
    global $current_date;
    $username = $_SESSION["username"];
    if (!empty($username)) {
        if ($redirect && $_SERVER["PHP_SELF"] != "/index.php") {
            header("Location: /");
            exit;
        } 
        return;
    }
    else if (!empty($_COOKIE["username"]) && !empty($_COOKIE["selector"]) && !empty($_COOKIE["token"])) {

        // Initiate auth token verification diirective to false
        $isPasswordVerified = false;
        $isSelectorVerified = false;
        $isExpiryDateVerified = false;

        // Get token for username
        $db = new Database();
        $query = "SELECT * FROM tokens WHERE username=? AND is_expired=?";
        $token = $db->run_query($query, "si", array($_COOKIE["username"], 0))[0];

        // Validate random password cookie with database
        if (password_verify($_COOKIE["token"], $token["password"])) {
            $isPasswordVerified = true;
        }

        // Validate random selector cookie with database
        if (password_verify($_COOKIE["selector"], $token["token"])) {
            $isSelectorVerified = true;
        }

        // check cookie expiration by date
        if($token["expire"] >= $current_date) {
            $isExpiryDateVerified = true;
        }
        else {
            set_expired_token($token["id"]);
        }

        // Redirect if all cookie based validation retuens true
        // Else, mark the token as expired and clear cookies
        if (!empty($token["id"]) && $isPasswordVerified && $isSelectorVerified && $isExpiryDateVerified) {
            $query = "SELECT * FROM users WHERE username=?";
            $row = $db->run_query($query, "s", array($_COOKIE["username"]))[0];
            set_session($row);
            if ($redirect && $_SERVER["PHP_SELF"] != "/index.php") {
                header("Location: /");
                exit;
            } 
            return;
        }
    }
    else {
        if ($_SERVER["PHP_SELF"] != "/login/index.php") {
            header("Location: /login");
            exit;
        }
    }
}

function check_privileges() {
    $db = new Database();
    $hash_name = $_POST["hash_name"];
    if (!isset($_POST["hash_name"])) {
        if (!isset($_GET["hash_name"])) {
            die("Invalid request");
        }
        $hash_name = $_GET["hash_name"];
    }
    $query = "SELECT * FROM privileges INNER JOIN categories ON privileges.project=categories.id WHERE categories.hash_name=? AND username=?";
    $privileges = $db->run_query($query, "ss", array($hash_name, $_SESSION["username"]));
    if (empty($privileges)) {
        die ("Unauthorized request");
    }
    return $privileges[0];
}
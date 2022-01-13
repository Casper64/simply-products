<?php
if (!isset($path)) {
    http_response_code(403);
    die();
}

$path = str_replace("server/", "", $path);

if ($path == "verifyaccess") {
    verify_access();
}
else {
    http_response_code(404);
    die();
}

function verify_access() {
    $privilege = check_privileges();
    if (count($privilege) > 0) {
        echo 1;
    }
    else {
        echo 0;
    }
    exit;
}
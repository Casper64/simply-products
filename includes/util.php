<?php

function root_file($file) {
    return $_SERVER["DOCUMENT_ROOT"] . "/" . $file;
}

function get_project_name($project) {
    $split = explode("/", $project["namespace"]);
    return $split[1];
}

function is_project_off($category, $project) {
    return strpos($project["namespace"], $category["namespace"]) !== false;
}
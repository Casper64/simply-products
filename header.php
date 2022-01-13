<?php require_once $_SERVER["DOCUMENT_ROOT"] . "/includes/util.php" ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- css -->
    <link rel="stylesheet" href="/css/main.css">

    <title>Simple Notes</title>
    <!-- js -->
    <script src="/js/jquery.min.js"></script>
    <script type="module" defer>
        import Default from "/js/default.js"
        window.Default = Default;
    </script>
</head>

<?php require_once root_file("db.php") ?>

<body data-theme="dark">

<?php if(!isset($_SESSION["username"])) header("Location: /login") ?>

<nav class="normal-nav" id="main-nav">
    <a href="/" class="nav-message">Welcome <?php echo $_SESSION["username"] ?></a>
    <svg class="menu" id="menu-bars"><use xlink:href="/assets/menu.svg#img"></use></svg>
    <div class="nav-items">
        <div class="nav-item">
            <a href="/">Home</a>
        </div>
        <div class="nav-item">
            <a href="/account">Account</a>
        </div>
        <div class="nav-item">
            <a href="/settings">Settings</a>
        </div>
    </div>
</nav>
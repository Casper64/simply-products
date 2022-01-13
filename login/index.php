<?php 
    require "../includes/auth.php";
    check_auth(true);
?>
<?php include "../header.php" ?>

<style>
body, html {
    overflow: hidden;
    display: grid;
    align-items: center;
    justify-items: center;
    height: 100vh;
    width: 100vw;
    background-color: var(--selected-ui);
    padding: 0;
}
</style>

<?php if (!isset($_GET["succeed"])): ?>
<!-- <section class="loader" id="typewriter">
    <p data-text="Wake up, Neo..."></p>
    <p data-text="The Matrix has you..."></p>
    <p id="writeable"></p>
</section> -->
<script>
document.addEventListener("readystatechange", () => {
    if (document.readyState == "complete") {
        // Default.typewriter();
    }
});
</script>
<?php endif; ?>

<section class="login">
    <form method="POST" id="login-form">
        <h1>Welcome User</h1>
        <input class="inp" name="username" type="text" placeholder="Username" required/>
        <input class="inp" name="password" type="password" placeholder="Password" required/>
        <div class="remember-me">
            <input type="checkbox" name="remember">
            <label for="checkbox">Remember me</label>
        </div>
        <input type="hidden" id="login" name="attempt-login" value="true"/>
    </form>
    <button onclick="postLogin()" class="btn">Log in</button>
    <button onclick="postSignUp()" class="btn">Sign up</button>
</section>

<script>

function postLogin() {
    document.getElementById("login").value = "true";
    document.getElementById("login-form").submit();
}
function postSignUp() {
    document.getElementById("login").value = "false";
    document.getElementById("login-form").submit();
}

</script>

<?php include root_file("footer.php") ?>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

<div class="container">
<div class="row">
<div class="col-md-4 col-md-offset-4">
    <div class="panel-heading">
        <h3 class="panel-title">Please Enter your PIN</h3>
    </div>
    <div class="panel-body">
        <form action="survey.php" method="post">
            <fieldset>
            <input class="form-control" placeholder="PIN" name="pin" type="text">
            <input class="btn btn-primary btn-block" type="submit" value="Login" name="submit">
            </fieldset>
        </form>
    </div>
</div>
</div>
</div>

<?php
    //Checks to see if an error message is needed
    //If so, displays correct message
    if(isset($_POST['error'])){
        $error = $_POST['error'];
        switch($error){
            case "tooFast":
                echo "<h3>You're doing that too fast. Please try again</h3>";
                break;
            case "wrongPin":
                echo "<h3>Oops! Wrong PIN. Please try again.";
        }
    }

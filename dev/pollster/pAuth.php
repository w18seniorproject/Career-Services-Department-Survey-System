<?php

    //include db connection file
    include_once "../config/pollsterDB.php";

    $database = new Database();

    $conn = $database->getConnection();

    echo " \$conn: ";
    var_dump($conn);

    $username = $_POST["username"];
    $pass = $_POST["pword"];

$sql = "SELECT pass FROM accounts WHERE accountname= ?";
$result = $conn->prepare($sql);
$result->execute(array($username));

if($result->rowCount() == 1){

//Scrub input here. 
// Make a new page that will scrub input for all login pages.

    $row = $result->fetch(PDO::FETCH_ASSOC);
    $hash = $row["pass"];

    if(!password_verify($pass, $hash)){
        header("Location: pLogin.html?error=wrongAuth");
        die("Username and/or password do not match.");
    }
    else{
        echo "Success";
    }


    //Probably don't need to store the username and password here.
    //Redirect to the pollster's home page.
}
else if($result->rowCount() > 0){
    header("Location: pLogin.html?error=notUnique");
    die("Internal error. Multiple matches for username/password.");
}
else{
    header("Location: pLogin.html?error=wrongAuth");
    die("Username and/or password do not match."); 
}

?>
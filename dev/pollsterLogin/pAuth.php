<?php

    //include db connection file
    include_once "../config/pollsterDB.php";

    $database = new Database();

    $conn = $database->getConnection();

    $username = $_POST["username"];
    $pass = $_POST["pword"];
    $hashedPass = password_hash($pass, PASSWORD_DEFAULT);

$sql = "SELECT accountname, pass FROM accounts WHERE accountname= ? AND pass= ?";
$query = $conn->prepare($sql);
$query->execute(array($username, $hashedPass));
$result = $query->fetchAll();

if($query->rowCount() == 1){

//Scrub input here. 
// Make a new page that will scrub input for all login pages.

    $row = $result->fetch_assoc();
    $accountname = $row["accountname"];
    $pass = $row["pass"];

    //Probably don't need to store the username and password here.
    //Redirect to the pollster's home page.
}
else if($query->rowCount() > 0){
    header("Location: pLogin.html?error=notUnique");
    die("Internal error. Multiple matches for username/password.");
}
else{
    header("Location: pLogin.html?error=wrongAuth");
    die("Username and/or password do not match."); 
}

?>
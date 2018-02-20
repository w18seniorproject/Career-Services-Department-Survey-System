<?php

    //include db connection file
    include_once "./config/database.php";

    $database = new Database();

    $conn = $database->getConnection();

    $username = $_POST["username"];
    $pass = $_POST["pword"];

$sql = "SELECT accountname, pass FROM accounts WHERE accountname= '$username' AND pass= '$pass'";
$query = $conn->prepare($sql);
$result = $conn->query($query);

if($result->num_rows == 1){

//Scrub input here. 
// Make a new page that will scrub input for all login pages.

    $row = $result->fetch_assoc();
    $accountname = $row["accountname"];
    $pass = $row["pass"];

    //Probably don't need to store the username and password here.
    //Redirect to the pollster's home page.
}
else if($result->num_rows > 0){
    die("Internal error. Multiple matches for username/password.");
}
else{
    die("Username and/or password do not match."); 
    //Do something other than killing the program here. Should go back to sign-in page.
    //Clear values from username and password text boxes, display the message above in red. 
    // Is there authentication functionality available, like there is in .NET?
}

?>
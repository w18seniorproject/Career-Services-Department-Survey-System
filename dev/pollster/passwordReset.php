<?php
//include db connection file
include_once "../config/pollsterDB.php";

$database = new Database();

$conn = $database->getConnection();

$email = $_POST["email"];

$sql = "SELECT pass, acctName FROM accounts WHERE email = ?;";

$result = $conn->prepare($sql);
$result->execute(array($email));

$numRows = $result->rowCount();

if( numRows == 1){
    $row = $result->fetch(PDO::FETCH_ASSOC);

        $pass = $row['pass'];
        $acctName = $row['acctName'];
        $msg = "Your user name is: " . $acctName . "\nYour password is: " .$pass;
    //This might need to be javascript... Get email address from user. Query database to make sure email address is
    // associated with an account. Send link to email address with hashed (encrypted somehow - hashing every username
    // to ge a match would be bad...) username as a Query String 
    //(start by sending unhashed username, just to make sure it works). When link is clicked, open 
    //"update password" page. Send the same query string along with it, so that the correct account is opened.
    // On the "update password" page, display the username and provide two password boxes.
        mail( $email, "USS Password Reset", $msg );
    }
    else{

        echo "There is no account associated with this email address.";
    }
?>
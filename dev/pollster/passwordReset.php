<?php
//include db connection file
include_once "../config/pollsterDB.php";

$database = new Database();

$conn = $database->getConnection();

$email = _POST["email"];

$sql = "SELECT pass, acctName FROM accounts WHERE email = ?;";

$result = $conn->prepare($sql);
$result->execute(array($email));

$numRows = $result->rowCount();

if( numRows == 1){
    $row = $result->fetch(PDO::FETCH_ASSOC);

        $pass = $row['pass'];
        $acctName = $row['acctName'];
        $msg = "Your user name is: " . $acctName . "\nYour password is: " .$pass;

        mail( $email, "USS Password Reset", $msg );
    }
    else{

        echo "There is no account associated with this email address.";
    }
?>
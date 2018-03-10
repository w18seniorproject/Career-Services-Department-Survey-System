<?php
//include db connection file
include_once "../config/pollsterDB.php";

$database = new Database();

$conn = $database->getConnection();

$known_value = $_POST["known_value"];

//Determine if user input is a valid email address. If not, assume that it is a username.
if(filter_var($known_value, FILTER_VALIDATE_EMAIL) && preg_match('/@.+\./', known_value)){

    $sql = "SELECT acctName, email FROM accounts WHERE email = ?;";
}
else{
    $sql = "SELECT acctName,email FROM accounts WHERE acctName = ?;";
}

//$result is a PDO object, which holds returned records after execute()
$result = $conn->prepare($sql);
$result->execute(array($known_value));

$numRows = $result->rowCount();

// Confirms that one and only one account is associated (1 record returned from query) with the username or email address.
if( $numRows == 1){
    $row = $result->fetch(PDO::FETCH_ASSOC);

        $acctName = $row['acctName'];
        $email = $row['email'];
//Make $msg contain a link to the passwordReset page.
//Create query string containing "acctName", encrypted somehow.

//CHANGE TO CORRECT EXTERNAL LINK
$msg = "Please click on this link to retrieve your username or reset your password: </br><a href= http://localhost:10080/csdss/dev/pollster/passwordReset.html</br></br>Do not reply to this email.";
        //$msg = "Your user name is: " . $acctName . "\nYour password is: " .$pass;
    
        
    // Send link to email address with hashed (encrypted somehow - hashing every username
    // to ge a match would be bad...) username as a Query String 
    //(start by sending unhashed username, just to make sure it works). When link is clicked, open 
    //"update password" page. Send the same query string along with it, so that the correct account is opened.
    // On the "update password" page, display the username and provide two password boxes (do this on front end and back end).
   
    // mail() is secure in this case. User input is validated by account association, and no other user input is 
    // applied to the function.

    //DO SOMETHING WITH THE "FROM" PARAM, SINCE THAT ISN'T OUR EMAIL ADDRESS.
    mail( $email, "USS Password Reset", $msg, "From: webslave@notarealdomain.com" );
    }
    else{

        echo "<h2>There is no account associated with this email address.</h2>";
    }
?>
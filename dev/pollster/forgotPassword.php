<?php
//include db connection file
include_once "../config/pollsterDB.php";

$database = new Database();

$conn = $database->getConnection();

//Either username or password entered by pollster
$known_value = $_POST["known_value"];

//Determine if user input is a valid email address. If not, assume that it is a username.
if(filter_var($known_value, FILTER_VALIDATE_EMAIL) && preg_match('/@.+\./', known_value)){

    $sql = "SELECT acctName, email FROM accounts WHERE email = ?;";
}
else{
    $sql = "SELECT acctName, email FROM accounts WHERE acctName = ?;";
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

//Create random token
$bytes = random_bytes(10);

//Hash the token
$tokenHash = hash("sha256", $bytes, false);

//Set the expiration time to 30 minutes from now
$expiration = date("Y-m-d H:i:s", strtotime("+ 30 minutes"));

//Set linkUsed to false
$linkUsed = false;

echo $expiration;

//Save account info to token table
$sql = "INSERT INTO tokens (acctName, tokenHash, linkUsed, expiration) VALUES (?, ?, ?, ?)";
//$acctName, $tokenHash," .(0). ", $expiration
$stmt = $conn->prepare($sql);

$stmt->bindParam(1, $acctName);
$stmt->bindParam(2, $tokenHash);
$stmt->bindParam(3, $linkUsed);
$stmt->bindParam(4, $expiration);

$stmt->execute();


//CHANGE TO CORRECT EXTERNAL LINK
//ADD QUERY STRING TO LINK
// MAKE SURE YOU CAUSE THE TOKEN TO EXPIRE
$msg = "Please click on this link to retrieve your username or reset your password: </br><a href= http://localhost:10080/csdss/dev/pollster/passwordReset.html</br></br>Do not reply to this email.";
       
    //(start by sending unhashed username, just to make sure it works). When link is clicked, open 
    //"update password" page. Send the same query string along with it, so that the correct account is opened.
    // On the "update password" page, display the username and provide two password boxes (do this on front end and back end).
   
    // mail() is secure in this case. User input is validated by account association, and no other user input is 
    // applied to the function.
    //DO SOMETHING WITH THE "FROM" PARAM, SINCE THAT ISN'T OUR EMAIL ADDRESS.
    mail( $email, "USS Password Reset", $msg, "From: webslave@notarealdomain.com" );
    }
    else{

        echo "<h2>There is no account associated with this user name or email address.</h2>";
    }

?>
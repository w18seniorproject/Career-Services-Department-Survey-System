<?php
//include db connection file
include_once "../config/pollsterDB.php";

$database = new Database();

$conn = $database->getConnection();

//Either username or password entered by pollster
$known_value = $_POST["known_value"];

//Determine if user input is a valid email address. If not, assume that it is a username.
    if(filter_var($known_value, FILTER_VALIDATE_EMAIL)){

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

//Create random token. Using bin2hex so that it can be used in a query string.
$bytes = bin2hex(random_bytes(10));

//Hash the token
$tokenHash = hash("sha256", $bytes, false);

//Set the expiration time to 30 minutes from now
$expiration = date("Y-m-d H:i:s", strtotime("+ 30 minutes"));

//Set linkUsed to false
$linkUsed = false;

//Save account and tokenHash info to token table
$sql = "INSERT INTO tokens (acctName, tokenHash, tokenUsed, expiration) VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bindParam(1, $acctName);
$stmt->bindParam(2, $tokenHash);
$stmt->bindParam(3, $linkUsed);
$stmt->bindParam(4, $expiration);

$stmt->execute();

//CHANGE TO CORRECT EXTERNAL LINK
$msg = "Please click on the link to retrieve your username or reset your password:\n\n http://localhost:10080/csdss/dev/pollster/passwordReset.html?";

$msg .= "token=". $bytes . "\n\nDo not reply to this email.";     
   
    //DO SOMETHING WITH THE "FROM" PARAM, SINCE THAT ISN'T OUR EMAIL ADDRESS.
   mail( $email, "USS Password Reset", $msg, "From: webslave@notarealdomain.com" );

   header("Location: pLogin.html?response=emailSent");
    die();
    }// end if(rows==1)
    else{

    header("Location: forgotPassword.html?response=noAccount");
    die();
    }
?>


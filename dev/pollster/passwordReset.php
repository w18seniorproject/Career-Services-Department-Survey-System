<?php
include_once "../config/pollsterDB.php";

$database = new Database();
$conn = $database->getConnection();
$token = $_GET['token'];

//Make sure token arrived as hexadecimal
if(preg_match('/^[0-9A-Fa-f]$/', $token)){

    $queryHash = hash("sha256", $token, FALSE);

//get record from db
$sql = "SELECT acctName, expiration FROM tokens WHERE tokenHash = ?;";

$result = $conn->prepare($sql);
$result->execute($queryHash);

$numRows = $result->rowCount();

if($numRows == 1){
    $row = $result->fetch(PDO::FETCH_ASSOC);

//IF TOKEN HASN'T EXPIRED...
$expiration = $row['expiration'];

if($expiration < date("Y-m-d H:i:s")){
?>

<script> alert("The link used to access this page has expired. Please try again."); window.location.href='forgotPassword.html'</script>

<?php
}
    $acctName = $row['acctName'];

//MARK TOKEN AS HAVING BEEN USED IN tokens TABLE, or REMOVE THE RECORD FROM THE TABLE. IS THERE A REASON NOT TO DELETE IT?

}else{
    echo "Error. There is no account associated with this Token... or more than one.";
}
    //check token against hashed token
    if($_POST["newPassword"] === $POST["confirmPassword"]){

//INSERT NEW PASSWORD INTO accounts TABLE

    }else{
        echo "Passwords do not match.";
    }
}else{
    echo "Error. Link has been corrupted.";
}
?>
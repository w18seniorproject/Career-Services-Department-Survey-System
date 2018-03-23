<?php
include_once "../config/pollsterDB.php";
//passwordReset included to try to parse query string from its URL.
include_once "passwordReset.html";

$database = new Database();
$conn = $database->getConnection();
//$token = $_GET['token'];
$token = $_SERVER['QUERY_STRING'];

//echo var_dump( $_SERVER['QUERY_STRING']);
//$token = $_POST["$token"];
//$token = $_SERVER["QUERY_STRING"];
var_dump($_SERVER['QUERY_STRING']);
print_r( $_GET );
print_r($_SERVER['QUERY_STRING']);
//Make sure token arrived as hexadecimal
//if(preg_match('/^[0-9A-Fa-f]$/', $token)){
if(1){
    $queryHash = hash("sha256", $token, FALSE);
//TESTING
//echo "queryHash: ". $queryHash;

//TESTING

    //echo "$queryHash: ". var_dump($queryHash);
    //get record from db by matching hashed token received with hashed token that is stored in tokens table.
    $sql = "SELECT acctName, expiration FROM tokens WHERE tokenHash = ?;";

    $result = $conn->prepare($sql);
    $result->execute(array($queryHash));

    $numRows = $result->rowCount();

    if($numRows == 0){
        ?>
        <script>alert(); window.location.href='forgotPassword.html'</script>
        <?php
        /* REMOVED FOR TESTING
    ?>
        <script> alert("The link used to access this page has either expired and been removed from our records, or it is otherwise invalid. Please try again."); window.location.href='forgotPassword.html'</script>
   
        <?php
    */
    }

    if($numRows == 1){
        $row = $result->fetch(PDO::FETCH_ASSOC);

        //If token hasn't expired...
        $expiration = $row['expiration'];

        if($expiration < date("Y-m-d H:i:s")){
        ?>

            <script> alert("The link used to access this page has expired. Please try again."); window.location.href='forgotPassword.html'</script>

        <?php
        // I think this is right. Hopefully it just stops execution on this page, and doesn't kill the whole program.
        die();
        }
        $acctName = $row['acctName'];

    }else{
        echo "Internal error. There is more than one account associated with this Token.";
    }

    if($_POST["newPassword"] === $POST["confirmPassword"]){

        $pwd = $_POST["newPassword"];

        $sql = "UPDATE accounts SET pass = ? WHERE acctName = ?;";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(1, $pwd);
        $stmt->bindParam(2, $acctName);
        $stmt->execute();

        if($stmt->errno){
            echo "Error. Password update failed. " . $stmt->error;
        }
        else{
            echo "Updated {$stmt->mysql_affected_rows} row";

            //Mark token as "used"
            $used = true;

            $sql = "UPDATE tokens SET tokenUsed = ?;";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam($used);
            $stmt->execute();       

            if($stmt->errno){
                echo "Error. Token not updated to 'used'.";
            }
        }
    $stmt->close();

    }else{ 
        echo "Passwords do not match.";
    }
}else{// token was not correctly formatted when it arrived (not hexadecimal)
    echo "Error. Link has been corrupted.";
}

?>
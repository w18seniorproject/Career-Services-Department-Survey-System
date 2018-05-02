<?php

class PasswordReset{
    public static function pReset($db){

        error_reporting(E_ALL);
        
        include_once "../pollster/passwordReset.html";

        if($_SERVER['REQUEST_METHOD'] === 'POST'){
  
            $conn = $db->getConnection('poll');

            if(isset($_POST['token'])){
                $token = $_POST['token'];
            }else{
                http_response_code(400);
                echo "Token not received in passwordReset.php.";
                exit();
            }

            //Make sure token arrived as hexadecimal
            if(preg_match('/^[0-9A-Fa-f]+$/', $token)){

                $queryHash = hash("sha256", $token, FALSE);

                //get record from db by matching hashed token received with hashed token that is stored in tokens table.
                $sql = "SELECT acctName, expiration, tokenUsed FROM tokens WHERE tokenHash = ?;";

                $result = $conn->prepare($sql);
                $result->execute(array($queryHash));

                $numRows = $result->rowCount();

                if($numRows == 0){
                 header("Location: ../pollster/passwordReset.html?error=tokenRemoved");
                 die();
             }

             if($numRows == 1){
                   $row = $result->fetch(PDO::FETCH_ASSOC);

                   //If token hasn't expired...
                   $expiration = strtotime($row['expiration']);
            
                    if($expiration < strtotime(date("Y-m-d H:i:s"))){

                   header("Location: ../pollster/passwordReset.html?error=tokenExpired");
                   die();
                  }

                   $used = $row['tokenUsed'];
                   //Check to see if the token was used previously
                   if($used){

                   header("Location: ../pollster/passwordReset.html?error=tokenUsed");
                   die();
                   }

                  $acctName = $row['acctName'];        

               }else{ //If more than one row is returned from token table query. Should never happen.
                   echo "Internal error. There is more than one account associated with this Token.";
             }     
                  //Make sure newly entered passwords match
            if($_POST["newPassword"] === $_POST["confirmPassword"]){

                $pwd = $_POST["newPassword"];
                $hashedPass = password_hash($pwd, PASSWORD_BCRYPT);

                $sql = "UPDATE accounts SET pass = ? WHERE acctName = ? AND active = '1';";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(1, $hashedPass);
                $stmt->bindParam(2, $acctName);
                $stmt->execute();

                if(!$stmt){
                echo "Error. Password update failed. ";
                exit();

                           }
            else{

                echo "<h2>The password associated with account name \"$acctName\" has been updated.</h2>";
                
                //Mark token as "used"
                $used = true;

                $sql = "UPDATE tokens SET tokenUsed = ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(1, $used);
                $stmt->execute();       

                if(!$stmt){
                    echo "Error. Token not updated to 'used'.";
                }else{

                header("Location: ../pollster/passwordReset.html?response=success");
                }
              }
              $stmt = null;

        
               }else{ 
                  echo "Passwords do not match.";
              }
         }else{// token was not correctly formatted when it arrived (not hexadecimal)
              echo "Error. Link has been corrupted.";
           }

        }else{
          http_response_code(400);
         exit();
        }
    }
}
?>
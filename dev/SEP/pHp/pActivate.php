<?php
/* When a new account is created, a link must be clicked by the creator, which directs them to this page.
The token is authenticated, and the account changed to "active". Inactive accounts are deleted if anything goes wrong
with activation.*/
class AccountActivate{
    public static function pActivate($db){
        $conn = $db->getConnection('poll');

        if(isset($_POST['token'])){
            $token = $_POST['token'];
        }else{
            http_response_code(400);
            echo "Token not received in pActivate.php.";
            AccountActivate::deleteInactive($db, $conn);
            return;
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
                AccountActivate::deleteInactive($db, $conn);
                header("Location: ./pollster/pActivate.html?error=tokenRemoved");
                return;
            }

            if($numRows == 1){
                $row = $result->fetch(PDO::FETCH_ASSOC);

                //If token hasn't expired...
                $expiration = strtotime($row['expiration']);

                if($expiration < strtotime(date("Y-m-d H:i:s"))){
                    AccountActivate::deleteInactive($db, $conn);
                    header("Location: ./pollster/pActivate.html?error=tokenExpired");
                    return;
                }

                $used = $row['tokenUsed'];
                //Check to see if the token was used previously
                if($used){
                    header("Location: ./pollster/pActivate.html?error=tokenUsed");
                    return;
                }

                $acctName = $row['acctName'];        
                $true = 1;

                $sql = "UPDATE accounts SET active = ? WHERE acctName = ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(1, $true);
                $stmt->bindParam(2, $acctName);
                $stmt->execute();

                if(!$stmt){
                    echo "Internal error. Account activation failed. Please try again.";
                    AccountActivate::deleteInactive($db, $conn);
                    return;
                }else{ //$stmt executed correctly

                $stmt = null;
                //Mark token as "used", and redirect to the pollster dashboard:
                $used = true;

                $sql = "UPDATE tokens SET tokenUsed = ?;";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(1, $used);
                $stmt->execute();       

                if(!$stmt){//token update failed
                    echo "Internal error. Token not updated to 'used'.";
                }
                //This account has been set to "active". Get rid of all accounts that are not.
                AccountActivate::deleteInactive($db, $conn);

                //Everything is ok, so redirect to dashboard:
                //session_start();
                session_destroy();
                session_start();

                $_SESSION["userName"] = $acctName;

                header("Location: ./pollster/pDashboard.html?view=first"); 
                return;
            } //$stmt executed correctly
            //More than one row is returned from token table query. Should never happen.
            }else{ 
                echo "Internal error. There is more than one account associated with this Token.";
                AccountActivate::deleteInactive($db, $conn);                
                return;
            } 
        }else{// token was not correctly formatted when it arrived (not hexadecimal)
            echo "Error. Link has been corrupted.";
            AccountActivate::deleteInactive($db, $conn);
            return;
        }//last else     
    }//end pActivate
         
    //Deletes accounts when activation fails, to prevent primary key error from being thrown by the database.
    private static function deleteInactive($db, $conn){
        $sql = "DELETE FROM accounts WHERE active = 0;";
        $del = $conn->prepare($sql);
        $del->execute();

        if(!$del){
            echo "Internal error. Inactive accounts were not deleted from accounts table.";
        }
    }//end deleteInactive()    
}//end class
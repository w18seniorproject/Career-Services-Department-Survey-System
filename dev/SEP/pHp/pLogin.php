<?php
/*Validates pollster (survey administrator) login information, and redirects to their dashboard if ok.*/
    class PollsterLogin {
        public static function login($db){

            $conn = $db->getConnection('poll');

            $username = $_POST["username"];

            $pass = $_POST["pword"];
          
            $sql = "SELECT pass FROM accounts WHERE acctName= ? AND active = '1';";

            $result = $conn->prepare($sql);
            $result->execute(array($username));

            if($result->rowCount() == 1){

                $row = $result->fetch(PDO::FETCH_ASSOC);
                $hash = $row["pass"];

                if(!password_verify($pass, $hash)){
                    header("Location: ./pollster/pLogin.html?error=wrongAuth");
                    return;
                }
                else{
                    session_destroy();
                    session_start();
                    $_SESSION["userName"] = $username;
                    header("Location: ./pollster/pDashboard.html");
                    return;
                }
            }
            else if($result->rowCount() > 0){
                header("Location: ./pollster/pLogin.html?error=notUnique");
                return;
            }
            else{
                header("Location: ./pollster/pLogin.html?error=wrongAuth");
                return; 
            }     
        }
    }
<?php
    class TakerLogin{
        public static function login($db){
            $conn = $db->getConnection('taker');
            $pin = new pin($conn);
            $survey = json_decode($pin->getPin($_POST['pin']), true);

            if(isset($survey['surName']) && isset($survey['acctName'])){
                $surveyname = $survey['surName'];
                $account = $survey['acctName'];
            }
            elseif(isset($survey['message'])){
                if($survey['message'] === 'notUni'){
                    header("Location: uLogin.html?error=notUnique");
                    exit("We messed up. Pins aren't unique");
                    //THIS SHOULD NEVER HAPPEN
                }elseif($survey['message'] === 'badPin'){
                    header("Location: uLogin.html?error=wrongPin");
                    exit();
                }
            }
            else{
                http_response_code(500);
                exit();
                //THIS SHOULD NEVER HAPPEN
            }

            session_unset();
            $_SESSION["surName"] = $surveyname;
            $_SESSION["acctName"] = $account;

            header("Location: uSurvey.html");
            exit();
        }
    }


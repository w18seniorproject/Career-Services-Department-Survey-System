<?php
    /** 
     * Response Class: 
     *  Holds a static function that inserts new responses to a survey into the
     *  DB and updates the proper notifications table.
     **/
    class Response{ 
        private $conn;
        private $table = "results";
        
        private function __construct($db){
            $this->conn = $db->getConnection('taker');
        }
        
        //Static function to send responses to DB/update notifcations
        public static function sendResponse($db, $surResults, $rLevel){
            $acctName = $_SESSION['acctName'];

            $resp = new Response($db);
            $resStmt = $resp->buildRespQuery($surResults, $rLevel);
            $resStmt->execute();
            
            $notifObject = "~`#" . json_encode(array('nType' => 'response', 'surName' => $_SESSION['surName']), JSON_FORCE_OBJECT);
            $notStmt = $resp->buildNotQuery($notifObject, $acctName);
            $notStmt->execute();

            unset($_SESSION['startTime']);
        }
        
        //Helper function that builds the response table query for sendResponse
        private function buildRespQuery($surResults, $rLevel){
            if(isset($_SESSION["surName"]) && isset($_SESSION["acctName"])){
                if(!isset($_SESSION["groupName"])){
                    $_SESSION["groupName"] = "None";
                }
                $startTime = $_SESSION['startTime'];
                $time = time() - $startTime;
                $query = "INSERT INTO " . $this->table . " (surName, groupName, surResults, rLevel, acctName, time) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);

                $stmt->bindParam(1, $_SESSION["surName"]);
                $stmt->bindParam(2, $_SESSION["groupName"]);
                $stmt->bindValue(3, $surResults);
                $stmt->bindValue(4, $rLevel);
                $stmt->bindValue(5, $_SESSION["acctName"]);
                $stmt->bindValue(6, $time);

                return $stmt;			
            }
            else{
                throw new Exception('Variable not set.');
            }
        }
        
        //Helper function that builds the notifications table query for sendResponse
        private function buildNotQuery($notifObject, $acctName){
            $sql = "UPDATE notifications SET count=count+1, notifications=CONCAT(notifications, ?) WHERE acctName=?;";
            $stmt = $this->conn->prepare($sql);
            
            $stmt->bindParam(1, $notifObject);
            $stmt->bindParam(2, $acctName);
                
            return $stmt;
        }
    }		
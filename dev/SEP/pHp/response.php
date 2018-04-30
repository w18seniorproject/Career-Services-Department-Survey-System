<?php
    class Response{ 
        private $conn;
        private $table = "results";
        
        private function __construct($db){
            $this->conn = $db->getConnection('taker');
        }
        
        public static function sendResponse($db, $surResults, $rLevel){
            $resp = new Response($db);
            $stmt = $resp->buildQuery($surResults, $rLevel);
            $stmt->execute();
            unset($_SESSION['startTime']);
        }
        
        private function buildQuery($surResults, $rLevel){
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
    }

	
					
					
					

					
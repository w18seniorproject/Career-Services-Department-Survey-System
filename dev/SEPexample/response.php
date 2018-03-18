<?php
    class Response{ 
        private $conn;
        private $table = "results";
        
        public function __construct($db){
            $this->conn = $db->getConnection('taker');
        }
        
        public static function sendResponse($db, $surResults, $rLevel){
            $resp = new Response($db);
            $stmt = $resp->buildQuery($surResults, $rLevel);
            $stmt->execute();
            session_unset();
            header("Location: uLogin.html");
            exit();
        }
        
        private function buildQuery($surResults, $rLevel){
            if(isset($_SESSION["surName"]) && isset($_SESSION["groupName"]) && isset($_SESSION["acctName"])){
                $query = "INSERT INTO " . $this->table . " (surName, groupName, surResults, rLevel, acctName) VALUES (?, ?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);

                $stmt->bindParam(1, $_SESSION["surName"]);
                $stmt->bindParam(2, $_SESSION["groupName"]);
                $stmt->bindValue(3, $surResults);
                $stmt->bindValue(4, $rLevel);
                $stmt->bindValue(5, $_SESSION["acctName"]);

                return $stmt;			
            }
            else{
                throw new Exception('Variable not set.');
            }
        }
    }

	
					
					
					

					
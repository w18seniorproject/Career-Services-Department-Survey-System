<?php
    class Pin{ 
        private $conn;
        private $table = "pins";

        public function __construct($conn){
            $this->conn = $conn;
        }

        public function getUniquePin($stmt){
            $checkPin = true;
            while($checkPin){
                $pin = random_int(1000, 9999);
                $stmt->execute(array($pin));
                $checkPin = ($stmt->rowCount() > 0);
            }
            return $pin;
        }

        public function getPin($pin){
            try{
                $stmt = $this->buildQuery($pin);
            }catch(Exception $e){
                return json_encode(array("message" => $e->getMessage()));
            }
            
            $stmt->execute();
            
            $rNum = $stmt->rowCount();
            
            if($rNum === 1){ 
                $row = $stmt->fetch(PDO::FETCH_ASSOC);	
                extract($row);

                $pin=array(
                    "pin" => $pin,
                    "surName" => $surName,
                    "groupName" => $groupName,
                    "acctName" => $acctName
                );
                return json_encode($pin);	
            }	 
            else{
                if($rNum > 1){
                    //THIS SHOULD NEVER HAPPEN
                    return json_encode(array("message" => "notUni"));
                }
                else{
                    return json_encode(array("message" => "badPin"));
                }
            }
        }

        private function buildQuery($pin){
            $query = "SELECT * FROM " . $this->table;

            if(isset($pin)){
                $query = $query . " WHERE pin = ? AND live = 1";	

                $stmt = $this->conn->prepare($query);

                $stmt->bindValue(1, $pin);

                return $stmt;			
        }
            else{
                throw new Exception('Variable not set.');
            }
        }
    }
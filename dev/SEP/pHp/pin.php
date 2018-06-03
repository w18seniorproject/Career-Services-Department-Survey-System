<?php
    /** 
     * Pin Class: 
     *  Holds static functions for unique pin generation and for retrieving 
     *  survey/acct combinations based on a given pin.
     **/
    class Pin{ 
        private $conn;
        private $table = "pins";

        private function __construct($conn){
            $this->conn = $conn;
        }
        
        //Static function that generates a unique pin
        public static function getUniquePin($stmt){
            $checkPin = true;
            while($checkPin){
                $pin = random_int(1000, 9999);
                $stmt->execute(array($pin));
                $checkPin = ($stmt->rowCount() > 0);
            }
            return $pin;
        }
        
        //Static function that retrieves a survey info based on a given pin
        public static function getPin($db, $pin){
            $pinClass = new Pin($db->getConnection('taker'));
            try{
                $stmt = $pinClass->buildQuery($pin);
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
        
        //Helper function the builds a DB query for getPin
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
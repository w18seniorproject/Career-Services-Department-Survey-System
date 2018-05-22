<?php
	class bannedAccount{ 
		private $conn;
		private $table = "bans";
		
		public $email;
		public $desc;
		
		public function __construct($db){
			$this->conn = $db;
		}
		
		public function getBans($email){
			$stmt = $this->buildQuery($email);
		 
			$stmt->execute();
		 
			return $stmt;
		}
		
		private function buildQuery($email){
			$query = "SELECT * FROM " . $this->table;
			
			if(isset($email)){
				$query = $query . " WHERE email = ?";	
				
				$stmt = $this->conn->prepare($query);
				
				$stmt->bindValue(1, $email);
				
				return $stmt;			
			}
			else{
				throw new Exception('Variable not set.');
			}
		}
	}
?>
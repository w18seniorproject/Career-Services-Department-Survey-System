<?php
	class Database
	{
		private $host = 'localhost';
		private $db   = 'csdss';
		private $user = 'surveytaker';
		private $pass = 'surveytaker';
		private $charset = 'utf8';

		private $opt = 
			[
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES   => false,
			];
			
		public $dbCon = null;
		
		public function getConnection()
		{
			$dsn = "mysql:host=$this->host;port=3306;dbname=$this->db;charset=$this->charset";
					
			try
			{
				$this->dbCon = new PDO($dsn, $this->user, $this->pass, $this->opt);
			}
			catch(PDOException $exc)
			{
				echo "Connection Error: " . $exc->getMessage();
			}
			return $this->dbCon;
		}
	}
?>
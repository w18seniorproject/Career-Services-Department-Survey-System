<?php
    class Database{
        private $host = 'localhost';
        private $db   = 'csdss';
        private $charset = 'utf8';

        private $opt = 
                [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                ];

        public $dbCon = null;

        public function getConnection($type){
                $dsn = "mysql:host=$this->host;port=3306;dbname=$this->db;charset=$this->charset";

                try{
                    if($type === 'taker'){
                        $user = 'surveytaker';
                        $pass = 'surveytaker';
                    }    
                    elseif($type === 'poll'){
                        $user = 'pollster';
                        $pass = 'pollster';
                    }
                    else{
                        throw new PDOException('No proper account type found.');
                    }
                    $this->dbCon = new PDO($dsn, $user, $pass, $this->opt);
                } catch(PDOException $exc){
                        echo "Connection Error: " . $exc->getMessage();
                }
                return $this->dbCon;
        }
    }
?>

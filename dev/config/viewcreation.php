<?php
	class ViewCreator
	{
		private static $host = 'localhost';
		private static $db   = 'csdss';
		private static $user = 'viewAdmin'; //Obviously these need to be changed to whatever we end up using
		private static $pass = 'viewAdmin'; // ^ See above ^
		private static $charset = 'utf8';

		private static $opt = 
			[
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES   => false,
			];
		
		public static function createView($account)
		{
			$dsn = "mysql:host=" . self::$host . ";port=3306;dbname=" . self::$db . ";charset=" . self::$charset;
					
			try
			{
				$pdo = new PDO($dsn, self::$user, self::$pass, self::$opt);
			}
			catch(PDOException $exc)
			{
				echo "Connection Error: " . $exc->getMessage();
			}
			
			$query = <<<EOT
				CREATE VIEW surveytaker
				AS 
				SELECT 
					questions.surveyname AS surveyname,
					questions.questnum AS questnum, 
					questions.questiontype AS questiontype, 
					questions.questiontext AS questiontext, 
					questions.answerone AS answerone, 
					questions.answertwo AS answertwo, 
					questions.answerthree AS answerthree, 
					questions.answerfour AS answerfour, 
					questions.questionanswer AS questionanswer, 
					questions.questionweight AS questionweight, 
					questions.relationlevel AS relationlevel, 
					questions.relationname AS relationname
				FROM questions
				WHERE questions.account = "$account";
EOT;
			$stmt = $pdo->prepare($query);
			$stmt->execute();
			
			$query = "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE $account TO '$account'@'%'";
			$stmt = $pdo->prepare($query);
			$stmt->execute();
		}
	}
?>

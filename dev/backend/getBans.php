<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	 
	include_once '../config/takerDB.php';
	include_once '../objects/bannedAccount.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	
	if($_SERVER['REQUEST_METHOD'] == 'GET'){
		try{
			$bans = new bannedAccount($db);
	
			$stmt = $bans->getBans($_GET['email']);

			$num = $stmt->rowCount();
			
			//there shouldn't be more than one ban per email, so we can probably alter the code
			//here to expect only a single entry. I left as is for now, just in case.
			if($num > 0){ 
				$resultsArr=array();
			 
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){	
					extract($row);
			 
					$ban=array(
						"email" => $email,
						"desc" => $desc,
					);
					$bansArr[] = $ban;
				}
				echo json_encode($bansArr);	
			}	 
			else{
				echo json_encode(array("message" => "No results."));
			}
		}
		catch(Exception $exc){
			http_response_code(400);
			echo "Error: " . $exc->getMessage();
			break;
		}
		http_response_code(200);
	}
	else{
		http_response_code(400);
	}
?>
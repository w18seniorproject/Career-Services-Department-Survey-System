<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	 
	include_once '../config/pollsterDB.php';
	include_once '../objects/result.php';
	 
	$database = new Database();
	$db = $database->getConnection();
	
	if($_SERVER['REQUEST_METHOD'] == 'GET'){
		try{
			$questions = new Question($db);
	
			$stmt = $questions->getQuestions($_GET['surName'], $_GET['groupName']);

			$num = $stmt->rowCount();
			 
			if($num > 0){ 
				$resultsArr=array();
			 
				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){	
					extract($row);
			 
					$result=array(
						"recNum" => $recNum,
						"surName" => $surName,
						"groupName" => $groupName,
						"surResults" => $surResults,
						"rLevel" => $rLevel
					);
					$resultsArr[] = $result;
				}
				echo json_encode($resultsArr);	
			}	 
			else{
				echo json_encode(array("message" => "No results."));
			}
		}
		catch(Exception $exc){
			http_response_code(400);
			echo "Error: " . $exc->getMessage();
			exit();
		}
		http_response_code(200);
	}
	else{
		http_response_code(400);
	}
?>
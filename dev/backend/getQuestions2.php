<?php
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");

	include_once '../config/takerDB.php';
	include_once '../objects/question.php';

	$database = new Database();
	$db = $database->getConnection();

	if($_SERVER['REQUEST_METHOD'] == 'GET'){
		try{
			$questions = new Question($db);

			$stmt = $questions->getQuestions($_GET['surName'], $_GET['acctName']);

			$num = $stmt->rowCount();

			if($num>0){
				$questionsArr=array();

				while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
					extract($row);

					$question=array(
						"surName" => $surName,
						"qNum" => $qNum,
						"qType" => $qType,
						"qText" => $qText,
						"qChoices" => $qChoices,
						"qAns" => $qAns,
						"qWeight" => $qWeight,
						"rLevel" => $rLevel,
						"rName" => $rName,
						"acctName" => $acctName
					);
					$questionsArr[] = $question;
				}
				echo json_encode($questionsArr);
			}
			else{
				echo json_encode(array("message" => "No questions."));
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

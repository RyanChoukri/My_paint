<?php
	/*var_dump($_POST['myData']);*/
        try
        {
            $database = new PDO('mysql:dbname=my_paint;' .
            'host=127.0.0.1;charset=utf8', 'root', '');
			$up = $database->prepare('UPDATE live SET json = :json WHERE id = 1');
			$up->execute(['json' => $_POST['myData']]);
        }
        catch (Exception $e)
        {
        	return;
        }


?>
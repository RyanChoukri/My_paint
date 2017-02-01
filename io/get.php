<?php
	/*var_dump($_POST['myData']);*/
        try
        {
            $database = new PDO('mysql:dbname=my_paint;' .
            'host=127.0.0.1;charset=utf8', 'root', '');


			$all = $database->prepare('SELECT json FROM live');
			$all->execute();
			echo $all->fetchColumn();
        }
        catch (Exception $e)
        {
        	return;
        }


?>
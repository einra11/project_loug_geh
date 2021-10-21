<?php
    require 'connection.php';

    $query = "SELECT * FROM tb_items ORDER BY id ASC";
  
    $result = mysqli_query($connection, $query);
    $rows = array();

    if($result){
        while($table = mysqli_fetch_assoc($result)) {
            $rows[] = $table;
        }

        print json_encode([ 'status' => 1, 'dataEvents' => $rows ]);
    } else {
        echo json_encode([ 'status' => 2]);
    }
?>
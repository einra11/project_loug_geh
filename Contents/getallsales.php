<?php
    require 'connection.php';

    $query = "SELECT * FROM tb_trans ORDER BY id DESC";
  
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
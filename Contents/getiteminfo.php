<?php
    require 'connection.php';

    if($_POST['pcode']){
        $prd_code = $_POST['pcode'];
        $prd_qty = $_POST['itmcnt'];

        $query = "SELECT * FROM tb_items WHERE item_code = '$prd_code' AND item_stock >= '$prd_qty' ";
        $result = mysqli_query($connection, $query);
        $rows = array();
        
  
        if($result){
            while($table = mysqli_fetch_assoc($result)) {
                $rows[] = $table;
            }
    
            print json_encode([ 'status' => 1, 'dataEvents' => $rows ]);
            }
        else {
            echo json_encode([ 'status' => 2]);
            }
    }
?>
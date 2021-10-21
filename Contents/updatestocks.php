<?php
    require 'connection.php';

    if($_POST['pcode']){
        $prd_code = $_POST['pcode'];
        $newStock = $_POST['newStock'];
        

        $query = "UPDATE tb_items SET item_stock = '$newStock' WHERE item_code = '$prd_code'";


        $result = mysqli_query($connection, $query);
        
        if($result){
            print json_encode(['status' => 1]);
            }
        else {
            echo json_encode([ 'status' => 2]);
            }
    }
?>
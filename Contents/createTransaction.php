<?php
    require 'connection.php';
    $rows = array();

    if($_POST['tran_code']){
        $c_name = $_POST['cust_name'];
        $c_address = $_POST['cust_address'];
        $c_ctn = $_POST['cust_ctn'];
        $tran_code = $_POST['tran_code'];
        $tran_desc = $_POST['tran_desc'] . " Paid in Cash";
        $tran_prod_code = $_POST['prod_code'];
        $tran_prdqty = $_POST['tran_prdqty'];


        $query2 = "SELECT * FROM tb_customers WHERE cust_name = '$c_name' AND cust_address = '$c_address';";

        $result = mysqli_query($connection,$query2);

        // print_r ($result);

        if (mysqli_num_rows($result) <= 0){
            $query = "INSERT INTO tb_customers (id, cust_name, cust_address, cust_ctn) 
            VALUES (NULL, '$c_name', '$c_address', '$c_ctn');";
            $result = mysqli_query($connection, $query);
        }


        $query3 = "UPDATE tb_or SET or_cnt = (SELECT or_cnt FROM tb_or) + 1;";
        $result = mysqli_query($connection, $query3);

        $result = mysqli_query($connection, 'SELECT or_cnt FROM tb_or');

        $tran_or = implode(" ",mysqli_fetch_row($result)) . strval($tran_code) ;
        
        $date = date("Y-m-d H:i:s");
  
        $query4 = "INSERT INTO tb_trans (id, tran_code, tran_c_name, tran_desc, item_code, item_qty, tran_OR, tran_created) 
        VALUES (NULL, '$tran_code', '$c_name', '$tran_desc', '$tran_prod_code', '$tran_prdqty', '$tran_or', '$date');";

        $result = mysqli_query($connection, $query4);
  
        if($result){
            echo json_encode([ 'status' => 1 ]);
            }
        else {
            echo json_encode([ 'status' => 2]);
            }
        }
?>
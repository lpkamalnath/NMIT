<?php 
    include 'connection.php';
    

    if(isset($_POST['search'])){
        $search = strtolower($_POST['search']);
        //"select * from farmer_stock where LOWER(product_name) = '$search'";
        $sql = "select farmer_info.farmer_name, farmer_info.farmer_type, farmer_info.farmer_email_id, farmer_info.farmer_phone_number, farmer_info.farmer_district, farmer_info.farmer_state, 
        farmer_info.farmer_state, farmer_stock.product_name, farmer_stock.stock_qty from farmer_info inner join farmer_stock on farmer_info.farmer_id = farmer_stock.farmer_id where product_name = '$search'";
        $result = mysqli_query($con,$sql);
        $result_array = array();
        if(mysqli_num_rows($result) > 0){
            while($row = mysqli_fetch_assoc($result)) {
               $result_array[] = $row; 
            }
            echo json_encode($result_array);
            //echo $_POST['sea'];
        }
        else{
            echo("Error description: " . mysqli_error($con));
        } 
    }
    else{
        echo "not running";
    }

?>
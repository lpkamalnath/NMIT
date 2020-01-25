<?php 
    include 'connection.php';
     
    if(isset($_POST['code'])){
        $name = $_POST['bname'];
        $phone = $_POST['bphone'];
        $id = sha1($name);
        $code = $_POST['code'];
        $area = $_POST['barea'];
        $state = $_POST['stt'];
        $city  = $_POST['bcity'];
        $email = $_POST['bemail'];
        $lat = $_POST['latitude'];
        $lon = $_POST['longitude'];

        $sql = "INSERT INTO buyer_reg VALUES ('$id', '$code', '$name','$state','$city','$phone','$lat','$lon','$area','$email')";
        if(mysqli_query($con,$sql)){
            echo "Records inserted successfully.";
        }
        else{
            echo("Error description: " . mysqli_error($con));
        }
    }
?>
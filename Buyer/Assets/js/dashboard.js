var SearchString = '';

$(document).ready(function () {
    console.log("read");
    var url_string = window.location.href;
    url_string = decodeURI(url_string);
    var url = new URL(url_string);
    SearchString = url.searchParams.get("search");

    $("#searchData").on('submit',function(e){
        $('#products tbody').empty();
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'dashData.php',
            data: $('form').serialize(),
            success: function (d) {
                d = JSON.parse(d);
                var len = d.length;
                console.log(len);
                for(var i=0; i<len;i++){
                   var  tr_row = "<tr>" +
                   "<td>" + d[i].farmer_name + "</td>" +
                   "<td>" + d[i].farmer_type + "</td>" +
                   "<td>" + d[i].farmer_email_id + "</td>" +
                   "<td>" + d[i].farmer_phone_number + "</td>" +
                   "<td>" + d[i].farmer_district + "</td>" +
                   "<td>" + d[i].farmer_state + "</td>" +
                   "<td>" + d[i].product_name + "</td>" +
                   "<td>" + d[i].stock_qty + "</td>" +
                   "</tr>";
                   $("#products tbody").append(tr_row);
                }
            },
            error: function(request,error){
                alert(error);
              }

          });
    });

});
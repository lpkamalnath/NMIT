
var GroceryTemplate = $.trim($('#divgrocerylist').html());
var subtotalTemplate = $.trim($('#SubtotCalc').html());
var headerTemplate = "";


$(document).ready(function () {
    $.ajax({
        url: "Header.html",
        dataType: "html",
        async: false,
        success: function (data) {
            headerTemplate = $(data).filter("#headercontainer").html();
        }
    });

    $('body').on('click', '#agentContainer', function (event) {
        event.stopPropagation();
    });
    $('body').on('click', '#callCenterContainer', function (event) {
        event.stopPropagation();
    });
    $('body').on('click', function (e) {
        $('#divsearchkey').css('display', 'none');
        var elem, style;
        elem = document.querySelector('.site-nav');
        style = getComputedStyle(elem);
        if ($('.navbar-toggle').is(":checked")) {
            $('.dropdown-submenu .show').removeClass("show");
            $(".dropdown-menu").closest("ul").first().toggle();
            //$('.navbar-nav .dropdown-menu').css('position', 'absolute')
        }
        if (style.left == '0px') {
            $('.navbar-toggle').prop('checked', false);
        }
        var
            $popover,
            $target = $(e.target);

        //do nothing if there was a click on popover content
        if ($target.hasClass('popover') || $target.closest('.popover').length) {
            return;
        }

        $('[data-toggle="popover"]').each(function () {
            $popover = $(this);

            if (!$popover.is(e.target) && $popover.has(e.target).length === 0 &&
                $('.popover').has(e.target).length === 0) {
                $popover.popover('hide');
            }
            else if ($popover.is(e.target)) {
                if ($('#popover-content:visible').length > 0)
                    $popover.popover('hide');
            }

            else {
                $popover.popover('toggle');
            }
        });
    });
    MenuBarService();
    BindFooter();
    GetFavicon();
    BindHeaderCart();
    GetBranchDetails();
    SetAddressLocation();
    shopByCategory();
    GetRemainingCredit();
    SetMoveContentHeight();

    $(function () {
        $('[data-toggle="popover"]').popover({
            html: true,
            content: function () {
                $('#popover-content').find('.form-inline').removeClass('was-validated');
                return $('#popover-content').html();
            }
        });
    });

    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');


        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });
    $("#txtSearch").focus(function () {
        $(".headerNav #divelement").css("border", "1px solid #729133");
        $(".headerNav #divelement").css("border-left-color", "transparent");
    });
    $("#txtSearch").focusout(function () {
        $(".headerNav #divelement").css("border", "1px solid lightgray").css('border-left', 'none');
    });
    $('#txtSearch').on('keypress', function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
            if ($('#txtSearch').val() == '' || $('#txtSearch').val() == 'undefined') {
                $('#divsearchkey').css('display', 'block');
                $('#spnSearchKey').text("Please Enter Search Keyword.");
                return false;
            }
            else {
                window.location.href = '/HTML/CategoryProducts.html?' + $('#txtSearch').val() + '&Search';
            }
        }
    });
    HideLoading();
    //e = jQuery.Event("keypress")
    //e.which = 13 //choose the one you want
    //$("#txtSearch").keypress(function () {
    //    window.location.href = '/HTML/CategoryProducts.html?' + $('#txtSearch').val() + '&Search';

    //}).trigger(e)
});

function SetMoveContentHeight() {
    $('.movecontent').css("max-height", $(window).height() - $('#headercontainer').height());
    $('#ProductHeight').css("max-height", $(window).height() - $('#headercontainer').height());
    
}

function MenuBarService() {
    var obj = { isQuickfilter: true };
    $.ajax({

        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/LoadData",
        //data: "{}",
        data: JSON.stringify(obj),
        dataType: "json",
        success: function (Result) {

            quickfilterstream = JSON.parse(Result.d);
            bindHeader();
            bindmenu(quickfilterstream);
        },
        error: function (Result) {
            alert("Error");
        }
    });
}

function bindmenu(menustream) {
    var mainmenuTemplate = $.trim($('#mainmenuTemplate').html());
    for (var q = 0; q < quickfilterstream.length; q++) {
        var mainmenutemp = undefined;
        mainmenutemp = mainmenuTemplate.replace(/{{CategoryID}}/ig, quickfilterstream[q].CategoryID)
            .replace(/{{Category}}/ig, quickfilterstream[q].Category)
            .replace(/{{CategoryID}}/ig, quickfilterstream[q].CategoryID);
        $('#divmainmenu').append(mainmenutemp);
        //$('[id="divmainmenu_' + quickfilterstream[q].CategoryID + '"]').append(mainmenutemp);
    }
}

function bindHeader() {
    //headerTemplate = $.trim($('#headerTemplate').html());
    $('#headercontainer').append(headerTemplate);

    $('#lnk_logo').attr("href", "/index.html");
    $('#lnk_savedList').attr("href", "Wishlist.html");
    $('#icon').attr("href", "Cart.html");
    $("[id^='navaccountDetails']").attr("href", "AccountDetails.html");
    $('#lnk_login').attr("href", "SignIn.html");
    $('#lnk_signup').attr("href", "Home.html");
    GetLogonUser();
    GetOrgDetails();
    GetSalesAgentDetails();
}

function HeaderChange() {
    $("div[id^='UserLogin']").css('display', 'none');
    $("div[id^='UserName']").css('display', '');
    $("div[id^='Cart_Empty']").css('display', 'none');
    $("div[id^='chat']").css('display', 'none');
    $("div[id^='savedList']").css('display', '');
    $("div[id^='cart']").css('display', '');
    $("div[id^='credit']").css('display', '');
    $("div[id^='customerLocation']").css('display', '');
    $("div[id^='agentContainer']").css('display', 'inline-block');
    $('[id^="Mangeaccount"]').css('display', '');
}

function GetFavicon() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetFavicon",
        dataType: "json",
        success: function (Result) {
            //$("#favicon")[0].href = '/Assets/img/logo.png';
            $("#favicon")[0].href = Result.d;
        },
        error: function (Result) {
            //alert("Error");
        }
    });
}

function showMessage(message) {

    swal.fire({
        //title: "Are you sure?",
        text: message,
        type: "warning",
        confirmButtonColor: '#729133',
        //showCancelButton: true,
        //confirmButtonClass: "btn-danger",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: false
    });
}

function showSuccessMessage(message) {
    swal.fire({
        //title: "Are you sure?",
        text: message,
        type: "success",
        confirmButtonColor: '#729133',
        //showCancelButton: true,
        //confirmButtonClass: "btn-danger",
        //confirmButtonText: "Yes, delete it!",
        //closeOnConfirm: false
    });
}

function GetLogonUser() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetLogonUser",
        dataType: "json",
        success: function (Result) {
            $('[id^="spnlogonuser"]').html(Result.d);
        },
        error: function (Result) {
            showMessage(Result.statusText);
        }
    });
}
//<li><a href="/HTML/PartnerWithUS.html">Partner with us</a></li>
//<li><a href="/HTML/JoinMitra.html">Join Mitra</a></li>
function BindFooter() {
    //var FooterTemplate = $.trim($('#FooterTemplate').html());
    $('#Footer').append('<div class="col-sm-12 col-sm-12" style="position: inherit !important;">\
        <footer class= "footer-bg">\
        <div class="">\
            <div class="row">\
                <div class="col-md-3 col-sm-6 footerdiv">\
                   <div class="footer-logo"  style="text-align:center;">\
                        <a href="# ">\
                            <img class="mandeefooter" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG0AAABOAQMAAAAQDgqNAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABJJREFUeNpjYBgFo2AUjILBAgAEkgABCoK5SwAAAABJRU5ErkJggg==">\
                                </a>\
                                    <div id="socialmedia" style="margin-top:10px;">\
                                    <a href="https://www.facebook.com/MandeeOnline" target="_blank"><img class="facebook" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQAQMAAADK/wYcAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYKAMAAAAQAABicmvQwAAAABJRU5ErkJggg==" width="16" height="16"></a>\
                                    <a href="https://www.youtube.com/channel/UClKe9znc6rQaP1j2wP1xRkw?view_as=subscriber" target="_blank"><img class="youtube-1" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==" width="16" height="16"></a>\
                                    <a  href="https://www.linkedin.com/company/mandee-online" target="_blank"><img class="linkedin" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==" width="16" height="16"></a>\
                                    <a  href="https://twitter.com/MandeeOnline" target="_blank"><img class="twitter" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==" width="16" height="16"></a>\
                                    </div>\
                            </div>\
                    </div>\
                <div class="col-md-2 col-sm-6 col-xs-6 footerdiv" id=divfooter3>\
                        <div class="footer-menu d-flex footerclass" id="divAbout">\
                            <ul>\
                                <h3></h3>\
                                <li><h3><a style="font-size:14px !important;" href="/HTML/AboutUS.html">About Us</a></h3> </li>\
         <li><a href="/HTML/TermsAndUse.html">Terms of use</a></li>\
                                <li><a href="/HTML/PrivacyPolicy.html">Privacy policy</a></li>\
                            </ul>\
                    </div>\
</div>\
                    <div class="col-md-2 col-sm-6 col-xs-6 footerdiv" id=divfooter2>\
<div class="footer-menu d-flex footerclass" id="divMoreInfo">\
<ul>\
                             <h3></h3 >\
        <li><h3> <a style="font-size:14px !important;" href="/HTML/FAQ.html">FAQs</a></h3></li >\
        <li><a href="/HTML/WorkWithUS.html">Work with us</a></li>\
        <li><a href="/HTML/ContactUS.html">Contact Us</a> </li>\
        <li><a href="/HTML/NewsPage.html">News Page</a> </li>\
                            </ul >\
</div >\
                    </div >\
        <div class="col-md-5 col-sm-6 col-xs-12 mt-sm-30">\
                        <div class="footer-menu-2 footerlast" id="divBrnchAddress">\
                            <ul>\
                                <h3 id="hrfHOF"></h3>\
                                <li id="liAddress" style="width:60%"><a id="hrfAdd1"></a></li>\
                                <li><a id="hrfAdd2"></a></li>\
                                <li><a id="hrfAdd3"></a></li>\
                                <li><a id="hrfMobile"></a></li>\
                            </ul>\
                        </div>\
                </div>\
            </div >\
        <div class="row footerrow" style="min-height: 100%; display:none;">\
                <div class="col-12 col-md-5 col-sm-2" style="overflow: auto; padding-bottom: 150px;">\
                    <section class="chact-area border-bottom" style="position: fixed; float: left; bottom: -65px; text-align: center; background-color: white; width: 100%; padding-top: 5px !important;">\
                        <div class="container-fluid">\
                            <div class="row">\
                                <div class="col-12">\
                                    <div class="chat" style="float: right;">\
                                        <h4 style="color: green !important;">online chat</h4>\
                                        <span style="margin-bottom: 13px;">\
                                            <img class="custom-chat" style="padding-bottom: 5px !important" src="../Assets/img/chat-white.png" />\
                                        </span>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </section>\
                </div>\
            </div>\
            </footer >\
        </div > ');
}


//<img class="facebook" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQAQMAAADK/wYcAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYKAMAAAAQAABicmvQwAAAABJRU5ErkJggg==">
//    <img class="linkedin" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==">
//        <img class="twitter" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==">
//            <img class="youtube-1" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAAAxJREFUeNpjYCANAAAAMAABKHRJfQAAAABJRU5ErkJggg==">
function BindHeaderCart() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/BindHeaderCart",
        dataType: "json",
        data: '',
        success: function (Result) {
            $('#totalItems').html(Result.d);
        },
        error: function (Result) {
            //alert("Error");
        }
    });
}

var orgdetails = undefined;

function GetOrgDetails() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetOrgDetails",
        dataType: "json",
        success: function (Result) {
            orgdetails = JSON.parse(Result.d);
            var num = orgdetails[0].CallCenterContact;
            $('[id^="spnCallCenterNum"]').html(num);

        },
        error: function (Result) {
            showMessage(Result.statusText);
        }
    });

}

var Branchdetails = undefined;

function GetBranchDetails() {

    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetBranchDetails",
        dataType: "json",
        success: function (Result) {
            Branchdetails = JSON.parse(Result.d);
            $('#hrfHOF').html(Branchdetails[0].BranchName);
            $('#hrfAdd1').html(Branchdetails[0].Address);
            $('#hrfAdd2').html(Branchdetails[0].City);
            $('#hrfAdd3').html(Branchdetails[0].State);
            //$('#hrfMobile').html(Branchdetails[0].Mobile);
            $('#hrfMobile').html(Branchdetails[0].ZipCode);
            //$('#Add').html(Branchdetails[0].BranchName);
            $('#Address1').html(Branchdetails[0].Address);
            $('#Address2').html(Branchdetails[0].City + ',' + Branchdetails[0].State + ',' + Branchdetails[0].ZipCode);
        },
        error: function (Result) {
            alert(Result.statusText);
        }
    });
}

function GetSalesAgentDetails() {

    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetSalesAgentDetails",
        dataType: "json",
        success: function (Result) {
            if (Result.d.Agent == "" && Result.d.AgentContactNo == "")
                $('[id^="lstSalesAgent"]').css('display', 'none');
            else {
                $('[id^="lstSalesAgent"]').css('display', 'inherit');
                $('[id^="spnSalesAgntName"]').html(Result.d.Agent);
                $('[id^="spnSalesAgntNum"]').html(Result.d.AgentContactNo);
            }
        },
        error: function (Result) {
            alert(Result.statusText);
        }
    });

}

function CallWService(url, data, onSuccess) {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            onSuccess(jQuery.parseJSON(data.d));
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err);
            //$.jGrowl('There is a problem while processing your request.', { header: 'Error', life: 10000 });
        }
    });
}

function Getlist() {
    $('#paymentDet').empty();
    var tempsubtotal = '';
    CallWService("../Helpers/Helper.aspx/GetCartItems", "", function s(stream2) {

        if (stream2 != null && stream2 != undefined) {
            var reslt = JSON.parse(JSON.stringify(stream2));
            //var creditBalance = '';
            //var availableCredit = '';
            //if (RemainingCredit == 0) {
            //    creditBalance = (parseFloat(RemainingCredit) - parseFloat(reslt.NetRecievable)).toPrecision();
            //    availableCredit = RemainingCredit;
            //}
            //else {
            //    creditBalance = (parseFloat(RemainingCredit.CreditBalance) - parseFloat(reslt.NetRecievable)).toPrecision();
            //    availableCredit = RemainingCredit.CreditBalance;
            //}

            //var availableCredit = '';
            //if (RemainingCredit == 0) {
            //    availableCredit = parseFloat(RemainingCredit) - (parseFloat(reslt.NetRecievable) - parseFloat(reslt.PayImmediateAmount));
            //}
            //else {
            //    availableCredit = RemainingCredit.CreditBalance - (parseFloat(reslt.NetRecievable) - parseFloat(reslt.PayImmediateAmount));
            //}

            var availableCredit = '';
            if (RemainingCredit == 0) {
                availableCredit = parseFloat(RemainingCredit);
            }
            else {
                availableCredit = RemainingCredit.CreditBalance;
            }

            tempsubtotal = subtotalTemplate.replace(/{{totalitems}}/ig, '(' + $('#totalItems').html() + ' items)')
                .replace(/{{subtotal}}/ig, reslt.SubTotal.toFixed(2))
                .replace(/{{netreceivable}}/ig, reslt.NetRecievable.toFixed(2))
                .replace(/{{discount}}/ig, reslt.DiscountOnTotal.toFixed(2))
                //.replace(/{{payincash}}/ig, (creditBalance >= 0) ? "0" : reslt.NetRecievable.toFixed(2))
                .replace(/{{payincash}}/ig, reslt.PayImmediateAmount.toFixed(2))
                .replace(/{{avaiablecreditlimit}}/ig, availableCredit.toFixed(2))
                .replace(/{{deliverydate}}/ig, (reslt.DeliveryDate == null) ? "" : reslt.DeliveryDate);
            $('#paymentDet').append(tempsubtotal);
        }
    });

    return false;
}

//function fnPayment() {
//    $('#NetReceivable').html();
//    $('#AvailableCredit').html();
//    $('#Payincash').html();

//    $('#cnfrmPayment').append('<p class="form_text1"><span>Net Receivable Amount</span> : &nbsp;&nbsp;' + $('#NetReceivable').html() + '</p>' +
//        '<p class= "form_text1"><span>Available Credit</span> :&nbsp;&nbsp;' + $('#AvailableCredit').html() + '</p>' +
//        '<p class="form_text1"><span>payment on delivery</span> :&nbsp;&nbsp;' + $('#Payincash').html() + '</p>');
//    $('#Paymentpopup').click();
//}

function StoreSalesOrder() {
    ShowModal();
    CallWService("../Helpers/Helper.aspx/StoreSalesOrder", "", function s(rst) {
        if (rst != null) {
            var orderNo = rst.toString();
            //var encrypted = CryptoJS.AES.encrypt(orderNo, 'secret key 123');
            window.location.href = 'OrderSummary.html?SalesOrderNo=' + orderNo;
        }
    });
    HideLoading();
}

function validateCoupon() {
    var coupon = $('#txtCoupon').val();
    if (coupon == '' || coupon == 'undefined') {
        $('#divApplyCoupon').css('display', 'block');
        $('#spnCoupon').html("Please Enter Coupon Code.");

    }
    else {
        $('#divApplyCoupon').css('display', 'block');
        $('#spnCoupon').html("Invalid Coupon Code.");

    }
}

function SetAddressLocation() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetAddressLocation",
        dataType: "json",
        success: function (Result) {
            if (Result.d != "")
                $('#DeliveryLocation').text(Result.d);
            else {

            }
        },
        error: function (Result) {
            alert(Result.statusText);
        }
    });
    return false;
}

function SearchProducts(searchVal) {
    if (searchVal == '' || searchVal == 'undefined') {
        $('#divsearchkey').css('display', 'block');
        $('#spnSearchKey').text("Please Enter Search Keyword.");
        return false;
    }
    else {
        window.location.href = '/HTML/CategoryProducts.html?' + searchVal + '&Search';
    }
}

//$('.input').keypress(function (e) {
//    if (e.which == 13) {
//        window.location.href = '/HTML/CategoryProducts.html?' + searchVal + '&Search';
//        return false;    //<---- Add this line
//    }
//});
var RemainingCredit = '';

function GetRemainingCredit() {
    $.ajax({
        type: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        url: "../Helpers/Helper.aspx/GetRemainingCredit",
        dataType: "json",
        success: function (Result) {
            RemainingCredit = JSON.parse(Result.d);
            if (RemainingCredit == 0)
                $('[id^="spnRemCredit"]').html("₹  " + RemainingCredit.toFixed(2));
            else
                $('[id^="spnRemCredit"]').html("₹  " + (RemainingCredit.CreditBalance).toFixed(2));
        },
        error: function (Result) {
            alert(Result.statusText);
        }
    });
    return false;
}

function callSubmit(evt) {
    var searchText = $('#txtSearch').val();
    if (searchText != '' && searchText != 'undefined') {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode == 13) {
            event.preventDefault();
            $('#button-addon2').click();
            return false;
        }
    }
    return true;
}


function fnLocationChange() {
    var value = FormValidation('form-inline');
    if (value == '' || value == 'undefined') {
        var val = $('.popover-body').find('.error');
        val.html('Enter ZipCode');
        return false;
    }
    if (value) {
        // if ($('.popover-body').find('input[type=text]').val() != null && $('.popover-body').find('input[type=text]').val() != 'undefined' && $('.popover-body').find('input[type=text]').val() != '') {
        CallWService("../Helpers/Helper.aspx/CheckAddressLocation", JSON.stringify({ Zipcode: $('.popover-body').find('input[type=text]').val() }), function (res) {
            if (res != null && res != undefined) {
                var objLocation = { LocationID: res.OrgBranchCode, ZipCode: res.ZipCode };
                $.ajax({
                    type: "POST",
                    url: "../Helpers/Helper.aspx/UpdatePrimaryAddress",
                    data: JSON.stringify(objLocation),
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (data.d != null && data.d == "Success") {
                            window.location.href = '/index.html';
                        }
                    },
                    error: function (xhr, status, error) {
                        var err = eval("(" + xhr.responseText + ")");
                    }
                });

                return false;
            }
            else {
                //$('.popover-body').find('#NotMatched').css("display", '');
                var val = $('.popover-body').find('.error');
                val.html('Enter Valid ZipCode');
            }
        });
        return false;
    }
    else {

    }
    return false;
}

function FormValidation(classname) {
    var value = false;
    var forms = document.getElementsByClassName(classname);
    var validation = Array.prototype.filter.call(forms, function (form) {
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            value = false;
        }
        else {
            value = true;
        }
        form.classList.add('was-validated');
    });
    return value;
}

function isNumberKey(evt) {
    var val = $('.popover-body').find('.error');
    val.html('');
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function FnLocations() {
    $('.popover').popover('hide');

    var objs = { ISPrimary: false };
    CallWService("../Helpers/Helper.aspx/GetAddresses", JSON.stringify(objs), function s(stream) {
        if (stream != null && stream != undefined) {
            $('#Locations').find('#AddressLocations').empty();
            var data = undefined;
            for (var i = 0; i < stream.length; i++) {
                if (stream[i].FulfilledByBranchID > 0) {
                    $('#Locations').find('#AddressLocations').append('<ul>\
                    <li class="loc" id='+ stream[i].ZipCode + ' onclick=fnselectedZipcode(' + stream[i].ZipCode + ',' + ((stream[i].hasOwnProperty("UserOrgBranchID")) ? stream[i].UserOrgBranchID : stream[i].OrgBranchCode) + ')' + '><a href="#"><strong></strong>' + stream[i].State + ',' + stream[i].City + ',' + stream[i].ZipCode + '</a></li></ul>'
                    );
                }
            }
            $('#GetLocations').click();
        }
    });

}


function fnselectedZipcode(ZipCode, LocationID) {
    ClearActiveZipCode();
    $('#' + ZipCode).addClass('active');
    var objLocation = { LocationID: LocationID, ZipCode: ZipCode };
    $.ajax({
        type: "POST",
        url: "../Helpers/Helper.aspx/UpdatePrimaryAddress",
        data: JSON.stringify(objLocation),
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.d != null && data.d == "Success") {
                window.location.href = '/index.html';
            }
        },
        error: function (xhr, status, error) {
            var err = eval("(" + xhr.responseText + ")");
        }

    });

    return false;
}


function ClearActiveZipCode() {
    $('.loc').each(function (i) {
        $(this).removeClass('active');
    });
    return false;
}

function subCategory(childList, data) {

    var temp1 = '';
    var template = '';
    for (var j = 0; j < childList.length; j++) {

        temp1 = '';
        if (childList[j].ChildCategoryList != null && childList[j].ChildCategoryList.length > 0) {

            //temp1 = //subCategoryTemplate.replace(/{{subchild2}}/ig, childList[j].Category).replace(/{{category}}/ig, childList[j].Category).replace(/{{categoryID}}/ig, childList[j].CategoryID);
            temp1 = '<li class="dropdown-submenu" id="bindSubCategory">\
                <a class="dropdown-item dropdown-toggle" href="CategoryProducts.html?category='+ childList[j].Category + '&categoryID=' + childList[j].CategoryID + '">' + childList[j].Category + '</a>\
                    <ul class="dropdown-menu">\
                    {{listTemplate}}\
                </ul>\
            </li>';
            temp1 = subCategory(childList[j].ChildCategoryList, temp1);
        }
        else {
            //temp1 = parentCategoryTemplate.replace(/{{subchild1}}/ig, childList[j].Category).replace(/{{category}}/ig, childList[j].Category).replace(/{{categoryID}}/ig, childList[j].CategoryID);
            temp1 = '<li><a class="dropdown-item" href="CategoryProducts.html?category=' + childList[j].Category + '&categoryID=' + childList[j].CategoryID + '">' + childList[j].Category + '</a></li>';
        }
        template = template + temp1;
    }
    return data = data.replace("{{listTemplate}}", template);

}

function shopByCategory() {
    CallWService("../Helpers/Helper.aspx/LoadShopByCategory", "", function (res) {
        if (res != null && res != undefined) {
            $('#bindShopByCategories').empty();
            var data = undefined;
            for (i = 0; i < res.length; i++) {
                data = undefined;
                if (res[i].ChildCategoryList != null && res[i].ChildCategoryList.length > 0) {

                    //  data = //subCategoryTemplate.replace(/{{subchild2}}/ig, res[i].Category).replace(/{{category}}/ig, res[i].Category).replace(/{{categoryID}}/ig, res[i].CategoryID)
                    data = '<li class="dropdown-submenu" id="bindSubCategory">\
            <a class="dropdown-item dropdown-toggle" href="CategoryProducts.html?category='+ res[i].Category + '&categoryID=' + res[i].CategoryID + '">' + res[i].Category + '</a>\
            <ul class="dropdown-menu">\
                {{listTemplate}}\
            </ul>\
        </li>'

                    data = subCategory(res[i].ChildCategoryList, data);
                }
                else {
                    // data = parentCategoryTemplate.replace(/{{subchild1}}/ig, res[i].Category).replace(/{{category}}/ig, res[i].Category).replace(/{{categoryID}}/ig, res[i].CategoryID);
                    data = '<li><a class="dropdown-item" href="CategoryProducts.html?category=' + res[i].Category + '&categoryID=' + res[i].CategoryID + '">' + res[i].Category + '</a></li>'
                }

                $('#bindShopByCategories').append(data);
                //registerDropdownEvent();
            }
        }
        else {

        }
    }, false);
}

function ShowModal() {
    $('.loader').show();
}

function HideLoading() {
    $('.loader').fadeOut();
}

function SearchProducts(searchVal) {
    if (searchVal == '' || searchVal == 'undefined') {
        $('#divsearchkey').css('display', 'block');
        $('#spnSearchKey').text("Please Enter Search Keyword.");
        return false;
    }
    else {
        window.location.href = '/HTML/CategoryProducts.html?' + searchVal + '&Search';
    }
}
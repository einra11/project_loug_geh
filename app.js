var homeSuppliersGlobal = new HomeSuppliers();
var homeItemGlobal = new HomeItem();
var homeSalesGlobal = new HomeSales();
var vat = 2.36;



$(function() {
    homeSuppliersGlobal.InitComponents();
    homeItemGlobal.InitComponents();
    homeSalesGlobal.InitComponents();
})



function HomeSuppliers (){
    this.InitComponents = function(){
        homeSuppliersGlobal.GetSuppliers();
    }

    this.GetSuppliers = function(){
        $.ajax({
            url: "contents/getsuppliers.php",
            method: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';

                    htmlString += '<tr>';
                            htmlString += '<th>' + 'Supplier Code' + '</th>';
                            htmlString += '<th>' + 'Supplier Name' + '</th>';
                            htmlString += '<th>' + 'Supplier Desc' + '</th>';
                            htmlString += '<th>' + 'Supplier Address' + '</th>';
                        htmlString += '</tr>';

                    $.each(data.dataEvents, function(index) {
                        htmlString += '<tr>';
                            htmlString += '<td>' + data.dataEvents[index].sup_code + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].sup_name + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].sup_desc + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].sup_address + '</td>';
                        htmlString += '</tr>';

                    });

                   $('#tbsuppliers').html(htmlString);     

                } else {
                    console.log('Events were not loaded successfully.');
                }
            }
        });
    }
}


function HomeItem (){
    this.InitComponents = function(){
        homeItemGlobal.GetItem();
        // homeItemGlobal.UpdateStocks();
        // homeItemGlobal.CheckItem();
    }

    this.GetItem = function(){
        $.ajax({
            url: "contents/getallitems.php",
            method: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';
 
                        htmlString += '<tr>';
                            htmlString += '<th>' + 'Barcode' + '</th>';
                            htmlString += '<th>' + 'Item Code' + '</th>';
                            htmlString += '<th>' + 'Supplier Code' + '</th>';
                            htmlString += '<th>' + 'Product Description' + '</th>';
                            htmlString += '<th>' + 'Stocks' + '</th>';
                            htmlString += '<th>' + 'SRP' + '</th>';
                        htmlString += '</tr>';

                    $.each(data.dataEvents, function(index) {
                        htmlString += '<tr class="clickable">';
                            htmlString += '<td>' + data.dataEvents[index].item_bcode + '</td>';
                            htmlString += '<td class="nr">' + data.dataEvents[index].item_code + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].sup_code + '</td>';
                            htmlString += '<td class="name">' + data.dataEvents[index].item_product_desc + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].item_stock + '</td>';
                            htmlString += '<td class="pr">' + parseFloat(data.dataEvents[index].item_srp) + '</td>';
                        htmlString += '</tr>';

                    });

                   $('#tbitem').html(htmlString);     

                } else {
                    console.log('Events were not loaded successfully.');
                }
            }
        });
    }

    this.CheckItem = function (prdcode, itemcnt){
        $.ajax({
            url: "contents/getiteminfo.php",
            type: "POST",
            dataType: "JSON",
            data: {
                pcode : prdcode,
                itmcnt : itemcnt
            },
            success: function (data){
                if (data.status == 1){
                    $.each(data.dataEvents, function(index) {
                        var currstocks = data.dataEvents[index].item_stock
                        var newStocks = currstocks - itemcnt
                        homeItemGlobal.UpdateStocks(newStocks,prdcode)
                        
                        for (i = 0; i < itemcnt; i++){
                            homeSalesGlobal.RecordSales(prdcode, itemcnt);
                        }
                    });
                } else {
                    console.log('err')
                }

            }
        })
    }

    this.UpdateStocks = function (newStock, prdcode){
        $.ajax({
            url: "contents/updatestocks.php",
            type: "POST",
            dataType: "JSON",
            data: {
                pcode : prdcode,
                newStock : newStock
            },
            success: function(data) {
                if (data.status == 1) {
                    homeItemGlobal.GetItem();
                } else {
                   console.log('err')
                }
            }
        });
    }
    

}

function HomeSales (){
    this.InitComponents = function(){
        homeSalesGlobal.GetItem();
        // homeSalesGlobal.AddSales();

        $('#btn_submit').on('click',function(){
            var process = $(this).attr('btn-process')
            if(process == 'add'){
                homeSalesGlobal.AddSales();
            }
        })
    }

    this.GetItem = function(){
        $.ajax({
            url: "contents/getallsales.php",
            method: "POST",
            dataType: "JSON",
            success: function(data) {
                if (data.status == 1) {
                    var htmlString = '';
 
                        htmlString += '<tr>';
                            htmlString += '<th>' + 'Transaction Code' + '</th>';
                            htmlString += '<th>' + 'Customer' + '</th>';
                            htmlString += '<th>' + 'Transaction Description' + '</th>';
                            htmlString += '<th>' + 'Barcode' + '</th>';
                            htmlString += '<th>' + 'Transaction Date' + '</th>';
                        htmlString += '</tr>';

                    $.each(data.dataEvents, function(index) {
                        htmlString += '<tr>';
                            htmlString += '<td>' + data.dataEvents[index].tran_code + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].tran_c_name + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].tran_desc + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].tran_OR + '</td>';
                            htmlString += '<td>' + data.dataEvents[index].tran_created + '</td>';
                        htmlString += '</tr>';

                    });
                   $('#tbsales').html(htmlString);     

                } else {
                    console.log('Events were not loaded successfully.');
                }
            }
        });
    }

    this.AddSales = function () {
        var listitem = $('#itemlist li');
        
        console.log(listitem)

        listitem.each(function (idx, li){
            var item = $(li)
            var productcode = item.attr("value");
            var listitemqty = $("#itemlist li[value*="+ productcode +"] span");
            var $qty = Number.parseInt(listitemqty[0].innerText)


            homeItemGlobal.CheckItem(productcode, $qty)
        })
       
    }

    this.RecordSales = function (prdcode, qty) {
        var dt = new Date();

        var $soldTo = $('#txtSoldto').val();
        var $cAddress = $('#txtCAddress').val();
        var $cCtnNo = $('#txtCCtnNo').val();
        var $tranCode = 'g3' + dt.getSeconds() + dt.getDay() + dt.getFullYear();
        var $productCode = prdcode;
        var $productQty = qty;

        $.ajax({
            url: "contents/createTransaction.php",
            type: "POST",
            dataType: "JSON",
            data: {
                cust_name: $soldTo,
                cust_address: $cAddress,
                cust_ctn: $cCtnNo,
                tran_code: $tranCode,
                tran_desc : $productCode,
                prod_code : $productCode,
                tran_prdqty : $productQty
            },
            success: function(data) {
                if (data.status == 1) {
                    // alert('Successfully Created Sales');
                    // manageGKKGlobal.GetAllGKKs();
                    // manageGKKGlobal.ClearFields();
                    homeSalesGlobal.GetItem()
                    $("#itemlist").empty();
                }
                 else {
                    alert('Sales was not added successfully.');
                }
            }
        });
    }
}


$(document).ready(function (){
    $('#txtSearchItem').on("keyup", function (){
        var value = $(this).val().toLowerCase();
        $("#tbitem tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
          });
    })




    $("#tbitem").on('click','.clickable',function(){
        var $item = $(this).closest("tr").find(".nr").text();
        var $itemname = $(this).closest("tr").find(".name").text();
        var $price = Number.parseFloat($(this).closest("tr").find(".pr").text(), 10) + vat;    

        var listitem = $("#itemlist li[value*="+ $item +"]");



        if (listitem.length){
            var listitemqty = $("#itemlist li[value*="+ $item +"] span");

            var $qty = Number.parseInt(listitemqty[0].innerText) + 1

            listitemqty[0].innerText = $qty

        } else
        {
            var $qty = 1
            $("#itemlist").append('<li class="prdcode" value ="'+ $item +'"> Item: ' + $itemname  + ' Price: ' + $price +' Quantity : <span id ="qty" >'+ $qty +'</span></li>');
        }

    });

})
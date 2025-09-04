var $ = jQuery.noConflict();

$(function () {
	"use strict";

	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});

	onViewCartData();
});

function onViewCartData() {

    $.ajax({
		type : 'GET',
		url: base_url + '/frontend/viewcart_data',
		dataType:"json",
		success: function (data) {

			$(".viewcart_price_total").text(data.price_total);
			$(".viewcart_discount").text(data.discount);
			$(".viewcart_tax").text(data.tax);
			$(".viewcart_sub_total").text(data.sub_total);
			$(".viewcart_total").text(data.total);
		}
	});
}

// function onRemoveToCart(id) {
// 	var rowid = $("#removetoviewcart_"+id).data('id');

// 	$.ajax({
// 		type : 'GET',
// 		url: base_url + '/frontend/remove_to_cart/'+rowid,
// 		dataType:"json",
// 		success: function (response) {

// 			var msgType = response.msgType;
// 			var msg = response.msg;

// 			if (msgType == "success") {
// 				onSuccessMsg(msg);
// 				$('#row_delete_'+id).remove();
// 			} else {
// 				onErrorMsg(msg);
// 			}

// 			onViewCartData();
// 			onViewCart();
// 		}
// 	});
// }

function onRemoveToCart(cartKey) {
    var rowid = $("#removetoviewcart_" + cartKey).data('id');

    $.ajax({
        type : 'GET',
        url: base_url + '/frontend/remove_to_cart/' + encodeURIComponent(rowid),
        dataType: "json",
        success: function (response) {
            if (response.msgType === "success") {
                onSuccessMsg(response.msg);

                // Remove row from DOM instantly
                $("#row_delete_" + cartKey).fadeOut(300, function() {
                    $(this).remove();
                });

                // Refresh totals and sidebar cart
                onViewCartData();
                onViewCart();
            } else {
                onErrorMsg(response.msg);
            }
        },
        error: function () {
            onErrorMsg("Something went wrong!");
        }
    });
}

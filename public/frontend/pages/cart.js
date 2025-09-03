var $ = jQuery.noConflict();

$(function () {
	"use strict";

	$.ajaxSetup({
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		}
	});
	
	onViewCart();
	onWishlist();
	
// Select size
$(document).on("click", ".widget-size .unit", function () {
    $(".widget-size .unit").removeClass("active");
    $(this).addClass("active");
    $("#selected_size").val($(this).data("size"));
});

// Select color
$(document).on("click", ".widget-color .color-option", function () {
    $(".widget-color .color-option").removeClass("active");
    $(this).addClass("active");
    $("#selected_color").val($(this).data("color"));
});


// Buy Now
$(document).on("click", ".product_buy_now", function (event) {
    event.preventDefault();

    var id = $(this).data('id');
    var qty = $("#quantity").val();
    var size = $("#selected_size").val();
    var color = $("#selected_color").val();

    // Validate qty
    if ((qty == undefined) || (qty == '') || (qty <= 0)) {
        onErrorMsg('Please enter quantity.');
        return;
    }

    // Validate size
    if (size == "" || size == undefined) {
        onErrorMsg('Please select a size.');
        return;
    }

    // Validate color
    if (color == "" || color == undefined) {
        onErrorMsg('Please select a color.');
        return;
    }

    // Stock validation
    if (is_stock == 1) {
        var stockqty = $(this).data('stockqty');
        if (is_stock_status == 1) {
            if (qty > stockqty) {
                onErrorMsg('The value must be less than or equal to');
                return;
            }
        } else {
            onErrorMsg('This product out of stock.');
            return;
        }
    }

    // Send request with size & color
    $.ajax({
        type: 'GET',
        url: base_url + '/frontend/add_to_cart/' + id + '/' + qty,
        data: { size: size, color: color },
        dataType: "json",
        success: function (response) {
            var msgType = response.msgType;
            var msg = response.msg;

            if (msgType == "success") {
                window.location.href = base_url + '/checkout';
            } else {
                onErrorMsg(msg);
            }
            onViewCart();
        }
    });
});

// Add to Cart


// $(document).on("click", ".addtocart", function (event) {
//     event.preventDefault();

//     var id = $(this).data('id');
//     var qty = $("#quantity").val() || 1; // fallback to 1 if no qty input
//     var size = $("#selected_size").val();
//     var color = $("#selected_color").val();

//     // Validate size
//     if (size == "" || size == undefined) {
//         onErrorMsg('Please select a size.');
//         return;
//     }

//     // Validate color
//     if (color == "" || color == undefined) {
//         onErrorMsg('Please select a color.');
//         return;
//     }

//     $.ajax({
//         type: 'GET',
//         url: base_url + '/frontend/add_to_cart/' + id + '/' + qty,
//         data: { size: size, color: color },
//         dataType: "json",
//         success: function (response) {
//             var msgType = response.msgType;
//             var msg = response.msg;

//             if (msgType == "success") {
//                 onSuccessMsg(msg);
//             } else {
//                 onErrorMsg(msg);
//             }
//             onViewCart();
//         }
//     });
// });


var currentProductId = null;
var currentQty = 1;

// Click on addtocart
$(document).on("click", ".addtocart", function (event) {
    event.preventDefault();
	

    currentProductId = $(this).data('id');
    currentQty = $("#quantity").val() || 1;

    var size = $("#selected_size").val();
    var color = $("#selected_color").val();
    console.log(size, color);
    if (!size || !color) {
        // Populate modal options dynamically if needed
        $("#modal-sizes").html($("#size-options").html());   // copy sizes
        $("#modal-colors").html($("#color-options").html()); // copy colors
        $("#variationModal").modal('show'); // show bootstrap modal
        return;
    }

    addToCartAJAX(currentProductId, currentQty, size, color);
});

// Select size inside modal
$(document).on("click", "#modal-sizes .unit", function () {
    $("#modal-sizes .unit").removeClass("active");
    $(this).addClass("active");
    $("#modal-selected-size").val($(this).data("size"));
});

// Select color inside modal
$(document).on("click", "#modal-colors .color-option", function () {
    $("#modal-colors .color-option").removeClass("active");
    $(this).addClass("active");
    $("#modal-selected-color").val($(this).data("color"));
});

// Confirm add to cart inside modal
$(document).on("click", "#modal-add-to-cart", function () {
    var size = $("#modal-selected-size").val();
    var color = $("#modal-selected-color").val();

    if (!size) { alert("Please select a size."); return; }
    if (!color) { alert("Please select a color."); return; }

    $("#variationModal").modal('hide');
    addToCartAJAX(currentProductId, currentQty, size, color);
});

// AJAX function
function addToCartAJAX(id, qty, size, color) {
    $.ajax({
        type: 'GET',
        url: base_url + '/frontend/add_to_cart/' + id + '/' + qty,
        data: { size: size, color: color },
        dataType: "json",
        success: function (response) {
            if (response.msgType == "success") {
                onSuccessMsg(response.msg);
            } else {
                onErrorMsg(response.msg);
            }
            onViewCart();
        }
    });
}


$(document).on("click", ".product_addtocart", function(event) {
    event.preventDefault();

    var id = $(this).data('id');
    var qty = $("#quantity").val();
    var size = $("#selected_size").val();
    var color = $("#selected_color").val();

    // Validate quantity
    if((qty == undefined) || (qty == '') || (qty <= 0)){
        onErrorMsg('Please enter quantity.');
        return;
    }

    // Validate size
    if(size == "" || size == undefined){
        onErrorMsg('Please select a size.');
        return;
    }

    // Validate color
    if(color == "" || color == undefined){
        onErrorMsg('Please select a color.');
        return;
    }

    // Stock validation
    if(is_stock == 1){
        var stockqty = $(this).data('stockqty');
        if(is_stock_status == 1){
            if(qty > stockqty){
                onErrorMsg('The value must be less than or equal to');
                return;
            }
        } else {
            onErrorMsg('This product out of stock.');
            return;
        }
    }

    // Send AJAX request with size & color
    $.ajax({
        type : 'GET',
        url: base_url + '/frontend/add_to_cart/' + id + '/' + qty,
        data: { size: size, color: color },
        dataType: "json",
        success: function (response) {
            var msgType = response.msgType;
            var msg = response.msg;

            if (msgType == "success") {
                onSuccessMsg(msg);
            } else {
                onErrorMsg(msg);
            }
            onViewCart();
        }
    });
});



	// $(document).on("click", ".product_addtocart", function(event) {
	// 	event.preventDefault();

	// 	var id = $(this).data('id');
	// 	var qty = $("#quantity").val();

	// 	if((qty == undefined) || (qty == '') || (qty <= 0)){
	// 		onErrorMsg(TEXT['Please enter quantity.']);
	// 		return;
	// 	}
	// 	if(is_stock == 1){
	// 		var stockqty = $(this).data('stockqty');
	// 		if(is_stock_status == 1){
	// 			if(qty > stockqty){
	// 				onErrorMsg(TEXT['The value must be less than or equal to']);
	// 				return;
	// 			}
	// 		}else{
	// 			onErrorMsg(TEXT['This product out of stock.']);
	// 			return;
	// 		}
	// 	}
		
	// 	$.ajax({
	// 		type : 'GET',
	// 		url: base_url + '/frontend/add_to_cart/'+id+'/'+qty,
	// 		dataType:"json",
	// 		success: function (response) {
	// 			var msgType = response.msgType;
	// 			var msg = response.msg;

	// 			if (msgType == "success") {
	// 				onSuccessMsg(msg);
	// 			} else {
	// 				onErrorMsg(msg);
	// 			}
	// 			onViewCart();
	// 		}
	// 	});
    // });
	
	// $(document).on("click", ".product_buy_now", function(event) {
	// 	event.preventDefault();

	// 	var id = $(this).data('id');
	// 	var qty = $("#quantity").val();
		
	// 	if((qty == undefined) || (qty == '') || (qty <= 0)){
	// 		onErrorMsg(TEXT['Please enter quantity.']);
	// 		return;
	// 	}
	// 	if(is_stock == 1){
	// 		var stockqty = $(this).data('stockqty');
	// 		if(is_stock_status == 1){
	// 			if(qty > stockqty){
	// 				onErrorMsg(TEXT['The value must be less than or equal to']);
	// 				return;
	// 			}
	// 		}else{
	// 			onErrorMsg(TEXT['This product out of stock.']);
	// 			return;
	// 		}
	// 	}
		
	// 	$.ajax({
	// 		type : 'GET',
	// 		url: base_url + '/frontend/add_to_cart/'+id+'/'+qty,
	// 		dataType:"json",
	// 		success: function (response) {
	// 			var msgType = response.msgType;
	// 			var msg = response.msg;

	// 			if (msgType == "success") {
	// 				// onSuccessMsg(msg);
	// 				window.location.href = base_url + '/checkout';
	// 			} else {
	// 				onErrorMsg(msg);
	// 			}
	// 			onViewCart();
	// 		}
	// 	});
    // });
	
	// $(document).on("click", ".addtocart", function(event) {
	// 	event.preventDefault();
		
	// 	var id = $(this).data('id');
	// 	var qty = 0;
	// 	$.ajax({
	// 		type : 'GET',
	// 		url: base_url + '/frontend/add_to_cart/'+id+'/'+qty,
	// 		dataType:"json",
	// 		success: function (response) {
	// 			var msgType = response.msgType;
	// 			var msg = response.msg;

	// 			if (msgType == "success") {
	// 				onSuccessMsg(msg);
	// 			} else {
	// 				onErrorMsg(msg);
	// 			}
	// 			onViewCart();
	// 		}
	// 	});
    // });	
	
	$(document).on("click", ".addtowishlist", function(event) {
		event.preventDefault();
		
		var id = $(this).data('id');

		$.ajax({
			type : 'GET',
			url: base_url + '/frontend/add_to_wishlist/'+id,
			dataType:"json",
			success: function (response) {
				var msgType = response.msgType;
				var msg = response.msg;

				if (msgType == "success") {
					onSuccessMsg(msg);
				} else {
					onErrorMsg(msg);
				}
				onWishlist();
			}
		});
    });	
});

function onViewCart() {

    $.ajax({
		type : 'GET',
		url: base_url + '/frontend/view_cart',
		dataType:"json",
		success: function (data) {
			if(data.items == ''){
				$(".has_item_empty").show();
				$(".has_cart_item").hide();
				$(".total_qty").text(0);
			}else{
				$(".has_item_empty").hide();
				$(".has_cart_item").show();
				
				$('#tp_cart_data').html(data.items);
				$('#tp_cart_data_for_mobile').html(data.items);
				
				$(".total_qty").text(data.total_qty);
				$(".sub_total").text(data.sub_total);
				$(".tax").text(data.tax);
				$(".tp_total").text(data.total);
			}
		}
	});
}

function onRemoveToCart(id) {
	var rowid = $("#removetocart_"+id).data('id');

	$.ajax({
		type : 'GET',
		url: base_url + '/frontend/remove_to_cart/'+rowid,
		dataType:"json",
		success: function (response) {
			
			var msgType = response.msgType;
			var msg = response.msg;

			if (msgType == "success") {
				onSuccessMsg(msg);
			} else {
				onErrorMsg(msg);
			}
			
			onViewCart();
		}
	});
}

function onWishlist() {

    $.ajax({
		type : 'GET',
		url: base_url + '/frontend/count_wishlist',
		dataType:"json",
		success: function (data) {
			$(".count_wishlist").text(data);
		}
	});
}

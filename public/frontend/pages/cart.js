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

// Click on Add to Cart button
$(document).on("click", ".addtocart", function (event) {
    event.preventDefault();

    currentProductId = $(this).data('id');
    currentQty = $("#quantity").val() || 1;

    var size = $("#selected_size").val();
    var color = $("#selected_color").val();

    if (!size || !color) {
        var sizes = JSON.parse($(this).attr('data-variation-size') || '[]');
        var colors = JSON.parse($(this).attr('data-variation-color') || '[]');

        $("#modal-sizes").empty();
        $("#modal-colors").empty();

        sizes.forEach(function(s){
            $("#modal-sizes").append('<li class="unit" data-size="' + s + '">' + s + '</li>');
        });

        colors.forEach(function(c){
            $("#modal-colors").append('<li class="color-option" data-color="' + c + '" style="background:' + c + '; width: 40px; height:50px; display:inline-block; margin:5px; cursor:pointer;"></li>');
        });

        $("#variationModal").data('product-id', currentProductId);
        $("#variationModal").modal('show');
        return;
    }

    // Direct add if variation selected
    addToCartAJAX(currentProductId, currentQty, size, color);
});

// Modal click select
$(document).on('click', '#modal-sizes li', function(){
    $("#selected_size").val($(this).data('size'));
    $(this).addClass('active').siblings().removeClass('active');
});

$(document).on('click', '#modal-colors li', function(){
    $("#selected_color").val($(this).data('color'));
    $(this).addClass('active').siblings().removeClass('active');
});

// Modal Add-to-Cart
$(document).on('click', '#modal-add-to-cart', function(){
    var size = $("#selected_size").val();
    var color = $("#selected_color").val();

    if(!size || !color){
        alert("Please select size and color");
        return;
    }

    addToCartAJAX(currentProductId, currentQty, size, color);
    $("#variationModal").modal('hide');
});

// AJAX Add-to-Cart
function addToCartAJAX(productId, qty, size, color){
    $.ajax({
        type: "POST",
        url: base_url + "/frontend/add_to_cart",
        data: { id: productId, qty: qty, size: size, color: color },
        dataType: "json",
        success: function(response){
            if(response.msgType === "success"){
                onSuccessMsg(response.msg);
                onViewCart();       // sidebar update
                onViewCartData();   // totals update
            } else {
                onErrorMsg(response.msg);
            }
        }
    });
}

// AJAX Remove-from-Cart
function onRemoveToCart(cartKey){
    $.ajax({
        type: 'GET',
        url: base_url + '/frontend/remove_to_cart/' + encodeURIComponent(cartKey),
        dataType: 'json',
        success: function(response){
            if(response.msgType === "success"){
                $("#row_delete_" + cartKey).fadeOut(300,function(){ $(this).remove(); });
                onViewCart();
                onViewCartData();
                onSuccessMsg(response.msg);
            } else {
                onErrorMsg(response.msg);
            }
        }
    });
}

// Sidebar / totals update
function onViewCartData() {
    $.ajax({
        type: 'GET',
        url: base_url + '/frontend/viewcart_data',
        dataType: 'json',
        success: function(data){
            if(!data) return;

            $(".viewcart_price_total").text(data.price_total || '0');
            $(".viewcart_discount").text(data.discount || '0');
            $(".viewcart_tax").text(data.tax || '0');
            $(".viewcart_sub_total").text(data.sub_total || '0');
            $(".viewcart_total").text(data.total || '0');

            if(data.total_qty && data.total_qty > 0){
                $(".has_cart_item").show();
                $(".has_item_empty").hide();
            } else {
                $(".has_cart_item").hide();
                $(".has_item_empty").show();
            }
        }
    });
}



// Handle modal selection and confirm Add to Cart
$(document).on("click", "#modal-sizes .unit", function () {
    $("#modal-sizes .unit").removeClass("active");
    $(this).addClass("active");
    $("#modal-selected-size").val($(this).data("size"));
});

$(document).on("click", "#modal-colors .color-option", function () {
    $("#modal-colors .color-option").removeClass("active");
    $(this).addClass("active");
    $("#modal-selected-color").val($(this).data("color"));
});

$(document).on("click", "#modal-add-to-cart", function () {
    var size = $("#modal-selected-size").val();
    var color = $("#modal-selected-color").val();

    if (!size) { alert("Please select a size"); return; }
    if (!color) { alert("Please select a color"); return; }

    var qty = $("#quantity").val() || 1;
    var productId = $("#variationModal").data('product-id');

    $("#variationModal").modal('hide');

    addToCartAJAX(productId, qty, size, color);
});

// AJAX function
function addToCartAJAX(id, qty, size, color){
    $.ajax({
        type: 'GET',
        url: base_url + '/frontend/add_to_cart/' + id + '/' + qty,
        data: { size: size, color: color },
        dataType: "json",
        success: function(response){
            if(response.msgType == "success"){
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

function onRemoveToCart(cartKey) {

    var rowid = $("#removetoviewcart_" + cartKey).data('id');

    $.ajax({
        type : 'GET',
        url: base_url + '/frontend/remove_to_cart/' + encodeURIComponent(rowid),
        dataType:"json",
        success: function (response) {
            if (response.msgType === "success") {
                // Remove item from DOM immediately
                $("#removetocart_" + cartKey).closest("li, tr").remove();

                onSuccessMsg(response.msg);
            } else {
                onErrorMsg(response.msg);
            }

            // Optionally refresh totals
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

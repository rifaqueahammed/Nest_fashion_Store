/* eslint-disable no-restricted-globals */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */


// chekout
function addtoCart(productId) {
  $.ajax({
    url: `/user/addToCart/${productId}`,
    method: "get",
    success: (response) => {
      Swal.fire("Added to Cart");
    },
  });
}

function changeQuantity(productId, count) {
  const quantity = parseInt(document.getElementById(productId).innerHTML, 10);
  $.ajax({
    url: "/user/changeProductQuantity",
    data: {
      productId,
      count,
      quantity,
    },
    method: "post",
    success: (response) => {
      if (response.productQuantityChanged) {
        document.getElementById(productId).innerHTML = quantity + count;
        document.getElementById(
          "totalAmount1"
        ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
        document.getElementById(
          "totalAmount2"
        ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
        document.getElementById(
          `${productId}p`
        ).innerText = `₹ ${response.productData[0].data.productPrice}`;
      } 
      if(response.productRemoved) {
        Swal.fire({
          title: "Product removed from cart!",
          icon: "success",
          confirmButtonText: "OK",
        });
        document.getElementById(`${productId}productbody`).remove();
        location.reload()
        // document.getElementById(
        //   "totalAmount1"
        // ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
        // document.getElementById(
        //   "totalAmount2"
        // ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
      }
    },
  });
}

function deleteProduct(productId) {
  $.ajax({
    url: `/user/deleteProduct/${productId}`,
    method: "get",
    success: (response) => {
      if(response.productRemoved){
        Swal.fire("Product Deleted");
        document.getElementById(`${productId}productbody`).remove();
        location.reload()
      }
    },
  });
}

// wishlist

function wishlist(productId) {
  $.ajax({
    url: `/user/wishlist/${productId}`,
    method: "get",
    success: (response) => {
      if(response.alreadyWishlisted){
        Swal.fire("Already Wishlisted");
      }else{
        Swal.fire("Wishlisted");
      }
    },
  });
}

function movetoCart(productId) {
  $.ajax({
    url: `/user/movetoCart/${productId}`,
    method: "get",
    success: (response) => {
      Swal.fire("Move to Cart");
      document.getElementById(`${productId}wishlistproductbody`).remove();
      location.reload()
    },
  });
}


function deletewishlistProduct(productId) {
  $.ajax({
    url: `/user/deletewishlistProduct/${productId}`,
    method: "get",
    success: (response) => {
      if(response.productRemoved){
        Swal.fire("Product Removed from Wishlist");
        document.getElementById(`${productId}wishlistproductbody`).remove();
        location.reload()
      }
    },
  });
}



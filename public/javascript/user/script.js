/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const { response } = require("express");

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
        document.getElementById(
          "totalAmount1"
        ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
        document.getElementById(
          "totalAmount2"
        ).innerText = `₹ ${response.productData[0].totalAmount.Amount}`;
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
      }
    },
  });
}

// order-placing


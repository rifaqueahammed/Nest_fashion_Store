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

// user-signup-validation

function checkSignUpForm(form) {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const mobile = document.getElementById("mobile_number");
  const confirmpassword = document.getElementById("confirm_password");

  const regex = /^[a-zA-Z\s]+$/;
  if (name.value === "") {
    document.getElementById("nameError").innerHTML = "please enter your name";
    username.focus();
    return false;
  }
  if (regex.test(name.value) === false) {
    document.getElementById("nameError").innerHTML =
      "name should not contain special characters";
    username.focus();
    return false;
  }
  if (email.value === "") {
    document.getElementById("emailError").innerHTML = "please enter your email";
    email.focus();
    return false;
  }
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  if (!re.test(email.value)) {
    document.getElementById("emailError").innerHTML =
      "please enter a vaild email";
    email.focus();
    return false;
  }
  if (mobile.value === "") {
    document.getElementById("mobileerror").innerHTML =
      "please enter your mobile number";
    mobile.focus();
    return false;
  }
  const mob = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  if (mob.test(mobile.value) === false) {
    document.getElementById("mobileerror").innerHTML =
      "mobile number should be 10 digits";
    mobile.focus();
    return false;
  }
  if (password.value === "") {
    document.getElementById("passwordError").innerHTML =
      "please enter your password";
    password.focus();
    return false;
  }
  if (password.value < 8) {
    document.getElementById("passwordError").innerHTML =
      "password should contain 8 characters";
    password.focus();
    return false;
  }
  const check =
    /^((?=.*[0-9].*)(?=.*[a-zA-Z])(?!.*\s)[0-9a-zA-Z*$-+?_&=!@%{}/'.]*)$/i;
  if (check.test(password.value) === false) {
    document.getElementById("passwordError").innerHTML =
      "password should contain one special character one number,uppercase letter,lower case letter";
    password.focus();
    return false;
  }
  if (confirmpassword.value === "") {
    document.getElementById("confirmpasswordError").innerHTML =
      "please confirm your password";
    password.focus();
    return false;
  }
  return true;
}



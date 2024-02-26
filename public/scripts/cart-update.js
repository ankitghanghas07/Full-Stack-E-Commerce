const quantityInputs = document.querySelectorAll(".cart-item input");
const totalPrice = document.querySelector("#Total span");
const badgeElement = document.getElementsByClassName('badge');

async function updateCart(event) {
  const newQuantity = event.target.value;
  const productid = event.target.dataset.productid;
  const csrfToken = event.target.dataset.csrf;

  let response = await fetch("/cart/update", {
    method: "post",
    body: JSON.stringify({
      productId: productid,
      newQuantity: newQuantity,
      _csrf: csrfToken,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if(!response.ok){
    alert("something went wrong");
    return;
  }

  response = await response.json(); // parse json response to js object

  event.target.parentElement.firstElementChild.textContent = '$' + response.newProductTotal.toString();
  totalPrice.innerHTML =  `<b> Total $${response.newTotalPrice.toString()} </b> `;
  badgeElement[0].textContent = response.newTotalQuantity;
}

for (const quantityInput of quantityInputs) {
  quantityInput.addEventListener('change', updateCart);
}

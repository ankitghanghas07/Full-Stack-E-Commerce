const addToCartBtn = document.querySelector("#product-info button");
const badgeElements = document.querySelectorAll(".nav-items .badge");

// fetch returns a promise, hence make this func async.
async function addToCart() {
  const productId = addToCartBtn.dataset.productid;
  const csrfToken = addToCartBtn.dataset.csrf;

  let response;

  try {
    response = await fetch("/cart/items", {
      method: "post",
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  } catch (error) {
    alert("something went wrong");
    return;
  }

  if (!response.ok) {
    alert("something went wrong.");
    return;
  }

  response = await response.json();
  for(const badge of badgeElements){
    badge.textContent = response.newTotalQuantity;
  }
}

addToCartBtn.addEventListener("click", addToCart);

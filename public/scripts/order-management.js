// update order using AJAX

const updateOrderFormElements = document.querySelectorAll(".order-list form");

async function updateOrder(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const selectedStatus = formData.get("status");
  const orderid = formData.get("orderid");
  const csrfToken = formData.get("_csrf");

  let response = await fetch(`/admin/orders/${orderid}`, {
    method: "PATCH",
    body: JSON.stringify({
      _csrf: csrfToken,
      newStatus : selectedStatus,
    }),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    alert("something went wrong.");
    return;
  }

  response = await response.json();
  form.parentElement.parentElement.parentElement.querySelector(
    ".badge"
  ).textContent = response.newStatus;
}

for (const updateOrderFormElement of updateOrderFormElements) {
  updateOrderFormElement.addEventListener("submit", updateOrder);
}

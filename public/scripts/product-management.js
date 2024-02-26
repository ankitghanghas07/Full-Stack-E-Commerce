const deleteProductButtons = document.querySelectorAll('.product-item button');

async function deleteProduct(event){
    const buttonElement = event.target;
    const productId = buttonElement.dataset.id;
    const csrfToken = buttonElement.dataset.csrf;
    // console.log(productId);

    // AJAX, behind the scenes request.
    await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`,{
        method : 'delete'
    });

    // now update DOM.
    buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for(const deleteProductButton of deleteProductButtons){
    deleteProductButton.addEventListener('click', deleteProduct);
}
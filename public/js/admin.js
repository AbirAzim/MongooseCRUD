const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const delteElement = btn.closest('div').parentNode;

    fetch('/admin/delete-product/' + productId, {
            method: 'DELETE',
            headers: {
                'csrf-token': csrf
            }
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            delteElement.parentNode.removeChild(delteElement);
        })
        .catch(err => {
            console.log(err);
        })
}
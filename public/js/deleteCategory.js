async function deleteCategory(deleteCategory) {

    tryRetry(async () => {
        const res = await fetch('/admin/delete-category/' + deleteCategory, {
            method: 'DELETE',
        });

        if (res.ok) {
            showPopup('Kategoria usunięta', true, '/admin/categories', buttonText = 'Ok');
        } else {
            showPopup('Nie udało się usunąć kategorii', true, '/admin/categories', buttonText = 'Ok');
        }
    });
}
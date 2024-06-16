async function deleteCategory(deleteCategory) {
    try {
        const res = await fetch('/admin/delete-category/' + deleteCategory, {
            method: 'DELETE',
        });

        if (!res.ok) {
            showPopup('Kategoria usunięta', true, '/admin/categories');
        } else {
            showPopup('Nie udało się usunąć kategorii', true, '/admin/categories');
        }
    } catch (error) {
        console.log(error);
    }
}
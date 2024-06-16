const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const currentURL = window.location.href;

    const formData = new FormData(form);
    const categories = [];
    document.querySelectorAll('input[name="category"]:checked').forEach(category => {
        categories.push(category.value);
    });

    formData.append('categories', JSON.stringify(categories));

    try {
        const res = await fetch(currentURL, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const feedback = await res.json();
            document.getElementById('edit-doc-error-wrapper').innerText = Object.values(feedback.errors)[0];
        } else {
            showPopup('Dokument został zaktualizowany.');
        }
    } catch (error) {
        console.log(error);
        document.getElementById('edit-doc-error-wrapper').innerText = 'Wystąpił błąd podczas aktualizacji dokumentu.';
    }
});
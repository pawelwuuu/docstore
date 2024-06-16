const form = document.querySelector('.add-document-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const categories = [];
    document.querySelectorAll('input[name="category"]:checked').forEach(category => {
        categories.push(category.value);
    });

    formData.append('categories', JSON.stringify(categories));

    try {
        const res = await fetch('/add-document', {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            const feedback = await res.json();
            const errorStr = Object.values(feedback.errors)[0];
            document.querySelector('.add-document-error-wrapper').innerText = errorStr;
        } else {
            showPopup('Dokument został dodany.', false);
        }
    } catch (error) {
        document.querySelector('.add-document-error-wrapper').innerText = 'Wystąpił błąd podczas dodawania dokumentu.';
    }
});
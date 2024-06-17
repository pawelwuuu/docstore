const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    tryRetry(async () => {
        const currentURL = window.location.href;
        const formData = new FormData(form);
        const categories = [];
        document.querySelectorAll('input[name="category"]:checked').forEach(category => {
            categories.push(category.value);
        });

        formData.append('categories', JSON.stringify(categories));

        const res = await fetch(currentURL, {
            method: 'POST',
            body: formData,
        });

        if (res.status >= 400 && res.status < 500) {
            const feedback = await res.json();
            document.getElementById('edit-doc-error-wrapper').innerText = Object.values(feedback.errors)[0];
        } else if (res.ok) {
            showPopup('Dokument został zaktualizowany.');
        } else if (res.status >= 500 && res.status < 600) {
            throw new Error();
        }
    });
});
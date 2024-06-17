const form = document.querySelector('.add-document-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    tryRetry(async () => {
        const formData = new FormData(form);
        const categories = [];
        document.querySelectorAll('input[name="category"]:checked').forEach(category => {
            categories.push(category.value);
        });

        formData.append('categories', JSON.stringify(categories));

        const res = await fetch('/add-document', {
            method: 'POST',
            body: formData,
        });

        if (res.status >= 400 && res.status < 500) {
            const feedback = await res.json();
            const errorStr = Object.values(feedback.errors)[0];
            document.querySelector('.add-document-error-wrapper').innerText = errorStr;
        } else if (res.ok) {
            showPopup('Dokument został dodany.', false);
        } else if (res.status >= 500) {
            throw new Error();
        }
    });
});
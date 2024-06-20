const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    tryRetry(async () => {
        const docId = form.querySelector('input[name="documentId"]').value;
        const userId = form.querySelector('input[name="userId"]').value;

        const res = await fetch(`/add-comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentId: docId,
                userId: userId,
                content: form.querySelector('#contentInput').value
            }),
        });

        if (res.status === 422) {
            const feedback = await res.json();
            console.log(feedback);
            document.getElementById('add-comment-error-wrapper').innerText = Object.values(feedback.errors)[0];
        } else if (res.ok) {
            showPopup('Komentarz został dodany.', true, location.href,'Ok');
            form.reset();
        } else if (res.status >= 500 && res.status < 600) {

            throw new Error('Nie udało się dodać komentarza.');
        }
    });
});

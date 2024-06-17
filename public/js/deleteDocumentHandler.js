const deleteLink = document.getElementById('delete-document-link');

deleteLink.addEventListener('click', async function (event) {
    event.preventDefault();

    tryRetry(async () => {
        const response = await fetch(deleteLink.href, {
            method: 'DELETE'
        });

        if (response.ok) {
            showPopup('Dokument został usunięty', false);
        } else {
            if (response.status >= 500 && response.status < 600) {
                throw new Error();
            } else {
                showPopup('Nie udało się usunąć dokumentu');
            }
        }
    });
});

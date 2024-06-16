const deleteLink = document.getElementById('delete-document-link');
let retryAttempts = 3;
const retryInterval = 1500;

deleteLink.addEventListener('click', function(event) {
    event.preventDefault();

    const deleteResource = async () => {
        try {
            const response = await fetch(deleteLink.href, {
                method: 'DELETE'
            });

            if (response.ok) {
                showPopup('Dokument został usunięty', false);
            } else {
                if (response.status >= 500 && response.status < 600) {
                    throw new Error('Server error');
                }
            }
        } catch (error) {
            if (retryAttempts > 0 && error.message === 'Server error') {
                console.log(`Retrying... Attempts left: ${retryAttempts}`);
                setTimeout(deleteResource, retryInterval);
                retryAttempts--;
            } else {
                console.error('Maximum retry attempts reached');
                showPopup('Nie udało się usunąć dokumentu');
            }
        }
    };

    deleteResource();
});


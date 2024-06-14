const deleteLink = document.getElementById('delete-document-link');

deleteLink.addEventListener('click', function(event) {
    event.preventDefault();

    fetch(deleteLink.href, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok) {
            console.log('Resource deleted successfully');
            window.location.href = '/success-page';
        } else {
            console.error('Failed to delete resource');
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});
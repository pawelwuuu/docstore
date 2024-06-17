async function deleteUser(userId) {
    tryRetry(async () => {
        const res = await fetch('/delete-user/' + userId, {
            method: 'DELETE',
        });

        if (res.status < 500 && res.status >= 400) {
            showPopup('Konto nie mogło zostać usunięte.', true, '/admin/users');
        } else if (res.ok) {
            showPopup('Konto zostało usunięte.', true, '/admin/users');
        } else if (res.status >= 500 && res.status < 600) {
            throw new Error();
        }
    });
}
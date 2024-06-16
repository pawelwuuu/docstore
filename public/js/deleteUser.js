async function deleteUser(userId) {
    try {
        const res = await fetch('/delete-user/' + userId, {
            method: 'DELETE',
        });

        if (!res.ok) {
            showPopup('Konto nie mogło zostać usunięte.', true, '/admin/users');
        } else {
            showPopup('Konto zostało usunięte.', true, '/admin/users');
        }
    } catch (error) {
        console.log(error);
    }
}
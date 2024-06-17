const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    tryRetry(async () => {
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;

        const res = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        });

        if (res.status >= 300) {
            const resultJson = await res.json();
            document.getElementById('register-error-wrapper').innerText = (resultJson.validateResult);
        } else if (res.ok) {
            showPopup('Zostałeś zarejstrowany', false);
        } else if (res.status >= 500) {
            throw new Error();
        }
    });
});
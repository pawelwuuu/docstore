const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    await tryRetry(async () => {
        const email = form.email.value;
        const password = form.password.value;

        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'}
        });

        if (res.status >= 400 && res.status < 500) {
            const resultJson = await res.json();
            document.getElementById('login-error-wrapper').innerText = (resultJson.validateResult);
        } else if (res.ok) {
            showPopup('Pomyślnie zalogowano', false);
        } else if (res.status >= 500) {
            throw new Error();
        }
    })
});

const form = document.querySelector('form');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'}
        });
        document.getElementById('register-error-wrapper').innerText = "";

        if (res.status >= 300) {
            const resultJson = await res.json();
            document.getElementById('login-error-wrapper').innerText = (resultJson.validateResult);
        }
    } catch (e) {
        console.log(e)
    }
})
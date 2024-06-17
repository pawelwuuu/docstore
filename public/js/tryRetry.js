async function tryRetry(fn, retries = 5, delay = 1500) {
    for (let i = 0; i < retries; i++) {
        try {
            await fn();
            break;
        } catch (e) {
            console.log(`Niepowodzenie, próba ${i + 1}.`);
            await new Promise(res => setTimeout(res, delay));
        }
    }
}

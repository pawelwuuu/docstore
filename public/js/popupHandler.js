const showPopup = (content, closeable = true, href ='/') => {
    const popup = document.getElementById('popupContainer');
    popup.querySelector('p').innerText = content;
    popup.querySelector('a').href = href;

    if (closeable) {
        var closeButton = document.getElementById("closePopup");
        closeButton.style.display = 'block';

        closeButton.onclick = function() {
            popup.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target === popup) {
                popup.style.display = "none";
            }
        }
    }

    popup.style.display = 'block';
}


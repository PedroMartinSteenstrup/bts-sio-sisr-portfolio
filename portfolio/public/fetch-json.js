document.addEventListener('DOMContentLoaded', function() {
    const jsonElements = document.querySelectorAll('[data-json-src]');

    jsonElements.forEach(element => {
        const jsonSrc = element.getAttribute('data-json-src');
        fetch(jsonSrc)
            .then(response => response.json())
            .then(data => {
                element.textContent = JSON.stringify(data, null, 2);
            })
            .catch(error => console.error('Error fetching JSON:', error));
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const decrementBtn = document.getElementById('decrement');
    const incrementBtn = document.getElementById('increment');
    const numberInput = document.getElementById('number');

    decrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);
        if (currentValue > 0) {
            numberInput.value = currentValue - 1;
        }
    });

    incrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);
        if (currentValue < 10) {
            numberInput.value = currentValue + 1;
        }
    });
    
    const sendNumberBtn = document.getElementById('sendNumber');
    const responseParagraph = document.getElementById('response');

    sendNumberBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);

        // Send the number to the backend using an AJAX request
        fetch('/api/send_number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: currentValue }),
        })
        .then(response => response.json())
        .then(data => {
            // Display the response from the backend
            responseParagraph.textContent = `Response from backend: ${data.message}`;
        });
    });
});



const UPPER_LIMIT_OF_POINTS = 10;
const LOWER_LIMIT_OF_POINTS = -10;


document.addEventListener('DOMContentLoaded', function() {
    const decrementBtn = document.getElementById('decrement');
    const incrementBtn = document.getElementById('increment');
    const numberInput = document.getElementById('number');

    decrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);
        if (currentValue > LOWER_LIMIT_OF_POINTS) {
            numberInput.value = currentValue - 1;
        }
    });

    incrementBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);
        if (currentValue < UPPER_LIMIT_OF_POINTS) {
            numberInput.value = currentValue + 1;
        }
    });
    
    const sendNumberBtn = document.getElementById('sendNumber');
    const responseParagraph = document.getElementById('response');

    sendNumberBtn.addEventListener('click', function() {
        const currentValue = parseInt(numberInput.value);

        // Send the number to the backend using an AJAX request
         promise = fetch('/api/send_number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ number: currentValue }),
        });
          promise = promise.then(response => response.json());
        
           promise = promise.then(anything => {
            // Display the response from the backend
            responseParagraph.textContent = `Response from backend: ${anything.message}`;
        });
    });

    // Data for the bar graph
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Sales',
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            data: [10, 20, 30, 40, 50, 60, 70], // Sample data for the bars
        }]
    };

    // Configuration options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    // Get the canvas element
    const ctx = document.getElementById('myChart').getContext('2d');

    // Create the bar graph
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    
});



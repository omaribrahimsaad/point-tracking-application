const UPPER_LIMIT_OF_POINTS = 10;
const LOWER_LIMIT_OF_POINTS = -10;

function addOption(value, text) {
    const option = document.createElement('option');
    option.value = value;
    option.text = text;
    dropdown.add(option);
  }

function RemoveAllOptions() {
    const options = dropdown.options;
      for (let i = options.length - 1; i >= 0; i--) {
        options[i] = null;
      }
    }
  

function LoadAllOptions()
{
    promise = fetch('/api/get_person_names');
    promise = promise.then(response => response.json());
    promise = promise.then(data => data.forEach(element =>
            addOption(element, element)
        ))
    promise = promise.catch(error => console.log(error));

}

async function registerUser(name) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name }),
        });

        const display = await response.json();
        successMessage.textContent = display.message;
    } catch (error) {
        console.error('Error during registration:', error);
    }
    
}

function SendPointsToBackend(name_value,points_value)
{
    // Send the number to the backend using an AJAX request
     promise = fetch('/api/set_points', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: name_value,
            points: points_value }),
    });
      promise = promise.then(response => response.json());

       promise = promise.then(anything => {
        // Display the response from the backend
        console.log(anything);}
           );
}

document.addEventListener('DOMContentLoaded', function() {

    LoadAllOptions()
    /////////////////////////////////////////////////////////
    //////////////////////// Points Input ////////////////////
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
    
    const dropdown = document.getElementById('dropdown');
    const sendNumberBtn = document.getElementById('sendNumber');
    const responseParagraph = document.getElementById('response');

    sendNumberBtn.addEventListener('click', function() {
        const points_entered = parseInt(numberInput.value);
        const name_entered = dropdown.value;
        
        SendPointsToBackend(name_entered,points_entered);
        
        
    });

    ////////////////////////////////////////////////////////////////
    /////////////////////////Drop Down//////////////////////////////
    const registerBtn = document.getElementById('register');
    const registerNameInput = document.getElementById('username');
    const successMessage = document.getElementById('successMessage');
    
    registerBtn.addEventListener('click', function(){
        // Send the name to the backend using an AJAX request
        const name = registerNameInput.value;
        (async function (){
            await registerUser(name);
            RemoveAllOptions();
            LoadAllOptions();
            
        })();
        registerNameInput.value = '';
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
            indexAxis: 'y',
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



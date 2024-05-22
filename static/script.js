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

async function SendPointsToBackend(name_value,points_value)
{
    // Send the number to the backend using an AJAX request
    const response = await fetch('/api/set_points', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            name: name_value,
            points: points_value }),
    });
      await response.json();
      
}



document.addEventListener('DOMContentLoaded', function() {
    const timeRangeSelect = document.getElementById('time-range-select');
    

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
        
        (async function(){
        await SendPointsToBackend(name_entered,points_entered);
            console.log("Points sent to backend");
         updateChart();
        })()
        
    });

    ////////////////////////////////////////////////////////////////
    /////////////////////////Registeration//////////////////////////////
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
    

    const ctx = document.getElementById('myChart');
    const bar_chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["default"],
          datasets: [{
            label: 'Points Summary',
            data: [2],
          }]
        },
        options: {
            responsive: false,
            indexAxis: 'y',
            scales: {
                y: {
                  beginAtZero: true

                }
          }
        }
      });

    Names = []
    Points = []
    async function updateChart()
    {
          try {
              const response = await fetch('/api/get_person_points_in_rangetime', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ range: timeRangeSelect.value }),
              });
              const dataset = await response.json();
              console.log(dataset);

              dataset.forEach(element => {
                  Names.push(element[0]);
                  Points.push(element[1]);
              })
              bar_chart.data.labels = Names;
              bar_chart.data.datasets[0].data = Points;
            console.log(Names);
              console.log(Points);
              console.log(timeRangeSelect.value)
              bar_chart.update();
              Names = [];
              Points = [];
          } catch (error) {
              console.error('Error during plotting:', error);
          }
     }

    updateChart();
    timeRangeSelect.addEventListener('change', function()
         {
            updateChart();
             
             
         } );
    timeRangeSelect.value = 'week';

});





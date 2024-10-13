$(function () {
    // Initialize the datepicker with today's date
    $("#datepicker").datepicker({ 
        autoclose: true, 
        todayHighlight: true
    }).datepicker('update', new Date());

    // Global variable to store all employees data
    var allEmployees = [];

    // Function to fetch employees for a given date
    function fetchEmployeesForDate(date) {
        // Make the API call to get employees on shift for the selected date
        $.ajax({
            url: `/onshift?shiftDate=${date}`,
            method: 'GET',
            success: function(response) {
                // Store the response in allEmployees
                allEmployees = response;

                // Reset filter to 'All' on new date selection
                resetFilter();

                // Render the employees
                renderEmployees(allEmployees);
            },
            error: function(err) {
                console.error('Error fetching shift data:', err);
                 // Clear allEmployees array to ensure no stale data is shown
                allEmployees = [];
                const teamContainer = $('#teamContainer');
                teamContainer.empty();  // Clear the existing content
                // Optionally handle the error by displaying a message to the user
                teamContainer.append('<p>No employees on shift for this date.</p>');
            }
        });
    }

    // Function to render employees
    function renderEmployees(employees) {
        // Get the container to display the team members
        const teamContainer = $('#teamContainer');
        teamContainer.empty();  // Clear the existing content

        // Check if any employees are returned
        if (employees.length > 0) {
            employees.forEach(employee => {
                // Append each employee's details to the container
                teamContainer.append(`
                    <div class="team-member" onclick="window.location.href='/profile/${employee.employeeId}'">
                        <div class="member-photo">
                            ${employee.image ? `<img src="${employee.image}" alt="${employee.name}">` : ''}
                        </div>
                        <h3>${employee.name}</h3>
                        <p>${employee.shift}</p> <!-- Assuming 'shift' is included in the response -->
                    </div>
                `);
            });
        } else {
            // Display a message if no employees are found for the selected date
            teamContainer.append('<p>No employees on shift for this date.</p>');
        }
    }

    

    // Fetch employees for today's date on page load
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString(); // Get month (1-based)
    let day = today.getDate().toString(); // Get day

    // Convert month and day to integers
    month = parseInt(month, 10);
    day = parseInt(day, 10);

    // Construct the formatted date
    const formattedToday = `${year}-${month}-${day}`;

    // Fetch employees for today's date
    fetchEmployeesForDate(formattedToday);


    // Event handler for when the date changes
    $('#datepicker').on('changeDate', function() {
        // Get the selected date from the input field
        const selectedDate = $('#selectedDate').val();

         // Split the date into components
         let [year, month, day] = selectedDate.split('-');

         // Remove leading zeros from month and day
         month = parseInt(month, 10); // Convert month to integer
         day = parseInt(day, 10);     // Convert day to integer
 
         // Construct the date in the desired format
         const formattedDate = `${year}-${month}-${day}`;
 
         // Fetch employees for the selected date
         fetchEmployeesForDate(formattedDate);
    });

    // Event handler for filter buttons
    $(document).on('click', '.filter-btn', function() {
        const selectedShift = $(this).attr('data-shift');

        // Remove 'btn-primary' and add 'btn-outline-primary' to all buttons
        $('.filter-btn').removeClass('btn-primary').addClass('btn-outline-primary');

        // Add 'btn-primary' to the clicked button
        $(this).removeClass('btn-outline-primary').addClass('btn-primary');

        if (allEmployees.length === 0) {
            renderEmployees(allEmployees); 
            return;
        }

        if (selectedShift === 'All') {
            // Show all employees
            renderEmployees(allEmployees);
        } else {
            // Filter employees by shift
            const filteredEmployees = allEmployees.filter(employee => employee.shift === selectedShift);
            renderEmployees(filteredEmployees);
        }
    });

    // Function to reset the filter to 'All'
    function resetFilter() {
        // Remove 'btn-primary' and add 'btn-outline-primary' to all buttons
        $('.filter-btn').removeClass('btn-primary').addClass('btn-outline-primary');
        // Set 'All' button as active
        $('.filter-btn[data-shift="All"]').removeClass('btn-outline-primary').addClass('btn-primary');
    }

    

    
});



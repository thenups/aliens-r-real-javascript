// Get references to the tbody element, input field and button
var $tbody = document.querySelector("tbody");
var $dateInput = document.querySelector("#date");
var $cityInput = document.querySelector("#city");
var $stateInput = document.querySelector("#state");
var $countryInput = document.querySelector("#country");
var $shapeInput = document.querySelector("#shape");
var $searchBtn = document.querySelector("#search");
var $resetBtn = document.querySelector("#reset");

// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener("click", handleSearchButtonClick);
$resetBtn.addEventListener("click", handleResetButtonClick);

// Set filteredData to dataSet initially
var filteredData = dataSet;

// Find all unique values for dropdowns
var allStates = [...new Set(dataSet.map(data => data.state))];
var allCountries = [...new Set(dataSet.map(data => data.country))];
var allShapes = [...new Set(dataSet.map(data => data.shape))];

// Set pagination variables
var pageList = new Array();
var currentPage = 1;
var numberPerPage = 25;
var numberOfPages;

function resetData(){
    filteredData = dataSet;
    filteredData.forEach( data => delete data.durationMinutes );
};

// Function to create dropdown
function renderDropdown(arr, $parent) {
    arr.sort();

    for (i=0 ; i < arr.length ; i++) {
        var $option = document.createElement("option");
        $option.innerText = arr[i];
        $parent.appendChild($option);
    }
};

// renderTable renders the filteredAddresses to the tbody
function renderTable(start,end) {
    $tbody.innerHTML = "";

    var c=0;
    for (var i=start, c; i<end; i++,c++) {
        // Get get the current data object and its fields
        var sightings = filteredData[i];
        // Create a new row in the tbody, set the index to be i + startingIndex
        var $row = $tbody.insertRow(c);

        for (var j = 0; j < fields.length; j++) {
            // For every field in the data object, create a new cell at set its inner text to be the current value at the current address's field
            var field = fields[j];
            var $cell = $row.insertCell(j);

            $cell.innerText = sightings[field];
            // $cell.classList.add(classes[j]);
        }
    }

};

function handleSearchButtonClick() {

    var inputArr = [["datetime",$dateInput],["city",$cityInput],["state",$stateInput],["country",$countryInput],["shape",$shapeInput]];

    var query = {};

    for ( i=0; i<inputArr.length; i++) {
        try {
            var val = inputArr[i][1].value.trim().toLowerCase();
            console.log(val);
            inputArr[i][1] = val;
        }
        catch(err) {
            inputArr[i][1] = 0;
        }
    }

    // Create Query
    for (i=0; i<inputArr.length; i++) {
        if (inputArr[i][1] != 0) {
            query[inputArr[i][0]] = inputArr[i][1];
        }
    };

    console.log(query);

    filteredData = filteredData.filter(function(data) {
        for(var key in query) {
            // if (key === "datetime") {
            //     console.log(query[key] +" "+ data[key]);
            //     // return false;
            // }
            if(data[key] === undefined || data[key] != query[key])
                return false;
        }
        return true;
    });
    console.log(filteredData.length);

    renderTable()
};

function handleResetButtonClick() {
    console.log('reset');


    resetData();
    renderTable();
}

function paginate() {
    numberOfPages = Math.ceil(filteredData.length / numberPerPage);
    console.log(numberOfPages);

    var firstItem;
    var lastItem;

    if (numberOfPages === 1) {
        console.log('there is less than 1 page');
        firstItem = 0;
        lastItem = filteredData.length;
    }
    else {
        console.log('there are so many pages', numberOfPages);
        firstItem = 25;
        lastItem = 35;
    };






    renderTable(firstItem,lastItem);
}

function populatePagination() {

}







resetData();
// Get all fields
var fields = Object.keys(filteredData[0]);
console.log(fields);

paginate()
// renderTable(25,35);
console.log(filteredData);
console.log("Table Rendered");

renderDropdown(allStates, $stateInput);
renderDropdown(allCountries, $countryInput);
renderDropdown(allShapes, $shapeInput);
console.log("Dropdowns Rendered");

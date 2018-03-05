// Get references to the tbody element, input field and button
var $tbody = document.querySelector('tbody');
var $dateInput = document.querySelector('#date');
var $cityInput = document.querySelector('#city');
var $stateInput = document.querySelector('#state');
var $countryInput = document.querySelector('#country');
var $shapeInput = document.querySelector('#shape');
var $searchBtn = document.querySelector('#search');
var $resetBtn = document.querySelector('#reset');


// Add an event listener to the searchButton, call handleSearchButtonClick when clicked
$searchBtn.addEventListener('click', handleSearchButtonClick);
$resetBtn.addEventListener('click', resetData);

// Set filteredData to dataSet initially
var filteredData = dataSet;
var fields;

// Find all unique values for dropdowns
var allStates = [...new Set(dataSet.map(data => data.state))];
var allCountries = [...new Set(dataSet.map(data => data.country))];
var allShapes = [...new Set(dataSet.map(data => data.shape))];

// Set pagination variables
var pageList = new Array();
var currentPage = 0;
var numberPerPage = 50;
var numberOfPages;

function resetData(){
    filteredData = dataSet;
    filteredData.forEach( data => delete data.durationMinutes );

    // Get all fields
    fields = Object.keys(filteredData[0]);

    currentPage = 0;

    // Render dropdowns
    resetFields();
    displaySelectedRows()
    // renderPageButtons();
    // displaySelectedRows();
};

// Function to create dropdown
function renderDropdown(arr, $parent, dropdown) {
    arr.sort();
    $parent.innerHTML = '<option value="" selected disabled>' + dropdown + '</option>';

    for (i=0 ; i < arr.length ; i++) {
        var $option = document.createElement('option');
        $option.innerText = arr[i];
        $parent.appendChild($option);
    }
};

function resetFields(){
    renderDropdown(allStates, $stateInput, 'state');
    renderDropdown(allCountries, $countryInput, 'country');
    renderDropdown(allShapes, $shapeInput, 'shape');
}

// renderTable renders the filteredAddresses to the tbody
function renderTable(start,end) {
    $tbody.innerHTML = '';

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

    var inputArr = [['datetime',$dateInput],['city',$cityInput],['state',$stateInput],['country',$countryInput],['shape',$shapeInput]];

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
            if(data[key] === undefined || data[key] != query[key])
                return false;
        }
        return true;
    });
    console.log(filteredData.length);

    renderPageButtons();
    displaySelectedRows();
};

function renderPageButtons() {
    numberOfPages = Math.ceil(filteredData.length / numberPerPage);
    console.log(numberOfPages);

    $ul = document.querySelector('#pagination');
    $ul.innerHTML = '';

    var $li = document.createElement('li');
    $li.innerHTML = '<a href="#main-table" aria-label="Previous" id="$previousPage"><span aria-hidden="true">&laquo;</span></a>';
    $ul.appendChild($li);

    for (i=0; i<numberOfPages; i++) {
        var $li = document.createElement('li');
        var $a = document.createElement('a');

        $a.setAttribute('class','pageNumber');
        $a.setAttribute('id',i);
        // $a.setAttribute('href','');
        $a.innerText = i+1;

        $li.appendChild($a);
        $ul.appendChild($li);
    }

    $li = document.createElement('li');
    $li.innerHTML = '<a href="#main-table" aria-label="Next" id="$nextPage"><span aria-hidden="true">&raquo;</span></a>';
    $ul.appendChild($li);

    var $nextPage = document.querySelector('#next');
    var $numberPage = document.getElementsByClassName('pageNumber');
    var $previousPage = document.querySelector('#previous');

    // $nextPage.addEventListener('click', handleNextClick);
    // $previousPage.addEventListener('click',handlePreviousClick);

    for (var i=0; i < $numberPage.length; i++) {
        $numberPage[i].addEventListener('click', handlePageClick);
    };

};

function displaySelectedRows() {

    var firstItem = currentPage * numberPerPage;
    var lastItem;

    if ((filteredData.length-firstItem)>numberPerPage) {
        lastItem = firstItem + numberPerPage;
    }
    else {
        lastItem = firstItem + (filteredData.length - firstItem);
    }
    console.log(firstItem);
    console.log(lastItem);

    renderTable(firstItem,lastItem);
};



function handlePageClick(page) {
    console.log('you clicked on a page!!!!');
    currentPage = event.target.id;

    displaySelectedRows();
}

resetData();
renderPageButtons();

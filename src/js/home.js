import './jquery-ui.min';
import './fm.tagator.jquery';
import social from '../js/social.js';
import firebase from 'firebase/app';
import 'firebase/database'

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAy-ss_MvS5uioLUdxTYkuuhed-HjW0RkE",
  authDomain: "newagent-50447.firebaseapp.com",
  databaseURL: "https://newagent-50447.firebaseio.com",
  projectId: "newagent-50447",
  storageBucket: "newagent-50447.appspot.com",
  messagingSenderId: "920466406897"
};
firebase.initializeApp(config);

let currentSchool = ''; // school currently selected
let rawData = []; // container for the raw json data from API (all schools)
let matchingSchools = []; // contains all matching schools obeying filter
let schoolNames = []; // used for the autocomplete (check getSchoolNames)
let filteredItems = []; // container of all the schools matching current filter, thus being shown
let listLength; // Used to determine what error messages to throw for dummies searching
let states = []; // Used to add multiple states to the search
const schoolUrl = `school.html?unitid=`; //template for endpoint for individual school detail info

// caching HTML elements so we don't have to traverse the dom every time
const errorMessage = $('#progress-box .error, #progress-box-mobile .error'); //error message modal
const schoolListUl = $('#schools-list'); // where the filtered schools will be rendered
const programArray = ['Agriculture Agriculture Operations and Related Sciences',
                'Natural Resources and Conservation',
                'Architecture and Related Services',
                'Area Ethnic Cultural Gender and Group Studies',
                'Communication Journalism and Related Programs',
                'Communications Technologies/Technicians and Support Services',
                'Computer and Information Sciences and Support Services',
                'Personal and Culinary Services',
                'Education',
                'Engineering',
                'Engineering Technologies and Engineering-Related Fields',
                'Foreign Languages Literatures and Linguistics', 
                'Family and Consumer Sciences/Human Sciences', 
                'Legal Professions and Studies',
                'English Language and Literature/Letters',
                'Liberal Arts and Sciences General Studies and Humanities',
                'Library Science',
                'Biological and Biomedical Sciences',
                'Mathematics and Statistics',
                'Military Technologies and Applied Sciences',
                'Multi/Interdisciplinary Studies',
                'Parks Recreation Leisure and Fitness Studies',
                'Philosophy and Religious Studies',
                'Theology and Religious Vocations',
                'Physical Sciences',
                'Science Technologies/Technicians',
                'Psychology',
                'Homeland Security Law Enforcement Firefighting and Related Protective Services',
                'Public Administration and Social Service Professions',
                'Social Sciences',
                'Construction Trades',
                'Mechanic and Repair Technologies/Technicians',
                'Precision Production',
                'Transportation and Materials Moving',
                'Visual and Performing Arts',
                'Health Professions and Related Programs',
                'Business Management Marketing and Related Support Services',
                'History']
//object that will keep the current state of the filters any time filters change
//starts with every filter as null
const filters = {
  stateabbr: null,
  schoolcontrol: null,
  programs:null,
  urbanization: null,
  enrollment1617: null,
  degreetype: null
};

// start of the script on page load
$(function(){
  //request the API for raw SCHOOLS data
  fetchInitialData();
  registerAllEvents();
  //hides the school list results UL before any search is made
  $('#search-results').hide();
});

const fetchInitialData = function(){
  $.getJSON("./data/form-data.json", (data) => {
    //assign the response object to var rawData
    rawData = data;
    // map all schools for the autocomplete
    getSchoolNames(data);
    /*
      - assigns a COPY of the rawData to the filteredItems
      - at begining, as there are no filters selected, filteredItems are all the Items
    */
    filteredItems = [...rawData];
    // initializes empty filter values on the infobox (popup with filter information)
    printInfoBox(filters);
  });
}
const database = firebase.database();

const ref = firebase.database().ref('searches');

const registerAllEvents = function(){
  //assign eventHandlers to filter inpunts
  setEventForSchoolType();
  // behavior for seatch input
  setSearchBehavior();


  //using event delegation, so we don't have to register multiple events
  //and reregister every time filter changes
  schoolListUl.click(function(ev){
    ev.preventDefault()
    const target = ev.target
    if(!target.href){
      return
    }
    const unitid = $(target).data('unitid')
    showSearchResult({unitid});
  });

  // Tabs toggle
  $('.btn').click(function(){
    const tabId = $(this).attr('data-tab');

    $('.btn').removeClass('selected-btn');
    $('.tab-content').css('display','none');

    $(this).addClass('selected-btn');
    $("#"+tabId).addClass('selected-btn').css('display','block');
  });

  //behavior for the search button
  $('#filter-search').click(function(e){
    if($(this).attr('data-function') === 'find'){
      e.preventDefault();

      //user needs to pick a state before trying to filter
      if ( filters.stateabbr !== null){
        let allChoices = [];
        errorMessage.addClass('hide');
        $('#search-results').show();
        allChoices.push(filters.schoolcontrol,filters.enrollment1617, filters.degreetype,$("#states").val())
        ref.push(allChoices)
        $(this).attr('data-function','again');
        $(this).text('SEARCH AGAIN');
        setTimeout(function () {
          $('html, body').animate({
              scrollTop: $('#filter-search').offset().top - 65
          }, 400);
        }, 50);

        // otherwise, error msg is showing
      } else {
        $('#search-results').hide();
        errorMessage.removeClass('hide');
        $(this).attr('data-function','find');
        $(this).text('FIND SCHOOLS');
      }
    } else {
      //reloads the page if the user wants to clear the form and start over
      location.reload();
    }
  });

}
// Used to check program container
function carriesPrograms(array_a, array_b){ 
  return array_a.every((val) => array_b.includes(val))
}

// opens the resulting url for the selected school in a new window
function showSearchResult(school) {
  // if there is a school result from the search bar or form ...
  if (school) {
    // grab the base href of the current window
    let baseHref = window.location.href;
    // check if there's a file name in that href. if so, remove it
    if (baseHref.includes('school') === true) {
      baseHref = baseHref.substring(0, baseHref.lastIndexOf('/')) + '/'
    } else if (baseHref.includes('.html') === true) {
      baseHref = baseHref.substring(0, baseHref.lastIndexOf('/'));
    }
    // open a new window to the page resulting from the base href, school url and
    // school unit id number.
    window.open(`${baseHref}${schoolUrl}${school.unitid}`, '_self');
  }
}
// allows users to search without clicking the autocomplete
function determineSchool(school) {
  // first determines if a school object if provided through the autocomplete
  if (school) {
    // if so, show that school's page
    showSearchResult(school)
  } else if ($('.search-group').find('input').val().length >= 0) {
    // else, check if there is input in the #tags input element
    // if so, grab that value
    const enteredSchool = $('.search-group').find('input').val();
    // see if it matches a school in the raw data
    const returnedSchool = rawData.find(school => school.schoolname === enteredSchool);
    // if it does, show that school page
    if (returnedSchool) {
      showSearchResult(returnedSchool);
    } else {
      // if not, let the user know
      if ($('#tags')[0].value == '') {
        $('.alert-search').removeClass('alert-search-hidden')
        $('.alert-search').text('Please begin typing to search schools')
        setTimeout(()=> {
          $('.alert-search').addClass('alert-search-hidden')
        }, 800)
      } else if (listLength == 0) {
        $('.alert-search').removeClass('alert-search-hidden')
        $('.alert-search').text('No schools found, please revise your search')
        setTimeout(()=> {
          $('.alert-search').addClass('alert-search-hidden')
        }, 800)
      } else {
        $('.alert-search').removeClass('alert-search-hidden')
        $('.alert-search').text('Select a school from the list below and then click search')
        setTimeout(()=> {
          $('.alert-search').addClass('alert-search-hidden')
        }, 800)
      }
    }
  } else {
    // if there is no input in the search bar, and the user searches anyway,
    // instruct them to enter a valid school name
    $('.alert-search').removeClass('alert-search-hidden')
    $('.alert-search').text('Begin typing to search schools')
    setTimeout(()=> {
      $('.alert-search').addClass('alert-search-hidden')
    }, 800)
  }
}

const setSearchBehavior = function(){
  // Top of page search button click
  let resultingSchool;
  // one click event listener for both search buttons
  $('#search, #results-search').click(function(evt) {
    evt.preventDefault();
    determineSchool(resultingSchool);
  });

  // adds support for clicking the enter key on the input field
  $('#tags, #schools-searchbar').keyup(function(e) {
    if ($(this).is(':focus') && (e.keyCode === 13)) {
      determineSchool(resultingSchool);
    }
  });

  //setting up the autocomplete
  $("#tags, #schools-searchbar").autocomplete({
    source: function(request, response){
      const term = request.term.toLowerCase();
      const matchingSchools = rawData.filter(school => {
        const schoolName = school.schoolname.toLowerCase();
        const aliasName = school.aliasname.toLowerCase();
        const toMatch = schoolName + aliasName;
        return toMatch.includes(term)
      }).map(school => school.schoolname);
      listLength = matchingSchools.length;
      response(matchingSchools);
    },
    delay: 600,
    minLength: 3,
      select: function(event, ui) {
        const schoolSelected = ui.item.value;
        resultingSchool = rawData.find(school => school.schoolname === schoolSelected);
      }
  });
}
function handleTagChange(ev){
  const cb = $(this);

  // traverses up the DOM to find which filter this cb belongs to
  var spread = $(cb).val().split(",")
  // console.log(cb, $(cb).val() , filterType)
  filters.programs = spread
        .map((cb) => {
          return programArray.indexOf(cb) + 1
        })
  //reconstruct filteredItems to reflect the current filter selections
  runFilters();

  //re-render the school list UL with the new filteredItems collection
  printSchoolList()
}

//fires whenever a filter checkbox is changed
function handleCheckBoxChange(ev){
  //registers the actual checkbox that was clicked

  const cb = $(this);
  // traverses up the DOM to find which filter this cb belongs to
  var parent = cb.parent();
  var cbGroup = parent.find('.chk')
  var filterType = parent.attr('id').substr(7);

  //depending on the filterType, changes the filters object to reflect the current state
  switch(filterType){
    case 'type':
      filters.schoolcontrol = cbGroup.filter(':checked')
        .toArray()
        .map((cb) => $(cb).val())
      break;
    case 'degree':
      filters.degreetype = cbGroup.filter(':checked')
        .toArray()
        .map((cb) => $(cb).val())
      break;

    case 'size':
      filters.size = cbGroup.filter(':checked')
        .toArray()
        .map((cb) => $(cb).val())
      break;
    case 'urbanization':
      filters.urbanization = cbGroup.filter(':checked')
        .toArray()
        .map((cb) => $(cb).val())
      break; 
      
    // case 'schoolcontrol':
    //   filters.size = cbGroup.filter(':checked')
    //     .toArray()
    //     .map((cb) => $(cb).val())
    //   break;
  }

  //reconstruct filteredItems to reflect the current filter selections
  runFilters();

  //re-render the school list UL with the new filteredItems collection
  printSchoolList()
}

//renders the school list UL with the new filteredItems collection
function printSchoolList(){

  const html = filteredItems
    .map(school => `<li><a href="#" data-unitid="${school.unitid}">${school.schoolname}</a></li>`)
    .join('')
  document.getElementById('schools-list').innerHTML = html
}

function runFilters(){
  filteredItems = [...rawData]

  if(!filters.stateabbr){
      printInfoBox(filters);
      return errorMessage.removeClass('hide')
  }
  errorMessage.addClass('hide')
  Object.keys(filters).forEach(key => {
    const filterValue = filters[key]
    if(!filterValue || filterValue.length === 0){
      return
    }

    switch(key){
      case 'stateabbr':
        if (typeof filterValue === 'string') {
          filteredItems = filteredItems
            .filter(school => school.stateabbr === filterValue)
        } else {
          filteredItems = filteredItems
            .filter((school) => {
              return filterValue.includes(school.stateabbr);
            })
        }

        break;
      case 'programs':
        filteredItems = filteredItems
          .filter((school) => {
            if (filterValue[0] === 0) {
              return school
            } else {
              return carriesPrograms(filterValue,school[key])
            }
          })
        break;
      case 'schoolcontrol':
        filteredItems = filteredItems
          .filter(school => filterValue.includes(school[key]))
        break;
      case 'urbanization':
        filteredItems = filteredItems
          .filter(school => filterValue.includes(school[key]))
        break;
      case 'enrollment1617':
      // case 'tuition':
      //   const className = key === 'tuition' ? 'price' : 'size';
      //   var topBracket = $('.chk.' + className).toArray().pop().value
      //   if(filterValue === topBracket){
      //     filteredItems = filteredItems
      //       .filter(school => filterValue <= school[key])
      //   } else {
      //     filteredItems = filteredItems
      //       .filter(school => filterValue > school[key])
      //   }
      //   break;
      case 'size':
        var spl;
        var spl2;
        var spl3;

        if (filters[key].length > 3) {
            filteredItems = filteredItems
            } else if (filters[key].length === 3) {
              spl = filters[key][0].split(",")
              spl2 = filters[key][1].split(",")
              spl3 = filters[key][2].split(",")

              filteredItems = filteredItems
              .filter((school) => {
                return (school.enrollment1617 > parseInt(spl[0]) && school.enrollment1617 < parseInt(spl[1])) || (school.enrollment1617 > parseInt(spl2[0]) && school.enrollment1617 < parseInt(spl2[1])) || (school.enrollment1617 > parseInt(spl3[0]) && school.enrollment1617 < parseInt(spl3[1]))
              })
            } else if (filters[key].length === 2) {
              spl = filters[key][0].split(",")
              spl2 = filters[key][1].split(",")
              filteredItems = filteredItems
              .filter((school) => {
                return (school.enrollment1617 > parseInt(spl[0]) && school.enrollment1617 < parseInt(spl[1])) || (school.enrollment1617 > parseInt(spl2[0]) && school.enrollment1617 < parseInt(spl2[1]))
              })
            } else {
              spl = filters[key][0].split(",")
              filteredItems = filteredItems
              .filter((school) => {
                return school.enrollment1617 > parseInt(spl[0]) && school.enrollment1617 < parseInt(spl[1])
              })
            }
        
            break;
        }
  })
  printInfoBox(filters);
}

function setEventForSchoolType(){
  $('#input_tagator1').on('change', handleTagChange)
  $('.chk').on('change', handleCheckBoxChange);
  $('#states').on('change', onSelectChange);
  $("rect").click(mapClick);
}

function getSchoolNames(data){
  $.each(data, (k, v) =>  {
    if (schoolNames.indexOf(v.schoolname) === -1 || schoolNames.indexOf(v.aliasname) === -1){
      schoolNames.push(v.schoolname);
    }
  });
}

function mapClick() {
  // Get the id of the state we clicked on
  const stateId = $(this).attr('id');
  
  if (states.includes(stateId)) {
    states = states.filter(function(state){
        return state != stateId;
    })
  } else {
    states.push(stateId)
  }

  // Update the dropdown
  $("#states").val(stateId);
  // $('#states').trigger('change')
  const mapStateName = $("#states option:selected").text();

  // Highlight the relevant state
  setState(stateId);
  filters.stateabbr = states;
  runFilters();
  printSchoolList();
}


// Map and states handling

function onSelectChange(ev){
  const selectedState = $("#states").val();
  filters.stateabbr = selectedState;
  states.push(selectedState)
  // if (states.includes(selectedState)) {
  //   //
  // } else {
  //   states.push(selectedState)
  // }
  // Highlight the relevant state on the map
  setState(selectedState);
  runFilters();
  printSchoolList();
}

function printInfoBox(filters){
  const emptyFilterText = 'NO SELECTION(S) MADE'
  // Find index value of selected state
  const stateIndex = $('#states').find(":selected").index();
  let stateName = states.join(", ")
  const priceSpan = $('.price:checked').attr('data-label');
  const sizeSpan = $("#choose-size input:checkbox:checked").map(function(){
        return this.value;
    }).get().join(', ');
  const selectedType = $("#choose-type input:checkbox:checked").map(function(){
        return this.value;
    }).get().join(', ');
  const selectedDegree = $("#choose-degree input:checkbox:checked").map(function(){
          return this.value;
      }).get().join(', ');

  $('.chosen-state span').html(stateName || emptyFilterText);
  $('.chosen-price span').html(priceSpan || emptyFilterText);
  $('.chosen-degree span').html(selectedDegree || emptyFilterText);
  $('.chosen-type span').html(selectedType || emptyFilterText);
  $('.chosen-size span').html(sizeSpan || emptyFilterText);
  $('.your-schools span').html(filteredItems.length);
}

//Autocomplete tag function
$(function () {
  var $input_tagator1 = $('#input_tagator1');
  var $activate_tagator1 = $('#activate_tagator1');
  $activate_tagator1.click(function () {
    if ($input_tagator1.data('tagator') === undefined) {
      $input_tagator1.tagator({
        autocomplete: [""],
        useDimmer: false
      });
      $activate_tagator1.val('destroy tagator');
    } else {
      $input_tagator1.tagator('destroy');
      $activate_tagator1.val('activate tagator');
    }
  });
  $activate_tagator1.trigger('click');
});

$('#input_tagator1').tagator({
  autocomplete: ['Agriculture Agriculture Operations and Related Sciences',
                'Architecture and Related Services',
                'Area Ethnic Cultural Gender and Group Studies',
                'Biological and Biomedical Sciences',
                'Business Management Marketing and Related Support Services',
                'Communication Journalism and Related Programs',
                'Communications Technologies/Technicians and Support Services',
                'Computer and Information Sciences and Support Services',
                'Construction Trades',
                'Education',
                'Engineering',
                'Engineering Technologies and Engineering-Related Fields',
                'English Language and Literature/Letters',
                'Family and Consumer Sciences/Human Sciences',
                'Foreign Languages Literatures and Linguistics',
                'Health Professions and Related Programs',
                'History',
                'Homeland Security Law Enforcement Firefighting and Related Protective Services',
                'Legal Professions and Studies',
                'Liberal Arts and Sciences General Studies and Humanities',
                'Library Science',
                'Mathematics and Statistics',
                'Mechanic and Repair Technologies/Technicians',
                'Military Technologies and Applied Sciences',
                'Multi/Interdisciplinary Studies',
                'Natural Resources and Conservation',
                'Parks Recreation Leisure and Fitness Studies',
                'Personal and Culinary Services',
                'Philosophy and Religious Studies',
                'Physical Sciences',
                'Precision Production',
                'Psychology',
                'Public Administration and Social Service Professions',
                'Science Technologies/Technicians',
                'Social Sciences',
                'Theology and Religious Vocations',
                'Transportation and Materials Moving',
                'Visual and Performing Arts'],
  useDimmer: false
});

function setState(stateId){
  if ($('#'+stateId).hasClass('state-selected')) {
    $('#'+stateId).removeClass("state-selected");
  } else {
    $('#'+stateId).addClass('state-selected');
  }
  // Remove "selected" class from current state
  // $(".state-selected").removeClass("state-selected");
  // Add "selected" class to new state
  
}
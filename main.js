//Meetup API
//autorization for OAuth
const loginURL = `https://secure.meetup.com/oauth2/authorize?client_id=flaq16ghlsndfol2m7jkfe1pfk&response_type=token&redirect_uri=https://jmkeller3.github.io/BoardGameNight/`;
const url = window.location.href;
const regex = /(?:#|\?|&)(?:([a-zA-Z_]+)=([^&]+))*/g;
let matcher;
let queryParams = {};
while(matcher = regex.exec(url)) {
    const [,key, val] = matcher;
    queryParams[key] = val;
}
if (Object.keys(queryParams).length) {
    // Authenticated
    const requestURL = `https://api.meetup.com/2/concierge?access_token=${queryParams.access_token}&zip=38305&category_id=11&radius=smart`
    console.log(queryParams);
    $.ajax(requestURL, {
        dataType: 'jsonp',
        success: function (data) {
            console.log(data);
        }
    });
}
else
    window.location.href = loginURL;

const MEETUP_SEARCH_URL = 'https://api.meetup.com/2/concierge?sign=true&photo-host=public&category_id=11&key=e5f40e367a304f44178202d444470';

function getDatafromMeetUp(location, callback) {
    const query = {
       category_id: 11,
       radius: 1,
       zip: location,
    }
    $.getJSON(MEETUP_SEARCH_URL, query, callback)
    console.log(`getData ran`)
}

function renderMeetupResults(result) {
    console.log(`renderMeetup ran`)
    return `
        <div>
            <h3>
            <a class="js-result-event" href="${result.event_url}" target="_blank">${result.name}</a>
            hosted by <a class="js-event-host" href="${result.group.urlname}" target="_blank">${result.group.name}</a>
            </h3>
            ${result.simple_html_description}
            <p>${result.venue.lat}, ${result.venue.lon}
        </div>
    `
}

function renderMeetupMap(map) {
    console.log(`renderMeetupMap ran`)
}

function displayMeetupData(data) {
    const results = data.items.map((item, index) => 
    renderMeetupResults(item));
    $('.js-search-results').html(results); 
    console.log(`displayMeetupData ran`)
}

function watchSubmit() {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        const locationTarget = $(event.currentTarget).find('.js-location');
        const query = locationTarget.val();
        //clear out the input
        locationTarget.val("");
        getDatafromMeetUp(query, displayMeetupData)
    });
    console.log(`watchSubmit ran`)
}

$(watchSubmit);
//google map api
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain'
  });

  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);
}

// Loop through the results array and place a marker for each
// set of coordinates.
window.eqfeed_callback = function(results) {
  for (var i = 0; i < results.features.length; i++) {
    var coords = results.features[i].geometry.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }
}
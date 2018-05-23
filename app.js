const MeetUp_API_URL = 'https://api.meetup.com/2/concierge?zip=84043&offset=0&format=json&category_id=11&photo-host=public&page=500&sig_id=254699968&sig=9dfeb60b3e337a30d4407e49010a86088996c42a';

const game_events = STORE.results



function renderResults(result) {
    console.log(`ran renderResults just fine`);
    let time = new Date(result.time);
    let date = time.toString('MMM dd');

    const venueExists = result.venue !== undefined;
    const groupExists = result.group !== undefined;

    let lat, lon;

    if (venueExists) {
        lat = result.venue.lat;
        lon = result.venue.lon;
    } else {
        lat = result.group.group_lat;
        lon = result.group.group_lon;
    }

    function renderLatAndLon () {
        if (venueExists || groupExists) {
            return `
                <span>${lat}</span><br/>
                <span>${lon}</span>
            `;
        } else {
            return `
                <span>No latitude and longitude availible.</span>
            `
        }
    }

    return (`
        <div class="js-events">
            <h4>${result.name}</h4>
                ${result.description}
                <span>Hosted by ${result.group.name}</span><br/>
                <span>Starts at ${date}</span><br/>
                <a href="${result.event_url}" target="_blank">Link</a><br/>
                ${renderLatAndLon()}
        </div>`)
        
}

function displayresults(data) {
    const events = game_events.map((item, index) => renderResults(item));
    $('.js-results').html(events);
    console.log(`displayresults ran`);
}


function watchSubmit() {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        displayresults(STORE);
        // displayMeetupData(STORE);
    });
    console.log(`watchSubmit ran`)
}
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


$(watchSubmit)
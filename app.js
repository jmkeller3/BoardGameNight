const MeetUp_API_URL = 'https://api.meetup.com/2/concierge?zip=84043&offset=0&format=json&category_id=11&photo-host=public&page=500&sig_id=254699968&sig=9dfeb60b3e337a30d4407e49010a86088996c42a';

const game_events = STORE.results

//google map api
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.3916, lng: -111.8508},
    zoom: 10
  });

function addMarker(coords) {
    var marker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: {
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/156px-Map_marker.svg.png',
            scaledSize: new google.maps.Size(18,24)
        }
    })
  } 
}


function renderResults(result) {
    console.log(`ran renderResults just fine`);
    let time = new Date(result.time);
    let date = time.toString('MMM dd');

    const venueExists = result.venue !== undefined;
    const groupExists = result.group !== undefined;

    let latituge, longitude;

    if (venueExists) {
        latitude = result.venue.lat;
        longitude = result.venue.lon;
    } else {
        latitude = result.group.group_lat;
        longitude = result.group.group_lon;
    }

    function renderLatAndLon () {
        if (venueExists || groupExists) {
            return `
                <span>${latitude}</span><br/>
                <span>${longitude}</span>
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




$(watchSubmit)
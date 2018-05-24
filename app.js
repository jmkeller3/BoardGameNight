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
    const requestURL = `https://api.meetup.com/2/concierge?access_token=${queryParams.access_token}&zip=84043&category_id=11&radius=smart`
    console.log(queryParams);
    $.ajax(requestURL, {
        dataType: 'jsonp',
        success: function (data) {
            console.log(data);
            displayresults(data);
        }
    });
}
else
    window.location.href = loginURL;


// const game_events = STORE.results

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
            const pin = {lat: latituge, lng: longitude}
            addMarker(pin);                
        } else {
            console.log(`No latitude and longitude availible.`);
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
    const events = data.results.map((item, index) => renderResults(item));
    $('.js-results').html(events);
    console.log(`displayresults ran`);
}


// function watchSubmit() {
//     $('.js-location-form').submit(event => {
//         event.preventDefault();
//         displayresults(STORE);
//         // displayMeetupData(STORE);
//     });
//     console.log(`watchSubmit ran`)
// }




// $(watchSubmit)
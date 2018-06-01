//Meetup API autorization for OAuth
const loginURL = `https://secure.meetup.com/oauth2/authorize?client_id=flaq16ghlsndfol2m7jkfe1pfk&response_type=token&redirect_uri=https://jmkeller3.github.io/BoardGameNight/`;
const url = window.location.href;
const regex = /(?:#|\?|&)(?:([a-zA-Z_]+)=([^&]+))*/g;
let matcher;
let queryParams = {};
//defining crucial varibles for map and Meetup search url
while(matcher = regex.exec(url)) {
    const [,key, val] = matcher;
    queryParams[key] = val;
}



//google map api
let addMarker;
let map;
let windowInfo;
function renderPage() {
    if (!Object.keys(queryParams).length) {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        window.location.href = loginURL;})
    }
    //accesses user's location and sets the location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            console.log(position.coords.latitude, position.coords.longitude);
            let user_lat = position.coords.latitude;
            let user_lon = position.coords.longitude;
            let initialLocation = { lat: user_lat, lng: user_lon };
            console.log(`user_lat is ${user_lat} and is working`);
            console.log(`user_lon is ${user_lon} and is working`);
            //resets the map to be centered on the user's location
            let mapOptions = {
                zoom: 9,
                center: initialLocation,
            };
            console.log(mapOptions);
            let map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
            addMarker = initAddMarkerWithMap(map);
            fetchMeetupData(user_lat, user_lon); 
            
        });
    };  
}

 


//gets data from Meetup API
//&category_id=11
function fetchMeetupData(lat, lon) {
    console.log(`MeetupLogin is working`);
    console.log(`lat is ${lat} and is working`);
    const requestURL = `https://api.meetup.com/2/concierge?access_token=${queryParams.access_token}&lon=${lon}&radius=smart&lat=${lat}`;
    console.log(queryParams);
    displayMap();
    $.ajax(requestURL, {
        dataType: 'jsonp',
        success: (data) => {
            console.log(data);
            displayresults(data);
        }
    });
}

//adds customer marker to map
function initAddMarkerWithMap(map) {
    console.log(`made a marker`);
    return function addMarker(coords, title) {
            let marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/156px-Map_marker.svg.png',
                    scaledSize: new google.maps.Size(18,24)
                    },
                title: title
        });
        
        marker.addListener('click', function() {
            infowindow.open(map,maker);
        })}; 
}

//takes a result and returns the time, place, description, and name 
//the event
function renderResults(result) {
    console.log(`ran renderResults just fine`);
    let time = new Date(result.time);
    let date = time.toString('MMM dd');
    
    const venueExists = result.venue !== undefined;
    const groupExists = result.group !== undefined;

    let latitude, longitude;
    //a check whether the event is a group event or a public event
    if (venueExists) {
        latitude = result.venue.lat;
        longitude = result.venue.lon;
        address = `<span>${result.venue.address_1}<br/>
                    ${result.venue.city}, ${result.venue.state} ${result.venue.zip}</span>`
    } else {
        latitude = result.group.group_lat;
        longitude = result.group.group_lon;
        address = `<span>Group Event, see description for details!</span>`
    }
    //displays a marker on map for event
    if (venueExists || groupExists) {
        const pin = {lat: latitude, lng: longitude};
        let name = result.name
        addMarker(pin, name);     
        let markerPreview = `<h3>${name}</h3>
        <p>${address}</p>
        <p>Starts at ${date}</p>
        `;
        // markerInfo(markerPreview);           
    } else {
        console.log(`No latitude and longitude availible.`);
    }

    
    
    return (`
        <div class="js-events card">
            <div class="side">
            <h3>${result.name}</h3>
                <span>Hosted by ${result.group.name}</span><br/>
                <span>Starts at ${date}</span><br/>
                <a href="${result.event_url}" target="_blank">Link</a>
            </div>
            <div class="side back">
                ${result.description == null ? 'No description availible. See link for details.' : result.description}
            </div>
        </div>`)
        
}
//takes data from JSONP and displays it with the renderResults function
function displayresults(data) {
    const events = data.results.map((item, index) => renderResults(item));
    $('.js-results').html(events);
    console.log(`displayresults ran`);
}

function displayMap() {
    console.log(`display the map!`);
    document.getElementById('map').style.display="block";
}


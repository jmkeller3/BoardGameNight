//Meetup API autorization for OAuth
const loginURL = `https://secure.meetup.com/oauth2/authorize?client_id=flaq16ghlsndfol2m7jkfe1pfk&response_type=token&redirect_uri=https://jmkeller3.github.io/BoardGameNight/`;
const url = window.location.href;
const regex = /(?:#|\?|&)(?:([a-zA-Z_]+)=([^&]+))*/g;
let matcher;
let queryParams = {};
while(matcher = regex.exec(url)) {
    const [,key, val] = matcher;
    queryParams[key] = val;
}



//google map api
//Defines key varibles
let addMarker;
let map;
let windowArray = [];

//Callback from Google map
function renderPage() {
    //takes user to login screen upon submit button
    if (!Object.keys(queryParams).length) {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        window.location.href = loginURL;})
    } else {
        //removes introduction content
        removeIntro();
    }

    //accesses user's location and sets the location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let user_lat = 40.3916;
            //position.coords.latitude;
            let user_lon = -111.8508;
            //position.coords.longitude;
            let initialLocation = {lat: 40.3916, lon: -111.8508}
            //{ lat: user_lat, lng: user_lon };
            let mapOptions = {
                zoom: 8,
                center: initialLocation,
            };
            console.log(mapOptions);
            let map = new google.maps.Map(document.getElementById('map'),
            mapOptions);
            addMarker = initAddMarkerWithMap(map);
            //gets data from Meetup API
            fetchMeetupData(user_lat, user_lon); 
            
        });
    };  
}

 


//Search Meetup API for relevent data
function fetchMeetupData(lat, lon) {
    const requestURL = `https://api.meetup.com/2/concierge?access_token=${queryParams.access_token}&lon=${lon}&category_id=11&radius=smart&lat=${lat}`;
    $.ajax(requestURL, {
        dataType: 'jsonp',
        success: (data) => {
            displayresults(data);
        }
    });
}

//adds customer marker to map
function initAddMarkerWithMap(map) {
    return function addMarker(coords, title, contentString) {
            let marker = new google.maps.Marker({
                position: coords,
                map: map,
                icon: {
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Map_marker.svg/156px-Map_marker.svg.png',
                    scaledSize: new google.maps.Size(18,24)
                    },
                title: title});
            let infowindow = new google.maps.InfoWindow({
                content:contentString});

            windowArray.push(infowindow);
        

            marker.addListener('click', function() {
            //closes any open infowindows
                for (const iw of windowArray) {
                    iw.close();}
            
            infowindow.open(map,marker);
        })}; 
}

//takes a result and returns the time, place, description, and name 
//of the event
function renderResults(result) {
    //Gets start time from data
    let time = new Date(result.time);
    //converts time into ideal format
    let month = new Array();
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;

    let startTime = month[time.getMonth()]+" "+time.getDay()+", "+time.getFullYear()+" "+strTime;
    
    const venueExists = result.venue !== undefined;
    const groupExists = result.group !== undefined;

    let latitude, longitude;
    //a check whether the event is a group event or a public event
    if (venueExists) {
        latitude = result.venue.lat;
        longitude = result.venue.lon;
        address = `<span>${result.venue.address_1}<br/>
                    ${result.venue.city}, ${result.venue.state}</span>`
    } else {
        latitude = result.group.group_lat;
        longitude = result.group.group_lon;
        address = `<span>Group Event, see description for details!</span>`
    }
    //displays a marker on map for event
    if (venueExists || groupExists) {
        const pin = {lat: latitude, lng: longitude};
        let name = result.name
        let markerPreview = `<h3>${name}</h3>
        <p>${address}</p>
        <p>Begins ${startTime}</p>
        `;
        addMarker(pin, name, markerPreview);        
    } else {
        console.log(`No latitude and longitude availible.`);
    }

    //The event card information with the descriptions on the back   
    return (`
        <div class="js-events card-event">
            <div class="front">
                <div class="wrapper">
                <h3>${result.name}</h3>
                    <span>Hosted by ${result.group.name}</span><br/>
                    <span>Starts ${startTime}</span><br/>
                    <a href="${result.event_url}" target="_blank">Link</a>
                </div>
            </div>

            <div class="back">
                <div class="wrapper">
                ${result.description == null ? 'No description availible. See link for details.' : result.description}
                </div>
            </div>
        </div>`)
        
}
//takes data from JSONP and displays it with the renderResults function
function displayresults(data) {
    const events = data.results.map((item, index) => renderResults(item));
    $('.js-results').html(events);
    console.log(`displayresults ran`);
}

//removes introduction information and reveals map
function removeIntro() {
    console.log(`removeIntro worked`);
    $('.hide').toggle();
    $('.content-wrap').toggle();
}

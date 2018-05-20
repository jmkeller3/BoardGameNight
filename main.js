const MEETUP_SEARCH_URL = 'https://api.meetup.com/2/concierge?sign=true&photo-host=public&category_id=11&key=e5f40e367a304f44178202d444470';

function getDatafromMeetUp(location, callback) {
    const query = {
       category_id: 11,
       radius: 1,
       zip: location,
    //    state: location,
    //    city: location,
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
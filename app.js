const MeetUp_API_URL = 'https://api.meetup.com/2/concierge?zip=84043&offset=0&format=json&category_id=11&photo-host=public&page=500&sig_id=254699968&sig=9dfeb60b3e337a30d4407e49010a86088996c42a';

$.ajax(MeetUp_API_URL, {
    dataType: 'jsonp',
    success: function (data) {
        console.log(data);
        console.dir(data);
    }
})

function renderMeetupResults(result) {
    console.log(`renderMeetup ran`);
    return `
        <div>
            <span>${result.name}</span>
        </div>        
    `
}

function displayMeetupData(data) {
    const results = data.items.map((item, index) => renderMeetupResults(item));
    $('.js-search-results').html(results);
    console.log(`displayMeetupData ran`);
}

function watchSubmit() {
    $('.js-location-form').submit(event => {
        event.preventDefault();
        getData(MeetUp_API_URL, displayMeetupData)
    });
    console.log(`watchSubmit ran`)
}

$(watchSubmit);
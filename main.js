// main function
const PlaceTypesDict = {
    food: ["cafe", "restaurant", "bakery"],
    store: ["department_store", "convenience_store"],
    night: ["bar", "liquor_store"]
}
let placesFound = [];
let currTypeSize = 0;
let callbacks = 0; //used to track, so that it will only call createOutput when all types in placeTypes are appeneded
console.log(PlaceTypesDict["food"]);
let outputted = false;
searchNearbyPlaces;
document.getElementById("type").onchange = searchNearbyPlaces;

function initMap(){
    autocomplete = new google.maps.places.Autocomplete((document.getElementById("autocomplete")), {types: ["geocode", "establishment"]});
    autocomplete.addListener("place_changed", searchNearbyPlaces)
}

function searchNearbyPlaces(){
    let selectedPlaceType = document.getElementById("type").value;
    if(selectedPlaceType == "food") document.body.style.backgroundColor = "#b7c6d5";
    else if(selectedPlaceType == "store") document.body.style.backgroundColor = "#AA0000";
    else if(selectedPlaceType == "night") document.body.style.backgroundColor = "#000000";

    currTypeSize = PlaceTypesDict[selectedPlaceType].length;
    callbacks = 0;
    placesFound = [];
    outputted = false;
    document.getElementById("places").innerHTML='';
    let place = autocomplete.getPlace();
    //Shifting center of the the graphic map to the input
    let coorCenter = String(place.geometry.location.lat()+ ',' + place.geometry.location.lng());
    document.getElementById("mapCenter").setAttribute('center', coorCenter);
    document.getElementById("mapMarker1").setAttribute('position', coorCenter);
    console.log("bruh",coorCenter);

    map = new google.maps.Map(document.getElementById('map'), {
        center: place.geometry.location, 
        zoom: 15
    });

    service = new google.maps.places.PlacesService(map);
    for(let type in PlaceTypesDict[selectedPlaceType]){
        service.nearbySearch({
            location: place.geometry.location,
            radius: "500",
            type: [PlaceTypesDict[selectedPlaceType][type]]
        }, callback);
    }
}

function callback(results, status){
    if(status === google.maps.places.PlacesServiceStatus.OK){
        console.log("found: ", results.length);
        for(let i=0; i<results.length; i++){
            placesFound.push(results[i]);
        }
    }
    callbacks+=1;
    console.log("Total Places found: ", placesFound.length);
    if(callbacks == currTypeSize){
        createOutput(placesFound[Math.floor(Math.random() * placesFound.length)]);
    }
}

function createOutput(place){
    console.log(place.geometry.location.lat(), place.geometry.location.lng());
    let coorMarker = String(place.geometry.location.lat()+ ',' + place.geometry.location.lng());
    document.getElementById("mapMarker2").setAttribute('position', coorMarker);
    if(placesFound.length == 0){
        alert("Couldn't find any relevant place!");
        return
    }
    if(!outputted){
        let table = document.getElementById("places");
        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        cell1.innerHTML = place.name;
        if(place.photos && outputted===false){
            let photoUrl = place.photos[0].getUrl();
            let rating = "Rating: ".concat(place.rating);
            let description = rating.concat("\n\n", place.vicinity);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
            cell3.innerHTML = description;
        }
        else{
            let photoUrl = "bruh.JPG";
            let cell2 = row.insertCell(1);
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
        }
    }
    outputted = true;
}
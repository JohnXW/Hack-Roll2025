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

//Wheel
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn")
searchNearbyPlaces;
const finalValue = document.getElementById("final-value");
const rotationValues = [
    {minDegree: 0, maxDegree: 30, value: 2},
    {minDegree: 31, maxDegree: 90, value: 1},
    {minDegree: 91, maxDegree: 150, value: 6},
    {minDegree: 151, maxDegree: 210, value: 5},
    {minDegree: 211, maxDegree: 270, value: 4},
    {minDegree: 271, maxDegree: 330, value: 3},
    {minDegree: 331, maxDegree: 360, value: 2},
];

const data = [16, 16, 16, 16, 16, 16];
var pieColors = [
    "#8b35bc",
    "#b163da",
    "#8b35bc",
    "#b163da",
    "#8b35bc",
    "#b163da"
];

let myChart = new Chart (wheel, {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
        labels: [1,2,3,4,5,6],
        datasets:[
            {
                backgroundColor: pieColors,
                data: data,
            },
        ],
    },
    options: {
        responsive: true,
        animation: {duration:0},
        plugins: {
            tooltip: false,
            legend: {
                display: false,
            },
            datalabels: {
                color: "#000000",
                formatter: (_, context) =>
                context.chart.data.labels[context.dataIndex],
                font: {size: 24},
            },
        },
    },
});
const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
        if (angleValue >= i.minDegree && angleValue <= i.maxDegree){
            finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
            spinBtn.disabled = false;
            break;
        }
    }
}
//spinner count
let count = 0;
let resultValue = 101;
spinBtn.addEventListener("click", () => {
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Good Luck!</p>`;
    let randomDegree = Math.floor(Math.random() * (355-0+1)+0);
    let rotationInterval = window.setInterval(()=>{
        myChart.options.rotation = myChart.options.rotation + resultValue;
        myChart.update();
        if(myChart.options.rotation >= 360) {
            count += 1;
            resultValue -= 5;
            myChart.options.rotation = 0;
        }
        else if(count>15 && myChart.options.rotation == randomDegree){
            valueGenerator(randomDegree);
            clearInterval(rotationInterval);
            count = 0;
            resultValue = 101;
        }
    }, 10);
});
/////////////////////////////////////
document.getElementById("type").onchange = searchNearbyPlaces;

function initMap(){
    autocomplete = new google.maps.places.Autocomplete((document.getElementById("autocomplete")), {types: ["geocode", "establishment"]});
    autocomplete.addListener("place_changed", searchNearbyPlaces)
}

function searchNearbyPlaces(){
    let selectedPlaceType = document.getElementById("type").value;
    if(selectedPlaceType == "food") document.body.style.background = "#b7c6d5";
    else if(selectedPlaceType == "store") document.body.style.background = "#AA0000";
    else if(selectedPlaceType == "night") document.body.style.background = "#000000";

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
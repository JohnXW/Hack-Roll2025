// main function
const PlaceTypesDict = {
    food: ["cafe", "restaurant", "bakery"],
    store: ["department_store", "convenience_store", "supermarket"],
    night: ["bar", "liquor_store", "casino"],
    explore: ["zoo", "hindu_temple", "church", "museum"]
}
let placesFound = [];
let finalPlacesFound = [];
let currTypeSize = 0;
let callbacks = 0; //used to track, so that it will only call createOutput when all types in placeTypes are appeneded
console.log(PlaceTypesDict["food"]);
let outputted = false;

//Wheel
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn")
searchNearbyPlaces;
const finalValue = document.getElementById("final-value");
let rotationValues = [
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
                font: {size: 35},
            },
        },
    },
});
const valueGenerator = (angleValue) => {
    for (let i of rotationValues) {
        if (angleValue >= i.minDegree && angleValue <= i.maxDegree){
            // finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
            document.getElementById("places").innerHTML='';
            createOutput(i.value, true, 0);
            let conclusionTxt = "You Gotten "+i.value.name+'!';
            if(i.value.price_level){
                let priceTxt = "";
                if(i.value.price_level==1) priceTxt = "$1 - $10";
                else if(i.value.price_level==2) priceTxt = "$11 - $20";
                else priceTxt = "$21 - $30";
                conclusionTxt = String(conclusionTxt) + '<br> Price Range: ' + priceTxt;
            }
            document.getElementById("lucky").setAttribute("style", "display: none");
            document.getElementById("conclusion").setAttribute("style", "text-align: center; display: block; color: aliceblue");
            conclusionTxt = '<h1>'+conclusionTxt+'</h1>';
            document.getElementById("conclusion").innerHTML = conclusionTxt;
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
    document.getElementById("lucky").setAttribute("style", "display: none");
    document.getElementById("conclusion").setAttribute("style", "text-align: center; display: none");
    let selectedPlaceType = document.getElementById("type").value;
    if(selectedPlaceType == "food") document.body.style.background = "#b7c6d5";
    else if(selectedPlaceType == "store") document.body.style.background = "#AA0000";
    else if(selectedPlaceType == "night") document.body.style.background = "#000000";
    else if(selectedPlaceType == "explore") document.body.style.background = "#123456";

    currTypeSize = PlaceTypesDict[selectedPlaceType].length;
    callbacks = 0;
    placesFound = [];
    finalPlacesFound = [];
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
        zoom: 16
    });

    service = new google.maps.places.PlacesService(map);
    for(let type in PlaceTypesDict[selectedPlaceType]){
        service.nearbySearch({
            location: place.geometry.location,
            radius: "600",
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
        if(placesFound.length>=6){
            for(let i=0; i<6; i++){
                let picked = Math.floor(Math.random() * (placesFound.length-1));
                let pickedPlace = placesFound[picked];
                //Assigning place to wheel
                if(i==0) rotationValues[1].value = pickedPlace;
                else if(i==1){
                    rotationValues[0].value = pickedPlace;
                    rotationValues[6].value = pickedPlace;
                }
                else if(i==2) rotationValues[5].value = pickedPlace;
                else if(i==3) rotationValues[4].value = pickedPlace;
                else if(i==4) rotationValues[3].value = pickedPlace;
                else if(i==5) rotationValues[2].value = pickedPlace;

                rotationValues[i].value = placesFound[picked];
                finalPlacesFound.push(placesFound[picked]);
                createOutput(placesFound[picked], false, i+1);
                placesFound.splice(picked, 1);
            }
            document.getElementById("lucky").setAttribute("style", "display: block");
        }
        else{
            alert("Not Enough Elements To Create Wheel!");
            for(let i=0; i<placesFound.length; i++){
                createOutput(placesFound[i], true, i+1);
            }
        }
        // createOutput(placesFound[Math.floor(Math.random() * placesFound.length)]);
    }
}

function createOutput(place, map, num){
    let table = document.getElementById("places");
    let row = table.insertRow();
    if(map){
        console.log(place.geometry.location.lat(), place.geometry.location.lng());
        let coorMarker = String(place.geometry.location.lat()+ ',' + place.geometry.location.lng());
        document.getElementById("mapMarker2").setAttribute('position', coorMarker);
        let cell2 = row.insertCell(0);
        let cell3 = row.insertCell(1);
        if(place.photos){
            let photoUrl = place.photos[0].getUrl();
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
        }
        else{
            let photoUrl = "bruh.JPG";
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
        }
        let rating = "Rating: ".concat(place.rating);
        let description = rating.concat("\n\n", place.vicinity);
        cell3.innerHTML = description;
    }
    else{
        let cell1 = row.insertCell(0);
        cell1.innerHTML = num;
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        if(place.photos){
            let photoUrl = place.photos[0].getUrl();
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
        }
        else{
            let photoUrl = "bruh.JPG";
            cell2.innerHTML = `<img width="400" height="400" src="${photoUrl}"/>`
        }
        let rating = "Rating: ".concat(place.rating);
        let description = rating.concat("\n\n", place.vicinity);
        cell3.innerHTML = description;
    }
    outputted = true;
}
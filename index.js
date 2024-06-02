let quakeurl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2024-05-10%2000:00:00&endtime=2024-05-17%2023:59:59&maxlatitude=50&minlatitude=17.6&maxlongitude=-65&minlongitude=-158&minmagnitude=4.5&orderby=time" ;
const mainEl = document.querySelector('.main-content') ;
const magTF = document.getElementById('magField') ;
const daysTF = document.getElementById('daysField') ;
let map ;
let minMag = 3 ;
let nDays = 7 ;
let starttime = new Date() ;
let quakes = [] ;
let marker ;
let marks =[] ;


mainEl.innerHTML=`<div id="mapid" class="mapdiv"></div>`;

// create N America map
map = L.map(`mapid`).setView([35.,-90.], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 20,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//




// getdays returns the current day and the day ndays before the current day
// ndays is number of days before current date
// returns day0, current_day as Date objects.
function getdays(ndays){
    day_cur = new Date() ;
    day_0 = new Date(day_cur - ndays * 86400 * 1000) ;
    return [day_0, day_cur];

}

function updateQuakes() {
    console.log("Hello") ;
    nDays = daysTF.value ;
    nMag = magTF.value ;
    get_quakes(nDays,nMag) ;
}


function get_quakes(ndays,minmag) {
    
    let days = getdays(ndays) ;
    let day0 = days[0].toISOString().slice(0,10) ;
    let day1 = days[1].toISOString().slice(0,10) ;
    quakeurl = `https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=${day0}%2000:00:00&endtime=${day1}%2023:59:59&maxlatitude=50&minlatitude=17.6&maxlongitude=-65&minlongitude=-158&minmagnitude=${minmag}&orderby=time`;

    fetch (quakeurl).then (res=>res.json()).then (qdata=>{
        console.log(qdata.features[0]);
        let nquakes = qdata.features.length ;
        
        for (marknum in marks) {
            map.removeLayer (marks[marknum]);

        }
        for (i=0; i<nquakes; i++){
            let quakeColor = "#00AAFF" ;
            let quake = qdata.features[i] ;

            if (quake.properties.mag > 4 && quake.properties.mag<6) {
                quakeColor = "#EEFF00" ;
            }
            if (quake.mag >= 6){
                quakeColor = "FF0000" ;
            }
            marker = L.circleMarker([quake.geometry.coordinates[1],quake.geometry.coordinates[0]],{
                radius:quake.properties.mag**2,
                color:quakeColor,
        });
            let qdate = new Date (quake.properties.time).toISOString() ;
            let qplace = quake.properties.place ;
            marker.bindPopup ("<b>Magnitude : "+quake.properties.mag+"</b><br>"+qdate+"<br>"+qplace);
                
            marks.push(marker);
            marker.addTo(map) ;


        }


    });
    
    }

updateQuakes() ;
get_quakes(nDays, minMag) ;





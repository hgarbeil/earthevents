let quakeurl = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2024-05-10%2000:00:00&endtime=2024-05-17%2023:59:59&maxlatitude=50&minlatitude=17.6&maxlongitude=-65&minlongitude=-158&minmagnitude=4.5&orderby=time" ;
const mainEl = document.querySelector('.main-content') ;
const magTF = document.getElementById('magField') ;
const daysTF = document.getElementById('daysField') ;
const quakes_cb = document.getElementById('quakes_cb');
const fires_cb = document.getElementById('fires_cb');
const firms_cb = document.getElementById('firms_cb');
const volcs_cb = document.getElementById('volcs_cb');
const weather_cb = document.getElementById('weather_cb');
let theadEl = document.createElement("thead");
let tbodyEl = document.createElement("tbody");
let map ;
let minMag = 3 ;
let nDays = 7 ;
let starttime = new Date() ;
let quakes = [] ;
let marker ;
let marks =[] ;
let volcmarks = [] ;
let firemarks=[] ;
let volc_show= true ;
let quake_show=true ;
let fire_show=true ;
let firms_show=false ;
let weather_show=true ;
let latbounds=[-80,80] ;
let lonbounds=[-180.,180];
let quakeHeadings=['Name','Magnitude','Lat','Lon','Time','Depth'];
let tableMode = 0 ;


mainEl.innerHTML=`<div id="mapid" class="mapdiv"></div>`;

// create N America map
map = L.map(`mapid`).setView([40.,-120.], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 20,
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// check which events to show
$( document ).ready(function(){
    $("#event_show_cb").on("change", "input:checkbox", function(){
        //$("#formname").submit();
        getEvents();
    });
});

// function for selecting which table to display
function openType(evt, type) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    // document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
    switch(type){
        case 'equake':
            tableMode = 0 ; 
            tableMode = 0 ;
            updateQuakes() ;
            break ;
        case 'volc' :
            tableMode = 1 ;
            getFlags() ;
            loadVolcs() ;
            break ;
        case 'wildf' :
            tableMode = 2 ;
            loadFires() ;
            break ;
        case 'weather' :
            tableMode = 3 ;
            updateWeather() ;
            break ;

    }
  }


// getdays returns the current day and the day ndays before the current day
// ndays is number of days before current date
// returns day0, current_day as Date objects.
function getdays(ndays){
    day_cur = new Date() ;
    day_0 = new Date(day_cur - ndays * 86400 * 1000) ;
    return [day_0, day_cur];

}

function updateQuakes() {
    nDays = daysTF.value ;
    nMag = magTF.value ;
    get_quakes(nDays,nMag) ;
}

function getEvents(){
    volc_show=volcs_cb.checked;
    fire_show=fires_cb.checked;
    firms_show=firms_cb.checked;
    quake_show=quakes_cb.checked;
    weather_show=weather_cb.checked ;

    if (!volc_show){
        clearVolcs() ;
    } else {
        loadVolcs() ;
    }
    if(!quake_show){
        clearQuakes() ;
    } else {
        updateQuakes() ;
    }

    if (!fire_show){
        console.log("fires unchecked");
        clearFires() ;
    } else {
        console.log("fires checked");
        updateFires() ;
    }

    if (!firms_show){
        clearFIRMS() ;
    } else {
        updateFIRMS() ;
    }
    if (!weather_show){
        clearWeather() ;
    } else {
        updateWeather() ;
    }

}

function clearQuakes(){
    for (marknum in marks) {
        map.removeLayer (marks[marknum]);

    } 
    marks=[] ;
}


function get_quakes(ndays,minmag) {
    
    let days = getdays(ndays) ;
    let day0 = days[0].toISOString().slice(0,10) ;
    let day1 = days[1].toISOString().slice(0,10) ;
    quakeurl = `https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=${day0}%2000:00:00&endtime=${day1}%2023:59:59&maxlatitude=${latbounds[1]}&minlatitude=${latbounds[0]}&maxlongitude=${lonbounds[1]}&minlongitude=${lonbounds[0]}&minmagnitude=${minmag}&orderby=time`;

    clearQuakes() ;
    fetch (quakeurl).then (res=>res.json()).then (qdata=>{
        
        let nquakes = qdata.features.length ;
        
       
        for (i=0; i<nquakes; i++){
            let quakeColor = "#00AAFF" ;
            let quake = qdata.features[i] ;

            if (quake.properties.mag > 4 && quake.properties.mag<6) {
                quakeColor = "#CCCC00" ;
            }
            if (quake.mag >= 6){
                quakeColor = "FF0000" ;
            }
            marker = L.circleMarker([quake.geometry.coordinates[1],quake.geometry.coordinates[0]],{
                radius:quake.properties.mag**1.5,
                color:quakeColor,
            });
            let qdepth = quake.geometry.coordinates[2] ;
            let qdate = new Date (quake.properties.time).toISOString() ;
            let qplace = quake.properties.place ;
            let qlink = quake.properties.url ;
            marker.bindPopup ("<b>Magnitude : "+quake.properties.mag+"</b><br>"+qdate+"<br>"+qplace+"<br>Depth : "+qdepth+" km<br><a target='_blank' href="+qlink+">Website</href>");
                
            marks.push(marker);
            marker.addTo(map) ;
            


        }
        if (tableMode ==0)
            createQuakeTable(qdata);


    });
    
    }


function createQuakeTable (qdata) {
    console.log("creating table") ;
    let tableEl = document.getElementById('toptable') ;
    
    tableEl.innerHTML="";
    theadEl.innerHTML="" ;
    tbodyEl.innerHTML="" ;

    let myTr = document.createElement("tr") ;
    myTr.classList.add('tr-head') ;

            for (i in quakeHeadings) {
                let myTh = document.createElement('th') ;
                myTh.innerHTML = quakeHeadings[i] ;
                if (i==2 || i==3){
                    myTh.classList.add('priority-low');
                }
                myTr.appendChild(myTh) ;
            }
            theadEl.appendChild(myTr) ;

            let nquakes = qdata.features.length ;
                
            
            for (i=0; i<nquakes; i++){
                myTr = document.createElement("tr") ;
                let myTd0 = document.createElement('td') ;
                myTd0.innerHTML = "<a target='_blank' href="+qdata.features[i].properties.url+">"+qdata.features[i].properties.place+"</href>"
                // myTd0.innerHTML = qdata.features[i].properties.place ;
                myTr.appendChild(myTd0);
                myTd0 = document.createElement('td') ;
                myTd0.innerHTML = qdata.features[i].properties.mag;
                myTr.appendChild(myTd0);
                myTd0 = document.createElement('td') ;
                myTd0.innerHTML= Number(qdata.features[i].geometry.coordinates[1]).toFixed(3) ;
                myTr.appendChild(myTd0);
                myTd0 = document.createElement('td') ;
                myTd0.innerHTML=Number(qdata.features[i].geometry.coordinates[0]).toFixed(3) ;
                myTr.appendChild(myTd0);
                myTd0 = document.createElement('td') ;
                let qdate = new Date (qdata.features[i].properties.time).toISOString() ;
                myTd0.innerHTML=qdate ;
                myTr.appendChild(myTd0);
                myTd0 = document.createElement('td') ;
                myTd0.innerHTML = Number(qdata.features[i].geometry.coordinates[2]).toFixed(1);
                myTr.appendChild(myTd0);
            
                tbodyEl.appendChild(myTr) ;
            }
    
    tableEl.appendChild(theadEl) ;
    tableEl.appendChild(tbodyEl) ;



}

updateQuakes() ;





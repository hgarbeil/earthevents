const occur_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/occurring.geojson' ;
//const occur_flood_url = 'https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/long_range_flood_outlook/MapServer?f=pjson';
const likely_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/likely.geojson';
const poss_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/possible.geojson';
const alerts_url = 'https://api.weather.gov/alerts/active';
let weathermarks=[] ;
let weatherHeadings = ['Description','Severity','Start','End'];

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
headers.append('Access-Control-Allow-Credentials', 'true');

headers.append('GET', 'POST', 'OPTIONS');

function clearWeather (){
    for (marknum in weathermarks) {
        map.removeLayer (weathermarks[marknum]);

    }
    weathermarks=[] ;
}


function updateWeather(){
    //console.log("min acreage is "+ minAcreage);
    clearWeather() ;
    // $ajaxUtils.sendGetRequest (likely_flood_url, function(responseText){
    fetch (alerts_url).then(res=>res.json())
        .then (wdata=>{
            console.log(wdata.features[1]);
            for (i in wdata.features){
                w = wdata.features[i] ;
                if (w.geometry != null){
                    let thislength = w.properties.headline.length ;
                    let mymark = L.geoJSON(w, {
                        style: {color:"#00a"},
                        
                        onEachFeature : function (w, l){
                            l.bindPopup('<pre>'+w.properties.event+'<br>'+
                                w.properties.headline+'<br>Severity: '+w.properties.severity+'<br>Effective: '+w.properties.effective+'<br>Expires: '+
                                 w.properties.expires+'<br>'
                                // "<a target='_blank' href="+w.properties.affectedZones[0]+">Website</href>"
                                +"</pre>",
                                {maxWidth: thislength*10});
                        }
                    });
                        
                        //  onEachFeature: function (f, l) {
                        //       l.bindPopup('<pre>'+f.properties.poly_IncidentName+'<br>'+
                        //       f.properties.attr_IncidentSize+' Acres<br>'+
                        //       f.properties.attr_FireBehaviorGeneral+'<br>Containment : '+
                        //       f.properties.attr_PercentContained+'%<br>Rep Time : '+
                        //       f.properties.attr_ICS209ReportDateTime+
                        //       '</pre>');
                        // } 
                    
                    mymark.addTo(map);
                    weathermarks.push(mymark);

                }
            }
            if (tableMode==3){
                loadWeatherTable (wdata) ;
            }
        }
    
        );
}

function loadWeatherTable (events){
    console.log("creating weather table") ;
    let tableEl = document.getElementById('toptable') ;
    
    tableEl.innerHTML="";
    theadEl.innerHTML="" ;
    tbodyEl.innerHTML="" ;

    let myTr = document.createElement("tr") ;
    myTr.classList.add('tr-head') ;
    for (i in weatherHeadings) {
        let myTh = document.createElement('th') ;
        myTh.innerHTML = weatherHeadings[i] ;
        if (i==2 || i==3){
            myTh.classList.add('priority-low');
        }
        myTr.appendChild(myTh) ;
    }
    theadEl.appendChild(myTr) ;
    for (i in events.features){
        f = events.features[i];
        let fsize = f.properties.headline ;
        
        let myTr = document.createElement("tr") ;
        let myTd0 = document.createElement('td') ;
        myTd0.innerHTML = f.properties.headline ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML = f.properties.severity ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.effective ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.expires;
        // myTr.appendChild (myTd0);
       
        myTr.appendChild (myTd0);
        tbodyEl.appendChild(myTr);   

    }
    tableEl.appendChild(theadEl);
    tableEl.appendChild(tbodyEl);
}

    

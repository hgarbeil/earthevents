const occur_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/occurring.geojson' ;
//const occur_flood_url = 'https://mapservices.weather.noaa.gov/vector/rest/services/outlooks/long_range_flood_outlook/MapServer?f=pjson';
const likely_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/likely.geojson';
const poss_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/possible.geojson';
const alerts_url = 'https://api.weather.gov/alerts/active';
let floodmarks=[] ;

let headers = new Headers();

headers.append('Content-Type', 'application/json');
headers.append('Accept', 'application/json');

headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
headers.append('Access-Control-Allow-Credentials', 'true');

headers.append('GET', 'POST', 'OPTIONS');

function clearFloods (){
    for (marknum in floodmarks) {
        map.removeLayer (floodmarks[marknum]);

    }
    floodmarks=[] ;
}


function loadFloods(){
    //console.log("min acreage is "+ minAcreage);
    clearFloods() ;
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

                }
            }
            
        }
    
        );
}

loadFloods() ;
    

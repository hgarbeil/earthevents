
const poss_flood_url = 'https://www.wpc.ncep.noaa.gov/nationalfloodoutlook/possible.geojson';
const alerts_url = 'https://api.weather.gov/alerts/active';
let weathermarks=[] ;
let severVals = [] ;
const extreme_cb = document.getElementById("extreme_cb");
const severe_cb = document.getElementById("severe_cb") ;
const moderate_cb = document.getElementById("moderate_cb");
let weatherHeadings = ['Description','Severity','Start','End'];


$( document ).ready(function(){
    $("#weather_severe_level").on("change", "input:checkbox", function(){
        //$("#formname").submit();
        console.log("We get here") ;
        checkSevere() ;
        updateWeather() ;
    });
});


function clearWeather (){
    for (marknum in weathermarks) {
        map.removeLayer (weathermarks[marknum]);

    }
    weathermarks=[] ;
}

function checkSevere(){
    severVals = [] ;
    if (extreme_cb.checked){
        severVals.push ('Extreme');
    }
    if (severe_cb.checked){
        severVals.push ('Severe');
    }
    if (moderate_cb.checked){
        severVals.push ('Moderate');
    }
    console.log (severVals);

}

function updateWeather(){
    //console.log("min acreage is "+ minAcreage);
    //checkSevere() ;
    checkSevere() ;
    clearWeather() ;
    // $ajaxUtils.sendGetRequest (likely_flood_url, function(responseText){
    fetch (alerts_url).then(res=>res.json())
        .then (wdata=>{
            console.log(wdata.features[1]);
            for (i in wdata.features){
                w = wdata.features[i] ;
                
                if (w.geometry != null){
                    let severity = w.properties.severity ;
                    if (!severVals.includes(severity)){
                        continue ;
                    }
                
                    let thislength = w.properties.headline.length ;
                    let mymark = L.geoJSON(w, {
                        style: {color:"#00a"},
                        
                        onEachFeature : function (w, l){
                            l.bindPopup('<pre>'+w.properties.event+'<br>'+
                                w.properties.headline+'<br>Severity: '+severity+'<br>Effective: '+w.properties.effective+'<br>Expires: '+
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
    clearEvents() ;
    
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
        let severity = f.properties.severity ;
        if (!severVals.includes(severity)){
            continue ;
        }
       
        console.log(f.properties);
        let fsize = f.properties.headline ;
        eventsDisplayed.push (f) ;
        
        let myTr = document.createElement("tr") ;
       
        let myTd0 = document.createElement('td') ;
        myTd0.innerHTML = f.properties.headline ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML = String(f.properties.severity).trim(3) ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.effective ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.expires;
        // myTr.appendChild (myTd0);
       
        myTr.appendChild (myTd0);
       // myTr.addEventListener('click',function() {rowPopup(f, this)}) ;
        tbodyEl.appendChild(myTr); 
        
         

    }
    tableEl.appendChild(theadEl);
    tableEl.appendChild(tbodyEl);
    
}


    

function tableClick (event) {
    let myrows = document.querySelectorAll ('tr') ;
    for (i in myrows){
        myrows[i].classList ="" ;
    }
    let rowNum = event.target.closest('tr').rowIndex-1 ;
    console.log("table clicked  : "+eventsDisplayed[rowNum].properties.description) ;
    myrows[rowNum+1].classList.add("active") ;
    console.log(myrows[rowNum]);
    alert(eventsDisplayed[rowNum].properties.description);

}


const acreTF = document.getElementById ("acreField") ;
let fireurl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/jobs/a9af9310-bf0a-41eb-9e7a-9db590421661?f=json';


function clearFires(){
    for (marknum in firemarks) {
        map.removeLayer (firemarks[marknum]);

    }
    firemarks=[] ;
}

function updateFires(){
    //clearFires() ;
    loadFires() ;
}

function loadFires(){
let minAcreage = acreTF.value ;
console.log("min acreage is "+ minAcreage);
clearFires() ;
fetch (fireurl).then(res=>res.json())
    
    .then (firedata=>{
        fetch (firedata.resultUrl).then(res=>res.json()).then(fires=>{
            
            for (let ifire in fires.features){

            let f = fires.features[ifire] ;
            let fsize = f.properties.attr_IncidentSize ;
            if (fsize < minAcreage){
                continue ;
            }
            let mymark = L.geoJSON(f, {
                style: {color:"#ff0000"},
                
                 onEachFeature: function (f, l) {
                      l.bindPopup('<pre>'+f.properties.poly_IncidentName+'<br>'+
                      f.properties.attr_IncidentSize+' Acres<br>'+
                      f.properties.attr_FireBehaviorGeneral+'<br>Containment : '+
                      f.properties.attr_PercentContained+'%<br>Rep Time : '+
                      f.properties.attr_ICS209ReportDateTime+
                      '</pre>');
                    } 
                
                // style: function(feature) {
                //     switch (feature.properties.party) {
                //         case 'Republican': return {color: "#ff0000"};
                //         case 'Democrat':   return {color: "#0000ff"};
                //     }
                // }
            })
            mymark.addTo(map);
            firemarks.push(mymark) ;
            }
        });
        
    }

    );
}

loadFires() ;

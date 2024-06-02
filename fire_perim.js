let fireurl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/jobs/a9af9310-bf0a-41eb-9e7a-9db590421661?f=json';

fetch (fireurl).then(res=>res.json())
    
    .then (firedata=>{
        console.log(firedata.resultUrl);
        fetch (firedata.resultUrl).then(res=>res.json()).then(fires=>{
            
            for (let ifire in fires.features){

            let f = fires.features[ifire] ;
            console.log(f);
            L.geoJSON(f, {
                style: {color:"#ff0000"},
                
                 onEachFeature: function (f, l) {
                      l.bindPopup('<pre>'+f.properties.poly_IncidentName+'<br>'+
                      f.properties.attr_IncidentSize+' Acres<br>'+
                      f.properties.attr_FireBehaviorGeneral+'<br>Containment : '+
                      f.properties.attr_PercentContained+'%'+
                      '</pre>');
                    } 
                
                // style: function(feature) {
                //     switch (feature.properties.party) {
                //         case 'Republican': return {color: "#ff0000"};
                //         case 'Democrat':   return {color: "#0000ff"};
                //     }
                // }
            }).addTo(map);
            }
        });
        
    }

    );


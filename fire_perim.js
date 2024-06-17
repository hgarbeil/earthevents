const acreTF = document.getElementById ("acreField") ;
let fireHeadings = ['Name','Size (Acres)','Behavior','Percent Contained','Report Time','Description'];
let fireurl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/jobs/a9af9310-bf0a-41eb-9e7a-9db590421661?f=json';
fireurl = 'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/WFIGS_Interagency_Perimeters_Current/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson';
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
console.log(fireurl);
clearFires() ;
fetch (fireurl).then(res=>res.json())
    
    .then (firedata=>{
        console.log(firedata);
        //fetch (firedata.resultUrl).then(res=>res.json()).then(fires=>{
            
            for (let ifire in firedata.features){

            let f = firedata.features[ifire] ;
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
                
                
            })
            mymark.addTo(map);
            firemarks.push(mymark) ;
            }
            if (tableMode ==2){
                console.log("load fires") ;
                loadFiresTable(firedata, minAcreage) ;
            }
        //});
        
    }

    );
}

function loadFiresTable (fires, minAcreage){
    console.log("creating fire table") ;
    let tableEl = document.getElementById('toptable') ;
    
    tableEl.innerHTML="";
    theadEl.innerHTML="" ;
    tbodyEl.innerHTML="" ;

    let myTr = document.createElement("tr") ;
    myTr.classList.add('tr-head') ;
    for (i in fireHeadings) {
        let myTh = document.createElement('th') ;
        myTh.innerHTML = fireHeadings[i] ;
        if (i==2 || i==3){
            myTh.classList.add('priority-low');
        }
        myTr.appendChild(myTh) ;
    }
    theadEl.appendChild(myTr) ;
    for (i in fires.features){
        f = fires.features[i];
        let fsize = f.properties.attr_IncidentSize ;
        if (fsize < minAcreage) 
            continue ;
        let myTr = document.createElement("tr") ;
        let myTd0 = document.createElement('td') ;
        myTd0.innerHTML = f.properties.poly_IncidentName ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML = fsize ;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.attr_FireBehaviorGeneral;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.attr_PercentContained;
        myTr.appendChild (myTd0);
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.attr_ICS209ReportDateTime;
        myTr.appendChild (myTd0); 
        myTd0 = document.createElement('td') ;
        myTd0.innerHTML =  f.properties.attr_IncidentShortDescription;
        myTr.appendChild (myTd0);
        tbodyEl.appendChild(myTr);   

    }
    tableEl.appendChild(theadEl);
    tableEl.appendChild(tbodyEl);
}


//loadFires() ;

let firms_url = "https://firms2.modaps.eosdis.nasa.gov/data/active_fire/modis-c6.1/csv/MODIS_C6_1_USA_contiguous_and_Hawaii_48h.csv";
let firms_marks = [] ;
const confTE = document.getElementById('confField');
let latval ;
let lonval ;
let confval ;


function get_firms_hotspots(minConf) { 
$ajaxUtils.sendGetRequest (firms_url, function(responseText){
    
    let lines = responseText.split("\n") ;
    console.log(lines[0]);
    let line0 = lines[0] ;
    for (i in lines){
        if (i == 0 || lines[i].length<10) {
            continue ;
        }
        let cols = lines[i].split(',');
        
        latval = cols[0];
        lonval = cols[1];
        confval = cols[8];
        if (confval < minConf){
            continue ;
        }
        let marker = L.circleMarker([latval,lonval],{
            radius:1,
            color:"#930",
        }) ;
        marker.addTo(map);
        firms_marks.push(marker);




    }
},false) ;

}

function updateFIRMS() {

    minConf = confTE.value ;
    clearFIRMS() ;
    get_firms_hotspots(minConf);
}
    


function clearFIRMS() {
    for (marknum in firms_marks) {
        map.removeLayer (firms_marks[marknum]);

    } 
    firms_marks=[] ;

}
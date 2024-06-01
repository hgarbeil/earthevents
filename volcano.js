
// const volc_all_cb = document.getElementById ('volc_all_cb');
const volc_green_cb = document.getElementById('volc_green_cb') ;
const volc_yellow_cb = document.getElementById('volc_yellow_cb') ;
const volc_red_cb = document.getElementById('volc_red_cb') ;
let all_flag = false ;
let green_flag = true ;
let yellow_flag = false ;
let red_flag = false ;
let volcmarks = [] ;

// monitored volcanoes
// volcurl = 'https://volcanoes.usgs.gov/hans-public/api/volcano/getMonitoredVolcanoes';

$( document ).ready(function(){
    $("#volc_event_type").on("change", "input:checkbox", function(){
        //$("#formname").submit();
        console.log("We get here") ;
        getFlags();
        loadVolcs() ;
    });
});

let markerOptions = {
    title: "1",
    clickable : true ,
    draggable: false ,

};
let volcBlkIcon = L.icon({
    iconUrl: 'data/icons8-volc_black.png',
    iconSize:  [32,32]
    

});
let volcGreenIcon = L.icon({
    iconUrl: 'data/icons8-volc_green.png',
    iconSize:  [32,32]
    

});
let volcYellowIcon = L.icon({
    iconUrl: 'data/icons8-volc_yellow.png',
    iconSize:  [32,32]
    

});
let volcRedIcon = L.icon({
    iconUrl: 'data/icons8-volc_red.png',
    iconSize:  [32,32]
    

});

function getFlags(){
    console.log('and here') ;
    green_flag = volc_green_cb.checked ;
    yellow_flag = volc_yellow_cb.checked ;
    red_flag = volc_red_cb.checked ;
    // all_flag = volc_all_cb.checked ;

}

function addMarker (volc, marker) {
    let qdate = volc.alertDate ;
    let qplace = volc.noticeSynopsis ;
    let qlink = volc.vUrl;
    marker.bindPopup ("<b>"+volc.vName+"</b><br>"+qdate+"<br>"+qplace+"<br>"+"<a target='_blank' href="+qlink+">Website</href>") ;
    volcmarks.push(marker);
    marker.addTo(map) ;

}




function loadVolcs (){
console.log("And here too");
for (marks in volcmarks) {
    map.removeLayer(volcmarks[marks]);
}
fetch ('https://volcanoes.usgs.gov/vsc/api/volcanoApi/vhpstatus').then(res=>res.json())
    
    .then (volcdata=>{
        for (var i in volcdata){
            let volc = volcdata[i];
            //console.log(volcdata[i]);
            // if (volcdata[i].alertLevel!='UNASSIGNED' && all_flag) {
            //     markerOptions.icon= volcBlkIcon ;
            //     marker = L.marker([volc.lat,volc.long],markerOptions);
            //     addMarker(volc,marker);
            // }
            if (volc.colorCode=='GREEN' && green_flag){
                    markerOptions.icon= volcGreenIcon ;
                    marker = L.marker([volc.lat,volc.long],markerOptions);
                    addMarker(volc,marker);
                }
            if (volc.colorCode=='YELLOW' && yellow_flag){
                    markerOptions.icon= volcYellowIcon ;
                    marker = L.marker([volc.lat,volc.long],markerOptions);
                    addMarker(volc,marker);
                }
            if (volc.colorCode=='RED' && red_flag){
                    markerOptions.icon= volcRedIcon ;
                    marker = L.marker([volc.lat,volc.long],markerOptions);
                    addMarker(volc,marker);
                    

                    

                }
            
                
                
            }
        
        

        // fetch (volcurl).then (res=>res.json()).then (vdata=>{
        //     //console.log(vdata);
        //     for(var i in vdata){
        //         for (var z in volcdata){
        //             if (vdata[i].vnum===volcdata[z].vnum){
        //                 vdata[i].lat = volcdata[z].lat ;
        //                 vdata[i].lon = volcdata[z].long ;
        //                 // for(var attr in features2[z].properties){
        //                 //     features[i].properties[attr] = features2[z].properties[attr];
        //                 // }
        //                 console.log(vdata[i]);
        //             }
        //         }
        //     }



        // }) ;
       
        // for (i=0; i<nvolcs; i++){
        //     let volc = volcdata[i];
        //     let marker = L.marker([volc.lat,volc.long]);
            
        //     if (volc.alertLevel == 'ADVISORY'){
        //         console.log(volc.volcName + "  : "+volc.colorCode);
        //     }
        //     marker.addTo(map);



        // }



    });
}




// function get_volcanoes(ndays,minmag) {
    
//     let days = getdays(ndays) ;
//     let day0 = days[0].toISOString().slice(0,10) ;
//     let day1 = days[1].toISOString().slice(0,10) ;
//     volcurl = 'https://volcanoes.usgs.gov/hans-public/ap(i/volcano/getMonitoredVolcanoes';

    
        //console.log(marker.length);
//         for (marknum in marks) {
//             map.removeLayer (marks[marknum]);

//         }
//         for (i=0; i<nquakes; i++){
//             let quake = qdata.features[i] ;
//             marker = L.marker([quake.geometry.coordinates[1],quake.geometry.coordinates[0]]);
//             let qdate = new Date (quake.properties.time).toISOString() ;
//             let qplace = quake.properties.place ;
//             marker.bindPopup ("<b>"+quake.properties.mag+"</b><br>"+qdate+"<br>"+qplace);
//             marks.push(marker);
//             marker.addTo(map) ;


//         }


//     });

getFlags() ;
loadVolcs() ;

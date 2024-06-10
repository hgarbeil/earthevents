
// const volc_all_cb = document.getElementById ('volc_all_cb');
const volc_green_cb = document.getElementById('volc_green_cb') ;
const volc_yellow_cb = document.getElementById('volc_yellow_cb') ;
const volc_orange_cb = document.getElementById('volc_orange_cb') ;
const volc_red_cb = document.getElementById('volc_red_cb') ;
let orange_flag = false ;
let green_flag = true ;
let yellow_flag = false ;
let red_flag = false ;

let volcHeadings=['Name','Alert Level','Lat','Lon','Date'];

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
let volcOrangeIcon = L.icon({
    iconUrl: 'data/icons8-volc_orange.png',
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
    orange_flag = volc_orange_cb.checked ;
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

function clearVolcs(){
    for (marknum in volcmarks) {
        map.removeLayer (volcmarks[marknum]);

    }
    volcmarks=[] ;
}


function loadVolcs (){
console.log("And here too");
clearVolcs() ;
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
            if (volc.colorCode=='ORANGE' && orange_flag){
                    markerOptions.icon= volcOrangeIcon ;
                    marker = L.marker([volc.lat,volc.long],markerOptions);
                    addMarker(volc,marker);
                }
            if (volc.colorCode=='RED' && red_flag){
                    markerOptions.icon= volcRedIcon ;
                    marker = L.marker([volc.lat,volc.long],markerOptions);
                    addMarker(volc,marker);
                    

                    

                }
            
                
                
            }
        
        if (tableMode==1) {
            loadVolcTable (volcdata);
        }



    });
}

function loadVolcTable(volcdata) {
    console.log("creating volc table") ;
    let tableEl = document.getElementById('toptable') ;
    
    tableEl.innerHTML="";
    theadEl.innerHTML="" ;
    tbodyEl.innerHTML="" ;

    let myTr = document.createElement("tr") ;
    myTr.classList.add('tr-head') ;
    for (i in volcHeadings) {
        let myTh = document.createElement('th') ;
        myTh.innerHTML = volcHeadings[i] ;
        if (i==2 || i==3){
            myTh.classList.add('priority-low');
        }
        myTr.appendChild(myTh) ;
    }
    theadEl.appendChild(myTr) ;
    for (i in volcdata){
        if (volcdata[i].alertLevel == 'ADVISORY' || volcdata[i].alertLevel == 'WATCH' || volcdata[i].alertLevel == 'WARNING' ){
            console.log(volcdata[i]);
            let myTr = document.createElement("tr") ;
            let myTd0 = document.createElement('td') ;
            myTd0.innerHTML = "<a target='_blank' href="+volcdata[i].vUrl+">"+volcdata[i].vName+"</href>" ;
            // myTd0.innerHTML = qdata.features[i].properties.place ;
            myTr.appendChild(myTd0);
            myTd0 = document.createElement('td') ;
            myTd0.innerHTML = volcdata[i].colorCode ;
            myTr.appendChild(myTd0);
            myTd0 = document.createElement('td') ;
            myTd0.innerHTML = volcdata[i].lat ;
            myTr.appendChild(myTd0);
            myTd0 = document.createElement('td') ;
            myTd0.innerHTML = volcdata[i].long ;
            myTr.appendChild(myTd0);
            myTd0 = document.createElement('td') ;
            myTd0.innerHTML = volcdata[i].alertDate ;
            myTr.appendChild(myTd0);
            // myTd0 = document.createElement('td') ;
            // myTd0.innerHTML = "<a target='_blank' href="+qdata.features[i].properties.url+">"+qdata.features[i].properties.place+"</href>"
            // // myTd0.innerHTML = qdata.features[i].properties.place ;
            // myTr.appendChild(myTd0);
            tbodyEl.appendChild(myTr) ;
        }
        
    }

    tableEl.appendChild(theadEl) ;
    tableEl.appendChild(tbodyEl) ;


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

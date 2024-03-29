let myMap;
let canvas;
//список всіх координат в одному масиві
let allCoordinates = [];
// словник рік: масив координатів будинку
let buildings = [];
//
let group_by_year = {};
//let back = [];


var inp;
var data;
var allYears;
var slider;
var nameP;

//var координати Києва
const options = {
    lat: 50.452798,
    lng: 30.551424,
    zoom: 12,
    style: 'YearsPng/{z}/{x}/{y}.png'
};

const mappa = new Mappa('Leaflet');


// ЗАВАНТАЖЕННЯ ДАНИХ з json
function preload(){
  data = loadJSON('./data/id_housesKiev.geojson');
  console.log(data)
}


function  setup(){
    canvas = createCanvas(windowWidth * 0.95, windowHeight * 0.8).parent("#mapContainer");
    myMap = mappa.tileMap(options);
    myMap.overlay(canvas);





// СТВОРЕННЯ СЛОВНИКА 'BUILDINGS' {усі роки, усі будинки для кожного з років}
  for (var i = 0; i < data.features.length; i++){
    // витягаємо з кожного feature.properties.built_year відповідний рік
    let year = data.features[i].properties.built_year;
    // витягаємо з кожного feature.geometry.coordinates відповідний мисив з координатами одного будинку
    var coordinates = data.features[i].geometry.coordinates[0]
    //додаємо ці два значення до словника (тут усі роки і для кожного з них усі точки кожного з будинків)
    buildings.push({built_year: year, polygon: coordinates});
    
  }

// Створюємо словник усіх років і усіх будинків "group_by_year"
  for(let i = 0; i < buildings.length; i++){
        // зі створеного словника беремо по одному масиву 
        var building = buildings[i];// виглядає так: {built_year: year, polygon: coordinates}

        // з кожного з них витягаємо рік (year)
        let year = building.built_year;
//
        var one_year_buildings = group_by_year[year]; // 

        if( typeof one_year_buildings === 'undefined' ){
          group_by_year[year] = [building]
        } else {
          one_year_buildings.push(building)
          //console.log(one_year_buildings.length)
        }
  }


  allYears = Object.keys(group_by_year).length;
  slider = createSlider(1854, 2019, 1854).parent('#slider');
  inp = createInput(slider.value() ).parent('#year');
}

// змінна глобольного часу, за який має намалюватися все
//var tTotal = (2018-1854)*5000;
// total time of animation змінна частоти з якою з'являються групи будинків
var interval = 20000;
// змінна початкового року
var yearStart = 1854;

let foo = chroma.scale(['000000', '8c0040',  '8359d4', '00ffff']).mode('lab');

// СТВОРЕННЯ ФУНКЦІЇ, яка буде малювати будинки зазначеного року
 function showOneYear(year){

            var one_year_buildings = group_by_year[year];   
            if(  !( typeof one_year_buildings === 'undefined'  )  ){
                for(let i = 0; i < one_year_buildings.length; i++){
                      var houseShape = one_year_buildings[i].polygon;
                      
                        beginShape();
                        for (let k = 0; k < houseShape.length; k++){
                          if(  !isNaN(houseShape[k][1]) &&  !isNaN(houseShape[k][0]) ){
                            let pos = myMap.latLngToPixel(houseShape[k][1], houseShape[k][0])
                            vertex(pos.x, pos.y);
                          } 
                        } 

                      //}  
                      endShape(CLOSE);
                      //}
                }
            }
 }


/* кнопка кліку*/
document.querySelector("#playME").addEventListener("click", function () {
    //сюди треба написати, аби карта програвалась
    // alert ("clicked");
    var t = 1;
    for(let k = 1854; k <= 2019; k++){
        setTimeout(function timer() {
            // console.log(k);
            document.querySelector('input[type=range]').value = k;
        }, t * 100);
        t = t + 1;
    }

});






function draw(){
  clear();
  // змінна яка утримує в собі час в мілісекундах, що пройшов від початку запуску фунції draw
  var tPresent = millis();


  // викликаємо фунцію в циклі, який проходиться по всіх роках
  var yearLast = slider.value();
  //background(255);
  for(var i = yearStart; i < yearLast; i++){
     var b = map(i, 1854, 2019, 0, 1);

    var mycolor = foo(b).rgb();
    fill(mycolor[0], mycolor[1], mycolor[2]);
    stroke(mycolor[0], mycolor[1], mycolor[2]);
    strokeWeight(0.5);
    smooth();
    showOneYear(i);
    inp.value(i);
   }
}



// function isAnyPartOfElementInViewport(el) {
//
//     const rect = el.getBoundingClientRect();
//     // DOMRect { x: 8, y: 8, width: 100, height: 100, top: 8, right: 108, bottom: 108, left: 8 }
//     const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
//     const windowWidth = (window.innerWidth || document.documentElement.clientWidth);
//
//     // http://stackoverflow.com/questions/325933/determine-whether-two-date-ranges-overlap
//     const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
//     const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
//
//     return (vertInView && horInView);
// }
//
// var vis = document.querySelector('#mapContainer');



// window.addEventListener('scroll', function() {
//     if (isAnyPartOfElementInViewport(vis)) {
//         console.log("is in view");
//     }
//     else {
//         document.querySelector('input[type=range]').value = 1854;
//         document.querySelector('input[type=text]').value = 1854;
//
//     }
// }, { passive: true } );
//
//





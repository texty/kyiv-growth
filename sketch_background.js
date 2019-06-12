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
const key = "pk.eyJ1IjoiZXZnZXNoYWRyb3pkb3ZhIiwiYSI6ImNqMjZuaGpkYTAwMXAzMm5zdGVvZ2c0OHYifQ.s8MMs2wW15ZyUfDhTS_cdQ";

// function windowResized(){

//   resizeCanvas(100, 100);
// }

//var координати Києва
const options = {
    lat: 50.45466,
    lng: 30.5238,
    zoom: 12,
    minZoom: 10,
    style: 'YearsPng/{z}/{x}/{y}.png'
};

const mappa = new Mappa('Leaflet');


// ЗАВАНТАЖЕННЯ ДАНИХ з json
function preload(){
  data = loadJSON('./data/id_housesKiev.geojson');
  //data_back = loadJSON('./data/all_buildings.geojson');
  
}

// СТВОРЕННЯ ФУНКЦІЇ, яка буде малювати фонові будинки
 // function draw_all_buildings(){

                         
 //                for(let i = 0; i < back.length; i++){
 //                      var back_houseShape = back[i];
 //                      fill(20);
                      
 //                        beginShape();
 //                        for (let k = 0; k < back_houseShape.length; k++){
 //                          if(  !isNaN(back_houseShape[k][1]) &&  !isNaN(back_houseShape[k][0]) ){
 //                            let pos = myMap.latLngToPixel(back_houseShape[k][1], back_houseShape[k][0])
 //                            vertex(pos.x, pos.y);
 //                          } 
 //                        } 

 //                      //}  
 //                      endShape(CLOSE);
 //                      //}
 //                }
              
 //  }


function  setup(){
  // змінює частоту зміни екранів
  //frameRate(3000);

  canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.9).parent("#mapContainer");
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);





// // створюємо загальний масив усіх координат усіх будинків фону
//   back_city = myMap.geoJSON(data_back, 'MultiPolygon');
//   //console.log(back_city);
// for (var i =0; i < back_city.length; i++){
//   var back_building = back_city[i];
//   for (var b = 0; b < back_building.length; b++){
//     var back_coord = back_building[b];
//     for(var h = 0; h < back_coord.length; h++){
//       var back_house = back_coord[h]
//       back.push(back_house)
      
//     }
    
    
//   }
// }



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
   
  

  // create slider (min position, max position, start of a slider)
  
  
  slider = createSlider(1854, 2019, 1854).parent('#slider');
  //slider.position(60, 50);
   
  //slider.style('width', '1140px');

  inp = createInput(slider.value() ).parent('#year');
  // inp.style('width', '50px', 'borderWidth', '0');
  // inp.style('borderWidth', '0');
  // inp.style('textAlign', 'center');
  // inp.style('fontStyle', 'bold');
  
  //inp.borderColor(255);
  //nameP = createP();

  //console.log(nameP)

  

}

// змінна глобольного часу, за який має намалюватися все
//var tTotal = (2018-1854)*5000;
// total time of animation змінна частоти з якою з'являються групи будинків
var interval = 20000;
// змінна початкового року
var yearStart = 1854;


//let foo = chroma.scale(['black', '6d0060', '6479e0', '00ffff']).mode('lab');
//let foo = chroma.scale(['black', '9c0068',  '8e57ff', '00ffff']).mode('lab');
//let foo = chroma.scale(['black', '4d0080',  '4496e9', '00ffff']).mode('lab');
let foo = chroma.scale(['black', '8c0040',  '8359d4', '00ffff']).mode('lab');
//let foo = chroma.scale(['black', '450e5e',  '74aacf', '22dc8b']).mode('lab');



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

function draw(){
  
  clear();

  
// змінна яка утримує в собі час в мілісекундах, що пройшов від початку запуску фунції draw      
var tPresent = millis();
// змінна, яка оючислює кінцевий рік, тобто той рік, в якому зараз знаходиться цикл по часу
//var yearLast = (yearStart+int((tPresent*allYears)/interval));

  // викликаємо фунцію в циклі, який проходиться по всіх роках
  var yearLast = slider.value();
  //background(255);
  for(var i = yearStart; i < yearLast; i++){
   
    var b = map(i, 1854, 2019, 0, 1);

    var mycolor = foo(b).rgb();
 //console.log(mycolor)   
    fill(mycolor, 50);
    stroke(mycolor);
    strokeWeight(0.5);
    smooth();
    
    //strokeWeight(10);
    showOneYear(i);
    //fill(100,100,100);
    //draw_all_buildings();
    inp.value(i);
    
   }
    
      
}









  

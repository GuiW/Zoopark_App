(function($){
  $(function(){

    //ANIMAUX PANELS
    $("#animals").on('click', '.reveal-content', function() {
      var othersPanels = $(".reveal-content").not(this);

      //Fermer les autres panneaux
      othersPanels.removeClass("active");
      othersPanels.find('.card-arrow').text('keyboard_arrow_down');

      $(this).toggleClass('active');

      if($(this).hasClass('active')) {
        $(this).find('.card-arrow').text('keyboard_arrow_up');
      }
      else {
        $(this).find('.card-arrow').text('keyboard_arrow_down');
      }
    })

/******************************************************************************/
/**************************** GEOLOCALISATION *********************************/
/******************************************************************************/

//Variables globales
var tempLat = 50.47094456845385;
var tempLong = 4.468710422515869;
var latMax = 50.474642;
var latMin = 50.468388;
var longMax = 4.474784;
var longMin = 4.461202;


function Geolocalisation() {
  var optionsGeo = {
    enableHighAccuracy: true,
    timeout: 12000, //Durée avant affichage d'erreur
    maximumAge: 600 //Durée de mise en cache de la position
  }
  navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optionsGeo);
}

function successGeo(pos) {
  crd = pos.coords;
  posLong = crd.longitude;
  posLat = crd.latitude;

  //Si la géolocalisation n'est pas assez précise
  if (posLat > latMax || posLat < latMin || posLong > longMax || posLong < longMin) {
    CalculCoordo(tempLong, tempLat, $('#pointer'));
  }
  else {
    CalculCoordo(posLong, posLat, $('#pointer'));
  }
}

function errorGeo(err) {
  console.log(err);
}

function AnimalsCoordo() {
  $('.animal-icon').each(function(){
    long = $(this).attr('data-long');
    lat = $(this).attr('data-lat');
    CalculCoordo(long, lat, $(this));
  })
}

function CalculCoordo (long, lat, el){ 
  ratio_long = longMax - longMin;
  posLong =  ((long - longMin)/ratio_long)*100 + "%";
  ratio_lat = latMax - latMin;
  posLat =  ((latMax - lat)/ratio_lat)*100 + "%";
  el.css({"top": posLat, "left": posLong});
}

Geolocalisation();
AnimalsCoordo();

/******************************************************************************/
//Animals icons - Toggle visibility
$('#select-icons').on('change', function(){
  selectVal = $(this).val();

  $(".animal-icon").each(function(){
    if($(this).attr("data-animal") == selectVal) {
      $(this).addClass("active");
    }
    else {
      $(this).removeClass("active");
    }
  })

})


  }); // end of document ready
})(jQuery); // end of jQuery name space
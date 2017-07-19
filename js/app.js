$(function(){
  /** MATERIALIZE TABS **/
  $('ul.tabs').tabs({ 'swipeable': true });
});

/** APP **/
  var app = new Vue({
      el: '#app',
      data: {

        requetes : [
          {
            link : 'https://killer-cepegra.xyz/skills3/Zoopark//wp-json/wp/v2/animal',
            key : "animaux",
            dataLocation : "listingAnimals"
          },
          {
            link : 'https://killer-cepegra.xyz/skills3/Zoopark//wp-json/wp/v2/pages/85',
            key : "map",
            dataLocation : "dataMap"
          },
          {
            link : 'https://killer-cepegra.xyz/skills3/Zoopark//wp-json/wp/v2/posts?categories=4',
            key : "activites",
            dataLocation : "listingActivites"
          }
        ],

        listingAnimals: [],
        listingActivites: [],
        dataMap: null,
        errorMsg: "",
        geo : {
          error : false,
          tempLat : 50.47094456845385,
          tempLong : 4.468710422515869,
          latMax : 50.474642,
          latMin : 50.468388,
          longMax : 4.474784,
          longMin : 4.461202,
          posLat : 0,
          posLong : 0
        },
        mapLoaded : false,
        animalsLoaded : false
      },

      mounted: function() {
        this.myGeo(),
        this.loadWpData()
      },

      methods: {
        loadWpData: function(){
          self = this;

          //Boucle dans le tableau des requêtes
          $.each(this.requetes, function(index, requete){
          //Lien de la requête
            var restlink = requete.link;
          //REQUETE
            axios.get(restlink).then(
              //En cas de succès
              function(response){
                localStorage.setItem(requete.key, JSON.stringify(response.data))
                self.synchronisation(requete.dataLocation, requete.key);
              }
            ).catch(
              //En cas d'erreur
              function(error) {
                  console.log(error);
                //On check si le localstorage est vide ou pas
                if (localStorage.getItem(requete.key)) {
                  self.synchronisation(requete.dataLocation, requete.key);
                }
                else {
                  self.errorMsg = "Désolé, vous devez être connecté à internet pour charger le contenu de cette page"
                }
            })
          })
        },

        synchronisation : function(data, key){

          if(this.dataMap != null && this.mapLoaded == false) {
            this.pointerPos();
          }

          this[data] = JSON.parse(localStorage.getItem(key));
          
          if(this.listingAnimals.length > 0 && this.animalsLoaded == false) {
            this.AnimalsCoordo();
          }
        },

        myGeo : function() {
          self = this;
          tempLat = this.geo.tempLat;
          tempLong = this.geo.tempLong
          latMax = this.geo.latMax;
          latMin = this.geo.latMin;
          longMax = this.geo.longMax;
          longMin = this.geo.longMin;

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
            self.geo.posLong = crd.longitude;
            self.geo.posLat = crd.latitude;
            console.log("Geo Done")
          }

          function errorGeo(err) {
            console.log(err);
            self.geo.error = true;
          }

          Geolocalisation();
        },

        pointerPos : function() {
          tempLat = this.geo.tempLat;
          tempLong = this.geo.tempLong
          latMax = this.geo.latMax;
          latMin = this.geo.latMin;
          longMax = this.geo.longMax;
          longMin = this.geo.longMin;
          posLong = this.geo.posLong;
          posLat = this.geo.posLat;

          //Si la géolocalisation n'est pas assez précise
          if (posLat > latMax || posLat < latMin || posLong > longMax || posLong < longMin) {
            this.CalculCoordo(tempLong, tempLat, $('#pointer'));
            this.mapLoaded = true;
          }
          else {
            this.CalculCoordo(posLong, posLat, $('#pointer'));
            this.mapLoaded = true;
          }
        },

        AnimalsCoordo : function() {
          self = this;
          anlist = document.querySelectorAll('.animal-icon')
          console.log(anlist);
          for(item of anlist) {
            console.log(item)
          }
          //console.log($(".animal-icon"));
          $(".animal-icon").each(function(){
            long = $(this).attr('data-long');
            lat = $(this).attr('data-lat');
            self.CalculCoordo(long, lat, $(this));
          })
          this.animalsLoaded = true;
        },

        CalculCoordo : function(long, lat, el){
          ratio_long = longMax - longMin;
          posLong =  ((long - longMin)/ratio_long)*100 + "%";
          ratio_lat = latMax - latMin;
          posLat =  ((latMax - lat)/ratio_lat)*100 + "%";
          el.css({"top": posLat, "left": posLong});
        }

      }
  })


 




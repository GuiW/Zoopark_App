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
            link : 'http://localhost:7883/ingrwf05/ingrwf05_ei/zoopark/wp-json/wp/v2/animal',
            key : "animaux",
            dataLocation : "listingAnimals"
          },
          {
            link : 'http://localhost:8888/ingrwf05/ingrwf05_ei/zoopark/wp-json/wp/v2/pages/85',
            key : "map",
            dataLocation : "dataMap"
          },
          {
            link : 'http://localhost:8888/ingrwf05/ingrwf05_ei/zoopark/wp-json/wp/v2/posts?categories=4',
            key : "activites",
            dataLocation : "listingActivites"
          }
        ],

        listingAnimals: [],
        listingActivites: [],
        dataMap: {},
        errorMsg: ""
      },
      mounted: function() {
        this.loadWpData();
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
                if (localStorage.requete.key) {
                  self.synchronisation();
                }
                else {
                  self.errorMsg = "Désolé, vous devez être connecté à internet pour charger le contenu de cette page"
                }
            })
          })
        },

        synchronisation : function(data, key){
          this[data] = JSON.parse(localStorage.getItem(key));
        }
      }
  })


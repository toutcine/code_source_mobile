angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
          $ionicPopup.confirm({
              title: "Internet Disconnected",
              content: "The internet is disconnected on your device."
          }).then(function(result) {
              if(!result){
                  ionic.Platform.exitApp();
              }
          });
      }
    }
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'profilCtrl'
      }
    }
  })

  .state('app.film', {
    url: '/film/:categorie',
    views: {
      'menuContent': {
        templateUrl: 'templates/film.html',
        controller: 'byCategorie'
      }
    }
  })

  .state('app.inscription', {
    url: '/inscription',
    views: {
      'menuContent': {
        templateUrl: 'templates/inscription.html',
        controller: 'inscription'
      }
    }
  })

  .state('app.serie', {
    url: '/serie',
    views: {
      'menuContent': {
        templateUrl: 'templates/serie.html'
      }
    }
  })

  .state('app.index', {
      url: '/index',
      views: {
        'menuContent': {
          templateUrl: 'templates/index.html',
          controller: 'allFilm'
        }
      }
    })

  .state('app.connexion', {
      url: '/connexion',
      views: {
        'menuContent': {
          templateUrl: 'templates/connexion.html',
          controller: 'LoginCtrl'
        }
      }
    })

  .state('app.genre', {
    url: '/genre/:genre',
    views: {
      'menuContent': {
        templateUrl: 'templates/genre.html',
        controller: 'byGenre'
      }
    }
  })

  .state('app.fiche', {
    url: '/fiche/:id',
    views: {
       'menuContent': {
        templateUrl: 'templates/fiche.html',
        controller: 'getFiche'
      },
      'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
              }
        }
    }
  })

  .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

$urlRouterProvider.otherwise('/app/index');
});

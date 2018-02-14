angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
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

  .state('app.upload', {
    url: '/upload',
    views: {
      'menuContent': {
        templateUrl: 'templates/upload.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('app.profil', {
    url: '/profil',
    views: {
      'menuContent': {
        templateUrl: 'templates/profil.html',
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
      }
    }
  })

$urlRouterProvider.otherwise('/app/index');
});

'use strict';

angular.module('bricksApp.settings', [
    'ngRoute',
    'bricksApp.common'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/settings', {
        templateUrl: 'scripts/settings/settings.html',
        controller: 'SettingsCtrl'
      });
  })

  .controller('SettingsCtrl', function ($location, $scope, $window, apps) {
    // Watches for change to the current app.
    $scope.appsService = apps;
    $scope.$watch('appsService.current()', function (newVal) {
      $scope.app = angular.copy(newVal);
    }, true);

    $scope.saveSettings = function () {
      var form = angular.element(document.settingsForm);

      if (form.controller('form').$valid) {
        apps.update($scope.app);
      }
    };

    // Delete the app if the user confirms
    $scope.deleteApp = function (app) {
      var confirmed = $window.confirm('Are you sure you want to delete the app "' +
                                    app.name + '"? There\'s no going back.');
      if (confirmed) {
        apps.remove(app.id);
        $location.path('/');
      }
    };
  });

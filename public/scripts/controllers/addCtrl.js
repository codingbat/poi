(function () {
    angular.module('addCtrl', [
        'geolocation',
        'locService',
    ]).controller('addCtrl',
        function ($scope, $http, $rootScope, geolocation, locService) {
            $scope.formData = {};
            var coords = {};

            $scope.formData.lng = -9.6749289;
            $scope.formData.lat = 52.2866651;

            geolocation.getLocation()
                .then(function (data) {
                    coords = {lat: data.coords.latitude, long: data.coords.longitude};

                    $scope.formData.lng = parseFloat(coords.long).toFixed(7);
                    $scope.formData.lat = parseFloat(coords.lat).toFixed(7);

                    locService.refresh($scope.formData.lat, $scope.formData.lng);
                });

            $rootScope.$on('clicked', function () {
                $scope.$apply(function () {
                    $scope.formData.lat = parseFloat(locService.clickLat).toFixed(7);
                    $scope.formData.lng = parseFloat(locService.clickLong).toFixed(7);
                });
            });

            $scope.refreshLoc = function () {
                geolocation.getLocation()
                    .then(function (data) {
                        coords = {lat: data.coords.latitude, long: data.coords.longitude};

                        $scope.formData.lat = parseFloat(coords.long).toFixed(7);
                        $scope.formData.lng = parseFloat(coords.lat).toFixed(7);
                        locService.refresh(coords.lat, coords.long);
                    });
            };

            $scope.createPOI = function () {
                var poiData = {
                    name: $scope.formData.name,
                    phone_number: $scope.formData.phone_number,
                    address: $scope.formData.address,
                    website: $scope.formData.website,
                    location: [$scope.formData.lng, $scope.formData.lat],
                    type: $scope.formData.type,
                };

                $http.post('/locations', poiData)
                    .success(function (data) {
                        locService.refresh($scope.formData.lat, $scope.formData.lng);
                        $scope.formData.name = '';
                        $scope.formData.address = '';
                        $scope.formData.website = '';
                        $scope.formData.type = '';
                        $scope.formData.phone_number = '';
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });
            };
        });
})();

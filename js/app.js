angular.module('krossoverExercize', [])
  .controller('videoClip', ['$sce', '$scope', function($sce, $scope) {

    $scope.clips = [];

    $scope.createClip = function () {
      $scope.newClip = {};
      $scope.creatingClip = true;
    }

    $scope.selectFullClip = function () {
      $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4');
    };

    $scope.select = function (clip) {
        $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4#t='+ clip.start + ',' + clip.end);
    };

    $scope.addClip = function () {
      $scope.clips.push($scope.newClip);
      $scope.creatingClip = false;
    };

    $scope.edit = function (clip) {
      clip.editing = true;
    };

    $scope.save = function (clip) {
      clip.editing = false;
    };

    $scope.remove = function (index) {
      $scope.clips.splice(index, 1);
    }
  }]);

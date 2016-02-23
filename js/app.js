angular.module('krossoverExercize', [])
  .controller('videoClip', ['$sce', '$scope', function($sce, $scope) {

    $scope.clips = [];

    $scope.createClip = function () {
      $scope.clip = {};
      $scope.creatingClip = true;
    }

    $scope.selectFullClip = function () {
      _unselectAllClips();
      $scope.fullClipSelected = true;
      $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4');
    };

    $scope.select = function (clip) {
      _unselectAllClips();
      clip.selected = true;
      $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4#t='+ clip.start + ',' + clip.end);
    };

    function _unselectAllClips () {
      $scope.fullClipSelected = false;
      $scope.clips= $scope.clips.map(function(clip) {
        clip.selected = false;
        return clip;
      });
    }

    $scope.addClip = function () {
      $scope.clips.push($scope.clip);
      $scope.creatingClip = false;
    };

    $scope.save = function (clip) {
      clip.editing = false;
      clip.showControls = false;
    };

    $scope.remove = function (index) {
      $scope.clips.splice(index, 1);
    }
  }]);

angular.module('krossoverExercize', [])
  .controller('videoClip', ['$sce', '$scope', function($sce, $scope) {

    $scope.clips = [];

    $scope.createClip = function () {
      $scope.clip = {};
      $scope.creatingClip = true;
    }

    $scope.selectFullClip = function () {
      $scope.fullClipSelected = true;
      $scope.currentClip = null;
      $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4');
    };

    $scope.select = function (clip) {
      $scope.fullClipSelected = false;
      $scope.currentClip = clip;
      $scope.videoSource = $sce.trustAsResourceUrl('sintel_trailer-480.mp4#t='+ clip.start + ',' + clip.end);
    };

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
    };
  }])

  .directive('playNextClipIfFinished', ['$timeout', '$document', function ($timeout, $document) {
    return {
      restrict: 'A',
      compile: function ($element, attr) {
        return function ($scope, element) {

          var videoplayer = angular.element($document[0].getElementById('video-player'));

          videoplayer.on('timeupdate', function () {
            if (currentClipIsOver() && thereIsANextCLip()) {
              $scope.videoSource = null;
              $scope.showNextClipButton = true;
              $scope.$apply();
            }
          });

          videoplayer.on('ended', function () {
            $scope.videoSource = null;
            if (thereIsANextCLip()) {
              $scope.showNextClipButton = true;
              $scope.$apply();
            }
          });

          $scope.playNextClip = function () {
            $scope.clipLoading = true;
            $timeout(function () {
              $scope.clipLoading= false;
              var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + 1;
              var nextClip = $scope.clips[indexOfNextClip];
              $scope.select(nextClip);
            }, 3000);
          };

          function currentClipIsOver () {
            return $scope.currentClip && $scope.currentClip.end <= videoplayer[0].currentTime;
          }

          function thereIsANextCLip () {
            var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + 1;
            return $scope.clips.length > indexOfNextClip;
          }

        };
      }
    };
  }]);

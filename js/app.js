angular.module('krossoverExercize', [])
  .controller('clipPlayerController', ['$sce', '$document', '$timeout', '$scope', function ($sce, $document, $timeout, $scope) {

    var VIDEO_URL = 'sintel_trailer-480.mp4';
    var WAIT_TIME_BETWEEN_CLIPS = 3000;

    $scope.videoPlayerView = 'noClipSelected';
    $scope.clips = [];

    $scope.createClip = function () {
      $scope.clip = {};
      $scope.creatingClip = true;
    };

    $scope.addClip = function () {
      $scope.clips.push($scope.clip);
      $scope.creatingClip = false;
    };

    $scope.selectFullClip = function () {
      $scope.videoPlayerView = 'clipPlaying';
      $scope.fullClipSelected = true;
      $scope.currentClip = null;
      $scope.videoSource = $sce.trustAsResourceUrl(VIDEO_URL);
    };

    $scope.select = function (clip) {
      $scope.videoPlayerView = 'clipPlaying';
      $scope.fullClipSelected = false;
      $scope.currentClip = clip;
      $scope.videoSource = $sce.trustAsResourceUrl(VIDEO_URL + '#t='+ clip.start + ',' + clip.end);
    };

    $scope.save = function (clip) {
      clip.editing = false;
      clip.showControls = false;
    };

    $scope.removeClip = function (index) {
      $scope.clips.splice(index, 1);
      if($scope.clips.indexOf($scope.currentClip) === index) {
        $scope.currentClip = null;
      }
    };

    $scope.playNextClip = playNextClip;

    var videoplayer = angular.element($document[0].getElementById('video-player'));

    videoplayer.on('timeupdate', function () {
      if (currentClipIsOver() && thereIsANextClip()) {
        $scope.videoPlayerView = 'clipFinished';
        $scope.$apply();
      }
    });

    videoplayer.on('ended', function () {
      if (thereIsANextClip()) {
        $scope.videoPlayerView = 'clipFinished';
        $scope.$apply();
      }
    });

    $document.on('keypress', function(e){
       if (e.which === 113 && thereIsAPreviousCLip()){
         pauseVideoAndShowLoadingScreen();
         playPreviousClip();
       } else if (e.which === 119 && thereIsANextClip()) {
         pauseVideoAndShowLoadingScreen();
         playNextClip();
       }

       function pauseVideoAndShowLoadingScreen () {
         $scope.videoPlayerView = 'clipLoading';
         $scope.$apply();
         videoplayer[0].pause();
       }
     });

     //Unbind DOM listeners to prevent memory leaks//
     $scope.$on('$destroy', function () {
       $document.unbind('keypress');
       videoplayer.unbind('timeupdate ended');
     });

    function currentClipIsOver () {
      return $scope.currentClip && $scope.currentClip.end <= videoplayer[0].currentTime;
    }

    function thereIsANextClip () {
      if ($scope.currentClip) {
        var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + 1;
        return $scope.clips.length > indexOfNextClip;
      } else if ($scope.fullClipSelected) {
        return $scope.clips.length > 0;
      } else {
        return $scope.videoPlayerView === 'noClipSelected';
      }
    }

    function thereIsAPreviousCLip () {
      if ($scope.fullClipSelected || $scope.videoPlayerView === 'noClipSelected') { return false; }
      else { return true; }
    }

    function playNextClip () {
      $scope.videoPlayerView = 'clipLoading';
      $timeout(function () {
        if (!$scope.videoSource) {
          $scope.selectFullClip();
        } else {
          var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + 1,
            nextClip = $scope.clips[indexOfNextClip];
          $scope.select(nextClip);
        }
      }, WAIT_TIME_BETWEEN_CLIPS);
    }

    function playPreviousClip () {
      $scope.videoPlayerView = 'clipLoading';
      $timeout(function () {
        if($scope.clips.indexOf($scope.currentClip) === 0) {
          $scope.selectFullClip();
        } else {
          var indexOfPreviousClip = $scope.clips.indexOf($scope.currentClip) - 1,
            previousClip = $scope.clips[indexOfPreviousClip];
          $scope.select(previousClip);
        }
      }, WAIT_TIME_BETWEEN_CLIPS);
    }

  }])

  .directive('clipPlayer', [function() {
    return {
      restrict: 'E',
      controller: 'clipPlayerController',
      templateUrl: 'clipPlayerTemplate',
      scope: {
        editable: '='
      }
    };
  }]);

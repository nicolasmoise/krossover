angular.module('krossoverExercize', [])
  .controller('clipPlayerController', ['$sce', '$document', '$timeout', '$scope', function ($sce, $document, $timeout, $scope) {

    var VIDEO_URL = 'sintel_trailer-480.mp4';

    $scope.videoPlayerView = 'noClipSelected';

    $scope.clips = [];

    $scope.createClip = function () {
      $scope.clip = {};
      $scope.creatingClip = true;
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

    $scope.playNextClip = function () {
      $scope.videoPlayerView = 'clipLoading';
      $timeout(function () {
        if ($scope.videoSource === null && !$scope.showNextClipButton && !$scope.clipLoading) {
          $scope.selectFullClip();
        } else {
          var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + 1;
          var nextClip = $scope.clips[indexOfNextClip];
          $scope.select(nextClip);
        }
      }, 3000);
    };

    $scope.playPreviousClip = function () {
      $scope.videoPlayerView = 'clipLoading';
      $timeout(function () {
        var indexOfNextClip = $scope.clips.indexOf($scope.currentClip) + -1;
        if(indexOfNextClip === -1) {
          $scope.selectFullClip();
        } else {
          var nextClip = $scope.clips[indexOfNextClip];
          $scope.select(nextClip);
        }
      }, 3000);
    };

    var videoplayer = angular.element($document[0].getElementById('video-player'));

    videoplayer.on('timeupdate', function () {
      if (currentClipIsOver() && thereIsANextClip()) {
        $scope.videoPlayerView = 'clipFinished';
        $scope.showNextClipButton = true;
        $scope.$apply();
      }
    });

    videoplayer.on('ended', function () {
      $scope.videoPlayerView = 'clipFinished';
      if (thereIsANextClip()) {
        $scope.showNextClipButton = true;
        $scope.$apply();
      }
    });

    $document.on('keypress', function(e){
       if (e.which === 113 && thereIsAPreviousCLip()){
         videoplayer[0].pause();
         $scope.videoPlayerView = 'clipLoading';
         $scope.$apply();
         $scope.playPreviousClip();
       } else if (e.which === 119 && thereIsANextClip()) {
         videoplayer[0].pause();
         $scope.videoPlayerView = 'clipLoading';
         $scope.$apply();
         $scope.playNextClip();
       }
     });

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
      return true;
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

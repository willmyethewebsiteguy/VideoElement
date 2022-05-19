/* ==========
  Video Element 1.2
  Video Elements For Sqaurespace
  Copyright Will-Myers
========== */
(function(){
  function VideoPlayer(el, params){
    let videoObj = {
      source: params.source || false,
      loop: params.loop || 'false', 
      autoPlay: params.autoPlay || 'false', 
      stopOutView: params.stopOutView || 'false',
      touchScrub: params.touchScrub || 'false', 
      playbackRate: params.playbackRate || 1, 
      volume: params.volume || 1, 
      tapPause: params.tapPause || 'false',
      isolateVideo: params.isolateVideo || 'false',
      onVideoEnd: params.onVideoEnd || null,
      onVideoStart: params.onVideoStart || null, 
      onVideoPause: params.onVideoPause || null, 
      onVideoPlay: params.onVideoPlay || null
    };

    let player = el.querySelector('.player'),
        video = el.querySelector('video'),
        controls = el.querySelector('.controls'),

        playPauseControl = el.querySelector('.play-pause-control'),
        replayControl = el.querySelector('.replay-control'),
        volumeControl = el.querySelector('.volume-control'),
        fullScreenControl = el.querySelector('.full-screen-control'),
        playheadControl = el.querySelector('.playhead-control'),
        playheadControlRange = playheadControl.querySelector('.playhead-range span'),
        userPaused;
    
    video.ontimeupdate = (event) => {
      updatePlayhead(event);
    }
    video.toggleVolume = () => {
      video.muted = !video.muted;
      video.setVolumeState();
    }
    video.playVideo = () =>{
      video.play(); 
      if (videoObj.isolateVideo == 'true') {
         pauseAllVideos(video);
      }
    }
    video.pauseVideo = () =>{
      video.pause(); 
    }
    
    video.setVolumeState = () => {
      if (video.muted == true || video.volume == 0){
        el.setAttribute('data-video-mute', 'true')
      } else {
        el.setAttribute('data-video-mute', 'false')
      }
    }
    video.addEventListener('pause', function() {
      el.setAttribute('data-video-state', 'paused');
    })
    video.addEventListener('play', function() {
      el.setAttribute('data-video-state', 'playing');
    })

    /*==== Functions & Vars ====*/
    playPauseControl.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      if (video.paused) {
        video.playVideo(); 
        userPaused = false;
      } else {
        video.pauseVideo();
        userPaused = true;
      }
    })
    replayControl.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      video.playVideo()
    });
    playheadControl.addEventListener('click', function(event) {
      jumpToLocation(event);
    })
    volumeControl.addEventListener('click', function(){
      video.toggleVolume();
    });
    
    fullScreenControl.addEventListener('click', toggleFullScreen);

    function pauseAllVideos(thisVideo) {
      let videos = document.querySelectorAll('.wm-video-block video');

      videos.forEach(v => {
        if (v !== thisVideo) {
          v.pause();
        }
      });
    }

    
    function toggleFullScreen() {
      let doc = window.document;

      let requestFullScreen = video.webkitEnterFullScreen || video.requestFullscreen || video.mozRequestFullScreen || video.msRequestFullscreen,
          cancelFullScreen = doc.webkitExitFullscreen || doc.exitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;

      if(!doc.webkitFullscreenElement && !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(video);
      }
      else {
        cancelFullScreen.call(doc);
      }
    }
    
    let completePercent;
    
    function updatePlayhead(event) {
      completePercent = ((video.currentTime / video.duration) * 100) + '%';
      playheadControlRange.style.width = completePercent;
    }

    function jumpToLocation(event) {
      let jumpToPercent = event.offsetX / playheadControl.offsetWidth;
      video.currentTime = jumpToPercent * video.duration;
    }

    /*==== Init Vars ====*/
    /*Init Video as Paused*/
    video.playsInline = true;
    el.setAttribute('data-video-state', 'loaded');

    /*Set Volume*/
    video.volume = videoObj.volume;
    video.muted = true;
    if (videoObj.volume > 0) {
      video.muted = false;
    } else if (videoObj.volume == 0){
      volumeControl.style.display = 'none';
    }
    video.setVolumeState();

    /*Touch Or Click Video Element to Play*/
    if (videoObj.tapPause == 'true') {
      el.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        if (!e.target.classList.contains('controls')) return;
        if (video.paused) {
          video.playVideo(); 
          userPaused = false;
        } else {
          video.pauseVideo();
          userPaused = true;
        }
      }, false)
    }

    if (videoObj.autoPlay == 'true'){
      if(!!window.IntersectionObserver){
        userPaused = false; 
        let observer = new IntersectionObserver((entries, observer) => { 
          entries.forEach(entry => {
            if(entry.intersectionRatio > .9 && !userPaused) {
              video.muted = true;
              video.setVolumeState();
              video.playVideo(); 
              //observerPaused = false;
            } else if (!userPaused) {
              video.pauseVideo();
              //observerPaused = true;
            }
          });
        }, {threshold: .9});
        observer.observe(video) ;
      }
    } else if (videoObj.autoPlay == 'onLoad') {
      setTimeout(function() {
        video.muted = true;
        video.setVolumeState();
        video.playVideo();
        el.setAttribute('data-video-state', 'playing');
      }, 10);
    }

    /*Set PlayBackRate*/
    video.playbackRate = videoObj.playbackRate;

    /*Set Video Loop*/
    if (videoObj.loop == 'true') {
      video.loop = true
    } else {
      video.loop = false;
      video.addEventListener('ended', function(){
        el.setAttribute('data-video-state', 'stopped')
      })
    }
    el.classList.add('loaded');
    window.addEventListener('wmVideoCSSLoaded', function(){
      controls.querySelectorAll('svg').forEach(svg => {
        svg.style.opacity = null;
      });
    })
    
    /*Listen for Popup Close*/
    window.addEventListener('wmPopupClosed', function() {
      video.pause();
      el.setAttribute('data-video-state', 'paused');
    })
  }

  /*Build Video Element*/
  function VideoElement(el, params){
    let defaultPlaySVGStr = `<svg class="play-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Play Background Video</title> <path data-name="layer1" fill="var(--icon-fill)" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M16 6 L58 32 L16 58V6z" stroke-linejoin="round" stroke-linecap="round"></path> </svg>`,
        defaultPauseSVGStr = `<svg class="pause-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Pause Background Video</title> <path data-name="layer2" fill="var(--icon-fill)" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M13 8h12V56H13z" stroke-linejoin="round" stroke-linecap="round"></path> <path data-name="layer1" fill="var(--icon-fill)" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M41 8h12V56H41z" stroke-linejoin="round" stroke-linecap="round"></path> </svg>`,
        defaultReplaySVGStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Replay Background Video</title> <path data-name="layer2" d="M53.832 34.947a26.016 26.016 0 1 0-7.45 15.432" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path> <path data-name="layer1" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M62 23l-8.168 11.947L43.014 25" stroke-linejoin="round" stroke-linecap="round"></path> </svg>`,
        defaultVolumeSVGStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> 
          <title>Background Video Mute Button</title> 
          <path data-name="low-volume" d="M40.2 21.8a12 12 0 0 1 0 20.5" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path> 
           <path data-name="medium-volume" d="M46 16a20 20 0 0 1 0 32" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path> 
           <path data-name="high-volume" d="M51.8 10.2a28 28 0 0 1 .1 43.5" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path> 
          <path data-name="main-layer" d="M34 6L16 24H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12l18 18z" fill="var(--icon-fill)" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path> 
          <path data-name="mute-layer" d="M6 6L58 58" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" stroke-linejoin="round" stroke-linecap="round"></path>
          </svg>`,
        defaultFullScreenSVGStr = `<svg style="opacity:0;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Maximize Screen</title><path data-name="layer2" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M16 22h32v20H16z" stroke-linejoin="round" stroke-linecap="round"></path> <path data-name="layer1" fill="none" stroke="var(--icon-color)" stroke-miterlimit="10" stroke-width="var(--icon-width)" d="M2 16V2h20m40 14V2H42M2 49v13h20m40-14v14H42" stroke-linejoin="round" stroke-linecap="round"></path></svg>`,
        defaultPlayheadHTML = `<div class="playhead-range"><span class="indicator"></span>
        </div>`

    let player = document.createElement('div'),
        video = document.createElement('video'),
        source = document.createElement('source'),
        controls = document.createElement('controls'),
        
        playPauseControl = document.createElement('div'),
        volumeControl = document.createElement('div'),
        replayControl = document.createElement('div'),
        playheadControl = document.createElement('div'),
        fullScreenControl = document.createElement('div');
        
    /*Add Player El*/
    el.append(player);
    player.append(video);
    player.append(controls);

    /*Add Video El*/
    video.append(source);
    video.muted = true;
    video.allowfullscreen = true;
    video.height = 'auto';
    video.preload = 'metadata';
    source.src= params.source + '#t=0.1';
    source.type = 'video/mp4';

    /*Add Controls El*/
    controls.append(playPauseControl);
    controls.append(replayControl);
    controls.append(volumeControl);
    controls.append(playheadControl)
    controls.append(fullScreenControl);

    /*Add Buttons El*/
    playPauseControl.innerHTML = defaultPlaySVGStr + defaultPauseSVGStr;
    replayControl.innerHTML = defaultReplaySVGStr;
    volumeControl.innerHTML = defaultVolumeSVGStr;
    fullScreenControl.innerHTML = defaultFullScreenSVGStr;
    playheadControl.innerHTML = defaultPlayheadHTML;

    /*Adding Classes*/
    el.classList.add('wm-video-block');
    player.classList.add('player');

    controls.classList.add('controls');
    playheadControl.classList.add('playhead-control', 'control')
    playPauseControl.classList.add('play-pause-control', 'control');
    replayControl.classList.add('replay-control', 'control');
    volumeControl.classList.add('volume-control', 'control');
    fullScreenControl.classList.add('full-screen-control', 'control');
    if (params.fullscreen == 'false') fullScreenControl.style.display = 'none';

    function strToHtml(str) {
      return new DOMParser().parseFromString(str, "text/xml").firstChild.innerHTML;
    }
    /*Get Dimensions*/
    video.addEventListener('loadedmetadata', function() {
      el.style.setProperty('--aspect-ratio', video.videoHeight / video.videoWidth);
      el.classList.add('video-loaded')
    }, false);
    el.style.height = null;
  }

  function init(){
    let vids = document.querySelectorAll('[data-wm-plugin="video"]:not(.loaded)');
    if (vids.length !== 0){
      vids.forEach(vid => {
        let params = {
          source: vid.dataset.source || null,
          autoPlay: vid.dataset.autoPlay || null,
          fullscreen: vid.dataset.fullscreen || null,
          loop: vid.dataset.loop || null,
          isolateVideo: vid.dataset.isolateVideo || null,
          playbackRate: vid.dataset.playbackRate || null,
          volume: vid.dataset.volume || null,
          tapPause: vid.dataset.tapPause || null
        };

        new VideoElement(vid, params);
        new VideoPlayer(vid, params);
      });
     
      if(!document.querySelector('#wm-video-element-css')){
        addCSSFileToHeader('https://assets.codepen.io/3198845/WMMicroVideo210316v1.1.2.css');
        function addCSSFileToHeader(url) {
          let head = document.getElementsByTagName('head')[0],
              link = document.createElement('link');
          link.id = 'wm-video-element-css'
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = url;
          link.onload = function(){
            document.querySelector('body').classList.add('wm-video-css-loaded');
            let event = new Event('wmVideoCSSLoaded');
            window.dispatchEvent(event);
          }
          head.prepend(link);
        };
      } else {
        document.head.prepend(document.querySelector('#wm-video-element-css'));
        let event = new Event('wmVideoCSSLoaded');
        window.dispatchEvent(event);
      }
    }
  }
  init();
  ['DOMContentLoaded', 'load', 'resize', 'wMPopupBuilt'].forEach(event => {
    window.addEventListener(event, function(){
      init();
    })
  })
}());
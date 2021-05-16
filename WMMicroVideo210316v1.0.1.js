/* ==========
  Video Element 1.0.1
  Video Elements For Sqaurespace
  Copyright Will-Myers
========== */
/*
let wMVideoObjectJSON = {
  container: el, // default: data-wm-plugin="video"; Element in DOM 
  source: url,  // default: none; URL Source of Video
  loop: string, // default: false; true, false, # (number of Loops)
  autoPlay: string, // default: in view; true, false, in view
  touchScrub: str, //default: no
  playBackRate: str, //default: 100%; 0% - 100% 
  volumeOnLoad: str, //default: 0%; 0% - 100% 
  tapPause: str,// default: false; true, false
  styles:{
    playPauseBtn: str, // default: true; True, False
    repeatBtn: str, // default: false; true
    scrubSlider: str, // default: false; true, false
    volumeControl: str, //default: false; 
  }
  onVideoEnd: func, // default: none;
  onVideoStart: func, // default: none;
  onVideoPause; func, // default: none;
  onVideoPlay: func // default: none;
}*/

/*Global Vars*/
(function(){
  if (typeof window.wM == 'undefined'){
    window.wM = {}
  } 
  let wM = window.wM;
  let version = 1.2;
  if (document.getElementById('header')){
    wM.header = wM.header || {};
    wM.header.version = typeof wM.header.version == 'undefined' ? version : (wM.header.version < version ? version : wM.header.version);
    if (wM.header.version == version){
      initHeaderLogic();
    }
  }

  function initHeaderLogic(){
    /*let objTempate = {
      header: {
        headerElem: '#el',
        headerBottom: '0px',
        headerHeight: '100px',
        setHeaderCSS:function(){},
      },
      setHeaderCSS: func  // that Sets Height & Bottom Custom Vars,
      imageLoader: func // function that loads Images
      addCSSFileToHeader: func // adds CSS Files To Header
    }*/
    
    /*==== Methods ====*/
    /*Add CSS File to bottom of Head*/
    wM.addCSSFileToHeader = (url) => {
      let head = document.getElementsByTagName('head')[0],
          link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      head.appendChild(link);
    }
  }
}());

(function(){
  /*Video Element Constructor Function*/
  function VideoPlayer(video){
        let playPauseButton = video.querySelector('.play-pause-button'),
            videoElement = video.querySelector('video');
    video.playPause = function(){
      if (videoElement.paused) {
        videoElement.play(); 
        video.classList.add('playing');
        video.classList.remove('paused');
      } else {
        videoElement.pause();
        video.classList.add('paused');
        video.classList.remove('playing');
      }
    }
    playPauseButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      video.playPause();
    })
    video.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      video.playPause();
    })
  }
  function BuildVideoElement() {
    
  }

  /*Collect All Video Elements*/
  let allWmVideos = document.querySelectorAll('[data-wm-plugins="video-element"], [data-wm-plugins="video-element"]');
  
  allWmVideos.forEach(video => {
    let wMVideoElement = wMVideoElement || {

    }
    let playback = video.getAttribute('data-playback') || '1';
    video.classList.add('wm-video-element');
    let videoEl = document.createElement('video'),
        sourceEl = document.createElement('source'),
        playPauseEl = document.createElement('div');
    
    video.closest('.sqs-block').classList.add('wm-video-block')
    video.appendChild(videoEl);
    video.appendChild(playPauseEl);
    videoEl.appendChild(sourceEl);
    sourceEl.src = video.getAttribute('data-src');
    playPauseEl.title = 'Play / Pause Button';
    playPauseEl.classList.add('play-pause-button')
    
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.playbackRate = playback;
    videoEl.setAttribute('playsinline', '')
    
    video.classList.add('playing');
    
    let buildParams = {
      
    }
    new BuildVideoElement(el, buildParams)
    new VideoPlayer(video)
  })

  if (!document.querySelector('head link[href*="WMMicroVideo210316"]').length && allWmVideos.length !== 0){ wM.addCSSFileToHeader('https://assets.codepen.io/3198845/WMMicroVideo210316v1.0.0.css')
                                                                              }
}());
/* ==========
  Video Element 1.0.1
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
      volume: params.volumeOnLoad  || 0, 
      tapPause: params.tapPause || 'false',
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

        playBtn = el.querySelector('.play-btn'),
        pauseBtn = el.querySelector('.pause-btn'),
        replayBtn = el.querySelector('.replay-btn'),
        volumeBtn = volumeControl.querySelector('.volume-btn'),
        volumeInput = volumeControl.querySelector('input');
    video.togglePlay = () => {
      if (video.paused) {
        video.play(); 
        el.setAttribute('data-video-state', 'playing');
      } else {
        video.pause();
        el.setAttribute('data-video-state', 'paused');
      }
    }
    video.toggleVolume = () => {
      video.muted = !video.muted;
      video.volume = volumeInput.value / 100;
      video.setVolumeState();
    }
    video.playVideo = () =>{
      video.play(); 
      el.setAttribute('data-video-state', 'playing');
    }
    video.setVolumeState = () => {
      if (video.muted == true || video.volume == 0){
        el.setAttribute('data-video-mute', 'true')
      } else {
        el.setAttribute('data-video-mute', 'false')
      }
    }

    /*==== Functions & Vars ====*/
    playPauseControl.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      video.togglePlay();
    })
    replayControl.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      video.playVideo()
    });
    volumeBtn.addEventListener('click', function(){
      video.toggleVolume();
    })
    volumeInput.addEventListener('input', function(e){
      video.muted = false;
      video.volume = volumeInput.value / 100;
      video.checkIfMute();
    });
    function isElementInViewport (elem) {
      var rect = elem.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && 
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) 
      );
    }


    /*==== Init Vars ====*/
    /*Init Video as Paused*/
    video.playsInline = true;
    video.muted = true;
    video.setVolumeState();
    el.setAttribute('data-video-state', 'loaded');

    /*Touch Or Click Video Element to Play*/
    if (videoObj.tapPause == 'true') {
      el.addEventListener('click', function(e){
        if (!e.target.classList.contains('controls')) return;
        e.preventDefault();
        e.stopPropagation();
        video.togglePlay();
      }, false)
    }

    if (videoObj.autoPlay == 'true'){
      window.addEventListener('DOMContentLoaded', function(){
        if (isElementInViewport(el) && el.dataset["videoState"] == "loaded"){
          video.muted = true;
          video.playVideo();
          el.setAttribute('data-video-state', 'playing');
        }
      });
      window.addEventListener('scroll', function(){
        if (isElementInViewport(el) && el.dataset["videoState"] == "loaded"){
          video.muted = true;
          video.playVideo();
          el.setAttribute('data-video-state', 'playing');
        }
      })
    } else if (videoObj.autoPlay == 'onLoad') {
      setTimeout(function() {
        video.muted = true;
        video.playVideo();
        el.setAttribute('data-video-state', 'playing');
      }, 10);
    }


    /*Set Volume*/
    video.volume = videoObj.volume;
    volumeInput.value = videoObj.volume * 100;
    if (videoObj.volume > 0) {
      video.muted = false;
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
  }

  /*Build Video Element*/
  function VideoElement(el, params){
    let defaultPlaySVGStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"> <title>Play Video</title><path data-name="layer1" stroke-miterlimit="10" stroke-width="2" d="M6 2l52 30L6 62V2z" stroke-linejoin="round" stroke-linecap="round"></path></svg>',
        defaultPauseSVGStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Pause Button</title><path data-name="layer2" stroke-miterlimit="10" stroke-width="2" d="M13 4h12v56H13z" stroke-linejoin="round" stroke-linecap="round"></path><path data-name="layer1" stroke-miterlimit="10" stroke-width="2" d="M41 4h12v56H41z" stroke-linejoin="round" stroke-linecap="round"></path></svg>',
        defaultReplaySVGStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" aria-describedby="desc" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Replay</title><desc>Replay the Video</desc><path data-name="layer2" d="M53.832 34.947a26.016 26.016 0 1 0-7.45 15.432" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round"></path><path data-name="layer1" fill="none" stroke="#202020" stroke-miterlimit="10" stroke-width="2" d="M62 23l-8.168 11.947L43.014 25" stroke-linejoin="round" stroke-linecap="round"></path></svg>',
        defaultVolumeSVGStr = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title" role="img" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Volume Control</title><path data-name="layer2"  d="M40.2 21.8a12 12 0 0 1 0 20.5M46 16a20 20 0 0 1 0 32m5.7-37.7a28 28 0 0 1 .1 43.3" stroke-miterlimit="10"  stroke-linejoin="round" stroke-linecap="round" style="fill:none"></path><path data-name="layer1" d="M34 6L16 24H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12l18 18z" stroke-miterlimit="10"  stroke-linejoin="round" stroke-linecap="round"></path></svg>',
        videoObj = {
          source: params.source || 'url-of-how-to-edit.mp4', 
          style: params.style || 1
        };

    let player = document.createElement('div'),
        video = document.createElement('video'),
        source = document.createElement('source'),
        controls = document.createElement('controls'),

        playPauseControl = document.createElement('div'),
        volumeControl = document.createElement('div'),
        replayControl = document.createElement('div'),

        playBtn = document.createElement('button'),
        pauseBtn = document.createElement('button'),
        replayBtn = document.createElement('button'),
        volumeBtn = document.createElement('button'),
        volumeInput = document.createElement('input');

    /*Add Player El*/
    el.append(player);
    player.append(video);
    player.append(controls);

    /*Add Video El*/
    video.append(source);
    video.muted = true;
    source.src= videoObj.source;
    source.type = 'video/mp4';

    /*Add Controls El*/
    controls.append(playPauseControl);
    controls.append(replayControl);
    controls.append(volumeControl);

    /*Add Buttons El*/
    playPauseControl.append(playBtn);
    playPauseControl.append(pauseBtn);
    replayControl.append(replayBtn);
    volumeControl.append(volumeBtn);
    volumeControl.append(volumeInput);

    playBtn.innerHTML = defaultPlaySVGStr;
    pauseBtn.innerHTML = defaultPauseSVGStr;
    replayBtn.innerHTML = defaultReplaySVGStr;
    volumeBtn.innerHTML = defaultVolumeSVGStr;

    /*Adding Classes*/
    el.classList.add('wm-video-block', 'style-' + videoObj.style);
    player.classList.add('player');

    controls.classList.add('controls');
    playPauseControl.classList.add('play-pause-control');
    replayControl.classList.add('replay-control');
    volumeControl.classList.add('volume-control');

    playBtn.classList.add('play-btn');
    pauseBtn.classList.add('pause-btn');
    replayBtn.classList.add('replay-btn');
    volumeBtn.classList.add('volume-btn');

    volumeInput.id = 'vol-control';
    volumeInput.type = 'range';
    volumeInput.min = '0';
    volumeInput.max = '100';
    volumeInput.step = '1';

    function strToHtml(str) {
      console.log(new DOMParser().parseFromString(str, "text/xml").firstChild.html);
      return new DOMParser().parseFromString(str, "text/xml").firstChild.innerHTML;
    }
  }

  let vids = document.querySelectorAll('[data-wm-plugin="video"]');

  vids.forEach(vid => {
    let params = {
      source: vid.dataset.source || null,
      style: vid.dataset.style || 1,
      autoPlay: vid.dataset.autoPlay || null,
      loop: vid.dataset.loop || null,
      playbackRate: vid.dataset.playbackRate || null,
      volume: vid.dataset.volume || null,
      tapPause: vid.dataset.tapPause || null
    }
    let source = vid.dataset.source,
        style = vid.dataset.style,
        autoPlay = vid.dataset.autoPlay,
        loop = vid.dataset.loop,
        playbackRate = vid.dataset.playbackRate,
        volume = vid.dataset.volume,
        tapPause = vid.dataset.tapPause;

    new VideoElement(vid, params);
    new VideoPlayer(vid, params);
  })

  if (vids.length !== 0){
    addCSSFileToHeader('https://assets.codepen.io/3198845/WMMicroVideo210316v1.0.1.css');
    function addCSSFileToHeader(url) {
      let head = document.getElementsByTagName('head')[0],
          link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      head.appendChild(link);
    };
  }
}())
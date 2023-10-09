new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "I’m Good ",
          artist: "David Guetta ft. Bebe Rexha",
          cover: "music.gif",
          source: "I'm Good.mp3",
          url: "https://youtu.be/NN1f066QTMU?si=cgRM3P2M_c3CIrBR",
          favorited: false,
        },
        {
          name: "Best of Me",
          artist: "NEFFEX",
          cover: "music.gif",
          source: "Neffex.mp3",
          url: "https://youtu.be/R2Mna6rqF9g?si=arTa6ey84Fhu4dxK",
          favorited: true,
        },
        {
          name: "VALENTINO",
          artist: "24kGoldn",
          cover: "music.gif",
          source: "valentino.mp3",
          url: "https://youtu.be/bw3NGlkBT0w?si=AMfjbFCfuVEaVn5Z",
          favorited: false,
        },
        {
          name: "Moth to a Flame x After Hours",
          artist: "The Weeknd",
          cover: "music.gif",
          source: "the weekend.mp3",
          url: "https://youtu.be/tJscdStWRCo?si=6NceLK42d3YHRy5q",
          favorited: false,
        },
        {
          name: "Halo",
          artist: "Beyonce",
          cover: "music.gif",
          source: "halo.mp3",
          url: "https://youtu.be/bnVUHWCynig?si=qoJm9IESTjIMDNXx",
          favorited: true,
        },
        {
          name: "Courtesy Call",
          artist: "Thousand Foot Krutch",
          cover: "music.gif",
          source: "TFK.mp3",
          url: "https://youtu.be/EqcuP5KorfM?si=jhAR8xkUQ7KLhj-x",
          favorited: false,
        },
        {
          name: "Tonight",
          artist: "Big Bang",
          cover: "music.gif",
          source: "tonight.mp3",
          url: "https://youtu.be/dKlaN17FOvU?si=HPD-Vp9DYXGbWRTP",
          favorited: true,
        },
        {
          name: "Love Me Back",
          artist: "Trinidad Cardona",
          cover: "music.gif",
          source: "lovemeback.mp3",
          url: "https://youtu.be/bXUsb57dHU0?si=zrbhrTIakBah7Uf_",
          favorited: false,
        },
        {
          name: "Make Dem",
          artist: "JRND & VMK",
          cover: "music.gif",
          source: "make dem.mp3",
          url: "https://youtu.be/w9jrC_oJQNM?si=frrllC4NdQNqAb50",
          favorited: false,
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
    };
  },
  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited =
        !this.tracks[this.currentTrackIndex].favorited;
    },
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement("link");
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image";
      document.head.appendChild(link);
    }
  },
});

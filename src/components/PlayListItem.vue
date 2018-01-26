<template>
  <div class="playItem">
    <audio class="player" ref="player">
      <source :src="trackSrc" type="audio/wav">
    </audio>
    <div class="row mainRow">
      <div class="col s3 m3 playButtonContainer">
        <div class="playIt valign-wrapper playButton" @click="playOrPause()">
          <i class="material-icons center-align" v-show="!getState">play_arrow</i>
          <i class="material-icons center-align" v-show="getState">pause</i>
        </div>
      </div>
      <div class="col s4 m4 trackContent">
        <div class="row trackDetails">
          <h5 class="left-align noMarginTop">{{ trackSrc | generateTrackName }}</h5>
        </div>
        <div class="row noMarginTop">
          <h6 class="left-align noMarginTop">{{artist}}</h6>
        </div>
        <div class="row noMarginTop">
          <p class="left-align noMarginTop cyan-text bpm" @click="setOriginalBpm(true)">
            {{getLeaderBpm ? getLeaderBpm : getOriginalBpm}} BPM</p>
        </div>
      </div>
      <div class="col s5 m5 addons">
        <div class="row firstSettings">
          <div class="col s5 offset-m2 m3">
            <p class="barsAndTrash cyan-text">{{setBits}} BITS</p>
          </div>
          <div class="col offset-s2 s2 offset-m4 m1 offset-l4 l1">
            <i class="material-icons barsAndTrash trash" @click="removeFromList()">delete</i>
          </div>
        </div>
        <div class="row">
          <div class="col s2 offset-m3 m2 valign-wrapper"><i class="material-icons volIcon">volume_up</i></div>
          <div class="col s8 m6 valign-wrapper volumeBarContainer">
            <vue-slider ref="slider" v-model="volume" v-bind="optionsVolumeBar"
                        @drag-end="setVolume()"></vue-slider>
            {{volume}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

  import vueSlider from '../../node_modules/vue-slider-component'

  export default {
    props: ['trackId', 'trackName', 'artist', 'trackSrc', 'bpm', 'leaderBpm'],
    data() {
      return {
        playing: false,
        playerRolling: false,
        playAllRequest: false,
        duration: null,
        player: this.$refs.player,
        volume: 20,
        bits: 0,
        showLeaderBpm: true,
        loopOrNot: false,
        optionsVolumeBar: {
          eventType: 'auto',
          width: '100%',
          height: 6,
          dotSize: 16,
          min: 0,
          max: 100,
          interval: 1,
          show: true,
          speed: 0.5,
          disabled: false,
          tooltip: false,
          tooltipDir: 'top',
          clickable: true,
          realTime: false,
          lazy: false
        }
      }
    },
    computed: {
      /* play or pause button */
      getState() {
        return this.playing;
      },

      /* calculate track's bits */
      setBits() {
        let bits = this.duration / 60
        return Math.round(bits * this.$props.bpm)
      },

      /* using computed to avoid mutating parent */
      getOriginalBpm() {
        return this.$props.bpm
      },

      /* using computed to avoid mutating parent */
      getLeaderBpm() {
        if (this.showLeaderBpm)
          return this.$props.leaderBpm
        else
          return undefined
      }
    },
    methods: {
      /* play or pause the track with loops or not, with loops condition called from parent */
      playOrPause(loopOrNot) {
        this.playing = !this.playing
        this.play(this.playing, loopOrNot);
      },

      /* play or pause, set loop if required */
      play(playOrPause, loopOrNot = false) {
        if (playOrPause)
          this.$refs.player.play();
        else
          this.$refs.player.pause();

        this.loopOrNot = loopOrNot
        this.$refs.player.loop = loopOrNot;
      },

      /* set track volume */
      setVolume() {
        this.$refs.player.volume = this.volume / 100
      },

      /* remove track from play list */
      removeFromList() {
        this.$emit('removeFromList', this.$props.trackId)
      },

      /* back to original bpm on click */
      setOriginalBpm() {
        this.showLeaderBpm = !this.showLeaderBpm
      },

      /* set start position */
      setStartPosition() {
        this.$refs.player.currentTime = 0;
      }
    },
    mounted() {
      let self = this

      /* if play after another required, currently disabled feature */
      this.$el.children[0].onended = function (e) {
        //currently disabled - not necessary
        //this.playAllRequest ? self.$emit('playNextTrack') : ''

        //set the play button back to normal
        if (!self.loopOrNot)
          self.playing = !self.playing;
      }

      /* get tracks duration after track loaded */
      this.$el.children[0].addEventListener('loadedmetadata', function () {
        self.duration = this.duration;
        self.$emit('getDuration')
      });

      /* init the volume */
      this.$refs.player.volume = 0.2
    },
    components: {
      vueSlider
    }
  }
</script>


<style scoped>

  .playButton {
    border-radius: 50%;
    border: 1px solid #26c6da;
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    cursor: pointer;
  }

  .playItem {
    background: #4a473c;
    color: orange;
    margin: 0px;
  }

  .volumeBarContainer {
    margin-top: 0px;
    display: flex;
    justify-content: right;
  }

  .volumeBar {
    margin: 0px;
  }

  .playButtonContainer {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .mainRow {
    margin: 5px 0px;
  }

  /*.trackContent {*/
  /*padding-top: 22px;*/
  /*}*/

  .firstSettings {
    margin-bottom: 0px;
  }

  /*.addons {*/
  /*border: 1px solid blue;*/
  /*}*/

  .noMarginTop {
    margin-top: 0px;
    margin-bottom: 0px;
  }

  /*.barsAndTrash {*/
  /*margin-top: 4px;*/
  /*}*/

  /*.barsAndTrash {*/
  /*padding-top: 22px;*/
  /*}*/

  .trackDetails {
    margin-top: 10px;
  }

  .trash {
    padding-top: 19px;
    cursor: pointer;
  }

  .bpm {
    cursor: pointer;
  }

</style>

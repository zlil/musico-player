<template>
  <div class="container">
    <div class="row">
      <h5>Musico Player</h5>
      <div class="row">
        <a class="waves-effect waves-light btn orange lighten-2 z-depth-2" @click="playSync()">SYNC</a>
        <a class="waves-effect waves-light btn orange lighten-2 z-depth-2" @click="playAll()"><span
          v-show="!playingAllOrStop">PLAY ALL</span><i
          class="material-icons center-align" v-show="playingAllOrStop">stop</i></a>
      </div>
      <div class="row">
        <select class="tracksSelection" v-model="trackToAdd" v-on:change="addTrack()">
          <option value="" disabled selected="true">Tap To Choose...</option>
          <option v-for="(item, key) in tracks" v-bind:value="[tracks[key]]" :key="key" @click.native="addTrack(item)">
            {{item.owner}} - {{item.url | generateTrackName }}
          </option>
        </select>
      </div>
      <div class="row">
        <ul id="playList" class="z-depth-5">
          <transition-group
            name="loginAnimation"
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut zoomOutPushToTop"
            mode="out-in"
          >
            <li v-for="(item, key) in tracks" :key="key" v-show="item.show">
              <PlayItem :trackId="item.Id" :trackSrc="item.url" :artist="item.owner" :bpm="item.bpm" :leaderBpm="item.leaderBpm"
                        ref="track"
                        @playNextTrack="goNext()" @getDuration="getDuration(item.Id)"
                        @removeFromList="removeFromList(item.Id)"></PlayItem>
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

  import PlayItem from './PlayListItem.vue';

  export default {

    data() {
      return {
        tracks:
          [{
          "Id": 1,
          "url": "https://s3.amazonaws.com/candidate-task/Track+1.mp3",
          "owner": "Ori Winokur",
          "bpm": 120,
          "show": true,
          "duration": null
        }, {
          "Id": 2,
          "url": "https://s3.amazonaws.com/candidate-task/Track+2.mp3",
          "owner": "Yonatan Pistiner",
          "bpm": 100,
          "show": true,
          "duration": null
        }, {
          "Id": 3,
          "url": "https://s3.amazonaws.com/candidate-task/Track+3.mp3",
          "owner": "Barak Inbar",
          "bpm": 123,
          "show": true,
          "duration": null
        }, {
          "Id": 4,
          "url": "https://s3.amazonaws.com/candidate-task/Track+4.mp3",
          "owner": "Ori Winokur",
          "bpm": 80,
          "show": true,
          "duration": null
        }, {
          "Id": 5,
          "url": "https://s3.amazonaws.com/candidate-task/Track+5",
          "owner": "Yonatan Pistiner",
          "bpm": 80,
          "show": true,
          "duration": null
        }, {
          "Id": 6,
          "url": "https://s3.amazonaws.com/candidate-task/Track+6",
          "owner": "Barak Inbar",
          "bpm": 90,
          "show": true,
          "duration": null
        }],
        currentPlaying: null,
        playingAll: false,
        trackToAdd: '',
        leaderProgress: null,
      }
    },
    methods: {
      /* play all track with loops */
      playAll(sync=false) {
        this.playingAll = !this.playingAll
        for (let track of this.$refs.track) {
          //reset progress
          if(!sync)
            track.setStartPosition();

          //play & send loop flag
          track.playOrPause(true)
        }
      },
      removeFromList(trackId) {
        this.tracks.find((track) => {
          if (track.Id == trackId) {
            track.show = false
            return true
          }
        })
      },
      /** this method currently disabled (!)
       already wrote this functionality even though it's not necessary i just left it for now -
       if single track is played and we hit another track the first one is paused.
       add this: @click.native="isPlaying(item.Id)" to <PlayItem/> component
       */
      isPlaying(trackId) {
        let prev = this.currentPlaying;
        this.currentPlaying = trackId;
        if (prev == this.currentPlaying) {
          this.$refs.track[prev - 1].playOrPause();
          prev = false
          this.currentPlaying = false
        } else if (prev) {
          this.$refs.track[prev - 1].playOrPause();
          this.$refs.track[this.currentPlaying - 1].playOrPause();
        } else {
          this.$refs.track[this.currentPlaying - 1].playOrPause();
        }
      },
      async playSync () {
        this.$refs.track.forEach((song) => {

          if(song.playing){
            song.playOrPause()
          }
        })
        let songs = this.sortedTracks();
        //this.changeBpm();
        this.playingAll = !this.playingAll
        $(document).ready(() => {

          let leader = songs[0];
          var leaderProgress = this.getProgress(leader.Id, leader.duration)

          this.$refs.track.forEach(song => {
            let keepState = false
            if(song.trackId == leader.Id)
               keepState = true

            song.setProgress(leaderProgress, keepState)
            keepState = false

          })
          //this.playAll(true)

        })
      },
//      playSync () {
//        this.sortedTracks()
//        this.changeBpm()
//        this.syncedTracks = true
//        for (let track of this.$refs.track) {
//          track.setProgress(this.leaderProgress)
//          track.setSyncedMode(true)
//        }
//        //this.playAll(true)
//      },
      changeBpm () {
        let leader = this.tracks[0];
        this.leaderProgress = this.getProgress(leader.Id, leader.duration)
        this.tracks = this.tracks.map((track) => {
          if(track !== leader) {
            track.leaderBpm = leader.bpm
          }
          return track
        })
      },
      /* sort the tracks by duration length */
      sortedTracks() {
        return this.tracks.sort((s1, s2) => {
          return s1.duration - s2.duration
        }).reverse()
      },
      getDuration(trackId) {
        /* get the item from the playlist by emitting an event (@getDuration) in the child component */
        let trackToSearch = this.$refs.track.filter((track) => {
          return track.trackId == trackId
        })[0];

        /* copy tracks for new object since computed property
        listen to the original tracks object and sort the object every
        call from the event says that duration is available.
        map the object by track id and add duration */
        let tracksToSet = [...this.tracks];
        this.tracks = tracksToSet.map((track) => {
          if (track.Id == trackToSearch.trackId) {
            track.duration = trackToSearch.duration
          }
          return track
        });
      },
      /* get leader's progress */
      getProgress(id, duration) {
        let self = this;
        let leader = document.getElementsByClassName('player'+id)[0];
        let currentTime = leader.currentTime
        if(currentTime == 0)
          return 0


        console.log('leader current time '+ currentTime)
        console.log('leader duration '+ duration)
        console.log(`leader progress by %: ${Math.fround(currentTime / duration)}`)
        return Math.fround(currentTime / duration)
      },
      addTrack () {
        let track = this.getTrackToAdd;
        track.Id = this.tracks.length + 1;
        this.tracks.push(track)
      }
    },
    computed: {
      /* switch between PlayAll and stop button */
      playingAllOrStop() {
        return this.playingAll
      },

      /* copy object and add track */
      getTrackToAdd() {
        return {...this.trackToAdd[0]}
      },

      getRefs() {
        return this.$refs.track
      }
    },
    components: {
      PlayItem
    },
  }

</script>

<style scoped>

  #playList {
    background: #3f3d34;
    border: 1px solid black;
    border-radius: 4px;
  }

  .hr {
    background-color: #212121;
    height: 6.5px;
    border: 0;
  }

  .tracksSelection {
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: none;
    border: 1px solid #9e9e9e;
    outline: none;
    height: 3rem;
    line-height: 3rem;
    width: 100%;
    font-size: 1rem;
    margin: 0 0 20px 0;
    padding: 0;
    display: block;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .loginAnimation-move{ transition: transform 0.7s; }
  .zoomOutPushToTop{ position: absolute; }
  .forgetPassword-move{ transition: transform 0.7s; }

</style>


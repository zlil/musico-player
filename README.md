# musico

> Musico Player - A Vue.js project

## Explanation

*	Support play/pause
*	Support play all / Stop all
*	Support remove a single track from the looper
*	Support add track from list (dropdown list)
*	If play all is selected, tracks must loop. Otherwise it should run only once
*	“Stop all” should reset the tracks (i.e. seek to the start of the tracks).
*	On play all - all tracks sync to the start at the same time
*	Support Sync - this is just a UI sync, you are not expected to actually change the track’s bpm.
*	Calculate the track Bars(Bits) Number  - (put next to the trash icon)
*	Calculate the track BPM and put it under the track name.
*	Show the file name from the url


## Functionality

  Click on play all:
    *	Play all button become stop
    *	Tracks start playing
    *	Track play icon become PAUSE
    *	Tracks loop (i.e. starts again when they have finished playing)
 	Click on single track play:
    *	Rest of tracks are not effected
    *	Play all stays play all
    *	The selected single tracks play button becomes pause
    *	Track plays - Doesn’t loop
 	Clicking on sync:
    *	Calculate the leader track bpm  (leader is the longest track)
    *	Sync all tracks to the leader track
    *	Reorder the tracks according to the track length
    *	Change BPM to new BPM
    *	Show original BPM (on click on original bpm change the bpm to the original bpm)
    *	Play all

## Todos
   * Testing
   * Circular progress bar over the play icon

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


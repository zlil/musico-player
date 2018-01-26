import Vue from 'vue'

Vue.filter("generateTrackName", (value) => {
  if (!value) return ''

  let suffixSubString = value.indexOf(".mp3");
  if (suffixSubString == -1)
    return value.substring(value.lastIndexOf("/") + 1).replace("+", " ");
  else
    return value.substring(value.lastIndexOf("/") + 1, suffixSubString).replace("+", " ");

})

/*
 *  CSV Schema for the upload files
 *  key: db column name
 *  val: csv column name
 */

export default {
  def: {
    song: {
      name: 'Song',
      type: 'STRING',
      required: true,
    },
    artist: {
      name: 'Artist',
      type: 'STRING',
      required: true,
    },
    writer: {
      name: 'Writer',
      type: 'STRING',
      required: true,
    },
    album: {
      name: 'Album',
      type: 'STRING',
      required: true,
    },
    year: {
      name: 'Year',
      type: 'STRING',
      required: true,
    },
    playsJune: {
      name: 'Plays - June',
      type: 'STRING',
      required: true,
    },
    playsJuly: {
      name: 'Plays - July',
      type: 'STRING',
      required: true,
    },
    playsAugust: {
      name: 'Plays - August',
      type: 'STRING',
      required: true,
    },
  },
};

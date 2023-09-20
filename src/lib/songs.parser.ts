import CsvParser from '../utils/csvParser';
import songsSchema from '../csvSchema/songs.schema';
import removeSpecialCharacters from '../utils/removeSpecialCharacters';
import convertToYearMonth from '../utils/convertToYearMonth';
import { SONGS } from '../enums';

class SongsParser {
  static parse = async (file: any) => {
    const { buffer: fileBuffer } = file;

    const { rows } = await CsvParser.parse(fileBuffer, songsSchema.def, {
      parsedBy: 'NAME',
    });

    const records = [];

    for (const song of rows) {
      // process artist and writers
      const SPLIT_PARAMS = /\n| and |and /i;
      const CHECK_FEATURE = /featuring|\(feature\)/i;

      const omitEmptyNamesInObject = (name: { name: string }) =>
        name.name !== '';
      const omitEmptyNames = (name: string) => name !== '';

      const artists = song.artist
        .split(SPLIT_PARAMS)
        .map((artist: string) => ({
          name: removeSpecialCharacters(artist),
          isFeatured: CHECK_FEATURE.test(artist),
        }))
        .filter(omitEmptyNamesInObject);
      const writers = song.writer
        .split(SPLIT_PARAMS)
        .map((artist: string) => removeSpecialCharacters(artist))
        .filter(omitEmptyNames);

      // process album names
      const REPLACE_LINE_BREAKS = /\n/i;
      const album = removeSpecialCharacters(song.album).replace(
        REPLACE_LINE_BREAKS,
        ' '
      );

      // process song type, live
      const getSongTypeAndCover = (songName: string) => {
        let type = SONGS.type.ORIGINAL;
        let live = false;

        const CHECK_COVER = /cover|\(cover\)/i;
        const CHECK_LIVE = /live|\(live\)/i;

        if (CHECK_COVER.test(songName)) {
          type = SONGS.type.COVER;
        }
        if (CHECK_LIVE.test(songName)) {
          live = true;
        }

        return [type, live];
      };
      const [type, live] = getSongTypeAndCover(song.song);

      // process plays data
      const plays = [
        {
          month: convertToYearMonth('playsJune'),
          playCount: Number(song.playsJune),
        },
        {
          month: convertToYearMonth('playsJuly'),
          playCount: Number(song.playsJuly),
        },
        {
          month: convertToYearMonth('playsAugust'),
          playCount: Number(song.playsAugust),
        },
      ];

      // return parsed data
      const data = [
        {
          ...song,
          plays,
          album,
          artists,
          writers,
          type,
          live,
        },
      ];

      records.push(...data);
    }
    return { records };
  };
}

export default SongsParser;

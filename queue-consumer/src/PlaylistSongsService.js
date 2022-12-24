const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistsongById(id) {
    const query = {
      text: `SELECT playlistsongs.*, songs.title, songs.performer FROM playlistsongs LEFT JOIN songs ON songs.id = playlistsongs.song_id 
      WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    const queryPlylist = {
      text: `
      select p.id,p."name" ,u.username  from users u 
      join playlists p on u.id =p."owner"
      where p.id= $1`,
      values: [id],
    };
    const resultPlaylist = await this._pool.query(queryPlylist);
    return {
      playlist: {
        id: resultPlaylist.rows?.[0]?.id,
        name: resultPlaylist.rows?.[0]?.name,
        songs: result.rows.map((item) => ({
          id: item.id,
          title: item.title,
          performer: item.performer,
        })),
      },
    };
  }
}

module.exports = PlaylistSongsService;

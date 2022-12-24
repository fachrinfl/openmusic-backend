class Listener {
  constructor(mailSender, serviceSong) {
    this._mailSender = mailSender;
    this._serviceSong = serviceSong;
    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { playlistId, targetEmail } = JSON.parse(message.content.toString());
      const playlistsongs = await this._serviceSong.getPlaylistsongById(playlistId);
      await this._mailSender.sendEmail(targetEmail, JSON.stringify(playlistsongs));
    } catch (error) {
      console.error('[LISTEN]', error);
    }
  }
}

module.exports = Listener;

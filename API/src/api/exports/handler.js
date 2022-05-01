class ExportHandler {
  constructor(producersService, playlistsService, validator) {
    this._producersService = producersService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportSongsHandler = this.postExportSongsHandler.bind(this);
  }

  async postExportSongsHandler(request, h) {
    this._validator.validateExportSongsPayload(request.payload);
    const { playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const message = {
      playlistId,
      credentialId,
      targetEmail: request.payload.targetEmail,
    };

    await this._producersService.sendMessage('export:songs', JSON.stringify(message));
    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;

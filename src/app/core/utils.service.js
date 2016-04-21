(function () {
	'use strict';

	angular
		.module('metaidApp')
		.factory('UtilsService', UtilsService);

	UtilsService.$inject = [
    'ACCEPTED_FORMAT_UPLOADS',
    'ACCEPTED_AUDIO_FORMAT_UPLOADS',
    'ACCEPTED_IMAGE_FORMAT_UPLOADS',
    'ACCEPTED_VIDEO_FORMAT_UPLOADS'
  ];

  function UtilsService(ACCEPTED_FORMAT_UPLOADS, ACCEPTED_AUDIO_FORMAT_UPLOADS,
                        ACCEPTED_IMAGE_FORMAT_UPLOADS, ACCEPTED_VIDEO_FORMAT_UPLOADS) {
		return {
			accept_files: accept_files,
      accept_audio_files: accept_audio_files,
      accept_image_files: accept_image_files,
      accept_video_files: accept_video_files
		};

		function accept_files () {
			return ACCEPTED_FORMAT_UPLOADS.join(',');
		}

    function accept_audio_files() {
      return ACCEPTED_AUDIO_FORMAT_UPLOADS.join(',');
    }

    function accept_image_files() {
      return ACCEPTED_IMAGE_FORMAT_UPLOADS.join(',');
    }

    function accept_video_files() {
      return ACCEPTED_VIDEO_FORMAT_UPLOADS.join(',');
    }
	}
}());

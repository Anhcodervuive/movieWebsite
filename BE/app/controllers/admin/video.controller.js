const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const videoService = require('../../services/video.service');
const ApiError = require('../../api-error');

const VIDEO_UPLOADS_PATH = path.resolve(__dirname, '../../../uploads/ads/');
const BE_PATH = path.resolve(__dirname, '../../../');

class VideoController {
    constructor(videoService) {
        this.videoService = videoService;
    }

    getAll = async (req, res, next) => {
        try {
            const videos = await this.videoService.getAll({
                limit: 50,
                order: [['created_at', 'DESC']],
            });
            return res.json({ videos });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const video = await this.videoService.getById(id);
            return res.json({ video });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    create = async (req, res, next) => {
        try {
            if (!req.file)
                return res.status(400).json({ message: 'No file uploaded' });

            const inputPath = req.file.path;
            const videoUrl = `\\uploads\\ads\\${
                req.file.filename.split('.')[0]
            }\\index.m3u8`;
            const outputFolder = `${VIDEO_UPLOADS_PATH}\\${
                req.file.filename.split('.')[0]
            }`;
            const outputM3U8 = `${outputFolder}\\index.m3u8`;

            console.log(inputPath, outputFolder, outputM3U8);

            // Tạo thư mục output nếu chưa có
            if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

            if (fs.existsSync(outputFolder)) {
                const ffmpeg = spawn('ffmpeg', [
                    '-i',
                    inputPath,
                    '-preset',
                    'veryfast',
                    '-g',
                    '48',
                    '-sc_threshold',
                    '0',
                    '-map',
                    '0:v:0',
                    '-map',
                    '0:a:0',
                    '-c:v',
                    'h264',
                    '-b:v',
                    '1000k',
                    '-c:a',
                    'aac',
                    '-b:a',
                    '128k',
                    '-f',
                    'hls',
                    '-hls_time',
                    '4',
                    '-hls_list_size',
                    '0',
                    '-hls_segment_filename',
                    `${outputFolder}/seg_%03d.ts`,
                    outputM3U8,
                ]);

                ffmpeg.stdout.on('data', (data) =>
                    console.log(`FFmpeg Output: ${data}`)
                );
                ffmpeg.stderr.on('data', (data) =>
                    console.error(`FFmpeg Error: ${data}`)
                );

                ffmpeg.on('close', async (code) => {
                    if (code === 0) {
                        fs.unlinkSync(inputPath);
                        try {
                            const { type, name } = req.body;
                            await this.videoService.create({
                                url: videoUrl,
                                type,
                                name,
                            });
                            return res.json({
                                type: 'success',
                                message: 'Conversion successful',
                                playlistUrl: `/hls/${
                                    req.file.filename.split('.')[0]
                                }/index.m3u8`,
                            });
                        } catch (error) {
                            return next(new ApiError(500, error.message));
                        }
                    } else {
                        return res.status(500).json({
                            message: 'FFmpeg failed',
                            error: `Exit code ${code}`,
                        });
                    }
                });
            }
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    update = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { slug } = req.body;

            const video = await this.videoService.findBySlug(slug);
            console.log(video, id);

            if (video && video?.id != id) {
                return res.status(400).json({
                    type: 'error',
                    message: 'Slug đã được sử dụng',
                });
            }

            await this.videoService.update(id, req.body);
            return res.json({
                type: 'success',
                message: 'Cập nhật đạo diễn thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            const video = await this.videoService.getById(id);
            const outputFolder = `${BE_PATH}${video.url}`.replaceAll(
                'index.m3u8',
                ''
            );

            console.log(outputFolder);
            fs.rmSync(outputFolder, { force: true, recursive: true });

            await this.videoService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa video thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new VideoController(videoService);

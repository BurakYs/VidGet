import ScraperError from '@/utils/classes/ScraperError';
import { createWriteStream } from 'fs';
import puppeteer from 'puppeteer';
import applyPuppeteerInterception from '@/utils/applyPuppeteerInterception';
import fs from 'fs/promises';
import axios from 'axios';
import app from '@/config/app';

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

export default class TikTokScraper {
    static async scrape(postUrl: string) {
        const url = new URL(postUrl);
        if (url.hostname === 'vm.tiktok.com') {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            await applyPuppeteerInterception(page);

            await page.goto(postUrl);
            const finalUrl = page.url();
            await browser.close();

            const id = finalUrl.split('/')[5].split('?')[0];

            return await this.scrapePost(id);
        }

        const id = postUrl.split('/')[5].split('?')[0];
        return await this.scrapePost(id);
    }

    static async scrapePost(id: string) {
        const videoFullData = await axios.options(`https://api22-normal-c-alisg.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`, {
            headers: {
                'User-Agent': userAgent
            }
        });

        if (!videoFullData.status.toString().startsWith('2'))
            throw new ScraperError('Failed to fetch video data');

        const videoData = videoFullData.data.aweme_list.find((video: any) => video.aweme_id === id);
        if (!videoData)
            throw new ScraperError('Video not found');

        const { video, author, music, statistics } = videoData;

        const musicPlay = await this.downloadAsset(music.play_url.url_list.at(-1), `${music.id}.mp3`);

        const additionalData: Record<string, any> = {};
        if (!videoData.image_post_info) {
            const [withoutWatermark, withWatermark] = await Promise.all([
                this.downloadAsset(video.playAddr, `${videoData.id}.mp4`),
                this.downloadAsset(video.downloadAddr, `${videoData.id}_watermark.mp4`)
            ]);

            additionalData.video = {
                height: video.height,
                width: video.width,
                duration: video.duration,
                cover: video.cover.url_list.at(-1),
                withoutWatermark,
                withWatermark
            };
        } else {
            const slideshows = videoData.image_post_info.images.map((image: any) => image.display_image.url_list.at(-1));
            const images = await Promise.all(slideshows.map((image: string, index: number) => this.downloadAsset(image, `${videoData.aweme_id}_${index}.png`)));

            additionalData.slideshow = {
                images
            };
        }

        return {
            type: additionalData.video ? 'video' : 'slideshow',
            ...additionalData,
            post: {
                id: videoData.aweme_id,
                description: videoData.desc?.trim(),
                createdAt: new Date(videoData.create_time * 1000).getTime()
            },
            author: {
                id: author.uid,
                username: author.unique_id,
                nickname: author.nickname,
                avatar: author.avatar_larger.url_list.at(-1)
            },
            music: {
                id: music.id_str,
                title: music.title,
                author: music.authorName,
                cover: music.cover_large.url_list.at(-1),
                duration: music.duration,
                playUrl: musicPlay
            },
            stats: {
                likes: Number(statistics.digg_count),
                shares: Number(statistics.share_count),
                comments: Number(statistics.comment_count),
                plays: Number(statistics.play_count),
                favorites: Number(statistics.collect_count),
                reposts: Number(statistics.repost_count)
            }
        };
    }

    static async downloadAsset(url: string, name: string) {
        const doesFileExist = await fs.stat(`./public/tiktok/${name}`).catch(() => null);
        if (doesFileExist)
            return app.rootUrl + `/assets/tiktok/${name}`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': userAgent
                },
                responseType: 'stream'
            });

            const writer = createWriteStream(`./public/tiktok/${name}`);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(app.rootUrl + `/assets/tiktok/${name}`));
                writer.on('error', reject);
            });
        } catch {
            return null;
        }
    }
}
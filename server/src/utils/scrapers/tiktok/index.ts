import ScraperError from '@/utils/classes/ScraperError';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import applyPuppeteerInterception from '@/utils/applyPuppeteerInterception';
import app from '@/config/app';

export default class TikTokScraper {
    maxRequests = 50;
    requestCount = 0;
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Referer: 'https://www.tiktok.com/',
        'sec-ch-ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24',
        'sec-ch-ua-platform': 'Windows',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'video'
    };

    async scrapeVideo(url: string) {
        const browser = await this.launchPuppeteer(url);
        const html = await this.fetchVideoHtml(browser, url);
        const parsedData = this.parseVideoData(html);
        const videoInfo = await this.getVideoInfo(browser, parsedData);

        return videoInfo;
    }

    async launchPuppeteer(url: string) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await applyPuppeteerInterception(page);

        await page.goto(url);

        return browser;
    }

    async fetchVideoHtml(browser: Browser, url: string) {
        const page = await browser.newPage();
        await page.goto(url);
        const html = await page.content();

        const finalUrl = page.url();
        if (!finalUrl.includes('/video/')) {
            throw new ScraperError('We only support video URLs at the moment');
        }

        await page.close();

        return html;
    }

    parseVideoData(html: string) {
        const $ = cheerio.load(html);
        const script = $('script#__UNIVERSAL_DATA_FOR_REHYDRATION__');
        if (!script.length) {
            throw new ScraperError('Failed to fetch video data');
        }

        try {
            const data = JSON.parse(script.html()!);
            return data['__DEFAULT_SCOPE__'];
        } catch {
            throw new ScraperError('Failed to fetch video data');
        }
    }

    async downloadAsset(browser: Browser, url: string, name: string) {
        const doesFileExist = await fs.stat(`./public/tiktok/${name}`).catch(() => null);
        if (doesFileExist) {
            return app.rootUrl + `/assets/tiktok/${name}`;
        }

        const page = await browser.newPage();
        await page.goto(url);

        const $ = cheerio.load(await page.content());
        const asset = $('video source').attr('src');
        if (!asset) {
            throw new ScraperError('Failed to download asset');
        }

        const cookies = (await page.cookies()).map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
        try {
            const response = await axios.get(asset, {
                headers: {
                    ...this.headers,
                    Cookie: cookies
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getVideoInfo(browser: Browser, parsedData: Record<string, any>) {
        const videoData = parsedData['webapp.video-detail'].itemInfo.itemStruct;
        const { video, author, music, statsV2: stats } = videoData;

        const [withoutWatermark, withWatermark, musicPlay] = await Promise.all([
            this.downloadAsset(browser, video.playAddr, `${videoData.id}.mp4`),
            this.downloadAsset(browser, video.downloadAddr, `${videoData.id}_watermark.mp4`),
            this.downloadAsset(browser, music.playUrl, `${music.id}.mp3`)
        ]);

        return {
            video: {
                id: videoData.id,
                description: videoData.desc?.trim(),
                createdAt: new Date(videoData.createTime * 1000).getTime(),
                height: video.height,
                width: video.width,
                duration: video.duration,
                ratio: video.ratio,
                quality: video.videoQuality,
                format: video.format,
                cover: video.cover,
                withoutWatermark,
                withWatermark
            },
            author: {
                id: author.id,
                username: author.uniqueId,
                nickname: author.nickname,
                avatar: author.avatarLarger
            },
            music: {
                id: music.id,
                title: music.title,
                cover: music.coverLarge,
                author: music.authorName,
                original: music.original,
                duration: music.duration,
                playUrl: musicPlay
            },
            stats: {
                likes: Number(stats.diggCount),
                shares: Number(stats.shareCount),
                comments: Number(stats.commentCount),
                plays: Number(stats.playCount),
                favorites: Number(stats.collectCount),
                reposts: Number(stats.repostCount)
            }
        };
    }
}
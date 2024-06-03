import ScraperError from '@/utils/classes/ScraperError';
import axios from 'axios';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import app from '@/config/app';

class TikTokScraper {
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Cookie: '',
        Referer: 'https://www.tiktok.com/',
        'sec-ch-ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24',
        'sec-ch-ua-platform': 'Windows',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'video'
    };

    constructor() {
        const url = 'https://www.tiktok.com';
        this.launchPuppeteer(url).then(() =>
            setInterval(async () => {
                await this.launchPuppeteer(url);
            }, 120_000)
        );
    }

    async scrapeVideo(url: string) {
        const html = await this.fetchVideoHtml(url);
        const parsedData = this.parseVideoData(html);
        const videoInfo = await this.getVideoInfo(parsedData);

        return videoInfo;
    }

    async launchPuppeteer(url: string) {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setRequestInterception(true);

        page.on('request', (req) => {
            if (req.resourceType() === 'image' || req.resourceType() === 'stylesheet') {
                req.abort();
            } else {
                req.continue();
            }
        });

        await page.goto(url);

        const cookies = await page.cookies();
        this.headers.Cookie = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

        await browser.close();
    }

    async fetchVideoHtml(url: string) {
        const { hostname } = new URL(url);
        if (!hostname.endsWith('tiktok.com')) {
            throw new ScraperError('Invalid TikTok URL');
        }

        const response = await axios.get(url, { headers: this.headers });
        if (response.status !== 200) {
            throw new ScraperError('Failed to fetch video');
        }

        const finalUrl = response.request.res.responseUrl;
        if (!finalUrl.includes('/video/')) {
            throw new ScraperError('We only support video URLs at the moment');
        }

        return response.data;
    }

    parseVideoData(html: string) {
        const $ = cheerio.load(html);
        const script = $('script#__UNIVERSAL_DATA_FOR_REHYDRATION__');
        if (!script.length) {
            throw new ScraperError('Failed to parse video');
        }

        try {
            const data = JSON.parse(script.html()!);
            return data['__DEFAULT_SCOPE__'];
        } catch {
            throw new ScraperError('Failed to parse video');
        }
    }

    async downloadAsset(url: string, name: string) {
        const data = await axios.get(url, { responseType: 'arraybuffer', headers: this.headers });
        const isSuccessful = data.status.toString().startsWith('2');
        if (!isSuccessful) return null;

        await fs.writeFile(`./public/tiktok/${name}`, data.data);
        return app.rootUrl + `/assets/tiktok/${name}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getVideoInfo(parsedData: Record<string, any>) {
        const videoData = parsedData['webapp.video-detail'].itemInfo.itemStruct;
        const { video, author, music, statsV2: stats } = videoData;

        return {
            video: {
                id: videoData.id,
                description: videoData.desc,
                createdAt: new Date(videoData.createTime * 1000).getTime(),
                height: video.height,
                width: video.width,
                duration: video.duration,
                ratio: video.ratio,
                quality: video.videoQuality,
                format: video.format,
                cover: video.cover,
                withoutWatermark: await this.downloadAsset(video.playAddr, `${videoData.id}.mp4`),
                withWatermark: await this.downloadAsset(video.downloadAddr, `${videoData.id}_watermark.mp4`)
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
                playUrl: await this.downloadAsset(music.playUrl, `${music.id}.mp3`)
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

export default new TikTokScraper();
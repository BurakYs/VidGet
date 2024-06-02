import ScraperError from '@/utils/classes/ScraperError';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import app from '@/config/app';

class TikTokScraper {
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Cookie: 'tt_csrf_token=iR4HdMag-sqrQudAKcMdVcu-hE_Som0sEtTY; tt_chain_token=TLNfQ4Cl54/wyyV+iZyBmQ==; ak_bmsc=DAA620659EDDAD07D53FB614478098A7~000000000000000000000000000000~YAAQqHkmF0m0P9WPAQAAYqce2hcS/4nJTCQZXUD85S2eaiCY9GS9kxp6iwkij4YYwkulj7P3EUGpafp9pGNpVY402plGl/9Ca8jGo8QGUwA4TMxJ39+u7L9941xRjMTSfAtUOP0W7Hq1+DdxI3LvShw82+MdB5VySIpgaX/S2WCeX5Y3pmT+9FKxB9aiGTKxGniuWDQQNz4LSFBWcdDpAGBU/Wiu2HhdJpZdwxmT0DRqeapsp6MQHayURWB1o8o/GrKVazC5/2cNrf30ZOdypadE2Wq3sf//mJWpLI2HJXtYzm9lr33o6T2/EzesXKdVe6NdOlQtfgrP+9twNvcUB3o5l6HQ5TFT2osp3bcWaaOkXbJq+54U16ZlLacCT0D1X69y+423y588so3N; tiktok_webapp_theme=light; ttwid=1%7CiWB6yxTsOzyupC4YtRDiXV1mvPmY1WupdjW1Hz5IBd0%7C1717351399%7Cd4ddef91a44579d1583ed07a4884848f248d578a3f4f3675accf29021fb5033c; perf_feed_cache={%22expireTimestamp%22:1717524000000%2C%22itemIds%22:[%227367386752203361542%22%2C%227363348538316573958%22%2C%227351093579118415109%22]}; msToken=5LANh6VsLNs1fV9565GDMy4MAcV8gWyW64EuzjV6oKmxCR7_qOoeaTLXyGTkPzf9f7-gf0z4kwM2haIKRUpMnEJf-IQ13IQ5Yr6bnMUtSNH-qNyoAotHgJpi_-0jq10u0tkIEIolPsQbGsZsISazsw==; msToken=5LANh6VsLNs1fV9565GDMy4MAcV8gWyW64EuzjV6oKmxCR7_qOoeaTLXyGTkPzf9f7-gf0z4kwM2haIKRUpMnEJf-IQ13IQ5Yr6bnMUtSNH-qNyoAotHgJpi_-0jq10u0tkIEIolPsQbGsZsISazsw==',
        Referer: 'https://www.tiktok.com/',
        'sec-ch-ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24',
        'sec-ch-ua-platform': 'Windows',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site',
        'sec-ch-ua-mobile': '?0',
        'Sec-Fetch-Dest': 'video'
    };

    async scrapeVideo(url: string) {
        const html = await this.fetchVideoHtml(url);
        const parsedData = this.parseVideoData(html);
        const videoInfo = await this.getVideoInfo(parsedData);

        return videoInfo;
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

    async downloadVideo(url: string, name: string) {
        const data = await axios.get(url, { responseType: 'arraybuffer', headers: this.headers });
        const isSuccessful = data.status.toString().startsWith('2');
        if (!isSuccessful) {
            throw new ScraperError('Failed to download video');
        }

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
                withoutWatermark: await this.downloadVideo(video.playAddr, `${videoData.id}.mp4`),
                withWatermark: await this.downloadVideo(video.downloadAddr, `${videoData.id}_watermark.mp4`)
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
                duration: music.duration
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
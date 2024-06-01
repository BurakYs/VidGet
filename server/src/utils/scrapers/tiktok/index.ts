import ScraperError from '@/utils/classes/ScraperError';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import app from '@/config/app';

class TikTokScraper {
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        Cookie: 'tt_chain_token=IW2lLt8zV7Wi84d6JdNqzA==; passport_csrf_token=241b39b07b1dc95396a74324c09b9668; passport_csrf_token_default=241b39b07b1dc95396a74324c09b9668; tt_csrf_token=yejobjX1-o_My0NqCMpRVEn4KglXMRQDEey0; ak_bmsc=2DB35A63BB357B98D5A5748BF86BF3D9~000000000000000000000000000000~YAAQqnkmF5DsntCPAQAAZxvs0hd9gWyiGnE4b4aJmRljUDFde9vt+2YsqwFV9nQu1/sNrGSYZ8qh5gp5gvnDv8Hij1ArcEU+d+IMqoLYWpdQfPm2lkFbB9Xz/jqklXwiVI9hqQk+R3RLlQzS2Kphx/CYloeIxgj69g3s4/QptyNtu5lQAHTc5SEmRkUEj/hEpMFhtO3p+swtW7vx+0KfSJP52JI2CDD1lUnVBjzsHzkaDnG5xpV7au4RxNT/B3h55b4sECSuN4WzoIXGS1q6E0B0R+6H8PHje2vBYVKl4WwZ73aBWrNGNzbJ951oPqjuQr/mTvWKxcILeYTUYjHHxp2MY3kThZshLHndO5lEbaKLe6GveU3lOTpqdRHO5h/ygR2JIuzXrBCJXEmB; msToken=lNnV46u__E50zBPWFlKrZwlT2dIa_D888CzMxSmVRr9KiuK8X4TIqhfjRWH8Hq7CGx5Lqj0sQus8LKcl78b99CRjdIkLSVDuYfXW8JXAqll5aleCVRCLZZ3b2R9WprPxVnt82zcf_tgwgGgXZdJb9A==; ttwid=1%7Cb30UEy_55bPdfAFVbHrIXDCSwxKi3rkjmfuNLttkRgI%7C1717236929%7Cfc1ebe48ec851933704c03d3298e1775f4d9d77f2db7eb94164046ec5cb9cbe7; bm_sv=6B4B248C6A303E24BBF8CBD23D235C41~YAAQBO8QAtzbG8mPAQAAUvRM0xdX6VnRCAYE2BvlFsnduSuMpZzEbhgmOc3UOLgVI6/LCkrQRFzrxLHHCpuvGPJkjJs2xoNVRn6xbvJ8/n3aYjaxlAL6ev5TTJV/ZWCGbXYXvILlGmrx7Q0C/gLdWpWUfNMaUWbMEdBK28L9qpZVM47Lz43b5oES/fi1JE113WnhWOZN0KdsSUYpwmb3aBObzMrV2rdSWxakIX+oQGRY978eZAZYspgH3i/8P+x8tg==~1',
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
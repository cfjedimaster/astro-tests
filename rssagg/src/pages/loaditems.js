import Parser from 'rss-parser';
import { getStore } from "@netlify/blobs";

const TTL = 1000 * 60 * 60; // 1 hour cache 

export async function GET({ request }) {

    const store = getStore('rssagg-store');
    const url = new URL(request.url);
    const feeds = url.searchParams.get('feeds').split(',');
    const parser = new Parser();
    console.log('Feeds requested:', feeds);
    let items = [];

    let reqs = [];
    for (const feedUrl of feeds) {
        // first, do we have this in cache?
        const cacheKey = `feedcache-${encodeURIComponent(feedUrl)}`;
        let cached = await store.get(cacheKey);
        if(cached) {
            cached = JSON.parse(cached);
            // check age
            const now = Date.now();
            if(now - cached.timestamp < TTL) {
                console.log(`Using cached feed for ${feedUrl}`);
                items.push(...cached.items);
            } else {
                console.log(`Cache expired for ${feedUrl}, fetching new data.`);
                reqs.push(parser.parseURL(feedUrl));
            }
        } else {
            console.log(`No cache for ${feedUrl}, fetching data.`);
            reqs.push(parser.parseURL(feedUrl));
        }

    }

    const results = await Promise.allSettled(reqs);
    for (const result of results) {
        if (result.status === 'fulfilled') {
            const feed = result.value;
            console.log(`Fetched feed: ${feed.title} with ${feed.items.length} items.`);
            let newItems = [];
            feed.items.forEach(item => {
                /*
                will use content as a grab all for different fields
                for example, netlify had summary, not content
                */
                let content = item.contentSnippet || item.summary || item.content || '';
                newItems.push({
                    title: item.title,
                    link: item.link,
                    content: content,
                    pubDate: item.pubDate,
                    feedTitle: feed.title
                });
            });

            items.push(...newItems);

            // cache the feed
            const cacheKey = `feedcache-${encodeURIComponent(feed.feedUrl)}`;
            console.log(`Caching feed data for ${feed.feedUrl}`);
            await store.setJSON(cacheKey, {
                timestamp: Date.now(),
                items: newItems
            });
        } else {
            console.error('Error fetching/parsing feed:', result.reason);
        }
    }

    // now sort items by pubDate descending
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    return new Response(JSON.stringify(items), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}
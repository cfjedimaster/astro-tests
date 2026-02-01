import Parser from 'rss-parser';

export async function GET({ request }) {
    const url = new URL(request.url);
    const feeds = url.searchParams.get('feeds').split(',');
    const parser = new Parser();
    console.log('Feeds requested:', feeds);
    let items = [];

    let reqs = [];
    for (const feedUrl of feeds) {
        reqs.push(parser.parseURL(feedUrl));
    }

    const results = await Promise.allSettled(reqs);
    for (const result of results) {
        if (result.status === 'fulfilled') {
            const feed = result.value;
            console.log(`Fetched feed: ${feed.title} with ${feed.items.length} items.`);
            feed.items.forEach(item => {
                console.log(item);
                /*
                will use content as a grab all for different fields
                for example, netlify had summary, not content
                */
                let content = item.contentSnippet || item.summary || item.content || '';
                items.push({
                    title: item.title,
                    link: item.link,
                    content: content,
                    pubDate: item.pubDate,
                    feedTitle: feed.title
                });
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
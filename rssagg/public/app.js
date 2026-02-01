let feeds = [];
let $content, $dialog, $showDialogBtn, $closeDialogBtn, $addFeedBtn, $feedUrl, $feedTableDialog;

document.addEventListener('DOMContentLoaded', async () => {

    $content = document.querySelector('#content');
    $feedTableDialog = document.querySelector('#feedsTableDialog tbody');
    $showDialogBtn = document.querySelector('#showDialogButton');
    $dialog = document.querySelector('#manageFeedsDialog');
    $closeDialogBtn = document.querySelector('#manageFeedsDialog button');
    $addFeedBtn = document.querySelector('#addFeedButton');
    $feedUrl = document.querySelector('#feedUrl');

    $showDialogBtn.addEventListener("click", async () => {
        // before we show the dialog, get our feeds and render to table
        await renderFeedsDialog();
        $dialog.showModal();
    });

    $closeDialogBtn.addEventListener("click", () => {
        loadFeedItems();
        $dialog.close();
    });

    $addFeedBtn.addEventListener("click", async () => {

        if($feedUrl.checkValidity() === false) {
            $feedUrl.reportValidity();
            return;
        }

        const feedUrl = $feedUrl.value;
        if (feedUrl) {
            console.log(`Adding feed: ${feedUrl}`);
            let feeds = await getFeeds();
            feeds.push(feedUrl);
            window.localStorage.setItem('feeds', JSON.stringify(feeds));
            await renderFeedsDialog();
            $feedUrl.value = '';
        }
    });

    loadFeedItems();
});

async function getFeeds() {
    let f = window.localStorage.getItem('feeds');
    if (f) {
        return JSON.parse(f);
    } else {
        return [];
    }
}

async function loadFeedItems() {
    console.log('Loading feed items...');
    let feeds = await getFeeds();

    if(feeds.length === 0) {
        $content.innerHTML = '<p>No feeds available. Please add some feeds using the button below!</p>';
        return;
    }
    
    $content.innerHTML = '<i>Loading feed items...</i>';
    let qs = new URLSearchParams({
        feeds
    }).toString();

    let items = await fetch(`/loaditems?${qs}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }        
    });
    let data = await items.json();
    console.log('Fetched feed items', data.length);
    let result = '';
    data.forEach(item => {
        result += `<div class="feedItem">
            <h3><a href="${item.link}" target="_blank" rel="noopener">${item.title}</a></h3>
            <p>${snippet(item.content)}</p>
            <p><em>From: ${item.feedTitle} | Published: ${new Date(item.pubDate).toLocaleString()}</em></p>
        </div>`;
    });
    $content.innerHTML = result;
}

async function renderFeedsDialog() {
    let feeds = await getFeeds();
    let content = '';
    feeds.forEach(f => {
        content += `<tr><td>${f}</td><td><button onclick="deleteFeed('${f}')">Delete</button></td></tr>`;
    })
    $feedTableDialog.innerHTML = content;
}

async function deleteFeed(feedUrl) {
    let feeds = await getFeeds();
    feeds = feeds.filter(f => f !== feedUrl);
    window.localStorage.setItem('feeds', JSON.stringify(feeds));
    await renderFeedsDialog();
}

/*
I clean the content from parsing to remove HTML and reduce size
*/
function snippet(content) {
    content = content.replace(/(<([^>]+)>)/gi, ""); // remove HTML tags
    const maxLength = 200;
    if (content.length <= maxLength) {
        return content;
    } else {
        return content.substring(0, maxLength) + '...';
    }
}
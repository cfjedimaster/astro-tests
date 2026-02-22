
let $mastodonStatus;
let $blueskyStatus;
let $threadsStatus;
let $postButton, $postContent, $postImage, $altText, $imagePreview;
let $activityFeed;

let MASTODON = false;
let BLUESKY = false;
let THREADS = false;

document.addEventListener('DOMContentLoaded', function() {

    $mastodonStatus = document.querySelector('#mastodonStatus');
    $blueskyStatus = document.querySelector('#blueskyStatus');
    $threadsStatus = document.querySelector('#threadsStatus');
    $postButton = document.querySelector('#postButton');
    $postContent = document.querySelector('#postContent');
    $postImage = document.querySelector('#postImage');
    $altText = document.querySelector('#altText');
    $imagePreview = document.querySelector('#imagePreview');
    $activityFeed = document.querySelector('#activityFeed');

    // Begin by checking the status of the 3 networks
    checkMastodonStatus();
    //checkBlueskyStatus();
    //checkThreadsStatus();

    $postButton.addEventListener('click', handlePost);
    $postImage.addEventListener('change', doPreview);

});

async function checkMastodonStatus() {
    try {
        const response = await fetch('/api/mastodon/check.json');
        const data = await response.json();
        if (data.ready) {
            $mastodonStatus.textContent = 'Connected';
            $mastodonStatus.classList.remove('secondary');
            $mastodonStatus.classList.add('success');
            MASTODON = true;
        } else {
            $mastodonStatus.textContent = 'Not Connected';
            $mastodonStatus.classList.remove('secondary');
            $mastodonStatus.classList.add('danger');
            $mastodonStatus.title = data.error || 'Unknown error';
            console.error(data.error);
        }
    } catch (error) {
        console.error('Error checking Mastodon status:', error);
        $mastodonStatus.textContent = 'Error';
        $mastodonStatus.classList.remove('secondary');
        $mastodonStatus.classList.add('danger');
    }
}

async function handlePost() {
    let post = {};

    // First, a sanity check
    if(!MASTODON && !BLUESKY && !THREADS) {
        ot.toast('No social networks are configured! Please set up at least one network to post.', 'Action Stopped', {
            variant: 'danger',
            duration: 6000
        });

        return;
    }

    const content = $postContent.value.trim();
    if(!content) {
        ot.toast('No content. Type something!', 'Action Stopped', {
            variant: 'danger',
            duration: 3000
        });

        return;
    }

    post.content = content;

    let caption = $altText.value.trim();   
    if($postImage.files.length > 0) {
        if(!caption) {
            ot.toast('Image requires alt text. Please add alt text for the image and try again.', 'Action Stopped', {
                variant: 'danger',
                duration: 3000
            });
            return;
        }

        post.image = await fileToBase64($postImage.files[0]);
        post.altText = caption;
    }

    $postButton.setAttribute('disabled', 'disabled');
    // Call all 3 networks, and wait for the results
    $activityFeed.innerHTML = 'Posting to enabled networks...';

    let results = [];
    
    if(MASTODON && false) {
        results.push(postToMastodon(post));
    }

    let settledResults = await Promise.allSettled(results);
    console.log('Settled results:', settledResults);
    let resultHTML = '';
    for(let result of settledResults) {
        if(result.status === 'fulfilled') {
            let data = result.value;
            if(data.ok) {
                resultHTML += `Successfully posted to ${data.network}!`;
            } else {
                resultHTML += `Failed to post to ${data.network}: ${data.error}`;
            }
        } else {
            resultHTML += `Error posting to a network: ${result.reason}`;
        }
    }

    $activityFeed.innerHTML = resultHTML;

    // cleanup
    $postContent.value = '';
    $postImage.value = '';
    $altText.value = '';
    $imagePreview.src = '';
    $imagePreview.style.display = 'none';
    $postButton.removeAttribute('disabled');
}

async function postToMastodon(post) {
    try {
        const response = await fetch('/api/mastodon/post.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post })
        });
        
        const data = await response.json();
        console.log('Mastodon post result:', data);
        data.network = 'Mastodon';
        return data;
        
    } catch (error) {
        console.error('Error posting to Mastodon:', error);
        return { network: 'Mastodon', success: false, error: error.message };
    }
}

async function doPreview() {
    const file = $postImage.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $imagePreview.src = e.target.result;
            $imagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        $imagePreview.src = '';
        $imagePreview.style.display = 'none';
    }
}

async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        }
        reader.onerror = function(error) {
            reject(error);
        }
        reader.readAsDataURL(file);
    });
}
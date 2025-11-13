const formatDate = d => {
    return new Intl.DateTimeFormat('en', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(d));

}

const excerpt = async s => {
    let html = await s.compiledContent();
    let firstEndP = html.indexOf('</p>');
    return html.slice(0, firstEndP+4);
}

export {
    formatDate, excerpt
}
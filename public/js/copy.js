const copy = () => {
    const link = document.querySelector('a.link');
    const range = document.createRange();
    range.selectNode(link);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();

    const button = document.querySelector('.copy');
    button.innerHTML = 'Copied!';
    button.classList.add('copied');

    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = 'Copy';
    }, 2000);
};

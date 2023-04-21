if (window.location.hostname == 'localhost') {
  if (window.location.pathname.endsWith('index.html')) {
    window.location.pathname = window.location.pathname.substring(0, window.location.pathname.length - 'index.html'.length);
  } else if (!window.location.pathname.endsWith('/')) {
    window.location.pathname += '/';
  }
}
if (window.location.hostname == 'localhost') {
  if (window.location.pathname.endsWith('index.html')) {
    window.location.pathname = window.location.pathname.substring(0, window.location.pathname.length - 'index.html'.length);
  } else if (!window.location.pathname.endsWith('/')) {
    window.location.pathname += '/';
  }
}

/* exported FixedUrl */
class FixedURL extends URL {
  static fixURLobj(url: URL) {
    if (url.pathname.endsWith('index.html')) {
      url.pathname = url.pathname.substring(0, url.pathname.length - 'index.html'.length);
    } else if (!url.pathname.endsWith('/')) {
      url.pathname += '/';
    }
    return url;
  }

  constructor(url: string | URL, base?: string | URL | undefined) {
    super(url, base);

    FixedURL.fixURLobj(this);
  }
}
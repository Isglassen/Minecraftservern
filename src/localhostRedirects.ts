/* exported FixedUrl */
class FixedURL extends URL {
  static fixURLobj(url: URL | Location) {
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

// GitHub does this for us. This check should be for any environment that doesn't
if (window.location.hostname == 'localhost') FixedURL.fixURLobj(window.location);
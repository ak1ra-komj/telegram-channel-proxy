
export const config = {
    domain: "ch.example.com",

    channel: "durov",

    // https://developers.cloudflare.com/workers/runtime-apis/request/
    cf: {
        cacheEverything: false,
        cacheTtl: 30,
        cacheTtlByStatus: {
            "404": 1,
            "500-599": 0,
        },
        minify: {
            html: false,
            css: true,
            javascript: true,
        },
        mirage: true,
    },

    regex: /((href|src|content)="|url\('?)((https?:)?\/\/(t\.me|telegram\.org|cdn\d\.telegram-cdn\.org|fonts\.(googleapis|gstatic)\.com)\/)/g,
}

export const prefixToHost: Record<string, string> = {
    "/tgme": "t.me",

    // css, js, img
    "/tgorg": "telegram.org",

    // telegram CDNs, for static files
    "/cdn1": "cdn1.telegram-cdn.org",
    "/cdn2": "cdn2.telegram-cdn.org",
    "/cdn3": "cdn3.telegram-cdn.org",
    "/cdn4": "cdn4.telegram-cdn.org",
    "/cdn5": "cdn5.telegram-cdn.org",

    // fonts
    "/googleapis": "fonts.googleapis.com",
    "/gstatic": "fonts.gstatic.com",
}

export const hostToPrefix: Record<string, string> = {
    "t.me": "/tgme",

    // css, js, img...
    "telegram.org": "/tgorg",

    // telegram CDNs, for static files
    "cdn1.telegram-cdn.org": "/cdn1",
    "cdn2.telegram-cdn.org": "/cdn2",
    "cdn3.telegram-cdn.org": "/cdn3",
    "cdn4.telegram-cdn.org": "/cdn4",
    "cdn5.telegram-cdn.org": "/cdn5",

    // fonts
    "fonts.googleapis.com": "/googleapis",
    "fonts.gstatic.com": "/gstatic",
}
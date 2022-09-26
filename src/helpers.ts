
import { config, prefixToHost, hostToPrefix } from "./config";
import { Env } from "./types";

export async function handleRequest(
    request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {

    let url = new URL(request.url);
    const domain = env.DOMAIN !== undefined ? env.DOMAIN : config.domain;
    const channel = env.CHANNEL !== undefined ? env.CHANNEL : config.channel;

    const upstreamUrl = toUpstreamUrl(url, domain, channel);
    const resp = await fetch(new Request(upstreamUrl.toString(), request), {cf: config.cf});
    const respText = await resp.text();

    const contentType = resp.headers.get("content-type");
    // replace HTML and CSS URLs
    if (contentType !== null && /text\/(html|css)/i.test(contentType)) {
        const replacedRespText = respText.replaceAll(
            config.regex,
            (match, g1, g2, g3, g4, g5, offset, string, groups): string => {
                const key: string = g1 !== undefined ? g1 : "";
                const prefix: string = g5 !== undefined && hostToPrefix.hasOwnProperty(g5) ? hostToPrefix[g5] : "";
                return `${key}${prefix}/`;
            }
        );
        return new Response(replacedRespText, resp);
    } else {
        return resp;
    }
}

export function toUpstreamUrl(url: URL, domain: string, channel: string): URL {
    const upstreamUrl = new URL(url.toString());

    if (url.host === domain && url.pathname === "/") {
        upstreamUrl.host = "t.me";
        upstreamUrl.pathname = `/s/${channel}`;
    }

    if (url.pathname.split("/").length <= 1) {
        return upstreamUrl;
    }

    const prefix = "/" + url.pathname.split("/")[1];
    if(prefixToHost.hasOwnProperty(prefix)) {
        upstreamUrl.host = prefixToHost[prefix];
        upstreamUrl.pathname = url.pathname.slice(prefix.length);
    }

    return upstreamUrl;
}

export function toProxiedUrl(url: URL, domain: string, channel: string): URL {
    const proxiedUrl = new URL(url.toString());

    if (url.host === "t.me" && url.pathname === `/s/${channel}`) {
        proxiedUrl.host = domain;
        proxiedUrl.pathname = "/";
    }

    if(hostToPrefix.hasOwnProperty(url.host)) {
        proxiedUrl.host = domain;
        proxiedUrl.pathname = hostToPrefix[url.host] + url.pathname;
    }

    return proxiedUrl;
}

export class AttributeRewriter {
    attributeName: string;
    domain: string;
    channel: string;
    referer: URL;
    regex = config.regex;

    constructor(attributeName: string, domain: string, channel: string, referer: URL) {
        this.attributeName = attributeName;
        this.domain = domain;
        this.channel = channel;
        this.referer = referer;
    }

    element(element: Element) {
        let attribute = element.getAttribute(this.attributeName);
        if (attribute === null) {
            return;
        }

        // env.REWRITE_IN_PAGE_URL controls whether to enable in-page urls rewrite
        if (this.regex.test(attribute)) {
            if (attribute.startsWith("//")) {
                attribute = this.referer.protocol + attribute;
            }
            element.setAttribute(
                this.attributeName,
                toProxiedUrl(new URL(attribute), this.domain, this.channel).toString());
        } else {
            // other url or protocol
            if (!/^\/[^\/]/gi.test(attribute)) {
                return;
            }
            // Url from same origin
            if (hostToPrefix.hasOwnProperty(this.referer.host)) {
                element.setAttribute(
                    this.attributeName, hostToPrefix[this.referer.host] + attribute);
            }
        }
    }
}

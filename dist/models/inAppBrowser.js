/**
 * Detect popular in-app browsers where window.print() is unreliable or absent.
 * UA strings are best-effort fingerprints for: Facebook, Instagram, Messenger,
 * TikTok, Zalo, LinkedIn, Line, WeChat, KakaoTalk, Threads, Twitter.
 *
 * Returning `true` here only means "warn the user" — we still attempt the
 * print call, because some of these (newer FB versions on iOS) actually do
 * forward print correctly. The modal is informational, not a hard block.
 */
const IN_APP_PATTERNS = [
    { id: "Facebook", pattern: /\bFBAN|FBAV|FB_IAB\b/i },
    { id: "Instagram", pattern: /\bInstagram\b/i },
    { id: "Messenger", pattern: /\bFB_IAB\/MESSENGER|Messenger\b/i },
    { id: "Threads", pattern: /\bBarcelona\b/i },
    { id: "TikTok", pattern: /\bMusical_ly|BytedanceWebview|Tiktok\b/i },
    { id: "Zalo", pattern: /\bZalo\b/i },
    { id: "LinkedIn", pattern: /\bLinkedInApp\b/i },
    { id: "Line", pattern: /\bLine\//i },
    { id: "WeChat", pattern: /\bMicroMessenger\b/i },
    { id: "KakaoTalk", pattern: /\bKAKAOTALK\b/i },
    { id: "Twitter", pattern: /\bTwitter\b/i },
    { id: "Snapchat", pattern: /\bSnapchat\b/i },
    { id: "Pinterest", pattern: /\bPinterest\b/i },
];
export function detectInAppBrowser() {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let appName;
    for (const { id, pattern } of IN_APP_PATTERNS) {
        if (pattern.test(ua)) {
            appName = id;
            break;
        }
    }
    const printMissing = typeof window === "undefined" || typeof window.print !== "function";
    return {
        isInApp: Boolean(appName),
        ...(appName !== undefined ? { appName } : {}),
        printMissing,
    };
}

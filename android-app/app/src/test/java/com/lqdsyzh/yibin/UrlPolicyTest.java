package com.lqdsyzh.yibin;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class UrlPolicyTest {

    @Test
    public void sitePagesStayInWebView() {
        assertTrue(UrlPolicy.shouldStayInWebView("https://lqdsyzh.github.io/yibin/"));
        assertTrue(UrlPolicy.shouldStayInWebView("https://lqdsyzh.github.io/yibin/liuxiu-game/playable/"));
        assertTrue(UrlPolicy.shouldStayInWebView("https://lqdsyzh.github.io/yibin/docs/liquan/todo/"));
    }

    @Test
    public void externalLinksLeaveWebView() {
        assertFalse(UrlPolicy.shouldStayInWebView("https://github.com/lqdsyzh/yibin"));
        assertFalse(UrlPolicy.shouldStayInWebView("https://example.com/page"));
    }

    @Test
    public void lookalikeHostIsTreatedAsExternal() {
        /* 不能让 "evil-lqdsyzh.github.io" 这类仿冒域名留在 WebView 内 */
        assertFalse(UrlPolicy.shouldStayInWebView("https://notlqdsyzh.github.io/"));
        assertFalse(UrlPolicy.shouldStayInWebView("https://lqdsyzh.github.io.evil.com/"));
    }

    @Test
    public void schemelessOrMalformedUrlIsExternal() {
        assertFalse(UrlPolicy.shouldStayInWebView("mailto:someone@example.com"));
        assertFalse(UrlPolicy.shouldStayInWebView("::::"));
        assertFalse(UrlPolicy.shouldStayInWebView((String) null));
    }

    @Test
    public void localhostStaysInWebView() {
        assertTrue(UrlPolicy.shouldStayInWebView("http://localhost:8080/"));
    }
}

package com.lqdsyzh.yibin;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * WebActivity 里 shouldOverrideUrlLoading 的判定逻辑。
 * 用 java.net.URI 而非 android.net.Uri，以便在纯 JVM 单元测试中覆盖。
 */
final class UrlPolicy {

    private static final String SITE_HOST = "lqdsyzh.github.io";

    private UrlPolicy() {
    }

    /** 站内链接留在 WebView 内打开，其余交给系统浏览器。 */
    static boolean shouldStayInWebView(URI uri) {
        if (uri == null) {
            return false;
        }
        String host = uri.getHost();
        if (host == null) {
            return false;
        }
        host = host.toLowerCase();
        return host.equals(SITE_HOST) || host.equals("localhost");
    }

    static boolean shouldStayInWebView(String url) {
        if (url == null) {
            return false;
        }
        try {
            return shouldStayInWebView(new URI(url));
        } catch (URISyntaxException e) {
            return false;
        }
    }
}

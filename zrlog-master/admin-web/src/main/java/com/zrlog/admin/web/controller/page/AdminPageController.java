package com.zrlog.admin.web.controller.page;

import com.google.gson.Gson;
import com.hibegin.common.util.IOUtil;
import com.jfinal.core.Controller;
import com.jfinal.kit.PathKit;
import com.jfinal.render.HtmlRender;
import com.zrlog.admin.web.token.AdminTokenService;
import com.zrlog.business.service.CommonService;
import com.zrlog.common.Constants;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import javax.servlet.http.Cookie;
import java.io.FileInputStream;
import java.io.FileNotFoundException;

public class AdminPageController extends Controller {

    private final AdminTokenService adminTokenService = new AdminTokenService();

    public void index() throws FileNotFoundException {
        if (getRequest().getRequestURI().endsWith(Constants.ADMIN_URI_BASE_PATH) || getRequest().getRequestURI().endsWith(Constants.ADMIN_URI_BASE_PATH + "/")) {
            redirect(Constants.ADMIN_URI_BASE_PATH + "/index");
            return;
        }
        render(new HtmlRender(getHtmlStr()));
    }

    private String getHtmlStr() throws FileNotFoundException {
        Document document = Jsoup.parse(IOUtil.getStringInputStream(new FileInputStream(PathKit.getWebRootPath() + "/admin" + "/index.html")));
        //clean history
        document.body().removeClass("dark");
        document.body().removeClass("light");
        document.body().addClass(Constants.getBooleanByFromWebSite("admin_darkMode") ? "dark" : "light");
        document.title(Constants.WEB_SITE.get("title") + "");
        document.getElementById("resourceInfo").text(new Gson().toJson(new CommonService().resourceInfo(getRequest())));
        return document.outerHtml();
    }

    public void login() throws FileNotFoundException {
        render(new HtmlRender(getHtmlStr()));
    }

    public void logout() {
        Cookie[] cookies = getRequest().getCookies();
        for (Cookie cookie : cookies) {
            if (AdminTokenService.ADMIN_TOKEN.equals(cookie.getName())) {
                cookie.setValue("");
                cookie.setMaxAge(Constants.getSessionTimeout().intValue());
                cookie.setPath("/");
                adminTokenService.setCookieDomain(getRequest(), cookie);
                getResponse().addCookie(cookie);
            }
        }
        redirect(Constants.ADMIN_LOGIN_URI_PATH);
    }
}

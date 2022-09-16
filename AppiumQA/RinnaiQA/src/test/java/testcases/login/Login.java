package testcases.login;

import org.testng.annotations.Test;
import pages.LoginPage;
import utils.ConfigurationManager;

import java.net.MalformedURLException;

public class Login {
    @Test
        public void loginTest() throws MalformedURLException, InterruptedException{
        LoginPage login = new LoginPage();
        login.waitForPage(login.textEmail);
        login.inputEmail(ConfigurationManager.getProperty("username"));
        login.inputPassword(ConfigurationManager.getProperty("password"));
        login.submitSignin();
    }
}

package testcases.menu;

import org.testng.annotations.Test;
import pages.LogOutPage;
import java.net.MalformedURLException;

public class LogOut {
    @Test
    public void logoutTest() throws MalformedURLException, InterruptedException{
        LogOutPage logOut = new LogOutPage();
}}

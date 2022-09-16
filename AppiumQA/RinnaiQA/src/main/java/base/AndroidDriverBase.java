package base;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import utils.ConfigurationManager;
import java.net.MalformedURLException;
import java.net.URL;


public class AndroidDriverBase {
    public  static AppiumDriver<MobileElement> driver;
    public static AppiumDriver<MobileElement> openControl() throws MalformedURLException, InterruptedException {
        DesiredCapabilities cap = new DesiredCapabilities();
        cap.setCapability("deviceName", ConfigurationManager.getProperty("deviceName"));
        cap.setCapability("platformName", ConfigurationManager.getProperty("platformName"));
        cap.setCapability("appPackage", ConfigurationManager.getProperty("appPackage"));
        cap.setCapability("appActivity",ConfigurationManager.getProperty("appActivity"));
        cap.setCapability("app", ConfigurationManager.getProperty("app"));
        driver = (AppiumDriver)new AndroidDriver(new URL(ConfigurationManager.getProperty("host")), cap);
        return driver;

    }

    }

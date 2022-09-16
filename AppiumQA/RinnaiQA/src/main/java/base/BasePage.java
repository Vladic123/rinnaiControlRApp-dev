package base;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import utils.AppConstants;
import utils.ConfigurationManager;
import java.net.MalformedURLException;

public abstract class BasePage {
    public static AppiumDriver<MobileElement> driver;
    public static AndroidDriver<MobileElement> androidDriver;
    public static IOSDriver<MobileElement> iosDriver;

    public BasePage() throws MalformedURLException, InterruptedException {
        if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.ANDROID)) {
            AndroidDriverBase base = new AndroidDriverBase();
            androidDriver = (AndroidDriver) base.openControl();
            PageFactory.initElements(new AppiumFieldDecorator(androidDriver), this);
        } else if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.IOS)) {
            IOSDriverBase base = new IOSDriverBase();
            iosDriver = (IOSDriver) base.openControl();
            PageFactory.initElements(new AppiumFieldDecorator(iosDriver), this);
        }
    }

    public void waitForPage(MobileElement element) {
        waitForElement(element);

    }
    public void waitForElement(MobileElement element) {
        if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.ANDROID)) {
            WebDriverWait wait = new WebDriverWait(androidDriver, 20, 10);
            wait.until(ExpectedConditions.visibilityOf(element));
        } else if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.IOS)) {
            WebDriverWait wait = new WebDriverWait(iosDriver, 20, 10);
            wait.until(ExpectedConditions.visibilityOf(element));
        }

    }
}

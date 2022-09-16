package base;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import org.openqa.selenium.JavascriptExecutor;
import io.appium.java_client.TouchAction;
import utils.AppConstants;
import utils.ConfigurationManager;
import java.util.*;
import static io.appium.java_client.touch.TapOptions.tapOptions;
import static io.appium.java_client.touch.WaitOptions.waitOptions;
import static io.appium.java_client.touch.offset.ElementOption.element;
import static java.time.Duration.ofMillis;
import java.util.HashMap;


   public class DriverActions {
    public static AndroidDriver<MobileElement> driver;
    public static void enterText(MobileElement element, String value) {
        element.sendKeys(value);
    }

    public static void scrollToElement(String elementText) {
        String uiSelector = "new UiSelector().textMatches(\"" + elementText + "\")";
        System.out.println(uiSelector);
        String command = "new UiScrollable(new UiSelector().scrollable(true).instance(0)).scrollIntoView(" + uiSelector + ");";
        if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.ANDROID)) {
            BasePage.androidDriver.findElementByAndroidUIAutomator(command);
        } else if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.IOS)) {
            swipeDownIos();
        }
    }
    public static void swipeDownIos() {
        JavascriptExecutor js = (JavascriptExecutor) BasePage.iosDriver;
        Map<String, Object> params = new HashMap<>();
        params.put("direction", "up");
        params.put("velocity", 2500);
        js.executeScript("mobile: swipe", params);

    }

    public static void click(MobileElement element) {
        if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.ANDROID)) {
            element.click();
        } else if (ConfigurationManager.getProperty("platformName").equalsIgnoreCase(AppConstants.IOS)) {
            element.click();
        }
    }

    public static void clickAndTapIos(MobileElement element) {
        System.out.println("text -->" + element.getText());
        element.click();
        new TouchAction(BasePage.iosDriver)
                .tap(tapOptions().withElement(element(element)))
                .waitAction(waitOptions(ofMillis(250))).perform();
    }

    public static Boolean isElementDisplayed(MobileElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException x) {

            return false;
        }
    }

}




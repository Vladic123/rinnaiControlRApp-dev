package base;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.ios.IOSDriver;
import org.openqa.selenium.remote.DesiredCapabilities;
import utils.ConfigurationManager;
import java.net.MalformedURLException;
import java.net.URL;

public class IOSDriverBase {
    public  static AppiumDriver<MobileElement> driver;
    public static AppiumDriver<MobileElement> openControl() throws MalformedURLException, InterruptedException {
      DesiredCapabilities cap = new DesiredCapabilities();
      cap.setCapability("deviceName", ConfigurationManager.getProperty("iosDeviceName"));
      cap.setCapability("platformName", ConfigurationManager.getProperty("iosPlatformName"));
      cap.setCapability("platformVersion", ConfigurationManager.getProperty("iosVersion"));
      cap.setCapability("automationName", ConfigurationManager.getProperty("iosAutomationName"));
      cap.setCapability("app",ConfigurationManager.getProperty("iosApp"));
      cap.setCapability("udid",ConfigurationManager.getProperty("iosUdid"));
      cap.setCapability("noReset", true);
      cap.setCapability("autoAcceptAlerts" , true);
      driver = (AppiumDriver)new IOSDriver(new URL(ConfigurationManager.getProperty("host")), cap);
return driver;
  }

}

package pages;

import base.BasePage;
import base.DriverActions;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import java.net.MalformedURLException;

public class LogOutPage extends BasePage {

    @AndroidFindBy(xpath = "")
    @iOSXCUITFindBy(xpath = "")
    private MobileElement menu;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Logout']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Logout')]")
    public MobileElement btnLogOut;

    public LogOutPage() throws MalformedURLException, InterruptedException {
        super();
    }

    public void isLogOutBtnDisplayed(){
        DriverActions.isElementDisplayed(btnLogOut);
    }
    public void tapOnLogOutBtn(){
        DriverActions.click(btnLogOut);
    }

}

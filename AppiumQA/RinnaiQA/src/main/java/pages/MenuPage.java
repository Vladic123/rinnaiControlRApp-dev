package pages;
import base.BasePage;
import base.DriverActions;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import java.net.MalformedURLException;

public class MenuPage extends BasePage {
    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Home']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Home')]")
    public MobileElement btnHome;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Schedule']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Schedule')]")
    public MobileElement btnSchedule;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Rinnai Pro Monitoring']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Rinnai Pro Monitoring')]")
    public MobileElement btnRinnaiPro;
    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Error History']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Error History')]")
    public MobileElement btnErrorHistory;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='System Status']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'System Status')]")
    public MobileElement btnSystemStatus;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Product Registration']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Product Registration')]")
    public MobileElement btnProductRegistration;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='control•r Info']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'control•r Info')]")
    public MobileElement btnControlInfo;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Forget Device']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Forget Device')]")
    public MobileElement btnForgetDevice;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='My Account']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'My Account')]")
    public MobileElement btnMyAccount;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Add A Device']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Add A Device')]")
    public MobileElement btnAddDevice;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Logout']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeButton[contains(@label, 'Logout')]")
    public MobileElement btnLogOut;

    public MenuPage() throws MalformedURLException, InterruptedException {
        super();
    }
    public String isHomeBtnDisplayed(){
        DriverActions.isElementDisplayed( btnHome);
        String text=btnHome.getText();
        System.out.println("Home Button Text-->" +text);
        return text;
    }
    public void tapOnHomeBtn(){
        DriverActions.click( btnHome);
    }
    public boolean isScheduleBtnDisplayed(){
        DriverActions.isElementDisplayed(btnSchedule);
        return false;
    }
    public void tapOnScheduleBtn(){
        DriverActions.click(btnSchedule);
    }
    public boolean isRinnaiProBtnDisplayed(){
        DriverActions.isElementDisplayed(btnRinnaiPro);
        return false;
    }
    public void tapOnRinnaiProBtn(){
        DriverActions.click(btnRinnaiPro);
    }
    public boolean isErrorHistoryBtnDisplayed(){
        DriverActions.isElementDisplayed(btnErrorHistory);
        return false;
    }
    public void tapOnErrorHistoryBtn(){
        DriverActions.click(btnErrorHistory);
    }
    public boolean isSystemStatusBtnDisplayed(){
        DriverActions.isElementDisplayed(btnSystemStatus);
        return false;
    }
    public void tapOnSystemStatusBtn(){
        DriverActions.click(btnSystemStatus);
    }
    public boolean isProductRegistrationbtnDisplayed(){
        DriverActions.isElementDisplayed(btnProductRegistration);
        return false;
    }
    public void tapOnProductRegistrationBtn(){
        DriverActions.click(btnProductRegistration);
    }
    public boolean isControlInfoBtnDisplayed(){
        DriverActions.isElementDisplayed(btnControlInfo);
        return false;
    }
    public void tapOnControlInfoBtn(){
        DriverActions.click(btnControlInfo);
    }
    public boolean isForgetDeviceBtnDisplayed(){
        DriverActions.isElementDisplayed(btnForgetDevice);
        return false;
    }
    public void tapOnForgetDeviceBtn(){
        DriverActions.click(btnForgetDevice);
    }

    public boolean isMyAccountBtnDisplayed(){
        DriverActions.isElementDisplayed(btnMyAccount);
        return false;
    }
    public void tapOnMyAccountBtn(){
        DriverActions.click(btnMyAccount);
    }
    public boolean isAddDeviceBtnDisplayed(){
        DriverActions.isElementDisplayed(btnAddDevice);
        return false;
    }
    public void tapOnAddDeviceBtn(){
        DriverActions.click(btnAddDevice);
    }
    public boolean isLogOutBtnDisplayed(){
        DriverActions.isElementDisplayed(btnLogOut);
        return false;
    }
    public void tapOnLogOutBtn(){
        DriverActions.click(btnLogOut);
    }
}



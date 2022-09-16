package pages;


import base.BasePage;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;

import java.net.MalformedURLException;

public class ForgotPswdPage  extends BasePage {

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Forgot Password?']")
    @iOSXCUITFindBy(xpath = "//*[@name='Forgot Password?']")
    private MobileElement forgotPassword;


    @AndroidFindBy(xpath = "//android.widget.EditText[@text='Email Address']")
    @iOSXCUITFindBy(xpath = "")
    private MobileElement emailForUpdate;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Submit']")
    @iOSXCUITFindBy(xpath = "")
    private MobileElement submitBtn;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Cancel']")
    @iOSXCUITFindBy(xpath = "")
    private MobileElement cancelBtn;

    public ForgotPswdPage() throws MalformedURLException, InterruptedException {

    }
}

package pages;


import base.BasePage;
import base.DriverActions;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import java.net.MalformedURLException;

public class SignUpPage  extends BasePage {
    @AndroidFindBy(xpath = "//android.widget.TextView[@text='SIGN UP']")
    @iOSXCUITFindBy(xpath = "//*[@name='New to control•r? SIGN UP']")
    public MobileElement btnSignUp;

    @AndroidFindBy(xpath = "//android.widget.TextViewt[@text= 'RINNAI']")
    @iOSXCUITFindBy(xpath = "//*[@value= 'RINNAI']")
    public MobileElement textHeader;

    @AndroidFindBy(xpath = "//android.widget.EditText[@text= 'Enter your first name']")
    @iOSXCUITFindBy(xpath = "//*[@value='Enter your first name']")
    public MobileElement textFirstName;

    @AndroidFindBy(xpath = "//android.widget.EditText[@text= 'Enter your last name']")
    @iOSXCUITFindBy(xpath = "//*[@value='Enter your last name']")
    public MobileElement textLastName;

    @AndroidFindBy(xpath = "//android.widget.EditText[@text= 'Enter your phone number']")
    @iOSXCUITFindBy(xpath = "//*[@value='Enter your phone number']")
    public MobileElement textPhone;

    @AndroidFindBy(xpath = "//android.widget.EditText[@text= 'Enter your email address']")
    @iOSXCUITFindBy(xpath = "//*[@value='Enter your email address']")
    public MobileElement textEmail;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Password:']/following-sibling::android.widget.EditText")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@value='Password:']/following-sibling::XCUIElementTypeOther/XCUIElementTypeSecureTextField")
    public MobileElement textPassword;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text='Confirm Password:']/following-sibling::android.widget.EditText")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@value='Confirm Password:']/following-sibling::XCUIElementTypeOther/XCUIElementTypeSecureTextField")
    public MobileElement textConfirmPassword;


    @iOSXCUITFindBy(xpath = "//XCUIElementTypeStaticText[@value='Confirm Password:']")
    public MobileElement labelConfirmPassword;

    @AndroidFindBy(xpath = "//android.widget.TextView[@text= 'Create my account']")
    @iOSXCUITFindBy(xpath = "//XCUIElementTypeOther[@name='Create my account']")
    public MobileElement btnCreateMyAct;

    public SignUpPage() throws MalformedURLException, InterruptedException {
        super();
    }
    public void clickSignUpBtn(){
        DriverActions.click(btnSignUp);
    }
    public void inputFirstName(String firstName){
        DriverActions.enterText(textFirstName , firstName);
    }
    public void inputLastName(String lastName){
        DriverActions.enterText(textLastName , lastName);
    }
    public void inputPhone(String phone){
        DriverActions.enterText(textPhone , phone);
    }
    public void inputEmail(String email){
        DriverActions.enterText(textEmail , email);
    }
    public void inputPassword(String password){
        DriverActions.enterText(textPassword , password);
    }
    public void inputConfirmPswd(String confirmPassword){
        DriverActions.scrollToElement("Confirm Password:");
        DriverActions.enterText(textConfirmPassword , confirmPassword);
        DriverActions.swipeDownIos();
        DriverActions.click(labelConfirmPassword);
    }
    public void clickCreateMyAct(){
        DriverActions.clickAndTapIos(btnCreateMyAct);
    }


}






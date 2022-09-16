package pages;
import base.BasePage;
import base.DriverActions;
import io.appium.java_client.MobileElement;
import io.appium.java_client.pagefactory.AndroidFindBy;
import io.appium.java_client.pagefactory.iOSXCUITFindBy;
import java.net.MalformedURLException;

public class LoginPage  extends BasePage {

 @AndroidFindBy(xpath = "//android.widget.EditText[@text= 'Enter your email']")
 @iOSXCUITFindBy(xpath = "//*[@value='Enter your email']")
 public MobileElement textEmail;

 @AndroidFindBy(xpath = "//android.widget.EditText[@text='Enter your password']")
 @iOSXCUITFindBy(xpath = "//*[@value='Enter your password']")
 public MobileElement textPassword;

 @AndroidFindBy(xpath = "//android.widget.TextView[@text='Sign In']")
 @iOSXCUITFindBy(xpath = "//XCUIElementTypeOther[@name='Sign In']")
 //(accessibility = "Sign In")
 public MobileElement btnSignin;

 @AndroidFindBy(xpath = "//android.widget.TextView[@text='Forgot Password?']")
 @iOSXCUITFindBy(xpath = "//*[@name='Forgot Password?']")
 private MobileElement forgotPassword;

 @AndroidFindBy(xpath = "//android.widget.TextView[@text='SIGN UP']")
 @iOSXCUITFindBy(xpath = "//*[@name='New to control•r? SIGN UP']")
 private MobileElement btnSignUp;

 public LoginPage() throws MalformedURLException, InterruptedException {
  super();
 }

 public void inputEmail(String email){
  DriverActions.enterText(textEmail , email);
}
 public void inputPassword(String password){
  DriverActions.enterText(textPassword , password);
 }
 public void submitSignin(){
  DriverActions.clickAndTapIos(btnSignin);
 }

}




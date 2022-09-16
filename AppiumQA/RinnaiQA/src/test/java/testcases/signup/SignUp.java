package testcases.signup;

import org.testng.annotations.Test;
import pages.SignUpPage;
import utils.AppUtils;
import utils.ConfigurationManager;

import java.net.MalformedURLException;

public class SignUp {
    @Test
    public void signUpTest()throws MalformedURLException, InterruptedException{
        int randomSize=20;
        SignUpPage signup = new SignUpPage();
        signup.waitForPage(signup.btnSignUp);
        signup.clickSignUpBtn();
        signup.waitForPage(signup.textFirstName);
        signup.inputFirstName(ConfigurationManager.getProperty("firstname"));
        signup.inputLastName(ConfigurationManager.getProperty("lastname"));
        signup.inputPhone(ConfigurationManager.getProperty("phone"));
        signup.inputEmail("vijaya.karne+" +(AppUtils.getAlphaNumericString(randomSize))+"@stablekernel.com");
        signup.inputPassword(ConfigurationManager.getProperty("signuppassword"));
        signup.inputConfirmPswd(ConfigurationManager.getProperty("confirmpassword"));
        signup.clickCreateMyAct();
    }

}

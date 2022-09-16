package testcases.menu;
import org.testng.Assert;
import org.testng.annotations.Test;
import pages.LoginPage;
import pages.MenuPage;
import java.net.MalformedURLException;
import org.testng.asserts.SoftAssert;

public class Menu {
    MenuPage menu;
    {
        try {
            menu = new MenuPage();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void menuBarOptionsDisplayed() throws MalformedURLException, InterruptedException {

        SoftAssert softAssert = new SoftAssert();
        softAssert.assertEquals(menu.isHomeBtnDisplayed(),"Home" );
        softAssert.assertTrue(menu.isScheduleBtnDisplayed(), "HomeButton is not Displayed");
        softAssert.assertTrue(menu.isRinnaiProBtnDisplayed(),"HomeButton is not Displayed");
        softAssert.assertTrue( menu.isErrorHistoryBtnDisplayed(),"HomeButton is not Displayed");
        softAssert.assertTrue(menu.isSystemStatusBtnDisplayed(), "HomeButton is not Displayed");
        softAssert.assertTrue( menu.isProductRegistrationbtnDisplayed(), "HomeButton is not Displayed");
        softAssert.assertTrue(menu.isControlInfoBtnDisplayed() ,"HomeButton is not Displayed");
        softAssert.assertTrue( menu.isForgetDeviceBtnDisplayed(), "HomeButton is not Displayed");
        softAssert.assertTrue( menu.isMyAccountBtnDisplayed(),"HomeButton is not Displayed");
        softAssert.assertTrue(menu.isAddDeviceBtnDisplayed(), "HomeButton is not Displayed");
        softAssert.assertTrue( menu.isLogOutBtnDisplayed(), "HomeButton is not Displayed");
    }
    @Test
    public void menuBarOptionsClickable() throws MalformedURLException, InterruptedException {
        menu.tapOnHomeBtn();
        menu.tapOnSystemStatusBtn();
        menu.tapOnRinnaiProBtn();
        menu.tapOnErrorHistoryBtn();
        menu.tapOnSystemStatusBtn();
        menu.tapOnProductRegistrationBtn();
        menu.tapOnControlInfoBtn();
        menu.tapOnForgetDeviceBtn();
        menu.tapOnMyAccountBtn();
        menu.tapOnAddDeviceBtn();
        menu.tapOnLogOutBtn();

    }
}

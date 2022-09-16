package base;
import org.openqa.selenium.remote.DesiredCapabilities;

public class DriverCapabilities {
    private static final String ROOT=System.getProperty("user.dir");
    public enum Devices{
        ANDROID,
        IOS
    }
    private DesiredCapabilities capabilities;
    private void getAndroidCapabilities(){
        capabilities =new DesiredCapabilities();
    }}


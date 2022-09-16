package utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigurationManager {

    public static String getProperty(String propertyName) {
        Properties prop = init_prop();
      return  prop.getProperty(propertyName);
    }

    public  static Properties init_prop() {
        String filePath = "src/main/global.properties";
        Properties prop = new Properties();
        try (
                FileInputStream fis = new FileInputStream(filePath)) {
            prop.load(fis);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return prop;

    }
}

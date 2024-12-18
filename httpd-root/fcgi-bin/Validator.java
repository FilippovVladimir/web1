package web;

public class Validator {

    public static boolean validateX(float x) {
        return x >= -4 && x <= 4;
    }

    public static boolean validateY(float y) {
        return y >= -3 && y <= 3;
    }

    public static boolean validateR(float r) {
        return r >= 1 && r <= 3;
    }
}
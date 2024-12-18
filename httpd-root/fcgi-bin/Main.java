package web;

import com.fastcgi.FCGIInterface;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.logging.FileHandler;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

public class Main {
    private static final String RESPONSE_TEMPLATE = "Content-Type: application/json\nContent-Length: %d\n\n%s";

    public static void main(String[] args) {
        FCGIInterface fcgi = new FCGIInterface();
        while (fcgi.FCGIaccept() >= 0) {
            long startTime = System.currentTimeMillis();
            try {
                String body = readRequestBody();
                if (body == null || body.isEmpty()) {
                    sendJson("{\"error\": \"empty request body\"}");
                    continue; // Пропускаем текущую итерацию, если тело запроса пустое
                }

                HashMap<String, String> params = Parameters.parse(body);

                if (!params.containsKey("x") || !params.containsKey("y") || !params.containsKey("r")) {
                    sendJson("{\"error\": \"missed necessary query param\"}");
                    continue; // Пропускаем, если отсутствуют обязательные параметры
                }

                float x = Float.parseFloat(params.get("x"));
                float y = Float.parseFloat(params.get("y"));
                float r = Float.parseFloat(params.get("r"));

                if (Validator.validateX(x) && Validator.validateY(y) && Validator.validateR(r)) {
                    boolean isInside = Checker.hit(x, y, r);
                    long endTime = System.currentTimeMillis();
                    sendJson(String.format(
                            "{\"result\": %b, \"currentTime\": \"%s\", \"executionTime\": \"%dms\"}",
                            isInside, java.time.LocalDateTime.now(), (endTime - startTime)
                    ));
                } else {
                    sendJson("{\"error\": \"invalid data\"}");
                }
            } catch (Exception e) {
                sendJson(String.format("{\"error\": \"%s\"}", e.toString()));
            }
        }
    }

    private static void sendJson(String jsonDump) {
        System.out.printf(RESPONSE_TEMPLATE + "%n", jsonDump.getBytes(StandardCharsets.UTF_8).length, jsonDump);
    }

    private static String readRequestBody() throws IOException {
        FCGIInterface.request.inStream.fill();
        int contentLength = FCGIInterface.request.inStream.available();
        if (contentLength <= 0) {
            return null; // Возвращаем null, если тело запроса отсутствует
        }
        var buffer = ByteBuffer.allocate(contentLength);
        var readBytes = FCGIInterface.request.inStream.read(buffer.array(), 0, contentLength);
        if (readBytes <= 0) {
            return null; // Возвращаем null, если ничего не было прочитано
        }
        var requestBodyRaw = new byte[readBytes];
        buffer.get(requestBodyRaw);
        buffer.clear();
        return new String(requestBodyRaw, StandardCharsets.UTF_8);
    }
}

import java.io.*;
import java.net.*;
import java.util.concurrent.*;

public class AppServer {
    private static final int PORT = 9000;
     // Your React build folder
    private static final int THREAD_POOL_SIZE = 10; // Adjust based on load

    public static void main(String[] args) {
        ExecutorService threadPool = Executors.newFixedThreadPool(THREAD_POOL_SIZE);
        
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("Server started on http://localhost:" + PORT);
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                threadPool.execute(() -> handleRequest(clientSocket)); // Assign task to thread pool
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            threadPool.shutdown(); // Cleanup when server stops
        }
    }

    private static void handleRequest(Socket clientSocket) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
             OutputStream out = clientSocket.getOutputStream()) {

            String requestLine = in.readLine();
            if (requestLine == null) return;

            String requestedFile = requestLine.split(" ")[1];
            System.out.println(requestedFile);
            if (requestedFile.equals("/")) requestedFile = ".\\UI\\AdminClientPages\\dist\\index.html";
            else{
                requestedFile = ".\\UI\\AdminClientPages\\dist\\"+requestedFile;
            } // Serve React's index.html

            File file = new File(requestedFile);
            if (!file.exists()) {
                send404(out);
                return;
            }

            byte[] fileBytes = readFile(file);
            sendResponse(out, "200 OK", getContentType(requestedFile), fileBytes);

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void send404(OutputStream out) throws IOException {
        String response = "HTTP/1.1 404 Not Found\r\nContent-Length: 13\r\n\r\n404 Not Found";
        out.write(response.getBytes());
        out.flush();
    }

    private static byte[] readFile(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);
        byte[] fileBytes = fis.readAllBytes();
        fis.close();
        return fileBytes;
    }

    private static void sendResponse(OutputStream out, String status, String contentType, byte[] content) throws IOException {
        String headers = "HTTP/1.1 " + status + "\r\nContent-Type: " + contentType + "\r\nContent-Length: " + content.length + "\r\n\r\n";
        out.write(headers.getBytes());
        out.write(content);
        out.flush();
    }

    private static String getContentType(String filePath) {
        if (filePath.endsWith(".html")) return "text/html";
        if (filePath.endsWith(".css")) return "text/css";
        if (filePath.endsWith(".js")) return "application/javascript";
        if (filePath.endsWith(".json")) return "application/json";
        if (filePath.endsWith(".png")) return "image/png";
        if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream"; // Default for unknown types
    }
}

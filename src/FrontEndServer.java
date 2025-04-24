
import java.io.*;
import java.net.*;
import java.nio.file.Files;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class FrontEndServer {
    private static final int API_PORT = 9000;
    private static final String[] SERVERS = {
        "127.0.0.1:8080",
        "127.0.0.1:8081",
        //"127.0.0.1:8082",
        //"127.0.0.1:8083"
    };
    private static int currentServerIndex = 0;
    private static final ExecutorService threadPool = Executors.newFixedThreadPool(15);
    private static final String BASE_DIR = ".\\UI\\LoginPages";
    
    // Change from Socket to session ID as key
    private static ConcurrentHashMap<String, String> sessionBaseDirs = new ConcurrentHashMap<>();

    public static void main(String[] args) {
        try {
            InetAddress bindAddr = InetAddress.getByName("0.0.0.0");
            try (ServerSocket apiServer = new ServerSocket(API_PORT, 50, bindAddr)) {
                System.out.println("API Server running on port " + API_PORT);
                while (true) {
                    Socket apiClient = apiServer.accept();
                    threadPool.execute(() -> handleRequest(apiClient));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    

    private static synchronized String getNextServer() {
        String server = SERVERS[currentServerIndex];
        currentServerIndex = (currentServerIndex + 1) % SERVERS.length;
        return server;
    }

    private static String generateSessionId() {
        return UUID.randomUUID().toString();
    }

    private static String extractSessionId(String cookieHeader) {
        String[] cookies = cookieHeader.substring(cookieHeader.indexOf(':') + 1).split(";");
        for (String cookie : cookies) {
            String[] parts = cookie.trim().split("=");
            if (parts.length == 2 && parts[0].equals("sessionId")) {
                return parts[1];
            }
        }
        return null;
    }

    private static void handleRequest(Socket apiClient) {
        try (BufferedReader in = new BufferedReader(new InputStreamReader(apiClient.getInputStream()));
             OutputStream out = apiClient.getOutputStream()) {
            
            String request = in.readLine();
            if (request == null) {
                apiClient.close();
                return;
            }

            System.out.println("Received Request: " + request);
            
            // Handle OPTIONS preflight request for CORS
            if (request.startsWith("OPTIONS")) {
                handlePreflightRequest(out);
                return;
            }

           
            // Extract session ID from cookies
            String sessionId = null;
            String line;
            boolean isNewSession = false;
            
            // Read all headers
            while ((line = in.readLine()) != null && !line.isEmpty()) {
                if (line.startsWith("Cookie:")) {
                    sessionId = extractSessionId(line);
                    break;
                }
            }
            
            // Create new session if needed
            if (sessionId == null) {
                sessionId = generateSessionId();
                isNewSession = true;
                System.out.println("Created new session: " + sessionId);
            } else {
                System.out.println("Using existing session: " + sessionId);
            }
            
            // Get the base directory for this session
            String currentBaseDir = sessionBaseDirs.getOrDefault(sessionId, BASE_DIR);
            System.out.println("Current Base Directory: " + currentBaseDir);

             // Handle logout request before session creation
            if (request.startsWith("POST /logout") || request.startsWith("GET /logout")) {
                handleLogout(out, sessionId);
                return;
            }

            if (request.startsWith("GET /get-port")) {
                handleApiRequest(out, sessionId, isNewSession);
            } else if (request.startsWith("GET / ")) {
                serveStaticFile("index.html", out, currentBaseDir, sessionId, isNewSession);
            } else if (request.startsWith("GET /")) {
                String filePath = request.split(" ")[1].substring(1);
                if (filePath.isEmpty()) filePath = "index.html";
                serveStaticFile(filePath, out, currentBaseDir, sessionId, isNewSession);
            } else if (request.startsWith("OPTIONS")) {
                handlePreflightRequest(out);
            } else if (request.startsWith("POST /change-context")) {
                handleChangeContext(in, out, sessionId);
            } else {
                send404(out);
            }

            apiClient.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleApiRequest(OutputStream out, String sessionId, boolean isNewSession) throws IOException {
        String server = getNextServer();
        String port = server.split(":")[1];
        
        StringBuilder responseBuilder = new StringBuilder();
        responseBuilder.append("HTTP/1.1 200 OK\r\n");
        responseBuilder.append("Content-Type: application/json\r\n");
        responseBuilder.append("Access-Control-Allow-Origin: *\r\n");
        responseBuilder.append("Access-Control-Allow-Methods: GET, OPTIONS\r\n");
        responseBuilder.append("Access-Control-Allow-Headers: Content-Type\r\n");
        
        // Set session cookie if it's a new session
        if (isNewSession) {
            responseBuilder.append("Set-Cookie: sessionId=").append(sessionId)
                          .append("; Path=/; HttpOnly; SameSite=Strict\r\n");
        }
        
        responseBuilder.append("Connection: keep-alive\r\n");
        responseBuilder.append("\r\n");
        responseBuilder.append("{ \"port\": \"").append(port).append("\", \"sessionId\": \"")
                      .append(sessionId).append("\" }");
        
        out.write(responseBuilder.toString().getBytes());
        out.flush();
    }

    private static void serveStaticFile(String filePath, OutputStream out, String currentBaseDir, 
                                       String sessionId, boolean isNewSession) throws IOException {
        File file = new File(currentBaseDir, filePath);
        if (!file.exists()) {
            send404(out);
            return;
        }

        String contentType = getContentType(filePath);
        byte[] fileData = Files.readAllBytes(file.toPath());
        
        StringBuilder headerBuilder = new StringBuilder();
        headerBuilder.append("HTTP/1.1 200 OK\r\n");
        headerBuilder.append("Content-Type: ").append(contentType).append("\r\n");
        headerBuilder.append("Content-Length: ").append(fileData.length).append("\r\n");
        
        // Set session cookie if it's a new session
        if (isNewSession) {
            headerBuilder.append("Set-Cookie: sessionId=").append(sessionId)
                        .append("; Path=/; HttpOnly; SameSite=Strict\r\n");
        }
        
        headerBuilder.append("Connection: keep-alive\r\n");
        headerBuilder.append("\r\n");
        
        out.write(headerBuilder.toString().getBytes());
        out.write(fileData);
        out.flush();
    }

    private static void handleChangeContext(BufferedReader in, OutputStream out, String sessionId) throws IOException {
        StringBuilder bodyBuilder = new StringBuilder();
        String line;
        int contentLength = 0;
        
        // Read headers to find content length
        while ((line = in.readLine()) != null && !line.isEmpty()) {
            if (line.startsWith("Content-Length:")) {
                contentLength = Integer.parseInt(line.substring("Content-Length:".length()).trim());
            }
        }
        
        // Read body
        for (int i = 0; i < contentLength; i++) {
            bodyBuilder.append((char) in.read());
        }
        
        String body = bodyBuilder.toString();
        System.out.println("Received context switch request: " + body);
        
        // Change base directory for this specific session
        sessionBaseDirs.put(sessionId, ".\\UI\\AdminClientPages\\dist\\");
        
        // Debugging log to verify directory change
        System.out.println("Updated Base Directory for session " + sessionId + ": " + sessionBaseDirs.get(sessionId));
        
        String response = "HTTP/1.1 200 OK\r\n"
                        + "Content-Type: application/json\r\n"
                        + "Set-Cookie: sessionId=" + sessionId + "; Path=/; HttpOnly; SameSite=Strict\r\n"
                        + "Access-Control-Allow-Origin: *\r\n"
                        + "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
                        + "Access-Control-Allow-Headers: Content-Type\r\n"
                        + "\r\n"
                        + "{ \"message\": \"Context switched to AdminClientPages\", \"sessionId\": \"" + sessionId + "\" }";
        
        out.write(response.getBytes());
        out.flush();
    }

    private static void handleLogout(OutputStream out, String sessionId) throws IOException {
        System.out.println("Logout requested for session: " + sessionId);
        
        // Remove session from server-side storage
        if (sessionId != null) {
            sessionBaseDirs.remove(sessionId);
            System.out.println("Session invalidated: " + sessionId);
        }
        
        // Prepare response with cookie clearing
        StringBuilder responseBuilder = new StringBuilder();
        responseBuilder.append("HTTP/1.1 200 OK\r\n");
        responseBuilder.append("Content-Type: application/json\r\n");
        
        // Set expired cookie to remove it from browser
        responseBuilder.append("Set-Cookie: sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax\r\n");
        
        // Add Clear-Site-Data header to clear browser storage
        responseBuilder.append("Clear-Site-Data: \"cookies\", \"storage\"\r\n");
        
        // Since both frontend and backend are on the same origin, we don't need specific CORS headers
        // But we'll keep them for consistency with the rest of your code
        responseBuilder.append("Access-Control-Allow-Origin: http://192.168.67.185:9000\r\n");
        responseBuilder.append("Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n");
        responseBuilder.append("Access-Control-Allow-Headers: Content-Type\r\n");
        
        // Add content length for the response body
        String responseBody = "{ \"message\": \"Logged out successfully\" }";
        responseBuilder.append("Content-Length: ").append(responseBody.getBytes().length).append("\r\n");
        responseBuilder.append("\r\n");
        responseBuilder.append(responseBody);
        
        out.write(responseBuilder.toString().getBytes());
        out.flush();
    }
    

    private static void handlePreflightRequest(OutputStream out) throws IOException {
        String preflightResponse = "HTTP/1.1 204 No Content\r\n"
                                + "Access-Control-Allow-Origin: *\r\n"
                                + "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                                + "Access-Control-Allow-Headers: Content-Type\r\n"
                                + "Connection: keep-alive\r\n"
                                + "\r\n";
        out.write(preflightResponse.getBytes());
        out.flush();
    }

    // private static void handlePreflightRequest (OutputStream out) throws IOException {
    //     String preflightResponse = "HTTP/1.1 204 No Content\r\n"
    //                             + "Access-Control-Allow-Origin: http://localhost:9000\r\n"
    //                             + "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
    //                             + "Access-Control-Allow-Headers: Content-Type\r\n"
    //                             + "Access-Control-Allow-Credentials: true\r\n"
    //                             + "Access-Control-Max-Age: 86400\r\n"
    //                             + "\r\n";
    //     out.write(preflightResponse.getBytes());
    //     out.flush();
    // }
    

    private static void send404(OutputStream out) throws IOException {
        String response = "HTTP/1.1 404 Not Found\r\n"
                        + "Content-Type: text/plain\r\n"
                        + "Content-Length: 13\r\n"
                        + "\r\n"
                        + "404 Not Found";
        out.write(response.getBytes());
        out.flush();
    }

    private static String getContentType(String filePath) {
        if (filePath.endsWith(".html") || filePath.endsWith(".htm")) return "text/html";
        if (filePath.endsWith(".css")) return "text/css";
        if (filePath.endsWith(".js")) return "application/javascript";
        if (filePath.endsWith(".json")) return "application/json";
        if (filePath.endsWith(".xml")) return "application/xml";
        if (filePath.endsWith(".txt")) return "text/plain";
        if (filePath.endsWith(".csv")) return "text/csv";
        if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) return "image/jpeg";
        if (filePath.endsWith(".png")) return "image/png";
        if (filePath.endsWith(".gif")) return "image/gif";
        if (filePath.endsWith(".bmp")) return "image/bmp";
        if (filePath.endsWith(".svg")) return "image/svg+xml";
        if (filePath.endsWith(".ico")) return "image/x-icon";
        if (filePath.endsWith(".mp3")) return "audio/mpeg";
        if (filePath.endsWith(".wav")) return "audio/wav";
        if (filePath.endsWith(".ogg")) return "audio/ogg";
        if (filePath.endsWith(".mp4")) return "video/mp4";
        if (filePath.endsWith(".webm")) return "video/webm";
        if (filePath.endsWith(".avi")) return "video/x-msvideo";
        if (filePath.endsWith(".pdf")) return "application/pdf";
        if (filePath.endsWith(".zip")) return "application/zip";
        if (filePath.endsWith(".tar")) return "application/x-tar";
        if (filePath.endsWith(".gz")) return "application/gzip";
        if (filePath.endsWith(".rar")) return "application/vnd.rar";
        if (filePath.endsWith(".woff")) return "font/woff";
        if (filePath.endsWith(".woff2")) return "font/woff2";
        if (filePath.endsWith(".ttf")) return "font/ttf";
        if (filePath.endsWith(".otf")) return "font/otf";
        return "application/octet-stream";
    }
}


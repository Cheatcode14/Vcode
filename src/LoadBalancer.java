import java.io.*;
import java.net.*;
import java.util.*;

public class LoadBalancer {
    private static final int LB_PORT = 9000; // Load Balancer listens on this port
    private static final String LB_HOST = "0.0.0.0"; // Listen on all interfaces
    private static final List<String> SERVERS = Arrays.asList(
        "127.0.0.1:8080"
        
    );
    private static int currentServerIndex = 0;

    public static void main(String[] args) throws IOException {
        ServerSocket serverSocket = new ServerSocket(LB_PORT, 50, InetAddress.getByName(LB_HOST));
        System.out.println("Load Balancer running on " + LB_HOST + ":" + LB_PORT);

        while (true) {
            Socket clientSocket = serverSocket.accept();
            new Thread(new ClientHandler(clientSocket)).start();
        }
    }

    private static class ClientHandler implements Runnable {
        private Socket clientSocket;

        public ClientHandler(Socket clientSocket) {
            this.clientSocket = clientSocket;
        }

        @Override
        public void run() {
            try {
                String serverAddress = getNextServer();
                String[] parts = serverAddress.split(":");
                String host = parts[0];
                int port = Integer.parseInt(parts[1]);
                
                Socket serverSocket = new Socket(host, port);
                
                InputStream clientIn = clientSocket.getInputStream();
                OutputStream clientOut = clientSocket.getOutputStream();
                InputStream serverIn = serverSocket.getInputStream();
                OutputStream serverOut = serverSocket.getOutputStream();
                
                Thread clientToServer = new Thread(() -> relay(clientIn, serverOut));
                Thread serverToClient = new Thread(() -> relay(serverIn, clientOut));
                
                clientToServer.start();
                serverToClient.start();
                
                clientToServer.join();
                serverToClient.join();

                clientSocket.close();
                serverSocket.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private static synchronized String getNextServer() {
        String server = SERVERS.get(currentServerIndex);
        currentServerIndex = (currentServerIndex + 1) % SERVERS.size();
        return server;
    }

    private static void relay(InputStream in, OutputStream out) {
        try {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
                out.flush();
            }
        } catch (IOException e) {
            // Connection closed
        }
    }
}

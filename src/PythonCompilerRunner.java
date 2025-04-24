import java.io.*;

public class PythonCompilerRunner {

    // Static utility method to run a Python script with optional test input
    public static String run(String filePath, String testInput) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder("python", filePath);
        processBuilder.redirectErrorStream(true); // combine stdout and stderr
        Process process = processBuilder.start();

        // If test input is provided, write it to process's stdin
        if (testInput != null && !testInput.isEmpty()) {
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(testInput);
                writer.flush();
            }
        }

        // Capture output from process
        StringBuilder output = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
        }

        int exitCode = process.waitFor();
        output.append("Exited with code: ").append(exitCode);
        return output.toString().trim();
    }
}
    
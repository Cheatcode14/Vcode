import java.io.*;
import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

public class JavaFileCompiler {
    public static String compileAndRun(String filePath, String userInput) {
        File javaFile = new File(filePath);
        if (!javaFile.exists() || !filePath.endsWith(".java")) {
            return "Error: Invalid Java file path.";
        }

        String className = getClassName(javaFile);

        // Step 1: Compile the Java file
        String compileOutput = compileJavaFile(filePath);
        if (!compileOutput.isEmpty()) {
            return "Compilation failed:\n" + compileOutput;
        }

        // Step 2: Run the compiled Java class with user input
        return runJavaClass(className, userInput);
    }

    // Method to compile Java file
    private static String compileJavaFile(String filePath) {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        if (compiler == null) {
            return "No Java Compiler found. Ensure you are running with JDK, not JRE.";
        }

        ByteArrayOutputStream errorStream = new ByteArrayOutputStream();
        int result = compiler.run(null, null, new PrintStream(errorStream), filePath);

        return result == 0 ? "" : errorStream.toString();
    }

    // Method to run the compiled Java class with user input
    private static String runJavaClass(String className, String userInput) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("java", className);
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            // Write user input to the program's stdin
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(userInput);
                writer.newLine();
                writer.flush();
            }

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            process.waitFor();
            return output.toString().isEmpty() ? "No output or runtime error occurred." : output.toString();
        } catch (Exception e) {
            return "Runtime error: " + e.getMessage();
        }
    }

    // Extract class name from Java file name
    private static String getClassName(File javaFile) {
        String fileName = javaFile.getName();
        return fileName.substring(0, fileName.lastIndexOf("."));
    }
}

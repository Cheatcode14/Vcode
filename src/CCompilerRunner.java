
import java.io.*;

public class CCompilerRunner {

    public CCompilerRunner() {
    }

    public static String run(String sourceFile, String input) throws IOException, InterruptedException {
        // Step 1: Compile the C code
        ProcessBuilder compileProcessBuilder = new ProcessBuilder("gcc", sourceFile, "-o", "cmain");
        compileProcessBuilder.redirectErrorStream(true);
        Process compileProcess = compileProcessBuilder.start();
    
        BufferedReader compileReader = new BufferedReader(new InputStreamReader(compileProcess.getInputStream()));
        StringBuilder compileOutput = new StringBuilder();
        String line;
        while ((line = compileReader.readLine()) != null) {
            compileOutput.append(line).append("\n");
        }
        compileReader.close();
    
        int compileExitCode = compileProcess.waitFor();
        if (compileExitCode != 0) {
            return "Compilation failed:\n" + compileOutput.toString();
        }
    
        // Step 2: Run the compiled executable
        ProcessBuilder runProcessBuilder = new ProcessBuilder("./cmain");
        runProcessBuilder.redirectErrorStream(true);
        Process runProcess = runProcessBuilder.start();
    
        // Step 3: Send input if available
        if (input != null && !input.isEmpty()) {
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()));
            writer.write(input);
            writer.flush();
            writer.close();
        }
    
        // Step 4: Read output
        BufferedReader outputReader = new BufferedReader(new InputStreamReader(runProcess.getInputStream()));
        StringBuilder output = new StringBuilder();
        while ((line = outputReader.readLine()) != null) {
            output.append(line).append("\n");
        }
        outputReader.close();
    
        int runExitCode = runProcess.waitFor();
        output.append("Exited with code: ").append(runExitCode);
    
        return output.toString().trim();
    }    
}



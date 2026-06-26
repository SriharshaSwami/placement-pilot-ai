class CodeExecutionService {
  /**
   * Stub for isolated code execution.
   * Currently, it simply returns a simulated output.
   * In the future, this exact interface can wrap a call to Judge0 or a Docker Sandbox.
   */
  async runCode(language, code, expectedOutput) {
    // Simulate a slight delay to mimic compilation/execution
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For safety, we DO NOT execute the code natively using child_process.exec() or eval().
    return {
      success: true,
      stdout: 'Code execution stubbed. AI static evaluation will grade the logic.',
      stderr: '',
      compile_output: '',
      execution_time: '0.00s',
      memory: '0 KB',
    };
  }
}

export default new CodeExecutionService();

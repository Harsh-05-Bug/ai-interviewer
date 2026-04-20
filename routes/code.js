const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

router.post('/run-code', (req, res) => {
  const { language, code, stdin } = req.body;
  if (!language || !code) {
    return res.status(400).json({ stdout: '', stderr: 'Missing language or code.' });
  }

  const isWin = process.platform === 'win32';
  const pyCmd = isWin ? 'python' : 'python3';

  const configs = {
    python:     { ext: 'py',    cmd: (f) => `${pyCmd} "${f}"` },
    javascript: { ext: 'js',    cmd: (f) => `node "${f}"` },
    typescript: { ext: 'ts',    cmd: (f) => `npx ts-node "${f}"` },
    java:       { ext: 'java',  cmd: (f) => isWin ? `cd /d "${path.dirname(f)}" && javac Main.java && java Main` : `cd "${path.dirname(f)}" && javac Main.java && java Main` },
    c:          { ext: 'c',     cmd: (f) => `gcc "${f}" -o "${f}.out" && "${f}.out"` },
    cpp:        { ext: 'cpp',   cmd: (f) => `g++ "${f}" -o "${f}.out" && "${f}.out"` },
    csharp:     { ext: 'cs',    cmd: (f) => `dotnet-script "${f}"` },
    go:         { ext: 'go',    cmd: (f) => `go run "${f}"` },
    rust:       { ext: 'rs',    cmd: (f) => `rustc "${f}" -o "${f}.out" && "${f}.out"` },
    ruby:       { ext: 'rb',    cmd: (f) => `ruby "${f}"` },
    php:        { ext: 'php',   cmd: (f) => `php "${f}"` },
    bash:       { ext: 'sh',    cmd: (f) => `bash "${f}"` },
    kotlin:     { ext: 'kts',   cmd: (f) => `kotlinc-jvm -script "${f}"` },
    swift:      { ext: 'swift', cmd: (f) => `swift "${f}"` },
    r:          { ext: 'r',     cmd: (f) => `Rscript "${f}"` },
  };

  const cfg = configs[language];
  if (!cfg) return res.json({ stdout: '', stderr: `Language "${language}" not supported.` });

  const tmpDir = path.join(__dirname, '..', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

  const fileName = language === 'java' ? 'Main' : `code_${Date.now()}`;
  const filePath = path.join(tmpDir, `${fileName}.${cfg.ext}`);

  try {
    fs.writeFileSync(filePath, code);

    const child = exec(
      cfg.cmd(filePath),
      { timeout: 10000, shell: true },
      (err, stdout, stderr) => {
        try { fs.unlinkSync(filePath); } catch (e) {}
        try { fs.unlinkSync(filePath + '.out'); } catch (e) {}
        if (err && !stdout && !stderr) {
          return res.json({ stdout: '', stderr: err.message });
        }
        res.json({ stdout: stdout || '', stderr: stderr || '' });
      }
    );

    if (child.stdin) {
      if (stdin) child.stdin.write(stdin + '\n');
      child.stdin.end();
    }
  } catch (e) {
    try { fs.unlinkSync(filePath); } catch (_) {}
    res.json({ stdout: '', stderr: e.message });
  }
});

module.exports = router;
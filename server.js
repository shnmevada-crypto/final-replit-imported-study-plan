// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Where PDF files live
const PAPERS_DIR = path.join(__dirname, 'papers');
if (!fs.existsSync(PAPERS_DIR)) fs.mkdirSync(PAPERS_DIR);

// Simple in-memory / file-backed DB for papers metadata
const METADATA_FILE = path.join(__dirname, 'papers_metadata.json');

// If metadata file doesn't exist, bootstrap 110 sample entries.
// NOTE: you should replace sample entries with real filenames (and upload real PDFs to /papers)
if (!fs.existsSync(METADATA_FILE)) {
  const sampleSubjects = ['Maths', 'English', 'Science', 'Physics', 'History'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const boards = ['AQA', 'OCR', 'Edexcel', 'GCSE'];
  const papers = [];
  for (let i = 1; i <= 110; i++) {
    const subj = sampleSubjects[i % sampleSubjects.length];
    const diff = difficulties[i % difficulties.length];
    const board = boards[i % boards.length];
    // default filename - put matching PDF into /papers or rename accordingly
    const filename = `paper_${i}.pdf`;
    papers.push({
      id: i,
      title: `${subj} Paper ${2010 + (i % 15)} - Q${i}`,
      subject: subj,
      difficulty: diff,
      board,
      filename,
    });

    // create a small placeholder PDF-like file (actually a text file with .pdf extension)
    // This is only to make preview/download work while you add real PDFs.
    const samplePath = path.join(PAPERS_DIR, filename);
    if (!fs.existsSync(samplePath)) {
      fs.writeFileSync(samplePath, `Placeholder for ${subj} Paper ${i}\nReplace this file with the actual PDF named ${filename}`);
    }
  }
  fs.writeFileSync(METADATA_FILE, JSON.stringify(papers, null, 2));
}

// helper: load metadata
function loadPapers() {
  try {
    return JSON.parse(fs.readFileSync(METADATA_FILE));
  } catch (e) {
    return [];
  }
}

// --- API routes

// list papers with metadata (supports optional query params for subject/difficulty/board)
app.get('/api/papers', (req, res) => {
  const q = req.query || {};
  const all = loadPapers();
  const filtered = all.filter((p) => {
    if (q.subject && q.subject !== 'All' && p.subject !== q.subject) return false;
    if (q.difficulty && q.difficulty !== 'All' && p.difficulty !== q.difficulty) return false;
    if (q.board && q.board !== 'All' && p.board !== q.board) return false;
    return true;
  });
  res.json(filtered);
});

// serve the paper for preview/download
app.get('/api/papers/:id/download', (req, res) => {
  const id = Number(req.params.id);
  const papers = loadPapers();
  const paper = papers.find((p) => p.id === id);
  if (!paper) return res.status(404).json({ error: 'Paper not found' });

  const filePath = path.join(PAPERS_DIR, paper.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server. Upload it to /papers' });

  // set headers for inline preview & download
  res.setHeader('Content-Type', 'application/pdf');
  // Content-disposition inline so browser previews; user can still download
  res.setHeader('Content-Disposition', `inline; filename="${paper.filename}"`);
  res.sendFile(filePath);
});

// simulated auto-marking endpoint
app.post('/api/papers/:id/mark', (req, res) => {
  // req.body could contain answers; we ignore and simulate
  function simulateMark() {
    const total = 10;
    let correct = 0;
    for (let i = 0; i < total; i++) if (Math.random() > 0.4) correct++;
    const score = Math.round((correct / total) * 100);
    const feedback = score > 75 ? 'Great work — strong understanding!' : score > 50 ? 'Good — revise weak areas.' : 'Focus on fundamentals.';
    return { score, feedback, correct, total };
  }
  const result = simulateMark();
  // optionally, persist results in logs
  const logsFile = path.join(__dirname, 'mark_logs.json');
  const entry = { time: new Date().toISOString(), paperId: Number(req.params.id), result };
  let logs = [];
  try {
    logs = JSON.parse(fs.readFileSync(logsFile));
  } catch (e) {}
  logs.push(entry);
  fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
  res.json(result);
});

// track resources (simple)
app.post('/api/track', (req, res) => {
  const { url, userId } = req.body || {};
  if (!url) return res.status(400).json({ error: 'Missing url' });
  const trackFile = path.join(__dirname, 'resource_clicks.json');
  let clicks = {};
  try {
    clicks = JSON.parse(fs.readFileSync(trackFile));
  } catch (e) {}
  clicks[url] = (clicks[url] || 0) + 1;
  fs.writeFileSync(trackFile, JSON.stringify(clicks, null, 2));
  res.json({ ok: true, url, count: clicks[url] });
});

// resources list endpoint (returns full resource list)
app.get('/api/resources', (req, res) => {
  const resources = [
    { name: 'BBC Bitesize', url: 'https://www.bbc.co.uk/bitesize' },
    { name: 'Save My Exams', url: 'https://www.savemyexams.co.uk' },
    { name: 'Seneca Learning', url: 'https://www.senecalearning.com' },
    { name: 'Maths Genie', url: 'https://www.mathsgenie.co.uk' },
    { name: 'Cognito', url: 'https://www.cognito.org.uk' },
    { name: 'Quizlet', url: 'https://quizlet.com' },
    { name: 'Gojimo', url: 'https://gojimo.com' },
    { name: 'Free Science Lessons', url: 'https://www.freesciencelessons.co.uk' },
    { name: 'Mr Salles', url: 'https://mrsalles.co.uk' },
    { name: 'Mr Bruff', url: 'https://mrbruff.com' },
    { name: \"Craig 'n' Dave\", url: 'https://www.craigndave.org' },
    { name: 'Corbettmaths', url: 'https://corbettmaths.com' },
    { name: 'TLMaths', url: 'https://tlmaths.co.uk' },
    { name: 'Physics and Maths Tutor', url: 'https://www.physicsandmathstutor.com' },
    { name: 'Tes', url: 'https://www.tes.com' }
  ];
  res.json(resources);
});

// Serve static site if present (optional) and allow /papers static access (for direct link fallback)
app.use('/papers', express.static(PAPERS_DIR));

// start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Study server listening on ${PORT}`));

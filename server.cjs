const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use('/api', router);

// Custom middleware for handling lesson updates (drag-and-drop)
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'PUT' && req.path.startsWith('/api/lessons')) {
    // Handle lesson order updates
    console.log('Updating lesson:', req.body);
  }
  next();
});

const PORT = process.env.PORT || 3001;

// Collaborative filtering recommendations and video interactions
server.get('/api/recommendations/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const fs = require('fs');
    const path = require('path');
    const DB_PATH = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    const submissions = db['quiz_submissions'] || [];
    const interactions = db['videoInteractions'] || [];
    const videos = db['youtubeVideos'] || [];

    const userSubmissions = submissions.filter(s => s.userId === userId);
    if (userSubmissions.length === 0) {
      return res.json({ recommendations: videos.slice(0,10) });
    }
    const latest = userSubmissions[userSubmissions.length-1];
    const userVector = {};
    if (latest.topicPerformance) {
      Object.keys(latest.topicPerformance).forEach(t => {
        const perf = latest.topicPerformance[t];
        userVector[t] = Math.round((perf.correct / Math.max(1, perf.total)) * 100);
      });
    }

    const otherUsers = {};
    submissions.forEach(sub => {
      if (sub.userId === userId) return;
      const lp = sub.topicPerformance || {};
      if (!otherUsers[sub.userId] || new Date(sub.submittedAt) > new Date(otherUsers[sub.userId].submittedAt)) {
        otherUsers[sub.userId] = { topicPerformance: lp, submittedAt: sub.submittedAt };
      }
    });

    function cosineSim(a, b) {
      const topics = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
      let dot = 0, na = 0, nb = 0;
      topics.forEach(t => {
        const va = a[t] || 0;
        const vb = b[t] || 0;
        dot += va * vb;
        na += va * va;
        nb += vb * vb;
      });
      if (na === 0 || nb === 0) return 0;
      return dot / (Math.sqrt(na) * Math.sqrt(nb));
    }

    const sims = [];
    Object.keys(otherUsers).forEach(ou => {
      const vec = {};
      const lp = otherUsers[ou].topicPerformance || {};
      Object.keys(lp).forEach(t => {
        vec[t] = Math.round((lp[t].correct / Math.max(1, lp[t].total)) * 100);
      });
      const sim = cosineSim(userVector, vec);
      if (sim > 0) sims.push({ userId: ou, sim });
    });
    sims.sort((a,b)=>b.sim - a.sim);

    const recommended = [];
    const consideredVideoIds = new Set();
    const topK = sims.slice(0,5).map(s => s.userId);

    topK.forEach(ou => {
      interactions.filter(i => i.userId === ou && i.liked).forEach(iv => {
        if (!consideredVideoIds.has(iv.videoId)) {
          const v = videos.find(x => x.id === iv.videoId);
          if (v) { recommended.push(v); consideredVideoIds.add(iv.videoId); }
        }
      });
    });

    if (recommended.length < 5) {
      const weak = Object.keys(userVector).sort((a,b)=>userVector[a]-userVector[b]).slice(0,3);
      const fallback = videos.filter(v => weak.includes(v.topic) || weak.some(w=>v.title.includes(w))).filter(v=>!consideredVideoIds.has(v.id));
      fallback.slice(0, 10 - recommended.length).forEach(v => { recommended.push(v); consideredVideoIds.add(v.id); });
    }

    return res.json({ recommendations: recommended.slice(0,10) });
  } catch (e) {
    console.error('recommendations error', e);
    return res.status(500).json({ error: 'recommendations failed', details: String(e) });
  }
});

server.post('/api/videoInteractions', (req, res) => {
  try {
    const payload = req.body;
    const fs = require('fs');
    const path = require('path');
    const DB_PATH = path.join(__dirname, 'db.json');
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    db['videoInteractions'] = db['videoInteractions'] || [];
    db['videoInteractions'].push({ ...payload, createdAt: new Date().toISOString() });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
    return res.json({ status: 'ok' });
  } catch (e) {
    console.error('videoInteractions error', e);
    return res.status(500).json({ error: 'failed' });
  }
});


server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
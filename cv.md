---
layout: page
title: Curriculum Vitae
excerpt: "Download or view my CV"
tags: [CV, resume, curriculum vitae]
image:
  feature:
---

<div class="cv-container">
  <div class="cv-header">
    <h2>Curriculum Vitae</h2>
    <p>You can view my CV below or download it directly.</p>
    
    <div class="cv-actions">
      <a href="/cv/HiepHoang_AI_Engineer.pdf" class="btn-download" download>
        <i class="fa fa-download"></i> Download CV (PDF)
      </a>
      <a href="/cv/HiepHoang_AI_Engineer.pdf" class="btn-view" target="_blank">
        <i class="fa fa-external-link"></i> Open in New Tab
      </a>
    </div>
  </div>

  <div class="cv-viewer">
    <object data="/cv/HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px">
      <embed src="/cv/HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px" />
      <div class="pdf-fallback">
        <p>It appears your browser doesn't support PDF viewing.</p>
        <p>No worries! You can:</p>
        <ul>
          <li><a href="/cv/HiepHoang_AI_Engineer.pdf" target="_blank"><strong>Open PDF in new tab</strong></a></li>
          <li><a href="/cv/HiepHoang_AI_Engineer.pdf" download><strong>Download PDF directly</strong></a></li>
        </ul>
      </div>
    </object>
  </div>
</div>

<style>
.cv-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.cv-header {
  text-align: center;
  margin-bottom: 30px;
}

.cv-header h2 {
  color: #333;
  margin-bottom: 10px;
}

.cv-header p {
  color: #666;
  margin-bottom: 20px;
}

.cv-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn-download, .btn-view {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-download {
  background: #007acc;
  color: white;
}

.btn-download:hover {
  background: #005a99;
  transform: translateY(-2px);
}

.btn-view {
  background: #f8f8f8;
  color: #333;
  border: 2px solid #ddd;
}

.btn-view:hover {
  background: #e8e8e8;
  transform: translateY(-2px);
}

.cv-viewer {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.pdf-fallback {
  text-align: center;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.pdf-fallback ul {
  list-style: none;
  padding: 0;
}

.pdf-fallback li {
  margin: 10px 0;
}

.pdf-fallback a {
  color: #007acc;
  text-decoration: none;
  font-weight: bold;
}

.pdf-fallback a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .cv-container {
    padding: 10px;
  }
  
  .cv-viewer object,
  .cv-viewer embed {
    height: 600px;
  }
  
  .cv-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-download, .btn-view {
    width: 200px;
    justify-content: center;
  }
}
</style>

<script>
// Additional fallback for browsers that don't support object/embed
document.addEventListener('DOMContentLoaded', function() {
  // Check if PDF viewing is supported
  setTimeout(function() {
    const object = document.querySelector('object');
    if (object && object.clientHeight === 0) {
      // If object failed to load, show fallback
      object.style.display = 'none';
      const fallback = document.querySelector('.pdf-fallback');
      if (fallback) {
        fallback.style.display = 'block';
      }
    }
  }, 1000);
});
</script>


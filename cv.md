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
      <button class="btn-toggle" onclick="toggleViewer()">
        <i class="fa fa-refresh"></i> Try Different Viewer
      </button>
    </div>
  </div>

  <!-- Method 1: Google Docs Viewer -->
  <div class="cv-viewer" id="viewer-google">
    <iframe src="https://docs.google.com/viewer?url=https://hiepbk.github.io/cv/HiepHoang_AI_Engineer.pdf&embedded=true" 
            width="100%" 
            height="800px" 
            style="border: none; border-radius: 8px;">
      <p>Loading PDF viewer...</p>
    </iframe>
  </div>

  <!-- Method 2: Direct PDF Object -->
  <div class="cv-viewer" id="viewer-direct" style="display: none;">
    <object data="/cv/HiepHoang_AI_Engineer.pdf#toolbar=1&navpanes=1&scrollbar=1" 
            type="application/pdf" 
            width="100%" 
            height="800px">
      <embed src="/cv/HiepHoang_AI_Engineer.pdf#toolbar=1&navpanes=1&scrollbar=1" 
             type="application/pdf" 
             width="100%" 
             height="800px" />
      <div class="pdf-fallback">
        <h3>PDF Viewer Not Available</h3>
        <p>Your browser cannot display this PDF directly.</p>
        <div class="fallback-options">
          <a href="/cv/HiepHoang_AI_Engineer.pdf" target="_blank" class="fallback-btn">
            <i class="fa fa-external-link"></i> Open PDF in New Tab
          </a>
          <a href="/cv/HiepHoang_AI_Engineer.pdf" download class="fallback-btn">
            <i class="fa fa-download"></i> Download PDF
          </a>
        </div>
      </div>
    </object>
  </div>

  <!-- Method 3: PDF.js Viewer -->
  <div class="cv-viewer" id="viewer-pdfjs" style="display: none;">
    <iframe src="https://mozilla.github.io/pdf.js/web/viewer.html?file=https://hiepbk.github.io/cv/HiepHoang_AI_Engineer.pdf" 
            width="100%" 
            height="800px" 
            style="border: none; border-radius: 8px;">
      <p>Loading PDF.js viewer...</p>
    </iframe>
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
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.btn-download, .btn-view, .btn-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 14px;
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
  background: #28a745;
  color: white;
}

.btn-view:hover {
  background: #218838;
  transform: translateY(-2px);
}

.btn-toggle {
  background: #6c757d;
  color: white;
}

.btn-toggle:hover {
  background: #545b62;
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
  padding: 60px 20px;
  background: #fff;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.pdf-fallback h3 {
  color: #333;
  margin-bottom: 15px;
}

.fallback-options {
  margin-top: 20px;
}

.fallback-btn {
  display: inline-block;
  margin: 10px;
  padding: 12px 24px;
  background: #007acc;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: bold;
  transition: all 0.2s;
}

.fallback-btn:hover {
  background: #005a99;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .cv-container {
    padding: 10px;
  }
  
  .cv-viewer iframe,
  .cv-viewer object,
  .cv-viewer embed {
    height: 600px;
  }
  
  .cv-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-download, .btn-view, .btn-toggle {
    width: 200px;
    justify-content: center;
  }
}
</style>

<script>
let currentViewer = 0;
const viewers = ['viewer-google', 'viewer-direct', 'viewer-pdfjs'];
const viewerNames = ['Google Docs Viewer', 'Direct PDF Viewer', 'PDF.js Viewer'];

function toggleViewer() {
  // Hide current viewer
  document.getElementById(viewers[currentViewer]).style.display = 'none';
  
  // Move to next viewer
  currentViewer = (currentViewer + 1) % viewers.length;
  
  // Show next viewer
  document.getElementById(viewers[currentViewer]).style.display = 'block';
  
  // Update button text
  const nextViewer = (currentViewer + 1) % viewers.length;
  document.querySelector('.btn-toggle').innerHTML = 
    '<i class="fa fa-refresh"></i> Try ' + viewerNames[nextViewer];
  
  console.log('Switched to: ' + viewerNames[currentViewer]);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set initial button text
  document.querySelector('.btn-toggle').innerHTML = 
    '<i class="fa fa-refresh"></i> Try ' + viewerNames[1];
  
  // Test if Google Docs viewer loads
  setTimeout(function() {
    const googleViewer = document.querySelector('#viewer-google iframe');
    googleViewer.onload = function() {
      console.log('Google Docs viewer loaded successfully');
    };
    googleViewer.onerror = function() {
      console.log('Google Docs viewer failed, switching to direct viewer');
      toggleViewer();
    };
  }, 2000);
});
</script>


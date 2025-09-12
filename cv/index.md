---
layout: page
title: Curriculum Vitae
excerpt: "Download or view my CV"
tags: [CV, resume, curriculum vitae]
comments: true
image: 
---

{% include _toc.html %}

<div class="cv-container">
  <div class="cv-header">
    <h2>Curriculum Vitae</h2>
    <p>You can download my CV or open it in a new tab for viewing.</p>
    
    <div class="cv-actions">
      <a href="HiepHoang_AI_Engineer.pdf" class="btn-download" download>
        <i class="fa fa-download"></i> Download CV (PDF)
      </a>
      <a href="HiepHoang_AI_Engineer.pdf" class="btn-view" target="_blank">
        <i class="fa fa-external-link"></i> Open PDF in New Tab
      </a>
    </div>
  </div>

  <div class="cv-viewer">
    <div class="pdf-container">
      <object data="HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px">
        <embed src="HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px" />
        <div class="pdf-fallback">
          <h3>PDF Viewer Not Available</h3>
          <p>Your browser cannot display this PDF directly.</p>
          <div class="fallback-options">
            <a href="HiepHoang_AI_Engineer.pdf" target="_blank" class="fallback-btn">
              <i class="fa fa-external-link"></i> Open PDF in New Tab
            </a>
            <a href="HiepHoang_AI_Engineer.pdf" download class="fallback-btn">
              <i class="fa fa-download"></i> Download PDF
            </a>
          </div>
        </div>
      </object>
    </div>
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
  background: #28a745;
  color: white;
}

.btn-view:hover {
  background: #218838;
  transform: translateY(-2px);
}

.cv-viewer {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.pdf-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.pdf-fallback {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
  border: 2px dashed #ddd;
  border-radius: 8px;
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
  
  .cv-viewer {
    padding: 15px;
  }
  
  .cv-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-download, .btn-view {
    width: 200px;
    justify-content: center;
  }
  
  .pdf-container object,
  .pdf-container embed {
    height: 600px;
  }
}
</style>


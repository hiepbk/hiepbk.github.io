---
layout: page
title: Curriculum Vitae
excerpt: "Download or view my CV"
tags: [CV, resume, curriculum vitae]
comments: true
---

{% include _toc.html %}

<div class="cv-container">
  <div class="cv-viewer">
    <div class="pdf-container">
      <object data="HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px">
        <embed src="HiepHoang_AI_Engineer.pdf" type="application/pdf" width="100%" height="800px" />
        <div class="pdf-fallback">
          <h3>PDF Viewer Not Available</h3>
          <p>Your browser cannot display this PDF directly.</p>
          <p><a href="HiepHoang_AI_Engineer.pdf" target="_blank">Click here to download the PDF</a></p>
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
  
  .cv-viewer {
    padding: 15px;
  }
  
  .pdf-container object,
  .pdf-container embed {
    height: 600px;
  }
}
</style>


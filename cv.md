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
    <p>You can view my CV below or download the PDF version.</p>
    
    <div class="cv-actions">
      <a href="/cv/HiepHoang_AI_Engineer.pdf" class="btn-download" download>
        <i class="fa fa-download"></i> Download CV (PDF)
      </a>
      <a href="/cv/HiepHoang_AI_Engineer.pdf" class="btn-view" target="_blank">
        <i class="fa fa-external-link"></i> Open PDF in New Tab
      </a>
    </div>
  </div>

  <div class="cv-viewer">
    <div class="cv-pages">
      <div class="cv-page">
        <img src="/cv/HiepHoang_AI_Engineer-images-0.jpg" alt="CV Page 1" class="cv-page-image">
      </div>
      
      <div class="cv-page">
        <img src="/cv/HiepHoang_AI_Engineer-images-1.jpg" alt="CV Page 2" class="cv-page-image">
      </div>
      
      <div class="cv-page">
        <img src="/cv/HiepHoang_AI_Engineer-images-2.jpg" alt="CV Page 3" class="cv-page-image">
      </div>
      
      <div class="cv-page">
        <img src="/cv/HiepHoang_AI_Engineer-images-3.jpg" alt="CV Page 4" class="cv-page-image">
      </div>
    </div>
    
    <div class="cv-footer">
      <p><i class="fa fa-info-circle"></i> Click on any image to view it in full size</p>
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

.cv-pages {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.cv-page {
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.cv-page:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.cv-page-image {
  width: 100%;
  max-width: 800px;
  height: auto;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.cv-page-image:hover {
  transform: scale(1.02);
}

.cv-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-style: italic;
}

/* Lightbox styles */
.lightbox {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.9);
  cursor: pointer;
}

.lightbox img {
  display: block;
  margin: auto;
  max-width: 95%;
  max-height: 95%;
  margin-top: 2.5%;
  border-radius: 8px;
}

.lightbox .close {
  position: absolute;
  top: 15px;
  right: 35px;
  color: #f1f1f1;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}

.lightbox .close:hover {
  color: #bbb;
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
  
  .cv-page {
    padding: 5px;
  }
  
  .lightbox img {
    max-width: 98%;
    max-height: 98%;
    margin-top: 1%;
  }
}
</style>

<!-- Lightbox for full-size viewing -->
<div id="lightbox" class="lightbox" onclick="closeLightbox()">
  <span class="close">&times;</span>
  <img id="lightbox-img" src="" alt="CV Full Size">
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  // Add click event to all CV images
  const cvImages = document.querySelectorAll('.cv-page-image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  cvImages.forEach(function(img) {
    img.addEventListener('click', function() {
      lightbox.style.display = 'block';
      lightboxImg.src = this.src;
      lightboxImg.alt = this.alt + ' - Full Size';
    });
  });
  
  // Close lightbox when clicking outside the image
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
});

function closeLightbox() {
  document.getElementById('lightbox').style.display = 'none';
}
</script>


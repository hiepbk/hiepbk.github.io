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
      <a href="{{ site.url }}/cv/HiepHoang_AI_Engineer.pdf" class="btn-download" download>
        <i class="fa fa-download"></i> Download CV (PDF)
      </a>
      <a href="{{ site.url }}/cv/HiepHoang_AI_Engineer.pdf" class="btn-view" target="_blank">
        <i class="fa fa-external-link"></i> Open PDF in New Tab
      </a>
    </div>
  </div>

  <div class="cv-viewer">
    <div class="cv-pages">
      <!-- Page 1 -->
      <div class="cv-page">
        <h3>Page 1</h3>
        <img src="{{ site.url }}/cv/HiepHoang_AI_Engineer-images-0.jpg" 
             alt="CV Page 1" 
             class="cv-page-image"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="error-msg" style="display:none; color:red; text-align:center; padding:20px;">
          Image failed to load: {{ site.url }}/cv/HiepHoang_AI_Engineer-images-0.jpg
        </div>
      </div>
      
      <!-- Page 2 -->
      <div class="cv-page">
        <h3>Page 2</h3>
        <img src="{{ site.url }}/cv/HiepHoang_AI_Engineer-images-1.jpg" 
             alt="CV Page 2" 
             class="cv-page-image"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="error-msg" style="display:none; color:red; text-align:center; padding:20px;">
          Image failed to load: {{ site.url }}/cv/HiepHoang_AI_Engineer-images-1.jpg
        </div>
      </div>
      
      <!-- Page 3 -->
      <div class="cv-page">
        <h3>Page 3</h3>
        <img src="{{ site.url }}/cv/HiepHoang_AI_Engineer-images-2.jpg" 
             alt="CV Page 3" 
             class="cv-page-image"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="error-msg" style="display:none; color:red; text-align:center; padding:20px;">
          Image failed to load: {{ site.url }}/cv/HiepHoang_AI_Engineer-images-2.jpg
        </div>
      </div>
      
      <!-- Page 4 -->
      <div class="cv-page">
        <h3>Page 4</h3>
        <img src="{{ site.url }}/cv/HiepHoang_AI_Engineer-images-3.jpg" 
             alt="CV Page 4" 
             class="cv-page-image"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="error-msg" style="display:none; color:red; text-align:center; padding:20px;">
          Image failed to load: {{ site.url }}/cv/HiepHoang_AI_Engineer-images-3.jpg
        </div>
      </div>
    </div>
    
    <div class="cv-footer">
      <p><i class="fa fa-info-circle"></i> Click on any image to view it in full size</p>
      <p style="font-size:12px; color:#999;">Debug: Site URL = {{ site.url }}</p>
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
  gap: 30px;
  align-items: center;
}

.cv-page {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 800px;
}

.cv-page h3 {
  text-align: center;
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.cv-page-image {
  width: 100%;
  height: auto;
  border: 1px solid #ddd;
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
    padding: 15px;
  }
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  console.log('CV page loaded');
  console.log('Site URL:', '{{ site.url }}');
  
  // Check if images load
  const images = document.querySelectorAll('.cv-page-image');
  images.forEach((img, index) => {
    img.onload = function() {
      console.log('Image ' + (index + 1) + ' loaded successfully');
    };
    img.onerror = function() {
      console.log('Image ' + (index + 1) + ' failed to load:', this.src);
    };
  });
  
  // Simple click to open in new tab
  images.forEach(function(img) {
    img.addEventListener('click', function() {
      window.open(this.src, '_blank');
    });
  });
});
</script>


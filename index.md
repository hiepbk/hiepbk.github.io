---
layout: page
title: About me
excerpt: "A minimal Jekyll theme for your blog by designer Michael Rose."
tags: [Jekyll, theme, responsive, blog, template]
image:
  feature:
---

I am Hoang Anh Hiep (Tony), an AI Researcher at <a href="http://deltax.ai/renewal/eng/" target="_blank"><font color="brown">DeltaX</font></a> - an AI start-up company in Seoul, South Korea. Previously, I obtained my Master of Science degree (2022 - 2024) from the Information Communication Convergence Technology Department of Soongsil University, Seoul, South Korea, supervised by Professor <a href="https://scholar.google.com/citations?user=TARMZOsAAAAJ&hl=vi&oi=ao/" target="_blank"><font color="brown">Myungsik Yoo</font></a>. 

My research interests and experiences range from deep learning, 3D perception, 3D scene understanding and reconstruction and robotics. I also like to explore meta-learning, constrastive learning, information bottle neck theory and novel learning schemes.  
<br />
In 2020, I got my B.E. in Control Engineering from Hanoi University of Science and Technology, Vietnam. During my undergraduate study, I had great honor to work with Professor <a href="https://sites.usc.edu/quann/" target="_blank"><font color="brown">Quan Nguyen</font></a>, University of Southern California, USA, as a remote internship student in robotics. 


Feel free to reach out if you are interested in working with us as either full time or intern (term is flexible, summer, spring or fall), or if you are simply interested in collaboration! Find me at hiepbk dot 97 at gmail dot com.


![Voxelization Visualization](/images/blog/voxelization/voxel_3.gif)
![Voxelization Visualization](/images/blog/voxelization/voxel_3.jpg)


## Project Showcase

<div class="project-showcase">
  <div class="showcase-grid" id="projectShowcase">
    <!-- Project images will be automatically loaded here -->
  </div>
</div>

<style>
  .project-showcase {
    margin: 2em 0;
  }
  
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1em;
    margin: 1em 0;
  }
  
  .showcase-item {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;
  }
  
  .showcase-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  
  .showcase-item img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    display: block;
  }
  
  .showcase-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
    font-weight: bold;
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .showcase-item:hover .showcase-overlay {
    opacity: 1;
  }
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const showcaseContainer = document.getElementById('projectShowcase');
  
  // Automatically fetch project data from the projects page
  fetch('/projects/')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const projectCards = doc.querySelectorAll('.project-card');
      
      projectCards.forEach((card, index) => {
        const img = card.querySelector('img');
        if (img) {
          const item = document.createElement('div');
          item.className = 'showcase-item';
          item.onclick = () => window.location.href = '/projects/';
          
          item.innerHTML = `
            <img src="${img.src}" alt="${img.alt}">
            <div class="showcase-overlay">
              Click to see details
            </div>
          `;
          
          showcaseContainer.appendChild(item);
        }
      });
    })
    .catch(error => {
      // Fallback: use predefined images if fetch fails
      const fallbackImages = [
        '/images/project/FocalFormer3D_crop.gif',
        '/images/project/jetson_3d_detection_tracking.gif',
        '/images/project/pc_recon.png',
        '/images/project/pan_seg.gif',
        '/images/project/2d_od.gif',
        '/images/project/human_intrusion.png',
        '/images/TSSTDET_abstract.png',
        '/images/3ONet_abstract.png',
        '/images/ESSDET_model.png',
        '/images/robot_matlab.gif'
      ];
      
      fallbackImages.forEach((imageSrc, index) => {
        const item = document.createElement('div');
        item.className = 'showcase-item';
        item.onclick = () => window.location.href = '/projects/';
        
        item.innerHTML = `
          <img src="${imageSrc}" alt="Project ${index + 1}">
          <div class="showcase-overlay">
            Click to see details
          </div>
        `;
        
        showcaseContainer.appendChild(item);
      });
    });
});
</script>


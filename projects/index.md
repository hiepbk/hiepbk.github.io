---
layout: projects
title: Projects
excerpt: "Showcasing innovative projects in Computer Vision, Robotics, and Deep Learning."
tags: [Jekyll, theme, responsive, portfolio]
image: 
---

<div class="highlight-box text-center">
  <h2 class="text-gradient">🚀 Research Interests</h2>
  <p>I am passionate about various aspects of Computer Vision and Robotics, including:</p>
  
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 1.5em;">
    <div class="info-card" style="flex: 1; min-width: 250px; margin: 0.5em;">
      <i class="fa fa-cube" style="font-size: 2em; color: #3498db; margin-bottom: 0.5em;"></i>
      <h3>2D/3D Object Detection & Tracking</h3>
      <p>Advanced detection and tracking algorithms for real-world applications</p>
    </div>
    <div class="info-card" style="flex: 1; min-width: 250px; margin: 0.5em;">
      <i class="fa fa-th" style="font-size: 2em; color: #e74c3c; margin-bottom: 0.5em;"></i>
      <h3>Panoptic & Semantic Segmentation</h3>
      <p>Comprehensive scene understanding and pixel-level classification</p>
    </div>
    <div class="info-card" style="flex: 1; min-width: 250px; margin: 0.5em;">
      <i class="fa fa-cloud" style="font-size: 2em; color: #f39c12; margin-bottom: 0.5em;"></i>
      <h3>Point Cloud Reconstruction</h3>
      <p>3D scene reconstruction from multi-modal sensor data</p>
    </div>
  </div>
</div>

---

<div class="text-center" style="margin: 3em 0;">
  <h2 class="text-gradient">🏭 Production Projects</h2>
  <p style="font-size: 1.1em; color: #666; margin-bottom: 2em;">Real-world applications deployed in industrial environments</p>
</div>

<div class="project-cards">

  <!-- Project 1: 3D Object Detection -->
  <div class="project-card">
    <img src="../images/project/FocalFormer3D_crop.gif" alt="[ADAS] 3D Object Detection">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-car icon"></i>[ADAS] 3D Object Detection</h3>
      <p>
        <strong>Key Features:</strong><br>
        • End-to-end LiDAR-based detector<br>
        • Real-time visualization with predicted bounding boxes<br>
        • Multi-threaded pipeline for data loading, inference, and display
      </p>
    </div>
  </div>

  <!-- Project 2: 3D Object Detection & SORT Tracking -->
  <div class="project-card">
    <img src="../images/project/jetson_3d_detection_tracking.gif" alt="[ADAS] 3D Object Detection Tracking (Edge Device)">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-car icon"></i>[ADAS] 3D Object Detection & Tracking</h3>
      <p>
        <strong>Key Features:</strong><br>
        • Fusion of LiDAR and camera data<br>
        • High-performance detection on edge devices<br>
        • Real-time SORT tracking with remote monitoring via websockets
      </p>
    </div>
  </div>

  <!-- Project 3: 3D Point Cloud Scene Reconstruction -->
  <div class="project-card">
    <img src="../images/project/pc_recon.png" alt="[ADAS] 3D Point Cloud Scene Reconstruction">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-car icon"></i>[ADAS] 3D Point Cloud Scene Reconstruction</h3>
      <p>
        <strong>Key Features:</strong><br>
        • Unified interface for multi-dataset support (NuScenes, DDAD, KITTI)<br>
        • Self-supervised learning without ground truth depth<br>
        • Integrated 3D visualization with CamViz
      </p>
    </div>
  </div>

  <!-- Project 4: 2D Panoptic / Semantic / Instance Segmentation -->
  <div class="project-card">
    <img src="../images/project/pan_seg.gif" alt="[ADAS] 2D Panoptic Segmentation">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-car icon"></i>[ADAS] 2D Panoptic Segmentation</h3>
      <p>
        <strong>Key Features:</strong><br>
        • Real-time inference on PC and edge devices<br>
        • Multi-threaded architecture with teacher-student distillation<br>
        • Prototype web app built with Gradio
      </p>
    </div>
  </div>

  <!-- Project 5: 2D Object Detection -->
  <div class="project-card">
    <img src="../images/project/2d_od.gif" alt="[ADAS] 2D Object Detection">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-car icon"></i>[ADAS] 2D Object Detection</h3>
      <p>
        <strong>Key Features:</strong><br>
        • Fast, lightweight model on Jetson edge devices<br>
        • Real-time display with minimal latency<br>
        • Optimized for web prototyping with Gradio
      </p>
    </div>
  </div>

  <!-- Project 6: Human Intrusion Detection -->
  <div class="project-card">
    <img src="../images/project/human_intrusion.png" alt="[Smart Factory] 2D Multi-Cam Human Intrusion Detection">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-shield icon"></i>[Smart Factory] Human Intrusion Detection</h3>
      <p>
        <strong>Key Features:</strong><br>
        • Multi-camera surveillance system for industrial safety<br>
        • Real-time instance segmentation with high-speed processing<br>
        • Advanced multi-threading and multi-processing pipeline
      </p>
    </div>
  </div>

</div>

<div class="text-center" style="margin: 3em 0;">
  <h2 class="text-gradient">🎓 Academia Research Projects</h2>
  <p style="font-size: 1.1em; color: #666; margin-bottom: 2em;">Published research contributions to the scientific community</p>
</div>

<div class="project-cards">

  <!-- Academic Project 1 -->
  <div class="project-card">
    <img src="../images/TSSTDET_abstract.png" alt="3D Object Detection with Spatial Shape Transformer">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-graduation-cap icon"></i>3D Object Detection with Spatial Shape Transformer</h3>
      <p>
        A high-performance 3D detector using Transformer architecture, offering a deep understanding of object dimensions and spatial relationships.
        <br><a href="https://ieeexplore.ieee.org/abstract/document/10399338/" target="_blank">[Paper]</a>
      </p>
    </div>
  </div>

  <!-- Academic Project 2 -->
  <div class="project-card">
    <img src="../images/3ONet_abstract.png" alt="3D Detector for Occluded Object">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-graduation-cap icon"></i>3D Detector for Occluded Object</h3>
      <p>
        Utilizing a point-voxel based method, the framework produces high-quality 3D bounding boxes while preserving shape context.
        <br><a href="https://ieeexplore.ieee.org/abstract/document/10399338/" target="_blank">[Paper]</a>
      </p>
    </div>
  </div>

  <!-- Academic Project 3 -->
  <div class="project-card">
    <img src="../images/ESSDET_model.png" alt="Improving Object Shape of 3D Detector">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-graduation-cap icon"></i>Improving Object Shape of 3D Detector</h3>
      <p>
        Enhancing object shape accuracy with innovative techniques and a lightweight quantized model.
        <br><a href="https://icoin.org/media?key=site/icoin2024/abs/P-3-2.pdf" target="_blank">[Paper]</a>
      </p>
    </div>
  </div>

  <!-- Academic Project 4 -->
  <div class="project-card">
    <img src="../images/robot_matlab.gif" alt="Jumping Optimization for Quadruped Robot">
    <div class="card-overlay">Click to see details</div>
    <div class="card-content">
      <h3><i class="fa fa-graduation-cap icon"></i>Jumping Optimization for Quadruped Robot</h3>
      <p>
        Optimizing jump trajectories using spatial methods on both Matlab and ROS platforms for agile robotics.
        <br><a href="https://github.com/hiepbk/Quadruped_Robot_A1_Matlab" target="_blank">[Matlab Source]</a> |
        <a href="https://github.com/hiepbk/Quadruped_Robot_A1_ROS_Gazebo" target="_blank">[ROS Source]</a>
      </p>
    </div>
  </div>

</div>



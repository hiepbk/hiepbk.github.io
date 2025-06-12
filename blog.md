---
layout: post-index
title: Blog
excerpt: "Technical blog posts and tutorials"
tags: [blog, tutorials, technical]
comments: true
image:
  feature: 
---

{% include _toc.html %}

Here I share my technical knowledge and insights about various topics in Computer Vision, Machine Learning, and 3D understanding.

<div class="post-list">
  {% for post in site.posts %}
    <article>
      <h2><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">{{ post.title }}</a></h2>
      <p>{{ post.excerpt | strip_html | truncate: 160 }}</p>
      <p><strong><a href="{{ site.url }}{{ post.url }}" title="{{ post.title }}">Continue Reading &raquo;</a></strong></p>
    </article>
  {% endfor %}
</div> 
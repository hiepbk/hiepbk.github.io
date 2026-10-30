// Identity, links and navigation used across the site.
export const site = {
  name: 'Anh Hiep Hoang',
  description: 'PhD researcher at TUM MIRMI working on 3D perception for autonomous driving and robotics.',
  avatar: '/images/avatar.jpg',
  email: 'hiepbk.97@gmail.com',
  // Lines under the name in the profile sidebar
  facts: [
    { icon: 'fa-user', text: 'PhD Researcher' },
    { icon: 'fa-building', text: 'PercInS · MIRMI, TUM', url: 'https://www.ce.cit.tum.de/pins/team/anh-hiep-hoang/' },
    { icon: 'fa-location-dot', text: 'Munich, Germany' },
    { icon: 'fa-graduation-cap', text: 'MSCA ENGAGE Doctoral Network', url: 'https://dn-engage.eu/doctoral-candidate/#:~:text=DC5,Anh%20Hiep%20Hoang' },
  ],
  social: {
    scholar: 'https://scholar.google.com/citations?user=dEH4XGoAAAAJ',
    github: 'https://github.com/hiepbk',
    linkedin: 'https://www.linkedin.com/in/hiepbk97',
  },
};

export const nav = [
  { title: 'Home', url: '/' },
  { title: 'Projects', url: '/projects/' },
  { title: 'Publications', url: '/publications/' },
  { title: 'Paper Walkthroughs', url: '/walkthroughs/' },
];

// Categories of the paper walkthroughs, in display order
export const walkthroughCategories = [
  { id: 'object-detection', name: '3D Object Detection' },
  { id: 'semantic-segmentation', name: '3D Semantic Segmentation' },
  { id: 'instance-segmentation', name: '3D Instance Segmentation' },
  { id: 'panoptic-segmentation', name: '3D Panoptic Segmentation' },
  { id: 'tracking', name: '3D Multi-Object Tracking' },
  { id: 'scene-completion', name: '3D Scene Completion' },
] as const;

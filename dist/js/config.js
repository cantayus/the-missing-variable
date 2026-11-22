// Settings for whoever hosts the game. Edit this file; nothing else needs to change.
export const CONFIG = {
  // Visit counter. Leave "provider" empty to keep it off.
  //   provider: 'beacon', url: 'https://your-worker.example.workers.dev/visit'
  //   provider: 'script', src: 'https://…/script.js', attrs: { 'data-domain': 'example.org' }
  //   provider: 'goatcounter', site: 'yourcode'
  visits: { provider: '', url: '', src: '', attrs: {}, site: '', respectDoNotTrack: true },
  // A photo for the credits page, for example 'img/creator.jpg'. Left empty, the page shows initials.
  creatorPhoto: 'img/creator.jpg',
};

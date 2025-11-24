const KEY_API = 'job_matcher_api_key';
const KEY_RESUME = 'job_matcher_resume';

export const getSettings = () => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([KEY_API, KEY_RESUME], (result) => {
        resolve({
          apiKey: result[KEY_API] || '',
          resume: result[KEY_RESUME] || ''
        });
      });
    } else {
      // Fallback for non-extension debugging
      resolve({
        apiKey: localStorage.getItem(KEY_API) || '',
        resume: localStorage.getItem(KEY_RESUME) || ''
      });
    }
  });
};

export const saveSettings = (settings) => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        [KEY_API]: settings.apiKey,
        [KEY_RESUME]: settings.resume
      }, resolve);
    } else {
      localStorage.setItem(KEY_API, settings.apiKey);
      localStorage.setItem(KEY_RESUME, settings.resume);
      resolve();
    }
  });
};
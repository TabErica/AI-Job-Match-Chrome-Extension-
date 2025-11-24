import { getSettings, saveSettings } from './services/storage.js';
import { analyzeJobWithGemini } from './services/gemini.js';

// DOM Elements
const views = {
  loading: document.getElementById('loading-view'),
  settings: document.getElementById('settings-view'),
  start: document.getElementById('start-view'),
  results: document.getElementById('results-view')
};

const elements = {
  settingsForm: document.getElementById('settings-form'),
  apiKeyInput: document.getElementById('api-key'),
  resumeInput: document.getElementById('resume-text'),
  btnSettings: document.getElementById('btn-settings'),
  btnCancelSettings: document.getElementById('btn-cancel-settings'),
  btnAnalyze: document.getElementById('btn-analyze'),
  btnManualToggle: document.getElementById('btn-manual-toggle'),
  manualInputContainer: document.getElementById('manual-input-container'),
  manualJdInput: document.getElementById('manual-jd'),
  btnCloseManual: document.getElementById('btn-close-manual'),
  btnReset: document.getElementById('btn-reset'),
  errorMessage: document.getElementById('error-message'),
  // Results
  scoreValue: document.getElementById('score-value'),
  scoreCard: document.getElementById('score-card'),
  summaryText: document.getElementById('summary-text'),
  keywordsList: document.getElementById('keywords-list'),
  adviceList: document.getElementById('advice-list')
};

let currentSettings = { apiKey: '', resume: '' };
let isManualMode = false;

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  try {
    currentSettings = await getSettings();
    if (!currentSettings.apiKey || !currentSettings.resume) {
      showView('settings');
      elements.btnCancelSettings.classList.add('hidden'); // Cannot cancel if first run
    } else {
      showView('start');
      elements.btnCancelSettings.classList.remove('hidden');
    }
  } catch (e) {
    console.error("Init error", e);
    showError("Failed to load settings.");
  }
});

// View Navigation
function showView(viewName) {
  Object.values(views).forEach(el => el.classList.add('hidden'));
  views[viewName].classList.remove('hidden');
  elements.errorMessage.classList.add('hidden');
}

// Event Listeners

// Open Settings
elements.btnSettings.addEventListener('click', () => {
  elements.apiKeyInput.value = currentSettings.apiKey || '';
  elements.resumeInput.value = currentSettings.resume || '';
  showView('settings');
});

// Save Settings
elements.settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newSettings = {
    apiKey: elements.apiKeyInput.value.trim(),
    resume: elements.resumeInput.value.trim()
  };
  
  if (!newSettings.apiKey || !newSettings.resume) return;

  await saveSettings(newSettings);
  currentSettings = newSettings;
  showView('start');
});

// Cancel Settings
elements.btnCancelSettings.addEventListener('click', () => {
  showView('start');
});

// Toggle Manual Mode
elements.btnManualToggle.addEventListener('click', () => {
  isManualMode = true;
  elements.manualInputContainer.classList.remove('hidden');
  elements.btnManualToggle.classList.add('hidden');
  elements.btnAnalyze.innerText = "Analyze Pasted Text";
});

elements.btnCloseManual.addEventListener('click', () => {
  isManualMode = false;
  elements.manualInputContainer.classList.add('hidden');
  elements.btnManualToggle.classList.remove('hidden');
  elements.btnAnalyze.innerText = "Analyze This Job";
  elements.errorMessage.classList.add('hidden');
});

// Analyze Logic
elements.btnAnalyze.addEventListener('click', async () => {
  showView('loading');
  
  try {
    let jdText = '';

    if (isManualMode) {
      jdText = elements.manualJdInput.value.trim();
      if (jdText.length < 20) {
        throw new Error("Pasted text is too short. Please paste the full Job Description.");
      }
    } else {
      jdText = await getJDFromTab();
      if (!jdText || jdText.length < 50) {
        throw new Error("Could not find job description automatically. Please try pasting it manually.");
      }
    }

    const result = await analyzeJobWithGemini(currentSettings.apiKey, currentSettings.resume, jdText);
    renderResults(result);
    showView('results');

  } catch (error) {
    console.error(error);
    showView('start');
    showError(error.message || "An unexpected error occurred.");
    // If auto-fail, suggest manual
    if (!isManualMode) {
       elements.btnManualToggle.click(); 
    }
  }
});

elements.btnReset.addEventListener('click', () => {
  showView('start');
  elements.errorMessage.classList.add('hidden');
});

// Helpers
async function getJDFromTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab.");

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'GET_JD' });
    return response && response.jd ? response.jd : null;
  } catch (e) {
    console.warn("Script injection failed or content script missing", e);
    // Try to inject if missing (failsafe)
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    // Retry once
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'GET_JD' });
    return response?.jd;
  }
}

function renderResults(data) {
  elements.scoreValue.textContent = `${data.score}%`;
  elements.summaryText.textContent = data.summary;

  // Score Styling
  elements.scoreCard.className = 'score-card'; // reset
  if (data.score >= 80) elements.scoreCard.classList.add('score-high');
  else if (data.score >= 50) elements.scoreCard.classList.add('score-medium');
  else elements.scoreCard.classList.add('score-low');

  // Keywords
  elements.keywordsList.innerHTML = '';
  if (data.missing_keywords && data.missing_keywords.length > 0) {
    data.missing_keywords.forEach(kw => {
      const span = document.createElement('span');
      span.className = 'keyword-tag';
      span.textContent = kw;
      elements.keywordsList.appendChild(span);
    });
  } else {
    elements.keywordsList.innerHTML = '<span class="text-muted text-sm italic">No missing keywords found!</span>';
  }

  // Advice
  elements.adviceList.innerHTML = '';
  if (data.tailoring_advice && data.tailoring_advice.length > 0) {
    data.tailoring_advice.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      elements.adviceList.appendChild(li);
    });
  }
}

function showError(msg) {
  elements.errorMessage.textContent = msg;
  elements.errorMessage.classList.remove('hidden');
}
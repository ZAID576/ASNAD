/**
 * Google Picker API Integration Helper
 * Loads gapi.picker lazily and presents the picker interface
 */

let pickerApiLoaded = false;

export function loadPickerApi() {
  return new Promise((resolve, reject) => {
    if (pickerApiLoaded && window.google && window.google.picker) {
      return resolve();
    }

    if (!window.gapi) {
      return reject(new Error('Google API script not loaded. Please check your network connection.'));
    }

    window.gapi.load('picker', {
      callback: () => {
        pickerApiLoaded = true;
        resolve();
      },
      onerror: () => reject(new Error('Failed to load Google Picker library')),
    });
  });
}

export function openGooglePicker({
  accessToken,
  developerKey,
  appId,
  onSelect,
  onCancel,
}) {
  if (!window.google || !window.google.picker) {
    throw new Error('Google Picker is not initialized');
  }

  // Construct Views: All Drive Docs and Recent
  const docsView = new window.google.picker.DocsView()
    .setIncludeFolders(true)
    .setSelectFolderEnabled(false);

  const builder = new window.google.picker.PickerBuilder()
    .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
    .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    .setAppId(appId)
    .setOAuthToken(accessToken)
    .addView(docsView)
    .addView(new window.google.picker.DocsUploadView());

  if (developerKey && developerKey.startsWith('AIzaSy')) {
    builder.setDeveloperKey(developerKey);
  }

  const picker = builder
    .setCallback((data) => {
      if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
        const docs = data[window.google.picker.Response.DOCUMENTS];
        if (onSelect) onSelect(docs);
      } else if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.CANCEL) {
        if (onCancel) onCancel();
      }
    })
    .build();

  picker.setVisible(true);
}


// Custom Input Handler for Recipe Designer
// Handles dropdown to custom input switching

function updateCustomInput(inputId, selectedValue) {
  const select = document.getElementById(inputId + '-select');
  const input = document.getElementById(inputId);
  
  if (!select || !input) return;
  
  if (selectedValue === 'custom') {
    // Show custom input, hide select
    select.style.display = 'none';
    input.style.display = 'block';
    input.focus();
  } else {
    // Use predefined value
    input.value = selectedValue;
    
    // Trigger change event for calculations
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }
}

// Style-specific defaults
function getStyleDefaults(styleName) {
  const styleDefaults = {
    'American IPA': {
      batchSize: 5,
      efficiency: 75,
      boilTime: 60,
      mashRatio: 1.25,
      grainTemp: 72,
      carbonation: 2.6
    },
    'German Pilsner': {
      batchSize: 5,
      efficiency: 78,
      boilTime: 90,
      mashRatio: 1.5,
      grainTemp: 70,
      carbonation: 2.8
    },
    'Belgian Tripel': {
      batchSize: 5,
      efficiency: 72,
      boilTime: 90,
      mashRatio: 1.25,
      grainTemp: 72,
      carbonation: 3.0
    },
    'English Bitter': {
      batchSize: 5,
      efficiency: 70,
      boilTime: 60,
      mashRatio: 1.25,
      grainTemp: 72,
      carbonation: 2.2
    }
  };
  
  return styleDefaults[styleName] || {
    batchSize: 5,
    efficiency: 72,
    boilTime: 60,
    mashRatio: 1.25,
    grainTemp: 72,
    carbonation: 2.4
  };
}

// Update form defaults when style changes
function updateStyleDefaults(styleName) {
  const defaults = getStyleDefaults(styleName);
  
  // Update selects to match style defaults
  const updates = [
    { selectId: 'batch-vol-select', inputId: 'batch-vol', value: defaults.batchSize },
    { selectId: 'efficiency-select', inputId: 'efficiency', value: defaults.efficiency },
    { selectId: 'boil-time-select', inputId: 'boil-time', value: defaults.boilTime }
  ];
  
  updates.forEach(update => {
    const select = document.getElementById(update.selectId);
    const input = document.getElementById(update.inputId);
    
    if (select && input) {
      // Find matching option or set to custom
      const option = Array.from(select.options).find(opt => 
        parseFloat(opt.value) === update.value
      );
      
      if (option) {
        select.value = option.value;
        input.value = update.value;
      } else {
        select.value = 'custom';
        input.value = update.value;
        input.style.display = 'block';
        select.style.display = 'none';
      }
    }
  });
}

// Make functions globally available
window.updateCustomInput = updateCustomInput;
window.updateStyleDefaults = updateStyleDefaults;
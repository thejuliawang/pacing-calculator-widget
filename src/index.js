
import React from 'react';
import ReactDOM from 'react-dom/client';
import r2wc from 'react-to-webcomponent';
import CampaignPacingCalculator from './CampaignPacingCalculator';
import './widget.css';

// Define <r2wc-pacing-calculator> as a web component, no shadow DOM, config prop parses JSON
const WebComponent = r2wc(CampaignPacingCalculator, React, ReactDOM, {
  shadow: false,
  props: { config: 'json' }
});

if (!customElements.get('r2wc-pacing-calculator')) {
  customElements.define('r2wc-pacing-calculator', WebComponent);
}

// No mount — this bundle is for embedding only.

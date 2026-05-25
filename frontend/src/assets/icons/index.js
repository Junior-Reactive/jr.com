// frontend/src/assets/icons/index.js

import Icon from './components/Icon';

// Icon metadata registry
export const ICON_REGISTRY = {
  // Service icons
  'service-ai': {
    category: 'service',
    label: 'AI Consulting',
    description: 'Artificial Intelligence Consulting Services',
  },
  'service-dev': {
    category: 'service',
    label: 'Custom Development',
    description: 'Custom Software Development Services',
  },
  'service-automation': {
    category: 'service',
    label: 'Automation & Workflows',
    description: 'Process Automation and Workflow Solutions',
  },
  'service-analytics': {
    category: 'service',
    label: 'Data Analytics',
    description: 'Data Analytics and Business Intelligence',
  },

  // Action icons
  'action-search': {
    category: 'action',
    label: 'Search',
    description: 'Search and Discovery',
  },
  'action-email': {
    category: 'action',
    label: 'Email',
    description: 'Email Communication',
  },
  'action-document': {
    category: 'action',
    label: 'Document',
    description: 'Content and Documents',
  },
  'action-rocket': {
    category: 'action',
    label: 'Rocket',
    description: 'Launch and Growth',
  },

  // UI icons
  'ui-target': {
    category: 'ui',
    label: 'Target',
    description: 'Goals and Focus',
  },
  'ui-settings': {
    category: 'ui',
    label: 'Settings',
    description: 'Configuration and Options',
  },
  'ui-messages': {
    category: 'ui',
    label: 'Messages',
    description: 'Communication and Chat',
  },
  'ui-lock': {
    category: 'ui',
    label: 'Lock',
    description: 'Security and Protection',
  },

  // State icons
  'state-user': {
    category: 'state',
    label: 'User',
    description: 'User Profile',
  },
  'state-team': {
    category: 'state',
    label: 'Team',
    description: 'Team and Collaboration',
  },
  'state-empty': {
    category: 'state',
    label: 'Empty',
    description: 'No Data or Empty State',
  },
};

export default Icon;

import React from 'react';
import Card from '../common/Card';
import Icon from '../../assets/icons/components/Icon';

// Map emoji to icon names
const emojiToIconMap = {
  '🤖': 'service-ai',
  '💻': 'service-dev',
  '🖥️': 'service-dev',
  '⚙️': 'service-automation',
  '🔄': 'service-automation',
  '📊': 'service-analytics',
};

// Map service type/key to icon name (fallback)
const serviceKeyToIconMap = {
  'ai-consulting': 'service-ai',
  'ai-awareness-sessions': 'service-ai',
  'ai-courses-training': 'service-ai',
  'custom-development': 'service-dev',
  'custom-software-development': 'service-dev',
  'n8n-workflow-automation': 'service-automation',
  'business-intelligence-dashboard': 'service-analytics',
  'data-analytics': 'service-analytics',
  'predictive-modeling': 'service-analytics',
};

const getIconName = (service) => {
  // Try emoji mapping first
  if (service.icon && emojiToIconMap[service.icon]) {
    return emojiToIconMap[service.icon];
  }
  // Try service key mapping
  if (service.key && serviceKeyToIconMap[service.key.toLowerCase()]) {
    return serviceKeyToIconMap[service.key.toLowerCase()];
  }
  // Default fallback
  return 'service-ai';
};

const getAriaLabel = (service) => {
  return `${service.title} service icon`;
};

const ServicesGrid = ({ services }) => {
    return (
        <div className="services-grid">
            {services.map(service => {
              const iconName = getIconName(service);
              const ariaLabel = getAriaLabel(service);

              return (
                <Card
                    key={service.id}
                    icon={
                      <Icon
                        name={iconName}
                        size="lg"
                        color="primary"
                        ariaLabel={ariaLabel}
                      />
                    }
                    title={service.title}
                    description={service.shortDescription}
                    linkTo={`/services/${service.key}`}
                />
              );
            })}
        </div>
    );
};

export default ServicesGrid;
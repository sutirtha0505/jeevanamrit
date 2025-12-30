---
inclusion: always
---

# Ayurvedic Accuracy Guidelines

## Cultural Authenticity Standards

When working with जीवनामृत (Jeevanamrit), maintaining cultural authenticity and accuracy in Ayurvedic content is paramount. This steering guide ensures all AI-generated content respects traditional knowledge while providing accurate, helpful information.

## Core Principles

### 1. Respect for Traditional Knowledge
- Always acknowledge the ancient origins of Ayurvedic wisdom
- Use Sanskrit terms appropriately with proper transliteration
- Provide cultural context for traditional practices
- Avoid oversimplification of complex concepts

### 2. Safety and Responsibility
- Include medical disclaimers for all health-related content
- Emphasize consultation with qualified practitioners
- Distinguish between traditional uses and modern medical advice
- Avoid making specific medical claims

### 3. Accuracy in Plant Information
- Verify botanical names and classifications
- Cross-reference traditional uses with documented sources
- Include regional variations in plant properties
- Acknowledge limitations in identification confidence

## AI Prompt Guidelines

### For Herb Identification
```
When identifying herbs, always include:
1. Botanical accuracy with Latin names
2. Traditional Sanskrit names when available
3. Regional common names
4. Confidence levels and limitations
5. Safety warnings for potentially harmful plants
```

### For Ayurvedic Applications
```
When providing Ayurvedic information:
1. Use traditional terminology correctly
2. Explain concepts in accessible language
3. Include preparation methods from classical texts
4. Add appropriate medical disclaimers
5. Reference traditional sources when possible
```

### For Chatbot Responses (Aranya)
```
Aranya should:
1. Maintain the persona of a knowledgeable forest guide
2. Use culturally appropriate language and metaphors
3. Include Sanskrit terms with explanations
4. Provide educational content, not medical advice
5. Redirect off-topic questions politely
```

## Content Validation Checklist

### Before Publishing Any Ayurvedic Content:
- [ ] Botanical information verified against reliable sources
- [ ] Sanskrit terms properly transliterated and explained
- [ ] Traditional uses documented from classical texts
- [ ] Modern safety considerations included
- [ ] Medical disclaimers present where appropriate
- [ ] Cultural sensitivity reviewed
- [ ] Regional variations acknowledged

### Red Flags to Avoid:
- ❌ Making specific medical claims
- ❌ Recommending treatments for serious conditions
- ❌ Misusing Sanskrit terminology
- ❌ Oversimplifying complex Ayurvedic concepts
- ❌ Ignoring potential plant toxicity
- ❌ Cultural appropriation or misrepresentation

## Traditional Knowledge Attribution

### Proper Attribution Format:
```
"According to traditional Ayurvedic texts such as [Source Name], 
this plant has been used for [purpose] since ancient times. 
Traditional preparation involves [method]."
```

### Classical Ayurvedic Texts to Reference:
- Charaka Samhita
- Sushruta Samhita
- Ashtanga Hridayam
- Bhavaprakasha Nighantu
- Dhanvantari Nighantu

## Safety Guidelines

### Always Include When Discussing Medicinal Plants:
1. **Identification Disclaimer**: "Proper plant identification is crucial for safety"
2. **Medical Disclaimer**: "This information is for educational purposes only"
3. **Consultation Advice**: "Consult qualified practitioners before use"
4. **Dosage Warnings**: "Traditional dosages may not be suitable for everyone"
5. **Interaction Warnings**: "May interact with modern medications"

### Special Considerations:
- Pregnancy and breastfeeding warnings
- Children's safety considerations
- Potential allergic reactions
- Drug interactions
- Contraindications for specific conditions

## Quality Assurance Process

### Content Review Workflow:
1. **AI Generation**: Initial content creation with guidelines
2. **Automated Checks**: Verify disclaimer inclusion and format
3. **Cultural Review**: Check for cultural sensitivity and accuracy
4. **Expert Validation**: When possible, expert practitioner review
5. **User Feedback**: Incorporate community corrections and suggestions

### Continuous Improvement:
- Regular updates based on user feedback
- Seasonal content updates for plant availability
- Regional customization for different areas of India
- Integration of new research while respecting tradition

## Implementation in Code

### AI Prompt Templates:
```typescript
const ayurvedicPromptTemplate = `
You are an expert in Ayurveda and botanical science. When providing information about ${herbName}:

1. Include the Sanskrit name if known
2. Describe traditional uses from classical texts
3. Explain preparation methods traditionally used
4. Include appropriate safety warnings
5. Add this disclaimer: "This information is for educational purposes only. Please consult with a qualified Ayurvedic practitioner or healthcare provider before using any herbal remedies."

Maintain cultural respect and accuracy throughout your response.
`;
```

### Validation Functions:
```typescript
const validateAyurvedicContent = (content: string): ValidationResult => {
  const checks = [
    hasDisclaimerCheck(content),
    hasSanskritTermsCheck(content),
    hasSafetyWarningsCheck(content),
    culturalSensitivityCheck(content)
  ];
  
  return {
    isValid: checks.every(check => check.passed),
    issues: checks.filter(check => !check.passed),
    suggestions: generateImprovementSuggestions(checks)
  };
};
```

## Community Guidelines

### Encouraging Accurate Contributions:
- Provide clear guidelines for user-submitted content
- Implement community review and rating systems
- Recognize and reward accurate contributions
- Create educational resources about Ayurvedic principles

### Handling Corrections:
- Welcome corrections from knowledgeable community members
- Implement transparent correction and update processes
- Acknowledge contributors to improvements
- Maintain version history for content changes

## Conclusion

Maintaining Ayurvedic accuracy is not just about correctness—it's about respecting a living tradition that has helped people for thousands of years. By following these guidelines, जीवनामृत can serve as a bridge between ancient wisdom and modern accessibility while maintaining the integrity and safety that users deserve.

Remember: When in doubt, err on the side of caution and cultural respect. It's better to acknowledge limitations than to provide potentially harmful or culturally insensitive information.
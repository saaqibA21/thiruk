import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ExternalResources() {
  return (
    <div className="external-resources-section">
      <h3>கூடுதல் ஆதாரங்கள் (External Scholarly Resources)</h3>
      <div className="resources-grid">
        <a href="https://library.bjp.org/jspui/bitstream/123456789/1495/1/Thirukkural.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
          <ExternalLink size={18} />
          <span>BJP Library - Thirukkural (PDF)</span>
        </a>
        <a href="https://www.tamilvu.org/library/nationalized/pdf/59-puliyurkesigan/013.thirukuralputhiyaurai.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
          <ExternalLink size={18} />
          <span>Tamil Virtual Academy - (PDF)</span>
        </a>
        <a href="https://ta.wikipedia.org/wiki/%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81%E0%AE%B1%E0%AE%B3%E0%AF%8D" target="_blank" rel="noopener noreferrer" className="resource-link">
          <ExternalLink size={18} />
          <span>Wikipedia - திருக்குறள்</span>
        </a>
        <a href="https://tamilvalarchithurai.tn.gov.in/wp-content/uploads/2019/03/Thirukural-2-converted-1.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
          <ExternalLink size={18} />
          <span>Tamil Valarchi Thurai - Thirukkural (PDF)</span>
        </a>
        <a href="https://www.tnpscjob.com/last-10-years-tnpsc-question-papers-with-answers-pdf/" target="_blank" rel="noopener noreferrer" className="resource-link">
          <ExternalLink size={18} />
          <span>TNPSC Job - Previous Year Q&A (PDF)</span>
        </a>
      </div>
    </div>
  );
}

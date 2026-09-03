import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  Cpu, 
  Award, 
  Globe, 
  Users, 
  Feather, 
  Heart, 
  Compass, 
  Code, 
  Layers, 
  ExternalLink,
  MessageCircle,
  Mail,
  MapPin,
  Building2,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export default function AboutView({ onNavigateTab }) {
  return (
    <div className="about-view-container">
      
      {/* Hero Header */}
      <div className="about-hero-card">
        <div className="about-hero-badge">
          <Sparkles size={14} /> SRM Institute of Science and Technology
        </div>
        
        <div className="about-logos-header-row">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" 
            alt="SRM IST" 
            className="about-srm-logo" 
          />
          <span className="about-logo-separator">✕</span>
          <img 
            src="mozhi_to_machine.png" 
            alt="Mozhi to Machine" 
            className="about-mozhi-logo" 
          />
        </div>

        <h1 className="about-hero-title">எஸ்.ஆர்.எம் தமிழ் மன்றம்</h1>
        <h2 className="about-hero-subtitle-en">SRM Tamil Mandram • மொழி முதல் இயந்திரம் வரை</h2>
        <p className="about-hero-description">
          செம்மொழித் தமிழின் இரண்டாயிரம் ஆண்டுகால இலக்கிய ஆழத்தையும், அதிநவீன செயற்கை நுண்ணறிவு (AI) & கணினியியலையும் இணைக்கும் முன்னோடி மாணவர் மற்றும் ஆய்வுக் களம்.
        </p>

        {/* Highlight Stats Grid */}
        <div className="about-stats-grid">
          <div className="about-stat-box">
            <strong>20+</strong>
            <span>ஆண்டுகள் பாரம்பரியம்</span>
          </div>
          <div className="about-stat-box">
            <strong>1,000+</strong>
            <span>செயல் உறுப்பினர்கள்</span>
          </div>
          <div className="about-stat-box">
            <strong>50+</strong>
            <span>ஆண்டு நிகழ்வுகள்</span>
          </div>
          <div className="about-stat-box">
            <strong>10+</strong>
            <span>தமிழ் AI திட்டங்கள்</span>
          </div>
        </div>
      </div>

      {/* Vision & Mission Cards */}
      <div className="about-grid-two-col">
        
        <div className="about-feature-card vision-card">
          <div className="about-card-icon-wrap gold-icon">
            <Compass size={24} />
          </div>
          <span className="about-card-tag">தொலைநோக்கு பார்வை</span>
          <h3>எங்கள் தொலைநோக்கு (Vision)</h3>
          <p>
            உலகளாவிய செம்மொழியான தமிழ் மொழியின் தொன்மை இலக்கியங்கள், தத்துவங்கள் மற்றும் வாழ்வியல் நெறிகளை நவீன தொழில்நுட்பம், AI மொழி மாதிரிகள் மற்றும் மென்பொருள் சாதனங்கள் மூலம் உலகெங்கும் உள்ள அடுத்த தலைமுறை இளைஞர்களுக்கு எளிய வடிவில் கொண்டு சேர்த்தல்.
          </p>
        </div>

        <div className="about-feature-card mission-card">
          <div className="about-card-icon-wrap red-icon">
            <Lightbulb size={24} />
          </div>
          <span className="about-card-tag">முக்கிய நோக்கம்</span>
          <h3>எங்கள் நோக்கம் (Mission)</h3>
          <ul className="about-bullet-list">
            <li>
              <CheckCircle2 size={16} className="bullet-check-icon" />
              <span><strong>தமிழ் இலக்கியக் கணினிமயமாக்கல்:</strong> திருக்குறள், சங்க இலக்கியம், காப்பியங்களை AI தளங்களில் இணைத்தல்.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="bullet-check-icon" />
              <span><strong>மாணவர் திறன் மேம்பாடு:</strong> பேச்சு, கவிதை, கட்டுரை, பட்டிமன்றம் மற்றும் விவாத ஆற்றலை வளர்த்தல்.</span>
            </li>
            <li>
              <CheckCircle2 size={16} className="bullet-check-icon" />
              <span><strong>தமிழ் AI & NLP ஆய்வு:</strong> தமிழ் மொழி செயலாக்கம், குரல்வழி தேடல், OCR மற்றும் மொழிபெயர்ப்பு திட்டங்களை உருவாக்குதல்.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Mozhi to Machine Flagship Initiative */}
      <div className="about-flagship-section">
        <div className="flagship-header-row">
          <div className="flagship-icon-badge">
            <Cpu size={26} />
          </div>
          <div>
            <span className="flagship-mini-badge">முதன்மை ஆய்வுத் திட்டம்</span>
            <h3 className="flagship-title">மொழி முதல் இயந்திரம் வரை (Mozhi to Machine)</h3>
          </div>
        </div>

        <p className="flagship-desc">
          பண்டைத் தமிழரின் ஓலைச்சுவடி ஞானத்தை அதிநவீன <strong>Retrieval-Augmented Generation (RAG)</strong>, இயற்கை மொழி செயலாக்கம் (Tamil NLP) மற்றும் Deep Learning தொழில்நுட்பங்கள் வாயிலாக மீட்டெடுக்கும் சிறப்புத் திட்டம்.
        </p>

        <div className="flagship-milestones-grid">
          <div className="flagship-m-box">
            <div className="m-num">01</div>
            <h4>திருக்குறள் AI நிபுணர்</h4>
            <p>1,330 குறள்களுக்கும் 4 முதன்மை உரையாசிரியர்களின் விளக்கங்களுடன் கூடிய RAG AI ஆய்வுத் தளம்.</p>
          </div>
          <div className="flagship-m-box">
            <div className="m-num">02</div>
            <h4>தமிழ் ஒலி & எழுத்துணரி (OCR/TTS)</h4>
            <p>செந்தமிழ்ச் சொற்களை தூய ஒலியாக உச்சரிக்கும் வெண்பா ஒலிப்பெருக்கி மற்றும் ஓலைச்சுவடி எழுத்துணரி.</p>
          </div>
          <div className="flagship-m-box">
            <div className="m-num">03</div>
            <h4>நிகழ்நேர தட்டச்சு மாற்றி</h4>
            <p>தங்கிலீஷ் (Thanglish) எழுத்துகளை நொடிக்குள் தூய தமிழ் யூனிகோடிற்கு மாற்றும் Phonetic Transliteration Engine.</p>
          </div>
        </div>
      </div>

      {/* Wings & Activities */}
      <div className="about-activities-section">
        <div className="section-title-center">
          <span className="section-badge-gold">
            <Layers size={14} /> மன்றத்தின் பிரிவுகள்
          </span>
          <h2>முக்கிய செயல்பாடுகள் & களங்கள்</h2>
          <p>தமிழ் மன்றத்தின் கீழ் இயங்கும் முதன்மை மாணவர் குழுக்கள்</p>
        </div>

        <div className="about-activities-grid">
          
          <div className="activity-card">
            <div className="act-icon-box blue-bg">
              <Code size={22} />
            </div>
            <h4>தமிழ் கணினியியல் பிரிவு (Tamil Computing Wing)</h4>
            <p>தமிழ் AI Hackathons, தமிழ் தரவுத்தொகுப்புகள் உருவாக்கம், மற்றும் மென்பொருள் நிரலாக்கப் பட்டறைகள்.</p>
          </div>

          <div className="activity-card">
            <div className="act-icon-box amber-bg">
              <Feather size={22} />
            </div>
            <h4>இலக்கிய & கவியரங்கப் பிரிவு (Literary Wing)</h4>
            <p>கவியரங்கம், பட்டிமன்றம், சொற்பொழிவுகள், கட்டுரைப் போட்டிகள் மற்றும் மாதாந்திர இலக்கிய விவாதங்கள்.</p>
          </div>

          <div className="activity-card">
            <div className="act-icon-box rose-bg">
              <Heart size={22} />
            </div>
            <h4>பண்பாட்டு & விழாக்கள் பிரிவு (Cultural Wing)</h4>
            <p>முத்தமிழ் விழா, பொங்கல் பெருவிழா, தமிழ் புத்தாண்டு மற்றும் உலகத் தாய்மொழி தினப் பெருவிழாக்கள்.</p>
          </div>

          <div className="activity-card">
            <div className="act-icon-box emerald-bg">
              <Users size={22} />
            </div>
            <h4>சமூக & மாணவர் நலப் பிரிவு (Outreach Wing)</h4>
            <p>பள்ளி மாணவர்களுக்கான தமிழ் பயிலரங்குகள், புத்தகக் கண்காட்சி பயணங்கள் மற்றும் சமுதாய விழிப்புணர்வு நிகழ்வுகள்.</p>
          </div>

        </div>
      </div>

      {/* Institutional Mentorship & Collaboration */}
      <div className="about-mentors-card">
        <h3>வழிகாட்டுதல் & நிறுவனக் கூட்டாண்மை</h3>
        <p className="mentors-subtext">SRM தமிழ் மன்றத்தின் தொழில்நுட்ப மற்றும் இலக்கிய வழிகாட்டிகள்</p>
        
        <div className="mentors-grid">
          <div className="mentor-item">
            <div className="mentor-icon">
              <Building2 size={24} />
            </div>
            <div>
              <strong>SRM Institute of Science and Technology</strong>
              <span>Department of Computational Intelligence (CINTEL) • School of Computing</span>
            </div>
          </div>

          <div className="mentor-item">
            <div className="mentor-icon">
              <Award size={24} />
            </div>
            <div>
              <strong>ELROI Automation Pvt Ltd</strong>
              <span>தொழில்துறை கூட்டாண்மை & வழிகாட்டுதல் (Industry Mentor)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Join Card */}
      <div className="about-contact-card">
        <div className="contact-content-left">
          <h3>தமிழ் மன்றத்தில் இணைய விரும்புகிறீர்களா?</h3>
          <p>
            தமிழ் இலக்கிய ஆர்வமுள்ளவர்கள், தமிழ் கணினியியல் மற்றும் AI ஆய்வுகளில் ஈடுபட விரும்பும் மாணவர்கள் SRM தமிழ் மன்றத்தில் இணைந்து பணியாற்றலாம்!
          </p>
        </div>

        <div className="contact-details-box">
          <div className="contact-row">
            <MapPin size={16} className="contact-icon" />
            <span>SRM Nagar, Kattankulathur - 603203, Chengalpattu District, Tamil Nadu.</span>
          </div>
          <div className="contact-row">
            <Building2 size={16} className="contact-icon" />
            <span>School of Computing / Department of CINTEL</span>
          </div>
          <div className="contact-row">
            <Mail size={16} className="contact-icon" />
            <span>tamilmandram@srmist.edu.in</span>
          </div>
        </div>
      </div>

    </div>
  );
}

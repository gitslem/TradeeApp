import './BearBullBattle.css'

const BearBullBattle = () => {
  return (
    <div className="bear-bull-battle">
      {/* Bull (Left Side) - More Realistic */}
      <div className="bull-container">
        <svg className="bull" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
          {/* Bull Body - muscular and powerful */}
          <ellipse cx="150" cy="140" rx="70" ry="50" fill="#10b981" opacity="0.95"/>

          {/* Bull Legs - thicker and stronger */}
          <rect x="120" y="180" width="12" height="50" rx="6" fill="#059669"/>
          <rect x="145" y="180" width="12" height="50" rx="6" fill="#059669"/>
          <rect x="170" y="180" width="12" height="50" rx="6" fill="#059669"/>
          <rect x="195" y="180" width="12" height="50" rx="6" fill="#059669"/>

          {/* Bull Hooves */}
          <ellipse cx="126" cy="230" rx="8" ry="4" fill="#047857"/>
          <ellipse cx="151" cy="230" rx="8" ry="4" fill="#047857"/>
          <ellipse cx="176" cy="230" rx="8" ry="4" fill="#047857"/>
          <ellipse cx="201" cy="230" rx="8" ry="4" fill="#047857"/>

          {/* Bull Neck and Chest - powerful */}
          <path d="M 90 100 Q 85 120, 100 135 L 150 140 L 90 100" fill="#059669"/>

          {/* Bull Head - larger and more aggressive */}
          <ellipse cx="70" cy="90" rx="35" ry="30" fill="#10b981"/>

          {/* Bull Snout */}
          <ellipse cx="50" cy="95" rx="20" ry="15" fill="#059669"/>
          <ellipse cx="45" cy="100" rx="12" ry="9" fill="#047857"/>

          {/* Bull Nostrils */}
          <ellipse cx="40" cy="98" rx="4" ry="3" fill="#1f2937"/>
          <ellipse cx="50" cy="98" rx="4" ry="3" fill="#1f2937"/>

          {/* Bull Eye - intense and focused */}
          <circle cx="65" cy="80" r="6" fill="white"/>
          <circle cx="67" cy="80" r="4" fill="#1f2937"/>
          <circle cx="68" cy="79" r="2" fill="white" opacity="0.8"/>

          {/* Bull Horns - sharp and curved */}
          <path d="M 55 65 Q 45 45, 40 50 Q 38 55, 42 58" stroke="#d97706" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M 85 65 Q 95 45, 100 50 Q 102 55, 98 58" stroke="#d97706" strokeWidth="6" fill="none" strokeLinecap="round"/>

          {/* Horn tips - sharp */}
          <circle cx="40" cy="50" r="3" fill="#b45309"/>
          <circle cx="100" cy="50" r="3" fill="#b45309"/>

          {/* Bull Ears */}
          <ellipse cx="60" cy="70" rx="8" ry="12" fill="#059669" transform="rotate(-30 60 70)"/>
          <ellipse cx="80" cy="70" rx="8" ry="12" fill="#059669" transform="rotate(30 80 70)"/>

          {/* Bull Tail - swinging */}
          <path d="M 220 135 Q 240 130, 250 110 Q 255 100, 252 95" stroke="#059669" strokeWidth="6" fill="none" strokeLinecap="round" className="bull-tail"/>
          <path d="M 252 95 L 258 88 M 252 95 L 250 85" stroke="#047857" strokeWidth="4" strokeLinecap="round"/>

          {/* Bull muscle definition */}
          <path d="M 130 120 Q 140 125, 150 120" stroke="#047857" strokeWidth="2" fill="none" opacity="0.6"/>
          <path d="M 150 125 Q 160 130, 170 125" stroke="#047857" strokeWidth="2" fill="none" opacity="0.6"/>

          {/* Upward Arrows - momentum */}
          <g className="bull-arrows">
            <path d="M 100 40 L 100 10 M 90 20 L 100 10 L 110 20" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M 140 50 L 140 20 M 130 30 L 140 20 L 150 30" stroke="#10b981" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
          </g>
        </svg>
      </div>

      {/* VS Badge with Energy */}
      <div className="vs-text">
        <div className="vs-circle">
          <span>VS</span>
        </div>
        <div className="battle-energy">
          <div className="energy-wave energy-wave-1"></div>
          <div className="energy-wave energy-wave-2"></div>
          <div className="energy-wave energy-wave-3"></div>
        </div>
        <div className="battle-sparks">
          <div className="spark spark-1"></div>
          <div className="spark spark-2"></div>
          <div className="spark spark-3"></div>
          <div className="spark spark-4"></div>
          <div className="spark spark-5"></div>
          <div className="spark spark-6"></div>
        </div>
      </div>

      {/* Bear (Right Side) - More Realistic */}
      <div className="bear-container">
        <svg className="bear" viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
          {/* Bear Body - large and powerful */}
          <ellipse cx="150" cy="145" rx="75" ry="55" fill="#ef4444" opacity="0.95"/>

          {/* Bear Legs - thick and strong */}
          <rect x="110" y="185" width="14" height="45" rx="7" fill="#dc2626"/>
          <rect x="138" y="185" width="14" height="45" rx="7" fill="#dc2626"/>
          <rect x="166" y="185" width="14" height="45" rx="7" fill="#dc2626"/>
          <rect x="194" y="185" width="14" height="45" rx="7" fill="#dc2626"/>

          {/* Bear Paws */}
          <ellipse cx="117" cy="230" rx="10" ry="5" fill="#b91c1c"/>
          <ellipse cx="145" cy="230" rx="10" ry="5" fill="#b91c1c"/>
          <ellipse cx="173" cy="230" rx="10" ry="5" fill="#b91c1c"/>
          <ellipse cx="201" cy="230" rx="10" ry="5" fill="#b91c1c"/>

          {/* Bear Claws */}
          <g className="bear-claws">
            <path d="M 112 230 L 108 235 M 117 230 L 117 235 M 122 230 L 126 235" stroke="#7c2d12" strokeWidth="3" strokeLinecap="round"/>
          </g>

          {/* Bear Hump - characteristic bear feature */}
          <ellipse cx="180" cy="120" rx="30" ry="25" fill="#dc2626"/>

          {/* Bear Neck */}
          <path d="M 210 105 Q 215 125, 200 140 L 150 145 L 210 105" fill="#dc2626"/>

          {/* Bear Head - large and menacing */}
          <ellipse cx="230" cy="95" rx="38" ry="35" fill="#ef4444"/>

          {/* Bear Ears - rounded */}
          <circle cx="210" cy="70" r="15" fill="#dc2626"/>
          <circle cx="250" cy="70" r="15" fill="#dc2626"/>
          <circle cx="210" cy="72" r="8" fill="#b91c1c"/>
          <circle cx="250" cy="72" r="8" fill="#b91c1c"/>

          {/* Bear Snout - protruding */}
          <ellipse cx="250" cy="105" rx="22" ry="18" fill="#dc2626"/>
          <ellipse cx="255" cy="110" rx="15" ry="12" fill="#b91c1c"/>

          {/* Bear Nose */}
          <ellipse cx="255" cy="108" rx="8" ry="6" fill="#1f2937"/>

          {/* Bear Mouth - growling */}
          <path d="M 245 115 Q 255 118, 265 115" stroke="#7c2d12" strokeWidth="2" fill="none" strokeLinecap="round"/>

          {/* Bear Teeth - showing aggression */}
          <g className="bear-teeth">
            <path d="M 248 115 L 248 120" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 255 115 L 255 120" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M 262 115 L 262 120" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </g>

          {/* Bear Eye - fierce */}
          <circle cx="235" cy="88" r="6" fill="white"/>
          <circle cx="236" cy="88" r="4" fill="#1f2937"/>
          <circle cx="237" cy="87" r="2" fill="white" opacity="0.8"/>

          {/* Bear Eyebrow - angry expression */}
          <path d="M 225 82 Q 230 80, 240 82" stroke="#b91c1c" strokeWidth="3" fill="none" strokeLinecap="round"/>

          {/* Attacking Arm - raised with claws out */}
          <g className="bear-attack-arm">
            <ellipse cx="80" cy="110" rx="18" ry="45" fill="#dc2626" transform="rotate(-45 80 110)"/>
            <ellipse cx="65" cy="95" rx="12" ry="10" fill="#b91c1c"/>
            {/* Extended Claws */}
            <path d="M 55 90 L 45 80 M 60 88 L 52 78 M 65 87 L 60 75 M 70 88 L 68 78 M 75 90 L 76 80" stroke="#7c2d12" strokeWidth="4" strokeLinecap="round"/>
          </g>

          {/* Downward Arrows - pressure */}
          <g className="bear-arrows">
            <path d="M 200 20 L 200 50 M 190 40 L 200 50 L 210 40" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M 160 10 L 160 40 M 150 30 L 160 40 L 170 30" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.7"/>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default BearBullBattle

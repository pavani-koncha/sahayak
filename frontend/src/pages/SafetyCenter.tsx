import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Car,
  HeartPulse,
  Flame,
  Shield,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const SAFETY_GUIDELINES = [
  {
    id: 'personal',
    title: 'Personal Safety & Threat Defense',
    icon: Shield,
    color: 'from-purple-600 to-indigo-700',
    summary: 'Immediate tactics when stalked, harassed, or facing physical intimidation.',
    steps: [
      'Trust your instincts immediately: If an environment or person feels unsafe, do not second-guess yourself.',
      'Head towards open public spaces: Move towards brightly lit shops, petrol stations, or transit stations.',
      'Activate SAHAYAK SOS: Broadcast your GPS location to family and emergency authorities before entering a dark alley.',
      'Create loud vocal presence: Shout "HELP" or "FIRE" (which draws faster bystander intervention than general screams).',
      'Keep your phone in hand: Have emergency dialer 112 or WhatsApp quick location share ready.'
    ],
    dos: [
      'Maintain eye contact if approached to show alertness and memorization of features.',
      'Walk briskly with head up and hands free.',
      'Inform a trusted emergency contact of your transit route.'
    ],
    donts: [
      'Do not wear dual noise-cancelling headphones in isolated streets.',
      'Do not accept open food, drinks, or unknown vehicle rides.'
    ]
  },
  {
    id: 'accident',
    title: 'Road Accident & Collision Triage',
    icon: Car,
    color: 'from-amber-600 to-orange-700',
    summary: 'Crucial first-responder protocol at a vehicle crash scene.',
    steps: [
      'Ensure Scene Safety: Do not become a second victim. Park safely, switch on hazard lights, and place a reflective warning triangle 50m behind.',
      'Check for Fire or Fuel Leaks: Turn off ignition of involved vehicles if accessible safely.',
      'Assess Casualties (ABC Protocol): Check Airway, Breathing, and Circulation.',
      'Call 112 / 108 Immediately: State exact highway kilometer stone, landmark, and number of injured.',
      'Control Severe Bleeding: Apply firm, direct pressure over wounds using clean cloth.'
    ],
    dos: [
      'Protect the cervical spine (neck): Keep the victim’s head stable without twisting.',
      'Reassure conscious victims and keep them calm and warm.'
    ],
    donts: [
      'DO NOT move an unconscious victim unless there is imminent danger of vehicle fire or explosion.',
      'DO NOT remove a motorcyclist’s helmet unless airway is obstructed and you are trained.'
    ]
  },
  {
    id: 'medical',
    title: 'Medical Emergency (Heart Attack, Stroke, CPR)',
    icon: HeartPulse,
    color: 'from-rose-600 to-red-700',
    summary: 'Life-saving measures during cardiac arrest, severe asthma, or stroke.',
    steps: [
      'Recognize Cardiac Arrest: Sudden collapse, unresponsiveness, and absence of normal breathing.',
      'Start Hands-Only CPR: Place both hands centered on breastbone. Push hard and fast at 100-120 beats per minute (to the rhythm of "Stayin Alive").',
      'Stroke FAST Test: Face drooping, Arm weakness, Slurred speech, Time to call 112/108.',
      'Choking (Heimlich Maneuver): Stand behind person, wrap arms around waist, make a fist above navel, thrust inwards and upwards firmly.',
      'Severe Allergic Reaction (Anaphylaxis): Administer EpiPen if prescribed, keep airways clear, lay person flat.'
    ],
    dos: [
      'Continue uninterrupted chest compressions until ambulance paramedics take over.',
      'Loosen tight clothing around neck and waist.'
    ],
    donts: [
      'Do not give food, water, or oral pills to an unconscious or drowsy person.',
      'Do not attempt home remedies for suspected heart attack symptoms.'
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergency & Smoke Evacuation',
    icon: Flame,
    color: 'from-orange-600 to-red-800',
    summary: 'R.A.C.E. protocol for residential, office, or electrical fires.',
    steps: [
      'R - Rescue: Remove anyone in immediate danger from the room if safe.',
      'A - Alarm: Trigger building fire alarm and dial 101 / 112 immediately.',
      'C - Confine: Close doors behind you to slow smoke and fire propagation.',
      'E - Evacuate: Move down stairwells immediately. Never use elevators.',
      'Stay Low in Smoke: Toxic gases rise. Crawl on hands and knees where air is cleaner.'
    ],
    dos: [
      'Touch door handles with the back of your hand; if hot, do not open.',
      'Cover mouth and nose with a damp cloth if available.',
      'Stop, Drop, and Roll if your clothing catches fire.'
    ],
    donts: [
      'NEVER re-enter a burning building to retrieve belongings or pets.',
      'Do not throw water on electrical fires or burning oil pans.'
    ]
  },
  {
    id: 'unsafe',
    title: 'Unsafe Situations & Discreet Alerting',
    icon: AlertTriangle,
    color: 'from-indigo-600 to-purple-800',
    summary: 'How to manage suspicious surveillance, cab deviations, or tense escalations.',
    steps: [
      'Cab / Auto Route Deviation: Share live trip link with emergency contacts immediately. Call someone and loudly state the driver’s plate number.',
      'Atmosphere De-escalation: Speak with a calm, neutral tone. Do not match aggressive postures or exchange insults.',
      'Create an Artificial Distraction: Drop a water bottle or enter a store requesting to charge your phone or use a restroom.',
      'Silent Alarm: Use SAHAYAK SOS with your screen dimmed to notify your network without antagonizing the situation.'
    ],
    dos: [
      'Memorize vehicle registration, color, and distinctive driver features.',
      'Look for nearby security guards, CCTV cameras, or crowded storefronts.'
    ],
    donts: [
      'Do not corner an agitated individual.',
      'Do not hesitate to leave your belongings behind if flight is necessary for survival.'
    ]
  }
];

export const SafetyCenter: React.FC = () => {
  const [openCard, setOpenCard] = useState<string>('personal');

  return (
    <div className="min-h-screen bg-slate-950 pb-24 lg:pb-12 text-slate-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Emergency Safety Center</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Standard operating procedures and first-response protocols for crisis situations.
          </p>
        </div>

        {/* MANDATORY PROMINENT DISCLAIMER */}
        <div className="p-5 bg-red-950/70 border-2 border-red-700/80 rounded-3xl text-slate-200 flex items-start gap-4 shadow-xl">
          <div className="p-2.5 bg-red-600 text-white rounded-2xl shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-xs sm:text-sm">
            <strong className="text-white text-base font-extrabold block">
              Official Emergency Disclaimer
            </strong>
            <p className="text-red-200 leading-relaxed">
              <strong>Sahayak does not replace professional emergency services.</strong> In life-threatening emergencies, road accidents, or medical crises, you must immediately contact professional first responders by dialing <strong>112</strong>, <strong>108</strong>, or <strong>100</strong>. This guidance is for first-responder awareness only.
            </p>
          </div>
        </div>

        {/* GUIDELINES ACCORDION / LIST */}
        <div className="space-y-4">
          {SAFETY_GUIDELINES.map((item) => {
            const Icon = item.icon;
            const isOpen = openCard === item.id;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenCard(isOpen ? '' : item.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-800/40 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-white">{item.title}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">{item.summary}</p>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-5 sm:p-6 pt-0 border-t border-slate-800/80 space-y-5 animate-fadeIn">
                    {/* Action Steps */}
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 mb-2">
                        Priority Action Protocol:
                      </h3>
                      <ol className="space-y-2 text-xs sm:text-sm text-slate-300 list-decimal list-inside leading-relaxed">
                        {item.steps.map((s, idx) => (
                          <li key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Dos & Don'ts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                      <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-2xl p-4 space-y-2">
                        <span className="font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase text-xs">
                          <CheckCircle className="w-4 h-4 text-emerald-400" /> What to Do
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {item.dos.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-red-950/30 border border-red-800/60 rounded-2xl p-4 space-y-2">
                        <span className="font-extrabold text-red-400 flex items-center gap-1.5 uppercase text-xs">
                          <AlertTriangle className="w-4 h-4 text-red-400" /> What NOT to Do
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {item.donts.map((d, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-red-400 font-bold">•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

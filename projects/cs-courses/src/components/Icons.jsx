// Minimal inline icon set (no dependency). Each is a 24x24 stroke icon.
const s = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Play = (p) => <svg {...s} {...p}><polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" /></svg>
export const Pause = (p) => <svg {...s} {...p}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" /><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" /></svg>
export const StepF = (p) => <svg {...s} {...p}><polygon points="5 4 15 12 5 20 5 4" fill="currentColor" stroke="none" /><line x1="19" y1="5" x2="19" y2="19" /></svg>
export const StepB = (p) => <svg {...s} {...p}><polygon points="19 20 9 12 19 4 19 20" fill="currentColor" stroke="none" /><line x1="5" y1="19" x2="5" y2="5" /></svg>
export const Reset = (p) => <svg {...s} {...p}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
export const Shuffle = (p) => <svg {...s} {...p}><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
export const Search = (p) => <svg {...s} {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
export const Sun = (p) => <svg {...s} {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
export const Moon = (p) => <svg {...s} {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
export const Sort = (p) => <svg {...s} {...p}><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="14" y2="12"/><line x1="4" y1="18" x2="9" y2="18"/></svg>
export const Graph = (p) => <svg {...s} {...p}><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><line x1="7" y1="7" x2="10.5" y2="16"/><line x1="17" y1="7" x2="13.5" y2="16"/><line x1="7" y1="6" x2="16.5" y2="6"/></svg>
export const Tree = (p) => <svg {...s} {...p}><circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="13" r="2.2"/><circle cx="18" cy="13" r="2.2"/><circle cx="18" cy="20" r="2.2"/><line x1="10.5" y1="6.5" x2="7.5" y2="11.5"/><line x1="13.5" y1="6.5" x2="16.5" y2="11.5"/><line x1="18" y1="15.2" x2="18" y2="17.8"/></svg>
export const Grid = (p) => <svg {...s} {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>
export const Text = (p) => <svg {...s} {...p}><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
export const Lock = (p) => <svg {...s} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
export const Layers = (p) => <svg {...s} {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
export const Book = (p) => <svg {...s} {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
export const Compress = (p) => <svg {...s} {...p}><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
export const Key = (p) => <svg {...s} {...p}><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/></svg>
export const Sigma = (p) => <svg {...s} {...p}><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>
export const Function = (p) => <svg {...s} {...p}><path d="M9 17c0 1.5-1 3-3 3M14 7c0-1.5 1-3 3-3M5 12h11"/><path d="M19 5c-3 0-4 2-5 7s-2 7-5 7"/></svg>
export const Code = (p) => <svg {...s} {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
export const Database = (p) => <svg {...s} {...p}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
export const Chip = (p) => <svg {...s} {...p}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
export const Globe = (p) => <svg {...s} {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>

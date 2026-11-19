/** Who the 3018 card speaks to: the messages and links differ. */
export type Stop3018Audience = 'student' | 'relative';

/** External resources of the e-Enfance association reachable from the card. */
export type Stop3018Link =
  /** What harassment is. */
  | 'harassment'
  /** Advice for young people or parents, depending on the audience. */
  | 'faq'
  /** "Am I being harassed?" quiz, for students only. */
  | 'quiz';

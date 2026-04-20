// Rule-based AI coach engine — personalised responses based on user profile

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const getTime = () => {
  const h = new Date().getHours()
  if (h < 6) return 'nuit'
  if (h < 12) return 'matin'
  if (h < 14) return 'midi'
  if (h < 18) return 'après-midi'
  if (h < 22) return 'soir'
  return 'nuit'
}

export function getCoachResponse(input, profile, iaState, logs) {
  const text = input.toLowerCase()
  const name = profile?.name || 'champion'
  const streak = logs?.streak ?? 0
  const weight = profile?.weight ?? 75
  const maxPull = profile?.maxPullups ?? 8
  const maxPush = profile?.maxPushups ?? 30
  const maxDips = profile?.maxDips ?? 15
  const maxHang = profile?.maxHangSeconds ?? 30
  const calMult = iaState?.cal_multiplier ?? 1.0
  const repMult = iaState?.rep_multiplier ?? 1.0
  const time = getTime()
  const equip = profile?.equip ?? {}

  // ── Salutation ───────────────────────────────────────────────────────────
  if (/^(bonjour|salut|hello|hey|coucou|yo|bonsoir|hi|cc)\b/.test(text)) {
    return pick([
      `Hey ${name} 💪 On est en ${time}, parfait pour ${time === 'matin' ? 'lancer la journée fort' : time === 'soir' ? 'faire le bilan' : 'travailler'}. Qu'est-ce qu'on traite aujourd'hui ?`,
      `Salut ${name} ! Streak à ${streak} jour${streak > 1 ? 's' : ''} — ${streak > 0 ? 'continue comme ça 🔥' : 'on repart ce soir !'} Dis-moi ce que tu veux.`,
      `${name} ! Présent. C'est ça la rigueur. Nutrition, séance, progression — qu'est-ce qu'on attaque ?`,
    ])
  }

  // ── Progression / résultats ───────────────────────────────────────────────
  if (/progr|amélio|résult|évolut|changement|niveau|où j'en suis/.test(text)) {
    const pullLevel = maxPull < 5 ? 'débutant' : maxPull < 12 ? 'intermédiaire' : maxPull < 20 ? 'avancé' : 'élite'
    return `Voilà où tu en es ${name} :\n• Tractions : ${maxPull} reps max (niveau ${pullLevel})\n• Pompes : ${maxPush} reps max\n• Dips : ${maxDips} reps max\n• Suspendu : ${maxHang}s max\n• IA reps ×${repMult.toFixed(2)} · calories ×${calMult.toFixed(2)}\n\n${repMult > 1.05 ? 'Tu assimiles bien la charge — on peut pousser davantage.' : 'Reste régulier(e), chaque séance compte.'}`
  }

  // ── Séance / entraînement ────────────────────────────────────────────────
  if (/séance|entraîn|exercice|workout|sport|programme|muscl|calisthen/.test(text)) {
    const equipList = Object.entries(equip).filter(([, v]) => v).map(([k]) => ({
      pullupBar: 'barre de traction', dipBars: 'barres de dips', rings: 'anneaux', parallettes: 'parallettes', kettlebell: 'kettlebell', jumpRope: 'corde à sauter', vest: 'gilet lesté', abWheel: 'roue abdominale'
    }[k])).filter(Boolean)
    return `Pour ton profil (${maxPull} tractions / ${maxPush} pompes), ${repMult > 1.1 ? 'le multiplicateur ×' + repMult.toFixed(2) + ' montre que tu assimiles — on peut augmenter l\'intensité' : 'maintiens la progression douce'}.\n\nTon équipement : ${equipList.length > 0 ? equipList.join(', ') : 'poids de corps uniquement'} — les séances s'adaptent automatiquement. Utilise le tab Séance pour démarrer.`
  }

  // ── Nutrition ────────────────────────────────────────────────────────────
  if (/manger|nourriture|calorie|protéine|diète|nutrition|faim|poids|masse|sèche/.test(text)) {
    const protTarget = Math.round(weight * 1.8)
    return `À ${weight} kg, ta cible protéines est ~${protTarget}g/jour. Ton multiplicateur calories est ×${calMult.toFixed(2)} — ${calMult > 1.0 ? 'légère augmentation : tu dépenses bien' : calMult < 1.0 ? 'légère réduction : on recalibre' : 'parfaitement calibré'}.\n\nRègle d'or : protéines à chaque repas, glucides complexes autour des séances, lipides sains le soir. Ta liste de courses est déjà optimisée pour ça.`
  }

  // ── Repos / récupération ─────────────────────────────────────────────────
  if (/repos|fatigue|récup|douleur|courbature|mal aux|stress|sommeil|dormir/.test(text)) {
    return pick([
      `Le repos, c'est là que tu progresses vraiment. Tes muscles se reconstruisent pendant le sommeil — vise 7h30 minimum. Si tu es courbaturé(e) : marche 20 min + mobilité articulaire, pas de séance intense.`,
      `Écoute ton corps ${name}. Une douleur articulaire = stop. Des courbatures musculaires = OK pour une séance légère ou du cardio doux. Priorité au sommeil et à l'hydratation.`,
    ])
  }

  // ── Eau / hydratation ────────────────────────────────────────────────────
  if (/eau|hydrat|boire|soif|litre/.test(text)) {
    const waterTarget = Math.round(weight * 0.033 * 10) / 10
    return `À ${weight} kg, vise ${waterTarget}L d'eau minimum par jour. En séance, ajoute 500-700ml. Un truc simple : 1 grand verre dès le réveil, 1 avant chaque repas. L'hydratation impacte directement tes performances — trace ça dans le dashboard !`
  }

  // ── Streak ───────────────────────────────────────────────────────────────
  if (/streak|série|consécutif|constanc|régularit/.test(text)) {
    if (streak === 0) return `Ton streak est à 0 pour l'instant. Fais ton bilan ce soir dans le dashboard — un seul geste et tu relances la machine. La régularité bat l'intensité.`
    if (streak < 5) return `${streak} jour${streak > 1 ? 's' : ''} de suite — bien démarré. Vise les 7 jours, puis les 30. Chaque bonsoir compte ${name}.`
    if (streak < 14) return `${streak} jours consécutifs ! Tu construis une vraie habitude. Autour de 21 jours, ça devient automatique — accroche-toi.`
    return `${streak} jours sans interruption — c'est du niveau pro ${name}. La discipline est devenue ton identité. Continue, tu inspires. 🔥`
  }

  // ── Tractions ────────────────────────────────────────────────────────────
  if (/traction|pull.?up|chin.?up|barre/.test(text)) {
    const advice = maxPull < 5
      ? 'Concentre-toi sur les rétractions scapulaires et les négatifs lents (5s descente). Les bandes élastiques peuvent aider.'
      : maxPull < 10 ? 'Ajoute les variantes de prises : large, neutre, supination. Travaille aussi les isométriques (tenir en haut).'
      : maxPull < 20 ? 'Excellent niveau ! Expérimente les archer pull-ups et les L-sit pull-ups pour la progressivité.'
      : 'Niveau élite ! Muscle-up et one-arm pull-up progressions sont ta prochaine étape.'
    return `${maxPull} tractions max — ${advice}\n\nN'oublie pas d'actualiser ton max dans le Profil pour que les reps restent calibrées. 📊`
  }

  // ── Pompes ───────────────────────────────────────────────────────────────
  if (/pompe|push.?up|pectoral|poitrine|pecto/.test(text)) {
    const advice = maxPush < 15
      ? 'Maîtrise la forme parfaite d\'abord : corps gainé, coudes à 45°, ROM complète.'
      : maxPush < 30 ? 'Ajoute les variantes : diamant, pike, déclinées sur chaise.'
      : maxPush < 50 ? 'Niveau solide. Handstand push-up progressions et pompes à un bras sont tes défis.'
      : 'Niveau élite ! Planche push-ups, archer push-ups, pompes sur anneaux.'
    return `${maxPush} pompes max — ${advice}`
  }

  // ── Dips ─────────────────────────────────────────────────────────────────
  if (/dip|tricep|chaise/.test(text)) {
    return `${maxDips} dips max. ${equip.dipBars ? 'Avec tes barres de dips, tu peux faire des vrais dips — incline légèrement le buste pour cibler plus la poitrine.' : 'Sans barres, les dips sur chaise sont un excellent substitut — pied plus loin = plus dur.'} Cible : séries à 70-80% de ton max pour le volume.`
  }

  // ── Suspension / grip ────────────────────────────────────────────────────
  if (/suspendu|hang|accroché|grip|poigne|avant-bras/.test(text)) {
    return `${maxHang}s de suspension max — le grip, c'est la base de tout en calisthenics. Pratique les dead hangs actifs (omoplates engagées) à chaque session de traction. Objectif : dépasser les 60s pour un grip solide. Actualise ton max dans le Profil.`
  }

  // ── Motivation ───────────────────────────────────────────────────────────
  if (/motiv|décourag|abandon|lâcher|arrêt|difficile|dur|plus envie|flemme/.test(text)) {
    return pick([
      `Tu te souviens pourquoi tu as commencé ${name} ? Cette raison n'a pas changé. La difficulté d'aujourd'hui, c'est la force de demain.`,
      `Le corps réussit là où l'esprit décide de ne pas lâcher. ${streak} jours de streak — tu as déjà prouvé que tu en es capable. Fais juste 10 minutes. Juste 10.`,
      `Chaque athlète a des jours sans. La différence entre ceux qui progressent et les autres ? Ils s'entraînent quand même, même à 60%. Fais le minimum — le reste suivra naturellement.`,
    ])
  }

  // ── Compléments / supplémentation ────────────────────────────────────────
  if (/whey|créatine|supplément|complément|protéine en poudre|bcaa/.test(text)) {
    return `La nourriture réelle d'abord. La créatine monohydrate (3-5g/jour) est la seule supplémentation avec preuves solides pour la force. La whey peut compléter si tu n'atteins pas ~${Math.round(weight * 1.8)}g protéines/jour. Mais ta liste de courses couvre l'essentiel.`
  }

  // ── Équipement ───────────────────────────────────────────────────────────
  if (/équipement|matériel|barre|anneaux|parallette|kettlebell|corde/.test(text)) {
    return `Ton équipement actuel :\n${equip.pullupBar ? '✅' : '❌'} Barre de traction\n${equip.dipBars ? '✅' : '❌'} Barres de dips\n${equip.rings ? '✅' : '❌'} Anneaux\n${equip.parallettes ? '✅' : '❌'} Parallettes\n${equip.kettlebell ? '✅' : '❌'} Kettlebell\n${equip.jumpRope ? '✅' : '❌'} Corde à sauter\n${equip.vest ? '✅' : '❌'} Gilet lesté\n${equip.abWheel ? '✅' : '❌'} Roue abdominale\n\nActualise dans le Profil — les séances s'adaptent automatiquement !`
  }

  // ── Défauts ───────────────────────────────────────────────────────────────
  return pick([
    `Bonne question ${name}. Précise ta demande : nutrition, séance, récupération, ou progression ?`,
    `Je t'écoute ${name}. Tu veux qu'on parle de ton entraînement, de ta diète, ou de ton mental ?`,
    `Utilise les raccourcis en bas pour les thèmes fréquents, ou pose-moi n'importe quelle question sur ton coaching.`,
  ])
}

export const QUICK_REPLIES = [
  { label: '📊 Mon bilan', text: 'Où j\'en suis dans ma progression ?' },
  { label: '💪 Conseils séance', text: 'Conseils pour ma séance aujourd\'hui' },
  { label: '🥗 Nutrition', text: 'Conseils nutrition pour moi' },
  { label: '🔥 Motivation', text: 'J\'ai du mal à me motiver' },
  { label: '💤 Récupération', text: 'J\'ai des courbatures aujourd\'hui' },
  { label: '💧 Eau', text: 'Combien d\'eau dois-je boire ?' },
  { label: '🏆 Mon streak', text: 'Comment est mon streak ?' },
  { label: '🔧 Équipement', text: 'Quel équipement j\'ai ?' },
]

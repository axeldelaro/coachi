// Coach IA — Moteur de reponses etendu, 300+ variantes, style humain
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
const pickW = (weighted) => { const r = Math.random(); let s = 0; for (const [item, w] of weighted) { s += w; if (r < s) return item } return weighted[0][0] }

const getTime = () => { const h = new Date().getHours(); if (h < 6) return 'nuit'; if (h < 9) return 'matin'; if (h < 12) return 'matinee'; if (h < 14) return 'heure du dejeuner'; if (h < 17) return 'apres-midi'; if (h < 20) return 'debut de soiree'; if (h < 23) return 'soiree'; return 'nuit' }
const getDay = () => ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][new Date().getDay()]
const getWorkoutDay = () => { const d = new Date().getDay(); return ['Repos', 'Push', 'Pull', 'Core', 'Repos', 'Intensite', 'Volume'][d] }

export function getCoachResponse(input, profile, iaState, logs) {
  const text = input.toLowerCase().trim()
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
  const day = getDay()
  const equip = profile?.equip ?? {}
  const water = logs?.water ?? 0
  const protTarget = Math.round(weight * 1.8)
  const waterTarget = Math.round(weight * 0.033 * 10) / 10
  const pullLevel = maxPull < 5 ? 'debutant' : maxPull < 10 ? 'intermediaire' : maxPull < 18 ? 'avance' : 'elite'
  const pushLevel = maxPush < 15 ? 'debutant' : maxPush < 35 ? 'intermediaire' : maxPush < 60 ? 'avance' : 'elite'
  const equipList = Object.entries(equip).filter(([, v]) => v).map(([k]) => ({ pullupBar: 'barre', dipBars: 'barres dips', rings: 'anneaux', parallettes: 'parallettes', kettlebell: 'kettlebell', jumpRope: 'corde', vest: 'gilet leste', band: 'elastiques', abWheel: 'roue' }[k])).filter(Boolean)

  // SALUTATION
  if (/^(bonjour|salut|hello|hey|coucou|yo|bonsoir|hi|cc|slt|bjr|wesh|allo|hola)\b/.test(text)) {
    return pick([
      `Hey ${name} ! Bien que tu passes. On est ${day} ${time} — qu'est-ce qu'on traite aujourd'hui ?`,
      `Salut ${name} ! Streak a ${streak} jour${streak > 1 ? 's' : ''} — ${streak > 7 ? 'serieux ca !' : streak > 0 ? 'continue.' : 'on repart ce soir !'}. Dis-moi tout.`,
      `${name}. Toujours la. C'est exactement ca la discipline. Qu'est-ce qui t'amene ?`,
      `Hey ! Je suis la, pret. Nutrition, seance, recup, mental — balance.`,
      `Yo ${name} ! Je connais ton profil complet. Pose-moi n'importe quoi.`,
      `Bonsoir ! Tu passes en ${time} — question sur la journee ou sur demain ?`,
      `${name} ! ${streak > 0 ? streak + ' jours de streak — on maintient.' : 'Frais comme un debut.'} Qu'est-ce qu'on dit ?`,
      `Salut. J'etais la, j'attendais. Nutrition, corpo, tech, mental — tout passe.`,
    ])
  }

  // CA VA / COMMENT TU VAS
  if (/^(ca va|ca va\??|comment tu vas|comment vas.tu|t'es comment|tu vas bien|how are you|comment ca va)\??/.test(text)) {
    return pick([
      `Moi ? Je suis un algo donc toujours au top haha. Et toi ${name} — vraiment, comment tu te sens aujourd'hui physiquement ET mentalement ? Donne-moi un chiffre de 1 a 10.`,
      `Je suis operationnel 24h/24 ! Mais la vraie question c'est toi. Bien dormi cette nuit ? Bien mange ?`,
      `Un coach IA ne se fatigue pas donc je vais super bien merci ! Toi par contre — corps et tete, ca donne quoi ?`,
      `Au max comme toujours. Et toi ${name} ? Raconte — journee difficile ou tu es en forme ?`,
    ])
  }

  // MERCI
  if (/^(merci|thanks|thank you|c'est cool|top|parfait|nickel|super|genial|excellent)\b/.test(text)) {
    return pick([
      `Avec plaisir ${name} ! C'est pour ca que je suis la. Autre chose ?`,
      `Pas de souci ! T'as d'autres questions ? Je suis la.`,
      `Content d'avoir aide ! Continue sur ta lancee — tu fais du bon boulot.`,
      `De rien ! Et n'oublie pas : action > reflexion. Maintenant tu sais, go.`,
    ])
  }

  // QUI ES-TU / CAPACITES
  if (/que (peux|sais).tu|a quoi tu sers|c'est quoi ton role|tu es (quoi|qui|un bot|une ia|un robot)|tu peux (faire|m'aider)/.test(text)) {
    return pick([
      `Je suis ton coach IA personnel. J'ai acces a : ton poids (${weight}kg), tes maxima (${maxPull} tractions, ${maxPush} pompes, ${maxDips} dips, ${maxHang}s suspension), ton equipement (${equipList.join(', ') || 'a configurer'}), ton streak (${streak}j), tes multiplicateurs (calories x${calMult.toFixed(2)}, reps x${repMult.toFixed(2)}).\n\nJe reponds sur : nutrition, technique, recup, mental, progression, plateau, blessures, programme. Teste-moi.`,
      `Un coach IA qui connait TON profil. Pas de reponses generiques — tout est base sur tes donnees. Pose n'importe quelle question sur ton corps, ta seance, ta bouffe, ta tete.`,
      `Techniquement un algorithme. En pratique : un coach disponible a ${time} qui connait ta progression. ${maxPull} tractions, ${maxPush} pompes, ${streak} jours de streak — je vois tout ca. Demande.`,
    ])
  }

  // PROGRESSION / STATS
  if (/progr|amelio|resultat|evolution|changement|niveau|ou j'en suis|stats|performances|bilan/.test(text)) {
    return pick([
      `Tableau de bord ${name} :\n• Tractions : ${maxPull} reps (${pullLevel})\n• Pompes : ${maxPush} reps (${pushLevel})\n• Dips : ${maxDips} reps\n• Suspension : ${maxHang}s\n• Reps IA x${repMult.toFixed(2)} | Calories x${calMult.toFixed(2)}\n• Streak : ${streak}j\n\n${repMult > 1.1 ? 'Multiplicateur reps positif — tu assimiles bien. Augmente tes maxima.' : 'Continue la regularite — les chiffres vont monter.'}`,
      `Honnêtement ? Tes stats parlent. ${maxPull} tractions et ${maxPush} pompes — ${maxPull > 10 && maxPush > 30 ? 'vrai niveau, sois fier.e' : 'base solide a construire'}. Multiplicateur IA a x${repMult.toFixed(2)} montre ${repMult >= 1.0 ? 'que tu geres la charge.' : 'un besoin de recup.'}. Quelle zone tu veux progresser ?`,
      `Voila ou t'en es ${name}. Pull : ${maxPull} (${pullLevel}). Push : ${maxPush} (${pushLevel}). Le streak a ${streak}j et calories x${calMult.toFixed(2)} disent ${calMult > 1.0 ? 'que le corps travaille fort.' : 'que tu es sur un plan precis.'}`,
      `Depuis le debut tu as construit : ${maxPull} tractions max, ${maxPush} pompes max. Le systeme IA a ajuste tes reps a x${repMult.toFixed(2)} et calories a x${calMult.toFixed(2)}. ${streak > 5 ? 'Et ' + streak + 'j de streak — vraiment solide.' : 'Continue et le streak va s\'envoler.'}`,
    ])
  }

  // SEANCE / ENTRAINEMENT
  if (/seance|entraîn|exercice|workout|sport|programme|muscl|calisthen|s'entrainer|bodyweight/.test(text)) {
    return pick([
      `On est ${day} — programme prevu : ${getWorkoutDay()}. Avec ${equipList.length > 0 ? equipList.join(', ') : 'poids de corps'}, tes exercices sont deja adaptes. Reps calcules a x${repMult.toFixed(2)} pour toi.\n\nDemarre dans l'onglet Seance. Question precise ?`,
      `Entrainement aujourd'hui ? Ecoute d'abord : bien dormi ? Bien mange ? Si oui — donne tout. Si non — fais quand meme mais a 75-80%. La regularite bat l'intensite sporadique.`,
      `Le calisthenics c'est un jeu long. ${maxPull} tractions et ${maxPush} pompes c'est ${maxPull > 8 && maxPush > 20 ? 'deja un niveau respectable.' : 'la base qui se construit.'}. Chaque seance compte. Qu'est-ce qui te bloque ?`,
      `Astuce pour ta seance du ${day} : echauffement 5 min (jumping jacks + mobilite epaules + rotations hanches), puis programme. La plupart zappent l'echauffement et progressent 30% moins vite.`,
      `${day.charAt(0).toUpperCase() + day.slice(1)}, ${time}. Multiplicateur reps x${repMult.toFixed(2)} — ${repMult > 1.1 ? 'tu es en forme, pousse un peu.' : repMult < 0.9 ? 'corps en recup — reste dans les reps calcules.' : 'niveau de base — execute proprement.'}`,
    ])
  }

  // NUTRITION - NIVEAU 1
  if (/nutrition pour moi|conseils nutrition|diete|manger|nourriture/.test(text)) {
    return pick([
      `Nutrition. La base de tout. Tu veux qu'on parle de tes proteines, de tes glucides, ou de tes graisses (lipides) ?`,
    ])
  }
  // NUTRITION - NIVEAU 2 (Protéines)
  if (/mes proteines|mes protéines/.test(text)) {
    return pick([
      `Les proteines sont tes briques de construction. A ${weight}kg, tu vises ~${protTarget}g/jour. Tu y arrives facilement, ou ca bloque souvent ?`,
    ])
  }
  // NUTRITION - NIVEAU 3 (Protéines bloquent)
  if (/ca bloque|ça bloque/.test(text)) {
    return pick([
      `Ok, on va fractionner. Quel repas est systematiquement le plus faible en proteines pour toi ? Le petit-dej, le dejeuner, ou le diner ?`,
    ])
  }
  // NUTRITION - NIVEAU 4 (Repas spécifiques)
  if (/petit.dej|petit dej/.test(text)) {
    return pick([
      `Classique. Ajoute simplement 2 oeufs (12g) ou 150g de skyr/fromage blanc (15g) a ton avoine. C'est rapide et ca regle le probleme du matin.`,
    ])
  }
  if (/le dejeuner|le déjeuner/.test(text)) {
    return pick([
      `Au dejeuner, la regle est simple : la portion de viande, de poisson ou de tofu doit faire la taille de ta main (paume + doigts). Double la si necessaire.`,
    ])
  }
  if (/le diner|le dîner/.test(text)) {
    return pick([
      `Si tu n'as plus tres faim le soir mais qu'il te manque des proteines, prends une source legere : un shaker de whey, ou du cottage cheese. Ca passe tout seul.`,
    ])
  }
  // NUTRITION - NIVEAU 3 (Protéines OK)
  if (/j'y arrive facilement/.test(text)) {
    return pick([
      `Parfait. Si tes proteines sont a ${protTarget}g et ton entrainement est regulier, la construction musculaire est mathematiquement garantie. Patience.`,
    ])
  }

  // NUTRITION - NIVEAU 2 (Glucides)
  if (/mes glucides/.test(text)) {
    return pick([
      `Les glucides = ton energie pure. Te sens-tu souvent en manque d'energie pendant la seance, ou plutot gonfle apres les repas ?`,
    ])
  }
  // NUTRITION - NIVEAU 3 (Glucides réponses)
  if (/manque d'energie|manque d'énergie/.test(text)) {
    return pick([
      `C'est un manque de glycogene. Mange une banane, des dattes ou un peu de miel 30 minutes avant l'entrainement. Ton energie va exploser.`,
    ])
  }
  if (/plutot gonfle|gonflé/.test(text)) {
    return pick([
      `Tu manges peut-etre trop de glucides d'un coup (riz, pates) ou pas assez de fibres. Garde la grosse portion de glucides pour le repas APRES la seance.`,
    ])
  }

  // NUTRITION - NIVEAU 2 (Lipides)
  if (/mes graisses|mes lipides/.test(text)) {
    return pick([
      `Ne coupe JAMAIS les graisses. Elles gerent ta testosterone et tes hormones. Tu consommes assez d'avocat, d'huile d'olive et d'oleagineux (amandes, noix) ?`,
    ])
  }
  // NUTRITION - NIVEAU 3 (Lipides réponses)
  if (/assez de lipides|oui pour les graisses/.test(text)) {
    return pick([
      `Parfait. C'est le secret d'un systeme hormonal sain et d'une bonne recuperation nerveuse.`,
    ])
  }
  if (/pas assez de lipides|non pour les graisses/.test(text)) {
    return pick([
      `Attention. Ajoute 1 cuillere a soupe d'huile d'olive par jour sur tes legumes, ou 15g d'amandes en collation. Ca fait une enorme difference.`,
    ])
  }

  // SOMMEIL
  if (/sommeil|dormir|dors mal|insomnie|reveill|fatigue le matin|pas assez dormi|nuit agitee/.test(text)) {
    return pick([
      `Le sommeil c'est ton anabolisant naturel — GRATUIT. Sans 7h30 minimum : cortisol en hausse, progression freinee, plus d'erreurs. Non-negociable.\nPratique : pas d'ecran 1h avant, chambre a 18C, meme heure de coucher.`,
      `Insomnie ou juste pas assez d'heures ? C'est different. Le stress est souvent le coupable. Le sport regulier ameliore la qualite du sommeil — mais pas juste avant de dormir (pas de seance apres 21h).`,
      `${name}, le sommeil c'est 50% des resultats. La GH (hormone de croissance) pic pendant le sommeil profond. Optimise ca et tes progres vont s'accelerer visiblement.`,
      `Privation de sommeil + entrainement intense = catabolisme net. Si tu dors moins de 6h, baisse l'intensite aujourd'hui. Recupere d'abord, seance apres.`,
      `Astuce sommeil : 200mg de magnesium glycinate avant de dormir, tisane valériane, ou simplement 10 min de respiration lente (4-7-8). Ca change vraiment la qualite du sommeil.`,
    ])
  }

  // MENTAL / STRESS
  if (/stress|anxieux|anxiete|tete|mental|psych|deprim|moral|humeur|burnout|demotive|pression/.test(text)) {
    return pick([
      `L'entrainement est l'un des meilleurs anti-stress prouvés. 20-30 min d'effort modere libere des endorphines, reduit le cortisol. Mais si le stress est trop fort, forcer une seance intense peut aggraver. Ecoute ton etat reel.`,
      `Le mental precede toujours le physique. Si t'es dans le dur mentalement, un walk de 20 min vaut mieux qu'une seance forcee que tu vas detester. Reprends demain avec la tete plus claire.`,
      `Ce que tu decris c'est humain. Meme les meilleurs athletes ont des periodes creuses. L'important : ne pas punir le corps quand l'esprit est deja en surcharge. Tu veux des strategies concretes ?`,
      `Stress + entrainement intense = surcharge totale. Ton corps ne distingue pas le stress du bureau du stress de la seance. Si t'es a bout : marche + bon repas + bonne nuit > seance a 100%.`,
      `Hm. Quand le moral est bas, l'effort minimum suffit. Meme 10 minutes de mouvement changent l'etat neurochimique. Juste faire QUELQUE CHOSE. Le reste suit.`,
      `La sante mentale et physique sont indissociables. Si ton mental flanche, ton physique suit. Est-ce que c'est passe ou c'est installe ? Dis-moi plus.`,
    ])
  }

  // REPOS / DOULEURS
  if (/repos|fatigue|recup|douleur|courbature|mal aux|blessure|trop fatigue|j'ai mal/.test(text)) {
    return pick([
      `Le repos c'est la ou tu PROGRESSES. Pendant l'effort tu stresses les fibres. C'est le sommeil et les jours off qui les reconstruisent plus fortes. Skip les jours de repos = resultats divises par 2.`,
      `Courbatures ? Bonne nouvelle — fibres musculaires sollicitees. Mais distingue DOMS (courbatures musculaires normales) vs douleur articulaire (stop absolu). Lequel des deux ?`,
      `Si t'es vraiment epuise, la seance peut attendre 24h. Pas d'arret definitif — juste du bon sens. Ta progression sur 6 mois compte plus qu'une seance isolee.`,
      `Recuperation active recommandee : marche 20-30 min, mobilite articulaire, etirements doux. PAS d'intensite. Un vrai jour de repos c'est actif, pas affale sur le canape.`,
      `J'entends. Le corps parle — faut l'ecouter. ${streak > 10 ? `Avec ${streak} jours de streak, tu merites peut-etre un vrai jour off.` : 'Reste dans le programme mais module l\'intensite.'} Ou t\'as mal exactement ?`,
      `Douleur aigue ou diffuse ? Aigue = stop cet exercice, consulte.Diffuse / courbatures = OK pour mouvement legers.La difference est importante.`,
    ])
    }

  // HYDRATATION
  if (/eau|hydrat|boire|soif|litre|deshydrat/.test(text)) {
    return pick([
      `A ${weight}kg : minimum ${waterTarget}L/jour. En seance : +500-700ml. Simple : 1 verre au lever, 1 avant chaque repas, 1 pendant seance, 1 apres. ${water > 0 ? `Tu as log ${water} verre${water > 1 ? 's' : ''} aujourd'hui — continue.` : 'Combien t\'as bu aujourd\'hui ?'}`,
      `Deshydratation a 2% = -10 a -20% de performance. C'est enorme. Et beaucoup de "fatigue" ou "manque de concentration" c'est juste ca. ${water < 4 ? 'Tu dois boire plus.' : 'Bonne hydratation.'}`,
      `${waterTarget}L minimum pour ${weight}kg. Si tu transpires beaucoup en seance, monte a ${Math.round((waterTarget + 0.7) * 10) / 10}L. Café et the comptent a moitie. Evite les sodas.`,
      `L'eau c'est gratuit et ca change tout : recuperation, concentration, performance. Log ta conso dans le dashboard pour le tracker. Objectif : ${waterTarget}L avant 18h.`,
    ])
  }

  // STREAK
  if (/streak|serie|consecutif|constanc|regularit|jours d'affilee|jours de suite/.test(text)) {
    if (streak === 0) return pick([
      `Streak a 0 — ca arrive. La question c'est pas le passe, c'est maintenant : fais ton bilan ce soir dans le dashboard. Un geste suffit a relancer.`,
      `Zero streak. OK. C'est pas une condamnation, c'est un point de depart. Ce soir : bilan du soir dans le dashboard. ${day === 'lundi' ? 'Et c\'est lundi — parfait pour reprendre.' : 'Aujourd\'hui est le bon moment.'}`,
      `0 jour. Pas de jugement. Ca se relance avec une seule action. Petit, concret, ce soir. Un bilan de 2 minutes et le compteur repart.`,
    ])
    if (streak < 5) return pick([
      `${streak} jour${streak > 1 ? 's' : ''} de suite — bien ! La premiere semaine c'est la plus difficile. Tiens jusqu'a 7 et le cerveau commence a reconnaitre l'habitude.`,
      `Quelques jours, c'est un debut. A ce stade beaucoup lachent.`,
    ])
    if (streak < 14) return pick([
      `${streak} jours — zone de construction d'habitude. Les neurosciences disent 21 jours pour ancrer une habitude. T'es dans la bonne trajectoire.`,
      `${streak}j de streak ! On commence a voir quelque chose de serieux. Autour de 2 semaines, les gens qui continuent developpent une vraie identite athletique.`,
    ])
    if (streak < 30) return pick([
      `${streak} jours. Pas commun du tout ${name}. La plupart abandonnent avant 2 semaines. Toi tu construis quelque chose de reel et durable.`,
      `Franchement impressionnant. ${streak} jours — l'habitude est ancree. Maintenant c'est une question d'identite, pas d'effort.`,
    ])
    return pick([
      `${streak} jours sans interruption. Niveau pro ${name}. La discipline est devenue qui tu es. Continue.`,
      `${streak}j. Je n'ai rien a dire a part : respect. La majorite des gens ne depassent pas 7 jours. Toi tu en es a ${streak}.`,
      `${streak} jours — c'est une transformation de personnalite, pas juste du sport. Tu n'es plus la meme personne qu'au jour 1. Felicitations.`,
    ])
  }

  // TRACTIONS
  if (/traction|pull.?up|chin.?up|tirage|barre de traction|tirer/.test(text)) {
    return pick([
      `${maxPull} tractions max (${pullLevel}). ${maxPull < 5 ? 'Focus : retractions scapulaires, dead hangs, negatifs 5s. La force vient.' : maxPull < 10 ? 'Ajoute les variantes : large, neutre, supination. Plus de volume.' : maxPull < 18 ? 'Archer pull-ups, L-sit pull-ups, typewriter — tes prochaines cibles.' : 'Muscle-up, one-arm progressions — le prochain niveau t\'attend.'}
Update ton max dans le Profil apres chaque test.`,
    `Pour progresser en tractions : Greasing the Groove (GtG). Faire quelques reps propres plusieurs fois dans la journee sans aller a l'echec. Ca marche vraiment. Essaie avec ta barre.`,
    `Les tractions c'est le roi. A ${maxPull} reps tu es ${maxPull < 5 ? 'en phase de construction — tout est normal' : maxPull < 12 ? 'intermediaire — variation et volume vont faire progresser vite' : 'a un niveau qui impressionne la plupart des gens'}. Question precise sur les tractions ?`,
    `Pour le volume en tractions : reste a 60-70% du max sur les series de volume. Une fois par semaine seulement, cherche le max. Ne va JAMAIS a l'echec en volume — seulement en test.`,
    `Prise large vs supination vs neutre — chacune cible differemment. Large : dos complet. Supination (paume vers toi) : biceps en priorite. Neutre : equilibre. Varie les trois.`,
  ])
}

// POMPES
if (/pompe|push.?up|pecto|poitrine|tricep.*push|developpe/.test(text)) {
  return pick([
    `${maxPush} pompes (${pushLevel}). ${maxPush < 15 ? 'Maitrise la forme : corps gaine, coudes a 45, descente complete.' : maxPush < 35 ? 'Ajoute variantes : diamant (triceps), pike (epaules), declinees (pecto haut).' : maxPush < 60 ? 'Avance ! Handstand push-up prog et pompes a un bras.' : 'Elite ! Pompes anneaux, planche push-ups, archer push-ups.'}`,
    `Astuce pompes : descente lente 3-4s double l'efficacite de l'exercice. Essaie une serie a 4s — tes ${maxPush} reps vont paraitre beaucoup moins. Mais la qualite explose.`,
    `Pour progresser en pompes : 1) ameliorer la qualite 2) augmenter le volume 3) augmenter la difficulte (variantes). A ${maxPush} reps tu en es ou dans cette progression ?`,
    `Les pompes a haute frequence marchent tres bien. 3x10 pompes de qualite 3-4 fois par jour est souvent mieux qu'une grosse serie une fois. Ton max va monter en 2-3 semaines.`,
    `Pompes pieds sureleves = plus de poitrine superieure. Pompes declinees = plus de poitrine inferieure. Pompes diamant = triceps. Varie les angles pour un developpement complet.`,
  ])
}

// DIPS
if (/\bdip\b|tricep.*chaise|barres? de dip/.test(text)) {
  return pick([
    `Dips a ${maxDips} reps. ${equip.dipBars ? 'Avec barres : incline buste en avant pour cibler poitrine, garde-le droit pour triceps.' : 'Sans barres : dips sur chaise — plus les pieds sont loin, plus c\'est dur.'} Full ROM a chaque rep, toujours.`,
    `Le dip c'est le developpe couche du calisthenics. A ${maxDips} reps tu es ${maxDips < 10 ? 'en construction' : 'solide'}. Negatifs lents + pauses en bas = progression rapide. ${equip.rings ? 'Ring dips disponibles — niveau superieur !' : ''}`,
    `Pour progresser en dips : negatifs lents 5s, pauses en bas, puis volume. Si tu as ${equip.vest ? 'le gilet leste — parfait pour surcharger les dips' : 'des elastiques — l\'assistance peut t\'aider a depasser un plateau'}.`,
  ])
}

// GRIP / SUSPENSION
if (/suspendu|hang|accroché|grip|poigne|avant.bras|forearm|poignet/.test(text)) {
  return pick([
    `Grip souvent facteur limitant en tractions. ${maxHang}s de dead hang — objectif : depasser 60s.\nDead hangs ACTIFS (omoplates engagees) sont plus utiles que passifs. Pratique ca quotidiennement.`,
    `Avant-bras qui lachent ? Solutions : hang passif quotidien, farmer's carry, serrer une balle. En 3 semaines tu vas voir la difference.`,
    `${maxHang}s de suspension. Progression grip : 1) dead hang passif 2) dead hang actif 3) hang one arm assiste. Le grip s'ameliore vite avec de la regularite.`,
  ])
}

// MINDSET & HABITUDES - NIVEAU 1
if (/mon mindset|motivation|decourag|abandon|lach|arret|difficile|plus envie|flemme|j'y arrive pas|j'arrive pas|peux plus/.test(text)) {
  return pick([
    `La discipline, ca se construit. Motivation = ephemere. Quel est ton plus grand ennemi en ce moment ? La fatigue du travail, les distractions, ou le manque de resultats ?`,
  ])
}
// MINDSET - NIVEAU 2
if (/fatigue du travail/.test(text)) {
  return pick([
    `Est-ce que c'est une fatigue physique reelle (manque de sommeil, courbatures) ou une fatigue mentale (charge cognitive, stress) ?`,
  ])
}
// MINDSET - NIVEAU 3
if (/fatigue physique reelle/.test(text)) {
  return pick([
    `Si c'est physique, le corps a besoin de sommeil. La musculation detruit les fibres, c'est le sommeil qui les reconstruit. Fais un vrai repos actif aujourd'hui.`,
  ])
}
if (/fatigue mentale|charge cognitive/.test(text)) {
  return pick([
    `La fatigue mentale te ment. Une fois chaud, le corps repondra. Vas-y pour juste 15 minutes. Dans 90% des cas, la seance va te vider la tete et tu vas la finir.`,
  ])
}

// MINDSET - NIVEAU 2 (Autres)
if (/les distractions|distractions/.test(text)) {
  return pick([
    `Le telephone est le pire ennemi de l'entrainement. Regle d'or : telephone en mode avion pendant ta seance. Pas de reseaux entre les series, juste de la musique.`,
  ])
}
if (/manque de resultats/.test(text)) {
  return pick([
    `Le calisthenics demande 3 a 6 mois pour une transformation vraiment visible. A ${streak} jours, tu plantes les graines. La recolte vient plus tard. Patience.`,
  ])
}

// TECHNIQUE / MOUVEMENT - NIVEAU 1
if (/technique d'un mouvement/.test(text)) {
  return pick([
    `Ok, on ajuste la technique. Quel mouvement te pose probleme ? Les tractions, les pompes, les dips, ou le core (abdos) ?`,
  ])
}
// TECHNIQUE - NIVEAU 2
if (/les tractions.*probleme|tractions posent probleme/.test(text)) {
  return pick([
    `Sur les tractions, qu'est-ce qui lache en premier ? Ton dos, tes biceps, ou ton grip (ta poigne) ?`,
  ])
}
// TECHNIQUE - NIVEAU 3 (Tractions)
if (/mon dos lache/.test(text)) {
  return pick([
    `Si le dos lache, c'est que tu tires trop avec les bras. Fais du tirage inverse (sous une table) pour vraiment isoler et ressentir la contraction de tes omoplates.`,
  ])
}
if (/mes biceps lachent/.test(text)) {
  return pick([
    `Varie tes prises. Fais plus de Chin-ups (supination) pour renforcer specifiquement les biceps.`,
  ])
}
if (/mon grip lache/.test(text)) {
  return pick([
    `Grip faible = cerveau qui bride ta force par securite. Suspends-toi a la barre (Dead Hang) 60 secondes tous les jours. Ton grip va devenir de l'acier.`,
  ])
}

// TECHNIQUE - NIVEAU 2 (Pompes)
if (/les pompes.*probleme|pompes posent probleme/.test(text)) {
  return pick([
    `Pour les pompes : est-ce que tu as une douleur aux poignets, ou c'est juste un manque de force pure ?`,
  ])
}
// TECHNIQUE - NIVEAU 3 (Pompes)
if (/douleur aux poignets/.test(text)) {
  return pick([
    `Classique. Utilise des parallettes, ou fais tes pompes sur les poings. Ca garde les poignets droits. Et etire tes flechisseurs de poignet avant la seance.`,
  ])
}
if (/manque de force pure/.test(text)) {
  return pick([
    `Le secret : les pompes negatives. Mets-toi en position haute, et descends le plus lentement possible (5-8 secondes). Remonte sur les genoux. Recommence.`,
  ])
}

// TECHNIQUE - NIVEAU 2 (Dips)
if (/les dips.*probleme|dips posent probleme/.test(text)) {
  return pick([
    `Pour les dips : tu ressens une douleur aux epaules (ou sternum), ou tu stagnes au niveau du nombre de reps ?`,
  ])
}
// TECHNIQUE - NIVEAU 3 (Dips)
if (/douleur aux epaules|douleur au sternum/.test(text)) {
  return pick([
    `Douleur sternum = manque de mobilite ou descente trop basse. Ne descends pas plus bas que 90 degres au niveau du coude. Travaille ta souplesse thoracique.`,
  ])
}
if (/stagne au niveau des reps|stagne en reps/.test(text)) {
  return pick([
    `Pour debloquer tes dips, fais des pauses de 2 secondes en position basse. Ca va construire une force enorme au point critique du mouvement.`,
  ])
}

// TECHNIQUE - NIVEAU 2 (Core/Abdos)
if (/le core.*probleme|abdos posent probleme/.test(text)) {
  return pick([
    `Pour les abdos : tu as mal au bas du dos quand tu les travailles, ou tu n'arrives pas a tenir les exercices de gainage (L-Sit, etc) ?`,
  ])
}
// TECHNIQUE - NIVEAU 3 (Core)
if (/mal au bas du dos/.test(text)) {
  return pick([
    `Mal au bas du dos = tu creuses. Rentre le ventre et plaque ton bassin en retroversion (posterior pelvic tilt). Si ca fait mal, passe sur du gainage sur les genoux pour reapprendre.`,
  ])
}
if (/pas a tenir le gainage/.test(text)) {
  return pick([
    `Le gainage (surtout L-sit) demande aussi de la force dans les hanches et triceps. Fais des levees de genoux suspendus a la barre pour progresser.`,
  ])
}

// CARDIO & SOUPLESSE - NIVEAU 1
if (/cardio ou souplesse/.test(text)) {
  return pick([
    `On sort de la pure force. Tu veux parler de ton endurance (cardio) ou de ta mobilite (souplesse) ?`,
  ])
}
if (/mon endurance.*cardio/.test(text)) {
  return pick([
    `Tu fais du cardio pour la sante de ton coeur, ou dans l'objectif principal de perdre du gras ?`,
  ])
}
if (/sante de mon coeur/.test(text)) {
  return pick([
    `Parfait. Corde a sauter ou course legere, 2 fois par semaine pendant 30 min (Zone 2, tu dois pouvoir parler). Ca suffira amplement.`,
  ])
}
if (/pour perdre du gras/.test(text)) {
  return pick([
    `Attention, le cardio ne fait pas maigrir si l'assiette est mauvaise. La diete fait 90% du travail. Le cardio c'est juste l'outil pour bruler 300kcal de plus.`,
  ])
}
if (/ma mobilite.*souplesse/.test(text)) {
  return pick([
    `Tu te sens raide ? C'est plutot le bas du corps (hanches/jambes) ou le haut du corps (epaules/dos) qui bloque ?`,
  ])
}
if (/bas du corps bloque/.test(text)) {
  return pick([
    `Passe 5 minutes cumulatives par jour en position de 'Deep Squat' (accroupi complet). Ca va decompresser ta colonne et ouvrir tes hanches.`,
  ])
}
if (/haut du corps bloque/.test(text)) {
  return pick([
    `Prends un elastique ou un manche a balai, bras tendus, et fais des 'dislocates' (passages avant/arriere) 15 fois tous les matins. Tes epaules vont revivre.`,
  ])
}

// SUPPLEMENTS
if (/whey|creatine|supplement|complement|proteine en poudre|bcaa|pre.workout|vitamine/.test(text)) {
  return pick([
    `Nourriture reelle d'abord. Creatine monohydrate (3-5g/jour) : seul supplement avec preuves solides pour la force. Whey : utile si tu n'atteins pas ~${protTarget}g/jour. Mais ta liste de courses couvre l'essentiel.`,
    `La creatine c'est le supplement le mieux documente — 50 ans d'etudes. 3-5g/jour suffit, pas besoin de cycling. Prise avec les repas. Hydration importante (eau++).`,
    `BCAA = marketing en grande partie si tu manges assez de proteines. Pre-workout : cafeïne + creatine + beta-alanine suffit. Le reste c'est souvent du remplissage.`,
    `Vitamines utiles : D3 (surtout en hiver), Magnesium (sommeil + recup), Omega-3 (inflammation). Ces 3 la ont des preuves solides. Le reste... variable.`,
  ])
}

// PLATEAU
if (/plateau|bloque|plus de progr|stagne|stagnation|progresse plus/.test(text)) {
  return pick([
    `Plateau ? Normal et previsible. Solutions : 1) Change la variante de l'exercice 2) Joue avec le tempo (lent/explosif) 3) Augmente le volume progressivement 4) Regarde le sommeil et la nutrition — souvent le vrai coupable.`,
    `Les plateaux sont une info — pas un echec. Ton corps s'est adapte a ce stimulus. Il faut un nouveau stress. Change quelque chose : variante, rep range, frequence, ou intensite.`,
    `Sur quel exercice exactement tu stagnes ? Les tractions ? Les pompes ? Un plateau sur traction a ${maxPull} reps peut se debloquer avec du volume lower rep et des variantes comme les negatifs.`,
  ])
}

// NOUVEAU: BILAN SEANCE (RPE)
if (/bilan de ma derniere seance/.test(text)) {
  return pick([
    `On va faire un point RPE (Ressenti). Comment s'est passee la derniere seance ? Trop facile, parfaite, ou vraiment epuisante ?`,
  ])
}
if (/trop facile/.test(text)) {
  return pick([
    `Message recu. Si c'est trop facile, c'est que tu t'es adapte. Augmente tes max dans le profil ou ralentis ton tempo d'execution (3s a la descente). La prochaine va piquer.`,
  ])
}
if (/parfaite/.test(text)) {
  return pick([
    `Excellent. C'est la zone d'or (RPE 8). Tu as stimule le muscle sans detruire ton systeme nerveux. Continue exactement sur ce rythme.`,
  ])
}
if (/epuisante|épuisante/.test(text)) {
  return pick([
    `Systeme nerveux tape. Normal si c'etait une seance Intensite. Assure-toi de dormir 8h cette nuit et charge un peu plus en glucides pour refaire tes reserves de glycogene.`,
  ])
}

// NOUVEAU: OBJECTIFS
if (/point sur mon objectif/.test(text)) {
  return pick([
    `A ${weight}kg, la strategie n'est pas la meme. Ton objectif principal aujourd'hui : perdre du gras (seche), construire du muscle (prise de masse) ou maintien ?`,
  ])
}
if (/seche|sèche|perdre gras/.test(text)) {
  return pick([
    `Objectif Seche. La cle : maintiens tes proteines a ${protTarget}g pour garder le muscle. Le deficit calorique fera fondre le gras. Les seances de musculation envoient le signal "ne brule pas mes muscles".`,
  ])
}
if (/prise de masse/.test(text)) {
  return pick([
    `Prise de Masse. Il te faut un surplus calorique (+300kcal). Augmente tes glucides (riz, avoine, patates douces). Et surtout, cherche la surcharge progressive (plus de reps ou plus dur) a chaque seance.`,
  ])
}
if (/maintien/.test(text)) {
  return pick([
    `Maintien. L'approche la plus saine sur le long terme. Ton focus doit etre la performance pure : devenir plus fort aux tractions et aux pompes, sans te preoccuper de la balance.`,
  ])
}

// NOUVEAU: STRESS & MENTAL
if (/niveau de stress/.test(text)) {
  return pick([
    `Le stress chronique (cortisol eleve) bloque l'hypertrophie et favorise le stockage du gras abdominal. Comment tu te sens recemment ? Plutot zen ou sous grosse pression ?`,
  ])
}
if (/suis zen/.test(text)) {
  return pick([
    `Top. Ton systeme nerveux est frais et receptif. C'est le moment de pousser tes records personnels sur les gros mouvements. Profites-en.`,
  ])
}
if (/sous pression/.test(text)) {
  return pick([
    `Le stress draine ton energie d'adaptation. Fais tes seances, mais eloigne-toi de l'echec musculaire. La seance doit te vider la tete, pas epuiser ton systeme nerveux.`,
  ])
}

// NOUVEAU: TEMPS & PLANNING
if (/pas beaucoup de temps|manque de temps/.test(text)) {
  return pick([
    `Le manque de temps est l'excuse #1. Mais 15 minutes bien intenses valent mieux que 0. Tu as combien de temps generalement ? 15 min ou 30 min ?`,
  ])
}
if (/15 min|15min/.test(text)) {
  return pick([
    `Format 15 minutes = EMOM (Every Minute on the Minute). Prends 2 exos (ex: Pompes/Squats). Min 1: 15 pompes. Min 2: 20 squats. Alterne pendant 15 minutes non-stop. Ca brule.`,
  ])
}
if (/30 min|30min/.test(text)) {
  return pick([
    `30 minutes c'est LARGEMENT suffisant. Fais le programme normal du jour, mais coupe tous tes temps de repos en deux (45s max). Tu auras un gros benefice cardio en plus de la force.`,
  ])
}

// BLESSURE
if (/bless|douleur aigue|tendinite|epaule|poignet|dos|genou|cheville|claquage/.test(text)) {
  return pick([
    `Douleur aigue ou articulaire = STOP cet exercice maintenant. Ce n'est pas de la faiblesse, c'est de l'intelligence. Une vraie blessure ignoree peut couter 3-6 mois de progression.`,
    `Distingue : douleur musculaire (ok, continue) vs douleur articulaire/tendon (stop complet). En cas de doute — stop et consulte. Mieux vaut perdre une seance que 2 mois.`,
    `Blessures courantes en calisthenics : coiffe des rotateurs (epaule), epicondylite (coude), poignet. Chacune a un protocole de rehab specifique. Ou t'as mal exactement ?`,
  ])
}

// ECHAUFFEMENT / RECUPERATION ACTIVE
if (/echauff|etirement|stretching|mobilite|souplesse|flexibilite|warm.up|cool.down/.test(text)) {
  return pick([
    `Echauffement minimum 5 min avant toute seance : jumping jacks + rotations epaules + mobilite hanches + 2-3 pompes legeres. Sans ca, risque de blessure x2 et performance moindre.`,
    `Etirements apres la seance (PAS avant) : au moins 30s par groupe musculaire sollicite. Les etirements dynamiques avant, statiques apres. La difference est importante.`,
    `Mobilite = investissement long terme. 10 min/jour de travail de mobilite (hanches, epaules, thoracique) va transformer tes performances en 30 jours. Souvent negliges, toujours utiles.`,
  ])
}

// CORE / ABDOS
if (/core|abdos|sangle|gainage|crunch|planche|six.pack|ventre|taille/.test(text)) {
  return pick([
    `Le core c'est plus que des abdos visibles. C'est la stabilite de tout le corps : hollow body, planche, leg raises, ab wheel — ces exercices sont dans ton programme et travaillent le vrai gainage.`,
    `Six-pack = nutrition + bodyfat bas + core fort. Les abdos tout le monde les a, c'est la couche de gras dessus qui les cache. La seance Core est la pour le gainage, la diete pour les rendre visibles.`,
    `Hollow body hold : l'exercice de gainage le plus complet qui soit. 30s au debut, vise 60s. Bas du dos COLLE au sol, bras et jambes tendus. Si le dos decolle, remonte les jambes.`,
  ])
}

// POIDS / MORPHO
if (/perdre du poids|maigrir|grossir|prendre de la masse|secher|gras|bodyfat|composition corporelle/.test(text)) {
  return pick([
    `Perte de gras : deficit calorique modere (300-500 kcal/j) + proteines hautes (~${protTarget}g) + entrainement maintenu. Le multiplicateur IA a x${calMult.toFixed(2)} s'ajuste deja selon tes bilans.`,
    `Prise de muscle sans prise de gras = recomposition. Possible a ton niveau, surtout si t'es debutant/intermediaire. Necessite : proteins elevees, surplus calorique modere, progression en entrainement.`,
    `Ton poids actuel : ${weight}kg. L'app calcule tes portions en consequence. Si ton objectif a change (prise vs perte), met a jour ton poids dans le Profil regulierement.`,
  ])
}

// EQUIPEMENT
if (/equipement|materiel|j'ai quoi/.test(text)) {
  return pick([
    `Ton equipement actuel : ${equipList.length > 0 ? equipList.join(', ') : 'Aucun (poids de corps pur)'}. Tu peux modifier ca dans ton Profil a tout moment, tes seances s'adapteront automatiquement.`,
    `Avec ${equipList.length > 0 ? 'ton materiel (' + equipList.join(', ') + ')' : 'juste ton corps'}, on a tout ce qu'il faut. Le calisthenics s'adapte a toi. Une question sur un mouvement specifique ?`,
  ])
}

// SOMMEIL
if (/sommeil|dormir|dormi|nuit|insomnie|fatigu. le matin/.test(text)) {
  return pick([
    `Le sommeil c'est 50% de la progression. Moins de 7h = hormones de croissance en chute, cortisol (stress) en hausse. Priorite absolue ce soir : ecran coupe 1h avant le lit.`,
    `Tu n'as pas bien dormi ? Ne force pas l'intensite aujourd'hui. Fais la seance mais garde 2-3 reps sous le coude. Et ce soir, vise 8 heures pleines.`,
    `Sommeil difficile = recup freinee. La base : meme heure de coucher, chambre fraiche (18-19C), pas d'ecrans. Si tu ne dors pas, tout le reste (nutrition, entrainement) perd en efficacite.`,
  ])
}

// HORS SUJET / HUMOUR
if (/meteo|temps qu'il fait|foot|foot|politique|films?|serie|musique|netflix|qu'est.ce que tu penses de/.test(text)) {
  return pick([
    `Haha, je suis specialise sport et nutrition, la meteo et Netflix c'est pas trop mon rayon 😄 Par contre si tu veux parler de ta seance du soir ou de ce que tu manges ce midi, je suis tout a toi.`,
    `Mon domaine c'est ton corps et ta performance. Pour le reste, tu as internet ! Mais si t'as une question sur ton entrainement ou ta bouffe, je suis la.`,
    `Je reste dans mon lane : coaching fitness et nutrition. Mais j'apprecie la tentative 😄 Question sur ta seance ou ta diete ?`,
  ])
}

// QUESTIONS EXISTENTIELLES / PHILOSOPHIE
if (/pourquoi faire du sport|ca sert a quoi|je veux abandonner tout|plus envie de rien|tout lacher/.test(text)) {
  return pick([
    `Je vais sortir du script coach une seconde. Si tu veux vraiment "tout lacher" en general — parles-en a quelqu'un que tu connais. Si c'est juste le sport qui te pese, on peut ajuster le programme. Qu'est-ce qui se passe vraiment ?`,
    `Le sport c'est pas juste l'apparence. C'est la serotonine, le sommeil ameliore, la confiance en soi, la resilience. Si t'en vois pas le sens en ce moment, dis-moi pourquoi tu avais commence au depart.`,
  ])
}

// JE SUIS PRET / C'EST BON
if (/je suis pret|pret pour la seance|let'?s go|on y va|c'est parti|go|allons.y/.test(text)) {
  return pick([
    `LET'S GO ${name} ! Ouvre l'onglet Seance, echauffement 5 min, et tu envoies. Je serai la si t'as des questions.`,
    `C'est tout ce que je voulais entendre. ${day}, ${time} — parfait. Echauffement, puis programme. Fais-le proprement. Allez !`,
    `Go ! Rappelle-toi : qualite sur quantite. Chaque rep compte. Reviens me voir apres pour le bilan.`,
  ])
}

// RESPONSES PAR DEFAUT — nombreuses et variees
const defaults = [
  `Bonne question ${name}. Precise un peu : tu parles de ton entrainement, ta nutrition, ta recuperation, ou autre chose ?`,
  `Je t'ecoute. Donne-moi plus de contexte — ca concerne ta seance du jour, ton alimentation, ou ton mental ?`,
  `Hmm. Je veux bien repondre precisement — dis-moi plus. C'est quoi exactement la situation ?`,
  `Interessant. Developpe un peu — je veux comprendre avant de repondre.`,
  `Utilise les raccourcis en bas pour les themes frequents, ou pose-moi une question specifique. Je m'adapte a tout.`,
  `Pas sur d'avoir saisi. Tu parles de quelle partie du programme — corpo, nutrition, technique, recup ?`,
  `Dis-moi en une phrase ce que tu veux savoir ou resoudre. Je te reponds precisement.`,
  `Je suis la pour ca ${name}. Mais j'ai besoin d'un peu plus de detail pour te repondre utilement.`,
  `Rephrases differemment ? Je veux m'assurer de repondre a ce que tu demandes vraiment.`,
]
  return pick(defaults)
}

export const QUICK_REPLIES = [
  { label: '📊 Mon bilan', text: 'Ou j\'en suis dans ma progression ?' },
  { label: '💪 Seance du jour', text: 'Conseils pour ma seance aujourd\'hui' },
  { label: '🛠️ Technique', text: 'Technique d\'un mouvement' },
  { label: '🥗 Nutrition', text: 'Conseils nutrition pour moi' },
  { label: '🧠 Mindset', text: 'Mon mindset' },
  { label: '🏃 Cardio/Souplesse', text: 'Cardio ou Souplesse ?' },
  { label: '🎯 Mon objectif', text: 'Je veux faire le point sur mon objectif' },
  { label: '📈 Bilan séance', text: 'Bilan de ma derniere seance' },
  { label: '🧘 Stress', text: 'Mon niveau de stress' },
  { label: '⏱️ Temps', text: 'Je manque de temps' },
  { label: '💤 Recuperation', text: 'J\'ai des courbatures aujourd\'hui' },
  { label: '💧 Hydratation', text: 'Combien d\'eau dois-je boire ?' },
  { label: '🏆 Mon streak', text: 'Comment est mon streak ?' },
  { label: '🎯 Plateau', text: 'Je ne progresse plus' },
  { label: '🔧 Equipement', text: 'Quel equipement j\'ai ?' },
  { label: '😴 Sommeil', text: 'Je n\'ai pas bien dormi' },
]

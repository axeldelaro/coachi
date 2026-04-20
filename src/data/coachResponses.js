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

  // NUTRITION
  if (/manger|nourriture|calorie|proteine|diete|nutrition|faim|assiette|repas|glucide|lipide|sucre|masse|seche/.test(text)) {
    return pick([
      `Nutrition a ${weight}kg — cible proteines ~${protTarget}g/jour. Multiplicateur calories x${calMult.toFixed(2)}.\nLa regle : proteines a CHAQUE repas, glucides complexes autour des seances, lipides sains le soir. Ta liste de courses respecte ca.`,
      `80% de la progression c'est la bouffe. ${calMult > 1.0 ? `Tu es a x${calMult.toFixed(2)} calories — le corps travaille fort, nourris la machine.` : `Tu es a x${calMult.toFixed(2)} — plan de recalibration.`}\nTu veux qu'on rentre dans un repas specifique ?`,
      `Proteines : ${protTarget}g/jour pour ${weight}kg. Tu y arrives ? C'est la que ca peche souvent. Pense : oeuf + fromage blanc + poulet + poisson sur la journee.`,
      `La diete c'est pas une punition, c'est un outil de performance. A ${weight}kg : ${protTarget}g proteines, glucides autour des seances, lipides bonne qualite. Ton plan est deja calibre dans l'appli.`,
      `Repas autour de la seance — crucial. Avant (si tu manges) : glucides legers 1-2h avant. Apres : proteines dans les 45 min. Mais reste dans le plan de diete de base.`,
      `Envie de cheat meal ? Je vais pas te juger. Un repas libre bien place (surtout le soir post-seance intense) peut meme aider psychologiquement. L'important c'est la semaine entiere, pas un repas.`,
      `${calMult < 1.0 ? `Multiplicateur calories a x${calMult.toFixed(2)} — le systeme a legevement reduit tes portions suite a tes bilans. Continue l'effort.` : `Multiplicateur a x${calMult.toFixed(2)} — bonne energie, continue comme ca.`}`,
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
      `A ${ weight }kg : minimum ${ waterTarget }L / jour.En seance : +500 - 700ml.Simple : 1 verre au lever, 1 avant chaque repas, 1 pendant seance, 1 apres.${ water> 0 ? `Tu as log ${water} verre${water > 1 ? 's' : ''} aujourd'hui — continue.` : 'Combien t\'as bu aujourd\'hui ?'} `,
      `Deshydratation a 2 % = -10 a - 20 % de performance.C'est enorme. Et beaucoup de "fatigue" ou "manque de concentration" c'est juste ca.${ water < 4 ? 'Tu dois boire plus.' : 'Bonne hydratation.' } `,
      `${ waterTarget }L minimum pour ${ weight } kg.Si tu transpires beaucoup en seance, monte a ${ Math.round((waterTarget + 0.7) * 10) / 10 } L.Café et the comptent a moitie.Evite les sodas.`,
      `L'eau c'est gratuit et ca change tout: recuperation, concentration, performance.Log ta conso dans le dashboard pour le tracker.Objectif : ${ waterTarget }L avant 18h.`,
    ])
  }

  // STREAK
  if (/streak|serie|consecutif|constanc|regularit|jours d'affilee|jours de suite/.test(text)) {
    if (streak === 0) return pick([
      `Streak a 0 — ca arrive.La question c'est pas le passe, c'est maintenant: fais ton bilan ce soir dans le dashboard.Un geste suffit a relancer.`,
      `Zero streak.OK.C'est pas une condamnation, c'est un point de depart.Ce soir: bilan du soir dans le dashboard.${ day === 'lundi' ? 'Et c\'est lundi — parfait pour reprendre.' : 'Aujourd\'hui est le bon moment.' } `,
      `0 jour.Pas de jugement.Ca se relance avec une seule action.Petit, concret, ce soir.Un bilan de 2 minutes et le compteur repart.`,
    ])
    if (streak < 5) return pick([
      `${ streak } jour${ streak > 1 ? 's' : '' } de suite — bien! La premiere semaine c'est la plus difficile. Tiens jusqu'a 7 et le cerveau commence a reconnaitre l'habitude.`,
    `Quelques jours, c'est un debut. A ce stade beaucoup lachent. Toi t'es encore la. ${streak} -> vise 7 -> vise 14 -> vise 30. Un palier a la fois.`,
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

// MOTIVATION
if (/motiv|decourag|abandon|lach|arret|difficile|plus envie|flemme|j'y arrive pas|j'arrive pas|peux plus/.test(text)) {
  return pick([
    `Ecoute ${name}. Le fait que tu me poses la question plutot que d'avoir simplement arrete — c'est deja la reponse. Tu n'as pas abandonne. Tu cherches. Bonne direction.`,
    `Tu te souviens du premier jour ? De ce que tu voulais accomplir ? Cette raison n'a pas change. C'est le chemin qui est difficile — pas la destination.`,
    `Les jours sans envie, fais JUSTE les 5 premieres minutes. Juste demarrer. Dans 80% des cas tu continues. Et si tu t'arretes apres 5 min, t'as quand meme fait quelque chose.`,
    `Flemme ou vraie fatigue physique ? C'est tres different. Flemme = go demarre. Fatigue physique reelle = repos actif aujourd'hui, seance demain. Diagnostique d'abord.`,
    `Chaque athlete a des jours sans. Djokovic, LeBron, tout le monde. La difference ? Ils y vont quand meme. Fais juste le minimum — une serie, une marche. Le reste suit.`,
    `Le corps reussit la ou l'esprit choisit de ne pas abandonner. ${streak} jours de streak — tu as deja prouve que t'en es capable. Aujourd'hui c'est juste un mauvais jour.`,
    `Parfois le manque de motivation vient d'un manque de vision. Rappelle-toi pourquoi tu as commence. Ecris-le. Relis-le. Puis fais une seule chose concrete maintenant.`,
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
  { label: '🥗 Nutrition', text: 'Conseils nutrition pour moi' },
  { label: '🔥 Motivation', text: 'J\'ai du mal a me motiver' },
  { label: '💤 Recuperation', text: 'J\'ai des courbatures aujourd\'hui' },
  { label: '💧 Hydratation', text: 'Combien d\'eau dois-je boire ?' },
  { label: '🏆 Mon streak', text: 'Comment est mon streak ?' },
  { label: '🎯 Plateau', text: 'Je ne progresse plus' },
  { label: '🔧 Mon equipement', text: 'Quel equipement j\'ai ?' },
  { label: '😴 Sommeil', text: 'Je n\'ai pas bien dormi' },
]

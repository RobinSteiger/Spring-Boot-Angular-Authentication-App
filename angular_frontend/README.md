# TO IMPLEMENT

https://github.com/Ismaestro/angular-example-app?tab=readme-ov-file

- In a onglet gestion des utilisateurs, tableau des utilisateurs (couleurs alternée dans le tableau)
- Plusieurs champs de 
    recherche selon nom d'utilisateurs,
    filtre par role,
    filtre par status (actif, inactif)
    trié par : nom(a-z) ou inverse, status
- Dans la dernière colone a coté de chaque utilisateur, 2 boutons edit et delete, pour modifier les utilisateurs
- ?? bouton pour modifier spécifiquement les roles dans le edit ??
- En bas, bouton de création d'utilisateur, avec champs déroulant pour les roles

Exemple : https://youtu.be/YI9RTtoNXgQ

Best practices : https://medium.com/@animeshshr/10-angular-best-practices-every-developer-should-know-in-2025-edd5c4ecdd64

Core contient le central, transversal, singleton, non UI
Shared contient les composants, pipes, directives ré-utilisables
Features contient les domaines métiers autonome, foncionnalités isolée



# MODEL FINE TUNING

Pour les modeles pré-entrainé / dataset : https://huggingface.co/docs/transformers/training

Tuto & explication on fine-tuning image model : https://pyimagesearch.com/2019/06/03/fine-tuning-with-keras-and-deep-learning

Fine-Tuning Llama3.2 3B with Tutorial : https://github.com/shaheennabi/Production-Ready-Instruction-Finetuning-of-Meta-Llama-3.2-3B-Instruct-Project

From Yves :
    Entreprise : https://www.visium.com/
    For practices (certification ??) : https://www.hackerrank.com/skills-verification/software_engineer


src/
│
├── core/              # Services transversaux, interceptors, guards
├── shared/            # Composants/réutilisables : boutons, pipes, directives
├── features/          # Une feature = 1 dossier
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   ├── dashboard.component.scss
│   │   ├── dashboard.routes.ts
│   │   └── dashboard.service.ts
│   └── auth/
│       ├── login.component.ts
│       ├── auth.service.ts
│       └── auth.routes.ts
│
├── app.routes.ts      # Définition centralisée des routes
├── main.ts            # Bootstrap de l'app
└── style.scss         # Style global


https://github.com/gothinkster/angular-realworld-example-app/blob/main/src/app/core/layout/header.component.ts
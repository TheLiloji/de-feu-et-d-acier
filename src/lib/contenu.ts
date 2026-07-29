/**
 * Accès au contenu Keystatic depuis les pages Astro.
 *
 * Le contenu vit dans des fichiers YAML / Markdoc du dépôt ; il est lu au build
 * par le Reader Keystatic (`createReader`), jamais au runtime. Les pages
 * publiques étant pré-rendues, la lecture se fait dans Node (l'adaptateur est
 * configuré avec `prerenderEnvironment: 'node'`), où `node:fs` est disponible.
 * Cf. stack-notes.md §5.3 et §1.4.
 *
 * Règle d'architecture (multi-ecoles.md §6.6, invariants 3 et 4) : un composant
 * ne lit jamais le contenu lui-même. Il reçoit l'école et ses données en props.
 */
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import type { EcoleConfig, EcoleSlug } from '../config/ecoles';

export const reader = createReader(process.cwd(), keystaticConfig);

// ── Contenu commun (association) ───────────────────────────────────────────

export const lireIdentite = () => reader.singletons.identite.readOrThrow();
export const lireHero = () => reader.singletons.hero.readOrThrow();
export const lireEntetes = () => reader.singletons.entetes.readOrThrow();
export const lireClub = () => reader.singletons.club.readOrThrow();
export const lireRigueur = () => reader.singletons.rigueur.readOrThrow();
export const lireRejoindre = () => reader.singletons.rejoindre.readOrThrow();
export const lireTournois = () => reader.singletons.tournois.readOrThrow();
export const lireFiches = () => reader.singletons.fiches.readOrThrow();
export const lireMenus = () => reader.singletons.menus.readOrThrow();
export const lireLegal = () => reader.singletons.legal.readOrThrow();

export const lireDisciplines = () => reader.collections.disciplines.all();
export const lirePartenaires = () => reader.collections.partenaires.all();
export const lireFaqGenerale = () => reader.collections.faq.all();

// ── Contenu d'école ────────────────────────────────────────────────────────
//
// Le dossier EST l'école : les clés de collection sont dépliées depuis
// `src/config/ecoles.ts`. On les retrouve ici par le même gabarit de nom.

const cle = <P extends string>(prefixe: P, ecole: EcoleConfig) =>
  `${prefixe}_${ecole.slug}` as `${P}_${EcoleSlug}`;

export const ficheEcole = (ecole: EcoleConfig) =>
  reader.singletons[cle('ecole', ecole)].readOrThrow();

export const profsDe = (ecole: EcoleConfig) => reader.collections[cle('profs', ecole)].all();

export const annoncesDe = (ecole: EcoleConfig) => reader.collections[cle('annonces', ecole)].all();

export const articlesDe = (ecole: EcoleConfig) => reader.collections[cle('articles', ecole)].all();

export const faqLocaleDe = (ecole: EcoleConfig) => reader.collections[cle('faq', ecole)].all();

export const albumsDe = (ecole: EcoleConfig) => reader.collections[cle('galerie', ecole)].all();

// ── Types utiles aux composants ────────────────────────────────────────────

export type FicheEcole = Awaited<ReturnType<typeof ficheEcole>>;
export type Identite = Awaited<ReturnType<typeof lireIdentite>>;
export type Discipline = Awaited<ReturnType<typeof lireDisciplines>>[number];
export type Prof = Awaited<ReturnType<typeof profsDe>>[number];
export type Annonce = Awaited<ReturnType<typeof annoncesDe>>[number];
export type Article = Awaited<ReturnType<typeof articlesDe>>[number];
export type QuestionFaq = Awaited<ReturnType<typeof lireFaqGenerale>>[number];
export type Album = Awaited<ReturnType<typeof albumsDe>>[number];

import store from "./store.json"

const data = store as any

export const profile = {
  name: data.profile.name,
  initials: data.profile.initials,
  headline: data.profile.headline,
  roles: data.profile.roles,
  currently: data.profile.currently,
  repository: data.profile.repository,
  location: data.profile.location,
  university: data.profile.university,
  about: data.profile.about,
  aboutJourney: data.profile.aboutJourney,
  social: data.profile.social,
  projects: data.projects as any[],
  experience: data.experience as any[],
  education: data.education as any[],
  skills: data.skills as any[],
  certifications: data.certifications as any[],
  achievements: data.achievements as any[],
  volunteering: data.volunteering as any[],
  articles: data.articles as any[],
}

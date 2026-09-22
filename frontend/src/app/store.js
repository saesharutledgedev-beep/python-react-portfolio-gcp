import { configureStore } from '@reduxjs/toolkit'
import aboutInfoReducer from '../features/about/aboutSlice'
import heroReducer from '../features/hero/heroSlice'
import experienceInfoReducer from '../features/experienceInfo/experienceInfoSlice'
import skillsReducer from '../features/skills/skillsSlice'
import educationInfoReducer from '../features/educationInfo/educationInfoSlice'
import projectsReducer from '../features/projects/projectsSlice'
import contactReducer from '../features/contacts/contactsSlice'

export const store = configureStore({
  reducer: {
    about: aboutInfoReducer,
    hero: heroReducer,
    experienceInfo: experienceInfoReducer,
    educationInfo: educationInfoReducer,
    skills: skillsReducer,
    projects: projectsReducer,
    contacts: contactReducer,
  },
})

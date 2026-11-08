import {create} from 'zustand'
import {persist} from 'zustand/middleware'
export const useTimeStore=create<{timeOffsetDays:number;advance:(days:number)=>void}>()(persist(set=>({timeOffsetDays:0,advance:days=>set(s=>({timeOffsetDays:s.timeOffsetDays+days}))}),{name:'bodywise-demo-time'}))
export const now=()=>new Date(Date.now()+useTimeStore.getState().timeOffsetDays*86400000)

import { Layout } from 'react-grid-layout'

export interface User extends UserData {
  id: number
}
export interface UserData {
  username: string
  location: string
  summerStarts: string
}

export interface Plant extends PlantData {
  id: number
}
export interface PlantData {
  name: string
  difficulty: string
  planting_starts: string
  planting_ends: string
  watering_frequency: string
  sun_level: string
  cycle: string
}

export interface GardenDB {
  garden_id: number
  user_id: number
  layout: string
  plot_id: number
  plot_number: number
  shade_level: number
  plot_type: number
  size: string
  average_wind: string
  plot_name: string
  plot_plant_id: number
  plant_id: number
  date_planted: string
  last_watered: string
  plant_name: string
  difficulty: string
  planting_starts: string
  planting_ends: string
  watering_frequency: string
  sunlight: number
  cycle: string
}

export interface GardenSimpleDB {
  id: number
  user_id: number
  layout: string
}

export interface PlotDatum {
  plotNumber: string
  name: string
  sunLight: string
  blockType: string
  size: number
  rainExposure: string
  growable: boolean
  plants: PlotPlant[]
}

export interface PlotPlant {
  plantName: string
  name: string
  id: null | number
  last_watered: null | string
  date_planted: string
  plant_id?: number
}

export interface NewPlant {
  plant_id: number | undefined
  user_id: number
  plot_id: number
  date_planted: string
  name: string
}

export interface DBPlotDatum {
  id: number
  garden_id: number
  plot_number: number
  sun_level: string
  plot_type: string
  size: number
  name: string
  rain_exposure: string
}
export interface PlotDatumDB extends PlotDatum {
  gardenId: number
}

// export interface DBPlotDatum extends PlotDatum {
//   id: number
// }

export interface DBPlotDatum {
  id: number
  garden_id: number
  plot_number: number
  sun_level: string
  plot_type: string
  size: number
  name: string
  rain_exposure: string
}
export interface GardenToSave {
  layout: Layout[]
  plotData: PlotDatum[]
  garden_id: number | null
}

export interface plantCareData {
  id: number
  plantName: string
  scientificName: string
  description: string
  soil: string
  sunlight: string
  watering: string
  fertilization: string
  pruning: string
  pests: string
  diseases: string
  indoorsPlantingTime: string
  outdoorsPlantingTime: string
  spacing: string
  plantingTime: string
  harvestingTime: string
  harvestingTips: string
}

export interface MyPlant {
  datePlanted: string
  daysUntilHarvest: number
  iconSrc: string
  lastWatered: string
  name: string
  photoSrc: string
  plantsId: number
  plotsName: string
  plotsPlantsId: number
}

export interface ID {
  id: number
}

export interface PlantID {
  id: number
  name: string
}

export interface PlotPlantJoinedRowEntry {
  id: number
  last_watered: string
  watering_history: string
  watering_frequency: string
  [key: string]: number | string | Date
}

export interface Task {
  id: number
  type: string
  plots_plants_id: number
  overdue_by: number
  completed: boolean
}

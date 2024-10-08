import { Router } from 'express'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../db/growGrub.ts'
import { UserData, User, NewPlant, PlotPlant } from '../../models/growGrub.ts'
import {
  differentiatePlots,
  refreshTasks,
  getPlantsIds,
  getAllPlantsInGarden,
} from '../db/helperFunctions.tsx'
import { getSinglePlantById } from '../db/growGrub.ts'

const router = Router()

//Used to check user exists
router.get('/users', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const userDB = await db.getUserByAuth0Id(auth0Id)
    if (!userDB) return res.json(userDB)
    const user: User = {
      id: userDB.id,
      username: userDB.username,
      location: userDB.location,
      summerStarts: userDB.summerStarts,
    }
    res.json(user)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})
//For registering a new user
interface NewUserData extends UserData {
  plants: string[]
}
router.post('/users', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  const userData: NewUserData = req.body
  if (!auth0Id) return res.sendStatus(401)
  if (!userData) return res.sendStatus(400)
  try {
    const userId = await db.addUser({ ...userData, auth0_id: auth0Id })
    res.json(userId)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})
//Gets all usernames to help the registering user avoid double ups on usernames (unique in DB) NOT IN USE
router.get('/usernames', async (req, res) => {
  try {
    const usernames = await db.getUsernames()
    const list: string[] = []
    usernames.forEach((row) => list.push(row.username))
    res.json(list)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

//Gets all plants NOT IN USE
// router.get('/plants', checkJwt, async (req: JwtRequest, res) => {
//   const auth0Id = req.auth?.sub
//   if (!auth0Id) return res.sendStatus(401)
//   try {
//     const plants = await db.getPlants()
//     res.json(plants)
//   } catch (error) {
//     console.log(error)
//     res.sendStatus(500)
//   }
// })

router.get('/plants', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const plants = await db.getPlants()
    res.json(plants)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

router.get('/myplants', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const plantsInPlots = await db.getMyPlantsInPlots(auth0Id)
    res.json(plantsInPlots)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

//Get single plant to show detailed care info
router.get('/plants/:name', checkJwt, async (req: JwtRequest, res) => {
  const name = req.params.name
  const auth0Id = req.auth?.sub
  if (!auth0Id) {
    return res.status(401).send('Unauthorized')
  }
  try {
    const singlePlant = await getSinglePlantById(name)
    res.json(singlePlant)
  } catch (error) {
    console.error(`Database error ${error}`)
    res.sendStatus(500)
  }
})

//Gets all plants the user desires for their garden(s) NOT IN USE
router.get('/plants/desired', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const plants = await db.getUsersPlantsDesired(auth0Id)
    res.json(plants)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

//Get the users gardens NOT IN USE
//Get the users gardens
router.get('/gardens', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const gardens = await db.getUsersGardens(auth0Id)
    const usersPlots = await db.getAllUsersPlots(auth0Id)

    const plots = await Promise.all(
      usersPlots.map(async (plot) => {
        const plants = await db.getPlotPlantsByPlotId(plot.id)
        return { ...plot, plants }
      }),
    )
    // get the plot_plants from each plot

    res.json({ gardens, plots })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})
//Gets plots + plants for the garden NOT IN USE
router.get('/gardens/:id', checkJwt, async (req: JwtRequest, res) => {
  const id = Number(req.params.id)
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  try {
    const gardenInfoDB = await db.getUserGarden(auth0Id, id)
    const plotsDB: any[] = [] // eslint-disable-line
    gardenInfoDB.forEach((row) => {
      if (row.plot_plant_id) {
        plotsDB[row.plot_id] = plotsDB[row.plot_id] || {}
        plotsDB[row.plot_id].plotNumber = row.plot_number
        plotsDB[row.plot_id].shadeLevel = row.shade_level
        plotsDB[row.plot_id].plotType = row.plot_type
        plotsDB[row.plot_id].size = row.size
        plotsDB[row.plot_id].averageWind = row.average_wind
        plotsDB[row.plot_id].name = row.plot_name
        plotsDB[row.plot_id].plants = plotsDB[row.plot_id].plants || []
        plotsDB[row.plot_id].plants.push({
          name: row.plant_name,
          difficulty: row.difficulty,
          wateringFrequency: row.watering_frequency,
          datePlanted: row.date_planted,
          lastWatered: row.last_watered,
        })
      }
    })
    const plots = plotsDB.filter((item) => item)
    const garden = {
      id: gardenInfoDB[0].garden_id,
      layout: gardenInfoDB[0].layout,
      plots: plots,
    }
    res.json(garden)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Add new garden
router.post('/gardens', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  const user = await db.getUserByAuth0Id(auth0Id)
  try {
    const newGarden = req.body
    const layoutString = JSON.stringify(newGarden.layout)
    const newGardenID = await db.saveNewGarden(layoutString, user.id)
    const newPlotIDs = await db.saveNewPlots(newGarden.plotData, newGardenID[0])
    const plantsIDs = await getPlantsIds(newGarden.plotData)

    await db.saveNewPlotPlants(
      newPlotIDs,
      newGarden.plotData,
      user.id,
      plantsIDs,
    )

    res.json({ newGardenID, newPlotIDs })
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Router for adding new plots - NOT IN USE, ONLY FOR TESTING
// router.post('/plots', async (req, res) => {
//   try {
//     const newPlots = req.body
//     const newPlotIDs = await db.saveNewPlots(newPlots, 1)
//     res.json(newPlotIDs)
//   } catch (error) {
//     console.log(error)
//     res.sendStatus(500)
//   }
// })

// Router used for updating existing garden
router.put('/gardens/:id', checkJwt, async (req: JwtRequest, res) => {
  // Body of request will include plotData, layout
  const garden_id = Number(req.params.id)
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  const user = await db.getUserByAuth0Id(auth0Id)

  try {
    const updatedGarden = req.body
    const updatedLayoutString = JSON.stringify(updatedGarden.layout)

    await db.updateGardenLayout(garden_id, updatedLayoutString)

    const updatedPlotData = updatedGarden.plotData
    const existingPlotData = await db.getPlotsByGardenID(garden_id)

    const { plotsToCreate, plotsToUpdate, plotIDsToDelete } =
      differentiatePlots(updatedPlotData, existingPlotData, garden_id)

    await db.updatePlots(plotsToUpdate, garden_id)
    const newPlotIDs = await db.saveNewPlots(plotsToCreate, garden_id)

    // plants
    if (newPlotIDs.length > 0) {
      const plantsIDs = await getPlantsIds(plotsToCreate)
      await db.saveNewPlotPlants(newPlotIDs, plotsToCreate, user.id, plantsIDs)
    }
    await db.deletePlotsByID(plotIDsToDelete)

    // get an array of all plants not in db (w/o id's)
    const plantsToInsert: NewPlant[] = []
    const plantsFEWithIds: PlotPlant[] = [] //plants from frontend with ids
    const plantsIDs = await getPlantsIds(plotsToUpdate)
    if (plotsToUpdate.length > 0) {
      plotsToUpdate.forEach((plot) => {
        if (plot.plants.length > 0) {
          plot.plants.forEach((plant) => {
            if (plant.id) {
              plantsFEWithIds.push(plant)
            } else {
              const newPlant = {
                plant_id: plantsIDs.find(
                  (currentPlant) =>
                    currentPlant.name.toLowerCase() ===
                    plant.plantName.toLowerCase(),
                )?.id,
                user_id: user.id,
                plot_id: plot.id,
                date_planted: plant.date_planted,
                name: plant.name,
              }
              plantsToInsert.push(newPlant)
            }
          })
        }
      })

      const plantIDsToDelete = await getAllPlantsInGarden(
        garden_id,
        plantsFEWithIds,
      )
      await db.deletePlotsPlantsByID(plantIDsToDelete)

      if (plantsToInsert.length > 0) {
        db.saveNewPlants(plantsToInsert)
      }
    }

    res
      .json({
        message: `Garden ${garden_id} was successfully updated in the database.`,
      })
      .status(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Authenticated route for refreshing and retrieving tasks for user
router.put('/tasks', checkJwt, async (req: JwtRequest, res) => {
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  else
    try {
      const currentDate = new Date()
      const plotsPlants = await db.getPlotsPlantsJoinByAuth(auth0Id)
      console.log(`plotsPlants join data is:`, plotsPlants)
      const existingUncompletedTasks =
        await db.getUncompletedTasksByAuth(auth0Id)

      const { tasksToUpdate, tasksToCreate } = refreshTasks(
        plotsPlants,
        existingUncompletedTasks,
        currentDate,
      )

      await db.updateTasks(tasksToUpdate)
      await db.createTasks(tasksToCreate)
      console.log(tasksToUpdate)
      console.log(tasksToCreate)
      const refreshedTasks = await db.getUpdatedTasksByAuth(auth0Id)
      console.log(refreshedTasks)
      res.json(refreshedTasks)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
})

// Authenticated route for completing task
router.patch('/tasks/:id', checkJwt, async (req: JwtRequest, res) => {
  const { id } = req.params
  // console.log(`task id ${id}`)
  const auth0Id = req.auth?.sub
  if (!auth0Id) return res.sendStatus(401)
  else
    try {
      const currentDate = new Date()

      // console.log('try block hit')
      const completedConfirmation = await db.completeTask(
        Number(id),
        currentDate,
      )
      res.json(completedConfirmation)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
})

// For testing tasks route:
// 1) npm run knex seed:run
// 2) Make a GET request to localhost:3000/api/v1/tasksTEST2 using Thunderclient; expect first entry to be:
// {
//   "id": 1,
//   "type": "water",
//   "plots_plants_id": 1,
//   "overdue_by": 0,
//   "completed": 0
// }
// 3) Make a PUT request to localhost:3000/api/v1/tasksTEST3 using Thunderclient; expect overdue_by of first entry to be 465

// Route for testing only - returns PlotsPlantsJoin for auth0_id user auth0|123
router.get('/tasksTEST1', async (req, res) => {
  try {
    const plotsPlants = await db.getPlotsPlantsJoinByAuth('auth0|456')
    res.json(plotsPlants)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Route for testing only - returns tasks for auth0_id user auth0|123
router.get('/tasksTEST2', async (req, res) => {
  try {
    const plotsPlants = await db.getUpdatedTasksByAuth('auth0|456')
    res.json(plotsPlants)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// Route for testing only - refreshes and retrives tasks for auth0_id user auth0|123
router.put('/tasksTEST3', async (req, res) => {
  const auth0Id = 'auth0|456'
  if (!auth0Id) return res.sendStatus(401)
  else
    try {
      const currentDate = new Date()
      const plotsPlants = await db.getPlotsPlantsJoinByAuth(auth0Id)
      const existingTasks = await db.getUncompletedTasksByAuth(auth0Id)

      const { tasksToUpdate, tasksToCreate } = refreshTasks(
        plotsPlants,
        existingTasks,
        currentDate,
      )

      await db.updateTasks(tasksToUpdate)
      await db.createTasks(tasksToCreate)

      const refreshedTasks = await db.getUpdatedTasksByAuth(auth0Id)
      res.json(refreshedTasks)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
})

export default router

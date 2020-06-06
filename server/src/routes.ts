import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import { celebrate , Joi } from 'celebrate'

import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const router = express.Router()

const upload = multer(multerConfig)

const pointsController = new PointsController()
const itemsController = new ItemsController()

router.get('/items', itemsController.index)
router.get('/points/:id', pointsController.show)
router.get('/points', pointsController.index)

router.post('/points',upload.single('image'), 
celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        items: Joi.string().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        email: Joi.string().required().email(),

    })
}, { abortEarly: false }),
pointsController.create)

export default router

// Service Pattern
// Repository Pattern